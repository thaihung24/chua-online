/** Kiểm thử tiến độ: trần ngày, cấp, chuỗi + ngày nghỉ, việc hôm nay, dấu ấn, lưu/đồng bộ, chống gian lận. */
import { describe, expect, it } from 'vitest';
import { DAY_MS, TIERS } from '@/core/contracts';
import type { ActivityKind, DailyTask, ProgressView, UnlockFeature } from '@/core/contracts';
import { createEmitter } from '@/core/bus';
import type { AppEvents } from '@/core/contracts';
import { save } from '@/core/store';
import { createProgress, levelFromXp, xpForLevel } from '@/core/progress';
import { PRACTICE_CAP, UNLOCK_INFO, XP_TABLE, pickTasks, xpNeeded } from '@/core/quests';

let seq = 0;
/** Tạo tiến độ độc lập (khoá lưu riêng) với đồng hồ giả. Mặc định 12:00 giờ VN, 20/6/2025 (ngày thường, không phải rằm/mùng một). */
function make(opts: { start?: number; key?: string } = {}) {
  let t = opts.start ?? Date.UTC(2025, 5, 20, 5, 0, 0);
  const key = opts.key ?? `test-progress-${++seq}`;
  const mk = () => createProgress({ storageKey: key, now: () => t });
  const p = mk();
  return {
    p, key, mk,
    adv: (ms: number) => (t += ms),
    set: (v: number) => (t = v),
    time: () => t,
  };
}
const day = (y: number, m: number, d: number, h = 12) => Date.UTC(y, m - 1, d, h - 7, 0, 0);

/** Làm đúng một việc hôm nay (dùng đồng hồ của `c`). Trả tổng xp. */
function doTask(c: ReturnType<typeof make>, task: DailyTask): number {
  let xp = 0;
  c.adv(30_000);
  if (task.kind === 'custom') return 0;
  if (task.kind === 'walkSpot') {
    xp += c.p.record('walkSpot', 1, { spot: task.action as 'yard' }).xp;
  } else if (task.kind.endsWith('Seconds')) {
    xp += c.p.record(task.kind, task.target * 60).xp;
  } else {
    xp += c.p.record(task.kind, task.target).xp;
  }
  return xp;
}

describe('progress: khởi tạo & cấp', () => {
  it('người mới: cấp 1, 0 tinh tấn, 3 việc, trần 200', () => {
    const { p } = make();
    const v = p.view();
    expect(v.level).toBe(1);
    expect(v.xp).toBe(0);
    expect(v.tier).toBe(TIERS[0]);
    expect(v.tasks).toHaveLength(3);
    expect(v.tasksDone).toBe(0);
    expect(v.practiceCap).toBe(200);
    expect(v.practiceToday).toBe(0);
    expect(v.streak).toBe(0);
    expect(v.litToday).toBe(false);
    expect(v.stamps).toEqual([]);
    expect(v.xpForNext).toBe(50);
    expect(v.frac).toBe(0);
  });

  it('công thức cấp: n→n+1 = round(50 + 25(n-1) + 4(n-1)^1.5)', () => {
    expect(xpNeeded(1)).toBe(50);
    expect(xpNeeded(2)).toBe(79);
    expect(xpNeeded(10)).toBe(Math.round(50 + 225 + 4 * 27));
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(50);
    expect(xpForLevel(3)).toBe(50 + 79);
    expect(levelFromXp(49)).toBe(1);
    expect(levelFromXp(50)).toBe(2);
    expect(levelFromXp(128)).toBe(2);
    expect(levelFromXp(129)).toBe(3);
    expect(levelFromXp(Number.MAX_SAFE_INTEGER)).toBe(999);
  });

  it('cấp tối đa 999, xpForNext = 0, frac = 1', () => {
    const { p } = make();
    p.importState({ v: 1, xp: 1e12 });
    const v = p.view();
    expect(v.level).toBe(999);
    expect(v.xpForNext).toBe(0);
    expect(v.frac).toBe(1);
  });

  it('lên cấp trả levelUp, tier đổi đúng mốc', () => {
    const c = make();
    c.p.importState({ v: 1, xp: 45 });
    const r = c.p.record('incense');
    expect(r.xp).toBeGreaterThanOrEqual(12);
    expect(r.levelUp).toBe(2);
    const v = c.p.view();
    expect(v.level).toBe(2);
    expect(v.xpIntoLevel).toBe(v.xp - 50);
    expect(v.xpForNext).toBe(79);
    c.p.importState({ v: 1, xp: xpForLevel(5) });
    expect(c.p.view().tier.name).toBe('Mầm sen');
    c.p.importState({ v: 1, xp: xpForLevel(50) });
    expect(c.p.view().tier.name).toBe('Sen ngàn cánh');
    c.p.importState({ v: 1, xp: xpForLevel(30) });
    expect(c.p.view().tier.name).toBe('Sen ngàn cánh'); // không hạ cấp
  });

  it('một lần ghi có thể lên nhiều cấp: levelUp là cấp mới', () => {
    const c = make();
    c.p.importState({ v: 1, xp: 0 });
    c.p.importState({ v: 1, xp: xpForLevel(3) - 5 });
    expect(c.p.view().level).toBe(2);
    expect(c.p.record('beadsRound').levelUp).toBe(3);
  });
});

describe('progress: bảng tinh tấn, giới hạn ngày, trần', () => {
  it('visit: +10, mỗi ngày một lần, không thắp lửa', () => {
    const c = make();
    expect(c.p.record('visit').xp).toBe(10);
    expect(c.p.record('visit').xp).toBe(0);
    expect(c.p.view().litToday).toBe(false);
    c.adv(DAY_MS);
    expect(c.p.record('visit').xp).toBe(10);
  });

  it('mỗi loại đúng xp theo bảng', () => {
    const expected: [ActivityKind, number][] = [
      ['pray', 3], ['bow', 6], ['incense', 12], ['flowers', 10], ['candle', 8], ['bell', 4], ['lantern', 15], ['que', 10],
      ['beadsRound', 20], ['chantDone', 25], ['sweepRound', 12], ['release', 15], ['loc', 10], ['wish', 10], ['today', 5],
      ['greet', 2], ['quanam', 8], ['chickenRescue', 18], ['chickenFeed', 10],
    ];
    for (const [k, xp] of expected) {
      const c = make({ start: day(2025, 6, 20) });
      // Chọn trước các việc để loại việc thưởng khỏi phép so sánh: dùng bản view để biết có trùng không.
      const tasks = c.p.view().tasks;
      const r = c.p.record(k);
      const bonus = tasks.some((t) => t.kind === k && t.target <= 1) ? 30 : 0;
      const allBonus = 0;
      expect(r.xp - bonus - allBonus, k).toBe(xp);
      expect(XP_TABLE[k].xp).toBe(xp);
    }
  });

  it('bow: tối đa 10 lạy tính xp/ngày (=60), vẫn đếm tiếp', () => {
    const c = make();
    let total = 0;
    for (let i = 0; i < 14; i++) {
      c.adv(2000);
      total += c.p.record('bow').xp;
    }
    // 10 lạy × 6 = 60 xp; việc "Lạy Phật 3 lạy" (nếu có) cộng thưởng riêng.
    const bonus = c.p.view().tasks.some((t) => t.kind === 'bow') ? 30 : 0;
    expect(total).toBe(60 + bonus + (bonus && c.p.view().tasksDone === 3 ? 30 : 0));
    expect(c.p.view().practiceToday).toBe(60);
  });

  it('giới hạn theo ngày của từng loại: incense ≤3, flowers ≤2, que 1', () => {
    const c = make();
    for (let i = 0; i < 6; i++) {
      c.adv(5000);
      c.p.record('incense');
      c.p.record('flowers');
      c.p.record('que');
    }
    expect(c.p.view().practiceToday).toBe(3 * 12 + 2 * 10 + 10);
  });

  it('amount nhiều đơn vị một lần: bow x3 = 18', () => {
    const c = make();
    c.p.record('bow', 3);
    expect(c.p.view().practiceToday).toBe(18);
  });

  it('trần công phu 200/ngày: không vượt, thiền thêm không tăng', () => {
    const c = make();
    for (let i = 0; i < 40; i++) {
      c.adv(60_000);
      c.p.record('meditateSeconds', 60);
    }
    const v = c.p.view();
    expect(v.practiceToday).toBe(PRACTICE_CAP);
    c.adv(60_000);
    const r = c.p.record('meditateSeconds', 60);
    expect(r.xp).toBe(0);
    expect(c.p.view().practiceToday).toBe(PRACTICE_CAP);
    // sang ngày mới: trần làm mới
    c.adv(DAY_MS);
    expect(c.p.view().practiceToday).toBe(0);
    c.adv(60_000);
    expect(c.p.record('meditateSeconds', 60).xp).toBeGreaterThanOrEqual(8);
  });

  it('trần chặn xp một phần: còn 5 thì chỉ nhận 5', () => {
    const c = make();
    // Cố ý nạp tới 195 bằng thiền (8/phút → 24 phút = 192, +3 pray)
    for (let i = 0; i < 24; i++) {
      c.adv(60_000);
      c.p.record('meditateSeconds', 60);
    }
    expect(c.p.view().practiceToday).toBe(192);
    c.adv(5000);
    c.p.record('incense'); // +12 nhưng còn 8
    expect(c.p.view().practiceToday).toBe(200);
  });

  it('"công phu thêm" (ghé chùa + cùng công phu) có trần 60 riêng, ngoài trần chính', () => {
    const c = make();
    expect(c.p.record('visit').xp).toBe(10);
    expect(c.p.record('communitySeconds', 300).xp).toBe(30);
    c.adv(300_000);
    expect(c.p.record('communitySeconds', 300).xp).toBe(20); // còn 20/60
    c.adv(300_000);
    expect(c.p.record('communitySeconds', 300).xp).toBe(0);
    expect(c.p.view().practiceToday).toBe(0);
  });

  it('thời gian: cộng dồn phần lẻ, quy đổi theo phút trọn', () => {
    const c = make();
    expect(c.p.record('sitSeconds', 30).xp).toBe(0);
    c.adv(30_000);
    expect(c.p.record('sitSeconds', 30).xp).toBeGreaterThanOrEqual(2);
    expect(c.p.view().practiceToday).toBe(2);
    c.adv(45_000);
    c.p.record('sitSeconds', 45); // dư 45s → chưa đủ phút
    expect(c.p.view().practiceToday).toBe(2);
    c.adv(20_000);
    c.p.record('sitSeconds', 20); // 65s → 1 phút
    expect(c.p.view().practiceToday).toBe(4);
  });

  it('phần dư giây được lưu qua tải lại', () => {
    const c = make();
    c.p.record('listenSeconds', 40);
    const q = c.mk();
    c.adv(30_000);
    q.record('listenSeconds', 30); // 40 + 30 = 70s → 1 phút
    expect(q.view().practiceToday).toBe(3);
  });

  it('walkSpot: mỗi điểm khác nhau một lần/ngày, tối đa 6 điểm', () => {
    const c = make();
    const spots = ['yard', 'bodhi', 'meditate', 'quanam', 'well', 'hall'] as const;
    let total = 0;
    for (const s of spots) {
      c.adv(1500);
      total += c.p.record('walkSpot', 1, { spot: s }).xp;
    }
    expect(c.p.view().practiceToday).toBe(36);
    expect(total).toBeGreaterThanOrEqual(36);
    c.adv(1500);
    expect(c.p.record('walkSpot', 1, { spot: 'yard' }).xp).toBe(0);
    c.adv(DAY_MS);
    c.adv(1500);
    c.p.record('walkSpot', 1, { spot: 'yard' });
    expect(c.p.view().practiceToday).toBe(6);
  });

  it('beads (từng hạt) không có xp nhưng thắp lửa', () => {
    const c = make();
    expect(c.p.record('beads', 20).xp).toBe(0);
    expect(c.p.view().litToday).toBe(true);
  });

  it('mọi ActivityKind đều có quy tắc', () => {
    const kinds: ActivityKind[] = [
      'visit', 'pray', 'bow', 'incense', 'flowers', 'candle', 'bell', 'lantern', 'que', 'beadsRound', 'chantDone', 'meditateSeconds',
      'sitSeconds', 'sweepRound', 'walkSpot', 'release', 'loc', 'wish', 'listenSeconds', 'communitySeconds', 'today', 'greet', 'quanam',
      'mindfulSeconds', 'beads', 'chickenRescue', 'chickenFeed',
    ];
    for (const k of kinds) expect(XP_TABLE[k], k).toBeTruthy();
  });

  it('một ngày công phu đầy đủ ≈ 150–200 tinh tấn (công phu chính)', () => {
    const c = make();
    const plan: [ActivityKind, number][] = [
      ['pray', 3], ['bow', 6], ['incense', 3], ['flowers', 2], ['candle', 2], ['bell', 3], ['lantern', 1], ['beadsRound', 3], ['chantDone', 1],
    ];
    for (const [k, n] of plan) {
      c.adv(30_000);
      c.p.record(k, n);
    }
    for (let i = 0; i < 10; i++) {
      c.adv(60_000);
      c.p.record('meditateSeconds', 60);
    }
    const v = c.p.view();
    expect(v.practiceToday).toBeGreaterThanOrEqual(150);
    expect(v.practiceToday).toBeLessThanOrEqual(200);
  });
});

describe('progress: chống gian lận', () => {
  it('ghi cùng loại quá nhanh bị bỏ', () => {
    const c = make();
    expect(c.p.record('bow').xp).toBe(6);
    expect(c.p.record('bow').xp).toBe(0);
    c.adv(500);
    expect(c.p.record('bow').xp).toBe(0);
    c.adv(1000);
    expect(c.p.record('bow').xp).toBe(6);
  });

  it('vòng tràng hạt/kinh có khoảng cách tối thiểu dài hơn', () => {
    const c = make();
    expect(c.p.record('beadsRound').xp).toBeGreaterThanOrEqual(20);
    c.adv(5000);
    expect(c.p.record('beadsRound').xp).toBe(0);
    c.adv(11_000);
    expect(c.p.record('beadsRound').xp).toBeGreaterThanOrEqual(20);
  });

  it('amount bất thường bị chặn (âm, NaN, khổng lồ)', () => {
    const c = make();
    c.p.record('bow', Number.NaN);
    expect(c.p.view().practiceToday).toBe(6); // NaN → 1
    c.adv(2000);
    c.p.record('bow', 1e9);
    expect(c.p.view().practiceToday).toBe(6 * 10); // tối đa 10 đơn vị/lần, giới hạn ngày 10
    c.adv(2000);
    expect(c.p.record('meditateSeconds', -100).xp).toBe(0);
    expect(c.p.record('meditateSeconds', Number.NaN).xp).toBe(0);
    expect(c.p.record('meditateSeconds', Number.POSITIVE_INFINITY).xp).toBeGreaterThanOrEqual(0);
  });

  it('thời gian bị giới hạn theo giờ thật: dồn 1 giờ thiền trong một lần không được', () => {
    const c = make();
    const r = c.p.record('meditateSeconds', 3600);
    expect(r.xp).toBeLessThanOrEqual(40 + 30); // ≤ 5 phút ban đầu (+ thưởng việc nếu có)
    c.adv(1000);
    expect(c.p.record('meditateSeconds', 600).xp).toBeLessThanOrEqual(8 * 3 + 30 + 30);
    // lặp nhanh nhiều lần không cho thêm
    const before = c.p.view().practiceToday;
    for (let i = 0; i < 20; i++) c.p.record('meditateSeconds', 600);
    expect(c.p.view().practiceToday - before).toBeLessThanOrEqual(8 * 2);
  });

  it('loại không hợp lệ không làm gì', () => {
    const c = make();
    expect(c.p.record('hack' as ActivityKind).xp).toBe(0);
    expect(c.p.view().xp).toBe(0);
  });
});

describe('progress: chuỗi giữ lửa & ngày nghỉ', () => {
  /** Thắp lửa ngày hiện tại bằng một lần chắp tay. */
  const light = (c: ReturnType<typeof make>) => {
    c.adv(2000);
    c.p.record('pray');
  };

  it('liên tiếp tăng chuỗi, cùng ngày không tăng thêm', () => {
    const c = make();
    light(c);
    light(c);
    expect(c.p.view().streak).toBe(1);
    expect(c.p.view().litToday).toBe(true);
    c.adv(DAY_MS);
    expect(c.p.view().litToday).toBe(false);
    expect(c.p.view().streak).toBe(1); // hôm qua đã đủ lửa, hôm nay còn kịp
    light(c);
    expect(c.p.view().streak).toBe(2);
    expect(c.p.view().best).toBe(2);
  });

  it('bỏ một ngày không có ngày nghỉ → chuỗi về 0 (hiển thị) và bắt đầu lại, best giữ', () => {
    const c = make();
    for (let i = 0; i < 3; i++) {
      light(c);
      c.adv(DAY_MS);
    }
    expect(c.p.view().streak).toBe(3);
    c.adv(DAY_MS); // bỏ một ngày
    expect(c.p.view().streak).toBe(0);
    expect(c.p.view().best).toBe(3);
    light(c);
    expect(c.p.view().streak).toBe(1);
    expect(c.p.view().best).toBe(3);
  });

  it('tích 1 ngày nghỉ mỗi 7 ngày công phu, dùng để giữ chuỗi khi bỏ một ngày', () => {
    const c = make();
    for (let i = 0; i < 7; i++) {
      light(c);
      if (i < 6) c.adv(DAY_MS);
    }
    expect(c.p.view().streak).toBe(7);
    expect(c.p.view().restDays).toBe(1);
    c.adv(2 * DAY_MS); // bỏ đúng một ngày
    expect(c.p.view().streak).toBe(7); // còn giữ nhờ ngày nghỉ
    light(c);
    const v = c.p.view();
    expect(v.streak).toBe(8);
    expect(v.restDays).toBe(0);
  });

  it('bỏ hai ngày chỉ có một ngày nghỉ → mất chuỗi, giữ nguyên ngày nghỉ', () => {
    const c = make();
    for (let i = 0; i < 7; i++) {
      light(c);
      if (i < 6) c.adv(DAY_MS);
    }
    c.adv(3 * DAY_MS); // bỏ hai ngày
    expect(c.p.view().streak).toBe(0);
    light(c);
    expect(c.p.view().streak).toBe(1);
    expect(c.p.view().restDays).toBe(1);
    expect(c.p.view().best).toBe(7);
  });

  it('ngày nghỉ tối đa 2', () => {
    const c = make();
    for (let i = 0; i < 25; i++) {
      light(c);
      c.adv(DAY_MS);
    }
    expect(c.p.view().restDays).toBe(2);
  });

  it('chỉ visit không đủ lửa', () => {
    const c = make();
    c.p.record('visit');
    expect(c.p.view().litToday).toBe(false);
    expect(c.p.view().streak).toBe(0);
  });

  it('mốc thưởng chuỗi: 3 ngày +30 một lần duy nhất', () => {
    const c = make();
    const gains: number[] = [];
    for (let i = 0; i < 3; i++) {
      c.adv(2000);
      gains.push(c.p.record('pray').xp);
      c.adv(DAY_MS);
    }
    expect(gains[0]).toBe(3);
    expect(gains[1]).toBe(3);
    expect(gains[2]).toBe(3 + 30);
    // mất chuỗi rồi gây dựng lại tới 3: không thưởng lần nữa
    c.adv(3 * DAY_MS);
    const again: number[] = [];
    for (let i = 0; i < 3; i++) {
      c.adv(2000);
      again.push(c.p.record('pray').xp);
      c.adv(DAY_MS);
    }
    expect(again).toEqual([3, 3, 3]);
  });

  it('mốc 7 ngày: +50', () => {
    const c = make();
    const gains: number[] = [];
    for (let i = 0; i < 7; i++) {
      c.adv(2000);
      gains.push(c.p.record('pray').xp);
      c.adv(DAY_MS);
    }
    expect(gains).toEqual([3, 3, 33, 3, 3, 3, 53]);
  });

  it('theo giờ VN: 23:59 và 00:01 là hai ngày khác nhau', () => {
    const c = make({ start: day(2025, 6, 20, 23) + 59 * 60_000 });
    c.p.record('pray');
    c.adv(2 * 60_000); // 00:01 hôm sau
    c.p.record('pray');
    expect(c.p.view().streak).toBe(2);
  });

  it('đồng hồ lùi (ngày cũ) không phá chuỗi', () => {
    const c = make();
    light(c);
    c.adv(DAY_MS);
    light(c);
    expect(c.p.view().streak).toBe(2);
    c.adv(-DAY_MS);
    light(c);
    expect(c.p.view().streak).toBeGreaterThanOrEqual(2);
  });
});

describe('progress: việc hôm nay', () => {
  it('3 việc khác nhau, xác định theo ngày (hai bản cùng ngày → giống nhau)', () => {
    const a = make({ key: 'det-a' });
    const b = make({ key: 'det-b' });
    const ta = a.p.view().tasks.map((t) => t.id);
    expect(ta).toEqual(b.p.view().tasks.map((t) => t.id));
    expect(new Set(ta).size).toBe(3);
  });

  it('đổi theo ngày', () => {
    const c = make();
    const seen = new Set<string>();
    for (let i = 0; i < 12; i++) {
      seen.add(
        c.p
          .view()
          .tasks.map((t) => t.id)
          .join(','),
      );
      c.adv(DAY_MS);
    }
    expect(seen.size).toBeGreaterThan(4);
  });

  it('cấp 1 chỉ có việc dễ (hương/lạy/tràng hạt/chào/bắt gà)', () => {
    const easy = new Set(['incense', 'bow', 'beadsRound', 'greet', 'chicken']);
    for (let i = 0; i < 40; i++) {
      const day = `2025-07-${String(1 + (i % 28)).padStart(2, '0')}`;
      for (const t of pickTasks(`${day}#${i}`, 1)) {
        const kind = t.id === 'beads' ? 'beadsRound' : t.id;
        expect(easy.has(kind), t.id).toBe(true);
      }
    }
  });

  it('cấp thấp không gặp việc chưa mở khoá', () => {
    for (let i = 0; i < 60; i++) {
      const ids = pickTasks(`k${i}`, 2).map((t) => t.id);
      expect(ids).not.toContain('lantern');
      expect(ids).not.toContain('today');
      expect(ids).not.toContain('walkMeditation');
    }
    const high = new Set<string>();
    for (let i = 0; i < 200; i++) for (const t of pickTasks(`k${i}`, 20)) high.add(t.id);
    expect(high.size).toBe(15);
  });

  it('việc "Đi dạo" có điểm đến và nhãn đúng, nút "Đi" là SpotId', () => {
    let found: DailyTask | undefined;
    for (let i = 0; i < 100 && !found; i++) {
      const picked = pickTasks(`2025-08-${i}`, 20);
      if (picked.some((p) => p.id === 'walk')) {
        const c = make({ start: Date.UTC(2025, 7, 1 + (i % 25), 5) });
        c.p.importState({ v: 1, xp: xpForLevel(20) });
        for (let d = 0; d < 80 && !found; d++) {
          found = c.p.view().tasks.find((t) => t.kind === 'walkSpot');
          c.adv(DAY_MS);
        }
      }
    }
    expect(found).toBeTruthy();
    expect(found!.label.startsWith('Đi dạo tới ')).toBe(true);
    expect(['yard', 'bodhi', 'meditate', 'well', 'hall', 'coop']).toContain(found!.action);
  });

  it('làm đủ 3 việc: +30 mỗi việc và +30 khi xong cả ba (ngoài trần)', () => {
    const c = make();
    const tasks = c.p.view().tasks;
    let total = 0;
    for (const t of tasks) total += doTask(c, t);
    const v = c.p.view();
    expect(v.tasksDone).toBe(3);
    expect(v.tasks.every((t) => t.done)).toBe(true);
    expect(v.xp).toBe(total);
    expect(total).toBeGreaterThanOrEqual(3 * 30 + 30);
    expect(v.practiceToday).toBeLessThanOrEqual(PRACTICE_CAP);
    // làm lại không nhận thưởng thêm
    const xpBefore = v.xp;
    c.adv(30_000);
    c.p.record(tasks[0].kind === 'custom' ? 'pray' : tasks[0].kind, 1);
    expect(c.p.view().xp - xpBefore).toBeLessThan(30);
  });

  it('tiến trình việc tăng dần và có action cho nút "Đi"', () => {
    const c = make();
    const t0 = c.p.view().tasks;
    for (const t of t0) {
      expect(t.xp).toBe(30);
      expect(t.action).toBeTruthy();
      expect(t.progress).toBe(0);
      expect(t.done).toBe(false);
    }
    const bow = t0.find((t) => t.kind === 'bow');
    if (bow) {
      c.adv(2000);
      c.p.record('bow');
      expect(c.p.view().tasks.find((t) => t.kind === 'bow')!.progress).toBe(1);
    }
  });

  it('việc giữ nguyên trong ngày dù lên cấp giữa ngày; ngày sau dùng cấp mới', () => {
    const c = make();
    const before = c.p.view().tasks.map((t) => t.id);
    c.p.importState({ v: 1, xp: xpForLevel(12) });
    expect(c.p.view().tasks.map((t) => t.id)).toEqual(before);
  });

  it('việc thiền tính theo phút', () => {
    const c = make();
    c.p.importState({ v: 1, xp: xpForLevel(20) });
    let td: DailyTask | undefined;
    for (let d = 0; d < 120 && !td; d++) {
      td = c.p.view().tasks.find((t) => t.kind === 'meditateSeconds');
      if (!td) c.adv(DAY_MS);
    }
    expect(td).toBeTruthy();
    expect(td!.target).toBe(5);
    c.adv(1000);
    c.p.record('meditateSeconds', 120);
    expect(c.p.view().tasks.find((t) => t.kind === 'meditateSeconds')!.progress).toBe(2);
  });
});

describe('progress: dấu ấn', () => {
  it('Lạy Phật lần đầu trả stamp, lần sau không', () => {
    const c = make();
    const r = c.p.record('bow');
    expect(r.stamp).toEqual(['first-bow']);
    c.adv(2000);
    expect(c.p.record('bow').stamp).toBeUndefined();
    expect(c.p.view().stamps).toEqual(['first-bow']);
  });

  it('Dâng hương, hoa, nến đủ ba mới có dấu ấn', () => {
    const c = make();
    c.p.record('incense');
    c.adv(3000);
    c.p.record('flowers');
    expect(c.p.view().stamps).not.toContain('first-offering');
    c.adv(3000);
    const r = c.p.record('candle');
    expect(r.stamp).toContain('first-offering');
  });

  it('thiền đủ 5 phút, trọn vòng tràng hạt, tụng kinh, quét lá, thả đèn', () => {
    const c = make();
    for (let i = 0; i < 5; i++) {
      c.adv(60_000);
      c.p.record('meditateSeconds', 60);
    }
    expect(c.p.view().stamps).toContain('first-meditate');
    c.adv(20_000);
    expect(c.p.record('beadsRound').stamp).toContain('first-beads');
    c.adv(30_000);
    expect(c.p.record('chantDone').stamp).toContain('first-chant');
    c.adv(30_000);
    expect(c.p.record('sweepRound').stamp).toContain('first-sweep');
    c.adv(30_000);
    expect(c.p.record('lantern').stamp).toContain('first-lantern');
  });

  it('đi hết sáu điểm', () => {
    const c = make();
    for (const s of ['yard', 'bodhi', 'meditate', 'quanam', 'well'] as const) {
      c.adv(2000);
      c.p.record('walkSpot', 1, { spot: s });
    }
    expect(c.p.view().stamps).not.toContain('six-spots');
    c.adv(2000);
    expect(c.p.record('walkSpot', 1, { spot: 'hall' }).stamp).toContain('six-spots');
  });

  it('sáu điểm tính trọn đời, qua nhiều ngày', () => {
    const c = make();
    const spots = ['yard', 'bodhi', 'meditate', 'quanam', 'well', 'hall'] as const;
    spots.forEach((s, i) => {
      c.adv(DAY_MS);
      c.p.record('walkSpot', 1, { spot: s });
      if (i < 5) expect(c.p.view().stamps).not.toContain('six-spots');
    });
    expect(c.p.view().stamps).toContain('six-spots');
  });

  it('công phu đầu vào mùng một/rằm: 17/2/2026 là mùng 1 Tết', () => {
    const normal = make({ start: day(2025, 6, 20) });
    normal.p.record('pray');
    expect(normal.p.view().stamps).not.toContain('ram-mung1');
    const tet = make({ start: day(2026, 2, 17) });
    expect(tet.p.record('pray').stamp).toContain('ram-mung1');
    const ram = make({ start: day(2025, 9, 6) });
    expect(ram.p.record('pray').stamp).toContain('ram-mung1');
  });

  it('chuỗi 7 ngày cấp dấu ấn', () => {
    const c = make();
    let last: string[] | undefined;
    for (let i = 0; i < 7; i++) {
      c.adv(2000);
      last = c.p.record('pray').stamp;
      c.adv(DAY_MS);
    }
    expect(last).toContain('streak-7');
  });

  it('108 lạy', () => {
    const c = make();
    for (let i = 0; i < 10; i++) {
      c.adv(DAY_MS);
      for (let j = 0; j < 10; j++) {
        c.adv(2000);
        c.p.record('bow');
      }
    }
    expect(c.p.view().stamps).not.toContain('bow-108');
    c.adv(DAY_MS);
    let got: string[] | undefined;
    for (let j = 0; j < 10; j++) {
      c.adv(2000);
      got = c.p.record('bow', 1).stamp ?? got;
    }
    expect(got).toContain('bow-108');
  });

  it('nuôi & bắt gà thất lạc: cộng tinh tấn và cấp dấu ấn Hộ Trì Viên Cầm / Mục Cầm Tịnh Tâm', () => {
    const c = make();
    const r1 = c.p.record('chickenFeed');
    expect(r1.xp).toBeGreaterThanOrEqual(10);
    c.adv(5000);
    const r2 = c.p.record('chickenRescue');
    expect(r2.xp).toBeGreaterThanOrEqual(18);
    expect(r2.stamp).toContain('first-chicken');

    let stamp27: string[] | undefined;
    for (let d = 0; d < 7; d++) {
      c.adv(DAY_MS);
      for (let k = 0; k < 5; k++) {
        c.adv(5000);
        const res = c.p.record('chickenRescue');
        if (res.stamp?.includes('chicken-27')) stamp27 = res.stamp;
      }
    }
    expect(stamp27).toContain('chicken-27');
  });
});

describe('progress: lưu trữ, đồng bộ', () => {
  it('lưu & khôi phục khi tạo lại', () => {
    const c = make();
    c.p.record('bow');
    c.adv(2000);
    c.p.record('incense');
    const v = c.p.view();
    const q = c.mk();
    const w = q.view();
    expect(w.xp).toBe(v.xp);
    expect(w.stamps).toEqual(v.stamps);
    expect(w.practiceToday).toBe(v.practiceToday);
    expect(w.tasks.map((t) => t.id)).toEqual(v.tasks.map((t) => t.id));
    expect(w.litToday).toBe(true);
  });

  it('dữ liệu hỏng/độc hại → bắt đầu mới, không ném lỗi', () => {
    for (const bad of ['rác', 123, null, [], { v: 2 }, { v: 1, xp: 'abc', streak: -5, day: 7, life: [1], stamps: 'x' }]) {
      const key = `test-bad-${++seq}`;
      save(key, bad);
      const p = createProgress({ storageKey: key, now: () => Date.UTC(2025, 5, 20, 5) });
      const v = p.view();
      expect(v.level).toBe(1);
      expect(v.xp).toBe(0);
      expect(v.tasks).toHaveLength(3);
      expect(v.streak).toBe(0);
    }
  });

  it('dữ liệu có giá trị vượt giới hạn được kẹp lại', () => {
    const key = `test-clamp-${++seq}`;
    save(key, { v: 1, xp: 5000, streak: 3, best: 1, restDays: 99, restAcc: 99, day: { key: '2025-06-20', practiceXp: 99999, extraXp: -3, counts: { bow: 3 } } });
    const p = createProgress({ storageKey: key, now: () => Date.UTC(2025, 5, 20, 5) });
    const v = p.view();
    expect(v.restDays).toBeLessThanOrEqual(2);
    expect(v.practiceToday).toBeLessThanOrEqual(200);
    expect(v.best).toBeGreaterThanOrEqual(v.streak);
  });

  it('exportState → importState sang bản khác giữ nguyên', () => {
    const a = make();
    a.p.record('bow');
    a.adv(2000);
    a.p.record('incense');
    const exported = a.p.exportState();
    expect(JSON.parse(JSON.stringify(exported))).toEqual(exported); // thuần JSON
    const b = make();
    b.set(a.time());
    b.p.importState(exported);
    expect(b.p.view().xp).toBe(a.p.view().xp);
    expect(b.p.view().stamps).toEqual(a.p.view().stamps);
  });

  it('importState hợp nhất: lấy xp cao hơn, không hạ cấp, hợp dấu ấn', () => {
    const server = make();
    server.p.importState({ v: 1, xp: 300, best: 12, stamps: ['first-bow'], life: { bow: 50 } });
    const local = make();
    local.p.record('incense');
    local.p.record('bow');
    const localXp = local.p.view().xp;
    local.p.importState(server.p.exportState());
    const v = local.p.view();
    expect(v.xp).toBe(Math.max(300, localXp));
    expect(v.level).toBe(levelFromXp(v.xp));
    expect(v.best).toBeGreaterThanOrEqual(12);
    expect(v.stamps).toContain('first-bow');
    // nhập bản thấp hơn: không giảm
    const low = make();
    low.p.importState({ v: 1, xp: 10 });
    local.p.importState(low.p.exportState());
    expect(local.p.view().xp).toBe(Math.max(300, localXp));
  });

  it('importState: chuỗi lấy bản có ngày thắp lửa gần hơn; cùng ngày lấy max', () => {
    const c = make();
    c.adv(2000);
    c.p.record('pray');
    expect(c.p.view().streak).toBe(1);
    c.p.importState({ v: 1, streak: 10, best: 10, lastLit: '2025-06-20', restDays: 1 });
    const v = c.p.view();
    expect(v.streak).toBe(10);
    expect(v.restDays).toBe(1);
    // bản cũ hơn không ghi đè chuỗi hiện tại
    c.p.importState({ v: 1, streak: 50, best: 50, lastLit: '2025-06-10' });
    expect(c.p.view().streak).toBe(10);
    expect(c.p.view().best).toBe(50);
    // bản mới hơn thắng
    c.p.importState({ v: 1, streak: 4, best: 4, lastLit: '2025-06-20' });
    expect(c.p.view().streak).toBe(10);
  });

  it('importState: trong ngày hợp nhất số đếm (không nhận xp trùng)', () => {
    const a = make();
    const b = make();
    b.set(a.time());
    for (let i = 0; i < 5; i++) {
      a.adv(2000);
      a.p.record('bow');
    }
    b.p.record('bow');
    a.p.importState(b.p.exportState());
    expect(a.p.view().practiceToday).toBe(30); // max, không cộng dồn
    a.adv(2000);
    a.p.record('bow');
    expect(a.p.view().practiceToday).toBe(36);
  });

  it('importState rác bị bỏ qua', () => {
    const c = make();
    c.p.record('bow');
    const xp = c.p.view().xp;
    for (const bad of [null, undefined, 'x', 42, [], {}, { v: 9 }]) c.p.importState(bad);
    expect(c.p.view().xp).toBe(xp);
  });

  it('exportState trả bản sao (sửa không ảnh hưởng)', () => {
    const c = make();
    c.p.record('bow');
    const e = c.p.exportState() as { xp: number };
    e.xp = 99999;
    expect(c.p.view().xp).toBeLessThan(1000);
  });
});

describe('progress: mở khoá theo cấp', () => {
  const table: [UnlockFeature, number][] = [
    ['flowers', 2], ['bell', 2], ['candle', 3], ['today', 3], ['lantern', 4], ['dharma', 5], ['que', 5], ['wardrobe', 6],
    ['walkMeditation', 8], ['release', 10], ['loc', 10], ['friends', 1],
  ];
  it('unlockLevel đúng bảng, UNLOCK_INFO đủ tính năng có nhãn', () => {
    const { p } = make();
    for (const [f, lv] of table) {
      expect(p.unlockLevel(f), f).toBe(lv);
      expect(UNLOCK_INFO[f].label.length).toBeGreaterThan(0);
    }
    expect(Object.keys(UNLOCK_INFO)).toHaveLength(table.length);
  });
  it('isUnlocked đổi theo cấp', () => {
    const c = make();
    expect(c.p.isUnlocked('flowers')).toBe(false);
    expect(c.p.isUnlocked('friends')).toBe(true);
    c.p.importState({ v: 1, xp: xpForLevel(4) });
    expect(c.p.isUnlocked('flowers')).toBe(true);
    expect(c.p.isUnlocked('candle')).toBe(true);
    expect(c.p.isUnlocked('lantern')).toBe(true);
    expect(c.p.isUnlocked('que')).toBe(false);
    c.p.importState({ v: 1, xp: xpForLevel(10) });
    expect(c.p.isUnlocked('release')).toBe(true);
    expect(c.p.isUnlocked('walkMeditation')).toBe(true);
  });
});

describe('progress: thông báo', () => {
  it('onChange được gọi khi ghi nhận / nhập, và huỷ đăng ký được', () => {
    const c = make();
    const seen: ProgressView[] = [];
    const off = c.p.onChange((v) => seen.push(v));
    c.p.record('bow');
    expect(seen).toHaveLength(1);
    expect(seen[0].xp).toBeGreaterThan(0);
    c.p.importState({ v: 1, xp: 500 });
    expect(seen).toHaveLength(2);
    off();
    c.adv(2000);
    c.p.record('bow');
    expect(seen).toHaveLength(2);
  });

  it('lỗi trong một hàm lắng nghe không chặn các hàm khác', () => {
    const c = make();
    let n = 0;
    c.p.onChange(() => {
      throw new Error('x');
    });
    c.p.onChange(() => n++);
    const orig = console.error;
    console.error = () => {};
    try {
      c.p.record('bow');
    } finally {
      console.error = orig;
    }
    expect(n).toBe(1);
  });

  it('phát bus progress + levelUp nếu truyền bus', () => {
    const bus = createEmitter<AppEvents>();
    let prog = 0;
    let lv = 0;
    bus.on('progress', () => prog++);
    bus.on('levelUp', (e) => (lv = e.level));
    let t = Date.UTC(2025, 5, 20, 5);
    const p = createProgress({ storageKey: `test-bus-${++seq}`, now: () => t, bus });
    p.importState({ v: 1, xp: 49 });
    t += 1000;
    p.record('incense');
    expect(prog).toBeGreaterThanOrEqual(1);
    expect(lv).toBe(2);
  });
});
