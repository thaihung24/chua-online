/**
 * Dữ liệu tĩnh của hệ tiến độ: bảng tinh tấn (XP_TABLE), việc hôm nay (TASK_TEMPLATES),
 * dấu ấn hành hương (STAMPS), nhãn thống kê (LIFETIME_LABELS), mở khoá theo cấp (UNLOCK_INFO).
 * Chỉ có dữ liệu + hàm thuần; việc lưu trạng thái nằm ở progress.ts.
 */
import type { ActionId, ActivityKind, PanelId, SpotId, UnlockFeature } from './contracts';

// ───────────────────────── Bảng tinh tấn ─────────────────────────
/** 'practice' = tính vào trần công phu mỗi ngày; 'extra' = công phu thêm (trần riêng, ngoài trần chính); 'none' = không có xp. */
export type XpPool = 'practice' | 'extra' | 'none';

export interface XpRule {
  /** Tinh tấn cho mỗi đơn vị. */
  xp: number;
  /** Số đơn vị tối đa nhận xp mỗi ngày. */
  limit: number;
  pool: XpPool;
  /** Với các loại *Seconds: số giây làm thành 1 đơn vị (60 = một phút trọn; cộng dồn phần dư). */
  unitSeconds?: number;
  /** Khoá thống kê trọn đời (xem LIFETIME_LABELS). */
  life: string;
  /** Khoảng cách tối thiểu (ms) giữa hai lần ghi cùng loại (chống bấm liên tục). */
  minGapMs: number;
}

/** Trần tinh tấn công phu mỗi ngày. */
export const PRACTICE_CAP = 200;
/** Trần "công phu thêm" mỗi ngày (ghé chùa, cùng công phu chung), tính ngoài trần chính. */
export const EXTRA_CAP = 60;
/** Tinh tấn mỗi việc hôm nay, và thưởng khi xong cả ba (ngoài trần). */
export const TASK_XP = 30;
export const TASK_ALL_BONUS = 30;
/** Một "buổi" công phu chung = 5 phút có mặt. */
export const COMMUNITY_SESSION_SECONDS = 300;

export const XP_TABLE: Record<ActivityKind, XpRule> = {
  visit: { xp: 10, limit: 1, pool: 'extra', life: 'visitDays', minGapMs: 0 },
  pray: { xp: 3, limit: 5, pool: 'practice', life: 'pray', minGapMs: 1200 },
  bow: { xp: 6, limit: 10, pool: 'practice', life: 'bow', minGapMs: 1200 },
  incense: { xp: 12, limit: 3, pool: 'practice', life: 'incense', minGapMs: 2000 },
  flowers: { xp: 10, limit: 2, pool: 'practice', life: 'flowers', minGapMs: 2000 },
  candle: { xp: 8, limit: 2, pool: 'practice', life: 'candle', minGapMs: 2000 },
  bell: { xp: 4, limit: 3, pool: 'practice', life: 'bell', minGapMs: 1500 },
  lantern: { xp: 15, limit: 2, pool: 'practice', life: 'lantern', minGapMs: 2000 },
  que: { xp: 10, limit: 1, pool: 'practice', life: 'que', minGapMs: 2000 },
  beadsRound: { xp: 20, limit: 5, pool: 'practice', life: 'beadsRound', minGapMs: 15_000 },
  chantDone: { xp: 25, limit: 4, pool: 'practice', life: 'chantDone', minGapMs: 20_000 },
  meditateSeconds: { xp: 8, limit: 60, pool: 'practice', unitSeconds: 60, life: 'meditateMinutes', minGapMs: 0 },
  sitSeconds: { xp: 2, limit: 15, pool: 'practice', unitSeconds: 60, life: 'sitMinutes', minGapMs: 0 },
  sweepRound: { xp: 12, limit: 3, pool: 'practice', life: 'sweepRound', minGapMs: 10_000 },
  walkSpot: { xp: 6, limit: 6, pool: 'practice', life: 'walkSpot', minGapMs: 1000 },
  release: { xp: 15, limit: 2, pool: 'practice', life: 'release', minGapMs: 2000 },
  loc: { xp: 10, limit: 2, pool: 'practice', life: 'loc', minGapMs: 2000 },
  wish: { xp: 10, limit: 2, pool: 'practice', life: 'wish', minGapMs: 2000 },
  listenSeconds: { xp: 3, limit: 30, pool: 'practice', unitSeconds: 60, life: 'listenMinutes', minGapMs: 0 },
  communitySeconds: { xp: 30, limit: 2, pool: 'extra', unitSeconds: COMMUNITY_SESSION_SECONDS, life: 'communitySessions', minGapMs: 0 },
  today: { xp: 5, limit: 1, pool: 'practice', life: 'today', minGapMs: 0 },
  greet: { xp: 2, limit: 5, pool: 'practice', life: 'greet', minGapMs: 1500 },
  quanam: { xp: 8, limit: 2, pool: 'practice', life: 'quanam', minGapMs: 2000 },
  mindfulSeconds: { xp: 6, limit: 30, pool: 'practice', unitSeconds: 60, life: 'mindfulMinutes', minGapMs: 0 },
  chickenRescue: { xp: 18, limit: 5, pool: 'practice', life: 'chickenRescue', minGapMs: 2500 },
  chickenFeed: { xp: 10, limit: 3, pool: 'practice', life: 'chickenFeed', minGapMs: 2500 },
  /** Từng hạt tràng hạt: chỉ thống kê, không có xp (xp tính theo vòng). */
  beads: { xp: 0, limit: 0, pool: 'none', life: 'beads', minGapMs: 0 },
};

/** Số đơn vị tối đa cho một lần gọi `record` (chặn số bất thường). */
export const MAX_UNITS_PER_CALL: Partial<Record<ActivityKind, number>> = { beads: 108 };
export const DEFAULT_MAX_UNITS = 10;
/** Với các loại *Seconds: số giây tối đa cho một lần gọi, và tốc độ nạp "giây tín dụng" so với thời gian thật. */
export const MAX_SECONDS_PER_CALL = 600;
export const SECONDS_BUCKET_START = 300;
export const SECONDS_BUCKET_CAP = 900;
export const SECONDS_REFILL_RATE = 1.5;

// ───────────────────────── Mở khoá ─────────────────────────
export const UNLOCK_INFO: Record<UnlockFeature, { level: number; label: string }> = {
  flowers: { level: 2, label: 'Dâng hoa' },
  bell: { level: 2, label: 'Thỉnh chuông' },
  candle: { level: 3, label: 'Thắp nến' },
  today: { level: 3, label: 'Lời dạy hôm nay' },
  lantern: { level: 4, label: 'Thả đèn hoa đăng' },
  dharma: { level: 5, label: 'Nghe pháp thoại' },
  que: { level: 5, label: 'Xin quẻ' },
  wardrobe: { level: 6, label: 'Tủ trang phục' },
  walkMeditation: { level: 8, label: 'Thiền hành' },
  release: { level: 10, label: 'Phóng sinh' },
  loc: { level: 10, label: 'Hái lộc' },
  friends: { level: 1, label: 'Bạn đạo' },
};

// ───────────────────────── Việc hôm nay ─────────────────────────
export interface TaskTemplate {
  id: string;
  /** Nhãn hiển thị; `{spot}` được thay bằng tên điểm đi dạo. */
  label: string;
  kind: ActivityKind;
  /** Đích: số lần, hoặc số PHÚT với các loại *Seconds. */
  target: number;
  action?: PanelId | SpotId | ActionId;
  /** Việc dễ, dành cho người mới (cấp 1). */
  easy?: boolean;
  /** Cần mở khoá tính năng này mới xuất hiện. */
  unlock?: UnlockFeature;
  /** Nếu có: mỗi ngày chọn một điểm trong danh sách (xác định theo ngày). */
  spots?: SpotId[];
}

export const SPOT_LABELS: Record<SpotId, string> = {
  yard: 'sân chùa',
  bodhi: 'cây bồ đề',
  meditate: 'sân thiền',
  quanam: 'tượng Quan Âm',
  well: 'giếng ngọc',
  hall: 'chánh điện',
  coop: 'chuồng gà sau chùa',
};

export const TASK_TEMPLATES: TaskTemplate[] = [
  { id: 'beads', label: 'Lần một vòng tràng hạt', kind: 'beadsRound', target: 1, action: 'beads', easy: true },
  { id: 'chant', label: 'Tụng một bài kinh', kind: 'chantDone', target: 1, action: 'chant' },
  { id: 'meditate', label: 'Thiền 5 phút', kind: 'meditateSeconds', target: 5, action: 'meditate' },
  { id: 'incense', label: 'Thắp một nén hương', kind: 'incense', target: 1, action: 'incense', easy: true },
  { id: 'bell', label: 'Thỉnh 3 tiếng chuông', kind: 'bell', target: 3, action: 'bell', unlock: 'bell' },
  { id: 'bow', label: 'Lạy Phật 3 lạy', kind: 'bow', target: 3, action: 'bow', easy: true },
  { id: 'lantern', label: 'Thả một đèn hoa đăng', kind: 'lantern', target: 1, action: 'lantern', unlock: 'lantern' },
  { id: 'quanam', label: 'Lễ Quan Âm', kind: 'quanam', target: 1, action: 'quanam' },
  { id: 'walk', label: 'Đi dạo tới {spot}', kind: 'walkSpot', target: 1, spots: ['yard', 'bodhi', 'meditate', 'well', 'hall', 'coop'] },
  { id: 'sit', label: 'Ngồi bồ đoàn 3 phút', kind: 'sitSeconds', target: 3, action: 'meditate' },
  { id: 'today', label: 'Đọc lời dạy hôm nay', kind: 'today', target: 1, action: 'today', unlock: 'today' },
  { id: 'greet', label: 'Chắp tay chào mọi người', kind: 'greet', target: 1, action: 'sayings', easy: true },
  { id: 'listen', label: 'Nghe niệm Phật 3 phút', kind: 'listenSeconds', target: 3, action: 'listen' },
  { id: 'walkMeditation', label: 'Thiền hành 3 phút', kind: 'mindfulSeconds', target: 3, action: 'walkMeditation', unlock: 'walkMeditation' },
  { id: 'chicken', label: 'Đưa 1 chú gà thất lạc về chuồng', kind: 'chickenRescue', target: 1, action: 'catchChicken', easy: true },
];

/** Băm chuỗi (FNV-1a 32 bit) → số nguyên không dấu, dùng để chọn việc theo ngày một cách xác định. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Trộn thêm cho phân bố đều hơn.
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  h = Math.imul(h, 0x297a2d39);
  h ^= h >>> 15;
  return h >>> 0;
}

export interface PickedTask {
  id: string;
  /** Điểm đi dạo được chọn (nếu mẫu có `spots`). */
  spot?: SpotId;
}

/**
 * Chọn `count` việc cho một ngày. Xác định theo `dayKey` (cùng ngày + cùng cấp → cùng kết quả).
 * Cấp 1 chỉ lấy việc dễ; từ cấp 2 lấy mọi mẫu đã mở khoá. Xếp hạng theo băm (dayKey, id)
 * nên việc mới mở khoá chỉ chen vào nếu điểm băm cao hơn.
 */
export function pickTasks(dayKey: string, level: number, count = 3): PickedTask[] {
  const eligible = TASK_TEMPLATES.filter((t) => {
    if (level < 2 && !t.easy) return false;
    if (t.unlock && level < UNLOCK_INFO[t.unlock].level) return false;
    return true;
  });
  const ranked = eligible
    .map((t) => ({ t, score: hashString(`${dayKey}|${t.id}`) }))
    .sort((a, b) => a.score - b.score || (a.t.id < b.t.id ? -1 : 1))
    .slice(0, count);
  return ranked.map(({ t }) => {
    if (!t.spots) return { id: t.id };
    return { id: t.id, spot: t.spots[hashString(`${dayKey}|spot|${t.id}`) % t.spots.length] };
  });
}

export function taskLabel(t: TaskTemplate, spot?: SpotId): string {
  return t.label.replace('{spot}', spot ? SPOT_LABELS[spot] : '');
}

// ───────────────────────── Chuỗi giữ lửa ─────────────────────────
/** Mốc chuỗi ngày → tinh tấn thưởng (một lần). */
export const STREAK_MILESTONES: { days: number; xp: number }[] = [
  { days: 3, xp: 30 },
  { days: 7, xp: 50 },
  { days: 14, xp: 80 },
  { days: 30, xp: 150 },
  { days: 60, xp: 250 },
  { days: 100, xp: 350 },
  { days: 200, xp: 450 },
  { days: 365, xp: 500 },
];
export const REST_DAY_EVERY = 7;
export const REST_DAY_MAX = 2;

// ───────────────────────── Cấp ─────────────────────────
export const MAX_LEVEL = 999;
/** Tinh tấn cần để lên từ cấp n → n+1. */
export function xpNeeded(n: number): number {
  return Math.round(50 + 25 * (n - 1) + 4 * Math.pow(n - 1, 1.5));
}

// ───────────────────────── Thống kê trọn đời ─────────────────────────
export const LIFETIME_LABELS: Record<string, string> = {
  visitDays: 'Ngày ghé chùa',
  practiceDays: 'Ngày công phu',
  specialDays: 'Ngày mùng một, rằm đã công phu',
  pray: 'Lần chắp tay',
  bow: 'Lần lạy Phật',
  incense: 'Nén hương đã thắp',
  flowers: 'Lần dâng hoa',
  candle: 'Ngọn nến đã thắp',
  bell: 'Tiếng chuông đã thỉnh',
  lantern: 'Đèn hoa đăng đã thả',
  que: 'Lần xin quẻ',
  beads: 'Hạt tràng hạt đã lần',
  beadsRound: 'Vòng tràng hạt',
  chantDone: 'Bài kinh đã tụng',
  meditateMinutes: 'Phút thiền',
  sitMinutes: 'Phút ngồi bồ đoàn',
  sweepRound: 'Lượt quét lá',
  walkSpot: 'Điểm đã ghé thăm',
  release: 'Lần phóng sinh',
  loc: 'Lần hái lộc',
  wish: 'Lời nguyện đã treo',
  listenMinutes: 'Phút nghe niệm Phật',
  communitySessions: 'Buổi công phu chung',
  today: 'Lời dạy đã đọc',
  greet: 'Lời chào bạn đạo',
  quanam: 'Lần lễ Quan Âm',
  mindfulMinutes: 'Phút thiền hành',
  chickenRescue: 'Chú gà đưa về chuồng',
  chickenFeed: 'Lần cho gà ăn',
};

// ───────────────────────── Dấu ấn hành hương ─────────────────────────
/** Số liệu đưa vào để xét dấu ấn. */
export interface StampStats {
  life: Record<string, number>;
  spotsEver: string[];
  best: number;
  level: number;
}

export interface StampInfo {
  id: string;
  name: string;
  desc: string;
  group: string;
}
interface StampDef extends StampInfo {
  test(s: StampStats): boolean;
}

export const STAMP_GROUPS = ['Bảy dấu ấn hành hương', 'Con đường chùa', 'Vạn hạnh tinh tấn'] as const;

const L = (s: StampStats, k: string): number => s.life[k] ?? 0;
const [G1, G2, G3] = STAMP_GROUPS;

const STAMP_DEFS: StampDef[] = [
  // Bảy dấu ấn hành hương
  { id: 'first-bow', group: G1, name: 'Lạy Phật lần đầu', desc: 'Chắp tay lễ Phật lần đầu tiên.', test: (s) => L(s, 'bow') >= 1 },
  { id: 'first-offering', group: G1, name: 'Dâng hương, hoa, nến', desc: 'Đã dâng đủ hương, hoa và nến.', test: (s) => L(s, 'incense') >= 1 && L(s, 'flowers') >= 1 && L(s, 'candle') >= 1 },
  { id: 'first-lantern', group: G1, name: 'Đèn đầu tiên', desc: 'Thả ngọn đèn hoa đăng đầu tiên lên ao sen.', test: (s) => L(s, 'lantern') >= 1 },
  { id: 'first-beads', group: G1, name: 'Trọn vòng tràng hạt', desc: 'Lần trọn một vòng tràng hạt.', test: (s) => L(s, 'beadsRound') >= 1 },
  { id: 'first-chant', group: G1, name: 'Tụng xong một bài kinh', desc: 'Tụng trọn bài kinh đầu tiên.', test: (s) => L(s, 'chantDone') >= 1 },
  { id: 'first-meditate', group: G1, name: 'Thiền đủ 5 phút', desc: 'Ngồi thiền tổng cộng đủ 5 phút.', test: (s) => L(s, 'meditateMinutes') >= 5 },
  { id: 'first-sweep', group: G1, name: 'Quét xong lượt lá', desc: 'Quét sạch một lượt lá trên sân chùa.', test: (s) => L(s, 'sweepRound') >= 1 },
  // Con đường chùa
  { id: 'six-spots', group: G2, name: 'Đi hết sáu điểm', desc: 'Ghé thăm đủ sáu nơi trong khuôn viên chùa.', test: (s) => ['yard', 'bodhi', 'meditate', 'quanam', 'well', 'hall'].every((k) => s.spotsEver.includes(k)) },
  { id: 'ram-mung1', group: G2, name: 'Công phu ngày rằm, mùng một', desc: 'Công phu vào ngày mùng một hoặc rằm âm lịch.', test: (s) => L(s, 'specialDays') >= 1 },
  { id: 'first-que', group: G2, name: 'Xin quẻ lần đầu', desc: 'Lắc ống xăm lần đầu tiên.', test: (s) => L(s, 'que') >= 1 },
  { id: 'first-wish', group: G2, name: 'Ruy-băng nguyện', desc: 'Treo lời nguyện đầu tiên lên cây bồ đề.', test: (s) => L(s, 'wish') >= 1 },
  { id: 'first-chicken', group: G2, name: 'Đưa gà về ổ', desc: 'Tìm và đưa chú gà thất lạc đầu tiên về chuồng sau chùa.', test: (s) => L(s, 'chickenRescue') >= 1 },
  { id: 'streak-7', group: G2, name: 'Giữ lửa 7 ngày', desc: 'Công phu liên tiếp 7 ngày.', test: (s) => s.best >= 7 },
  { id: 'streak-30', group: G2, name: 'Giữ lửa 30 ngày', desc: 'Công phu liên tiếp 30 ngày.', test: (s) => s.best >= 30 },
  { id: 'streak-100', group: G2, name: 'Giữ lửa 100 ngày', desc: 'Công phu liên tiếp 100 ngày.', test: (s) => s.best >= 100 },
  // Vạn hạnh tinh tấn
  { id: 'bow-108', group: G3, name: '108 lạy', desc: 'Lạy Phật tổng cộng 108 lạy.', test: (s) => L(s, 'bow') >= 108 },
  { id: 'beads-108', group: G3, name: '108 vòng tràng hạt', desc: 'Lần trọn 108 vòng tràng hạt.', test: (s) => L(s, 'beadsRound') >= 108 },
  { id: 'chant-108', group: G3, name: '108 bài kinh', desc: 'Tụng trọn 108 bài kinh.', test: (s) => L(s, 'chantDone') >= 108 },
  { id: 'meditate-1000', group: G3, name: '1.000 phút thiền', desc: 'Ngồi thiền tổng cộng 1.000 phút.', test: (s) => L(s, 'meditateMinutes') >= 1000 },
  { id: 'incense-108', group: G3, name: '108 nén hương', desc: 'Thắp 108 nén hương.', test: (s) => L(s, 'incense') >= 108 },
  { id: 'lantern-49', group: G3, name: '49 đèn hoa đăng', desc: 'Thả 49 ngọn đèn hoa đăng.', test: (s) => L(s, 'lantern') >= 49 },
  { id: 'sweep-108', group: G3, name: '108 lượt quét lá', desc: 'Quét sạch 108 lượt lá — sân chùa luôn sạch.', test: (s) => L(s, 'sweepRound') >= 108 },
  { id: 'chicken-27', group: G3, name: 'Hộ trì đàn gà chùa', desc: 'Đưa 27 chú gà thất lạc về chuồng bình an.', test: (s) => L(s, 'chickenRescue') >= 27 },
];

export const STAMPS: StampInfo[] = STAMP_DEFS.map(({ id, name, desc, group }) => ({ id, name, desc, group }));

/** Danh sách id dấu ấn đã đạt theo số liệu hiện tại (thứ tự như STAMPS). */
export function evaluateStamps(s: StampStats): string[] {
  return STAMP_DEFS.filter((d) => d.test(s)).map((d) => d.id);
}
