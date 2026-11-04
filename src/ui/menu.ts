/**
 * Menu "Thêm": popover bật lên phía trên thanh công phu — nhóm Tu tập / Dâng lễ / Khám phá,
 * mục khoá theo cấp hiện mờ kèm dòng "Lên cấp N để mở…", submenu "Đi dạo ›".
 */
import type { ActionId, AppContext, PanelId, SpotId, UnlockFeature } from '@/core/contracts';
import { SPOTS, SPOT_ORDER } from '@/world/layout';
import { esc } from './dom';
import { icon, type IconName } from './icons';

interface Item {
  key: string;
  label: string;
  icon: IconName;
  feature?: UnlockFeature;
  run: () => void;
  /** Nhãn động (vd Ngồi xuống/Đứng dậy). */
  dyn?: () => { label: string; icon: IconName };
  accent?: boolean;
}

export const FEATURE_LABEL: Record<UnlockFeature, string> = {
  flowers: 'Dâng hoa', bell: 'Thỉnh chuông', candle: 'Thắp nến', lantern: 'Thả đèn hoa đăng', today: 'Hôm nay',
  dharma: 'Pháp thoại', wardrobe: 'Trang phục', walkMeditation: 'Thiền hành', que: 'Xin quẻ', release: 'Phóng sinh',
  loc: 'Hái lộc', friends: 'Bạn đạo',
};

/** Nếu hương / hoa / nến của người dùng vẫn còn trên bàn thờ thì báo ngay, khỏi đi bộ tới rồi mới báo. */
export function offeringBusyMsg(ctx: AppContext, a: string): string | null {
  try {
    const o = ctx.offerings();
    const now = Date.now();
    if (a === 'incense' && o.incenseUntil > now) {
      const mins = Math.max(1, Math.ceil((o.incenseUntil - now) / 60_000));
      return `Hương của bạn còn cháy ${mins} phút, khi tàn bạn thắp nén mới nhé.`;
    }
    if (a === 'flowers' && o.flowersUntil > now) return 'Hoa của bạn vẫn còn tươi trên bàn thờ.';
    if (a === 'candle' && o.candleUntil > now) return 'Nến của bạn vẫn đang cháy sáng.';
  } catch { /* bỏ qua nếu chưa sẵn sàng */ }
  return null;
}

const SPOT_ICON: Record<SpotId, IconName> = { yard: 'lotus', bodhi: 'tree', meditate: 'meditate', quanam: 'sparkle', well: 'pin', hall: 'home' };

export interface MoreMenu {
  el: HTMLElement;
  isOpen(): boolean;
  open(): void;
  close(): void;
  toggle(): void;
  refresh(): void;
  destroy(): void;
}

export function createMoreMenu(ctx: AppContext, host: HTMLElement, opts: { onToggle?: (open: boolean) => void; anchor?: HTMLElement }): MoreMenu {
  const el = document.createElement('div');
  el.className = 'more glass glass--strong';
  el.id = 'hud-more';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Thêm');
  el.inert = true;
  host.append(el);

  const panel = (id: PanelId) => () => void ctx.openPanel(id);
  const perform = (a: ActionId) => () => {
    const busy = offeringBusyMsg(ctx, a);
    if (busy) { ctx.toast(busy); return; }
    void ctx.world.perform(a);
  };
  const seatToggle = () => {
    if (ctx.world.isSeated()) ctx.world.standUp();
    else if (!ctx.world.sit('sit')) ctx.toast('Chưa còn bồ đoàn trống, bạn đợi một chút nhé.');
  };

  const groups: { title: string; items: Item[] }[] = [
    {
      title: 'Tu tập',
      items: [
        { key: 'chant', label: 'Tụng kinh', icon: 'book', run: panel('chant') },
        { key: 'meditate', label: 'Thiền', icon: 'meditate', run: panel('meditate') },
        {
          key: 'sit', label: 'Ngồi xuống', icon: 'cushion', run: seatToggle,
          dyn: () => (ctx.world.isSeated() ? { label: 'Đứng dậy', icon: 'user' } : { label: 'Ngồi xuống', icon: 'cushion' }),
        },
        { key: 'listen', label: 'Nghe niệm Phật', icon: 'headphones', run: panel('listen') },
      ],
    },
    {
      title: 'Dâng lễ',
      items: [
        { key: 'incense', label: 'Thắp hương', icon: 'incense', run: perform('incense') },
        { key: 'flowers', label: 'Dâng hoa', icon: 'flower', feature: 'flowers', run: perform('flowers') },
        { key: 'bell', label: 'Thỉnh chuông', icon: 'bell', feature: 'bell', run: perform('bell') },
        { key: 'candle', label: 'Thắp nến', icon: 'candle', feature: 'candle', run: perform('candle') },
        { key: 'lantern', label: 'Thả đèn hoa đăng', icon: 'lantern', feature: 'lantern', run: panel('lantern') },
        { key: 'release', label: 'Phóng sinh', icon: 'fish', feature: 'release', run: perform('release') },
        { key: 'loc', label: 'Hái lộc', icon: 'leaf', feature: 'loc', run: perform('loc') },
        { key: 'wish', label: 'Treo nguyện', icon: 'ribbon', run: panel('wish') },
      ],
    },
    {
      title: 'Khám phá',
      items: [
        { key: 'walk', label: 'Đi dạo ›', icon: 'footsteps', run: () => showWalk() },
        { key: 'today', label: 'Hôm nay', icon: 'calendar', feature: 'today', run: panel('today') },
        { key: 'dharma', label: 'Pháp thoại', icon: 'scroll', feature: 'dharma', run: panel('dharma') },
        { key: 'wardrobe', label: 'Trang phục', icon: 'hanger', feature: 'wardrobe', run: panel('wardrobe') },
        { key: 'walkMed', label: 'Thiền hành', icon: 'footsteps', feature: 'walkMeditation', run: panel('walkMeditation') },
        { key: 'que', label: 'Xin quẻ', icon: 'sticks', feature: 'que', run: panel('que') },
        { key: 'sayings', label: 'Lời chào', icon: 'hands', run: panel('sayings') },
        { key: 'journey', label: 'Hành trình', icon: 'sparkles', run: panel('journey') },
      ],
    },
  ];
  const foot: Item[] = [
    { key: 'friends', label: 'Bạn đạo', icon: 'users', feature: 'friends', run: panel('friends') },
    { key: 'feedback', label: 'Góp ý', icon: 'mail', run: panel('feedback') },
    { key: 'install', label: 'Cài ứng dụng', icon: 'download', run: panel('install') },
    { key: 'share', label: 'Khoe thành tích', icon: 'share', run: panel('share'), accent: true },
  ];

  const locked = (it: Item) => !!it.feature && !ctx.progress.isUnlocked(it.feature);

  function tile(it: Item): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile' + (it.accent ? ' tile--accent' : '');
    const d = it.dyn ? it.dyn() : { label: it.label, icon: it.icon };
    const lk = locked(it);
    if (lk) {
      b.classList.add('is-locked');
      b.setAttribute('aria-disabled', 'true');
    }
    b.innerHTML = `${icon(d.icon, { size: 26 })}<span>${esc(d.label)}</span>${lk ? `<span class="tile__lock">${icon('lock', { size: 13 })}</span>` : ''}`;
    b.addEventListener('click', () => {
      if (lk && it.feature) {
        ctx.toast(`Lên cấp ${ctx.progress.unlockLevel(it.feature)} để mở ${FEATURE_LABEL[it.feature]}.`);
        return;
      }
      if (it.key !== 'walk') close();
      it.run();
    });
    return b;
  }

  function lockNote(): HTMLElement | null {
    const byLevel = new Map<number, string[]>();
    for (const it of [...groups.flatMap((g) => g.items), ...foot]) {
      if (it.feature && locked(it)) {
        const lv = ctx.progress.unlockLevel(it.feature);
        byLevel.set(lv, [...(byLevel.get(lv) ?? []), FEATURE_LABEL[it.feature]]);
      }
    }
    if (!byLevel.size) return null;
    const box = document.createElement('div');
    box.className = 'more__locks';
    const [lv, names] = [...byLevel.entries()].sort((a, b) => a[0] - b[0])[0];
    const more = byLevel.size - 1;
    box.innerHTML = `<div>${icon('lock', { size: 14 })}Lên <b>cấp ${lv}</b> để mở: ${esc(names.join(', '))}</div>` + (more > 0 ? `<div class="more__locks-sub">Còn nhiều mục khác sẽ mở dần theo cấp — chạm vào mục mờ để xem cấp cần thiết.</div>` : '');
    return box;
  }

  function renderMain(): void {
    el.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'more__view';
    for (const g of groups) {
      const sec = document.createElement('section');
      sec.className = 'more__sec';
      sec.innerHTML = `<h3 class="more__title">${esc(g.title)}</h3>`;
      const grid = document.createElement('div');
      grid.className = 'more__grid';
      for (const it of g.items) grid.append(tile(it));
      sec.append(grid);
      wrap.append(sec);
    }
    const note = lockNote();
    if (note) wrap.append(note);
    const f = document.createElement('div');
    f.className = 'more__foot';
    for (const it of foot) f.append(tile(it));
    wrap.append(f);
    el.append(wrap);
  }

  function showWalk(): void {
    el.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'more__view';
    const head = document.createElement('div');
    head.className = 'more__walk-head';
    head.innerHTML = `<button type="button" class="more__back">${icon('chevron-left', { size: 20 })}Đi dạo</button><span class="more__walk-title">Chọn nơi muốn tới</span>`;
    head.querySelector('button')!.addEventListener('click', () => renderMain());
    wrap.append(head);
    const grid = document.createElement('div');
    grid.className = 'more__grid more__grid--3';
    for (const id of SPOT_ORDER) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tile';
      b.innerHTML = `${icon(SPOT_ICON[id], { size: 26 })}<span>${esc(SPOTS[id].name)}</span>`;
      b.addEventListener('click', () => {
        close();
        ctx.world.goTo(id);
        ctx.toast(`Đang đi tới ${SPOTS[id].name}…`);
      });
      grid.append(b);
    }
    wrap.append(grid);
    el.append(wrap);
    (el.querySelector('.more__back') as HTMLElement | null)?.focus();
  }

  let open_ = false;
  function open(): void {
    if (open_) return;
    renderMain();
    open_ = true;
    el.inert = false;
    el.classList.add('is-on');
    opts.onToggle?.(true);
    document.addEventListener('pointerdown', onOutside, true);
  }
  function close(): void {
    if (!open_) return;
    open_ = false;
    el.classList.remove('is-on');
    el.inert = true;
    opts.onToggle?.(false);
    document.removeEventListener('pointerdown', onOutside, true);
  }
  function onOutside(e: Event): void {
    const t = e.target as Node;
    if (el.contains(t) || opts.anchor?.contains(t)) return;
    close();
  }
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && open_) {
      close();
      opts.anchor?.focus();
    }
  };
  document.addEventListener('keydown', onKey);

  return {
    el,
    isOpen: () => open_,
    open,
    close,
    toggle: () => (open_ ? close() : open()),
    refresh: () => { if (open_) renderMain(); },
    destroy() {
      close();
      document.removeEventListener('keydown', onKey);
      el.remove();
    },
  };
}
