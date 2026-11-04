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
      "./rituals-DFATLOei.js",
      "./water-paths-DYM7yuBe.js",
      "./rituals-CrEmldgK.css",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { t } from "./preload-helper-CRzLMJPS.js";
import { a as n } from "./referral-CM6Fj8ux.js";
import { gt as r, rt as i, wt as a } from "./index-e_Bx6V48.js";
import {
  D as o,
  E as s,
  F as c,
  H as l,
  V as u,
  X as d,
  Y as f,
  Z as p,
  a as m,
  m as h,
  mt as g,
  o as _,
  ut as v,
  v as y,
  z as b,
} from "./three-BbSp8N3g.js";
import { s as x } from "./lazy-shared-D8DtrU9N.js";
import { f as S } from "./progress-core-C9e35Hb5.js";
import { B as C, M as w, N as T, k as E } from "./app-z_oU8L_u.js";
var D = `Chùa Sen`,
  O = `Đã chép link, dán vào Zalo`,
  k = `Đã sao chép liên kết`;
function A(e = `https://chuasen.com`, t = location) {
  let n = e?.trim(),
    r = n ? j(n) : null;
  return r && (r.protocol === `https:` || r.protocol === `http:`)
    ? `${r.origin}${r.pathname.replace(/\/+$/, ``)}/`
    : `${t.origin}${t.pathname.replace(/[^/]*$/, ``)}`;
}
function j(e) {
  try {
    return new URL(e);
  } catch {
    return null;
  }
}
function M(e, t) {
  let n = new URL(e);
  return ((n.search = ``), (n.hash = ``), n.searchParams.set(`ref`, t), n.toString());
}
function N(e) {
  return e.replace(/^https?:\/\//, ``).replace(/^www\./, ``);
}
function P(e) {
  return new URL(e).hostname.replace(/^www\./, ``);
}
function F(e) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(e)}`;
}
function I(e) {
  return `fb-messenger://share?link=${encodeURIComponent(e)}`;
}
function ee(e) {
  return `chua-sen-${new Date(e + 252e5).toISOString().slice(0, 10)}.png`;
}
function te(e) {
  return `${e} tại Chùa Sen. Cùng tu tập với mình nhé!`;
}
function ne(e) {
  let t = e.userAgent;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(t) || (/Macintosh/.test(t) && e.maxTouchPoints > 1);
}
function re(e) {
  return typeof e.share == `function`;
}
function ie(e, t) {
  if (!t || typeof e.share != `function` || typeof e.canShare != `function`) return !1;
  try {
    return e.canShare({ files: [t] });
  } catch {
    return !1;
  }
}
async function ae(e, t) {
  let n = e.navigator.clipboard;
  if (n && typeof n.writeText == `function`)
    try {
      return (await n.writeText(t), !0);
    } catch {}
  return e.legacyCopy(t);
}
var oe = (e) => typeof e == `object` && !!e && e.name === `AbortError`;
async function se(e, t) {
  let n = e.navigator;
  if (typeof n.share == `function`) {
    let e = ie(n, t.file)
      ? { files: [t.file], title: D, text: `${t.text} ${t.link}` }
      : { title: D, text: t.text, url: t.link };
    try {
      return (await n.share(e), `shared`);
    } catch (e) {
      if (oe(e)) return `cancelled`;
    }
  }
  return (await ae(e, t.link)) ? `copied` : `failed`;
}
async function ce(e, t, n) {
  switch (t) {
    case `facebook`:
      return (e.open(F(n.link)), `opened`);
    case `messenger`:
      return (e.assign(I(n.link)), `opened`);
    case `download`:
      return n.blob ? (e.download(n.blob, n.fileName), `downloaded`) : `failed`;
    case `zalo`:
    case `copy`:
      return (await ae(e, n.link)) ? `copied` : `failed`;
  }
}
var L = {
  feed: { width: 1080, height: 1350, photo: 620, top: 64, bottom: 70, scale: 1, teachingLines: 2 },
  story: { width: 1080, height: 1920, photo: 1e3, top: 230, bottom: 300, scale: 1.05, teachingLines: 3 },
};
function le(e) {
  return `Cấp ${e.value} · ${e.tierName}`;
}
function ue(e) {
  return `${x(e)} ngày liên tiếp`;
}
var de = `…`;
function fe(e, t, n) {
  if (e(t) <= n) return t;
  let r = Array.from(t),
    i = (e) => `${r.slice(0, e).join(``).trimEnd()}${de}`,
    a = 0,
    o = r.length - 1;
  for (; a < o;) {
    let t = Math.ceil((a + o) / 2);
    e(i(t)) <= n ? (a = t) : (o = t - 1);
  }
  return a === 0 ? de : i(a);
}
function R(e, t, n, r, i, a = 2) {
  let o = r;
  for (; o > i && e(t, o) > n;) o = Math.max(i, o - a);
  return e(t, o) <= n ? { text: t, size: o } : { text: fe((t) => e(t, o), t, n), size: o };
}
function pe(e, t, n, r) {
  let i = t.trim().split(/\s+/).filter(Boolean),
    a = [],
    o = ``,
    s = 0;
  for (; s < i.length;) {
    let t = o ? `${o} ${i[s]}` : i[s];
    if (!o || e(t) <= n) ((o = t), s++);
    else {
      if (a.length >= r - 1) break;
      (a.push(o), (o = ``));
    }
  }
  o && a.push(o);
  let c = i.slice(s).join(` `),
    l = a.length - 1;
  return a.map((t, r) => fe(e, r === l && c ? `${t} ${c}` : t, n));
}
function me(e, t, n, r, i = 0.5, a = 0.5) {
  let o = Math.max(n / e, r / t),
    s = Math.min(e, n / o),
    c = Math.min(t, r / o),
    l = (e) => Math.min(1, Math.max(0, e));
  return { sx: (e - s) * l(i), sy: (t - c) * l(a), sw: s, sh: c };
}
var he = [
  {
    outer: `#e8834a`,
    inner: `#f6a86b`,
    core: `#ffd2a8`,
    scale: 0.56,
    glow: 0,
    ring: null,
    cup: null,
    sparks: !1,
  },
  {
    outer: `#e8834a`,
    inner: `#f6a86b`,
    core: `#ffd2a8`,
    scale: 0.56,
    glow: 0,
    ring: null,
    cup: null,
    sparks: !1,
  },
  {
    outer: `#f0a040`,
    inner: `#f7c46c`,
    core: `#ffe2b0`,
    scale: 0.66,
    glow: 0,
    ring: null,
    cup: null,
    sparks: !1,
  },
  {
    outer: `#f3c15a`,
    inner: `#f8d98a`,
    core: `#fff0c8`,
    scale: 0.76,
    glow: 1,
    ring: null,
    cup: null,
    sparks: !1,
  },
  {
    outer: `#e4573d`,
    inner: `#f5b942`,
    core: `#ffe9c0`,
    scale: 0.84,
    glow: 1,
    ring: null,
    cup: null,
    sparks: !0,
  },
  {
    outer: `#f5b942`,
    inner: `#ffd877`,
    core: `#fff3cf`,
    scale: 0.84,
    glow: 1,
    ring: null,
    cup: `#eb8fae`,
    sparks: !0,
  },
  {
    outer: `#f5b942`,
    inner: `#ffe08a`,
    core: `#fffbe8`,
    scale: 0.9,
    glow: 2,
    ring: `rgba(111, 194, 165, 0.36)`,
    cup: null,
    sparks: !0,
  },
  {
    outer: `#f6d27a`,
    inner: `#fff1c9`,
    core: `#ffffff`,
    scale: 0.94,
    glow: 2,
    ring: `rgba(246, 210, 122, 0.32)`,
    cup: null,
    sparks: !0,
  },
  {
    outer: `#ffe7a3`,
    inner: `#fff6dc`,
    core: `#ffffff`,
    scale: 1,
    glow: 2,
    ring: `rgba(255, 241, 201, 0.42)`,
    cup: `#fff1c9`,
    sparks: !0,
  },
];
function ge(e) {
  return he[C(e)];
}
function _e(e, t) {
  let n = e.reduce((t, n, r) => t + n.height + (r < e.length - 1 ? n.gap : 0), 0),
    r = {},
    i = t - n;
  for (let t of e)
    ((r[t.key] = { top: i, height: t.height, center: i + t.height / 2 }), (i += t.height + t.gap));
  return r;
}
var z = {
  brand: 28,
  lunar: 26,
  headline: 50,
  headlineMin: 34,
  name: 84,
  nameMin: 46,
  heroValue: 66,
  heroValueMin: 40,
  heroPrefix: 30,
  heroLabel: 25,
  heroLabelMin: 17,
  tileValue: 60,
  tileLabel: 25,
  teaching: 30,
  room: 26,
  cta: 32,
  link: 24,
};
function ve(e, t) {
  let n = L[e],
    r = n.scale,
    i = (e) => Math.round(e * r),
    a = i(39),
    o = Math.max(1, Math.min(n.teachingLines, Math.floor(t.teachingLines))),
    s = _e(
      [
        { key: `headline`, height: i(56), gap: i(2) },
        { key: `name`, height: i(90), gap: i(12) },
        t.hero ? { key: `hero`, height: i(122), gap: i(22) } : { key: `divider`, height: i(24), gap: i(22) },
        { key: `tiles`, height: i(136), gap: i(22) },
        { key: `teaching`, height: o * a, gap: i(16) },
        { key: `room`, height: i(30), gap: i(18) },
        { key: `cta`, height: i(70), gap: i(12) },
        { key: `link`, height: i(28), gap: 0 },
      ],
      n.height - n.bottom,
    ),
    c = s.headline.top,
    l = i(50),
    u = {
      lotusY: n.top + l / 2,
      lotusSize: l,
      brandY: n.top + l + i(24),
      lunarY: n.top + l + i(58),
      bottom: n.top + l + i(74),
    },
    d = Math.min(s.tiles.top, Math.max(n.photo, c + i(60))),
    f = d;
  return {
    spec: n,
    contentX: (n.width - 880) / 2,
    contentW: 880,
    header: u,
    blocks: s,
    contentTop: c,
    photo: d,
    fadeStart: Math.max(u.bottom, Math.min(c - i(110), f - i(260))),
    fadeEnd: f,
    figure: { top: u.bottom + i(16), bottom: c - i(4) },
    tileGap: 18,
    teachingLineHeight: a,
  };
}
var ye = 0.62;
function be(e, t, n) {
  if (!(t > 1 && n > 1)) return null;
  let { top: r, bottom: i } = e.figure,
    a = Math.min((i - r) / n, (e.contentW * ye) / t);
  if (!(a > 0)) return null;
  let o = t * a,
    s = n * a;
  return { x: (e.spec.width - o) / 2, y: i - s, w: o, h: s };
}
var xe = 0.72,
  Se = 0.26,
  B = (e) => Math.round((e * z.heroPrefix) / z.heroValue),
  V = (e) => Math.round(e * 0.16);
function Ce(e, t, n, r, i = (L.feed.width - 880) / 2, a = 880) {
  let o = (e) => Math.round(e * r),
    s = [];
  if (
    (t.streak > 0 && s.push({ kind: `streak`, prefix: null, value: x(t.streak), label: `ngày liên tiếp` }),
    t.level &&
      s.push({ kind: `level`, prefix: `Cấp`, value: String(t.level.value), label: t.level.tierName }),
    s.length === 0)
  )
    return [];
  let c = o(24),
    l = s.length === 2 ? (a - c) / 2 : Math.min(a, o(540)),
    u = n.height,
    d = o(24),
    f = o(92),
    p = o(18),
    m = l - d * 2 - f - p,
    h = s.length === 2 ? i : i + (a - l) / 2;
  return s.map((t, r) => {
    let i = h + r * (l + c),
      a = (n) => (t.prefix ? e.prefix(t.prefix, B(n)) + V(n) : 0) + e.value(t.value, n),
      s = o(z.heroValue),
      d = o(z.heroValueMin);
    for (; s > d && a(s) > m;) s = Math.max(d, s - 2);
    let g = t.value;
    if (a(s) > m) {
      let n = t.prefix ? e.prefix(t.prefix, B(s)) + V(s) : 0;
      g = fe((t) => e.value(t, s), t.value, m - n);
    }
    let _ = R(e.label, t.label, m, o(z.heroLabel), o(z.heroLabelMin)),
      v = (t.prefix ? e.prefix(t.prefix, B(s)) + V(s) : 0) + e.value(g, s),
      y = Math.min(m, Math.max(v, e.label(_.text, _.size))),
      b = i + (l - (f + p + y)) / 2,
      x = o(8),
      S = s * 0.98 + x + _.size,
      C = n.top + (u - S) / 2,
      w = C + s * xe;
    return {
      kind: t.kind,
      box: { x: i, y: n.top, w: l, h: u },
      iconX: b + f / 2,
      iconY: t.kind === `streak` ? n.top + u * 0.46 : n.top + u / 2,
      iconSize: t.kind === `streak` ? Math.round(u * 0.78) : Math.min(f, Math.round(u * 0.74)),
      textX: b + f + p,
      textTop: C,
      textBottom: C + S,
      prefix: t.prefix ? { text: t.prefix, size: B(s) } : null,
      value: { text: g, size: s },
      valueBaseline: w,
      label: _,
      labelY: w + s * Se + x + _.size / 2,
      textW: y,
    };
  });
}
function we(e, t = !1) {
  let n = e.stats.map((e) => `${e.value} ${e.label}`).join(`, `);
  return [
    `Thẻ khoe thành tích Chùa Sen: ${e.headline}`,
    e.name,
    t ? `Nhân vật của bạn đứng giữa ảnh, mặc bộ đang mặc` : null,
    e.streak > 0 ? `Giữ lửa ${ue(e.streak)}` : null,
    e.level ? le(e.level) : null,
    n,
    e.room,
    e.lunar,
    `${e.cta}: ${e.link}`,
  ]
    .filter(Boolean)
    .join(`. `);
}
var Te = `#fbf3e6`,
  H = `#d8c3a2`,
  U = `#f3c973`,
  Ee = `#f6dc9c`,
  De = `#220e08`,
  Oe = `#2b1008`;
function W(e, t) {
  let n = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim())?.[1];
  if (!n) return e;
  let r = n.length === 3 ? Array.from(n, (e) => e + e).join(``) : n,
    i = Number.parseInt(r, 16);
  return `rgba(${(i >> 16) & 255}, ${(i >> 8) & 255}, ${i & 255}, ${t})`;
}
function G(e, t, n, r, i, a = `rgba(42, 16, 9, 0.55)`) {
  let o = t,
    s = n + r * 0.32,
    c = (t, n, r) => {
      let i = Math.sin(t),
        a = -Math.cos(t),
        c = Math.cos(t),
        l = Math.sin(t),
        u = (e, t) => [o + c * e + i * t, s + l * e + a * t],
        [d, f] = u(0, n);
      (e.beginPath(),
        e.moveTo(o, s),
        e.bezierCurveTo(...u(-r, n * 0.35), ...u(-r * 0.45, n * 0.78), d, f),
        e.bezierCurveTo(...u(r * 0.45, n * 0.78), ...u(r, n * 0.35), o, s),
        e.closePath(),
        e.fill(),
        e.stroke());
    };
  (e.save(),
    (e.fillStyle = i),
    (e.strokeStyle = a),
    (e.lineWidth = Math.max(1, r * 0.025)),
    (e.lineJoin = `round`));
  for (let e of [-1, 1]) c(e * 1.15, r * 0.62, r * 0.2);
  for (let e of [-1, 1]) c(e * 0.55, r * 0.74, r * 0.22);
  (c(0, r * 0.82, r * 0.24),
    e.beginPath(),
    e.moveTo(t - r * 0.42, s + r * 0.06),
    e.quadraticCurveTo(t, s + r * 0.16, t + r * 0.42, s + r * 0.06),
    (e.strokeStyle = typeof i == `string` ? i : U),
    (e.lineWidth = Math.max(1, r * 0.035)),
    (e.lineCap = `round`),
    e.stroke(),
    e.restore());
}
function K(e, t, n, r = [`#fff1c9`, U, `#c8913a`]) {
  let i = e.createLinearGradient(0, t, 0, n);
  return (r.forEach((e, t) => i.addColorStop(t / (r.length - 1), e)), i);
}
function q(e, t, n, r, i, a) {
  let o = Math.min(a, r / 2, i / 2);
  (e.beginPath(),
    e.moveTo(t + o, n),
    e.arcTo(t + r, n, t + r, n + i, o),
    e.arcTo(t + r, n + i, t, n + i, o),
    e.arcTo(t, n + i, t, n, o),
    e.arcTo(t, n, t + r, n, o),
    e.closePath());
}
function J(e, t, n, r) {
  (e.beginPath(), e.arc(t, n, r, 0, Math.PI * 2), e.closePath());
}
function ke(e, t, n, r, i) {
  let a = e.createRadialGradient(t, n, 0, t, n, r);
  (a.addColorStop(0, i),
    a.addColorStop(1, `rgba(0, 0, 0, 0)`),
    (e.fillStyle = a),
    e.fillRect(t - r, n - r, r * 2, r * 2));
}
function Ae(e, t) {
  let n = e;
  `letterSpacing` in n && (n.letterSpacing = t);
}
function Y(e, t) {
  return (n, r) => ((e.font = t(r)), e.measureText(n).width);
}
var je = {
    outer: [
      [12, 3],
      [13.3, 8, 19.5, 11.3, 19.5, 19.8],
      [19.5, 24.9, 16.2, 29, 12, 29],
      [7.8, 29, 4.5, 24.9, 4.5, 19.8],
      [4.5, 15.5, 7.2, 12.6, 8.6, 9.8],
      [9.3, 12.2, 10.4, 13.4, 11.3, 13.7],
      [11.1, 10, 11.2, 6.5, 12, 3],
    ],
    inner: [
      [12, 13],
      [13.2, 15.9, 16, 17.8, 16, 21.7],
      [16, 24.9, 14.2, 27.1, 12, 27.1],
      [9.8, 27.1, 8, 24.9, 8, 21.7],
      [8, 18.7, 10.4, 16.8, 12, 13],
    ],
    core: [
      [12, 19],
      [12.8, 20.8, 14, 21.8, 14, 23.6],
      [14, 25.1, 13.1, 26.1, 12, 26.1],
      [10.9, 26.1, 10, 25.1, 10, 23.6],
      [10, 21.8, 11.2, 20.8, 12, 19],
    ],
  },
  Me = [
    [
      [12, 0],
      [14.5, 3, 14.5, 8, 12, 12],
      [9.5, 8, 9.5, 3, 12, 0],
    ],
    [
      [12, 12],
      [8, 12, 3, 10, 0.5, 5],
      [5, 4.5, 9.5, 7, 12, 12],
    ],
    [
      [12, 12],
      [16, 12, 21, 10, 23.5, 5],
      [19, 4.5, 14.5, 7, 12, 12],
    ],
  ];
function Ne(e, t, n) {
  let [r, ...i] = t;
  e.moveTo(...n(r?.[0] ?? 0, r?.[1] ?? 0));
  for (let t of i)
    e.bezierCurveTo(...n(t[0] ?? 0, t[1] ?? 0), ...n(t[2] ?? 0, t[3] ?? 0), ...n(t[4] ?? 0, t[5] ?? 0));
  e.closePath();
}
function Pe(e, t, n, r, i) {
  let a = ge(i),
    o = r / 32,
    s = o * 24,
    c = t - s / 2,
    l = n - r / 2,
    u = (e, t) => [c + (12 + (e - 12) * a.scale) * o, l + (28.8 + (t - 28.8) * a.scale) * o];
  (e.save(),
    a.ring && ke(e, t, u(12, 18)[1], r * 0.62, a.ring),
    a.glow > 0 && ((e.shadowColor = a.outer), (e.shadowBlur = s * (a.glow === 2 ? 0.34 : 0.18))));
  for (let t of [`outer`, `inner`, `core`])
    (e.beginPath(),
      Ne(e, je[t], u),
      (e.fillStyle = a[t]),
      e.fill(),
      t === `outer` && a.glow === 2 && ((e.shadowColor = a.core), (e.shadowBlur = s * 0.12), e.fill()),
      (e.shadowBlur = 0),
      (e.shadowColor = `rgba(0, 0, 0, 0)`));
  if (a.sparks) {
    let t = Math.max(1.5, s * 0.06);
    for (let [n, r, i] of [
      [12.6, 4.2, a.core],
      [7.4, 8.4, a.inner],
      [17.6, 9.8, a.core],
    ]) {
      let [a, o] = u(n, r);
      (e.beginPath(), e.arc(a, o, t, 0, Math.PI * 2), (e.fillStyle = i), e.fill());
    }
  }
  if (a.cup) {
    let n = r * 0.44,
      i = Math.min((s * 1.52) / 24, n / 12),
      o = t - i * 12,
      c = l + r * 1.08 - n + (n - i * 12) / 2,
      u = (e, t) => [o + e * i, c + t * i];
    e.beginPath();
    for (let t of Me) Ne(e, t, u);
    ((e.fillStyle = a.cup), e.fill());
  }
  e.restore();
}
function Fe(e, t, n, r, i) {
  let a = r / 2,
    o = i.tier >= S.length;
  if ((e.save(), o)) {
    (ke(e, t, n, a * 1.9, W(i.accent, 0.55)),
      (e.strokeStyle = W(i.accent, 0.7)),
      (e.lineWidth = Math.max(1.5, a * 0.05)),
      (e.lineCap = `round`));
    for (let r = 0; r < 12; r++) {
      let i = (r / 12) * Math.PI * 2 + Math.PI / 12,
        o = a * 1.16,
        s = a * (r % 2 == 0 ? 1.55 : 1.36);
      (e.beginPath(),
        e.moveTo(t + Math.cos(i) * o, n + Math.sin(i) * o),
        e.lineTo(t + Math.cos(i) * s, n + Math.sin(i) * s),
        e.stroke());
    }
  }
  let s = e.createRadialGradient(t - a * 0.3, n - a * 0.35, a * 0.1, t, n, a);
  (s.addColorStop(0, i.accent),
    s.addColorStop(0.55, i.color),
    s.addColorStop(1, W(i.color, 0.85)),
    (e.shadowColor = `rgba(0, 0, 0, 0.45)`),
    (e.shadowBlur = a * 0.4),
    (e.shadowOffsetY = a * 0.06),
    J(e, t, n, a),
    (e.fillStyle = s),
    e.fill(),
    (e.shadowColor = `rgba(0, 0, 0, 0)`),
    (e.shadowBlur = 0),
    (e.shadowOffsetY = 0),
    (e.strokeStyle = i.accent),
    (e.lineWidth = Math.max(2, a * 0.09)),
    J(e, t, n, a * 0.94),
    e.stroke(),
    (e.strokeStyle = `rgba(246, 220, 156, 0.85)`),
    (e.lineWidth = Math.max(1, a * 0.03)),
    J(e, t, n, a * 1.04),
    e.stroke(),
    e.restore(),
    G(
      e,
      t,
      n - a * 0.06,
      a * 1.12,
      K(e, n - a * 0.5, n + a * 0.5, [`#fffaf0`, `#fff1d6`, i.accent]),
      `rgba(34, 14, 8, 0.45)`,
    ));
}
function Ie(e, t, n) {
  let { width: r } = t.spec,
    i = t.fadeEnd;
  if (n && n.width > 1 && n.height > 1) {
    let a = me(n.width, n.height, r, t.photo);
    (e.save(),
      e.beginPath(),
      e.rect(0, 0, r, i),
      e.clip(),
      e.drawImage(n, a.sx, a.sy, a.sw, a.sh, 0, 0, r, t.photo),
      (e.globalCompositeOperation = `soft-light`),
      (e.fillStyle = `rgba(214, 120, 52, 0.35)`),
      e.fillRect(0, 0, r, i),
      e.restore());
  } else {
    let t = e.createRadialGradient(r / 2, i * 0.5, 0, r / 2, i * 0.5, r * 0.6);
    (t.addColorStop(0, `rgba(243, 201, 115, 0.28)`),
      t.addColorStop(1, `rgba(243, 201, 115, 0)`),
      (e.fillStyle = t),
      e.fillRect(0, 0, r, i),
      e.save(),
      (e.globalAlpha = 0.22),
      G(e, r / 2, i * 0.52, Math.min(420, i * 0.62), U, `rgba(34, 14, 8, 0.8)`),
      e.restore());
  }
  let a = e.createRadialGradient(r / 2, i * 0.45, r * 0.28, r / 2, i * 0.45, r * 0.9);
  (a.addColorStop(0, `rgba(18, 7, 4, 0)`),
    a.addColorStop(1, `rgba(18, 7, 4, 0.62)`),
    (e.fillStyle = a),
    e.fillRect(0, 0, r, i));
  let o = e.createLinearGradient(0, 0, 0, t.header.bottom + 60);
  (o.addColorStop(0, `rgba(18, 7, 4, 0.72)`),
    o.addColorStop(1, `rgba(18, 7, 4, 0)`),
    (e.fillStyle = o),
    e.fillRect(0, 0, r, t.header.bottom + 60));
  let s = e.createLinearGradient(0, t.fadeStart, 0, t.fadeEnd);
  (s.addColorStop(0, `rgba(34, 14, 8, 0)`),
    s.addColorStop(0.55, `rgba(34, 14, 8, 0.78)`),
    s.addColorStop(1, `rgba(34, 14, 8, 1)`),
    (e.fillStyle = s),
    e.fillRect(0, t.fadeStart, r, t.fadeEnd - t.fadeStart + 1));
}
function Le(e, t, n, r) {
  let i = be(t, n.width, n.height);
  if (!i) return null;
  let a = t.spec.scale,
    o = i.x + i.w / 2,
    s = i.y + i.h,
    c = Math.max(i.w * 0.62, 150 * a),
    l = c * 0.2;
  (e.save(), e.translate(o, s - l * 0.35), e.scale(1, l / c));
  let u = e.createRadialGradient(0, 0, 0, 0, 0, c);
  return (
    u.addColorStop(0, W(r, 0.6)),
    u.addColorStop(0.45, W(r, 0.22)),
    u.addColorStop(1, W(r, 0)),
    (e.fillStyle = u),
    e.fillRect(-c, -c, c * 2, c * 2),
    e.restore(),
    e.save(),
    (e.shadowColor = W(r, 0.42)),
    (e.shadowBlur = 34 * a),
    e.drawImage(n, i.x, i.y, i.w, i.h),
    e.restore(),
    i
  );
}
function Re(e, t) {
  let { width: n, height: r } = t;
  (e.save(),
    (e.strokeStyle = `rgba(243, 201, 115, 0.55)`),
    (e.lineWidth = 2),
    q(e, 26, 26, n - 52, r - 52, 30),
    e.stroke(),
    (e.strokeStyle = `rgba(243, 201, 115, 0.2)`),
    (e.lineWidth = 1),
    q(e, 38, 38, n - 76, r - 76, 22),
    e.stroke(),
    (e.strokeStyle = `rgba(246, 220, 156, 0.9)`),
    (e.lineWidth = 3),
    (e.lineCap = `round`));
  for (let [t, i, a, o] of [
    [52, 52, 1, 1],
    [n - 52, 52, -1, 1],
    [52, r - 52, 1, -1],
    [n - 52, r - 52, -1, -1],
  ])
    (e.beginPath(), e.moveTo(t, i + o * 46), e.lineTo(t, i), e.lineTo(t + a * 46, i), e.stroke());
  e.restore();
}
function X(e, t, n, r, i, a) {
  ((e.font = i),
    (e.fillStyle = a),
    (e.textAlign = `center`),
    (e.textBaseline = `middle`),
    e.fillText(t, n, r));
}
function ze(e, t, n, r, i, a, o = `middle`) {
  ((e.font = i), (e.fillStyle = a), (e.textAlign = `left`), (e.textBaseline = o), e.fillText(t, n, r));
}
function Be(e, t, n, r, i, a = null) {
  let o = L[n],
    s = o.scale,
    c = (e) => Math.round(e * s),
    l =
      (e, t = !1) =>
      (n) =>
        `${t ? `italic ` : ``}${e} ${n}px ${i.serif}`,
    u = (e) => (t) => `${e} ${t}px ${i.sans}`,
    d = l(`400`, !0),
    f = Y(e, d),
    p = pe((e) => f(e, c(z.teaching)), `“${t.teaching.trim()}”`, 840, o.teachingLines),
    m = ve(n, { hero: t.streak > 0 || t.level !== null, teachingLines: p.length }),
    { width: h, height: g } = o,
    _ = h / 2,
    v = m.blocks,
    y = ge(t.streak),
    b = t.level?.accent ?? (t.streak > 0 ? y.outer : U);
  (e.save(), (e.fillStyle = De), e.fillRect(0, 0, h, g), Ie(e, m, r));
  let x = Math.min(h * 0.75, v.tiles.top - m.fadeStart),
    C = e.createRadialGradient(_, v.tiles.top, 0, _, v.tiles.top, x);
  (C.addColorStop(0, `rgba(150, 52, 26, 0.32)`),
    C.addColorStop(1, `rgba(150, 52, 26, 0)`),
    (e.fillStyle = C),
    e.fillRect(0, m.fadeStart, h, g - m.fadeStart));
  let w = e.createLinearGradient(0, g - c(420), 0, g);
  (w.addColorStop(0, `rgba(10, 4, 2, 0)`),
    w.addColorStop(1, `rgba(10, 4, 2, 0.5)`),
    (e.fillStyle = w),
    e.fillRect(0, g - c(420), h, c(420)),
    (e.globalAlpha = 0.06),
    G(e, _, v.tiles.center + c(30), c(560), U, `rgba(0, 0, 0, 0)`),
    e.restore(),
    a && Le(e, m, a, b));
  let T = m.header;
  (G(e, _, T.lotusY, T.lotusSize, K(e, T.lotusY - T.lotusSize / 2, T.lotusY + T.lotusSize / 2)),
    e.save(),
    Ae(e, `${c(9)}px`),
    X(e, `CHÙA SEN`, _, T.brandY, u(`700`)(c(z.brand)), Ee),
    e.restore(),
    X(e, t.lunar, _, T.lunarY, l(`400`)(c(z.lunar)), `rgba(251, 243, 230, 0.86)`),
    e.save(),
    (e.shadowColor = `rgba(0, 0, 0, 0.55)`),
    (e.shadowBlur = c(18)),
    (e.shadowOffsetY = c(2)));
  let E = R(Y(e, l(`500`)), t.headline, 880, c(z.headline), c(z.headlineMin));
  X(e, E.text, _, v.headline.center, l(`500`)(E.size), Te);
  let D = R(Y(e, l(`700`)), t.name, 880, c(z.name), c(z.nameMin));
  if (
    (X(
      e,
      D.text,
      _,
      v.name.center,
      l(`700`)(D.size),
      K(e, v.name.center - D.size / 2, v.name.center + D.size / 2),
    ),
    e.restore(),
    v.hero)
  ) {
    let n = Ce(
      { value: Y(e, l(`700`)), prefix: Y(e, u(`700`)), label: Y(e, u(`600`)) },
      t,
      v.hero,
      s,
      m.contentX,
      m.contentW,
    );
    for (let r of n) {
      let n = r.kind === `level` ? t.level : null,
        i = n ? n.accent : y.outer,
        { x: a, y: o, w: s, h: d } = r.box;
      (e.save(),
        (n ? n.tier >= S.length : y.glow === 2) &&
          ((e.shadowColor = n ? W(n.accent, 0.75) : (y.ring ?? y.outer)), (e.shadowBlur = c(n ? 38 : 30))),
        q(e, a, o, s, d, c(28)));
      let f = e.createLinearGradient(0, o, 0, o + d);
      (f.addColorStop(0, W(n ? n.color : y.outer, 0.3)),
        f.addColorStop(1, `rgba(34, 14, 8, 0.82)`),
        (e.fillStyle = f),
        e.fill(),
        (e.shadowBlur = 0),
        (e.shadowColor = `rgba(0, 0, 0, 0)`),
        (e.strokeStyle = W(i, 0.75)),
        (e.lineWidth = c(2)),
        e.stroke(),
        e.restore(),
        n ? Fe(e, r.iconX, r.iconY, r.iconSize, n) : Pe(e, r.iconX, r.iconY, r.iconSize, t.streak));
      let p = n
        ? K(e, r.valueBaseline - r.value.size * 0.8, r.valueBaseline, [`#fffaf0`, n.accent, n.accent])
        : K(e, r.valueBaseline - r.value.size * 0.8, r.valueBaseline, [y.core, y.inner, y.outer]);
      (e.save(), (e.shadowColor = `rgba(0, 0, 0, 0.5)`), (e.shadowBlur = c(12)));
      let m = r.textX;
      if (r.prefix) {
        let t = u(`700`)(r.prefix.size);
        (ze(e, r.prefix.text, m, r.valueBaseline, t, i, `alphabetic`),
          (e.font = t),
          (m += e.measureText(r.prefix.text).width + V(r.value.size)));
      }
      (ze(e, r.value.text, m, r.valueBaseline, l(`700`)(r.value.size), p, `alphabetic`),
        e.restore(),
        ze(e, r.label.text, r.textX, r.labelY, u(`600`)(r.label.size), n ? n.accent : H));
    }
  }
  if (v.divider) {
    let t = v.divider.center;
    e.save();
    for (let n of [-1, 1]) {
      let r = _ + n * c(28),
        i = _ + n * c(250),
        a = e.createLinearGradient(r, t, i, t);
      (a.addColorStop(0, `rgba(243, 201, 115, 0.75)`),
        a.addColorStop(1, `rgba(243, 201, 115, 0)`),
        (e.strokeStyle = a),
        (e.lineWidth = 2),
        e.beginPath(),
        e.moveTo(r, t),
        e.lineTo(i, t),
        e.stroke());
    }
    (e.restore(), G(e, _, t, c(30), U));
  }
  let O = m.tileGap,
    k = (880 - O * 2) / 3,
    A = Y(e, l(`600`)),
    j = Y(e, u(`500`));
  (t.stats.slice(0, 3).forEach((t, n) => {
    let r = m.contentX + n * (k + O),
      i = v.tiles.top,
      a = v.tiles.height;
    (e.save(), q(e, r, i, k, a, c(26)));
    let o = e.createLinearGradient(0, i, 0, i + a);
    (o.addColorStop(0, `rgba(255, 236, 200, 0.1)`),
      o.addColorStop(1, `rgba(255, 236, 200, 0.03)`),
      (e.fillStyle = o),
      e.fill(),
      (e.strokeStyle = `rgba(243, 201, 115, 0.38)`),
      (e.lineWidth = 1.5),
      e.stroke(),
      (e.strokeStyle = `rgba(246, 220, 156, 0.85)`),
      (e.lineWidth = 3),
      (e.lineCap = `round`),
      e.beginPath(),
      e.moveTo(r + k / 2 - c(18), i + c(14)),
      e.lineTo(r + k / 2 + c(18), i + c(14)),
      e.stroke(),
      e.restore());
    let s = R(A, t.value, k - 28, c(z.tileValue), c(30));
    X(
      e,
      s.text,
      r + k / 2,
      i + a * 0.42,
      l(`600`)(s.size),
      K(e, i + a * 0.42 - s.size / 2, i + a * 0.42 + s.size / 2),
    );
    let d = R(j, t.label, k - 20, c(z.tileLabel), c(18));
    X(e, d.text, r + k / 2, i + a * 0.8, u(`500`)(d.size), H);
  }),
    p.forEach((t, n) => {
      X(
        e,
        t,
        _,
        v.teaching.top + m.teachingLineHeight * (n + 0.5),
        d(c(z.teaching)),
        `rgba(251, 243, 230, 0.9)`,
      );
    }));
  let M = R(Y(e, u(`500`)), t.room, 880, c(z.room), c(20));
  X(e, M.text, _, v.room.center, u(`500`)(M.size), H);
  let N = c(46),
    P = R(Y(e, u(`700`)), t.cta, 880 - N * 2, c(z.cta), c(22));
  e.font = u(`700`)(P.size);
  let F = Math.min(880, e.measureText(P.text).width + N * 2);
  (e.save(),
    (e.shadowColor = `rgba(243, 201, 115, 0.35)`),
    (e.shadowBlur = c(30)),
    q(e, _ - F / 2, v.cta.top, F, v.cta.height, v.cta.height / 2),
    (e.fillStyle = K(e, v.cta.top, v.cta.top + v.cta.height, [`#fbe5aa`, `#f0c56d`, `#d29a45`])),
    e.fill(),
    e.restore(),
    X(e, P.text, _, v.cta.center + 1, u(`700`)(P.size), Oe));
  let I = R(Y(e, u(`500`)), t.link, 880, c(z.link), c(18));
  return (X(e, I.text, _, v.link.center, u(`500`)(I.size), `rgba(246, 220, 156, 0.85)`), Re(e, o), m);
}
var Ve = e({ openShareCard: () => ot }),
  He = () =>
    t(
      () => import(`./rewards-BiUWDF_0.js`).then((e) => e.r),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
      import.meta.url,
    ),
  Ue = (e, n) =>
    t(
      () =>
        Promise.resolve()
          .then(() => ct)
          .then((t) => t.renderPortrait(e, { signal: n })),
      void 0,
      import.meta.url,
    ),
  Z = { level: null, streak: null },
  Q = (e) => typeof e == `object` && !!e && !Array.isArray(e);
function We(e, t, n) {
  try {
    let r = Q(e) ? e.counters : null,
      i = Q(r) && typeof r.view == `function` ? r.view() : null;
    if (!Q(i)) return Z;
    let a =
        typeof i.streak == `number` && Number.isFinite(i.streak) && i.streak >= 0
          ? Math.floor(i.streak)
          : null,
      o = Q(n) ? n : {},
      s = Q(t) ? t.tierOf : null,
      c = i.level;
    return {
      level:
        o.progressUi !== !1 &&
        o.progressBadge !== !1 &&
        i.day !== null &&
        i.day !== void 0 &&
        typeof c == `number` &&
        Number.isFinite(c) &&
        typeof s == `function`
          ? Ge(Math.max(1, Math.floor(c)), s(c))
          : null,
      streak: a,
    };
  } catch {
    return Z;
  }
}
function Ge(e, t) {
  if (!Q(t)) return null;
  let { id: n, name: r, color: i, accent: a } = t;
  return typeof n != `number` ||
    !Number.isFinite(n) ||
    typeof r != `string` ||
    !r.trim() ||
    typeof i != `string` ||
    typeof a != `string`
    ? null
    : { value: e, tier: n, tierName: r.trim(), color: i, accent: a };
}
var Ke = Object.assign({
    "../lib/progress/counters.ts": () =>
      t(
        () => import(`./progress-core-C9e35Hb5.js`).then((e) => e.u),
        __vite__mapDeps([8, 1, 2, 3, 4, 5, 6]),
        import.meta.url,
      ),
  }),
  qe = Object.assign({
    "../shared/progress-tiers.ts": () =>
      t(
        () => import(`./progress-core-C9e35Hb5.js`).then((e) => e.m),
        __vite__mapDeps([8, 1, 2, 3, 4, 5, 6]),
        import.meta.url,
      ),
  });
async function Je(e) {
  let t = Ke[`../lib/progress/counters.ts`],
    n = qe[`../shared/progress-tiers.ts`];
  if (!t) return Z;
  try {
    let [r, i] = await Promise.all([t(), n ? n() : null]);
    return We(r, i, e);
  } catch {
    return Z;
  }
}
function Ye(e) {
  return e.bows + e.chants + e.beadRounds + e.sutras + e.meditationSeconds > 0;
}
function Xe(e) {
  return [
    { value: x(e.bows), label: `lạy Phật` },
    e.beadRounds > 0
      ? { value: x(e.beadRounds), label: `vòng tràng hạt` }
      : { value: x(e.chants), label: `câu niệm Phật` },
    { value: x(Math.floor(e.meditationSeconds / 60)), label: `phút thiền` },
  ];
}
function Ze(e) {
  return `Ngày ${e.day}/${e.month}${e.leap ? ` nhuận` : ``} ${e.canChi.year}`;
}
function Qe(e, t, n) {
  let r = e.filter((e) => Array.from(e).length <= 100);
  return n(r.length > 0 ? r : e, t, 3);
}
function $e(e) {
  return e ? `Tại Chùa Sen · ${e}` : `Tại Chùa Sen`;
}
function et(e) {
  let t = i(`ban-dao`).label;
  return e.badge ? `${e.text} · đã mở bộ áo "${t}"` : `${e.text} · đủ ${e.goal} bạn mở bộ áo "${t}"`;
}
function tt(e) {
  let t = e.progress.streak ?? e.streak;
  return {
    headline: Ye(e.today) ? `Hôm nay tôi đã tu tập` : `Hôm nay tôi đã lên chùa`,
    name: e.name.trim() || `Phật tử`,
    level: e.progress.level,
    streak: Number.isFinite(t) && t > 0 ? Math.floor(t) : 0,
    stats: Xe(e.today),
    lunar: e.lunar,
    teaching: e.teaching,
    room: $e(e.room),
    cta: `Cùng tu tập tại ${P(e.link)}`,
    link: N(e.link),
  };
}
function nt() {
  let e = getComputedStyle(document.documentElement),
    t = (t, n) => e.getPropertyValue(t).replace(/\s+/g, ` `).trim() || n;
  return { serif: t(`--font-serif`, `Georgia, serif`), sans: t(`--font-sans`, `system-ui, sans-serif`) };
}
function rt(e) {
  return {
    navigator,
    open: (e) => void window.open(e, `_blank`, `noopener,noreferrer`),
    assign: (e) => location.assign(e),
    legacyCopy(t) {
      let n = document.activeElement instanceof HTMLElement ? document.activeElement : null,
        r = document.createElement(`textarea`);
      ((r.value = t),
        r.setAttribute(`readonly`, ``),
        r.setAttribute(`aria-hidden`, `true`),
        (r.className = `share-card__copybuf`),
        e.append(r),
        r.select(),
        r.setSelectionRange(0, t.length));
      let i;
      try {
        i = document.execCommand(`copy`);
      } catch {
        i = !1;
      }
      return (r.remove(), n?.focus({ preventScroll: !0 }), i);
    },
    download(t, n) {
      let r = URL.createObjectURL(t),
        i = document.createElement(`a`);
      ((i.href = r),
        (i.download = n),
        (i.hidden = !0),
        e.append(i),
        i.click(),
        i.remove(),
        setTimeout(() => URL.revokeObjectURL(r), 1e4));
    },
  };
}
var it = { feed: `Bài đăng`, story: `Khung dọc` },
  at = { copied: k, downloaded: `Đã tải ảnh về máy` };
async function ot(e) {
  let t = new AbortController(),
    n = () => t.abort();
  (e.signal?.addEventListener(`abort`, n), e.signal?.aborted && n());
  let r = e.figure
    ? (e.renderFigure ?? Ue)(e.figure, t.signal).then(
        (e) => (e && e.width > 1 && e.height > 1 ? e : null),
        (e) => (console.error(`Không dựng được ảnh nhân vật cho thẻ khoe thành tích`, e), null),
      )
    : Promise.resolve(null);
  try {
    await st(e, r);
  } finally {
    (e.signal?.removeEventListener(`abort`, n), n());
  }
}
async function st(e, i) {
  let o = e.now ?? Date.now,
    s = e.store.getSettings(),
    [{ mountModal: c }, { TEACHINGS: l }, { pickForDay: u, vietnamDay: d }, { solarToLunar: f }, p] =
      await Promise.all([
        t(
          () => import(`./rituals-DFATLOei.js`).then((e) => e.p),
          __vite__mapDeps([18, 1, 3, 5, 2, 4, 6, 9, 12, 10, 11, 7, 8, 13, 14, 15, 19, 20]),
          import.meta.url,
        ),
        t(
          () => import(`./rituals-DFATLOei.js`).then((e) => e.y),
          __vite__mapDeps([18, 1, 3, 5, 2, 4, 6, 9, 12, 10, 11, 7, 8, 13, 14, 15, 19, 20]),
          import.meta.url,
        ),
        t(
          () => import(`./rituals-DFATLOei.js`).then((e) => e.w),
          __vite__mapDeps([18, 1, 3, 5, 2, 4, 6, 9, 12, 10, 11, 7, 8, 13, 14, 15, 19, 20]),
          import.meta.url,
        ),
        t(
          () => import(`./rituals-DFATLOei.js`).then((e) => e.O),
          __vite__mapDeps([18, 1, 3, 5, 2, 4, 6, 9, 12, 10, 11, 7, 8, 13, 14, 15, 19, 20]),
          import.meta.url,
        ),
        (e.loadProgress ?? Je)(s),
      ]);
  if (e.signal?.aborted) return;
  let m = d(o()),
    h = M(A(), n()),
    g = tt({
      today: e.store.today(),
      streak: e.store.streak(),
      progress: p,
      name: e.name,
      room: e.room,
      lunar: Ze(f(m)),
      teaching: Qe(l, m, u),
      link: h,
    }),
    _ = e.override ? { ...g, headline: e.override.headline, teaching: e.override.teaching } : g,
    v = ee(o()),
    y = te(_.headline);
  return (
    a(`share_opened`, { source: e.source }),
    new Promise((t) => {
      let n = new Map(),
        o = `feed`,
        s = null,
        l = !1,
        u = null,
        {
          dialog: d,
          close: f,
          ref: p,
        } = c({
          className: `share-card`,
          labelledBy: `share-title`,
          describedBy: `share-note`,
          signal: e.signal,
          onClosed: () => {
            ((l = !0), u?.(), (u = null));
            for (let e of n.values()) e.then((e) => e && URL.revokeObjectURL(e.url));
            t();
          },
          html: `
      <div class="share-card__card">
        <header class="share-card__head">
          <h2 id="share-title" class="share-card__title" tabindex="-1" data-ref="title">Khoe thành tích ${r(`sparkle`, { size: 20 })}</h2>
          <button type="button" class="share-card__close" data-ref="close" aria-label="Đóng">${r(`close`)}</button>
        </header>
        <div class="share-card__formats" role="group" aria-label="Khung ảnh">
          ${[`feed`, `story`].map((e) => `<button type="button" class="share-card__format" data-format="${e}" aria-pressed="${e === `feed`}">${it[e]}<span>${L[e].width}×${L[e].height}</span></button>`).join(``)}
        </div>
        <figure class="share-card__preview" data-ref="preview" data-format="feed" aria-busy="true">
          <img class="share-card__img" data-ref="img" width="1080" height="1350" alt="" hidden />
          <span class="share-card__loading" data-ref="loading" aria-hidden="true">${r(`lotus`, { size: 40 })}</span>
        </figure>
        <p class="share-card__status" role="status" aria-live="polite" data-ref="status"></p>
        <div class="share-card__actions">
          <button type="button" class="share-card__primary" data-act="native" hidden>${r(`share`)}<span><b>Chia sẻ</b><small>Zalo, Facebook, Messenger…</small></span></button>
          <div class="share-card__row">
            <button type="button" class="share-card__btn share-card__btn--fb" data-act="facebook">Facebook</button>
            <button type="button" class="share-card__btn share-card__btn--zalo" data-act="zalo">Zalo</button>
            <button type="button" class="share-card__btn share-card__btn--ms" data-act="messenger" hidden>Messenger</button>
            <button type="button" class="share-card__btn" data-act="download">${r(`download`, { size: 18 })}<span>Tải ảnh</span></button>
            <button type="button" class="share-card__btn" data-act="copy">${r(`copy`, { size: 18 })}<span>Sao chép link</span></button>
          </div>
          <p class="share-card__note" id="share-note">Liên kết chỉ kèm một mã giới thiệu ngẫu nhiên, không có thông tin cá nhân.</p>
          <p class="share-card__ref" data-ref="refLine" hidden></p>
          <button type="button" class="share-card__done" data-ref="done">Đóng</button>
        </div>
      </div>`,
        }),
        m = { ...rt(d), ...e.env },
        g = p(`img`),
        b = p(`preview`),
        x = p(`status`),
        S = (e) => {
          x.textContent = e;
        },
        C = p(`refLine`);
      (e.loadRewards ?? He)()
        .then((e) => {
          let t = e.followReferralProgress((e) => {
            l || ((C.textContent = et(e)), (C.hidden = !1));
          });
          l ? t() : (u = t);
        })
        .catch((e) => console.error(`Không nạp được chương trình rủ bạn`, e));
      let w = Array.from(d.querySelectorAll(`[data-act="native"], [data-act="download"]`)),
        T = (e) => {
          b.setAttribute(`aria-busy`, String(e));
          for (let t of w) e ? t.setAttribute(`aria-disabled`, `true`) : t.removeAttribute(`aria-disabled`);
        },
        E = d.querySelector(`[data-act="native"]`);
      E && (E.hidden = !re(m.navigator));
      let D = d.querySelector(`[data-act="messenger"]`);
      D && (D.hidden = !ne(m.navigator));
      let A = nt(),
        j = (t) => {
          let r = n.get(t);
          if (r) return r;
          let a = (async () => {
            let n = L[t],
              r = document.createElement(`canvas`);
            ((r.width = n.width), (r.height = n.height));
            let a = await i,
              o = r.getContext(`2d`);
            if (!o) return null;
            let s = a ? e.scene : (e.sceneWithSelf ?? e.scene),
              c = Be(o, _, t, s, A, a),
              l = we(_, a !== null && be(c, a.width, a.height) !== null),
              u = await new Promise((e) => {
                try {
                  r.toBlob(e, `image/png`);
                } catch {
                  e(null);
                }
              });
            return u
              ? {
                  blob: u,
                  file: typeof File == `function` ? new File([u], v, { type: `image/png` }) : null,
                  url: URL.createObjectURL(u),
                  alt: l,
                }
              : null;
          })().catch((e) => (console.error(`Không tạo được ảnh thẻ khoe thành tích`, e), null));
          return (n.set(t, a), a);
        },
        M = async (e) => {
          ((o = e), (s = null), (b.dataset.format = e), (g.width = L[e].width), (g.height = L[e].height));
          for (let t of d.querySelectorAll(`[data-format]`))
            t.setAttribute(`aria-pressed`, String(t.dataset.format === e));
          (T(!0), (p(`loading`).hidden = !1), S(`Đang tạo ảnh…`));
          let t = await j(e);
          if (!(l || o !== e)) {
            if ((T(!1), (p(`loading`).hidden = !0), !t)) {
              ((g.hidden = !0), S(`Chưa tạo được ảnh. Bạn vẫn có thể chia sẻ liên kết.`));
              for (let e of w) e.setAttribute(`aria-disabled`, `true`);
            } else ((s = t), (g.src = t.url), (g.alt = t.alt), (g.hidden = !1), S(``));
          }
        },
        N = async (e, t) => {
          if (t.getAttribute(`aria-disabled`) === `true`) return;
          a(`share`, { action: e, format: o });
          let n = { file: s?.file ?? null, text: y, link: h },
            r =
              e === `native` ? await se(m, n) : await ce(m, e, { ...n, blob: s?.blob ?? null, fileName: v });
          l ||
            S(
              r === `failed`
                ? e === `download`
                  ? `Chưa tải được ảnh. Bạn thử lại nhé.`
                  : `Chưa sao chép được. Liên kết của bạn: ${h}`
                : r === `copied`
                  ? e === `zalo`
                    ? O
                    : k
                  : (at[r] ?? ``),
            );
        };
      for (let e of d.querySelectorAll(`[data-act]`))
        e.addEventListener(`click`, () => void N(e.dataset.act, e));
      for (let e of d.querySelectorAll(`[data-format]`))
        e.addEventListener(`click`, () => {
          let t = e.dataset.format;
          t !== o && M(t);
        });
      (p(`close`).addEventListener(`click`, f),
        p(`done`).addEventListener(`click`, f),
        d.isConnected && p(`title`).focus({ preventScroll: !0 }),
        M(`feed`));
    })
  );
}
var ct = e({ renderPortrait: () => Ct }),
  $ = {
    fov: 24,
    yaw: 0.34,
    pitch: 0.07,
    margin: 1.06,
    feetFade: 0.12,
    alphaCut: 8,
    compileWaitMs: 1500,
    compilePollMs: 10,
    rimColor: 16175738,
    rim: 1.6,
  },
  lt = {
    high: { width: 512, height: 768, samples: 4, float: !0 },
    medium: { width: 512, height: 768, samples: 4, float: !0 },
    low: { width: 384, height: 576, samples: 0, float: !1 },
  };
function ut(e, t, n, r, i, a, o) {
  let s = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2, (e[2] + t[2]) / 2],
    c = (t[1] - e[1]) / 2,
    l = Math.hypot(t[0] - e[0], t[2] - e[2]) / 2,
    u = Math.tan((r * Math.PI) / 180 / 2),
    d = u * n,
    f = Math.max(((c + l * Math.sin(a)) * o) / u, (l * o) / d) + l,
    p = [Math.sin(i) * Math.cos(a), Math.sin(a), -Math.cos(i) * Math.cos(a)];
  return { position: [s[0] + p[0] * f, s[1] + p[1] * f, s[2] + p[2] * f], target: s };
}
function dt(e, t, n, r) {
  let i = t,
    a = n,
    o = -1,
    s = -1;
  for (let c = 0; c < n; c++) {
    let n = c * t * 4;
    for (let l = 0; l < t; l++)
      (e[n + l * 4 + 3] ?? 0) > r && (l < i && (i = l), l > o && (o = l), c < a && (a = c), c > s && (s = c));
  }
  return o < 0 ? null : { x: i, y: a, w: o - i + 1, h: s - a + 1 };
}
function ft(e, t, n, r) {
  for (let i = 0; i < n.h; i++) {
    let a = ((n.y + i) * t + n.x) * 4,
      o = i * n.w * 4;
    for (let t = 0; t < n.w * 4; t++) r[o + t] = e[a + t] ?? 0;
  }
}
function pt(e, t, n, r) {
  let i = Math.min(n, Math.max(0, Math.round(n * r)));
  for (let r = 0; r < i; r++) {
    let a = n - 1 - r,
      o = i <= 1 ? 0 : r / (i - 1),
      s = o * o * (3 - 2 * o);
    for (let n = 0; n < t; n++) {
      let r = (a * t + n) * 4 + 3;
      e[r] = Math.round((e[r] ?? 0) * s);
    }
  }
}
var mt = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,
  ht = `
uniform sampler2D tScene;
uniform float uExposure;
varying vec2 vUv;
vec3 portraitAces(vec3 color) {
  const mat3 inputMat = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );
  const mat3 outputMat = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );
  color *= uExposure / 0.6;
  color = inputMat * color;
  vec3 a = color * (color + 0.0245786) - 0.000090537;
  vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
  return clamp(outputMat * (a / b), 0.0, 1.0);
}
vec3 portraitSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}
void main() {
  vec4 src = texture2D(tScene, vec2(vUv.x, 1.0 - vUv.y));
  float alpha = clamp(src.a, 0.0, 1.0);
  vec3 color = alpha > 0.0 ? src.rgb / alpha : vec3(0.0);
  gl_FragColor = vec4(portraitSrgb(portraitAces(color)), alpha);
}`,
  gt = () => ({ createAvatar: E, document });
function _t(e) {
  let { calls: t, triangles: n, points: r, lines: i } = e.info.render;
  return {
    target: e.getRenderTarget(),
    face: e.getActiveCubeFace(),
    mip: e.getActiveMipmapLevel(),
    clearColor: e.getClearColor(new h()),
    clearAlpha: e.getClearAlpha(),
    autoClear: e.autoClear,
    counts: { calls: t, triangles: n, points: r, lines: i },
  };
}
function vt(e, t) {
  (e.setRenderTarget(t.target, t.face, t.mip),
    e.setClearColor(t.clearColor, t.clearAlpha),
    (e.autoClear = t.autoClear),
    Object.assign(e.info.render, t.counts));
}
function yt(e) {
  let t = w(T(), { night: 0, golden: 0.25, indoor: 0 });
  (e.add(new o(t.hemiSky, t.hemiGround, t.hemiIntensity)), e.add(new m(t.ambientColor, t.ambientIntensity)));
  let n = new y(t.sunColor, t.sunIntensity);
  n.position.set(-1.4, 2.4, -2.6);
  let r = new y($.rimColor, $.rim);
  r.position.set(1.6, 2, 2.4);
  for (let t of [n, r]) e.add(t, t.target);
}
function bt(e, t) {
  let n = new Set(),
    r = new Set(e.info.programs ?? []),
    i = _t(e);
  try {
    for (let [r, i, a] of t) {
      e.setRenderTarget(a);
      for (let t of e.compile(r, i)) {
        let r = e.properties.get(t);
        r.currentProgram && n.add(r.currentProgram);
      }
    }
  } finally {
    vt(e, i);
  }
  for (let t of e.info.programs ?? []) r.has(t) || n.add(t);
  return [...n];
}
function xt(e) {
  try {
    return typeof e.isReady != `function` || e.isReady();
  } catch {
    return !0;
  }
}
async function St(e, t, n) {
  if (typeof e.compile != `function` || n?.aborted) return;
  let r = bt(e, t);
  await new Promise((e) => {
    let t,
      i = () => {
        (clearTimeout(t), clearTimeout(a), n?.removeEventListener(`abort`, i), e());
      },
      a = setTimeout(i, $.compileWaitMs),
      o = () => {
        ((r = r.filter((e) => !xt(e))), r.length === 0 ? i() : (t = setTimeout(o, $.compilePollMs)));
      };
    (n?.addEventListener(`abort`, i), (t = setTimeout(o, $.compilePollMs)));
  });
}
async function Ct(e, { signal: t, deps: n = gt() } = {}) {
  let { renderer: r } = e,
    i = lt[e.quality] ?? lt.medium,
    a = i.width,
    o = i.height,
    m = null,
    h = [];
  try {
    if (t?.aborted || r.getContext().isContextLost()) return null;
    ((m = n.createAvatar(e.profile, { nameplate: !1, outfit: e.outfit })), m.setState(`idle`));
    let y = new d();
    (y.add(m.root), yt(y), y.updateMatrixWorld(!0));
    let x = new _().setFromObject(m.root);
    if (x.isEmpty()) return null;
    let S = new u($.fov, a / o, 0.05, 50),
      C = ut(x.min.toArray(), x.max.toArray(), a / o, $.fov, $.yaw, $.pitch, $.margin);
    (S.position.set(...C.position), S.lookAt(...C.target), S.updateMatrixWorld(!0));
    let w =
        i.float &&
        (r.extensions.has(`EXT_color_buffer_float`) || r.extensions.has(`EXT_color_buffer_half_float`)),
      T = new g(a, o, {
        type: w ? s : v,
        ...(w ? {} : { colorSpace: f }),
        samples: i.samples,
        depthBuffer: !0,
        resolveDepthBuffer: !1,
        minFilter: b,
        magFilter: b,
        generateMipmaps: !1,
      });
    h.push(T);
    let E = new g(a, o, { type: v, depthBuffer: !1, minFilter: b, magFilter: b, generateMipmaps: !1 });
    h.push(E);
    let D = new p({
      uniforms: { tScene: { value: T.texture }, uExposure: { value: 1 } },
      vertexShader: mt,
      fragmentShader: ht,
      blending: 0,
      depthTest: !1,
      depthWrite: !1,
    });
    h.push(D);
    let O = new c(new l(2, 2), D);
    (h.push(O.geometry), (O.frustumCulled = !1));
    let k = new d();
    if (
      (k.add(O),
      await St(
        r,
        [
          [y, S, T],
          [k, S, E],
        ],
        t,
      ),
      t?.aborted || r.getContext().isContextLost())
    )
      return null;
    let A = new Uint8Array(a * o * 4),
      j = _t(r);
    try {
      ((r.autoClear = !0),
        r.setClearColor(0, 0),
        r.setRenderTarget(T),
        r.render(y, S),
        r.setRenderTarget(E),
        r.render(k, S),
        r.readRenderTargetPixels(E, 0, 0, a, o, A));
    } finally {
      vt(r, j);
    }
    let M = dt(A, a, o, $.alphaCut);
    if (!M) return null;
    let N = n.document.createElement(`canvas`);
    ((N.width = M.w), (N.height = M.h));
    let P = N.getContext(`2d`);
    if (!P) return null;
    let F = P.createImageData(M.w, M.h);
    return (ft(A, a, M, F.data), pt(F.data, M.w, M.h, $.feetFade), P.putImageData(F, 0, 0), N);
  } catch (e) {
    return (console.error(`Không dựng được ảnh nhân vật`, e), null);
  } finally {
    m?.dispose();
    for (let e of h)
      try {
        e.dispose();
      } catch {}
  }
}
var wt = e({ offerShare: () => Dt }),
  Tt = `chua-online:share-prompt`,
  Et = `Công phu viên mãn. Chia vui cùng bạn bè nhé?`;
function Dt(e) {
  if (e.isBusy() || e.occupied() || !e.storage) return null;
  try {
    if (e.storage.getItem(`chua-online:share-prompt`) === e.day) return null;
    e.storage.setItem(Tt, e.day);
  } catch {
    return null;
  }
  let t = !1,
    n = () => {
      t || ((t = !0), clearTimeout(r), e.show(null));
    };
  (a(`share_prompt`, { action: `shown` }),
    e.show(Et, [
      {
        label: `Khoe ngay`,
        run: () => {
          (n(), e.open());
        },
      },
      {
        label: `Để sau`,
        run: () => {
          (a(`share_prompt`, { action: `dismiss` }), n());
        },
      },
    ]));
  let r = setTimeout(n, e.ms ?? 3e4);
  return n;
}
export { Ve as n, wt as t };
