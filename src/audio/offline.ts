// Xuất âm thanh bằng OfflineAudioContext (dùng để kiểm thử/phân tích, không nằm trong luồng chạy chính).
import { Engine } from './engine';
import { mulberry32 } from './dsp';
import { CHANT_VOICES } from './voices';
import type { Sfx } from '@/core/contracts';

export interface RenderResult {
  sampleRate: number;
  left: Float32Array;
  right: Float32Array;
}
export interface RenderSpec {
  name: string;
  dur: number;
  /** Lên lịch mọi thứ trên engine (thời gian bắt đầu = 0). */
  setup(e: Engine): void;
}

const SFX_LIST: [Sfx, number][] = [
  ['mo', 1.2], ['bell', 10], ['bellBig', 14], ['bead', 1], ['incense', 3], ['flower', 4], ['candle', 2.5],
  ['lantern', 4], ['bow', 2], ['click', 1], ['chime', 8], ['levelUp', 7], ['sweep', 2.5], ['que', 2.5],
  ['splash', 2.5], ['ribbon', 2.5], ['cluck', 1.5],
];

export const SPECS: RenderSpec[] = [
  ...SFX_LIST.map(([s, dur]): RenderSpec => ({ name: `sfx-${s}`, dur, setup: (e) => e.play(s, { t: 0.1 }) })),
  { name: 'sfx-mo-pitch', dur: 2, setup: (e) => { [0.8, 1, 1.25].forEach((p, i) => e.play('mo', { t: 0.1 + i * 0.5, pitch: p })); } },
  { name: 'moloop-80', dur: 12, setup: (e) => { e.startMoLoop(80, 0.1); } },
  { name: 'moloop-120', dur: 10, setup: (e) => { e.startMoLoop(120, 0.1); } },
  { name: 'ambient-day', dur: 40, setup: (e) => { e.setNight(0, true); e.ambient.setActive(true); e.ambient.setPad(true); } },
  { name: 'ambient-night', dur: 40, setup: (e) => { e.setNight(1, true); e.ambient.setActive(true); e.ambient.setPad(true); } },
  { name: 'ambient-nature-only', dur: 20, setup: (e) => { e.setNight(0, true); e.ambient.setActive(true); } },
  { name: 'ambient-night-nature', dur: 20, setup: (e) => { e.setNight(1, true); e.ambient.setActive(true); } },
  { name: 'ambient-pad-only', dur: 24, setup: (e) => { e.ambient.setPad(true); } },
  {
    name: 'duck-bellbig-over-ambient', dur: 18,
    setup: (e) => { e.setNight(0, true); e.ambient.setActive(true); e.ambient.setPad(true); e.play('bellBig', { t: 6 }); },
  },
  ...CHANT_VOICES.map((v): RenderSpec => ({ name: `chant-${v.id}`, dur: 30, setup: (e) => { e.chant.set(true, v.id); } })),
  {
    name: 'stress-voices', dur: 6,
    setup: (e) => {
      const all: Sfx[] = ['mo', 'bell', 'bead', 'incense', 'flower', 'candle', 'lantern', 'bow', 'click', 'chime', 'levelUp', 'sweep', 'que', 'splash', 'ribbon', 'bellBig'];
      const r = mulberry32(7);
      for (let i = 0; i < 80; i++) e.play(all[Math.floor(r() * all.length)], { t: 0.1 + r() * 2.5 });
    },
  },
  {
    name: 'everything', dur: 40,
    setup: (e) => {
      e.setNight(0.3, true);
      e.ambient.setActive(true);
      e.ambient.setPad(true);
      e.chant.set(true, 'hop-xuong');
      const all: Sfx[] = ['mo', 'bell', 'bead', 'incense', 'flower', 'candle', 'lantern', 'bow', 'click', 'chime', 'levelUp', 'sweep', 'que', 'splash', 'ribbon', 'bellBig'];
      const r = mulberry32(11);
      for (let i = 0; i < 60; i++) e.play(all[Math.floor(r() * all.length)], { t: 1 + r() * 30 });
    },
  },
];

export async function renderSpec(spec: RenderSpec, sampleRate = 44100, seed = 1234): Promise<RenderResult> {
  const ctx = new OfflineAudioContext(2, Math.ceil(spec.dur * sampleRate), sampleRate);
  const e = new Engine(ctx, { rng: mulberry32(seed), offline: true });
  spec.setup(e);
  e.pump(spec.dur);
  const buf = await ctx.startRendering();
  return { sampleRate, left: buf.getChannelData(0).slice(), right: buf.getChannelData(1).slice() };
}

/** WAV 16-bit PCM stereo. */
export function encodeWav16(r: RenderResult): Uint8Array {
  const n = r.left.length;
  const out = new Uint8Array(44 + n * 4);
  const dv = new DataView(out.buffer);
  const w = (o: number, s: string): void => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
  dv.setUint32(24, r.sampleRate, true); dv.setUint32(28, r.sampleRate * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true);
  w(36, 'data'); dv.setUint32(40, n * 4, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    for (const ch of [r.left, r.right]) {
      const s = Math.max(-1, Math.min(1, ch[i]));
      dv.setInt16(o, Math.round(s < 0 ? s * 32768 : s * 32767), true);
      o += 2;
    }
  }
  return out;
}

export function toBase64(b: Uint8Array): string {
  let s = '';
  const CH = 0x8000;
  for (let i = 0; i < b.length; i += CH) s += String.fromCharCode(...b.subarray(i, i + CH));
  return btoa(s);
}
