/**
 * Panel "Cài ứng dụng" (hộp thoại): nút cài qua `beforeinstallprompt` (nếu có), hướng dẫn riêng cho iPhone/iPad, Android, máy tính.
 */
import type { PanelDef } from '@/core/contracts';
import { h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { dialogHead } from '@/ui/pm-kit';

interface InstallEvent extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

function platform(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

export const panel: PanelDef = {
  id: 'install',
  title: 'Cài ứng dụng',
  kind: 'dialog',
  mount(root, ctx) {
    const standalone = matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    const ev = (window as unknown as { __installPrompt?: InstallEvent }).__installPrompt;
    const pf = platform();

    const steps: Record<typeof pf, string[]> = {
      ios: [
        `Mở trang bằng <b>Safari</b>, bấm nút <b>Chia sẻ</b> ${icon('share', { size: 16 })} ở thanh dưới.`,
        'Kéo xuống và chọn <b>Thêm vào MH chính</b> (Thêm vào Màn hình chính).',
        'Bấm <b>Thêm</b> ở góc trên bên phải — biểu tượng hoa sen sẽ xuất hiện trên màn hình.',
      ],
      android: [
        'Bấm nút <b>⋮</b> (menu) của trình duyệt Chrome ở góc trên.',
        'Chọn <b>Cài đặt ứng dụng</b> hoặc <b>Thêm vào màn hình chính</b>.',
        'Xác nhận <b>Cài đặt</b> — chùa sẽ mở như một ứng dụng riêng.',
      ],
      desktop: [
        'Trên Chrome hoặc Edge, tìm biểu tượng <b>cài đặt</b> ở cuối thanh địa chỉ.',
        'Bấm <b>Cài đặt</b> để chùa mở trong cửa sổ riêng, không lẫn với các thẻ khác.',
      ],
    };

    const body = h('div', { class: 'stack' });
    if (standalone) {
      body.append(h('div', { class: 'notice', html: `${icon('check', { size: 18 })} Bạn đang dùng Chùa Rắn dưới dạng ứng dụng rồi. A Di Đà Phật.` }));
    } else {
      if (ev) {
        const b = h('button', { type: 'button', class: 'btn btn--gold btn--lg btn--block', html: `${icon('download', { size: 20 })}Cài ứng dụng ngay` });
        b.addEventListener('click', async () => {
          try {
            await ev.prompt();
            const c = await ev.userChoice;
            (window as unknown as { __installPrompt?: unknown }).__installPrompt = undefined;
            if (c.outcome === 'accepted') ctx.toast('Đã cài ứng dụng. Chúc bạn an lạc.', { kind: 'good' });
            ctx.closePanel();
          } catch {
            ctx.toast('Chưa cài được, bạn thử theo hướng dẫn bên dưới nhé.', { kind: 'warn' });
          }
        });
        body.append(b);
      }
      body.append(
        h('div', { class: 'inst-card' }, [
          h('h3', { class: 'inst-card__title', text: pf === 'ios' ? 'Trên iPhone / iPad' : pf === 'android' ? 'Trên Android' : 'Trên máy tính' }),
          h('ol', { class: 'inst-steps', html: steps[pf].map((s) => `<li>${s}</li>`).join('') }),
        ]),
      );
    }
    body.append(
      h('ul', { class: 'inst-perks' }, [
        h('li', { html: `${icon('sparkle', { size: 18 })}<span>Mở nhanh từ màn hình chính, toàn màn hình, gọn gàng.</span>` }),
        h('li', { html: `${icon('bell', { size: 18 })}<span>Giữ chuỗi giữ lửa dễ hơn mỗi ngày.</span>` }),
        h('li', { html: `${icon('cloud', { size: 18 })}<span>Miễn phí, không cần tải từ cửa hàng ứng dụng.</span>` }),
      ]),
    );
    root.append(dialogHead('Cài ứng dụng', 'Đưa chùa về màn hình điện thoại hay máy tính của bạn.', () => ctx.closePanel()), body);
  },
};
