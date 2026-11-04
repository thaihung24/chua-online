import { gt as e, wt as t } from "./index-e_Bx6V48.js";
import { G as n, H as r, U as i } from "./app-z_oU8L_u.js";
var a = `x-chua-client`,
  o = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;
function s(e) {
  if (!o.test(e)) return !0;
  let t = globalThis.location?.origin;
  if (!t) return !1;
  try {
    return new URL(e, t).origin === t;
  } catch {
    return !1;
  }
}
function c(e, t = {}) {
  return s(e) ? { ...t, [a]: `1` } : { ...t };
}
var l = `/api/admin/badge`,
  u = `chuasen-admin-sid:`;
function d(e) {
  return e.slice(0, 32);
}
function f(e) {
  return `${l}?s=${e}`;
}
var p = 300;
function m(e) {
  if (typeof e != `object` || !e || Array.isArray(e)) return null;
  let { ok: t, token: n, expiresInSec: r } = e;
  return t !== !0 ||
    typeof n != `string` ||
    n.length === 0 ||
    n.length > p ||
    typeof r != `number` ||
    !Number.isFinite(r) ||
    r <= 0
    ? null
    : { ok: !0, token: n, expiresInSec: Math.floor(r) };
}
var h = [
    { id: `giu-huong`, name: `Người giữ hương`, minLevel: 1, needs: { kind: `incenseDays`, goal: 30 } },
    { id: `trang-hat`, name: `Bạn tràng hạt`, minLevel: 3, needs: { kind: `beadRounds`, goal: 108 } },
    { id: `quet-la`, name: `Người quét lá`, minLevel: 3, needs: { kind: `sweeps`, goal: 108 } },
    {
      id: `tinh-lang`,
      name: `Hành giả tĩnh lặng`,
      minLevel: 4,
      needs: { kind: `meditationMinutes`, goal: 1e3 },
    },
    { id: `hanh-huong`, name: `Khách hành hương`, minLevel: 2, needs: { kind: `stamps`, goal: 21 } },
    { id: `thang-bay`, name: `Người con tháng Bảy`, minLevel: 1, needs: { kind: `vuLan`, goal: 1 } },
    { id: `ban-sen`, name: `Bạn sen`, minLevel: 15, needs: { kind: `tier`, goal: 4 } },
    { id: `den-ben`, name: `Ngọn đèn bền bỉ`, minLevel: 5, needs: { kind: `bestStreak`, goal: 49 } },
  ],
  g = new Map(h.map((e) => [e.id, e]));
function _(e) {
  return typeof e == `string` ? g.get(e) : void 0;
}
function v(e) {
  return typeof e == `string` && e.length <= 24 && g.has(e);
}
var y = `https://www.facebook.com/chuasencom/`,
  b = `chua:fanpage`,
  x = 864e5;
function S(e) {
  try {
    localStorage.setItem(r, JSON.stringify(e));
  } catch {
    return !1;
  }
  return (window.dispatchEvent(new Event(b)), !0);
}
var C = () => n().at !== void 0;
function w(e = Date.now()) {
  let t = n();
  t.at === void 0 && S({ ...t, at: e });
}
function T(e) {
  (t(`fanpage_open`, { place: e, first: !C() }), w());
}
function E(e) {
  let t = window.open(y, `_blank`);
  if ((T(e), t))
    try {
      t.opener = null;
    } catch {}
  else location.assign(y);
}
function D(e) {
  let t = (t) => {
    (t.key === null || t.key === `chua-online:fanpage`) && e();
  };
  return (
    window.addEventListener(b, e),
    window.addEventListener(`storage`, t),
    () => {
      (window.removeEventListener(b, e), window.removeEventListener(`storage`, t));
    }
  );
}
function O(e, t = Date.now()) {
  let r = n();
  if (r.at !== void 0) return !1;
  let a = t + (e ? i : x);
  return S({ ...r, snooze: Math.max(r.snooze ?? 0, a), ...(e ? { n: (r.n ?? 0) + 1 } : {}) });
}
var k = `<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M12.6 20.5v-9.6c0-1.7.9-2.7 2.6-2.7h1.4M10 13.3h5.4"/>`;
function A(t) {
  let n = e(`info`, t);
  return `${n.slice(0, n.indexOf(`>`) + 1)}${k}</svg>`;
}
var j = null;
function M(e, t = Date.now()) {
  j = { from: e, at: t };
}
function N(e = Date.now()) {
  let t = j;
  return ((j = null), t && e - t.at >= 0 && e - t.at <= 1e4 ? t.from : `link`);
}
function P(e) {
  if (!Number.isFinite(e)) return 0;
  let t = Math.round(e);
  return t === 0 ? 0 : t;
}
function F(e) {
  let t = P(e),
    n = BigInt(Math.abs(t))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, `.`);
  return t < 0 ? `-${n}` : n;
}
function I(e) {
  return Number.isFinite(e) && e > 0 ? Math.floor(e) : 0;
}
function L(e) {
  let t = I(e),
    n = Math.floor(t / 3600),
    r = Math.floor((t % 3600) / 60),
    i = t % 60,
    a = String(r).padStart(2, `0`),
    o = String(i).padStart(2, `0`);
  return n > 0 ? `${n}:${a}:${o}` : `${a}:${o}`;
}
function R(e) {
  let t = I(e);
  if (t < 60) return `${t} giây`;
  let n = Math.floor(t / 3600),
    r = Math.floor((t % 3600) / 60);
  return n === 0 ? `${r} phút` : r === 0 ? `${n} giờ` : `${n} giờ ${r} phút`;
}
var z = `models/v2`,
  B = { min: 0.3, gamma: 1.25 };
function V(e) {
  return B.min + (1 - B.min) * Math.min(1, Math.max(0, e)) ** +B.gamma;
}
function H(e) {
  return `${`./`.endsWith(`/`) ? `./` : `.//`}${z}/${e}.csm.gz`;
}
var U = 0.42,
  W = 0.07,
  G = 0.6,
  K = 55,
  q = 0.001;
function J(e, t, n) {
  return e < t ? t : e > n ? n : e;
}
function Y(e, t) {
  let n = Number.isNaN(e) ? 0 : Math.max(0, e),
    r = J(Number.isFinite(t) ? t : K, 5, 170),
    i = 2 * n * Math.tan((r * Math.PI) / 360);
  return Math.min(U, W * i);
}
function X(e) {
  if (!(e > 0.6)) return 0;
  let t = Math.min(1, (e - G) / 0.6);
  return t * t * (3 - 2 * t);
}
function Z(e, t, n, r, i, a) {
  let o = e.parent;
  if (!o) return;
  let s = n.matrixWorld.elements,
    c = e.matrixWorld.elements,
    l = (c[12] ?? 0) - (s[12] ?? 0),
    u = (c[13] ?? 0) - (s[13] ?? 0),
    d = (c[14] ?? 0) - (s[14] ?? 0),
    f = -(l * (s[8] ?? 0) + u * (s[9] ?? 0) + d * (s[10] ?? 0)),
    p = n,
    m = Y(f, p.isPerspectiveCamera === !0 && typeof p.fov == `number` ? p.fov : K) * Math.max(q, r);
  (e.scale.set(Math.max(q, m * i), Math.max(q, m), 1),
    (t.opacity = a * X(f)),
    e.updateMatrix(),
    e.matrixWorld.multiplyMatrices(o.matrixWorld, e.matrix));
}
export {
  f as C,
  s as D,
  c as E,
  u as S,
  d as T,
  E as _,
  L as a,
  v as b,
  M as c,
  y as d,
  A as f,
  D as g,
  T as h,
  H as i,
  N as l,
  w as m,
  Z as n,
  R as o,
  C as p,
  V as r,
  F as s,
  U as t,
  k as u,
  O as v,
  m as w,
  _ as x,
  h as y,
};
