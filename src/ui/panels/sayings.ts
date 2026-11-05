/**
 * Panel "Lời chào" (hộp thoại): lưới câu chào soạn sẵn theo nhóm + nút mở khung trò chuyện tự do.
 */
import type { PanelDef } from '@/core/contracts';
import { CHAT_COOLDOWN_MS } from '@/core/profile';
import { load, save } from '@/core/store';
import { PHRASES, PHRASE_GROUPS } from '@/content/phrases';
import { esc, h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { dialogHead } from '@/ui/pm-kit';

export const panel: PanelDef = {
  id: 'sayings',
  title: 'Lời chào',
  kind: 'dialog',
  mount(root, ctx) {
    const openFreeChat = h('button', { type: 'button', class: 'btn btn--ghost btn--block' });
    openFreeChat.innerHTML = `${icon('chat', { size: 18 })}<span>Mở khung gõ tin nhắn tự do</span>`;
    openFreeChat.addEventListener('click', () => {
      ctx.closePanel();
      requestAnimationFrame(() => ctx.bus.emit('chatToggle', { open: true, focus: true }));
    });

    const body = h('div', { class: 'say-body' }, [openFreeChat]);
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
      const now = Date.now();
      const last = load<number>('chat:lastSendAt', 0);
      if (last <= now && now - last < CHAT_COOLDOWN_MS) {
        const sec = Math.max(1, Math.ceil((last + CHAT_COOLDOWN_MS - now) / 1000));
        ctx.toast(`Mỗi 20 giây mới chat được 1 lần. Xin chờ ${sec}s nữa nhé.`);
        return;
      }
      save('chat:lastSendAt', now);
      ctx.net.sendSay(p.id);
      ctx.world.say(p.text);
      ctx.progress.record('greet');
      ctx.closePanel();
    });
    root.append(dialogHead('Lời chào', 'Chạm một câu để nói với mọi người trong chùa.', () => ctx.closePanel()), body);
  },
};
