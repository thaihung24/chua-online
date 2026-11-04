/**
 * Phụ kiện cho nhân vật. DANH SÁCH ID (khớp src/content/wardrobe.ts của C2):
 *   hat-tram      tràng hạt trầm (đeo cổ)
 *   scarf-gold    khăn vàng (quanh cổ)
 *   conical-hat   nón lá
 *   bag-brocade   túi thổ cẩm (đeo chéo)
 *   lotus-hand    hoa sen cầm tay (tay phải)
 *   bracelet-jade vòng ngọc (cổ tay phải)
 *   halo-lotus    hào quang sen sau đầu (cấp cao)
 * Id lạ → bỏ qua. Có thêm bí danh cũ (tran-hat-go, khan-vang, non-la, tui-than, bong-sen, vong-tay).
 */
import * as THREE from 'three';
import { ball, box, merge, paint, petal, tube, xf, type V3 } from './geo';

export type AccessoryId = 'hat-tram' | 'scarf-gold' | 'conical-hat' | 'bag-brocade' | 'lotus-hand' | 'bracelet-jade' | 'halo-lotus';

export const ACCESSORY_IDS: AccessoryId[] = ['hat-tram', 'scarf-gold', 'conical-hat', 'bag-brocade', 'lotus-hand', 'bracelet-jade', 'halo-lotus'];

const ALIAS: Record<string, AccessoryId> = {
  'tran-hat-go': 'hat-tram', 'khan-vang': 'scarf-gold', 'non-la': 'conical-hat',
  'tui-than': 'bag-brocade', 'bong-sen': 'lotus-hand', 'vong-tay': 'bracelet-jade',
};

export function canonicalAccessory(id?: string | null): AccessoryId | null {
  if (!id) return null;
  if ((ACCESSORY_IDS as string[]).includes(id)) return id as AccessoryId;
  return ALIAS[id] ?? null;
}

export interface TorsoCtx {
  /** bán kính thân (chưa nhân zScale) tại độ cao y (so với hông). */
  surfR: (y: number) => number;
  zs: number;
}

/** Tràng hạt trầm: vòng hạt rũ trước ngực + tua đỏ. */
function beadsNecklace(c: TorsoCtx): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  const N = 30;
  for (let i = 0; i < N; i++) {
    const phi = (i / N) * Math.PI * 2;
    const front = Math.max(0, Math.cos(phi));
    const y = 0.352 - 0.195 * Math.pow(front, 1.5);
    const r = c.surfR(y) + 0.02;
    out.push(ball(0.0185, i % 10 === 0 ? '#e6b24c' : '#56321d', [Math.sin(phi) * r, y, Math.cos(phi) * r * c.zs + 0.008 * front], 1, [8, 6]));
  }
  const yb = 0.352 - 0.195 - 0.024;
  const zb = c.surfR(yb) * c.zs + 0.028;
  out.push(ball(0.026, '#e6b24c', [0, yb + 0.012, zb], 1, [8, 6]));
  out.push(tube([0, yb, zb], [0, yb - 0.075, zb], 0.014, 0.008, '#c83e31', 6));
  return out;
}

/** Khăn vàng quanh cổ + hai đuôi khăn. */
function goldScarf(c: TorsoCtx): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  const r = c.surfR(0.325) + 0.014;
  const ring = paint(new THREE.TorusGeometry(r, 0.036, 8, 22), '#eebb3f');
  out.push(xf(ring, [0, 0.322, 0], [Math.PI / 2 - 0.12, 0, 0], [1, c.zs, 1]));
  const zf = r * c.zs;
  out.push(box(0.085, 0.2, 0.026, '#e3a92a', [0.045, 0.215, zf + 0.02], [0.06, 0, -0.08]));
  out.push(box(0.075, 0.15, 0.024, '#d99a1f', [-0.03, 0.235, zf + 0.04], [0.05, 0, 0.12]));
  out.push(ball(0.042, '#f6cf63', [0.07, 0.31, zf + 0.012], [1, 0.8, 0.8]));
  return out;
}

/** Túi thổ cẩm đeo chéo: dây qua vai + túi ở hông trái, sọc nhiều màu. */
function brocadeBag(c: TorsoCtx): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  const zf = (y: number): number => c.surfR(y) * c.zs + 0.012;
  const zb = (y: number): number => -(c.surfR(y) * c.zs + 0.012);
  const pS: V3 = [0.13, 0.335, 0.0];
  const pF: V3 = [0.0, 0.2, zf(0.2)];
  const pBF: V3 = [0.0, 0.2, zb(0.2)];
  const xr = c.surfR(-0.03) + 0.04;
  const pH: V3 = [-xr + 0.025, -0.03, 0.0];
  const strap = '#b8372d';
  out.push(tube(pS, pF, 0.014, 0.014, strap, 6), tube(pF, [pH[0], pH[1] + 0.02, 0.06], 0.014, 0.014, strap, 6));
  out.push(tube(pS, pBF, 0.014, 0.014, strap, 6), tube(pBF, [pH[0], pH[1] + 0.02, -0.06], 0.014, 0.014, strap, 6));
  // thân túi
  const bx = -xr;
  out.push(box(0.09, 0.15, 0.17, '#c0392b', [bx, -0.075, 0.0], [0, 0, 0.06]));
  out.push(box(0.096, 0.026, 0.176, '#f0b84c', [bx - 0.002, -0.05, 0.0], [0, 0, 0.06]));
  out.push(box(0.096, 0.02, 0.176, '#2a8f8a', [bx - 0.004, -0.095, 0.0], [0, 0, 0.06]));
  out.push(box(0.096, 0.014, 0.176, '#f5ead0', [bx - 0.006, -0.125, 0.0], [0, 0, 0.06]));
  out.push(ball(0.02, '#f0b84c', [bx - 0.05, -0.14, 0.0], 1, [8, 6]));
  return out;
}

/** Các phần ghép vào thân (cổ/lưng). */
export function torsoAccessoryGeoms(acc: AccessoryId | null, c: TorsoCtx): THREE.BufferGeometry[] {
  switch (acc) {
    case 'hat-tram': return beadsNecklace(c);
    case 'scarf-gold': return goldScarf(c);
    case 'bag-brocade': return brocadeBag(c);
    default: return [];
  }
}

/** Nón lá (gắn vào đầu, toạ độ tâm đầu). */
export function conicalHatGeoms(): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  const cone = paint(new THREE.ConeGeometry(0.46, 0.24, 28, 1), '#ecd7a3');
  out.push(xf(cone, [0, 0.19, -0.015], [-0.12, 0, 0]));
  const inner = paint(new THREE.ConeGeometry(0.455, 0.235, 28, 1, true), '#c9ab6c');
  out.push(xf(inner, [0, 0.188, -0.015], [-0.12, 0, 0], [0.985, 0.97, 0.985]));
  const rim = paint(new THREE.TorusGeometry(0.455, 0.012, 6, 32), '#bf9f5f');
  out.push(xf(rim, [0, 0.072, 0.0], [Math.PI / 2 - 0.12, 0, 0]));
  out.push(ball(0.028, '#d9b970', [0, 0.315, -0.04], 1, [8, 6]));
  // quai nón hồng hai bên cằm
  for (const s of [-1, 1]) {
    out.push(tube([s * 0.3, 0.085, 0.03], [s * 0.12, -0.2, 0.17], 0.01, 0.01, '#d9567a', 5));
  }
  return out;
}

/** Vòng ngọc ở cổ tay (gốc = khớp khuỷu, tay duỗi theo -y). */
export function braceletGeoms(wristDist: number): THREE.BufferGeometry[] {
  const t = paint(new THREE.TorusGeometry(0.052, 0.0135, 8, 16), '#52cca3');
  const gem = ball(0.018, '#8cf0c8', [0, -wristDist, 0.052], 1, [8, 6]);
  return [xf(t, [0, -wristDist, 0], [Math.PI / 2, 0, 0]), gem];
}

/** Hoa sen: nhiều lớp cánh quanh nhuỵ vàng; gốc ở đáy hoa. `s` = tỉ lệ. */
export function lotusBloomGeoms(s = 1, pos: V3 = [0, 0, 0], pink = '#f4a7c0', light = '#fbd7e2'): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  const layers: { n: number; tilt: number; len: number; col: string; off: number }[] = [
    { n: 8, tilt: 0.95, len: 0.052, col: pink, off: 0 },
    { n: 6, tilt: 0.55, len: 0.05, col: light, off: 0.5 },
    { n: 4, tilt: 0.22, len: 0.044, col: '#fff0f4', off: 0.2 },
  ];
  for (const L of layers) {
    for (let i = 0; i < L.n; i++) {
      const a = ((i + L.off) / L.n) * Math.PI * 2;
      // cánh dựng lên rồi nghiêng ra ngoài quanh trục Y
      const g = petal(L.len * s, 0.026 * s, L.col, [0, 0, 0], [0, 0, 0]);
      const m = new THREE.Matrix4().makeRotationY(a).multiply(new THREE.Matrix4().makeRotationZ(-L.tilt));
      g.applyMatrix4(m);
      g.translate(pos[0], pos[1], pos[2]);
      out.push(g);
    }
  }
  out.push(ball(0.016 * s, '#f2c94c', [pos[0], pos[1] + 0.03 * s, pos[2]], 1, [8, 6]));
  return out;
}

/** Hào quang sen sau đầu: vòng cánh vàng đứng, gốc tại tâm đầu (đặt sau lưng). */
export function haloGeometry(): THREE.BufferGeometry {
  const list: THREE.BufferGeometry[] = [];
  const N = 14;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const g = petal(0.12, 0.07, i % 2 ? '#fbe29a' : '#f2c96a', [0, 0, 0], [0, 0, 0]);
    g.translate(0, 0.42, 0);
    g.applyMatrix4(new THREE.Matrix4().makeRotationZ(a));
    list.push(g);
  }
  list.push(xf(paint(new THREE.TorusGeometry(0.4, 0.008, 6, 40), '#f7e3a4'), [0, 0, 0], [0, 0, 0]));
  return merge(list);
}

export { merge as mergeGeoms };
