/**
 * Harness U1: chạy khung UI (boot, cổng chào, chọn nhân vật, HUD, menu, panel hệ thống) với AppContext giả.
 * Tham số URL: ?mode=boot|gate|choose|change|hud (mặc định hud)  &open=<panelId>  &menu=1|walk  &snd=1  &level=N  &seated=1  &notice=1
 *             &nearby=altar|cushion|bodhi|burner  &logged=1  &listen=1  &fresh=1  &fail=1  &mockapi=0 (tắt mock /api/*)  &seedwishes=1
 */
import '@/styles/index.css';
import { createEmitter } from '@/core/bus';
import type { ActionId, AppContext, AppEvents, AudioSettings, NetEvents, PanelDef, PanelId, Profile, RoomInfo, WorldEvents } from '@/core/contracts';
import { createProgress, xpForLevel } from '@/core/progress';
import { save, vnDayKey } from '@/core/store';
import { createShell } from '@/ui/shell';

const q = new URLSearchParams(location.search);
const W = window as unknown as Record<string, unknown>;
if (q.get('fresh')) localStorage.clear();
if (q.get('seedwishes')) {
  save('wish:list', [{ id: 'w1', text: 'Cầu gia đình bình an', color: 'gold', at: Date.now() }, { id: 'w2', text: 'Tâm thường thanh tịnh', color: 'lotus', at: Date.now() }]);
  save('lantern:wishes', [{ id: 'l1', text: 'Nguyện muôn loài an vui', color: 'hong-sen', at: Date.now() }]);
}

const log: string[] = [];
const L = (s: string): void => { log.push(s); W.__log = log; console.log('[mock]', s); };

const profile: Profile = { name: 'Nhật Thông', gender: 'male', outfit: 'trang-lam', colorIndex: 0 };
let logged = q.get('logged') === '1';

// ── Mock `/api/*` để kiểm thử đầy đủ rank / account / friends / feedback không phụ thuộc backend
if (q.get('mockapi') !== '0') {
  const realFetch = window.fetch.bind(window);
  const json = (data: unknown, status = 200): Response =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname + input.search : input.url;
    if (!url.startsWith('/api/')) return realFetch(input, init);
    await new Promise((r) => setTimeout(r, 80));
    if (q.get('fail') === '1') return json({ error: 'Không kết nối được máy chủ, bạn thử lại nhé.' }, 503);
    if (url.startsWith('/api/bxh') || url.startsWith('/api/rank')) {
      const isStreak = url.includes('kind=streak');
      const rows = [
        { rank: 1, name: 'Diệu Liên', level: 42, tier: 7, tierName: 'Sen ngàn cánh', streak: 108 },
        { rank: 2, name: 'Minh Tâm', level: 29, tier: 6, tierName: 'Sen nở', streak: 64 },
        { rank: 3, name: 'Nhật Thông', level: 16, tier: 5, tierName: 'Sen hé', streak: 21 },
        { rank: 4, name: 'Tịnh Hải', level: 12, tier: 4, tierName: 'Nụ sen', streak: 15 },
        { rank: 5, name: 'An Nhiên', level: 9, tier: 3, tierName: 'Lá sen', streak: 11 },
        { rank: 6, name: 'Thiện Đức', level: 6, tier: 3, tierName: 'Lá sen', streak: 7 },
        { rank: 7, name: 'Huệ Đăng', level: 4, tier: 2, tierName: 'Mầm sen', streak: 5 },
      ];
      return json({ rows: isStreak ? rows : rows });
    }
    if (url === '/api/auth/me') {
      return json({ user: logged ? { email: 'nhat.thong@chualienhoa.vn', profile } : null });
    }
    if (url === '/api/auth/login' || url === '/api/auth/register') {
      logged = true;
      return json({ user: { email: 'nhat.thong@chualienhoa.vn', profile } });
    }
    if (url === '/api/auth/logout') {
      logged = false;
      return json({ ok: true });
    }
    if (url === '/api/progress') {
      return json({ state: null });
    }
    if (url === '/api/friends/me') {
      if (!logged) return json({ error: 'Bạn cần đăng nhập để kết bạn đạo.' }, 401);
      return json({
        code: 'LH7K9A',
        incoming: [{ code: 'TAM88N', name: 'Tâm An', level: 8, online: true }],
        friends: [
          { code: 'DIEU12', name: 'Diệu Liên', level: 42, online: true },
          { code: 'MINH09', name: 'Minh Tâm', level: 29, online: false },
        ],
        outgoing: [{ code: 'DUC304', name: 'Thiện Đức', level: 6, online: false }],
      });
    }
    if (url === '/api/friends/presence') {
      if (!logged) return json({ friends: [] });
      return json({
        friends: [
          { code: 'DIEU12', name: 'Diệu Liên', online: true, room: { id: 'pub-1', label: 'Chùa chính 1' } },
          { code: 'MINH09', name: 'Minh Tâm', online: false, room: null },
        ],
      });
    }
    if (url === '/api/friends/invite') return json({ status: 'invited' });
    if (url === '/api/friends/accept' || url === '/api/friends/remove' || url === '/api/feedback') return json({ ok: true });
    return realFetch(input, init);
  };
}

const bus = createEmitter<AppEvents>();
const progress = createProgress({ storageKey: 'u1-progress', bus });
const wantLevel = Number(q.get('level') ?? 0);
if (wantLevel > 1) {
  progress.importState({
    v: 1,
    xp: xpForLevel(wantLevel) + 28,
    streak: wantLevel >= 12 ? 21 : 7,
    best: wantLevel >= 12 ? 28 : 12,
    lastLit: vnDayKey(),
    restDays: 1,
    restAcc: 2,
    milestones: wantLevel >= 12 ? [3, 7, 14] : [3, 7],
    life: {
      visitDays: wantLevel >= 12 ? 24 : 9,
      practiceDays: wantLevel >= 12 ? 21 : 7,
      bow: 24,
      pray: 15,
      incense: 12,
      flowers: 6,
      candle: 5,
      bell: 9,
      lantern: 4,
      beads: 540,
      beadsRound: 5,
      chantDone: 4,
      meditateMinutes: 35,
      sweepRound: 3,
      wish: 2,
    },
  });
  progress.record('bow', 1);
  progress.record('incense', 1);
}

// ── thế giới giả
const wem = createEmitter<WorldEvents>();
let seated = q.get('seated') === '1';
const world = {
  on: wem.on.bind(wem), off: wem.off.bind(wem), emit: wem.emit.bind(wem),
  async perform(a: ActionId, o?: unknown) { L(`world.perform ${a} ${JSON.stringify(o ?? {})}`); await new Promise((r) => setTimeout(r, 900)); wem.emit('actionDone', { action: a }); },
  goTo: (s: string) => L(`world.goTo ${s}`),
  stop: () => L('world.stop'),
  sit: (k: string) => { L(`world.sit ${k}`); seated = true; wem.emit('seated', { seated: true, slot: 0 }); return true; },
  standUp: () => { L('world.standUp'); seated = false; wem.emit('seated', { seated: false, slot: null }); },
  isSeated: () => seated,
  setInputEnabled: (b: boolean) => L(`world.setInputEnabled ${b}`),
  setQuality: (v: string) => L(`world.setQuality ${v}`),
  setTimeOfDay: (v: string) => L(`world.setTimeOfDay ${v}`),
  say: (t: string) => L(`world.say ${t}`),
  addLantern: () => undefined, setWishRibbons: (n: number) => L(`world.setWishRibbons ${n}`), setOfferings: () => undefined,
  screenshot: async () => null,
  getPlayer: () => ({ x: 0, z: 0, ry: 0 }),
} as unknown as AppContext['world'];

// ── âm thanh giả (có trạng thái)
let as: AudioSettings = { master: true, ambient: true, sfx: true, chant: true, ambientVolume: 0.6 };
const aud = new Set<(s: AudioSettings) => void>();
const audio = {
  unlock: () => undefined, play: (s: string) => L(`audio.play ${s}`), startMoLoop: () => () => undefined, setAmbient: () => undefined, setNight: () => undefined,
  setChantRadio: (on: boolean, v?: string) => L(`audio.setChantRadio ${on} ${v ?? ''}`),
  settings: () => ({ ...as }),
  configure: (p: Partial<AudioSettings>) => { as = { ...as, ...p }; L(`audio.configure ${JSON.stringify(p)}`); aud.forEach((f) => f({ ...as })); },
  onChange: (f: (s: AudioSettings) => void) => { aud.add(f); return () => aud.delete(f); },
} as unknown as AppContext['audio'];

// ── mạng giả
const nem = createEmitter<NetEvents>();
const rooms: RoomInfo[] = [
  { id: 'pub-1', label: 'Chùa chính 1', online: 37, capacity: 100, kind: 'public' },
  { id: 'pub-2', label: 'Chùa chính 2', online: 100, capacity: 100, kind: 'public' },
  { id: 'pub-3', label: 'Chùa chính 3', online: 4, capacity: 100, kind: 'public' },
];
const net = {
  on: nem.on.bind(nem), off: nem.off.bind(nem), emit: nem.emit.bind(nem),
  connect: () => undefined, disconnect: () => undefined,
  lobby: async () => { await new Promise((r) => setTimeout(r, 150)); if (q.get('fail')) throw new Error('x'); return rooms; },
  joinRoom: (id: string) => L(`net.joinRoom ${id}`),
  createPrivateRoom: async () => ({ id: 'p-k3x9qa', label: 'Phòng riêng', online: 1, capacity: 100, kind: 'private' as const }),
  sendMove: () => undefined, sendSay: (id: string) => L(`net.sendSay ${id}`), sendLantern: () => undefined, sendProfile: () => undefined,
  room: () => null, isOnline: () => false,
} as unknown as AppContext['net'];

const ctx: AppContext = {
  get profile() { return profile; },
  setProfile(p) { Object.assign(profile, p); L(`setProfile ${JSON.stringify(p)}`); bus.emit('profile', p); },
  world, audio, net, progress, bus,
  toast(text, opts) { L(`toast ${text}`); shell.toast(text, opts); },
  openPanel: (id, params) => shell.host.open(id, params),
  closePanel: () => shell.host.close(),
  isLoggedIn: () => logged,
  offerings: () => ({ incenseUntil: Date.now() + 12 * 60_000, flowersUntil: 0, candleUntil: 0 }),
};
W.__ctx = ctx;
W.__setLogged = (v: boolean) => { logged = v; bus.emit('auth', { loggedIn: v, email: v ? 'nhat.thong@chualienhoa.vn' : undefined }); };

const globs = import.meta.glob('/src/ui/panels/*.ts') as Record<string, () => Promise<{ panel: PanelDef }>>;
const loadPanel = async (id: PanelId): Promise<PanelDef> => {
  const file = id === 'walkMeditation' ? 'walk-meditation' : id;
  const fn = globs[`/src/ui/panels/${file}.ts`];
  if (!fn) throw new Error('chưa có panel ' + id);
  return (await fn()).panel;
};

const shell = createShell(ctx, document.getElementById('app')!, { loadPanel });
W.__shell = shell;

const mode = q.get('mode') ?? 'hud';
const boot = document.getElementById('boot')!;
async function start(): Promise<void> {
  if (mode === 'icons') {
    const { ICON_NAMES, icon } = await import('@/ui/icons');
    const { characterSvg } = await import('@/ui/character-preview');
    const { tierIcon } = await import('@/ui/tier-icon');
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;inset:0;z-index:99;background:#221810;color:#e0b25c;overflow:auto;padding:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px;pointer-events:auto';
    const section = q.get('sec') ?? 'icons';
    if (section === 'icons') d.innerHTML = ICON_NAMES.map((n) => `<div style="text-align:center;font:11px sans-serif;color:#b9a68e">${icon(n, { size: 44 })}<br>${n}</div>`).join('');
    if (section === 'tiers') d.innerHTML = [1, 2, 3, 4, 5, 6, 7].map((n) => `<div style="text-align:center">${tierIcon(n, { size: 84 })}</div>`).join('');
    if (section === 'chars') {
      const outfits = ['trang-xam', 'trang-lam', 'ba-ba', 'ao-dai'] as const;
      d.style.gridTemplateColumns = 'repeat(4,1fr)';
      d.innerHTML = (['male', 'female'] as const).flatMap((g) => outfits.map((o, i) => `<div>${characterSvg({ gender: g, outfit: o, colorIndex: i, accessory: q.get('acc') ?? undefined }, { size: Number(q.get('size') ?? 150), breathe: false })}</div>`)).join('');
    }
    document.body.append(d);
    return;
  }
  if (mode === 'boot') {
    boot.hidden = false;
    shell.setLoading(0.62, 'Đang trồng cây bồ đề…');
    return;
  }
  if (mode === 'gate' || mode === 'choose' || mode === 'change') {
    boot.hidden = false;
    shell.setLoading(0.4, 'Đang dựng chánh điện…');
    const p = shell.showOnboarding(mode === 'change' ? profile : null);
    if (mode === 'choose') (document.querySelector('[data-act="guest"]') as HTMLElement | null)?.click();
    void p.then((r) => L('onboarding → ' + JSON.stringify(r)));
    return;
  }
  const v = progress.view();
  shell.hud.setLevel(v);
  shell.hud.setStreak(v.streak || 3, true);
  shell.hud.setOnline(Number(q.get('online') ?? 1));
  if (q.get('listen')) shell.hud.setListening(true);
  if (q.get('seated') === '1') { shell.hud.setSeated(true); }
  if (q.get('notice')) {
    shell.hud.notice('Chùa đang mở nhạc nền và tiếng mõ. Bấm Tắt cho yên lặng, hay chỉnh ở nút loa.', [{ label: 'Tắt', onClick: () => audio.configure({ master: false }) }, { label: 'Để vậy' }]);
  }
  const nb = q.get('nearby');
  if (nb === 'altar') shell.hud.setNearby({ id: 'altar', label: 'Bàn thờ Phật', actions: ['flowers', 'candle', 'bow'] });
  if (nb === 'cushion') shell.hud.setNearby({ id: 'cushion', label: 'Bồ đoàn', actions: [] });
  if (nb === 'bodhi') shell.hud.setNearby({ id: 'bodhiTree', label: 'Cây bồ đề', actions: ['loc', 'wish'] });
  if (nb === 'burner') shell.hud.setNearby({ id: 'burner', label: 'Lư hương', actions: ['incense'] });
  const open = q.get('open');
  if (open) await shell.host.open(open as PanelId, q.get('params') ? JSON.parse(q.get('params')!) : undefined);
  if (q.get('snd')) (document.getElementById('hud-sound') as HTMLElement).click();
  if (q.get('menu')) {
    (document.querySelector('[data-dock="more"]') as HTMLElement).click();
    if (q.get('menu') === 'walk') [...document.querySelectorAll<HTMLElement>('.more .tile')].find((t) => t.textContent?.includes('Đi dạo'))?.click();
  }
}
void start();
