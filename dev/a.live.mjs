// Kiểm tra đường chạy thật (AudioContext thật trong Chrome headless): unlock, âm hiệu ứng, nền, radio, công tắc, tạm dừng khi tab ẩn.
import { launch } from '../scripts/chrome.mjs';

const { browser, page, sleep } = await launch({ mobile: false, width: 900, height: 700 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const lvl = () => page.evaluate(() => window.__tap.level());
/** Đo mức tối đa trong khoảng ms (lấy mẫu mỗi 40 ms). */
async function measure(ms) {
  let peak = 0, rmsMax = 0, last = null;
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const l = await lvl();
    if (l) { peak = Math.max(peak, l.peak); rmsMax = Math.max(rmsMax, l.rms); last = l; }
    await sleep(40);
  }
  return { peak: +peak.toFixed(4), rms: +rmsMax.toFixed(4), state: last?.state };
}
const db = (x) => (x > 1e-6 ? (20 * Math.log10(x)).toFixed(1) : '-inf');
const show = (name, m) => console.log(name.padEnd(34), 'peak', db(m.peak).padStart(6), 'dB  rms', db(m.rms).padStart(6), 'dB  state', m.state);
try {
  await page.goto('http://localhost:5207/dev/a.html?tap=1', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__a, { timeout: 30000 });
  const A = (fn, ...args) => page.evaluate((f, a) => { const au = window.__a.audio; return au[f](...a); }, fn, args);
  console.log('mặc định:', JSON.stringify(await A('settings')));
  console.log('trước unlock tap =', await lvl());
  await page.evaluate(() => window.__a.loop.start(80)); // đặt trước unlock → phải tự chạy sau khi unlock
  await A('unlock'); await A('unlock'); // gọi nhiều lần an toàn
  await sleep(300);
  show('mõ loop (hoãn trước unlock) 2.5s', await measure(2500));
  await A('play', 'bellBig');
  show('bellBig + mõ', await measure(1500));
  await A('configure', { sfx: false });
  await sleep(600);
  show('sfx tắt (mõ phải im)', await measure(1500));
  await A('play', 'bell');
  show('sfx tắt, play bell', await measure(800));
  await A('configure', { sfx: true });
  await sleep(300);
  show('sfx bật lại (mõ loop trở lại)', await measure(1800));
  await A('setAmbient', true);
  await sleep(500);
  show('mõ + nền', await measure(2000));
  await page.evaluate(() => window.__a.loop.stop());
  await sleep(1500);
  show('nền (ngày) không mõ', await measure(2500));
  await A('setNight', 1);
  show('nền (đêm)', await measure(2500));
  await A('configure', { ambient: false });
  await sleep(2500);
  show('ambient tắt (phải im)', await measure(1500));
  await A('configure', { ambient: true, ambientVolume: 0.2 });
  await sleep(1500);
  show('nền vol 0.2', await measure(1500));
  await A('configure', { ambientVolume: 0.6 });
  await A('setChantRadio', true, 'nam-tram');
  await sleep(2500);
  show('radio nam-tram', await measure(3000));
  await A('setChantRadio', true, 'hop-xuong');
  await sleep(2500);
  show('radio hop-xuong', await measure(3000));
  await A('configure', { master: false });
  await sleep(800);
  show('master tắt (phải im)', await measure(1200));
  await A('configure', { master: true });
  await sleep(800);
  show('master bật lại', await measure(1500));
  await A('setChantRadio', false);
  await A('setAmbient', false);
  await sleep(3000);
  show('tắt hết (phải im)', await measure(1200));
  // tab ẩn → suspend; hiện lại → resume
  await A('setAmbient', true);
  await sleep(1000);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await sleep(600);
  console.log('tab ẩn → state =', (await lvl()).state);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  await sleep(800);
  console.log('tab hiện → state =', (await lvl()).state);
  show('sau khi hiện lại (nền)', await measure(1500));
  await A('setAmbient', false);
  console.log('cài đặt cuối:', JSON.stringify(await A('settings')));
  console.log('localStorage audio =', await page.evaluate(() => localStorage.getItem('lienhoa:audio')));
  console.log('lỗi trang:', errors.length ? errors : 'không');
} finally {
  await browser.close();
}
