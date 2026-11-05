/**
 * Khuôn viên sân trước & lối vào:
 * - Cổng Tam Quan (z≈38.6) mái cong nhiều tầng, cột đỏ, hoành phi "CHÙA RẮN", câu đối, đèn lồng, nghê đá.
 * - Đại lộ lát đá từ cổng tới thềm chánh điện: hàng đèn đá đài sen, chậu cảnh bonsai/mai/đào trên bệ đá, cờ phướn Phật giáo bay theo gió.
 * - Bàn xin xăm & ống xăm gần (-4, -14.5); Giá chổi tre & sọt lá ở (7, 22).
 * - ~108 lá bồ đề rụng trên sân (InstancedMesh) quét được bằng `sweepAt(x,z,r)` có hiệu ứng lốc xoáy lá vàng bay lên.
 * - Rừng cây, khóm trúc, bồn hoa bao quanh tường chùa.
 */
import * as THREE from 'three';
import { BLOCKS, INTERACTABLES, LOTUS_POND, RELEASE_POND } from '@/world/layout';
import { addWind, Batch, clamp, limb, rng, type SharedUniforms, TAU, xf } from './core';
import { bambooClump, bonsai, bush, flowerBed, treePine, treeRound } from './flora';
import type { Mats } from './materials';
import type { HaloSpec, ParticleField } from './particles';
import { buildRoof } from './roof';
import { guardianLion } from './statues';
import { coupletTexture, plaqueTexture } from './textures';

const QUE_POS = INTERACTABLES.find((i) => i.id === 'que')!.pos;
const BROOM_POS = INTERACTABLES.find((i) => i.id === 'broomRack')!.pos;

/** Đèn đá đài sen (cao ~1.85 * s), tự đăng ký quầng sáng đêm vào `halos`. */
export function stoneLantern(b: Batch, m: Mats, halos: HaloSpec[], x: number, y: number, z: number, s = 1): void {
  const st = m.stone, dk = m.stoneDark;
  // đế bát giác 2 bậc + cánh sen dưới
  b.cyl(dk, 0.44 * s, 0.5 * s, 0.12 * s, 8, x, y, z, 0x7e7970);
  b.cyl(st, 0.34 * s, 0.42 * s, 0.14 * s, 8, x, y + 0.12 * s, z, 0xa8a296);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    b.add(new THREE.SphereGeometry(1, 6, 5), st, xf(x + Math.sin(a) * 0.28 * s, y + 0.3 * s, z + Math.cos(a) * 0.28 * s, a, 0.1 * s, 0.14 * s, 0.06 * s, -0.45), 0xbdb7aa);
  }
  // thân trụ tròn chạm đốt + đài sen đỡ bầu đèn
  b.cyl(st, 0.14 * s, 0.17 * s, 0.54 * s, 10, x, y + 0.34 * s, z, 0xb0aaa0);
  b.add(new THREE.TorusGeometry(0.16 * s, 0.03 * s, 5, 12), st, xf(x, y + 0.6 * s, z, 0, 1, 1, 1, Math.PI / 2), 0xc2bcb0);
  b.cyl(st, 0.36 * s, 0.18 * s, 0.14 * s, 8, x, y + 0.88 * s, z, 0xb8b2a5);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + 0.2;
    b.add(new THREE.SphereGeometry(1, 6, 5), st, xf(x + Math.sin(a) * 0.3 * s, y + 0.98 * s, z + Math.cos(a) * 0.3 * s, a, 0.1 * s, 0.12 * s, 0.05 * s, 0.5), 0xcbc5b8);
  }
  // bầu đèn lồng đỏ-vàng phát sáng có nan dọc (như ảnh tham khảo b1)
  b.add(new THREE.SphereGeometry(1, 12, 8), m.stoneGlow, xf(x, y + 1.24 * s, z, 0, 0.24 * s, 0.22 * s, 0.24 * s), 0xffdf9e);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    b.box(m.lacquer, 0.035 * s, 0.34 * s, 0.04 * s, x + Math.sin(a) * 0.22 * s, y + 1.07 * s, z + Math.cos(a) * 0.22 * s, a, 0xb83326);
  }
  // mái che 6 cạnh cong nhẹ + búp sen đỉnh
  b.add(new THREE.ConeGeometry(0.42 * s, 0.22 * s, 6), dk, xf(x, y + 1.52 * s, z), 0x767168);
  b.cyl(st, 0.12 * s, 0.18 * s, 0.08 * s, 6, x, y + 1.62 * s, z, 0xa8a296);
  b.add(new THREE.SphereGeometry(1, 8, 6), st, xf(x, y + 1.75 * s, z, 0, 0.08 * s, 0.13 * s, 0.08 * s), 0xc5bfb2);
  halos.push({ x, y: y + 1.25 * s, z, size: 1.55 * s, color: 0xffad48, flicker: 0.12, day: 0.08 });
}

/** Đèn lồng đỏ treo dưới mái (cổng, lầu chuông…). */
export function hangingLantern(b: Batch, m: Mats, halos: HaloSpec[], x: number, y: number, z: number, cordLen = 0.75, s = 0.38): void {
  b.cyl(m.gold, 0.012, 0.012, cordLen, 4, x, y, z);
  const cy = y - cordLen * 0.5;
  b.add(new THREE.SphereGeometry(1, 12, 9), m.lanternRed, xf(x, cy - 0.2, z, 0, s, s * 1.18, s), 0xffffff);
  b.cyl(m.gold, s * 0.48, s * 0.48, 0.07, 10, x, cy - 0.2 + s * 1.12, z);
  b.cyl(m.gold, s * 0.4, s * 0.4, 0.07, 10, x, cy - 0.2 - s * 1.24, z);
  b.cyl(m.paint, 0.018, 0.018, 0.34, 4, x, cy - 0.2 - s * 1.24 - 0.34, z, 0xffcc55);
  halos.push({ x, y: cy - 0.2, z, size: 1.8 * (s / 0.38), color: 0xff6830, flicker: 0.1, day: 0.06 });
}

/** Hình học 1 chiếc lá bồ đề hình tim hơi cong có cuống (dùng cho InstancedMesh sân & lộc rơi). */
export function bodhiLeafGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.18);
  shape.bezierCurveTo(-0.22, -0.14, -0.26, 0.06, -0.08, 0.14);
  shape.bezierCurveTo(-0.02, 0.17, 0.0, 0.22, 0.0, 0.28); // đuôi nhọn lá bồ đề
  shape.bezierCurveTo(0.0, 0.22, 0.02, 0.17, 0.08, 0.14);
  shape.bezierCurveTo(0.26, 0.06, 0.22, -0.14, 0, -0.18);
  const g = new THREE.ShapeGeometry(shape, 5);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i), pz = pos.getZ(i);
    // tạo độ cong tự nhiên trên mặt đất
    pos.setY(i, 0.018 * (1 - (px * px * 12 + pz * pz * 8)) + 0.012 * Math.abs(px));
  }
  g.computeVertexNormals();
  return g;
}

export interface CourtyardPart {
  group: THREE.Group;
  nightLights: THREE.PointLight[];
  leavesRemaining(): number;
  sweepAt(x: number, z: number, radius: number): number;
  respawnLeaves(count?: number): void;
  update(dt: number, t: number, night: number, lightsOn: boolean): void;
  dispose(): void;
}

interface LeafSlot {
  x: number;
  z: number;
  ry: number;
  scale: number;
  /** 0 = đang nằm trên sân, >0 = đang xoáy bay lên khi quét, -1 = đã quét sạch */
  state: number;
  swirlPhase: number;
}

const LEAF_CAP = 108;

function validLeafSpot(x: number, z: number): boolean {
  // tránh vùng lư hương, bàn thờ, ao sen, hồ phóng sinh và các khối vật cản
  if (Math.hypot(x, z - (-11)) < 2.5) return false;
  if (Math.hypot(x, z - (-17)) < 3.5) return false;
  for (const p of [LOTUS_POND, RELEASE_POND]) {
    const dx = (x - p.cx) / (p.rx + 1.2), dz = (z - p.cz) / (p.rz + 1.2);
    if (dx * dx + dz * dz < 1) return false;
  }
  for (const b of BLOCKS) {
    if (x > b.x0 - 0.8 && x < b.x1 + 0.8 && z > b.z0 - 0.8 && z < b.z1 + 0.8) return false;
  }
  return true;
}

export function buildCourtyard(
  m: Mats,
  shared: SharedUniforms,
  halos: HaloSpec[],
  sparks: ParticleField,
  bMain: Batch,
  bDeco: Batch,
): CourtyardPart {
  const group = new THREE.Group();
  group.name = 'courtyard';
  const ownTex: THREE.Texture[] = [];
  const ownMat: THREE.Material[] = [];
  const ownGeo: THREE.BufferGeometry[] = [];

  // ─────────────────── 1. CỔNG TAM QUAN (z ≈ 38.6) ───────────────────
  const GZ = 38.6;
  const colPairs: [number, number][] = [
    [-3.0, 5.2], [3.0, 5.2],   // cổng chính (rộng thông thuỷ ~5.2m)
    [-6.7, 4.1], [6.7, 4.1],   // hai cổng phụ (tả môn / hữu môn)
  ];
  // bệ đá chân cổng hai bên (chừa lối đi phẳng ở cả 3 cửa)
  for (const sx of [-1, 1]) {
    for (const px of [sx * 3.0, sx * 6.7]) {
      bMain.box(m.stone, 1.15, 0.36, 3.0, px, 0, GZ, 0, 0xa8a296);
      bMain.box(m.stoneDark, 1.28, 0.1, 3.14, px, 0.34, GZ, 0, 0x827d73);
    }
    // tường cánh nối từ trụ ngoài (±6.7) ra tường bao (±10.4, z=40.4)
    bMain.box(m.plaster, 3.9, 2.3, 0.55, sx * 8.6, 0.4, 39.6, 0, 0xf0e5ce);
    bMain.box(m.stone, 3.95, 0.48, 0.75, sx * 8.6, 0, 39.6, 0, 0x9c968b);
    bMain.box(m.roof, 4.05, 0.2, 0.95, sx * 8.6, 2.75, 39.6, 0, 0xffffff);
    bMain.box(m.roofEdge, 4.0, 0.12, 0.72, sx * 8.6, 2.64, 39.6, 0, 0x6b3a22);
    // đoạn nối góc z=39.6..40.4 ở x=±10.4
    bMain.box(m.plaster, 0.65, 2.4, 1.1, sx * 10.4, 0.4, 40.0, 0, 0xf0e5ce);
    bMain.box(m.stone, 0.85, 0.48, 1.2, sx * 10.4, 0, 40.0, 0, 0x9c968b);
    // cửa sổ chữ Thọ tròn trên tường cánh
    for (const fz of [0.3, -0.3]) {
      bMain.add(new THREE.TorusGeometry(0.46, 0.055, 6, 20), m.lacquer, xf(sx * 8.6, 1.58, 39.6 + fz), 0xffffff);
      bMain.box(m.gold, 0.06, 0.82, 0.04, sx * 8.6, 1.17, 39.6 + fz);
      bMain.box(m.gold, 0.82, 0.06, 0.04, sx * 8.6, 1.58, 39.6 + fz);
    }
  }
  // 8 cột tròn sơn son (4 cặp trước-sau tại z = GZ ± 1.05)
  for (const [cx, ch] of colPairs) {
    for (const dz of [-1.05, 1.05]) {
      const z = GZ + dz;
      bMain.cyl(m.stone, 0.44, 0.5, 0.28, 14, cx, 0.36, z, 0xb6b0a4);
      bMain.cyl(m.gold, 0.38, 0.38, 0.06, 14, cx, 0.64, z);
      bMain.cyl(m.lacquer, 0.31, 0.35, ch, 16, cx, 0.7, z, 0xffffff);
      bMain.cyl(m.gold, 0.35, 0.35, 0.07, 14, cx, 0.7 + ch - 0.12, z);
      bMain.box(m.lacquer, 0.82, 0.22, 0.68, cx, 0.7 + ch - 0.04, z, 0, 0xa22820);
      bMain.box(m.gold, 0.48, 0.09, 0.44, cx, 0.7 + ch + 0.18, z);
    }
    // xà dọc nối cột trước-sau
    bMain.box(m.lacquer, 0.38, 0.38, 2.5, cx, 0.7 + ch - 0.32, GZ, 0, 0xa82a20);
  }
  // xà ngang & diềm lầu cổng chính + hai cổng phụ
  bMain.box(m.lacquer, 6.8, 0.48, 2.45, 0, 5.55, GZ, 0, 0xa62a20);
  bMain.box(m.gold, 6.88, 0.08, 2.52, 0, 5.5, GZ);
  // cổ diêm tầng trên cổng chính (nâng cao để bảng hiệu CHÙA RẮN thoáng trọn vẹn trên đầu đao mái dưới)
  bMain.box(m.lacquer, 6.0, 2.16, 2.1, 0, 6.02, GZ, 0, 0x98261d);
  bMain.box(m.gold, 6.14, 0.09, 2.2, 0, 6.02, GZ);
  bMain.box(m.gold, 6.14, 0.09, 2.2, 0, 8.12, GZ);
  // xà ngang 2 cổng phụ
  for (const sx of [-1, 1]) {
    bMain.box(m.lacquer, 4.1, 0.56, 2.22, sx * 4.85, 4.38, GZ, 0, 0xa62a20);
    bMain.box(m.gold, 4.16, 0.07, 2.28, sx * 4.85, 4.34, GZ);
    bMain.box(m.lacquer, 3.8, 0.58, 1.9, sx * 4.85, 4.94, GZ, 0, 0x92241b);
  }

  // mái ngói cong Tam Quan: 2 tầng cổng giữa + 2 mái cổng bên (luôn đảm bảo W >= D)
  buildRoof(bMain, m, 0, 5.85, GZ, { W: 4.45, D: 2.35, rise: 1.85, bmax: 0.48, curve: 1.45, curl: 0.78, curlSize: 1.9, rafters: true, ridge: false });
  buildRoof(bMain, m, 0, 8.18, GZ, { W: 4.1, D: 2.15, rise: 2.35, bmax: 1, curve: 1.42, curl: 1.0, curlSize: 2.0, ridge: true, finial: true, rafters: true });
  for (const sx of [-1, 1]) {
    buildRoof(bMain, m, sx * 4.95, 5.48, GZ, { W: 2.75, D: 2.0, rise: 1.65, bmax: 1, curve: 1.45, curl: 0.72, curlSize: 1.5, ridge: true, finial: false, rafters: true });
  }

  // hoành phi "CHÙA RẮN" ở cả mặt ngoài (+z) lẫn mặt trong (-z), gộp mặt trước-sau cùng vật liệu
  const gatePlaque = plaqueTexture('CHÙA RẮN', { w: 1024, h: 280, sub: 'TỪ BI · THANH TỊNH · AN LẠC' });
  const sidePlaqueL = plaqueTexture('TỪ MÔN', { w: 512, h: 192 });
  const sidePlaqueR = plaqueTexture('GIÁC ĐẠO', { w: 512, h: 192 });
  const coupGateL = coupletTexture(['CỬA', 'PHẬT', 'TỪ', 'BI', 'MỞ']);
  const coupGateR = coupletTexture(['ĐƯỜNG', 'THIỀN', 'TỊNH', 'ĐỘ', 'SOI']);
  ownTex.push(gatePlaque, sidePlaqueL, sidePlaqueR, coupGateL, coupGateR);

  const mkPlaqueMat = (tx: THREE.Texture): THREE.MeshStandardMaterial => {
    const mt = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.42, metalness: 0.16, emissive: 0xffbf68, emissiveMap: tx, emissiveIntensity: 0.18 });
    ownMat.push(mt);
    m.glow.push({ mat: mt, day: 0.14, night: 0.75 });
    return mt;
  };
  const gpMat = mkPlaqueMat(gatePlaque);
  const spMatL = mkPlaqueMat(sidePlaqueL);
  const spMatR = mkPlaqueMat(sidePlaqueR);
  const cpMatL = mkPlaqueMat(coupGateL);
  const cpMatR = mkPlaqueMat(coupGateR);

  const bPlaques = new Batch(false, false);
  for (const face of [1, -1]) {
    const ry = face > 0 ? 0 : Math.PI;
    bPlaques.add(new THREE.PlaneGeometry(3.85, 1.06), gpMat, xf(0, 7.36, GZ + face * 1.14, ry));
    bMain.box(m.gold, 4.04, 1.2, 0.08, 0, 6.76, GZ + face * 1.08);

    bPlaques.add(new THREE.PlaneGeometry(1.86, 0.62), spMatL, xf(-4.85, 4.66, GZ + face * 1.16, ry));
    bPlaques.add(new THREE.PlaneGeometry(1.86, 0.62), spMatR, xf(4.85, 4.66, GZ + face * 1.16, ry));
    bMain.box(m.gold, 1.98, 0.72, 0.06, -4.85, 4.3, GZ + face * 1.12);
    bMain.box(m.gold, 1.98, 0.72, 0.06, 4.85, 4.3, GZ + face * 1.12);

    for (const [cx, mt] of [[-3.0, cpMatL], [3.0, cpMatR]] as const) {
      bPlaques.add(new THREE.PlaneGeometry(0.42, 2.5), mt, xf(cx, 3.25, GZ + face * 1.44, ry));
      bMain.box(m.darkWood, 0.5, 2.62, 0.06, cx, 1.94, GZ + face * 1.4, 0, 0x2a1008);
    }
  }
  for (const pm of bPlaques.build(group, 'gate-plaques')) ownGeo.push(pm.geometry);

  // đèn lồng treo ở 3 vòm cổng + nghê đá chầu cổng
  hangingLantern(bMain, m, halos, 0, 5.5, GZ, 0.7, 0.44);
  hangingLantern(bMain, m, halos, -4.85, 4.45, GZ, 0.55, 0.34);
  hangingLantern(bMain, m, halos, 4.85, 4.45, GZ, 0.55, 0.34);
  guardianLion(bMain, m, -3.9, 0, GZ + 2.3, 0.9, 0, 1);
  guardianLion(bMain, m, 3.9, 0, GZ + 2.3, 0.9, 0, -1);
  stoneLantern(bMain, m, halos, -7.8, 0, GZ - 2.3, 1.05);
  stoneLantern(bMain, m, halos, 7.8, 0, GZ - 2.3, 1.05);

  // ─────────────────── 2. ĐẠI LỘ SÂN TRƯỚC (BONSAI, ĐÈN ĐÁ, CỜ PHƯỚN) ───────────────────
  // Hàng đèn đá đài sen dọc đại lộ (x = ±5.15, ngoài biên đường 4.6m nên hoàn toàn thông thoáng)
  for (const lz of [-14.0, -5.2, 5.8, 19.2, 29.5]) {
    stoneLantern(bMain, m, halos, -5.15, 0, lz, 0.95);
    stoneLantern(bMain, m, halos, 5.15, 0, lz, 0.95);
  }
  // Chậu bonsai xanh, mai vàng, đào hồng xen kẽ dọc đại lộ & trước thềm chánh điện (như ảnh b1)
  const potRows: [number, number, number, number][] = [
    [33.4, 0x3b8c4a, 0x3b8c4a, 0.92],
    [24.4, 0xebba34, 0xf296b4, 0.94],
    [10.8, 0x3b8c4a, 0x3b8c4a, 0.94],
    [0.2,  0xf296b4, 0xebba34, 0.95],
    [-9.6, 0x3b8c4a, 0xebba34, 0.95],
  ];
  potRows.forEach(([pz, cL, cR, sc], idx) => {
    bonsai(bMain, m, -5.25, pz, sc, idx * 2 + 1, true, cL);
    bonsai(bMain, m, 5.25, pz, sc, idx * 2 + 2, true, cR);
  });
  // Chậu hoa mai / đào / bonsai chầu trước thềm Chánh Điện
  bonsai(bMain, m, -6.2, -16.8, 0.92, 21, true, 0xf296b4);
  bonsai(bMain, m, -8.8, -17.2, 0.88, 22, true, 0xebba34);
  bonsai(bMain, m, 6.2, -16.8, 0.92, 23, true, 0x3b8c4a);
  bonsai(bMain, m, 8.8, -17.2, 0.88, 24, true, 0xebba34);

  // Cờ phướn Phật giáo (cột sơn son đỉnh búp sen vàng + lá phướn bay mềm theo gió)
  const bannerMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.65,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  addWind(bannerMat, shared, { amp: 0.18, freq: 2.2, weight: '(1.0 - uv.y)' });
  ownMat.push(bannerMat);
  const bFlags = new Batch(true, false);
  const flagSpots: [number, number, number][] = [
    [-7.0, 33.8, 0xe8b238], [7.0, 33.8, 0xe8b238],
    [-7.2, 26.8, 0xd8432e], [7.2, 26.8, 0xd8432e],
    [-7.2, -1.8, 0xe8b238], [7.2, -1.8, 0xe8b238],
    [-12.2, -17.8, 0xd8432e], [12.2, -17.8, 0xd8432e],
  ];
  const flagClothGeo = new THREE.PlaneGeometry(0.68, 3.1, 2, 10);
  ownGeo.push(flagClothGeo);
  for (const [fx, fz, fcol] of flagSpots) {
    const dir = fx < 0 ? 1 : -1;
    bMain.cyl(m.stone, 0.28, 0.34, 0.26, 8, fx, 0, fz, 0xa8a296);
    bMain.cyl(m.lacquer, 0.055, 0.075, 5.5, 8, fx, 0.26, fz, 0xb22e24);
    bMain.sphere(m.gold, 0.12, fx, 5.84, fz, 1, 1.35, 1);
    // tay ngang treo phướn hướng vào lối đi
    bMain.box(m.gold, 0.92, 0.055, 0.055, fx + dir * 0.42, 5.38, fz);
    bMain.sphere(m.gold, 0.07, fx + dir * 0.88, 5.4, fz);
    // dải lụa chính + viền ngũ sắc đỉnh phướn
    bFlags.add(flagClothGeo, bannerMat, xf(fx + dir * 0.46, 3.78, fz), fcol);
    bMain.box(m.lacquer, 0.72, 0.16, 0.05, fx + dir * 0.46, 5.26, fz, 0, 0x2b5da8);
  }
  bFlags.build(group, 'flags');

  // ─────────────────── 3. BÀN XIN XĂM & ỐNG XĂM (`que` gần -4, -14.5) ───────────────────
  {
    const qx = QUE_POS.x - 0.15, qz = QUE_POS.z - 1.05; // bàn đặt ngay phía bắc điểm đứng (-4, -14.5)
    const th = 0.88;
    // chiếu quỳ + đệm tròn tại điểm người chơi quỳ xin xăm
    bDeco.cyl(m.paint, 0.56, 0.58, 0.025, 18, qx, 0.005, QUE_POS.z - 0.1, 0xc9a86a);
    bDeco.cyl(m.paint, 0.4, 0.44, 0.1, 16, qx, 0.025, QUE_POS.z - 0.1, 0xb83228);
    bDeco.add(new THREE.TorusGeometry(0.38, 0.022, 5, 16), m.gold, xf(qx, 0.12, QUE_POS.z - 0.1, 0, 1, 1, 1, Math.PI / 2), 0xf0c252);
    // bàn sơn son thếp vàng
    bMain.box(m.lacquer, 1.48, 0.1, 0.82, qx, th - 0.1, qz, 0, 0xb83228);
    bMain.box(m.gold, 1.54, 0.035, 0.88, qx, th - 0.02, qz);
    bMain.box(m.lacquer, 1.32, 0.24, 0.08, qx, th - 0.34, qz + 0.34, 0, 0x9c261d);
    bMain.box(m.paint, 0.72, 0.52, 0.04, qx, th - 0.58, qz + 0.37, 0, 0xe2af3c); // khăn gấm vàng
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      bMain.box(m.lacquer, 0.1, th - 0.1, 0.1, qx + sx * 0.62, 0, qz + sz * 0.31, 0, 0x9c261d);
    }
    // ống xăm sơn đỏ đai vàng + bó thẻ xăm đầu son
    const cx = qx - 0.12, cz = qz + 0.04;
    bMain.add(new THREE.CylinderGeometry(0.145, 0.135, 0.38, 16), m.lacquer, xf(cx, th + 0.19, cz, 0, 1, 1, 1, 0.14), 0xc93428);
    bMain.add(new THREE.TorusGeometry(0.148, 0.018, 5, 16), m.gold, xf(cx, th + 0.34, cz + 0.02, 0, 1, 1, 1, Math.PI / 2 + 0.14), 0xffd56b);
    bMain.add(new THREE.TorusGeometry(0.14, 0.016, 5, 16), m.gold, xf(cx, th + 0.08, cz - 0.01, 0, 1, 1, 1, Math.PI / 2 + 0.14), 0xffd56b);
    const rq = rng(88);
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * TAU, d = 0.03 + rq() * 0.075;
      const sx = cx + Math.cos(a) * d, sz = cz + Math.sin(a) * d;
      bDeco.add(new THREE.BoxGeometry(0.018, 0.28, 0.006), m.paint, xf(sx, th + 0.38 + rq() * 0.05, sz + 0.03, a, 1, 1, 1, 0.18 + (rq() - 0.5) * 0.14), 0xe6ca8c);
      bDeco.add(new THREE.BoxGeometry(0.02, 0.05, 0.008), m.paint, xf(sx, th + 0.51 + rq() * 0.05, sz + 0.05, a, 1, 1, 1, 0.18), 0xd63226);
    }
    // cặp keo âm dương bằng gỗ đỏ + lư trầm nhỏ + đèn dầu nhỏ
    bDeco.add(new THREE.TorusGeometry(0.09, 0.032, 6, 12, Math.PI), m.lacquer, xf(qx + 0.34, th + 0.03, qz + 0.1, 0.4, 1, 1, 1, Math.PI / 2), 0xc43024);
    bDeco.add(new THREE.TorusGeometry(0.09, 0.032, 6, 12, Math.PI), m.lacquer, xf(qx + 0.46, th + 0.03, qz - 0.04, 2.2, 1, 1, 1, Math.PI / 2), 0xc43024);
    bMain.cyl(m.bronze, 0.09, 0.07, 0.12, 10, qx - 0.46, th, qz - 0.08);
    bMain.sphere(m.stoneGlow, 0.06, qx + 0.48, th + 0.12, qz - 0.22, 1, 1.3, 1, 0xffd584);
    bMain.cyl(m.bronze, 0.07, 0.09, 0.08, 10, qx + 0.48, th, qz - 0.22);
    halos.push({ x: qx + 0.48, y: th + 0.14, z: qz - 0.22, size: 0.9, color: 0xffaa44, flicker: 0.18, day: 0.2 });
  }

  // ─────────────────── 4. GIÁ CHỔI TRE & SỌT LÁ (`broomRack` gần 7, 22) ───────────────────
  {
    const bx = BROOM_POS.x + 0.65, bz = BROOM_POS.z - 0.95;
    const ry = -0.25;
    const cs = Math.cos(ry), sn = Math.sin(ry);
    const L = (lx: number, ly: number, lz: number): THREE.Vector3 =>
      new THREE.Vector3(bx + lx * cs + lz * sn, ly, bz - lx * sn + lz * cs);

    // bậc đá lát chân giá chổi
    bMain.box(m.stone, 2.2, 0.08, 1.2, bx, 0, bz, ry, 0xa8a296);
    // khung gỗ + mái ngói nhỏ che mưa
    for (const sx of [-0.82, 0.82]) {
      const p = L(sx, 0, 0);
      bMain.cyl(m.darkWood, 0.065, 0.075, 1.95, 8, p.x, 0.08, p.z, 0x5c3c26);
      bMain.box(m.stone, 0.24, 0.14, 0.24, p.x, 0.08, p.z, ry, 0x969086);
    }
    const bar1 = L(0, 1.22, 0), bar2 = L(0, 0.62, 0), topP = L(0, 2.02, 0);
    bMain.box(m.wood, 1.78, 0.08, 0.09, bar1.x, bar1.y, bar1.z, ry, 0x8a623c);
    bMain.box(m.wood, 1.78, 0.07, 0.08, bar2.x, bar2.y, bar2.z, ry, 0x8a623c);
    // mái ngói hai dốc nhỏ
    bMain.add(new THREE.BoxGeometry(2.15, 0.09, 0.68), m.roof, xf(topP.x, topP.y, topP.z + 0.22, ry, 1, 1, 1, 0.42), 0xffffff);
    bMain.add(new THREE.BoxGeometry(2.15, 0.09, 0.68), m.roof, xf(topP.x, topP.y, topP.z - 0.22, ry, 1, 1, 1, -0.42), 0xffffff);
    bMain.box(m.roofEdge, 2.18, 0.1, 0.14, topP.x, topP.y + 0.14, topP.z, ry, 0x6b3a22);

    // 5 cây chổi tre / chổi đót dựa vào giá
    for (let i = 0; i < 5; i++) {
      const lx = -0.58 + i * 0.29;
      const foot = L(lx, 0.12, 0.22 + (i % 2) * 0.04);
      const head = L(lx + (i - 2) * 0.02, 1.56, -0.02);
      limb(bMain, m.paint, new THREE.Vector3(foot.x, 0.48, foot.z), head, 0.024, 0.02, 0xc8a45c, 6);
      // bầu chổi rơm/đót xoè quạt
      bMain.add(new THREE.ConeGeometry(0.2, 0.48, 8), m.paint, xf(foot.x, 0.28, foot.z, ry, 1.15, 1, 0.55, -0.15), 0xd4b062);
      bMain.add(new THREE.TorusGeometry(0.075, 0.018, 5, 10), m.lacquer, xf(foot.x, 0.44, foot.z - 0.02, ry, 1, 1, 0.7, Math.PI / 2), 0xb83226);
    }
    // sọt tre đựng lá vàng bên cạnh
    const bsk = L(1.25, 0, 0.18);
    bMain.add(new THREE.CylinderGeometry(0.36, 0.26, 0.52, 12, 1, false), m.paint, xf(bsk.x, 0.26, bsk.z), 0xb8904c);
    bMain.add(new THREE.TorusGeometry(0.36, 0.028, 5, 14), m.darkWood, xf(bsk.x, 0.52, bsk.z, 0, 1, 1, 1, Math.PI / 2), 0x6e4c2a);
    bDeco.sphere(m.paint, 0.3, bsk.x, 0.46, bsk.z, 1, 0.35, 1, 0xdca032, 8);
  }

  // ─────────────────── 5. CÂY XANH, BỒN HOA & RỪNG BAO QUANH ───────────────────
  // Bồn hoa rực rỡ quanh sân trước & lối rẽ
  flowerBed(bDeco, m, -8.8, 23.2, 2.8, 1.3, 11);
  flowerBed(bDeco, m, 10.6, 23.2, 2.4, 1.3, 12);
  flowerBed(bDeco, m, -8.8, 8.0, 2.6, 1.2, 13);
  flowerBed(bDeco, m, 8.8, 8.0, 2.6, 1.2, 14);

  // Hàng cây bóng mát sát tường đông, tây, bắc & góc sân (tạo chiều sâu xanh mát mọi góc nhìn)
  const roundTrees: [number, number, number, number, number][] = [
    [-36, 34, 1.35, 1, 0x45883c], [36, 34, 1.35, 2, 0x4b8e40],
    [-38, 22, 1.45, 3, 0x3f8038], [38, 22, 1.4, 4, 0x4e9242],
    [-38, 8,  1.3,  5, 0x46883e], [38, 12, 1.3, 6, 0x3e7e38],
    [38, -6,  1.35, 7, 0x488a3e], [37, -25, 1.45, 8, 0x42843a],
    [20, -28, 1.35, 9, 0x4c9040], [-18, -31, 1.4, 10, 0x44863c],
    [-22, 33, 1.25, 11, 0x509442], [22, 33, 1.25, 12, 0x478a3d],
    [-15, 27, 1.05, 13, 0x589a44], [16, 27, 1.05, 14, 0x4b8c3f],
  ];
  for (const [tx, tz, ts, sd, col] of roundTrees) treeRound(bMain, m, tx, tz, ts, sd, col);

  const pineTrees: [number, number, number, number][] = [
    [-16, -24, 1.25, 21], [17, -23, 1.25, 22],
    [-36, -32, 1.35, 23], [35, -31, 1.35, 24],
    [-39, -14, 1.2, 25],  [39, -18, 1.25, 26],
  ];
  for (const [tx, tz, ts, sd] of pineTrees) treePine(bMain, m, tx, tz, ts, sd);

  // Khóm trúc dọc tường nam & góc sân
  bambooClump(bMain, m, -14.5, 37.2, 8, 5.8, 31);
  bambooClump(bMain, m, 14.5, 37.2, 8, 5.8, 32);
  bambooClump(bMain, m, 38.5, 29.0, 9, 6.2, 33);
  bambooClump(bMain, m, -38.5, 28.5, 9, 6.2, 34);

  // Bụi cây mềm chân tường
  const rb = rng(209);
  for (let i = 0; i < 28; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const bx = side * (39.5 + rb() * 1.4);
    const bz = -32 + (i / 28) * 68;
    bush(bDeco, m, bx, bz, 0.9 + rb() * 0.5, i % 3 === 0 ? 0x5a9642 : 0x46823a);
  }

  // ─────────────────── 6. ~108 LÁ BỒ ĐỀ RỤNG QUÉT ĐƯỢC (InstancedMesh) ───────────────────
  const leafGeo = bodhiLeafGeometry();
  const leafMat = new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0.05, side: THREE.DoubleSide });
  ownGeo.push(leafGeo);
  ownMat.push(leafMat);

  const leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, LEAF_CAP);
  leafMesh.receiveShadow = true;
  leafMesh.castShadow = false;
  leafMesh.frustumCulled = false;
  leafMesh.name = 'fallen-leaves';

  const rl = rng(108);
  const slots: LeafSlot[] = [];
  const palette = [0xe2a42c, 0xd88424, 0xebbc3b, 0xc96e22, 0xc8a838, 0xe0952a];
  const tmpCol = new THREE.Color();
  const dummy = new THREE.Object3D();

  let guard = 0;
  while (slots.length < LEAF_CAP && guard < 4000) {
    guard++;
    // tập trung nhiều dọc sân gạch trước chánh điện, quanh giá chổi & lối từ cổng vào (như b1.png)
    const zone = rl();
    let lx: number, lz: number;
    if (zone < 0.52) {
      lx = (rl() - 0.5) * 9.0;
      lz = -14 + rl() * 46;
    } else if (zone < 0.8) {
      lx = (rl() - 0.5) * 20;
      lz = 9 + rl() * 16;
    } else {
      lx = -24 + rl() * 14;
      lz = -11 + rl() * 14;
    }
    if (!validLeafSpot(lx, lz)) continue;
    slots.push({
      x: lx,
      z: lz,
      ry: rl() * TAU,
      scale: 0.78 + rl() * 0.52,
      state: 0,
      swirlPhase: rl() * TAU,
    });
  }
  while (slots.length < LEAF_CAP) {
    const idx = slots.length;
    slots.push({ x: (idx % 9) - 4, z: 12 + Math.floor(idx / 9) * 1.4, ry: idx, scale: 0.9, state: 0, swirlPhase: idx });
  }

  for (let i = 0; i < LEAF_CAP; i++) {
    tmpCol.setHex(palette[i % palette.length]).offsetHSL((rl() - 0.5) * 0.03, 0, (rl() - 0.5) * 0.08);
    leafMesh.setColorAt(i, tmpCol);
  }
  if (leafMesh.instanceColor) leafMesh.instanceColor.needsUpdate = true;

  let remaining = LEAF_CAP;
  let dirtyLeaves = true;

  function writeLeafMatrix(i: number): void {
    const s = slots[i];
    if (s.state < 0) {
      dummy.position.set(0, -20, 0);
      dummy.scale.setScalar(0.0001);
      dummy.updateMatrix();
      leafMesh.setMatrixAt(i, dummy.matrix);
      return;
    }
    if (s.state === 0) {
      dummy.position.set(s.x, 0.022, s.z);
      dummy.rotation.set(0, s.ry, 0);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      leafMesh.setMatrixAt(i, dummy.matrix);
      return;
    }
    // đang xoáy bay vút lên khi quét (0 < state <= 1)
    const k = s.state;
    const ang = s.swirlPhase + k * 9.5;
    const rad = (1 - k * 0.55) * 0.65;
    dummy.position.set(s.x + Math.cos(ang) * rad, 0.03 + k * k * 2.1 + k * 0.5, s.z + Math.sin(ang) * rad);
    dummy.rotation.set(k * 5.2, s.ry + ang, k * 3.7);
    dummy.scale.setScalar(s.scale * Math.max(0.001, 1 - k * k));
    dummy.updateMatrix();
    leafMesh.setMatrixAt(i, dummy.matrix);
  }

  for (let i = 0; i < LEAF_CAP; i++) writeLeafMatrix(i);
  leafMesh.instanceMatrix.needsUpdate = true;
  group.add(leafMesh);

  // Đèn điểm ấm ban đêm dọc sân chính & cổng Tam Quan (chỉ bật ban đêm & chất lượng medium/high)
  const nightLights: THREE.PointLight[] = [];
  for (const [lx, ly, lz, dist] of [
    [0, 3.2, 22, 22],
    [0, 3.2, 2, 22],
    [0, 4.2, GZ - 1.2, 18],
  ] as const) {
    const pl = new THREE.PointLight(0xffad58, 0, dist, 1.7);
    pl.position.set(lx, ly, lz);
    group.add(pl);
    nightLights.push(pl);
  }

  const goldSparkA = new THREE.Color(1.0, 0.82, 0.32);
  const goldSparkB = new THREE.Color(1.0, 0.55, 0.18);

  return {
    group,
    nightLights,
    leavesRemaining(): number {
      return remaining;
    },
    sweepAt(x: number, z: number, radius: number): number {
      const r2 = radius * radius;
      let removed = 0;
      for (let i = 0; i < LEAF_CAP; i++) {
        const s = slots[i];
        if (s.state !== 0) continue;
        const dx = s.x - x, dz = s.z - z;
        if (dx * dx + dz * dz <= r2) {
          s.state = 0.001;
          removed++;
          remaining--;
          dirtyLeaves = true;
          // hạt bụi vàng lốc nhẹ tại vị trí lá bay lên
          for (let p = 0; p < 3; p++) {
            const a = Math.random() * TAU;
            sparks.spawn(
              s.x, 0.08, s.z,
              Math.cos(a) * 0.7, 1.3 + Math.random() * 1.1, Math.sin(a) * 0.7,
              0.75 + Math.random() * 0.4, 0.11, 0.02, goldSparkA, goldSparkB, 0.85, 0.4, 1.2, 1, 0.35,
            );
          }
        }
      }
      return removed;
    },
    respawnLeaves(count?: number): void {
      const targetAdd = count === undefined ? LEAF_CAP : clamp(Math.round(count), 0, LEAF_CAP);
      if (count === undefined) {
        for (let i = 0; i < LEAF_CAP; i++) {
          slots[i].state = 0;
          writeLeafMatrix(i);
        }
        remaining = LEAF_CAP;
        leafMesh.instanceMatrix.needsUpdate = true;
        return;
      }
      // Nếu truyền count: đảm bảo ít nhất / hồi phục tới `targetAdd` lá trên sân
      let added = 0;
      for (let i = 0; i < LEAF_CAP && remaining < LEAF_CAP && added < targetAdd; i++) {
        if (slots[i].state !== 0) {
          slots[i].state = 0;
          writeLeafMatrix(i);
          remaining++;
          added++;
        }
      }
      leafMesh.instanceMatrix.needsUpdate = true;
    },
    update(dt: number, _t: number, night: number, lightsOn: boolean): void {
      let animating = false;
      for (let i = 0; i < LEAF_CAP; i++) {
        const s = slots[i];
        if (s.state > 0) {
          s.state += dt * 1.25;
          if (s.state >= 1) s.state = -1;
          else animating = true;
          writeLeafMatrix(i);
          dirtyLeaves = true;
        }
      }
      if (dirtyLeaves || animating) {
        leafMesh.instanceMatrix.needsUpdate = true;
        dirtyLeaves = animating;
      }
      const li = lightsOn ? night * 14 : 0;
      for (const pl of nightLights) {
        pl.visible = li > 0.05;
        pl.intensity = li;
      }
    },
    dispose(): void {
      for (const t of ownTex) t.dispose();
      for (const mt of ownMat) mt.dispose();
      for (const g of ownGeo) g.dispose();
    },
  };
}
