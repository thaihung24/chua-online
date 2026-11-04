import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import {
  F as t,
  L as n,
  R as r,
  S as i,
  T as a,
  Y as o,
  ct as s,
  f as c,
  ft as l,
  it as u,
  l as d,
  lt as f,
  m as p,
  rt as m,
  t as h,
  u as g,
} from "./three-BbSp8N3g.js";
import { i as ee, n as _, r as v, t as te } from "./lazy-shared-D8DtrU9N.js";
import { m as y, v as b } from "./lanterns-DsoFXr0b.js";
import { n as x, r as S, t as C, u as w } from "./layout-DpGLadzd.js";
import {
  a as ne,
  d as re,
  f as ie,
  h as T,
  m as ae,
  o as oe,
  p as se,
  s as ce,
  u as E,
} from "./app-z_oU8L_u.js";
var le = e({ warmAssetCache: () => me }),
  ue = /\/(?:textures|env|models)\/v\d+\/.+\.(?:webp|png|jpe?g|glb|hdr|rgbe|csm\.gz)$/i,
  de = 6e3;
function fe(e, t, n = ue, r = 48) {
  let i = [],
    a = new Set();
  for (let { name: o } of e) {
    let e;
    try {
      e = new URL(o);
    } catch {
      continue;
    }
    if (e.origin !== t || !n.test(e.pathname)) continue;
    let s = e.origin + e.pathname + e.search;
    if (!a.has(s) && (a.add(s), i.push(s), i.length >= r)) break;
  }
  return i;
}
async function pe(e, t) {
  return (
    await Promise.race([e.ready, new Promise((e) => setTimeout(e, t))]).catch(() => void 0),
    e.controller
      ? !0
      : new Promise((n) => {
          let r = (t) => {
              (clearTimeout(a), e.removeEventListener(`controllerchange`, i), n(t));
            },
            i = () => r(!0),
            a = setTimeout(() => r(!1), t);
          e.addEventListener(`controllerchange`, i, { once: !0 });
        })
  );
}
async function me(e = {}) {
  try {
    let t =
      e.serviceWorker === void 0
        ? typeof navigator < `u` && `serviceWorker` in navigator
          ? navigator.serviceWorker
          : null
        : e.serviceWorker;
    if (!t || !(await pe(t, e.waitMs ?? de))) return 0;
    let n = e.perf ?? performance,
      r = e.origin ?? location.origin,
      i = fe(n.getEntriesByType(`resource`), r, e.pattern, e.limit),
      a = e.fetchImpl ?? ((e, t) => fetch(e, t)),
      o = e.cacheStorage === void 0 ? (typeof caches > `u` ? null : caches) : e.cacheStorage,
      s = 0;
    for (let e of i)
      try {
        if (o && (await o.match(e))) continue;
        let t = await a(e);
        t.ok && (await t.arrayBuffer(), (s += 1));
      } catch {}
    return s;
  } catch {
    return 0;
  }
}
var he = e({ createSelfEmote: () => Se }),
  D = 3,
  ge = 496,
  _e = 0.22,
  ve = 0.5,
  ye = 1.5,
  be = 0.12,
  O = `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif`;
function xe(e) {
  let t = `600 38px ${O}`,
    n = document.createElement(`canvas`),
    r = n.getContext(`2d`),
    i = 256;
  if (r) {
    r.font = t;
    let n = r.measureText(e).width;
    (n > ge &&
      ((t = `600 ${Math.max(30, Math.floor((38 * ge) / n))}px ${O}`),
      (r.font = t),
      (n = r.measureText(e).width)),
      (i = Math.min(560, Math.max(160, Math.ceil(n) + 64))));
  }
  if (((n.width = i), (n.height = 96), (r = n.getContext(`2d`)), r)) {
    let n = i - 6;
    (r.beginPath(),
      r.moveTo(31, 3),
      r.arcTo(3 + n, 3, 3 + n, 77, 28),
      r.arcTo(3 + n, 77, 3, 77, 28),
      r.lineTo(i / 2 + 12, 77),
      r.lineTo(i / 2, 94),
      r.lineTo(i / 2 - 12, 77),
      r.arcTo(3, 77, 3, 3, 28),
      r.arcTo(3, 3, 3 + n, 3, 28),
      r.closePath(),
      (r.fillStyle = `rgba(27, 18, 11, 0.92)`),
      r.fill(),
      (r.lineWidth = 3),
      (r.strokeStyle = `#e0b25c`),
      r.stroke(),
      (r.font = t),
      (r.fillStyle = `#f5ead9`),
      (r.textAlign = `center`),
      (r.textBaseline = `middle`),
      r.fillText(e, i / 2, 42));
  }
  let a = new g(n);
  return ((a.colorSpace = o), { texture: a, aspect: i / 96 });
}
function Se(e) {
  let t =
      typeof window.matchMedia == `function` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,
    n = new Map(),
    r = new u({ transparent: !0, depthWrite: !1, fog: !1 }),
    i = new m(r);
  ((i.visible = !1), (i.renderOrder = 20), e.add(i));
  let a = D,
    o = 0,
    s = 1,
    c = null,
    l = 1,
    d = 0;
  i.onBeforeRender = (e, t, n) => _(i, r, n, l, s, d);
  function f() {
    let e = t ? 1 : Math.min(1, a / _e);
    l = 0.6 + 0.4 * e;
    let n = te * l;
    (i.scale.set(n * s, n, 1),
      (i.position.y = ye + (t ? 0 : be * Math.min(1, a / D))),
      (d = Math.max(0, Math.min(1, o / ve, 0.35 + e))),
      (r.opacity = d));
  }
  return {
    show(e, t = D) {
      if (i.visible && e === c) {
        ((o = t), f());
        return;
      }
      let l = n.get(e);
      if (l) n.delete(e);
      else {
        l = xe(e);
        for (let [e, t] of n) {
          if (n.size < 4) break;
          t.texture !== r.map && (t.texture.dispose(), n.delete(e));
        }
      }
      (n.set(e, l),
        r.map !== l.texture && ((r.map = l.texture), (r.needsUpdate = !0)),
        (s = l.aspect),
        (a = 0),
        (o = t),
        (c = e),
        (i.visible = !0),
        f());
    },
    update(e) {
      i.visible && ((a += e), (o -= e), o <= 0 ? ((i.visible = !1), (c = null)) : f());
    },
    dispose() {
      (e.remove(i), r.dispose());
      for (let e of n.values()) e.texture.dispose();
      n.clear();
    },
  };
}
var Ce = e({
  LEAF: () => G,
  MATERIAL_MAP: () => K,
  coupletLayout: () => M,
  crackLines: () => ke,
  dragonSpine: () => Ee,
  dragonWidth: () => De,
  fillMaterialRows: () => je,
  frettePoints: () => A,
  isGoldPixel: () => Ae,
  leafCells: () => Oe,
  materialMapSteps: () => Le,
  paintSurface: () => ze,
  panelSteps: () => Pe,
  petalOutline: () => k,
  runSteps: () => J,
  signSteps: () => Fe,
  waveArcs: () => Ne,
});
function k(e, t, n = 14) {
  let r = [];
  for (let i = 0; i <= n; i++) {
    let a = i / n,
      o = t * Math.sin(Math.PI * a ** 0.72) ** 0.9;
    r.push([a * e, Number.isFinite(o) ? o : 0]);
  }
  let i = r
    .slice(1, -1)
    .reverse()
    .map(([e, t]) => [e, -t]);
  return [...r, ...i];
}
function A() {
  return [
    [0, 0],
    [0, 1],
    [0.8, 1],
    [0.8, 0.22],
    [0.22, 0.22],
    [0.22, 0.66],
    [0.55, 0.66],
  ];
}
var j = 0.72;
function M(e, t, n) {
  let r = Math.max(1, e.length),
    i = Math.max(1, ...e.map((e) => Array.from(e).length)),
    a = (n * 0.86) / (r * 1.05),
    o = (t * 0.8) / (i * 0.72 * j),
    s = Math.min(a, o),
    c = (n * 0.86) / r,
    l = n * 0.07;
  return { size: s, ys: e.map((e, t) => l + c * (t + 0.5)), pitch: c, condense: j };
}
var N = { hi: `#fff3bf`, light: `#f7d77c`, mid: `#e6b24a`, deep: `#bb8328`, shade: `#6a4210` },
  P = `"Times New Roman", "Noto Serif", "Droid Serif", Georgia, serif`;
function F(e, t, n) {
  let r = t / (2 * T.halfW);
  e.setTransform(r, 0, 0, -r, t / 2, n + T.y0 * r);
}
function I(e, t) {
  let n = t / E;
  e.setTransform(n, 0, 0, n, 0, 0);
}
function L(e, t, n = N.light) {
  ((e.lineJoin = `round`),
    (e.lineCap = `round`),
    (e.lineWidth = t * 2.2),
    (e.strokeStyle = `rgba(26,4,3,0.5)`),
    e.stroke(),
    (e.lineWidth = t),
    (e.strokeStyle = n),
    e.stroke());
}
function R(e, t, n) {
  (e.beginPath(), t.forEach(([t, n], r) => (r === 0 ? e.moveTo(t, n) : e.lineTo(t, n))), n && e.closePath());
}
function we(e, t, n, r, i, a, o, s) {
  (e.save(), e.translate(t, n), e.rotate(r), e.translate(i, 0), R(e, k(a, o, s.steps), !0));
  let c = e.createLinearGradient(0, 0, a, 0);
  (c.addColorStop(0, s.fill[0]),
    c.addColorStop(0.55, s.fill[1]),
    c.addColorStop(1, s.fill[2]),
    (e.fillStyle = c),
    e.fill(),
    L(e, s.line),
    R(e, k(a * 0.72, o * 0.58, s.steps), !0),
    (e.lineWidth = s.line * 0.45),
    (e.strokeStyle = `rgba(255,226,150,0.55)`),
    e.stroke(),
    e.beginPath(),
    e.moveTo(a * 0.1, 0),
    e.lineTo(a * 0.8, 0),
    e.stroke(),
    e.restore());
}
function z(e, t, n, r, i, a, o, s, c) {
  for (let l = 0; l < r; l++) we(e, t, n, i + (l / r) * y, a, o, s, c);
}
function Te(e, t, n, r, i, a, o) {
  (e.save(), e.translate(t, n), e.rotate(r));
  let s = a - i,
    c = 0.07 + s * 0.1;
  (e.beginPath(),
    e.moveTo(i, -c),
    e.bezierCurveTo(i + s * 0.4, -c * 0.9, i + s * 0.55, o * c * 1.4, a, o * c * 0.4),
    e.bezierCurveTo(i + s * 0.62, o * c * 0.3, i + s * 0.4, c * 0.9, i, c),
    e.closePath());
  let l = e.createLinearGradient(i, 0, a, 0);
  (l.addColorStop(0, `rgba(244,186,80,0.55)`),
    l.addColorStop(1, `rgba(255,230,150,0.95)`),
    (e.fillStyle = l),
    e.fill(),
    L(e, 0.011, N.mid),
    e.restore());
}
function B(e, t, n, r, i, a) {
  (e.save(),
    e.translate(t, n),
    e.scale(i * r, r),
    (e.globalAlpha = a),
    e.beginPath(),
    e.moveTo(-1.25, -0.08),
    e.bezierCurveTo(-1, 0.1, -0.8, -0.15, -0.55, 0.02),
    e.bezierCurveTo(-0.5, 0.3, -0.1, 0.42, 0.12, 0.26),
    e.bezierCurveTo(0.36, 0.4, 0.62, 0.18, 0.5, -0.05),
    e.bezierCurveTo(0.6, -0.3, 0.2, -0.4, 0, -0.22),
    e.bezierCurveTo(-0.2, -0.38, -0.5, -0.3, -0.55, -0.12));
  let o = e.createLinearGradient(-1.2, 0, 0.6, 0);
  (o.addColorStop(0, `rgba(230,170,70,0)`),
    o.addColorStop(1, `rgba(244,196,100,0.4)`),
    (e.fillStyle = o),
    e.fill(),
    L(e, 0.018 / Math.max(0.35, r), N.mid),
    e.beginPath());
  for (let t = 0; t <= 48; t++) {
    let n = t / 48,
      r = n * 2.2 * y,
      i = 0.2 * (1 - n * 0.88),
      a = 0.16 + i * Math.cos(r),
      o = 0.02 + i * Math.sin(r);
    t === 0 ? e.moveTo(a, o) : e.lineTo(a, o);
  }
  (L(e, 0.014 / Math.max(0.35, r), N.light), e.restore(), (e.globalAlpha = 1));
}
function V(e, t, n, r, i) {
  (e.save(), e.translate(t, n));
  for (let t = 0; t < i; t++)
    (e.save(),
      e.rotate((t / i) * y),
      e.beginPath(),
      e.ellipse(r * 0.62, 0, r * 0.38, r * 0.17, 0, 0, y),
      (e.fillStyle = `rgba(244,196,100,0.5)`),
      e.fill(),
      L(e, r * 0.07, N.light),
      e.restore());
  (e.beginPath(),
    e.arc(0, 0, r * 0.2, 0, y),
    (e.fillStyle = N.mid),
    e.fill(),
    L(e, r * 0.05, N.hi),
    e.restore());
}
function H(e, t, n, r, i, a) {
  (e.save(), e.translate(t, n), e.rotate(r), e.scale(i, i));
  let o = A();
  for (let t = 0; t < a; t++) (e.save(), e.translate(t, 0), R(e, o, !1), L(e, 0.09 / 1, N.mid), e.restore());
  e.restore();
}
function U(e, t, n, r, i, a, o = 1) {
  let s = t.normalize(`NFC`);
  (e.save(), e.translate(n, r), e.scale(o, 1), (e.font = `700 ${i}px ${P}`));
  let c = e.measureText(s).width * o,
    l = c > a && c > 0 ? (i * a) / c : i;
  ((e.font = `700 ${l}px ${P}`),
    (e.textAlign = `center`),
    (e.textBaseline = `middle`),
    (e.fillStyle = `rgba(16,2,2,0.78)`),
    e.fillText(s, l * 0.035, l * 0.045));
  let u = e.createLinearGradient(0, -l * 0.5, 0, l * 0.5);
  (u.addColorStop(0, `#fff3bd`),
    u.addColorStop(0.5, `#efbd52`),
    u.addColorStop(1, `#b9822a`),
    (e.fillStyle = u),
    e.fillText(s, 0, 0),
    (e.lineWidth = Math.max(1, l * 0.014)),
    (e.strokeStyle = `rgba(112,70,16,0.7)`),
    e.strokeText(s, 0, 0),
    e.restore());
}
function W(e, t, n, r, i) {
  let a = b(i);
  for (let i = 0; i < n; i++) {
    let n = t.x + a() * t.w,
      i = t.y + a() * t.h,
      o = r * (0.25 + 1.4 * a() * a());
    if (a() < 0.72) {
      let t = 0.05 + 0.22 * a();
      ((e.fillStyle = `rgba(255,${190 + Math.floor(a() * 55)},${90 + Math.floor(a() * 70)},${t})`),
        e.fillRect(n, i, o * (1 + a()), o));
    } else ((e.fillStyle = `rgba(18,3,2,${0.1 + 0.18 * a()})`), e.fillRect(n, i, o, o * (1 + a())));
  }
}
function Ee() {
  return [
    [2.2, 1.3],
    [1.75, 1.7],
    [2.15, 2.15],
    [1.7, 2.6],
    [2.1, 3.05],
    [2, 3.5],
    [1.8, 3.8],
    [1.5, 3.9],
  ];
}
function De(e) {
  let t = Math.min(1, Math.max(0, e)),
    n = 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.12)) + 0.5 * Math.min(1, t * 1.6),
    r = t > 0.9 ? 1 - (t - 0.9) * 3 : 1;
  return 0.014 + 0.062 * Math.max(0, n) * r;
}
var G = { cell: 0.12, jitter: 0.08 };
function Oe(e, t) {
  let n = Math.ceil(e.w / G.cell),
    r = Math.ceil(e.h / G.cell),
    i = [];
  for (let a = 0; a < r; a++)
    for (let r = 0; r < n; r++)
      i.push({
        x: e.x + r * G.cell,
        y: e.y + a * G.cell,
        w: G.cell,
        h: G.cell,
        tone: (t() * 2 - 1) * G.jitter,
      });
  return i;
}
function ke(e, t, n) {
  let r = [];
  for (let i = 0; i < t; i++) {
    let t = e.x + n() * e.w,
      i = e.y + n() * e.h,
      a = n() * y,
      o = [[t, i]],
      s = 5 + Math.floor(n() * 7);
    for (let r = 0; r < s; r++) {
      a += (n() - 0.5) * 1.3;
      let r = 0.04 + n() * 0.07;
      if (
        ((t += Math.cos(a) * r), (i += Math.sin(a) * r), t < e.x || t > e.x + e.w || i < e.y || i > e.y + e.h)
      )
        break;
      o.push([t, i]);
    }
    o.length > 1 && r.push(o);
  }
  return r;
}
var K = { lacquerRough: 0.2, goldRough: 0.4, goldMetal: 0.7 };
function Ae(e, t, n) {
  let r = Math.max(e, t, n);
  return r < 120 || r - Math.min(e, t, n) < 0.3 * r ? !1 : e >= t && t > 0.52 * e && n < 0.72 * t;
}
function je(e, t) {
  let n = Math.round(K.lacquerRough * 255),
    r = Math.round(K.goldRough * 255),
    i = Math.round(K.goldMetal * 255);
  for (let a = 0; a + 3 < e.length; a += 4) {
    let o = Ae(e[a], e[a + 1], e[a + 2]);
    ((t[a] = 0), (t[a + 1] = o ? r : n), (t[a + 2] = o ? i : 0), (t[a + 3] = 255));
  }
}
function Me(e, t) {
  let n = new c(Ee().map(([e, t]) => new l(e, t, 0))),
    r = [],
    i = [],
    a = [];
  for (let e = 0; e <= t; e++) {
    let o = e / t,
      s = n.getPointAt(o),
      c = n.getTangentAt(o),
      l = De(o);
    (r.push([s.x - c.y * l, s.y + c.x * l]),
      i.push([s.x + c.y * l, s.y - c.x * l]),
      a.push([s.x, s.y, c.x, c.y, l]));
  }
  R(e, [...r, ...i.reverse()], !0);
  let o = e.createLinearGradient(1.5, 3.9, 2.2, 1.3);
  (o.addColorStop(0, `rgba(226,160,56,0.78)`),
    o.addColorStop(1, `rgba(190,118,36,0.6)`),
    (e.fillStyle = o),
    e.fill(),
    L(e, 0.009, N.mid),
    (e.lineWidth = 0.004),
    (e.strokeStyle = `rgba(110,60,12,0.55)`));
  for (let t = 2; t < a.length - 4; t += 2) {
    let [n, r, i, o, s] = a[t],
      c = Math.atan2(o, i);
    (e.beginPath(), e.arc(n, r, s * 0.75, c - 1.2, c + 1.2), e.stroke());
  }
  for (let t = 3; t < a.length - 3; t += 3) {
    let [n, r, i, o, s] = a[t],
      c = -o,
      l = i,
      u = (e, t) => [n + c * e + i * t, r + l * e + o * t],
      d = u(s, 0),
      f = u(s + 0.1, 0.05),
      p = u(s + 0.16, 0.12),
      m = u(s + 0.04, 0.1),
      h = u(s, 0.1);
    (e.beginPath(),
      e.moveTo(d[0], d[1]),
      e.quadraticCurveTo(f[0], f[1], p[0], p[1]),
      e.quadraticCurveTo(m[0], m[1], h[0], h[1]),
      e.closePath(),
      (e.fillStyle = `rgba(255,214,120,0.75)`),
      e.fill(),
      L(e, 0.005, N.mid));
  }
  let s = a[a.length - 1];
  (e.save(),
    e.translate(s[0], s[1]),
    e.rotate(Math.atan2(s[3], s[2])),
    e.beginPath(),
    e.moveTo(-0.14, 0.08),
    e.bezierCurveTo(-0.06, 0.17, 0.1, 0.17, 0.22, 0.11),
    e.bezierCurveTo(0.31, 0.09, 0.4, 0.1, 0.45, 0.14),
    e.bezierCurveTo(0.46, 0.07, 0.43, 0.02, 0.36, 0),
    e.bezierCurveTo(0.4, -0.02, 0.4, -0.07, 0.34, -0.08),
    e.bezierCurveTo(0.24, -0.1, 0.1, -0.11, -0.02, -0.1),
    e.bezierCurveTo(-0.1, -0.09, -0.14, -0.02, -0.14, 0.08),
    e.closePath());
  let u = e.createLinearGradient(-0.14, 0, 0.45, 0);
  (u.addColorStop(0, `rgba(214,150,52,0.9)`),
    u.addColorStop(1, `rgba(240,190,92,0.95)`),
    (e.fillStyle = u),
    e.fill(),
    L(e, 0.009, N.light),
    e.beginPath(),
    e.moveTo(0.08, -0.015),
    e.bezierCurveTo(0.2, -0.04, 0.3, -0.02, 0.37, 0),
    (e.lineWidth = 0.006),
    (e.strokeStyle = `rgba(70,24,6,0.85)`),
    e.stroke(),
    e.beginPath(),
    e.arc(0.38, 0.095, 0.011, 0, y),
    (e.fillStyle = `#3a1308`),
    e.fill(),
    e.beginPath(),
    e.ellipse(0.12, 0.05, 0.03, 0.022, 0.2, 0, y),
    (e.fillStyle = `#fff3bf`),
    e.fill(),
    e.beginPath(),
    e.arc(0.125, 0.05, 0.013, 0, y),
    (e.fillStyle = `#3a1308`),
    e.fill());
  for (let [t, n] of [
    [0.1, 0.9],
    [0.02, 0.5],
  ])
    (e.beginPath(),
      e.moveTo(-0.1, t),
      e.bezierCurveTo(-0.22, t + 0.1, -0.36, t + n * 0.2, -0.5, t + n * 0.14),
      e.bezierCurveTo(-0.38, t - 0.01, -0.24, t - 0.03, -0.1, t - 0.05),
      e.closePath(),
      (e.fillStyle = `rgba(255,214,120,0.78)`),
      e.fill(),
      L(e, 0.005, N.mid));
  e.restore();
}
function Ne(e, t, n) {
  let r = [],
    i = n * 1.5,
    a = Math.floor((2 * e - 0.5) / i);
  for (let o = 0; o < 2; o++)
    for (let s = 0; s <= a; s++) r.push([-e + 0.25 + s * i + (o ? i / 2 : 0), t + o * n * 0.7, n]);
  return r;
}
function Pe(e, t, n, r) {
  let { halfW: i, y0: a, y1: o, bodyY: s } = T,
    c = r === `low`,
    l = { x: -i - 0.1, y: a - 0.1, w: 2 * i + 0.2, h: o - a + 0.2 };
  return [
    {
      name: `lacquer`,
      run(n) {
        F(n, e, t);
        let r = n.createLinearGradient(0, o, 0, a);
        (r.addColorStop(0, `#34090a`),
          r.addColorStop(0.5, `#7f160e`),
          r.addColorStop(1, `#2d0707`),
          (n.fillStyle = r),
          n.fillRect(l.x, l.y, l.w, l.h));
        let i = s + 0.5,
          c = n.createRadialGradient(0, i, 0.05, 0, i, 3.7);
        (c.addColorStop(0, `rgba(232,78,42,0.95)`),
          c.addColorStop(0.28, `rgba(194,46,28,0.82)`),
          c.addColorStop(0.62, `rgba(120,20,14,0.5)`),
          c.addColorStop(1, `rgba(30,6,5,0)`),
          (n.fillStyle = c),
          n.fillRect(l.x, l.y, l.w, l.h));
        let u = n.createLinearGradient(-3, 1, 3, 4.6);
        (u.addColorStop(0, `rgba(255,255,255,0)`),
          u.addColorStop(0.5, `rgba(255,222,190,0.075)`),
          u.addColorStop(1, `rgba(255,255,255,0)`),
          (n.fillStyle = u),
          n.fillRect(l.x, l.y, l.w, l.h));
      },
    },
    {
      name: `rays`,
      run(n) {
        F(n, e, t);
        for (let e = 0; e < 36; e++) {
          let t = (e / 36) * y,
            r = (y / 36) * 0.32;
          (n.beginPath(),
            n.moveTo(Math.cos(t - r) * 2.2, s + Math.sin(t - r) * 2.2),
            n.lineTo(Math.cos(t - r * 0.2) * 6, s + Math.sin(t - r * 0.2) * 6),
            n.lineTo(Math.cos(t + r * 0.2) * 6, s + Math.sin(t + r * 0.2) * 6),
            n.lineTo(Math.cos(t + r) * 2.2, s + Math.sin(t + r) * 2.2),
            n.closePath(),
            (n.fillStyle = e % 2 ? `rgba(255,206,110,0.07)` : `rgba(255,170,80,0.035)`),
            n.fill());
        }
      },
    },
    {
      name: `lotus`,
      run(n) {
        F(n, e, t);
        let r = c ? 8 : 14,
          i = {
            fill: [`rgba(200,130,44,0.05)`, `rgba(226,160,60,0.22)`, `rgba(246,200,100,0.4)`],
            line: 0.011,
            steps: r,
          },
          a = {
            fill: [`rgba(210,140,50,0.08)`, `rgba(236,172,68,0.3)`, `rgba(250,208,110,0.5)`],
            line: 0.012,
            steps: r,
          },
          o = {
            fill: [`rgba(224,150,56,0.14)`, `rgba(244,184,84,0.38)`, `rgba(252,214,120,0.58)`],
            line: 0.013,
            steps: r,
          };
        (z(n, 0, s, 16, 0, 0.95, 1.38, 0.3, i),
          z(n, 0, s, 16, y / 32, 0.75, 1.02, 0.26, a),
          z(n, 0, s, 12, 0, 0.55, 0.72, 0.22, o));
      },
    },
    {
      name: `halo`,
      run(r) {
        F(r, e, t);
        let i = r.createRadialGradient(0, n, 0, 0, n, 1.5);
        (i.addColorStop(0, `rgba(255,222,140,0.92)`),
          i.addColorStop(0.42, `rgba(250,196,100,0.78)`),
          i.addColorStop(0.6, `rgba(238,160,64,0.42)`),
          i.addColorStop(1, `rgba(206,110,36,0)`),
          (r.fillStyle = i),
          r.beginPath(),
          r.arc(0, n, 1.5, 0, y),
          r.fill(),
          r.beginPath(),
          r.arc(0, n, 0.92, 0, y),
          L(r, 0.026, N.mid),
          r.beginPath(),
          r.arc(0, n, 1, 0, y),
          L(r, 0.008, N.hi));
        let a = c ? 32 : 48;
        for (let e = 0; e < a; e++) {
          let t = (e / a) * y;
          (r.beginPath(),
            r.arc(Math.cos(t) * 1.07, n + Math.sin(t) * 1.07, 0.014, 0, y),
            (r.fillStyle = N.light),
            r.fill());
        }
        let o = c ? 20 : 28;
        for (let e = 0; e < o; e++) Te(r, 0, n, (e / o) * y, 1.12, e % 2 ? 1.36 : 1.5, e % 2 ? 1 : -1);
      },
    },
    {
      name: `wheel`,
      run(r) {
        (F(r, e, t),
          z(r, 0, n, 16, 0, 0.32, 0.36, 0.085, {
            fill: [`rgba(224,150,56,0.1)`, `rgba(244,190,90,0.34)`, `rgba(252,222,130,0.6)`],
            line: 0.008,
            steps: c ? 6 : 8,
          }));
        for (let e = 0; e < 8; e++) {
          let t = (e / 8) * y + y / 16;
          (r.save(),
            r.translate(0, n),
            r.rotate(t),
            R(
              r,
              [
                [0.3, 0],
                [0.42, 0.025],
                [0.64, 0.012],
                [0.7, 0],
                [0.64, -0.012],
                [0.42, -0.025],
              ],
              !0,
            ),
            (r.fillStyle = `rgba(255,226,150,0.55)`),
            r.fill(),
            L(r, 0.006, N.hi),
            r.beginPath(),
            r.arc(0.74, 0, 0.02, 0, y),
            (r.fillStyle = N.light),
            r.fill(),
            r.restore());
        }
        (r.beginPath(), r.arc(0, n, 0.3, 0, y), L(r, 0.01, N.mid));
      },
    },
    {
      name: `clouds`,
      run(n) {
        F(n, e, t);
        for (let [e, t, r, i] of [
          [1.95, 1.35, 0.62, 0.85],
          [2.2, 2.6, 0.5, 0.8],
          [2, 3.75, 0.56, 0.85],
          [1.05, 4.55, 0.42, 0.75],
          [0.9, 1.1, 0.46, 0.55],
        ])
          (B(n, e, t, r, 1, i), B(n, -e, t, r, -1, i));
      },
    },
    {
      name: `dragons`,
      run(n) {
        F(n, e, t);
        let r = c ? 24 : 40;
        (Me(n, r), n.save(), n.scale(-1, 1), Me(n, r), n.restore());
      },
    },
    {
      name: `border`,
      run(n) {
        F(n, e, t);
        let r = (e) => ({ x: -i + e, y: a + e, w: 2 * i - 2 * e, h: o - a - 2 * e });
        for (let [e, t, i] of [
          [0.17, 0.016, N.mid],
          [0.23, 0.006, N.light],
          [0.46, 0.008, N.deep],
        ]) {
          let a = r(e);
          (n.beginPath(), n.rect(a.x, a.y, a.w, a.h), L(n, t, i));
        }
        let s = 0.085,
          c = (e) => Math.floor(e / s),
          l = r(0.26);
        (H(n, l.x, l.y + l.h - s, 0, s, c(l.w)), H(n, l.x, l.y, 0, s, c(l.w)));
        for (let [e, t] of [
          [-i + 0.36, o - 0.36],
          [i - 0.36, o - 0.36],
          [-i + 0.36, a + 0.36],
          [i - 0.36, a + 0.36],
        ])
          V(n, e, t, 0.16, 8);
        ((n.lineWidth = 0.008), (n.strokeStyle = N.mid));
        for (let [e, t, r] of Ne(i, a + 0.2, 0.09)) (n.beginPath(), n.arc(e, t, r, 0, Math.PI), n.stroke());
      },
    },
    {
      name: `gilding`,
      run(n) {
        if ((F(n, e, t), c)) return;
        let r = n.globalCompositeOperation;
        n.globalCompositeOperation = `soft-light`;
        for (let e of Oe(l, b(4401)))
          ((n.fillStyle =
            e.tone > 0
              ? `rgba(255,236,170,${(e.tone * 2.6).toFixed(3)})`
              : `rgba(40,12,4,${(-e.tone * 2.6).toFixed(3)})`),
            n.fillRect(e.x, e.y, e.w, e.h));
        ((n.globalCompositeOperation = r),
          (n.lineWidth = 0.0035),
          (n.strokeStyle = `rgba(70,30,6,0.16)`),
          n.beginPath());
        for (let e = l.x; e <= l.x + l.w; e += G.cell) (n.moveTo(e, l.y), n.lineTo(e, l.y + l.h));
        for (let e = l.y; e <= l.y + l.h; e += G.cell) (n.moveTo(l.x, e), n.lineTo(l.x + l.w, e));
        n.stroke();
      },
    },
    {
      name: `craquelure`,
      run(n) {
        (F(n, e, t),
          (n.lineWidth = (2 * i) / e),
          (n.lineJoin = `round`),
          (n.strokeStyle = `rgba(20,4,2,0.3)`));
        for (let e of ke(l, c ? 24 : 70, b(8803))) (R(n, e, !1), n.stroke());
      },
    },
    {
      name: `leaf`,
      run(n) {
        (F(n, e, t), W(n, l, c ? 280 : 1e3, 0.012, 20241));
        let r = s + 0.3,
          i = n.createRadialGradient(0, r, 1.6, 0, r, 4.4);
        (i.addColorStop(0, `rgba(0,0,0,0)`),
          i.addColorStop(1, `rgba(8,1,1,0.58)`),
          (n.fillStyle = i),
          n.fillRect(l.x, l.y, l.w, l.h),
          n.setTransform(1, 0, 0, 1, 0, 0));
      },
    },
  ];
}
function q(e, t, n, r, i) {
  let a = e.createLinearGradient(0, t.y, 0, t.y + t.h);
  (a.addColorStop(0, n), a.addColorStop(1, r), (e.fillStyle = a), e.fillRect(t.x, t.y, t.w, t.h));
  let o = e.createLinearGradient(t.x, t.y, t.x + t.w, t.y + t.h);
  (o.addColorStop(0, `rgba(255,255,255,0)`),
    o.addColorStop(0.5, `rgba(255,220,190,0.08)`),
    o.addColorStop(1, `rgba(255,255,255,0)`),
    (e.fillStyle = o),
    e.fillRect(t.x, t.y, t.w, t.h),
    e.beginPath(),
    e.rect(t.x + i * 1.4, t.y + i * 1.4, t.w - i * 2.8, t.h - i * 2.8),
    L(e, i, N.mid),
    e.beginPath(),
    e.rect(t.x + i * 3.6, t.y + i * 3.6, t.w - i * 7.2, t.h - i * 7.2),
    L(e, i * 0.34, N.light));
}
function Fe(e) {
  let t = re;
  return [
    {
      name: `base`,
      run(t) {
        (I(t, e), (t.fillStyle = `#3a0b08`), t.fillRect(0, 0, E, E));
      },
    },
    {
      name: `hoanhPhi`,
      run(n) {
        I(n, e);
        let r = t.hoanhPhi;
        (q(n, r, `#b02a1b`, `#76140c`, 6),
          W(n, r, 260, 3, 11),
          V(n, 92, r.h / 2, 38, 8),
          V(n, r.w - 92, r.h / 2, 38, 8),
          U(n, ae, r.w / 2, r.h / 2 + 4, 132, 740));
      },
    },
    {
      name: `cauDoi`,
      run(n) {
        I(n, e);
        for (let [e, r] of [
          [t.cauDoiPhai, ie],
          [t.cauDoiTrai, se],
        ]) {
          (q(n, e, `#3a0e0a`, `#220706`, 3.2), W(n, e, 90, 2, e.x + 5));
          let t = M(r, e.w, e.h),
            i = e.x + e.w / 2;
          (r.forEach((a, o) => {
            let s = e.y + (t.ys[o] ?? 0);
            (U(n, a, i, s, t.size, e.w * 0.7, t.condense),
              o < r.length - 1 && V(n, i, s + t.pitch / 2, 8, 6));
          }),
            V(n, i, e.y + 28, 11, 8),
            V(n, i, e.y + e.h - 28, 11, 8));
        }
      },
    },
    {
      name: `huongAn`,
      run(n) {
        I(n, e);
        let r = t.huongAn;
        (q(n, r, `#8f1c12`, `#5a0e08`, 2.4), W(n, r, 140, 2, 31));
        let i = r.y + r.h / 2,
          a = r.h * 0.22,
          o = r.x + 30,
          s = r.x + r.w - 30;
        n.beginPath();
        for (let e = o; e <= s; e += 3) {
          let t = i + Math.sin(((e - o) / 76) * y) * a;
          e === o ? n.moveTo(e, t) : n.lineTo(e, t);
        }
        L(n, 2.2, N.mid);
        for (let e = o + 19; e < s - 10; e += 76)
          (n.beginPath(),
            n.arc(e, i - a - 5, 5.5, 0, y),
            (n.fillStyle = N.light),
            n.fill(),
            n.beginPath(),
            n.ellipse(e + 38, i + a + 4, 11, 4.4, -0.5, 0, y),
            (n.fillStyle = `rgba(244,196,100,0.65)`),
            n.fill(),
            L(n, 1.3, N.light));
        V(n, r.x + r.w / 2, i, r.h * 0.4, 10);
      },
    },
    {
      name: `binhPhong`,
      run(n) {
        (I(n, e), Ie(n, t.binhPhong, !1));
      },
    },
    {
      name: `muralPanel`,
      run(n) {
        (I(n, e), Ie(n, t.muralPanel, !0));
      },
    },
  ];
}
function Ie(e, t, n) {
  (q(e, t, `#5c150c`, `#34090a`, 5), W(e, t, 220, 3, t.x + t.y));
  let r = t.x + t.w / 2,
    i = t.y + t.h * (n ? 0.46 : 0.5),
    a = t.h * (n ? 0.34 : 0.35);
  for (let [t, n] of [
    [1, 3.4],
    [0.9, 1.6],
  ])
    (e.beginPath(), e.arc(r, i, a * t, 0, y), L(e, n, N.mid));
  (z(e, r, i, 12, 0, a * 0.14, a * 0.7, a * 0.2, { fill: [N.deep, N.mid, N.hi], line: 1.7, steps: 10 }),
    z(e, r, i, 12, Math.PI / 12, a * 0.1, a * 0.46, a * 0.15, {
      fill: [`#a02a1c`, `#d8503a`, `#f4a870`],
      line: 1.3,
      steps: 10,
    }),
    V(e, r, i, a * 0.16, 8));
  for (let [n, r] of [
    [1, t.x + t.w * 0.17],
    [-1, t.x + t.w * 0.83],
  ])
    (e.save(), e.translate(r, i), e.scale(t.h * 0.2, t.h * 0.2), B(e, 0, 0, 1, n, 0.95), e.restore());
  for (let [n, r] of [
    [0.06, 0.12],
    [0.94, 0.12],
    [0.06, 0.88],
    [0.94, 0.88],
  ])
    V(e, t.x + t.w * n, t.y + t.h * r, 15, 8);
  if (n) {
    let n = t.y + t.h * 0.9;
    e.beginPath();
    for (let r = t.x + 40; r <= t.x + t.w - 40; r += 3) {
      let i = n + Math.sin(((r - t.x) / 52) * y) * 6;
      r === t.x + 40 ? e.moveTo(r, i) : e.lineTo(r, i);
    }
    L(e, 2, N.mid);
  }
}
function J(e, t, n, r, i) {
  let a = 0,
    o = (s) => {
      if (r()) {
        do {
          let n = e[a];
          if (!n) {
            i();
            return;
          }
          ((a += 1), n.run(t));
        } while (s() > 10);
        n(o);
      }
    };
  n(o);
}
var Y = 4;
function Le(e, t, n, r = { failed: !1 }) {
  let i = [];
  for (let a = 0; a < Y; a++) {
    let o = Math.floor((a * n) / Y),
      s = Math.floor(((a + 1) * n) / Y);
    i.push({
      name: `material-${a}`,
      run(n) {
        if (!(r.failed || s <= o))
          try {
            let r = e.getImageData(0, o, t, s - o),
              i = n.createImageData(t, s - o);
            (je(r.data, i.data), n.putImageData(i, 0, o));
          } catch {
            r.failed = !0;
          }
      },
    });
  }
  return i;
}
function Re(e, t) {
  let n = document.createElement(`canvas`);
  ((n.width = e), (n.height = t));
  let r = n.getContext(`2d`);
  return r ? { canvas: n, g: r } : null;
}
function ze(e, t, n) {
  let r = Re(e.width, e.height);
  if (!r) return;
  let i = (t) => {
    let n = new g(r.canvas);
    ((n.colorSpace = o), (n.anisotropy = e.anisotropy));
    let i = e.material;
    if (
      ((i.map = n),
      (i.emissiveMap = n),
      i.color.set(16777215),
      i.emissive.set(16777215),
      t && i.isMeshStandardMaterial)
    ) {
      let e = i;
      ((e.roughnessMap = t), (e.metalnessMap = t), (e.roughness = 1), (e.metalness = 1));
    }
    i.needsUpdate = !0;
  };
  J(e.steps, r.g, t, n, () => {
    let a = e.material.isMeshStandardMaterial === !0,
      o = e.glossy && a ? Re(e.width, e.height) : null;
    if (!o) {
      i(null);
      return;
    }
    let s = { failed: !1 };
    J(Le(r.g, e.width, e.height, s), o.g, t, n, () => {
      if (s.failed) {
        i(null);
        return;
      }
      let t = new g(o.canvas);
      ((t.colorSpace = ``), (t.anisotropy = e.anisotropy), i(t));
    });
  });
}
var Be = e({ canDecodeStatues: () => We, fetchStatueMesh: () => Ke }),
  X = 44,
  Z = 15,
  Ve = 14,
  Q = () => Error(`chỉ số tượng không hợp lệ`);
function He(e) {
  if (e.length < X) throw Error(`tệp tượng quá ngắn`);
  for (let t = 0; t < 4; t++) if (e[t] !== `CSM2`.charCodeAt(t)) throw Error(`không phải tệp tượng CSM2`);
  let t = new DataView(e.buffer, e.byteOffset, e.byteLength),
    n = t.getUint32(4, !0),
    r = t.getUint32(8, !0),
    i = e[36] ?? 0,
    a = ((e[37] ?? 0) & 1) == 1,
    o = t.getUint32(40, !0);
  if (i < 1 || i > 15 || r % 3 != 0 || o < r / 3 || o > (2 * r) / 3)
    throw Error(`đầu tệp tượng không hợp lệ`);
  for (let e = 0; e < 6; e++)
    if (!Number.isFinite(t.getFloat32(12 + e * 4, !0))) throw Error(`đầu tệp tượng không hợp lệ`);
  let s = X + 6 * n + (a ? n : 0);
  if (e.length < s + o) throw Error(`tệp tượng bị cụt`);
  let c = (1 << i) - 1,
    l = new Float32Array(3 * n),
    u = X,
    d = X + 3 * n;
  for (let r = 0; r < 3; r++) {
    let i = t.getFloat32(12 + r * 4, !0),
      a = (t.getFloat32(24 + r * 4, !0) - i) / c,
      o = 0;
    for (let t = 0; t < n; t++) {
      let s = r * n + t,
        c = ((e[u + s] ?? 0) << 8) | (e[d + s] ?? 0);
      ((o += (c >>> 1) ^ -(c & 1)), (l[t * 3 + r] = i + o * a));
    }
  }
  let f = a ? e.slice(X + 6 * n, s) : null;
  return { positions: l, indices: Ue(e, s, o, n, r), ao: f };
}
function Ue(e, t, n, r, i) {
  let a = r <= 65536 ? new Uint16Array(i) : new Uint32Array(i),
    o = t + n,
    s = t,
    c = o,
    l = new Int32Array(Z),
    u = new Int32Array(Z),
    d = 0,
    f = new Int32Array(Ve),
    p = 0,
    m = 0,
    h = () => {
      if (s >= o) throw Error(`tệp tượng bị cụt`);
      return e[s++] ?? 0;
    },
    g = () => {
      let t = 0;
      for (let n = 0; ; n += 7) {
        if (c >= e.length) throw Error(`tệp tượng bị cụt`);
        if (n > 28) throw Q();
        let r = e[c++] ?? 0;
        if (((t += (r & 127) * 2 ** n), r < 128)) return t;
      }
    },
    ee = (e) => {
      let t = 0;
      for (; t < p && f[t] !== e;) t++;
      t === p && p < Ve && p++;
      for (let e = Math.min(t, 13); e > 0; e--) f[e] = f[e - 1] ?? 0;
      f[0] = e;
    },
    _ = (e) => {
      let t;
      if (e === 0) {
        if (m >= r) throw Q();
        t = m++;
      } else if (e < 15) {
        if (e > p) throw Q();
        t = f[e - 1] ?? 0;
      } else {
        let e = g();
        if (e >= m) throw Q();
        t = m - 1 - e;
      }
      return (ee(t), t);
    },
    v = (e, t) => {
      let n = 0;
      for (; n < d && (l[n] !== e || u[n] !== t);) n++;
      n === d && d < Z && d++;
      for (let e = Math.min(n, 14); e > 0; e--) ((l[e] = l[e - 1] ?? 0), (u[e] = u[e - 1] ?? 0));
      ((l[0] = e), (u[0] = t));
    };
  for (let e = 0; e < i; e += 3) {
    let t = h(),
      n = t >> 4,
      r,
      i,
      o;
    if (n < 15) {
      if (n >= d) throw Q();
      ((r = u[n] ?? 0), (i = l[n] ?? 0), (o = _(t & 15)));
    } else {
      r = _(t & 15);
      let e = h();
      ((i = _(e >> 4)), (o = _(e & 15)));
    }
    ((a[e] = r), (a[e + 1] = i), (a[e + 2] = o), v(r, i), v(i, o), v(o, r));
  }
  if (m !== r) throw Error(`chỉ số tượng không khớp số đỉnh`);
  if (s !== o || c !== e.length) throw Error(`tệp tượng thừa dữ liệu`);
  return a;
}
function We() {
  return typeof DecompressionStream == `function`;
}
async function Ge(e) {
  if (e[0] !== 31 || e[1] !== 139) return e;
  let t = new Response(e).body;
  if (!t) throw Error(`không đọc được dữ liệu tượng`);
  return new Uint8Array(await new Response(t.pipeThrough(new DecompressionStream(`gzip`))).arrayBuffer());
}
async function Ke(e, t) {
  let n = await fetch(e, { signal: t });
  if (!n.ok) throw Error(`tải tượng lỗi ${n.status}: ${e}`);
  return He(await Ge(new Uint8Array(await n.arrayBuffer())));
}
var qe = e({ loadHallStatues: () => Qe }),
  $ = [
    { id: `phat`, x: w.x, y: S.upper, z: w.z, finish: `gilt` },
    { id: `quan-am`, x: x.x, y: S.lower, z: x.z, finish: `porcelain` },
    { id: `dia-tang`, x: C.x, y: S.lower, z: C.z, finish: `gilt` },
  ],
  Je = { gilt: new p(14265416), porcelain: new p(16051938) },
  Ye = { day: 0.5, night: 0.25 };
function Xe(e, t) {
  let n = e.positions.length / 3,
    r = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let n = e.ao ? v((e.ao[i] ?? 255) / 255) : 1;
    ((r[i * 3] = t.r * n), (r[i * 3 + 1] = t.g * n), (r[i * 3 + 2] = t.b * n));
  }
  let a = new d();
  return (
    a.setAttribute(`position`, new i(e.positions, 3)),
    a.setAttribute(`color`, new i(r, 3)),
    a.setIndex(e.indices instanceof Uint16Array ? new s(e.indices, 1) : new f(e.indices, 1)),
    a.computeVertexNormals(),
    a
  );
}
function Ze(e) {
  let t = e === `low`,
    i = { vertexColors: !0, emissive: t ? 1972498 : 2761240 },
    a = t ? new n(i) : new r({ ...i, metalness: 0, roughness: 0.38, envMapIntensity: 1 });
  return (ne(a, t ? 0.35 : 0.55), a);
}
async function Qe(e, n) {
  if (!We()) return null;
  let r = new AbortController(),
    i = () => r.abort();
  n?.addEventListener(`abort`, i, { once: !0 });
  let o;
  try {
    o = await Promise.all(
      $.map((e) =>
        Ke(ee(e.id), r.signal).catch((e) => {
          throw (r.abort(), e);
        }),
      ),
    );
  } finally {
    n?.removeEventListener(`abort`, i);
  }
  let s = e === `low`,
    c = new a();
  c.name = `hall-statues`;
  for (let n of [`gilt`, `porcelain`]) {
    let r = [];
    if (
      ($.forEach((e, t) => {
        let i = o[t];
        e.finish === n && i && r.push(Xe(i, Je[n]).translate(e.x, e.y, e.z));
      }),
      r.length === 0)
    )
      continue;
    let i = r.length === 1 ? r[0] : h(r, !1);
    if (r.length > 1) for (let e of r) e.dispose();
    if (!i) throw Error(`không gộp được tượng ${n}`);
    i.computeBoundingSphere();
    let a = n === `gilt` ? oe(e) : Ze(e),
      l = new t(i, a);
    ((l.name = `statues-${n}`),
      (l.castShadow = !s),
      (l.receiveShadow = !s),
      (l.matrixAutoUpdate = !1),
      l.updateMatrix(),
      ce(l, n === `porcelain` ? Ye : void 0),
      c.add(l));
  }
  return c;
}
export { le as a, he as i, Be as n, Ce as r, qe as t };
