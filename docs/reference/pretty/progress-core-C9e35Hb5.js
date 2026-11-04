import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { N as t, O as n, k as r } from "./index-e_Bx6V48.js";
var i = `chua-online:progress`,
  a = [
    `visit`,
    `incense`,
    `flowers`,
    `candle`,
    `lantern`,
    `que`,
    `today`,
    `greet`,
    `quanam`,
    `seatSeconds`,
    `listenSeconds`,
    `communitySeconds`,
    `sweep`,
    `sweepDay`,
    `mindfulSeconds`,
    `release`,
    `loc`,
    `ribbon`,
  ],
  o = [
    { id: `yard`, action: `goYard`, name: `Sân trước & hồ sen` },
    { id: `bodhi`, action: `goBodhi`, name: `Cây bồ đề` },
    { id: `meditate`, action: `goMeditate`, name: `Sân thiền` },
    { id: `quanam`, action: `goQuanAm`, name: `Quan Âm` },
    { id: `well`, action: `goWell`, name: `Giếng ngọc` },
    { id: `hall`, action: `goHall`, name: `Chánh điện` },
  ],
  s = (1 << o.length) - 1,
  c = { levelUp: 0, streak: 1, weekAll: 2, allDone: 3, task: 4, milestone: 5, ceiling: 6, restDay: 7 },
  l = e({
    LEVEL_MAX_WIRE: () => 999,
    LEVEL_MIN: () => 1,
    TIERS: () => u,
    levelLabel: () => m,
    sanitizeLevel: () => p,
    tierMinLevel: () => f,
    tierOf: () => d,
  }),
  u = [
    { id: 1, name: `Hạt sen`, minLevel: 1, color: `#8a6a4a`, accent: `#c9a77c` },
    { id: 2, name: `Mầm sen`, minLevel: 5, color: `#6f9a4e`, accent: `#b9d79a` },
    { id: 3, name: `Lá sen`, minLevel: 10, color: `#3f8a5c`, accent: `#93c9a4` },
    { id: 4, name: `Nụ sen`, minLevel: 15, color: `#d77a95`, accent: `#f4c2cf` },
    { id: 5, name: `Sen hé`, minLevel: 20, color: `#e0708f`, accent: `#f8d2dc` },
    { id: 6, name: `Sen nở`, minLevel: 30, color: `#e8899f`, accent: `#f6d48a` },
    { id: 7, name: `Sen ngàn cánh`, minLevel: 50, color: `#d9a641`, accent: `#f7e3a4` },
  ];
function d(e) {
  let t = Math.max(1, Math.floor(e) || 1),
    n = u[0];
  for (let e of u) t >= e.minLevel && (n = e);
  return n;
}
function f(e) {
  return u[Math.min(u.length, Math.max(1, Math.floor(e) || 1)) - 1].minLevel;
}
function p(e) {
  return typeof e == `number` && Number.isInteger(e) && e >= 1 && e <= 999 ? e : void 0;
}
function m(e) {
  return `Cấp ${Math.max(1, Math.floor(e))} · ${d(e).name}`;
}
var h = e({ counters: () => w, createCounters: () => C, createSecondsCounter: () => T }),
  g = /^\d{4}-\d{2}-\d{2}$/,
  _ = 2 ** 53 - 1,
  v = 2147483647,
  y = [
    [`level`, v, 1],
    [`frac`, 1, 0],
    [`tier`, 7, 1],
    [`remaining`, v, 50],
    [`streak`, v, 0],
    [`best`, v, 0],
    [`tasksDone`, 3, 0],
  ],
  b = (e, t) => (r(e[t]) ? e[t] : (e[t] = {})),
  x = (e, t) => Math.min((typeof e == `number` && e > 0 ? Math.floor(e) : 0) + t, _),
  S = (e, t) => (typeof e == `number` ? e : 0) | t;
function C(e = {}) {
  let a = e.storage === void 0 ? n() : e.storage,
    o = e.now ?? Date.now,
    s = null,
    c = !1,
    l = ``,
    u = 0,
    d = new Set(),
    f = () => t(new Date(o()));
  function p() {
    let e = c ? s : null;
    if (!c)
      try {
        e = JSON.parse(a?.getItem(`chua-online:progress`) || `null`);
      } catch {}
    let t = r(e) ? e : { v: 1 };
    return typeof t.v == `number` && t.v > 1 ? null : t;
  }
  let m = () => {
      for (let e of [...d])
        try {
          e();
        } catch (e) {
          console.error(e);
        }
    },
    h = (e) => {
      let { key: t } = e;
      (t === null || t === `chua-online:progress`) && m();
    };
  function v(e) {
    let t = p();
    if (!t) return !1;
    (e(t), (t.v = 1), (s = t));
    let n = !1;
    try {
      (a?.setItem(i, JSON.stringify(t)), (n = !!a));
    } catch {}
    return ((c = !n), m(), n);
  }
  return {
    dayKey: f,
    bump(e, t = 1) {
      let n = Math.floor(t);
      if (!(n > 0 && n <= _)) return;
      let r = f();
      v((t) => {
        let i = b(b(t, `days`), r);
        if (e === `visit` && i.visit) return;
        i[e] = x(i[e], n);
        let a = b(t, `life`);
        a[e] = x(a[e], n);
      });
    },
    markSpot(e) {
      if (e >>> 0 !== e || e > 30) return;
      let t = f();
      t !== l && ([l, u] = [t, 0]);
      let n = 1 << e;
      u & n ||
        ((u |= n),
        v((e) => {
          let r = b(b(e, `days`), t);
          ((r.spots = S(r.spots, n)), (e.spots = S(e.spots, n)));
        }));
    },
    view() {
      let e = p(),
        t = e?.view,
        n = { best: r(e?.best) ? e.best.streak : 0, ...(r(t) ? t : {}) },
        i = typeof n.day == `string` && g.test(n.day) ? n.day : null,
        a = { day: i, lit: n.lit === !0 && i === f() };
      for (let [e, t, r] of y) {
        let i = n[e];
        a[e] = (typeof i == `number` && i > 0 ? Math.min(e === `frac` ? i : Math.floor(i), t) : 0) || r;
      }
      return a;
    },
    onChange(e) {
      let t = () => e();
      return (
        d.size || window.addEventListener(`storage`, h),
        d.add(t),
        () => {
          (d.delete(t), d.size || window.removeEventListener(`storage`, h));
        }
      );
    },
    raw: p,
    edit: v,
  };
}
var w = C();
function T(e, t) {
  let n = 0,
    r = () => {
      let r = Math.floor(n);
      r <= 0 || ((n -= r), e.bump(t, r));
    };
  return {
    add(e) {
      e > 0 && Number.isFinite(e) && ((n += e), n >= 30 && r());
    },
    flush: r,
  };
}
var E = `Chưa mở được hướng dẫn, bạn thử lại nhé.`,
  D = `Chưa mở được Hành trình, bạn thử lại nhé.`,
  O = null,
  k = !1;
function A(e) {
  O = e;
}
async function j(e, t) {
  if (!k) {
    k = !0;
    try {
      if (!O) throw Error(`Chưa đăng ký bộ nạp Hành trình`);
      await (await O()).open(e);
    } catch (e) {
      (console.error(`Không mở được Hành trình`, e), t?.(D));
    } finally {
      k = !1;
    }
  }
}
async function M(e, t = {}) {
  let n = document.activeElement,
    r = t.opener === void 0 ? (n instanceof HTMLElement ? n : null) : t.opener;
  try {
    if (!O) throw Error(`Chưa đăng ký bộ nạp Hành trình`);
    return (await (await O()).guide(e, { ...t, opener: r }), !0);
  } catch (e) {
    return (console.error(`Không mở được hướng dẫn`, e), t.onFail?.(E), !1);
  }
}
var N = `chua-online:progress-hint`,
  P = `Bấm vào nút cấp của bạn ở góc trên bên trái để xem "Việc hôm nay".`;
function F(e) {
  return e.view().day === null || e.raw()?.firstDay === e.dayKey();
}
function I(e) {
  let t = e.view();
  return t.day === null || e.raw() === null ? void 0 : t.level;
}
async function L(e, t, n) {
  let r,
    i = new Promise((e) => {
      r = setTimeout(() => e(n), t);
    });
  try {
    return await Promise.race([e, i]);
  } finally {
    clearTimeout(r);
  }
}
export {
  o as S,
  d as _,
  j as a,
  a as b,
  L as c,
  T as d,
  u as f,
  f as g,
  p as h,
  M as i,
  w as l,
  l as m,
  P as n,
  I as o,
  m as p,
  F as r,
  A as s,
  N as t,
  h as u,
  s as v,
  i as x,
  c as y,
};
