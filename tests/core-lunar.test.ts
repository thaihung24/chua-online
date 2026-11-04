/** Kiểm thử âm lịch: so với các mốc đã biết (hai chiều), tháng nhuận, can-chi, ngày lễ, lưới tháng. */
import { describe, expect, it } from 'vitest';
import { lunarLabel, lunarToSolar, monthGrid, nextSpecial, solarToLunar, specialDays, todayVN } from '@/core/lunar';

/** Mùng một Tết (1/1 âm) theo dương lịch, đối chiếu lịch Việt Nam đã công bố.
 * Lưu ý 2007 (17/2) và 2030 (2/2) Việt Nam (UTC+7) sớm hơn Trung Quốc (UTC+8) một ngày. */
const TET: [number, number, number][] = [
  [2000, 2, 5], [2001, 1, 24], [2002, 2, 12], [2003, 2, 1], [2004, 1, 22], [2005, 2, 9], [2006, 1, 29], [2007, 2, 17],
  [2008, 2, 7], [2009, 1, 26], [2010, 2, 14], [2011, 2, 3], [2012, 1, 23], [2013, 2, 10], [2014, 1, 31], [2015, 2, 19],
  [2016, 2, 8], [2017, 1, 28], [2018, 2, 16], [2019, 2, 5], [2020, 1, 25], [2021, 2, 12], [2022, 2, 1], [2023, 1, 22],
  [2024, 2, 10], [2025, 1, 29], [2026, 2, 17], [2027, 2, 6], [2028, 1, 26], [2029, 2, 13], [2030, 2, 2],
];

describe('lunar: Tết Nguyên Đán 2000–2030 (cả hai chiều)', () => {
  for (const [y, m, d] of TET) {
    it(`mùng 1 Tết ${y} = ${d}/${m}/${y}`, () => {
      const l = solarToLunar(y, m, d);
      expect([l.day, l.month, l.year, l.leap]).toEqual([1, 1, y, false]);
      expect(lunarToSolar(1, 1, y)).toEqual({ y, m, d });
    });
  }
});

describe('lunar: mốc cụ thể', () => {
  it('29/1/2025 = mùng 1 Tết Ất Tỵ, ngày Mậu Tuất, tháng Mậu Dần', () => {
    const l = solarToLunar(2025, 1, 29);
    expect(l.canChi).toEqual({ day: 'Mậu Tuất', month: 'Mậu Dần', year: 'Ất Tỵ' });
    expect(lunarLabel(l)).toBe('Ngày 1 tháng 1, năm Ất Tỵ');
  });
  it('10/2/2024 = mùng 1 Tết Giáp Thìn, ngày Giáp Thìn', () => {
    const l = solarToLunar(2024, 2, 10);
    expect(l.canChi.day).toBe('Giáp Thìn');
    expect(l.canChi.year).toBe('Giáp Thìn');
    expect(l.canChi.month).toBe('Bính Dần');
  });
  it('17/2/2026 = mùng 1 tháng 1 Bính Ngọ', () => {
    const l = solarToLunar(2026, 2, 17);
    expect(l).toMatchObject({ day: 1, month: 1, year: 2026, leap: false });
    expect(l.canChi.year).toBe('Bính Ngọ');
  });
  it('1/1/2000 = 25/11 Kỷ Mão, ngày Mậu Ngọ', () => {
    const l = solarToLunar(2000, 1, 1);
    expect([l.day, l.month, l.year]).toEqual([25, 11, 1999]);
    expect(l.canChi.day).toBe('Mậu Ngọ');
    expect(l.canChi.year).toBe('Kỷ Mão');
  });
  it('1/1/2024 = 20/11 Quý Mão (năm âm chưa đổi)', () => {
    const l = solarToLunar(2024, 1, 1);
    expect([l.day, l.month, l.year]).toEqual([20, 11, 2023]);
    expect(l.canChi.year).toBe('Quý Mão');
  });
  it('2/9/1945 = 26/7 Ất Dậu', () => {
    const l = solarToLunar(1945, 9, 2);
    expect([l.day, l.month, l.year, l.leap]).toEqual([26, 7, 1945, false]);
    expect(l.canChi.year).toBe('Ất Dậu');
  });
  it('Rằm Vu Lan 2025 (15/7 Ất Tỵ) = 6/9/2025 (năm có tháng 6 nhuận)', () => {
    expect(lunarToSolar(15, 7, 2025)).toEqual({ y: 2025, m: 9, d: 6 });
    expect(solarToLunar(2025, 9, 6)).toMatchObject({ day: 15, month: 7, leap: false });
  });
  it('Vu Lan 2024 = 18/8/2024; Phật Đản 2025 = 12/5/2025; Trung thu 2025 = 6/10/2025', () => {
    expect(lunarToSolar(15, 7, 2024)).toEqual({ y: 2024, m: 8, d: 18 });
    expect(lunarToSolar(15, 4, 2025)).toEqual({ y: 2025, m: 5, d: 12 });
    expect(lunarToSolar(15, 8, 2025)).toEqual({ y: 2025, m: 10, d: 6 });
  });
  it('Rằm tháng Giêng 2024 = 24/2/2024', () => {
    expect(lunarToSolar(15, 1, 2024)).toEqual({ y: 2024, m: 2, d: 24 });
  });
  it('Giỗ Tổ Hùng Vương 10/3: 2023 = 29/4 (sau tháng 2 nhuận), 2024 = 18/4', () => {
    expect(lunarToSolar(10, 3, 2023)).toEqual({ y: 2023, m: 4, d: 29 });
    expect(lunarToSolar(10, 3, 2024)).toEqual({ y: 2024, m: 4, d: 18 });
  });
});

describe('lunar: tháng nhuận', () => {
  it('2023 nhuận tháng 2: 22/3 → 19/4/2023', () => {
    const a = solarToLunar(2023, 3, 21);
    expect([a.day, a.month, a.leap]).toEqual([30, 2, false]);
    const b = solarToLunar(2023, 3, 22);
    expect([b.day, b.month, b.leap]).toEqual([1, 2, true]);
    const c = solarToLunar(2023, 4, 19);
    expect([c.day, c.month, c.leap]).toEqual([29, 2, true]);
    const d = solarToLunar(2023, 4, 20);
    expect([d.day, d.month, d.leap]).toEqual([1, 3, false]);
    expect(lunarToSolar(1, 2, 2023, true)).toEqual({ y: 2023, m: 3, d: 22 });
    expect(lunarLabel(b)).toBe('Ngày 1 tháng 2 (nhuận), năm Quý Mão');
  });
  it('2025 nhuận tháng 6: 25/7 → 22/8/2025', () => {
    expect(solarToLunar(2025, 7, 25)).toMatchObject({ day: 1, month: 6, leap: true });
    expect(solarToLunar(2025, 8, 22)).toMatchObject({ day: 29, month: 6, leap: true });
    expect(solarToLunar(2025, 8, 23)).toMatchObject({ day: 1, month: 7, leap: false });
  });
  it('các năm nhuận đã biết: đúng một tháng nhuận, đúng tháng', () => {
    const leaps: Record<number, number> = { 2001: 4, 2004: 2, 2006: 7, 2009: 5, 2012: 4, 2014: 9, 2017: 6, 2020: 4, 2023: 2, 2025: 6, 2028: 5, 2031: 3 };
    for (let y = 2000; y <= 2032; y++) {
      const found: number[] = [];
      for (let m = 1; m <= 12; m++) if (lunarToSolar(1, m, y, true)) found.push(m);
      expect(found, `năm ${y}`).toEqual(leaps[y] ? [leaps[y]] : []);
    }
  });
  it('tháng nhuận không tồn tại → null; ngày 30 của tháng thiếu → null; ngoài khoảng → null', () => {
    expect(lunarToSolar(1, 3, 2023, true)).toBeNull();
    expect(lunarToSolar(1, 1, 2024, true)).toBeNull();
    expect(lunarToSolar(30, 2, 2023, true)).toBeNull(); // nhuận 2 năm 2023 chỉ có 29 ngày
    expect(lunarToSolar(0, 1, 2024)).toBeNull();
    expect(lunarToSolar(1, 13, 2024)).toBeNull();
    expect(lunarToSolar(1, 1, 1700)).toBeNull();
    expect(lunarToSolar(1, 1, 2300)).toBeNull();
    expect(lunarToSolar(1.5, 1, 2024)).toBeNull();
  });
});

describe('lunar: tính chất toàn cục', () => {
  it('khứ hồi mọi ngày 1802–2198, ngày liên tiếp tăng 1 hoặc về mùng 1', () => {
    const start = Date.UTC(1802, 2, 1);
    const end = Date.UTC(2198, 11, 31);
    let prev = solarToLunar(1802, 3, 1);
    for (let t = start + 86_400_000; t <= end; t += 86_400_000) {
      const dt = new Date(t);
      const y = dt.getUTCFullYear();
      const m = dt.getUTCMonth() + 1;
      const d = dt.getUTCDate();
      const l = solarToLunar(y, m, d);
      const back = lunarToSolar(l.day, l.month, l.year, l.leap);
      if (!back || back.y !== y || back.m !== m || back.d !== d) throw new Error(`khứ hồi lỗi ${y}-${m}-${d}`);
      if (l.day === 1) {
        if (prev.day !== 29 && prev.day !== 30) throw new Error(`tháng lạ trước ${y}-${m}-${d}`);
      } else if (l.day !== prev.day + 1) throw new Error(`ngày không liên tiếp ${y}-${m}-${d}`);
      prev = l;
    }
  });
  it('mỗi năm âm dài 353–355 hoặc 383–385 ngày', () => {
    for (let y = 1990; y <= 2060; y++) {
      const a = lunarToSolar(1, 1, y)!;
      const b = lunarToSolar(1, 1, y + 1)!;
      const len = (Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000;
      expect([353, 354, 355, 383, 384, 385], `năm ${y}`).toContain(len);
    }
  });
  it('ném lỗi với ngày dương không hợp lệ hoặc ngoài 1801–2199', () => {
    expect(() => solarToLunar(2025, 2, 30)).toThrow(RangeError);
    expect(() => solarToLunar(2025, 13, 1)).toThrow(RangeError);
    expect(() => solarToLunar(1800, 12, 31)).toThrow(RangeError);
    expect(() => solarToLunar(2200, 1, 1)).toThrow(RangeError);
    expect(() => solarToLunar(1801, 1, 25)).not.toThrow();
    expect(() => solarToLunar(2199, 12, 31)).not.toThrow();
  });
});

describe('lunar: todayVN', () => {
  it('đổi theo múi giờ UTC+7', () => {
    // 2025-01-28 18:00 UTC = 29/1 01:00 giờ VN
    expect(todayVN(new Date(Date.UTC(2025, 0, 28, 18, 0)))).toEqual({ y: 2025, m: 1, d: 29, weekday: 3 });
    expect(todayVN(new Date(Date.UTC(2025, 0, 28, 16, 59)))).toEqual({ y: 2025, m: 1, d: 28, weekday: 2 });
    expect(todayVN(new Date(Date.UTC(2024, 11, 31, 17, 0))).y).toBe(2025);
  });
  it('trả hôm nay khi không truyền tham số', () => {
    const t = todayVN();
    expect(t.y).toBeGreaterThanOrEqual(2024);
    expect(t.weekday).toBeGreaterThanOrEqual(0);
    expect(t.weekday).toBeLessThanOrEqual(6);
  });
});

describe('lunar: ngày đặc biệt', () => {
  const sp = (d: number, m: number, y: number, leap = false) => {
    const s = lunarToSolar(d, m, y, leap)!;
    return specialDays(solarToLunar(s.y, s.m, s.d));
  };
  it('mùng một & rằm', () => {
    expect(sp(1, 3, 2024).map((x) => x.kind)).toEqual(['mung1']);
    expect(sp(15, 3, 2024).map((x) => x.kind)).toEqual(['ram']);
    expect(sp(2, 3, 2024)).toEqual([]);
  });
  it('lễ lớn', () => {
    expect(sp(1, 1, 2025).map((x) => x.label)).toContain('Tết Nguyên Đán');
    expect(sp(15, 4, 2025).some((x) => x.kind === 'festival' && x.label === 'Phật Đản')).toBe(true);
    expect(sp(15, 7, 2025).some((x) => x.label.includes('Vu Lan'))).toBe(true);
    expect(sp(8, 12, 2025).some((x) => x.label.includes('thành đạo'))).toBe(true);
    expect(sp(17, 11, 2025).some((x) => x.label.includes('A Di Đà'))).toBe(true);
    expect(sp(15, 2, 2025).some((x) => x.label.includes('Niết bàn'))).toBe(true);
    expect(sp(8, 2, 2025).some((x) => x.label.includes('xuất gia'))).toBe(true);
    for (const m of [2, 6, 9]) expect(sp(19, m, 2025).some((x) => x.label.includes('Quan Thế Âm')), `19/${m}`).toBe(true);
    expect(sp(15, 10, 2025).some((x) => x.label.includes('Hạ Nguyên'))).toBe(true);
    expect(sp(15, 1, 2025).some((x) => x.label.includes('Thượng Nguyên'))).toBe(true);
  });
  it('tháng nhuận: chỉ mùng một/rằm, không có lễ lớn', () => {
    const r = sp(15, 6, 2025, true);
    expect(r.map((x) => x.kind)).toEqual(['ram']);
    expect(r[0].label).toContain('nhuận');
    expect(sp(19, 6, 2025, true)).toEqual([]);
    expect(sp(15, 2, 2023, true).some((x) => x.kind === 'festival')).toBe(false);
  });
});

describe('lunar: nextSpecial', () => {
  const vn = (y: number, m: number, d: number, h = 12) => new Date(Date.UTC(y, m - 1, d, h - 7, 0));
  it('hôm nay là ngày lễ → inDays = 0', () => {
    const n = nextSpecial(vn(2025, 9, 6));
    expect(n).toMatchObject({ inDays: 0, y: 2025, m: 9, d: 6 });
    expect(n.label).toContain('Vu Lan');
  });
  it('ngày thường → tìm mùng một/rằm kế tiếp', () => {
    const n = nextSpecial(vn(2025, 9, 7));
    expect(n).toMatchObject({ inDays: 15, y: 2025, m: 9, d: 22 });
    expect(n.label).toBe('Mùng một tháng 8');
  });
  it('tính theo giờ VN: 1h sáng 29/1/2025 giờ VN vẫn là Tết', () => {
    const n = nextSpecial(new Date(Date.UTC(2025, 0, 28, 18, 30)));
    expect(n.inDays).toBe(0);
    expect(n.label).toBe('Tết Nguyên Đán');
  });
  it('luôn trong vòng 16 ngày trong 3 năm', () => {
    for (let t = Date.UTC(2024, 0, 1); t < Date.UTC(2027, 0, 1); t += 86_400_000 * 3) {
      const n = nextSpecial(new Date(t));
      expect(n.inDays).toBeGreaterThanOrEqual(0);
      expect(n.inDays).toBeLessThanOrEqual(16);
    }
  });
});

describe('lunar: monthGrid', () => {
  it('42 ô, bắt đầu Thứ Hai, ô trong tháng liên tục', () => {
    const g = monthGrid(2025, 1); // 1/1/2025 là Thứ Tư → lưới bắt đầu 30/12/2024
    expect(g).toHaveLength(42);
    expect(g[0]).toMatchObject({ y: 2024, m: 12, d: 30, inMonth: false });
    expect(g[2]).toMatchObject({ y: 2025, m: 1, d: 1, inMonth: true });
    expect(g.filter((c) => c.inMonth)).toHaveLength(31);
    expect(new Date(Date.UTC(g[0].y, g[0].m - 1, g[0].d)).getUTCDay()).toBe(1);
  });
  it('tháng bắt đầu đúng Thứ Hai thì ô đầu chính là ngày 1', () => {
    const g = monthGrid(2025, 9); // 1/9/2025 = Thứ Hai
    expect(g[0]).toMatchObject({ m: 9, d: 1, inMonth: true });
  });
  it('tháng bắt đầu Chủ nhật thì lệch 6 ô', () => {
    const g = monthGrid(2025, 6); // 1/6/2025 = Chủ nhật
    expect(g[6]).toMatchObject({ m: 6, d: 1, inMonth: true });
    expect(g[0].inMonth).toBe(false);
  });
  it('mang âm lịch và ngày đặc biệt đúng', () => {
    const g = monthGrid(2025, 1);
    const tet = g.find((c) => c.inMonth && c.d === 29)!;
    expect(tet.lunar).toMatchObject({ day: 1, month: 1, year: 2025 });
    expect(tet.specials.some((s) => s.label === 'Tết Nguyên Đán')).toBe(true);
    expect(g.find((c) => c.inMonth && c.d === 14)!.specials.some((s) => s.kind === 'ram')).toBe(true);
  });
  it('mọi tháng 2000–2030 đều có 42 ô liên tục, đủ ngày', () => {
    for (let y = 2000; y <= 2030; y++)
      for (let m = 1; m <= 12; m++) {
        const g = monthGrid(y, m);
        expect(g).toHaveLength(42);
        const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
        expect(g.filter((c) => c.inMonth)).toHaveLength(days);
        expect(g.some((c) => c.inMonth && c.d === 1)).toBe(true);
      }
  });
});
