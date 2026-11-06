/**
 * Đạo cụ cầm tay của nhân vật (hương, hoa, nến, đèn hoa đăng, ống xăm, chậu cá, cành lộc, ruy-băng, chổi, dùi mõ, tràng hạt)
 * và chiếc mõ đặt dưới đất. Gốc mỗi đạo cụ = chỗ cầm; trục +y hướng lên (chổi hướng xuống -y).
 */
import * as THREE from 'three';
import { ball, box, merge, paint, tube, xf, type V3 } from './geo';
import { lotusBloomGeoms } from './accessories';

export type PropName =
  | 'incense' | 'flowers' | 'taper' | 'lantern' | 'tube' | 'bowl' | 'twig' | 'ribbon' | 'broom' | 'mallet' | 'beads' | 'lotusHeld'
  | 'chicken' | 'grainBowl';

/** Chiều dài từ chỗ cầm tới mũi chổi (m). */
export const BROOM_LEN = 0.46;

interface PropGeo { solid: THREE.BufferGeometry | null; glow: THREE.BufferGeometry | null }
const propCache = new Map<string, PropGeo>();

const solidMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.82,
  metalness: 0,
  envMapIntensity: 0.26,
  side: THREE.DoubleSide,
});
solidMat.onBeforeCompile = (sh) => {
  sh.fragmentShader = sh.fragmentShader.replace(
    '#include <emissivemap_fragment>',
    '#include <emissivemap_fragment>\n\ttotalEmissiveRadiance += diffuseColor.rgb * vec3(0.26, 0.22, 0.195);',
  );
};
solidMat.customProgramCacheKey = () => 'w2-prop-warm-v1';
const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });

function lotusMerged(s: number, pos: V3): THREE.BufferGeometry[] { return lotusBloomGeoms(s, pos); }

function build(name: PropName): PropGeo {
  const S: THREE.BufferGeometry[] = [];
  const G: THREE.BufferGeometry[] = [];
  switch (name) {
    case 'incense':
      for (let i = -1; i <= 1; i++) {
        S.push(tube([i * 0.006, 0, 0], [i * 0.022, 0.25, 0], 0.0065, 0.0055, '#7a4b2a', 5));
        G.push(ball(0.011, '#ff8a3a', [i * 0.0225, 0.255, 0], 1, [6, 5]));
      }
      S.push(tube([0, -0.02, 0], [0, 0.02, 0], 0.016, 0.016, '#c0392b', 6));
      break;
    case 'flowers': {
      for (let i = -1; i <= 1; i++) S.push(tube([0, -0.02, 0], [i * 0.05, 0.19, i * 0.01], 0.008, 0.007, '#5a8f4e', 5));
      S.push(...lotusMerged(1.0, [0, 0.19, 0]));
      S.push(...lotusMerged(0.85, [-0.1, 0.17, 0.0]));
      S.push(...lotusMerged(0.85, [0.1, 0.17, 0.01]));
      S.push(ball(0.03, '#4f7f46', [0.0, 0.07, 0], [1.6, 1.2, 1], [8, 6]));
      break;
    }
    case 'taper':
      S.push(tube([0, -0.03, 0], [0, 0.24, 0], 0.0095, 0.0085, '#a8322a', 6));
      G.push(ball(0.016, '#ffd36a', [0, 0.268, 0], [0.8, 1.7, 0.8], [8, 6]));
      G.push(ball(0.009, '#ffffff', [0, 0.262, 0], [0.8, 1.5, 0.8], [6, 5]));
      break;
    case 'tube': {
      S.push(xf(paint(new THREE.CylinderGeometry(0.043, 0.036, 0.22, 12), '#a63d2b'), [0, 0.04, 0]));
      S.push(xf(paint(new THREE.TorusGeometry(0.043, 0.008, 5, 14), '#e9c46a'), [0, 0.13, 0], [Math.PI / 2, 0, 0]));
      S.push(xf(paint(new THREE.TorusGeometry(0.04, 0.008, 5, 14), '#e9c46a'), [0, -0.04, 0], [Math.PI / 2, 0, 0]));
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        const dx = Math.cos(a) * 0.02;
        const dz = Math.sin(a) * 0.02;
        S.push(tube([dx * 0.4, 0.1, dz * 0.4], [dx * 1.3, 0.25 + (i % 3) * 0.025, dz * 1.3], 0.0045, 0.0045, '#e2bd83', 4));
      }
      break;
    }
    case 'bowl': {
      const bowl = paint(new THREE.SphereGeometry(0.1, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), '#c9a27a');
      S.push(xf(bowl, [0, 0.03, 0], undefined, [1, 0.8, 1]));
      S.push(xf(paint(new THREE.TorusGeometry(0.1, 0.008, 5, 18), '#8a6a4b'), [0, 0.03, 0], [Math.PI / 2, 0, 0]));
      S.push(xf(paint(new THREE.CircleGeometry(0.093, 16), '#7bbbd8'), [0, 0.026, 0], [-Math.PI / 2, 0, 0]));
      S.push(ball(0.02, '#ff9a3c', [0.02, 0.034, 0.01], [1.6, 0.8, 0.9], [8, 6]));
      S.push(ball(0.017, '#ff7b2c', [-0.035, 0.034, -0.02], [1.6, 0.8, 0.9], [8, 6]));
      break;
    }
    case 'twig': {
      S.push(tube([0, -0.04, 0], [0.03, 0.26, 0], 0.011, 0.006, '#6b4a2a', 5));
      S.push(tube([0.012, 0.1, 0], [0.1, 0.2, 0.02], 0.006, 0.004, '#6b4a2a', 4));
      S.push(tube([0.02, 0.17, 0], [-0.07, 0.25, 0.0], 0.005, 0.004, '#6b4a2a', 4));
      const leaves: V3[] = [[0.03, 0.27, 0], [0.1, 0.22, 0.02], [-0.07, 0.27, 0], [0.07, 0.15, 0.01], [-0.03, 0.2, 0.01], [0.0, 0.31, 0.01]];
      leaves.forEach((p, i) => S.push(ball(0.035, i % 2 ? '#5fa14d' : '#7dbb5c', p, [1.4, 0.45, 0.8], [8, 6], [0, 0, (i - 2.5) * 0.5])));
      S.push(ball(0.02, '#d6392f', [0.0, 0.22, 0.03], 1, [8, 6]));
      break;
    }
    case 'ribbon':
      S.push(box(0.034, 0.3, 0.006, '#d6392f', [0, 0.05, 0], [0, 0, 0]));
      S.push(box(0.03, 0.14, 0.006, '#e24c3f', [0.03, -0.14, 0], [0, 0, 0.3]));
      S.push(box(0.03, 0.14, 0.006, '#c0302a', [-0.03, -0.14, 0], [0, 0, -0.3]));
      break;
    case 'broom': {
      S.push(tube([0, 0.36, 0], [0, -0.25, 0], 0.0125, 0.014, '#8e6b3e', 6));
      S.push(xf(paint(new THREE.ConeGeometry(0.145, 0.22, 14, 1, true), '#d1ab60'), [0, -0.35, 0]));
      S.push(xf(paint(new THREE.ConeGeometry(0.105, 0.19, 12, 1, true), '#e2be72'), [0, -0.35, 0]));
      S.push(xf(paint(new THREE.TorusGeometry(0.05, 0.012, 5, 12), '#7a3b2a'), [0, -0.26, 0], [Math.PI / 2, 0, 0]));
      break;
    }
    case 'mallet':
      S.push(tube([0, 0.08, 0], [0, -0.1, 0], 0.011, 0.011, '#8a5a33', 6));
      S.push(ball(0.03, '#b07a43', [0, -0.115, 0], 1, [10, 8]));
      break;
    case 'beads': {
      const N = 22;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        S.push(ball(0.0125, i === 0 ? '#e9c46a' : '#5a3a22', [Math.sin(a) * 0.065, -0.07 + Math.cos(a) * 0.075, 0], 1, [6, 5]));
      }
      S.push(ball(0.02, '#e9c46a', [0, -0.145, 0], 1, [8, 6]));
      S.push(tube([0, -0.16, 0], [0, -0.215, 0], 0.012, 0.007, '#c0392b', 5));
      break;
    }
    case 'lotusHeld':
      S.push(tube([0, -0.04, 0], [0.01, 0.25, 0], 0.009, 0.007, '#5a8f4e', 5));
      S.push(...lotusMerged(1.25, [0.01, 0.25, 0]));
      S.push(ball(0.045, '#5fa14d', [-0.04, 0.09, 0], [1.6, 0.3, 1.1], [8, 6], [0, 0, 0.5]));
      break;
    case 'grainBowl': {
      const basket = paint(new THREE.SphereGeometry(0.095, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), '#c89e58');
      S.push(xf(basket, [0, 0.03, 0], undefined, [1, 0.78, 1]));
      S.push(xf(paint(new THREE.TorusGeometry(0.095, 0.009, 5, 16), '#8b6234'), [0, 0.03, 0], [Math.PI / 2, 0, 0]));
      S.push(ball(0.082, '#f0c246', [0, 0.025, 0], [1, 0.36, 1], [10, 7]));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        S.push(ball(0.014, '#ffe074', [Math.cos(a) * 0.042, 0.052, Math.sin(a) * 0.042], [1.2, 0.6, 0.9], [6, 5]));
      }
      break;
    }
    case 'chicken': {
      // Chú gà mơ vàng tròn trịa nằm gọn trong vòng tay nhân vật (+z = hướng trước ngực)
      S.push(ball(0.115, '#e5a83b', [0, 0.055, 0], [0.95, 0.84, 1.22], [12, 9]));
      // Hai cánh khép ấm hai bên
      S.push(ball(0.068, '#b86c22', [-0.092, 0.058, -0.01], [0.38, 0.72, 1.15], [9, 7]));
      S.push(ball(0.068, '#b86c22', [0.092, 0.058, -0.01], [0.38, 0.72, 1.15], [9, 7]));
      // Đuôi cong phía sau (-z)
      S.push(xf(paint(new THREE.ConeGeometry(0.042, 0.14, 6), '#4e2e18'), [0, 0.12, -0.13], [-0.65, 0, 0]));
      // Cổ & đầu gà ngẩng lên phía trước (+z)
      S.push(tube([0, 0.08, 0.08], [0, 0.165, 0.115], 0.052, 0.042, '#f0be52', 8));
      S.push(ball(0.064, '#f0be52', [0, 0.185, 0.125], [0.95, 0.95, 1.02], [10, 8]));
      // Mào gà 3 khía đỏ tươi + tích gà + mỏ vàng cam + đôi mắt đen
      S.push(ball(0.022, '#d92b28', [0, 0.248, 0.142], [0.55, 1.1, 0.85], [7, 6]));
      S.push(ball(0.02, '#d92b28', [0, 0.242, 0.115], [0.55, 0.95, 0.8], [7, 6]));
      S.push(ball(0.016, '#d92b28', [0, 0.142, 0.168], [0.65, 0.95, 0.65], [6, 5]));
      S.push(xf(paint(new THREE.ConeGeometry(0.022, 0.06, 6), '#f2a428'), [0, 0.18, 0.205], [Math.PI / 2, 0, 0]));
      S.push(ball(0.012, '#1b1614', [-0.048, 0.196, 0.152], 1, [6, 5]));
      S.push(ball(0.012, '#1b1614', [0.048, 0.196, 0.152], 1, [6, 5]));
      break;
    }
  }
  return { solid: S.length ? merge(S) : null, glow: G.length ? merge(G) : null };
}

export interface PropInstance { group: THREE.Group; dispose(): void }

/** Màu đèn → vật liệu phát sáng riêng của từng đèn. */
export function createProp(name: PropName, color?: string): PropInstance {
  const group = new THREE.Group();
  group.visible = false;
  const owned: Array<{ dispose(): void }> = [];
  if (name === 'lantern') {
    const col = new THREE.Color(color ?? '#ffb24a');
    const geo = lanternGeometry();
    const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.9, roughness: 0.6, side: THREE.DoubleSide, transparent: true, opacity: 0.96 });
    owned.push(mat);
    group.add(new THREE.Mesh(geo.petals, mat));
    group.add(new THREE.Mesh(geo.base, solidMat));
    group.add(new THREE.Mesh(geo.flame, glowMat));
  } else {
    let pg = propCache.get(name);
    if (!pg) { pg = build(name); propCache.set(name, pg); }
    if (pg.solid) group.add(new THREE.Mesh(pg.solid, solidMat));
    if (pg.glow) group.add(new THREE.Mesh(pg.glow, glowMat));
  }
  return { group, dispose() { for (const o of owned) o.dispose(); } };
}

let lanternGeo: { petals: THREE.BufferGeometry; base: THREE.BufferGeometry; flame: THREE.BufferGeometry } | null = null;
function lanternGeometry(): { petals: THREE.BufferGeometry; base: THREE.BufferGeometry; flame: THREE.BufferGeometry } {
  if (lanternGeo) return lanternGeo;
  const petals: THREE.BufferGeometry[] = [];
  for (let ring = 0; ring < 2; ring++) {
    const n = ring === 0 ? 8 : 6;
    for (let i = 0; i < n; i++) {
      const a = ((i + ring * 0.5) / n) * Math.PI * 2;
      const g = new THREE.SphereGeometry(1, 8, 6);
      g.scale(0.045, 0.085 - ring * 0.012, 0.016);
      g.translate(0, 0.085 - ring * 0.012, 0);
      g.applyMatrix4(new THREE.Matrix4().makeRotationY(a).multiply(new THREE.Matrix4().makeRotationZ(-(0.95 - ring * 0.5))));
      g.translate(0, 0.012 + ring * 0.01, 0);
      petals.push(g);
    }
  }
  const pg = merge(petals.map((g) => paint(g, '#ffffff')));
  const base = merge([xf(paint(new THREE.CylinderGeometry(0.075, 0.085, 0.02, 14), '#6b4a2a'), [0, 0, 0])]);
  const flame = merge([ball(0.02, '#ffe9a0', [0, 0.06, 0], [0.8, 1.5, 0.8], [8, 6])]);
  lanternGeo = { petals: pg, base, flame };
  return lanternGeo;
}

/** Chiếc mõ gỗ đặt trên bồ đoàn nhỏ (nhân vật ngồi tụng kinh). Gốc ở mặt đất. */
let fishGeo: THREE.BufferGeometry | null = null;
export function createFish(): THREE.Mesh {
  if (!fishGeo) {
    fishGeo = merge([
      xf(paint(new THREE.CylinderGeometry(0.13, 0.15, 0.04, 18), '#a1302a'), [0, 0.02, 0]),
      ball(0.1, '#c0752f', [0, 0.115, 0], [1.15, 0.88, 0.95], [16, 12]),
      xf(paint(new THREE.TorusGeometry(0.1, 0.01, 5, 16, Math.PI), '#6b3b17'), [0, 0.12, 0.0], [0, 0, 0], [1.1, 0.4, 1]),
      box(0.12, 0.012, 0.03, '#4a2a12', [0, 0.17, 0.0]),
    ]);
  }
  return new THREE.Mesh(fishGeo, solidMat);
}

export function disposeProps(): void {
  for (const pg of propCache.values()) { pg.solid?.dispose(); pg.glow?.dispose(); }
  propCache.clear();
  if (lanternGeo) { lanternGeo.petals.dispose(); lanternGeo.base.dispose(); lanternGeo.flame.dispose(); lanternGeo = null; }
  fishGeo?.dispose(); fishGeo = null;
}
