/**
 * Panel "Thiền hành": hướng dẫn đi chậm theo nhịp thở — mỗi hơi thở một bước (trái–phải),
 * chuông đầu/cuối, ghi `mindfulSeconds`, gợi ý đi dạo ở sân thiền.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { load, save } from '@/core/store';
import { icon } from '@/ui/icons';
import { createScope, fmtClock, fmtDuration, h, haptic, holdAwake, liveRegion, reducedMotion, viewHead } from './practice-kit';

const DURATIONS = [3, 5, 10] as const;
const STEP_SEC = 4; // mỗi hơi (vào hoặc ra) kèm một bước
const MIN_RECORD = 30;
const RING_R = 138;
const RING_C = 2 * Math.PI * RING_R;

const foot = (side: 'l' | 'r'): string => `
<svg class="walk-foot walk-foot--${side}" viewBox="0 0 60 120" aria-hidden="true" focusable="false">
  <path d="M30 40 C14 40 10 62 14 82 C17 100 22 112 31 112 C41 112 45 98 46 82 C48 62 46 40 30 40Z" ${side === 'r' ? 'transform="translate(60 0) scale(-1 1)"' : ''} fill="currentColor"/>
  <g fill="currentColor" ${side === 'r' ? 'transform="translate(60 0) scale(-1 1)"' : ''}>
    <ellipse cx="14" cy="28" rx="5" ry="6.5"/><ellipse cx="25" cy="20" rx="5.5" ry="7"/><ellipse cx="37" cy="19" rx="5" ry="6.5"/><ellipse cx="47" cy="25" rx="4.2" ry="5.5"/>
  </g>
</svg>`;

export const panel: PanelDef = {
  id: 'walkMeditation',
  title: 'Thiền hành',
  kind: 'view',
  mount(root: HTMLElement, ctx: AppContext) {
    const scope = createScope();
    const live = liveRegion();
    let dur: number = load<number>('walk:dur', 5);
    if (!(DURATIONS as readonly number[]).includes(dur)) dur = 5;

    let phase: 'setup' | 'run' | 'done' = 'setup';
    let running = false;
    let startedAt = 0;
    let acc = 0;
    let target = 0;
    let raf = 0;
    let tick = 0;
    let recorded = false;
    let reported = 0; // số giây đã báo cho tiến độ (mỗi 60s)
    let release: (() => void) | null = null;

    const elapsedMs = (): number => acc + (running ? performance.now() - startedAt : 0);
    const elapsedSec = (): number => Math.floor(elapsedMs() / 1000);
    function stopLoops(): void { cancelAnimationFrame(raf); scope.clearInterval(tick); release?.(); release = null; }

    function renderSetup(): void {
      phase = 'setup'; running = false; acc = 0; recorded = false; reported = 0; stopLoops();
      const btns = DURATIONS.map((d) => h('button', {
        type: 'button', class: 'med-dur', 'aria-pressed': String(d === dur), 'data-d': d,
        onclick: () => { dur = d; save('walk:dur', d); btns.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.d) === d))); },
      }, [h('span', { class: 'med-dur__n', text: String(d) }), h('span', { class: 'med-dur__u', text: 'phút' })]));
      const tips: [string, string][] = [
        ['hands', 'Chắp tay trước ngực hoặc để tay thả lỏng.'],
        ['footsteps', 'Bước thật chậm, để gót rồi đến mũi bàn chân chạm đất.'],
        ['eye', 'Mắt nhìn xuống nhẹ nhàng, cách vài bước chân.'],
        ['leaf', 'Chọn một lối yên tĩnh — sân chùa, vườn hay hành lang đều được.'],
      ];
      root.replaceChildren(h('section', { class: 'view walk-view' }, [
        viewHead('Thiền hành', 'Đi chậm như thở. Mỗi hơi thở một bước chân, về với giây phút hiện tại.'),
        h('div', { class: 'walk-feet', 'aria-hidden': 'true', html: foot('l') + foot('r') }),
        h('div', { class: 'card med-setup' }, [
          h('div', { class: 'field' }, [
            h('span', { class: 'field__label', id: 'walk-dur-label', text: 'Thời lượng' }),
            h('div', { class: 'med-durs med-durs--3', role: 'group', 'aria-labelledby': 'walk-dur-label' }, btns),
          ]),
          h('ul', { class: 'walk-tips' }, tips.map(([ic, t]) => h('li', {}, [h('span', { class: 'walk-tips__ic', html: icon(ic as 'hands', { size: 18 }) }), h('span', { text: t })]))),
        ]),
        h('button', { type: 'button', class: 'btn btn--gold btn--lg btn--block med-start', onclick: start }, [h('span', { html: icon('footsteps', { size: 22 }) }), h('span', { text: 'Bắt đầu thiền hành' })]),
        h('div', { class: 'card card--flat walk-spot' }, [
          h('div', { class: 'walk-spot__text' }, [h('strong', { text: 'Muốn đi thật trong chùa?' }), h('span', { class: 'muted', text: 'Nhân vật sẽ tự đi chậm tới sân thiền để bạn theo dõi.' })]),
          h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: () => { ctx.closePanel(); ctx.world.goTo('meditate'); } }, [h('span', { text: 'Đi dạo ở sân thiền' }), h('span', { html: icon('chevron-right', { size: 14 }) })]),
        ]),
      ]), live);
    }

    function start(): void {
      ctx.audio.unlock();
      phase = 'run'; target = dur * 60; acc = 0; running = true; startedAt = performance.now(); recorded = false; reported = 0;
      release = holdAwake();
      ctx.audio.play('bellBig'); haptic(12);

      const timeEl = h('div', { class: 'med-time', 'aria-hidden': 'true' });
      const subEl = h('div', { class: 'med-sub muted' });
      const phraseEl = h('div', { class: 'walk-phrase', 'aria-hidden': 'true' });
      const stepEl = h('div', { class: 'walk-step', 'aria-hidden': 'true' }, [
        h('div', { class: 'walk-feet walk-feet--run', html: foot('l') + foot('r') }),
      ]);
      const ringSvg = `<svg class="med-ring" viewBox="0 0 300 300" aria-hidden="true"><circle cx="150" cy="150" r="${RING_R}" class="med-ring__bg"/><circle cx="150" cy="150" r="${RING_R}" class="med-ring__fg" stroke-dasharray="${RING_C.toFixed(1)}" stroke-dashoffset="${RING_C.toFixed(1)}"/></svg>`;
      const stage = h('div', { class: 'med-stage walk-stage', html: ringSvg }, [stepEl]);
      const ringFg = stage.querySelector<SVGCircleElement>('.med-ring__fg')!;
      const pauseBtn = h('button', { type: 'button', class: 'btn btn--lg med-pause', onclick: togglePause });
      const endBtn = h('button', { type: 'button', class: 'btn btn--ghost med-end', onclick: () => finish() }, [h('span', { text: 'Dừng thiền hành' })]);
      const paintPause = (): void => pauseBtn.replaceChildren(h('span', { html: icon(running ? 'pause' : 'play', { size: 20 }) }), h('span', { text: running ? 'Tạm dừng' : 'Tiếp tục' }));
      const view = h('section', { class: 'view walk-view med-view--run' }, [
        h('div', { class: 'med-top' }, [timeEl, subEl]),
        stage,
        phraseEl,
        h('div', { class: 'med-controls' }, [pauseBtn, endBtn]),
      ]);
      function togglePause(): void {
        if (running) { acc = elapsedMs(); running = false; } else { startedAt = performance.now(); running = true; }
        paintPause(); view.classList.toggle('is-paused', !running);
        live.textContent = running ? 'Tiếp tục thiền hành' : 'Đã tạm dừng';
      }
      root.replaceChildren(view, live);
      paintPause();

      let lastSec = -1;
      let lastStep = -1;
      const update = (): void => {
        const es = elapsedSec();
        if (es === lastSec) return;
        lastSec = es;
        timeEl.textContent = fmtClock(Math.max(0, target - es));
        subEl.textContent = `Đã đi ${fmtClock(es)} · tổng ${dur} phút`;
        ringFg.setAttribute('stroke-dashoffset', (RING_C * (1 - Math.min(1, es / target))).toFixed(1));
      };
      update();
      const frame = (): void => {
        raf = requestAnimationFrame(frame);
        if (phase !== 'run') return;
        const t = elapsedMs() / 1000;
        const idx = Math.floor(t / STEP_SEC);
        const p = (t % STEP_SEC) / STEP_SEC;
        stepEl.style.setProperty('--p', p.toFixed(3));
        if (idx !== lastStep) {
          lastStep = idx;
          const left = idx % 2 === 0;
          stepEl.classList.toggle('is-left', left);
          stepEl.classList.toggle('is-right', !left);
          phraseEl.classList.remove('is-swap'); void phraseEl.offsetWidth; phraseEl.classList.add('is-swap');
          phraseEl.textContent = left ? 'Thở vào, bước một bước' : 'Thở ra, bước một bước';
          if (idx > 0 && !reducedMotion()) haptic(5);
        }
      };
      raf = requestAnimationFrame(frame);
      tick = scope.interval(() => {
        if (phase !== 'run') return;
        update();
        const es = elapsedSec();
        while (running && es - reported >= 60) { reported += 60; ctx.progress.record('mindfulSeconds', 60); }
        if (running && es >= target) finish();
      }, 250);
    }

    function finish(): void {
      if (phase !== 'run') return;
      const sec = Math.min(elapsedSec(), target);
      phase = 'done'; running = false; stopLoops();
      ctx.audio.play('bellBig'); haptic(30);
      const counted = sec >= MIN_RECORD;
      if (counted && !recorded) { recorded = true; if (sec - reported > 0) ctx.progress.record('mindfulSeconds', sec - reported); }
      root.replaceChildren(h('section', { class: 'view walk-view med-done' }, [
        h('div', { class: 'med-done__mark', 'aria-hidden': 'true', html: icon('footsteps', { size: 46 }) }),
        h('h1', { class: 'med-done__title', text: counted ? 'Bước chân đã về với hơi thở' : 'Một đoạn đường ngắn' }),
        h('p', { class: 'muted center', text: counted ? `Bạn đã thiền hành ${fmtDuration(sec)}. Mang sự tỉnh thức này theo mỗi bước đi trong ngày.` : 'Đoạn đi dưới 30 giây nên chưa được ghi vào công phu. Lần sau mình đi lâu hơn một chút nhé.' }),
        h('div', { class: 'stats med-stats' }, [h('div', { class: 'stat' }, [h('span', { class: 'stat__value', text: fmtClock(sec) }), h('span', { class: 'stat__label', text: 'thời gian đã đi' })])]),
        h('div', { class: 'med-done__actions' }, [
          h('button', { type: 'button', class: 'btn btn--gold btn--lg', text: 'Đi thêm một lần', onclick: renderSetup }),
          h('button', { type: 'button', class: 'btn', text: 'Quay lại chùa', onclick: () => ctx.closePanel() }),
        ]),
      ]), live);
      live.textContent = counted ? `Đã thiền hành ${fmtDuration(sec)}.` : 'Đoạn đi ngắn, chưa ghi nhận.';
    }

    renderSetup();
    return () => {
      if (phase === 'run') {
        const sec = Math.min(elapsedSec(), target);
        if (sec >= MIN_RECORD && !recorded) { recorded = true; if (sec - reported > 0) ctx.progress.record('mindfulSeconds', sec - reported); }
      }
      phase = 'done'; stopLoops(); scope.dispose();
    };
  },
};
