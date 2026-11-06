// Radio "Nghe niệm Phật":
// - Với các giọng có tệp thu âm thật (`nam-tram`, `nu-trong`, `hop-xuong`, hoặc tệp riêng trong `public/chant/`):
//   giải mã qua WebAudio để lặp liền mạch không khe hở (hoặc phát luồng `<audio>` nếu tệp > 8MB), tự hoà âm & chỉnh âm lượng trên cả iOS/Android.
// - Với chế độ `chuong-mo` (hoặc dự phòng khi mất mạng / xuất WAV ngoại tuyến):
//   nhịp mõ gỗ mít ấm + chuông đồng + chuông gió và nền thiền êm dịu (không dùng sóng răng cưa giả giọng robot).
import type { Engine } from './engine';
import { Group } from './ambient';
import { DEFAULT_CHANT_VOICE, findChantVoice, type ChantVoiceInfo } from './voices';

const MAX_DECODE_BYTES = 8 * 1024 * 1024;
const MAX_BUFFER_CACHE = 4;

interface InstrumentalProfile {
  bpm: number;
  moVol: number;
  moPitch: number;
  bellPitch: number;
  droneGain: number;
}

const INST_PROFILES: Record<string, InstrumentalProfile> = {
  'chuong-mo': { bpm: 72, moVol: 1.15, moPitch: 1, bellPitch: 0.85, droneGain: 0.022 },
  'nam-tram': { bpm: 68, moVol: 1.1, moPitch: 0.96, bellPitch: 0.78, droneGain: 0.028 },
  'nu-trong': { bpm: 76, moVol: 1.0, moPitch: 1.04, bellPitch: 1.0, droneGain: 0.025 },
  'hop-xuong': { bpm: 72, moVol: 1.12, moPitch: 1.0, bellPitch: 0.88, droneGain: 0.03 },
};

export class ChantRadio {
  private on = false;
  private voiceId = DEFAULT_CHANT_VOICE;
  private activeUrl = '';
  private group: Group | null = null;
  private streamEl: HTMLAudioElement | null = null;
  private instrumental = false;
  private inst: InstrumentalProfile = INST_PROFILES['chuong-mo']!;
  private next = 0;
  private beat = 0;
  private seq = 0;
  private readonly rnd: () => number;
  private readonly cache = new Map<string, AudioBuffer>();

  constructor(private readonly e: Engine) {
    this.rnd = e.rnd;
  }

  get active(): boolean {
    return this.on;
  }

  set(on: boolean, voice?: string): void {
    const info = findChantVoice(voice ?? this.voiceId);
    const v = info.id;
    const nextUrl = info.url ?? '';
    if (on && this.on && v === this.voiceId && nextUrl === this.activeUrl) return;
    if (!on && !this.on) {
      this.voiceId = v;
      return;
    }
    if (this.on) this.stopGroup();
    this.voiceId = v;
    this.activeUrl = nextUrl;
    this.on = on;
    if (on) this.startGroup(info);
    this.e.setRadioDuck(on);
  }

  /** Làm mới nguồn phát nếu tệp giọng đang chọn vừa được cập nhật từ `/api/chant`. */
  refreshVoice(): void {
    if (!this.on) return;
    const info = findChantVoice(this.voiceId);
    if ((info.url ?? '') !== this.activeUrl) {
      this.stopGroup();
      this.activeUrl = info.url ?? '';
      this.startGroup(info);
    }
  }

  syncStreamVolume(): void {
    if (this.streamEl) {
      this.streamEl.volume = Math.min(1, Math.max(0, this.e.radioGain * 0.85));
    }
  }

  private stopGroup(): void {
    this.seq++;
    this.instrumental = false;
    if (this.streamEl) {
      try {
        this.streamEl.pause();
        this.streamEl.removeAttribute('src');
        this.streamEl.load();
      } catch { /* bỏ qua */ }
      this.streamEl = null;
    }
    const g = this.group;
    if (!g) return;
    const e = this.e;
    g.stop(e.now(), e.offline ? 0.05 : 0.8);
    e.revMap.delete(g.out);
    this.group = null;
  }

  private startGroup(info: ChantVoiceInfo): void {
    const e = this.e;
    const ctx = e.ctx;
    const t = e.now() + 0.04;
    const g = new Group(e, e.chantBus, e.offline ? 0.05 : 0.9, t);
    e.revMap.set(g.out, e.chantRevIn);
    this.group = g;
    const seq = ++this.seq;

    if (info.url && !e.offline && typeof fetch === 'function') {
      this.instrumental = false;
      const wet = ctx.createGain();
      wet.gain.value = 0.08;
      g.out.connect(wet);
      wet.connect(e.chantRevIn);
      void this.loadAndPlayRecording(info, g, seq);
      return;
    }

    this.setupInstrumental(info.id, g, t);
  }

  private setupInstrumental(voiceId: string, g: Group, t: number): void {
    const e = this.e;
    const ctx = e.ctx;
    this.instrumental = true;
    this.inst = INST_PROFILES[voiceId] ?? INST_PROFILES['chuong-mo']!;

    // Không dội thêm hồi âm tổng lên `g.out` để tiếng mõ giữ chất gỗ khô mộc mạc (chuông đồng đã có hồi âm riêng 0.42).
    // Nền âm trầm chánh điện thật nhẹ (La1 + Mi2 + La2)
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 440;
    const dg = ctx.createGain();
    dg.gain.value = this.inst.droneGain;
    lp.connect(dg);
    dg.connect(g.out);
    const dsend = ctx.createGain();
    dsend.gain.value = 0.45;
    dg.connect(dsend);
    dsend.connect(e.chantRevIn);
    ([
      [55, 'sine', 0.32],
      [82.41, 'sine', 0.34],
      [110, 'triangle', 0.28],
      [164.81, 'sine', 0.14],
    ] as const).forEach(([f, ty, a], i) => {
      const o = g.add(ctx.createOscillator(), t);
      o.type = ty;
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 2.5;
      const vg = ctx.createGain();
      vg.gain.value = a;
      o.connect(vg);
      vg.connect(lp);
      const l = g.add(ctx.createOscillator(), t);
      l.frequency.value = 0.045 + i * 0.015;
      const lg = ctx.createGain();
      lg.gain.value = a * 0.28;
      l.connect(lg);
      lg.connect(vg.gain);
    });

    this.next = t + 0.18;
    this.beat = 0;
  }

  private async fetchAudioBytes(urls: string[]): Promise<{ url: string; ab?: ArrayBuffer; streamOnly?: boolean } | null> {
    for (const u of urls) {
      if (!u) continue;
      try {
        const res = await fetch(u);
        if (!res.ok) continue;
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('text/html')) continue;
        const cl = Number(res.headers.get('content-length') || 0);
        if (cl > MAX_DECODE_BYTES) return { url: u, streamOnly: true };
        const ab = await res.arrayBuffer();
        if (ab.byteLength > MAX_DECODE_BYTES) return { url: u, streamOnly: true };
        if (ab.byteLength > 256) return { url: u, ab };
      } catch {
        /* thử URL dự phòng tiếp theo */
      }
    }
    return null;
  }

  private async loadAndPlayRecording(info: ChantVoiceInfo, g: Group, seq: number): Promise<void> {
    const e = this.e;
    const ctx = e.ctx;
    const urls = [info.url!, info.fallbackUrl ?? ''].filter(Boolean);
    const cacheKey = urls[0]!;

    let buf = this.cache.get(cacheKey);
    if (!buf) {
      const fetched = await this.fetchAudioBytes(urls);
      if (seq !== this.seq || !this.on || this.group !== g) return;
      if (!fetched) {
        this.setupInstrumental(info.id, g, e.now() + 0.04);
        return;
      }
      if (fetched.streamOnly) {
        this.playViaAudioElement(fetched.url, info.id, g, seq);
        return;
      }
      try {
        buf = await ctx.decodeAudioData(fetched.ab!.slice(0));
        if (this.cache.size >= MAX_BUFFER_CACHE) {
          const oldest = this.cache.keys().next().value;
          if (oldest) this.cache.delete(oldest);
        }
        this.cache.set(cacheKey, buf);
      } catch {
        if (seq !== this.seq || !this.on || this.group !== g) return;
        this.playViaAudioElement(fetched.url, info.id, g, seq);
        return;
      }
    }

    if (seq !== this.seq || !this.on || this.group !== g) return;
    const t0 = e.now() + 0.03;
    const fade = ctx.createGain();
    fade.gain.setValueAtTime(0, t0);
    fade.gain.linearRampToValueAtTime(1, t0 + 0.55);
    fade.connect(g.out);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(fade);
    if (info.guardedLoop && buf.duration > 2.5) {
      const ls = info.loopStart ?? 0.5;
      const le = info.loopEnd != null && info.loopEnd <= buf.duration ? info.loopEnd : buf.duration - 0.5;
      src.loopStart = ls;
      src.loopEnd = le;
      g.add(src, t0, ls);
    } else {
      g.add(src, t0);
    }
  }

  private playViaAudioElement(url: string, voiceId: string, g: Group, seq: number): void {
    if (typeof Audio === 'undefined') {
      this.setupInstrumental(voiceId, g, this.e.now() + 0.04);
      return;
    }
    const el = new Audio();
    el.crossOrigin = 'anonymous';
    el.preload = 'auto';
    el.loop = true;
    el.src = url;
    this.streamEl = el;
    this.syncStreamVolume();
    el.addEventListener('error', () => {
      if (seq !== this.seq || !this.on || this.group !== g) return;
      this.streamEl = null;
      this.setupInstrumental(voiceId, g, this.e.now() + 0.04);
    }, { once: true });
    try {
      if ('createMediaElementSource' in this.e.ctx) {
        const mediaCtx = this.e.ctx as AudioContext;
        const node = mediaCtx.createMediaElementSource(el);
        el.volume = 1;
        node.connect(g.out);
      }
    } catch {
      /* dùng âm lượng trực tiếp trên HTMLAudioElement */
    }
    void el.play().catch(() => {
      if (seq !== this.seq || !this.on || this.group !== g) return;
      this.streamEl = null;
      this.setupInstrumental(voiceId, g, this.e.now() + 0.04);
    });
  }

  pump(until: number): void {
    if (!this.on || !this.group || !this.instrumental) return;
    const step = 60 / this.inst.bpm;
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
    const p = this.inst;
    // Tiếng gõ mõ đều đặn, mộc mạc, ổn định như gõ mõ tụng kinh / thiền định thực tế
    e.synth('mo', t, p.moVol * (0.95 + this.rnd() * 0.07), p.moPitch, g.out);
    if (b % 24 === 0) e.synth('bell', t, 0.48, p.bellPitch, g.out);
  }

  dispose(): void {
    this.set(false);
  }
}
