/**
 * Bộ icon SVG nét (stroke) tự vẽ cho Chùa Rắn — lưới 24×24, nét `currentColor`.
 * Dùng: `icon('lotus', { size: 20, class: 'x' })` → chuỗi SVG (chèn bằng innerHTML).
 * Màu lấy theo `color` của phần tử cha (thường là vàng đồng qua CSS).
 */

const R = (n: number) => Math.round(n * 100) / 100;

/** Các điểm trên đường tròn: dùng cho hạt tràng, tia nắng, răng bánh răng. */
function ring(cx: number, cy: number, r: number, n: number, start = -90): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = ((start + (360 / n) * i) * Math.PI) / 180;
    pts.push([R(cx + r * Math.cos(a)), R(cy + r * Math.sin(a))]);
  }
  return pts;
}

function rays(cx: number, cy: number, r1: number, r2: number, n: number, start = -90): string {
  return ring(cx, cy, r1, n, start)
    .map(([x1, y1], i) => {
      const [x2, y2] = ring(cx, cy, r2, n, start)[i];
      return `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
    })
    .join('');
}

function flower(): string {
  const petal = 'M12 9.4c-1.8-1.7-1.8-4.7 0-6.6 1.8 1.9 1.8 4.9 0 6.6z';
  let s = '';
  for (let i = 0; i < 5; i++) s += `<path d="${petal}" transform="rotate(${i * 72} 12 12)"/>`;
  return s + '<circle cx="12" cy="12" r="1.7"/>';
}

function beads(): string {
  // 9 hạt quanh vòng + tua rua phía dưới
  const pts = ring(12, 9.5, 6.4, 9, 90 + 20);
  const b = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.55"/>`).join('');
  return b + '<path d="M12 16.4v2.6"/><path d="M10.4 21.2l1.6-2.2 1.6 2.2"/>';
}

function gear(): string {
  return (
    '<circle cx="12" cy="12" r="2.8"/><circle cx="12" cy="12" r="6.6"/>' +
    rays(12, 12, 7.2, 9.6, 8, -90).replace(/<path/g, '<path stroke-width="2.6"')
  );
}

function sun(): string {
  return '<circle cx="12" cy="12" r="3.8"/>' + rays(12, 12, 6.6, 9, 8);
}

const dot = (x: number, y: number, r = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;

const PATHS = {
  // ── Tôn giáo / công phu ──
  lotus:
    '<path d="M12 3c3.200 3 4.200 6.800 0 12.500C7.800 9.800 8.800 6 12 3z"/>' +
    '<path d="M8.300 7.800C5.200 8 3.200 9.800 2.800 12.600c.5 3 3.800 4.800 9.200 4.800"/>' +
    '<path d="M15.700 7.800c3.100.2 5.100 2 5.500 4.800-.5 3-3.800 4.800-9.200 4.800"/>' +
    '<path d="M5.600 20.200c4 1.200 8.800 1.200 12.800 0"/>',
  incense:
    '<path d="M9.4 9.2v7.6M12 5.8v11M14.6 9.2v7.6"/>' +
    '<path d="M12 2c-1.3 1.1 1.3 1.9 0 3.2"/>' +
    '<path d="M5 17h14l-1.5 3.6h-11z"/>' +
    dot(9.4, 8.6, 0.7) + dot(14.6, 8.6, 0.7),
  flower: flower(),
  candle:
    '<path d="M12 2.8c1.9 2 2.5 3.4 0 5.4-2.5-2-1.9-3.4 0-5.4z"/>' +
    '<rect x="8.8" y="10" width="6.4" height="10" rx="1.3"/>' +
    '<path d="M8.8 13.2c1.1 1.1 2.2 1.1 3.1 0"/><path d="M6.5 20.8h11"/>',
  bell:
    '<path d="M12 2.8v2.4"/>' +
    '<path d="M12 5.2c-3.6 0-5.5 3-5.7 6.7L5 18h14l-1.3-6.1C17.5 8.200 15.600 5.200 12 5.200z"/>' +
    '<path d="M6.3 12h11.4"/><path d="M5 18h14"/><circle cx="12" cy="20.7" r="1"/>',
  lantern:
    '<path d="M12 2.4v2.4M9 5h6"/>' +
    '<path d="M12 5c4.2 0 6.5 3 6.5 6.6S16.200 18 12 18s-6.500-2.800-6.500-6.400S7.800 5 12 5z"/>' +
    '<path d="M12 5c-1.800 2-2.400 4-2.400 6.600S10.200 16 12 18M12 5c1.800 2 2.400 4 2.400 6.600S13.800 16 12 18"/>' +
    '<path d="M9.800 18h4.400M12 18v2.200M11 21.600h2"/>',
  beads: beads(),
  book:
    '<path d="M5 4.500h11a2.500 2.500 0 0 1 2.500 2.500v13H7.500A2.500 2.500 0 0 1 5 17.500z"/>' +
    '<path d="M5 17.500A2.500 2.500 0 0 1 7.500 15h11M9 8.500h6M9 11.500h4"/>',
  'wood-fish':
    '<ellipse cx="10.500" cy="13.500" rx="7" ry="6"/>' +
    '<path d="M5.200 14.200c3.400 1.200 7.200 1.200 10.600 0"/>' +
    '<path d="M7 19.600h7"/><path d="M14.800 8.200l5.200-5.200"/>' + dot(20.800, 2.600, 1.500),
  meditate:
    '<circle cx="12" cy="5.300" r="2.200"/>' +
    '<path d="M9 15.200c0-3 1-5.400 3-5.400s3 2.400 3 5.400"/>' +
    '<path d="M4.500 18.600c2.600-1.800 5-2.800 7.500-2.800s4.900 1 7.500 2.800c-2 1.700-4.800 2.300-7.500 2.300s-5.500-.6-7.500-2.300z"/>' +
    '<path d="M9.800 15.400h4.400"/>',
  bow:
    '<path d="M8 20.500v-7l9-1.500"/><circle cx="19.800" cy="12.600" r="2"/>' +
    '<path d="M16.500 12.500l3 7.500M8 20.500h5M3 21h18"/>',
  hands:
    '<path d="M12 3.600c-2.800 2.800-4 6.200-3.200 10.400l3.200 6.500 3.200-6.500c.8-4.200-.4-7.600-3.200-10.400z"/><path d="M12 8.500v12"/>',
  broom:
    '<path d="M19.500 3.500L11.800 11.200"/>' +
    '<path d="M10 9.800c-2.600.4-4.600 2.600-5.400 6.200l3.400 3.400c3.600-.8 5.800-2.800 6.200-5.400z"/>' +
    '<path d="M6.800 13.200l4 4M9 11.400l3.600 3.600"/>',
  trophy:
    '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5.500H5.500V7a3 3 0 0 0 3 3M16 5.500h2.500V7a3 3 0 0 1-3 3"/>' +
    '<path d="M12 13v3.500M9.500 20v-3.500h5V20M8 20h8"/>',
  flame:
    '<path d="M12 2.800c1 3.200 5.500 5.500 5.500 10.200a5.500 5.500 0 0 1-11 0c0-2.200 1-3.700 2.300-5 .2 1.500.8 2.400 1.700 3 .2-3.500.5-5.500 1.500-8.200z"/>' +
    '<path d="M12 20c-1.600 0-2.700-1.100-2.700-2.600 0-1.500 1.400-2.400 2.700-4 1.300 1.600 2.700 2.500 2.700 4 0 1.500-1.100 2.600-2.700 2.600z"/>',
  scroll:
    '<path d="M6.500 4H18v13.500a2.500 2.500 0 0 0 2.500 2.500H8.500A2.500 2.500 0 0 1 6 17.500V8"/>' +
    '<path d="M6.500 4A2.500 2.500 0 0 0 4 6.500V8h4V6.500A2.500 2.500 0 0 0 6.500 4z"/><path d="M10.500 9.500H15M10.500 13H15"/>',
  hanger:
    '<path d="M12 8.500V7a2 2 0 1 1 2-2"/>' +
    '<path d="M12 8.500l-9 7.300a1.300 1.300 0 0 0 .8 2.300h16.400a1.300 1.300 0 0 0 .8-2.300z"/>',
  footsteps:
    '<path d="M7.200 3.800c1.600 0 2.600 1.800 2.600 4 0 1.900-.9 3.100-2.600 3.100S4.600 9.700 4.600 7.800c0-2.200 1-4 2.600-4z"/>' +
    '<path d="M6 13.400h2.600v1.200c0 .8-.6 1.400-1.300 1.400S6 15.400 6 14.600z"/>' +
    '<path d="M16.800 9.800c1.600 0 2.600 1.800 2.600 4 0 1.900-.9 3.100-2.600 3.100s-2.600-1.200-2.600-3.100c0-2.200 1-4 2.600-4z"/>' +
    '<path d="M15.600 19.400h2.600v1.200c0 .8-.6 1.400-1.300 1.400s-1.300-.6-1.300-1.400z"/>',
  cushion:
    '<path d="M4 14.500c0-3 3.500-5 8-5s8 2 8 5-3.500 5-8 5-8-2-8-5z"/><path d="M4 14.500c0 3 3.500 5 8 5s8-2 8-5"/><path d="M12 9.500v10M8.500 11c-1 1-1.500 2.500-1.500 4M15.500 11c1 1 1.500 2.500 1.500 4"/>',
  sticks:
    '<path d="M7 11h10l-1 9.500H8z"/><path d="M9.500 11V4.500M12 11V3M14.500 11V5"/><path d="M8.600 15h6.800"/>',
  ribbon:
    '<path d="M4.500 3.500h15"/><path d="M8.500 3.500v17.500l3.500-3.600 3.500 3.600V3.500"/><path d="M8.500 8.500h7"/>',
  tree:
    '<path d="M12 21v-6.500M12 17.500l-3-2.500M12 15.500l3-2.700"/>' +
    '<path d="M12 3c3.600 1.400 6 4 6 7 0 2.500-2.700 4.500-6 4.500S6 12.500 6 10c0-3 2.400-5.600 6-7z"/>',

  // ── Người / xã hội ──
  user: '<circle cx="12" cy="8" r="3.500"/><path d="M5 20c.5-4 3.400-6 7-6s6.500 2 7 6"/>',
  users:
    '<circle cx="9" cy="8.500" r="3.200"/><path d="M2.800 19.500c.4-3.600 3-5.500 6.200-5.500s5.800 1.900 6.200 5.500"/>' +
    '<path d="M15.500 5.600a3.100 3.100 0 0 1 0 5.800M17.500 14.400c2 .6 3.400 2.300 3.700 5.100"/>',
  heart: '<path d="M12 20s-8-4.600-8-10.200A4.300 4.300 0 0 1 12 7.500a4.300 4.300 0 0 1 8 2.300C20 15.400 12 20 12 20z"/>',
  gift:
    '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/>' +
    '<path d="M12 7c-1-3.500-5-4-5-1.700C7 7 9 7 12 7zM12 7c1-3.500 5-4 5-1.700C17 7 15 7 12 7z"/>',
  mail: '<rect x="3" y="5.500" width="18" height="13" rx="2.500"/><path d="M3.800 7.500l8.200 6 8.200-6"/>',
  chat:
    '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8A2.5 2.5 0 0 1 17.5 17H9l-4.2 3.4V17A2.5 2.5 0 0 1 4 14.5z"/>' +
    dot(8.5, 10.5, 1) + dot(12, 10.5, 1) + dot(15.5, 10.5, 1),
  google: '<path d="M20.500 12.200h-8.200"/><path d="M20.300 12.200A8.300 8.300 0 1 1 17.800 6.300"/>',
  share: '<path d="M12 15V3.500M8 7.500l4-4 4 4"/><path d="M5 11.500v7.200c0 .7.600 1.300 1.300 1.300h11.400c.7 0 1.300-.6 1.300-1.300v-7.200"/>',
  send: '<path d="M21 3L10.500 13.500M21 3l-6.500 18-4-7.500L3 9.500z"/>',
  download: '<path d="M12 4v11M7.500 11l4.500 4.500 4.500-4.500M5 19.500h14"/>',
  qr:
    '<rect x="3.500" y="3.500" width="6" height="6" rx="1"/><rect x="14.500" y="3.500" width="6" height="6" rx="1"/><rect x="3.500" y="14.500" width="6" height="6" rx="1"/>' +
    '<path d="M14.500 14.500h2.500v2.500M20.500 14.500v.1M14.500 20.500h2M20.500 17.500v3h-2.500"/>',
  copy: '<rect x="8.500" y="8.500" width="11.500" height="11.500" rx="2.500"/><path d="M15.500 8.500V6A2.500 2.500 0 0 0 13 3.500H6A2.500 2.500 0 0 0 3.500 6v7A2.500 2.500 0 0 0 6 15.500h2.500"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>',

  // ── Điều khiển / giao diện ──
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
  settings: gear(),
  sound: '<path d="M4 9.500h3.500L12 5.500v13l-4.500-4H4z"/><path d="M15.500 9a4 4 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11"/>',
  mute: '<path d="M4 9.500h3.500L12 5.500v13l-4.500-4H4z"/><path d="M16 9.500l5 5M21 9.500l-5 5"/>',
  play: '<path d="M8 5.500v13l11-6.500z"/>',
  pause: '<path d="M8.500 5v14M15.500 5v14" stroke-width="2.600"/>',
  restart: '<path d="M4.500 12a7.500 7.500 0 1 0 2.400-5.500"/><path d="M4.500 4.500v4h4"/>',
  refresh: '<path d="M19.500 12a7.500 7.500 0 1 1-2.400-5.500"/><path d="M19.500 4.500v4h-4"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="4"/>' + dot(8.600, 8.600) + dot(15.400, 8.600) + dot(12, 12) + dot(8.600, 15.400) + dot(15.400, 15.400),
  'chevron-down': '<path d="M6 9.500l6 6 6-6"/>',
  'chevron-up': '<path d="M6 14.500l6-6 6 6"/>',
  'chevron-left': '<path d="M14.500 6l-6 6 6 6"/>',
  'chevron-right': '<path d="M9.500 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  more: dot(6, 12, 1.4) + dot(12, 12, 1.4) + dot(18, 12, 1.4),
  fullscreen: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  lock: '<rect x="5" y="10.500" width="14" height="10" rx="2.500"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.500"/>' + dot(12, 15.500, 1.2),
  trash: '<path d="M4.500 6.500h15M9.500 6.500V4.500h5v2M6.500 6.500l.8 13h9.400l.8-13M10 10.500v6M14 10.500v6"/>',
  info: '<circle cx="12" cy="12" r="8.500"/><path d="M12 11v5.500"/>' + dot(12, 7.800, 1.100),
  warning: '<path d="M12 3.800L21 19.500H3z"/><path d="M12 10v4.500"/>' + dot(12, 17.200, 1),
  edit: '<path d="M4 20l1-4.500L16.500 4a2 2 0 0 1 3 3L8 18.500z"/><path d="M14.500 6l3 3"/>',
  search: '<circle cx="11" cy="11" r="6.500"/><path d="M16 16l4.500 4.500"/>',
  clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.200 2"/>',
  wifi: '<path d="M3 9.500a13 13 0 0 1 18 0M6 13a8.500 8.500 0 0 1 12 0M9 16.500a4 4 0 0 1 6 0"/>' + dot(12, 19.500, 1),
  logout: '<path d="M9.500 4.500H6A1.500 1.500 0 0 0 4.500 6v12A1.500 1.500 0 0 0 6 19.500h3.500M14 8l4 4-4 4M18 12H9.500"/>',
  key: '<circle cx="8" cy="15" r="3.800"/><path d="M10.700 12.300L20 3M16.500 6.500l2.500 2.500M14 9l2 2"/>',
  eye: '<path d="M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12z"/><circle cx="12" cy="12" r="2.800"/>',
  star: '<path d="M12 3.500l2.600 5.400 5.900.8-4.300 4.100 1 5.900L12 16.900l-5.200 2.800 1-5.900-4.300-4.100 5.900-.8z"/>',
  pin: '<path d="M12 21s6.500-5.800 6.500-11A6.500 6.500 0 0 0 5.500 10c0 5.200 6.500 11 6.500 11z"/><circle cx="12" cy="10" r="2.300"/>',
  home: '<path d="M4 11l8-7 8 7M6 9.500V20h12V9.500M10 20v-5.500h4V20"/>',

  // ── Thiên nhiên / thời tiết ──
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 9-5 14-13 14"/><path d="M5 19c3-5 6-8 10-10"/>',
  moon: '<path d="M20 14.500A8.500 8.500 0 1 1 9.500 4a7 7 0 0 0 10.500 10.500z"/>',
  sun: sun(),
  sparkle: '<path d="M12 3c.8 5 3.500 7.700 9 9-5.500 1.300-8.200 4-9 9-.8-5-3.500-7.700-9-9 5.500-1.300 8.200-4 9-9z"/>',
  sparkles:
    '<path d="M10 5c.6 3.800 2.700 5.900 7 7-4.300 1.100-6.400 3.200-7 7-.6-3.800-2.700-5.900-7-7 4.300-1.100 6.400-3.200 7-7z"/>' +
    '<path d="M18.500 2.500v4M16.500 4.500h4M19 16.500v3.500M17.300 18.200h3.400"/>',
  cloud: '<path d="M7.500 18.500a4.200 4.200 0 0 1-.6-8.400 5.600 5.600 0 0 1 10.600-.8 4.600 4.600 0 0 1-.5 9.200z"/>',
  calendar:
    '<rect x="4" y="5.500" width="16" height="14.500" rx="2.500"/><path d="M4 10h16M8.500 3.500v4M15.500 3.500v4"/>' +
    dot(8.500, 13.500, 0.9) + dot(12, 13.500, 0.9) + dot(15.500, 13.500, 0.9) + dot(8.500, 16.800, 0.9) + dot(12, 16.800, 0.9),
  music: '<path d="M9 18V5.500l10-2V16"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="16.500" cy="16" r="2.500"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.500" y="14" width="4" height="6.500" rx="1.800"/><rect x="16.500" y="14" width="4" height="6.500" rx="1.800"/>',
  eq: '<path d="M6 19v-6M10 19V6M14 19v-9M18 19v-4" stroke-width="2.400"/>',
  mountain: '<path d="M3 19l6-10 4 6 2.500-3.500L21 19z"/>',
  fish: '<path d="M3.500 12c3-4.500 8.500-5.500 12.500-2l4.500-2.500v9L16 14.500c-4 3.500-9.500 2.500-12.500-2.500z"/>' + dot(8, 11.500, 0.9),
  bird: '<path d="M4 15c3 .5 5-.7 6.500-3 1-1.500 2.500-2.500 4.500-2.500l3.500-3v3.500c0 5-3.500 9-8.500 9-3 0-5-1.200-6-4z"/>' + dot(15.500, 8.800, 0.8),
} as const;

export type IconName = keyof typeof PATHS;

/** Bí danh tên cũ/tiếng Việt → tên chính. */
const ALIASES: Record<string, IconName> = { mo: 'wood-fish', pray: 'hands' };

export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export function icon(name: IconName | 'mo' | 'pray', opts: { size?: number; class?: string } = {}): string {
  const key = (ALIASES[name] ?? name) as IconName;
  const body = PATHS[key] ?? '';
  const size = opts.size ?? 22;
  const cls = `icon icon-${key}${opts.class ? ' ' + opts.class : ''}`;
  return (
    `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`
  );
}
