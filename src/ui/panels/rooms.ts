/**
 * Panel "Không gian chùa" (hộp thoại): tất cả mọi người cùng vào chung một ngôi chùa duy nhất (không tạo phòng riêng),
 * kèm tuỳ chọn tạm ẩn người khác khi muốn tịnh tâm một mình.
 */
import type { PanelDef, RoomInfo } from '@/core/contracts';
import { esc, h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { dialogHead, disposer, skeleton } from '@/ui/pm-kit';

export const panel: PanelDef = {
  id: 'rooms',
  title: 'Không gian chùa',
  kind: 'dialog',
  mount(root, ctx) {
    const dis = disposer();
    const list = h('div', { class: 'rooms-list' });
    const status = h('div', { class: 'rooms-status', role: 'status' });
    const refreshBtn = h('button', { type: 'button', class: 'rooms-refresh', 'aria-label': 'Làm mới số người', title: 'Làm mới', html: icon('refresh', { size: 18 }) });

    root.append(
      dialogHead('Không gian chùa', 'Tất cả mọi người vào chùa đều gặp nhau chung trong một sân chùa duy nhất.', () => ctx.closePanel()),
      status,
      h('div', { class: 'rooms-bar' }, [h('span', { class: 'pm-sec__title', text: 'Chế độ hiện diện' }), refreshBtn]),
      list,
    );

    const paintStatus = (): void => {
      const room = ctx.net.room();
      const on = ctx.net.isOnline();
      status.className = 'rooms-status' + (on ? ' is-on' : '');
      status.innerHTML = on && room
        ? `<span class="hud-dot" data-state="online"></span><span>Đang ở <b>Sân chùa chung (${esc(room.label)})</b> · ${room.online} người đang có mặt</span>`
        : `<span class="hud-dot" data-state="offline"></span><span>Bạn đang tịnh tâm một mình trong chùa</span>`;
    };
    paintStatus();
    dis.add(ctx.net.on('status', paintStatus));
    dis.add(ctx.net.on('count', paintStatus));

    let loadSeq = 0;
    async function load(): Promise<void> {
      const my = ++loadSeq;
      refreshBtn.classList.add('is-spin');
      list.replaceChildren(skeleton(2));
      let mainRoom: RoomInfo | null = ctx.net.room();
      try {
        const rooms = await ctx.net.lobby();
        if (rooms[0]) mainRoom = rooms[0];
      } catch {
        /* giữ thông tin hiện tại nếu có */
      }
      if (my !== loadSeq) return;
      refreshBtn.classList.remove('is-spin');
      list.replaceChildren(sharedTempleRow(mainRoom), soloRow());
    }

    function sharedTempleRow(r: RoomInfo | null): HTMLElement {
      const here = ctx.net.isOnline();
      const count = r?.online ?? (here ? 1 : 0);
      const b = h('button', { type: 'button', class: 'room-row' + (here ? ' is-here' : '') });
      b.innerHTML = `<span class="room-row__ic">${icon('lotus', { size: 22 })}</span>
        <span class="room-row__main"><b>Sân chùa chung · Chùa Liên Hoa</b><small>Mọi người vào chùa đều cùng hiện diện tại đây</small></span>
        <span class="room-row__count">${here ? `<span class="pm-pill">Đang ở đây · ${count}</span>` : `${count} <small>người</small>`}</span>`;
      b.addEventListener('click', () => {
        if (here) { ctx.closePanel(); return; }
        ctx.net.connect(ctx.profile, ctx.progress.view().level);
        ctx.toast('Đang vào sân chùa chung cùng mọi người…');
        ctx.closePanel();
      });
      return b;
    }

    function soloRow(): HTMLElement {
      const solo = !ctx.net.isOnline();
      const b = h('button', {
        type: 'button',
        class: 'room-row room-row--solo' + (solo ? ' is-here' : ''),
        html: `<span class="room-row__ic">${icon('user', { size: 22 })}</span><span class="room-row__main"><b>Tịnh tâm một mình</b><small>Tạm ẩn người chơi khác để yên tĩnh tu tập riêng</small></span>${solo ? '<span class="pm-pill">Đang chọn</span>' : ''}`,
      });
      b.addEventListener('click', () => {
        if (solo) { ctx.closePanel(); return; }
        ctx.net.disconnect();
        ctx.toast('Đã chuyển sang chế độ tịnh tâm một mình.');
        ctx.closePanel();
      });
      return b;
    }

    refreshBtn.addEventListener('click', () => void load());
    void load();
    return () => { loadSeq++; dis.run(); };
  },
};
