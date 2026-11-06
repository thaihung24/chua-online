/**
 * Điểm vào ứng dụng: ghép thế giới 3D, âm thanh, mạng, tiến độ và UI.
 * Luồng: màn hình mở đầu → (chọn nhân vật lần đầu) → nạp cảnh → vào chùa → ghi nhận hành động.
 */
import '@/styles/index.css';
import { createEmitter } from '@/core/bus';
import type { ActionId, AppContext, AppEvents, PanelId, Profile, RemotePlayer, World } from '@/core/contracts';
import { load, save } from '@/core/store';
import { hasProfile, loadProfile, saveProfile, defaultProfile } from '@/core/profile';
import { createProgress } from '@/core/progress';
import { createAudio } from '@/audio';
import { createNet } from '@/net/client';
import * as api from '@/net/api';
import { createWorld } from '@/world';
import { createShell } from '@/ui/shell';
import { loadPanel } from '@/ui/panels/registry';
import { phraseText } from '@/content/phrases';
import { LANTERN_COLORS } from '@/content/lantern';
import { BotColony, DEFAULT_BOT_COUNT } from '@/core/bots';
import { createNullWorld } from '@/app/null-world';
import { DURATIONS, loadOfferings, minutesLeft, saveOfferings, type Offerings } from '@/app/offerings';

const root = document.getElementById('app') ?? document.body;

/** Bong bóng nhỏ hiện trên đầu nhân vật khi bắt đầu một việc công phu. */
const ACTION_BUBBLE: Partial<Record<ActionId, string>> = {
  pray: '🙏 Chắp tay', bow: '🙇 Lạy Phật', sweep: '🧹 Quét lá', incense: '🪔 Thắp hương', flowers: '🌸 Dâng hoa',
  candle: '🕯️ Thắp nến', bell: '🔔 Thỉnh chuông', lantern: '🏮 Thả đèn hoa đăng', que: '🎋 Xin quẻ',
  release: '🐟 Phóng sinh', loc: '🍃 Hái lộc', wish: '🎗️ Treo nguyện',
};

async function boot(): Promise<void> {
  const bus = createEmitter<AppEvents>();
  const progress = createProgress();
  const audio = createAudio();
  const net = createNet();

  let profile: Profile = loadProfile() ?? defaultProfile();
  let offerings: Offerings = loadOfferings();
  let world: World = createWorld();
  let loggedIn = false;
  let soloMode = false;
  let localBots: BotColony | null = null;
  let localBotTimer = 0;
  let shellRef: ReturnType<typeof createShell> | null = null;

  const stopLocalBots = (): void => {
    if (localBotTimer) { window.clearInterval(localBotTimer); localBotTimer = 0; }
    localBots = null;
  };

  const startLocalBots = (): void => {
    if (soloMode || net.isOnline() || localBotTimer) return;
    let lanternSeq = 0;
    localBots = new BotColony(DEFAULT_BOT_COUNT, {
      onLantern: (_botId, color) => {
        world.addLantern({ id: `lb-${++lanternSeq}`, color, mine: false, pond: 'lotus' });
      },
    });
    lastPlayers = localBots.toRemotePlayers(phraseText);
    world.setRemotes(lastPlayers);
    shellRef?.hud.setRoom({ id: 'main-1', label: 'Chùa Rắn', online: localBots.size + 1, capacity: 10_000, kind: 'public' });
    localBotTimer = window.setInterval(() => {
      if (!localBots || soloMode || net.isOnline()) { stopLocalBots(); return; }
      if (localBots.step(0.2, Date.now())) {
        lastPlayers = localBots.toRemotePlayers(phraseText);
        world.setRemotes(lastPlayers);
      }
    }, 200);
  };

  const ctx: AppContext = {
    get profile() { return profile; },
    setProfile(p) {
      profile = p;
      saveProfile(p);
      world.setProfile(p, progress.view().level);
      net.sendProfile(p, progress.view().level);
      bus.emit('profile', p);
    },
    get world() { return world; },
    audio,
    net,
    progress,
    bus,
    toast(text, opts) {
      bus.emit('toast', { text });
      shellRef?.toast(text, opts);
    },
    openPanel: (id: PanelId, params) => shellRef?.host.open(id, params) ?? Promise.resolve(),
    closePanel: () => shellRef?.host.close(),
    isLoggedIn: () => loggedIn,
    isSolo: () => soloMode,
    setSolo(solo: boolean) {
      if (soloMode === solo) return;
      soloMode = solo;
      if (solo) {
        stopLocalBots();
        net.disconnect();
        lastPlayers = [];
        world.setRemotes([]);
        shellRef?.hud.setOnline(1);
      } else {
        net.connect(profile, progress.view().level);
      }
      bus.emit('solo', { solo });
    },
    offerings: () => offerings,
  };

  const shell = createShell(ctx, root);
  shellRef = shell;
  shell.setLoading(0.02, 'Đang mở cổng chùa…');

  // Cử chỉ đầu tiên của người dùng mở khoá âm thanh.
  const unlock = () => {
    audio.unlock();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);

  // Áp dụng cài đặt đã lưu.
  const quality = load<'low' | 'medium' | 'high'>('quality', 'medium');
  const tod = load<'auto' | 'day' | 'night'>('timeOfDay', 'auto');

  // Nạp cảnh song song với bước chọn nhân vật.
  world.on('loading', (e) => shell.setLoading(0.05 + e.progress * 0.9, e.status));
  const container = document.getElementById('world') ?? (() => {
    const d = document.createElement('div');
    d.id = 'world';
    d.className = 'world-root';
    root.prepend(d);
    return d;
  })();
  const mounted = world
    .mount(container, profile, { level: progress.view().level })
    .then(() => true)
    .catch((err) => {
      console.error('Không dựng được cảnh 3D', err);
      return false;
    });

  if (!hasProfile()) {
    const chosen = await shell.showOnboarding(null);
    profile = chosen;
    saveProfile(chosen);
  }

  const ok = await mounted;
  if (!ok) {
    world = createNullWorld();
    document.body.classList.add('is-fallback');
    await world.mount(container, profile);
  }
  const origSay = world.say.bind(world);
  world.say = (text: string) => {
    origSay(text);
    if (localBots) {
      const p = world.getPlayer();
      localBots.notifyHumanGesture(p.x, p.z);
    }
  };
  world.setProfile(profile, progress.view().level);
  world.setQuality(quality);
  world.setTimeOfDay(tod);
  world.setOfferings(offerings);
  world.setWishRibbons(load<unknown[]>('wish:list', []).length);
  for (const w of load<{ id: string; color: string; at: number }[]>('lantern:wishes', []).slice(0, 8)) {
    const hex = LANTERN_COLORS.find((c) => c.id === w.color)?.hex ?? '#f3c25a';
    world.addLantern({ id: w.id, color: hex, mine: true, pond: 'lotus' });
  }
  // Nạp trước danh sách nhạc chùa để không lẫn tiếng gió tổng hợp khi bấm Vào chùa.
  await syncTempleMusic(ctx);
  audio.setAmbient(true);

  wireWorld(ctx, shell, () => offerings, (o) => { offerings = o; }, (x, z) => localBots?.notifyHumanGesture(x, z));
  wireNet(ctx, { startLocalBots, stopLocalBots, isLocalActive: () => localBotTimer !== 0 });
  wireProgress(ctx, shell);
  wireAccount(ctx, (v) => { loggedIn = v; });

  shell.hideBoot();
  shell.hud.setOnline(1);
  progress.record('visit');
  net.connect(profile, progress.view().level);
  shell.hud.setLevel(progress.view());
  shell.hud.setStreak(progress.view().streak, progress.view().litToday);

  if (!ok) {
    shell.hud.notice('Thiết bị này chưa hỗ trợ cảnh 3D. Bạn vẫn có thể niệm Phật, tụng kinh và thiền ở các nút bên dưới.', [{ label: 'Đã hiểu' }]);
  } else if (!load<boolean>('seen:audio-note', false)) {
    save('seen:audio-note', true);
    shell.hud.notice('Chùa đang mở nhạc nền và tiếng mõ. Bấm Tắt cho yên lặng, hay chỉnh ở nút loa.', [
      { label: 'Tắt', onClick: () => audio.configure({ master: false }) },
      { label: 'Để vậy' },
    ]);
  }

  // Liên kết sâu: ?kinh=<id> mở thẳng bài kinh; ?panel=<id>.
  const q = new URLSearchParams(location.search);
  if (q.get('kinh')) void ctx.openPanel('chant', { id: q.get('kinh') });
  else if (q.get('panel')) void ctx.openPanel(q.get('panel') as PanelId);

  window.addEventListener('beforeunload', () => net.disconnect());
  document.addEventListener('visibilitychange', () => world.setPaused(document.hidden));
  registerServiceWorker();
}

/** Nối sự kiện thế giới: ghi tiến độ, lễ vật, âm thanh, mạng. */
function wireWorld(
  ctx: AppContext,
  shell: ReturnType<typeof createShell>,
  getO: () => Offerings,
  setO: (o: Offerings) => void,
  onHumanGesture?: (x: number, z: number) => void,
): void {
  const { world, audio, progress, net } = ctx;
  const sfx: Partial<Record<ActionId, Parameters<typeof audio.play>[0]>> = {
    incense: 'incense', flowers: 'flower', candle: 'candle', bell: 'bellBig', bow: 'bow',
    lantern: 'lantern', que: 'que', release: 'splash', loc: 'chime', wish: 'ribbon', sweep: 'sweep',
  };

  const reward = (kind: Parameters<typeof progress.record>[0], amount = 1, meta?: Parameters<typeof progress.record>[2]) => {
    const r = progress.record(kind, amount, meta);
    if (r.xp > 0) ctx.toast(`+${r.xp} tinh tấn`, { kind: 'good', ms: 1600 });
    if (r.stamp?.length) ctx.toast('Có thêm một dấu ấn hành hương', { kind: 'good', ms: 2600 });
    return r;
  };

  world.on('actionDone', ({ action, detail }) => {
    const s = sfx[action];
    if (s) audio.play(s);
    const now = Date.now();
    const o = { ...getO() };
    switch (action) {
      case 'pray':
        reward('pray');
        break;
      case 'bow':
        reward('bow');
        break;
      case 'sweep':
        if (detail?.round) reward('sweepRound');
        break;
      case 'incense':
        if (o.incenseUntil > now) {
          ctx.toast(`Hương của bạn còn cháy ${minutesLeft(o.incenseUntil)} phút, khi tàn bạn thắp nén mới nhé.`);
        } else {
          o.incenseUntil = now + DURATIONS.incense;
          reward('incense');
          ctx.toast('Đã thắp hương. Nguyện tâm được thanh tịnh.', { kind: 'good' });
        }
        break;
      case 'flowers':
        if (o.flowersUntil > now) ctx.toast('Hoa vẫn đang tươi trên bàn thờ.');
        else {
          o.flowersUntil = now + DURATIONS.flowers;
          reward('flowers');
          ctx.toast('Đã dâng hoa cúng dường.', { kind: 'good' });
        }
        break;
      case 'candle':
        if (o.candleUntil > now) ctx.toast('Nến vẫn đang cháy trên bàn thờ.');
        else {
          o.candleUntil = now + DURATIONS.candle;
          reward('candle');
          ctx.toast('Đã thắp nến. Nguyện ánh sáng trí tuệ soi đường.', { kind: 'good' });
        }
        break;
      case 'bell':
        reward('bell');
        break;
      case 'release':
        reward('release');
        ctx.toast('Phóng sinh: nguyện muôn loài được an vui.', { kind: 'good' });
        break;
      case 'loc':
        reward('loc');
        ctx.toast('Đã hái lộc. Chúc bạn một ngày an lành.', { kind: 'good' });
        break;
      default:
        break; // lantern/que/wish: panel tương ứng đã ghi tiến độ
    }
    if (o.incenseUntil !== getO().incenseUntil || o.flowersUntil !== getO().flowersUntil || o.candleUntil !== getO().candleUntil) {
      setO(o);
      saveOfferings(o);
      world.setOfferings(o);
      ctx.bus.emit('offerings', o);
    }
  });

  world.on('spotReached', ({ spot }) => {
    reward('walkSpot', 1, { spot });
    if (spot === 'quanam') reward('quanam');
  });

  world.on('nearby', (n) => shell.hud.setNearby(n));
  world.on('night', ({ value }) => audio.setNight(value));
  world.on('travel', ({ label }) => shell.hud.setTravel(label));
  world.on('actionStart', ({ action }) => {
    const b = ACTION_BUBBLE[action];
    if (b) world.say(b);
  });

  // Gợi ý điều khiển cho vài lần vào chùa đầu tiên; ẩn khi người chơi bắt đầu đi.
  const hintSeen = load<number>('seen:controls', 0);
  if (hintSeen < 3) {
    save('seen:controls', hintSeen + 1);
    const touch = matchMedia('(pointer: coarse)').matches;
    shell.hud.hint(touch
      ? 'Kéo nửa trái màn hình để đi · vuốt nửa phải để nhìn quanh · chạm vào sân để tới đó'
      : 'Bấm chuột vào sân hoặc W A S D để đi · kéo chuột để nhìn quanh · Q E để xoay');
    let moves = 0;
    const offHintTimer = window.setTimeout(() => shell.hud.hint(null), 16_000);
    const offMove = world.on('moved', (m) => {
      if (!m.moving || ++moves < 8) return;
      window.clearTimeout(offHintTimer);
      shell.hud.hint(null);
      offMove();
    });
  }
  world.on('tapRemote', ({ id }) => {
    const p = lastPlayers.find((x) => x.id === id);
    if (p) ctx.toast(`${p.profile.name} · Cấp ${p.level}`);
  });

  // Ngồi bồ đoàn: cộng giây ngồi, cập nhật HUD.
  let sitTimer = 0;
  world.on('seated', ({ seated }) => {
    shell.hud.setSeated(seated);
    window.clearInterval(sitTimer);
    if (seated) sitTimer = window.setInterval(() => progress.record('sitSeconds', 5), 5000);
  });

  // Gửi vị trí lên mạng.
  let anim: RemotePlayer['anim'] = 'idle';
  world.on('moved', (m) => {
    anim = m.moving ? 'walk' : world.isSeated() ? 'sit' : 'idle';
    net.sendMove({ x: m.x, z: m.z, ry: m.ry, anim });
  });
  world.on('actionDone', ({ action }) => {
    const map: Partial<Record<ActionId, RemotePlayer['anim']>> = { pray: 'pray', bow: 'bow', sweep: 'sweep' };
    const a = map[action];
    if (a) {
      const p = world.getPlayer();
      net.sendMove({ x: p.x, z: p.z, ry: p.ry, anim: a });
      if (a === 'pray' || a === 'bow') onHumanGesture?.(p.x, p.z);
    }
  });

  // Hương/hoa/nến hết hạn → cập nhật cảnh.
  window.setInterval(() => {
    const now = Date.now();
    const o = getO();
    if ((o.incenseUntil && o.incenseUntil <= now) || (o.flowersUntil && o.flowersUntil <= now) || (o.candleUntil && o.candleUntil <= now)) {
      const n = loadOfferings(now);
      setO(n);
      saveOfferings(n);
      world.setOfferings(n);
      ctx.bus.emit('offerings', n);
    }
  }, 15_000);

  // Công phu chung: có mặt 10 phút trong khung 05:00 hoặc 18:00 (giờ VN).
  let presence = 0;
  window.setInterval(() => {
    const vn = new Date(Date.now() + 7 * 3_600_000);
    const h = vn.getUTCHours();
    const inWindow = (h === 5 || h === 18) && vn.getUTCMinutes() < 30 && !document.hidden;
    if (!inWindow) { presence = 0; return; }
    presence += 10;
    if (presence === 600) reward('communitySeconds', 600);
  }, 10_000);
}

let lastPlayers: RemotePlayer[] = [];

async function syncTempleMusic(ctx: AppContext): Promise<void> {
  try {
    const r = await fetch(api.apiUrl('/api/music'), { credentials: api.API_ORIGIN ? 'include' : 'same-origin' });
    if (r.ok && (r.headers.get('content-type') || '').includes('application/json')) {
      const d = (await r.json()) as { tracks?: { name: string; url: string }[]; startedAt?: number; serverNow?: number };
      if (Array.isArray(d.tracks)) {
        ctx.audio.setMusicTracks?.(d.tracks, d.startedAt, d.serverNow);
      }
    }
  } catch { /* bỏ qua — dùng âm thanh thiền tự nhiên mặc định của chùa */ }
}

function wireNet(
  ctx: AppContext,
  local: { startLocalBots: () => void; stopLocalBots: () => void; isLocalActive: () => boolean },
): void {
  const { net, world } = ctx;
  const sayTimers = new Map<string, number>();
  net.on('status', (s) => {
    if (s.state === 'online') {
      local.stopLocalBots();
      const p = world.getPlayer();
      net.sendMove({ x: p.x, z: p.z, ry: p.ry, anim: world.isSeated() ? 'sit' : 'idle' });
      void syncTempleMusic(ctx);
    } else if (s.state === 'offline' && !ctx.isSolo?.()) {
      local.startLocalBots();
    }
  });
  net.on('players', (list) => {
    if (local.isLocalActive() && !net.isOnline()) return;
    lastPlayers = list;
    world.setRemotes(list);
  });
  net.on('say', ({ id, text }) => {
    const p = lastPlayers.find((x) => x.id === id);
    if (!p) return;
    p.say = phraseText(text) ?? text;
    world.setRemotes(lastPlayers);
    window.clearTimeout(sayTimers.get(id));
    sayTimers.set(id, window.setTimeout(() => {
      const q = lastPlayers.find((x) => x.id === id);
      if (q) { q.say = undefined; world.setRemotes(lastPlayers); }
    }, 4500));
  });
  net.on('chat', (msg) => {
    if (msg.senderId === net.selfId?.()) return;
    const p = lastPlayers.find((x) => x.id === msg.senderId);
    if (!p) return;
    p.say = msg.text;
    world.setRemotes(lastPlayers);
    const showMs = Math.min(8000, Math.max(5500, 1800 + [...msg.text].length * 70));
    window.clearTimeout(sayTimers.get(msg.senderId));
    sayTimers.set(msg.senderId, window.setTimeout(() => {
      const q = lastPlayers.find((x) => x.id === msg.senderId);
      if (q) { q.say = undefined; world.setRemotes(lastPlayers); }
    }, showMs));
  });
  net.on('lantern', ({ id, color, by }) => {
    if (by === 'me') return;
    world.addLantern({ id, color, mine: false, pond: 'lotus' });
  });
  net.on('notice', ({ text }) => ctx.toast(text));
  net.on('music', ({ tracks, startedAt, serverNow }) => {
    ctx.audio.setMusicTracks?.(tracks, startedAt, serverNow);
  });
}

function wireProgress(ctx: AppContext, shell: ReturnType<typeof createShell>): void {
  const { progress, audio, world, net } = ctx;
  let lastLevel = progress.view().level;
  const refresh = () => {
    const v = progress.view();
    shell.hud.setLevel(v);
    shell.hud.setStreak(v.streak, v.litToday);
    ctx.bus.emit('progress', v);
    if (v.level > lastLevel) {
      ctx.bus.emit('levelUp', { level: v.level, tier: v.tier });
      audio.play('levelUp');
      ctx.toast(`Lên Cấp ${v.level} · ${v.tier.name}. Nam mô A Di Đà Phật.`, { kind: 'good', ms: 3800 });
      world.setProfile(ctx.profile, v.level);
      net.sendProfile(ctx.profile, v.level);
    }
    lastLevel = v.level;
  };
  progress.onChange(refresh);
  refresh();
}

/** Đăng nhập sẵn có → đồng bộ tiến độ & hồ sơ hai chiều (không bao giờ hạ cấp). */
function wireAccount(ctx: AppContext, setLoggedIn: (v: boolean) => void): void {
  const { progress, bus, net } = ctx;
  let timer = 0;
  let loggedIn = false;
  let internalEmit = false;
  const push = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (loggedIn) { const v = progress.view(); void api.progressSync.put(progress.exportState(), ctx.profile, { level: v.level, streak: v.streak }); }
    }, 4000);
  };
  const pull = async (emitAuth: boolean) => {
    const me = await api.auth.me();
    loggedIn = me.ok && !!me.data.user;
    setLoggedIn(loggedIn);
    net.sendAuth?.(loggedIn ? api.getAuthToken() : null);
    if (emitAuth) {
      internalEmit = true;
      try {
        bus.emit('auth', { loggedIn, email: me.ok ? me.data.user?.email : undefined });
      } finally {
        internalEmit = false;
      }
    }
    if (!loggedIn) return;
    const got = await api.progressSync.get();
    if (got.ok && got.data) {
      if (got.data.state) progress.importState(got.data.state);
      if (got.data.profile?.name && JSON.stringify(got.data.profile) !== JSON.stringify(ctx.profile)) {
        ctx.setProfile(got.data.profile);
      }
    }
    push();
  };
  progress.onChange(push);
  bus.on('profile', push);
  bus.on('auth', (a) => {
    if (internalEmit) return;
    loggedIn = a.loggedIn;
    setLoggedIn(a.loggedIn);
    net.sendAuth?.(a.loggedIn ? api.getAuthToken() : null);
    if (a.loggedIn) void pull(false);
  });
  void pull(true);
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    (window as unknown as { __installPrompt?: Event }).__installPrompt = e;
  });
}

boot().catch((err) => {
  console.error('Lỗi khởi động', err);
  const s = document.getElementById('bootStatus');
  if (s) s.textContent = 'Chưa mở được chùa. Bạn thử tải lại trang nhé.';
});
