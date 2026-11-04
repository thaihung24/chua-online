/**
 * Bàn thờ trước chánh điện, lư hương đồng, giá đèn nến + "lễ vật" động: hương (que cháy, đầu đỏ, khói), hoa sen tươi,
 * nến (lửa nhấp nháy + quầng sáng + đèn điểm). Hết hạn thì tắt/mờ dần.
 */
import * as THREE from 'three';
import { Batch, clamp, floorGeo, lathe, rng, TAU, xf } from './core';
import type { Mats } from './materials';
import { addLotus, lotusGeometry } from './flora';
import type { ParticleField } from './particles';
import { INTERACTABLES } from '@/world/layout';

const BURNER = INTERACTABLES.find((i) => i.id === 'burner')!.pos;
const ALTAR = INTERACTABLES.find((i) => i.id === 'altar')!.pos;
const CANDLE_X = INTERACTABLES.find((i) => i.id === 'candles')!.pos.x;
const BURNER_TOP = 1.62;

export interface OfferingsPart {
  group: THREE.Group;
  set(o: { incenseUntil?: number; flowersUntil?: number; candleUntil?: number }): void;
  update(dt: number, t: number, night: number): void;
  flare(kind: 'incense' | 'flowers' | 'candle'): void;
  burnerPos: THREE.Vector3;
  flowerPos: THREE.Vector3;
  candlePos: THREE.Vector3;
  dispose(): void;
}

export function buildOfferings(m: Mats, glowTex: THREE.Texture, smoke: ParticleField, sparks: ParticleField, now: () => number): OfferingsPart {
  const group = new THREE.Group();
  group.name = 'offerings';
  const b = new Batch(true);
  const bx = BURNER.x, bz = BURNER.z, az = ALTAR.z;

  // ── bàn thờ ──
  const topY = 1.0;
  b.box(m.lacquer, 5.2, 0.14, 1.6, 0, topY - 0.14, az, 0, 0xc23a2c);
  b.box(m.gold, 5.3, 0.05, 1.7, 0, topY - 0.02, az, 0, 0xffffff);
  b.box(m.lacquer, 5.0, 0.55, 0.12, 0, topY - 0.72, az + 0.74, 0, 0xa8302a);       // diềm trước
  b.box(m.gold, 4.7, 0.05, 0.14, 0, topY - 0.3, az + 0.74);
  b.box(m.gold, 4.7, 0.05, 0.14, 0, topY - 0.7, az + 0.74);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(m.lacquer, 0.2, topY - 0.14, 0.2, sx * 2.4, 0, az + sz * 0.68, 0, 0xa8302a);
  for (let i = -2; i <= 2; i++) { // hoa văn sen trên diềm
    b.add(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 14), m.gold, xf(i * 0.9, topY - 0.52, az + 0.81, 0, 1, 1, 1, Math.PI / 2), 0xffd36a);
    b.add(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 10), m.lacquer, xf(i * 0.9, topY - 0.52, az + 0.82, 0, 1, 1, 1, Math.PI / 2), 0xb02f25);
  }
  b.box(m.paint, 4.6, 0.4, 0.06, 0, 0.14, az + 0.7, 0, 0xd6a63a);                   // khăn vàng rủ
  // mâm trái cây trung tâm
  b.add(lathe([[0.001, 0], [0.36, 0.05], [0.5, 0.18], [0.46, 0.2], [0.001, 0.12]], 18), m.gold, xf(0, topY, az), 0xe8b84a);
  b.cyl(m.gold, 0.14, 0.2, 0.18, 10, 0, topY, az, 0xe0a83e);
  const fruit = [0xd8452a, 0xf0a830, 0x86b83a, 0xe8602a, 0xf6c440, 0xc83a46, 0x9ccf44];
  const rr = rng(4);
  for (let i = 0; i < 12; i++) {
    const a = rr() * TAU, d = i < 7 ? 0.28 : 0.1, y = i < 7 ? 0.28 : 0.46;
    b.sphere(m.paint, 0.13, Math.cos(a) * d, topY + y, az + Math.sin(a) * d, 1, 0.95, 1, fruit[i % fruit.length]);
  }
  // hai bình đồng (cắm hoa)
  for (const sx of [-1, 1]) {
    const vx = sx * 1.9;
    b.add(lathe([[0.001, 0], [0.2, 0.02], [0.26, 0.2], [0.2, 0.5], [0.12, 0.66], [0.17, 0.78], [0.001, 0.78]], 16), m.gold, xf(vx, topY, az), 0xe5b44a);
    b.add(new THREE.TorusGeometry(0.24, 0.02, 5, 16), m.gold, xf(vx, topY + 0.3, az, 0, 1, 1, 1, Math.PI / 2), 0xffd36a);
  }
  // ── giá đèn nến (hai bên) ──
  for (const sx of [-1, 1]) {
    const cx = sx * CANDLE_X;
    b.cyl(m.stone, 0.42, 0.5, 0.2, 10, cx, 0, az, 0xa8a298);
    b.add(lathe([[0.001, 0], [0.34, 0.02], [0.2, 0.12], [0.07, 0.3], [0.1, 0.7], [0.07, 0.95], [0.2, 1.0], [0.24, 1.12], [0.2, 1.1], [0.001, 1.0]], 14), m.bronze, xf(cx, 0.2, az), 0xffffff);
    b.cyl(m.paint, 0.07, 0.07, 0.5, 10, cx, 1.28, az, 0xd9382a);
    b.cyl(m.paint, 0.075, 0.075, 0.03, 10, cx, 1.76, az, 0xf0e0c0);
  }

  // ── lư hương ──
  b.cyl(m.stone, 1.75, 1.9, 0.22, 8, bx, 0, bz, 0xa8a298);
  b.cyl(m.stone, 1.45, 1.6, 0.2, 8, bx, 0.22, bz, 0xb4aea2);
  b.cyl(m.gold, 1.5, 1.5, 0.04, 8, bx, 0.42, bz);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU + 0.5;
    b.add(new THREE.CylinderGeometry(0.15, 0.1, 0.62, 8), m.bronze, xf(bx + Math.sin(a) * 0.72, 0.42 + 0.34, bz + Math.cos(a) * 0.72, 0, 1, 1, 1, 0.16 * Math.cos(a), -0.16 * Math.sin(a)), 0xffffff);
    b.sphere(m.bronze, 0.17, bx + Math.sin(a) * 0.8, 0.5, bz + Math.cos(a) * 0.8, 1, 0.8, 1);
  }
  b.add(lathe([[0.001, 0.0], [0.5, 0.0], [0.8, 0.22], [0.92, 0.52], [0.9, 0.8], [0.84, 1.02], [0.9, 1.1], [0.96, 1.2], [0.94, 1.24], [0.8, 1.2], [0.001, 1.18]], 28), m.bronze, xf(bx, 0.82, bz), 0xffffff);
  b.add(new THREE.TorusGeometry(0.925, 0.05, 6, 28), m.gold, xf(bx, 1.4, bz, 0, 1, 1, 1, Math.PI / 2), 0xffd36a);
  b.add(new THREE.TorusGeometry(0.88, 0.03, 6, 28), m.gold, xf(bx, 1.05, bz, 0, 1, 1, 1, Math.PI / 2), 0xffd36a);
  for (const sx of [-1, 1]) b.add(new THREE.TorusGeometry(0.28, 0.05, 6, 16), m.bronze, xf(bx + sx * 1.02, 1.9, bz, 0, 1, 1, 1, 0, 0), 0xffffff);
  b.add(new THREE.CircleGeometry(0.84, 24), m.stoneDark, xf(bx, BURNER_TOP, bz, 0, 1, 1, 1, -Math.PI / 2), 0x8a8780);
  b.build(group, 'offer-static');

  // ── hương (động) ──
  const stickN = 9;
  const stickGeo = new THREE.CylinderGeometry(0.011, 0.014, 1, 5);
  stickGeo.translate(0, 0.5, 0);
  const sticks = new THREE.InstancedMesh(stickGeo, new THREE.MeshStandardMaterial({ color: 0x9c3b22, roughness: 0.9 }), stickN);
  const tipGeo = new THREE.SphereGeometry(0.03, 6, 5);
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xff5a22, toneMapped: false, fog: false });
  const tips = new THREE.InstancedMesh(tipGeo, tipMat, stickN);
  sticks.frustumCulled = tips.frustumCulled = false;
  sticks.castShadow = false;
  const sPos: { x: number; z: number; tx: number; tz: number }[] = [];
  for (let i = 0; i < stickN; i++) {
    const a = (i / stickN) * TAU + 0.3, d = i < 6 ? 0.5 : 0.22;
    sPos.push({ x: bx + Math.cos(a) * d, z: bz + Math.sin(a) * d, tx: (Math.sin(i * 12.9) * 0.5) * 0.12, tz: (Math.cos(i * 7.3) * 0.5) * 0.12 });
  }
  group.add(sticks, tips);
  const burnerPos = new THREE.Vector3(bx, BURNER_TOP, bz);

  // ── hoa (động) ──
  const flowers = new THREE.Group();
  const fb = new Batch(false);
  const fr = rng(21);
  const heads: [number, number, number, number, number][] = [[0, 0.95, 0, 1.1, 1], [-0.32, 0.7, 0.1, 0.9, 0.55], [0.34, 0.75, -0.1, 0.95, 0.8], [0.1, 0.5, 0.3, 0.7, 0.5]];
  for (const [hx, hy, hz, hs, op] of heads) {
    addLotus(fb, m.paintDouble, hx * 0.6, hy, hz * 0.6, hs * 0.55, op, hy > 0.9 ? 0xfbd2de : 0xf5a7c0, 0xf08cac);
    const p0 = new THREE.Vector3(0, 0, 0), p1 = new THREE.Vector3(hx * 0.6, hy, hz * 0.6);
    fb.add(new THREE.CylinderGeometry(0.014, 0.018, 1, 5), m.paint, new THREE.Matrix4().compose(p1.clone().add(p0).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().normalize()), new THREE.Vector3(1, p1.length(), 1)), 0x4a8a3a);
  }
  for (let i = 0; i < 7; i++) {
    const a = fr() * TAU, d = 0.18 + fr() * 0.18, y = 0.3 + fr() * 0.3;
    fb.add(new THREE.SphereGeometry(1, 8, 6), m.paintDouble, xf(Math.cos(a) * d, y, Math.sin(a) * d, a, 0.2, 0.05, 0.1, 0.5 - 1.2), 0x4f9a3f);
    fb.sphere(m.paint, 0.07, Math.cos(a) * d * 1.3, y + 0.18, Math.sin(a) * d * 1.3, 1, 1, 1, [0xfff1a0, 0xffffff, 0xffb84a][i % 3]);
  }
  const fTmp = new THREE.Group();
  fb.build(fTmp, 'flowers');
  const flowerMeshes = [...fTmp.children] as THREE.Mesh[];
  for (const sx of [-1, 1]) {
    const g = new THREE.Group();
    for (const fm of flowerMeshes) { const c = fm.clone(); c.castShadow = false; g.add(c); }
    g.position.set(sx * 1.9, topY + 0.7, az);
    g.rotation.y = sx * 0.4;
    flowers.add(g);
  }
  // mâm sen trước bàn thờ (3 bông sen nổi)
  const trayGeo = lotusGeometry(0.9);
  const trayMesh = new THREE.Mesh(trayGeo, m.paintDouble);
  trayMesh.position.set(0, topY + 0.06, az + 0.55);
  trayMesh.scale.setScalar(0.55);
  flowers.add(trayMesh);
  group.add(flowers);
  flowers.visible = false;
  const flowerPos = new THREE.Vector3(0, topY + 0.8, az);

  // ── nến (động) ──
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffd27a, toneMapped: false, fog: false });
  const flameGeo = new THREE.SphereGeometry(1, 8, 8);
  flameGeo.scale(0.06, 0.15, 0.06); flameGeo.translate(0, 0.14, 0);
  const flames: THREE.Mesh[] = [];
  const sprites: THREE.Sprite[] = [];
  for (const sx of [-1, 1]) {
    const f = new THREE.Mesh(flameGeo, flameMat);
    f.position.set(sx * CANDLE_X, 1.8, az);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffb050, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    sp.position.set(sx * CANDLE_X, 1.95, az); sp.scale.setScalar(1.3);
    group.add(f, sp);
    flames.push(f); sprites.push(sp);
  }
  const candleLight = new THREE.PointLight(0xffa850, 0, 12, 1.8);
  candleLight.position.set(0, 2.2, az + 0.6);
  group.add(candleLight);
  const candlePos = new THREE.Vector3(CANDLE_X, 1.9, az);

  // trạng thái
  const until = { incense: 0, flowers: 0, candle: 0 };
  const lvl = { incense: 0, flowers: 0, candle: 0 };
  const flare = { incense: 0, flowers: 0, candle: 0 };
  const dummy = new THREE.Object3D();
  const cOn = new THREE.Color(0xffe8d0), cOff = new THREE.Color(0x3a3a3a);
  void cOn; void cOff;
  const smokeCol = new THREE.Color(0.86, 0.86, 0.9);
  const emberCol = new THREE.Color(1, 0.45, 0.15);
  let accSmoke = 0, accEmber = 0;
  let lastStickUpdate = -1;

  function setSticks(rem: number): void {
    const len = 0.55 + 0.55 * clamp(rem, 0, 1);
    for (let i = 0; i < stickN; i++) {
      const p = sPos[i];
      dummy.position.set(p.x, BURNER_TOP, p.z);
      dummy.rotation.set(p.tz, 0, -p.tx);
      dummy.scale.set(1, len, 1);
      dummy.updateMatrix();
      sticks.setMatrixAt(i, dummy.matrix);
      dummy.position.set(p.x + p.tx * len, BURNER_TOP + len, p.z + p.tz * len);
      dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1);
      dummy.updateMatrix();
      tips.setMatrixAt(i, dummy.matrix);
    }
    sticks.instanceMatrix.needsUpdate = true; tips.instanceMatrix.needsUpdate = true;
  }
  setSticks(1);
  sticks.visible = tips.visible = false;

  return {
    group, burnerPos, flowerPos, candlePos,
    set(o): void { until.incense = o.incenseUntil ?? 0; until.flowers = o.flowersUntil ?? 0; until.candle = o.candleUntil ?? 0; },
    flare(kind): void { flare[kind] = 1; },
    update(dt, t, night): void {
      const n = now();
      const tgt = { incense: until.incense > n ? 1 : 0, flowers: until.flowers > n ? 1 : 0, candle: until.candle > n ? 1 : 0 };
      for (const k of ['incense', 'flowers', 'candle'] as const) {
        lvl[k] += (tgt[k] - lvl[k]) * Math.min(1, dt * (tgt[k] > lvl[k] ? 3.5 : 0.9));
        if (Math.abs(tgt[k] - lvl[k]) < 0.004) lvl[k] = tgt[k];
        flare[k] = Math.max(0, flare[k] - dt * 1.3);
      }
      // hương
      const li = lvl.incense;
      sticks.visible = tips.visible = li > 0.01;
      if (li > 0.01) {
        if (t - lastStickUpdate > 1.0) { lastStickUpdate = t; setSticks((until.incense - n) / 1_200_000); }
        tipMat.color.setRGB(1, 0.35 + 0.15 * Math.sin(t * 9), 0.12).multiplyScalar(0.6 + 0.8 * li);
        accSmoke += dt * 16 * li; accEmber += dt * 10 * li;
        const rem = clamp((until.incense - n) / 1_200_000, 0, 1);
        const len = 0.55 + 0.55 * rem;
        while (accSmoke >= 1) {
          accSmoke -= 1;
          const p = sPos[(Math.random() * stickN) | 0];
          smoke.spawn(p.x + p.tx * len, BURNER_TOP + len, p.z + p.tz * len, (Math.random() - 0.5) * 0.06, 0.32 + Math.random() * 0.12, (Math.random() - 0.5) * 0.06, 4.2 + Math.random() * 1.4, 0.07, 0.8 + flare.incense * 0.4, smokeCol, null, (0.2 + flare.incense * 0.2) * (1 - 0.35 * night), -0.02, 0.1, 0, 0.12);
        }
        while (accEmber >= 1) {
          accEmber -= 1;
          const p = sPos[(Math.random() * stickN) | 0];
          sparks.spawn(p.x + p.tx * len, BURNER_TOP + len, p.z + p.tz * len, 0, 0.02, 0, 0.35, 0.16, 0.05, emberCol, null, 0.55, 0, 0, 0, 0);
        }
      }
      // hoa
      const lf = lvl.flowers;
      flowers.visible = lf > 0.01;
      if (flowers.visible) {
        const e = 1 - Math.pow(1 - lf, 3);
        const bounce = lf < 1 ? 1 + 0.12 * Math.sin(lf * Math.PI) : 1;
        flowers.scale.setScalar(Math.max(0.001, e * bounce * (1 + 0.1 * flare.flowers)));
        flowers.position.y = 0;
        flowers.rotation.y = Math.sin(t * 0.6) * 0.02;
      }
      // nến
      const lc = lvl.candle;
      for (let i = 0; i < 2; i++) {
        const f = flames[i], sp = sprites[i];
        f.visible = lc > 0.02;
        const fl = 0.85 + 0.15 * Math.sin(t * 11 + i * 2) * Math.sin(t * 5.3 + i) + flare.candle * 0.8;
        f.scale.set(1, lc * fl * 1.1, 1);
        f.rotation.z = Math.sin(t * 7 + i * 3) * 0.12; f.rotation.x = Math.cos(t * 6 + i) * 0.1;
        sp.visible = lc > 0.02;
        sp.material.opacity = lc * (0.55 + 0.25 * fl) * (0.7 + 0.3 * night + flare.candle * 0.4);
        sp.scale.setScalar(1.0 + 0.45 * fl + flare.candle * 0.8);
      }
      candleLight.intensity = lc * (3 + 5 * night + flare.candle * 8) * (0.9 + 0.1 * Math.sin(t * 13) * Math.sin(t * 4.1));
    },
    dispose(): void { stickGeo.dispose(); tipGeo.dispose(); (sticks.material as THREE.Material).dispose(); tipMat.dispose(); flameGeo.dispose(); flameMat.dispose(); trayGeo.dispose(); for (const s of sprites) s.material.dispose(); void floorGeo; },
  };
}
