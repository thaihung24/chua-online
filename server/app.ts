/** Lắp ráp máy chủ: Express + WebSocket hub + lưu trữ; khởi động/tắt êm. */
import http from 'node:http';
import express from 'express';
import { loadOptions, type ServerOptions } from './config';
import { Db } from './db';
import { Hub } from './hub';
import { registerApi, resolveSessionEmail, updateLeader } from './api';
import { securityHeaders, serveDist } from './static';
import { initValidators } from './validate';
import { sha256 } from './util';

export interface RunningServer {
  port: number;
  url: string;
  opts: ServerOptions;
  hub: Hub;
  db: Db;
  server: http.Server;
  close(): Promise<void>;
}

export async function startServer(over: Partial<ServerOptions> = {}): Promise<RunningServer> {
  const opts = loadOptions(over);
  await initValidators();
  const db = new Db(opts.dataDir, opts.persist);
  await db.load();
  const bannedIps = new Set(db.data.bans.map((b) => b.ipHash));
  const startedAt = Date.now();

  const hub = new Hub(opts, {
    resolveSession: (token) => resolveSessionEmail(db, token),
    isBannedIp: (ip) => bannedIps.has(sha256(ip)),
    onUserStats: (s) => updateLeader(db, s.email, s.name, s.level, s.streak),
  });

  const app = express();
  app.disable('x-powered-by');
  app.disable('etag');
  app.use(securityHeaders(opts.cookieSecure));
  const api = registerApi(app, { opts, db, hub, bannedIps, startedAt });
  serveDist(app, opts.distDir);
  app.use((_req, res) => { res.status(404).type('text/plain; charset=utf-8').send('Không tìm thấy'); });
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[http]', err);
    if (!res.headersSent) res.status(500).type('text/plain; charset=utf-8').send('Máy chủ gặp trục trặc');
  });

  const server = http.createServer(app);
  server.requestTimeout = 30_000;
  server.headersTimeout = 15_000;
  server.keepAliveTimeout = 10_000;
  hub.attach(server);

  const sweepTimer = setInterval(() => api.sweep(), 10 * 60_000);
  sweepTimer.unref?.();
  api.sweep();

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(opts.port, opts.host, () => { server.off('error', reject); resolve(); });
  });
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : opts.port;

  let closing: Promise<void> | null = null;
  const close = (): Promise<void> => (closing ??= (async () => {
    clearInterval(sweepTimer);
    await hub.close();
    await new Promise<void>((res) => { server.close(() => res()); server.closeIdleConnections?.(); setTimeout(() => { server.closeAllConnections?.(); res(); }, 1500).unref?.(); });
    await db.close();
  })());

  return { port, url: `http://127.0.0.1:${port}`, opts, hub, db, server, close };
}
