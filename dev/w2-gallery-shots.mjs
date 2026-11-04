// Chụp nhanh bộ ảnh nhân vật & phụ kiện trong 1 phiên Chrome duy nhất
import { launch } from '../scripts/chrome.mjs';

const shots = [
  { q: 'mode=gallery&t=1.5', out: 'dev/shots/w2-gallery.png', w: 980, h: 580 },
  { q: 'mode=gallery&accessories=1&cz=6.6&cy=1.75&t=1.5', out: 'dev/shots/w2-accessories.png', w: 1040, h: 600 },
  { q: 'mode=gallery&tod=night&t=1.5', out: 'dev/shots/w2-gallery-night.png', w: 980, h: 580 },
  { q: 'mode=gallery&solo=1&gender=female&outfit=ba-ba&anim=sweep&ry=2.7&cz=2.9&cy=1.15&ly=0.55&t=1.2', out: 'dev/shots/w2-sweep.png', w: 520, h: 620 },
  { q: 'mode=gallery&solo=1&gender=male&outfit=trang-lam&anim=pray&acc=hat-tram&level=15&ry=3.1416&cz=2.7&cy=1.0&ly=0.6&t=1.5', out: 'dev/shots/w2-pray.png', w: 520, h: 620 },
  { q: 'mode=gallery&solo=1&gender=male&outfit=trang-lam&anim=meditate&level=30&ry=2.65&cz=2.7&cy=1.0&ly=0.48&t=1.5', out: 'dev/shots/w2-sit.png', w: 520, h: 620 },
];

const { browser, page, sleep } = await launch({ width: 980, height: 580, mobile: false });
try {
  for (const s of shots) {
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await page.goto(`http://localhost:5202/dev/w2.html?${s.q}`, { waitUntil: 'load' });
    await page.waitForFunction('window.__ready === true', { timeout: 60000 });
    await sleep(250);
    await page.screenshot({ path: s.out });
    console.log('saved', s.out);
  }
} finally {
  await browser.close();
}
