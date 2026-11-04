const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["./kol-aura-CO2CrSTo.js", "./rolldown-runtime-DK3Fl9T5.js", "./three-BbSp8N3g.js"]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { F as t, M as n, Y as r, it as i, rt as a, u as o } from "./three-BbSp8N3g.js";
import { A as s, I as c, L as l, O as u, j as d, k as f } from "./app-z_oU8L_u.js";
import { it as p } from "./index-e_Bx6V48.js";
import { h as m } from "./progress-core-C9e35Hb5.js";
import { b as h, n as g, t as _, x as v } from "./lazy-shared-D8DtrU9N.js";
import { i as ee, r as te, t as y } from "./level-bloom-Br4y8WwV.js";
import { t as ne } from "./preload-helper-CRzLMJPS.js";
var re = e({ createRemotes: () => G }),
  b = 1 / 15,
  x = 1 / 12,
  ie = 6,
  ae = 0.1,
  S = 8,
  C = 4,
  oe = 200,
  w = 20,
  T = 600,
  E = 0.05,
  D = 0.1,
  O = 150,
  k = 200,
  A = 2,
  j = 20,
  M = 1.5,
  se = 20,
  ce = 0.05,
  N = 4,
  le = 2.6,
  ue = 128,
  P = { low: 24, medium: 40, high: 60 },
  de = 6,
  fe = 1.1,
  pe = 0.25,
  me = 0.6,
  he = 0.25,
  ge = 0.4,
  _e = 3,
  ve = 0.22,
  ye = 0.5,
  be = 1.5,
  xe = 0.12,
  Se = 0.15,
  Ce = 0.01,
  we = 1.8,
  Te = 1.12,
  F = new Set([`idle`, `walk`, `sit`, `bow`]),
  I = Math.PI * 2;
function L(e) {
  let t = e % I;
  return (t > Math.PI ? (t -= I) : t <= -Math.PI && (t += I), t);
}
function Ee(e) {
  return F.has(e) ? e : `idle`;
}
function R(e) {
  let t = c[e];
  return typeof t == `string` ? t : ``;
}
function De(e) {
  return R(e) ? e : `none`;
}
function Oe(e) {
  return R(e.activity) || (e.mindful ? `đang thiền hành` : ``);
}
function ke(e) {
  let { name: t, gender: n, robe: r, outfit: i } = e,
    a = i === void 0 ? { name: t, gender: n, robe: r } : { name: t, gender: n, robe: r, outfit: i },
    o = m(e.level);
  return (o !== void 0 && (a.level = o), h(e.title) && (a.title = e.title), a);
}
function Ae(e) {
  return e.outfit === void 0 ? null : p(e.outfit);
}
function je(e, t) {
  return e.name === t.name && e.gender === t.gender && e.robe === t.robe && e.outfit === t.outfit;
}
function Me(e) {
  return e.badges?.includes(`kol`) === !0;
}
var z = 20,
  B = 80;
function V(e, t) {
  let n = [e],
    r = e;
  for (; r > t && ((r = Math.max(t, Math.floor(r * 0.75))), r < n[n.length - 1]);) n.push(r);
  return n;
}
function Ne(e, t = {}) {
  let n = t.minCap ?? 8,
    r = t.slowMs ?? 22,
    i = t.fastMs ?? 12,
    a = t.slowSeconds ?? 2.5,
    o = t.fastSeconds ?? 5,
    s = t.settleSeconds ?? 4,
    c = V(Math.max(1, Math.floor(e)), n),
    l = 0,
    u = 0,
    d = 0,
    f = 0,
    p = o,
    m = 0,
    h = !1;
  function g() {
    ((u = 0), (d = 0), (m = 0), (f = s));
  }
  return {
    get cap() {
      return c[l];
    },
    ladder: c,
    observe(e, t) {
      return !Number.isFinite(e) || !(t > 0)
        ? c[l]
        : ((m += t),
          h && m >= z && ((p = o), (h = !1)),
          f > 0
            ? ((f -= t), c[l])
            : (e > r
                ? ((d = 0),
                  (u += t),
                  u >= a && l < c.length - 1 && (h && (p = Math.min(B, p * 2)), l++, (h = !1), g()))
                : e < i
                  ? ((u = 0), (d += t), d >= p && l > 0 && (l--, (h = !0), g()))
                  : ((u = 0), (d = 0)),
              c[l]));
    },
    reset() {
      ((l = 0), (u = 0), (d = 0), (f = 0), (p = o), (m = 0), (h = !1));
    },
  };
}
function Pe(e) {
  let t = e.clone();
  return (
    (t.onBeforeCompile = e.onBeforeCompile),
    (t.customProgramCacheKey = e.customProgramCacheKey),
    (t.transparent = !0),
    t
  );
}
function Fe(e) {
  return e.name === `skirt` || (e.morphTargetInfluences?.length ?? 0) > 0;
}
function Ie(e) {
  for (let t = 0; t < 3; t++) e.update(1, 0);
}
var H = `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif`,
  U = 496;
function Le(e) {
  let t = `600 38px ${H}`,
    n = document.createElement(`canvas`),
    i = n.getContext(`2d`),
    a = 256;
  if (i) {
    i.font = t;
    let n = i.measureText(e).width;
    (n > U &&
      ((t = `600 ${Math.max(30, Math.floor((38 * U) / n))}px ${H}`),
      (i.font = t),
      (n = i.measureText(e).width)),
      (a = Math.min(560, Math.max(160, Math.ceil(n) + 64))));
  }
  if (((n.width = a), (n.height = 96), (i = n.getContext(`2d`)), i)) {
    let n = a - 6;
    (i.beginPath(),
      i.moveTo(31, 3),
      i.arcTo(3 + n, 3, 3 + n, 77, 28),
      i.arcTo(3 + n, 77, 3, 77, 28),
      i.lineTo(a / 2 + 12, 77),
      i.lineTo(a / 2, 94),
      i.lineTo(a / 2 - 12, 77),
      i.arcTo(3, 77, 3, 3, 28),
      i.arcTo(3, 3, 3 + n, 3, 28),
      i.closePath(),
      (i.fillStyle = `rgba(27, 18, 11, 0.92)`),
      i.fill(),
      (i.lineWidth = 3),
      (i.strokeStyle = `#e0b25c`),
      i.stroke(),
      (i.font = t),
      (i.fillStyle = `#f5ead9`),
      (i.textAlign = `center`),
      (i.textBaseline = `middle`),
      i.fillText(e, a / 2, 42));
  }
  let s = new o(n);
  return ((s.colorSpace = r), { texture: s, aspect: a / 96 });
}
function Re(e) {
  let t = `600 30px ${H}`,
    i = document.createElement(`canvas`),
    a = i.getContext(`2d`),
    s = 160;
  (a && ((a.font = t), (s = Math.max(52, Math.ceil(a.measureText(e).width) + 44))),
    (i.width = s),
    (i.height = 52),
    (a = i.getContext(`2d`)),
    a &&
      (a.beginPath(),
      a.moveTo(26, 1),
      a.arcTo(s - 1, 1, s - 1, 51, 25),
      a.arcTo(s - 1, 51, 1, 51, 25),
      a.arcTo(1, 51, 1, 1, 25),
      a.arcTo(1, 1, s - 1, 1, 25),
      a.closePath(),
      (a.fillStyle = `rgba(20, 13, 8, 0.6)`),
      a.fill(),
      (a.font = t),
      (a.fillStyle = `#e8c98a`),
      (a.textAlign = `center`),
      (a.textBaseline = `middle`),
      a.fillText(e, s / 2, 28)));
  let c = new o(i);
  return (
    (c.colorSpace = r),
    (c.minFilter = n),
    (c.magFilter = n),
    (c.generateMipmaps = !1),
    { texture: c, aspect: s / 52 }
  );
}
function ze(e, t) {
  return e.rank - t.rank;
}
function Be(e, t) {
  return !t || !(e >= 0) || e <= 36 ? 0 : e <= 324 ? b : x;
}
function W(e, t, n, r, i, a) {
  let o = e.sh,
    s = o * C,
    c = e.ring;
  ((c[s] = t),
    (c[s + 1] = n),
    (c[s + 2] = r),
    (c[s + 3] = i),
    (e.ringAnim[o] = a),
    (e.sh = (o + 1) % S),
    e.sn < S && e.sn++);
}
function Ve(e, t) {
  ((e.sn = 0), (e.sh = 0), W(e, t, e.tx, e.tz, e.tFacing, e.tAnim), (e.lastArrival = t));
}
function He(e, t, n, r, i, a) {
  if (e.sn === 0) {
    (W(e, t, n, r, i, a), (e.lastArrival = t));
    return;
  }
  let o = e.ring,
    s = (e.sh + S - 1) % S,
    c = s * C,
    l = o[c],
    u = e.ringAnim[s],
    d = t - e.lastArrival;
  e.lastArrival = t;
  let f = t;
  if (u !== `walk` && d > A * e.gap) {
    let n = Math.max(l + j, t - e.gap);
    if (n < t) {
      let t = o[c + 1],
        r = o[c + 2];
      W(e, n, t, r, o[c + 3], u);
    }
  } else {
    d >= w && d <= T && (e.gap += (d - e.gap) * E);
    let n = l + e.gap;
    ((f = n + (t - n) * D), f < t - O ? (f = t - O) : f > t + k && (f = t + k));
  }
  let p = o[((e.sh + S - 1) % S) * C] + j;
  W(e, f < p ? p : f, n, r, i, a);
}
function Ue(e, t, n) {
  let r = e.ring,
    i = (e.sh + S - 1) % S,
    a = i * C,
    o = r[a];
  if (t >= o) {
    if (
      ((n.x = r[a + 1]),
      (n.z = r[a + 2]),
      (n.facing = r[a + 3]),
      (n.vx = 0),
      (n.vz = 0),
      (n.speed = 0),
      (n.anim = e.ringAnim[i]),
      e.sn > 1 && n.anim === `walk`)
    ) {
      let e = ((i + S - 1) % S) * C,
        a = o - r[e];
      if (a > 1) {
        let i = (n.x - r[e + 1]) / a,
          s = (n.z - r[e + 2]) / a,
          c = Math.hypot(i, s) * 1e3,
          l = c > N ? N / c : 1,
          u = t - o,
          d = u < 150 ? u : 150;
        ((n.x += i * l * d),
          (n.z += s * l * d),
          u < 150 ? ((n.vx = i * l * 1e3), (n.vz = s * l * 1e3), (n.speed = c * l)) : (n.anim = `idle`));
      }
    }
    return;
  }
  let s = i,
    c = e.sn - 1,
    l = -1;
  for (; c > 0;) {
    let e = (s + S - 1) % S;
    if (r[e * C] <= t) {
      l = e;
      break;
    }
    ((s = e), c--);
  }
  let u = s * C;
  if (l < 0) {
    ((n.x = r[u + 1]),
      (n.z = r[u + 2]),
      (n.facing = r[u + 3]),
      (n.vx = 0),
      (n.vz = 0),
      (n.speed = 0),
      (n.anim = e.ringAnim[s]));
    return;
  }
  let d = l * C,
    f = r[d],
    p = r[u] - f,
    m = (t - f) / p,
    h = r[d + 1],
    g = r[d + 2],
    _ = r[u + 1] - h,
    v = r[u + 2] - g,
    ee = r[d + 3];
  ((n.x = h + _ * m),
    (n.z = g + v * m),
    (n.facing = L(ee + L(r[u + 3] - ee) * m)),
    (n.vx = (_ / p) * 1e3),
    (n.vz = (v / p) * 1e3),
    (n.speed = (Math.hypot(_, v) / p) * 1e3));
  let te = e.ringAnim[l],
    y = e.ringAnim[s];
  n.anim = te === `walk` || y === `walk` ? `walk` : y;
}
function We(e) {
  let t = e * M;
  return t < 200 ? 200 : t > 350 ? 350 : t;
}
function Ge(e) {
  let t = P[e.quality ?? `high`] ?? 60,
    n = e.maxVisible;
  return typeof n == `number` && Number.isFinite(n) ? Math.max(1, Math.floor(n)) : t;
}
function G(e, n = {}) {
  let r = Ge(n),
    o = n.shadows ?? null,
    c = n.labels ?? null,
    p = typeof n.buildBudgetMs == `number` && !Number.isNaN(n.buildBudgetMs) ? n.buildBudgetMs : 6,
    re = Ne(r),
    b = typeof n.frameWorkMs == `function`,
    x = NaN,
    C = 0,
    w = r,
    T = [],
    E = [],
    D = [],
    O = [],
    k = new Map(),
    A = [],
    j = new Map(),
    M = new Map(),
    N = [],
    P = [],
    F = 0,
    I = !1,
    R = !1,
    z = 0,
    B = 0,
    V = 0,
    H = !0,
    U = 0,
    W = n.now ?? (() => performance.now()),
    G = 0,
    Ke = W(),
    qe = () => G + Math.max(0, W() - Ke),
    K = { x: 0, z: 0, facing: 0, vx: 0, vz: 0, speed: 0, anim: `idle` },
    Je = 0,
    q = 0,
    Ye = 0,
    Xe = null,
    J = null,
    Y =
      typeof window < `u` &&
      typeof window.matchMedia == `function` &&
      window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
  function Ze(e) {
    for (let t = 0; t < A.length; t++) if (A[t].bubble?.material.map === e.texture) return !0;
    return !1;
  }
  function Qe(e, t) {
    let n = j.get(e);
    if (n) j.delete(e);
    else {
      n = Le(t);
      for (let [e, t] of j) {
        if (j.size < 8) break;
        Ze(t) || (t.texture.dispose(), j.delete(e));
      }
    }
    return (j.set(e, n), n);
  }
  function $e(e, t) {
    let n = M.get(e);
    return (n || ((n = Re(t)), M.set(e, n)), n);
  }
  function X(e) {
    let t = e.bubble;
    t &&
      (e.rig?.avatar.root.remove(t.sprite),
      O.length < de ? O.push(t.material) : t.material.dispose(),
      (e.bubble = null),
      Ye--);
  }
  function et(e) {
    let t = e.line;
    t && (e.rig?.avatar.root.remove(t.sprite), t.material.dispose(), (e.line = null));
  }
  function Z(e, t) {
    if (t) for (let n = 0; n < e.length; n++) e[n].material = t;
  }
  function tt(e, t) {
    e.length < 16 ? e.push(t) : t.dispose();
  }
  function nt(e) {
    let t = e.fadeBody,
      n = e.fadeSkirt;
    (t && (Z(e.bodyMeshes, e.bodyBase), (e.fadeBody = null), tt(E, t)),
      n && (Z(e.skirtMeshes, e.skirtBase), (e.fadeSkirt = null), tt(D, n)));
  }
  function rt(e) {
    (e.skirtBase &&
      !e.fadeSkirt &&
      ((e.fadeSkirt = D.pop() ?? Pe(e.skirtBase)), Z(e.skirtMeshes, e.fadeSkirt)),
      e.bodyBase && !e.fadeBody && ((e.fadeBody = E.pop() ?? Pe(e.bodyBase)), Z(e.bodyMeshes, e.fadeBody)));
  }
  function it(e) {
    let n = f(e, { nameplate: !c, outfit: Ae(e) }),
      r = [],
      i = [];
    n.root.traverse((e) => {
      e instanceof t && !Array.isArray(e.material) && (Fe(e) ? i : r).push(e);
    });
    let o = r[0]?.material,
      s = i[0]?.material,
      l = n.root.getObjectByName(`nameplate`),
      u = l instanceof a ? l : null;
    return {
      avatar: n,
      profile: e,
      anim: `idle`,
      bodyMeshes: r,
      skirtMeshes: i,
      bodyBase: o && !Array.isArray(o) ? o : null,
      skirtBase: s && !Array.isArray(s) ? s : null,
      fadeBody: null,
      fadeSkirt: null,
      plate: u,
      plateBaseHeight: u ? u.scale.y : 0,
    };
  }
  function at() {
    let t = J;
    t && ((J = null), e.remove(t.avatar.root), nt(t), T.push(t));
  }
  function ot(t) {
    let n = t.rig;
    if (!n) return;
    (X(t), et(t), nt(n), d(n.avatar, !1));
    let r = n.avatar.root;
    (o?.untrack(r),
      c?.remove(t.id),
      y(r),
      Q?.set(t.id, null),
      e.remove(r),
      (t.rig = null),
      (t.alpha = 0),
      (t.x = t.tx),
      (t.z = t.tz),
      (t.facing = t.tFacing),
      (t.anim = t.tAnim),
      T.length < Math.max(8, w) ? T.push(n) : n.avatar.dispose());
  }
  function st(e) {
    let t = A[e];
    t && (ot(t), k.delete(t.id), A.splice(e, 1), (H = !0));
  }
  function ct(e, t) {
    c?.set(e.id, {
      object: t.avatar.root,
      name: e.profile.name,
      subtitle: Oe(e),
      level: e.profile.level,
      kol: e.kol,
      title: v(e.profile.title)?.name,
    });
  }
  function lt(e, t) {
    let n = e.profile.name !== t.name;
    (s(e.avatar, t, Ae(t)), (e.profile = t), n && e.plate && (e.plateBaseHeight = e.plate.scale.y));
  }
  function ut(e, t, n) {
    let r = e.rig,
      i = performance.now();
    ee({
      prev: t,
      next: n,
      drawn: r !== null && e.shown && !e.leaving,
      lastAt: e.bloomAt,
      now: i,
      reducedMotion: Y,
    }) &&
      r &&
      te(r.avatar.root, n, { reducedMotion: Y }) &&
      (e.bloomAt = i);
  }
  let Q = null,
    $ = !1;
  function dt(t) {
    let r = t.kol && t.rig ? t.rig.avatar.root : null;
    Q
      ? Q.set(t.id, r)
      : !r ||
        $ ||
        I ||
        (($ = !0),
        ne(
          async () => {
            let { shareKolAuras: e } = await import(`./kol-aura-CO2CrSTo.js`).then((e) => e.t);
            return { shareKolAuras: e };
          },
          __vite__mapDeps([0, 1, 2]),
          import.meta.url,
        ).then(
          ({ shareKolAuras: t }) => {
            if ((($ = !1), I)) return;
            let r = t(e, { quality: n.quality, reducedMotion: Y, camera: n.camera });
            Q = r;
            for (let e = 0; e < A.length; e++) {
              let t = A[e];
              t.kol && t.rig && r.set(t.id, t.rig.avatar.root);
            }
          },
          (e) => {
            (($ = !1), console.error(`Không nạp được hào quang KOL`, e));
          },
        ));
  }
  function ft(e, t) {
    let n = e.rig;
    if (!n) return;
    let r = Oe(e);
    if (c) {
      (ct(e, n), r && t && c.reveal(e.id));
      return;
    }
    if (!r) {
      et(e);
      return;
    }
    let o = $e(e.activity, r),
      s = e.line;
    if (s) ((s.material.map = o.texture), (s.aspect = o.aspect));
    else {
      let t = new i({ map: o.texture, transparent: !0, depthWrite: !1, toneMapped: !1, fog: !1 }),
        r = new a(t);
      ((r.name = `activity`),
        r.center.set(0.5, 1),
        (r.renderOrder = 11),
        (r.visible = e.plateOn),
        (s = { sprite: r, material: t, aspect: o.aspect }),
        (e.line = s),
        n.avatar.root.add(r));
    }
    ((s.material.opacity = e.alpha), ht(e, s));
  }
  function pt(e, t) {
    ((e.activity = t), ft(e, !0));
  }
  function mt(e, t) {
    e.mindful = t;
    let n = e.rig;
    n && (d(n.avatar, t), e.activity === `none` && ft(e, t));
  }
  function ht(e, t) {
    let n = e.rig,
      r = n?.plate,
      i = 1,
      a = Te;
    n &&
      r &&
      ((a = r.position.y),
      n.plateBaseHeight > 0 && (i = Math.min(we, Math.max(1, r.scale.y / n.plateBaseHeight))));
    let o = Se * i;
    (t.sprite.scale.set(o * t.aspect, o, 1), (t.sprite.position.y = a - Ce * i));
  }
  function gt(e, t) {
    let n = e.alpha;
    (n >= 1 || n <= 0
      ? nt(t)
      : (rt(t), t.fadeBody && (t.fadeBody.opacity = n), t.fadeSkirt && (t.fadeSkirt.opacity = n)),
      t.plate && (t.plate.material.opacity = n),
      e.line && (e.line.material.opacity = n));
  }
  function _t(e) {
    let t = Ee(e.anim),
      n = Number.isFinite(e.x) ? e.x : 0,
      r = Number.isFinite(e.z) ? e.z : 0,
      i = Number.isFinite(e.facing) ? L(e.facing) : 0,
      a = {
        id: e.id,
        rig: null,
        profile: ke(e.profile),
        kol: Me(e),
        anim: t,
        activity: De(e.activity),
        x: n,
        y: u(t, n, r),
        z: r,
        facing: i,
        tx: n,
        tz: r,
        tFacing: i,
        tAnim: t,
        ring: new Float64Array(32),
        ringAnim: Array(S).fill(`idle`),
        sn: 0,
        sh: 0,
        lastArrival: 0,
        gap: oe,
        delay: We(oe),
        shownAt: 0,
        gen: F,
        bubble: null,
        line: null,
        alpha: 0,
        leaving: !1,
        shown: !1,
        seen: !1,
        dist2: 0,
        plateOn: !0,
        rank: 0,
        poseClock: 1 / 0,
        poseDue: 0,
        poseBand: -1,
        poseFrac: (Je++ * 0.6180339887498949) % 1,
        bloomAt: -1 / 0,
        mindful: e.mindful === !0,
      };
    (k.set(e.id, a), A.push(a), (H = !0));
  }
  function vt(t) {
    t.anim = t.tAnim;
    let n = T.pop();
    if (n) {
      let e = n.avatar;
      (je(n.profile, t.profile) || lt(n, t.profile),
        n.anim !== `idle` && ((n.anim = `idle`), e.setState(`idle`), Ie(e)));
    } else n = it(t.profile);
    let r = n.avatar;
    ((n.anim = t.anim),
      r.setState(t.anim),
      d(r, t.mindful),
      t.anim === `sit` && Ie(r),
      (t.rig = n),
      (t.x = t.tx),
      (t.z = t.tz),
      (t.facing = t.tFacing),
      (t.y = u(t.anim, t.x, t.z)),
      (t.alpha = 0),
      (t.poseClock = 1 / 0),
      (t.poseDue = 0),
      (t.poseBand = -1),
      Ve(t, qe()));
    let i = r.root;
    ((i.name = `remote:${t.id}`),
      i.position.set(t.x, t.y, t.z),
      (i.rotation.y = t.facing),
      (i.visible = !1),
      (i.userData.blobOpacity = 0),
      n.plate && (n.plate.visible = t.plateOn),
      e.add(i),
      gt(t, n),
      o?.track(i),
      t.kol && dt(t),
      ft(t, !t.seen),
      (t.seen = !0));
  }
  function yt() {
    let e = 3,
      t = 6,
      n = Number.isFinite(p) ? performance.now() : 0;
    for (; q > 0 && e > 0 && t > 0;) {
      let r = null;
      for (let e = 0; e < A.length; e++) {
        let t = A[e];
        !t.shown || t.rig || t.leaving || ((r === null || t.dist2 < r.dist2) && (r = t));
      }
      if (!r) {
        q = 0;
        return;
      }
      if ((T.length === 0 && e--, t--, vt(r), q--, Number.isFinite(p) && performance.now() - n > p)) return;
    }
  }
  function bt(e, t, n) {
    if (((t.age += n), (t.left -= n), t.left <= 0)) {
      X(e);
      return;
    }
    let r = Y ? 1 : Math.min(1, t.age / ve),
      i = Y ? 1 : 1 + 2.2 * (r - 1) ** 3 + 1.2 * (r - 1) ** 2;
    t.pop = Math.max(0.001, i);
    let a = _ * t.pop;
    (t.sprite.scale.set(a * t.aspect, a, 1),
      (t.sprite.position.y = be + (Y ? 0 : xe * Math.min(1, t.age / _e))),
      (t.sprite.visible = e.shown),
      (t.opacity = (t.left < ye ? Math.max(0, t.left / ye) : 1) * e.alpha),
      (t.material.opacity = t.opacity));
  }
  function xt(e) {
    let t = Xe;
    if (t === null) return e.dist2;
    let n = t.matrixWorld.elements,
      r = e.x - (n[12] ?? 0),
      i = e.y + be - (n[13] ?? 0),
      a = e.z - (n[14] ?? 0);
    return r * r + i * i + a * a;
  }
  function St(e) {
    let t = null,
      n = 0;
    for (let r = 0; r < A.length; r++) {
      let i = A[r];
      if (i === e || !i.bubble) continue;
      let a = xt(i);
      (t === null || a > n) && ((t = i), (n = a));
    }
    return t;
  }
  function Ct() {
    N.length = 0;
    for (let e = 0; e < A.length; e++) {
      let t = A[e];
      if (t && !t.leaving) {
        if (R) {
          let e = t.x - z,
            n = t.z - B;
          t.dist2 = e * e + n * n;
          let r = t.shown && G - t.shownAt < 2e3;
          t.rank = t.dist2 * (r ? he : t.shown ? me : 1);
        } else ((t.dist2 = e), (t.rank = e));
        N.push(t);
      }
    }
    (N.length > w && N.sort(ze), (U = 0));
    for (let e = 0; e < N.length; e++) {
      let t = N[e],
        n = e < w;
      (n && (U++, t.shown || (t.shownAt = G)), (t.shown = n));
    }
    q = 0;
    for (let e = 0; e < N.length; e++) {
      let t = N[e];
      t.shown && !t.rig && q++;
    }
    if (c) N.length = 0;
    else {
      if (N.length > 1) {
        for (let e = 0; e < N.length; e++) {
          let t = N[e];
          t.rank = t.dist2 * (t.plateOn ? me : 1);
        }
        N.sort(ze);
      }
      P.length = 0;
      for (let e = 0; e < N.length; e++) {
        let t = N[e],
          n = t.rig?.plate ?? null,
          r = t.shown && P.length < 12;
        if (r && R) {
          let e = Math.max(fe, n ? n.scale.x : 0),
            i = e * e;
          for (let e = 0; e < P.length; e++) {
            let n = P[e],
              a = n.x - t.x,
              o = n.z - t.z;
            if (a * a + o * o < i) {
              r = !1;
              break;
            }
          }
        }
        (r && P.push(t),
          t.plateOn !== r && ((t.plateOn = r), n && (n.visible = r), t.line && (t.line.sprite.visible = r)));
      }
      ((P.length = 0), (N.length = 0));
    }
  }
  function wt(e) {
    if (((C += Number.isFinite(e) ? Math.min(Math.max(e, 0), 1) : 0), C < 1)) return;
    let t = n.frameWorkMs ? n.frameWorkMs() : x,
      r = re.observe(t, C);
    ((C = 0), r !== w && ((w = r), (H = !0)));
  }
  function Tt(e, t, n) {
    ((e.anim = n), (t.anim = n), t.avatar.setState(n));
  }
  function Et(e, t) {
    let n = e.tx,
      r = e.tz;
    Number.isFinite(t.x) && Number.isFinite(t.z) && ((n = t.x), (r = t.z));
    let i = Number.isFinite(t.facing) ? L(t.facing) : e.tFacing,
      a = Ee(t.anim);
    if (n === e.tx && r === e.tz && i === e.tFacing && a === e.tAnim) return;
    let o = Math.hypot(n - e.tx, r - e.tz) > ie;
    ((e.tx = n), (e.tz = r), (e.tFacing = i), (e.tAnim = a));
    let s = e.rig;
    s
      ? o || Math.hypot(n - e.x, r - e.z) > ie
        ? (Ve(e, qe()), (e.x = n), (e.z = r), (e.facing = i), e.anim !== a && Tt(e, s, a))
        : He(e, qe(), n, r, i, a)
      : ((e.x = n), (e.z = r), (e.facing = i), (e.anim = a));
  }
  if (n.prewarm === !0) {
    let t = it({ name: `Sen`, gender: `nam`, robe: `lam` });
    (rt(t),
      t.fadeBody && (t.fadeBody.opacity = 0.5),
      t.fadeSkirt && (t.fadeSkirt.opacity = 0.5),
      (t.avatar.root.name = `remote:prewarm`),
      (t.avatar.root.visible = !1),
      e.add(t.avatar.root),
      (J = t));
  }
  function Dt(e, t, n, r) {
    if (I) return !1;
    let o = k.get(e);
    if (!o || o.leaving || !o.rig || !o.shown) return !1;
    let s = o.bubble;
    if (s?.key === t) return ((s.left = r), !0);
    if ((X(o), Ye >= 6)) {
      let e = St(o);
      if (!e || xt(e) <= xt(o)) return !1;
      X(e);
    }
    let { texture: c, aspect: l } = Qe(t, n),
      u = O.pop() ?? new i({ transparent: !0, depthWrite: !1, toneMapped: !1 });
    ((u.map = c), (u.opacity = 1));
    let d = new a(u);
    (d.center.set(0.5, 0), d.position.set(0, be, 0));
    let f = { sprite: d, material: u, aspect: l, key: t, age: 0, left: r, pop: 1, opacity: 1 };
    return (
      (d.onBeforeRender = (e, t, n) => {
        ((Xe = n), g(d, u, n, f.pop, f.aspect, f.opacity));
      }),
      (o.bubble = f),
      Ye++,
      o.rig.avatar.root.add(d),
      bt(o, f, 0),
      !0
    );
  }
  return {
    apply(e) {
      if (!I) {
        F++;
        for (let t = 0; t < e.length; t++) {
          let n = e[t];
          if (!n) continue;
          let r = k.get(n.id);
          if (!r) {
            A.length < ue && _t(n);
            continue;
          }
          ((r.gen = F), r.leaving && ((r.leaving = !1), (H = !0)));
          let i = r.rig;
          Et(r, n);
          let a = De(n.activity);
          a !== r.activity && pt(r, a);
          let o = n.mindful === !0;
          o !== r.mindful && mt(r, o);
          let s = Me(n),
            c = r.profile.level,
            l = m(n.profile.level),
            u = !je(r.profile, n.profile),
            d = l !== c,
            f = (h(n.profile.title) ? n.profile.title : void 0) !== r.profile.title;
          (u || d || f) && ((r.profile = ke(n.profile)), i && u && lt(i, r.profile));
          let p = s !== r.kol;
          ((r.kol = s), i && (u || d || p || f) && ct(r, i), d && ut(r, c, l), p && dt(r));
        }
        for (let e = 0; e < A.length; e++) {
          let t = A[e];
          t && t.gen !== F && !t.leaving && ((t.leaving = !0), X(t), (H = !0));
        }
      }
    },
    update(e, t) {
      if (I) return;
      J && at();
      let n = Number.isFinite(e) ? Math.min(Math.max(e, 0), ae) : 0,
        r = W(),
        i = Math.max(n * 1e3, r - Ke);
      ((Ke = r),
        (G += i),
        t && Number.isFinite(t.x) && Number.isFinite(t.z) && ((R = !0), (z = t.x), (B = t.z)),
        b && wt(e),
        (V += n),
        (H || V >= pe) && ((H = !1), (V = 0), Ct()),
        q > 0 && yt());
      let a = 1 - Math.exp(-10 * n),
        s = n / ge;
      for (let e = 0; e < A.length; e++) {
        let t = A[e];
        if (!t) continue;
        let r = t.rig;
        if (!r) {
          t.leaving && (st(e), e--);
          continue;
        }
        let o = t.leaving || !t.shown ? 0 : 1;
        if (
          (t.alpha !== o &&
            ((t.alpha = o > t.alpha ? Math.min(o, t.alpha + s) : Math.max(o, t.alpha - s)), gt(t, r)),
          t.alpha <= 0)
        ) {
          if (t.leaving) {
            (st(e), e--);
            continue;
          }
          if (!t.shown) {
            ot(t);
            continue;
          }
        }
        let c = We(t.gap) - t.delay;
        if (c > se || c < -20) {
          let e = ce * i;
          t.delay += c > e ? e : c < -e ? -e : c;
        }
        (Ue(t, G - t.delay, K),
          K.anim === `walk` && (K.x - t.x) * K.vx + (K.z - t.z) * K.vz < 0 && ((K.x = t.x), (K.z = t.z)),
          (t.x = K.x),
          (t.z = K.z),
          (t.facing = K.facing),
          K.anim !== t.anim && Tt(t, r, K.anim),
          (t.y += (u(t.anim, t.x, t.z) - t.y) * a));
        let l = r.avatar.root;
        (l.position.set(t.x, t.y, t.z), (l.rotation.y = t.facing));
        let d = t.alpha > 0;
        if (((l.visible = d), (l.userData.blobOpacity = t.alpha), !d)) {
          t.bubble && bt(t, t.bubble, n);
          continue;
        }
        let f = 0;
        (t.anim === `walk` && (f = Math.min(1, Math.max(0.35, K.speed / le))), (t.poseClock += n));
        let p = Be(t.dist2, R);
        (t.poseClock >= (t.poseDue < p ? t.poseDue : p) &&
          (r.avatar.update(Number.isFinite(t.poseClock) ? t.poseClock : n, f),
          (t.poseDue = p === t.poseBand ? p : p * t.poseFrac),
          (t.poseBand = p),
          (t.poseClock = 0)),
          t.line && ht(t, t.line),
          t.bubble && bt(t, t.bubble, n));
      }
      o?.update();
    },
    drawnCount() {
      return U;
    },
    eachAvatar(e) {
      for (let t = 0; t < A.length; t++) {
        let n = A[t];
        n.rig && e(n.rig.avatar, n.x, n.z, n.profile, n.id);
      }
    },
    showEmote(e, t) {
      Dt(e, `e:${t}`, l[t], _e);
    },
    showBubble: Dt,
    nameOf(e) {
      return k.get(e)?.profile.name;
    },
    clearBubbles() {
      for (let e of A) X(e);
    },
    setFrameCost(e) {
      I || ((x = e), (b = !0));
    },
    dispose() {
      if (!I) {
        at();
        for (let e = A.length - 1; e >= 0; e--) st(e);
        (Q?.dispose(), (Q = null));
        for (let e of T) e.avatar.dispose();
        T.length = 0;
        for (let e of E) e.dispose();
        for (let e of D) e.dispose();
        ((E.length = 0), (D.length = 0));
        for (let e of O) e.dispose();
        O.length = 0;
        for (let e of j.values()) e.texture.dispose();
        for (let e of M.values()) e.texture.dispose();
        (j.clear(), M.clear(), (N.length = 0), (Xe = null), (I = !0));
      }
    },
  };
}
export { re as t };
