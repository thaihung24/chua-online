// Chụp ảnh harness W2: node dev/w2-shot.mjs "<query>" <out.png> [width] [height] [jsToEval...]
import { launch } from '../scripts/chrome.mjs';
const [query, out, w = '900', h = '600', ...evals] = process.argv.slice(2);
const { browser, page, sleep } = await launch({ width: +w, height: +h, mobile: false });
try {
  await page.goto(`http://localhost:5202/dev/w2.html?${query}`, { waitUntil: 'load' });
  await page.waitForFunction('window.__ready === true', { timeout: 120000 });
  for (const e of evals) { await page.evaluate(e); await sleep(300); }
  await sleep(300);
  await page.screenshot({ path: out });
  console.log('ok', out);
} finally { await browser.close(); }
