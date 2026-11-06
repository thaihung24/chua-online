/**
 * Thẻ "Việc hôm nay" nổi bên trái HUD (thu gọn được): pháp danh + bậc sen, thanh tinh tấn,
 * 3 việc hôm nay (nút Đi/Mở), thưởng làm đủ, "Bảy đóa sen" theo chuỗi giữ lửa và lịch sắp tới
 * (rằm / mùng một, công phu chung 05:00 · 18:00 giờ Việt Nam).
 */
import type { AppContext, ChickenState, ProgressView, SpotId } from '@/core/contracts';
import { TASK_ALL_BONUS } from '@/core/quests';
import { nextSpecial } from '@/core/lunar';
import { load, save } from '@/core/store';
import { SPOTS } from '@/world/layout';
import { esc, fmt } from './dom';
import { icon, type IconName } from './icons';
import { tierIcon } from './tier-icon';
import { runDailyTask, taskIcon, taskVerb } from './task-run';

export interface QuestCard {
  readonly el: HTMLElement;
  update(v: ProgressView): void;
  setChicken(st: ChickenState): void;
  destroy(): void;
}

const QUICK_SPOTS: { id: SpotId; label: string; icon: IconName }[] = [
  { id: 'hall', label: 'Chánh điện', icon: 'home' },
  { id: 'yard', label: 'Ao sen', icon: 'lotus' },
  { id: 'bodhi', label: 'Cây bồ đề', icon: 'tree' },
  { id: 'coop', label: 'Chuồng gà', icon: 'chicken' },
];

const VN_MS = 7 * 3_600_000;

/** Công phu chung kế tiếp (05:00 hoặc 18:00 giờ VN, mỗi khung kéo dài 30 phút). */
export function nextCommunity(now = Date.now()): { label: string; live: boolean } {
  const vn = new Date(now + VN_MS);
  const mins = vn.getUTCHours() * 60 + vn.getUTCMinutes();
  for (const h of [5, 18]) {
    if (mins >= h * 60 && mins < h * 60 + 30) return { label: `Công phu chung đang diễn ra (${String(h).padStart(2, '0')}:00)`, live: true };
  }
  if (mins < 5 * 60) return { label: 'Công phu chung 05:00', live: false };
  if (mins < 18 * 60) return { label: 'Công phu chung 18:00', live: false };
  return { label: 'Công phu chung 05:00 sáng mai', live: false };
}

/** Số đóa sen đã nở trong vòng 7 ngày hiện tại của chuỗi giữ lửa. */
export function bloomedLotus(streak: number, litToday: boolean): number {
  if (streak <= 0) return 0;
  if (litToday) return ((streak - 1) % 7) + 1;
  return streak % 7;
}

export function createQuestCard(ctx: AppContext, opts: { onLayout?: () => void } = {}): QuestCard {
  const narrow = typeof matchMedia === 'function' && matchMedia('(max-width: 560px), (max-height: 620px)').matches;
  let open = load<boolean>('quest:open', !narrow);
  let lastDone = new Set<string>();
  let lastXp = -1;
  let first = true;

  const el = document.createElement('section');
  el.className = 'qc glass';
  el.setAttribute('aria-label', 'Việc hôm nay');
  el.innerHTML = `
    <div class="qc__head">
      <button type="button" class="qc__me" aria-label="Mở Hành trình">
        <span class="qc__avatar" aria-hidden="true"></span>
        <span class="qc__id"><b class="qc__name"></b><small class="qc__tier"></small></span>
      </button>
      <button type="button" class="qc__toggle" aria-controls="qc-body">${icon('chevron-up', { size: 18 })}</button>
    </div>
    <div class="qc__xp"><div class="qc__bar" role="progressbar" aria-valuemin="0" aria-label="Tinh tấn tới cấp tiếp theo"><span></span></div><small class="qc__xpn"></small></div>
    <div class="qc__body" id="qc-body">
      <ul class="qc__tasks"></ul>
      <p class="qc__bonus"></p>
      <div class="qc__quick" role="group" aria-label="Lối đi nhanh">
        ${QUICK_SPOTS.map((s) => `<button type="button" class="qc__spot" data-spot="${s.id}">${icon(s.icon, { size: 15 })}<span>${esc(s.label)}</span>${s.id === 'coop' ? '<i class="qc__spot-dot" hidden aria-hidden="true"></i>' : ''}</button>`).join('')}
      </div>
      <p class="qc__lotus"></p>
      <ul class="qc__soon"></ul>
    </div>`;

  const q = <T extends Element = HTMLElement>(s: string) => el.querySelector(s) as T;
  const meBtn = q<HTMLButtonElement>('.qc__me');
  const toggle = q<HTMLButtonElement>('.qc__toggle');
  const body = q('.qc__body');
  const tasksEl = q('.qc__tasks');
  const quickEl = q('.qc__quick');
  const coopBtn = q<HTMLButtonElement>('.qc__spot[data-spot="coop"]');
  const coopDot = q<HTMLElement>('.qc__spot-dot');

  meBtn.addEventListener('click', () => void ctx.openPanel('journey'));
  toggle.addEventListener('click', () => { open = !open; save('quest:open', open); paintOpen(); opts.onLayout?.(); });
  quickEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-spot]');
    if (!b) return;
    const id = b.dataset.spot as SpotId;
    const st = ctx.world.getChickenState();
    if (id === 'coop' && st.carrying) {
      void ctx.world.perform('returnChicken');
      return;
    }
    if (id === 'coop' && st.lostCount > 0) {
      if (ctx.world.goToLostChicken()) {
        ctx.toast(`Đang đi tìm gà thất lạc${st.hintSpot ? ` (${st.hintSpot})` : ''}…`);
        return;
      }
    }
    ctx.world.goTo(id);
    ctx.toast(`Đang đi tới ${SPOTS[id].name}…`);
  });
  tasksEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-task]');
    if (!b) return;
    const t = ctx.progress.view().tasks.find((x) => x.id === b.dataset.task);
    if (!t || t.done) return;
    b.classList.add('is-go');
    window.setTimeout(() => b.classList.remove('is-go'), 450);
    runDailyTask(ctx, t);
  });

  function paintOpen(): void {
    el.classList.toggle('is-collapsed', !open);
    body.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Thu gọn việc hôm nay' : 'Mở việc hôm nay');
  }

  function paintSoon(): void {
    const sp = nextSpecial();
    const cp = nextCommunity();
    const special = sp.inDays === 0 ? `Hôm nay: ${sp.label}` : sp.inDays === 1 ? `${sp.label} · ngày mai` : `${sp.label} sau ${sp.inDays} ngày`;
    q('.qc__soon').innerHTML =
      `<li class="${sp.inDays === 0 ? 'is-live' : ''}">${icon('moon', { size: 14 })}<span>${esc(special)}</span></li>` +
      `<li class="${cp.live ? 'is-live' : ''}">${icon('bell', { size: 14 })}<span>${esc(cp.label)}</span></li>`;
  }

  function update(v: ProgressView): void {
    q('.qc__avatar').innerHTML = tierIcon(v.tier.id, { size: 34, ring: false });
    q('.qc__name').textContent = ctx.profile.name;
    q('.qc__tier').innerHTML = `<em>Cấp ${fmt(v.level)}</em> · ${esc(v.tier.name)}`;
    meBtn.setAttribute('aria-label', `Mở Hành trình: ${ctx.profile.name}, Cấp ${v.level}, ${v.tier.name}, còn ${Math.max(0, v.xpForNext - v.xpIntoLevel)} tinh tấn tới Cấp ${v.level + 1}. Việc hôm nay ${v.tasksDone}/${v.tasks.length}.`);

    const bar = q('.qc__bar');
    const pct = Math.max(0, Math.min(1, v.frac)) * 100;
    (bar.firstElementChild as HTMLElement).style.width = `${pct.toFixed(1)}%`;
    bar.setAttribute('aria-valuemax', String(v.xpForNext));
    bar.setAttribute('aria-valuenow', String(v.xpIntoLevel));
    q('.qc__xpn').textContent = `${fmt(v.xpIntoLevel)}/${fmt(v.xpForNext)}`;
    if (lastXp >= 0 && v.xp > lastXp) {
      bar.classList.remove('is-gain');
      void bar.offsetWidth;
      bar.classList.add('is-gain');
    }
    lastXp = v.xp;

    const nowDone = new Set(v.tasks.filter((t) => t.done).map((t) => t.id));
    tasksEl.innerHTML = v.tasks.length
      ? v.tasks.map((t) => {
          const justDone = !first && t.done && !lastDone.has(t.id);
          const prog = t.target > 1 && !t.done ? `<small class="qc__prog">${fmt(Math.min(t.progress, t.target))}/${fmt(t.target)}</small>` : '';
          const right = t.done
            ? `<span class="qc__check${justDone ? ' is-pop' : ''}" aria-hidden="true">${icon('check', { size: 15 })}</span>`
            : t.action
              ? `<button type="button" class="qc__go" data-task="${esc(t.id)}" aria-label="${taskVerb(t)}: ${esc(t.label)}">${taskVerb(t)}${icon('chevron-right', { size: 14 })}</button>`
              : '';
          return `<li class="qc__task${t.done ? ' is-done' : ''}${justDone ? ' is-just' : ''}">
            <span class="qc__ti" aria-hidden="true">${icon(taskIcon(t), { size: 17 })}</span>
            <span class="qc__tl"><span class="sr-only">${t.done ? 'Đã xong: ' : 'Chưa xong: '}</span>${esc(t.label)} ${prog}</span>
            <span class="qc__xpv">+${fmt(t.xp)}</span>${right}</li>`;
        }).join('')
      : '<li class="qc__empty">Hôm nay chưa có việc nào, bạn cứ công phu theo tâm mình nhé.</li>';
    lastDone = nowDone;

    const allDone = v.tasks.length > 0 && v.tasksDone === v.tasks.length;
    const dots = v.tasks.map((t) => `<i class="${t.done ? 'on' : ''}"></i>`).join('');
    const bonus = q('.qc__bonus');
    bonus.classList.toggle('is-done', allDone);
    bonus.innerHTML = `<span class="qc__dots" aria-hidden="true">${dots}</span>${allDone ? `Đã nhận thưởng làm đủ <b>+${TASK_ALL_BONUS}</b>` : `Xong cả ${v.tasks.length || 3}: <b>+${TASK_ALL_BONUS}</b> tinh tấn`}`;

    const bloomed = bloomedLotus(v.streak, v.litToday);
    q('.qc__lotus').innerHTML = `<span class="qc__lotuses" aria-hidden="true">${Array.from({ length: 7 }, (_, i) => `<i class="${i < bloomed ? 'on' : ''}" style="--i:${i}">${icon('lotus', { size: 13 })}</i>`).join('')}</span><span>Bảy đóa sen <b>${bloomed}/7</b></span>`;
    q('.qc__lotus').setAttribute('aria-label', `Bảy đóa sen: đã nở ${bloomed} trên 7. Giữ lửa mỗi ngày để sen nở đủ.`);
    q('.qc__lotus').title = 'Giữ lửa mỗi ngày liên tiếp để nở đủ bảy đóa sen.';

    paintSoon();
    first = false;
  }

  function setChicken(st: ChickenState): void {
    const active = st.carrying || st.lostCount > 0;
    coopDot.hidden = !active;
    coopBtn.classList.toggle('is-alert', st.lostCount > 0 && !st.carrying);
    coopBtn.classList.toggle('is-carry', st.carrying);
    const labelSpan = coopBtn.querySelector('span') as HTMLElement;
    labelSpan.textContent = st.carrying ? 'Về chuồng' : st.lostCount > 0 ? `Gà lạc (${st.lostCount})` : 'Chuồng gà';
    coopBtn.title = st.carrying
      ? 'Đưa gà thất lạc về chuồng sau chùa'
      : st.lostCount > 0
        ? `Đang có gà thất lạc${st.hintSpot ? ` ${st.hintSpot}` : ''} — bấm để đi tìm`
        : 'Đi tới chuồng gà sau chùa';
  }

  paintOpen();
  setChicken(ctx.world.getChickenState());
  const soonTimer = window.setInterval(paintSoon, 60_000);
  const offProfile = ctx.bus.on('profile', () => update(ctx.progress.view()));
  return {
    el,
    update,
    setChicken,
    destroy() { window.clearInterval(soonTimer); offProfile(); el.remove(); },
  };
}
