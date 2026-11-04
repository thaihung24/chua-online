// Chụp ảnh harness U1:
//   - Chụp trọn bộ U1 (mobile 430×900 + desktop 1280×800): `node dev/u1-shots.mjs`
//   - Chụp 1 ảnh lẻ: `node dev/u1-shots.mjs <tên> <query> [mobile|desktop] [action-js]`
import { launch } from '../scripts/chrome.mjs';
import fs from 'node:fs';

const BASE = 'http://localhost:5203/dev/u1.html';
fs.mkdirSync('dev/shots', { recursive: true });

const [, , singleName, singleQuery = '', singleKind = 'mobile', singleActions = ''] = process.argv;

if (singleName) {
  const desktop = singleKind === 'desktop';
  const { browser, page, sleep } = await launch(desktop ? { width: 1280, height: 800, mobile: false } : { width: 430, height: 900 });
  try {
    await page.goto(`${BASE}?${singleQuery}`, { waitUntil: 'networkidle0', timeout: 60000 });
    await sleep(900);
    if (singleActions) {
      await page.evaluate(`(async()=>{ ${singleActions} })()`);
      await sleep(700);
    }
    await page.screenshot({ path: `dev/shots/u1-${singleName}-${desktop ? 'd' : 'm'}.png` });
  } finally {
    await browser.close();
  }
  process.exit(0);
}

const SHOTS = [
  { name: 'hud', query: 'fresh=1&nearby=altar&notice=1&online=12' },
  { name: 'hud-snd', query: 'fresh=1&level=4&seated=1&notice=1&snd=1&listen=1&online=24' },
  { name: 'menu', query: 'fresh=1&menu=1' },
  { name: 'walk', query: 'fresh=1&menu=walk' },
  { name: 'gate', query: 'fresh=1&mode=gate' },
  { name: 'choose', query: 'fresh=1&mode=choose' },
  { name: 'journey-today', query: 'fresh=1&level=5&open=journey&params=' + encodeURIComponent('{"tab":"today"}') },
  { name: 'journey-path', query: 'fresh=1&level=5&open=journey&params=' + encodeURIComponent('{"tab":"path"}') },
  { name: 'journey-stamps', query: 'fresh=1&level=5&open=journey&params=' + encodeURIComponent('{"tab":"stamps"}') },
  { name: 'journey-book', query: 'fresh=1&level=5&open=journey&params=' + encodeURIComponent('{"tab":"book"}') },
  { name: 'rank', query: 'fresh=1&level=5&open=rank' },
  { name: 'settings', query: 'fresh=1&level=5&seedwishes=1&open=settings' },
  { name: 'settings-data', query: 'fresh=1&level=5&seedwishes=1&open=settings', action: "document.querySelector('.panel-host__body')?.scrollTo(0, 9999)" },
  { name: 'rooms', query: 'fresh=1&open=rooms' },
  { name: 'account', query: 'fresh=1&open=account' },
  { name: 'account-in', query: 'fresh=1&logged=1&open=account' },
  { name: 'feedback', query: 'fresh=1&open=feedback' },
  { name: 'share', query: 'fresh=1&level=16&open=share', wait: 1100 },
  { name: 'install', query: 'fresh=1&open=install' },
  { name: 'friends', query: 'fresh=1&logged=1&level=10&open=friends' },
  { name: 'sayings', query: 'fresh=1&open=sayings' },
];

for (const desktop of [false, true]) {
  const suffix = desktop ? 'd' : 'm';
  const { browser, page, sleep } = await launch(desktop ? { width: 1280, height: 800, mobile: false } : { width: 430, height: 900 });
  try {
    for (const s of SHOTS) {
      await page.goto(`${BASE}?${s.query}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await sleep(s.wait ?? 600);
      if (s.action) {
        await page.evaluate(`(async()=>{ ${s.action} })()`);
        await sleep(300);
      }
      const out = `dev/shots/u1-${s.name}-${suffix}.png`;
      await page.screenshot({ path: out });
      console.log('saved', out);
    }
    if (desktop) {
      await page.goto(`${BASE}?mode=icons&sec=tiers`, { waitUntil: 'networkidle0', timeout: 60000 });
      await sleep(300);
      await page.screenshot({ path: 'dev/shots/u1-tiers-d.png' });
      console.log('saved dev/shots/u1-tiers-d.png');
    }
  } finally {
    await browser.close();
  }
}
