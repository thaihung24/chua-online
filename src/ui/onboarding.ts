/**
 * Màn hình mở đầu: cổng chào (đăng nhập hoặc vào ngay) → chọn nhân vật (xem trước SVG 2D tức thì).
 * `run(existing)` resolve về Profile; với "Đổi nhân vật" (existing != null) có nút Huỷ và bỏ qua cổng chào.
 */
import { OUTFITS, OUTFIT_COLORS, type AppContext, type Gender, type OutfitId, type Profile } from '@/core/contracts';
import { normalizeName, randomName, validateName } from '@/core/profile';
import { characterSvg, outfitHex } from './character-preview';
import { esc } from './dom';
import { icon } from './icons';

export interface Onboarding { run(existing: Profile | null): Promise<Profile> }

const ORNAMENT = '<div class="divider-ornament" aria-hidden="true"><i></i></div>';

export function createOnboarding(ctx: AppContext): Onboarding {
  const rootEl = document.getElementById('onboarding-root') ?? (() => {
    const d = document.createElement('div');
    d.id = 'onboarding-root';
    document.body.append(d);
    return d;
  })();

  function run(existing: Profile | null): Promise<Profile> {
    return new Promise<Profile>((resolve) => {
      document.body.classList.add('is-onboarding');
      const wrap = document.createElement('div');
      wrap.className = 'ob';
      rootEl.append(wrap);
      requestAnimationFrame(() => wrap.classList.add('is-in'));

      let step: 'gate' | 'choose' = existing ? 'choose' : 'gate';
      const offAuth = ctx.bus.on('auth', (a) => {
        if (a.loggedIn && step === 'gate') chooser(ctx.profile);
      });

      const finish = (p: Profile): void => {
        offAuth();
        document.removeEventListener('keydown', onKey);
        wrap.classList.remove('is-in');
        wrap.classList.add('is-out');
        window.setTimeout(() => {
          wrap.remove();
          document.body.classList.remove('is-onboarding');
        }, 420);
        resolve(p);
      };

      const onKey = (e: KeyboardEvent): void => {
        if (e.key === 'Escape' && existing && !document.querySelector('.dialog-scrim, .panel-host')) finish(existing);
      };
      document.addEventListener('keydown', onKey);

      const showCard = (card: HTMLElement): void => {
        wrap.innerHTML = '';
        wrap.append(card);
        card.classList.add('ob-card--enter');
        (card.querySelector('[data-autofocus]') as HTMLElement | null)?.focus({ preventScroll: true });
      };

      // ───── Bước 1: cổng chào
      const gate = (): void => {
        const card = document.createElement('section');
        card.className = 'ob-card ob-card--gate';
        card.setAttribute('role', 'dialog');
        card.setAttribute('aria-labelledby', 'ob-gate-title');
        card.innerHTML = `
          <div class="ob-lotus" aria-hidden="true">${icon('lotus', { size: 44 })}</div>
          <h1 class="ob-title" id="ob-gate-title" tabindex="-1" data-autofocus>Chào mừng đến Chùa Rắn</h1>
          <p class="ob-lead">Đăng nhập để giữ nhân vật, cấp, nhiệm vụ và chuỗi giữ lửa trên mọi máy.</p>
          ${ORNAMENT}
          <div class="ob-actions">
            <button type="button" class="btn btn--gold btn--lg btn--block" data-act="login">${icon('mail', { size: 20 })}Đăng nhập bằng email</button>
            <p class="ob-note">Miễn phí · chỉ dùng để giữ nhân vật</p>
            <button type="button" class="ob-link" data-act="guest">Vào chùa không cần đăng nhập</button>
          </div>
          <p class="ob-terms">Khi đăng nhập, bạn đồng ý với <a href="/dieu-khoan-su-dung/" target="_blank" rel="noopener">Điều khoản</a> và <a href="/chinh-sach-quyen-rieng-tu/" target="_blank" rel="noopener">Chính sách quyền riêng tư</a>.</p>`;
        card.querySelector('[data-act="login"]')!.addEventListener('click', () => void ctx.openPanel('account'));
        card.querySelector('[data-act="guest"]')!.addEventListener('click', () => chooser());
        showCard(card);
      };

      // ───── Bước 2: chọn nhân vật
      const chooser = (prefill?: Profile | null): void => {
        step = 'choose';
        const base = existing ?? (prefill?.name ? prefill : null);
        const start: Profile = base ?? { name: randomName('male'), gender: 'male', outfit: 'trang-lam', colorIndex: 0 };
        const st: Profile = { ...start };
        let lastRandom = base ? '' : start.name;
        let touched = false;

        const card = document.createElement('section');
        card.className = 'ob-card ob-card--choose';
        card.setAttribute('role', 'dialog');
        card.setAttribute('aria-labelledby', 'ob-title');
        card.innerHTML = `
          <header class="ob-head">
            <h1 class="ob-title" id="ob-title" tabindex="-1" data-autofocus>${existing ? 'Đổi nhân vật' : 'Vào chùa'}</h1>
            <p class="ob-lead">${existing ? 'Chỉnh lại pháp danh, áo và màu theo ý bạn.' : 'Chọn nhanh một nhân vật rồi bước vào sân chùa.'}</p>
            ${ORNAMENT}
          </header>
          <div class="ob-body">
            <div class="ob-stage" aria-live="polite">
              <div class="ob-stage__fig"></div>
              <div class="ob-nametag"><span aria-hidden="true">◆</span><b></b><span aria-hidden="true">◆</span></div>
            </div>
            <form class="ob-form" novalidate>
              <div class="field">
                <label class="field__label" for="ob-name">Pháp danh</label>
                <div class="ob-name-row">
                  <input class="input" id="ob-name" maxlength="24" autocomplete="off" autocapitalize="words" spellcheck="false" value="${esc(st.name)}" />
                  <button type="button" class="ob-dice" aria-label="Gợi ý pháp danh khác" title="Gợi ý pháp danh khác">${icon('dice', { size: 22 })}</button>
                </div>
                <p class="field__hint" id="ob-hint">Tên lịch sự, không tục tĩu, không quảng cáo.</p>
              </div>
              <div class="field">
                <span class="field__label" id="ob-g-l">Giới tính</span>
                <div class="seg" role="radiogroup" aria-labelledby="ob-g-l">
                  <button type="button" class="seg__btn" role="radio" data-g="male">Nam</button>
                  <button type="button" class="seg__btn" role="radio" data-g="female">Nữ</button>
                </div>
              </div>
              <div class="field">
                <span class="field__label" id="ob-o-l">Kiểu áo</span>
                <div class="seg ob-seg-4" role="radiogroup" aria-labelledby="ob-o-l">
                  ${OUTFITS.map((o) => `<button type="button" class="seg__btn" role="radio" data-o="${o.id}">${esc(o.label)}</button>`).join('')}
                </div>
              </div>
              <div class="field">
                <span class="field__label" id="ob-c-l">Màu áo · <b class="ob-colorname"></b></span>
                <div class="ob-swatches" role="radiogroup" aria-labelledby="ob-c-l"></div>
              </div>
              <div class="ob-cta">
                <button type="submit" class="btn btn--gold btn--lg btn--block">Vào chùa</button>
                ${existing ? '<button type="button" class="btn btn--ghost btn--block" data-act="cancel">Huỷ</button>' : ''}
              </div>
              ${ctx.isLoggedIn() ? '' : `<p class="ob-foot">Muốn giữ nhân vật khi đổi máy? <button type="button" class="ob-link ob-link--inline" data-act="login">Đăng nhập bằng email</button></p>`}
            </form>
          </div>`;

        const q = <T extends HTMLElement>(s: string) => card.querySelector(s) as T;
        const input = q<HTMLInputElement>('#ob-name');
        const hint = q<HTMLElement>('#ob-hint');
        const fig = q<HTMLElement>('.ob-stage__fig');
        const tag = q<HTMLElement>('.ob-nametag b');
        const sw = q<HTMLElement>('.ob-swatches');
        const colorName = q<HTMLElement>('.ob-colorname');

        const paint = (pop = false): void => {
          fig.innerHTML = characterSvg({ ...st, name: st.name }, { size: 190 });
          if (pop) {
            fig.classList.remove('ob-pop');
            void fig.offsetWidth;
            fig.classList.add('ob-pop');
          }
          tag.textContent = st.name || '…';
          card.querySelectorAll<HTMLElement>('[data-g]').forEach((b) => {
            const on = b.dataset.g === st.gender;
            b.setAttribute('aria-checked', String(on));
            b.setAttribute('aria-pressed', String(on));
          });
          card.querySelectorAll<HTMLElement>('[data-o]').forEach((b) => {
            const on = b.dataset.o === st.outfit;
            b.setAttribute('aria-checked', String(on));
            b.setAttribute('aria-pressed', String(on));
          });
          const colors = OUTFIT_COLORS[st.outfit];
          colorName.textContent = colors[st.colorIndex]?.name ?? '';
          sw.innerHTML = colors
            .map(
              (c, i) =>
                `<button type="button" class="ob-swatch${i === st.colorIndex ? ' is-on' : ''}" role="radio" aria-checked="${i === st.colorIndex}" aria-label="${esc(c.name)}" data-c="${i}" style="--c:${c.hex};--c2:${outfitHex(st.outfit, i)}">${i === st.colorIndex ? icon('check', { size: 20 }) : ''}</button>`,
            )
            .join('');
        };

        const showErr = (): string | null => {
          const err = validateName(normalizeName(st.name));
          hint.textContent = err ?? 'Tên lịch sự, không tục tĩu, không quảng cáo.';
          hint.className = err ? 'field__error' : 'field__hint';
          input.setAttribute('aria-invalid', String(!!err));
          return err;
        };

        input.addEventListener('input', () => {
          st.name = input.value;
          touched = true;
          tag.textContent = st.name.trim() || '…';
          if (hint.className === 'field__error') showErr();
        });
        input.addEventListener('blur', () => { if (touched) showErr(); });
        q('.ob-dice').addEventListener('click', () => {
          lastRandom = randomName(st.gender);
          st.name = lastRandom;
          input.value = st.name;
          touched = false;
          showErr();
          paint(true);
        });
        card.addEventListener('click', (e) => {
          const t = e.target as HTMLElement;
          const g = t.closest<HTMLElement>('[data-g]');
          const o = t.closest<HTMLElement>('[data-o]');
          const c = t.closest<HTMLElement>('[data-c]');
          if (g) {
            st.gender = g.dataset.g as Gender;
            if (!touched && st.name === lastRandom) {
              lastRandom = randomName(st.gender);
              st.name = lastRandom;
              input.value = st.name;
            }
            paint(true);
          } else if (o) {
            st.outfit = o.dataset.o as OutfitId;
            st.colorIndex = Math.min(st.colorIndex, OUTFIT_COLORS[st.outfit].length - 1);
            paint(true);
          } else if (c) {
            st.colorIndex = Number(c.dataset.c);
            paint(true);
          } else if (t.closest('[data-act="login"]')) void ctx.openPanel('account');
          else if (t.closest('[data-act="cancel"]')) finish(existing!);
        });
        q<HTMLFormElement>('.ob-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const err = showErr();
          if (err) { input.focus(); return; }
          const out: Profile = { name: normalizeName(st.name), gender: st.gender, outfit: st.outfit, colorIndex: st.colorIndex };
          if (existing?.accessory) out.accessory = existing.accessory;
          ctx.audio.unlock();
          finish(out);
        });

        paint();
        showCard(card);
      };

      if (existing) chooser();
      else gate();
    });
  }

  return { run };
}
