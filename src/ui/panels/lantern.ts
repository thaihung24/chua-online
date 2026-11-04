/**
 * Panel "Thả đèn hoa đăng" (hộp thoại): chọn màu đèn, ý nguyện, lời nguyện tuỳ chọn (chỉ lưu trên máy),
 * thả lên ao sen (giới hạn 1 đèn/10 giây) và xem/xoá các lời nguyện đã thả.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { load, save } from '@/core/store';
import { LANTERN_COLORS, LANTERN_INTENTS } from '@/content/lantern';
import { icon } from '@/ui/icons';
import { createScope, dialogHead, h, haptic, liveRegion, uid } from './practice-kit';

const MAX_LEN = 120;
const COOLDOWN_MS = 10_000;
const KEEP = 50;
const KEY = 'lantern:wishes';

interface SavedWish { id: string; color: string; colorName: string; intent: string; text: string; at: number }

let lastLaunch = 0; // dùng chung giữa các lần mở panel

const lanternSvg = (hex: string): string => `
<svg viewBox="0 0 64 80" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="lt-${hex.slice(1)}" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#fff6d8"/><stop offset=".45" stop-color="${hex}"/><stop offset="1" stop-color="${hex}" stop-opacity=".78"/></radialGradient>
  </defs>
  <path d="M32 2v8" stroke="#c9a05a" stroke-width="2" stroke-linecap="round"/>
  <rect x="18" y="9" width="28" height="7" rx="3" fill="#6a4426" stroke="#e0b25c" stroke-width="1"/>
  <path d="M18 16 C6 26 6 56 18 66 L46 66 C58 56 58 26 46 16 Z" fill="url(#lt-${hex.slice(1)})" stroke="rgba(255,235,190,.7)" stroke-width="1.2"/>
  <path d="M32 16 C22 28 22 54 32 66 M32 16 C42 28 42 54 32 66 M13 40 H51" fill="none" stroke="rgba(90,50,20,.3)" stroke-width="1"/>
  <rect x="18" y="66" width="28" height="6" rx="3" fill="#6a4426" stroke="#e0b25c" stroke-width="1"/>
  <path d="M28 72v7M32 72v8M36 72v7" stroke="#e0b25c" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const fmtWhen = (t: number): string => {
  const d = new Date(t);
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} · ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const panel: PanelDef = {
  id: 'lantern',
  title: 'Thả đèn hoa đăng',
  kind: 'dialog',
  mount(root: HTMLElement, ctx: AppContext) {
    const scope = createScope();
    const live = liveRegion();
    let wishes = load<SavedWish[]>(KEY, []);
    let colorId = LANTERN_COLORS[0]?.id ?? 'vang';
    let intent = '';
    let listOpen = false;

    const colorWrap = h('div', { class: 'lantern-colors', role: 'radiogroup', 'aria-label': 'Màu đèn' });
    const meaning = h('p', { class: 'lantern-meaning', 'aria-live': 'polite' });
    const intentWrap = h('div', { class: 'lantern-intents', role: 'group', 'aria-label': 'Ý nguyện của ngọn đèn' });
    const ta = h('textarea', {
      class: 'textarea lantern-text', maxlength: MAX_LEN, rows: 3, placeholder: 'Điều bạn muốn gửi vào ánh đèn…', 'aria-label': 'Lời nguyện', 'aria-describedby': 'lantern-left',
    });
    const left = h('span', { class: 'field__hint lantern-left', id: 'lantern-left', 'aria-live': 'off' });
    const goBtn = h('button', { type: 'button', class: 'btn btn--gold btn--lg btn--block lantern-go', onclick: release });
    const listHead = h('button', { type: 'button', class: 'lantern-listhead', 'aria-expanded': 'false', onclick: () => { listOpen = !listOpen; paintList(); } });
    const listBody = h('div', { class: 'lantern-list' });

    const color = (): (typeof LANTERN_COLORS)[number] => LANTERN_COLORS.find((c) => c.id === colorId) ?? LANTERN_COLORS[0]!;

    function paintColors(): void {
      colorWrap.replaceChildren(...LANTERN_COLORS.map((c) => h('button', {
        type: 'button', class: `lantern-color${c.id === colorId ? ' is-on' : ''}`, role: 'radio', 'aria-checked': String(c.id === colorId), 'aria-label': c.name,
        style: `--c:${c.hex}`, onclick: () => { colorId = c.id; haptic(6); paintColors(); },
      }, [h('span', { class: 'lantern-color__lamp', html: lanternSvg(c.hex) }), h('span', { class: 'lantern-color__name', text: c.name })])));
      meaning.textContent = color().meaning;
      meaning.style.setProperty('--c', color().hex);
    }
    function paintIntents(): void {
      intentWrap.replaceChildren(...LANTERN_INTENTS.map((t) => h('button', {
        type: 'button', class: 'chip lantern-intent', 'aria-pressed': String(intent === t), text: t,
        onclick: () => { intent = intent === t ? '' : t; paintIntents(); },
      })));
    }
    function paintLeft(): void { left.textContent = `Còn ${MAX_LEN - ta.value.length} ký tự`; }
    function paintGo(): void {
      const wait = Math.ceil((lastLaunch + COOLDOWN_MS - Date.now()) / 1000);
      if (wait > 0) {
        goBtn.setAttribute('aria-disabled', 'true');
        goBtn.replaceChildren(h('span', { html: icon('clock', { size: 18 }) }), h('span', { text: `Đèn đang trôi… (${wait}s)` }));
      } else {
        goBtn.removeAttribute('aria-disabled');
        goBtn.replaceChildren(h('span', { html: icon('lantern', { size: 20 }) }), h('span', { text: 'Thả đèn' }));
      }
    }
    function paintList(): void {
      listHead.setAttribute('aria-expanded', String(listOpen));
      listHead.replaceChildren(
        h('span', { text: `Lời nguyện đã thả (${wishes.length})` }),
        h('span', { class: 'lantern-listhead__chev', html: icon(listOpen ? 'chevron-up' : 'chevron-down', { size: 18 }) }),
      );
      listBody.hidden = !listOpen;
      if (!listOpen) return;
      if (!wishes.length) { listBody.replaceChildren(h('p', { class: 'muted lantern-empty', text: 'Chưa có lời nguyện nào. Ngọn đèn đầu tiên sẽ ở đây.' })); return; }
      listBody.replaceChildren(...wishes.map((w) => h('div', { class: 'lantern-item', style: `--c:${LANTERN_COLORS.find((c) => c.id === w.color)?.hex ?? '#f3c25a'}` }, [
        h('span', { class: 'lantern-item__dot', 'aria-hidden': 'true' }),
        h('div', { class: 'lantern-item__body' }, [
          h('strong', { text: w.intent || 'Tùy tâm' }),
          w.text ? h('span', { class: 'lantern-item__text', text: w.text }) : null,
          h('span', { class: 'muted lantern-item__when', text: `Đèn ${w.colorName.toLowerCase()} · ${fmtWhen(w.at)}` }),
        ]),
        h('button', {
          type: 'button', class: 'icon-btn lantern-item__del', 'aria-label': 'Xóa lời nguyện này', html: icon('trash', { size: 16 }),
          onclick: () => { wishes = wishes.filter((x) => x.id !== w.id); save(KEY, wishes); paintList(); live.textContent = 'Đã xóa lời nguyện.'; },
        }),
      ])));
    }

    function release(): void {
      const wait = lastLaunch + COOLDOWN_MS - Date.now();
      if (wait > 0) { ctx.toast('Đèn vừa thả còn đang trôi. Bạn chờ một chút rồi thả tiếp nhé.', { kind: 'warn' }); return; }
      lastLaunch = Date.now();
      const c = color();
      const id = uid('lt');
      const text = ta.value.trim().slice(0, MAX_LEN);
      if (text || intent) {
        wishes = [{ id, color: c.id, colorName: c.name, intent, text, at: Date.now() }, ...wishes].slice(0, KEEP);
        save(KEY, wishes);
      }
      haptic(16);
      ctx.audio.play('lantern');
      ctx.world.perform('lantern', { payload: { color: c.hex, id } }).catch(() => undefined);
      ctx.world.addLantern({ id, color: c.hex, mine: true, pond: 'lotus' });
      ctx.net.sendLantern(c.hex);
      ctx.progress.record('lantern');
      ctx.toast('Đèn hoa đăng đã được thả. Nguyện lời cầu an lan tỏa.', { kind: 'good' });
      ctx.closePanel();
    }

    ta.addEventListener('input', paintLeft);
    root.append(h('div', { class: 'pk-dialog lantern-dialog' }, [
      dialogHead('Thả đèn hoa đăng', () => ctx.closePanel(), 'Mỗi ngọn đèn mang một lời nguyện lên mặt hồ sen.'),
      h('section', { class: 'lantern-sec' }, [h('h3', { class: 'pk-label', text: 'Màu đèn' }), colorWrap, meaning]),
      h('section', { class: 'lantern-sec' }, [h('h3', { class: 'pk-label', text: 'Ý nguyện của ngọn đèn' }), intentWrap]),
      h('section', { class: 'lantern-sec field' }, [
        h('label', { class: 'pk-label', for: 'lantern-ta', text: 'Lời nguyện (không bắt buộc)' }),
        ta, left,
        h('p', { class: 'lantern-private muted' }, [h('span', { html: icon('lock', { size: 14 }) }), h('span', { text: 'Lời nguyện chỉ lưu trên máy này — không gửi đi đâu. Người khác chỉ thấy màu ngọn đèn.' })]),
      ]),
      goBtn,
      h('section', { class: 'lantern-sec lantern-history' }, [listHead, listBody]),
      live,
    ]));
    ta.id = 'lantern-ta';
    paintColors(); paintIntents(); paintLeft(); paintGo(); paintList();
    scope.interval(paintGo, 500);
    return () => scope.dispose();
  },
};
