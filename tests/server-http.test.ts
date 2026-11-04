/** Test HTTP: health, lobby/rooms, auth, tiến độ, bảng xếp hạng, góp ý, bạn đạo, admin, lưu trữ. */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Http, PROFILE, profileNamed, startTest, sleep, Client } from './server-helpers';

let S: Awaited<ReturnType<typeof startTest>>;
let http: Http;
beforeAll(async () => { S = await startTest({ adminToken: 'sekret', limits: { apiPerMin: 10_000, authFailMax: 5, registerPerHour: 50, feedbackPerHour: 5, roomsPerHour: 4 } }); http = new Http(S.url); });
afterAll(async () => { await S.close(); });

describe('cơ bản', () => {
  it('health', async () => {
    const r = await http.get('/api/health');
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, online: 0 });
    expect(typeof r.json.uptime).toBe('number');
    expect(typeof r.json.version).toBe('string');
    expect(r.headers.get('x-content-type-options')).toBe('nosniff');
    expect(r.headers.get('content-security-policy')).toContain("default-src 'self'");
  });

  it('lobby chỉ có duy nhất một phòng chung Chùa Liên Hoa và chặn tạo phòng riêng', async () => {
    const l = await http.get('/api/lobby');
    expect(Array.isArray(l.json)).toBe(true);
    expect(l.json).toHaveLength(1);
    expect(l.json[0]).toMatchObject({ id: 'main-1', label: 'Chùa Liên Hoa', kind: 'public', online: 0 });
    const p = await http.post('/api/rooms');
    expect(p.status).toBe(403);
    const l2 = await http.get('/api/lobby');
    expect(l2.json).toHaveLength(1);
  });

  it('body quá lớn / sai JSON / sai content-type', async () => {
    const big = await http.post('/api/feedback', { message: 'x'.repeat(40_000) });
    expect(big.status).toBe(413);
    const bad = await http.req('POST', '/api/auth/login', '{nope', { 'content-type': 'application/json' });
    expect(bad.status).toBe(400);
    const ct = await http.req('POST', '/api/auth/logout', 'a=1', { 'content-type': 'application/x-www-form-urlencoded' });
    expect(ct.status).toBe(415);
    expect((await http.get('/api/khong-co')).status).toBe(404);
  });
});

describe('tài khoản', () => {
  const email = 'Lan@Example.com';
  it('đăng ký: kiểm tra đầu vào', async () => {
    expect((await http.post('/api/auth/register', { email: 'abc', password: '12345678', profile: PROFILE })).status).toBe(400);
    const short = await http.post('/api/auth/register', { email, password: '1234567', profile: PROFILE });
    expect(short.status).toBe(400);
    expect(short.json.error).toMatch(/8 ký tự/);
    expect((await http.post('/api/auth/register', { email, password: '12345678', profile: { ...PROFILE, outfit: 'x' } })).status).toBe(400);
    expect((await http.post('/api/auth/register', { email, password: '12345678', profile: { ...PROFILE, name: 'A' } })).status).toBe(400);
  });

  it('đăng ký → me → đăng xuất → đăng nhập', async () => {
    const reg = await http.post('/api/auth/register', { email, password: 'matkhau-dai', profile: PROFILE });
    expect(reg.status).toBe(201);
    expect(reg.json.user).toMatchObject({ email: 'lan@example.com', profile: PROFILE });
    expect(reg.json.user.hash).toBeUndefined();
    const cookie = reg.headers.get('set-cookie')!;
    expect(cookie).toMatch(/^sid=[0-9a-f]{64}/);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('Max-Age=2592000');

    const me = await http.get('/api/auth/me');
    expect(me.json.user.email).toBe('lan@example.com');

    // Mật khẩu không nằm dạng rõ trong db, phiên lưu băm.
    const dbText = JSON.stringify(S.db.data);
    expect(dbText).not.toContain('matkhau-dai');
    expect(dbText).not.toContain(cookie.split(';')[0].slice(4));

    expect((await http.post('/api/auth/register', { email: 'lan@example.com', password: 'matkhau-dai', profile: PROFILE })).status).toBe(409);

    expect((await http.post('/api/auth/logout')).json.ok).toBe(true);
    expect((await http.get('/api/auth/me')).json.user).toBeNull();

    const bad = await http.post('/api/auth/login', { email, password: 'sai-mat-khau' });
    expect(bad.status).toBe(401);
    const good = await http.post('/api/auth/login', { email: 'LAN@example.com', password: 'matkhau-dai' });
    expect(good.status).toBe(200);
    expect((await http.get('/api/auth/me')).json.user.email).toBe('lan@example.com');
  });

  it('chống dò mật khẩu: khoá sau nhiều lần sai', async () => {
    const h2 = new Http(S.url);
    let status = 0;
    for (let i = 0; i < 7; i++) status = (await h2.post('/api/auth/login', { email: 'nobody@example.com', password: 'wrongpass' + i })).status;
    expect(status).toBe(429);
    // Khoá theo IP: ngay cả đúng mật khẩu cũng bị chặn tạm thời.
    const r = await h2.post('/api/auth/login', { email, password: 'matkhau-dai' });
    expect(r.status).toBe(429);
    expect(r.headers.get('retry-after')).toBeTruthy();
  });
});

describe('tiến độ + bảng xếp hạng', () => {
  it('cần đăng nhập; lưu và đọc lại; từ chối state sai', async () => {
    const h = new Http(S.url);
    expect((await h.get('/api/progress')).status).toBe(401);
    expect((await h.put('/api/progress', { state: {}, profile: PROFILE })).status).toBe(401);
    // đăng nhập (IP cũ có thể đang bị khoá do test trước → đăng ký tài khoản mới)
    const reg = await h.post('/api/auth/register', { email: 'prog@example.com', password: 'matkhau-dai', profile: profileNamed('Minh Đức') });
    expect(reg.status).toBe(201);
    const empty = await h.get('/api/progress');
    expect(empty.json.state).toBeNull();
    expect((await h.put('/api/progress', { state: 'abc', profile: PROFILE })).status).toBe(400);
    expect((await h.put('/api/progress', { state: [1], profile: PROFILE })).status).toBe(400);
    expect((await h.put('/api/progress', { state: { blob: 'x'.repeat(17_000) }, profile: PROFILE })).status).toBe(400);
    expect((await h.put('/api/progress', { state: { xp: 1 }, profile: { name: 'x' } })).status).toBe(400);
    const ok = await h.put('/api/progress', { state: { v: 1, xp: 500, level: 7, streak: 4 }, profile: profileNamed('Minh Đức') });
    expect(ok.status).toBe(200);
    expect(ok.json.state).toEqual({ v: 1, xp: 500, level: 7, streak: 4 });
    const got = await h.get('/api/progress');
    expect(got.json.state.xp).toBe(500);
    expect(got.json.profile.name).toBe('Minh Đức');
    // không hạ xp: bản máy chủ cao hơn được giữ
    const lower = await h.put('/api/progress', { state: { v: 1, xp: 100, level: 2 }, profile: PROFILE });
    expect(lower.json.state.xp).toBe(500);
    expect(lower.json.merged).toBe(true);
  });

  it('bxh: người đăng nhập + khách online, sắp xếp, tăng cấp quá nhanh bị bỏ qua', async () => {
    const a = new Http(S.url);
    await a.post('/api/auth/register', { email: 'top1@example.com', password: 'matkhau-dai', profile: profileNamed('Thiện Tâm') });
    await a.put('/api/progress', { state: { xp: 9, level: 30, streak: 12 }, profile: profileNamed('Thiện Tâm') });
    // khách online
    const g = new Client(S.url);
    await g.hello(profileNamed('Khách Sen'), 12);
    let r = await new Http(S.url).get('/api/bxh?kind=level');
    expect(r.status).toBe(200);
    const rows = r.json.rows as any[];
    expect(rows[0]).toMatchObject({ rank: 1, name: 'Thiện Tâm', level: 30, streak: 12, tier: 6 });
    expect(rows.find((x) => x.name === 'Khách Sen')).toMatchObject({ level: 12, tier: 3 });
    expect(rows.map((x) => x.rank)).toEqual(rows.map((_, i) => i + 1));
    // nhảy cấp bất thường bị bỏ qua
    await a.put('/api/progress', { state: { xp: 10, level: 900, streak: 12 }, profile: profileNamed('Thiện Tâm') });
    r = await new Http(S.url).get('/api/bxh?kind=level');
    expect(r.json.rows.find((x: any) => x.name === 'Thiện Tâm').level).toBe(30);
    // theo chuỗi
    const s = await new Http(S.url).get('/api/bxh?kind=streak');
    expect(s.json.rows[0].name).toBe('Thiện Tâm');
    g.close();
  });
});

describe('góp ý', () => {
  it('ghi data/feedback.jsonl; kiểm tra độ dài; giới hạn 5/giờ/IP', async () => {
    const h = new Http(S.url);
    expect((await h.post('/api/feedback', { kind: 'Góp ý', message: '' })).status).toBe(400);
    expect((await h.post('/api/feedback', { kind: 'Góp ý', message: 'x'.repeat(1001) })).status).toBe(400);
    expect((await h.post('/api/feedback', { kind: 'Góp ý', message: 'ok', email: 'sai-email' })).status).toBe(400);
    for (let i = 0; i < 5; i++) {
      const r = await h.post('/api/feedback', { kind: 'Báo lỗi', message: `Chùa rất đẹp ${i}`, email: 'a@b.vn', ua: 'jest', version: '1.0.0' });
      expect(r.status).toBe(200);
      expect(r.json).toEqual({ ok: true });
    }
    const r6 = await h.post('/api/feedback', { kind: 'Góp ý', message: 'thứ sáu' });
    expect(r6.status).toBe(429);
    const lines = (await fs.readFile(path.join(S.dir, 'feedback.jsonl'), 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
    expect(lines).toHaveLength(5);
    expect(lines[0]).toMatchObject({ kind: 'Báo lỗi', message: 'Chùa rất đẹp 0', email: 'a@b.vn', version: '1.0.0' });
  });
});

describe('bạn đạo', () => {
  it('mời → chấp nhận → hiện diện → xoá', async () => {
    const a = new Http(S.url);
    const b = new Http(S.url);
    const ra = await a.post('/api/auth/register', { email: 'fa@example.com', password: 'matkhau-dai', profile: profileNamed('Hoa Sen') });
    await b.post('/api/auth/register', { email: 'fb@example.com', password: 'matkhau-dai', profile: profileNamed('Bình An') });
    expect(ra.status).toBe(201);
    expect((await new Http(S.url).get('/api/friends/me')).status).toBe(401);
    const ma = (await a.get('/api/friends/me')).json;
    const mb = (await b.get('/api/friends/me')).json;
    expect(ma.code).toMatch(/^[A-Z2-9]{6}$/);
    expect(ma.code).not.toBe(mb.code);
    expect((await a.post('/api/friends/invite', { code: 'ZZZZZZ' })).status).toBe(404);
    expect((await a.post('/api/friends/invite', { code: ma.code })).status).toBe(400);
    expect((await a.post('/api/friends/invite', { code: mb.code })).json.status).toBe('invited');
    expect((await a.post('/api/friends/invite', { code: mb.code })).status).toBe(409);
    const inc = (await b.get('/api/friends/me')).json;
    expect(inc.incoming).toHaveLength(1);
    expect(inc.incoming[0]).toMatchObject({ code: ma.code, name: 'Hoa Sen' });
    expect((await a.post('/api/friends/accept', { code: mb.code })).status).toBe(404); // không phải người mời
    expect((await b.post('/api/friends/accept', { code: ma.code })).status).toBe(200);
    expect((await a.get('/api/friends/me')).json.friends[0]).toMatchObject({ code: mb.code, name: 'Bình An' });

    // hiện diện: b vào sân chùa chung bằng WS có cookie
    let pres = (await a.get('/api/friends/presence')).json;
    expect(pres.friends[0]).toMatchObject({ name: 'Bình An', online: false, room: null });
    const c = new Client(S.url, b.cookie);
    await c.hello(profileNamed('Bình An'), 2);
    pres = (await a.get('/api/friends/presence')).json;
    expect(pres.friends[0]).toMatchObject({ online: true, room: { id: 'main-1', label: 'Chùa Liên Hoa' } });
    c.close();
    await sleep(100);

    expect((await a.post('/api/friends/remove', { code: mb.code })).status).toBe(200);
    expect((await a.get('/api/friends/me')).json.friends).toHaveLength(0);
    expect((await b.get('/api/friends/me')).json.friends).toHaveLength(0);
  });
});

describe('admin', () => {
  it('cần đúng x-admin-token; cấm IP người chơi', async () => {
    const h = new Http(S.url);
    expect((await h.post('/api/admin/ban', { id: 'deadbeef' })).status).toBe(403);
    expect((await h.post('/api/admin/ban', { id: 'deadbeef' }, { 'x-admin-token': 'sekret' })).status).toBe(404);
    const c = new Client(S.url);
    const w = await c.hello();
    expect((await h.post('/api/admin/ban', { id: w.id }, { 'x-admin-token': 'sekret' })).json.ok).toBe(true);
    expect(await c.waitClose()).toBe(1008);
    expect((await h.get('/api/health')).status).toBe(403);
    expect(S.db.data.bans).toHaveLength(1);
  });
});

describe('lưu trữ & tắt êm', () => {
  it('db.json ghi nguyên tử và nạp lại sau khởi động lại', async () => {
    const s1 = await startTest({});
    const h = new Http(s1.url);
    await h.post('/api/auth/register', { email: 'persist@example.com', password: 'matkhau-dai', profile: PROFILE });
    const cookie = h.cookie;
    await s1.close();
    const files = await fs.readdir(s1.dir);
    expect(files).toContain('db.json');
    expect(files.some((f) => f.endsWith('.tmp'))).toBe(false);
    const s2 = await startTest({ dataDir: s1.dir });
    const h2 = new Http(s2.url);
    h2.cookie = cookie;
    expect((await h2.get('/api/auth/me')).json.user.email).toBe('persist@example.com');
    expect((await h2.post('/api/auth/login', { email: 'persist@example.com', password: 'matkhau-dai' })).status).toBe(200);
    await s2.close();
  });
});
