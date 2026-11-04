/** Phục vụ tĩnh `dist/`: cache hợp lý, gzip thủ công, trang SEO theo slug, SPA fallback, header an toàn. */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import type { Express, Request, Response, NextFunction } from 'express';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.map': 'application/json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.flac': 'audio/flac', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.glb': 'model/gltf-binary',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.svg', '.txt', '.xml', '.map']);

export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' ws: wss:",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

export function securityHeaders(secure: boolean) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Content-Security-Policy', CSP);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    if (secure) res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
    res.removeHeader('X-Powered-By');
    next();
  };
}

interface Gz { mtime: number; buf: Buffer }

export function serveDist(app: Express, distDir: string): void {
  const gzCache = new Map<string, Gz>();
  let hasDist = false;
  let checkedAt = 0;
  const distExists = async (): Promise<boolean> => {
    const now = Date.now();
    if (now - checkedAt > 3000) {
      checkedAt = now;
      try { hasDist = (await fsp.stat(path.join(distDir, 'index.html'))).isFile(); } catch { hasDist = false; }
    }
    return hasDist;
  };

  async function statFile(p: string): Promise<fs.Stats | null> {
    try { const st = await fsp.stat(p); return st.isFile() ? st : null; } catch { return null; }
  }

  async function sendFile(req: Request, res: Response, file: string, st: fs.Stats, rel: string): Promise<void> {
    const ext = path.extname(file).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
    const isHtml = ext === '.html';
    const hashed = rel.startsWith('/assets/');
    if (isHtml || rel === '/sw.js') res.setHeader('Cache-Control', 'no-cache');
    else if (hashed) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    else res.setHeader('Cache-Control', 'public, max-age=3600');
    const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', st.mtime.toUTCString());
    res.setHeader('Vary', 'Accept-Encoding');
    if (req.headers['if-none-match'] === etag) { res.status(304).end(); return; }
    const wantGz = COMPRESSIBLE.has(ext) && st.size > 1024 && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''));
    if (wantGz) {
      let g = gzCache.get(file);
      if (!g || g.mtime !== st.mtimeMs) {
        const raw = await fsp.readFile(file);
        g = { mtime: st.mtimeMs, buf: zlib.gzipSync(raw, { level: 9 }) };
        if (gzCache.size > 200) gzCache.clear();
        gzCache.set(file, g);
      }
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Length', String(g.buf.length));
      if (req.method === 'HEAD') { res.end(); return; }
      res.end(g.buf);
      return;
    }
    res.setHeader('Accept-Ranges', 'bytes');
    const rangeHdr = req.headers.range;
    if (!COMPRESSIBLE.has(ext) && typeof rangeHdr === 'string' && rangeHdr.startsWith('bytes=')) {
      const [sStr, eStr] = rangeHdr.slice(6).split('-');
      const start = sStr ? parseInt(sStr, 10) : 0;
      const end = eStr ? Math.min(st.size - 1, parseInt(eStr, 10)) : st.size - 1;
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= st.size) {
        res.setHeader('Content-Range', `bytes */${st.size}`);
        res.status(416).end();
        return;
      }
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${st.size}`);
      res.setHeader('Content-Length', String(end - start + 1));
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
      return;
    }
    res.setHeader('Content-Length', String(st.size));
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
  }

  app.use(async (req, res, next) => {
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path === '/ws' || req.path.startsWith('/api/')) return next();
      if (!(await distExists())) return next();
      let rel: string;
      try { rel = decodeURIComponent(req.path); } catch { res.status(400).end(); return; }
      if (rel.includes('\0')) { res.status(400).end(); return; }
      const abs = path.resolve(distDir, '.' + path.posix.normalize('/' + rel));
      if (abs !== distDir && !abs.startsWith(distDir + path.sep)) { res.status(403).end(); return; }
      const ext = path.extname(abs);
      // Tệp có phần mở rộng: phục vụ hoặc 404.
      if (ext) {
        const st = await statFile(abs);
        if (!st) { res.status(404).type('text/plain; charset=utf-8').send('Không tìm thấy'); return; }
        await sendFile(req, res, abs, st, '/' + path.relative(distDir, abs).split(path.sep).join('/'));
        return;
      }
      // Slug tĩnh (trang SEO): dist/<slug>/index.html
      const slugFile = path.join(abs, 'index.html');
      const sst = rel === '/' ? await statFile(path.join(distDir, 'index.html')) : await statFile(slugFile);
      if (sst) {
        await sendFile(req, res, rel === '/' ? path.join(distDir, 'index.html') : slugFile, sst, '/index.html');
        return;
      }
      // SPA fallback.
      const idx = path.join(distDir, 'index.html');
      const ist = await statFile(idx);
      if (ist) { await sendFile(req, res, idx, ist, '/index.html'); return; }
      next();
    } catch (e) {
      next(e);
    }
  });
}
