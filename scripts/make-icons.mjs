/**
 * Sinh các biểu tượng PWA và ảnh chia sẻ mạng xã hội (OG 1200×630) vào public/
 * bằng Chrome headless (scripts/chrome.mjs).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './chrome.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const ICONS = path.join(PUB, 'icons');

const LOTUS_INNER = `
  <defs>
    <radialGradient id="halo" cx="50%" cy="54%" r="50%">
      <stop offset="0%" stop-color="#f8dc96" stop-opacity="0.42"/>
      <stop offset="65%" stop-color="#e0b25c" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#e0b25c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff0c2"/>
      <stop offset="52%" stop-color="#e5b861"/>
      <stop offset="100%" stop-color="#b57a26"/>
    </linearGradient>
    <linearGradient id="petalOuter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e6b85c" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#9e6820" stop-opacity="0.16"/>
    </linearGradient>
    <linearGradient id="petalMid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fbe3a2" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#ba802c" stop-opacity="0.20"/>
    </linearGradient>
    <linearGradient id="petalCenter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff1c7" stop-opacity="0.52"/>
      <stop offset="100%" stop-color="#cc9138" stop-opacity="0.26"/>
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="52" fill="url(#halo)"/>
  <g stroke="url(#gold)" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">
    <path fill="url(#petalOuter)" d="M58 88 C32 91 15 82 12 65 C27 59 45 66 58 88 Z"/>
    <path fill="url(#petalOuter)" d="M70 88 C96 91 113 82 116 65 C101 59 83 66 70 88 Z"/>
    <path fill="url(#petalMid)" d="M62 88 C37 85 24 67 30 39 C47 45 58 63 62 88 Z"/>
    <path fill="url(#petalMid)" d="M66 88 C91 85 104 67 98 39 C81 45 70 63 66 88 Z"/>
    <path fill="url(#petalCenter)" d="M64 20 C80 40 81 64 64 88 C47 64 48 40 64 20 Z"/>
  </g>
  <path d="M30 96 Q64 106 98 96" fill="none" stroke="url(#gold)" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M44 104 Q64 110 84 104" fill="none" stroke="url(#gold)" stroke-width="1.9" stroke-linecap="round" opacity="0.7"/>
  <circle cx="64" cy="56" r="2.8" fill="#fff0c2"/>
`;

function iconHtml({ size, maskable = false, rounded = false }) {
  const pad = maskable ? Math.round(size * 0.16) : Math.round(size * 0.08);
  const radius = rounded ? `${Math.round(size * 0.22)}px` : '0px';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: ${size}px; height: ${size}px; overflow: hidden;
      background: ${rounded ? 'transparent' : '#140d08'};
    }
    .tile {
      width: ${size}px; height: ${size}px;
      border-radius: ${radius};
      background: radial-gradient(78% 78% at 50% 34%, #382314 0%, #1d130b 60%, #120b06 100%);
      border: ${rounded ? `${Math.max(2, Math.round(size * 0.012))}px solid rgba(224,178,92,0.42)` : 'none'};
      display: grid; place-items: center;
      padding: ${pad}px;
      position: relative;
    }
    .ring {
      position: absolute;
      inset: ${Math.round(size * (maskable ? 0.11 : 0.055))}px;
      border-radius: 50%;
      border: ${Math.max(1.5, size * 0.006)}px solid rgba(224, 178, 92, 0.34);
      box-shadow: inset 0 0 ${Math.round(size * 0.08)}px rgba(184, 55, 45, 0.22);
    }
    svg { width: 100%; height: 100%; display: block; position: relative; z-index: 1; }
  </style></head><body>
    <div class="tile">
      <div class="ring"></div>
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${LOTUS_INNER}</svg>
    </div>
  </body></html>`;
}

function ogHtml() {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1200px; height: 630px; overflow: hidden;
      background: #140d08;
      color: #f5ead9;
      font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif;
    }
    .card {
      width: 1200px; height: 630px;
      position: relative;
      background:
        radial-gradient(64% 82% at 24% 48%, rgba(224, 178, 92, 0.20) 0%, rgba(184, 55, 45, 0.10) 44%, rgba(20, 13, 8, 0) 75%),
        radial-gradient(90% 90% at 80% 20%, #2d1d12 0%, #191009 55%, #120b06 100%);
      display: flex;
      align-items: center;
      padding: 64px 82px;
      gap: 58px;
    }
    .frame {
      position: absolute;
      inset: 22px;
      border: 1.5px solid rgba(224, 178, 92, 0.34);
      border-radius: 22px;
      pointer-events: none;
    }
    .frame::after {
      content: '';
      position: absolute;
      inset: 7px;
      border: 1px solid rgba(224, 178, 92, 0.14);
      border-radius: 16px;
    }
    .emblem {
      flex: 0 0 260px;
      width: 260px; height: 260px;
      border-radius: 50%;
      background: radial-gradient(70% 70% at 50% 38%, #3a2414 0%, #1c120a 68%, #140d08 100%);
      border: 2px solid rgba(224, 178, 92, 0.48);
      box-shadow: 0 0 60px rgba(224, 178, 92, 0.22), inset 0 0 28px rgba(184, 55, 45, 0.24);
      display: grid;
      place-items: center;
      padding: 22px;
    }
    .emblem svg { width: 100%; height: 100%; }
    .body { flex: 1; z-index: 1; }
    .eyebrow {
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      font-size: 19px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #e0b25c;
      margin-bottom: 14px;
      font-weight: 600;
    }
    h1 {
      font-size: 74px;
      line-height: 1.08;
      font-weight: 700;
      color: #fbe5b2;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
      margin-bottom: 16px;
    }
    .sub {
      font-size: 30px;
      line-height: 1.38;
      color: #e8d8c0;
      margin-bottom: 30px;
      font-weight: 400;
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    .pill {
      padding: 10px 20px;
      border-radius: 999px;
      background: rgba(224, 178, 92, 0.12);
      border: 1px solid rgba(224, 178, 92, 0.34);
      color: #f6dfa8;
      font-size: 20px;
      font-weight: 500;
    }
  </style></head><body>
    <div class="card">
      <div class="frame"></div>
      <div class="emblem">
        <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${LOTUS_INNER}</svg>
      </div>
      <div class="body">
        <div class="eyebrow">Không gian tịnh tâm trực tuyến</div>
        <h1>Chùa Liên Hoa</h1>
        <p class="sub">Chùa online 3D miễn phí · Lên chùa mọi lúc, mọi nơi</p>
        <div class="pills">
          <span class="pill">Niệm Phật</span>
          <span class="pill">Tụng kinh gõ mõ</span>
          <span class="pill">Thiền định</span>
          <span class="pill">Đèn hoa đăng</span>
        </div>
      </div>
    </div>
  </body></html>`;
}

async function main() {
  await fs.mkdir(ICONS, { recursive: true });
  const { browser, page } = await launch({ width: 1200, height: 630, mobile: false });
  try {
    const jobs = [
      { file: path.join(ICONS, 'icon-192.png'), w: 192, h: 192, html: iconHtml({ size: 192, rounded: true }), omitBackground: true },
      { file: path.join(ICONS, 'icon-512.png'), w: 512, h: 512, html: iconHtml({ size: 512, rounded: true }), omitBackground: true },
      { file: path.join(ICONS, 'maskable-512.png'), w: 512, h: 512, html: iconHtml({ size: 512, maskable: true }), omitBackground: false },
      { file: path.join(ICONS, 'apple-touch-icon.png'), w: 180, h: 180, html: iconHtml({ size: 180, maskable: false }), omitBackground: false },
      { file: path.join(PUB, 'og.png'), w: 1200, h: 630, html: ogHtml(), omitBackground: false },
    ];
    for (const j of jobs) {
      await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 1, isMobile: false });
      await page.setContent(j.html, { waitUntil: 'load' });
      await page.screenshot({ path: j.file, type: 'png', omitBackground: j.omitBackground, clip: { x: 0, y: 0, width: j.w, height: j.h } });
      const st = await fs.stat(j.file);
      console.log(`Đã tạo ${path.relative(ROOT, j.file)} (${j.w}×${j.h}, ${st.size} bytes)`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
