/** Trung tâm WebSocket `/ws`: phòng, người chơi, di chuyển, lời chào, trò chuyện, đèn, chống spam, snapshot 5Hz. */
import type http from 'node:http';
import type { Duplex } from 'node:stream';
import { WebSocketServer, WebSocket } from 'ws';
import type { ChatMessage, ChatScope, Profile, RoomInfo } from '../src/core/contracts';
import { BotColony } from '../src/core/bots';
import { BOUNDS, SPAWN, COLOR_RE, clampLevel, isAnim, isPhrase, parseProfile, plausibleLevel, safeProfile, validateChatText, type Anim } from './validate';
import { Bucket, clientIp, getCookie, randomHex } from './util';
import type { ServerOptions } from './config';

const MAX_SPEED = 8; // m/s
const SAY_SHOW_MS = 4500;
const CHAT_SHOW_MS = 6500;
const TICK_MS = 200; // 5Hz
const MAX_STRIKES = 30;

interface Conn {
  ws: WebSocket;
  id: string;
  ip: string;
  email: string | null;
  hello: boolean;
  profile: Profile;
  level: number;
  levelAt: number;
  streak: number;
  room: Room | null;
  x: number; z: number; ry: number; anim: Anim;
  hasPos: boolean;
  lastMoveAt: number;
  say: string | null;
  sayUntil: number;
  lastSayAt: number;
  lastChatAt: number;
  lastLanternAt: number;
  strikes: number;
  alive: boolean;
  generic: Bucket;
  moves: Bucket;
  frag: string | null;
  connectedAt: number;
}

interface Room {
  id: string;
  label: string;
  kind: 'public' | 'private';
  members: Set<Conn>;
  dirty: boolean;
  createdAt: number;
  emptySince: number | null;
  /** Số thứ tự phòng công cộng. */
  n: number;
}

export interface UserStats { email: string; name: string; level: number; streak: number }
export interface HubHooks {
  /** Tra phiên từ cookie → email (hoặc null). */
  resolveSession(token: string | null): string | null;
  isBannedIp(ip: string): boolean;
  onUserStats(s: UserStats): void;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export class Hub {
  private wss = new WebSocketServer({ noServer: true, maxPayload: 2048, perMessageDeflate: false });
  private rooms = new Map<string, Room>();
  private conns = new Set<Conn>();
  private byEmail = new Map<string, Set<Conn>>();
  private perIp = new Map<string, number>();
  private spawnSeq = 0;
  private bots: BotColony;
  private tickTimer: NodeJS.Timeout;
  private pingTimer: NodeJS.Timeout;
  private cleanTimer: NodeJS.Timeout;
  private closed = false;

  constructor(private opts: ServerOptions, private hooks: HubHooks) {
    this.ensurePublic(1);
    this.bots = new BotColony(Math.max(0, opts.botCount), {
      onSay: (botId, phraseId) => {
        const r = this.ensurePublic(1);
        if (r.members.size > 0) this.broadcast(r, { t: 'say', id: botId, text: phraseId });
      },
      onLantern: (botId, color) => {
        const r = this.ensurePublic(1);
        if (r.members.size > 0) this.broadcast(r, { t: 'lantern', id: `l-${randomHex(5)}`, color, by: botId });
      },
    });
    this.tickTimer = setInterval(() => this.tick(), TICK_MS);
    this.pingTimer = setInterval(() => this.pingAll(), 25_000);
    this.cleanTimer = setInterval(() => this.cleanup(), 15_000);
    for (const t of [this.tickTimer, this.pingTimer, this.cleanTimer]) t.unref?.();
  }

  // ───────────── Kết nối ─────────────
  attach(server: http.Server): void {
    server.on('upgrade', (req, socket, head) => this.handleUpgrade(req, socket, head));
  }

  private handleUpgrade(req: http.IncomingMessage, socket: Duplex, head: Buffer): void {
    const url = (req.url ?? '').split('?')[0];
    if (url !== '/ws') { socket.destroy(); return; }
    const ip = clientIp(req, this.opts.trustProxy);
    const deny = (code: string): void => { socket.write(`HTTP/1.1 ${code}\r\nConnection: close\r\n\r\n`); socket.destroy(); };
    if (this.closed) return deny('503 Service Unavailable');
    if (this.hooks.isBannedIp(ip)) return deny('403 Forbidden');
    if ((this.perIp.get(ip) ?? 0) >= this.opts.wsMaxPerIp) return deny('429 Too Many Requests');
    const email = this.hooks.resolveSession(getCookie(req.headers.cookie, 'sid'));
    this.wss.handleUpgrade(req, socket, head, (ws) => this.onConnect(ws, ip, email));
  }

  private onConnect(ws: WebSocket, ip: string, email: string | null): void {
    const now = Date.now();
    const c: Conn = {
      ws, id: randomHex(4), ip, email, hello: false, profile: safeProfile(null), level: 1, levelAt: now, streak: 0,
      room: null, x: SPAWN.x, z: SPAWN.z, ry: 0, anim: 'idle', hasPos: false, lastMoveAt: now,
      say: null, sayUntil: 0, lastSayAt: 0, lastChatAt: 0, lastLanternAt: 0, strikes: 0, alive: true,
      generic: new Bucket(40, 20), moves: new Bucket(6, 12), frag: null, connectedAt: now,
    };
    this.conns.add(c);
    this.perIp.set(ip, (this.perIp.get(ip) ?? 0) + 1);
    if (email) {
      let s = this.byEmail.get(email);
      if (!s) this.byEmail.set(email, (s = new Set()));
      s.add(c);
    }
    const helloTimer = setTimeout(() => { if (!c.hello) ws.close(1008, 'hello timeout'); }, 10_000);
    helloTimer.unref?.();
    ws.on('pong', () => { c.alive = true; });
    ws.on('message', (data, isBinary) => {
      if (isBinary) return this.strike(c, 5);
      c.alive = true;
      let raw: string;
      try { raw = data.toString('utf8'); } catch { return this.strike(c, 3); }
      this.onMessage(c, raw);
    });
    ws.on('close', () => { clearTimeout(helloTimer); this.drop(c); });
    ws.on('error', () => { try { ws.terminate(); } catch { /* bỏ qua */ } });
  }

  private drop(c: Conn): void {
    if (!this.conns.delete(c)) return;
    const n = (this.perIp.get(c.ip) ?? 1) - 1;
    if (n <= 0) this.perIp.delete(c.ip); else this.perIp.set(c.ip, n);
    if (c.email) {
      const s = this.byEmail.get(c.email);
      s?.delete(c);
      if (s && s.size === 0) this.byEmail.delete(c.email);
    }
    this.leaveRoom(c);
  }

  private send(c: Conn, msg: unknown): void {
    if (c.ws.readyState === WebSocket.OPEN) c.ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  private notice(c: Conn, text: string): void { this.send(c, { t: 'notice', text }); }

  /** Ghi điểm vi phạm; quá ngưỡng thì ngắt kết nối. */
  private strike(c: Conn, n = 1): void {
    c.strikes += n;
    if (c.strikes >= MAX_STRIKES) {
      this.notice(c, 'Kết nối bị ngắt do gửi dữ liệu bất thường.');
      c.ws.close(1008, 'abuse');
    }
  }

  // ───────────── Thông điệp ─────────────
  private onMessage(c: Conn, raw: string): void {
    if (raw.length > 2048) return this.strike(c, 10);
    if (!c.generic.take()) return this.strike(c, 1);
    let m: Record<string, unknown>;
    try {
      const j: unknown = JSON.parse(raw);
      if (!j || typeof j !== 'object' || Array.isArray(j)) return this.strike(c, 3);
      m = j as Record<string, unknown>;
    } catch { return this.strike(c, 3); }
    const t = m.t;
    if (t === 'ping') return this.send(c, { t: 'pong' });
    if (t === 'hello') return this.onHello(c, m);
    if (!c.hello) return this.strike(c, 3);
    switch (t) {
      case 'move': return this.onMove(c, m);
      case 'say': return this.onSay(c, m);
      case 'chat': return this.onChat(c, m);
      case 'lantern': return this.onLantern(c, m);
      case 'profile': return this.onProfile(c, m);
      case 'auth': return this.onAuth(c, m);
      case 'join': return this.onJoin(c, m);
      default: return this.strike(c, 2);
    }
  }

  private setConnEmail(c: Conn, email: string | null): void {
    if (c.email === email) return;
    if (c.email) {
      const oldSet = this.byEmail.get(c.email);
      oldSet?.delete(c);
      if (oldSet && oldSet.size === 0) this.byEmail.delete(c.email);
    }
    c.email = email;
    if (email) {
      let s = this.byEmail.get(email);
      if (!s) this.byEmail.set(email, (s = new Set()));
      s.add(c);
    }
  }

  private applyProfile(c: Conn, rawProfile: unknown, rawLevel: unknown, rawStreak: unknown, first: boolean): boolean {
    const p = parseProfile(rawProfile);
    if (!p) { this.strike(c, 2); if (first) c.profile = safeProfile(null); return false; }
    if (p.nameError) {
      this.notice(c, p.nameError);
      p.profile.name = c.hello ? c.profile.name : 'Phật tử';
    }
    c.profile = p.profile;
    const now = Date.now();
    const lv = clampLevel(rawLevel);
    if (first || plausibleLevel(c.level, c.levelAt, lv, now)) { c.level = lv; c.levelAt = now; }
    if (typeof rawStreak === 'number' && Number.isFinite(rawStreak)) c.streak = Math.max(0, Math.min(99999, Math.floor(rawStreak)));
    c.frag = null;
    if (c.email) this.hooks.onUserStats({ email: c.email, name: c.profile.name, level: c.level, streak: c.streak });
    if (c.room) c.room.dirty = true;
    return true;
  }

  private onHello(c: Conn, m: Record<string, unknown>): void {
    if (c.hello) return this.strike(c, 2);
    if (!c.email && typeof m.token === 'string') {
      const em = this.hooks.resolveSession(m.token);
      if (em) this.setConnEmail(c, em);
    }
    this.applyProfile(c, m.profile, m.level, m.streak, true);
    c.hello = true;
    const want = typeof m.room === 'string' ? m.room : undefined;
    this.placeInRoom(c, want, true);
  }

  private onAuth(c: Conn, m: Record<string, unknown>): void {
    const tok = typeof m.token === 'string' && m.token ? m.token : null;
    const em = tok ? this.hooks.resolveSession(tok) : null;
    this.setConnEmail(c, em);
    if (em) this.hooks.onUserStats({ email: em, name: c.profile.name, level: c.level, streak: c.streak });
  }

  private onProfile(c: Conn, m: Record<string, unknown>): void {
    this.applyProfile(c, m.profile, m.level, m.streak, false);
  }

  private onJoin(c: Conn, m: Record<string, unknown>): void {
    if (typeof m.room !== 'string') return this.strike(c, 2);
    this.placeInRoom(c, m.room, false);
  }

  private onMove(c: Conn, m: Record<string, unknown>): void {
    if (!c.room) return;
    if (!c.moves.take()) return this.strike(c, 0.2);
    const { x, z, ry, anim } = m;
    if (typeof x !== 'number' || typeof z !== 'number' || typeof ry !== 'number' || !Number.isFinite(x) || !Number.isFinite(z) || !Number.isFinite(ry) || !isAnim(anim)) {
      return this.strike(c, 2);
    }
    const now = Date.now();
    let nx = Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, x));
    let nz = Math.max(BOUNDS.z0, Math.min(BOUNDS.z1, z));
    if (c.hasPos) {
      const dt = Math.min(3, Math.max(0.1, (now - c.lastMoveAt) / 1000));
      const maxD = MAX_SPEED * dt + 1;
      const dx = nx - c.x;
      const dz = nz - c.z;
      const d = Math.hypot(dx, dz);
      if (d > maxD) {
        // Dịch chuyển tức thời: kéo về, chỉ cho đi tối đa theo tốc độ cho phép.
        nx = c.x + (dx / d) * maxD;
        nz = c.z + (dz / d) * maxD;
        this.strike(c, d > maxD * 3 ? 3 : 1);
      }
    }
    c.hasPos = true;
    c.lastMoveAt = now;
    let nry = ry % (Math.PI * 2);
    if (nry > Math.PI) nry -= Math.PI * 2; else if (nry < -Math.PI) nry += Math.PI * 2;
    const changed = r2(nx) !== r2(c.x) || r2(nz) !== r2(c.z) || r2(nry) !== r2(c.ry) || anim !== c.anim;
    c.x = nx; c.z = nz; c.ry = nry; c.anim = anim;
    if (changed) {
      c.frag = null;
      c.room.dirty = true;
      if ((anim === 'pray' || anim === 'bow') && this.bots.size > 0) this.bots.notifyHumanGesture(c.x, c.z, now);
    }
  }

  private onSay(c: Conn, m: Record<string, unknown>): void {
    if (!c.room) return;
    if (!isPhrase(m.phrase)) return this.strike(c, 2);
    const now = Date.now();
    if (now - c.lastSayAt < this.opts.sayCooldownMs) {
      this.notice(c, 'Bạn chào hơi nhanh, xin chờ một chút nhé.');
      return this.strike(c, 1);
    }
    c.lastSayAt = now;
    c.lastChatAt = now;
    c.say = m.phrase;
    c.sayUntil = now + SAY_SHOW_MS;
    c.frag = null;
    c.room.dirty = true;
    this.broadcast(c.room, { t: 'say', id: c.id, text: m.phrase }, c);
    if (this.bots.size > 0) this.bots.notifyHumanGesture(c.x, c.z, now);
  }

  private onChat(c: Conn, m: Record<string, unknown>): void {
    if (!c.room) return;
    const v = validateChatText(m.text);
    if (!v.ok) {
      this.notice(c, v.error);
      return this.strike(c, 1);
    }
    const scope: ChatScope = m.scope === 'bubble' ? 'bubble' : 'global';
    const now = Date.now();
    const cooldown = this.opts.chatCooldownMs;
    const elapsed = now - c.lastChatAt;
    if (elapsed < cooldown) {
      const waitSec = Math.max(1, Math.ceil((cooldown - elapsed) / 1000));
      this.notice(c, `Mỗi 20 giây mới chat được 1 lần. Xin chờ ${waitSec} giây nữa nhé.`);
      return this.strike(c, 0.5);
    }
    c.lastSayAt = now;
    c.lastChatAt = now;
    c.say = v.text;
    c.sayUntil = now + CHAT_SHOW_MS;
    c.frag = null;
    c.room.dirty = true;
    const msg: ChatMessage = {
      id: `c-${randomHex(5)}`,
      senderId: c.id,
      name: c.profile.name,
      level: c.level,
      text: v.text,
      ts: now,
      scope,
    };
    // Không lưu lịch sử trên máy chủ cho người vào sau; chỉ phát trực tiếp tới những ai đang có mặt trong sân chùa
    this.broadcast(c.room, { t: 'chat', msg });
    if (this.bots.size > 0) this.bots.notifyHumanGesture(c.x, c.z, now);
  }

  private onLantern(c: Conn, m: Record<string, unknown>): void {
    if (!c.room) return;
    if (typeof m.color !== 'string' || !COLOR_RE.test(m.color)) return this.strike(c, 2);
    const now = Date.now();
    if (now - c.lastLanternAt < this.opts.lanternCooldownMs) {
      this.notice(c, 'Đèn vừa thả còn đang trôi, xin chờ một chút nhé.');
      return this.strike(c, 1);
    }
    c.lastLanternAt = now;
    this.broadcast(c.room, { t: 'lantern', id: `l-${randomHex(5)}`, color: m.color.toLowerCase(), by: c.id }, c);
  }

  // ───────────── Phòng chung duy nhất ─────────────
  private ensurePublic(_n = 1): Room {
    const id = 'main-1';
    let r = this.rooms.get(id);
    if (!r) {
      r = { id, label: 'Chùa Rắn', kind: 'public', members: new Set(), dirty: false, createdAt: Date.now(), emptySince: null, n: 1 };
      this.rooms.set(id, r);
    }
    return r;
  }

  private roomOnline(r: Room): number {
    return r.members.size + (r.id === 'main-1' ? this.bots.size : 0);
  }

  private info(r: Room): RoomInfo {
    const online = this.roomOnline(r);
    return { id: r.id, label: r.label, online, capacity: Math.max(this.opts.roomCapacity, online), kind: r.kind };
  }

  /** Mọi người đều vào chung một phòng duy nhất "Chùa Rắn". */
  private pickPublic(): Room {
    return this.ensurePublic(1);
  }

  private placeInRoom(c: Conn, _want: string | undefined, _first: boolean): void {
    const target = this.pickPublic();
    if (target === c.room) return this.sendWelcome(c);
    this.leaveRoom(c);
    target.members.add(c);
    target.emptySince = null;
    target.dirty = true;
    c.room = target;
    c.hasPos = false; // lần di chuyển đầu trong phòng được chấp nhận ở bất kỳ đâu trong khuôn viên
    const seq = this.spawnSeq++;
    const ang = seq * 2.399963;
    const rad = 0.75 + (seq % 5) * 0.42;
    c.x = r2(SPAWN.x + Math.cos(ang) * rad);
    c.z = r2(SPAWN.z - 1.2 + Math.sin(ang) * rad * 0.75);
    c.anim = 'idle'; c.frag = null;
    this.sendWelcome(c);
    this.sendPlayers(c, target, Date.now());
    this.broadcastCount(target);
  }

  private sendWelcome(c: Conn): void {
    if (c.room) this.send(c, { t: 'welcome', id: c.id, room: this.info(c.room) });
  }

  private leaveRoom(c: Conn): void {
    const r = c.room;
    if (!r) return;
    r.members.delete(c);
    c.room = null;
    r.dirty = true;
    if (r.members.size === 0) {
      r.emptySince = Date.now();
    } else this.broadcastCount(r);
  }

  private broadcast(r: Room, msg: unknown, except?: Conn): void {
    const s = JSON.stringify(msg);
    for (const m of r.members) if (m !== except) this.send(m, s);
  }

  private broadcastCount(r: Room): void {
    this.broadcast(r, { t: 'count', online: this.roomOnline(r) });
  }

  // ───────────── Snapshot / định kỳ ─────────────
  private fragOf(c: Conn): string {
    if (c.frag === null) {
      const o: Record<string, unknown> = {
        id: c.id, profile: c.profile, level: c.level, x: r2(c.x), z: r2(c.z), ry: r2(c.ry), anim: c.anim,
      };
      if (c.say) o.say = c.say;
      c.frag = JSON.stringify(o);
    }
    return c.frag;
  }

  private sendPlayers(to: Conn, r: Room, _now: number): void {
    const parts: string[] = [];
    for (const m of r.members) if (m !== to) parts.push(this.fragOf(m));
    if (r.id === 'main-1' && this.bots.size > 0) parts.push(...this.bots.fragments());
    this.send(to, `{"t":"players","list":[${parts.join(',')}]}`);
  }

  private tick(): void {
    const now = Date.now();
    if (this.bots.size > 0 && this.bots.step(TICK_MS / 1000, now)) {
      this.ensurePublic(1).dirty = true;
    }
    for (const c of this.conns) {
      if (c.strikes > 0) c.strikes = Math.max(0, c.strikes - (TICK_MS / 1000) * 0.2);
      if (c.say && now >= c.sayUntil) { c.say = null; c.frag = null; if (c.room) c.room.dirty = true; }
    }
    for (const r of this.rooms.values()) {
      if (!r.dirty) continue;
      r.dirty = false;
      if (r.members.size === 0) continue;
      const botFrags = r.id === 'main-1' && this.bots.size > 0 ? this.bots.fragments() : [];
      const frags = new Map<Conn, string>();
      for (const m of r.members) frags.set(m, this.fragOf(m));
      for (const m of r.members) {
        const parts: string[] = [];
        for (const [o, f] of frags) if (o !== m) parts.push(f);
        if (botFrags.length > 0) parts.push(...botFrags);
        this.send(m, `{"t":"players","list":[${parts.join(',')}]}`);
      }
    }
  }

  private pingAll(): void {
    for (const c of this.conns) {
      if (!c.alive) { c.ws.terminate(); continue; }
      c.alive = false;
      try { c.ws.ping(); } catch { /* bỏ qua */ }
    }
  }

  /** Chỉ dùng một phòng chung duy nhất, không mở phòng riêng. */
  cleanup(_now = Date.now()): void {
    for (const [id, r] of this.rooms) {
      if (id !== 'main-1' && r.members.size === 0) this.rooms.delete(id);
    }
  }

  // ───────────── API cho HTTP ─────────────
  online(): number { return this.conns.size + this.bots.size; }
  roomCount(): number { return this.rooms.size; }

  lobby(): RoomInfo[] {
    return [this.info(this.ensurePublic(1))];
  }

  createPrivate(): RoomInfo | null {
    return null;
  }

  /** Phát thông điệp tới toàn bộ người đang ở trong chùa (vd đổi nhạc chung). */
  broadcastAll(msg: unknown): void {
    const s = JSON.stringify(msg);
    for (const c of this.conns) if (c.hello) this.send(c, s);
  }

  /** Bạn bè của `email` đang ở phòng nào. */
  presenceOf(email: string): RoomInfo | null {
    const s = this.byEmail.get(email);
    if (!s) return null;
    for (const c of s) if (c.room) return this.info(c.room);
    return null;
  }
  isUserOnline(email: string): boolean { return this.byEmail.has(email); }

  /** Khách đang online (không đăng nhập) + Phật tử ảo cho bảng xếp hạng. */
  guests(): { name: string; level: number; streak: number }[] {
    const out: { name: string; level: number; streak: number }[] = this.bots.leaderboardRows();
    for (const c of this.conns) if (c.hello && !c.email) out.push({ name: c.profile.name, level: c.level, streak: c.streak });
    return out;
  }

  /** Ngắt kết nối người chơi `id`; trả IP (hoặc null nếu không thấy). */
  kick(id: string): string | null {
    for (const c of this.conns) {
      if (c.id === id) {
        const ip = c.ip;
        this.notice(c, 'Bạn đã bị mời rời khỏi chùa.');
        c.ws.close(1008, 'banned');
        return ip;
      }
    }
    return null;
  }
  kickIp(ip: string): void {
    for (const c of this.conns) if (c.ip === ip) c.ws.close(1008, 'banned');
  }

  async close(): Promise<void> {
    this.closed = true;
    clearInterval(this.tickTimer); clearInterval(this.pingTimer); clearInterval(this.cleanTimer);
    for (const c of this.conns) {
      this.notice(c, 'Máy chủ đang khởi động lại, bạn sẽ được kết nối lại ngay.');
      c.ws.close(1001, 'server shutdown');
    }
    await new Promise<void>((res) => {
      const t = setTimeout(() => { for (const c of this.conns) c.ws.terminate(); res(); }, 1500);
      t.unref?.();
      const poll = setInterval(() => { if (this.conns.size === 0) { clearInterval(poll); clearTimeout(t); res(); } }, 25);
      poll.unref?.();
    });
    this.wss.close();
  }
}
