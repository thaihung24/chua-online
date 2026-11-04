import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { gt as t, wt as n } from "./index-e_Bx6V48.js";
import { F as r, L as i, R as a } from "./three-BbSp8N3g.js";
var o = `Quét lá đa`,
  s = `Xong`,
  c = `Xong, cất chổi`,
  l = 16.5;
function u(e, t, n = !1) {
  return e < t
    ? `Hôm nay đã quét ${e}/${t} lá`
    : `Hôm nay: ${t} ✓ · thêm ${e - t} lá${n ? ` · đủ tinh tấn` : ``}`;
}
function d(e, t) {
  return t > 0 ? Math.round((Math.min(Math.max(e, 0), t) / t) * 100) : 0;
}
function f(e, n) {
  let r = document.createElement(`div`);
  ((r.className = `hud-glass sweep-pill`),
    r.setAttribute(`role`, `group`),
    r.setAttribute(`aria-label`, o),
    (r.hidden = !0));
  let i = document.createElement(`span`);
  ((i.className = `sweep-pill__icon`),
    (i.innerHTML = `<svg class="sweep-pill__ring" viewBox="0 0 36 36" aria-hidden="true" focusable="false"><circle class="sweep-pill__track" cx="18" cy="18" r="${l}" pathLength="100"/><circle class="sweep-pill__fill" cx="18" cy="18" r="${l}" pathLength="100" stroke-dasharray="0 100"/></svg>${t(`broom`)}`));
  let a = i.querySelector(`.sweep-pill__fill`),
    f = document.createElement(`span`);
  ((f.className = `sweep-pill__text`),
    f.setAttribute(`role`, `status`),
    f.setAttribute(`aria-live`, `polite`),
    f.setAttribute(`aria-atomic`, `true`));
  let p = document.createElement(`i`);
  ((p.className = `sweep-pill__sep`), p.setAttribute(`aria-hidden`, `true`));
  let m = document.createElement(`button`);
  ((m.type = `button`),
    (m.className = `hud-note__btn sweep-pill__done`),
    (m.textContent = s),
    m.setAttribute(`aria-label`, c),
    m.addEventListener(`click`, () => n.onDone()),
    r.append(i, f, p, m),
    e.append(r));
  let h = ``,
    g = (e, t, n = !1) => {
      let r = u(e, t, n);
      r !== h && ((h = r), (f.textContent = r), a?.setAttribute(`stroke-dasharray`, `${d(e, t)} 100`));
    };
  return {
    element: r,
    show(e, t, n) {
      (g(e, t, n), (r.hidden = !1));
    },
    set: g,
    hide() {
      r.hidden = !0;
    },
    dispose() {
      r.remove();
    },
  };
}
function p(e, t) {
  e.computeBoundingSphere();
  let n = t === `low` ? new i({ vertexColors: !0 }) : new a({ vertexColors: !0, roughness: 0.85 }),
    o = new r(e, n);
  return (
    (o.name = `hand-broom`),
    (o.castShadow = !1),
    (o.receiveShadow = t !== `low`),
    (o.userData.noShadow = !0),
    o
  );
}
function m(e) {
  (e.removeFromParent(), e.geometry.dispose(), e.material.dispose());
}
function h() {
  return { x: 0, y: 0, z: 0, yaw: 0, tilt: 0, roll: 0, k: 1 };
}
var g = 0.9,
  _ = 0.95,
  v = 0.45,
  y = 0.28,
  b = 0.12,
  x = 0.55,
  S = 0.55,
  C = 2.4,
  w = 1.4,
  T = 2,
  E = 0.35,
  D = Math.PI * 2,
  O = (e) => e * e * (3 - 2 * e),
  k = (e) => (e < 0 ? 0 : e > 1 ? 1 : e);
function ee(e, t, n, r, i, a, o) {
  let s = k(r),
    c = 1 - (1 - s) ** 3,
    l = (a ? v : _) * c,
    u = a ? 0 : b * i * Math.sin(Math.PI * s);
  return (
    (o.x = e.x + t * l - n * u),
    (o.z = e.z + n * l + t * u),
    (o.y = e.y + (a ? 0 : y * Math.sin(Math.PI * k(s * 1.25)))),
    (o.yaw = e.yaw + (a ? 0 : 3.4 * i * c)),
    (o.tilt = a ? 0 : 1.1 * Math.sin(D * s) * (1 - s)),
    (o.roll = a ? 0 : 0.7 * i * Math.sin(Math.PI * k(s * 1.5))),
    (o.k = s <= S ? 1 : 1 - O((s - S) / 0.44999999999999996)),
    o
  );
}
function te(e) {
  return (A(e, 4) * 2 - 1) * x;
}
function A(e, t) {
  let n = Math.imul(e + 1, 2654435761) ^ Math.imul(t + 7, 2246822507);
  return ((n ^= n >>> 13), (n = Math.imul(n, 3266489909)), (n ^= n >>> 16), (n >>> 0) / 4294967296);
}
var ne = 0.8;
function j(e, t = 7) {
  return {
    delay: A(e, 0) * t,
    seconds: 4 + A(e, 1) * T,
    height: C + A(e, 2) * w,
    phase: A(e, 3) * Math.PI * 2,
  };
}
function M(e, t, n, r) {
  let i = (n - t.delay) / t.seconds;
  if (i >= 1)
    return (
      (r.x = e.x),
      (r.y = e.y),
      (r.z = e.z),
      (r.yaw = e.yaw),
      (r.tilt = 0),
      (r.roll = 0),
      (r.k = 1),
      !0
    );
  if (i < 0) return ((r.k = 0), !1);
  let a = 1 - i,
    o = Math.sin(t.phase + i * Math.PI * 5);
  return (
    (r.x = e.x + E * a * o),
    (r.z = e.z + E * 0.6 * a * Math.cos(t.phase + i * Math.PI * 3.4)),
    (r.y = e.y + t.height * (1 - O(i))),
    (r.yaw = e.yaw + a * 1.6 * Math.sin(t.phase + i * 4)),
    (r.tilt = 0.7 * a * o),
    (r.roll = 0.5 * a * Math.cos(t.phase + i * Math.PI * 5)),
    (r.k = 1),
    !1
  );
}
var N = 0.05,
  P = 0.32;
function F(e) {
  let t = null,
    n = null,
    r = -1 / 0,
    i = new Set(),
    a = (e) => {
      if (t && n === e) return t;
      let r = Math.ceil(e.sampleRate * P),
        i = e.createBuffer(1, r, e.sampleRate),
        a = i.getChannelData(0),
        o = 2654435769;
      for (let e = 0; e < r; e++)
        ((o ^= o << 13), (o ^= o >>> 17), (o ^= o << 5), (a[e] = ((o >>> 0) / 4294967296) * 2 - 1));
      return ((t = i), (n = e), i);
    };
  return {
    play() {
      if (e.isMuted() || (e.getSfxVolume?.() ?? 1) <= 0) return !1;
      let t = e.getOutput?.(`sfx`) ?? null;
      if (!t) return !1;
      let { ctx: n, destination: o } = t,
        s = n.currentTime;
      if (s - r < 0.16) return !1;
      let c = N;
      r = s;
      try {
        let e = n.createBufferSource();
        ((e.buffer = a(n)), (e.playbackRate.value = 0.9 + Math.random() * 0.25));
        let t = n.createBiquadFilter();
        ((t.type = `bandpass`),
          (t.Q.value = 0.9),
          t.frequency.setValueAtTime(3400, s),
          t.frequency.exponentialRampToValueAtTime(1100, s + P * 0.85));
        let r = n.createGain();
        return (
          r.gain.setValueAtTime(1e-4, s),
          r.gain.exponentialRampToValueAtTime(c, s + 0.04),
          r.gain.exponentialRampToValueAtTime(1e-4, s + P),
          e.connect(t),
          t.connect(r),
          r.connect(o),
          i.add(e),
          (e.onended = () => {
            (i.delete(e), e.disconnect(), t.disconnect(), r.disconnect());
          }),
          e.start(s),
          e.stop(s + P + 0.02),
          !0
        );
      } catch {
        return !1;
      }
    },
    dispose() {
      for (let e of i)
        try {
          e.stop();
        } catch {}
      (i.clear(), (t = null), (n = null));
    },
  };
}
var I = 2e4,
  L = `sweep`;
function re(e, t = I) {
  let n = 0,
    r = null,
    i = (t, n) => e(L, { action: t, ...n }),
    a = () => {
      if ((r !== null && clearTimeout(r), (r = null), n === 0)) return;
      let e = n;
      ((n = 0), i(`leaf`, { count: e }));
    };
  return {
    start: (e) => i(`start`, { count: e }),
    leaf() {
      ((n += 1), (r ??= setTimeout(a, t)));
    },
    waveDone(e) {
      (a(), i(`wave_done`, { swept: e }));
    },
    dayDone(e) {
      (a(), i(`day_done`, { swept: e }));
    },
    flush: a,
    dispose: a,
  };
}
var R = e({
    SWEEP_BELL_VOLUME: () => B,
    SWEEP_DAY_EVENT: () => V,
    SWEEP_DONE_TOAST: () => U,
    SWEEP_FULL_TOAST: () => W,
    SWEEP_MILESTONES: () => G,
    SWEEP_REACH: () => z,
    SWEEP_ROUND: () => 36,
    SWEEP_START_TOAST: () => H,
    SWEEP_XP_ROUNDS: () => 20,
    TOP_UP_S: () => 1,
    createSweepController: () => X,
  }),
  z = 1.1,
  B = 0.35,
  V = `sweepDay`,
  ie = (e, t) => e.includes(t),
  H = `Đã cầm chổi. Thong thả đi qua chỗ lá rụng để quét.`,
  U = `Đủ 108 lá hôm nay. Tâm cũng nhẹ như lá. Quét tiếp vẫn được tinh tấn.`,
  W = `Đã đủ tinh tấn quét lá hôm nay, vẫn quét tiếp được.`,
  G = [
    [36, `Đã quét một phần ba số lá hôm nay.`],
    [72, `Đã quét hai phần ba số lá hôm nay. Thong thả thôi.`],
  ],
  K = 0,
  q = 1,
  J = 2,
  Y = 3,
  ae = [`yard`, `front`, `bodhi`];
function X(e) {
  let { leaves: t, player: r, days: i, goal: a } = e,
    o = re(e.track ?? n),
    s = t.mesh.count,
    c = new Uint8Array(s),
    l = new Float32Array(s),
    u = new Float32Array(s),
    d = new Float32Array(s),
    _ = new Int8Array(s),
    v = new Int32Array(s),
    y = Array.from({ length: s }, (e, t) => j(t)),
    b = new Int16Array(s),
    x = 0,
    S = h(),
    C = !1,
    w = !1,
    T = 0,
    E = 0,
    D = null,
    O = null,
    k = null,
    A = () => i.current().swept,
    N = (e) => e >= 720,
    P = () => O?.set(A(), a, N(A())),
    I = (e) => c[e] === q || c[e] === Y;
  function L(n, r) {
    e.calm
      ? (t.rest(n), (c[n] = q))
      : (t.hide(n), (c[n] = Y), (l[n] = 0), (y[n] = j(v[n] ?? n, r)), (b[x++] = n));
  }
  function R(e) {
    let n = c.indexOf(K);
    return n < 0 || !t.spawn(n, e, r.state.x, r.state.z) ? !1 : ((v[n] = T++), L(n, ne), !0);
  }
  function X(e) {
    x = 0;
    let n = t.spots();
    for (let t = 0; t < s; t++) ((v[t] = T++), (c[t] = n[t] ? q : K), e && n[t] && L(t, 7));
    t.commit();
  }
  function Z() {
    let e = t.spots(),
      n = !1;
    for (let r = 0; r < s; r++)
      c[r] !== K && !e[r]
        ? (c[r] = K)
        : c[r] === K && e[r] && (t.rest(r), (c[r] = q), (v[r] = T++), (n = !0));
    for (let r of ae) {
      let i = t.area(r);
      if (!i) continue;
      let a = 0;
      for (let t = 0; t < s; t++) I(t) && e[t]?.at === r && (a += 1);
      for (; a < i.n && R(r);) ((a += 1), (n = !0));
    }
    n && t.commit();
  }
  function Q(t) {
    C !== t && ((C = t), e.onActiveChange?.(t));
  }
  function oe(n) {
    let s = t.spots()[n];
    if (!s) return;
    ((c[n] = J), (l[n] = 0), (b[x++] = n));
    let f = s.x - r.state.x,
      p = s.z - r.state.z,
      m = Math.hypot(f, p);
    m < 0.001 ? ((f = -Math.sin(r.state.facing)), (p = -Math.cos(r.state.facing))) : ((f /= m), (p /= m));
    let h = v[n] ?? n,
      g = e.calm ? 0 : te(h);
    ((u[n] = f * Math.cos(g) - p * Math.sin(g)),
      (d[n] = f * Math.sin(g) + p * Math.cos(g)),
      (_[n] = h & 1 ? -1 : 1));
    let y = i.current(),
      S = i.set({ day: y.day, swept: y.swept + 1 }),
      C = S.swept;
    if (
      (P(),
      (k ??= F(e.audio)).play(),
      o.leaf(),
      e.onLeaf({ swept: C, total: a, round: Math.floor((C - 1) / 36) }),
      C % 36 == 0 &&
        (o.waveDone(C),
        e.progress.bump(`sweep`, 1),
        e.onRoundComplete({ round: C / 36 - 1, total: 36, day: S.day })),
      C === a)
    )
      se(S);
    else if (C === 720) e.toast(W);
    else {
      let t = G.find(([e]) => e === C)?.[1];
      t && e.toast(t);
    }
    R(s.at) && t.commit();
  }
  function se(t) {
    (o.dayDone(t.swept),
      ie(e.kinds, `sweepDay`) && e.progress.bump(V, 1),
      e.onDayComplete({ day: t.day, swept: t.swept }),
      e.onDayDone?.(!0),
      e.toast(U),
      e.audio.play(`khanh`, { volume: B }));
  }
  function ce(n) {
    if (x === 0) return;
    let r = t.spots();
    for (let i = x - 1; i >= 0; i--) {
      let a = b[i] ?? 0,
        o = c[a],
        s = r[a],
        f = !s || (o !== J && o !== Y);
      if (s && o === J) {
        let r = (l[a] = (l[a] ?? 0) + n / g);
        r >= 1
          ? (t.put(a, null), t.hide(a), (c[a] = K), (f = !0))
          : ee(s, u[a] ?? 0, d[a] ?? 0, r, _[a] ?? 1, e.calm, S);
      } else if (s && o === Y) {
        let e = (l[a] = (l[a] ?? 0) + n);
        M(s, y[a], e, S) && (t.rest(a), (c[a] = q), (f = !0));
      }
      f ? (b[i] = b[--x] ?? 0) : t.pose(a, S.x, S.y, S.z, S.yaw, S.tilt, S.roll, S.k);
    }
    t.commit();
  }
  function le() {
    if (!C || r.state.anim !== `walk`) return;
    let { x: e, z: n } = r.state,
      i = t.spots(),
      a = z * z;
    for (let t = 0; t < s; t++) {
      if (c[t] !== q) continue;
      let r = i[t];
      if (!r) continue;
      let o = r.x - e,
        s = r.z - n;
      o * o + s * s <= a && oe(t);
    }
  }
  let $ = {
    active: () => C,
    start() {
      return (
        !w &&
        (C ||
          ((D ??= p(e.broomGeometry(), e.quality)),
          e.carry(D),
          (O ??= f(e.host(), { onDone: () => $.stop() })),
          O.show(A(), a, N(A())),
          o.start($.remaining()),
          e.toast(H),
          Q(!0)),
        !0)
      );
    },
    stop() {
      C && (e.carry(null), O?.hide(), o.flush(), Q(!1));
    },
    update(e) {
      if (w) return;
      let t = Number.isFinite(e) && e > 0 ? Math.min(e, 0.1) : 0;
      (le(), ce(t), (E += t), E >= 1 && ((E = 0), Z()));
    },
    refill() {
      w || Z();
    },
    renew() {
      w || (t.layout(i.current().day), X(!0), P());
    },
    remaining() {
      let e = t.spots(),
        n = 0;
      for (let t = 0; t < s; t++) I(t) && e[t] && (n += 1);
      return n;
    },
    day: () => i.current(),
    dispose() {
      w || ($.stop(), (w = !0), o.dispose(), k?.dispose(), O?.dispose(), D && m(D), (D = null), (O = null));
    },
  };
  return (X(!1), Z(), $);
}
export { R as t };
