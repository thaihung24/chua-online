var e = Object.freeze({ bell: 10, khanh: 4 }),
  t = Object.freeze({ chant: !1, community: !1, bell: !1, meditation: !1, talk: !1 });
function n(e) {
  if (e.talk) return 0;
  let t = 1;
  return (
    (e.chant || e.community || e.bell) && (t = Math.min(t, 0.25)),
    e.meditation && (t = Math.min(t, 0.12)),
    t
  );
}
function r(e = typeof navigator > `u` ? void 0 : navigator) {
  return e ? e.connection?.saveData === !0 || e.onLine === !1 : !1;
}
function i(e) {
  let t = !1,
    n = new Set();
  return [
    () => t,
    (r) => {
      if (t !== r) {
        t = r;
        for (let t of [...n])
          try {
            t();
          } catch (t) {
            console.error(`Lỗi trong hàm lắng nghe trạng thái ${e}`, t);
          }
      }
    },
    (e) => (n.add(e), () => void n.delete(e)),
  ];
}
var [a, o, s] = i(`thiền`),
  [c, l, u] = i(`pháp thoại`),
  [d, f, p] = i(`tụng kinh`);
export { c as a, p as c, o as d, f, d as i, u as l, t as n, n as o, l as p, a as r, s, e as t, r as u };
