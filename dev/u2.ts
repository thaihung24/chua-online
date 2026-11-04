/**
 * Harness U2: chạy từng panel thực hành với AppContext giả (có log) và mô phỏng khung panel-host.
 * Dùng: /dev/u2.html?p=beads  (p = id panel; level=N; sound=0; day=YYYY-MM-DD không dùng)
 */
import '@/styles/base.css';
import { createEmitter } from '@/core/bus';
import type { AppContext, AppEvents, PanelDef, PanelId, ProgressView, Profile } from '@/core/contracts';
import { TIERS } from '@/core/contracts';

const q = new URLSearchParams(location.search);
const pid = (q.get('p') ?? 'beads') as PanelId;
const level = Number(q.get('level') ?? 4);
const soundOn = q.get('sound') !== '0';

const log: string[] = [];
const L = (s: string): void => { log.push(s); console.log('[mock]', s); (window as unknown as { __log: string[] }).__log = log; };

const profile: Profile = { name: 'Pháp Hải', gender: 'male', outfit: 'trang-lam', colorIndex: 1 };
const bus = createEmitter<AppEvents>();

const tasks: ProgressView['tasks'] = [
  { id: 't1', label: 'Thắp một nén hương', kind: 'incense', target: 1, done: true, progress: 1, action: 'incense', xp: 10 },
  { id: 't2', label: 'Niệm Phật một chuỗi 108 hạt', kind: 'beadsRound', target: 1, done: false, progress: 0, action: 'beads', xp: 15 },
  { id: 't3', label: 'Ngồi thiền 5 phút', kind: 'meditateSeconds', target: 300, done: false, progress: 90, action: 'meditate', xp: 20 },
];
const view = (): ProgressView => ({
  level, tier: TIERS[1]!, xp: 120, xpIntoLevel: 20, xpForNext: 80, frac: 0.25, streak: Number(q.get('streak') ?? 5), best: 9, litToday: q.get('lit') !== '0', restDays: 1,
  tasks, tasksDone: 1, practiceToday: 3, practiceCap: 10, stamps: [],
});

const toastEl = document.createElement('div');
toastEl.className = 'toast';
document.body.append(toastEl);
let toastT = 0;

const ctx: AppContext = {
  profile,
  setProfile(p) { Object.assign(profile, p); L(`setProfile ${JSON.stringify(p)}`); },
  world: {
    perform: async (a: string, o?: unknown) => { L(`world.perform ${a} ${JSON.stringify(o ?? {})}`); await new Promise((r) => setTimeout(r, 300)); },
    addLantern: (l: unknown) => L(`world.addLantern ${JSON.stringify(l)}`),
    setWishRibbons: (n: number) => L(`world.setWishRibbons ${n}`),
    goTo: (s: string) => L(`world.goTo ${s}`),
    sit: (k: string) => { L(`world.sit ${k}`); return true; },
    isSeated: () => false,
  } as unknown as AppContext['world'],
  audio: {
    unlock: () => undefined,
    play: (s: string, o?: unknown) => L(`audio.play ${s}${o ? ' ' + JSON.stringify(o) : ''}`),
    startMoLoop: () => () => undefined,
    setAmbient: () => undefined,
    setNight: () => undefined,
    setChantRadio: (on: boolean, v?: string) => L(`audio.setChantRadio ${on} ${v ?? ''}`),
    settings: () => ({ master: soundOn, ambient: soundOn, sfx: soundOn, chant: soundOn, ambientVolume: 0.5 }),
    configure: (p: unknown) => L(`audio.configure ${JSON.stringify(p)}`),
    onChange: () => () => undefined,
  } as unknown as AppContext['audio'],
  net: { sendLantern: (c: string) => L(`net.sendLantern ${c}`) } as unknown as AppContext['net'],
  progress: {
    record: (k: string, a?: number) => { L(`progress.record ${k} ${a ?? ''}`); return { xp: 5 }; },
    view,
    unlockLevel: () => 1,
    isUnlocked: () => true,
    onChange: () => () => undefined,
    exportState: () => ({}),
    importState: () => undefined,
  } as unknown as AppContext['progress'],
  bus,
  toast(text, opts) {
    L(`toast ${text}`);
    toastEl.textContent = text;
    toastEl.className = `toast is-on${opts?.kind ? ' toast--' + opts.kind : ''}`;
    clearTimeout(toastT);
    toastT = window.setTimeout(() => { toastEl.className = 'toast'; }, 2600);
  },
  openPanel: async (id, params) => { L(`openPanel ${id} ${JSON.stringify(params ?? {})}`); },
  closePanel: () => { L('closePanel'); unmount(); },
  isLoggedIn: () => false,
  offerings: () => ({ incenseUntil: 0, flowersUntil: 0, candleUntil: 0 }),
};

const loaders: Record<string, () => Promise<{ panel: PanelDef }>> = {
  beads: () => import('@/ui/panels/beads'),
  chant: () => import('@/ui/panels/chant'),
  meditate: () => import('@/ui/panels/meditate'),
  dharma: () => import('@/ui/panels/dharma'),
  today: () => import('@/ui/panels/today'),
  wardrobe: () => import('@/ui/panels/wardrobe'),
  lantern: () => import('@/ui/panels/lantern'),
  que: () => import('@/ui/panels/que'),
  wish: () => import('@/ui/panels/wish'),
  listen: () => import('@/ui/panels/listen'),
  walkMeditation: () => import('@/ui/panels/walk-meditation'),
};

// nền giả lập khung cảnh chùa phía sau panel
document.body.style.background = 'linear-gradient(180deg,#6d8fb0 0%,#c9b48a 55%,#7a6a52 100%)';
const host = document.getElementById('app')!;
let cleanup: void | (() => void);
let hostEl: HTMLElement | null = null;

function unmount(): void {
  try { if (typeof cleanup === 'function') cleanup(); } catch (e) { console.error(e); }
  cleanup = undefined;
  hostEl?.remove();
  hostEl = null;
  document.body.dataset.closed = '1';
}

async function mount(): Promise<void> {
  const loader = loaders[pid];
  if (!loader) { host.textContent = `Không có panel ${pid}`; return; }
  const { panel } = await loader();
  let params: Record<string, unknown> | undefined;
  const pj = q.get('params');
  if (pj) params = JSON.parse(pj) as Record<string, unknown>;
  if (panel.kind === 'view') {
    const el = document.createElement('div');
    el.className = 'panel-host';
    el.innerHTML = '<div class="panel-host__scrim"></div><div class="panel-host__body"><button class="panel__back" type="button">← Quay lại chùa</button><div class="panel-root"></div></div>';
    host.append(el);
    hostEl = el;
    el.querySelector('.panel__back')!.addEventListener('click', () => ctx.closePanel());
    cleanup = await panel.mount(el.querySelector<HTMLElement>('.panel-root')!, ctx, params);
  } else {
    const el = document.createElement('div');
    el.className = 'dialog-scrim';
    el.innerHTML = '<div class="dialog-card"></div>';
    host.append(el);
    hostEl = el;
    el.addEventListener('pointerdown', (e) => { if (e.target === el) ctx.closePanel(); });
    cleanup = await panel.mount(el.querySelector<HTMLElement>('.dialog-card')!, ctx, params);
  }
  document.body.dataset.ready = '1';
}
void mount();
