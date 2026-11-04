/**
 * Panel "Thiền định": chọn thời lượng, quả cầu thở 4-2-6, chuông đầu/cuối/nhắc,
 * đếm giờ bằng mốc thời gian thật (không dồn lỗi khi tab nền), hồi hướng khi xong.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { load, save } from '@/core/store';
import { DEDICATION } from '@/content/kinh';
import { icon } from '@/ui/icons';
import { createScope, fmtClock, fmtDuration, h, haptic, holdAwake, liveRegion, reducedMotion, today, viewHead } from './practice-kit';

const DURATIONS: (number | 'free')[] = [5, 10, 15, 20, 30, 'free'];
const FREE_MAX = 60 * 60;
const MIN_RECORD = 30;
const BELL_EVERY = 5 * 60;
const IN = 4, HOLD = 2, OUT = 6, CYCLE = IN + HOLD + OUT;
const RING_R = 138;
const RING_C = 2 * Math.PI * RING_R;

interface Prefs { dur: number | 'free'; bell: boolean }
interface DayStat { seconds: number; sessions: number }

export const panel: PanelDef = {
  id: 'meditate',
  title: 'Thiền định',
  kind: 'view',
  mount(root: HTMLElement, ctx: AppContext) {
    const scope = createScope();
    const live = liveRegion();
    const prefs: Prefs = load<Prefs>('meditate:prefs', { dur: 10, bell: true });
    if (!DURATIONS.includes(prefs.dur)) prefs.dur = 10;
    const dayKey = `meditate:${today()}`;
    const dayStat = (): DayStat => load<DayStat>(dayKey, { seconds: 0, sessions: 0 });

    try { if (!ctx.world.isSeated()) ctx.world.sit('meditate'); } catch { /* không bắt buộc */ }

    // trạng thái phiên
    let phase: 'setup' | 'run' | 'done' = 'setup';
    let running = false;
    let startedAt = 0;
    let acc = 0; // ms đã tích luỹ khi tạm dừng
    let target = 0; // giây, 0 = tự do
    let nextBell = BELL_EVERY;
    let release: (() => void) | null = null;
    let raf = 0;
    let tick = 0;
    let recorded = false;
    let reported = 0; // số giây đã báo cho tiến độ (báo theo nhịp thực, mỗi 60s)

    const elapsedMs = (): number => acc + (running ? performance.now() - startedAt : 0);
    const elapsedSec = (): number => Math.floor(elapsedMs() / 1000);

    function stopLoops(): void {
      cancelAnimationFrame(raf);
      scope.clearInterval(tick);
      release?.(); release = null;
    }

    // ═══════════════ CHUẨN BỊ ═══════════════
    function renderSetup(): void {
      phase = 'setup'; running = false; acc = 0; recorded = false; reported = 0;
      stopLoops();
      const durBtns = DURATIONS.map((d) => h('button', {
        type: 'button', class: 'med-dur', 'aria-pressed': String(d === prefs.dur), 'data-d': String(d),
        onclick: () => { prefs.dur = d; save('meditate:prefs', prefs); durBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.d === String(d)))); },
      }, d === 'free'
        ? [h('span', { class: 'med-dur__n', html: icon('sparkle', { size: 22 }) }), h('span', { class: 'med-dur__u', text: 'Tự do' })]
        : [h('span', { class: 'med-dur__n', text: String(d) }), h('span', { class: 'med-dur__u', text: 'phút' })]));
      const bellSw = h('button', {
        type: 'button', class: 'pk-switch', role: 'switch', 'aria-checked': String(prefs.bell), 'aria-label': 'Chuông nhắc mỗi 5 phút',
        onclick: () => { prefs.bell = !prefs.bell; bellSw.setAttribute('aria-checked', String(prefs.bell)); save('meditate:prefs', prefs); },
      }, [h('i')]);

      const a = ctx.audio.settings();
      const muted = !a.master || !a.sfx;
      const warn: HTMLElement | null = muted
        ? h('div', { class: 'notice notice--warn med-warn', role: 'alert' }, [
          h('span', { html: icon('mute', { size: 18 }) }),
          h('span', { text: 'Âm thanh đang tắt nên chuông sẽ không vang.' }),
          h('button', { type: 'button', class: 'btn btn--sm', text: 'Bật chuông', onclick: () => { ctx.audio.configure({ master: true, sfx: true }); warn?.remove(); } }),
        ])
        : null;

      const st = dayStat();
      root.replaceChildren(h('section', { class: 'view med-view' }, [
        viewHead('Thiền định', 'Ngồi yên, theo hơi thở. Không cần làm gì thêm.'),
        h('div', { class: 'med-orb-preview', 'aria-hidden': 'true' }, [h('i'), h('i'), h('i')]),
        h('div', { class: 'card med-setup' }, [
          h('div', { class: 'field' }, [
            h('span', { class: 'field__label', id: 'med-dur-label', text: 'Thời lượng' }),
            h('div', { class: 'med-durs', role: 'group', 'aria-labelledby': 'med-dur-label' }, durBtns),
          ]),
          h('div', { class: 'med-row' }, [
            h('div', { class: 'med-row__text' }, [h('strong', { text: 'Chuông nhắc mỗi 5 phút' }), h('span', { class: 'muted', text: 'Một tiếng chuông nhẹ giữa phiên thiền' })]),
            bellSw,
          ]),
          warn,
        ]),
        h('button', { type: 'button', class: 'btn btn--gold btn--lg btn--block med-start', onclick: startSession }, [
          h('span', { html: icon('meditate', { size: 22 }) }), h('span', { text: 'Bắt đầu thiền' }),
        ]),
        st.seconds > 0 ? h('p', { class: 'center muted med-today', text: `Hôm nay bạn đã thiền ${fmtDuration(st.seconds)} (${st.sessions} lần).` }) : null,
      ]), live);
    }

    // ═══════════════ ĐANG THIỀN ═══════════════
    function startSession(): void {
      ctx.audio.unlock();
      phase = 'run';
      target = prefs.dur === 'free' ? 0 : prefs.dur * 60;
      acc = 0; running = true; startedAt = performance.now(); nextBell = BELL_EVERY; recorded = false; reported = 0;
      release = holdAwake();
      ctx.audio.play('bellBig');
      haptic(12);

      const timeEl = h('div', { class: 'med-time', 'aria-hidden': 'true' });
      const subEl = h('div', { class: 'med-sub muted' });
      const textEl = h('div', { class: 'med-phase', 'aria-hidden': 'true' });
      const orb = h('div', { class: 'med-orb' }, [h('i', { class: 'med-orb__halo' }), h('i', { class: 'med-orb__core' }), h('i', { class: 'med-orb__glow' })]);
      const ringSvg = `<svg class="med-ring" viewBox="0 0 300 300" aria-hidden="true"><circle cx="150" cy="150" r="${RING_R}" class="med-ring__bg"/><circle cx="150" cy="150" r="${RING_R}" class="med-ring__fg" stroke-dasharray="${RING_C.toFixed(1)}" stroke-dashoffset="${RING_C.toFixed(1)}"/></svg>`;
      const orbWrap = h('div', { class: 'med-stage', html: ringSvg }, [orb, textEl]);
      const ringFg = orbWrap.querySelector<SVGCircleElement>('.med-ring__fg')!;
      const pauseBtn = h('button', { type: 'button', class: 'btn btn--lg med-pause', onclick: togglePause });
      const endBtn = h('button', { type: 'button', class: 'btn btn--ghost med-end', onclick: () => finish(false) }, [h('span', { text: 'Xả thiền' })]);
      const srTimer = h('div', { class: 'sr-only', role: 'timer', 'aria-live': 'off' });

      const paintPause = (): void => pauseBtn.replaceChildren(
        h('span', { html: icon(running ? 'pause' : 'play', { size: 20 }) }), h('span', { text: running ? 'Tạm dừng' : 'Tiếp tục' }));
      function togglePause(): void {
        if (running) { acc = elapsedMs(); running = false; }
        else { startedAt = performance.now(); running = true; ctx.audio.play('chime', { volume: 0.5 }); }
        paintPause();
        view.classList.toggle('is-paused', !running);
        live.textContent = running ? 'Tiếp tục thiền' : 'Đã tạm dừng';
      }
      const view = h('section', { class: 'view med-view med-view--run' }, [
        h('div', { class: 'med-top' }, [timeEl, subEl]),
        orbWrap,
        h('div', { class: 'med-controls' }, [pauseBtn, endBtn]),
        srTimer,
      ]);
      root.replaceChildren(view, live);
      paintPause();

      let lastSec = -1;
      const update = (): void => {
        const es = elapsedSec();
        if (es === lastSec) return;
        lastSec = es;
        const remain = target ? Math.max(0, target - es) : es;
        timeEl.textContent = fmtClock(remain);
        subEl.textContent = target ? `Đã ngồi ${fmtClock(es)} · tổng ${prefs.dur} phút` : 'Thiền tự do · đếm lên';
        const frac = target ? es / target : es / FREE_MAX;
        ringFg.setAttribute('stroke-dashoffset', (RING_C * (1 - Math.min(1, frac))).toFixed(1));
        if (es % 60 === 0 && es > 0) srTimer.textContent = target ? `Còn ${Math.ceil(remain / 60)} phút` : `Đã thiền ${es / 60} phút`;
      };
      update();

      const frame = (): void => {
        raf = requestAnimationFrame(frame);
        if (phase !== 'run') return;
        const t = (elapsedMs() / 1000) % CYCLE;
        let s: number; let word: string;
        const ease = (x: number): number => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
        if (t < IN) { s = ease(t / IN); word = 'Hít vào…'; }
        else if (t < IN + HOLD) { s = 1; word = 'Giữ hơi…'; }
        else { s = 1 - ease((t - IN - HOLD) / OUT); word = 'Thở ra…'; }
        const scale = reducedMotion() ? 0.82 : 0.62 + 0.38 * s;
        orb.style.setProperty('--s', scale.toFixed(3));
        orb.style.setProperty('--g', (0.35 + 0.65 * s).toFixed(3));
        if (textEl.textContent !== word) textEl.textContent = word;
      };
      raf = requestAnimationFrame(frame);

      tick = scope.interval(() => {
        if (phase !== 'run') return;
        update();
        if (!running) return;
        const es = elapsedSec();
        while (es - reported >= 60) { reported += 60; ctx.progress.record('meditateSeconds', 60); }
        if (prefs.bell && es >= nextBell && (!target || es < target - 20)) { nextBell += BELL_EVERY; ctx.audio.play('bell'); haptic(10); }
        if (target && es >= target) finish(true);
        else if (!target && es >= FREE_MAX) finish(true);
      }, 250);
    }

    // ═══════════════ KẾT THÚC ═══════════════
    function finish(complete: boolean): void {
      if (phase !== 'run') return;
      const sec = Math.min(elapsedSec(), target || FREE_MAX);
      phase = 'done'; running = false;
      stopLoops();
      ctx.audio.play('bellBig');
      haptic(complete ? 40 : 14);
      const counted = sec >= MIN_RECORD;
      let st = dayStat();
      if (counted && !recorded) {
        recorded = true;
        if (sec - reported > 0) ctx.progress.record('meditateSeconds', sec - reported);
        st = { seconds: st.seconds + sec, sessions: st.sessions + 1 };
        save(dayKey, st);
      }
      renderDone(sec, counted, st);
    }

    function renderDone(sec: number, counted: boolean, st: DayStat): void {
      root.replaceChildren(h('section', { class: 'view med-view med-done' }, [
        h('div', { class: 'med-done__mark', 'aria-hidden': 'true', html: icon('lotus', { size: 48 }) }),
        h('h1', { class: 'med-done__title', text: counted ? 'Hồi hướng công đức' : 'Phiên thiền ngắn' }),
        counted
          ? h('div', { class: 'card med-dedic' }, [
            ...(DEDICATION ?? []).map((l: string) => h('p', { class: 'med-dedic__line', text: l })),
          ])
          : h('p', { class: 'muted center', text: 'Phiên thiền dưới 30 giây nên chưa được ghi vào công phu. Lần sau bạn ngồi thêm chút nữa nhé.' }),
        h('div', { class: 'stats med-stats' }, [
          h('div', { class: 'stat' }, [h('span', { class: 'stat__value', text: fmtClock(sec) }), h('span', { class: 'stat__label', text: 'lần này' })]),
          h('div', { class: 'stat' }, [h('span', { class: 'stat__value', text: fmtClock(st.seconds) }), h('span', { class: 'stat__label', text: `hôm nay · ${st.sessions} lần` })]),
        ]),
        h('div', { class: 'med-done__actions' }, [
          h('button', { type: 'button', class: 'btn btn--gold btn--lg', text: 'Thiền thêm một lần', onclick: renderSetup }),
          h('button', { type: 'button', class: 'btn', text: 'Quay lại chùa', onclick: () => ctx.closePanel() }),
        ]),
      ]), live);
      live.textContent = counted ? `Đã thiền ${fmtDuration(sec)}. Hồi hướng công đức.` : 'Phiên thiền ngắn, chưa ghi nhận.';
      root.closest('.panel-host__body')?.scrollTo({ top: 0 });
    }

    renderSetup();

    return () => {
      // đóng panel giữa chừng: ghi phần đã ngồi nếu đủ 30 giây
      if (phase === 'run') {
        const sec = Math.min(elapsedSec(), target || FREE_MAX);
        if (sec >= MIN_RECORD && !recorded) {
          recorded = true;
          if (sec - reported > 0) ctx.progress.record('meditateSeconds', sec - reported);
          const st = dayStat();
          save(dayKey, { seconds: st.seconds + sec, sessions: st.sessions + 1 });
        }
      }
      phase = 'done';
      stopLoops();
      scope.dispose();
    };
  },
};
