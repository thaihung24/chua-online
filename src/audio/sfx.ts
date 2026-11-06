// Tổng hợp từng âm hiệu ứng (mõ, chuông, hạt, hương, hoa, đèn, …) — không dùng file âm thanh.
import type { Sfx } from '@/core/contracts';
import { Voice, type Engine } from './engine';
import { midiToHz } from './dsp';

export interface SfxCtx {
  vol: number;
  pitch: number;
  bus: AudioNode;
  /** nghe như từ xa (chuông gió xa): tối hơn, nhiều hồi âm */
  far: boolean;
}

/** Độ dài ước lượng (s) để đếm số tiếng đồng thời; `high` = ưu tiên không bị bỏ. */
export const SFX_PRIORITY: Record<Sfx, { dur: number; high: boolean }> = {
  mo: { dur: 0.5, high: false },
  bell: { dur: 7, high: true },
  bellBig: { dur: 11, high: true },
  bead: { dur: 0.3, high: false },
  incense: { dur: 1.8, high: false },
  flower: { dur: 2.8, high: false },
  candle: { dur: 1.2, high: false },
  lantern: { dur: 3, high: false },
  bow: { dur: 1.2, high: false },
  click: { dur: 0.2, high: false },
  chime: { dur: 7, high: false },
  levelUp: { dur: 6, high: true },
  sweep: { dur: 1.4, high: false },
  que: { dur: 1.6, high: false },
  splash: { dur: 1.2, high: false },
  ribbon: { dur: 1.3, high: false },
};

type Fn = (e: Engine, t: number, o: SfxCtx) => void;

function lowpass(v: Voice, freq: number, q = 0.7): BiquadFilterNode {
  const f = v.e.ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = freq;
  f.Q.value = q;
  f.connect(v.out);
  return f;
}

/** Chuông nhỏ trong trẻo (dùng cho hương, đèn…). */
function smallBell(v: Voice, t: number, f: number, amp: number, tau: number): void {
  v.tone('sine', f, t, amp, { attack: 0.002, tau });
  v.tone('sine', f * 2.4, t, amp * 0.35, { attack: 0.002, tau: tau * 0.55 });
  v.tone('sine', f * 3.8, t, amp * 0.12, { attack: 0.002, tau: tau * 0.35 });
}

// ───────── Mõ gỗ mít ─────────
const mo: Fn = (e, t, o) => {
  const r = e.rnd;
  const v = new Voice(e, o.bus, { send: 0.03, pan: (r() - 0.5) * 0.05 });
  if (e.moSample) {
    const src = e.ctx.createBufferSource();
    src.buffer = e.moSample;
    src.playbackRate.value = Math.min(1.6, Math.max(0.6, o.pitch)) * (1 + (r() - 0.5) * 0.004);
    const g = e.ctx.createGain();
    g.gain.value = (0.94 + r() * 0.06) * o.vol;
    src.connect(g);
    g.connect(v.out);
    v.track(src);
    src.start(t);
    return;
  }
  const lp = lowpass(v, 2600 * Math.min(1.25, Math.max(0.8, o.pitch)), 0.8);
  // Khoang rỗng mõ gỗ mít ổn định cao độ (±3 cent), đặt đúng vùng âm sắc nguyên âm "ô" ("cốc / cốp")
  const f0 = 468 * o.pitch * (1 + (r() - 0.5) * 0.004);
  const A = (0.93 + r() * 0.07) * o.vol;
  // Mode 1 (khoang rỗng ~468 Hz) + Mode 2 (mép rãnh ~740 Hz) tạo âm "ố" tròn rỗng đặc trưng của mõ gỗ
  v.tone('sine', f0, t, 0.62 * A, { attack: 0.0003, tau: 0.018, fromFreq: f0 * 1.035, glideTau: 0.0022, dest: lp });
  v.tone('sine', f0 * 1.58, t, 0.34 * A, { attack: 0.0003, tau: 0.010, fromFreq: f0 * 1.63, glideTau: 0.0018, dest: lp });
  // Mode 3 (vỏ gỗ cứng ~1030 Hz) + độ dày thớ gỗ mít (~290 Hz) tắt cực nhanh, không ngân đuôi kim loại
  v.tone('sine', f0 * 2.2, t, 0.14 * A, { attack: 0.0002, tau: 0.0042, dest: lp });
  v.tone('sine', f0 * 0.62, t, 0.18 * A, { attack: 0.0004, tau: 0.0095, fromFreq: f0 * 0.65, glideTau: 0.0025, dest: lp });
  // Đầu dùi gỗ chạm mặt mõ: tiếng "c-" đanh gọn (không dùng nhiễu trầm gây tiếng "bụp" như trống da)
  v.noise(t, 0.34 * A, { type: 'bandpass', freq: 820 * o.pitch, q: 2.8, attack: 0.0002, tau: 0.0036, kind: 'pink', dest: lp });
  v.noise(t, 0.26 * A, { type: 'bandpass', freq: 1520 * o.pitch, q: 2.6, attack: 0.0002, tau: 0.002, dest: lp });
};

// ───────── Chuông đồng ─────────
const BELL_PARTS: [number, number, number][] = [
  // [tỉ số tần số, biên độ, hệ số thời gian ngân] — không hoàn toàn hài hoà như chuông thật
  [0.5, 0.55, 1.25],
  [1, 1, 1],
  [1.5, 0.3, 0.8],
  [2, 0.5, 0.7],
  [2.51, 0.2, 0.5],
  [3, 0.18, 0.45],
  [4.17, 0.1, 0.3],
  [5.43, 0.06, 0.22],
  [6.8, 0.035, 0.15],
];
function bellImpl(e: Engine, t: number, o: SfxCtx, big: boolean): void {
  const r = e.rnd;
  const v = new Voice(e, o.bus, { send: big ? 0.55 : 0.42, pan: (r() - 0.5) * 0.1 });
  const f0 = (big ? 165 : 330) * o.pitch;
  const tau0 = big ? 1.5 : 0.9;
  const base = (big ? 0.16 : 0.15) * o.vol;
  for (const [ratio, amp, tm] of BELL_PARTS) {
    const f = f0 * ratio;
    if (f > 9000) continue;
    const beat = (ratio < 1 ? 0.3 : 0.4) + r() * 1.0; // Hz — nhịp phách tạo tiếng ngân nga
    const tau = tau0 * tm;
    const att = ratio < 1.2 ? (big ? 0.012 : 0.006) : 0.002;
    v.tone('sine', f, t, base * amp * 0.62, { attack: att, tau });
    v.tone('sine', f + beat, t, base * amp * 0.38, { attack: att, tau: tau * 1.05 });
  }
  v.noise(t, 0.12 * o.vol, { type: 'bandpass', freq: big ? 500 : 900, q: 0.8, attack: 0.001, tau: 0.012 });
  if (big) v.noise(t, 0.1 * o.vol, { type: 'lowpass', freq: 300, q: 0.7, attack: 0.004, tau: 0.06 });
}
const bell: Fn = (e, t, o) => bellImpl(e, t, o, false);
const bellBig: Fn = (e, t, o) => bellImpl(e, t, o, true);

// ───────── Chuông gió ─────────
const CHIME_NOTES = [81, 85, 88, 90, 93, 95, 97];
const chime: Fn = (e, t, o) => {
  const r = e.rnd;
  const far = o.far;
  const v = new Voice(e, o.bus, { send: far ? 0.9 : 0.55, pan: (r() - 0.5) * 1.2 });
  const lp = lowpass(v, far ? 2000 : 5200);
  const n = 3 + Math.floor(r() * 3);
  let idx = Math.floor(r() * CHIME_NOTES.length);
  let tt = t;
  const a = (far ? 0.05 : 0.1) * o.vol;
  for (let i = 0; i < n; i++) {
    const f = midiToHz(CHIME_NOTES[idx]) * o.pitch;
    v.tone('sine', f, tt, a * (0.7 + r() * 0.3), { attack: 0.002, tau: 0.75, dest: lp });
    v.tone('sine', f * 2.76, tt, a * 0.18, { attack: 0.002, tau: 0.22, dest: lp });
    idx = Math.max(0, Math.min(CHIME_NOTES.length - 1, idx + (r() < 0.6 ? -1 : 1) * (1 + Math.floor(r() * 2))));
    tt += 0.08 + r() * 0.15;
  }
};

// ───────── Hạt gỗ ─────────
const bead: Fn = (e, t, o) => {
  const r = e.rnd;
  const v = new Voice(e, o.bus, { send: 0.03 });
  const lp = lowpass(v, 2800, 0.7);
  const hit = (tt: number, g: number, p: number): void => {
    const f = 430 * o.pitch * p * (1 + (r() - 0.5) * 0.02);
    v.tone('sine', f, tt, 0.28 * g * o.vol, { attack: 0.0004, tau: 0.0075, fromFreq: f * 1.09, glideTau: 0.0025, dest: lp });
    v.tone('sine', f * 1.85, tt, 0.11 * g * o.vol, { attack: 0.0003, tau: 0.004, dest: lp });
    v.noise(tt, 0.22 * g * o.vol, { type: 'bandpass', freq: 1650 * p, q: 2.0, attack: 0.0003, tau: 0.0022, dest: lp });
  };
  hit(t, 1, 1);
  hit(t + 0.028 + r() * 0.006, 0.38, 0.93);
};

// ───────── Hương ─────────
const incense: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.4 });
  v.noise(t, 0.12 * o.vol, { type: 'bandpass', freq: 5200, freqEnd: 2600, q: 0.6, attack: 0.05, tau: 0.2, dur: 0.9 });
  v.noise(t + 0.05, 0.05 * o.vol, { type: 'lowpass', freq: 700, q: 0.7, attack: 0.1, tau: 0.15, dur: 0.7 });
  smallBell(v, t + 0.14, 2093 * o.pitch, 0.05 * o.vol, 0.5);
};

// ───────── Hoa ─────────
const flower: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.5 });
  const notes = [76, 81, 85];
  notes.forEach((m, i) => {
    const f = midiToHz(m) * o.pitch;
    const tt = t + i * 0.075;
    v.tone('sine', f, tt, 0.13 * o.vol, { attack: 0.004, tau: 0.34 });
    v.tone('triangle', f * 2, tt, 0.03 * o.vol, { attack: 0.004, tau: 0.2 });
  });
  v.noise(t, 0.05 * o.vol, { type: 'bandpass', freq: 4000, q: 0.5, attack: 0.1, tau: 0.12, dur: 0.6 });
};

// ───────── Nến lách tách ─────────
const candle: Fn = (e, t, o) => {
  const r = e.rnd;
  const v = new Voice(e, o.bus, { send: 0.15 });
  v.noise(t, 0.14 * o.vol, { type: 'lowpass', freq: 550, q: 0.7, attack: 0.05, tau: 0.12, dur: 0.6 });
  const n = 7 + Math.floor(r() * 4);
  for (let i = 0; i < n; i++) {
    const tt = t + 0.04 + Math.pow(r(), 1.4) * 0.75;
    v.noise(tt, (0.1 + r() * 0.25) * o.vol, { type: 'bandpass', freq: 1800 + r() * 2600, q: 1.4, attack: 0.0005, tau: 0.002 + r() * 0.004 });
  }
};

// ───────── Đèn hoa đăng ─────────
const lantern: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.5 });
  v.noise(t, 0.5 * o.vol, { type: 'bandpass', freq: 350, freqEnd: 1500, q: 0.9, attack: 0.25, tau: 0.15, dur: 0.75 });
  v.noise(t, 0.25 * o.vol, { type: 'bandpass', freq: 500, q: 0.6, attack: 0.2, tau: 0.2, dur: 0.8, kind: 'pink' });
  smallBell(v, t + 0.2, 659 * o.pitch, 0.09 * o.vol, 1.0);
};

// ───────── Cúi lạy ─────────
const bow: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.3 });
  v.noise(t, 0.8 * o.vol, { type: 'bandpass', freq: 1300, q: 0.6, attack: 0.13, tau: 0.14, dur: 0.55 });
  v.noise(t + 0.26, 0.6 * o.vol, { type: 'bandpass', freq: 1000, q: 0.6, attack: 0.1, tau: 0.12, dur: 0.5 });
  v.tone('sine', 78 * o.pitch, t + 0.3, 0.1 * o.vol, { attack: 0.012, tau: 0.13, fromFreq: 125 * o.pitch, glideTau: 0.05 });
};

// ───────── Bấm nút ─────────
const click: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.08 });
  v.tone('sine', 1500 * o.pitch, t, 0.22 * o.vol, { attack: 0.001, tau: 0.012, fromFreq: 1900 * o.pitch, glideTau: 0.007 });
  v.noise(t, 0.07 * o.vol, { type: 'bandpass', freq: 3000, q: 1, attack: 0.0006, tau: 0.003 });
};

// ───────── Lên cấp ─────────
const levelUp: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.55 });
  const lp = lowpass(v, 4800);
  const chord = [69, 73, 76, 81, 85];
  chord.forEach((m, i) => {
    const f = midiToHz(m) * o.pitch;
    const tt = t + i * 0.1;
    v.tone('sine', f, tt, 0.15 * o.vol, { attack: 0.01, tau: 1.1, dest: lp });
    v.tone('triangle', f * 2, tt, 0.035 * o.vol, { attack: 0.01, tau: 0.5, dest: lp });
  });
  const tt = t + 0.55;
  v.tone('sine', midiToHz(69) * o.pitch, tt, 0.1 * o.vol, { attack: 0.25, tau: 0.9, dest: lp });
  v.tone('sine', midiToHz(76) * o.pitch, tt, 0.08 * o.vol, { attack: 0.25, tau: 0.9, dest: lp });
  v.tone('sine', midiToHz(88) * o.pitch, tt + 0.05, 0.05 * o.vol, { attack: 0.02, tau: 1.2, dest: lp });
  smallBell(v, tt, midiToHz(81) * o.pitch, 0.04 * o.vol, 1.2);
};

// ───────── Quét lá ─────────
const sweep: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.12, pan: -0.05 });
  [0, 0.55].forEach((d, i) => {
    v.noise(t + d, 0.2 * o.vol, { type: 'bandpass', freq: i ? 3200 : 1600, freqEnd: i ? 1600 : 3200, q: 0.7, attack: 0.14, tau: 0.1, dur: 0.5 });
    v.noise(t + d, 0.1 * o.vol, { type: 'bandpass', freq: 900, q: 0.5, attack: 0.12, tau: 0.1, dur: 0.5, kind: 'pink' });
  });
};

// ───────── Lọc cọc que tre ─────────
const que: Fn = (e, t, o) => {
  const r = e.rnd;
  const v = new Voice(e, o.bus, { send: 0.15 });
  const n = 11 + Math.floor(r() * 4);
  const times: number[] = [];
  for (let i = 0; i < n; i++) times.push(Math.pow(r(), 0.8) * 0.9);
  times.sort((a, b) => a - b);
  for (const d of times) {
    const f = (1100 + r() * 900) * o.pitch;
    const g = (0.1 + r() * 0.12) * o.vol;
    v.tone('sine', f, t + d, g, { attack: 0.0008, tau: 0.016, fromFreq: f * 1.08, glideTau: 0.005 });
    v.tone('sine', f * 2.3, t + d, g * 0.35, { attack: 0.0008, tau: 0.008 });
    v.noise(t + d, g * 0.6, { type: 'bandpass', freq: 2500, q: 2, attack: 0.0005, tau: 0.004 });
  }
  const f = 700 * o.pitch;
  v.tone('sine', f, t + 1.0, 0.3 * o.vol, { attack: 0.001, tau: 0.045, fromFreq: f * 1.07, glideTau: 0.01 });
  v.tone('sine', f * 1.5, t + 1.0, 0.1 * o.vol, { attack: 0.001, tau: 0.03 });
  v.noise(t + 1.0, 0.12 * o.vol, { type: 'bandpass', freq: 1500, q: 1.5, attack: 0.0006, tau: 0.005 });
};

// ───────── Nước ─────────
const splash: Fn = (e, t, o) => {
  const r = e.rnd;
  const v = new Voice(e, o.bus, { send: 0.3, pan: (r() - 0.5) * 0.3 });
  v.noise(t, 0.22 * o.vol, { type: 'lowpass', freq: 1700, freqEnd: 600, q: 0.7, attack: 0.012, tau: 0.2, dur: 0.8 });
  v.noise(t, 0.1 * o.vol, { type: 'bandpass', freq: 900, freqEnd: 2600, q: 1, attack: 0.02, tau: 0.15, dur: 0.6 });
  for (let i = 0; i < 9; i++) {
    const f = (500 + r() * 800) * o.pitch;
    v.tone('sine', f * 1.9, t + 0.02 + r() * 0.6, 0.055 * o.vol, { attack: 0.003, tau: 0.022, fromFreq: f, glideTau: 0.015 });
  }
};

// ───────── Dải lụa ─────────
const ribbon: Fn = (e, t, o) => {
  const v = new Voice(e, o.bus, { send: 0.35 });
  v.noise(t, 0.12 * o.vol, { type: 'bandpass', freq: 1500, freqEnd: 4500, q: 1.1, attack: 0.15, tau: 0.1, dur: 0.5 });
  v.tone('sine', 1760 * o.pitch, t + 0.14, 0.04 * o.vol, { attack: 0.01, tau: 0.5 });
  v.tone('sine', 2637 * o.pitch, t + 0.2, 0.025 * o.vol, { attack: 0.01, tau: 0.4 });
};

const TABLE: Record<Sfx, Fn> = {
  mo, bell, bellBig, bead, incense, flower, candle, lantern, bow, click, chime, levelUp, sweep, que, splash, ribbon,
};

/** Cân bằng độ lớn giữa các âm (đo bằng peak sau khi xuất WAV). */
const TRIM: Record<Sfx, number> = {
  mo: 0.72, bell: 1, bellBig: 1, bead: 0.95, incense: 1.8, flower: 0.9, candle: 2, lantern: 0.9,
  bow: 1, click: 1, chime: 1.6, levelUp: 0.55, sweep: 1.9, que: 0.8, splash: 1.9, ribbon: 2,
};

export function synthSfx(e: Engine, s: Sfx, t: number, o: SfxCtx): void {
  TABLE[s](e, t, { ...o, vol: o.vol * TRIM[s] });
}

export { smallBell };
