/**
 * Hệ thống 20 Phật tử ảo (Bot) sinh động như người thật:
 * - Pháp danh Việt Nam, giới tính, trang phục, màu sắc, pháp khí và cấp bậc sen đa dạng.
 * - Tự tìm đường A* (`findPath`) quanh vật cản trên toàn khuôn viên chùa (không đi xuyên tường/hồ).
 * - Thực hiện đầy đủ hoạt động: lễ Phật ở Chánh điện, thắp hương Lư đồng, cầu nguyện Quan Âm & Cây Bồ Đề,
 *   ngồi thiền/tụng kinh trên bồ đoàn (chừa tối thiểu 5/8 bồ đoàn trống cho người thật), quét lá sân gạch,
 *   lần tràng hạt, ngắm Giếng ngọc, thả đèn hoa đăng ở Ao sen; thỉnh thoảng buông một câu vui (BOT_QUIPS) — ngẫu nhiên, có giãn cách, không spam.
 */
import { OUTFITS, type Gender, type OutfitId, type Profile, type RemotePlayer } from './contracts';
import { randomName } from './profile';
import { BOT_QUIPS } from '../content/phrases';
import { ACCESSORIES } from '../content/wardrobe';
import { CUSHION_COUNT, cushionSlot, LOTUS_POND, RELEASE_POND, WELL, type Vec2 } from '../world/layout';
import { findPath, nearestFree } from '../world/nav';

export const DEFAULT_BOT_COUNT = 20;

export interface BotHooks {
  onSay?: (botId: string, phraseId: string) => void;
  onLantern?: (botId: string, colorHex: string) => void;
}

type GoalKind =
  | 'altar'
  | 'burner'
  | 'candles'
  | 'que'
  | 'bell'
  | 'lotusPond'
  | 'releasePond'
  | 'bodhiTree'
  | 'quanam'
  | 'well'
  | 'cushion'
  | 'sweepYard'
  | 'stroll';

interface BotActor {
  id: string;
  profile: Profile;
  level: number;
  streak: number;
  x: number;
  z: number;
  ry: number;
  anim: RemotePlayer['anim'];
  speed: number;
  path: Vec2[];
  goalKind: GoalKind;
  goalFace: number;
  goalAnim: RemotePlayer['anim'];
  dwellLeft: number;
  cushionIdx: number | null;
  say: string | null;
  sayUntil: number;
  nextSayAt: number;
  pendingReplyAt: number;
  pendingReplyPhrase: string | null;
  frag: string | null;
  /** NPC đứng cố định (vd ThaisHungw ngủ gật cạnh lối vào), không đi lại, không tự nói. */
  fixed?: boolean;
  /** Lúc bị đánh thức thì quét lá tới thời điểm này rồi ngủ gật tiếp. */
  wakeUntil?: number;
}

/**
 * ThaisHungw: cầm chổi quét lá đa nhưng đứng ngủ gật ngay bên lối đá trước mặt cổng vào —
 * ai vừa vào chùa (sinh ra quanh x=0, z≈29, nhìn về chánh điện) cũng thấy ngay.
 */
export const SLEEPER_ID = 'b0700000';
export const SLEEPER_POS: Vec2 = { x: 2.3, z: 25.4 };
const SLEEPER_LOOK: Vec2 = { x: 0, z: 30 };
/** Câu ThaisHungw lẩm bẩm khi bị người chơi chắp tay / chào làm giật mình tỉnh giấc. */
const SLEEPER_REPLIES = ['vui-cham-dau', 'vui-trung-sinh', 'vui-gopi', 'vui-than-chua', 'vui-kiep-nan', 'vui-huong-noi']
  .filter((id) => BOT_QUIPS.some((p) => p.id === id));
const SLEEPER_WAKE_MS = 4_500;

const LANTERN_HEX = ['#f3c25a', '#f28ca8', '#f7e3a4', '#8fe0bd', '#ff9f68'];
/** NPC chỉ nói các câu vui trong BOT_QUIPS, chọn ngẫu nhiên và không lặp lại câu vừa nói. */
const QUIP_IDS = BOT_QUIPS.map((p) => p.id);
/** Khoảng lặng chung cả sân chùa giữa hai câu nói tự phát (ms). */
const GLOBAL_SAY_GAP: [number, number] = [6_000, 12_000];
/** Mỗi NPC nói lại sau ít nhất (ms). */
const BOT_SAY_GAP: [number, number] = [40_000, 80_000];
/** Khoảng lặng chung giữa hai lần NPC đáp lại người chơi (ms). */
const REPLY_GAP_MS = 4_000;
/** Xác suất một NPC đứng gần đáp lại khi người chơi chắp tay / chào. */
const REPLY_CHANCE = 0.85;

const r2 = (n: number): number => Math.round(n * 100) / 100;

function wrapPi(a: number): number {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

function faceToward(from: Vec2, lookAt: Vec2): number {
  return Math.atan2(-(lookAt.x - from.x), -(lookAt.z - from.z));
}

/** Không cho Phật tử ảo khác dừng chân đè lên chỗ ThaisHungw đang ngủ gật. */
function awayFromSleeper(p: Vec2): Vec2 {
  const dx = p.x - SLEEPER_POS.x;
  const dz = p.z - SLEEPER_POS.z;
  if (dx * dx + dz * dz >= 1.6 * 1.6) return p;
  return nearestFree(SLEEPER_POS.x + (dx >= 0 ? 1.9 : -1.9), p.z);
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export class BotColony {
  private bots: BotActor[] = [];
  private rng: () => number;
  private occupiedCushions = new Set<number>();
  private globalNextSayAt = 0;
  private globalNextLanternAt = 0;
  private globalNextReplyAt = 0;
  private recentQuips: string[] = [];

  constructor(count: number, private hooks: BotHooks = {}, seed = 20261104) {
    this.rng = mulberry32(seed);
    const usedNames = new Set<string>();
    const outfits = OUTFITS.map((o) => o.id) as OutfitId[];
    const now = Date.now();
    this.globalNextSayAt = now + 4_000;
    this.globalNextLanternAt = now + 9000;

    for (let i = 0; i < (count > 0 ? count - 1 : 0); i++) {
      const gender: Gender = i % 2 === 0 ? 'female' : 'male';
      let name = '';
      for (let tries = 0; tries < 40; tries++) {
        const cand = randomName(gender, this.rng);
        if (!usedNames.has(cand)) { name = cand; break; }
      }
      if (!name) name = `${gender === 'female' ? 'Diệu' : 'Minh'} Tâm`;
      usedNames.add(name);

      // Phân bố cấp độ tự nhiên từ Cấp 1 (Hạt sen) tới Cấp 52 (Sen ngàn cánh)
      const tierRoll = this.rng();
      const level = tierRoll < 0.35
        ? 1 + Math.floor(this.rng() * 5)
        : tierRoll < 0.72
          ? 6 + Math.floor(this.rng() * 11)
          : tierRoll < 0.92
            ? 17 + Math.floor(this.rng() * 15)
            : 32 + Math.floor(this.rng() * 21);
      const streak = Math.max(1, Math.min(level * 2 + Math.floor(this.rng() * 7), 108));

      const outfit = gender === 'female'
        ? (['ao-dai', 'trang-lam', 'ba-ba', 'trang-xam'] as OutfitId[])[Math.floor(this.rng() * 4)]
        : outfits[Math.floor(this.rng() * outfits.length)];
      const colorIndex = Math.floor(this.rng() * 5);

      const unlockedAcc = ACCESSORIES.filter((a) => a.minLevel <= level);
      let accessory: string | undefined;
      if (unlockedAcc.length > 0 && this.rng() < 0.68) {
        accessory = unlockedAcc[Math.floor(this.rng() * unlockedAcc.length)].id;
      }

      const id = `b07${(i + 1).toString(16).padStart(5, '0')}`;
      const bot: BotActor = {
        id,
        profile: { name, gender, outfit, colorIndex, ...(accessory ? { accessory } : {}) },
        level,
        streak,
        x: 0,
        z: 24,
        ry: 0,
        anim: 'idle',
        speed: 2.35 + this.rng() * 0.75,
        path: [],
        goalKind: 'stroll',
        goalFace: 0,
        goalAnim: 'idle',
        dwellLeft: 1 + this.rng() * 8,
        cushionIdx: null,
        say: null,
        sayUntil: 0,
        nextSayAt: now + 3_000 + Math.floor(this.rng() * 45_000),
        pendingReplyAt: 0,
        pendingReplyPhrase: null,
        frag: null,
      };

      // Đặt sẵn rải đều khắp khuôn viên lúc khởi tạo để cảnh chùa tự nhiên ngay giây đầu tiên
      const startTarget = this.pickTarget(bot, i);
      bot.x = startTarget.pos.x;
      bot.z = startTarget.pos.z;
      bot.ry = startTarget.face;
      bot.goalKind = startTarget.kind;
      bot.goalFace = startTarget.face;
      bot.goalAnim = startTarget.anim;
      bot.anim = startTarget.anim;
      bot.dwellLeft = 2 + this.rng() * startTarget.dwell;
      if (startTarget.cushionIdx !== null) {
        bot.cushionIdx = startTarget.cushionIdx;
        this.occupiedCushions.add(startTarget.cushionIdx);
      }
      // Cho khoảng 40% bot bắt đầu đi dạo ngay từ đầu thay vì đứng yên cả 20 người
      if (i % 5 >= 2 && bot.cushionIdx === null) {
        this.assignNextGoal(bot);
      }
      this.bots.push(bot);
    }

    if (count > 0) {
      const ry = faceToward(SLEEPER_POS, SLEEPER_LOOK);
      this.bots.push({
        id: SLEEPER_ID,
        profile: { name: 'ThaisHungw', gender: 'male', outfit: 'ba-ba', colorIndex: 0, accessory: 'hat-tram' },
        level: 82,
        streak: 81,
        x: SLEEPER_POS.x,
        z: SLEEPER_POS.z,
        ry,
        anim: 'doze',
        speed: 0,
        path: [],
        goalKind: 'sweepYard',
        goalFace: ry,
        goalAnim: 'doze',
        dwellLeft: Infinity,
        cushionIdx: null,
        say: null,
        sayUntil: 0,
        nextSayAt: Infinity,
        pendingReplyAt: 0,
        pendingReplyPhrase: null,
        frag: null,
        fixed: true,
        wakeUntil: 0,
      });
    }
  }

  get size(): number {
    return this.bots.length;
  }

  private randRange(min: number, max: number): number {
    return min + this.rng() * (max - min);
  }

  private pickTarget(bot: BotActor, seedIdx?: number): {
    kind: GoalKind;
    pos: Vec2;
    face: number;
    anim: RemotePlayer['anim'];
    dwell: number;
    cushionIdx: number | null;
  } {
    const kinds: GoalKind[] = [
      'altar', 'altar', 'burner', 'burner', 'candles', 'que',
      'bell', 'lotusPond', 'lotusPond', 'releasePond',
      'bodhiTree', 'bodhiTree', 'quanam', 'quanam', 'well',
      'cushion', 'sweepYard', 'stroll', 'stroll', 'stroll',
    ];
    let kind = seedIdx !== undefined ? kinds[seedIdx % kinds.length] : kinds[Math.floor(this.rng() * kinds.length)];
    if (kind === bot.goalKind && seedIdx === undefined) {
      kind = kinds[Math.floor(this.rng() * kinds.length)];
    }

    // Tối đa 3 bot ngồi thiền cùng lúc để luôn còn >= 5 bồ đoàn trống cho người thật
    if (kind === 'cushion') {
      if (this.occupiedCushions.size >= 3) {
        kind = 'stroll';
      } else {
        const freeSlots: number[] = [];
        for (let s = 0; s < CUSHION_COUNT; s++) if (!this.occupiedCushions.has(s)) freeSlots.push(s);
        if (freeSlots.length > 0) {
          const slot = freeSlots[Math.floor(this.rng() * freeSlots.length)];
          const cs = cushionSlot(slot);
          const seatAnims: RemotePlayer['anim'][] = ['meditate', 'sit', 'chant'];
          return {
            kind: 'cushion',
            pos: cs.pos,
            face: cs.face,
            anim: seatAnims[Math.floor(this.rng() * seatAnims.length)],
            dwell: this.randRange(18, 38),
            cushionIdx: slot,
          };
        }
        kind = 'stroll';
      }
    }

    switch (kind) {
      case 'altar': {
        const pos = nearestFree(this.randRange(-2.6, 2.6), this.randRange(-15.5, -13.8));
        return { kind, pos, face: faceToward(pos, { x: 0, z: -20 }), anim: this.rng() < 0.55 ? 'bow' : 'pray', dwell: this.randRange(6, 12), cushionIdx: null };
      }
      case 'burner': {
        const pos = nearestFree(this.randRange(-2.0, 2.0), this.randRange(-9.2, -7.8));
        return { kind, pos, face: faceToward(pos, { x: 0, z: -11 }), anim: 'pray', dwell: this.randRange(5, 9), cushionIdx: null };
      }
      case 'candles': {
        const pos = nearestFree(this.randRange(2.7, 4.3), this.randRange(-15.6, -14.5));
        return { kind, pos, face: faceToward(pos, { x: 3.5, z: -17.3 }), anim: 'pray', dwell: this.randRange(5, 8), cushionIdx: null };
      }
      case 'que': {
        const pos = nearestFree(this.randRange(-4.8, -3.4), this.randRange(-14.9, -13.8));
        return { kind, pos, face: faceToward(pos, { x: -4.15, z: -16.0 }), anim: 'pray', dwell: this.randRange(5, 9), cushionIdx: null };
      }
      case 'bell': {
        const pos = nearestFree(this.randRange(11.4, 12.8), this.randRange(-9.4, -6.6));
        return { kind, pos, face: faceToward(pos, { x: 15.2, z: -8 }), anim: 'pray', dwell: this.randRange(5, 9), cushionIdx: null };
      }
      case 'lotusPond': {
        const pos = nearestFree(this.randRange(-10.8, -9.2), this.randRange(11.2, 16.8));
        return { kind, pos, face: faceToward(pos, { x: LOTUS_POND.cx, z: LOTUS_POND.cz }), anim: 'pray', dwell: this.randRange(6, 12), cushionIdx: null };
      }
      case 'releasePond': {
        const pos = nearestFree(this.randRange(10.4, 11.9), this.randRange(11.2, 16.8));
        return { kind, pos, face: faceToward(pos, { x: RELEASE_POND.cx, z: RELEASE_POND.cz }), anim: this.rng() < 0.6 ? 'pray' : 'idle', dwell: this.randRange(5, 10), cushionIdx: null };
      }
      case 'bodhiTree': {
        const pos = nearestFree(this.randRange(-19.6, -17.6), this.randRange(-6.2, -2.2));
        return { kind, pos, face: faceToward(pos, { x: -21.8, z: -5.0 }), anim: 'pray', dwell: this.randRange(6, 11), cushionIdx: null };
      }
      case 'quanam': {
        const pos = nearestFree(this.randRange(26.2, 29.8), this.randRange(-13.5, -11.5));
        return { kind, pos, face: faceToward(pos, { x: 28.5, z: -16.8 }), anim: this.rng() < 0.45 ? 'bow' : 'pray', dwell: this.randRange(6, 12), cushionIdx: null };
      }
      case 'well': {
        const pos = nearestFree(this.randRange(-26.8, -24.5), this.randRange(-22.5, -20.5));
        return { kind, pos, face: faceToward(pos, { x: WELL.x, z: WELL.z }), anim: 'pray', dwell: this.randRange(5, 9), cushionIdx: null };
      }
      case 'sweepYard': {
        const pos = awayFromSleeper(nearestFree(this.randRange(-6.5, 6.5), this.randRange(8, 24)));
        return { kind, pos, face: this.randRange(-Math.PI, Math.PI), anim: 'sweep', dwell: this.randRange(8, 15), cushionIdx: null };
      }
      case 'stroll':
      default: {
        const pos = awayFromSleeper(nearestFree(this.randRange(-14, 14), this.randRange(-6, 28)));
        const anim: RemotePlayer['anim'] = this.rng() < 0.35 ? 'beads' : 'idle';
        return { kind: 'stroll', pos, face: this.randRange(-Math.PI, Math.PI), anim, dwell: this.randRange(3, 7), cushionIdx: null };
      }
    }
  }

  private assignNextGoal(b: BotActor): void {
    if (b.cushionIdx !== null) {
      this.occupiedCushions.delete(b.cushionIdx);
      b.cushionIdx = null;
    }
    const target = this.pickTarget(b);
    if (target.cushionIdx !== null) {
      b.cushionIdx = target.cushionIdx;
      this.occupiedCushions.add(target.cushionIdx);
    }
    b.goalKind = target.kind;
    b.goalFace = target.face;
    b.goalAnim = target.anim;
    b.dwellLeft = target.dwell;
    const p = findPath(b.x, b.z, target.pos.x, target.pos.z);
    if (p && p.length > 0) {
      b.path = p;
      b.anim = 'walk';
    } else {
      b.path = [];
      b.anim = target.anim;
      b.ry = target.face;
    }
    b.frag = null;
  }

  /** Chọn ngẫu nhiên một câu vui, tránh lặp lại các câu vừa nói gần đây (tối đa 1/3 kho câu). */
  private pickQuip(): string | null {
    if (QUIP_IDS.length === 0) return null;
    const pool = QUIP_IDS.filter((id) => !this.recentQuips.includes(id));
    const list = pool.length > 0 ? pool : QUIP_IDS;
    const id = list[Math.floor(this.rng() * list.length)];
    this.recentQuips.push(id);
    while (this.recentQuips.length > Math.min(20, Math.floor(QUIP_IDS.length / 3))) this.recentQuips.shift();
    return id;
  }

  /** Gọi khi một người chơi thật chắp tay hoặc gửi lời chào ở `(hx, hz)` — bot đứng gần có thể đáp lại (có giãn cách, không spam). */
  notifyHumanGesture(hx: number, hz: number, now = Date.now()): void {
    if (now < this.globalNextReplyAt) return;
    let best: BotActor | null = null;
    let bestDist = 6.5;
    for (const b of this.bots) {
      if (b.say || b.pendingReplyAt > 0) continue;
      const d = Math.hypot(b.x - hx, b.z - hz);
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    if (!best || QUIP_IDS.length === 0 || this.rng() > REPLY_CHANCE) return;
    this.globalNextReplyAt = now + REPLY_GAP_MS;
    best.pendingReplyAt = now + 900 + Math.floor(this.rng() * 1300);
    if (best.fixed) {
      // Giật mình tỉnh giấc: quét vội vài nhát rồi lẩm bẩm, xong lại ngủ gật tiếp
      best.pendingReplyPhrase = SLEEPER_REPLIES.length
        ? SLEEPER_REPLIES[Math.floor(this.rng() * SLEEPER_REPLIES.length)]
        : this.pickQuip();
      best.wakeUntil = now + SLEEPER_WAKE_MS;
      best.anim = 'sweep';
      best.frag = null;
      return;
    }
    best.pendingReplyPhrase = this.pickQuip();
    if (best.path.length === 0 && best.cushionIdx === null) {
      best.ry = faceToward({ x: best.x, z: best.z }, { x: hx, z: hz });
      best.anim = 'pray';
      best.dwellLeft = Math.max(best.dwellLeft, 3.5);
      best.frag = null;
    }
  }

  /** Cập nhật vị trí/hành động của toàn bộ 20 bot. Trả `true` nếu có thay đổi cần phát snapshot. */
  step(dt: number, now = Date.now()): boolean {
    let changed = false;

    for (const b of this.bots) {
      // Hết thời gian hiện bong bóng lời chào
      if (b.say && now >= b.sayUntil) {
        b.say = null;
        b.frag = null;
        changed = true;
      }

      // Đáp lễ người thật đứng gần
      if (b.pendingReplyAt > 0 && now >= b.pendingReplyAt) {
        const phrase = b.pendingReplyPhrase;
        b.pendingReplyAt = 0;
        b.pendingReplyPhrase = null;
        if (phrase && !b.say) {
          this.triggerSay(b, phrase, now);
          changed = true;
        }
      }

      // NPC đứng cố định: ngủ gật tựa chổi, chỉ tỉnh dậy quét lá chốc lát khi bị đánh thức
      if (b.fixed) {
        const want: RemotePlayer['anim'] = (b.wakeUntil ?? 0) > now ? 'sweep' : 'doze';
        if (b.anim !== want) {
          b.anim = want;
          b.frag = null;
          changed = true;
        }
        continue;
      }

      // Di chuyển dọc đường A*
      if (b.path.length > 0) {
        let budget = b.speed * dt;
        const ox = b.x, oz = b.z, ory = b.ry;
        while (budget > 0 && b.path.length > 0) {
          const wp = b.path[0];
          const dx = wp.x - b.x;
          const dz = wp.z - b.z;
          const dist = Math.hypot(dx, dz);
          if (dist > 0.02) {
            const wantRy = Math.atan2(-dx, -dz);
            b.ry = wrapPi(b.ry + wrapPi(wantRy - b.ry) * Math.min(1, dt * 9));
          }
          if (dist <= budget) {
            b.x = wp.x;
            b.z = wp.z;
            budget -= dist;
            b.path.shift();
          } else {
            b.x += (dx / dist) * budget;
            b.z += (dz / dist) * budget;
            budget = 0;
          }
        }
        if (b.path.length === 0) {
          b.ry = b.goalFace;
          b.anim = b.goalAnim;
          // Nếu vừa đi tới Ao sen và đến lượt thả đèn hoa đăng
          if (b.goalKind === 'lotusPond' && now >= this.globalNextLanternAt) {
            this.globalNextLanternAt = now + 22_000 + Math.floor(this.rng() * 25_000);
            const hex = LANTERN_HEX[Math.floor(this.rng() * LANTERN_HEX.length)];
            this.hooks.onLantern?.(b.id, hex);
          }
          b.frag = null;
          changed = true;
        } else {
          if (b.anim !== 'walk') b.anim = 'walk';
          if (r2(ox) !== r2(b.x) || r2(oz) !== r2(b.z) || r2(ory) !== r2(b.ry)) {
            b.frag = null;
            changed = true;
          }
        }
      } else {
        // Đang dừng thực hiện hành động tại điểm đến
        b.dwellLeft -= dt;
        if (!b.say && now >= b.nextSayAt && now >= this.globalNextSayAt && QUIP_IDS.length > 0) {
          const phrase = this.pickQuip();
          if (phrase) this.triggerSay(b, phrase, now);
          b.nextSayAt = now + BOT_SAY_GAP[0] + Math.floor(this.rng() * (BOT_SAY_GAP[1] - BOT_SAY_GAP[0]));
          this.globalNextSayAt = now + GLOBAL_SAY_GAP[0] + Math.floor(this.rng() * (GLOBAL_SAY_GAP[1] - GLOBAL_SAY_GAP[0]));
          changed = true;
        }
        if (b.dwellLeft <= 0) {
          this.assignNextGoal(b);
          changed = true;
        }
      }
    }

    return changed;
  }

  private triggerSay(b: BotActor, phraseId: string, now: number): void {
    b.say = phraseId;
    const len = Array.from(BOT_QUIPS.find((p) => p.id === phraseId)?.text ?? '').length;
    b.sayUntil = now + Math.min(8000, Math.max(4500, 1500 + len * 75));
    b.frag = null;
    this.hooks.onSay?.(b.id, phraseId);
  }

  /** Danh sách JSON fragment dựng sẵn cho máy chủ WebSocket (tối ưu 0 cấp phát thừa). */
  fragments(): string[] {
    const out: string[] = [];
    for (const b of this.bots) {
      if (b.frag === null) {
        const o: Record<string, unknown> = {
          id: b.id,
          profile: b.profile,
          level: b.level,
          x: r2(b.x),
          z: r2(b.z),
          ry: r2(b.ry),
          anim: b.anim,
        };
        if (b.say) o.say = b.say;
        b.frag = JSON.stringify(o);
      }
      out.push(b.frag);
    }
    return out;
  }

  /** Danh sách `RemotePlayer` trực tiếp cho chế độ chạy tĩnh trên client (vd Vercel không server). */
  toRemotePlayers(resolveSayText?: (phraseId: string) => string | undefined): RemotePlayer[] {
    return this.bots.map((b) => ({
      id: b.id,
      profile: b.profile,
      level: b.level,
      x: r2(b.x),
      z: r2(b.z),
      ry: r2(b.ry),
      anim: b.anim,
      ...(b.say ? { say: resolveSayText ? (resolveSayText(b.say) ?? b.say) : b.say } : {}),
    }));
  }

  /** Dữ liệu góp mặt trên Bảng xếp hạng (Top cấp & Top chuỗi). */
  leaderboardRows(): { name: string; level: number; streak: number }[] {
    return this.bots.map((b) => ({ name: b.profile.name, level: b.level, streak: b.streak }));
  }
}
