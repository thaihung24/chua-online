/**
 * Bộ dựng khung chung cho các panel hệ thống của U1 (tiêu đề hộp thoại / màn hình, trạng thái tải-rỗng-lỗi).
 */
import { esc, h } from './dom';
import { icon, type IconName } from './icons';

/** Đầu hộp thoại: tiêu đề + nút đóng. */
export function dialogHead(title: string, lead: string | undefined, onClose: () => void): HTMLElement {
  return h('header', { class: 'pm-head' }, [
    h('div', { class: 'pm-head__text' }, [
      h('h2', { class: 'pm-title', text: title }),
      lead ? h('p', { class: 'pm-lead', text: lead }) : null,
    ]),
    h('button', { type: 'button', class: 'pm-close', 'aria-label': 'Đóng', onclick: onClose, html: icon('close', { size: 20 }) }),
  ]);
}

/** Vỏ `.view` cho panel toàn khung; trả phần tử nội dung. */
export function viewShell(root: HTMLElement, title: string, lead?: string): HTMLElement {
  const view = h('div', { class: 'view' }, [
    h('header', { class: 'view__header' }, [
      h('h1', { class: 'view__title', text: title }),
      lead ? h('p', { class: 'view__lead', text: lead }) : null,
      h('div', { class: 'divider-ornament', 'aria-hidden': 'true' }, [h('i')]),
    ]),
  ]);
  root.append(view);
  return view;
}

/** Trạng thái rỗng / lỗi có icon, tiêu đề, mô tả và nút tuỳ chọn. */
export function emptyState(opts: { icon: IconName; title: string; text?: string; action?: { label: string; onClick: () => void } }): HTMLElement {
  const el = h('div', { class: 'pm-empty', role: 'status' });
  el.innerHTML = `${icon(opts.icon, { size: 40 })}<b>${esc(opts.title)}</b>${opts.text ? `<span>${esc(opts.text)}</span>` : ''}`;
  if (opts.action) el.append(h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: opts.action.onClick, text: opts.action.label }));
  return el;
}

/** Bộ khung xương khi đang tải. */
export function skeleton(rows = 4): HTMLElement {
  return h('div', { class: 'stack stack--sm', 'aria-busy': 'true', 'aria-label': 'Đang tải' }, Array.from({ length: rows }, () => h('div', { class: 'pm-skel' })));
}

/** Dọn dẹp tập trung. */
export function disposer(): { add(fn: () => void): void; run(): void } {
  const fns: (() => void)[] = [];
  return {
    add: (fn) => { fns.push(fn); },
    run: () => { for (const f of fns.splice(0)) try { f(); } catch { /* bỏ qua */ } },
  };
}

export const APP_VERSION = '1.0.0';
