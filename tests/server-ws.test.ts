/** Test WebSocket: hello/welcome, thấy nhau, say, lantern, chặn teleport, rate-limit, phòng đầy, phòng riêng. */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client, Http, PROFILE, profileNamed, sleep, startTest } from './server-helpers';

let S: Awaited<ReturnType<typeof startTest>>;
beforeAll(async () => { S = await startTest({ roomCapacity: 3, sayCooldownMs: 300, lanternCooldownMs: 400, wsMaxPerIp: 50, privateRoomTtlMs: 200 }); });
afterAll(async () => { await S.close(); });

const players = (m: any) => m.t === 'players';

describe('phòng & hiện diện', () => {
  it('hello → welcome; 2 client thấy nhau (không thấy chính mình)', async () => {
    const a = new Client(S.url);
    const wa = await a.hello(profileNamed('Người A'), 5);
    expect(wa.id).toMatch(/^[0-9a-f]{8}$/);
    expect(wa.room).toMatchObject({ id: 'main-1', kind: 'public', capacity: 3 });
    const b = new Client(S.url);
    const wb = await b.hello(profileNamed('Người B'), 7);
    expect(wb.room.id).toBe('main-1');
    const seenByA = await a.waitFor((m) => players(m) && m.list.length === 1);
    expect(seenByA.list[0]).toMatchObject({ id: wb.id, level: 7, anim: 'idle', profile: { name: 'Người B' } });
    const seenByB = await b.waitFor((m) => players(m) && m.list.length === 1);
    expect(seenByB.list[0].id).toBe(wa.id);
    expect(seenByB.list.some((p: any) => p.id === wb.id)).toBe(false);
    // số người
    const cnt = await a.waitFor((m) => m.t === 'count' && m.online === 2);
    expect(cnt.online).toBe(2);
    a.close(); b.close();
    await sleep(100);
  });

  it('move được chuyển tiếp ≤ 5Hz, làm tròn 2 chữ số, chỉ khi thay đổi', async () => {
    const a = new Client(S.url); const b = new Client(S.url);
    const wa = await a.hello(); await b.hello();
    await a.waitFor((m) => players(m) && m.list.length === 1);
    a.send({ t: 'move', x: 1.23456, z: 29.98765, ry: 0.5, anim: 'walk' });
    const m = await b.waitFor((m) => players(m) && m.list[0]?.x === 1.23);
    expect(m.list[0]).toMatchObject({ id: wa.id, x: 1.23, z: 29.99, ry: 0.5, anim: 'walk' });
    // không đổi gì → không có snapshot mới
    await sleep(350);
    b.msgs.length = 0;
    await sleep(500);
    expect(b.msgs.filter(players)).toHaveLength(0);
    a.close(); b.close();
    await sleep(100);
  });

  it('chặn dịch chuyển tức thời và giá trị sai', async () => {
    const a = new Client(S.url); const b = new Client(S.url);
    await a.hello(); await b.hello();
    a.send({ t: 'move', x: 0, z: 30, ry: 0, anim: 'idle' });
    await sleep(50);
    // nhảy 70m sang bên ngay lập tức → kéo về (chỉ đi được ≈ vài mét)
    a.send({ t: 'move', x: -40, z: -30, ry: 0, anim: 'walk' });
    await b.waitFor((m) => players(m) && m.list[0]?.anim === 'walk');
    await sleep(300);
    const last = [...b.msgs].reverse().find(players);
    const p = last.list[0];
    expect(Math.hypot(p.x - 0, p.z - 30)).toBeLessThan(3);
    // ngoài biên: kẹp lại trong khuôn viên
    a.send({ t: 'move', x: 9999, z: 9999, ry: 0, anim: 'walk' });
    await sleep(400);
    const p2 = [...b.msgs].reverse().find(players).list[0];
    expect(p2.x).toBeLessThanOrEqual(42);
    expect(p2.z).toBeLessThanOrEqual(40);
    // anim không hợp lệ/NaN bị bỏ qua
    a.send({ t: 'move', x: 1, z: 1, ry: 0, anim: 'fly' });
    a.send('{"t":"move","x":null,"z":3,"ry":0,"anim":"idle"}');
    await sleep(300);
    expect(a.closed).toBeNull();
    a.close(); b.close();
    await sleep(100);
  });

  it('tất cả mọi người đều vào chung 1 phòng duy nhất Chùa Bình Thạnh (không tách phòng, không tạo phòng riêng)', async () => {
    const cs: Client[] = [];
    for (let i = 0; i < 5; i++) { const c = new Client(S.url); cs.push(c); await c.hello(profileNamed(`Khách ${i + 1}`), 1, i === 4 ? 'p-rieng' : undefined); }
    const rooms = cs.map((c) => c.msgs.find((m) => m.t === 'welcome').room.id);
    expect(rooms).toEqual(['main-1', 'main-1', 'main-1', 'main-1', 'main-1']);
    const lobby = (await new Http(S.url).get('/api/lobby')).json;
    expect(lobby).toHaveLength(1);
    expect(lobby[0]).toMatchObject({ id: 'main-1', online: 5, label: 'Chùa Bình Thạnh', kind: 'public' });
    // gửi join sang phòng bất kỳ vẫn ở chung main-1
    const d = cs[4];
    d.msgs.length = 0;
    d.send({ t: 'join', room: 'p-khong-co' });
    expect((await d.waitFor((m) => m.t === 'welcome')).room.id).toBe('main-1');
    expect((await new Http(S.url).post('/api/rooms')).status).toBe(403);
    cs.forEach((c) => c.close());
    await sleep(200);
    expect((await new Http(S.url).get('/api/lobby')).json).toHaveLength(1);
  });
});

describe('say / lantern', () => {
  it('say: chỉ câu preset, gửi cho người khác (không gửi lại cho mình), giới hạn tần suất', async () => {
    const a = new Client(S.url); const b = new Client(S.url);
    const wa = await a.hello(); await b.hello();
    a.send({ t: 'say', phrase: 'tu-do-go-gi-cung-duoc' });
    await sleep(100);
    expect(b.msgs.some((m) => m.t === 'say')).toBe(false);
    a.send({ t: 'say', phrase: 'chao-binhan' });
    const s = await b.waitFor((m) => m.t === 'say');
    expect(s).toEqual({ t: 'say', id: wa.id, text: 'chao-binhan' });
    // xuất hiện trong snapshot làm bong bóng
    const snap = await b.waitFor((m) => players(m) && m.list[0]?.say === 'chao-binhan');
    expect(snap.list[0].id).toBe(wa.id);
    expect(a.msgs.some((m) => m.t === 'say')).toBe(false);
    // quá nhanh → báo
    a.msgs.length = 0;
    a.send({ t: 'say', phrase: 'chao-namo' });
    await a.waitFor((m) => m.t === 'notice');
    expect(b.msgs.filter((m) => m.t === 'say')).toHaveLength(1);
    await sleep(350);
    a.send({ t: 'say', phrase: 'chao-namo' });
    await b.waitFor((m) => m.t === 'say' && m.text === 'chao-namo');
    a.close(); b.close();
    await sleep(100);
  });

  it('lantern: màu #rrggbb, id duy nhất, không gửi lại cho người thả, cooldown', async () => {
    const a = new Client(S.url); const b = new Client(S.url);
    const wa = await a.hello(); await b.hello();
    a.send({ t: 'lantern', color: 'red' });
    a.send({ t: 'lantern', color: '#F3C25A' });
    const l = await b.waitFor((m) => m.t === 'lantern');
    expect(l).toMatchObject({ t: 'lantern', color: '#f3c25a', by: wa.id });
    expect(l.id).toMatch(/^l-[0-9a-f]{10}$/);
    expect(a.msgs.some((m) => m.t === 'lantern')).toBe(false);
    a.send({ t: 'lantern', color: '#112233' }); // quá nhanh
    await a.waitFor((m) => m.t === 'notice');
    expect(b.msgs.filter((m) => m.t === 'lantern')).toHaveLength(1);
    await sleep(450);
    a.send({ t: 'lantern', color: '#112233' });
    const l2 = await b.waitFor((m) => m.t === 'lantern' && m.color === '#112233');
    expect(l2.id).not.toBe(l.id);
    a.close(); b.close();
    await sleep(100);
  });
});

describe('hồ sơ / giao thức / chống spam', () => {
  it('profile: cập nhật hiển thị; tên xấu bị từ chối; tăng cấp quá nhanh bị bỏ qua', async () => {
    const a = new Client(S.url); const b = new Client(S.url);
    await a.hello(profileNamed('Cũ Tên'), 4); await b.hello();
    a.send({ t: 'profile', profile: profileNamed('Tên Mới'), level: 6 });
    const p = await b.waitFor((m) => players(m) && m.list[0]?.profile.name === 'Tên Mới');
    expect(p.list[0].level).toBe(6);
    a.send({ t: 'profile', profile: profileNamed('Tên Mới'), level: 500 });
    await sleep(350);
    expect([...b.msgs].reverse().find(players).list[0].level).toBe(6);
    a.send({ t: 'profile', profile: profileNamed('<script>1</script>'), level: 6 });
    await a.waitFor((m) => m.t === 'notice');
    await sleep(300);
    expect([...b.msgs].reverse().find(players).list[0].profile.name).toBe('Tên Mới');
    a.close(); b.close();
    await sleep(100);
  });

  it('ping/pong; chưa hello thì bị bỏ qua; JSON hỏng không làm sập', async () => {
    const a = new Client(S.url);
    await a.open();
    a.send({ t: 'ping' });
    await a.waitFor((m) => m.t === 'pong');
    a.send({ t: 'move', x: 1, z: 1, ry: 0, anim: 'idle' });
    a.send('khong-phai-json');
    await sleep(100);
    expect(a.closed).toBeNull();
    a.send({ t: 'hello', profile: PROFILE, level: 2 });
    await a.waitFor((m) => m.t === 'welcome');
    a.close();
  });

  it('frame > 2KB bị ngắt (1009)', async () => {
    const a = new Client(S.url);
    await a.hello();
    a.send(JSON.stringify({ t: 'say', phrase: 'x'.repeat(3000) }));
    expect(await a.waitClose()).toBe(1009);
  });

  it('spam bị ngắt kết nối (1008)', async () => {
    const a = new Client(S.url); const b = new Client(S.url);
    await a.hello(); await b.hello();
    for (let i = 0; i < 400; i++) a.send({ t: 'ping' });
    expect(await a.waitClose()).toBe(1008);
    await sleep(150);
    // người còn lại thấy count giảm
    expect(b.msgs.some((m) => m.t === 'count' && m.online === 1)).toBe(true);
    b.close();
    await sleep(100);
  });

  it('teleport lặp lại nhiều lần bị ngắt', async () => {
    const a = new Client(S.url);
    await a.hello();
    a.send({ t: 'move', x: -40, z: 38, ry: 0, anim: 'idle' });
    for (let i = 0; i < 60 && !a.closed; i++) {
      a.send({ t: 'move', x: i % 2 ? -40 : 40, z: i % 2 ? 38 : -34, ry: 0, anim: 'walk' });
      await sleep(90);
    }
    expect(await a.waitClose()).toBe(1008);
  });

  it('giới hạn số kết nối mỗi IP và đóng êm khi tắt máy', async () => {
    const s = await startTest({ wsMaxPerIp: 2 });
    const cs = [new Client(s.url), new Client(s.url)];
    for (const c of cs) await c.hello();
    const third = new Client(s.url);
    await expect(third.open()).rejects.toThrow();
    await s.close();
    for (const c of cs) expect(await c.waitClose()).toBe(1001);
  });
});
