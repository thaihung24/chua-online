/** Kiểm thử hồ sơ: pháp danh ngẫu nhiên, kiểm tra tên, làm sạch & lưu. */
import { describe, expect, it } from 'vitest';
import { OUTFITS, OUTFIT_COLORS } from '@/core/contracts';
import type { Profile } from '@/core/contracts';
import { save } from '@/core/store';
import { defaultProfile, hasProfile, loadProfile, nameChoices, normalizeName, randomName, sanitizeProfile, saveProfile, validateChatText, validateName } from '@/core/profile';

describe('profile: defaultProfile', () => {
  it('hợp lệ theo sanitizeProfile', () => {
    const p = defaultProfile();
    expect(sanitizeProfile(p)).toEqual(p);
    expect(validateName(p.name)).toBeNull();
  });
  it('trả bản mới mỗi lần', () => {
    expect(defaultProfile()).not.toBe(defaultProfile());
  });
});

describe('profile: randomName', () => {
  it('kho ≥ 120 tên mỗi giới, không trùng, mọi tên qua validateName', () => {
    for (const g of ['male', 'female'] as const) {
      const all = nameChoices(g);
      expect(all.length).toBeGreaterThanOrEqual(120);
      expect(new Set(all).size).toBe(all.length);
      for (const n of all) expect(validateName(n), n).toBeNull();
    }
  });
  it('có các tên mẫu', () => {
    expect(nameChoices('male')).toContain('Như Nhẫn');
    expect(nameChoices('male')).toContain('Nhật Thông');
    expect(nameChoices('female')).toContain('Diệu Hạnh');
    expect(nameChoices('female')).toContain('Tuệ An');
  });
  it('trả tên hợp lệ thuộc kho; rng cố định cho kết quả cố định', () => {
    for (let i = 0; i < 300; i++) {
      const g = i % 2 ? 'male' : 'female';
      const n = randomName(g);
      expect(nameChoices(g)).toContain(n);
    }
    expect(randomName('female', () => 0)).toBe(nameChoices('female')[0]);
    expect(randomName('male', () => 0.999999)).toBe(nameChoices('male').at(-1));
    expect(randomName('male', () => 1)).toBe(nameChoices('male').at(-1)); // an toàn biên
  });
  it('đa dạng', () => {
    const s = new Set(Array.from({ length: 200 }, () => randomName('female')));
    expect(s.size).toBeGreaterThan(40);
  });
});

describe('profile: validateName', () => {
  const ok = ['Tuệ An', 'Diệu Hạnh', 'Nhật-Thông', 'An', 'Nguyễn Văn Thiện', 'Đức', 'Ngư', 'Lê Thị Hồng Nhung', 'Minh  Tâm', ' Hạnh Nguyên '];
  for (const n of ok) it(`hợp lệ: "${n}"`, () => expect(validateName(n)).toBeNull());

  it('độ dài 2–24', () => {
    expect(validateName('A')).toMatch(/ít nhất 2/);
    expect(validateName('')).toMatch(/ít nhất 2/);
    expect(validateName('   ')).toMatch(/ít nhất 2/);
    expect(validateName('A'.repeat(24))).toBeNull();
    expect(validateName('A'.repeat(25))).toMatch(/tối đa 24/);
    expect(validateName('Tuệ'.repeat(9))).toMatch(/tối đa 24/);
  });
  it('chữ số, số điện thoại, ký hiệu, URL bị từ chối', () => {
    for (const n of ['An2', '0912345678', 'Hạnh 123', 'a@b.com', 'www.abc.vn', 'http://x.y', 'Tuệ_An', 'An!', 'An.', '(An)', '<b>An</b>', '😀An', '你好', 'Привет', 'An\u200bAn'])
      expect(validateName(n), n).toBeTruthy();
  });
  it('dấu gạch/khoảng trắng chỉ ở giữa, không lặp', () => {
    expect(validateName('-An')).toBeTruthy();
    expect(validateName('An-')).toBeTruthy();
    expect(validateName('An--Tâm')).toBeTruthy();
    expect(validateName('An - Tâm')).toBeTruthy();
  });
  it('từ cấm (kể cả bỏ dấu/viết hoa/dính liền), từ quảng cáo', () => {
    const rev = (s: string) => [...s].reverse().join('');
    // viết ngược trong mã để không để lộ từ thô tục nguyên văn
    for (const w of ['tid', 'ioub', 'oed', 'lcv', 'tav cus', 'ohc od']) {
      const word = rev(w);
      expect(validateName(word), word).toMatch(/không phù hợp/);
      expect(validateName(word.toUpperCase()), word).toMatch(/không phù hợp/);
      expect(validateName(`An ${word}`), word).toMatch(/không phù hợp/);
    }
    expect(validateName('Zalo')).toMatch(/quảng cáo/);
    expect(validateName('Facebook Shop')).toMatch(/quảng cáo/);
    expect(validateName('Inbox ngay')).toMatch(/quảng cáo/);
    expect(validateName('Mua bán')).toMatch(/quảng cáo/);
    expect(validateName('Telegram')).toMatch(/quảng cáo/);
  });
  it('không chặn nhầm tên pháp danh thường gặp', () => {
    for (const n of ['Cúc', 'Đạt', 'Hạnh Đạo', 'Thích Nhất Hạnh', 'Quảng Đức', 'Diệu Âm', 'Minh Đăng', 'Thiện Tín', 'Hồng Ngư', 'Từ Bi', 'Bảo Ngọc', 'Phước Lộc', 'Liên Hoa'])
      expect(validateName(n), n).toBeNull();
  });
  it('trả thông báo tiếng Việt có dấu, giá trị không phải chuỗi cũng an toàn', () => {
    expect(validateName(undefined as unknown as string)).toMatch(/pháp danh/i);
    expect(validateName(null as unknown as string)).toBeTruthy();
    expect(validateName(5 as unknown as string)).toBeTruthy();
  });
  it('normalizeName', () => {
    expect(normalizeName('  Tuệ   An ')).toBe('Tuệ An');
    // NFD → NFC
    expect(normalizeName('Tue\u0323\u0302 An')).toBe('Tuệ An');
    expect(validateName('Tue\u0323\u0302 An')).toBeNull();
  });
});

describe('profile: sanitizeProfile', () => {
  const good: Profile = { name: 'Tuệ An', gender: 'female', outfit: 'ao-dai', colorIndex: 2 };
  it('hợp lệ trả nguyên', () => expect(sanitizeProfile(good)).toEqual(good));
  it('chuẩn hoá tên, giữ phụ kiện hợp lệ, bỏ phụ kiện lạ', () => {
    expect(sanitizeProfile({ ...good, name: '  Tuệ   An  ' })?.name).toBe('Tuệ An');
    expect(sanitizeProfile({ ...good, accessory: 'hat-lotus' })?.accessory).toBe('hat-lotus');
    expect(sanitizeProfile({ ...good, accessory: '<script>' })?.accessory).toBeUndefined();
    expect(sanitizeProfile({ ...good, accessory: 'x'.repeat(40) })?.accessory).toBeUndefined();
    expect(sanitizeProfile({ ...good, accessory: 5 })?.accessory).toBeUndefined();
  });
  it('bỏ trường thừa', () => {
    const p = sanitizeProfile({ ...good, evil: 'x', __proto__: { a: 1 } }) as unknown as Record<string, unknown>;
    expect(Object.keys(p).sort()).toEqual(['colorIndex', 'gender', 'name', 'outfit']);
  });
  it('từ chối giá trị sai', () => {
    const bad: unknown[] = [
      null, undefined, 'x', 5, [], {},
      { ...good, name: 'A' }, { ...good, name: 5 }, { ...good, name: 'An2' },
      { ...good, gender: 'other' }, { ...good, gender: undefined },
      { ...good, outfit: 'nope' }, { ...good, outfit: undefined },
      { ...good, colorIndex: -1 }, { ...good, colorIndex: 5 }, { ...good, colorIndex: 1.5 }, { ...good, colorIndex: '1' }, { ...good, colorIndex: NaN },
    ];
    for (const b of bad) expect(sanitizeProfile(b), JSON.stringify(b)).toBeNull();
  });
  it('colorIndex hợp lệ với mọi kiểu áo', () => {
    for (const o of OUTFITS)
      for (let i = 0; i < OUTFIT_COLORS[o.id].length; i++)
        expect(sanitizeProfile({ ...good, outfit: o.id, colorIndex: i })).not.toBeNull();
  });
});

describe('profile: lưu / tải', () => {
  it('saveProfile → loadProfile → hasProfile', () => {
    const p: Profile = { name: 'Diệu Hạnh', gender: 'female', outfit: 'ba-ba', colorIndex: 1 };
    expect(saveProfile(p)).toBe(true);
    expect(hasProfile()).toBe(true);
    expect(loadProfile()).toEqual(p);
  });
  it('không lưu hồ sơ sai, giữ hồ sơ cũ', () => {
    const before = loadProfile();
    expect(saveProfile({ name: 'x', gender: 'male', outfit: 'ao-dai', colorIndex: 0 })).toBe(false);
    expect(loadProfile()).toEqual(before);
  });
  it('dữ liệu lưu bị hỏng → null', () => {
    save('profile', { name: 'An2', gender: 'male' });
    expect(loadProfile()).toBeNull();
    expect(hasProfile()).toBe(false);
    save('profile', 'rác');
    expect(loadProfile()).toBeNull();
  });
});

describe('profile: validateChatText', () => {
  it('cho phép câu tiếng Việt tự nhiên, dấu câu, số và emoji', () => {
    const ok = [
      'A Di Đà Phật 🙏',
      'Chào các bạn, chúc buổi sáng an lành!',
      'Sân Chùa Rắn rộng lớn đẹp quá',
      'Con đi lễ Phật và tụng kinh đây',
      'Thắng đời 1:0 hẹ hẹ hẹ',
    ];
    for (const s of ok) {
      const r = validateChatText(s);
      expect(r.ok, s).toBe(true);
    }
  });

  it('kiểm tra độ dài 1–100 ký tự và chuẩn hoá khoảng trắng', () => {
    expect(validateChatText('')).toEqual({ ok: false, error: 'Vui lòng nhập lời nhắn.' });
    expect(validateChatText('   \n\t  ').ok).toBe(false);
    expect(validateChatText(null).ok).toBe(false);
    const trimmed = validateChatText('  Xin   chào \n mọi người  ');
    expect(trimmed).toEqual({ ok: true, text: 'Xin chào mọi người' });
    expect(validateChatText('a'.repeat(100)).ok).toBe(true);
    expect(validateChatText('a'.repeat(101)).ok).toBe(false);
  });

  it('chặn từ thô tục, liên kết và quảng cáo', () => {
    const rev = (s: string) => [...s].reverse().join('');
    for (const bad of [rev('lcv'), rev('tid'), rev('tav cus'), rev('nol iav')]) {
      const r = validateChatText(`ê ${bad}!`);
      expect(r.ok, bad).toBe(false);
    }
    for (const spam of ['https://example.com', 'www.abc.vn', 'kết bạn zalo 0909', 'vào casino nhận thưởng']) {
      const r = validateChatText(spam);
      expect(r.ok, spam).toBe(false);
    }
  });
});
