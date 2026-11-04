// Chụp ảnh các panel U2 (mobile 430×900 + desktop). Chạy: node dev/u2-shots.mjs [tên-lọc]
import { launch } from '../scripts/chrome.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE = 'http://localhost:5204/dev/u2.html';
const OUT = fileURLToPath(new URL('./shots/', import.meta.url));
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[2];

const scenarios = [
  { name: 'beads', url: '?p=beads', steps: async (p, s) => { await tapN(p, '.beads-stage', 5); await s(500); } },
  { name: 'beads-27', url: '?p=beads', steps: async (p, s) => { await p.click('[data-len="27"]'); await tapN(p, '.beads-stage', 9); await s(600); } },
  { name: 'chant-list', url: '?p=chant' },
  { name: 'chant-read', url: '?p=chant&params=' + encodeURIComponent('{"id":"bat-nha-tam-kinh"}'), steps: async (p, s) => { await tapN(p, '.chant-mo', 14); await s(600); } },
  { name: 'meditate-setup', url: '?p=meditate' },
  { name: 'meditate-warn', url: '?p=meditate&sound=0' },
  { name: 'meditate-run', url: '?p=meditate', steps: async (p, s) => { await p.click('.med-start'); await s(5200); } },
  { name: 'meditate-done', url: '?p=meditate', speed: 160, steps: async (p, s) => { await p.click('.med-start'); await s(6500); } },
  { name: 'meditate-early', url: '?p=meditate', steps: async (p, s) => { await p.click('.med-start'); await s(1500); await p.click('.med-end'); await s(500); } },
  { name: 'chant-done', url: '?p=chant&params=' + encodeURIComponent('{"id":"ke-hoi-huong"}'), speed: 4, steps: async (p, s) => { await p.click('.chant-auto'); await s(9000); } },
  { name: 'chant-session-next', url: '?p=chant', speed: 4, steps: async (p, s) => { await p.click('.chant-session__go'); await p.evaluate(() => document.querySelector('.chant-speed .seg__btn:last-child')?.click()); await p.click('.chant-auto'); await s(11000); } },
  { name: 'dharma', url: '?p=dharma' },
  { name: 'today', url: '?p=today' },
  { name: 'today-flip', url: '?p=today', steps: async (p, s) => { await p.click('.today-flip'); await s(3000); await p.evaluate(() => document.querySelector('.today-flip').scrollIntoView({ block: 'center' })); await s(500); } },
  { name: 'today-cal', url: '?p=today', steps: async (p, s) => { await p.click('.today-calbtn'); await s(400); } },
  { name: 'wardrobe', url: '?p=wardrobe&level=4' },
  { name: 'lantern', url: '?p=lantern' },
  { name: 'que', url: '?p=que' },
  { name: 'que-card', url: '?p=que', steps: async (p, s) => { await p.click('.que-shake'); await s(4500); } },
  { name: 'wish', url: '?p=wish' },
  { name: 'listen', url: '?p=listen' },
  { name: 'walk-setup', url: '?p=walkMeditation' },
  { name: 'walk-run', url: '?p=walkMeditation', steps: async (p, s) => { await p.click('.med-start'); await s(5200); } },
];

async function tapN(page, sel, n) {
  for (let i = 0; i < n; i++) { await page.click(sel); await new Promise((r) => setTimeout(r, 120)); }
}

const sizes = [
  { tag: 'm', width: 430, height: 900, mobile: true },
  { tag: 'd', width: 1280, height: 820, mobile: false },
];
for (const sz of sizes) {
  const { browser, page, sleep } = await launch({ width: sz.width, height: sz.height, mobile: sz.mobile });
  await page.evaluateOnNewDocument(() => { const o = performance.now.bind(performance); const t0 = o(); const k = Number(new URLSearchParams(location.search).get('k') || 1); performance.now = () => t0 + (o() - t0) * k; });
  for (const sc of scenarios) {
    if (only && !new RegExp(only).test(sc.name)) continue;
    await page.goto(BASE + sc.url + (sc.speed ? `&k=${sc.speed}` : ''), { waitUntil: 'load' });
    try { await page.waitForSelector('body[data-ready]', { timeout: 15000 }); } catch { console.log('timeout', sc.name); }
    await sleep(700);
    if (sc.steps) { try { await sc.steps(page, sleep); } catch (e) { console.log('step fail', sc.name, e.message); } }
    await page.screenshot({ path: `${OUT}u2-${sc.name}-${sz.tag}.png` });
    console.log('shot', sc.name, sz.tag);
  }
  await browser.close();
}
