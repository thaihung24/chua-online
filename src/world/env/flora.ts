/**
 * Thực vật dựng thủ tục: hoa sen, bụi cây, bonsai chậu xanh, cây tùng, trúc, cây tròn/thông, bồn hoa.
 * Mọi hàm ghi vào một `Batch` (gộp tĩnh).
 */
import * as THREE from 'three';
import { Batch, jitter, limb, rng, TAU, xf } from './core';
import type { Mats } from './materials';

const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
const PETAL = new THREE.SphereGeometry(1, 7, 5);

/** Một bông sen: 3 vòng cánh + nhuỵ. open 0 (búp) … 1 (nở). */
export function addLotus(b: Batch, mat: THREE.Material, x: number, y: number, z: number, s = 1, open = 1, outer: THREE.ColorRepresentation = 0xf7c1d0, inner: THREE.ColorRepresentation = 0xf08fae, ry = 0): void {
  const rings = [{ n: 9, len: 0.5, tilt: 0.55 + 0.6 * open, r: 0.06, wid: 0.2, col: outer }, { n: 7, len: 0.44, tilt: 0.3 + 0.45 * open, r: 0.04, wid: 0.2, col: inner }, { n: 5, len: 0.34, tilt: 0.1 + 0.2 * open, r: 0.02, wid: 0.17, col: 0xfbd8e2 }];
  rings.forEach((rg, ri) => {
    for (let i = 0; i < rg.n; i++) {
      const a = (i / rg.n) * TAU + ri * 0.35 + ry;
      const cx = Math.sin(a) * (rg.r + 0.5 * rg.len * Math.sin(rg.tilt)), cz = Math.cos(a) * (rg.r + 0.5 * rg.len * Math.sin(rg.tilt));
      const cy = 0.5 * rg.len * Math.cos(rg.tilt) + ri * 0.03;
      b.add(PETAL, mat, xf(x + cx * s, y + cy * s, z + cz * s, a, rg.wid * s, rg.len * 0.5 * s, 0.07 * s, rg.tilt), rg.col);
    }
  });
  b.add(new THREE.CylinderGeometry(0.07 * s, 0.09 * s, 0.14 * s, 8), mat, xf(x, y + 0.12 * s, z), 0xf4c542);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    b.add(PETAL, mat, xf(x + Math.sin(a) * 0.1 * s, y + 0.15 * s, z + Math.cos(a) * 0.1 * s, a, 0.02 * s, 0.1 * s, 0.02 * s, 0.35), 0xf6d34a);
  }
}

/** Hình học một bông sen (gộp sẵn, có màu đỉnh) để dùng InstancedMesh. */
export function lotusGeometry(open: number): THREE.BufferGeometry {
  const mat = new THREE.MeshBasicMaterial();
  const b = new Batch(false);
  addLotus(b, mat, 0, 0, 0, 1, open);
  const g = new THREE.Group();
  const meshes = b.build(g);
  const geo = meshes[0].geometry;
  geo.computeBoundingSphere();
  mat.dispose();
  return geo;
}

/** Lá sen tròn có khuyết (phẳng, nằm ngang) bán kính 1. */
export function lotusPadGeometry(): THREE.BufferGeometry {
  const seg = 20;
  const pos: number[] = [0, 0.02, 0], idx: number[] = [], uv: number[] = [0.5, 0.5];
  const notch = 0.22;
  for (let i = 0; i <= seg; i++) {
    const a = notch + (i / seg) * (TAU - notch * 2);
    pos.push(Math.sin(a), 0.015 * Math.cos(a * 3), Math.cos(a));
    uv.push(0.5 + Math.sin(a) * 0.5, 0.5 + Math.cos(a) * 0.5);
  }
  for (let i = 1; i <= seg; i++) idx.push(0, i + 1, i);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const n = g.attributes.normal as THREE.BufferAttribute;
  if (n.getY(1) < 0) { const ix = g.index!; for (let k = 0; k < ix.count; k += 3) { const t = ix.getY(k); ix.setY(k, ix.getZ(k)); ix.setZ(k, t); } g.computeVertexNormals(); }
  return g;
}

export function bush(b: Batch, m: Mats, x: number, z: number, s = 1, color: THREE.ColorRepresentation = 0x4f8a3f, y = 0): void {
  const r = rng(Math.floor(Math.abs(x) * 31 + Math.abs(z) * 17 + 7));
  const c = new THREE.Color(color);
  for (let i = 0; i < 4; i++) {
    const a = r() * TAU, d = r() * 0.55 * s;
    const cc = c.clone().offsetHSL((r() - 0.5) * 0.03, 0, (r() - 0.5) * 0.12);
    b.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.28, i + 3), m.foliage, xf(x + Math.cos(a) * d, y + (0.45 + r() * 0.2) * s, z + Math.sin(a) * d, r() * 6, (0.55 + r() * 0.3) * s, (0.5 + r() * 0.2) * s, (0.55 + r() * 0.3) * s), cc, true);
  }
}

/** Bồn hoa: viền đá + đất + nhiều hoa nhỏ nhiều màu. */
export function flowerBed(b: Batch, m: Mats, x: number, z: number, w: number, d: number, seed: number, palette: number[] = [0xf08fae, 0xffd54a, 0xffffff, 0xff8a5b, 0xc58bff]): void {
  b.box(m.stone, w + 0.3, 0.26, d + 0.3, x, 0, z, 0, 0xa6a094);
  b.box(m.paint, w, 0.22, d, x, 0.12, z, 0, 0x4a3524);
  b.box(m.foliage, w * 0.96, 0.14, d * 0.96, x, 0.3, z, 0, 0x4f8a3a);
  const r = rng(seed);
  const n = Math.floor(w * d * 5);
  for (let i = 0; i < n; i++) {
    const px = x + (r() - 0.5) * (w - 0.2), pz = z + (r() - 0.5) * (d - 0.2), h = 0.18 + r() * 0.3;
    b.add(new THREE.CylinderGeometry(0.012, 0.012, h, 4), m.foliage, xf(px, 0.3 + h / 2, pz), 0x4a7d36);
    b.add(PETAL, m.paint, xf(px, 0.3 + h, pz, r() * 3, 0.1, 0.05, 0.1, -0.3), palette[Math.floor(r() * palette.length)]);
  }
}

/** Bonsai / mai / đào trong chậu men xanh trên bệ đá tròn hoặc vuông (cao ~2.1 * s). */
export function bonsai(b: Batch, m: Mats, x: number, z: number, s = 1, seed = 1, stand = true, leafColor: THREE.ColorRepresentation = 0x3f8a4c): void {
  const r = rng(seed * 97 + 5);
  const y0 = stand ? 0.68 * s : 0;
  if (stand) {
    b.cyl(m.stone, 0.52 * s, 0.58 * s, 0.14 * s, 14, x, 0, z, 0x989288);
    b.cyl(m.stone, 0.34 * s, 0.4 * s, 0.44 * s, 12, x, 0.14 * s, z, 0xa8a298);
    b.cyl(m.stone, 0.5 * s, 0.4 * s, 0.12 * s, 14, x, 0.58 * s, z, 0xb8b2a6);
  }
  const py = y0;
  b.add(new THREE.CylinderGeometry(0.52 * s, 0.32 * s, 0.38 * s, 14), m.paint, xf(x, py + 0.19 * s, z), 0x245594);
  b.add(new THREE.TorusGeometry(0.52 * s, 0.042 * s, 6, 18), m.paint, xf(x, py + 0.38 * s, z, 0, 1, 1, 1, Math.PI / 2), 0xeaf0fc);
  b.cyl(m.paint, 0.47 * s, 0.47 * s, 0.05 * s, 12, x, py + 0.35 * s, z, 0x42301e);
  const pts = [V(x, py + 0.38 * s, z), V(x + (0.16 - 0.32 * (seed % 2)) * s, py + 0.88 * s, z + 0.05 * s), V(x - 0.1 * s, py + 1.35 * s, z - 0.05 * s), V(x + 0.05 * s, py + 1.72 * s, z)];
  b.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, 0.075 * s, 6), m.bark, undefined, 0x5a4030);
  const tops = [[0.04, 1.82, 0, 0.62], [-0.54, 1.46, 0.1, 0.47], [0.54, 1.36, -0.1, 0.45], [0.0, 1.38, 0.48, 0.4]];
  const baseC = new THREE.Color(leafColor);
  for (const [ox, oy, oz, rr] of tops) {
    limb(b, m.bark, V(x + 0.02 * s, py + 1.18 * s, z), V(x + ox * s, py + (oy - 0.14) * s, z + oz * s), 0.045 * s, 0.025 * s, 0x5a4030, 5);
    b.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.22, Math.floor(r() * 99)), m.foliage, xf(x + ox * s, py + oy * s, z + oz * s, r() * 6, rr * s * 1.12, rr * s * 0.76, rr * s * 1.12), baseC.clone().offsetHSL((r() - 0.5) * 0.03, 0, (r() - 0.5) * 0.1), true);
  }
}

/** Cây tùng bonsai dáng tầng mây (sân thiền). Cao ~3*s. */
export function pineBonsai(b: Batch, m: Mats, x: number, z: number, s = 1, seed = 2): void {
  const r = rng(seed * 53 + 1);
  const trunk = [V(x, 0, z), V(x - 0.25 * s, 0.7 * s, z + 0.1 * s), V(x + 0.3 * s, 1.4 * s, z - 0.1 * s), V(x - 0.1 * s, 2.0 * s, z), V(x + 0.15 * s, 2.5 * s, z + 0.05 * s)];
  b.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(trunk), 16, 0.16 * s, 7), m.bark, undefined, 0x4e3a2c);
  const layers: [number, number, number, number][] = [[-1.05, 1.0, 0.1, 0.9], [1.0, 1.45, -0.1, 0.8], [-0.5, 2.05, 0.3, 0.65], [0.45, 2.55, 0, 0.7], [0.0, 2.95, 0, 0.5]];
  for (const [ox, oy, oz, rr] of layers) {
    limb(b, m.bark, V(x, oy * 0.7 * s, z), V(x + ox * s, oy * s - 0.08 * s, z + oz * s), 0.07 * s, 0.04 * s, 0x4e3a2c, 5);
    b.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.2, Math.floor(r() * 99)), m.foliage, xf(x + ox * s, oy * s + 0.1 * s, z + oz * s, r() * 6, rr * s * 1.25, rr * s * 0.42, rr * s * 1.1), new THREE.Color(0x2f6e45).offsetHSL((r() - 0.5) * 0.03, 0, (r() - 0.5) * 0.08), true);
  }
}

/** Khóm trúc: n thân có mắt, lá cuối ngọn. */
export function bambooClump(b: Batch, m: Mats, x: number, z: number, n = 9, h = 6, seed = 1): void {
  const r = rng(seed * 31 + 9);
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, d = r() * 0.9;
    const bx = x + Math.cos(a) * d, bz = z + Math.sin(a) * d;
    const hh = h * (0.7 + r() * 0.5);
    const lean = 0.07 + r() * 0.09;
    const dx = Math.cos(a) * lean, dz = Math.sin(a) * lean;
    const seg = Math.max(2, Math.floor(hh / 0.9));
    for (let k = 0; k < seg; k++) {
      const y0 = (k * hh) / seg, y1 = ((k + 1) * hh) / seg;
      const p0 = V(bx + dx * y0, y0, bz + dz * y0), p1 = V(bx + dx * y1, y1, bz + dz * y1);
      const rad = 0.06 * (1 - (k / seg) * 0.4);
      limb(b, m.paint, p0, p1, rad, rad * 0.95, k % 2 ? 0x7da64a : 0x8ab354, 5);
      b.add(new THREE.TorusGeometry(rad, 0.012, 4, 8), m.paint, xf(p1.x, p1.y, p1.z, 0, 1, 1, 1, Math.PI / 2), 0x5a7a30);
    }
    const tx = bx + dx * hh, tz = bz + dz * hh;
    for (let k = 0; k < 6; k++) {
      const la = r() * TAU, ly = hh - 0.2 - r() * 1.4;
      b.add(new THREE.ConeGeometry(0.1, 0.9, 4), m.paintDouble, xf(tx + Math.cos(la) * 0.3, ly, tz + Math.sin(la) * 0.3, la, 1, 1, 1, 1.3 + r() * 0.2), new THREE.Color(0x6aa83c).offsetHSL(0, 0, (r() - 0.5) * 0.1));
    }
  }
}

/** Cây tán tròn (xoài/si). */
export function treeRound(b: Batch, m: Mats, x: number, z: number, s = 1, seed = 1, hue = 0x4a8a3f): void {
  const r = rng(seed * 71 + 3);
  const th = (2.2 + r() * 0.8) * s;
  b.add(new THREE.CylinderGeometry(0.2 * s, 0.34 * s, th, 7), m.bark, xf(x, th / 2, z), 0x5e4634);
  const c = new THREE.Color(hue);
  for (let i = 0; i < 5; i++) {
    const a = r() * TAU, d = i === 0 ? 0 : (0.7 + r() * 0.8) * s;
    b.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.3, i + seed), m.foliage, xf(x + Math.cos(a) * d, th + (0.6 + r() * 1.1) * s, z + Math.sin(a) * d, r() * 6, (1.3 + r() * 0.5) * s, (1.0 + r() * 0.4) * s, (1.3 + r() * 0.5) * s), c.clone().offsetHSL((r() - 0.5) * 0.04, 0, (r() - 0.5) * 0.12), true);
  }
}
/** Cây thông thon. */
export function treePine(b: Batch, m: Mats, x: number, z: number, s = 1, seed = 1): void {
  const r = rng(seed * 43 + 5);
  const th = 1.4 * s;
  b.add(new THREE.CylinderGeometry(0.16 * s, 0.26 * s, th, 6), m.bark, xf(x, th / 2, z), 0x5a4232);
  const c = new THREE.Color(0x2f6a46);
  for (let i = 0; i < 5; i++) {
    const rr = (2.0 - i * 0.34) * s, hh = (1.8 - i * 0.12) * s;
    b.add(new THREE.ConeGeometry(rr, hh, 8), m.foliage, xf(x, th + i * 1.05 * s + hh / 2 - 0.2 * s, z, r() * 6), c.clone().offsetHSL((r() - 0.5) * 0.02, 0, i * 0.012), true);
  }
}
