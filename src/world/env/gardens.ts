/**
 * Ba khu vườn tịnh tâm quanh chùa:
 * 1. Sân Thiền (`CUSHION_CENTER = (28, 4)`): sỏi cào vân tròn đồng tâm, 8 bồ đoàn gấm đỏ-vàng đặt đúng `cushionSlot(0..7)`,
 *    cụm đá rêu Thiền tông, tùng bonsai tầng mây, đèn đá, rặng trúc đông.
 * 2. Vườn Quan Thế Âm (`statue-base` quanh (28.5, -16.8)): đài sen & hòn non bộ Phổ Đà, tượng Quan Thế Âm ngọc trắng
 *    cầm bình cam lồ & cành dương liễu, hào quang vàng phát sáng, hồ sen nhỏ, vườn hoa, đèn đá.
 * 3. Giếng Ngọc (`WELL = (-30, -26)`) + Suối Ngọc chảy uốn lượn về Ao Sen + Cầu đá nhỏ bắc ngang suối, hòn non bộ & rừng trúc.
 */
import * as THREE from 'three';
import { BLOCKS, CUSHION_CENTER, CUSHION_COUNT, cushionSlot, WELL } from '@/world/layout';
import { Batch, floorGeo, jitter, rng, type SharedUniforms, TAU, xf } from './core';
import { hangingLantern, stoneLantern } from './courtyard';
import { addLotus, bambooClump, bonsai, bush, flowerBed, pineBonsai } from './flora';
import { ZEN_RADIUS } from './ground';
import type { Mats } from './materials';
import type { HaloSpec, ParticleField } from './particles';
import { buildRoof } from './roof';
import type { SkyRig } from './sky';
import { guanyin } from './statues';
import { plaqueTexture } from './textures';

const STATUE_BLOCK = BLOCKS.find((b) => b.name === 'statue-base')!;
const WELL_BLOCK = BLOCKS.find((b) => b.name === 'well-base')!;

export interface GardensPart {
  group: THREE.Group;
  wellPos: THREE.Vector3;
  quanAmPos: THREE.Vector3;
  zenPos: THREE.Vector3;
  update(dt: number, t: number, night: number, lightsOn: boolean): void;
  dispose(): void;
}

/** Hình học dải suối uốn lượn dọc theo đường cong 3D, có UV (u ngang bờ, v dọc dòng chảy). */
function streamRibbonGeometry(curve: THREE.Curve<THREE.Vector3>, segs: number, halfWidth: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const p = new THREE.Vector3();
  const tan = new THREE.Vector3();
  const side = new THREE.Vector3();
  let distAcc = 0;
  const prev = curve.getPointAt(0);

  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    curve.getPointAt(t, p);
    if (i > 0) distAcc += p.distanceTo(prev);
    prev.copy(p);
    curve.getTangentAt(t, tan);
    side.set(-tan.z, 0, tan.x).normalize();
    // rộng hơn một chút ở khúc đổ vào Ao Sen
    const hw = halfWidth * (0.85 + 0.35 * t);
    pos.push(
      p.x - side.x * hw, p.y, p.z - side.z * hw,
      p.x + side.x * hw, p.y, p.z + side.z * hw,
    );
    uv.push(0, distAcc * 0.38, 1, distAcc * 0.38);
    if (i < segs) {
      const k = i * 2;
      idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function buildGardens(
  m: Mats,
  shared: SharedUniforms,
  sky: SkyRig,
  glowTex: THREE.Texture,
  halos: HaloSpec[],
  sparks: ParticleField,
  bMain: Batch,
  bDeco: Batch,
): GardensPart {
  const group = new THREE.Group();
  group.name = 'gardens';
  const ownGeo: THREE.BufferGeometry[] = [];
  const ownMat: THREE.Material[] = [];
  const ownTex: THREE.Texture[] = [];

  const r = rng(809);

  // ═══════════════════ 1. SÂN THIỀN (`CUSHION_CENTER = (28, 4)`) ═══════════════════
  {
    const zx = CUSHION_CENTER.x, zz = CUSHION_CENTER.z;
    // Viền đá cuội tròn quanh sân sỏi thiền (chừa lối vào phía tây quanh góc π)
    const rimN = 56;
    for (let i = 0; i < rimN; i++) {
      const a = (i / rimN) * TAU;
      // lối vào từ (21, 4) → góc quanh π (±0.28 rad)
      if (Math.abs(Math.atan2(Math.sin(a - Math.PI), Math.cos(a - Math.PI))) < 0.28) continue;
      const px = zx + Math.cos(a) * (ZEN_RADIUS + 0.15);
      const pz = zz + Math.sin(a) * (ZEN_RADIUS + 0.15);
      bMain.add(
        jitter(new THREE.IcosahedronGeometry(1, 1), 0.24, i + 15),
        m.stone,
        xf(px, 0.12, pz, r() * TAU, 0.42 + r() * 0.18, 0.18 + r() * 0.1, 0.36 + r() * 0.15),
        i % 2 ? 0x9b958a : 0x858076,
        true,
      );
    }
    // Phiến đá bước dạo ở cửa vào sân thiền phía tây
    for (let i = 0; i < 3; i++) {
      bDeco.cyl(m.stone, 0.46, 0.5, 0.035, 10, zx - ZEN_RADIUS - 0.55 + i * 0.85, 0.005, zz + (i % 2 ? 0.12 : -0.12), 0xb4aea2);
    }
    // Hoa văn đá hoa sen phẳng chính tâm sân thiền + gờ sóng sỏi nổi dịu (cao 2cm, đi qua thoải mái)
    bDeco.cyl(m.stoneDark, 0.92, 0.96, 0.024, 16, zx, 0.004, zz, 0x8c867c);
    bDeco.cyl(m.stone, 0.72, 0.74, 0.03, 16, zx, 0.008, zz, 0xc8c2b4);
    bDeco.add(new THREE.TorusGeometry(0.52, 0.03, 5, 24), m.gold, xf(zx, 0.038, zz, 0, 1, 1, 1, Math.PI / 2), 0xdab054);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * TAU;
      bDeco.add(new THREE.SphereGeometry(1, 6, 5), m.stone, xf(zx + Math.cos(a) * 0.32, 0.036, zz + Math.sin(a) * 0.32, -a, 0.18, 0.02, 0.09), 0xe2dcd0);
    }
    for (const rad of [1.85, 3.05, 5.38]) {
      bDeco.add(new THREE.TorusGeometry(rad, 0.042, 5, 48), m.paint, xf(zx, 0.008, zz, 0, 1, 1, 0.35, Math.PI / 2), 0xded7c5);
    }

    // 8 BỒ ĐOÀN TRÒN ĐỎ-VÀNG ĐÚNG TOẠ ĐỘ `cushionSlot(0..7)`
    for (let i = 0; i < CUSHION_COUNT; i++) {
      const slot = cushionSlot(i);
      const cx = slot.pos.x, cz = slot.pos.z;
      // chiếu cói tròn lót dưới
      bDeco.cyl(m.paint, 0.64, 0.66, 0.022, 20, cx, 0.004, cz, 0xcab078);
      bDeco.add(new THREE.TorusGeometry(0.64, 0.018, 5, 22), m.paint, xf(cx, 0.022, cz, 0, 1, 1, 1, Math.PI / 2), 0xa88b52);
      // thân bồ đoàn gấm đỏ sơn mài phồng êm + đường viền chỉ vàng + hoa sen thêu giữa
      bMain.add(new THREE.SphereGeometry(1, 18, 10), m.paint, xf(cx, 0.085, cz, slot.face, 0.46, 0.095, 0.46), 0xbe2e24);
      bDeco.add(new THREE.TorusGeometry(0.41, 0.018, 5, 20), m.gold, xf(cx, 0.145, cz, 0, 1, 1, 1, Math.PI / 2), 0xf0c252);
      bDeco.cyl(m.gold, 0.14, 0.15, 0.018, 12, cx, 0.165, cz, 0xf4ca64);
    }

    // Cụm đá cảnh Thiền tông (karesansui), cây tùng bonsai tầng mây & đèn đá quanh vành ngoài (tránh hoàn toàn Hồ Phóng Sinh)
    const zenRocks: [number, number, number][] = [
      [zx + 5.1, zz - 4.1, 1.0],
      [zx + 5.2, zz + 3.9, 0.92],
      [zx - 2.1, zz - 6.3, 0.88],
    ];
    zenRocks.forEach(([rx, rz, sc], idx) => {
      bMain.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.28, idx + 60), m.stoneDark, xf(rx, 0.42 * sc, rz, idx, 0.68 * sc, 0.78 * sc, 0.56 * sc), 0x6f6c64, true);
      bMain.add(jitter(new THREE.IcosahedronGeometry(1, 1), 0.25, idx + 70), m.stone, xf(rx + 0.52 * sc, 0.22 * sc, rz + 0.25 * sc, idx + 1, 0.44 * sc, 0.38 * sc, 0.4 * sc), 0x878379, true);
      bDeco.sphere(m.foliage, 0.48 * sc, rx - 0.15 * sc, 0.08, rz + 0.15 * sc, 1.2, 0.22, 1.1, 0x4b7d3b, 8);
    });

    pineBonsai(bMain, m, zx + 6.5, zz - 2.7, 1.06, 3);
    pineBonsai(bMain, m, zx + 6.4, zz + 2.8, 1.02, 7);
    stoneLantern(bMain, m, halos, zx - ZEN_RADIUS - 0.55, 0, zz - 2.05, 0.88);
    stoneLantern(bMain, m, halos, zx - ZEN_RADIUS - 0.55, 0, zz + 2.05, 0.88);
    stoneLantern(bMain, m, halos, zx + 6.9, 0, zz, 0.96);

    bambooClump(bMain, m, zx + 9.2, zz - 4.5, 9, 6.2, 41);
    bambooClump(bMain, m, zx + 9.6, zz + 0.5, 10, 6.6, 42);
    bambooClump(bMain, m, zx + 9.0, zz + 5.2, 9, 6.0, 43);
  }

  // ═══════════════════ 2. VƯỜN QUAN THẾ ÂM (`statue-base` quanh 28.5, -16.8) ═══════════════════
  const qx = (STATUE_BLOCK.x0 + STATUE_BLOCK.x1) / 2; // 28.5
  const qz = (STATUE_BLOCK.z0 + STATUE_BLOCK.z1) / 2; // -16.75
  const qFace = -0.32; // hướng SSW về phía điểm lễ (28, -14) và góc camera quanam
  const qAureole = new THREE.Mesh(
    new THREE.CircleGeometry(2.15, 40),
    new THREE.MeshBasicMaterial({
      map: glowTex,
      color: 0xffe296,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
    }),
  );
  ownGeo.push(qAureole.geometry);
  ownMat.push(qAureole.material as THREE.Material);
  {
    // Hồ nước sen nhỏ & đài đá bát giác 2 bậc nằm gọn trong `statue-base` (x: 26..31, z: -19..-14.5)
    bMain.cyl(m.stoneDark, 2.38, 2.48, 0.24, 8, qx, 0, qz, 0x7c776e, Math.PI / 8);
    bDeco.cyl(m.jade, 2.18, 2.18, 0.04, 24, qx, 0.22, qz, 0x2f7f78); // mặt nước ngọc dưới chân đài
    bMain.cyl(m.stone, 1.78, 1.92, 0.52, 8, qx, 0.24, qz, 0xb8b2a6, Math.PI / 8);
    bMain.cyl(m.gold, 1.82, 1.82, 0.05, 8, qx, 0.74, qz, 0xe8bc52, Math.PI / 8);
    bMain.cyl(m.stone, 1.42, 1.54, 0.5, 16, qx, 0.76, qz, 0xcac4b8);
    bMain.cyl(m.gold, 1.45, 1.45, 0.05, 16, qx, 1.24, qz, 0xf0c65e);

    // Gềnh đá non bộ Phổ Đà phía sau lưng tượng (z ≈ -18.2..-17.4)
    const grottoRocks: [number, number, number, number, number][] = [
      [-1.55, 0.9, -1.35, 0.95, 1.6],
      [1.55, 0.85, -1.25, 0.9, 1.5],
      [-0.75, 1.2, -1.65, 1.0, 2.1],
      [0.8, 1.15, -1.6, 0.95, 2.0],
      [0.0, 1.45, -1.78, 1.15, 2.45],
    ];
    grottoRocks.forEach(([ox, oy, oz, rad, sy], idx) => {
      bMain.add(
        jitter(new THREE.IcosahedronGeometry(1, 1), 0.28, idx + 110),
        m.stoneDark,
        xf(qx + ox, oy, qz + oz, idx, rad, sy, rad * 0.75),
        idx % 2 ? 0x76736b : 0x868279,
        true,
      );
    });

    // Hoa sen nở quanh hồ nước chân đài Quan Âm
    for (let i = 0; i < 7; i++) {
      const a = -0.7 + (i / 6) * 1.9;
      const lx = qx + Math.sin(a) * 1.98, lz = qz + Math.cos(a) * 1.98;
      addLotus(bDeco, m.paintDouble, lx, 0.26, lz, 0.44, 0.92, i % 2 ? 0xffd2e0 : 0xffffff, 0xf28eb0, a);
    }

    // Tượng Quan Thế Âm Bồ Tát ngọc trắng đứng trên đài sen hồng
    const statueY = 1.26;
    const sc = 0.98;
    guanyin(bMain, m, qx, statueY, qz, sc, qFace);

    // Vòng hào quang vàng chạm tia sáng sau đầu Đức Quan Âm
    const haloY = statueY + 4.55 * sc;
    const backX = qx - Math.sin(qFace) * 0.42;
    const backZ = qz - Math.cos(qFace) * 0.42;
    bMain.add(new THREE.TorusGeometry(1.38, 0.05, 8, 40), m.gold, xf(backX, haloY, backZ, qFace), 0xffd66b);
    bMain.add(new THREE.TorusGeometry(1.02, 0.032, 6, 32), m.gold, xf(backX, haloY, backZ, qFace), 0xffe28a);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * TAU;
      const rx = Math.cos(a) * 1.56, ry2 = Math.sin(a) * 1.56;
      bMain.add(
        new THREE.ConeGeometry(0.065, 0.36, 5),
        m.gold,
        xf(backX + rx * Math.cos(qFace), haloY + ry2, backZ - rx * Math.sin(qFace), qFace, 1, 1, 1, 0, a - Math.PI / 2),
        0xffda72,
      );
    }
    qAureole.position.set(qx - Math.sin(qFace) * 0.36, haloY, qz - Math.cos(qFace) * 0.36);
    qAureole.rotation.y = qFace;
    qAureole.renderOrder = 6;
    group.add(qAureole);

    // Bàn hương đá nhỏ sát mép nam của đài (z = -14.78, nằm trong statue-base để người chơi đứng tại (28,-14) hành lễ)
    const ax = qx - 0.35, az = STATUE_BLOCK.z1 + 0.02;
    bMain.box(m.stone, 1.35, 0.72, 0.56, ax, 0, az - 0.3, qFace, 0xbab4a8);
    bMain.box(m.gold, 1.4, 0.04, 0.6, ax, 0.72, az - 0.3, qFace);
    bMain.cyl(m.bronze, 0.18, 0.14, 0.22, 12, ax, 0.76, az - 0.3);
    for (const side of [-0.46, 0.46]) {
      const vx = ax + Math.cos(qFace) * side, vz = az - 0.3 - Math.sin(qFace) * side;
      bMain.cyl(m.jade, 0.09, 0.07, 0.24, 10, vx, 0.76, vz, 0xeef5ee);
      addLotus(bDeco, m.paintDouble, vx, 1.02, vz, 0.32, 0.9, 0xffd0df, 0xf088ac);
    }

    // Đèn đá, bồn hoa sen cạn, bonsai & khóm trúc tôn nghiêm quanh vườn Quan Âm
    stoneLantern(bMain, m, halos, qx - 3.1, 0, qz + 2.2, 0.96);
    stoneLantern(bMain, m, halos, qx + 3.0, 0, qz + 1.6, 0.96);
    flowerBed(bDeco, m, qx - 4.2, qz - 0.5, 2.2, 1.3, 51, [0xf6a6c1, 0xffffff, 0xffe07d, 0xf282a8]);
    flowerBed(bDeco, m, qx + 4.1, qz - 0.8, 2.2, 1.3, 52, [0xf6a6c1, 0xffffff, 0xffe07d, 0xf282a8]);
    bonsai(bMain, m, qx - 4.15, qz + 2.85, 0.88, 31, true, 0xf296b4);
    bonsai(bMain, m, qx + 3.9, qz + 2.5, 0.88, 32, true, 0xebba34);
    bambooClump(bMain, m, qx + 4.6, qz - 3.4, 9, 6.4, 53);
    bambooClump(bMain, m, qx - 3.8, qz - 3.6, 8, 6.0, 54);
  }

  const quanAmLight = new THREE.PointLight(0xffe0a6, 12, 18, 1.6);
  quanAmLight.position.set(qx - 1.2, 4.8, qz + 2.4);
  group.add(quanAmLight);

  // ═══════════════════ 3. GIẾNG NGỌC (`WELL = (-30, -26)`) + SUỐI NGỌC + CẦU ĐÁ ═══════════════════
  const wx = (WELL_BLOCK.x0 + WELL_BLOCK.x1) / 2; // -29.75 (khớp WELL = -30, -26)
  const wz = (WELL_BLOCK.z0 + WELL_BLOCK.z1) / 2; // -25.75

  // Shader nước Giếng Ngọc & Suối Ngọc chảy uốn lượn về Ao Sen
  const streamCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(wx + 0.55, 0.08, wz + 2.15),
    new THREE.Vector3(-30.6, 0.08, -18.5),
    new THREE.Vector3(-29.6, 0.08, -12.0),
    new THREE.Vector3(-27.8, 0.08, -6.0),
    new THREE.Vector3(-25.6, 0.08, 1.5),
    new THREE.Vector3(-24.4, 0.08, 4.6),
    new THREE.Vector3(-22.8, 0.10, 8.6),
  ]);

  const streamMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      tNoise: { value: m.textures.noise },
      uTime: shared.uTime,
      uNight: shared.uNight,
      uSkyHor: { value: sky.getSample().hor },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWp;
      uniform float uTime;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        wp.y += sin(uv.y * 8.0 - uTime * 3.5) * 0.008;
        vWp = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform sampler2D tNoise;
      uniform float uTime, uNight;
      uniform vec3 uSkyHor;
      varying vec2 vUv;
      void main() {
        float flow = uTime * 0.42;
        float n1 = texture2D(tNoise, vec2(vUv.x * 1.4, vUv.y * 0.55 - flow)).r;
        float n2 = texture2D(tNoise, vec2(vUv.x * 2.6 + 0.3, vUv.y * 1.1 - flow * 1.45)).r;
        float foam = smoothstep(0.62, 0.88, (n1 + n2) * 0.5);
        float bank = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);

        vec3 jadeCol = mix(vec3(0.16, 0.56, 0.58), vec3(0.09, 0.38, 0.44), bank);
        jadeCol *= mix(1.08, 0.42, uNight);
        vec3 col = mix(jadeCol, uSkyHor * mix(0.85, 0.35, uNight), 0.24);
        col += vec3(0.75, 0.95, 0.92) * foam * mix(0.55, 0.25, uNight);
        // viền bọt trắng mỏng hai mép bờ đá
        float edgeFoam = (1.0 - smoothstep(0.04, 0.22, abs(vUv.x - 0.5) * 2.0)) * 0.0 + (1.0 - bank) * 0.35 * n2;
        col += vec3(0.8, 0.92, 0.9) * edgeFoam;

        float alpha = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x) * 0.86;
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  ownMat.push(streamMat);

  const streamGeo = streamRibbonGeometry(streamCurve, 68, 0.78);
  ownGeo.push(streamGeo);
  const streamMesh = new THREE.Mesh(streamGeo, streamMat);
  streamMesh.renderOrder = 4;
  group.add(streamMesh);

  // Mặt nước ngọc bích phát sáng dịu trong lòng Giếng Ngọc
  const wellWaterGeo = new THREE.CircleGeometry(0.88, 24);
  wellWaterGeo.rotateX(-Math.PI / 2);
  const wellWaterMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { tNoise: { value: m.textures.noise }, uTime: shared.uTime, uNight: shared.uNight },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform sampler2D tNoise; uniform float uTime, uNight; varying vec2 vUv;
      void main(){
        vec2 c = (vUv - 0.5) * 2.0;
        float d = length(c);
        float rip = sin(d * 18.0 - uTime * 2.6) * 0.5 + 0.5;
        float n = texture2D(tNoise, vUv * 2.2 + uTime * 0.04).r;
        vec3 col = mix(vec3(0.12, 0.68, 0.64), vec3(0.45, 0.95, 0.88), (1.0 - d) * 0.65 + rip * 0.2 * n);
        col *= mix(1.0, 0.75, uNight);
        gl_FragColor = vec4(col, 0.94);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  ownGeo.push(wellWaterGeo);
  ownMat.push(wellWaterMat);
  const wellWater = new THREE.Mesh(wellWaterGeo, wellWaterMat);
  wellWater.position.set(wx, 0.94, wz);
  group.add(wellWater);

  // Kiến trúc Giếng Ngọc + lầu che 4 cột mái cong + gầu gỗ + hòn non bộ + rừng trúc
  {
    const PY = 0.34;
    bMain.cyl(m.stoneDark, 2.25, 2.4, 0.16, 8, wx, 0, wz, 0x7c776e, Math.PI / 8);
    bMain.cyl(m.stone, 2.02, 2.16, PY - 0.16, 8, wx, 0.16, wz, 0xb2aca0, Math.PI / 8);
    bMain.add(floorGeo(3.6, 3.6, 2.0), m.paving, xf(wx, PY + 0.004, wz), 0xdad3c6);

    // thành giếng đá 6 cạnh chạm nổi hoa sen
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + Math.PI / 6;
      const nx = wx + Math.cos(a) * 0.96, nz = wz + Math.sin(a) * 0.96;
      bMain.box(m.stone, 1.08, 0.72, 0.22, nx, PY, nz, -a + Math.PI / 2, 0xbdb7aa);
      bMain.box(m.stoneDark, 0.76, 0.42, 0.25, nx, PY + 0.15, nz, -a + Math.PI / 2, 0x928c80);
      bMain.box(m.stone, 1.16, 0.1, 0.3, nx, PY + 0.72, nz, -a + Math.PI / 2, 0xcac4b8);
      // búp sen nhỏ trên mỗi góc thành giếng
      const ca = a + Math.PI / 6;
      bMain.sphere(m.stone, 0.09, wx + Math.cos(ca) * 1.06, PY + 0.88, wz + Math.sin(ca) * 1.06, 1, 1.25, 1, 0xd4cec2, 8);
    }
    // lòng giếng tối sâu bên dưới mặt nước
    bMain.cyl(m.stoneDark, 0.86, 0.86, 0.56, 12, wx, PY, wz, 0x26383a);

    // 4 cột gỗ sơn son đỡ mái ngói cong che giếng + trục quay gầu múc nước (mở rộng thoáng mặt giếng)
    const colOff = 1.56, colH = 2.82;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = wx + sx * colOff, pz = wz + sz * colOff;
      bMain.cyl(m.stone, 0.24, 0.28, 0.2, 10, px, PY, pz, 0xb8b2a6);
      bMain.cyl(m.lacquer, 0.16, 0.18, colH, 12, px, PY + 0.2, pz, 0xffffff);
      bMain.cyl(m.gold, 0.19, 0.19, 0.05, 10, px, PY + 0.2 + colH - 0.08, pz);
    }
    const beamY = PY + 0.2 + colH;
    bMain.box(m.lacquer, 3.42, 0.24, 0.22, wx, beamY - 0.16, wz - colOff, 0, 0xa82a20);
    bMain.box(m.lacquer, 3.42, 0.24, 0.22, wx, beamY - 0.16, wz + colOff, 0, 0xa82a20);
    bMain.box(m.lacquer, 0.22, 0.24, 3.42, wx - colOff, beamY - 0.16, wz, 0, 0xa82a20);
    bMain.box(m.lacquer, 0.22, 0.24, 3.42, wx + colOff, beamY - 0.16, wz, 0, 0xa82a20);
    buildRoof(bMain, m, wx, beamY + 0.04, wz, { W: 2.38, D: 2.34, rise: 1.56, bmax: 1, curve: 1.45, curl: 0.78, curlSize: 1.5, ridge: true, finial: true, rafters: true });

    // Trục tời gỗ, dây thừng & gầu gỗ treo trên miệng giếng
    bMain.add(new THREE.CylinderGeometry(0.08, 0.08, 3.1, 10), m.darkWood, xf(wx, PY + 1.85, wz, 0, 1, 1, 1, 0, Math.PI / 2), 0x623d24);
    bMain.cyl(m.paint, 0.014, 0.014, 0.78, 5, wx + 0.18, PY + 1.08, wz, 0xd8be86);
    bMain.cyl(m.wood, 0.16, 0.13, 0.24, 10, wx + 0.18, PY + 0.9, wz, 0x8f623d);
    bMain.add(new THREE.TorusGeometry(0.15, 0.015, 5, 12), m.bronze, xf(wx + 0.18, PY + 1.08, wz, 0, 1, 1, 1, Math.PI / 2));

    // Biển "GIẾNG NGỌC" treo phía đông hướng về lối vào (-26, -22), đặt dưới hàng rui
    const wellPlaque = plaqueTexture('GIẾNG NGỌC', { w: 512, h: 160 });
    ownTex.push(wellPlaque);
    const wpMat = new THREE.MeshStandardMaterial({ map: wellPlaque, roughness: 0.45, metalness: 0.15, emissive: 0xffbf68, emissiveMap: wellPlaque, emissiveIntensity: 0.16 });
    ownMat.push(wpMat);
    m.glow.push({ mat: wpMat, day: 0.12, night: 0.7 });
    const wpGeo = new THREE.PlaneGeometry(1.42, 0.42);
    ownGeo.push(wpGeo);
    const wpMesh = new THREE.Mesh(wpGeo, wpMat);
    wpMesh.position.set(wx + colOff + 0.14, beamY - 0.18, wz);
    wpMesh.rotation.y = Math.PI / 2;
    group.add(wpMesh);
    bMain.box(m.gold, 0.04, 0.5, 1.52, wx + colOff + 0.11, beamY - 0.43, wz);

    hangingLantern(bMain, m, halos, wx + 1.72, beamY, wz - 1.72, 0.4, 0.24);
    hangingLantern(bMain, m, halos, wx + 1.72, beamY, wz + 1.72, 0.4, 0.24);
    stoneLantern(bMain, m, halos, -26.8, 0, -24.2, 0.9);

    // Hòn non bộ lớn tựa sơn phía tây-bắc Giếng Ngọc + dòng nước đầu nguồn chảy ra suối
    const rockery: [number, number, number, number, number][] = [
      [wx - 2.6, 1.1, wz - 1.8, 1.25, 2.3],
      [wx - 1.2, 1.35, wz - 2.6, 1.35, 2.8],
      [wx + 0.4, 0.95, wz - 2.5, 1.05, 1.9],
      [wx - 2.9, 0.65, wz - 0.2, 0.95, 1.35],
      [wx - 1.8, 0.55, wz + 1.6, 0.75, 0.95],
    ];
    rockery.forEach(([rx, ry2, rz, rad, sy], idx) => {
      bMain.add(
        jitter(new THREE.IcosahedronGeometry(1, 1), 0.28, idx + 150),
        m.stoneDark,
        xf(rx, ry2 * 0.7, rz, idx * 1.1, rad, sy * 0.75, rad * 0.85),
        idx % 2 ? 0x6e6c64 : 0x827e74,
        true,
      );
    });
    pineBonsai(bMain, m, wx - 1.4, wz - 2.5, 0.72, 19);

    // Rừng trúc thanh khiết bao quanh khu Giếng Ngọc
    bambooClump(bMain, m, -35.2, -26.5, 11, 6.8, 61);
    bambooClump(bMain, m, -34.2, -21.5, 10, 6.2, 62);
    bambooClump(bMain, m, -27.2, -30.6, 10, 6.4, 63);
    bambooClump(bMain, m, -31.8, -31.2, 11, 6.6, 64);
    bambooClump(bMain, m, -34.5, -15.5, 9, 5.8, 65);
  }

  // Đá cuội hai bên bờ Suối Ngọc + Cầu đá nhỏ uốn cong bắc qua suối (gần (-24.6, 3.8))
  {
    const bridgeT = 0.77;
    const bp = streamCurve.getPointAt(bridgeT);
    const bTan = streamCurve.getTangentAt(bridgeT);
    // trục dọc cầu vuông góc với dòng suối
    const crossYaw = Math.atan2(-bTan.z, bTan.x);

    // rải cuội dọc hai bờ suối, chừa chỗ chân cầu đá
    const pPt = new THREE.Vector3();
    const pTan = new THREE.Vector3();
    const pSide = new THREE.Vector3();
    for (let i = 2; i < 62; i++) {
      const u = i / 64;
      if (Math.abs(u - bridgeT) < 0.055) continue;
      streamCurve.getPointAt(u, pPt);
      streamCurve.getTangentAt(u, pTan);
      pSide.set(-pTan.z, 0, pTan.x).normalize();
      for (const sgn of [-1, 1]) {
        const off = (0.82 + r() * 0.25) * sgn;
        const rx = pPt.x + pSide.x * off, rz = pPt.z + pSide.z * off;
        bDeco.add(
          jitter(new THREE.IcosahedronGeometry(1, 0), 0.25, i * 2 + (sgn > 0 ? 1 : 0)),
          m.stone,
          xf(rx, 0.08, rz, r() * TAU, 0.24 + r() * 0.2, 0.12 + r() * 0.1, 0.22 + r() * 0.18),
          i % 3 === 0 ? 0x77806a : 0x969084,
          true,
        );
      }
      if (i % 9 === 0) bush(bDeco, m, pPt.x - pSide.x * 1.45, pPt.z - pSide.z * 1.45, 0.65, 0x4c8b3f);
    }

    // CẦU ĐÁ NHỎ NHỊP VÒM THOẢI (`bp` ≈ (-24.6, 3.9), bắc ngang suối nối lối dạo Bồ Đề ↔ Ao Sen)
    const cs = Math.cos(crossYaw), sn = Math.sin(crossYaw);
    const BL = (lx: number, ly: number, lz: number): THREE.Vector3 =>
      new THREE.Vector3(bp.x + lx * cs + lz * sn, ly, bp.z - lx * sn + lz * cs);

    const segN = 9;
    const span = 2.9, deckW = 1.78;
    for (let i = 0; i < segN; i++) {
      const u = (i + 0.5) / segN - 0.5; // -0.5 .. +0.5
      const archY = Math.cos(u * Math.PI) * 0.28;
      const tilt = Math.sin(u * Math.PI) * 0.22;
      const p = BL(u * span, 0.04 + archY, 0);
      bMain.add(
        new THREE.BoxGeometry(span / segN + 0.06, 0.12, deckW),
        m.stone,
        xf(p.x, p.y, p.z, crossYaw, 1, 1, 1, 0, -tilt),
        i % 2 ? 0xbab4a8 : 0xb0aaa0,
      );
      // gờ lan can đá hai mép cầu
      for (const sz of [-deckW * 0.46, deckW * 0.46]) {
        const rp = BL(u * span, 0.15 + archY, sz);
        bMain.add(
          new THREE.BoxGeometry(span / segN + 0.05, 0.16, 0.12),
          m.stoneDark,
          xf(rp.x, rp.y, rp.z, crossYaw, 1, 1, 1, 0, -tilt),
          0x928c80,
        );
      }
    }
    // 6 trụ búp sen đá trên thành cầu (2 đầu + đỉnh vòm)
    for (const lx of [-span * 0.46, 0, span * 0.46]) {
      const archY = Math.cos((lx / span) * Math.PI) * 0.28;
      for (const sz of [-deckW * 0.46, deckW * 0.46]) {
        const pp = BL(lx, 0.08 + archY, sz);
        bMain.cyl(m.stone, 0.09, 0.11, 0.42, 8, pp.x, pp.y, pp.z, 0xc4beb0);
        bMain.sphere(m.stone, 0.1, pp.x, pp.y + 0.46, pp.z, 1, 1.25, 1, 0xd2ccc0, 8);
      }
    }
    stoneLantern(bMain, m, halos, bp.x + 1.85, 0, bp.z - 1.35, 0.84);
  }

  const wellLight = new THREE.PointLight(0x7ff0dc, 4, 12, 1.6);
  wellLight.position.set(wx, 1.45, wz);
  group.add(wellLight);

  const cJadeMist = new THREE.Color(0.65, 1.0, 0.92);
  let mistAcc = 0;

  return {
    group,
    wellPos: new THREE.Vector3(wx, 0.95, wz),
    quanAmPos: new THREE.Vector3(qx, 1.8, qz),
    zenPos: new THREE.Vector3(CUSHION_CENTER.x, 0.2, CUSHION_CENTER.z),
    update(dt: number, t: number, night: number, lightsOn: boolean): void {
      // hào quang Đức Quan Âm thở nhịp dịu êm
      (qAureole.material as THREE.MeshBasicMaterial).opacity = (0.44 + 0.34 * night) * (0.92 + 0.08 * Math.sin(t * 1.5));
      qAureole.scale.setScalar(1 + 0.03 * Math.sin(t * 1.1));

      quanAmLight.intensity = lightsOn ? 8 + night * 18 : 4;
      quanAmLight.visible = quanAmLight.intensity > 0.1;

      wellLight.intensity = lightsOn ? 3.5 + night * 11 : 2.5;
      wellLight.visible = true;

      // hơi sương ngọc bích bay lững lờ từ miệng Giếng Ngọc
      mistAcc += dt * 2.5;
      while (mistAcc >= 1) {
        mistAcc -= 1;
        const a = Math.random() * TAU, rad = Math.random() * 0.65;
        sparks.spawn(
          wx + Math.cos(a) * rad, 0.98, wz + Math.sin(a) * rad,
          (Math.random() - 0.5) * 0.08, 0.28 + Math.random() * 0.18, (Math.random() - 0.5) * 0.08,
          2.2 + Math.random() * 0.8, 0.12, 0.03, cJadeMist, null, 0.42 + night * 0.25, -0.02, 0.4, 1, 0.15,
        );
      }
    },
    dispose(): void {
      for (const g of ownGeo) g.dispose();
      for (const mt of ownMat) mt.dispose();
      for (const tx of ownTex) tx.dispose();
    },
  };
}
