// Lõi âm thanh: đồ thị node dùng chung (hồi âm, nén, giới hạn), lớp Voice dọn node tự động, bộ lập lịch (pump).
// Chạy được trên cả AudioContext thật lẫn OfflineAudioContext (để xuất WAV kiểm thử).
import { makeNoiseBuffer, makeReverbIR, makeSoftClipCurve, mulberry32, type Rng } from './dsp';
import { synthSfx, SFX_PRIORITY } from './sfx';
import { Ambient } from './ambient';
import { ChantRadio } from './chant';
import type { Sfx } from '@/core/contracts';

export const MAX_VOICES = 16;

export interface EngineOptions {
  rng?: Rng;
  /** Bật mọi thứ ngay (không làm mờ dần) — dùng khi xuất WAV. */
  offline?: boolean;
}

export interface ToneOpts {
  attack?: number;
  /** hằng số thời gian suy giảm (s) */
  tau: number;
  /** tần số đầu (trượt về `freq` với hằng số `glideTau`) */
  fromFreq?: number;
  glideTau?: number;
  detune?: number;
  dest?: AudioNode;
}
export interface NoiseOpts {
  type: BiquadFilterType;
  freq: number;
  q?: number;
  /** tần số cuối của bộ lọc (quét theo hàm mũ trong `dur`) */
  freqEnd?: number;
  attack?: number;
  tau: number;
  dur?: number;
  kind?: 'white' | 'pink';
  dest?: AudioNode;
}

/** Một "tiếng" (voice): gom node, tự ngắt kết nối khi mọi nguồn đã kết thúc. */
export class Voice {
  readonly out: GainNode;
  readonly send: GainNode;
  private pan: StereoPannerNode | null = null;
  private pending = 0;
  private dead = false;
  private readonly tail: AudioNode[];

  constructor(readonly e: Engine, bus: AudioNode, opts: { send?: number; pan?: number } = {}) {
    const ctx = e.ctx;
    this.out = ctx.createGain();
    this.send = ctx.createGain();
    this.send.gain.value = opts.send ?? 0.2;
    this.tail = [this.out, this.send];
    let dryEnd: AudioNode = this.out;
    if (opts.pan) {
      this.pan = ctx.createStereoPanner();
      this.pan.pan.value = opts.pan;
      this.out.connect(this.pan);
      dryEnd = this.pan;
      this.tail.push(this.pan);
    }
    dryEnd.connect(bus);
    this.out.connect(this.send);
    this.send.connect(e.revInFor(bus));
  }

  /** Đăng ký nguồn; khi tất cả kết thúc, voice tự ngắt. */
  track(src: AudioScheduledSourceNode): void {
    this.pending++;
    src.onended = () => {
      if (--this.pending <= 0) this.dispose();
    };
  }

  dispose(): void {
    if (this.dead) return;
    this.dead = true;
    for (const n of this.tail) {
      try { n.disconnect(); } catch { /* đã ngắt */ }
    }
  }

  /** Dao động có bao hình (tấn công tuyến tính → suy giảm mũ). Trả về gain để chỉnh thêm. */
  tone(type: OscillatorType, freq: number, t: number, peak: number, o: ToneOpts): GainNode {
    const ctx = this.e.ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    const g = ctx.createGain();
    const a = o.attack ?? 0.003;
    if (o.fromFreq) {
      osc.frequency.setValueAtTime(o.fromFreq, t);
      osc.frequency.setTargetAtTime(freq, t, o.glideTau ?? 0.01);
    } else osc.frequency.setValueAtTime(freq, t);
    if (o.detune) osc.detune.value = o.detune;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setTargetAtTime(0, t + a, o.tau);
    osc.connect(g);
    g.connect(o.dest ?? this.out);
    this.track(osc);
    osc.start(t);
    osc.stop(t + a + o.tau * 8);
    return g;
  }

  /** Nhiễu lọc có bao hình. */
  noise(t: number, peak: number, o: NoiseOpts): GainNode {
    const ctx = this.e.ctx;
    const src = ctx.createBufferSource();
    const buf = this.e.noise(o.kind ?? 'white');
    src.buffer = buf;
    const a = o.attack ?? 0.002;
    const dur = o.dur ?? a + o.tau * 8;
    const off = this.e.rnd() * Math.max(0, buf.duration - dur - 0.2);
    const f = ctx.createBiquadFilter();
    f.type = o.type;
    f.Q.value = o.q ?? 1;
    f.frequency.setValueAtTime(o.freq, t);
    if (o.freqEnd) f.frequency.exponentialRampToValueAtTime(o.freqEnd, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setTargetAtTime(0, t + a, o.tau);
    src.connect(f);
    f.connect(g);
    g.connect(o.dest ?? this.out);
    this.track(src);
    src.start(t, off);
    src.stop(t + dur);
    return g;
  }
}

/** Vòng lặp mõ dựa trên lịch AudioContext. */
interface MoLoop {
  bpm: number;
  next: number;
  stopped: boolean;
}

export class Engine {
  readonly rnd: Rng;
  readonly offline: boolean;
  /** bus cho âm hiệu ứng / nền / niệm; sum → nén → giới hạn → master → bão hoà mềm → ra loa */
  readonly sfxBus: GainNode;
  readonly ambBus: GainNode;
  readonly chantBus: GainNode;
  readonly duck: GainNode; // hạ nền khi chuông lớn / mõ dày
  private readonly duckRev: GainNode;
  /** đầu vào hồi âm theo từng bus (để âm lượng/ducking của bus cũng áp lên phần hồi âm) */
  readonly ambRevIn: GainNode;
  readonly chantRevIn: GainNode;
  private readonly ambRevVol: GainNode;
  private readonly chantRevVol: GainNode;
  readonly reverbIn: GainNode;
  private readonly mix: GainNode;
  private readonly master: GainNode;
  private readonly noises = new Map<string, AudioBuffer>();
  private voices: { s: number; e: number }[] = [];
  private mos: MoLoop[] = [];
  private moHits: number[] = [];
  readonly ambient: Ambient;
  readonly chant: ChantRadio;

  private sfxOn = true;
  private masterOn = true;
  private volume = 0.6;
  private nightV = 0;

  constructor(readonly ctx: BaseAudioContext, opts: EngineOptions = {}) {
    this.rnd = opts.rng ?? Math.random;
    this.offline = !!opts.offline;

    this.mix = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 14;
    comp.ratio.value = 2.5;
    comp.attack.value = 0.012;
    comp.release.value = 0.25;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -3;
    lim.knee.value = 1;
    lim.ratio.value = 20;
    lim.attack.value = 0.002;
    lim.release.value = 0.12;
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    const clip = ctx.createWaveShaper();
    clip.curve = makeSoftClipCurve();
    clip.oversample = '2x';
    this.mix.connect(comp);
    comp.connect(lim);
    lim.connect(this.master);
    this.master.connect(clip);
    clip.connect(ctx.destination);

    // hồi âm dùng chung
    const conv = ctx.createConvolver();
    conv.buffer = makeReverbIR(ctx, 2.8, this.rnd);
    this.reverbIn = ctx.createGain();
    const rvOut = ctx.createGain();
    rvOut.gain.value = 0.8;
    this.reverbIn.connect(conv);
    conv.connect(rvOut);
    rvOut.connect(this.mix);

    this.sfxBus = ctx.createGain();
    this.sfxBus.connect(this.mix);
    this.duck = ctx.createGain();
    this.ambBus = ctx.createGain();
    this.ambBus.connect(this.duck);
    this.duck.connect(this.mix);
    this.chantBus = ctx.createGain();
    this.chantBus.connect(this.mix);
    this.ambRevIn = ctx.createGain();
    this.ambRevVol = ctx.createGain();
    this.duckRev = ctx.createGain();
    this.ambRevIn.connect(this.ambRevVol);
    this.ambRevVol.connect(this.duckRev);
    this.duckRev.connect(this.reverbIn);
    this.chantRevIn = ctx.createGain();
    this.chantRevVol = ctx.createGain();
    this.chantRevIn.connect(this.chantRevVol);
    this.chantRevVol.connect(this.reverbIn);

    this.ambient = new Ambient(this);
    this.chant = new ChantRadio(this);
    this.applyVolume(true);
  }

  /** bus tạm (nhóm niệm Phật…) → đầu vào hồi âm tương ứng */
  readonly revMap = new Map<AudioNode, AudioNode>();

  revInFor(bus: AudioNode): AudioNode {
    const m = this.revMap.get(bus);
    if (m) return m;
    return bus === this.ambBus ? this.ambRevIn : bus === this.chantBus ? this.chantRevIn : this.reverbIn;
  }

  now(): number {
    return this.ctx.currentTime;
  }

  /** Bộ đệm nhiễu dùng chung (tạo một lần). */
  noise(kind: 'white' | 'pink' | 'brown'): AudioBuffer {
    let b = this.noises.get(kind);
    if (!b) {
      b = makeNoiseBuffer(this.ctx, kind === 'white' ? 3 : 6, kind, this.rnd);
      this.noises.set(kind, b);
    }
    return b;
  }

  // ───────── cài đặt ─────────
  setEnabled(master: boolean, sfx: boolean): void {
    this.masterOn = master;
    this.sfxOn = sfx;
    const t = this.now();
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(master ? 0.9 : 0, t, 0.05);
  }
  setVolume(v: number): void {
    this.volume = Math.min(1, Math.max(0, v));
    this.applyVolume(false);
  }
  get ambientGain(): number {
    return Math.pow(this.volume, 1.5);
  }
  get radioGain(): number {
    return Math.min(1.6, 0.65 * Math.pow(this.volume / 0.6, 1.5));
  }
  private applyVolume(instant: boolean): void {
    const t = this.now();
    const set = (p: AudioParam, v: number): void => {
      if (instant || this.offline) p.setValueAtTime(v, t);
      else p.setTargetAtTime(v, t, 0.08);
    };
    set(this.ambBus.gain, this.ambientGain);
    set(this.ambRevVol.gain, this.ambientGain);
    set(this.chantBus.gain, this.radioGain);
    set(this.chantRevVol.gain, this.radioGain);
  }
  get night(): number {
    return this.nightV;
  }
  setNight(v: number, instant = false): void {
    this.nightV = Math.min(1, Math.max(0, v));
    this.ambient.applyNight(instant || this.offline);
  }

  // ───────── âm hiệu ứng ─────────
  private admit(t: number, dur: number, high: boolean): boolean {
    const now = this.now();
    this.voices = this.voices.filter((v) => v.e > now - 0.5);
    let n = 0;
    for (const v of this.voices) if (v.s <= t && t < v.e) n++;
    if (n >= MAX_VOICES && !high) return false;
    this.voices.push({ s: t, e: t + dur });
    return true;
  }

  /** Lên lịch một âm hiệu ứng tại thời điểm `t` (mặc định: ngay bây giờ). */
  play(s: Sfx, opts: { volume?: number; pitch?: number; t?: number } = {}): void {
    if (!this.sfxOn || !this.masterOn) return;
    const t = Math.max(opts.t ?? this.now() + 0.005, this.now());
    const vol = opts.volume ?? 1;
    const pitch = opts.pitch ?? 1;
    this.synth(s, t, vol, pitch);
  }

  /** Dùng nội bộ (không kiểm tra công tắc sfx): nền, chuông xa, mõ của radio… */
  synth(s: Sfx, t: number, vol: number, pitch: number, bus: AudioNode = this.sfxBus, far = false): void {
    const dur = SFX_PRIORITY[s].dur;
    if (!this.admit(t, dur, SFX_PRIORITY[s].high)) return;
    synthSfx(this, s, t, { vol, pitch, bus, far });
    if (s === 'bellBig') this.duckAt(t, 0.45, 0.6, 2.2);
    if (s === 'mo' && bus === this.sfxBus) this.noteMo(t);
  }

  private noteMo(t: number): void {
    this.moHits = this.moHits.filter((h) => h > t - 1.6);
    this.moHits.push(t);
    if (this.moHits.length >= 4) this.duckAt(t, 0.72, 0.5, 1.2);
  }

  private duckBase = 1;
  /** Khi radio niệm Phật đang phát, hạ nhẹ âm nền thiên nhiên để giọng niệm nổi hơn. */
  setRadioDuck(on: boolean): void {
    this.duckBase = on ? 0.55 : 1;
    const t = this.now();
    for (const g of [this.duck.gain, this.duckRev.gain]) {
      if (this.offline) g.setValueAtTime(this.duckBase, t);
      else g.setTargetAtTime(this.duckBase, t, 0.7);
    }
  }

  /** Hạ âm nền xuống `depth` trong lúc `hold`, rồi trả lại với hằng số `release`. */
  duckAt(t: number, depth: number, hold: number, release: number): void {
    for (const g of [this.duck.gain, this.duckRev.gain]) {
      g.setTargetAtTime(depth * this.duckBase, t, 0.05);
      g.setTargetAtTime(this.duckBase, t + hold, release * 0.4);
    }
  }

  // ───────── vòng lặp mõ ─────────
  startMoLoop(bpm: number, t0?: number): () => void {
    const loop: MoLoop = { bpm: Math.max(20, Math.min(240, bpm)), next: t0 ?? this.now() + 0.06, stopped: false };
    this.mos.push(loop);
    return () => {
      loop.stopped = true;
    };
  }

  // ───────── lập lịch ─────────
  /** Gọi định kỳ: lên lịch mọi sự kiện rơi trong [now, now+horizon]. */
  pump(horizon: number): void {
    const now = this.now();
    const until = now + horizon;
    for (const m of this.mos) {
      if (m.stopped) continue;
      const step = 60 / m.bpm;
      if (m.next < now - 0.02) m.next = now + 0.03; // sau khi bị treo (tab ẩn…) thì đồng bộ lại
      let i = 0;
      while (m.next < until && i++ < 400) {
        this.play('mo', { t: m.next, volume: 0.9 + this.rnd() * 0.2 });
        m.next += step;
      }
    }
    this.mos = this.mos.filter((m) => !m.stopped);
    this.ambient.pump(until);
    this.chant.pump(until);
  }

  dispose(): void {
    this.ambient.dispose();
    this.chant.dispose();
    this.mos = [];
    try { this.mix.disconnect(); this.master.disconnect(); } catch { /* bỏ qua */ }
  }
}

export { mulberry32 };
