// Radio niệm Phật tổng hợp: mõ 80 bpm + giọng "A Di Đà Phật" bằng formant synth (sawtooth → bộ lọc formant) + drone + chuông nhỏ.
import type { Engine } from './engine';
import { Voice } from './engine';
import { Group, loopNoise } from './ambient';
import { midiToHz, cents } from './dsp';
import { DEFAULT_CHANT_VOICE } from './voices';

type Vowel = 'a' | 'i' | 'e';
/** F1, F2, F3 (Hz) cho giọng nam; nhân với `fs` cho giọng khác. */
const FORMANTS: Record<Vowel, [number, number, number]> = {
  a: [800, 1150, 2750],
  i: [310, 2250, 2950],
  e: [640, 1080, 2600], // /ɐ/ trong "Phật"
};
const F_GAIN = [1, 0.62, 0.28];
const F_BW = [95, 120, 180];

interface Syl {
  vowel: Vowel;
  frac: number; // phần của một nhịp mà âm tiết ngân
  onset: 'none' | 'd' | 'ph';
  stop: boolean; // kết thúc bằng phụ âm tắc (t)
}
const SYLS: Syl[] = [
  { vowel: 'a', frac: 0.8, onset: 'none', stop: false }, // A
  { vowel: 'i', frac: 0.8, onset: 'd', stop: false }, // Di
  { vowel: 'a', frac: 0.8, onset: 'd', stop: false }, // Đà
  { vowel: 'e', frac: 0.58, onset: 'ph', stop: true }, // Phật
];
/** Độ cao (nửa cung trên chủ âm La) cho 4 âm tiết; đổi nhẹ từng vòng, kết về chủ âm. */
const PATTERNS = [
  [7, 7, 4, 0],
  [7, 7, 4, 0],
  [7, 9, 7, 4],
  [7, 7, 4, 0],
];

interface Layer {
  base: number; // MIDI của chủ âm
  fs: number; // thang formant
  g: number;
  pan: number;
  det: number; // cent
  jitter: number; // giây
  vib: number; // độ sâu rung (tỉ lệ)
  bwScale: number;
  prev: number; // cao độ âm tiết trước (MIDI)
}
interface VoiceDef {
  layers: Omit<Layer, 'prev'>[];
  wet: number;
  bells: boolean;
  /** mõ dày hơn (chuông mõ không lời) */
  moLoud: number;
}
const VOICE_DEFS: Record<string, VoiceDef> = {
  'nam-tram': {
    layers: [{ base: 45, fs: 0.92, g: 1, pan: 0, det: 0, jitter: 0, vib: 0.005, bwScale: 1 }],
    wet: 0.35, bells: true, moLoud: 0.7,
  },
  'nu-trong': {
    layers: [{ base: 57, fs: 1.17, g: 0.62, pan: 0, det: 0, jitter: 0, vib: 0.008, bwScale: 1.4 }],
    wet: 0.42, bells: true, moLoud: 0.65,
  },
  'hop-xuong': {
    layers: [
      { base: 45, fs: 0.92, g: 0.62, pan: -0.35, det: -6, jitter: 0.012, vib: 0.005, bwScale: 1 },
      { base: 45, fs: 0.95, g: 0.55, pan: 0.3, det: 7, jitter: 0.03, vib: 0.006, bwScale: 1 },
      { base: 57, fs: 1.15, g: 0.45, pan: -0.15, det: -5, jitter: 0.02, vib: 0.008, bwScale: 1.4 },
      { base: 57, fs: 1.2, g: 0.42, pan: 0.45, det: 8, jitter: 0.04, vib: 0.008, bwScale: 1.4 },
    ],
    wet: 0.85, bells: true, moLoud: 0.6,
  },
  'chuong-mo': { layers: [], wet: 0.5, bells: true, moLoud: 1.6 },
};

const BPM = 80;

export class ChantRadio {
  private on = false;
  private voiceId = DEFAULT_CHANT_VOICE;
  private group: Group | null = null;
  private layers: Layer[] = [];
  private def: VoiceDef = VOICE_DEFS[DEFAULT_CHANT_VOICE];
  private next = 0;
  private beat = 0;
  private rnd: () => number;

  constructor(private readonly e: Engine) {
    this.rnd = e.rnd;
  }

  get active(): boolean {
    return this.on;
  }

  set(on: boolean, voice?: string): void {
    const v = voice && VOICE_DEFS[voice] ? voice : voice ? DEFAULT_CHANT_VOICE : this.voiceId;
    if (on && this.on && v === this.voiceId) return;
    if (!on && !this.on) {
      this.voiceId = v;
      return;
    }
    if (this.on) this.stopGroup();
    this.voiceId = v;
    this.on = on;
    if (on) this.startGroup();
    this.e.setRadioDuck(on);
  }

  private stopGroup(): void {
    const g = this.group;
    if (!g) return;
    const e = this.e;
    g.stop(e.now(), e.offline ? 0.05 : 0.9);
    e.revMap.delete(g.out);
    this.group = null;
  }

  private startGroup(): void {
    const e = this.e;
    const ctx = e.ctx;
    const t = e.now() + 0.05;
    this.def = VOICE_DEFS[this.voiceId];
    this.layers = this.def.layers.map((l) => ({ ...l, prev: l.base + 7 }));
    const g = new Group(e, e.chantBus, e.offline ? 0.05 : 1.2, t);
    e.revMap.set(g.out, e.chantRevIn);
    this.group = g;
    // hồi âm của cả nhóm (giọng nhiều → vang hơn), tắt dần cùng nhóm
    const gwet = ctx.createGain();
    gwet.gain.value = this.def.wet;
    g.out.connect(gwet);
    gwet.connect(e.chantRevIn);
    // drone nền: La1 + Mi2 + La2 êm
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 520;
    const dg = ctx.createGain();
    dg.gain.value = 0.07;
    lp.connect(dg);
    dg.connect(g.out);
    const dsend = ctx.createGain();
    dsend.gain.value = 0.5;
    dg.connect(dsend);
    dsend.connect(e.chantRevIn);
    [[55, 'sine', 0.3], [82.41, 'sine', 0.35], [110, 'triangle', 0.35], [164.81, 'sine', 0.15]].forEach(([f, ty, a], i) => {
      const o = g.add(ctx.createOscillator(), t);
      o.type = ty as OscillatorType;
      o.frequency.value = f as number;
      o.detune.value = (i - 1.5) * 3;
      const vg = ctx.createGain();
      vg.gain.value = a as number;
      o.connect(vg);
      vg.connect(lp);
      const l = g.add(ctx.createOscillator(), t);
      l.frequency.value = 0.05 + i * 0.017;
      const lg = ctx.createGain();
      lg.gain.value = (a as number) * 0.3;
      l.connect(lg);
      lg.connect(vg.gain);
    });
    this.next = t + 0.2;
    this.beat = 0;
  }

  pump(until: number): void {
    if (!this.on || !this.group) return;
    const step = 60 / BPM;
    const now = this.e.now();
    if (this.next < now - 0.05) this.next = now + 0.05;
    let n = 0;
    while (this.next < until && n++ < 64) {
      this.doBeat(this.next, this.beat);
      this.next += step;
      this.beat++;
    }
  }

  private doBeat(t: number, b: number): void {
    const e = this.e;
    const g = this.group!;
    const idx = b % 4;
    const phrase = Math.floor(b / 4);
    const def = this.def;
    // mõ giữ nhịp
    e.synth('mo', t, (idx === 0 ? 0.95 : 0.7) * def.moLoud * (0.92 + this.rnd() * 0.16), 1, g.out);
    // chuông nhỏ đầu mỗi 4 vòng
    if (def.bells && b % 16 === 0) e.synth('bell', t, 0.32 * (def.layers.length ? 1 : 2.2), 0.75, g.out);
    if (!def.layers.length && b % 8 === 4) e.synth('chime', t + 0.05, 0.9, 0.9, g.out);
    if (!def.layers.length) return;
    const semis = PATTERNS[phrase % PATTERNS.length][idx];
    for (const l of this.layers) this.syllable(l, SYLS[idx], semis, t + l.jitter * (0.4 + this.rnd()), 60 / BPM, g);
  }

  private syllable(l: Layer, syl: Syl, semis: number, t: number, step: number, g: Group): void {
    const e = this.e;
    const ctx = e.ctx;
    const v = new Voice(e, g.out, { send: 0, pan: l.pan });
    const dur = step * syl.frac;
    const target = l.base + semis;
    const f1 = midiToHz(target) * cents(l.det);
    const f0 = midiToHz(l.prev) * cents(l.det);
    l.prev = target;
    const env = ctx.createGain();
    const peak = l.g * 0.9;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(peak, t + 0.07);
    env.gain.linearRampToValueAtTime(peak * 0.78, t + dur * 0.7);
    const relStart = t + dur - (syl.stop ? 0.03 : 0.14);
    env.gain.setValueAtTime(peak * 0.78, relStart);
    env.gain.setTargetAtTime(0, relStart, syl.stop ? 0.012 : 0.05);
    env.connect(v.out);

    const src = ctx.createOscillator();
    src.type = 'sawtooth';
    src.frequency.setValueAtTime(f0, t);
    src.frequency.setTargetAtTime(f1, t + 0.01, 0.035);
    // rung giọng, vào chậm
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.1 + this.rnd() * 0.8;
    const vg = ctx.createGain();
    vg.gain.setValueAtTime(0, t);
    vg.gain.linearRampToValueAtTime(f1 * l.vib, t + dur * 0.6);
    vib.connect(vg);
    vg.connect(src.frequency);
    const pre = ctx.createBiquadFilter();
    pre.type = 'lowpass';
    pre.frequency.value = 3600;
    pre.Q.value = 0.5;
    src.connect(pre);
    const fm = FORMANTS[syl.vowel];
    for (let k = 0; k < 3; k++) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      const fc = fm[k] * l.fs;
      bp.frequency.value = fc;
      bp.Q.value = fc / (F_BW[k] * l.bwScale);
      const fg = ctx.createGain();
      fg.gain.value = F_GAIN[k] * 1.1;
      pre.connect(bp);
      bp.connect(fg);
      fg.connect(env);
    }
    // hơi thở nhẹ qua formant 2
    const end = t + dur + 0.5;
    v.track(src);
    v.track(vib);
    src.start(t);
    vib.start(t);
    src.stop(end);
    vib.stop(end);
    if (syl.onset === 'ph') v.noise(t - 0.045, 0.05 * l.g, { type: 'highpass', freq: 3600, q: 0.7, attack: 0.012, tau: 0.03 });
    if (syl.onset === 'd') v.noise(t, 0.015 * l.g, { type: 'bandpass', freq: 900, q: 1, attack: 0.004, tau: 0.015 });
    if (syl.stop) v.noise(t + dur - 0.01, 0.04 * l.g, { type: 'bandpass', freq: 3800, q: 1.5, attack: 0.001, tau: 0.01 });
    // hơi thở
    const br = loopNoise(e, 'white');
    const bbp = ctx.createBiquadFilter();
    bbp.type = 'bandpass';
    bbp.frequency.value = fm[1] * l.fs;
    bbp.Q.value = 2;
    const bg = ctx.createGain();
    bg.gain.value = 0.045;
    br.connect(bbp);
    bbp.connect(bg);
    bg.connect(env);
    v.track(br);
    br.start(t, this.rnd() * 2);
    br.stop(end);
  }

  dispose(): void {
    this.set(false);
  }
}
