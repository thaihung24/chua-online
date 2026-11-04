var e = `chua-online:ref-code`,
  t = `chua-online:ref-from`,
  n = /^[0-9a-hjkmnp-tv-z]{8}$/,
  r = null,
  i = null;
function a() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function o(e) {
  if (typeof e != `string`) return null;
  let t = e.trim().toLowerCase();
  return n.test(t) ? t : null;
}
function s(e, t) {
  try {
    return e?.getItem(t) ?? null;
  } catch {
    return null;
  }
}
function c(e, t, n) {
  if (!e) return !1;
  try {
    return (e.setItem(t, n), !0);
  } catch {
    return !1;
  }
}
function l(e = a()) {
  return o(s(e, `chua-online:ref-code`)) ?? r;
}
function u(e) {
  let t = ``;
  for (let n = 0; n < 8; n++) t += `0123456789abcdefghjkmnpqrstvwxyz`[(e[n] ?? 0) & 31];
  return t;
}
function d(e = a(), t = (e) => crypto.getRandomValues(e)) {
  let n = l(e);
  if (n) return n;
  let i = u(t(new Uint8Array(8)));
  return (c(e, `chua-online:ref-code`, i) || (r = i), i);
}
function f(e = a(), t = (e) => crypto.getRandomValues(e)) {
  let n = u(t(new Uint8Array(8)));
  return ((r = c(e, `chua-online:ref-code`, n) ? null : n), n);
}
function p(e) {
  if (e === null) return null;
  try {
    let t = JSON.parse(e);
    if (typeof t != `object` || !t) return null;
    let { code: n, at: r } = t,
      i = o(n);
    return i && typeof r == `number` && Number.isFinite(r) ? { code: i, at: r } : null;
  } catch {
    return null;
  }
}
function m(e, t) {
  return t - e.at < 2592e6 && e.at - t < 864e5;
}
function h(e = {}) {
  let t = e.storage === void 0 ? a() : e.storage,
    n = (e.now ?? Date.now)(),
    r = p(s(t, `chua-online:ref-from`)) ?? i;
  return r ? (m(r, n) ? { ...r } : (g(t), null)) : null;
}
function g(e = a()) {
  i = null;
  try {
    e?.removeItem(t);
  } catch {}
}
function _(e = {}) {
  let t = e.location ?? (typeof location > `u` ? null : location);
  if (!t) return null;
  let n = new URLSearchParams(t.search);
  if (!n.has(`ref`)) return h(e)?.code ?? null;
  let r = o(n.get(`ref`));
  n.delete(`ref`);
  let s = n.toString(),
    u = e.history ?? (typeof history > `u` ? null : history);
  try {
    u?.replaceState(u.state, ``, `${t.pathname}${s ? `?${s}` : ``}${t.hash}`);
  } catch {}
  let d = e.storage === void 0 ? a() : e.storage,
    f = h({ ...e, storage: d });
  if (f || !r || r === l(d)) return f?.code ?? null;
  let p = { code: r, at: (e.now ?? Date.now)() };
  return (c(d, `chua-online:ref-from`, JSON.stringify(p)) || (i = p), r);
}
export { d as a, f as c, g as i, t as n, h as o, _ as r, l as s, e as t };
