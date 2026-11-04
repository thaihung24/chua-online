// Chụp ảnh harness W1 bằng Chrome thật. Dùng: node dev/w1-shot.mjs "tên:cam:time[:extra]" ...   (time = day|sunset|night|auto)
import { launch } from '../scripts/chrome.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const PORT = process.env.W1_PORT || 5201;
const specs = process.argv.slice(2);
if (!specs.length) specs.push('gate-day:gate:day');
fs.mkdirSync(new URL('./shots/', import.meta.url), { recursive: true });
const W = Number(process.env.W || 1100), H = Number(process.env.H || 650);
const { browser, page, sleep } = await launch({ width: W, height: H, mobile: false });
const clean = process.env.CLEAN === '0' ? '' : '&clean=1';
const url = `http://localhost:${PORT}/dev/w1.html?q=${process.env.Q || 'high'}${clean}`;
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.__w1 && document.getElementById('status').textContent === '', { timeout: 180000 });
// dừng vòng lặp tự động để điều khiển thủ công
await page.evaluate(() => window.__w1.renderer.setAnimationLoop(null));
for (const spec of specs) {
  const [name, cam, time, ...rest] = spec.split(':');
  const rawExtra = rest.join(':');
  let extra = rawExtra;
  if (rawExtra) { try { extra = decodeURIComponent(rawExtra); } catch { extra = rawExtra; } }
  await page.evaluate(([cam, time, extra]) => {
    const w = window.__w1;
    w.setCam(cam);
    if (time === 'sunset') {
      w.env.setTimeOfDay('day');
      for (let i = 0; i < 32; i++) w.frame(0.1);
      w.env.setTimeOfDay('night');
      // tiến từ 15.2h sang ~17.8h (hoàng hôn cam vàng rực rỡ)
      for (let i = 0; i < 31; i++) w.frame(0.01);
    } else if (time) {
      w.env.setTimeOfDay(time);
      for (let i = 0; i < 34; i++) w.frame(0.1);
    } else {
      for (let i = 0; i < 12; i++) w.frame(0.1);
    }
    if (extra) { try { new Function('w', 'env', extra)(w, w.env); } catch (e) { console.error(e); } }
    const stepDt = time === 'sunset' ? 0.002 : 0.08;
    for (let i = 0; i < 8; i++) w.frame(stepDt);
  }, [cam, time, extra]);
  await sleep(180);
  const stats = await page.evaluate(() => ({ calls: window.__w1.calls(), tris: window.__w1.tris(), night: Number(window.__w1.env.getNight().toFixed(2)), leaves: window.__w1.env.leavesRemaining() }));
  const out = fileURLToPath(new URL(`./shots/w1-${name}.png`, import.meta.url));
  await page.screenshot({ path: out });
  console.log(name, JSON.stringify(stats), out);
}
await browser.close();
