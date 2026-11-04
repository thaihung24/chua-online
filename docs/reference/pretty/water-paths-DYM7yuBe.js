import { D as e, m as t, s as n } from "./layout-DpGLadzd.js";
import { v as r, y as i } from "./lanterns-DsoFXr0b.js";
function a(e, t, n, r, i) {
  let a = i * i,
    o = a * i;
  return 0.5 * (2 * t + (n - e) * i + (2 * e - 5 * t + 4 * n - r) * a + (3 * t - e - 3 * n + r) * o);
}
var o = 32;
function s(e, t = {}) {
  let n = t.closed ?? !1,
    r = t.step ?? 0.25,
    i = e.length;
  if (i < 2) throw Error(`samplePath: cần ít nhất hai điểm`);
  let s = (t) => {
      if (n) return e[((t % i) + i) % i];
      if (t < 0) {
        let [t, n] = e[0],
          [r, i] = e[1];
        return [2 * t - r, 2 * n - i];
      }
      if (t >= i) {
        let [t, n] = e[i - 1],
          [r, a] = e[i - 2];
        return [2 * t - r, 2 * n - a];
      }
      return e[t];
    },
    c = n ? i : i - 1,
    l = [],
    u = [],
    d = [],
    f = 0;
  for (let e = 0; e < c; e++) {
    let [t, n] = s(e - 1),
      [r, i] = s(e),
      [c, p] = s(e + 1),
      [m, h] = s(e + 2);
    for (let s = e === 0 ? 0 : 1; s <= o; s++) {
      let e = s / o,
        g = a(t, r, c, m, e),
        _ = a(n, i, p, h, e);
      (l.length > 0 && (f += Math.hypot(g - l[l.length - 1], _ - u[u.length - 1])),
        l.push(g),
        u.push(_),
        d.push(f));
    }
  }
  let p = Math.max(2, Math.ceil(f / r) + 1),
    m = new Float64Array(p),
    h = new Float64Array(p),
    g = 0;
  for (let e = 0; e < p; e++) {
    let t = Math.min(f, e * r);
    for (; g < d.length - 2 && d[g + 1] < t;) g++;
    let n = d[g],
      i = d[g + 1],
      a = i > n ? (t - n) / (i - n) : 0;
    ((m[e] = l[g] + (l[g + 1] - l[g]) * a), (h[e] = u[g] + (u[g + 1] - u[g]) * a));
  }
  let _ = p - 1,
    v = 0,
    y = (e) => {
      let t = e;
      t = n ? ((t % f) + f) % f : Math.min(f, Math.max(0, t));
      let i = t / r,
        a = Math.min(_ - 1, Math.floor(i)),
        o = a === _ - 1 ? f - a * r : r;
      return ((v = o > 0 ? Math.min(1, (t - a * r) / o) : 0), a);
    },
    b = {
      length: f,
      closed: n,
      xs: m,
      zs: h,
      step: r,
      at(e, t = { x: 0, z: 0 }) {
        let n = y(e),
          r = v;
        return ((t.x = m[n] + (m[n + 1] - m[n]) * r), (t.z = h[n] + (h[n + 1] - h[n]) * r), t);
      },
      tangent(e, t = { x: 0, z: 0 }) {
        let n = y(e),
          r = m[n + 1] - m[n],
          i = h[n + 1] - h[n],
          a = Math.hypot(r, i) || 1;
        return ((t.x = r / a), (t.z = i / a), t);
      },
      normal(e, t = { x: 0, z: 0 }) {
        b.tangent(e, t);
        let n = t.x;
        return ((t.x = -t.z), (t.z = n), t);
      },
    };
  return b;
}
var c = t.r - 0.5,
  l = 0.015,
  u = 2.3,
  d = 0.6,
  f = 0.21,
  p = { x: e.x + 1.2, z: e.z - 0.9, r: 0.95 };
function m(e, r, i = d) {
  return r < t.z + i || Math.abs(e - n.x) < 2.3 ? !1 : Math.hypot(e - t.x, r - t.z) <= c - i;
}
function h(t, n, r = 0.5) {
  return Math.hypot(t - e.x, n - e.z) > e.r - r ? !1 : Math.hypot(t - p.x, n - p.z) >= p.r + r;
}
var g = `pond-front`,
  _ = `pond-stream`,
  v = { id: g, x: 5.6, z: 36.7, pick: { x: 4.9, y: 0.2, z: 39.6, r: 1.3 } },
  y = `release`,
  b = { id: y, x: -v.x, z: v.z, pick: { ...v.pick, x: -v.pick.x } },
  x = 0.29,
  S = t.z + 0.12,
  C = t.z + 1.1,
  w = {
    shape: (e, t) => e < n.x && m(e, t, 0.6),
    x0: t.x - c,
    x1: n.x - u,
    z0: t.z,
    z1: t.z + c,
    r: [0.8, 1.8],
  },
  T = { x: t.x - 4.4, z: t.z + 3.6, r: 3.4 },
  E = (2.5 * Math.PI) / 22,
  D = 0.16,
  O = 0.01,
  k = (e) => [t.x + Math.cos(E) * e, t.z + Math.sin(E) * e],
  A = [[31, 17], [28.5, 21], [24, 25.5], [19, 30], [14.5, 34], [11.85, 38.75], k(t.r), k(c - 0.9)],
  j = { id: _, x: 28.85, z: 17.55, pick: { x: 30.1, y: 0.2, z: 18.5, r: 1 } },
  M = s(A),
  N = L(M, k(t.r));
function P(e) {
  let t = Math.min(1, Math.max(0, e / M.length)),
    n = 0.5 + 0.2 * i(0, 0.25, t),
    r = Math.min(0.7, Math.max(0.5, n - 0.06 * Math.sin(e * 0.41 + 0.7) * i(0.1, 0.3, t)));
  return r + (0.58 - r) * i(N - 2.5, N - 0.5, e);
}
var F = [11, L(M, [12.15, 37.95])],
  I = 1.6;
function L(e, t) {
  let n = 0,
    r = 1 / 0;
  for (let i = 0; i < e.xs.length; i++) {
    let a = Math.hypot(e.xs[i] - t[0], e.zs[i] - t[1]);
    a < r && ((r = a), (n = Math.min(e.length, i * e.step)));
  }
  return n;
}
var R = 0.8,
  z = 0.7,
  B = 0.04;
function V(e, t, n) {
  let r = e.lanes.length,
    i = { x: 0, z: 0 },
    a = { x: 0, z: 0 },
    o = { x: 0, z: 0 },
    s = { x: 0, z: 0 },
    c = (n, r, c, l) => {
      (t.at(n, i), t.normal(n, o), t.at(c, a), t.normal(c, s));
      let u = Math.max(0, Math.min(1, e.laneScale(n))),
        d = Math.max(0, Math.min(1, e.laneScale(c))),
        f = 1 / 0;
      for (let t of [-1, 1])
        for (let n of [-1, 1]) {
          let c = (e.lanes[r] + e.wander * t) * u,
            p = (e.lanes[l] + e.wander * n) * d;
          f = Math.min(f, Math.hypot(i.x + o.x * c - a.x - s.x * p, i.z + o.z * c - a.z - s.z * p));
        }
      return f;
    },
    l = [];
  for (let e = 0; e < r; e++) {
    let i = (e === 0 ? R : z) + B,
      a = 0;
    for (let o = 0; o < r; o++)
      for (let s = 0; s < r; s++)
        if (Math.abs(o - s) === e)
          for (let e = 0; e <= t.length; e += t.step) {
            let t = 0;
            for (; e - t > 0 && c(e, o, e - t, s) < i;) t += B;
            t > 0 && (a = Math.max(a, n(e) - n(Math.max(0, e - t))));
          }
    l.push(a);
  }
  return l;
}
function H(e) {
  let t = s(e.points),
    n = t.xs.length,
    r = new Float64Array(n);
  for (let i = 1; i < n; i++) {
    let n = (i - 1) * t.step,
      a = Math.min(t.length, i * t.step),
      o = Math.max(0.001, e.speed((n + a) / 2));
    r[i] = r[i - 1] + (a - n) / o;
  }
  let i = (e) => {
      let i = Math.min(n - 1, Math.max(0, e / t.step)),
        a = Math.min(n - 2, Math.floor(i));
      return r[a] + (r[a + 1] - r[a]) * (i - a);
    },
    a = r[n - 1],
    o = V(e, t, i),
    c = { x: 0, z: 0 },
    l = {
      spec: e,
      path: t,
      releaseTime: i(e.release),
      endTime: a,
      gapTime: o,
      sAt(e) {
        if (e <= 0) return 0;
        if (e >= a) return t.length;
        let i = 0,
          o = n - 1;
        for (; o - i > 1;) {
          let t = (i + o) >> 1;
          r[t] <= e ? (i = t) : (o = t);
        }
        let s = r[i],
          c = r[o],
          l = c > s ? (e - s) / (c - s) : 0;
        return Math.min(t.length, (i + l) * t.step);
      },
      place(n, r, i, a = { x: 0, z: 0 }) {
        let o = l.sAt(n);
        (t.at(o, a), t.normal(o, c));
        let s = Math.max(0, Math.min(1, e.laneScale(o))),
          u = ((e.lanes[r] ?? 0) + e.wander * Math.max(-1, Math.min(1, i))) * s;
        return ((a.x += c.x * u), (a.z += c.z * u), a);
      },
    };
  return l;
}
var U = 0.38,
  W = [-0.38, 0, U],
  G = 152,
  K = [
    [3, 39.2],
    [4.35, 39.3],
    [5.2, 39.8],
    [5.55, 40.6],
    [5.3, 41.5],
    [4.7, 42.35],
    [3.85, 43.2],
    [3, 44],
  ],
  q = 1.6,
  J = (s(K).length - q) / G,
  Y = { points: K, release: q, speed: () => J, lanes: W, laneScale: () => 1, wander: 0.03 },
  X = 0.3,
  Z = 7.6,
  Q = (e) => [t.x + Math.cos(e) * Z, t.z + Math.sin(e) * Z],
  $ = 0.38,
  ee = {
    points: [
      ...A.slice(0, 7),
      [t.x + Math.cos(0.39) * 7.86, t.z + Math.sin(0.39) * 7.86],
      Q(0.52),
      Q(0.66),
      Q(0.8),
      Q(0.92),
    ],
    release: 2,
    speed: (e) => X + -0.22499999999999998 * i(N - 1, N + 1, e),
    lanes: W,
    laneScale: (e) => (Math.max(0, P(Math.min(e, N)) - $) / U) * (1 - i(N, N + 1.5, e)),
    wander: 0.04,
    surfaceY: (e) => O + 0.004999999999999999 * i(N - 0.5, N + 0.5, e),
  },
  te = {
    shape: (e, t) => h(e, t, 0.55) && Math.hypot(e - p.x, t - p.z) >= p.r + 0.4,
    x0: e.x - e.r,
    x1: e.x + e.r,
    z0: e.z - e.r,
    z1: e.z + e.r,
    r: [0.6, 1.2],
  },
  ne = { shape: (e, t) => m(e, t, d), x0: t.x - c, x1: t.x + c, z0: t.z, z1: t.z + c, r: [1, 2.4] };
function re(e, t, n) {
  let i = r((t ^ Math.imul(n + 1, 2654435761)) >>> 0);
  for (let t = 0; t < 200; t++) {
    let t = e.x0 + (e.x1 - e.x0) * i(),
      n = e.z0 + (e.z1 - e.z0) * i(),
      r = e.r[0] + (e.r[1] - e.r[0]) * i(),
      a = 5 + Math.floor(i() * 3),
      o = i() * Math.PI * 2,
      c = i() < 0.5 ? -1 : 1,
      l = 0.15 + 0.2 * i(),
      u = [];
    for (let e = 0; e < a; e++) {
      let s = o + c * ((e + (i() - 0.5) * 0.5) / a) * Math.PI * 2,
        l = r * (0.65 + 0.35 * i());
      u.push([t + Math.cos(s) * l, n + Math.sin(s) * l * 0.8]);
    }
    if (!u.every(([t, n]) => e.shape(t, n))) continue;
    let d = s(u, { closed: !0, step: 0.2 }),
      f = !0;
    for (let t = 0; t < d.xs.length && f; t++) f = e.shape(d.xs[t], d.zs[t]);
    if (f) return { path: d, speed: l, offset: i() * d.length };
  }
  let a = (e.x0 + e.x1) / 2,
    o = (e.z0 + e.z1) / 2;
  return {
    path: s(
      [0, 1, 2, 3, 4].map((t) => [
        a + Math.cos((t / 5) * Math.PI * 2) * e.r[0],
        o + Math.sin((t / 5) * Math.PI * 2) * e.r[0],
      ]),
      { closed: !0, step: 0.2 },
    ),
    speed: 0.15,
    offset: 0,
  };
}
export {
  re as A,
  M as C,
  m as D,
  H as E,
  s as O,
  N as S,
  T,
  ee as _,
  g as a,
  E as b,
  c,
  S as d,
  C as f,
  F as g,
  w as h,
  Y as i,
  P as k,
  l,
  y as m,
  f as n,
  v as o,
  b as p,
  I as r,
  ne as s,
  te as t,
  x as u,
  _ as v,
  O as w,
  D as x,
  j as y,
};
