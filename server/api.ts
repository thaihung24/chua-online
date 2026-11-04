/** Các route HTTP /api/*: sức khoẻ, phòng, bảng xếp hạng, tài khoản, tiến độ, góp ý, bạn đạo, admin. */
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import type { Hub } from './hub';
import type { Db, UserRec, FriendRec } from './db';
import { ROOT, type ServerOptions } from './config';
import { Limiter, clientIp, getCookie, randomCode, randomHex, safeEqual, sha256 } from './util';
import { clampLevel, parseProfile, plausibleLevel, tierOf, validEmail, validState } from './validate';

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const SESSION_MS = 30 * 24 * 3600 * 1000;
const MAX_SESSIONS_PER_USER = 10;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export interface ApiCtx { opts: ServerOptions; db: Db; hub: Hub; bannedIps: Set<string>; startedAt: number }

const fail = (res: Response, status: number, error: string): void => { res.status(status).json({ ok: false, error }); };

export function resolveSessionEmail(db: Db, token: string | null): string | null {
  if (!token || token.length > 128) return null;
  const rec = db.data.sessions[sha256(token)];
  if (!rec) return null;
  if (rec.expires < Date.now()) { delete db.data.sessions[sha256(token)]; db.touch(); return null; }
  return rec.email;
}

/** Cập nhật bảng xếp hạng cho người đã đăng nhập (kiểm tra hợp lý). */
export function updateLeader(db: Db, email: string, name: string, level: number, streak: number): void {
  const now = Date.now();
  const lv = clampLevel(level);
  const st = Math.max(0, Math.min(99999, Math.floor(Number.isFinite(streak) ? streak : 0)));
  const prev = db.data.leaderboard[email];
  let useLevel = lv;
  if (prev) {
    if (!plausibleLevel(prev.level, prev.updatedAt, lv, now)) useLevel = prev.level;
  } else if (lv > 100) {
    useLevel = 1;
  }
  const prevStreak = prev?.streak ?? 0;
  // Chuỗi tăng không quá nhanh: tối đa +2 so với lần trước trong 1 ngày.
  const useStreak = prev && st > prevStreak + 2 + Math.floor((now - prev.updatedAt) / 86_400_000) ? prevStreak : st;
  db.data.leaderboard[email] = { name, level: useLevel, streak: useStreak, updatedAt: now };
  db.touch();
}

export function registerApi(app: Express, ctx: ApiCtx): { sweep(): void } {
  const { opts, db, hub } = ctx;
  const ip = (req: Request): string => clientIp(req, opts.trustProxy);

  const apiLimiter = new Limiter(opts.limits.apiPerMin, 60_000);
  const registerLimiter = new Limiter(opts.limits.registerPerHour, 3_600_000);
  const feedbackLimiter = new Limiter(opts.limits.feedbackPerHour, 3_600_000);
  const roomsLimiter = new Limiter(opts.limits.roomsPerHour, 3_600_000);
  const loginFails = new Limiter(opts.limits.authFailMax, 15 * 60_000);
  const adminFails = new Limiter(10, 15 * 60_000);
  const friendLimiter = new Limiter(60, 60_000);

  const tooMany = (res: Response, retryAfter: number, msg = 'Bạn thao tác hơi nhanh, xin thử lại sau ít phút.'): void => {
    res.setHeader('Retry-After', String(retryAfter));
    fail(res, 429, msg);
  };

  // ── CORS (hỗ trợ `*` hoặc danh sách domain phân cách bằng dấu phẩy khi nối từ Vercel) ──
  if (opts.corsOrigin) {
    const allowed = opts.corsOrigin.split(',').map((s) => s.trim().replace(/\/+$/, '')).filter(Boolean);
    app.use('/api', (req, res, next) => {
      const reqOrigin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
      const allowOrigin = allowed.includes('*')
        ? (reqOrigin || '*')
        : (allowed.includes(reqOrigin) ? reqOrigin : allowed[0] ?? '');
      if (allowOrigin) res.setHeader('Access-Control-Allow-Origin', allowOrigin);
      if (allowOrigin !== '*') res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'content-type,x-admin-token');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
      res.setHeader('Vary', 'Origin');
      if (req.method === 'OPTIONS') { res.status(204).end(); return; }
      next();
    });
  }

  // ── Chung: IP bị cấm, giới hạn tốc độ, JSON ≤ 32KB, chống CSRF (POST/PUT phải là application/json) ──
  app.use('/api', (req, res, next) => {
    const a = ip(req);
    if (ctx.bannedIps.has(sha256(a))) return fail(res, 403, 'Truy cập bị từ chối.');
    const h = apiLimiter.hit(a);
    if (!h.ok) return tooMany(res, h.retryAfter);
    res.setHeader('Cache-Control', 'no-store');
    const len = req.headers['content-length'];
    const hasBody = (len !== undefined && len !== '0') || req.headers['transfer-encoding'] !== undefined;
    if (hasBody && req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS' && !req.is('application/json')) {
      return fail(res, 415, 'Yêu cầu không hợp lệ (cần JSON).');
    }
    next();
  });
  app.use('/api', express.json({ limit: '32kb', strict: true }));
  app.use('/api', (req, _res, next) => { if (!req.body || typeof req.body !== 'object') req.body = {}; next(); });

  const sessionOf = (req: Request): { email: string; token: string } | null => {
    const token = getCookie(req.headers.cookie, 'sid');
    const email = resolveSessionEmail(db, token);
    return email && token ? { email, token } : null;
  };
  const needUser = (req: Request, res: Response): UserRec | null => {
    const s = sessionOf(req);
    const u = s ? db.data.users[s.email] : undefined;
    if (!u) { fail(res, 401, 'Bạn cần đăng nhập để dùng tính năng này.'); return null; }
    return u;
  };
  const setCookie = (req: Request, res: Response, token: string | null): void => {
    const isSecure = opts.cookieSecure || req.secure;
    const sameSite = opts.corsOrigin && isSecure ? 'None' : 'Lax';
    const secure = isSecure ? '; Secure' : '';
    const v = token
      ? `sid=${token}; HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=${SESSION_MS / 1000}${secure}`
      : `sid=; HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=0${secure}`;
    res.setHeader('Set-Cookie', v);
  };
  const newSession = (req: Request, res: Response, email: string): void => {
    const token = randomHex(32);
    const now = Date.now();
    db.data.sessions[sha256(token)] = { email, created: now, expires: now + SESSION_MS };
    // Giới hạn số phiên mỗi tài khoản: xoá phiên cũ nhất.
    const mine = Object.entries(db.data.sessions).filter(([, s]) => s.email === email).sort((a, b) => a[1].created - b[1].created);
    while (mine.length > MAX_SESSIONS_PER_USER) { const old = mine.shift(); if (old) delete db.data.sessions[old[0]]; }
    db.touch();
    setCookie(req, res, token);
  };
  const publicUser = (u: UserRec) => ({ email: u.email, profile: u.profile, createdAt: u.createdAt });

  const hashPw = async (pw: string, salt: Buffer): Promise<string> => (await scrypt(pw, salt, 64)).toString('hex');
  const DUMMY_SALT = crypto.randomBytes(16);
  const dummyHashP = hashPw('dummy-password', DUMMY_SALT);

  // ── Sức khoẻ / phòng / nhạc chùa chung ──
  const AUDIO_EXT = new Set(['.mp3', '.m4a', '.ogg', '.wav', '.aac', '.flac']);
  const AUDIO_MIME: Record<string, string> = {
    '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.aac': 'audio/aac', '.flac': 'audio/flac',
  };
  const publicMusicDir = path.join(ROOT, 'public', 'music');
  const distMusicDir = path.join(opts.distDir, 'music');
  let musicStartedAt = Date.now();

  function normalizeMusicUrl(raw: string): string | null {
    if (/^(\/music\/[^\s]+|https:\/\/[^\s]+)$/i.test(raw.trim())) return raw.trim();
    return null;
  }

  let overrideTrack: { name: string; url: string } | null = (() => {
    if (!process.env.MUSIC_URL) return null;
    const u = normalizeMusicUrl(process.env.MUSIC_URL);
    return u ? { name: process.env.MUSIC_NAME || 'Nhạc chùa', url: u } : null;
  })();

  async function listMusicTracks(): Promise<{ name: string; url: string }[]> {
    if (overrideTrack) return [overrideTrack];
    const seen = new Set<string>();
    const out: { name: string; url: string }[] = [];
    // Đọc các tệp âm thanh trực tiếp (.mp3, .m4a, .ogg, .wav...)
    for (const dir of [publicMusicDir, distMusicDir]) {
      let names: string[] = [];
      try { names = await fs.readdir(dir); } catch { continue; }
      names.sort((a, b) => a.localeCompare(b, 'vi'));
      for (const f of names) {
        const ext = path.extname(f).toLowerCase();
        if (!AUDIO_EXT.has(ext) || f.startsWith('.') || seen.has(f)) continue;
        seen.add(f);
        out.push({ name: path.basename(f, ext), url: `/music/${encodeURIComponent(f)}` });
      }
    }
    return out;
  }

  // Trực tiếp phục vụ `/music/<file>` từ `public/music/` (không cần build lại khi chép nhạc mới).
  app.get('/music/:file', async (req, res, next) => {
    const raw = req.params.file;
    if (!raw || raw.includes('/') || raw.includes('\\') || raw.includes('\0') || raw.startsWith('.')) return next();
    const ext = path.extname(raw).toLowerCase();
    if (!AUDIO_EXT.has(ext)) return next();
    for (const dir of [publicMusicDir, distMusicDir]) {
      const full = path.join(dir, raw);
      let st: fss.Stats | null = null;
      try { const s = await fs.stat(full); if (s.isFile()) st = s; } catch { st = null; }
      if (!st) continue;
      res.setHeader('Content-Type', AUDIO_MIME[ext] ?? 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Accept-Ranges', 'bytes');
      const range = req.headers.range;
      if (typeof range === 'string' && range.startsWith('bytes=')) {
        const [sStr, eStr] = range.slice(6).split('-');
        const start = sStr ? parseInt(sStr, 10) : 0;
        const end = eStr ? Math.min(st.size - 1, parseInt(eStr, 10)) : st.size - 1;
        if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= st.size) {
          res.setHeader('Content-Range', `bytes */${st.size}`);
          res.status(416).end();
          return;
        }
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${st.size}`);
        res.setHeader('Content-Length', String(end - start + 1));
        fss.createReadStream(full, { start, end }).on('error', () => res.destroy()).pipe(res);
        return;
      }
      res.setHeader('Content-Length', String(st.size));
      fss.createReadStream(full).on('error', () => res.destroy()).pipe(res);
      return;
    }
    next();
  });

  if (opts.persist) {
    void fs.mkdir(publicMusicDir, { recursive: true }).then(() => {
      let debounce: NodeJS.Timeout | null = null;
      try {
        const watcher = fss.watch(publicMusicDir, { persistent: false }, () => {
          if (debounce) clearTimeout(debounce);
          debounce = setTimeout(() => {
            musicStartedAt = Date.now();
            void listMusicTracks().then((tracks) => {
              hub.broadcastAll({ t: 'music', tracks, startedAt: musicStartedAt, serverNow: Date.now() });
            });
          }, 350);
          debounce.unref?.();
        });
        watcher.on('error', () => undefined);
      } catch { /* bỏ qua nếu hệ thống không hỗ trợ watch */ }
    }).catch(() => undefined);
  }

  app.get('/api/music', async (_req, res) => {
    const tracks = await listMusicTracks();
    res.json({ ok: true, tracks, startedAt: musicStartedAt, serverNow: Date.now() });
  });

  app.post('/api/admin/music', async (req, res) => {
    if (!opts.adminToken) return fail(res, 404, 'Không tìm thấy.');
    const a = ip(req);
    if (adminFails.blocked(a).blocked) return tooMany(res, 60);
    const tok = req.headers['x-admin-token'];
    if (typeof tok !== 'string' || !safeEqual(tok, opts.adminToken)) { adminFails.hit(a); return fail(res, 403, 'Không được phép.'); }
    const body = req.body as Record<string, unknown>;
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 80) : 'Nhạc chùa';
    if (!url) {
      overrideTrack = null;
    } else {
      const norm = normalizeMusicUrl(url);
      if (!norm) return fail(res, 400, 'Đường dẫn nhạc cần là link YouTube, /music/... hoặc https://...');
      overrideTrack = { name, url: norm };
    }
    musicStartedAt = Date.now();
    const tracks = await listMusicTracks();
    hub.broadcastAll({ t: 'music', tracks, startedAt: musicStartedAt, serverNow: Date.now() });
    res.json({ ok: true, tracks, startedAt: musicStartedAt });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, online: hub.online(), rooms: hub.roomCount(), uptime: Math.round((Date.now() - ctx.startedAt) / 1000), version: opts.version });
  });
  app.get('/api/lobby', (_req, res) => { res.json(hub.lobby()); });
  app.post('/api/rooms', (_req, res) => {
    fail(res, 403, 'Chùa Bình Thạnh dùng chung một không gian duy nhất cho tất cả mọi người, không tạo phòng riêng.');
  });

  // ── Bảng xếp hạng ──
  const rankCache = new Map<string, { at: number; rows: unknown[] }>();
  app.get('/api/bxh', (req, res) => {
    const kind = req.query.kind === 'streak' ? 'streak' : 'level';
    const now = Date.now();
    const c = rankCache.get(kind);
    if (c && now - c.at < opts.rankTtlMs) return void res.json({ rows: c.rows });
    type Row = { name: string; level: number; streak: number };
    const rows: Row[] = Object.values(db.data.leaderboard).map((r) => ({ name: r.name, level: r.level, streak: r.streak }));
    const seen = new Set(Object.values(db.data.leaderboard).map((r) => r.name));
    for (const g of hub.guests()) if (!seen.has(g.name)) { seen.add(g.name); rows.push(g); }
    rows.sort((a, b) => (kind === 'streak' ? b.streak - a.streak || b.level - a.level : b.level - a.level || b.streak - a.streak) || a.name.localeCompare(b.name));
    const out = rows.slice(0, 50).map((r, i) => {
      const t = tierOf(r.level);
      return { rank: i + 1, name: r.name, level: r.level, tier: t.id, tierName: t.name, streak: r.streak };
    });
    rankCache.set(kind, { at: now, rows: out });
    res.json({ rows: out });
  });

  // ── Tài khoản ──
  app.post('/api/auth/register', async (req, res) => {
    const a = ip(req);
    const h = registerLimiter.hit(a);
    if (!h.ok) return tooMany(res, h.retryAfter, 'Bạn đã đăng ký quá nhiều lần, xin thử lại sau.');
    const { email: rawEmail, password, profile: rawProfile } = req.body as Record<string, unknown>;
    if (typeof rawEmail !== 'string' || !validEmail(rawEmail.trim())) return fail(res, 400, 'Email chưa hợp lệ.');
    if (typeof password !== 'string' || password.length < 8) return fail(res, 400, 'Mật khẩu cần ít nhất 8 ký tự.');
    if (password.length > 128) return fail(res, 400, 'Mật khẩu quá dài (tối đa 128 ký tự).');
    const p = parseProfile(rawProfile);
    if (!p) return fail(res, 400, 'Hồ sơ nhân vật chưa hợp lệ.');
    if (p.nameError) return fail(res, 400, p.nameError);
    const email = rawEmail.trim().toLowerCase();
    if (db.data.users[email]) return fail(res, 409, 'Email này đã được đăng ký, bạn hãy đăng nhập nhé.');
    const salt = crypto.randomBytes(16);
    const hash = await hashPw(password, salt);
    if (db.data.users[email]) return fail(res, 409, 'Email này đã được đăng ký, bạn hãy đăng nhập nhé.');
    const u: UserRec = { email, salt: salt.toString('hex'), hash, profile: p.profile, createdAt: Date.now() };
    db.data.users[email] = u;
    let code = '';
    const used = new Set(Object.values(db.data.friends).map((f) => f.code));
    do { code = randomCode(6, CODE_ALPHABET); } while (used.has(code));
    db.data.friends[email] = { code, friends: [], incoming: [], outgoing: [] };
    db.touch();
    newSession(req, res, email);
    res.status(201).json({ ok: true, user: publicUser(u) });
  });

  app.post('/api/auth/login', async (req, res) => {
    const a = ip(req);
    const { email: rawEmail, password } = req.body as Record<string, unknown>;
    if (typeof rawEmail !== 'string' || typeof password !== 'string' || password.length > 128) return fail(res, 400, 'Email hoặc mật khẩu chưa đúng.');
    const email = rawEmail.trim().toLowerCase();
    const k1 = `ip:${a}`;
    const k2 = `em:${email}`;
    const b1 = loginFails.blocked(k1);
    const b2 = loginFails.blocked(k2);
    if (b1.blocked || b2.blocked) return tooMany(res, Math.max(b1.retryAfter, b2.retryAfter), 'Đăng nhập sai quá nhiều lần, xin thử lại sau ít phút.');
    const u = db.data.users[email];
    const salt = u ? Buffer.from(u.salt, 'hex') : DUMMY_SALT;
    const hash = await hashPw(password, salt);
    const expect = u ? u.hash : await dummyHashP;
    const ok = u !== undefined && crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expect, 'hex'));
    if (!ok || !u) {
      loginFails.hit(k1); loginFails.hit(k2);
      return fail(res, 401, 'Email hoặc mật khẩu chưa đúng.');
    }
    loginFails.reset(k2);
    newSession(req, res, email);
    res.json({ ok: true, user: publicUser(u) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const s = sessionOf(req);
    if (s) { delete db.data.sessions[sha256(s.token)]; db.touch(); }
    setCookie(req, res, null);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const s = sessionOf(req);
    const u = s ? db.data.users[s.email] : undefined;
    res.json({ user: u ? publicUser(u) : null });
  });

  // ── Tiến độ ──
  const levelOf = (state: unknown, body: Record<string, unknown>): { level: number; streak: number } => {
    const st = (state ?? {}) as Record<string, unknown>;
    const lv = typeof body.level === 'number' ? body.level : typeof st.level === 'number' ? st.level : 1;
    const sk = typeof body.streak === 'number' ? body.streak : typeof st.streak === 'number' ? st.streak : 0;
    return { level: lv, streak: sk };
  };
  app.get('/api/progress', (req, res) => {
    const u = needUser(req, res);
    if (!u) return;
    res.json({ ok: true, state: u.state ?? null, profile: u.profile, updatedAt: u.stateAt ?? null });
  });
  app.put('/api/progress', (req, res) => {
    const u = needUser(req, res);
    if (!u) return;
    const body = req.body as Record<string, unknown>;
    if (!validState(body.state)) return fail(res, 400, 'Dữ liệu tiến độ chưa hợp lệ hoặc quá lớn.');
    const p = parseProfile(body.profile);
    if (!p) return fail(res, 400, 'Hồ sơ nhân vật chưa hợp lệ.');
    if (p.nameError) return fail(res, 400, p.nameError);
    // Không hạ cấp: nếu bản máy chủ có `xp` cao hơn thì giữ bản máy chủ, client sẽ hợp nhất.
    const cur = u.state as Record<string, unknown> | undefined;
    const incoming = body.state as Record<string, unknown>;
    const keepServer = !!cur && typeof cur.xp === 'number' && typeof incoming.xp === 'number' && cur.xp > incoming.xp;
    if (!keepServer) { u.state = incoming; u.stateAt = Date.now(); }
    u.profile = p.profile;
    const { level, streak } = levelOf(u.state, body);
    updateLeader(db, u.email, u.profile.name, level, streak);
    db.touch();
    res.json({ ok: true, state: u.state ?? null, profile: u.profile, updatedAt: u.stateAt ?? null, merged: keepServer });
  });

  // ── Góp ý ──
  app.post('/api/feedback', async (req, res) => {
    const b = req.body as Record<string, unknown>;
    const msg = typeof b.message === 'string' ? b.message.trim() : '';
    if (msg.length < 2) return fail(res, 400, 'Bạn hãy nhập nội dung góp ý nhé.');
    if (msg.length > 1000) return fail(res, 400, 'Nội dung tối đa 1000 ký tự.');
    const kind = typeof b.kind === 'string' && b.kind.trim() ? b.kind.trim().slice(0, 30) : 'khac';
    const email = typeof b.email === 'string' && b.email.trim() ? b.email.trim().slice(0, 254) : undefined;
    if (email && !validEmail(email)) return fail(res, 400, 'Email chưa hợp lệ.');
    const h = feedbackLimiter.hit(ip(req));
    if (!h.ok) return tooMany(res, h.retryAfter, 'Bạn đã gửi nhiều góp ý, xin thử lại sau nhé.');
    const rec = {
      at: new Date().toISOString(), kind, message: msg, email,
      ua: typeof b.ua === 'string' ? b.ua.slice(0, 300) : undefined,
      version: typeof b.version === 'string' ? b.version.slice(0, 40) : undefined,
      ipHash: sha256(ip(req)).slice(0, 12),
    };
    if (opts.persist) {
      try {
        await fs.mkdir(opts.dataDir, { recursive: true });
        await fs.appendFile(path.join(opts.dataDir, 'feedback.jsonl'), JSON.stringify(rec) + '\n', { mode: 0o600 });
      } catch (e) {
        console.error('[feedback] ghi lỗi:', (e as Error).message);
        return fail(res, 500, 'Chưa lưu được góp ý, xin thử lại sau.');
      }
    }
    res.json({ ok: true });
  });

  // ── Bạn đạo ──
  const friendOf = (email: string): FriendRec => {
    let f = db.data.friends[email];
    if (!f) {
      const used = new Set(Object.values(db.data.friends).map((x) => x.code));
      let code = '';
      do { code = randomCode(6, CODE_ALPHABET); } while (used.has(code));
      f = db.data.friends[email] = { code, friends: [], incoming: [], outgoing: [] };
      db.touch();
    }
    return f;
  };
  const emailByCode = (code: unknown): string | null => {
    if (typeof code !== 'string') return null;
    const c = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(c)) return null;
    for (const [em, f] of Object.entries(db.data.friends)) if (f.code === c) return em;
    return null;
  };
  const brief = (email: string) => {
    const u = db.data.users[email];
    const lb = db.data.leaderboard[email];
    return { code: friendOf(email).code, name: u?.profile.name ?? 'Bạn đạo', level: lb?.level ?? 1, online: hub.isUserOnline(email) };
  };
  const friendGuard = (req: Request, res: Response, next: NextFunction): void => {
    const h = friendLimiter.hit(ip(req));
    if (!h.ok) return tooMany(res, h.retryAfter);
    next();
  };
  const unlink = (arr: string[], v: string): void => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); };

  app.get('/api/friends/me', friendGuard, (req, res) => {
    const u = needUser(req, res);
    if (!u) return;
    const f = friendOf(u.email);
    res.json({ ok: true, code: f.code, friends: f.friends.map(brief), incoming: f.incoming.map(brief), outgoing: f.outgoing.map(brief) });
  });
  app.post('/api/friends/invite', friendGuard, (req, res) => {
    const u = needUser(req, res);
    if (!u) return;
    const target = emailByCode((req.body as Record<string, unknown>).code);
    if (!target) return fail(res, 404, 'Không tìm thấy mã bạn đạo này.');
    if (target === u.email) return fail(res, 400, 'Đây là mã của chính bạn.');
    const me = friendOf(u.email);
    const them = friendOf(target);
    if (me.friends.includes(target)) return fail(res, 409, 'Hai bạn đã là bạn đạo của nhau.');
    if (me.incoming.includes(target)) {
      // Họ đã mời mình trước: kết bạn luôn.
      unlink(me.incoming, target); unlink(them.outgoing, u.email);
      me.friends.push(target); them.friends.push(u.email);
      db.touch();
      return void res.json({ ok: true, status: 'friends' });
    }
    if (me.outgoing.includes(target)) return fail(res, 409, 'Bạn đã gửi lời mời cho người này rồi.');
    if (me.outgoing.length >= 100 || them.incoming.length >= 100) return fail(res, 429, 'Danh sách lời mời đã đầy.');
    me.outgoing.push(target); them.incoming.push(u.email);
    db.touch();
    res.json({ ok: true, status: 'invited' });
  });
  app.post('/api/friends/accept', friendGuard, (req, res) => {
    const u = needUser(req, res);
    if (!u) return;
    const from = emailByCode((req.body as Record<string, unknown>).code);
    const me = friendOf(u.email);
    if (!from || !me.incoming.includes(from)) return fail(res, 404, 'Không có lời mời nào từ mã này.');
    const them = friendOf(from);
    unlink(me.incoming, from); unlink(them.outgoing, u.email);
    if (!me.friends.includes(from)) me.friends.push(from);
    if (!them.friends.includes(u.email)) them.friends.push(u.email);
    db.touch();
    res.json({ ok: true });
  });
  app.post('/api/friends/remove', friendGuard, (req, res) => {
    const u = needUser(req, res);
    if (!u) return;
    const other = emailByCode((req.body as Record<string, unknown>).code);
    if (!other) return fail(res, 404, 'Không tìm thấy mã bạn đạo này.');
    const me = friendOf(u.email);
    const them = friendOf(other);
    for (const [rec, o] of [[me, other], [them, u.email]] as const) {
      unlink(rec.friends, o); unlink(rec.incoming, o); unlink(rec.outgoing, o);
    }
    db.touch();
    res.json({ ok: true });
  });
  app.get('/api/friends/presence', friendGuard, (req, res) => {
    const u = needUser(req, res);
    if (!u) return;
    const f = friendOf(u.email);
    const list = f.friends.map((em) => {
      const r = hub.presenceOf(em);
      return { code: friendOf(em).code, name: db.data.users[em]?.profile.name ?? 'Bạn đạo', online: hub.isUserOnline(em), room: r ? { id: r.id, label: r.label } : null };
    });
    res.json({ ok: true, friends: list });
  });

  // ── Admin tối thiểu ──
  app.post('/api/admin/ban', (req, res) => {
    if (!opts.adminToken) return fail(res, 404, 'Không tìm thấy.');
    const a = ip(req);
    if (adminFails.blocked(a).blocked) return tooMany(res, 60);
    const tok = req.headers['x-admin-token'];
    if (typeof tok !== 'string' || !safeEqual(tok, opts.adminToken)) { adminFails.hit(a); return fail(res, 403, 'Không được phép.'); }
    const id = (req.body as Record<string, unknown>).id;
    if (typeof id !== 'string' || !/^[0-9a-f]{8}$/.test(id)) return fail(res, 400, 'Thiếu hoặc sai id người chơi.');
    const bannedIp = hub.kick(id);
    if (!bannedIp) return fail(res, 404, 'Không thấy người chơi này đang online.');
    const ipHash = sha256(bannedIp);
    ctx.bannedIps.add(ipHash);
    db.data.bans.push({ id, ipHash, at: Date.now() });
    db.touch();
    hub.kickIp(bannedIp);
    res.json({ ok: true });
  });

  // ── API không tồn tại / lỗi chung ──
  app.use('/api', (_req, res) => fail(res, 404, 'Không tìm thấy.'));
  app.use('/api', (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const e = err as { type?: string; status?: number };
    if (e.type === 'entity.too.large') return fail(res, 413, 'Dữ liệu gửi lên quá lớn.');
    if (e.type === 'entity.parse.failed') return fail(res, 400, 'Dữ liệu JSON không hợp lệ.');
    console.error('[api]', err);
    fail(res, 500, 'Máy chủ gặp trục trặc, xin thử lại sau.');
  });

  return {
    sweep(): void {
      const now = Date.now();
      for (const [k, s] of Object.entries(db.data.sessions)) if (s.expires < now) delete db.data.sessions[k];
      for (const l of [apiLimiter, registerLimiter, feedbackLimiter, roomsLimiter, loginFails, adminFails, friendLimiter]) l.sweep(now);
      db.touch();
    },
  };
}
