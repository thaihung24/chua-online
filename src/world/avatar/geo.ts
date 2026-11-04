/**
 * Tiện ích dựng hình thủ tục cho nhân vật: tô màu đỉnh (vertex color), đặt/xoay/co giãn,
 * ống nối hai điểm, gộp nhiều hình thành một geometry (một draw call cho mỗi bộ phận).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type V3 = [number, number, number];

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/** Thêm thuộc tính `color` (sRGB → tuyến tính qua THREE.Color) cho cả geometry. */
export function paint(g: THREE.BufferGeometry, color: THREE.ColorRepresentation): THREE.BufferGeometry {
  const c = new THREE.Color(color);
  const n = g.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

/** Đặt geometry: vị trí, xoay (Euler XYZ, rad), tỉ lệ. */
export function xf(g: THREE.BufferGeometry, pos?: V3, rot?: V3, scale?: V3 | number): THREE.BufferGeometry {
  _p.set(pos?.[0] ?? 0, pos?.[1] ?? 0, pos?.[2] ?? 0);
  _e.set(rot?.[0] ?? 0, rot?.[1] ?? 0, rot?.[2] ?? 0);
  _q.setFromEuler(_e);
  if (typeof scale === 'number') _s.set(scale, scale, scale);
  else _s.set(scale?.[0] ?? 1, scale?.[1] ?? 1, scale?.[2] ?? 1);
  _m.compose(_p, _q, _s);
  g.applyMatrix4(_m);
  return g;
}

/** Hình cầu tô màu (có thể bẹp/dẹt bằng `scale`). */
export function ball(r: number, color: THREE.ColorRepresentation, pos: V3, scale?: V3 | number, seg: [number, number] = [14, 10], rot?: V3): THREE.BufferGeometry {
  return xf(paint(new THREE.SphereGeometry(r, seg[0], seg[1]), color), pos, rot, scale);
}

/** Hộp tô màu. */
export function box(w: number, h: number, d: number, color: THREE.ColorRepresentation, pos: V3, rot?: V3): THREE.BufferGeometry {
  return xf(paint(new THREE.BoxGeometry(w, h, d), color), pos, rot);
}

/** Ống (hình trụ/nón cụt) nối điểm a → b, bán kính r0 ở a, r1 ở b. */
export function tube(a: V3, b: V3, r0: number, r1: number, color: THREE.ColorRepresentation, seg = 8): THREE.BufferGeometry {
  _a.set(a[0], a[1], a[2]);
  _b.set(b[0], b[1], b[2]);
  const len = _a.distanceTo(_b);
  const g = new THREE.CylinderGeometry(r1, r0, len, seg, 1);
  paint(g, color);
  _q.setFromUnitVectors(UP, _b.clone().sub(_a).normalize());
  _p.copy(_a).add(_b).multiplyScalar(0.5);
  _m.compose(_p, _q, _s.set(1, 1, 1));
  g.applyMatrix4(_m);
  return g;
}

/** Gộp danh sách geometry (cùng thuộc tính) thành một; giải phóng bản gốc. */
export function merge(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const out = mergeGeometries(list, false);
  for (const g of list) g.dispose();
  if (!out) throw new Error('merge geometry thất bại');
  out.computeBoundingSphere();
  out.computeBoundingBox();
  return out;
}

/** Tròn xoay từ danh sách (bán kính, cao) đi từ dưới lên trên. */
export function lathe(points: [number, number][], color: THREE.ColorRepresentation, zScale = 1, seg = 18): THREE.BufferGeometry {
  const g = new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  paint(g, color);
  g.scale(1, 1, zScale);
  return g;
}

/** Nội suy bán kính theo độ cao từ một đường viền lathe. */
export function profileR(points: [number, number][], y: number): number {
  if (y <= points[0][1]) return points[0][0];
  for (let i = 1; i < points.length; i++) {
    const [r1, y1] = points[i];
    const [r0, y0] = points[i - 1];
    if (y <= y1) {
      const t = (y - y0) / Math.max(1e-6, y1 - y0);
      return r0 + (r1 - r0) * t;
    }
  }
  return points[points.length - 1][0];
}

export function shade(hex: THREE.ColorRepresentation, k: number): THREE.Color {
  return new THREE.Color(hex).multiplyScalar(k);
}
export function mix(a: THREE.ColorRepresentation, b: THREE.ColorRepresentation, t: number): THREE.Color {
  return new THREE.Color(a).lerp(new THREE.Color(b), t);
}

/** Cánh sen đơn giản (dùng cho hoa, hào quang, cánh bay). */
export function petal(len: number, wid: number, color: THREE.ColorRepresentation, pos: V3, rot: V3): THREE.BufferGeometry {
  const g = paint(new THREE.SphereGeometry(1, 8, 6), color);
  g.scale(wid, len, wid * 0.32);
  g.translate(0, len, 0);
  return xf(g, pos, rot);
}
