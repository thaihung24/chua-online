/**
 * Màn hình chờ (boot splash) trong index.html: thanh tiến trình `#bootFill`, dòng trạng thái `#bootStatus`.
 * Tiến trình chỉ đi tới (không tụt), mờ dần khi `hide()`.
 */
export interface Boot {
  set(progress: number, status?: string): void;
  hide(): void;
  show(): void;
}

export function createBoot(): Boot {
  const el = document.getElementById('boot');
  const fill = document.getElementById('bootFill');
  const status = document.getElementById('bootStatus');
  let cur = 0;
  let hideTimer = 0;

  return {
    set(p, text) {
      if (!el) return;
      cur = Math.max(cur, Math.max(0, Math.min(1, p)));
      if (fill) fill.style.transform = `scaleX(${cur})`;
      if (status && text) status.textContent = text;
      el.setAttribute('aria-busy', 'true');
    },
    hide() {
      if (!el) return;
      if (fill) fill.style.transform = 'scaleX(1)';
      el.classList.add('is-hidden');
      el.setAttribute('aria-busy', 'false');
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => { el.hidden = true; }, 900);
    },
    show() {
      if (!el) return;
      window.clearTimeout(hideTimer);
      el.hidden = false;
      requestAnimationFrame(() => el.classList.remove('is-hidden'));
    },
  };
}
