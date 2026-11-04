/** Test phục vụ tĩnh dist/: cache, gzip, slug SEO, SPA fallback, header an toàn. */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import nodeHttp from 'node:http';
import { Http, startTest, tmpDir } from './server-helpers';

/** GET thô (không tự giải nén) để kiểm tra byte gzip thật. */
function http2get(url: string, ok: (b: Buffer) => void, bad: (e: Error) => void): void {
  nodeHttp.get(url, { headers: { 'accept-encoding': 'gzip' } }, (res) => {
    const chunks: Buffer[] = [];
    res.on('data', (c: Buffer) => chunks.push(c));
    res.on('end', () => ok(Buffer.concat(chunks)));
  }).on('error', bad);
}

let S: Awaited<ReturnType<typeof startTest>>;
let http: Http;
const big = '<html>' + 'x'.repeat(5000) + '</html>';
beforeAll(async () => {
  const dist = path.join(await tmpDir(), 'dist');
  await fs.mkdir(path.join(dist, 'assets'), { recursive: true });
  await fs.mkdir(path.join(dist, 'tung-kinh'), { recursive: true });
  await fs.writeFile(path.join(dist, 'index.html'), big);
  await fs.writeFile(path.join(dist, 'tung-kinh', 'index.html'), '<html>SEO tung kinh</html>');
  await fs.writeFile(path.join(dist, 'assets', 'app-abc123.js'), 'console.log("' + 'a'.repeat(3000) + '")');
  await fs.writeFile(path.join(dist, 'favicon.svg'), '<svg/>');
  await fs.writeFile(path.join(dist, 'sw.js'), '// sw');
  S = await startTest({ distDir: dist });
  http = new Http(S.url);
});
afterAll(async () => { await S.close(); });

describe('tĩnh', () => {
  it('trang chủ no-cache + header an toàn; SPA fallback cho đường không có phần mở rộng', async () => {
    for (const p of ['/', '/duong/khong/co', '/?room=p-abcdef']) {
      const r = await http.get(p, { 'accept-encoding': 'identity' });
      expect(r.status).toBe(200);
      expect(r.text).toBe(big);
      expect(r.headers.get('cache-control')).toBe('no-cache');
      expect(r.headers.get('content-type')).toContain('text/html');
      expect(r.headers.get('x-content-type-options')).toBe('nosniff');
      expect(r.headers.get('referrer-policy')).toBeTruthy();
      expect(r.headers.get('content-security-policy')).toMatch(/connect-src 'self' ws: wss:/);
    }
  });
  it('assets hashed: immutable 1 năm; gzip khi được yêu cầu', async () => {
    const r = await fetch(S.url + '/assets/app-abc123.js', { headers: { 'accept-encoding': 'gzip' } });
    expect(r.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(r.headers.get('content-encoding')).toBe('gzip');
    expect(r.headers.get('content-type')).toContain('javascript');
    expect(r.status).toBe(200);
    // fetch của Node tự giải nén gzip → thân đọc ra là bản gốc.
    expect(await r.text()).toContain('console.log');
    const gz = await new Promise<Buffer>((res, rej) => {
      http2get(S.url + '/assets/app-abc123.js', (b) => res(b), rej);
    });
    expect(gz.length).toBeLessThan(3000);
    expect(zlib.gunzipSync(gz).toString()).toContain('console.log');
    const etag = r.headers.get('etag')!;
    const r304 = await fetch(S.url + '/assets/app-abc123.js', { headers: { 'if-none-match': etag } });
    expect(r304.status).toBe(304);
  });
  it('slug SEO phục vụ trang riêng; tệp có đuôi không tồn tại → 404; file nhỏ không nén', async () => {
    expect((await http.get('/tung-kinh')).text).toContain('SEO tung kinh');
    expect((await http.get('/tung-kinh/')).text).toContain('SEO tung kinh');
    expect((await http.get('/thieu.js')).status).toBe(404);
    expect((await http.get('/assets/none.css')).status).toBe(404);
    const sw = await http.get('/sw.js');
    expect(sw.headers.get('cache-control')).toBe('no-cache');
    const svg = await fetch(S.url + '/favicon.svg', { headers: { 'accept-encoding': 'gzip' } });
    expect(svg.headers.get('content-encoding')).toBeNull();
  });
  it('chặn truy cập ngoài thư mục; /api không bị SPA nuốt', async () => {
    const r = await fetch(S.url + '/..%2f..%2fpackage.json');
    expect([400, 403, 404]).toContain(r.status);
    expect((await http.get('/api/khong-co')).json.ok).toBe(false);
  });
});
