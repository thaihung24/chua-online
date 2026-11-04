const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./analytics-DZFCkC1C.js",
      "./rolldown-runtime-DK3Fl9T5.js",
      "./feedback-DXIikpVD.js",
      "./lazy-shared-D8DtrU9N.js",
      "./app-z_oU8L_u.js",
      "./preload-helper-CRzLMJPS.js",
      "./dialog-DwXghOMX.js",
      "./progress-core-C9e35Hb5.js",
      "./three-BbSp8N3g.js",
      "./sky-X0ndF2_S.js",
      "./layout-DpGLadzd.js",
      "./lanterns-DsoFXr0b.js",
      "./vn-time-DznqUr4I.js",
      "./music-mix-9H0C50bM.js",
      "./app-DmNuXdg1.css",
      "./feedback-B6ZrHuwT.css",
      "./account-B3fmTrbD.js",
      "./account-BGP7C-gf.css",
      "./progress-BuhROEX9.js",
      "./rituals-DFATLOei.js",
      "./water-paths-DYM7yuBe.js",
      "./rituals-CrEmldgK.css",
      "./streak-tiers-B_2fwVfy.js",
      "./progress-4zgJG7wY.css",
      "./mixer-DiQvZD4y.js",
      "./mixer-CY2iR-J5.css",
      "./gfx-CfJZxk8t.js",
      "./gfx-Brb8eFya.css",
      "./rank-ZzKaf5p8.js",
      "./rank-B9d2QP2o.css",
      "./friends-AJd_o965.js",
      "./friends-CB78mI0D.css",
      "./panels-eXTHTxRv.js",
      "./panels-Czaigd4H.css",
      "./updates-BQVStjbI.js",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { t } from "./preload-helper-CRzLMJPS.js";
import { n, r, t as i } from "./referral-CM6Fj8ux.js";
import { n as a, o, r as s } from "./dialog-DwXghOMX.js";
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes) e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      (t.credentials =
        e.crossOrigin === `use-credentials`
          ? `include`
          : e.crossOrigin === `anonymous`
            ? `omit`
            : `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var c = {
    name: `Chùa Sen`,
    tagline: `Chùa online 3D miễn phí: đi chùa, tụng kinh`,
    description: `Chùa Sen là chùa online 3D miễn phí: đi chùa, lễ Phật, thắp hương, tụng kinh cùng mọi người ngay trên điện thoại, không cần đăng ký, không cần cài đặt.`,
  },
  l = {
    name: `Ben Piaz`,
    handle: `@benpiaz`,
    url: `https://www.youtube.com/@benpiaz/?sub_confirmation=1`,
    tagline: `Kênh học AI · Người làm Chùa Sen`,
  },
  u = { utcOffsetHours: 7, dayStartHour: 6, nightStartHour: 18 },
  d = { startHours: [5, 18], durationMinutes: 30 },
  f = {
    autoProfile: !1,
    progression: !0,
    waterRituals: !0,
    phrases: !0,
    listenChoice: !0,
    dharmaTalks: !0,
    wishTree: !0,
  },
  p = {
    supabaseUrl: `https://ajowpftzikqpcnxczpvx.supabase.co`,
    publishableKey: `sb_publishable_5oFWxYEGvlNi2UanRRPsMQ_V8i6YUm4`,
    googleClientId: `294372915892-vc0rl593kcu6upr7j0n144bdinjfm81e.apps.googleusercontent.com`,
  },
  m = `chuasen-auth`,
  h = `chuasen-google-return`,
  g = `chuasen-admin-badge`;
function _() {
  try {
    return localStorage.getItem(m) !== null;
  } catch {
    return !1;
  }
}
function v() {
  try {
    return sessionStorage.getItem(h) !== null;
  } catch {
    return !1;
  }
}
var y = `chuasen-friend-invite`;
function b() {
  try {
    return localStorage.getItem(y) !== null;
  } catch {
    return !1;
  }
}
var x = {},
  S = [`volume`, `ambientVolume`, `sfxVolume`, `chantVolume`],
  C = Object.freeze({ volume: 0.85, ambientVolume: 1, sfxVolume: 1, chantVolume: 1 }),
  w = Object.freeze({ music: `musicVolume`, mo: `moVolume`, chant: `chantVolume`, sfx: `sfxVolume` }),
  T = Object.freeze({ musicOn: !0, musicVolume: 1, moLoopOn: !0, moVolume: 1 }),
  E = Object.freeze({ volume: 0.8, ambientVolume: 0.6, sfxVolume: 1, chantVolume: 0.6 });
function ee(e) {
  return { ...e, moVolume: e.sfxVolume, moLoopOn: e.musicOn };
}
function D(e) {
  let t = { ...e };
  for (let e of S) t[e] === E[e] && (t[e] = C[e]);
  return t;
}
var O = (e) => e * e,
  k = (e) => 10 ** (e / 20),
  A = Object.freeze({ threshold: -6, knee: 0, ratio: 4, attack: 0.003, release: 0.25 });
function j(e) {
  "@babel/helpers - typeof";
  return (
    (j =
      typeof Symbol == `function` && typeof Symbol.iterator == `symbol`
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e && typeof Symbol == `function` && e.constructor === Symbol && e !== Symbol.prototype
              ? `symbol`
              : typeof e;
          }),
    j(e)
  );
}
function M(e, t) {
  if (j(e) != `object` || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || `default`);
    if (j(r) != `object`) return r;
    throw TypeError(`@@toPrimitive must return a primitive value.`);
  }
  return (t === `string` ? String : Number)(e);
}
function te(e) {
  var t = M(e, `string`);
  return j(t) == `symbol` ? t : t + ``;
}
function N(e, t, n) {
  return (
    (t = te(t)) in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  );
}
var ne = C.volume,
  re = 3,
  ie = 32,
  ae = 4,
  P = 1e-4,
  oe = 0.02,
  se = { mo: 1, bell: 0.75, khanh: 0.6, bead: 0.5, soft: 0.5 },
  ce = (e) => Math.min(1, Math.max(0, e)),
  F = (e, t) => e + Math.random() * (t - e),
  le = (e, t) => e * (1 + F(-t, t));
function ue() {
  let e = globalThis;
  return e.AudioContext ?? e.webkitAudioContext ?? null;
}
function de(e) {
  try {
    let t = navigator;
    t.audioSession && (t.audioSession.type = e);
  } catch {}
}
function fe(e, t, n, r, i) {
  (e.setValueAtTime(P, t),
    e.linearRampToValueAtTime(Math.max(n, P), t + r),
    e.exponentialRampToValueAtTime(P, t + r + i));
}
var pe = class {
  constructor(e, t, n, r, i, a) {
    (N(this, `name`, void 0),
      N(this, `ctx`, void 0),
      N(this, `noise`, void 0),
      N(this, `onDone`, void 0),
      N(this, `out`, void 0),
      N(this, `killed`, !1),
      N(this, `nodes`, []),
      N(this, `sources`, []),
      N(this, `live`, 0),
      N(this, `done`, !1),
      (this.name = e),
      (this.ctx = t),
      (this.noise = n),
      (this.onDone = a),
      (this.out = this.track(t.createGain())),
      (this.out.gain.value = i),
      this.out.connect(r));
  }
  track(e) {
    return (this.nodes.push(e), e);
  }
  begin(e, t) {
    ((e.onended = () => {
      (--this.live, this.live <= 0 && this.dispose());
    }),
      e.stop(t),
      this.sources.push(e),
      (this.live += 1));
  }
  oscillator(e, t, n, r, i) {
    let a = this.track(this.ctx.createOscillator());
    ((a.type = e.type),
      e.glideFrom === void 0
        ? a.frequency.setValueAtTime(t, r)
        : (a.frequency.setValueAtTime(e.glideFrom, r),
          a.frequency.exponentialRampToValueAtTime(t, r + (e.glideTime ?? 0.03))),
      a.connect(n),
      a.start(r),
      this.begin(a, i));
  }
  tone(e, t) {
    let n = this.track(this.ctx.createGain());
    (fe(n.gain, t, e.beat ? e.peak / 2 : e.peak, e.attack, e.decay), n.connect(this.out));
    let r = t + e.attack + e.decay + 0.03;
    (this.oscillator(e, e.freq, n, t, r), e.beat && this.oscillator(e, e.freq + e.beat, n, t, r));
  }
  burst(e, t) {
    let n = this.track(this.ctx.createBufferSource());
    n.buffer = this.noise;
    let r = this.track(this.ctx.createBiquadFilter());
    ((r.type = e.filter), (r.frequency.value = e.freq), (r.Q.value = e.q));
    let i = this.track(this.ctx.createGain());
    (fe(i.gain, t, e.peak, e.attack, e.decay), n.connect(r), r.connect(i), i.connect(this.out));
    let a = e.attack + e.decay + 0.03,
      o = Math.random() * Math.max(0, this.noise.duration - a - 0.05);
    (n.start(t, o), this.begin(n, t + a));
  }
  kill() {
    if (this.done || this.killed) return;
    this.killed = !0;
    let e = this.ctx.currentTime,
      t = this.out.gain;
    try {
      (t.cancelScheduledValues(e), t.setValueAtTime(t.value, e), t.setTargetAtTime(0, e, 0.05));
      for (let t of this.sources) t.stop(e + 0.3);
    } catch {}
  }
  dispose() {
    if (!this.done) {
      this.done = !0;
      for (let e of this.sources) e.onended = null;
      for (let e of this.nodes)
        try {
          e.disconnect();
        } catch {}
      this.onDone(this);
    }
  }
};
function me(e, t) {
  let n = F(380, 520);
  (e.burst(
    { filter: `bandpass`, freq: F(1e3, 2e3), q: 1.4, peak: F(0.35, 0.5), attack: 0.001, decay: 0.014 },
    t,
  ),
    e.tone(
      {
        type: `sine`,
        freq: n,
        glideFrom: n * 1.3,
        glideTime: 0.035,
        peak: F(0.8, 0.95),
        attack: 0.002,
        decay: F(0.12, 0.18),
      },
      t,
    ),
    e.tone({ type: `triangle`, freq: n * F(2, 2.3), peak: 0.2, attack: 0.001, decay: 0.05 }, t));
}
var he = [
    { ratio: 0.5, amp: 0.5, decay: 12, beat: 0.35 },
    { ratio: 1, amp: 1, decay: 11, beat: 0.7 },
    { ratio: 1.19, amp: 0.55, decay: 9.5 },
    { ratio: 1.5, amp: 0.5, decay: 8.5, beat: 1.1 },
    { ratio: 2, amp: 0.4, decay: 7.5 },
    { ratio: 2.6, amp: 0.22, decay: 6.8 },
    { ratio: 3, amp: 0.16, decay: 6.3 },
    { ratio: 4.1, amp: 0.1, decay: 6 },
  ],
  ge = 0.28;
function _e(e, t) {
  let n = le(130, 0.004);
  e.burst({ filter: `lowpass`, freq: 1800, q: 0.7, peak: 0.18, attack: 0.002, decay: 0.04 }, t);
  for (let r of he)
    e.tone(
      {
        type: `sine`,
        freq: n * r.ratio,
        peak: r.amp * ge,
        attack: 0.012,
        decay: r.decay,
        ...(r.beat !== void 0 && { beat: r.beat }),
      },
      t,
    );
}
function ve(e, t) {
  let n = le(780, 0.02);
  (e.burst({ filter: `highpass`, freq: 3500, q: 0.7, peak: 0.12, attack: 0.001, decay: 0.012 }, t),
    e.tone({ type: `sine`, freq: n, peak: 0.8, attack: 0.003, decay: 4, beat: 1.8 }, t),
    e.tone({ type: `sine`, freq: n * 2.7, peak: 0.4, attack: 0.003, decay: 3.2 }, t),
    e.tone({ type: `sine`, freq: n * 5.4, peak: 0.18, attack: 0.003, decay: 2.2 }, t));
}
function ye(e, t) {
  (e.burst({ filter: `highpass`, freq: F(3500, 5e3), q: 0.7, peak: 0.28, attack: 0.001, decay: 0.02 }, t),
    e.tone({ type: `sine`, freq: F(2e3, 3e3), peak: 0.14, attack: 0.001, decay: 0.035 }, t));
}
function be(e, t) {
  (e.tone({ type: `sine`, freq: 880, peak: 0.5, attack: 0.01, decay: 0.6 }, t),
    e.tone({ type: `sine`, freq: 1320, peak: 0.22, attack: 0.01, decay: 0.45 }, t));
}
var xe = { mo: me, bell: _e, khanh: ve, bead: ye, soft: be };
function Se() {
  let e = null,
    t = null,
    n = null,
    r = !1,
    i = !1,
    a = !1,
    o = `ambient`,
    s = ne,
    c = { music: 1, mo: 1, chant: 1, sfx: 1 },
    l = {},
    u = null,
    d = new Set(),
    f = new Set(),
    p = new Set(),
    m = () => (a ? 0 : O(s));
  function h(t, n) {
    if (e && t)
      try {
        let r = t.gain,
          i = e.currentTime;
        (r.cancelScheduledValues(i), r.setValueAtTime(r.value, i), r.setTargetAtTime(n, i, oe));
      } catch {}
  }
  function g(n) {
    if (!e || !t) return null;
    let r = l[n];
    if (!r)
      try {
        ((r = e.createGain()), (r.gain.value = c[n]), r.connect(t), (l[n] = r));
      } catch {
        return null;
      }
    return r;
  }
  function _(e, t) {
    if (typeof t != `number` || Number.isNaN(t) || !(e in c)) return;
    let n = ce(t);
    n !== c[e] && ((c[e] = n), h(l[e], n));
  }
  function v() {
    (p.clear(), (l = {}), (e = null), (t = null), (n = null), (r = !1), (i = !1));
  }
  function y() {
    if ((e && e.state === `closed` && v(), e)) return e;
    let n = ue();
    if (!n) return null;
    try {
      de(o);
      let r = new n({ latencyHint: `interactive` }),
        i = r.createDynamicsCompressor();
      ((i.threshold.value = A.threshold),
        (i.knee.value = A.knee),
        (i.ratio.value = A.ratio),
        (i.attack.value = A.attack),
        (i.release.value = A.release));
      let a = r.createGain();
      return ((a.gain.value = m()), a.connect(i), i.connect(r.destination), (e = r), (t = a), r);
    } catch {
      return ((e = null), (t = null), null);
    }
  }
  function b(e) {
    if (n) return n;
    let t = Math.max(1, Math.floor(e.sampleRate)),
      r = e.createBuffer(1, t, e.sampleRate),
      i = r.getChannelData(0);
    for (let e = 0; e < i.length; e += 1) i[e] = Math.random() * 2 - 1;
    return ((n = r), r);
  }
  function x(e) {
    if (!i)
      try {
        let t = e.createBufferSource();
        ((t.buffer = e.createBuffer(1, 1, 22050)),
          t.connect(e.destination),
          (t.onended = () => {
            try {
              t.disconnect();
            } catch {}
          }),
          t.start(0),
          (i = !0));
      } catch {}
  }
  function S(e) {
    if (e.state !== `running`)
      try {
        e.resume().catch(() => void 0);
      } catch {}
  }
  function C() {
    for (let e of [...d])
      try {
        e();
      } catch (e) {
        console.error(`Lỗi trong hàm lắng nghe mở khoá âm thanh`, e);
      }
  }
  function w(e) {
    (e === `playback` && (o = `playback`), de(o));
    let t = y();
    if (!t) return Promise.resolve();
    let n = !r;
    ((r = !0), n && d.size > 0 && queueMicrotask(C));
    let i = Promise.resolve();
    if (t.state !== `running`)
      try {
        i = t.resume().catch(() => void 0);
      } catch {}
    return (x(t), i);
  }
  function T(n, i) {
    try {
      if (a || !r || !e || !t) return;
      let o = e,
        s = i?.bus === `mo` ? `mo` : `sfx`,
        l = i?.volume,
        d = l === void 0 || Number.isNaN(l) ? 1 : ce(l),
        m = d * c[s] > 0 ? g(s) : null;
      if (!m) return;
      let h = i?.delay,
        _ = h !== void 0 && Number.isFinite(h) ? Math.max(0, h) : 0;
      if ((S(o), o.state !== `running` && p.size >= ae)) return;
      if (n === `bell`) {
        let e = [...p].filter((e) => e.name === `bell` && !e.killed);
        for (; e.length >= re;) e.shift()?.kill();
      } else if (p.size >= ie) return;
      let v = new pe(n, o, b(o), m, d * se[n], (e) => p.delete(e));
      p.add(v);
      try {
        (u?.[n] ?? xe[n])(v, o.currentTime + _);
      } catch {
        v.dispose();
        return;
      }
      for (let e of [...f])
        try {
          e(n, i);
        } catch (e) {
          console.error(`Lỗi trong hàm lắng nghe tiếng phát`, e);
        }
    } catch {}
  }
  return {
    unlock: w,
    play: T,
    now: () => (e ? e.currentTime : 0),
    isMuted: () => a,
    setMuted(e) {
      ((a = !!e), h(t, m()));
    },
    getOutput(n) {
      if (!e || !t || e.state === `closed`) return null;
      let r = n ? g(n) : t;
      return r ? { ctx: e, destination: r } : null;
    },
    getVolume: () => s,
    setVolume(e) {
      typeof e != `number` || Number.isNaN(e) || ((s = ce(e)), h(t, m()));
    },
    setBusVolume: _,
    getSfxVolume: () => c.sfx,
    setSfxVolume: (e) => _(`sfx`, e),
    setTimbre(e) {
      u = e;
    },
    onUnlock(e) {
      return (
        d.add(e),
        () => {
          d.delete(e);
        }
      );
    },
    onPlay(e) {
      return (
        f.add(e),
        () => {
          f.delete(e);
        }
      );
    },
  };
}
function Ce(e = 12) {
  if (
    typeof navigator < `u` &&
    `vibrate` in navigator &&
    (!navigator.userActivation || navigator.userActivation.hasBeenActive)
  )
    try {
      navigator.vibrate(e);
    } catch {}
}
var we = 5,
  Te = 200,
  I = [],
  Ee = !1;
function De(e) {
  let t = /^(data|blob):/.exec(e);
  if (t) return t[1];
  let n = e.split(/[?#]/)[0] ?? ``;
  return n.slice(n.lastIndexOf(`/`) + 1);
}
var Oe =
  /zaloJSV2|WeixinJSBridge|_AutofillCallbackHandler|instantSearchSDKJSBridgeClearHighlight|__gCrWeb|^Script error\.?$/;
function ke(e) {
  let t = e.replace(/\s+/g, ` `).trim();
  if (t === `` || Oe.test(t)) return;
  let n = new Date().toTimeString().slice(0, 8),
    r = I[I.length - 1];
  r?.text === t ? ((r.n += 1), (r.at = n)) : (I.push({ at: n, text: t, n: 1 }), I.length > we && I.shift());
}
function Ae(e, t = ``) {
  let n;
  try {
    n = e instanceof Error ? `${e.name}: ${e.message}` : String(e ?? t);
  } catch {
    n = t;
  }
  return n.replace(/^Uncaught /, ``);
}
function je(e) {
  if (e.target === e.currentTarget)
    try {
      let t = e.filename ? ` (${De(e.filename)}${e.lineno ? `:${e.lineno}` : ``})` : ``;
      ke(`${Ae(e.error ?? e.message, e.message)}${t}`);
    } catch {}
}
function Me(e) {
  let t = e instanceof Error ? /(\S+?):(\d+):\d+\)?$/m.exec(e.stack ?? ``) : null;
  return t ? ` (${De(t[1])}:${t[2]})` : ``;
}
function Ne(e) {
  try {
    let t = e.reason;
    if (t?.name === `AbortError`) {
      e.preventDefault();
      return;
    }
    ke(`(promise) ${Ae(t, `unhandled rejection`)}${Me(t)}`);
  } catch {}
}
function Pe(e, t) {
  try {
    ke(`(${t}) ${Ae(e, `unknown error`)}${Me(e)}`);
  } catch {}
}
function Fe(e) {
  let t = `unknown`,
    n = ``;
  try {
    ((t = e instanceof Error ? e.name : typeof e), (n = e instanceof Error ? e.message : String(e)));
  } catch {}
  return (
    (n = n
      .replace(/\b(?:[a-z][\w+.-]*:\/\/|data:|blob:)\S+/gi, (e) => De(e) || `url`)
      .replace(/\S+@\S+/g, `…`)
      .replace(/\s+/g, ` `)
      .trim()),
    n.length > 80 && (n = `${n.slice(0, 79)}…`),
    `${t.slice(0, 40)}: ${n}`
  );
}
function Ie() {
  Ee ||
    typeof window > `u` ||
    ((Ee = !0), window.addEventListener(`error`, je), window.addEventListener(`unhandledrejection`, Ne));
}
function Le() {
  return I.map(({ at: e, text: t, n }) => {
    let r = `${e} `,
      i = n > 1 ? ` ×${n}` : ``,
      a = Te - r.length - i.length;
    return `${r}${t.length > a ? `${t.slice(0, a - 1)}…` : t}${i}`;
  });
}
var Re = { basics: 1, offerings: 2, lights: 3, wardrobe: 4, release: 4 },
  ze = { practice: `Tu tập`, offering: `Dâng lễ`, explore: `Khám phá`, spread: `Lan tỏa`, more: `Thêm nữa` },
  { basics: L, offerings: Be, lights: Ve, wardrobe: He, release: Ue } = Re,
  R = [
    { id: `pray`, minLevel: L, label: `Chắp tay`, group: `dock` },
    { id: `bow`, minLevel: L, label: `Lạy Phật`, group: `dock` },
    { id: `sweep`, minLevel: L, label: `Quét lá đa`, group: `dock` },
    { id: `beads`, minLevel: L, label: `Tràng hạt`, group: `dock` },
    { id: `phrases`, minLevel: L, label: `Câu nói`, group: `dock` },
    { id: `chant`, minLevel: L, label: `Tụng kinh`, group: `practice` },
    { id: `meditate`, minLevel: L, label: `Thiền`, group: `practice` },
    { id: `sit`, minLevel: L, label: `Ngồi xuống`, group: `practice` },
    { id: `incense`, minLevel: L, label: `Thắp hương`, group: `offering` },
    { id: `stroll`, minLevel: L, label: `Đi dạo`, group: `explore` },
    { id: `share`, minLevel: L, label: `Khoe thành tích`, group: `spread` },
    { id: `kol`, minLevel: L, label: `Chương trình KOL`, group: `spread` },
    { id: `fanpage`, minLevel: 1, label: `Fanpage Chùa Sen`, group: `spread` },
    { id: `flower`, minLevel: Be, label: `Dâng hoa`, group: `more` },
    { id: `bell`, minLevel: Be, label: `Thỉnh chuông`, group: `more` },
    { id: `candle`, minLevel: Ve, label: `Thắp nến`, group: `more` },
    { id: `lantern`, minLevel: Ve, label: `Thả đèn hoa đăng`, group: `more` },
    { id: `ribbon`, minLevel: Ve, label: `Treo nguyện`, group: `more` },
    { id: `today`, minLevel: Be, label: `Hôm nay`, group: `more` },
    { id: `talks`, minLevel: Be, label: `Pháp thoại`, group: `more` },
    { id: `wardrobe`, minLevel: He, label: `Trang phục`, group: `more` },
    { id: `mindful`, minLevel: Be, label: `Thiền hành`, group: `more` },
    { id: `xinque`, minLevel: 2, label: `Xin quẻ`, group: `more` },
    { id: `release`, minLevel: Ue, label: `Phóng sinh`, group: `more` },
    { id: `loc`, minLevel: Be, label: `Hái lộc`, group: `more` },
  ];
function We(e) {
  return typeof e == `number` && Number.isFinite(e) && e >= 1 ? Math.floor(e) : 1;
}
function Ge(e) {
  return R.find((t) => t.id === e);
}
function Ke(e, t, n = {}) {
  if (n.all === !0) return !0;
  let r = Ge(e);
  return r === void 0 || We(t) >= r.minLevel;
}
function qe(e) {
  return R.filter((t) => t.minLevel === e);
}
function Je(e) {
  let t = We(e),
    n = 1 / 0;
  for (let e of R) e.minLevel > t && e.minLevel < n && (n = e.minLevel);
  return R.filter((e) => e.minLevel === n);
}
function Ye(e) {
  let t = e[0];
  return t ? `Lên cấp ${t.minLevel} để mở: ${e.map((e) => e.label).join(`, `)}` : ``;
}
function Xe(e, t) {
  return t.dharmaTalks && t.waterRituals && t.wishTree
    ? e
    : e.filter(
        (e) =>
          (t.dharmaTalks || e.id !== `talks`) &&
          (t.waterRituals || e.id !== `release`) &&
          (t.wishTree || (e.id !== `loc` && e.id !== `ribbon`)),
      );
}
function Ze(e) {
  let t = Ge(e);
  return t ? `Lên cấp ${t.minLevel} để mở ${t.label}.` : ``;
}
var Qe = `phc_pcytvbAAmVGgy3VcDSdihB9cdWJeQZiTEJUNi7pyPg6b`,
  $e = `https://us.i.posthog.com`,
  et = 50,
  tt = null,
  nt = !1,
  rt = [],
  it = null;
function at() {
  return Qe.startsWith(`phc_`);
}
function ot() {
  if (typeof navigator > `u`) return !1;
  let e = navigator,
    t = globalThis;
  return e.doNotTrack === `1` || e.msDoNotTrack === `1` || t.doNotTrack === `1`;
}
function st() {
  if (nt || !at() || ot() || typeof window > `u`) return;
  nt = !0;
  let e = () => {
    t(
      async () => {
        let { default: e } = await import(`./analytics-DZFCkC1C.js`).then((e) => e.t);
        return { default: e };
      },
      __vite__mapDeps([0, 1]),
      import.meta.url,
    )
      .then(({ default: e }) => {
        let t = new e(Qe, {
          host: $e,
          persistence: `localStorage`,
          personProfiles: `identified_only`,
          autocapture: !1,
          captureHistoryEvents: !1,
          preloadFeatureFlags: !1,
          flushAt: 10,
          flushInterval: 1e4,
        });
        (t.register({ ...it, site: `chuasen`, app_version: `0.9.31` }),
          (it = null),
          t.capture(`$pageview`, { $current_url: location.origin + location.pathname }),
          (tt = t),
          document.addEventListener(`visibilitychange`, () => {
            document.visibilityState === `hidden` && t.flush().catch(() => void 0);
          }));
        for (let [e, n] of rt.splice(0)) t.capture(e, n);
      })
      .catch(() => {
        ((rt.length = 0), (it = null));
      });
  };
  `requestIdleCallback` in window ? window.requestIdleCallback(e, { timeout: 4e3 }) : setTimeout(e, 2e3);
}
function z(e, t) {
  if (nt) {
    if (tt)
      try {
        tt.capture(e, t);
      } catch {}
    else rt.length < et && rt.push([e, t]);
  }
}
function ct(e) {
  if (nt) {
    if (tt)
      try {
        tt.register(e);
      } catch {}
    else it = { ...it, ...e };
  }
}
var lt = `chua-online:features`;
function ut(e) {
  return e.hasProfile || e.practiced;
}
function dt(e, t = 0) {
  return t > 0 || Object.values(e).some((e) => typeof e == `number` && e > 0);
}
function ft(e) {
  return e.progressUi === !1;
}
var pt = new Set(R.map((e) => e.id));
function mt(e) {
  if (typeof e != `object` || !e) return null;
  let t = e;
  if (typeof t.v != `number` || t.v < 1 || typeof t.gf != `boolean`) return null;
  let n = Array.isArray(t.fresh)
    ? [...new Set(t.fresh.filter((e) => typeof e == `string` && pt.has(e)))]
    : [];
  return { legacy: t.gf, all: typeof t.all == `boolean` ? t.all : t.gf, level: We(t.level), fresh: n };
}
function ht() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function gt(e = {}) {
  let t = e.storage === void 0 ? ht() : e.storage,
    n = e.progression ?? f.progression,
    r = e.track ?? z,
    i = new Set(),
    a = !1,
    o = () => {
      try {
        let e = t?.getItem(lt);
        return e ? mt(JSON.parse(e)) : null;
      } catch {
        return null;
      }
    },
    s = () => {
      try {
        t?.setItem(lt, JSON.stringify({ v: 1, gf: l.legacy, all: l.all, level: l.level, fresh: l.fresh }));
      } catch {}
    },
    c = o(),
    l = c ?? u();
  c || s();
  function u() {
    let t = ut(e.legacy?.() ?? { hasProfile: !1, practiced: !1 });
    return { legacy: t, all: t, level: 1, fresh: [] };
  }
  let d = () => !n || a,
    p = () => l.all || d(),
    m = (e) => Ke(e, l.level, { all: p() }),
    h = () => {
      for (let e of [...i]) e();
    },
    g = (e) => {
      if (e.key !== `chua-online:features` && e.key !== null) return;
      let t = o();
      (t && (l = t), h());
    },
    _ = (e) => {
      l.fresh.includes(e) && ((l = { ...l, fresh: l.fresh.filter((t) => t !== e) }), s(), h());
    };
  return {
    snapshot() {
      let e = p(),
        t = new Set();
      for (let e of Xe(R, f)) m(e.id) && t.add(e.id);
      return {
        level: l.level,
        all: e,
        forced: d(),
        legacy: l.legacy,
        unlocked: t,
        fresh: new Set(l.fresh.filter((e) => t.has(e))),
        next: e ? [] : Xe(Je(l.level), f),
      };
    },
    isUnlocked: m,
    attempt(e) {
      return m(e) ? (_(e), null) : Ze(e);
    },
    markUsed: _,
    showAll: () => l.all,
    setShowAll(e) {
      l.all !== e && ((l = { ...l, all: e }), s(), h());
    },
    setLevel(e) {
      let t = We(e);
      if (t === l.level) return;
      let n = [...l.fresh];
      if (t > l.level && !p())
        for (let e of R)
          e.minLevel <= l.level ||
            e.minLevel > t ||
            (n.includes(e.id) || n.push(e.id), r(`feature_unlocked`, { id: e.id, level: t }));
      ((l = { ...l, level: t, fresh: n }), s(), h());
    },
    setProgressHidden(e) {
      a !== e && ((a = e), h());
    },
    onChange(e) {
      return (
        i.add(e),
        i.size === 1 && typeof window < `u` && window.addEventListener(`storage`, g),
        () => {
          i.delete(e) && i.size === 0 && typeof window < `u` && window.removeEventListener(`storage`, g);
        }
      );
    },
  };
}
var _t = null;
function vt(e) {
  return ((_t ??= gt({ legacy: e })), _t);
}
function yt() {
  return ((_t ??= gt()), _t);
}
function bt(e = yt()) {
  let t = e.snapshot();
  return t.all ? null : t.level;
}
function xt(e, t) {
  let n = () => {
    let n = t.view();
    e.setLevel(n.day === null ? null : n.level);
  };
  return (n(), t.onChange(n));
}
var St = {
  bow: `bow`,
  beads: `beads`,
  chant: `chant`,
  meditate: `meditate`,
  sit: `sit`,
  incense: `incense`,
  flowers: `flower`,
  bell: `bell`,
  candle: `candle`,
  lantern: `lantern`,
  loc: `loc`,
  today: `today`,
  talks: `talks`,
  share: `share`,
  outfit: `wardrobe`,
  sweep: `sweep`,
  goYard: `stroll`,
  goBodhi: `stroll`,
  goMeditate: `stroll`,
  goQuanAm: `stroll`,
  goWell: `stroll`,
  goHall: `stroll`,
  mindful: `mindful`,
  xinque: `xinque`,
  release: `release`,
};
function Ct(e) {
  return St[e] ?? null;
}
var wt = {
  altar: `bow`,
  incense: `incense`,
  bell: `bell`,
  cushion: `sit`,
  pond: `lantern`,
  broom: `sweep`,
  bodhi: `loc`,
  que: `xinque`,
  release: `release`,
};
function Tt(e) {
  return wt[e] ?? null;
}
var Et = {
    beads: `<circle cx="12" cy="17.2" r="1.45"/><circle cx="17.4" cy="14.6" r="1.45"/><circle cx="6.6" cy="14.6" r="1.45"/><circle cx="18.73" cy="8.76" r="1.45"/><circle cx="5.27" cy="8.76" r="1.45"/><circle cx="15" cy="4.08" r="1.45"/><circle cx="9" cy="4.08" r="1.45"/><path d="M12 19.3v3"/>`,
    book: `<path d="M12 6.8C10.2 5.3 7.4 4.6 3.5 5v12.6c3.9-.4 6.7.3 8.5 1.8 1.8-1.5 4.6-2.2 8.5-1.8V5c-3.9-.4-6.7.3-8.5 1.8z"/><path d="M12 6.8v12.6"/>`,
    lotus: `<path d="M12 3.2c-2.2 2.2-3.2 4.7-3.2 7 0 2.2 1.4 3.7 3.2 3.7s3.2-1.5 3.2-3.7c0-2.3-1-4.8-3.2-7z"/><path d="M9.2 13.6C6.3 13.4 4.1 11.7 3 8.6c3.2-.1 5.4 1 6.5 3.1"/><path d="M14.8 13.6c2.9-.2 5.1-1.9 6.2-5-3.2-.1-5.4 1-6.5 3.1"/><path d="M8 15.4c-2.4.1-4.4-.6-6-2.1"/><path d="M16 15.4c2.4.1 4.4-.6 6-2.1"/><path d="M4.5 19c1.9 1.3 3.8 1.3 5.7 0s3.8-1.3 5.7 0 3.8 1.3 5.6 0"/>`,
    "sound-on": `<path d="M4 9.7v4.6h3.4l4.6 3.9V5.8L7.4 9.7z"/><path d="M15.6 9.1a4 4 0 0 1 0 5.8M18.4 6.5a7.7 7.7 0 0 1 0 11"/>`,
    "sound-off": `<path d="M4 9.7v4.6h3.4l4.6 3.9V5.8L7.4 9.7z"/><path d="M16 9.6l4.8 4.8M20.8 9.6L16 14.4"/>`,
    music: `<path d="M9.2 17.4V6.6l10-2.1v10.6"/><circle cx="6.9" cy="17.4" r="2.3"/><circle cx="16.9" cy="15.1" r="2.3"/>`,
    bell: `<path d="M12 3v1.8"/><path d="M5.5 17.5c1.2-1.2 1.7-2.8 1.7-4.8V10a4.8 4.8 0 0 1 9.6 0v2.7c0 2 .5 3.6 1.7 4.8z"/><path d="M10 20.4a2 2 0 0 0 4 0"/>`,
    incense: `<path d="M4.5 15.5h15v1.2a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4z"/><path d="M9 15.5V9.5M12 15.5V7.8M15 15.5V10"/><path d="M12 5.2c-1.3-1 1.3-2 0-3.2"/>`,
    flower: `<path d="M6.8 5.2c-.3 4.8 1.2 8 5.2 9 4-1 5.5-4.2 5.2-9l-2.9 2.3L12 4.2 9.7 7.5z"/><path d="M12 14.2v7"/><path d="M12 19.2c-2.8 0-4.6-1.2-5.2-3.6 2.7-.2 4.7.8 5.2 3.6z"/>`,
    lamp: `<path d="M9.5 3.6h5M9.5 18.4h5M12 18.4v3.2"/><ellipse cx="12" cy="11" rx="6.6" ry="6.2"/><path d="M12 4.8c-2.4 1.6-3.4 3.8-3.4 6.2s1 4.6 3.4 6.2c2.4-1.6 3.4-3.8 3.4-6.2S14.4 6.4 12 4.8z"/>`,
    bow: `<circle cx="12" cy="5.4" r="2.5"/><path d="M5.5 21v-2.8a6.5 6.5 0 0 1 13 0V21"/><path d="M12 13.2c-1.4 1.2-2 2.5-2 3.9l2 1.8 2-1.8c0-1.4-.6-2.7-2-3.9z"/>`,
    candle: `<path d="M12 2.6c1.7 1.9 2.4 3.3 2.4 4.5a2.4 2.4 0 0 1-4.8 0c0-1.2.7-2.6 2.4-4.5z"/><rect x="8.4" y="10.8" width="7.2" height="10.2" rx="1.4"/>`,
    copy: `<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V6.5A2.5 2.5 0 0 0 13 4H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5h2"/>`,
    check: `<path d="M4.5 12.5l5 5L19.5 7"/>`,
    play: `<path d="M8 5.5v13l11-6.5z"/>`,
    pause: `<rect x="6.5" y="5" width="3.8" height="14" rx="1.2"/><rect x="13.7" y="5" width="3.8" height="14" rx="1.2"/>`,
    stop: `<rect x="6" y="6" width="12" height="12" rx="2.5"/>`,
    reset: `<path d="M4 12.5a8 8 0 1 0 2.4-5.7L4 9.2"/><path d="M4 4.6v4.6h4.6"/>`,
    close: `<path d="M6 6l12 12M18 6L6 18"/>`,
    "chevron-left": `<path d="M14.5 5.5L8 12l6.5 6.5"/>`,
    "chevron-right": `<path d="M9.5 5.5l6.5 6.5-6.5 6.5"/>`,
    settings: `<path d="M10.45 5.28L10.65 3L13.35 3L13.55 5.28L15.66 6.15L17.41 4.68L19.32 6.59L17.85 8.34L18.72 10.45L21 10.65L21 13.35L18.72 13.55L17.85 15.66L19.32 17.41L17.41 19.32L15.66 17.85L13.55 18.72L13.35 21L10.65 21L10.45 18.72L8.34 17.85L6.59 19.32L4.68 17.41L6.15 15.66L5.28 13.55L3 13.35L3 10.65L5.28 10.45L6.15 8.34L4.68 6.59L6.59 4.68L8.34 6.15Z"/><circle cx="12" cy="12" r="2.8"/>`,
    share: `<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="5.5" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8L15.8 6.7M8.2 13.2l7.6 4.1"/>`,
    info: `<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.7h.01"/>`,
    sparkle: `<path d="M11 4q.8 7.2 7.5 8-6.7.8-7.5 8-.8-7.2-7.5-8Q10.2 11.2 11 4z"/><path d="M19 3.2v3.6M17.2 5h3.6"/>`,
    download: `<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M4.5 17.5v1A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-1"/>`,
    users: `<circle cx="9" cy="8.2" r="3.2"/><path d="M3 19.6c0-3.5 2.6-5.7 6-5.7s6 2.2 6 5.7"/><circle cx="17.2" cy="9" r="2.5"/><path d="M17.6 14c2 .4 3.4 2.1 3.4 4.4"/>`,
    trophy: `<path d="M7.5 4h9v5.2a4.5 4.5 0 0 1-9 0z"/><path d="M7.5 6H4.8c0 2.6 1 4 2.9 4.4"/><path d="M16.5 6h2.7c0 2.6-1 4-2.9 4.4"/><path d="M12 13.7V17"/><path d="M8.5 20h7M9.8 17h4.4"/>`,
    "chevron-down": `<path d="M5.5 9.5L12 16l6.5-6.5"/>`,
    more: `<circle cx="5.6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18.4" cy="12" r="1.3"/>`,
    pray: `<path d="M12 3.4C9.4 6 8 8.9 8 12.1c0 2.2.6 4 1.8 5.4L12 20.2"/><path d="M12 3.4c2.6 2.6 4 5.5 4 8.7 0 2.2-.6 4-1.8 5.4L12 20.2"/><path d="M9.8 17.5L6.2 20.6M14.2 17.5l3.6 3.1"/>`,
    seat: `<ellipse cx="12" cy="11.4" rx="7.8" ry="3.6"/><path d="M4.2 11.4v3.2c0 2 3.5 3.6 7.8 3.6s7.8-1.6 7.8-3.6v-3.2"/><path d="M12 11.4h.01M8.6 6.2c.9-1.1 2-1.6 3.4-1.6s2.5.5 3.4 1.6"/>`,
    outfit: `<path d="M9.6 3.5L6 5.4 3.5 11l2.4 1 2.1-3.3v11.8h8V8.7l2.1 3.3 2.4-1L18 5.4l-3.6-1.9"/><path d="M9.6 3.5c.6 1.3 1.4 2 2.4 2s1.8-.7 2.4-2M12 5.5c1 1.4 2.3 2.2 4 2.4"/>`,
    broom: `<path d="M20 4l-7.4 7.4M11.1 9.9l3 3"/><path d="M12.6 12.9 9 17.6l-5.5 2.9 2.9-5.5 4.7-3.6M6.4 17.6l3-3"/>`,
    calendar: `<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10.2h16M8.6 3.6V7M15.4 3.6V7"/><path d="M12 12.8c1.1 1 1.6 1.8 1.6 2.5a1.6 1.6 0 0 1-3.2 0c0-.7.5-1.5 1.6-2.5z"/>`,
    pond: `<path d="M8.5 3.5c-1.7 1.7-2.5 3.3-2.5 4.8a2.5 2.5 0 0 0 5 0c0-1.5-.8-3.1-2.5-4.8zM8.5 10.8v5.4"/><ellipse cx="16" cy="13.6" rx="4.2" ry="1.9"/><path d="M3 18.6c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/>`,
    bodhi: `<path d="M12 2.8c.6 1.8 2.3 2.9 4.3 3.9 2.4 1.2 3.7 3.2 3.7 5.6 0 3.6-2.6 6.3-5.4 6.3-1.3 0-2.2-.5-2.6-1.4-.4.9-1.3 1.4-2.6 1.4C6.6 18.6 4 15.9 4 12.3c0-2.4 1.3-4.4 3.7-5.6 2-1 3.7-2.1 4.3-3.9z"/><path d="M12 6.5v15"/>`,
    loc: `<path d="M4 3.2c3 .5 5.6 1.9 8 4.3"/><path d="M12 7.5c-.9-1-2.1-1.6-3.6-1.6A4.1 4.1 0 0 0 4.3 10c0 3.1 2.3 5.6 5.9 7.7 1.1.7 1.6 1.6 1.8 3.1.2-1.5.7-2.4 1.8-3.1 3.6-2.1 5.9-4.6 5.9-7.7a4.1 4.1 0 0 0-4.1-4.1c-1.5 0-2.7.6-3.6 1.6z"/><path d="M12 7.5v11.8"/>`,
    zen: `<path d="M18 6A8.5 8.5 0 1 0 20.4 13.5"/><circle cx="12" cy="8.6" r="1.6"/><path d="M8.6 16.4c.5-2.6 1.8-4.4 3.4-4.4s2.9 1.8 3.4 4.4z"/>`,
    quanam: `<circle cx="12" cy="6.4" r="3.7"/><circle cx="12" cy="6.4" r="1.6"/><path d="M10 9.9c-.4 3.6-1.6 7.2-3.4 10h10.8c-1.8-2.8-3-6.4-3.4-10M9.8 13.4c1.4.8 3 .8 4.4 0M5 20.9h14"/>`,
    well: `<path d="M4 9.2 12 4l8 5.2M6.5 8v6M17.5 8v6M12 9v3.5"/><path d="M4.5 14h15v4.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z"/>`,
    temple: `<path d="M2 8.2c1 1.4 2.4 2 4.2 1.9L9 5h6l2.8 5.1c1.8.1 3.2-.5 4.2-1.9M12 2.5V5"/><path d="M6 10.1V20h12v-9.9M10 20v-4.5h4V20"/>`,
    walk: `<path d="M8.5 3.5c1.5 0 2.5 1.7 2.5 4s-1 4-2.5 4S6 9.8 6 7.5s1-4 2.5-4zM6.8 14h3.4l-.4 2.4a1.3 1.3 0 0 1-2.6 0zM15.5 7.5c1.5 0 2.5 1.7 2.5 4s-1 4-2.5 4-2.5-1.7-2.5-4 1-4 2.5-4zM13.8 18h3.4l-.4 1.9a1.3 1.3 0 0 1-2.6 0z"/>`,
    message: `<path d="M6 4.8h12a2.5 2.5 0 0 1 2.5 2.5v7.4a2.5 2.5 0 0 1-2.5 2.5h-6.4L7.5 20.4v-3.2H6a2.5 2.5 0 0 1-2.5-2.5V7.3A2.5 2.5 0 0 1 6 4.8z"/><path d="M8 9.5h8M8 12.6h4.6"/>`,
    fish: `<path d="M2.8 12c3.8-5.4 10.2-5.4 13.8 0-3.6 5.4-10 5.4-13.8 0zM16.6 12l4.6-3.6v7.2zM7 11.2h.01"/>`,
    youtube: `<rect x="1.5" y="5" width="21" height="14" rx="4.5" fill="#f00" stroke="none"/><path d="M10 8.8v6.4l5.4-3.2z" fill="#fff" stroke="none"/>`,
  },
  Dt = (e) => e.replace(/&/g, `&amp;`).replace(/"/g, `&quot;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
function B(e, t = {}) {
  let n = typeof t.size == `number` && Number.isFinite(t.size) && t.size > 0,
    r = n ? t.size : 24,
    i = t.label ? `role="img" aria-label="${Dt(t.label)}"` : `aria-hidden="true" focusable="false"`;
  return `<svg class="icon${n ? ` icon--custom` : ``}" viewBox="0 0 24 24" width="${r}" height="${r}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${i}>${Et[e]}</svg>`;
}
var Ot = /FBAN|FBAV|FB_IAB|Instagram|TikTok|musical_ly|BytedanceWebview|Zalo|Line\/|; wv\)/i;
function kt(e) {
  return Ot.test(e);
}
var At = null,
  jt = null,
  Mt = new Set();
function Nt() {
  for (let e of [...Mt]) e();
}
function Pt(e) {
  return typeof e.prompt == `function`;
}
function Ft() {
  if (jt) return jt;
  let e = (e) => {
      Pt(e) && (e.preventDefault(), (At = e), Nt());
    },
    t = () => {
      ((At = null), Nt());
    };
  return (
    window.addEventListener(`beforeinstallprompt`, e),
    window.addEventListener(`appinstalled`, t),
    (jt = () => {
      (window.removeEventListener(`beforeinstallprompt`, e),
        window.removeEventListener(`appinstalled`, t),
        (At = null),
        (jt = null));
    }),
    jt
  );
}
function It() {
  return At !== null;
}
async function Lt() {
  let e = At;
  if (!e) return !1;
  ((At = null), Nt());
  try {
    return (await e.prompt(), (await e.userChoice).outcome === `accepted`);
  } catch {
    return !1;
  }
}
function Rt(e) {
  return (
    Mt.add(e),
    () => {
      Mt.delete(e);
    }
  );
}
function zt() {
  try {
    if (typeof window.matchMedia == `function` && window.matchMedia(`(display-mode: standalone)`).matches)
      return !0;
  } catch {}
  return navigator.standalone === !0;
}
function Bt() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    ? !0
    : navigator.platform === `MacIntel` && navigator.maxTouchPoints > 1;
}
function Vt() {
  let e = navigator.userAgent;
  return kt(e) || (Bt() && !/Safari\//.test(e));
}
function Ht() {
  return zt() ? null : It() ? `prompt` : Vt() ? `inapp` : Bt() ? `ios` : null;
}
var Ut = `chua:reload`;
function Wt() {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}
function Gt(e) {
  try {
    let t = JSON.parse(e.getItem(`chua:reload`) ?? `[]`);
    return Array.isArray(t) ? t.filter((e) => typeof e == `string`) : [];
  } catch {
    return [];
  }
}
function Kt(e, t = Wt()) {
  return t === null || Gt(t).includes(e);
}
function qt(e, t = {}) {
  let n = t.store === void 0 ? Wt() : t.store;
  if (n === null) return !1;
  let r = Gt(n);
  if (r.includes(e)) return !1;
  try {
    n.setItem(Ut, JSON.stringify([...r, e].slice(-16)));
  } catch {
    return !1;
  }
  return ((t.reload ?? (() => location.reload()))(), !0);
}
var Jt = `chua-online:light-3d`;
function Yt(e = Wt()) {
  try {
    e?.setItem(Jt, `1`);
  } catch {}
}
function Xt(e = Wt()) {
  try {
    return e?.getItem(Jt) === `1`;
  } catch {
    return !1;
  }
}
var Zt = [
    `Minh`,
    `Tâm`,
    `Diệu`,
    `Thiện`,
    `Quảng`,
    `Huệ`,
    `Chơn`,
    `Nhật`,
    `Tịnh`,
    `An`,
    `Từ`,
    `Nguyên`,
    `Phước`,
    `Trí`,
    `Giác`,
    `Liên`,
    `Bảo`,
    `Thanh`,
    `Viên`,
    `Pháp`,
    `Chân`,
    `Như`,
    `Khánh`,
    `Tuệ`,
  ],
  Qt = {
    nam: [
      `Tâm`,
      `Đức`,
      `Trí`,
      `Giác`,
      `Khải`,
      `Hạnh`,
      `Nguyên`,
      `Tuệ`,
      `Thiện`,
      `Định`,
      `Thông`,
      `Minh`,
      `Phúc`,
      `Đạo`,
      `Lạc`,
      `Hải`,
      `Tín`,
      `Nhẫn`,
      `An`,
      `Từ`,
    ],
    nu: [
      `Hạnh`,
      `Liên`,
      `Hoa`,
      `Ngọc`,
      `Hương`,
      `Hiền`,
      `Nguyệt`,
      `Thảo`,
      `Nhàn`,
      `Châu`,
      `Hỷ`,
      `Lạc`,
      `Tâm`,
      `An`,
      `Nhiên`,
      `Anh`,
      `Phương`,
      `Huệ`,
      `Từ`,
      `Minh`,
    ],
  };
function $t(e, t) {
  let n = t();
  return e[Math.floor((Number.isFinite(n) ? Math.min(Math.max(n, 0), 0.999999999) : 0) * e.length)] ?? ``;
}
function en(e, t = Math.random) {
  let n = $t(Zt, t);
  return `${n} ${$t(
    (e === `nu` ? Qt.nu : Qt.nam).filter((e) => e !== n),
    t,
  )}`;
}
var tn = Object.entries({
  Gió: [`Lặng`, `Nhẹ`, `Mát`, `Hiền`, `Thanh`],
  Sen: [`Thanh`, `Trắng`, `Hồng`, `Dịu`, `Tịnh`],
  Trăng: [`Dịu`, `Sáng`, `Thanh`, `Tròn`, `Hiền`],
  Suối: [`Mát`, `Trong`, `Êm`, `Nhẹ`, `Reo`],
  Mây: [`Nhẹ`, `Trắng`, `Hiền`, `Lặng`, `Êm`],
  Tùng: [`Xanh`, `Hiền`, `Vững`, `Thanh`],
  Trúc: [`Xanh`, `Hiền`, `Thanh`, `Biếc`],
  Sương: [`Mai`, `Nhẹ`, `Trong`, `Dịu`],
  Núi: [`Xanh`, `Lặng`, `Xa`, `Hiền`],
  Nắng: [`Mai`, `Hiền`, `Dịu`, `Ấm`],
  Sông: [`Hiền`, `Trong`, `Lặng`, `Êm`],
  Hoa: [`Sứ`, `Nhài`, `Cau`, `Lài`],
}).flatMap(([e, t]) => t.map((t) => `${e} ${t}`));
function nn(e = Math.random) {
  return $t(tn, e);
}
function rn(e = Math.random) {
  return { name: nn(e), gender: `nam`, robe: `lam` };
}
var V = (e, t) => ({ name: e, hex: t }),
  an = V(`Trắng`, 16052714),
  on = V(`Trắng ngà`, 16117988),
  sn = V(`Kem`, 15985366),
  cn = V(`Đen`, 2499882),
  ln = V(`Lam chàm`, 3952506),
  un = V(`Xanh lá mạ`, 9286266),
  dn = V(`Hồng phấn`, 15120063),
  fn = V(`Tím Huế`, 7229325),
  pn = V(`Xanh ngọc`, 4102539),
  mn = V(`Hồng sen`, 14715552),
  hn = V(`Lam`, 5933764),
  gn = V(`Lam sẫm`, 4089237),
  _n = V(`Lam ngọc`, 5082009),
  vn = V(`Xám tro`, 10658200),
  yn = V(`Vàng kim`, 14333534),
  bn = V(`Ngọc bích`, 6269324),
  xn = V(`Xanh hồ sen`, 4887688),
  Sn = V(`Tím hoa cà`, 9074349),
  Cn = [
    {
      id: `trang-xam`,
      code: `tx`,
      label: `Áo tràng xám`,
      family: `trang`,
      primary: [
        vn,
        V(`Xám bạc`, 12237234),
        V(`Xám khói`, 9145480),
        V(`Xám lam`, 10003112),
        V(`Xám đá`, 7829626),
      ],
      secondary: [sn, on, V(`Xám đậm`, 6250073), V(`Lam nhạt`, 12044763), bn],
      secondaryRole: `trim`,
      occupies: [],
    },
    {
      id: `trang-lam`,
      code: `tl`,
      label: `Áo tràng lam`,
      family: `trang`,
      primary: [hn, V(`Lam nhạt`, 8890575), gn, V(`Thiên thanh`, 8302283), _n],
      secondary: [sn, on, V(`Lam đậm`, 3034228), V(`Xám bạc`, 13159111), bn],
      secondaryRole: `trim`,
      occupies: [],
    },
    {
      id: `ba-ba`,
      code: `bb`,
      label: `Áo bà ba`,
      family: `baba`,
      primary: [V(`Trắng`, 15921126), V(`Đen huyền`, 2960433), ln, un, dn, fn, V(`Xanh cốm`, 10994570)],
      secondary: [cn, V(`Trắng`, 15657954), V(`Lam chàm`, 3359071), V(`Xám tro`, 7763311)],
      secondaryRole: `trousers`,
      occupies: [],
    },
    {
      id: `ao-dai`,
      code: `ad`,
      label: `Áo dài`,
      family: `aodai`,
      primary: [
        an,
        V(`Đỏ son`, 12075578),
        fn,
        pn,
        mn,
        V(`Lam`, 4879024),
        V(`Lục bảo`, 3045721),
        V(`Đen huyền`, 2828848),
      ],
      secondary: [V(`Trắng`, 15855334), cn, V(`Kem`, 15524812), V(`Lam sẫm`, 3096418)],
      secondaryRole: `trousers`,
      occupies: [],
    },
    {
      id: `tu-than`,
      code: `tt`,
      label: `Áo tứ thân`,
      family: `tuthan`,
      primary: [
        V(`Mận chín`, 8010578),
        V(`Chàm`, 3425646),
        V(`Lục bảo`, 3107669),
        V(`Cánh sen`, 12876430),
        V(`Tím than`, 4142676),
      ],
      secondary: [V(`Đỏ thắm`, 12464694), V(`Hồng đào`, 15375003), on, V(`Xanh hồ thuỷ`, 7188910)],
      secondaryRole: `bodice`,
      occupies: [`head`],
    },
    {
      id: `dai-sen`,
      code: `ds`,
      label: `Áo dài thêu sen`,
      family: `aodai`,
      primary: [an, mn, pn, fn, V(`Lam`, 4879024)],
      secondary: [V(`Hồng sen đậm`, 14183307), V(`Trắng`, 16447472), yn, V(`Xanh lá sen`, 7315298)],
      secondaryRole: `embroidery`,
      occupies: [],
    },
    {
      id: `trang-vien`,
      code: `tv`,
      label: `Áo tràng viền vàng`,
      family: `trang`,
      primary: [hn, vn, gn, V(`Trắng ngà`, 15657178), _n],
      secondary: [yn, V(`Vàng nhạt`, 15257998), V(`Vàng đồng`, 13477201)],
      secondaryRole: `trim`,
      occupies: [],
    },
    {
      id: `ban-dao`,
      code: `bd`,
      label: `Bạn đạo`,
      family: `baba`,
      primary: [V(`Trắng`, 15921126), ln, un, dn, V(`Xám tro`, 10131857), xn, Sn],
      secondary: [cn, V(`Lam chàm`, 3359071), V(`Trắng`, 15657954)],
      secondaryRole: `trousers`,
      occupies: [`chest`, `hip`],
    },
    {
      id: `kol`,
      code: `kl`,
      label: `Áo dài KOL Chùa Sen`,
      family: `aodai`,
      primary: [
        V(`Đỏ son`, 11022638),
        V(`Lam ngọc`, 2977421),
        V(`Tím Huế`, 6111101),
        an,
        V(`Lục bảo`, 2188363),
      ],
      secondary: [V(`Vàng kim`, 14465120), V(`Trắng ngà`, 15985884), mn],
      secondaryRole: `sash`,
      occupies: [`chest`],
    },
  ],
  wn = [`trang-xam`, `trang-lam`, `ba-ba`, `ao-dai`],
  Tn = { "ban-dao": `bandao`, kol: `kol` },
  En = [
    { id: `non-la`, code: `nl`, label: `Nón lá`, slot: `head` },
    { id: `hat-tay`, code: `ht`, label: `Chuỗi hạt cổ tay`, slot: `mala` },
    { id: `hat-co`, code: `hc`, label: `Chuỗi hạt đeo cổ`, slot: `mala` },
    { id: `khan-van`, code: `kv`, label: `Khăn vấn`, slot: `head` },
    { id: `tui-vai`, code: `tu`, label: `Túi vải`, slot: `hip` },
    { id: `quat`, code: `qg`, label: `Quạt giấy`, slot: `hand` },
    { id: `sen-cai`, code: `sc`, label: `Hoa sen cài áo`, slot: `chest` },
    { id: `hat-tram`, code: `tm`, label: `Chuỗi hạt gỗ trầm`, slot: `mala` },
    { id: `sen-vang`, code: `sv`, label: `Hoa sen cài áo vàng`, slot: `chest` },
    { id: `khan-choang`, code: `kc`, label: `Khăn choàng lụa vàng`, slot: `chest` },
  ],
  Dn = [
    { id: `ta`, label: `Tà dài` },
    { id: `suong`, label: `Dáng suông` },
  ],
  On = { style: `trang-lam`, cut: `ta`, primary: 0, secondary: 0, accessories: [`hat-tay`] },
  kn = new Map(Cn.map((e) => [e.id, e])),
  An = new Map(Cn.map((e) => [e.code, e])),
  jn = new Map(En.map((e) => [e.id, e])),
  Mn = new Map(En.map((e) => [e.code, e])),
  Nn = new Map(En.map((e, t) => [e.id, t]));
function H(e) {
  return kn.get(e) ?? Cn[0];
}
function Pn(e) {
  return typeof e == `string` && kn.has(e);
}
function Fn(e) {
  return jn.get(e) ?? En[0];
}
function In(e, t) {
  let n = jn.get(t);
  return !!n && !H(e).occupies.includes(n.slot);
}
var Ln = (e, t) => typeof e == `number` && Number.isInteger(e) && e >= 0 && e < t;
function Rn(e) {
  if (typeof e != `object` || !e || !Pn(e.style)) return !1;
  let t = H(e.style);
  if (
    (e.cut !== `ta` && (e.cut !== `suong` || t.family !== `aodai`)) ||
    !Ln(e.primary, t.primary.length) ||
    !Ln(e.secondary, t.secondary.length)
  )
    return !1;
  let n = e.accessories;
  if (!Array.isArray(n) || n.length > 2) return !1;
  let r = new Set(),
    i = -1;
  for (let e of n) {
    let n = jn.get(e),
      a = Nn.get(e) ?? -1;
    if (!n || a <= i || r.has(n.slot) || t.occupies.includes(n.slot)) return !1;
    (r.add(n.slot), (i = a));
  }
  return !0;
}
function zn(e) {
  let t = Pn(e?.style) ? e.style : On.style,
    n = H(t),
    r = new Set(),
    i = [];
  for (let t of Array.isArray(e?.accessories) ? e.accessories : []) {
    let e = jn.get(t);
    if (!(!e || r.has(e.slot) || n.occupies.includes(e.slot))) {
      if (i.length >= 2) break;
      (r.add(e.slot), i.push(e.id));
    }
  }
  return (
    i.sort((e, t) => (Nn.get(e) ?? 0) - (Nn.get(t) ?? 0)),
    {
      style: t,
      cut: e?.cut === `suong` && n.family === `aodai` ? `suong` : `ta`,
      primary: Ln(e?.primary, n.primary.length) ? e.primary : 0,
      secondary: Ln(e?.secondary, n.secondary.length) ? e.secondary : 0,
      accessories: i,
    }
  );
}
function Bn(e) {
  let t = Rn(e) ? e : zn(e),
    n = t.accessories.map((e) => Fn(e).code).join(``);
  return `1${H(t.style).code}${t.cut === `suong` ? `s` : `t`}${t.primary}${t.secondary}${n}`;
}
var Vn = /^1([a-z]{2})([ts])(\d)(\d)((?:[a-z]{2}){0,2})$/;
function Hn(e) {
  if (typeof e != `string` || e.length > 32) return null;
  let t = Vn.exec(e);
  if (!t) return null;
  let n = An.get(t[1]);
  if (!n) return null;
  let r = [],
    i = t[5];
  for (let e = 0; e < i.length; e += 2) {
    let t = Mn.get(i.slice(e, e + 2));
    if (!t) return null;
    r.push(t.id);
  }
  let a = {
    style: n.id,
    cut: t[2] === `s` ? `suong` : `ta`,
    primary: Number(t[3]),
    secondary: Number(t[4]),
    accessories: r,
  };
  return Rn(a) ? a : null;
}
function Un(e, t) {
  return !e || !t ? e === t : Bn(e) === Bn(t);
}
function Wn(e) {
  let t = H(e.style);
  return {
    primary: (t.primary[e.primary] ?? t.primary[0]).hex,
    secondary: (t.secondary[e.secondary] ?? t.secondary[0]).hex,
  };
}
function Gn(e) {
  return { ...On, style: e === `xam` || e === `nau` ? `trang-xam` : `trang-lam` };
}
var Kn = { lam: 5933764, xam: 10658200 };
function qn(e) {
  let t = Wn(e).primary,
    n = (e) => {
      let n = 0;
      for (let r of [16, 8, 0]) n += (((t >> r) & 255) - ((e >> r) & 255)) ** 2;
      return n;
    };
  return n(Kn.lam) <= n(Kn.xam) ? `lam` : `xam`;
}
var Jn = `chua-online:outfit`,
  Yn = null,
  Xn = new Set(),
  Zn = !1;
function Qn() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function $n() {
  if (Yn !== null) return Hn(Yn);
  try {
    return Hn(Qn()?.getItem(`chua-online:outfit`) ?? null);
  } catch {
    return null;
  }
}
function er(e) {
  for (let t of [...Xn]) t(e);
}
function tr(e) {
  let t = Bn(e);
  try {
    let e = Qn();
    if (!e) throw Error(`no storage`);
    (e.setItem(Jn, t), (Yn = null));
  } catch {
    Yn = t;
  }
  er(Hn(t));
}
function nr(e) {
  (e.key === `chua-online:outfit` || e.key === null) && er($n());
}
function rr(e) {
  return (
    Xn.add(e),
    !Zn && typeof window < `u` && ((Zn = !0), window.addEventListener(`storage`, nr)),
    () => {
      (Xn.delete(e), Xn.size === 0 && Zn && ((Zn = !1), window.removeEventListener(`storage`, nr)));
    }
  );
}
var ir = `6w,6,1f,h,1u,9,5,17,2,1,3b,l,5,g,1,1,6,1,5,5,c,4,7,4,a,3,3,6v,1,5,1,8,c,1,1,2,2,2,1,3,2,2,2,1,1,2,2,j,m,1,5,1,1,1e,4,2,1,2,5,2,1,1,2,1,1,1,2,3,d,1,2,9,k,1m,c,2,i,1e,b,f,2,1e,i,2,3,a,5,3,4,1,4,1,2,1,2sb,1,1,7,1,1,1,b,4,2,3,2,d,3,3,9,4,4,1,c,1,1ou,1,3h,4,1,2,3,1,2,2,2,7,3,1,4,1,1,4,2l,9,7l,2q,2nh,o2j,6h,1,28,o,6,j,1,1,1y,4,ms,3,8,a,1,6,4,8,a,h,c,2,g,h,5,1,5`,
  ar = null;
function or() {
  if (ar === null) {
    ar = new Map();
    let e = 0,
      t = 0;
    for (let n of ir.split(`,`))
      ((e += parseInt(n, 36)),
        ar.set(
          String.fromCodePoint(e),
          `opilBgfspljRaggyiiwnrfuybhlZHMNYabyenikvopotuxwFcjpCMBabrekmhopctyxwsijwvyheldGqwSwqqhjnnugifoDRTYAJEMHYGHBRSLPKDGBocacdejkmooptuvwzrgyfyzifslfuJXBwleforruuyairwzwvsc`[
            t++
          ] ?? ``,
        ));
  }
  return ar;
}
function sr(e) {
  let t = or(),
    n = ``;
  for (let r of e) n += t.get(r) ?? r;
  return n;
}
function cr(e) {
  return sr(sr(e).toLowerCase());
}
var lr = `Sứ giả Chùa Sen`,
  ur = new Map();
function dr(e) {
  if (e.length === 1 && e.charCodeAt(0) < 128) return e.toLowerCase();
  let t = ur.get(e);
  return (
    t === void 0 &&
      ((t = cr(sr(e).normalize(`NFKD`).replace(/\p{M}/gu, ``)).replace(/[đð]/g, `d`)),
      ur.size >= 512 && ur.clear(),
      ur.set(e, t)),
    t
  );
}
var fr = Array.from(lr, dr)
    .join(``)
    .replace(/[^a-z]/g, ``),
  pr = new RegExp(Array.from(fr, (e) => `${e}+`).join(String.raw`[^\p{L}\p{N}]*`), `gu`),
  mr = /^[a-z]$/,
  hr = /^\p{Lu}/u,
  gr = /^\p{Ll}/u,
  _r = /^\p{M}/u,
  vr = /^\p{M}+/u;
function yr(e) {
  let t = e;
  for (;;) {
    let e = ``,
      n = [],
      r = [],
      i = 0,
      a = !1;
    for (let o of t) {
      _r.test(o) || (a && hr.test(o) && ((e += ` `), n.push(i), r.push(i)), (a = gr.test(o)));
      let t = dr(o);
      e += t;
      for (let e = 0; e < t.length; e++) (n.push(i), r.push(i + o.length));
      i += o.length;
    }
    if (e.length < fr.length) break;
    let o = (t, n) => t < 0 || n >= e.length || !mr.test(e[t] ?? ``) || !mr.test(e[n] ?? ``);
    pr.lastIndex = 0;
    let s;
    for (
      ;
      (s = pr.exec(e)) !== null &&
      !(o(s.index - 1, s.index) && o(s.index + s[0].length - 1, s.index + s[0].length));
    )
      pr.lastIndex = s.index + 1;
    if (s === null) break;
    let c = r[s.index + s[0].length - 1] ?? t.length;
    ((c += vr.exec(t.slice(c))?.[0].length ?? 0), (t = `${t.slice(0, n[s.index])} ${t.slice(c)}`));
  }
  return t;
}
var br = [`lam`, `nau`, `xam`, `vang`];
function xr(e) {
  return e === `nau` || e === `xam` ? `xam` : `lam`;
}
var Sr = `chua-online:profile`,
  Cr = [`nam`, `nu`],
  wr = null;
function Tr(e) {
  let t = (e) => yr(e).replace(/\s+/gu, ` `).trim(),
    n = t(
      e
        .normalize(`NFC`)
        .replace(/[\p{Cc}\p{Cf}⠀]/gu, ` `)
        .replace(/\p{Default_Ignorable_Code_Point}/gu, ``)
        .normalize(`NFC`),
    ),
    r = Array.from(n);
  return r.length <= 24 ? n : t(r.slice(0, 24).join(``));
}
function Er(e) {
  return typeof e == `string` && Cr.includes(e);
}
function Dr(e) {
  return typeof e == `string` && br.includes(e);
}
function Or(e) {
  if (typeof e != `object` || !e || Array.isArray(e)) return null;
  let { name: t, gender: n, robe: r } = e;
  if (typeof t != `string` || !Er(n) || !Dr(r)) return null;
  let i = Tr(t);
  return i.length === 0 ? null : { name: i, gender: n, robe: xr(r) };
}
function kr() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function Ar() {
  if (wr) return { ...wr };
  let e = kr();
  if (!e) return null;
  try {
    let t = e.getItem(Sr);
    return t === null ? null : Or(JSON.parse(t));
  } catch {
    return null;
  }
}
function jr(e) {
  let t = Or(e);
  if (!t) return;
  let n = kr();
  try {
    if (!n) throw Error(`no storage`);
    (n.setItem(Sr, JSON.stringify(t)), (wr = null));
  } catch {
    wr = t;
  }
}
var Mr = [`auto`, `day`, `night`],
  Nr = `chua-online:v1`,
  Pr = `chua-device:probe`,
  Fr = Object.freeze({ musicOn: !1, moLoopOn: !1 }),
  Ir = Object.freeze({
    sound: !0,
    volume: C.volume,
    haptics: !0,
    chantTempo: 66,
    chantPhrase: `Nam mô A Di Đà Phật`,
    ambientOn: !1,
    ambientVolume: C.ambientVolume,
    sfxVolume: C.sfxVolume,
    chantVolume: C.chantVolume,
    moVolume: T.moVolume,
    moLoopOn: T.moLoopOn,
    playInBackground: !1,
    musicOn: T.musicOn,
    musicVolume: T.musicVolume,
    touchJoystick: !0,
    invertDrag: !1,
    timeOfDay: `auto`,
    showPhrases: !0,
    progressUi: !0,
    progressBadge: !0,
    streakLamp: !0,
    showTitles: !0,
  }),
  Lr = { chants: !0, beadRounds: !0, bows: !0, offerings: !0, bells: !0, sutras: !0, meditationSeconds: !0 },
  Rr = Object.keys(Lr);
function zr() {
  let e = {};
  for (let t of Rr) e[t] = 0;
  return e;
}
function Br(e) {
  let t = 0;
  for (let n of Rr) t += e[n];
  return t;
}
function Vr(e) {
  return typeof e != `number` || !Number.isFinite(e) || e <= 0 ? 0 : Math.min(Math.round(e), 2 ** 53 - 1);
}
function Hr(e, t) {
  return Math.min(e + t, 2 ** 53 - 1);
}
function Ur(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
function Wr(e) {
  let t = zr();
  if (!Ur(e)) return t;
  for (let n of Rr) t[n] = Vr(e[n]);
  return t;
}
var Gr = (e, t = 2) => String(e).padStart(t, `0`);
function Kr(e) {
  return `${Gr(e.getFullYear(), 4)}-${Gr(e.getMonth() + 1)}-${Gr(e.getDate())}`;
}
var qr = /^(\d{4})-(\d{2})-(\d{2})$/;
function Jr(e) {
  if (typeof e != `string`) return null;
  let t = qr.exec(e);
  if (!t) return null;
  let n = new Date(Number(t[1]), Number(t[2]) - 1, Number(t[3]), 12);
  return Kr(n) === e ? n : null;
}
function Yr(e, t) {
  let n = Jr(e);
  return n ? (n.setDate(n.getDate() + t), Kr(n)) : e;
}
function Xr(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Zr(e, t) {
  if (typeof e != `string`) return t;
  let n = e.normalize(`NFC`).replace(/\s+/g, ` `).trim();
  return Array.from(n).slice(0, 60).join(``).trim() || t;
}
function Qr(e, t) {
  return typeof e == `number` && Number.isFinite(e) ? Xr(e, 0, 1) : t;
}
function U(e, t) {
  return typeof e == `boolean` ? e : t;
}
function $r(e, t) {
  return Mr.includes(e) ? e : t;
}
function ei(e, t) {
  let n = Ur(e) ? e : {},
    { chantTempo: r, chantPhrase: i } = n;
  return {
    sound: U(n.sound, t.sound),
    volume: Qr(n.volume, t.volume),
    haptics: U(n.haptics, t.haptics),
    chantTempo: typeof r == `number` && Number.isFinite(r) ? Math.round(Xr(r, 40, 110)) : t.chantTempo,
    chantPhrase: Zr(i, t.chantPhrase),
    ambientOn: U(n.ambientOn, t.ambientOn),
    ambientVolume: Qr(n.ambientVolume, t.ambientVolume),
    sfxVolume: Qr(n.sfxVolume, t.sfxVolume),
    chantVolume: Qr(n.chantVolume, t.chantVolume),
    moVolume: Qr(n.moVolume, t.moVolume),
    moLoopOn: U(n.moLoopOn, t.moLoopOn),
    playInBackground: U(n.playInBackground, t.playInBackground),
    musicOn: U(n.musicOn, t.musicOn),
    musicVolume: Qr(n.musicVolume, t.musicVolume),
    touchJoystick: U(n.touchJoystick, t.touchJoystick),
    invertDrag: U(n.invertDrag, t.invertDrag),
    timeOfDay: $r(n.timeOfDay, t.timeOfDay),
    showPhrases: U(n.showPhrases, t.showPhrases),
    progressUi: U(n.progressUi, t.progressUi),
    progressBadge: U(n.progressBadge, t.progressBadge),
    streakLamp: U(n.streakLamp, t.streakLamp),
    showTitles: U(n.showTitles, t.showTitles),
  };
}
function ti(e, t) {
  return Object.keys(e).every((n) => e[n] === t[n]);
}
function ni(e) {
  return { settings: { ...Ir }, today: { date: e, ...zr() }, totals: zr(), history: {} };
}
function ri(e) {
  let t = Object.keys(e).sort();
  for (let n of t.slice(0, Math.max(0, t.length - 400))) delete e[n];
}
function ii(e, t) {
  if (e === null) return ni(t);
  let n;
  try {
    n = JSON.parse(e);
  } catch {
    return ni(t);
  }
  if (!Ur(n) || (typeof n.version == `number` && n.version > 1)) return ni(t);
  let r = ni(t);
  r.settings = ei(n.settings, Ir);
  let i = typeof n.mixVersion == `number` ? n.mixVersion : 1;
  if (
    (i < 2 && (r.settings = D(r.settings)),
    i < 3 && (r.settings = { ...r.settings, musicOn: !1 }),
    i < 4 && (r.settings = ee(r.settings)),
    (r.totals = Wr(n.totals)),
    Ur(n.today))
  ) {
    let e = Jr(n.today.date) ? n.today.date : null;
    e && (r.today = { date: e, ...Wr(n.today) });
  }
  if (Ur(n.history)) {
    for (let [e, t] of Object.entries(n.history)) {
      if (!Jr(e)) continue;
      let n = Wr(t);
      Br(n) > 0 && (r.history[e] = n);
    }
    ri(r.history);
  }
  return r;
}
function ai(e) {
  if (!e) return !1;
  try {
    return (e.setItem(Pr, `1`), e.removeItem(Pr), !0);
  } catch {
    return !1;
  }
}
function oi() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function si(e = {}) {
  let t = e.storage === void 0 ? oi() : e.storage,
    n = e.now ?? (() => new Date()),
    r = e.key ?? `chua-online:v1`,
    i = ai(t),
    a = () => {
      let e = n();
      return Kr(Number.isNaN(e.getTime()) ? new Date() : e);
    };
  function o() {
    let e = null;
    if (t)
      try {
        e = t.getItem(r);
      } catch {
        e = null;
      }
    let n = ii(e, a());
    return (e === null && !i && (n.settings = { ...n.settings, ...Fr }), n);
  }
  function s() {
    if (t)
      try {
        t.setItem(
          r,
          JSON.stringify({
            version: 1,
            mixVersion: 4,
            settings: d.settings,
            today: d.today,
            totals: d.totals,
            history: d.history,
          }),
        );
      } catch {}
  }
  let c = new Set();
  function l() {
    for (let e of [...c])
      if (c.has(e))
        try {
          e.fn();
        } catch (e) {
          console.error(e);
        }
  }
  function u() {
    (s(), l());
  }
  let d = o();
  function f() {
    let e = a();
    if (d.today.date === e) return !1;
    if (Br(d.today) > 0) {
      let e = d.history[d.today.date];
      if (e) for (let t of Rr) e[t] = Hr(e[t], d.today[t]);
      else {
        let { date: e, ...t } = d.today;
        d.history[e] = t;
      }
    }
    return ((d.today = { date: e, ...zr() }), ri(d.history), !0);
  }
  function p(e) {
    let t = d.history[e];
    return (t ? Br(t) : 0) + (e === d.today.date ? Br(d.today) : 0) > 0;
  }
  let m = (e) => {
      let { key: n, storageArea: i } = e;
      (i && i !== t) || ((n === null || n === r) && ((d = o()), l()));
    },
    h = t !== null && typeof window < `u`;
  return (
    h && window.addEventListener(`storage`, m),
    {
      getSettings() {
        return { ...d.settings };
      },
      updateSettings(e) {
        let t = ei(e, d.settings);
        return (ti(t, d.settings) || ((d.settings = t), u()), { ...d.settings });
      },
      today() {
        return (f() && u(), { ...d.today });
      },
      record(e, t = 1) {
        let n = f(),
          r = Vr(t);
        return (
          Lr[e] === !0 &&
            r > 0 &&
            ((d.today[e] = Hr(d.today[e], r)), (d.totals[e] = Hr(d.totals[e], r)), (n = !0)),
          n && u(),
          { ...d.today }
        );
      },
      totals() {
        return { ...d.totals };
      },
      streak() {
        f() && u();
        let e = d.today.date;
        p(e) || (e = Yr(e, -1));
        let t = 0;
        for (; t <= 400 && p(e);) (t++, (e = Yr(e, -1)));
        return t;
      },
      history() {
        return (
          f() && u(),
          Object.keys(d.history)
            .filter((e) => e !== d.today.date)
            .sort()
            .map((e) => ({ date: e, ...d.history[e] }))
        );
      },
      subscribe(e) {
        let t = { fn: e };
        return (
          c.add(t),
          () => {
            c.delete(t);
          }
        );
      },
      dispose() {
        (h && window.removeEventListener(`storage`, m), c.clear());
      },
    }
  );
}
var ci = `--vvh`,
  li = `--vv-top`,
  ui = new Set(),
  di = null,
  fi = (e) => Number.isFinite(e) && e > 0;
function pi(e = window) {
  let t = e.visualViewport;
  if (t && fi(t.height)) {
    let e = Number.isFinite(t.offsetTop) ? Math.round(t.offsetTop) : 0;
    return { height: Math.floor(t.height), top: e };
  }
  return fi(e.innerHeight) ? { height: Math.floor(e.innerHeight), top: 0 } : null;
}
function mi(e) {
  return (
    ui.add(e),
    () => {
      ui.delete(e);
    }
  );
}
function hi(e = {}) {
  di?.();
  let t = e.win ?? window,
    n = e.root ?? document.documentElement,
    r = t.visualViewport ?? null,
    i = t.requestAnimationFrame?.bind(t),
    a = t.cancelAnimationFrame?.bind(t),
    o = null,
    s = null,
    c = () => {
      o = null;
      let e = pi(t);
      if (!(!e || (s && s.height === e.height && s.top === e.top))) {
        ((s = e), n.style.setProperty(ci, `${e.height}px`), n.style.setProperty(li, `${e.top}px`));
        for (let t of [...ui]) t(e);
      }
    },
    l = () => {
      i ? o === null && (o = i(c)) : c();
    };
  (c(),
    r?.addEventListener(`resize`, l),
    r?.addEventListener(`scroll`, l),
    t.addEventListener(`resize`, l),
    t.addEventListener(`orientationchange`, l));
  let u = () => {
    (r?.removeEventListener(`resize`, l),
      r?.removeEventListener(`scroll`, l),
      t.removeEventListener(`resize`, l),
      t.removeEventListener(`orientationchange`, l),
      o !== null && a?.(o),
      (o = null),
      n.style.removeProperty(ci),
      n.style.removeProperty(li),
      di === u && (di = null));
  };
  return ((di = u), u);
}
var gi = {
    vulgar: [
      `cặc`,
      `cặk`,
      `kặc`,
      `lồn`,
      `lìn`,
      `lồz`,
      `buồi`,
      `dái`,
      `địt`,
      `đụ`,
      `đéo`,
      `đếch`,
      `đĩ`,
      `cứt`,
      `ỉa`,
      `đù má`,
    ],
    insult: [
      `ngu`,
      `đần`,
      `khốn`,
      `thằng chó`,
      `chó đẻ`,
      `chó má`,
      `óc lợn`,
      `óc bò`,
      `não chó`,
      `bố đời`,
      `bố láo`,
      `bố thiên hạ`,
      `ông nội mày`,
      `phế vật`,
      `cặn bã`,
    ],
    sexual: [
      `chịch`,
      `nứng`,
      `điếm`,
      `con phò`,
      `làm tình`,
      `thủ dâm`,
      `hiếp dâm`,
      `khiêu dâm`,
      `dâm đãng`,
      `dâm dục`,
      `dâm tặc`,
      `bú cu`,
      `gái gọi`,
    ],
    hate: [`khủng bố`, `phát xít`, `khựa`],
    spam: [`kèo`, `lô đề`, `bắn cá`, `cá độ`, `đánh bài`, `kiếm tiền`, `vay tiền`, `bay lắc`],
    impersonation: [
      `quản trị`,
      `quan tri vien`,
      `hệ thống`,
      `he thong`,
      `ban quản lý`,
      `ban quan ly`,
      `trụ trì`,
      `tru tri`,
      `chủ chùa`,
    ],
  },
  _i = {
    vulgar:
      `dm.dcm.dkm.djt.vcl.vkl.clgt.cmnr.cmn.clm.loz.dit me.dit con me.dit cu.du ma.du me.fuck.fck.fuk.fvck.phuck.shit.bullshit.shitty.bitch.bitches.cunt.dick.dickhead.cock.pussy.asshole.ass`.split(
        `.`,
      ),
    insult: [
      `bo may`,
      `me may`,
      `oc cho`,
      `con cho`,
      `do cho`,
      `suc vat`,
      `mat day`,
      `khon nan`,
      `nao tan`,
      `bastard`,
      `retard`,
      `dumbass`,
    ],
    sexual: [
      `sex`,
      `sexy`,
      `porn`,
      `porno`,
      `nude`,
      `nudes`,
      `boobs`,
      `tits`,
      `penis`,
      `vagina`,
      `dildo`,
      `horny`,
      `slut`,
      `whore`,
      `rape`,
      `rapist`,
      `pedo`,
      `milf`,
      `hiep dam`,
    ],
    hate: [
      `nigga`,
      `niggas`,
      `nigger`,
      `niggers`,
      `faggot`,
      `chink`,
      `kkk`,
      `nazi`,
      `nazis`,
      `isis`,
      `taliban`,
      `white power`,
      `pol pot`,
      `parky`,
      `khungbo`,
    ],
    spam: [
      `zalo`,
      `telegram`,
      `tele`,
      `nha cai`,
      `ca cuoc`,
      `tai xiu`,
      `no hu`,
      `soi cau`,
      `xoc dia`,
      `game bai`,
      `vaytien`,
      `vay tien nhanh`,
      `vay tien online`,
      `kiem tien online`,
      `casino`,
      `ma tuy`,
      `thuoc lac`,
      `thuoc phien`,
      `can sa`,
      `weed`,
      `heroin`,
    ],
    impersonation: [
      `admin`,
      `administrator`,
      `moderator`,
      `mod`,
      `qtv`,
      `bqt`,
      `system`,
      `support`,
      `cskh`,
      `staff`,
      `hethong`,
    ],
  },
  vi = {
    vulgar: [`fuck`, `ditme`, `dichme`, `ditconme`, `concac`, `caclon`],
    sexual: [`hentai`, `hiepdam`, `blowjob`, `pornhub`, `xvideos`, `pedophile`],
    hate: [`nigger`, `hitler`, `alqaeda`],
    spam: [`casino`, `baccarat`, `telegram`, `cocaine`, `marijuana`, `ketamine`],
    impersonation: [`chuasen`, `administrator`, `moderator`],
  },
  yi =
    `w88.fb88.jun88.hi88.new88.shbet.8xbet.789bet.f8bet.okvip.kubet.fun88.vn88.go88.sv88.fi88.hb88.qh88.u888.ae888.bet88.i9bet.8kbet.mb66.ok365.33win.hitclub.sunwin.rikvip.789club`.split(
      `.`,
    ),
  bi = [
    `com`,
    `net`,
    `org`,
    `vn`,
    `xyz`,
    `top`,
    `club`,
    `site`,
    `online`,
    `io`,
    `me`,
    `gg`,
    `tv`,
    `info`,
    `biz`,
    `shop`,
    `store`,
    `link`,
    `bet`,
    `win`,
    `asia`,
    `cc`,
  ],
  xi = `Tên này chưa phù hợp với nội quy Chùa Sen (không tục tĩu, xúc phạm, quảng cáo hay giả danh ban quản trị). Bạn đặt tên khác nhé.`,
  Si = `Tên này có từ ngữ chưa lịch sự nên chưa phù hợp với nội quy Chùa Sen. Bạn đặt tên khác nhé.`,
  Ci = `Tên này có thể làm người khác buồn lòng nên chưa phù hợp với nội quy Chùa Sen. Bạn đặt tên khác nhé.`,
  wi = {
    vulgar: Si,
    sexual: Si,
    insult: Ci,
    hate: Ci,
    spam: `Tên không được chứa quảng cáo, đường dẫn, số điện thoại hay chất cấm. Bạn đặt tên khác nhé.`,
    impersonation: `Tên này dễ nhầm với ban quản trị Chùa Sen. Bạn đặt tên khác nhé.`,
    junk: `Tên cần có chữ cái và không lặp một ký tự quá nhiều lần. Bạn đặt tên khác nhé.`,
  };
function Ti(e) {
  return wi[e];
}
var Ei = { 0: `o`, 1: `i`, 3: `e`, 4: `a`, 5: `s`, 7: `t`, "@": `a`, $: `s`, "!": `i` };
function Di(e, t) {
  let n = ``;
  for (let r of e) n += t[r] ?? r;
  return n;
}
function Oi(e) {
  return cr(
    sr(e)
      .normalize(`NFKC`)
      .replace(/\p{Default_Ignorable_Code_Point}/gu, ``)
      .replace(/[\p{Cc}\p{Cf}⠀]/gu, ` `)
      .replace(/(\p{Ll})(\p{Lu})/gu, `$1 $2`),
  );
}
function ki(e) {
  return e.replace(/[đð]/g, `d`).normalize(`NFD`).replace(/\p{M}/gu, ``);
}
function Ai(e) {
  return e.replace(/(.)\1+/gu, `$1`);
}
function ji(e, t) {
  let n = [],
    r = ``;
  for (let i of e.split(t))
    i !== `` && (Array.from(i).length === 1 ? (r += i) : (r !== `` && n.push(r), (r = ``), n.push(i)));
  return (r !== `` && n.push(r), n);
}
var Mi = /[^\p{L}]+/u,
  Ni = /[*∗⁎✱]/u,
  Pi = /(\p{L}\p{M}*)[*∗⁎✱]+(?=\p{L})/gu;
function Fi(e) {
  return Ni.test(e) ? e.replace(Pi, `$1`) : e;
}
function Ii(e) {
  return sr(ki(e));
}
function Li(e) {
  return ji(Fi(Di(Ii(e), Ei)), Mi);
}
var Ri = `̣̀́̃̉`,
  zi = { a: `̂̆`, e: `̂`, o: `̛̂`, u: `̛` },
  Bi = `aeiouy`,
  Vi = `̵̶`,
  Hi = /\p{M}/u,
  Ui = /\p{L}/u,
  Wi = new Map();
function Gi(e, t) {
  let n = e + t,
    r = Wi.get(n);
  return (r === void 0 && ((r = Ki(e, t)), Wi.size >= 512 && Wi.clear(), Wi.set(n, r)), r);
}
function Ki(e, t) {
  let n = e === `ð` ? `đ` : (or().get(e) ?? e);
  if (!Ui.test(n)) return null;
  let r = n === `đ` ? `d` : n;
  if (!Bi.includes(n))
    return { key: r, alts: n === `d` && Array.from(t).some((e) => Vi.includes(e)) ? [`d`, `đ`] : [n] };
  let i = zi[n] ?? ``,
    a = ``,
    o = ``,
    s = !1;
  for (let e of t)
    Ri.includes(e)
      ? a.includes(e)
        ? (s = !0)
        : (a += e)
      : i.includes(e)
        ? o.includes(e)
          ? (s = !0)
          : (o += e)
        : (s = !0);
  if (!s && a.length <= 1 && o.length <= 1) return { key: r, alts: [(n + o + a).normalize(`NFC`)] };
  let c = [];
  for (let e of [``, ...o]) for (let t of [``, ...a]) c.push((n + e + t).normalize(`NFC`));
  return { key: r, alts: c };
}
function qi(e) {
  let t = [],
    n = ``,
    r = ``;
  for (let i of e.normalize(`NFD`))
    Hi.test(i) ? n !== `` && (r += i) : (n !== `` && t.push(Gi(n, r)), (n = i), (r = ``));
  return (n !== `` && t.push(Gi(n, r)), t);
}
function Ji(e) {
  let t = [],
    n = [],
    r = [],
    i = () => {
      (r.length === 1 ? n.push(...r) : r.length > 1 && (n.length > 0 && t.push(n), (n = []), t.push(r)),
        (r = []));
    };
  for (let t of qi(Fi(e))) t === null ? i() : r.push(t);
  return (i(), n.length > 0 && t.push(n), t);
}
function Yi(e) {
  return e.map((e) => e.alts[0] ?? ``).join(``);
}
function Xi(e) {
  return e.map((e) => e.key).join(``);
}
function Zi(e) {
  let t = [],
    n = ``;
  for (let r of e) {
    let e = r.alts.join(`,`);
    (e !== n && t.push(r), (n = e));
  }
  return t;
}
function Qi(e, t, n) {
  let r = t[0];
  if (r === void 0) return;
  let i = { tokens: t, reason: n },
    a = (e) => {
      let t = e.get(r);
      t === void 0 ? e.set(r, [i]) : t.push(i);
    };
  (a(e.all), t.every((e) => Ai(e) === e) && a(e.stable));
}
function $i(e, t) {
  let n = { all: new Map(), stable: new Map() };
  for (let [r, i] of e)
    for (let e of i) {
      let i = t(Oi(e));
      i.length === 0 ||
        (i.length === 1 && Array.from(i[0] ?? ``).length < 2) ||
        (Qi(n, i, r), i.length > 1 && Qi(n, [i.join(``)], r));
    }
  return n;
}
function ea(e) {
  return Object.entries(e);
}
var ta = null;
function na() {
  if (ta !== null) return ta;
  let e = [];
  for (let [t, n] of ea(vi))
    for (let r of n) {
      let n = Li(Oi(r)).join(``);
      n.length >= 4 && e.push({ text: n, stable: Ai(n) === n, reason: t });
    }
  let t = $i(ea(gi), (e) => Ji(e).map(Yi)),
    n = new Map();
  for (let e of t.all.values())
    for (let t of e)
      for (let e of t.tokens) {
        let t = Xi(Ji(e)[0] ?? []),
          r = n.get(t) ?? [];
        (r.some((t) => t.text === e) || r.push({ text: e, chars: Array.from(e) }), n.set(t, r));
      }
  return (
    (ta = {
      exact: t,
      exactWords: n,
      folded: $i(ea(_i), Li),
      squashed: e,
      domain: RegExp(
        `[\\p{L}\\p{N}]\\s?(?:\\.|\\(\\.\\)|\\[\\.\\]|\\s(?:dot|cham)\\s)\\s?(?:${bi.join(`|`)})(?![\\p{L}\\p{N}])`,
        `u`,
      ),
      brand: RegExp(`(?:^|[^\\p{L}\\p{N}])(?:${yi.join(`|`)})`, `u`),
    }),
    ta
  );
}
var ra = new WeakMap();
function ia(e) {
  let t = ra.get(e);
  return (t === void 0 && ((t = $i([[`vulgar`, e.slice(0, 200)]], Li)), ra.set(e, t)), t);
}
function aa(e, t) {
  for (let n = 0; n < e.length; n++)
    for (let r of e[n] ?? []) {
      let i = t.get(r);
      if (i !== void 0) {
        for (let t of i) if (t.tokens.every((t, r) => e[n + r]?.includes(t) === !0)) return t.reason;
      }
    }
  return null;
}
function oa(e, t, n) {
  return aa(e, n.all) ?? aa(t, n.stable);
}
function sa(e, t) {
  let n = Yi(e);
  if (e.every((e) => e.alts.length === 1)) return [n];
  let r = [n];
  for (let n of t.exactWords.get(Xi(e)) ?? [])
    n.chars.length === e.length && n.chars.every((t, n) => e[n]?.alts.includes(t)) && r.push(n.text);
  return r;
}
function ca(e, t, n) {
  let r = t.replace(/[^\p{L}\p{N}]+/gu, ``);
  return (e.match(/\p{Nd}/gu)?.length ?? 0) >= 8 ||
    /@[\p{L}\p{N}_.]{2,}/u.test(e) ||
    r.includes(`http`) ||
    r.includes(`www`) ||
    n.domain.test(t) ||
    n.brand.test(t) ||
    /(?:^|[^\p{L}\p{N}])(?:\d+\s?bet(?!\p{L})|bet\s?\d)/u.test(t)
    ? `spam`
    : null;
}
function la(e) {
  return !/\p{L}/u.test(e) || /(.)\1{4,}/u.test(e) || /\p{M}{4,}/u.test(e.normalize(`NFC`));
}
function ua(e, t) {
  let n = na(),
    r = Oi(e),
    i = ca(r, Ii(r), n);
  if (i !== null) return i;
  if (la(r)) return `junk`;
  let a = Ji(r);
  a.length > 1 && a.push(a.flat());
  let o = a.map((e) => sa(e, n)),
    s = a.map((e) => sa(Zi(e), n)),
    c = Li(r),
    l = c.map(Ai),
    u = c.map((e) => [e]),
    d = l.map((e) => [e]),
    f = c.join(``),
    p = Ai(f);
  return (
    oa(o, s, n.exact) ??
    oa(u, d, n.folded) ??
    n.squashed.find((e) => f.includes(e.text) || (e.stable && p.includes(e.text)))?.reason ??
    (t !== void 0 && t.length > 0 ? oa(u, d, ia(t)) : null) ??
    null
  );
}
function da(e, t) {
  let n = typeof e == `string` ? ua(e, t) : `junk`;
  return n === null ? { ok: !0 } : { ok: !1, reason: n };
}
var fa = `Chưa mở được hộp góp ý. Bạn kiểm tra mạng rồi thử lại nhé.`,
  pa = !1;
async function ma(e = {}) {
  if (pa) return;
  pa = !0;
  let n = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  try {
    let { openFeedbackDialog: r } = await t(
      async () => {
        let { openFeedbackDialog: e } = await import(`./feedback-DXIikpVD.js`).then((e) => e.t);
        return { openFeedbackDialog: e };
      },
      __vite__mapDeps([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
      import.meta.url,
    );
    r({ ...e, opener: n, context: () => ({ ...e.context?.() }) });
  } catch (t) {
    (console.error(`Không mở được hộp thoại góp ý`, t), e.onFail?.(fa));
  } finally {
    pa = !1;
  }
}
function ha(e) {
  let t = typeof e == `string` ? e.trim() : ``;
  if (t === ``) return ``;
  let n = t.lastIndexOf(`@`),
    r = n < 0 ? t : t.slice(0, n),
    i = n < 0 ? `` : t.slice(n);
  return `${Array.from(r)[0] ?? ``}•••${i}`;
}
var ga = e({ openAccount: () => ya }),
  _a = `Chưa mở được phần lưu nhân vật. Bạn kiểm tra mạng rồi thử lại nhé.`,
  va = !1;
function ya(e = {}) {
  if (va) return;
  va = !0;
  let n = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  t(
    async () => {
      let { openAccountDialog: e } = await import(`./account-B3fmTrbD.js`).then((e) => e.n);
      return { openAccountDialog: e };
    },
    __vite__mapDeps([16, 1, 5, 6, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17]),
    import.meta.url,
  )
    .then(({ openAccountDialog: t }) => {
      t({ ...e, opener: n });
    })
    .catch((t) => {
      (console.error(`Không mở được hộp thoại tài khoản`, t), e.onFail?.(_a));
    })
    .finally(() => {
      va = !1;
    });
}
function ba(e) {
  t(
    async () => {
      let { getAccount: e } = await import(`./account-B3fmTrbD.js`).then((e) => e.x);
      return { getAccount: e };
    },
    __vite__mapDeps([16, 1, 5, 6, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17]),
    import.meta.url,
  ).then(
    ({ getAccount: t }) => {
      try {
        (z(`account_login_started`, { method: `google`, source: e.reason }), t().startGoogle());
      } catch (t) {
        (z(`account_login_failed`, { method: `google`, reason: `start` }),
          e.onFail(
            t instanceof Error && t.message.trim() !== `` ? t.message : `Đã có lỗi xảy ra. Bạn thử lại nhé.`,
          ));
      }
    },
    (t) => {
      (console.error(`Không nạp được lõi tài khoản`, t), e.onFail(_a));
    },
  );
}
function xa() {
  if (!_()) return null;
  try {
    let e = localStorage.getItem(m),
      t = JSON.parse(e ?? `null`)?.user?.email;
    return { masked: typeof t == `string` ? ha(t) : `` };
  } catch {
    return { masked: `` };
  }
}
function Sa() {
  return t(
    () => import(`./account-B3fmTrbD.js`).then((e) => e.n).then((e) => e.accountSavedText()),
    __vite__mapDeps([16, 1, 5, 6, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17]),
    import.meta.url,
  );
}
var Ca = `Tiếp tục với Google`,
  wa = `<svg class="g-logo" width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
function Ta(e, t = ``) {
  return `<button type="button" class="btn btn--google btn--block${t ? ` ${t}` : ``}" data-ref="${e}">${wa}<span>${Ca}</span></button>`;
}
function Ea(e) {
  return e.querySelector(`span`) ?? e;
}
var Da = `Tên lịch sự, không tục tĩu, không quảng cáo.`,
  Oa = [
    { id: `nam`, label: `Nam` },
    { id: `nu`, label: `Nữ` },
  ],
  ka = { "trang-xam": `Tràng xám`, "trang-lam": `Tràng lam`, "ba-ba": `Bà ba`, "ao-dai": `Áo dài` },
  Aa = 6,
  ja = 15855334,
  Ma = 2762281,
  Na = `nam`,
  Pa = `
<svg class="onb__figure" viewBox="0 0 140 170" focusable="false" aria-hidden="true">
  <ellipse class="fg-ring" cx="70" cy="159" rx="54" ry="8.5"/>
  <ellipse class="fg-ground" cx="70" cy="159.5" rx="36" ry="5.5"/>
  <g class="fg-nu">
    <circle class="fg-hair" cx="97" cy="83" r="9.5"/>
    <path class="fg-hair-line" d="M92 80q5-4 10 0"/>
    <circle class="fg-tie" cx="91.5" cy="79" r="2.3"/>
  </g>
  <g class="fg-body">
    <path class="fg-pants" d="M55 128L47.5 154Q57 159 67 155L69.5 128Z"/>
    <path class="fg-pants" d="M85 128L92.5 154Q83 159 73 155L70.5 128Z"/>
    <ellipse class="fg-shoe" cx="56" cy="156.5" rx="10.5" ry="4.2"/>
    <ellipse class="fg-shoe" cx="84" cy="156.5" rx="10.5" ry="4.2"/>
    <path class="fg-robe" d="M51 87C58 82 82 82 89 87L98 136C83 142.5 57 142.5 42 136Z"/>
    <path class="fg-fold" d="M60 118L56.5 138M80 118L83.5 138"/>
    <path class="fg-hem" d="M42.5 135.5C57 142 83 142 97.5 135.5"/>
    <path class="fg-skin-dark fg-v" d="M60 83L71 104L80 83Z"/>
    <path class="fg-yem" d="M61 84.5h18l-2.5 17h-13z"/>
    <path class="fg-trim fg-cross" d="M82.5 84.5L70.5 105"/>
    <path class="fg-lapel fg-cross" d="M55.5 86.5L62.5 83.5L81 112.5L72.5 118Z"/>
    <path class="fg-trim fg-cross" d="M62.5 84L80.5 112"/>
    <rect class="fg-collar" x="61.5" y="78.5" width="17" height="7" rx="3"/>
    <path class="fg-closure" d="M75 86q7 2 12 7"/>
    <g class="fg-buttons"><circle cx="70" cy="89" r="1.7"/><circle cx="70" cy="96" r="1.7"/></g>
    <path class="fg-sleeve" d="M52 88C41 93 35.5 108 39.5 121C46 126.5 58 123 65.5 113C62.5 105 60.5 96 58.5 89Z"/>
    <path class="fg-sleeve" d="M88 88C99 93 104.5 108 100.5 121C94 126.5 82 123 74.5 113C77.5 105 79.5 96 81.5 89Z"/>
    <path class="fg-trim" d="M39.5 121C46 126.5 58 123 65.5 113M100.5 121C94 126.5 82 123 74.5 113"/>
    <path class="fg-skin" d="M70 101.5C75.5 106.5 76.5 115 70 122C63.5 115 64.5 106.5 70 101.5Z"/>
    <path class="fg-line" d="M70 104.5V119"/>
  </g>
  <g class="fg-head">
    <g class="fg-nam">
      <circle class="fg-skin" cx="38.5" cy="56" r="5.8"/>
      <circle class="fg-skin" cx="101.5" cy="56" r="5.8"/>
      <circle class="fg-skin-dark" cx="38.5" cy="56" r="2.6"/>
      <circle class="fg-skin-dark" cx="101.5" cy="56" r="2.6"/>
    </g>
    <ellipse class="fg-skin" cx="70" cy="52" rx="32" ry="30"/>
    <path class="fg-skin-dark fg-jaw" d="M41.7 66A32 30 0 0 0 98.3 66Q70 88 41.7 66Z"/>
    <g class="fg-nam">
      <path class="fg-scalp" d="M38 52A32 30 0 0 1 102 52C98 40 86 33 70 33C54 33 42 40 38 52Z"/>
      <path class="fg-stubble" d="M38 52A32 30 0 0 1 102 52C98 40 86 33 70 33C54 33 42 40 38 52Z"/>
    </g>
    <g class="fg-nu">
      <path class="fg-hair" d="M36 62V52A34 32 0 0 1 104 52V62Q104 70 96.5 69C98.5 60 97 52 92.5 46C85 38.5 77 36 70 35.5C63 36 55 38.5 47.5 46C43 52 41.5 60 43.5 69Q36 70 36 62Z"/>
      <path class="fg-hair-line" d="M49 36Q57 27 68 25.5"/>
    </g>
    <path class="fg-brow" d="M52.5 47.5Q58 45 63.5 47.5M76.5 47.5Q82 45 87.5 47.5"/>
    <path class="fg-face fg-eyes" d="M52 58Q58 51.5 64 58M76 58Q82 51.5 88 58"/>
    <ellipse class="fg-blush" cx="50.5" cy="64.5" rx="6.2" ry="3.6"/>
    <ellipse class="fg-blush" cx="89.5" cy="64.5" rx="6.2" ry="3.6"/>
    <path class="fg-face" d="M64.5 65.5Q70 70.5 75.5 65.5"/>
  </g>
</svg>`,
  Fa = `
<svg class="onb__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">
  <rect x="4" y="4" width="16" height="16" rx="3.5"/>
  <path d="M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01"/>
</svg>`,
  Ia = `button:not([disabled]), input:not([disabled])`,
  La = `Đăng nhập để giữ nhân vật, cấp, nhiệm vụ và chuỗi giữ lửa khi đổi máy.`,
  Ra = `Không bắt buộc. Đã có nhân vật ở máy khác? Đăng nhập là lấy lại được.`,
  za = `Không cần đăng ký. Nhân vật lưu trên máy này; muốn giữ khi đổi máy thì đăng nhập.`,
  Ba = `Nhân vật lưu trên máy này và cùng tài khoản của bạn.`,
  Va = `Chào mừng đến Chùa Sen`,
  Ha = `Đăng nhập để giữ nhân vật, cấp, nhiệm vụ và chuỗi giữ lửa trên mọi máy.`,
  Ua = `Đăng nhập bằng email`,
  Wa = `Vào chùa không cần đăng nhập`,
  Ga = `Miễn phí · chỉ dùng để giữ nhân vật`,
  Ka = `Khi đăng nhập, bạn đồng ý với <a href="/dieu-khoan-su-dung/" target="_blank" rel="noopener">Điều khoản</a> và <a href="/chinh-sach-quyen-rieng-tu/" target="_blank" rel="noopener">Chính sách quyền riêng tư</a>.`,
  qa = `Đang đăng nhập…`,
  Ja = `Chùa đang kiểm tra tài khoản của bạn, chờ một chút nhé.`,
  Ya = 15e3,
  Xa = `Đang mở…`,
  Za = `Chọn nhân vật để vào chùa.`,
  Qa = `Đã đăng nhập. Chọn nhân vật để vào chùa.`,
  $a = null,
  eo = (e) => `#${e.toString(16).padStart(6, `0`)}`;
function to(e, t, n) {
  let r = 0;
  for (let i of [16, 8, 0]) {
    let a = (e >> i) & 255,
      o = (t >> i) & 255;
    r |= Math.round(a + (o - a) * n) << i;
  }
  return r;
}
function no() {
  return (
    typeof window.matchMedia == `function` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  );
}
function ro() {
  return (
    typeof window.matchMedia == `function` && window.matchMedia(`(hover: hover) and (pointer: fine)`).matches
  );
}
function io(e) {
  let t = e
    ? `<button type="button" class="btn btn--ghost btn--block" data-ref="wEmail">${Ua}</button>`
    : `<button type="button" class="btn btn--gold btn--lg btn--block" data-ref="wEmail">${Ua}</button>`;
  return `
    <section class="onb__card card card--glow onb__welcome" tabindex="-1" data-ref="welcome">
      <header class="onb__head">
        <h1 class="onb__title" id="onb-welcome-title">${Va}</h1>
        <p class="onb__lead" id="onb-welcome-lead">${Ha}</p>
      </header>
      <div class="onb__login">
        ${e ? Ta(`wGoogle`, `btn--lg`) : ``}
        ${t}
        <div class="onb__inline" data-ref="wInline" hidden></div>
      </div>
      <p class="onb__reassure">${Ga}</p>
      <p class="onb__error" data-ref="wError" hidden></p>
      <button type="button" class="onb__guest" data-ref="wGuest">${Wa}</button>
      <p class="onb__terms">${Ka}</p>
      <p class="sr-only" role="status" aria-live="polite" data-ref="wLive"></p>
    </section>`;
}
function ao() {
  return `
    <section class="onb__card card card--glow onb__welcome" tabindex="-1" role="status" data-ref="welcome">
      <header class="onb__head">
        <h1 class="onb__title" id="onb-welcome-title">${qa}</h1>
        <p class="onb__lead" id="onb-welcome-lead">${Ja}</p>
      </header>
    </section>`;
}
function oo(e, t) {
  return !e && !t
    ? `<div class="onb__save" role="group" aria-labelledby="onb-save-lead">
        <p class="onb__save-lead" id="onb-save-lead">${La}</p>
        <p class="onb__save-hint" id="onb-save-hint" data-ref="saveHint">${Ra}</p>
        <button type="button" class="btn btn--sm onb__save-btn" data-ref="login" aria-describedby="onb-save-hint"><span>Đăng nhập</span><small>Google hoặc email</small></button>
      </div>`
    : `<p class="onb__note">${t ? Ba : za}</p>`;
}
function so(e, t, n, r, i) {
  let a = e === `edit`,
    o = r ? `Đổi pháp danh` : a ? `Đổi nhân vật` : `Vào chùa`,
    s = r
      ? `Đặt một pháp danh khác để vào phòng chung cùng mọi người.`
      : a
        ? `Thay đổi diện mạo của bạn trong chùa.`
        : `Chọn nhanh một nhân vật rồi bước vào sân chùa.`,
    c = Oa.map(
      (e) =>
        `<button type="button" class="chip onb__chip" data-gender="${e.id}" aria-pressed="false">${e.label}</button>`,
    ).join(``),
    l = Dn.map(
      (e) =>
        `<button type="button" class="chip onb__chip" data-cut="${e.id}" aria-pressed="false">${e.label}</button>`,
    ).join(``),
    u = a
      ? `<button type="button" class="btn btn--ghost btn--lg" data-ref="cancel">Hủy</button>
       <button type="submit" class="btn btn--gold btn--lg onb__submit">Lưu</button>`
      : `<button type="submit" class="btn btn--gold btn--lg onb__submit">Vào chùa</button>`;
  return `${i ? (i.kind === `pending` ? ao() : io(i.google)) : ``}
    <form class="onb__card card card--glow" autocomplete="off" tabindex="-1" data-ref="card"${i ? ` hidden` : ``}>
      <header class="onb__head">
        <h1 class="onb__title" id="onb-title">${o}</h1>
        <p class="onb__lead" id="onb-lead">${s}</p>
      </header>

      <div class="onb__preview" aria-hidden="true">
        ${Pa}
        <p class="onb__plate" data-ref="plate"></p>
      </div>

      <div class="onb__fields">
        <div class="onb__field">
          <label class="onb__label" for="onb-name">Pháp danh</label>
          <div class="onb__name-row">
            <input id="onb-name" class="onb__input" type="text" maxlength="24"
              autocomplete="off" autocapitalize="words" spellcheck="false"
              enterkeyhint="${a ? `done` : `go`}" aria-describedby="onb-name-hint onb-name-error"
              data-ref="name" />
            <button type="button" class="icon-btn onb__dice" data-ref="dice"
              aria-label="Gợi ý pháp danh khác" title="Gợi ý pháp danh khác">${Fa}</button>
          </div>
          <p class="onb__hint" id="onb-name-hint">${Da}</p>
          <p class="onb__error" id="onb-name-error" aria-live="polite" data-ref="nameError"></p>
        </div>

        <div class="onb__field" role="group" aria-labelledby="onb-gender-label">
          <span class="onb__label" id="onb-gender-label">Giới tính</span>
          <div class="onb__chips">${c}</div>
        </div>

        <div class="onb__field" role="group" aria-labelledby="onb-style-label">
          <div class="onb__label-row">
            <span class="onb__label" id="onb-style-label">Kiểu áo</span>
            ${t ? `<button type="button" class="btn btn--ghost btn--sm onb__more" data-ref="outfit">Phụ kiện, kiểu khác</button>` : ``}
          </div>
          <div class="onb__chips onb__styles" data-ref="styles"></div>
          <div class="onb__chips onb__cuts" role="group" aria-label="Dáng áo dài" data-ref="cuts">${l}</div>
        </div>

        <div class="onb__field" role="group" aria-labelledby="onb-robe-label">
          <span class="onb__label" id="onb-robe-label">Màu áo<span class="onb__color-name" data-ref="colorName"></span></span>
          <div class="onb__swatches" data-ref="swatches"></div>
        </div>
      </div>

      <div class="onb__actions">${u}</div>
      ${oo(a, n)}
      <p class="sr-only" role="status" aria-live="polite" data-ref="live"></p>
    </form>`;
}
function co() {
  let e = p.supabaseUrl,
    t = p.publishableKey;
  return e !== `` && t !== ``;
}
function lo() {
  return p.googleClientId !== `` && !kt(navigator.userAgent);
}
function uo(e, t, n) {
  return e || t || n || !co() || Ar() !== null
    ? null
    : v()
      ? { kind: `pending` }
      : { kind: `welcome`, google: lo() };
}
function fo(e, n) {
  if ($a) return $a;
  let { mode: r } = n,
    i = r === `edit`,
    a = n.initial ? Or(n.initial) : null,
    o = i && n.rejectedName ? Tr(n.rejectedName) : ``,
    s = document.activeElement instanceof HTMLElement ? document.activeElement : null,
    c = new Promise((c) => {
      let l = document.createElement(`div`);
      ((l.className = `onb onb--${r}`),
        l.setAttribute(`role`, `dialog`),
        l.setAttribute(`aria-modal`, `true`));
      let u = xa() !== null,
        d = uo(i, o !== ``, u);
      (l.setAttribute(`aria-labelledby`, d ? `onb-welcome-title` : `onb-title`),
        l.setAttribute(`aria-describedby`, d ? `onb-welcome-lead` : `onb-lead`),
        (l.innerHTML = so(r, i && n.onOutfit !== void 0, u, o !== ``, d)));
      let f = (e) => l.querySelector(`[data-ref="${e}"]`),
        p = f(`card`),
        m = l.querySelector(`[data-ref="welcome"]`),
        h = m ? `intro` : `form`,
        g,
        _ = f(`name`),
        v = f(`dice`),
        y = f(`plate`),
        b = f(`live`),
        S = f(`nameError`),
        C = f(`styles`),
        w = f(`cuts`),
        T = f(`swatches`),
        E = l.querySelector(`.onb__figure`),
        ee = [...l.querySelectorAll(`button[data-gender]`)],
        D = [...w.querySelectorAll(`button[data-cut]`)],
        O = a?.gender ?? Na,
        k = i ? $n() : null,
        A = zn(k ?? (i && a ? Gn(a.robe) : On)),
        j = !i || k !== null,
        M = null,
        te = !1,
        N = null,
        ne = wn.includes(A.style) ? wn : [...wn, A.style];
      (C.style.setProperty(`--n`, String(ne.length)),
        C.replaceChildren(
          ...ne.map((e) => {
            let t = document.createElement(`button`);
            return (
              (t.type = `button`),
              (t.className = `chip onb__chip`),
              (t.dataset.style = e),
              (t.title = H(e).label),
              (t.textContent = ka[e] ?? H(e).label),
              t
            );
          }),
        ));
      let re = [...C.querySelectorAll(`button`)];
      a ? ((_.value = a.name), (_.placeholder = a.name)) : ((M = en(O)), (_.value = M), (_.placeholder = M));
      let ie = () => Tr(_.value) || Tr(_.placeholder);
      function ae() {
        let e = H(A.style);
        N = A.style;
        let t = e.primary.map((e, t) => t).filter((e) => e < Aa || e === A.primary);
        T.replaceChildren(
          ...t.map((t) => {
            let n = e.primary[t],
              r = document.createElement(`button`);
            ((r.type = `button`),
              (r.className = `onb__swatch`),
              (r.dataset.color = String(t)),
              r.setAttribute(`aria-label`, n?.name ?? ``),
              (r.title = n?.name ?? ``));
            let i = document.createElement(`span`);
            return (
              (i.className = `onb__dot`),
              i.setAttribute(`aria-hidden`, `true`),
              r.style.setProperty(`--sw`, eo(n?.hex ?? 0)),
              r.style.setProperty(`--sw-ink`, po(n?.hex ?? 0)),
              r.append(i),
              r
            );
          }),
        );
      }
      function P() {
        let e = H(A.style),
          { primary: t, secondary: n } = Wn(A),
          r = to(t, 0, 0.28),
          i = e.family === `trang` ? n : to(t, 16777215, 0.5),
          a = e.family === `trang` ? r : e.family === `tuthan` ? Ma : e.secondaryRole === `trousers` ? n : ja;
        ((E.dataset.look = O),
          (E.dataset.family = e.family),
          (E.dataset.outfit = A.style),
          l.style.setProperty(`--onb-robe`, eo(t)),
          l.style.setProperty(`--onb-robe-shade`, eo(r)),
          l.style.setProperty(`--onb-robe-trim`, eo(i)),
          l.style.setProperty(`--onb-pants`, eo(a)));
        for (let e of ee) e.setAttribute(`aria-pressed`, String(e.dataset.gender === O));
        for (let e of re) e.setAttribute(`aria-pressed`, String(e.dataset.style === A.style));
        w.hidden = e.family !== `aodai`;
        for (let e of D) e.setAttribute(`aria-pressed`, String(e.dataset.cut === A.cut));
        N !== A.style && ae();
        for (let e of T.querySelectorAll(`button`))
          e.setAttribute(`aria-pressed`, String(Number(e.dataset.color) === A.primary));
        ((f(`colorName`).textContent = ` · ${e.primary[A.primary]?.name ?? ``}`), (y.textContent = ie()));
      }
      function oe() {
        (E.classList.remove(`is-pop`), E.getBoundingClientRect(), E.classList.add(`is-pop`));
      }
      function se() {
        let e = en(O);
        for (let t = 0; t < 4 && e === _.placeholder; t += 1) e = en(O);
        return ((M = e), (_.value = e), (_.placeholder = e), de(), e);
      }
      function ce(e) {
        let t = zn({ ...A, ...e });
        (t.style !== A.style || t.cut !== A.cut || t.primary !== A.primary) && ((A = t), (j = !0), P(), oe());
      }
      function F() {
        let e = j ? qn(A) : (a?.robe ?? qn(A));
        return { name: ie() || en(O), gender: O, robe: e };
      }
      function le(e) {
        let t = da(e);
        return t.ok
          ? o !== `` && e.toLowerCase() === o.toLowerCase()
            ? { reason: `other`, message: xi }
            : null
          : { reason: t.reason, message: Ti(t.reason) };
      }
      function ue(e) {
        ((S.textContent = e), _.setAttribute(`aria-invalid`, `true`));
      }
      function de() {
        S.textContent !== `` && ((S.textContent = ``), _.removeAttribute(`aria-invalid`));
      }
      let fe = new Set();
      function pe() {
        let e = F(),
          t = le(e.name);
        return t === null
          ? e
          : (ue(t.message),
            fe.has(t.reason) ||
              (fe.add(t.reason),
              z(`name_rejected`, { where: i ? `editor` : `onboarding`, reason: t.reason })),
            _.focus({ preventScroll: !0 }),
            null);
      }
      function me(e) {
        if (te) return;
        ((te = !0),
          ($a = null),
          document.removeEventListener(`keydown`, he, !0),
          window.clearTimeout(g),
          x.settled === be && (x.settled = void 0),
          e && (jr(e), j && tr(A)),
          l.setAttribute(`inert`, ``),
          l.setAttribute(`aria-hidden`, `true`));
        let t = !1,
          n = () => {
            t || ((t = !0), l.remove());
          };
        (no() ? n() : (l.classList.add(`is-leaving`), window.setTimeout(n, 320)),
          s && s !== document.body && s.isConnected && s.focus({ preventScroll: !0 }),
          c(e));
      }
      function he(e) {
        if (e.target instanceof Element && e.target.closest(`dialog`)) return;
        if (e.key === `Escape` && i) {
          (e.preventDefault(), me(null));
          return;
        }
        if (e.key !== `Tab`) return;
        let t = h === `intro` && m ? m : p,
          n = [...t.querySelectorAll(Ia)].filter((e) => !e.closest(`[hidden]`)),
          r = n[0],
          a = n[n.length - 1];
        if (!r || !a) return;
        let o = document.activeElement;
        l.contains(o)
          ? e.shiftKey && (o === r || o === t)
            ? (e.preventDefault(), a.focus())
            : !e.shiftKey && o === a && (e.preventDefault(), r.focus())
          : (e.preventDefault(), r.focus());
      }
      (_.addEventListener(`input`, () => {
        (de(), P());
      }),
        v.addEventListener(`click`, () => {
          ((b.textContent = `Gợi ý pháp danh: ${se()}`),
            P(),
            v.classList.remove(`is-rolling`),
            v.offsetWidth,
            v.classList.add(`is-rolling`));
        }),
        v.addEventListener(`animationend`, () => v.classList.remove(`is-rolling`)));
      for (let e of ee)
        e.addEventListener(`click`, () => {
          let t = e.dataset.gender;
          t !== O && ((O = t), M !== null && (_.value === M || _.value.trim() === ``) && se(), P(), oe());
        });
      (C.addEventListener(`click`, (e) => {
        let t = e.target.closest(`button[data-style]`);
        t && ce({ style: t.dataset.style });
      }),
        w.addEventListener(`click`, (e) => {
          let t = e.target.closest(`button[data-cut]`);
          t && ce({ cut: t.dataset.cut === `suong` ? `suong` : `ta` });
        }),
        T.addEventListener(`click`, (e) => {
          let t = e.target.closest(`button[data-color]`);
          t && ce({ primary: Number(t.dataset.color) });
        }),
        E.addEventListener(`animationend`, (e) => {
          e.target === E && E.classList.remove(`is-pop`);
        }),
        l.querySelector(`[data-ref="cancel"]`)?.addEventListener(`click`, () => me(null)),
        l.querySelector(`[data-ref="outfit"]`)?.addEventListener(`click`, () => {
          let e = pe();
          e !== null && (me(e), n.onOutfit?.());
        }));
      function ge() {
        let e = l.querySelector(`[data-ref="login"]`),
          t = l.querySelector(`[data-ref="saveHint"]`);
        e?.addEventListener(`click`, () => {
          (t && ((t.textContent = Ra), t.classList.remove(`is-error`)),
            ya({
              reason: `onboarding`,
              onFail: (e) => {
                (t && ((t.textContent = e), t.classList.add(`is-error`)), (b.textContent = e));
              },
            }));
        });
      }
      ge();
      function _e() {
        if (i) return;
        let e = xa() !== null,
          t = p.querySelector(`.onb__save, .onb__note`);
        if (!t || t.classList.contains(`onb__note`) === e) return;
        let n = document.createElement(`template`);
        ((n.innerHTML = oo(!1, e)), t.replaceWith(n.content), ge());
      }
      function ve() {
        ro() ? (_.focus({ preventScroll: !0 }), _.select()) : p.focus({ preventScroll: !0 });
      }
      function ye() {
        h !== `form` &&
          m &&
          ((h = `form`),
          window.clearTimeout(g),
          (m.hidden = !0),
          (p.hidden = !1),
          l.setAttribute(`aria-labelledby`, `onb-title`),
          l.setAttribute(`aria-describedby`, `onb-lead`),
          _e(),
          (b.textContent = xa() ? Qa : Za),
          ve());
      }
      function be() {
        h === `form` ? _e() : (d?.kind === `pending` || xa() !== null) && ye();
      }
      if (
        (i || (x.settled = be),
        d?.kind === `pending` && (g = window.setTimeout(ye, Ya)),
        m && d?.kind === `welcome`)
      ) {
        let e = m.querySelector(`[data-ref="wGoogle"]`),
          n = m.querySelector(`[data-ref="wEmail"]`),
          r = m.querySelector(`[data-ref="wGuest"]`),
          i = m.querySelector(`[data-ref="wInline"]`),
          a = m.querySelector(`[data-ref="wError"]`),
          o = m.querySelector(`[data-ref="wLive"]`),
          s = (e) => {
            let t = Ea(e),
              n = t.textContent;
            return (
              (t.textContent = Xa),
              e.setAttribute(`aria-busy`, `true`),
              () => {
                ((t.textContent = n), e.removeAttribute(`aria-busy`));
              }
            );
          },
          c = (e) => {
            ((a.textContent = e), (a.hidden = !1), (o.textContent = e));
          },
          l = () => {
            ((a.hidden = !0), (a.textContent = ``));
          },
          u = () =>
            void t(
              () => import(`./account-B3fmTrbD.js`).then((e) => e.t),
              __vite__mapDeps([16, 1, 5, 6, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17]),
              import.meta.url,
            ).catch(() => void 0);
        for (let t of [e, n])
          (t?.addEventListener(`pointerenter`, u, { once: !0 }),
            t?.addEventListener(`pointerdown`, u, { once: !0 }));
        (e?.addEventListener(`click`, () => {
          (z(`onboarding_welcome`, { action: `google` }), l());
          let t = s(e);
          ba({
            reason: `welcome`,
            onFail: (e) => {
              (t(), c(e));
            },
          });
        }),
          n?.addEventListener(`click`, () => {
            (z(`onboarding_welcome`, { action: `email` }), l());
            let e = s(n);
            t(
              async () => {
                let { mountInlineEmail: e } = await import(`./account-B3fmTrbD.js`).then((e) => e.t);
                return { mountInlineEmail: e };
              },
              __vite__mapDeps([16, 1, 5, 6, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17]),
              import.meta.url,
            ).then(
              ({ mountInlineEmail: t }) => {
                (e(), (n.hidden = !0), (i.hidden = !1), t({ root: i, source: `welcome`, onReady: ye }));
              },
              (t) => {
                (console.error(`Không nạp được ô đăng nhập bằng email`, t), e(), c(_a));
              },
            );
          }),
          r?.addEventListener(`click`, () => {
            (z(`onboarding_welcome`, { action: `guest` }), ye());
          }));
      }
      if (
        (p.addEventListener(`submit`, (e) => {
          e.preventDefault();
          let t = pe();
          t !== null && me(t);
        }),
        document.addEventListener(`keydown`, he, !0),
        P(),
        o !== `` &&
          ue(
            le(o)?.message ??
              `Tên này chưa phù hợp với nội quy Chùa Sen (không tục tĩu, xúc phạm, quảng cáo hay giả danh ban quản trị). Bạn đặt tên khác nhé.`,
          ),
        e.append(l),
        m)
      ) {
        d?.kind === `welcome` && z(`onboarding_welcome`, { action: `shown` });
        let e = m.querySelector(`[data-ref="wGoogle"], [data-ref="wEmail"]`);
        ro() && e ? e.focus({ preventScroll: !0 }) : m.focus({ preventScroll: !0 });
      } else ve();
    });
  return (($a = c), c);
}
function po(e) {
  return 0.299 * ((e >> 16) & 255) + 0.587 * ((e >> 8) & 255) + 0.114 * (e & 255) > 170
    ? `#2a1a07`
    : `#ffffff`;
}
var mo = `(min-width: 900px), (orientation: landscape) and (max-height: 520px)`,
  ho = `(prefers-reduced-motion: reduce)`,
  go = 280,
  _o = 96,
  vo = `a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])`;
function yo(e) {
  return typeof window.matchMedia == `function` && window.matchMedia(e).matches;
}
function bo(e) {
  (e.classList.add(`panel-host`),
    (e.innerHTML = `
    <div class="panel-backdrop" data-ref="backdrop"></div>
    <section class="panel" role="dialog" aria-modal="true" aria-label="Công phu" tabindex="-1" data-ref="panel" inert>
      <header class="panel__head" data-ref="head">
        <span class="panel__grip" aria-hidden="true"></span>
        <button type="button" class="panel__back" data-ref="back" aria-label="Quay lại chùa">${B(`chevron-left`)}<span>Quay lại chùa</span></button>
      </header>
      <div class="panel__body" data-ref="body"></div>
    </section>`));
  let t = (t) => {
      let n = e.querySelector(`[data-ref="${t}"]`);
      if (!n) throw Error(`Panel: thiếu phần tử ${t}`);
      return n;
    },
    n = t(`backdrop`),
    r = t(`panel`),
    i = t(`head`),
    a = t(`back`),
    o = t(`body`),
    s = new Set(),
    c = null,
    l,
    u = null,
    d = (e) => {
      for (let t of [...s]) t(e);
    },
    f = () => yo(mo);
  function p() {
    f() ? r.removeAttribute(`aria-modal`) : r.setAttribute(`aria-modal`, `true`);
  }
  (p(),
    typeof window.matchMedia == `function` &&
      ((u = window.matchMedia(mo)), u.addEventListener?.(`change`, p)));
  let m = () =>
    Array.from(r.querySelectorAll(vo)).filter(
      (e) =>
        !e.hasAttribute(`disabled`) &&
        e.getAttribute(`aria-hidden`) !== `true` &&
        !e.closest(`[hidden], [inert]:not(.panel)`),
    );
  function h() {
    r.focus({ preventScroll: !0 });
  }
  function g(e) {
    let t = m(),
      n = t[0],
      i = t[t.length - 1];
    if (!n || !i) {
      (e.preventDefault(), h());
      return;
    }
    let a = document.activeElement;
    !(a instanceof Node) || !r.contains(a) || a === r
      ? (e.preventDefault(), (e.shiftKey ? i : n).focus({ preventScroll: !0 }))
      : e.shiftKey && a === n
        ? (e.preventDefault(), i.focus({ preventScroll: !0 }))
        : !e.shiftKey && a === i && (e.preventDefault(), n.focus({ preventScroll: !0 }));
  }
  function _(e) {
    if (e.key === `Escape`) {
      if (e.defaultPrevented || e.isComposing) return;
      (e.preventDefault(), S());
    } else e.key === `Tab` && !f() && g(e);
  }
  function v(e) {
    if (e?.cleanup)
      try {
        e.cleanup();
      } catch (e) {
        console.error(`Panel: cleanup của view bị lỗi`, e);
      }
  }
  function y(t) {
    (window.clearTimeout(l),
      (l = void 0),
      r.removeAttribute(`inert`),
      e.classList.add(`is-open`),
      (document.documentElement.dataset.panelOpen = t),
      document.addEventListener(`keydown`, _));
  }
  function b(t) {
    (e.classList.remove(`is-open`),
      r.setAttribute(`inert`, ``),
      r.classList.remove(`is-dragging`),
      (r.style.transform = ``),
      delete document.documentElement.dataset.panelOpen,
      document.removeEventListener(`keydown`, _),
      window.clearTimeout(l));
    let n = yo(ho) ? 0 : go;
    (n === 0
      ? o.replaceChildren()
      : (l = window.setTimeout(() => {
          ((l = void 0), o.replaceChildren());
        }, n)),
      t?.isConnected && t.focus({ preventScroll: !0 }));
  }
  function x(e, t) {
    if (c?.view === e) {
      h();
      return;
    }
    let n = c,
      i = document.activeElement,
      a = n?.opener ?? (i instanceof HTMLElement && i !== document.body && !r.contains(i) ? i : null);
    ((c = null), v(n), window.clearTimeout(l), (l = void 0), o.replaceChildren(), (o.scrollTop = 0));
    let s;
    try {
      s = e.mount(o, t) ?? void 0;
    } catch (r) {
      (console.error(`Panel: không dựng được view "${e.id}"`, r),
        o.replaceChildren(),
        t.toast(`Không mở được phần này. Bạn thử lại nhé.`),
        n && (b(null), d(null)));
      return;
    }
    ((c = { view: e, cleanup: s, opener: a }),
      r.setAttribute(`aria-label`, e.title),
      (r.dataset.route = e.id),
      y(e.id),
      r.contains(document.activeElement) || h(),
      d(e.id));
  }
  function S() {
    let e = c;
    e && ((c = null), v(e), b(e.opener), d(null));
  }
  (a.addEventListener(`click`, S), n.addEventListener(`click`, S));
  let C = null,
    w = (e) => {
      if (
        !(!c || f() || C) &&
        (e.pointerType !== `mouse` || e.button === 0) &&
        !(e.target instanceof Element && e.target.closest(`button`)) &&
        ((C = { pointerId: e.pointerId, startY: e.clientY, dy: 0 }), typeof i.setPointerCapture == `function`)
      )
        try {
          i.setPointerCapture(e.pointerId);
        } catch {}
    },
    T = (e) => {
      C &&
        e.pointerId === C.pointerId &&
        ((C.dy = Math.max(0, e.clientY - C.startY)),
        r.classList.add(`is-dragging`),
        (r.style.transform = `translateY(${C.dy}px)`));
    },
    E = (e) => {
      if (!C || e.pointerId !== C.pointerId) return;
      let { dy: t } = C;
      ((C = null), r.classList.remove(`is-dragging`), (r.style.transform = ``), t >= _o && S());
    };
  return (
    i.addEventListener(`pointerdown`, w),
    i.addEventListener(`pointermove`, T),
    i.addEventListener(`pointerup`, E),
    i.addEventListener(`pointercancel`, E),
    {
      open: x,
      close: S,
      current: () => c?.view.id ?? null,
      onChange(e) {
        return (s.add(e), () => s.delete(e));
      },
      dispose() {
        (S(),
          window.clearTimeout(l),
          (l = void 0),
          s.clear(),
          u?.removeEventListener?.(`change`, p),
          e.classList.remove(`panel-host`, `is-open`),
          e.replaceChildren());
      },
    }
  );
}
var xo = `chua-online:claim-key`,
  So = `chua-online:rewards`,
  Co = `chua-online:badges`;
function wo(e) {
  try {
    let t = (e === void 0 ? localStorage : e)?.getItem(`chua-online:badges`) ?? null;
    if (t === null) return [];
    let n = JSON.parse(t);
    return typeof n != `object` || !n || Array.isArray(n)
      ? []
      : Object.values(n).filter((e) => typeof e == `string` && e !== ``);
  } catch {
    return [];
  }
}
function To(e) {
  try {
    let t = e === void 0 ? localStorage : e;
    return t !== null && [n, i, So, Co].some((e) => t.getItem(e) !== null);
  } catch {
    return !1;
  }
}
var Eo = `chua-online`,
  Do = 2e5,
  Oo = new Set([Co]),
  ko = `chua-online:v1`,
  Ao = 1,
  jo = `Trình duyệt này không cho lưu dữ liệu trên thiết bị.`,
  Mo = `Đây không phải tệp sao lưu của Chùa Sen.`,
  No = `Tệp sao lưu bị hỏng hoặc không đọc được.`,
  Po = `Tệp sao lưu quá lớn.`,
  Fo = `Tệp sao lưu này tạo bởi phiên bản mới hơn. Hãy cập nhật ứng dụng rồi thử lại.`,
  Io = `Chưa tải được phần ghép dữ liệu. Hãy kiểm tra kết nối rồi thử lại.`;
function Lo() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function Ro(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
function zo(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = e.key(n);
    r !== null && r.startsWith(`chua-online:`) && t.push(r);
  }
  return t;
}
function Bo(e = Lo(), t = new Date()) {
  if (!e) throw Error(jo);
  let n = {};
  for (let t of zo(e)) {
    if (Oo.has(t)) continue;
    let r = e.getItem(t);
    r !== null && (n[t] = r);
  }
  return { app: Eo, version: 1, exportedAt: t.toISOString(), data: n };
}
function Vo(e = new Date()) {
  let t = (e) => String(e).padStart(2, `0`);
  return `chua-online-${`${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`}.json`;
}
function Ho(e = new Date()) {
  let t = Bo(void 0, e),
    n = Vo(e),
    r = new Blob([JSON.stringify(t, null, 2)], { type: `application/json` }),
    i = URL.createObjectURL(r),
    a = document.createElement(`a`);
  return (
    (a.href = i),
    (a.download = n),
    (a.hidden = !0),
    document.body.append(a),
    a.click(),
    a.remove(),
    window.setTimeout(() => URL.revokeObjectURL(i), 1e4),
    n
  );
}
function Uo(e) {
  if (typeof e != `string` || e.length > 1e6) throw Error(Po);
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    throw Error(No);
  }
  if (!Ro(t) || t.app !== `chua-online`) throw Error(Mo);
  if (typeof t.version == `number` && t.version > 1) throw Error(Fo);
  if (t.version !== 1 || !Ro(t.data)) throw Error(No);
  let n = {};
  for (let [e, r] of Object.entries(t.data)) {
    if (!e.startsWith(`chua-online:`) || typeof r != `string`) throw Error(No);
    if (r.length > Do) throw Error(Po);
    Oo.has(e) || (n[e] = r);
  }
  if (Object.keys(n).length === 0) throw Error(`Tệp sao lưu không có dữ liệu nào.`);
  let r = n[ko];
  if (r !== void 0) {
    let e;
    try {
      e = JSON.parse(r);
    } catch {
      throw Error(No);
    }
    if (!Ro(e)) throw Error(No);
    if (typeof e.version == `number` && e.version > Ao) throw Error(Fo);
  }
  return n;
}
async function Wo(e) {
  if (e.size > 1e6) throw Error(Po);
  let t;
  try {
    t = await e.text();
  } catch {
    throw Error(No);
  }
  return Uo(t);
}
async function Go(e, n = Lo()) {
  if (!n) throw Error(jo);
  let { mergeRestore: r } = await t(
      () => import(`./progress-BuhROEX9.js`).then((e) => e.n),
      __vite__mapDeps([18, 1, 5, 6, 19, 8, 11, 9, 10, 4, 7, 12, 13, 14, 20, 21, 3, 22, 23]),
      import.meta.url,
    ).catch(() => {
      throw Error(Io);
    }),
    i = [];
  for (let e of zo(n)) {
    let t = n.getItem(e);
    t !== null && i.push([e, t]);
  }
  let a = Object.entries(r(Object.fromEntries(i), e)).filter(
    (e) => e[0].startsWith(`chua-online:`) && !Oo.has(e[0]) && typeof e[1] == `string`,
  );
  try {
    for (let e of zo(n)) n.removeItem(e);
    for (let [e, t] of a) n.setItem(e, t);
  } catch {
    try {
      for (let e of zo(n)) n.removeItem(e);
      for (let [e, t] of i) n.setItem(e, t);
    } catch {}
    throw Error(`Không ghi được dữ liệu lên thiết bị (bộ nhớ đầy hoặc bị chặn).`);
  }
}
function Ko(e = Lo()) {
  if (!e) throw Error(jo);
  let t = zo(e);
  try {
    for (let n of t) e.removeItem(n);
  } catch {
    throw Error(`Không xóa được dữ liệu trên thiết bị này.`);
  }
  return t.length;
}
var qo = [
  {
    id: `niem-phat-ky-duyen`,
    title: `Nam mô A Di Đà Phật (niệm Phật)`,
    src: `audio/niem-phat-ky-duyen.mp3`,
    durationSec: 176.4,
    license: `CC0 1.0`,
    credit: `Kỳ Duyên hát niệm Phật, ghi âm bởi SieuAmThanh (Bình Hòa, An Giang) · Freesound`,
    sourceUrl: `https://freesound.org/people/SieuAmThanh/sounds/855542/`,
  },
  {
    id: `kinh-a-di-da`,
    title: `Niệm kinh A Di Đà`,
    src: `audio/kinh-a-di-da.mp3`,
    durationSec: 179.95,
    license: `CC0 1.0`,
    credit: `Duyên tụng kinh A Di Đà, ghi âm bởi SieuAmThanh (An Giang) · Freesound`,
    sourceUrl: `https://freesound.org/people/SieuAmThanh/sounds/546710/`,
  },
  {
    id: `niem-phat-ngay-ram`,
    title: `Niệm Phật ngày Rằm`,
    src: `audio/niem-phat-ngay-ram.mp3`,
    durationSec: 70.09,
    license: `CC0 1.0`,
    credit: `Duyên niệm Phật ngày Rằm, ghi âm bởi SieuAmThanh (An Giang) · Freesound`,
    sourceUrl: `https://freesound.org/people/SieuAmThanh/sounds/547709/`,
  },
  {
    id: `chua-bai-dinh`,
    title: `Tiếng ngân tụng ở chùa Bái Đính`,
    src: `audio/chua-bai-dinh.mp3`,
    durationSec: 27.8,
    license: `CC0 1.0`,
    credit: `Vị tăng hát trong chùa Bái Đính (Ninh Bình), ghi âm bởi delfieldrecordings · Freesound`,
    sourceUrl: `https://freesound.org/people/delfieldrecordings/sounds/842055/`,
  },
];
function Jo(e, t = `./`) {
  return `${t.endsWith(`/`) ? t : `${t}/`}${e.src}`;
}
var Yo = [
  {
    id: `nhac-dan-tranh`,
    title: `Đàn tranh độc tấu`,
    opus: `audio/nhac/dan-tranh.webm`,
    mp3: `audio/nhac/dan-tranh.mp3`,
    durationSec: 85.09,
    license: `CC0 1.0`,
    credit: `neolein (đàn tranh, thang ngũ cung) · Freesound`,
    sourceUrl: `https://freesound.org/people/neolein/sounds/472707/`,
  },
  {
    id: `nhac-nui-da`,
    title: `Núi đá vôi`,
    opus: `audio/nhac/nui-da.webm`,
    mp3: `audio/nhac/nui-da.mp3`,
    durationSec: 104.5,
    license: `CC0 1.0`,
    credit: `neolein (đàn tranh trên nền nhạc núi rừng) · Freesound`,
    sourceUrl: `https://freesound.org/people/neolein/sounds/664200/`,
  },
  {
    id: `nhac-hoa-sen`,
    title: `Hoa sen`,
    opus: `audio/nhac/hoa-sen.webm`,
    mp3: `audio/nhac/hoa-sen.mp3`,
    durationSec: 120,
    license: `CC0 1.0`,
    credit: `nemaavla (đàn phím, chuông, tiếng ngân) · Freesound`,
    sourceUrl: `https://freesound.org/people/nemaavla/sounds/507957/`,
  },
  {
    id: `nhac-ngoi-thien`,
    title: `Ngồi thiền`,
    opus: `audio/nhac/ngoi-thien.webm`,
    mp3: `audio/nhac/ngoi-thien.mp3`,
    durationSec: 96,
    license: `CC0 1.0`,
    credit: `SieuAmThanh (nhạc màn "Vương quốc hoa sen", GarageBand) · Freesound`,
    sourceUrl: `https://freesound.org/people/SieuAmThanh/sounds/561218/`,
  },
  {
    id: `nhac-gio-nuoc-go`,
    title: `Gió, nước, gỗ`,
    opus: `audio/nhac/gio-nuoc-go.webm`,
    mp3: `audio/nhac/gio-nuoc-go.mp3`,
    durationSec: 87,
    license: `CC0 1.0`,
    credit: `CVLTIV8R (đàn dây kiểu Á Đông, gió và nước) · Freesound`,
    sourceUrl: `https://freesound.org/people/CVLTIV8R/sounds/840945/`,
  },
];
function Xo(e, t, n = `./`) {
  return `${n.endsWith(`/`) ? n : `${n}/`}${t === `opus` ? e.opus : e.mp3}`;
}
var Zo = `ambientCG`;
function W(e, t) {
  return {
    id: e,
    title: t,
    credit: `${Zo} (ambientcg.com)`,
    license: `CC0 1.0`,
    url: `https://ambientcg.com/view?id=${e}`,
  };
}
function Qo(e, t, n, r) {
  return {
    id: e,
    title: `${t}, đã giản lược lưới và đổi chất liệu`,
    credit: `${n}, Sketchfab`,
    license: `CC BY 4.0`,
    licenseUrl: `https://creativecommons.org/licenses/by/4.0/`,
    url: r,
  };
}
var $o = [
    ...[...qo, ...Yo].map((e) => ({
      id: e.id,
      title: e.title,
      credit: e.credit,
      license: e.license,
      url: e.sourceUrl,
    })),
    W(`Wood067`, `Texture gỗ sẫm`),
    W(`WoodFloor043`, `Texture ván sàn gỗ`),
    W(`RoofingTiles014A`, `Texture ngói đất nung`),
    W(`RoofingTiles014B`, `Texture ngói rêu phong`),
    W(`Tiles027`, `Texture gạch đất nung`),
    W(`PavingStones111`, `Texture đá xanh lát sân`),
    W(`Plaster002`, `Texture vôi trát`),
    W(`Ground037`, `Texture đất và rêu`),
    W(`Fabric066`, `Texture vải thô`),
    Qo(
      `statue-phat`,
      `Tượng Phật ngồi toà sen (mẫu "Buddha")`,
      `Thunk3D 3D Scanner (Lily.Qin1)`,
      `https://sketchfab.com/3d-models/buddha-1754e4978561484a88a29ca66a8c8fb7`,
    ),
    Qo(
      `statue-quan-am`,
      `Tượng Quan Âm (mẫu "Guan Yin Bodhisattva")`,
      `Amitabha Buddhist New Zealand (AmitabhaNZ)`,
      `https://sketchfab.com/3d-models/guan-yin-bodhisattva-8677e5bd56814d58be4c2df1e89f3818`,
    ),
    Qo(
      `statue-dia-tang`,
      `Tượng Địa Tạng (mẫu "diZangPuSa_v2022")`,
      `tian0000hai`,
      `https://sketchfab.com/3d-models/dizangpusa-v2022-c1f3cdbd3fb84170b4ee92e780dcdfb9`,
    ),
    Qo(
      `statue-quan-am-dung`,
      `Tượng Quan Âm đứng ở vườn Đông (mẫu "Guanyin")`,
      `Diana Liu (Diana123456)`,
      `https://sketchfab.com/3d-models/guanyin-4b0410c196c6475ba85d527966ea00b6`,
    ),
    {
      id: `original`,
      title: `Chùa, bảo tháp, tượng dự phòng khi chưa tải được tượng mẫu, tranh sơn mài, nhân vật, âm nền và nhạc nền tổng hợp`,
      credit: `Chùa Sen (dựng bằng mã, nguyên bản)`,
      license: `Nguyên bản`,
    },
  ],
  es = `Đang mở trong ứng dụng khác (Zalo, Facebook…). Mở chuasen.com bằng Safari (iPhone) hoặc Chrome (Android) để cài lên màn hình chính.`,
  ts = `Chép đường dẫn`,
  ns = `Đã chép`,
  rs = `Chưa chép được. Bạn gõ chuasen.com vào Safari hoặc Chrome nhé.`,
  is = [
    { value: `auto`, label: `Tự động` },
    { value: `day`, label: `Ban ngày` },
    { value: `night`, label: `Ban đêm` },
  ],
  G = (e) => e.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
function as(e) {
  let t = e.url
      ? `<a href="${G(e.url)}" target="_blank" rel="noopener noreferrer">${G(e.title)}</a>`
      : G(e.title),
    n = e.licenseUrl
      ? `<a href="${G(e.licenseUrl)}" target="_blank" rel="noopener noreferrer">${G(e.license)}</a>`
      : G(e.license);
  return `<li data-credit="${G(e.id)}"><span class="set-credit__title">${t}</span><span class="set-credit__meta">${G(e.credit)} · ${n}</span></li>`;
}
function os(e) {
  let t = B(`info`);
  return `${t.slice(0, t.indexOf(`>`) + 1)}${e}</svg>`;
}
var ss = `<circle cx="12" cy="8.2" r="3.7"/><path d="M4.8 20c.9-3.7 3.7-5.8 7.2-5.8s6.3 2.1 7.2 5.8"/>`,
  cs = `<path d="M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9"/><circle cx="15" cy="7.5" r="2"/><circle cx="9" cy="16.5" r="2"/>`,
  ls = `<rect x="3.5" y="4.5" width="17" height="4.5" rx="1.2"/><path d="M5.2 9v9a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2V9M10 13h4"/>`,
  K = (e, t, n, r = ``) => `<h3 id="set-${e}-title" class="set-group__title"${r}>${n}${t}</h3>`;
function q(e, t, n = ``, r = ``, i = `set-${e}-hint`) {
  let a = `<label class="set-switch"${n ? `` : r}><span class="set-switch__text">${t}</span><input class="set-switch__input" type="checkbox" role="switch" data-ref="${e}"${n ? ` aria-describedby="${i}"` : ``} /><span class="set-switch__track" aria-hidden="true"></span></label>`;
  return n ? `<div class="set-item"${r}>${a}<p class="set-hint" id="${i}">${n}</p></div>` : a;
}
var us = `Hiện đủ mọi tính năng`,
  ds = `Tắt thì các mục trong menu Thêm mở dần khi bạn lên cấp.`,
  fs = `Khôi phục sẽ thay thế toàn bộ dữ liệu công phu hiện có trên thiết bị này bằng nội dung của tệp. Tiếp tục?`,
  ps = `Xóa toàn bộ số liệu công phu trên thiết bị này? Không thể hoàn tác.`,
  ms = `Xóa các lời nguyện đã lưu trên máy này? Lời nguyện chưa từng gửi đi đâu nên sẽ không khôi phục được.`,
  hs = null;
function gs(e) {
  if (hs?.isConnected) return;
  let { store: n, audio: r, toast: i } = e;
  Ft();
  let c = n.getSettings(),
    l = xa(),
    u = typeof navigator.vibrate == `function`,
    d = document.activeElement instanceof HTMLElement ? document.activeElement : null,
    p = document.createElement(`dialog`);
  ((p.className = `settings`),
    p.setAttribute(`aria-labelledby`, `set-title`),
    (p.innerHTML = `
    <div class="settings__panel">
      <header class="settings__head">
        <h2 id="set-title" class="settings__title">Cài đặt</h2>
        <button type="button" class="icon-btn settings__close" aria-label="Đóng" data-ref="close">${B(`close`)}</button>
      </header>
      <div class="settings__body">
        <section class="set-group" aria-labelledby="set-account-title">
          ${K(`account`, `Tài khoản`, os(ss))}
          <div class="set-card">
            ${l ? `<div class="set-account"><span class="set-account__avatar" aria-hidden="true" data-ref="accountAvatar"></span><div class="set-account__text"><p class="set-account__who" data-ref="accountWho"></p><p class="set-hint set-account__saved" data-ref="accountSaved"></p></div></div>` : `<p class="set-hint">Đăng nhập để giữ nhân vật, cấp, nhiệm vụ và chuỗi giữ lửa khi đổi máy. Không bắt buộc.</p>`}
            <div class="set-item"><button type="button" class="btn${l ? `` : ` btn--gold`}" data-ref="account">${l ? `Quản lý tài khoản` : `Lưu nhân vật · Đăng nhập`}</button></div>
          </div>
        </section>
        ${l ? `<section class="set-group" aria-labelledby="set-friends-title" data-ref="friends" hidden></section>` : ``}

        <section class="set-group" aria-labelledby="set-sound-title">
          ${K(`sound`, `Âm thanh`, B(`sound-on`))}
          <div class="set-card">
            ${q(`sound`, `Bật âm thanh`)}
            <div data-ref="mixer" hidden></div>
          </div>
        </section>

        <section class="set-group" aria-labelledby="set-view-title">
          ${K(`view`, `Hiển thị và điều khiển`, os(cs))}
          <div class="set-card">
            <div class="set-item">
              <p class="set-item__label" aria-hidden="true">Ánh sáng trong chùa</p>
              <fieldset class="set-seg" data-ref="time">
                <legend class="set-seg__legend">Ánh sáng trong chùa</legend>
                ${is.map((e) => `<label class="set-seg__opt"><input type="radio" name="set-time" value="${e.value}" /><span>${e.label}</span></label>`).join(``)}
              </fieldset>
              <p class="set-hint">Tự động theo giờ Việt Nam: sáng từ 06:00, tối từ 18:00.</p>
            </div>
            ${q(`joystick`, `Cần điều khiển trên màn hình`)}
            ${q(`invertDrag`, `Đảo chiều kéo (kiểu Street View)`)}
            ${e.features && !e.features.snapshot().forced ? q(`showAll`, us, ds, ``, `set-all-hint`) : ``}
            ${q(`haptics`, `Rung khi bấm`, ``, `data-ref="hapticsRow"${u ? `` : ` hidden`}`)}
            <details class="set-fold">
              <summary>Cách điều khiển</summary>
              <ul class="set-howto">
                <li><strong>Cảm ứng:</strong> cần điều khiển bên trái để đi, vuốt bên phải để nhìn quanh, chạm xuống nền để đi tới, chụm hai ngón để thu phóng.</li>
                <li><strong>Máy tính:</strong> bấm xuống nền để đi tới, giữ chuột để đi theo con trỏ, kéo chuột (trái hoặc phải) để nhìn quanh, lăn chuột để thu phóng. Phím W A S D để đi, Q E để xoay, F hoặc Enter để tương tác.</li>
                <li><strong>Toàn màn hình (máy tính):</strong> di chuột để nhìn quanh, W A S D để đi, bấm để đi tới hoặc tương tác với chỗ chấm giữa màn hình, Esc để thoát.</li>
                <li>Chạm vào bồ đoàn, tượng Phật, lư hương hay chuông: nhân vật tự đi tới đó.</li>
              </ul>
            </details>
            ${e.onChangeCharacter || e.onOutfit ? `<div class="set-row set-character"><span class="set-switch__text">Nhân vật</span><span class="set-character__actions">${e.onOutfit ? `<button type="button" class="btn btn--sm" data-ref="outfit">Trang phục</button>` : ``}${e.onChangeCharacter ? `<button type="button" class="btn btn--sm" data-ref="character">Đổi nhân vật</button>` : ``}</span></div>` : ``}
          </div>
        </section>
        ${e.graphics ? `<section class="set-group" aria-labelledby="set-gfx-title" data-ref="gfx" hidden></section>` : ``}

        <section class="set-group" aria-labelledby="set-social-title">
          ${K(`social`, `Giao lưu`, B(`message`))}
          <div class="set-card">
            ${q(`showPhrases`, `Hiện câu nói của người khác`, `Tắt thì không thấy bong bóng lời chào, câu nói và lời mời của người khác. Câu của bạn vẫn hiện với mọi người.`, ``, `set-phrases-hint`)}
          </div>
        </section>

        ${
          f.progression
            ? `<section class="set-group" aria-labelledby="set-progress-title" data-ref="progressGroup">
          ${K(`progress`, `Hành trình`, B(`lotus`))}
          <div class="set-card">
            ${q(`progressUi`, `Hiện tinh tấn và cấp độ`, `Tắt thì ẩn nút cấp, số tinh tấn và thẻ chúc mừng. Chùa vẫn ghi nhận ngầm, bật lại là thấy đủ.`)}
            ${q(`progressBadge`, `Cho người trong chùa thấy cấp của tôi`, `Một biểu tượng sen nhỏ cạnh tên bạn, kèm danh hiệu đang mang nếu có. Không có chữ nào bạn tự viết được gửi đi.`)}
            ${q(`streakLamp`, `Cho người trong chùa thấy chuỗi giữ lửa của tôi`, `Ngọn lửa nhỏ và số ngày cạnh tên bạn trong danh sách "Người trong chùa". Tắt thì không gửi cho ai; ngọn lửa của bạn trên màn hình vẫn còn.`)}
            ${q(`showTitles`, `Hiện danh hiệu của người khác`)}
            ${l ? `<div data-ref="rank" hidden></div>` : ``}
          </div>
        </section>`
            : ``
        }

        <section class="set-group" aria-labelledby="set-install-title" data-ref="install" hidden>
          ${K(`install`, `Cài ứng dụng`, B(`download`), ` tabindex="-1" data-ref="installTitle"`)}
          <div class="set-card"><div class="set-item" data-ref="installBody"></div></div>
        </section>

        <section class="set-group" aria-labelledby="set-data-title">
          ${K(`data`, `Dữ liệu`, os(ls))}
          <div class="set-card">
            <div class="set-item">
              <p class="set-hint">Sao lưu thành một tệp để giữ công phu của bạn, hoặc chuyển sang máy khác. Tệp này chứa khóa cá nhân và cả lời nguyện riêng tư của bạn (đèn hoa đăng, dải lụa trên cây), đừng gửi cho ai.</p>
              <div class="set-actions">
                <button type="button" class="btn" data-ref="backup">Sao lưu</button>
                <button type="button" class="btn" data-ref="restore">Khôi phục</button>
              </div>
            </div>
            <div class="set-item">
              <p class="set-hint">Lời nguyện khi thả đèn hoa đăng và treo trên cây bồ đề chỉ được lưu trên máy này, không gửi đi đâu cả.</p>
              <div class="set-actions">
                <button type="button" class="btn btn--sm set-danger" data-ref="clearWishes">Xóa lời nguyện đã lưu</button>
              </div>
            </div>
            <div class="set-item">
              <p class="set-hint">Xóa mọi dữ liệu của Chùa Sen trên máy này để bắt đầu lại từ đầu. Không thể hoàn tác.</p>
              <div class="set-actions">
                <button type="button" class="btn btn--sm set-danger" data-ref="clear">Xóa dữ liệu</button>
              </div>
            </div>
          </div>
          <input type="file" accept=".json,application/json" hidden data-ref="file" />
          <p class="set-status" role="status" aria-live="polite" data-ref="status"></p>
        </section>

        <section class="set-group" aria-labelledby="set-credits-title">
          <div class="set-card">
            <details class="set-fold" data-ref="credits">
              <summary id="set-credits-title">${B(`info`)}Nguồn và giấy phép</summary>
              <p class="set-hint">Âm thanh, texture và tượng mẫu 3D dưới đây dùng giấy phép tự do (CC0, CC BY). Chân thành cảm ơn các tác giả.</p>
              <ul class="set-credits">${$o.map(as).join(``)}</ul>
            </details>
          </div>
        </section>

        <p class="set-foot">Dữ liệu công phu lưu trên thiết bị của bạn; chỉ khi bạn đăng nhập mới được lưu thêm lên mạng (xoá được cùng tài khoản). Lời nguyện và cài đặt riêng không bao giờ rời máy. Trang ghi số liệu sử dụng ẩn danh (lượt truy cập, vào phòng, các mốc tu tập) qua Cloudflare Web Analytics, PostHog và DataFast — chỉ dùng cookie đếm lượt truy cập ẩn danh (DataFast), không quảng cáo, không quay màn hình, không ghi tên vào số liệu.</p>
        <div class="set-foot-actions">
          <button type="button" class="btn btn--ghost" data-ref="feedback">${B(`message`)}<span>Góp ý · Báo lỗi</span></button>
        </div>
      </div>
    </div>`));
  let m = (e) => p.querySelector(`[data-ref="${e}"]`),
    h = m(`close`),
    g = m(`sound`),
    _ = m(`haptics`),
    v = m(`install`),
    y = m(`installBody`),
    b = m(`file`),
    x = m(`status`);
  function S(e, t = !1) {
    ((x.textContent = e), x.classList.toggle(`is-error`, t));
  }
  let C = (e) => (e instanceof Error ? e.message : `Đã có lỗi xảy ra. Bạn thử lại nhé.`);
  ((g.checked = c.sound),
    g.addEventListener(`change`, () => void n.updateSettings({ sound: g.checked })),
    t(
      () =>
        import(`./mixer-DiQvZD4y.js`)
          .then((e) => e.t)
          .then((t) => {
            p.isConnected &&
              t.mountMixer(m(`mixer`), {
                store: n,
                audio: r,
                ...(e.onMusic && { onMusic: e.onMusic }),
                ...(e.onOpenListen && {
                  onOpenListen: () => {
                    (a(p), e.onOpenListen?.());
                  },
                }),
              });
          }),
      __vite__mapDeps([24, 1, 25]),
      import.meta.url,
    ).catch((e) => console.error(`Không dựng được bàn trộn âm thanh`, e)));
  let w = m(`joystick`);
  ((w.checked = c.touchJoystick),
    w.addEventListener(`change`, () => {
      n.updateSettings({ touchJoystick: w.checked });
    }));
  let T = m(`invertDrag`);
  ((T.checked = c.invertDrag),
    T.addEventListener(`change`, () => {
      n.updateSettings({ invertDrag: T.checked });
    }));
  for (let e of m(`time`).querySelectorAll(`input`))
    ((e.checked = e.value === c.timeOfDay),
      e.addEventListener(`change`, () => {
        e.checked && n.updateSettings({ timeOfDay: e.value });
      }));
  let { graphics: E } = e;
  if (E) {
    let e = m(`gfx`);
    t(
      () =>
        import(`./gfx-CfJZxk8t.js`)
          .then((e) => e.t)
          .then((t) => {
            if (!p.isConnected) return;
            t.mountGraphics(e, E);
            let n = m(`installTitle`);
            document.activeElement === n && n.scrollIntoView?.({ block: `start` });
          }),
      __vite__mapDeps([26, 1, 27]),
      import.meta.url,
    ).catch((t) => {
      ((e.hidden = !0), e.replaceChildren(), console.error(`Không dựng được mục Đồ hoạ`, t));
    });
  }
  for (let [e, t] of [
    [`showPhrases`, `phrases_toggled`],
    [`progressUi`, `progress_ui_toggled`],
    [`progressBadge`, `progress_badge_toggled`],
    [`streakLamp`, `streak_lamp_toggled`],
    [`showTitles`, `titles_toggled`],
  ]) {
    let r = p.querySelector(`[data-ref="${e}"]`);
    r &&
      ((r.checked = c[e]),
      r.addEventListener(`change`, () => {
        (n.updateSettings({ [e]: r.checked }), z(t, { on: r.checked }));
      }));
  }
  ((_.checked = c.haptics),
    _.addEventListener(`change`, () => {
      (n.updateSettings({ haptics: _.checked }), _.checked && Ce(30));
    }),
    p.querySelector(`[data-ref="character"]`)?.addEventListener(`click`, () => {
      (a(p), e.onChangeCharacter?.());
    }));
  let ee = p.querySelector(`[data-ref="outfit"]`);
  ee?.addEventListener(`click`, () => {
    (p.close(), e.onOutfit?.());
  });
  let { features: D } = e,
    O = () => {
      ee && (ee.hidden = D !== void 0 && !D.isUnlocked(`wardrobe`));
    };
  O();
  let k = p.querySelector(`[data-ref="showAll"]`);
  if (
    (k &&
      D &&
      ((k.checked = D.showAll()),
      k.addEventListener(`change`, () => {
        (D.setShowAll(k.checked), O());
      })),
    m(`feedback`).addEventListener(`click`, () => {
      (a(p), ma({ source: `settings`, onFail: i }));
    }),
    m(`account`).addEventListener(`click`, () => {
      (a(p), ya({ reason: `settings`, onFail: i }));
    }),
    l)
  ) {
    m(`accountWho`).textContent = l.masked || `Đã đăng nhập`;
    let e = m(`accountAvatar`),
      n = l.masked.trim().charAt(0).toUpperCase();
    (n ? (e.textContent = n) : (e.innerHTML = B(`lotus`)),
      Sa().then(
        (e) => {
          if (!p.isConnected) return;
          let t = m(`accountSaved`);
          ((t.textContent = e), t.classList.toggle(`is-synced`, e.startsWith(`Đã lưu`)));
        },
        () => void 0,
      ));
    let r = p.querySelector(`[data-ref="rank"]`);
    (r &&
      t(
        () =>
          import(`./rank-ZzKaf5p8.js`)
            .then((e) => e.t)
            .then(
              (e) => p.isConnected && e.mountRankSettings(r),
              () => void 0,
            ),
        __vite__mapDeps([28, 1, 6, 16, 5, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17, 29]),
        import.meta.url,
      ),
      t(
        () =>
          import(`./friends-AJd_o965.js`)
            .then((e) => e.t)
            .then(
              (e) => p.isConnected && e.mountFriendsSettings(m(`friends`)),
              () => void 0,
            ),
        __vite__mapDeps([30, 1, 6, 16, 5, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17, 31]),
        import.meta.url,
      ));
  }
  let A = e.focus === `install` ? `menu` : `settings`,
    j = ``;
  function M() {
    let e = Ht();
    if (e === j) return;
    j = e;
    let t = v.contains(document.activeElement);
    ((v.hidden = e === null),
      e === `prompt`
        ? (y.innerHTML = `
        <p class="set-hint">Mở Chùa Sen như một ứng dụng, dùng được cả khi không có mạng.</p>
        <button type="button" class="btn btn--gold" data-ref="install-btn">Cài lên màn hình chính</button>`)
        : e === `inapp`
          ? (y.innerHTML = `
        <p class="set-hint">${es}</p>
        <div class="set-actions">
          <button type="button" class="btn" data-ref="copy-link">${B(`copy`)}<span>${ts}</span></button>
        </div>
        <p class="set-status" role="status" aria-live="polite" data-ref="copy-status"></p>`)
          : e === `ios`
            ? (y.innerHTML = `
        <p class="set-hint">Bấm <strong>Chia sẻ</strong> ${B(`share`, { size: 18 })} → <strong>Thêm vào MH chính</strong></p>`)
            : y.replaceChildren(),
      t && !v.contains(document.activeElement) && h.focus());
  }
  async function te() {
    let e = `${location.origin}/`;
    try {
      return (await navigator.clipboard.writeText(e), !0);
    } catch {
      let t = document.createElement(`textarea`);
      ((t.value = e), (t.readOnly = !0), (t.className = `set-copybuf`), y.append(t), t.select());
      let n = !1;
      try {
        n = document.execCommand(`copy`);
      } catch {}
      return (t.remove(), n);
    }
  }
  y.addEventListener(`click`, (e) => {
    let t = e.target,
      n = t.closest(`[data-ref="copy-link"]`);
    n
      ? te().then((e) => {
          z(`install_link_copied`, { place: A, ok: e });
          let t = y.querySelector(`[data-ref="copy-status"]`);
          t &&
            ((t.textContent = e ? ns : rs),
            t.classList.toggle(`is-error`, !e),
            n.focus({ preventScroll: !0 }));
        })
      : t.closest(`[data-ref="install-btn"]`) &&
        Lt().then((e) => {
          (z(`install_prompt`, { place: A, accepted: e }),
            e && p.isConnected && (a(p), i(`Đã cài lên màn hình chính`)));
        });
  });
  let N = Rt(M);
  if (
    (M(),
    m(`backup`).addEventListener(`click`, () => {
      try {
        S(`Đã tải tệp sao lưu: ${Ho()}`);
      } catch (e) {
        S(C(e), !0);
      }
    }),
    m(`restore`).addEventListener(`click`, () => b.click()),
    b.addEventListener(`change`, () => {
      let e = b.files?.[0];
      ((b.value = ``),
        e &&
          (async () => {
            try {
              let t = await Wo(e);
              if (!window.confirm(fs)) {
                S(``);
                return;
              }
              (await Go(t), S(`Đã khôi phục. Đang tải lại…`), location.reload());
            } catch (e) {
              S(C(e), !0);
            }
          })());
    }),
    m(`clear`).addEventListener(`click`, () => {
      if (window.confirm(ps))
        try {
          (Ko(), S(`Đã xóa dữ liệu. Đang tải lại…`), location.reload());
        } catch (e) {
          S(C(e), !0);
        }
    }),
    m(`clearWishes`).addEventListener(`click`, () => {
      window.confirm(ms) &&
        t(
          async () => {
            let { clearWishes: e } = await import(`./rituals-DFATLOei.js`).then((e) => e.g);
            return { clearWishes: e };
          },
          __vite__mapDeps([19, 1, 5, 6, 8, 11, 9, 10, 4, 7, 12, 13, 14, 20, 21]),
          import.meta.url,
        ).then(
          ({ clearWishes: e }) => {
            (e(), S(`Đã xóa các lời nguyện đã lưu.`));
          },
          (e) => S(C(e), !0),
        );
    }),
    h.addEventListener(`click`, () => a(p)),
    s(p),
    p.addEventListener(`close`, () => {
      (N(), p.remove(), hs === p && (hs = null), d?.isConnected && d.focus({ preventScroll: !0 }));
    }),
    (hs = p),
    document.body.append(p),
    o(p),
    e.focus === `install` && !v.hidden)
  ) {
    let e = m(`installTitle`);
    (e.scrollIntoView?.({ block: `start` }),
      e.focus({ preventScroll: !0 }),
      z(`install_open`, { place: A, mode: j }));
  }
}
var _s = { altar: `/`, beads: `/niem-phat`, chant: `/tung-kinh`, meditate: `/thien`, talks: `/phap-thoai` };
function vs(e) {
  return `#${_s[e]}`;
}
function ys(e) {
  let [t = ``] = e.replace(/^#/, ``).split(`?`),
    n = t.replace(/\/+$/, ``) || `/`;
  return Object.keys(_s).find((e) => _s[e] === n) ?? `altar`;
}
function bs() {
  let e = location.hash,
    t = e.indexOf(`?`);
  return new URLSearchParams(t < 0 ? `` : e.slice(t + 1));
}
function xs(e, t, n) {
  let r = null,
    i = () => (
      (r ??= n().catch((e) => {
        throw ((r = null), e);
      })),
      r
    );
  return {
    id: e,
    title: t,
    load: i,
    mount(t, n) {
      let r,
        a = !1;
      return (
        i()
          .then((e) => {
            a || (r = e.mount(t, n));
          })
          .catch((r) => {
            a ||
              (console.error(`Panel: không dựng được view "${e}"`, r),
              t.replaceChildren(),
              n.toast(`Không mở được phần này. Bạn thử lại nhé.`),
              n.navigate(`altar`));
          }),
        () => {
          ((a = !0), r?.());
        }
      );
    },
  };
}
var Ss = [
    xs(`beads`, `Niệm Phật`, () =>
      t(
        () => import(`./panels-eXTHTxRv.js`).then((e) => e.i).then((e) => e.beadsView),
        __vite__mapDeps([32, 1, 5, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 33]),
        import.meta.url,
      ),
    ),
    xs(`chant`, `Tụng kinh`, () =>
      t(
        () => import(`./panels-eXTHTxRv.js`).then((e) => e.r).then((e) => e.chantView),
        __vite__mapDeps([32, 1, 5, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 33]),
        import.meta.url,
      ),
    ),
    xs(`meditate`, `Thiền`, () =>
      t(
        () => import(`./panels-eXTHTxRv.js`).then((e) => e.n).then((e) => e.meditateView),
        __vite__mapDeps([32, 1, 5, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 33]),
        import.meta.url,
      ),
    ),
    xs(`talks`, `Pháp thoại`, () =>
      t(
        () => import(`./panels-eXTHTxRv.js`).then((e) => e.t).then((e) => e.talksView),
        __vite__mapDeps([32, 1, 5, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 33]),
        import.meta.url,
      ),
    ),
  ],
  Cs = Ss;
function ws() {
  for (let e of Ss) e.load().catch(() => void 0);
}
function Ts(e) {
  return Cs.find((t) => t.id === e);
}
function Es(e, t) {
  let n = vs(`altar`),
    r = { ...t, navigate: (e) => (e === `altar` ? l() : s(e)) };
  function i(e) {
    let t = e ? Ts(e) : void 0;
    document.title = t ? `${t.title} · ${c.name}` : `${c.name} — ${c.tagline}`;
  }
  function a(t) {
    e.current() !== t.id && e.open(t, r);
  }
  function o() {
    (ys(location.hash) !== `altar` || location.hash.includes(`?`)) && history.replaceState(null, ``, n);
  }
  function s(e) {
    let t = Ts(e);
    t ? (ys(location.hash) !== e && (location.hash = vs(e)), a(t)) : l();
  }
  function l() {
    (e.current() !== null && e.close(), o(), i(null));
  }
  function u() {
    let t = Ts(ys(location.hash));
    t ? a(t) : e.current() !== null && e.close();
  }
  let d = e.onChange((t) => {
    (i(t), t === null && e.current() === null && o());
  });
  return (
    window.addEventListener(`hashchange`, u),
    {
      ctx: r,
      open: s,
      close: l,
      sync: u,
      dispose() {
        (window.removeEventListener(`hashchange`, u), d());
      },
    }
  );
}
(hi(), Ie(), r());
var J = si(),
  Ds = vt(() => ({ hasProfile: Ar() !== null, practiced: dt(J.totals(), J.streak()) }));
st();
{
  let e = J.record.bind(J);
  J.record = (t, n) => {
    let r = e(t, n);
    return (
      t === `beadRounds`
        ? z(`beads_round_completed`)
        : t === `sutras`
          ? z(`sutra_completed`)
          : t === `meditationSeconds` &&
            n !== void 0 &&
            n > 0 &&
            z(`meditation_completed`, { minutes: Math.round(n / 60) }),
      r
    );
  };
}
var Y = Se(),
  X = (e) => {
    let t = document.getElementById(e);
    if (!t) throw Error(`Thiếu phần tử #${e} trong index.html`);
    return t;
  },
  Os = X(`scene`),
  ks = X(`hud-root`),
  As = X(`panel-root`),
  js = X(`fallback-root`),
  Ms = X(`onboarding-root`),
  Z = X(`toast`),
  Ns;
function Ps(e) {
  ((Z.textContent = e),
    Z.classList.remove(`is-prompt`),
    Z.classList.add(`is-visible`),
    window.clearTimeout(Ns),
    (Ns = window.setTimeout(() => Z.classList.remove(`is-visible`), 2600)));
}
function Fs(e, t) {
  if (e !== null && t) {
    window.clearTimeout(Ns);
    let n = document.createElement(`button`);
    ((n.type = `button`),
      (n.className = `toast__btn`),
      (n.textContent = t.label),
      n.addEventListener(`click`, t.run),
      Z.replaceChildren(e, n),
      Z.classList.add(`is-visible`, `is-prompt`));
  } else Z.classList.contains(`is-prompt`) && Z.classList.remove(`is-visible`, `is-prompt`);
}
function Is() {
  return $
    ? $.activity()
    : document.body.classList.contains(`is-fallback`)
      ? Ys?.current()
        ? `practice`
        : `idle`
      : `boot`;
}
function Ls(e) {
  $ ? $.toast(e) : Ps(e);
}
function Rs(e, t) {
  $ ? $.prompt(e, t ? [t] : void 0) : Fs(e, t);
}
function zs(e) {
  J.getSettings().haptics && Ce(e);
}
function Bs() {
  let e = J.getSettings(),
    { sound: t, volume: n } = e;
  (Y.setMuted(!t), Y.setVolume(n));
  for (let t of Object.keys(w)) Y.setBusVolume(t, e[w[t]]);
  let r = js.querySelector(`[data-act="sound"]`);
  r && ((r.innerHTML = B(t ? `sound-on` : `sound-off`)), r.setAttribute(`aria-pressed`, String(t)));
}
var Vs = [`pointerdown`, `pointerup`, `touchend`, `click`, `keydown`];
function Hs(e) {
  if (e.type !== `pointerdown` || e.pointerType === `mouse`) {
    Y.unlock();
    for (let e of Vs) window.removeEventListener(e, Hs, !0);
  }
}
for (let e of Vs) window.addEventListener(e, Hs, !0);
(J.subscribe(Bs), Bs(), Ft());
{
  let e,
    n = () => {
      e ??= t(
        async () => {
          let { startAppUpdates: e } = await import(`./updates-BQVStjbI.js`).then((e) => e.t);
          return { startAppUpdates: e };
        },
        __vite__mapDeps([34, 1]),
        import.meta.url,
      )
        .then(({ startAppUpdates: e }) => e({ state: Is, notify: Ls, prompt: Rs }))
        .catch(() => void 0);
    },
    r = () => {
      (`serviceWorker` in navigator &&
        navigator.serviceWorker.register(`./sw.js`, { scope: `./` }).catch(() => void 0),
        n());
    };
  `serviceWorker` in navigator && navigator.serviceWorker.controller && n();
  let i = () => {
      `requestIdleCallback` in window ? window.requestIdleCallback(r, { timeout: 1e4 }) : r();
    },
    a = () => void window.setTimeout(i, 3e3);
  document.readyState === `complete` ? a() : window.addEventListener(`load`, a, { once: !0 });
}
if (
  (window.addEventListener(`vite:preloadError`, () => {
    qt(`chunk:0.9.31+mw1l6ggn`);
  }),
  (x.prompt = Rs),
  (x.notify = Ls),
  _() || v() || b())
) {
  let e = () => {
    t(
      () => import(`./account-B3fmTrbD.js`).then((e) => e.y).then((e) => e.bootAccount()),
      __vite__mapDeps([16, 1, 5, 6, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 17]),
      import.meta.url,
    ).catch(() => void 0);
  };
  `requestIdleCallback` in window ? window.requestIdleCallback(e, { timeout: 4e3 }) : setTimeout(e, 3e3);
}
var Q = (() => {
    let e = X(`boot`),
      t = X(`bootFill`),
      n = X(`bootStatus`),
      r = 0.06,
      i,
      a = () => {
        t.style.setProperty(`--boot-p`, r.toFixed(3));
      };
    return {
      set(e, t) {
        ((r = Math.max(r, Math.min(e, 1))), a(), t && (n.textContent = t));
      },
      startCreep() {
        (window.clearInterval(i),
          (i = window.setInterval(() => {
            ((r += (0.94 - r) * 0.05), a());
          }, 400)));
      },
      lotus() {
        return e.querySelector(`.boot__lotus`)?.cloneNode(!0) ?? null;
      },
      hide() {
        (window.clearInterval(i),
          (r = 1),
          a(),
          e.classList.add(`is-hidden`),
          e.setAttribute(`aria-hidden`, `true`),
          window.setTimeout(() => e.remove(), 800));
      },
    };
  })(),
  Us = [
    { route: `beads`, icon: `beads`, label: `Niệm Phật` },
    { route: `chant`, icon: `book`, label: `Tụng kinh` },
    { route: `meditate`, icon: `lotus`, label: `Thiền` },
  ];
function Ws(e = !1) {
  if (new URLSearchParams(location.search).has(`no3d`) || !(`WebGL2RenderingContext` in window))
    return `none`;
  let t = document.createElement(`canvas`);
  t.addEventListener(`webglcontextcreationerror`, (t) => {
    e || Pe(t.statusMessage || `no context`, `webgl`);
  });
  try {
    let e = t.getContext(`webgl2`),
      n = e ?? t.getContext(`webgl`);
    return (n?.getExtension(`WEBGL_lose_context`)?.loseContext(), e ? `ok` : n ? `none` : `off`);
  } catch (t) {
    return (e || Pe(t, `webgl`), `off`);
  }
}
var Gs = 3e3,
  Ks = 15e3,
  qs = 6e4;
function Js() {
  let e = Date.now(),
    t,
    n = () => {
      let e = Ys?.current() || document.querySelector(`dialog[open]`);
      (e || !qt(`gpu:0.9.31+mw1l6ggn`)) &&
        (!Z.classList.contains(`is-prompt`) &&
          !(e && Z.classList.contains(`is-visible`)) &&
          Fs(`Trình duyệt đã cho 3D trở lại.`, { label: `Vào chùa`, run: () => location.reload() }),
        e && (t = window.setTimeout(n, Gs)));
    },
    r = () => {
      if ((window.clearTimeout(t), document.hidden)) return;
      if (Ws(!0) === `ok`) {
        (document.removeEventListener(`visibilitychange`, r),
          z(`webgl_recovered`, { after_s: Math.round((Date.now() - e) / 1e3) }),
          n());
        return;
      }
      let i = Date.now() - e < qs ? Gs : Ks;
      t = window.setTimeout(r, i);
    };
  (document.addEventListener(`visibilitychange`, r), (t = window.setTimeout(r, Gs)));
}
var Ys,
  Xs,
  Zs = {
    unsupported: `<strong>Thiết bị/trình duyệt chưa hỗ trợ 3D.</strong> Bạn vẫn có thể tu tập ngay bên dưới — mọi công phu vẫn được ghi lại.`,
    blocked: `<strong>Trình duyệt đang tạm tắt 3D.</strong> Thường do card đồ hoạ vừa gặp sự cố. Chùa đang tự thử lại và sẽ mở cảnh 3D ngay khi được. Chờ lâu thì hãy tắt hẳn trình duyệt (đóng mọi cửa sổ) rồi mở lại, và bật tăng tốc phần cứng trong cài đặt trình duyệt. Trong lúc chờ, bạn vẫn tu tập được bên dưới.`,
    error: `<strong>Cảnh chùa 3D chưa mở được.</strong> Có thể mạng đang chập chờn hoặc thiết bị đang quá tải. Bạn thử lại nhé, hoặc tu tập ngay bên dưới.`,
  };
function Qs(e) {
  (document.body.classList.add(`is-fallback`), ks.replaceChildren(), As.replaceChildren());
  let t = Q.lotus();
  ((js.innerHTML = `
    <div class="fallback__tools">
      <button class="icon-btn" type="button" data-act="settings" aria-label="Cài đặt" title="Cài đặt">${B(`settings`)}</button>
      <button class="icon-btn" type="button" data-act="sound" aria-label="Âm thanh" title="Âm thanh" aria-pressed="true"></button>
    </div>
    <div class="fallback__inner">
      <div data-slot="lotus"></div>
      <h1 class="fallback__title">Chùa Sen</h1>
      <p class="fallback__msg">${Zs[e]}</p>
      <nav class="fallback__actions" aria-label="Công phu">
        ${Us.map((e) => `<button type="button" class="fallback__tile" data-route="${e.route}">${B(e.icon)}<span>${e.label}</span></button>`).join(``)}
      </nav>
      ${e === `unsupported` ? `` : `<button type="button" class="btn btn--gold fallback__retry" data-act="retry">Thử lại</button>`}
      <button type="button" class="btn btn--ghost btn--sm fallback__feedback" data-act="feedback">${B(`message`, { size: 18 })}<span>Báo lỗi cho chùa</span></button>
    </div>`),
    t instanceof SVGElement &&
      (t.classList.replace(`boot__lotus`, `fallback__lotus`),
      js.querySelector(`[data-slot="lotus"]`)?.replaceWith(t)),
    (js.hidden = !1),
    Bs(),
    (Ys ??= bo(As)),
    (Xs ??= Es(Ys, { audio: Y, store: J, toast: Ps, haptic: zs, isUnlocked: (e) => Ds.isUnlocked(e) })));
  let n = Xs;
  ((js.onclick = (t) => {
    let r = t.target?.closest(`[data-route], [data-act]`);
    if (!r) return;
    let { route: i, act: a } = r.dataset;
    if (i) n.open(i);
    else if (a === `settings`) gs({ store: J, audio: Y, toast: Ps });
    else if (a === `sound`) {
      let e = !J.getSettings().sound;
      (J.updateSettings({ sound: e }), Ps(e ? `Đã bật âm thanh` : `Đã tắt âm thanh`));
    } else
      a === `retry`
        ? location.reload()
        : a === `feedback` &&
          ma({ kind: `bug`, source: `fallback`, context: () => ({ view: e }), onFail: Ps });
  }),
    n.sync(),
    `requestIdleCallback` in window ? window.requestIdleCallback(ws, { timeout: 2e3 }) : ws());
}
var $ = null,
  $s = { name: `Phật tử`, gender: `nam`, robe: `lam` };
async function ec() {
  let e = Ws();
  if (e !== `ok`) {
    (z(`webgl_unsupported`, { blocked: e === `off` }),
      Q.hide(),
      Qs(e === `off` ? `blocked` : `unsupported`),
      e === `off` && Js());
    return;
  }
  Q.startCreep();
  let n = t(
    () => import(`./app-z_oU8L_u.js`).then((e) => e.t),
    __vite__mapDeps([4, 1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    import.meta.url,
  );
  n.then(
    () => Q.set(0.4, `Đang dựng chánh điện…`),
    () => void 0,
  );
  let r = Ar();
  !r && f.autoProfile
    ? ((r = rn()), jr(r), z(`onboarding_skipped`, { gender: r.gender, robe: r.robe }))
    : r ||
      ((r = (await fo(Ms, { mode: `create` })) ?? $s),
      z(`onboarding_completed`, { gender: r.gender, robe: r.robe, style: $n()?.style ?? null }));
  let i = r,
    a;
  try {
    let { startWorld: e } = await n;
    (Q.set(0.6, `Thắp nến, quét sân chùa…`),
      ($ = await e({
        canvas: Os,
        hudHost: ks,
        panelHost: As,
        profile: r,
        store: J,
        audio: Y,
        toast: Ps,
        haptic: zs,
        onEditProfile: async (e) => {
          if (e?.rejectedName !== void 0) {
            a = e.rejectedName;
            let t = da(a);
            z(`name_rejected`, { where: `server`, reason: t.ok ? `other` : t.reason });
          }
          let t = await fo(Ms, {
            mode: `edit`,
            initial: i,
            onOutfit: e?.onOutfit,
            rejectedName: i.name === a ? a : void 0,
          });
          return (t && ((i = t), z(`profile_edited`, { gender: t.gender, robe: t.robe })), t);
        },
      })),
      Q.hide());
  } catch (e) {
    (console.error(`Không dựng được cảnh chùa 3D`, e),
      Pe(e, `3D`),
      z(`world_failed`, { reason: Fe(e), light: Xt() }),
      Yt(),
      Q.hide(),
      Qs(`error`));
  }
}
ec();
export {
  zn as $,
  Jr as A,
  Xe as At,
  Jn as B,
  y as Bt,
  ha as C,
  ct as Ct,
  Nr as D,
  Re as Dt,
  mi as E,
  ze as Et,
  Ar as F,
  N as Ft,
  On as G,
  v as Gt,
  rr as H,
  g as Ht,
  Or as I,
  C as It,
  bn as J,
  d as Jt,
  Sn as K,
  _ as Kt,
  jr as L,
  T as Lt,
  Wr as M,
  Ye as Mt,
  Kr as N,
  qe as Nt,
  oi as O,
  Ge as Ot,
  Sr as P,
  Le as Pt,
  In as Q,
  lr as R,
  k as Rt,
  xa as S,
  bt as St,
  da as T,
  R as Tt,
  tr as U,
  x as Ut,
  $n as V,
  h as Vt,
  Dn as W,
  b as Wt,
  Tn as X,
  f as Xt,
  En as Y,
  l as Yt,
  Cn as Z,
  u as Zt,
  bo as _,
  Ct as _t,
  ys as a,
  qn as at,
  ga as b,
  Tt as bt,
  Xo as c,
  Xt as ct,
  Ho as d,
  Wt as dt,
  Fn as et,
  Co as f,
  Ht as ft,
  wo as g,
  B as gt,
  To as h,
  kt as ht,
  vs as i,
  Hn as it,
  ri as j,
  Ze as jt,
  Ur as k,
  Ke as kt,
  qo as l,
  qt as lt,
  So as m,
  zt as mt,
  ws as n,
  Gn as nt,
  gs as o,
  Un as ot,
  xo as p,
  Bt as pt,
  xn as q,
  p as qt,
  bs as r,
  H as rt,
  Yo as s,
  Bn as st,
  Es as t,
  Wn as tt,
  Jo as u,
  Kt as ut,
  Ta as v,
  xt as vt,
  ma as w,
  z as wt,
  ya as x,
  ft as xt,
  Ea as y,
  yt,
  yr as z,
  m as zt,
};
