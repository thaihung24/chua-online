/**
 * Ao Sen (`LOTUS_POND`) & Hồ Phóng Sinh (`RELEASE_POND`):
 * - Mặt nước shader sóng gợn kép, phản chiếu bầu trời + ánh trăng/mặt trời, trong trẻo thấy cá bơi bên dưới.
 * - Ao sen: đá cuội viền bờ, bậc đá & sàn ngắm sen phía đông, ~52 lá sen đung đưa, ~28 hoa & búp sen,
 *   cụm sen nở bừng sáng (`lotusBloom`), 14 cá koi uốn đuôi bơi lượn, tối đa 60 đèn hoa đăng giấy phát sáng (`addLantern`, đèn `mine` rực rỡ hơn + viền hào quang).
 * - Hồ phóng sinh: bến gỗ có đèn treo & giỏ tre, hòn đảo rùa đá, bụi lau sậy, đàn cá chép;
 *   `triggerRelease()` thả cá chép phóng vọt xuống nước tung bọt + đàn chim trắng/vàng vỗ cánh bay xoắn ốc lên trời.
 */
import * as THREE from 'three';
import { LOTUS_POND, RELEASE_POND } from '@/world/layout';
import { addWind, Batch, clamp, jitter, rng, type SharedUniforms, TAU, xf } from './core';
import { hangingLantern, stoneLantern } from './courtyard';
import { addLotus, bush, lotusGeometry, lotusPadGeometry } from './flora';
import type { Mats } from './materials';
import type { HaloSpec, ParticleField } from './particles';
import type { SkyRig } from './sky';
import { turtle } from './statues';

const MAX_LANTERNS = 60;
const KOI_LOTUS = 14;
const KOI_RELEASE = 10;
const RELEASE_FISH_CAP = 6;
const RELEASE_BIRD_CAP = 8;

interface LanternEntry {
  id: string;
  color: THREE.Color;
  mine: boolean;
  angle: number;
  radFrac: number;
  speed: number;
  wobble: number;
  birth: number;
}

interface KoiOrbit {
  cx: number;
  cz: number;
  rx: number;
  rz: number;
  ang: number;
  speed: number;
  lobe: number;
  scale: number;
  phase: number;
}

interface RippleSlot {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  age: number;
  maxAge: number;
  maxR: number;
}

interface LeapingFish {
  active: boolean;
  age: number;
  dur: number;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  splashed: boolean;
}

interface FlyingBird {
  active: boolean;
  age: number;
  dur: number;
  x0: number;
  y0: number;
  z0: number;
  ang0: number;
  radSpeed: number;
  climb: number;
}

export interface PondsPart {
  group: THREE.Group;
  lotusStepPos: THREE.Vector3;
  releasePierPos: THREE.Vector3;
  addLantern(l: { id: string; color: string; mine: boolean }): void;
  spawnRipple(x: number, z: number, color?: THREE.ColorRepresentation, maxR?: number): void;
  triggerRelease(at?: { x: number; z: number }): void;
  triggerLotusBloom(at?: { x: number; z: number }): void;
  update(dt: number, t: number, night: number, lightsOn: boolean): void;
  dispose(): void;
}

/** Hình học cá Koi / cá chép mượt (dài ~0.62m dọc trục +Z, vây ngực + vây lưng + đuôi quạt). */
function fishGeometry(): THREE.BufferGeometry {
  const b = new Batch(false, false);
  const mat = new THREE.MeshBasicMaterial();
  b.add(new THREE.SphereGeometry(1, 10, 7), mat, xf(0, 0, 0.04, 0, 0.085, 0.075, 0.24), 0xffffff);
  b.add(new THREE.ConeGeometry(0.075, 0.22, 7), mat, xf(0, 0, -0.2, 0, 1, 1, 1, -Math.PI / 2), 0xffffff);
  // đuôi xoè quạt
  b.add(new THREE.ConeGeometry(0.09, 0.18, 4), mat, xf(0, 0.01, -0.34, 0, 0.22, 1, 1, Math.PI / 2), 0xfff0dd);
  // vây lưng & 2 vây ngực
  b.add(new THREE.ConeGeometry(0.04, 0.14, 4), mat, xf(0, 0.075, -0.02, 0, 0.2, 1, 1.4, -0.4), 0xfff0dd);
  for (const sx of [-1, 1]) {
    b.add(new THREE.ConeGeometry(0.045, 0.12, 4), mat, xf(sx * 0.08, -0.02, 0.06, sx * 0.6, 1, 0.22, 1, 0, sx * 1.2), 0xfff0dd);
  }
  const tmp = new THREE.Group();
  const meshes = b.build(tmp);
  const g = meshes[0].geometry;
  mat.dispose();
  return g;
}

/** Hình học đèn hoa đăng giấy (đế tròn + 2 tầng cánh sen phát sáng + nến vàng ở giữa). */
function paperLanternGeometry(): THREE.BufferGeometry {
  const b = new Batch(false, false);
  const mat = new THREE.MeshBasicMaterial();
  // đế lá/gỗ mỏng
  b.cyl(mat, 0.24, 0.21, 0.025, 12, 0, 0, 0, 0x3b6e38);
  const petal = new THREE.SphereGeometry(1, 7, 5);
  for (let ring = 0; ring < 2; ring++) {
    const n = ring === 0 ? 8 : 6;
    const tilt = ring === 0 ? 0.72 : 0.36;
    const len = ring === 0 ? 0.24 : 0.21;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + ring * 0.4;
      const d = 0.05 + 0.45 * len * Math.sin(tilt);
      b.add(
        petal,
        mat,
        xf(Math.sin(a) * d, 0.03 + 0.45 * len * Math.cos(tilt), Math.cos(a) * d, a, 0.095, len * 0.52, 0.032, tilt),
        ring === 0 ? 0xdddddd : 0xffffff,
      );
    }
  }
  // tim nến rực sáng ở tâm
  b.cyl(mat, 0.035, 0.04, 0.07, 8, 0, 0.025, 0, 0xffffff);
  b.sphere(mat, 0.042, 0, 0.12, 0, 0.8, 1.4, 0.8, 0xffffff, 7);
  const tmp = new THREE.Group();
  const g = b.build(tmp)[0].geometry;
  petal.dispose();
  mat.dispose();
  return g;
}

/** Hình học chim phóng sinh (thân thon + 2 cánh mở ngang theo trục X để vỗ trong shader). */
function birdGeometry(): THREE.BufferGeometry {
  const b = new Batch(false, false);
  const mat = new THREE.MeshBasicMaterial();
  b.add(new THREE.SphereGeometry(1, 8, 6), mat, xf(0, 0, 0, 0, 0.065, 0.06, 0.18), 0xfbf8f0);
  b.add(new THREE.SphereGeometry(1, 7, 5), mat, xf(0, 0.04, 0.16, 0, 0.048, 0.048, 0.055), 0xffffff);
  b.add(new THREE.ConeGeometry(0.05, 0.14, 4), mat, xf(0, 0.01, -0.2, 0, 1.3, 0.2, 1, Math.PI / 2), 0xf4efe2);
  // hai cánh trải rộng sang ±X (x càng xa tâm càng vỗ mạnh trong shader)
  for (const sx of [-1, 1]) {
    b.add(new THREE.BoxGeometry(0.32, 0.014, 0.15), mat, xf(sx * 0.18, 0.02, 0.01, sx * -0.12), 0xffffff);
    b.add(new THREE.ConeGeometry(0.075, 0.18, 4), mat, xf(sx * 0.38, 0.02, -0.02, 0, 1, 0.18, 0.9, 0, -sx * Math.PI / 2), 0xfff8e6);
  }
  const tmp = new THREE.Group();
  const g = b.build(tmp)[0].geometry;
  mat.dispose();
  return g;
}

export function createWaterMaterial(
  noiseTex: THREE.Texture,
  shared: SharedUniforms,
  sky: SkyRig,
  deepHex = 0x164c52,
  shallowHex = 0x2d7b74,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      tNoise: { value: noiseTex },
      uTime: shared.uTime,
      uNight: shared.uNight,
      uSunDir: { value: sky.getSunDir() },
      uSkyTop: { value: sky.getSample().zen },
      uSkyHor: { value: sky.getSample().hor },
      uFogCol: { value: sky.getFog() },
      uDeep: { value: new THREE.Color(deepHex) },
      uShallow: { value: new THREE.Color(shallowHex) },
    },
    vertexShader: `
      varying vec3 vWp;
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        wp.y += sin(wp.x * 1.9 + uTime * 1.7) * 0.012 + cos(wp.z * 2.3 - uTime * 1.4) * 0.012;
        vWp = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform sampler2D tNoise;
      uniform float uTime, uNight;
      uniform vec3 uSunDir, uSkyTop, uSkyHor, uFogCol, uDeep, uShallow;
      varying vec3 vWp;
      varying vec2 vUv;
      void main() {
        vec2 p = vWp.xz;
        float nA = texture2D(tNoise, p * 0.17 + vec2(uTime * 0.022, uTime * 0.016)).r;
        float nB = texture2D(tNoise, p * 0.31 - vec2(uTime * 0.018, uTime * 0.025)).r;
        float nC = texture2D(tNoise, p * 0.75 + vec2(-uTime * 0.03, uTime * 0.02)).r;
        float wave = (nA + nB - 1.0) * 0.5 + (nC - 0.5) * 0.25;

        vec3 nrm = normalize(vec3(wave * 0.42, 1.0, (nB - nA) * 0.42));
        vec3 V = normalize(cameraPosition - vWp);
        float fres = pow(1.0 - max(dot(nrm, V), 0.0), 3.0);

        float rEdge = length((vUv - 0.5) * 2.0);
        float depthFactor = 1.0 - smoothstep(0.15, 0.95, rEdge);
        vec3 waterBase = mix(uShallow, uDeep, depthFactor);
        waterBase *= mix(1.05, 0.34, uNight);

        vec3 skyRef = mix(uSkyHor, uSkyTop, 0.48) * mix(0.95, 0.55, uNight);
        vec3 col = mix(waterBase, skyRef, clamp(0.18 + fres * 0.68, 0.0, 0.88));

        // lấp lánh nắng ban ngày / ánh trăng & đèn ban đêm
        vec3 L = normalize(vec3(uSunDir.x, abs(uSunDir.y) + 0.25, uSunDir.z));
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(nrm, H), 0.0), 72.0);
        vec3 specCol = mix(vec3(1.0, 0.94, 0.78), vec3(0.75, 0.84, 1.0), uNight);
        col += specCol * spec * mix(0.85, 0.45, uNight);
        // gợn sáng dịu trên mặt hồ
        col += vec3(0.16, 0.24, 0.22) * smoothstep(0.12, 0.28, wave) * (1.0 - 0.55 * uNight);

        // hoà sương mù xa
        float dist = length(cameraPosition - vWp);
        float fogF = 1.0 - exp(-0.00004 * dist * dist);
        col = mix(col, uFogCol, clamp(fogF, 0.0, 1.0));

        float alpha = smoothstep(1.0, 0.88, rEdge) * mix(0.78, 0.86, depthFactor);
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

export function buildPonds(
  m: Mats,
  shared: SharedUniforms,
  sky: SkyRig,
  glowTex: THREE.Texture,
  halos: HaloSpec[],
  sparks: ParticleField,
  bBank: Batch,
  bSoft: Batch,
): PondsPart {
  const group = new THREE.Group();
  group.name = 'ponds';
  const ownGeo: THREE.BufferGeometry[] = [];
  const ownMat: THREE.Material[] = [];

  const WATER_Y = 0.11;

  // ── Mặt nước 2 hồ ──
  const waterMatLotus = createWaterMaterial(m.textures.noise, shared, sky, 0x134c52, 0x2c7d73);
  const waterMatRel = createWaterMaterial(m.textures.noise, shared, sky, 0x155058, 0x31847a);
  ownMat.push(waterMatLotus, waterMatRel);

  const discGeo = new THREE.CircleGeometry(1, 56);
  discGeo.rotateX(-Math.PI / 2);
  ownGeo.push(discGeo);

  const lotusWater = new THREE.Mesh(discGeo, waterMatLotus);
  lotusWater.position.set(LOTUS_POND.cx, WATER_Y, LOTUS_POND.cz);
  lotusWater.scale.set(LOTUS_POND.rx + 0.45, 1, LOTUS_POND.rz + 0.45);
  lotusWater.renderOrder = 4;

  const relWater = new THREE.Mesh(discGeo, waterMatRel);
  relWater.position.set(RELEASE_POND.cx, WATER_Y, RELEASE_POND.cz);
  relWater.scale.set(RELEASE_POND.rx + 0.45, 1, RELEASE_POND.rz + 0.45);
  relWater.renderOrder = 4;
  group.add(lotusWater, relWater);

  // ─────────────────── 1. BỜ ĐÁ CUỘI & BẬC NGẮM SEN (LOTUS_POND) ───────────────────
  const rRock = rng(301);
  const rockCols = [0x8b867c, 0x9d978c, 0x76726a, 0x6f7a64, 0xa8a296];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * TAU;
    const px = LOTUS_POND.cx + Math.cos(a) * (LOTUS_POND.rx + 0.42 + (rRock() - 0.5) * 0.35);
    const pz = LOTUS_POND.cz + Math.sin(a) * (LOTUS_POND.rz + 0.42 + (rRock() - 0.5) * 0.35);
    // chừa bậc thềm phía đông (a gần 0) và cửa suối phía bắc (px≈-22.8, pz≈8.0)
    if (Math.abs(pz - LOTUS_POND.cz) < 1.9 && px > LOTUS_POND.cx + 5) continue;
    if (pz < LOTUS_POND.cz - 4.5 && Math.abs(px - (-22.8)) < 1.4) continue;
    const rx = 0.42 + rRock() * 0.48, ry = 0.2 + rRock() * 0.24, rz = 0.38 + rRock() * 0.42;
    bBank.add(
      jitter(new THREE.IcosahedronGeometry(1, 1), 0.26, i + 10),
      m.stone,
      xf(px, ry * 0.45, pz, rRock() * TAU, rx, ry, rz),
      rockCols[i % rockCols.length],
      true,
    );
  }
  // vài cụm đá cảnh lớn & bụi cây thuỷ sinh ven Ao Sen
  for (const [bx, bz, sc] of [[-28.2, 10.5, 1.15], [-27.8, 17.8, 1.0], [-16.2, 19.8, 0.95]] as const) {
    bBank.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.3, Math.floor( Math.abs(bx) * 7 )), m.stone, xf(bx, 0.45 * sc, bz, sc, 0.9 * sc, 0.72 * sc, 0.8 * sc), 0x827d73, true);
    bush(bSoft, m, bx + 0.6, bz + 0.4, 0.85 * sc, 0x4b8a3f);
  }

  // Bậc đá & sàn gỗ ngắm sen / thả hoa đăng phía đông Ao Sen (x = -10.6 .. -13.3, z = 14)
  {
    const sz = LOTUS_POND.cz;
    bBank.box(m.stone, 1.1, 0.12, 3.3, -10.85, 0, sz, 0, 0xb2aca0);
    bBank.box(m.stone, 2.35, 0.22, 3.0, -12.15, 0, sz, 0, 0xa8a296);
    bBank.box(m.wood, 2.15, 0.06, 2.75, -12.22, 0.22, sz, 0, 0x8a5e3b);
    for (const dz of [-1.42, 1.42]) {
      // trụ búp sen đá hai bên thềm thả đèn
      bBank.cyl(m.stone, 0.14, 0.17, 0.56, 8, -11.3, 0.22, sz + dz, 0xbab4a8);
      bBank.sphere(m.stone, 0.15, -11.3, 0.84, sz + dz, 1, 1.25, 1, 0xc8c2b4, 8);
      bBank.cyl(m.stone, 0.13, 0.16, 0.48, 8, -13.1, 0.22, sz + dz, 0xbab4a8);
      bBank.sphere(m.gold, 0.12, -13.1, 0.75, sz + dz, 1, 1.25, 1, 0xe8bc52, 8);
    }
    stoneLantern(bBank, m, halos, -10.4, 0, sz - 2.4, 0.9);
    stoneLantern(bBank, m, halos, -10.4, 0, sz + 2.4, 0.9);
  }

  // ─────────────────── 2. LÁ SEN & HOA SEN TRÊN AO SEN ───────────────────
  const padGeo = lotusPadGeometry();
  const padMat = new THREE.MeshStandardMaterial({ roughness: 0.72, metalness: 0.04, side: THREE.DoubleSide });
  addWind(padMat, shared, { amp: 0.035, freq: 1.4, weight: '1.0' });
  const bloomOpenGeo = lotusGeometry(0.95);
  const bloomBudGeo = lotusGeometry(0.35);
  const bloomMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, side: THREE.DoubleSide });
  addWind(bloomMat, shared, { amp: 0.045, freq: 1.5, weight: '1.0' });
  ownGeo.push(padGeo, bloomOpenGeo, bloomBudGeo);
  ownMat.push(padMat, bloomMat);

  const PAD_N = 52;
  const padInst = new THREE.InstancedMesh(padGeo, padMat, PAD_N);
  padInst.receiveShadow = true;
  const OPEN_N = 20, BUD_N = 10;
  const openInst = new THREE.InstancedMesh(bloomOpenGeo, bloomMat, OPEN_N);
  const budInst = new THREE.InstancedMesh(bloomBudGeo, bloomMat, BUD_N);
  openInst.castShadow = budInst.castShadow = false;

  const rLot = rng(409);
  const dummy = new THREE.Object3D();
  const tmpC = new THREE.Color();
  const padCoords: [number, number, number][] = [];

  for (let i = 0; i < PAD_N; i++) {
    // phân bố đẹp mắt theo vành hồ, chừa luồng giữa cho đèn hoa đăng trôi & tránh sàn gỗ ngắm sen phía đông
    let lx = LOTUS_POND.cx, lz = LOTUS_POND.cz;
    for (let tries = 0; tries < 24; tries++) {
      const a = rLot() * TAU;
      const rf = 0.25 + 0.65 * Math.sqrt(rLot());
      lx = LOTUS_POND.cx + Math.cos(a) * LOTUS_POND.rx * rf;
      lz = LOTUS_POND.cz + Math.sin(a) * LOTUS_POND.rz * rf;
      const onDeck = lx > -14.4 && Math.abs(lz - LOTUS_POND.cz) < 2.55;
      const inStreamMouth = lz < 8.9 && Math.abs(lx - (-22.8)) < 1.5;
      if (!onDeck && !inStreamMouth) break;
    }
    const sc = 0.36 + rLot() * 0.44;
    padCoords.push([lx, lz, sc]);
    dummy.position.set(lx, WATER_Y + 0.012 + (i % 3) * 0.004, lz);
    dummy.rotation.set((rLot() - 0.5) * 0.06, rLot() * TAU, (rLot() - 0.5) * 0.06);
    dummy.scale.setScalar(sc);
    dummy.updateMatrix();
    padInst.setMatrixAt(i, dummy.matrix);
    tmpC.setHex(i % 3 === 0 ? 0x3b8444 : i % 3 === 1 ? 0x2f723b : 0x4b9248).offsetHSL(0, 0, (rLot() - 0.5) * 0.06);
    padInst.setColorAt(i, tmpC);
  }
  padInst.instanceMatrix.needsUpdate = true;
  if (padInst.instanceColor) padInst.instanceColor.needsUpdate = true;

  for (let i = 0; i < OPEN_N; i++) {
    const [px, pz] = padCoords[i * 2];
    const h = 0.08 + rLot() * 0.24;
    bSoft.cyl(m.foliage, 0.015, 0.02, h + 0.08, 5, px + 0.08, WATER_Y - 0.03, pz + 0.06, 0x3f7c3a);
    dummy.position.set(px + 0.08, WATER_Y + h, pz + 0.06);
    dummy.rotation.set(0, rLot() * TAU, 0);
    dummy.scale.setScalar(0.46 + rLot() * 0.24);
    dummy.updateMatrix();
    openInst.setMatrixAt(i, dummy.matrix);
    tmpC.setHex(i % 4 === 0 ? 0xffffff : 0xffdfea);
    openInst.setColorAt(i, tmpC);
  }
  for (let i = 0; i < BUD_N; i++) {
    const [px, pz] = padCoords[OPEN_N + i * 2];
    const h = 0.12 + rLot() * 0.26;
    bSoft.cyl(m.foliage, 0.014, 0.018, h + 0.08, 5, px - 0.06, WATER_Y - 0.03, pz - 0.05, 0x3f7c3a);
    dummy.position.set(px - 0.06, WATER_Y + h, pz - 0.05);
    dummy.rotation.set(0, rLot() * TAU, 0);
    dummy.scale.setScalar(0.42 + rLot() * 0.2);
    dummy.updateMatrix();
    budInst.setMatrixAt(i, dummy.matrix);
    tmpC.setHex(0xffc8dc);
    budInst.setColorAt(i, tmpC);
  }
  openInst.instanceMatrix.needsUpdate = budInst.instanceMatrix.needsUpdate = true;
  if (openInst.instanceColor) openInst.instanceColor.needsUpdate = true;
  if (budInst.instanceColor) budInst.instanceColor.needsUpdate = true;
  group.add(padInst, openInst, budInst);

  // Cụm hoa sen thần diệu nở bừng khi gọi `playEffect('lotusBloom')`
  const heroGroup = new THREE.Group();
  heroGroup.position.set(-16.2, WATER_Y + 0.06, 14.0);
  const bHero = new Batch(false, false);
  addLotus(bHero, m.paintDouble, 0, 0.14, 0, 0.82, 1.0, 0xffd0e0, 0xf58ab0, 0);
  addLotus(bHero, m.paintDouble, -0.55, 0.08, 0.42, 0.64, 0.9, 0xfff2f6, 0xf8b2ca, 1.1);
  addLotus(bHero, m.paintDouble, 0.48, 0.1, -0.45, 0.66, 0.95, 0xffd6e4, 0xf286ac, 2.3);
  bHero.build(heroGroup, 'hero-lotus');
  group.add(heroGroup);
  let bloomPulse = 0;

  // ─────────────────── 3. ĐÈN HOA ĐĂNG TRÊN AO SEN (tối đa 60 đèn) ───────────────────
  const lanternGeo = paperLanternGeometry();
  const lanternMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.4,
    metalness: 0.02,
    emissive: 0xffffff,
    emissiveIntensity: 0.55,
    side: THREE.DoubleSide,
  });
  // Để màu từng đèn (instanceColor) giữ độ bão hoà ấm áp dưới ACES tone mapping cả ban đêm
  lanternMat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
       #if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
         totalEmissiveRadiance *= vColor * vColor;
       #endif`,
    );
  };
  lanternMat.customProgramCacheKey = () => 'paperLanternInst';

  const haloDiscGeo = new THREE.PlaneGeometry(1, 1);
  haloDiscGeo.rotateX(-Math.PI / 2);
  const haloDiscMat = new THREE.MeshBasicMaterial({
    map: glowTex,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  ownGeo.push(lanternGeo, haloDiscGeo);
  ownMat.push(lanternMat, haloDiscMat);

  const lanternMesh = new THREE.InstancedMesh(lanternGeo, lanternMat, MAX_LANTERNS);
  const lanternGlowMesh = new THREE.InstancedMesh(haloDiscGeo, haloDiscMat, MAX_LANTERNS);
  lanternMesh.frustumCulled = lanternGlowMesh.frustumCulled = false;
  lanternMesh.renderOrder = 6;
  lanternGlowMesh.renderOrder = 5;
  lanternMesh.count = 0;
  lanternGlowMesh.count = 0;
  // khởi tạo instanceColor để three.js bật USE_INSTANCING_COLOR ngay từ đầu
  for (let i = 0; i < MAX_LANTERNS; i++) {
    lanternMesh.setColorAt(i, tmpC.setHex(0xffb85c));
    lanternGlowMesh.setColorAt(i, tmpC.setHex(0xffb85c));
  }
  group.add(lanternMesh, lanternGlowMesh);

  const lanterns: LanternEntry[] = [];
  const rLan = rng(512);

  function addLanternInternal(l: { id: string; color: string; mine: boolean }, birth = 1): void {
    const col = new THREE.Color(l.color || '#ffb347');
    const existing = lanterns.find((e) => e.id === l.id);
    if (existing) {
      existing.color.copy(col);
      existing.mine = l.mine;
      return;
    }
    if (lanterns.length >= MAX_LANTERNS) {
      const idx = lanterns.findIndex((e) => !e.mine);
      lanterns.splice(idx >= 0 ? idx : 0, 1);
    }
    lanterns.push({
      id: l.id,
      color: col,
      mine: l.mine,
      angle: l.mine ? (rLan() - 0.5) * 0.7 : rLan() * TAU, // đèn của mình xuất phát gần bờ đông rồi trôi dần
      radFrac: l.mine ? 0.66 - rLan() * 0.14 : 0.16 + 0.66 * Math.sqrt(rLan()),
      speed: (0.045 + rLan() * 0.04) * (rLan() > 0.25 ? 1 : -1),
      wobble: rLan() * TAU,
      birth,
    });
  }

  // thả sẵn vài ngọn hoa đăng mẫu lung linh trên mặt ao
  const seedCols = ['#ffb347', '#ff85ad', '#ffd966', '#ff9a62', '#f7a8d8', '#ffe28a'];
  for (let i = 0; i < 6; i++) {
    addLanternInternal({ id: `seed-${i}`, color: seedCols[i], mine: false }, 1);
  }

  const pondLight = new THREE.PointLight(0xffad58, 0, 20, 1.6);
  pondLight.position.set(LOTUS_POND.cx + 1.5, 2.2, LOTUS_POND.cz);
  group.add(pondLight);

  // ─────────────────── 4. HỒ PHÓNG SINH & BẾN GỖ (`RELEASE_POND`) ───────────────────
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * TAU;
    const px = RELEASE_POND.cx + Math.cos(a) * (RELEASE_POND.rx + 0.4 + (rRock() - 0.5) * 0.32);
    const pz = RELEASE_POND.cz + Math.sin(a) * (RELEASE_POND.rz + 0.4 + (rRock() - 0.5) * 0.32);
    // chừa bến gỗ phía tây (px < 13.5, |pz - 14| < 1.8)
    if (Math.abs(pz - RELEASE_POND.cz) < 1.85 && px < RELEASE_POND.cx - 4.5) continue;
    const rx = 0.4 + rRock() * 0.45, ry = 0.19 + rRock() * 0.22, rz = 0.38 + rRock() * 0.42;
    bBank.add(
      jitter(new THREE.IcosahedronGeometry(1, 1), 0.26, i + 70),
      m.stone,
      xf(px, ry * 0.45, pz, rRock() * TAU, rx, ry, rz),
      rockCols[(i + 2) % rockCols.length],
      true,
    );
  }

  // Đảo đá nhỏ giữa hồ phóng sinh + rùa phơi nắng + cụm lau sậy bờ đông
  bBank.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.24, 91), m.stone, xf(22.6, 0.16, 12.6, 0.5, 1.35, 0.32, 1.05), 0x7b786c, true);
  bBank.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.24, 92), m.stone, xf(23.4, 0.28, 12.3, 1.4, 0.72, 0.46, 0.65), 0x8a8579, true);
  turtle(bBank, m, 22.3, 0.32, 12.8, 0.36, -0.7);
  turtle(bBank, m, 23.0, 0.26, 13.1, 0.28, -1.2);
  turtle(bBank, m, 18.2, 0.12, 18.8, 0.34, 2.4);

  // khóm thuỷ trúc / cỏ lau ven hồ phóng sinh
  for (const [rx, rz] of [[26.8, 11.2], [27.4, 15.8], [23.8, 19.2], [17.0, 8.2]] as const) {
    bush(bSoft, m, rx, rz, 0.85, 0x4c8a3d);
    for (let k = 0; k < 7; k++) {
      const ox = (rRock() - 0.5) * 0.8, oz = (rRock() - 0.5) * 0.8, hh = 0.9 + rRock() * 0.7;
      bSoft.cyl(m.foliage, 0.016, 0.022, hh, 5, rx + ox, 0.05, rz + oz, 0x5c9640);
      bSoft.cyl(m.bark, 0.035, 0.035, 0.18, 6, rx + ox, hh - 0.12, rz + oz, 0x7a4e2d);
    }
  }

  // Bến phóng sinh bằng gỗ ấm áp phía tây hồ (x = 11.35 .. 15.35, z = 14)
  {
    const pz = RELEASE_POND.cz;
    const deckY = 0.3;
    // bậc đá dẫn lên cầu gỗ ở x=11.35
    bBank.box(m.stone, 0.85, 0.16, 2.6, 11.35, 0, pz, 0, 0xb0aaa0);
    // mặt sàn ván gỗ ghép thanh
    for (let i = 0; i < 11; i++) {
      const px = 11.8 + i * 0.34;
      bBank.box(m.wood, 0.3, 0.07, 2.38, px, deckY - 0.07, pz, 0, i % 2 ? 0x8f623d : 0x825735);
    }
    // dầm dọc & cột cọc gỗ cắm xuống nước + lan can dây thừng + 2 đèn lồng đầu bến
    bBank.box(m.darkWood, 3.85, 0.12, 0.14, 13.5, deckY - 0.18, pz - 1.05, 0, 0x5a3922);
    bBank.box(m.darkWood, 3.85, 0.12, 0.14, 13.5, deckY - 0.18, pz + 1.05, 0, 0x5a3922);
    const postXs = [11.9, 13.5, 15.15];
    for (const px of postXs) {
      for (const sz of [-1.1, 1.1]) {
        const postH = px > 15 ? 2.18 : 0.95;
        bBank.cyl(m.darkWood, 0.08, 0.09, postH + deckY, 8, px, 0, pz + sz, 0x5c3a24);
        bBank.sphere(m.gold, 0.075, px, deckY + postH + 0.04, pz + sz);
      }
    }
    for (const sz of [-1.1, 1.1]) {
      bBank.box(m.wood, 3.35, 0.055, 0.06, 13.52, deckY + 0.72, pz + sz, 0, 0xb89458);
    }
    // tay treo đèn lồng đỏ cao thoáng ở đầu cầu bến gỗ (x = 15.15)
    for (const sz of [-1.1, 1.1]) {
      bBank.box(m.darkWood, 0.45, 0.06, 0.06, 15.32, deckY + 2.1, pz + sz, 0, 0x5c3a24);
      hangingLantern(bBank, m, halos, 15.5, deckY + 2.08, pz + sz, 0.36, 0.22);
    }
    // giỏ tre đựng cá/chim phóng sinh đặt gọn bên mép cầu
    bBank.cyl(m.paint, 0.24, 0.2, 0.28, 10, 14.55, deckY, pz + 0.78, 0xc49a52);
    bBank.cyl(m.paint, 0.2, 0.18, 0.22, 10, 14.1, deckY, pz + 0.82, 0xb88c46);
    stoneLantern(bBank, m, halos, 10.8, 0, pz - 2.3, 0.88);
  }

  // ─────────────────── 5. ĐÀN CÁ KOI & CÁ CHÉP BƠI MƯỢT (2 hồ chung 1 InstancedMesh) ───────────────────
  const fishGeo = fishGeometry();
  const fishMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0.08 });
  fishMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = shared.uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         {
           #ifdef USE_INSTANCING
             float ph = instanceMatrix[3][0] * 1.7 + instanceMatrix[3][2] * 1.3;
           #else
             float ph = 0.0;
           #endif
           float tailWeight = smoothstep(0.08, -0.36, position.z);
           transformed.x += sin(uTime * 8.5 + ph + position.z * 11.0) * 0.055 * tailWeight;
         }`,
      );
  };
  fishMat.customProgramCacheKey = () => 'koiSwim';
  ownGeo.push(fishGeo);
  ownMat.push(fishMat);

  const TOTAL_KOI = KOI_LOTUS + KOI_RELEASE + RELEASE_FISH_CAP;
  const koiMesh = new THREE.InstancedMesh(fishGeo, fishMat, TOTAL_KOI);
  koiMesh.frustumCulled = false;
  koiMesh.renderOrder = 2; // vẽ trước mặt nước bán trong suốt để thấy cá dưới làn nước
  group.add(koiMesh);

  const koiColors = [0xf25c22, 0xffaa2b, 0xfaf6ee, 0xe63928, 0xffcc38, 0xf27935];
  const rKoi = rng(607);
  const koiOrbits: KoiOrbit[] = [];
  for (let i = 0; i < KOI_LOTUS + KOI_RELEASE; i++) {
    const isLotus = i < KOI_LOTUS;
    const P = isLotus ? LOTUS_POND : RELEASE_POND;
    koiOrbits.push({
      cx: P.cx + (rKoi() - 0.5) * 2.2,
      cz: P.cz + (rKoi() - 0.5) * 1.6,
      rx: (2.2 + rKoi() * (P.rx - 3.6)),
      rz: (1.6 + rKoi() * (P.rz - 2.8)),
      ang: rKoi() * TAU,
      speed: (0.22 + rKoi() * 0.2) * (i % 2 === 0 ? 1 : -1),
      lobe: i % 3 === 0 ? 2 : 1,
      scale: 0.78 + rKoi() * 0.45,
      phase: rKoi() * TAU,
    });
    tmpC.setHex(koiColors[i % koiColors.length]);
    koiMesh.setColorAt(i, tmpC);
  }
  const leapingFish: LeapingFish[] = [];
  for (let i = 0; i < RELEASE_FISH_CAP; i++) {
    leapingFish.push({ active: false, age: 0, dur: 2.6, x0: 0, z0: 0, x1: 0, z1: 0, splashed: false });
    tmpC.setHex(i % 2 === 0 ? 0xff9e2c : 0xf45525);
    koiMesh.setColorAt(KOI_LOTUS + KOI_RELEASE + i, tmpC);
  }
  if (koiMesh.instanceColor) koiMesh.instanceColor.needsUpdate = true;

  // ─────────────────── 6. ĐÀN CHIM PHÓNG SINH VỖ CÁNH BAY LÊN ───────────────────
  const birdGeo = birdGeometry();
  const birdMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, emissive: 0xffe6b0, emissiveIntensity: 0.22 });
  birdMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = shared.uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         {
           #ifdef USE_INSTANCING
             float bph = instanceMatrix[3][1] * 3.1 + instanceMatrix[3][0];
           #else
             float bph = 0.0;
           #endif
           float wing = abs(position.x);
           transformed.y += sin(uTime * 19.0 + bph) * wing * 0.65;
         }`,
      );
  };
  birdMat.customProgramCacheKey = () => 'birdFlap';
  ownGeo.push(birdGeo);
  ownMat.push(birdMat);

  const birdMesh = new THREE.InstancedMesh(birdGeo, birdMat, RELEASE_BIRD_CAP);
  birdMesh.frustumCulled = false;
  birdMesh.visible = false;
  group.add(birdMesh);
  const birds: FlyingBird[] = [];
  for (let i = 0; i < RELEASE_BIRD_CAP; i++) {
    birds.push({ active: false, age: 0, dur: 3.4, x0: 0, y0: 0, z0: 0, ang0: 0, radSpeed: 1, climb: 3.6 });
    tmpC.setHex(i % 3 === 0 ? 0xffe8a6 : 0xffffff);
    birdMesh.setColorAt(i, tmpC);
  }
  if (birdMesh.instanceColor) birdMesh.instanceColor.needsUpdate = true;

  // ─────────────────── 7. VÒNG GỢN SÓNG NƯỚC (splash / release / lanternLaunch / lotusBloom) ───────────────────
  const rippleGeo = new THREE.RingGeometry(0.84, 1.0, 36);
  rippleGeo.rotateX(-Math.PI / 2);
  ownGeo.push(rippleGeo);
  const ripples: RippleSlot[] = [];
  for (let i = 0; i < 10; i++) {
    const rm = new THREE.MeshBasicMaterial({
      color: 0xdff8ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
    });
    ownMat.push(rm);
    const mesh = new THREE.Mesh(rippleGeo, rm);
    mesh.visible = false;
    mesh.renderOrder = 8;
    group.add(mesh);
    ripples.push({ mesh, mat: rm, age: -1, maxAge: 1.6, maxR: 2.2 });
  }
  let rippleHead = 0;

  function spawnRipple(x: number, z: number, color: THREE.ColorRepresentation = 0xdff8ff, maxR = 2.0): void {
    const s = ripples[rippleHead];
    rippleHead = (rippleHead + 1) % ripples.length;
    s.age = 0;
    s.maxAge = 1.35 + maxR * 0.22;
    s.maxR = maxR;
    s.mat.color.set(color);
    s.mesh.position.set(x, WATER_Y + 0.016, z);
    s.mesh.scale.setScalar(0.15);
    s.mesh.visible = true;
  }

  const cPinkA = new THREE.Color(1.0, 0.72, 0.86);
  const cGoldA = new THREE.Color(1.0, 0.86, 0.45);
  const cAqua = new THREE.Color(0.75, 0.96, 1.0);

  return {
    group,
    lotusStepPos: new THREE.Vector3(-13.2, WATER_Y + 0.05, LOTUS_POND.cz),
    releasePierPos: new THREE.Vector3(15.2, 0.35, RELEASE_POND.cz),
    addLantern(l): void {
      addLanternInternal(l, 0.01);
      spawnRipple(-13.5, LOTUS_POND.cz, l.color || 0xffc468, 2.2);
    },
    spawnRipple,
    triggerLotusBloom(at): void {
      bloomPulse = 1.0;
      const bx = at?.x ?? -16.2, bz = at?.z ?? 14.0;
      spawnRipple(bx, bz, 0xff9ec4, 3.8);
      spawnRipple(bx, bz, 0xffe082, 2.4);
      for (let i = 0; i < 32; i++) {
        const a = Math.random() * TAU, sp = 0.5 + Math.random() * 1.6;
        sparks.spawn(
          bx + Math.cos(a) * 0.5, WATER_Y + 0.25, bz + Math.sin(a) * 0.5,
          Math.cos(a) * sp, 1.1 + Math.random() * 1.4, Math.sin(a) * sp,
          1.4 + Math.random() * 0.8, 0.16, 0.04,
          i % 2 ? cPinkA : cGoldA, cGoldA, 0.9, 0.35, 0.9, 1, 0.35,
        );
      }
    },
    triggerRelease(at): void {
      const rx = at?.x ?? 15.2, rz = at?.z ?? RELEASE_POND.cz;
      // 1) thả cá chép phóng vọt từ đầu bến xuống mặt nước rồi bơi toả ra lòng hồ
      for (let i = 0; i < RELEASE_FISH_CAP; i++) {
        const f = leapingFish[i];
        f.active = true;
        f.age = -i * 0.11;
        f.dur = 2.6 + Math.random() * 0.6;
        f.x0 = rx + 0.2;
        f.z0 = rz + (i - 2.5) * 0.35;
        const a = (Math.random() - 0.5) * 1.5;
        const dist = 4.2 + Math.random() * 4.5;
        f.x1 = clamp(rx + Math.cos(a) * dist, RELEASE_POND.cx - 6.5, RELEASE_POND.cx + 6.8);
        f.z1 = clamp(rz + Math.sin(a) * dist, RELEASE_POND.cz - 4.8, RELEASE_POND.cz + 4.8);
        f.splashed = false;
      }
      // 2) đàn chim vỗ cánh bay xoắn ốc lên bầu trời kèm ánh lấp lánh
      birdMesh.visible = true;
      for (let i = 0; i < RELEASE_BIRD_CAP; i++) {
        const bd = birds[i];
        bd.active = true;
        bd.age = -i * 0.09;
        bd.dur = 3.5 + Math.random() * 0.7;
        bd.x0 = rx - 0.3 + (Math.random() - 0.5) * 0.8;
        bd.y0 = 0.75 + Math.random() * 0.3;
        bd.z0 = rz + (Math.random() - 0.5) * 1.0;
        bd.ang0 = (i / RELEASE_BIRD_CAP) * TAU;
        bd.radSpeed = 1.4 + Math.random() * 0.7;
        bd.climb = 3.4 + Math.random() * 1.3;
      }
      spawnRipple(rx + 1.1, rz, 0xffe28a, 2.8);
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * TAU;
        sparks.spawn(
          rx, 0.7, rz,
          Math.cos(a) * 1.3, 1.6 + Math.random() * 2.0, Math.sin(a) * 1.3,
          1.3 + Math.random() * 0.7, 0.14, 0.03, cGoldA, cAqua, 0.9, 0.2, 0.8, 1, 0.3,
        );
      }
    },
    update(dt: number, t: number, night: number, lightsOn: boolean): void {
      // cập nhật cụm sen nở hero
      if (bloomPulse > 0) {
        bloomPulse = Math.max(0, bloomPulse - dt * 0.55);
      }
      const hs = 1 + 0.24 * Math.sin(bloomPulse * Math.PI);
      heroGroup.scale.setScalar(hs);
      heroGroup.rotation.y = Math.sin(t * 0.5) * 0.08 + bloomPulse * 0.35;

      // cập nhật cá koi 2 hồ
      for (let i = 0; i < koiOrbits.length; i++) {
        const k = koiOrbits[i];
        const a = k.ang + t * k.speed;
        const a2 = a * k.lobe + k.phase;
        const x = k.cx + Math.cos(a) * k.rx;
        const z = k.cz + Math.sin(a2) * k.rz * (k.lobe === 2 ? 0.62 : 1);
        const vx = -Math.sin(a) * k.rx * k.speed;
        const vz = Math.cos(a2) * k.rz * (k.lobe === 2 ? 0.62 : 1) * k.speed * k.lobe;
        dummy.position.set(x, WATER_Y - 0.042 + Math.sin(t * 2.2 + k.phase) * 0.008, z);
        dummy.rotation.set(0, Math.atan2(vx, vz), 0);
        dummy.scale.setScalar(k.scale);
        dummy.updateMatrix();
        koiMesh.setMatrixAt(i, dummy.matrix);
      }
      // cá phóng sinh phóng vọt xuống nước rồi bơi đi
      const baseLeap = KOI_LOTUS + KOI_RELEASE;
      for (let i = 0; i < RELEASE_FISH_CAP; i++) {
        const f = leapingFish[i];
        const idx = baseLeap + i;
        if (!f.active) {
          dummy.position.set(0, -20, 0);
          dummy.scale.setScalar(0.001);
          dummy.updateMatrix();
          koiMesh.setMatrixAt(idx, dummy.matrix);
          continue;
        }
        f.age += dt;
        if (f.age < 0) {
          dummy.position.set(0, -20, 0);
          dummy.scale.setScalar(0.001);
          dummy.updateMatrix();
          koiMesh.setMatrixAt(idx, dummy.matrix);
          continue;
        }
        const u = f.age / f.dur;
        if (u >= 1) {
          f.active = false;
          continue;
        }
        if (u < 0.32) {
          // quỹ đạo parabol phóng từ bến xuống mặt hồ
          const p = u / 0.32;
          const x = f.x0 + (f.x1 - f.x0) * 0.32 * p;
          const z = f.z0 + (f.z1 - f.z0) * 0.32 * p;
          const y = 0.42 * (1 - p) + WATER_Y * p + Math.sin(p * Math.PI) * 0.68;
          const pitch = (p - 0.5) * 1.3;
          dummy.position.set(x, y, z);
          dummy.rotation.set(pitch, Math.atan2(f.x1 - f.x0, f.z1 - f.z0), 0);
          dummy.scale.setScalar(0.95);
        } else {
          if (!f.splashed) {
            f.splashed = true;
            const sx = f.x0 + (f.x1 - f.x0) * 0.32, sz = f.z0 + (f.z1 - f.z0) * 0.32;
            spawnRipple(sx, sz, 0xdff8ff, 1.8);
            for (let q = 0; q < 6; q++) {
              const aa = Math.random() * TAU;
              sparks.spawn(sx, WATER_Y + 0.04, sz, Math.cos(aa) * 0.7, 1.2 + Math.random() * 0.8, Math.sin(aa) * 0.7, 0.55, 0.09, 0.02, cAqua, null, 0.85, 3.2, 0.5, 0, 0);
            }
          }
          const p = (u - 0.32) / 0.68;
          const x = f.x0 + (f.x1 - f.x0) * (0.32 + 0.68 * p);
          const z = f.z0 + (f.z1 - f.z0) * (0.32 + 0.68 * p);
          dummy.position.set(x, WATER_Y - 0.04, z);
          dummy.rotation.set(0, Math.atan2(f.x1 - f.x0, f.z1 - f.z0), 0);
          dummy.scale.setScalar(0.95 * (1 - Math.max(0, (p - 0.7) / 0.3)));
        }
        dummy.updateMatrix();
        koiMesh.setMatrixAt(idx, dummy.matrix);
      }
      koiMesh.instanceMatrix.needsUpdate = true;

      // cập nhật chim phóng sinh bay lên trời
      let anyBird = false;
      for (let i = 0; i < RELEASE_BIRD_CAP; i++) {
        const bd = birds[i];
        if (!bd.active) {
          dummy.position.set(0, -20, 0);
          dummy.scale.setScalar(0.001);
          dummy.updateMatrix();
          birdMesh.setMatrixAt(i, dummy.matrix);
          continue;
        }
        bd.age += dt;
        if (bd.age < 0) {
          anyBird = true;
          dummy.position.set(0, -20, 0);
          dummy.scale.setScalar(0.001);
          dummy.updateMatrix();
          birdMesh.setMatrixAt(i, dummy.matrix);
          continue;
        }
        const u = bd.age / bd.dur;
        if (u >= 1) {
          bd.active = false;
          continue;
        }
        anyBird = true;
        const ang = bd.ang0 + bd.age * 1.35;
        const rad = 0.5 + bd.age * bd.radSpeed;
        const bx = bd.x0 + Math.cos(ang) * rad;
        const bz = bd.z0 + Math.sin(ang) * rad;
        const by = bd.y0 + bd.age * bd.climb;
        const vx = -Math.sin(ang) * rad * 1.35 + Math.cos(ang) * bd.radSpeed;
        const vz = Math.cos(ang) * rad * 1.35 + Math.sin(ang) * bd.radSpeed;
        dummy.position.set(bx, by, bz);
        dummy.rotation.set(-0.28, Math.atan2(vx, vz), 0.22);
        dummy.scale.setScalar(1.05 * (1 - Math.max(0, (u - 0.78) / 0.22)));
        dummy.updateMatrix();
        birdMesh.setMatrixAt(i, dummy.matrix);
        if (Math.random() < dt * 7) {
          sparks.spawn(bx, by, bz, 0, -0.2, 0, 0.65, 0.1, 0.02, cGoldA, null, 0.75, 0.2, 0.5, 1, 0.1);
        }
      }
      birdMesh.visible = anyBird;
      if (anyBird) birdMesh.instanceMatrix.needsUpdate = true;

      // cập nhật đèn hoa đăng trôi + phát sáng trên mặt nước Ao Sen (giữ sắc màu ấm bão hoà ban đêm)
      lanternMesh.count = lanterns.length;
      lanternGlowMesh.count = lanterns.length;
      lanternMat.emissiveIntensity = 0.28 + night * 0.55;
      haloDiscMat.opacity = 0.28 + night * 0.55;

      for (let i = 0; i < lanterns.length; i++) {
        const l = lanterns[i];
        l.birth = Math.min(1, l.birth + dt * 1.8);
        l.angle += l.speed * dt;
        // đèn của mình từ từ trôi từ mép bờ vào quỹ đạo cân bằng trên mặt hồ
        if (l.mine && l.radFrac > 0.46) l.radFrac = Math.max(0.46, l.radFrac - dt * 0.04);
        const rf = l.radFrac + 0.04 * Math.sin(t * 0.4 + l.wobble);
        const lx = LOTUS_POND.cx + Math.cos(l.angle) * (LOTUS_POND.rx - 1.1) * rf;
        const lz = LOTUS_POND.cz + Math.sin(l.angle) * (LOTUS_POND.rz - 0.9) * rf;
        const bob = Math.sin(t * 2.1 + l.wobble) * 0.012;
        const sc = (l.mine ? 1.34 : 0.95) * (0.3 + 0.7 * l.birth);

        dummy.position.set(lx, WATER_Y + 0.01 + bob, lz);
        dummy.rotation.set(Math.sin(t * 1.6 + l.wobble) * 0.04, l.angle * 0.7 + l.wobble, Math.cos(t * 1.4 + l.wobble) * 0.04);
        dummy.scale.setScalar(sc);
        dummy.updateMatrix();
        lanternMesh.setMatrixAt(i, dummy.matrix);

        // đèn của bản thân (`mine`) sáng rực rỡ và quầng nước rộng hơn nhưng vẫn giữ rõ màu sắc cánh sen
        const hsl = { h: 0, s: 0, l: 0 };
        l.color.getHSL(hsl);
        tmpC.setHSL(hsl.h, Math.min(1, hsl.s * 1.25 + 0.2), clamp(hsl.l, 0.44, 0.58));
        if (l.mine) tmpC.multiplyScalar(1.28);
        lanternMesh.setColorAt(i, tmpC);

        const flicker = 0.92 + 0.08 * Math.sin(t * 9.0 + l.wobble * 3.0);
        dummy.position.set(lx, WATER_Y + 0.008, lz);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar((l.mine ? 1.85 : 1.18) * flicker * l.birth);
        dummy.updateMatrix();
        lanternGlowMesh.setMatrixAt(i, dummy.matrix);
        lanternGlowMesh.setColorAt(i, tmpC);
      }
      if (lanterns.length > 0) {
        lanternMesh.instanceMatrix.needsUpdate = true;
        lanternGlowMesh.instanceMatrix.needsUpdate = true;
        if (lanternMesh.instanceColor) lanternMesh.instanceColor.needsUpdate = true;
        if (lanternGlowMesh.instanceColor) lanternGlowMesh.instanceColor.needsUpdate = true;
      }

      // vòng sóng nước lan toả
      for (const rp of ripples) {
        if (rp.age < 0) continue;
        rp.age += dt;
        const k = rp.age / rp.maxAge;
        if (k >= 1) {
          rp.age = -1;
          rp.mesh.visible = false;
          continue;
        }
        rp.mesh.scale.setScalar(0.18 + (1 - Math.pow(1 - k, 2)) * rp.maxR);
        rp.mat.opacity = Math.min(1, k * 6) * Math.pow(1 - k, 1.5) * 0.65;
      }

      const lanternFactor = clamp(lanterns.length / 18, 0.25, 1.3);
      pondLight.intensity = lightsOn ? (night * 4.5 * lanternFactor + bloomPulse * 14) : bloomPulse * 10;
      pondLight.visible = pondLight.intensity > 0.05;
    },
    dispose(): void {
      for (const g of ownGeo) g.dispose();
      for (const mt of ownMat) mt.dispose();
    },
  };
}
