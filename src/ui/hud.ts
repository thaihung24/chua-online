/**
 * HUD trong game: viên thuốc phòng, nhóm kính (số người, âm thanh, toàn màn hình, cài đặt), nút cấp,
 * chuỗi giữ lửa, "Nghe niệm Phật", banner thông báo, thẻ góp ý, nút ngữ cảnh (phím F/Enter),
 * thanh công phu bên dưới (+ hàng Tụng kinh/Thiền/Đứng dậy khi đang ngồi) và menu "Thêm".
 */
import { TIERS, type ActionId, type AppContext, type AudioSettings, type ProgressView, type RoomInfo, type UnlockFeature, type WorldEvents } from '@/core/contracts';
import { isChantRadioOn, onChantRadioChange, startChantRadio, stopChantRadio } from './chant-radio';
import { esc, isTyping } from './dom';
import { icon, type IconName } from './icons';
import { createMoreMenu, FEATURE_LABEL, offeringBusyMsg } from './menu';
import { tierIcon } from './tier-icon';

export interface NoticeButton { label: string; onClick?: () => void }

export interface Hud {
  readonly el: HTMLElement;
  setNearby(n: WorldEvents['nearby']): void;
  setLevel(v: ProgressView): void;
  setRoom(info: RoomInfo | null): void;
  setSeated(seated: boolean): void;
  setOnline(n: number): void;
  notice(text: string, buttons?: NoticeButton[]): void;
  setStreak(n: number, litToday: boolean): void;
  setListening(on: boolean): void;
  /** Ẩn/hiện toàn bộ HUD (vd khi chụp ảnh). */
  setVisible(v: boolean): void;
  destroy(): void;
}

type CtxAction = ActionId | 'sit';

const ACTION_UI: Record<CtxAction, { label: string; icon: IconName; feature?: UnlockFeature }> = {
  pray: { label: 'Chắp tay', icon: 'hands' },
  bow: { label: 'Lạy Phật', icon: 'bow' },
  sweep: { label: 'Quét lá', icon: 'broom' },
  incense: { label: 'Thắp hương', icon: 'incense' },
  flowers: { label: 'Dâng hoa', icon: 'flower', feature: 'flowers' },
  candle: { label: 'Thắp nến', icon: 'candle', feature: 'candle' },
  bell: { label: 'Thỉnh chuông', icon: 'bell', feature: 'bell' },
  lantern: { label: 'Thả đèn hoa đăng', icon: 'lantern', feature: 'lantern' },
  que: { label: 'Xin quẻ', icon: 'sticks', feature: 'que' },
  release: { label: 'Phóng sinh', icon: 'fish', feature: 'release' },
  loc: { label: 'Hái lộc', icon: 'leaf', feature: 'loc' },
  wish: { label: 'Treo nguyện', icon: 'ribbon' },
  sit: { label: 'Ngồi xuống', icon: 'cushion' },
};

const RING_R = 25;
const RING_C = 2 * Math.PI * RING_R;

export function createHud(ctx: AppContext, root: HTMLElement): Hud {
  const el = document.createElement('div');
  el.className = 'hud';
  el.innerHTML = `
    <div class="hud__top">
      <button type="button" class="hud-pill glass" id="hud-room" aria-label="Không gian chùa">
        ${icon('lotus', { size: 22 })}
        <span class="hud-pill__name">Chùa Liên Hoa</span><span class="hud-pill__sep">·</span>
        <span class="hud-dot" data-state="offline" aria-hidden="true"></span>
        <span class="hud-pill__state">Một mình</span>
        ${icon('chevron-down', { size: 16 })}
      </button>
      <div class="hud-group glass" role="group" aria-label="Tuỳ chọn">
        <button type="button" class="hud-btn" id="hud-users" aria-label="Số người trong chùa">${icon('users', { size: 20 })}<span class="hud-btn__count">1</span></button>
        <button type="button" class="hud-btn" id="hud-sound" aria-label="Âm thanh" aria-expanded="false" aria-controls="hud-snd">${icon('sound', { size: 21 })}</button>
        <button type="button" class="hud-btn" id="hud-full" aria-label="Toàn màn hình" hidden>${icon('fullscreen', { size: 20 })}</button>
        <button type="button" class="hud-btn" id="hud-settings" aria-label="Cài đặt">${icon('settings', { size: 21 })}</button>
      </div>
    </div>
    <div class="hud__stack">
      <button type="button" class="lvl-btn glass" id="hud-level" aria-label="Hành trình">
        <svg class="lvl-btn__ring" viewBox="0 0 56 56" aria-hidden="true"><circle class="lvl-btn__track" cx="28" cy="28" r="${RING_R}"/><circle class="lvl-btn__arc" cx="28" cy="28" r="${RING_R}" stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="${RING_C.toFixed(2)}"/></svg>
        <span class="lvl-btn__icon"></span>
        <span class="lvl-btn__num">1</span>
        <span class="lvl-btn__hint" hidden></span>
      </button>
      <button type="button" class="hud-chip hud-chip--flame glass is-dim" id="hud-streak" hidden>${icon('flame', { size: 19 })}<span class="hud-chip__n">0</span></button>
      <button type="button" class="hud-chip hud-chip--listen glass" id="hud-listen" aria-pressed="false" aria-label="Nghe niệm Phật (nhấn giữ để mở danh sách)"><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Nghe niệm Phật</span></button>
    </div>
    <div class="banner glass glass--strong" id="hud-banner" role="status" aria-live="polite" hidden>
      <p class="banner__text"></p><div class="banner__actions"></div>
    </div>
    <button type="button" class="fb-tab glass" id="hud-feedback" aria-label="Góp ý hoặc báo lỗi">${icon('mail', { size: 16 })}<span>Góp ý · Báo lỗi</span></button>
    <div class="ctx" id="hud-ctx" aria-live="polite"><span class="ctx__label"></span><div class="ctx__row"></div></div>
    <div class="seat-row" id="hud-seat">
      <button type="button" class="seat-btn glass" data-seat="chant">${icon('book', { size: 20 })}Tụng kinh</button>
      <button type="button" class="seat-btn glass" data-seat="meditate">${icon('meditate', { size: 20 })}Thiền</button>
      <button type="button" class="seat-btn seat-btn--stand glass" data-seat="stand">${icon('user', { size: 20 })}Đứng dậy</button>
    </div>
    <div class="snd glass glass--strong" id="hud-snd" role="dialog" aria-label="Âm thanh" inert></div>
    <nav class="dock glass" role="group" aria-label="Thanh công phu">
      <button type="button" class="dock__btn" data-dock="pray">${icon('hands', { size: 26 })}<span>Chắp tay</span></button>
      <button type="button" class="dock__btn" data-dock="bow">${icon('bow', { size: 26 })}<span>Lạy Phật</span></button>
      <button type="button" class="dock__btn" data-dock="sweep" aria-pressed="false">${icon('broom', { size: 26 })}<span>Quét lá</span></button>
      <button type="button" class="dock__btn" data-dock="beads">${icon('beads', { size: 26 })}<span>Tràng hạt</span></button>
      <button type="button" class="dock__btn dock__btn--top is-hot" data-dock="top">${icon('trophy', { size: 26 })}<span>Top</span></button>
      <button type="button" class="dock__btn" data-dock="more" aria-expanded="false" aria-controls="hud-more">${icon('more', { size: 26 })}<span>Thêm</span></button>
    </nav>`;
  root.append(el);

  const q = <T extends Element = HTMLElement>(sel: string) => el.querySelector(sel) as T;
  const roomBtn = q<HTMLButtonElement>('#hud-room');
  const dot = q<HTMLElement>('.hud-dot');
  const stateTxt = q<HTMLElement>('.hud-pill__state');
  const usersBtn = q<HTMLButtonElement>('#hud-users');
  const soundBtn = q<HTMLButtonElement>('#hud-sound');
  const fullBtn = q<HTMLButtonElement>('#hud-full');
  const lvlBtn = q<HTMLButtonElement>('#hud-level');
  const lvlIcon = q<HTMLElement>('.lvl-btn__icon');
  const lvlNum = q<HTMLElement>('.lvl-btn__num');
  const lvlHint = q<HTMLElement>('.lvl-btn__hint');
  const lvlArc = q<SVGCircleElement>('.lvl-btn__arc');
  const streakBtn = q<HTMLButtonElement>('#hud-streak');
  const listenBtn = q<HTMLButtonElement>('#hud-listen');
  const banner = q<HTMLElement>('#hud-banner');
  const ctxBox = q<HTMLElement>('#hud-ctx');
  const seatRow = q<HTMLElement>('#hud-seat');
  const sndPop = q<HTMLElement>('#hud-snd');
  const moreBtn = q<HTMLButtonElement>('[data-dock="more"]');
  const sweepBtn = q<HTMLButtonElement>('[data-dock="sweep"]');

  const open = (id: Parameters<AppContext['openPanel']>[0]) => () => void ctx.openPanel(id);
  roomBtn.addEventListener('click', open('rooms'));
  usersBtn.addEventListener('click', open('rooms'));
  q('#hud-settings').addEventListener('click', open('settings'));
  q('#hud-feedback').addEventListener('click', open('feedback'));
  lvlBtn.addEventListener('click', open('journey'));
  streakBtn.addEventListener('click', open('journey'));

  // ── Toàn màn hình (chỉ khi thiết bị cho phép & không phải cảm ứng)
  const canFull = document.fullscreenEnabled && !matchMedia('(pointer: coarse)').matches;
  if (canFull) {
    fullBtn.hidden = false;
    fullBtn.addEventListener('click', () => {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen().catch(() => ctx.toast('Chưa mở được toàn màn hình.'));
    });
  }

  // ── Trạng thái phòng / số người
  let online = 1;
  let curState: 'offline' | 'connecting' | 'online' = ctx.net.isOnline() ? 'online' : 'offline';
  let roomLabel: string | null = null;
  function paintRoom(state?: 'offline' | 'connecting' | 'online'): void {
    if (state) curState = state;
    const solo = ctx.isSolo?.() ?? false;
    const effective = solo ? 'offline' : (curState === 'online' || online > 1 ? 'online' : curState);
    dot.dataset.state = effective;
    const labelTxt = effective === 'online' ? `${online} người` : effective === 'connecting' ? 'Đang kết nối…' : 'Một mình';
    stateTxt.textContent = labelTxt;
    roomBtn.setAttribute('aria-label', `Không gian chùa. ${roomLabel ? roomLabel + ', ' : ''}${labelTxt}`);
    (usersBtn.querySelector('.hud-btn__count') as HTMLElement).textContent = String(effective === 'online' ? online : 1);
  }
  const offStatus = ctx.net.on('status', (s) => {
    roomLabel = s.room?.label ?? roomLabel;
    if (s.state === 'online' && s.room) online = Math.max(1, s.room.online);
    else if (s.state === 'connecting' && online <= 1) online = 1;
    else if (s.state === 'offline' && (ctx.isSolo?.() ?? false)) online = 1;
    paintRoom(s.state);
  });
  const offCount = ctx.net.on('count', (c) => {
    online = Math.max(1, c.online);
    paintRoom();
  });
  const offPlayers = ctx.net.on('players', (list) => {
    if (curState === 'online') {
      online = Math.max(online, list.length + 1);
      paintRoom();
    }
  });
  const offSolo = ctx.bus.on('solo', ({ solo }) => {
    if (solo) online = 1;
    paintRoom();
  });
  paintRoom(curState);

  // ── Âm thanh (popover)
  function paintSound(s: AudioSettings): void {
    soundBtn.innerHTML = icon(s.master ? 'sound' : 'mute', { size: 21 });
    soundBtn.classList.toggle('is-muted', !s.master);
    const rows: [keyof AudioSettings, string, string][] = [
      ['master', 'Âm thanh', 'Bật hoặc tắt tất cả'],
      ['ambient', 'Nhạc nền', 'Gió, chim, suối, nhạc thiền'],
      ['sfx', 'Mõ & chuông', 'Tiếng mõ, chuông, tràng hạt'],
      ['chant', 'Giọng niệm Phật & nhạc nền', 'Tiếng niệm cùng nhạc chung'],
    ];
    const keep = sndPop.contains(document.activeElement) ? (document.activeElement as HTMLElement).id : '';
    sndPop.innerHTML =
      rows
        .map(
          ([k, name, sub]) =>
            `<div class="snd__row"><label for="snd-${k}"><span>${esc(name)}</span><small>${esc(sub)}</small></label><span class="sw"><input type="checkbox" role="switch" id="snd-${k}" data-k="${k}" ${s[k] ? 'checked' : ''} ${k !== 'master' && !s.master ? 'disabled' : ''}/><span class="sw__track"></span></span></div>`,
        )
        .join('') +
      `<div class="snd__vol">${icon('sound', { size: 18 })}<input type="range" class="range" id="snd-vol" min="0" max="100" value="${Math.round(s.ambientVolume * 100)}" style="--p:${Math.round(s.ambientVolume * 100)}%" aria-label="Âm lượng nhạc nền" ${s.master ? '' : 'disabled'}/></div>`;
    if (keep) (sndPop.querySelector('#' + keep) as HTMLElement | null)?.focus();
  }
  sndPop.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.id === 'snd-vol') {
      t.style.setProperty('--p', t.value + '%');
      ctx.audio.configure({ ambientVolume: Number(t.value) / 100 });
    }
  });
  sndPop.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    const k = t.dataset.k as keyof AudioSettings | undefined;
    if (k && k !== 'ambientVolume') ctx.audio.configure({ [k]: t.checked } as Partial<AudioSettings>);
  });
  const offAudio = ctx.audio.onChange(paintSound);
  paintSound(ctx.audio.settings());
  let sndOpen = false;
  function toggleSound(force?: boolean): void {
    sndOpen = force ?? !sndOpen;
    if (sndOpen) menu.close();
    sndPop.classList.toggle('is-on', sndOpen);
    sndPop.inert = !sndOpen;
    soundBtn.setAttribute('aria-expanded', String(sndOpen));
    if (sndOpen) document.addEventListener('pointerdown', onOutsideSound, true);
    else document.removeEventListener('pointerdown', onOutsideSound, true);
  }
  function onOutsideSound(e: Event): void {
    const t = e.target as Node;
    if (!sndPop.contains(t) && !soundBtn.contains(t)) toggleSound(false);
  }
  soundBtn.addEventListener('click', () => toggleSound());

  // ── Nghe niệm Phật: bấm = bật/tắt; nhấn giữ hoặc chuột phải = mở panel listen
  let listening = isChantRadioOn();
  let holdTimer = 0;
  let held = false;
  const startHold = () => {
    held = false;
    holdTimer = window.setTimeout(() => { held = true; void ctx.openPanel('listen'); }, 520);
  };
  const endHold = () => window.clearTimeout(holdTimer);
  listenBtn.addEventListener('pointerdown', startHold);
  listenBtn.addEventListener('pointerup', endHold);
  listenBtn.addEventListener('pointerleave', endHold);
  listenBtn.addEventListener('pointercancel', endHold);
  listenBtn.addEventListener('contextmenu', (e) => { e.preventDefault(); void ctx.openPanel('listen'); });
  listenBtn.addEventListener('click', () => {
    if (held) { held = false; return; }
    if (listening) {
      if (isChantRadioOn()) stopChantRadio();
      else { api.setListening(false); ctx.audio.setChantRadio(false); }
    } else {
      startChantRadio(ctx);
    }
  });
  const offRadio = onChantRadioChange((on) => api.setListening(on));

  // ── Cấp / chuỗi
  let lastView: ProgressView | null = null;
  function setLevel(v: ProgressView): void {
    lastView = v;
    lvlIcon.innerHTML = tierIcon(v.tier.id, { size: 38, ring: false });
    lvlNum.textContent = String(v.level);
    lvlArc.style.strokeDashoffset = String(RING_C * (1 - Math.max(0, Math.min(1, v.frac))));
    const pending = v.tasks.length > 0 && v.tasksDone < v.tasks.length;
    lvlHint.hidden = !pending;
    lvlBtn.setAttribute(
      'aria-label',
      `Hành trình: cấp ${v.level}, ${v.tier.name}, còn ${Math.max(0, v.xpForNext - v.xpIntoLevel)} tinh tấn lên cấp tiếp theo. Việc hôm nay ${v.tasksDone}/${v.tasks.length}`,
    );
    menu.refresh();
    paintCtx();
  }
  const offProgress = ctx.bus.on('progress', setLevel);
  const offLevelUp = ctx.bus.on('levelUp', () => {
    lvlBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }], { duration: 700, easing: 'ease-out' });
  });
  function setStreak(n: number, lit: boolean): void {
    streakBtn.hidden = n <= 0 && !lit;
    streakBtn.classList.toggle('is-lit', lit);
    streakBtn.classList.toggle('is-dim', !lit);
    (streakBtn.querySelector('.hud-chip__n') as HTMLElement).textContent = String(n);
    streakBtn.setAttribute('aria-label', `Chuỗi giữ lửa ${n} ngày${lit ? ', hôm nay đã thắp lửa' : ', hôm nay chưa thắp lửa'}`);
    streakBtn.title = lit ? 'Hôm nay bạn đã giữ lửa' : 'Công phu một chút hôm nay để giữ lửa';
  }

  // ── Banner
  let bannerTimer = 0;
  function notice(text: string, buttons: NoticeButton[] = []): void {
    window.clearTimeout(bannerTimer);
    const t = banner.querySelector('.banner__text') as HTMLElement;
    const a = banner.querySelector('.banner__actions') as HTMLElement;
    t.textContent = text;
    a.innerHTML = '';
    const hide = () => {
      banner.classList.remove('is-on');
      window.setTimeout(() => { if (!banner.classList.contains('is-on')) banner.hidden = true; }, 320);
    };
    for (const b of buttons) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'banner__btn';
      btn.textContent = b.label;
      btn.addEventListener('click', () => { hide(); b.onClick?.(); });
      a.append(btn);
    }
    if (!buttons.length) {
      banner.style.paddingBottom = '14px';
      bannerTimer = window.setTimeout(hide, 7000);
    } else banner.style.paddingBottom = '';
    banner.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('is-on')));
  }

  // ── Nút ngữ cảnh
  let nearby: WorldEvents['nearby'] = { id: null, label: null, actions: [] };
  let seated = false;
  let panelOpen = false;
  let sweeping = false;
  const busy = new Set<string>();

  function lockedMsg(a: CtxAction): string | null {
    const f = ACTION_UI[a].feature;
    if (f && !ctx.progress.isUnlocked(f)) return `Lên cấp ${ctx.progress.unlockLevel(f)} để mở ${FEATURE_LABEL[f]}.`;
    return null;
  }
  function run(a: CtxAction): void {
    const msg = lockedMsg(a);
    if (msg) { ctx.toast(msg); return; }
    if (a === 'sit') {
      if (!ctx.world.sit('sit')) ctx.toast('Chưa còn bồ đoàn trống, bạn đợi một chút nhé.');
      return;
    }
    if (a === 'lantern' || a === 'que' || a === 'wish') { void ctx.openPanel(a); return; }
    const activeOffering = offeringBusyMsg(ctx, a);
    if (activeOffering) { ctx.toast(activeOffering); return; }
    if (busy.has(a)) return;
    busy.add(a);
    paintCtx();
    const done = () => { busy.delete(a); paintCtx(); };
    const guard = window.setTimeout(done, 8000);
    ctx.world.perform(a).catch(() => undefined).finally(() => { window.clearTimeout(guard); done(); });
  }
  function ctxActions(): CtxAction[] {
    if (seated) return [];
    const acts: CtxAction[] = [...nearby.actions];
    if (nearby.id === 'cushion' && !acts.includes('sit')) acts.unshift('sit');
    return acts.slice(0, 3);
  }
  function primaryIndex(acts: CtxAction[]): number {
    const u = acts.findIndex((a) => !lockedMsg(a));
    return u >= 0 ? u : 0;
  }
  function paintCtx(): void {
    const acts = ctxActions();
    const show = acts.length > 0 && !panelOpen;
    ctxBox.classList.toggle('is-on', show);
    if (!acts.length) return;
    (ctxBox.querySelector('.ctx__label') as HTMLElement).textContent = nearby.label ?? '';
    (ctxBox.querySelector('.ctx__label') as HTMLElement).hidden = !nearby.label;
    const row = ctxBox.querySelector('.ctx__row') as HTMLElement;
    row.classList.toggle('ctx__row--multi', acts.length > 1);
    row.innerHTML = '';
    const pIdx = primaryIndex(acts);
    const icSize = acts.length > 1 ? 19 : 22;
    acts.forEach((a, i) => {
      const u = ACTION_UI[a];
      const lk = !!lockedMsg(a);
      const isPrimary = i === pIdx;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ctx__btn' + (!isPrimary ? ' ctx__btn--alt' : '') + (lk ? ' is-locked' : '') + (busy.has(a) ? ' is-busy' : '');
      b.innerHTML = `${icon(lk ? 'lock' : u.icon, { size: icSize })}<span>${esc(u.label)}</span>${isPrimary ? '<kbd class="ctx__key">F</kbd>' : ''}`;
      b.addEventListener('click', () => run(a));
      row.append(b);
    });
  }

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      if (sndOpen) { toggleSound(false); soundBtn.focus(); }
      else if (!panelOpen && !menu.isOpen() && banner.classList.contains('is-on')) {
        banner.classList.remove('is-on');
        window.setTimeout(() => { if (!banner.classList.contains('is-on')) banner.hidden = true; }, 320);
      }
      return;
    }
    if (panelOpen || menu.isOpen() || sndOpen || document.body.classList.contains('is-onboarding')) return;
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
    const isF = e.key === 'f' || e.key === 'F';
    const isEnter = e.key === 'Enter' && (document.activeElement === document.body || document.activeElement?.tagName === 'CANVAS');
    if (!isF && !isEnter) return;
    const acts = ctxActions();
    if (acts.length) { e.preventDefault(); run(acts[primaryIndex(acts)]); }
  };
  document.addEventListener('keydown', onKeyDown);
  const offPanel = ctx.bus.on('panel', ({ id }) => {
    panelOpen = id !== null;
    if (panelOpen) { menu.close(); toggleSound(false); }
    paintCtx();
  });

  // ── Hàng khi ngồi
  seatRow.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-seat]');
    if (!b) return;
    const k = b.dataset.seat;
    if (k === 'chant') void ctx.openPanel('chant');
    else if (k === 'meditate') void ctx.openPanel('meditate');
    else ctx.world.standUp();
  });

  // ── Thanh công phu
  const menu = createMoreMenu(ctx, el, {
    anchor: moreBtn,
    onToggle: (o) => {
      moreBtn.setAttribute('aria-expanded', String(o));
      if (o) toggleSound(false);
    },
  });
  el.querySelector('.dock')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-dock]');
    if (!b) return;
    const k = b.dataset.dock;
    if (k !== 'more') menu.close();
    switch (k) {
      case 'pray':
      case 'bow': {
        if (busy.has(k)) return;
        busy.add(k);
        b.setAttribute('aria-busy', 'true');
        const done = () => { busy.delete(k); b.removeAttribute('aria-busy'); };
        const guard = window.setTimeout(done, 6000);
        ctx.world.perform(k, { inPlace: true }).catch(() => undefined).finally(() => { window.clearTimeout(guard); done(); });
        break;
      }
      case 'sweep':
        if (sweeping) { ctx.world.stop(); setSweeping(false); }
        else {
          setSweeping(true);
          ctx.world.perform('sweep').catch(() => undefined).finally(() => setSweeping(false));
        }
        break;
      case 'beads': void ctx.openPanel('beads'); break;
      case 'top': void ctx.openPanel('rank'); break;
      case 'more': menu.toggle(); break;
    }
  });
  function setSweeping(v: boolean): void {
    sweeping = v;
    sweepBtn.setAttribute('aria-pressed', String(v));
    (sweepBtn.querySelector('span') as HTMLElement).textContent = v ? 'Cất chổi' : 'Quét lá';
  }

  const api: Hud = {
    el,
    setNearby(n) { nearby = n; paintCtx(); },
    setLevel,
    setRoom(info) {
      roomLabel = info?.label ?? null;
      if (info) online = Math.max(1, info.online);
      paintRoom();
    },
    setSeated(s) {
      seated = s;
      seatRow.classList.toggle('is-on', s);
      if (!s) setSweeping(false);
      paintCtx();
      menu.refresh();
    },
    setOnline(n) { online = Math.max(1, n); paintRoom(); },
    notice,
    setStreak,
    setListening(on) {
      listening = on;
      listenBtn.setAttribute('aria-pressed', String(on));
    },
    setVisible(v) { el.style.display = v ? '' : 'none'; },
    destroy() {
      offStatus(); offCount(); offPlayers(); offSolo(); offAudio(); offRadio(); offProgress(); offLevelUp(); offPanel();
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onOutsideSound, true);
      window.clearTimeout(bannerTimer); window.clearTimeout(holdTimer);
      menu.destroy();
      el.remove();
    },
  };
  try {
    const v = ctx.progress.view();
    setLevel(v);
    setStreak(v.streak, v.litToday);
  } catch {
    setLevel({ level: 1, tier: TIERS[0], xp: 0, xpIntoLevel: 0, xpForNext: 50, frac: 0, streak: 0, best: 0, litToday: false, restDays: 0, tasks: [], tasksDone: 0, practiceToday: 0, practiceCap: 200, stamps: [] });
  }
  return api;
}
