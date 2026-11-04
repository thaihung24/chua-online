/**
 * Tư thế & hoạt cảnh của nhân vật: mảng tham số (Pose), IK hai khớp cho tay, các hoạt cảnh lặp
 * (idle, walk, pray, bow, sweep, sit, meditate, chant, beads) và cử chỉ ngắn (thắp hương, dâng hoa…).
 * Mỗi khung hình: hàm hoạt cảnh ghi MỤC TIÊU vào Pose, rig làm mượt dần tới mục tiêu rồi áp lên xương.
 */
import type { RemotePlayer } from '@/core/contracts';
import type { PropName } from './props';

export const P = {
  ROOT_Y: 0, PITCH: 1, ROLL: 2, YAW: 3, H_PITCH: 4, H_YAW: 5, H_ROLL: 6,
  HIP_LX: 7, HIP_LZ: 8, HIP_RX: 9, HIP_RZ: 10, KNEE_L: 11, KNEE_R: 12,
  LH_X: 13, LH_Y: 14, LH_Z: 15, RH_X: 16, RH_Y: 17, RH_Z: 18,
  PROP_PITCH: 19, AIM_X: 20, AIM_Y: 21, AIM_Z: 22, LAP: 23, N: 24,
} as const;
/*
 * Quy ước: không gian "thân trên" gốc ở hông (y=0.3 m), +z = phía trước.
 * HIP_X dương = đùi đưa ra trước; HIP_Z = xoè ra ngoài (yaw); KNEE dương = gập ra sau.
 * Hand X = khoảng cách ra khỏi trục giữa (mỗi tay lấy chiều "ra ngoài" làm dương).
 */
export type Pose = Float32Array;
export type Anim = RemotePlayer['anim'];

export interface AnimCtx {
  /** thời gian từ lúc đổi hoạt cảnh */
  t: number;
  /** thời gian chung (giây) */
  time: number;
  /** pha bước chân (rad) */
  phase: number;
  /** pha lệch riêng mỗi nhân vật */
  seed: number;
  /** đang cầm chổi (đi mang chổi) */
  carryBroom: boolean;
  /** độ mượt (1/giây) hoạt cảnh muốn dùng */
  smooth: number;
}

const sm = (x: number): number => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const seg = (t: number, a: number, b: number): number => sm((t - a) / (b - a));

function hands(p: Pose, x: number, y: number, z: number): void {
  p[P.LH_X] = p[P.RH_X] = x; p[P.LH_Y] = p[P.RH_Y] = y; p[P.LH_Z] = p[P.RH_Z] = z;
}
function handR(p: Pose, x: number, y: number, z: number): void { p[P.RH_X] = x; p[P.RH_Y] = y; p[P.RH_Z] = z; }
function handL(p: Pose, x: number, y: number, z: number): void { p[P.LH_X] = x; p[P.LH_Y] = y; p[P.LH_Z] = z; }

/** Đứng thẳng, tay buông (mặc định mọi hoạt cảnh). */
export function standBase(p: Pose): void {
  p.fill(0);
  hands(p, 0.208, 0.035, 0.012);
  p[P.HIP_LZ] = p[P.HIP_RZ] = 0.04;
}

function idle(p: Pose, c: AnimCtx): void {
  standBase(p);
  const b = Math.sin(c.time * 2.2 + c.seed);
  p[P.ROOT_Y] = b * 0.0055;
  p[P.H_YAW] = Math.sin(c.time * 0.5 + c.seed) * 0.2;
  p[P.H_PITCH] = Math.sin(c.time * 0.8 + c.seed * 2) * 0.035;
  p[P.H_ROLL] = Math.sin(c.time * 0.37 + c.seed) * 0.04;
  p[P.ROLL] = Math.sin(c.time * 0.9 + c.seed) * 0.012;
  p[P.LH_Y] += b * 0.006; p[P.RH_Y] += b * 0.006;
  p[P.LH_X] += Math.sin(c.time * 1.1) * 0.006; p[P.RH_X] -= Math.sin(c.time * 1.1) * 0.006;
}

function walk(p: Pose, c: AnimCtx): void {
  standBase(p);
  const s = Math.sin(c.phase);
  const co = Math.cos(c.phase);
  p[P.ROOT_Y] = Math.abs(s) * 0.034;
  p[P.PITCH] = 0.07;
  p[P.YAW] = s * 0.1;
  p[P.ROLL] = co * 0.025;
  p[P.H_YAW] = -s * 0.07;
  p[P.H_PITCH] = -0.04 + Math.abs(co) * 0.03;
  p[P.HIP_LX] = s * 0.75; p[P.HIP_RX] = -s * 0.75;
  p[P.KNEE_L] = Math.max(0, -co) * 1.0; p[P.KNEE_R] = Math.max(0, co) * 1.0;
  p[P.LH_Z] = 0.02 - s * 0.14; p[P.RH_Z] = 0.02 + s * 0.14;
  p[P.LH_Y] = 0.05 + Math.max(0, s) * 0.03; p[P.RH_Y] = 0.05 + Math.max(0, -s) * 0.03;
  p[P.LH_X] = 0.2; p[P.RH_X] = 0.2;
  if (c.carryBroom) broomCarry(p, c, 0.15);
}

function pray(p: Pose, c: AnimCtx): void {
  standBase(p);
  const b = Math.sin(c.time * 2.0 + c.seed);
  hands(p, 0.028, 0.205, 0.205);
  p[P.PITCH] = 0.1; p[P.H_PITCH] = 0.2;
  p[P.ROOT_Y] = b * 0.004;
  p[P.H_YAW] = 0;
}

function prayPose(p: Pose, y = 0.205): void { hands(p, 0.028, y, 0.205); }

const BOW_T = 3.5;
function bow(p: Pose, c: AnimCtx): void {
  standBase(p);
  c.smooth = 9;
  const t = c.t % BOW_T;
  prayPose(p);
  p[P.H_PITCH] = 0.15; p[P.PITCH] = 0.08;
  const kneel = seg(t, 0.45, 1.0) - seg(t, 2.35, 2.85);
  const down = seg(t, 1.0, 1.65) - seg(t, 2.05, 2.5);
  p[P.ROOT_Y] = -0.15 * kneel;
  p[P.HIP_LX] = 0.0; p[P.HIP_RX] = 0.0;
  p[P.KNEE_L] = p[P.KNEE_R] = 1.55 * kneel;
  p[P.HIP_LZ] = p[P.HIP_RZ] = 0.04 + 0.06 * kneel;
  const pitch = 0.08 + down * 1.05;
  p[P.PITCH] = pitch;
  p[P.H_PITCH] = 0.15 + down * 0.35;
  // tay: chắp → duỗi xuống đất phía trước (đổi từ toạ độ thế giới sang thân trên đang cúi)
  const hipAbs = 0.3 + p[P.ROOT_Y];
  const wy = 0.045 - hipAbs; // độ cao tay so với hông (thế giới)
  const wz = 0.36;
  const cs = Math.cos(pitch);
  const sn = Math.sin(pitch);
  const ty = wy * cs + wz * sn;
  const tz = -wy * sn + wz * cs;
  const k = down;
  hands(p, 0.028 + k * 0.1, 0.205 * (1 - k) + ty * k, 0.205 * (1 - k) + tz * k);
}

function sweepHandPose(p: Pose, sx: number, pitchBias: number): void {
  // Tay phải ở dưới (x_upper = -0.035), tay trái nắm cao hơn trên cán (x_upper > 0 → không bắt chéo tay)
  const rx = 0.035, ry = 0.06, rz = 0.29;
  handR(p, rx, ry, rz);
  p[P.PITCH] = 0.18 + pitchBias;
  p[P.AIM_X] = -0.1 + sx;
  p[P.AIM_Y] = -0.19;
  p[P.AIM_Z] = 0.55;
  const dx = p[P.AIM_X] - (-rx);
  const dy = p[P.AIM_Y] - ry;
  const dz = p[P.AIM_Z] - rz;
  const l = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / l, uy = dy / l, uz = dz / l;
  const up = 0.17;
  handL(p, -rx - ux * up, ry - uy * up, rz - uz * up);
}

function sweep(p: Pose, c: AnimCtx): void {
  standBase(p);
  const s = Math.sin(c.t * 4.6 + c.seed);
  const co = Math.cos(c.t * 4.6 + c.seed);
  sweepHandPose(p, s * 0.34, 0.02);
  p[P.YAW] = -s * 0.2;
  p[P.ROOT_Y] = Math.abs(co) * 0.01 - 0.005;
  p[P.H_PITCH] = 0.3; p[P.H_YAW] = s * 0.15;
  p[P.HIP_LX] = 0.15; p[P.HIP_RX] = -0.2; p[P.KNEE_L] = 0.1; p[P.KNEE_R] = 0.1;
}

function broomCarry(p: Pose, c: AnimCtx, lead: number): void {
  // mang chổi khi đi: mũi chổi lướt nhẹ trên sân phía trước/bên phải
  const s = Math.sin(c.phase);
  handR(p, 0.13, 0.04, 0.2);
  p[P.AIM_X] = 0.2 + s * 0.08; p[P.AIM_Y] = -0.22; p[P.AIM_Z] = 0.5 + lead;
  p[P.RH_Z] = 0.2 + s * 0.02;
}

function seatBase(p: Pose, c: AnimCtx): void {
  standBase(p);
  p[P.ROOT_Y] = -0.205;
  p[P.HIP_LX] = p[P.HIP_RX] = 1.42;
  p[P.HIP_LZ] = p[P.HIP_RZ] = 0.62;
  p[P.KNEE_L] = p[P.KNEE_R] = 2.35;
  p[P.LAP] = 1;
  const b = Math.sin(c.time * 1.5 + c.seed);
  p[P.ROOT_Y] += b * 0.004;
  p[P.PITCH] = 0.02 + b * 0.012;
}

function sit(p: Pose, c: AnimCtx): void {
  seatBase(p, c);
  hands(p, 0.14, 0.0, 0.22);
  p[P.H_YAW] = Math.sin(c.time * 0.45 + c.seed) * 0.25;
  p[P.H_PITCH] = 0.06;
}

function meditate(p: Pose, c: AnimCtx): void {
  seatBase(p, c);
  const b = Math.sin(c.time * 1.1 + c.seed);
  hands(p, 0.045, -0.015, 0.215); // ấn thiền: hai tay chồng đặt trước bụng/lòng
  p[P.PITCH] = 0.015 + b * 0.012;
  p[P.H_PITCH] = 0.14 + b * 0.02;
  p[P.ROOT_Y] += b * 0.002;
  p[P.H_YAW] = 0;
}

function chant(p: Pose, c: AnimCtx): void {
  seatBase(p, c);
  const beat = (c.t * 1.9) % 1;
  const tap = Math.max(0, 1 - beat * 4.2); // 1→0 trong ~0.25 s sau mỗi nhịp
  const lift = Math.sin(Math.min(1, beat * 3.0) * Math.PI) * (1 - tap) * 0.0;
  handR(p, 0.06, 0.07 + (1 - tap) * 0.09 + lift, 0.3);
  handL(p, 0.13, 0.0, 0.22);
  p[P.PROP_PITCH] = 0.3 - tap * 0.15;
  p[P.H_PITCH] = 0.12 + tap * 0.1;
  p[P.PITCH] = 0.03 + tap * 0.035;
  p[P.ROOT_Y] -= tap * 0.004;
}

function beads(p: Pose, c: AnimCtx): void {
  standBase(p);
  const s = Math.sin(c.time * 2.2 + c.seed);
  const co = Math.cos(c.time * 2.2 + c.seed);
  handL(p, 0.04, 0.2, 0.2);
  handR(p, 0.045 + co * 0.012, 0.22 + s * 0.02, 0.215);
  p[P.PITCH] = 0.08; p[P.H_PITCH] = 0.2;
  p[P.ROOT_Y] = Math.sin(c.time * 2.0) * 0.004;
}

export const ANIMS: Record<Anim, (p: Pose, c: AnimCtx) => void> = {
  idle, walk, pray, bow, sweep, sit, chant, meditate, beads,
};

// ───────────────────────── Cử chỉ ngắn ─────────────────────────
export type GestureId =
  | 'incense' | 'flowers' | 'candle' | 'bell' | 'lantern' | 'que' | 'release' | 'loc' | 'wish' | 'grabBroom';

type K3 = [number, number, number];
interface Key { t: number; r: K3; l?: K3; pitch?: number; head?: number; headYaw?: number; root?: number; prop?: number }
interface Shake { a: number; b: number; freq: number; amp: K3 }
interface GestureDef {
  dur: number;
  /** thời điểm phát tín hiệu (hiệu ứng thế giới) */
  cue: number;
  keys: Key[];
  prop?: { name: PropName; mount: 'R' | 'L' | 'mid'; from: number; to: number };
  shake?: Shake;
  /** sau cử chỉ: dạng cầm chổi */
  after?: 'broom';
}

export const GESTURES: Record<GestureId, GestureDef> = {
  incense: {
    dur: 3.5, cue: 2.55,
    prop: { name: 'incense', mount: 'mid', from: 0, to: 2.7 },
    keys: [
      { t: 0, r: [0.028, 0.205, 0.205] },
      { t: 0.6, r: [0.03, 0.24, 0.23], pitch: 0.04 },
      { t: 1.4, r: [0.03, 0.6, 0.27], pitch: 0.1, head: 0.3 },
      { t: 1.95, r: [0.03, 0.6, 0.27], pitch: 0.12, head: 0.38 },
      { t: 2.55, r: [0.04, 0.2, 0.42], pitch: 0.18, head: 0.15 },
      { t: 3.05, r: [0.028, 0.205, 0.205], pitch: 0.04, head: 0.05 },
      { t: 3.5, r: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  flowers: {
    dur: 3.1, cue: 2.2,
    prop: { name: 'flowers', mount: 'mid', from: 0, to: 2.3 },
    keys: [
      { t: 0, r: [0.05, 0.15, 0.22] },
      { t: 0.6, r: [0.05, 0.28, 0.26], pitch: 0.04, head: 0.1 },
      { t: 1.4, r: [0.06, 0.34, 0.3], pitch: 0.12, head: 0.25 },
      { t: 2.2, r: [0.06, 0.26, 0.46], pitch: 0.2, head: 0.2 },
      { t: 2.7, r: [0.04, 0.2, 0.22], pitch: 0.04, head: 0.05 },
      { t: 3.1, r: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  candle: {
    dur: 2.8, cue: 1.5,
    prop: { name: 'taper', mount: 'R', from: 0, to: 2.0 },
    keys: [
      { t: 0, r: [0.07, 0.16, 0.22], l: [0.04, 0.2, 0.2] },
      { t: 0.7, r: [0.06, 0.3, 0.4], l: [0.05, 0.2, 0.22], pitch: 0.12, head: 0.12 },
      { t: 1.5, r: [0.05, 0.27, 0.46], l: [0.05, 0.2, 0.22], pitch: 0.2, head: 0.2 },
      { t: 2.0, r: [0.07, 0.16, 0.24], l: [0.05, 0.2, 0.2], pitch: 0.05, head: 0.05 },
      { t: 2.8, r: [0.12, 0.05, 0.1], l: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  bell: {
    dur: 2.0, cue: 1.0,
    keys: [
      { t: 0, r: [0.07, 0.3, 0.3] },
      { t: 0.5, r: [0.07, 0.32, 0.12], pitch: -0.08, head: -0.05 },
      { t: 1.0, r: [0.07, 0.3, 0.46], pitch: 0.22, head: 0.12 },
      { t: 1.45, r: [0.05, 0.22, 0.26], pitch: 0.08, head: 0.05 },
      { t: 2.0, r: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  lantern: {
    dur: 3.2, cue: 2.15,
    prop: { name: 'lantern', mount: 'mid', from: 0, to: 2.15 },
    keys: [
      { t: 0, r: [0.06, 0.14, 0.26] },
      { t: 0.7, r: [0.06, 0.16, 0.3], pitch: 0.06, head: 0.15 },
      { t: 1.5, r: [0.06, -0.02, 0.42], pitch: 0.42, head: 0.1 },
      { t: 2.15, r: [0.06, -0.04, 0.44], pitch: 0.46, head: 0.12 },
      { t: 2.45, r: [0.14, -0.03, 0.44], pitch: 0.42, head: 0.1 },
      { t: 3.2, r: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  que: {
    dur: 2.8, cue: 2.0,
    prop: { name: 'tube', mount: 'mid', from: 0, to: 2.4 },
    shake: { a: 0.5, b: 1.75, freq: 5.2, amp: [0.0, 0.055, 0.015] },
    keys: [
      { t: 0, r: [0.04, 0.2, 0.22] },
      { t: 0.5, r: [0.04, 0.34, 0.26], pitch: 0.05, head: 0.1 },
      { t: 1.75, r: [0.04, 0.34, 0.26], pitch: 0.05, head: 0.1 },
      { t: 2.0, r: [0.04, 0.4, 0.28], pitch: -0.05, head: -0.05 },
      { t: 2.4, r: [0.04, 0.26, 0.26], pitch: 0.03, head: 0.1 },
      { t: 2.8, r: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  release: {
    dur: 3.0, cue: 1.8,
    prop: { name: 'bowl', mount: 'mid', from: 0, to: 2.3 },
    keys: [
      { t: 0, r: [0.06, 0.12, 0.25], prop: 0 },
      { t: 0.8, r: [0.07, 0.04, 0.34], pitch: 0.3, head: 0.1, prop: 0 },
      { t: 1.3, r: [0.07, -0.05, 0.42], pitch: 0.46, head: 0.2, prop: 0 },
      { t: 1.8, r: [0.07, -0.05, 0.42], pitch: 0.46, head: 0.2, prop: 0.85 },
      { t: 2.3, r: [0.07, -0.02, 0.38], pitch: 0.3, head: 0.15, prop: 0.2 },
      { t: 3.0, r: [0.12, 0.05, 0.1], pitch: 0, head: 0, prop: 0 },
    ],
  },
  loc: {
    dur: 2.8, cue: 1.25,
    prop: { name: 'twig', mount: 'R', from: 1.25, to: 2.5 },
    keys: [
      { t: 0, r: [0.12, 0.05, 0.1], l: [0.1, 0.05, 0.1] },
      { t: 0.6, r: [0.1, 0.4, 0.34], l: [0.1, 0.1, 0.12], pitch: -0.06, head: -0.25 },
      { t: 1.0, r: [0.1, 0.62, 0.34], l: [0.1, 0.1, 0.12], pitch: -0.12, head: -0.35 },
      { t: 1.25, r: [0.1, 0.55, 0.3], l: [0.1, 0.1, 0.12], pitch: -0.05, head: -0.3 },
      { t: 2.0, r: [0.05, 0.24, 0.24], l: [0.04, 0.2, 0.2], pitch: 0.05, head: 0.15 },
      { t: 2.8, r: [0.12, 0.05, 0.1], l: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  wish: {
    dur: 3.2, cue: 1.7,
    prop: { name: 'ribbon', mount: 'mid', from: 0, to: 2.5 },
    shake: { a: 0.7, b: 1.7, freq: 6.5, amp: [0.025, 0.02, 0.0] },
    keys: [
      { t: 0, r: [0.06, 0.2, 0.22] },
      { t: 0.7, r: [0.08, 0.5, 0.34], pitch: -0.04, head: -0.12 },
      { t: 1.7, r: [0.08, 0.5, 0.34], pitch: -0.04, head: -0.12 },
      { t: 2.2, r: [0.028, 0.205, 0.205], pitch: 0.1, head: 0.3 },
      { t: 2.7, r: [0.028, 0.205, 0.205], pitch: 0.1, head: 0.3 },
      { t: 3.2, r: [0.12, 0.05, 0.1], pitch: 0, head: 0 },
    ],
  },
  grabBroom: {
    dur: 1.0, cue: 0.55,
    keys: [
      { t: 0, r: [0.12, 0.05, 0.1] },
      { t: 0.45, r: [0.1, 0.12, 0.34], pitch: 0.14, head: 0.2 },
      { t: 1.0, r: [0.1, 0.07, 0.3], pitch: 0.2, head: 0.15 },
    ],
    after: 'broom',
  },
};

/** Áp cử chỉ lên Pose tại thời điểm t (ghi đè tay/đầu/thân trên). */
export function applyGesture(p: Pose, g: GestureDef, t: number): void {
  const keys = g.keys;
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const u = b.t > a.t ? sm((t - a.t) / (b.t - a.t)) : 1;
  const lerp = (x: number, y: number): number => x + (y - x) * u;
  const rx = lerp(a.r[0], b.r[0]), ry = lerp(a.r[1], b.r[1]), rz = lerp(a.r[2], b.r[2]);
  const al = a.l ?? a.r, bl = b.l ?? b.r;
  const lx = lerp(al[0], bl[0]), ly = lerp(al[1], bl[1]), lz = lerp(al[2], bl[2]);
  let sx = 0, sy = 0, sz = 0;
  if (g.shake && t > g.shake.a && t < g.shake.b) {
    const w = Math.sin((t - g.shake.a) * g.shake.freq * Math.PI * 2);
    const env = sm((t - g.shake.a) / 0.2) * (1 - sm((t - (g.shake.b - 0.2)) / 0.2));
    sx = w * g.shake.amp[0] * env; sy = w * g.shake.amp[1] * env; sz = w * g.shake.amp[2] * env;
  }
  handR(p, rx + sx, ry + sy, rz + sz);
  handL(p, lx + sx, ly + sy, lz + sz);
  p[P.PITCH] = lerp(a.pitch ?? 0, b.pitch ?? 0) + 0.02;
  p[P.H_PITCH] = lerp(a.head ?? 0, b.head ?? 0);
  p[P.PROP_PITCH] = lerp(a.prop ?? 0, b.prop ?? 0);
  if (a.root !== undefined || b.root !== undefined) p[P.ROOT_Y] += lerp(a.root ?? 0, b.root ?? 0);
}
