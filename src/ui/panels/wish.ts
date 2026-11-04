/**
 * Panel "Treo nguyện lên cây bồ đề" (hộp thoại): chọn ruy-băng, viết lời nguyện (lưu trên máy),
 * treo lên cây (tối đa 30) và xem/xoá các ruy-băng đã treo.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { load, save } from '@/core/store';
import { icon } from '@/ui/icons';
import { dialogHead, h, haptic, liveRegion, uid } from './practice-kit';

const MAX_LEN = 120;
const MAX_RIBBONS = 30;
const KEY = 'wish:list';
const RIBBONS = [
  { id: 'do', name: 'Đỏ', hex: '#d9503f', meaning: 'May mắn, sức sống' },
  { id: 'vang', name: 'Vàng', hex: '#f0c05a', meaning: 'Trí tuệ, an lành' },
  { id: 'hong', name: 'Hồng', hex: '#eba9bb', meaning: 'Từ bi, yêu thương' },
  { id: 'xanh', name: 'Xanh', hex: '#5fb59a', meaning: 'Bình an, nhẹ nhõm' },
] as const;

interface Ribbon { id: string; color: string; text: string; at: number }

const ribbonSvg = (hex: string): string => `
<svg viewBox="0 0 40 84" aria-hidden="true" focusable="false">
  <circle cx="20" cy="6" r="4" fill="none" stroke="#e0b25c" stroke-width="2"/>
  <path d="M12 10 H28 L30 70 L20 62 L10 70 Z" fill="${hex}" stroke="rgba(255,235,190,.55)" stroke-width="1"/>
  <path d="M20 16 V54" stroke="rgba(255,255,255,.35)" stroke-width="1.4" stroke-dasharray="1 4" stroke-linecap="round"/>
</svg>`;

const fmtWhen = (t: number): string => {
  const d = new Date(t);
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}`;
};

export const panel: PanelDef = {
  id: 'wish',
  title: 'Treo nguyện',
  kind: 'dialog',
  mount(root: HTMLElement, ctx: AppContext) {
    const live = liveRegion();
    let list = load<Ribbon[]>(KEY, []);
    let colorId: string = RIBBONS[1].id;
    let listOpen = false;

    const ribbonWrap = h('div', { class: 'wish-ribbons', role: 'radiogroup', 'aria-label': 'Màu ruy-băng' });
    const meaning = h('p', { class: 'wish-meaning muted', 'aria-live': 'polite' });
    const ta = h('textarea', { class: 'textarea wish-text', id: 'wish-ta', maxlength: MAX_LEN, rows: 4, placeholder: 'Điều bạn nguyện cho mình và mọi người…', 'aria-describedby': 'wish-left' });
    const left = h('span', { class: 'field__hint', id: 'wish-left' });
    const goBtn = h('button', { type: 'button', class: 'btn btn--gold btn--lg btn--block wish-go', onclick: hang });
    const listHead = h('button', { type: 'button', class: 'lantern-listhead', 'aria-expanded': 'false', onclick: () => { listOpen = !listOpen; paintList(); } });
    const listBody = h('div', { class: 'lantern-list' });
    const meter = h('div', { class: 'wish-meter', role: 'img' });

    const cur = (): (typeof RIBBONS)[number] => RIBBONS.find((r) => r.id === colorId) ?? RIBBONS[0];

    function paintRibbons(): void {
      ribbonWrap.replaceChildren(...RIBBONS.map((r) => h('button', {
        type: 'button', class: `wish-ribbon${r.id === colorId ? ' is-on' : ''}`, role: 'radio', 'aria-checked': String(r.id === colorId), 'aria-label': r.name,
        style: `--c:${r.hex}`, onclick: () => { colorId = r.id; haptic(6); paintRibbons(); },
      }, [h('span', { class: 'wish-ribbon__art', html: ribbonSvg(r.hex) }), h('span', { class: 'wish-ribbon__name', text: r.name })])));
      meaning.textContent = `Ruy-băng ${cur().name.toLowerCase()} — ${cur().meaning}.`;
    }
    function paintLeft(): void { left.textContent = `Còn ${MAX_LEN - ta.value.length} ký tự`; }
    function paintGo(): void {
      const full = list.length >= MAX_RIBBONS;
      goBtn.toggleAttribute('disabled', full);
      goBtn.replaceChildren(h('span', { html: icon('ribbon', { size: 20 }) }), h('span', { text: full ? 'Cây đã treo đủ' : 'Treo nguyện' }));
      const pct = Math.round((list.length / MAX_RIBBONS) * 100);
      meter.setAttribute('aria-label', `Đã treo ${list.length} trên ${MAX_RIBBONS} ruy-băng`);
      meter.replaceChildren(h('span', { class: 'wish-meter__bar' }, [h('i', { style: `width:${pct}%` })]), h('span', { class: 'muted', text: full ? `Đã treo đủ ${MAX_RIBBONS} ruy-băng — xóa bớt để treo thêm.` : `Đã treo ${list.length}/${MAX_RIBBONS} ruy-băng` }));
    }
    function paintList(): void {
      listHead.setAttribute('aria-expanded', String(listOpen));
      listHead.replaceChildren(h('span', { text: `Nguyện đã treo (${list.length})` }), h('span', { class: 'lantern-listhead__chev', html: icon(listOpen ? 'chevron-up' : 'chevron-down', { size: 18 }) }));
      listBody.hidden = !listOpen;
      if (!listOpen) return;
      if (!list.length) { listBody.replaceChildren(h('p', { class: 'muted lantern-empty', text: 'Cây bồ đề đang chờ ruy-băng nguyện đầu tiên của bạn.' })); return; }
      listBody.replaceChildren(...list.map((w) => h('div', { class: 'lantern-item', style: `--c:${w.color}` }, [
        h('span', { class: 'lantern-item__dot', 'aria-hidden': 'true' }),
        h('div', { class: 'lantern-item__body' }, [
          h('strong', { text: w.text || 'Nguyện thầm' }),
          h('span', { class: 'muted lantern-item__when', text: `Treo ngày ${fmtWhen(w.at)}` }),
        ]),
        h('button', {
          type: 'button', class: 'icon-btn lantern-item__del', 'aria-label': 'Gỡ ruy-băng này', html: icon('trash', { size: 16 }),
          onclick: () => {
            list = list.filter((x) => x.id !== w.id); save(KEY, list);
            ctx.world.setWishRibbons(list.length);
            paintList(); paintGo(); live.textContent = 'Đã gỡ ruy-băng.';
          },
        }),
      ])));
    }

    function hang(): void {
      if (list.length >= MAX_RIBBONS) return;
      const r = cur();
      const text = ta.value.trim().slice(0, MAX_LEN);
      list = [{ id: uid('wi'), color: r.hex, text, at: Date.now() }, ...list];
      save(KEY, list);
      haptic(14);
      ctx.audio.play('ribbon');
      ctx.world.perform('wish').catch(() => undefined);
      ctx.world.setWishRibbons(list.length);
      ctx.progress.record('wish');
      ctx.toast('Đã treo nguyện lên cây bồ đề.', { kind: 'good' });
      ctx.closePanel();
    }

    ta.addEventListener('input', paintLeft);
    root.append(h('div', { class: 'pk-dialog wish-dialog' }, [
      dialogHead('Treo nguyện lên cây bồ đề', () => ctx.closePanel(), 'Một ruy-băng, một lời nguyện — gửi gió cùng cây bồ đề.'),
      h('section', { class: 'lantern-sec' }, [h('h3', { class: 'pk-label', text: 'Màu ruy-băng' }), ribbonWrap, meaning]),
      h('section', { class: 'lantern-sec field' }, [
        h('label', { class: 'pk-label', for: 'wish-ta', text: 'Lời nguyện' }),
        ta, left,
        h('p', { class: 'lantern-private muted' }, [h('span', { html: icon('lock', { size: 14 }) }), h('span', { text: 'Lời nguyện chỉ lưu trên máy này, không ai khác đọc được.' })]),
      ]),
      meter,
      goBtn,
      h('section', { class: 'lantern-sec lantern-history' }, [listHead, listBody]),
      live,
    ]));
    paintRibbons(); paintLeft(); paintGo(); paintList();
    return () => { root.replaceChildren(); };
  },
};
