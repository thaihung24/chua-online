/**
 * Mái ngói âm dương cong kiểu đình chùa Việt: 4 mặt dốc lõm, bốn đầu đao cong vút, bờ nóc/bờ chảy,
 * mép mái có ngói diềm, đầu kèo dưới mái. Dùng cho chánh điện, tam quan, tháp chuông, mái giếng.
 */
import * as THREE from 'three';
import { Batch, xf, taperedTube } from './core';
import type { Mats } from './materials';

export interface RoofOpts {
  /** nửa rộng (x) và nửa sâu (z) của đường diềm mái; W ≥ D. */
  W: number; D: number;
  /** độ cao mái nếu hoàn chỉnh (bmax=1) */
  rise: number;
  /** cắt cụt mái ở b = bmax (0..1) để lắp tường tầng trên */
  bmax?: number;
  /** số mũ độ cong của dốc (>1 = lõm) */
  curve?: number;
  /** độ vút của đầu đao (m) và phạm vi vút theo mép (m) */
  curl?: number; curlSize?: number;
  /** có bờ nóc + hoa văn */
  ridge?: boolean; finial?: boolean;
  thickness?: number;
  rafters?: boolean;
}

/** Trả về độ cao & vị trí điểm mái theo (mặt, a, b). */
function surface(side: 0 | 1 | 2 | 3, a: number, b: number, o: Required<Pick<RoofOpts, 'W' | 'D' | 'rise' | 'curve' | 'curl' | 'curlSize'>>, out: THREE.Vector3): THREE.Vector3 {
  const { W, D, rise, curve, curl, curlSize } = o;
  const hx = W - D * b, hz = D * (1 - b);
  let x: number, z: number, le: number;
  switch (side) {
    case 0: x = a * hx; z = hz; le = W; break;           // mặt trước (+z)
    case 1: x = -a * hx; z = -hz; le = W; break;         // mặt sau (-z)
    case 2: x = hx; z = -a * hz; le = D; break;          // mặt phải (+x)
    default: x = -hx; z = a * hz; le = D; break;         // mặt trái (-x)
  }
  // đầu đao: vút lên và đẩy ra ngoài theo đường chéo
  const e = (1 - Math.abs(a)) * le; // khoảng cách dọc mép tới góc
  const along = Math.max(0, 1 - e / curlSize);
  const wb = Math.pow(Math.max(0, 1 - b * 2.6), 1.6);
  const lift = curl * along * along * wb;
  const y = rise * Math.pow(b, curve) + lift;
  const push = lift * 0.42;
  out.set(x + Math.sign(x) * push, y, z + Math.sign(z) * push);
  return out;
}

export function buildRoof(batch: Batch, m: Mats, cx: number, y0: number, cz: number, opts: RoofOpts): void {
  const o = { W: opts.W, D: opts.D, rise: opts.rise, curve: opts.curve ?? 1.5, curl: opts.curl ?? 1.0, curlSize: opts.curlSize ?? 2.6 };
  const bmax = opts.bmax ?? 1;
  const th = opts.thickness ?? 0.28;
  const NA = 36, NB = 12;
  const v = new THREE.Vector3();

  for (let side = 0 as 0 | 1 | 2 | 3; side < 4; side = (side + 1) as 0 | 1 | 2 | 3) {
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    const posU: number[] = [], idxU: number[] = [];
    const le = side < 2 ? o.W : o.D;
    for (let j = 0; j <= NB; j++) {
      const b = (j / NB) * bmax;
      for (let i = 0; i <= NA; i++) {
        const a = (i / NA) * 2 - 1;
        surface(side, a, b, o, v);
        pos.push(v.x, v.y, v.z);
        posU.push(v.x, v.y - th, v.z);
        uv.push((a * le) / 1.6, (b * o.D * 1.12) / 1.6);
      }
    }
    for (let j = 0; j < NB; j++) for (let i = 0; i < NA; i++) {
      const p = j * (NA + 1) + i;
      // thứ tự đỉnh sao cho pháp tuyến hướng lên
      if (side === 0 || side === 3) { idx.push(p, p + NA + 1, p + 1, p + 1, p + NA + 1, p + NA + 2); idxU.push(p, p + 1, p + NA + 1, p + 1, p + NA + 2, p + NA + 1); }
      else { idx.push(p, p + NA + 1, p + 1, p + 1, p + NA + 1, p + NA + 2); idxU.push(p, p + 1, p + NA + 1, p + 1, p + NA + 2, p + NA + 1); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    g.computeVertexNormals();
    // đảm bảo pháp tuyến hướng lên (nếu sai thì đảo)
    const n = g.attributes.normal as THREE.BufferAttribute;
    if (n.getY(Math.floor(n.count / 2)) < 0) {
      const ix = g.index!; const arr = ix.array as Uint32Array | Uint16Array;
      for (let k = 0; k < arr.length; k += 3) { const t = arr[k + 1]; arr[k + 1] = arr[k + 2]; arr[k + 2] = t; }
      g.computeVertexNormals();
    }
    batch.add(g, m.roof, xf(cx, y0, cz), 0xffffff);
    g.dispose();
    // mặt dưới
    const gu = new THREE.BufferGeometry();
    gu.setAttribute('position', new THREE.Float32BufferAttribute(posU, 3)); gu.setIndex(idxU);
    gu.computeVertexNormals();
    const nu = gu.attributes.normal as THREE.BufferAttribute;
    if (nu.getY(Math.floor(nu.count / 2)) > 0) {
      const ix = gu.index!; const arr = ix.array as Uint32Array | Uint16Array;
      for (let k = 0; k < arr.length; k += 3) { const t = arr[k + 1]; arr[k + 1] = arr[k + 2]; arr[k + 2] = t; }
      gu.computeVertexNormals();
    }
    batch.add(gu, m.roofEdge, xf(cx, y0, cz), 0x7a4a30);
    gu.dispose();

    // diềm mái (fascia) dọc mép b=0
    const fp: number[] = [], fi: number[] = [];
    for (let i = 0; i <= NA; i++) {
      const a = (i / NA) * 2 - 1;
      surface(side, a, 0, o, v);
      fp.push(v.x, v.y, v.z, v.x, v.y - th * 1.5, v.z);
      if (i < NA) { const k = i * 2; fi.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); fg.setIndex(fi); fg.computeVertexNormals();
    batch.add(fg, m.lacquer, xf(cx, y0, cz), 0xffffff);
    // mặt kia của diềm (nhìn từ phía còn lại): thêm bản đảo
    const fi2 = fi.slice(); for (let k = 0; k < fi2.length; k += 3) { const t = fi2[k + 1]; fi2[k + 1] = fi2[k + 2]; fi2[k + 2] = t; }
    const fg2 = new THREE.BufferGeometry();
    fg2.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); fg2.setIndex(fi2); fg2.computeVertexNormals();
    batch.add(fg2, m.lacquer, xf(cx, y0, cz), 0xffffff);
    fg.dispose(); fg2.dispose();

    // đầu kèo dưới mái
    if (opts.rafters) {
      const cnt = Math.round(le * 1.4);
      for (let i = 1; i < cnt; i++) {
        const a = (i / cnt) * 2 - 1;
        surface(side, a, 0.02, o, v);
        batch.add(new THREE.CylinderGeometry(0.08, 0.08, 0.26, 6), m.gold, xf(cx + v.x, y0 + v.y - th - 0.16, cz + v.z), 0xffffff);
        batch.box(m.lacquer, 0.12, 0.12, 0.12, cx + v.x, y0 + v.y - th - 0.3, cz + v.z, 0, 0xffffff);
      }
    }
  }

  // bờ chảy (đường hip) + đầu đao cong
  const hipDefs: { side: 0 | 1; sx: number }[] = [{ side: 0, sx: 1 }, { side: 0, sx: -1 }, { side: 1, sx: 1 }, { side: 1, sx: -1 }];
  const tipPts: THREE.Vector3[] = [];
  for (const h of hipDefs) {
    const pts: THREE.Vector3[] = [];
    for (let j = 0; j <= 12; j++) {
      const b = (j / 12) * bmax;
      const p = surface(h.side, h.sx, b, o, new THREE.Vector3());
      pts.push(new THREE.Vector3(p.x + cx, p.y + y0 + 0.12, p.z + cz));
    }
    // đuôi cong vút ở góc
    const c0 = pts[0], dirOut = new THREE.Vector3(Math.sign(c0.x - cx), 0, Math.sign(c0.z - cz)).normalize();
    const tail: THREE.Vector3[] = [];
    for (let k = 1; k <= 5; k++) {
      const t = k / 5;
      tail.push(new THREE.Vector3(c0.x + dirOut.x * t * 0.95, c0.y + 0.1 + Math.pow(t, 1.8) * 1.15 + (opts.rise > 3 ? 0.2 : 0), c0.z + dirOut.z * t * 0.95));
    }
    const all = [...tail.reverse(), ...pts];
    tipPts.push(tail[0]);
    const curve = new THREE.CatmullRomCurve3(all);
    batch.add(taperedTube(curve, 26, 6, (t) => 0.05 + 0.2 * Math.pow(Math.min(1, t * 1.2 + 0.2), 0.7)), m.roof, undefined, 0x8a4a30);
    // chóp đầu đao vàng
    const tp = all[0];
    batch.sphere(m.gold, 0.16, tp.x, tp.y, tp.z, 1, 1.3, 1);
  }

  if (opts.ridge !== false && bmax >= 1) {
    const R = o.W - o.D;
    const topY = y0 + o.rise + 0.3;
    if (R > 0.2) {
      batch.box(m.roofEdge, R * 2 + 0.6, 0.34, 0.62, cx, topY - 0.15, cz, 0, 0x7a3a24);
      batch.box(m.gold, R * 2 + 0.7, 0.07, 0.7, cx, topY + 0.18, cz, 0, 0xffffff);
      // đầu bờ nóc: đuôi cá vút lên
      for (const sx of [-1, 1]) {
        const base = new THREE.Vector3(cx + sx * (R + 0.2), topY, cz);
        const curve = new THREE.CatmullRomCurve3([base, base.clone().add(new THREE.Vector3(sx * 0.35, 0.25, 0)), base.clone().add(new THREE.Vector3(sx * 0.7, 0.85, 0)), base.clone().add(new THREE.Vector3(sx * 0.5, 1.5, 0))]);
        batch.add(taperedTube(curve, 14, 6, (t) => 0.28 - 0.22 * t), m.gold, undefined, 0xffffff);
      }
    }
    if (opts.finial) {
      // tháp nhỏ + bánh xe pháp
      batch.cyl(m.roofEdge, 0.5, 0.7, 0.4, 8, cx, topY + 0.1, cz, 0x7a3a24);
      batch.cyl(m.gold, 0.18, 0.4, 0.9, 10, cx, topY + 0.5, cz);
      batch.sphere(m.gold, 0.32, cx, topY + 1.6, cz, 1, 1.15, 1);
      batch.cyl(m.gold, 0.04, 0.12, 0.9, 6, cx, topY + 1.75, cz);
      batch.add(new THREE.TorusGeometry(0.55, 0.06, 6, 20), m.gold, xf(cx, topY + 1.2, cz, 0), 0xffffff);
    }
  }
}
