/**
 * Panel "Pháp thoại": gợi ý pháp thoại theo nhóm, mở trên YouTube (liên kết tìm kiếm/kênh chính thức).
 * Chỉ hiển thị thông tin; nội dung thuộc về kênh gốc.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { DHARMA, type DharmaTalk } from '@/content/dharma';
import { icon } from '@/ui/icons';
import { h, liveRegion, viewHead } from './practice-kit';

const GROUPS: DharmaTalk['group'][] = ['Cho người mới', 'Đời sống', 'Tịnh độ', 'Thiền'];
const GROUP_ICON: Record<DharmaTalk['group'], 'sparkle' | 'heart' | 'lotus' | 'meditate'> = {
  'Cho người mới': 'sparkle', 'Đời sống': 'heart', 'Tịnh độ': 'lotus', 'Thiền': 'meditate',
};

export const panel: PanelDef = {
  id: 'dharma',
  title: 'Pháp thoại',
  kind: 'view',
  mount(root: HTMLElement, _ctx: AppContext) {
    let filter: DharmaTalk['group'] | 'all' = 'all';
    const live = liveRegion();
    let talks: DharmaTalk[] = [];
    let failed = false;
    try { talks = Array.isArray(DHARMA) ? DHARMA : []; } catch { failed = true; }

    const chipsEl = h('div', { class: 'dharma-filters', role: 'group', 'aria-label': 'Lọc theo nhóm' });
    const listEl = h('div', { class: 'dharma-list' });

    function renderChips(): void {
      const mk = (id: DharmaTalk['group'] | 'all', label: string, count: number): HTMLElement => h('button', {
        type: 'button', class: 'dharma-chip', 'aria-pressed': String(filter === id),
        onclick: () => { filter = id; renderChips(); renderList(); },
      }, [h('span', { text: label }), h('em', { text: String(count) })]);
      chipsEl.replaceChildren(
        mk('all', 'Tất cả', talks.length),
        ...GROUPS.filter((g) => talks.some((t) => t.group === g)).map((g) => mk(g, g, talks.filter((t) => t.group === g).length)),
      );
    }
    function card(t: DharmaTalk): HTMLElement {
      return h('article', { class: 'dharma-card' }, [
        h('div', { class: 'dharma-card__badge', 'aria-hidden': 'true', html: icon(GROUP_ICON[t.group] ?? 'scroll', { size: 22 }) }),
        h('div', { class: 'dharma-card__body' }, [
          h('div', { class: 'dharma-card__meta' }, [
            h('span', { class: 'dharma-card__group', text: t.group }),
            h('span', { class: 'dharma-card__min', html: `${icon('clock', { size: 14 })}<span>${t.minutes} phút</span>` }),
          ]),
          h('h3', { class: 'dharma-card__title', text: t.title }),
          h('p', { class: 'dharma-card__by', text: `${t.speaker} · ${t.channel}` }),
          h('p', { class: 'dharma-card__desc', text: t.desc }),
          h('a', {
            class: 'btn btn--ghost btn--sm dharma-card__open', href: t.url, target: '_blank', rel: 'noopener noreferrer',
            'aria-label': `Mở “${t.title}” trên YouTube (mở tab mới)`,
          }, [h('span', { text: 'Mở trên YouTube' }), h('span', { html: icon('link', { size: 16 }) })]),
        ]),
      ]);
    }
    function renderList(): void {
      const shown = talks.filter((t) => filter === 'all' || t.group === filter);
      live.textContent = `Hiển thị ${shown.length} pháp thoại`;
      if (failed || !shown.length) {
        listEl.replaceChildren(h('div', { class: 'card dharma-empty' }, [
          h('div', { class: 'dharma-empty__icon', html: icon(failed ? 'warning' : 'scroll', { size: 34 }) }),
          h('p', { text: failed ? 'Chưa tải được danh sách pháp thoại.' : 'Chưa có pháp thoại nào trong nhóm này.' }),
          h('p', { class: 'muted', text: failed ? 'Bạn kiểm tra mạng rồi thử lại nhé.' : 'Bạn chọn nhóm khác thử xem.' }),
          failed ? null : h('button', { type: 'button', class: 'btn btn--ghost btn--sm', text: 'Xem tất cả', onclick: () => { filter = 'all'; renderChips(); renderList(); } }),
        ]));
        return;
      }
      listEl.replaceChildren(...shown.map(card));
    }

    renderChips();
    renderList();
    root.append(
      h('section', { class: 'view dharma-view' }, [
        viewHead('Pháp thoại', 'Những bài giảng gợi ý để nghe thêm khi có thời gian — nghe nhẹ nhàng, hiểu dần dần.'),
        chipsEl,
        listEl,
        h('p', { class: 'dharma-note muted', text: 'Pháp thoại được mở trên YouTube; nội dung thuộc về kênh gốc và các giảng sư. Chùa chỉ giới thiệu liên kết, không lưu hay phát lại.' }),
      ]),
      live,
    );
    return () => { root.replaceChildren(); };
  },
};
