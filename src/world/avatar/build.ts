/**
 * Dựng các bộ phận nhân vật chibi (đầu, thân/áo, tay, chân) thành geometry gộp, tô màu đỉnh.
 * Kết quả được cache theo khoá (kiểu áo, màu, giới, phụ kiện) nên 100 người chơi dùng chung hình.
 * Toạ độ: nhân vật nhìn về +z, gốc ở chân (y=0). Hông cao 0.30, cổ ở +0.38 so với hông.
 */
import * as THREE from 'three';
import { OUTFIT_COLORS, type Gender, type OutfitId, type Profile } from '@/core/contracts';
import { ball, box, lathe, merge, mix, paint, profileR, shade, tube, xf, type V3 } from './geo';
import { braceletGeoms, canonicalAccessory, conicalHatGeoms, haloGeometry, torsoAccessoryGeoms, type AccessoryId } from './accessories';

export const DIM = {
  hipY: 0.3,
  hipX: 0.088,
  neckY: 0.38, // so với hông
  headR: 0.3,
  headUp: 0.27, // tâm đầu cao hơn cổ
  shoulderX: 0.165,
  shoulderY: 0.27, // so với hông
  upper: 0.125,
  fore: 0.125,
  thigh: 0.13,
  shin: 0.13,
} as const;

const SKIN = '#fdd3b1';
const SKIN_CROWN = '#d5b29a';
const SKIN_SHADE = '#f6b391';
const TRIM = '#fdf7ec';
const SHOE = '#402c22';

const cache = new Map<string, THREE.BufferGeometry>();
function part(key: string, build: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let g = cache.get(key);
  if (!g) { g = build(); cache.set(key, g); }
  return g;
}
/** Giải phóng toàn bộ cache hình (gọi khi huỷ thế giới). */
export function disposeBuildCache(): void {
  for (const g of cache.values()) g.dispose();
  cache.clear();
}

export interface Look {
  gender: Gender;
  outfit: OutfitId;
  hex: string;
  acc: AccessoryId | null;
}
export function lookOf(p: Profile): Look {
  const list = OUTFIT_COLORS[p.outfit] ?? OUTFIT_COLORS['trang-lam'];
  const idx = Math.max(0, Math.min(list.length - 1, p.colorIndex | 0));
  return { gender: p.gender, outfit: p.outfit in OUTFIT_COLORS ? p.outfit : 'trang-lam', hex: list[idx].hex, acc: canonicalAccessory(p.accessory) };
}

/** Đặt một đặc điểm khuôn mặt lên mặt cầu đầu: phương vị `az`, độ cao `el` (rad). */
function onHead(g: THREE.BufferGeometry, az: number, el: number, R: number): THREE.BufferGeometry {
  g.translate(0, 0, R);
  g.rotateX(-el);
  g.rotateY(az);
  return g;
}

/** Tô màu cầu đầu nam: da hồng hào ở mặt, chuyển mượt sang sắc đầu cạo ấm ở đỉnh/sau gáy (không tạo gờ). */
function paintMaleHead(g: THREE.BufferGeometry, R: number): THREE.BufferGeometry {
  const skinCol = new THREE.Color(SKIN);
  const crownCol = new THREE.Color(SKIN_CROWN);
  const chinCol = new THREE.Color('#ffd6ba');
  const tmp = new THREE.Color();
  const pos = g.attributes.position;
  const arr = new Float32Array(pos.count * 3);
  const ca = Math.cos(0.42), sa = Math.sin(0.42);
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), z = pos.getZ(i);
    const d = (y * ca - z * sa) / R;
    const tc = Math.max(0, Math.min(1, (d - 0.1) / 0.25));
    const sm = tc * tc * (3 - 2 * tc);
    const tch = Math.max(0, Math.min(1, (-y / R - 0.32) / 0.52));
    tmp.copy(skinCol).lerp(chinCol, tch * 0.35).lerp(crownCol, sm * 0.85);
    arr[i * 3] = tmp.r;
    arr[i * 3 + 1] = tmp.g;
    arr[i * 3 + 2] = tmp.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

/** Má hồng chuyển sắc mịn từ tâm ra rìa (trùng màu da ở mép ngoài) và ôm sát mặt cầu đầu. */
function blushPatch(rx: number, ry: number, az: number, el: number, R: number): THREE.BufferGeometry {
  const seg = 18;
  const inner = new THREE.Color('#ff8e9b');
  const mid = new THREE.Color('#ffb5bc');
  const outer = new THREE.Color(SKIN);
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const pushV = (lx: number, ly: number, col: THREE.Color): void => {
    const z = Math.sqrt(Math.max(0.01, R * R - lx * lx - ly * ly));
    positions.push(lx, ly, z);
    colors.push(col.r, col.g, col.b);
  };
  pushV(0, 0, inner);
  for (let ring = 0; ring < 2; ring++) {
    const k = ring === 0 ? 0.52 : 1.0;
    const col = ring === 0 ? mid : outer;
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pushV(Math.cos(a) * rx * k, Math.sin(a) * ry * k, col);
    }
  }
  for (let i = 0; i < seg; i++) {
    const n = (i + 1) % seg;
    indices.push(0, 1 + i, 1 + n);
    const r1 = 1 + i, r1n = 1 + n, r2 = 1 + seg + i, r2n = 1 + seg + n;
    indices.push(r1, r2, r1n, r1n, r2, r2n);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((positions.length / 3) * 2), 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  g.rotateX(-el);
  g.rotateY(az);
  return g;
}

// ───────────────────────── Đầu ─────────────────────────
export function headGeometry(look: Look): THREE.BufferGeometry {
  const hatKey = look.acc === 'conical-hat' ? 'hat' : 'nohat';
  return part(`head|${look.gender}|${hatKey}`, () => {
    const R = DIM.headR;
    const cranial: THREE.BufferGeometry[] = [];
    if (look.gender === 'male') {
      cranial.push(paintMaleHead(new THREE.SphereGeometry(R, 32, 24), R));
    } else {
      cranial.push(paint(new THREE.SphereGeometry(R, 30, 22), SKIN));
      const hair = '#2b1f1d';
      const cap = paint(new THREE.SphereGeometry(R * 1.03, 28, 16, 0, Math.PI * 2, 0, 1.72), hair);
      cap.rotateX(-0.4);
      cranial.push(cap);
      // lọn tóc hai bên má
      for (const s of [-1, 1]) cranial.push(ball(0.068, hair, [s * 0.285, -0.02, 0.005], [0.55, 1.48, 0.9], [10, 8]));
      // tóc dài buông sau lưng
      cranial.push(ball(0.26, hair, [0, -0.1, -0.1], [1.0, 1.15, 0.78], [16, 12]));
      cranial.push(ball(0.19, hair, [0, -0.3, -0.12], [1.0, 1.15, 0.6], [14, 10]));
      // búi tóc (ẩn khi đội nón lá để không xuyên chóp nón)
      if (look.acc !== 'conical-hat') {
        cranial.push(ball(0.095, hair, [0, 0.305, -0.09], [1, 0.9, 1], [14, 10]));
        cranial.push(ball(0.045, '#f0c762', [0.0, 0.27, -0.045], [1, 0.5, 1], [8, 6]));
      }
    }
    // mắt cười cong ^ ^ có đầu bo tròn
    const eyeCol = '#3b2219';
    for (const s of [-1, 1]) {
      const eyeParts: THREE.BufferGeometry[] = [
        paint(new THREE.TorusGeometry(0.039, 0.011, 7, 16, Math.PI), eyeCol),
        ball(0.011, eyeCol, [-0.039, 0, 0], 1, [6, 5]),
        ball(0.011, eyeCol, [0.039, 0, 0], 1, [6, 5]),
      ];
      if (look.gender === 'female') {
        const lash = paint(new THREE.CapsuleGeometry(0.0052, 0.02, 3, 5), eyeCol);
        lash.rotateZ(-s * 0.9);
        lash.translate(s * 0.042, 0.028, 0);
        eyeParts.push(lash);
      }
      const eye = merge(eyeParts);
      onHead(eye, s * 0.39, -0.055, R * 1.003);
      cranial.push(eye);
    }
    // miệng cười bo tròn hai đầu
    const mouth = merge([
      xf(paint(new THREE.TorusGeometry(0.027, 0.009, 6, 14, Math.PI), '#c44b47'), [0, 0, 0], [0, 0, Math.PI]),
      ball(0.009, '#c44b47', [-0.027, 0, 0], 1, [6, 5]),
      ball(0.009, '#c44b47', [0.027, 0, 0], 1, [6, 5]),
    ]);
    mouth.translate(0, 0.014, 0);
    onHead(mouth, 0, -0.41, R * 1.003);
    cranial.push(mouth);
    // má hồng chuyển sắc mịn
    for (const s of [-1, 1]) {
      cranial.push(blushPatch(0.064, 0.044, s * 0.64, -0.29, R * 1.003));
    }
    const cr = merge(cranial);
    cr.scale(1.045, 0.96, 1.0);
    const list: THREE.BufferGeometry[] = [cr];
    // tai
    for (const s of [-1, 1]) {
      list.push(ball(0.06, SKIN_SHADE, [s * R * 1.03, -0.02, -0.01], [0.5, 1.0, 0.85], [10, 8]));
    }
    if (look.acc === 'conical-hat') list.push(...conicalHatGeoms());
    // tịnh tiến tâm đầu lên so với khớp cổ
    const out = merge(list);
    out.translate(0, DIM.headUp, 0);
    return out;
  });
}

// ───────────────────────── Thân ─────────────────────────
interface TorsoSpec { shell: [number, number][]; zs: number }
const TRANG_SHELL: [number, number][] = [
  [0.001, -0.14], [0.23, -0.14], [0.245, -0.11], [0.226, -0.02], [0.2, 0.08], [0.18, 0.18], [0.165, 0.26], [0.125, 0.32], [0.078, 0.36], [0.05, 0.375],
];
const BABA_SHELL: [number, number][] = [
  [0.001, -0.075], [0.2, -0.075], [0.206, -0.05], [0.19, 0.06], [0.172, 0.16], [0.16, 0.25], [0.125, 0.32], [0.078, 0.36], [0.05, 0.375],
];
const AODAI_SHELL: [number, number][] = [
  [0.001, -0.045], [0.187, -0.045], [0.191, -0.01], [0.168, 0.12], [0.166, 0.22], [0.132, 0.3], [0.078, 0.355], [0.05, 0.375],
];

function torsoSpec(o: OutfitId): TorsoSpec {
  if (o === 'ba-ba') return { shell: BABA_SHELL, zs: 0.9 };
  if (o === 'ao-dai') return { shell: AODAI_SHELL, zs: 0.82 };
  return { shell: TRANG_SHELL, zs: 0.88 };
}

export function torsoGeometry(look: Look): THREE.BufferGeometry {
  const accKey = look.acc === 'hat-tram' || look.acc === 'scarf-gold' || look.acc === 'bag-brocade' ? look.acc : '-';
  return part(`torso|${look.outfit}|${look.hex}|${look.gender}|${accKey}`, () => {
    const { shell, zs } = torsoSpec(look.outfit);
    const main = new THREE.Color(look.hex);
    const list: THREE.BufferGeometry[] = [];
    const surf = (y: number): number => profileR(shell, y);
    const zf = (y: number): number => surf(y) * zs;
    list.push(lathe(shell, main, zs, 20));

    // viền cổ trắng (mọi kiểu áo)
    const collar = paint(new THREE.TorusGeometry(0.083, 0.021, 6, 18), TRIM);
    list.push(xf(collar, [0, 0.352, 0.004], [Math.PI / 2 - 0.2, 0, 0], [1, zs + 0.06, 1]));

    if (look.outfit === 'trang-xam' || look.outfit === 'trang-lam') {
      // viền gấu áo
      const hem = paint(new THREE.TorusGeometry(0.2425, 0.0135, 6, 30), TRIM);
      list.push(xf(hem, [0, -0.12, 0], [Math.PI / 2, 0, 0], [1, zs, 1]));
      // cổ chéo chữ V (áo tràng)
      const a1: V3 = [0.075, 0.35, zf(0.35) + 0.002];
      const b1: V3 = [-0.015, 0.17, zf(0.17) + 0.006];
      const a2: V3 = [-0.075, 0.35, zf(0.35) + 0.002];
      const b2: V3 = [0.025, 0.17, zf(0.17) + 0.01];
      list.push(tube(a1, b1, 0.014, 0.014, TRIM, 6), tube(a2, b2, 0.014, 0.014, TRIM, 6));
      // vạt áo có đường may và nút
      list.push(tube([0.04, 0.17, zf(0.17) + 0.008], [0.1, -0.12, zf(-0.12) + 0.01], 0.008, 0.008, shade(main, 0.8), 5));
      list.push(ball(0.018, TRIM, [0.1, 0.27, zf(0.27) + 0.012], 1, [8, 6]));
      list.push(ball(0.018, TRIM, [0.115, 0.2, zf(0.2) + 0.012], 1, [8, 6]));
    } else if (look.outfit === 'ba-ba') {
      // hàng nút áo bà ba
      for (let i = 0; i < 5; i++) {
        const y = 0.31 - i * 0.075;
        list.push(ball(0.0145, TRIM, [0, y, zf(y) + 0.006], 1, [8, 6]));
      }
      list.push(tube([0, 0.335, zf(0.335) + 0.003], [0, -0.07, zf(-0.07) + 0.004], 0.006, 0.006, shade(main, 0.78), 5));
      // túi áo
      for (const s of [-1, 1]) {
        list.push(box(0.072, 0.058, 0.01, shade(main, 0.85), [s * 0.095, -0.005, zf(-0.005) * 0.95 + 0.004], [-0.14, s * 0.48, 0]));
      }
      // lưng quần
      list.push(xf(paint(new THREE.CylinderGeometry(0.188, 0.19, 0.06, 20, 1), shade(main, 0.5)), [0, -0.085, 0], undefined, [1, 1, zs]));
    } else {
      // áo dài: hai tà trước/sau, xẻ hai bên lộ quần trắng
      const flap = (start: number, col: THREE.ColorRepresentation, h: number, y: number, rt: number, rb: number): THREE.BufferGeometry => {
        const g = paint(new THREE.CylinderGeometry(rt, rb, h, 14, 1, true, start, 2.05), col);
        g.scale(1, 1, 0.82);
        g.translate(0, y, 0);
        return g;
      };
      const gold = '#e8c264';
      for (const base of [-1.025, Math.PI - 1.025]) {
        list.push(flap(base, main, 0.27, -0.155, 0.19, 0.235));
        list.push(flap(base, gold, 0.025, -0.282, 0.2325, 0.236));
      }
      // cúc áo dài (chéo vai → nách)
      for (let i = 0; i < 5; i++) {
        const t = i / 4;
        const y = 0.34 - t * 0.12;
        const x = -0.05 + t * 0.15;
        list.push(ball(0.013, gold, [x, y, zf(y) + 0.006], 1, [8, 6]));
      }
      // viền cổ vàng nhỏ
      list.push(xf(paint(new THREE.TorusGeometry(0.0865, 0.009, 5, 18), gold), [0, 0.342, 0.006], [Math.PI / 2 - 0.2, 0, 0], [1, zs + 0.06, 1]));
    }

    list.push(...torsoAccessoryGeoms(look.acc, { surfR: surf, zs }));
    return merge(list);
  });
}

// ───────────────────────── Tay ─────────────────────────
interface ArmSpec { upperR: [number, number]; foreR: [number, number]; foreLen: number; handY: number; cuff: boolean }
function armSpec(o: OutfitId): ArmSpec {
  if (o === 'ba-ba') return { upperR: [0.056, 0.058], foreR: [0.058, 0.055], foreLen: 0.118, handY: -0.13, cuff: false };
  if (o === 'ao-dai') return { upperR: [0.052, 0.052], foreR: [0.052, 0.048], foreLen: 0.126, handY: -0.135, cuff: false };
  return { upperR: [0.064, 0.082], foreR: [0.082, 0.108], foreLen: 0.1, handY: -0.128, cuff: true };
}

export function upperArmGeometry(look: Look): THREE.BufferGeometry {
  return part(`uarm|${look.outfit}|${look.hex}`, () => {
    const s = armSpec(look.outfit);
    const main = look.hex;
    const list: THREE.BufferGeometry[] = [];
    list.push(ball(s.upperR[0] + 0.006, main, [0, 0, 0], 1, [16, 10]));
    list.push(xf(paint(new THREE.CylinderGeometry(s.upperR[0], s.upperR[1], DIM.upper, 16, 1), main), [0, -DIM.upper / 2, 0]));
    list.push(ball(s.upperR[1] + 0.003, main, [0, -DIM.upper, 0], 1, [16, 10]));
    return merge(list);
  });
}

export function foreArmGeometry(look: Look, right: boolean): THREE.BufferGeometry {
  const bracelet = right && look.acc === 'bracelet-jade';
  return part(`farm|${look.outfit}|${look.hex}|${bracelet ? 'b' : '-'}`, () => {
    const s = armSpec(look.outfit);
    const list: THREE.BufferGeometry[] = [];
    list.push(xf(paint(new THREE.CylinderGeometry(s.foreR[0], s.foreR[1], s.foreLen, 16, 1), look.hex), [0, -s.foreLen / 2, 0]));
    if (s.cuff) list.push(xf(paint(new THREE.TorusGeometry(s.foreR[1], 0.0125, 6, 16), TRIM), [0, -s.foreLen, 0], [Math.PI / 2, 0, 0]));
    // bàn tay
    list.push(ball(0.05, SKIN, [0, s.handY, 0.004], [1, 1.05, 0.9], [12, 10]));
    if (bracelet) list.push(...braceletGeoms(Math.abs(s.handY) - 0.008));
    return merge(list);
  });
}

// ───────────────────────── Chân ─────────────────────────
function pantsOf(look: Look): THREE.Color | string {
  if (look.outfit === 'ao-dai') return '#f4efe3';
  const c = new THREE.Color(look.hex);
  if (look.outfit === 'ba-ba') return c.multiplyScalar(0.42);
  return mix(c, '#1d1a18', 0.62);
}

export function thighGeometry(look: Look): THREE.BufferGeometry {
  return part(`thigh|${look.outfit}|${look.hex}`, () => {
    const c = pantsOf(look);
    const w = look.outfit === 'ba-ba' ? [0.075, 0.082] : [0.063, 0.06];
    const list: THREE.BufferGeometry[] = [];
    list.push(xf(paint(new THREE.CylinderGeometry(w[0], w[1], DIM.thigh, 10, 1), c), [0, -DIM.thigh / 2, 0]));
    list.push(ball(w[1], c, [0, -DIM.thigh, 0], 1, [10, 8]));
    return merge(list);
  });
}

export function shinGeometry(look: Look): THREE.BufferGeometry {
  return part(`shin|${look.outfit}|${look.hex}`, () => {
    const c = pantsOf(look);
    const w = look.outfit === 'ba-ba' ? [0.082, 0.09] : [0.058, 0.05];
    const list: THREE.BufferGeometry[] = [];
    list.push(xf(paint(new THREE.CylinderGeometry(w[0], w[1], DIM.shin, 10, 1), c), [0, -DIM.shin / 2, 0]));
    // tất trắng + giày
    if (look.outfit !== 'ba-ba') list.push(xf(paint(new THREE.CylinderGeometry(0.052, 0.054, 0.035, 10, 1), TRIM), [0, -DIM.shin + 0.012, 0]));
    list.push(ball(0.062, look.outfit === 'ao-dai' ? '#7a4b3a' : SHOE, [0, -DIM.shin + 0.0, 0.034], [0.95, 0.55, 1.5], [12, 8]));
    list.push(ball(0.05, '#e9dcc2', [0, -DIM.shin - 0.016, 0.03], [0.95, 0.12, 1.5], [10, 6]));
    return merge(list);
  });
}

/** Vạt áo phủ đùi khi ngồi (không dùng cho bà ba). */
export function lapGeometry(look: Look): THREE.BufferGeometry | null {
  if (look.outfit === 'ba-ba') return null;
  return part(`lap|${look.outfit}|${look.hex}`, () => {
    const g = paint(new THREE.SphereGeometry(0.2, 18, 10), look.hex);
    g.scale(1.22, 0.36, 0.95);
    g.translate(0, -0.015, 0.16);
    return g;
  });
}

// ───────────────────────── Hào quang sen ─────────────────────────
let haloGeo: THREE.BufferGeometry | null = null;
export function getHaloGeometry(): THREE.BufferGeometry {
  return (haloGeo ??= haloGeometry());
}
export function disposeHalo(): void { haloGeo?.dispose(); haloGeo = null; }
