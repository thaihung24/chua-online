// Ghép nhiều ảnh thành một: node dev/w2-montage.mjs out.png in1.png in2.png ...
import { readFileSync } from 'node:fs';
import { launch } from '../scripts/chrome.mjs';
const [out, ...ins] = process.argv.slice(2);
const imgs = ins.map((f) => `<img src="data:image/png;base64,${readFileSync(f).toString('base64')}" style="height:520px;margin:2px">`).join('');
const { browser, page } = await launch({ width: 1800, height: 560, mobile: false });
await page.setContent(`<body style="margin:0;background:#222;display:flex;flex-wrap:nowrap">${imgs}</body>`);
await page.screenshot({ path: out });
await browser.close();
console.log('ok', out);
