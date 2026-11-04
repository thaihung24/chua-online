/**
 * Thông báo nhỏ (toast) hiện giữa dưới, dùng phần tử `.toast` của base.css.
 * Xếp hàng nhẹ: toast mới thay toast cũ, tự tắt sau `ms`.
 */
export type ToastKind = 'info' | 'good' | 'warn';

export function createToaster(el: HTMLElement): (text: string, opts?: { kind?: ToastKind; ms?: number }) => void {
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  let timer = 0;
  let swap = 0;
  return (text, opts = {}) => {
    const kind = opts.kind ?? 'info';
    const ms = opts.ms ?? Math.min(6000, 2400 + text.length * 35);
    window.clearTimeout(timer);
    window.clearTimeout(swap);
    const show = () => {
      el.textContent = text;
      el.classList.remove('toast--good', 'toast--warn');
      if (kind !== 'info') el.classList.add(`toast--${kind}`);
      el.classList.add('is-on');
      timer = window.setTimeout(() => el.classList.remove('is-on'), ms);
    };
    if (el.classList.contains('is-on')) {
      el.classList.remove('is-on');
      swap = window.setTimeout(show, 140);
    } else show();
  };
}
