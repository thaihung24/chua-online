/**
 * Kiểm thử toàn diện phần C2:
 *  - Kinh văn (`kinh.ts`), Quẻ (`que.ts`), Lời dạy & lời nhắc (`teachings.ts`)
 *  - Phụ kiện khớp W2 (`wardrobe.ts`), Pháp thoại, Câu chào, Hoa đăng, Tràng hạt
 *  - 27 trang SEO (`pages.ts`) + liên kết chéo + đầu ra `scripts/build-seo.ts` + tài sản `public/`
 */
import { afterAll, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { SUTRAS, DEDICATION, SESSION_PLAN, getSutra } from '@/content/kinh';
import { QUE_LIST, drawQue } from '@/content/que';
import { TEACHINGS, REMINDERS, teachingOfDay, reminderFor } from '@/content/teachings';
import { ACCESSORIES, getAccessory } from '@/content/wardrobe';
import { PHRASES, PHRASE_GROUPS, phraseText } from '@/content/phrases';
import { DHARMA } from '@/content/dharma';
import { LANTERN_COLORS, LANTERN_INTENTS } from '@/content/lantern';
import { BEAD_PHRASES } from '@/content/beads';
import { PAGES, getPage } from '@/content/pages';
import { ACCESSORY_IDS } from '@/world/avatar/accessories';
import { buildSeo } from '../scripts/build-seo';

const EXPECTED_SUTRA_IDS = [
  'ke-khai-kinh',
  'tam-tu-quy',
  'ke-sam-hoi',
  'bat-nha-tam-kinh',
  'kinh-a-di-da',
  'pham-pho-mon',
  'kinh-bat-dai-nhan-giac',
  'kinh-vu-lan',
  'chu-dai-bi',
  'vang-sanh-than-chu',
  'niem-phat',
  'niem-dia-tang-vuong-bo-tat',
  'tu-hoang-the-nguyen',
  'ke-hoi-huong',
];

const EXPECTED_PAGE_SLUGS = [
  'gioi-thieu',
  'huong-dan-di-chua-online',
  'hoi-dap',
  'niem-phat-online',
  'thien-online',
  'thap-huong-online',
  'noi-quy',
  'go-mo-online',
  'xin-que-online',
  'phap-thoai',
  'lich-am',
  'ngay-ram-mung-mot',
  'ngay-le-phat-giao',
  'cach-le-phat-tai-nha',
  'cach-niem-phat',
  'y-nghia-tung-kinh',
  'thien-cho-nguoi-moi',
  'le-vu-lan',
  'phat-dan',
  'tha-den-hoa-dang',
  'cay-bo-de',
  'quan-the-am-bo-tat',
  'di-chua-ram-mung-mot',
  'ngoi-thien-ngoai-troi',
  'di-chua-dau-nam',
  'chinh-sach-quyen-rieng-tu',
  'dieu-khoan-su-dung',
];

const wordCount = (s: string): number => s.trim().split(/\s+/).filter(Boolean).length;

describe('kinh.ts — kinh văn, chú & kệ nguyện', () => {
  it('có đủ 14 bài kinh với id duy nhất, khớp danh sách thiết kế', () => {
    const ids = SUTRAS.map((s) => s.id);
    expect(new Set(ids).size).toBe(SUTRAS.length);
    expect(ids).toEqual(expect.arrayContaining(EXPECTED_SUTRA_IDS));
    expect(SUTRAS.length).toBe(EXPECTED_SUTRA_IDS.length);

    for (const s of SUTRAS) {
      expect(s.slug).toBe(s.id);
      expect(s.title.trim().length).toBeGreaterThan(2);
      expect(s.subtitle.trim().length).toBeGreaterThan(2);
      expect(s.blurb.trim().length).toBeGreaterThan(10);
      expect(s.source.trim().length).toBeGreaterThan(15);
      expect(s.minutes).toBeGreaterThanOrEqual(1);
      expect(['Thời khóa', 'Chú', 'Kệ & sám nguyện']).toContain(s.group);
      expect(getSutra(s.id)).toBe(s);
    }
    expect(getSutra('khong-ton-tai')).toBeUndefined();
  });

  it('mọi câu kinh đều không rỗng và tối đa 18 chữ để gõ mõ thuận lợi', () => {
    for (const s of SUTRAS) {
      expect(s.lines.length).toBeGreaterThanOrEqual(4);
      for (const line of s.lines) {
        expect(line.trim().length).toBeGreaterThan(0);
        expect(wordCount(line)).toBeLessThanOrEqual(18);
      }
    }
  });

  it('Chú Đại Bi đủ 84 câu, Kệ Hồi Hướng đủ 4 câu và SESSION_PLAN hợp lệ', () => {
    const daiBi = getSutra('chu-dai-bi')!;
    expect(daiBi.lines).toHaveLength(84);
    expect(daiBi.lines[0]).toMatch(/^Nam mô hắc ra đát na đa ra dạ da/i);
    expect(daiBi.lines[83]).toMatch(/Ta bà ha\.?$/i);

    expect(DEDICATION).toHaveLength(4);
    for (const l of DEDICATION) expect(wordCount(l)).toBeLessThanOrEqual(10);

    expect(SESSION_PLAN.length).toBeGreaterThanOrEqual(5);
    for (const id of SESSION_PLAN) {
      expect(getSutra(id), `SESSION_PLAN thiếu bài ${id}`).toBeDefined();
    }
  });
});

describe('que.ts, teachings.ts, wardrobe.ts và các tệp nội dung khác', () => {
  it('QUE_LIST đủ 60 quẻ (1..60), 4 câu thơ mỗi quẻ và drawQue an toàn', () => {
    expect(QUE_LIST).toHaveLength(60);
    const titles = new Set<string>();
    QUE_LIST.forEach((q, idx) => {
      expect(q.no).toBe(idx + 1);
      expect(titles.has(q.title)).toBe(false);
      titles.add(q.title);
      expect(q.poem).toHaveLength(4);
      for (const line of q.poem) expect(line.trim().length).toBeGreaterThan(4);
      expect(q.meaning.trim().length).toBeGreaterThan(15);
      expect(['lành', 'bình', 'nhắc']).toContain(q.tone);
    });
    expect(drawQue(0).no).toBe(1);
    expect(drawQue(60).no).toBe(1);
    expect(drawQue(-7)).toEqual(drawQue(7));
    expect(drawQue(Number.NaN).no).toBe(1);
    expect(drawQue(Number.POSITIVE_INFINITY).no).toBe(1);
  });

  it('TEACHINGS >= 60 và REMINDERS >= 60, hàm rút theo ngày xác định', () => {
    expect(TEACHINGS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(TEACHINGS).size).toBe(TEACHINGS.length);
    for (const t of TEACHINGS) expect(t.trim().length).toBeGreaterThan(15);

    expect(REMINDERS.length).toBeGreaterThanOrEqual(60);
    const remIds = REMINDERS.map((r) => r.id);
    expect(new Set(remIds).size).toBe(REMINDERS.length);
    for (const r of REMINDERS) {
      expect(r.title.trim().length).toBeGreaterThan(2);
      expect(r.text.trim().length).toBeGreaterThan(15);
    }

    expect(teachingOfDay('2026-11-04')).toBe(teachingOfDay('2026-11-04'));
    const r0 = reminderFor('2026-11-04', 0);
    const r1 = reminderFor('2026-11-04', 1);
    expect(r0.id).not.toBe(r1.id);
    expect(reminderFor('2026-11-04', -3).id).toBeTruthy();
    expect(reminderFor('2026-11-04', Number.NaN).id).toBe(r0.id);
  });

  it('ACCESSORIES khớp chính xác 7 id phụ kiện của W2', () => {
    expect(ACCESSORIES).toHaveLength(7);
    const ids = ACCESSORIES.map((a) => a.id).sort();
    expect(ids).toEqual([...ACCESSORY_IDS].sort());
    for (const a of ACCESSORIES) {
      expect(['hat', 'neck', 'hand', 'back']).toContain(a.kind);
      expect(a.minLevel).toBeGreaterThanOrEqual(1);
      expect(a.name.trim().length).toBeGreaterThan(2);
      expect(a.desc.trim().length).toBeGreaterThan(10);
      expect(getAccessory(a.id)).toBe(a);
    }
  });

  it('PHRASES, DHARMA, LANTERN và BEAD_PHRASES hợp lệ', () => {
    expect(PHRASES.length).toBeGreaterThanOrEqual(36);
    expect(new Set(PHRASES.map((p) => p.id)).size).toBe(PHRASES.length);
    for (const p of PHRASES) {
      expect(PHRASE_GROUPS).toContain(p.group as (typeof PHRASE_GROUPS)[number]);
      expect(phraseText(p.id)).toBe(p.text);
    }

    expect(DHARMA.length).toBeGreaterThanOrEqual(12);
    expect(new Set(DHARMA.map((d) => d.id)).size).toBe(DHARMA.length);
    for (const d of DHARMA) {
      expect(d.url).toMatch(/^https:\/\/www\.youtube\.com\/(results\?search_query=|@)/);
      expect(d.url).not.toContain('watch?v=');
    }

    expect(LANTERN_COLORS).toHaveLength(6);
    for (const c of LANTERN_COLORS) expect(c.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(LANTERN_INTENTS).toHaveLength(6);
    expect(BEAD_PHRASES.length).toBeGreaterThanOrEqual(4);
  });
});

describe('pages.ts — 27 trang tĩnh và liên kết nội bộ', () => {
  it('đủ 27 slug, mỗi trang >= 250 chữ, mọi liên kết related và inline đều hợp lệ', () => {
    const slugs = PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(PAGES.length);
    expect(slugs).toEqual(expect.arrayContaining(EXPECTED_PAGE_SLUGS));
    expect(PAGES).toHaveLength(EXPECTED_PAGE_SLUGS.length);

    const validTargets = new Set<string>([
      '/',
      'kinh',
      ...slugs,
      ...SUTRAS.map((s) => `kinh/${s.slug}`),
    ]);

    const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;

    for (const p of PAGES) {
      expect(getPage(p.slug)).toBe(p);
      const allText = [
        p.h1,
        ...p.sections.flatMap((s) => [s.h2 ?? '', ...s.p, ...(s.list ?? [])]),
        ...(p.faq ?? []).flatMap((f) => [f.q, f.a]),
      ].join(' ');
      expect(wordCount(allText), `Trang ${p.slug} quá ngắn`).toBeGreaterThanOrEqual(250);

      expect(p.related.length).toBeGreaterThanOrEqual(3);
      for (const rel of p.related) {
        expect(rel).not.toBe(p.slug);
        expect(validTargets.has(rel), `related không hợp lệ ở ${p.slug}: ${rel}`).toBe(true);
      }

      for (const m of allText.matchAll(linkRe)) {
        const target = m[2]!;
        expect(validTargets.has(target), `inline link không hợp lệ ở ${p.slug}: ${target}`).toBe(true);
      }
    }

    const intro = getPage('gioi-thieu')!;
    const introBody = intro.sections.flatMap((s) => s.p).join(' ');
    expect(introBody).toContain('không phải là một ngôi chùa thật');

    const faqPage = getPage('hoi-dap')!;
    expect((faqPage.faq ?? []).length).toBeGreaterThanOrEqual(8);
  });
});

describe('public/ và scripts/build-seo.ts', () => {
  let tmpDist = '';
  afterAll(async () => {
    if (tmpDist) await fs.rm(tmpDist, { recursive: true, force: true });
  });

  it('tài sản trong public/ tồn tại và đúng định dạng', async () => {
    const pub = path.resolve(process.cwd(), 'public');
    const required = [
      'favicon.svg',
      'manifest.webmanifest',
      'og.png',
      'og-chua-ran.png',
      'robots.txt',
      'offline.html',
      'sw.js',
      'icons/icon-192.png',
      'icons/icon-512.png',
      'icons/maskable-512.png',
      'icons/apple-touch-icon.png',
    ];
    for (const rel of required) {
      const st = await fs.stat(path.join(pub, rel));
      expect(st.size, `Tệp rỗng: public/${rel}`).toBeGreaterThan(50);
    }
    const manifest = JSON.parse(await fs.readFile(path.join(pub, 'manifest.webmanifest'), 'utf-8'));
    expect(manifest.name).toBe('Chùa Rắn');
    expect(manifest.display).toBe('standalone');
    expect(manifest.background_color).toBe('#140d08');
    expect(manifest.lang).toBe('vi');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);

    const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    for (const img of ['og.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png']) {
      const buf = await fs.readFile(path.join(pub, img));
      expect(buf.subarray(0, 4).equals(pngSig), `PNG sai chữ ký: ${img}`).toBe(true);
    }
  });

  it('buildSeo sinh đủ 42 trang HTML chuẩn CSP, JSON-LD hợp lệ, lịch âm 42 ô và sitemap khớp', async () => {
    tmpDist = await fs.mkdtemp(path.join(os.tmpdir(), 'chua-seo-test-'));
    const res = await buildSeo({
      distDir: tmpDist,
      siteUrl: 'https://chualienhoa.vn',
      now: new Date('2026-11-04T08:00:00Z'),
      quiet: true,
    });

    // 1 trang chủ + 27 trang nội dung + 1 mục lục kinh + 14 bài kinh = 43 URL trong sitemap
    expect(res.urls).toHaveLength(1 + PAGES.length + 1 + SUTRAS.length);

    const sitemap = await fs.readFile(path.join(tmpDist, 'sitemap.xml'), 'utf-8');
    for (const u of res.urls) {
      expect(sitemap).toContain(`<loc>https://chualienhoa.vn${u}</loc>`);
    }
    const robots = await fs.readFile(path.join(tmpDist, 'robots.txt'), 'utf-8');
    expect(robots).toContain('Sitemap: https://chualienhoa.vn/sitemap.xml');

    // Kiểm tra mọi trang HTML đã sinh
    const htmlPaths = [
      ...PAGES.map((p) => path.join(tmpDist, p.slug, 'index.html')),
      path.join(tmpDist, 'kinh', 'index.html'),
      ...SUTRAS.map((s) => path.join(tmpDist, 'kinh', s.slug, 'index.html')),
    ];

    for (const file of htmlPaths) {
      const html = await fs.readFile(file, 'utf-8');
      expect(html).toContain('<link rel="stylesheet" href="/seo.css" />');
      expect(html).toContain('không phải chùa thật');
      // Không được còn cú pháp markdown [text](slug) chưa chuyển đổi
      expect(html).not.toMatch(/\[[^\]]+\]\([a-z0-9/-]+\)/);
      // Tuân thủ CSP `script-src 'self'`: mọi thẻ <script> chỉ được là application/ld+json hoặc có src="/..."
      const scriptTags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
      expect(scriptTags.length).toBeGreaterThanOrEqual(1);
      for (const [, attrs, inner] of scriptTags) {
        if (attrs!.includes('application/ld+json')) {
          const parsed = JSON.parse(inner!);
          expect(parsed['@context']).toBe('https://schema.org');
        } else {
          expect(attrs).toMatch(/\bsrc="\/[^"]+\.js"/);
          expect(inner!.trim()).toBe('');
        }
      }
      // Không dùng inline event handler vi phạm CSP
      expect(html).not.toMatch(/\son[a-z]+\s*=/i);
    }

    // Kiểm tra riêng /hoi-dap/ có FAQPage JSON-LD
    const hoiDapHtml = await fs.readFile(path.join(tmpDist, 'hoi-dap', 'index.html'), 'utf-8');
    expect(hoiDapHtml).toContain('"@type":"FAQPage"');

    // Kiểm tra riêng /lich-am/ có 42 ô lịch dựng sẵn + script ngoài
    const lichAmHtml = await fs.readFile(path.join(tmpDist, 'lich-am', 'index.html'), 'utf-8');
    expect(lichAmHtml).toContain('<script src="/seo-lich-am.js" defer></script>');
    expect([...lichAmHtml.matchAll(/class="cal-cell\b/g)]).toHaveLength(42);

    // Kiểm tra riêng trang kinh có nút tụng kèm mõ và đủ số câu
    const tamKinh = getSutra('bat-nha-tam-kinh')!;
    const tamKinhHtml = await fs.readFile(path.join(tmpDist, 'kinh', 'bat-nha-tam-kinh', 'index.html'), 'utf-8');
    expect(tamKinhHtml).toContain('href="/?kinh=bat-nha-tam-kinh"');
    expect([...tamKinhHtml.matchAll(/class="sutra-line"/g)]).toHaveLength(tamKinh.lines.length);
  });
});
