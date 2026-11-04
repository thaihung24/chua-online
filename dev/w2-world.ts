/**
 * Harness chế độ `mode=world` cho W2: dựng toàn bộ `createWorld()`, kèm thanh điều khiển thử nhanh
 * (hoặc ẩn khi chụp ảnh `?hud=0`), tạo 30–100 người chơi khác và ghi nhật ký sự kiện `window.__w`.
 */
import {
  OUTFITS, type ActionId, type Gender, type Profile, type RemotePlayer, type SeatKind, type SpotId, type World, type WorldEvents,
} from '@/core/contracts';
import { createWorld } from '@/world';
import { ACCESSORY_IDS } from '@/world/avatar';
import { cushionSlot, SPOT_ORDER } from '@/world/layout';
import { nearestFree } from '@/world/nav';

const NAMES_M = ['Tuệ An', 'Nhật Thông', 'Minh Tâm', 'Thiện Đức', 'Tịnh Hải', 'Phúc Lâm', 'Quang Minh', 'An Hòa', 'Chánh Niệm', 'Huệ Đăng'];
const NAMES_F = ['Diệu Hạnh', 'Liên Hoa', 'Thanh Tâm', 'Bảo Ngọc', 'Từ Vân', 'An Nhiên', 'Tịnh Liên', 'Diệu Âm', 'Bích Liên', 'Hiền Thảo'];
const ANIMS: RemotePlayer['anim'][] = ['idle', 'pray', 'walk', 'bow', 'beads'];

export function makeRemotePlayers(count: number): RemotePlayer[] {
  const out: RemotePlayer[] = [];
  for (let i = 0; i < count; i++) {
    const gender: Gender = i % 2 === 0 ? 'male' : 'female';
    const outfit = OUTFITS[i % OUTFITS.length].id;
    const colorIndex = (i * 3) % 5;
    const acc = i % 3 === 0 ? ACCESSORY_IDS[(i / 3 | 0) % ACCESSORY_IDS.length] : undefined;
    const name = gender === 'male' ? NAMES_M[i % NAMES_M.length] : NAMES_F[i % NAMES_F.length];
    const level = 1 + ((i * 7) % 52);
    const profile: Profile = { name, gender, outfit, colorIndex, accessory: acc };

    // Một vài người ngồi thiền/tụng kinh trên bồ đoàn (0..2), số còn lại rải quanh sân trước & chánh điện
    if (i < 3) {
      const s = cushionSlot(i * 2);
      out.push({
        id: `r-${i}`,
        profile,
        level,
        x: s.pos.x,
        z: s.pos.z,
        ry: s.face,
        anim: i === 0 ? 'chant' : i === 1 ? 'meditate' : 'sit',
        say: i === 0 ? 'Nam mô A Di Đà Phật 🙏' : undefined,
      });
      continue;
    }

    // Phân bổ tự nhiên khắp khuôn viên chùa: sân trước, trước chánh điện, hai hồ, cây bồ đề, vườn Quan Âm & giếng ngọc
    const zones: { cx: number; cz: number; rx: number; rz: number; lookX: number; lookZ: number }[] = [
      { cx: 0, cz: 18, rx: 4.0, rz: 7.5, lookX: 0, lookZ: -18 },
      { cx: 0, cz: -4, rx: 4.2, rz: 5.5, lookX: 0, lookZ: -18 },
      { cx: -10.2, cz: 13.5, rx: 2.4, rz: 4.5, lookX: -16, lookZ: 14 },
      { cx: 11.2, cz: 13.5, rx: 2.4, rz: 4.5, lookX: 16, lookZ: 14 },
      { cx: -18.5, cz: -4.5, rx: 3.5, rz: 4.5, lookX: -22, lookZ: -5 },
      { cx: 26.5, cz: -12.5, rx: 3.5, rz: 3.5, lookX: 28.5, lookZ: -16.8 },
      { cx: -24.5, cz: -20.5, rx: 3.5, rz: 3.5, lookX: -30, lookZ: -26 },
      { cx: 0, cz: -14.2, rx: 6.5, rz: 1.6, lookX: 0, lookZ: -24 },
    ];
    const z = zones[(i - 3) % zones.length];
    const k = Math.floor((i - 3) / zones.length);
    const ang = (i * 2.39996) + k * 0.7;
    const rad = 0.35 + ((k * 0.37 + (i % 5) * 0.16) % 0.95);
    const rawX = z.cx + Math.cos(ang) * z.rx * rad;
    const rawZ = z.cz + Math.sin(ang) * z.rz * rad;
    const p = nearestFree(rawX, rawZ, 8);
    out.push({
      id: `r-${i}`,
      profile,
      level,
      x: p.x,
      z: p.z,
      ry: Math.atan2(-(z.lookX - p.x), -(z.lookZ - p.z)),
      anim: ANIMS[i % ANIMS.length],
      say: i === 3 ? 'Chúc đạo hữu ngày mới bình an' : i === 11 ? 'A Di Đà Phật' : undefined,
    });
  }
  return out;
}

export async function run(app: HTMLElement, q: URLSearchParams): Promise<void> {
  const world: World = createWorld();
  const events: { type: string; payload: unknown; at: number }[] = [];
  const log = <K extends keyof WorldEvents>(t: K): void => {
    world.on(t, (payload) => events.push({ type: String(t), payload, at: Math.round(performance.now()) }));
  };
  log('loading');
  log('ready');
  log('spotReached');
  log('nearby');
  log('actionDone');
  log('moved');
  log('seated');
  log('tapRemote');
  log('night');

  const tod = (q.get('tod') as 'auto' | 'day' | 'night' | null) ?? 'day';
  const quality = (q.get('quality') as 'low' | 'medium' | 'high' | null) ?? 'high';
  const level = Number(q.get('level') ?? 12);
  const acc = q.get('acc') ?? 'hat-tram';
  const profile: Profile = {
    name: q.get('name') ?? 'Nhật Thông',
    gender: (q.get('gender') as Gender | null) ?? 'male',
    outfit: (q.get('outfit') as Profile['outfit'] | null) ?? 'trang-lam',
    colorIndex: Number(q.get('color') ?? 0),
    accessory: acc === 'none' ? undefined : acc,
  };

  world.setQuality(quality);
  world.setTimeOfDay(tod);

  const stage = document.createElement('div');
  stage.style.cssText = 'position:absolute;inset:0;';
  app.appendChild(stage);

  await world.mount(stage, profile, { level });

  const remoteCount = Number(q.get('remotes') ?? 0);
  let curRemotes: RemotePlayer[] = [];
  if (remoteCount > 0) {
    curRemotes = makeRemotePlayers(remoteCount);
    world.setRemotes(curRemotes);
  }

  const showHud = q.get('hud') !== '0';
  let statusEl: HTMLDivElement | null = null;
  if (showHud) {
    const bar = document.createElement('div');
    bar.style.cssText = [
      'position:fixed;left:12px;right:12px;bottom:12px;z-index:20;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;',
      'padding:8px 12px;border-radius:16px;background:rgba(28,18,10,0.72);backdrop-filter:blur(10px);border:1px solid rgba(224,178,92,0.45);',
      'font:600 12px/1.3 system-ui,sans-serif;color:#f8f1e4;',
    ].join('');
    const mkBtn = (label: string, fn: () => void): HTMLButtonElement => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'padding:6px 10px;border-radius:999px;border:1px solid rgba(224,178,92,0.5);background:rgba(60,38,20,0.85);color:#fbe9c8;font:600 12px system-ui;cursor:pointer;';
      b.onclick = fn;
      return b;
    };
    for (const s of SPOT_ORDER) bar.appendChild(mkBtn(`Đi: ${s}`, () => world.goTo(s)));
    for (const a of ['pray', 'bow', 'incense', 'flowers', 'candle', 'bell', 'lantern', 'release', 'loc', 'wish', 'que', 'sweep'] as ActionId[]) {
      bar.appendChild(mkBtn(a, () => void world.perform(a)));
    }
    bar.appendChild(mkBtn('Ngồi thiền', () => { world.sit('meditate'); }));
    bar.appendChild(mkBtn('Tụng kinh', () => { world.sit('chant'); }));
    bar.appendChild(mkBtn('Đứng dậy', () => world.standUp()));
    bar.appendChild(mkBtn('Dừng', () => world.stop()));
    bar.appendChild(mkBtn('30 người', () => { curRemotes = makeRemotePlayers(30); world.setRemotes(curRemotes); }));
    bar.appendChild(mkBtn('Ngày/Đêm', () => {
      const next = bar.dataset.tod === 'night' ? 'day' : 'night';
      bar.dataset.tod = next;
      world.setTimeOfDay(next);
    }));
    app.appendChild(bar);

    statusEl = document.createElement('div');
    statusEl.style.cssText = 'position:fixed;top:12px;left:12px;z-index:20;padding:6px 12px;border-radius:999px;background:rgba(28,18,10,0.72);border:1px solid rgba(224,178,92,0.45);color:#fbe9c8;font:600 12px system-ui;';
    statusEl.textContent = 'Chùa Liên Hoa · Sẵn sàng';
    app.appendChild(statusEl);
    world.on('nearby', (n) => {
      if (statusEl) statusEl.textContent = n.id ? `Gần: ${n.label} [${n.actions.join(', ') || 'ngồi'}]` : 'Đang dạo sân chùa';
    });
  }

  const spotQ = q.get('spot') as SpotId | null;
  if (spotQ) world.goTo(spotQ);
  const sitQ = q.get('sit') as SeatKind | null;
  if (sitQ) world.sit(sitQ);
  const sayQ = q.get('say');
  if (sayQ) world.say(sayQ);

  const api = {
    world,
    events,
    spawnRemotes(n: number): RemotePlayer[] {
      curRemotes = makeRemotePlayers(n);
      world.setRemotes(curRemotes);
      return curRemotes;
    },
    getRemotes: () => curRemotes,
    async measureFps(ms = 1200): Promise<number> {
      let frames = 0;
      const t0 = performance.now();
      await new Promise<void>((res) => {
        const tick = (): void => {
          frames++;
          if (performance.now() - t0 >= ms) res();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      return Math.round((frames * 1000) / (performance.now() - t0));
    },
  };

  window.__w = api;
  window.__ready = true;
}
