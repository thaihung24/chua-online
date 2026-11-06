/**
 * Sinh các biểu tượng PWA và ảnh chia sẻ mạng xã hội (OG 1200×630) riêng cho Chùa Rắn vào public/
 * bằng Chrome headless (scripts/chrome.mjs).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './chrome.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const ICONS = path.join(PUB, 'icons');

const CHUA_RAN_INNER = `
  <defs>
    <radialGradient id="crHalo" cx="50%" cy="52%" r="50%">
      <stop offset="0%" stop-color="#ffe9a6" stop-opacity="0.44"/>
      <stop offset="58%" stop-color="#e0b25c" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#e0b25c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="crGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff6d6"/>
      <stop offset="48%" stop-color="#f0c368"/>
      <stop offset="100%" stop-color="#ae721e"/>
    </linearGradient>
    <linearGradient id="crRoof" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff1c2"/>
      <stop offset="55%" stop-color="#dfa344"/>
      <stop offset="100%" stop-color="#8c5214"/>
    </linearGradient>
    <linearGradient id="crJade" x1="18%" y1="12%" x2="82%" y2="92%">
      <stop offset="0%" stop-color="#b8f7d6"/>
      <stop offset="38%" stop-color="#4ec695"/>
      <stop offset="78%" stop-color="#1f825c"/>
      <stop offset="100%" stop-color="#125039"/>
    </linearGradient>
    <linearGradient id="crHood" x1="15%" y1="15%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#fce39c"/>
      <stop offset="32%" stop-color="#5cc99b"/>
      <stop offset="100%" stop-color="#186044"/>
    </linearGradient>
    <linearGradient id="crBelly" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff4ce"/>
      <stop offset="100%" stop-color="#cfa048"/>
    </linearGradient>
    <linearGradient id="crLotusCenter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff3cb" stop-opacity="0.92"/>
      <stop offset="65%" stop-color="#dda142" stop-opacity="0.68"/>
      <stop offset="100%" stop-color="#8e5415" stop-opacity="0.48"/>
    </linearGradient>
    <linearGradient id="crLotusSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fae09d" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#9c5c19" stop-opacity="0.40"/>
    </linearGradient>
  </defs>
  <circle cx="64" cy="59" r="52" fill="url(#crHalo)"/>
  <path d="M64 6.8 C66.5 9.8 66.6 12.4 64 14.2 C61.4 12.4 61.5 9.8 64 6.8 Z" fill="#fff6d6"/>
  <path d="M17 24.5 C23.5 29 34.5 28 46.5 22.8 C54.5 19.2 59.8 15.6 64 12.2 C68.2 15.6 73.5 19.2 81.5 22.8 C93.5 28 104.5 29 111 24.5 C105.2 31.6 92.8 33 79.5 28.5 C72.2 26 67.6 23.3 64 20.8 C60.4 23.3 55.8 26 48.5 28.5 C35.2 33 22.8 31.6 17 24.5 Z"
        fill="url(#crRoof)" stroke="url(#crGold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M58 35.5 C43 36 35.5 46 38.5 58 C40.8 66.5 48.5 70.8 57.5 71.8 C66.5 70.2 71.5 63.8 71 53.8 C70.5 43.5 65.8 35.2 58 35.5 Z"
        fill="url(#crHood)" stroke="url(#crGold)" stroke-width="2.1" stroke-linejoin="round"/>
  <path d="M44.5 47.5 C43 54.5 45.8 61 52 65" fill="none" stroke="#fff4ce" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
  <path d="M48.5 43 C46.8 49 48.5 55.5 53.5 59.5" fill="none" stroke="#fff4ce" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
  <path d="M53.5 36 C51.8 31.5 55.5 29 58.2 32.8 C60.2 29.2 64.5 29.5 64.2 33.8 C67.2 31.5 70.2 32.8 68.2 36.2 Z"
        fill="url(#crRoof)" stroke="url(#crGold)" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M62 47 C56.5 47.8 53.8 52 55.8 57 C58.2 62.8 68.5 64.5 76.5 68.5 C85.5 73 88.2 80.2 83.2 86.8 C78.2 93.2 65.2 95.5 50 93.5 C39.5 92.1 31.8 87.6 28.8 80.5 C33.8 84.8 42 87.5 52 87.2 C63.8 86.8 72.5 83.8 74 79.4 C75.4 75 70.2 71.8 60.5 68.2 C49.2 64 43.8 57.8 45.2 49 C46.5 40.6 53.8 35.5 63.5 35.5 C71.5 35.5 78.8 38.6 82.2 43 C83.5 44.6 82.8 46.6 80.2 47.2 C75.5 48.2 68.5 46.2 62 47 Z"
        fill="url(#crJade)" stroke="url(#crGold)" stroke-width="2" stroke-linejoin="round"/>
  <path d="M54.5 42.5 C48.8 48 49.5 57.5 59.5 63.2 C69.8 69 79.5 73.2 78.8 81"
        fill="none" stroke="url(#crBelly)" stroke-width="1.7" stroke-linecap="round" opacity="0.72"/>
  <path d="M67.2 40.6 Q70.5 39.2 73.2 41 Q70.2 42.6 67.2 40.6 Z" fill="#170e07"/>
  <circle cx="70.4" cy="40.7" r="0.85" fill="#fff6d6"/>
  <circle cx="90" cy="46" r="6.2" fill="#ffe9a6" opacity="0.26"/>
  <circle cx="90" cy="46" r="3.2" fill="#fff6d6" stroke="url(#crGold)" stroke-width="1.2"/>
  <g stroke="url(#crGold)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
    <path fill="url(#crLotusSide)" d="M55 102 C32 103 17 95 14 82 C28 78 43 84 55 102 Z"/>
    <path fill="url(#crLotusSide)" d="M73 102 C96 103 111 95 114 82 C100 78 85 84 73 102 Z"/>
    <path fill="url(#crLotusSide)" d="M60 102 C42 98 32 87 36 73 C49 77 57 87 60 102 Z"/>
    <path fill="url(#crLotusSide)" d="M68 102 C86 98 96 87 92 73 C79 77 71 87 68 102 Z"/>
    <path fill="url(#crLotusCenter)" d="M64 70 C74.5 81 74.5 92 64 102.5 C53.5 92 53.5 81 64 70 Z"/>
  </g>
  <path d="M33 108.8 Q64 115.5 95 108.8" fill="none" stroke="url(#crGold)" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M47 114.2 Q64 118.2 81 114.2" fill="none" stroke="url(#crGold)" stroke-width="1.6" stroke-linecap="round" opacity="0.68"/>
`;

function iconHtml({ size, maskable = false, rounded = false }) {
  const pad = maskable ? Math.round(size * 0.15) : Math.round(size * 0.075);
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
      background: radial-gradient(78% 78% at 50% 34%, #3a2313 0%, #1c1109 60%, #110a05 100%);
      border: ${rounded ? `${Math.max(2, Math.round(size * 0.012))}px solid rgba(224,178,92,0.46)` : 'none'};
      display: grid; place-items: center;
      padding: ${pad}px;
      position: relative;
    }
    .ring {
      position: absolute;
      inset: ${Math.round(size * (maskable ? 0.105 : 0.052))}px;
      border-radius: 50%;
      border: ${Math.max(1.5, size * 0.006)}px solid rgba(224, 178, 92, 0.38);
      box-shadow: inset 0 0 ${Math.round(size * 0.08)}px rgba(184, 55, 45, 0.24);
    }
    svg { width: 100%; height: 100%; display: block; position: relative; z-index: 1; }
  </style></head><body>
    <div class="tile">
      <div class="ring"></div>
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${CHUA_RAN_INNER}</svg>
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
        radial-gradient(64% 82% at 24% 48%, rgba(224, 178, 92, 0.20) 0%, rgba(92, 201, 155, 0.08) 38%, rgba(20, 13, 8, 0) 75%),
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
      flex: 0 0 264px;
      width: 264px; height: 264px;
      border-radius: 50%;
      background: radial-gradient(70% 70% at 50% 38%, #3a2313 0%, #1c1109 68%, #120b06 100%);
      border: 2.5px solid rgba(224, 178, 92, 0.52);
      box-shadow: 0 0 60px rgba(224, 178, 92, 0.24), inset 0 0 28px rgba(184, 55, 45, 0.26);
      display: grid;
      place-items: center;
      padding: 20px;
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
        <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${CHUA_RAN_INNER}</svg>
      </div>
      <div class="body">
        <div class="eyebrow">Không gian tịnh tâm trực tuyến</div>
        <h1>Chùa Rắn</h1>
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
      { file: path.join(PUB, 'og-chua-ran.png'), w: 1200, h: 630, html: ogHtml(), omitBackground: false },
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
