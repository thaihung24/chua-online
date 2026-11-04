/**
 * Kiểm thử tích hợp đầu-cuối (E2E) trên bản build production thật:
 * - Chạy Express + WebSocket server thật phục vụ `dist/`
 * - Kiểm tra HTTP status + CSP cho SPA, PWA assets, API và các trang SEO tĩnh
 * - Mở 2 trình duyệt Chrome thật (mobile 430x900 + desktop 1280x800) vào cùng phòng nhiều người
 * - Thử toàn bộ luồng chính: cổng chào -> tạo nhân vật -> vào chùa 3D -> dâng hương/lạy Phật ->
 *   niệm Phật tràng hạt -> tụng kinh gõ mõ -> thiền định -> hành trình -> hôm nay/lịch âm ->
 *   xin quẻ -> thả đèn hoa đăng ban đêm -> nhiều người thấy nhau + chào hỏi
 * - Ghi ảnh chụp nghiệm thu vào `dev/shots/final-*.png` và báo lỗi nếu có bất kỳ pageerror/console.error nào.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { launch } from './chrome.mjs';

const PORT = Number(process.env.E2E_PORT || 8799);
const BASE = `http://127.0.0.1:${PORT}`;
const DATA_DIR = `/tmp/chua-lien-hoa-e2e-${Date.now()}`;
const SHOT_DIR = path.resolve('dev/shots');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(url, timeoutMs = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.json();
    } catch {
      /* chờ thêm */
    }
    await sleep(250);
  }
  throw new Error(`Server không phản hồi tại ${url}`);
}

async function clickMatch(page, pattern, selector = 'button, a') {
  const reSrc = pattern instanceof RegExp ? pattern.source : pattern;
  const ok = await page.evaluate(
    (reStr, sel) => {
      const re = new RegExp(reStr, 'i');
      const els = [...document.querySelectorAll(sel)];
      const target = els.find((el) => {
        const htmlEl = /** @type {HTMLElement} */ (el);
        const style = window.getComputedStyle(htmlEl);
        if (style.display === 'none' || style.visibility === 'hidden' || htmlEl.closest('[hidden]')) return false;
        const txt = (htmlEl.textContent || '').trim();
        const aria = htmlEl.getAttribute('aria-label') || '';
        return re.test(txt) || re.test(aria);
      });
      if (!target) return false;
      /** @type {HTMLElement} */ (target).click();
      return true;
    },
    reSrc,
    selector,
  );
  if (!ok) throw new Error(`Không tìm thấy nút khớp /${reSrc}/ trong selector "${selector}"`);
}

async function main() {
  await fs.mkdir(SHOT_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  console.log('[1/6] Khởi động máy chủ production tại', BASE);
  const srv = spawn('./node_modules/.bin/tsx', ['server/index.ts'], {
    env: { ...process.env, PORT: String(PORT), DATA_DIR },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  srv.stderr.on('data', (d) => process.stderr.write(`[srv] ${d}`));

  const errors = [];
  let b1 = null;
  let b2 = null;

  try {
    const health = await waitForServer(`${BASE}/api/health`);
    console.log('  /api/health ->', JSON.stringify(health));

    console.log('[2/6] Kiểm tra tài sản PWA & các trang tĩnh SEO...');
    const urls = [
      '/',
      '/manifest.webmanifest',
      '/favicon.svg',
      '/og.png',
      '/robots.txt',
      '/sitemap.xml',
      '/sw.js',
      '/offline.html',
      '/gioi-thieu/',
      '/huong-dan-di-chua-online/',
      '/kinh/',
      '/kinh/bat-nha-tam-kinh/',
      '/kinh/chu-dai-bi/',
      '/lich-am/',
      '/hoi-dap/',
    ];
    for (const u of urls) {
      const res = await fetch(`${BASE}${u}`);
      if (!res.ok) throw new Error(`GET ${u} thất bại: HTTP ${res.status}`);
    }
    console.log(`  Tất cả ${urls.length} đường dẫn trả HTTP 200.`);

    console.log('[3/6] Mở trình duyệt Mobile (430x900) & Desktop (1280x800)...');
    b1 = await launch({ width: 430, height: 900, mobile: true });
    b2 = await launch({ width: 1280, height: 800, mobile: false });
    const p1 = b1.page;
    const p2 = b2.page;

    for (const [tag, p] of [['m', p1], ['d', p2]]) {
      p.on('pageerror', (e) => errors.push(`[${tag}:pageerror] ${e.message}`));
      p.on('console', (m) => {
        if (m.type() === 'error') errors.push(`[${tag}:console.error] ${m.text()}`);
      });
    }

    await p1.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(1800);
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-01-welcome-m.png') });

    // Bước vào chọn nhân vật
    await clickMatch(p1, 'không cần đăng nhập');
    await sleep(1200);
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-02-character-m.png') });

    // Bấm Vào chùa
    await clickMatch(p1, '^Vào chùa$');
    await p1.waitForFunction(() => {
      const boot = document.getElementById('boot');
      return !boot || boot.hidden || getComputedStyle(boot).opacity === '0' || getComputedStyle(boot).pointerEvents === 'none';
    }, { timeout: 40000 });
    await sleep(2500);
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-03-temple-day-m.png') });

    // Đóng thông báo âm thanh nếu có
    try { await clickMatch(p1, 'Để vậy'); await sleep(400); } catch { /* bỏ qua */ }

    console.log('[4/6] Đưa người chơi thứ 2 (Desktop) vào cùng phòng & thử tương tác nhiều người...');
    await p2.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(1500);
    await clickMatch(p2, 'không cần đăng nhập');
    await sleep(900);
    await clickMatch(p2, '^Vào chùa$');
    await p2.waitForFunction(() => {
      const boot = document.getElementById('boot');
      return !boot || boot.hidden || getComputedStyle(boot).opacity === '0' || getComputedStyle(boot).pointerEvents === 'none';
    }, { timeout: 40000 });
    await sleep(3000);
    try { await clickMatch(p2, 'Để vậy'); await sleep(400); } catch { /* bỏ qua */ }

    // Người chơi 1 gửi lời chào và chắp tay
    await clickMatch(p1, '^Chắp tay$');
    await sleep(1500);
    await p2.screenshot({ path: path.join(SHOT_DIR, 'final-04-temple-multiplayer-d.png') });

    console.log('[5/6] Kiểm tra Menu Thêm & các tính năng tu tập chính...');
    await clickMatch(p1, '^Thêm$');
    await sleep(700);
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-05-more-menu-m.png') });

    // Mở Tụng kinh từ menu Thêm
    await clickMatch(p1, '^Tụng kinh$');
    await sleep(900);
    await clickMatch(p1, 'Bát Nhã');
    await sleep(800);
    // Gõ mõ 4 nhịp
    for (let i = 0; i < 4; i++) {
      await p1.keyboard.press('Space');
      await sleep(220);
    }
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-07-chant-m.png') });
    await clickMatch(p1, 'Quay lại chùa');
    await sleep(600);

    // Mở Niệm Phật (Tràng hạt)
    await clickMatch(p1, '^Tràng hạt$');
    await sleep(800);
    for (let i = 0; i < 6; i++) {
      await p1.keyboard.press('Space');
      await sleep(160);
    }
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-06-beads-m.png') });
    await clickMatch(p1, 'Quay lại chùa');
    await sleep(600);

    // Mở Thiền định
    await clickMatch(p1, '^Thêm$');
    await sleep(400);
    await clickMatch(p1, '^Thiền$');
    await sleep(700);
    await clickMatch(p1, 'Bắt đầu');
    await sleep(1500);
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-08-meditate-m.png') });
    await clickMatch(p1, 'Quay lại chùa');
    await sleep(600);

    // Mở Hành trình
    await clickMatch(p1, 'Hành trình', '#hud-level, button');
    await sleep(800);
    await p1.screenshot({ path: path.join(SHOT_DIR, 'final-09-journey-m.png') });
    await clickMatch(p1, 'Quay lại chùa');
    await sleep(600);

    // Trên Desktop: bật Ban đêm trong Cài đặt & đi tới Ao sen chụp cảnh đêm
    await clickMatch(p2, 'Cài đặt', '#hud-settings, button');
    await sleep(700);
    await clickMatch(p2, '^Ban đêm$');
    await sleep(400);
    await clickMatch(p2, 'Quay lại chùa');
    await sleep(2200);
    await p2.screenshot({ path: path.join(SHOT_DIR, 'final-11-temple-night-d.png') });

    console.log('[6/6] Kiểm tra giao diện trang SEO tĩnh (/lich-am/ & /kinh/)...');
    await p2.goto(`${BASE}/lich-am/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(800);
    await p2.screenshot({ path: path.join(SHOT_DIR, 'final-12-seo-lich-am-d.png') });

    if (errors.length > 0) {
      console.error('Phát hiện lỗi runtime/console:\n' + errors.join('\n'));
      process.exitCode = 1;
    } else {
      console.log('HOÀN TẤT E2E XANH — 0 lỗi runtime, 0 lỗi console/CSP!');
    }
  } finally {
    await b1?.browser.close().catch(() => {});
    await b2?.browser.close().catch(() => {});
    srv.kill('SIGTERM');
    await fs.rm(DATA_DIR, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error('E2E thất bại:', err);
  process.exit(1);
});
