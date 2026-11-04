/**
 * Tiện ích DOM nhỏ dùng chung cho khung UI (U1): dựng phần tử, thoát HTML, định dạng số.
 */
type Child = Node | string | number | null | undefined | false;
type Attr = string | number | boolean | null | undefined | ((e: Event) => void);

/** Tạo phần tử: khoá "on…" là trình nghe sự kiện; "class", "text", "html" đặc biệt; còn lại là thuộc tính. */
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

/** Thoát ký tự đặc biệt khi chèn chuỗi vào HTML. */
export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

/** Xoá toàn bộ nội dung con. */
export function clear(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** 1234 → "1.234" (kiểu Việt Nam). */
export const fmt = (n: number): string => Math.round(n).toLocaleString('vi-VN');

/** Các phần tử có thể focus bên trong một vùng (cho focus trap). */
export function focusables(root: HTMLElement): HTMLElement[] {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  return [...root.querySelectorAll<HTMLElement>(sel)].filter((e) => !e.hidden && e.offsetParent !== null);
}

/** Phát hiện đang gõ vào ô nhập (để phím tắt không cướp phím). */
export function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable;
}

/** Sao chép văn bản vào clipboard (có dự phòng). */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = h('textarea', { style: 'position:fixed;opacity:0;left:-999px' });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
