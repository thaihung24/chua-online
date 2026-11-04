/**
 * Biểu tượng bảy bậc sen (Hạt sen → Sen ngàn cánh), vẽ SVG theo màu của `TIERS`.
 * Dùng ở nút cấp HUD, panel Hành trình, bảng xếp hạng, thẻ khoe thành tích.
 */
import { TIERS } from '@/core/contracts';
import { shade } from './character-preview';

let n = 0;

/** SVG tròn đóng khung cho bậc `tierId` (1..7). */
export function tierIcon(tierId: number, opts: { size?: number; ring?: boolean } = {}): string {
  const t = TIERS.find((x) => x.id === tierId) ?? TIERS[0];
  const size = opts.size ?? 40;
  const c = t.color;
  const a = t.accent;
  const dk = shade(c, -0.35);
  const id = `ti${++n}`;
  let art = '';
  const petal = (rot: number, ry = 13, rx = 5.2, y = -4, fill = c, op = 1) =>
    `<ellipse cx="0" cy="${y - ry / 2}" rx="${rx}" ry="${ry}" transform="rotate(${rot})" fill="${fill}" stroke="${dk}" stroke-width=".9" opacity="${op}"/>`;
  switch (t.id) {
    case 1: // hạt sen: hạt nâu nảy mầm
      art = `<ellipse cx="24" cy="27" rx="8" ry="10.500" transform="rotate(-20 24 27)" fill="${c}" stroke="${dk}" stroke-width="1"/><path d="M21 23 Q24 18 27 22" stroke="${a}" stroke-width="1.600" fill="none" stroke-linecap="round" opacity=".8"/><path d="M26 18 Q30 12 33 14" stroke="#9cc57a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      break;
    case 2: // mầm sen
      art = `<path d="M24 36 V24" stroke="${dk}" stroke-width="2" stroke-linecap="round"/><path d="M24 26 C14 26 10 18 12 13 C20 13 24 18 24 26Z" fill="${c}" stroke="${dk}" stroke-width="1"/><path d="M24 24 C34 24 38 16 36 11 C28 11 24 16 24 24Z" fill="${a}" stroke="${dk}" stroke-width="1"/>`;
      break;
    case 3: // lá sen
      art = `<path d="M24 38 V26" stroke="${dk}" stroke-width="2" stroke-linecap="round"/><ellipse cx="24" cy="22" rx="14" ry="9" fill="${c}" stroke="${dk}" stroke-width="1"/><path d="M24 22 L12 20M24 22 L36 20M24 22 L16 28M24 22 L32 28M24 22 V13" stroke="${a}" stroke-width="1" opacity=".7" stroke-linecap="round"/>`;
      break;
    case 4: // nụ sen
      art = `<g transform="translate(24 36)">${petal(-24, 17, 5.5, 0, shade(c, 0.1))}${petal(24, 17, 5.5, 0, shade(c, 0.1))}${petal(0, 19, 6, 0, a)}</g><path d="M24 36 V40" stroke="#6f9a4e" stroke-width="2"/>`;
      break;
    case 5: // sen hé
      art = `<g transform="translate(24 35)">${petal(-52, 15, 5.2, 0, shade(c, 0.12))}${petal(52, 15, 5.2, 0, shade(c, 0.12))}${petal(-26, 17, 5.6, 0, c)}${petal(26, 17, 5.6, 0, c)}${petal(0, 19, 6, 0, a)}</g>`;
      break;
    case 6: // sen nở
      art = `<g transform="translate(24 34)">${petal(-78, 14, 5, 0, shade(c, 0.15))}${petal(78, 14, 5, 0, shade(c, 0.15))}${petal(-52, 16, 5.4, 0, shade(c, 0.05))}${petal(52, 16, 5.4, 0, shade(c, 0.05))}${petal(-26, 18, 5.8, 0, c)}${petal(26, 18, 5.8, 0, c)}${petal(0, 20, 6.2, 0, a)}</g><circle cx="24" cy="31" r="2.600" fill="#f6d48a"/>`;
      break;
    default: {
      // sen ngàn cánh: nhiều lớp cánh + ánh vàng (tâm chuẩn 24,24 để không tràn khung 48×48)
      let s = '';
      for (let i = 0; i < 12; i++) s += petal(i * 30, 13.2, 4.2, 0, i % 2 ? a : c, 0.95);
      for (let i = 0; i < 8; i++) s += petal(i * 45 + 22.5, 9.2, 3.5, 0, i % 2 ? c : a, 0.95);
      art = `<circle cx="24" cy="24" r="21" fill="url(#${id}g)"/><g transform="translate(24 24)">${s}</g><circle cx="24" cy="24" r="3.400" fill="#fff2c4" stroke="${dk}" stroke-width=".8"/>`;
    }
  }
  return `<svg class="tier-icon" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><defs><radialGradient id="${id}g"><stop offset="0" stop-color="#f7e3a4" stop-opacity=".7"/><stop offset="1" stop-color="#f7e3a4" stop-opacity="0"/></radialGradient></defs>${opts.ring === false ? '' : `<circle cx="24" cy="24" r="22.500" fill="rgba(20,12,6,.45)" stroke="${a}" stroke-opacity=".55" stroke-width="1.200"/>`}${art}</svg>`;
}
