import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { dt as t, lt as n, ut as r, wt as i } from "./index-e_Bx6V48.js";
var a = e({ startAppUpdates: () => E }),
  o = { version: `0.9.31`, build: `mw1l6ggn` },
  s = `./version.json`,
  c = 4e3,
  l = 12e4,
  u = `chua:update-event`,
  d = `Đang cập nhật Chùa Sen bản mới…`,
  f = `Có bản mới của Chùa Sen`,
  p = `Cập nhật`;
function m(e) {
  return `${e.version}+${e.build}`;
}
function h(e) {
  if (typeof e != `object` || !e) return null;
  let { version: t, build: n } = e,
    r = (e) => typeof e == `string` && /^[\w.+-]{1,40}$/.test(e);
  return r(t) && r(n) ? { version: t, build: n } : null;
}
function g(e, t) {
  let n = e.split(`.`),
    r = t.split(`.`);
  for (let e = 0; e < Math.max(n.length, r.length); e++) {
    let t = Number.parseInt(n[e] ?? `0`, 10) || 0,
      i = Number.parseInt(r[e] ?? `0`, 10) || 0;
    if (t !== i) return t - i;
  }
  return 0;
}
function _(e) {
  return /^[0-9a-z]{1,10}$/.test(e) ? Number.parseInt(e, 36) : NaN;
}
function v(e, t) {
  let n = g(e.version, t.version);
  if (n !== 0) return n > 0;
  if (e.build === t.build) return !1;
  let r = _(e.build),
    i = _(t.build);
  return Number.isNaN(r) || Number.isNaN(i) ? !0 : r > i;
}
function y(e, t) {
  return e === `boot` || e === `idle` ? e : t && e === `busy` ? `idle` : `prompt`;
}
async function b(e, t, n = c) {
  let r = new AbortController(),
    i = setTimeout(() => r.abort(), n);
  try {
    let n = await e(t, { cache: `no-store`, credentials: `same-origin`, signal: r.signal });
    return n.ok ? h(await n.json()) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(i);
  }
}
function x(e, t) {
  return new Promise((n) => {
    let r = (t) => {
        (clearTimeout(a), e.removeEventListener(`statechange`, i), n(t));
      },
      i = () => {
        e.state === `installed`
          ? e.postMessage({ type: `SKIP_WAITING` })
          : e.state === `activated`
            ? r(!0)
            : e.state === `redundant` && r(!1);
      },
      a = setTimeout(() => r(!1), t);
    (e.addEventListener(`statechange`, i), i());
  });
}
async function S(e, t = l) {
  if (!e) return !0;
  try {
    let n = await e.getRegistration();
    if (!n) return !0;
    await n.update();
    let r = n.installing ?? n.waiting;
    return !r || (await x(r, t));
  } catch {
    return !1;
  }
}
var C = [`boot`, `idle`, `prompt`];
function w(e, t, n) {
  try {
    let r = e?.getItem(u);
    if (!r) return;
    e?.removeItem(u);
    let { from: i, to: a, mode: o } = JSON.parse(r);
    a === t && typeof i == `string` && C.includes(o) && n(`app_update`, { from: i, to: a, mode: o });
  } catch {}
}
function T() {
  return typeof navigator < `u` && `serviceWorker` in navigator ? navigator.serviceWorker : null;
}
function E(e) {
  let a = e.running ?? o,
    c = m(a),
    l = e.serviceWorker === void 0 ? T() : e.serviceWorker,
    h = e.doc ?? document,
    g = e.storage === void 0 ? t() : e.storage,
    _ = e.fetchImpl ?? ((e, t) => fetch(e, t)),
    x = e.reload ?? (() => location.reload()),
    C = e.online ?? (() => navigator.onLine !== !1),
    E = e.now ?? Date.now,
    D = e.idleNoticeMs ?? 1500,
    O = e.idleSpreadMs ?? 3e5,
    k = e.random ?? Math.random;
  w(g, c, e.track ?? i);
  let A = null,
    j = !1,
    M = !1,
    N = null,
    P = -1 / 0,
    F = l?.controller ?? null,
    I,
    L,
    R = !1;
  function z(t) {
    if (j) return `reloading`;
    if (!A) return `current`;
    let r = m(A),
      i = (e) => {
        try {
          e === null ? g?.removeItem(u) : g?.setItem(u, e);
        } catch {}
      };
    return (
      i(JSON.stringify({ from: c, to: r, mode: t })),
      n(r, { store: g, reload: x })
        ? ((j = !0), `reloading`)
        : (i(null), (A = null), e.prompt(null), `blocked`)
    );
  }
  function B() {
    return (e.prompt(f, { label: p, run: () => void z(`prompt`) }), `prompted`);
  }
  function V() {
    if (L !== void 0) return `scheduled`;
    let e = Math.floor(k() * O);
    return e > 0
      ? ((L = setTimeout(() => {
          ((L = void 0), (R = !0), M || j || !A || H());
        }, e)),
        `scheduled`)
      : ((R = !0), H());
  }
  function H(t = !1) {
    if (j) return `reloading`;
    if (!A || M) return `current`;
    let n = h.visibilityState === `hidden`,
      r = y(e.state(), n || t);
    return r === `prompt`
      ? B()
      : r === `idle` && !t && !R
        ? V()
        : r === `boot` || n || t
          ? z(r)
          : (e.notify(d),
            clearTimeout(I),
            (I = setTimeout(() => {
              if (((I = void 0), M || j || !A)) return;
              let t = y(e.state(), h.visibilityState === `hidden`);
              t === `prompt` ? B() : z(t);
            }, D)),
            `scheduled`);
  }
  async function U() {
    if (((P = E()), !C())) return `offline`;
    let t = await b(_, `${s}?t=${E()}`, e.timeoutMs ?? 4e3);
    return M
      ? `current`
      : t
        ? v(t, a)
          ? r(m(t), g)
            ? `blocked`
            : !(await S(l, e.activateTimeoutMs ?? 12e4)) || M
              ? `pending`
              : ((A = t), H())
          : `current`
        : `offline`;
  }
  function W() {
    return M
      ? Promise.resolve(`current`)
      : j
        ? Promise.resolve(`reloading`)
        : ((N ??= U()
            .catch(() => `offline`)
            .finally(() => {
              N = null;
            })),
          N);
  }
  let G = () => {
      M || j || (A ? H(!0) : h.visibilityState === `visible` && E() - P >= (e.minGapMs ?? 6e4) && W());
    },
    K = () => {
      let e = F;
      ((F = l?.controller ?? null), e === null || M || j || Promise.resolve(N).then(W));
    };
  (h.addEventListener(`visibilitychange`, G), l?.addEventListener(`controllerchange`, K));
  let q = setInterval(() => {
    h.visibilityState === `visible` && W();
  }, e.intervalMs ?? 9e5);
  return (
    W(),
    {
      checkForUpdate: W,
      dispose() {
        ((M = !0),
          clearInterval(q),
          clearTimeout(I),
          clearTimeout(L),
          h.removeEventListener(`visibilitychange`, G),
          l?.removeEventListener(`controllerchange`, K));
      },
    }
  );
}
export { a as t };
