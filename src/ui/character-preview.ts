/**
 * Nhân vật chibi vẽ bằng SVG 2D (xem trước ở màn chọn nhân vật, trang phục, khoe thành tích, bạn đạo…).
 * `characterSvg(profile, { size })` → chuỗi SVG, cập nhật tức thì khi đổi lựa chọn.
 */
import { OUTFIT_COLORS, type Gender, type OutfitId, type Profile } from '@/core/contracts';

export interface CharacterOpts {
  /** Chiều rộng px (cao = 1.2 lần). Mặc định 200. */
  size?: number;
  /** Vòng hào quang mảnh phía sau. */
  aura?: boolean;
  /** Bóng dưới chân. */
  shadow?: boolean;
  /** Chuyển động thở nhẹ. */
  breathe?: boolean;
  /** Tư thế: chắp tay hoặc buông tay. */
  pose?: 'pray' | 'stand';
  class?: string;
}

type Look = Pick<Profile, 'gender' | 'outfit' | 'colorIndex'> & Partial<Pick<Profile, 'name' | 'accessory'>>;

let uidN = 0;

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}
/** Làm sáng (amt>0) hoặc tối (amt<0) một màu hex. */
export function shade(hex: string, amt: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => clamp(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt)));
  return '#' + ch.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Màu hex áo ứng với hồ sơ (dùng chung: share, HUD…). */
export function outfitHex(outfit: OutfitId, colorIndex: number): string {
  const list = OUTFIT_COLORS[outfit] ?? OUTFIT_COLORS['trang-lam'];
  return (list[colorIndex] ?? list[0]).hex;
}

const SKIN = '#f6d3b0';
const SKIN_D = '#e5b48b';
const INK = '#3b2418';
const TRIM = '#f6efe0';

function hair(gender: Gender, outfit: OutfitId): { back: string; front: string } {
  const c = '#2a1b14';
  const hi = 'rgba(255,255,255,.16)';
  if (gender === 'male') {
    if (outfit === 'trang-xam' || outfit === 'trang-lam') {
      // đầu trọc: chỉ có vệt bóng nhẹ
      return {
        back: '',
        front: `<path d="M60 74 Q100 30 140 74 Q120 52 100 51 Q80 52 60 74Z" fill="rgba(70,45,30,.13)"/><ellipse cx="84" cy="56" rx="11" ry="6" transform="rotate(-24 84 56)" fill="rgba(255,255,255,.3)"/>`,
      };
    }
    return {
      back: '',
      front: `<path d="M57 80 Q54 38 100 37 Q146 38 143 80 Q135 58 112 55 Q92 62 70 58 Q60 64 57 80Z" fill="${c}"/><path d="M76 48 Q92 41 108 44" stroke="${hi}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    };
  }
  const longBack =
    outfit === 'ao-dai'
      ? `<path d="M58 78 Q40 124 56 160 L76 150 Q66 116 70 84Z"/><path d="M142 78 Q160 124 144 160 L124 150 Q134 116 130 84Z"/>`
      : '';
  return {
    back: `<g fill="${c}">${longBack}<circle cx="100" cy="29" r="15"/></g><path d="M91 40 Q100 34 109 40" stroke="#d9a641" stroke-width="3.5" stroke-linecap="round" fill="none"/>`,
    front: `<path d="M55 92 Q48 36 100 35 Q152 36 145 92 Q142 66 120 58 Q98 68 74 58 Q58 68 55 92Z" fill="${c}"/><path d="M72 46 Q90 38 112 42" stroke="${hi}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  };
}

function sleevePair(pose: 'pray' | 'stand', c: string, d: string, l: string, narrow: boolean, outfit: OutfitId): string {
  const cuffC = outfit === 'trang-lam' ? TRIM : l;
  if (pose === 'pray') {
    const w = narrow ? 0 : 6;
    // tay áo bên trái; bên phải lật gương
    const one = `<path d="M66 134 C${46 - w} 142 ${40 - w} 166 ${54 - w / 2} 182 C${66 - w / 2} 192 86 178 98 161 L94 148 C84 154 76 152 72 144Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M${55 - w / 2} 182 C${66 - w / 2} 192 86 178 98 161" stroke="${cuffC}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    return `<g>${one}</g><g transform="translate(200 0) scale(-1 1)">${one}</g>`;
  }
  const one = `<path d="M66 134 C48 144 42 170 48 192 C56 198 68 196 74 190 C72 170 74 152 78 142Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M49 190 C56 197 68 195 74 189" stroke="${cuffC}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="59" cy="198" rx="8.500" ry="8" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="1"/>`;
  return `<g>${one}</g><g transform="translate(200 0) scale(-1 1)">${one}</g>`;
}

function outfitSvg(look: Look, pose: 'pray' | 'stand'): string {
  const c = outfitHex(look.outfit, look.colorIndex);
  const d = shade(c, -0.28);
  const l = shade(c, 0.22);
  const o = look.outfit;
  let pants = `<rect x="75" y="190" width="19" height="24" rx="7" fill="#3a2d26"/><rect x="106" y="190" width="19" height="24" rx="7" fill="#3a2d26"/>`;
  let torso = '';
  let extra = '';
  const arms = sleevePair(pose, c, d, l, o === 'ao-dai' || o === 'ba-ba', o);

  if (o === 'trang-xam' || o === 'trang-lam') {
    const lapel = o === 'trang-lam' ? TRIM : d;
    torso =
      `<path d="M64 132 Q100 120 136 132 L147 202 Q100 215 53 202Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M87 124 L100 156 L113 124" stroke="${lapel}" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="M100 156 V204" stroke="${d}" stroke-width="1.4" opacity=".6"/>` +
      `<path d="M58 198 Q100 210 142 198" stroke="${o === 'trang-lam' ? TRIM : l}" stroke-width="3.200" fill="none" opacity=".9" stroke-linecap="round"/>`;
  } else if (o === 'ba-ba') {
    const dark = shade(c, -0.6);
    const pc = c.toLowerCase() === '#2b2623' ? '#4a3f38' : shade('#2b2623', 0.04);
    pants = `<path d="M68 186 H132 L134 214 Q118 221 102 214 L100 200 L98 214 Q82 221 66 214Z" fill="${pc}" stroke="#171210" stroke-width="1"/>`;
    torso =
      `<path d="M66 132 Q100 121 134 132 L141 192 Q100 200 59 192Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M90 124 Q100 132 110 124" stroke="${l}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M100 130 V194" stroke="${dark}" stroke-width="1.200" opacity=".5"/>` +
      [140, 154, 168, 182].map((y) => `<circle cx="100" cy="${y}" r="2.200" fill="${l}" stroke="${d}" stroke-width=".6"/>`).join('') +
      `<path d="M62 168 Q80 176 76 190M138 168 Q120 176 124 190" stroke="${d}" stroke-width="1" fill="none" opacity=".45"/>`;
  } else {
    // áo dài: thân dài, xẻ tà để lộ quần trắng
    pants = `<path d="M92 176 L108 176 L112 214 Q100 219 88 214Z" fill="${TRIM}" stroke="#d8cdb6" stroke-width="1"/>`;
    torso =
      `<path d="M66 130 Q100 120 134 130 L138 172 L150 214 Q100 224 50 214 L62 172Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M92 124 Q100 130 108 124" stroke="${l}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M114 138 Q132 150 134 172" stroke="${d}" stroke-width="1.2" fill="none" opacity=".5"/>` +
      `<path d="M100 176 L92 216M100 176 L108 216" stroke="${d}" stroke-width="1.2" opacity=".55"/>` +
      `<path d="M58 206 Q100 218 142 206" stroke="${l}" stroke-width="3" fill="none" opacity=".8" stroke-linecap="round"/>`;
    extra = `<g opacity=".9" fill="${l}" opacity=".5">${[0, 1, 2].map((i) => `<circle cx="${112 + i * 7}" cy="${186 + i * 6}" r="2.200" opacity=".55"/>`).join('')}</g>`;
  }

  // chắp tay
  const hands =
    pose === 'pray'
      ? `<path d="M100 141 C109 148 110 163 100 174 C90 163 91 148 100 141Z" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="1.2" stroke-linejoin="round"/><path d="M100 146 V172" stroke="${SKIN_D}" stroke-width="1.200"/>`
      : '';
  const acc = look.accessory ?? '';
  const front: string[] = [];
  const behind: string[] = [];
  if (acc === 'bag-brocade') {
    front.push(
      `<path d="M72 128 L130 192" stroke="#b84a3a" stroke-width="5" stroke-linecap="round" opacity=".92"/><path d="M72 128 L130 192" stroke="#f2c14e" stroke-width="1.200" stroke-dasharray="3 4" stroke-linecap="round"/>` +
        `<rect x="120" y="178" width="26" height="24" rx="6" fill="#b84a3a" stroke="#7c2a20" stroke-width="1.200"/><path d="M120 188 H146" stroke="#f2c14e" stroke-width="2"/><path d="M123 195 l4 -4 4 4 4 -4 4 4 4 -4" stroke="#5fb59a" stroke-width="1.300" fill="none"/>`,
    );
  }
  if (acc === 'hat-tram') {
    const beadsPts: string[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = 76 + 48 * t;
      const y = 128 + Math.sin(Math.PI * t) * 34;
      beadsPts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.600" fill="#6a4328" stroke="#3b2418" stroke-width=".8"/>`);
    }
    front.push(beadsPts.join('') + `<path d="M100 162 v10" stroke="#b84a3a" stroke-width="2.200"/>`);
  }
  if (acc === 'scarf-gold') {
    front.push(
      `<path d="M70 124 Q100 142 130 124 L132 137 Q100 156 68 137Z" fill="#f2c14e" stroke="#c9962b" stroke-width="1.200" stroke-linejoin="round"/><path d="M116 142 L124 170 L112 166 L108 146Z" fill="#f2c14e" stroke="#c9962b" stroke-width="1.200" stroke-linejoin="round"/>`,
    );
  }
  if (acc === 'lotus-hand') {
    front.push(
      `<g transform="translate(100 148)"><path d="M0 -12 C7 -6 7 3 0 8 C-7 3 -7 -6 0 -12Z" fill="#f4b6c6" stroke="#d77a95" stroke-width="1"/><path d="M-3 7 C-14 5 -16 -4 -12 -9 C-6 -7 -2 -2 -3 7Z" fill="#f7cbd6" stroke="#d77a95" stroke-width="1"/><path d="M3 7 C14 5 16 -4 12 -9 C6 -7 2 -2 3 7Z" fill="#f7cbd6" stroke="#d77a95" stroke-width="1"/><circle cx="0" cy="9" r="2" fill="#e5b24c"/></g>`,
    );
  }
  if (acc === 'bracelet-jade') {
    front.push(
      `<path d="M89 170 q4 4 8 1M103 171 q4 3 8-1" stroke="#5fb59a" stroke-width="3.200" fill="none" stroke-linecap="round"/><path d="M89 170 q4 4 8 1M103 171 q4 3 8-1" stroke="#c6f0df" stroke-width="1" fill="none" stroke-linecap="round"/>`,
    );
  }
  return behind.join('') + pants + torso + extra + arms + hands + front.join('');
}

function headSvg(look: Look): string {
  const hr = hair(look.gender, look.outfit);
  const acc = look.accessory ?? '';
  const hat =
    acc === 'conical-hat'
      ? `<path d="M40 64 Q100 2 160 64 Q100 74 40 64Z" fill="#ead29a" stroke="#b99a58" stroke-width="1.400" stroke-linejoin="round"/><path d="M62 60 Q100 20 138 60M80 64 Q100 38 120 64" stroke="#c9ad6a" stroke-width="1" fill="none" opacity=".7"/><path d="M62 66 Q66 100 76 112M138 66 Q134 100 124 112" stroke="#b84a3a" stroke-width="2" fill="none" stroke-linecap="round"/>`
      : '';
  const halo =
    acc === 'halo-lotus'
      ? `<g transform="translate(100 78)" opacity=".92">${Array.from({ length: 10 }, (_, i) => `<ellipse cx="0" cy="-62" rx="9" ry="17" fill="rgba(243,201,115,.55)" stroke="#f3c973" stroke-width="1.200" transform="rotate(${i * 36})"/>`).join('')}</g>`
      : '';
  return `${halo}${hr.back}
    <circle cx="59" cy="88" r="8.500" fill="${SKIN_D}"/><circle cx="141" cy="88" r="8.500" fill="${SKIN_D}"/>
    <circle cx="100" cy="82" r="42" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="1.200"/>
    ${hr.front}
    <ellipse cx="73" cy="99" rx="9.500" ry="6" fill="#f08c86" opacity=".5"/><ellipse cx="127" cy="99" rx="9.500" ry="6" fill="#f08c86" opacity=".5"/>
    <path d="M76 88 Q83 79 91 88" stroke="${INK}" stroke-width="3.400" stroke-linecap="round" fill="none"/><path d="M109 88 Q117 79 124 88" stroke="${INK}" stroke-width="3.400" stroke-linecap="round" fill="none"/>
    <path d="M91 103 Q100 112 109 103" stroke="#a8503c" stroke-width="2.800" stroke-linecap="round" fill="none"/>
    <ellipse cx="100" cy="96" rx="2" ry="1.400" fill="${SKIN_D}"/>
    ${hat}`;
}

/** Vẽ nhân vật. Trả chuỗi SVG. */
export function characterSvg(look: Look, opts: CharacterOpts = {}): string {
  const size = opts.size ?? 200;
  const id = `cp${++uidN}`;
  const aura = opts.aura ?? true;
  const shadow = opts.shadow ?? true;
  const breathe = opts.breathe ?? true;
  const pose = opts.pose ?? 'pray';
  const label = look.name ? `Nhân vật ${look.name}` : 'Nhân vật';
  const body = `${outfitSvg(look, pose)}${headSvg(look)}`;
  return `<svg class="cp${opts.class ? ' ' + opts.class : ''}" width="${size}" height="${Math.round(size * 1.2)}" viewBox="0 0 200 240" role="img" aria-label="${label}">
<style>@keyframes ${id}b{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-1.5px) scale(1.012,1.018)}}.${id}b{transform-origin:100px 216px;animation:${id}b 4s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.${id}b{animation:none}}</style>
<defs><radialGradient id="${id}a" cx="50%" cy="48%" r="50%"><stop offset="0" stop-color="#f3c973" stop-opacity=".34"/><stop offset=".62" stop-color="#e0b25c" stop-opacity=".1"/><stop offset="1" stop-color="#e0b25c" stop-opacity="0"/></radialGradient></defs>
${aura ? `<circle cx="100" cy="112" r="98" fill="url(#${id}a)"/><circle cx="100" cy="112" r="94" fill="none" stroke="#e0b25c" stroke-opacity=".5" stroke-width="1"/>` : ''}
${shadow ? `<ellipse cx="100" cy="224" rx="50" ry="8" fill="rgba(0,0,0,.5)"/><ellipse cx="100" cy="224" rx="62" ry="10.500" fill="none" stroke="#e0b25c" stroke-opacity=".28"/>` : ''}
<g class="${breathe ? id + 'b' : ''}"><ellipse cx="84" cy="217" rx="15" ry="7" fill="#2a1d14"/><ellipse cx="116" cy="217" rx="15" ry="7" fill="#2a1d14"/>${body}</g>
</svg>`;
}
