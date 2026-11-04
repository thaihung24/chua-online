// Mở harness trong Chrome headless, xuất WAV cho từng âm vào dev/audio-out/. Dùng: node dev/a.render.mjs [lọc-tên…]
import { launch } from '../scripts/chrome.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), 'audio-out');
mkdirSync(out, { recursive: true });
const filters = process.argv.slice(2);
const { browser, page } = await launch({ mobile: false, width: 900, height: 700 });
try {
  await page.goto('http://localhost:5207/dev/a.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__a, { timeout: 30000 });
  const names = await page.evaluate(() => window.__a.names());
  for (const n of names) {
    if (filters.length && !filters.some((f) => n.includes(f))) continue;
    const t0 = Date.now();
    const b64 = await page.evaluate((name) => window.__a.render(name), n);
    writeFileSync(join(out, n + '.wav'), Buffer.from(b64, 'base64'));
    console.log(n, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
} finally {
  await browser.close();
}
