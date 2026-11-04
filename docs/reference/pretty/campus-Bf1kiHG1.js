const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./idle-DOIyU4tA.js",
      "./rolldown-runtime-DK3Fl9T5.js",
      "./three-BbSp8N3g.js",
      "./lazy-shared-D8DtrU9N.js",
      "./index-e_Bx6V48.js",
      "./preload-helper-CRzLMJPS.js",
      "./referral-CM6Fj8ux.js",
      "./dialog-DwXghOMX.js",
      "./index-C_1YXvDN.css",
      "./app-z_oU8L_u.js",
      "./progress-core-C9e35Hb5.js",
      "./sky-X0ndF2_S.js",
      "./layout-DpGLadzd.js",
      "./lanterns-DsoFXr0b.js",
      "./vn-time-DznqUr4I.js",
      "./music-mix-9H0C50bM.js",
      "./app-DmNuXdg1.css",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import {
  F as t,
  G as n,
  H as r,
  K as i,
  O as a,
  P as o,
  R as s,
  S as c,
  T as l,
  c as u,
  dt as d,
  et as f,
  ft as p,
  g as m,
  h,
  j as g,
  l as _,
  m as v,
  o as y,
  ot as b,
  p as x,
  s as S,
  t as ee,
  w as te,
} from "./three-BbSp8N3g.js";
import {
  b as C,
  c as ne,
  d as re,
  f as ie,
  h as ae,
  l as oe,
  m as w,
  o as se,
  p as ce,
  s as le,
  v as ue,
  y as de,
} from "./lanterns-DsoFXr0b.js";
import {
  A as fe,
  N as T,
  S as pe,
  a as E,
  f as D,
  h as O,
  j as me,
  k,
  m as he,
  o as ge,
  s as _e,
  x as A,
} from "./layout-DpGLadzd.js";
import {
  C as ve,
  D as j,
  E as ye,
  S as be,
  T as xe,
  _ as Se,
  b as Ce,
  c as we,
  g as M,
  i as Te,
  l as Ee,
  n as De,
  r as Oe,
  v as ke,
  w as Ae,
  x as je,
  y as Me,
} from "./app-z_oU8L_u.js";
import { Ft as N, Xt as Ne } from "./index-e_Bx6V48.js";
import { i as Pe, r as Fe } from "./lazy-shared-D8DtrU9N.js";
import {
  C as P,
  S as F,
  b as Ie,
  c as Le,
  g as Re,
  k as ze,
  l as Be,
  o as Ve,
  p as He,
  r as Ue,
  w as We,
  x as Ge,
  y as Ke,
} from "./water-paths-DYM7yuBe.js";
import { t as qe } from "./preload-helper-CRzLMJPS.js";
var Je = new v();
function I(e, t = 1) {
  return (Je.setHex(e), [Je.r * t, Je.g * t, Je.b * t]);
}
function Ye(e) {
  return 1 - 0.22 * (1 - ae(e / 1.4, 0, 1));
}
function Xe(e, t) {
  let n = Ye(t);
  return [e[0] * n, e[1] * n, e[2] * n];
}
var L = class {
  constructor() {
    (N(this, `pos`, []), N(this, `nor`, []), N(this, `col`, []), N(this, `idx`, []));
  }
  get triangleCount() {
    return this.idx.length / 3;
  }
  vert(e, t, n, r, i, a, o) {
    return (
      this.pos.push(e, t, n),
      this.nor.push(r, i, a),
      this.col.push(o[0], o[1], o[2]),
      this.pos.length / 3 - 1
    );
  }
  tri(e, t, n) {
    let r = this.pos,
      i = this.nor,
      a = r[t * 3] - r[e * 3],
      o = r[t * 3 + 1] - r[e * 3 + 1],
      s = r[t * 3 + 2] - r[e * 3 + 2],
      c = r[n * 3] - r[e * 3],
      l = r[n * 3 + 1] - r[e * 3 + 1],
      u = r[n * 3 + 2] - r[e * 3 + 2],
      d = o * u - s * l,
      f = s * c - a * u,
      p = a * l - o * c;
    d * (i[e * 3] + i[t * 3] + i[n * 3]) +
      f * (i[e * 3 + 1] + i[t * 3 + 1] + i[n * 3 + 1]) +
      p * (i[e * 3 + 2] + i[t * 3 + 2] + i[n * 3 + 2]) >=
    0
      ? this.idx.push(e, t, n)
      : this.idx.push(e, n, t);
  }
  quad(e, t, n, r) {
    (this.tri(e, t, n), this.tri(e, n, r));
  }
  build() {
    if (this.idx.length === 0) return null;
    let e = new _();
    return (
      e.setAttribute(`position`, new c(this.pos, 3)),
      e.setAttribute(`normal`, new c(this.nor, 3)),
      e.setAttribute(`color`, new c(this.col, 3)),
      e.setIndex(this.idx.slice()),
      e
    );
  }
};
function Ze(e, t) {
  let n = Math.max(1, t.steps ?? Math.ceil(((t.a1 - t.a0) * t.r1) / 0.6)),
    r = I(t.hex),
    i = I(t.top ?? t.hex),
    a = Xe(r, t.y0),
    o = Xe(r, t.y1),
    s = t.r0 > 1e-4,
    c = [],
    l = [],
    u = [],
    d = [],
    f = [],
    p = [];
  for (let r = 0; r <= n; r++) {
    let m = t.a0 + ((t.a1 - t.a0) * r) / n,
      h = Math.cos(m),
      g = Math.sin(m),
      _ = t.cx + h * t.r1,
      v = t.cz + g * t.r1;
    (l.push(e.vert(_, t.y1, v, 0, 1, 0, i)),
      u.push(e.vert(_, t.y0, v, h, 0, g, a)),
      d.push(e.vert(_, t.y1, v, h, 0, g, o)));
    let y = t.cx + h * t.r0,
      b = t.cz + g * t.r0;
    (c.push(e.vert(y, t.y1, b, 0, 1, 0, i)),
      s && (f.push(e.vert(y, t.y0, b, -h, 0, -g, a)), p.push(e.vert(y, t.y1, b, -h, 0, -g, o))));
  }
  for (let t = 0; t < n; t++)
    (e.quad(c[t], l[t], l[t + 1], c[t + 1]),
      e.quad(u[t], u[t + 1], d[t + 1], d[t]),
      s && e.quad(f[t], f[t + 1], p[t + 1], p[t]));
  for (let [n, r, i] of [
    [t.a0, -1, t.capStart ?? !0],
    [t.a1, 1, t.capEnd ?? !0],
  ]) {
    if (!i) continue;
    let s = Math.cos(n),
      c = Math.sin(n),
      l = -c * r,
      u = s * r,
      d = t.cx + s * t.r0,
      f = t.cz + c * t.r0,
      p = t.cx + s * t.r1,
      m = t.cz + c * t.r1;
    e.quad(
      e.vert(d, t.y0, f, l, 0, u, a),
      e.vert(p, t.y0, m, l, 0, u, a),
      e.vert(p, t.y1, m, l, 0, u, o),
      e.vert(d, t.y1, f, l, 0, u, o),
    );
  }
  if (t.y0 > 0.001)
    for (let r = 0; r < n; r++) {
      let i = t.a0 + ((t.a1 - t.a0) * r) / n,
        o = t.a0 + ((t.a1 - t.a0) * (r + 1)) / n;
      e.quad(
        e.vert(t.cx + Math.cos(i) * t.r0, t.y0, t.cz + Math.sin(i) * t.r0, 0, -1, 0, a),
        e.vert(t.cx + Math.cos(i) * t.r1, t.y0, t.cz + Math.sin(i) * t.r1, 0, -1, 0, a),
        e.vert(t.cx + Math.cos(o) * t.r1, t.y0, t.cz + Math.sin(o) * t.r1, 0, -1, 0, a),
        e.vert(t.cx + Math.cos(o) * t.r0, t.y0, t.cz + Math.sin(o) * t.r0, 0, -1, 0, a),
      );
    }
}
function Qe(e, t) {
  let n = t.a0 ?? 0,
    r = t.a1 ?? w,
    i = Math.max(1, Math.round(((r - n) * ((t.r0 + t.r1) / 2)) / (t.block ?? 1.1))),
    a = (e) => {
      let a = n + ((r - n) * (e + 0.5)) / i;
      return t.gaps?.find((e) => Math.abs($e(a, e.at)) < e.width / 2);
    },
    o = Array.from({ length: i }, (e, t) => a(t) !== void 0),
    s = Math.abs(r - n - w) < 1e-6,
    c = (e) => (s ? !o[(e + i) % i] : e >= 0 && e < i && !o[e]),
    l = 0;
  for (let o = 0; o < i; o++) {
    let s = n + ((r - n) * o) / i,
      u = n + ((r - n) * (o + 1)) / i,
      d = a(o);
    if (d) {
      d.keepSequence && t.rand();
      continue;
    }
    let f = t.palette[Math.floor(t.rand() * t.palette.length)] ?? 10130308,
      p = Math.max(1, Math.ceil(((u - s) * t.r1) / (t.chord ?? 0.6))),
      m = {
        cx: t.cx,
        cz: t.cz,
        r0: t.r0,
        r1: t.r1,
        a0: s,
        a1: u,
        y0: t.y0,
        y1: t.y1,
        hex: f,
        steps: p,
        capStart: i === 1 || !c(o - 1),
        capEnd: i === 1 || !c(o + 1),
      };
    (t.capHex !== void 0 && (m.top = t.capHex), Ze(e, m), (l += 1));
  }
  return l;
}
function $e(e, t) {
  let n = (e - t) % w;
  return (n > Math.PI && (n -= w), n < -Math.PI && (n += w), n);
}
function et(e, t) {
  let n = t.a0 ?? 0,
    r = t.a1 ?? w,
    i = Math.max(1, Math.round((t.r1 - t.r0) / t.radial)),
    a = new v();
  for (let o = 0; o < i; o++) {
    let s = t.r0 + ((t.r1 - t.r0) * o) / i,
      c = t.r0 + ((t.r1 - t.r0) * (o + 1)) / i,
      l = Math.max(6, Math.round(((r - n) * ((s + c) / 2)) / t.arc));
    for (let i = 0; i < l; i++) {
      let o = n + ((r - n) * i) / l,
        u = n + ((r - n) * (i + 1)) / l;
      a.setHex(t.palette[Math.floor(t.rand() * t.palette.length)] ?? 11184029);
      let d = (s + c) / 2,
        f = (1 + (t.rand() * 2 - 1) * 0.06) * (t.tint ? t.tint(d, (o + u) / 2) : 1),
        p = [a.r * f, a.g * f, a.b * f];
      e.quad(
        e.vert(t.cx + Math.cos(o) * s, t.y, t.cz + Math.sin(o) * s, 0, 1, 0, p),
        e.vert(t.cx + Math.cos(o) * c, t.y, t.cz + Math.sin(o) * c, 0, 1, 0, p),
        e.vert(t.cx + Math.cos(u) * c, t.y, t.cz + Math.sin(u) * c, 0, 1, 0, p),
        e.vert(t.cx + Math.cos(u) * s, t.y, t.cz + Math.sin(u) * s, 0, 1, 0, p),
      );
    }
  }
}
function tt(e, t, n, r, i, a, o) {
  let s = I(a),
    c = e.vert(t, i, n, 0, 1, 0, s),
    l = [];
  for (let a = 0; a < o; a++) {
    let c = (a / o) * w;
    l.push(e.vert(t + Math.cos(c) * r, i, n + Math.sin(c) * r, 0, 1, 0, s));
  }
  for (let t = 0; t < o; t++) e.tri(c, l[t], l[(t + 1) % o]);
}
function nt(e, t, n, r, i, a) {
  let o = [e, r, t];
  for (let s = 1; s <= i; s++) {
    let c = (n * s) / i;
    for (let n = 0; n <= a; n++) {
      let i = (n / a) * Math.PI;
      o.push(e + Math.cos(i) * c, r, t + Math.sin(i) * c);
    }
  }
  let s = a + 1,
    l = [];
  for (let e = 0; e < a; e++) l.push(0, 1 + e + 1, 1 + e);
  for (let e = 1; e < i; e++) {
    let t = 1 + (e - 1) * s,
      n = 1 + e * s;
    for (let e = 0; e < a; e++) l.push(t + e, t + e + 1, n + e + 1, t + e, n + e + 1, n + e);
  }
  let u = new _();
  return (u.setAttribute(`position`, new c(o, 3)), u.setIndex(l), u.computeVertexNormals(), u);
}
function rt(e, t, n, r, i, a, o, s) {
  let c = I(o),
    l = [],
    u = [];
  for (let o = 0; o < s; o++) {
    let d = (o / s) * w;
    (l.push(e.vert(t + Math.cos(d) * r, a, n + Math.sin(d) * r, 0, 1, 0, c)),
      u.push(e.vert(t + Math.cos(d) * i, a, n + Math.sin(d) * i, 0, 1, 0, c)));
  }
  for (let t = 0; t < s; t++) {
    let n = (t + 1) % s;
    e.quad(l[t], u[t], u[n], l[n]);
  }
}
var it = class {
  constructor(e, t, n, r) {
    (N(this, `name`, void 0),
      N(this, `ctx`, void 0),
      N(this, `statues`, void 0),
      N(this, `cheap`, void 0),
      N(this, `group`, new l()),
      N(this, `glow`, void 0),
      N(this, `lamps`, void 0),
      N(this, `lazyStone`, null),
      (this.name = e),
      (this.statues = t.statues ?? null),
      (this.group.name = `campus-${e}`));
    let i = ue(r);
    ((this.ctx = {
      quality: t.quality,
      seg: ne(t.quality),
      calm: t.calm,
      mats: t.mats,
      rand: i,
      flat: new re(i),
      metal: new re(i),
      roofParts: [],
      pavingParts: [],
      colliders: n.colliders,
      interactions: n.interactions,
      dynamic: this.group,
      animators: n.animators,
    }),
      (this.cheap = { ...this.ctx, quality: `low`, seg: ne(`low`) }),
      (this.glow = n.glow),
      (this.lamps = n.lamps));
  }
  get quality() {
    return this.ctx.quality;
  }
  get low() {
    return this.ctx.quality === `low`;
  }
  get rand() {
    return this.ctx.rand;
  }
  get flat() {
    return this.ctx.flat;
  }
  get stone() {
    return ((this.lazyStone ??= oe(this.ctx, `stone`)), this.lazyStone);
  }
  circle(e, t, n) {
    le(this.ctx, e, t, n);
  }
  box(e, t, n, r) {
    se(this.ctx, e, t, n, r);
  }
  coarse(e) {
    return this.low ? e * 1.5 : e;
  }
  scaled(e) {
    return this.low ? Math.max(1, Math.ceil(e * 0.6)) : e;
  }
  finish(e) {
    let { ctx: n, group: r } = this,
      i = n.quality !== `low`;
    return (
      ((e, n, i) => {
        if (!e) return;
        let a = new t(e, n);
        ((a.name = i), (a.matrixAutoUpdate = !1), a.updateMatrix(), r.add(a));
      })(n.flat.build(), n.mats.flat, `campus-${this.name}-flat`),
      r.traverse((t) => {
        let r = t;
        if (!r.isMesh) return;
        let a = r.material,
          o = a !== n.mats.flame && a !== n.mats.leaf && a !== n.mats.water;
        ((r.castShadow = i && e && o), (r.receiveShadow = i && a !== n.mats.flame && a !== n.mats.water));
      }),
      r
    );
  }
};
function at(e, t, n, r, i, a, o, s, c = 0, l) {
  e.add(new S(i, a, o), s, { x: t, y: n, z: r, ry: c }, l);
}
function R() {
  return new Promise((e) => setTimeout(e, 0));
}
function ot(e) {
  return -0.013000000000000001 + e * 0.003;
}
var st = De,
  ct = new v(),
  z = { dry: [1.24, 1.1, 0.7], worn: [1.5, 0.98, 0.62], bare: [1.75, 0.92, 0.55] };
function lt(e, t, n, r) {
  Oe(e, t, ct);
  let i = (e) => 1 + (e - 1) * r;
  return [ct.r * st[0] * i(n[0]), ct.g * st[1] * i(n[1]), ct.b * st[2] * i(n[2])];
}
function B(e, t, n, r, i, a, o = 0, s = 1) {
  let c = e.low ? 7 : 10,
    l = new L(),
    u = ot(s),
    d = l.vert(t, u, n, 0, 1, 0, lt(t, n, a, 1)),
    f = [],
    p = Math.cos(o),
    m = Math.sin(o);
  for (let o = 0; o < c; o++) {
    let s = (o / c) * w,
      d = 0.82 + 0.34 * e.rand(),
      h = Math.cos(s) * r * d,
      g = Math.sin(s) * i * d,
      _ = t + h * p - g * m,
      v = n + h * m + g * p;
    f.push(l.vert(_, u, v, 0, 1, 0, lt(_, v, a, 0)));
  }
  for (let e = 0; e < c; e++) l.tri(d, f[e], f[(e + 1) % c]);
  let h = l.build();
  h && e.flat.addColored(h);
}
var ut = 11840144,
  dt = { gravel: 0.9, edge: 1, outer: 1.9 };
function ft(e, t, n) {
  let r = e.low ? 8 : 10,
    i = -0.002,
    a = new L(),
    o = I(ut),
    s = a.vert(t, i, n, 0, 1, 0, o),
    c = (e, s) => {
      let c = [];
      for (let l = 0; l < r; l++) {
        let u = (l / r) * w,
          d = t + Math.cos(u) * e,
          f = n + Math.sin(u) * e,
          p = s
            ? [o[0] * (l % 2 ? 0.93 : 1), o[1] * (l % 2 ? 0.93 : 1), o[2] * (l % 2 ? 0.93 : 1)]
            : lt(d, f, [1, 1, 1], 0);
        c.push(a.vert(d, i, f, 0, 1, 0, p));
      }
      return c;
    },
    l = c(dt.gravel, !0),
    u = c(dt.edge, !1),
    d = c(dt.outer, !1);
  for (let e = 0; e < r; e++) {
    let t = (e + 1) % r;
    (a.tri(s, l[e], l[t]), a.quad(l[e], l[t], u[t], u[e]), a.quad(u[e], u[t], d[t], d[e]));
  }
  let f = a.build();
  f && e.flat.addColored(f);
}
function pt(e, t) {
  for (let n = t; n < e.lamps.length; n++) {
    let t = e.lamps[n];
    t.kind === `stone` && t.y < 2 && ft(e, t.x, t.z);
  }
}
var mt = [
    [-0.48, 0],
    [-0.52, 0.5],
    [0, 1],
    [0.52, 0.5],
    [0.48, 0],
  ],
  ht = {
    dambut: {
      colors: [2112542, 3103787, 5209913],
      step: { low: 1.25, other: 0.85 },
      crown: 1.08,
      waist: 0.86,
      flowers: !0,
    },
    chetau: {
      colors: [2903842, 4618042, 7314508],
      step: { low: 1.6, other: 1.1 },
      crown: 1.04,
      waist: 0.93,
      flowers: !1,
    },
  },
  gt = [
    [14100011, 15911244],
    [12065830, 15911244],
    [14826314, 16175978],
  ];
function _t(e, t, n = {}) {
  let r = n.width ?? 0.62,
    i = n.height ?? 0.62,
    a = ht[n.kind ?? `dambut`],
    o = e.rand,
    s = e.low ? a.step.low : a.step.other,
    c = [];
  for (let e = 0; e + 1 < t.length; e++) {
    let [n, r] = t[e],
      [i, a] = t[e + 1],
      o = Math.hypot(i - n, a - r);
    o >= 0.001 && c.push({ ax: n, az: r, dx: (i - n) / o, dz: (a - r) / o, len: o });
  }
  if (c.length === 0) return;
  let l = [],
    u = (e, t, n, s, c) => {
      let u = l.length % 2 == 1;
      l.push({
        x: e,
        z: t,
        dx: n,
        dz: s,
        miter: c,
        w: r * (u ? (1 + a.crown) / 2 : (1 + a.waist) / 2) * (0.96 + 0.08 * o()),
        h: i * (u ? a.crown : a.waist) * (0.94 + 0.12 * o()),
        shade: (u ? 1.04 : 0.94) * (0.92 + 0.16 * o()),
        crown: u,
      });
    };
  c.forEach((e, t) => {
    let n = Math.max(1, Math.ceil(e.len / s));
    for (let r = 0; r < n; r++) {
      let i = (e.len * r) / n;
      if (r === 0 && t > 0) {
        let n = c[t - 1],
          r = n.dx + e.dx,
          i = n.dz + e.dz,
          a = Math.hypot(r, i) || 1,
          o = (r * e.dx + i * e.dz) / a;
        u(e.ax, e.az, r / a, i / a, 1 / Math.max(0.6, o));
      } else u(e.ax + e.dx * i, e.az + e.dz * i, e.dx, e.dz, 1);
    }
  });
  let d = c[c.length - 1];
  u(d.ax + d.dx * d.len, d.az + d.dz * d.len, d.dx, d.dz, 1);
  for (let e of [l[0], l[l.length - 1]]) ((e.w *= 0.86), (e.h *= 0.88));
  let f = new L(),
    p = mt.length,
    m = (e, t) => I(e > 0.9 ? a.colors[2] : e > 0.3 ? a.colors[1] : a.colors[0], t),
    h = l.map((e) => {
      let t = [];
      for (let n = 0; n < p; n++) {
        let [r, i] = mt[n],
          [a, o] = mt[Math.max(0, n - 1)],
          [s, c] = mt[Math.min(p - 1, n + 1)],
          l = (s - a) * e.w,
          u = (c - o) * e.h,
          d = Math.hypot(l, u) || 1,
          h = -u / d,
          g = l / d;
        t.push(
          f.vert(
            e.x - e.dz * r * e.w * e.miter,
            i * e.h,
            e.z + e.dx * r * e.w * e.miter,
            -e.dz * h,
            g,
            e.dx * h,
            m(i, e.shade),
          ),
        );
      }
      return t;
    });
  for (let e = 0; e + 1 < h.length; e++) {
    let t = h[e],
      n = h[e + 1];
    for (let e = 0; e < p - 1; e++) f.quad(t[e], n[e], n[e + 1], t[e + 1]);
  }
  for (let [e, t] of [
    [l[0], -1],
    [l[l.length - 1], 1],
  ]) {
    let n = mt.map(([n, r]) =>
      f.vert(e.x - e.dz * n * e.w, r * e.h, e.z + e.dx * n * e.w, t * e.dx, 0, t * e.dz, m(r, e.shade)),
    );
    for (let e = 1; e < p - 1; e++) f.tri(n[0], n[e], n[e + 1]);
  }
  let g = o() < 0.5 ? -1 : 1;
  for (let t of l) {
    if (!t.crown || !a.flowers) continue;
    g = -g;
    let n = g * (0.3 + 0.08 * o()),
      r = 0.74 + 0.12 * o(),
      i = n * t.w + g * 0.05,
      s = -t.dz * g,
      c = t.dx * g;
    Et(
      f,
      t.x - t.dz * i,
      r * t.h + 0.02,
      t.z + t.dx * i,
      0.18 + 0.05 * o(),
      e.low ? 4 : 5,
      gt[Math.floor(o() * gt.length)],
      s * 0.8,
      c * 0.8,
      0.95 + 0.1 * o(),
    );
  }
  let _ = f.build();
  if ((_ && e.flat.addColored(_), !n.decor))
    for (let { ax: t, az: n, dx: i, dz: a, len: o } of c) {
      let s = r / 2 + 0.08,
        c = t + i * o,
        l = n + a * o;
      if (Math.abs(i) > 0.999 || Math.abs(a) > 0.999)
        e.box(Math.min(t, c) - s, Math.max(t, c) + s, Math.min(n, l) - s, Math.max(n, l) + s);
      else {
        let r = Math.max(1, Math.ceil(o / 0.9));
        for (let c = 0; c <= r; c++) e.circle(t + (o * c * i) / r, n + (o * c * a) / r, s);
      }
    }
}
function vt(e, t, n, r, i, a, o = {}) {
  let s = Math.max(2, Math.ceil((Math.abs(a - i) * r) / 2.4)),
    c = [];
  for (let e = 0; e <= s; e++) {
    let o = i + ((a - i) * e) / s;
    c.push([t + Math.cos(o) * r, n + Math.sin(o) * r]);
  }
  _t(e, c, o);
}
var yt = 0.6;
function bt(e, t, n, r, i, a, o = yt) {
  let s = [
      [e, n],
      [t, n],
      [t, r],
      [e, r],
    ],
    c = { n: 0, e: 1, s: 2, w: 3 }[i],
    l = (e) => s[(e + 4) % 4],
    u = (e, t) => {
      let n = Math.hypot(t[0] - e[0], t[1] - e[1]) || 1;
      return [(t[0] - e[0]) / n, (t[1] - e[1]) / n];
    },
    d = l(c),
    f = l(c + 1),
    p = u(d, f),
    m = [(d[0] + f[0]) / 2, (d[1] + f[1]) / 2],
    h = [[m[0] + p[0] * a, m[1] + p[1] * a]];
  for (let e = 1; e <= 4; e++) {
    let t = l(c + e),
      n = u(l(c + e - 1), t),
      r = u(t, l(c + e + 1));
    h.push([t[0] - n[0] * o, t[1] - n[1] * o], [t[0] + r[0] * o, t[1] + r[1] * o]);
  }
  return (h.push([m[0] - p[0] * a, m[1] - p[1] * a]), h);
}
function xt(e, t, n, r, i, a) {
  (_t(e, bt(t, n, r, i, a, 0.75), { kind: `chetau` }), Dt(e, t, n, r, i, a));
}
var St = [
    {
      height: [0.12, 0.2],
      reach: [0.58, 0.78],
      foliage: [3830824, 9684563],
      blooms: [
        [15220879, 16765503],
        [16747039, 16770442],
        [16168960, 12730636],
      ],
      cards: [3, 2],
    },
    {
      height: [0.3, 0.42],
      reach: [0.5, 0.66],
      foliage: [2379559, 5672762],
      blooms: [[16168960, 10115604]],
      cards: [3, 2],
    },
    {
      height: [0.42, 0.56],
      reach: [0.48, 0.62],
      foliage: [2775596, 6134591],
      blooms: [
        [12720219, 16175978],
        [15220879, 16765503],
      ],
      cards: [4, 2],
    },
  ],
  Ct = [16051677, 15774720],
  wt = [4533277, 3547930, 5913382],
  Tt = 0.42;
function Et(e, t, n, r, i, a, [o, s], c, l, u) {
  let d = i / 2,
    f = Math.hypot(c, 1, l),
    p = e.vert(t, n + i * 0.3, r, c / f, 1 / f, l / f, I(s, u)),
    m = I(o, u * 0.92),
    h = [];
  for (let i = 0; i < a; i++) {
    let o = (i / a) * w,
      s = Math.cos(o),
      u = Math.sin(o),
      f = Math.hypot(s * 0.7 + c, 1, u * 0.7 + l);
    h.push(
      e.vert(t + s * d, n + (s * c + u * l) * d, r + u * d, (s * 0.7 + c) / f, 1 / f, (u * 0.7 + l) / f, m),
    );
  }
  for (let t = 0; t < a; t++) e.tri(p, h[t], h[(t + 1) % a]);
}
function Dt(e, t, n, r, i, a) {
  let o = e.rand,
    s = new L(),
    c = (t + n) / 2,
    l = (r + i) / 2,
    u = (e) => I(wt[Math.floor(o() * wt.length)], e),
    d = s.vert(c, 0.034, l, 0, 1, 0, u(1.1)),
    f = [
      [t, r],
      [c, r],
      [n, r],
      [n, l],
      [n, i],
      [c, i],
      [t, i],
      [t, l],
    ].map(([e, t]) => s.vert(e, 0.004, t, 0, 1, 0, u(0.85 + 0.3 * o())));
  for (let e = 0; e < f.length; e++) s.tri(d, f[e], f[(e + 1) % f.length]);
  let m = ye(e.ctx),
    h = e.low ? 3 : 4,
    g = n - t - 2 * Tt,
    _ = i - r - 2 * Tt,
    v = a === `e` ? [1, 0] : a === `w` ? [-1, 0] : a === `n` ? [0, -1] : [0, 1],
    y = Math.max(g, _) / 2;
  for (let n = 0; n < h; n++)
    for (let i = 0; i < h; i++) {
      let a = v[0] === 0 ? (v[1] > 0 ? i : h - 1 - i) : v[0] > 0 ? n : h - 1 - n,
        u = v[0] === 0 ? n : i;
      if (a === h - 1 && Math.abs(u - (h - 1) / 2) < h / 4 + 0.01) continue;
      let d = t + Tt + ((n + 0.5 + (o() - 0.5) * 0.55) * g) / h,
        f = r + Tt + ((i + 0.5 + (o() - 0.5) * 0.55) * _) / h,
        b = Math.min(1, Math.max(0, 0.5 - ((d - c) * v[0] + (f - l) * v[1]) / (2 * y))),
        x = o() + (b - 0.5) * 0.9,
        S = St[x < 0.4 ? 0 : x < 0.8 ? 1 : 2],
        ee = S.height[0] + (S.height[1] - S.height[0]) * o(),
        te = S.reach[0] + (S.reach[1] - S.reach[0]) * o(),
        [C, ne] = S.foliage,
        re = e.low ? 2 : 3,
        ie = e.low ? 1 : 2,
        ae = o() * w;
      for (let e = 0; e < re + ie; e++) {
        let t = e >= re,
          n = te * (t ? 1.15 + 0.3 * o() : 1.25 + 0.35 * o()),
          r = t ? o() * w : ae + (e / re) * w + (o() - 0.5) * 0.6,
          i = t ? te * 0.22 * o() : te * 0.6,
          a = t ? 0.15 + 0.2 * o() : Math.asin(Math.min(0.95, Math.max(0.25, (ee * 1.05) / n))),
          s = new p(Math.sin(a) * Math.cos(r), Math.cos(a), Math.sin(a) * Math.sin(r)),
          c = new p(
            d + Math.cos(r) * i,
            t ? ee * (0.85 + 0.15 * o()) + 0.03 : 0.025 + 0.5 * n * Math.sin(a),
            f + Math.sin(r) * i,
          );
        m.clump(c, s, n, (o() - 0.5) * 1.4, j(C, 1 + 0.2 * o()), j(ne, 1 + 0.25 * o()));
      }
      let oe = S.blooms[Math.floor(o() * S.blooms.length)],
        se = () => (o() < 0.8 ? oe : S.blooms[Math.floor(o() * S.blooms.length)]),
        ce = S.cards[+!!e.low];
      for (let e = 0; e < ce; e++) {
        let [e] = se(),
          t = o() * w,
          n = te * 0.7 * Math.sqrt(o()),
          r = 0.2 + 0.5 * o(),
          i = o() * w,
          a = new p(Math.sin(r) * Math.cos(i), Math.cos(r), Math.sin(r) * Math.sin(i)),
          s = 0.26 + 0.14 * o();
        m.clump(
          new p(d + Math.cos(t) * n, ee + 0.08 + 0.06 * o(), f + Math.sin(t) * n),
          a,
          s,
          o() * w,
          j(e, 0.8),
          j(e, 1.1),
        );
      }
      let le = e.low ? 1 : 1 + Math.floor(o() * 2);
      for (let t = 0; t < le; t++) {
        let t = o() * w,
          n = te * 0.6 * Math.sqrt(o());
        Et(
          s,
          d + Math.cos(t) * n,
          ee + 0.14 + 0.06 * o(),
          f + Math.sin(t) * n,
          0.17 + 0.07 * o(),
          e.low ? 4 : 5,
          o() < 0.22 ? Ct : se(),
          (o() - 0.5) * 0.9,
          (o() - 0.5) * 0.9,
          0.95 + 0.15 * o(),
        );
      }
    }
  let b = s.build();
  b && e.flat.addColored(b);
}
var Ot = [11184029, 10460307, 11841702, 10789015, 11446942];
function V(e, t, n, r = Ot) {
  let i = ie({
    x0: t.x0,
    x1: t.x1,
    z0: t.z0,
    z1: t.z1,
    y: n,
    cell: e.low ? 1.2 : 0.8,
    palette: r,
    rand: e.rand,
    uv: !1,
    jitter: 0.06,
  });
  i && e.stone.addColored(i);
}
function H(e, t) {
  let n = t.build();
  n && e.stone.addColored(n);
}
function U(e, t, n) {
  (we(e.cheap, e.stone, e.glow, t, n),
    e.lamps.push({ x: t, y: Se, z: n, kind: `stone` }),
    e.circle(t, n, 0.38));
}
function kt(e, t, n, r) {
  (e.stone.cylinder(t, n, r, 0.06, 0.08, 0.05, 6, C.bronze),
    e.glow.add(new f(0.045, 6, 4), 16762474, { x: t, y: n + 0.08, z: r, sy: 1.3 }),
    e.lamps.push({ x: t, y: n + 0.1, z: r, kind: `candle` }));
}
function At(e, t, n, r) {
  e.lamps.push({ x: t, y: n, z: r, kind: `stone` });
}
function jt(e, t, n, r) {
  (U(e, t - n, r), U(e, t + n, r));
}
function Mt(e, t, n, r, i = 1.8) {
  let a = e.stone,
    o = r === `x` ? i : 0.5,
    s = r === `x` ? 0.5 : i,
    c = r === `x` ? 0.16 : 0.42,
    l = r === `x` ? 0.42 : 0.16;
  for (let e of [-1, 1])
    at(
      a,
      r === `x` ? t + e * (i / 2 - 0.22) : t,
      0.21,
      r === `z` ? n + e * (i / 2 - 0.22) : n,
      c,
      0.42,
      l,
      C.stoneDark,
      0,
    );
  (at(a, t, 0.46, n, o, 0.08, s, C.stoneLight, 0, { round: e.low ? 0 : 0.02 }),
    e.box(t - o / 2 - 0.05, t + o / 2 + 0.05, n - s / 2 - 0.05, n + s / 2 + 0.05));
}
function Nt(e, t, n, r, i = 0.7) {
  let o = e.rand;
  e.stone.add(
    new a(r, e.low || r < 0.45 ? 0 : 1),
    o() > 0.5 ? C.stoneDark : 8222568,
    { x: t, y: r * i * 0.55, z: n, sx: 1 + o() * 0.3, sy: i, sz: 0.8 + o() * 0.3, ry: o() * w },
    { jitter: 0.1, ao: r },
  );
}
function Pt(e, t, n, r, i) {
  let a = e.rand,
    o = e.scaled(i);
  for (let i = 0; i < o; i++) {
    let o = a() * w,
      s = i === 0 ? 0 : r * (0.4 + a() * 0.6);
    Nt(e, t + Math.cos(o) * s, n + Math.sin(o) * s, (i === 0 ? 0.55 : 0.28) + a() * 0.22);
  }
  e.circle(t, n, r + 0.45);
}
function Ft(e, t, n, r, i, a = !0) {
  let { ctx: o } = e,
    s = e.rand;
  if (
    (Ae(o, {
      x: t,
      y: r * 0.62,
      z: n,
      radius: r,
      squash: 0.72,
      detail: +!e.low,
      base: 3103280,
      crown: 6195780,
      bump: 0.22,
    }),
    i !== null)
  ) {
    let a = e.scaled(12);
    for (let o = 0; o < a; o++) {
      let a = s() * w,
        o = s(),
        c = 0.35 + s() * 0.6,
        l = r * (0.55 + 0.4 * (1 - c * 0.6));
      e.flat.add(new f(0.08, 3, 2), i, {
        x: t + Math.cos(a) * l * (0.7 + 0.3 * o),
        y: r * 0.62 + (c - 0.35) * r * 0.9,
        z: n + Math.sin(a) * l * (0.7 + 0.3 * o),
      });
    }
  }
  a && e.circle(t, n, r * 0.8);
}
var It = 9345624,
  Lt = [5143100, 6063681, 4419126];
function Rt(e, t, n, r = 6.5) {
  let i = e.rand,
    o = e.low ? 3 : 5;
  for (let s = 0; s < o; s++) {
    let o = t + (i() - 0.5) * 1.3,
      s = n + (i() - 0.5) * 1.3,
      c = r * (0.75 + i() * 0.4),
      l = (0.04 + i() * 0.16) * c,
      u = i() * w,
      d = new p(o, -0.05, s),
      f = new p(o + Math.cos(u) * l, c, s + Math.sin(u) * l);
    e.flat.limb(d, f, 0.06, 0.022, 4, It);
    let m = e.low ? 2 : 3;
    for (let t = 0; t < m; t++) {
      let n = t / m,
        r = i() * w;
      e.flat.add(
        new a(1, 0),
        Lt[Math.floor(i() * 3)] ?? 5143100,
        {
          x: f.x + Math.cos(r) * 0.35 * (1 + n),
          y: f.y - 0.3 - n * 1.5,
          z: f.z + Math.sin(r) * 0.35 * (1 + n),
          sx: 0.85 - n * 0.2,
          sy: 0.55,
          sz: 0.85 - n * 0.2,
          ry: i() * w,
        },
        { ao: 0 },
      );
    }
  }
  e.circle(t, n, 0.75);
}
var W = { x: 25, z: 0, spot: { x: 25, z: -1.45 } },
  zt = `xin-que`,
  Bt = 1.4,
  Vt = { halfW: 0.45, halfD: 0.24, top: 0.5, slab: 0.05 },
  G = { rTop: 0.085, rBottom: 0.075, h: 0.26, bundleR: 0.068, bundleH: 0.11 },
  Ht = 13215839,
  Ut = 15127450,
  Wt = { minX: W.x - Vt.halfW, maxX: W.x + Vt.halfW, minZ: W.z - Vt.halfD - 0.02, maxZ: W.z + Vt.halfD };
function Gt(e, t) {
  let { x: n, z: r } = W,
    { halfW: i, halfD: a, top: o, slab: s } = Vt;
  e.cuboid(n - i, n + i, o - s, o, r - a, r + a, C.lacquer);
  for (let t of [n - i + 0.05, n + i - 0.11])
    e.cuboid(t, t + 0.06, 0, o - s, r - a + 0.04, r + a - 0.04, C.lacquerBrown);
  (t || e.cuboid(n - i + 0.06, n + i - 0.06, o - 0.24, o - s, r - a - 0.012, r - a - 0.002, C.lacquerDark),
    e.cylinder(n, o, r, G.rTop, G.rBottom, G.h, t ? 6 : 8, Ht),
    e.cylinder(n, o + G.h, r, G.bundleR, G.bundleR, G.bundleH, 6, Ut),
    e.add(new S(0.016, 0.24, 0.008), C.lacquer, {
      x: n + 0.025,
      y: o + G.h + G.bundleH + 0.06,
      z: r - 0.01,
      rz: -0.18,
    }));
}
function Kt(e) {
  Gt(e.flat, e.low);
  let t = Wt;
  (e.box(t.minX - 0.05, t.maxX + 0.05, t.minZ - 0.05, t.maxZ + 0.05),
    e.ctx.interactions.push({
      id: zt,
      kind: `que`,
      x: W.spot.x,
      z: W.spot.z,
      radius: Bt,
      label: `Xin quẻ`,
      pick: { x: W.x, y: 0.6, z: W.z, r: 0.6 },
    }));
}
var qt = new p(0, 1, 0),
  K = class {
    constructor(e, t, n, r, a) {
      (N(this, `batch`, void 0),
        N(this, `base`, new o()),
        (this.batch = e),
        this.base.compose(new p(t, n, r), new i().setFromAxisAngle(qt, a), new p(1, 1, 1)));
    }
    add(e, t, n = {}, r) {
      let i = new o().multiplyMatrices(this.base, ce(n));
      this.batch.add(e, t, i, r);
    }
    limb(e, t, n, r, i, a) {
      let o = new p(...e).applyMatrix4(this.base),
        s = new p(...t).applyMatrix4(this.base);
      this.batch.limb(o, s, n, r, i, a, { ao: 0.1 });
    }
    ribbon(e, t, n, r) {
      let a = new p(...e),
        s = new p(...t).sub(a),
        c = s.length();
      if (c < 1e-6) return;
      let l = new o().compose(
        a.clone().addScaledVector(s, 0.5),
        new i().setFromUnitVectors(qt, s.divideScalar(c)),
        new p(1, 1, 1),
      );
      this.batch.add(new S(n, c, 0.014), r, new o().multiplyMatrices(this.base, l), { ao: 0.1 });
    }
  },
  Jt = { phat: 14275525, quanAm: 15854818 };
function Yt(e, t, n, r, i, a, s) {
  let c = t.positions.length / 3,
    l = new v(n),
    d = new Float32Array(c * 3);
  for (let e = 0; e < c; e++) {
    let n = t.ao ? Fe((t.ao[e] ?? 255) / 255) : 1;
    ((d[e * 3] = l.r * n), (d[e * 3 + 1] = l.g * n), (d[e * 3 + 2] = l.b * n));
  }
  let f = new _();
  (f.setAttribute(`position`, new u(t.positions.slice(), 3)),
    f.setAttribute(`color`, new u(d, 3)),
    f.setIndex(new u(t.indices.slice(), 1)),
    f.computeVertexNormals(),
    f.applyMatrix4(new o().makeRotationY(s).setPosition(r, i, a)),
    e.addColored(f));
}
var q = 15851718,
  J = 15657436,
  Xt = 16249832,
  Zt = 14472386,
  Qt = C.hair,
  $t = 12081744,
  en = 2760728;
function tn(e, t, n = 1) {
  return new g(
    e.map(([e, t]) => new d(e * n, t)),
    t,
  );
}
function nn(e, t, n, r, i, a) {
  let o = Math.min(0.92, Math.abs(i.x) / (0.93 * n)),
    s = Math.min(0.5, Math.abs(i.y - r) / (1.12 * n)),
    c = -n * Math.sqrt(Math.max(0.2, 1 - o * o - s * s)) - i.tube * 0.3;
  e.add(
    new b(i.radius, i.tube, 3, a, i.sweep),
    t,
    { x: i.x, y: i.y, z: c, rz: i.from, ry: -Math.sign(i.x) * Math.asin(o) * 0.9 },
    { ao: 0 },
  );
}
function rn(e, t, n, r, i, a) {
  (e.add(new f(n, a, Math.max(5, a - 4)), q, { y: t, sy: 1.12, sx: 0.93 }),
    e.add(
      new f(n * 1.045, a, 5, 0, w, 0, Math.PI * 0.46),
      Qt,
      { y: t + n * 0.03, z: n * 0.08, rx: 0.45, sy: 1.12, sx: 0.95 },
      { ao: 0 },
    ),
    i === `ushnisha`
      ? e.add(new f(n * 0.46, 8, 5), Qt, { y: t + n * 1.12, z: n * 0.04, sy: 0.85 })
      : e.add(new f(n * 0.5, 8, 5), Qt, { y: t + n * 1.2, z: n * 0.12, sy: 1.1 }));
  let o = r ? 4 : 6,
    s = n * 0.026;
  for (let r of [-1, 1]) {
    let i = n * 0.17;
    nn(
      e,
      en,
      n,
      t,
      { x: r * n * 0.36, y: t + n * 0.08 + i, radius: i, from: Math.PI * 1.5 - 1.05, sweep: 2.1, tube: s },
      o,
    );
    let a = n * 0.55;
    nn(
      e,
      Qt,
      n,
      t,
      { x: r * n * 0.38, y: t + n * 0.3 - a, radius: a, from: Math.PI / 2 - 0.3, sweep: 0.6, tube: s * 0.9 },
      o,
    );
  }
  let c = n * 0.2;
  if (
    (nn(
      e,
      $t,
      n,
      t,
      { x: 0, y: t - n * 0.4 + c, radius: c, from: Math.PI * 1.5 - 0.8, sweep: 1.6, tube: s * 1.1 },
      o,
    ),
    e.add(new f(n * 0.11, 5, 4), q, { y: t - n * 0.12, z: -n * 1, sz: 1.2 }),
    e.add(new f(n * 0.05, 4, 3), C.goldDeep, { y: t + n * 0.42, z: -n * 0.93 }),
    !r)
  )
    for (let r of [-1, 1])
      e.add(new f(n * 0.2, 5, 4), q, { x: r * n * 0.97, y: t - n * 0.08, z: n * 0.02, sx: 0.4, sy: 1.3 });
}
function an(e, t, n, r, i, a, o, s) {
  for (let c = 0; c < t; c++) {
    let l = (c / t) * w,
      u = Math.cos(l),
      d = Math.sin(l);
    e.add(new f(1, 4, 2), c % 2 ? o : s, {
      x: u * n,
      y: r,
      z: d * n,
      ry: -l,
      rz: -a,
      sx: i * 0.28,
      sy: i,
      sz: i * 0.55,
    });
  }
}
function on(e, t, n, r) {
  let i = e.low,
    a = e.stone,
    o = new K(a, t, 0, n, r);
  (o.add(new S(2.1, 0.3, 2.1), C.stoneDark, { y: 0.15 }, { ao: 0.3 }),
    o.add(new S(1.7, 0.28, 1.7), C.stone, { y: 0.44 }),
    o.add(new m(0.88, 0.95, 0.22, i ? 8 : 12), C.stoneLight, { y: 0.69 }));
  let s = e.statues?.phatNho;
  (s ? Yt(e.flat, s, Jt.phat, t, 0.8, n, r - Math.PI) : sn(e, t, n, r), e.circle(t, n, 1.28));
}
function sn(e, t, n, r) {
  let i = e.low,
    a = i ? 10 : 14,
    o = new K(e.flat, t, 0, n, r);
  (an(o, i ? 8 : 12, 0.78, 0.9, 0.3, 0.55, C.pinkLight, 15984352),
    an(o, i ? 6 : 9, 0.6, 1.02, 0.24, 0.3, C.pink, C.pinkLight),
    o.add(new m(0.58, 0.66, 0.2, a), C.pinkLight, { y: 0.9 }),
    o.add(new f(1, a, 7), J, { y: 1.2600000000000002, sx: 0.8, sy: 0.2, sz: 0.55 }));
  for (let e of [-1, 1]) o.add(new f(0.2, 8, 6), J, { x: e * 0.62, y: 1.2400000000000002, z: -0.3, sy: 0.7 });
  (o.add(
    tn(
      [
        [0.001, 0],
        [0.46, 0],
        [0.44, 0.2],
        [0.36, 0.55],
        [0.31, 0.9],
        [0.36, 1.15],
        [0.4, 1.28],
        [0.28, 1.4],
        [0.12, 1.5],
        [0.001, 1.52],
      ],
      a,
    ),
    J,
    { y: 1.2600000000000002, sz: 0.8 },
  ),
    o.limb([0.32, 2.67, -0.1], [-0.16, 1.6700000000000002, -0.34], 0.07, 0.05, 5, Zt));
  for (let e of [-1, 1])
    (o.limb([e * 0.4, 2.5, 0], [e * 0.52, 1.9000000000000001, -0.12], 0.12, 0.1, 6, J),
      o.limb([e * 0.52, 1.9000000000000001, -0.12], [e * 0.12, 1.62, -0.46], 0.1, 0.075, 6, J));
  (o.add(new f(1, 8, 5), q, { y: 1.62, z: -0.5, sx: 0.24, sy: 0.07, sz: 0.15 }),
    o.add(new m(0.09, 0.11, 0.16, 8), q, { y: 2.74 }),
    rn(o, 2.9400000000000004, 0.23, i, `ushnisha`, a - 2),
    o.add(
      new m(0.52, 0.52, 0.025, i ? 16 : 20),
      C.goldLight,
      { y: 3.0000000000000004, z: 0.36, rx: Math.PI / 2 },
      { ao: 0 },
    ),
    o.add(new b(0.54, 0.03, 3, i ? 16 : 24), C.goldDeep, { y: 3.0000000000000004, z: 0.33 }));
}
var cn = [
    [0.62, 0.8],
    [0.55, 0.7],
    [0.48, 0.62],
    [0.42, 0.54],
    [0.36, 0.46],
  ],
  ln = [C.stone, 10722443, 10130308],
  un = 2893602,
  dn = [
    [0.001, 0],
    [0.11, 0.04],
    [0.15, 0.16],
    [0.11, 0.3],
    [0.04, 0.42],
    [0.001, 0.47],
  ],
  fn = 1.22;
function pn(e, t, n, i, a) {
  let o = e.low,
    s = Math.atan2(i - t, a - n) - Math.PI / 6,
    c = new K(e.stone, t, 0, n, s),
    l = new K(e.flat, t, 0, n, s);
  (c.add(new m(1.12, 1.18, 0.18, 6), C.stoneDark, { y: 0.09 }, { ao: 0.3 }),
    c.add(new m(0.86, 0.92, 0.26, 6), C.stone, { y: 0.31 }),
    c.add(new m(0.74, 0.78, 0.18, 6), C.stoneLight, { y: 0.53 }));
  let u = 0.62;
  cn.forEach(([e, t], n) => {
    if ((c.add(new m(e * 0.96, e, t, 6, 1, !0), ln[n % 3], { y: u + t / 2 }), !o || n < 3)) {
      let n = e * 0.42,
        i = t * 0.48,
        a = u + t * 0.42,
        o = e * 0.98 * Math.cos(Math.PI / 6) + 0.012;
      for (let e = 0; e < 6; e++) {
        let t = Math.PI / 6 + (e * Math.PI) / 3,
          s = { x: Math.sin(t) * o, z: Math.cos(t) * o, ry: t };
        (l.add(new r(n, i), un, { ...s, y: a }, { ao: 0 }),
          l.add(new x(n / 2, 4, 0, Math.PI), un, { ...s, y: a + i / 2 }, { ao: 0 }));
      }
    }
    u += t;
    let i = cn[n + 1]?.[0] ?? 0.2;
    (c.add(new m(i, e * 1.3, 0.13, 6), C.stoneDark, { y: u + 0.065 }), (u += 0.13));
  });
  let d = new K(e.stone, t, u, n, s);
  (an(d, o ? 6 : 8, 0.16, 0.06, 0.14, 0.6, C.stoneLight, C.stone),
    d.add(tn(dn, o ? 6 : 8), C.stoneLight, { y: 0.06 }),
    d.add(new h(0.035, 0.32, 6), C.stone, { y: 0.67 }),
    e.circle(t, n, fn));
}
var mn = [
    [0.001, 0],
    [0.07, 0],
    [0.1, 0.04],
    [0.14, 0.16],
    [0.13, 0.26],
    [0.06, 0.34],
    [0.075, 0.42],
    [0.001, 0.42],
  ],
  hn = [
    [0.001, 0],
    [0.8, 0],
    [0.84, 0.08],
    [0.72, 0.36],
    [0.58, 0.9],
    [0.47, 1.5],
    [0.38, 2.05],
    [0.335, 2.36],
    [0.37, 2.7],
    [0.42, 3.05],
    [0.44, 3.25],
    [0.38, 3.45],
    [0.2, 3.6],
    [0.001, 3.7],
  ];
function gn(e) {
  for (let t = 0; t + 1 < hn.length; t++) {
    let [n, r] = hn[t],
      [i, a] = hn[t + 1];
    if (e >= r && e <= a) return n + ((i - n) * (e - r)) / (a - r);
  }
  return hn[hn.length - 1][0];
}
function _n(e) {
  return 0.05 * Math.sin((Math.PI * Math.min(e, 3.6)) / 3.6);
}
function vn(e, t, n, r) {
  let i = e * (1 + 0.075 * de(2.3, 0.2, t) * Math.cos(7 * (n - Math.PI))),
    a = 0.16 * de(1.1, 0, t) * Math.max(0, Math.cos(n)) ** 2;
  return r.set(i * Math.sin(n) + _n(t), t, 0.82 * i * Math.cos(n) + a);
}
function yn(e, t) {
  let n = tn(e, t),
    r = n.getAttribute(`position`),
    i = new p();
  for (let e = 0; e < r.count; e++) {
    let t = r.getX(e),
      n = r.getZ(e);
    (vn(Math.hypot(t, n), r.getY(e), Math.atan2(t, n), i), r.setXYZ(e, i.x, i.y, i.z));
  }
  return (n.computeVertexNormals(), n);
}
function bn(e, t, n = 0.012) {
  let r = gn(t),
    i = vn(r, t, Math.PI - Math.asin(Math.max(-0.97, Math.min(0.97, e / r))), new p());
  return [i.x, t, i.z - n];
}
var xn = [
  [0.001, 4.56],
  [0.23, 4.45],
  [0.31, 4.3],
  [0.36, 4.1],
  [0.42, 3.86],
  [0.55, 3.45],
  [0.64, 2.9],
  [0.72, 2.2],
  [0.8, 1.5],
];
function Sn(e) {
  let { x: t, z: n, basinR: r } = k,
    i = e.low,
    a = e.rand,
    o = i ? 10 : 14,
    s = new L();
  Qe(s, {
    cx: t,
    cz: n,
    r0: r - 0.38,
    r1: r,
    y0: 0,
    y1: 0.52,
    palette: [C.stone, 10722443, 9406842],
    capHex: C.stoneLight,
    rand: a,
    block: e.coarse(1),
    chord: e.coarse(0.6),
  });
  let c = s.build();
  c && e.stone.addColored(c);
  let l = new L();
  tt(l, t, n, r - 0.36, 0.34, C.water, i ? 14 : 24);
  let u = l.build();
  (u && e.flat.addColored(u), Ce(e.ctx, t, n, r - 0.3, 0.34, [{ x: t, z: n, r: 1.28 }]));
  let d = new K(e.stone, t, 0, n, 0);
  (d.add(new m(1.28, 1.4, 0.4, 8), C.stone, { y: 0.2 }, { ao: 0.4 }),
    d.add(new m(1.06, 1.16, 0.26, 8), C.stoneLight, { y: 0.52 }));
  let p = new K(e.flat, t, 0, n, 0);
  (an(p, i ? 12 : 16, 1.08, 0.84, 0.46, 0.55, C.pinkLight, 15984352),
    an(p, i ? 9 : 13, 0.84, 1, 0.4, 0.35, C.pink, C.pinkLight),
    an(p, i ? 7 : 10, 0.78, 1.12, 0.32, 0.2, C.pinkLight, 15984352),
    p.add(new m(0.78, 0.88, 0.32, o), C.pinkLight, { y: 0.78 }));
  let h = e.statues?.quanAmDung;
  h ? Cn(e, h) : Tn(e);
  let g = t - 1.66,
    _ = new K(e.stone, g, 0, n, 0);
  (_.add(new S(0.55, 0.62, 1.5), C.stone, { y: 0.31 }, { ao: 0.6 }),
    _.add(new S(0.66, 0.08, 1.62), C.stoneLight, { y: 0.66 }));
  let v = new K(e.flat, g, 0.7, n, 0);
  (v.add(new m(0.1, 0.13, 0.12, 8), C.bronze, {}, { ao: 0 }),
    v.add(new m(0.07, 0.07, 0.04, 8), 8223348, { y: 0.07 }));
  for (let e of [-1, 1])
    (v.add(new f(0.075, 6, 5), C.goldDeep, { z: e * 0.5, y: 0.08 }, { ao: 0 }),
      v.add(new f(0.1, 6, 5), C.pink, { z: e * 0.5, y: 0.2 }));
  e.circle(t, n, r + 0.14);
}
function Cn(e, t) {
  let { x: n, z: r } = k,
    i = e.low,
    a = wn.baseY;
  Yt(e.flat, t, Jt.quanAm, n, a, r, -Math.PI / 2);
  for (let t = 0; t < (i ? 4 : 8); t++) e.rand();
  let o = new K(e.flat, n, a, r, -Math.PI / 2),
    { x: s, y: c, z: l } = wn.halo;
  (o.add(new m(0.64, 0.64, 0.03, i ? 20 : 24), C.goldLight, { x: s, y: c, z: l, rx: Math.PI / 2 }, { ao: 0 }),
    o.add(new b(0.64, 0.03, 3, i ? 20 : 28), C.goldDeep, { x: s, y: c, z: l + 0.015 }),
    o.add(new b(0.5, 0.012, 3, i ? 18 : 24), C.gold, { x: s, y: c, z: l + 0.02 }));
}
var wn = { baseY: 0.55, halo: { x: 0.09, y: 4.22, z: -0.62 } };
function Tn(e) {
  let { x: t, z: n } = k,
    r = e.low,
    i = e.rand,
    a = r ? 10 : 14,
    o = k.height - 4.4,
    s = new K(e.flat, t, o, n, Math.PI / 2),
    c = r ? 14 : 18;
  s.add(yn(hn, c), J, {}, { ao: 0.1 });
  let l = [0.03, 0.17].map((e) => [gn(e) + 0.014, e]);
  (s.add(yn(l, c), C.gold, {}, { ao: 0 }),
    s.limb([0.44, 3.15, -0.02], [0.62, 2.55, -0.12], 0.115, 0.1, 6, J),
    s.limb([0.62, 2.55, -0.12], [0.5, 2.95, -0.5], 0.1, 0.07, 6, J),
    s.add(new f(0.08, 6, 5), q, { x: 0.5, y: 2.97, z: -0.52 }),
    s.limb([-0.44, 3.15, -0.02], [-0.62, 2.55, -0.12], 0.115, 0.1, 6, J),
    s.limb([-0.62, 2.55, -0.12], [-0.38, 2.4, -0.52], 0.1, 0.07, 6, J),
    s.add(new f(0.08, 6, 5), q, { x: -0.38, y: 2.4, z: -0.54 }),
    s.add(tn(mn, 8), C.goldDeep, { x: -0.38, y: 2.44, z: -0.56 }));
  for (let [e, t, n] of [
    [0.62, 2.33, 0.8],
    [-0.58, 2.1, 0.72],
  ])
    s.add(new m(0.09, 0.27, n, 8), J, { x: e, y: t, z: -0.3, sx: 0.45 }, { ao: 0.1 });
  for (let e of [-1, 1]) {
    let t = [
      [e * 0.66, 2.5, -0.05],
      [e * 0.8, 1.6, 0.05],
      [e * 0.9, 0.7, 0.15],
      [e * 0.97, 0.12, 0.23],
    ];
    for (let e = 0; e + 1 < t.length; e++) s.ribbon(t[e], t[e + 1], 0.11, Xt);
  }
  (s.limb([0.5, 2.97, -0.52], [0.54, 3.95, -0.6], 0.016, 0.01, 4, 7035462),
    s.limb([0.54, 3.95, -0.6], [0.5, 3.85, -0.98], 0.01, 0.006, 4, 7035462));
  let u = r ? 4 : 8;
  for (let e = 0; e < u; e++) {
    let t = (e + 1) / (u + 1);
    s.add(new f(1, 4, 3), 5214021, {
      x: 0.52 + (i() - 0.5) * 0.06,
      y: 3.95 - t * 0.18 - 0.12,
      z: -0.6 - t * 0.38,
      sx: 0.03,
      sy: 0.2,
      sz: 0.045,
      rx: 0.15,
    });
  }
  for (let [e, t, n] of [
    [xn, Xt, 1],
    [[...xn].reverse(), Zt, 0.97],
  ]) {
    let r = new g(
      e.map(([e, t]) => new d(e * n, t)),
      a - 2,
      -1.9,
      3.8,
    );
    s.add(r, t, { sz: 0.9 }, { ao: 0 });
  }
  (s.add(new m(0.09, 0.12, 0.2, 8), q, { y: 3.72 }),
    rn(s, 3.96, 0.28, r, `bun`, a - 2),
    s.add(new b(0.27, 0.025, 4, r ? 10 : 18), C.gold, { y: 4.11, rx: Math.PI / 2 - 0.1, sy: 1.05 }),
    s.add(
      new f(1, 8, 5),
      C.gold,
      { y: 4.260000000000001, z: -0.275, rx: 0.2, sx: 0.12, sy: 0.15, sz: 0.035 },
      { ao: 0 },
    ),
    s.add(new f(1, 6, 4), Xt, { y: 4.23, z: -0.31, rx: 0.2, sx: 0.04, sy: 0.05, sz: 0.022 }, { ao: 0 }),
    s.add(new f(0.024, 5, 4), Xt, { y: 4.300000000000001, z: -0.296 }, { ao: 0 }));
  let p = 3.98;
  (s.add(new m(0.64, 0.64, 0.03, r ? 20 : 24), C.goldLight, { y: p, z: 0.42, rx: Math.PI / 2 }, { ao: 0 }),
    s.add(new b(0.64, 0.03, 3, r ? 20 : 28), C.goldDeep, { y: p, z: 0.405 }),
    s.add(new b(0.5, 0.012, 3, r ? 18 : 24), C.gold, { y: p, z: 0.4 }));
  for (let e of [-1, 1])
    (s.add(new f(0.17, 8, 6), J, { x: e * 0.4, y: 3.27, z: -0.02, sy: 0.85 }),
      s.limb([e * 0.2, 3.78, -0.1], [e * 0.34, 3.12, -0.2], 0.05, 0.034, 5, Qt));
  let h = (e, t, n, i) =>
    s.add(new b(t, n, 3, r ? 14 : 24), i, { x: _n(e), y: e, rx: Math.PI / 2, sy: 0.82 });
  (h(3.5, 0.33, 0.02, C.gold), h(2.38, 0.335, 0.04, C.goldDeep));
  let _ = [3.4, 3.05, 2.7, 2.35, 2.05, 1.5, 0.9, 0.4, 0.14];
  for (let e = 0; e + 1 < _.length; e++) s.limb(bn(0, _[e]), bn(0, _[e + 1]), 0.016, 0.016, 4, C.gold);
  let v = (e, t, n, r, i, a) => {
    for (let o = 0; o < 3; o++) {
      let c = bn(e + ((n - e) * o) / 3, t + ((r - t) * o) / 3, a),
        l = bn(e + ((n - e) * (o + 1)) / 3, t + ((r - t) * (o + 1)) / 3, a);
      s.ribbon(c, l, i, C.pink);
    }
  };
  (v(0.3, 3.36, -0.26, 2.42, 0.1, 0.02),
    v(-0.26, 2.42, -0.3, 1.5, 0.1, 0.04),
    v(-0.3, 1.5, -0.2, 0.62, 0.11, 0.07),
    v(-0.2, 2.4, 0, 1.5, 0.09, 0.04),
    v(0, 1.5, 0.1, 0.7, 0.1, 0.07));
  for (let [e, t] of [
    [-0.1, 3.4],
    [0.1, 3.4],
    [0, 3.3],
  ]) {
    let [n, r, i] = bn(e, t, 0.01);
    s.add(new f(0.028, 5, 4), C.goldDeep, { x: n, y: r, z: i }, { ao: 0 });
  }
  let [y, x, S] = bn(0, 3.18, 0.02);
  s.add(new f(0.04, 5, 4), 13916794, { x: y, y: x, z: S }, { ao: 0 });
}
var En = { x0: 21.5, x1: 26.9, z0: -14.2, z1: -5.8 },
  Dn = { x: 26.2, z: k.z, radius: 3 },
  On = 35.4;
function kn(e) {
  (V(e, { x0: D.x1 + 0.4, x1: 28.8, z0: -2.9, z1: -1.1 }, 0.005),
    V(e, { x0: 24.8, x1: 26.4, z0: En.z1 - 0.1, z1: -2.9 }, 0.005),
    V(e, { x0: 27.2, x1: 28.8, z0: -1.1, z1: T.z - 2.3 + 0.2 }, 0.005));
}
function An(e) {
  let t = En;
  V(e, t, O);
  let n = (t, n, r, i) => {
    e.stone.cuboid(t, n, 0, 0.05, r, i, C.stoneDark);
  };
  (n(t.x0 - 0.15, t.x0, t.z0 - 0.15, t.z1 + 0.15),
    n(t.x0, t.x1, t.z0 - 0.15, t.z0),
    n(t.x0, t.x1, t.z1, t.z1 + 0.15),
    Sn(e),
    e.ctx.interactions.push({
      id: fe,
      kind: `altar`,
      x: Dn.x,
      z: Dn.z,
      radius: Dn.radius,
      label: `Lễ Quan Âm`,
    }));
  for (let n of [t.x0 - 0.5, t.x1 + 0.5]) U(e, n, t.z1 + 0.9);
}
function jn(e) {
  let { x: t, z: n, r } = T,
    { low: i } = e,
    a = new L();
  (Qe(a, {
    cx: t,
    cz: n,
    r0: r - 0.4,
    r1: r,
    y0: 0,
    y1: 0.58,
    palette: [C.stone, 10722443, 9406842],
    capHex: C.stoneLight,
    rand: e.rand,
    block: e.coarse(0.9),
    chord: e.coarse(0.6),
  }),
    H(e, a));
  let o = new L();
  (rt(o, t, n, r - 0.05, 2.35, O - 0.003, 9407360, 40),
    et(o, {
      cx: t,
      cz: n,
      r0: r,
      r1: 2.3,
      y: O,
      radial: e.coarse(0.6),
      arc: e.coarse(0.7),
      palette: Ot,
      rand: e.rand,
    }),
    H(e, o));
  let s = new L();
  tt(s, t, n, r - 0.38, 0.18, 1321518, i ? 10 : 16);
  let c = s.build();
  c && e.flat.addColored(c);
  let l = 4863270;
  for (let r of [-1, 1]) e.flat.cuboid(t + r * 0.8 - 0.07, t + r * 0.8 + 0.07, 0, 2, n - 0.07, n + 0.07, l);
  (e.flat.cuboid(t - 0.9, t + 0.9, 1.95, 2.07, n - 0.08, n + 0.08, C.woodDark),
    e.flat.add(new h(1.15, 0.5, 4), C.mossTileDark, { x: t, y: 2.31, z: n, ry: Math.PI / 4, sy: 1 }),
    e.flat.add(new m(0.13, 0.13, 0.08, 8), C.bronze, { x: t, y: 1.82, z: n, rx: Math.PI / 2 }),
    e.flat.limb(new p(t + 0.05, 1.8, n), new p(t + 0.55, 0.66, n), 0.01, 0.01, 3, 7035462),
    e.flat.cylinder(t + 0.55, 0.58, n, 0.12, 0.1, 0.2, 8, l),
    e.circle(t, n, r + 0.2));
}
function Mn(e) {
  let { ctx: t } = e,
    n = 0;
  for (let e = -23; e <= 21; e += 16) je(t, On, e, 6.3 + ((n++ * 0.41) % 1), !0);
  (be(t, 33.4, -6.4, 1.2, !0),
    be(t, 32.8, -15.6, 1.1, !0),
    be(t, 33.2, 5.4, 1.1, !0),
    Rt(e, 30.6, -24.7),
    Rt(e, 26.4, -25),
    Rt(e, 34.2, -22.4),
    e.low || (Ee(e.cheap, 23.4, 6.6, 1, 0.7, e.flat), e.circle(23.4, 6.6, 0.45)),
    Pt(e, 31.4, 15.6, 1.2, 5));
  for (let [t, n, r, i] of [
    [22.3, -5.4, 0.8, 13840175],
    [22.3, 1.4, 0.8, 12720219],
    [22.2, 21.6, 0.8, 15251770],
    [21.8, -26, 0.8, 14162784],
  ])
    Ft(e, t, n, r, i);
  (U(e, 22.6, -3.5), e.low || U(e, 22.6, -0.5));
}
function Nn(e) {
  let { x: t, z: n, height: r } = k,
    i = t - 1.55;
  for (let t of [-0.27, 0.27]) kt(e, i, 0.7, n + t);
  if (!e.low) for (let r of [-0.66, 0.66]) kt(e, t - 0.92, 0.4, n + r);
  (At(e, t + 0.62, r - 4.4 + 3.96, n), e.lamps.push({ x: D.x1, y: 2.55, z: -2, kind: `outdoor` }));
}
function Pn(e) {
  (B(e, 33, 20, 2.8, 2.2, z.dry, -0.3),
    B(e, 33.5, -10.5, 2, 3, z.dry, 0.1),
    e.low || (B(e, 32.8, -15.6, 1.9, 1.7, z.bare, 0.4, 2), B(e, 33.2, 5.4, 1.9, 1.7, z.bare, -0.3, 2)),
    vt(e, T.x, T.z, 3.7, -Math.PI / 2 + 0.65, 0.35),
    vt(e, T.x, T.z, 3.7, 1.3, (3 * Math.PI) / 2 - 0.65),
    _t(e, [
      [20.8, -15.6],
      [27.4, -15.6],
    ]));
}
function Fn(e) {
  let t = e.lamps.length;
  (kn(e), An(e), jn(e), Mn(e), Pn(e), Nn(e), pt(e, t), Kt(e));
}
var In = [
    [2.6, 5.2, 0.8],
    [-2, 5, -1.9],
    [-0.8, 5.6, 2.5],
  ],
  Ln = [
    [0, 6.4, 0, 2.5],
    [2.8, 5.4, 0.9, 2.1],
    [-2.5, 5.5, -1.6, 2.2],
    [-0.9, 6, 2.8, 2],
    [1.4, 7.6, -1.2, 1.8],
    [-2.2, 7.2, 0.9, 1.7],
    [3.4, 6.5, -1.5, 1.6],
    [0.6, 5, -3, 1.7],
    [-3.5, 5, 1.8, 1.6],
  ];
function Rn(e, t, n, r, i = 9) {
  let { ctx: a, flat: o } = e,
    s = e.rand,
    c = e.low,
    l = 5913380;
  o.cylinder(t, -0.05, n, 0.42 * r, 0.62 * r, 3.3 * r, 8, l, { ao: 2 });
  let u = e.scaled(7);
  for (let e = 0; e < u; e++) {
    let i = (e / u) * w + s() * 0.4,
      a = (1.35 + s() * 0.5) * r;
    o.limb(
      new p(t + Math.cos(i) * 0.3 * r, 0.9 * r, n + Math.sin(i) * 0.3 * r),
      new p(t + Math.cos(i) * a, -0.02, n + Math.sin(i) * a),
      0.2 * r,
      0.08 * r,
      5,
      l,
      { ao: 1.5 },
    );
  }
  for (let [e, i, a] of In)
    o.limb(new p(t, 2.9 * r, n), new p(t + e * r, i * r, n + a * r), 0.26 * r, 0.1 * r, 6, l);
  e.circle(t, n, 0.62 * r + 0.1);
  let d = new p(),
    f = Math.min(i, e.scaled(Ln.length));
  for (let e = 0; e < f; e++) {
    let [i, o, l, u] = Ln[e],
      f = Math.floor(s() * ke.length),
      p = ke[f] ?? C.leaf,
      m = Me[f] ?? C.leaf;
    (Ae(a, {
      x: t + i * r,
      y: o * r,
      z: n + l * r,
      radius: u * r,
      squash: 0.8,
      detail: c ? 1 : a.quality === `high` ? 3 : 2,
      base: p,
      crown: m,
      bump: 0.2,
    }),
      c || (d.set(t + i * r, o * r, n + l * r), xe(a, d, u * r, 0.8, 14, p, m)));
  }
}
var zn = 14 + Ln.length * 90,
  Bn = 11588066,
  Vn = { medium: 128, high: 300 },
  Hn = { medium: 3, high: 4 },
  Un = 11887930,
  Wn = [
    [0, 1],
    [0.2, 0.45],
    [0.5, 0],
    [0.32, -0.38],
  ],
  Gn = [
    [0, 1],
    [0.48, 0.05],
    [0.3, -0.38],
  ],
  Kn = -0.22,
  Y = new p(),
  X = new p(),
  qn = new p(),
  Jn = new p(0, -1, 0);
function Yn(e, t, n, r, i, a, o) {
  (X.copy(Jn).addScaledVector(n, -Jn.dot(n)),
    X.lengthSq() < 1e-4 && X.set(1, 0, 0).addScaledVector(n, -n.x),
    X.normalize().applyAxisAngle(n, r),
    qn.crossVectors(X, n).normalize());
  let s = (r, o) =>
      e.vert(
        t.x + (qn.x * r + X.x * o) * i,
        t.y + (qn.y * r + X.y * o) * i,
        t.z + (qn.z * r + X.z * o) * i,
        n.x,
        n.y,
        n.z,
        I(a, o > 0.9 ? 1.12 : 0.9),
      ),
    c = e.vert(t.x + X.x * Kn * i, t.y + X.y * Kn * i, t.z + X.z * Kn * i, n.x, n.y, n.z, I(a, 1.12)),
    l = o ? Wn : Gn,
    u = s(0, 1);
  for (let t of [1, -1]) {
    let n = u;
    for (let r = 1; r < l.length; r++) {
      let [i, a] = l[r],
        o = s(i * t, a);
      (e.tri(c, n, o), (n = o));
    }
  }
}
function Xn(e, t, n, r) {
  for (let t = 0; t < zn; t++) e.rand();
  let i = ue(Bn),
    { ctx: a, flat: o } = e,
    s = a.quality === `high`,
    c = 5913380;
  o.cylinder(t, -0.05, n, 0.44 * r, 0.78 * r, 3.3 * r, 10, c, { ao: 2 });
  for (let e = 0; e < 5; e++) {
    let a = (e / 5) * w + 0.3 + i() * 0.35,
      s = (1.3 + i() * 0.35) * r;
    o.limb(
      new p(t + Math.cos(a) * 0.4 * r, 1.15 * r, n + Math.sin(a) * 0.4 * r),
      new p(t + Math.cos(a) * s, -0.02, n + Math.sin(a) * s),
      0.3 * r,
      0.06 * r,
      4,
      c,
      { ao: 1.5 },
    );
  }
  let l = new p(t, 2.9 * r, n);
  for (let [e, a, s] of In) {
    let u = new p(t + e * r, a * r, n + s * r);
    o.limb(l, u, 0.3 * r, 0.11 * r, 7, c);
    let d = l.clone().lerp(u, 0.45);
    for (let t of [-1, 1]) {
      let n = Math.atan2(s, e) + t * (0.6 + i() * 0.25),
        a = (1.3 + i() * 0.5) * r;
      o.limb(
        d,
        new p(d.x + Math.cos(n) * a, d.y + (0.6 + i() * 0.5) * r, d.z + Math.sin(n) * a),
        0.12 * r,
        0.045 * r,
        4,
        c,
      );
    }
  }
  e.circle(t, n, 0.62 * r + 0.1);
  let u = Ln.map(([e, i, a, o]) => ({ x: t + e * r, y: i * r, z: n + a * r, r: o * r * 0.94 }));
  for (let e of u) {
    let t = Math.floor(i() * ke.length);
    Ae(
      a,
      {
        x: e.x,
        y: e.y,
        z: e.z,
        radius: e.r,
        squash: 0.8,
        detail: s ? 2 : 1,
        base: ke[t] ?? C.leaf,
        crown: Me[t] ?? C.leaf,
        bump: 0.2,
      },
      i,
    );
  }
  let d = s ? Vn.high : Vn.medium,
    f = s ? Hn.high : Hn.medium,
    m = u.map((e) => e.r * e.r),
    h = m.reduce((e, t) => e + t, 0),
    g = (e, t, n, r) =>
      u.some((i, a) => {
        if (a === r) return !1;
        let o = (e - i.x) / i.r,
          s = (t - i.y) / (i.r * 0.8),
          c = (n - i.z) / i.r;
        return o * o + s * s + c * c < 0.85;
      }),
    _ = new L(),
    v = new p(),
    y = new p(),
    b = new p(),
    x = new p();
  for (let e = 0; e < d; e++) {
    let e = i() * h,
      t = 0;
    for (; t < u.length - 1 && e > m[t];) e -= m[t++];
    let n = u[t],
      r = !1;
    for (let e = 0; e < 6 && !r; e++) {
      let e = -0.85 + 1.45 * i(),
        a = i() * w,
        o = Math.sqrt(1 - e * e);
      Y.set(Math.cos(a) * o, e, Math.sin(a) * o);
      let s = n.r * (1.02 + 0.1 * i());
      (v.set(n.x + Y.x * s, n.y + Y.y * s * 0.8, n.z + Y.z * s), g(v.x, v.y, v.z, t) || (r = !0));
    }
    if (!r) continue;
    (b.set(-Y.z, 0, Y.x),
      b.lengthSq() < 1e-4 && b.set(1, 0, 0),
      b.normalize(),
      x.crossVectors(Y, b).normalize());
    let a = i() < 0.06 ? Un : (Qn[Math.floor(i() * 3)] ?? Qn[0]);
    for (let e = 0; e < f; e++) {
      let t = (e - (f - 1) / 2) * 0.17 + (i() - 0.5) * 0.06,
        n = (i() - 0.5) * 0.14,
        r = new p()
          .copy(v)
          .addScaledVector(b, t)
          .addScaledVector(x, n)
          .addScaledVector(Y, i() * 0.08);
      (y
        .copy(Y)
        .addScaledVector(b, (i() - 0.5) * 0.6)
        .addScaledVector(Jn, 0.25)
        .normalize(),
        Yn(_, r, y, (e - (f - 1) / 2) * 0.45 + (i() - 0.5) * 0.4, 0.3 + i() * 0.12, a, s));
    }
  }
  let S = _.build();
  S && o.addColored(S);
}
var Zn = [
    [0, 0.95],
    [0.4, 0.25],
    [0.54, -0.15],
    [0.3, -0.45],
    [0, -0.28],
    [-0.3, -0.45],
    [-0.54, -0.15],
    [-0.4, 0.25],
  ],
  Qn = [10207044, 8038460, 6263864, 12764232],
  $n = [12000284, 15906565];
function er(e, t, n, r, i) {
  let a = new p(0, -1, 0);
  (a.addScaledVector(n, -a.dot(n)),
    a.lengthSq() < 1e-4 && a.set(1, 0, 0).addScaledVector(n, -n.x),
    a.normalize());
  let o = new p().crossVectors(a, n).normalize(),
    s = (e, n) => [
      t.x + (o.x * e + a.x * n) * r,
      t.y + (o.y * e + a.y * n) * r,
      t.z + (o.z * e + a.z * n) * r,
    ],
    c = I(i, 1.18),
    l = I(i, 0.9),
    u = s(0, 0.05),
    d = e.vert(u[0], u[1], u[2], n.x, n.y, n.z, c),
    f = Zn.map(([t, r]) => {
      let i = s(t, r);
      return e.vert(i[0], i[1], i[2], n.x, n.y, n.z, l);
    });
  for (let t = 0; t < f.length; t++) e.tri(d, f[t], f[(t + 1) % f.length]);
}
function tr(e, t, n, r, i, a, o, s) {
  let c = Math.cos(o),
    l = Math.sin(o),
    u = I(a),
    d = I(a, 0.85),
    f = 0.05,
    p = 0.04,
    m = c * s,
    h = l * s,
    g = [
      [t - c * f, n, r - l * f, u],
      [t + c * f, n, r + l * f, u],
      [t + m + c * p, n - i, r + h + l * p, d],
      [t + m - c * p, n - i, r + h - l * p, d],
    ];
  for (let t of [1, -1]) {
    let n = g.map(([n, r, i, a]) => e.vert(n, r, i, l * t, 0, -c * t, a));
    e.quad(n[0], n[1], n[2], n[3]);
  }
}
var nr = [14260766, 15906565];
function rr(e, t, n, r, i = {}) {
  let a = e.rand,
    o = e.low,
    s = new L(),
    c = e.scaled(Ln.length),
    l = o ? 10 : 20,
    u = i.hearts ?? l,
    d = new p(),
    f = new p();
  for (let e = 0; e < l; e++) {
    let [i, o, l, p] = Ln[e % c],
      m = e * 2.399963 + a() * 0.8,
      h = -0.8 + a() * 0.95,
      g = Math.sqrt(1 - h * h);
    d.set(Math.cos(m) * g, h, Math.sin(m) * g);
    let _ = p * r * 1.1;
    f.set(t + i * r + d.x * _, o * r + d.y * _ * 0.8, n + l * r + d.z * _);
    let v = 0.5 + a() * 0.25,
      y = Qn[Math.floor(a() * Qn.length)];
    e < u && er(s, f, d, v, y);
  }
  let m = o ? 8 : 16;
  for (let e = 0; e < m; e++) {
    let [o, c, l] = In[e % In.length],
      u = 0.42 + 0.46 * a();
    tr(
      s,
      t + o * r * u + (a() - 0.5) * 0.3,
      2.9 * r + (c * r - 2.9 * r) * u - 0.12,
      n + l * r * u + (a() - 0.5) * 0.3,
      1 + a() * 0.7,
      (i.gold ? nr : $n)[e % 2],
      a() * Math.PI,
      (a() - 0.5) * 0.2,
    );
  }
  let h = (e) => (0.62 - 0.2 * ((e + 0.05) / (3.3 * r))) * r,
    g = o ? 6 : 9,
    _ = 1.35;
  (e.flat.cylinder(t, _, n, h(1.6500000000000001) + 0.04, h(_) + 0.04, 0.3, g, $n[0], { ao: 0 }),
    e.flat.cylinder(t, 1.6500000000000001, n, h(1.73) + 0.03, h(1.6500000000000001) + 0.03, 0.07, g, $n[1], {
      ao: 0,
    }));
  let v = h(1.55) + 0.06;
  (tr(s, t + v, 1.6300000000000001, n - 0.06, 0.95, $n[0], Math.PI / 2, 0.06),
    tr(s, t + v, 1.6300000000000001, n + 0.06, 0.7, $n[1], Math.PI / 2, -0.05));
  let y = s.build();
  y && e.flat.addColored(y);
}
var ir = Be,
  ar = 0.24,
  or = 0.5,
  sr = Le,
  cr = [
    [`hero`, -21.5, 33.5, 1.15],
    [`bodhi`, -29, 45, 1.2],
    [`bodhi`, 22, 31.5, 1.25],
    [`bodhi`, 16.5, 49, 1],
    [`bodhi`, 29.5, 42, 1.15],
  ],
  lr = [33, 48];
function ur() {
  let e = he.r;
  return [
    { at: Math.PI / 2, width: (_e.halfW * 2 + 0.6) / ((e + sr) / 2) },
    { at: Ie, width: Ge, keepSequence: !0 },
  ];
}
function dr(e) {
  let { x: t, z: n, r } = he,
    i = new L(),
    a = [C.stone, 10722443, 9406842, 11051665];
  (Qe(i, {
    cx: t,
    cz: n,
    r0: sr,
    r1: r,
    y0: 0,
    y1: ar,
    a0: 0,
    a1: Math.PI,
    palette: a,
    capHex: C.stoneLight,
    rand: e.rand,
    block: e.coarse(1.25),
    chord: e.coarse(0.6),
    gaps: ur(),
  }),
    H(e, i));
  let o = Math.round((r * 2) / 1.25),
    s = (r * 2) / o;
  for (let i = 0; i < o; i++) {
    let o = t - r + i * s,
      c = o + s;
    if (Math.abs((o + c) / 2 - _e.x) < _e.halfW + 0.45) continue;
    let l = a[Math.floor(e.rand() * a.length)] ?? C.stone;
    e.stone.cuboid(o, c, 0, ar, n - or, n, l);
  }
  let c = 0.45;
  for (let i of [-1, 1])
    for (let a = _e.halfW; a < r + 0.05; a += c) {
      let o = Math.min(a + c, r + 0.05),
        s = Math.sqrt(Math.max(0, r * r - a * a)),
        [l, u] = i > 0 ? [t + a, t + o] : [t - o, t - a];
      e.box(l, u, n - or - 0.05, n + s + 0.05);
    }
}
function fr(e) {
  let { x: n, z: r } = he,
    { ctx: i } = e,
    a = nt(n, r, sr, ir, 6, 30),
    o = new t(a, i.mats.water);
  ((o.name = `campus-front-water`), i.dynamic.add(o));
  let s = [{ x: n, z: r + 4.6, r: 2.6 }];
  (Ce(e.cheap, n - 4.4, r + 3.6, 3.4, ir, s), e.low || Ce(e.cheap, n + 4.4, r + 3.6, 3.4, ir, s));
  let c = a.getAttribute(`position`),
    l = c.count,
    u = new Float32Array(l),
    d = new Float32Array(l);
  for (let e = 0; e < l; e++) ((u[e] = c.getX(e)), (d[e] = c.getZ(e)));
  let f = !e.low && !i.calm,
    p = 0;
  return {
    update(e, t) {
      if (f && ((p += 1), p % 3 == 0)) {
        for (let e = 1; e < l; e++) {
          let n = u[e] ?? 0,
            r = d[e] ?? 0;
          c.setY(e, ir + 0.012 * (Math.sin(n * 1.4 + t * 1.1) + Math.sin(r * 1.7 - t * 0.8)));
        }
        c.needsUpdate = !0;
      }
    },
  };
}
function pr(e, t, n, r) {
  let i = e.low ? 5 : 6;
  (e.stone.cylinder(t, r, n, 0.17, 0.2, 0.05, i, C.stoneLight),
    e.glow.cylinder(t, r + 0.05, n, 0.11, 0.11, 0.24, i, 16762474),
    M(e.stone, t, r + 0.29, n, 0.38, i, C.stoneLight),
    e.lamps.push({ x: t, y: r + 0.17, z: n, kind: `stone` }));
}
function mr(e) {
  let t = e.stone,
    { halfW: n, deckY: r, z0: i, z1: a } = _e,
    o = [i, i + (a - i) / 3, i + (2 * (a - i)) / 3, a],
    s = [C.stoneLight, 11775132, 12235683];
  for (let e = 0; e < 3; e++) t.cuboid(-n, n, -0.1, r, o[e] + 0.01, o[e + 1] - 0.01, s[e], { round: 0 });
  for (let [e, o] of [
    [i - 0.55, i],
    [a, a + 0.55],
  ])
    t.cuboid(-n - 0.1, n + 0.1, -0.1, r * 0.55, e, o, C.stone, { round: 0 });
  let c = i + 0.3,
    l = a - 0.3;
  for (let r of [-1, 1]) {
    let i = r > 0 ? n : -n - 0.26,
      a = r > 0 ? n + 0.26 : -n;
    (t.cuboid(i, a, -0.1, 0.46, c, l, C.stone, { round: 0 }),
      t.cuboid(i - 0.04, a + 0.04, 0.46, 0.54, c, l, C.stoneLight, { round: 0 }));
    for (let i = 0; i < 5; i++) {
      let a = c + ((l - c) * i) / 4,
        o = r * (n + 0.13);
      (t.cuboid(o - 0.21, o + 0.21, -0.1, 0.86, a - 0.21, a + 0.21, C.stoneDark, { round: 0 }),
        t.cuboid(o - 0.27, o + 0.27, 0.86, 0.96, a - 0.27, a + 0.27, C.stoneLight, { round: 0 }),
        (e.low ? i === 2 : i === 1 || i === 3)
          ? pr(e, o, a, 0.96)
          : M(t, o, 0.96, a, 0.36, e.low ? 5 : 6, C.stoneLight));
    }
  }
}
function hr(e) {
  (V(e, { x0: -8.5, x1: 8.5, z0: 23.9, z1: 28.5 }, 0.004),
    V(e, { x0: -10.8, x1: 10.8, z0: 35.4, z1: 37.2 }, 0.004),
    V(e, { x0: -6.5, x1: 6.5, z0: 49.4, z1: 53.4 }, 0.004));
}
function gr(e) {
  let { ctx: t } = e;
  for (let [n, r, i, a] of cr) n === `hero` ? Rn(e, r, i, a, 5) : be(t, r, i, a, !0);
  let n = 0;
  for (let e of [-1, 1]) for (let r of lr) je(t, e * 34.6, r, 6.2 + ((n++ * 0.37) % 1), !0);
  for (let [t, n, r, i] of [[-13, 27.5, 1, 0.5]]) (Ee(e.cheap, t, n, r, i, e.flat), e.circle(t, n, 0.45 * r));
  (ve(e.cheap, -2.7, 31.4, `lahan`, t.rand() * w), e.low || ve(e.cheap, 2.7, 31.4, `dao`, t.rand() * w));
  for (let [t, n, r, i] of [
    [-9.8, 25.1, 0.9, 12720219],
    [9.8, 25.1, 0.9, 14162784],
    [-13.6, 30.5, 0.8, 13840175],
    [13.6, 30.5, 0.8, 13840175],
    [-7.4, 51.8, 0.8, null],
    [7.4, 51.8, 0.8, null],
  ])
    Ft(e, t, n, r, i);
}
function _r(e) {
  for (let t of [-1, 1])
    (B(e, t * 11.4, 41, 0.9, 4.6, z.worn, t * -0.12, 0), B(e, t * 10.6, 27.2, 1.8, 0.8, z.worn, 0, 0));
  (B(e, -25, 40.5, 5, 3.4, z.dry, 0.3), B(e, 23, 38.5, 4.6, 3.2, z.dry, -0.4));
  let t = e.low ? cr.slice(0, 3) : cr;
  for (let [, n, r, i] of t) B(e, n, r, 1.5 + i, 1.3 + i, z.bare, n * 0.1, 2);
  (xt(e, -8.6, -4.2, 29.8, 34.2, `e`), xt(e, 4.2, 8.6, 29.8, 34.2, `w`));
}
function vr(e) {
  (jt(e, 0, 3.5, 27.4), jt(e, 0, 3, 36.3), e.low || jt(e, 0, 3, 48.7));
  for (let t of [-1, 1]) (Mt(e, t * 12.3, 41.5, `z`), Mt(e, t * 12.3, 45, `z`));
}
function yr(e, t, n) {
  let r = he.z,
    i = e.stone;
  (i.cuboid(t - 0.75, t + 0.75, 0, 0.012, n - 0.6, r - or - 0.06, C.stoneLight),
    i.cuboid(t - 0.62, t + 0.62, 0.22999999999999998, 0.29, r - or - 0.04, r + 0.22, C.stoneLight));
}
function br(e) {
  if (Ne.waterRituals)
    for (let [t, n, r] of [
      [Ve, `pond`, `Thả đèn hoa đăng`],
      [He, `release`, `Phóng sinh`],
    ]) {
      let { x: i, z: a, id: o, pick: s } = t;
      (yr(e, i, a), e.ctx.interactions.push({ id: o, kind: n, x: i, z: a, radius: 1.6, label: r, pick: s }));
    }
}
function xr(e) {
  (hr(e), dr(e), e.ctx.animators.push(fr(e)), mr(e), gr(e), vr(e), _r(e), br(e));
}
var Sr = { west: `← Vườn bồ đề · Sân thiền`, east: `Quan Âm · Giếng ngọc →`, ahead: `Chánh điện ↑` },
  Z = 0.0225,
  Cr = 0.03,
  wr = 0.28,
  Tr = 1.8,
  Er = 3.4,
  Dr = 16762474,
  Or = 5913381,
  kr = 4862498;
function Q(e, t, n, r, i, a, o) {
  let s = [];
  for (let c = 0; c <= o; c++) {
    let l = ((i + ((a - i) * c) / o) * Math.PI) / 180;
    s.push([e + n * Math.cos(l), t + r * Math.sin(l)]);
  }
  return s;
}
function Ar(e) {
  let t = Q(2, 2.5, 2, 2.5, 0, 360, e),
    n = Q(2, 3, 2, 2, 180, 0, Math.ceil(e * 0.7)),
    r = Q(2.2, 4, 2.2, 4, 40, 320, e);
  return {
    a: {
      w: 4,
      strokes: [
        t,
        [
          [4, 5],
          [4, 0],
        ],
      ],
    },
    b: {
      w: 4,
      strokes: [
        [
          [0, 8],
          [0, 0],
        ],
        t,
      ],
    },
    c: { w: 4, strokes: [Q(2, 2.5, 2, 2.5, 38, 322, e)] },
    d: {
      w: 4,
      strokes: [
        t,
        [
          [4, 8],
          [4, 0],
        ],
      ],
    },
    đ: {
      w: 4.6,
      strokes: [
        t,
        [
          [4, 8],
          [4, 0],
        ],
        [
          [2.2, 6.4],
          [5, 6.4],
        ],
      ],
    },
    e: { w: 4, strokes: [[[0, 2.5], ...Q(2, 2.5, 2, 2.5, 0, 320, e)]] },
    g: { w: 4, strokes: [t, [[4, 5], ...Q(2, -0.8, 2, 1.3, 0, -160, Math.ceil(e * 0.6))]] },
    h: {
      w: 4,
      strokes: [
        [
          [0, 8],
          [0, 0],
        ],
        [...n, [4, 0]],
      ],
    },
    i: {
      w: 1.2,
      strokes: [
        [
          [0.6, 5],
          [0.6, 0],
        ],
        [
          [0.6, 6.5],
          [0.6, 7.1],
        ],
      ],
    },
    m: {
      w: 6.4,
      strokes: [
        [
          [0, 5],
          [0, 0],
        ],
        [...Q(1.6, 3.2, 1.6, 1.8, 180, 0, Math.ceil(e * 0.5)), [3.2, 0]],
        [...Q(4.8, 3.2, 1.6, 1.8, 180, 0, Math.ceil(e * 0.5)), [6.4, 0]],
      ],
    },
    n: {
      w: 4,
      strokes: [
        [
          [0, 5],
          [0, 0],
        ],
        [...n, [4, 0]],
      ],
    },
    o: { w: 4, strokes: [t] },
    t: {
      w: 3.2,
      strokes: [
        [[1, 8], ...Q(2.2, 1.2, 1.2, 1.2, 180, 320, Math.ceil(e * 0.5))],
        [
          [0, 5],
          [3, 5],
        ],
      ],
    },
    u: {
      w: 4,
      strokes: [
        [[0, 5], ...Q(2, 2, 2, 2, 180, 360, Math.ceil(e * 0.7))],
        [
          [4, 5],
          [4, 0],
        ],
      ],
    },
    A: {
      w: 5,
      strokes: [
        [
          [0, 0],
          [2.5, 8],
          [5, 0],
        ],
        [
          [0.9, 2.6],
          [4.1, 2.6],
        ],
      ],
    },
    C: { w: 4.4, strokes: [r] },
    G: { w: 4.4, strokes: [[...Q(2.2, 4, 2.2, 4, 40, 352, e), [2.6, 3.44]]] },
    Q: {
      w: 4.4,
      strokes: [
        Q(2.2, 4, 2.2, 4, 0, 360, e),
        [
          [2.6, 1.8],
          [4.6, -0.4],
        ],
      ],
    },
    S: {
      w: 4,
      strokes: [
        [
          ...Q(2, 6, 2, 2, 25, 270, Math.ceil(e * 0.7)),
          ...Q(2, 2, 2, 2, 90, -155, Math.ceil(e * 0.7)).slice(1),
        ],
      ],
    },
    V: {
      w: 5,
      strokes: [
        [
          [0, 8],
          [2.5, 0],
          [5, 8],
        ],
      ],
    },
    "←": {
      w: 6,
      strokes: [
        [
          [0, 3.5],
          [6, 3.5],
        ],
        [
          [2, 5.5],
          [0, 3.5],
          [2, 1.5],
        ],
      ],
    },
    "→": {
      w: 6,
      strokes: [
        [
          [0, 3.5],
          [6, 3.5],
        ],
        [
          [4, 5.5],
          [6, 3.5],
          [4, 1.5],
        ],
      ],
    },
    "↑": {
      w: 4,
      strokes: [
        [
          [2, 0],
          [2, 7],
        ],
        [
          [0, 5],
          [2, 7],
          [4, 5],
        ],
      ],
    },
    "·": {
      w: 1.2,
      strokes: [
        [
          [0.6, 3.4],
          [0.6, 4.1],
        ],
      ],
    },
  };
}
var jr = {
    u: [
      [
        [4, 4.4],
        [4.9, 4.9],
        [5.3, 5.9],
        [5, 6.8],
      ],
      5.4,
    ],
    o: [
      [
        [3.7, 3.8],
        [4.6, 4.4],
        [5, 5.4],
        [4.7, 6.3],
      ],
      5.2,
    ],
  },
  Mr = 769,
  Nr = 768,
  Pr = 770,
  Fr = 795,
  Ir = 803,
  Lr = new Map();
function Rr(e) {
  let t = Lr.get(e);
  return (t || ((t = Ar(e)), Lr.set(e, t)), t);
}
function zr(e, t = !1) {
  let n = Rr(t ? 5 : 7),
    r = [],
    i = [],
    a = (e, t) => {
      for (let n = 0; n + 1 < e.length; n++) {
        let i = e[n],
          a = e[n + 1];
        r.push([t + i[0], i[1], t + a[0], a[1]]);
      }
    },
    o = [];
  for (let t of e.normalize(`NFD`)) {
    let e = t.codePointAt(0);
    e >= 768 && e <= 879 && o.length > 0 ? o[o.length - 1].marks.push(e) : o.push({ base: t, marks: [] });
  }
  let s = 0;
  for (let { base: e, marks: t } of o) {
    if (e === ` `) {
      s += Er;
      continue;
    }
    let r = n[e];
    if (!r) {
      i.push(e);
      continue;
    }
    let o = r.w;
    for (let e of r.strokes) a(e, s);
    let c = t.includes(Fr) ? jr[e] : void 0;
    c && (a(c[0], s), (o = Math.max(o, c[1])));
    let l = s + r.w / 2,
      u = e === e.toUpperCase() && e !== e.toLowerCase() ? 8.9 : 5.9,
      d = t.includes(Pr);
    d &&
      a(
        [
          [l - 1, u],
          [l, u + 1.2],
          [l + 1, u],
        ],
        0,
      );
    for (let e of t) {
      if (e !== Mr && e !== Nr) continue;
      let t = d ? (e === Mr ? 1.5 : -1.5) : 0,
        n = u + +!!d,
        r = e === Mr ? 1 : -1;
      a(
        [
          [l + t - 0.6 * r, n],
          [l + t + 0.6 * r, n + 1.4],
        ],
        0,
      );
    }
    (t.includes(Ir) &&
      a(
        [
          [l, -1.5],
          [l, -0.9],
        ],
        0,
      ),
      (s += o + Tr));
  }
  return { segments: r, width: Math.max(0, s - Tr), missing: i };
}
function Br(...e) {
  return e.map(({ text: e, point: t }) => ({ lines: e.split(` · `), point: t }));
}
var Vr = {
    bridge: {
      id: `bridge`,
      x: -4.6,
      z: 50.6,
      yaw: 0,
      planks: Br(
        { text: Sr.ahead, point: `none` },
        { text: Sr.west, point: `left` },
        { text: Sr.east, point: `right` },
      ),
    },
    westGate: {
      id: `west-gate`,
      x: D.x0 + 3,
      z: -6,
      yaw: Math.PI / 2,
      planks: Br({ text: `← Vườn bồ đề`, point: `left` }, { text: `Sân thiền →`, point: `right` }),
    },
    eastGate: {
      id: `east-gate`,
      x: D.x1 - 3,
      z: -6,
      yaw: -Math.PI / 2,
      planks: Br({ text: `← Quan Âm`, point: `left` }, { text: `Giếng ngọc →`, point: `right` }),
    },
  },
  Hr = 0.22,
  Ur = 0.07,
  Wr = 0.045,
  Gr = 0.15,
  Kr = 0.14,
  qr = 1.05;
function Jr(e, t = !1) {
  let n = e.planks.map((e) => {
      let n = e.lines.map((e) => zr(e, t)),
        r = (e.lines.length - 1) * wr + 0.34,
        i = Math.max(...n.map((e) => e.width)) * Z,
        a = e.point === `none` ? 0 : r * 0.5;
      return { lines: n, h: r, w: i + Hr * 2 + a, tip: a, point: e.point };
    }),
    r = qr,
    i = [];
  for (let e = n.length - 1; e >= 0; e--) {
    let t = n[e];
    ((i[e] = {
      y: r + t.h / 2,
      w: t.w,
      h: t.h,
      tip: t.tip,
      textX: t.point === `left` ? t.tip / 2 : t.point === `right` ? -t.tip / 2 : 0,
      lines: t.lines,
    }),
      (r += t.h + Ur));
  }
  return { planks: i, height: r - Ur + 0.32 };
}
function Yr(e) {
  return new o().makeTranslation(e.x, 0, e.z).multiply(new o().makeRotationY(e.yaw));
}
function Xr(e, t, n, r) {
  return new o().multiplyMatrices(e, new o().makeTranslation(t, n, r));
}
function Zr(e, t, n, r) {
  let i = e / 2,
    a = t / 2,
    o =
      r === `left`
        ? [
            [-i + n, -a],
            [i, -a],
            [i, a],
            [-i + n, a],
            [-i, 0],
          ]
        : r === `right`
          ? [
              [-i, -a],
              [i - n, -a],
              [i, 0],
              [i - n, a],
              [-i, a],
            ]
          : [
              [-i, -a],
              [i, -a],
              [i, a],
              [-i, a],
            ],
    s = o.length,
    l = [],
    u = [],
    d = [],
    f = (e, t, n, r, i, a) => (l.push(e, t, n), u.push(r, i, a), l.length / 3 - 1),
    p = o.map(([e, t]) => f(e, t, Wr, 0, 0, 1)),
    m = o.map(([e, t]) => f(e, t, 0, 0, 0, -1));
  for (let e = 1; e + 1 < s; e++) (d.push(p[0], p[e], p[e + 1]), d.push(m[0], m[e + 1], m[e]));
  for (let e = 0; e < s; e++) {
    let [t, n] = o[e],
      [r, i] = o[(e + 1) % s],
      a = Math.hypot(r - t, i - n) || 1,
      c = (i - n) / a,
      l = -(r - t) / a,
      u = f(t, n, 0, c, l, 0),
      p = f(r, i, 0, c, l, 0),
      m = f(r, i, Wr, c, l, 0),
      h = f(t, n, Wr, c, l, 0);
    d.push(u, p, m, u, m, h);
  }
  let h = new _();
  return (h.setAttribute(`position`, new c(l, 3)), h.setAttribute(`normal`, new c(u, 3)), h.setIndex(d), h);
}
function Qr(e) {
  let t = [],
    n = [],
    r = Cr / 2,
    i = e.lines.length;
  e.lines.forEach((a, o) => {
    let s = ((i - 1) / 2 - o) * wr - 3.35 * Z,
      c = e.textX - (a.width * Z) / 2;
    for (let [e, i, o, l] of a.segments) {
      let a = c + e * Z,
        u = s + i * Z,
        d = c + o * Z,
        f = s + l * Z,
        p = Math.hypot(d - a, f - u);
      if (p < 1e-6) continue;
      let m = (d - a) / p,
        h = (f - u) / p,
        g = m * r,
        _ = h * r,
        v = -h * r,
        y = m * r,
        b = t.length / 3;
      (t.push(
        a - g + v,
        u - _ + y,
        0,
        a - g - v,
        u - _ - y,
        0,
        d + g - v,
        f + _ - y,
        0,
        d + g + v,
        f + _ + y,
        0,
      ),
        n.push(b, b + 1, b + 2, b, b + 2, b + 3));
    }
  });
  let a = new _();
  a.setAttribute(`position`, new c(t, 3));
  let o = new Float32Array(t.length);
  for (let e = 2; e < o.length; e += 3) o[e] = 1;
  return (a.setAttribute(`normal`, new c(o, 3)), a.setIndex(n), a);
}
function $r(e, t) {
  let n = Math.max(...t.planks.map((e) => e.w)) / 2 + 0.05,
    r = { minX: 1 / 0, maxX: -1 / 0, minZ: 1 / 0, maxZ: -1 / 0 },
    i = Math.cos(e.yaw),
    a = Math.sin(e.yaw);
  for (let t of [-n, n])
    for (let n of [-0.2, 0.095]) {
      let o = e.x + t * i + n * a,
        s = e.z - t * a + n * i;
      ((r.minX = Math.min(r.minX, o)),
        (r.maxX = Math.max(r.maxX, o)),
        (r.minZ = Math.min(r.minZ, s)),
        (r.maxZ = Math.max(r.maxZ, s)));
    }
  return r;
}
function ei(e, t) {
  let n = e.low,
    r = Jr(t, n),
    i = Yr(t),
    a = e.flat,
    o = n ? 6 : 8;
  (a.add(new m(0.2, 0.24, Kr, o), C.stoneDark, Xr(i, 0, Kr / 2, -0.15 / 2)),
    a.add(new S(Gr, r.height - Kr, Gr), kr, Xr(i, 0, (r.height + Kr) / 2, -0.15 / 2), { ao: 0 }));
  let s = new p(0, r.height, -0.15 / 2).applyMatrix4(i);
  (M(a, s.x, s.y, s.z, 0.34, o, C.gold),
    t.planks.forEach((t, n) => {
      let o = r.planks[n];
      (a.add(Zr(o.w, o.h, o.tip, t.point), Or, Xr(i, 0, o.y, 0), { ao: 0 }),
        e.glow.add(Qr(o), Dr, Xr(i, 0, o.y, 0.049)));
    }));
  let c = $r(t, r);
  e.box(c.minX, c.maxX, c.minZ, c.maxZ);
}
function ti(e) {
  return e < 0 ? Vr.westGate : Vr.eastGate;
}
var ni = {
    innerX: 2.45,
    innerW: 0.9,
    innerH: 4.6,
    outerX: 4.85,
    outerW: 0.8,
    outerH: 3.6,
    depth: 0.9,
    beam: { y0: 3.75, y1: 4.45 },
  },
  ri = 5903118,
  ii = { h: 1.15, thick: 0.5, post: 12 },
  ai = ni.outerX + ni.outerW / 2,
  oi = 3,
  si = [
    [0.001, 0],
    [0.2, 0],
    [0.33, 0.16],
    [0.37, 0.34],
    [0.31, 0.54],
    [0.15, 0.68],
    [0.001, 0.7],
  ],
  ci = 0.16,
  li = 0.7,
  ui = 0.98;
function di(e, t) {
  let n = e.flat,
    r = e.low ? 0 : 0.03,
    i = t.w / 2,
    a = t.d / 2;
  (n.cuboid(t.cx - i - 0.12, t.cx + i + 0.12, -0.1, 0.55, t.cz - a - 0.12, t.cz + a + 0.12, C.stoneDark, {
    round: r,
  }),
    n.cuboid(t.cx - i, t.cx + i, 0.55, t.h, t.cz - a, t.cz + a, C.plaster, { ao: 1.4 }),
    n.cuboid(
      t.cx - i - 0.06,
      t.cx + i + 0.06,
      t.h - 0.34,
      t.h - 0.1,
      t.cz - a - 0.06,
      t.cz + a + 0.06,
      C.lacquer,
    ),
    n.cuboid(t.cx - i - 0.14, t.cx + i + 0.14, t.h, t.h + 0.16, t.cz - a - 0.14, t.cz + a + 0.14, C.ridge));
  let o = e.low ? 6 : 8;
  if (t.lantern) {
    let r = t.h + 0.16;
    (n.cylinder(t.cx, r, t.cz, 0.26, 0.34, ci, o, C.plaster),
      e.glow.add(
        new g(
          si.map(([e, t]) => new d(e, t)),
          o + 2,
        ),
        16762474,
        { x: t.cx, y: r + ci, z: t.cz },
      ),
      n.cylinder(t.cx, r + ci + li, t.cz, 0.2, 0.36, 0.12, o, C.ridge),
      M(n, t.cx, r + ui, t.cz, 0.62, o, C.gold));
  } else t.bare || M(n, t.cx, t.h + 0.16, t.cz, 0.62, o, C.gold);
}
function $(e, t, n, r, i, a = {}) {
  let o = e.flat;
  (o.cuboid(t, n, -0.1, ii.h, r, i, C.plaster, { ao: 1.2 }),
    o.cuboid(t - 0.08, n + 0.08, ii.h, ii.h + 0.13, r - 0.08, i + 0.08, C.ridge),
    e.box(t, n, r, i));
  let s = n - t > i - r,
    c = s ? n - t : i - r,
    l = Math.max(1, Math.round(c / ii.post));
  for (let c = +!!a.start; c <= (a.end ? l - 1 : l); c++) {
    let a = c / l,
      u = s ? t + (n - t) * a : (t + n) / 2,
      d = s ? (r + i) / 2 : r + (i - r) * a;
    (o.cuboid(u - 0.32, u + 0.32, -0.1, 1.62, d - 0.32, d + 0.32, C.plaster, { ao: 1.2 }),
      o.cuboid(u - 0.42, u + 0.42, 1.62, 1.76, d - 0.42, d + 0.42, C.ridge),
      e.low
        ? o.add(new h(0.34, 0.5, 4), C.ridge, { x: u, y: 2.01, z: d, ry: Math.PI / 4 })
        : M(o, u, 1.76, d, 0.52, 6, C.ridge));
  }
}
function fi(e, t, n, r, i, a, o) {
  let s = e.flat;
  s.cuboid(t, n, r, i, a - o, a + o, C.lacquer);
  for (let e of [r + 0.05, i - 0.09]) s.cuboid(t, n, e, e + 0.04, a - o - 0.012, a + o + 0.012, C.gold);
}
var pi = 23,
  mi = { hw: 1.3, eave: 3.22, ridge: 4, over: 0.65 };
function hi(e, t, n, r, i, a) {
  let o = [
      [0, 0, 0],
      [0.1, 0.16, 0.1],
      [0.22, 0.4, 0.22],
      [0.3, 0.72, 0.3],
    ],
    s = (e) => new p(t + o[e][0] * i, n + o[e][1], r + o[e][2] * a),
    c = [0.075, 0.055, 0.035, 0.012];
  for (let t = 0; t < 3; t++) e.limb(s(t), s(t + 1), c[t], c[t + 1], 3, C.ridge);
}
function gi(e, t, n, r, i, a, o) {
  let s = new _(),
    l = o > 0 ? [t - r, i, n, t + r, i, n, t, a, n] : [t + r, i, n, t - r, i, n, t, a, n];
  (s.setAttribute(`position`, new c(l, 3)), e.add(s, C.plaster, void 0, { ao: 0 }));
}
function _i(e, t, n, r) {
  let i = e.flat,
    { hw: a, eave: o, ridge: s, over: c } = mi,
    l = n - c,
    u = r + c,
    d = (l + u) / 2,
    f = s - o,
    p = Math.hypot(a, f),
    m = Math.atan2(f, a),
    h = e.low ? 6 : 12;
  for (let e of [-1, 1]) {
    let n = t + (e * a) / 2,
      r = (o + s) / 2 + 0.03;
    i.add(
      new S(p + 0.16, 0.13, u - l),
      C.mossTileDark,
      { x: n, y: r, z: d, rz: -e * m },
      { jitter: 0.05, ao: 0 },
    );
    for (let t = 0; t < h; t++) {
      let a = l + ((t + 0.5) * (u - l)) / h;
      i.add(
        new S(p + 0.1, 0.05, 0.09),
        4865069,
        { x: n + e * Math.sin(m) * 0.075, y: r + Math.cos(m) * 0.075, z: a, rz: -e * m },
        { ao: 0 },
      );
    }
    (i.add(
      new S(0.5, 0.11, u - l),
      C.mossTileDark,
      { x: t + e * (a + 0.28), y: o + 0.07, z: d, rz: e * 0.35 },
      { jitter: 0.05, ao: 0 },
    ),
      i.cuboid(t + e * a - 0.07, t + e * a + 0.07, o - 0.2, o - 0.02, l, u, C.fascia));
  }
  (i.cuboid(t - 0.15, t + 0.15, s - 0.02, s + 0.14, l - 0.12, u + 0.12, C.ridge),
    M(i, t, s + 0.14, d, 0.55, e.low ? 5 : 8, C.gold));
  for (let e of [l + 0.45, u - 0.45]) gi(i, t, e, a - 0.18, o - 0.1, s - 0.08, e < d ? -1 : 1);
  for (let [e, n] of [
    [l, -1],
    [u, 1],
  ]) {
    hi(i, t, s + 0.1, e + n * 0.1, 0, n * 0.8);
    for (let r of [-1, 1]) hi(i, t + r * a, o, e, r, n);
  }
}
function vi(e, t) {
  let n = me / 2,
    r = -2 - n - 0.45,
    i = -2 + n + 0.45;
  for (let n of [r, i])
    (di(e, { cx: t, cz: n, w: 1, d: 0.9, h: 3, lantern: !1, bare: !0 }),
      e.box(t - 0.55, t + 0.55, n - 0.5, n + 0.5));
  let a = e.flat;
  a.cuboid(t - 0.36, t + 0.36, 2.55, 3, r, i, C.lacquer);
  for (let e of [2.6, 2.91]) a.cuboid(t - 0.378, t + 0.378, e, e + 0.04, r, i, C.gold);
  _i(e, t, r, i);
}
function yi(e, t) {
  let { x0: n, x1: r, z0: i } = pe,
    a = ii.thick / 2;
  t < 0 ? $(e, n - a, 0, i - a, i + a, { end: !0 }) : $(e, 0, r + a, i - a, i + a);
  let o = t < 0 ? n : r;
  ($(e, o - a, o + a, i + a, pi, { start: !0 }),
    t < 0 && e.box(D.x0 - 0.3, D.x1 + 0.3, i - a, D.z0 - 0.05),
    vi(e, t < 0 ? D.x0 : D.x1),
    ei(e, ti(t)));
}
function bi(e) {
  let { x0: t, x1: n, z1: r } = pe,
    i = ii.thick / 2;
  ($(e, t - i, t + i, pi, r - i, { start: !0, end: !0 }),
    $(e, n - i, n + i, pi, r - i, { start: !0, end: !0 }),
    $(e, t - i, -ai, r - i, r + i, { end: !0 }),
    $(e, ai, n + i, r - i, r + i, { start: !0 }),
    e.box(t - i, -ai, r + i, r + i + oi),
    e.box(ai, n + i, r + i, r + i + oi));
  let a = ni;
  for (let t of [-1, 1]) {
    (di(e, { cx: t * a.innerX, cz: 54, w: a.innerW, d: a.depth, h: a.innerH, lantern: !0 }),
      di(e, { cx: t * a.outerX, cz: 54, w: a.outerW, d: a.depth, h: a.outerH, lantern: !1 }));
    for (let n of [a.innerX, a.outerX]) {
      let r = n === a.innerX ? a.innerW : a.outerW;
      e.box(t * n - r / 2 - 0.1, t * n + r / 2 + 0.1, 54 - a.depth / 2 - 0.1, 54 + a.depth / 2 + 0.1);
    }
    let n = t * (a.innerX + a.innerW / 2),
      r = t * (a.outerX - a.outerW / 2);
    fi(e, Math.min(n, r), Math.max(n, r), 2.95, 3.35, 54, 0.26);
  }
  fi(e, -a.innerX, a.innerX, a.beam.y0, a.beam.y1, 54, 0.28);
}
function xi(e) {
  let t = ni,
    n = t.beam.y0 + (t.beam.y1 - t.beam.y0 - 0.44) / 2,
    r = n - 0.09,
    i = n + 0.55;
  e.flat.cuboid(-1.7, 1.7, r, i, 53.7095, 53.72, ri);
  for (let [t, n, a, o] of [
    [-1.7, 1.7, r, r + 0.035],
    [-1.7, 1.7, i - 0.035, i],
    [-1.7, -1.665, r, i],
    [1.665, 1.7, r, i],
  ])
    e.flat.cuboid(t, n, a, o, 53.7065, 53.7095, C.gold);
  let a = { ...e.ctx, metal: e.glow };
  Te(a, `CHÙA SEN`, 0, n, 53.708, -1, 0.44);
  for (let n of [-1, 1]) {
    let r = t.innerH + 0.16 + ci + li / 2;
    e.lamps.push({ x: n * t.innerX, y: r, z: 54, kind: `stone` });
  }
  ei(e, Vr.bridge);
}
var Si = 0.75,
  Ci = 1.38,
  wi = 1.9,
  Ti = 1.4,
  Ei = 385447,
  Di = 0.3,
  Oi = { low: 0.75, other: 0.5 },
  ki = 24,
  Ai = 0.25;
function ji() {
  let e = [],
    t = [...Re].sort((e, t) => e - t),
    n = [],
    r = 0;
  for (let e of t) (n.push([r, e - wi]), (r = e + wi));
  n.push([r, F]);
  for (let [t, r] of n) {
    if (r <= t) continue;
    let n = Math.max(1, Math.ceil((r - t) / Ci));
    for (let i = 0; i <= n; i++) {
      let a = P.at(t + ((r - t) * i) / n);
      e.push({ x: a.x, z: a.z, r: Si });
    }
  }
  return e;
}
function Mi(e) {
  return We - 0.026 * de(F, F + Ti, e);
}
var Ni = 0.24;
function Pi(e, t = 0) {
  let n = Math.max(2, Math.ceil(P.length / e)),
    r = [],
    i = [],
    a = [],
    o = [],
    s = { x: 0, z: 0 },
    l = { x: 0, z: 0 };
  for (let e = 0; e <= n; e++) {
    let c = (P.length * e) / n;
    (P.at(c, s), P.normal(c, l));
    let u = ze(c),
      d = Mi(c);
    for (let e of [-1, 1]) {
      let n = u + t;
      (r.push(s.x + l.x * n * e, d, s.z + l.z * n * e), i.push(0, 1, 0), a.push(c, (e * n) / u));
    }
    if (e > 0) {
      let t = (e - 1) * 2;
      o.push(t, t + 2, t + 1, t + 1, t + 2, t + 3);
    }
  }
  let u = new _();
  return (
    u.setAttribute(`position`, new c(r, 3)),
    u.setAttribute(`normal`, new c(i, 3)),
    u.setAttribute(`aFlow`, new c(a, 2)),
    u.setIndex(o),
    u
  );
}
var Fi = (e) => {
  let t = new v(e);
  return new p(t.r, t.g, t.b);
};
function Ii() {
  let e = { uFlowTime: { value: 0 }, uBankA: { value: Fi(7301726) }, uBankB: { value: Fi(10722443) } },
    t = new s({ color: C.water, roughness: 0.18, metalness: 0.05 });
  return (
    (t.name = `stream-flow`),
    (t.onBeforeCompile = (t) => {
      (Object.assign(t.uniforms, e),
        (t.vertexShader = t.vertexShader
          .replace(
            `#include <common>`,
            `#include <common>
attribute vec2 aFlow;
varying vec2 vFlow;`,
          )
          .replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
vFlow = aFlow;`,
          )),
        (t.fragmentShader = t.fragmentShader
          .replace(
            `#include <common>`,
            `#include <common>
uniform float uFlowTime;
uniform vec3 uBankA;
uniform vec3 uBankB;
varying vec2 vFlow;
float bankMix;`,
          )
          .replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
        {
          // Mặt nước: vệt sáng trôi xuôi dòng (cuộn theo độ dài cung), lệch pha theo bề ngang để không thành sọc thẳng;
          // sát mép nước cạn và tối hơn.
          float s = vFlow.x - uFlowTime;
          float lat = vFlow.y;
          float a = sin(s * 2.3 + lat * 1.7 + sin(vFlow.x * 0.6) * 1.8) * 0.5 + 0.5;
          float b = sin(s * 4.1 - lat * 2.6 + 1.9) * 0.5 + 0.5;
          float streak = smoothstep(0.8, 1.0, a) * 0.6 + smoothstep(0.86, 1.0, b) * 0.4;
          float edge = smoothstep(0.55, 1.0, abs(lat));
          vec3 water = diffuseColor.rgb * (1.0 - 0.34 * edge) + vec3(0.1, 0.13, 0.13) * streak * (1.0 - edge);
          // Bờ sỏi ướt: ô sỏi theo (độ dài cung, bề ngang), mỗi ô một sắc, khe giữa các ô là đất sẫm.
          vec2 cell = vec2(vFlow.x * 5.0, abs(lat) * 4.0);
          vec2 id = floor(cell + vec2(0.0, floor(vFlow.x * 5.0) * 0.5));
          float tone = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
          vec2 f = fract(cell + vec2(0.0, floor(vFlow.x * 5.0) * 0.5));
          float grout = smoothstep(0.0, 0.18, min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)));
          vec3 pebble = mix(uBankA, uBankB, tone) * (0.45 + 0.55 * grout);
          bankMix = smoothstep(0.97, 1.06, abs(lat));
          diffuseColor.rgb = mix(water, pebble, bankMix);
        }`,
          )
          .replace(
            `#include <roughnessmap_fragment>`,
            `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.7, bankMix);`,
          )));
    }),
    (t.customProgramCacheKey = () => `stream-flow`),
    { material: t, uniforms: e }
  );
}
function Li(e, t = 5) {
  let n = e.getAttribute(`position`),
    r = e.getAttribute(`aFlow`),
    i = Array.from({ length: t }, () => new y()),
    a = new p();
  for (let e = 0; e < n.count; e++) {
    let o = Math.min(t - 1, Math.floor((r.getX(e) / P.length) * t));
    (a.fromBufferAttribute(n, e),
      i[o].expandByPoint(a),
      (r.getX(e) / P.length) * t - o < 0.02 && o > 0 && i[o - 1].expandByPoint(a));
  }
  return i.filter((e) => !e.isEmpty());
}
var Ri = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1],
  zi = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1],
  Bi = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1],
  Vi = [0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2],
  Hi = (e) => new n(Ri, zi, e, 0),
  Ui = (e) => new n(Bi, Vi, e, 0),
  Wi = (e) => Re.some((t) => Math.abs(e - t) < Ue / 2 + 0.25);
function Gi(e, t) {
  let n = e.stone,
    r = { x: 0, z: 0 },
    i = { x: 0, z: 0 },
    a = [C.stoneDark, 8222568, 9406842, 7301726],
    o = () => a[Math.floor(t() * a.length)] ?? C.stoneDark,
    s = e.low ? ki / 2 : ki;
  for (let e = 0; e < s; e++) {
    let a = ((e + 0.5) / s) * (F - 0.6) + 0.3;
    (Wi(a) && (a += Ue), P.at(a, r), P.normal(a, i));
    let c = e % 2 == 0 ? -1 : 1,
      l = ze(a) + 0.12 + t() * 0.2,
      u = 0.12 + t() * 0.08;
    n.add(Hi(u), o(), {
      x: r.x + i.x * l * c,
      y: u * 0.12,
      z: r.z + i.z * l * c,
      sx: 1.1 + t() * 0.5,
      sy: 0.3,
      sz: 0.9 + t() * 0.4,
      ry: t() * w,
    });
  }
  let c = e.low ? [0.3, 16, F - 0.2] : [0.3, 1.1, 6, 16, 23, F - 0.2];
  for (let e of c) {
    (P.at(e, r), P.normal(e, i));
    let a = t() < 0.5 ? -1 : 1,
      o = ze(e) + 0.28,
      s = 0.24 + t() * 0.14;
    n.add(Ui(s), t() < 0.5 ? C.stoneDark : 8222568, {
      x: r.x + i.x * o * a,
      y: s * 0.2,
      z: r.z + i.z * o * a,
      sx: 1.2 + t() * 0.4,
      sy: 0.42,
      sz: 0.9 + t() * 0.3,
      ry: t() * w,
    });
  }
}
function Ki(e, t) {
  let n = { x: 0, z: 0 },
    r = { x: 0, z: 0 };
  for (let i of Re) {
    (P.at(i, n), P.tangent(i, r));
    let a = Math.atan2(-r.z, r.x),
      o = (ze(i) + 0.4) * 2,
      s = e.low ? 1 : 2;
    for (let i = 0; i < s; i++) {
      let c = ((i + 0.5) / s - 0.5) * o;
      e.stone.add(new S(Ue * (0.94 + t() * 0.06), 0.12, o / s - 0.04), i === 0 ? C.stoneLight : 11775132, {
        x: n.x - r.z * c,
        y: -0.03,
        z: n.z + r.x * c,
        ry: a,
      });
    }
  }
}
function qi(e, t) {
  let n = ye(e.ctx),
    r = { x: 0, z: 0 },
    i = { x: 0, z: 0 },
    a = e.low ? [1.2, 20.5] : [1.2, 3.5, 15.5, 20.5, 25];
  for (let e of a) {
    (P.at(e, r), P.normal(e, i));
    let a = t() < 0.5 ? -1 : 1,
      o = ze(e) + 0.05;
    for (let e = 0; e < 3; e++) {
      let e = t() * w,
        s = 0.55 + t() * 0.35;
      n.clump(
        new p(r.x + i.x * o * a + Math.cos(e) * 0.12, s * 0.5, r.z + i.z * o * a + Math.sin(e) * 0.12),
        new p(Math.cos(e), 0.25, Math.sin(e)).normalize(),
        s,
        Math.PI / 2 + (t() - 0.5) * 0.4,
        j(4153130, 0.95),
        j(9085525, 1.05),
      );
    }
  }
}
function Ji(e) {
  let n = ue(Ei);
  (Gi(e, n), Ki(e, n), qi(e, n));
  for (let t of ji()) e.circle(t.x, t.z, t.r);
  if (Ne.waterRituals) {
    let { id: t, x: n, z: r, pick: i } = Ke;
    e.ctx.interactions.push({
      id: t,
      kind: `pond`,
      x: n,
      z: r,
      radius: 1.6,
      label: `Thả đèn hoa đăng`,
      pick: i,
    });
  }
  let r = e.low ? null : Ii(),
    i = r ? Pi(Oi.other, Ni) : Pi(Oi.low),
    a = new t(i, r?.material ?? e.ctx.mats.water);
  ((a.name = `campus-stream-water`),
    (a.matrixAutoUpdate = !1),
    a.updateMatrix(),
    (a.castShadow = !1),
    (a.receiveShadow = !1),
    (a.renderOrder = -1));
  let o = !1;
  a.onBeforeRender = () => {
    o = !0;
  };
  let s = e.ctx.calm ? Ai : 1;
  return {
    mesh: a,
    boxes: Li(i),
    material: r?.material ?? null,
    update(e, t) {
      r && o && ((o = !1), (r.uniforms.uFlowTime.value = t * Di * s));
    },
  };
}
var Yi = -35.4,
  Xi = { x: -33, z: -23.5 },
  Zi = `bodhi`,
  Qi = { x: E.x, z: E.z - E.spotR };
function $i(e) {
  (V(e, { x0: -28.8, x1: D.x0 - 0.4, z0: -2.9, z1: -1.1 }, 0.005),
    V(e, { x0: -28.8, x1: -27.2, z0: -1.1, z1: E.z - 6 + 0.2 }, 0.005),
    V(e, { x0: -28.8, x1: -27.2, z0: A.z + 6.5 - 0.1, z1: -2.9 }, 0.005));
}
function ea(e) {
  let { x: t, z: n, benchR: r, seatR: i } = E;
  (e.low ? Rn(e, t, n, 1.6) : Xn(e, t, n, 1.6),
    Ne.wishTree &&
      e.ctx.interactions.push({
        id: Zi,
        kind: `bodhi`,
        x: Qi.x,
        z: Qi.z,
        radius: 1,
        label: `Cây bồ đề`,
        pick: { x: t, y: 2.6, z: n, r: 1.7 },
      }),
    e.circle(t, n, r + 0.35));
  let a = new L();
  (Qe(a, {
    cx: t,
    cz: n,
    r0: r - 0.32,
    r1: r + 0.28,
    y0: 0,
    y1: 0.44,
    palette: [C.stone, 10722443, 9406842],
    capHex: C.stoneLight,
    rand: e.rand,
    block: e.coarse(1.15),
    chord: e.coarse(0.6),
  }),
    H(e, a));
  let o = new L();
  tt(o, t, n, r - 0.3, O + 0.001, 5981744, e.low ? 14 : 24);
  let s = o.build();
  s && e.flat.addColored(s);
  let c = new L();
  (rt(c, t, n, r + 0.2, i + 1.45, O - 0.003, 9407360, 64),
    et(c, {
      cx: t,
      cz: n,
      r0: r + 0.28,
      r1: i + 1.4,
      y: O,
      radial: e.coarse(0.8),
      arc: e.coarse(0.8),
      palette: Ot,
      rand: e.rand,
      tint: (e) => (Math.abs(e - i) < 0.31 ? 0.9 : 1),
    }),
    H(e, c));
  let l = new L();
  (Qe(l, {
    cx: t,
    cz: n,
    r0: i + 1.4,
    r1: i + 1.58,
    y0: 0,
    y1: 0.05,
    palette: [C.stoneDark, C.stone],
    rand: e.rand,
    block: e.coarse(1.3),
    chord: e.coarse(0.6),
  }),
    H(e, l));
  let u = i + 2.3;
  for (let r of [-1, 1]) U(e, t + (r * u) / Math.SQRT2, n + u / Math.SQRT2);
}
function ta(e) {
  let { x: t, z: n, r, statueX: i, statueZ: a } = A,
    o = new L();
  (rt(o, t, n, 0, r + 0.05, O - 0.003, 9407360, 72),
    et(o, {
      cx: t,
      cz: n,
      r0: 0,
      r1: r,
      y: O,
      radial: e.coarse(0.85),
      arc: e.coarse(0.85),
      palette: Ot,
      rand: e.rand,
      tint: (e, t) =>
        Math.abs(e - 2.9) < 0.33 || (e > 5.7 && e < 6.05) ? 0.78 : e < 2.6 ? 0.9 + 0.1 * Math.cos(t * 8) : 1,
    }),
    H(e, o));
  let s = new L();
  (Qe(s, {
    cx: t,
    cz: n,
    r0: r,
    r1: r + 0.28,
    y0: 0,
    y1: 0.07,
    palette: [C.stoneDark, C.stone],
    rand: e.rand,
    block: e.coarse(1.3),
    chord: e.coarse(0.6),
  }),
    H(e, s),
    on(e, i, a, Math.PI));
  let c = r + 1.1;
  for (let r of [-1, 1]) U(e, t + r * c * 0.78, n - c * 0.78);
  pn(e, Xi.x, Xi.z, t, n);
}
function na(e) {
  let { ctx: t } = e,
    n = (e, t) => Math.hypot(e - A.x, t - A.z) > A.r + 1.6 && Math.hypot(e - E.x, t - E.z) > E.seatR + 2.6,
    r = 0;
  for (let e = -23; e <= 21; e += 12.8) n(Yi, e) && je(t, Yi, e, 6.3 + ((r++ * 0.41) % 1), !0);
  (be(t, -22.8, -23.4, 1, !0),
    Rt(e, -25.3, -24.9),
    e.low || (Ee(e.cheap, -24.4, 18.2, 1, 0.9, e.flat), e.circle(-24.4, 18.2, 0.45)),
    Pt(e, -24.2, 21.4, 1.1, 4));
  for (let [t, n, r, i] of [
    [-22.3, -5.4, 0.8, 13840175],
    [-22.3, 1.4, 0.8, 12720219],
    [-22.2, 21.6, 0.8, 15251770],
    [-21.8, -26, 0.8, 14162784],
  ])
    Ft(e, t, n, r, i);
  (U(e, -23.2, -3.5), e.low || U(e, -23.2, -0.5));
}
function ra(e) {
  let { statueX: t, statueZ: n } = A,
    r = n + 0.95;
  (kt(e, t - 0.72, 0.3, r),
    kt(e, t + 0.72, 0.3, r),
    At(e, t, 3, n - 0.5),
    e.lamps.push({ x: D.x0, y: 2.55, z: -2, kind: `outdoor` }));
}
function ia(e) {
  (B(e, -33, 14.5, 3, 2.2, z.dry, 0.2),
    B(e, -33.5, -4.5, 2.4, 3.2, z.dry, 0.5),
    e.low || (B(e, Xi.x, Xi.z, 1.9, 1.7, z.bare, 0.3, 2), B(e, -22.8, -23.4, 1.8, 1.6, z.bare, -0.2, 2)),
    vt(e, A.x, A.z, 9.6, -Math.PI / 2 - 0.62, -Math.PI / 2 + 0.62));
}
function aa(e, t = {}) {
  let n = e.lamps.length;
  ($i(e),
    ea(e),
    ta(e),
    na(e),
    e.low ? rr(e, E.x, E.z, 1.6) : rr(e, E.x, E.z, 1.6, { hearts: 6, gold: t.thanhDao === !0 }),
    ia(e),
    ra(e),
    pt(e, n));
}
var oa = { x0: -16, x1: 16, z0: 24.6, z1: he.z - 1.6 },
  sa = { kind: `rect`, x0: -8.5, x1: 8.5, z0: oa.z0, z1: 28.5, w: 5 },
  ca = { kind: `ring`, x: E.x, z: E.z, r0: E.seatR + 2, r1: E.seatR + 3.8, w: 1 },
  la = {
    front: {
      ...oa,
      n: 40,
      zones: [
        sa,
        { kind: `rect`, x0: -3.6, x1: 3.6, z0: 28.5, z1: oa.z1, w: 3 },
        { kind: `rect`, x0: 9, x1: 14, z0: oa.z0, z1: 31, w: 1 },
        { kind: `rect`, x0: -14, x1: -9, z0: oa.z0, z1: 31, w: 1 },
      ],
      spill: sa,
    },
    bodhi: {
      x0: pe.x0 + 0.8,
      x1: D.x0 - 0.8,
      z0: E.z - ca.r1,
      z1: E.z + ca.r1,
      n: 40,
      zones: [ca],
      spill: ca,
    },
  },
  ua = e({ CAMPUS_LEAF_AREAS: () => la, buildCampus: () => ya, loadCampusStatues: () => fa }),
  da = 8e3;
async function fa(e = da, t) {
  let n = new AbortController(),
    r = setTimeout(() => n.abort(), e),
    i = () => n.abort();
  t?.addEventListener(`abort`, i, { once: !0 });
  try {
    let { canDecodeStatues: e, fetchStatueMesh: t } = await qe(
      async () => {
        let { canDecodeStatues: e, fetchStatueMesh: t } = await import(`./idle-DOIyU4tA.js`).then((e) => e.n);
        return { canDecodeStatues: e, fetchStatueMesh: t };
      },
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
      import.meta.url,
    );
    if (!e() || n.signal.aborted) return null;
    let [r, i] = await Promise.all([`phat-nho`, `quan-am-dung`].map((e) => t(Pe(e), n.signal)));
    return r && i ? { phatNho: r, quanAmDung: i } : null;
  } catch (e) {
    return (
      n.abort(),
      t?.aborted || console.warn(`Không nạp được tượng khuôn viên, dùng tượng dựng thủ tục`, e),
      null
    );
  } finally {
    (clearTimeout(r), t?.removeEventListener(`abort`, i));
  }
}
var pa = [
  `2026-01-26`,
  `2027-01-15`,
  `2028-01-04`,
  `2029-01-22`,
  `2030-01-11`,
  `2031-01-01`,
  `2032-01-20`,
  `2033-01-08`,
  `2034-01-27`,
  `2035-01-16`,
  `2036-01-05`,
];
function ma(e = Date.now()) {
  return pa.includes(new Date(e + 252e5).toISOString().slice(0, 10));
}
function ha(e, n, r, i) {
  let a = [];
  for (let e of n)
    e.traverse((e) => {
      let t = e;
      t.isMesh && t.material === r && a.push(t);
    });
  if (a.length < 2) return;
  let o = ee(
    a.map((e) => e.geometry),
    !1,
  );
  if (!o) return;
  let s = new t(o, r);
  ((s.name = i),
    (s.castShadow = a.some((e) => e.castShadow)),
    (s.receiveShadow = a.some((e) => e.receiveShadow)),
    (s.matrixAutoUpdate = !1),
    s.updateMatrix());
  for (let e of a) (e.geometry.dispose(), e.removeFromParent());
  e.add(s);
}
var ga = 1;
function _a(e, t) {
  let n = t.map(({ object: e, boxes: t }) =>
      (t ?? [new y().setFromObject(e)]).map((e) => e.clone().expandByScalar(ga)),
    ),
    r = new te(),
    i = new o();
  e.onBeforeRender = (e, a, o) => {
    (i.multiplyMatrices(o.projectionMatrix, o.matrixWorldInverse), r.setFromProjectionMatrix(i));
    for (let e = 0; e < t.length; e++) {
      let i = n[e],
        a = !1;
      for (let e = 0; e < i.length && !a; e++) a = r.intersectsBox(i[e]);
      t[e].object.visible = a;
    }
  };
}
var va = { west: 13252865, east: 13252866, front: 13252867, glow: 13252869 };
async function ya(e) {
  let n = { colliders: [], interactions: [], animators: [], glow: new re(ue(va.glow)), lamps: [] },
    r = new l();
  r.name = `campus`;
  let i = e.quality !== `low` && (e.thanhDao ?? ma()),
    a = new it(`west`, e, n, va.west);
  (aa(a, { thanhDao: i }), await R(), yi(a, -1), await R(), r.add(a.finish(!0)), await R());
  let o = new it(`east`, e, n, va.east);
  (Fn(o), await R(), yi(o, 1), await R(), r.add(o.finish(!0)), await R());
  let s = new it(`front`, e, n, va.front);
  xr(s);
  let c = Ji(s);
  (n.animators.push(c), await R(), bi(s), xi(s), await R(), r.add(s.finish(!1)), await R());
  let u = [a.group, o.group, s.group];
  (ha(r, u, e.mats.leaf, `campus-leaves`), ha(r, u, e.mats.surfaces.material(`stone`), `campus-stone`));
  let d = n.glow.build();
  if (d) {
    let n = new t(d, e.mats.flame);
    ((n.name = `campus-glow`), (n.matrixAutoUpdate = !1), n.updateMatrix(), r.add(n));
  }
  r.add(c.mesh);
  let f = r.getObjectByName(`campus-leaves`);
  f && _a(f, [{ object: s.group }, { object: c.mesh, boxes: c.boxes }]);
  let p = !1;
  return {
    root: r,
    colliders: n.colliders,
    interactions: n.interactions,
    lamps: n.lamps,
    bounds: { minX: ge.minX, maxX: ge.maxX, minZ: ge.minZ, maxZ: ge.maxZ },
    update(e, t) {
      if (!p) for (let r of n.animators) r.update(e, t);
    },
    dispose() {
      p ||
        ((p = !0),
        r.traverse((e) => {
          let t = e;
          t.isMesh && t.geometry.dispose();
        }),
        c.material?.dispose(),
        r.removeFromParent(),
        r.clear(),
        (n.animators.length = 0));
    },
  };
}
export { ua as t };
