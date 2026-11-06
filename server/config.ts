/** Cấu hình máy chủ: đọc biến môi trường, đặt mặc định hợp lý. Tests có thể ghi đè qua `createApp(opts)`. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export interface GoogleIdentity {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface ServerOptions {
  port: number;
  host: string;
  dataDir: string;
  distDir: string;
  /** Số tầng proxy tin cậy (đọc X-Forwarded-For). 0 = không tin. */
  trustProxy: number;
  adminToken: string;
  corsOrigin: string;
  /** OAuth 2.0 Client ID của Google (Web application). */
  googleClientId: string;
  /** Hook xác thực token Google (dùng mặc định gọi Google API; cho phép mock trong test). */
  verifyGoogleToken?: (payload: { idToken?: string; accessToken?: string }, clientId: string) => Promise<GoogleIdentity | null>;
  /** Cookie `Secure` (đặt khi chạy sau HTTPS). */
  cookieSecure: boolean;
  /** Thời gian cache bảng xếp hạng (ms). */
  rankTtlMs: number;
  /** Phòng riêng tự xoá sau khi trống (ms). */
  privateRoomTtlMs: number;
  roomCapacity: number;
  maxPrivateRooms: number;
  /** Số Phật tử ảo (bot) sinh hoạt trong sân chùa chung (mặc định 20). */
  botCount: number;
  wsMaxPerIp: number;
  /** Giới hạn tốc độ (đặt nhỏ trong test). */
  limits: {
    apiPerMin: number;
    authFailMax: number;
    registerPerHour: number;
    feedbackPerHour: number;
    roomsPerHour: number;
  };
  sayCooldownMs: number;
  chatCooldownMs: number;
  lanternCooldownMs: number;
  /** Tắt ghi đĩa (test nhanh). */
  persist: boolean;
  version: string;
}

function readVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as { version?: string };
    return pkg.version ?? '1.0.0';
  } catch {
    return '1.0.0';
  }
}

function num(v: string | undefined, d: number): number {
  const n = Number(v);
  return v !== undefined && v !== '' && Number.isFinite(n) ? n : d;
}

export function loadOptions(over: Partial<ServerOptions> = {}): ServerOptions {
  const env = process.env;
  const base: ServerOptions = {
    port: num(env.PORT ?? env.API_PORT, 8787),
    host: env.HOST ?? '0.0.0.0',
    dataDir: env.DATA_DIR ? path.resolve(env.DATA_DIR) : path.join(ROOT, 'data'),
    distDir: env.DIST_DIR ? path.resolve(env.DIST_DIR) : path.join(ROOT, 'dist'),
    trustProxy: num(env.TRUST_PROXY, 0),
    adminToken: env.ADMIN_TOKEN ?? '',
    corsOrigin: env.CORS_ORIGIN ?? '',
    googleClientId: (env.GOOGLE_CLIENT_ID ?? env.VITE_GOOGLE_CLIENT_ID ?? '').trim(),
    cookieSecure: env.COOKIE_SECURE === '1' || env.COOKIE_SECURE === 'true',
    rankTtlMs: 60_000,
    privateRoomTtlMs: 10 * 60_000,
    roomCapacity: 10_000,
    maxPrivateRooms: 0,
    botCount: Math.max(0, Math.min(80, num(env.BOT_COUNT, 20))),
    wsMaxPerIp: num(env.WS_MAX_PER_IP, 20),
    limits: { apiPerMin: 300, authFailMax: 8, registerPerHour: 10, feedbackPerHour: 5, roomsPerHour: 10 },
    sayCooldownMs: num(env.SAY_COOLDOWN_MS, 20_000),
    chatCooldownMs: num(env.CHAT_COOLDOWN_MS, 20_000),
    lanternCooldownMs: 10_000,
    persist: true,
    version: readVersion(),
  };
  return { ...base, ...over, limits: { ...base.limits, ...(over.limits ?? {}) } };
}
