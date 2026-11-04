var e = new Set(),
  t = new Set();
function n() {
  for (let e of [...t]) e();
}
function r(t) {
  (typeof t.showModal == `function` ? t.showModal() : t.setAttribute(`open`, ``),
    e.has(t) ||
      (e.add(t),
      t.addEventListener(
        `close`,
        () => {
          (e.delete(t), n());
        },
        { once: !0 },
      ),
      n()));
}
function i() {
  for (let t of e) (t.isConnected && t.hasAttribute(`open`)) || e.delete(t);
  return e.size > 0;
}
function a(e) {
  return (
    t.add(e),
    () => {
      t.delete(e);
    }
  );
}
function o(e) {
  typeof e.close == `function` ? e.close() : (e.removeAttribute(`open`), e.dispatchEvent(new Event(`close`)));
}
function s(e) {
  let t = !1;
  (e.addEventListener(`pointerdown`, (n) => {
    t = n.target === e;
  }),
    e.addEventListener(`click`, (n) => {
      (t && n.target === e && o(e), (t = !1));
    }));
}
function c(e, t, n = 8) {
  let r = t.getBoundingClientRect().top - e.getBoundingClientRect().top + e.scrollTop;
  e.scrollTop = Math.max(0, r - n);
}
export { c as a, a as i, o as n, r as o, s as r, i as t };
