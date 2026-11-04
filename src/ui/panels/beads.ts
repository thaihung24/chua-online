/**
 * Panel "Niệm Phật" (tràng hạt): chuỗi 27/54/108 hạt dạng vòng SVG, mỗi lần chạm lần một hạt,
 * chuỗi xoay mượt, hạt đã niệm sáng vàng; tự lưu trạng thái trong ngày.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { load, save } from '@/core/store';
import { BEAD_PHRASES } from '@/content/beads';
import { icon } from '@/ui/icons';
import { createScope, h, haptic, liveRegion, reducedMotion, today, viewHead } from './practice-kit';

const LENGTHS = [27, 54, 108] as const;
const SVG_NS = 'http://www.w3.org/2000/svg';
const VB = 400;
const CX = VB / 2;
const R = 158;

interface BeadsState { len: number; count: number; pos: number; total: number; rounds: number; phrase: number; mo: boolean }

const svgEl = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] => {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};

export const panel: PanelDef = {
  id: 'beads',
  title: 'Niệm Phật',
  kind: 'view',
  mount(root: HTMLElement, ctx: AppContext) {
    const scope = createScope();
    const key = `beads:${today()}`;
    const saved = load<Partial<BeadsState>>(key, {});
    const st: BeadsState = {
      len: LENGTHS.includes(saved.len as 27) ? (saved.len as number) : 108,
      count: saved.count ?? 0,
      pos: saved.pos ?? 0,
      total: saved.total ?? 0,
      rounds: saved.rounds ?? 0,
      phrase: Math.min(saved.phrase ?? 0, BEAD_PHRASES.length - 1),
      mo: saved.mo ?? false,
    };
    if (st.count >= st.len) st.count = 0;
    const persist = (): void => save(key, st);

    // ── Khung ──
    const live = liveRegion();
    const srCount = h('p', { class: 'sr-only', id: 'beads-sr-count' });
    const ringG = svgEl('g', { class: 'beads-ring' });
    const svg = svgEl('svg', { viewBox: `0 0 ${VB} ${VB}`, class: 'beads-svg', 'aria-hidden': 'true', focusable: 'false' });
    const defs = svgEl('defs');
    defs.innerHTML = `
      <radialGradient id="bd-wood" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#b98458"/><stop offset=".55" stop-color="#7a4a2a"/><stop offset="1" stop-color="#3d2314"/></radialGradient>
      <radialGradient id="bd-lit" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff0c0"/><stop offset=".5" stop-color="#f3c973"/><stop offset="1" stop-color="#b9792a"/></radialGradient>
      <radialGradient id="bd-guru" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#e0b25c"/><stop offset="1" stop-color="#8a5a1a"/></radialGradient>
      <radialGradient id="bd-halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f3c973" stop-opacity=".55"/><stop offset="1" stop-color="#f3c973" stop-opacity="0"/></radialGradient>
      <filter id="bd-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    svg.append(defs);
    // vòng sáng nền + dây
    svg.append(svgEl('circle', { cx: CX, cy: CX, r: R + 26, fill: 'url(#bd-halo)', class: 'beads-halo' }));
    svg.append(svgEl('circle', { cx: CX, cy: CX, r: R, fill: 'none', stroke: 'rgba(236,200,140,.22)', 'stroke-width': 1.2 }));
    svg.append(ringG);
    // con trỏ tại đỉnh
    const pointer = svgEl('path', { d: `M ${CX - 7} 6 L ${CX + 7} 6 L ${CX} 19 Z`, fill: '#f3c973', class: 'beads-pointer' });
    svg.append(pointer);

    const nEl = h('span', { class: 'beads-count__n', text: '0' });
    const ofEl = h('span', { class: 'beads-count__of' });
    const phraseEl = h('div', { class: 'beads-phrase' });
    const roundEl = h('div', { class: 'beads-round' });
    const center = h('div', { class: 'beads-center', 'aria-hidden': 'true' }, [
      roundEl,
      h('div', { class: 'beads-count' }, [nEl, ofEl]),
      phraseEl,
    ]);
    const ripple = h('span', { class: 'beads-ripple', 'aria-hidden': 'true' });
    const stage = h('div', {
      class: 'beads-stage', role: 'button', tabindex: 0, 'aria-label': 'Lần một hạt', 'aria-describedby': 'beads-sr-count',
    }, [svg, center, ripple]);

    // chọn độ dài
    const lenBtns = LENGTHS.map((n) => h('button', {
      type: 'button', class: 'seg__btn', 'aria-pressed': String(n === st.len), 'data-len': n, text: `${n} hạt`,
      onclick: () => setLen(n),
    }));
    const seg = h('div', { class: 'seg beads-seg', role: 'group', 'aria-label': 'Độ dài chuỗi' }, lenBtns);

    // câu niệm
    const phraseBtns = BEAD_PHRASES.map((p, i) => h('button', {
      type: 'button', class: 'chip beads-phrasebtn', 'aria-pressed': String(i === st.phrase), text: p,
      onclick: () => { st.phrase = i; persist(); syncPhrase(true); },
    }));
    const phraseWrap = h('div', { class: 'beads-phrases', role: 'group', 'aria-label': 'Chọn câu niệm' }, phraseBtns);

    const sTotal = h('span', { class: 'stat__value', text: '0' });
    const sRounds = h('span', { class: 'stat__value', text: '0' });
    const sLeft = h('span', { class: 'stat__value', text: '0' });
    const stats = h('div', { class: 'stats beads-stats', role: 'group', 'aria-label': 'Công phu hôm nay' }, [
      h('div', { class: 'stat' }, [sTotal, h('span', { class: 'stat__label', text: 'câu niệm hôm nay' })]),
      h('div', { class: 'stat' }, [sRounds, h('span', { class: 'stat__label', text: 'vòng đã tròn' })]),
      h('div', { class: 'stat' }, [sLeft, h('span', { class: 'stat__label', text: 'hạt còn lại' })]),
    ]);

    const moBtn = h('button', {
      type: 'button', class: 'chip beads-mo', 'aria-pressed': String(st.mo),
      onclick: () => { st.mo = !st.mo; moBtn.setAttribute('aria-pressed', String(st.mo)); persist(); },
    }, [h('span', { html: icon('wood-fish', { size: 16 }) }), h('span', { text: 'Gõ mõ mỗi hạt' })]);
    const resetSlot = h('div', { class: 'beads-reset-slot' });
    const actions = h('div', { class: 'row beads-actions' }, [moBtn, resetSlot]);

    const section = h('section', { class: 'view beads-view' }, [
      viewHead('Niệm Phật', 'Mỗi lần chạm là một hạt, một câu niệm. Niệm thầm hay thành tiếng đều được.'),
      seg,
      stage,
      srCount,
      h('p', { class: 'beads-hint muted', text: 'Chạm vào chuỗi hạt, hoặc nhấn phím Cách hay Enter. Chuỗi xoay đến hạt kế tiếp; qua hạt mẫu là tròn một vòng.' }),
      phraseWrap,
      stats,
      actions,
      live,
    ]);
    root.append(section);

    // ── Vẽ chuỗi ──
    let beadEls: SVGCircleElement[] = [];
    let guruG: SVGGElement | null = null;
    let rotation = 0; // độ, tích luỹ
    const slots = (): number => st.len + 1;
    const step = (): number => 360 / slots();

    function buildRing(): void {
      ringG.replaceChildren();
      beadEls = [];
      const n = st.len;
      const stepRad = (Math.PI * 2) / (n + 1);
      const r = Math.min(15, Math.max(4.2, ((Math.PI * 2 * R) / (n + 1)) * 0.47));
      // dây nối
      ringG.append(svgEl('circle', { cx: CX, cy: CX, r: R, fill: 'none', stroke: 'rgba(60,35,18,.9)', 'stroke-width': 1.6 }));
      for (let k = 1; k <= n; k++) {
        const a = k * stepRad - Math.PI / 2;
        const c = svgEl('circle', {
          cx: (CX + R * Math.cos(a)).toFixed(2), cy: (CX + R * Math.sin(a)).toFixed(2), r: r.toFixed(2),
          fill: 'url(#bd-wood)', class: 'beads-bead',
        });
        beadEls.push(c);
        ringG.append(c);
      }
      // hạt mẫu (ở khe số 0) + tua rua toả ra ngoài
      const ga = -Math.PI / 2;
      const gx = CX + R * Math.cos(ga);
      const gy = CX + R * Math.sin(ga);
      guruG = svgEl('g', { class: 'beads-guru' });
      const guruR = Math.min(21, r * 1.55 + 4);
      const g = svgEl('circle', { cx: gx.toFixed(2), cy: gy.toFixed(2), r: guruR.toFixed(2), fill: 'url(#bd-guru)', stroke: 'rgba(255,230,170,.7)', 'stroke-width': 1 });
      const tassel = svgEl('path', {
        d: `M ${gx} ${gy + guruR} L ${gx} ${gy + guruR + 14} M ${gx - 5.5} ${gy + guruR + 14} L ${gx + 5.5} ${gy + guruR + 14} L ${gx + 3} ${gy + guruR + 36} L ${gx - 3} ${gy + guruR + 36} Z`,
        fill: '#c0392b', stroke: '#e0b25c', 'stroke-width': 1,
      });
      guruG.append(tassel, g);
      ringG.append(guruG);
    }

    const setRot = (animate: boolean): void => {
      ringG.style.transition = animate && !reducedMotion() ? 'transform .42s cubic-bezier(.22,.61,.36,1)' : 'none';
      ringG.style.transformOrigin = `${CX}px ${CX}px`;
      ringG.style.transform = `rotate(${rotation}deg)`;
    };
    const paintLit = (): void => {
      beadEls.forEach((b, i) => {
        const lit = i < st.count;
        b.classList.toggle('is-lit', lit);
        b.setAttribute('fill', lit ? 'url(#bd-lit)' : 'url(#bd-wood)');
      });
      // hạt đang ở đỉnh phát sáng nhẹ
      beadEls.forEach((b) => b.removeAttribute('filter'));
      const cur = beadEls[st.count - 1];
      if (cur) cur.setAttribute('filter', 'url(#bd-glow)');
    };
    function syncPhrase(pop = false): void {
      phraseBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === st.phrase)));
      phraseEl.textContent = BEAD_PHRASES[st.phrase] ?? '';
      if (pop) { phraseEl.classList.remove('is-pop'); void phraseEl.offsetWidth; phraseEl.classList.add('is-pop'); }
    }
    function syncText(announce = false): void {
      nEl.textContent = String(st.count);
      ofEl.textContent = ` / ${st.len}`;
      roundEl.textContent = st.rounds > 0 ? `Vòng thứ ${st.rounds + 1}` : 'Vòng thứ nhất';
      sTotal.textContent = String(st.total);
      sRounds.textContent = String(st.rounds);
      sLeft.textContent = String(st.len - st.count);
      const msg = `Hạt thứ ${st.count} trên ${st.len}`;
      srCount.textContent = msg;
      if (announce) live.textContent = msg;
      stage.setAttribute('aria-valuetext', msg);
    }
    function fullSync(animate: boolean): void {
      buildRing();
      rotation = -st.pos * step();
      setRot(animate);
      paintLit();
      syncPhrase();
      syncText();
      lenBtns.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.len) === st.len)));
    }

    let roundBusy = false;
    function tap(): void {
      if (roundBusy) return;
      ctx.audio.unlock();
      st.count += 1;
      st.total += 1;
      st.pos += 1;
      rotation -= step();
      setRot(true);
      paintLit();
      ctx.audio.play(st.mo ? 'mo' : 'bead');
      if (st.mo) ctx.audio.play('bead', { volume: 0.35 });
      haptic(8);
      // gợn sóng + câu niệm
      ripple.classList.remove('is-on'); void ripple.offsetWidth; ripple.classList.add('is-on');
      syncPhrase(true);
      if (st.count >= st.len) {
        completeRound();
      } else {
        syncText(true);
        persist();
      }
    }
    function completeRound(): void {
      roundBusy = true;
      st.rounds += 1;
      syncText(false);
      live.textContent = `Đã tròn một chuỗi ${st.len} hạt. Tổng ${st.rounds} vòng hôm nay.`;
      haptic(30);
      ctx.audio.play('bell', { volume: 0.7 });
      ctx.progress.record('beadsRound');
      stage.classList.add('is-round');
      persist();
      scope.timeout(() => {
        // hạt mẫu đi qua đỉnh, chuỗi làm mới
        st.pos += 1;
        rotation -= step();
        setRot(true);
        scope.timeout(() => {
          st.count = 0;
          paintLit();
          syncText();
          stage.classList.remove('is-round');
          roundBusy = false;
          persist();
        }, 480);
      }, 650);
    }
    function setLen(n: number): void {
      if (n === st.len) return;
      st.len = n; st.count = 0; st.pos = 0; roundBusy = false;
      stage.classList.remove('is-round');
      fullSync(false);
      persist();
    }

    // ── Bắt đầu lại (xác nhận tại chỗ) ──
    const resetBtn = h('button', { type: 'button', class: 'btn btn--ghost btn--sm beads-reset' }, [
      h('span', { html: icon('restart', { size: 16 }) }), h('span', { text: 'Bắt đầu lại' }),
    ]);
    let confirmTimer = 0;
    const showReset = (): void => { resetSlot.replaceChildren(resetBtn); };
    resetBtn.addEventListener('click', () => {
      if (st.count === 0) { doReset(); return; }
      const yes = h('button', { type: 'button', class: 'btn btn--danger btn--sm', text: 'Xóa chuỗi này', onclick: () => { scope.clearTimeout(confirmTimer); doReset(); } });
      const no = h('button', { type: 'button', class: 'btn btn--sm', text: 'Giữ lại', onclick: () => { scope.clearTimeout(confirmTimer); showReset(); } });
      resetSlot.replaceChildren(h('div', { class: 'beads-confirm', role: 'alertdialog', 'aria-label': 'Xác nhận bắt đầu lại' }, [
        h('span', { class: 'muted', text: 'Bắt đầu lại chuỗi này?' }), yes, no,
      ]));
      yes.focus();
      confirmTimer = scope.timeout(showReset, 6000);
    });
    function doReset(): void {
      st.total = Math.max(0, st.total - st.count);
      st.count = 0; st.pos = 0; roundBusy = false;
      stage.classList.remove('is-round');
      rotation = 0;
      fullSync(false);
      persist();
      showReset();
      live.textContent = 'Đã bắt đầu lại chuỗi.';
    }
    showReset();

    // ── Sự kiện ──
    scope.on(stage, 'pointerdown', (e) => { if ((e as PointerEvent).button === 0 || (e as PointerEvent).pointerType === 'touch') { e.preventDefault(); tap(); } });
    scope.on(stage, 'keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === ' ' || k === 'Enter') { e.preventDefault(); if (!(e as KeyboardEvent).repeat) tap(); }
    });
    scope.on(document, 'keydown', (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key !== ' ' || ke.repeat) return;
      const t = ke.target as HTMLElement | null;
      if (t && (t.closest('button:not(.panel__back), a, input, textarea, select') || t === stage)) return;
      ke.preventDefault();
      tap();
    });

    fullSync(false);
    scope.timeout(() => stage.focus({ preventScroll: true }), 160); // sau khi panel-host đặt focus
    return () => { persist(); scope.dispose(); };
  },
};
