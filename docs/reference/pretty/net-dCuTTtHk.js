const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./account-B3fmTrbD.js",
      "./rolldown-runtime-DK3Fl9T5.js",
      "./preload-helper-CRzLMJPS.js",
      "./dialog-DwXghOMX.js",
      "./index-e_Bx6V48.js",
      "./referral-CM6Fj8ux.js",
      "./index-C_1YXvDN.css",
      "./lazy-shared-D8DtrU9N.js",
      "./app-z_oU8L_u.js",
      "./progress-core-C9e35Hb5.js",
      "./three-BbSp8N3g.js",
      "./sky-X0ndF2_S.js",
      "./layout-DpGLadzd.js",
      "./lanterns-DsoFXr0b.js",
      "./vn-time-DznqUr4I.js",
      "./music-mix-9H0C50bM.js",
      "./app-DmNuXdg1.css",
      "./account-BGP7C-gf.css",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { Ft as t, Kt as n, T as r, X as i, it as a, z as o } from "./index-e_Bx6V48.js";
import { D as s, E as c, b as l } from "./lazy-shared-D8DtrU9N.js";
import { X as u, Z as ee, et as te, it as ne, nt as re, rt as ie, tt as ae } from "./app-z_oU8L_u.js";
import { h as oe } from "./progress-core-C9e35Hb5.js";
import { t as d } from "./preload-helper-CRzLMJPS.js";
var f = `x-chua-ticket`,
  p = `x-chua-turnstile`,
  se = e({ solveTurnstile: () => _e }),
  m = `chua-join-ticket`,
  h = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`,
  ce = 3e4;
function g() {
  try {
    return typeof sessionStorage > `u` ? null : sessionStorage;
  } catch {
    return null;
  }
}
function le() {
  try {
    return g()?.getItem(m) || null;
  } catch {
    return null;
  }
}
function ue(e) {
  try {
    g()?.setItem(m, e);
  } catch {}
}
function de() {
  try {
    g()?.removeItem(m);
  } catch {}
}
function fe(e, t) {
  let n = {};
  if (!s(e)) return n;
  let r = le();
  return (r !== null && (n[f] = r), t && (n[p] = t), n);
}
function pe(e) {
  if (typeof e != `object` || !e) return null;
  let { challenge: t, sitekey: n } = e;
  return t === `turnstile` && typeof n == `string` && n !== `` ? n : null;
}
function me(e) {
  let t = e.headers?.get(f);
  t && ue(t);
}
function he(e) {
  let t = le();
  return t === null ? e : `${e}${e.includes(`?`) ? `&` : `?`}t=${encodeURIComponent(t)}`;
}
function _() {
  return globalThis.turnstile;
}
var v = null;
function ge() {
  if (v !== null) return v;
  let e = new Promise((e, t) => {
    let n = _();
    if (n) {
      e(n);
      return;
    }
    let r = document.createElement(`script`);
    ((r.src = h),
      (r.async = !0),
      (r.defer = !0),
      (r.onload = () => {
        let n = _();
        n ? e(n) : t(Error(`turnstile: script nạp xong nhưng thiếu API`));
      }),
      (r.onerror = () => {
        (r.remove(), t(Error(`turnstile: không tải được script`)));
      }),
      document.head.appendChild(r));
  });
  return (
    (v = e),
    e.catch(() => {
      v === e && (v = null);
    }),
    e
  );
}
function _e(e, t = ce, n) {
  return new Promise((r, i) => {
    let a = !1,
      o,
      s,
      c = null,
      l = (e, t = ``) => {
        if (!a) {
          ((a = !0), clearTimeout(u));
          try {
            o && s !== void 0 && o.remove(s);
          } catch {}
          (c?.remove(), e ? i(e) : r(t));
        }
      },
      u = setTimeout(() => l(Error(`turnstile: quá hạn`)), t);
    ge().then(
      (t) => {
        if (!a) {
          ((o = t),
            (c = document.createElement(`div`)),
            c.setAttribute(`aria-hidden`, `true`),
            Object.assign(c.style, {
              position: `fixed`,
              left: `-9999px`,
              top: `0`,
              width: `0`,
              height: `0`,
              overflow: `hidden`,
            }),
            document.body.appendChild(c));
          try {
            if (
              ((s = t.render(c, {
                sitekey: e,
                execution: `execute`,
                retry: `never`,
                ...(n ? { action: n } : {}),
                callback: (e) => l(null, e),
                "error-callback": () => l(Error(`turnstile: widget báo lỗi`)),
                "expired-callback": () => l(Error(`turnstile: mã hết hạn`)),
                "timeout-callback": () => l(Error(`turnstile: widget quá hạn`)),
              })),
              a)
            )
              return;
            if (s === void 0) throw Error(`turnstile: không dựng được widget`);
            t.execute(s);
          } catch (e) {
            l(e instanceof Error ? e : Error(`turnstile: lỗi`));
          }
        }
      },
      (e) => l(e instanceof Error ? e : Error(`turnstile: lỗi`)),
    );
  });
}
var y = 7200,
  ve = `budget`;
function ye(e) {
  if (typeof e != `object` || !e) return null;
  let { reason: t, retryAfterSec: n } = e;
  return t === `budget`
    ? { retryAfterSec: typeof n == `number` && Number.isFinite(n) && n >= 1 ? Math.floor(n) : 600 }
    : null;
}
var be = `ping`,
  xe = 1e3,
  Se = [`kol`, `bandao`];
function Ce(e) {
  return typeof e == `number` && Number.isInteger(e) && e >= 0 && e <= 15 && (e & 3) < 3 && e >> 2 < 1;
}
var we = 8,
  Te = 9,
  Ee = 9,
  De = 10,
  b = 3,
  Oe = 4,
  x = 3,
  S = Math.PI * 2,
  C = 4,
  w = 64,
  ke = 6,
  Ae = [`idle`, `walk`, `sit`, `bow`],
  je = [`none`, `beads`, `chant`, `meditate`],
  Me = 4,
  T = `donate`,
  Ne = [`chap-tay`, `a-di-da-phat`, `tuy-hy`, `chuc-binh-an`],
  Pe = [`bell`, `incense`, `flowers`, `candle`],
  Fe = [`nam`, `nu`],
  Ie = [`lam`, `nau`, `xam`, `vang`],
  Le = [`full`, `version`, `bad-hello`, `rate`, `name`, `progress`];
function E(e) {
  if (!Number.isFinite(e)) return 0;
  let t = Math.round(e * 100);
  return t > 32767 ? 32767 : t < -32767 ? -32767 : t;
}
function D(e) {
  return e / 100;
}
function O(e) {
  if (!Number.isFinite(e)) return 0;
  let t = ((e % S) + S) % S;
  return Math.round((t / S) * 256) & 255;
}
function k(e) {
  return ((e & 255) / 256) * S;
}
function A(e) {
  return Number.isInteger(e) && e >= 0 && e < 255 ? e : 255;
}
var j = [`taken`, `group`];
function M(e, t) {
  let n = e.indexOf(t);
  return n < 0 ? 0 : n;
}
function N(e, t) {
  return e[t] ?? null;
}
function Re(e, t) {
  return typeof t == `string` && e.includes(t);
}
function ze(e) {
  return e === Me ? `none` : N(je, e);
}
function Be(e) {
  return e === T ? `none` : Re(je, e) ? e : null;
}
function Ve(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
function P(e) {
  return typeof e == `number` && Number.isInteger(e) && e >= 0 && e <= 65535;
}
function F(e) {
  return typeof e == `number` && Number.isFinite(e);
}
function I(e) {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}
function L(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function R(e) {
  let t = (e) => o(e).replace(/\s+/gu, ` `).trim(),
    n = t(
      e
        .normalize(`NFC`)
        .replace(/[\p{Cc}\p{Cf}\u2800]/gu, ` `)
        .replace(/\p{Default_Ignorable_Code_Point}/gu, ``)
        .normalize(`NFC`),
    ),
    r = Array.from(n);
  return r.length <= 24 ? n : t(r.slice(0, 24).join(``));
}
function He(e) {
  return typeof e == `string` && a(e) !== null ? e : void 0;
}
function Ue(e) {
  if (!Ve(e)) return null;
  let { name: t, gender: n, robe: r, level: i, streak: a } = e;
  if (typeof t != `string` || !Re(Fe, n) || !Re(Ie, r)) return null;
  let o = R(t);
  if (o.length === 0) return null;
  let s = { name: o, gender: n, robe: r },
    c = He(e.outfit);
  c !== void 0 && (s.outfit = c);
  let u = oe(i);
  u !== void 0 && (s.level = u);
  let ee = ae(a);
  return (ee !== void 0 && (s.streak = ee), l(e.title) && (s.title = e.title), s);
}
function We(e) {
  return Array.isArray(e) ? Se.filter((t) => e.includes(t)) : [];
}
function Ge(e) {
  return typeof e == `string` && e.length > 0 && e.length <= 300;
}
function Ke(e, t = !1) {
  let n = new Uint8Array(t ? Te : we),
    r = L(n);
  return (
    (n[0] = 1),
    r.setInt16(1, E(e.x), !0),
    r.setInt16(3, E(e.z), !0),
    (n[5] = O(e.facing)),
    (n[6] = M(Ae, e.anim)),
    (n[7] = A(e.seat)),
    t && (n[8] = (e.flags ?? 0) & 1),
    n
  );
}
function qe(e) {
  return typeof e == `number` && Number.isInteger(e) && e >= 0 && e < 128;
}
function Je(e) {
  return Uint8Array.of(8, qe(e) ? e : 255);
}
function Ye(e) {
  return Uint8Array.of(2, M(Ne, e));
}
function Xe(e) {
  return Uint8Array.of(3, M(Pe, e));
}
function Ze(e) {
  return Uint8Array.of(4, M(je, e));
}
function Qe(e) {
  return Uint8Array.of(5, A(e));
}
function $e() {
  return Uint8Array.of(6);
}
function et(e) {
  return Uint8Array.of(7, te(e) ? e : 0);
}
function tt(e) {
  return Uint8Array.of(9, Ce(e) ? e : 0);
}
function nt(e) {
  return Uint8Array.of(10, te(e) ? e : 0);
}
function rt(e) {
  return Number.isFinite(e) ? Math.max(0, Math.min(600, Math.ceil(e))) : 0;
}
function it(e, t, n = !1) {
  let r = M(Pe, `incense`) | ((M(re, e) + 1) << C);
  if (t === void 0) return Uint8Array.of(3, r);
  let i = Uint8Array.of(3, n ? r | w : r, 0, 0);
  return (L(i).setUint16(2, Math.max(1, rt(t)), !0), i);
}
function at(e) {
  return typeof e == `string` && /^[0-9A-Za-z_-]{16,40}$/.test(e);
}
function ot(e, t) {
  return JSON.stringify({ t: `hello`, v: 1, profile: e, sid: t });
}
function st(e) {
  return JSON.stringify({ t: `profile`, profile: e });
}
function ct(e) {
  let t = [];
  for (let n of e) {
    if (t.length >= 2) break;
    Ge(n) && !t.includes(n) && t.push(n);
  }
  return t.length === 0 ? null : JSON.stringify({ t: `badges`, tokens: t });
}
function lt(e) {
  if (!Array.isArray(e)) return;
  let t = [],
    n = new Set();
  for (let r of e.slice(0, 255)) {
    if (!Array.isArray(r)) continue;
    let [e, i, a] = r,
      o = typeof i == `number` ? N(re, i) : null;
    P(e) &&
      o !== null &&
      !n.has(e) &&
      (typeof a != `number` ||
        !Number.isFinite(a) ||
        a < 1 ||
        (n.add(e), t.push({ id: e, burner: o, sec: Math.min(Math.ceil(a), 600) })));
  }
  return t;
}
function z(e) {
  if (!Ve(e)) return null;
  let { id: t, x: n, z: r, facing: i, anim: a } = e;
  if (!P(t) || !F(n) || !F(r) || !F(i)) return null;
  let o = Be(e.activity);
  if (!Re(Ae, a) || o === null) return null;
  let s = Ue(e.profile);
  if (s === null) return null;
  let c = { id: t, profile: s, x: n, z: r, facing: i, anim: a, activity: o },
    l = We(e.badges);
  return (l.length > 0 && (c.badges = l), e.mindful === !0 && (c.mindful = !0), c);
}
function ut(e) {
  if (typeof e != `string`) return null;
  let t = I(e);
  if (!Ve(t)) return null;
  switch (t.t) {
    case `welcome`: {
      let { v: e, you: n, room: r, capacity: i, players: a } = t;
      if (
        !F(e) ||
        !Number.isInteger(e) ||
        !P(n) ||
        typeof r != `string` ||
        !F(i) ||
        !Number.isInteger(i) ||
        i < 1 ||
        !Array.isArray(a)
      )
        return null;
      let o = [];
      for (let e of a) {
        let t = z(e);
        if (t === null) return null;
        o.push(t);
      }
      let s = { t: `welcome`, v: e, you: n, room: r, capacity: i, players: o };
      t.phrases === !0 && (s.phrases = !0);
      let { seats: c, lanterns: l } = t;
      (typeof c == `number` && Number.isInteger(c) && c >= 1 && c < 255 && (s.seats = c),
        l === !0 && (s.lanterns = !0),
        t.releases === !0 && (s.releases = !0),
        t.ribbons === !0 && (s.ribbons = !0),
        t.stateFlags === !0 && (s.stateFlags = !0));
      let u = lt(t.incense);
      return (u !== void 0 && (s.incense = u), s);
    }
    case `join`: {
      let e = z(t.player);
      return e === null ? null : { t: `join`, player: e };
    }
    case `profile`: {
      let e = Ue(t.profile);
      if (!P(t.id) || e === null) return null;
      let n = We(t.badges);
      return n.length > 0
        ? { t: `profile`, id: t.id, profile: e, badges: n }
        : { t: `profile`, id: t.id, profile: e };
    }
    case `error`:
      if (!Re(Le, t.code) || typeof t.message != `string`) return null;
      if (t.reason === `budget`) {
        let e = t.retryAfterSec;
        return {
          t: `error`,
          code: t.code,
          message: t.message,
          reason: ve,
          ...(typeof e == `number` && Number.isFinite(e) && e >= 1 ? { retryAfterSec: Math.floor(e) } : {}),
        };
      }
      return { t: `error`, code: t.code, message: t.message };
    default:
      return null;
  }
}
function B(e, t, n) {
  if (e.length < 2) return null;
  let r = e[1] ?? 0;
  if (r > n || e.length !== 2 + r * x) return null;
  let i = [];
  for (let n = 0; n < r; n++) {
    let r = 2 + n * x,
      a = e[r] ?? 255;
    if (!te(a)) return null;
    i.push({ code: a, ageSec: t.getUint16(r + 1, !0) });
  }
  return i;
}
function dt(e) {
  if (e.length === 0) return null;
  let t = L(e);
  switch (e[0]) {
    case 16: {
      if (e.length < 2) return null;
      let n = e[1] ?? 0;
      if (e.length !== 2 + n * Ee) return null;
      let r = [];
      for (let i = 0; i < n; i++) {
        let n = 2 + i * Ee,
          a = N(Ae, e[n + 7] ?? 255),
          o = ze(e[n + 8] ?? 255);
        if (a === null || o === null) return null;
        r.push({
          id: t.getUint16(n, !0),
          x: D(t.getInt16(n + 2, !0)),
          z: D(t.getInt16(n + 4, !0)),
          facing: k(e[n + 6] ?? 0),
          anim: a,
          activity: o,
        });
      }
      return { kind: `snapshot`, entries: r };
    }
    case 28: {
      if (e.length < 2) return null;
      let n = e[1] ?? 0;
      if (e.length !== 2 + n * De) return null;
      let r = [];
      for (let i = 0; i < n; i++) {
        let n = 2 + i * De,
          a = N(Ae, e[n + 7] ?? 255),
          o = ze(e[n + 8] ?? 255);
        if (a === null || o === null) return null;
        r.push({
          id: t.getUint16(n, !0),
          x: D(t.getInt16(n + 2, !0)),
          z: D(t.getInt16(n + 4, !0)),
          facing: k(e[n + 6] ?? 0),
          anim: a,
          activity: o,
          mindful: !!((e[n + 9] ?? 0) & 1),
        });
      }
      return { kind: `snapshot`, entries: r };
    }
    case 17:
      return e.length === 3 ? { kind: `leave`, id: t.getUint16(1, !0) } : null;
    case 26: {
      if (e.length !== 4) return null;
      let n = e[3] ?? 255;
      return qe(n) ? { kind: `phrase`, id: t.getUint16(1, !0), code: n } : null;
    }
    case 18: {
      if (e.length !== 4) return null;
      let n = N(Ne, e[3] ?? 255);
      return n === null ? null : { kind: `emote`, id: t.getUint16(1, !0), emote: n };
    }
    case 19: {
      if (e.length !== 4) return null;
      let n = N(Pe, e[3] ?? 255);
      return n === null ? null : { kind: `action`, id: t.getUint16(1, !0), action: n };
    }
    case 20:
      return e.length === 3 ? { kind: `count`, online: t.getUint16(1, !0) } : null;
    case 21: {
      if (e.length < 2) return null;
      let n = e[1] ?? 0;
      if (n >= 255 || e.length !== 2 + n * b) return null;
      let r = [];
      for (let i = 0; i < n; i++) {
        let n = 2 + i * b,
          a = e[n] ?? 255;
        if (a >= 255) return null;
        r.push({ seat: a, id: t.getUint16(n + 1, !0) });
      }
      return { kind: `seats`, entries: r };
    }
    case 22: {
      if (e.length < 2) return null;
      let n = e[1] ?? 0;
      if (n >= 255 || e.length !== 2 + n * Oe) return null;
      let r = [];
      for (let i = 0; i < n; i++) {
        let n = 2 + i * Oe,
          a = e[n] ?? 255,
          o = e[n + 1] ?? 2;
        if (a >= 255 || o > 1) return null;
        r.push({ seat: a, id: o === 1 ? t.getUint16(n + 2, !0) : null });
      }
      return { kind: `seat-delta`, entries: r };
    }
    case 23: {
      if (e.length !== 2) return null;
      let t = e[1] ?? 255;
      return t < 255 ? { kind: `seat-denied`, seat: t } : null;
    }
    case 29: {
      if (e.length !== 3) return null;
      let t = e[1] ?? 255,
        n = N(j, e[2] ?? 255);
      return t < 255 && n !== null ? { kind: `seat-deny-reason`, seat: t, reason: n } : null;
    }
    case 24: {
      if (e.length !== 2) return null;
      let t = e[1] ?? 255;
      return te(t) ? { kind: `lantern`, code: t } : null;
    }
    case 25: {
      let n = B(e, t, 12);
      return n && { kind: `lanterns`, entries: n };
    }
    case 32: {
      if (e.length !== 2) return null;
      let t = e[1] ?? 255;
      return te(t) ? { kind: `ribbon`, code: t } : null;
    }
    case 33: {
      let n = B(e, t, 48);
      return n && { kind: `ribbons`, entries: n };
    }
    case 30: {
      if (e.length !== 2) return null;
      let t = e[1] ?? 255;
      return Ce(t) ? { kind: `release`, code: t } : null;
    }
    case 31: {
      if (e.length < 2) return null;
      let n = e[1] ?? 0;
      if (n > 12 || e.length !== 2 + n * x) return null;
      let r = [];
      for (let i = 0; i < n; i++) {
        let n = 2 + i * x,
          a = e[n] ?? 255;
        Ce(a) && r.push({ code: a, ageSec: t.getUint16(n + 1, !0) });
      }
      return { kind: `releases`, entries: r };
    }
    case 27: {
      if (e.length !== ke) return null;
      let n = N(re, e[3] ?? 255);
      if (n === null) return null;
      let r = Math.min(t.getUint16(4, !0), 600);
      return { kind: `incense`, id: t.getUint16(1, !0), burner: n, sec: r };
    }
    default:
      return null;
  }
}
var V = `chua-online:resume`;
function ft() {
  let e = ``;
  for (let t of crypto.getRandomValues(new Uint8Array(16))) e += t.toString(16).padStart(2, `0`);
  return e;
}
function pt() {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}
function mt(e, t) {
  try {
    let n = e?.getItem(V);
    if (!n) return null;
    e?.removeItem(V);
    let { sid: r, room: i, at: a } = JSON.parse(n);
    return !at(r) || !(Math.abs(t - Number(a)) <= 6e5)
      ? null
      : typeof i == `number` && Number.isInteger(i) && i > 0
        ? { sid: r, room: i }
        : { sid: r };
  } catch {
    return null;
  }
}
function ht(e, t, n) {
  try {
    e?.setItem(V, JSON.stringify({ ...t, at: n }));
  } catch {}
}
var gt = e({ createWsNet: () => un, orderBadgeTokens: () => ln, parseRoomParam: () => Y });
function _t(e, t) {
  n() &&
    d(
      () =>
        import(`./account-B3fmTrbD.js`)
          .then((e) => e.a)
          .then(
            (n) => n.notePresence(e, t),
            () => void 0,
          ),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
      import.meta.url,
    );
}
var vt = `me`,
  yt = 5e3,
  bt = 4500,
  xt = 3e3,
  St = 6e3,
  Ct = 3e3,
  wt = 3e3,
  Tt = 25e3,
  Et = 6e4,
  H = 8e3,
  Dt = 1e3,
  U = 3e4,
  W = 2e3,
  G = 0.5,
  K = 3e4,
  Ot = 6e4,
  kt = [`pointerdown`, `keydown`, `touchstart`],
  At = 4e3,
  jt = 1e4,
  Mt = 5e3,
  Nt = 1500,
  Pt = xe + 250,
  q = 5,
  Ft = 1,
  J = -1 / 0,
  It = `Các phòng đã đầy — bạn đang ở chế độ một mình.`,
  Lt = `Mất kết nối máy chủ — bạn đang ở chế độ một mình, sẽ tự vào lại phòng khi kết nối được.`,
  Rt = `Phiên bản này đã cũ — hãy tải lại trang để vào chung với mọi người.`,
  zt = `Bạn đang tạm bị chặn khỏi phòng chung vì vi phạm nội quy — bạn vẫn tu tập một mình được.`,
  Bt = `Phòng chơi đang tạm nghỉ để giữ chi phí — bạn vẫn tu tập một mình được, sẽ tự mở lại sau.`,
  Vt = `Bạn đã tạm rời phòng chung vì lâu không thao tác — chạm vào màn hình hoặc nhấn phím bất kỳ để vào lại.`,
  Ht = `Tên này chưa phù hợp với nội quy Chùa Sen — bạn đang ở chế độ một mình. Đổi tên khác để vào phòng chung nhé.`,
  Ut = 6e4,
  Wt = 6e5,
  Gt = 0.15,
  Kt = class extends Error {
    constructor(e, n) {
      (super(e), t(this, `retryAfterSec`, void 0), (this.retryAfterSec = n));
    }
  };
function qt(e) {
  return Math.min(y, Math.max(600, Math.floor(e !== void 0 && Number.isFinite(e) ? e : 0)));
}
function Jt(e, t = Math.random) {
  let n = Math.min(U, H * 2 ** Math.max(0, e));
  return Math.round(Dt + (n - Dt) * t());
}
function Yt(e = Math.random) {
  return Math.round(K + 6e4 * e());
}
function Xt(e) {
  let t = e?.trim();
  if (t !== void 0 && /^\d{1,9}$/.test(t)) return Math.min(600, Number(t));
}
function Zt(e, t = Math.random) {
  let n = Math.min(600, Math.max(0, e)) * 1e3;
  return Math.round(n + t() * Math.max(W, n * G));
}
function Y(e, t) {
  let n = t.includes(`?`) ? t.slice(t.indexOf(`?`) + 1) : ``;
  for (let t of [e, n]) {
    let e = new URLSearchParams(t).get(`room`);
    if (e !== null && /^\d{1,3}$/.test(e)) {
      let t = Number(e);
      if (t >= 1) return t;
    }
  }
}
function Qt(e, t, n) {
  if (/^wss?:\/\//i.test(t)) return t;
  let r = n;
  if (!r && /^https?:\/\//i.test(e))
    try {
      r = new URL(e).origin;
    } catch {}
  return (
    (r ??= globalThis.location?.origin),
    (r ??= `ws://localhost`),
    r.replace(/^http/i, `ws`).replace(/\/+$/, ``) + (t.startsWith(`/`) ? t : `/${t}`)
  );
}
function $t(e, t, n) {
  return t === void 0 ? e : `${e}${e.includes(`?`) ? `&` : `?`}${n ? `room` : `near`}=${t}`;
}
function X(e) {
  let t = { mode: `offline`, roomLabel: null, online: 1 };
  return (e !== void 0 && (t.notice = e), t);
}
function en(e) {
  if (e === null) return 255;
  let t = /(\d+)$/.exec(e),
    n = t?.[1] === void 0 ? -1 : Number(t[1]) - 1;
  if (n >= 0 && n < 255) return n;
  let r = 2166136261;
  for (let t = 0; t < e.length; t++) r = Math.imul(r ^ e.charCodeAt(t), 16777619);
  return (r >>> 0) % 255;
}
function tn(e) {
  let t = {
    id: String(e.id),
    profile: { ...e.profile },
    x: e.x,
    z: e.z,
    facing: e.facing,
    anim: e.anim,
    activity: e.activity,
  };
  return (
    e.badges !== void 0 && e.badges.length > 0 && (t.badges = [...e.badges]),
    e.mindful === !0 && (t.mindful = !0),
    t
  );
}
function nn(e, t) {
  return {
    x: E(e.x),
    z: E(e.z),
    facing: O(e.facing),
    anim: e.anim,
    seat: en(e.seatId),
    mindful: t && e.mindful === !0 && (e.anim === `idle` || e.anim === `walk`),
  };
}
function rn(e, t) {
  return (
    t === null ||
    e.anim !== t.anim ||
    e.seat !== t.seat ||
    e.facing !== t.facing ||
    e.mindful !== t.mindful ||
    Math.hypot(e.x - t.x, e.z - t.z) >= q
  );
}
function an(e) {
  return (
    typeof e == `object` &&
    !!e &&
    typeof e.addEventListener == `function` &&
    typeof e.removeEventListener == `function`
  );
}
function on(e) {
  return e !== null && (e.visibilityState === `hidden` || e.hidden === !0);
}
function sn(e) {
  let t = e === void 0 ? null : a(e);
  return t === null ? void 0 : i[t.style];
}
function cn(e) {
  try {
    let t = (e.split(`.`)[0] ?? ``).replace(/-/g, `+`).replace(/_/g, `/`);
    return JSON.parse(atob(t)).badge;
  } catch {
    return;
  }
}
function ln(e, t) {
  let n = (e) => {
    let n = cn(e);
    return n !== void 0 && n === t ? 0 : n === `kol` ? 1 : 2;
  };
  return [...e].sort((e, t) => n(e) - n(t));
}
function un(e) {
  let t = new Set(),
    n = new Map(),
    i = new Set(),
    a = new Set(),
    o = new Set(),
    s = null,
    l = X(),
    re = e.resumeStore === void 0 ? pt() : e.resumeStore,
    ae = mt(re, Date.now()),
    oe = ae?.sid ?? ft(),
    d = !1,
    f = 0,
    p = !1,
    se = !1,
    m = !1,
    h = 0,
    ce = 0,
    g = 0,
    le = null,
    ue = null,
    _ = !1,
    v = !1,
    ge = 0,
    y = !1,
    ve = null,
    xe = null,
    Se = 0,
    we = J,
    Te = null,
    Ee = null,
    De = null,
    b = null,
    Oe = !1,
    x = null,
    S = !1,
    C = -1,
    w = null,
    ke = e.preferredRoom ?? ae?.room,
    Ae = e.preferredRoom !== void 0,
    je = 1,
    Me = 0,
    T = !1,
    Ne = !1,
    Pe = !1,
    Fe = !1,
    Ie = !1,
    Le = !1,
    E = !1,
    D = new Map(),
    O = null,
    k = null,
    A = null,
    j = null,
    M = J,
    N = J,
    Re = 0,
    ze = J,
    Be = null,
    Ve = new Set(),
    P = new Map(),
    F = e.incenseMemory ?? ee(),
    I = !1,
    L = null,
    R = null,
    He = null,
    Ue = null,
    We = J,
    Ge = `none`,
    rt = `none`,
    at = J,
    lt = null,
    z = null,
    B = null,
    V = null,
    gt = null,
    H = null,
    Dt = null,
    U = null;
  function W(e) {
    ne(t, e);
  }
  function G(t) {
    ((l = t),
      W({ type: `status`, status: { ...t } }),
      t.mode !== `connecting` &&
        s !== null &&
        (e.presence === void 0 ? _t : e.presence)?.(t.mode === `online` ? (ke ?? null) : null, () => ({
          name: s?.name ?? ``,
          level: s?.level ?? null,
          streak: s?.streak ?? null,
        })));
  }
  function K() {
    W({ type: `snapshot`, players: [...n.values()] });
  }
  function q(e) {
    return (e !== null && clearTimeout(e), null);
  }
  function Y() {
    lt = q(lt);
  }
  function en(e) {
    let t = Be;
    t !== null && ((Be = null), clearTimeout(t.timer), t.done?.(e));
  }
  function cn() {
    ((se = !0), (z = q(z)));
    let e = ue;
    ((ue = null), e?.());
  }
  function ln(e) {
    return e === C ? vt : String(e);
  }
  function un() {
    let e = new Map();
    for (let [t, n] of D) (n !== C || t === A) && e.set(t, ln(n));
    return (A !== null && !e.has(A) && e.set(A, vt), e);
  }
  function dn() {
    ne(i, un(), A);
  }
  function fn() {
    queueMicrotask(dn);
  }
  function pn(e, t = `taken`) {
    (A === e && (A = null), O === e && (O = A), ne(a, e, t), dn());
  }
  function mn(e) {
    O === e && ((A = e), dn());
  }
  function hn(e) {
    let t = null;
    for (let [e, n] of D) n === C && (t = e);
    t === null ? A !== null && e?.has(A) && ((A = null), (O = null)) : ((A = t), (O = t));
  }
  function gn() {
    ((T = !1),
      (Ne = !1),
      (Pe = !1),
      (Fe = !1),
      en(!0),
      (Ie = !1),
      (E = !1),
      (k = null),
      (j = q(j)),
      D.clear(),
      O !== null && (A = O),
      dn(),
      Sn());
  }
  function _n() {
    let e = Date.now(),
      t = [];
    for (let [n, r] of P)
      r.endsAt <= e
        ? P.delete(n)
        : t.push({ owner: String(n), burner: r.burner, endsAt: r.endsAt, mine: !1 });
    let n = F.get(e);
    return (n !== null && t.push({ owner: vt, burner: n.burner, endsAt: n.endsAt, mine: !0 }), t);
  }
  function vn() {
    ne(Ve, _n());
  }
  function yn(e, t = !1) {
    let n = Date.now(),
      r = F.get(n);
    if (!S || !I || r === null) {
      L = null;
      return;
    }
    L = { tries: e };
    let i = (r.endsAt - n) / 1e3;
    Z(t ? it(r.burner) : it(r.burner, i, !r.announced));
  }
  function bn(e, t) {
    R = q(R);
    let n = L;
    t > 0
      ? (F.set({ burner: e, endsAt: Date.now() + t * 1e3, announced: !0 }), (L = null), vn())
      : n === null || F.get() === null
        ? (L = null)
        : n.tries >= 5
          ? ((L = null), W({ type: `incense-unshared` }))
          : (R = setTimeout(() => {
              ((R = null), L === n && yn(n.tries + 1));
            }, yt));
  }
  function xn(e) {
    let t = n.get(e);
    if (t === void 0) return;
    let r = Date.now() + 6e5;
    (P.set(e, { burner: ie(t.x, t.z), endsAt: r }), vn());
  }
  function Sn() {
    ((I = !1), (L = null), (R = q(R)), P.size !== 0 && (P.clear(), vn()));
  }
  function Z(e) {
    let t = x;
    if (t !== null && t.readyState === Ft)
      try {
        t.send(e);
      } catch {}
  }
  function Q(e) {
    S && Z(e);
  }
  function Cn(e, t) {
    ((V = q(V)),
      (Ue = t),
      (We = Date.now()),
      Q(Ke({ x: e.x, z: e.z, facing: e.facing, anim: e.anim, seat: t.seat, flags: +!!t.mindful }, Ie)));
  }
  function wn() {
    if (!S || He === null) return;
    let e = nn(He, Ie);
    if (!rn(e, Ue)) return;
    let t = We + 200 - Date.now();
    t <= 0
      ? Cn(He, e)
      : V === null &&
        (V = setTimeout(() => {
          ((V = null), wn());
        }, t));
  }
  function Tn() {
    ((U = q(U)), S && s !== null && ((at = Date.now()), (xe = s.name), Z(st(s))));
  }
  function En() {
    let t = [];
    try {
      t = e.badgeTokens?.(sn(s?.outfit)) ?? [];
    } catch {}
    let n = e.adminBadge;
    if (n === void 0) {
      Dn(t);
      return;
    }
    let r = x,
      i = !1,
      a = null,
      o = (e) => {
        i || ((i = !0), (a = q(a)), S && x === r && Dn(e === null ? t : [e, ...t]));
      };
    a = setTimeout(() => o(null), Ct);
    try {
      n(oe).then(o, () => o(null));
    } catch {
      o(null);
    }
  }
  function Dn(e) {
    let t = ct(e);
    t !== null && Q(t);
  }
  function On() {
    (gt !== null && clearInterval(gt), (gt = null));
  }
  function kn() {
    (On(),
      (gt = setInterval(() => {
        Date.now() - Me > Et ? $(`lost`) : Q(be);
      }, Tt)));
  }
  function An(e) {
    if (S) return;
    if (e.v !== 1) {
      $(`outdated`);
      return;
    }
    ((B = q(B)), (C = e.you), n.clear());
    for (let t of e.players) t.id !== C && n.set(t.id, tn(t));
    ((S = !0),
      (p = !1),
      (m = !1),
      (g = 0),
      (ce = Date.now()),
      (je = n.size + 1),
      e.room && (w = e.room),
      (Ue = null),
      (We = J),
      (rt = `none`),
      (U = q(U)),
      (at = J),
      (T = e.seats !== void 0),
      (Ne = e.lanterns === !0),
      (Pe = e.releases === !0),
      en(!0),
      (Fe = e.ribbons === !0),
      Fe || W({ type: `ribbons`, entries: [] }),
      (Ie = e.stateFlags === !0),
      (Le = !1),
      (E = e.phrases === !0),
      D.clear(),
      G({ mode: `online`, roomLabel: w, online: je }),
      K(),
      kn(),
      En(),
      Ge !== `none` && ((rt = Ge), Q(Ze(Ge))),
      O !== null && (T ? Q(Qe(O)) : A !== O && Mn(O)),
      A !== null && dn(),
      wn(),
      (I = e.incense !== void 0),
      (L = null),
      (R = q(R)),
      P.clear());
    let t = Date.now();
    for (let r of e.incense ?? []) n.has(r.id) && P.set(r.id, { burner: r.burner, endsAt: t + r.sec * 1e3 });
    let r = F.get(t);
    (r !== null && I
      ? yn(1)
      : r !== null && !r.announced && (Q(Xe(`incense`)), F.set({ ...r, announced: !0 })),
      vn(),
      cn());
  }
  function jn(e) {
    let t = ut(e);
    if (t !== null)
      switch (t.t) {
        case `welcome`:
          An(t);
          break;
        case `join`:
          t.player.id !== C && (n.set(t.player.id, tn(t.player)), K());
          break;
        case `profile`: {
          let e = n.get(t.id);
          if (e) {
            let r = { ...e, profile: { ...t.profile } };
            (t.badges !== void 0 && t.badges.length > 0 ? (r.badges = [...t.badges]) : delete r.badges,
              n.set(t.id, r),
              K());
          }
          break;
        }
        case `error`:
          t.reason === `budget` ? $(`budget`, t.retryAfterSec) : Ln(t.code);
      }
  }
  function Mn(e) {
    ((j = q(j)),
      (j = setTimeout(() => {
        ((j = null), mn(e));
      }, Nt)));
  }
  function Nn(e) {
    let t = dt(e);
    if (t !== null)
      switch (t.kind) {
        case `snapshot`: {
          e[0] === 16 ? Ie && !Le && ((Le = !0), (Ue = null), wn()) : (Le = !1);
          let r = !1;
          for (let e of t.entries) {
            let t = n.get(e.id);
            if (
              t &&
              (t.x !== e.x ||
                t.z !== e.z ||
                t.facing !== e.facing ||
                t.anim !== e.anim ||
                t.activity !== e.activity ||
                (e.mindful !== void 0 && e.mindful !== (t.mindful === !0)))
            ) {
              let i = { ...t, x: e.x, z: e.z, facing: e.facing, anim: e.anim, activity: e.activity };
              (e.mindful !== void 0 && (i.mindful = e.mindful), n.set(e.id, i), (r = !0));
            }
          }
          r && K();
          break;
        }
        case `leave`:
          (n.delete(t.id) && K(), P.delete(t.id) && vn());
          break;
        case `emote`:
          (t.id === C || n.has(t.id)) && W({ type: `emote`, playerId: ln(t.id), emote: t.emote });
          break;
        case `action`:
          (t.id === C || n.has(t.id)) &&
            (t.action === `incense` && !I && t.id !== C && xn(t.id),
            W({ type: `action`, playerId: ln(t.id), action: t.action }));
          break;
        case `phrase`:
          (t.id === C || n.has(t.id)) && W({ type: `phrase`, playerId: ln(t.id), code: t.code });
          break;
        case `count`:
          ((je = Math.max(1, t.online)), S && G({ mode: `online`, roomLabel: w, online: je }));
          break;
        case `seats`:
          D.clear();
          for (let e of t.entries) D.set(e.seat, e.id);
          (hn(), dn());
          break;
        case `seat-delta`: {
          let e = new Set();
          for (let n of t.entries) (e.add(n.seat), n.id === null ? D.delete(n.seat) : D.set(n.seat, n.id));
          (hn(e), dn());
          break;
        }
        case `seat-deny-reason`:
          k = { seat: t.seat, reason: t.reason };
          break;
        case `seat-denied`: {
          let e = k?.seat === t.seat ? k.reason : `taken`;
          ((k = null), pn(t.seat, e));
          break;
        }
        case `lantern`:
          ne(o, { code: t.code, ageSec: 0, mine: !1 });
          break;
        case `lanterns`:
          for (let e of t.entries) ne(o, { code: e.code, ageSec: e.ageSec, mine: !1 });
          break;
        case `release`:
          W({ type: `release`, code: t.code, ageSec: 0, mine: !1 });
          break;
        case `releases`: {
          let e = ++Re;
          for (let n of t.entries)
            W({ type: `release`, code: n.code, ageSec: n.ageSec, mine: !1, backlog: e });
          break;
        }
        case `ribbon`:
          Be?.code === t.code ? en(!0) : W({ type: `ribbon`, code: t.code, ageSec: 0 });
          break;
        case `ribbons`:
          W({ type: `ribbons`, entries: t.entries });
          break;
        case `incense`:
          t.id === C
            ? bn(t.burner, t.sec)
            : n.has(t.id) &&
              (t.sec > 0
                ? P.set(t.id, { burner: t.burner, endsAt: Date.now() + t.sec * 1e3 })
                : P.delete(t.id),
              vn());
      }
  }
  function Pn(e) {
    ((Me = Date.now()),
      (Se += 1),
      typeof e == `string`
        ? jn(e)
        : e instanceof ArrayBuffer
          ? Nn(new Uint8Array(e))
          : ArrayBuffer.isView(e) && Nn(new Uint8Array(e.buffer, e.byteOffset, e.byteLength)));
  }
  function Fn(e) {
    ((ve = e), $(`name`), W({ type: `name-rejected`, name: e }));
  }
  function In() {
    let e = xe ?? s?.name ?? ``;
    ((ve = e), s?.name === e && W({ type: `name-rejected`, name: e }));
  }
  function Ln(e) {
    e === `name`
      ? S
        ? In()
        : Fn(xe ?? s?.name ?? ``)
      : e === `progress`
        ? W({ type: `progress-hidden` })
        : e === `full`
          ? $(`full`)
          : e === `version`
            ? $(`outdated`)
            : e === `rate`
              ? $(S ? `lost` : `unreachable`, 15)
              : $(S ? `lost` : `unreachable`);
  }
  function Rn() {
    let e = x;
    if (((x = null), (B = q(B)), (V = q(V)), (Dt = q(Dt)), (U = q(U)), On(), e !== null)) {
      ((e.onopen = null), (e.onmessage = null), (e.onerror = null), (e.onclose = null));
      try {
        e.close(1e3, `bye`);
      } catch {}
    }
  }
  function zn(e, t) {
    ((m = !0), G(X(e)), cn(), t && Vn(Yt()));
  }
  function Bn() {
    let e = Math.max(0, ge - Date.now()),
      t = Math.max(Ut, Math.min(Wt, e * Gt));
    return e + Math.round(Math.random() * t);
  }
  function Vn(e) {
    (Y(),
      d &&
        !_ &&
        (lt = setTimeout(
          () => {
            ((lt = null), Kn());
          },
          Math.max(e, g - Date.now()),
        )));
  }
  function $(e, t) {
    if (!d) return;
    let r = S;
    ((S = !1),
      (p = !1),
      Rn(),
      r && n.size > 0 && (n.clear(), K()),
      r && gn(),
      r && Date.now() - ce >= 6e4 && (h = 0),
      t !== void 0 && (e === `unreachable` || e === `lost`) && (g = Math.max(g, Date.now() + Zt(t))),
      e === `budget`
        ? ((ge = Date.now() + qt(t) * 1e3), zn(Bt, !1), Vn(Bn()))
        : e === `full`
          ? zn(It, !0)
          : e === `name`
            ? ((m = !0), (y = !0), Y(), G(X(Ht)), cn())
            : e === `outdated` || e === `banned`
              ? ((m = !0), (v = !0), Y(), G(X(e === `banned` ? zt : Rt)), cn())
              : se
                ? m
                  ? (l.notice !== `Chưa kết nối được máy chủ — bạn đang ở chế độ một mình.` &&
                      l.notice !==
                        `Mất kết nối máy chủ — bạn đang ở chế độ một mình, sẽ tự vào lại phòng khi kết nối được.` &&
                      G(X(u)),
                    Vn(Yt()))
                  : ((h += 1),
                    h >= 4
                      ? (l.notice !==
                          `Mất kết nối máy chủ — bạn đang ở chế độ một mình, sẽ tự vào lại phòng khi kết nối được.` &&
                          G(X(Lt)),
                        Vn(Yt()))
                      : (G({ mode: `connecting`, roomLabel: w, online: 1 }), Vn(Jt(h - 1))))
                : zn(u, !0));
  }
  function Hn(e) {
    let t = ye(e);
    return t === null ? { kind: `full` } : { kind: `budget`, retryAfterSec: t.retryAfterSec };
  }
  async function Un(t) {
    let n = new AbortController(),
      r,
      i = new Promise((e, t) => {
        r = setTimeout(() => {
          (n.abort(), t(Error(`lobby timeout`)));
        }, bt);
      }),
      a = e.fetchImpl ?? ((e, t) => fetch(e, t)),
      o = async () => {
        let r = $t(e.lobbyUrl, ke, Ae),
          i = await a(r, {
            signal: n.signal,
            cache: `no-store`,
            headers: { ...c(r, { accept: `application/json` }), ...fe(r, t) },
          }),
          o = () => Xt(i.headers?.get(`retry-after`));
        if ((me(i), i.status === 401)) {
          let e = pe(await i.json().catch(() => null));
          if (e !== null) return { kind: `challenge`, sitekey: e };
          throw new Kt(`lobby 401`, o());
        }
        if (i.status === 503) {
          let e = await i.json().catch(() => null);
          if (e?.full === !0) return Hn(e);
          throw new Kt(`lobby unavailable`, o());
        }
        if (i.status === 403 && (await i.json().catch(() => null))?.banned === !0) return { kind: `banned` };
        if (!i.ok) throw new Kt(`lobby ${i.status}`, o());
        let s = await i.json();
        if (s.full === !0) return Hn(s);
        if (typeof s.room != `number` || typeof s.label != `string` || typeof s.ws != `string`)
          throw Error(`lobby: phản hồi không hợp lệ`);
        return { kind: `ok`, room: s.room, label: s.label, ws: s.ws };
      };
    try {
      return await Promise.race([o(), i]);
    } finally {
      r !== void 0 && clearTimeout(r);
    }
  }
  function Wn(t, n) {
    let r;
    try {
      ((r = new (e.WebSocketImpl ?? WebSocket)(he(Qt(e.lobbyUrl, n.ws, e.wsOrigin)))),
        (r.binaryType = `arraybuffer`));
    } catch {
      $(`unreachable`);
      return;
    }
    ((x = r),
      (ke = n.room),
      (Ae = n.room === e.preferredRoom),
      (w = n.label),
      (Me = Date.now()),
      (B = setTimeout(() => {
        ((B = null), t === f && x === r && !S && $(`unreachable`));
      }, St)),
      (r.onopen = () => {
        x === r && s !== null && ((xe = s.name), Z(ot(s, oe)));
      }),
      (r.onmessage = (e) => {
        if (x === r)
          try {
            Pn(e.data);
          } catch (e) {
            console.error(`[net] lỗi khi xử lý gói tin`, e);
          }
      }),
      (r.onerror = () => {}),
      (r.onclose = (e) => {
        x === r &&
          (e.code === 4002 && e.reason === `budget`
            ? $(`budget`)
            : e.code === 4001
              ? $(`full`)
              : e.code === 4002
                ? $(`outdated`)
                : e.code === 4006
                  ? Fn(xe ?? s?.name ?? ``)
                  : e.code === 4007
                    ? $(`banned`)
                    : e.code === 4023
                      ? Xn()
                      : e.code === 4022
                        ? (de(), $(S ? `lost` : `unreachable`))
                        : e.code === 1008
                          ? $(S ? `lost` : `unreachable`, 15)
                          : (e.code === 4020 && (oe = ft()), $(S ? `lost` : `unreachable`)));
      }));
  }
  async function Gn(e) {
    let t;
    try {
      if (((t = await Un()), t.kind === `challenge`)) {
        de();
        let n = await _e(t.sitekey);
        if (e !== f || !d) return;
        if (((t = await Un(n)), t.kind === `challenge`)) throw Error(`turnstile: sảnh vẫn đòi thử thách`);
      }
    } catch (t) {
      e === f && d && $(`unreachable`, t instanceof Kt ? t.retryAfterSec : void 0);
      return;
    }
    e === f &&
      d &&
      (t.kind === `budget`
        ? $(`budget`, t.retryAfterSec)
        : t.kind === `full`
          ? $(`full`)
          : t.kind === `banned`
            ? $(`banned`)
            : Wn(e, t));
  }
  function Kn() {
    if (!d || _ || p || S || y) return;
    if (s !== null && (s.name === ve || !r(s.name).ok)) {
      Fn(s.name);
      return;
    }
    if (Date.now() < ge) {
      lt === null && Vn(Bn());
      return;
    }
    let e = g - Date.now();
    e > 0 ? lt === null && Vn(e) : ((p = !0), (f += 1), Gn(f));
  }
  function qn() {
    !d || _ || v || S || p || Date.now() < g || (Y(), Kn());
  }
  function Jn() {
    if (!d || !S || Dt !== null || Date.now() - Me < jt) return;
    let e = Se;
    (Q(be),
      (Dt = setTimeout(() => {
        ((Dt = null), S && Se === e && $(`lost`));
      }, At)));
  }
  function Yn() {
    if (((H = q(H)), !d || _)) return;
    ((_ = !0), (f += 1), (p = !1));
    let e = S;
    ((S = !1),
      Rn(),
      Y(),
      e ? (n.clear(), K(), gn(), G({ mode: `connecting`, roomLabel: w, online: 1 })) : se || zn(u, !1));
  }
  function Xn() {
    if (!d || _) return;
    (Yn(), (Oe = !0), G(X(Vt)), b?.());
    let e = globalThis.window;
    if (!an(e)) return;
    let t = () => Zn();
    for (let n of kt) e.addEventListener(n, t, !0);
    b = () => {
      for (let n of kt) e.removeEventListener(n, t, !0);
      b = null;
    };
  }
  function Zn() {
    if (!_) return;
    ((_ = !1), b?.());
    let e = Oe;
    ((Oe = !1), d && !v && ((h = 0), e && G({ mode: `connecting`, roomLabel: w, online: 1 }), Kn()));
  }
  function Qn() {
    if (!d) return;
    if (on(Ee)) {
      ((Te ??= Date.now()), !_ && H === null && (H = setTimeout(Yn, Ot)));
      return;
    }
    let e = Te === null ? 0 : Date.now() - Te;
    ((Te = null), (H = q(H)), !_ && e >= 6e4 && Yn(), _ ? Zn() : Jn());
  }
  function $n() {
    if (!d || _ || v) return;
    if (S) {
      Jn();
      return;
    }
    if (p) return;
    let e = Date.now();
    e - we < Mt || ((we = e), qn());
  }
  function er() {
    De?.();
    let e = globalThis,
      t = an(e.window) ? e.window : null,
      n = an(e.document) ? e.document : null;
    Ee = n;
    let r = () => {
        (ht(re, { sid: oe, room: ke }, Date.now()), Yn());
      },
      i = (e) => {
        (e?.persisted === !0 && mt(re, Date.now()), Zn());
      };
    (n?.addEventListener(`visibilitychange`, Qn),
      t?.addEventListener(`online`, $n),
      t?.addEventListener(`pagehide`, r),
      t?.addEventListener(`pageshow`, i),
      (De = () => {
        (n?.removeEventListener(`visibilitychange`, Qn),
          t?.removeEventListener(`online`, $n),
          t?.removeEventListener(`pagehide`, r),
          t?.removeEventListener(`pageshow`, i),
          (De = null));
      }),
      on(n) && Qn());
  }
  return {
    connect(e) {
      return (
        (s = { ...e }),
        le === null &&
          ((d = !0),
          (se = !1),
          (m = !1),
          (_ = !1),
          (v = !1),
          (y = !1),
          (h = 0),
          er(),
          G({ mode: `connecting`, roomLabel: null, online: 1 }),
          (le = new Promise((e) => {
            ue = e;
          })),
          (z = setTimeout(() => {
            ((z = null), !se && !S && zn(u, !1));
          }, xt)),
          Kn()),
        le
      );
    },
    sendState(e) {
      ((He = { ...e }), wn());
    },
    sendEmote(e) {
      S ? Z(Ye(e)) : W({ type: `emote`, playerId: vt, emote: e });
    },
    sendPhrase(e) {
      qe(e) && (S ? E && Z(Je(e)) : W({ type: `phrase`, playerId: vt, code: e }));
    },
    get phrasesAware() {
      return !S || E;
    },
    sendAction(e) {
      Q(Xe(e));
    },
    setActivity(e) {
      ((Ge = e), S && rt !== e && ((rt = e), Z(Ze(e))));
    },
    get seatAware() {
      return !S || T;
    },
    claimSeat(e) {
      !Number.isInteger(e) || e < 0 || e >= 255
        ? queueMicrotask(() => pn(e))
        : ((O = e), (j = q(j)), S && T ? Z(Qe(e)) : S ? Mn(e) : queueMicrotask(() => mn(e)));
    },
    releaseSeat() {
      let e = O !== null || A !== null;
      ((O = null), (A = null), (j = q(j)), e && (S && T && Z($e()), fn()));
    },
    onSeats(e) {
      return (
        i.add(e),
        () => {
          i.delete(e);
        }
      );
    },
    onSeatDenied(e) {
      return (
        a.add(e),
        () => {
          a.delete(e);
        }
      );
    },
    sendLantern(e) {
      let t = Date.now();
      return !te(e) || t - M < 1e4
        ? !1
        : ((M = t), S && Ne && Z(et(e)), queueMicrotask(() => ne(o, { code: e, ageSec: 0, mine: !0 })), !0);
    },
    onLantern(e) {
      return (
        o.add(e),
        () => {
          o.delete(e);
        }
      );
    },
    sendRelease(e) {
      let t = Date.now();
      return !Ce(e) || t - N < 6e4
        ? !1
        : ((N = t),
          S && Pe && Z(tt(e)),
          queueMicrotask(() => W({ type: `release`, code: e, ageSec: 0, mine: !0 })),
          !0);
    },
    sendRibbon(e, t) {
      let n = Date.now();
      return !te(e) || n - ze < 6e4
        ? !1
        : ((ze = n),
          S && Fe
            ? (Z(nt(e)), en(!0), (Be = { code: e, done: t, timer: setTimeout(() => en(!1), wt) }))
            : t && queueMicrotask(() => t(!0)),
          !0);
    },
    lightIncense(e) {
      let t = Date.now(),
        n = F.get(t);
      if (n !== null) return (n.endsAt - t) / 1e3;
      let r = { burner: e, endsAt: t + 6e5, announced: !1 };
      return (
        F.set(r),
        (R = q(R)),
        S && I ? yn(1, !0) : S && (Z(Xe(`incense`)), F.set({ ...r, announced: !0 })),
        queueMicrotask(vn),
        0
      );
    },
    incenseSticks: _n,
    onIncense(e) {
      return (
        Ve.add(e),
        () => {
          Ve.delete(e);
        }
      );
    },
    updateProfile(e) {
      if (((s = { ...e }), y)) {
        if (e.name === ve) return;
        ((y = !1), (m = !1), (h = 0), G({ mode: `connecting`, roomLabel: w, online: 1 }), Kn());
        return;
      }
      if (!S) return;
      let t = at + Pt - Date.now();
      t <= 0 ? Tn() : (U ??= setTimeout(Tn, t));
    },
    getStatus: () => ({ ...l }),
    on(e) {
      return (
        t.add(e),
        () => {
          t.delete(e);
        }
      );
    },
    disconnect() {
      ((d = !1),
        (S = !1),
        (p = !1),
        (_ = !1),
        (v = !1),
        (y = !1),
        (ve = null),
        (xe = null),
        (ge = 0),
        (g = 0),
        (Te = null),
        (f += 1),
        De?.(),
        b?.(),
        (Oe = !1),
        (Ee = null),
        (H = q(H)),
        Rn(),
        Y(),
        (z = q(z)),
        n.clear(),
        (T = !1),
        (Ne = !1),
        (Pe = !1),
        (Fe = !1),
        en(!0),
        (Ie = !1),
        (E = !1),
        (j = q(j)),
        D.clear(),
        (O = null),
        (A = null),
        (I = !1),
        (L = null),
        (R = q(R)),
        P.clear(),
        (l = X()),
        (Ue = null),
        (We = J),
        (rt = `none`),
        cn(),
        (le = null));
    },
  };
}
export { se as n, gt as t };
