import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import {
  Ft as t,
  It as n,
  Lt as r,
  Rt as i,
  Xt as a,
  c as o,
  l as s,
  s as c,
  u as l,
  wt as u,
} from "./index-e_Bx6V48.js";
import {
  a as d,
  c as f,
  i as p,
  l as m,
  n as h,
  o as g,
  r as _,
  s as v,
  u as y,
} from "./music-mix-9H0C50bM.js";
import { _t as b, gt as x } from "./app-z_oU8L_u.js";
var S = e({ createAmbience: () => oe }),
  C = 1.5,
  w = 0.3,
  T = 200,
  E = 1.5,
  D = 0.45,
  O = 30,
  k = 110,
  A = 0.7,
  j = 24,
  M = 3,
  N = 3e3,
  P = 1e-4,
  F = 22050,
  I = 3,
  L = 1.4,
  R = [1, 0.72, 0.72, 0.72, 0.72, 0.9],
  z = {
    wind: 0.13,
    drone: 0.02,
    hum: 0.048,
    bird: 0.05,
    farKnock: 0.1,
    bell: 0.043,
    chantKnock: 0.15,
    chantSource: 0.7,
    loopBell: 0.05,
  },
  B = [
    { type: `sine`, freq: 55, amp: 0.5 },
    { type: `sine`, freq: 110, amp: 1 },
    { type: `sine`, freq: 110.35, amp: 0.7 },
    { type: `sine`, freq: 164.8, amp: 0.45 },
    { type: `triangle`, freq: 220.4, amp: 0.1 },
  ],
  V = [
    { ratio: 1, amp: 1, decay: 7, beat: 0.5 },
    { ratio: 2, amp: 0.5, decay: 5 },
    { ratio: 2.4, amp: 0.3, decay: 4 },
    { ratio: 3, amp: 0.2, decay: 3.5 },
    { ratio: 4.1, amp: 0.1, decay: 2.5 },
  ],
  ee = (e) => Math.min(1, Math.max(0, e)),
  te = (e, t, n) => Math.min(n, Math.max(t, e));
function H(e, t) {
  let n = Math.floor(F * I),
    r = Math.floor(F * 0.25),
    i = new Float32Array(71662),
    a = 0,
    o = 0,
    s = 0,
    c = 0;
  for (let e = 0; e < i.length; e += 1) {
    let n = t() * 2 - 1;
    ((a = 0.99765 * a + n * 0.099046), (o = 0.963 * o + n * 0.2965164), (s = 0.57 * s + n * 1.0526913));
    let r = a + o + s + n * 0.1848;
    ((i[e] = r), (c = Math.max(c, Math.abs(r))));
  }
  let l = e.createBuffer(1, n, F),
    u = l.getChannelData(0),
    d = c > 0 ? 0.9 / c : 1;
  for (let e = 0; e < n; e += 1) {
    let t = i[e] ?? 0;
    if (e < r) {
      let a = Math.sin((e / r) * (Math.PI / 2)),
        o = Math.cos((e / r) * (Math.PI / 2));
      t = t * a + (i[n + e] ?? 0) * o;
    }
    u[e] = t * d;
  }
  return l;
}
function ne(e, t) {
  let n = e.sampleRate,
    r = Math.max(1, Math.floor(n * L)),
    i = e.createBuffer(1, r, n),
    a = i.getChannelData(0),
    o = 0;
  for (let e = 0; e < r; e += 1) {
    let n = e / r;
    ((o += (t() * 2 - 1 - o) * (0.6 - 0.5 * n)), (a[e] = o * (1 - n) ** 2.5));
  }
  return i;
}
var U = class {
    constructor(e) {
      (t(this, `ctx`, void 0),
        t(this, `nodes`, []),
        t(this, `sources`, []),
        t(this, `done`, !1),
        (this.ctx = e));
    }
    track(e) {
      return (this.nodes.push(e), e);
    }
    gain(e) {
      let t = this.track(this.ctx.createGain());
      return ((t.gain.value = e), t);
    }
    filter(e, t, n) {
      let r = this.track(this.ctx.createBiquadFilter());
      return ((r.type = e), (r.frequency.value = t), (r.Q.value = n), r);
    }
    osc(e, t) {
      let n = this.track(this.ctx.createOscillator());
      return ((n.type = e), (n.frequency.value = t), n);
    }
    lfo(e, t, n) {
      let r = this.osc(`sine`, e),
        i = this.gain(n);
      (r.connect(i), i.connect(t), this.run(r));
    }
    run(e, t = 0, n) {
      (n === void 0 ? e.start(t) : e.start(t, n), this.sources.push(e));
    }
    dispose() {
      if (!this.done) {
        this.done = !0;
        for (let e of this.sources) {
          e.onended = null;
          try {
            e.stop();
          } catch {}
        }
        for (let e of this.nodes)
          try {
            e.disconnect();
          } catch {}
      }
    }
  },
  re = class extends U {
    constructor(e, n, r, i, a, o) {
      if (
        (super(e),
        t(this, `noise`, void 0),
        t(this, `rand`, void 0),
        t(this, `onDone`, void 0),
        t(this, `out`, void 0),
        t(this, `live`, 0),
        (this.noise = i),
        (this.rand = a),
        (this.onDone = o),
        (this.out = this.gain(1)),
        r !== 0 && typeof e.createStereoPanner == `function`)
      ) {
        let t = this.track(e.createStereoPanner());
        ((t.pan.value = r), this.out.connect(t), t.connect(n));
      } else this.out.connect(n);
    }
    begin(e, t) {
      ((e.onended = () => {
        (--this.live, this.live <= 0 && this.dispose());
      }),
        e.stop(t),
        this.sources.push(e),
        (this.live += 1));
    }
    tone(e, t) {
      let n = this.gain(0),
        r = Math.max(e.beat ? e.peak / 2 : e.peak, P),
        i = e.attack + e.decay;
      (n.gain.setValueAtTime(P, t),
        n.gain.linearRampToValueAtTime(r, t + e.attack),
        n.gain.exponentialRampToValueAtTime(P, t + i),
        n.connect(this.out));
      let a = t + i + 0.05,
        o = (r) => {
          let o = this.osc(e.type, r);
          (o.frequency.setValueAtTime(r, t),
            e.to !== void 0 && o.frequency.exponentialRampToValueAtTime(e.to, t + (e.glide ?? i)),
            o.connect(n),
            o.start(t),
            this.begin(o, a));
        };
      (o(e.freq), e.beat && o(e.freq + e.beat));
    }
    click(e, t, n) {
      let r = this.track(this.ctx.createBufferSource());
      r.buffer = this.noise;
      let i = this.filter(`bandpass`, t, 1.4),
        a = this.gain(0);
      (a.gain.setValueAtTime(P, e),
        a.gain.linearRampToValueAtTime(Math.max(n, P), e + 0.001),
        a.gain.exponentialRampToValueAtTime(P, e + 0.015),
        r.connect(i),
        i.connect(a),
        a.connect(this.out),
        r.start(e, this.rand() * Math.max(0, this.noise.duration - 0.2)),
        this.begin(r, e + 0.05));
    }
    cricket(e, t, n, r, i) {
      let a = this.gain(0);
      a.gain.setValueAtTime(0, e);
      let o = e;
      for (let e = 0; e < r; e += 1) {
        for (let e = 0; e < 3; e += 1) {
          let t = o + e * 0.06;
          (a.gain.setValueAtTime(0, t),
            a.gain.linearRampToValueAtTime(n, t + 0.006),
            a.gain.linearRampToValueAtTime(0, t + 0.03));
        }
        o += i;
      }
      a.connect(this.out);
      let s = this.osc(`sine`, t);
      (s.connect(a), s.start(e), this.begin(s, o + 0.1));
    }
    dispose() {
      this.done || (super.dispose(), this.onDone(this));
    }
  },
  ie = class extends U {
    constructor(e, n, r, i, a, o, s) {
      (super(e),
        t(this, `mode`, void 0),
        t(this, `noise`, void 0),
        t(this, `rand`, void 0),
        t(this, `fade`, void 0),
        t(this, `mix`, void 0),
        t(this, `far`, void 0),
        t(this, `mid`, void 0),
        t(this, `air`, void 0),
        t(this, `voices`, new Set()),
        t(this, `gust`, null),
        t(this, `synth`, !1),
        t(this, `media`, null),
        t(this, `lastKnock`, null),
        t(this, `next`, { gust: 0, bird: 0, ambient: 0, knock: 0 }),
        t(this, `retireTimer`, null),
        (this.mode = r),
        (this.noise = i),
        (this.rand = a),
        (this.fade = this.gain(0)),
        (this.mix = this.gain(s)),
        this.mix.connect(this.fade),
        this.fade.connect(n));
      let c = this.gain(1);
      ((this.far = this.filter(`lowpass`, 1100, 0.5)),
        (this.mid = this.filter(`lowpass`, 2400, 0.5)),
        (this.air = this.filter(`lowpass`, 6500, 0.5)));
      for (let e of [this.far, this.mid, this.air]) e.connect(c);
      let l = this.gain(o ? 0.8 : 1);
      if ((c.connect(l), l.connect(this.mix), o)) {
        let t = this.track(e.createConvolver());
        t.buffer = o;
        let n = this.gain(0.7);
        (c.connect(t), t.connect(n), n.connect(this.mix));
      }
    }
    voice(e, t) {
      if (this.done || this.voices.size >= j) return null;
      let n = new re(this.ctx, e, t, this.noise, this.rand, (e) => this.voices.delete(e));
      return (this.voices.add(n), n);
    }
    dispose() {
      if (this.done) return;
      (this.retireTimer !== null && clearTimeout(this.retireTimer), (this.retireTimer = null));
      for (let e of [...this.voices]) e.dispose();
      let e = this.media;
      if (((this.media = null), e)) {
        try {
          e.el.pause();
        } catch {}
        try {
          e.node.disconnect();
        } catch {}
      }
      super.dispose();
    }
  };
function ae(e, t, n, r) {
  try {
    let i = t.currentTime;
    (e.cancelScheduledValues(i), e.setValueAtTime(e.value, i), e.linearRampToValueAtTime(n, i + r));
  } catch {}
}
function oe(e, t = {}) {
  let n = t.random ?? Math.random,
    r = (e, t) => e + n() * (t - e),
    i = t.doc === void 0 ? (typeof document < `u` ? document : null) : t.doc,
    a = t.reverb !== !1,
    o = (e) => 60 / te(Number.isFinite(e) ? e : 60, O, k),
    s = 0,
    c = C,
    l = o(t.chantBpm ?? 60),
    u = () => {
      if (!t.bpm) return l;
      try {
        return o(t.bpm());
      } catch {
        return l;
      }
    },
    d = t.layer === `mo`,
    f = d ? Math.max(0, Math.floor(t.bellEvery ?? 0)) : 0,
    p = () => e.getOutput?.(t.bus ?? (d ? `mo` : void 0)) ?? null,
    m =
      t.createAudio ??
      ((e) => {
        let t = new Audio();
        return ((t.crossOrigin = `anonymous`), (t.src = e), t);
      }),
    h = !1,
    g = `nature`,
    _ = A,
    v = null,
    y = !1,
    b = null,
    x = !1,
    S = !1,
    j = null,
    P = -1 / 0,
    F = new Set(),
    L = null,
    U = () => i?.hidden === !0;
  function re(e) {
    if (L && L.ctx === e) return L;
    let t = null;
    if (a && typeof e.createConvolver == `function`)
      try {
        t = ne(e, n);
      } catch {
        t = null;
      }
    return ((L = { ctx: e, noise: H(e, n), impulse: t }), L);
  }
  function oe(e, t) {
    let r = e.gain(0.7);
    (r.connect(e.mix), (e.gust = r));
    let i = (i, a, o, s, c, l, u) => {
      let d = e.track(e.ctx.createBufferSource());
      ((d.buffer = e.noise), (d.loop = !0), (d.playbackRate.value = s));
      let f = e.filter(i, a, o),
        p = e.gain(c * t * z.wind);
      return (
        d.connect(f),
        f.connect(p),
        p.connect(r),
        e.lfo(l, p.gain, u * t * z.wind),
        e.run(d, 0, n() * I),
        f
      );
    };
    i(`lowpass`, 360, 0.4, 0.85, 1, 0.063, 0.5);
    let a = i(`bandpass`, 650, 1.1, 1, 0.4, 0.091, 0.3);
    e.lfo(0.043, a.frequency, 200);
  }
  function W(e, t) {
    let n = e.gain(z.drone * t),
      r = e.filter(`lowpass`, 520, 0.5);
    (r.connect(n), n.connect(e.mix), e.lfo(0.05, n.gain, z.drone * t * 0.4));
    for (let t of B) {
      let n = e.osc(t.type, t.freq),
        i = e.gain(t.amp * 0.4);
      (n.connect(i), i.connect(r), e.run(n));
    }
  }
  function G(e) {
    let t = e.gain(z.hum * 0.55),
      r = e.filter(`lowpass`, 520, 0.7);
    (r.connect(t), t.connect(e.mix), e.lfo(1 / (12 * u()), t.gain, z.hum * 0.45));
    for (let [t, i] of [
      [110, 1],
      [164.9, 0.55],
      [220.3, 0.3],
    ]) {
      let a = e.osc(`triangle`, t);
      e.lfo(4.6 + n() * 0.6, a.frequency, t * 0.004);
      let o = e.gain(i * 0.5);
      (a.connect(o), o.connect(r), e.run(a));
    }
  }
  function K(e, t, n, i, a) {
    let o = e.voice(i, a);
    if (!o) return;
    let s = r(390, 500);
    (o.click(t, r(1e3, 1900), n * 0.4),
      o.tone(
        { type: `sine`, freq: s * 1.3, to: s, glide: 0.035, peak: n, attack: 0.002, decay: r(0.12, 0.18) },
        t,
      ),
      o.tone({ type: `triangle`, freq: s * r(2, 2.3), peak: n * 0.22, attack: 0.001, decay: 0.05 }, t));
  }
  function se(e, t) {
    let n = e.voice(e.mid, r(-0.5, 0.5));
    if (!n) return;
    let i = r(165, 180);
    for (let e of V)
      n.tone(
        {
          type: `sine`,
          freq: i * e.ratio,
          peak: z.bell * e.amp,
          attack: 0.02,
          decay: e.decay,
          ...(e.beat !== void 0 && { beat: e.beat }),
        },
        t,
      );
  }
  function ce(e, t) {
    let i = r(-0.7, 0.7),
      a = z.farKnock,
      o = (t, n) => K(e, t, a * n * r(0.8, 1), e.far, i),
      s = n(),
      c = t;
    if (s < 0.4) {
      let e = r(0.62, 0.8);
      for (let t = 0, r = 4 + Math.floor(n() * 5); t < r; t += 1, c += e) o(c, 1);
    } else if (s < 0.75) {
      let e = 0.95;
      for (let t = 0, r = 6 + Math.floor(n() * 4); t < r; t += 1, e *= 0.86)
        (o(c, 0.85 + (t / r) * 0.15), (c += e));
      o(c + 0.5, 0.9);
    } else for (let e = 0, t = 3 + Math.floor(n() * 2); e < t; e += 1, c += 0.95) (o(c, 1), o(c + 0.3, 0.8));
  }
  function le(e, t, i) {
    e.voice(e.air, r(-0.8, 0.8))?.cricket(
      t,
      r(4300, 4900),
      z.bird * 0.45 * i,
      3 + Math.floor(n() * 4),
      r(0.42, 0.6),
    );
  }
  function ue(e, t, i) {
    let a = e.voice(e.air, r(-0.8, 0.8));
    if (!a) return;
    let o = r(2300, 3400),
      s = t;
    for (let e = 0, t = 2 + Math.floor(n() * 4); e < t; e += 1) {
      let e = r(0.06, 0.12),
        t = o * (n() < 0.6 ? r(1.15, 1.4) : r(0.7, 0.88));
      (a.tone(
        { type: `sine`, freq: o, to: t, glide: e, peak: z.bird * r(0.6, 1) * i, attack: 0.008, decay: e },
        s,
      ),
        (s += e + r(0.05, 0.14)),
        (o *= r(0.92, 1.08)));
    }
  }
  function q(e, t, i) {
    let a = e.voice(e.far, r(-0.6, 0.6));
    if (!a) return;
    let o = r(560, 640),
      s = t,
      c = z.bird * 0.8 * i;
    for (let e = 0, t = 3 + Math.floor(n() * 3); e < t; e += 1, s += 1.1, o *= 1.03)
      (a.tone({ type: `sine`, freq: o, to: o * 1.08, glide: 0.25, peak: c, attack: 0.03, decay: 0.22 }, s),
        a.tone(
          { type: `sine`, freq: o * 1.35, to: o * 1.3, glide: 0.38, peak: c, attack: 0.03, decay: 0.35 },
          s + 0.3,
        ));
  }
  function J(e, t) {
    let r = e.mode === `chant` ? 0.5 : 1,
      i = n();
    i < 0.5 ? le(e, t, r) : i < 0.85 ? ue(e, t, r) : q(e, t, r);
  }
  function de(e, t) {
    let n = e.gust?.gain;
    if (n)
      try {
        (n.setTargetAtTime(r(0.95, 1.35), t, 1.6), n.setTargetAtTime(0.7, t + r(4.5, 6.5), 2.2));
      } catch {}
  }
  function fe(e, t) {
    let n = e.voice(e.mid, 0);
    if (!n) return;
    let i = r(312, 326);
    for (let e of V)
      n.tone(
        {
          type: `sine`,
          freq: i * e.ratio,
          peak: z.loopBell * e.amp,
          attack: 0.004,
          decay: e.decay * 0.85,
          ...(e.beat !== void 0 && { beat: e.beat }),
        },
        t,
      );
  }
  function pe(e, t) {
    let n = R[s % R.length] ?? 0.7;
    (f > 0 && s % f === 0 && fe(e, t), K(e, t, z.chantKnock * n * r(0.92, 1), e.mid, 0), (s += 1));
  }
  function Y(e) {
    let t = e.ctx.currentTime,
      i = t + E;
    if (e.synth) {
      let n = e.lastKnock === null ? e.next.knock : e.lastKnock + u();
      n < t - 0.05 && (n = t + 0.05);
      let i = t + (U() || (typeof document < `u` && document.hidden) ? E : D);
      for (; n < i;) (pe(e, Math.max(t, n + r(-0.006, 0.006))), (e.lastKnock = n), (n += u()));
    }
    if (e.next.bird < i) {
      let n = Math.max(t, e.next.bird);
      (J(e, n), (e.next.bird = n + (e.mode === `chant` ? r(10, 20) : r(5, 11))));
    }
    if (e.next.ambient < i) {
      let i = Math.max(t, e.next.ambient);
      e.mode === `nature`
        ? (n() < 0.65 ? ce(e, i) : se(e, i), (e.next.ambient = i + r(20, 40)))
        : (se(e, i), (e.next.ambient = i + r(40, 70)));
    }
    if (e.next.gust < i) {
      let n = Math.max(t, e.next.gust);
      (de(e, n), (e.next.gust = n + r(8, 16)));
    }
  }
  function X(e) {
    let t = e.media;
    if (t && !t.failed) {
      t.lastTry = Date.now();
      try {
        t.el.play()?.catch(() => void 0);
      } catch {}
    }
  }
  function me(e, t) {
    e.synth || e.mode !== `chant` || ((e.synth = !0), (e.next.knock = t + (d ? 0.3 : 1.2)), d || G(e));
  }
  function he(e, t) {
    if (typeof e.ctx.createMediaElementSource != `function`) return !1;
    let n = null;
    try {
      ((n = m(t)), (n.loop = !0), (n.preload = `auto`));
      let r = e.ctx.createMediaElementSource(n),
        i = e.gain(z.chantSource);
      (r.connect(i), i.connect(e.mix));
      let a = { el: n, node: r, failed: !1, lastTry: 0 };
      return (
        (e.media = a),
        n.addEventListener(`error`, () => {
          e.media !== a || a.failed || ((a.failed = !0), me(e, e.ctx.currentTime));
        }),
        X(e),
        !0
      );
    } catch {
      try {
        n?.pause();
      } catch {}
      return !1;
    }
  }
  function Z(e, t) {
    let { ctx: i, destination: a } = e,
      o = null;
    try {
      let { noise: e, impulse: s } = re(i);
      o = new ie(i, a, t, e, n, s, _);
      let c = i.currentTime,
        l = t === `chant`;
      return d
        ? ((o.next.gust = o.next.bird = o.next.ambient = 1 / 0), me(o, c), ae(o.fade.gain, i, 1, C), o)
        : (oe(o, l ? 0.55 : 1),
          W(o, l ? 0.6 : 1),
          (o.next.gust = c + r(3, 7)),
          (o.next.bird = c + r(3, 6)),
          (o.next.ambient = c + (l ? 0.4 : r(8, 16))),
          l && ((v && he(o, v)) || me(o, c)),
          ae(o.fade.gain, i, 1, C),
          o);
    } catch {
      return (o?.dispose(), null);
    }
  }
  function Q(e, t) {
    for (
      ae(e.fade.gain, e.ctx, 0, t),
        F.add(e),
        e.retireTimer = setTimeout(
          () => {
            (F.delete(e), e.dispose());
          },
          (t + 0.1) * 1e3,
        );
      F.size > M;
    ) {
      let e = F.values().next().value;
      if (!e) break;
      (F.delete(e), e.dispose());
    }
  }
  function $() {
    if (y) return;
    let t = p();
    (b && (!t || t.ctx !== b.ctx) && (b.dispose(), (b = null)),
      h && !U() && !e.isMuted() && t
        ? (b && (b.mode !== g || x) && (Q(b, C), (b = null)),
          (x = !1),
          b || ((b = Z(t, g)), b || ((h = !1), xe())))
        : (b &&= (Q(b, h ? w : c), null)),
      h && !U() ? _e() : ve());
  }
  function ge() {
    $();
    let e = b;
    if (e)
      try {
        e.ctx.state !== `running` &&
          Date.now() - P > N &&
          ((P = Date.now()), e.ctx.resume().catch(() => void 0));
        let t = e.media;
        (t && !t.failed && t.el.paused && Date.now() - t.lastTry > 3e3 && X(e), Y(e));
      } catch {}
  }
  function _e() {
    j === null && (j = setInterval(ge, T));
  }
  function ve() {
    j !== null && (clearInterval(j), (j = null));
  }
  let ye = () => {
    (U() || (P = -1 / 0), $());
  };
  function be() {
    !S && i && ((S = !0), i.addEventListener(`visibilitychange`, ye));
  }
  function xe() {
    S && i && ((S = !1), i.removeEventListener(`visibilitychange`, ye));
  }
  return {
    start(t) {
      if (!y)
        try {
          try {
            Promise.resolve(e.unlock()).catch(() => void 0);
          } catch {}
          if (!e.getOutput?.()) return;
          ((h = !0), (g = t === `chant` || d ? `chant` : `nature`), be(), $());
        } catch {}
    },
    stop(e) {
      if (!y) {
        ((c = typeof e == `number` && e >= 0 ? e : C), (h = !1), xe());
        try {
          $();
        } catch {}
      }
    },
    isPlaying: () => h,
    getMode: () => (h ? g : null),
    setVolume(e) {
      if (typeof e != `number` || Number.isNaN(e)) return;
      _ = ee(e);
      let t = b;
      if (t)
        try {
          t.mix.gain.setTargetAtTime(_, t.ctx.currentTime, 0.05);
        } catch {}
    },
    getVolume: () => _,
    setChantBpm(e) {
      typeof e == `number` && Number.isFinite(e) && (l = o(e));
    },
    setChantSource(e) {
      let t = typeof e == `string` && e.trim() !== `` ? e.trim() : null;
      if (t !== v && ((v = t), h && g === `chant`)) {
        x = !0;
        try {
          $();
        } catch {}
      }
    },
    dispose() {
      if (!y) {
        ((y = !0), (h = !1), ve(), xe(), b?.dispose(), (b = null));
        for (let e of F) e.dispose();
        (F.clear(), (L = null));
      }
    },
  };
}
var W = {
    "niem-phat-ky-duyen": { voice: `nam`, kind: `niem-phat` },
    "kinh-a-di-da": { voice: `nam`, kind: `kinh` },
    "niem-phat-ngay-ram": { voice: `nam`, kind: `niem-phat` },
    "chua-bai-dinh": { voice: `bac`, kind: `ngan`, note: `Câu ngân ngắn của một vị tăng` },
  },
  G = {
    "nhac-dan-tranh": `Đàn guzheng (họ hàng đàn tranh Việt), thang ngũ cung`,
    "nhac-nui-da": `Guzheng trên nền nhạc núi rừng`,
    "nhac-hoa-sen": `Đàn phím, chuông, tiếng ngân`,
    "nhac-ngoi-thien": `Nhạc làm bằng máy (GarageBand) của một người Việt, chủ đề chùa và hoa sen`,
    "nhac-gio-nuoc-go": `Đàn dây kiểu Á Đông làm bằng máy, trên tiếng gió và nước`,
  },
  K = { nam: `Giọng miền Nam`, bac: `Giọng miền Bắc`, mo: `Chỉ tiếng mõ` };
function se(e, t = W) {
  let n = { nam: 0, bac: 0 };
  for (let r of e) {
    let e = t[r.id];
    e && e.kind !== `ngan` && (n[e.voice] += r.durationSec);
  }
  let r = [];
  for (let e of [`nam`, `bac`]) n[e] >= 150 && r.push(e);
  return (r.push(`mo`), r);
}
function ce(e, t) {
  return t.includes(e) ? e : (t[0] ?? `mo`);
}
function le(e, t, n = W) {
  let r = [];
  return (
    e.forEach((e, i) => {
      let a = n[e.id];
      a?.voice === t && a.kind !== `ngan` && r.push(i);
    }),
    r
  );
}
var ue = `chua-online:listen`,
  q = [1, 0.9, 0.8],
  J = `lan-luot`,
  de = `tong-hop`,
  fe = Object.freeze({
    v: 1,
    mode: `chung`,
    voice: `nam`,
    speed: 0.9,
    track: null,
    music: J,
    promptSeen: !1,
  }),
  pe = /^[a-z0-9][a-z0-9-]{0,47}$/,
  Y = (e) => typeof e == `string` && pe.test(e);
function X(e) {
  let t = typeof e == `object` && e ? e : {},
    n = fe;
  return {
    prefs: {
      v: 1,
      mode: t.mode === `chung` || t.mode === `rieng` ? t.mode : n.mode,
      voice: t.voice === `nam` || t.voice === `bac` || t.voice === `mo` ? t.voice : n.voice,
      speed: q.find((e) => e === t.speed) ?? n.speed,
      track: Y(t.track) ? t.track : null,
      music: Y(t.music) ? t.music : n.music,
      promptSeen: t.promptSeen === !0,
    },
    newer: typeof t.v == `number` && t.v > 1,
  };
}
function me(e = {}) {
  let t = e.storage ?? (() => (typeof localStorage > `u` ? null : localStorage)),
    n = e.win === void 0 ? (typeof window > `u` ? null : window) : e.win,
    r = new Set(),
    i = null;
  function a() {
    try {
      let e = t()?.getItem(ue);
      return X(e ? JSON.parse(e) : null);
    } catch {
      return { prefs: { ...fe }, newer: !1 };
    }
  }
  function o(e) {
    for (let t of [...r])
      try {
        t(e);
      } catch (e) {
        console.error(`Lỗi trong hàm lắng nghe lựa chọn nghe`, e);
      }
  }
  let s = (e) => {
    (e.key === `chua-online:listen` || e.key === null) && ((i = null), o(a().prefs));
  };
  return {
    read: () => (i ? { ...i } : a().prefs),
    update(e) {
      let n = a(),
        r = X({ ...(i ?? n.prefs), ...e }).prefs;
      if (((i = null), n.newer)) i = r;
      else
        try {
          let e = t();
          if (!e) throw Error(`không có bộ nhớ`);
          e.setItem(ue, JSON.stringify(r));
        } catch {
          i = r;
        }
      return (o({ ...r }), { ...r });
    },
    onChange(e) {
      return (
        r.size === 0 && n?.addEventListener(`storage`, s),
        r.add(e),
        () => {
          r.delete(e) && r.size === 0 && n?.removeEventListener(`storage`, s);
        }
      );
    },
  };
}
var he = me(),
  Z = 1024;
Z / 2;
var Q = 4;
function $() {
  let e = globalThis.scheduler;
  return typeof e?.yield == `function` ? e.yield() : new Promise((e) => setTimeout(e, 0));
}
function ge() {
  return new DOMException(`Đã huỷ kéo giãn`, `AbortError`);
}
var _e = Float64Array.from({ length: Z }, (e, t) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / Z));
async function ve(e, t, n = {}) {
  if (t === 1) return e;
  if (!(t > 0.25 && t < 4)) throw RangeError(`tốc độ không hợp lệ: ${t}`);
  let { signal: r, sliceMs: i = 8 } = n,
    a = n.now ?? (() => performance.now()),
    o = n.yieldFn ?? $;
  if (r?.aborted) throw ge();
  let s = e.length,
    c = Math.round(s / t),
    l = n.alloc ? n.alloc(c) : new Float32Array(c);
  if (l.length !== c) throw RangeError(`mảng ra dài ${l.length}, cần ${c}`);
  if (s < 1024) {
    for (let n = 0; n < c; n += 1) {
      let r = e[Math.min(s - 1, Math.floor(n * t))] ?? 0;
      l[n] = Number.isFinite(r) ? r : 0;
    }
    return l;
  }
  let u = s - Z,
    d = 512 * t,
    f = new Float32Array(Math.floor(s / Q)),
    p = 0,
    m = (t) => {
      let n = Math.min(f.length, t);
      for (; p < n; p += 1) {
        let t = p * Q;
        f[p] = ((e[t] ?? 0) + (e[t + 1] ?? 0) + (e[t + 2] ?? 0) + (e[t + 3] ?? 0)) / 4;
      }
    },
    h = 512 / Q,
    g = 512 / Q,
    _ = new Float64Array(Z),
    v = new Float64Array(Z),
    y = 0,
    b = (e) => {
      let t = Math.min(c, e);
      for (; y < t; y += 1) {
        let e = y & 1023,
          t = v[e],
          n = t > 1e-9 ? _[e] / t : 0;
        ((l[y] = Number.isFinite(n) ? n : 0), (_[e] = 0), (v[e] = 0));
      }
    },
    x = 0,
    S = a(),
    C = c <= 1024 ? 1 : Math.ceil((c - Z) / 512) + 1;
  for (let t = 0; t < C; t += 1) {
    let n = Math.min(u, Math.round(t * d));
    if (t > 0) {
      let t = Math.min(u, x + 512),
        r = Math.max(0, n - 256),
        i = Math.floor(t / Q),
        a = Math.floor(r / Q);
      m(Math.max(i, a + g) + h);
      let o = n,
        s = -1 / 0,
        c = Math.min(Math.floor(u / Q), a + g);
      for (let e = a; e <= c; e += 1) {
        let t = 0;
        for (let n = 0; n < h; n += 1) t += f[i + n] * f[e + n];
        t > s && ((s = t), (o = e * Q));
      }
      s = -1 / 0;
      let l = o;
      for (let n = Math.max(0, l - 4); n <= Math.min(u, l + 4); n += 1) {
        let r = 0;
        for (let i = 0; i < 512; i += 1) r += e[t + i] * e[n + i];
        r > s && ((s = r), (o = n));
      }
      n = o;
    }
    x = n;
    let s = t * 512,
      l = Math.min(Z, c - s);
    for (let t = 0; t < l; t += 1) {
      let r = (s + t) & 1023,
        i = _e[t];
      ((_[r] = _[r] + i * e[n + t]), (v[r] = v[r] + i));
    }
    if ((b(s + 512), a() - S >= i)) {
      if ((await o(), r?.aborted)) throw ge();
      S = a();
    }
  }
  return (b(c), l);
}
var ye = e({ createChantPlayer: () => Le }),
  be = 1.2,
  xe = 15e3,
  Se = 22050,
  Ce = 2,
  we = n.chantVolume,
  Te = 3.01,
  Ee = {
    "niem-phat-ky-duyen.mp3": { lufs: -20.47, truePeak: -1.84 },
    "kinh-a-di-da.mp3": { lufs: -20.48, truePeak: -3.64 },
    "niem-phat-ngay-ram.mp3": { lufs: -20.46, truePeak: -3.37 },
    "chua-bai-dinh.mp3": { lufs: -20.33, truePeak: -4.45 },
  };
function De(e) {
  let t = -16 - (e.lufs + Te),
    n = -1 - e.truePeak;
  return Math.round(Math.min(t, n) * 100) / 100;
}
var Oe = Object.freeze(Object.fromEntries(Object.entries(Ee).map(([e, t]) => [e, De(t)])));
function ke(e) {
  let t = Oe[e.src.slice(e.src.lastIndexOf(`/`) + 1)];
  return t === void 0 ? 1 : i(t);
}
var Ae = `Tiếng mõ (không lời)`,
  je = `Máy này chưa đổi được tốc độ, đang phát tốc độ gốc`,
  Me = `Mất kết nối, chuyển sang tiếng mõ tổng hợp`,
  Ne = (e) => Math.min(1, Math.max(0, e));
async function Pe(e, t) {
  let n = globalThis.OfflineAudioContext;
  if (typeof n == `function`)
    try {
      return await new n(1, 1, Se).decodeAudioData(t.slice(0));
    } catch {}
  return e.decodeAudioData(t.slice(0));
}
function Fe(e) {
  try {
    typeof e.resume == `function` &&
      e.state !== `running` &&
      e.state !== `closed` &&
      e.resume().catch(() => void 0);
  } catch {}
}
var Ie = (e, t) => e.length === t.length && e.every((e, n) => t[n] === e);
function Le(e, t = {}) {
  let n = t.tracks ?? s,
    r = n.map((e) => e.durationSec),
    i = t.now ?? (() => Date.now()),
    o = t.urlFor ?? ((e) => l(e)),
    c = t.decode ?? Pe,
    u = t.doc === void 0 ? (typeof document < `u` ? document : null) : t.doc,
    d = t.playInBackground ?? (() => !1),
    f = t.fetchImpl ?? ((e, t) => fetch(e, t)),
    p = t.prefs ?? he,
    m = t.catalog ?? W,
    h = t.listenChoice ?? a.listenChoice,
    g = h ? (t.radioRate ?? 1) : 1,
    _ = t.stretch ?? ve,
    v = t.createMo ?? ((e, t, n) => oe(e, { layer: `mo`, chantBpm: t, bpm: n, doc: null })),
    y = n.map((e, t) => t),
    S = se(n, m),
    C = new Set(),
    w = we,
    T = !1,
    E = !1,
    D = !1,
    O = !1,
    k = 0,
    A = 0,
    j = null,
    M = null,
    N = null,
    P = null,
    F = new Map(),
    I = new Map(),
    L = new Map(),
    R = null,
    z = !1,
    B = null,
    V = !1;
  function ee(e) {
    if (!h || e.mode === `chung`) return { mode: `chung`, voice: null, rate: z ? 1 : g, order: y };
    let t = ce(e.voice, S);
    if (t === `mo`) return { mode: `rieng`, voice: t, rate: e.speed, order: [] };
    let r = le(n, t, m),
      i = r.filter((t) => n[t]?.id === e.track);
    return { mode: `rieng`, voice: t, rate: z ? 1 : e.speed, order: i.length > 0 ? i : r.length > 0 ? r : y };
  }
  function te() {
    try {
      return ee(p.read());
    } catch {
      return { mode: `chung`, voice: null, rate: 1, order: y };
    }
  }
  let H = te();
  function ne() {
    let e = P?.index ?? null,
      t = e === null ? void 0 : n[e],
      r = T && !O && !D,
      a = r && V;
    return {
      playing: r,
      loading: r && E && !a,
      trackId: r && !a && t ? t.id : null,
      title: a ? Ae : r && t ? t.title : null,
      source: r ? (a ? `mo` : `radio`) : null,
      communityLive: x(i()).live,
      mode: r ? H.mode : null,
      voice: r ? (a ? `mo` : H.voice) : null,
      speed: r ? (a ? H.rate : (M?.rate ?? H.rate)) : null,
      speedUnavailable: z,
    };
  }
  function U() {
    let e = ne();
    for (let t of [...C])
      try {
        t(e);
      } catch (e) {
        console.error(`Lỗi trong hàm lắng nghe niệm Phật`, e);
      }
  }
  function re(e) {
    try {
      t.onNotice?.(e);
    } catch {}
  }
  function ie(t) {
    if (N && N.ctx === t.ctx) return N.gain;
    try {
      let n = t.ctx.createGain();
      return (
        (n.gain.value = w),
        n.connect(e.getOutput?.(`chant`)?.destination ?? t.destination),
        (N = { ctx: t.ctx, gain: n }),
        n
      );
    } catch {
      return ((N = null), null);
    }
  }
  function ae(e, t, n, r) {
    try {
      let i = t.currentTime;
      (e.cancelScheduledValues(i), e.setValueAtTime(e.value, i), e.linearRampToValueAtTime(n, i + r));
    } catch {}
  }
  function G(e, t) {
    e &&
      (e.prefetchTimer !== null && clearTimeout(e.prefetchTimer),
      (e.prefetchTimer = null),
      e.aheadTimer !== null && clearTimeout(e.aheadTimer),
      (e.aheadTimer = null),
      (e.source.onended = null),
      ae(e.fade.gain, e.ctx, 0, t),
      setTimeout(
        () => {
          try {
            e.source.stop();
          } catch {}
          try {
            (e.source.disconnect(), e.fade.disconnect());
          } catch {}
        },
        Math.ceil(t * 1e3) + 60,
      ));
  }
  let K = () => {
      let e = 60;
      try {
        e = t.tempo?.() ?? 60;
      } catch {}
      return Math.round((Number.isFinite(e) ? e : 60) * H.rate);
    },
    ue = {
      ...e,
      unlock: () => e.unlock(),
      isMuted: () => e.isMuted(),
      getOutput: () => {
        let t = e.getOutput?.() ?? null,
          n = t ? ie(t) : null;
        return t && n ? { ctx: t.ctx, destination: n } : null;
      },
    };
  function q(e) {
    if (!ie(e)) return !1;
    try {
      if (((B ??= v(ue, K(), K)), B.setChantBpm(K()), B.setVolume(1), B.start(`chant`), !B.isPlaying()))
        return !1;
    } catch {
      return !1;
    }
    return ((V = !0), G(M, be), (M = null), (P = null), (E = !1), X([]), U(), !0);
  }
  function J() {
    if (V) {
      V = !1;
      try {
        B?.stop();
      } catch {}
    }
  }
  async function de(e, t) {
    let n = new AbortController(),
      r = () => n.abort(t.reason);
    (t.addEventListener(`abort`, r, { once: !0 }), t.aborted && r());
    let i = new Promise((e, t) => {
      let r = () => t(n.signal.reason ?? new DOMException(`Đã huỷ tải`, `AbortError`));
      n.signal.aborted ? r() : n.signal.addEventListener(`abort`, r, { once: !0 });
    });
    i.catch(() => void 0);
    let a = (e) => Promise.race([e, i]),
      o = null,
      s = () => {
        (o !== null && clearTimeout(o),
          (o = setTimeout(() => n.abort(new DOMException(`Tải đứng yên quá lâu`, `TimeoutError`)), xe)));
      },
      c = null,
      l = !1;
    try {
      s();
      let t = await a(f(e, { signal: n.signal }));
      if (!t.ok) throw Error(`HTTP ${t.status}`);
      if ((s(), (c = t.body?.getReader() ?? null), !c)) return await a(t.arrayBuffer());
      let r = [],
        i = 0;
      for (;;) {
        let e = await a(c.read());
        if (e.done) break;
        (r.push(e.value), (i += e.value.byteLength), s());
      }
      l = !0;
      let o = new Uint8Array(i),
        u = 0;
      for (let e of r) (o.set(e, u), (u += e.byteLength));
      return o.buffer;
    } finally {
      (o !== null && clearTimeout(o),
        t.removeEventListener(`abort`, r),
        c && !l && c.cancel().catch(() => void 0));
    }
  }
  function fe(e, t) {
    let r = F.get(e);
    if (r) return Promise.resolve(r);
    let i = L.get(e);
    if (i && !i.signal.aborted) return i.job;
    let a = (async () => {
      let r = n[e];
      if (!r) throw Error(`không có bản ghi`);
      let i = await de(o(r), t);
      if (i.byteLength === 0) throw Error(`tệp rỗng`);
      return (t.aborted || F.set(e, i), i);
    })().finally(() => {
      L.get(e)?.job === a && L.delete(e);
    });
    return (L.set(e, { job: a, signal: t }), a);
  }
  async function pe(e, t, n, r, i) {
    let a = Math.min(e.length - 1, Math.max(0, Math.floor(r * e.sampleRate))),
      o = e.numberOfChannels,
      s = e.getChannelData(0).subarray(a);
    if (o > 1) {
      let t = new Float32Array(s.length);
      for (let n = 0; n < o; n += 1) {
        let r = e.getChannelData(n).subarray(a);
        for (let e = 0; e < t.length; e += 1) t[e] = (t[e] ?? 0) + (r[e] ?? 0) / o;
      }
      s = t;
    }
    let c = {},
      l = await _(s, n, {
        signal: i,
        alloc: (n) => (
          (c.buffer = t.createBuffer(1, n, e.sampleRate)),
          (c.data = c.buffer.getChannelData(0)),
          c.data
        ),
      });
    if (i.aborted) throw new DOMException(`Đã dừng`, `AbortError`);
    if (!c.buffer || l !== c.data) throw Error(`kéo giãn không ghi vào bộ đệm phát`);
    return { buffer: c.buffer, rate: n, from: a / e.sampleRate };
  }
  async function Y(e, t, n, r, i = 0) {
    let a = r === 1 ? 0 : i,
      o = I.get(e);
    if (o && o.rate === r && Math.abs(o.from - a) < 0.05) return o;
    let s = await fe(e, n),
      l;
    try {
      l = await c(t, s);
    } finally {
      F.delete(e);
    }
    if (!l || !(l.duration > 0) || !(l.length > 0)) throw Error(`giải mã hỏng`);
    let u = { buffer: l, rate: 1, from: 0 };
    if (r !== 1)
      try {
        u = await pe(l, t, r, a, n);
      } catch (e) {
        if (n.aborted) throw e;
        (z || re(je), (z = !0), H.voice !== `mo` && (H = { ...H, rate: 1 }));
      }
    return (n.aborted || I.set(e, u), u);
  }
  function X(e) {
    let t = M?.source.buffer ?? null;
    for (let t of [...F.keys()]) e.includes(t) || F.delete(t);
    for (let [n, r] of [...I]) r.buffer !== t && ((e.includes(n) && r.rate === H.rate) || I.delete(n));
  }
  function me(e) {
    let t = H.order;
    return t[(t.indexOf(e) + 1) % t.length] ?? e;
  }
  function Z(e) {
    return e.from + (e.offset + Math.max(0, e.ctx.currentTime - e.startedAt)) * e.rate;
  }
  function Q(e, t, n) {
    let r = me(e.index);
    if (r === e.index && e.from === 0) return;
    let i = () => {
        ((e.prefetchTimer = null), fe(r, n).catch(() => void 0));
      },
      a = Math.max(0, t - 30) * 1e3;
    a === 0 ? i() : (e.prefetchTimer = setTimeout(i, a));
    let o = Math.max(0, t - 12) * 1e3;
    e.aheadTimer = setTimeout(() => {
      ((e.aheadTimer = null), Y(r, e.ctx, n, H.rate).catch(() => void 0));
    }, o);
  }
  async function $(e, t, r, i, a) {
    let o = n[e];
    if (!o) return !1;
    ((P = { index: e }), (E = !0), U());
    let s = o.durationSec - t < Ce ? 0 : t,
      c;
    try {
      c = await Y(e, r.ctx, a, H.rate, s);
    } catch {
      return i !== k || a.aborted;
    }
    if (i !== k || D || !T) return !0;
    let l = ie(r);
    if (!l) return !1;
    let { buffer: u } = c,
      d = u.duration;
    ((s = Math.max(0, (s - c.from) / c.rate)), d - s < Ce && (s = 0));
    let f = r.ctx;
    try {
      let t = f.createBufferSource();
      t.buffer = u;
      let n = f.createGain();
      ((n.gain.value = 0), t.connect(n), n.connect(l));
      let r = {
        index: e,
        ctx: f,
        source: t,
        fade: n,
        prefetchTimer: null,
        aheadTimer: null,
        rate: c.rate,
        from: c.from,
        offset: s,
        startedAt: f.currentTime,
      };
      return (
        (t.onended = () => {
          M !== r || i !== k || D || ((M = null), _e(e).catch(() => ge(i)));
        }),
        t.start(0, s),
        ae(n.gain, f, ke(o), be),
        G(M, be),
        (M = r),
        (E = !1),
        J(),
        X([e, me(e)]),
        Q(r, d - s, a),
        U(),
        !0
      );
    } catch {
      return !1;
    }
  }
  function ge(t) {
    if (!T || D || t !== k) return;
    let n = e.getOutput?.() ?? null;
    n && q(n) ? re(Me) : Te(!1);
  }
  async function _e(t) {
    if (!T || D || O) return;
    let n = e.getOutput?.() ?? null;
    if (!n || !R) return;
    let r = me(t),
      i = k,
      a = R.signal,
      o = await $(r, 0, n, i, a);
    (!o && T && !D && i === k && (o = await $(r, 0, n, i, a)), o || ge(i));
  }
  async function ye(e, t) {
    if (((k += 1), R?.abort(), L.clear(), (R = new AbortController()), Fe(e.ctx), H.voice === `mo`))
      return q(e);
    let n,
      a = 0;
    if (t) ({ index: n, offset: a } = t);
    else if (H.mode === `chung`) {
      let e = b(i(), r, g);
      if (!e) return !1;
      ((n = e.index), (a = e.offsetSec * g));
    } else n = H.order[0] ?? 0;
    return $(n, a, e, k, R.signal);
  }
  function Se(e, t) {
    let n = k + 1;
    ye(e, t)
      .catch(() => !1)
      .then((e) => {
        e || ge(n);
      });
  }
  function Te(e) {
    ((T = !1),
      (E = !1),
      (O = !1),
      (k += 1),
      (A += 1),
      (j = null),
      R?.abort(),
      (R = null),
      G(M, e ? be : 0.05),
      (M = null),
      (P = null),
      J(),
      F.clear(),
      I.clear(),
      L.clear(),
      U());
  }
  let Ee = p.onChange((t) => {
      if (D) return;
      let n = H,
        r = ee(t);
      ((H = r), X(r.order));
      let i = n.mode === r.mode && n.voice === r.voice && Ie(n.order, r.order);
      if (!T || O || (i && n.rate === r.rate)) return;
      let a = e.getOutput?.() ?? null;
      a &&
        (i && V && r.voice === `mo`
          ? (B?.setChantBpm(K()), U())
          : Se(a, i && M && !V ? { index: M.index, offset: Z(M) } : void 0));
    }),
    De = () => {
      if (!T || D) return;
      if (u?.hidden === !0) {
        if (d() || O) return;
        ((O = !0),
          (k += 1),
          R?.abort(),
          (R = null),
          G(M, 0.3),
          (M = null),
          J(),
          F.clear(),
          I.clear(),
          L.clear(),
          (E = !1),
          U());
        return;
      }
      if (!O) return;
      O = !1;
      let t = e.getOutput?.() ?? null;
      t
        ? (ye(t)
            .catch(() => !1)
            .then((e) => {
              !e && T && !D && Te(!1);
            }),
          U())
        : Te(!1);
    };
  return (
    u?.addEventListener(`visibilitychange`, De),
    {
      async start() {
        if (D) return `failed`;
        if (T) return j ?? `playing`;
        try {
          Promise.resolve(e.unlock(`playback`)).catch(() => void 0);
        } catch {}
        let t = e.getOutput?.() ?? null;
        if (!t) return `failed`;
        ((H = te()), (T = !0));
        let n = ++A;
        return (
          (O = u?.hidden === !0 && !d()),
          O
            ? (U(), `playing`)
            : (j = ye(t)
                .catch(() => !1)
                .then((e) => (n !== A || D ? `cancelled` : ((j = null), e ? `playing` : (Te(!1), `failed`)))))
        );
      },
      stop() {
        !D && T && Te(!0);
      },
      isPlaying: () => T && !D,
      getState: ne,
      setVolume(e) {
        if (!(typeof e != `number` || Number.isNaN(e)) && ((w = Ne(e)), N))
          try {
            N.gain.gain.setTargetAtTime(w, N.ctx.currentTime, 0.05);
          } catch {}
      },
      getVolume: () => w,
      subscribe(e) {
        return (
          C.add(e),
          () => {
            C.delete(e);
          }
        );
      },
      dispose() {
        if (!D) {
          (Te(!1), (D = !0), Ee(), u?.removeEventListener(`visibilitychange`, De));
          try {
            B?.dispose();
          } catch {}
          B = null;
          try {
            N?.gain.disconnect();
          } catch {}
          ((N = null), C.clear());
        }
      },
    }
  );
}
var Re = e({ createMoLoop: () => Ve }),
  ze = 0.6,
  Be = 4e3;
function Ve(e) {
  let { audio: t, store: n, chantBusy: r } = e,
    i = e.doc === void 0 ? (typeof document < `u` ? document : null) : e.doc,
    a = e.now ?? (() => Date.now()),
    o = e.layer ?? oe(t, { layer: `mo`, bellEvery: 24, bpm: () => n.getSettings().chantTempo, doc: null });
  o.setVolume(ze);
  let s = 0,
    c = null,
    l = !1;
  function u() {
    let e = n.getSettings();
    return l ||
      !e.sound ||
      !e.moLoopOn ||
      t.getOutput?.() == null ||
      (i?.hidden === !0 && !e.playInBackground) ||
      r() ||
      d() ||
      _() ||
      p()
      ? !1
      : a() >= s;
  }
  function h(e = !1) {
    try {
      let t = u();
      t && !o.isPlaying() ? o.start(`chant`) : !t && o.isPlaying() && o.stop(e ? w : void 0);
    } catch {}
  }
  let g = () => h(),
    y = t.onPlay?.((e, t) => {
      if (l || (e !== `mo` && t?.bus !== `mo`)) return;
      let n = Math.max(0, (t?.delay ?? 0) * 1e3);
      ((s = Math.max(s, a() + n + Be)),
        h(!0),
        c !== null && clearTimeout(c),
        (c = setTimeout(
          () => {
            ((c = null), h());
          },
          s - a() + 20,
        )));
    }),
    b = v(g),
    x = m(g),
    S = f(g);
  return (
    i?.addEventListener(`visibilitychange`, g),
    h(),
    {
      sync: g,
      isPlaying: () => o.isPlaying(),
      dispose() {
        l ||
          ((l = !0),
          y?.(),
          b(),
          x(),
          S(),
          i?.removeEventListener(`visibilitychange`, g),
          c !== null && clearTimeout(c),
          o.dispose());
      },
    }
  );
}
var He = [0, 2, 5, 7, 9],
  Ue = 293.66,
  We = 60 / 54,
  Ge = 2e3,
  Ke = 24e3,
  qe = 3.2,
  Je = 0.4,
  Ye = 0.04,
  Xe = 0.12,
  Ze = 0.12,
  Qe = 0.36,
  $e = 0.3,
  et = 0.35,
  tt = 0.004,
  nt = 5.2,
  rt = [
    { hz: 146.83, weight: 4 },
    { hz: 196, weight: 2.5 },
    { hz: 110, weight: 2 },
    { hz: 164.81, weight: 1.5 },
  ],
  it = [293.66, 220, 196],
  at = [
    { ratio: 1, amp: 1, decay: 16 },
    { ratio: 2.76, amp: 0.45, decay: 11 },
    { ratio: 5.4, amp: 0.2, decay: 7 },
    { ratio: 8.93, amp: 0.08, decay: 4.5 },
  ],
  ot = 1e-4;
function st(e) {
  let t = Math.floor(e / 5),
    n = He[e - t * 5] ?? 0;
  return Ue * 2 ** ((t * 12 + n) / 12);
}
function ct(e) {
  let t = ((e % 5) + 5) % 5;
  return t === 0 || t === 3;
}
function lt(e, t, n, r) {
  let i = t / e,
    a = Math.max(2, Math.round(i)),
    o = new Float32Array(a);
  for (let e = 0; e < a; e += 1) o[e] = r() * 2 - 1;
  for (let e = 0; e < 2; e += 1) for (let e = 1; e < a; e += 1) o[e] = ((o[e] ?? 0) + (o[e - 1] ?? 0)) / 2;
  let s = 0;
  for (let e = 0; e < a; e += 1) s += o[e] ?? 0;
  s /= a;
  for (let e = 0; e < a; e += 1) o[e] = (o[e] ?? 0) - s;
  let c = 10 ** (-3 / (Math.min(3.8, Math.max(1.6, 3.8 - (e - 220) / 400)) * e)),
    l = Math.max(1, Math.floor(t * n)),
    u = new Float32Array(l),
    d = 0,
    f = 0;
  for (let e = 0; e < l; e += 1) {
    let t = d + 1 === a ? 0 : d + 1,
      n = o[d] ?? 0;
    ((u[e] = n), (o[d] = c * 0.5 * (n + (o[t] ?? 0))), (d = t));
    let r = Math.abs(n);
    r > f && (f = r);
  }
  if (f > 0) for (let e = 0; e < l; e += 1) u[e] = (u[e] ?? 0) / f;
  return { data: u, rate: (a + 0.5) / i };
}
function ut(e, t, n = {}) {
  let r = n.random ?? Math.random,
    i = n.setTimer ?? ((e, t) => setTimeout(e, t)),
    a = n.clearTimer ?? ((e) => clearTimeout(e)),
    o = (e, t) => e + r() * (t - e),
    s = (e) => e[Math.floor(r() * e.length)],
    c = !1,
    l = !1,
    u = null,
    d = new Set(),
    f = new Map(),
    p = null,
    m = e.createGain();
  ((m.gain.value = 1), m.connect(t));
  let h = e.createGain();
  h.connect(m);
  let g = e.createDelay(1);
  g.delayTime.value = Qe;
  let _ = e.createBiquadFilter();
  ((_.type = `lowpass`), (_.frequency.value = 2200));
  let v = e.createGain();
  v.gain.value = $e;
  let y = e.createGain();
  ((y.gain.value = et), h.connect(g), g.connect(_), _.connect(v), v.connect(g), _.connect(y), y.connect(m));
  let b = e.createOscillator();
  ((b.type = `sine`), (b.frequency.value = nt));
  let x = [m, h, g, _, v, y, b],
    S = 3,
    C = -1,
    w = 0,
    T = 0,
    E = 0;
  function D() {
    let e = { sources: [], nodes: [], taps: [], live: 0 };
    return (d.add(e), e);
  }
  function O(e) {
    if (d.delete(e)) {
      for (let t of e.sources) t.onended = null;
      for (let t of e.taps)
        try {
          b.disconnect(t);
        } catch {}
      for (let t of [...e.sources, ...e.nodes])
        try {
          t.disconnect();
        } catch {}
    }
  }
  function k(e, t, n, r) {
    (e.sources.push(t),
      (e.live += 1),
      (t.onended = () => {
        (--e.live, e.live <= 0 && O(e));
      }),
      t.start(n),
      t.stop(r));
  }
  function A(t) {
    let n = f.get(t);
    if (n) return n;
    let { data: i, rate: a } = lt(st(t), Ke, qe, r),
      o = e.createBuffer(1, i.length, Ke);
    o.getChannelData(0).set(i);
    let s = { buffer: o, rate: a };
    return (f.set(t, s), s);
  }
  function j() {
    if (p) return p;
    let t = Ke * 2,
      n = e.createBuffer(1, t, Ke),
      i = n.getChannelData(0);
    for (let e = 0; e < t; e += 1) i[e] = r() * 2 - 1;
    return ((p = n), n);
  }
  function M(t, n, r, i) {
    let { buffer: a, rate: o } = A(t),
      s = D(),
      c = e.createBufferSource();
    ((c.buffer = a),
      c.playbackRate.setValueAtTime(o, n),
      i &&
        (c.playbackRate.setValueAtTime(o, n + 0.35),
        c.playbackRate.linearRampToValueAtTime(o * 2 ** (1 / 12), n + 0.6),
        c.playbackRate.setValueAtTime(o * 2 ** (1 / 12), n + 0.95),
        c.playbackRate.linearRampToValueAtTime(o, n + 1.25)));
    let l = e.createGain();
    (l.gain.setValueAtTime(0, n),
      l.gain.setValueAtTime(0, n + 0.3),
      l.gain.linearRampToValueAtTime(o * tt, n + 1.1),
      b.connect(l),
      l.connect(c.playbackRate),
      s.taps.push(l));
    let u = e.createGain();
    ((u.gain.value = r * Je), c.connect(u));
    let d = u;
    if ((s.nodes.push(l, u), typeof e.createStereoPanner == `function`)) {
      let n = e.createStereoPanner();
      ((n.pan.value = Math.max(-0.45, Math.min(0.45, (t - 3.5) * 0.08))),
        u.connect(n),
        (d = n),
        s.nodes.push(n));
    }
    (d.connect(h), k(s, c, n, n + a.duration / o));
  }
  function N(e, t) {
    if (t) {
      for (let t of [0, -1, 1, -2, 2]) {
        let n = e + t;
        if (n >= -2 && n <= 9 && ct(n)) return n;
      }
      return 0;
    }
    let n = r(),
      i = n < 0.7 ? 1 : n < 0.93 ? 2 : 3,
      a = e < 3 ? 0.65 : e > 6 ? 0.35 : 0.5,
      o = e + (r() < a ? i : -i);
    return Math.max(-2, Math.min(9, o));
  }
  function P(e) {
    let t = 3 + Math.floor(r() * 4),
      n = e;
    for (let e = 0; e < t; e += 1) {
      let i = e === t - 1;
      S = N(S, i);
      let a = e === 0 ? o(0.7, 0.9) : o(0.5, 0.78);
      (M(S, n, a, !i && r() < 0.18),
        i && r() < 0.3 && M(S - 5 >= -2 ? S - 5 : S + 5, n + 0.03, a * 0.55, !1),
        i || (n += We * s([1, 1, 1.5, 2, 2, 3])));
    }
    return n + We * s([3, 4]) + o(3, 9);
  }
  function F() {
    let e = rt.map((e, t) => ({ ...e, index: t })).filter((e) => e.index !== C),
      t = r() * e.reduce((e, t) => e + t.weight, 0),
      n = e.find((e) => (t -= e.weight) < 0) ?? e[0];
    return ((C = n?.index ?? 0), n?.hz ?? 146.83);
  }
  function I(t, n) {
    let r = F(),
      i = t + n,
      a = D(),
      o = e.createGain();
    (o.gain.setValueAtTime(0, t),
      o.gain.linearRampToValueAtTime(Ye, t + 6),
      o.gain.setValueAtTime(Ye, i - 8),
      o.gain.linearRampToValueAtTime(0, i));
    let s = e.createBiquadFilter();
    ((s.type = `lowpass`),
      (s.Q.value = 0.4),
      s.frequency.setValueAtTime(600, t),
      s.frequency.linearRampToValueAtTime(1100, t + n / 2),
      s.frequency.linearRampToValueAtTime(700, i),
      s.connect(o),
      o.connect(m),
      a.nodes.push(o, s));
    for (let n of [r, r * 1.5])
      for (let r of [-7, 7]) {
        let o = e.createOscillator();
        ((o.type = `triangle`),
          (o.frequency.value = n),
          (o.detune.value = r),
          o.connect(s),
          k(a, o, t, i + 0.05));
      }
    let c = e.createBufferSource();
    ((c.buffer = j()), (c.loop = !0));
    let l = e.createBiquadFilter();
    ((l.type = `bandpass`), (l.frequency.value = r * 3), (l.Q.value = 2.5));
    let u = e.createGain();
    (u.gain.setValueAtTime(0, t),
      u.gain.linearRampToValueAtTime(Xe, t + n / 2),
      u.gain.linearRampToValueAtTime(0, i),
      c.connect(l),
      l.connect(u),
      u.connect(m),
      a.nodes.push(l, u),
      k(a, c, t, i + 0.05));
  }
  function L(t) {
    let n = s(it),
      r = D();
    for (let i of at) {
      let a = e.createGain(),
        s = (i.amp * Ze) / 2;
      (a.gain.setValueAtTime(ot, t),
        a.gain.linearRampToValueAtTime(s, t + 0.04),
        a.gain.exponentialRampToValueAtTime(ot, t + i.decay),
        a.connect(m),
        r.nodes.push(a));
      let c = o(0.4, 1.6);
      for (let o of [n * i.ratio, n * i.ratio + c]) {
        let n = e.createOscillator();
        ((n.type = `sine`), (n.frequency.value = o), n.connect(a), k(r, n, t, t + i.decay + 0.05));
      }
    }
  }
  function R() {
    if (((u = null), c)) {
      try {
        let t = e.currentTime + 8;
        for (; T < t;) {
          let e = o(30, 44);
          (I(T, e + 8), (T += e));
        }
        for (; w < t;) w = P(w);
        for (; E < t;) (L(E), (E += o(45, 90)));
      } catch (e) {
        console.error(`Nhạc nền tổng hợp lỗi khi xếp lịch`, e);
      }
      u = i(R, Ge);
    }
  }
  function z() {
    for (let e of [...d]) O(e);
    try {
      b.disconnect();
    } catch {}
    for (let e of x)
      try {
        e.disconnect();
      } catch {}
    (f.clear(), (p = null));
  }
  return {
    start() {
      if (c || l) return;
      c = !0;
      let t = e.currentTime;
      try {
        b.start(t);
      } catch {}
      ((T = t + 0.1), (w = t + 2.5), (E = t + o(8, 20)), R());
    },
    stop(t = 1) {
      if (l) return;
      ((l = !0), (c = !1), u !== null && a(u), (u = null));
      let n = e.currentTime,
        r = n + Math.max(0.05, t);
      try {
        (m.gain.cancelScheduledValues(n),
          m.gain.setValueAtTime(m.gain.value, n),
          m.gain.linearRampToValueAtTime(0, r),
          b.stop(r + 0.05));
      } catch {}
      for (let e of d)
        for (let t of e.sources)
          try {
            t.stop(r + 0.05);
          } catch {}
      i(z, Math.ceil((r - n) * 1e3) + 120);
    },
    isRunning: () => c,
  };
}
var dt = e({ createMusicPlayer: () => Tt }),
  ft = 24e3,
  pt = 1.2,
  mt = 2e4,
  ht = {
    "nhac/dan-tranh.webm": { lufs: -20.02, truePeak: -2.91 },
    "nhac/dan-tranh.mp3": { lufs: -20.45, truePeak: -3.84 },
    "nhac/nui-da.webm": { lufs: -20.04, truePeak: -2.01 },
    "nhac/nui-da.mp3": { lufs: -20.48, truePeak: -2.54 },
    "nhac/hoa-sen.webm": { lufs: -19.93, truePeak: -5.61 },
    "nhac/hoa-sen.mp3": { lufs: -20.49, truePeak: -6.17 },
    "nhac/ngoi-thien.webm": { lufs: -20, truePeak: -4.53 },
    "nhac/ngoi-thien.mp3": { lufs: -20.45, truePeak: -5.28 },
    "nhac/gio-nuoc-go.webm": { lufs: -20.11, truePeak: -4.83 },
    "nhac/gio-nuoc-go.mp3": { lufs: -20.55, truePeak: -5.14 },
  };
function gt(e) {
  let t = -20 - e.lufs,
    n = -1 - e.truePeak;
  return Math.round(Math.min(t, n) * 100) / 100;
}
var _t = Object.freeze(Object.fromEntries(Object.entries(ht).map(([e, t]) => [e, gt(t)])));
function vt(e) {
  let t = _t[e.replace(/^audio\//, ``)];
  return t === void 0 ? 1 : i(t);
}
var yt = `chua-device:music-opus`;
function bt(e, t) {
  if (!e) return !1;
  let n;
  try {
    n = JSON.parse(e);
  } catch {
    return !1;
  }
  if (typeof n != `object` || !n) return !1;
  let { v: r, at: i } = n;
  if (r !== 1 || typeof i != `number` || !Number.isFinite(i)) return !1;
  let a = t - i;
  return a >= 0 && a < 2592e6;
}
function xt() {
  try {
    return typeof localStorage > `u` ? null : localStorage;
  } catch {
    return null;
  }
}
function St() {
  try {
    return typeof document > `u`
      ? !1
      : document.createElement(`audio`).canPlayType(`audio/webm; codecs="opus"`) !== ``;
  } catch {
    return !1;
  }
}
async function Ct(e, t) {
  let n = globalThis.OfflineAudioContext;
  if (typeof n == `function`)
    try {
      return await new n(2, 1, ft).decodeAudioData(t.slice(0));
    } catch {}
  return e.decodeAudioData(t);
}
var wt = (e) => Math.min(1, Math.max(0, e));
function Tt(e, t = {}) {
  let n = t.tracks ?? c,
    i = t.fetchImpl ?? ((e, t) => fetch(e, t)),
    s = t.urlFor ?? ((e, t) => o(e, t)),
    l = t.decode ?? Ct,
    u = t.now ?? (() => Date.now()),
    d = t.canPlayOpus ?? St,
    f = t.storage ?? xt,
    p = t.preferGenerative ?? (() => y()),
    m = t.random ?? Math.random,
    _ = t.generative ?? ((e, t) => ut(e, t, { random: m })),
    v = t.setTimer ?? ((e, t) => setTimeout(e, t)),
    b = t.clearTimer ?? ((e) => clearTimeout(e)),
    S = t.prefs ?? he,
    C = t.listenChoice ?? a.listenChoice,
    w = () => {
      if (!C) return null;
      try {
        let e = S.read().music;
        if (e === `tong-hop`) return `tong-hop`;
        let t = n.findIndex((t) => t.id === e);
        return t >= 0 ? t : null;
      } catch {
        return null;
      }
    },
    T = w(),
    E = r.musicVolume,
    D = { ...h },
    O = !1,
    k = 1,
    A = null,
    j = !1,
    M = !1,
    N = null,
    P = 0,
    F = null,
    I = null,
    L = null,
    R = null,
    z = new Map(),
    B = new Map(),
    V = null;
  function ee(e, t, n, r) {
    try {
      let i = t.currentTime;
      (e.cancelScheduledValues(i), e.setValueAtTime(e.value, i), e.linearRampToValueAtTime(n, i + r));
    } catch {}
  }
  function te(t) {
    if (L && L.ctx === t.ctx) return L;
    try {
      let n = t.ctx.createGain();
      ((k = H()), (n.gain.value = k));
      let r = t.ctx.createGain();
      return (
        (r.gain.value = E),
        n.connect(r),
        r.connect(e.getOutput?.(`music`)?.destination ?? t.destination),
        (L = { ctx: t.ctx, duck: n, channel: r }),
        L
      );
    } catch {
      return ((L = null), null);
    }
  }
  function H() {
    return g({ ...D, community: O });
  }
  function ne() {
    let e = H();
    if (e === k) return;
    let t = e < k;
    ((k = e), L && ee(L.duck.gain, L.ctx, e, t ? pt : 3));
  }
  function U() {
    if (((A = null), !M || j)) return;
    let e = x(u()).live;
    (e !== O && ((O = e), ne()), (A = v(U, mt)));
  }
  function re() {
    try {
      return bt(f()?.getItem(`chua-device:music-opus`) ?? null, u());
    } catch {
      return !1;
    }
  }
  function ie() {
    try {
      f()?.setItem(yt, JSON.stringify({ v: 1, at: u() }));
    } catch {}
  }
  function ae() {
    return ((R ??= re() || !d() ? `mp3` : `opus`), R);
  }
  async function oe(e, t) {
    let r = `${t}:${e}`,
      a = z.get(r);
    if (a) return a;
    let o = n[e];
    if (!o) throw Error(`không có bản nhạc`);
    let c = await i(s(o, t));
    if (!c.ok) throw Error(`HTTP ${c.status}`);
    let l = await c.arrayBuffer();
    if (l.byteLength === 0) throw Error(`tệp rỗng`);
    return (z.set(r, l), l);
  }
  async function W(e, t) {
    let n = B.get(e);
    if (n) return n;
    let r = ae(),
      i = await oe(e, r),
      a;
    try {
      a = await l(t, i.slice(0));
    } catch (n) {
      if ((z.delete(`${r}:${e}`), r !== `opus`)) throw n;
      return ((R = `mp3`), ie(), W(e, t));
    }
    let o = { buffer: a, fmt: r };
    return (M && B.set(e, o), o);
  }
  function G(e) {
    for (let t of [...B.keys()]) e.includes(t) || B.delete(t);
  }
  function K(e, t) {
    let r = n[e];
    return r ? vt(t === `opus` ? r.opus : r.mp3) : 1;
  }
  function se(e) {
    e.faded || ((e.faded = !0), ee(e.fade.gain, e.ctx, 1, 4));
  }
  function ce(e, t, r, i, a, o) {
    let { buffer: s, fmt: c } = r,
      l = K(t, c),
      u = e.ctx.createBufferSource();
    u.buffer = s;
    let d = e.ctx.createGain();
    (o > 0 ? (d.gain.setValueAtTime(0, i), d.gain.linearRampToValueAtTime(l, i + o)) : (d.gain.value = l),
      u.connect(d),
      d.connect(e.fade));
    let f = {
      index: t,
      fmt: c,
      source: u,
      gain: d,
      when: i,
      offset: a,
      endAt: i + (s.duration > 0 ? s.duration : (n[t]?.durationSec ?? 0)) - a,
      level: l,
    };
    return (
      (u.onended = () => {
        u.onended = null;
        try {
          (u.disconnect(), d.disconnect());
        } catch {}
        I !== e ||
          e.ended ||
          e.current !== f ||
          (e.next ? ((e.current = e.next), (e.next = null)) : ((e.current = null), q(e)));
      }),
      u.start(i, a),
      f
    );
  }
  function le(e, t) {
    e.prepareTimer !== null && b(e.prepareTimer);
    let n = t.endAt - 6,
      r = Math.max(0, n - 20 - e.ctx.currentTime);
    e.prepareTimer = v(() => {
      ((e.prepareTimer = null), ue(e, t));
    }, r * 1e3);
  }
  async function ue(e, t) {
    if (I !== e || e.ended) return;
    let r = e.loop ?? (t.index + 1) % n.length,
      i = await W(r, e.ctx).catch(() => null);
    if (I !== e || e.ended || e.current !== t) return;
    let a = r;
    if ((!i && t.source.buffer && ((a = t.index), (i = { buffer: t.source.buffer, fmt: t.fmt })), !i)) return;
    let o = Math.max(e.ctx.currentTime + 0.05, t.endAt - 6),
      s = Math.max(0.05, Math.min(6, t.endAt - o));
    try {
      (t.gain.gain.setValueAtTime(t.level, o), t.gain.gain.linearRampToValueAtTime(0, o + s));
      let n = ce(e, a, i, o, 0, s);
      ((e.next = n),
        (e.prepareTimer = v(
          () => {
            I !== e ||
              e.ended ||
              ((e.current === n || e.next === n) &&
                ((e.current = n), (e.next = null), G([n.index]), le(e, n)));
          },
          Math.max(0, o + s - e.ctx.currentTime) * 1e3 + 50,
        )));
    } catch {
      q(e);
    }
  }
  function q(e) {
    if (!(I !== e || e.ended || e.generative))
      try {
        let t = _(e.ctx, e.fade);
        (t.start(), (e.generative = t), (N = `generative`), se(e));
      } catch (e) {
        console.error(`Không phát được nhạc nền tổng hợp`, e);
      }
  }
  function J(e) {
    let t = te(e);
    if (!t) return null;
    try {
      let e = t.ctx.createGain();
      return (
        (e.gain.value = 0),
        e.connect(t.duck),
        {
          ctx: t.ctx,
          fade: e,
          faded: !1,
          current: null,
          next: null,
          generative: null,
          prepareTimer: null,
          ended: !1,
          loop: null,
        }
      );
    } catch {
      return null;
    }
  }
  function de(e, t) {
    if (e.ended) return;
    ((e.ended = !0), e.prepareTimer !== null && b(e.prepareTimer), (e.prepareTimer = null));
    let r = e.current;
    if (r) {
      let t = r.offset + Math.max(0, e.ctx.currentTime - r.when);
      V =
        t < r.endAt - r.when + r.offset - 6 - 2
          ? { index: r.index, offset: t }
          : { index: e.loop ?? (r.index + 1) % n.length, offset: 0 };
    }
    (ee(e.fade.gain, e.ctx, 0, t), e.generative?.stop(t));
    let i = [e.current, e.next];
    ((e.current = null),
      (e.next = null),
      v(
        () => {
          for (let e of i)
            if (e) {
              e.source.onended = null;
              try {
                e.source.stop();
              } catch {}
              try {
                (e.source.disconnect(), e.gain.disconnect());
              } catch {}
            }
          try {
            e.fade.disconnect();
          } catch {}
        },
        Math.ceil(t * 1e3) + 80,
      ));
  }
  async function fe(t) {
    let r = e.getOutput?.() ?? null;
    if (!r) return null;
    if (r.ctx.state !== `running` && r.ctx.state !== `closed`)
      try {
        r.ctx.resume().catch(() => void 0);
      } catch {}
    let i = J(r);
    if (!i) return null;
    if (((I = i), (T = w()), p() || n.length === 0 || T === `tong-hop`)) return (q(i), N);
    let a = typeof T == `number` ? T : null;
    i.loop = a;
    let o =
        a === null
          ? (V ?? { index: Math.min(n.length - 1, Math.floor(m() * n.length)), offset: 0 })
          : V?.index === a
            ? V
            : { index: a, offset: 0 },
      s = await W(o.index, i.ctx).catch(() => null);
    if (t !== P || j || I !== i || i.ended) return null;
    if (!s) return (q(i), N);
    try {
      let e = o.offset < s.buffer.duration - 1 ? o.offset : 0,
        t = ce(i, o.index, s, i.ctx.currentTime, e, 0);
      ((i.current = t), (V = null), G([o.index]), le(i, t), (N = `track`), se(i));
    } catch {
      q(i);
    }
    return N;
  }
  function pe(e) {
    ((M = !1),
      (P += 1),
      (F = null),
      (N = null),
      A !== null && b(A),
      (A = null),
      I && de(I, e),
      (I = null),
      B.clear());
  }
  function Y() {
    if (j) return Promise.resolve(null);
    if (M) return F ?? Promise.resolve(N);
    if (!e.getOutput?.()) return Promise.resolve(null);
    ((M = !0), (P += 1));
    let t = P;
    ((O = x(u()).live), ne(), A !== null && b(A), (A = v(U, mt)));
    let n = fe(t)
      .catch((e) => (console.error(`Nhạc nền lỗi khi bắt đầu`, e), null))
      .then((e) => (t === P && (F = null), t === P ? e : null));
    return ((F = n), n);
  }
  let X = C
    ? S.onChange(() => {
        let e = w();
        e !== T && ((T = e), M && !j && (pe(2), (V = null), Y()));
      })
    : () => void 0;
  return {
    start: Y,
    stop(e = 2) {
      !j && M && pe(e);
    },
    isPlaying: () => M && !j,
    getMode: () => (M && !j ? N : null),
    setVolume(e) {
      if (!(typeof e != `number` || Number.isNaN(e)) && ((E = wt(e)), L))
        try {
          L.channel.gain.setTargetAtTime(E, L.ctx.currentTime, 0.05);
        } catch {}
    },
    getVolume: () => E,
    setCues(e) {
      ((D = { chant: e.chant, bell: e.bell, meditation: e.meditation }), ne());
    },
    dispose() {
      if (!j) {
        (pe(0.05), (j = !0), X(), z.clear());
        try {
          (L?.duck.disconnect(), L?.channel.disconnect());
        } catch {}
        L = null;
      }
    },
  };
}
var Et = e({ offerSoundHint: () => Ft }),
  Dt = `chua-device:sound-hint`,
  Ot = `Chùa đang mở nhạc nền và tiếng mõ. Bấm Tắt cho yên lặng, hay chỉnh ở nút loa.`,
  kt = `Tắt`,
  At = `Để vậy`,
  jt = 5e3,
  Mt = 15e3,
  Nt = 6e3;
function Pt() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function Ft(e) {
  let t = e.storage === void 0 ? Pt() : e.storage,
    n = e.doc === void 0 ? (typeof document < `u` ? document : null) : e.doc,
    r = () => {
      try {
        return t?.getItem(Dt) != null;
      } catch {
        return !0;
      }
    },
    i = () => {
      try {
        return t ? (t.setItem(Dt, String(Date.now())), !0) : !1;
      } catch {
        return !1;
      }
    };
  if (r()) return () => void 0;
  let a,
    o = 0,
    s = !1,
    c = !1,
    l = () => {
      let t = e.store.getSettings();
      return t.sound && (t.musicOn || t.moLoopOn) && e.audio.getOutput?.() != null && n?.hidden !== !0;
    },
    d = () => {
      (clearTimeout(a), (a = void 0), s && e.show(null), (s = !1));
    },
    f = () => {
      ((c = !0), d());
    };
  function p() {
    ((a = void 0),
      !c &&
        l() &&
        (e.busy() || e.owner() !== null
          ? o++ < 10 && (a = setTimeout(p, Nt))
          : i()
            ? ((s = !0),
              u(`sound_hint`, { action: `shown` }),
              e.show(Ot, [
                {
                  label: kt,
                  run: () => {
                    (u(`sound_hint`, { action: `off` }), e.mute(), f());
                  },
                },
                {
                  label: At,
                  run: () => {
                    (u(`sound_hint`, { action: `keep` }), f());
                  },
                },
              ]),
              (a = setTimeout(f, Mt)))
            : (c = !0)));
  }
  function m() {
    c || (s ? l() || f() : a === void 0 && l() && (a = setTimeout(p, jt)));
  }
  let h = e.audio.onUnlock?.(m),
    g = e.store.subscribe(m);
  return (
    m(),
    () => {
      (f(), h?.(), g());
    }
  );
}
export {
  de as a,
  he as c,
  K as d,
  ce as f,
  S as h,
  ye as i,
  W as l,
  le as m,
  dt as n,
  J as o,
  se as p,
  Re as r,
  q as s,
  Et as t,
  G as u,
};
