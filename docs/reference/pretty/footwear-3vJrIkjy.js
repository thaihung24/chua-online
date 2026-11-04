import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { A as t, L as n, P as r, R as i, S as a, Y as o, k as s, l as c, m as l } from "./three-BbSp8N3g.js";
import { Ft as u, it as d, tt as f } from "./index-e_Bx6V48.js";
function p(e, t, n, r) {
  let i = n ? 0.09999999999999998 : -0.5;
  return e >= r.minX - i && e <= r.maxX + i && t >= r.minZ - i && t <= r.maxZ + i;
}
var m = 0.08,
  h = -8.85,
  g = 3.95,
  _ = 0.36,
  v = Array.from({ length: 12 }, (e, t) => {
    let n = t >> 1;
    return { x: (t % 2 == 0 ? 1 : -1) * (g + _ * n), y: m, z: h };
  }),
  y = 0.03,
  b = (12 * Math.PI) / 180;
function x(e) {
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
function S(e, t) {
  let n = x(23838 + e * 2654435761);
  return ((t.dx = (n() * 2 - 1) * y), (t.dz = (n() * 2 - 1) * y), (t.yaw = (n() * 2 - 1) * b), t);
}
function C(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++) ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 16777619)));
  return t >>> 0;
}
function w(e, t = 0) {
  return x(C(e) + t * 2246822507)();
}
var T = [`shin.R`, `shin.L`],
  E = 1e-5,
  D = 24;
function O(e) {
  let t = e.getAttribute(`position`),
    n = e.getAttribute(`color`);
  if (!t || !n || t.count !== n.count || t.count === 0) return 0;
  let r = t.count - 1,
    i = n.getX(r),
    a = n.getY(r),
    o = n.getZ(r),
    s = 0;
  for (
    let e = r;
    e >= 0 &&
    !(
      t.getY(e) >= -0.1 ||
      Math.abs(n.getX(e) - i) > E ||
      Math.abs(n.getY(e) - a) > E ||
      Math.abs(n.getZ(e) - o) > E
    );
    e--
  )
    s++;
  return s === t.count ? 0 : s;
}
function k(e, t) {
  let n = O(e);
  if (n === 0) return null;
  let r = e.clone(),
    i = r.getAttribute(`color`);
  for (let e = i.count - n; e < i.count; e++) i.setXYZ(e, t.r, t.g, t.b);
  return ((i.needsUpdate = !0), r);
}
function A(e) {
  let t = new l(e.skin),
    n = e.rect,
    r = new WeakMap(),
    i = [],
    a = new Map(),
    o = 0,
    s = 0,
    c = (e) => {
      let t = r.get(e);
      if (!t) {
        let n = [];
        for (let t of T) {
          let r = e.root.getObjectByName(t);
          r && r.isMesh && n.push(r);
        }
        ((t = {
          shins: n,
          sources: n.map(() => null),
          clones: n.map(() => null),
          inside: !1,
          seen: -1,
          active: !1,
        }),
          r.set(e, t));
      }
      return t;
    },
    u = (e) => {
      let n = a.get(e.uuid);
      if (!n) {
        let r = k(e, t);
        if (!r) return null;
        ((n = { geometry: r, users: 0 }), a.set(e.uuid, n));
      }
      return n;
    },
    d = () => {
      if (!(a.size <= D)) {
        for (let [e, t] of a) if (!(t.users > 0) && (t.geometry.dispose(), a.delete(e), a.size <= D)) break;
      }
    },
    f = (e, t) => {
      let n = e.clones[t];
      if (!n) return;
      let r = e.shins[t],
        i = e.sources[t];
      (i && r.geometry === n.geometry && (r.geometry = i),
        n.users--,
        (e.clones[t] = null),
        (e.sources[t] = null),
        s--);
    },
    m = (e) => {
      for (let t = 0; t < e.shins.length; t++) f(e, t);
    },
    h = (e) => {
      for (let t = 0; t < e.shins.length; t++) {
        let n = e.shins[t],
          r = e.clones[t];
        if (r) {
          if (n.geometry === r.geometry) continue;
          (r.users--, (e.clones[t] = null), (e.sources[t] = null), s--);
        }
        let i = n.geometry,
          a = u(i);
        a && ((n.geometry = a.geometry), a.users++, (e.clones[t] = a), (e.sources[t] = i), s++);
      }
      e.active || ((e.active = !0), i.push(e));
    },
    g = (e) => {
      (m(e), (e.active = !1));
      let t = i.indexOf(e);
      t >= 0 && ((i[t] = i[i.length - 1]), i.pop());
    };
  return {
    begin() {
      o++;
    },
    visit(e, t, r) {
      let i = c(e);
      ((i.seen = o), (i.inside = p(t, r, i.inside, n)), i.inside ? h(i) : i.active && g(i));
    },
    end() {
      for (let e = i.length - 1; e >= 0; e--) {
        let t = i[e];
        t.seen !== o && ((t.inside = !1), (t.active = !1), m(t), (i[e] = i[i.length - 1]), i.pop());
      }
      d();
    },
    get swapped() {
      return s;
    },
    get clones() {
      return a.size;
    },
    dispose() {
      for (let e of i) ((e.active = !1), m(e));
      i.length = 0;
      for (let e of a.values()) e.geometry.dispose();
      a.clear();
    },
  };
}
var j = { x: 0, y: m, z: h },
  M = 0.06,
  N = { h: 0, s: 0, l: 0 };
function P(e, t, n) {
  (n.setHex(e, o), n.getHSL(N, o));
  let r = (w(t, 1) * 2 - 1) * M,
    i = Math.min(1, Math.max(0, N.l * 0.65 * (1 + r)));
  return n.setHSL(N.h, N.s, i, o);
}
var F = {
    halfLength: 0.11,
    halfWidth: 0.046,
    thick: 0.022,
    toeGrow: 0.14,
    topInset: 0.9,
    strapHalfSpan: 0.032,
    strapRise: 0.04,
    strapThick: 0.004,
    strapHalfWidth: 0.022,
    strapZ: -0.03,
  },
  I = { centerX: 0.066, splay: 0.06 },
  L = {
    high: { n: 10, bands: 2, strap: 3 },
    medium: { n: 10, bands: 2, strap: 3 },
    low: { n: 8, bands: 1, strap: 2 },
  },
  R = { foot: 0.55, wall: 0.62, top: 0.9, cap: 1, strapOuter: 1, strapInner: 0.7 },
  z = class {
    constructor() {
      (u(this, `position`, []),
        u(this, `color`, []),
        u(this, `index`, []),
        u(this, `cos`, 1),
        u(this, `sin`, 0),
        u(this, `offsetX`, 0));
    }
    place(e, t) {
      ((this.offsetX = e), (this.cos = Math.cos(t)), (this.sin = Math.sin(t)));
    }
    vertex(e, t, n, r) {
      return (
        this.position.push(e * this.cos + n * this.sin + this.offsetX, t, -e * this.sin + n * this.cos),
        this.color.push(r, r, r),
        this.position.length / 3 - 1
      );
    }
    tri(e, t, n) {
      this.index.push(e, t, n);
    }
  };
function B(e, t) {
  let { n } = t,
    { halfLength: r, halfWidth: i, thick: a, toeGrow: o, topInset: s } = F,
    c = (
      t.bands === 2
        ? [
            [0, 1, R.foot],
            [a * 0.55, 1, R.wall],
            [a, s, R.top],
          ]
        : [
            [0, 1, R.foot],
            [a, s, R.top],
          ]
    ).map(([t, a, s]) => {
      let c = [];
      for (let l = 0; l < n; l++) {
        let u = (l / n) * Math.PI * 2,
          d = i * (1 + o * Math.cos(u));
        c.push(e.vertex(Math.sin(u) * d * a, t, -Math.cos(u) * r * a, s));
      }
      return c;
    });
  for (let t = 0; t + 1 < c.length; t++) {
    let r = c[t],
      i = c[t + 1];
    for (let t = 0; t < n; t++) {
      let a = (t + 1) % n;
      (e.tri(r[t], i[t], r[a]), e.tri(r[a], i[t], i[a]));
    }
  }
  let l = c[c.length - 1],
    u = e.vertex(0, a, 0, R.cap);
  for (let t = 0; t < n; t++) e.tri(u, l[(t + 1) % n], l[t]);
  let { strapHalfSpan: d, strapRise: f, strapThick: p, strapHalfWidth: m, strapZ: h } = F,
    g = t.strap,
    _ = [[], []],
    v = [[], []];
  for (let [t, n] of [
    [0, p],
    [1, -p],
  ]) {
    let r = t === 0 ? R.strapOuter : R.strapInner;
    for (let i = 0; i <= g; i++) {
      let o = (i / g) * Math.PI,
        s = -(d + n) * Math.cos(o),
        c = a + (f + n) * Math.sin(o);
      (_[t].push(e.vertex(s, c, h - m, r)), v[t].push(e.vertex(s, c, h + m, r)));
    }
  }
  for (let t = 0; t < g; t++) {
    let [n, r] = [_[0], v[0]];
    (e.tri(n[t], r[t], n[t + 1]), e.tri(n[t + 1], r[t], r[t + 1]));
    let [i, a] = [_[1], v[1]];
    (e.tri(i[t], i[t + 1], a[t]), e.tri(i[t + 1], a[t + 1], a[t]));
  }
}
function V(e) {
  let t = L[e],
    n = new z();
  (n.place(-I.centerX, I.splay), B(n, t), n.place(I.centerX, -I.splay), B(n, t));
  let r = new c();
  return (
    r.setAttribute(`position`, new a(n.position, 3)),
    r.setAttribute(`color`, new a(n.color, 3)),
    r.setIndex(n.index),
    r.computeVertexNormals(),
    r.computeBoundingSphere(),
    r.computeBoundingBox(),
    r
  );
}
function H(e, t, n) {
  let r = v[e];
  if (!r) throw Error(`footwear: không có chỗ dép ${e}`);
  return (S(e, n), t.makeRotationY(n.yaw).setPosition(r.x + n.dx, r.y + 0.001, r.z + n.dz));
}
function U(e) {
  let { quality: a, camera: o } = e,
    c = e.viewDistance ?? 20,
    u = c * c,
    d = V(a),
    f =
      a === `low` ? new n({ vertexColors: !0 }) : new i({ vertexColors: !0, roughness: 0.85, metalness: 0 });
  f.name = `footwear-rack`;
  let p = new t(d, f, 12);
  ((p.name = `footwear-rack`),
    (p.instanceColor = new s(new Float32Array(36), 3)),
    (p.count = 0),
    (p.visible = !1),
    (p.castShadow = !1),
    (p.receiveShadow = !0),
    (p.matrixAutoUpdate = !1),
    p.updateMatrix());
  let m = [],
    h = { dx: 0, dz: 0, yaw: 0 };
  for (let e = 0; e < 12; e++) m.push(H(e, new r(), h));
  let g = [];
  for (let e = 0; e < 12; e++) g.push(new l());
  let _ = Array(12).fill(!1),
    v = 0,
    y = !1,
    b = () => {
      if (!o) return !0;
      let e = o.matrixWorld.elements,
        t = e[12] - j.x,
        n = e[13] - j.y,
        r = e[14] - j.z;
      return t * t + n * n + r * r <= u;
    };
  return {
    mesh: p,
    get pairs() {
      return v;
    },
    setPair(e, t) {
      if (e < 0 || e >= 12) return;
      let n = _[e] === !0;
      if (t === null) {
        if (!n) return;
        ((_[e] = !1), v--);
      } else {
        let r = n && g[e].equals(t);
        if ((g[e].copy(t), !n)) ((_[e] = !0), v++);
        else if (r) return;
      }
      y = !0;
    },
    commit() {
      if (!y) return;
      y = !1;
      let e = 0;
      for (let t = 0; t < 12; t++) _[t] && (p.setMatrixAt(e, m[t]), p.setColorAt(e, g[t]), e++);
      ((p.count = e),
        (p.instanceMatrix.needsUpdate = !0),
        p.instanceColor && (p.instanceColor.needsUpdate = !0),
        p.computeBoundingSphere());
    },
    cull() {
      p.visible = v > 0 && b();
    },
    dispose() {
      (p.removeFromParent(), p.dispose(), d.dispose(), f.dispose());
    },
  };
}
var W = e({ installFootwear: () => Q }),
  G = 0.25,
  K = `chua-online:dep-joke`,
  q = `Ơ, hình như bạn vừa đi nhầm dép 😄`,
  J = `\0self`;
function Y() {
  try {
    return typeof localStorage > `u` ? null : localStorage;
  } catch {
    return null;
  }
}
function X(e, t) {
  let n = e ? (d(e.outfit) ?? e.robe) : t.self();
  return typeof n == `string` ? t.robes[n] : f(n).primary;
}
function Z(e) {
  let t = new Date(e);
  return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
}
function Q(e) {
  let { rect: t, player: n } = e,
    r = e.colorOf ?? ((t) => X(t, e)),
    i = e.now ?? Date.now,
    a = e.random ?? Math.random,
    o = e.storage === void 0 ? Y() : e.storage,
    s = U({
      quality: e.quality,
      ...(e.camera ? { camera: e.camera } : {}),
      ...(e.viewDistance === void 0 ? {} : { viewDistance: e.viewDistance }),
    }),
    c = e.quality === `low` ? null : A({ skin: e.skin, rect: t }),
    u = [],
    d = new Map(),
    f = Array(12).fill(null),
    m = new l(),
    h = 0,
    g = G,
    _ = ``,
    v = !1,
    y = (e, n, r, i) => {
      let a = d.get(e);
      if (a) ((a.seen = h), (a.inside = p(r, i, a.inside, t)));
      else {
        if (!p(r, i, !1, t)) return;
        ((a = { id: e, profile: n, inside: !0, slot: -1, seen: h }), d.set(e, a), u.push(a));
      }
    },
    b = () => {
      try {
        return o?.getItem(`chua-online:dep-joke`) ?? null;
      } catch {
        return null;
      }
    },
    x = () => {
      if (!e.toast) return;
      let t = Z(i());
      if (_ !== t && b() !== t && !(a() >= 0.125)) {
        _ = t;
        try {
          o?.setItem(K, t);
        } catch {}
        e.toast(q);
      }
    },
    S = (e, t, n) => {
      c?.visit(e, t, n);
    },
    C = () => {
      h++;
      let t = s.pairs,
        i = n.state;
      y(J, null, i.x, i.z);
      let a = e.people();
      for (let e = 0; e < a.length; e++) {
        let t = a[e];
        y(t.id, t.profile, t.x, t.z);
      }
      let o = 0,
        l = !1;
      for (let e = 0; e < u.length; e++) {
        let t = u[e];
        t.seen === h && t.inside
          ? (u[o++] = t)
          : (t.slot >= 0 && ((f[t.slot] = null), s.setPair(t.slot, null)),
            d.delete(t.id),
            t.id === J && (l = !0));
      }
      u.length = o;
      let p = 0;
      for (let e = 0; e < u.length; e++) {
        let t = u[e];
        if (!(t.slot >= 0)) {
          for (; p < 12 && f[p];) p++;
          if (p >= 12) break;
          ((t.slot = p), (f[p] = t), s.setPair(p, P(r(t.profile), t.id, m)));
        }
      }
      (s.commit(),
        s.cull(),
        c && (c.begin(), c.visit(e.avatar, i.x, i.z), e.remotes()?.eachAvatar(S), c.end()),
        l && t >= 3 && x());
    },
    w = e.attach(s.mesh, (e) => {
      (s.cull(), (g += e), g < 0.249999999 || ((g = 0), C()));
    });
  return {
    dispose() {
      v || ((v = !0), w(), c?.dispose(), s.dispose(), (u.length = 0), d.clear(), f.fill(null));
    },
  };
}
export { W as t };
