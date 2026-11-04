/**
 * Panel "Xin quẻ" (hộp thoại): ống xăm lắc (nút hoặc cảm biến chuyển động), rút một quẻ mỗi ngày,
 * thẻ quẻ có thơ + lời giải. Nội dung là lời nhắc tu tập, không phải bói toán.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { load, save } from '@/core/store';
import { QUE_LIST, drawQue, type Que } from '@/content/que';
import { icon } from '@/ui/icons';
import { createScope, dialogHead, h, haptic, hashStr, liveRegion, reducedMotion, today } from './practice-kit';

const TONE: Record<Que['tone'], string> = { 'lành': 'Quẻ lành', 'bình': 'Quẻ bình', 'nhắc': 'Quẻ nhắc nhở' };

const TUBE_SVG = `
<svg viewBox="0 0 160 200" class="que-tube__svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="qt-body" x1="0" x2="1"><stop offset="0" stop-color="#6e1a14"/><stop offset=".35" stop-color="#c4463a"/><stop offset=".6" stop-color="#a22c23"/><stop offset="1" stop-color="#5a130e"/></linearGradient>
    <linearGradient id="qt-gold" x1="0" x2="1"><stop offset="0" stop-color="#9a6a24"/><stop offset=".4" stop-color="#f3c973"/><stop offset="1" stop-color="#9a6a24"/></linearGradient>
    <linearGradient id="qt-stick" x1="0" x2="1"><stop offset="0" stop-color="#b98a52"/><stop offset=".5" stop-color="#ecc891"/><stop offset="1" stop-color="#a97b45"/></linearGradient>
  </defs>
  <g class="que-sticks">
    <rect x="52" y="10" width="7" height="96" rx="3" fill="url(#qt-stick)" transform="rotate(-9 55 100)"/>
    <rect x="64" y="2" width="7" height="104" rx="3" fill="url(#qt-stick)" transform="rotate(-4 67 100)"/>
    <rect x="77" y="14" width="7" height="92" rx="3" fill="url(#qt-stick)"/>
    <rect x="89" y="6" width="7" height="100" rx="3" fill="url(#qt-stick)" transform="rotate(5 92 100)"/>
    <rect x="100" y="16" width="7" height="90" rx="3" fill="url(#qt-stick)" transform="rotate(10 103 100)"/>
    <g class="que-pick"><rect x="70" y="-10" width="8" height="116" rx="3.5" fill="url(#qt-stick)" stroke="#f3c973" stroke-width="1"/><rect x="71.5" y="-4" width="5" height="26" rx="2" fill="#b8372d"/></g>
  </g>
  <ellipse cx="80" cy="108" rx="46" ry="9" fill="#2a0b08"/>
  <path d="M34 108 L40 184 Q80 200 120 184 L126 108 Q80 120 34 108Z" fill="url(#qt-body)" stroke="#f3c973" stroke-opacity=".5"/>
  <path d="M35 118 Q80 130 125 118 L126 130 Q80 142 34 130Z" fill="url(#qt-gold)"/>
  <path d="M38 168 Q80 182 122 168 L121 180 Q80 194 39 180Z" fill="url(#qt-gold)"/>
  <circle cx="80" cy="152" r="17" fill="none" stroke="#f3c973" stroke-width="1.6"/>
  <path d="M71 152h18M80 143v18M73.5 145.5l13 13M86.5 145.5l-13 13" stroke="#f3c973" stroke-width="1.4" stroke-linecap="round" opacity=".85"/>
</svg>`;

export const panel: PanelDef = {
  id: 'que',
  title: 'Xin quẻ',
  kind: 'dialog',
  mount(root: HTMLElement, ctx: AppContext) {
    const scope = createScope();
    const live = liveRegion();
    const day = today();
    const key = `que:${day}`;
    let busy = false;
    let drawn: Que | null = null;
    const savedNo = load<number | null>(key, null);
    if (savedNo != null) drawn = QUE_LIST.find((q) => q.no === savedNo) ?? null;

    const body = h('div', { class: 'que-body' });
    const frame = h('div', { class: 'pk-dialog que-dialog' }, [dialogHead('Xin quẻ', () => ctx.closePanel()), body, live]);
    root.append(frame);

    // ── Ống xăm ──
    function renderTube(): void {
      const tube = h('div', { class: 'que-tube', html: TUBE_SVG });
      const btn = h('button', { type: 'button', class: 'btn btn--gold btn--lg que-shake', onclick: () => void shake(true) }, [
        h('span', { html: icon('sticks', { size: 20 }) }), h('span', { text: 'Lắc ống xăm' }),
      ]);
      body.replaceChildren(
        h('p', { class: 'que-lead muted', text: 'Tĩnh tâm một chút, nghĩ đến điều bạn đang trăn trở rồi lắc ống xăm. Mỗi ngày chùa xin một quẻ.' }),
        h('div', { class: 'que-stage' }, [h('div', { class: 'que-glow', 'aria-hidden': 'true' }), tube]),
        btn,
        h('p', { class: 'que-hint muted', text: 'Trên điện thoại, bạn có thể lắc máy.' }),
      );
      tubeEl = tube; btnEl = btn;
    }
    let tubeEl: HTMLElement | null = null;
    let btnEl: HTMLButtonElement | null = null;

    async function shake(fromButton: boolean): Promise<void> {
      if (busy || drawn) return;
      busy = true;
      if (fromButton) await askMotionPermission();
      ctx.audio.unlock();
      ctx.audio.play('que');
      haptic([30, 40, 30, 40, 30]);
      ctx.world.perform('que', { inPlace: true }).catch(() => undefined);
      tubeEl?.classList.add('is-shaking');
      btnEl?.setAttribute('aria-disabled', 'true');
      live.textContent = 'Đang lắc ống xăm…';
      scope.timeout(() => {
        tubeEl?.classList.remove('is-shaking');
        tubeEl?.classList.add('is-picked');
        scope.timeout(reveal, reducedMotion() ? 0 : 900);
      }, reducedMotion() ? 200 : 1700);
    }
    function reveal(): void {
      const q = drawQue(hashStr(`${day}|${ctx.profile.name}`));
      drawn = q;
      save(key, q.no);
      ctx.progress.record('que');
      haptic(18);
      busy = false;
      renderCard(q, true);
    }

    // ── Thẻ quẻ ──
    function shareText(q: Que): string {
      return `Quẻ số ${q.no} — ${q.title}\n${q.poem.join('\n')}\n\n${q.meaning}\n(Lời nhắc tu tập — không phải bói toán · Chùa Bình Thạnh)`;
    }
    async function share(q: Que): Promise<void> {
      const text = shareText(q);
      try {
        if (navigator.share) { await navigator.share({ title: q.title, text }); return; }
      } catch (e) { if ((e as DOMException)?.name === 'AbortError') return; }
      try { await navigator.clipboard.writeText(text); ctx.toast('Đã sao chép quẻ để chia sẻ.', { kind: 'good' }); }
      catch { ctx.toast('Chưa chia sẻ được. Bạn thử chụp màn hình nhé.', { kind: 'warn' }); }
    }
    function renderCard(q: Que, fresh: boolean): void {
      const card = h('article', { class: `que-card tone-${q.tone}${fresh ? ' is-fresh' : ''}`, 'aria-label': `Quẻ số ${q.no}: ${q.title}` }, [
        h('div', { class: 'que-card__top' }, [
          h('span', { class: 'que-card__no', text: `Quẻ số ${q.no}` }),
          h('span', { class: 'que-card__tone', text: TONE[q.tone] }),
        ]),
        h('h3', { class: 'que-card__title', text: q.title }),
        h('div', { class: 'divider-ornament', 'aria-hidden': 'true' }, [h('i')]),
        h('div', { class: 'que-card__poem' }, q.poem.map((l, i) => h('p', { class: 'que-card__line', style: `--i:${i}`, text: l }))),
        h('div', { class: 'que-card__rule', 'aria-hidden': 'true' }),
        h('p', { class: 'que-card__meaning', text: q.meaning }),
        h('p', { class: 'que-card__note', text: 'Lời nhắc tu tập — không phải bói toán' }),
      ]);
      body.replaceChildren(
        ...(fresh ? [] : [h('p', { class: 'que-lead muted', text: 'Quẻ hôm nay của bạn. Ngày mai chùa sẽ xin quẻ khác nhé.' })]),
        card,
        h('div', { class: 'que-actions' }, [
          h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => void share(q) }, [h('span', { html: icon('share', { size: 18 }) }), h('span', { text: 'Chia sẻ' })]),
          h('button', { type: 'button', class: 'btn btn--gold', text: 'Đóng', onclick: () => ctx.closePanel() }),
        ]),
      );
      live.textContent = `Quẻ số ${q.no}: ${q.title}. ${q.poem.join(', ')}. ${q.meaning}`;
    }

    // ── Cảm biến lắc máy ──
    async function askMotionPermission(): Promise<void> {
      const DME = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent;
      if (DME?.requestPermission) { try { await DME.requestPermission(); } catch { /* người dùng từ chối: dùng nút */ } }
    }
    let hits = 0;
    let lastHit = 0;
    const onMotion = (e: Event): void => {
      if (busy || drawn) return;
      const a = (e as DeviceMotionEvent).accelerationIncludingGravity;
      if (!a) return;
      const mag = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0);
      const t = performance.now();
      if (mag > 24 && t - lastHit > 140) {
        hits = t - lastHit < 900 ? hits + 1 : 1;
        lastHit = t;
        if (hits >= 4) { hits = 0; void shake(false); }
      }
    };
    scope.on(window, 'devicemotion', onMotion);

    if (drawn) renderCard(drawn, false); else renderTube();
    return () => scope.dispose();
  },
};
