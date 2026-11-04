/**
 * Panel host: mở panel dạng 'view' (toàn khung, nút "Quay lại chùa") hoặc 'dialog' (hộp thoại nổi).
 * Có chồng lớp (dialog mở trên view), chuyển cảnh mượt, focus trap, trả focus, phím Esc, nút Back của trình duyệt,
 * khoá điều khiển thế giới khi đang mở, phát `bus.emit('panel')`.
 */
import type { AppContext, PanelDef, PanelId } from '@/core/contracts';
import { icon } from './icons';
import { focusables } from './dom';

export interface PanelHost {
  open(id: PanelId, params?: Record<string, unknown>): Promise<void>;
  /** Đóng lớp trên cùng. */
  close(): void;
  closeAll(): void;
  current(): PanelId | null;
}

const NAMES: Record<PanelId, string> = {
  journey: 'Hành trình', rank: 'Bảng xếp hạng', beads: 'Tràng hạt', chant: 'Tụng kinh', meditate: 'Thiền', dharma: 'Pháp thoại',
  today: 'Hôm nay', wardrobe: 'Trang phục', lantern: 'Đèn hoa đăng', que: 'Xin quẻ', wish: 'Treo nguyện', rooms: 'Không gian chùa',
  settings: 'Cài đặt', feedback: 'Góp ý', account: 'Tài khoản', share: 'Khoe thành tích', friends: 'Bạn đạo', install: 'Cài ứng dụng',
  sayings: 'Lời chào', listen: 'Nghe niệm Phật', walkMeditation: 'Thiền hành',
};

interface Layer {
  id: PanelId;
  def: PanelDef;
  el: HTMLElement;
  root: HTMLElement;
  cleanup?: () => void;
  returnFocus: HTMLElement | null;
  closing: boolean;
}

export function createPanelHost(ctx: AppContext, loadPanel: (id: PanelId) => Promise<PanelDef>, mountEl?: HTMLElement): PanelHost {
  const parent = mountEl ?? document.getElementById('app') ?? document.body;
  const stack: Layer[] = [];
  const loading = new Set<PanelId>();
  let popGuard = false;
  let seq = 0;

  const top = () => stack.filter((l) => !l.closing).at(-1) ?? null;
  const announce = () => {
    ctx.world.setInputEnabled(stack.filter((l) => !l.closing).length === 0);
    ctx.bus.emit('panel', { id: top()?.id ?? null });
  };

  function build(def: PanelDef, id: PanelId): Layer {
    const el = document.createElement('div');
    let root: HTMLElement;
    if (def.kind === 'view') {
      el.className = 'panel-host';
      el.dataset.panel = id;
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', def.title);
      el.innerHTML = `<div class="panel-host__scrim"></div><div class="panel-host__body"><div class="panel-host__top"><button type="button" class="panel__back">${icon('chevron-left', { size: 20 })}<span>Quay lại chùa</span></button></div><div class="panel-root"></div></div>`;
      root = el.querySelector('.panel-root') as HTMLElement;
      (el.querySelector('.panel__back') as HTMLElement).addEventListener('click', () => close());
      const body = el.querySelector('.panel-host__body') as HTMLElement;
      body.addEventListener('click', (e) => { if (e.target === body) close(); });
    } else {
      el.className = 'dialog-scrim';
      el.dataset.panel = id;
      el.innerHTML = `<div class="dialog-card panel-root" role="dialog" aria-modal="true" aria-label="${def.title.replace(/"/g, '&quot;')}" tabindex="-1"></div>`;
      root = el.querySelector('.dialog-card') as HTMLElement;
      el.addEventListener('pointerdown', (e) => { if (e.target === el) el.dataset.press = '1'; else delete el.dataset.press; });
      el.addEventListener('click', (e) => { if (e.target === el && el.dataset.press) close(); });
    }
    return { id, def, el, root, returnFocus: document.activeElement as HTMLElement | null, closing: false };
  }

  async function open(id: PanelId, params?: Record<string, unknown>): Promise<void> {
    if (loading.has(id) || top()?.id === id) return;
    loading.add(id);
    const mySeq = ++seq;
    let def: PanelDef;
    try {
      def = await loadPanel(id);
    } catch (err) {
      console.error('[panel] không nạp được', id, err);
      loading.delete(id);
      ctx.toast(`Chưa mở được ${NAMES[id] ?? 'mục này'}, bạn thử lại nhé.`, { kind: 'warn' });
      return;
    }
    loading.delete(id);
    if (mySeq !== seq && top()?.id === id) return;

    // Quy tắc chồng lớp: view thay thế mọi lớp; dialog thay dialog trên cùng, đè lên view.
    if (def.kind === 'view') for (const l of [...stack]) dispose(l, true);
    else if (top()?.def.kind === 'dialog') dispose(top()!, true);

    const layer = build(def, id);
    parent.append(layer.el);
    stack.push(layer);
    const below = stack.filter((l) => l !== layer && !l.closing).at(-1);
    if (below) below.el.setAttribute('inert', '');
    announce();
    if (stack.length === 1 && !popGuard && !history.state?.panel) history.pushState({ panel: id }, '');

    try {
      const res = await def.mount(layer.root, ctx, params);
      if (typeof res === 'function') layer.cleanup = res;
      if (layer.closing) layer.cleanup?.();
    } catch (err) {
      console.error('[panel] lỗi khi dựng', id, err);
      dispose(layer, true);
      announce();
      ctx.toast(`Chưa mở được ${NAMES[id] ?? 'mục này'}, bạn thử lại nhé.`, { kind: 'warn' });
      return;
    }
    requestAnimationFrame(() => layer.el.classList.add('is-in'));
    // Đưa focus vào lớp mới.
    window.setTimeout(() => {
      if (layer.closing) return;
      const target = layer.def.kind === 'dialog' ? layer.root : (layer.el.querySelector('.panel__back') as HTMLElement);
      const first = focusables(layer.root)[0];
      (layer.def.kind === 'dialog' ? first ?? target : target)?.focus({ preventScroll: true });
    }, 60);
  }

  function dispose(l: Layer, instant = false): void {
    if (l.closing) return;
    l.closing = true;
    try { l.cleanup?.(); } catch (e) { console.error('[panel] cleanup', e); }
    const i = stack.indexOf(l);
    l.el.classList.remove('is-in');
    l.el.classList.add('is-out');
    const finish = () => {
      l.el.remove();
      if (i >= 0) stack.splice(stack.indexOf(l), 1);
    };
    if (instant) finish();
    else window.setTimeout(finish, 240);
    if (!instant) {
      const prev = stack.filter((x) => x !== l && !x.closing).at(-1);
      prev?.el.removeAttribute('inert');
    }
  }

  function close(): void {
    const l = top();
    if (!l) return;
    dispose(l);
    const prev = top();
    prev?.el.removeAttribute('inert');
    announce();
    // Trả focus
    window.setTimeout(() => {
      const target = prev ? focusables(prev.root)[0] ?? prev.root : l.returnFocus;
      if (l.returnFocus && document.contains(l.returnFocus) && !prev) l.returnFocus.focus({ preventScroll: true });
      else if (prev) target?.focus({ preventScroll: true });
    }, 20);
    // Đồng bộ history
    if (!prev && history.state?.panel && !popGuard) {
      popGuard = true;
      history.back();
      window.setTimeout(() => { popGuard = false; }, 80);
    }
  }

  function closeAll(): void {
    for (const l of [...stack]) dispose(l, false);
    announce();
  }

  const onKey = (e: KeyboardEvent): void => {
    const l = top();
    if (!l) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusables(l.el);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && (active === first || !l.el.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !l.el.contains(active))) { e.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', onKey, true);

  const onPop = (): void => {
    if (popGuard) return;
    if (top()) {
      popGuard = true;
      closeAll();
      window.setTimeout(() => { popGuard = false; }, 80);
    }
  };
  window.addEventListener('popstate', onPop);

  return {
    open,
    close,
    closeAll,
    current: () => top()?.id ?? null,
  };
}
