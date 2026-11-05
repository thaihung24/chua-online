/**
 * Hồ sơ nhân vật: mặc định, pháp danh ngẫu nhiên, kiểm tra tên (độ dài, ký tự, từ cấm, quảng cáo), lưu/đọc an toàn.
 * Danh sách từ cấm được CHE (viết ngược) để không nằm nguyên văn trong mã nguồn; so khớp sau khi bỏ dấu.
 */
import { OUTFITS, OUTFIT_COLORS } from './contracts';
import type { Gender, OutfitId, Profile } from './contracts';
import { load, save } from './store';

const PROFILE_KEY = 'profile';

export const NAME_MIN = 2;
export const NAME_MAX = 24;
export const CHAT_MAX = 100;
export const CHAT_COOLDOWN_MS = 20_000;

// ───────────────────────── Pháp danh ─────────────────────────
const MALE_FIRST = ['Minh', 'Tuệ', 'Nhật', 'Như', 'Thiện', 'Đức', 'Quảng', 'Chánh', 'Giác', 'Hạnh', 'Trí', 'Thanh', 'Pháp', 'Tâm', 'Huệ', 'Từ', 'Định', 'Nguyên', 'Bảo', 'Đạt'];
const MALE_SECOND = ['An', 'Nhẫn', 'Thông', 'Đạo', 'Giác', 'Tâm', 'Quang', 'Hòa', 'Minh', 'Hiếu', 'Phúc', 'Tuệ', 'Nghĩa', 'Trí', 'Định', 'Tín', 'Lạc', 'Hải', 'Thiện', 'Đăng'];
const FEMALE_FIRST = ['Diệu', 'Như', 'Tuệ', 'Thanh', 'Minh', 'Hạnh', 'Bích', 'Ngọc', 'Liên', 'Từ', 'Chân', 'Huệ', 'Tâm', 'Thiện', 'Hương', 'Mai', 'Kim', 'Phước', 'An', 'Nhã'];
const FEMALE_SECOND = ['Hạnh', 'An', 'Liên', 'Ý', 'Nguyệt', 'Hoa', 'Lạc', 'Tâm', 'Anh', 'Thanh', 'Hiền', 'Nhàn', 'Quang', 'Hương', 'Trang', 'Giác', 'Mỹ', 'Nhiên', 'Tịnh', 'Đức'];

function combine(first: string[], second: string[]): string[] {
  const out: string[] = [];
  for (const a of first) for (const b of second) if (a !== b) out.push(`${a} ${b}`);
  return out;
}
const POOL: Record<Gender, string[]> = {
  male: combine(MALE_FIRST, MALE_SECOND),
  female: combine(FEMALE_FIRST, FEMALE_SECOND),
};

/** Toàn bộ kho pháp danh của một giới (≥ 120 tên). */
export function nameChoices(gender: Gender): string[] {
  return [...POOL[gender]];
}

/** Pháp danh ngẫu nhiên, vd "Tuệ An", "Diệu Hạnh". `rng` trả số trong [0,1) (mặc định Math.random). */
export function randomName(gender: Gender, rng: () => number = Math.random): string {
  const pool = POOL[gender] ?? POOL.female;
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
}

// ───────────────────────── Kiểm tra tên ─────────────────────────
/** Chuẩn hoá tên: NFC, bỏ khoảng trắng đầu/cuối, gộp khoảng trắng liên tiếp. */
export function normalizeName(name: string): string {
  return name.normalize('NFC').replace(/\s+/g, ' ').trim();
}

/** Bỏ dấu tiếng Việt, chữ thường, gộp ký tự ngăn cách thành một khoảng trắng. */
function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[\s-]+/g, ' ')
    .trim();
}
const unmask = (list: string[]): string[] => list.map((w) => [...w].reverse().join(''));

/** Từ/cụm thô tục (đã che: viết ngược, không dấu). Từ ngắn hoặc cụm: khớp nguyên từ; từ dài một chữ: khớp chuỗi con. */
const BANNED_MASKED = ['tid', 'oed', 'nol', 'cac', 'tuc', 'ioub', 'md', 'mmd', 'mcd', 'lcv', 'lkv', 'mmc', 'tglc', 'mkd', 'lv', 'tav cus', 'nan nohk', 'ohc co', 'ohc noc', 'ohc gnaht', 'ohc od', 'ugn od', 'ugn gnaht', 'ugn noc', 'yam em', 'id noc', 'em tid', 'am ud', 'em ud'];
/** Từ/cụm quảng cáo, liên hệ (cũng che). */
const ADS_MASKED = ['ptth', 'sptth', 'www', 'olaz', 'koobecaf', 'margelet', 'kotkit', 'eepohs', 'adazal', 'onisac', 'iacahn', 'xobni', 'eniltoh', 'tds', 'bf', 'nab aum', 'yk gnad', 'iam neyuhk'];
const BANNED = unmask(BANNED_MASKED);
const ADS = unmask(ADS_MASKED);

function containsWord(folded: string, list: string[]): boolean {
  const compact = folded.replace(/ /g, '');
  const padded = ` ${folded} `;
  for (const w of list) {
    if (w.includes(' ') || w.length <= 3) {
      if (padded.includes(` ${w} `)) return true;
    } else if (compact.includes(w)) return true;
  }
  return false;
}

const LATIN_RE = /^[\p{Script=Latin}\p{M}]+(?:[ -][\p{Script=Latin}\p{M}]+)*$/u;

/** Trả thông báo lỗi tiếng Việt, hoặc null nếu tên hợp lệ. */
export function validateName(name: string): string | null {
  if (typeof name !== 'string') return 'Vui lòng nhập pháp danh.';
  const n = normalizeName(name);
  const len = [...n].length;
  if (len < NAME_MIN) return `Pháp danh cần ít nhất ${NAME_MIN} ký tự.`;
  if (len > NAME_MAX) return `Pháp danh dài tối đa ${NAME_MAX} ký tự.`;
  if (/\d/.test(n)) return 'Pháp danh không dùng chữ số.';
  if (!LATIN_RE.test(n)) return 'Pháp danh chỉ gồm chữ cái tiếng Việt, khoảng trắng và dấu gạch ngang.';
  const f = fold(n);
  if (!/^[a-z ]+$/.test(f)) return 'Pháp danh chỉ gồm chữ cái tiếng Việt, khoảng trắng và dấu gạch ngang.';
  if (containsWord(f, BANNED)) return 'Pháp danh có từ không phù hợp, xin chọn tên khác.';
  if (containsWord(f, ADS)) return 'Pháp danh không dùng để quảng cáo hay để lại liên hệ.';
  return null;
}

// ───────────────────────── Kiểm tra tin nhắn trò chuyện ─────────────────────────
/** Từ tục viết tắt/không dấu không trùng từ tiếng Việt thông dụng (viết ngược). */
const CHAT_BANNED_FOLDED_MASKED = [
  'tid', 'md', 'mmd', 'mcd', 'lcv', 'lkv', 'mmc', 'tglc', 'mkd', 'lv', 'cc',
  'tav cus', 'nan nohk', 'ohc co', 'ohc noc', 'ohc gnaht', 'ohc od',
  'ugn od', 'ugn gnaht', 'ugn noc', 'em tid', 'am ud', 'em ud',
  'nol iac', 'nol iav', 'cac noc', 'cac iav', 'ioub uad', 'em noc',
];
/** Từ tục có dấu tiếng Việt (viết ngược NFC để tránh trùng "các", "lớn", "buổi", "con đi", "đeo"). */
const CHAT_BANNED_EXACT_MASKED = [
  'n\u1ed3l', 'c\u1eb7c', 'i\u1ed3ub', 'o\u00e9\u0111', 't\u1ee9c', '\u0129\u0111', '\u1ee5\u0111', 't\u1ecb\u0111', 'y\u00e0m \u1eb9m', '\u00e1\u0111 \u1eb9m',
];
const CHAT_ADS_FOLDED_MASKED = [
  'ptth', 'sptth', 'www', 'olaz', 'margelet', 'onisac', 'iacahn', 'iac ahn',
  'tebuk', 'eniltoh', 'nab aum', 'iam neyuhk',
];
const CHAT_BANNED_FOLDED = unmask(CHAT_BANNED_FOLDED_MASKED);
const CHAT_BANNED_EXACT = unmask(CHAT_BANNED_EXACT_MASKED);
const CHAT_ADS_FOLDED = unmask(CHAT_ADS_FOLDED_MASKED);
const URL_RE = /(?:https?:\/\/|www\.|\b[a-z0-9-]{2,}\.(?:com|net|org|vn|io|me|app|xyz|info|biz|club|top|vip|bet)\b)/i;

/** Chuẩn hoá nội dung chat: NFC, bỏ ký tự điều khiển, gộp khoảng trắng. */
export function normalizeChatText(raw: string): string {
  return raw
    .normalize('NFC')
    .replace(/[\u0000-\u001F\u007F-\u009F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Kiểm tra tin nhắn trò chuyện tự do (1–100 ký tự, lọc thô tục & quảng cáo/liên kết). */
export function validateChatText(raw: unknown): { ok: true; text: string } | { ok: false; error: string } {
  if (typeof raw !== 'string') return { ok: false, error: 'Vui lòng nhập lời nhắn.' };
  const text = normalizeChatText(raw);
  const len = [...text].length;
  if (len < 1) return { ok: false, error: 'Vui lòng nhập lời nhắn.' };
  if (len > CHAT_MAX) return { ok: false, error: `Lời nhắn dài tối đa ${CHAT_MAX} ký tự.` };

  const lowerWords = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `;
  for (const w of CHAT_BANNED_EXACT) {
    if (lowerWords.includes(` ${w} `)) {
      return { ok: false, error: 'Lời nhắn có từ ngữ chưa phù hợp nơi cửa Phật.' };
    }
  }

  const foldedTokens = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  if (foldedTokens && containsWord(foldedTokens, CHAT_BANNED_FOLDED)) {
    return { ok: false, error: 'Lời nhắn có từ ngữ chưa phù hợp nơi cửa Phật.' };
  }
  if (URL_RE.test(text) || (foldedTokens && containsWord(foldedTokens, CHAT_ADS_FOLDED))) {
    return { ok: false, error: 'Xin không gửi liên kết hoặc quảng cáo trong sân chùa.' };
  }
  return { ok: true, text };
}

// ───────────────────────── Hồ sơ ─────────────────────────
export function defaultProfile(): Profile {
  return { name: 'Tuệ An', gender: 'female', outfit: 'ao-dai', colorIndex: 0 };
}

const ACCESSORY_RE = /^[a-z0-9][a-z0-9_-]{0,31}$/i;

/** Làm sạch hồ sơ từ nguồn ngoài (localStorage, mạng). Trả null nếu không hợp lệ. */
export function sanitizeProfile(raw: unknown): Profile | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.name !== 'string' || validateName(r.name) !== null) return null;
  if (r.gender !== 'male' && r.gender !== 'female') return null;
  const outfit = OUTFITS.find((o) => o.id === r.outfit)?.id as OutfitId | undefined;
  if (!outfit) return null;
  const colors = OUTFIT_COLORS[outfit];
  if (typeof r.colorIndex !== 'number' || !Number.isInteger(r.colorIndex) || r.colorIndex < 0 || r.colorIndex >= colors.length) return null;
  const p: Profile = { name: normalizeName(r.name), gender: r.gender, outfit, colorIndex: r.colorIndex };
  if (typeof r.accessory === 'string' && ACCESSORY_RE.test(r.accessory)) p.accessory = r.accessory;
  return p;
}

export function loadProfile(): Profile | null {
  return sanitizeProfile(load<unknown>(PROFILE_KEY, null));
}

/** Lưu hồ sơ (đã làm sạch). Trả false nếu hồ sơ không hợp lệ (không lưu gì). */
export function saveProfile(p: Profile): boolean {
  const clean = sanitizeProfile(p);
  if (!clean) return false;
  save(PROFILE_KEY, clean);
  return true;
}

export function hasProfile(): boolean {
  return loadProfile() !== null;
}
