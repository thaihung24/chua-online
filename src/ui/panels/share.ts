/**
 * Panel "Khoe thành tích" (hộp thoại): vẽ thẻ ảnh 1080×1350 bằng canvas (nền chùa nếu chụp được, nhân vật SVG, tên, cấp, bậc, chuỗi…)
 * → xem trước + Chia sẻ (Web Share kèm ảnh) / Tải ảnh / Sao chép liên kết.
 */
import type { AppContext, PanelDef } from '@/core/contracts';
import { characterSvg } from '@/ui/character-preview';
import { copyText, fmt, h } from '@/ui/dom';
import { icon } from '@/ui/icons';
import { dialogHead } from '@/ui/pm-kit';
import { tierIcon } from '@/ui/tier-icon';

const W = 1080;
const H = 1350;
const SERIF = "600 {s}px 'Iowan Old Style','Palatino Linotype',Palatino,'Noto Serif',Georgia,serif";
const SANS = '{w} {s}px system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
const font = (tpl: string, s: number, w = 500): string => tpl.replace('{s}', String(s)).replace('{w}', String(w));

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error('img'));
    im.src = src;
  });
}
async function svgImg(svg: string): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(new Blob([svg.replace(/currentColor/g, '#f3c973').replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')], { type: 'image/svg+xml' }));
  try { return await loadImg(url); } finally { setTimeout(() => URL.revokeObjectURL(url), 2000); }
}
function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, hh: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + hh, r);
  c.arcTo(x + w, y + hh, x, y + hh, r);
  c.arcTo(x, y + hh, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function spaced(c: CanvasRenderingContext2D, text: string, x: number, y: number, sp: number): void {
  const widths = [...text].map((ch) => c.measureText(ch).width + sp);
  let cx = x - (widths.reduce((a, b) => a + b, 0) - sp) / 2;
  const align = c.textAlign;
  c.textAlign = 'left';
  [...text].forEach((ch, i) => { c.fillText(ch, cx, y); cx += widths[i]; });
  c.textAlign = align;
}

async function drawCard(ctx: AppContext): Promise<HTMLCanvasElement> {
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const c = cv.getContext('2d')!;
  const v = ctx.progress.view();
  const p = ctx.profile;

  // Nền: ảnh chùa (nếu có) hoặc gradient gỗ nâu
  let bgDrawn = false;
  try {
    const blob = await ctx.world.screenshot();
    if (blob && blob.size > 2000) {
      const url = URL.createObjectURL(blob);
      const im = await loadImg(url);
      const s = Math.max(W / im.width, H / im.height);
      c.drawImage(im, (W - im.width * s) / 2, (H - im.height * s) / 2, im.width * s, im.height * s);
      URL.revokeObjectURL(url);
      bgDrawn = true;
    }
  } catch { /* dùng nền gradient */ }
  if (!bgDrawn) {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#4a2f1b');
    g.addColorStop(0.55, '#2a1a0f');
    g.addColorStop(1, '#140d08');
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    const rg = c.createRadialGradient(W / 2, 560, 40, W / 2, 560, 640);
    rg.addColorStop(0, 'rgba(243,201,115,.42)');
    rg.addColorStop(1, 'rgba(243,201,115,0)');
    c.fillStyle = rg;
    c.fillRect(0, 0, W, H);
    // hoạ tiết vòng tròn mảnh
    c.strokeStyle = 'rgba(243,201,115,.1)';
    c.lineWidth = 2;
    for (let i = 1; i <= 5; i++) { c.beginPath(); c.arc(W / 2, 560, 130 + i * 95, 0, Math.PI * 2); c.stroke(); }
  }
  // Lớp tối để chữ rõ
  const ov = c.createLinearGradient(0, 0, 0, H);
  ov.addColorStop(0, 'rgba(14,8,4,.55)');
  ov.addColorStop(0.4, 'rgba(14,8,4,.1)');
  ov.addColorStop(0.62, 'rgba(14,8,4,.35)');
  ov.addColorStop(1, 'rgba(14,8,4,.92)');
  c.fillStyle = ov;
  c.fillRect(0, 0, W, H);

  // Khung viền
  c.strokeStyle = 'rgba(243,201,115,.55)';
  c.lineWidth = 3;
  rr(c, 36, 36, W - 72, H - 72, 44);
  c.stroke();
  c.strokeStyle = 'rgba(243,201,115,.18)';
  c.lineWidth = 1.5;
  rr(c, 52, 52, W - 104, H - 104, 34);
  c.stroke();

  // Logo + tên chùa
  const [logo, fig, tier] = await Promise.all([
    svgImg(icon('lotus', { size: 96 })),
    svgImg(characterSvg(p, { size: 520, aura: true, shadow: true, breathe: false })),
    svgImg(tierIcon(v.tier.id, { size: 150 })),
  ]);
  c.drawImage(logo, W / 2 - 40, 98, 80, 80);
  c.textAlign = 'center';
  c.fillStyle = '#f7dc9c';
  c.font = font(SERIF, 46);
  spaced(c, 'CHÙA LIÊN HOA', W / 2, 232, 9);
  c.fillStyle = 'rgba(245,234,217,.7)';
  c.font = font(SANS, 28, 400);
  c.fillText('Lên chùa mọi lúc, mọi nơi', W / 2, 276);

  // Nhân vật
  c.drawImage(fig, W / 2 - 280, 300, 560, 672);

  // Bảng tên
  c.font = font(SERIF, 66);
  const nameW = Math.min(c.measureText(p.name).width + 130, W - 160);
  c.save();
  rr(c, W / 2 - nameW / 2, 940, nameW, 104, 52);
  c.fillStyle = 'rgba(32,20,12,.82)';
  c.fill();
  c.strokeStyle = 'rgba(243,201,115,.7)';
  c.lineWidth = 2.5;
  c.stroke();
  c.restore();
  c.fillStyle = '#fbe6b0';
  c.textBaseline = 'middle';
  c.fillText(p.name, W / 2, 994, W - 220);
  c.textBaseline = 'alphabetic';

  // Cấp & bậc
  c.drawImage(tier, 120, 1072, 112, 112);
  c.textAlign = 'left';
  c.fillStyle = '#fff3d6';
  c.font = font(SERIF, 60);
  c.fillText(`Cấp ${fmt(v.level)}`, 258, 1128, 248);
  c.fillStyle = v.tier.accent;
  c.font = font(SANS, 34, 600);
  c.fillText(v.tier.name, 258, 1176, 248);

  // Số liệu
  let life: Record<string, number> = {};
  try { life = ((ctx.progress.exportState() as { life?: Record<string, number> })?.life) ?? {}; } catch { /* bỏ qua */ }
  const stats: [string, string][] = [
    [fmt(v.streak), 'ngày giữ lửa'],
    [fmt(life.practiceDays ?? 0), 'ngày công phu'],
    [fmt(v.xp), 'tinh tấn'],
  ];
  const sx = 520;
  const sw = 150;
  stats.forEach(([n, l], i) => {
    const x = sx + i * (sw + 14);
    c.fillStyle = 'rgba(255,244,224,.08)';
    rr(c, x, 1076, sw, 112, 22);
    c.fill();
    c.strokeStyle = 'rgba(243,201,115,.3)';
    c.lineWidth = 1.5;
    c.stroke();
    c.textAlign = 'center';
    c.fillStyle = '#f3c973';
    c.font = font(SERIF, 44);
    c.fillText(n, x + sw / 2, 1132, sw - 16);
    c.fillStyle = 'rgba(245,234,217,.75)';
    c.font = font(SANS, 20, 500);
    c.fillText(l, x + sw / 2, 1166, sw - 12);
  });

  // Chân
  c.textAlign = 'center';
  c.fillStyle = 'rgba(245,234,217,.6)';
  c.font = font(SANS, 26, 400);
  c.fillText(`${location.host || 'chualienhoa'} · A Di Đà Phật`, W / 2, 1262);
  return cv;
}

export const panel: PanelDef = {
  id: 'share',
  title: 'Khoe thành tích',
  kind: 'dialog',
  mount(root, ctx) {
    let alive = true;
    let blob: Blob | null = null;
    const stage = h('div', { class: 'shr-stage', 'aria-busy': 'true' }, [h('div', { class: 'pm-spin' })]);
    const msg = h('p', { class: 'pm-msg', role: 'status' });
    const shareBtn = h('button', { type: 'button', class: 'btn btn--gold', disabled: '', html: `${icon('share', { size: 18 })}Chia sẻ` });
    const dlBtn = h('button', { type: 'button', class: 'btn btn--ghost', disabled: '', html: `${icon('download', { size: 18 })}Tải ảnh` });
    const linkBtn = h('button', { type: 'button', class: 'btn btn--ghost', html: `${icon('link', { size: 18 })}Sao chép liên kết` });
    root.append(
      dialogHead('Khoe thành tích', 'Gửi tấm thẻ này cho người thân, bạn đạo để cùng tùy hỷ.', () => ctx.closePanel()),
      stage,
      h('div', { class: 'pm-actions shr-actions' }, [shareBtn, dlBtn, linkBtn]),
      msg,
    );

    const url = location.origin + '/';
    const file = (): File | null => (blob ? new File([blob], 'chua-lien-hoa.png', { type: 'image/png' }) : null);
    const say = (t: string, ok = true): void => { msg.className = 'pm-msg ' + (ok ? 'pm-msg--ok' : 'pm-msg--err'); msg.textContent = t; };

    void drawCard(ctx)
      .then((cv) => new Promise<Blob | null>((res) => cv.toBlob(res, 'image/png')).then((b) => ({ cv, b })))
      .then(({ cv, b }) => {
        if (!alive) return;
        blob = b;
        cv.className = 'shr-canvas';
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', `Thẻ thành tích của ${ctx.profile.name}, cấp ${ctx.progress.view().level}`);
        stage.replaceChildren(cv);
        stage.setAttribute('aria-busy', 'false');
        shareBtn.removeAttribute('disabled');
        dlBtn.removeAttribute('disabled');
      })
      .catch(() => {
        if (!alive) return;
        stage.replaceChildren(h('p', { class: 'pm-msg pm-msg--err', text: 'Chưa tạo được ảnh. Bạn thử lại sau nhé.' }));
      });

    shareBtn.addEventListener('click', async () => {
      const f = file();
      const text = `${ctx.profile.name} đang ở Cấp ${ctx.progress.view().level} trên Chùa Liên Hoa. Cùng lên chùa online nhé!`;
      try {
        if (f && navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: 'Chùa Liên Hoa', text, url });
        else if (navigator.share) await navigator.share({ title: 'Chùa Liên Hoa', text, url });
        else { say('Thiết bị chưa hỗ trợ chia sẻ trực tiếp — bạn bấm Tải ảnh hoặc Sao chép liên kết nhé.', false); return; }
        say('Đã mở chia sẻ. A Di Đà Phật.');
      } catch (e) {
        if ((e as Error).name !== 'AbortError') say('Chưa chia sẻ được, bạn thử Tải ảnh nhé.', false);
      }
    });
    dlBtn.addEventListener('click', () => {
      if (!blob) return;
      const a = h('a', { href: URL.createObjectURL(blob), download: `chua-lien-hoa-${ctx.profile.name.replace(/\s+/g, '-').toLowerCase()}.png` });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      say('Đã tải ảnh về máy.');
    });
    linkBtn.addEventListener('click', async () => {
      const ok = await copyText(url);
      say(ok ? 'Đã sao chép liên kết chùa.' : 'Chưa sao chép được, bạn chép thủ công: ' + url, ok);
    });
    return () => { alive = false; };
  },
};
