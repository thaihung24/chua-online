/**
 * Bộ điều khiển radio "Nghe niệm Phật" dùng chung giữa nút `#hud-listen` và hộp thoại `listen`.
 * Ghi `listenSeconds` định kỳ mỗi 30 giây và xả phần giây lẻ (>= 5s) khi dừng để không mất tinh tấn.
 */
import { CHANT_VOICES, mergeRemoteChantTracks } from '@/audio/voices';
import type { AppContext } from '@/core/contracts';
import { load } from '@/core/store';
import { API_ORIGIN, apiUrl } from '@/net/api';

const TICK_SEC = 30;
const MIN_FLUSH_SEC = 5;

const state = {
  on: false,
  voice: '',
  startedAt: 0,
  reportedSec: 0,
  timer: 0,
  syncedAt: 0,
  ctx: null as AppContext | null,
};

const subs = new Set<(on: boolean) => void>();
const notify = (): void => subs.forEach((fn) => fn(state.on));

export function defaultChantVoice(): string {
  const voices = Array.isArray(CHANT_VOICES) ? CHANT_VOICES : [];
  const saved = load<string>('listen:voice', voices[0]?.id ?? '');
  return voices.some((v) => v.id === saved) ? saved : (voices[0]?.id ?? '');
}

export const isChantRadioOn = (): boolean => state.on;
export const getChantRadioVoice = (): string => state.voice || defaultChantVoice();
export const getChantRadioStartedAt = (): number => state.startedAt;

export function onChantRadioChange(fn: (on: boolean) => void): () => void {
  subs.add(fn);
  return () => subs.delete(fn);
}

/** Đồng bộ danh sách tệp niệm Phật riêng trong `public/chant/` từ máy chủ (nếu có). */
export async function syncRemoteChantVoices(ctx?: AppContext): Promise<void> {
  const now = Date.now();
  if (now - state.syncedAt < 15_000) return;
  state.syncedAt = now;
  try {
    const r = await fetch(apiUrl('/api/chant'), { credentials: API_ORIGIN ? 'include' : 'same-origin' });
    if (!r.ok || !(r.headers.get('content-type') || '').includes('application/json')) return;
    const d = (await r.json()) as { tracks?: { id: string; name: string; url: string; custom?: boolean }[] };
    if (!Array.isArray(d.tracks)) return;
    const changed = mergeRemoteChantTracks(d.tracks, apiUrl);
    if (changed) {
      const targetCtx = ctx ?? state.ctx;
      if (state.on && targetCtx) targetCtx.audio.setChantRadio(true, state.voice);
      notify();
    }
  } catch {
    /* dùng danh sách giọng tích hợp sẵn */
  }
}

export function startChantRadio(ctx: AppContext, voice?: string): void {
  const v = voice || state.voice || defaultChantVoice();
  state.ctx = ctx;
  state.voice = v;
  ctx.audio.unlock();
  const s = ctx.audio.settings();
  if (!s.master || !s.chant || s.ambientVolume < 0.08) {
    ctx.audio.configure({
      master: true,
      chant: true,
      ...(s.ambientVolume < 0.08 ? { ambientVolume: 0.6 } : {}),
    });
  }
  ctx.audio.setChantRadio(true, v);
  void syncRemoteChantVoices(ctx);
  if (state.on) {
    notify();
    return;
  }
  state.on = true;
  state.startedAt = Date.now();
  state.reportedSec = 0;
  window.clearInterval(state.timer);
  state.timer = window.setInterval(() => {
    if (!state.on) return;
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    while (state.on && elapsed - state.reportedSec >= TICK_SEC) {
      state.ctx?.progress.record('listenSeconds', TICK_SEC);
      state.reportedSec += TICK_SEC;
    }
  }, 1000);
  notify();
}

export function stopChantRadio(): void {
  if (!state.on) return;
  const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
  const rem = elapsed - state.reportedSec;
  state.on = false;
  window.clearInterval(state.timer);
  state.timer = 0;
  if (rem >= MIN_FLUSH_SEC) state.ctx?.progress.record('listenSeconds', rem);
  state.ctx?.audio.setChantRadio(false);
  notify();
}
