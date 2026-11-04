/**
 * Panel "Góp ý" (hộp thoại): loại (Góp ý / Báo lỗi / Khác), nội dung ≤ 1000, email tuỳ chọn; gửi qua @/net/api.feedback.
 */
import type { PanelDef } from '@/core/contracts';
import * as api from '@/net/api';
import { h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { APP_VERSION, dialogHead } from '@/ui/pm-kit';

const KINDS = [
  { id: 'gop-y', label: 'Góp ý', ph: 'Bạn muốn chùa thêm hay chỉnh điều gì? Mình luôn lắng nghe…' },
  { id: 'bao-loi', label: 'Báo lỗi', ph: 'Bạn gặp lỗi gì, ở đâu, trên máy nào? Càng rõ càng dễ sửa ạ.' },
  { id: 'khac', label: 'Khác', ph: 'Bạn muốn nhắn gì cho chùa?' },
] as const;
const MAX = 1000;

export const panel: PanelDef = {
  id: 'feedback',
  title: 'Góp ý',
  kind: 'dialog',
  mount(root, ctx) {
    let kind: (typeof KINDS)[number]['id'] = 'gop-y';
    const close = (): void => ctx.closePanel();

    const seg = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Loại góp ý' }, KINDS.map((k) => h('button', { type: 'button', class: 'seg__btn', role: 'radio', 'data-k': k.id, text: k.label })));
    const ta = h('textarea', { class: 'textarea', id: 'fb-msg', maxlength: MAX, rows: 5, 'aria-describedby': 'fb-count' });
    const count = h('span', { class: 'field__hint', id: 'fb-count', text: `0/${MAX}` });
    const email = h('input', { class: 'input', id: 'fb-mail', type: 'email', inputmode: 'email', autocomplete: 'email', placeholder: 'ban@example.com', spellcheck: 'false' });
    const msg = h('p', { class: 'pm-msg', role: 'alert' });
    const send = h('button', { type: 'submit', class: 'btn btn--gold btn--block', text: 'Gửi' });
    const form = h('form', { class: 'stack', novalidate: '' }, [
      h('div', { class: 'field' }, [h('span', { class: 'field__label', text: 'Bạn muốn gửi' }), seg]),
      h('div', { class: 'field' }, [h('label', { class: 'field__label', for: 'fb-msg', text: 'Nội dung' }), ta, h('div', { class: 'row row--between' }, [h('span', { class: 'field__hint', text: 'Tối đa 1000 ký tự' }), count])]),
      h('div', { class: 'field' }, [h('label', { class: 'field__label', for: 'fb-mail', text: 'Email (không bắt buộc)' }), email, h('span', { class: 'field__hint', text: 'Chỉ để chùa trả lời bạn khi cần.' })]),
      msg,
      send,
    ]);
    root.append(dialogHead('Góp ý · Báo lỗi', 'Mỗi lời nhắn của bạn giúp chùa tròn đầy hơn.', close), form);

    const paint = (): void => {
      seg.querySelectorAll<HTMLElement>('[data-k]').forEach((b) => {
        const on = b.dataset.k === kind;
        b.setAttribute('aria-checked', String(on));
        b.setAttribute('aria-pressed', String(on));
      });
      ta.placeholder = KINDS.find((k) => k.id === kind)!.ph;
    };
    seg.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-k]');
      if (b) { kind = b.dataset.k as typeof kind; paint(); }
    });
    ta.addEventListener('input', () => { count.textContent = `${ta.value.length}/${MAX}`; if (msg.textContent) msg.textContent = ''; });
    paint();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      const mail = email.value.trim();
      msg.className = 'pm-msg pm-msg--err';
      if (text.length < 5) { msg.textContent = 'Bạn viết thêm một chút nội dung nhé.'; ta.focus(); return; }
      if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { msg.textContent = 'Email chưa đúng định dạng, bạn kiểm tra lại nhé.'; email.focus(); return; }
      send.disabled = true;
      send.textContent = 'Đang gửi…';
      const r = await api.feedback({ kind, message: text, email: mail || undefined, ua: navigator.userAgent.slice(0, 200), version: APP_VERSION });
      if (!r.ok) {
        send.disabled = false;
        send.textContent = 'Gửi';
        msg.textContent = r.error;
        return;
      }
      root.replaceChildren(
        h('div', { class: 'pm-done' }, [
          h('div', { class: 'pm-done__ic', html: icon('heart', { size: 34 }) }),
          h('h2', { class: 'pm-title', text: 'Cảm ơn bạn' }),
          h('p', { class: 'pm-lead', text: 'Lời nhắn đã được gửi tới chùa. Chúc bạn một ngày an lạc.' }),
          h('button', { type: 'button', class: 'btn btn--gold', text: 'Đóng', onclick: close }),
        ]),
      );
      ctx.toast('Đã gửi góp ý. Xin cảm ơn bạn.', { kind: 'good' });
    });
  },
};
