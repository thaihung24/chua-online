/**
 * Panel "Bảng xếp hạng" (toàn khung): tab Cấp / Chuỗi giữ lửa, bục top 3, danh sách top 50, nổi bật hàng của mình,
 * trạng thái tải / rỗng / lỗi.
 */
import type { PanelDef } from '@/core/contracts';
import { TIERS } from '@/core/contracts';
import * as api from '@/net/api';
import { esc, fmt, h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { emptyState, skeleton, viewShell } from '@/ui/pm-kit';
import { tierIcon } from '@/ui/tier-icon';

type Kind = 'level' | 'streak';

export const panel: PanelDef = {
  id: 'rank',
  title: 'Bảng xếp hạng',
  kind: 'view',
  mount(root, ctx) {
    const view = viewShell(root, 'Bảng xếp hạng', 'Những người đang tinh tấn bền bỉ nhất. Chúc mọi người cùng tiến bước.');
    let kind: Kind = 'level';
    let seq = 0;
    let alive = true;
    const cache = new Map<Kind, api.RankRow[]>();

    const tabs = h('div', { class: 'seg rank-tabs', role: 'tablist', 'aria-label': 'Loại xếp hạng' }, [
      h('button', { type: 'button', class: 'seg__btn', role: 'tab', 'data-k': 'level', html: `${icon('lotus', { size: 16 })} Cấp` }),
      h('button', { type: 'button', class: 'seg__btn', role: 'tab', 'data-k': 'streak', html: `${icon('flame', { size: 16 })} Chuỗi giữ lửa` }),
    ]);
    const out = h('div', { class: 'rank-out', 'aria-live': 'polite' });
    view.append(tabs, out);

    const me = (): { name: string } => ({ name: ctx.profile.name });
    const metric = (r: api.RankRow): string => (kind === 'level' ? `Cấp ${fmt(r.level)}` : `${fmt(r.streak)} ngày`);
    const tierName = (r: api.RankRow): string => r.tierName ?? TIERS.find((t) => t.id === r.tier)?.name ?? '';

    function paintTabs(): void {
      tabs.querySelectorAll<HTMLElement>('[data-k]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.k === kind)));
    }

    function render(rows: api.RankRow[]): void {
      out.replaceChildren();
      if (!rows.length) {
        out.append(emptyState({ icon: 'trophy', title: 'Bảng còn trống', text: 'Hãy là người đầu tiên tinh tấn hôm nay. Công phu một chút rồi quay lại xem nhé.', action: { label: 'Làm mới', onClick: () => void load(true) } }));
        return;
      }
      const mine = rows.find((r) => r.name === me().name);
      const top = rows.slice(0, 3);
      const slots: (api.RankRow | null)[] = [top[1] ?? null, top[0] ?? null, top[2] ?? null];
      const pod = h('div', { class: 'rank-podium' });
      for (const r of slots) {
        if (!r) {
          pod.append(h('div', { class: 'rank-pod-slot', 'aria-hidden': 'true' }));
          continue;
        }
        const pos = r.rank;
        const card = h('div', { class: `rank-pod rank-pod--${pos}${mine === r ? ' is-me' : ''}` });
        card.innerHTML = `<div class="rank-pod__medal">${pos}</div><div class="rank-pod__icon">${tierIcon(r.tier, { size: pos === 1 ? 60 : 50 })}</div><b class="rank-pod__name">${esc(r.name)}</b><span class="rank-pod__metric">${esc(metric(r))}</span><small>${esc(tierName(r))}</small>`;
        pod.append(card);
      }
      out.append(pod);
      const list = h('ol', { class: 'rank-list', start: '4' });
      for (const r of rows.slice(3, 50)) {
        const isMe = mine === r;
        const li = h('li', { class: 'rank-row' + (isMe ? ' is-me' : '') });
        li.innerHTML = `<span class="rank-row__no">${r.rank}</span><span class="rank-row__icon">${tierIcon(r.tier, { size: 34 })}</span><span class="rank-row__name"><b>${esc(r.name)}${isMe ? ' <em>(bạn)</em>' : ''}</b><small>${esc(tierName(r))}</small></span><span class="rank-row__metric">${kind === 'level' ? `Cấp <b>${fmt(r.level)}</b>` : `${icon('flame', { size: 15 })}<b>${fmt(r.streak)}</b> ngày`}</span>`;
        list.append(li);
      }
      if (rows.length > 3) out.append(list);
      const v = ctx.progress.view();
      out.append(h('p', { class: 'rank-foot', html: mine ? `Bạn đang ở hạng <b>${mine.rank}</b>.` : kind === 'level' ? `Bạn đang ở <b>Cấp ${v.level}</b> — tinh tấn thêm để vào bảng nhé.` : `Chuỗi giữ lửa của bạn: <b>${v.streak} ngày</b>. Giữ lửa mỗi ngày để lên bảng.` }));
    }

    async function load(force = false): Promise<void> {
      const my = ++seq;
      paintTabs();
      if (!force && cache.has(kind)) { render(cache.get(kind)!); return; }
      out.replaceChildren(skeleton(6));
      const r = await api.rank(kind);
      if (!alive || my !== seq) return;
      if (!r.ok) {
        out.replaceChildren(emptyState({ icon: 'wifi', title: 'Chưa tải được bảng xếp hạng', text: r.error, action: { label: 'Thử lại', onClick: () => void load(true) } }));
        return;
      }
      cache.set(kind, r.data.rows ?? []);
      render(r.data.rows ?? []);
    }

    tabs.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-k]');
      if (!b || b.dataset.k === kind) return;
      kind = b.dataset.k as Kind;
      void load();
    });
    void load();
    return () => { alive = false; };
  },
};
