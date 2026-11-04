/**
 * Texture sinh bằng mã (CanvasTexture): gạch lát sân, cỏ, sỏi, ngói âm dương, gỗ sơn son, cửa bức bàn,
 * hoành phi/câu đối, bảng hiệu, ảnh mây, lá tim… Không dùng file ngoài.
 */
import * as THREE from 'three';
import { rng } from './core';

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')!];
}
function tex(c: HTMLCanvasElement, repeat = true, srgb = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}
const hsl = (h: number, s: number, l: number): string => `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;

/** Nhiễu hạt mịn trên toàn canvas. */
function grain(ctx: CanvasRenderingContext2D, w: number, h: number, amt: number, seed: number): void {
  const r = rng(seed);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * amt;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

/** Vẽ hình chữ nhật lặp liền mạch (wrap) trên texture. */
function wrapRect(ctx: CanvasRenderingContext2D, W: number, H: number, x: number, y: number, w: number, h: number, fn: (ox: number, oy: number) => void): void {
  for (const ox of [-W, 0, W]) for (const oy of [-H, 0, H]) {
    if (x + ox + w < 0 || x + ox > W || y + oy + h < 0 || y + oy > H) continue;
    fn(ox, oy);
  }
}

/** Gạch lát sân đá xám, xếp so le, có biến thiên từng viên. Cạnh vuông ~ 0.9m khi lặp mỗi 3.6m. */
export function stoneTexture(): THREE.CanvasTexture {
  const S = 1024, [c, ctx] = canvas(S, S);
  const r = rng(11);
  ctx.fillStyle = '#4f4a44'; ctx.fillRect(0, 0, S, S);
  const rows = 4, th = S / rows, tw = S / 3;
  for (let row = 0; row < rows; row++) {
    const off = (row % 2) * tw * 0.5;
    for (let col = -1; col < 3; col++) {
      const x = col * tw + off + 4, y = row * th + 4, w = tw - 8, h = th - 8;
      const hue = 28 + r() * 16 - 6, sat = 5 + r() * 9, lum = 48 + r() * 14;
      wrapRect(ctx, S, S, x, y, w, h, (ox, oy) => {
        const g = ctx.createLinearGradient(x + ox, y + oy, x + ox + w, y + oy + h);
        g.addColorStop(0, hsl(hue, sat, lum + 5));
        g.addColorStop(1, hsl(hue, sat, lum - 5));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(x + ox, y + oy, w, h, 10); ctx.fill();
        // viền sáng/tối tạo khối
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,248,235,0.22)';
        ctx.beginPath(); ctx.moveTo(x + ox + 8, y + oy + h - 6); ctx.lineTo(x + ox + 8, y + oy + 4); ctx.lineTo(x + ox + w - 8, y + oy + 4); ctx.stroke();
        ctx.strokeStyle = 'rgba(30,22,16,0.28)';
        ctx.beginPath(); ctx.moveTo(x + ox + w - 4, y + oy + 8); ctx.lineTo(x + ox + w - 4, y + oy + h - 4); ctx.lineTo(x + ox + 8, y + oy + h - 4); ctx.stroke();
        // đốm & vết
        for (let k = 0; k < 90; k++) {
          ctx.fillStyle = r() > 0.5 ? 'rgba(40,30,20,0.16)' : 'rgba(255,245,225,0.14)';
          const rr = 1 + r() * 4;
          ctx.beginPath(); ctx.arc(x + ox + r() * w, y + oy + r() * h, rr, 0, 7); ctx.fill();
        }
        if (r() > 0.55) { // vết nứt
          ctx.strokeStyle = 'rgba(40,30,22,0.35)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); let px = x + ox + r() * w, py = y + oy + r() * h; ctx.moveTo(px, py);
          for (let k = 0; k < 5; k++) { px += (r() - 0.5) * 60; py += (r() - 0.5) * 60; ctx.lineTo(px, py); }
          ctx.stroke();
        }
        if (r() > 0.7) { // rêu loang
          ctx.fillStyle = 'rgba(90,120,60,0.13)';
          ctx.beginPath(); ctx.ellipse(x + ox + r() * w, y + oy + h - r() * 20, 30 + r() * 40, 12 + r() * 14, 0, 0, 7); ctx.fill();
        }
      });
    }
  }
  grain(ctx, S, S, 16, 3);
  return tex(c);
}

export function grassTexture(): THREE.CanvasTexture {
  const S = 512, [c, ctx] = canvas(S, S);
  const r = rng(23);
  ctx.fillStyle = '#5b8a3f'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 2600; i++) {
    const x = r() * S, y = r() * S;
    ctx.strokeStyle = hsl(86 + r() * 36, 34 + r() * 22, 28 + r() * 22);
    ctx.lineWidth = 1 + r() * 1.5;
    ctx.beginPath();
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      if (x + ox < -8 || x + ox > S + 8 || y + oy < -8 || y + oy > S + 8) continue;
      ctx.moveTo(x + ox, y + oy); ctx.lineTo(x + ox + (r() - 0.5) * 6, y + oy - 4 - r() * 8);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 28; i++) { // đốm hoa nhỏ
    ctx.fillStyle = r() > 0.5 ? 'rgba(255,240,170,0.7)' : 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(r() * S, r() * S, 1.4, 0, 7); ctx.fill();
  }
  grain(ctx, S, S, 10, 5);
  return tex(c);
}

export function gravelTexture(): THREE.CanvasTexture {
  const S = 512, [c, ctx] = canvas(S, S);
  const r = rng(31);
  ctx.fillStyle = '#d6cfbd'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 3500; i++) {
    ctx.fillStyle = hsl(36 + r() * 12, 8 + r() * 10, 56 + r() * 34);
    const x = r() * S, y = r() * S, rr = 1 + r() * 2.8;
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      if (x + ox < -4 || x + ox > S + 4 || y + oy < -4 || y + oy > S + 4) continue;
      ctx.beginPath(); ctx.arc(x + ox, y + oy, rr, 0, 7); ctx.fill();
    }
  }
  grain(ctx, S, S, 12, 7);
  return tex(c);
}

/** Đất/lối mòn nâu nhạt. */
export function dirtTexture(): THREE.CanvasTexture {
  const S = 256, [c, ctx] = canvas(S, S);
  const r = rng(41);
  ctx.fillStyle = '#8a6f52'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = hsl(28 + r() * 10, 22 + r() * 12, 30 + r() * 24);
    ctx.beginPath(); ctx.arc(r() * S, r() * S, 1 + r() * 3, 0, 7); ctx.fill();
  }
  grain(ctx, S, S, 14, 9);
  return tex(c);
}

/** Ngói âm dương: gân dọc (u: ngang mái, v: dọc dốc mái). Lặp 1 viên/0.28m theo u. */
export function roofTexture(): THREE.CanvasTexture {
  const S = 512, [c, ctx] = canvas(S, S);
  const r = rng(51);
  ctx.fillStyle = '#4a2418'; ctx.fillRect(0, 0, S, S);
  const cols = 8, cw = S / cols, rowsN = 8, rh = S / rowsN;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rowsN; row++) {
      const hue = 16 + r() * 10, sat = 46 + r() * 18, lum = 30 + r() * 10 + (r() > 0.9 ? -8 : 0);
      const x = col * cw, y = row * rh;
      // ngói ống (cong): sáng ở giữa, tối hai bên
      const g = ctx.createLinearGradient(x, 0, x + cw, 0);
      g.addColorStop(0, hsl(hue, sat, lum - 12));
      g.addColorStop(0.28, hsl(hue, sat, lum + 6));
      g.addColorStop(0.5, hsl(hue, sat, lum + 10));
      g.addColorStop(0.72, hsl(hue, sat, lum + 2));
      g.addColorStop(1, hsl(hue, sat, lum - 14));
      ctx.fillStyle = g;
      ctx.fillRect(x + 2, y, cw - 4, rh);
      // bóng chồng ngói theo hàng
      const gr = ctx.createLinearGradient(0, y, 0, y + rh);
      gr.addColorStop(0, 'rgba(20,8,4,0.55)'); gr.addColorStop(0.22, 'rgba(20,8,4,0)');
      gr.addColorStop(0.92, 'rgba(255,200,150,0.10)'); gr.addColorStop(1, 'rgba(10,4,2,0.4)');
      ctx.fillStyle = gr; ctx.fillRect(x + 2, y, cw - 4, rh);
      if (r() > 0.78) { ctx.fillStyle = 'rgba(80,100,50,0.22)'; ctx.fillRect(x + 6, y + 4, cw - 12, rh * 0.5); }
    }
  }
  grain(ctx, S, S, 14, 13);
  return tex(c);
}

/** Gỗ sơn son (đỏ sơn mài) có thớ nhẹ và ánh. */
export function lacquerTexture(): THREE.CanvasTexture {
  const S = 256, [c, ctx] = canvas(S, S);
  const r = rng(61);
  const g = ctx.createLinearGradient(0, 0, S, 0);
  g.addColorStop(0, '#a82e26'); g.addColorStop(0.5, '#c0402f'); g.addColorStop(1, '#a22a22');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 160; i++) {
    ctx.strokeStyle = `rgba(${r() > 0.5 ? '60,10,8' : '230,120,90'},${0.05 + r() * 0.1})`;
    ctx.lineWidth = 0.6 + r() * 1.2;
    const x = r() * S;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x + 6 * (r() - 0.5), S * 0.3, x - 6 * (r() - 0.5), S * 0.7, x + 3 * (r() - 0.5), S); ctx.stroke();
  }
  grain(ctx, S, S, 10, 17);
  return tex(c);
}

/** Gỗ nâu (sàn, bậc, bàn). */
export function woodTexture(): THREE.CanvasTexture {
  const S = 256, [c, ctx] = canvas(S, S);
  const r = rng(71);
  const planks = 4, ph = S / planks;
  for (let p = 0; p < planks; p++) {
    ctx.fillStyle = hsl(26 + r() * 6, 38 + r() * 10, 30 + r() * 8);
    ctx.fillRect(0, p * ph, S, ph);
    for (let i = 0; i < 26; i++) {
      ctx.strokeStyle = `rgba(${r() > 0.5 ? '30,15,6' : '200,150,100'},${0.07 + r() * 0.12})`;
      ctx.lineWidth = 0.7 + r();
      const y = p * ph + r() * ph;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(S * 0.3, y + 3 * (r() - 0.5), S * 0.6, y + 3 * (r() - 0.5), S, y + 2 * (r() - 0.5)); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(20,10,4,0.55)'; ctx.fillRect(0, p * ph, S, 2);
  }
  grain(ctx, S, S, 10, 19);
  return tex(c);
}

/** Cánh cửa bức bàn: khung nâu sẫm, ô trên song hoa vàng, ô dưới huy hiệu sen. 1 cánh = 1 texture. */
export function doorTexture(): THREE.CanvasTexture {
  const W = 256, H = 640, [c, ctx] = canvas(W, H);
  const gold = '#e0b25c';
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#4a160f'); g.addColorStop(0.5, '#6a2418'); g.addColorStop(1, '#4a160f');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gold; ctx.lineWidth = 5; ctx.strokeRect(8, 8, W - 16, H - 16);
  ctx.lineWidth = 2; ctx.strokeRect(18, 18, W - 36, H - 36);
  // ô song hoa trên
  ctx.fillStyle = '#2a0c08'; ctx.fillRect(30, 30, W - 60, 250);
  ctx.strokeStyle = gold; ctx.lineWidth = 3;
  for (let i = -8; i <= 16; i++) {
    ctx.beginPath(); ctx.moveTo(30 + i * 20, 30); ctx.lineTo(30 + i * 20 + 250, 280); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30 + i * 20 + 250, 30); ctx.lineTo(30 + i * 20, 280); ctx.stroke();
  }
  ctx.fillStyle = '#4a160f'; ctx.fillRect(0, 0, 30, H); ctx.fillRect(W - 30, 0, 30, H); ctx.fillRect(0, 0, W, 30); ctx.fillRect(0, 280, W, 20);
  ctx.strokeStyle = gold; ctx.lineWidth = 5; ctx.strokeRect(8, 8, W - 16, H - 16); ctx.lineWidth = 2; ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.lineWidth = 3; ctx.strokeRect(30, 30, W - 60, 250);
  // ô dưới
  ctx.fillStyle = '#3a110b'; ctx.fillRect(30, 310, W - 60, 300);
  ctx.strokeStyle = gold; ctx.lineWidth = 3; ctx.strokeRect(30, 310, W - 60, 300);
  // huy hiệu sen
  const cx = W / 2, cy = 460;
  ctx.fillStyle = gold;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
    ctx.beginPath(); ctx.ellipse(0, -42, 14, 34, 0, 0, 7); ctx.fill(); ctx.restore();
  }
  ctx.fillStyle = '#3a110b'; ctx.beginPath(); ctx.arc(cx, cy, 24, 0, 7); ctx.fill();
  ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, 7); ctx.fill();
  const t = tex(c, false);
  return t;
}

/** Bảng sơn son chữ vàng (hoành phi, bảng tam quan). */
export function plaqueTexture(text: string, opts: { w?: number; h?: number; bg?: string; font?: number; sub?: string } = {}): THREE.CanvasTexture {
  const W = opts.w ?? 1024, H = opts.h ?? 256, [c, ctx] = canvas(W, H);
  const bg = opts.bg ?? '#9b2a22';
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, bg); g.addColorStop(1, '#6e1b16');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(81);
  for (let i = 0; i < 90; i++) { ctx.strokeStyle = `rgba(30,5,3,${0.05 + r() * 0.08})`; ctx.beginPath(); const y = r() * H; ctx.moveTo(0, y); ctx.lineTo(W, y + (r() - 0.5) * 8); ctx.stroke(); }
  const gold = ctx.createLinearGradient(0, 0, 0, H);
  gold.addColorStop(0, '#fbe29a'); gold.addColorStop(0.5, '#e2b24c'); gold.addColorStop(1, '#b98428');
  ctx.strokeStyle = gold; ctx.lineWidth = 10; ctx.strokeRect(10, 10, W - 20, H - 20);
  ctx.lineWidth = 3; ctx.strokeRect(28, 28, W - 56, H - 56);
  for (const [x, y] of [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]] as const) {
    ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
  }
  const fs = opts.font ?? Math.floor(H * 0.48);
  ctx.font = `800 ${fs}px "Iowan Old Style","Palatino Linotype","Noto Serif","Times New Roman",serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const cy = opts.sub ? H * 0.43 : H * 0.52;
  let size = fs;
  while (ctx.measureText(text).width > W - 140 && size > 20) { size -= 4; ctx.font = `800 ${size}px "Iowan Old Style","Palatino Linotype","Noto Serif","Times New Roman",serif`; }
  ctx.shadowColor = 'rgba(40,6,2,0.8)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
  ctx.fillStyle = gold; ctx.fillText(text, W / 2, cy);
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if (opts.sub) { ctx.font = `600 ${Math.floor(H * 0.14)}px "Iowan Old Style","Palatino Linotype",serif`; ctx.fillStyle = '#f3d58a'; ctx.fillText(opts.sub, W / 2, H * 0.80); }
  return tex(c, false);
}

/** Câu đối dọc chữ vàng nền đen/đỏ thẫm; mỗi từ một dòng. */
export function coupletTexture(words: string[]): THREE.CanvasTexture {
  const W = 192, H = 1024, [c, ctx] = canvas(W, H);
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#1d0b08'); g.addColorStop(0.5, '#33120c'); g.addColorStop(1, '#1d0b08');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const gold = ctx.createLinearGradient(0, 0, 0, H);
  gold.addColorStop(0, '#fbe29a'); gold.addColorStop(0.5, '#e2b24c'); gold.addColorStop(1, '#b98428');
  ctx.strokeStyle = gold; ctx.lineWidth = 6; ctx.strokeRect(6, 6, W - 12, H - 12);
  ctx.lineWidth = 2; ctx.strokeRect(16, 16, W - 32, H - 32);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = gold;
  const step = (H - 100) / words.length;
  words.forEach((w, i) => {
    let size = 66;
    ctx.font = `800 ${size}px "Iowan Old Style","Palatino Linotype","Noto Serif",serif`;
    while (ctx.measureText(w).width > W - 40 && size > 18) { size -= 3; ctx.font = `800 ${size}px "Iowan Old Style","Palatino Linotype","Noto Serif",serif`; }
    ctx.fillText(w, W / 2, 50 + step * (i + 0.5));
  });
  return tex(c, false);
}

/** Mây mềm (alpha). */
export function cloudTexture(): THREE.CanvasTexture {
  const W = 512, H = 256, [c, ctx] = canvas(W, H);
  const r = rng(91);
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < 38; i++) {
    const x = W * 0.18 + r() * W * 0.64, y = H * 0.5 + (r() - 0.35) * H * 0.26, rad = 28 + r() * 54 * (1 - Math.abs(x / W - 0.5));
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.6, 'rgba(255,255,255,0.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
  }
  const t = tex(c, false);
  return t;
}

/** Quầng sáng tròn mềm (dùng cho Sprite/hạt phát sáng). */
export function glowTexture(): THREE.CanvasTexture {
  const S = 128, [c, ctx] = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.55)'); g.addColorStop(0.6, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  return tex(c, false);
}

/** Vằn nước gợn (dùng làm normal giả trong shader nước). */
export function noiseTexture(): THREE.DataTexture {
  const S = 128;
  const r = rng(101);
  const data = new Uint8Array(S * S * 4);
  const base = new Float32Array(S * S);
  for (let i = 0; i < base.length; i++) base[i] = r();
  const at = (x: number, y: number): number => base[((y + S) % S) * S + ((x + S) % S)];
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    // làm mịn đơn giản (box blur 3x3) rồi lặp
    let v = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v += at(x + dx, y + dy);
    v /= 9;
    const i = (y * S + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = Math.floor(v * 255); data[i + 3] = 255;
  }
  const t = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

/** Mặt nạ trộn mặt đất (R: đá lát, G: sỏi thiền, B: lối đất/đáy ao). Phủ vùng thế giới `ext`. */
export interface GroundExtent { x0: number; x1: number; z0: number; z1: number }
export function groundMaskTexture(ext: GroundExtent, draw: (ctx: CanvasRenderingContext2D, toPx: (x: number, z: number) => [number, number], scale: number) => void): THREE.CanvasTexture {
  const S = 2048;
  const W = S, H = Math.round(S * (ext.z1 - ext.z0) / (ext.x1 - ext.x0));
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sc = W / (ext.x1 - ext.x0);
  draw(ctx, (x, z) => [(x - ext.x0) * sc, (z - ext.z0) * sc], sc);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  return t;
}

/** Lá tim (lá bồ đề) có alpha. */
export function heartLeafTexture(): THREE.CanvasTexture {
  const S = 128, [c, ctx] = canvas(S, S);
  ctx.translate(S / 2, S * 0.06);
  ctx.beginPath();
  ctx.moveTo(0, S * 0.9);
  ctx.bezierCurveTo(-S * 0.62, S * 0.55, -S * 0.5, S * 0.05, -S * 0.02, S * 0.34);
  ctx.bezierCurveTo(S * 0.5, S * 0.05, S * 0.62, S * 0.55, 0, S * 0.9);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, 0, S);
  g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d6d6d6');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, S * 0.9); ctx.lineTo(0, S * 0.3); ctx.stroke();
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, S * (0.8 - i * 0.14)); ctx.lineTo(-S * 0.2, S * (0.6 - i * 0.12)); ctx.moveTo(0, S * (0.8 - i * 0.14)); ctx.lineTo(S * 0.2, S * (0.6 - i * 0.12)); ctx.stroke(); }
  const t = tex(c, false);
  return t;
}
