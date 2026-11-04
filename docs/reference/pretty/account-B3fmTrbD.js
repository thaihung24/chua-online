const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./net-dCuTTtHk.js",
      "./rolldown-runtime-DK3Fl9T5.js",
      "./index-e_Bx6V48.js",
      "./preload-helper-CRzLMJPS.js",
      "./referral-CM6Fj8ux.js",
      "./dialog-DwXghOMX.js",
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
      "./progress-BuhROEX9.js",
      "./rituals-DFATLOei.js",
      "./water-paths-DYM7yuBe.js",
      "./rituals-CrEmldgK.css",
      "./streak-tiers-B_2fwVfy.js",
      "./progress-4zgJG7wY.css",
      "./friends-AJd_o965.js",
      "./friends-CB78mI0D.css",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { t } from "./preload-helper-CRzLMJPS.js";
import { n, o as r, r as i } from "./dialog-DwXghOMX.js";
import {
  B as a,
  Bt as o,
  C as s,
  D as c,
  F as l,
  Ft as u,
  Gt as d,
  Ht as f,
  I as p,
  P as m,
  Ut as h,
  Vt as g,
  Wt as _,
  gt as v,
  ht as y,
  it as b,
  qt as x,
  st as S,
  v as C,
  wt as w,
  x as T,
  y as ee,
  zt as E,
} from "./index-e_Bx6V48.js";
import { C as te, E as D, S as O, T as ne, w as k } from "./lazy-shared-D8DtrU9N.js";
import { x as A } from "./progress-core-C9e35Hb5.js";
var j = `Đã đăng nhập. Chùa sẽ tự lưu nhân vật của bạn.`;
function M(e, t) {
  w(`account_sync`, {
    result: e.kind,
    source: t,
    ...(e.kind === `ok` && { pulled: e.pulledChanges, pushed: e.pushed }),
  });
}
async function N(e, t, n = () => location.reload()) {
  let r;
  try {
    r = await e.sync();
  } catch {
    return `dialog`;
  }
  return (M(r, t), r.kind === `ok` ? (r.pulledChanges ? (n(), `reload`) : `ready`) : `dialog`);
}
var P = 3e5,
  re = `Đã nhận tiến trình từ máy khác`,
  F = `Tải lại`;
function ie(e = h, t = () => location.reload()) {
  e.prompt ? e.prompt(re, { label: F, run: t }) : e.notify?.(re);
}
var ae = null;
function oe(e) {
  let t = (t) => {
      e.pushIfDirty(t).then(
        (e) => {
          e &&
            (w(`account_sync`, {
              result: e.kind,
              source: t ? `hidden` : `timer`,
              ...(e.kind === `ok` && { pulled: e.pulledChanges, pushed: e.pushed }),
            }),
            e.kind === `ok` && e.pulledChanges && (ae ?? ie)());
        },
        () => void 0,
      );
    },
    n = () => {
      document.visibilityState === `hidden` && t(!0);
    },
    r = setInterval(() => {
      document.visibilityState === `visible` && t(!1);
    }, P);
  return (
    document.addEventListener(`visibilitychange`, n),
    () => {
      (clearInterval(r), document.removeEventListener(`visibilitychange`, n));
    }
  );
}
var I = 21600,
  L = 3e5,
  se = [
    1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080,
    310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
    264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808,
    3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
    1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771,
    3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
    1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474,
    2756734187, 3204031479, 3329325298,
  ],
  ce = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
  R = 2 ** 32,
  z = (e, t) => (e >>> t) | (e << (32 - t));
function le(e) {
  let t = new TextEncoder().encode(e),
    n = t.length * 8,
    r = new Uint8Array(((t.length + 9 + 63) >> 6) << 6);
  (r.set(t), (r[t.length] = 128));
  let i = new DataView(r.buffer);
  (i.setUint32(r.length - 8, Math.floor(n / R)), i.setUint32(r.length - 4, n >>> 0));
  let a = Uint32Array.from(ce),
    o = new Uint32Array(64),
    s = (e, t) => e[t] ?? 0;
  for (let e = 0; e < r.length; e += 64) {
    for (let t = 0; t < 16; t++) o[t] = i.getUint32(e + t * 4);
    for (let e = 16; e < 64; e++) {
      let t = s(o, e - 15),
        n = s(o, e - 2),
        r = z(t, 7) ^ z(t, 18) ^ (t >>> 3),
        i = z(n, 17) ^ z(n, 19) ^ (n >>> 10);
      o[e] = s(o, e - 16) + r + s(o, e - 7) + i;
    }
    let t = s(a, 0),
      n = s(a, 1),
      r = s(a, 2),
      c = s(a, 3),
      l = s(a, 4),
      u = s(a, 5),
      d = s(a, 6),
      f = s(a, 7);
    for (let e = 0; e < 64; e++) {
      let i = f + (z(l, 6) ^ z(l, 11) ^ z(l, 25)) + ((l & u) ^ (~l & d)) + s(se, e) + s(o, e),
        a = (z(t, 2) ^ z(t, 13) ^ z(t, 22)) + ((t & n) ^ (t & r) ^ (n & r));
      ((f = d), (d = u), (u = l), (l = (c + i) | 0), (c = r), (r = n), (n = t), (t = (i + a) | 0));
    }
    [t, n, r, c, l, u, d, f].forEach((e, t) => {
      a[t] = s(a, t) + e;
    });
  }
  return Array.from(a, (e) => e.toString(16).padStart(8, `0`)).join(``);
}
var ue = I * 1e3 + L + 6e5,
  de = 8e3;
function fe(e) {
  let t = e.split(`.`)[1];
  if (!t) return null;
  try {
    let e = t.replace(/-/g, `+`).replace(/_/g, `/`),
      n = Uint8Array.from(atob(e.padEnd(Math.ceil(e.length / 4) * 4, `=`)), (e) => e.charCodeAt(0)),
      r = JSON.parse(new TextDecoder().decode(n));
    return typeof r == `object` && r ? r : null;
  } catch {
    return null;
  }
}
function pe(e) {
  let t = fe(e)?.app_metadata;
  return typeof t == `object` && !!t && t.role === `admin`;
}
function B() {
  try {
    return localStorage;
  } catch {
    return null;
  }
}
var V = null,
  H = null;
function me(e = B()) {
  try {
    e?.removeItem(f);
  } catch {}
}
function he(e) {
  return ne(le(O + e));
}
function U(e) {
  try {
    let t = e?.getItem(`chuasen-auth`) ?? null;
    if (t === null) return !1;
    let n = JSON.parse(t).access_token;
    return typeof n == `string` && pe(n);
  } catch {
    return !1;
  }
}
async function ge(e, t) {
  let n = t.now ?? Date.now,
    r = () => (V !== null && V.binding === e && V.expiresAt > n() ? V.token : null),
    i;
  try {
    i = await t.getToken();
  } catch {
    return r();
  }
  if (i === null || !pe(i)) return ((V = null), null);
  let a = t.fetchImpl ?? ((e, t) => fetch(e, t)),
    o = te(e),
    s = typeof AbortController > `u` ? null : new AbortController(),
    c = s ? setTimeout(() => s.abort(), de) : void 0;
  try {
    let t = await a(o, {
      method: `GET`,
      cache: `no-store`,
      headers: D(o, { accept: `application/json`, authorization: `Bearer ${i}` }),
      ...(s ? { signal: s.signal } : {}),
    });
    if (t.status === 404) return ((V = null), null);
    if (!t.ok) return r();
    let c = k(await t.json().catch(() => null));
    return c === null
      ? r()
      : ((V = { token: c.token, binding: e, expiresAt: n() + c.expiresInSec * 1e3 }), c.token);
  } catch {
    return r();
  } finally {
    c !== void 0 && clearTimeout(c);
  }
}
function _e(e, t) {
  let n = t.storage === void 0 ? B() : t.storage;
  if ((me(n), !U(n))) return ((V = null), Promise.resolve(null));
  let r = he(e),
    i = (t.now ?? Date.now)();
  if (V !== null && V.binding === r && V.expiresAt - i >= ue) return Promise.resolve(V.token);
  if (H !== null && H.binding === r) return H.promise;
  let a = ge(r, t).catch(() => null),
    o = { binding: r, promise: a };
  return (
    (H = o),
    a.then(() => {
      H === o && (H = null);
    }),
    a
  );
}
function ve(e, t = B()) {
  me(t);
  let n = null;
  return e.onChange((e) => {
    let t = e.status === `signed-in` ? e.user.id : null;
    (t !== n && (V = null), (n = t));
  });
}
var ye = `chuasen-google-verifier`,
  be = `chuasen-auth-refresh`,
  W = `/dang-nhap/`,
  G = 60,
  xe = 2e4,
  Se = 1e4,
  Ce = `email-otp`,
  we = `Không kết nối được. Kiểm tra mạng rồi thử lại.`,
  Te = `Email chưa đúng dạng. Bạn kiểm tra lại nhé.`,
  Ee = `Bạn vừa xin mã nhiều lần, đợi ít phút rồi thử lại.`,
  De = `Mã không đúng hoặc đã hết hạn.`,
  Oe = `Chưa gửi được email lúc này. Thử đăng nhập bằng Google hoặc thử lại sau.`,
  ke = `Chưa xác minh được trình duyệt, bạn thử lại nhé.`,
  Ae = `Chưa xác minh được trình duyệt. Hãy tắt trình chặn quảng cáo hoặc mở trang bằng Chrome / Safari rồi thử lại nhé.`,
  je = `Bạn đã huỷ đăng nhập Google.`,
  Me = `Đăng nhập Google không thành công, thử lại nhé.`,
  Ne = `Không đăng nhập Google được ở trình duyệt này. Hãy dùng mã gửi qua email, hoặc mở trang bằng Chrome / Safari.`,
  Pe = `Phiên đăng nhập đã hết. Bạn đăng nhập lại nhé.`,
  Fe = `Máy chủ đang bận. Thử lại sau nhé.`,
  Ie = `Chưa xoá được tài khoản. Thử lại sau nhé.`,
  Le = `Trình duyệt này không cho lưu dữ liệu tạm nên chưa đăng nhập Google được.`,
  K = class extends Error {
    constructor(e, t) {
      (super(e), u(this, `code`, void 0), (this.name = `AccountError`), (this.code = t));
    }
  },
  Re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function ze(e) {
  try {
    return e();
  } catch {
    return null;
  }
}
function Be(e = ``) {
  return {
    url: x.supabaseUrl.replace(/\/+$/, ``),
    key: x.publishableKey,
    googleClientId: x.googleClientId,
    fetch: (e, t) => fetch(e, t),
    storage: ze(() => window.localStorage),
    tmp: ze(() => window.sessionStorage),
    now: () => Date.now(),
    origin: location.origin,
    userAgent: navigator.userAgent,
    locks: typeof navigator < `u` && `locks` in navigator ? navigator.locks : null,
    navigate: (e) => location.assign(e),
    random: (e) => crypto.getRandomValues(new Uint8Array(e)),
    timeoutMs: xe,
    captcha:
      e === ``
        ? null
        : {
            siteKey: e,
            solve: async (e, n, r) =>
              (
                await t(
                  async () => {
                    let { solveTurnstile: e } = await import(`./net-dCuTTtHk.js`).then((e) => e.n);
                    return { solveTurnstile: e };
                  },
                  __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
                  import.meta.url,
                )
              ).solveTurnstile(e, n, r),
            timeoutMs: Se,
          },
  };
}
function Ve(e) {
  let t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) t[n] = parseInt(e.slice(n * 2, n * 2 + 2), 16);
  return t;
}
function He(e) {
  let t = ``;
  for (let n of e) t += String.fromCharCode(n);
  return btoa(t).replace(/\+/g, `-`).replace(/\//g, `_`).replace(/=+$/, ``);
}
var Ue = (e) => typeof e == `object` && !!e && !Array.isArray(e);
function We(e) {
  if (!Ue(e) || !Ue(e.user)) return null;
  let { access_token: t, refresh_token: n, expires_at: r, user: i } = e;
  if (
    typeof t != `string` ||
    t === `` ||
    typeof n != `string` ||
    n === `` ||
    typeof r != `number` ||
    !Number.isFinite(r) ||
    typeof i.id != `string` ||
    i.id === ``
  )
    return null;
  let a = i.method === `google` || i.method === `email` ? i.method : null;
  return {
    access_token: t,
    refresh_token: n,
    expires_at: r,
    user: { id: i.id, email: typeof i.email == `string` && i.email ? i.email : null, method: a },
  };
}
function Ge(e, t) {
  return e === `captcha_failed` || t.includes(`captcha`);
}
function Ke(e, t, n, r = !0) {
  let i = Ue(t) ? t : {},
    a = String(i.error_code ?? i.error ?? i.code ?? ``).toLowerCase(),
    o = String(i.msg ?? i.message ?? i.error_description ?? ``).toLowerCase();
  return e === 429 || a.includes(`rate_limit`) || o.includes(`rate limit`)
    ? Ee
    : n === `verify`
      ? De
      : n === `google`
        ? Me
        : n === `otp`
          ? Ge(a, o)
            ? r
              ? ke
              : Ae
            : (e === 400 || e === 422) &&
                (a.includes(`email`) || a.includes(`validation`) || o.includes(`email`))
              ? Te
              : Oe
          : Fe;
}
function qe(e = Be()) {
  let t = null,
    n = null,
    r = ``,
    i = Promise.resolve(),
    a = new Set();
  function s() {
    let n;
    try {
      n = e.storage?.getItem(`chuasen-auth`) ?? null;
    } catch {
      n = null;
    }
    if (n === null) return t;
    try {
      let e = We(JSON.parse(n));
      if (e) return e;
    } catch {}
    try {
      e.storage?.removeItem(E);
    } catch {}
    return null;
  }
  function c(n) {
    try {
      if (!e.storage) throw Error(`no storage`);
      (e.storage.setItem(E, JSON.stringify(n)), (t = null));
    } catch {
      t = n;
    }
  }
  function l() {
    t = null;
    try {
      e.storage?.removeItem(E);
    } catch {}
  }
  function u() {
    try {
      e.storage?.removeItem(o);
    } catch {}
  }
  let d = (e) => (e ? { status: `signed-in`, user: { ...e.user } } : { status: `signed-out` }),
    f = (e) => e?.user.id ?? ``;
  function p() {
    let e = s(),
      t = f(e);
    if (t !== r) {
      r = t;
      for (let t of [...a]) t(d(e));
    }
  }
  let m = (e) => {
    (e.key === `chuasen-auth` || e.key === null) && p();
  };
  function h(e) {
    return (
      a.size === 0 && ((r = f(s())), typeof window < `u` && window.addEventListener(`storage`, m)),
      a.add(e),
      () => {
        (a.delete(e), a.size === 0 && typeof window < `u` && window.removeEventListener(`storage`, m));
      }
    );
  }
  async function _(t, n = {}) {
    let r = { apikey: e.key, ...n.headers };
    (n.body !== void 0 && (r[`Content-Type`] = `application/json`),
      n.token && (r.Authorization = `Bearer ${n.token}`));
    let i = typeof AbortController > `u` ? null : new AbortController(),
      a = i ? setTimeout(() => i.abort(), e.timeoutMs) : void 0;
    try {
      return await e.fetch(`${e.url}${t}`, {
        method: n.method ?? `GET`,
        headers: r,
        ...(n.body !== void 0 && { body: JSON.stringify(n.body) }),
        ...(n.keepalive && { keepalive: !0 }),
        ...(i && { signal: i.signal }),
      });
    } catch {
      throw new K(we, `network`);
    } finally {
      clearTimeout(a);
    }
  }
  async function v(e) {
    try {
      return await e.json();
    } catch {
      return null;
    }
  }
  function b(e) {
    let t = i.then(e, e);
    return ((i = t.catch(() => void 0)), t);
  }
  function x(t) {
    return e.locks ? e.locks.request(be, t) : t();
  }
  function S(t, n, r) {
    if (!Ue(t) || !Ue(t.user)) return null;
    let { access_token: i, refresh_token: a, expires_at: o, expires_in: s } = t;
    if (typeof i != `string` || typeof a != `string`) return null;
    let c =
        typeof o == `number` && Number.isFinite(o) ? o : e.now() / 1e3 + (typeof s == `number` ? s : 3600),
      l = Ue(t.user.app_metadata) ? t.user.app_metadata.provider : void 0,
      u = n ?? r?.user.method ?? (l === `google` ? `google` : l === `email` ? `email` : null);
    return We({
      access_token: i,
      refresh_token: a,
      expires_at: c,
      user: { id: t.user.id, email: t.user.email, method: u },
    });
  }
  async function C(e) {
    let t = await _(`/auth/v1/token?grant_type=refresh_token`, {
      method: `POST`,
      body: { refresh_token: e.refresh_token },
      keepalive: !0,
    });
    if (t.ok) {
      let n = S(await v(t), null, e);
      if (!n) throw new K(Fe, `server`);
      return (c(n), p(), n);
    }
    if (t.status === 429 || t.status >= 500) throw new K(Fe, `server`);
    let n = s();
    return n && n.refresh_token !== e.refresh_token ? n : (l(), p(), null);
  }
  async function w(t) {
    let n = s();
    if (!n) return null;
    let r = n.expires_at - G > e.now() / 1e3;
    return t === void 0 && r
      ? n
      : b(() =>
          x(async () => {
            let n = s();
            if (!n) return null;
            let r = n.expires_at - G > e.now() / 1e3;
            return (t === void 0 ? r : n.access_token !== t) ? n : C(n);
          }),
        );
  }
  async function T(e, t = {}) {
    let n = await w();
    if (!n) throw new K(Pe, `signed-out`);
    let r = await _(e, { ...t, token: n.access_token });
    if (r.status === 401) {
      if (((n = await w(n.access_token)), !n)) throw new K(Pe, `signed-out`);
      r = await _(e, { ...t, token: n.access_token });
    }
    return r;
  }
  async function ee() {
    let t = e.captcha;
    if (!t || t.siteKey === ``) return null;
    let n;
    try {
      let e = await Promise.race([
        t.solve(t.siteKey, t.timeoutMs, Ce),
        new Promise((e, r) => {
          n = setTimeout(() => r(Error(`captcha: quá hạn`)), t.timeoutMs);
        }),
      ]);
      return typeof e == `string` && e.trim() !== `` ? e : null;
    } catch {
      return null;
    } finally {
      clearTimeout(n);
    }
  }
  async function te(e) {
    let t = typeof e == `string` ? e.trim() : ``;
    if (t.length > 254 || !Re.test(t)) throw Error(Te);
    let n = await ee(),
      r = await _(`/auth/v1/otp`, {
        method: `POST`,
        body: {
          email: t,
          create_user: !0,
          ...(n !== null && { gotrue_meta_security: { captcha_token: n } }),
        },
      });
    if (!r.ok) throw Error(Ke(r.status, await v(r), `otp`, n !== null));
  }
  async function D(e, t) {
    let n = typeof e == `string` ? e.trim() : ``,
      r = typeof t == `string` ? t.replace(/\s+/g, ``) : ``;
    if (!/^\d{6}$/.test(r)) throw Error(De);
    let i = await _(`/auth/v1/verify`, { method: `POST`, body: { type: `email`, email: n, token: r } });
    if (!i.ok) throw Error(Ke(i.status, await v(i), `verify`));
    let a = S(await v(i), `email`);
    if (!a) throw Error(Fe);
    return (c(a), p(), { ...a.user });
  }
  function O() {
    return e.googleClientId !== `` && !y(e.userAgent);
  }
  function ne() {
    if (!O()) throw Error(Ne);
    let t = He(e.random(32));
    try {
      if (!e.tmp) throw Error(`no storage`);
      e.tmp.setItem(ye, t);
    } catch {
      throw Error(Le);
    }
    let n = new URLSearchParams({
      provider: `google`,
      redirect_to: `${e.origin}${W}`,
      code_challenge: He(Ve(le(t))),
      code_challenge_method: `s256`,
      prompt: `select_account`,
    });
    e.navigate(`${e.url}/auth/v1/authorize?${n.toString()}`);
  }
  async function k(e, t) {
    let n = new URLSearchParams(e),
      r = n.get(`error`);
    if (r !== null) throw Error(r === `access_denied` ? je : Me);
    let i = n.get(`code`);
    if (!i || !t) throw Error(Me);
    let a = await _(`/auth/v1/token?grant_type=pkce`, {
      method: `POST`,
      body: { auth_code: i, code_verifier: t },
    });
    if (!a.ok) throw Error(Ke(a.status, await v(a), `google`));
    let o = S(await v(a), `google`);
    if (!o) throw Error(Me);
    return (c(o), p(), { ...o.user });
  }
  function A() {
    if (n) return n;
    let t = ze(() => e.tmp?.getItem(`chuasen-google-return`) ?? null);
    if (t === null) return Promise.resolve(null);
    let r = ze(() => e.tmp?.getItem(ye) ?? null);
    for (let t of [g, ye]) ze(() => e.tmp?.removeItem(t));
    return ((n = k(t, r)), n);
  }
  async function j() {
    let e = s();
    if ((l(), e && u(), p(), e))
      try {
        await _(`/auth/v1/logout?scope=local`, { method: `POST`, token: e.access_token, keepalive: !0 });
      } catch {}
  }
  async function M() {
    if (!(await T(`/rest/v1/rpc/delete_my_account`, { method: `POST`, body: {} })).ok) throw Error(Ie);
    (l(), u(), p());
  }
  function N() {
    return d(s());
  }
  return {
    state: N,
    onChange: h,
    sendEmailCode: te,
    verifyEmailCode: D,
    googleAvailable: O,
    startGoogle: ne,
    finishGoogleIfReturning: A,
    signOut: j,
    deleteAccount: M,
    session: () => w(),
    authed: T,
    json: v,
  };
}
var Je = `chua-online:outfit-unlocks`,
  Ye = [m, a, Je, c, A],
  Xe = 2e5;
function Ze(e) {
  let t = {};
  for (let n of Ye) {
    let r = e(n);
    typeof r == `string` && r.length <= Xe && (t[n] = r);
  }
  return t;
}
var q = (e) => typeof e == `object` && !!e && !Array.isArray(e);
function J(e) {
  if (e === void 0) return null;
  try {
    return JSON.parse(e);
  } catch {
    return null;
  }
}
function Qe(e) {
  return JSON.stringify(e, (e, t) =>
    q(t) ? Object.fromEntries(Object.entries(t).sort(([e], [t]) => (e < t ? -1 : +(e > t)))) : t,
  );
}
function $e(e) {
  let t = p(J(e));
  return t ? JSON.stringify(t) : null;
}
function et(e) {
  let t = b(e ?? null);
  return t ? S(t) : null;
}
var tt = /^[a-z0-9-]{1,24}$/,
  nt = 16,
  rt = 1e6,
  it = (e) => (typeof e == `number` && Number.isFinite(e) && e > 0 ? Math.min(Math.floor(e), rt) : 0);
function at(e) {
  let t = J(e);
  if (!q(t)) return null;
  let n = [];
  for (let e of Array.isArray(t.badges) ? t.badges : [])
    if ((typeof e == `string` && tt.test(e) && !n.includes(e) && n.push(e), n.length >= nt)) break;
  return {
    level: it(t.level),
    tier: it(t.tier),
    referrals: it(t.referrals),
    badges: n,
    streak: it(t.streak),
  };
}
var ot = (e) =>
  JSON.stringify({
    level: e.level,
    tier: e.tier,
    referrals: e.referrals,
    badges: [...e.badges].sort(),
    streak: e.streak,
  });
function st(e, t, n) {
  let [r, i] = [at(e), at(t)];
  if (!r || !i) return r || i ? ot(r ?? i) : null;
  let a = at(n),
    o =
      a !== null &&
      r.level >= a.level &&
      r.tier >= a.tier &&
      r.referrals >= a.referrals &&
      r.streak >= a.streak,
    s = a
      ? [
          ...r.badges.filter((e) => i.badges.includes(e) || !a.badges.includes(e)),
          ...i.badges.filter((e) => !r.badges.includes(e) && (!a.badges.includes(e) || !o)),
        ]
      : [...new Set([...r.badges, ...i.badges])];
  return ot({
    level: Math.max(r.level, i.level),
    tier: Math.max(r.tier, i.tier),
    referrals: Math.max(r.referrals, i.referrals),
    badges: s.slice(0, nt),
    streak: Math.max(r.streak, i.streak),
  });
}
var ct = [`version`, `today`, `totals`, `history`];
function lt(e) {
  let t = J(e);
  if (!q(t)) return null;
  let n = {};
  for (let e of ct) t[e] !== void 0 && (n[e] = t[e]);
  return ((n.version ??= 1), n);
}
function ut(e) {
  let t = lt(e);
  return t ? JSON.stringify(t) : null;
}
function dt(e, t) {
  let n = lt(e);
  if (!n) return null;
  let r = J(t),
    i = q(r) ? r : {};
  return JSON.stringify({
    version: n.version,
    ...(i.mixVersion !== void 0 && { mixVersion: i.mixVersion }),
    ...(i.settings !== void 0 && { settings: i.settings }),
    ...(n.today !== void 0 && { today: n.today }),
    totals: n.totals,
    history: n.history,
  });
}
function ft(e, t, n) {
  if (t === void 0) return null;
  switch (e) {
    case m:
      return $e(t);
    case a:
      return et(t);
    case Je: {
      let e = at(t);
      return e ? ot(e) : null;
    }
    case c: {
      let e = lt(t);
      return e ? Qe(e) : null;
    }
    case A: {
      let e = J(t);
      if (!q(e)) return null;
      let r = n.sanitizeBlob(e);
      return r === null ? null : r === `newer` ? t : Qe(r);
    }
    default:
      return null;
  }
}
function pt(e, t) {
  let n = {};
  for (let r of Ye) {
    let i = ft(r, e[r], t);
    i !== null && (n[r] = i);
  }
  return n;
}
function mt(e, t) {
  let n = J(e[c]);
  if (q(n) && typeof n.version == `number` && n.version > 1) return !0;
  let r = J(e[A]);
  return q(r) && t.sanitizeBlob(r) === `newer`;
}
function ht(e) {
  let t = J(e),
    n = q(t) && q(t.view) ? t.view : null;
  if (!n || typeof n.day != `string`) return null;
  let r = n.level;
  return typeof r == `number` && Number.isInteger(r) && r >= 1 && r <= 99999 ? r : null;
}
function gt(e) {
  let t = p(J(e[m]));
  return { name: t?.name ?? ``, level: ht(e[A]), robe: t?.robe ?? null };
}
function _t(e, t, n) {
  return e === null ? t : t === null || e === t ? e : n === e ? t : e;
}
function vt({ local: e, remote: t, base: n, choice: r, mergers: i }) {
  let o = (e, t) => (e ? ft(t, e[t], i) : null),
    [s, l] = [o(e, m), o(e, a)],
    u,
    d,
    f = !1;
  if (!t) [u, d] = [s, l];
  else {
    let [i, c] = [o(t, m), o(t, a)];
    if (n) ((u = _t(s, i, o(n, m))), (d = _t(l, c, o(n, a))));
    else if (s === null) [u, d] = [i, c ?? l];
    else if (i === null || i === s) [u, d] = [s, l ?? c];
    else if (r) r === `local` ? ([u, d] = [s, l]) : (([u, d] = [i, c]), (f = c === null && l !== null));
    else return { kind: `choose`, local: gt(e), cloud: gt(t) };
  }
  let p = st(e[Je], t?.[Je], n?.[Je]),
    h = (e) => {
      let t = {};
      for (let n of [c, A]) {
        let r = e?.[n];
        r !== void 0 && (t[n] = r);
      }
      return t;
    },
    g = t ? i.mergeRestore(h(e), h(t)) : h(e),
    _ = g[c],
    v = g[A],
    y = {},
    b = {},
    x = (e, t, n = t) => {
      (n !== null && (y[e] = n), t !== null && (b[e] = t));
    };
  return (
    x(m, u),
    x(a, d),
    x(Je, p),
    x(c, dt(_, e[c]), ut(_)),
    x(A, v ?? null),
    f && (b[a] = null),
    { kind: `merged`, local: b, cloud: y }
  );
}
function yt(e = typeof navigator > `u` ? `` : navigator.userAgent) {
  return (
    [
      /Android/i.test(e)
        ? `Android`
        : /iPhone|iPad|iPod/i.test(e)
          ? `iOS`
          : /Windows/i.test(e)
            ? `Windows`
            : /CrOS/.test(e)
              ? `ChromeOS`
              : /Mac OS X|Macintosh/i.test(e)
                ? `macOS`
                : /Linux|X11/i.test(e)
                  ? `Linux`
                  : ``,
      /SamsungBrowser/i.test(e)
        ? `Samsung Internet`
        : /Edg(?:e|A|iOS)?\//.test(e)
          ? `Edge`
          : /OPR\/|Opera/i.test(e)
            ? `Opera`
            : /Firefox|FxiOS/i.test(e)
              ? `Firefox`
              : /Chrome|CriOS/i.test(e)
                ? `Chrome`
                : /Safari/i.test(e)
                  ? `Safari`
                  : ``,
    ]
      .filter((e) => e !== ``)
      .join(` · `) || `Trình duyệt`
  );
}
var bt = `chuasen-account:base:`,
  xt = `chuasen-account:last:`,
  St = 3,
  Ct = 6e4,
  wt = `Chưa đồng bộ được lúc này. Thử lại sau nhé.`,
  Tt = `Bản lưu trên mạng tạo bởi phiên bản mới hơn. Hãy cập nhật ứng dụng rồi thử lại.`,
  Et = `Có máy khác đang lưu cùng lúc. Thử lại sau nhé.`,
  Dt = `Bản lưu quá lớn nên chưa đưa lên mạng được.`,
  Ot = `Không ghi được dữ liệu lên thiết bị (bộ nhớ đầy hoặc bị chặn).`,
  kt = null;
function At() {
  kt ??= Promise.all([
    t(
      () => import(`./progress-BuhROEX9.js`).then((e) => e.n),
      __vite__mapDeps([17, 1, 3, 5, 2, 4, 6, 18, 10, 13, 11, 12, 8, 9, 14, 15, 16, 19, 20, 7, 21, 22]),
      import.meta.url,
    ),
    t(
      () => import(`./progress-BuhROEX9.js`).then((e) => e.r),
      __vite__mapDeps([17, 1, 3, 5, 2, 4, 6, 18, 10, 13, 11, 12, 8, 9, 14, 15, 16, 19, 20, 7, 21, 22]),
      import.meta.url,
    ),
  ]).then(([e, t]) => ({ mergeRestore: e.mergeRestore, sanitizeBlob: t.sanitizeBlob }));
  let e = kt;
  return (
    e.catch(() => {
      kt === e && (kt = null);
    }),
    e
  );
}
function jt(e) {
  let t;
  try {
    t = window.localStorage;
  } catch {
    t = null;
  }
  return { auth: e, storage: t, now: () => Date.now(), device: () => yt(), loadMergers: At, format: 1 };
}
var Mt = (e) => typeof e == `object` && !!e && !Array.isArray(e),
  Nt = (e, t) => {
    let n = Object.keys(e);
    return n.length === Object.keys(t).length && n.every((n) => e[n] === t[n]);
  };
function Pt(e) {
  let { auth: t, storage: n } = e,
    r = null,
    i = !1;
  function a() {
    return Ze((e) => {
      try {
        return n?.getItem(e);
      } catch {
        return null;
      }
    });
  }
  function o(e) {
    try {
      let t = n?.getItem(bt + e);
      if (!t) return null;
      let r = JSON.parse(t);
      if (!Mt(r) || r.v !== 1 || !Mt(r.data)) return null;
      let { rev: i } = r;
      return typeof i != `number` || !Number.isInteger(i) || i < 1
        ? null
        : { v: 1, rev: i, data: Ze((e) => r.data[e]) };
    } catch {
      return null;
    }
  }
  function s(e, t) {
    try {
      n?.setItem(bt + e, JSON.stringify(t));
    } catch {}
  }
  function c(e, t) {
    try {
      n?.setItem(xt + e, String(t));
    } catch {}
  }
  function l(e) {
    try {
      (n?.removeItem(bt + e), n?.removeItem(xt + e));
    } catch {}
  }
  function u() {
    let e = t.state();
    if (e.status !== `signed-in`) return null;
    try {
      let t = Number(n?.getItem(xt + e.user.id));
      return Number.isFinite(t) && t > 0 ? t : null;
    } catch {
      return null;
    }
  }
  function d(e) {
    if (!n) throw new K(Ot, `storage`);
    let t = e.map(([e]) => [e, n.getItem(e)]);
    try {
      for (let [t, r] of e) r === null ? n.removeItem(t) : n.setItem(t, r);
    } catch {
      try {
        for (let [e, r] of t) r === null ? n.removeItem(e) : n.setItem(e, r);
      } catch {}
      throw new K(Ot, `storage`);
    }
  }
  let f = () => new K(wt, `server`);
  async function p(e) {
    let n = await t.authed(
      `/rest/v1/cloud_saves?user_id=eq.${encodeURIComponent(e)}&select=data,format,rev,updated_at`,
      { headers: { Accept: `application/json` } },
    );
    if (!n.ok) throw f();
    let r = await t.json(n),
      i = Array.isArray(r) ? r[0] : void 0;
    if (i === void 0) return null;
    if (!Mt(i) || !Mt(i.data)) throw f();
    let { rev: a, format: o } = i;
    if (typeof a != `number` || !Number.isInteger(a) || a < 1) throw f();
    return { rev: a, format: typeof o == `number` ? o : 1, data: i.data };
  }
  async function m(n, r, i, a) {
    let o = { format: e.format, device: e.device() },
      s = r ? { data: i, rev: r.rev + 1, ...o } : { user_id: n, data: i, rev: 1, ...o },
      c = JSON.stringify(s).length < Ct,
      l = r
        ? await t.authed(`/rest/v1/cloud_saves?user_id=eq.${encodeURIComponent(n)}&rev=eq.${r.rev}`, {
            method: `PATCH`,
            body: s,
            headers: { Prefer: `return=representation`, Accept: `application/json` },
            keepalive: a && c,
          })
        : await t.authed(`/rest/v1/cloud_saves`, {
            method: `POST`,
            body: s,
            headers: { Prefer: `return=minimal` },
            keepalive: a && c,
          });
    if (!r && l.status === 409) return null;
    if (!l.ok) throw f();
    if (!r) return 1;
    let u = await t.json(l);
    return !Array.isArray(u) || u.length === 0 ? null : r.rev + 1;
  }
  async function h(t, n, r, i) {
    let l = i ? { rev: i.rev, format: e.format, data: i.data } : await p(t);
    if (l && l.format > e.format) return { kind: `error`, message: Tt };
    let u = a(),
      f = l ? Ze((e) => l.data[e]) : null;
    if (f && mt(f, n)) return { kind: `error`, message: Tt };
    let h = o(t),
      g = vt({ local: u, remote: f, base: h?.data ?? null, choice: r.choice, mergers: n });
    if (g.kind === `choose`) return g;
    let _ = pt(u, n),
      v = [];
    for (let e of Ye) {
      let t = g.local[e];
      t !== void 0 &&
        (t === null
          ? u[e] !== void 0 && v.push([e, null])
          : ft(e, t, n) !== (_[e] ?? null) && v.push([e, t]));
    }
    d(v);
    let y = v.length > 0,
      b = pt(g.cloud, n),
      x = f ? pt(f, n) : {},
      S = !Nt(b, x);
    if (y && l) {
      let e = {};
      for (let t of Ye) {
        let n = b[t] === x[t] ? b[t] : h?.data[t];
        n !== void 0 && (e[t] = n);
      }
      i || s(t, { v: 1, rev: l.rev, data: e });
    }
    let C = l?.rev ?? null,
      w = !1;
    if (S && (l !== null || Object.keys(g.cloud).length > 0)) {
      if (JSON.stringify(g.cloud).length > 25e4) return { kind: `error`, message: Dt };
      if (((C = await m(t, l, g.cloud, r.fast === !0)), C === null)) return `retry`;
      w = !0;
    }
    C !== null && s(t, { v: 1, rev: C, data: w ? b : x });
    let T = e.now();
    return (c(t, T), { kind: `ok`, pulledChanges: y, pushed: w, at: T });
  }
  function g(e) {
    return e instanceof K
      ? e.code === `network`
        ? { kind: `offline` }
        : e.code === `signed-out`
          ? { kind: `signed-out` }
          : { kind: `error`, message: e.message }
      : { kind: `error`, message: wt };
  }
  async function _(n) {
    try {
      let r = await t.session();
      if (!r) return { kind: `signed-out` };
      let i = r.user.id,
        a;
      try {
        a = await e.loadMergers();
      } catch {
        return { kind: `offline` };
      }
      let s = n.fast ? o(i) : null;
      for (let e = 0; e < St; e++) {
        let e = await h(i, a, n, s);
        if (e !== `retry`) return e;
        s = null;
      }
      return { kind: `error`, message: Et };
    } catch (e) {
      return g(e);
    }
  }
  function v(e = {}) {
    if (r && e.choice === void 0 && !e.fast) return r;
    let t = r,
      n = (async () => {
        t && (await t.catch(() => void 0));
        let n = await _(e);
        return (
          n.kind === `choose`
            ? (i = !0)
            : (n.kind === `ok` || n.kind === `signed-out` || e.choice !== void 0) && (i = !1),
          n
        );
      })();
    r = n;
    let a = () => {
      r === n && (r = null);
    };
    return (n.then(a, a), n);
  }
  async function y() {
    let n = t.state();
    if (n.status !== `signed-in`) return !1;
    let r = await e.loadMergers();
    return !Nt(pt(a(), r), o(n.user.id)?.data ?? {});
  }
  async function b(e = !1) {
    if (i || r) return null;
    try {
      if (!(await y())) return null;
    } catch {
      return null;
    }
    return v(e ? { fast: !0 } : {});
  }
  return { sync: v, lastSyncedAt: u, forget: l, isDirty: y, pushIfDirty: b };
}
var Ft = e({ accessToken: () => Bt, adminBadgeFor: () => zt, getAccount: () => Rt });
function It(e = qe(), t = Pt(jt(e))) {
  return {
    api: {
      state: () => e.state(),
      onChange: (t) => e.onChange(t),
      sendEmailCode: (t) => e.sendEmailCode(t),
      verifyEmailCode: (t, n) => e.verifyEmailCode(t, n),
      googleAvailable: () => e.googleAvailable(),
      startGoogle: () => e.startGoogle(),
      finishGoogleIfReturning: () => e.finishGoogleIfReturning(),
      sync: (e) => t.sync(e?.choice === void 0 ? {} : { choice: e.choice }),
      lastSyncedAt: () => t.lastSyncedAt(),
      signOut: () => e.signOut(),
      deleteAccount: async () => {
        let n = e.state();
        (await e.deleteAccount(), n.status === `signed-in` && t.forget(n.user.id));
      },
    },
    auth: e,
    cloud: t,
  };
}
var Y = null,
  Lt = (e) => async () => (await e.auth.session())?.access_token ?? null;
function Rt() {
  return (Y || ((Y = It()), oe(Y.cloud), ve(Y.auth)), Y.api);
}
function zt(e) {
  return (Rt(), Y === null ? Promise.resolve(null) : _e(e, { getToken: Lt(Y) }));
}
async function Bt() {
  return (Rt(), (await Y?.auth.session())?.access_token ?? null);
}
var Vt = e({ bootAccount: () => Kt }),
  Ht = `Tài khoản này đã lưu một nhân vật khác.`,
  Ut = `Mở`,
  Wt = () =>
    t(
      async () => {
        let { resumeFriendInvite: e } = await import(`./friends-AJd_o965.js`).then((e) => e.r);
        return { resumeFriendInvite: e };
      },
      __vite__mapDeps([23, 1, 5, 2, 3, 4, 6, 24]),
      import.meta.url,
    ).then(({ resumeFriendInvite: e }) => e()),
  Gt = (e) =>
    t(
      async () => {
        let { openAccount: e } = await import(`./index-e_Bx6V48.js`).then((e) => e.b);
        return { openAccount: e };
      },
      __vite__mapDeps([2, 1, 3, 4, 5, 6]),
      import.meta.url,
    ).then(({ openAccount: t }) => t(e));
async function Kt(e = {}) {
  let t = Rt(),
    n = e.open ?? Gt,
    r = e.reload ?? (() => location.reload()),
    i = { prompt: e.prompt ?? h.prompt, notify: e.notify ?? h.notify },
    a = (e) => i.notify?.(e),
    o = () => ie(i, r),
    s = () => {
      _() && (e.openInvite ?? Wt)().catch(() => void 0);
    };
  if (!d()) s();
  else {
    let e;
    try {
      await t.finishGoogleIfReturning();
    } catch (t) {
      e = t instanceof Error && t.message !== `` ? t.message : void 0;
    }
    s();
    let i = `google-return`;
    if (e === void 0 && t.state().status === `signed-in`) {
      w(`account_login_ok`, { method: `google` });
      let e = await N(t, `return`, r);
      if (e === `reload`) return;
      if (e === `ready`) {
        let e = h.settled !== void 0;
        (h.settled?.(), e || a(j));
        return;
      }
      i = `choose`;
    }
    try {
      await n({
        reason: i,
        ...(e !== void 0 && { message: e }),
        onFail: (e) => {
          (a(e), h.settled?.());
        },
      });
      return;
    } catch {
      if (e !== void 0) {
        (a(e), h.settled?.());
        return;
      }
    }
  }
  if (t.state().status !== `signed-in`) return;
  let c = await t.sync();
  (M(c, `boot`),
    c.kind === `ok` && c.pulledChanges
      ? o()
      : c.kind === `choose` &&
        i.prompt?.(Ht, {
          label: Ut,
          run: () => void n({ reason: `choose`, onFail: a }).catch(() => void 0),
        }));
}
var X = {
    list: `/api/friends`,
    invite: `/api/friends/invite`,
    peek: `/api/friends/peek`,
    accept: `/api/friends/accept`,
    remove: `/api/friends/remove`,
    me: `/api/friends/me`,
    presence: `/api/friends/presence`,
    revoke: `/api/friends/revoke`,
  },
  qt = 864e5,
  Jt = 3e5,
  Yt = 6e4,
  Xt = 216e5,
  Zt = /^[A-Za-z0-9_-]{22}$/,
  Qt = `/ket-ban/`,
  $t = `chuasen-friend-invite`,
  en = /^[0-9a-f]{24}$/,
  tn = 9999,
  nn = (e, t, n) => (typeof e == `number` && Number.isInteger(e) && e >= t && e <= n ? e : void 0),
  rn = (e) => nn(e, 1, 999),
  an = (e) => nn(e, 0, tn);
function on(e) {
  return typeof e == `string` && Zt.test(e);
}
function sn(e, t) {
  return `${e.replace(/\/+$/, ``)}${Qt}#${t}`;
}
function cn(e) {
  if (typeof e != `string`) return null;
  let t = e.trim(),
    n = t.lastIndexOf(`#`),
    r = n >= 0 ? t.slice(n + 1) : t;
  return on(r) ? r : null;
}
var ln = (e) => typeof e == `number` && Number.isInteger(e) && e >= 1 && e <= 999,
  Z = (e) => (typeof e == `object` && e && !Array.isArray(e) ? e : null),
  un = new Set([
    `auth`,
    `invalid`,
    `used`,
    `expired`,
    `self`,
    `full`,
    `full-them`,
    `too-many`,
    `rate-limited`,
    `unavailable`,
  ]);
function dn(e) {
  let t = Z(e)?.error;
  return typeof t == `string` && un.has(t) ? t : `unavailable`;
}
var fn = (e) => rn(e) ?? null,
  pn = (e) => an(e) ?? null,
  mn = (e) => (typeof e == `string` ? e.slice(0, 64) : ``);
function hn(e) {
  let t = Z(e);
  if (t === null || typeof t.id != `string` || !en.test(t.id)) return null;
  let n = t.online === !0;
  return {
    id: t.id,
    name: mn(t.name),
    level: fn(t.level),
    streak: pn(t.streak),
    online: n,
    room: n && ln(t.room) ? t.room : null,
    isNew: t.isNew === !0,
  };
}
function gn(e) {
  let t = Z(e);
  if (t === null || t.ok !== !0 || !Array.isArray(t.friends)) return null;
  let n = [];
  for (let e of t.friends.slice(0, 100)) {
    let t = hn(e);
    t !== null && n.push(t);
  }
  let r = typeof t.max == `number` && Number.isInteger(t.max) && t.max > 0 ? t.max : 50;
  return { friends: n, shareRoom: t.shareRoom !== !1, max: r };
}
function _n(e) {
  let t = Z(e);
  if (t === null || t.ok !== !0 || !on(t.code)) return null;
  let n = typeof t.expiresAt == `number` && Number.isFinite(t.expiresAt) ? t.expiresAt : 0;
  return { code: t.code, expiresAt: n };
}
function vn(e) {
  let t = Z(e);
  if (t === null || t.ok !== !0) return null;
  let n = t.revoked;
  return { revoked: typeof n == `number` && Number.isInteger(n) && n >= 0 ? n : 0 };
}
function yn(e) {
  let t = Z(e);
  return t === null || t.ok !== !0
    ? null
    : { name: mn(t.name), level: fn(t.level), streak: pn(t.streak), already: t.already === !0 };
}
function bn(e) {
  let t = Z(e);
  if (t === null || t.ok !== !0) return null;
  let n = hn(t.friend);
  return n === null ? null : { friend: n, already: t.already === !0 };
}
var xn = 8e3,
  Sn = null;
function Cn() {
  return Sn;
}
async function Q(e, t, n, r = {}, i = {}) {
  let a = i.token;
  if (a === void 0)
    try {
      a = await (r.getToken ?? Bt)();
    } catch {
      a = null;
    }
  if (a === null || a === ``) return { ok: !1, error: `auth` };
  Sn = a;
  let o = { authorization: `Bearer ${a}` };
  t !== void 0 && (o[`content-type`] = `application/json`);
  let s = new AbortController(),
    c = setTimeout(() => s.abort(), xn);
  try {
    let a = await (r.fetchImpl ?? fetch)(e, {
        method: t === void 0 ? `GET` : `POST`,
        headers: D(e, o),
        ...(t === void 0 ? {} : { body: JSON.stringify(t) }),
        cache: `no-store`,
        credentials: `omit`,
        ...(i.keepalive ? { keepalive: !0 } : {}),
        signal: s.signal,
      }),
      c = null;
    try {
      c = await a.json();
    } catch {
      c = null;
    }
    if (!a.ok) return { ok: !1, error: a.status === 401 ? `auth` : dn(c) };
    let l = n(c);
    return l === null ? { ok: !1, error: `unavailable` } : { ok: !0, value: l };
  } catch {
    return { ok: !1, error: `offline` };
  } finally {
    clearTimeout(c);
  }
}
var wn = (e) => (typeof e == `object` && e && e.ok === !0 ? !0 : null);
function Tn(e) {
  return Q(X.list, void 0, gn, e);
}
function En(e, t) {
  return Q(X.invite, { card: e }, _n, t);
}
function Dn(e, t) {
  return Q(X.peek, { code: e }, yn, t);
}
function On(e, t, n) {
  return Q(X.accept, { code: e, card: t }, bn, n);
}
function kn(e) {
  return Q(
    X.revoke,
    {},
    (e) => {
      let t = vn(e);
      return t === null ? null : t.revoked;
    },
    e,
  );
}
function An(e, t) {
  return Q(X.remove, { id: e }, (e) => (wn(e) === null ? null : e.removed !== !1), t);
}
function jn(e, t) {
  return Q(X.me, { shareRoom: e }, (e) => (wn(e) === null ? null : e.shareRoom !== !1), t);
}
function Mn(e, t, n) {
  return Q(X.presence, e, (e) => (wn(e) === null ? null : e.beat === !0), t, n);
}
var Nn = qt;
function Pn(e) {
  if (e !== void 0) return e;
  try {
    return localStorage;
  } catch {
    return null;
  }
}
function Fn(e, t = Date.now()) {
  let n = Pn(e),
    r;
  try {
    r = n?.getItem(`chuasen-friend-invite`) ?? null;
  } catch {
    return null;
  }
  if (r === null) return null;
  try {
    let e = JSON.parse(r),
      n = typeof e?.at == `number` ? e.at : NaN,
      i = e?.c;
    if (
      typeof i == `string` &&
      /^[A-Za-z0-9_-]{22}$/.test(i) &&
      Number.isFinite(n) &&
      t - n < Nn &&
      n - t < 864e5
    )
      return i;
  } catch {}
  return (In(n), null);
}
function In(e) {
  try {
    Pn(e)?.removeItem($t);
  } catch {}
}
var Ln = e({ notePresence: () => Un }),
  Rn = 36e5,
  zn = `chuasen-friends-quiet`;
function Bn(e = {}) {
  let t = e.now ?? Date.now,
    n = (() => {
      if (e.storage !== void 0) return e.storage;
      try {
        return localStorage;
      } catch {
        return null;
      }
    })(),
    r = e.setTimer ?? ((e, t) => setTimeout(e, t)),
    i = e.clearTimer ?? ((e) => clearTimeout(e)),
    a = null,
    o = !1,
    s = null,
    c,
    l = 0,
    u = null,
    d = !1,
    f = !1,
    p = !1,
    m = () => {
      try {
        return Number(n?.getItem(`chuasen-friends-quiet`) ?? 0) || 0;
      } catch {
        return 0;
      }
    },
    h = (e) => {
      try {
        e === null ? n?.removeItem(zn) : n?.setItem(zn, String(e));
      } catch {}
    };
  function g() {
    (u !== null && i(u), (u = null));
  }
  function _() {
    (g(),
      (u = r(() => {
        ((u = null), o && v(!0));
      }, Jt)));
  }
  async function v(n) {
    if (d || s === null) return;
    let r = o ? a : null;
    if (!(!n && c === r && t() - l < 3e5)) {
      d = !0;
      try {
        let n = await Mn({ room: r, card: s() }, e);
        if (((c = r), (l = t()), !n.ok)) {
          if (n.error === `auth`) {
            ((f = !0), g());
            return;
          }
          if (n.error === `unavailable`) {
            (h(t() + Rn), g());
            return;
          }
          o && _();
          return;
        }
        if (!n.value) {
          (h(t() + Xt), g());
          return;
        }
        (h(null), o ? _() : g());
      } finally {
        ((d = !1), !f && (o ? a : null) !== c && m() <= t() && v(!1));
      }
    }
  }
  function y() {
    p ||
      ((p = !0),
      (e.target === void 0 ? (typeof window > `u` ? null : window) : e.target)?.addEventListener(
        `pagehide`,
        () => {
          g();
          let t = Cn();
          c !== void 0 &&
            t !== null &&
            ((c = void 0), (o = !1), Mn({ off: !0 }, e, { keepalive: !0, token: t }));
        },
      ));
  }
  return {
    note(e, n) {
      ((s = n), (o = e !== null), (a = e), (f = !1), y(), m() > t() ? g() : (o || g(), v(!1)));
    },
    active() {
      (h(null), s !== null && o && v(!0));
    },
    known() {
      m() <= t() || (h(null), s !== null && o && v(!0));
    },
    lastCard() {
      return s?.() ?? null;
    },
  };
}
var Vn = null;
function Hn() {
  return ((Vn ??= Bn()), Vn);
}
function Un(e, t) {
  Hn().note(e, t);
}
function Wn() {
  Hn().active();
}
function Gn() {
  Hn().known();
}
function Kn() {
  return Vn?.lastCard() ?? null;
}
var qn = e({ accountSavedText: () => Or, openAccountDialog: () => Mr }),
  Jn = `Lưu nhân vật`,
  Yn = `Đăng nhập để giữ nhân vật, trang phục, cấp, nhiệm vụ và chuỗi giữ lửa khi đổi máy. Không bắt buộc.`,
  Xn = `Đăng nhập để giữ nhân vật, cấp, nhiệm vụ và chuỗi giữ lửa trên mọi máy, hoặc lấy lại nhân vật đã lưu ở máy khác. Không bắt buộc.`,
  Zn = `Chùa gửi mã 6 số tới email của bạn, không cần mật khẩu.`,
  Qn = `Khi đăng nhập, bạn đồng ý với <a href="/dieu-khoan-su-dung/" target="_blank" rel="noopener">Điều khoản</a> và <a href="/chinh-sach-quyen-rieng-tu/" target="_blank" rel="noopener">Chính sách quyền riêng tư</a>.`,
  $n = `Google không cho đăng nhập trong trình duyệt này. Bạn dùng mã gửi qua email, hoặc mở chuasen.com bằng Chrome hay Safari nhé.`,
  er = `Email chưa đúng dạng. Bạn kiểm tra lại nhé.`,
  tr = `Bạn nhập đủ 6 số nhé.`,
  nr = `Không thấy thư? Bạn xem cả mục thư rác nhé. Mã dùng được trong 10 phút.`,
  rr = `Phiên đăng nhập đã hết. Bạn đăng nhập lại nhé.`,
  ir = `Không kết nối được. Kiểm tra mạng rồi thử lại.`,
  ar = `Đã có lỗi xảy ra. Bạn thử lại nhé.`,
  or = `Chưa mở được phần lưu nhân vật. Bạn kiểm tra mạng rồi thử lại nhé.`,
  sr = `Đã đăng xuất. Nhân vật vẫn còn trên máy này.`,
  cr = `Đã xoá bản lưu trên mạng. Nhân vật trên máy này vẫn còn.`,
  lr = j,
  ur = `Đã đồng bộ.`,
  dr = `Xoá tài khoản?`,
  fr = `Xoá bản lưu trên mạng. Nhân vật trên máy này vẫn còn.`,
  pr = `Đã nhận tiến trình từ máy khác.`,
  mr = `Tải lại để thấy tiến trình mới`,
  hr = `Máy này và tài khoản có hai nhân vật khác nhau`,
  gr = `Bạn muốn giữ nhân vật nào? Công phu tu tập từ cả hai bên đều được giữ lại.`,
  _r = `Nhân vật trên máy này`,
  vr = `Nhân vật đã lưu`,
  yr = `Bấm "Vào chùa" để tải lại trang và thấy nhân vật, trang phục, Hành trình đã lưu.`,
  br = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  xr = { lam: `lam`, nau: `nâu`, xam: `xám`, vang: `vàng` },
  Sr = (e) => String(e).padStart(2, `0`);
function Cr(e, t = Date.now()) {
  if (typeof e != `number` || !Number.isFinite(e) || e <= 0) return `Chưa lưu lên mạng lần nào`;
  let n = new Date(e),
    r = new Date(t),
    i = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(),
    a = Math.round((i(r) - i(n)) / 864e5),
    o = `${Sr(n.getHours())}:${Sr(n.getMinutes())}`;
  return a <= 0
    ? `Đã lưu lúc ${o}`
    : a === 1
      ? `Đã lưu hôm qua lúc ${o}`
      : `Đã lưu ngày ${Sr(n.getDate())}/${Sr(n.getMonth() + 1)} lúc ${o}`;
}
function wr(e) {
  return e.method === `google`
    ? `Đăng nhập bằng Google`
    : e.method === `email`
      ? `Đăng nhập bằng mã gửi qua email`
      : ``;
}
function Tr(e) {
  let t = e.robe ? xr[e.robe] : void 0;
  return [t === void 0 ? `` : `Áo ${t}`, e.level === null ? `` : `Cấp ${e.level}`]
    .filter((e) => e !== ``)
    .join(` · `);
}
var $ = (e) => (e instanceof Error && e.message.trim() !== `` ? e.message : ar);
function Er(e) {
  try {
    return typeof matchMedia == `function` && matchMedia(e).matches;
  } catch {
    return !1;
  }
}
function Dr() {
  return t(
    () =>
      Promise.resolve()
        .then(() => Ft)
        .then((e) => e.getAccount()),
    void 0,
    import.meta.url,
  );
}
async function Or(e) {
  let t = e ?? (await Dr());
  return t.state().status === `signed-in` ? Cr(t.lastSyncedAt()) : ``;
}
var kr = null,
  Ar = `button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), a[href], [tabindex="0"]`,
  jr = `
  <div class="account-dlg__card" data-ref="card" aria-busy="false">
    <header class="account-dlg__head">
      <h2 id="account-title" class="account-dlg__title" tabindex="-1" data-ref="title"></h2>
      <button type="button" class="account-dlg__close" data-ref="close" aria-label="Đóng">${v(`close`)}</button>
    </header>
    <div class="account-dlg__body" data-ref="body"></div>
    <footer class="account-dlg__foot">
      <p class="account-dlg__info" role="status" aria-live="polite" data-ref="info"></p>
      <p class="account-dlg__error" role="alert" data-ref="error"></p>
    </footer>
  </div>`;
function Mr(e = {}) {
  kr?.isConnected && n(kr);
  let t =
      e.opener === void 0
        ? document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
        : e.opener,
    a = e.reload ?? (() => location.reload()),
    o = e.reason ?? `settings`,
    c = document.createElement(`dialog`);
  ((c.className = `account-dlg`), c.setAttribute(`aria-labelledby`, `account-title`), (c.innerHTML = jr));
  let u = (e, t = c) => t.querySelector(`[data-ref="${e}"]`),
    d = u(`card`),
    f = u(`title`),
    p = u(`body`),
    m = u(`info`),
    g = u(`error`);
  f.textContent = Jn;
  let _,
    y,
    b = !1,
    S = !1,
    T = `loading`,
    E = ``,
    te = !1,
    D = !1,
    O = `login`,
    ne,
    k = 0,
    A,
    j = null,
    M = () => {
      if (!_) throw Error(`Lõi tài khoản chưa sẵn sàng`);
      return _;
    },
    N = () => {
      b || n(c);
    },
    P = (e, t = ``) => {
      ((m.textContent = e === `info` ? t : ``), (g.textContent = e === `error` ? t : ``));
    },
    re = (e) => {
      e?.error ? P(`error`, e.error) : e?.info && P(`info`, e.info);
    },
    F = (e, t) => {
      ((S = !0), d.setAttribute(`aria-busy`, `true`));
      let n = Array.from(p.querySelectorAll(`button`));
      for (let e of n) e.setAttribute(`aria-disabled`, `true`);
      let r = e?.textContent ?? null;
      return (
        e && t && (e.textContent = t),
        () => {
          ((S = !1), d.setAttribute(`aria-busy`, `false`));
          for (let e of n) e.removeAttribute(`aria-disabled`);
          (e && r !== null && e.isConnected && (e.textContent = r), ie());
        }
      );
    };
  function ie() {
    j?.isConnected &&
      ((j.textContent = k > 0 ? `Gửi lại mã sau ${k} giây` : `Gửi lại mã`),
      k > 0 || S ? j.setAttribute(`aria-disabled`, `true`) : j.removeAttribute(`aria-disabled`));
  }
  function ae() {
    (A !== void 0 && clearInterval(A), (A = void 0), (j = null));
  }
  function oe(e) {
    (ae(),
      (j = e),
      (k = 60),
      ie(),
      (A = setInterval(() => {
        ((k = Math.max(0, k - 1)), ie(), k === 0 && A !== void 0 && (clearInterval(A), (A = void 0)));
      }, 1e3)));
  }
  function I(e) {
    let t = document.createElement(`div`);
    return ((t.className = `account-dlg__view`), (t.innerHTML = e), t);
  }
  function L(e, t, n, r) {
    b ||
      (e !== `code` && ae(),
      (T = e),
      P(`none`),
      p.replaceChildren(t),
      (p.scrollTop = 0),
      re(r),
      (n ?? f).focus({ preventScroll: !0 }));
  }
  function se() {
    L(`loading`, I(`<p class="account-dlg__lead" role="status">Đang mở…</p>`));
  }
  function ce() {
    let e = I(`<p class="account-dlg__lead" role="alert" data-ref="msg"></p>
       <div class="account-dlg__actions"><button type="button" class="btn" data-ref="done">Đóng</button></div>`);
    ((u(`msg`, e).textContent = or), u(`done`, e).addEventListener(`click`, N), L(`error`, e));
  }
  function R(e) {
    let t = M().googleAvailable(),
      n = x.googleClientId,
      r = !t && n !== ``,
      i = I(`
      <p class="account-dlg__intro" data-ref="intro"></p>
      ${
        t
          ? `${C(`google`)}
             <div class="account-dlg__or" aria-hidden="true"><span>hoặc</span></div>`
          : ``
      }
      ${r ? `<p class="account-dlg__box" data-ref="webview"></p>` : ``}
      <form class="account-dlg__form" novalidate data-ref="form">
        <label class="account-dlg__label" for="account-email">Email</label>
        <input id="account-email" class="account-dlg__input" data-ref="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="ban@example.com" aria-describedby="account-email-hint" />
        <p id="account-email-hint" class="account-dlg__hint" data-ref="hint"></p>
        <button type="submit" class="btn btn--gold btn--block" data-ref="send">Gửi mã</button>
      </form>
      <p class="account-dlg__hint account-dlg__terms">${Qn}</p>`);
    ((u(`intro`, i).textContent = o === `onboarding` ? Xn : Yn),
      (u(`hint`, i).textContent = Zn),
      r && (u(`webview`, i).textContent = $n));
    let a = u(`email`, i),
      s = u(`send`, i);
    (a.addEventListener(`input`, () => a.removeAttribute(`aria-invalid`)),
      u(`form`, i).addEventListener(`submit`, (e) => {
        (e.preventDefault(), le(a, s));
      }));
    let c = i.querySelector(`[data-ref="google"]`);
    (c?.addEventListener(`click`, () => z(c)), L(`signed-out`, i, Er(`(pointer: coarse)`) ? null : a, e));
  }
  function z(e) {
    if (S) return;
    w(`account_login_started`, { method: `google`, source: o });
    let t = F(ee(e), `Đang chuyển sang Google…`);
    try {
      M().startGoogle();
    } catch (e) {
      (t(), w(`account_login_failed`, { method: `google`, reason: `start` }), P(`error`, $(e)));
    }
  }
  async function le(e, t) {
    if (S) return;
    let n = e.value.trim();
    if (!br.test(n)) {
      (e.setAttribute(`aria-invalid`, `true`), P(`error`, er), e.focus({ preventScroll: !0 }));
      return;
    }
    (P(`none`), w(`account_login_started`, { method: `email`, source: o }));
    let r = F(t, `Đang gửi…`);
    try {
      await M().sendEmailCode(n);
    } catch (t) {
      if ((r(), b)) return;
      (w(`account_login_failed`, { method: `email`, reason: `send` }),
        P(`error`, $(t)),
        e.focus({ preventScroll: !0 }));
      return;
    }
    (r(), b || ((E = n), ue()));
  }
  function ue(e) {
    let t = I(`
      <form class="account-dlg__form" novalidate data-ref="form">
        <h3 class="account-dlg__heading">Nhập mã 6 số</h3>
        <p class="account-dlg__lead" data-ref="sentTo"></p>
        <label class="account-dlg__label" for="account-code">Mã 6 số</label>
        <input id="account-code" class="account-dlg__input account-dlg__code" data-ref="code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" enterkeyhint="done" autocapitalize="off" spellcheck="false" aria-describedby="account-code-hint" />
        <p id="account-code-hint" class="account-dlg__hint" data-ref="hint"></p>
        <button type="submit" class="btn btn--gold btn--block" data-ref="verify">Xác nhận</button>
        <div class="account-dlg__row">
          <button type="button" class="btn btn--ghost btn--sm" data-ref="resend"></button>
          <button type="button" class="btn btn--ghost btn--sm" data-ref="change">Đổi email</button>
        </div>
      </form>`);
    ((u(`sentTo`, t).textContent = `Mã 6 số đã gửi tới ${s(E)}.`), (u(`hint`, t).textContent = nr));
    let n = u(`code`, t),
      r = u(`verify`, t),
      i = u(`resend`, t);
    (n.addEventListener(`input`, () => {
      let e = n.value.replace(/\D/g, ``).slice(0, 6);
      (e !== n.value && (n.value = e), n.removeAttribute(`aria-invalid`), e.length === 6 && de(n, r));
    }),
      u(`form`, t).addEventListener(`submit`, (e) => {
        (e.preventDefault(), de(n, r));
      }),
      i.addEventListener(`click`, () => void fe(i, n)),
      u(`change`, t).addEventListener(`click`, () => {
        S || ((E = ``), R());
      }),
      L(`code`, t, n, e),
      oe(i));
  }
  async function de(e, t) {
    if (S) return;
    let n = e.value.replace(/\D/g, ``);
    if (n.length !== 6) {
      (e.setAttribute(`aria-invalid`, `true`), P(`error`, tr), e.focus({ preventScroll: !0 }));
      return;
    }
    P(`none`);
    let r = F(t, `Đang kiểm tra…`);
    try {
      await M().verifyEmailCode(E, n);
    } catch (t) {
      if ((r(), b)) return;
      (w(`account_login_failed`, { method: `email`, reason: `verify` }),
        (e.value = ``),
        e.setAttribute(`aria-invalid`, `true`),
        P(`error`, $(t)),
        e.focus({ preventScroll: !0 }));
      return;
    }
    (r(), w(`account_login_ok`, { method: `email` }), (D = !0), (E = ``), await B(`login`));
  }
  async function fe(e, t) {
    if (S || k > 0) return;
    P(`none`);
    let n = F(e, `Đang gửi…`);
    try {
      await M().sendEmailCode(E);
    } catch (e) {
      if ((n(), b)) return;
      P(`error`, $(e));
      return;
    }
    (n(), b || (P(`info`, `Đã gửi lại mã. Bạn xem hộp thư nhé.`), t.focus({ preventScroll: !0 }), oe(e)));
  }
  function pe() {
    let e = I(
      `<div class="account-dlg__wait" role="status">${v(`lotus`, { size: 40 })}<p class="account-dlg__lead" data-ref="msg"></p></div>`,
    );
    ((u(`msg`, e).textContent = `Đang đồng bộ nhân vật của bạn…`), L(`syncing`, e));
  }
  async function B(e, t) {
    if (S) return;
    ((O = e), (ne = t));
    let n = l(),
      r = e === `manual` ? p.querySelector(`[data-ref="sync"]`) : null,
      i;
    r ? (P(`none`), (i = F(r, `Đang đồng bộ…`))) : (pe(), (i = F()));
    let s;
    try {
      s = await M().sync(t ? { choice: t } : void 0);
    } catch (e) {
      s = { kind: `error`, message: $(e) };
    }
    if (
      (i(),
      w(`account_sync`, {
        result: s.kind,
        source: `dialog`,
        ...(s.kind === `ok` && { pulled: s.pulledChanges, pushed: s.pushed }),
      }),
      b)
    )
      s.kind === `ok` && s.pulledChanges && a();
    else
      switch (s.kind) {
        case `choose`:
          me(s.local, s.cloud);
          break;
        case `ok`: {
          let t = l(),
            r = t !== null && (n === null || n.name !== t.name || n.gender !== t.gender || n.robe !== t.robe);
          e === `login` && (D || o === `google-return` || o === `choose`)
            ? ((D = !1), s.pulledChanges ? a() : (o !== `onboarding` && h.notify?.(lr), N()))
            : s.pulledChanges && e === `login`
              ? ((te = !0), he(r ? t.name : null))
              : (U({ pulled: s.pulledChanges, info: D ? lr : ur, at: s.at }), (D = !1));
          break;
        }
        case `offline`:
          V(ir);
          break;
        case `error`:
          V(s.message);
          break;
        case `signed-out`:
          R({ error: rr });
      }
  }
  function V(e) {
    let t = I(`
      <h3 class="account-dlg__heading" tabindex="-1" data-ref="heading">Chưa đồng bộ được</h3>
      <p class="account-dlg__lead" role="alert" data-ref="msg"></p>
      <div class="account-dlg__actions">
        <button type="button" class="btn btn--gold" data-ref="retry">Thử lại</button>
        <button type="button" class="btn btn--ghost" data-ref="later">Để sau</button>
      </div>`);
    ((u(`msg`, t).textContent = e),
      u(`retry`, t).addEventListener(`click`, () => void B(O, ne)),
      u(`later`, t).addEventListener(`click`, () => U()),
      L(`problem`, t, u(`heading`, t)));
  }
  function H(e, t, n) {
    let r = document.createElement(`div`);
    return (
      (r.className = `account-dlg__char`),
      (r.dataset.choice = e),
      (r.innerHTML = `
      <h4 class="account-dlg__char-label" id="account-char-${e}" data-ref="label"></h4>
      <p class="account-dlg__char-name"><span class="account-dlg__dot" aria-hidden="true" data-ref="dot"></span><span data-ref="name"></span></p>
      <p class="account-dlg__char-meta" data-ref="meta"></p>
      <button type="button" class="btn btn--block" id="account-pick-${e}" aria-labelledby="account-pick-${e} account-char-${e}" data-ref="pick">Giữ nhân vật này</button>`),
      (u(`label`, r).textContent = t),
      (u(`name`, r).textContent = n.name),
      n.robe && (u(`dot`, r).dataset.robe = n.robe),
      (u(`meta`, r).textContent = Tr(n)),
      u(`pick`, r).addEventListener(`click`, () => {
        S || (w(`account_choose`, { choice: e }), B(O, e));
      }),
      r
    );
  }
  function me(e, t) {
    let n = I(`
      <h3 class="account-dlg__heading" tabindex="-1" data-ref="heading"></h3>
      <p class="account-dlg__lead" data-ref="lead"></p>
      <div class="account-dlg__chars" data-ref="cards"></div>`);
    ((u(`heading`, n).textContent = hr),
      (u(`lead`, n).textContent = gr),
      u(`cards`, n).append(H(`local`, _r, e), H(`cloud`, vr, t)),
      L(`choose`, n, u(`heading`, n)));
  }
  function he(e) {
    let t = I(`
      <div class="account-dlg__done" role="status">
        ${v(`lotus`, { size: 44 })}
        <h3 class="account-dlg__heading" tabindex="-1" data-ref="heading"></h3>
        <p class="account-dlg__lead" data-ref="lead"></p>
        <button type="button" class="btn btn--gold" data-ref="enter">Vào chùa</button>
      </div>`);
    ((u(`heading`, t).textContent =
      e === null ? `Đã lấy lại tiến trình của bạn` : `Đã lấy lại nhân vật ${e}`),
      (u(`lead`, t).textContent = yr),
      u(`enter`, t).addEventListener(`click`, () => a()),
      L(`welcome`, t, u(`heading`, t)));
  }
  function U(e = {}) {
    let t = M().state();
    if (t.status !== `signed-in`) {
      R();
      return;
    }
    let { user: n } = t,
      r = I(`
      <div class="account-dlg__who">
        <span class="account-dlg__badge" aria-hidden="true">${v(`lotus`, { size: 22 })}</span>
        <div class="account-dlg__who-text">
          <h3 class="account-dlg__heading" tabindex="-1" data-ref="heading">Đã đăng nhập</h3>
          <p class="account-dlg__email" data-ref="email"></p>
          <p class="account-dlg__hint" data-ref="method"></p>
        </div>
      </div>
      <p class="account-dlg__saved" data-ref="saved"></p>
      ${
        e.pulled
          ? `<div class="account-dlg__pulled">
               <p data-ref="pulledText"></p>
               <button type="button" class="btn btn--gold btn--block" data-ref="reload"></button>
             </div>`
          : ``
      }
      <div class="account-dlg__actions">
        <button type="button" class="btn" data-ref="sync">Đồng bộ ngay</button>
        <button type="button" class="btn btn--ghost" data-ref="signout">Đăng xuất</button>
      </div>
      <button type="button" class="account-dlg__quiet" data-ref="delete">Xoá tài khoản</button>`);
    if (
      ((u(`email`, r).textContent = s(n.email)),
      (u(`method`, r).textContent = wr(n)),
      (u(`saved`, r).textContent = Cr(M().lastSyncedAt() ?? e.at)),
      e.pulled)
    ) {
      u(`pulledText`, r).textContent = pr;
      let e = u(`reload`, r);
      ((e.textContent = mr), e.addEventListener(`click`, () => a()));
    }
    (u(`sync`, r).addEventListener(`click`, () => void B(`manual`)),
      u(`signout`, r).addEventListener(`click`, () => void ge(u(`signout`, r))),
      u(`delete`, r).addEventListener(`click`, () => {
        S || _e();
      }),
      L(`signed-in`, r, u(`heading`, r), { info: e.info }));
  }
  async function ge(e) {
    if (S) return;
    P(`none`);
    let t = F(e, `Đang đăng xuất…`);
    try {
      await M().signOut();
    } catch (e) {
      (t(), b || P(`error`, $(e)));
      return;
    }
    (t(), w(`account_signed_out`), b || R({ info: sr }));
  }
  function _e() {
    let e = I(`
      <h3 class="account-dlg__heading" tabindex="-1" data-ref="heading"></h3>
      <p class="account-dlg__lead" data-ref="text"></p>
      <div class="account-dlg__actions">
        <button type="button" class="btn btn--ghost" data-ref="keep">Giữ lại</button>
        <button type="button" class="btn account-dlg__danger" data-ref="confirm">Xoá tài khoản</button>
      </div>`);
    ((u(`heading`, e).textContent = dr),
      (u(`text`, e).textContent = fr),
      u(`keep`, e).addEventListener(`click`, () => {
        S || U();
      }),
      u(`confirm`, e).addEventListener(`click`, () => void ve(u(`confirm`, e))),
      L(`confirm-delete`, e, u(`keep`, e)));
  }
  async function ve(e) {
    if (S) return;
    P(`none`);
    let t = F(e, `Đang xoá…`);
    try {
      await M().deleteAccount();
    } catch (e) {
      (t(), b || P(`error`, $(e)));
      return;
    }
    (t(), w(`account_deleted`), b || R({ info: cr }));
  }
  function ye() {
    let t = M().state();
    o === `google-return`
      ? t.status === `signed-in`
        ? (w(`account_login_ok`, { method: `google` }), (D = !0), B(`login`))
        : (w(`account_login_failed`, { method: `google`, reason: `return` }),
          R({ error: e.message?.trim() || `Đăng nhập Google không thành công, thử lại nhé.` }))
      : t.status === `signed-in`
        ? o === `choose` || M().lastSyncedAt() === null
          ? B(`login`)
          : U()
        : R();
  }
  function be(e) {
    b ||
      S ||
      (e.status === `signed-out` && (T === `signed-in` || T === `confirm-delete` || T === `problem`)
        ? R()
        : e.status === `signed-in` && T === `signed-out` && U());
  }
  (u(`close`, c).addEventListener(`click`, N),
    c.addEventListener(`keydown`, (e) => {
      if (e.key === `Escape` && !e.isComposing) (e.preventDefault(), N());
      else if (e.key === `Tab`) {
        let t = Array.from(c.querySelectorAll(Ar)).filter(
            (e) => !e.closest(`[hidden]`) && !e.matches(`:disabled`),
          ),
          n = t[0],
          r = t[t.length - 1];
        if (!n || !r) return;
        let i = document.activeElement,
          a = !c.contains(i);
        e.shiftKey && (i === n || i === f || a)
          ? (e.preventDefault(), r.focus())
          : !e.shiftKey && (i === r || a) && (e.preventDefault(), n.focus());
      }
    }));
  let W = window.visualViewport,
    G = () => {
      let e = W ? window.innerHeight - W.height > 120 : !1;
      ((c.style.top = W && e ? `${W.offsetTop + 8}px` : ``),
        (c.style.bottom = e ? `auto` : ``),
        (c.style.maxHeight = W && e ? `${W.height - 16}px` : ``));
    };
  return (
    W?.addEventListener(`resize`, G),
    W?.addEventListener(`scroll`, G),
    c.addEventListener(`close`, () => {
      ((b = !0),
        ae(),
        y?.(),
        W?.removeEventListener(`resize`, G),
        W?.removeEventListener(`scroll`, G),
        c.remove(),
        kr === c && (kr = null),
        te ? a() : (h.settled?.(), t?.isConnected && t.focus({ preventScroll: !0 })));
    }),
    i(c),
    (kr = c),
    document.body.append(c),
    r(c),
    se(),
    (e.api ? Promise.resolve(e.api) : (e.loadApi ?? Dr)()).then(
      (e) => {
        b || ((_ = e), (y = e.onChange(be)), ye());
      },
      (e) => {
        (console.error(`Không nạp được lõi tài khoản`, e), b || ce());
      },
    ),
    { element: c, close: N }
  );
}
var Nr = e({ INLINE_RESENT: () => Pr, mountInlineEmail: () => Ir }),
  Pr = `Đã gửi lại mã. Bạn xem hộp thư nhé.`,
  Fr = (e) => (e instanceof Error && e.message.trim() !== `` ? e.message : ar);
function Ir(e) {
  let { root: t, source: n } = e,
    r = e.api ?? Rt(),
    i = e.reload ?? (() => location.reload()),
    a = e.openDialog ?? T,
    o = ``,
    c = !1,
    l = 0,
    u,
    d = (e, t) => e.querySelector(`[data-ref="${t}"]`);
  function f(e) {
    m();
    let n = document.createElement(`form`);
    return ((n.className = `onb__mail`), (n.noValidate = !0), (n.innerHTML = e), t.replaceChildren(n), n);
  }
  function p(e, t) {
    c = !0;
    let n = e.textContent;
    return (
      (e.textContent = t),
      e.setAttribute(`aria-disabled`, `true`),
      () => {
        ((c = !1), (e.textContent = n), e.removeAttribute(`aria-disabled`));
      }
    );
  }
  function m() {
    (u !== void 0 && clearInterval(u), (u = void 0));
  }
  function h() {
    let e = f(`
      <label class="onb__label" for="onb-mail">Email</label>
      <input id="onb-mail" class="onb__input" data-ref="field" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="ban@example.com" aria-describedby="onb-mail-hint onb-mail-err" />
      <p class="onb__hint" id="onb-mail-hint" data-ref="hint"></p>
      <p class="onb__error" id="onb-mail-err" role="alert" data-ref="err"></p>
      <button type="submit" class="btn btn--gold btn--block" data-ref="send">Gửi mã</button>`);
    d(e, `hint`).textContent = Zn;
    let t = d(e, `field`),
      n = d(e, `err`);
    (t.addEventListener(`input`, () => t.removeAttribute(`aria-invalid`)),
      e.addEventListener(`submit`, (r) => {
        (r.preventDefault(), g(t, n, d(e, `send`)));
      }),
      t.focus({ preventScroll: !0 }));
  }
  async function g(e, t, i) {
    if (c) return;
    let a = e.value.trim();
    if (!br.test(a)) {
      (e.setAttribute(`aria-invalid`, `true`), (t.textContent = er), e.focus({ preventScroll: !0 }));
      return;
    }
    ((t.textContent = ``), w(`account_login_started`, { method: `email`, source: n }));
    let s = p(i, `Đang gửi…`);
    try {
      await r.sendEmailCode(a);
    } catch (n) {
      (s(),
        w(`account_login_failed`, { method: `email`, reason: `send` }),
        (t.textContent = Fr(n)),
        e.focus({ preventScroll: !0 }));
      return;
    }
    (s(), (o = a), _());
  }
  function _() {
    let e = f(`
      <h2 class="onb__mail-title" tabindex="-1" data-ref="title">Nhập mã 6 số</h2>
      <p class="onb__hint" data-ref="sentTo"></p>
      <label class="sr-only" for="onb-code">Mã 6 số</label>
      <input id="onb-code" class="onb__input onb__code" data-ref="field" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" enterkeyhint="done" autocapitalize="off" spellcheck="false" aria-describedby="onb-code-hint onb-code-err" />
      <p class="onb__hint" id="onb-code-hint" data-ref="hint"></p>
      <p class="onb__hint" role="status" data-ref="info"></p>
      <p class="onb__error" id="onb-code-err" role="alert" data-ref="err"></p>
      <button type="submit" class="btn btn--gold btn--block" data-ref="verify">Xác nhận</button>
      <div class="onb__mail-row">
        <button type="button" class="btn btn--ghost btn--sm" data-ref="resend"></button>
        <button type="button" class="btn btn--ghost btn--sm" data-ref="change">Đổi email</button>
      </div>`);
    ((d(e, `sentTo`).textContent = `Mã 6 số đã gửi tới ${s(o)}.`), (d(e, `hint`).textContent = nr));
    let t = d(e, `field`),
      n = d(e, `err`),
      r = d(e, `verify`),
      i = d(e, `resend`);
    (t.addEventListener(`input`, () => {
      let e = t.value.replace(/\D/g, ``).slice(0, 6);
      (e !== t.value && (t.value = e), t.removeAttribute(`aria-invalid`), e.length === 6 && x(t, n, r));
    }),
      e.addEventListener(`submit`, (e) => {
        (e.preventDefault(), x(t, n, r));
      }),
      i.addEventListener(`click`, () => void b(i, t, e)),
      d(e, `change`).addEventListener(`click`, () => {
        c || ((o = ``), h());
      }),
      y(i),
      t.focus({ preventScroll: !0 }));
  }
  function v(e) {
    ((e.textContent = l > 0 ? `Gửi lại mã sau ${l} giây` : `Gửi lại mã`),
      l > 0 || c ? e.setAttribute(`aria-disabled`, `true`) : e.removeAttribute(`aria-disabled`));
  }
  function y(e) {
    (m(),
      (l = 60),
      v(e),
      (u = setInterval(() => {
        e.isConnected ? ((l = Math.max(0, l - 1)), v(e), l === 0 && m()) : m();
      }, 1e3)));
  }
  async function b(e, t, n) {
    if (c || l > 0) return;
    let i = d(n, `err`);
    i.textContent = ``;
    let a = p(e, `Đang gửi…`);
    try {
      await r.sendEmailCode(o);
    } catch (e) {
      (a(), (i.textContent = Fr(e)));
      return;
    }
    (a(), (d(n, `info`).textContent = Pr), t.focus({ preventScroll: !0 }), y(e));
  }
  async function x(t, s, l) {
    if (c) return;
    let u = t.value.replace(/\D/g, ``);
    if (u.length !== 6) {
      (t.setAttribute(`aria-invalid`, `true`), (s.textContent = tr), t.focus({ preventScroll: !0 }));
      return;
    }
    s.textContent = ``;
    let d = p(l, `Đang kiểm tra…`);
    try {
      await r.verifyEmailCode(o, u);
    } catch (e) {
      (d(),
        w(`account_login_failed`, { method: `email`, reason: `verify` }),
        (t.value = ``),
        t.setAttribute(`aria-invalid`, `true`),
        (s.textContent = Fr(e)),
        t.focus({ preventScroll: !0 }));
      return;
    }
    (w(`account_login_ok`, { method: `email` }), (o = ``));
    let f = await N(r, n, i);
    f !== `reload` &&
      (d(),
      f === `ready`
        ? e.onReady()
        : a({
            reason: `choose`,
            onFail: (e) => {
              s.textContent = e || `Không kết nối được. Kiểm tra mạng rồi thử lại.`;
            },
          }));
  }
  h();
}
export {
  Rt as S,
  sn as _,
  Ln as a,
  Bt as b,
  In as c,
  Dn as d,
  Fn as f,
  Yt as g,
  jn as h,
  Gn as i,
  En as l,
  kn as m,
  qn as n,
  Kn as o,
  An as p,
  Wn as r,
  On as s,
  Nr as t,
  Tn as u,
  cn as v,
  Ft as x,
  Vt as y,
};
