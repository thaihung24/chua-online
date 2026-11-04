/**
 * Panel "Cài đặt" (toàn khung): âm thanh, đồ hoạ, ngày/đêm, hiện Hành trình, nhân vật, tài khoản,
 * lời nguyện đã lưu, xoá dữ liệu (xác nhận hai bước), liên kết trang tĩnh và phiên bản.
 */
import type { AppContext, AudioSettings, PanelDef } from '@/core/contracts';
import { clearAll, load, remove, save } from '@/core/store';
import { esc, h } from '@/ui/dom';
import { icon, type IconName } from '@/ui/icons';
import { APP_VERSION, disposer, viewShell } from '@/ui/pm-kit';
import { changeCharacter } from '@/ui/shell';
import { getSettings, saveSettings } from '@/ui/settings-store';

type Quality = 'low' | 'medium' | 'high';
type Tod = 'auto' | 'day' | 'night';

function switchRow(id: string, title: string, sub: string, checked: boolean, onChange: (v: boolean) => void, disabled = false): HTMLElement {
  const row = h('div', { class: 'pm-row' });
  row.innerHTML = `<label class="pm-row__text" for="${id}"><span>${esc(title)}</span><small>${esc(sub)}</small></label><span class="sw"><input type="checkbox" role="switch" id="${id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}/><span class="sw__track"></span></span>`;
  row.querySelector('input')!.addEventListener('change', (e) => onChange((e.target as HTMLInputElement).checked));
  return row;
}

function segRow<T extends string>(title: string, sub: string, opts: { id: T; label: string }[], value: T, onPick: (v: T) => void): HTMLElement {
  const seg = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': title }, opts.map((o) => h('button', { type: 'button', class: 'seg__btn', role: 'radio', 'data-v': o.id, text: o.label })));
  const paint = (v: T): void => seg.querySelectorAll<HTMLElement>('[data-v]').forEach((b) => { const on = b.dataset.v === v; b.setAttribute('aria-checked', String(on)); b.setAttribute('aria-pressed', String(on)); });
  paint(value);
  seg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-v]');
    if (!b) return;
    const v = b.dataset.v as T;
    paint(v);
    onPick(v);
  });
  const row = h('div', { class: 'pm-row pm-row--seg' }, [h('div', { class: 'pm-row__text' }, [h('span', { text: title }), h('small', { text: sub })]), seg]);
  return row;
}

function linkRow(ic: IconName, title: string, sub: string, onClick: () => void, extra = '', danger = false): HTMLButtonElement {
  const b = h('button', { type: 'button', class: 'pm-row' + (danger ? ' pm-row--danger' : '') });
  b.innerHTML = `<span class="pm-row__lead">${icon(ic, { size: 22 })}</span><span class="pm-row__text pm-grow"><span>${esc(title)}</span><small>${esc(sub)}</small></span>${extra}${icon('chevron-right', { size: 18 })}`;
  b.addEventListener('click', onClick);
  return b;
}

export const panel: PanelDef = {
  id: 'settings',
  title: 'Cài đặt',
  kind: 'view',
  mount(root, ctx: AppContext) {
    const dis = disposer();
    const view = viewShell(root, 'Cài đặt', 'Chỉnh chùa cho vừa ý bạn. Mọi thay đổi được lưu ngay trên máy này.');
    const section = (title: string, rows: (HTMLElement | null)[]): HTMLElement => {
      const sec = h('section', { class: 'pm-sec' }, [h('h2', { class: 'pm-sec__title', text: title }), h('div', { class: 'pm-list' }, rows.filter(Boolean) as HTMLElement[])]);
      view.append(sec);
      return sec;
    };

    // ── Âm thanh (vẽ lại khi audio đổi từ nơi khác)
    const soundList = h('div', { class: 'pm-list' });
    const soundSec = h('section', { class: 'pm-sec' }, [h('h2', { class: 'pm-sec__title', text: 'Âm thanh' }), soundList]);
    view.append(soundSec);
    const paintSound = (s: AudioSettings): void => {
      const focusId = soundList.contains(document.activeElement) ? (document.activeElement as HTMLElement).id : '';
      const vol = h('div', { class: 'pm-row' });
      vol.innerHTML = `<label class="pm-row__text" for="set-vol"><span>Âm lượng nhạc nền</span></label><span class="set-vol">${icon('sound', { size: 18 })}<input type="range" class="range" id="set-vol" min="0" max="100" value="${Math.round(s.ambientVolume * 100)}" style="--p:${Math.round(s.ambientVolume * 100)}%" ${s.master ? '' : 'disabled'}/></span>`;
      const input = vol.querySelector('input')!;
      input.addEventListener('input', () => { input.style.setProperty('--p', input.value + '%'); ctx.audio.configure({ ambientVolume: Number(input.value) / 100 }); });
      soundList.replaceChildren(
        switchRow('set-master', 'Âm thanh', 'Bật hoặc tắt tất cả', s.master, (v) => ctx.audio.configure({ master: v })),
        switchRow('set-ambient', 'Nhạc nền', 'Gió, chim, suối và nhạc thiền', s.ambient, (v) => ctx.audio.configure({ ambient: v }), !s.master),
        switchRow('set-sfx', 'Mõ & chuông', 'Tiếng mõ, chuông, tràng hạt', s.sfx, (v) => ctx.audio.configure({ sfx: v }), !s.master),
        switchRow('set-chant', 'Giọng niệm Phật & nhạc nền', 'Tiếng niệm cùng nhạc chung', s.chant, (v) => ctx.audio.configure({ chant: v }), !s.master),
        vol,
      );
      if (focusId) (soundList.querySelector('#' + focusId) as HTMLElement | null)?.focus();
    };
    paintSound(ctx.audio.settings());
    dis.add(ctx.audio.onChange(paintSound));

    // ── Đồ hoạ & ngày/đêm & hành trình
    const quality = load<Quality>('quality', 'medium');
    const tod = load<Tod>('timeOfDay', 'auto');
    section('Hiển thị', [
      segRow<Quality>('Đồ hoạ', 'Chọn thấp nếu máy chạy chậm hoặc nóng.', [{ id: 'low', label: 'Thấp' }, { id: 'medium', label: 'Vừa' }, { id: 'high', label: 'Cao' }], quality, (v) => { save('quality', v); ctx.world.setQuality(v); }),
      segRow<Tod>('Ban ngày / ban đêm', 'Tự động theo giờ Việt Nam.', [{ id: 'auto', label: 'Tự động' }, { id: 'day', label: 'Ban ngày' }, { id: 'night', label: 'Ban đêm' }], tod, (v) => { save('timeOfDay', v); ctx.world.setTimeOfDay(v); }),
      switchRow('set-journey', 'Hiện Hành trình', 'Nút cấp và chuỗi giữ lửa trên màn hình.', getSettings().showJourney, (v) => saveSettings({ showJourney: v })),
    ]);

    // ── Nhân vật & tài khoản
    const wardrobeLocked = !ctx.progress.isUnlocked('wardrobe');
    const accountRow = linkRow('mail', 'Tài khoản', ctx.isLoggedIn() ? 'Đã đăng nhập · tiến độ được lưu trên mạng' : 'Đăng nhập để giữ nhân vật trên mọi máy', () => void ctx.openPanel('account'));
    dis.add(ctx.bus.on('auth', (a) => { accountRow.querySelector('small')!.textContent = a.loggedIn ? 'Đã đăng nhập · tiến độ được lưu trên mạng' : 'Đăng nhập để giữ nhân vật trên mọi máy'; }));
    section('Nhân vật & tài khoản', [
      linkRow('user', 'Đổi nhân vật', `${ctx.profile.name} · chọn lại pháp danh, áo và màu`, () => void changeCharacter(ctx)),
      linkRow('hanger', 'Trang phục', wardrobeLocked ? `Mở ở cấp ${ctx.progress.unlockLevel('wardrobe')}` : 'Phụ kiện đã mở khoá', () => {
        if (wardrobeLocked) ctx.toast(`Lên cấp ${ctx.progress.unlockLevel('wardrobe')} để mở tủ trang phục.`);
        else void ctx.openPanel('wardrobe');
      }),
      accountRow,
    ]);

    // ── Dữ liệu (cộng cả ruy-băng bồ đề `wish:list` lẫn đèn hoa đăng `lantern:wishes`)
    const countSavedWishes = (): number => load<unknown[]>('wish:list', []).length + load<unknown[]>('lantern:wishes', []).length;
    const wishCount = countSavedWishes();
    const wishRow = linkRow('ribbon', 'Lời nguyện đã lưu', wishCount ? `${wishCount} lời nguyện trên máy này · chạm để xoá hết` : 'Chưa có lời nguyện nào', () => {
      if (!countSavedWishes()) { ctx.toast('Chưa có lời nguyện nào để xoá.'); return; }
      confirmInline(wishRow, 'Xoá tất cả lời nguyện đã lưu?', 'Xoá', () => {
        remove('wish:list');
        remove('lantern:wishes');
        ctx.world.setWishRibbons(0);
        wishRow.querySelector('small')!.textContent = 'Chưa có lời nguyện nào';
        ctx.toast('Đã xoá các lời nguyện đã lưu.');
      });
    });
    const wipeRow = linkRow('trash', 'Xoá dữ liệu trên máy này', 'Nhân vật, tiến độ và cài đặt lưu trên thiết bị', () => {
      confirmInline(wipeRow, 'Xoá toàn bộ dữ liệu trên máy này?', 'Xoá hết', () => { clearAll(); location.reload(); }, true);
    }, '', true);
    section('Dữ liệu', [wishRow, wipeRow]);

    // ── Thông tin
    const a = (href: string, ic: IconName, text: string) => {
      const el = h('a', { class: 'pm-row', href, target: '_blank', rel: 'noopener' });
      el.innerHTML = `<span class="pm-row__lead">${icon(ic, { size: 22 })}</span><span class="pm-row__text pm-grow"><span>${esc(text)}</span></span>${icon('link', { size: 16 })}`;
      return el;
    };
    section('Thông tin', [
      a('/gioi-thieu/', 'info', 'Giới thiệu'),
      a('/noi-quy/', 'scroll', 'Nội quy chùa'),
      a('/dieu-khoan-su-dung/', 'book', 'Điều khoản sử dụng'),
      a('/chinh-sach-quyen-rieng-tu/', 'lock', 'Chính sách quyền riêng tư'),
    ]);
    view.append(h('p', { class: 'set-ver', text: `Chùa Liên Hoa · phiên bản ${APP_VERSION}` }), h('p', { class: 'set-ver set-ver--sub', text: 'Phần mềm độc lập, không phải chùa thật và không thuộc tổ chức tôn giáo nào.' }));

    /** Xác nhận ngay tại dòng (hai bước). */
    function confirmInline(row: HTMLElement, question: string, yes: string, run: () => void, danger = false): void {
      if (row.nextElementSibling?.classList.contains('set-confirm')) {
        row.nextElementSibling.remove();
        return;
      }
      const box = h('div', { class: 'set-confirm', role: 'alertdialog', 'aria-label': question }, [
        h('span', { text: question }),
        h('div', { class: 'row' }, [
          h('button', { type: 'button', class: 'btn btn--sm' + (danger ? ' btn--danger' : ' btn--gold'), text: yes, onclick: () => { box.remove(); run(); } }),
          h('button', { type: 'button', class: 'btn btn--sm btn--ghost', text: 'Không', onclick: () => box.remove() }),
        ]),
      ]);
      row.after(box);
      (box.querySelector('.btn--ghost') as HTMLElement).focus();
    }

    return dis.run;
  },
};
