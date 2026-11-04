const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./rewards-BiUWDF_0.js",
      "./rolldown-runtime-DK3Fl9T5.js",
      "./index-e_Bx6V48.js",
      "./preload-helper-CRzLMJPS.js",
      "./referral-CM6Fj8ux.js",
      "./dialog-DwXghOMX.js",
      "./index-C_1YXvDN.css",
      "./app-z_oU8L_u.js",
      "./progress-core-C9e35Hb5.js",
      "./three-BbSp8N3g.js",
      "./sky-X0ndF2_S.js",
      "./layout-DpGLadzd.js",
      "./lanterns-DsoFXr0b.js",
      "./vn-time-DznqUr4I.js",
      "./music-mix-9H0C50bM.js",
      "./app-DmNuXdg1.css",
      "./lazy-shared-D8DtrU9N.js",
      "./rewards-C03PxySv.css",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { t } from "./preload-helper-CRzLMJPS.js";
import { a as n, n as r, o as i, r as a } from "./dialog-DwXghOMX.js";
import {
  A as o,
  At as s,
  Ct as c,
  D as l,
  Dt as u,
  Gt as d,
  Kt as f,
  M as p,
  N as m,
  Nt as h,
  Tt as g,
  Xt as _,
  Z as v,
  d as y,
  gt as b,
  h as x,
  j as S,
  k as C,
  kt as w,
  mt as T,
  pt as E,
  rt as D,
  wt as O,
} from "./index-e_Bx6V48.js";
import { _ as k, c as ee, k as A, l as te, o as j, s as M } from "./rituals-DFATLOei.js";
import {
  _ as N,
  b as P,
  f as F,
  g as ne,
  m as re,
  p as ie,
  x as I,
  y as ae,
} from "./lazy-shared-D8DtrU9N.js";
import {
  S as oe,
  _ as se,
  b as ce,
  f as L,
  g as R,
  l as le,
  p as ue,
  v as de,
  x as fe,
  y as z,
} from "./progress-core-C9e35Hb5.js";
import { i as pe, r as me } from "./vn-time-DznqUr4I.js";
import { n as he, r as ge, t as _e } from "./streak-tiers-B_2fwVfy.js";
import {
  B as ve,
  J as ye,
  K as be,
  R as xe,
  V as Se,
  dt as Ce,
  gt as we,
  lt as Te,
  mt as Ee,
  st as De,
  ut as Oe,
  z as ke,
} from "./app-z_oU8L_u.js";
var Ae = `go-nau`,
  je = { bead: [`#c08a5a`, `#7c4c2b`, `#34200f`], string: `#24160d`, edge: `rgb(20 13 8 / 0.55)` },
  Me = `mac-dinh`,
  Ne = [
    { id: `go-nau`, name: `Gỗ nâu`, tier: 1, colors: je },
    {
      id: `bo-de`,
      name: `Bồ đề`,
      tier: 2,
      colors: { bead: [`#f1e2bf`, `#c9a56b`, `#6b4a24`], string: `#3b2a14`, edge: `rgb(60 40 15 / 0.5)` },
    },
    {
      id: `go-mun`,
      name: `Gỗ mun`,
      tier: 3,
      colors: { bead: [`#6a625c`, `#2a2522`, `#0b0908`], string: `#4a3a2c`, edge: `rgb(224 178 92 / 0.28)` },
    },
    {
      id: `tram-huong`,
      name: `Trầm hương`,
      tier: 4,
      colors: { bead: [`#d99a4e`, `#6b2f17`, `#260d07`], string: `#3d1a0c`, edge: `rgb(40 12 5 / 0.6)` },
    },
    {
      id: `ngoc-bich`,
      name: `Ngọc bích`,
      tier: 5,
      colors: { bead: [`#b9efd0`, `#2f9b6b`, `#0c3d2c`], string: `#0f3a2a`, edge: `rgb(5 40 28 / 0.6)` },
    },
    {
      id: `pha-le-sen`,
      name: `Pha lê sen`,
      tier: 6,
      colors: { bead: [`#ffffff`, `#f0b8cf`, `#9a5a7d`], string: `#6d3f58`, edge: `rgb(110 50 85 / 0.45)` },
    },
  ],
  Pe = [
    { id: `mac-dinh`, name: `Mặc định`, tier: 1 },
    { id: `mo-go-trac`, name: `Mõ gỗ trắc`, tier: 3 },
    { id: `chuong-dong-lon`, name: `Chuông đồng lớn`, tier: 6 },
  ];
function Fe(e, t) {
  return Number.isFinite(t) && Math.floor(t) >= e;
}
function Ie(e) {
  return Ne.find((t) => t.id === e);
}
function Le(e) {
  return Pe.find((t) => t.id === e);
}
function Re(e, t) {
  let n = Ie(e?.beads);
  return n && Fe(n.tier, t) ? n.id : Ae;
}
function ze(e, t) {
  let n = Le(e?.timbre);
  return n && Fe(n.tier, t) ? n.id : Me;
}
function Be(e) {
  return 50 * Math.max(1, Math.floor(e));
}
function Ve(e) {
  let t = Math.max(1, Math.floor(e));
  return 25 * t * (t - 1);
}
function He(e) {
  if (!(e > 0) || !Number.isFinite(e)) return 1;
  let t = Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * e) / 25)) / 2));
  for (; t > 1 && Ve(t) > e;) --t;
  for (; Ve(t + 1) <= e;) t += 1;
  return t;
}
function Ue(e) {
  let t = e > 0 && Number.isFinite(e) ? Math.floor(e) : 0,
    n = He(t),
    r = t - Ve(n),
    i = Be(n);
  return { level: n, tier: se(n), into: r, span: i, remaining: i - r, frac: Math.min(1, Math.max(0, r / i)) };
}
function B(e, t, n, r, i) {
  return { id: e, label: t, xpEach: n, cap: r, unit: i, maxPerDay: n * r };
}
var We = B(`visit`, `Ở trong chùa từ 1 phút`, 10, 1, `lần`),
  Ge = B(`bows`, `Lạy Phật`, 2, 10, `lạy`),
  Ke = B(`incense`, `Thắp hương`, 5, 1, `lần`),
  qe = B(`flowers`, `Dâng hoa`, 5, 1, `lần`),
  Je = B(`candle`, `Thắp nến`, 5, 1, `lần`),
  Ye = B(`bells`, `Thỉnh chuông`, 3, 3, `tiếng`),
  Xe = B(`lantern`, `Thả đèn hoa đăng`, 10, 1, `đèn`),
  Ze = B(`que`, `Gieo quẻ hôm nay`, 5, 1, `quẻ`),
  Qe = B(`beadRounds`, `Lần trọn một vòng tràng hạt`, 20, 5, `vòng`),
  $e = B(`sutras`, `Tụng xong một bài kinh`, 25, 4, `bài`),
  et = B(`meditation`, `Thiền (mỗi phút trọn)`, 2, 60, `phút`),
  tt = B(`seat`, `Ngồi bồ đoàn (mỗi phút trọn)`, 1, 15, `phút`),
  nt = B(`sweep`, `Quét một lượt lá đa (36 lá)`, 10, 3, `lượt`),
  rt = B(`sweepMore`, `Quét thêm lượt lá đa (từ lượt thứ 4, ngoài trần ngày)`, 5, 17, `lượt`),
  it = B(`sweepDay`, `Quét đủ 108 lá đa trong ngày`, 20, 1, `lần`),
  at = B(`beadsMore`, `Lần thêm vòng tràng hạt (từ vòng thứ 6)`, 10, 10, `vòng`),
  ot = B(`sutrasMore`, `Tụng thêm bài kinh (từ bài thứ 5)`, 10, 6, `bài`),
  st = B(`meditationMore`, `Thiền thêm (từ phút thứ 61)`, 1, 120, `phút`),
  ct = B(`seatMore`, `Ngồi bồ đoàn thêm (từ phút thứ 16)`, 1, 45, `phút`),
  lt = B(`spots`, `Tới một điểm đi dạo khác nhau`, 3, 3, `điểm`),
  ut = B(`mindful`, `Thiền hành (mỗi phút trọn)`, 2, 10, `phút`),
  dt = B(`release`, `Phóng sinh`, 10, 1, `lần`),
  ft = B(`loc`, `Hái lộc dưới cây bồ đề`, 5, 1, `lộc`),
  pt = B(`ribbon`, `Treo nguyện lên cây bồ đề`, 10, 1, `lời nguyện`),
  mt = B(`community`, `Công phu chung: có mặt từ 10 phút trong khung 05:00 hoặc 18:00`, 30, 1, `buổi`),
  ht = [We, Ge, Ke, qe, Je, Ye, Xe, Ze, Qe, $e, et, tt, nt, it, lt, mt, ut, dt, ft, pt, rt, at, ot, st, ct];
function gt() {
  return ht;
}
nt.cap + rt.cap;
function _t(e) {
  return U(rt, Ct(nt, V(e?.sweep)));
}
function vt(e, t) {
  let n =
    U(at, Ct(Qe, V(e?.beadRounds))) +
    U(ot, Ct($e, V(e?.sutras))) +
    U(st, Ct(et, H(e?.meditationSeconds))) +
    U(ct, Ct(tt, H(t?.seatSeconds)));
  return { total: Math.min(n, 150), uncapped: n };
}
function yt(e) {
  return `${e.xpEach} tinh tấn mỗi ${e.unit}, tối đa ${e.cap} ${e.unit}/ngày`;
}
var bt = [
    { days: 3, xp: 30 },
    { days: 7, xp: 70 },
    { days: 14, xp: 100 },
    { days: 30, xp: 200 },
    { days: 49, xp: 300 },
    { days: 100, xp: 500 },
    { days: 365, xp: 1e3 },
  ],
  xt = [
    { friends: 1, xp: 50 },
    { friends: 3, xp: 100 },
    { friends: 5, xp: 150 },
    { friends: 10, xp: 300 },
  ];
function V(e) {
  return typeof e == `number` && Number.isFinite(e) && e > 0 ? Math.floor(e) : 0;
}
function St(e) {
  let t = V(e),
    n = 0;
  for (; t > 0;) ((n += t & 1), (t = Math.floor(t / 2)));
  return n;
}
function H(e) {
  return Math.floor(V(e) / 60);
}
function U(e, t) {
  return Math.min(t, e.cap) * e.xpEach;
}
function Ct(e, t) {
  return Math.max(0, t - e.cap);
}
function wt(e, t) {
  let n = V(t?.incense),
    r = V(t?.flowers),
    i = V(t?.candle),
    a = Math.min(n, Ke.cap) + Math.min(r, qe.cap) + Math.min(i, Je.cap),
    o = Math.max(0, V(e?.offerings) - n - r - i);
  return Math.min(a + o, 3) * Ke.xpEach;
}
function Tt(e, t) {
  let n =
    U(We, V(t?.visit)) +
    U(Ge, V(e?.bows)) +
    wt(e, t) +
    U(Ye, V(e?.bells)) +
    U(Xe, V(t?.lantern)) +
    U(Ze, V(t?.que)) +
    U(Qe, V(e?.beadRounds)) +
    U($e, V(e?.sutras)) +
    U(et, H(e?.meditationSeconds)) +
    U(tt, H(t?.seatSeconds)) +
    U(nt, V(t?.sweep)) +
    U(it, V(t?.sweepDay)) +
    U(lt, St(V(t?.spots) & de)) +
    U(mt, +(V(t?.communitySeconds) >= 600)) +
    U(ut, H(t?.mindfulSeconds)) +
    U(dt, V(t?.release)) +
    U(ft, V(t?.loc)) +
    U(pt, V(t?.ribbon));
  return { total: Math.min(n, 200), uncapped: n };
}
var Et = [
  { stamps: 7, xp: 30 },
  { stamps: 21, xp: 70 },
  { stamps: 49, xp: 150 },
];
Et.reduce((e, t) => e + t.xp, 0);
var Dt = `2026-11-16`,
  Ot = 864e5,
  kt = /^(\d{4})-(\d{2})-(\d{2})$/;
function W(e) {
  let t = kt.exec(e);
  if (!t) return null;
  let n = Number(t[1]),
    r = Number(t[2]),
    i = Number(t[3]),
    a = Date.UTC(n, r - 1, i),
    o = new Date(a);
  return o.getUTCFullYear() !== n || o.getUTCMonth() !== r - 1 || o.getUTCDate() !== i ? null : a / Ot;
}
function At(e) {
  return new Date(e * Ot).toISOString().slice(0, 10);
}
function jt(e, t) {
  return !!(
    (e &&
      (V(e.chants) > 0 ||
        V(e.beadRounds) > 0 ||
        V(e.bows) > 0 ||
        V(e.offerings) > 0 ||
        V(e.bells) > 0 ||
        V(e.sutras) > 0 ||
        V(e.meditationSeconds) > 0)) ||
    (t &&
      (V(t.lantern) > 0 ||
        V(t.que) > 0 ||
        V(t.quanam) > 0 ||
        V(t.sweep) > 0 ||
        V(t.sweepDay) > 0 ||
        V(t.seatSeconds) >= 60 ||
        V(t.listenSeconds) >= 60))
  );
}
function Mt(e, t, n) {
  for (let r = t + 1; r < n; r += 1)
    if (e.rest > 0) (--e.rest, (e.restUsedOn = r), e.restDays.push(r));
    else {
      ((e.run = 0), (e.inRun = 0), (e.restUsedOn = null));
      return;
    }
}
function Nt(e, t, n) {
  let r = W(t),
    i = V(n);
  if (r === null) return { current: 0, best: i, rest: 0, restUsedOn: null, restDays: [], practicedToday: !1 };
  let a = [];
  for (let t of e) {
    let e = W(t);
    e !== null && e <= r && a.push(e);
  }
  a.sort((e, t) => e - t);
  let o = { run: 0, inRun: 0, rest: 0, restUsedOn: null, restDays: [] },
    s = null;
  for (let e of a)
    e !== s &&
      (s !== null && Mt(o, s, e),
      (o.run += 1),
      (o.inRun += 1),
      o.inRun % 7 == 0 && (o.rest = Math.min(2, o.rest + 1)),
      o.run > i && (i = o.run),
      (s = e));
  return (
    s !== null && s < r && Mt(o, s, r),
    {
      current: o.run,
      best: i,
      rest: o.rest,
      restUsedOn: o.restUsedOn === null ? null : At(o.restUsedOn),
      restDays: o.restDays.map(At),
      practicedToday: s === r,
    }
  );
}
var Pt = W(`2026-01-01`) ?? 0;
function Ft(e) {
  let t = W(e);
  return t === null ? 0 : t - Pt;
}
function It(e, t) {
  return ((e % t) + t) % t;
}
function G(e, t, n, r, i, a, o) {
  return o
    ? { id: e, slot: t, title: n, guide: r, goal: i, progress: a, feature: o }
    : { id: e, slot: t, title: n, guide: r, goal: i, progress: a };
}
var Lt = [
    G(`beadRound`, `A`, `Lần một vòng tràng hạt`, { kind: `route`, route: `beads` }, 1, (e) =>
      V(e.beadRounds),
    ),
    G(`sutra`, `A`, `Tụng một bài kinh`, { kind: `route`, route: `chant` }, 1, (e) => V(e.sutras)),
    G(`meditate5`, `A`, `Thiền 5 phút`, { kind: `route`, route: `meditate` }, 5, (e) =>
      H(e.meditationSeconds),
    ),
  ],
  Rt = G(`incense`, `B`, `Thắp một nén hương`, { kind: `walk`, to: `incense` }, 1, (e, t) => V(t.incense)),
  zt = [
    Rt,
    G(
      `flowers`,
      `B`,
      `Dâng hoa`,
      { kind: `walk`, to: `altar`, offer: `flowers` },
      1,
      (e, t) => V(t.flowers),
      `flower`,
    ),
    G(
      `candle`,
      `B`,
      `Thắp nến`,
      { kind: `walk`, to: `altar`, offer: `candle` },
      1,
      (e, t) => V(t.candle),
      `candle`,
    ),
    G(`bell3`, `B`, `Thỉnh 3 tiếng chuông`, { kind: `walk`, to: `bell` }, 3, (e) => V(e.bells), `bell`),
    G(`bow3`, `B`, `Lạy Phật 3 lạy`, { kind: `walk`, to: `altar` }, 3, (e) => V(e.bows)),
    G(
      `lantern`,
      `B`,
      `Thả một đèn hoa đăng`,
      { kind: `walk`, to: `pond` },
      1,
      (e, t) => V(t.lantern),
      `lantern`,
    ),
    G(`quanam`, `B`, `Lễ Quan Âm ở vườn đông`, { kind: `walk`, to: `quanam` }, 1, (e, t) => V(t.quanam)),
  ],
  Bt = oe.map((e, t) =>
    G(`stroll:${e.id}`, `C`, `Đi dạo tới ${e.name}`, { kind: `stroll`, spot: e.id }, 1, (e, n) =>
      V(n.spots) & (1 << t) ? 1 : 0,
    ),
  ),
  Vt = [
    G(`sit3`, `C`, `Ngồi bồ đoàn 3 phút`, { kind: `seat` }, 3, (e, t) => H(t.seatSeconds)),
    G(`que`, `C`, `Gieo quẻ hôm nay`, { kind: `today` }, 1, (e, t) => V(t.que), `today`),
    G(`teaching`, `C`, `Đọc lời dạy hôm nay`, { kind: `today` }, 1, (e, t) => V(t.today), `today`),
    G(`greet`, `C`, `Chắp tay chào mọi người`, { kind: `emote` }, 1, (e, t) => V(t.greet)),
    G(`listen3`, `C`, `Nghe niệm Phật 3 phút`, { kind: `listen` }, 3, (e, t) => H(t.listenSeconds)),
  ],
  Ht = G(`sweep`, `C`, `Quét một lượt lá đa (36 lá)`, { kind: `sweep` }, 1, (e, t) => V(t.sweep), `sweep`),
  Ut = G(
    `mindful`,
    `C`,
    `Thiền hành 3 phút`,
    { kind: `mindful` },
    3,
    (e, t) => H(t.mindfulSeconds),
    `mindful`,
  ),
  Wt = G(`loc`, `C`, `Hái lộc dưới cây bồ đề`, { kind: `bodhi` }, 1, (e, t) => V(t.loc), `loc`),
  Gt = [
    G(`ret:greet`, `A`, `Chắp tay một lần`, { kind: `emote` }, 1, (e, t) => V(t.greet)),
    G(`ret:incense`, `B`, `Dâng một nén hương`, { kind: `walk`, to: `incense` }, 1, (e, t) => V(t.incense)),
    G(`ret:sit1`, `C`, `Ngồi tĩnh 1 phút`, { kind: `seat` }, 1, (e, t) => H(t.seatSeconds)),
  ];
function Kt(e, t, n, r) {
  if (n || e < `2026-11-16`) return !1;
  let i = null;
  for (let n of t) n < e && (i === null || n > i) && (i = n);
  let a = i ?? (r !== null && r < e ? r : null),
    o = W(e),
    s = a === null ? null : W(a);
  return o !== null && s !== null && o - s >= 4;
}
var qt = [
    G(`beads27`, `A`, `Lần 27 hạt`, { kind: `route`, route: `beads` }, 27, (e) => V(e.chants)),
    Rt,
    G(`bow1`, `C`, `Lạy Phật một lạy`, { kind: `walk`, to: `altar` }, 1, (e) => V(e.bows)),
  ],
  Jt = [0, 2, 1],
  Yt = [0, 3, 5, 1, 6, 2, 4],
  Xt = [5, 1, 0, 2, 4, 3],
  Zt = `2026-11-05`,
  Qt = [6, 5, 1, 0, 2, 4, 3],
  $t = `2026-11-12`,
  en = [6, 5, 1, 7, 0, 2, 4, 3],
  tn = `2026-11-20`,
  nn = [6, 5, 1, 7, 0, 2, 4, 3, 8],
  rn = [2, 5, 0, 3, 1, 4],
  an = Vt.length,
  on = an + 1,
  sn = on + 1,
  cn = sn + 1,
  ln = Ft(Zt),
  un = Ft($t),
  dn = Ft(tn);
function fn(e, t, n) {
  let r = 0;
  for (let i = t; i < n; i += 1) e[It(i, e.length)] === an && (r += 1);
  return r;
}
var pn = Math.ceil(ln / Xt.length),
  mn = pn + fn(Qt, ln, un),
  hn = mn + fn(en, un, dn);
function gn(e) {
  if (W(e) === null) return null;
  let [t, n, r] = e.split(`-`).map(Number),
    i = { year: t ?? 0, month: n ?? 0, day: r ?? 0 };
  try {
    return A(i);
  } catch {
    return null;
  }
}
function _n(e, t, n = !1) {
  let r = gn(e),
    i = n ? { beginner: t, returning: n, tags: [] } : { beginner: t, tags: [] };
  if (!r) return i;
  let a = k(r),
    o = a.find((e) => e.kind === `le`)?.label;
  return ((i.tags = a.map((e) => e.kind)), o !== void 0 && (i.festival = o), i);
}
function vn(e) {
  return e.replace(/^Ngày\s+/u, ``);
}
function yn(e) {
  return G(
    `festival:lantern`,
    `B`,
    `Thả một hoa đăng ngày ${vn(e)}`,
    { kind: `walk`, to: `pond` },
    1,
    (e, t) => V(t.lantern),
    `lantern`,
  );
}
function bn(e) {
  return G(`lunar:incense`, `B`, `Thắp một nén hương ngày ${e}`, { kind: `walk`, to: `incense` }, 1, (e, t) =>
    V(t.incense),
  );
}
function xn(e, t) {
  return e.feature === `loc` && !_.wishTree
    ? !1
    : e.feature === void 0 || w(e.feature, t, { all: t === null });
}
function Sn(e, t, n, r) {
  let i = e.filter((e) => xn(n(e), r)),
    a = i.length > 0 ? i : e;
  return n(a[It(t, a.length)] ?? 0);
}
function Cn(e, t) {
  return Sn(Jt, e, (e) => Lt[e], t);
}
function wn(e, t, n) {
  if (t.festival !== void 0) {
    let e = yn(t.festival);
    if (xn(e, n)) return e;
  }
  return t.tags.includes(`ram`)
    ? bn(`rằm`)
    : t.tags.includes(`mung-mot`)
      ? bn(`mùng một`)
      : Sn(Yt, e, (e) => zt[e], n);
}
function Tn(e, t) {
  if (e === ln) return Ht;
  let n = e >= dn,
    r = e >= un,
    i = e >= ln,
    a = n ? nn : r ? en : i ? Qt : Xt,
    o = a.length,
    s =
      Bt[
        rn[
          It(
            n
              ? hn + Math.floor((e - dn) / o)
              : r
                ? mn + Math.floor((e - un) / o)
                : i
                  ? pn + Math.floor((e - ln) / o)
                  : Math.floor(e / o),
            rn.length,
          )
        ] ?? 0
      ];
  return Sn(a, e, (e) => (e === on ? Ht : e === sn ? Ut : e === cn ? Wt : e === an ? s : Vt[e]), t);
}
function En(e, t, n = null) {
  if (t.beginner) return qt;
  if (t.returning === !0) return Gt;
  let r = Ft(e);
  return [Cn(r, n), wn(r, t, n), Tn(r, n)];
}
function Dn(e, t, n) {
  return e.map((e) => {
    let r = e.progress(t, n);
    return { def: e, done: r >= e.goal, current: Math.min(r, e.goal) };
  });
}
function On(e) {
  let t = e.filter((e) => e.done).length;
  return t * 30 + (t >= 3 ? 30 : 0);
}
var kn = {
  "lunar:incense": `incense`,
  "festival:lantern": `lantern`,
  bow1: `bow3`,
  beads27: `beadRound`,
  "ret:greet": `greet`,
  "ret:incense": `incense`,
  "ret:sit1": `sit3`,
};
function An(e) {
  return e.guide.kind === `stroll` ? `stroll` : (kn[e.id] ?? e.id);
}
function jn(e) {
  let t = Bt[rn[It(e, rn.length)] ?? 0];
  return [...Lt, ...zt, ...Vt, Ht, t];
}
function Mn(e) {
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
var Nn = 1585103070;
function Pn(e, t, n = null) {
  let r = Ft(e),
    i = new Set(En(e, t, n).map(An)),
    a = jn(r).filter((e) => xn(e, n) && !i.has(An(e))),
    o = Mn(Math.imul(r, 2654435761) ^ Nn);
  for (let e = a.length - 1; e > 0; --e) {
    let t = Math.floor(o() * (e + 1));
    [a[e], a[t]] = [a[t], a[e]];
  }
  return a.slice(0, 3);
}
function Fn(e, t) {
  return e.length === 0 || !e.every((e) => e.done) ? 0 : Math.min(3, t.filter((e) => e.done).length) * 10;
}
var In = /^\d{4}-\d{2}-\d{2}$/,
  Ln = [
    ...oe.map((e) => ({ id: `an:${e.id}`, name: e.name })),
    { id: `an:loc`, name: `Hái lộc` },
    { id: `an:ribbon`, name: `Treo nguyện` },
    { id: `an:release`, name: `Phóng sinh` },
    { id: `an:lantern`, name: `Thả đèn hoa đăng` },
    { id: `an:bells`, name: `Thỉnh chuông` },
  ],
  Rn = new Set(Ln.map((e) => e.id)),
  zn = (e) => `an:${e}`;
function Bn(e) {
  let t = e.slice(3);
  return e.startsWith(`an:`) && In.test(t) && W(t) !== null ? t : null;
}
function Vn(e) {
  return Rn.has(e) || Bn(e) !== null;
}
var Hn = new Map();
function Un(e) {
  let t = Hn.get(e);
  if (t !== void 0) return t;
  let n = gn(e),
    r = n ? k(n) : [],
    i = r.find((e) => e.kind === `le`),
    a = i
      ? i.label
      : r.some((e) => e.kind === `ram`)
        ? `Rằm tháng ${Gn(n?.month ?? 0)}`
        : r.some((e) => e.kind === `mung-mot`)
          ? `Mùng một tháng ${Gn(n?.month ?? 0)}`
          : null;
  return (Hn.size > 2048 && Hn.clear(), Hn.set(e, a), a);
}
var Wn = [`Giêng`, `Hai`, `Ba`, `Tư`, `Năm`, `Sáu`, `Bảy`, `Tám`, `Chín`, `Mười`, `Mười một`, `Chạp`];
function Gn(e) {
  return Wn[e - 1] ?? String(e);
}
function Kn(e, t, n) {
  let r = [];
  return (
    oe.forEach((t, n) => {
      V(e) & (1 << n) && r.push(`an:${t.id}`);
    }),
    V(t.loc) > 0 && r.push(`an:loc`),
    V(t.ribbon) > 0 && r.push(`an:ribbon`),
    V(t.release) > 0 && r.push(`an:release`),
    V(t.lantern) > 0 && r.push(`an:lantern`),
    V(n.bells) > 0 && r.push(`an:bells`),
    r
  );
}
function qn(...e) {
  let t = new Set();
  for (let n of e) for (let e of n) Vn(e) && t.add(e);
  let n = Ln.map((e) => e.id).filter((e) => t.has(e)),
    r = [...t].filter((e) => !Rn.has(e)).sort();
  return [...n, ...r.slice(Math.max(0, r.length - (128 - n.length)))];
}
function Jn(e) {
  return e.replace(/\s*\([^)]*\)$/u, ``);
}
function Yn(e) {
  let t = W(e);
  if (t === null) return null;
  for (let e = 0; e <= 30; e += 1) {
    let n = gn(At(t + e));
    if (!n) return null;
    let r = k(n);
    if (r.length === 0) continue;
    let i = r.find((e) => e.kind === `le`),
      a = r.some((e) => e.kind === `ram`);
    if (e === 0) return i ? i.label : a ? `Hôm nay là ngày rằm` : `Hôm nay là mùng một`;
    let o = i ? Jn(i.label) : a ? `Rằm` : `Mùng một`;
    return e === 1 ? `Ngày mai là ${i ? o : o.toLowerCase()}` : `${o} sau ${e} ngày`;
  }
  return null;
}
function K(e, t, n, r, i) {
  return { id: e, title: t, xp: n, goal: r, progress: i };
}
var Xn = { 7: `Bảy dấu ấn hành hương`, 21: `Hai mươi mốt dấu ấn`, 49: `Bốn mươi chín dấu ấn` },
  Zn = [
    K(`first:bow`, `Lạy Phật lần đầu`, 20, 1, (e) => V(e.store.bows)),
    K(`first:offering`, `Dâng hương, hoa hoặc nến lần đầu`, 20, 1, (e) =>
      Math.max(V(e.store.offerings), V(e.events.incense) + V(e.events.flowers) + V(e.events.candle)),
    ),
    K(`first:lantern`, `Thả đèn hoa đăng lần đầu`, 20, 1, (e) => V(e.events.lantern)),
    K(`first:beads`, `Trọn vòng tràng hạt đầu tiên`, 30, 1, (e) => V(e.store.beadRounds)),
    K(`first:sutra`, `Tụng xong bài kinh đầu tiên`, 30, 1, (e) => V(e.store.sutras)),
    K(`first:meditate`, `Thiền đủ 5 phút`, 30, 5, (e) => H(e.store.meditationSeconds)),
    K(`first:sweep`, `Quét xong lượt lá đa đầu tiên`, 20, 1, (e) => V(e.events.sweep)),
    K(`first:community`, `Dự công phu chung lần đầu`, 50, 1, (e) => e.communityDays),
    K(`all:spots`, `Đi hết sáu điểm trong chùa`, 50, oe.length, (e) => St(V(e.spots) & de)),
    K(`first:lunar`, `Công phu đầu tiên vào mùng một hoặc rằm`, 30, 1, (e) => e.lunarPracticeDays),
    K(`total:bows`, `1.080 lạy`, 200, 1080, (e) => V(e.store.bows)),
    K(`total:beads`, `108 vòng tràng hạt`, 200, 108, (e) => V(e.store.beadRounds)),
    K(`total:sutras`, `108 bài kinh`, 300, 108, (e) => V(e.store.sutras)),
    K(`first:sweepDay`, `Quét đủ 108 lá đa trong một ngày`, 50, 1, (e) => V(e.events.sweepDay)),
    K(`total:sweep`, `108 lượt quét lá đa`, 200, 108, (e) => V(e.events.sweep)),
    K(`total:meditate`, `1.000 phút thiền`, 300, 1e3, (e) => H(e.store.meditationSeconds)),
    ...Et.map((e) =>
      K(`stamps:${e.stamps}`, Xn[e.stamps] ?? `${e.stamps} dấu ấn`, e.xp, e.stamps, (e) => V(e.stamps)),
    ),
  ];
function Qn(e) {
  return `streak:${e}`;
}
function $n(e) {
  return `ref:${e}`;
}
var er = `kol:video`,
  tr = `fb:fanpage`,
  nr = { friends: 0, kol: !1, fanpage: !1 };
function rr(e, t, n = !1) {
  return [
    ...xt.map((t) =>
      K(
        $n(t.friends),
        t.friends === 1 ? `Rủ được người bạn đầu tiên vào chùa` : `Rủ được ${t.friends} bạn vào chùa`,
        t.xp,
        t.friends,
        () => e,
      ),
    ),
    K(er, `Video về Chùa Sen được duyệt`, 500, 1, () => +!!t),
    K(tr, `Theo dõi fanpage Chùa Sen`, 30, 1, () => +!!n),
  ];
}
function ir(e) {
  return { friends: V(e?.friends), kol: e?.kol === !0, fanpage: e?.fanpage === !0 };
}
var ar = new Map([
    ...Zn.map((e) => [e.id, e.xp]),
    ...bt.map((e) => [Qn(e.days), e.xp]),
    ...rr(0, !1).map((e) => [e.id, e.xp]),
  ]),
  or = new Set(rr(0, !1).map((e) => e.id));
function sr(e) {
  return or.has(e);
}
var cr = new Map();
function lr(e) {
  let t = cr.get(e);
  if (t !== void 0) return t;
  let n = gn(e),
    r = n !== null && (n.day === 1 || n.day === 15);
  return (cr.set(e, r), r);
}
function ur(e, t, n, r) {
  let i = new Map();
  for (let e of n) i.set(e.date, e);
  let a = 0,
    o = 0,
    s = [],
    c = (e, t, n) => {
      let r = jt(t, n);
      (r && lr(e) && (a += 1),
        r && Un(e) !== null && s.push(zn(e)),
        V(n?.communitySeconds) >= 600 && (o += 1));
    };
  for (let [e, n] of i) e !== r.day && c(e, n, t.days[e]);
  for (let [e, n] of Object.entries(t.days)) e !== r.day && !i.has(e) && c(e, null, n);
  c(r.day, r.store, r.ev);
  let l = V(t.spots) | V(r.ev.spots),
    u = qn(t.keep, Kn(l, t.life, e), s);
  return {
    store: e,
    events: t.life,
    spots: l,
    lunarPracticeDays: a,
    communityDays: o,
    stamps: u.length,
    stampIds: u,
  };
}
function dr(e, t, n, r = nr) {
  let i = [];
  for (let t of Zn) n[t.id] === void 0 && t.progress(e) >= t.goal && i.push(t.id);
  let a = V(t);
  for (let e of bt) {
    let t = Qn(e.days);
    n[t] === void 0 && a >= e.days && i.push(t);
  }
  let { friends: o, kol: s, fanpage: c } = ir(r);
  for (let t of rr(o, s, c)) n[t.id] === void 0 && t.progress(e) >= t.goal && i.push(t.id);
  return i;
}
function fr(e) {
  let t = 0;
  for (let n of Object.keys(e)) t += ar.get(n) ?? 0;
  return t;
}
function pr(e, t) {
  return Zn.map((n) => {
    let r = n.progress(e),
      i = t[n.id] !== void 0 || r >= n.goal;
    return { def: n, done: i, current: i ? n.goal : Math.min(r, n.goal) };
  });
}
var mr = {
  store: { chants: 0, beadRounds: 0, bows: 0, offerings: 0, bells: 0, sutras: 0, meditationSeconds: 0 },
  events: {},
  spots: 0,
  lunarPracticeDays: 0,
  communityDays: 0,
  stamps: 0,
  stampIds: [],
};
function hr(e, t) {
  let { friends: n, kol: r, fanpage: i } = ir(e),
    a = rr(n, r, i).map((e) => {
      let n = e.progress(mr),
        r = t[e.id] !== void 0 || n >= e.goal;
      return { def: e, done: r, current: r ? e.goal : Math.min(n, e.goal) };
    }),
    o = a.pop();
  return { friends: n, kol: r, referrals: a, video: a.pop(), fanpage: o };
}
function gr(e, t) {
  let n = V(e);
  return bt.map((e) => {
    let r = Qn(e.days),
      i = K(r, `Chuỗi ${e.days} ngày`, e.xp, e.days, () => n),
      a = t[r] !== void 0 || n >= e.days;
    return { def: i, done: a, current: a ? e.days : Math.min(n, e.days) };
  });
}
function _r(e) {
  let t = gn(e);
  return t !== null && !t.leap && t.month === 7 && t.day === 15;
}
function vr(e, t) {
  let { life: n } = t;
  switch (e.kind) {
    case `incenseDays`:
      return V(t.incenseDays);
    case `beadRounds`:
      return V(n.store.beadRounds);
    case `sweeps`:
      return V(n.events.sweep);
    case `meditationMinutes`:
      return H(n.store.meditationSeconds);
    case `stamps`:
      return V(n.stamps);
    case `vuLan`:
      return +!!n.stampIds.some((e) => {
        let t = Bn(e);
        return t !== null && _r(t);
      });
    case `tier`:
      return V(t.tier);
    case `bestStreak`:
      return V(t.bestStreak);
  }
}
function yr(e, t) {
  return ae.map((n) => {
    let r = n.needs.goal,
      i = vr(n.needs, e),
      a = t.includes(n.id) || i >= r;
    return { def: n, goal: r, earned: a, current: a ? r : Math.min(i, r) };
  });
}
var br = W(`2026-01-01`) ?? 0;
function xr(e, t) {
  return ((e % t) + t) % t;
}
function Sr(e) {
  let t = W(e);
  return t === null ? 0 : t - br;
}
function Cr(e) {
  return Math.floor((Sr(e) + 3) / 7);
}
function wr(e) {
  return At(br - 3 + e * 7);
}
function Tr(e) {
  let t = br - 3 + e * 7;
  return Array.from({ length: 7 }, (e, n) => At(t + n));
}
var Er = Cr(Dt);
function Dr(e) {
  return e >= Er;
}
var Or = (e, t) => e.reduce((e, n) => e + t(n), 0),
  kr = (e, t) => e.filter(t).length;
function q(e, t, n, r, i, a) {
  return a
    ? { id: e, slot: t, title: n, goal: r, progress: i, feature: a }
    : { id: e, slot: t, title: n, goal: r, progress: i };
}
var Ar = [
    q(`w:beads7`, `WA`, `Lần 7 vòng tràng hạt`, 7, (e) => Or(e, (e) => V(e.store?.beadRounds))),
    q(`w:sutras5`, `WA`, `Tụng trọn 5 bài kinh`, 5, (e) => Or(e, (e) => V(e.store?.sutras))),
    q(`w:meditate60`, `WA`, `Thiền đủ 60 phút`, 60, (e) => H(Or(e, (e) => V(e.store?.meditationSeconds)))),
  ],
  jr = [
    q(`w:days4`, `WB`, `Lên chùa 4 ngày khác nhau`, 4, (e) => kr(e, (e) => V(e.ev?.visit) > 0)),
    q(`w:spots3`, `WB`, `Dạo 3 điểm khác nhau`, 3, (e) => St(e.reduce((e, t) => e | V(t.ev?.spots), 0))),
    q(`w:community2`, `WB`, `Dự công phu chung 2 lần`, 2, (e) =>
      kr(e, (e) => V(e.ev?.communitySeconds) >= 600),
    ),
  ],
  Mr = [
    q(`w:incense3`, `WC`, `Dâng hương vào 3 ngày`, 3, (e) => kr(e, (e) => V(e.ev?.incense) > 0)),
    q(`w:sweep5`, `WC`, `Quét lá đa 5 lượt`, 5, (e) => Or(e, (e) => V(e.ev?.sweep))),
    q(`w:lantern2`, `WC`, `Thả đèn hoa đăng 2 lần`, 2, (e) => Or(e, (e) => V(e.ev?.lantern)), `lantern`),
  ],
  Nr = [1, 0, 2],
  Pr = [2, 1, 0],
  Fr = [1, 0, 2];
function Ir(e, t) {
  return e.feature === void 0 || w(e.feature, t, { all: t === null });
}
function Lr(e, t, n, r) {
  let i = e.filter((e) => Ir(n[e], r)),
    a = i.length > 0 ? i : e;
  return n[a[xr(t, a.length)] ?? 0];
}
function Rr(e, t = null) {
  return Dr(e) ? [Lr(Nr, e, Ar, t), Lr(Pr, e, jr, t), Lr(Fr, e, Mr, t)] : [];
}
function zr(e, t, n) {
  let r = n.filter((e) => Cr(e.day) === t);
  return e.map((e) => {
    let t = e.progress(r);
    return { def: e, done: t >= e.goal, current: Math.min(t, e.goal) };
  });
}
function Br(e) {
  let t = 0;
  return (
    e.forEach((e, n) => {
      e.done && (t |= 1 << n);
    }),
    t
  );
}
var Vr = 7;
function Hr(e) {
  let t = St(e & Vr);
  return t * 30 + (t >= 3 ? 30 : 0);
}
function Ur(e, t) {
  let n = 0;
  for (let [r, i] of Object.entries(e)) {
    let e = Number(r);
    Dr(e) && ((t !== void 0 && e > t + 1) || (n += Hr(i)));
  }
  return n;
}
function Wr(e, t, n, r) {
  for (let r of Tr(e)) {
    if (r > n) break;
    let e = t[r];
    if (e !== void 0) return e > 0 ? e : null;
  }
  return r;
}
var Gr = 864e5;
function Kr(e) {
  return typeof structuredClone == `function` ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
var qr = { chants: 0, beadRounds: 0, bows: 0, offerings: 0, bells: 0, sutras: 0, meditationSeconds: 0 };
function Jr(e, t) {
  let [n, r, i] = e.split(`-`).map(Number),
    a = new Date(Date.UTC(n, r - 1, i) + t * Gr),
    o = (e, t = 2) => String(e).padStart(t, `0`);
  return `${o(a.getUTCFullYear(), 4)}-${o(a.getUTCMonth() + 1)}-${o(a.getUTCDate())}`;
}
function Yr(e) {
  return e <= 0 ? `0` : e <= 2 ? `1-2` : e <= 6 ? `3-6` : e <= 29 ? `7-29` : `30+`;
}
function Xr(e) {
  return e
    ? {
        chants: e.chants,
        beadRounds: e.beadRounds,
        bows: e.bows,
        offerings: e.offerings,
        bells: e.bells,
        sutras: e.sutras,
        meditationSeconds: e.meditationSeconds,
      }
    : null;
}
function Zr(e, t) {
  let n = e.taskLevel[t];
  return n === void 0 ? void 0 : n > 0 ? n : null;
}
function Qr(e, t, n, r) {
  let i = Tt(t, n).total + _t(n) + vt(t, n).total;
  if (r.createdDay !== null && e >= r.createdDay) {
    let a = _n(e, e === r.firstDay, r.ret.includes(e)),
      o = Zr(r, e) ?? null,
      s = t ?? qr,
      c = n ?? {},
      l = Dn(En(e, a, o), s, c);
    ((i += On(l)), l.every((e) => e.done) && (i += Fn(l, Dn(Pn(e, a, o), s, c))));
  }
  return i;
}
function $r(e, t, n) {
  let r = new Set(n),
    i = [];
  for (let n = 6; n >= 0; --n) {
    let a = Jr(e, -n),
      [o, s, c] = a.split(`-`).map(Number),
      l = new Date(Date.UTC(o, s - 1, c)).getUTCDay(),
      u = t.has(a) ? `practiced` : r.has(a) ? `rest` : n === 0 ? `today` : `missed`;
    i.push({ day: a, weekday: l, state: u });
  }
  return i;
}
function ei(e, t) {
  let { referrals: n, video: r, fanpage: i } = t.special,
    a = [...t.milestones, ...n, r, i].find((t) => t.def.id === e)?.def;
  if (a) return { kind: `milestone`, id: e, title: a.title, xp: a.xp };
  let o = /^streak:(\d+)$/.exec(e);
  if (!o) return null;
  let s = Number(o[1]),
    c = bt.find((e) => e.days === s);
  return c ? { kind: `milestone`, id: e, title: `Chuỗi ${s} ngày`, xp: c.xp } : null;
}
function ti(e, t) {
  let n = new Set(e.map((e) => e.id)),
    r = t.special.referrals.filter((e) => n.has(e.def.id)),
    i = r[r.length - 1]?.def,
    a = n.has(t.special.video.def.id),
    o = n.has(t.special.fanpage.def.id),
    s = [];
  return (
    i && s.push(i.goal === 1 ? i.title : `Rủ được ${i.goal} bạn vào chùa`),
    a && s.push(i ? `video về Chùa Sen được duyệt` : t.special.video.def.title),
    o && s.push(s.length > 0 ? `theo dõi fanpage Chùa Sen` : t.special.fanpage.def.title),
    {
      kind: `milestone`,
      id: i?.id ?? (a ? t.special.video.def.id : t.special.fanpage.def.id),
      title: s.length > 1 ? `${s.slice(0, -1).join(`, `)} và ${s.at(-1) ?? ``}` : (s[0] ?? ``),
      xp: e.reduce((e, t) => e + t.xp, 0),
    }
  );
}
function ni(e, t, n, r, i, a = []) {
  let o = e.seen,
    s = t.today,
    c = n >= 200 && t.practiceMoreToday >= t.practiceMoreCeiling,
    l = !1,
    u = () => {
      let e = 0;
      return (
        t.tasks.forEach((t, n) => {
          t.done && (e |= 1 << n);
        }),
        e
      );
    };
  if (!o.backfill) {
    ((o.backfill = !0),
      t.level >= 2 &&
        (r.push({
          kind: `levelUp`,
          level: t.level,
          from: o.level,
          tier: t.tier,
          tierChanged: t.tier > 1,
          backfill: !0,
        }),
        i.push([`progress_level_up`, { level: t.level, tier: t.tier, backfill: !0 }])),
      (o.level = Math.max(o.level, t.level)));
    for (let t of Object.keys(e.achieved)) o.milestones.includes(t) || o.milestones.push(t);
    return (
      (o.restDay = t.streak.restUsedOn),
      t.streak.practicedToday && (o.streakDay = s),
      (o.tasks = { day: s, mask: u() }),
      n >= 200 && (o.ceilingDay = s),
      c && (o.ceilingMoreDay = s),
      (o.stamps = t.stamps.length),
      (o.titles = t.titles.filter((e) => e.earned).map((e) => e.def.id)),
      t.weekly?.allDone && (o.weekAll = t.weekly.index),
      !0
    );
  }
  let d = t.stamps.length;
  if (d !== o.stamps) {
    let e = d - o.stamps;
    ((o.stamps = d),
      (l = !0),
      e === 1
        ? a.push({ kind: `stamp`, text: `Ấn mới: ${ri(t.stamps)}` })
        : e > 1 && a.push({ kind: `stamp`, text: `Sổ hành hương có thêm ${e} dấu ấn` }));
  }
  let f = t.titles.filter((e) => e.earned && !o.titles.includes(e.def.id));
  if (
    (f.length > 0 &&
      ((o.titles = [...o.titles, ...f.map((e) => e.def.id)]),
      (l = !0),
      a.push({ kind: `title`, text: `Danh hiệu mới: ${f.map((e) => e.def.name).join(`, `)}` })),
    t.level > o.level)
  ) {
    let e = se(o.level).id !== t.tier;
    (r.push({ kind: `levelUp`, level: t.level, from: o.level, tier: t.tier, tierChanged: e, backfill: !1 }),
      i.push([`progress_level_up`, { level: t.level, tier: t.tier, backfill: !1 }]),
      (o.level = t.level),
      (l = !0));
  }
  let p = o.tasks.day === s ? o.tasks.mask : 0,
    m = [];
  (t.tasks.forEach((e, t) => {
    e.done && !(p & (1 << t)) && m.push(t);
  }),
    (m.length > 0 || o.tasks.day !== s) && ((o.tasks = { day: s, mask: p | u() }), (l = !0)));
  let h = t.allDone && m.length > 0;
  for (let e of m) {
    let n = t.tasks[e];
    n &&
      (i.push([`progress_task_done`, { task: n.def.id, slot: n.def.slot }]),
      h || r.push({ kind: `task`, taskId: n.def.id, slot: n.def.slot, title: n.def.title }));
  }
  h && (r.push({ kind: `allDone` }), i.push([`progress_tasks_all_done`, void 0]));
  let g = t.weekly;
  g?.allDone && o.weekAll !== g.index && ((o.weekAll = g.index), (l = !0), r.push({ kind: `weekAll` }));
  let _ = t.streak.current;
  if (t.streak.practicedToday && _ > 0 && o.streakDay !== s && ((o.streakDay = s), (l = !0), !t.beginner)) {
    let e = bt.some((e) => e.days === _);
    (r.push({ kind: `streak`, days: _, tierUp: e }),
      i.push([`progress_streak_kept`, { days: _, tier_up: e }]));
  }
  let v = [];
  for (let n of Object.keys(e.achieved)) {
    if (o.milestones.includes(n)) continue;
    (o.milestones.push(n), (l = !0), i.push([`progress_milestone`, { id: n }]));
    let e = ei(n, t);
    e && (sr(n) ? v : r).push(e);
  }
  let y = v.length > 1 ? ti(v, t) : v[0];
  (y && r.push(y),
    n >= 200 && o.ceilingDay !== s
      ? ((o.ceilingDay = s),
        c && (o.ceilingMoreDay = s),
        r.push(c ? { kind: `ceiling`, more: !0 } : { kind: `ceiling` }),
        (l = !0))
      : c &&
        o.ceilingMoreDay !== s &&
        ((o.ceilingMoreDay = s), r.push({ kind: `ceiling`, more: !0 }), (l = !0)));
  let b = t.streak.restUsedOn;
  return (
    b !== null &&
      b !== o.restDay &&
      ((o.restDay = b),
      (l = !0),
      b >= Jr(s, -1) &&
        (r.push({ kind: `restDay`, streak: t.streak.current }),
        i.push([`progress_rest_day_used`, { streak: t.streak.current }]))),
    l
  );
}
function ri(e) {
  let t = e.map(Bn).filter((e) => e !== null),
    n = t[t.length - 1];
  return n === void 0
    ? ([...Ln].reverse().find((t) => e.includes(t.id))?.name ?? `Sổ hành hương`)
    : (Un(n) ?? `một ngày vía`);
}
function ii(e, t, n, r, i) {
  let a = {},
    o = new Set(e),
    s = new Map();
  for (let e of t) {
    let t = Xr(e);
    t && e.date < i && s.set(e.date, t);
  }
  let c = new Set(s.keys());
  for (let e of Object.keys(n.days)) e < i && c.add(e);
  let l = [...c].sort();
  l.push(i);
  let u = { ...qr },
    d = {},
    f = 0,
    p = [],
    m = {},
    h = new Set();
  for (let e of l) {
    let t = e === i ? r : (s.get(e) ?? null),
      c = n.days[e] ?? {};
    if (t) for (let e of Object.keys(u)) u[e] += t[e];
    for (let [e, t] of Object.entries(c)) {
      if (e === `spots` || typeof t != `number`) continue;
      let n = e;
      d[n] = (d[n] ?? 0) + t;
    }
    ((f |= c.spots ?? 0), jt(t, c) && h.add(e));
    let l = ur({ ...u }, { ...n, days: m, life: { ...d }, spots: f, keep: [] }, p, {
        store: t ?? qr,
        ev: c,
        day: e,
      }),
      g = h.size > 0 ? Nt(h, e, 0).best : 0;
    for (let t of [...o]) {
      let n = Zn.find((e) => e.id === t),
        r = /^streak:(\d+)$/.exec(t);
      (n ? n.progress(l) >= n.goal : r !== null && g >= Number(r[1])) && ((a[t] = e), o.delete(t));
    }
    if (o.size === 0) break;
    (t && e !== i && p.push({ date: e, ...t }), (m[e] = c));
  }
  let g = l[0] ?? i;
  for (let e of o) a[e] = g;
  return a;
}
function ai(e, t, n, r, i) {
  let a = Cr(e);
  if (!Dr(a)) return null;
  let o = zr(Rr(a, Wr(a, t.taskLevel, e, i)), a, [...n.weekRecords, r]),
    s = Br(o),
    c = (s | (t.wk[a] ?? 0)) & Vr,
    l = o.map((e, t) => (c & (1 << t) && !e.done ? { ...e, done: !0, current: e.def.goal } : e)),
    u = St(c);
  return {
    live: s,
    state: {
      index: a,
      start: wr(a),
      tasks: l,
      done: u,
      allDone: u >= l.length && l.length > 0,
      fresh: c === 0 && l.every((e) => e.current === 0),
      xp: Hr(c),
    },
  };
}
function oi(e) {
  let { store: t, counters: n } = e,
    r = e.now ?? Date.now,
    i = e.visible ?? (() => typeof document > `u` || document.visibilityState === `visible`),
    a =
      e.locks === void 0
        ? typeof navigator < `u` && `locks` in navigator
          ? navigator.locks
          : null
        : e.locks,
    o = e.track ?? (() => void 0),
    s = e.registerProps ?? (() => void 0),
    c = e.coalesceMs ?? 120,
    l = e.taskLevel ?? (() => null),
    u = () => {
      try {
        return e.special?.() ?? nr;
      } catch (e) {
        return (console.error(`Hành trình: không đọc được trạng thái rủ bạn / KOL`, e), nr);
      }
    },
    d = new Set(),
    f = new Set(),
    p = [],
    m = [],
    h = null,
    g = null,
    _ = !1,
    v = !1,
    y = null,
    b = null,
    x = !1,
    S = ``,
    C = !1,
    w = (e) => {
      if (e.length !== 0) {
        p.push(...e);
        for (let e of f) e();
      }
    },
    T = (e) => {
      let r = t.history();
      n.update((t) => {
        if (t.createdDay !== null) return;
        let n = Jr(e, -1),
          i = new Set();
        for (let t of r) t.date < e && i.add(t.date);
        for (let n of Object.keys(t.days)) n < e && i.add(n);
        let a = new Map(r.map((e) => [e.date, Xr(e)])),
          o = 0;
        for (let e of i) o += Qr(e, a.get(e) ?? null, t.days[e] ?? null, t);
        ((t.frozen = { xp: t.frozen.xp + o, through: n }),
          (t.createdDay = e),
          (t.firstDay = i.size > 0 ? null : e));
      });
    },
    E = (e) => {
      let r = t.history(),
        i = new Map(r.map((e) => [e.date, Xr(e)]));
      n.update((t) => {
        let n = t.frozen.through,
          a = Jr(e, -1);
        if (n !== null && n >= a) return;
        let o = new Set();
        for (let t of r) (n === null || t.date > n) && t.date < e && o.add(t.date);
        for (let r of Object.keys(t.days)) (n === null || r > n) && r < e && o.add(r);
        let s = 0;
        for (let e of o) s += Qr(e, i.get(e) ?? null, t.days[e] ?? null, t);
        t.frozen = { xp: t.frozen.xp + s, through: a };
        let c = Jr(e, -400);
        for (let e of Object.keys(t.days)) e < c && delete t.days[e];
        for (let e of Object.keys(t.taskLevel)) e < c && delete t.taskLevel[e];
        t.ret = t.ret.filter((e) => e >= c);
      });
    },
    D = (e) => {
      if (x) return;
      let t = n.read(),
        r = Jr(e, -1);
      (t.frozen.through !== null && t.frozen.through >= r) ||
        (a
          ? ((x = !0),
            a
              .request(`chua-progress-fold`, () => {
                C || E(e);
              })
              .catch(() => {
                C || E(e);
              })
              .finally(() => {
                ((x = !1), C || M(0));
              }))
          : E(e));
    },
    O = (e, n) => {
      let r = t.history(),
        i = r.length > 0 ? r[r.length - 1].date : ``,
        a = Object.keys(n.days),
        o = `${e}|${n.frozen.through ?? ``}|${r.length}|${i}|${a.length}`;
      if (g && g.sig === o) return g;
      let s = new Map();
      for (let t of r) {
        let n = Xr(t);
        n && t.date < e && s.set(t.date, n);
      }
      let c = new Set(s.keys());
      for (let t of a) t < e && c.add(t);
      let l = n.frozen.through,
        u = 0,
        d = [],
        f = new Set(),
        p = Cr(e),
        m = new Map();
      for (let e of c) {
        let t = s.get(e) ?? null,
          r = n.days[e] ?? null;
        (jt(t, r) && f.add(e), (l === null || e > l) && (d.push(e), (u += Qr(e, t, r, n))));
        let i = Cr(e);
        if (Dr(i) && i <= p) {
          let n = m.get(i) ?? [];
          (n.push({ day: e, store: t, ev: r }), m.set(i, n));
        }
      }
      let h = {};
      for (let [t, r] of m) {
        if (t === p) continue;
        let i = Br(zr(Rr(t, Wr(t, n.taskLevel, e, null)), t, r));
        i && (h[t] = i);
      }
      return (
        (g = {
          sig: o,
          history: r,
          historyByDay: s,
          unfoldedXp: u,
          unfoldedDays: d,
          practiced: f,
          weekRecords: m.get(p) ?? [],
          pastWeeks: h,
        }),
        g
      );
    },
    k = () => {
      let e = n.dayKey(),
        r = n.readOnly(),
        a = n.read();
      (!r && a.createdDay === null && (T(e), (a = n.read())), r || D(e));
      let o = O(e, a),
        s = Xr(t.today()) ?? qr,
        c = a.days[e] ?? {},
        d = Tt(s, c),
        f = a.firstDay !== null && a.firstDay === e,
        p = Zr(a, e),
        m = p === void 0 ? (r || a.view.day === e ? null : l()) : p,
        h =
          p === void 0
            ? !r && a.view.day !== e && Kt(e, o.practiced, f, a.firstDay ?? a.createdDay)
            : a.ret.includes(e),
        g = _n(e, f, h),
        _ = Dn(En(e, g, m), s, c),
        v = On(_),
        y = _.filter((e) => e.done).length,
        b = _.length > 0 && y === _.length,
        x = b ? Dn(Pn(e, g, m), s, c) : [],
        S = Fn(_, x),
        C = new Set(o.practiced);
      jt(s, c) && C.add(e);
      let w = Nt(C, e, a.best.streak),
        E = ur(t.totals(), a, o.history, { store: s, ev: c, day: e }),
        k = u(),
        j = r ? [] : dr(E, w.best, a.achieved, k),
        M = j.filter((e) => !sr(e)),
        N = M.length > 0 && !a.seen.backfill ? ii(M, o.history, a, s, e) : {},
        P = { ...a.achieved };
      for (let t of j) P[t] = N[t] ?? e;
      let F = pr(E, P),
        ne = hr(k, P),
        re = {},
        ie = (e) => a.wk[e] ?? 0;
      if (!r) for (let [e, t] of Object.entries(o.pastWeeks)) t & ~ie(e) && (re[e] = t | ie(e));
      let I = ai(e, a, o, { day: e, store: s, ev: c }, m);
      I && !r && I.live & ~ie(I.state.index) && (re[I.state.index] = I.live | ie(I.state.index));
      let ae = { ...a.wk, ...re },
        oe = new Set(a.keep),
        se = r ? [] : E.stampIds.filter((e) => !oe.has(e)),
        ce = vt(s, c),
        L = a.frozen.xp + o.unfoldedXp + d.total + _t(c) + ce.total + v + S + Ur(ae, Cr(e)) + fr(P),
        R = Ue(L),
        le = 0;
      for (let [t, n] of Object.entries(a.days)) t !== e && (n.incense ?? 0) > 0 && (le += 1);
      (c.incense ?? 0) > 0 && (le += 1);
      let ue = yr({ life: E, incenseDays: le, tier: R.tier.id, bestStreak: w.best }, a.dh),
        de = r ? [] : ue.filter((e) => e.earned && !a.dh.includes(e.def.id)).map((e) => e.def.id),
        fe = a.title !== null && ue.some((e) => e.earned && e.def.id === a.title) ? a.title : null,
        z = {
          level: R.level,
          frac: Math.round(R.frac * 1e3) / 1e3,
          tier: R.tier.id,
          remaining: R.remaining,
          streak: w.current,
          best: w.best,
          lit: w.practicedToday,
          tasksDone: y,
          day: e,
        },
        pe = {
          today: e,
          xp: L,
          level: R.level,
          tier: R.tier.id,
          tierName: R.tier.name,
          into: R.into,
          span: R.span,
          remaining: R.remaining,
          frac: R.frac,
          practiceToday: d.total,
          practiceCeiling: 200,
          practiceMoreToday: ce.total,
          practiceMoreCeiling: 150,
          taskXpToday: v,
          tasks: _,
          tasksDone: y,
          allDone: b,
          extras: x,
          special: ne,
          streak: w,
          week: $r(e, C, w.restDays),
          milestones: F,
          unlockedTier: R.tier.id,
          equip: a.equip,
          readOnly: r,
          beginner: f,
          returning: h,
          weekly: I?.state ?? null,
          stamps: E.stampIds,
          occasion: Yn(e),
          titles: ue,
          title: fe,
        };
      return (
        r ||
          (ee(
            a,
            z,
            j,
            N,
            w.best,
            p === void 0 ? { level: m, returning: h } : void 0,
            re,
            I?.state.index ?? null,
            se,
            de,
          ),
          i() && A(pe, d.uncapped)),
        te(pe),
        pe
      );
    },
    ee = (e, t, r, i, a, s, c, l, u, d) => {
      let f = e.view,
        p =
          f.level !== t.level ||
          f.frac !== t.frac ||
          f.tier !== t.tier ||
          f.remaining !== t.remaining ||
          f.streak !== t.streak ||
          f.best !== t.best ||
          f.lit !== t.lit ||
          f.tasksDone !== t.tasksDone ||
          f.day !== t.day,
        m = t.day,
        h = s !== void 0 && m !== null ? { day: m, level: s.level ?? 0, returning: s.returning } : null,
        g = Object.keys(c);
      if (
        !p &&
        r.length === 0 &&
        a <= e.best.streak &&
        !h &&
        g.length === 0 &&
        u.length === 0 &&
        d.length === 0
      )
        return;
      let _ = [],
        v = [],
        y = !1;
      n.update((e) => {
        (h &&
          e.taskLevel[h.day] === void 0 &&
          ((e.taskLevel[h.day] = h.level),
          h.returning && !e.ret.includes(h.day) && ((e.ret = [...e.ret, h.day].sort()), (y = !0))),
          (e.view = t));
        for (let n of r) n in e.achieved || (e.achieved[n] = i[n] ?? t.day ?? ``);
        a > e.best.streak && (e.best = { streak: a });
        for (let t of d) e.dh.includes(t) || (e.dh = [...e.dh, t]);
        if (u.length > 0) {
          let t = new Set(e.keep);
          e.keep = qn(e.keep, u);
          for (let n of e.keep) t.has(n) || v.push(Bn(n) === null ? `place` : `day`);
        }
        for (let t of g) {
          let n = e.wk[t] ?? 0,
            r = (n | (c[t] ?? 0)) & Vr;
          r !== n && ((e.wk[t] = r), String(l) === t && _.push(St(r)));
        }
      });
      for (let e of _) o(`week_done`, { slots: e });
      y && o(`return_day`);
      for (let e of v) o(`stamp_new`, { kind: e });
    },
    A = (e, t) => {
      if (!ni(Kr(n.read()), e, t, [], [])) return;
      let r = [],
        i = [],
        a = [];
      n.update((n) => {
        ni(n, e, t, r, i, a);
      });
      for (let [e, t] of i) o(e, t);
      if (a.length > 0) {
        m.push(...a);
        for (let e of f) e();
      }
      w(r);
    },
    te = (e) => {
      if (e.readOnly) return;
      let t = { level: e.level, tier: e.tier, streak_bucket: Yr(e.streak.current) },
        n = `${t.level}|${t.tier}|${t.streak_bucket}`;
      n !== S && ((S = n), s(t));
    },
    j = () => {
      if (((y = null), C)) return;
      if (_) {
        v = !0;
        return;
      }
      _ = !0;
      try {
        do ((v = !1), (h = k()));
        while (v && !C);
      } finally {
        _ = !1;
      }
      let e = h;
      for (let t of d) t(e);
    };
  function M(e = c) {
    if (!C) {
      if (_) v = !0;
      else {
        if (y !== null) {
          if (e > 0) return;
          clearTimeout(y);
        }
        y = setTimeout(j, e);
      }
    }
  }
  let N = () => {
      b !== null && clearTimeout(b);
      let e = new Date(r()),
        t = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1, 0, 0, 2).getTime();
      b = setTimeout(
        () => {
          ((b = null), M(0), N());
        },
        Math.max(1e3, t - r()),
      );
    },
    P = t.subscribe(() => M()),
    F = n.onChange(() => M()),
    ne = e.onSpecialChange?.(() => M()) ?? (() => void 0),
    re = () => {
      i() && M(0);
    };
  return (
    typeof document < `u` && document.addEventListener(`visibilitychange`, re),
    N(),
    j(),
    {
      state() {
        return h ?? k();
      },
      subscribe(e) {
        return (d.add(e), () => d.delete(e));
      },
      takeCelebrations() {
        let e = p;
        return ((p = []), e);
      },
      takeNotices() {
        let e = m;
        return ((m = []), e);
      },
      setTitle(e) {
        let t = h ?? k();
        t.readOnly ||
          ((e === null || t.titles.some((t) => t.earned && t.def.id === e)) &&
            e !== t.title &&
            (n.update((t) => {
              (e !== null && !t.dh.includes(e) && (t.dh = [...t.dh, e]), (t.title = e ?? ``));
            }),
            e === null ? o(`title_remove`) : I(e) && o(`title_wear`, { id: e }),
            M(0)));
      },
      onCelebrate(e) {
        return (f.add(e), () => f.delete(e));
      },
      setEquip(e) {
        let t = h?.unlockedTier ?? n.view().tier;
        (n.update((n) => {
          if (e.beads !== void 0) {
            let r = Ne.find((t) => t.id === e.beads);
            r && r.tier <= t && (n.equip = { ...n.equip, beads: r.id });
          }
          if (e.timbre !== void 0) {
            let r = Pe.find((t) => t.id === e.timbre);
            r && r.tier <= t && (n.equip = { ...n.equip, timbre: r.id });
          }
        }),
          M(0));
      },
      markOpened() {
        let e = n.dayKey();
        n.read().seen.openedDay !== e &&
          n.update((t) => {
            t.seen.openedDay = e;
          });
      },
      async askPersist() {
        if (n.read().seen.persistAsked || n.readOnly()) return null;
        let e = typeof navigator < `u` ? navigator.storage : void 0;
        if (!e || typeof e.persist != `function`) return null;
        n.update((e) => {
          e.seen.persistAsked = !0;
        });
        try {
          if (typeof e.persisted == `function` && (await e.persisted())) return !0;
          let t = await e.persist();
          return (o(`progress_persist`, { granted: t }), t);
        } catch {
          return null;
        }
      },
      refresh() {
        (y !== null && clearTimeout(y), j());
      },
      dispose() {
        ((C = !0),
          y !== null && clearTimeout(y),
          b !== null && clearTimeout(b),
          P(),
          F(),
          ne(),
          typeof document < `u` && document.removeEventListener(`visibilitychange`, re),
          d.clear(),
          f.clear(),
          (p = []),
          (m = []));
      },
    }
  );
}
var si = e({
    WK_KEPT: () => 600,
    createProgressStore: () => Ei,
    defaultBlob: () => yi,
    mergeProgressBlobs: () => Ti,
    sanitizeBlob: () => Ci,
  }),
  ci = /^\d{4}-\d{2}-\d{2}$/,
  li = 2147483647,
  ui = 2 ** 53 - 1,
  di = (e, t) => (Number.isFinite(e) && e >= 0 ? Math.min(e, t) : 0),
  fi = (e, t = ui) => Math.floor(di(e, t)),
  pi = (e) => (typeof e == `string` && ci.test(e) ? e : null),
  mi = (e) => (C(e) ? e : {}),
  hi = /^\d{1,6}$/,
  gi = 7,
  _i = new Set([`que`, `sweepDay`, `release`, `loc`, `ribbon`]);
function vi(e, t = !1) {
  let n = mi(e),
    r = {};
  for (let e of ce) {
    let i = fi(n[e], t && _i.has(e) ? 1 : ui);
    i && (r[e] = i);
  }
  let i = t ? fi(n.spots, li) : 0;
  return (i && (r.spots = i), r);
}
function yi(e) {
  return {
    v: 1,
    rules: 1,
    days: {},
    life: {},
    spots: 0,
    frozen: { xp: 0, through: null },
    best: { streak: 0 },
    achieved: {},
    seen: {
      level: 1,
      tasks: { day: null, mask: 0 },
      milestones: [],
      ceilingDay: null,
      ceilingMoreDay: null,
      restDay: null,
      streakDay: null,
      openedDay: null,
      backfill: !1,
      persistAsked: !1,
      stamps: 0,
      titles: [],
      weekAll: 0,
    },
    taskLevel: {},
    wk: {},
    ret: [],
    keep: [],
    dh: [],
    title: null,
    view: { level: 1, frac: 0, tier: 1, remaining: 50, streak: 0, best: 0, lit: !1, tasksDone: 0, day: null },
    equip: { beads: `go-nau`, timbre: `mac-dinh` },
    firstDay: null,
    createdDay: e,
  };
}
var bi = Ne.map((e) => e.id),
  xi = Pe.map((e) => e.id);
function Si(e, t, n) {
  if (typeof t == `number`) return (n === `frac` ? di(e, 1) : fi(e, li)) || t;
  if (t === null) return pi(e);
  if (typeof t == `boolean`) return e === !0;
  if (typeof t == `string`) return (n === `beads` ? bi : xi).includes(e) ? e : t;
  if (Array.isArray(t))
    return (Array.isArray(e) ? e : []).filter((e) => typeof e == `string` && e.length <= 40).slice(0, 200);
  let r = mi(e),
    i = {};
  for (let [e, n] of Object.entries(t)) i[e] = Si(r[e], n, e);
  return i;
}
function Ci(e) {
  if (!C(e)) return null;
  if (typeof e.v == `number` && e.v > 1) return `newer`;
  let t = Si(e, yi(null), ``);
  for (let [n, r] of Object.entries(mi(e.days))) {
    let e = vi(r, !0);
    ci.test(n) && Object.keys(e).length && (t.days[n] = e);
  }
  t.life = vi(e.life);
  for (let [n, r] of Object.entries(mi(e.achieved))) n.length <= 40 && pi(r) && (t.achieved[n] = r);
  for (let [n, r] of Object.entries(mi(e.taskLevel)))
    ci.test(n) && Number.isInteger(r) && r >= 0 && (t.taskLevel[n] = Math.min(r, li));
  for (let [n, r] of Object.entries(mi(e.wk))) {
    let e = Number.isInteger(r) && r > 0 ? r & gi : 0;
    hi.test(n) && e && (t.wk[n] = e);
  }
  let n = Object.keys(t.wk).sort((e, t) => Number(e) - Number(t));
  for (let e of n.slice(0, Math.max(0, n.length - 600))) delete t.wk[e];
  let r = Array.isArray(e.ret) ? e.ret.filter((e) => pi(e) !== null) : [];
  return (
    (t.ret = [...new Set(r)].sort().slice(-120)),
    (t.dh = ae.map((e) => e.id).filter((t) => Array.isArray(e.dh) && e.dh.includes(t))),
    (t.title = e.title === `` ? `` : typeof e.title == `string` && t.dh.includes(e.title) ? e.title : null),
    (t.seen.titles = t.seen.titles.filter(P)),
    (t.keep = qn(Array.isArray(e.keep) ? e.keep.filter((e) => typeof e == `string`) : [])),
    (t.view.tier = Math.min(t.view.tier, 7)),
    (t.view.tasksDone = Math.min(t.view.tasksDone, 3)),
    t
  );
}
function wi(e, t) {
  for (let n of ce) (t[n] ?? 0) > (e[n] ?? 0) && (e[n] = t[n]);
  t.spots && (e.spots = (e.spots ?? 0) | t.spots);
}
function Ti(e, t) {
  let n = Ci(e),
    r = Ci(t);
  (wi(n.life, r.life), (n.spots |= r.spots));
  for (let [e, t] of Object.entries(r.days)) wi((n.days[e] ??= {}), t);
  (r.frozen.xp > n.frozen.xp && (n.frozen = r.frozen),
    (n.best.streak = Math.max(n.best.streak, r.best.streak)));
  for (let [e, t] of Object.entries(r.achieved)) {
    let r = n.achieved[e];
    (!r || t < r) && (n.achieved[e] = t);
  }
  let i = new Set(n.ret);
  for (let e of r.ret) e in n.taskLevel || i.add(e);
  n.ret = [...i].sort().slice(-120);
  for (let [e, t] of Object.entries(r.taskLevel)) n.taskLevel[e] ??= t;
  ((n.dh = ae.map((e) => e.id).filter((e) => n.dh.includes(e) || r.dh.includes(e))),
    (n.title ??= r.title),
    (n.keep = qn(n.keep, r.keep)));
  for (let [e, t] of Object.entries(r.wk)) n.wk[e] = (n.wk[e] ?? 0) | t;
  n.rules = Math.max(n.rules, r.rules);
  let [a, o] = [n.firstDay, r.firstDay];
  return ((n.firstDay = a && o ? (a < o ? a : o) : (a ?? o)), (n.createdDay ??= r.createdDay), n);
}
function Ei(e = le) {
  return {
    ...e,
    read() {
      let t = e.raw();
      return t ? Ci(t) : yi(null);
    },
    readOnly: () => e.raw() === null,
    update(t) {
      return e.edit((e) => {
        let n = Ci(e);
        t(n);
        for (let t of Object.keys(e)) delete e[t];
        Object.assign(e, n);
      });
    },
  };
}
var Di = e({
    chooseFrozen: () => Ri,
    mergeMainBlobs: () => Fi,
    mergeProgressRaw: () => Li,
    mergeRestore: () => zi,
  }),
  Oi = p(null),
  ki = Object.keys(Oi),
  Ai = (e) => ki.reduce((t, n) => t + e[n], 0);
function ji(e, t) {
  let n = { ...e };
  for (let r of ki) n[r] = Math.max(e[r], t[r]);
  return n;
}
function Mi(e) {
  try {
    let t = e ? JSON.parse(e) : null;
    return C(t) ? t : null;
  } catch {
    return null;
  }
}
function Ni(e) {
  let t = {};
  if (!C(e)) return t;
  for (let [n, r] of Object.entries(e)) {
    let e = p(r);
    o(n) && Ai(e) > 0 && (t[n] = e);
  }
  return t;
}
function Pi(e) {
  return !C(e) || !o(e.date) ? null : { date: e.date, counts: p(e) };
}
function Fi(e, t) {
  let n = Mi(e),
    r = Mi(t);
  if (!r) return n ? e : t;
  if (!n || (typeof n.version == `number` && n.version > 1)) return t;
  let i = Ni(n.history);
  for (let [e, t] of Object.entries(Ni(r.history))) i[e] = ji(i[e] ?? Oi, t);
  let [a, o] = [Pi(n.today), Pi(r.today)],
    s = a ?? o;
  if (a && o) {
    if (a.date === o.date) s = { date: a.date, counts: ji(a.counts, o.counts) };
    else {
      let [e, t] = a.date < o.date ? [a, o] : [o, a];
      (Ai(e.counts) > 0 && (i[e.date] = ji(i[e.date] ?? Oi, e.counts)), (s = t));
    }
  }
  let c = ji(p(n.totals), p(r.totals));
  for (let e of ki) {
    let t = Object.values(i).reduce((t, n) => t + n[e], 0);
    c[e] = Math.max(c[e], t + (s?.counts[e] ?? 0));
  }
  return (
    S(i),
    JSON.stringify({ ...r, ...(s && { today: { date: s.date, ...s.counts } }), totals: c, history: i })
  );
}
function Ii(e) {
  try {
    return e ? Ci(JSON.parse(e)) : null;
  } catch {
    return null;
  }
}
function Li(e, t, n, r = m(new Date())) {
  let i = Ii(e),
    a = Ii(t);
  if (i && i !== `newer` && a && a !== `newer`) {
    let e = Ti(i, a);
    return (n !== void 0 && (e.frozen = Ri(e, i, a, n, r)), JSON.stringify(e));
  }
  return i ? e : t;
}
function Ri(e, t, n, r, i) {
  let a = Mi(r),
    o = new Map(Object.entries(Ni(a?.history))),
    s = Pi(a?.today);
  s && s.date < i && o.set(s.date, ji(o.get(s.date) ?? Oi, s.counts));
  let c = new Set([...o.keys(), ...Object.keys(e.days)]),
    l = (t) => {
      let n = t.xp;
      for (let r of c)
        r >= i ||
          (t.through !== null && r <= t.through) ||
          (n += Qr(r, o.get(r) ?? null, e.days[r] ?? null, e));
      return n;
    };
  return l(n.frozen) > l(t.frozen) ? n.frozen : t.frozen;
}
function zi(e, t) {
  let n = { ...t },
    r = Fi(e[l], t[l]);
  r !== void 0 && (n[l] = r);
  let i = Li(e[fe], t[fe], r ?? e[`chua-online:v1`]);
  return (i !== void 0 && (n[fe] = i), n);
}
var Bi = e({
    ESTIMATE_FASTER: () => Gi,
    GUIDE_CALM: () => Vi,
    GUIDE_HIDDEN: () => Wi,
    GUIDE_NO_STATE: () => Ui,
    PRACTICE_FULL: () => _a,
    PRACTICE_MORE_FULL: () => va,
    REWARDS_FAILED: () => Hi,
    estimateDays: () => ta,
    estimateText: () => ra,
    fullDayXp: () => $i,
    guideTitle: () => Zi,
    headOf: () => sa,
    hiddenHeadOf: () => ca,
    hiddenNeedText: () => Xi,
    hiddenWaysHtml: () => Aa,
    isProgressNeed: () => Ji,
    moreText: () => ga,
    needMet: () => aa,
    needText: () => Yi,
    neededLevel: () => qi,
    openLevelGuideSheet: () => Ia,
    opensAt: () => Ma,
    spanText: () => na,
    specialLeft: () => Sa,
    todayTaskXpLeft: () => ea,
    waysHtml: () => ja,
  }),
  Vi = `Không cần vội: tinh tấn ghi lại những lần bạn quay về chùa.`,
  Hi = `Chưa mở được Chương trình KOL, bạn thử lại nhé.`,
  Ui = `Chưa đọc được tiến độ của bạn trên máy này, nhưng cách làm thì vẫn như dưới đây.`,
  Wi = `Bạn đang tắt Hành trình trong Cài đặt. Bật lại để xem tiến độ và việc hôm nay.`,
  Gi = `Công phu thêm (niệm Phật, tụng kinh, thiền) sẽ nhanh hơn.`,
  J = (e) => e.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`),
  Ki = (e) => `<span class="lg-sr">${J(e)}</span>`;
function qi(e) {
  return e.kind === `level` ? Math.max(1, Math.floor(e.level) || 1) : e.kind === `tier` ? R(e.tier) : null;
}
var Ji = (e) => e.kind === `level` || e.kind === `tier` || e.kind === `streak`;
function Yi(e) {
  switch (e.kind) {
    case `level`:
      return `Cần Cấp ${qi(e)}`;
    case `tier`:
      return `Cần ${ue(R(e.tier))}`;
    case `streak`:
      return `Cần giữ lửa ${e.days} ngày`;
    case `referrals`:
      return `Cần rủ ${e.count} bạn vào chùa`;
    case `badge`:
      return e.badge === `kol` ? `Cần danh hiệu KOL Chùa Sen` : `Cần danh hiệu ${e.badge}`;
  }
}
function Xi(e) {
  let t = qi(e);
  return t === null ? (e.kind === `streak` ? `Mở khi giữ lửa ${e.days} ngày` : Yi(e)) : `Mở ở ${ue(t)}`;
}
function Zi(e, t) {
  if (t) return `Cách mở ${t}`;
  let n = qi(e);
  return n === null
    ? e.kind === `streak`
      ? `Cách giữ lửa ${e.days} ngày`
      : e.kind === `referrals`
        ? `Cách rủ bạn vào chùa`
        : `Cách nhận danh hiệu`
    : `Cách lên Cấp ${n}`;
}
var Qi = (e) => gt().find((t) => t.id === e);
function $i() {
  return 120 + (Qi(`visit`)?.maxPerDay ?? 0);
}
function ea(e) {
  return e.tasks.filter((e) => !e.done).length * 30 + (e.allDone ? 0 : 30);
}
function ta(e, t, n = $i()) {
  let r = Math.max(0, Math.ceil(e));
  if (r === 0) return 0;
  let i = Math.max(0, t);
  return i >= r ? 1 : +(i > 0) + Math.ceil((r - i) / Math.max(1, n));
}
function na(e) {
  return e <= 14
    ? `khoảng ${e} ngày`
    : e <= 70
      ? `khoảng ${Math.round(e / 7)} tuần`
      : `khoảng ${Math.round(e / 30)} tháng`;
}
function ra(e, t, n = $i()) {
  let r = ta(e, t, n);
  if (r === 0) return ``;
  if (r === 1 && t > 0) return `Có thể ngay hôm nay, nếu làm nốt việc hôm nay.`;
  if (r === 1) return `Có thể ngay ngày mai, nếu mai làm đủ 3 việc. ${Gi}`;
  let i = na(r);
  return `${i.charAt(0).toUpperCase()}${i.slice(1)} nếu mỗi ngày làm đủ 3 việc hôm nay. ${Gi}`;
}
function ia(e, t) {
  return Math.max(e?.streak.best ?? 0, t.bestStreak ?? 0);
}
function aa(e, t, n) {
  return e.kind === `level`
    ? (t?.level ?? 0) >= (qi(e) ?? 1)
    : Oe(e, { ...n, tier: t?.tier ?? 0, bestStreak: ia(t, n) });
}
var oa = `Đã mở rồi, bạn dùng được ngay.`;
function sa(e, t, n) {
  let r = aa(e, t, n);
  if (e.kind === `level` || e.kind === `tier`) {
    let n = qi(e) ?? 1;
    if (!t) return { status: Ui, bar: null, estimate: `` };
    let i = ue(t.level);
    if (r) return { status: `Bạn đang ở ${i}. ${oa}`, bar: null, estimate: `` };
    let a = Ve(n),
      o = Math.max(0, a - t.xp),
      s = Ve(t.level);
    return {
      status: `Bạn đang ở ${i}. Còn ${o} tinh tấn nữa tới Cấp ${n}.`,
      bar: { now: t.xp - s, max: a - s, label: `Tinh tấn tới Cấp ${n}` },
      estimate: ra(o, ea(t)),
    };
  }
  if (e.kind === `streak`) {
    let i = ia(t, n);
    if (r) return { status: `Bạn đã giữ lửa ${i} ngày. ${oa}`, bar: null, estimate: `` };
    if (!t) return { status: Ui, bar: null, estimate: `` };
    let { current: a, practicedToday: o } = t.streak,
      s = Math.max(0, e.days - a);
    return {
      status: `Bạn đang giữ lửa ${a} ngày (dài nhất ${i} ngày). Còn ${s} ngày nữa.`,
      bar: { now: a, max: e.days, label: `Giữ lửa tới ${e.days} ngày` },
      estimate: `Ngày nào cũng giữ lửa thì ${s} ngày nữa là mở${o ? `, tính từ ngày mai` : `, tính cả hôm nay`}.`,
    };
  }
  if (e.kind === `referrals`) {
    let t = Math.max(0, Math.floor(n.referralCount ?? 0));
    return r
      ? { status: `Bạn đã rủ đủ ${e.count} bạn. ${oa}`, bar: null, estimate: `` }
      : {
          status: `Đã rủ ${Math.min(t, e.count)}/${e.count} bạn.`,
          bar: { now: Math.min(t, e.count), max: e.count, label: `Số bạn đã rủ vào chùa` },
          estimate: ``,
        };
  }
  return r
    ? { status: `Bạn đã có danh hiệu này. ${oa}`, bar: null, estimate: `` }
    : {
        status: e.badge === `kol` ? `Bạn chưa có danh hiệu KOL Chùa Sen.` : `Bạn chưa có danh hiệu này.`,
        bar: null,
        estimate: ``,
      };
}
function ca(e) {
  return { status: e ? oa : Wi, bar: null, estimate: `` };
}
var Y = (e, t, n) =>
    `<button type="button" class="lg-btn" ${t} data-fk="${n}">${J(e)}${b(`chevron-right`, { size: 16 })}</button>`,
  la = [
    {
      rule: `beadRounds`,
      more: `beadsMore`,
      name: `Niệm Phật, lần tràng hạt`,
      button: `Niệm Phật ngay`,
      target: { kind: `route`, route: `beads` },
      feature: `beads`,
    },
    {
      rule: `sutras`,
      more: `sutrasMore`,
      name: `Tụng kinh`,
      button: `Tụng kinh`,
      target: { kind: `route`, route: `chant` },
      feature: `chant`,
    },
    {
      rule: `meditation`,
      more: `meditationMore`,
      name: `Thiền`,
      button: `Thiền`,
      target: { kind: `route`, route: `meditate` },
      feature: `meditate`,
    },
  ],
  ua = [...la.map((e) => e.target), { kind: `sweep` }],
  da = ua.length - 1,
  fa = { "first:lantern": `lantern` },
  pa = 4,
  ma = (e = 0, t = new Set()) =>
    xt
      .filter((n) => n.friends > e && !t.has(n.friends))
      .map((e) => `${e.friends} bạn +${e.xp}`)
      .join(` · `);
function X(e, t) {
  return `<section class="lg-way"><h3 class="lg-way__title">${J(e)}</h3>${t}</section>`;
}
var Z = (e) => `<p class="lg-note">${J(e)}</p>`;
function ha({ state: e }) {
  let t = Z(`Mỗi việc +30 tinh tấn, xong cả 3 việc thêm +30. Việc mới mỗi ngày.`),
    n = (e?.tasks ?? [])
      .map(({ def: e, done: t, current: n }) => {
        let r = t ? `Đã xong` : e.goal > 1 ? `${n}/${e.goal}` : `Chưa làm`;
        return `<li class="lg-task" data-done="${t}"><span class="lg-task__mark" aria-hidden="true">${t ? b(`check`, { size: 16 }) : ``}</span><span class="lg-task__name">${Ki(t ? `Đã xong: ` : `Chưa xong: `)}${J(e.title)}</span><span class="lg-task__meta">${J(t ? r : `${r} · +30`)}</span></li>`;
      })
      .join(``),
    r = n
      ? `<ul class="lg-tasks" aria-label="Việc hôm nay">${n}</ul><p class="lg-note">${e?.tasksDone ?? 0}/${e?.tasks.length ?? 3} việc đã xong hôm nay.</p>`
      : ``,
    i = e?.allDone ? e.extras : [],
    a = Z(
      `Xong cả 3 việc thì có thêm tối đa 3 việc thêm, mỗi việc +10, ngoài mức công phu của ngày.${i.length > 0 ? ` Hôm nay: ${i.filter((e) => e.done).length}/${i.length} việc thêm đã xong.` : ``}`,
    );
  return X(`Việc hôm nay`, t + r + a + Y(`Xem việc hôm nay`, `data-go="tasks"`, `tasks`));
}
function ga(e, t) {
  return `Từ ${e.unit} thứ ${e.cap + 1}: ${t.xpEach} tinh tấn mỗi ${t.unit}, tới ${t.cap} ${t.unit} nữa.`;
}
var _a = `Đã đủ tinh tấn công phu hôm nay. Công phu thêm, việc hôm nay, việc thêm, lượt quét lá thêm, mốc giữ lửa, nhiệm vụ đặc biệt và dấu mốc vẫn được tính.`,
  va = `Hôm nay đã đủ mức công phu, cả phần công phu thêm, mai lại tiếp nhé. Việc hôm nay, việc thêm, lượt quét lá thêm, mốc giữ lửa, nhiệm vụ đặc biệt và dấu mốc vẫn được tính.`;
function ya({ state: e, open: t }) {
  let n = e?.practiceCeiling ?? 200,
    r = e?.practiceMoreCeiling ?? 150,
    i = e ? ` Hôm nay: ${e.practiceToday}/${n}.` : ``,
    a = e ? ` Hôm nay: ${e.practiceMoreToday}/${r}.` : ``,
    o = e && e.practiceToday >= n ? Z(e.practiceMoreToday >= r ? va : _a) : ``,
    s = la
      .map((e, n) => {
        let r = Qi(e.rule);
        if (!r) return ``;
        let i = Qi(e.more),
          a = i ? `<p class="lg-row__meta">${J(ga(r, i))}</p>` : ``,
          o = t(e.feature) ? Y(e.button, `data-do="${n}"`, `do-${n}`) : ``;
        return `<li class="lg-row"><div class="lg-row__text"><p class="lg-row__name">${J(e.name)}</p><p class="lg-row__meta">${J(yt(r))}</p>${a}</div>${o}</li>`;
      })
      .join(``);
  return X(
    `Công phu`,
    Z(`Công phu mỗi ngày được tính tối đa ${n} tinh tấn.${i}`) +
      Z(
        `Công phu thêm: làm quá mức của từng việc (cả ngồi bồ đoàn) vẫn được tinh tấn, ngoài mức công phu của ngày, tối đa ${r} tinh tấn mỗi ngày.${a}`,
      ) +
      o +
      `<ul class="lg-rows">${s}</ul>`,
  );
}
function ba({ open: e }) {
  let t = Qi(`sweep`);
  if (!t) return ``;
  let n = Qi(`sweepMore`),
    r = Qi(`sweepDay`),
    i = [
      `${t.label}: ${yt(t)}.`,
      n
        ? `Từ lượt thứ ${t.cap + 1}: thêm ${n.xpEach} tinh tấn mỗi lượt, tới ${n.cap} lượt nữa, ngoài mức công phu của ngày.`
        : ``,
      r ? `${r.label}: +${r.xpEach} tinh tấn.` : ``,
    ].filter(Boolean),
    a = e(`sweep`) ? Y(`Đi quét lá`, `data-do="${da}"`, `sweep`) : ``;
  return X(`Quét lá đa`, i.map(Z).join(``) + a);
}
function xa({ state: e }) {
  let t = e?.streak.best ?? 0,
    n = bt
      .filter((e) => e.days > t)
      .slice(0, 3)
      .map((e) => `${e.days} ngày +${e.xp}`)
      .join(` · `);
  return X(
    `Giữ lửa`,
    Z(`Ngày nào có công phu là giữ được lửa.${e ? ` Bạn đang giữ lửa ${e.streak.current} ngày.` : ``}`) +
      (n ? Z(`Mốc giữ lửa được thưởng một lần: ${n}.`) : ``) +
      Y(`Xem chuỗi giữ lửa`, `data-go="streak"`, `streak`),
  );
}
function Sa({ state: e, unlocks: t }) {
  let n = e?.special.friends ?? Math.max(0, Math.floor(t?.referralCount ?? 0)),
    r = new Set((e?.special.referrals ?? []).filter((e) => e.done).map((e) => e.def.goal)),
    i = e ? e.special.video.done : (t?.badges ?? []).includes(`kol`);
  return { friends: n, marks: ma(n, r), videoDone: i };
}
function Ca(e) {
  let { state: t, open: n } = e,
    { friends: r, marks: i, videoDone: a } = Sa(e),
    o = [],
    s = [];
  return (
    i &&
      (o.push(`Rủ bạn vào chùa, mỗi mốc một lần: ${i}.${t ? ` Bạn đã rủ ${r} bạn.` : ``}`),
      n(`kol`) && s.push(Y(`Mời bạn`, `data-rewards="ref"`, `ref`))),
    a ||
      (o.push(`Làm video về Chùa Sen được duyệt: +500 tinh tấn (một lần).`),
      n(`kol`) && s.push(Y(`Gửi video`, `data-rewards="kol"`, `kol`))),
    t && !t.special.fanpage.done && o.push(`Mở fanpage Chùa Sen và bấm Theo dõi: +30 tinh tấn (một lần).`),
    o.length === 0
      ? ``
      : X(
          `Nhiệm vụ đặc biệt`,
          o.map(Z).join(``) + (s.length > 0 ? `<div class="lg-btns">${s.join(``)}</div>` : ``),
        )
  );
}
function wa({ state: e, open: t }) {
  if (!e) return ``;
  let n = e.milestones
    .filter(({ def: e, done: n }) => {
      let r = fa[e.id];
      return !n && e.id.startsWith(`first:`) && (!r || t(r));
    })
    .slice(0, pa)
    .map(({ def: e }) => `<li><span>${J(e.title)}</span><span class="lg-xp">+${e.xp}</span></li>`)
    .join(``);
  return n
    ? X(`Lần đầu làm`, Z(`Mỗi việc làm lần đầu được thưởng một lần:`) + `<ul class="lg-firsts">${n}</ul>`)
    : ``;
}
function Ta(e) {
  return (
    Z(`Lên cấp bằng tinh tấn. Đây là những cách có tinh tấn:`) + ha(e) + ya(e) + ba(e) + xa(e) + Ca(e) + wa(e)
  );
}
function Ea(e, { state: t, open: n }) {
  let r = t
      ? t.streak.practicedToday
        ? `Hôm nay bạn đã giữ lửa. Mai nhớ quay lại nhé.`
        : `Hôm nay chưa giữ lửa: công phu một chút là được.`
      : ``,
    i = Math.min(2, Math.max(0, t?.streak.rest ?? 0)),
    a = bt.find((t) => t.days === e.days),
    o = [
      n(`beads`) ? Y(`Niệm Phật ngay`, `data-do="0"`, `do-0`) : ``,
      n(`sweep`) ? Y(`Đi quét lá`, `data-do="${da}"`, `sweep`) : ``,
      Y(`Xem chuỗi giữ lửa`, `data-go="streak"`, `streak`),
    ].join(``);
  return X(
    `Giữ lửa mỗi ngày`,
    Z(
      `Mỗi ngày chỉ cần một việc công phu nhỏ: lạy Phật một lạy, thắp một nén hương, lần một vòng tràng hạt hay quét một lượt lá đa.`,
    ) +
      (r ? Z(r) : ``) +
      Z(
        `Hôm nào bận, chùa giữ chỗ cho bạn: cứ đủ 7 ngày công phu trong chuỗi là được một ngày nghỉ (giữ tối đa 2). Ngày vắng tự dùng một ngày nghỉ: chuỗi giữ nguyên, chỉ không tăng.${t ? ` Bạn đang có ${i}/2 ngày nghỉ.` : ``}`,
      ) +
      (a && (t?.streak.best ?? 0) < e.days
        ? Z(`Giữ lửa ${e.days} ngày còn được thưởng +${a.xp} tinh tấn (một lần).`)
        : ``) +
      `<div class="lg-btns">${o}</div>`,
  );
}
var Da = (e) => `<ol class="lg-steps">${e.map((e) => `<li>${J(e)}</li>`).join(``)}</ol>`;
function Oa(e) {
  let { marks: t } = Sa(e);
  return X(
    `Cách rủ bạn`,
    Da([
      `Mở Chương trình KOL Chùa Sen, tới phần "Rủ bạn vào chùa" và bấm "Chép" để lấy đường dẫn mời của bạn.`,
      `Gửi đường dẫn ấy cho bạn bè, người thân.`,
      `Mỗi người bạn vào chùa qua đường dẫn của bạn được tính một lần. Số bạn cập nhật khoảng 30 phút một lần.`,
    ]) +
      Z(`Ảnh "Khoe thành tích" cũng mang đường dẫn mời của bạn.`) +
      (e.xp !== !1 && t ? Z(`Mỗi mốc rủ bạn còn được tinh tấn, một lần: ${t}.`) : ``) +
      `<div class="lg-btns">${Y(`Lấy đường dẫn mời`, `data-rewards="ref"`, `ref`)}</div>`,
  );
}
function ka(e) {
  let { videoDone: t } = Sa(e);
  return X(
    `Cách nhận danh hiệu KOL`,
    Da([
      `Làm một video về Chùa Sen, đăng lên TikTok, YouTube, Facebook hoặc Instagram, thêm hashtag #chuasen vào phần mô tả.`,
      `Gửi đường dẫn video trong Chương trình KOL Chùa Sen.`,
      `Ben, người làm Chùa Sen, xem và duyệt trong vài ngày. Được duyệt là mở ngay.`,
    ]) +
      Z(`Thể lệ đầy đủ (số lượt xem cần đạt) có trong Chương trình KOL.`) +
      (e.xp !== !1 && !t ? Z(`Video được duyệt còn được +500 tinh tấn (một lần).`) : ``) +
      `<div class="lg-btns">${Y(`Mở Chương trình KOL`, `data-rewards="kol"`, `kol`)}</div>`,
  );
}
function Aa(e, t) {
  return e || !t ? `` : `<div class="lg-btns">${Y(`Mở Cài đặt`, `data-go="settings"`, `settings`)}</div>`;
}
function ja(e, t, n) {
  return n
    ? ``
    : e.kind === `level` || e.kind === `tier`
      ? Ta(t)
      : e.kind === `streak`
        ? Ea(e, t)
        : e.kind === `referrals`
          ? Oa(t)
          : e.kind === `badge` && e.badge === `kol`
            ? ka(t)
            : Z(`Danh hiệu này do chùa trao trong các chương trình đặc biệt.`);
}
function Ma(e, t) {
  let n = s(g, _)
    .filter((n) => n.minLevel === e && !t(n.id))
    .map((e) => e.label);
  return n.length > 0 ? `Cấp ${e} mở: ${n.join(`, `)}.` : ``;
}
var Na = `button:not([disabled]), a[href], [tabindex="0"]`;
async function Pa(e, n, r) {
  let { openRewardsPanel: i } = await t(
    async () => {
      let { openRewardsPanel: e } = await import(`./rewards-BiUWDF_0.js`).then((e) => e.n);
      return { openRewardsPanel: e };
    },
    __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
    import.meta.url,
  );
  r() && (O(`kol_open`, { place: `guide` }), i({ opener: n, focus: e }));
}
var Fa = null;
function Ia(e) {
  Fa?.close();
  let { need: t } = e,
    n = Ji(t),
    o =
      e.opener === void 0
        ? document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
        : e.opener,
    s = qi(t),
    c = (t) => e.featureOpen?.(t) ?? !0,
    l = t.kind === `level` && s !== null ? Ma(s, c) : ``,
    u = document.createElement(`dialog`);
  ((u.className = `lg`),
    u.setAttribute(`aria-labelledby`, `lg-title`),
    u.setAttribute(`aria-describedby`, `lg-need lg-status`),
    (u.innerHTML = `
    <div class="lg__card">
      <header class="lg__head">
        <span class="lg__icon" aria-hidden="true">${b(`lotus`, { size: 22 })}</span>
        <h2 id="lg-title" class="lg__title" tabindex="-1">${J(Zi(t, e.item))}</h2>
        <button type="button" class="lg__close" data-ref="close" aria-label="Đóng">${b(`close`)}</button>
      </header>
      <div class="lg__body">
        <div class="lg__need">
          <p id="lg-need" class="lg__req" data-ref="need"></p>
          ${l ? `<p class="lg-note" data-ref="opens">${J(l)}</p>` : ``}
          <p id="lg-status" class="lg__status" role="status" aria-live="polite" data-ref="status"></p>
          <div class="lg__bar" role="progressbar" aria-valuemin="0" data-ref="bar" hidden><i></i></div>
          <p class="lg__est" data-ref="est" hidden></p>
        </div>
        <div class="lg__ways" data-ref="ways"></div>
      </div>
      <footer class="lg__foot">
        <p class="lg-note" data-ref="calm">${J(Vi)}</p>
        <button type="button" class="btn btn--ghost" data-ref="done">Đóng</button>
      </footer>
    </div>`));
  let d = (e) => u.querySelector(`[data-ref="${e}"]`),
    f = d(`need`),
    p = u.querySelector(`[data-ref="opens"]`),
    m = d(`calm`),
    h = d(`status`),
    g = d(`bar`),
    _ = d(`est`),
    v = d(`ways`),
    y = () => {
      let t = e.state();
      return t && !t.readOnly ? t : null;
    },
    x = null,
    S = () => {
      if (C) return;
      let r = y(),
        i = e.unlocks(),
        a = e.progressHidden?.() === !0,
        o = n && a,
        s = aa(t, r, i),
        l = o ? ca(s) : sa(t, r, i);
      if (
        ((f.textContent = o ? Xi(t) : Yi(t)),
        p && (p.hidden = o),
        (m.hidden = a),
        (u.dataset.hidden = String(o)),
        h.textContent !== l.status && (h.textContent = l.status),
        (g.hidden = l.bar === null),
        l.bar)
      ) {
        let { now: e, max: t, label: n } = l.bar,
          r = Math.min(Math.max(0, e), t);
        (g.setAttribute(`aria-label`, n),
          g.setAttribute(`aria-valuemax`, String(t)),
          g.setAttribute(`aria-valuenow`, String(r)),
          g.setAttribute(`aria-valuetext`, `${r}/${t}`),
          g.style.setProperty(`--pct`, `${Math.round((r / Math.max(1, t)) * 100)}%`));
      }
      ((_.hidden = l.estimate === ``), (_.textContent = l.estimate), (u.dataset.met = String(s)));
      let d = o ? Aa(s, e.settings === !0) : ja(t, { state: r, open: c, xp: !a, unlocks: i }, s);
      if (d === x) return;
      x = d;
      let b = document.activeElement,
        S = b instanceof HTMLElement && v.contains(b) ? b.dataset.fk : ``;
      ((v.innerHTML = d), S && v.querySelector(`[data-fk="${S}"]`)?.focus({ preventScroll: !0 }));
    },
    C = !1,
    w = !0,
    T = () => void 0,
    E = () => void 0,
    D = () => {
      ((C = !0), T(), E(), e.signal?.removeEventListener(`abort`, ee));
    },
    k = (e = !0) => {
      C || ((w = e), D(), r(u));
    },
    ee = () => k(!1),
    A = new Set(),
    te = e.openRewards ?? ((e, t) => Pa(e, t, () => !C));
  (u.addEventListener(`click`, (t) => {
    if (C) return;
    let n = t.target?.closest(`button`);
    if (!n || !u.contains(n)) return;
    let { go: r, do: i, rewards: a } = n.dataset;
    if (r === `tasks` || r === `streak` || r === `settings`) (k(!1), e.go({ kind: r }));
    else if (i !== void 0) {
      let t = ua[Number(i)];
      if (!t) return;
      (k(!1), e.go({ kind: `do`, target: t }));
    } else
      (a !== `ref` && a !== `kol`) ||
        A.has(n) ||
        (A.add(n),
        n.setAttribute(`aria-busy`, `true`),
        te(a, n)
          .catch((e) => {
            (console.error(`Không mở được Chương trình KOL`, e), C || (h.textContent = Hi));
          })
          .finally(() => {
            (A.delete(n), n.removeAttribute(`aria-busy`));
          }));
  }),
    d(`close`).addEventListener(`click`, () => k()),
    d(`done`).addEventListener(`click`, () => k()),
    a(u),
    u.addEventListener(`cancel`, (e) => {
      (e.preventDefault(), k());
    }),
    u.addEventListener(`keydown`, (e) => {
      if (e.key === `Escape` && !e.isComposing) (e.preventDefault(), k());
      else if (e.key === `Tab`) {
        let t = [...u.querySelectorAll(Na)].filter((e) => !e.closest(`[hidden]`)),
          n = t[0],
          r = t[t.length - 1];
        if (!n || !r) return;
        let i = document.activeElement,
          a = !u.contains(i);
        e.shiftKey && (i === n || a)
          ? (e.preventDefault(), r.focus())
          : !e.shiftKey && (i === r || a) && (e.preventDefault(), n.focus());
      }
    }),
    u.addEventListener(`close`, () => {
      if ((D(), u.remove(), Fa === j && (Fa = null), !w)) return;
      let t = o?.isConnected ? o : e.fallbackFocus;
      t?.isConnected && t.focus({ preventScroll: !0 });
    }));
  let j = { element: u, close: () => k() };
  return e.signal?.aborted
    ? ((C = !0), j)
    : (e.signal?.addEventListener(`abort`, ee, { once: !0 }),
      (T = e.subscribe?.(S) ?? T),
      (E = e.onUnlocksChange?.(S) ?? E),
      S(),
      (Fa = j),
      document.body.append(u),
      i(u),
      u.querySelector(`#lg-title`)?.focus({ preventScroll: !0 }),
      O(`level_guide_opened`, { need: t.kind, ...(s === null ? {} : { level: s }) }),
      j);
}
var La = `Mừng bạn trở lại chùa`,
  Ra = `Đang công phu chung · vào nghe`,
  za = `Tuần mới, ba tâm nguyện mới.`;
function Ba(e) {
  let t = we(e);
  if (t.live) return { live: !0, text: Ra };
  let n = Math.round(pe(t.startsAtMs)) % 24;
  return { live: !1, text: `Công phu chung ${String(n).padStart(2, `0`)}:00` };
}
function Va(e) {
  let t = Ba(e.nowMs),
    n = [];
  return (
    t.live && n.push({ kind: `live`, text: t.text }),
    e.returning && n.push({ kind: `return`, text: La }),
    e.notice && n.push({ kind: `notice`, text: e.notice }),
    e.occasion && n.push({ kind: `occasion`, text: e.occasion }),
    t.live || n.push({ kind: `community`, text: t.text }),
    n
  );
}
function Ha(e) {
  return e.find((e) => e.kind === `live` || e.kind === `return` || e.kind === `notice`) ?? null;
}
var Ua = `#7fae5a`,
  Wa = `#5f8f4a`,
  Ga = `#f3c973`,
  Q = (e, t, n, r = ``) => {
    let i = 33 - t,
      a = t * 0.42;
    return `<path d="M24 33C${24 - a} ${33 - t * 0.35} ${24 - a * 0.9} ${i + t * 0.25} 24 ${i}C${24 + a * 0.9} ${i + t * 0.25} ${24 + a} ${33 - t * 0.35} 24 33Z" fill="${n}" transform="rotate(${e} 24 33)"${r}/>`;
  },
  Ka = (e) =>
    `<path d="M9 40.5Q24 45 39 40.5" fill="none" stroke="${e}" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/>`;
function qa(e) {
  let { id: t, color: n, accent: r } = e;
  switch (t) {
    case 1:
      return (
        `<ellipse cx="24" cy="29" rx="7.5" ry="8.5" fill="${n}"/><ellipse cx="21.4" cy="26" rx="2.4" ry="3.2" fill="${r}" opacity=".75"/><path d="M24 20.5C24 16.5 26.5 14 30.5 13.6" fill="none" stroke="${Ua}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="31" cy="13.4" rx="3" ry="1.6" fill="${Ua}" transform="rotate(-24 31 13.4)"/>` +
        Ka(r)
      );
    case 2:
      return (
        `<path d="M24 39V17" stroke="${Wa}" stroke-width="2" stroke-linecap="round"/><ellipse cx="18.6" cy="24.5" rx="6" ry="2.8" fill="${n}" transform="rotate(-32 18.6 24.5)"/><ellipse cx="29.4" cy="19.5" rx="6" ry="2.8" fill="${r}" transform="rotate(30 29.4 19.5)"/>` +
        Ka(r)
      );
    case 3: {
      let e = ``;
      for (let t of [20, 75, 130, 185, 240, 295]) {
        let n = (t * Math.PI) / 180;
        e += `<path d="M24 27L${(24 + 10 * Math.cos(n)).toFixed(1)} ${(27 + 10 * Math.sin(n)).toFixed(1)}"/>`;
      }
      return (
        `<path d="M24 27L21.6 15.3A12 12 0 1 0 26.4 15.3Z" fill="${n}"/><g stroke="${r}" stroke-width="1" stroke-linecap="round" opacity=".8">${e}</g><circle cx="24" cy="27" r="1.6" fill="${r}"/>` +
        Ka(r)
      );
    }
    case 4:
      return (
        `<path d="M24 40V27" stroke="${Wa}" stroke-width="2" stroke-linecap="round"/><path d="M24 8C31 14.5 32 22 24 29C16 22 17 14.5 24 8Z" fill="${n}"/><path d="M24 11C27.5 15.5 28 21 24 26.5" fill="none" stroke="${r}" stroke-width="1.3" stroke-linecap="round"/>` +
        Ka(r)
      );
    case 5:
      return Q(-30, 18, r) + Q(30, 18, r) + Q(0, 22, n) + Ka(r);
    case 6:
      return (
        Q(-62, 16, r) +
        Q(62, 16, r) +
        Q(-30, 20, n) +
        Q(30, 20, n) +
        Q(0, 23, n) +
        `<circle cx="24" cy="30" r="3.2" fill="${Ga}"/>` +
        Ka(r)
      );
    default: {
      let e = ``;
      for (let t of [-78, -52, -26, 0, 26, 52, 78]) e += Q(t, 19, r);
      let t = ``;
      for (let e of [-44, -22, 0, 22, 44]) t += Q(e, 15, n);
      return (
        `<circle cx="24" cy="26" r="20" fill="none" stroke="${r}" stroke-opacity=".35" stroke-width="1.2"/>` +
        e +
        t +
        `<circle cx="24" cy="30" r="3.6" fill="${Ga}"/>` +
        Ka(r)
      );
    }
  }
}
function Ja(e, t = 48) {
  let n = L[Math.min(L.length, Math.max(1, e | 0)) - 1];
  return `<svg class="lotus-art" viewBox="0 0 48 48" width="${t}" height="${t}" aria-hidden="true" focusable="false">${qa(n)}</svg>`;
}
function Ya(e) {
  let t = e.id;
  if (t.startsWith(`stroll:`))
    return (
      { yard: `pond`, bodhi: `bodhi`, meditate: `zen`, quanam: `quanam`, well: `well`, hall: `temple` }[
        t.slice(7)
      ] ?? `temple`
    );
  if (/incense/.test(t)) return `incense`;
  if (/lantern/.test(t)) return `lamp`;
  if (/flower/.test(t)) return `flower`;
  if (/candle/.test(t)) return `candle`;
  if (/bell/.test(t)) return `bell`;
  if (/bow/.test(t)) return `bow`;
  if (/bead/.test(t)) return `beads`;
  if (/sutra|teaching/.test(t)) return `book`;
  if (/meditate/.test(t)) return `zen`;
  if (/quanam/.test(t)) return `quanam`;
  if (/sit/.test(t)) return `seat`;
  if (/que/.test(t)) return `sparkle`;
  if (/greet/.test(t)) return `pray`;
  if (/listen/.test(t)) return `music`;
  if (/sweep/.test(t)) return `broom`;
  switch (e.guide.kind) {
    case `route`:
      return e.guide.route === `beads` ? `beads` : e.guide.route === `chant` ? `book` : `zen`;
    case `today`:
      return `calendar`;
    case `seat`:
      return `seat`;
    case `emote`:
      return `pray`;
    case `listen`:
      return `music`;
    default:
      return `lotus`;
  }
}
function Xa(e) {
  let t = e.guide.kind;
  return t === `emote`
    ? `Chào`
    : t === `sweep`
      ? `Quét`
      : t === `walk` || t === `stroll` || t === `seat`
        ? `Đi`
        : `Mở`;
}
function Za(e, t, n = ``) {
  let r = t === `zero` ? 0 : Math.max(1, ve(e));
  return `<span class="flame-box${n ? ` ${n}` : ``}" data-tier="${r}" data-state="${t}" aria-hidden="true">${xe}</span>`;
}
function Qa(e) {
  return bt.find((t) => t.days === e.minDays)?.xp ?? 0;
}
function $a(e) {
  return ge(e)?.name ?? `Chưa thắp lửa`;
}
function eo(e) {
  let t = he(e);
  return t ? `Còn ${t.minDays - Math.max(0, Math.floor(e) || 0)} ngày tới ${t.name}` : null;
}
function to(e, t = e) {
  let n = he(e);
  if (!n) return `Lửa đã ở bậc cao nhất. Cứ giữ cho lửa sáng.`;
  if (n.id === 1)
    return t > 0 ? `Công phu hôm nay để thắp lại lửa.` : `Công phu hôm nay để thắp ngọn lửa đầu tiên.`;
  let r = t >= n.minDays ? 0 : Qa(n);
  return `${eo(e) ?? ``}${r ? ` · +${r} tinh tấn` : ``}`;
}
function no(e, t) {
  return t ? `Hôm nay đã giữ lửa` : e > 0 ? `Công phu hôm nay để giữ lửa` : `Bắt đầu giữ lửa`;
}
function ro(e, t) {
  return { name: $a(e), hint: no(e, t) };
}
var io = e({
    BACKUP_BUTTON: () => co,
    BACKUP_HINT: () => lo,
    EXTRAS_NOTE: () => Eo,
    FANPAGE_STATUS_NONE: () => qo,
    FANPAGE_STATUS_OPEN: () => Ko,
    FANPAGE_TITLE: () => Go,
    INSTALL_HINT: () => uo,
    KOL_TAG: () => No,
    KOL_VIEWS: () => Mo,
    KOL_VIEW_LABELS: () => Po,
    PROGRESS_DISCLAIMER: () => ao,
    PROGRESS_TITLE: () => oo,
    REF_COUNT_NOTE: () => Lo,
    SPECIAL_NOTE: () => Io,
    SPECIAL_OPEN_FAILED: () => Ro,
    SPECIAL_TITLE: () => Fo,
    STAMP_EMPTY: () => is,
    STREAK_ZERO_TEXT: () => so,
    TITLES_NOTE: () => as,
    bonusRules: () => ls,
    formatDay: () => mo,
    guideLabel: () => ho,
    lockText: () => go,
    openProgressDialog: () => ms,
    referralGifts: () => Bo,
    referralNextText: () => Vo,
    streakNote: () => yo,
  }),
  ao = `Tinh tấn ghi lại những lần bạn quay về chùa — không phải công đức, không đổi được gì.`,
  oo = `Hành trình`,
  so = M,
  co = `Sao lưu hành trình`,
  lo = `Hành trình chỉ lưu trên máy này. Sao lưu thành một tệp để giữ khi đổi máy hoặc khi trình duyệt dọn dữ liệu. Tệp này chứa khóa cá nhân và cả lời nguyện riêng tư của bạn (đèn hoa đăng, dải lụa trên cây), đừng gửi cho ai.`,
  uo = `Trên iPhone / iPad (Safari): bấm Chia sẻ, rồi Thêm vào màn hình chính để hành trình được giữ lâu hơn.`,
  fo = [
    { id: `today`, label: `Hôm nay` },
    { id: `path`, label: `Con đường sen` },
    { id: `miles`, label: `Dấu mốc` },
    { id: `book`, label: `Sổ hành hương` },
  ],
  po = [`CN`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`],
  $ = (e) => e.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
function mo(e) {
  let [t, n, r] = e.split(`-`);
  return t && n && r ? `${r}/${n}/${t}` : e;
}
function ho(e) {
  return e.kind === `emote`
    ? `Chắp tay`
    : e.kind === `sweep`
      ? `Cầm chổi`
      : e.kind === `bodhi`
        ? `Đến cây bồ đề`
        : e.kind === `walk` || e.kind === `stroll` || e.kind === `seat`
          ? `Đưa tôi tới`
          : `Mở`;
}
function go(e) {
  let t = L[Math.min(L.length, Math.max(1, e)) - 1];
  return t ? `Mở ở ${t.name} (Cấp ${t.minLevel})` : ``;
}
function _o(e) {
  let t = L[e],
    n = L[e + 1];
  return t ? (n ? `Cấp ${t.minLevel}–${n.minLevel - 1}` : `Cấp ${t.minLevel} trở lên`) : ``;
}
function vo(e) {
  return [
    ...Ne.filter((t) => t.tier === e).map((e) => `Tràng hạt ${e.name}`),
    ...Pe.filter((t) => t.tier === e).map((e) => e.name),
  ];
}
function yo(e) {
  let { current: t, best: n, practicedToday: r } = e.streak;
  return ee(t, n)
    ? so
    : r
      ? `Hôm nay bạn đã công phu. Cứ nhẹ nhàng và đều đặn.`
      : t === 0
        ? `Hôm nay mình lạy Phật một lạy hay thắp một nén hương là thắp được lửa.`
        : `Hôm nay mình lạy Phật một lạy hay thắp một nén hương là đủ để giữ lửa.`;
}
var bo = (e) => `<span class="progress-sr">${$(e)}</span>`,
  xo = (e, t, n, r, i = ``) =>
    `<div class="progress-bar${i ? ` ${i}` : ``}" role="progressbar" aria-label="${$(t)}" aria-valuemin="0" aria-valuemax="${r}" aria-valuenow="${n}" data-pct="${Math.round(Math.min(100, Math.max(0, e)))}"><i></i></div>`,
  So = (e) =>
    `<span class="progress-check${e ? ` is-done` : ``}" aria-hidden="true">${e ? b(`check`, { size: 16 }) : ``}</span>`,
  Co = `<svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20 14.5A8.2 8.2 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5z"/></svg>`,
  wo = `<svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 14.5A8.2 8.2 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5z"/></svg>`;
function To(e, t, n = !1) {
  let { def: r, done: i, current: a } = e,
    o = r.goal > 1 && !i ? `<span class="pd-step">${a}/${r.goal}</span>` : ``,
    s = i ? `<span class="pd-done">Đã xong</span>` : ``,
    c = n ? 10 : 30,
    l = n ? `data-extra="${t}" data-fk="extra-${t}"` : `data-guide="${t}" data-fk="guide-${t}"`,
    u = r.goal > 1 && !i ? xo((a / r.goal) * 100, `Tiến độ: ${r.title}`, a, r.goal, `is-mini`) : ``;
  return `
    <li class="progress-task${n ? ` progress-task--extra` : ``}" data-slot="${r.slot}" data-done="${i}">
      <span class="progress-task__icon" aria-hidden="true">${i ? b(`check`, { size: 20 }) : b(Ya(r), { size: 22 })}</span>
      <div class="progress-task__main">
        <p class="progress-task__title">${bo(i ? `Đã xong: ` : `Chưa xong: `)}${$(r.title)}</p>
        <p class="progress-task__meta">${[o, `<span class="pd-xp">+${c} tinh tấn</span>`, s].filter(Boolean).join(` `)}</p>
        ${u}
      </div>
      ${i ? `` : `<button type="button" class="progress-btn progress-task__go" ${l}>${ho(r.guide)}${b(`chevron-right`, { size: 16 })}</button>`}
    </li>`;
}
var Eo = `Xong cả 3 việc rồi. Còn muốn công phu thêm thì làm thêm vài việc nhỏ: mỗi việc +10 tinh tấn, ngoài mức mỗi ngày. Không bắt buộc, mai lại có việc mới.`;
function Do(e) {
  if (!e.allDone || e.extras.length === 0) return ``;
  let t = e.extras.filter((e) => e.done).length,
    n = e.extras.map((e, t) => To(e, t, !0)).join(``);
  return `
    <section class="pd-extras" data-ref="extras" aria-labelledby="pd-extras-title">
      <h4 class="pd-extras__title" id="pd-extras-title">Việc thêm hôm nay · ${t}/${e.extras.length}</h4>
      <p class="progress-note">${$(Eo)}</p>
      <ul class="progress-list">${n}</ul>
    </section>`;
}
function Oo(e) {
  let t = e.tasks.map((e, t) => To(e, t)).join(``),
    n = e.tasks.map((e) => `<i class="pd-dot${e.done ? ` is-done` : ``}"></i>`).join(``);
  return `<ul class="progress-list" data-ref="taskList">${t}${`
    <li class="progress-task progress-task--bonus" data-done="${e.allDone}">
      ${So(e.allDone)}
      <div class="progress-task__main">
        <p class="progress-task__title">${bo(e.allDone ? `Đã xong: ` : `Chưa xong: `)}Xong cả 3 việc hôm nay</p>
        <p class="progress-task__meta"><span class="pd-dots" aria-hidden="true">${n}</span> <span>${e.tasksDone}/3</span> <span class="pd-xp">+30 tinh tấn</span>${e.allDone ? ` <span class="pd-done">Đã xong</span>` : ``}</p>
      </div>
    </li>`}</ul>${Do(e)}`;
}
function ko(e) {
  let t = { practiced: `có công phu`, rest: `chùa giữ chỗ`, missed: `vắng`, today: `hôm nay, chưa công phu` };
  return `<ol class="pd-week" aria-label="Bảy ngày gần nhất">${e.week
    .map((e) => {
      let n =
        e.state === `practiced`
          ? b(`lotus`, { size: 16 })
          : e.state === `rest`
            ? Co.replace(`width="18" height="18"`, `width="14" height="14"`)
            : ``;
      return `<li class="pd-week__day" data-state="${e.state}"><span class="pd-week__mark" aria-hidden="true">${n}</span><span class="pd-week__name" aria-hidden="true">${po[e.weekday] ?? ``}</span>${bo(`${mo(e.day)}: ${t[e.state] ?? ``}`)}</li>`;
    })
    .join(``)}</ol>`;
}
function Ao(e, t, n) {
  return _e
    .map((r) => {
      let i = r.id === t ? `here` : e >= r.minDays ? `done` : `next`,
        a = i === `here` ? `Lửa của bạn` : i === `done` ? `Đã qua` : `Phía trước`,
        o = Qa(r),
        s = `${r.minDays} ngày${o ? ` · +${o} tinh tấn` : ``}`,
        c = i === `here` ? (n ? `lit` : `risk`) : `show`;
      return `<li class="pd-lamps__item" data-state="${i}"${i === `here` ? ` aria-current="step"` : ``}>${Za(r.minDays, c)}<span class="pd-lamps__name">${$(r.name)}</span><span class="pd-lamps__meta">${$(s)}</span>${bo(`: ${a}`)}</li>`;
    })
    .join(``);
}
function jo(e) {
  let t = e.streak,
    n = ge(t.current),
    r = Math.min(2, Math.max(0, t.rest)),
    i = Array.from({ length: 2 }, (e, t) => (t < r ? Co : wo)).join(``),
    a = ``;
  t.restUsedOn &&
    (a = te(t.restUsedOn, e.today) ? j : `Ngày ${mo(t.restUsedOn).slice(0, 5)} chùa đã giữ chỗ cho bạn.`);
  let o = n ? (t.practicedToday ? `lit` : `risk`) : `zero`;
  return `
    <div class="progress-streak">
      <div class="pd-lamp" data-tier="${n?.id ?? 0}" data-state="${o}">
        <span class="pd-lamp__art">${Za(t.current, o)}</span>
        <div class="pd-lamp__text">
          <p class="pd-lamp__name">${$($a(t.current))}</p>
          <p class="progress-streak__now">Giữ lửa <b>${t.current}</b> ngày</p>
          <p class="pd-lamp__today">${$(no(t.current, t.practicedToday))}</p>
          <p class="progress-streak__best">Dài nhất: ${t.best} ngày</p>
          <p class="pd-lamp__next">${$(to(t.current, t.best))}</p>
        </div>
      </div>
      ${ko(e)}
      <p class="progress-rest"><span class="progress-rest__icons" aria-hidden="true">${i}</span><span>Ngày nghỉ chùa giữ cho bạn: ${r}/2</span></p>
      <p class="progress-note">${$(yo(e))}${a ? ` ${$(a)}` : ``}</p>
      <details class="pd-more">
        <summary>Ngày nghỉ là gì?</summary>
        <p class="progress-note">Cứ 7 ngày công phu liền nhau, chùa tặng bạn thêm một ngày nghỉ (giữ tối đa 2). Hôm nào bận, chùa tự giữ chuỗi cho bạn.</p>
      </details>
      <h4 class="pd-lamps__title">Tám bậc lửa</h4>
      <p class="progress-note">Giữ lửa càng lâu thì lửa càng lớn và đẹp. Mỗi lần lửa lên bậc, bạn được thêm tinh tấn (một lần).</p>
      <ol class="pd-lamps" aria-label="Tám bậc lửa">${Ao(t.current, n?.id ?? 0, t.practicedToday)}</ol>
    </div>`;
}
var Mo = 2e3,
  No = `#chuasen`,
  Po = { none: `Chưa gửi video`, cho_duyet: `Đang chờ duyệt`, da_duyet: `Đã duyệt`, tu_choi: `Chưa đạt` },
  Fo = `Nhiệm vụ đặc biệt`,
  Io = `Lan tỏa Chùa Sen: mỗi mốc được thêm tinh tấn một lần, ngoài mức công phu mỗi ngày. Mọi người đều làm được, từ Cấp 1.`,
  Lo = `Mỗi người bạn vào chùa qua đường dẫn mời của bạn được chùa đếm một lần trên máy chủ; số bạn cập nhật khoảng 30 phút một lần.`,
  Ro = `Chưa mở được. Bạn kiểm tra mạng rồi thử lại nhé.`,
  zo = (e) => String(e).replace(/\B(?=(\d{3})+(?!\d))/g, `.`);
function Bo() {
  let e = new Map(),
    t = (t, n) => {
      e.set(t, e.has(t) ? `${e.get(t) ?? ``}, ${n}` : n);
    };
  for (let e of v) {
    let n = De[e.id];
    n?.kind === `referrals` && t(n.count, `bộ áo "${e.label}"`);
  }
  for (let e of v)
    for (let n of [...e.primary, ...e.secondary]) {
      let r = Ee(n);
      r?.kind === `referrals` && t(r.count, `màu "${n.name}" cho bộ ${e.label}`);
    }
  return e;
}
function Vo(e) {
  let t = e.referrals.find((e) => !e.done);
  if (!t) return `Bạn đã nhận đủ quà rủ bạn. Cảm ơn bạn đã lan tỏa Chùa Sen.`;
  let n = Bo().get(t.def.goal),
    r = Math.max(1, t.def.goal - e.friends);
  return `Mốc kế tiếp: ${t.def.goal} bạn (còn ${r}), +${t.def.xp} tinh tấn${n ? ` và ${n}` : ``}.`;
}
function Ho(e, t, n, r) {
  return `<li class="pd-quest__step" data-done="${e}"><span class="pd-quest__mark" aria-hidden="true">${e ? b(`check`, { size: 14 }) : $(t)}</span><span class="pd-quest__label">${bo(e ? `Đã đạt: ` : `Chưa đạt: `)}${$(n)}</span>${r ? `<span class="pd-quest__meta">${r}</span>` : ``}</li>`;
}
function Uo(e) {
  let { friends: t, referrals: n } = e.special,
    r = n[n.length - 1]?.def.goal ?? 0,
    i = Bo(),
    a = n
      .map((e) => {
        let t = i.get(e.def.goal),
          n = `<span class="pd-xp">+${e.def.xp}</span>${t ? ` <span class="pd-quest__gift">${$(t)}</span>` : ``}`;
        return Ho(e.done, String(e.def.goal), `${e.def.goal} bạn`, n);
      })
      .join(``),
    o = Math.min(t, r);
  return `
    <section class="pd-quest" data-quest="ref" aria-labelledby="pd-quest-ref">
      <div class="pd-quest__head">
        <span class="pd-quest__icon" aria-hidden="true">${b(`users`, { size: 22 })}</span>
        <div>
          <h4 class="pd-quest__title" id="pd-quest-ref">Rủ bạn vào chùa</h4>
          <p class="pd-quest__now" data-ref="refCount">Đã rủ ${o}/${r} bạn</p>
        </div>
      </div>
      ${xo(r > 0 ? (o / r) * 100 : 0, `Tiến độ rủ bạn`, o, r, `is-mini`)}
      <ol class="pd-quest__steps" aria-label="Các mốc rủ bạn">${a}</ol>
      <p class="progress-note">${$(Vo(e.special))} ${$(Lo)}</p>
      <button type="button" class="progress-btn pd-quest__go" data-special="ref" data-fk="special-ref">${b(`share`, { size: 16 })}<span>Mời bạn</span></button>
    </section>`;
}
function Wo(e, t) {
  let n = e.special.kol ? `da_duyet` : t,
    r = e.special.video.done,
    i = n !== `none` || r,
    a = n === `da_duyet` || r,
    o = D(`kol`).label,
    s =
      Ho(i, `1`, `Gửi đường dẫn video về Chùa Sen`, ``) +
      Ho(
        a,
        `2`,
        `Video đạt từ ${zo(Mo)} lượt xem, Ben xem và duyệt`,
        `<span class="pd-xp">+${e.special.video.def.xp}</span>`,
      ),
    c =
      n === `tu_choi`
        ? `Video trước chưa đạt. Bạn xem lời nhắn của Ben trong bảng KOL rồi gửi video khác nhé.`
        : n === `cho_duyet`
          ? `Ben sẽ xem video của bạn trong vài ngày.`
          : n === `da_duyet`
            ? `Bạn là KOL Chùa Sen. Gửi thêm video lúc nào cũng được.`
            : `TikTok, YouTube, Facebook hay Instagram đều được; thêm hashtag ${No} vào phần mô tả video.`;
  return `
    <section class="pd-quest" data-quest="kol" data-status="${n}" aria-labelledby="pd-quest-kol">
      <div class="pd-quest__head">
        <span class="pd-quest__icon" aria-hidden="true">${b(`youtube`, { size: 22 })}</span>
        <div>
          <h4 class="pd-quest__title" id="pd-quest-kol">Làm video về Chùa Sen</h4>
          <p class="pd-quest__now" data-ref="kolStatus">${$(Po[n])}</p>
        </div>
      </div>
      <ol class="pd-quest__steps" aria-label="Các bước làm video">${s}</ol>
      <p class="progress-note">${$(`Được duyệt: +${e.special.video.def.xp} tinh tấn (một lần), danh hiệu "KOL Chùa Sen" và bộ "${o}". ${c}`)}</p>
      <button type="button" class="progress-btn pd-quest__go" data-special="kol" data-fk="special-kol">${b(`youtube`, { size: 16 })}<span>Gửi video</span></button>
    </section>`;
}
var Go = `Theo dõi fanpage Chùa Sen`,
  Ko = `Đã mở fanpage. Cảm ơn bạn đã ghé fanpage Chùa Sen.`,
  qo = `Chưa mở fanpage`;
function Jo(e) {
  let { done: t, def: n } = e.special.fanpage,
    r = Ho(t, `1`, `Mở fanpage Chùa Sen và bấm Theo dõi`, `<span class="pd-xp">+${n.xp}</span>`);
  return `
    <section class="pd-quest" data-quest="fanpage" data-done="${t}" aria-labelledby="pd-quest-fanpage">
      <div class="pd-quest__head">
        <span class="pd-quest__icon" aria-hidden="true">${F({ size: 22 })}</span>
        <div>
          <h4 class="pd-quest__title" id="pd-quest-fanpage">${$(Go)}</h4>
          <p class="pd-quest__now" data-ref="fanpageStatus">${$(t ? Ko : qo)}</p>
        </div>
      </div>
      <ol class="pd-quest__steps" aria-label="Các bước theo dõi fanpage">${r}</ol>
      <p class="progress-note">${$(`Nhận thông báo mới từ Chùa Sen trên Facebook. +${n.xp} tinh tấn (một lần) khi bạn mở fanpage từ chùa.`)}</p>
      <button type="button" class="progress-btn pd-quest__go" data-special="fanpage" data-fk="special-fanpage">${F({ size: 16 })}<span>Mở fanpage</span></button>
    </section>`;
}
function Yo(e, t) {
  return `<p class="progress-note">${$(Io)}</p>${Uo(e)}${Wo(e, t)}${Jo(e)}`;
}
function Xo(e) {
  return `<ol class="progress-tiers" aria-label="Bảy bậc sen">${L.map((t, n) => {
    let r = t.id <= e.tier,
      i = t.id === e.tier,
      a = i ? `Đang ở đây` : r ? `Đã qua` : go(t.id),
      o = vo(t.id);
    return `
      <li class="progress-tier" data-state="${i ? `current` : r ? `open` : `locked`}"${i ? ` aria-current="step"` : ``}>
        <span class="progress-tier__art" aria-hidden="true">${Ja(t.id, 40)}</span>
        <p class="progress-tier__name">${$(t.name)} <span>${_o(n)}</span></p>
        <p class="progress-tier__state">${$(a)}</p>
        ${o.length > 0 ? `<p class="progress-tier__unlocks">${$(o.join(` · `))}</p>` : ``}
      </li>`;
  }).join(``)}</ol>`;
}
function Zo(e) {
  let t = L[e.tier];
  if (!t)
    return `<div class="pd-next is-top"><span class="pd-next__art" aria-hidden="true">${Ja(e.tier, 56)}</span><div><p class="pd-next__kicker">Bậc cao nhất</p><p class="pd-next__name">${$(e.tierName)}</p><p class="progress-note">Mỗi lần quay về chùa vẫn được ghi lại. Cấp vẫn tiếp tục lên.</p></div></div>`;
  let n = Math.max(0, Ve(t.minLevel) - e.xp),
    r = vo(t.id);
  return `
    <div class="pd-next">
      <span class="pd-next__art" aria-hidden="true">${Ja(t.id, 56)}</span>
      <div>
        <p class="pd-next__kicker">Bậc kế tiếp</p>
        <p class="pd-next__name">${$(t.name)} <span>· Cấp ${t.minLevel}</span></p>
        <p class="progress-note">Còn ${n} tinh tấn.${r.length > 0 ? ` Mở: ${$(r.join(`, `))}.` : ``}</p>
      </div>
    </div>`;
}
function Qo(e, t, n, r) {
  let i = e === `beads` ? r.equip.beads : r.equip.timbre,
    a = n
      .map((t) => {
        let n = t.tier <= r.unlockedTier;
        return `
        <label class="progress-opt${n ? `` : ` is-locked`}">
          <input type="radio" name="progress-${e}" value="${$(t.id)}" data-pick="${e}" data-fk="pick-${e}-${$(t.id)}"${t.id === i ? ` checked` : ``}${n ? `` : ` disabled`} />
          <span class="progress-opt__swatch" data-${e === `beads` ? `bead` : `timbre`}="${$(t.id)}" aria-hidden="true">${e === `timbre` ? b(n ? `bell` : `lotus`, { size: 16 }) : ``}</span>
          <span class="progress-opt__text"><span class="progress-opt__name">${$(t.name)}</span>${n ? `` : `<span class="progress-opt__lock">${$(go(t.tier))}</span>`}</span>
        </label>`;
      })
      .join(``);
  return `<fieldset class="progress-pick"><legend>${$(t)}</legend><div class="progress-pick__grid">${a}</div></fieldset>`;
}
function $o(e) {
  return Xo(e) + Zo(e) + Qo(`beads`, `Tràng hạt`, Ne, e) + Qo(`timbre`, `Âm sắc mõ và chuông`, Pe, e);
}
function es(e) {
  let t = e.weekly;
  if (!t) return ``;
  let n = t.tasks
    .map(
      ({ def: e, done: t, current: n }) => `
    <li class="progress-task" data-done="${t}">
      ${So(t)}
      <div class="progress-task__main">
        <p class="progress-task__title">${bo(t ? `Đã xong: ` : `Chưa xong: `)}${$(e.title)}</p>
        <p class="progress-task__meta"><span class="pd-step">${n}/${e.goal}</span> <span class="pd-xp">+30 tinh tấn</span></p>
        ${t ? `` : xo((n / e.goal) * 100, `Tiến độ: ${e.title}`, n, e.goal, `is-mini`)}
      </div>
    </li>`,
    )
    .join(``);
  return `
    <h3 class="progress-sec__title">Tuần này · ${t.done}/${t.tasks.length}</h3>
    ${t.fresh ? `<p class="progress-note">${$(za)}</p>` : ``}
    <ul class="progress-list">${n}
      <li class="progress-task progress-task--bonus" data-done="${t.allDone}">
        ${So(t.allDone)}
        <div class="progress-task__main"><p class="progress-task__title">${bo(t.allDone ? `Đã xong: ` : `Chưa xong: `)}Xong cả 3 tâm nguyện tuần này</p>
        <p class="progress-task__meta"><span class="pd-xp">+30 tinh tấn</span></p></div>
      </li>
    </ul>`;
}
var ts = {
  incenseDays: `ngày dâng hương`,
  beadRounds: `vòng tràng hạt`,
  sweeps: `lượt quét lá đa`,
  meditationMinutes: `phút thiền`,
  stamps: `dấu ấn`,
  vuLan: `ngày Vu Lan có công phu`,
  tier: `bậc sen`,
  bestStreak: `ngày giữ lửa liền`,
};
function ns(e, t, n, r = ``) {
  return `
    <li class="progress-mile" data-done="${e}">
      <span class="progress-mile__badge" aria-hidden="true">${b(e ? `check` : `sparkle`, { size: 18 })}</span>
      <div class="progress-mile__main">
        <p class="progress-mile__title">${bo(e ? `Đã có: ` : `Chưa có: `)}${$(t)}</p>
        ${n ? `<p class="progress-mile__meta">${$(n)}</p>` : ``}${r}
      </div>
    </li>`;
}
function rs(e) {
  let t = new Set(e.stamps),
    n = e.stamps
      .map((e) => Bn(e))
      .filter((e) => e !== null)
      .reverse(),
    r = e.milestones
      .filter((e) => e.def.id.startsWith(`stamps:`))
      .map(({ def: e, done: t, current: n }) => ns(t, e.title, t ? `+${e.xp}` : `${n}/${e.goal} · +${e.xp}`))
      .join(``),
    i = Ln.map((e) => ns(t.has(e.id), e.name, ``)).join(``),
    a = n.length
      ? `<ul class="progress-miles">${n
          .slice(0, 24)
          .map((e) => ns(!0, Un(e) ?? `Ngày vía`, mo(e)))
          .join(``)}</ul>`
      : `<p class="progress-note">${$(is)}</p>`,
    o = e.titles
      .map(({ def: t, current: n, goal: r, earned: i }) => {
        let a = e.title === t.id,
          o = a
            ? `Đang mang`
            : i
              ? `Đã có`
              : `${t.needs.kind === `vuLan` ? `` : `${n}/${r} `}${ts[t.needs.kind]}`,
          s = i
            ? `<button type="button" class="progress-btn" data-wear="${a ? `` : t.id}" data-fk="wear-${t.id}">${a ? `Tháo xuống` : `Mang danh hiệu`}</button>`
            : xo((n / r) * 100, `Tiến độ: ${t.name}`, n, r, `is-mini`);
        return ns(i, t.name, o, s);
      })
      .join(``);
  return `
    ${e.occasion ? `<p class="progress-note">${$(e.occasion)}</p>` : ``}
    <h3 class="progress-sec__title">Sổ hành hương · ${e.stamps.length} dấu ấn</h3>
    <ul class="progress-miles">${r}</ul>
    <h4 class="pd-extras__title">Nơi đã đến</h4>
    <ul class="progress-miles">${i}</ul>
    <h4 class="pd-extras__title">Mùng một, rằm, ngày vía đã về chùa</h4>
    ${a}
    <h3 class="progress-sec__title">Danh hiệu</h3>
    <p class="progress-note">${$(as)}</p>
    <ul class="progress-miles">${o}</ul>`;
}
var is = `Công phu vào mùng một, rằm hay một ngày vía là có dấu ấn ngày.`,
  as = `Đủ điều kiện thì mang một danh hiệu dưới tên bạn. Người trong chùa thấy khi bạn bật "Cho người trong chùa thấy cấp của tôi" trong Cài đặt. Danh hiệu không cho tinh tấn.`;
function os(e, t) {
  return `<ul class="progress-miles">${[...e.milestones, ...gr(e.streak.best, t)]
    .sort((e, n) =>
      e.done === n.done
        ? e.done
          ? (t[n.def.id] ?? ``).localeCompare(t[e.def.id] ?? ``)
          : n.current / Math.max(1, n.def.goal) - e.current / Math.max(1, e.def.goal)
        : e.done
          ? -1
          : 1,
    )
    .map(({ def: e, done: n, current: r }) => {
      let i = t[e.id],
        a = n ? [i ? mo(i) : ``, `+${e.xp}`].filter(Boolean).join(` · `) : `${r}/${e.goal} · +${e.xp}`;
      return `
        <li class="progress-mile" data-done="${n}">
          <span class="progress-mile__badge" aria-hidden="true">${b(n ? `check` : e.id.startsWith(`streak:`) ? `calendar` : `sparkle`, { size: 18 })}</span>
          <div class="progress-mile__main">
            <p class="progress-mile__title">${bo(n ? `Đã đạt: ` : `Chưa đạt: `)}${$(e.title)}</p>
            <p class="progress-mile__meta">${$(a)}</p>
            ${n ? `` : xo((r / Math.max(1, e.goal)) * 100, `Tiến độ: ${e.title}`, r, e.goal, `is-mini`)}
          </div>
        </li>`;
    })
    .join(``)}</ul>`;
}
function ss(e) {
  return e.practiceMoreToday <= 0 && e.practiceToday < e.practiceCeiling
    ? ``
    : `<span>· thêm</span><b>${e.practiceMoreToday}/${e.practiceMoreCeiling}</b>`;
}
function cs() {
  return `
    <table class="progress-rules" data-ref="rulesTable">
      <thead><tr><th scope="col">Việc</th><th scope="col">Tinh tấn</th><th scope="col">Tối đa mỗi ngày</th></tr></thead>
      <tbody>${gt()
        .map(
          (e) =>
            `<tr><th scope="row">${$(e.label)}</th><td>${e.xpEach} mỗi ${$(e.unit)}</td><td>${e.cap} ${$(e.unit)} (tối đa ${e.maxPerDay})</td></tr>`,
        )
        .join(``)}</tbody>
    </table>
    <p class="progress-note">Công phu mỗi ngày được tính tối đa 200 tinh tấn. Các dòng “thêm” trong bảng (lượt quét lá đa thêm, công phu thêm) và những phần dưới đây nằm ngoài mức đó:</p>
    ${us()}`;
}
function ls() {
  return [
    `Công phu thêm (thiền, ngồi bồ đoàn, tràng hạt, tụng kinh quá mức của từng việc): tính chung tối đa 150 mỗi ngày.`,
    `Việc hôm nay: 30 mỗi việc, thêm 30 khi xong cả 3.`,
    `Việc thêm (chỉ sau khi xong cả 3 việc): 10 mỗi việc, tối đa 3 việc mỗi ngày.`,
    `Rủ bạn vào chùa (máy chủ đếm số bạn): ${xt.map((e) => `${e.friends} bạn +${e.xp}`).join(`, `)}, mỗi mốc một lần.`,
    `Video về Chùa Sen được duyệt (từ ${zo(Mo)} lượt xem): +500, một lần.`,
    `Dấu mốc và mốc chuỗi ngày: mỗi mốc một lần.`,
  ];
}
function us() {
  return `<ul class="pd-rules-more" data-ref="rulesMore">${ls()
    .map((e) => `<li>${$(e)}</li>`)
    .join(``)}</ul>`;
}
async function ds(e, n) {
  let { openRewardsPanel: r } = await t(
    async () => {
      let { openRewardsPanel: e } = await import(`./rewards-BiUWDF_0.js`).then((e) => e.n);
      return { openRewardsPanel: e };
    },
    __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
    import.meta.url,
  );
  r({ opener: n, focus: e });
}
async function fs(e) {
  return !e && !x()
    ? null
    : (
        await t(
          async () => {
            let { getRewards: e } = await import(`./rewards-BiUWDF_0.js`).then((e) => e.r);
            return { getRewards: e };
          },
          __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
          import.meta.url,
        )
      ).getRewards();
}
var ps = null;
function ms(e) {
  ps?.isConnected && r(ps);
  let t =
      e.opener === void 0
        ? document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
        : e.opener,
    { engine: o } = e,
    s = fo
      .map(
        (e) =>
          `<button type="button" role="tab" class="pd-tab" id="pd-tab-${e.id}" data-tab="${e.id}" aria-controls="pd-panel-${e.id}">${e.label}<span class="pd-tab__badge" data-ref="badge-${e.id}" hidden></span></button>`,
      )
      .join(``),
    c = document.createElement(`dialog`);
  ((c.className = `progress-dlg`),
    c.setAttribute(`aria-labelledby`, `progress-title`),
    (c.innerHTML = `
    <div class="progress-dlg__card">
      <header class="progress-dlg__head">
        <div class="pd-hero">
          <span class="pd-hero__ring" aria-hidden="true">
            <svg viewBox="0 0 80 80"><circle class="pd-hero__track" cx="40" cy="40" r="37" pathLength="1"/><circle class="pd-hero__arc" data-ref="arc" cx="40" cy="40" r="37" pathLength="1"/></svg>
            <span class="progress-dlg__emblem" data-ref="emblem"></span>
          </span>
          <div class="progress-dlg__who">
            <p class="pd-hero__kicker">Hành trình của bạn</p>
            <h2 id="progress-title" class="progress-dlg__title" tabindex="-1" data-ref="title"></h2>
            <p class="progress-dlg__next" data-ref="next"></p>
            ${e.levelGuide ? `<button type="button" class="pd-howto" data-ref="howTo">Làm sao lên cấp?</button>` : ``}
          </div>
        </div>
        <button type="button" class="progress-dlg__close" data-ref="close" aria-label="Đóng">${b(`close`)}</button>
        <div class="progress-dlg__meters" data-ref="meters"></div>
      </header>
      <div class="pd-tabs" role="tablist" aria-label="Hành trình">${s}</div>
      <div class="progress-dlg__body" data-ref="body">
        <section class="pd-panel" role="tabpanel" id="pd-panel-today" aria-labelledby="pd-tab-today" data-panel="today">
          <h3 class="progress-sec__title" id="pd-special-title">${Fo}</h3>
          <div class="pd-special" data-ref="special"></div>
          <p class="progress-note" role="status" aria-live="polite" data-ref="specialStatus"></p>
          <h3 class="progress-sec__title">Việc hôm nay</h3>
          <p class="progress-note" data-ref="dayNote"></p>
          <div data-ref="tasks"></div>
          <div data-ref="week"></div>
          <h3 class="progress-sec__title" id="pd-streak-title" tabindex="-1" data-ref="streakTitle">Chuỗi giữ lửa</h3>
          <div data-ref="streak"></div>
          <p class="progress-foot__rule" data-ref="rule"></p>
        </section>
        <section class="pd-panel" role="tabpanel" id="pd-panel-path" aria-labelledby="pd-tab-path" data-panel="path" hidden>
          <div data-ref="path"></div>
          <footer class="progress-foot">
            <details class="progress-fold" data-ref="rules">
              <summary>Cách tính tinh tấn</summary>
              ${cs()}
            </details>
            <div class="progress-foot__backup">
              <p class="progress-note">${lo}</p>
              <button type="button" class="progress-btn" data-ref="backup">${b(`download`, { size: 18 })}<span>${co}</span></button>
              <p class="progress-note" role="status" aria-live="polite" data-ref="status"></p>
            </div>
            <p class="progress-note" data-ref="install" hidden>${uo}</p>
          </footer>
        </section>
        <section class="pd-panel" role="tabpanel" id="pd-panel-miles" aria-labelledby="pd-tab-miles" data-panel="miles" hidden>
          <div data-ref="miles"></div>
        </section>
        <section class="pd-panel" role="tabpanel" id="pd-panel-book" aria-labelledby="pd-tab-book" data-panel="book" hidden>
          <div data-ref="book"></div>
          <p class="progress-note" role="status" aria-live="polite" data-ref="wearStatus"></p>
        </section>
      </div>
    </div>`));
  let l = (e) => c.querySelector(`[data-ref="${e}"]`),
    u = e.achieved ? null : Ei(),
    d = () => e.achieved?.() ?? u?.read().achieved ?? {},
    f = new Map(),
    p = (e, t) => {
      if (f.get(e) === t) return;
      f.set(e, t);
      let n = l(e),
        r = document.activeElement,
        i = r instanceof HTMLElement && n.contains(r) ? r.dataset.fk : void 0;
      n.innerHTML = t;
      for (let e of n.querySelectorAll(`[data-pct]`)) e.style.setProperty(`--pct`, `${e.dataset.pct}%`);
      for (let e of n.querySelectorAll(`[data-bead]`)) {
        let t = Ne.find((t) => t.id === e.dataset.bead);
        if (!t) continue;
        let [n, r, i] = t.colors.bead;
        e.style.background = `radial-gradient(circle at 35% 30%, ${n}, ${r} 55%, ${i})`;
      }
      i && n.querySelector(`[data-fk="${i}"]`)?.focus({ preventScroll: !0 });
    },
    m = (e, t) => {
      let n = l(`badge-${e}`);
      ((n.hidden = t === null), (n.textContent = t ?? ``));
    },
    h = `none`,
    g = 0,
    _ = (e) => {
      let t = Math.max(0, e.remaining);
      (e.tier !== g && ((g = e.tier), (l(`emblem`).innerHTML = Ja(e.tier, 52))),
        l(`arc`).style.setProperty(`--frac`, String(Math.min(1, Math.max(0, e.frac)))),
        (l(`title`).textContent = ue(e.level)),
        (l(`next`).textContent = `còn ${t} tinh tấn tới Cấp ${e.level + 1}`),
        p(
          `meters`,
          `<div class="progress-meter">
        <p class="progress-meter__label"><span>Tới Cấp ${e.level + 1}</span><span>${e.into}/${e.span}</span></p>
        ${xo(e.frac * 100, `Tiến độ tới Cấp ${e.level + 1}`, e.into, e.span, `is-xp`)}
      </div>
      <p class="pd-today" title="Công phu mỗi ngày được tính tối đa ${e.practiceCeiling} tinh tấn, công phu thêm tối đa ${e.practiceMoreCeiling}">
        ${b(`lotus`, { size: 14 })}<span>Công phu hôm nay</span><b>${e.practiceToday}/${e.practiceCeiling}</b>${ss(e)}
      </p>`,
        ),
        p(`tasks`, Oo(e)),
        p(`week`, es(e)),
        p(`book`, rs(e)),
        (l(`dayNote`).textContent = e.returning ? La : (e.occasion ?? ``)),
        p(`streak`, jo(e)),
        p(`special`, Yo(e, h)),
        p(`path`, $o(e)));
      let n = d();
      (p(`miles`, os(e, n)),
        (l(`rule`).textContent = `${ao} Lên Cấp ${e.level + 1} cần 50 × ${e.level} tinh tấn.`),
        m(`today`, e.allDone ? null : `${e.tasksDone}/${e.tasks.length}`));
      let r = [...e.milestones, ...gr(e.streak.best, n)];
      m(`miles`, `${r.filter((e) => e.done).length}/${r.length}`);
    },
    v = [...c.querySelectorAll(`[role="tab"]`)],
    x = (e, t = !1) => {
      for (let n of v) {
        let r = n.dataset.tab === e;
        (n.setAttribute(`aria-selected`, String(r)), (n.tabIndex = r ? 0 : -1), r && t && n.focus());
      }
      for (let t of c.querySelectorAll(`[role="tabpanel"]`)) t.hidden = t.dataset.panel !== e;
      l(`body`).scrollTop = 0;
    };
  (c.querySelector(`[role="tablist"]`)?.addEventListener(`click`, (e) => {
    let t = e.target?.closest(`[role="tab"]`);
    t?.dataset.tab && x(t.dataset.tab);
  }),
    c.querySelector(`[role="tablist"]`)?.addEventListener(`keydown`, (e) => {
      let t = e,
        n = v.findIndex((e) => e.getAttribute(`aria-selected`) === `true`),
        r = -1;
      if (
        (t.key === `ArrowRight`
          ? (r = (n + 1) % v.length)
          : t.key === `ArrowLeft`
            ? (r = (n - 1 + v.length) % v.length)
            : t.key === `Home`
              ? (r = 0)
              : t.key === `End` && (r = v.length - 1),
        r < 0)
      )
        return;
      t.preventDefault();
      let i = v[r]?.dataset.tab;
      i && x(i, !0);
    }));
  let S = !1,
    C = !1,
    w = () => {
      C || r(c);
    };
  (c.addEventListener(`click`, (t) => {
    let n = t.target?.closest(`[data-guide], [data-extra]`);
    if (!n || !c.contains(n)) return;
    let r = o.state(),
      i = n.dataset.extra === void 0 ? r.tasks[Number(n.dataset.guide)] : r.extras[Number(n.dataset.extra)];
    i && ((S = !0), w(), e.guide(i.def.guide));
  }),
    c.addEventListener(`click`, (e) => {
      let t = e.target?.closest(`[data-wear]`);
      if (!t) return;
      let n = t.dataset.wear || null;
      o.setTitle(n);
      let r = o.state().titles.find((e) => e.def.id === n)?.def.name;
      l(`wearStatus`).textContent = r ? `Đang mang danh hiệu "${r}".` : `Đã tháo danh hiệu.`;
    }));
  let D = c.querySelector(`[data-ref="howTo"]`);
  D?.addEventListener(`click`, () => {
    e.levelGuide?.({
      opener: D,
      tasks: () => x(`today`, !0),
      leave: () => {
        ((S = !0), w());
      },
    });
  });
  let k = () => void 0,
    ee = !1,
    A = (t) => {
      ee ||
        C ||
        (e.rewards ?? fs)(t)
          .then((e) => {
            if (!e || C || ee) return;
            ee = !0;
            let t = (e) => {
              C || e.kol.status === h || ((h = e.kol.status), _(o.state()));
            };
            (t(e.snapshot()), (k = e.subscribe(t)));
          })
          .catch((e) => {
            console.error(`Hành trình: không đọc được trạng thái chương trình KOL`, e);
          });
    },
    te = l(`specialStatus`),
    j = !1;
  (c.addEventListener(`click`, (t) => {
    let n = t.target?.closest(`[data-special]`);
    if (!n || !c.contains(n)) return;
    if (n.dataset.special === `fanpage`) {
      (O(`progress_special_open`, { kind: `fanpage` }), N(`quest`));
      return;
    }
    if (j) return;
    let r = n.dataset.special === `kol` ? `kol` : `ref`,
      i = n.dataset.fk ?? ``;
    ((j = !0),
      (te.textContent = ``),
      O(`progress_special_open`, { kind: r }),
      (e.openRewards ?? ds)(r, () => (C ? null : c.querySelector(`[data-fk="${i}"]`)))
        .then(() => A(!0))
        .catch((e) => {
          (console.error(`Hành trình: không mở được bảng chương trình KOL & rủ bạn`, e),
            C || (te.textContent = Ro));
        })
        .finally(() => {
          j = !1;
        }));
  }),
    c.addEventListener(`change`, (e) => {
      let t = e.target;
      t instanceof HTMLInputElement &&
        !t.disabled &&
        t.dataset.pick &&
        (t.dataset.pick === `beads`
          ? o.setEquip({ beads: t.value })
          : t.dataset.pick === `timbre` && o.setEquip({ timbre: t.value }));
    }));
  let M = l(`status`);
  (l(`backup`).addEventListener(`click`, () => {
    try {
      M.textContent = `Đã tải tệp sao lưu: ${(e.backup ?? y)()}`;
    } catch (e) {
      M.textContent = e instanceof Error ? e.message : `Chưa sao lưu được, bạn thử lại nhé.`;
    }
  }),
    (l(`install`).hidden = !(E() && !T())),
    l(`close`).addEventListener(`click`, w),
    a(c));
  let P = () => void 0;
  if (
    (c.addEventListener(`close`, () => {
      ((C = !0),
        P(),
        k(),
        c.remove(),
        ps === c && (ps = null),
        !S && t?.isConnected && t.focus({ preventScroll: !0 }));
    }),
    _(o.state()),
    x(e.tab ?? `today`),
    (P = o.subscribe(_)),
    A(!1),
    (ps = c),
    document.body.append(c),
    i(c),
    e.from === `streak` || e.section === `streak`)
  ) {
    let e = l(`streakTitle`);
    (n(l(`body`), e), e.focus({ preventScroll: !0 }));
  } else l(`title`).focus({ preventScroll: !0 });
  (o.markOpened(), O(`progress_opened`, { from: e.from }), e.onOpened?.());
  let F = !1,
    ne = () => {
      F || o.state().level < 2 || ((F = !0), o.askPersist().catch(() => void 0));
    };
  return (
    c.addEventListener(`pointerup`, ne, !0),
    c.addEventListener(`click`, ne, !0),
    { element: c, close: w }
  );
}
function hs(e, t) {
  if (e === null) return !0;
  let n = e.snoozes >= 3 ? 7 : 1;
  return t - e.last >= n;
}
function gs(e = Date.now(), t) {
  if (f() || d()) return !1;
  let n = me(e);
  try {
    let e = t ?? localStorage,
      r = ye(n, e);
    if (!hs(r, n)) return !1;
    let i = { first: r?.first ?? n, last: n, snoozes: r?.snoozes ?? 0 };
    return (e.setItem(be, JSON.stringify(i)), !0);
  } catch {
    return !1;
  }
}
function _s(e, t = () => gs()) {
  return {
    claim(e) {
      return t() ? (O(`login_nudge`, { card: e, action: `shown` }), !0) : !1;
    },
    open(t) {
      (O(`login_nudge`, { card: t, action: `login` }), e());
    },
  };
}
var vs = (e, t) => e + Math.random() * (t - e),
  ys = (e, t) => e * (1 + vs(-t, t)),
  bs = (e) => (typeof e == `number` ? e : vs(e[0], e[1]));
function xs(e, t, n) {
  e.burst({ ...t, freq: bs(t.freq), peak: bs(t.peak) }, n);
}
function Ss(e) {
  return (t, n) => {
    let r = bs(e.body);
    (xs(t, e.knock, n),
      t.tone(
        {
          type: e.bodyType,
          freq: r,
          ...(e.glide !== 1 && { glideFrom: r * e.glide, glideTime: e.glideTime }),
          peak: bs(e.bodyPeak),
          attack: e.bodyAttack,
          decay: bs(e.bodyDecay),
          ...(e.bodyBeat !== void 0 && { beat: e.bodyBeat }),
        },
        n,
      ));
    let { ratio: i, ...a } = e.over;
    t.tone({ ...a, freq: r * bs(i) }, n);
  };
}
function Cs(e) {
  return (t, n) => {
    (xs(t, e.knock, n), t.tone({ ...e.tone, freq: bs(e.tone.freq) }, n));
  };
}
function ws(e) {
  return (t, n) => {
    let r = ys(e.base, 0.004);
    t.burst(e.knock, n);
    for (let i of e.partials)
      t.tone(
        {
          type: `sine`,
          freq: r * i.ratio,
          peak: i.amp * e.scale,
          attack: e.attack,
          decay: i.decay,
          ...(i.beat !== void 0 && { beat: i.beat }),
        },
        n,
      );
  };
}
var Ts = {
  "mo-go-trac": {
    mo: Ss({
      knock: { filter: `bandpass`, freq: [2200, 3200], q: 2, peak: [0.38, 0.45], attack: 0.001, decay: 0.01 },
      body: [560, 700],
      bodyType: `sine`,
      glide: 1.12,
      glideTime: 0.02,
      bodyPeak: [0.58, 0.68],
      bodyAttack: 0.001,
      bodyDecay: [0.055, 0.085],
      over: { type: `triangle`, ratio: [2.4, 2.8], peak: 0.2, attack: 0.001, decay: 0.03 },
    }),
    bead: Cs({
      knock: { filter: `bandpass`, freq: [2600, 3600], q: 1.6, peak: 0.26, attack: 0.001, decay: 0.014 },
      tone: { type: `sine`, freq: [1800, 2400], peak: 0.12, attack: 0.001, decay: 0.025 },
    }),
  },
  "chuong-dong-lon": {
    mo: Ss({
      knock: {
        filter: `lowpass`,
        freq: [1300, 1700],
        q: 0.7,
        peak: [0.22, 0.26],
        attack: 0.002,
        decay: 0.02,
      },
      body: [190, 230],
      bodyType: `sine`,
      glide: 1,
      glideTime: 0,
      bodyPeak: [0.72, 0.8],
      bodyAttack: 0.004,
      bodyDecay: [0.42, 0.55],
      bodyBeat: 0.8,
      over: { type: `sine`, ratio: [2.7, 2.8], peak: 0.25, attack: 0.002, decay: 0.22 },
    }),
    bead: Cs({
      knock: { filter: `bandpass`, freq: [2200, 3e3], q: 1, peak: 0.16, attack: 0.001, decay: 0.012 },
      tone: { type: `sine`, freq: [300, 360], peak: 0.22, attack: 0.002, decay: 0.2 },
    }),
    bell: ws({
      base: 98,
      knock: { filter: `lowpass`, freq: 1100, q: 0.7, peak: 0.16, attack: 0.003, decay: 0.06 },
      partials: [
        { ratio: 0.5, amp: 0.35, decay: 17, beat: 0.25 },
        { ratio: 1, amp: 1, decay: 15.5, beat: 0.5 },
        { ratio: 1.19, amp: 0.6, decay: 13.5 },
        { ratio: 1.5, amp: 0.5, decay: 12, beat: 0.8 },
        { ratio: 2, amp: 0.45, decay: 10.5 },
        { ratio: 2.6, amp: 0.25, decay: 9.5 },
        { ratio: 3, amp: 0.15, decay: 8.5 },
        { ratio: 4.1, amp: 0.08, decay: 7.5 },
      ],
      scale: 0.26,
      attack: 0.02,
    }),
  },
};
function Es(e) {
  return typeof e == `string` && Object.prototype.hasOwnProperty.call(Ts, e) ? (Ts[e] ?? null) : null;
}
var Ds = 1600,
  Os = 4e3,
  ks = 7e3,
  As = `Đăng nhập để giữ tiến độ`,
  js = `Đăng nhập để giữ Việc tuần`,
  Ms = `Xong cả 3 tâm nguyện tuần này · +30`,
  Ns = `Xong cả 3 việc hôm nay · +30`,
  Ps = (e) => `Đăng nhập để giữ Cấp ${e}`,
  Fs = (e) => `Đăng nhập để giữ chuỗi ${e} ngày`,
  Is = 200,
  Ls = `Đã đủ tinh tấn công phu hôm nay. Thiền, lần tràng hạt, tụng kinh thêm vẫn được tinh tấn (tối đa +150).`,
  Rs = `Hôm nay bạn đã tinh tấn trọn phần, cả phần công phu thêm. Công phu tiếp là cho chính mình.`,
  zs = `Sao lưu hành trình`,
  Bs = `Đã tải tệp sao lưu`,
  Vs = `Chưa sao lưu được, bạn thử lại trong Cài đặt nhé.`,
  Hs = `Trên iPhone: Chia sẻ, rồi Thêm vào màn hình chính để hành trình được giữ lâu hơn.`;
function Us(e, t, n) {
  let r = `Giữ lửa ${e} ngày!`,
    i = ge(e),
    a = eo(e);
  if (t && i) {
    let t = `Lửa lên bậc: ${i.name}`;
    return {
      kind: `streak`,
      title: t,
      sub: `${r}${n > 0 ? ` +${n} tinh tấn` : ``}`,
      ...(a ? { hint: a } : {}),
      live: `${t}. ${r}`,
      backup: !1,
      flame: e,
      big: !0,
    };
  }
  return {
    kind: `streak`,
    title: r,
    sub: a ?? `${i?.name ?? `Lửa`} vẫn sáng. Hẹn bạn ngày mai.`,
    live: r,
    backup: !1,
    flame: e,
  };
}
function Ws(e) {
  let t = [];
  for (let n of e) {
    for (let e of Ne) e.tier === n && t.push(`tràng hạt ${e.name}`);
    for (let e of Pe) e.tier === n && t.push(`tiếng ${e.name.toLowerCase()}`);
  }
  return t.length > 0 ? `Mở khoá: ${t.join(`, `)}` : ``;
}
function Gs(e, t) {
  let n = [];
  for (let r = Math.max(u.basics, Math.floor(e)) + 1; r <= t; r++) for (let e of s(h(r), _)) n.push(e.label);
  return n.length > 0 ? `Đã mở: ${n.join(`, `)}` : ``;
}
function Ks(e, t = !1, n = !1) {
  let r = [],
    i = e.filter((e) => e.kind === `levelUp`);
  if (i.length > 0) {
    let e = i.reduce((e, t) => (t.level >= e.level ? t : e)),
      a = [...new Set(i.filter((e) => e.tierChanged).map((e) => e.tier))].sort((e, t) => e - t),
      o = a.length > 0,
      s = ue(e.level),
      c = o && !e.backfill ? Ws(a) : ``,
      l = Math.min(...i.map((e) => e.from)),
      u = n ? Gs(l, e.level) : ``,
      d = e.backfill ? `Chùa ghi nhận hành trình của bạn: ${s}` : `Lên ${s}`;
    r.push({
      order: z.levelUp,
      card: {
        kind: `levelUp`,
        title: d,
        ...(c ? { sub: c } : {}),
        ...(u ? { opened: u } : {}),
        ...(o && t ? { hint: Hs } : {}),
        live: u ? `${d}. ${u}` : d,
        backup: o,
        ...(e.level >= 3 ? { login: Ps(e.level) } : {}),
        tier: e.tier,
      },
    });
  }
  let a = e.find((e) => e.kind === `streak`),
    o = a ? `streak:${a.days}` : null;
  if (a) {
    let t = e.find((e) => e.kind === `milestone` && e.id === o),
      n = Us(a.days, a.tierUp, t?.kind === `milestone` ? t.xp : 0);
    (a.days >= 3 && (n.login = Fs(a.days)), r.push({ order: z.streak, card: n }));
  }
  let s = e.some((e) => e.kind === `weekAll`),
    c = e.some((e) => e.kind === `allDone`);
  for (let t of e)
    switch (t.kind) {
      case `allDone`:
        if (s) break;
        r.push({
          order: z.allDone,
          card: { kind: `allDone`, title: Ns, live: `Xong cả 3 việc hôm nay`, backup: !1, login: As },
        });
        break;
      case `weekAll`:
        r.push({
          order: z.weekAll,
          card: {
            kind: `weekAll`,
            title: Ms,
            ...(c ? { sub: Ns } : {}),
            live: c ? `Xong cả 3 tâm nguyện tuần này và cả 3 việc hôm nay` : `Xong cả 3 tâm nguyện tuần này`,
            backup: !1,
            login: js,
          },
        });
        break;
      case `task`:
        r.push({
          order: z.task,
          card: {
            kind: `task`,
            title: `Xong việc: ${t.title} · +30`,
            live: `Xong việc: ${t.title}`,
            backup: !1,
          },
        });
        break;
      case `milestone`: {
        if (t.id === o) break;
        let e = t.id.startsWith(`streak:`) ? Number(t.id.slice(7)) : NaN,
          n = Number.isFinite(e) ? ge(e) : null;
        r.push({
          order: z.milestone,
          card: {
            kind: `milestone`,
            title: `Dấu mốc: ${t.title} · +${t.xp}`,
            ...(n ? { sub: `Lửa lên bậc: ${n.name}`, flame: e } : {}),
            backup: !1,
          },
        });
        break;
      }
      case `ceiling`:
        r.push({ order: z.ceiling, card: { kind: `ceiling`, title: t.more ? Rs : Ls, backup: !1 } });
        break;
      case `restDay`:
        r.push({
          order: z.restDay,
          card: {
            kind: `restDay`,
            title: `Hôm qua chùa giữ chỗ cho bạn. Chuỗi ${t.streak} ngày vẫn còn.`,
            backup: !1,
          },
        });
    }
  let l = r.sort((e, t) => e.order - t.order).map((e) => e.card);
  return l.length <= 3 ? l : [...l.slice(0, 2), qs(l.slice(2))];
}
function qs(e) {
  let t = new Set(e.map((e) => e.kind)),
    n = t.size === 1 ? [...t][0] : void 0,
    r = n === `milestone` ? `dấu mốc` : n === `task` ? `việc` : `điều`;
  return { kind: `more`, title: `Và ${e.length} ${r} khác — xem trong Hành trình`, backup: !1 };
}
var Js = (e) => e === `levelUp` || e === `streak` || e === `allDone` || e === `weekAll`;
function Ys(e) {
  let t = e.host ?? e.anchor?.closest(`.hud`) ?? document.body,
    n = !0,
    r = !1,
    i = document.createElement(`div`);
  ((i.className = `progress-live`),
    i.setAttribute(`role`, `status`),
    i.setAttribute(`aria-live`, `polite`),
    t.append(i));
  let a = e.anchor ? document.createElement(`div`) : null;
  a &&
    e.anchor &&
    ((a.className = `progress-chips`), a.setAttribute(`aria-hidden`, `true`), e.anchor.append(a));
  let o = new Set(),
    s = null,
    c = 0,
    l = (e, t) => {
      let n = setTimeout(() => {
        (o.delete(n), e());
      }, t);
      return (o.add(n), n);
    },
    u = (e) => {
      e !== void 0 && (clearTimeout(e), o.delete(e));
    },
    d = () => {
      (s && (u(s.closeTimer), u(s.goneTimer)), (s = null), a?.replaceChildren());
    },
    f = (e, t) => {
      if (!a) return;
      if (!t && s) {
        let t = s;
        ((t.total += e),
          (t.el.textContent = `+${t.total}`),
          (t.el.style.animation = `none`),
          t.el.offsetWidth,
          (t.el.style.animation = ``),
          u(t.closeTimer),
          u(t.goneTimer),
          (t.closeTimer = l(() => {
            s === t && (s = null);
          }, 600)),
          (t.goneTimer = l(() => t.el.remove(), Ds)));
        return;
      }
      let n = document.createElement(`span`);
      for (n.className = `progress-chip`, n.textContent = t ?? `+${e}`, a.append(n); a.childElementCount > 2;)
        a.firstElementChild?.remove();
      let r = {
        el: n,
        total: e,
        closeTimer: l(() => {
          s === r && (s = null);
        }, 600),
        goneTimer: l(() => n.remove(), Ds),
      };
      t || (s = r);
    },
    p = [],
    m = [],
    h = null,
    g = () => {
      h &&= (u(h.timer), h.el.remove(), null);
    },
    _ = (e) => {
      e && (i.textContent = e);
    },
    v = () => {
      if (r || !n || h || e.quiet()) return;
      m.length === 0 && p.length > 0 && (m = Ks(p.splice(0), E() && !T(), e.showUnlocks?.() ?? !1));
      let t = m.shift();
      t && S(t);
    },
    x = (e) => {
      h === e &&
        (u(e.timer),
        e.el.classList.add(`is-leaving`),
        (e.timer = l(() => {
          (e.el.remove(), h === e && (h = null), v());
        }, Is)));
    };
  function S(n) {
    let r = document.createElement(`div`),
      i = { el: r };
    if (
      ((r.className = `progress-card`),
      (r.dataset.kind = n.kind),
      n.big && (r.dataset.big = ``),
      r.setAttribute(`role`, `group`),
      r.setAttribute(`aria-label`, `Hành trình`),
      n.tier !== void 0 || n.flame !== void 0)
    ) {
      let e = document.createElement(`span`);
      ((e.className = `progress-card__emblem`),
        e.setAttribute(`aria-hidden`, `true`),
        (e.innerHTML =
          n.flame === void 0
            ? Ja(n.tier ?? 1, n.kind === `levelUp` ? 48 : 30)
            : Za(n.flame, `lit`, n.kind === `streak` ? `is-burst` : ``)),
        r.append(e));
    }
    let a = document.createElement(`div`);
    a.className = `progress-card__body`;
    let o = document.createElement(`p`);
    if (((o.className = `progress-card__title`), (o.textContent = n.title), a.append(o), n.sub)) {
      let e = document.createElement(`p`);
      ((e.className = `progress-card__sub`), (e.textContent = n.sub), a.append(e));
    }
    if (n.opened) {
      let e = document.createElement(`p`);
      ((e.className = `progress-card__opened`), (e.textContent = n.opened), a.append(e));
    }
    if (n.hint) {
      let e = document.createElement(`p`);
      ((e.className = `progress-card__hint`), (e.textContent = n.hint), a.append(e));
    }
    let { login: s } = e,
      c = n.kind,
      d = n.login !== void 0 && s !== void 0 && Js(c) && s.claim(c);
    if (d) {
      let e = document.createElement(`button`);
      ((e.type = `button`),
        (e.className = `progress-card__login`),
        (e.textContent = n.login ?? ``),
        e.addEventListener(`click`, () => {
          (Js(c) && s?.open(c), x(i));
        }),
        a.append(e));
    } else if (n.backup) {
      let t = document.createElement(`button`);
      ((t.type = `button`),
        (t.className = `progress-card__backup`),
        (t.textContent = zs),
        t.addEventListener(`click`, () => {
          if (t.getAttribute(`aria-disabled`) !== `true`)
            try {
              ((e.backup ?? y)(), (t.textContent = Bs), t.setAttribute(`aria-disabled`, `true`));
            } catch {
              t.textContent = Vs;
            }
        }),
        a.append(t));
    }
    r.append(a);
    let f = document.createElement(`button`);
    ((f.type = `button`),
      (f.className = `progress-card__close`),
      f.setAttribute(`aria-label`, `Đóng`),
      (f.innerHTML = b(`close`, { size: 18 })),
      r.append(f),
      (h = i),
      t.append(r),
      _(n.live));
    let p = d ? ks : Os,
      m = () => {
        (u(i.timer), (i.timer = l(() => x(i), p)));
      },
      g = () => u(i.timer);
    (r.addEventListener(`pointerenter`, g),
      r.addEventListener(`pointerleave`, m),
      r.addEventListener(`focusin`, g),
      r.addEventListener(`focusout`, m),
      f.addEventListener(`click`, () => x(i)),
      m());
  }
  let C = e.quiet(),
    w = e.onQuietChange(() => {
      let t = e.quiet();
      t !== C && ((C = t), !r && n && (t ? (d(), g()) : (c > 0 && (f(c, `+${c} tinh tấn`), (c = 0)), v())));
    });
  return {
    xp(t) {
      if (r || !n || !(t > 0)) return;
      let i = Math.floor(t);
      i <= 0 || (e.quiet() ? (c += i) : f(i));
    },
    push(e) {
      !r && n && e.length !== 0 && (p.push(...e), v());
    },
    setEnabled(e) {
      r || e === n || ((n = e), e || (d(), g(), (p = []), (m = []), (c = 0), (i.textContent = ``)));
    },
    dispose() {
      if (!r) {
        ((r = !0), w());
        for (let e of o) clearTimeout(e);
        (o.clear(), h?.el.remove(), (h = null), a?.remove(), i.remove());
      }
    },
  };
}
var Xs = `chua-online:tracker`,
  Zs = (e) => e.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
function Qs() {
  try {
    return typeof localStorage > `u` ? null : localStorage;
  } catch {
    return null;
  }
}
function $s(e, t) {
  let n = Zs(e.text);
  return (e.kind === `live` && t) || e.kind === `notice`
    ? `<li><button type="button" class="ptrack__line" data-line="${e.kind}"><span class="ptrack__text">${n}</span></button></li>`
    : `<li class="ptrack__line">${n}</li>`;
}
function ec(e) {
  let t = e.weekly;
  return t
    ? t.fresh
      ? `<p class="ptrack__week">${Zs(za)}</p>`
      : `<p class="ptrack__week"><span class="ptrack__dots" aria-hidden="true">${t.tasks.map((e) => `<i class="ptrack__dot${e.done ? ` is-done` : ``}"></i>`).join(``)}</span><span>Tuần này ${t.done}/${t.tasks.length}</span></p>`
    : ``;
}
function tc(e, t, n) {
  let r = e.tasks
      .map((e, t) => {
        let { def: n, done: r, current: i } = e,
          a = n.goal > 1 && !r ? `<span class="ptrack__step">${i}/${n.goal}</span>` : ``,
          o = r
            ? `<span class="ptrack__ok" aria-hidden="true">${b(`check`, { size: 16 })}</span>`
            : `<button type="button" class="ptrack__go" data-guide="${t}" aria-label="${Zs(`${Xa(n)}: ${n.title}`)}">${Zs(Xa(n))}${b(`chevron-right`, { size: 14 })}</button>`;
        return `
        <li class="ptrack__task" data-done="${r}" data-key="${Zs(n.id)}">
          <span class="ptrack__icon" aria-hidden="true">${b(Ya(n), { size: 18 })}</span>
          <span class="ptrack__title"><span class="ptrack__sr">${r ? `Đã xong: ` : `Chưa xong: `}</span>${Zs(n.title)}${a}</span>
          <span class="ptrack__xp" aria-hidden="true">+30</span>
          ${o}
        </li>`;
      })
      .join(``),
    i = e.tasks.map((e) => `<i class="ptrack__dot${e.done ? ` is-done` : ``}"></i>`).join(``),
    a = e.allDone
      ? `<p class="ptrack__bonus is-done">${b(`check`, { size: 16 })}<span>Xong cả 3 việc hôm nay. Hẹn bạn ngày mai!</span></p>`
      : `<p class="ptrack__bonus"><span class="ptrack__dots" aria-hidden="true">${i}</span><span>Xong cả 3: <b>+30</b> tinh tấn</span></p>`,
    o = e.returning ? `<p class="ptrack__hello">${Zs(La)}</p>` : ``,
    s = t
      .filter((e) => e.kind !== `return`)
      .slice(0, 2)
      .map((e) => $s(e, n))
      .join(``);
  return `${o}<ul class="ptrack__tasks">${r}</ul>${a}${ec(e)}<ul class="ptrack__lines">${s}</ul>`;
}
function nc(e) {
  let t = e.anchor,
    n = e.storage === void 0 ? Qs() : e.storage;
  if (!t)
    return { update: () => void 0, setNotice: () => void 0, refresh: () => void 0, dispose: () => void 0 };
  let r = t,
    i = !1;
  try {
    i = n?.getItem(Xs) === `min`;
  } catch {}
  let a = document.createElement(`section`);
  ((a.className = `ptrack`),
    a.setAttribute(`aria-label`, `Việc hôm nay`),
    (a.hidden = !0),
    (a.innerHTML = `
    <div class="ptrack__head">
      <button type="button" class="ptrack__who" data-ref="who">
        <span class="ptrack__ring" aria-hidden="true">
          <svg viewBox="0 0 44 44"><circle class="ptrack__track" cx="22" cy="22" r="20" pathLength="1"/><circle class="ptrack__arc" data-ref="arc" cx="22" cy="22" r="20" pathLength="1"/></svg>
          <span class="ptrack__art" data-ref="art"></span>
        </span>
        <span class="ptrack__id">
          <span class="ptrack__name" data-ref="name" hidden></span>
          <span class="ptrack__lvl" data-ref="lvl"></span>
          <span class="ptrack__honor" data-ref="honor" hidden></span>
          <span class="ptrack__mini" data-ref="mini"></span>
        </span>
      </button>
      <div class="ptrack__stats">
        <span class="ptrack__meter" data-ref="meter">
          <span class="ptrack__bar" aria-hidden="true"><i data-ref="bar"></i></span>
          <span class="ptrack__num" data-ref="num"></span>
        </span>
        <button type="button" class="ptrack__streak" data-ref="streak" hidden><span class="flame-box" data-ref="flame">${xe}</span><b data-ref="streakNum" aria-hidden="true"></b></button>
      </div>
      <button type="button" class="ptrack__toggle" data-ref="toggle"></button>
    </div>
    <div class="ptrack__body" id="ptrack-body" data-ref="body"></div>`));
  let o = (e) => a.querySelector(`[data-ref="${e}"]`),
    s = document.createElement(`span`);
  ((s.className = `ptrack-badges`), s.setAttribute(`aria-hidden`, `true`));
  let c = document.createElement(`span`);
  ((c.className = `ptrack-count`), (c.hidden = !0), s.append(c));
  let l = document.createElement(`button`);
  ((l.type = `button`), (l.className = `ptrack-line`), (l.hidden = !0));
  let u = document.createElement(`span`);
  ((u.className = `ptrack__text`), l.append(u));
  let d = document.createElement(`p`);
  ((d.className = `ptrack__sr`),
    d.setAttribute(`aria-live`, `polite`),
    r.append(a, s, l, d),
    (r.dataset.tracker = i ? `min` : `open`));
  let f = o(`toggle`);
  f.setAttribute(`aria-controls`, `ptrack-body`);
  let p = () => {
    ((a.dataset.state = i ? `min` : `open`),
      (r.dataset.tracker = a.dataset.state),
      f.setAttribute(`aria-expanded`, String(!i)),
      f.setAttribute(`aria-label`, i ? `Mở rộng việc hôm nay` : `Thu gọn việc hôm nay`),
      (f.innerHTML = b(`chevron-down`, { size: 18 })));
  };
  (p(),
    f.addEventListener(`click`, () => {
      i = !i;
      try {
        n?.setItem(Xs, i ? `min` : `open`);
      } catch {}
      p();
    }),
    o(`who`).addEventListener(`click`, () => e.open()),
    o(`meter`).addEventListener(`click`, () => e.open()));
  let m = o(`streak`),
    h = o(`flame`);
  (m.addEventListener(`click`, () => e.open(!0)),
    h.addEventListener(`animationend`, () => h.classList.remove(`is-burst`)));
  let g = null,
    _ = null,
    v = e.now ?? Date.now,
    y = e.listen,
    x = null,
    S = (t) => {
      t === `live` ? y?.() : e.open();
    };
  (a.addEventListener(`click`, (t) => {
    let n = t.target,
      r = n?.closest(`[data-line]`);
    if (r) {
      S(r.dataset.line);
      return;
    }
    let i = n?.closest(`[data-guide]`);
    if (!i || !g) return;
    let a = g.tasks[Number(i.dataset.guide)];
    a && !a.done && e.guide(a.def.guide);
  }),
    l.addEventListener(`click`, () => S(x ?? void 0)));
  let C = ``,
    w = 0,
    T = -1,
    E = new Set(),
    D = !1,
    O = (t) => {
      let n = Va({ nowMs: v(), returning: t.returning, notice: _, occasion: t.occasion }),
        r = Ha(e.quiet?.() === !0 ? n.filter((e) => e.kind !== `live`) : n);
      return (
        (x = r?.kind ?? null),
        (l.hidden = r === null),
        (u.textContent = r?.text ?? ``),
        (l.dataset.kind = r?.kind ?? ``),
        n
      );
    },
    k = setInterval(() => {
      g && A(g);
    }, 6e4),
    ee = {
      update(e) {
        ((g = e),
          e
            ? A(e)
            : ((a.hidden = !0), (c.hidden = !0), (l.hidden = !0), (T = -1), delete r.dataset.trackerOn));
      },
      setNotice(e) {
        ((_ = e), e && (d.textContent = e), g && A(g));
      },
      refresh() {
        g && A(g);
      },
      dispose() {
        (clearInterval(k),
          a.remove(),
          s.remove(),
          l.remove(),
          d.remove(),
          delete r.dataset.tracker,
          delete r.dataset.trackerOn);
      },
    };
  function A(t) {
    ((a.hidden = !1),
      (r.dataset.trackerOn = ``),
      t.tier !== w && ((w = t.tier), (o(`art`).innerHTML = Ja(t.tier, 30))));
    let n = t.level + 1,
      i = (e.name?.() ?? ``).trim(),
      s = o(`name`);
    ((s.hidden = i === ``),
      (s.textContent = i),
      (a.dataset.named = i === `` ? `no` : `yes`),
      (o(`lvl`).innerHTML = `<b>Cấp ${t.level}</b> · ${Zs(t.tierName)}`));
    let l = t.title ? t.titles.find((e) => e.def.id === t.title)?.def.name : void 0,
      u = o(`honor`);
    ((u.hidden = !l),
      (u.textContent = l ?? ``),
      (o(`num`).textContent = `${t.into}/${t.span}`),
      (o(`meter`).title = `Còn ${t.remaining} tinh tấn tới Cấp ${n}`));
    let d = t.weekly ? ` · ${t.weekly.done}/${t.weekly.tasks.length} tuần` : ``;
    ((o(`mini`).textContent =
      (t.allDone ? `Xong việc hôm nay` : `Việc hôm nay ${t.tasksDone}/${t.tasks.length}`) + d),
      o(`who`).setAttribute(
        `aria-label`,
        `Mở Hành trình: ${i ? `${i}, ` : ``}Cấp ${t.level}, ${t.tierName}${l ? `, danh hiệu ${l}` : ``}, còn ${t.remaining} tinh tấn tới Cấp ${n}. Việc hôm nay ${t.tasksDone}/${t.tasks.length}.${t.weekly ? ` Việc tuần ${t.weekly.done}/${t.weekly.tasks.length}.` : ``}`,
      ));
    let { current: f, best: p, practicedToday: g } = t.streak;
    ((m.hidden = f < 1 && p < 1),
      Se(h, f, g),
      (o(`streakNum`).textContent = String(f)),
      (m.title = no(f, g)),
      m.setAttribute(`aria-label`, ke(f, g, $a(f))),
      T >= 0 && f > T && (h.classList.remove(`is-burst`), h.offsetWidth, h.classList.add(`is-burst`)),
      (T = f));
    let _ = Math.min(1, Math.max(0, t.frac));
    (o(`arc`).style.setProperty(`--frac`, String(_)), o(`bar`).style.setProperty(`--frac`, String(_)));
    let v = tc(t, O(t), y !== void 0);
    if (v !== C) {
      C = v;
      let e = o(`body`);
      e.innerHTML = v;
      let n = new Set(t.tasks.filter((e) => e.done).map((e) => e.def.id));
      if (D)
        for (let t of e.querySelectorAll(`.ptrack__task[data-done="true"]`))
          E.has(t.dataset.key ?? ``) || t.classList.add(`is-fresh`);
      E = n;
    }
    ((D = !0), (c.hidden = t.allDone), (c.textContent = `${t.tasksDone}/${t.tasks.length}`));
  }
  return ee;
}
var rc = e({ startProgressRuntime: () => oc });
function ic(e = Te()) {
  let t = Array.isArray(e.badges) ? e.badges : [],
    n = typeof e.referralCount == `number` && Number.isFinite(e.referralCount) ? e.referralCount : 0;
  return { friends: Math.max(n, t.includes(`bandao`) ? 3 : 0), kol: t.includes(`kol`) };
}
function ac(e) {
  return {
    level: e.level,
    frac: e.frac,
    tier: e.tier,
    remaining: e.remaining,
    streak: e.streak.current,
    best: e.streak.best,
    lit: e.streak.practicedToday,
    tasksDone: e.tasksDone,
    day: e.today,
  };
}
function oc(e) {
  let { store: n, hud: r } = e,
    i = Ei(),
    a =
      e.engine ??
      oi({
        store: n,
        counters: i,
        track: O,
        registerProps: c,
        ...(e.taskLevel ? { taskLevel: e.taskLevel } : {}),
        special: () => ({ ...ic(), fanpage: ie() }),
        onSpecialChange: (e) => {
          let t = Ce(e),
            n = ne(e);
          return () => {
            (t(), n());
          };
        },
      }),
    o = e.counters ?? i,
    s = e.visible ?? (() => document.visibilityState === `visible`),
    l = document.documentElement,
    u = Ys({
      anchor: r.progressAnchor(),
      quiet: e.quiet,
      onQuietChange: e.onQuietChange,
      ...(e.showUnlocks ? { showUnlocks: e.showUnlocks } : {}),
      ...(e.openLogin ? { login: _s(e.openLogin) } : {}),
    }),
    d = nc({
      anchor: r.progressAnchor(),
      quiet: e.quiet,
      open: (e) => void F(e ? `streak` : `tracker`).catch(() => void 0),
      guide: e.guide,
      ...(e.openListen ? { listen: e.openListen } : {}),
      ...(e.name ? { name: e.name } : {}),
    }),
    f = !1,
    p = n.getSettings().progressUi,
    m = 0,
    h = null,
    g = !1,
    _ = o.read().seen.openedDay,
    v,
    y,
    b = (t) => {
      let n = Re(t.equip, t.unlockedTier);
      n !== v && (l.dataset.beadSkin = v = n);
      let r = ze(t.equip, t.unlockedTier);
      r !== y && ((y = r), e.setTimbre?.(Es(r)));
    },
    x = (e) => p && !e.readOnly,
    S = [],
    C = null,
    T = (e) => r.setProgressDot(x(e) && (_ !== e.today || C !== null)),
    E = () => {
      f ||
        S.length === 0 ||
        e.quiet() ||
        ((C = S[S.length - 1] ?? null), (S = []), d.setNotice(C), T(a.state()));
    },
    D = (t) => {
      if (f) return;
      let n = x(t);
      (b(t),
        n ? r.setProgress(ac(t), ro(t.streak.current, t.streak.practicedToday)) : r.setProgress(null),
        d.update(n ? t : null),
        T(t),
        t.level > m && ((m = t.level), e.onLevelChange(t.level)),
        n && h !== null && t.xp > h && s() && u.xp(t.xp - h),
        (h = t.xp),
        t.special.fanpage.done && !g && !ie() && ((g = !0), re()));
    },
    k = () => {
      let e = a.takeNotices();
      e.length > 0 && x(a.state()) && (S.push(...e.map((e) => e.text)), E());
      let t = a.takeCelebrations();
      t.length !== 0 && x(a.state()) && u.push(t);
    };
  D(a.state());
  let ee = a.subscribe(D),
    A = a.onCelebrate(k),
    te = e.onQuietChange(E);
  k();
  let j = n.subscribe(() => {
      let e = n.getSettings().progressUi;
      if (e === p) return;
      ((p = e), u.setEnabled(e));
      let t = a.state();
      ((h = t.xp), D(t));
    }),
    M = (e) => {
      (e.key === null || e.key === `chua-online:progress`) && ((_ = o.read().seen.openedDay), T(a.state()));
    };
  window.addEventListener(`storage`, M);
  let N = null,
    P = !1;
  async function F(n, r) {
    if (!(f || P || N?.element.isConnected)) {
      P = !0;
      try {
        let { openProgressDialog: i } = await (
          e.loadDialog ?? (() => t(() => Promise.resolve().then(() => io), void 0, import.meta.url))
        )();
        if (f) return;
        N = i({
          engine: a,
          from: n,
          ...(r ? { section: r } : {}),
          guide: e.guide,
          achieved: () => o.read().achieved,
          onOpened: () => {
            ((_ = a.state().today), (C = null), d.setNotice(null), T(a.state()));
          },
          levelGuide: (e) => {
            ae(
              { kind: `level`, level: a.state().level + 1 },
              { opener: e.opener, tasks: e.tasks, before: e.leave },
            ).catch((e) => console.error(`Không mở được hướng dẫn`, e));
          },
        });
      } finally {
        P = !1;
      }
    }
  }
  let I = null;
  async function ae(r, i = {}) {
    if (f || i.signal?.aborted) return;
    let { openLevelGuideSheet: o } = await (
      e.loadGuide ?? (() => t(() => Promise.resolve().then(() => Bi), void 0, import.meta.url))
    )();
    if (f || i.signal?.aborted) return;
    let s = () => {
      let e = a.state();
      return e.readOnly ? null : e;
    };
    I?.abort();
    let c = new AbortController();
    I = c;
    let l = () => c.abort();
    (i.signal?.addEventListener(`abort`, l, { once: !0 }),
      c.signal.addEventListener(`abort`, () => i.signal?.removeEventListener(`abort`, l), { once: !0 }),
      o({
        need: r,
        item: i.item,
        opener: i.opener,
        fallbackFocus: i.fallbackFocus,
        signal: c.signal,
        state: s,
        subscribe: (e) => {
          let t = a.subscribe(() => e()),
            r = n.subscribe(() => e());
          return () => {
            (t(), r());
          };
        },
        unlocks: Te,
        onUnlocksChange: Ce,
        progressHidden: () => !n.getSettings().progressUi,
        settings: e.openSettings !== void 0,
        featureOpen: (t) => {
          let n = e.taskLevel?.() ?? null;
          return w(t, n, { all: n === null });
        },
        go: (t) => {
          f ||
            c.signal.aborted ||
            (t.kind === `tasks` && i.tasks
              ? i.tasks()
              : (i.before?.(),
                t.kind === `do`
                  ? e.guide(t.target)
                  : t.kind === `settings`
                    ? e.openSettings?.()
                    : oe(t.kind === `streak` ? `streak` : void 0)));
        },
      }));
  }
  function oe(e) {
    let t = () => void F(`guide`, e).catch(() => void 0),
      n = N?.element;
    n?.isConnected ? n.addEventListener(`close`, t, { once: !0 }) : t();
  }
  return {
    engine: a,
    open: F,
    guide: ae,
    profileChanged() {
      f || d.refresh();
    },
    dispose() {
      f ||
        ((f = !0),
        ee(),
        A(),
        te(),
        j(),
        window.removeEventListener(`storage`, M),
        u.dispose(),
        d.dispose(),
        delete l.dataset.beadSkin,
        e.setTimbre?.(null),
        N?.close(),
        I?.abort(),
        (I = null),
        r.setProgress(null),
        r.setProgressDot(!1),
        a.dispose());
    },
  };
}
export { Di as n, si as r, rc as t };
