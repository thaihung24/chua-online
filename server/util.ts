/** Tiện ích: giới hạn tốc độ (cửa sổ trượt), token bucket, lấy IP, băm. */
import crypto from 'node:crypto';
import type { IncomingMessage } from 'node:http';

/** Giới hạn `max` lần / `windowMs` theo khoá (vd IP). */
export class Limiter {
  private hits = new Map<string, number[]>();
  constructor(private max: number, private windowMs: number) {}
  /** Ghi một lần; trả `{ok:false, retryAfter}` nếu vượt. */
  hit(key: string, now = Date.now()): { ok: boolean; retryAfter: number } {
    const arr = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (arr.length >= this.max) {
      this.hits.set(key, arr);
      return { ok: false, retryAfter: Math.max(1, Math.ceil((arr[0] + this.windowMs - now) / 1000)) };
    }
    arr.push(now);
    this.hits.set(key, arr);
    return { ok: true, retryAfter: 0 };
  }
  /** Chỉ kiểm tra, không ghi. */
  blocked(key: string, now = Date.now()): { blocked: boolean; retryAfter: number } {
    const arr = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (arr.length >= this.max) return { blocked: true, retryAfter: Math.max(1, Math.ceil((arr[0] + this.windowMs - now) / 1000)) };
    return { blocked: false, retryAfter: 0 };
  }
  reset(key: string): void { this.hits.delete(key); }
  sweep(now = Date.now()): void {
    for (const [k, arr] of this.hits) {
      const f = arr.filter((t) => now - t < this.windowMs);
      if (f.length) this.hits.set(k, f); else this.hits.delete(k);
    }
  }
}

/** Token bucket: `cap` mã, nạp `perSec` mã/giây. */
export class Bucket {
  private tokens: number;
  private last: number;
  constructor(private cap: number, private perSec: number, now = Date.now()) { this.tokens = cap; this.last = now; }
  take(n = 1, now = Date.now()): boolean {
    this.tokens = Math.min(this.cap, this.tokens + ((now - this.last) / 1000) * this.perSec);
    this.last = now;
    if (this.tokens >= n) { this.tokens -= n; return true; }
    return false;
  }
}

/** IP khách: tin X-Forwarded-For chỉ khi cấu hình `trustHops` > 0 (lấy phần tử thứ hops từ cuối). */
export function clientIp(req: IncomingMessage, trustHops: number): string {
  if (trustHops > 0) {
    const xff = req.headers['x-forwarded-for'];
    const s = Array.isArray(xff) ? xff.join(',') : xff;
    if (s) {
      const parts = s.split(',').map((p) => p.trim()).filter(Boolean);
      const v = parts[Math.max(0, parts.length - trustHops)];
      if (v) return v;
    }
  }
  return (req.socket.remoteAddress ?? 'unknown').replace(/^::ffff:/, '');
}

export const sha256 = (s: string): string => crypto.createHash('sha256').update(s).digest('hex');
export const randomHex = (bytes: number): string => crypto.randomBytes(bytes).toString('hex');

/** Chuỗi ngẫu nhiên từ bảng ký tự (không dùng ký tự dễ nhầm). */
export function randomCode(len: number, alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'): string {
  const buf = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[buf[i] % alphabet.length];
  return out;
}

export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Đọc cookie `name` từ header Cookie. */
export function getCookie(header: string | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch { return null; }
    }
  }
  return null;
}
