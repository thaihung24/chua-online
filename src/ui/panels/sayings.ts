/**
 * Panel "Lời chào" (hộp thoại): lưới câu chào soạn sẵn theo nhóm — chỉ chọn, không gõ tự do để giữ chùa thanh tịnh.
 */
import type { PanelDef } from '@/core/contracts';
import { PHRASES, PHRASE_GROUPS } from '@/content/phrases';
import { esc, h } from '@/ui/dom';
import { dialogHead } from '@/ui/pm-kit';

export const panel: PanelDef = {
  id: 'sayings',
  title: 'Lời chào',
  kind: 'dialog',
  mount(root, ctx) {
    const body = h('div', { class: 'say-body' });
    const groups: string[] = [...PHRASE_GROUPS];
    for (const p of PHRASES) if (!groups.includes(p.group)) groups.push(p.group);
    for (const g of groups) {
      const items = PHRASES.filter((p) => p.group === g);
      if (!items.length) continue;
      const sec = h('section', { class: 'say-sec' }, [h('h3', { class: 'say-sec__title', text: g })]);
      const chips = h('div', { class: 'say-chips' });
      for (const p of items) {
        const b = h('button', { type: 'button', class: 'say-chip', 'data-id': p.id });
        b.innerHTML = esc(p.text);
        chips.append(b);
      }
      sec.append(chips);
      body.append(sec);
    }
    body.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-id]');
      if (!b) return;
      const p = PHRASES.find((x) => x.id === b.dataset.id);
      if (!p) return;
      ctx.net.sendSay(p.id);
      ctx.world.say(p.text);
      ctx.progress.record('greet');
      ctx.closePanel();
    });
    root.append(dialogHead('Lời chào', 'Chạm một câu để nói với mọi người trong chùa.', () => ctx.closePanel()), body);
  },
};
