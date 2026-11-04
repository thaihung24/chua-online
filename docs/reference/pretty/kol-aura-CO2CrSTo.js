import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import {
  $ as t,
  P as n,
  W as r,
  Z as i,
  c as a,
  dt as o,
  ft as s,
  l as c,
  pt as l,
  w as u,
} from "./three-BbSp8N3g.js";
var d = e({ shareKolAuras: () => M }),
  f = { low: { ring: 12, rise: 6 }, medium: { ring: 16, rise: 12 }, high: { ring: 16, rise: 12 } },
  p = `kol-aura`,
  m = 0.52,
  h = 0.85,
  g = 0.6,
  _ = 0.8,
  v = 960,
  y = `
#define TAU 6.28318530718
#define GOLDEN 2.39996323
uniform vec4 uAura[ AURA_MAX ];
uniform float uSeed[ AURA_MAX ];
uniform float uTime;
uniform float uScale;
uniform float uMaxSize;
varying vec3 vColor;
void main() {
  // position = ( ô hào quang, loại đốm: 0 vòng dưới chân / 1 bay lên, thứ tự đốm trong loại ).
  int slot = int( position.x + 0.5 );
  vec4 aura = uAura[ slot ];
  float seed = uSeed[ slot ];
  float k = position.z;
  vec3 p;
  float size;
  float gain;
  vec3 col;
  if ( position.y < 0.5 ) {
    // Vòng sáng sát mặt đất: các đốm xếp vòng quanh chân, quay rất chậm (40 s một vòng), mỗi đốm thở lệch pha theo
    // góc vàng nên vòng lấp lánh nhẹ như cánh sen chứ không nhấp nháy đồng loạt.
    float a = k / RING_COUNT * TAU + uTime * ( TAU / 40.0 ) + seed * TAU;
    p = vec3( cos( a ) * 0.4, 0.05, sin( a ) * 0.4 );
    size = RING_SIZE;
    gain = 0.5 * ( 0.72 + 0.28 * sin( uTime * ( TAU / 3.2 ) + k * GOLDEN + seed * TAU ) );
    col = vec3( 0.953, 0.776, 0.42 ); // #f3c66b
  } else {
    // Đốm bay lên: mỗi đốm đi hết vòng đời trong 4,8 s, xoắn ốc hẹp dần quanh thân, tan từ ngang ngực tới ngang đầu.
    float u = fract( uTime / 4.8 + k / RISE_COUNT + seed );
    float a = k * GOLDEN + u * ( 0.8 * TAU ) + uTime * ( TAU / 48.0 ) + seed * TAU;
    float r = mix( 0.38, 0.2, u );
    p = vec3( cos( a ) * r, 0.08 + u, sin( a ) * r );
    size = mix( 0.13, 0.07, u );
    gain = 0.85 * smoothstep( 0.0, 0.16, u ) * ( 1.0 - smoothstep( 0.55, 0.95, u ) );
    col = vec3( 1.0, 0.851, 0.541 ); // #ffd98a
  }
  // Lô nằm ở gốc cảnh, vị trí tính thẳng trong toạ độ thế giới.
  vec4 mv = viewMatrix * vec4( aura.xyz + p, 1.0 );
  gl_Position = projectionMatrix * mv;
  float depth = max( -mv.z, 0.05 );
  gl_PointSize = clamp( size * uScale / depth, 1.0, uMaxSize );
  gain *= aura.w * smoothstep( 0.3, 1.0, depth ) * ( 1.0 - smoothstep( VIEW_FAR - 12.0, VIEW_FAR, depth ) );
  vColor = col * gain;
  // Đốm gần như tắt thì đẩy ra ngoài khung hình để khỏi tốn pixel.
  if ( gain < 0.002 ) gl_Position = vec4( 2.0, 2.0, 2.0, 1.0 );
}
`,
  b = `
varying vec3 vColor;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d2 = dot( c, c );
  // Quầng mềm cộng một lõi sáng nhỏ, tắt hẳn trước mép điểm (không lộ viền vuông).
  float a = ( 0.7 * exp( -d2 * 4.0 ) + 0.45 * exp( -d2 * 26.0 ) ) * ( 1.0 - smoothstep( 0.6, 1.0, d2 ) );
  gl_FragColor = vec4( vColor * a, 1.0 );
}
`;
function x() {
  return (
    typeof window < `u` &&
    typeof window.matchMedia == `function` &&
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  );
}
function S(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++) ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 16777619)));
  return (t >>> 0) / 4294967296;
}
function C(e, t) {
  let n = new Float32Array(8 * (e + t) * 3),
    r = 0;
  for (let i = 0; i < 8; i++) {
    for (let t = 0; t < e; t++) ((n[r++] = i), (n[r++] = 0), (n[r++] = t));
    for (let e = 0; e < t; e++) ((n[r++] = i), (n[r++] = 1), (n[r++] = e));
  }
  let i = new c();
  return (i.setAttribute(`position`, new a(n, 3)), i.setDrawRange(0, 0), i);
}
var w = new o(),
  T = (e) => (e < 0 ? 0 : e > 1 ? 1 : e),
  E = new n(),
  D = new u(),
  O = new t(new s(), h);
function k(e, t = {}) {
  let n = f[t.quality ?? `medium`] ?? f.medium,
    a = n.ring + n.rise,
    o = t.reducedMotion ?? x(),
    s = C(n.ring, n.rise),
    c = Array.from({ length: 8 }, () => new l()),
    u = new Float32Array(8),
    d = {
      uAura: { value: c },
      uSeed: { value: u },
      uTime: { value: 0 },
      uScale: { value: 600 },
      uMaxSize: { value: 128 },
    },
    k = new i({
      name: p,
      uniforms: d,
      defines: {
        AURA_MAX: 8,
        RING_COUNT: n.ring.toFixed(1),
        RISE_COUNT: n.rise.toFixed(1),
        RING_SIZE: ((2 * Math.PI * 0.4 * 1.45) / n.ring).toFixed(3),
        VIEW_FAR: (40).toFixed(1),
      },
      vertexShader: y,
      fragmentShader: b,
      transparent: !0,
      depthWrite: !1,
      blending: 2,
      fog: !1,
    }),
    A = new r(s, k);
  ((A.name = p), (A.frustumCulled = !1), (A.renderOrder = 9));
  let j = t.camera ?? null,
    M = new Map(),
    N = [],
    P = [],
    F = 0,
    I = NaN,
    L = !1,
    R = !1;
  function z(t) {
    for (let n = t; n !== null; n = n.parent) {
      if (!n.visible) return !1;
      if (n === e) return !0;
    }
    return !1;
  }
  function B(e) {
    (e.updateMatrixWorld(),
      E.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
      D.setFromProjectionMatrix(E));
    let t = e.matrixWorldInverse.elements;
    for (let e = 0; e < N.length; e++) {
      let n = N[e];
      if (!z(n.root)) continue;
      n.root.updateWorldMatrix(!0, !1);
      let r = n.root.matrixWorld.elements,
        i = r[12] ?? 0,
        a = (r[13] ?? 0) + m,
        o = r[14] ?? 0;
      if (
        !(-((t[2] ?? 0) * i + (t[6] ?? 0) * a + (t[10] ?? 0) * o + (t[14] ?? 0)) - h > 40) &&
        (O.center.set(i, a, o), D.intersectsSphere(O))
      )
        return !0;
    }
    return !1;
  }
  j &&
    (A.updateMatrixWorld = (e) => {
      (r.prototype.updateMatrixWorld.call(A, e), (A.visible = B(j)));
    });
  function V(e, t) {
    let n = performance.now(),
      r = Number.isFinite(I) ? Math.min(Math.max((n - I) / 1e3, 0), 0.25) : 0;
    if (
      ((I = n),
      e.getDrawingBufferSize(w),
      (d.uScale.value = (t.projectionMatrix.elements[5] ?? 1) * 0.5 * w.y),
      !L)
    ) {
      L = !0;
      let t = e.getContext(),
        n = t.getParameter(t.ALIASED_POINT_SIZE_RANGE);
      n && (n[1] ?? 0) > 1 && (d.uMaxSize.value = Math.min(n[1] ?? 0, 512));
    }
    o || (d.uTime.value = (n / 1e3) % v);
    let i = t.matrixWorld.elements,
      l = i[12] ?? 0,
      f = i[13] ?? 0,
      p = i[14] ?? 0;
    F++;
    let m = 0;
    for (let e = 0; e < N.length; e++) {
      let t = N[e];
      if (!z(t.root)) continue;
      let n = t.root.matrixWorld.elements;
      ((t.x = n[12] ?? 0), (t.y = n[13] ?? 0), (t.z = n[14] ?? 0));
      let r = t.x - l,
        i = t.y - f,
        a = t.z - p,
        o = (r * r + i * i + a * a) * (t.on ? _ : 1),
        s;
      if (m < 8) s = m++;
      else if (o < P[m - 1].rank) s = m - 1;
      else continue;
      for (; s > 0 && P[s - 1].rank > o;) ((P[s] = P[s - 1]), s--);
      ((t.rank = o), (P[s] = t));
    }
    for (let e = 0; e < m; e++) {
      let t = P[e];
      ((t.stamp = F), (t.seen = n), (t.on = !0), (t.glow = o ? 1 : Math.min(1, t.glow + r / g)));
      let i = t.root.userData.blobOpacity,
        a = t.glow * (typeof i == `number` ? T(i) : 1);
      (c[e].set(t.x, t.y, t.z, a), (u[e] = t.seed));
    }
    for (let e = 0; e < N.length; e++) {
      let t = N[e];
      t.stamp !== F && ((t.on = !1), n - t.seen > 300 && (t.glow = 0));
    }
    (s.setDrawRange(0, m * a), (k.uniformsNeedUpdate = !0));
  }
  return (
    (A.onBeforeRender = (e, t, n) => V(e, n)),
    {
      set(t, n) {
        if (R) return;
        let r = M.get(t);
        if (n === null) {
          if (!r) return;
          M.delete(t);
          let e = N.indexOf(r),
            n = N.pop();
          (n !== r && (N[e] = n), N.length === 0 && (A.removeFromParent(), (P.length = 0)));
          return;
        }
        if (r) {
          r.root !== n && ((r.root = n), (r.on = !1), (r.glow = 0));
          return;
        }
        let i = { root: n, seed: S(t), glow: 0, on: !1, stamp: 0, seen: -1 / 0, x: 0, y: 0, z: 0, rank: 0 };
        (M.set(t, i), N.push(i), A.parent !== e && (e.add(A), (I = NaN)));
      },
      get size() {
        return N.length;
      },
      dispose() {
        R ||
          ((R = !0),
          A.removeFromParent(),
          M.clear(),
          (N.length = 0),
          (P.length = 0),
          s.dispose(),
          k.dispose());
      },
    }
  );
}
var A = null,
  j = 0;
function M(e, t = {}) {
  let n = A;
  (n === null || n.scene !== e) && ((n = { scene: e, layer: k(e, t), users: 0 }), (A = n));
  let r = n;
  r.users++;
  let i = `${++j}:`,
    a = new Set(),
    o = !1;
  return {
    set(e, t) {
      if (o) return;
      let n = i + e;
      (t === null ? a.delete(n) : a.add(n), r.layer.set(n, t));
    },
    get size() {
      return a.size;
    },
    dispose() {
      if (!o) {
        o = !0;
        for (let e of a) r.layer.set(e, null);
        (a.clear(), r.users--, r.users > 0 || (r.layer.dispose(), A === r && (A = null)));
      }
    },
  };
}
export { d as t };
