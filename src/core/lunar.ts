/**
 * Âm lịch Việt Nam (múi giờ UTC+7), dùng được cho các năm dương 1801–2199.
 * Cài đặt lại bằng TypeScript theo thuật toán thiên văn công khai của Hồ Ngọc Đức:
 * ngày Julius, giờ Sóc (trăng mới) theo Jean Meeus, kinh độ Mặt Trời để xác định Trung khí và tháng nhuận.
 * Kèm Can-Chi, ngày lễ Phật giáo/ngày vía, lưới lịch tháng (tuần bắt đầu từ THỨ HAI).
 */
import { VN_OFFSET_MS } from './contracts';

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  canChi: { day: string; month: string; year: string };
}
export interface SpecialDay {
  kind: 'ram' | 'mung1' | 'festival';
  label: string;
}

const TZ = 7;
const MIN_YEAR = 1801;
const MAX_YEAR = 2199;
const PI = Math.PI;
const SYNODIC = 29.530588853;
const EPOCH = 2415021.076998695; // JD của trăng mới đầu tiên (k = 0) theo thuật toán

// ───────────────────────── Ngày Julius ─────────────────────────
/** Số ngày Julius (ngày nguyên, lúc 12h) của ngày dương dd/mm/yy (lịch Gregory; trước 15/10/1582 dùng lịch Julius). */
function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  return jd;
}

/** Ngược lại: JD → ngày dương. */
function jdToDate(jd: number): { y: number; m: number; d: number } {
  let b: number;
  let c: number;
  if (jd > 2299160) {
    const a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return { y: year, m: month, d: day };
}

// ───────────────────────── Thiên văn ─────────────────────────
const newMoonCache = new Map<number, number>();
/** JD (thực) của trăng mới thứ k kể từ 1/1/1900. */
function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Jd1 + C1 - deltat;
}

/** Ngày (số JD nguyên, giờ địa phương UTC+tz) bắt đầu tháng âm thứ k. */
function getNewMoonDay(k: number, tz: number = TZ): number {
  const hit = newMoonCache.get(k);
  if (hit !== undefined) return hit;
  const v = Math.floor(newMoon(k) + 0.5 + tz / 24);
  newMoonCache.set(k, v);
  return v;
}

/** Kinh độ Mặt Trời (0..2π) tại thời điểm JD. */
function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  const omega = 125.04 - 1934.136 * T;
  L = L - 0.00569 - 0.00478 * Math.sin(omega * dr);
  L = L * dr;
  L = L - PI * 2 * Math.floor(L / (PI * 2));
  return L;
}

/** Cung Mặt Trời 0..11 (mỗi cung 30°, = chỉ số Trung khí) lúc 0h địa phương của ngày dayNumber. */
function getSunLongitude(dayNumber: number, tz: number = TZ): number {
  return Math.floor((sunLongitude(dayNumber - 0.5 - tz / 24) / PI) * 6);
}

const month11Cache = new Map<number, number>();
/** Ngày bắt đầu tháng 11 âm lịch (chứa Đông chí) của năm dương yy. */
function getLunarMonth11(yy: number, tz: number = TZ): number {
  const hit = month11Cache.get(yy);
  if (hit !== undefined) return hit;
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / SYNODIC);
  let nm = getNewMoonDay(k, tz);
  const sunLong = getSunLongitude(nm, tz);
  if (sunLong >= 9) nm = getNewMoonDay(k - 1, tz);
  month11Cache.set(yy, nm);
  return nm;
}

/** Vị trí tháng nhuận (so với tháng 11) trong năm có 13 tháng, bắt đầu từ a11. */
function getLeapMonthOffset(a11: number, tz: number = TZ): number {
  const k = Math.floor((a11 - EPOCH) / SYNODIC + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

// ───────────────────────── Đổi ngày ─────────────────────────
interface RawLunar {
  day: number;
  month: number;
  year: number;
  leap: boolean;
}

function convertSolar2Lunar(dd: number, mm: number, yy: number): RawLunar {
  const dayNumber = jdFromDate(dd, mm, yy);
  let k = Math.floor((dayNumber - EPOCH) / SYNODIC);
  // Ước lượng k có thể lệch 1 ở vài ngày sát giờ Sóc: hiệu chỉnh để monthStart ≤ dayNumber < tháng sau.
  while (getNewMoonDay(k + 1) <= dayNumber) k++;
  while (getNewMoonDay(k) > dayNumber) k--;
  const monthStart = getNewMoonDay(k);
  let a11 = getLunarMonth11(yy);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
}

function convertLunar2Solar(ld: number, lm: number, ly: number, leap: boolean): { y: number; m: number; d: number } | null {
  let a11: number;
  let b11: number;
  if (lm < 11) {
    a11 = getLunarMonth11(ly - 1);
    b11 = getLunarMonth11(ly);
  } else {
    a11 = getLunarMonth11(ly);
    b11 = getLunarMonth11(ly + 1);
  }
  const k = Math.floor(0.5 + (a11 - EPOCH) / SYNODIC);
  let off = lm - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && lm !== leapMonth) return null;
    if (leap || off >= leapOff) off += 1;
  } else if (leap) {
    return null;
  }
  const monthStart = getNewMoonDay(k + off);
  return jdToDate(monthStart + ld - 1);
}

// ───────────────────────── Can – Chi ─────────────────────────
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const mod = (a: number, n: number): number => ((a % n) + n) % n;

function canChiOf(raw: RawLunar, jd: number): LunarDate['canChi'] {
  return {
    day: `${CAN[mod(jd + 9, 10)]} ${CHI[mod(jd + 1, 12)]}`,
    // Tháng 1 âm = Dần; tháng nhuận lấy theo tên tháng trước (quy ước thường dùng).
    month: `${CAN[mod(raw.year * 12 + raw.month + 3, 10)]} ${CHI[mod(raw.month + 1, 12)]}`,
    year: `${CAN[mod(raw.year + 6, 10)]} ${CHI[mod(raw.year + 8, 12)]}`,
  };
}

// ───────────────────────── API ─────────────────────────
function checkSolar(y: number, m: number, d: number): void {
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) throw new RangeError('Ngày dương không hợp lệ');
  if (y < MIN_YEAR || y > MAX_YEAR) throw new RangeError(`Chỉ hỗ trợ năm ${MIN_YEAR}–${MAX_YEAR}`);
  const t = new Date(Date.UTC(y, m - 1, d));
  if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) throw new RangeError('Ngày dương không hợp lệ');
}

/** Dương → âm (theo giờ Việt Nam). Ném RangeError nếu ngày không hợp lệ hoặc ngoài 1801–2199. */
export function solarToLunar(y: number, m: number, d: number): LunarDate {
  checkSolar(y, m, d);
  const raw = convertSolar2Lunar(d, m, y);
  return { ...raw, canChi: canChiOf(raw, jdFromDate(d, m, y)) };
}

/** Âm → dương. Trả null nếu ngày âm không tồn tại (tháng nhuận sai, ngày 30 của tháng thiếu, ngoài khoảng hỗ trợ). */
export function lunarToSolar(day: number, month: number, year: number, leap = false): { y: number; m: number; d: number } | null {
  if (![day, month, year].every(Number.isInteger)) return null;
  if (day < 1 || day > 30 || month < 1 || month > 12 || year < MIN_YEAR || year > MAX_YEAR) return null;
  const s = convertLunar2Solar(day, month, year, leap);
  if (!s || s.y < MIN_YEAR || s.y > MAX_YEAR) return null;
  // Kiểm tra vòng về để loại ngày không tồn tại (vd 30 của tháng thiếu).
  const back = convertSolar2Lunar(s.d, s.m, s.y);
  if (back.day !== day || back.month !== month || back.year !== year || back.leap !== leap) return null;
  return s;
}

/** Ngày hiện tại theo giờ VN. `weekday`: 0 = Chủ nhật … 6 = Thứ bảy. */
export function todayVN(now: Date = new Date()): { y: number; m: number; d: number; weekday: number } {
  const t = new Date(now.getTime() + VN_OFFSET_MS);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), weekday: t.getUTCDay() };
}

/** "Ngày 15 tháng 9 (nhuận), năm Bính Ngọ" */
export function lunarLabel(l: LunarDate): string {
  return `Ngày ${l.day} tháng ${l.month}${l.leap ? ' (nhuận)' : ''}, năm ${l.canChi.year}`;
}

/** Tên tháng âm dùng trong nhãn: Giêng, 2…11, Chạp. */
function monthName(m: number): string {
  return m === 1 ? 'Giêng' : m === 12 ? 'Chạp' : String(m);
}

/** Lễ lớn theo âm lịch (chỉ tính tháng không nhuận): key = tháng*100 + ngày. */
const FESTIVALS: Record<number, string> = {
  101: 'Tết Nguyên Đán',
  115: 'Rằm tháng Giêng (Thượng Nguyên)',
  208: 'Lễ Phật xuất gia',
  215: 'Lễ Phật nhập Niết bàn',
  219: 'Vía Quan Thế Âm (đản sinh)',
  415: 'Phật Đản',
  619: 'Vía Quan Thế Âm (thành đạo)',
  715: 'Vu Lan báo hiếu',
  919: 'Vía Quan Thế Âm (xuất gia)',
  1015: 'Rằm tháng Mười (Hạ Nguyên)',
  1117: 'Vía Phật A Di Đà',
  1208: 'Lễ Phật thành đạo',
};

/** Các ngày đặc biệt của một ngày âm: lễ lớn trước, rồi Rằm / mùng một. */
export function specialDays(l: LunarDate): SpecialDay[] {
  const out: SpecialDay[] = [];
  if (!l.leap) {
    const f = FESTIVALS[l.month * 100 + l.day];
    if (f) out.push({ kind: 'festival', label: f });
  }
  const suffix = l.leap ? ' (nhuận)' : '';
  if (l.day === 15) out.push({ kind: 'ram', label: `Rằm tháng ${monthName(l.month)}${suffix}` });
  if (l.day === 1) out.push({ kind: 'mung1', label: `Mùng một tháng ${monthName(l.month)}${suffix}` });
  return out;
}

/** Ngày đặc biệt kế tiếp tính từ hôm nay (VN), kể cả hôm nay (inDays = 0). Ưu tiên lễ lớn > rằm > mùng một. */
export function nextSpecial(now: Date = new Date()): { label: string; inDays: number; y: number; m: number; d: number } {
  const t = todayVN(now);
  const base = Date.UTC(t.y, t.m - 1, t.d);
  for (let i = 0; i < 400; i++) {
    const dt = new Date(base + i * 86_400_000);
    const y = dt.getUTCFullYear();
    const m = dt.getUTCMonth() + 1;
    const d = dt.getUTCDate();
    const sp = specialDays(solarToLunar(y, m, d));
    if (sp.length) return { label: sp[0].label, inDays: i, y, m, d };
  }
  // Không thể xảy ra (cứ ≤ 15 ngày lại có mùng một/rằm), giữ cho an toàn kiểu.
  return { label: 'Mùng một', inDays: 0, y: t.y, m: t.m, d: t.d };
}

/**
 * Lưới lịch 6 hàng × 7 cột (42 ô) cho tháng dương `m` (1..12) năm `y`.
 * Tuần bắt đầu từ THỨ HAI (cột 0 = T2 … cột 6 = CN). Ô ngoài tháng có `inMonth = false`.
 */
export function monthGrid(
  y: number,
  m: number,
): { y: number; m: number; d: number; lunar: LunarDate; specials: SpecialDay[]; inMonth: boolean }[] {
  const first = new Date(Date.UTC(y, m - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Thứ Hai = 0
  const start = first.getTime() - lead * 86_400_000;
  const cells: { y: number; m: number; d: number; lunar: LunarDate; specials: SpecialDay[]; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const dt = new Date(start + i * 86_400_000);
    const cy = dt.getUTCFullYear();
    const cm = dt.getUTCMonth() + 1;
    const cd = dt.getUTCDate();
    const lunar = solarToLunar(cy, cm, cd);
    cells.push({ y: cy, m: cm, d: cd, lunar, specials: specialDays(lunar), inMonth: cm === m && cy === y });
  }
  return cells;
}
