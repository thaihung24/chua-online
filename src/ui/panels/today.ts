/**
 * Panel "Hôm nay" (hộp thoại): ngày dương + âm, ngày rằm/mùng một/lễ, chuỗi giữ lửa,
 * 3 việc hôm nay, lời dạy trong ngày, thẻ lời nhắc (mỗi ngày rút một lần) và lịch tháng.
 */
import type { ActionId, AppContext, DailyTask, PanelDef, SpotId } from '@/core/contracts';
import { load, save } from '@/core/store';
import { lunarLabel, monthGrid, nextSpecial, solarToLunar, specialDays, todayVN } from '@/core/lunar';
import { REMINDERS, reminderFor, teachingOfDay, type Reminder } from '@/content/teachings';
import { icon } from '@/ui/icons';
import { PANEL_IDS, WEEKDAYS, createScope, dialogHead, h, haptic, liveRegion, today } from './practice-kit';

const SPOTS: SpotId[] = ['yard', 'bodhi', 'meditate', 'quanam', 'well', 'hall'];
const WD_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const panel: PanelDef = {
  id: 'today',
  title: 'Hôm nay',
  kind: 'dialog',
  mount(root: HTMLElement, ctx: AppContext) {
    const scope = createScope();
    const live = liveRegion();
    const day = today();
    const now = todayVN();
    const lunar = solarToLunar(now.y, now.m, now.d);
    let calY = now.y;
    let calM = now.m;
    const drawKey = `today:draw:${day}`;

    function goTask(t: DailyTask): void {
      const a = t.action;
      if (!a) return;
      if ((PANEL_IDS as readonly string[]).includes(a)) { void ctx.openPanel(a as never); return; }
      ctx.closePanel();
      if ((SPOTS as readonly string[]).includes(a)) ctx.world.goTo(a as SpotId);
      else void ctx.world.perform(a as ActionId);
    }

    // ═══════════════ TRANG CHÍNH ═══════════════
    function renderMain(): void {
      const view = ctx.progress.view();
      const specials = specialDays(lunar);
      let badge: HTMLElement;
      if (specials.length) {
        badge = h('div', { class: 'today-badge is-today' }, [
          h('span', { html: icon(specials[0]!.kind === 'festival' ? 'sparkles' : 'lotus', { size: 18 }) }),
          h('span', { text: specials.map((s) => (s.kind === 'ram' ? 'Hôm nay là ngày rằm' : s.kind === 'mung1' ? 'Hôm nay là mùng một' : `Hôm nay là ${s.label}`)).join(' · ') }),
        ]);
      } else {
        const ns = nextSpecial();
        badge = h('div', { class: 'today-badge' }, [
          h('span', { html: icon('calendar', { size: 18 }) }),
          h('span', { text: ns.inDays <= 0 ? `Hôm nay là ${ns.label}` : `Còn ${ns.inDays} ngày nữa là ${ns.label}` }),
        ]);
      }

      const dateCard = h('div', { class: 'today-date' }, [
        h('div', { class: 'today-date__big' }, [
          h('span', { class: 'today-date__wd', text: WEEKDAYS[now.weekday] ?? '' }),
          h('span', { class: 'today-date__d', text: String(now.d) }),
          h('span', { class: 'today-date__m', text: `tháng ${now.m} · ${now.y}` }),
        ]),
        h('div', { class: 'today-date__lunar' }, [
          h('span', { class: 'today-date__moon', html: icon('moon', { size: 20 }) }),
          h('div', {}, [
            h('strong', { text: `Âm lịch ${lunar.day}/${lunar.month}${lunar.leap ? ' (nhuận)' : ''}` }),
            h('span', { class: 'muted', text: lunarLabel(lunar) }),
          ]),
        ]),
      ]);

      const streak = h('div', { class: `today-streak${view.litToday ? ' is-lit' : ''}` }, [
        h('div', { class: 'today-streak__flame', 'aria-hidden': 'true', html: icon('flame', { size: 28 }) }),
        h('div', { class: 'today-streak__text' }, [
          h('strong', { text: view.streak > 0 ? `Giữ lửa ${view.streak} ngày` : 'Chưa có chuỗi giữ lửa' }),
          h('span', { class: 'muted', text: view.litToday ? 'Hôm nay lửa đã được giữ. Tùy duyên mà tiến tu nhé.' : 'Hôm nay chưa giữ lửa — một nén hương hay vài hạt niệm là đủ.' }),
        ]),
        view.best > 0 ? h('span', { class: 'chip today-streak__best', text: `Dài nhất ${view.best}` }) : null,
      ]);

      const tasks = (view.tasks ?? []).slice(0, 3);
      const taskList = h('ul', { class: 'today-tasks' }, tasks.map((t) => h('li', { class: `today-task${t.done ? ' is-done' : ''}` }, [
        h('span', { class: 'today-task__check', 'aria-hidden': 'true', html: t.done ? icon('check', { size: 16 }) : '' }),
        h('span', { class: 'today-task__label' }, [
          h('span', { text: t.label }),
          t.target > 1 ? h('em', { class: 'muted', text: `${Math.min(t.progress, t.target)}/${t.target}` }) : null,
        ]),
        t.done || !t.action
          ? h('span', { class: 'today-task__xp muted', text: t.done ? 'Xong' : '' })
          : h('button', { type: 'button', class: 'btn btn--ghost btn--sm today-task__go', 'aria-label': `Đi: ${t.label}`, onclick: () => goTask(t) }, [h('span', { text: 'Đi' }), h('span', { html: icon('chevron-right', { size: 14 }) })]),
      ])));

      // thẻ lời nhắc
      let drawn = load<Reminder | null>(drawKey, null);
      const front = h('div', { class: 'today-flip__face today-flip__front' });
      const paintFront = (r: Reminder): void => front.replaceChildren(
        h('span', { class: 'today-flip__tag', text: 'Lời nhắc hôm nay' }),
        h('strong', { class: 'today-flip__title', text: r.title }),
        h('p', { class: 'today-flip__text', text: r.text }),
      );
      const back = h('div', { class: 'today-flip__face today-flip__back' }, [
        h('span', { class: 'today-flip__lotus', html: icon('lotus', { size: 38 }) }),
        h('strong', { text: 'Chạm để nhận lời nhắc' }),
        h('span', { class: 'muted', text: 'Mỗi ngày một lời nhắc nhỏ cho công phu' }),
      ]);
      const inner = h('div', { class: 'today-flip__inner' }, [back, front]);
      const flip = h('div', { class: 'today-flip', role: 'button', tabindex: 0, 'aria-label': 'Chạm để nhận lời nhắc hôm nay' }, [inner]);
      flip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip.click(); } });
      const setFlipped = (v: boolean): void => {
        flip.classList.toggle('is-flipped', v);
        flip.setAttribute('aria-label', v ? 'Lời nhắc hôm nay' : 'Chạm để nhận lời nhắc hôm nay');
        flip.setAttribute('aria-pressed', String(v));
      };
      if (drawn) { paintFront(drawn); setFlipped(true); }
      flip.addEventListener('click', () => {
        if (drawn) return;
        const r = reminderFor(day, 0) ?? REMINDERS[0];
        if (!r) return;
        drawn = r;
        save(drawKey, r);
        paintFront(r);
        haptic(14);
        ctx.audio.play('chime', { volume: 0.6 });
        setFlipped(true);
        ctx.progress.record('today');
        live.textContent = `Lời nhắc hôm nay: ${r.title}. ${r.text}`;
      });

      root.replaceChildren(h('div', { class: 'pk-dialog today-dialog' }, [
        dialogHead('Hôm nay', () => ctx.closePanel()),
        dateCard,
        badge,
        streak,
        h('section', { class: 'today-sec', 'aria-labelledby': 'today-tasks-h' }, [
          h('h3', { class: 'today-sec__title', id: 'today-tasks-h' }, [h('span', { text: 'Ba việc hôm nay' }), h('em', { class: 'muted', text: `${view.tasksDone}/${tasks.length}` })]),
          tasks.length ? taskList : h('p', { class: 'muted', text: 'Hôm nay chưa có việc nào được giao. Cứ thong thả đi chùa nhé.' }),
        ]),
        h('blockquote', { class: 'today-quote' }, [
          h('span', { class: 'today-quote__label', text: 'Một lời cho hôm nay' }),
          h('p', { text: teachingOfDay(day) }),
        ]),
        flip,
        h('button', { type: 'button', class: 'btn btn--ghost btn--block today-calbtn', onclick: () => renderCalendar() }, [
          h('span', { html: icon('calendar', { size: 18 }) }), h('span', { text: 'Xem lịch tháng' }),
        ]),
      ]), live);
    }

    // ═══════════════ LỊCH THÁNG ═══════════════
    function renderCalendar(): void {
      const cells = monthGrid(calY, calM);
      const startWd = cells.length ? new Date(Date.UTC(cells[0]!.y, cells[0]!.m - 1, cells[0]!.d)).getUTCDay() : 1;
      const heads = Array.from({ length: 7 }, (_, i) => WD_SHORT[(startWd + i) % 7]!);
      const isToday = (c: { y: number; m: number; d: number }): boolean => c.y === now.y && c.m === now.m && c.d === now.d;
      const grid = h('div', { class: 'today-cal__grid', role: 'grid', 'aria-label': `Lịch tháng ${calM} năm ${calY}` }, [
        ...heads.map((t) => h('span', { class: 'today-cal__wd', role: 'columnheader', text: t })),
        ...cells.map((c) => {
          const ram = c.specials.some((s) => s.kind === 'ram');
          const m1 = c.specials.some((s) => s.kind === 'mung1');
          const fest = c.specials.find((s) => s.kind === 'festival');
          const lunarTxt = c.lunar.day === 1 ? `1/${c.lunar.month}` : String(c.lunar.day);
          const label = `${c.d}/${c.m}, âm lịch ${c.lunar.day}/${c.lunar.month}${c.specials.length ? ', ' + c.specials.map((s) => s.label).join(', ') : ''}`;
          return h('div', {
            class: `today-cal__cell${c.inMonth ? '' : ' is-out'}${isToday(c) ? ' is-today' : ''}${ram ? ' is-ram' : ''}${m1 ? ' is-m1' : ''}${fest ? ' is-fest' : ''}`,
            role: 'gridcell', 'aria-label': label, title: c.specials.map((s) => s.label).join(' · ') || undefined,
          }, [
            h('b', { text: String(c.d) }),
            h('small', { text: lunarTxt }),
            fest ? h('i', { class: 'today-cal__star', 'aria-hidden': 'true' }) : null,
          ]);
        }),
      ]);
      /** Nếu ngày vừa là rằm/mùng một vừa là lễ thì chỉ hiện tên lễ cho gọn. */
      const names = (c: (typeof cells)[number]): string[] => {
        const fest = c.specials.filter((s) => s.kind === 'festival');
        return (fest.length ? fest : c.specials).map((s) => s.label);
      };
      const events = cells.filter((c) => c.inMonth && c.specials.length).map((c) => h('li', {}, [
        h('b', { text: `${c.d}/${c.m}` }),
        h('span', { class: 'muted', text: `Âm ${c.lunar.day}/${c.lunar.month}` }),
        h('span', { text: names(c).join(' · ') }),
      ]));
      const shift = (n: number): void => {
        const d = new Date(Date.UTC(calY, calM - 1 + n, 1));
        calY = d.getUTCFullYear(); calM = d.getUTCMonth() + 1;
        renderCalendar();
      };
      root.replaceChildren(h('div', { class: 'pk-dialog today-dialog today-cal' }, [
        dialogHead('Lịch tháng', () => ctx.closePanel()),
        h('div', { class: 'today-cal__nav' }, [
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Tháng trước', onclick: () => shift(-1), html: icon('chevron-left', { size: 20 }) }),
          h('strong', { text: `Tháng ${calM} · ${calY}` }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Tháng sau', onclick: () => shift(1), html: icon('chevron-right', { size: 20 }) }),
        ]),
        grid,
        h('div', { class: 'today-cal__legend muted' }, [
          h('span', {}, [h('i', { class: 'lg lg--ram' }), 'Rằm']),
          h('span', {}, [h('i', { class: 'lg lg--m1' }), 'Mùng một']),
          h('span', {}, [h('i', { class: 'lg lg--fest' }), 'Ngày lễ']),
        ]),
        events.length ? h('ul', { class: 'today-cal__events' }, events) : null,
        h('button', { type: 'button', class: 'btn btn--block', onclick: () => { calY = now.y; calM = now.m; renderMain(); } }, [
          h('span', { html: icon('chevron-left', { size: 16 }) }), h('span', { text: 'Về hôm nay' }),
        ]),
      ]), live);
    }

    renderMain();
    return () => { scope.dispose(); };
  },
};
