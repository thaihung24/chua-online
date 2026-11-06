/**
 * Panel "Bạn đạo" (toàn khung): mã bạn đạo của mình, nhập mã để kết bạn, lời mời, danh sách bạn + trạng thái phòng + "Tới phòng".
 * Cần đăng nhập — nếu chưa thì hiện lời mời đăng nhập.
 */
import type { PanelDef } from '@/core/contracts';
import * as api from '@/net/api';
import { copyText, esc, h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { disposer, emptyState, skeleton, viewShell } from '@/ui/pm-kit';

export const panel: PanelDef = {
  id: 'friends',
  title: 'Bạn đạo',
  kind: 'view',
  mount(root, ctx) {
    const dis = disposer();
    const view = viewShell(root, 'Bạn đạo', 'Kết bạn bằng mã để biết khi nào bạn đạo đang cùng có mặt trong sân chùa.');
    const body = h('div', { class: 'stack fr-body', 'aria-live': 'polite' });
    view.append(body);
    let alive = true;
    let timer = 0;
    dis.add(() => { alive = false; window.clearInterval(timer); });

    function loginInvite(text?: string): void {
      body.replaceChildren(emptyState({
        icon: 'users',
        title: 'Đăng nhập để kết bạn đạo',
        text: text ?? 'Tài khoản giúp chùa nhớ bạn đạo của bạn và cho bạn thấy họ đang ở phòng nào.',
        action: { label: 'Đăng nhập tài khoản', onClick: () => void ctx.openPanel('account') },
      }));
    }

    const msg = h('p', { class: 'pm-msg', role: 'status' });
    const setMsg = (t: string, ok = false): void => { msg.className = 'pm-msg ' + (ok ? 'pm-msg--ok' : 'pm-msg--err'); msg.textContent = t; };

    function person(p: api.FriendBrief, extra: HTMLElement | null): HTMLElement {
      const row = h('div', { class: 'fr-row' });
      row.innerHTML = `<span class="fr-av">${icon('user', { size: 22 })}<i class="fr-dot ${p.online ? 'is-on' : ''}" aria-hidden="true"></i></span><span class="fr-main"><b>${esc(p.name)}</b><small>Cấp ${p.level} · ${p.online ? 'Đang cùng ở trong chùa' : 'Đang vắng'}</small></span>`;
      if (extra) row.append(extra);
      return row;
    }
    const btn = (label: string, cls: string, fn: () => void, ic?: Parameters<typeof icon>[0]): HTMLButtonElement =>
      h('button', { type: 'button', class: `btn btn--sm ${cls}`, html: `${ic ? icon(ic, { size: 16 }) : ''}${esc(label)}`, onclick: fn });

    async function act(fn: () => Promise<api.ApiResult<unknown>>, ok: string): Promise<void> {
      const r = await fn();
      if (!alive) return;
      if (!r.ok) { setMsg(r.error); return; }
      setMsg(ok, true);
      await load(true);
    }

    async function load(silent = false): Promise<void> {
      if (!silent) body.replaceChildren(skeleton(4));
      const [me, pres] = await Promise.all([api.friends.me(), api.friends.presence()]);
      if (!alive) return;
      if (!me.ok) {
        if (!ctx.isLoggedIn() || /đăng nhập/i.test(me.error)) loginInvite();
        else body.replaceChildren(emptyState({ icon: 'wifi', title: 'Chưa tải được danh sách', text: me.error, action: { label: 'Thử lại', onClick: () => void load() } }));
        return;
      }
      const presence = new Map<string, api.FriendPresence>();
      if (pres.ok) for (const p of pres.data.friends ?? []) presence.set(p.code, p);
      const d = me.data;

      const codeBox = h('div', { class: 'fr-code card card--glow' });
      codeBox.innerHTML = `<span class="fr-code__label">Mã bạn đạo của bạn</span><b class="fr-code__val" aria-label="Mã ${esc(d.code.split('').join(' '))}">${esc(d.code)}</b>`;
      const copy = btn('Sao chép mã', 'btn--ghost', async () => {
        const ok = await copyText(d.code);
        copy.innerHTML = `${icon('check', { size: 16 })}${ok ? 'Đã chép' : 'Chép thủ công'}`;
        window.setTimeout(() => { copy.innerHTML = `${icon('copy', { size: 16 })}Sao chép mã`; }, 1800);
      }, 'copy');
      codeBox.append(copy);

      const input = h('input', { class: 'input fr-input', id: 'fr-code', maxlength: 8, autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'Nhập mã của bạn đạo', 'aria-label': 'Mã bạn đạo cần thêm' });
      const add = h('form', { class: 'fr-add', novalidate: '' }, [input, h('button', { type: 'submit', class: 'btn btn--gold', text: 'Kết bạn' })]);
      add.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = input.value.trim().toUpperCase();
        if (c.length < 4) { setMsg('Bạn nhập đủ mã bạn đạo nhé.'); input.focus(); return; }
        if (c === d.code) { setMsg('Đây là mã của chính bạn mà.'); return; }
        void (async () => {
          const r = await api.friends.invite(c);
          if (!alive) return;
          if (!r.ok) { setMsg(r.error); return; }
          input.value = '';
          setMsg(r.data.status === 'friends' ? 'Đã kết bạn!' : 'Đã gửi lời mời kết bạn.', true);
          await load(true);
        })();
      });

      const sections: HTMLElement[] = [codeBox, h('div', { class: 'field' }, [h('span', { class: 'field__label', text: 'Thêm bạn đạo bằng mã' }), add]), msg];

      if (d.incoming?.length) {
        sections.push(h('section', {}, [
          h('h2', { class: 'pm-sec__title', text: `Lời mời đến (${d.incoming.length})` }),
          h('div', { class: 'pm-list fr-list' }, d.incoming.map((p) => person(p, h('div', { class: 'fr-acts' }, [
            btn('Nhận lời', 'btn--gold', () => void act(() => api.friends.accept(p.code), `Đã kết bạn với ${p.name}.`)),
            btn('Từ chối', 'btn--ghost', () => void act(() => api.friends.remove(p.code), 'Đã từ chối lời mời.')),
          ])))),
        ]));
      }

      const fl = h('div', { class: 'pm-list fr-list' });
      if (d.friends?.length) {
        const sorted = [...d.friends].sort((a, b) => Number(presence.get(b.code)?.online ?? b.online) - Number(presence.get(a.code)?.online ?? a.online));
        for (const p of sorted) {
          const pr = presence.get(p.code);
          const online = pr?.online ?? p.online;
          const acts = h('div', { class: 'fr-acts' });
          const renderActs = (): void => {
            acts.replaceChildren();
            acts.append(h('button', {
              type: 'button', class: 'fr-more', 'aria-label': `Xoá ${p.name} khỏi bạn đạo`, title: 'Xoá khỏi bạn đạo', html: icon('trash', { size: 18 }),
              onclick: () => {
                acts.replaceChildren(
                  btn('Xoá', 'btn--danger', () => void act(() => api.friends.remove(p.code), 'Đã xoá khỏi bạn đạo.')),
                  btn('Không', 'btn--ghost', renderActs),
                );
              },
            }));
          };
          renderActs();
          fl.append(person({ ...p, online }, acts));
        }
      } else fl.append(emptyState({ icon: 'users', title: 'Chưa có bạn đạo', text: 'Chia sẻ mã của bạn hoặc nhập mã bạn bè để bắt đầu.' }));
      sections.push(h('section', {}, [h('h2', { class: 'pm-sec__title', text: `Bạn đạo (${d.friends?.length ?? 0})` }), fl]));

      if (d.outgoing?.length) {
        sections.push(h('section', {}, [
          h('h2', { class: 'pm-sec__title', text: 'Đã gửi lời mời' }),
          h('div', { class: 'pm-list fr-list' }, d.outgoing.map((p) => person(p, h('div', { class: 'fr-acts' }, [h('span', { class: 'pm-pill', text: 'Đang chờ' }), btn('Huỷ', 'btn--ghost', () => void act(() => api.friends.remove(p.code), 'Đã huỷ lời mời.'))])))),
        ]));
      }
      body.replaceChildren(...sections);
    }

    void load();
    timer = window.setInterval(() => { if (document.visibilityState === 'visible' && body.querySelector('.fr-code')) void load(true); }, 25_000);
    dis.add(ctx.bus.on('auth', (a) => { if (a.loggedIn) void load(); else loginInvite(); }));
    return dis.run;
  },
};
