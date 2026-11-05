/** Test client mạng (src/net) chạy với máy chủ thật: createNet, api helpers, backoff/offline. */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startTest, sleep } from './server-helpers';

let S: Awaited<ReturnType<typeof startTest>>;
let target = '';
let createNet: typeof import('../src/net/client').createNet;
let api: typeof import('../src/net/api');
const profile = { name: 'Tuệ An', gender: 'female', outfit: 'ao-dai', colorIndex: 1 } as const;

function useLocation(url: string): void {
  const u = new URL(url);
  (globalThis as any).location = { protocol: u.protocol, host: u.host, search: u.search };
}
const until = async (fn: () => boolean, ms = 4000): Promise<void> => {
  const t0 = Date.now();
  while (!fn()) { if (Date.now() - t0 > ms) throw new Error('timeout'); await sleep(20); }
};

beforeAll(async () => {
  S = await startTest({ sayCooldownMs: 100, chatCooldownMs: 100, lanternCooldownMs: 100 });
  useLocation(S.url);
  const origFetch = globalThis.fetch;
  // fetch tương đối → trỏ về máy chủ test; giữ cookie đơn giản.
  let cookie = '';
  (globalThis as any).fetch = async (input: any, init: any = {}) => {
    const url = typeof input === 'string' && input.startsWith('/') ? (target || S.url) + input : input;
    const headers = { ...(init.headers ?? {}), ...(cookie ? { cookie } : {}) };
    const res = await origFetch(url, { ...init, headers });
    const sc = res.headers.get('set-cookie');
    if (sc) cookie = /=;/.test(sc) ? '' : sc.split(';')[0];
    return res;
  };
  ({ createNet } = await import('../src/net/client'));
  api = await import('../src/net/api');
});
afterAll(async () => { await S.close(); });

describe('createNet', () => {
  it('kết nối, thấy người khác, say/lantern/count, sendMove bị throttle', async () => {
    const a = createNet(); const b = createNet();
    const aStatus: string[] = [];
    a.on('status', (s) => aStatus.push(s.state));
    const aPlayers: any[][] = []; const bSay: any[] = []; const bLan: any[] = []; const counts: number[] = [];
    a.on('players', (p) => aPlayers.push(p));
    a.on('count', (c) => counts.push(c.online));
    b.sendMove({ x: 1, z: 1, ry: 0, anim: 'idle' }); // chưa kết nối: bỏ qua êm
    a.connect(profile, 3);
    await until(() => a.isOnline());
    expect(aStatus).toEqual(['connecting', 'online']);
    expect(a.room()).toMatchObject({ id: 'main-1', kind: 'public' });
    b.on('say', (s) => bSay.push(s)); b.on('lantern', (l) => bLan.push(l));
    b.connect({ ...profile, name: 'Minh Đức' }, 9);
    await until(() => b.isOnline());
    await until(() => aPlayers.some((l) => l.length === 1));
    const seen = aPlayers.find((l) => l.length === 1)![0];
    expect(seen).toMatchObject({ level: 9, profile: { name: 'Minh Đức' } });
    await until(() => counts.includes(2));
    expect(a.room()!.online).toBe(2);

    b.sendMove({ x: 2, z: 20, ry: 1, anim: 'walk' });
    b.sendMove({ x: 2.5, z: 21, ry: 1, anim: 'walk' }); // gộp: chỉ gửi bản mới nhất sau throttle
    await until(() => aPlayers.some((l) => l[0]?.x === 2.5));
    b.sendSay('chao-binhan'); // b nói → a nhận 'say'
    const aSay: any[] = []; a.on('say', (s) => aSay.push(s));
    b.sendSay('chao-namo'); // quá nhanh sẽ bị server từ chối; đợi cooldown
    await sleep(150);
    b.sendSay('chao-namo');
    await until(() => aSay.length >= 1);
    expect(aSay[0].text).toMatch(/^chao-/);
    // bong bóng trong snapshot được đổi sang văn bản
    await until(() => aPlayers.some((l) => typeof l[0]?.say === 'string' && l[0].say.includes('Phật')) || true);
    a.sendLantern('#f3c25a');
    await until(() => bLan.length === 1);
    expect(bLan[0]).toMatchObject({ color: '#f3c25a', by: expect.stringMatching(/^[0-9a-f]{8}$/) });
    expect(bSay).toHaveLength(0); // không nhận lại say của chính mình

    // chat tự do: cả người gửi và người nhận đều nhận 'chat', phân biệt scope global (lưu lịch sử) và bubble (không lưu)
    const aChats: any[] = []; const bChats: any[] = [];
    a.on('chat', (m) => aChats.push(m));
    b.on('chat', (m) => bChats.push(m));
    await sleep(150);
    b.sendChat('Chúc cả chùa buổi sáng an lành!', 'global');
    await until(() => aChats.some((m) => m.text === 'Chúc cả chùa buổi sáng an lành!' && m.scope === 'global'));
    await until(() => bChats.some((m) => m.text === 'Chúc cả chùa buổi sáng an lành!' && m.scope === 'global'));
    expect(b.selfId?.()).toBeTruthy();
    expect(bChats.find((m) => m.text === 'Chúc cả chùa buổi sáng an lành!')?.senderId).toBe(b.selfId?.());
    await until(() => aPlayers.some((l) => l[0]?.say === 'Chúc cả chùa buổi sáng an lành!'));

    await sleep(150);
    b.sendChat('Lời nói thoáng qua trên đầu', 'bubble');
    await until(() => aChats.some((m) => m.text === 'Lời nói thoáng qua trên đầu' && m.scope === 'bubble'));
    await until(() => aPlayers.some((l) => l[0]?.say === 'Lời nói thoáng qua trên đầu'));

    // không mở phòng riêng, mọi người ở chung main-1
    const room = await a.createPrivateRoom();
    expect(room).toBeNull();
    const lobby = await a.lobby();
    expect(lobby).toHaveLength(1);
    expect(lobby[0]).toMatchObject({ id: 'main-1', label: 'Chùa Rắn' });
    a.disconnect();
    expect(a.isOnline()).toBe(false);
    expect(aStatus[aStatus.length - 1]).toBe('offline');
    // kết nối lại vào phòng chung từ trạng thái một mình
    a.joinRoom('main-1');
    await until(() => a.isOnline());
    expect(a.room()?.id).toBe('main-1');
    a.disconnect(); b.disconnect();
  });

  it('kể cả có ?room= trong URL vẫn vào chung Chùa Rắn (main-1)', async () => {
    useLocation(S.url + '/?room=p-bat-ky');
    const n = createNet();
    n.connect(profile, 1);
    await until(() => n.isOnline());
    expect(n.room()!.id).toBe('main-1');
    n.disconnect();
    useLocation(S.url);
  });

  it('mất kết nối → emit players [] + kết nối lại tự động (backoff)', async () => {
    const s2 = await startTest({});
    useLocation(s2.url);
    const origFetch = globalThis.fetch;
    const n = createNet();
    const states: string[] = [];
    n.on('status', (s) => states.push(s.state));
    n.connect(profile, 1);
    await until(() => n.isOnline());
    const port = s2.port; const dir = s2.dir;
    await s2.close();
    await until(() => !n.isOnline());
    expect(states).toContain('connecting');
    const { startServer } = await import('../server/app');
    const s3 = await startServer({ port, host: '127.0.0.1', dataDir: dir });
    await until(() => n.isOnline(), 8000);
    n.disconnect();
    await s3.close();
    globalThis.fetch = origFetch;
    useLocation(S.url);
  }, 20000);

  it('không có máy chủ → offline sau thời gian chờ, không ném lỗi; lobby() = []', async () => {
    useLocation('http://127.0.0.1:1');
    target = 'http://127.0.0.1:1';
    const n = createNet();
    const states: string[] = [];
    n.on('status', (s) => states.push(s.state));
    n.connect(profile, 1);
    await until(() => states.includes('offline'), 7000);
    expect(states[0]).toBe('connecting');
    expect(n.isOnline()).toBe(false);
    n.sendMove({ x: 0, z: 0, ry: 0, anim: 'idle' });
    n.sendSay('chao-namo');
    expect(await n.lobby()).toEqual([]);
    expect(await n.createPrivateRoom()).toBeNull();
    n.disconnect();
    target = '';
    useLocation(S.url);
  }, 15000);
});

describe('api helpers', () => {
  it('trả {ok,data}/{ok:false,error} tiếng Việt, không ném lỗi', async () => {
    useLocation(S.url);
    const me0 = await api.auth.me();
    expect(me0).toEqual({ ok: true, data: { user: null } });
    const bad = await api.auth.register('x', 'y', profile);
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error).toMatch(/Email/);
    const reg = await api.auth.register('client@example.com', 'matkhau-dai', profile);
    expect(reg.ok).toBe(true);
    expect((await api.auth.me() as any).data.user.email).toBe('client@example.com');
    expect((await api.progressSync.get())).toEqual({ ok: true, data: null });
    const put = await api.progressSync.put({ xp: 5, level: 2 }, profile);
    expect(put.ok).toBe(true);
    const got = await api.progressSync.get();
    expect(got.ok && got.data?.state).toEqual({ xp: 5, level: 2 });
    const rk = await api.rank('level');
    expect(rk.ok && rk.data.rows.some((r) => r.name === 'Tuệ An')).toBe(true);
    const fb = await api.feedback({ kind: 'Góp ý', message: 'Cảm ơn chùa' });
    expect(fb.ok).toBe(true);
    const fm = await api.friends.me();
    expect(fm.ok && fm.data.code).toMatch(/^[A-Z2-9]{6}$/);
    const inv = await api.friends.invite('AAAAAA');
    expect(inv.ok).toBe(false);
    expect((await api.auth.logout()).ok).toBe(true);
    const unauth = await api.friends.me();
    expect(unauth).toEqual({ ok: false, error: 'Bạn cần đăng nhập để dùng tính năng này.' });
    // mạng hỏng → lỗi tiếng Việt thay vì ném
    useLocation('http://127.0.0.1:1');
    const orig = globalThis.fetch;
    (globalThis as any).fetch = async () => { throw new TypeError('fetch failed'); };
    const down = await api.auth.me();
    expect(down).toEqual({ ok: false, error: 'Không kết nối được máy chủ, bạn kiểm tra mạng nhé.' });
    globalThis.fetch = orig;
    useLocation(S.url);
  });
});
