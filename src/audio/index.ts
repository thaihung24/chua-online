// Điểm vào âm thanh: createAudio() → AudioApi. Quản lý AudioContext (iOS/Android an toàn), cài đặt lưu ở store, tạm dừng khi tab ẩn.
import type { AudioApi, AudioSettings, MusicTrack, Sfx } from '@/core/contracts';
import { load, save } from '@/core/store';
import { Engine } from './engine';
import { DEFAULT_CHANT_VOICE } from './voices';

export { CHANT_VOICES } from './voices';

const DEFAULTS: AudioSettings = { master: true, ambient: true, sfx: true, chant: true, ambientVolume: 0.6 };
const TICK_MS = 50;
const LOOKAHEAD = 0.4; // giây

type Ctor = typeof AudioContext;

export function createAudio(): AudioApi {
  const stored = load<Partial<AudioSettings>>('audio', {});
  let cfg: AudioSettings = {
    master: stored.master ?? DEFAULTS.master,
    ambient: stored.ambient ?? DEFAULTS.ambient,
    sfx: stored.sfx ?? DEFAULTS.sfx,
    chant: stored.chant ?? DEFAULTS.chant,
    ambientVolume: Math.min(1, Math.max(0, Number(stored.ambientVolume ?? DEFAULTS.ambientVolume))),
  };
  const listeners = new Set<(s: AudioSettings) => void>();

  let ctx: AudioContext | null = null;
  let engine: Engine | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let hooked = false;

  // trạng thái mong muốn (áp dụng khi AudioContext sẵn sàng)
  let wantAmbient = false;
  let wantNight = 0;
  let wantRadio = false;
  let wantVoice = DEFAULT_CHANT_VOICE;
  let unlocked = false;
  let tracks: MusicTrack[] = [];
  let trackIdx = 0;
  let musicStartedAt = 0;
  let clockSkewMs = 0;
  let musicEl: HTMLAudioElement | null = null;
  let currentUrl = '';
  interface PendingLoop { bpm: number; stopped: boolean; stop: (() => void) | null }
  const loops = new Set<PendingLoop>();

  function syncMusic(): void {
    const shouldPlay = unlocked && wantAmbient && cfg.master && cfg.ambient && tracks.length > 0;
    if (!shouldPlay) {
      if (musicEl && !musicEl.paused) musicEl.pause();
      return;
    }
    const item = tracks[trackIdx % tracks.length];
    if (!item || item.url.startsWith('yt:')) return;

    // ── Nhạc tệp âm thanh thuần (.mp3/.ogg/.wav..., không mở video trên điện thoại) ──
    if (typeof Audio === 'undefined') return;
    if (!musicEl) {
      musicEl = new Audio();
      musicEl.preload = 'auto';
      musicEl.addEventListener('ended', () => {
        if (tracks.length === 0) return;
        trackIdx = (trackIdx + 1) % tracks.length;
        currentUrl = '';
        syncMusic();
      });
      musicEl.addEventListener('loadedmetadata', () => {
        if (!musicEl || tracks.length !== 1 || !Number.isFinite(musicEl.duration) || musicEl.duration <= 2 || !musicStartedAt) return;
        const elapsedSec = Math.max(0, (Date.now() + clockSkewMs - musicStartedAt) / 1000);
        const targetSec = elapsedSec % musicEl.duration;
        if (Math.abs(musicEl.currentTime - targetSec) > 2.5) {
          try { musicEl.currentTime = targetSec; } catch { /* bỏ qua */ }
        }
      });
    }
    musicEl.loop = tracks.length === 1;
    musicEl.volume = Math.min(1, Math.max(0, cfg.ambientVolume));
    if (currentUrl !== item.url) {
      currentUrl = item.url;
      musicEl.src = item.url;
    }
    if (musicEl.paused) {
      void musicEl.play().catch(() => undefined);
    }
  }

  function apply(): void {
    const hasCustomMusic = tracks.length > 0;
    syncMusic();
    if (!engine) return;
    engine.setEnabled(cfg.master, cfg.sfx);
    engine.setVolume(hasCustomMusic && !wantRadio ? cfg.ambientVolume * 0.35 : cfg.ambientVolume);
    engine.setNight(wantNight);
    // Khi có bài nhạc riêng (YouTube/MP3), giữ lại 35% lớp tiếng gió/suối/chim tự nhiên của chùa (tắt pad nhạc tổng hợp để không đụng giai điệu).
    engine.ambient.setActive(wantAmbient && cfg.master && cfg.ambient);
    engine.ambient.setPad(!hasCustomMusic && wantAmbient && cfg.master && cfg.ambient && cfg.chant);
    engine.chant.set(wantRadio && cfg.master && cfg.chant, wantVoice);
    for (const l of loops) {
      if (l.stopped) continue;
      if (cfg.master && cfg.sfx) {
        if (!l.stop) l.stop = engine.startMoLoop(l.bpm);
      } else if (l.stop) {
        l.stop();
        l.stop = null;
      }
    }
    if (loops.size === 0 && !wantAmbient && !wantRadio) stopTimer();
    else startTimer();
  }

  function tick(): void {
    if (!engine || !ctx || ctx.state !== 'running') return;
    engine.pump(LOOKAHEAD);
  }
  function startTimer(): void {
    if (timer != null || !ctx) return;
    timer = setInterval(tick, TICK_MS);
  }
  function stopTimer(): void {
    if (timer != null) clearInterval(timer);
    timer = null;
  }

  function wake(): void {
    syncMusic();
    if (!ctx) return;
    if (document.hidden) return;
    if (ctx.state !== 'running') void ctx.resume().catch(() => undefined);
  }

  function hook(): void {
    if (hooked) return;
    hooked = true;
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) void ctx.suspend().catch(() => undefined);
      else wake();
    });
    // iOS có thể đưa context vào "interrupted"/"suspended" (cuộc gọi, khoá màn hình): hồi phục ở lần chạm kế tiếp
    const again = (): void => wake();
    for (const ev of ['pointerdown', 'touchend', 'keydown', 'click'] as const) document.addEventListener(ev, again, { passive: true });
    ctx?.addEventListener?.('statechange', () => {
      if (ctx && ctx.state === 'running') tick();
    });
  }

  function unlock(): void {
    unlocked = true;
    try {
      if (!ctx) {
        const C: Ctor | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
        if (!C) { syncMusic(); return; }
        ctx = new C({ latencyHint: 'interactive' });
        engine = new Engine(ctx);
        // phát một bộ đệm câm để "mở khoá" iOS/Safari
        const b = ctx.createBuffer(1, 1, 22050);
        const s = ctx.createBufferSource();
        s.buffer = b;
        s.connect(ctx.destination);
        s.start(0);
        hook();
        apply();
      } else {
        syncMusic();
      }
      if (ctx.state !== 'running') void ctx.resume().catch(() => undefined);
    } catch {
      syncMusic();
    }
  }

  function emit(): void {
    for (const fn of listeners) fn({ ...cfg });
  }

  return {
    unlock,
    play(s: Sfx, opts?: { volume?: number; pitch?: number }): void {
      if (!engine || !ctx || document.hidden) return;
      if (ctx.state !== 'running') wake();
      engine.play(s, opts);
    },
    startMoLoop(bpm: number): () => void {
      const l: PendingLoop = { bpm, stopped: false, stop: null };
      loops.add(l);
      apply();
      return () => {
        l.stopped = true;
        l.stop?.();
        l.stop = null;
        loops.delete(l);
        apply();
      };
    },
    setAmbient(on: boolean): void {
      wantAmbient = on;
      apply();
    },
    setMusicTracks(next: MusicTrack[], startedAt = 0, serverNow = 0): void {
      const clean = next.filter((t) => !t.url.startsWith('yt:'));
      const same = clean.length === tracks.length && clean.every((t, i) => t.url === tracks[i]?.url);
      tracks = clean;
      if (startedAt > 0) musicStartedAt = startedAt;
      if (serverNow > 0) clockSkewMs = serverNow - Date.now();
      if (!same) {
        trackIdx = 0;
        currentUrl = '';
      }
      apply();
    },
    setNight(v: number): void {
      wantNight = Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
      engine?.setNight(wantNight);
    },
    setChantRadio(on: boolean, voice?: string): void {
      wantRadio = on;
      if (voice) wantVoice = voice;
      apply();
    },
    settings: () => ({ ...cfg }),
    configure(patch: Partial<AudioSettings>): void {
      cfg = { ...cfg, ...patch, ambientVolume: Math.min(1, Math.max(0, patch.ambientVolume ?? cfg.ambientVolume)) };
      save('audio', cfg);
      apply();
      emit();
    },
    onChange(fn: (s: AudioSettings) => void): () => void {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}
