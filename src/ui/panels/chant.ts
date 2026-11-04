/**
 * Panel "Tụng kinh": danh sách bài (nhóm theo loại, thời khóa), trình đọc gõ mõ từng chữ,
 * mõ tự động theo nhịp, màn hình hoàn thành + hồi hướng. Ghi `chantDone` mỗi bài xong.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { DEDICATION, SESSION_PLAN, SUTRAS, getSutra, type Sutra } from '@/content/kinh';
import { icon } from '@/ui/icons';
import { createScope, h, haptic, liveRegion, reducedMotion, viewHead, type Scope } from './practice-kit';

const GROUPS: Sutra['group'][] = ['Thời khóa', 'Chú', 'Kệ & sám nguyện'];
const SPEEDS = [60, 80, 100, 120] as const;
const NEXT_DELAY = 8; // giây chờ trước khi tự chuyển bài trong thời khóa

const MO_SVG = `
<svg viewBox="0 0 140 130" class="chant-mo__svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="mo-body" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#d9a066"/><stop offset=".5" stop-color="#9a5f33"/><stop offset="1" stop-color="#4a2a15"/></radialGradient>
    <linearGradient id="mo-stick" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8c58c"/><stop offset="1" stop-color="#9a6a38"/></linearGradient>
    <radialGradient id="mo-head" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#e0584a"/><stop offset="1" stop-color="#8a2219"/></radialGradient>
  </defs>
  <ellipse cx="58" cy="118" rx="42" ry="6" fill="rgba(0,0,0,.35)"/>
  <circle cx="58" cy="76" r="40" fill="url(#mo-body)" stroke="rgba(255,225,170,.35)" stroke-width="1.5"/>
  <path d="M22 78 Q58 96 94 78" fill="none" stroke="#2a1508" stroke-width="7" stroke-linecap="round"/>
  <path d="M22 78 Q58 96 94 78" fill="none" stroke="rgba(255,220,160,.22)" stroke-width="1.5" stroke-linecap="round" transform="translate(0 -4)"/>
  <circle cx="58" cy="26" r="7" fill="url(#mo-body)" stroke="rgba(255,225,170,.35)"/>
  <path d="M40 52 Q58 40 76 52" fill="none" stroke="rgba(255,225,170,.22)" stroke-width="2" stroke-linecap="round"/>
  <g class="chant-mallet">
    <rect x="86" y="14" width="8" height="56" rx="4" fill="url(#mo-stick)" transform="rotate(38 90 14)"/>
    <circle cx="68.8" cy="59" r="9" fill="url(#mo-head)" stroke="rgba(255,200,160,.5)"/>
  </g>
</svg>`;

export const panel: PanelDef = {
  id: 'chant',
  title: 'Tụng kinh',
  kind: 'view',
  mount(root: HTMLElement, ctx: AppContext, params?: Record<string, unknown>) {
    const scope = createScope();
    const live = liveRegion();
    let readerScope: Scope | null = null;
    let session: string[] | null = null;
    let sessionIdx = 0;
    let speed = 80;

    const sutras = (): Sutra[] => (Array.isArray(SUTRAS) ? SUTRAS : []);
    const disposeReader = (): void => { readerScope?.dispose(); readerScope = null; };
    const scrollTop = (): void => { root.closest('.panel-host__body')?.scrollTo({ top: 0 }); };

    // ═══════════════ DANH SÁCH ═══════════════
    function renderList(): void {
      disposeReader();
      session = null;
      const list = sutras();
      const kids: (HTMLElement | null)[] = [viewHead('Tụng kinh', 'Gõ mõ theo từng chữ, để tâm lắng theo lời kinh. Chọn một bài, hoặc tụng trọn một thời khóa.')];

      // thẻ thời khóa
      const planItems = (SESSION_PLAN ?? []).map((id: string) => getSutra(id)).filter((s): s is Sutra => !!s);
      if (planItems.length) {
        const mins = planItems.reduce((a: number, s: Sutra) => a + (s.minutes || 0), 0);
        kids.push(h('div', { class: 'card card--glow chant-session' }, [
          h('div', { class: 'chant-session__icon', html: icon('lotus', { size: 30 }) }),
          h('div', { class: 'chant-session__body' }, [
            h('h2', { class: 'chant-session__title', text: 'Thời khóa công phu' }),
            h('p', { class: 'muted chant-session__sub', text: `${planItems.length} phần · khoảng ${mins} phút` }),
            h('ol', { class: 'chant-session__steps' }, planItems.map((s: Sutra) => h('li', { text: s.title }))),
          ]),
          h('button', {
            type: 'button', class: 'btn btn--gold btn--block chant-session__go',
            onclick: () => { session = planItems.map((s: Sutra) => s.id); sessionIdx = 0; openReader(planItems[0]!); },
          }, [h('span', { html: icon('play', { size: 18 }) }), h('span', { text: 'Tụng cả thời khóa' })]),
        ]));
      }

      if (!list.length) {
        kids.push(h('div', { class: 'card chant-empty' }, [
          h('div', { class: 'chant-empty__icon', html: icon('book', { size: 34 }) }),
          h('p', { text: 'Chưa có bài kinh nào để hiển thị.' }),
          h('p', { class: 'muted', text: 'Bạn thử mở lại sau ít phút nhé.' }),
        ]));
      }
      for (const g of GROUPS) {
        const items = list.filter((s) => s.group === g);
        if (!items.length) continue;
        kids.push(h('section', { class: 'chant-group', 'aria-label': g }, [
          h('h2', { class: 'chant-group__title', text: g }),
          h('div', { class: 'chant-cards' }, items.map((s) => h('button', {
            type: 'button', class: 'chant-card', onclick: () => { session = null; openReader(s); },
          }, [
            h('span', { class: 'chant-card__main' }, [
              h('span', { class: 'chant-card__title', text: s.title }),
              s.subtitle ? h('span', { class: 'chant-card__sub', text: s.subtitle }) : null,
              h('span', { class: 'chant-card__blurb', text: s.blurb }),
            ]),
            h('span', { class: 'chant-card__meta' }, [
              h('span', { class: 'chip chant-card__min', text: `${s.minutes} phút` }),
              h('span', { class: 'chant-card__go', html: icon('chevron-right', { size: 20 }) }),
            ]),
          ]))),
        ]));
      }
      kids.push(h('p', { class: 'chant-note muted' }, [
        'Các bản kinh trong chùa được biên soạn và đối chiếu từ các nguồn đã công bố, chưa qua chư tăng duyệt lại. Thấy chỗ nào chưa đúng, bạn góp ý giúp chùa nhé. ',
        h('a', { href: '#', text: 'Gửi góp ý', onclick: (e: Event) => { e.preventDefault(); void ctx.openPanel('feedback'); } }),
      ]));
      root.replaceChildren(h('section', { class: 'view chant-view' }, kids), live);
      scrollTop();
    }

    // ═══════════════ TRÌNH ĐỌC ═══════════════
    function openReader(s: Sutra): void {
      disposeReader();
      const rs = (readerScope = createScope());
      const words: HTMLElement[] = [];
      const wordLine: number[] = [];
      const lineEls: HTMLElement[] = [];
      const textEl = h('div', { class: 'chant-text', lang: 'vi' });
      (s.lines ?? []).forEach((ln, li) => {
        const p = h('p', { class: 'chant-line', 'data-line': li });
        ln.split(/\s+/).filter(Boolean).forEach((w, wi, arr) => {
          const sp = h('span', { class: 'chant-word', text: w });
          words.push(sp); wordLine.push(li);
          p.append(sp);
          if (wi < arr.length - 1) p.append(' ');
        });
        lineEls.push(p);
        textEl.append(p);
      });
      const total = words.length;
      let cur = -1;
      let finished = false;
      let auto = false;
      let nextAt = 0;

      const barTitle = h('div', { class: 'chant-bar__title' }, [
        h('strong', { text: s.title }),
        h('span', { class: 'muted', text: session ? `Thời khóa · phần ${sessionIdx + 1}/${session.length}` : (s.subtitle || s.group) }),
      ]);
      const backBtn = h('button', { type: 'button', class: 'chant-bar__back', 'aria-label': 'Về danh sách kinh', onclick: () => { stopAuto(); renderList(); }, html: icon('chevron-left', { size: 20 }) });
      const fill = h('i');
      const progress = h('div', { class: 'chant-progress', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0, 'aria-label': 'Tiến độ bài kinh' }, [fill]);
      const pct = h('span', { class: 'chant-bar__pct', text: '0%' });
      const bar = h('div', { class: 'chant-bar' }, [backBtn, barTitle, pct]);

      const moBtn = h('button', { type: 'button', class: 'chant-mo', 'aria-label': 'Gõ mõ, tô sáng chữ kế tiếp', html: MO_SVG });
      const autoBtn = h('button', { type: 'button', class: 'btn btn--ghost chant-auto', 'aria-pressed': 'false' });
      const speedBtns = SPEEDS.map((v) => h('button', {
        type: 'button', class: 'seg__btn', 'aria-pressed': String(v === speed), text: String(v), 'aria-label': `${v} tiếng mỗi phút`,
        onclick: () => { speed = v; speedBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(SPEEDS[i] === v))); if (auto) nextAt = performance.now() + 60000 / speed; },
      }));
      const speedSeg = h('div', { class: 'seg chant-speed', role: 'group', 'aria-label': 'Tốc độ mõ, số tiếng mỗi phút' }, speedBtns);
      const dock = h('div', { class: 'chant-dock' }, [
        progress,
        h('div', { class: 'chant-dock__inner' }, [
          h('div', { class: 'chant-dock__side' }, [autoBtn]),
          moBtn,
          h('div', { class: 'chant-dock__side chant-dock__side--r' }, [h('span', { class: 'chant-speed__label muted', text: 'tiếng/phút' }), speedSeg]),
        ]),
        h('p', { class: 'chant-dock__hint muted', text: 'Chạm mõ hoặc nhấn phím Cách để sang chữ kế tiếp' }),
      ]);

      root.replaceChildren(h('section', { class: 'view chant-view chant-view--read' }, [bar, textEl, dock]), live);
      scrollTop();

      const paintAuto = (): void => {
        autoBtn.setAttribute('aria-pressed', String(auto));
        autoBtn.replaceChildren(
          h('span', { html: icon(auto ? 'pause' : 'play', { size: 18 }) }),
          h('span', { text: auto ? 'Tạm dừng' : 'Mõ tự động' }),
        );
        dock.classList.toggle('is-auto', auto);
      };
      function stopAuto(): void { auto = false; paintAuto(); }
      function startAuto(): void {
        if (finished) return;
        ctx.audio.unlock();
        auto = true; nextAt = performance.now() + 250; paintAuto();
      }
      autoBtn.addEventListener('click', () => (auto ? stopAuto() : startAuto()));
      paintAuto();

      let lastLine = -1;
      function paint(): void {
        // chỉ cập nhật phần tử thay đổi
        if (cur >= 0) {
          words[cur]!.classList.add('is-cur');
          words[cur]!.classList.add('is-done');
          if (cur > 0) { words[cur - 1]!.classList.remove('is-cur'); }
        }
        const ln = cur >= 0 ? wordLine[cur]! : 0;
        if (ln !== lastLine) {
          if (lastLine >= 0) { lineEls[lastLine]!.classList.remove('is-now'); lineEls[lastLine]!.classList.add('is-past'); }
          lineEls[ln]?.classList.add('is-now');
          lastLine = ln;
          lineEls[ln]?.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
        }
        const p = total ? Math.round(((cur + 1) / total) * 100) : 0;
        fill.style.transform = `scaleX(${p / 100})`;
        progress.setAttribute('aria-valuenow', String(p));
        pct.textContent = `${p}%`;
      }
      function hit(playSound = true): void {
        if (finished || cur >= total - 1) return;
        cur += 1;
        if (playSound) { ctx.audio.play('mo'); haptic(6); }
        moBtn.classList.remove('is-hit'); void moBtn.offsetWidth; moBtn.classList.add('is-hit');
        paint();
        // đọc cho trình đọc màn hình theo câu
        if (cur === 0 || wordLine[cur] !== wordLine[cur - 1]) live.textContent = s.lines[wordLine[cur]!] ?? '';
        if (cur >= total - 1) {
          finished = true;
          stopAuto();
          rs.timeout(() => finish(), 900);
        }
      }
      function finish(): void {
        ctx.audio.play('bell');
        ctx.progress.record('chantDone');
        renderDone(s);
      }
      moBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); moBtn.focus({ preventScroll: true }); hit(); });
      moBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!e.repeat) hit(); } });
      rs.on(document, 'keydown', (e) => {
        const ke = e as KeyboardEvent;
        if (ke.key !== ' ' || ke.repeat) return;
        const t = ke.target as HTMLElement | null;
        if (t && t.closest('button:not(.panel__back), a, input, textarea, select')) return;
        ke.preventDefault();
        hit();
      });
      rs.interval(() => {
        if (!auto || finished) return;
        const now = performance.now();
        let guard = 0;
        let first = true;
        while (now >= nextAt && !finished && guard++ < 6) {
          hit(first); first = false;
          nextAt += 60000 / speed;
        }
        if (now - nextAt > 3000) nextAt = now + 60000 / speed; // tab nền quá lâu: đặt lại nhịp
      }, 40);
      rs.add(() => { auto = false; });
      if (total === 0) { finished = true; rs.timeout(finish, 300); }
      rs.timeout(() => moBtn.focus({ preventScroll: true }), 160);
    }

    // ═══════════════ HOÀN THÀNH ═══════════════
    function renderDone(s: Sutra): void {
      disposeReader();
      const rs = (readerScope = createScope());
      const nextId = session ? session[sessionIdx + 1] : undefined;
      const next = nextId ? getSutra(nextId) : undefined;
      const sessionDone = !!session && !next;
      const kids: (HTMLElement | null)[] = [
        h('div', { class: 'chant-done__mark', 'aria-hidden': 'true', html: icon('lotus', { size: 46 }) }),
        h('h1', { class: 'chant-done__title', text: sessionDone ? 'Đã hoàn thành thời khóa' : `Đã tụng xong ${s.title}` }),
        h('p', { class: 'muted chant-done__sub', text: sessionDone ? `${session!.length} phần công phu đã tròn. Nguyện công đức này lan tỏa đến muôn loài.` : 'Một thời kinh đã trọn. Giữ tâm lắng thêm một hơi thở.' }),
      ];
      const buttons = h('div', { class: 'chant-done__actions' });
      if (next) {
        let left = NEXT_DELAY;
        const label = h('span', { class: 'chant-done__count', text: `${left}s` });
        const go = (): void => { rs.dispose(); readerScope = null; sessionIdx += 1; openReader(next); };
        kids.push(h('div', { class: 'card chant-done__next' }, [
          h('span', { class: 'chant-done__nextlabel muted', text: 'Tiếp theo' }),
          h('strong', { class: 'chant-done__nexttitle', text: next.title }),
          h('span', { class: 'chant-done__ring', 'aria-hidden': 'true' }, [label]),
        ]));
        buttons.append(
          h('button', { type: 'button', class: 'btn btn--gold btn--lg', text: 'Tụng tiếp ngay', onclick: go }),
          h('button', { type: 'button', class: 'btn', text: 'Dừng ở đây', onclick: () => renderList() }),
        );
        rs.interval(() => {
          left -= 1;
          label.textContent = `${Math.max(0, left)}s`;
          if (left <= 0) go();
        }, 1000);
      } else {
        const again = session ? 'Tụng lại thời khóa' : 'Tụng lại';
        buttons.append(
          h('button', { type: 'button', class: 'btn btn--gold btn--lg', text: again, onclick: () => { if (session) { sessionIdx = 0; openReader(getSutra(session[0]!) ?? s); } else openReader(s); } }),
          h('button', { type: 'button', class: 'btn', text: 'Chọn bài khác', onclick: () => renderList() }),
        );
        kids.push(h('div', { class: 'card chant-dedic' }, [
          h('div', { class: 'chant-dedic__label', text: 'Hồi hướng công đức' }),
          h('div', { class: 'divider-ornament', 'aria-hidden': 'true' }, [h('i')]),
          ...(DEDICATION ?? []).map((l: string) => h('p', { class: 'chant-dedic__line', text: l })),
        ]));
      }
      kids.push(buttons);
      root.replaceChildren(h('section', { class: 'view chant-view chant-done' }, kids), live);
      scrollTop();
      live.textContent = sessionDone ? 'Đã hoàn thành thời khóa' : `Đã tụng xong ${s.title}`;
    }

    // ── vào ──
    const id = typeof params?.id === 'string' ? params.id : undefined;
    const direct = id ? getSutra(id) : undefined;
    if (direct) openReader(direct);
    else renderList();

    return () => { disposeReader(); scope.dispose(); };
  },
};
