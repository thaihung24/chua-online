/**
 * Panel "Hành trình" (toàn khung): bậc sen + cấp + tinh tấn, tab Hôm nay / Con đường sen / Dấu mốc / Sổ hành hương.
 * Dữ liệu: ctx.progress.view()/exportState(), `STAMPS`, `LIFETIME_LABELS`, `UNLOCK_INFO` từ @/core/quests.
 */
import type { ActionId, AppContext, DailyTask, PanelDef, PanelId, ProgressView, SpotId } from '@/core/contracts';
import { TIERS } from '@/core/contracts';
import { LIFETIME_LABELS, STAMPS, STAMP_GROUPS, STREAK_MILESTONES, UNLOCK_INFO } from '@/core/quests';
import { vnDayKey } from '@/core/store';
import { esc, fmt, h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { tierIcon } from '@/ui/tier-icon';

const PANELS = new Set<string>(['journey', 'rank', 'beads', 'chant', 'meditate', 'dharma', 'today', 'wardrobe', 'lantern', 'que', 'wish', 'rooms', 'settings', 'feedback', 'account', 'share', 'friends', 'install', 'sayings', 'listen', 'walkMeditation']);
const SPOTS = new Set<string>(['yard', 'bodhi', 'meditate', 'quanam', 'well', 'hall']);
const ACTIONS = new Set<string>(['pray', 'bow', 'sweep', 'incense', 'flowers', 'candle', 'bell', 'lantern', 'que', 'release', 'loc', 'wish']);
type Tab = 'today' | 'path' | 'stamps' | 'book';

interface RawState { lastLit?: string; milestones?: number[]; life?: Record<string, number>; spotsEver?: string[] }

function dayShift(key: string, delta: number): string {
  const d = new Date(key + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
const WD = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const panel: PanelDef = {
  id: 'journey',
  title: 'Hành trình',
  kind: 'view',
  mount(root, ctx: AppContext, params?: Record<string, unknown>) {
    const wrap = h('div', { class: 'view jn' });
    root.append(wrap);
    const validTabs: Tab[] = ['today', 'path', 'stamps', 'book'];
    let tab: Tab = typeof params?.tab === 'string' && validTabs.includes(params.tab as Tab) ? (params.tab as Tab) : 'today';
    let explainOpen = false;

    const head = h('header', { class: 'jn-head' });
    const bar = h('div', { class: 'jn-bar' });
    const tabs = h('div', { class: 'jn-tabs', role: 'tablist', 'aria-label': 'Mục hành trình' });
    const content = h('div', { class: 'jn-content', role: 'tabpanel', 'aria-live': 'polite' });
    wrap.append(head, bar, tabs, content);

    function runTask(t: DailyTask): void {
      const a = t.action as string | undefined;
      if (!a) return;
      ctx.closePanel();
      if (t.kind === 'walkSpot' && SPOTS.has(a)) { ctx.world.goTo(a as SpotId); ctx.toast('Đang đi tới điểm hôm nay…'); return; }
      if (PANELS.has(a)) { window.setTimeout(() => void ctx.openPanel(a as PanelId), 260); return; }
      if (ACTIONS.has(a)) { void ctx.world.perform(a as ActionId); return; }
      if (SPOTS.has(a)) ctx.world.goTo(a as SpotId);
    }

    function paintHead(v: ProgressView): void {
      const next = TIERS.find((t) => t.minLevel > v.level);
      const left = Math.max(0, v.xpForNext - v.xpIntoLevel);
      head.innerHTML = `<div class="jn-head__icon">${tierIcon(v.tier.id, { size: 84 })}</div>
        <div class="jn-head__text">
          <span class="jn-head__cap">Hành trình của bạn</span>
          <h1 class="jn-head__title">Cấp ${fmt(v.level)} · ${esc(v.tier.name)}</h1>
          <p class="jn-head__sub">còn <b>${fmt(left)}</b> tinh tấn tới Cấp ${fmt(v.level + 1)}${next ? ` · bậc kế: ${esc(next.name)} (cấp ${next.minLevel})` : ''}</p>
          <button type="button" class="jn-link" aria-expanded="${explainOpen}" aria-controls="jn-explain">Làm sao lên cấp?</button>
        </div>`;
      head.querySelector('.jn-link')!.addEventListener('click', () => { explainOpen = !explainOpen; paint(); });
      const explain = h('div', { class: 'jn-explain', id: 'jn-explain', hidden: explainOpen ? null : '' });
      explain.innerHTML = `<p>Mỗi lần công phu — lạy Phật, thắp hương, lần tràng hạt, tụng kinh, thiền, thả đèn hoa đăng… — bạn nhận <b>tinh tấn</b>. Đủ tinh tấn là lên cấp, hoa sen trong bạn lớn dần.</p>
        <ul><li>Mỗi ngày công phu có trần <b>${v.practiceCap}</b> tinh tấn; việc hôm nay và mốc giữ lửa được thưởng thêm ngoài trần.</li><li>Công phu mỗi ngày để <b>giữ lửa</b>: chuỗi ngày càng dài, càng có thêm thưởng.</li><li>Lên cấp sẽ mở dần các việc mới như dâng hoa, thắp nến, đèn hoa đăng, xin quẻ…</li></ul>`;
      if (explainOpen) head.append(explain);
    }

    function paintBar(v: ProgressView): void {
      const pct = Math.round(Math.max(0, Math.min(1, v.frac)) * 100);
      const cap = Math.min(v.practiceToday, v.practiceCap);
      bar.innerHTML = `<div class="pm-kv"><span class="muted">Tới Cấp ${fmt(v.level + 1)}</span><b>${fmt(v.xpIntoLevel)}/${fmt(v.xpForNext)}</b></div>
        <div class="pm-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${v.xpForNext}" aria-valuenow="${v.xpIntoLevel}" aria-label="Tinh tấn tới cấp tiếp theo"><span style="width:${pct}%"></span></div>
        <div class="jn-today-line">${icon('lotus', { size: 18 })}<span>Công phu hôm nay</span><b>${fmt(cap)}/${fmt(v.practiceCap)}</b></div>`;
    }

    function paintTabs(v: ProgressView): void {
      const defs: [Tab, string][] = [
        ['today', `Hôm nay <em>${v.tasksDone}/${v.tasks.length}</em>`],
        ['path', 'Con đường sen'],
        ['stamps', `Dấu mốc <em>${v.stamps.length}/${STAMPS.length}</em>`],
        ['book', 'Sổ hành hương'],
      ];
      tabs.innerHTML = defs.map(([id, label]) => `<button type="button" class="jn-tab" role="tab" data-t="${id}" aria-selected="${id === tab}">${label}</button>`).join('');
    }

    // ───── Tab: Hôm nay
    function tabToday(v: ProgressView): HTMLElement {
      const box = h('div', { class: 'stack' });
      const list = h('ul', { class: 'jn-tasks' });
      if (!v.tasks.length) list.append(h('li', { class: 'pm-empty', text: 'Hôm nay chưa có việc nào, bạn cứ công phu theo tâm mình nhé.' }));
      for (const t of v.tasks) {
        const li = h('li', { class: 'jn-task' + (t.done ? ' is-done' : '') });
        li.innerHTML = `<span class="jn-task__chk" aria-hidden="true">${t.done ? icon('check', { size: 16 }) : ''}</span>
          <span class="jn-task__main"><b>${esc(t.label)}</b><small>${t.done ? 'Đã hoàn thành' : `${t.progress}/${t.target}`} · <i>+${t.xp} tinh tấn</i></small></span>`;
        if (!t.done && t.action) {
          const go = h('button', { type: 'button', class: 'btn btn--sm btn--ghost', text: 'Đi', 'aria-label': `Đi làm: ${t.label}` });
          go.addEventListener('click', () => runTask(t));
          li.append(go);
        }
        list.append(li);
      }
      const allDone = v.tasks.length > 0 && v.tasksDone === v.tasks.length;
      box.append(h('div', { class: 'jn-card' }, [
        h('div', { class: 'jn-card__title' }, [h('b', { text: 'Việc hôm nay' }), h('span', { class: 'pm-pill', text: `${v.tasksDone}/${v.tasks.length}` })]),
        list,
        allDone ? h('p', { class: 'pm-msg pm-msg--ok', html: `${icon('sparkles', { size: 16 })} Bạn đã trọn ba việc hôm nay. Tùy hỷ công đức!` }) : null,
      ]));

      // Chuỗi giữ lửa: lịch 7 ngày
      let st: RawState = {};
      try { st = (ctx.progress.exportState() as RawState) ?? {}; } catch { /* bỏ qua */ }
      const today = vnDayKey();
      const lit = new Set<string>();
      if (v.litToday) lit.add(today);
      const anchor = st.lastLit && st.lastLit <= today ? st.lastLit : '';
      if (anchor && v.streak > 0) for (let i = 0; i < v.streak; i++) lit.add(dayShift(anchor, -i));
      const days = Array.from({ length: 7 }, (_, i) => dayShift(today, i - 6));
      const cal = h('div', { class: 'jn-week' }, days.map((k) => {
        const isLit = lit.has(k);
        const wd = WD[new Date(k + 'T00:00:00Z').getUTCDay()];
        return h('div', { class: 'jn-day' + (isLit ? ' is-lit' : '') + (k === today ? ' is-today' : ''), 'aria-label': `${wd}: ${isLit ? 'đã giữ lửa' : 'chưa'}`, html: `<span class="jn-day__flame">${icon('flame', { size: 22 })}</span><small>${k === today ? 'Nay' : wd}</small>` });
      }));
      const earnedMs = new Set<number>(st.milestones ?? []);
      const nextMs = STREAK_MILESTONES.find((m) => !earnedMs.has(m.days) && v.best < m.days);
      const msRow = h('div', { class: 'jn-milestones', 'aria-label': 'Các mốc giữ lửa' }, STREAK_MILESTONES.map((m) => {
        const done = earnedMs.has(m.days) || v.best >= m.days;
        const isNext = nextMs?.days === m.days;
        return h('span', { class: 'jn-ms' + (done ? ' is-done' : isNext ? ' is-next' : ''), title: `Mốc ${m.days} ngày: +${m.xp} tinh tấn`, html: `${done ? icon('check', { size: 12 }) : ''}${m.days} ngày <i>+${m.xp}</i>` });
      }));
      box.append(h('div', { class: 'jn-card' }, [
        h('div', { class: 'jn-card__title' }, [h('b', { text: 'Chuỗi giữ lửa' }), h('span', { class: 'pm-pill', html: `${icon('flame', { size: 13 })}${v.streak} ngày` })]),
        cal,
        h('div', { class: 'jn-streak-info' }, [
          h('span', { html: `Kỷ lục: <b>${v.best}</b> ngày` }),
          h('span', { html: `Ngày nghỉ còn: <b>${v.restDays}</b>` }),
        ]),
        msRow,
        h('p', { class: 'muted jn-small', text: v.litToday ? 'Hôm nay lửa đã được thắp. Mai nhớ ghé chùa nhé.' : 'Công phu một chút hôm nay để giữ lửa. Cứ mỗi 7 ngày công phu, bạn được tích thêm một ngày nghỉ (tối đa 2) để giữ chuỗi khi lỡ một ngày.' }),
      ]));
      return box;
    }

    // ───── Tab: Con đường sen
    function tabPath(v: ProgressView): HTMLElement {
      const box = h('div', { class: 'stack' });
      const list = h('ol', { class: 'jn-tiers' });
      TIERS.forEach((t, i) => {
        const nextMin = TIERS[i + 1]?.minLevel ?? Infinity;
        const state = v.level >= nextMin ? 'done' : v.level >= t.minLevel ? 'now' : 'todo';
        const li = h('li', { class: `jn-tier is-${state}` });
        const span = Number.isFinite(nextMin) ? nextMin - t.minLevel : 1;
        const frac = state === 'done' ? 1 : state === 'now' ? (Number.isFinite(nextMin) ? (v.level - t.minLevel + v.frac) / span : 1) : 0;
        li.innerHTML = `<span class="jn-tier__icon">${tierIcon(t.id, { size: 52 })}</span>
          <span class="jn-tier__main"><b>${esc(t.name)}</b><small>Từ cấp ${t.minLevel}${Number.isFinite(nextMin) ? ` đến cấp ${nextMin - 1}` : ' trở đi'}</small>
          ${state === 'todo' ? '' : `<span class="pm-bar jn-tier__bar"><span style="width:${Math.round(Math.min(1, frac) * 100)}%"></span></span>`}</span>
          <span class="jn-tier__state">${state === 'done' ? `${icon('check', { size: 18 })}` : state === 'now' ? '<span class="pm-pill">Đang ở đây</span>' : icon('lock', { size: 16 })}</span>`;
        list.append(li);
      });
      box.append(list);

      const byLevel = new Map<number, string[]>();
      for (const info of Object.values(UNLOCK_INFO)) if (info.level > 1) byLevel.set(info.level, [...(byLevel.get(info.level) ?? []), info.label]);
      const unl = h('div', { class: 'jn-card' }, [h('div', { class: 'jn-card__title' }, [h('b', { text: 'Mở khoá theo cấp' })])]);
      const ul = h('ul', { class: 'jn-unlocks' });
      for (const [lv, names] of [...byLevel.entries()].sort((a, b) => a[0] - b[0])) {
        const ok = v.level >= lv;
        ul.append(h('li', { class: ok ? 'is-ok' : '', html: `<span class="jn-unlock__lv">Cấp ${lv}</span><span>${esc(names.join(', '))}</span><span class="jn-unlock__st">${icon(ok ? 'check' : 'lock', { size: 16 })}</span>` }));
      }
      unl.append(ul);
      box.append(unl);
      return box;
    }

    // ───── Tab: Dấu mốc
    function tabStamps(v: ProgressView): HTMLElement {
      const box = h('div', { class: 'stack' });
      const own = new Set(v.stamps);
      for (const g of STAMP_GROUPS) {
        const items = STAMPS.filter((s) => s.group === g);
        if (!items.length) continue;
        const got = items.filter((s) => own.has(s.id)).length;
        const grid = h('div', { class: 'jn-stamps' });
        for (const s of items) {
          const on = own.has(s.id);
          grid.append(h('div', { class: 'jn-stamp' + (on ? ' is-on' : ''), html: `<span class="jn-stamp__medal">${icon(on ? 'sparkle' : 'lock', { size: 20 })}</span><span class="jn-stamp__txt"><b>${esc(s.name)}</b><small>${esc(s.desc)}</small></span>` }));
        }
        box.append(h('section', {}, [h('h2', { class: 'pm-sec__title', html: `${esc(g)} <em>${got}/${items.length}</em>` }), grid]));
      }
      return box;
    }

    // ───── Tab: Sổ hành hương
    function tabBook(v: ProgressView): HTMLElement {
      let st: RawState = {};
      try { st = (ctx.progress.exportState() as RawState) ?? {}; } catch { /* bỏ qua */ }
      const life = st.life ?? {};
      const grid = h('div', { class: 'stats jn-book' });
      const add = (value: number, label: string): void => {
        grid.append(h('div', { class: 'stat', html: `<span class="stat__value">${fmt(value)}</span><span class="stat__label">${esc(label)}</span>` }));
      };
      add(v.xp, 'Tổng tinh tấn');
      add(v.best, 'Chuỗi giữ lửa dài nhất');
      for (const [k, label] of Object.entries(LIFETIME_LABELS)) add(life[k] ?? 0, label);
      return h('div', { class: 'stack' }, [h('p', { class: 'muted', text: 'Những công phu bạn đã làm từ ngày đầu ghé chùa — mỗi con số là một bước chân trên con đường sen.' }), grid]);
    }

    function paint(): void {
      const v = ctx.progress.view();
      paintHead(v);
      paintBar(v);
      paintTabs(v);
      content.replaceChildren(tab === 'today' ? tabToday(v) : tab === 'path' ? tabPath(v) : tab === 'stamps' ? tabStamps(v) : tabBook(v));
    }
    tabs.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-t]');
      if (!b) return;
      tab = b.dataset.t as Tab;
      paint();
      (tabs.querySelector(`[data-t="${tab}"]`) as HTMLElement | null)?.focus();
    });
    tabs.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const order: Tab[] = ['today', 'path', 'stamps', 'book'];
      const i = order.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1);
      tab = order[(i + order.length) % order.length];
      paint();
      (tabs.querySelector(`[data-t="${tab}"]`) as HTMLElement | null)?.focus();
    });
    paint();
    const off = ctx.progress.onChange(() => paint());
    return () => off();
  },
};
