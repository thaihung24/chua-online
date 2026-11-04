/**
 * Tượng & vật trang trí điêu khắc dựng thủ tục: Phật Thích Ca ngồi toà sen, Quan Thế Âm, hạc đồng đứng trên rùa,
 * lân/sư tử đá, đài sen, tăng sĩ hộ pháp… Toàn bộ low-poly mượt, gộp vào Batch.
 */
import * as THREE from 'three';
import { Batch, between, lathe, limb, TAU, xf } from './core';
import type { Mats } from './materials';

const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

/** Toà sen: hai hàng cánh + đế tròn. Đáy tại y. */
export function lotusThrone(b: Batch, m: Mats, x: number, y: number, z: number, r: number, h: number, petals = 14, gold = true): void {
  const mat = gold ? m.gold : m.paint;
  const base = new THREE.CylinderGeometry(r * 0.78, r * 0.9, h * 0.22, 24);
  b.add(base, mat, xf(x, y + h * 0.11, z), gold ? 0xd9a43a : 0xf3b7c6);
  for (let ring = 0; ring < 2; ring++) {
    const n = ring === 0 ? petals : petals - 2;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + ring * 0.22;
      const rr = r * (ring === 0 ? 0.82 : 0.62);
      const px = x + Math.sin(a) * rr, pz = z + Math.cos(a) * rr;
      const col = gold ? (ring === 0 ? 0xf0c25c : 0xffd980) : (ring === 0 ? 0xf6b9ca : 0xfbd5df);
      b.add(new THREE.SphereGeometry(1, 8, 6), mat, xf(px, y + h * (0.28 + ring * 0.2) + h * 0.22, pz, a, r * 0.2, h * 0.34, r * 0.07, -0.55 + ring * 0.2), col);
    }
  }
  b.cyl(mat, r * 0.52, r * 0.6, h * 0.12, 20, x, y + h * 0.78, z, gold ? 0xe5b44a : 0xf0a8ba);
}

/** Đức Phật Thích Ca ngồi thiền (hướng +z). Đáy ở y. Cao ~2.6*scale. */
export function buddha(b: Batch, m: Mats, x: number, y: number, z: number, s = 1): void {
  const g = m.gold;
  const skin = 0xf3cd62, robe = 0xd8931f, hair = 0x2a2c4e;
  const P = (px: number, py: number, pz: number): THREE.Vector3 => V(x + px * s, y + py * s, z + pz * s);
  const sp = (px: number, py: number, pz: number, rx: number, ry: number, rz: number, c: number, seg = 12): void =>
    b.add(new THREE.SphereGeometry(1, seg, Math.max(6, seg >> 1)), g, xf(x + px * s, y + py * s, z + pz * s, 0, rx * s, ry * s, rz * s), c);
  // kiết già
  sp(0, 0.3, 0.05, 1.12, 0.3, 0.78, robe);
  sp(-0.78, 0.38, 0.5, 0.42, 0.22, 0.34, robe); sp(0.78, 0.38, 0.5, 0.42, 0.22, 0.34, robe);
  // thân
  b.add(lathe([[0.001, 0.2], [0.78, 0.25], [0.74, 0.7], [0.58, 1.25], [0.5, 1.6], [0.3, 1.78], [0.001, 1.8]], 16), g, xf(x, y, z, 0, s, s, s * 0.74), robe);
  // vai trần + y vắt (vai phải trần: nửa thân da)
  sp(-0.5, 1.5, 0.05, 0.27, 0.22, 0.27, robe); sp(0.52, 1.5, 0.05, 0.27, 0.22, 0.27, skin);
  sp(-0.12, 1.1, 0.34, 0.5, 0.55, 0.22, skin); // ngực lộ
  b.add(new THREE.TorusGeometry(0.62, 0.05, 6, 18, Math.PI), g, xf(x, y + 1.2 * s, z + 0.14 * s, 0, s, s, s, 0, 0.7), robe);
  // tay
  limb(b, g, P(-0.55, 1.5, 0), P(-0.82, 0.85, 0.12), 0.15 * s, 0.12 * s, robe);
  limb(b, g, P(0.55, 1.5, 0), P(0.82, 0.85, 0.12), 0.15 * s, 0.12 * s, skin);
  limb(b, g, P(-0.82, 0.85, 0.12), P(-0.2, 0.62, 0.6), 0.12 * s, 0.1 * s, robe);
  limb(b, g, P(0.82, 0.85, 0.12), P(0.2, 0.62, 0.6), 0.12 * s, 0.1 * s, skin);
  sp(0, 0.6, 0.62, 0.34, 0.1, 0.22, skin);
  // cổ + đầu
  b.add(new THREE.CylinderGeometry(0.16 * s, 0.2 * s, 0.3 * s, 10), g, xf(x, y + 1.82 * s, z + 0.02 * s), skin);
  sp(0, 2.18, 0.04, 0.4, 0.44, 0.4, skin, 16);
  b.add(new THREE.SphereGeometry(1, 16, 8, 0, TAU, 0, 1.28), g, xf(x, y + 2.2 * s, z + 0.0, 0, 0.425 * s, 0.46 * s, 0.425 * s), hair);
  sp(0, 2.66, 0.0, 0.2, 0.17, 0.2, hair);
  sp(0, 2.82, 0.0, 0.07, 0.08, 0.07, 0xffd36a);
  // tai
  sp(-0.4, 2.1, 0.02, 0.06, 0.25, 0.07, skin); sp(0.4, 2.1, 0.02, 0.06, 0.25, 0.07, skin);
  // mặt
  sp(-0.14, 2.2, 0.37, 0.09, 0.03, 0.03, 0x4a2a14, 8); sp(0.14, 2.2, 0.37, 0.09, 0.03, 0.03, 0x4a2a14, 8);
  sp(0, 2.1, 0.41, 0.05, 0.07, 0.05, skin, 8);
  sp(0, 1.99, 0.38, 0.1, 0.03, 0.04, 0xb4562c, 8);
  sp(0, 2.34, 0.4, 0.035, 0.035, 0.02, 0xffefb0, 8);
}

/** Tượng Quan Thế Âm Bồ Tát đứng (ngọc trắng), hướng theo góc `ry` (0 = +z). Cao ~5.4*scale. Đáy ở y. */
export function guanyin(b: Batch, m: Mats, x: number, y: number, z: number, s = 1, ry = 0): void {
  const j = m.jade;
  const white = 0xf6f3ea, shade = 0xe3dfd2;
  const cs = Math.cos(ry), sn = Math.sin(ry);
  const L = (lx: number, ly: number, lz: number): THREE.Vector3 => V(x + (lx * cs + lz * sn) * s, y + ly * s, z + (-lx * sn + lz * cs) * s);
  const M = (lx: number, ly: number, lz: number, sx = 1, sy = 1, sz = 1, rx = 0, rz = 0, ryOff = 0): THREE.Matrix4 => {
    const p = L(lx, ly, lz);
    return xf(p.x, p.y, p.z, ry + ryOff, sx * s, sy * s, sz * s, rx, rz);
  };
  // áo choàng dài: lathe có nếp gấp
  const prof: [number, number][] = [[0.001, 0], [1.05, 0.05], [1.0, 0.5], [0.86, 1.5], [0.64, 2.6], [0.52, 3.3], [0.5, 3.8], [0.4, 4.1], [0.001, 4.2]];
  const robe = lathe(prof, 36);
  const rp = robe.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < rp.count; i++) {
    const px = rp.getX(i), pz = rp.getZ(i), py = rp.getY(i);
    const r = Math.hypot(px, pz); if (r < 0.01) continue;
    const a = Math.atan2(px, pz);
    const k = 1 + 0.07 * Math.sin(a * 6 + py * 0.9) * Math.min(1, py / 0.8) * (1 - py / 5);
    rp.setXYZ(i, px * k, py, pz * k);
  }
  robe.computeVertexNormals();
  b.add(robe, j, M(0, 0, 0, 1, 1, 0.82), white);
  // khăn choàng (voan) rũ hai bên
  const veil = new THREE.LatheGeometry(
    [[0.34, 4.95], [0.5, 4.55], [0.66, 3.9], [0.8, 3.0], [0.9, 2.0], [0.95, 1.4]].map(([r, py]) => new THREE.Vector2(r, py)), 28, Math.PI * 0.3, Math.PI * 1.4);
  b.add(veil, j, M(0, 0, -0.06, 1, 1, 0.9), shade);
  // thắt lưng + dải ngọc rủ trước bụng
  b.add(new THREE.TorusGeometry(0.64, 0.05, 6, 24), j, M(0, 2.7, 0, 1, 1, 0.82, Math.PI / 2), 0xd9d3bf);
  b.add(new THREE.BoxGeometry(0.14, 1.35, 0.05), m.gold, M(0, 2.0, 0.62, 1, 1, 1, -0.14), 0xe8c468);
  // vai + tay
  for (const sx of [-0.46, 0.46]) b.add(new THREE.SphereGeometry(1, 10, 8), j, M(sx, 3.95, 0, 0.22, 0.2, 0.22), white);
  // tay phải co lên cầm bình cam lồ
  const el1 = V(0.78, 3.35, 0.2), hd1 = V(0.42, 3.38, 0.78);
  limb(b, j, L(0.46, 3.95, 0), L(el1.x, el1.y, el1.z), 0.16 * s, 0.13 * s, white);
  limb(b, j, L(el1.x, el1.y, el1.z), L(hd1.x, hd1.y, hd1.z), 0.13 * s, 0.1 * s, white);
  // tay trái buông cầm cành dương liễu
  const el2 = V(-0.82, 3.1, 0.18), hd2 = V(-0.7, 2.72, 0.62);
  limb(b, j, L(-0.46, 3.95, 0), L(el2.x, el2.y, el2.z), 0.16 * s, 0.13 * s, white);
  limb(b, j, L(el2.x, el2.y, el2.z), L(hd2.x, hd2.y, hd2.z), 0.13 * s, 0.1 * s, white);
  // bình cam lồ ngọc & vàng
  b.add(lathe([[0.001, 0], [0.16, 0.02], [0.22, 0.16], [0.15, 0.32], [0.07, 0.42], [0.1, 0.56], [0.001, 0.56]], 14), m.gold, M(0.42, 3.4, 0.82), 0xe8c058);
  // cành dương liễu
  const wp = [L(-0.7, 2.74, 0.62), L(-0.95, 3.3, 0.7), L(-1.05, 3.9, 0.55), L(-0.9, 4.4, 0.35)];
  const wCurve = new THREE.CatmullRomCurve3(wp);
  b.add(new THREE.TubeGeometry(wCurve, 10, 0.03 * s, 5), m.foliage, undefined, 0x6a8a3a);
  for (let i = 0; i < 9; i++) {
    const p = wCurve.getPoint(0.28 + i * 0.08);
    b.add(new THREE.SphereGeometry(1, 5, 4), m.foliage, xf(p.x, p.y, p.z, ry + i, 0.06 * s, 0.22 * s, 0.05 * s, 0, 0.8), 0x8cb04a);
  }
  // cổ + đầu + chuỗi anh lạc
  b.add(new THREE.CylinderGeometry(0.14, 0.18, 0.3, 10), j, M(0, 4.18, 0), white);
  b.add(new THREE.TorusGeometry(0.26, 0.028, 6, 18, Math.PI), m.gold, M(0, 3.96, 0.16, 1, 1, 1, Math.PI * 0.65), 0xf0ca6a);
  b.add(new THREE.SphereGeometry(1, 16, 12), j, M(0, 4.5, 0.02, 0.34, 0.38, 0.34), white);
  // tóc búi + mão Phật A Di Đà
  b.add(new THREE.SphereGeometry(1, 14, 8, 0, TAU, 0, 1.35), m.paint, M(0, 4.54, -0.02, 0.365, 0.4, 0.37), 0x2a2932);
  b.add(new THREE.SphereGeometry(1, 10, 8), m.paint, M(0, 4.98, -0.04, 0.19, 0.17, 0.19), 0x2a2932);
  b.add(new THREE.TorusGeometry(0.34, 0.045, 6, 22), m.gold, M(0, 4.76, 0, 1, 1, 1, Math.PI / 2 - 0.2), 0xe8bc52);
  b.add(new THREE.ConeGeometry(0.08, 0.26, 6), m.gold, M(0, 4.9, 0.32), 0xffd875);
  // tai dài phúc hậu
  for (const sx of [-0.34, 0.34]) b.add(new THREE.SphereGeometry(1, 8, 6), j, M(sx, 4.44, 0.02, 0.05, 0.18, 0.06), white);
  // nét mặt từ bi
  for (const sx of [-0.12, 0.12]) b.add(new THREE.SphereGeometry(1, 8, 6), m.paint, M(sx, 4.52, 0.34, 0.075, 0.02, 0.025), 0x5c4a3e);
  b.add(new THREE.SphereGeometry(1, 8, 6), j, M(0, 4.44, 0.36, 0.04, 0.065, 0.045), white);
  b.add(new THREE.SphereGeometry(1, 8, 6), m.paint, M(0, 4.35, 0.35, 0.065, 0.022, 0.028), 0xc97b72);
  b.add(new THREE.SphereGeometry(1, 6, 6), m.gold, M(0, 4.64, 0.34, 0.025, 0.025, 0.02), 0xffdf80);
  // đế sen hồng trắng
  lotusThrone(b, m, x, y, z, 1.38 * s, 0.72 * s, 16, false);
}

/** Con rùa đá/đồng. */
export function turtle(b: Batch, m: Mats, x: number, y: number, z: number, s = 1, ry = 0): void {
  const mat = m.bronze;
  b.add(new THREE.SphereGeometry(1, 14, 8), mat, xf(x, y + 0.32 * s, z, ry, 0.95 * s, 0.4 * s, 1.15 * s), 0x8a6a3a);
  b.add(new THREE.SphereGeometry(1, 10, 8), mat, xf(x + Math.sin(ry) * 1.2 * s, y + 0.38 * s, z + Math.cos(ry) * 1.2 * s, ry, 0.28 * s, 0.24 * s, 0.34 * s), 0x9a7a44);
  for (const [dx, dz] of [[-0.7, 0.55], [0.7, 0.55], [-0.7, -0.55], [0.7, -0.55]] as const) {
    const cx = Math.cos(ry), sy = Math.sin(ry);
    b.add(new THREE.SphereGeometry(1, 8, 6), mat, xf(x + (dx * cx + dz * sy) * s, y + 0.12 * s, z + (-dx * sy + dz * cx) * s, ry, 0.22 * s, 0.1 * s, 0.3 * s), 0x8a6a3a);
  }
}

/** Hạc đồng đứng trên rùa (hướng quay ry, mặc định +z). Cao ~3.3*s. */
export function crane(b: Batch, m: Mats, x: number, y: number, z: number, s = 1, ry = 0): void {
  const mat = m.bronze, gold = m.gold;
  turtle(b, m, x, y, z, s * 1.1, ry);
  const cs = Math.cos(ry), sn = Math.sin(ry);
  const L = (lx: number, ly: number, lz: number): THREE.Vector3 => V(x + (lx * cs + lz * sn) * s, y + ly * s, z + (-lx * sn + lz * cs) * s);
  const body = (lx: number, ly: number, lz: number, rx: number, ry2: number, rz: number, rot: number, col: number, mm: THREE.Material = mat): void => {
    const p = L(lx, ly, lz);
    b.add(new THREE.SphereGeometry(1, 12, 8), mm, xf(p.x, p.y, p.z, ry, rx * s, ry2 * s, rz * s, rot), col);
  };
  // chân
  limb(b, gold, L(-0.12, 0.55, 0.0), L(-0.12, 1.5, 0.0), 0.035 * s, 0.03 * s, 0xc9953a, 5);
  limb(b, gold, L(0.12, 0.55, 0.0), L(0.12, 1.5, 0.0), 0.035 * s, 0.03 * s, 0xc9953a, 5);
  // thân
  body(0, 1.75, -0.05, 0.4, 0.34, 0.8, 0.0, 0xd0a04a, gold);
  body(0, 1.82, 0.5, 0.3, 0.3, 0.38, 0.0, 0xd8aa52, gold);
  // cánh (ôm gọn duyên dáng hai bên thân) + lông cánh
  for (const sx of [-1, 1]) {
    body(sx * 0.34, 1.84, -0.1, 0.14, 0.28, 0.78, -0.08, 0xe2b862, gold);
    for (let i = 0; i < 4; i++) body(sx * (0.36 + i * 0.04), 1.72 - i * 0.06, -0.58 - i * 0.18, 0.055, 0.045, 0.44, -0.12, 0xc58f35, gold);
  }
  // đuôi
  for (let i = -2; i <= 2; i++) body(i * 0.06, 1.74 + Math.abs(i) * 0.02, -0.95 - Math.abs(i) * 0.05, 0.04, 0.035, 0.48, -0.15, 0xb88332, mat);
  // cổ cong duyên + đầu + hoa sen ngậm mỏ
  const neck = new THREE.CatmullRomCurve3([L(0, 1.9, 0.56), L(0, 2.38, 0.72), L(0, 2.86, 0.64), L(0, 3.16, 0.76), L(0, 3.3, 0.92)]);
  b.add(new THREE.TubeGeometry(neck, 14, 0.068 * s, 7), gold, undefined, 0xe0b35a);
  const head = L(0, 3.32, 0.96);
  b.add(new THREE.SphereGeometry(1, 10, 8), gold, xf(head.x, head.y, head.z, ry, 0.1 * s, 0.1 * s, 0.14 * s), 0xe8bc60);
  const beakA = L(0, 3.3, 1.04), beakB = L(0, 3.2, 1.48);
  b.add(new THREE.CylinderGeometry(0.005, 0.042 * s, 1, 6), mat, between(beakA, beakB), 0x8a602c);
  b.add(new THREE.SphereGeometry(1, 6, 6), mat, xf(L(0, 3.4, 0.93).x, L(0, 3.4, 0.93).y, L(0, 3.4, 0.93).z, ry, 0.05 * s, 0.06 * s, 0.05 * s), 0xc03020);
}

/** Nghê / sư tử đá ngồi (hướng +z) trên bệ chạm. */
export function guardianLion(b: Batch, m: Mats, x: number, y: number, z: number, s = 1, ry = 0, mirror = 1): void {
  const st = m.stone;
  const cs = Math.cos(ry), sn = Math.sin(ry);
  const L = (lx: number, ly: number, lz: number): THREE.Vector3 => V(x + (lx * cs + lz * sn) * s, y + ly * s, z + (-lx * sn + lz * cs) * s);
  const e = (lx: number, ly: number, lz: number, rx: number, ry2: number, rz: number, col: number, rot = 0): void => {
    const p = L(lx, ly, lz);
    b.add(new THREE.SphereGeometry(1, 10, 8), st, xf(p.x, p.y, p.z, ry, rx * s, ry2 * s, rz * s, rot), col);
  };
  const c = 0xa8a398, c2 = 0x8b867c, dark = 0x625e56;
  b.box(st, 1.08 * s, 0.28 * s, 1.28 * s, x, y, z, ry, 0x7a756b);
  b.box(st, 0.96 * s, 0.12 * s, 1.14 * s, x, y + 0.28 * s, z, ry, c2);
  e(0, 0.78, -0.1, 0.34, 0.42, 0.44, c, -0.35);       // thân ngồi vạm vỡ
  e(0, 0.84, 0.16, 0.31, 0.44, 0.24, c, 0.1);         // ngực nở
  // chân trước + cầu đá dưới chân
  limb(b, st, L(-0.22, 0.78, 0.2), L(-0.22, 0.42, 0.32), 0.1 * s, 0.09 * s, c, 7);
  limb(b, st, L(0.22, 0.78, 0.2), L(0.22, 0.48, 0.34), 0.1 * s, 0.09 * s, c, 7);
  e(-0.22 * mirror, 0.44, 0.35, 0.11, 0.08, 0.13, c2);
  e(0.22 * mirror, 0.5, 0.38, 0.13, 0.13, 0.13, 0xbab4a6); // quả cầu thêu
  // đầu chạm khắc + bờm xoắn ốc
  e(0, 1.24, 0.22, 0.3, 0.28, 0.28, c);
  e(0, 1.15, 0.44, 0.22, 0.14, 0.16, c2);             // mõm rộng
  e(0, 1.07, 0.42, 0.18, 0.06, 0.12, dark);           // hàm dưới
  for (let i = 0; i < 9; i++) {                        // các cụm bờm xoắn
    const a = (i / 8) * Math.PI * 1.3 - Math.PI * 0.65;
    e(Math.sin(a) * 0.3, 1.26 + Math.cos(a) * 0.22, 0.08, 0.11, 0.11, 0.11, c2);
  }
  e(-0.22, 1.44, 0.16, 0.09, 0.12, 0.06, c2); e(0.22, 1.44, 0.16, 0.09, 0.12, 0.06, c2);
  e(-0.12, 1.31, 0.45, 0.075, 0.035, 0.04, c2); e(0.12, 1.31, 0.45, 0.075, 0.035, 0.04, c2); // mày đá
  e(-0.12, 1.26, 0.47, 0.045, 0.04, 0.035, dark); e(0.12, 1.26, 0.47, 0.045, 0.04, 0.035, dark);
  e(0, 0.62, -0.54, 0.13, 0.28, 0.12, c2, 0.55);      // đuôi vểnh
}

/** Tăng sĩ/hộ pháp đứng nhỏ (dùng bên bàn thờ). */
export function attendant(b: Batch, m: Mats, x: number, y: number, z: number, s = 1, face = 0): void {
  const g = m.gold;
  const robeC = 0xcf8f2a, skin = 0xefc860;
  b.add(lathe([[0.001, 0], [0.42, 0.04], [0.38, 0.6], [0.3, 1.1], [0.2, 1.3], [0.001, 1.32]], 14), g, xf(x, y, z, face, s, s, s), robeC);
  b.add(new THREE.SphereGeometry(1, 12, 10), g, xf(x, y + 1.55 * s, z, face, 0.2 * s, 0.22 * s, 0.2 * s), skin);
  b.add(new THREE.SphereGeometry(1, 12, 6, 0, TAU, 0, 1.3), g, xf(x, y + 1.57 * s, z, face, 0.205 * s, 0.22 * s, 0.205 * s), 0x30323e);
  const cs = Math.cos(face), sn = Math.sin(face);
  const P = (lx: number, ly: number, lz: number): THREE.Vector3 => V(x + (lx * cs + lz * sn) * s, y + ly * s, z + (-lx * sn + lz * cs) * s);
  limb(b, g, P(-0.22, 1.25, 0), P(-0.05, 0.9, 0.2), 0.07 * s, 0.06 * s, robeC);
  limb(b, g, P(0.22, 1.25, 0), P(0.05, 0.9, 0.2), 0.07 * s, 0.06 * s, robeC);
  b.add(new THREE.SphereGeometry(1, 8, 6), g, xf(P(0, 0.9, 0.24).x, P(0, 0.9, 0.24).y, P(0, 0.9, 0.24).z, face, 0.08 * s, 0.07 * s, 0.07 * s), skin);
}
