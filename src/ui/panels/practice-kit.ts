/**
 * Bộ tiện ích dùng chung cho các panel thực hành (U2): dựng DOM gọn, dọn dẹp tài nguyên,
 * rung nhẹ, định dạng thời gian, giữ màn hình sáng, tiêu đề hộp thoại.
 * Mỗi panel import file này; CSS riêng nằm ở src/styles/practice.css (được nạp tại đây).
 */
import '@/styles/practice.css';
import { icon } from '@/ui/icons';
import { vnDayKey } from '@/core/store';
import type { PanelId } from '@/core/contracts';

type Child = Node | string | number | null | undefined | false;
type Attr = string | number | boolean | null | undefined | ((e: Event) => void);

/** Tạo phần tử DOM: khoá bắt đầu bằng "on" là trình nghe sự kiện, "class"/"text"/"html" đặc biệt, còn lại là thuộc tính. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, Attr> = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = String(v);
    else if (k === 'text') el.textContent = String(v);
    else if (k === 'html') el.innerHTML = String(v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : String(c));
  }
  return el;
}

/** Dọn dẹp tập trung: gom listener/timer/raf để huỷ cùng lúc khi panel đóng. */
export interface Scope {
  on<T extends EventTarget>(target: T, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions): void;
  interval(fn: () => void, ms: number): number;
  timeout(fn: () => void, ms: number): number;
  clearTimeout(id: number): void;
  clearInterval(id: number): void;
  add(fn: () => void): void;
  dispose(): void;
}
export function createScope(): Scope {
  const fns: (() => void)[] = [];
  const timeouts = new Set<number>();
  const intervals = new Set<number>();
  let dead = false;
  return {
    on(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      fns.push(() => target.removeEventListener(type, fn, opts));
    },
    interval(fn, ms) {
      const id = window.setInterval(fn, ms);
      intervals.add(id);
      return id;
    },
    timeout(fn, ms) {
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        if (!dead) fn();
      }, ms);
      timeouts.add(id);
      return id;
    },
    clearTimeout(id) { window.clearTimeout(id); timeouts.delete(id); },
    clearInterval(id) { window.clearInterval(id); intervals.delete(id); },
    add(fn) { fns.push(fn); },
    dispose() {
      dead = true;
      timeouts.forEach((i) => window.clearTimeout(i));
      intervals.forEach((i) => window.clearInterval(i));
      timeouts.clear(); intervals.clear();
      for (const f of fns.splice(0)) { try { f(); } catch { /* bỏ qua */ } }
    },
  };
}

export const haptic = (ms: number | number[] = 8): void => { try { navigator.vibrate?.(ms); } catch { /* bỏ qua */ } };
export const reducedMotion = (): boolean => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
export const today = (): string => vnDayKey();
export const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

/** mm:ss (hoặc h:mm:ss khi ≥ 1 giờ). */
export function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const p = (n: number): string => String(n).padStart(2, '0');
  return hh > 0 ? `${hh}:${p(mm)}:${p(ss)}` : `${p(mm)}:${p(ss)}`;
}
/** "12 phút 30 giây" kiểu đọc được. */
export function fmtDuration(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m === 0) return `${r} giây`;
  return r === 0 ? `${m} phút` : `${m} phút ${r} giây`;
}

/** Giữ màn hình sáng khi thiền/thiền hành (nếu trình duyệt hỗ trợ). Trả hàm nhả. */
export function holdAwake(): () => void {
  let lock: { release(): Promise<void> } | null = null;
  let want = true;
  const wl = (navigator as unknown as { wakeLock?: { request(t: 'screen'): Promise<{ release(): Promise<void> }> } }).wakeLock;
  const acquire = (): void => {
    if (!wl || !want) return;
    wl.request('screen').then((l) => { if (want) lock = l; else void l.release(); }).catch(() => { /* không bắt buộc */ });
  };
  const onVis = (): void => { if (document.visibilityState === 'visible') acquire(); };
  acquire();
  document.addEventListener('visibilitychange', onVis);
  return () => {
    want = false;
    document.removeEventListener('visibilitychange', onVis);
    void lock?.release().catch(() => undefined);
    lock = null;
  };
}

/** Đầu hộp thoại: tiêu đề + nút đóng. */
export function dialogHead(title: string, onClose: () => void, lead?: string): HTMLElement {
  return h('header', { class: 'pk-head' }, [
    h('div', { class: 'pk-head__text' }, [
      h('h2', { class: 'pk-head__title', text: title }),
      lead ? h('p', { class: 'pk-head__lead', text: lead }) : null,
    ]),
    h('button', { type: 'button', class: 'pk-close', 'aria-label': 'Đóng', onclick: onClose, html: icon('close', { size: 20 }) }),
  ]);
}

/** Đầu màn hình toàn khung (kind 'view'). */
export function viewHead(title: string, lead?: string, ornament = true): HTMLElement {
  return h('header', { class: 'view__header pk-viewhead' }, [
    h('h1', { class: 'view__title', text: title }),
    lead ? h('p', { class: 'view__lead', text: lead }) : null,
    ornament ? h('div', { class: 'divider-ornament', 'aria-hidden': 'true' }, [h('i')]) : null,
  ]);
}

/** Vùng thông báo cho trình đọc màn hình. */
export function liveRegion(): HTMLElement {
  return h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
}

/** Mã định danh ngắn ngẫu nhiên. */
export const uid = (p: string): string => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Các id panel để phân biệt hành động nhiệm vụ (panel / điểm đi dạo / hành động). */
export const PANEL_IDS: readonly PanelId[] = [
  'journey', 'rank', 'beads', 'chant', 'meditate', 'dharma', 'today', 'wardrobe', 'lantern', 'que', 'wish', 'rooms',
  'settings', 'feedback', 'account', 'share', 'friends', 'install', 'sayings', 'listen', 'walkMeditation',
];

/** Băm chuỗi → số nguyên không âm (cho seed quẻ…). */
export function hashStr(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
  return x >>> 0;
}

/** Xếp hạng giờ lễ: "Thứ Hai"… từ chỉ số 0 (Chủ nhật) – 6. */
export const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
