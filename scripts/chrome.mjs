// Trợ giúp chụp ảnh/kiểm thử bằng Chrome thật (headless, WebGL phần mềm). Dùng: import { launch } from './chrome.mjs'
import puppeteer from 'puppeteer-core';
export const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export async function launch({ width = 430, height = 900, mobile = true } = {}) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console.error]', m.text().slice(0, 300)); });
  return { browser, page, sleep: (ms) => new Promise((r) => setTimeout(r, ms)) };
}
