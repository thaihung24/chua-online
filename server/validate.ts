/** Kiểm tra dữ liệu vào: hồ sơ, tên, email, màu, câu chào. Dùng mô-đun của C1/C2 khi có. */
import { OUTFIT_COLORS, TIERS, type Profile, type OutfitId, type TierDef } from '../src/core/contracts';
import { PHRASES } from '../src/content/phrases';
import { BOUNDS, SPAWN } from '../src/world/layout';

export { BOUNDS, SPAWN };

const phraseIds = new Set(PHRASES.map((p) => p.id));
export const isPhrase = (id: unknown): id is string => typeof id === 'string' && phraseIds.has(id);

export const ANIMS = ['idle', 'walk', 'pray', 'bow', 'sweep', 'sit', 'chant', 'meditate', 'beads', 'doze'] as const;
export type Anim = (typeof ANIMS)[number];
export const isAnim = (a: unknown): a is Anim => typeof a === 'string' && (ANIMS as readonly string[]).includes(a);

export const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

/** Bộ lọc tên dự phòng (khi chưa có src/core/profile.ts của C1). */
function fallbackValidateName(n: string): string | null {
  const s = n.trim();
  if (s.length < 2 || s.length > 24) return 'Pháp danh cần từ 2 đến 24 ký tự.';
  if (!/^[\p{L}\s\-]+$/u.test(s)) return 'Pháp danh chỉ gồm chữ cái, khoảng trắng và dấu gạch.';
  return null;
}

let validateNameImpl: (n: string) => string | null = fallbackValidateName;
/** Nạp `validateName` của C1 nếu file đã xuất hiện (thất bại → dùng bản dự phòng). */
export async function initValidators(): Promise<void> {
  try {
    const modPath = '../src/core/profile';
    const mod = (await import(/* @vite-ignore */ modPath)) as { validateName?: (n: string) => string | null };
    if (typeof mod.validateName === 'function') {
      const fn = mod.validateName;
      validateNameImpl = (n) => {
        const own = fallbackValidateName(n);
        return own ?? fn(n);
      };
    }
  } catch { /* chưa có hoặc không nạp được → giữ bản dự phòng */ }
}
export const validateName = (n: string): string | null => validateNameImpl(n);

export const DEFAULT_NAME = 'Phật tử';
export function defaultProfile(): Profile {
  return { name: DEFAULT_NAME, gender: 'male', outfit: 'trang-xam', colorIndex: 0 };
}

/** Chuẩn hoá hồ sơ thô; trả null nếu sai cấu trúc. Tên không hợp lệ → trả lỗi qua `nameError`. */
export function parseProfile(raw: unknown): { profile: Profile; nameError: string | null } | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.name !== 'string') return null;
  if (r.gender !== 'male' && r.gender !== 'female') return null;
  if (typeof r.outfit !== 'string' || !Object.prototype.hasOwnProperty.call(OUTFIT_COLORS, r.outfit)) return null;
  const outfit = r.outfit as OutfitId;
  const ci = r.colorIndex;
  if (typeof ci !== 'number' || !Number.isInteger(ci) || ci < 0 || ci >= OUTFIT_COLORS[outfit].length) return null;
  const name = r.name.normalize('NFC').replace(/\s+/g, ' ').trim();
  const profile: Profile = { name, gender: r.gender, outfit, colorIndex: ci };
  if (typeof r.accessory === 'string' && /^[a-z0-9_-]{1,32}$/i.test(r.accessory)) profile.accessory = r.accessory;
  return { profile, nameError: validateName(name) };
}

/** Hồ sơ an toàn để hiển thị cho người khác: tên xấu → tên mặc định. */
export function safeProfile(raw: unknown): Profile {
  const p = parseProfile(raw);
  if (!p) return defaultProfile();
  if (p.nameError) p.profile.name = DEFAULT_NAME;
  return p.profile;
}

export function clampLevel(v: unknown): number {
  const n = typeof v === 'number' ? Math.floor(v) : NaN;
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(999, n));
}

/** Cấp mới có hợp lý so với cấp cũ không (tăng quá nhanh → bỏ qua). */
export function plausibleLevel(prev: number | undefined, prevAt: number | undefined, next: number, now: number): boolean {
  if (next > 999 || next < 1) return false;
  if (prev === undefined || prevAt === undefined) return true;
  if (next <= prev) return true;
  const hours = Math.max(0, (now - prevAt) / 3_600_000);
  return next - prev <= 5 + Math.floor(hours);
}

export function tierOf(level: number): TierDef {
  let t = TIERS[0];
  for (const x of TIERS) if (level >= x.minLevel) t = x;
  return t;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function validEmail(e: unknown): e is string {
  return typeof e === 'string' && e.length <= 254 && e.length >= 5 && EMAIL_RE.test(e);
}

/** state tiến độ: đối tượng JSON thuần, không lồng quá sâu, ≤ maxBytes. */
export function validState(state: unknown, maxBytes = 16 * 1024): boolean {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return false;
  const depthOk = (v: unknown, d: number): boolean => {
    if (d > 8) return false;
    if (v === null) return true;
    if (typeof v === 'number') return Number.isFinite(v);
    if (typeof v === 'string' || typeof v === 'boolean') return true;
    if (Array.isArray(v)) return v.length <= 2000 && v.every((x) => depthOk(x, d + 1));
    if (typeof v === 'object') {
      const keys = Object.keys(v as object);
      return keys.length <= 500 && keys.every((k) => k !== '__proto__' && depthOk((v as Record<string, unknown>)[k], d + 1));
    }
    return false;
  };
  if (!depthOk(state, 0)) return false;
  return Buffer.byteLength(JSON.stringify(state)) <= maxBytes;
}
