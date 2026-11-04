/**
 * Panel "Nghe niệm Phật" (hộp thoại): chọn giọng, phát/dừng radio niệm Phật tổng hợp,
 * đồng hồ thời gian nghe (ghi `listenSeconds` mỗi 30 giây và xả phần lẻ khi dừng).
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { save } from '@/core/store';
import { CHANT_VOICES } from '@/audio/voices';
import { defaultChantVoice, getChantRadioStartedAt, getChantRadioVoice, isChantRadioOn, onChantRadioChange, startChantRadio, stopChantRadio } from '@/ui/chant-radio';
import { icon } from '@/ui/icons';
import { createScope, dialogHead, h, haptic, liveRegion } from './practice-kit';

export const panel: PanelDef = {
  id: 'listen',
  title: 'Nghe niệm Phật',
  kind: 'dialog',
  mount(root: HTMLElement, ctx: AppContext) {
    const scope = createScope();
    const live = liveRegion();
    const voices = Array.isArray(CHANT_VOICES) ? CHANT_VOICES : [];
    let voice = isChantRadioOn() ? getChantRadioVoice() : defaultChantVoice();
    if (!voices.some((v) => v.id === voice)) voice = voices[0]?.id ?? '';

    const playBtn = h('button', { type: 'button', class: 'listen-play', onclick: toggle });
    const status = h('div', { class: 'listen-status', 'aria-live': 'polite' });
    const clock = h('div', { class: 'listen-clock muted' });
    const eq = h('span', { class: 'listen-eq', 'aria-hidden': 'true' }, [h('i'), h('i'), h('i'), h('i'), h('i')]);
    const list = h('div', { class: 'listen-voices', role: 'radiogroup', 'aria-label': 'Chọn giọng niệm' });

    const vName = (): string => voices.find((v) => v.id === voice)?.name ?? 'Giọng niệm';

    function paint(): void {
      const on = isChantRadioOn();
      if (on && getChantRadioVoice()) voice = getChantRadioVoice();
      root.querySelector('.listen-hero')?.classList.toggle('is-on', on);
      playBtn.setAttribute('aria-pressed', String(on));
      playBtn.setAttribute('aria-label', on ? 'Dừng nghe niệm Phật' : 'Phát niệm Phật');
      playBtn.innerHTML = icon(on ? 'pause' : 'play', { size: 34 });
      status.replaceChildren(eq, h('span', { text: on ? `Đang phát: ${vName()}` : voices.length ? 'Chưa phát — chạm nút để bắt đầu' : 'Chưa có giọng niệm nào' }));
      paintClock();
      list.replaceChildren(...voices.map((v) => h('button', {
        type: 'button', class: `listen-voice${v.id === voice ? ' is-on' : ''}`, role: 'radio', 'aria-checked': String(v.id === voice),
        onclick: () => select(v.id),
      }, [
        h('span', { class: 'listen-voice__radio', 'aria-hidden': 'true' }, [h('i')]),
        h('span', { class: 'listen-voice__text' }, [h('strong', { text: v.name }), h('span', { class: 'muted', text: v.desc })]),
      ])));
    }
    function paintClock(): void {
      if (!isChantRadioOn()) { clock.textContent = 'Nghe nhẹ nhàng khi bạn đi dạo, làm việc hay ngồi thiền.'; return; }
      const m = Math.floor((Date.now() - getChantRadioStartedAt()) / 60_000);
      clock.textContent = m < 1 ? 'Vừa bắt đầu nghe' : `Đã nghe ${m} phút`;
    }
    function select(id: string): void {
      voice = id;
      save('listen:voice', id);
      haptic(6);
      if (isChantRadioOn()) startChantRadio(ctx, id);
      paint();
    }
    function toggle(): void {
      if (!voices.length) { ctx.toast('Chưa tải được giọng niệm. Bạn thử lại sau nhé.', { kind: 'warn' }); return; }
      if (isChantRadioOn()) { stopChantRadio(); live.textContent = 'Đã dừng nghe niệm Phật'; }
      else { startChantRadio(ctx, voice); live.textContent = `Đang phát ${vName()}`; }
      haptic(10);
      paint();
    }

    root.append(h('div', { class: 'pk-dialog listen-dialog' }, [
      dialogHead('Nghe niệm Phật', () => ctx.closePanel(), 'Tiếng niệm Phật tổng hợp, êm dịu — đóng hộp thoại vẫn nghe tiếp.'),
      h('div', { class: 'listen-hero' }, [h('div', { class: 'listen-halo', 'aria-hidden': 'true' }), playBtn]),
      status,
      clock,
      h('h3', { class: 'pk-label', text: 'Giọng niệm' }),
      list,
      live,
    ]));
    paint();
    const offRadio = onChantRadioChange(() => paint());
    scope.interval(paintClock, 5000);
    return () => { offRadio(); scope.dispose(); };
  },
};
