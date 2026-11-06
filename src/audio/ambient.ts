// Âm nền: gió, suối, chim ban ngày, dế/ve ban đêm (crossfade theo setNight), chuông gió xa, drone pad ngũ cung La/Mi.
import type { Engine } from './engine';
import { Voice } from './engine';
import { midiToHz } from './dsp';

/** Nhóm node nền: dừng mượt rồi tự dọn. */
export class Group {
  readonly out: GainNode;
  private srcs: AudioScheduledSourceNode[] = [];
  private done = false;

  constructor(readonly e: Engine, dest: AudioNode, fadeIn: number, t: number) {
    this.out = e.ctx.createGain();
    this.out.gain.setValueAtTime(0, t);
    this.out.gain.linearRampToValueAtTime(1, t + fadeIn);
    this.out.connect(dest);
  }
  add<T extends AudioScheduledSourceNode>(s: T, t: number, offset?: number): T {
    if (offset !== undefined && 'buffer' in s) (s as unknown as AudioBufferSourceNode).start(t, offset);
    else s.start(t);
    this.srcs.push(s);
    return s;
  }
  stop(t: number, fade: number): void {
    if (this.done) return;
    this.done = true;
    this.out.gain.cancelScheduledValues(t);
    this.out.gain.setTargetAtTime(0, t, fade / 4);
    let n = this.srcs.length;
    const end = t + fade * 1.6;
    for (const s of this.srcs) {
      s.onended = () => {
        if (--n <= 0) {
          try { this.out.disconnect(); } catch { /* đã ngắt */ }
        }
      };
      try { s.stop(end); } catch { /* đã dừng */ }
    }
  }
}

/** Tiện ích tạo nguồn nhiễu lặp với điểm bắt đầu ngẫu nhiên. */
export function loopNoise(e: Engine, kind: 'white' | 'pink' | 'brown'): AudioBufferSourceNode {
  const s = e.ctx.createBufferSource();
  s.buffer = e.noise(kind);
  s.loop = true;
  return s;
}

function lfo(e: Engine, g: Group, t: number, rate: number, depth: number, target: AudioParam, type: OscillatorType = 'sine'): OscillatorNode {
  const o = e.ctx.createOscillator();
  o.type = type;
  o.frequency.value = rate;
  const gn = e.ctx.createGain();
  gn.gain.value = depth;
  o.connect(gn);
  gn.connect(target);
  return g.add(o, t);
}

const PAD_UPPER = [61, 64, 66, 69, 71]; // C#4 E4 F#4 A4 B4

export class Ambient {
  private natureOn = false;
  private padOn = false;
  private nature: Group | null = null;
  private pad: Group | null = null;
  private nextBird = 0;
  private nextChime = 0;
  private nextPad = 0;
  private padOscs: { a: OscillatorNode; b: OscillatorNode; note: number }[] = [];
  // các nút chỉnh theo ngày/đêm
  private windMix: GainNode | null = null;
  private insectMix: GainNode | null = null;
  private padLp: BiquadFilterNode | null = null;

  constructor(private readonly e: Engine) {}

  get active(): boolean {
    return this.natureOn;
  }

  setActive(on: boolean): void {
    if (on === this.natureOn) return;
    this.natureOn = on;
    const e = this.e;
    const t = e.now() + 0.02;
    if (on) {
      this.buildNature(t);
      this.nextBird = t + 1 + e.rnd() * 2;
      this.nextChime = t + 6 + e.rnd() * 8;
    } else {
      this.nature?.stop(t, 1.2);
      this.nature = null;
      this.windMix = this.insectMix = null;
    }
  }

  setPad(on: boolean): void {
    if (on === this.padOn) return;
    this.padOn = on;
    const e = this.e;
    const t = e.now() + 0.02;
    if (on) {
      this.buildPad(t);
      this.nextPad = t + 10 + e.rnd() * 6;
    } else {
      this.pad?.stop(t, 1.5);
      this.pad = null;
      this.padOscs = [];
      this.padLp = null;
    }
  }

  applyNight(instant: boolean): void {
    const e = this.e;
    const t = e.now();
    const n = e.night;
    const set = (p: AudioParam, v: number): void => {
      if (instant) p.setValueAtTime(v, t);
      else p.setTargetAtTime(v, t, 1.4);
    };
    if (this.windMix) set(this.windMix.gain, 1 - 0.35 * n);
    if (this.insectMix) set(this.insectMix.gain, n);
    if (this.padLp) set(this.padLp.frequency, 900 - 250 * n);
  }

  // ───────── dựng các lớp ─────────
  private buildNature(t: number): void {
    const e = this.e;
    const ctx = e.ctx;
    const fade = e.offline ? 0.05 : 2.5;
    const g = new Group(e, e.ambBus, fade, t);
    this.nature = g;

    // gió: nhiễu hồng lọc băng, trượt chậm
    const windMix = ctx.createGain();
    windMix.gain.value = 1;
    windMix.connect(g.out);
    this.windMix = windMix;
    const wsrc = g.add(loopNoise(e, 'pink'), t);
    const wbp = ctx.createBiquadFilter();
    wbp.type = 'bandpass';
    wbp.frequency.value = 380;
    wbp.Q.value = 0.6;
    const wlp = ctx.createBiquadFilter();
    wlp.type = 'lowpass';
    wlp.frequency.value = 1500;
    const wg = ctx.createGain();
    wg.gain.value = 0.55;
    wsrc.connect(wbp);
    wbp.connect(wlp);
    wlp.connect(wg);
    wg.connect(windMix);
    lfo(e, g, t, 0.067, 170, wbp.frequency);
    lfo(e, g, t, 0.043, 0.2, wg.gain);
    // gió cao nhẹ lùa lá
    const w2 = g.add(loopNoise(e, 'white'), t);
    const w2bp = ctx.createBiquadFilter();
    w2bp.type = 'bandpass';
    w2bp.frequency.value = 2600;
    w2bp.Q.value = 0.9;
    const w2g = ctx.createGain();
    w2g.gain.value = 0.045;
    w2.connect(w2bp);
    w2bp.connect(w2g);
    w2g.connect(windMix);
    lfo(e, g, t, 0.09, 0.035, w2g.gain);

    // suối róc rách
    const stream = ctx.createGain();
    stream.gain.value = 0.9;
    stream.connect(g.out);
    const mk = (f: number, q: number, base: number, r1: number, d1: number, r2: number, d2: number, fm: number): void => {
      const s = g.add(loopNoise(e, 'white'), t);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = f;
      bp.Q.value = q;
      const gg = ctx.createGain();
      gg.gain.value = base;
      s.connect(bp);
      bp.connect(gg);
      gg.connect(stream);
      lfo(e, g, t, r1, d1, gg.gain);
      lfo(e, g, t, r2, d2, gg.gain);
      lfo(e, g, t, r1 * 0.37, fm, bp.frequency);
    };
    mk(950, 1.3, 0.06, 4.3, 0.025, 7.9, 0.015, 220);
    mk(2300, 2.5, 0.03, 6.7, 0.015, 11.3, 0.01, 450);
    mk(520, 1.8, 0.035, 2.9, 0.015, 5.1, 0.01, 120);

    // côn trùng ban đêm (độ lớn theo night)
    const insects = ctx.createGain();
    insects.gain.value = e.night;
    insects.connect(g.out);
    this.insectMix = insects;
    const cricket = (f: number, pulse: number, group: number, level: number): void => {
      const car = g.add(ctx.createOscillator(), t);
      car.type = 'sine';
      car.frequency.value = f;
      const am = ctx.createGain();
      am.gain.value = 0.5;
      const gate = ctx.createGain();
      gate.gain.value = 0.5;
      const lv = ctx.createGain();
      lv.gain.value = level;
      car.connect(am);
      am.connect(gate);
      gate.connect(lv);
      lv.connect(insects);
      lfo(e, g, t, pulse, 0.5, am.gain);
      const sq = g.add(ctx.createOscillator(), t);
      sq.type = 'square';
      sq.frequency.value = group;
      const sl = ctx.createBiquadFilter();
      sl.type = 'lowpass';
      sl.frequency.value = 30;
      const sg = ctx.createGain();
      sg.gain.value = 0.5;
      sq.connect(sl);
      sl.connect(sg);
      sg.connect(gate.gain);
    };
    cricket(4300, 23, 1.6, 0.022);
    cricket(5050, 28, 1.05, 0.016);
    cricket(3700, 19, 0.75, 0.014);
    // ve: nhiễu băng hẹp, điều biên nhanh, nổi chìm chậm
    const cs = g.add(loopNoise(e, 'white'), t);
    const cbp = ctx.createBiquadFilter();
    cbp.type = 'bandpass';
    cbp.frequency.value = 5600;
    cbp.Q.value = 6;
    const cam = ctx.createGain();
    cam.gain.value = 0.5;
    const cswell = ctx.createGain();
    cswell.gain.value = 0.5;
    const cl = ctx.createGain();
    cl.gain.value = 0.05;
    cs.connect(cbp);
    cbp.connect(cam);
    cam.connect(cswell);
    cswell.connect(cl);
    cl.connect(insects);
    lfo(e, g, t, 58, 0.5, cam.gain);
    lfo(e, g, t, 0.06, 0.5, cswell.gain);
    this.applyNight(true);
  }

  private buildPad(t: number): void {
    const e = this.e;
    const ctx = e.ctx;
    const fade = e.offline ? 0.05 : 4;
    const g = new Group(e, e.ambBus, fade, t);
    this.pad = g;
    const padBus = ctx.createGain();
    padBus.gain.value = 0.09;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900 - 250 * e.night;
    lp.Q.value = 0.5;
    this.padLp = lp;
    lfo(e, g, t, 0.03, 180, lp.frequency);
    lp.connect(padBus);
    padBus.connect(g.out);
    // hồi âm lấy sau bao hình của nhóm để tắt dần cùng lúc
    const send = ctx.createGain();
    send.gain.value = 0.7;
    g.out.connect(send);
    send.connect(e.ambRevIn);

    const notes = [45, 52, 57, 61, 64];
    const amps = [0.6, 0.45, 0.4, 0.26, 0.24];
    this.padOscs = [];
    notes.forEach((m, i) => {
      const f = midiToHz(m);
      const vg = ctx.createGain();
      vg.gain.value = amps[i] * 0.62;
      vg.connect(lp);
      const a = g.add(ctx.createOscillator(), t);
      a.type = 'triangle';
      a.frequency.value = f;
      a.detune.value = -4;
      const b = g.add(ctx.createOscillator(), t);
      b.type = 'sine';
      b.frequency.value = f;
      b.detune.value = 5;
      a.connect(vg);
      const bg = ctx.createGain();
      bg.gain.value = 0.7;
      b.connect(bg);
      bg.connect(vg);
      lfo(e, g, t, 0.04 + e.rnd() * 0.07, amps[i] * 0.34, vg.gain);
      this.padOscs.push({ a, b, note: m });
    });
  }

  // ───────── lập lịch ─────────
  pump(until: number): void {
    if (this.natureOn) {
      let i = 0;
      while (this.nextBird < until && i++ < 200) {
        const day = 1 - this.e.night;
        if (day > 0.15) this.bird(this.nextBird, day);
        this.nextBird += 1.4 + this.e.rnd() * 5.5;
      }
      while (this.nextChime < until && i++ < 400) {
        this.e.synth('chime', this.nextChime, 0.5 + this.e.rnd() * 0.25, 0.8 + this.e.rnd() * 0.25, this.e.ambBus, true);
        this.nextChime += 20 + this.e.rnd() * 25;
      }
    }
    if (this.padOn) {
      let i = 0;
      while (this.nextPad < until && i++ < 100) {
        const v = this.padOscs[3 + Math.floor(this.e.rnd() * 2)];
        if (v) {
          let n = PAD_UPPER[Math.floor(this.e.rnd() * PAD_UPPER.length)];
          if (n === v.note) n = PAD_UPPER[(PAD_UPPER.indexOf(n) + 2) % PAD_UPPER.length];
          const f = midiToHz(n);
          v.a.frequency.setTargetAtTime(f, this.nextPad, 1.6);
          v.b.frequency.setTargetAtTime(f, this.nextPad, 1.6);
          v.note = n;
        }
        this.nextPad += 11 + this.e.rnd() * 9;
      }
    }
  }

  /** Một tiếng chim: biến thể tí-tí / huýt xuống / rung. */
  private bird(t: number, day: number): void {
    const e = this.e;
    const r = e.rnd;
    const v = new Voice(e, e.ambBus, { send: 0.32, pan: (r() - 0.5) * 1.4 });
    const lp = e.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 5800;
    lp.connect(v.out);
    const peak = 0.045 * day * (0.7 + r() * 0.5);
    const kind = Math.floor(r() * 3);
    const chirp = (tt: number, f0: number, f1: number, dur: number, fmRate = 0, fmDepth = 0): void => {
      const osc = e.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0, tt);
      osc.frequency.exponentialRampToValueAtTime(f1, tt + dur);
      const g = e.ctx.createGain();
      g.gain.setValueAtTime(0, tt);
      g.gain.linearRampToValueAtTime(peak, tt + dur * 0.18);
      g.gain.linearRampToValueAtTime(0, tt + dur);
      osc.connect(g);
      g.connect(lp);
      v.track(osc);
      osc.start(tt);
      osc.stop(tt + dur + 0.01);
      if (fmRate) {
        const m = e.ctx.createOscillator();
        m.frequency.value = fmRate;
        const mg = e.ctx.createGain();
        mg.gain.value = fmDepth;
        m.connect(mg);
        mg.connect(osc.frequency);
        v.track(m);
        m.start(tt);
        m.stop(tt + dur + 0.01);
      }
    };
    if (kind === 0) {
      const n = 3 + Math.floor(r() * 3);
      let f = 3200 + r() * 700;
      for (let i = 0; i < n; i++) {
        chirp(t + i * 0.13, f, f * 1.12, 0.06);
        f *= 1.05;
      }
    } else if (kind === 1) {
      const f = 3000 + r() * 800;
      chirp(t, f, f * 0.7, 0.16);
      chirp(t + 0.24, f * 0.95, f * 0.62, 0.2);
    } else {
      const f = 2700 + r() * 600;
      chirp(t, f, f * 1.1, 0.5, 26 + r() * 8, 420);
      chirp(t + 0.62, f * 1.1, f * 0.9, 0.14);
    }
  }

  dispose(): void {
    this.setActive(false);
    this.setPad(false);
  }
}
