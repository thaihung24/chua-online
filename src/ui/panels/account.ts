/**
 * Panel "Tài khoản" (hộp thoại): đăng nhập 1 chạm bằng Google + đăng nhập / đăng ký bằng email & mật khẩu,
 * trạng thái đã đăng nhập, đồng bộ ngay và đăng xuất.
 */
import type { PanelDef } from '@/core/contracts';
import * as api from '@/net/api';
import { characterSvg } from '@/ui/character-preview';
import { h } from '@/ui/dom';
import { GOOGLE_LOGO_SVG, getCachedGoogleClientId, prepareGoogleAuth, requestGoogleAccessToken } from '@/ui/google-auth';
import { icon } from '@/ui/icons';
import { dialogHead, skeleton } from '@/ui/pm-kit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const panel: PanelDef = {
  id: 'account',
  title: 'Tài khoản',
  kind: 'dialog',
  mount(root, ctx) {
    let alive = true;
    const close = (): void => ctx.closePanel();
    const head = dialogHead('Tài khoản', 'Giữ nhân vật, cấp và chuỗi giữ lửa trên mọi thiết bị.', close);
    const body = h('div', { class: 'acc-body' }, [skeleton(3)]);
    root.append(head, body);

    // Tải trước cấu hình + script Google ngay khi mở hộp thoại để giữ cử chỉ click đồng bộ trên Safari/iOS.
    void prepareGoogleAuth();

    function syncImmediately(): void {
      const v = ctx.progress.view();
      void api.progressSync.put(ctx.progress.exportState(), ctx.profile, { level: v.level, streak: v.streak });
    }

    function loggedInView(user: api.AuthUser): void {
      const msg = h('p', { class: 'pm-msg', role: 'status' });
      const syncBtn = h('button', { type: 'button', class: 'btn btn--gold btn--block', html: `${icon('refresh', { size: 18 })}Đồng bộ ngay` });
      const outBtn = h('button', { type: 'button', class: 'btn btn--ghost btn--block', html: `${icon('logout', { size: 18 })}Đăng xuất` });
      syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        msg.className = 'pm-msg';
        msg.textContent = 'Đang đồng bộ…';
        const v = ctx.progress.view();
        const put = await api.progressSync.put(ctx.progress.exportState(), ctx.profile, { level: v.level, streak: v.streak });
        syncBtn.disabled = false;
        if (put.ok) {
          if (put.data.state) ctx.progress.importState(put.data.state);
          msg.className = 'pm-msg pm-msg--ok';
          msg.textContent = 'Đã đồng bộ.';
        } else {
          msg.className = 'pm-msg pm-msg--err';
          msg.textContent = put.error;
        }
      });
      outBtn.addEventListener('click', async () => {
        outBtn.disabled = true;
        const r = await api.auth.logout();
        if (!r.ok) { outBtn.disabled = false; msg.className = 'pm-msg pm-msg--err'; msg.textContent = r.error; return; }
        ctx.bus.emit('auth', { loggedIn: false });
        ctx.toast('Đã đăng xuất. Nhân vật vẫn còn trên máy này.');
        close();
      });
      const isGoogle = user.authProvider === 'google' || user.authProvider === 'both';
      const pillHtml = isGoogle
        ? `${GOOGLE_LOGO_SVG}Đã liên kết Google`
        : `${icon('check', { size: 13 })}Đã đăng nhập`;
      body.replaceChildren(
        h('div', { class: 'acc-me' }, [
          h('div', { class: 'acc-me__fig', html: characterSvg({ ...ctx.profile }, { size: 64, aura: false, shadow: false, breathe: false }) }),
          h('div', { class: 'acc-me__text' }, [h('b', { text: ctx.profile.name }), h('span', { text: user.email }), h('span', { class: 'pm-pill', html: pillHtml })]),
        ]),
        h('p', { class: 'pm-lead', text: 'Tiến độ của bạn được lưu trên máy chủ và tự đồng bộ khi bạn công phu.' }),
        h('div', { class: 'stack stack--sm' }, [syncBtn, outBtn]),
        msg,
      );
    }

    function formView(): void {
      let mode: 'login' | 'register' = 'login';
      const googleDefaultHtml = `<span class="btn-google__badge">${GOOGLE_LOGO_SVG}</span><span>Tiếp tục với Google</span>`;
      const googleBtn = h('button', {
        type: 'button',
        class: 'btn btn--google btn--block',
        id: 'acc-google-btn',
        html: googleDefaultHtml,
      });
      const divider = h('div', { class: 'acc-or', 'aria-hidden': 'true' }, [h('span', { text: 'hoặc dùng email' })]);

      const seg = h('div', { class: 'seg', role: 'tablist' }, [
        h('button', { type: 'button', class: 'seg__btn', role: 'tab', 'data-m': 'login', text: 'Đăng nhập' }),
        h('button', { type: 'button', class: 'seg__btn', role: 'tab', 'data-m': 'register', text: 'Đăng ký' }),
      ]);
      const email = h('input', { class: 'input', id: 'acc-mail', type: 'email', inputmode: 'email', autocomplete: 'email', autocapitalize: 'off', spellcheck: 'false', placeholder: 'ban@example.com' });
      const pw = h('input', { class: 'input', id: 'acc-pw', type: 'password', autocomplete: 'current-password', placeholder: 'Ít nhất 8 ký tự', minlength: 8 });
      const eye = h('button', { type: 'button', class: 'acc-eye', 'aria-label': 'Hiện mật khẩu', html: icon('eye', { size: 20 }) });
      const hint = h('span', { class: 'field__hint', id: 'acc-hint' });
      const msg = h('p', { class: 'pm-msg pm-msg--err', role: 'alert' });
      const submit = h('button', { type: 'submit', class: 'btn btn--gold btn--block' });
      const form = h('form', { class: 'stack', novalidate: '' }, [
        googleBtn,
        divider,
        seg,
        h('div', { class: 'field' }, [h('label', { class: 'field__label', for: 'acc-mail', text: 'Email' }), email]),
        h('div', { class: 'field' }, [h('label', { class: 'field__label', for: 'acc-pw', text: 'Mật khẩu' }), h('div', { class: 'acc-pw' }, [pw, eye]), hint]),
        msg,
        submit,
        h('p', { class: 'ob-terms', html: 'Miễn phí · chỉ dùng để giữ nhân vật và tiến độ. Khi đăng nhập, bạn đồng ý với <a href="/dieu-khoan-su-dung/" target="_blank" rel="noopener">Điều khoản</a> và <a href="/chinh-sach-quyen-rieng-tu/" target="_blank" rel="noopener">Chính sách quyền riêng tư</a>.' }),
      ]);

      const setBusy = (busy: boolean, googleText?: string): void => {
        googleBtn.disabled = busy;
        submit.disabled = busy;
        googleBtn.innerHTML = googleText
          ? `<span class="btn-google__badge">${GOOGLE_LOGO_SVG}</span><span>${googleText}</span>`
          : googleDefaultHtml;
      };

      const startGooglePopup = (clientId: string): void => {
        msg.textContent = '';
        setBusy(true, 'Đang mở đăng nhập Google…');
        requestGoogleAccessToken(clientId, async (tokRes) => {
          if (!alive) return;
          if (!tokRes.ok) {
            setBusy(false);
            if (!tokRes.cancelled) {
              msg.className = 'pm-msg pm-msg--err';
              msg.textContent = tokRes.error;
            }
            return;
          }
          setBusy(true, 'Đang xác thực tài khoản…');
          const r = await api.auth.google({ accessToken: tokRes.accessToken, profile: ctx.profile });
          if (!alive) return;
          setBusy(false);
          if (!r.ok) {
            msg.className = 'pm-msg pm-msg--err';
            msg.textContent = r.error;
            return;
          }
          if (!r.data.isNew && r.data.user?.profile?.name) {
            ctx.setProfile(r.data.user.profile);
          } else {
            syncImmediately();
          }
          ctx.bus.emit('auth', { loggedIn: true, email: r.data.user.email });
          ctx.toast(
            r.data.isNew
              ? 'Đã liên kết Google. Nhân vật và tiến độ của bạn sẽ được giữ lại.'
              : 'Đã đăng nhập bằng Google. Chào mừng bạn trở lại.',
            { kind: 'good' },
          );
          close();
        });
      };

      googleBtn.addEventListener('click', () => {
        const readyId = getCachedGoogleClientId();
        if (readyId && window.google?.accounts?.oauth2) {
          startGooglePopup(readyId);
          return;
        }
        setBusy(true, 'Đang chuẩn bị Google…');
        void prepareGoogleAuth().then((id) => {
          if (!alive) return;
          if (!id) {
            setBusy(false);
            msg.className = 'pm-msg pm-msg--err';
            msg.textContent = 'Máy chủ chưa gắn GOOGLE_CLIENT_ID. Bạn có thể đăng nhập bằng Email bên dưới nhé.';
            return;
          }
          startGooglePopup(id);
        });
      });

      const paint = (): void => {
        seg.querySelectorAll<HTMLElement>('[data-m]').forEach((b) => {
          const on = b.dataset.m === mode;
          b.setAttribute('aria-selected', String(on));
        });
        pw.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
        hint.textContent = mode === 'register' ? 'Mật khẩu từ 8 ký tự. Pháp danh và áo hiện tại sẽ được lưu cùng tài khoản.' : '';
        submit.textContent = mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản';
        msg.textContent = '';
      };
      seg.addEventListener('click', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>('[data-m]');
        if (b) { mode = b.dataset.m as typeof mode; paint(); }
      });
      eye.addEventListener('click', () => {
        const show = pw.type === 'password';
        pw.type = show ? 'text' : 'password';
        eye.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
        eye.innerHTML = icon(show ? 'lock' : 'eye', { size: 20 });
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const mail = email.value.trim();
        msg.className = 'pm-msg pm-msg--err';
        if (!EMAIL_RE.test(mail)) { msg.textContent = 'Email chưa đúng định dạng, bạn kiểm tra lại nhé.'; email.focus(); return; }
        if (pw.value.length < 8) { msg.textContent = 'Mật khẩu cần ít nhất 8 ký tự.'; pw.focus(); return; }
        setBusy(true);
        const label = submit.textContent;
        submit.textContent = 'Đang xử lý…';
        const r = mode === 'login' ? await api.auth.login(mail, pw.value) : await api.auth.register(mail, pw.value, ctx.profile);
        if (!alive) return;
        setBusy(false);
        submit.textContent = label;
        if (!r.ok) { msg.textContent = r.error; return; }
        if (mode === 'login' && r.data.user?.profile?.name) ctx.setProfile(r.data.user.profile);
        if (mode === 'register') syncImmediately();
        ctx.bus.emit('auth', { loggedIn: true, email: r.data.user?.email ?? mail });
        ctx.toast(mode === 'login' ? 'Đã đăng nhập. Chào mừng bạn trở lại.' : 'Đã tạo tài khoản. Nhân vật của bạn sẽ được giữ lại.', { kind: 'good' });
        close();
      });
      body.replaceChildren(form);
      paint();
    }

    void api.auth.me().then((r) => {
      if (!alive) return;
      if (r.ok && r.data.user) loggedInView(r.data.user);
      else if (!r.ok && ctx.isLoggedIn()) {
        body.replaceChildren(h('p', { class: 'pm-msg pm-msg--err', text: r.error }), h('button', { type: 'button', class: 'btn btn--ghost btn--sm', text: 'Thử lại', onclick: () => { body.replaceChildren(skeleton(3)); void api.auth.me().then((x) => { if (alive) x.ok && x.data.user ? loggedInView(x.data.user) : formView(); }); } }));
      } else formView();
      (root.querySelector('#acc-google-btn,input,button.btn') as HTMLElement | null)?.focus?.({ preventScroll: true });
    });
    return () => { alive = false; };
  },
};
