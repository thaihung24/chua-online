/**
 * Client mạng nhiều người: WebSocket `/ws` tự kết nối lại (backoff 1s→15s), throttle vị trí 100ms,
 * rơi về chế độ "một mình" (offline) êm ái nếu không kết nối được.
 */
import type { NetApi, NetEvents, Profile, RemotePlayer, RoomInfo } from '@/core/contracts';
import { createEmitter } from '@/core/bus';
import { phraseText } from '@/content/phrases';
import { API_ORIGIN, apiUrl } from './api';

const CONNECT_TIMEOUT_MS = 6000;
const MOVE_INTERVAL_MS = 100;
const PING_MS = 25_000;
const PONG_TIMEOUT_MS = 10_000;
const BACKOFF = [1000, 2000, 4000, 8000, 15000];

type Move = { x: number; z: number; ry: number; anim: RemotePlayer['anim'] };
const r2 = (n: number): number => Math.round(n * 100) / 100;

async function fetchJson<T>(method: 'GET' | 'POST', url: string): Promise<T | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(apiUrl(url), {
      method, credentials: API_ORIGIN ? 'include' : 'same-origin', signal: ctl.signal,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
      body: method === 'POST' ? '{}' : undefined,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch { return null; } finally { clearTimeout(timer); }
}

export function createNet(): NetApi {
  const em = createEmitter<NetEvents>();
  let ws: WebSocket | null = null;
  let state: NetEvents['status']['state'] = 'offline';
  let room: RoomInfo | null = null;
  let want: { profile: Profile; level: number } | null = null;
  let lastIdentity: { profile: Profile; level: number } | null = null;
  let attempt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let connectTimer: ReturnType<typeof setTimeout> | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;
  let pongTimer: ReturnType<typeof setTimeout> | null = null;
  let moveTimer: ReturnType<typeof setTimeout> | null = null;
  let pending: Move | null = null;
  let lastSent: Move | null = null;
  let lastSentAt = 0;
  let announcedOffline = false;
  let listenersAttached = false;

  const setState = (s: NetEvents['status']['state']): void => {
    state = s;
    em.emit('status', { state: s, room: s === 'online' ? room ?? undefined : undefined });
  };

  const sendRaw = (obj: unknown): boolean => {
    if (!ws || ws.readyState !== WebSocket.OPEN || state !== 'online') return false;
    try { ws.send(JSON.stringify(obj)); return true; } catch { return false; }
  };

  const clearTimers = (): void => {
    for (const t of [reconnectTimer, connectTimer, pongTimer, moveTimer]) if (t) clearTimeout(t);
    if (pingTimer) clearInterval(pingTimer);
    reconnectTimer = connectTimer = pongTimer = moveTimer = null;
    pingTimer = null;
  };

  const flushMove = (): void => {
    moveTimer = null;
    const m = pending;
    if (!m || state !== 'online') return;
    pending = null;
    if (lastSent && r2(lastSent.x) === r2(m.x) && r2(lastSent.z) === r2(m.z) && r2(lastSent.ry) === r2(m.ry) && lastSent.anim === m.anim) return;
    if (sendRaw({ t: 'move', x: r2(m.x), z: r2(m.z), ry: r2(m.ry), anim: m.anim })) {
      lastSent = m;
      lastSentAt = performance.now();
    }
  };

  const scheduleReconnect = (): void => {
    if (!want || reconnectTimer) return;
    const base = BACKOFF[Math.min(attempt, BACKOFF.length - 1)];
    attempt++;
    reconnectTimer = setTimeout(() => { reconnectTimer = null; open(); }, base + Math.random() * 300);
  };

  const onLost = (): void => {
    const wasOnline = state === 'online';
    ws = null;
    clearTimers();
    pending = null;
    lastSent = null;
    if (wasOnline) em.emit('players', []);
    room = null;
    if (!want) { if (state !== 'offline') setState('offline'); return; }
    if (wasOnline) { announcedOffline = false; setState('connecting'); }
    scheduleReconnect();
  };

  const onMessage = (data: unknown): void => {
    if (typeof data !== 'string') return;
    let m: Record<string, unknown>;
    try { m = JSON.parse(data) as Record<string, unknown>; } catch { return; }
    if (pongTimer) { clearTimeout(pongTimer); pongTimer = null; }
    switch (m.t) {
      case 'welcome': {
        const info = m.room as RoomInfo;
        if (!info || typeof info.id !== 'string') return;
        room = info;
        attempt = 0;
        announcedOffline = false;
        lastSent = null;
        if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
        if (!pingTimer) {
          pingTimer = setInterval(() => {
            sendRaw({ t: 'ping' });
            if (!pongTimer) pongTimer = setTimeout(() => { try { ws?.close(); } catch { /* bỏ qua */ } onLost(); }, PONG_TIMEOUT_MS);
          }, PING_MS);
        }
        em.emit('players', []);
        setState('online');
        break;
      }
      case 'players': {
        const list = Array.isArray(m.list) ? (m.list as RemotePlayer[]) : [];
        em.emit('players', list.map((p) => (p.say ? { ...p, say: phraseText(p.say) ?? undefined } : p)));
        break;
      }
      case 'say':
        if (typeof m.id === 'string' && typeof m.text === 'string') em.emit('say', { id: m.id, text: m.text });
        break;
      case 'lantern':
        if (typeof m.id === 'string' && typeof m.color === 'string') em.emit('lantern', { id: m.id, color: m.color, by: String(m.by ?? '') });
        break;
      case 'count':
        if (typeof m.online === 'number') {
          if (room) room = { ...room, online: m.online };
          em.emit('count', { online: m.online });
        }
        break;
      case 'notice':
        if (typeof m.text === 'string') em.emit('notice', { text: m.text });
        break;
      case 'music':
        if (Array.isArray(m.tracks)) {
          em.emit('music', {
            tracks: m.tracks as { name: string; url: string }[],
            startedAt: typeof m.startedAt === 'number' ? m.startedAt : Date.now(),
            serverNow: typeof m.serverNow === 'number' ? m.serverNow : Date.now(),
          });
        }
        break;
      default: break; // pong, v.v.
    }
  };

  function open(): void {
    if (!want || ws || typeof WebSocket === 'undefined') {
      if (!want || typeof WebSocket === 'undefined') { if (state !== 'offline') setState('offline'); }
      return;
    }
    if (state === 'offline' && !announcedOffline) setState('connecting');
    else if (state === 'offline') { /* thử lại âm thầm */ }
    let sock: WebSocket;
    try {
      const wsUrl = API_ORIGIN
        ? `${API_ORIGIN.replace(/^http/i, 'ws')}/ws`
        : `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`;
      sock = new WebSocket(wsUrl);
    } catch {
      announceOffline();
      scheduleReconnect();
      return;
    }
    ws = sock;
    connectTimer = setTimeout(() => {
      connectTimer = null;
      if (ws === sock && state !== 'online') {
        // Quá 6s chưa vào được: coi như đang ở một mình, vẫn thử lại ngầm.
        ws = null;
        sock.onclose = null; sock.onerror = null; sock.onmessage = null;
        try { sock.close(); } catch { /* bỏ qua */ }
        announceOffline();
        scheduleReconnect();
      }
    }, CONNECT_TIMEOUT_MS);
    sock.onopen = () => {
      if (ws !== sock || !want) return;
      sock.send(JSON.stringify({ t: 'hello', profile: want.profile, level: want.level }));
    };
    sock.onmessage = (ev) => { if (ws === sock) onMessage(ev.data); };
    sock.onclose = () => {
      if (ws !== sock) return;
      const wasConnecting = state !== 'online';
      onLost();
      if (wasConnecting) announceOffline();
    };
    sock.onerror = () => { /* onclose sẽ xử lý */ };
  }

  function announceOffline(): void {
    announcedOffline = true;
    if (state !== 'offline') setState('offline');
  }

  const attachListeners = (): void => {
    if (listenersAttached || typeof window === 'undefined') return;
    listenersAttached = true;
    const wake = (): void => {
      if (!want || ws || state === 'online') return;
      if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
      attempt = 0;
      open();
    };
    window.addEventListener('online', wake);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') wake(); });
  };

  const api: NetApi = {
    on: em.on.bind(em),
    off: em.off.bind(em),
    emit: em.emit.bind(em),

    connect(profile, level) {
      want = { profile, level };
      lastIdentity = { profile, level };
      attachListeners();
      if (ws) return; // đã/đang kết nối: dùng sendProfile để cập nhật
      attempt = 0;
      announcedOffline = false;
      open();
    },
    disconnect() {
      want = null;
      clearTimers();
      const s = ws;
      ws = null;
      if (s) { s.onclose = null; s.onmessage = null; s.onerror = null; try { s.close(1000); } catch { /* bỏ qua */ } }
      pending = null; lastSent = null; room = null;
      if (state === 'online') em.emit('players', []);
      if (state !== 'offline') setState('offline');
    },
    lobby: async () => {
      const r = await fetchJson<RoomInfo[]>('GET', '/api/lobby');
      return Array.isArray(r) ? r : [];
    },
    joinRoom(_roomId) {
      if (!want && lastIdentity) want = { ...lastIdentity };
      if (state === 'online') sendRaw({ t: 'join', room: 'main-1' });
      else if (want && !ws) { attempt = 0; announcedOffline = false; open(); }
    },
    createPrivateRoom: async () => null,
    sendMove(m) {
      if (state !== 'online') return;
      pending = m;
      if (moveTimer) return;
      const wait = Math.max(0, MOVE_INTERVAL_MS - (performance.now() - lastSentAt));
      if (wait === 0) flushMove();
      else moveTimer = setTimeout(flushMove, wait);
    },
    sendSay(phraseId) { sendRaw({ t: 'say', phrase: phraseId }); },
    sendLantern(color) { sendRaw({ t: 'lantern', color }); },
    sendProfile(profile, level) {
      lastIdentity = { profile, level };
      if (want) want = { profile, level };
      sendRaw({ t: 'profile', profile, level });
    },
    room: () => room,
    isOnline: () => state === 'online',
  };
  return api;
}
