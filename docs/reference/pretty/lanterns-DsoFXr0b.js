import {
  A as e,
  I as t,
  K as n,
  M as r,
  P as i,
  S as a,
  W as o,
  Z as s,
  _ as c,
  b as l,
  c as u,
  dt as d,
  et as f,
  ft as p,
  g as m,
  h,
  j as g,
  k as ee,
  l as _,
  lt as v,
  m as y,
  q as b,
  s as x,
  t as S,
  ut as C,
  y as te,
} from "./three-BbSp8N3g.js";
import { i as w } from "./sky-X0ndF2_S.js";
import { Ft as T } from "./index-e_Bx6V48.js";
var E = {
    lacquer: 10889247,
    lacquerDark: 8003353,
    lacquerPillar: 8008232,
    lacquerBrown: 5909018,
    fascia: 9972256,
    gold: 14725194,
    goldDeep: 13208107,
    goldLight: 15913594,
    lantern: 16757596,
    pink: 15444411,
    pinkLight: 16174552,
    wood: 6965043,
    woodDark: 3877406,
    roofUnder: 12615516,
    ridge: 7162426,
    mossTileDark: 6969925,
    mossTileWarm: 9071179,
    bronze: 8675642,
    plaster: 14998731,
    ochre: 14271904,
    brick: 10117702,
    slate: 7239552,
    stone: 10130308,
    stoneDark: 7301726,
    stoneLight: 12104097,
    grass: 5077562,
    leaf: 4880956,
    water: 3108723,
    hair: 1845056,
  },
  D = Math.PI * 2;
function ne(e) {
  let t = e >>> 0;
  return () => {
    t = (t + 1831565813) >>> 0;
    let e = t;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
function O(e, t, n) {
  return e < t ? t : e > n ? n : e;
}
function re(e, t, n) {
  return e + (t - e) * n;
}
function k(e, t, n) {
  let r = O((n - e) / (t - e), 0, 1);
  return r * r * (3 - 2 * r);
}
function ie(e, t, n, r) {
  return Math.atan2(e - n, t - r) + 0;
}
var ae = 0.06;
function oe(e, t, n, r) {
  let i = [e / 2, t / 2, n / 2],
    o = [],
    s = [],
    c = [],
    l = new Map(),
    u = (e, t, n, a) => {
      let c = `${e}${t}${n}${a}`,
        u = l.get(c);
      if (u !== void 0) return u;
      let d = [0, 1, 2].filter((t) => t !== e),
        f = [0, 0, 0];
      ((f[e] = t * i[e]), (f[d[0]] = n * (i[d[0]] - r)), (f[d[1]] = a * (i[d[1]] - r)));
      let p = [0, 0, 0];
      p[e] = t;
      let m = o.length / 3;
      return (o.push(f[0], f[1], f[2]), s.push(p[0], p[1], p[2]), l.set(c, m), m);
    },
    d = (e, t, n) => {
      let r = (e) => [o[e * 3], o[e * 3 + 1], o[e * 3 + 2]],
        i = (e) => [s[e * 3], s[e * 3 + 1], s[e * 3 + 2]],
        [a, l, u] = [r(e), r(t), r(n)],
        d = [l[0] - a[0], l[1] - a[1], l[2] - a[2]],
        f = [u[0] - a[0], u[1] - a[1], u[2] - a[2]],
        p = [d[1] * f[2] - d[2] * f[1], d[2] * f[0] - d[0] * f[2], d[0] * f[1] - d[1] * f[0]],
        [m, h, g] = [i(e), i(t), i(n)];
      [0, 1, 2].reduce((e, t) => e + p[t] * (m[t] + h[t] + g[t]), 0) >= 0 ? c.push(e, t, n) : c.push(e, n, t);
    },
    f = (e, t, n, r) => {
      (d(e, t, n), d(e, n, r));
    },
    p = [-1, 1];
  for (let e = 0; e < 3; e++)
    for (let t of p) f(u(e, t, -1, -1), u(e, t, 1, -1), u(e, t, 1, 1), u(e, t, -1, 1));
  for (let e = 0; e < 3; e++)
    for (let t = e + 1; t < 3; t++) {
      let n = 3 - e - t;
      for (let r of p)
        for (let i of p) {
          let a = (e, t, r, i, a) => {
            let o = [0, 1, 2].filter((t) => t !== e),
              s = [0, 0, 0];
            return ((s[n] = r), (s[i] = a), u(e, t, s[o[0]], s[o[1]]));
          };
          f(a(e, r, -1, t, i), a(e, r, 1, t, i), a(t, i, 1, e, r), a(t, i, -1, e, r));
        }
    }
  for (let e of p) for (let t of p) for (let n of p) d(u(0, e, t, n), u(1, t, e, n), u(2, n, e, t));
  let m = new _();
  return (m.setAttribute(`position`, new a(o, 3)), m.setAttribute(`normal`, new a(s, 3)), m.setIndex(c), m);
}
var se = 0.22,
  ce = 1.4,
  le = new i(),
  A = new n(),
  j = new l(0, 0, 0, `YXZ`),
  M = new p(),
  N = new p(),
  P = new y(),
  ue = new p(0, 1, 0);
function F(e) {
  (j.set(e.rx ?? 0, e.ry ?? 0, e.rz ?? 0, `YXZ`), A.setFromEuler(j));
  let t = e.s ?? 1;
  return (M.set(e.x ?? 0, e.y ?? 0, e.z ?? 0), N.set(e.sx ?? t, e.sy ?? t, e.sz ?? t), le.compose(M, A, N));
}
function de(e) {
  if (e.index) return;
  let t = e.getAttribute(`position`).count,
    n = new Uint32Array(t);
  for (let e = 0; e < t; e++) n[e] = e;
  e.setIndex(new v(n, 1));
}
function I(e, t, n = !1) {
  for (let r of Object.keys(e.attributes))
    r !== `position` && r !== `normal` && ((t && r === `color`) || (n && r === `uv`) || e.deleteAttribute(r));
  (e.getAttribute(`normal`) || e.computeVertexNormals(), de(e), e.clearGroups());
}
var fe = class {
  constructor(e) {
    (T(this, `parts`, []), T(this, `rand`, void 0), T(this, `buildHooks`, []), (this.rand = e));
  }
  get size() {
    return this.parts.length;
  }
  onBuild(e) {
    this.buildHooks.push(e);
  }
  project(e, t) {
    return !1;
  }
  add(e, t, n, r) {
    return this.addPart(e, t, { kind: `generic` }, n, r);
  }
  addPart(e, t, n, r, o) {
    (r && e.applyMatrix4(r instanceof i ? r : F(r)),
      e.getAttribute(`normal`) || e.computeVertexNormals(),
      I(e, !1, this.project(e, n)));
    let s = e.getAttribute(`position`),
      c = s.count;
    P.setHex(t);
    let l = P.r,
      u = P.g,
      d = P.b;
    if (o?.jitter) {
      let e = 1 + (this.rand() * 2 - 1) * o.jitter;
      ((l *= e), (u *= e), (d *= e));
    }
    let f = o?.ao ?? 0,
      p = e.getAttribute(`normal`),
      m = new Float32Array(c * 3),
      h = 1 / 0,
      g = -1 / 0;
    if (o?.topShade)
      for (let e = 0; e < c; e++) {
        let t = s.getY(e);
        (t < h && (h = t), t > g && (g = t));
      }
    for (let e = 0; e < c; e++) {
      let t = 1;
      (f > 0
        ? (t = 0.72 + 0.28 * O(s.getY(e) / f, 0, 1))
        : o?.ao === void 0 && Math.abs(p.getY(e)) < 0.7 && (t = 1 - se * (1 - O(s.getY(e) / ce, 0, 1))),
        o?.topShade && g > h && (t *= 1 - o.topShade * ((s.getY(e) - h) / (g - h))),
        (m[e * 3] = l * t),
        (m[e * 3 + 1] = u * t),
        (m[e * 3 + 2] = d * t));
    }
    return (e.setAttribute(`color`, new a(m, 3)), this.parts.push(e), this);
  }
  addColored(e) {
    return (
      e.getAttribute(`normal`) || e.computeVertexNormals(),
      I(e, !0, this.project(e, { kind: `generic` })),
      this.parts.push(e),
      this
    );
  }
  cuboid(e, t, n, r, i, a, o, s) {
    let c = t - e,
      l = r - n,
      u = a - i,
      d = Math.min(s?.round ?? 0, ae, Math.min(c, l, u) / 2 - 1e-4),
      f = d > 0.001 ? oe(c, l, u, d) : new x(c, l, u);
    return this.add(f, o, { x: (e + t) / 2, y: (n + r) / 2, z: (i + a) / 2 }, s);
  }
  cylinder(e, t, n, r, i, a, o, s, c) {
    return this.addPart(
      new m(r, i, a, o, 1),
      s,
      { kind: `tube`, radius: (r + i) / 2, length: a, upright: !0 },
      { x: e, y: t + a / 2, z: n },
      c,
    );
  }
  limb(e, t, r, a, o, s, c) {
    let l = new p().subVectors(t, e),
      u = l.length();
    if (u < 1e-6) return this;
    let d = new n().setFromUnitVectors(ue, l.multiplyScalar(1 / u)),
      f = new p().addVectors(e, t).multiplyScalar(0.5),
      h = new i().compose(f, d, new p(1, 1, 1));
    return this.addPart(
      new m(a, r, u, o, 1),
      s,
      { kind: `tube`, radius: (r + a) / 2, length: u, upright: !1 },
      h,
      c,
    );
  }
  build() {
    for (let e of this.buildHooks.splice(0)) e();
    if (this.parts.length === 0) return null;
    let e = S(this.parts, !1);
    for (let e of this.parts) e.dispose();
    return ((this.parts.length = 0), e);
  }
};
function pe(e) {
  let t = Math.ceil((e.x1 - e.x0) / e.cell - 1e-6),
    n = Math.ceil((e.z1 - e.z0) / e.cell - 1e-6),
    r = [],
    i = [],
    o = [],
    s = [],
    c = [],
    l = new y(),
    u = e.jitter ?? 0.07,
    d = 0;
  for (let a = 0; a < n; a++) {
    let n = e.z0 + a * e.cell,
      f = Math.min(e.z1, n + e.cell);
    for (let a = 0; a < t; a++) {
      let t = e.x0 + a * e.cell,
        p = Math.min(e.x1, t + e.cell);
      if (e.skip?.((t + p) / 2, (n + f) / 2)) continue;
      let m = e.palette[Math.floor(e.rand() * e.palette.length)] ?? 8947848;
      l.setHex(m);
      let h = 1 + (e.rand() * 2 - 1) * u;
      r.push(t, e.y, n, p, e.y, n, p, e.y, f, t, e.y, f);
      for (let r = 0; r < 4; r++) {
        i.push(0, 1, 0);
        let a = e.tint ? e.tint(r === 1 || r === 2 ? p : t, r >= 2 ? f : n) * h : h;
        o.push(l.r * a, l.g * a, l.b * a);
      }
      if (e.uv && e.uvMetres) {
        let r = e.uvMetres;
        s.push(t / r, n / r, p / r, n / r, p / r, f / r, t / r, f / r);
      } else e.uv && s.push(0, 0, 1, 0, 1, 1, 0, 1);
      (c.push(d, d + 2, d + 1, d, d + 3, d + 2), (d += 4));
    }
  }
  if (d === 0) return null;
  let f = new _();
  return (
    f.setAttribute(`position`, new a(r, 3)),
    f.setAttribute(`normal`, new a(i, 3)),
    f.setAttribute(`color`, new a(o, 3)),
    e.uv && f.setAttribute(`uv`, new a(s, 2)),
    f.setIndex(c),
    f
  );
}
function me(e, t, n, r) {
  e.colliders.push({ kind: `circle`, x: t, z: n, r });
}
function he(e, t, n, r, i) {
  e.colliders.push({ kind: `box`, minX: t, maxX: n, minZ: r, maxZ: i });
}
var L = new WeakSet();
function ge(e, t) {
  return e.mats.surfaces.material(t);
}
function _e(e, t) {
  let n = e.mats.surfaces.batch(t, e.rand);
  return (
    L.has(e.flat) ||
      (L.add(e.flat),
      e.flat.onBuild(() => {
        (L.delete(e.flat), R(e));
      })),
    n
  );
}
function R(e, t = e.dynamic) {
  e.mats.surfaces.flush(t, { shadows: e.quality !== `low` });
}
function ve(e) {
  return e === `low` ? 8 : e === `medium` ? 12 : 16;
}
var z = { string: 0.3, bodyTop: 0.35, bodyH: 0.42, tassel: 0.12, glowY: 0.58 };
function B(e, t = new p()) {
  let n = 0;
  return (
    e.kind === `hall` ? (n = -z.glowY) : e.kind === `outdoor` && (n = -((e.string ?? 0.35) + 0.32)),
    t.set(e.x, e.y + n, e.z)
  );
}
var V = {
    radius: 7.5,
    cell: 8,
    max: 0.8,
    kinds: {
      hall: { falloff: 0.1, strength: 0.9 },
      outdoor: { falloff: 0.35, strength: 0.7 },
      stone: { falloff: 0.3, strength: 0.7 },
      candle: { falloff: 0.7, strength: 0.9 },
    },
  },
  H = `lanternBounce`,
  U = {
    uLanternNight: { value: 0 },
    uLanternWarm: { value: new y(16753226) },
    uLanternHot: { value: new y(16751173) },
  };
function W(e) {
  U.uLanternNight.value = O(Number.isFinite(e) ? e : 0, 0, 1);
}
function ye() {
  let e = w.uStars.value,
    t = 0.3 * k(0.5, 1, w.uGlowAmt.value);
  return O(Math.max(e, t), 0, 1);
}
var G = 4096,
  K = (e, t) => (e + G) * 8192 + (t + G);
function be(e) {
  let t = new Map(),
    n = new p();
  for (let r of e) {
    B(r, n);
    let e = V.kinds[r.kind],
      i = K(Math.floor(n.x / V.cell), Math.floor(n.z / V.cell)),
      a = t.get(i);
    (a || t.set(i, (a = [])), a.push(n.x, n.y, n.z, e.falloff, e.strength));
  }
  let r = new Map();
  for (let [e, n] of t) r.set(e, { data: Float32Array.from(n), count: n.length / 5 });
  return { cells: r, size: V.cell };
}
var q = V.radius * V.radius,
  xe = 6144,
  Se = 0.3;
function Ce(e, t, n, r) {
  let i = Math.floor(t / e.size),
    a = Math.floor(r / e.size),
    o = 0;
  for (let s = -1; s <= 1; s++)
    for (let c = -1; c <= 1; c++) {
      let l = e.cells.get(K(i + s, a + c));
      if (!l) continue;
      let u = l.data;
      for (let e = 0; e < l.count; e++) {
        let i = e * 5,
          a = t - u[i],
          s = n - u[i + 1],
          c = r - u[i + 2],
          l = a * a + s * s + c * c;
        if (l >= q) continue;
        let d = 1 - l / q,
          f = (Math.sqrt(l) - Se) / 0.8999999999999999,
          p = f <= 0 ? 0 : f >= 1 ? 1 : f * f * (3 - 2 * f);
        o += u[i + 4] * Math.exp(-u[i + 3] * l) * d * d * p;
      }
    }
  return o > V.max ? V.max : o;
}
var J = new p();
function we(e, t, n, r, i, a) {
  if (n.cells.size === 0) e.fill(0, i, a);
  else
    for (let o = i; o < a; o++)
      (J.fromBufferAttribute(t, o), r && J.applyMatrix4(r), (e[o] = Ce(n, J.x, J.y, J.z)));
}
function Te(e) {
  ((e.vertexShader = e.vertexShader
    .replace(`#include <common>`, `#include <common>\nattribute float ${H};\nvarying float vLanternBounce;`)
    .replace(`#include <begin_vertex>`, `#include <begin_vertex>\n\tvLanternBounce = ${H};`)),
    (e.fragmentShader = e.fragmentShader
      .replace(
        `#include <common>`,
        `#include <common>
uniform float uLanternNight;
uniform vec3 uLanternWarm;
varying float vLanternBounce;`,
      )
      .replace(
        `#include <emissivemap_fragment>`,
        `#include <emissivemap_fragment>
	totalEmissiveRadiance += mix( vec3( dot( diffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) ) ), diffuseColor.rgb, 0.3 ) * uLanternWarm * ( vLanternBounce * uLanternNight );`,
      )));
}
function Ee(e) {
  if (e.userData.lanternBounce) return !1;
  e.userData.lanternBounce = !0;
  let t = e.onBeforeCompile,
    n = e.customProgramCacheKey;
  return (
    (e.onBeforeCompile = (n, r) => {
      (t.call(e, n, r),
        (n.uniforms.uLanternNight = U.uLanternNight),
        (n.uniforms.uLanternWarm = U.uLanternWarm),
        Te(n));
    }),
    (e.customProgramCacheKey = () => `${n.call(e)}+lantern-bounce`),
    !0
  );
}
var Y = `lanternDrop`,
  X = `lanternString`;
function De(e) {
  ((e.vertexShader = e.vertexShader
    .replace(
      `#include <common>`,
      [
        `#include <common>`,
        `attribute float lanternGlow;`,
        `attribute float ${Y};`,
        `attribute float ${X};`,
        `varying float vLanternGlow;`,
      ].join(`
`),
    )
    .replace(
      `#include <begin_vertex>`,
      [`#include <begin_vertex>`, `	vLanternGlow = lanternGlow;`, `\ttransformed.y -= ${Y} * ${X};`].join(`
`),
    )),
    (e.fragmentShader = e.fragmentShader
      .replace(
        `#include <common>`,
        `#include <common>
uniform float uLanternNight;
uniform vec3 uLanternHot;
varying float vLanternGlow;`,
      )
      .replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
{
  vec3 paper = diffuseColor.rgb;
  vec3 lit = mix( paper, uLanternHot, vLanternGlow * 0.75 ) * ( 1.0 + 0.28 * vLanternGlow );
  diffuseColor.rgb = mix( paper * 0.82, lit, uLanternNight );
}`,
      )));
}
function Oe() {
  let e = new t({ vertexColors: !0, toneMapped: !1 });
  return (
    (e.name = `lantern-body`),
    (e.onBeforeCompile = (e) => {
      ((e.uniforms.uLanternNight = U.uLanternNight), (e.uniforms.uLanternHot = U.uLanternHot), De(e));
    }),
    (e.customProgramCacheKey = () => `lantern-body`),
    e
  );
}
var ke = new y(14168606),
  Ae = new y(16751178),
  je = new y(15777872),
  Z = class {
    constructor() {
      T(this, `parts`, []);
    }
    add(e, t, n, r = 0) {
      e.deleteAttribute(`uv`);
      let i = e.getAttribute(`position`).count;
      if ((r !== null && e.setAttribute(Y, new a(new Float32Array(i).fill(r), 1)), t !== null)) {
        let n = new y(t),
          r = new Float32Array(i * 3);
        for (let e = 0; e < i; e++) ((r[e * 3] = n.r), (r[e * 3 + 1] = n.g), (r[e * 3 + 2] = n.b));
        e.setAttribute(`color`, new a(r, 3));
      }
      return (
        n !== null && e.setAttribute(`lanternGlow`, new a(new Float32Array(i).fill(n), 1)),
        this.parts.push(e),
        this
      );
    }
    build() {
      let e = S(this.parts, !1);
      for (let e of this.parts) e.dispose();
      return ((this.parts.length = 0), e);
    }
  },
  Me = (e) => Math.max(0, Math.sin(Math.PI * O(e, 0, 1))) ** 0.4;
function Ne(e) {
  let t = e === `low` ? 12 : 16,
    n = [
      [0.07, 0],
      [0.17, -0.03],
      [0.245, -0.12],
      [0.275, -0.25],
      [0.245, -0.38],
      [0.17, -0.47],
      [0.08, -0.5],
    ],
    r = -z.string - 0.05,
    i = (() => {
      let e = [],
        i = [],
        o = [],
        s = [],
        c = new y();
      n.forEach(([a, s], l) => {
        let u = 1 - Math.abs(l - 3) / 3;
        for (let d = 0; d < t; d++) {
          let f = (d / t) * D;
          (e.push(Math.cos(f) * a, r + (s * z.bodyH) / 0.5, Math.sin(f) * a),
            c.copy(ke).lerp(Ae, u * 0.75),
            d % 2 == 0 && c.lerp(je, 0.62),
            c.multiplyScalar(0.72 + 0.28 * u),
            i.push(c.r, c.g, c.b),
            o.push(Me(l / (n.length - 1))));
        }
      });
      for (let e = 0; e < n.length - 1; e++)
        for (let n = 0; n < t; n++) {
          let r = (n + 1) % t,
            i = e * t + n,
            a = e * t + r,
            o = (e + 1) * t + n,
            c = (e + 1) * t + r;
          s.push(i, o, a, a, o, c);
        }
      let l = new _();
      return (
        l.setAttribute(`position`, new a(e, 3)),
        l.setAttribute(`color`, new a(i, 3)),
        l.setAttribute(`lanternGlow`, new a(o, 1)),
        l.setIndex(s),
        l.computeVertexNormals(),
        l
      );
    })(),
    o = new Z().add(i, null, null),
    s = new m(0.006, 0.006, z.string, 4).translate(0, -z.string / 2, 0);
  (o.add(s, E.goldDeep, 0), o.add(new m(0.075, 0.075, 0.05, t).translate(0, r + 0.025, 0), E.gold, 0));
  let c = r - z.bodyH;
  return (
    o.add(new m(0.085, 0.07, 0.04, t).translate(0, c - 0.04 + 0.02, 0), E.gold, 0),
    o.add(new m(0.008, 0.008, z.tassel * 0.5, 4).translate(0, c - 0.04 - z.tassel * 0.25, 0), E.gold, 0),
    o.add(new h(0.04, z.tassel, 6).rotateX(Math.PI).translate(0, c - 0.04 - z.tassel, 0), 13120031, 0),
    o.build()
  );
}
function Pe(e) {
  let t = e === `low` ? 8 : e === `medium` ? 12 : 16,
    n = new Z(),
    r = new m(0.008, 0.008, 1, 4).translate(0, -0.5, 0),
    i = r.getAttribute(`position`),
    o = new Float32Array(i.count);
  for (let e = 0; e < i.count; e++) ((o[e] = -i.getY(e)), i.setY(e, 0));
  (r.setAttribute(Y, new a(o, 1)),
    n.add(r, E.goldDeep, 0, null),
    n.add(new m(0.1, 0.12, 0.05, t).translate(0, -0.025, 0), E.gold, 0, 1));
  let s = -0.05,
    c = [
      new d(0.001, -0.53),
      new d(0.12, -0.52),
      new d(0.22, -0.45),
      new d(0.3, -0.27),
      new d(0.22, -0.1),
      new d(0.12, -0.01),
      new d(0.001, 0),
    ],
    l = new g(c, t).translate(0, s, 0),
    u = l.getAttribute(`position`),
    p = new Float32Array(u.count);
  for (let e = 0; e < u.count; e++) p[e] = Me((u.getY(e) - s + 0.53) / 0.53);
  return (
    l.setAttribute(`lanternGlow`, new a(p, 1)),
    n.add(l, 13120031, null, 1),
    n.add(new m(0.12, 0.1, 0.05, t).translate(0, -0.595, 0), E.gold, 0, 1),
    n.add(new h(0.04, 0.3, 6).rotateX(Math.PI).translate(0, -0.62 - 0.2, 0), 13120031, 0, 1),
    n.add(new f(0.035, 6, 4).translate(0, -0.69, 0), E.gold, 0, 1),
    n.build()
  );
}
function Fe() {
  let e = new Uint8Array(16384);
  for (let t = 0; t < 64; t++)
    for (let n = 0; n < 64; n++) {
      let r = (n + 0.5 - 32) / 32,
        i = (t + 0.5 - 32) / 32,
        a = (1 - Math.min(1, Math.sqrt(r * r + i * i))) ** 1.9,
        o = (t * 64 + n) * 4;
      ((e[o] = 255), (e[o + 1] = 255), (e[o + 2] = 255), (e[o + 3] = Math.round(a * 255)));
    }
  let t = new c(e, 64, 64, b, C);
  return ((t.magFilter = r), (t.minFilter = r), (t.generateMipmaps = !1), (t.needsUpdate = !0), t);
}
function Ie() {
  return { uScale: { value: 600 }, uMaxSize: { value: 128 } };
}
var Le = new d();
function Re(e, t) {
  let n = !1;
  e.onBeforeRender = (e, r, i) => {
    if ((e.getDrawingBufferSize(Le), (t.uScale.value = i.projectionMatrix.elements[5] * 0.5 * Le.y), n))
      return;
    n = !0;
    let a = e.getContext(),
      o = a.getParameter(a.ALIASED_POINT_SIZE_RANGE);
    o && o[1] > 1 && (t.uMaxSize.value = Math.min(o[1], 512));
  };
}
var ze = `
attribute float aSize;
attribute float aGain;
attribute float aPhase;
uniform float uScale;
uniform float uMaxSize;
uniform float uTime;
uniform float uNight;
uniform float uFlicker;
varying float vGain;
void main() {
  vec4 mv = modelViewMatrix * vec4( position, 1.0 );
  // Đẩy quầng về phía camera 0,3 m: tâm điểm nằm trong buồng đèn nên nếu không sẽ bị chính thân đèn che.
  mv.z += 0.3;
  gl_Position = projectionMatrix * mv;
  float depth = max( -mv.z, 0.05 );
  gl_PointSize = clamp( aSize * uScale / depth, 1.0, uMaxSize );
  float flick = 1.0 + uFlicker * ( 0.06 * sin( uTime * 1.3 + aPhase ) + 0.03 * sin( uTime * 3.7 + aPhase * 2.1 ) );
  float far = 1.0 - smoothstep( 30.0, 62.0, depth );
  float near = smoothstep( 0.6, 2.4, depth );
  vGain = aGain * ( 0.06 + 0.94 * uNight ) * flick * far * near;
}
`,
  Be = `
uniform sampler2D map;
uniform vec3 uColor;
varying float vGain;
void main() {
  float a = texture2D( map, gl_PointCoord ).a;
  gl_FragColor = vec4( uColor, a * vGain );
}
`,
  Ve = { hall: { size: 1.9, gain: 1.1 }, outdoor: { size: 1.6, gain: 1 }, stone: { size: 1.4, gain: 0.9 } };
function He(e) {
  return e.filter((e) => e.kind !== `candle`);
}
function Q(e, t) {
  let n = { ...Ie(), uTime: { value: 0 }, uFlicker: { value: +!t } };
  return {
    material: new s({
      uniforms: { map: { value: e }, uColor: { value: new y(1, 0.62, 0.3) }, uNight: U.uLanternNight, ...n },
      vertexShader: ze,
      fragmentShader: Be,
      transparent: !0,
      depthWrite: !1,
      blending: 2,
      fog: !1,
    }),
    uniforms: n,
  };
}
function Ue(e, t, n, r) {
  let i = He(e),
    s = new Float32Array(i.length * 3),
    c = new Float32Array(i.length),
    l = new Float32Array(i.length),
    u = new Float32Array(i.length),
    d = new p();
  i.forEach((e, t) => {
    (B(e, d), s.set([d.x, d.y, d.z], t * 3));
    let n = Ve[e.kind];
    ((c[t] = n.size), (l[t] = n.gain), (u[t] = (t * 1.7 + e.x * 0.3) % D));
  });
  let f = new _();
  (f.setAttribute(`position`, new a(s, 3)),
    f.setAttribute(`aSize`, new a(c, 1)),
    f.setAttribute(`aGain`, new a(l, 1)),
    f.setAttribute(`aPhase`, new a(u, 1)));
  let { material: m, uniforms: h } = r ?? Q(t, n),
    g = new o(f, m);
  return (
    (g.name = `lantern-glow`),
    (g.frustumCulled = !1),
    (g.renderOrder = 3),
    Re(g, h),
    {
      points: g,
      uniforms: h,
      dispose() {
        (f.dispose(), r || m.dispose());
      },
    }
  );
}
var We = new Set([`roof`, `roofMoss`, `earth`]),
  Ge = new l(),
  Ke = new n(),
  qe = new i(),
  Je = new p(),
  Ye = new p(1, 1, 1),
  $ = new WeakMap();
function Xe(e) {
  let t = $.get(e);
  if (t) return t;
  let n = Qe(e);
  return ($.set(e, n), e.animators.push(n), e.flat.onBuild(() => Ze(e)), n);
}
function Ze(e) {
  R(e);
  let t = new Set([e.mats.flat, e.mats.metal, e.mats.paving, e.mats.grass]);
  e.dynamic.traverse((e) => {
    let n = e;
    if (!n.isMesh) return;
    let r = n.material,
      i = r.userData.surface;
    i && !We.has(i) && t.add(r);
  });
  let n = 0;
  for (let e of t) Ee(e) && (n += 1);
  return n;
}
function Qe(t) {
  let n = [],
    r = t.quality,
    i = t.calm,
    a = [],
    o = Oe(),
    s = Fe(),
    c = null,
    l = null,
    d = !1,
    f = !1,
    p = !0,
    m = !1,
    h = i ? 0.015 : 0.06;
  function g() {
    for (let e of a) (e.mesh.removeFromParent(), e.mesh.geometry.dispose(), e.mesh.dispose());
    ((a.length = 0), (l &&= (l.points.removeFromParent(), l.dispose(), null)));
  }
  function _() {
    if (m) return;
    ((d = !1), g());
    let u = new Map();
    for (let e of n) {
      if (e.kind !== `hall` && e.kind !== `outdoor`) continue;
      let t = u.get(e.kind);
      (t || u.set(e.kind, (t = [])), t.push(e));
    }
    for (let [n, i] of u) {
      let s = n === `hall` ? Ne(r) : Pe(r),
        c = new Float32Array(i.length);
      (n === `outdoor` && i.forEach((e, t) => (c[t] = e.string ?? 0.35)), s.setAttribute(X, new ee(c, 1)));
      let l = new e(s, o, i.length);
      ((l.name = n === `hall` ? `altar-lanterns` : `lanterns-outdoor`),
        (l.count = i.length),
        l.instanceMatrix.setUsage(te),
        (l.frustumCulled = !1),
        t.dynamic.add(l),
        s.addEventListener(`dispose`, () => l.dispose()));
      let u = i.map((e, t) => t * 1.7 + e.x * 0.3);
      (a.push({ kind: n, lamps: i, mesh: l, phases: u }), v(a[a.length - 1], 0));
    }
    He(n).length > 0 && ((c ??= Q(s, i)), (l = Ue(n, s, i, c)), t.dynamic.add(l.points));
  }
  function v(e, t) {
    for (let n = 0; n < e.lamps.length; n++) {
      let r = e.lamps[n],
        i = e.phases[n];
      (Ge.set(Math.cos(t * 0.7 + i * 1.3) * h * 0.65, 0, Math.sin(t * 0.9 + i) * h),
        Ke.setFromEuler(Ge),
        Je.set(r.x, r.y, r.z),
        qe.compose(Je, Ke, Ye),
        e.mesh.setMatrixAt(n, qe));
    }
    e.mesh.instanceMatrix.needsUpdate = !0;
  }
  let y = [],
    b = null,
    x = !1;
  function S(e) {
    return (
      (b = be(n)),
      e.updateMatrixWorld(!0),
      (y = []),
      e.traverse((e) => {
        let t = e;
        if (!t.isMesh || t.isInstancedMesh) return;
        let n = t.material;
        if (Array.isArray(n) || !n.userData.lanternBounce) return;
        let r = t.geometry.getAttribute(`position`),
          i = t.geometry.getAttribute(H);
        ((i && i.count === r.count) ||
          ((i = new u(new Float32Array(r.count), 1)), t.geometry.setAttribute(H, i)),
          y.push({ attr: i, pos: r, matrix: t.matrixWorld.clone(), next: 0 }));
      }),
      (x = !0),
      y.length
    );
  }
  function C(e) {
    let t = performance.now();
    for (; y.length > 0 && b;) {
      let n = y[0],
        r = Math.min(n.pos.count, n.next + xe);
      if (
        (we(n.attr.array, n.pos, b, n.matrix, n.next, r),
        (n.next = r),
        r >= n.pos.count && ((n.attr.needsUpdate = !0), y.shift()),
        performance.now() - t >= e)
      )
        break;
    }
    y.length === 0 && (f = !0);
  }
  function w(e) {
    let t = S(e);
    return (C(1 / 0), t);
  }
  let T = {
    register(e, t, r) {
      (n.push({ x: e.x, y: e.y, z: e.z, kind: t, string: r?.string }), (d = !0), (f = !1), (x = !1));
    },
    setNight(e) {
      ((p = !1), W(e));
    },
    get night() {
      return U.uLanternNight.value;
    },
    get lamps() {
      return n;
    },
    get glow() {
      return l?.points ?? null;
    },
    flush: _,
    bake: w,
    update(e, r) {
      if (!m) {
        if ((d && _(), !f && n.length > 0)) {
          let e = t.dynamic.parent;
          (!x && e && S(e), x && C(4));
        }
        p && W(ye());
        for (let e of a) v(e, r);
        l && (l.uniforms.uTime.value = r % 3600);
      }
    },
    dispose() {
      m || ((m = !0), g(), c?.material.dispose(), (c = null), o.dispose(), s.dispose(), $.delete(t));
    },
  };
  return (t.dynamic.addEventListener(`removed`, () => T.dispose()), T);
}
export {
  re as _,
  Re as a,
  E as b,
  ve as c,
  fe as d,
  pe as f,
  ie as g,
  O as h,
  Ie as i,
  _e as l,
  D as m,
  Xe as n,
  he as o,
  F as p,
  U as r,
  me as s,
  Fe as t,
  ge as u,
  ne as v,
  k as y,
};
