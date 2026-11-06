/**
 * Mặt đất khuôn viên (shader trộn: cỏ / đá lát / sỏi thiền có vân cào / đất & đáy ao theo mặt nạ),
 * tường rào quanh chùa, mặt phẳng raycast chạm-để-đi.
 */
import * as THREE from 'three';
import { BOUNDS, CHICKEN_COOP, CUSHION_CENTER, LOTUS_POND, RELEASE_POND, SPOTS, WELL } from '@/world/layout';
import { Batch, rng, xf } from './core';
import type { Mats } from './materials';
import { groundMaskTexture } from './textures';

export const GROUND_EXT = { x0: -48, x1: 48, z0: -61, z1: 46 };
export const WALL = { x0: -42.4, x1: 42.4, z0: -55.4, z1: 40.4, h: 2.5 };
export const ZEN_RADIUS = 5.85;

export interface GroundPart { group: THREE.Group; pick: THREE.Mesh; dispose(): void }

function drawMask(ctx: CanvasRenderingContext2D, px: (x: number, z: number) => [number, number], sc: number): void {
  const R = (x0: number, z0: number, x1: number, z1: number): void => {
    const [a, b] = px(x0, z0), [c, d] = px(x1, z1);
    ctx.fillRect(a, b, c - a, d - b);
  };
  const line = (pts: [number, number][], w: number): void => {
    ctx.lineWidth = w * sc; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach(([x, z], i) => { const [a, b] = px(x, z); if (i === 0) ctx.moveTo(a, b); else ctx.lineTo(a, b); });
    ctx.stroke();
  };
  // R = đá lát
  ctx.fillStyle = '#ff0000'; ctx.strokeStyle = '#ff0000';
  R(-4.6, -19, 4.6, 52);                       // trục chính từ cổng tới chánh điện (kéo dài ra đường ngoài)
  R(-16, -19, 16, -4);                         // sân trước chánh điện
  R(-10, 9, 10, 23);                           // sân trước & giữa hai ao
  R(-7.5, 24, 7.5, 40.4);                      // sân cổng
  line([[-6, -10], [-14, -7], [-20, -4.2]], 2.6);        // → bồ đề
  line([[-12, -16], [-20, -19], [-25.5, -21.5]], 2.4);    // → giếng
  line([[8, -7], [15.2, -8]], 3.2);                       // → chuông
  line([[14, -12], [22, -13.5], [27.5, -13.3]], 2.6);     // → Quan Âm
  line([[4.6, 4], [14, 4], [21, 4]], 3.0);                // → sân thiền
  line([[-4.6, 14], [-11.6, 14]], 3.2);                   // → ao sen
  line([[4.6, 14], [12.2, 14]], 3.2);                     // → hồ phóng sinh
  line([[-24, -4], [-25, 2], [-24, 5], [-20, 9.5]], 2.2); // vòng quanh bồ đề qua cầu đá
  line([[4.6, 22], [8.0, 22]], 2.2);                      // → giá chổi
  // hai lối đá uốn vòng hai bên hông Chánh điện dẫn ra khu vườn & chuồng gà sau chùa
  line([[-14, -15.5], [-16.6, -21], [-16.6, -35.8], [-10.8, -41.6], [0, -42.4]], 2.4);
  line([[14, -15.5], [17.4, -21], [17.4, -35.8], [10.8, -41.6], [0, -42.4]], 2.4);
  ctx.beginPath(); { const [a, b] = px(0, -42.4); ctx.ellipse(a, b, 5.2 * sc, 2.7 * sc, 0, 0, 7); ctx.fill(); }
  // vòng đá quanh bể Quan Âm & bục
  ctx.beginPath(); { const [a, b] = px(28.5, -13); ctx.ellipse(a, b, 6.2 * sc, 4.2 * sc, 0, 0, 7); ctx.fill(); }
  ctx.beginPath(); { const [a, b] = px(SPOTS.well.pos.x, SPOTS.well.pos.z); ctx.ellipse(a, b, 4.2 * sc, 4.2 * sc, 0, 0, 7); ctx.fill(); }
  ctx.beginPath(); { const [a, b] = px(WELL.x, WELL.z); ctx.ellipse(a, b, 4.6 * sc, 4.6 * sc, 0, 0, 7); ctx.fill(); }
  // G = sỏi thiền
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = '#00ff00';
  ctx.beginPath(); { const [a, b] = px(CUSHION_CENTER.x, CUSHION_CENTER.z); ctx.ellipse(a, b, ZEN_RADIUS * sc, ZEN_RADIUS * sc, 0, 0, 7); ctx.fill(); }
  // B = đất / đáy ao, nền đất vườn gà sau chùa & lòng suối từ Giếng ngọc về Ao sen
  ctx.fillStyle = '#0000ff'; ctx.strokeStyle = '#0000ff';
  R(CHICKEN_COOP.cx - 5.4, CHICKEN_COOP.cz - 4.0, CHICKEN_COOP.cx + 5.4, CHICKEN_COOP.gateZ + 0.3);
  for (const p of [LOTUS_POND, RELEASE_POND]) {
    ctx.beginPath(); const [a, b] = px(p.cx, p.cz); ctx.ellipse(a, b, (p.rx + 0.9) * sc, (p.rz + 0.9) * sc, 0, 0, 7); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  // ao/hồ & suối ghi đè đá lát & sỏi: xoá R, G trong lòng ao & lòng suối
  line([[-29.2, -23.6], [-30.6, -18.5], [-29.6, -12.0], [-27.8, -6.0], [-25.6, 1.5], [-24.4, 4.6], [-22.8, 8.5]], 2.1);
  for (const p of [LOTUS_POND, RELEASE_POND]) {
    ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#0000ff';
    ctx.beginPath(); const [a, b] = px(p.cx, p.cz); ctx.ellipse(a, b, (p.rx + 0.9) * sc, (p.rz + 0.9) * sc, 0, 0, 7); ctx.fill(); ctx.restore();
  }
}

export function createGround(mats: Mats, quality: () => 'low' | 'medium' | 'high'): GroundPart {
  void quality;
  const group = new THREE.Group();
  group.name = 'ground';
  const E = GROUND_EXT;
  const mask = groundMaskTexture(E, drawMask);
  mask.flipY = false;
  mask.needsUpdate = true;

  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.96, metalness: 0 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.tMask = { value: mask };
    sh.uniforms.tStone = { value: mats.textures.stone };
    sh.uniforms.tGrass = { value: mats.textures.grass };
    sh.uniforms.tGravel = { value: mats.textures.gravel };
    sh.uniforms.tDirt = { value: mats.textures.dirt };
    sh.uniforms.tNoise = { value: mats.textures.noise };
    sh.uniforms.uExt = { value: new THREE.Vector4(E.x0, E.z0, E.x1 - E.x0, E.z1 - E.z0) };
    sh.uniforms.uZen = { value: new THREE.Vector3(CUSHION_CENTER.x, CUSHION_CENTER.z, ZEN_RADIUS) };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWp = (modelMatrix * vec4(position, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vWp;
        uniform sampler2D tMask, tStone, tGrass, tGravel, tDirt, tNoise; uniform vec4 uExt; uniform vec3 uZen;`)
      .replace('#include <map_fragment>', `
        vec2 gp = vWp.xz;
        vec2 muv = clamp((gp - uExt.xy) / uExt.zw, 0.0, 1.0);
        vec4 mk = texture2D(tMask, muv);
        float n1 = texture2D(tNoise, gp * 0.045).r;
        float n2 = texture2D(tNoise, gp * 0.23).r;
        float n3 = texture2D(tNoise, gp * 1.3).r;
        vec3 grass = texture2D(tGrass, gp / 4.5).rgb * texture2D(tGrass, gp / 17.0 + 0.3).rgb * 1.9;
        grass *= (0.72 + 0.62 * n1) * mix(vec3(1.0), vec3(1.12, 1.05, 0.72), smoothstep(0.35, 0.8, n2) * 0.6);
        vec3 stone = texture2D(tStone, gp / 3.6).rgb * (0.9 + 0.2 * n2);
        vec3 gravel = texture2D(tGravel, gp / 2.2).rgb;
        vec3 dirt = texture2D(tDirt, gp / 2.8).rgb * (0.8 + 0.4 * n2);
        float zd = length(gp - uZen.xy);
        float ring = 0.5 + 0.5 * sin(zd * 10.5);
        gravel *= mix(0.82, 1.06, smoothstep(0.25, 0.75, ring));
        gravel *= 1.0 - 0.45 * (smoothstep(uZen.z - 0.9, uZen.z - 0.1, zd));
        float thr = (n3 - 0.5) * 0.14;
        float sM = smoothstep(0.5 + thr - 0.04, 0.5 + thr + 0.04, mk.r);
        float gM = smoothstep(0.5 + thr - 0.05, 0.5 + thr + 0.05, mk.g);
        float bM = smoothstep(0.45 + thr, 0.55 + thr, mk.b);
        vec3 base = grass;
        base = mix(base, dirt * 0.8, bM);
        base = mix(base, gravel, gM);
        base = mix(base, stone, sM);
        float curb = smoothstep(0.3, 0.5, mk.r) * (1.0 - smoothstep(0.5, 0.66, mk.r));
        base *= 1.0 - 0.3 * curb;
        diffuseColor.rgb *= base;`);
  };
  mat.customProgramCacheKey = () => 'wGround';

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), mat);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  plane.name = 'ground-plane';
  group.add(plane);

  // mặt phẳng raycast (trong suốt)
  const pick = new THREE.Mesh(
    new THREE.PlaneGeometry(BOUNDS.x1 - BOUNDS.x0, BOUNDS.z1 - BOUNDS.z0),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  pick.rotation.x = -Math.PI / 2;
  pick.position.set((BOUNDS.x0 + BOUNDS.x1) / 2, 0.01, (BOUNDS.z0 + BOUNDS.z1) / 2);
  pick.name = 'ground-pick';
  group.add(pick);

  buildWalls(group, mats);

  return {
    group, pick,
    dispose(): void { mask.dispose(); mat.dispose(); plane.geometry.dispose(); pick.geometry.dispose(); (pick.material as THREE.Material).dispose(); },
  };
}

/** Hộp có UV lặp theo kích thước (ngói lát mái tường). */
function tiledBox(w: number, h: number, d: number, u: number, v: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * u, uv.getY(i) * v);
  return g;
}

function buildWalls(group: THREE.Group, m: Mats): void {
  const b = new Batch(true);
  const { x0, x1, z0, z1, h } = WALL;
  const segs: { ax: number; az: number; bx: number; bz: number }[] = [
    { ax: x0, az: z0, bx: x1, bz: z0 },     // bắc
    { ax: x0, az: z0, bx: x0, bz: z1 },     // tây
    { ax: x1, az: z0, bx: x1, bz: z1 },     // đông
    { ax: x0, az: z1, bx: -10.4, bz: z1 },  // nam trái cổng
    { ax: 10.4, az: z1, bx: x1, bz: z1 },   // nam phải cổng
  ];
  const r = rng(5);
  for (const s of segs) {
    const len = Math.hypot(s.bx - s.ax, s.bz - s.az);
    const cx = (s.ax + s.bx) / 2, cz = (s.az + s.bz) / 2;
    const ry = Math.atan2(-(s.bz - s.az), s.bx - s.ax); // quay quanh Y để trục x dọc theo tường
    // thân tường
    b.add(new THREE.BoxGeometry(len, h - 0.5, 0.55), m.plaster, xf(cx, 0.4 + (h - 0.5) / 2, cz, ry), 0xffffff);
    // chân tường đá
    b.add(new THREE.BoxGeometry(len, 0.55, 0.75), m.stone, xf(cx, 0.275, cz, ry), 0x9d968b);
    // ngói mái tường
    b.add(tiledBox(len + 0.1, 0.18, 0.95, len / 1.6, 0.6), m.roof, xf(cx, h + 0.1, cz, ry), 0xffffff);
    b.add(new THREE.BoxGeometry(len + 0.1, 0.12, 0.7), m.roofEdge, xf(cx, h - 0.1, cz, ry), 0x6b4028);
    // ô hoa văn tròn (thêm chi tiết) mỗi ~7m
    const n = Math.floor(len / 7);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n - 0.5;
      const px = cx + Math.cos(ry) * len * t, pz = cz - Math.sin(ry) * len * t;
      for (const side of [-1, 1]) {
        const ox = Math.sin(ry) * 0.3 * side, oz = Math.cos(ry) * 0.3 * side;
        b.add(new THREE.TorusGeometry(0.42, 0.05, 6, 20), m.lacquer, xf(px + ox, 1.55, pz + oz, ry), 0xffffff);
        b.add(new THREE.CircleGeometry(0.4, 20), m.darkWood, xf(px + ox * 0.95, 1.55, pz + oz * 0.95, ry + (side > 0 ? 0 : Math.PI)), 0x4a2a1a);
      }
    }
    // trụ vuông mỗi ~8m
    const np = Math.round(len / 8);
    for (let i = 0; i <= np; i++) {
      const t = i / np - 0.5;
      const px = cx + Math.cos(ry) * len * t, pz = cz - Math.sin(ry) * len * t;
      b.add(new THREE.BoxGeometry(0.95, h + 0.5, 0.95), m.plaster, xf(px, (h + 0.5) / 2 + 0.3, pz, ry), 0xf4ead4);
      b.add(new THREE.BoxGeometry(1.15, 0.2, 1.15), m.roofEdge, xf(px, h + 0.7, pz, ry), 0x6b4028);
      b.add(new THREE.ConeGeometry(0.5, 0.55, 4), m.roof, xf(px, h + 1.07, pz, ry + Math.PI / 4), 0xffffff);
      b.sphere(m.gold, 0.1, px, h + 1.4, pz, 1, 1.3, 1);
    }
    void r;
  }
  b.build(group, 'walls');
}
