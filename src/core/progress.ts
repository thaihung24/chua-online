/**
 * Tiến độ tu tập: tinh tấn (xp), cấp, chuỗi giữ lửa + ngày nghỉ, việc hôm nay, dấu ấn, thống kê trọn đời.
 * Lưu localStorage qua @/core/store (khoá `progress`, phiên bản v:1). "Ngày" = ngày giờ Việt Nam.
 * `now` có thể tiêm vào để kiểm thử. Mọi dữ liệu đọc vào đều được làm sạch (không tin dữ liệu ngoài).
 */
import { TIERS } from './contracts';
import type { ActivityKind, AppEvents, DailyTask, Emitter, ProgressApi, ProgressView, SpotId, UnlockFeature } from './contracts';
import { load, save, vnDayKey } from './store';
import { solarToLunar, todayVN } from './lunar';
import {
  DEFAULT_MAX_UNITS, EXTRA_CAP, MAX_LEVEL, MAX_SECONDS_PER_CALL, MAX_UNITS_PER_CALL, PRACTICE_CAP, REST_DAY_EVERY, REST_DAY_MAX,
  SECONDS_BUCKET_CAP, SECONDS_BUCKET_START, SECONDS_REFILL_RATE, SPOT_LABELS, STREAK_MILESTONES, TASK_ALL_BONUS, TASK_TEMPLATES,
  TASK_XP, UNLOCK_INFO, XP_TABLE, evaluateStamps, pickTasks, taskLabel, xpNeeded,
} from './quests';
import type { PickedTask } from './quests';

// ───────────────────────── Cấp ─────────────────────────
/** CUM[n] = tổng xp cần để đạt cấp n (CUM[1] = 0). */
const CUM: number[] = (() => {
  const a = [0, 0];
  for (let n = 1; n < MAX_LEVEL; n++) a.push(a[n] + xpNeeded(n));
  return a;
})();
const MAX_XP = CUM[MAX_LEVEL];

/** Cấp ứng với tổng xp (tìm nhị phân). */
export function levelFromXp(xp: number): number {
  let lo = 1;
  let hi = MAX_LEVEL;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (CUM[mid] <= xp) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
/** Tổng xp tối thiểu để đạt cấp `level`. */
export function xpForLevel(level: number): number {
  return CUM[Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)))];
}

// ───────────────────────── Trạng thái lưu ─────────────────────────
interface DayState {
  key: string;
  counts: Record<string, number>;
  practiceXp: number;
  extraXp: number;
  spots: string[];
  tasks: PickedTask[];
  taskDone: string[];
  allBonus: boolean;
  lit: boolean;
}
interface State {
  v: 1;
  xp: number;
  streak: number;
  best: number;
  lastLit: string;
  restDays: number;
  restAcc: number;
  milestones: number[];
  stamps: string[];
  life: Record<string, number>;
  spotsEver: string[];
  rem: Record<string, number>;
  day: DayState;
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const SPOT_IDS = Object.keys(SPOT_LABELS);
const TEMPLATE_IDS = new Set(TASK_TEMPLATES.map((t) => t.id));

function emptyDay(key: string): DayState {
  return { key, counts: {}, practiceXp: 0, extraXp: 0, spots: [], tasks: [], taskDone: [], allBonus: false, lit: false };
}
function emptyState(dayKey: string): State {
  return {
    v: 1, xp: 0, streak: 0, best: 0, lastLit: '', restDays: 0, restAcc: 0,
    milestones: [], stamps: [], life: {}, spotsEver: [], rem: {}, day: emptyDay(dayKey),
  };
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
function num(x: unknown, min: number, max: number, def = 0): number {
  return typeof x === 'number' && Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : def;
}
function intNum(x: unknown, min: number, max: number, def = 0): number {
  return Math.floor(num(x, min, max, def));
}
function strArr(x: unknown, max = 200): string[] {
  if (!Array.isArray(x)) return [];
  const out: string[] = [];
  for (const v of x) if (typeof v === 'string' && v.length <= 40 && !out.includes(v)) out.push(v);
  return out.slice(0, max);
}
function numRecord(x: unknown, max = 1e9): Record<string, number> {
  const out: Record<string, number> = {};
  if (!isObj(x)) return out;
  for (const [k, v] of Object.entries(x)) {
    if (k.length <= 40 && typeof v === 'number' && Number.isFinite(v) && v >= 0) out[k] = Math.min(max, v);
  }
  return out;
}

function sanitizeDay(raw: unknown): DayState | null {
  if (!isObj(raw) || typeof raw.key !== 'string' || !DAY_RE.test(raw.key)) return null;
  const tasks: PickedTask[] = [];
  if (Array.isArray(raw.tasks)) {
    for (const t of raw.tasks) {
      if (!isObj(t) || typeof t.id !== 'string' || !TEMPLATE_IDS.has(t.id) || tasks.some((x) => x.id === t.id)) continue;
      const spot = typeof t.spot === 'string' && SPOT_IDS.includes(t.spot) ? (t.spot as SpotId) : undefined;
      tasks.push(spot ? { id: t.id, spot } : { id: t.id });
    }
  }
  return {
    key: raw.key,
    counts: numRecord(raw.counts, 1e6),
    practiceXp: intNum(raw.practiceXp, 0, PRACTICE_CAP),
    extraXp: intNum(raw.extraXp, 0, EXTRA_CAP),
    spots: strArr(raw.spots, 12),
    tasks: tasks.slice(0, 3),
    taskDone: strArr(raw.taskDone, 8),
    allBonus: raw.allBonus === true,
    lit: raw.lit === true,
  };
}

/** Làm sạch trạng thái đọc từ bên ngoài. Trả null nếu không dùng được. */
function sanitizeState(raw: unknown): State | null {
  if (!isObj(raw) || raw.v !== 1) return null;
  const day = sanitizeDay(raw.day) ?? emptyDay('');
  const lastLit = typeof raw.lastLit === 'string' && DAY_RE.test(raw.lastLit) ? raw.lastLit : '';
  const streak = intNum(raw.streak, 0, 100_000);
  return {
    v: 1,
    xp: intNum(raw.xp, 0, MAX_XP),
    streak,
    best: Math.max(streak, intNum(raw.best, 0, 100_000)),
    lastLit,
    restDays: intNum(raw.restDays, 0, REST_DAY_MAX),
    restAcc: intNum(raw.restAcc, 0, REST_DAY_EVERY - 1),
    milestones: Array.isArray(raw.milestones)
      ? [...new Set(raw.milestones.filter((m): m is number => STREAK_MILESTONES.some((s) => s.days === m)))]
      : [],
    stamps: strArr(raw.stamps, 100),
    life: numRecord(raw.life),
    spotsEver: strArr(raw.spotsEver, 12).filter((s) => SPOT_IDS.includes(s)),
    rem: numRecord(raw.rem, 1e6),
    day,
  };
}

const dayIndex = (key: string): number => {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
};
/** Số ngày từ a đến b (b − a), theo khoá ngày YYYY-MM-DD. */
const daysBetween = (a: string, b: string): number => dayIndex(b) - dayIndex(a);

// ───────────────────────── createProgress ─────────────────────────
export interface ProgressOptions {
  storageKey?: string;
  now?: () => number;
  /** Nếu có: phát 'progress' và 'levelUp' lên bus chung của ứng dụng. */
  bus?: Emitter<AppEvents>;
}
export type ProgressInstance = ProgressApi & { dispose(): void };

export function createProgress(opts: ProgressOptions = {}): ProgressInstance {
  const key = opts.storageKey ?? 'progress';
  const now = opts.now ?? (() => Date.now());
  const bus = opts.bus;
  const dayKeyNow = (): string => vnDayKey(new Date(now()));

  let s: State = sanitizeState(load<unknown>(key, null)) ?? emptyState(dayKeyNow());
  const listeners = new Set<(v: ProgressView) => void>();
  /** Bộ nhớ tạm (không lưu): lần ghi gần nhất và "giây tín dụng" cho các loại *Seconds. */
  const lastAt = new Map<string, number>();
  const bucket = new Map<string, { tokens: number; ts: number }>();

  /** Sang ngày mới thì dựng lại phần ngày (chọn việc hôm nay). Trả true nếu có thay đổi. */
  function roll(): boolean {
    const today = dayKeyNow();
    if (s.day.key === today && s.day.tasks.length) return false;
    if (s.day.key !== today) s.day = emptyDay(today);
    s.day.tasks = pickTasks(today, levelFromXp(s.xp));
    return true;
  }
  roll();

  function persist(): void {
    save(key, s);
  }

  // ── Việc hôm nay ──
  function tasksView(): { tasks: DailyTask[]; done: number } {
    const tasks: DailyTask[] = [];
    for (const p of s.day.tasks) {
      const tpl = TASK_TEMPLATES.find((t) => t.id === p.id);
      if (!tpl) continue;
      const raw = tpl.kind === 'walkSpot' ? (p.spot && s.day.spots.includes(p.spot) ? 1 : 0) : s.day.counts[tpl.kind] ?? 0;
      const progress = Math.min(tpl.target, Math.floor(raw));
      tasks.push({
        id: p.spot ? `${tpl.id}:${p.spot}` : tpl.id,
        label: taskLabel(tpl, p.spot),
        kind: tpl.kind,
        target: tpl.target,
        done: progress >= tpl.target,
        progress,
        action: p.spot ?? tpl.action,
        xp: TASK_XP,
      });
    }
    return { tasks, done: tasks.filter((t) => t.done).length };
  }

  /** Cộng thưởng cho việc vừa hoàn thành; trả xp thưởng. */
  function settleTasks(): number {
    let gain = 0;
    const { tasks } = tasksView();
    for (const t of tasks) {
      if (t.done && !s.day.taskDone.includes(t.id)) {
        s.day.taskDone.push(t.id);
        gain += TASK_XP;
      }
    }
    if (!s.day.allBonus && tasks.length > 0 && tasks.every((t) => t.done)) {
      s.day.allBonus = true;
      gain += TASK_ALL_BONUS;
    }
    return gain;
  }

  // ── Chuỗi giữ lửa ──
  function lightDay(t: number): number {
    const today = s.day.key;
    s.day.lit = true;
    s.life.practiceDays = (s.life.practiceDays ?? 0) + 1;
    try {
      const tv = todayVN(new Date(t));
      const lu = solarToLunar(tv.y, tv.m, tv.d);
      if (lu.day === 1 || lu.day === 15) s.life.specialDays = (s.life.specialDays ?? 0) + 1;
    } catch {
      /* ngoài khoảng hỗ trợ của lịch âm: bỏ qua */
    }
    const gap = s.lastLit ? daysBetween(s.lastLit, today) : 1;
    if (gap >= 1) {
      if (!s.lastLit || gap === 1) s.streak += 1;
      else {
        const missed = gap - 1;
        if (s.restDays >= missed) {
          s.restDays -= missed;
          s.streak += 1;
        } else s.streak = 1;
      }
      s.lastLit = today;
    }
    s.restAcc += 1;
    if (s.restAcc >= REST_DAY_EVERY) {
      s.restAcc = 0;
      s.restDays = Math.min(REST_DAY_MAX, s.restDays + 1);
    }
    s.best = Math.max(s.best, s.streak);
    let bonus = 0;
    for (const m of STREAK_MILESTONES) {
      if (s.streak >= m.days && !s.milestones.includes(m.days)) {
        s.milestones.push(m.days);
        bonus += m.xp;
      }
    }
    return bonus;
  }

  // ── View ──
  function view(): ProgressView {
    if (roll()) persist();
    const level = levelFromXp(s.xp);
    const into = s.xp - CUM[level];
    const need = level >= MAX_LEVEL ? 0 : xpNeeded(level);
    const today = s.day.key;
    const gap = s.lastLit ? daysBetween(s.lastLit, today) : 0;
    const alive = !!s.lastLit && (gap <= 1 || s.restDays >= gap - 1);
    const streak = alive ? s.streak : 0;
    const tv = tasksView();
    let tier = TIERS[0];
    for (const t of TIERS) if (level >= t.minLevel) tier = t;
    return {
      level, tier, xp: s.xp, xpIntoLevel: into, xpForNext: need, frac: need > 0 ? Math.min(1, into / need) : 1,
      streak, best: Math.max(s.best, streak), litToday: s.day.lit, restDays: s.restDays,
      tasks: tv.tasks, tasksDone: tv.done,
      practiceToday: s.day.practiceXp, practiceCap: PRACTICE_CAP,
      stamps: [...s.stamps],
    };
  }

  function emit(levelUpTo?: number): void {
    const v = view();
    for (const fn of [...listeners]) {
      try {
        fn(v);
      } catch (err) {
        console.error('[progress] lỗi trong hàm lắng nghe', err);
      }
    }
    if (bus) {
      bus.emit('progress', v);
      if (levelUpTo) bus.emit('levelUp', { level: levelUpTo, tier: v.tier });
    }
  }

  // ── Ghi nhận ──
  function record(kind: ActivityKind, amount?: number, meta?: { spot?: SpotId }): { xp: number; levelUp?: number; stamp?: string[] } {
    const rule = XP_TABLE[kind];
    if (!rule) return { xp: 0 };
    const t = now();
    const rolled = roll();
    const amt = typeof amount === 'number' && Number.isFinite(amount) ? amount : 1;
    let units = 0;
    let remainder: number | null = null;

    if (rule.unitSeconds) {
      // Loại tính theo thời gian: giới hạn theo thời gian thật, cộng dồn phần lẻ.
      let secs = Math.min(MAX_SECONDS_PER_CALL, Math.max(0, amt));
      const b = bucket.get(kind) ?? { tokens: SECONDS_BUCKET_START, ts: t };
      const tokens = Math.min(SECONDS_BUCKET_CAP, b.tokens + Math.max(0, (t - b.ts) / 1000) * SECONDS_REFILL_RATE);
      secs = Math.min(secs, tokens);
      if (secs <= 0) {
        bucket.set(kind, { tokens, ts: t });
        if (rolled) persist();
        return { xp: 0 };
      }
      bucket.set(kind, { tokens: tokens - secs, ts: t });
      const total = (s.rem[kind] ?? 0) + secs;
      units = Math.floor(total / rule.unitSeconds);
      remainder = total - units * rule.unitSeconds;
    } else if (kind === 'visit') {
      if ((s.day.counts.visit ?? 0) >= 1) return { xp: 0 };
      units = 1;
    } else if (kind === 'walkSpot') {
      const spot = meta?.spot ?? 'unknown';
      if (s.day.spots.includes(spot)) return { xp: 0 };
      const prev = lastAt.get(kind);
      if (prev !== undefined && t - prev >= 0 && t - prev < rule.minGapMs) return { xp: 0 };
      s.day.spots.push(spot);
      if (SPOT_IDS.includes(spot) && !s.spotsEver.includes(spot)) s.spotsEver.push(spot);
      units = 1;
    } else {
      const prev = lastAt.get(kind);
      if (prev !== undefined && t - prev >= 0 && t - prev < rule.minGapMs) {
        if (rolled) persist();
        return { xp: 0 };
      }
      units = Math.max(1, Math.min(MAX_UNITS_PER_CALL[kind] ?? DEFAULT_MAX_UNITS, Math.floor(amt)));
    }
    lastAt.set(kind, t);

    const levelBefore = levelFromXp(s.xp);
    let gain = 0;
    if (remainder !== null) s.rem[kind] = remainder;

    if (units > 0) {
      const c0 = s.day.counts[kind] ?? 0;
      const c1 = c0 + units;
      s.day.counts[kind] = c1;
      s.life[rule.life] = (s.life[rule.life] ?? 0) + units;
      const rewardUnits = Math.max(0, Math.min(c1, rule.limit) - Math.min(c0, rule.limit));
      let raw = rewardUnits * rule.xp;
      if (rule.pool === 'practice') {
        raw = Math.min(raw, PRACTICE_CAP - s.day.practiceXp);
        s.day.practiceXp += raw;
        gain += raw;
      } else if (rule.pool === 'extra') {
        raw = Math.min(raw, EXTRA_CAP - s.day.extraXp);
        s.day.extraXp += raw;
        gain += raw;
      }
    }
    // Thời gian chưa đủ 1 phút vẫn là công phu: thắp lửa trong ngày.
    if (kind !== 'visit' && !s.day.lit) gain += lightDay(t);
    gain += settleTasks();

    s.xp = Math.min(MAX_XP, s.xp + gain);
    const fresh = evaluateStamps({ life: s.life, spotsEver: s.spotsEver, best: s.best, level: levelFromXp(s.xp) }).filter((id) => !s.stamps.includes(id));
    if (fresh.length) s.stamps.push(...fresh);

    const levelAfter = levelFromXp(s.xp);
    persist();
    emit(levelAfter > levelBefore ? levelAfter : undefined);
    const out: { xp: number; levelUp?: number; stamp?: string[] } = { xp: gain };
    if (levelAfter > levelBefore) out.levelUp = levelAfter;
    if (fresh.length) out.stamp = fresh;
    return out;
  }

  // ── Đồng bộ ──
  function exportState(): unknown {
    roll();
    return JSON.parse(JSON.stringify(s)) as unknown;
  }

  /** Hợp nhất trạng thái từ máy chủ/thiết bị khác vào hiện tại — không bao giờ hạ cấp hay mất dấu ấn. */
  function mergeInto(a: State, b: State): State {
    const m: State = JSON.parse(JSON.stringify(a)) as State;
    m.xp = Math.max(a.xp, b.xp);
    if (b.lastLit && (!a.lastLit || b.lastLit > a.lastLit)) {
      m.streak = b.streak; m.lastLit = b.lastLit; m.restDays = b.restDays; m.restAcc = b.restAcc;
    } else if (b.lastLit && b.lastLit === a.lastLit) {
      m.streak = Math.max(a.streak, b.streak); m.restDays = Math.max(a.restDays, b.restDays); m.restAcc = Math.max(a.restAcc, b.restAcc);
    }
    m.best = Math.max(a.best, b.best, m.streak);
    m.milestones = [...new Set([...a.milestones, ...b.milestones])];
    m.stamps = [...new Set([...a.stamps, ...b.stamps])];
    m.spotsEver = [...new Set([...a.spotsEver, ...b.spotsEver])];
    m.life = { ...b.life };
    for (const [k, v] of Object.entries(a.life)) m.life[k] = Math.max(v, b.life[k] ?? 0);
    if (b.day.key > a.day.key) m.day = JSON.parse(JSON.stringify(b.day)) as DayState;
    else if (b.day.key === a.day.key) {
      const d = m.day;
      for (const [k, v] of Object.entries(b.day.counts)) d.counts[k] = Math.max(d.counts[k] ?? 0, v);
      d.practiceXp = Math.max(a.day.practiceXp, b.day.practiceXp);
      d.extraXp = Math.max(a.day.extraXp, b.day.extraXp);
      d.spots = [...new Set([...a.day.spots, ...b.day.spots])];
      if (!d.tasks.length) d.tasks = b.day.tasks;
      d.taskDone = [...new Set([...a.day.taskDone, ...b.day.taskDone])];
      d.allBonus = a.day.allBonus || b.day.allBonus;
      d.lit = a.day.lit || b.day.lit;
    }
    return m;
  }

  function importState(state: unknown): void {
    const inc = sanitizeState(state);
    if (!inc) return;
    s = mergeInto(s, inc);
    roll();
    const stamps = evaluateStamps({ life: s.life, spotsEver: s.spotsEver, best: s.best, level: levelFromXp(s.xp) });
    for (const id of stamps) if (!s.stamps.includes(id)) s.stamps.push(id);
    persist();
    emit();
  }

  // ── Giữa các thẻ trình duyệt ──
  const onStorage = (e: StorageEvent): void => {
    if (e.key !== null && !e.key.endsWith(`:${key}`)) return;
    const fresh = sanitizeState(load<unknown>(key, null));
    if (!fresh) return;
    s = mergeInto(s, fresh);
    roll();
    emit();
  };
  const hasWindow = typeof window !== 'undefined' && typeof window.addEventListener === 'function';
  if (hasWindow) window.addEventListener('storage', onStorage);

  return {
    record,
    view,
    unlockLevel: (f: UnlockFeature) => UNLOCK_INFO[f].level,
    isUnlocked: (f: UnlockFeature) => levelFromXp(s.xp) >= UNLOCK_INFO[f].level,
    onChange(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    exportState,
    importState,
    dispose() {
      listeners.clear();
      if (hasWindow) window.removeEventListener('storage', onStorage);
    },
  };
}
