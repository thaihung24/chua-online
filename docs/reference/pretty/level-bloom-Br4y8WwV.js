import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { A as t, B as n, F as r, I as i, T as a, et as o, m as s } from "./three-BbSp8N3g.js";
import { _ as c } from "./progress-core-C9e35Hb5.js";
var l = e({
    BLOOM_MAX_ACTIVE: () => 4,
    BLOOM_MIN_GAP_MS: () => d,
    BLOOM_SECONDS: () => u,
    activeLevelBlooms: () => U,
    cancelLevelBloom: () => H,
    disposeLevelBloom: () => W,
    playLevelBloom: () => V,
    prefersReducedMotion: () => w,
    shouldBloom: () => C,
  }),
  u = 1.5,
  d = 6e4,
  f = 1.5,
  p = 0.3,
  m = 0.45,
  h = 0.1,
  g = 0.95,
  _ = 0.15,
  v = 0.45,
  y = 0.9,
  b = `#ffe9a8`,
  x = [
    { count: 8, yawOffset: 0, width: 0.17, length: 0.34, thickness: 0.05, y: 0, closed: 0.1, open: 1.2 },
    {
      count: 5,
      yawOffset: Math.PI / 5,
      width: 0.14,
      length: 0.27,
      thickness: 0.045,
      y: 0.02,
      closed: 0.05,
      open: 0.75,
    },
  ],
  S = x.reduce((e, t) => e + t.count, 0);
function C(e) {
  return e.reducedMotion || !e.drawn || e.prev === void 0 || e.next === void 0 || !(e.next > e.prev)
    ? !1
    : e.now - e.lastAt >= d;
}
function w() {
  return (
    typeof window < `u` &&
    typeof window.matchMedia == `function` &&
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  );
}
var T = [],
  E = null,
  D = null,
  O = new n(),
  k = new n();
O.add(k);
var A = new s(),
  j = (e) => (e < 0 ? 0 : e > 1 ? 1 : e),
  M = (e) => 1 - (1 - e) ** 3,
  N = (e) => 1 - (1 - e) * (1 - e),
  P = (e) => 0.5 - 0.5 * Math.cos(Math.PI * e);
function F() {
  return performance.now();
}
function I() {
  (E === null && ((E = new o(0.5, 8, 5)), E.translate(0, 0.5, 0)), (D ??= new o(0.5, 8, 6)));
  let e = () =>
      new i({
        transparent: !0,
        opacity: 0,
        depthWrite: !1,
        side: 2,
        forceSinglePass: !0,
        toneMapped: !1,
        fog: !1,
      }),
    n = e(),
    s = e(),
    c = new t(E, n, S);
  c.name = `level-bloom-petals`;
  let l = new r(D, s);
  ((l.name = `level-bloom-core`), (l.position.y = 0.1));
  let u = new a();
  ((u.name = `level-bloom`),
    (u.visible = !1),
    u.add(c, l),
    (c.frustumCulled = !1),
    (l.frustumCulled = !1),
    (c.renderOrder = 12),
    (l.renderOrder = 13));
  let d = {
    group: u,
    petals: c,
    petalMat: n,
    core: l,
    coreMat: s,
    active: !1,
    start: 0,
    target: null,
    size: 1,
  };
  return (
    (c.onBeforeRender = () => {
      if (!d.active) return;
      let e = (F() - d.start) / 1e3;
      e >= 1.5 ? R(d) : L(d, e);
    }),
    d
  );
}
function L(e, t) {
  let n = t / u,
    r = M(j(t / m)),
    i = P(j((t - h) / g)),
    a = j(t / _) * j((u - t) / v);
  ((e.group.position.y = f + p * N(n)),
    (e.group.rotation.y = t * y),
    e.group.scale.setScalar(Math.max(0.001, (0.35 + 0.65 * r) * e.size)),
    (e.petalMat.opacity = a * 0.94),
    (e.coreMat.opacity = a),
    e.core.scale.setScalar(0.07 + 0.05 * i));
  let o = 0;
  for (let t = 0; t < x.length; t++) {
    let n = x[t],
      r = n.closed + (n.open - n.closed) * i;
    ((O.position.y = n.y), (k.rotation.x = r), k.scale.set(n.width, n.length, n.thickness));
    for (let t = 0; t < n.count; t++)
      ((O.rotation.y = n.yawOffset + (t / n.count) * Math.PI * 2),
        O.updateMatrixWorld(!0),
        e.petals.setMatrixAt(o++, k.matrixWorld));
  }
  e.petals.instanceMatrix.needsUpdate = !0;
}
function R(e) {
  ((e.active = !1),
    (e.target = null),
    (e.group.visible = !1),
    (e.petalMat.opacity = 0),
    (e.coreMat.opacity = 0),
    e.group.removeFromParent());
}
function z() {
  let e = F();
  for (let t = 0; t < T.length; t++) {
    let n = T[t];
    n.active && (e - n.start) / 1e3 > 2 && R(n);
  }
}
function B() {
  z();
  for (let e = 0; e < T.length; e++) {
    let t = T[e];
    if (!t.active) return t;
  }
  if (T.length >= 4) return null;
  let e = I();
  return (T.push(e), e);
}
function V(e, t, n = {}) {
  if (n.reducedMotion ?? w()) return !1;
  H(e);
  let r = B();
  if (r === null) return !1;
  let i = c(t ?? 1),
    a = 0;
  for (let e = 0; e < x.length; e++) {
    A.set(e === 0 ? i.accent : i.color);
    for (let t = 0; t < x[e].count; t++) r.petals.setColorAt(a++, A);
  }
  (r.petals.instanceColor && (r.petals.instanceColor.needsUpdate = !0), r.coreMat.color.set(b));
  let o = n.size;
  return (
    (r.size = typeof o == `number` && Number.isFinite(o) && o > 0 ? o : 1),
    (r.target = e),
    (r.start = F()),
    (r.active = !0),
    (r.group.visible = !0),
    e.add(r.group),
    L(r, 0),
    !0
  );
}
function H(e) {
  for (let t = 0; t < T.length; t++) {
    let n = T[t];
    n.active && n.target === e && R(n);
  }
}
function U() {
  let e = 0;
  for (let t = 0; t < T.length; t++) T[t].active && e++;
  return e;
}
function W() {
  for (let e of T) (R(e), e.petals.dispose(), e.petalMat.dispose(), e.coreMat.dispose());
  ((T.length = 0), E?.dispose(), D?.dispose(), (E = null), (D = null));
}
export { C as i, l as n, V as r, H as t };
