/**
 * Khu Vườn & Chuồng Gà Sau Chùa (`CHICKEN_COOP` quanh `(0, -45.6)`):
 * - Cổng vòm gỗ lợp ngói âm dương, biển sơn son chữ vàng "VIÊN CẦM TỊNH VIÊN", đèn lồng đỏ ấm.
 * - Hàng rào nan tre & trụ gỗ mộc bao quanh sân đất rơm, nhà gà sàn gỗ có cầu thang gà & ổ rơm trứng ấm,
 *   máng thóc vàng (tương tác Cho gà ăn), máng nước sành, cây rơm vàng làng quê, bội tre, khóm trúc & cây bóng mát.
 * - Đàn gà 3D nhiều màu lông (gà mơ, gà trắng, gà trống tía, gà nâu) mổ thóc, vỗ cánh, đi lại tự nhiên.
 * - Hệ thống "Gà sổng chuồng thất lạc": sinh 1–2 chú gà đi lạc quanh khuôn viên chùa kèm vòng sáng báo hiệu,
 *   hỗ trợ chạm bắt hoặc đứng gần bắt (`[F]`) rồi ôm về thả lại vào chuồng để tích công đức.
 */
import * as THREE from 'three';
import { CHICKEN_COOP } from '@/world/layout';
import { Batch, clamp, jitter, rng, TAU, xf } from './core';
import { hangingLantern, stoneLantern } from './courtyard';
import { bambooClump, bush, flowerBed, treeRound } from './flora';
import type { Mats } from './materials';
import type { HaloSpec, ParticleField } from './particles';
import { buildRoof } from './roof';
import { plaqueTexture } from './textures';

export interface ChickenPalette {
  name: string;
  body: number;
  wing: number;
  tail: number;
  neck: number;
}

export const CHICKEN_PALETTES: readonly ChickenPalette[] = [
  { name: 'Gà mơ vàng',   body: 0xe5a83b, wing: 0xb86c22, tail: 0x4e2e18, neck: 0xf0be52 },
  { name: 'Gà trắng ngà', body: 0xf5efe2, wing: 0xe0d5bf, tail: 0xd5b47c, neck: 0xfaf6ec },
  { name: 'Gà trống tía', body: 0xbd4824, wing: 0x8a2c16, tail: 0x243b32, neck: 0xe69c2c },
  { name: 'Gà nâu đất',   body: 0x9c6038, wing: 0x6b3d20, tail: 0x3b2314, neck: 0xb87848 },
];

export interface LostChickenInfo {
  id: string;
  plumage: number;
  x: number;
  z: number;
  ry: number;
  hint: string;
}

export interface CoopPart {
  group: THREE.Group;
  troughPos: THREE.Vector3;
  gatePos: THREE.Vector3;
  /** Tổng số gà đang ở yên trong chuồng. */
  residentCount(): number;
  /** Rải thóc vàng vào máng, đàn gà trong chuồng chạy lại mổ thóc. */
  triggerFeed(): void;
  /** Sinh 1 chú gà sổng chuồng ở khu vực đi bộ hợp lệ. */
  spawnLostChicken(isFree: (x: number, z: number) => boolean, preferredZone?: number): LostChickenInfo | null;
  /** Danh sách gà đang thất lạc ngoài sân chùa. */
  getLostChickens(): LostChickenInfo[];
  /** Tìm chú gà thất lạc gần (x, z) nhất trong bán kính `maxDist`. */
  nearestLostChicken(x: number, z: number, maxDist?: number): LostChickenInfo | null;
  /** Bắt tia chạm 3D vào gà thất lạc (nhạy cho cả chuột và cảm ứng di động). */
  pickLostChicken(ray: THREE.Ray, radius?: number): LostChickenInfo | null;
  /** Bắt chú gà thất lạc theo id (xoá khỏi mặt đất để nhân vật ôm trên tay). */
  catchLostChicken(id: string): { plumage: number; x: number; z: number; hint: string } | null;
  /** Thả chú gà đang ôm vào lại trong chuồng kèm hiệu ứng vui mừng. */
  returnChickenToCoop(plumage?: number): void;
  update(
    dt: number,
    t: number,
    night: number,
    lightsOn: boolean,
    playerPos?: { x: number; z: number },
    isFree?: (x: number, z: number) => boolean,
  ): void;
  dispose(): void;
}

interface ChickenMeshRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  neckPivot: THREE.Group;
  wingL: THREE.Group;
  wingR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  marker?: THREE.Group;
  dispose(): void;
}

/**
 * Dựng mô hình 3D một chú gà chùa (hướng nhìn mặc định về -Z).
 * Dùng chung cho gà trong chuồng, gà sổng chuồng và đạo cụ gà ôm trên tay nhân vật.
 */
export function createChickenMesh(plumageIndex = 0, withAlertMarker = false): ChickenMeshRig {
  const pal = CHICKEN_PALETTES[((plumageIndex % CHICKEN_PALETTES.length) + CHICKEN_PALETTES.length) % CHICKEN_PALETTES.length];
  const ownGeo: THREE.BufferGeometry[] = [];
  const ownMat: THREE.Material[] = [];
  const ownTex: THREE.Texture[] = [];

  const keepG = <T extends THREE.BufferGeometry>(g: T): T => { ownGeo.push(g); return g; };
  const std = (color: number, rough = 0.78): THREE.MeshStandardMaterial => {
    const mt = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.03 });
    ownMat.push(mt);
    return mt;
  };

  const matBody = std(pal.body, 0.8);
  const matWing = std(pal.wing, 0.82);
  const matTail = std(pal.tail, 0.76);
  const matNeck = std(pal.neck, 0.78);
  const matComb = std(0xd92b28, 0.55);
  const matBeak = std(0xf2a428, 0.5);
  const matEye = std(0x1b1614, 0.25);
  const matShadow = new THREE.MeshBasicMaterial({
    color: 0x1a140e,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
  });
  ownMat.push(matShadow);

  const root = new THREE.Group();
  root.name = 'chicken-actor';

  // Bóng tròn mềm dưới chân
  const shadow = new THREE.Mesh(keepG(new THREE.CircleGeometry(0.21, 16)), matShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  root.add(shadow);

  const bodyPivot = new THREE.Group();
  bodyPivot.position.y = 0.24;
  root.add(bodyPivot);

  // Thân gà tròn đầy đặn
  const bodyGeo = keepG(new THREE.SphereGeometry(1, 14, 11));
  const body = new THREE.Mesh(bodyGeo, matBody);
  body.scale.set(0.165, 0.148, 0.215);
  body.castShadow = true;
  body.receiveShadow = true;
  bodyPivot.add(body);

  // Phao câu & chùm lông đuôi cong vút phía sau (+Z)
  const tailBase = new THREE.Mesh(bodyGeo, matBody);
  tailBase.position.set(0, 0.055, 0.16);
  tailBase.scale.set(0.095, 0.09, 0.11);
  tailBase.castShadow = true;
  bodyPivot.add(tailBase);

  const featherGeo = keepG(new THREE.ConeGeometry(0.052, 0.22, 6));
  for (let i = -1; i <= 1; i++) {
    const f = new THREE.Mesh(featherGeo, matTail);
    f.position.set(i * 0.036, 0.13 - Math.abs(i) * 0.018, 0.22 + Math.abs(i) * 0.012);
    f.rotation.set(0.68, i * 0.22, -i * 0.16);
    f.castShadow = true;
    bodyPivot.add(f);
  }

  // Hai cánh bên (vỗ khi chạy / nhảy)
  const wingGeo = keepG(new THREE.SphereGeometry(1, 10, 8));
  const mkWing = (side: -1 | 1): THREE.Group => {
    const piv = new THREE.Group();
    piv.position.set(side * 0.145, 0.035, -0.01);
    const wm = new THREE.Mesh(wingGeo, matWing);
    wm.position.set(side * 0.022, -0.035, 0.02);
    wm.scale.set(0.042, 0.095, 0.145);
    wm.rotation.z = side * -0.14;
    wm.castShadow = true;
    piv.add(wm);
    bodyPivot.add(piv);
    return piv;
  };
  const wingL = mkWing(-1);
  const wingR = mkWing(1);

  // Cổ & đầu gà (gật gù / cúi mổ thóc quanh trục X)
  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 0.075, -0.135);
  bodyPivot.add(neckPivot);

  const neck = new THREE.Mesh(keepG(new THREE.CylinderGeometry(0.068, 0.095, 0.14, 10)), matNeck);
  neck.position.set(0, 0.055, -0.015);
  neck.rotation.x = 0.22;
  neck.castShadow = true;
  neckPivot.add(neck);

  const head = new THREE.Mesh(bodyGeo, matNeck);
  head.position.set(0, 0.135, -0.035);
  head.scale.set(0.092, 0.092, 0.098);
  head.castShadow = true;
  neckPivot.add(head);

  // Mào gà 3 khía đỏ tươi + tích gà dưới cằm
  for (let i = 0; i < 3; i++) {
    const lobe = new THREE.Mesh(bodyGeo, matComb);
    lobe.position.set(0, 0.218 - i * 0.008, -0.062 + i * 0.034);
    lobe.scale.set(0.022, 0.042 - i * 0.005, 0.028);
    neckPivot.add(lobe);
  }
  const wattle = new THREE.Mesh(bodyGeo, matComb);
  wattle.position.set(0, 0.078, -0.095);
  wattle.scale.set(0.024, 0.034, 0.022);
  neckPivot.add(wattle);

  // Mỏ vàng cam hướng về -Z
  const beak = new THREE.Mesh(keepG(new THREE.ConeGeometry(0.032, 0.085, 6)), matBeak);
  beak.position.set(0, 0.128, -0.145);
  beak.rotation.x = -Math.PI / 2;
  neckPivot.add(beak);

  // Mắt đen láy hai bên
  for (const side of [-1, 1] as const) {
    const eye = new THREE.Mesh(bodyGeo, matEye);
    eye.position.set(side * 0.074, 0.148, -0.068);
    eye.scale.setScalar(0.018);
    neckPivot.add(eye);
  }

  // Hai chân vàng cam
  const shankGeo = keepG(new THREE.CylinderGeometry(0.014, 0.013, 0.15, 6));
  const toeGeo = keepG(new THREE.BoxGeometry(0.016, 0.012, 0.075));
  const mkLeg = (side: -1 | 1): THREE.Group => {
    const piv = new THREE.Group();
    piv.position.set(side * 0.062, 0.15, 0.0);
    const shank = new THREE.Mesh(shankGeo, matBeak);
    shank.position.y = -0.072;
    piv.add(shank);
    for (const ta of [-0.35, 0, 0.35]) {
      const toe = new THREE.Mesh(toeGeo, matBeak);
      toe.position.set(Math.sin(ta) * 0.018, -0.144, -0.022);
      toe.rotation.y = -ta;
      piv.add(toe);
    }
    root.add(piv);
    return piv;
  };
  const legL = mkLeg(-1);
  const legR = mkLeg(1);

  let marker: THREE.Group | undefined;
  if (withAlertMarker) {
    marker = new THREE.Group();
    // Vòng sáng vàng ấm dưới đất giúp người chơi dễ nhận diện gà thất lạc từ xa
    const ringGeo = keepG(new THREE.RingGeometry(0.32, 0.42, 28));
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffcf58,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    ownMat.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.024;
    ring.name = 'alert-ring';
    marker.add(ring);

    // Huy hiệu chấm than tròn ấm áp lơ lửng trên đầu chú gà thất lạc
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 58);
    g.addColorStop(0, 'rgba(255, 224, 130, 0.98)');
    g.addColorStop(0.68, 'rgba(218, 120, 32, 0.95)');
    g.addColorStop(1, 'rgba(218, 120, 32, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#fff5d6';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(64, 64, 42, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = '#2b1308';
    ctx.font = '900 58px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 64, 66);

    const badgeTex = new THREE.CanvasTexture(c);
    badgeTex.colorSpace = THREE.SRGBColorSpace;
    ownTex.push(badgeTex);
    const spMat = new THREE.SpriteMaterial({ map: badgeTex, transparent: true, depthWrite: false });
    ownMat.push(spMat);
    const sp = new THREE.Sprite(spMat);
    sp.scale.set(0.42, 0.42, 1);
    sp.position.y = 0.78;
    sp.name = 'alert-badge';
    marker.add(sp);
    root.add(marker);
  }

  return {
    root,
    bodyPivot,
    neckPivot,
    wingL,
    wingR,
    legL,
    legR,
    marker,
    dispose(): void {
      for (const g of ownGeo) g.dispose();
      for (const mt of ownMat) mt.dispose();
      for (const tx of ownTex) tx.dispose();
    },
  };
}

interface PenChicken {
  rig: ChickenMeshRig;
  x: number;
  z: number;
  tx: number;
  tz: number;
  ry: number;
  speed: number;
  wait: number;
  peckTimer: number;
  hopTimer: number;
  phase: number;
  extra: boolean;
}

interface LostChicken {
  id: string;
  plumage: number;
  zoneIdx: number;
  hint: string;
  rig: ChickenMeshRig;
  x: number;
  z: number;
  tx: number;
  tz: number;
  ry: number;
  wait: number;
  peckTimer: number;
  hopTimer: number;
  phase: number;
}

const LOST_ZONES: readonly { hint: string; cx: number; cz: number; r: number }[] = [
  { hint: 'gần Cây bồ đề',        cx: -17.5, cz: -3.5,  r: 4.2 },
  { hint: 'quanh Ao sen',          cx: -8.5,  cz: 13.5,  r: 3.8 },
  { hint: 'gần Gác chuông',        cx: 11.2,  cz: -7.5,  r: 3.8 },
  { hint: 'sân trước Chánh điện',  cx: 5.2,   cz: -10.0, r: 4.2 },
  { hint: 'lối sang Giếng ngọc',   cx: -21.5, cz: -18.5, r: 3.8 },
  { hint: 'gần Sân thiền',         cx: 17.5,  cz: 4.0,   r: 3.8 },
  { hint: 'sân trước cổng chùa',   cx: -3.8,  cz: 21.0,  r: 4.2 },
];

function animateChickenRig(
  rig: ChickenMeshRig,
  t: number,
  phase: number,
  moving: boolean,
  speedRatio: number,
  pecking: boolean,
  hop: number,
): void {
  const w = t * (moving ? 14 * Math.max(0.7, speedRatio) : 3.2) + phase;
  const hopLift = hop > 0 ? Math.sin(hop * Math.PI) * 0.24 : 0;
  const walkBob = moving ? Math.abs(Math.sin(w)) * 0.028 : Math.sin(t * 2.4 + phase) * 0.006;

  rig.bodyPivot.position.y = 0.24 + walkBob + hopLift;
  rig.bodyPivot.rotation.z = moving ? Math.sin(w) * 0.07 : 0;
  rig.bodyPivot.rotation.x = pecking ? 0.28 : 0;

  if (pecking) {
    // Mổ thóc nhanh nhịp nhàng xuống đất
    const pk = Math.abs(Math.sin(t * 15 + phase * 2));
    rig.neckPivot.rotation.x = 0.35 + pk * 0.95;
  } else if (moving) {
    rig.neckPivot.rotation.x = 0.08 + Math.sin(w * 2) * 0.16;
  } else {
    rig.neckPivot.rotation.x = Math.sin(t * 1.9 + phase) * 0.08;
    rig.neckPivot.rotation.y = Math.sin(t * 1.1 + phase * 1.7) * 0.28;
  }
  if (moving || pecking) rig.neckPivot.rotation.y *= 0.85;

  const flap = hop > 0
    ? 0.45 + Math.abs(Math.sin(t * 28 + phase)) * 0.65
    : moving && speedRatio > 1.05
      ? 0.18 + Math.abs(Math.sin(t * 20 + phase)) * 0.32
      : 0.03 * Math.sin(t * 2.2 + phase);
  rig.wingL.rotation.z = -flap;
  rig.wingR.rotation.z = flap;

  const stride = moving ? Math.sin(w) * 0.55 : 0;
  rig.legL.position.y = 0.15 + hopLift * 0.65;
  rig.legR.position.y = 0.15 + hopLift * 0.65;
  rig.legL.rotation.x = stride;
  rig.legR.rotation.x = -stride;

  if (rig.marker) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 4.2 + phase);
    const ring = rig.marker.getObjectByName('alert-ring') as THREE.Mesh | undefined;
    if (ring) {
      ring.scale.setScalar(0.92 + pulse * 0.2);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.45 + pulse * 0.38;
    }
    const badge = rig.marker.getObjectByName('alert-badge') as THREE.Sprite | undefined;
    if (badge) {
      badge.position.y = 0.78 + hopLift + Math.sin(t * 3.6 + phase) * 0.06;
    }
  }
}

export function buildCoop(
  m: Mats,
  halos: HaloSpec[],
  sparks: ParticleField,
  bMain: Batch,
  bDeco: Batch,
): CoopPart {
  const group = new THREE.Group();
  group.name = 'chicken-coop';
  const ownGeo: THREE.BufferGeometry[] = [];
  const ownMat: THREE.Material[] = [];
  const ownTex: THREE.Texture[] = [];

  const r = rng(2026);
  const CX = CHICKEN_COOP.cx;
  const CZ = CHICKEN_COOP.cz;
  const x0 = CX - 5.0, x1 = CX + 5.0;
  const z0 = CZ - 3.7, z1 = CHICKEN_COOP.gateZ; // -49.3 .. -41.9

  // ═══════════════════ 1. NỀN ĐẤT RƠM & HÀNG RÀO NAN TRE + CỔNG CHUỒNG GÀ ═══════════════════
  // Phiến đá bước trước cổng chuồng gà
  for (let i = 0; i < 3; i++) {
    bDeco.cyl(m.stone, 0.55 - i * 0.04, 0.58 - i * 0.04, 0.038, 12, CX + (i - 1) * 0.95, 0.005, z1 + 0.65 + (i % 2) * 0.18, 0xb8b2a5);
  }

  // Viền đá mộc chân rào
  bMain.box(m.stoneDark, 10.3, 0.14, 0.24, CX, 0, z0, 0, 0x857f75);
  bMain.box(m.stoneDark, 0.24, 0.14, z1 - z0 + 0.2, x0, 0, (z0 + z1) / 2, 0, 0x857f75);
  bMain.box(m.stoneDark, 0.24, 0.14, z1 - z0 + 0.2, x1, 0, (z0 + z1) / 2, 0, 0x857f75);
  bMain.box(m.stoneDark, 3.85, 0.14, 0.24, x0 + 1.92, 0, z1, 0, 0x857f75);
  bMain.box(m.stoneDark, 3.85, 0.14, 0.24, x1 - 1.92, 0, z1, 0, 0x857f75);

  const addFenceSpan = (ax: number, az: number, bx: number, bz: number): void => {
    const len = Math.hypot(bx - ax, bz - az);
    const mx = (ax + bx) / 2, mz = (az + bz) / 2;
    const ry = Math.atan2(-(bz - az), bx - ax);
    // 2 thanh ngang tre vàng ấm
    for (const hy of [0.36, 0.78]) {
      bMain.add(
        new THREE.CylinderGeometry(0.036, 0.036, len, 7),
        m.wood,
        xf(mx, hy, mz, ry, 1, 1, 1, 0, Math.PI / 2),
        0xc49a56,
      );
    }
    // Trụ gỗ cách mỗi ~1.8m
    const posts = Math.max(2, Math.round(len / 1.8));
    for (let i = 0; i <= posts; i++) {
      const u = i / posts;
      const px = ax + (bx - ax) * u, pz = az + (bz - az) * u;
      bMain.cyl(m.darkWood, 0.065, 0.075, 1.04, 8, px, 0.05, pz, 0x6a4428);
      bMain.sphere(m.wood, 0.072, px, 1.1, pz, 1, 0.75, 1, 0xb88b4a, 8);
    }
    // Nan tre đan dọc dày vừa phải để gà không chui lọt nhưng người chơi nhìn xuyên vào rõ
    const slats = Math.floor(len / 0.24);
    for (let i = 1; i < slats; i++) {
      const u = i / slats;
      const sx = ax + (bx - ax) * u, sz = az + (bz - az) * u;
      bMain.box(m.paint, 0.035, 0.88, 0.02, sx, 0.08, sz, ry, i % 2 ? 0xd0ad66 : 0xc29c54);
    }
  };

  addFenceSpan(x0, z0, x1, z0);               // rào bắc
  addFenceSpan(x0, z0, x0, z1);               // rào tây
  addFenceSpan(x1, z0, x1, z1);               // rào đông
  addFenceSpan(x0, z1, CX - 1.18, z1);        // rào nam trái cổng
  addFenceSpan(CX + 1.18, z1, x1, z1);        // rào nam phải cổng

  // Cổng vòm gỗ chuồng gà (x = ±1.18, z = z1) + mái ngói nhỏ + biển hiệu + 2 cánh cổng tre thấp
  for (const gx of [CX - 1.18, CX + 1.18]) {
    bMain.cyl(m.stone, 0.18, 0.22, 0.18, 10, gx, 0, z1, 0x9e988c);
    bMain.cyl(m.lacquer, 0.1, 0.11, 2.55, 10, gx, 0.16, z1, 0xa83226);
  }
  bMain.box(m.darkWood, 2.85, 0.14, 0.18, CX, 2.48, z1, 0, 0x5c3822);
  buildRoof(bMain, m, CX, 2.62, z1, {
    W: 1.72, D: 0.75, rise: 0.56, curve: 1.45, curl: 0.34, curlSize: 1.1, ridge: true, finial: false, thickness: 0.16,
  });
  hangingLantern(bMain, m, halos, CX - 0.95, 2.52, z1 + 0.32, 0.42, 0.24);
  hangingLantern(bMain, m, halos, CX + 0.95, 2.52, z1 + 0.32, 0.42, 0.24);

  // Biển gỗ "VIÊN CẦM TỊNH VIÊN — CHUỒNG GÀ SAU CHÙA"
  const pTex = plaqueTexture('VIÊN CẦM TỊNH VIÊN', { w: 768, h: 220, sub: 'CHUỒNG GÀ SAU CHÙA' });
  ownTex.push(pTex);
  const pMat = new THREE.MeshStandardMaterial({ map: pTex, roughness: 0.48, metalness: 0.08 });
  ownMat.push(pMat);
  const pGeo = new THREE.PlaneGeometry(1.78, 0.5);
  ownGeo.push(pGeo);
  const plaque = new THREE.Mesh(pGeo, pMat);
  plaque.position.set(CX, 2.24, z1 + 0.11);
  group.add(plaque);
  bMain.box(m.darkWood, 1.86, 0.56, 0.08, CX, 1.96, z1 + 0.06, 0, 0x4d2c1a);

  // Hai cánh cổng nan tre thấp khép hờ duyên dáng ở lối vào
  for (const side of [-1, 1] as const) {
    const pivotX = CX + side * 1.1;
    const leafW = 0.98;
    const yaw = side * 0.16;
    const lx = pivotX - side * Math.cos(yaw) * (leafW * 0.5);
    const lz = z1 + Math.sin(Math.abs(yaw)) * (leafW * 0.5);
    bMain.box(m.wood, leafW, 0.06, 0.05, lx, 0.24, lz, yaw, 0xb88b48);
    bMain.box(m.wood, leafW, 0.06, 0.05, lx, 0.72, lz, yaw, 0xb88b48);
    for (let k = -3; k <= 3; k++) {
      const off = k * 0.13;
      bMain.box(
        m.paint,
        0.04,
        0.74,
        0.025,
        lx + Math.cos(yaw) * off,
        0.14,
        lz - Math.sin(yaw) * off,
        yaw,
        0xd4b26a,
      );
    }
  }

  // ═══════════════════ 2. NHÀ GÀ SÀN GỖ TRÊN CỘT + CẦU THANG GÀ + Ổ RƠM TRỨNG ═══════════════════
  const hx = CX - 1.85, hz = CZ - 1.15; // (-1.85, -46.75)
  const floorY = 0.56;
  // 4 cột kê sàn chống ẩm truyền thống
  for (const [dx, dz] of [[-1.65, -1.0], [1.65, -1.0], [-1.65, 1.0], [1.65, 1.0]] as const) {
    bMain.cyl(m.stone, 0.16, 0.19, 0.12, 8, hx + dx, 0, hz + dz, 0x999286);
    bMain.cyl(m.darkWood, 0.09, 0.1, floorY, 8, hx + dx, 0.08, hz + dz, 0x5c3a22);
  }
  // Sàn gỗ & thân nhà gà vách ván ấm + phên tre thông thoáng
  bMain.box(m.darkWood, 3.7, 0.12, 2.35, hx, floorY, hz, 0, 0x6e472b);
  bMain.box(m.wood, 3.45, 1.32, 2.1, hx, floorY + 0.12, hz, 0, 0xb58548);
  // Ô cửa vòm tối bên trong để gà ra vào + bậu cửa gỗ
  bMain.box(m.darkWood, 0.62, 0.72, 0.08, hx + 0.65, floorY + 0.14, hz + 1.03, 0, 0x26150c);
  bMain.box(m.wood, 0.86, 0.07, 0.34, hx + 0.65, floorY + 0.08, hz + 1.16, 0, 0xc89a56);
  // Ô cửa sổ nan tre hai bên
  for (const wx of [hx - 0.85, hx - 0.15]) {
    bMain.box(m.darkWood, 0.48, 0.42, 0.08, wx, floorY + 0.66, hz + 1.03, 0, 0x3b2214);
    for (let s = -1; s <= 1; s++) {
      bMain.box(m.paint, 0.03, 0.4, 0.09, wx + s * 0.12, floorY + 0.67, hz + 1.04, 0, 0xd8b66c);
    }
  }
  // Mái nhà gà lợp ngói nâu ấm cong nhẹ
  buildRoof(bMain, m, hx, floorY + 1.42, hz, {
    W: 2.25, D: 1.55, rise: 0.86, curve: 1.4, curl: 0.38, curlSize: 1.4, ridge: true, finial: false, thickness: 0.2,
  });

  // Cầu thang gỗ có nấc ngang từ cửa chuồng xuống sân (hx + 0.65, hz + 1.24 -> z + 1.45)
  const rampStart = new THREE.Vector3(hx + 0.65, floorY + 0.08, hz + 1.22);
  const rampEnd = new THREE.Vector3(hx + 1.05, 0.04, hz + 2.65);
  const rampMid = rampStart.clone().add(rampEnd).multiplyScalar(0.5);
  const rampLen = rampStart.distanceTo(rampEnd);
  const rampYaw = Math.atan2(rampEnd.x - rampStart.x, rampEnd.z - rampStart.z);
  const rampPitch = Math.asin((rampStart.y - rampEnd.y) / rampLen);
  bMain.add(
    new THREE.BoxGeometry(0.56, 0.055, rampLen),
    m.wood,
    xf(rampMid.x, rampMid.y, rampMid.z, rampYaw, 1, 1, 1, rampPitch, 0),
    0xc59652,
  );
  for (let i = 1; i <= 6; i++) {
    const u = i / 7;
    const rx = rampStart.x + (rampEnd.x - rampStart.x) * u;
    const ry = rampStart.y + (rampEnd.y - rampStart.y) * u + 0.032;
    const rz = rampStart.z + (rampEnd.z - rampStart.z) * u;
    bMain.box(m.darkWood, 0.54, 0.03, 0.045, rx, ry, rz, rampYaw, 0x6b4326);
  }

  // Ổ rơm đẻ trứng dưới mái hiên phụ bên đông nhà gà + trứng gà trắng ngà
  bMain.box(m.wood, 1.55, 0.14, 0.92, CX + 0.95, 0.04, CZ - 1.55, 0, 0x8b5e36);
  for (let n = 0; n < 2; n++) {
    const nx = CX + 0.58 + n * 0.72, nz = CZ - 1.55;
    bMain.add(new THREE.TorusGeometry(0.26, 0.085, 7, 16), m.paint, xf(nx, 0.22, nz, 0, 1, 0.75, 1, Math.PI / 2), 0xdcb456);
    bMain.cyl(m.paint, 0.24, 0.26, 0.06, 12, nx, 0.16, nz, 0xc9a044);
    for (let e = 0; e < 3; e++) {
      const ea = e * 2.1 + n;
      bMain.sphere(m.paint, 0.052, nx + Math.cos(ea) * 0.08, 0.23, nz + Math.sin(ea) * 0.07, 1, 1.3, 1, 0xfaf0dc, 10);
    }
  }

  // ═══════════════════ 3. MÁNG THÓC, MÁNG NƯỚC SÀNH, CÂY RƠM VÀNG & BỘI TRE ═══════════════════
  const troughX = CX + 0.35, troughZ = z1 - 1.45; // (0.35, -43.35) ngay gần cổng để người chơi đứng cho ăn thấy rõ
  bMain.box(m.darkWood, 1.35, 0.16, 0.44, troughX, 0.04, troughZ, 0.08, 0x6e4628);
  bMain.box(m.wood, 1.22, 0.08, 0.32, troughX, 0.14, troughZ, 0.08, 0x4b2e19);

  // Lớp thóc vàng động trong máng (đầy lên khi người chơi bấm Cho gà ăn)
  const grainGeo = new THREE.BoxGeometry(1.16, 0.09, 0.28);
  ownGeo.push(grainGeo);
  const grainMat = new THREE.MeshStandardMaterial({ color: 0xf0c246, roughness: 0.72, emissive: 0x5c3f06, emissiveIntensity: 0.18 });
  ownMat.push(grainMat);
  const grainMound = new THREE.Mesh(grainGeo, grainMat);
  grainMound.position.set(troughX, 0.19, troughZ);
  grainMound.rotation.y = 0.08;
  grainMound.scale.set(1, 0.45, 1);
  group.add(grainMound);

  // Hạt thóc vương nhẹ trên nền đất quanh máng
  for (let i = 0; i < 22; i++) {
    const ga = r() * TAU, gd = 0.25 + r() * 0.85;
    bDeco.sphere(m.paint, 0.022, troughX + Math.cos(ga) * gd, 0.015, troughZ + Math.sin(ga) * gd, 1.3, 0.55, 0.9, 0xebbd42, 6);
  }

  // Máng nước sành đất nung bên trái
  const wx = CX - 2.1, wz = z1 - 1.55;
  bMain.cyl(m.paint, 0.36, 0.28, 0.22, 16, wx, 0.02, wz, 0x9c5234);
  bMain.add(new THREE.TorusGeometry(0.35, 0.035, 6, 18), m.paint, xf(wx, 0.23, wz, 0, 1, 1, 1, Math.PI / 2), 0xad5e3e);
  bDeco.cyl(m.jade, 0.32, 0.32, 0.02, 16, wx, 0.19, wz, 0x7fd4e6);

  // Cây rơm vàng làng quê Việt Nam ở góc đông-bắc chuồng (x = 3.45, z = -47.2)
  const sx = CX + 3.45, sz = CZ - 1.6;
  bMain.cyl(m.darkWood, 0.07, 0.085, 2.55, 8, sx, 0, sz, 0x5c3b22);
  bMain.add(jitter(new THREE.ConeGeometry(1.12, 1.85, 14), 0.08, 77), m.paint, xf(sx, 1.02, sz), 0xdab04c, true);
  bMain.add(jitter(new THREE.SphereGeometry(1.02, 12, 9), 0.06, 78), m.paint, xf(sx, 0.55, sz, 0, 1.05, 0.62, 1.05), 0xcf9f3e, true);

  // Chiếc bội tre úp gà truyền thống đặt cạnh cổng ngoài chuồng
  const bx = CX + 2.65, bz = z1 + 0.65;
  for (let ring = 0; ring < 4; ring++) {
    const rr = 0.44 - ring * 0.08, yy = 0.08 + ring * 0.13;
    bMain.add(new THREE.TorusGeometry(rr, 0.014, 5, 16), m.paint, xf(bx, yy, bz, 0, 1, 1, 1, Math.PI / 2), 0xcba65c);
  }

  // ═══════════════════ 4. CẢNH QUAN VƯỜN SAU CHÙA (ĐÈN ĐÁ, KHÓM TRÚC, HOA, BÓNG CÂY) ═══════════════════
  stoneLantern(bMain, m, halos, -11.8, 0, -39.0, 0.88);
  stoneLantern(bMain, m, halos, 11.8, 0, -39.0, 0.88);
  stoneLantern(bMain, m, halos, CX - 5.7, 0, z1 + 0.55, 0.86);
  stoneLantern(bMain, m, halos, CX + 5.7, 0, z1 + 0.55, 0.86);

  flowerBed(bDeco, m, CX - 7.4, -40.8, 2.4, 1.2, 61);
  flowerBed(bDeco, m, CX + 7.4, -40.8, 2.4, 1.2, 62);

  bambooClump(bMain, m, -8.2, -48.6, 9, 6.0, 71);
  bambooClump(bMain, m, 8.2, -48.6, 9, 6.0, 72);
  bambooClump(bMain, m, -16.8, -46.5, 8, 5.8, 73);
  bambooClump(bMain, m, 16.8, -46.5, 8, 5.8, 74);

  treeRound(bMain, m, -12.6, -46.8, 1.3, 81, 0x488c3e);
  treeRound(bMain, m, 12.6, -46.8, 1.3, 82, 0x4d9142);
  treeRound(bMain, m, -25.0, -45.5, 1.38, 83, 0x42843a);
  treeRound(bMain, m, 25.0, -45.5, 1.38, 84, 0x46883e);

  for (let i = 0; i < 12; i++) {
    const px = -34 + i * 6.2 + (i >= 5 && i <= 6 ? (i === 5 ? -3 : 3) : 0);
    bush(bDeco, m, px, -50.6 + (i % 2) * 0.6, 1.0, i % 2 ? 0x4f8d40 : 0x437e37);
  }

  const coopLight = new THREE.PointLight(0xffb45c, 0, 16, 1.6);
  coopLight.position.set(CX, 2.75, z1 - 0.8);
  group.add(coopLight);

  // ═══════════════════ 5. ĐÀN GÀ TRONG CHUỒNG & GÀ SỔNG CHUỒNG THẤT LẠC ═══════════════════
  const penChickens: PenChicken[] = [];
  const inPenSafe = (px: number, pz: number): boolean => {
    if (px < x0 + 0.55 || px > x1 - 0.55 || pz < z0 + 0.55 || pz > z1 - 0.55) return false;
    // tránh đè lên thân nhà gà & cây rơm & máng nước
    if (px > hx - 1.95 && px < hx + 1.95 && pz > hz - 1.35 && pz < hz + 1.25) return false;
    if (Math.hypot(px - sx, pz - sz) < 1.25) return false;
    if (Math.hypot(px - wx, pz - wz) < 0.55) return false;
    return true;
  };

  const randomPenSpot = (): { x: number; z: number } => {
    for (let k = 0; k < 24; k++) {
      const px = x0 + 0.7 + Math.random() * (x1 - x0 - 1.4);
      const pz = z0 + 0.7 + Math.random() * (z1 - z0 - 1.35);
      if (inPenSafe(px, pz)) return { x: px, z: pz };
    }
    return { x: CX + 0.8, z: z1 - 1.8 };
  };

  const spawnPenChicken = (plumage: number, extra = false, atFront = false): void => {
    const rig = createChickenMesh(plumage, false);
    const pt = atFront ? { x: CX + (Math.random() - 0.5) * 1.4, z: z1 - 0.95 } : randomPenSpot();
    const tgt = randomPenSpot();
    rig.root.position.set(pt.x, 0, pt.z);
    rig.root.rotation.y = Math.random() * TAU;
    group.add(rig.root);
    penChickens.push({
      rig,
      x: pt.x,
      z: pt.z,
      tx: tgt.x,
      tz: tgt.z,
      ry: rig.root.rotation.y,
      speed: 0.72 + Math.random() * 0.28,
      wait: Math.random() * 1.8,
      peckTimer: 0,
      hopTimer: atFront ? 0.01 : 0,
      phase: Math.random() * TAU,
      extra,
    });
  };

  for (let i = 0; i < 5; i++) spawnPenChicken(i % CHICKEN_PALETTES.length, false, false);

  const lostChickens: LostChicken[] = [];
  let lostSeq = 0;
  let feedTimer = 0;

  const cGold = new THREE.Color(1.0, 0.84, 0.34);
  const cAmber = new THREE.Color(1.0, 0.56, 0.18);
  const cFeather = new THREE.Color(1.0, 0.95, 0.84);

  const pickZoneSpot = (zoneIdx: number, isFree: (x: number, z: number) => boolean): { x: number; z: number } | null => {
    const zf = LOST_ZONES[zoneIdx];
    for (let k = 0; k < 28; k++) {
      const a = Math.random() * TAU;
      const d = 0.5 + Math.random() * zf.r;
      const px = zf.cx + Math.cos(a) * d;
      const pz = zf.cz + Math.sin(a) * d;
      if (isFree(px, pz)) return { x: px, z: pz };
    }
    return isFree(zf.cx, zf.cz) ? { x: zf.cx, z: zf.cz } : null;
  };

  return {
    group,
    troughPos: new THREE.Vector3(troughX, 0.22, troughZ),
    gatePos: new THREE.Vector3(CX, 0, z1),

    residentCount(): number {
      return Math.max(0, penChickens.length - lostChickens.length);
    },

    triggerFeed(): void {
      feedTimer = 7.5;
      grainMound.scale.y = 1.15;
      // Gọi cả đàn gà trong chuồng chạy ùa tới quanh máng thóc mổ ríu rít
      penChickens.forEach((c, idx) => {
        const a = (idx / Math.max(1, penChickens.length)) * Math.PI + 0.15;
        const tx = clamp(troughX + Math.cos(a) * 0.82, x0 + 0.7, x1 - 0.7);
        const tz = clamp(troughZ - 0.35 - Math.sin(a) * 0.65, z0 + 0.7, z1 - 0.65);
        c.tx = tx;
        c.tz = tz;
        c.wait = 0;
        c.hopTimer = 0.01;
      });
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * TAU;
        const sp = 0.35 + Math.random() * 0.95;
        sparks.spawn(
          troughX + (Math.random() - 0.5) * 0.7,
          0.55,
          troughZ + (Math.random() - 0.5) * 0.35,
          Math.cos(a) * sp,
          0.9 + Math.random() * 1.1,
          Math.sin(a) * sp,
          1.1 + Math.random() * 0.5,
          0.11,
          0.025,
          cGold,
          cAmber,
          0.95,
          1.8,
          0.6,
          1,
          0.2,
        );
      }
    },

    spawnLostChicken(isFree, preferredZone): LostChickenInfo | null {
      if (lostChickens.length >= 2) return null;
      const usedZones = new Set(lostChickens.map((c) => c.zoneIdx));
      const candidates = LOST_ZONES.map((_, i) => i).filter((i) => !usedZones.has(i));
      const startIdx = preferredZone !== undefined && candidates.includes(preferredZone)
        ? preferredZone
        : candidates[Math.floor(Math.random() * candidates.length)] ?? 0;

      const pt = pickZoneSpot(startIdx, isFree);
      if (!pt) return null;
      const tgt = pickZoneSpot(startIdx, isFree) ?? pt;
      const plumage = (lostSeq + Math.floor(Math.random() * CHICKEN_PALETTES.length)) % CHICKEN_PALETTES.length;
      const rig = createChickenMesh(plumage, true);
      rig.root.position.set(pt.x, 0, pt.z);
      const ry = Math.random() * TAU;
      rig.root.rotation.y = ry;
      group.add(rig.root);

      // Ẩn bớt 1 chú gà trong chuồng để thể hiện gà vừa sổng chuồng ra ngoài
      const visibleInPen = penChickens.filter((p) => p.rig.root.visible);
      if (visibleInPen.length > 2) {
        visibleInPen[visibleInPen.length - 1].rig.root.visible = false;
      }

      const entry: LostChicken = {
        id: `lost-chicken-${++lostSeq}`,
        plumage,
        zoneIdx: startIdx,
        hint: LOST_ZONES[startIdx].hint,
        rig,
        x: pt.x,
        z: pt.z,
        tx: tgt.x,
        tz: tgt.z,
        ry,
        wait: 0.4,
        peckTimer: 0,
        hopTimer: 0.01,
        phase: Math.random() * TAU,
      };
      lostChickens.push(entry);
      return { id: entry.id, plumage: entry.plumage, x: entry.x, z: entry.z, ry: entry.ry, hint: entry.hint };
    },

    getLostChickens(): LostChickenInfo[] {
      return lostChickens.map((c) => ({ id: c.id, plumage: c.plumage, x: c.x, z: c.z, ry: c.ry, hint: c.hint }));
    },

    nearestLostChicken(x: number, z: number, maxDist = Infinity): LostChickenInfo | null {
      let best: LostChicken | null = null;
      let bestD2 = maxDist * maxDist;
      for (const c of lostChickens) {
        const d2 = (c.x - x) * (c.x - x) + (c.z - z) * (c.z - z);
        if (d2 <= bestD2) {
          bestD2 = d2;
          best = c;
        }
      }
      return best ? { id: best.id, plumage: best.plumage, x: best.x, z: best.z, ry: best.ry, hint: best.hint } : null;
    },

    pickLostChicken(ray: THREE.Ray, radius = 1.15): LostChickenInfo | null {
      let best: LostChicken | null = null;
      let bestT = Infinity;
      for (const c of lostChickens) {
        const ox = ray.origin.x - c.x;
        const oz = ray.origin.z - c.z;
        const dx = ray.direction.x;
        const dz = ray.direction.z;
        const a = dx * dx + dz * dz;
        const t = a > 1e-6 ? -(ox * dx + oz * dz) / a : 0;
        if (t < 0 || t >= bestT) continue;
        const hx = ox + dx * t;
        const hz = oz + dz * t;
        if (hx * hx + hz * hz > radius * radius) continue;
        const hy = ray.origin.y + ray.direction.y * t;
        const cy = clamp(hy, 0, 1.05);
        const dy = hy - cy;
        if (hx * hx + hz * hz + dy * dy <= radius * radius) {
          bestT = t;
          best = c;
        }
      }
      return best ? { id: best.id, plumage: best.plumage, x: best.x, z: best.z, ry: best.ry, hint: best.hint } : null;
    },

    catchLostChicken(id: string): { plumage: number; x: number; z: number; hint: string } | null {
      const idx = lostChickens.findIndex((c) => c.id === id);
      if (idx < 0) return null;
      const [c] = lostChickens.splice(idx, 1);
      for (let i = 0; i < 20; i++) {
        const a = Math.random() * TAU;
        sparks.spawn(
          c.x,
          0.35,
          c.z,
          Math.cos(a) * (0.5 + Math.random() * 0.7),
          0.9 + Math.random() * 1.1,
          Math.sin(a) * (0.5 + Math.random() * 0.7),
          0.9 + Math.random() * 0.4,
          0.13,
          0.03,
          cFeather,
          cGold,
          0.9,
          0.8,
          0.9,
          1,
          0.25,
        );
      }
      group.remove(c.rig.root);
      c.rig.dispose();
      return { plumage: c.plumage, x: c.x, z: c.z, hint: c.hint };
    },

    returnChickenToCoop(plumage = 0): void {
      const hidden = penChickens.find((p) => !p.rig.root.visible);
      if (hidden) {
        hidden.rig.root.visible = true;
        hidden.x = CX + (Math.random() - 0.5) * 1.1;
        hidden.z = z1 - 0.9;
        const tgt = randomPenSpot();
        hidden.tx = tgt.x;
        hidden.tz = tgt.z;
        hidden.wait = 0;
        hidden.hopTimer = 0.01;
        hidden.rig.root.position.set(hidden.x, 0, hidden.z);
      } else if (penChickens.length < 8) {
        spawnPenChicken(plumage, true, true);
      }
      // Pháo sáng công đức ấm áp ngay cửa chuồng gà
      for (let i = 0; i < 34; i++) {
        const a = (i / 34) * TAU;
        const sp = 0.55 + Math.random() * 1.1;
        sparks.spawn(
          CX + Math.cos(a) * 0.35,
          0.55,
          z1 - 0.65 + Math.sin(a) * 0.35,
          Math.cos(a) * sp,
          1.1 + Math.random() * 1.4,
          Math.sin(a) * sp,
          1.35 + Math.random() * 0.6,
          0.15,
          0.03,
          cGold,
          cAmber,
          0.95,
          0.25,
          0.8,
          1,
          0.3,
        );
      }
    },

    update(dt, t, night, lightsOn, playerPos, isFree): void {
      coopLight.intensity = lightsOn ? night * 12 : 0;
      coopLight.visible = coopLight.intensity > 0.05;

      if (feedTimer > 0) {
        feedTimer = Math.max(0, feedTimer - dt);
        grainMound.scale.y = 0.45 + 0.7 * (feedTimer / 7.5);
      }

      // Cập nhật đàn gà trong chuồng
      for (const c of penChickens) {
        if (!c.rig.root.visible) continue;
        if (c.hopTimer > 0) {
          c.hopTimer += dt * 2.4;
          if (c.hopTimer >= 1) c.hopTimer = 0;
        }
        const dx = c.tx - c.x, dz = c.tz - c.z;
        const dist = Math.hypot(dx, dz);
        let moving = false;
        const spd = feedTimer > 0 ? c.speed * 1.45 : c.speed;

        if (dist > 0.08 && c.wait <= 0) {
          moving = true;
          const step = Math.min(dist, spd * dt);
          c.x += (dx / dist) * step;
          c.z += (dz / dist) * step;
          const wantRy = Math.atan2(-dx, -dz);
          const diff = Math.atan2(Math.sin(wantRy - c.ry), Math.cos(wantRy - c.ry));
          c.ry += diff * Math.min(1, dt * 10);
        } else {
          if (c.wait <= 0) {
            c.wait = feedTimer > 0 ? 1.8 + Math.random() * 1.6 : 1.2 + Math.random() * 2.6;
            c.peckTimer = feedTimer > 0 ? c.wait : Math.random() < 0.72 ? 0.9 + Math.random() * 1.5 : 0;
          } else {
            c.wait -= dt;
            if (c.wait <= 0) {
              const next = feedTimer > 0
                ? {
                    x: clamp(troughX + (Math.random() - 0.5) * 1.6, x0 + 0.7, x1 - 0.7),
                    z: clamp(troughZ - 0.25 - Math.random() * 0.9, z0 + 0.7, z1 - 0.65),
                  }
                : randomPenSpot();
              c.tx = next.x;
              c.tz = next.z;
              if (Math.random() < 0.22) c.hopTimer = 0.01;
            }
          }
        }
        if (c.peckTimer > 0) c.peckTimer = Math.max(0, c.peckTimer - dt);

        c.rig.root.position.set(c.x, 0, c.z);
        c.rig.root.rotation.y = c.ry;
        animateChickenRig(c.rig, t, c.phase, moving, spd / 0.85, !moving && c.peckTimer > 0, c.hopTimer);
      }

      // Cập nhật gà sổng chuồng thất lạc ngoài sân chùa
      for (const c of lostChickens) {
        if (c.hopTimer > 0) {
          c.hopTimer += dt * 2.6;
          if (c.hopTimer >= 1) c.hopTimer = 0;
        }

        // Khi người chơi tới gần (<4.5m), chú gà giật mình vỗ cánh lon ton nhẹ nhưng chậm hơn người chơi rất nhiều để dễ bắt
        let startled = false;
        if (playerPos) {
          const pdx = c.x - playerPos.x, pdz = c.z - playerPos.z;
          const pDist = Math.hypot(pdx, pdz);
          if (pDist < 4.2 && pDist > 0.25 && isFree) {
            startled = true;
            if (c.wait > 0.15) {
              c.wait = 0;
              c.peckTimer = 0;
              c.hopTimer = c.hopTimer || 0.01;
              const nx = c.x + (pdx / pDist) * 1.8 + (Math.random() - 0.5) * 1.2;
              const nz = c.z + (pdz / pDist) * 1.8 + (Math.random() - 0.5) * 1.2;
              if (isFree(nx, nz)) {
                c.tx = nx;
                c.tz = nz;
              }
            }
          }
        }

        const dx = c.tx - c.x, dz = c.tz - c.z;
        const dist = Math.hypot(dx, dz);
        let moving = false;
        const spd = startled ? 1.18 : 0.78;

        if (dist > 0.08 && c.wait <= 0) {
          const step = Math.min(dist, spd * dt);
          const nx = c.x + (dx / dist) * step;
          const nz = c.z + (dz / dist) * step;
          if (!isFree || isFree(nx, nz)) {
            moving = true;
            c.x = nx;
            c.z = nz;
            const wantRy = Math.atan2(-dx, -dz);
            const diff = Math.atan2(Math.sin(wantRy - c.ry), Math.cos(wantRy - c.ry));
            c.ry += diff * Math.min(1, dt * 10);
          } else {
            c.wait = 0.2;
            c.tx = c.x;
            c.tz = c.z;
          }
        } else {
          if (c.wait <= 0) {
            c.wait = 1.1 + Math.random() * 2.2;
            c.peckTimer = Math.random() < 0.7 ? 0.8 + Math.random() * 1.2 : 0;
          } else {
            c.wait -= dt;
            if (c.wait <= 0 && isFree) {
              const next = pickZoneSpot(c.zoneIdx, isFree);
              if (next) {
                c.tx = next.x;
                c.tz = next.z;
              }
              if (Math.random() < 0.28) c.hopTimer = 0.01;
            }
          }
        }
        if (c.peckTimer > 0) c.peckTimer = Math.max(0, c.peckTimer - dt);

        c.rig.root.position.set(c.x, 0, c.z);
        c.rig.root.rotation.y = c.ry;
        animateChickenRig(c.rig, t, c.phase, moving, spd / 0.85, !moving && c.peckTimer > 0, c.hopTimer);
      }
    },

    dispose(): void {
      for (const c of penChickens) c.rig.dispose();
      for (const c of lostChickens) c.rig.dispose();
      for (const g of ownGeo) g.dispose();
      for (const mt of ownMat) mt.dispose();
      for (const tx of ownTex) tx.dispose();
    },
  };
}
