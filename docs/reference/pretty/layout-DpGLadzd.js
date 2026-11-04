var e = 0.08,
  t = { minX: -19.3, maxX: 19.3, minZ: -24.3, maxZ: 24.8 },
  n = { minX: -36, maxX: 36, minZ: -27, maxZ: 56 },
  r = { x: 0, z: 16, facing: 0 },
  i = { x0: -20, x1: 20, z0: -25, z1: 23 },
  a = { x0: -10.6, x1: 10.6, z0: -23.4, z1: -8.2 },
  o = { x0: -12, x1: 12, z0: -24.6, z1: 22.8, cell: 0.6 },
  s = { half: 1.8, z0: -8.2, z1: 60, cell: 0.9 },
  c = { x: 9.6, zFront: -9.6, zBack: -22.4, pillarTop: 6.6, beamTop: 7.15 },
  l = c.pillarTop + 0.15,
  u = 3.5,
  d = l + u - 0.15,
  f = d + 2.8,
  p = {
    roof1Base: l,
    roof1Height: u,
    ceiling: l + u - 0.3,
    upperBottom: d,
    upperTop: f,
    roof2Base: f - 0.35,
    roof2Height: 3.2,
  };
p.roof2Base + p.roof2Height;
var m = {
  plinthRadius: 0.62,
  plinthTopRadius: 0.56,
  plinthHeight: 0.3,
  shaftBottom: 0.4,
  shaftTop: 0.35,
  capBottom: 0.38,
  capTop: 0.52,
  capHeight: 0.4,
  collider: 0.46,
};
function h() {
  let e = [];
  for (let t of [-9.6, -6.4, -3.2, 3.2, 6.4, 9.6]) e.push([t, c.zFront]);
  for (let t of [-12.8, -16, -19.2, -22.4]) (e.push([-c.x, t]), e.push([c.x, t]));
  for (let t of [-6.4, -3.2, 0, 3.2, 6.4]) e.push([t, c.zBack]);
  for (let t of [-12.8, -16, -19.2]) (e.push([-6.4, t]), e.push([6.4, t]));
  return e;
}
var g = { x: 0, z: -20.3 },
  _ = { lower: 0.78, upper: 1.03 },
  v = { x: -2.25, z: -20.4 },
  y = { x: 2.25, z: -20.4 },
  b = { x: 0, z: -2.5 },
  x = {
    altar: { x: 0, y: 1.27, z: -17.85, r: 0.17, len: 0.42 },
    yard: { x: b.x, y: 1.83, z: b.z, r: 0.32, len: 0.95 },
  },
  S = { x: 15.5, z: 4 },
  C = { x: -15.6, z: 7, r: 3.7 },
  w = { x: -10.3, z: 7 },
  T = { x: 14.4, z: 7.2, spot: { x: 14.4, z: 8.55 } },
  E = `broom`,
  D = { x0: -36.7, x1: 36.7, z0: -27.7, z1: 54 },
  O = 3.2,
  k = { x: 0, z: 38, r: 9 },
  A = { x: 0, z0: 37.2, z1: 47.4, halfW: 1.8, deckY: e },
  j = { x: -28, z: 8, benchR: 3.4, seatR: 4.6, spotR: 4.25 },
  M = { x: -28, z: -12, r: 6.5, statueX: -28, statueZ: -18.5 },
  N = { x: 29, z: -10, height: 5.5, basinR: 2.1 },
  P = `quanam`,
  F = { x: 28, z: 12, r: 0.95 },
  I = 0.003,
  L = { radius: 0.4, height: 0.14, matThickness: 0.008, matW: 1.06, matD: 1.2, matShift: 0.1, seams: 8 };
function R() {
  return e + L.matThickness + L.height;
}
function z() {
  let e = L.radius,
    t = L.height,
    n = (n, r, i) => ({ r: n * e, y: r * t, zone: i });
  return [
    n(0.84, 0, 0),
    n(0.95, 0.07, 0),
    n(1, 0.2, 0),
    n(1.02, 0.4, 0),
    n(0.99, 0.58, 0),
    n(0.9, 0.72, 1),
    n(0.78, 0.82, 2),
    n(0.56, 0.89, 2),
    n(0.2, 0.92, 2),
    n(0.14, 0.94, 2),
    n(0.08, 0.98, 2),
    n(0, 1, 2),
  ];
}
function B(e, t, n = {}) {
  let r = n.width ?? 0.24,
    i = n.minLen ?? 1.2,
    a = n.maxLen ?? 3,
    o = [],
    s = Math.max(1, Math.round((e.x1 - e.x0) / r));
  for (let n = 0; n < s; n++) {
    let r = e.x0 + ((e.x1 - e.x0) * n) / s,
      c = e.x0 + ((e.x1 - e.x0) * (n + 1)) / s,
      l = e.z0,
      u = 0.5 + t() * Math.max(0, a - 0.5);
    for (; l < e.z1 - 1e-9;) {
      let n = l + u;
      (n > e.z1 - i * 0.5 && (n = e.z1),
        o.push({ x0: r, x1: c, z0: l, z1: n, tone: t() }),
        (l = n),
        (u = i + t() * (a - i)));
    }
  }
  return o;
}
export {
  P as A,
  s as C,
  C as D,
  a as E,
  R as F,
  h as I,
  B as L,
  r as M,
  F as N,
  w as O,
  z as P,
  D as S,
  m as T,
  e as _,
  j as a,
  t as b,
  E as c,
  b as d,
  i as f,
  c as g,
  I as h,
  S as i,
  O as j,
  N as k,
  T as l,
  k as m,
  v as n,
  n as o,
  L as p,
  _ as r,
  A as s,
  y as t,
  g as u,
  p as v,
  o as w,
  M as x,
  x as y,
};
