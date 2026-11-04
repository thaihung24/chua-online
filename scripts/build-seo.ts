/**
 * Sinh toàn bộ trang tĩnh SEO vào `dist/`:
 *  - 27 trang hướng dẫn / thông tin từ `src/content/pages.ts` (`dist/<slug>/index.html`)
 *  - Mục lục kinh văn (`dist/kinh/index.html`) + 14 trang toàn văn kinh (`dist/kinh/<slug>/index.html`)
 *  - Lịch âm tháng hiện tại dựng sẵn bằng `@/core/lunar` kèm `/seo-lich-am.js` để chuyển tháng
 *  - Stylesheet dùng chung `dist/seo.css` (tuân thủ CSP `script-src 'self'`, không dùng inline JS)
 *  - `dist/sitemap.xml` và `dist/robots.txt`
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DEDICATION, SESSION_PLAN, SUTRAS, getSutra, type Sutra } from '@/content/kinh';
import { PAGES, getPage, type Page, type PageFaq } from '@/content/pages';
import { DHARMA, type DharmaTalk } from '@/content/dharma';
import { lunarLabel, monthGrid, nextSpecial, solarToLunar, specialDays, todayVN } from '@/core/lunar';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

export interface BuildSeoOptions {
  distDir?: string;
  siteUrl?: string;
  now?: Date;
  quiet?: boolean;
}

export interface BuildSeoResult {
  distDir: string;
  siteUrl: string;
  urls: string[];
  filesWritten: number;
}

const LOTUS_LOGO_SVG = `<svg viewBox="0 0 128 128" width="34" height="34" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="seoGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff0c2"/>
      <stop offset="52%" stop-color="#e5b861"/>
      <stop offset="100%" stop-color="#b67d2b"/>
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="60" fill="#1d130b" stroke="url(#seoGold)" stroke-width="3" stroke-opacity="0.65"/>
  <g stroke="url(#seoGold)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="rgba(243,201,115,0.22)">
    <path d="M58 88 C32 91 15 82 12 65 C27 59 45 66 58 88 Z"/>
    <path d="M70 88 C96 91 113 82 116 65 C101 59 83 66 70 88 Z"/>
    <path d="M62 88 C37 85 24 67 30 39 C47 45 58 63 62 88 Z"/>
    <path d="M66 88 C91 85 104 67 98 39 C81 45 70 63 66 88 Z"/>
    <path d="M64 20 C80 40 81 64 64 88 C47 64 48 40 64 20 Z" fill="rgba(251,227,162,0.36)"/>
  </g>
  <path d="M32 97 Q64 106 96 97" fill="none" stroke="url(#seoGold)" stroke-width="3" stroke-linecap="round"/>
</svg>`;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveSlugHref(target: string): string {
  const t = target.trim();
  if (t === '/' || t === '') return '/';
  if (t.startsWith('/')) return t.endsWith('/') || t.includes('?') ? t : `${t}/`;
  return `/${t.replace(/^\/+|\/+$/g, '')}/`;
}

/** Chuyển cú pháp `[nhãn](đích)` trong văn bản đã thoát HTML thành thẻ `<a>` nội bộ an toàn. */
export function renderRichText(raw: string): string {
  const escaped = esc(raw);
  return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, target: string) => {
    const href = resolveSlugHref(target);
    return `<a href="${esc(href)}">${label}</a>`;
  });
}

function stripLinks(raw: string): string {
  return raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

function jsonLdTag(data: unknown): string {
  const safe = JSON.stringify(data).replace(/<\//g, '<\\/');
  return `<script type="application/ld+json">${safe}</script>`;
}

interface Crumb {
  name: string;
  path: string;
}

interface LayoutOpts {
  siteUrl: string;
  canonicalPath: string;
  title: string;
  description: string;
  h1: string;
  eyebrow?: string;
  lead?: string;
  updated?: string;
  crumbs: Crumb[];
  activeNav?: string;
  heroActionHtml?: string;
  bodyHtml: string;
  faq?: PageFaq[];
  relatedHtml?: string;
  extraScripts?: string[];
  schemaType?: 'Article' | 'CollectionPage';
}

const NAV_ITEMS: { href: string; label: string; key: string }[] = [
  { href: '/gioi-thieu/', label: 'Giới thiệu', key: 'gioi-thieu' },
  { href: '/huong-dan-di-chua-online/', label: 'Hướng dẫn', key: 'huong-dan' },
  { href: '/kinh/', label: 'Kinh văn', key: 'kinh' },
  { href: '/lich-am/', label: 'Lịch âm', key: 'lich-am' },
  { href: '/phap-thoai/', label: 'Pháp thoại', key: 'phap-thoai' },
  { href: '/hoi-dap/', label: 'Hỏi đáp', key: 'hoi-dap' },
];

function renderFaqHtml(faq?: PageFaq[]): string {
  if (!faq?.length) return '';
  const items = faq
    .map(
      (f, idx) => `<details class="seo-faq__item"${idx === 0 ? ' open' : ''}>
        <summary class="seo-faq__q"><span>${esc(stripLinks(f.q))}</span><span class="seo-faq__chev" aria-hidden="true"></span></summary>
        <div class="seo-faq__a"><p>${renderRichText(f.a)}</p></div>
      </details>`,
    )
    .join('\n');
  return `<section class="seo-section seo-faq" aria-labelledby="faq-heading">
    <h2 id="faq-heading" class="seo-h2">Câu hỏi thường gặp</h2>
    <div class="seo-faq__list">${items}</div>
  </section>`;
}

function renderRelatedCards(slugs: string[]): string {
  if (!slugs.length) return '';
  const cards: string[] = [];
  for (const s of slugs) {
    if (s === 'kinh') {
      cards.push(`<a class="seo-rel-card" href="/kinh/">
        <span class="seo-rel-card__tag">Kinh văn</span>
        <strong class="seo-rel-card__title">Mục lục Kinh văn &amp; Thời khóa</strong>
        <span class="seo-rel-card__desc">Tổng hợp 14 bài kinh, thần chú và kệ nguyện phổ biến kèm chế độ gõ mõ từng chữ.</span>
      </a>`);
      continue;
    }
    if (s.startsWith('kinh/')) {
      const sutra = getSutra(s.slice(5));
      if (sutra) {
        cards.push(`<a class="seo-rel-card" href="/kinh/${esc(sutra.slug)}/">
          <span class="seo-rel-card__tag">${esc(sutra.group)} · ${sutra.minutes} phút</span>
          <strong class="seo-rel-card__title">${esc(sutra.title)}</strong>
          <span class="seo-rel-card__desc">${esc(sutra.blurb)}</span>
        </a>`);
      }
      continue;
    }
    const p = getPage(s);
    if (p) {
      cards.push(`<a class="seo-rel-card" href="/${esc(p.slug)}/">
        <span class="seo-rel-card__tag">Bài viết hướng dẫn</span>
        <strong class="seo-rel-card__title">${esc(p.h1)}</strong>
        <span class="seo-rel-card__desc">${esc(p.description)}</span>
      </a>`);
    }
  }
  if (!cards.length) return '';
  return `<section class="seo-section seo-related" aria-labelledby="related-heading">
    <h2 id="related-heading" class="seo-h2">Đọc tiếp chủ đề liên quan</h2>
    <div class="seo-rel-grid">${cards.join('\n')}</div>
  </section>`;
}

function renderLayout(opts: LayoutOpts): string {
  const canonical = `${opts.siteUrl}${opts.canonicalPath}`;
  const ogImage = `${opts.siteUrl}/og.png`;
  const updated = opts.updated ?? '2026-11-01';

  const graph: Record<string, unknown>[] = [
    {
      '@type': opts.schemaType ?? 'Article',
      headline: opts.h1,
      name: opts.title,
      description: opts.description,
      inLanguage: 'vi-VN',
      mainEntityOfPage: canonical,
      url: canonical,
      image: ogImage,
      datePublished: updated,
      dateModified: updated,
      author: { '@type': 'Organization', name: 'Chùa Liên Hoa', url: opts.siteUrl },
      publisher: {
        '@type': 'Organization',
        name: 'Chùa Liên Hoa',
        url: opts.siteUrl,
        logo: { '@type': 'ImageObject', url: `${opts.siteUrl}/icons/icon-512.png` },
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: opts.crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: `${opts.siteUrl}${c.path}`,
      })),
    },
  ];

  if (opts.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: opts.faq.map((f) => ({
        '@type': 'Question',
        name: stripLinks(f.q),
        acceptedAnswer: {
          '@type': 'Answer',
          text: stripLinks(f.a),
        },
      })),
    });
  }

  const navHtml = NAV_ITEMS.map((item) => {
    const active = item.key === opts.activeNav ? ' aria-current="page" class="seo-nav__link is-active"' : ' class="seo-nav__link"';
    return `<a href="${item.href}"${active}>${esc(item.label)}</a>`;
  }).join('');

  const crumbHtml = opts.crumbs
    .map((c, idx) => {
      const last = idx === opts.crumbs.length - 1;
      if (last) return `<li aria-current="page"><span>${esc(c.name)}</span></li>`;
      return `<li><a href="${esc(c.path)}">${esc(c.name)}</a></li>`;
    })
    .join('');

  const scriptsHtml = (opts.extraScripts ?? []).map((src) => `<script src="${esc(src)}" defer></script>`).join('\n    ');

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(opts.title)}</title>
    <meta name="description" content="${esc(opts.description)}" />
    <meta name="theme-color" content="#140d08" />
    <meta name="color-scheme" content="dark" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${esc(canonical)}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Chùa Liên Hoa" />
    <meta property="og:locale" content="vi_VN" />
    <meta property="og:title" content="${esc(opts.title)}" />
    <meta property="og:description" content="${esc(opts.description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(opts.title)}" />
    <meta name="twitter:description" content="${esc(opts.description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />

    <link rel="stylesheet" href="/seo.css" />
    ${jsonLdTag({ '@context': 'https://schema.org', '@graph': graph })}
    ${scriptsHtml}
  </head>
  <body>
    <a class="seo-skip" href="#noi-dung">Chuyển tới nội dung chính</a>
    <header class="seo-header">
      <div class="seo-header__inner">
        <div class="seo-header__top">
          <a class="seo-brand" href="/" aria-label="Chùa Liên Hoa — Trang chủ chùa 3D">
            ${LOTUS_LOGO_SVG}
            <span class="seo-brand__text">
              <strong>Chùa Liên Hoa</strong>
              <small>Không gian tịnh tâm 3D</small>
            </span>
          </a>
          <a class="seo-cta-btn" href="/">Vào chùa 3D <span aria-hidden="true">→</span></a>
        </div>
        <nav class="seo-nav" aria-label="Điều hướng chuyên mục">${navHtml}</nav>
      </div>
    </header>

    <main id="noi-dung" class="seo-main">
      <nav class="seo-breadcrumb" aria-label="Đường dẫn trang">
        <ol>${crumbHtml}</ol>
      </nav>

      <article class="seo-article">
        <header class="seo-hero">
          ${opts.eyebrow ? `<p class="seo-eyebrow">${esc(opts.eyebrow)}</p>` : ''}
          <h1 class="seo-h1">${esc(opts.h1)}</h1>
          ${opts.lead ? `<p class="seo-lead">${esc(opts.lead)}</p>` : ''}
          ${opts.heroActionHtml ?? ''}
        </header>

        <div class="seo-divider" aria-hidden="true"><span>✦</span></div>

        <div class="seo-prose">
          ${opts.bodyHtml}
        </div>

        ${renderFaqHtml(opts.faq)}

        <aside class="seo-banner" aria-label="Trải nghiệm khuôn viên chùa 3D">
          <div class="seo-banner__body">
            <strong>Ghé thăm khuôn viên Chùa Liên Hoa 3D</strong>
            <p>Thắp nén hương tâm, lần tràng hạt, gõ mõ tụng kinh và ngồi thiền yên tĩnh ngay trên trình duyệt — hoàn toàn miễn phí.</p>
          </div>
          <a class="seo-cta-btn seo-cta-btn--lg" href="/">Mở cổng chùa <span aria-hidden="true">→</span></a>
        </aside>

        ${opts.relatedHtml ?? ''}
      </article>
    </main>

    <footer class="seo-footer">
      <div class="seo-footer__inner">
        <div class="seo-footer__brand">
          <div class="seo-footer__title">${LOTUS_LOGO_SVG}<span>Chùa Liên Hoa</span></div>
          <p class="seo-footer__disclaimer">
            Chùa Liên Hoa là dự án phần mềm độc lập mô phỏng không gian tịnh tâm trực tuyến — <strong>không phải chùa thật</strong>, không đại diện hay trực thuộc bất kỳ tổ chức tôn giáo nào, và không nhận cúng dường hay quyên góp dưới mọi hình thức.
          </p>
        </div>
        <nav class="seo-footer__links" aria-label="Liên kết cuối trang">
          <div>
            <strong>Thực hành</strong>
            <a href="/kinh/">Mục lục Kinh văn</a>
            <a href="/niem-phat-online/">Niệm Phật online</a>
            <a href="/thien-online/">Ngồi thiền online</a>
            <a href="/lich-am/">Lịch âm &amp; ngày lễ</a>
          </div>
          <div>
            <strong>Thông tin</strong>
            <a href="/gioi-thieu/">Giới thiệu dự án</a>
            <a href="/huong-dan-di-chua-online/">Hướng dẫn sử dụng</a>
            <a href="/hoi-dap/">Câu hỏi thường gặp</a>
            <a href="/noi-quy/">Nội quy cộng đồng</a>
          </div>
          <div>
            <strong>Pháp lý</strong>
            <a href="/chinh-sach-quyen-rieng-tu/">Chính sách quyền riêng tư</a>
            <a href="/dieu-khoan-su-dung/">Điều khoản sử dụng</a>
          </div>
        </nav>
      </div>
    </footer>
  </body>
</html>
`;
}

function renderPageSections(page: Page): string {
  return page.sections
    .map((sec) => {
      const h2 = sec.h2 ? `<h2 class="seo-h2">${esc(sec.h2)}</h2>\n` : '';
      const paras = sec.p.map((para) => `<p>${renderRichText(para)}</p>`).join('\n');
      const list = sec.list?.length
        ? `<ul class="seo-list">${sec.list.map((li) => `<li>${renderRichText(li)}</li>`).join('')}</ul>`
        : '';
      return `<section class="seo-section">${h2}${paras}${list}</section>`;
    })
    .join('\n');
}

const WEEKDAYS_HEADER = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const WEEKDAY_NAMES = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

function renderLichAmWidget(now: Date): string {
  const today = todayVN(now);
  const todayLunar = solarToLunar(today.y, today.m, today.d);
  const todaySpecs = specialDays(todayLunar);
  const next = nextSpecial(now);
  const cells = monthGrid(today.y, today.m);

  const monthSpecs = cells.filter((c) => c.inMonth && c.specials.length > 0);
  const pad2 = (n: number) => String(n).padStart(2, '0');

  const gridHtml = cells
    .map((c) => {
      const isToday = c.y === today.y && c.m === today.m && c.d === today.d;
      const hasFestival = c.specials.some((s) => s.kind === 'festival');
      const hasRam = c.specials.some((s) => s.kind === 'ram');
      const hasMung1 = c.specials.some((s) => s.kind === 'mung1');
      const cls = [
        'cal-cell',
        c.inMonth ? '' : 'is-out',
        isToday ? 'is-today' : '',
        hasFestival ? 'is-festival' : hasRam ? 'is-ram' : hasMung1 ? 'is-mung1' : '',
      ]
        .filter(Boolean)
        .join(' ');
      const lunarDayText = c.lunar.day === 1 || c.d === 1 ? `${c.lunar.day}/${c.lunar.month}${c.lunar.leap ? 'n' : ''}` : String(c.lunar.day);
      const badge = c.specials[0] ? `<span class="cal-cell__badge">${esc(c.specials[0].label)}</span>` : '';
      return `<button type="button" class="${cls}" data-y="${c.y}" data-m="${c.m}" data-d="${c.d}" aria-label="Dương lịch ${c.d}/${c.m}/${c.y}, Âm lịch ${c.lunar.day}/${c.lunar.month}">
        <span class="cal-cell__solar">${c.d}</span>
        <span class="cal-cell__lunar">${esc(lunarDayText)}</span>
        ${badge}
      </button>`;
    })
    .join('\n');

  const eventsHtml = monthSpecs.length
    ? monthSpecs
        .map(
          (c) => `<li class="cal-event">
          <span class="cal-event__date">${pad2(c.d)}/${pad2(c.m)}</span>
          <span class="cal-event__body">
            <strong>${esc(c.specials.map((s) => s.label).join(' · '))}</strong>
            <small>Âm lịch: ${c.lunar.day}/${c.lunar.month}${c.lunar.leap ? ' (nhuận)' : ''} · Ngày ${esc(c.lunar.canChi.day)}</small>
          </span>
        </li>`,
        )
        .join('\n')
    : '<li class="cal-event"><span>Không có ngày lễ đặc biệt trong tháng này.</span></li>';

  const nextWhen = next.inDays === 0 ? 'Ngay hôm nay' : next.inDays === 1 ? 'Ngày mai' : `Còn ${next.inDays} ngày (${pad2(next.d)}/${pad2(next.m)}/${next.y})`;

  return `<section class="seo-section cal-wrap" id="lich-am-app" data-init-y="${today.y}" data-init-m="${today.m}">
    <div class="cal-today" id="calTodayCard">
      <div class="cal-today__main">
        <span class="cal-today__eyebrow" id="calTodayHeading">${esc(WEEKDAY_NAMES[today.weekday] ?? '')} · ${pad2(today.d)}/${pad2(today.m)}/${today.y} (Dương lịch)</span>
        <strong class="cal-today__lunar" id="calTodayLunar">${esc(lunarLabel(todayLunar))}</strong>
        <p class="cal-today__canchi" id="calTodayCanChi">Ngày ${esc(todayLunar.canChi.day)} · Tháng ${esc(todayLunar.canChi.month)} · Năm ${esc(todayLunar.canChi.year)}</p>
        ${
          todaySpecs.length
            ? `<p class="cal-today__special" id="calTodaySpecial">✦ ${esc(todaySpecs.map((s) => s.label).join(' · '))}</p>`
            : `<p class="cal-today__special" id="calTodaySpecial" hidden></p>`
        }
      </div>
      <div class="cal-today__next">
        <span class="cal-today__next-label">Ngày trai / lễ sắp tới</span>
        <strong id="calNextTitle">${esc(next.label)}</strong>
        <span id="calNextDays">${esc(nextWhen)}</span>
      </div>
    </div>

    <div class="cal-box">
      <div class="cal-toolbar">
        <button type="button" class="cal-nav-btn" id="calPrevBtn" aria-label="Tháng trước">← Tháng trước</button>
        <div class="cal-toolbar__center">
          <h2 class="cal-month-title" id="calMonthTitle">Tháng ${today.m} năm ${today.y}</h2>
          <button type="button" class="cal-today-btn" id="calGoTodayBtn">Về hôm nay</button>
        </div>
        <button type="button" class="cal-nav-btn" id="calNextBtn" aria-label="Tháng sau">Tháng sau →</button>
      </div>

      <div class="cal-weekdays" aria-hidden="true">
        ${WEEKDAYS_HEADER.map((w) => `<span>${w}</span>`).join('')}
      </div>

      <div class="cal-grid" id="calGrid" role="grid" aria-label="Lưới lịch âm dương tháng ${today.m}/${today.y}">
        ${gridHtml}
      </div>

      <div class="cal-legend">
        <span><i class="cal-dot cal-dot--today"></i> Hôm nay</span>
        <span><i class="cal-dot cal-dot--festival"></i> Lễ Phật giáo / Tết</span>
        <span><i class="cal-dot cal-dot--ram"></i> Ngày Rằm (15 âm)</span>
        <span><i class="cal-dot cal-dot--mung1"></i> Mùng một (1 âm)</span>
      </div>

      <div class="cal-detail" id="calDetail" aria-live="polite">
        Chạm vào một ô ngày bất kỳ trên lịch để đối chiếu chi tiết Âm – Dương và Can – Chi của ngày đó.
      </div>
    </div>

    <div class="cal-events-wrap">
      <h3 class="seo-h3" id="calEventsHeading">Ngày Rằm, Mùng một &amp; Lễ Phật giáo trong tháng ${today.m}/${today.y}</h3>
      <ul class="cal-events" id="calEventsList">${eventsHtml}</ul>
    </div>
  </section>`;
}

function renderDharmaDirectory(): string {
  const groups: DharmaTalk['group'][] = ['Cho người mới', 'Đời sống', 'Tịnh độ', 'Thiền'];
  const blocks = groups
    .map((g) => {
      const items = DHARMA.filter((d) => d.group === g);
      if (!items.length) return '';
      const cards = items
        .map(
          (d) => `<a class="seo-talk-card" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">
          <div class="seo-talk-card__head">
            <strong>${esc(d.title)}</strong>
            <span class="seo-chip">~${d.minutes} phút</span>
          </div>
          <p>${esc(d.desc)}</p>
          <span class="seo-talk-card__meta">${esc(d.speaker)} · Mở tìm kiếm trên YouTube ↗</span>
        </a>`,
        )
        .join('\n');
      return `<div class="seo-talk-group">
        <h3 class="seo-h3">${esc(g)}</h3>
        <div class="seo-talk-grid">${cards}</div>
      </div>`;
    })
    .join('\n');
  return `<section class="seo-section" aria-labelledby="dharma-list-heading">
    <h2 id="dharma-list-heading" class="seo-h2">Chủ đề pháp thoại gợi ý theo nhóm</h2>
    <p class="seo-muted">Các đường dẫn dưới đây mở trang kết quả tìm kiếm trên YouTube để bạn tự chọn bài giảng và vị giảng sư phù hợp.</p>
    ${blocks}
  </section>`;
}

function renderKinhIndex(siteUrl: string): string {
  const groups: Sutra['group'][] = ['Thời khóa', 'Chú', 'Kệ & sám nguyện'];
  const planSutras = SESSION_PLAN.map((id) => getSutra(id)).filter((s): s is Sutra => !!s);
  const totalPlanMins = planSutras.reduce((acc, s) => acc + s.minutes, 0);

  const planHtml = `<section class="seo-section seo-plan-box" aria-labelledby="session-plan-heading">
    <div class="seo-plan-box__head">
      <div>
        <span class="seo-eyebrow">Gợi ý hành trì hằng ngày</span>
        <h2 id="session-plan-heading" class="seo-h2">Thời khóa công phu ngắn gọn (~${totalPlanMins} phút)</h2>
      </div>
      <a class="seo-cta-btn" href="/?panel=chant">Mở Thời khóa trong chùa <span aria-hidden="true">→</span></a>
    </div>
    <p>Nếu mới bắt đầu giữ nếp tụng niệm tại nhà, bạn có thể đi theo trình tự bảy phần ngắn gọn dưới đây để mở tâm, trì chú, quán chiếu Bát Nhã, sám hối, quy y và hồi hướng công đức:</p>
    <ol class="seo-plan-steps">
      ${planSutras
        .map(
          (s) => `<li>
          <a href="/kinh/${esc(s.slug)}/"><strong>${esc(s.title)}</strong></a>
          <span>${esc(s.subtitle)} · ${s.minutes} phút</span>
        </li>`,
        )
        .join('\n')}
    </ol>
  </section>`;

  const groupsHtml = groups
    .map((g) => {
      const list = SUTRAS.filter((s) => s.group === g);
      const cards = list
        .map(
          (s) => `<article class="seo-sutra-card">
          <div class="seo-sutra-card__main">
            <div class="seo-sutra-card__badges">
              <span class="seo-chip">${esc(s.group)}</span>
              <span class="seo-chip seo-chip--muted">${s.lines.length} câu · ~${s.minutes} phút</span>
            </div>
            <h3 class="seo-sutra-card__title"><a href="/kinh/${esc(s.slug)}/">${esc(s.title)}</a></h3>
            <p class="seo-sutra-card__sub">${esc(s.subtitle)}</p>
            <p class="seo-sutra-card__blurb">${esc(s.blurb)}</p>
          </div>
          <div class="seo-sutra-card__actions">
            <a class="seo-btn-outline" href="/kinh/${esc(s.slug)}/">Đọc toàn văn</a>
            <a class="seo-cta-btn seo-cta-btn--sm" href="/?kinh=${esc(s.id)}">Tụng kèm mõ →</a>
          </div>
        </article>`,
        )
        .join('\n');
      return `<section class="seo-section" aria-label="${esc(g)}">
        <h2 class="seo-h2">${esc(g)}</h2>
        <div class="seo-sutra-list">${cards}</div>
      </section>`;
    })
    .join('\n');

  const dedicationHtml = `<section class="seo-section">
    <h2 class="seo-h2">Lưu ý về văn bản kinh &amp; Kệ Hồi Hướng</h2>
    <p>Các bài kinh, thần chú và kệ nguyện tại Chùa Liên Hoa thuộc văn bản công cộng, được đối chiếu từ các nghi thức Hán-Việt và bản đọc phổ thông tại Việt Nam. Từng ngôi chùa hoặc truyền thống tu học có thể khác nhau đôi chữ phiên âm; phần ghi chú cuối mỗi bài luôn nêu rõ nguồn và mức độ đối chiếu để bạn tiện tham khảo. Khi cần hành trì chuyên sâu, bạn nên đối chiếu với kinh sách ấn hành chính thức của nhà chùa.</p>
    <p>Sau mỗi thời đọc tụng, người con Phật thường đọc bốn câu Kệ Hồi Hướng để đem phước lành vừa tu tập hướng về khắp pháp giới chúng sanh:</p>
    <blockquote class="seo-dedication">
      ${DEDICATION.map((line) => `<p>${esc(line)}</p>`).join('')}
    </blockquote>
  </section>`;

  return renderLayout({
    siteUrl,
    canonicalPath: '/kinh/',
    title: 'Mục lục Kinh văn Phật giáo & Thời khóa tụng niệm — Chùa Liên Hoa',
    description:
      'Tổng hợp 14 bài kinh, thần chú và kệ sám nguyện phổ biến: Tâm Kinh, Kinh A Di Đà, Phẩm Phổ Môn, Chú Đại Bi 84 câu, Kinh Bát Đại Nhân Giác, kèm chế độ gõ mõ từng chữ.',
    h1: 'Kinh văn & Thời khóa tụng niệm',
    eyebrow: 'Thư viện kinh tụng phổ thông',
    lead: 'Đọc toàn văn có đánh số từng câu để dễ dò nhịp thở, hoặc mở thẳng chế độ gõ mõ từng chữ trong không gian Chùa Liên Hoa 3D.',
    crumbs: [
      { name: 'Chùa Liên Hoa', path: '/' },
      { name: 'Kinh văn', path: '/kinh/' },
    ],
    activeNav: 'kinh',
    schemaType: 'CollectionPage',
    heroActionHtml: `<div class="seo-hero__actions">
      <a class="seo-cta-btn seo-cta-btn--lg" href="/?panel=chant">Vào bàn kinh gõ mõ 3D →</a>
      <a class="seo-btn-outline" href="/y-nghia-tung-kinh/">Tìm hiểu ý nghĩa tụng kinh</a>
    </div>`,
    bodyHtml: `${planHtml}\n${groupsHtml}\n${dedicationHtml}`,
    relatedHtml: renderRelatedCards(['y-nghia-tung-kinh', 'go-mo-online', 'niem-phat-online', 'cach-niem-phat']),
  });
}

function renderSutraPage(sutra: Sutra, idx: number, siteUrl: string): string {
  const prev = idx > 0 ? SUTRAS[idx - 1] : undefined;
  const next = idx < SUTRAS.length - 1 ? SUTRAS[idx + 1] : undefined;
  const peers = SUTRAS.filter((s) => s.id !== sutra.id && s.group === sutra.group).slice(0, 3);

  const linesHtml = sutra.lines
    .map(
      (ln, i) => `<li class="sutra-line" id="cau-${i + 1}">
        <span class="sutra-line__no" aria-hidden="true">${i + 1}</span>
        <span class="sutra-line__text">${esc(ln)}</span>
      </li>`,
    )
    .join('\n');

  const navPeers = `<nav class="sutra-pager" aria-label="Chuyển bài kinh">
    ${
      prev
        ? `<a class="sutra-pager__item" href="/kinh/${esc(prev.slug)}/"><small>← Bài trước</small><strong>${esc(prev.title)}</strong></a>`
        : `<a class="sutra-pager__item" href="/kinh/"><small>← Danh mục</small><strong>Mục lục Kinh văn</strong></a>`
    }
    ${
      next
        ? `<a class="sutra-pager__item sutra-pager__item--next" href="/kinh/${esc(next.slug)}/"><small>Bài tiếp theo →</small><strong>${esc(next.title)}</strong></a>`
        : `<a class="sutra-pager__item sutra-pager__item--next" href="/kinh/"><small>Danh mục →</small><strong>Mục lục Kinh văn</strong></a>`
    }
  </nav>`;

  const bodyHtml = `<section class="seo-section">
      <div class="sutra-meta-bar">
        <span class="seo-chip">${esc(sutra.group)}</span>
        <span class="seo-chip seo-chip--muted">${sutra.lines.length} câu</span>
        <span class="seo-chip seo-chip--muted">Thời lượng tụng ~${sutra.minutes} phút</span>
      </div>
      <p>${esc(sutra.blurb)} Văn bản dưới đây được chia sẵn thành các câu ngắn vừa nhịp hơi thở để bạn thuận tiện đọc thầm, đọc thành tiếng hoặc mở chế độ gõ mõ từng chữ trong chùa.</p>
    </section>

    <section class="seo-section sutra-reader" aria-label="Toàn văn ${esc(sutra.title)}">
      <h2 class="seo-h2">Toàn văn ${esc(sutra.title)}</h2>
      <ol class="sutra-lines">${linesHtml}</ol>
    </section>

    <section class="seo-section sutra-chant-cta">
      <div class="sutra-chant-cta__box">
        <div>
          <strong>Thực hành bài “${esc(sutra.title)}” với tiếng mõ đều nhịp</strong>
          <p>Ứng dụng sẽ tô sáng từng chữ theo nhịp mõ từ 60 đến 120 tiếng/phút và tự động hiển thị Kệ Hồi Hướng khi hoàn tất.</p>
        </div>
        <a class="seo-cta-btn seo-cta-btn--lg" href="/?kinh=${esc(sutra.id)}">Tụng bài này kèm tiếng mõ →</a>
      </div>
    </section>

    <section class="seo-section sutra-source">
      <h2 class="seo-h2">Nguồn văn bản &amp; lưu ý</h2>
      <p>${esc(sutra.source)}</p>
      <p class="seo-muted">Sau khi đọc hoặc tụng xong, bạn có thể chắp tay đọc thầm bốn câu <a href="/kinh/ke-hoi-huong/">Kệ Hồi Hướng</a>: <em>“${esc(DEDICATION.join(' '))}”</em></p>
    </section>

    ${navPeers}`;

  const relatedSlugs = [
    'kinh',
    ...peers.map((p) => `kinh/${p.slug}`),
    'go-mo-online',
    'y-nghia-tung-kinh',
  ];

  return renderLayout({
    siteUrl,
    canonicalPath: `/kinh/${sutra.slug}/`,
    title: `${sutra.title} — Toàn văn & Tụng kinh gõ mõ online | Chùa Liên Hoa`,
    description: `${sutra.title} (${sutra.subtitle}): ${sutra.blurb} Đọc toàn văn ${sutra.lines.length} câu có đánh số hoặc tụng kèm tiếng mõ trực tuyến.`,
    h1: sutra.title,
    eyebrow: `${sutra.group} · Khoảng ${sutra.minutes} phút`,
    lead: sutra.subtitle,
    crumbs: [
      { name: 'Chùa Liên Hoa', path: '/' },
      { name: 'Kinh văn', path: '/kinh/' },
      { name: sutra.title, path: `/kinh/${sutra.slug}/` },
    ],
    activeNav: 'kinh',
    heroActionHtml: `<div class="seo-hero__actions">
      <a class="seo-cta-btn seo-cta-btn--lg" href="/?kinh=${esc(sutra.id)}">Tụng bài này kèm tiếng mõ →</a>
      <a class="seo-btn-outline" href="/kinh/">← Xem mục lục 14 bài kinh</a>
    </div>`,
    bodyHtml,
    relatedHtml: renderRelatedCards(relatedSlugs),
  });
}

// ───────────────────────── CSS dùng chung (dist/seo.css) ─────────────────────────
const SEO_CSS = `/* Giao diện trang tĩnh SEO — bảng màu gỗ trầm, vàng đồng & sơn mài Chùa Liên Hoa */
:root {
  color-scheme: dark;
  --bg: #140d08;
  --bg-elev: #1b120b;
  --surface: #221810;
  --surface-2: #2d2016;
  --border: rgba(236, 200, 140, 0.16);
  --border-strong: rgba(224, 178, 92, 0.36);
  --text: #f5ead9;
  --text-muted: #c2af96;
  --gold: #e0b25c;
  --gold-strong: #f3c973;
  --gold-soft: rgba(224, 178, 92, 0.13);
  --lacquer: #b8372d;
  --jade: #5fb59a;
  --lotus: #eba9bb;
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif;
  --font-serif: 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Noto Serif', Georgia, 'Times New Roman', serif;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --max-w: 840px;
}

*, *::before, *::after { box-sizing: border-box; }

html {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.72;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(90% 420px at 50% 0%, rgba(224, 178, 92, 0.09) 0%, rgba(184, 55, 45, 0.04) 45%, transparent 100%),
    var(--bg);
  display: flex;
  flex-direction: column;
}

a {
  color: var(--gold-strong);
  text-decoration-color: rgba(243, 201, 115, 0.42);
  text-underline-offset: 3px;
}
a:hover { color: #ffe2a4; text-decoration-color: currentColor; }
a:focus-visible, button:focus-visible, summary:focus-visible {
  outline: 2px solid var(--gold-strong);
  outline-offset: 2px;
}

.seo-skip {
  position: absolute;
  left: -9999px;
  top: 8px;
  background: var(--gold-strong);
  color: #1a1007;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 700;
  z-index: 100;
}
.seo-skip:focus { left: 12px; }

/* ── Header dính trên cùng ── */
.seo-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(22, 15, 9, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  padding-top: env(safe-area-inset-top, 0px);
}
.seo-header__inner {
  max-width: 1060px;
  margin: 0 auto;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.seo-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.seo-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
  min-height: 44px;
}
.seo-brand__text { display: flex; flex-direction: column; line-height: 1.18; }
.seo-brand__text strong {
  font-family: var(--font-serif);
  font-size: 1.14rem;
  color: #fbe5b4;
  letter-spacing: 0.01em;
}
.seo-brand__text small { font-size: 0.74rem; color: var(--text-muted); }

.seo-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.seo-nav::-webkit-scrollbar { display: none; }
.seo-nav__link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 6px 12px;
  border-radius: 999px;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.92rem;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.18s ease, color 0.18s ease;
}
.seo-nav__link:hover { color: var(--text); background: rgba(255, 244, 224, 0.06); }
.seo-nav__link.is-active {
  color: #fbe5b4;
  background: var(--gold-soft);
  border: 1px solid rgba(224, 178, 92, 0.28);
}

.seo-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 9px 18px;
  border-radius: 999px;
  background: linear-gradient(180deg, #f6cf7d 0%, #d59e40 100%);
  color: #1c1108 !important;
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
  box-shadow: 0 2px 14px rgba(224, 178, 92, 0.25);
  white-space: nowrap;
  transition: transform 0.16s ease, filter 0.16s ease;
}
.seo-cta-btn:hover { filter: brightness(1.06); transform: translateY(-1px); }
.seo-cta-btn--lg { padding: 12px 24px; font-size: 0.98rem; }
.seo-cta-btn--sm { min-height: 40px; padding: 7px 14px; font-size: 0.86rem; }

.seo-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: rgba(255, 244, 224, 0.04);
  color: #f6e3b4 !important;
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  white-space: nowrap;
}
.seo-btn-outline:hover { background: rgba(224, 178, 92, 0.12); }

@media (max-width: 879px) {
  .seo-header__inner { flex-direction: column; align-items: stretch; gap: 4px; padding: 10px 8px 6px; }
  .seo-header__top { width: 100%; padding: 0 4px; }
  .seo-nav {
    width: 100%;
    justify-content: space-between;
    gap: 0;
    border-top: 1px solid rgba(236, 200, 140, 0.09);
    padding-top: 4px;
  }
  .seo-nav__link {
    padding: 6px 4px;
    font-size: 0.72rem;
  }
}
@media (min-width: 880px) {
  .seo-header__inner { display: grid; grid-template-columns: auto 1fr auto; align-items: center; }
  .seo-header__top { display: contents; }
  .seo-brand { grid-column: 1; grid-row: 1; }
  .seo-nav { grid-column: 2; grid-row: 1; justify-content: center; }
  .seo-header__top .seo-cta-btn { grid-column: 3; grid-row: 1; }
}

/* ── Khung bài viết ── */
.seo-main {
  flex: 1;
  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 20px 18px 56px;
}

.seo-breadcrumb ol {
  list-style: none;
  margin: 0 0 18px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.seo-breadcrumb li + li::before {
  content: '›';
  margin-right: 6px;
  color: rgba(224, 178, 92, 0.6);
}
.seo-breadcrumb a { color: var(--text-muted); text-decoration: none; }
.seo-breadcrumb a:hover { color: var(--gold-strong); }

.seo-hero {
  background: linear-gradient(155deg, rgba(45, 32, 22, 0.85) 0%, rgba(27, 18, 11, 0.92) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: clamp(22px, 4vw, 36px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.36);
}
.seo-eyebrow {
  margin: 0 0 8px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
.seo-h1 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.68rem, 1.35rem + 1.6vw, 2.35rem);
  line-height: 1.24;
  color: #fce8ba;
  font-weight: 700;
}
.seo-lead {
  margin: 12px 0 0;
  font-size: 1.06rem;
  color: var(--text-muted);
  line-height: 1.6;
}
.seo-hero__actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.seo-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 26px 0;
  color: rgba(224, 178, 92, 0.55);
  font-size: 0.9rem;
}
.seo-divider::before, .seo-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(224, 178, 92, 0.28), transparent);
}

.seo-section { margin-bottom: 30px; }
.seo-h2 {
  font-family: var(--font-serif);
  font-size: clamp(1.28rem, 1.15rem + 0.6vw, 1.56rem);
  line-height: 1.34;
  color: #f7dfa8;
  margin: 0 0 12px;
  font-weight: 600;
}
.seo-h3 {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: #f4d89a;
  margin: 0 0 12px;
}
.seo-prose p {
  margin: 0 0 15px;
  font-size: 1.02rem;
  color: var(--text);
}
.seo-muted { color: var(--text-muted) !important; font-size: 0.94rem !important; }

.seo-list {
  margin: 8px 0 16px;
  padding-left: 22px;
}
.seo-list li {
  margin-bottom: 9px;
  padding-left: 4px;
}
.seo-list li::marker { color: var(--gold); }

.seo-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: var(--gold-soft);
  color: var(--gold-strong);
  border: 1px solid rgba(224, 178, 92, 0.26);
}
.seo-chip--muted {
  background: rgba(255, 244, 224, 0.05);
  color: var(--text-muted);
  border-color: var(--border);
}

/* ── FAQ Accordion (<details>) ── */
.seo-faq__list { display: grid; gap: 10px; }
.seo-faq__item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.seo-faq__q {
  list-style: none;
  cursor: pointer;
  min-height: 50px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 600;
  color: #f9e7be;
}
.seo-faq__q::-webkit-details-marker { display: none; }
.seo-faq__chev::before {
  content: '+';
  font-size: 1.25rem;
  color: var(--gold);
  font-weight: 400;
}
.seo-faq__item[open] .seo-faq__chev::before { content: '−'; }
.seo-faq__a {
  padding: 0 18px 16px;
  color: var(--text-muted);
  border-top: 1px solid rgba(236, 200, 140, 0.08);
}
.seo-faq__a p { margin: 12px 0 0; }

/* ── Banner & Bài viết liên quan ── */
.seo-banner {
  margin: 34px 0;
  padding: 24px;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(80% 120% at 0% 50%, rgba(224, 178, 92, 0.16), transparent 70%),
    linear-gradient(145deg, #291c12, #1c130c);
  border: 1px solid var(--border-strong);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.seo-banner__body { flex: 1 1 320px; }
.seo-banner__body strong {
  display: block;
  font-family: var(--font-serif);
  font-size: 1.22rem;
  color: #fbe4b0;
  margin-bottom: 4px;
}
.seo-banner__body p { margin: 0; color: var(--text-muted); font-size: 0.95rem; }

.seo-rel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}
.seo-rel-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  background: var(--surface);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: border-color 0.18s ease, transform 0.18s ease;
}
.seo-rel-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}
.seo-rel-card__tag { font-size: 0.75rem; color: var(--gold); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
.seo-rel-card__title { font-family: var(--font-serif); font-size: 1.06rem; color: #fbe5b4; line-height: 1.35; }
.seo-rel-card__desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Thư viện Kinh văn & Toàn văn ── */
.seo-plan-box {
  background: linear-gradient(150deg, rgba(46, 32, 20, 0.9), rgba(28, 19, 12, 0.95));
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
}
.seo-plan-box__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.seo-plan-box__head .seo-h2 { margin-bottom: 0; }
.seo-plan-steps {
  margin: 12px 0 0;
  padding-left: 22px;
  display: grid;
  gap: 8px;
}
.seo-plan-steps li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px 14px;
  padding-bottom: 6px;
  border-bottom: 1px dashed rgba(236, 200, 140, 0.12);
}
.seo-plan-steps li span { font-size: 0.88rem; color: var(--text-muted); }

.seo-sutra-list { display: grid; gap: 12px; }
.seo-sutra-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.seo-sutra-card__main { flex: 1 1 340px; }
.seo-sutra-card__badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.seo-sutra-card__title { margin: 0 0 4px; font-family: var(--font-serif); font-size: 1.22rem; }
.seo-sutra-card__title a { text-decoration: none; color: #fce7b6; }
.seo-sutra-card__title a:hover { text-decoration: underline; }
.seo-sutra-card__sub { margin: 0 0 6px !important; font-size: 0.88rem !important; color: var(--gold) !important; }
.seo-sutra-card__blurb { margin: 0 !important; font-size: 0.94rem !important; color: var(--text-muted) !important; }
.seo-sutra-card__actions { display: flex; flex-wrap: wrap; gap: 8px; }

.seo-dedication {
  margin: 14px 0 0;
  padding: 18px 22px;
  border-left: 3px solid var(--gold);
  background: rgba(224, 178, 92, 0.07);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-family: var(--font-serif);
  font-size: 1.08rem;
}
.seo-dedication p { margin: 4px 0 !important; color: #fbe6b7 !important; }

.sutra-meta-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.sutra-reader {
  background: linear-gradient(180deg, rgba(36, 25, 16, 0.92), rgba(26, 18, 11, 0.94));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: clamp(18px, 3.5vw, 30px);
}
.sutra-lines {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 6px;
}
.sutra-line {
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: baseline;
  gap: 10px;
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  border-bottom: 1px solid rgba(236, 200, 140, 0.06);
}
.sutra-line:hover { background: rgba(255, 244, 224, 0.035); }
.sutra-line__no {
  font-size: 0.78rem;
  color: rgba(224, 178, 92, 0.62);
  text-align: right;
  font-variant-numeric: tabular-nums;
  user-select: none;
}
.sutra-line__text {
  font-family: var(--font-serif);
  font-size: 1.14rem;
  line-height: 1.68;
  color: #faeedc;
}

.sutra-chant-cta__box {
  background: rgba(224, 178, 92, 0.09);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.sutra-chant-cta__box div { flex: 1 1 300px; }
.sutra-chant-cta__box strong { display: block; font-family: var(--font-serif); font-size: 1.14rem; color: #fbe5b2; margin-bottom: 4px; }
.sutra-chant-cta__box p { margin: 0 !important; font-size: 0.92rem !important; color: var(--text-muted) !important; }

.sutra-source {
  background: rgba(255, 244, 224, 0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 18px 20px;
}

.sutra-pager {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 24px;
}
.sutra-pager__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
}
.sutra-pager__item:hover { border-color: var(--border-strong); }
.sutra-pager__item--next { text-align: right; }
.sutra-pager__item small { color: var(--text-muted); font-size: 0.8rem; }
.sutra-pager__item strong { font-family: var(--font-serif); color: #fbe5b4; font-size: 1.04rem; }

/* ── Pháp thoại ── */
.seo-talk-group { margin-top: 20px; }
.seo-talk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}
.seo-talk-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text);
}
.seo-talk-card:hover { border-color: var(--border-strong); }
.seo-talk-card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.seo-talk-card__head strong { font-family: var(--font-serif); color: #fbe5b4; font-size: 1.04rem; }
.seo-talk-card p { margin: 0 !important; font-size: 0.9rem !important; color: var(--text-muted) !important; flex: 1; }
.seo-talk-card__meta { font-size: 0.8rem; color: var(--gold); font-weight: 600; }

/* ── Lịch âm ── */
.cal-today {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: stretch;
  padding: 20px 22px;
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, rgba(52, 35, 21, 0.92), rgba(29, 19, 12, 0.95));
  border: 1px solid var(--border-strong);
  margin-bottom: 16px;
}
.cal-today__main { flex: 1 1 280px; }
.cal-today__eyebrow { display: block; font-size: 0.84rem; color: var(--text-muted); margin-bottom: 4px; }
.cal-today__lunar { display: block; font-family: var(--font-serif); font-size: 1.32rem; color: #fce7b4; margin-bottom: 4px; }
.cal-today__canchi { margin: 0 !important; font-size: 0.9rem !important; color: var(--text-muted) !important; }
.cal-today__special { margin: 8px 0 0 !important; font-size: 0.92rem !important; color: var(--gold-strong) !important; font-weight: 600; }
.cal-today__next {
  flex: 0 1 250px;
  background: rgba(20, 13, 8, 0.55);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.cal-today__next-label { font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gold); font-weight: 600; }
.cal-today__next strong { font-family: var(--font-serif); font-size: 1.08rem; color: #fbe5b4; }
.cal-today__next span:last-child { font-size: 0.86rem; color: var(--jade); font-weight: 500; }

.cal-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: clamp(12px, 2.8vw, 22px);
}
.cal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}
.cal-toolbar__center { text-align: center; }
.cal-month-title { margin: 0; font-family: var(--font-serif); font-size: 1.24rem; color: #fce7b4; }
.cal-today-btn {
  margin-top: 2px;
  background: none;
  border: none;
  color: var(--gold);
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px 8px;
}
.cal-nav-btn {
  min-height: 44px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: rgba(255, 244, 224, 0.04);
  color: var(--text);
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
}
.cal-nav-btn:hover { background: var(--gold-soft); }

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gold);
  padding-bottom: 8px;
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 5px;
}
.cal-cell {
  appearance: none;
  min-height: 64px;
  padding: 6px 4px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(236, 200, 140, 0.1);
  background: rgba(20, 13, 8, 0.46);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  cursor: pointer;
  font-family: inherit;
  text-align: center;
}
.cal-cell:hover { border-color: var(--border-strong); background: rgba(224, 178, 92, 0.09); }
.cal-cell.is-out { opacity: 0.36; }
.cal-cell__solar { font-size: 0.98rem; font-weight: 700; line-height: 1.15; }
.cal-cell__lunar { font-size: 0.74rem; color: var(--text-muted); line-height: 1.15; }
.cal-cell__badge {
  margin-top: 2px;
  max-width: 100%;
  font-size: 0.63rem;
  line-height: 1.15;
  padding: 1px 4px;
  border-radius: 4px;
  background: rgba(224, 178, 92, 0.16);
  color: #fce2a6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cal-cell.is-ram { border-color: rgba(243, 201, 115, 0.48); background: rgba(224, 178, 92, 0.11); }
.cal-cell.is-mung1 { border-color: rgba(95, 181, 154, 0.45); background: rgba(95, 181, 154, 0.09); }
.cal-cell.is-mung1 .cal-cell__badge { background: rgba(95, 181, 154, 0.2); color: #a9ebd7; }
.cal-cell.is-festival { border-color: rgba(235, 169, 187, 0.58); background: rgba(184, 55, 45, 0.2); }
.cal-cell.is-festival .cal-cell__badge { background: rgba(235, 169, 187, 0.22); color: #ffd4e0; }
.cal-cell.is-today {
  box-shadow: 0 0 0 2px var(--gold-strong);
  background: rgba(224, 178, 92, 0.2);
}
.cal-cell.is-selected { outline: 2px solid var(--jade); outline-offset: -2px; }

@media (max-width: 560px) {
  .cal-nav-btn { padding: 7px 10px; font-size: 0.76rem; white-space: nowrap; }
  .cal-month-title { font-size: 1.06rem; }
  .cal-cell { min-height: 54px; padding: 5px 2px; }
  .cal-cell__badge { display: none; }
  .cal-cell.is-ram .cal-cell__lunar,
  .cal-cell.is-festival .cal-cell__lunar { color: var(--gold-strong); font-weight: 700; }
  .cal-cell.is-mung1 .cal-cell__lunar { color: var(--jade); font-weight: 700; }
}

.cal-legend {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.cal-legend span { display: inline-flex; align-items: center; gap: 6px; }
.cal-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.cal-dot--today { background: var(--gold-strong); }
.cal-dot--festival { background: var(--lotus); }
.cal-dot--ram { background: #d59e40; }
.cal-dot--mung1 { background: var(--jade); }

.cal-detail {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: rgba(20, 13, 8, 0.55);
  border: 1px solid var(--border);
  font-size: 0.92rem;
  color: #f6e4bc;
}

.cal-events-wrap { margin-top: 20px; }
.cal-events {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.cal-event {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.cal-event__date {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--gold-strong);
  background: var(--gold-soft);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.88rem;
}
.cal-event__body { display: flex; flex-direction: column; }
.cal-event__body strong { color: #fbe5b4; font-size: 0.96rem; }
.cal-event__body small { color: var(--text-muted); font-size: 0.82rem; }

/* ── Footer ── */
.seo-footer {
  border-top: 1px solid var(--border);
  background: #100a06;
  padding: 36px 18px calc(36px + env(safe-area-inset-bottom, 0px));
}
.seo-footer__inner {
  max-width: 1060px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 28px;
}
.seo-footer__brand { flex: 1 1 320px; max-width: 460px; }
.seo-footer__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-serif);
  font-size: 1.18rem;
  font-weight: 700;
  color: #fbe5b4;
  margin-bottom: 10px;
}
.seo-footer__disclaimer {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.62;
  color: var(--text-muted);
}
.seo-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 40px;
}
.seo-footer__links div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.seo-footer__links strong {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gold);
  margin-bottom: 2px;
}
.seo-footer__links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 3px 0;
}
.seo-footer__links a:hover { color: var(--gold-strong); }
`;

// ───────────── Script ngoài cho trang Lịch Âm (dist/seo-lich-am.js, tuân thủ CSP) ─────────────
const SEO_LICH_AM_JS = `/* Tương tác xem tháng trước/sau và chi tiết ngày trên trang /lich-am/ (giờ VN UTC+7). */
(function () {
  var root = document.getElementById('lich-am-app');
  if (!root) return;

  var TZ = 7;
  var PI = Math.PI;
  var SYNODIC = 29.530588853;
  var EPOCH = 2415021.076998695;
  var CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  var CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  var WDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  var FESTIVALS = {
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
    1208: 'Lễ Phật thành đạo'
  };

  function mod(a, n) { return ((a % n) + n) % n; }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function monthName(m) { return m === 1 ? 'Giêng' : m === 12 ? 'Chạp' : String(m); }

  function jdFromDate(dd, mm, yy) {
    var a = Math.floor((14 - mm) / 12);
    var y = yy + 4800 - a;
    var m = mm + 12 * a - 3;
    var jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    return jd;
  }

  function newMoon(k) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
    var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr) - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    var deltat = T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
    return Jd1 + C1 - deltat;
  }

  function getNewMoonDay(k) { return Math.floor(newMoon(k) + 0.5 + TZ / 24); }

  function getSunLongitude(dayNumber) {
    var jdn = dayNumber - 0.5 - TZ / 24;
    var T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = PI / 180;
    var M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    var DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
    var omega = 125.04 - 1934.136 * T;
    var L = (L0 + DL - 0.00569 - 0.00478 * Math.sin(omega * dr)) * dr;
    L = L - PI * 2 * Math.floor(L / (PI * 2));
    return Math.floor((L / PI) * 6);
  }

  function getLunarMonth11(yy) {
    var off = jdFromDate(31, 12, yy) - 2415021;
    var k = Math.floor(off / SYNODIC);
    var nm = getNewMoonDay(k);
    if (getSunLongitude(nm) >= 9) nm = getNewMoonDay(k - 1);
    return nm;
  }

  function getLeapMonthOffset(a11) {
    var k = Math.floor((a11 - EPOCH) / SYNODIC + 0.5);
    var last = 0, i = 1, arc = getSunLongitude(getNewMoonDay(k + i));
    do {
      last = arc; i++;
      arc = getSunLongitude(getNewMoonDay(k + i));
    } while (arc !== last && i < 14);
    return i - 1;
  }

  function solarToLunar(y, m, d) {
    var dayNumber = jdFromDate(d, m, y);
    var k = Math.floor((dayNumber - EPOCH) / SYNODIC);
    while (getNewMoonDay(k + 1) <= dayNumber) k++;
    while (getNewMoonDay(k) > dayNumber) k--;
    var monthStart = getNewMoonDay(k);
    var a11 = getLunarMonth11(y), b11 = a11, lunarYear;
    if (a11 >= monthStart) { lunarYear = y; a11 = getLunarMonth11(y - 1); }
    else { lunarYear = y + 1; b11 = getLunarMonth11(y + 1); }
    var lunarDay = dayNumber - monthStart + 1;
    var diff = Math.floor((monthStart - a11) / 29);
    var lunarLeap = false, lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      var leapDiff = getLeapMonthOffset(a11);
      if (diff >= leapDiff) {
        lunarMonth = diff + 10;
        if (diff === leapDiff) lunarLeap = true;
      }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return {
      day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap,
      canChi: {
        day: CAN[mod(dayNumber + 9, 10)] + ' ' + CHI[mod(dayNumber + 1, 12)],
        month: CAN[mod(lunarYear * 12 + lunarMonth + 3, 10)] + ' ' + CHI[mod(lunarMonth + 1, 12)],
        year: CAN[mod(lunarYear + 6, 10)] + ' ' + CHI[mod(lunarYear + 8, 12)]
      }
    };
  }

  function specialDays(l) {
    var out = [];
    if (!l.leap && FESTIVALS[l.month * 100 + l.day]) {
      out.push({ kind: 'festival', label: FESTIVALS[l.month * 100 + l.day] });
    }
    var suf = l.leap ? ' (nhuận)' : '';
    if (l.day === 15) out.push({ kind: 'ram', label: 'Rằm tháng ' + monthName(l.month) + suf });
    if (l.day === 1) out.push({ kind: 'mung1', label: 'Mùng một tháng ' + monthName(l.month) + suf });
    return out;
  }

  function lunarLabel(l) {
    return 'Ngày ' + l.day + ' tháng ' + l.month + (l.leap ? ' (nhuận)' : '') + ', năm ' + l.canChi.year;
  }

  function todayVN() {
    var t = new Date(Date.now() + 7 * 3600 * 1000);
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), weekday: t.getUTCDay() };
  }

  var liveToday = todayVN();
  var curY = liveToday.y;
  var curM = liveToday.m;

  var elGrid = document.getElementById('calGrid');
  var elMonthTitle = document.getElementById('calMonthTitle');
  var elDetail = document.getElementById('calDetail');
  var elEventsHeading = document.getElementById('calEventsHeading');
  var elEventsList = document.getElementById('calEventsList');

  function updateTodayBanner() {
    var tl = solarToLunar(liveToday.y, liveToday.m, liveToday.d);
    var sp = specialDays(tl);
    var h = document.getElementById('calTodayHeading');
    var l = document.getElementById('calTodayLunar');
    var c = document.getElementById('calTodayCanChi');
    var s = document.getElementById('calTodaySpecial');
    if (h) h.textContent = WDAYS[liveToday.weekday] + ' · ' + pad2(liveToday.d) + '/' + pad2(liveToday.m) + '/' + liveToday.y + ' (Dương lịch)';
    if (l) l.textContent = lunarLabel(tl);
    if (c) c.textContent = 'Ngày ' + tl.canChi.day + ' · Tháng ' + tl.canChi.month + ' · Năm ' + tl.canChi.year;
    if (s) {
      if (sp.length) { s.hidden = false; s.textContent = '✦ ' + sp.map(function (x) { return x.label; }).join(' · '); }
      else { s.hidden = true; }
    }
    var base = Date.UTC(liveToday.y, liveToday.m - 1, liveToday.d);
    for (var i = 0; i < 400; i++) {
      var dt = new Date(base + i * 86400000);
      var ny = dt.getUTCFullYear(), nm = dt.getUTCMonth() + 1, nd = dt.getUTCDate();
      var nsp = specialDays(solarToLunar(ny, nm, nd));
      if (nsp.length) {
        var nt = document.getElementById('calNextTitle');
        var nds = document.getElementById('calNextDays');
        if (nt) nt.textContent = nsp[0].label;
        if (nds) nds.textContent = i === 0 ? 'Ngay hôm nay' : i === 1 ? 'Ngày mai' : 'Còn ' + i + ' ngày (' + pad2(nd) + '/' + pad2(nm) + '/' + ny + ')';
        break;
      }
    }
  }

  function showDetail(y, m, d) {
    if (!elDetail) return;
    var dt = new Date(Date.UTC(y, m - 1, d));
    var w = WDAYS[dt.getUTCDay()];
    var l = solarToLunar(y, m, d);
    var sp = specialDays(l);
    var specTxt = sp.length ? ' · ★ ' + sp.map(function (x) { return x.label; }).join(' · ') : '';
    elDetail.textContent = w + ' ' + pad2(d) + '/' + pad2(m) + '/' + y + ' → Âm lịch: ' + lunarLabel(l) +
      ' (Ngày ' + l.canChi.day + ', tháng ' + l.canChi.month + ')' + specTxt;
  }

  function renderMonth(y, m) {
    if (!elGrid) return;
    if (elMonthTitle) elMonthTitle.textContent = 'Tháng ' + m + ' năm ' + y;
    elGrid.setAttribute('aria-label', 'Lưới lịch âm dương tháng ' + m + '/' + y);
    if (elEventsHeading) elEventsHeading.textContent = 'Ngày Rằm, Mùng một & Lễ Phật giáo trong tháng ' + m + '/' + y;

    var first = new Date(Date.UTC(y, m - 1, 1));
    var lead = (first.getUTCDay() + 6) % 7;
    var start = first.getTime() - lead * 86400000;
    elGrid.textContent = '';
    if (elEventsList) elEventsList.textContent = '';
    var eventCount = 0;

    for (var i = 0; i < 42; i++) {
      var dt = new Date(start + i * 86400000);
      var cy = dt.getUTCFullYear(), cm = dt.getUTCMonth() + 1, cd = dt.getUTCDate();
      var inMonth = cm === m && cy === y;
      var l = solarToLunar(cy, cm, cd);
      var sp = specialDays(l);
      var isToday = cy === liveToday.y && cm === liveToday.m && cd === liveToday.d;

      var btn = document.createElement('button');
      btn.type = 'button';
      var cls = 'cal-cell';
      if (!inMonth) cls += ' is-out';
      if (isToday) cls += ' is-today';
      if (sp.some(function (s) { return s.kind === 'festival'; })) cls += ' is-festival';
      else if (sp.some(function (s) { return s.kind === 'ram'; })) cls += ' is-ram';
      else if (sp.some(function (s) { return s.kind === 'mung1'; })) cls += ' is-mung1';
      btn.className = cls;
      btn.setAttribute('data-y', String(cy));
      btn.setAttribute('data-m', String(cm));
      btn.setAttribute('data-d', String(cd));
      btn.setAttribute('aria-label', 'Dương lịch ' + cd + '/' + cm + '/' + cy + ', Âm lịch ' + l.day + '/' + l.month);

      var sEl = document.createElement('span');
      sEl.className = 'cal-cell__solar';
      sEl.textContent = String(cd);
      btn.appendChild(sEl);

      var lEl = document.createElement('span');
      lEl.className = 'cal-cell__lunar';
      lEl.textContent = (l.day === 1 || cd === 1) ? (l.day + '/' + l.month + (l.leap ? 'n' : '')) : String(l.day);
      btn.appendChild(lEl);

      if (sp[0]) {
        var bEl = document.createElement('span');
        bEl.className = 'cal-cell__badge';
        bEl.textContent = sp[0].label;
        btn.appendChild(bEl);
      }
      elGrid.appendChild(btn);

      if (inMonth && sp.length && elEventsList) {
        eventCount++;
        var li = document.createElement('li');
        li.className = 'cal-event';
        var dSpan = document.createElement('span');
        dSpan.className = 'cal-event__date';
        dSpan.textContent = pad2(cd) + '/' + pad2(cm);
        var bSpan = document.createElement('span');
        bSpan.className = 'cal-event__body';
        var st = document.createElement('strong');
        st.textContent = sp.map(function (x) { return x.label; }).join(' · ');
        var sm = document.createElement('small');
        sm.textContent = 'Âm lịch: ' + l.day + '/' + l.month + (l.leap ? ' (nhuận)' : '') + ' · Ngày ' + l.canChi.day;
        bSpan.appendChild(st);
        bSpan.appendChild(sm);
        li.appendChild(dSpan);
        li.appendChild(bSpan);
        elEventsList.appendChild(li);
      }
    }

    if (elEventsList && eventCount === 0) {
      var empty = document.createElement('li');
      empty.className = 'cal-event';
      empty.textContent = 'Không có ngày lễ đặc biệt trong tháng này.';
      elEventsList.appendChild(empty);
    }
  }

  function stepMonth(delta) {
    curM += delta;
    if (curM < 1) { curM = 12; curY -= 1; }
    if (curM > 12) { curM = 1; curY += 1; }
    if (curY < 1802) { curY = 1802; curM = 1; }
    if (curY > 2198) { curY = 2198; curM = 12; }
    renderMonth(curY, curM);
  }

  var prevBtn = document.getElementById('calPrevBtn');
  var nextBtn = document.getElementById('calNextBtn');
  var goTodayBtn = document.getElementById('calGoTodayBtn');
  if (prevBtn) prevBtn.addEventListener('click', function () { stepMonth(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { stepMonth(1); });
  if (goTodayBtn) goTodayBtn.addEventListener('click', function () {
    liveToday = todayVN();
    curY = liveToday.y; curM = liveToday.m;
    updateTodayBanner();
    renderMonth(curY, curM);
    showDetail(liveToday.y, liveToday.m, liveToday.d);
  });

  if (elGrid) {
    elGrid.addEventListener('click', function (e) {
      var target = e.target && e.target.closest ? e.target.closest('.cal-cell') : null;
      if (!target) return;
      var prevSel = elGrid.querySelector('.is-selected');
      if (prevSel) prevSel.classList.remove('is-selected');
      target.classList.add('is-selected');
      var y = Number(target.getAttribute('data-y'));
      var m = Number(target.getAttribute('data-m'));
      var d = Number(target.getAttribute('data-d'));
      if (y && m && d) showDetail(y, m, d);
    });
  }

  updateTodayBanner();
  renderMonth(curY, curM);
})();
`;

async function copyPublicAssetsIfMissing(distDir: string): Promise<void> {
  try {
    await fs.access(PUBLIC_DIR);
  } catch {
    return;
  }
  async function copyRec(src: string, dest: string): Promise<void> {
    const entries = await fs.readdir(src, { withFileTypes: true });
    await fs.mkdir(dest, { recursive: true });
    for (const ent of entries) {
      const s = path.join(src, ent.name);
      const d = path.join(dest, ent.name);
      if (ent.isDirectory()) {
        await copyRec(s, d);
      } else {
        try {
          await fs.access(d);
        } catch {
          await fs.copyFile(s, d);
        }
      }
    }
  }
  await copyRec(PUBLIC_DIR, distDir);
}

function navKeyForSlug(slug: string): string | undefined {
  if (slug === 'gioi-thieu') return 'gioi-thieu';
  if (slug === 'huong-dan-di-chua-online') return 'huong-dan';
  if (slug === 'lich-am' || slug === 'ngay-ram-mung-mot' || slug === 'ngay-le-phat-giao') return 'lich-am';
  if (slug === 'phap-thoai') return 'phap-thoai';
  if (slug === 'hoi-dap') return 'hoi-dap';
  return undefined;
}

export async function buildSeo(opts: BuildSeoOptions = {}): Promise<BuildSeoResult> {
  const distDir = opts.distDir ?? path.join(ROOT_DIR, 'dist');
  const siteUrl = (opts.siteUrl ?? process.env.SITE_URL ?? 'https://chualienhoa.vn').replace(/\/+$/, '');
  const now = opts.now ?? new Date();

  let hasAppIndex = true;
  try {
    await fs.access(path.join(distDir, 'index.html'));
  } catch {
    hasAppIndex = false;
  }

  await fs.mkdir(distDir, { recursive: true });
  if (!hasAppIndex) {
    if (!opts.quiet) {
      console.warn('[build-seo] Cảnh báo: chưa có dist/index.html — tạo trang SEO độc lập và chép tạm tài sản từ public/.');
    }
    await copyPublicAssetsIfMissing(distDir);
  }

  let filesWritten = 0;
  const write = async (relPath: string, content: string): Promise<void> => {
    const abs = path.join(distDir, relPath);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content, 'utf-8');
    filesWritten++;
  };

  await write('seo.css', SEO_CSS);
  await write('seo-lich-am.js', SEO_LICH_AM_JS);

  const urls: string[] = ['/'];

  // 1. 27 trang trong PAGES
  for (const page of PAGES) {
    const canonicalPath = `/${page.slug}/`;
    urls.push(canonicalPath);

    let extraTop = '';
    let extraBottom = '';
    const extraScripts: string[] = [];

    if (page.slug === 'lich-am') {
      extraTop = renderLichAmWidget(now);
      extraScripts.push('/seo-lich-am.js');
    } else if (page.slug === 'phap-thoai') {
      extraBottom = renderDharmaDirectory();
    }

    const html = renderLayout({
      siteUrl,
      canonicalPath,
      title: page.title,
      description: page.description,
      h1: page.h1,
      eyebrow: page.slug === 'lich-am' ? 'Âm lịch Việt Nam · Giờ UTC+7' : 'Cẩm nang Chùa Liên Hoa',
      lead: page.description,
      updated: page.updated,
      crumbs: [
        { name: 'Chùa Liên Hoa', path: '/' },
        { name: page.h1, path: canonicalPath },
      ],
      activeNav: navKeyForSlug(page.slug),
      bodyHtml: `${extraTop}\n${renderPageSections(page)}\n${extraBottom}`,
      faq: page.faq,
      relatedHtml: renderRelatedCards(page.related),
      extraScripts,
    });

    await write(path.join(page.slug, 'index.html'), html);
  }

  // 2. Mục lục Kinh văn (/kinh/)
  urls.push('/kinh/');
  await write(path.join('kinh', 'index.html'), renderKinhIndex(siteUrl));

  // 3. Từng bài kinh (/kinh/<slug>/)
  for (let i = 0; i < SUTRAS.length; i++) {
    const s = SUTRAS[i]!;
    const p = `/kinh/${s.slug}/`;
    urls.push(p);
    await write(path.join('kinh', s.slug, 'index.html'), renderSutraPage(s, i, siteUrl));
  }

  // 4. sitemap.xml + robots.txt
  const todayIso = `${todayVN(now).y}-${String(todayVN(now).m).padStart(2, '0')}-${String(todayVN(now).d).padStart(2, '0')}`;
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    const prio = u === '/' ? '1.0' : u === '/kinh/' || u === '/lich-am/' || u === '/gioi-thieu/' ? '0.9' : u.startsWith('/kinh/') ? '0.8' : '0.7';
    return `  <url>
    <loc>${esc(siteUrl + u)}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>${u === '/lich-am/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${prio}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;
  await write('sitemap.xml', sitemapXml);

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;
  await write('robots.txt', robotsTxt);

  if (!opts.quiet) {
    console.log(`[build-seo] Đã tạo ${urls.length - 1} trang SEO + sitemap.xml + robots.txt (${filesWritten} tệp) tại ${path.relative(ROOT_DIR, distDir) || '.'}`);
  }
  return { distDir, siteUrl, urls, filesWritten };
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) {
  buildSeo().catch((err) => {
    console.error('[build-seo] Lỗi:', err);
    process.exit(1);
  });
}
