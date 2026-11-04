/**
 * Tháp chuông (Gác chuông cổ lâu 2 tầng mái cong tại khối `bell-tower`: x=13.5..17, z=-10.5..-5.5):
 * - Đại Hồng Chung bằng đồng treo trên giá gỗ sơn son, có chày kình treo dây.
 * - Khi gọi `ring()` (`playEffect('bell')`): chày kình lao vào điểm chuông, chuông đồng đung đưa ngân vang,
 *   toả vòng sóng ánh sáng vàng kim lan rộng khắp sân chùa.
 */
import * as THREE from 'three';
import { BLOCKS } from '@/world/layout';
import { Batch, floorGeo, lathe, TAU, xf } from './core';
import { hangingLantern, stoneLantern } from './courtyard';
import type { Mats } from './materials';
import type { HaloSpec, ParticleField } from './particles';
import { buildRoof } from './roof';
import { plaqueTexture } from './textures';

const BELL_BLOCK = BLOCKS.find((b) => b.name === 'bell-tower')!;
export const BELL_CENTER = {
  x: (BELL_BLOCK.x0 + BELL_BLOCK.x1) / 2,
  z: (BELL_BLOCK.z0 + BELL_BLOCK.z1) / 2,
};

export interface BellPart {
  group: THREE.Group;
  center: THREE.Vector3;
  ring(): void;
  update(dt: number, t: number, night: number, lightsOn: boolean): void;
  dispose(): void;
}

interface WaveRing {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  age: number;
  maxAge: number;
}

export function buildBellTower(
  m: Mats,
  glowTex: THREE.Texture,
  halos: HaloSpec[],
  sparks: ParticleField,
  b: Batch,
): BellPart {
  const group = new THREE.Group();
  group.name = 'bell-tower';
  const ownGeo: THREE.BufferGeometry[] = [];
  const ownMat: THREE.Material[] = [];
  const ownTex: THREE.Texture[] = [];

  const cx = BELL_CENTER.x, cz = BELL_CENTER.z;
  const PY = 0.68;

  // ── Bệ đá chạm khắc + bậc tam cấp hướng tây (về sân chính) ──
  b.box(m.stoneDark, 3.46, 0.14, 4.86, cx, 0, cz, 0, 0x7c776e);
  b.box(m.stone, 3.3, PY - 0.14, 4.7, cx, 0.14, cz, 0, 0xaba59a);
  b.box(m.stoneDark, 3.42, 0.08, 4.82, cx, PY - 0.04, cz, 0, 0x8a857b);
  b.add(floorGeo(3.26, 4.66, 2.4), m.paving, xf(cx, PY + 0.005, cz), 0xdad3c6);

  // bậc thềm phía tây (x giảm về phía sân chính, nằm gọn sát biên x0=13.5)
  for (let i = 0; i < 3; i++) {
    const h = (PY / 3) * (i + 1);
    const sx = cx - 1.65 - (2 - i) * 0.22;
    b.box(m.stone, 0.26, h, 2.1, sx, 0, cz, 0, 0xb6b0a4);
  }
  // lan can đá bao 3 mặt đông, bắc, nam
  const railH = 0.52;
  for (const sz of [-1, 1]) {
    b.box(m.stone, 3.1, 0.1, 0.14, cx, PY + railH, cz + sz * 2.22, 0, 0xbab4a8);
    b.box(m.stone, 3.0, 0.26, 0.08, cx, PY + 0.14, cz + sz * 2.22, 0, 0x9f998e);
    for (const px of [-1.52, 0, 1.52]) {
      b.box(m.stone, 0.2, railH + 0.18, 0.2, cx + px, PY, cz + sz * 2.22, 0, 0xc2bcb0);
      b.sphere(m.stone, 0.11, cx + px, PY + railH + 0.24, cz + sz * 2.22, 1, 1.2, 1, 0xcbc5b8);
    }
  }
  b.box(m.stone, 0.14, 0.1, 4.44, cx + 1.52, PY + railH, cz, 0, 0xbab4a8);
  b.box(m.stone, 0.08, 0.26, 4.3, cx + 1.52, PY + 0.14, cz, 0, 0x9f998e);

  // ── 4 cột trụ sơn son thếp vàng đỡ lầu chuông ──
  const colH = 3.75;
  const colOff = 1.22;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const px = cx + sx * colOff, pz = cz + sz * colOff;
    b.cyl(m.stone, 0.3, 0.36, 0.24, 12, px, PY, pz, 0xb8b2a6);
    b.cyl(m.gold, 0.25, 0.25, 0.05, 12, px, PY + 0.24, pz);
    b.cyl(m.lacquer, 0.21, 0.24, colH, 14, px, PY + 0.29, pz, 0xffffff);
    b.cyl(m.gold, 0.24, 0.24, 0.06, 12, px, PY + 0.29 + colH - 0.1, pz);
    b.box(m.lacquer, 0.56, 0.18, 0.56, px, PY + 0.29 + colH - 0.04, pz, 0, 0xa22820);
    b.box(m.gold, 0.36, 0.08, 0.36, px, PY + 0.29 + colH + 0.14, pz);
  }
  // hệ xà ngang + đấu củng + giá xà gỗ treo chuông
  const beamY = PY + 0.29 + colH;
  b.box(m.lacquer, 2.86, 0.32, 0.3, cx, beamY - 0.22, cz - colOff, 0, 0xa82a20);
  b.box(m.lacquer, 2.86, 0.32, 0.3, cx, beamY - 0.22, cz + colOff, 0, 0xa82a20);
  b.box(m.lacquer, 0.3, 0.32, 2.86, cx - colOff, beamY - 0.22, cz, 0, 0xa82a20);
  b.box(m.lacquer, 0.3, 0.32, 2.86, cx + colOff, beamY - 0.22, cz, 0, 0xa82a20);
  // xà chính treo chuông ở giữa
  b.box(m.darkWood, 0.28, 0.34, 2.7, cx, beamY - 0.18, cz, 0, 0x5c3420);
  b.box(m.gold, 0.32, 0.06, 0.5, cx, beamY - 0.2, cz);

  // cổ diêm lầu trên + mái ngói 2 tầng cong vút (8 mái đầu đao)
  const upY = beamY + 0.72;
  b.box(m.lacquer, 2.15, 0.92, 2.15, cx, upY - 0.3, cz, 0, 0x98261d);
  b.box(m.gold, 2.24, 0.06, 2.24, cx, upY - 0.3, cz);
  b.box(m.gold, 2.24, 0.06, 2.24, cx, upY + 0.58, cz);
  for (const side of [-1, 1]) {
    b.box(m.windowGlow, 0.9, 0.52, 0.08, cx, upY - 0.1, cz + side * 1.09);
    b.box(m.windowGlow, 0.08, 0.52, 0.9, cx + side * 1.09, upY - 0.1, cz);
  }
  buildRoof(b, m, cx, beamY + 0.02, cz, { W: 2.65, D: 2.6, rise: 1.55, bmax: 0.48, curve: 1.45, curl: 0.85, curlSize: 1.7, rafters: true, ridge: false });
  buildRoof(b, m, cx, upY + 0.58, cz, { W: 2.18, D: 2.12, rise: 1.95, bmax: 1, curve: 1.4, curl: 0.95, curlSize: 1.5, ridge: true, finial: true, rafters: true });

  // biển nhỏ "CHUÔNG TỪ BI" hướng về sân tây (-x), đặt gọn trên xà dưới hàng rui mái
  const bellPlaque = plaqueTexture('CHUÔNG TỪ BI', { w: 512, h: 160 });
  ownTex.push(bellPlaque);
  const bpMat = new THREE.MeshStandardMaterial({ map: bellPlaque, roughness: 0.45, metalness: 0.15, emissive: 0xffbf68, emissiveMap: bellPlaque, emissiveIntensity: 0.16 });
  ownMat.push(bpMat);
  m.glow.push({ mat: bpMat, day: 0.12, night: 0.7 });
  const bpGeo = new THREE.PlaneGeometry(1.56, 0.46);
  ownGeo.push(bpGeo);
  const bpMesh = new THREE.Mesh(bpGeo, bpMat);
  bpMesh.position.set(cx - colOff - 0.19, beamY - 0.24, cz);
  bpMesh.rotation.y = -Math.PI / 2;
  group.add(bpMesh);
  b.box(m.gold, 0.05, 0.54, 1.66, cx - colOff - 0.16, beamY - 0.51, cz);

  // đèn lồng treo 4 góc + 2 đèn đá trước thềm chuông
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    hangingLantern(b, m, halos, cx + sx * 1.75, beamY - 0.02, cz + sz * 1.75, 0.45, 0.26);
  }
  stoneLantern(b, m, halos, cx - 1.9, 0, cz - 1.55, 0.85);
  stoneLantern(b, m, halos, cx - 1.9, 0, cz + 1.55, 0.85);

  // ── ĐẠI HỒNG CHUNG (Group xoay đung đưa quanh chốt treo) ──
  const pivotY = beamY - 0.22;
  const bellPivot = new THREE.Group();
  bellPivot.position.set(cx, pivotY, cz);
  group.add(bellPivot);

  const bBell = new Batch(true, true);
  // xích đồng & quai chuông đôi rồng Bồ Lao
  bBell.cyl(m.gold, 0.05, 0.05, 0.36, 8, 0, -0.36, 0);
  bBell.add(new THREE.TorusGeometry(0.18, 0.055, 8, 18, Math.PI), m.gold, xf(0, -0.52, 0, Math.PI / 2), 0xf0be52);
  for (const sz of [-0.16, 0.16]) bBell.sphere(m.gold, 0.09, 0, -0.46, sz, 1.2, 1, 1.4, 0xffd56b, 8);

  // thân Đại Hồng Chung xoay (lathe): cao 1.58m, miệng loe 0.56m
  const bellProfile: [number, number][] = [
    [0.58, -2.06], // vành miệng loe dày
    [0.54, -1.98],
    [0.49, -1.82],
    [0.46, -1.45],
    [0.44, -1.05],
    [0.40, -0.74],
    [0.32, -0.56],
    [0.16, -0.50],
    [0.001, -0.49],
  ];
  bBell.add(lathe(bellProfile, 28), m.bronze, undefined, 0xb87e3c);
  // gờ nổi hoa văn vàng + núm vú chuông (3 hàng × 9 núm) + điểm gõ tròn (ấm chuông)
  for (const ryY of [-0.78, -1.25, -1.78, -2.02]) {
    const rr = ryY < -1.9 ? 0.56 : ryY < -1.5 ? 0.485 : ryY < -1.0 ? 0.455 : 0.415;
    bBell.add(new THREE.TorusGeometry(rr, 0.02, 6, 26), m.gold, xf(0, ryY, 0, 0, 1, 1, 1, Math.PI / 2), 0xe8b84c);
  }
  for (let row = 0; row < 3; row++) {
    const ny = -0.88 - row * 0.12;
    const nr = 0.43 + row * 0.012;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * TAU;
      bBell.sphere(m.gold, 0.028, Math.cos(a) * nr, ny, Math.sin(a) * nr, 1, 1, 1, 0xf2c862, 6);
    }
  }
  // điểm thỉnh chuông hoa sen tròn hướng tây (-x)
  bBell.add(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 16), m.gold, xf(-0.48, -1.62, 0, 0, 1, 1, 1, 0, Math.PI / 2), 0xffd870);
  bBell.build(bellPivot, 'bell-body');

  // ── Chày kình gỗ treo dây phía tây chuông ──
  const strikerPivot = new THREE.Group();
  strikerPivot.position.set(cx - 1.02, beamY - 0.2, cz);
  group.add(strikerPivot);

  const bStr = new Batch(true, false);
  for (const dz of [-0.22, 0.22]) {
    bStr.cyl(m.paint, 0.014, 0.014, 1.42, 5, 0, -1.42, dz, 0xd8be86);
  }
  bStr.add(new THREE.CylinderGeometry(0.095, 0.095, 0.92, 12), m.darkWood, xf(0.06, -1.42, 0, 0, 1, 1, 1, 0, Math.PI / 2), 0x6c3e24);
  bStr.add(new THREE.CylinderGeometry(0.105, 0.105, 0.1, 12), m.gold, xf(0.5, -1.42, 0, 0, 1, 1, 1, 0, Math.PI / 2), 0xf0c252);
  bStr.build(strikerPivot, 'bell-striker');

  // ── Vòng sóng chấn động ánh sáng vàng khi thỉnh chuông ──
  const ringGeo = new THREE.RingGeometry(0.93, 1.0, 64);
  ringGeo.rotateX(-Math.PI / 2);
  ownGeo.push(ringGeo);

  const waves: WaveRing[] = [];
  for (let i = 0; i < 3; i++) {
    const wMat = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0xffdf7a : 0xffb84d,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
    });
    ownMat.push(wMat);
    const wm = new THREE.Mesh(ringGeo, wMat);
    wm.position.set(cx, 1.55 - i * 0.45, cz);
    wm.visible = false;
    wm.renderOrder = 22;
    group.add(wm);
    waves.push({ mesh: wm, mat: wMat, age: -1, maxAge: 2.2 + i * 0.35 });
  }

  // hào quang dọc tâm chuông khi ngân + đèn đêm lầu chuông
  const pulseMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: 0xffcf68,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  ownMat.push(pulseMat);
  const pulseSprite = new THREE.Sprite(pulseSpriteMat(pulseMat));
  pulseSprite.position.set(cx, pivotY - 1.5, cz);
  pulseSprite.scale.setScalar(4.2);
  pulseSprite.visible = false;
  group.add(pulseSprite);

  const bellLight = new THREE.PointLight(0xffb85c, 0, 18, 1.7);
  bellLight.position.set(cx, pivotY - 1.3, cz);
  group.add(bellLight);

  let swingAmp = 0;
  let swingTime = 0;
  let strikePhase = -1;
  let flash = 0;
  const cGoldA = new THREE.Color(1.0, 0.86, 0.42);
  const cGoldB = new THREE.Color(1.0, 0.58, 0.18);
  const center = new THREE.Vector3(cx, pivotY - 1.45, cz);

  function triggerWave(): void {
    swingAmp = 0.22;
    swingTime = 0;
    flash = 1.0;
    waves.forEach((w, idx) => {
      w.age = -idx * 0.22;
      w.mesh.visible = true;
    });
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * TAU + Math.random() * 0.15;
      const sp = 2.2 + Math.random() * 2.8;
      sparks.spawn(
        cx + Math.cos(a) * 0.55,
        pivotY - 1.65,
        cz + Math.sin(a) * 0.55,
        Math.cos(a) * sp,
        (Math.random() - 0.25) * 1.4,
        Math.sin(a) * sp,
        1.1 + Math.random() * 0.7,
        0.18,
        0.03,
        cGoldA,
        cGoldB,
        0.95,
        0.15,
        1.4,
        1,
        0.2,
      );
    }
  }

  return {
    group,
    center,
    ring(): void {
      // chày kình kéo lùi nhanh rồi chạm chuông phát sóng vàng
      strikePhase = 0;
      triggerWave();
    },
    update(dt: number, t: number, night: number, lightsOn: boolean): void {
      if (swingAmp > 0.001) {
        swingTime += dt;
        swingAmp *= Math.exp(-dt * 0.62);
        bellPivot.rotation.z = Math.sin(swingTime * 4.1) * swingAmp;
        bellPivot.rotation.x = Math.cos(swingTime * 3.1) * swingAmp * 0.18;
      } else {
        bellPivot.rotation.z = Math.sin(t * 0.7) * 0.006;
        bellPivot.rotation.x = 0;
      }

      if (strikePhase >= 0) {
        strikePhase += dt * 3.2;
        if (strikePhase < 1) {
          // bật ngược về sau sau cú gõ rồi tắt dần
          strikerPivot.rotation.z = -Math.sin(strikePhase * Math.PI * 2.5) * (1 - strikePhase) * 0.26;
        } else {
          strikePhase = -1;
          strikerPivot.rotation.z = 0;
        }
      } else {
        strikerPivot.rotation.z = Math.sin(t * 0.9) * 0.01;
      }

      flash = Math.max(0, flash - dt * 1.1);
      pulseSprite.visible = flash > 0.01;
      if (pulseSprite.visible) {
        pulseMat.opacity = flash * 0.72;
        pulseSprite.scale.setScalar(3.4 + (1 - flash) * 4.5);
      }

      for (let i = 0; i < waves.length; i++) {
        const w = waves[i];
        if (w.age < -10 || (w.age < 0 && w.mesh.visible === false)) continue;
        w.age += dt;
        if (w.age < 0) {
          w.mat.opacity = 0;
          continue;
        }
        const k = w.age / w.maxAge;
        if (k >= 1) {
          w.age = -20;
          w.mesh.visible = false;
          w.mat.opacity = 0;
          continue;
        }
        const rad = 0.65 + (1 - Math.pow(1 - k, 2.2)) * (13.5 - i * 1.5);
        w.mesh.scale.setScalar(rad);
        w.mat.opacity = Math.min(1, k * 8) * Math.pow(1 - k, 1.65) * 0.78;
      }

      const baseNight = lightsOn ? night * 12 : 0;
      bellLight.intensity = baseNight + flash * 26;
      bellLight.visible = bellLight.intensity > 0.05;
    },
    dispose(): void {
      for (const g of ownGeo) g.dispose();
      for (const mt of ownMat) mt.dispose();
      for (const tx of ownTex) tx.dispose();
    },
  };
}

function pulseSpriteMat(m: THREE.SpriteMaterial): THREE.SpriteMaterial {
  return m;
}
