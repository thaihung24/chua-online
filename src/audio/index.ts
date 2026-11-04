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
  let ytFrame: HTMLIFrameElement | null = null;
  let currentYtId = '';
  let ytReady = false;
  let ytPlaying = false;
  let ytSyncedSeek = false;
  let ytMsgHooked = false;
  interface PendingLoop { bpm: number; stopped: boolean; stop: (() => void) | null }
  const loops = new Set<PendingLoop>();

  function ytCmd(func: string, args: unknown[] = []): void {
    if (!ytFrame?.contentWindow) return;
    try {
      ytFrame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), 'https://www.youtube.com');
    } catch { /* bỏ qua */ }
  }

  function hookYtMessages(): void {
    if (ytMsgHooked || typeof window === 'undefined') return;
    ytMsgHooked = true;
    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.origin !== 'https://www.youtube.com' && ev.origin !== 'https://www.youtube-nocookie.com') return;
      if (typeof ev.data !== 'string') return;
      let data: { event?: string; info?: { playerState?: number; duration?: number } };
      try { data = JSON.parse(ev.data); } catch { return; }
      if (data.event === 'onReady' || data.event === 'initialDelivery') {
        ytReady = true;
        const shouldPlay = unlocked && wantAmbient && cfg.master && cfg.ambient && tracks.length > 0 && tracks[trackIdx % tracks.length]?.url.startsWith('yt:');
        if (shouldPlay) {
          ytCmd('unMute');
          ytCmd('setVolume', [Math.round(cfg.ambientVolume * 100)]);
          ytCmd('playVideo');
        } else {
          ytCmd('pauseVideo');
        }
      } else if (data.event === 'infoDelivery' && data.info) {
        if (typeof data.info.playerState === 'number') {
          ytPlaying = data.info.playerState === 1 || data.info.playerState === 3;
          if (data.info.playerState === 0 && tracks.length > 0) {
            if (tracks.length === 1) {
              ytCmd('seekTo', [0, true]);
              ytCmd('playVideo');
            } else {
              trackIdx = (trackIdx + 1) % tracks.length;
              currentYtId = '';
              currentUrl = '';
              syncMusic();
            }
          }
        }
        if (!ytSyncedSeek && typeof data.info.duration === 'number' && data.info.duration > 5 && musicStartedAt > 0) {
          ytSyncedSeek = true;
          if (tracks.length === 1) {
            const elapsedSec = Math.max(0, (Date.now() + clockSkewMs - musicStartedAt) / 1000);
            const targetSec = Math.floor(elapsedSec % data.info.duration);
            if (targetSec > 3) ytCmd('seekTo', [targetSec, true]);
          }
        }
      }
    });
  }

  function destroyYt(): void {
    if (ytFrame) {
      try { ytFrame.remove(); } catch { /* bỏ qua */ }
      ytFrame = null;
    }
    currentYtId = '';
    ytReady = false;
    ytPlaying = false;
    ytSyncedSeek = false;
  }

  function syncMusic(): void {
    const shouldPlay = unlocked && wantAmbient && cfg.master && cfg.ambient && tracks.length > 0;
    if (!shouldPlay) {
      if (musicEl && !musicEl.paused) musicEl.pause();
      if (ytFrame && ytReady) { ytCmd('pauseVideo'); ytPlaying = false; }
      if (tracks.length === 0 && ytFrame) destroyYt();
      return;
    }
    const item = tracks[trackIdx % tracks.length];
    if (!item) return;

    // ── Nhạc từ YouTube (yt:<videoId>) ──
    if (item.url.startsWith('yt:')) {
      if (musicEl && !musicEl.paused) musicEl.pause();
      if (typeof document === 'undefined') return;
      hookYtMessages();
      const vid = item.url.slice(3);
      if (!ytFrame || currentYtId !== vid) {
        destroyYt();
        currentYtId = vid;
        const f = document.createElement('iframe');
        f.allow = 'autoplay; encrypted-media';
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        f.tabIndex = -1;
        f.setAttribute('aria-hidden', 'true');
        f.style.cssText = 'position:fixed;right:0;bottom:0;width:2px;height:2px;opacity:0.01;pointer-events:none;border:0;z-index:0;';
        const origin = typeof location !== 'undefined' ? encodeURIComponent(location.origin) : '';
        f.src = `https://www.youtube.com/embed/${encodeURIComponent(vid)}?enablejsapi=1&autoplay=1&playsinline=1&controls=0&disablekb=1&fs=0&rel=0${origin ? `&origin=${origin}` : ''}`;
        const handshake = () => {
          if (ytFrame !== f || !f.contentWindow) return;
          try {
            f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), 'https://www.youtube.com');
          } catch { /* bỏ qua */ }
        };
        f.addEventListener('load', () => {
          handshake();
          setTimeout(() => { if (!ytReady) handshake(); }, 500);
          setTimeout(() => { if (!ytReady) handshake(); }, 1500);
        });
        ytFrame = f;
        document.body.appendChild(f);
      } else if (ytReady) {
        ytCmd('unMute');
        ytCmd('setVolume', [Math.round(cfg.ambientVolume * 100)]);
        if (!ytPlaying) ytCmd('playVideo');
      }
      return;
    }

    // ── Nhạc tệp trực tiếp (.mp3/.ogg/.wav...) ──
    if (ytFrame) destroyYt();
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
    engine.setVolume(cfg.ambientVolume);
    engine.setNight(wantNight);
    // Khi đã có bài nhạc riêng (YouTube/MP3), tắt hoàn toàn tiếng gió/suối/dế tổng hợp để 0% tạp âm.
    engine.ambient.setActive(!hasCustomMusic && wantAmbient && cfg.master && cfg.ambient);
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
    if (loops.size === 0 && (hasCustomMusic || !wantAmbient) && !wantRadio) stopTimer();
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
      const same = next.length === tracks.length && next.every((t, i) => t.url === tracks[i]?.url);
      tracks = next.slice();
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
