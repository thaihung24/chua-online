/**
 * Tiện ích lõi cho môi trường 3D: RNG có hạt giống, hàm toán, và `Batch` — gom hình học tĩnh theo chất liệu
 * (mergeGeometries) để giảm draw call. Mọi hình đều dựng thủ tục, không dùng file ngoài.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smoothstep = (a: number, b: number, v: number): number => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const TAU = Math.PI * 2;

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();

/** Ma trận từ vị trí, xoay (Y, X, Z) và tỉ lệ. */
export function xf(x = 0, y = 0, z = 0, ry = 0, sx = 1, sy = sx, sz = sx, rx = 0, rz = 0): THREE.Matrix4 {
  _e.set(rx, ry, rz, 'YXZ');
  _q.setFromEuler(_e);
  _p.set(x, y, z);
  _s.set(sx, sy, sz);
  return new THREE.Matrix4().compose(_p, _q, _s);
}

export type Col = THREE.ColorRepresentation;

/** Bộ gom hình tĩnh theo chất liệu. Hình đưa vào được biến đổi, gắn màu đỉnh, rồi gộp thành vài Mesh. */
export class Batch {
  private buckets = new Map<string, { mat: THREE.Material; geos: THREE.BufferGeometry[] }>();
  readonly meshes: THREE.Mesh[] = [];
  constructor(private cast = true, private receive = true) {}

  add(geo: THREE.BufferGeometry, mat: THREE.Material, m?: THREE.Matrix4, color?: Col, flat = false): void {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (m) g.applyMatrix4(m);
    if (flat) g.computeVertexNormals();
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    const n = g.attributes.position.count;
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    const c = new THREE.Color(color ?? 0xffffff);
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    let b = this.buckets.get(mat.uuid);
    if (!b) { b = { mat, geos: [] }; this.buckets.set(mat.uuid, b); }
    b.geos.push(g);
  }

  /** Hộp có đáy ở y. */
  box(mat: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number, ry = 0, color?: Col): void {
    this.add(UNIT.box, mat, xf(x, y + h / 2, z, ry, w, h, d), color);
  }
  cyl(mat: THREE.Material, rTop: number, rBot: number, h: number, seg: number, x: number, y: number, z: number, color?: Col, ry = 0): void {
    this.add(new THREE.CylinderGeometry(rTop, rBot, h, seg, 1), mat, xf(x, y + h / 2, z, ry), color);
  }
  sphere(mat: THREE.Material, r: number, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, color?: Col, seg = 12): void {
    this.add(new THREE.SphereGeometry(1, seg, Math.max(6, seg >> 1)), mat, xf(x, y, z, 0, r * sx, r * sy, r * sz), color);
  }

  /** Gộp và thêm vào `parent`. Trả danh sách Mesh. */
  build(parent: THREE.Object3D, name = 'batch'): THREE.Mesh[] {
    let i = 0;
    for (const { mat, geos } of this.buckets.values()) {
      const merged = mergeGeometries(geos, false);
      for (const g of geos) g.dispose();
      if (!merged) continue;
      merged.computeBoundingSphere();
      const mesh = new THREE.Mesh(merged, mat);
      mesh.name = `${name}-${i++}`;
      mesh.castShadow = this.cast;
      mesh.receiveShadow = this.receive;
      parent.add(mesh);
      this.meshes.push(mesh);
    }
    this.buckets.clear();
    return this.meshes;
  }
}

const UNIT = { box: new THREE.BoxGeometry(1, 1, 1) };

const _up = new THREE.Vector3(0, 1, 0);
/** Ma trận đặt hình trụ đơn vị (cao 1, đáy y=-0.5) nối hai điểm. */
export function between(a: THREE.Vector3, b: THREE.Vector3, rx = 1, rz = rx): THREE.Matrix4 {
  const d = new THREE.Vector3().subVectors(b, a);
  const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(_up, d.normalize());
  return new THREE.Matrix4().compose(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), q, new THREE.Vector3(rx, len, rz));
}

/** Thanh tròn thon nối hai điểm (tay, chân, cành…). */
export function limb(b: Batch, mat: THREE.Material, a: THREE.Vector3, c: THREE.Vector3, r0: number, r1: number, color?: Col, seg = 8): void {
  b.add(new THREE.CylinderGeometry(r1, r0, 1, seg, 1), mat, between(a, c), color);
}

/** Mặt phẳng nằm ngang với UV theo mét (lát gạch). */
export function floorGeo(w: number, d: number, tile = 3.6): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(w, d);
  g.rotateX(-Math.PI / 2);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * d) / tile);
  return g;
}

/** Ống thon: bán kính thay đổi dọc đường cong. */
export function taperedTube(curve: THREE.Curve<THREE.Vector3>, tubular: number, radial: number, radiusAt: (t: number) => number, capEnds = false): THREE.BufferGeometry {
  const g = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const nrm = g.attributes.normal as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, c);
    const r = radiusAt(t);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      // TubeGeometry đặt đỉnh = tâm + bán kính(1) * pháp tuyến → đổi bán kính
      v.set(pos.getX(idx) - c.x, pos.getY(idx) - c.y, pos.getZ(idx) - c.z);
      pos.setXYZ(idx, c.x + v.x * r, c.y + v.y * r, c.z + v.z * r);
    }
  }
  pos.needsUpdate = true;
  nrm.needsUpdate = true;
  void capEnds;
  return g;
}

/** Tạo hình xoay (lathe) từ danh sách [bán kính, độ cao]. */
export function lathe(profile: [number, number][], seg = 20): THREE.LatheGeometry {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg);
}

/** Làm méo nhẹ đỉnh (low-poly tự nhiên) — dùng cho tảng đá, tán lá. */
export function jitter(g: THREE.BufferGeometry, amount: number, seed = 1): THREE.BufferGeometry {
  const r = rng(seed);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const map = new Map<string, THREE.Vector3>();
  for (let i = 0; i < pos.count; i++) {
    const k = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    let d = map.get(k);
    if (!d) { d = new THREE.Vector3((r() - 0.5) * amount, (r() - 0.5) * amount, (r() - 0.5) * amount); map.set(k, d); }
    pos.setXYZ(i, pos.getX(i) + d.x, pos.getY(i) + d.y, pos.getZ(i) + d.z);
  }
  g.computeVertexNormals();
  return g;
}

/** Giải phóng toàn bộ hình học/chất liệu/texture dưới một nhóm. */
export function disposeTree(root: THREE.Object3D): void {
  const seen = new Set<unknown>();
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry && !seen.has(m.geometry)) { seen.add(m.geometry); m.geometry.dispose(); }
    const mat = (m as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (mat) for (const mm of Array.isArray(mat) ? mat : [mat]) {
      if (seen.has(mm)) continue;
      seen.add(mm);
      for (const v of Object.values(mm)) if (v && (v as THREE.Texture).isTexture && !seen.has(v)) { seen.add(v); (v as THREE.Texture).dispose(); }
      mm.dispose();
    }
  });
}

/** Phần dựng được: nhóm gốc + cập nhật theo khung hình. */
export interface Part {
  group: THREE.Group;
  update?(dt: number, t: number, night: number): void;
}

/** Uniform dùng chung (thời gian, gió, đêm) cho các shader tuỳ biến. */
export interface SharedUniforms {
  uTime: { value: number };
  uNight: { value: number };
  uWind: { value: number };
  /** px mỗi đơn vị thế giới ở khoảng cách 1 (để đổi cỡ hạt) */
  uPx: { value: number };
}
export function createShared(): SharedUniforms {
  return { uTime: { value: 0 }, uNight: { value: 0 }, uWind: { value: 1 }, uPx: { value: 700 } };
}

/** Thêm gió đung đưa vào chất liệu chuẩn (đỉnh dịch theo sin, trọng số theo `weight` GLSL). */
export function addWind(mat: THREE.Material, shared: SharedUniforms, opts: { amp?: number; freq?: number; weight?: string; world?: boolean } = {}): void {
  const amp = (opts.amp ?? 0.1).toFixed(4);
  const freq = (opts.freq ?? 1.6).toFixed(3);
  const weight = opts.weight ?? 'uv.y';
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    prev?.call(mat, shader, renderer);
    shader.uniforms.uTime = shared.uTime;
    shader.uniforms.uWind = shared.uWind;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uWind;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        {
          #ifdef USE_INSTANCING
            vec3 wp = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          #else
            vec3 wp = position;
          #endif
          float ph = wp.x * 0.6 + wp.z * 0.5;
          float w = (${weight}) * uWind;
          transformed.x += sin(uTime * ${freq} + ph) * ${amp} * w;
          transformed.z += cos(uTime * ${freq} * 0.8 + ph * 1.3) * ${amp} * 0.6 * w;
        }`);
  };
  mat.customProgramCacheKey = () => `wind${amp}${freq}${weight}`;
}
