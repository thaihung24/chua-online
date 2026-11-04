/**
 * Cây Bồ Đề cổ thụ (`bodhi-trunk`: x=-23..-20.5, z=-6.5..-3.5, tâm (-21.75, -5.0)):
 * - Thân đại thụ xoắn bện, 9 rễ bàn nổi uốn qua bồn đá bát giác, 8 cành lớn vươn rộng, rễ phụ rủ mềm.
 * - Tán lá hình vòm tim nhiều tầng xanh ngọc – lục non – ánh vàng nắng + 240 cụm lá bồ đề hình tim đung đưa.
 * - Bàn hương đá nhỏ dưới gốc, ghế đá rêu, đèn đá toả sáng đêm.
 * - Dải lụa ước nguyện (`setWishRibbons(count)`, tối đa 80 dải đỏ/vàng/hồng bay theo gió).
 * - Lá vàng rơi êm đềm + hiệu ứng `triggerLoc()` (mưa lộc lá vàng lấp lánh) & `triggerRibbon()`.
 */
import * as THREE from 'three';
import { BLOCKS } from '@/world/layout';
import { addWind, Batch, clamp, jitter, limb, rng, type SharedUniforms, taperedTube, TAU, xf } from './core';
import { bodhiLeafGeometry, stoneLantern } from './courtyard';
import { addLotus, bush } from './flora';
import type { Mats } from './materials';
import type { HaloSpec, ParticleField } from './particles';

const BODHI_BLOCK = BLOCKS.find((b) => b.name === 'bodhi-trunk')!;
export const BODHI_CENTER = {
  x: (BODHI_BLOCK.x0 + BODHI_BLOCK.x1) / 2, // -21.75
  z: (BODHI_BLOCK.z0 + BODHI_BLOCK.z1) / 2, // -5.0
};

const MAX_RIBBONS = 80;
const AMBIENT_LEAVES = 8;
const LOC_LEAVES = 46;
const TOTAL_FALL_LEAVES = AMBIENT_LEAVES + LOC_LEAVES;

interface FallingLeaf {
  active: boolean;
  ambient: boolean;
  x: number;
  y: number;
  z: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  scale: number;
  life: number;
  maxLife: number;
}

export interface BodhiPart {
  group: THREE.Group;
  center: THREE.Vector3;
  setWishRibbons(count: number): void;
  triggerLoc(at?: { x: number; z: number }): void;
  triggerRibbon(at?: { x: number; z: number }): void;
  update(dt: number, t: number, night: number, lightsOn: boolean): void;
  dispose(): void;
}

/** Hình học 1 dải ruy-băng ước nguyện: dây treo + thẻ gỗ mạ vàng + dải lụa mềm nhiều đốt để uốn theo gió. */
function wishRibbonGeometry(): THREE.BufferGeometry {
  const b = new Batch(false, false);
  const mat = new THREE.MeshBasicMaterial();
  // dây mảnh treo từ cành (y = 0 xuống -0.16)
  b.cyl(mat, 0.006, 0.006, 0.16, 4, 0, -0.16, 0, 0xf2c968);
  // nút thắt cát tường & thẻ gỗ viền vàng
  b.sphere(mat, 0.028, 0, -0.17, 0, 1.2, 0.9, 0.7, 0xffd56b, 6);
  b.box(mat, 0.085, 0.14, 0.014, 0, -0.32, 0, 0, 0xffe4a0);
  // dải lụa dài rủ từ y = -0.30 xuống y = -1.18 (nhiều đốt theo chiều dọc để shader gió uốn cong mượt)
  const ribbonPlane = new THREE.PlaneGeometry(0.105, 0.88, 1, 8);
  ribbonPlane.translate(0, -0.74, 0);
  b.add(ribbonPlane, mat, undefined, 0xffffff);
  ribbonPlane.dispose();
  const tmp = new THREE.Group();
  const g = b.build(tmp)[0].geometry;
  mat.dispose();
  return g;
}

export function buildBodhi(
  m: Mats,
  shared: SharedUniforms,
  halos: HaloSpec[],
  sparks: ParticleField,
  bTrunk: Batch,
  bDeco: Batch,
): BodhiPart {
  const group = new THREE.Group();
  group.name = 'bodhi';
  const ownGeo: THREE.BufferGeometry[] = [];
  const ownMat: THREE.Material[] = [];

  const cx = BODHI_CENTER.x, cz = BODHI_CENTER.z;
  const r = rng(701);

  const bCanopy = new Batch(true, true);

  // ── 1. Bồn đá bát giác cổ kính ôm quanh gốc (nằm gọn trong khối bodhi-trunk) ──
  bTrunk.cyl(m.stoneDark, 1.52, 1.62, 0.16, 8, cx, 0, cz, 0x767168);
  bTrunk.cyl(m.stone, 1.38, 1.48, 0.3, 8, cx, 0.16, cz, 0xa59f93);
  bTrunk.add(new THREE.TorusGeometry(1.42, 0.055, 6, 8), m.stone, xf(cx, 0.45, cz, Math.PI / 8, 1, 1, 1, Math.PI / 2), 0xb8b2a5);
  bTrunk.sphere(m.bark, 1.32, cx, 0.36, cz, 1, 0.22, 1, 0x483624, 12); // mô đất ẩm dưới gốc

  // ── 2. Thân cổ thụ xoắn bện + 9 rễ bàn nổi uốn qua thành đá ──
  const mainStem = new THREE.CatmullRomCurve3([
    new THREE.Vector3(cx, 0.2, cz),
    new THREE.Vector3(cx + 0.12, 1.35, cz + 0.08),
    new THREE.Vector3(cx - 0.1, 2.55, cz - 0.06),
    new THREE.Vector3(cx + 0.05, 3.85, cz + 0.04),
  ]);
  bTrunk.add(taperedTube(mainStem, 18, 10, (t) => 1.02 - 0.34 * t), m.bark, undefined, 0x624936);

  // các thớ thân phụ xoắn quanh thân chính tạo dáng cổ thụ ngàn năm
  for (let i = 0; i < 5; i++) {
    const a0 = (i / 5) * TAU;
    const subCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(cx + Math.cos(a0) * 0.72, 0.25, cz + Math.sin(a0) * 0.72),
      new THREE.Vector3(cx + Math.cos(a0 + 0.45) * 0.58, 1.5, cz + Math.sin(a0 + 0.45) * 0.58),
      new THREE.Vector3(cx + Math.cos(a0 + 0.85) * 0.48, 2.9, cz + Math.sin(a0 + 0.85) * 0.48),
      new THREE.Vector3(cx + Math.cos(a0 + 1.1) * 0.55, 3.9, cz + Math.sin(a0 + 1.1) * 0.55),
    ]);
    bTrunk.add(taperedTube(subCurve, 14, 7, (t) => 0.36 - 0.14 * t), m.bark, undefined, i % 2 ? 0x6a503b : 0x58412f);
  }

  // 9 rễ nổi bò qua bồn đá bám xuống sân đất
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU + (r() - 0.5) * 0.25;
    const ca = Math.cos(a), sa = Math.sin(a);
    const rootLen = 1.65 + r() * 0.55;
    const rCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(cx + ca * 0.65, 1.15 + r() * 0.35, cz + sa * 0.65),
      new THREE.Vector3(cx + ca * 1.25, 0.56, cz + sa * 1.25),
      new THREE.Vector3(cx + ca * 1.52, 0.26, cz + sa * 1.52),
      new THREE.Vector3(cx + ca * rootLen, 0.02, cz + sa * rootLen),
    ]);
    bTrunk.add(taperedTube(rCurve, 12, 6, (t) => 0.26 * (1 - t * 0.78)), m.bark, undefined, 0x5c4432);
  }

  // ── 3. 8 cành lớn vươn rộng + cành nhánh + rễ phụ rủ xuống ──
  const canopyMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 });
  addWind(canopyMat, shared, { amp: 0.085, freq: 1.35, weight: '1.0' });
  ownMat.push(canopyMat);

  const ribbonAnchors: THREE.Vector3[] = [];
  const branchCount = 8;
  for (let i = 0; i < branchCount; i++) {
    const a = (i / branchCount) * TAU + 0.18;
    const ca = Math.cos(a), sa = Math.sin(a);
    const reach = 5.2 + (i % 2) * 0.95;
    const topY = 6.2 + (i % 3) * 0.65;
    const bCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(cx + ca * 0.4, 3.35, cz + sa * 0.4),
      new THREE.Vector3(cx + ca * (reach * 0.42), 4.45 + (i % 2) * 0.3, cz + sa * (reach * 0.42)),
      new THREE.Vector3(cx + ca * (reach * 0.78), 5.25 + (i % 3) * 0.25, cz + sa * (reach * 0.78)),
      new THREE.Vector3(cx + ca * reach, topY, cz + sa * reach),
    ]);
    bTrunk.add(taperedTube(bCurve, 16, 7, (t) => 0.42 * (1 - t * 0.72)), m.bark, undefined, 0x614835);

    // cành nhánh chẻ đôi + lưu điểm treo ruy-băng dọc cành dưới (y ≈ 3.8..4.9m)
    for (const side of [-1, 1]) {
      const mid = bCurve.getPoint(0.52);
      const subA = a + side * (0.45 + r() * 0.2);
      const tip = new THREE.Vector3(mid.x + Math.cos(subA) * 2.4, mid.y + 1.15 + r() * 0.5, mid.z + Math.sin(subA) * 2.4);
      limb(bTrunk, m.bark, mid, tip, 0.16, 0.06, 0x5b4331, 6);

      // điểm treo ruy-băng rải đều dưới các cành
      for (let k = 0; k < 5; k++) {
        const u = 0.28 + k * 0.16;
        const p = k < 3 ? bCurve.getPoint(0.32 + k * 0.2) : mid.clone().lerp(tip, (k - 2) * 0.36);
        ribbonAnchors.push(new THREE.Vector3(p.x + (r() - 0.5) * 0.55, p.y - 0.12 - r() * 0.25, p.z + (r() - 0.5) * 0.55));
        void u;
      }
    }

    // rễ phụ mảnh rủ xuống từ cành già
    if (i % 2 === 0) {
      const rp = bCurve.getPoint(0.38);
      const hangH = 1.4 + r() * 0.8;
      bDeco.cyl(m.bark, 0.022, 0.012, hangH, 5, rp.x, rp.y - hangH, rp.z, 0x6e533d);
    }
  }

  // ── 4. Tán lá vòm tim lớn nhiều tầng màu (lục đậm → xanh lá non → vàng nắng đỉnh tán) ──
  const crownClusters: [number, number, number, number, number, number][] = [
    // tầng dưới xoè rộng (y ≈ 5.6..6.8)
    [-5.2, 5.8, 0.2, 2.3, 1.35, 0x357a3c], [5.2, 5.7, -0.2, 2.35, 1.35, 0x3b8440],
    [0.3, 5.7, 5.1, 2.35, 1.35, 0x3e8842], [-0.3, 5.8, -5.1, 2.3, 1.35, 0x34783b],
    [-3.9, 5.9, 3.8, 2.2, 1.3, 0x428c43],  [3.9, 5.8, 3.8, 2.25, 1.3, 0x479245],
    [-3.9, 5.9, -3.8, 2.2, 1.3, 0x387e3e], [3.9, 5.9, -3.8, 2.2, 1.3, 0x418a42],
    // tầng giữa dày ấm (y ≈ 7.2..8.6)
    [-3.4, 7.4, 0.0, 2.5, 1.55, 0x4b9644], [3.4, 7.4, 0.0, 2.5, 1.55, 0x529c46],
    [0.0, 7.5, 3.4, 2.5, 1.55, 0x56a047],  [0.0, 7.4, -3.4, 2.45, 1.5, 0x479243],
    [-2.4, 7.7, 2.4, 2.3, 1.45, 0x5ea646], [2.4, 7.7, 2.4, 2.3, 1.45, 0x64ac47],
    [-2.4, 7.6, -2.4, 2.25, 1.45, 0x4f9945],[2.4, 7.6, -2.4, 2.25, 1.45, 0x58a246],
    [0.0, 7.2, 0.0, 2.9, 1.6, 0x3a803e],
    // tầng ngọn vút dáng búp lá tim ánh vàng nắng (y ≈ 9.0..11.6)
    [-1.5, 9.1, 0.8, 2.1, 1.45, 0x72b444], [1.5, 9.1, 0.8, 2.1, 1.45, 0x7ab845],
    [0.0, 9.2, -1.4, 2.1, 1.45, 0x6ab044], [0.0, 9.4, 1.4, 2.0, 1.45, 0x84be44],
    [-2.2, 6.6, 4.2, 1.75, 1.2, 0x458f44], [2.2, 6.6, 4.2, 1.75, 1.2, 0x4a9445],
    [0.0, 10.4, 0.0, 1.85, 1.55, 0x9ac644],
    [0.0, 11.45, 0.0, 1.15, 1.35, 0xb8cf48], // chóp búp lá tim đặc trưng cây bồ đề
  ];
  crownClusters.forEach(([ox, oy, oz, rad, sy, hex], idx) => {
    const col = new THREE.Color(hex).offsetHSL((r() - 0.5) * 0.02, 0, (r() - 0.5) * 0.05);
    bCanopy.add(
      jitter(new THREE.IcosahedronGeometry(1, 2), 0.16, idx + 40),
      canopyMat,
      xf(cx + ox, oy, cz + oz, r() * TAU, rad, sy, rad),
      col,
      true,
    );
  });

  // 220 lá bồ đề hình tim chi tiết điểm xuyết quanh mép tán dưới để nhìn gần thấy rõ dáng lá tim
  const crownLeafGeo = bodhiLeafGeometry();
  const crownLeafMat = new THREE.MeshStandardMaterial({ roughness: 0.72, side: THREE.DoubleSide });
  addWind(crownLeafMat, shared, { amp: 0.12, freq: 1.9, weight: '1.0' });
  ownGeo.push(crownLeafGeo);
  ownMat.push(crownLeafMat);
  const CROWN_LEAF_N = 220;
  const crownLeafInst = new THREE.InstancedMesh(crownLeafGeo, crownLeafMat, CROWN_LEAF_N);
  crownLeafInst.castShadow = false;
  const dummy = new THREE.Object3D();
  const tmpC = new THREE.Color();
  for (let i = 0; i < CROWN_LEAF_N; i++) {
    const a = r() * TAU;
    const rad = 2.4 + r() * 4.3;
    const ly = 4.6 + r() * 4.4;
    dummy.position.set(cx + Math.cos(a) * rad, ly, cz + Math.sin(a) * rad);
    dummy.rotation.set((r() - 0.5) * 1.1, r() * TAU, (r() - 0.5) * 1.1);
    dummy.scale.setScalar(0.95 + r() * 0.65);
    dummy.updateMatrix();
    crownLeafInst.setMatrixAt(i, dummy.matrix);
    tmpC.setHex(i % 5 === 0 ? 0xd8b238 : i % 3 === 0 ? 0x76b843 : 0x4b9441);
    crownLeafInst.setColorAt(i, tmpC);
  }
  crownLeafInst.instanceMatrix.needsUpdate = true;
  if (crownLeafInst.instanceColor) crownLeafInst.instanceColor.needsUpdate = true;
  group.add(crownLeafInst);

  // ── 5. Bàn đá dâng hương dưới cội Bồ Đề, ghế đá rêu & đèn đá ──
  // Bàn hương đá nhỏ đặt gọn sát mép đông-nam bồn cây (x=-20.45, z=-5.65, chừa thoáng điểm đứng (-20,-4))
  {
    const ax = cx + 1.32, az = cz - 0.65;
    bTrunk.box(m.stone, 0.92, 0.12, 0.62, ax, 0.66, az, -0.35, 0xb8b2a6);
    bTrunk.box(m.stoneDark, 0.72, 0.66, 0.44, ax, 0, az, -0.35, 0x8e887e);
    bTrunk.cyl(m.bronze, 0.14, 0.11, 0.16, 12, ax, 0.78, az);
    addLotus(bDeco, m.paintDouble, ax - 0.24, 0.8, az + 0.12, 0.34, 0.85, 0xf8c2d2, 0xf08cae);
    bTrunk.sphere(m.stoneGlow, 0.065, ax + 0.25, 0.86, az - 0.1, 1, 1.3, 1, 0xffd888);
    halos.push({ x: ax + 0.25, y: 0.88, z: az - 0.1, size: 0.95, color: 0xffad48, flicker: 0.15, day: 0.15 });
  }
  // Ghế đá cong rêu phong phía tây-bắc gốc cây (ngoài đường đi)
  {
    const bx = cx - 2.35, bz = cz - 2.15, bry = 0.72;
    bTrunk.box(m.stone, 1.75, 0.11, 0.52, bx, 0.42, bz, bry, 0xb2aca0);
    for (const off of [-0.62, 0.62]) {
      bTrunk.box(m.stoneDark, 0.22, 0.42, 0.46, bx + Math.cos(bry) * off, 0, bz - Math.sin(bry) * off, bry, 0x868178);
    }
  }
  stoneLantern(bTrunk, m, halos, cx + 2.45, 0, cz - 2.25, 0.92);
  stoneLantern(bTrunk, m, halos, cx - 2.35, 0, cz + 2.35, 0.92);
  bush(bDeco, m, cx - 1.9, cz - 1.3, 0.75, 0x4b8a3f);
  bush(bDeco, m, cx - 1.6, cz + 1.5, 0.7, 0x559443);

  for (const cm of bCanopy.build(group, 'bodhi-canopy')) ownGeo.push(cm.geometry);

  // ── 6. DẢI LỤA ƯỚC NGUYỆN (`setWishRibbons(count)`, tối đa 80 dải) ──
  while (ribbonAnchors.length < MAX_RIBBONS) {
    const a = r() * TAU, rad = 2.1 + r() * 3.1;
    ribbonAnchors.push(new THREE.Vector3(cx + Math.cos(a) * rad, 3.9 + r() * 1.1, cz + Math.sin(a) * rad));
  }
  // ưu tiên sắp các điểm treo phía đông & nam trước để ít ruy-băng vẫn nổi bật trước mắt người chơi
  ribbonAnchors.sort((pA, pB) => (pB.x + pB.z * 0.6) - (pA.x + pA.z * 0.6));

  const ribbonGeo = wishRibbonGeometry();
  const ribbonMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.52,
    metalness: 0.06,
    emissive: 0x3a1008,
    emissiveIntensity: 0.35,
    side: THREE.DoubleSide,
  });
  addWind(ribbonMat, shared, { amp: 0.22, freq: 2.35, weight: 'clamp(-position.y, 0.0, 1.2)' });
  ownGeo.push(ribbonGeo);
  ownMat.push(ribbonMat);

  const ribbonMesh = new THREE.InstancedMesh(ribbonGeo, ribbonMat, MAX_RIBBONS);
  ribbonMesh.frustumCulled = false;
  const ribbonPalette = [0xd92924, 0xf2b830, 0xe84868, 0xe03a28, 0xf6cc4c, 0xf0789c];
  for (let i = 0; i < MAX_RIBBONS; i++) {
    const p = ribbonAnchors[i];
    dummy.position.copy(p);
    dummy.rotation.set(0, r() * TAU, 0);
    dummy.scale.setScalar(0.88 + (i % 4) * 0.08);
    dummy.updateMatrix();
    ribbonMesh.setMatrixAt(i, dummy.matrix);
    tmpC.setHex(ribbonPalette[i % ribbonPalette.length]);
    ribbonMesh.setColorAt(i, tmpC);
  }
  ribbonMesh.instanceMatrix.needsUpdate = true;
  if (ribbonMesh.instanceColor) ribbonMesh.instanceColor.needsUpdate = true;
  ribbonMesh.count = 18; // mặc định có sẵn các dải nguyện mẫu khi mở độc lập
  group.add(ribbonMesh);

  // ── 7. LÁ VÀNG RƠI ÊM ĐỀM & MƯA LỘC VÀNG (`triggerLoc`) ──
  const fallLeafGeo = bodhiLeafGeometry();
  const fallLeafMat = new THREE.MeshStandardMaterial({
    roughness: 0.45,
    metalness: 0.25,
    emissive: 0x6b4508,
    emissiveIntensity: 0.45,
    side: THREE.DoubleSide,
  });
  ownGeo.push(fallLeafGeo);
  ownMat.push(fallLeafMat);

  const fallMesh = new THREE.InstancedMesh(fallLeafGeo, fallLeafMat, TOTAL_FALL_LEAVES);
  fallMesh.frustumCulled = false;
  group.add(fallMesh);

  const fallLeaves: FallingLeaf[] = [];
  function resetAmbientLeaf(lf: FallingLeaf, randomHeight = false): void {
    const a = Math.random() * TAU;
    const rad = 1.0 + Math.random() * 4.5;
    lf.active = true;
    lf.x = cx + Math.cos(a) * rad;
    lf.z = cz + Math.sin(a) * rad;
    lf.y = randomHeight ? 0.5 + Math.random() * 5.2 : 4.6 + Math.random() * 2.2;
    lf.vy = 0.45 + Math.random() * 0.3;
    lf.swayAmp = 0.45 + Math.random() * 0.4;
    lf.swayFreq = 1.4 + Math.random() * 0.9;
    lf.phase = Math.random() * TAU;
    lf.scale = 0.72 + Math.random() * 0.35;
    lf.life = 0;
    lf.maxLife = 12;
  }

  for (let i = 0; i < TOTAL_FALL_LEAVES; i++) {
    const isAmb = i < AMBIENT_LEAVES;
    const lf: FallingLeaf = {
      active: isAmb,
      ambient: isAmb,
      x: cx,
      y: -20,
      z: cz,
      vy: 0.6,
      swayAmp: 0.5,
      swayFreq: 1.8,
      phase: i,
      scale: 0.85,
      life: 0,
      maxLife: 4,
    };
    if (isAmb) resetAmbientLeaf(lf, true);
    fallLeaves.push(lf);
    tmpC.setHex(isAmb ? (i % 2 ? 0xe0a832 : 0x88b840) : 0xffd24c);
    fallMesh.setColorAt(i, tmpC);
  }
  if (fallMesh.instanceColor) fallMesh.instanceColor.needsUpdate = true;

  // Đèn điểm ấm ẩn trong vòm cây Bồ Đề soi ruy-băng ban đêm
  const treeLight = new THREE.PointLight(0xffb454, 0, 18, 1.6);
  treeLight.position.set(cx + 0.8, 3.7, cz + 0.6);
  group.add(treeLight);

  let windBoost = 0;
  let locGlow = 0;
  const cGoldBright = new THREE.Color(1.0, 0.88, 0.4);
  const cGoldWarm = new THREE.Color(1.0, 0.6, 0.16);
  const cCrimson = new THREE.Color(1.0, 0.35, 0.45);

  return {
    group,
    center: new THREE.Vector3(cx, 3.8, cz),
    setWishRibbons(count: number): void {
      ribbonMesh.count = clamp(Math.round(count), 0, MAX_RIBBONS);
    },
    triggerLoc(at): void {
      const lx = at?.x ?? cx + 1.0, lz = at?.z ?? cz + 0.5;
      locGlow = 1.0;
      for (let i = AMBIENT_LEAVES; i < TOTAL_FALL_LEAVES; i++) {
        const lf = fallLeaves[i];
        const a = Math.random() * TAU, rad = Math.random() * 4.2;
        lf.active = true;
        lf.x = lx + Math.cos(a) * rad;
        lf.z = lz + Math.sin(a) * rad;
        lf.y = 4.2 + Math.random() * 3.0;
        lf.vy = 0.85 + Math.random() * 0.7;
        lf.swayAmp = 0.55 + Math.random() * 0.5;
        lf.swayFreq = 2.0 + Math.random() * 1.4;
        lf.phase = Math.random() * TAU;
        lf.scale = 0.85 + Math.random() * 0.45;
        lf.life = 0;
        lf.maxLife = 3.2 + Math.random() * 1.6;
      }
      for (let i = 0; i < 42; i++) {
        const a = Math.random() * TAU, rad = Math.random() * 3.6;
        sparks.spawn(
          lx + Math.cos(a) * rad, 4.4 + Math.random() * 2.2, lz + Math.sin(a) * rad,
          (Math.random() - 0.5) * 0.8, -0.7 - Math.random() * 0.9, (Math.random() - 0.5) * 0.8,
          2.0 + Math.random() * 1.1, 0.16, 0.03, cGoldBright, cGoldWarm, 0.95, 0.25, 0.4, 1, 0.45,
        );
      }
    },
    triggerRibbon(at): void {
      const rx = at?.x ?? cx + 1.2, rz = at?.z ?? cz + 0.6;
      windBoost = 1.0;
      for (let i = 0; i < 30; i++) {
        const a = Math.random() * TAU;
        sparks.spawn(
          rx + Math.cos(a) * 1.2, 2.2 + Math.random() * 1.8, rz + Math.sin(a) * 1.2,
          Math.cos(a) * 0.8, 1.3 + Math.random() * 1.2, Math.sin(a) * 0.8,
          1.3 + Math.random() * 0.7, 0.14, 0.03, i % 2 ? cCrimson : cGoldBright, cGoldBright, 0.9, 0.15, 0.8, 1, 0.35,
        );
      }
    },
    update(dt: number, t: number, night: number, lightsOn: boolean): void {
      if (windBoost > 0) windBoost = Math.max(0, windBoost - dt * 0.9);
      if (locGlow > 0) locGlow = Math.max(0, locGlow - dt * 0.7);
      shared.uWind.value = 1 + windBoost * 1.6;
      ribbonMat.emissiveIntensity = 0.22 + night * 0.65 + windBoost * 0.45;
      fallLeafMat.emissiveIntensity = 0.35 + locGlow * 0.9 + night * 0.35;

      for (let i = 0; i < TOTAL_FALL_LEAVES; i++) {
        const lf = fallLeaves[i];
        if (!lf.active) {
          dummy.position.set(0, -20, 0);
          dummy.scale.setScalar(0.001);
          dummy.updateMatrix();
          fallMesh.setMatrixAt(i, dummy.matrix);
          continue;
        }
        lf.life += dt;
        lf.y -= lf.vy * dt;
        if (lf.ambient) {
          if (lf.y <= 0.05) resetAmbientLeaf(lf, false);
        } else if (lf.y <= 0.04 || lf.life >= lf.maxLife) {
          lf.active = false;
          continue;
        }
        const sx = lf.x + Math.sin(t * lf.swayFreq + lf.phase) * lf.swayAmp;
        const sz = lf.z + Math.cos(t * lf.swayFreq * 0.82 + lf.phase) * lf.swayAmp * 0.75;
        const fade = lf.ambient ? 1 : 1 - Math.max(0, (lf.life / lf.maxLife - 0.75) / 0.25);
        dummy.position.set(sx, Math.max(0.04, lf.y), sz);
        dummy.rotation.set(Math.sin(t * 2.4 + lf.phase) * 0.65, t * 1.3 + lf.phase, Math.cos(t * 2.1 + lf.phase) * 0.65);
        dummy.scale.setScalar(lf.scale * fade);
        dummy.updateMatrix();
        fallMesh.setMatrixAt(i, dummy.matrix);
      }
      fallMesh.instanceMatrix.needsUpdate = true;

      treeLight.intensity = (lightsOn ? night * 16 : 0) + locGlow * 22 + windBoost * 10;
      treeLight.visible = treeLight.intensity > 0.05;
    },
    dispose(): void {
      for (const g of ownGeo) g.dispose();
      for (const mt of ownMat) mt.dispose();
    },
  };
}
