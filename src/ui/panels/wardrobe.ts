/**
 * Panel "Trang phục": xem trước nhân vật 2D, chọn kiểu áo, màu áo, phụ kiện (khoá theo cấp), rồi lưu.
 */
import { OUTFITS, OUTFIT_COLORS, type AppContext, type PanelDef, type Profile } from '@/core/contracts';
import { ACCESSORIES, type Accessory } from '@/content/wardrobe';
import { characterSvg } from '@/ui/character-preview';
import { icon } from '@/ui/icons';
import { h, haptic, liveRegion, viewHead } from './practice-kit';

const KIND_LABEL: Record<Accessory['kind'], string> = { hat: 'Đội đầu', neck: 'Đeo cổ', hand: 'Cầm tay', back: 'Đeo lưng' };

export const panel: PanelDef = {
  id: 'wardrobe',
  title: 'Trang phục',
  kind: 'view',
  mount(root: HTMLElement, ctx: AppContext) {
    const live = liveRegion();
    const base: Profile = { ...ctx.profile };
    const draft: Profile = { ...ctx.profile };
    const level = ctx.progress.view().level;

    const stage = h('div', { class: 'wardrobe-stage' });
    const nameEl = h('div', { class: 'wardrobe-name' });
    const metaEl = h('div', { class: 'wardrobe-meta muted' });
    const outfitWrap = h('div', { class: 'wardrobe-outfits', role: 'radiogroup', 'aria-label': 'Kiểu áo' });
    const colorWrap = h('div', { class: 'wardrobe-colors', role: 'radiogroup', 'aria-label': 'Màu áo' });
    const colorName = h('span', { class: 'wardrobe-colorname muted' });
    const accWrap = h('div', { class: 'wardrobe-accs', role: 'radiogroup', 'aria-label': 'Phụ kiện' });
    const saveBtn = h('button', { type: 'button', class: 'btn btn--gold btn--lg', onclick: save }, [h('span', { html: icon('check', { size: 18 }) }), h('span', { text: 'Lưu' })]);
    const resetBtn = h('button', { type: 'button', class: 'btn', text: 'Hoàn lại', onclick: () => { Object.assign(draft, base); if (!base.accessory) delete (draft as { accessory?: string }).accessory; renderAll(); } });

    const dirty = (): boolean => draft.outfit !== base.outfit || draft.colorIndex !== base.colorIndex || (draft.accessory ?? '') !== (base.accessory ?? '');

    function paintPreview(): void {
      let svg = '';
      try { svg = characterSvg(draft, { size: 190, aura: true, shadow: true, breathe: true, pose: 'pray' }); } catch { svg = ''; }
      stage.innerHTML = svg || `<div class="wardrobe-fallback">${icon('user', { size: 64 })}</div>`;
      const acc = ACCESSORIES.find((a) => a.id === draft.accessory);
      nameEl.textContent = draft.name;
      metaEl.textContent = `${OUTFITS.find((o) => o.id === draft.outfit)?.label ?? ''} · ${OUTFIT_COLORS[draft.outfit][draft.colorIndex]?.name ?? ''}${acc ? ` · ${acc.name}` : ''}`;
    }
    function paintOutfits(): void {
      outfitWrap.replaceChildren(...OUTFITS.map((o) => {
        const thumb = (() => { try { return characterSvg({ ...draft, outfit: o.id, colorIndex: Math.min(draft.colorIndex, 4), accessory: undefined }, { size: 54 }); } catch { return ''; } })();
        const on = o.id === draft.outfit;
        return h('button', {
          type: 'button', class: `wardrobe-outfit${on ? ' is-on' : ''}`, role: 'radio', 'aria-checked': String(on),
          onclick: () => { draft.outfit = o.id; haptic(6); renderAll(); },
        }, [h('span', { class: 'wardrobe-outfit__thumb', 'aria-hidden': 'true', html: thumb }), h('span', { class: 'wardrobe-outfit__label', text: o.label })]);
      }));
    }
    function paintColors(): void {
      const list = OUTFIT_COLORS[draft.outfit];
      colorWrap.replaceChildren(...list.map((c, i) => h('button', {
        type: 'button', class: `wardrobe-color${i === draft.colorIndex ? ' is-on' : ''}`, role: 'radio', 'aria-checked': String(i === draft.colorIndex),
        'aria-label': c.name, title: c.name, style: `--c:${c.hex}`,
        onclick: () => { draft.colorIndex = i; haptic(6); renderAll(); },
      })));
      colorName.textContent = list[draft.colorIndex]?.name ?? '';
    }
    function paintAccs(): void {
      const none = h('button', {
        type: 'button', class: `wardrobe-acc${!draft.accessory ? ' is-on' : ''}`, role: 'radio', 'aria-checked': String(!draft.accessory),
        onclick: () => { delete (draft as { accessory?: string }).accessory; renderAll(); },
      }, [
        h('span', { class: 'wardrobe-acc__icon', html: icon('close', { size: 18 }) }),
        h('span', { class: 'wardrobe-acc__text' }, [h('strong', { text: 'Không phụ kiện' }), h('span', { class: 'muted', text: 'Giản dị, thanh thoát' })]),
      ]);
      const rows = ACCESSORIES.slice().sort((a, b) => a.minLevel - b.minLevel).map((a) => {
        const locked = level < a.minLevel;
        const on = draft.accessory === a.id;
        return h('button', {
          type: 'button', class: `wardrobe-acc${on ? ' is-on' : ''}${locked ? ' is-locked' : ''}`, role: 'radio', 'aria-checked': String(on),
          'aria-disabled': locked ? 'true' : null,
          'aria-label': `${a.name}${locked ? `, cần Cấp ${a.minLevel}` : ''}`,
          onclick: () => {
            if (locked) { live.textContent = `${a.name} cần Cấp ${a.minLevel}.`; ctx.toast(`${a.name} mở ở Cấp ${a.minLevel}. Bạn đang ở Cấp ${level}.`, { kind: 'info' }); return; }
            draft.accessory = a.id; haptic(6); renderAll();
          },
        }, [
          h('span', { class: 'wardrobe-acc__icon', html: icon(locked ? 'lock' : a.kind === 'hand' ? 'flower' : a.kind === 'neck' ? 'beads' : a.kind === 'back' ? 'gift' : 'sparkle', { size: 18 }) }),
          h('span', { class: 'wardrobe-acc__text' }, [
            h('strong', { text: a.name }),
            h('span', { class: 'muted', text: a.desc }),
          ]),
          h('span', { class: `wardrobe-acc__tag${locked ? ' is-lock' : ''}`, text: locked ? `Cần Cấp ${a.minLevel}` : KIND_LABEL[a.kind] }),
        ]);
      });
      accWrap.replaceChildren(none, ...rows);
    }
    function renderAll(): void {
      paintPreview(); paintOutfits(); paintColors(); paintAccs();
      saveBtn.toggleAttribute('disabled', !dirty());
      resetBtn.toggleAttribute('disabled', !dirty());
    }
    function save(): void {
      if (!dirty()) return;
      const next: Profile = { ...ctx.profile, outfit: draft.outfit, colorIndex: draft.colorIndex };
      if (draft.accessory) next.accessory = draft.accessory; else delete next.accessory;
      ctx.setProfile(next);
      Object.assign(base, next);
      ctx.toast('Đã lưu trang phục.', { kind: 'good' });
      ctx.audio.play('chime', { volume: 0.5 });
      haptic(14);
      renderAll();
    }

    root.append(
      h('section', { class: 'view wardrobe-view' }, [
        viewHead('Trang phục', 'Chọn áo và phụ kiện cho nhân vật của bạn. Phụ kiện mở dần theo cấp tu tập.'),
        h('div', { class: 'card wardrobe-preview' }, [
          stage,
          h('div', { class: 'wardrobe-preview__info' }, [
            nameEl, metaEl,
            h('div', { class: 'row wardrobe-chips' }, [
              h('span', { class: 'chip', text: ctx.profile.gender === 'female' ? 'Nữ' : 'Nam' }),
              h('span', { class: 'chip', html: `${icon('sparkle', { size: 14 })}<span>Cấp ${level}</span>` }),
            ]),
          ]),
        ]),
        h('section', { class: 'wardrobe-sec' }, [h('h2', { class: 'wardrobe-sec__title', text: 'Kiểu áo' }), outfitWrap]),
        h('section', { class: 'wardrobe-sec' }, [h('h2', { class: 'wardrobe-sec__title' }, [h('span', { text: 'Màu áo' }), colorName]), colorWrap]),
        h('section', { class: 'wardrobe-sec' }, [h('h2', { class: 'wardrobe-sec__title', text: 'Phụ kiện' }), accWrap]),
        h('div', { class: 'wardrobe-actions' }, [resetBtn, saveBtn]),
      ]),
      live,
    );
    renderAll();
    return () => { root.replaceChildren(); };
  },
};
