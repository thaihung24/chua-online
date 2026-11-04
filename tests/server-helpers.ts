/** Tiện ích cho test máy chủ: dựng server thật cổng ngẫu nhiên, client HTTP có cookie, client WS. */
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import WebSocket from 'ws';
import { startServer, type RunningServer } from '../server/app';
import type { ServerOptions } from '../server/config';

export async function tmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'chua-test-'));
}

export async function startTest(over: Partial<ServerOptions> = {}): Promise<RunningServer & { dir: string }> {
  const dir = over.dataDir ?? (await tmpDir());
  const s = await startServer({ port: 0, host: '127.0.0.1', dataDir: dir, distDir: path.join(dir, 'no-dist'), rankTtlMs: 0, botCount: 0, ...over });
  return Object.assign(s, { dir });
}

export const PROFILE = { name: 'Tuệ An', gender: 'female', outfit: 'ao-dai', colorIndex: 1 } as const;
export const profileNamed = (name: string) => ({ ...PROFILE, name });

/** Client HTTP giữ cookie. */
export class Http {
  cookie = '';
  constructor(public base: string, public ipHeader?: string) {}
  async req(method: string, url: string, body?: unknown, headers: Record<string, string> = {}): Promise<{ status: number; json: any; headers: Headers; text: string }> {
    const h: Record<string, string> = { ...headers };
    if (this.cookie) h.cookie = this.cookie;
    if (body !== undefined) h['content-type'] ??= 'application/json';
    const res = await fetch(this.base + url, { method, headers: h, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) });
    const set = res.headers.get('set-cookie');
    if (set) {
      const kv = set.split(';')[0];
      this.cookie = /=\s*$/.test(kv) ? '' : kv;
    }
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { /* không phải JSON */ }
    return { status: res.status, json, headers: res.headers, text };
  }
  get = (url: string, headers?: Record<string, string>) => this.req('GET', url, undefined, headers);
  post = (url: string, body: unknown = {}, headers?: Record<string, string>) => this.req('POST', url, body, headers);
  put = (url: string, body: unknown = {}) => this.req('PUT', url, body);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Client WS với hàng đợi thông điệp và `waitFor`. */
export class Client {
  ws: WebSocket;
  msgs: any[] = [];
  closed: { code: number } | null = null;
  private waiters: { pred: (m: any) => boolean; res: (m: any) => void }[] = [];
  id = '';
  constructor(url: string, cookie = '') {
    this.ws = new WebSocket(url.replace(/^http/, 'ws') + '/ws', { headers: cookie ? { cookie } : {} });
    this.ws.on('message', (d) => {
      const m = JSON.parse(d.toString());
      this.msgs.push(m);
      for (const w of [...this.waiters]) if (w.pred(m)) { this.waiters.splice(this.waiters.indexOf(w), 1); w.res(m); }
    });
    this.ws.on('close', (code) => { this.closed = { code }; });
    this.ws.on('error', () => { /* bỏ qua */ });
  }
  open(): Promise<void> {
    if (this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
    return new Promise((res, rej) => { this.ws.once('open', () => res()); this.ws.once('error', rej); this.ws.once('unexpected-response', (_q, r) => rej(new Error('HTTP ' + r.statusCode))); });
  }
  send(o: unknown): void { this.ws.send(typeof o === 'string' ? o : JSON.stringify(o)); }
  waitFor<T = any>(pred: (m: any) => boolean, ms = 2000): Promise<T> {
    const found = this.msgs.find(pred);
    if (found) return Promise.resolve(found);
    return new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error('timeout waiting message; got ' + JSON.stringify(this.msgs.slice(-5)))), ms);
      this.waiters.push({ pred, res: (m) => { clearTimeout(t); res(m); } });
    });
  }
  /** Chờ thông điệp MỚI (bỏ qua cái đã nhận). */
  next<T = any>(pred: (m: any) => boolean, ms = 2000): Promise<T> {
    this.msgs.length = 0;
    return this.waitFor(pred, ms);
  }
  async hello(profile: object = PROFILE, level = 3, room?: string): Promise<{ id: string; room: any }> {
    await this.open();
    this.send({ t: 'hello', profile, level, ...(room ? { room } : {}) });
    const w = await this.waitFor((m) => m.t === 'welcome');
    this.id = w.id;
    return w;
  }
  waitClose(ms = 3000): Promise<number> {
    if (this.closed) return Promise.resolve(this.closed.code);
    return new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error('not closed')), ms);
      this.ws.once('close', (code) => { clearTimeout(t); res(code); });
    });
  }
  close(): void { try { this.ws.close(); } catch { /* bỏ qua */ } }
}
