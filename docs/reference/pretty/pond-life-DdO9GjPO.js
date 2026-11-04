import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { gt as t, k as n, wt as r } from "./index-e_Bx6V48.js";
import {
  $ as i,
  A as a,
  K as o,
  P as s,
  S as c,
  Z as l,
  c as u,
  ft as d,
  k as f,
  l as p,
  m,
  y as h,
} from "./three-BbSp8N3g.js";
import { a as g, m as _, r as v } from "./rituals-DFATLOei.js";
import { l as y } from "./progress-core-C9e35Hb5.js";
import { b as ee, r as te, v as ne } from "./lanterns-DsoFXr0b.js";
import { D as b, m as x } from "./layout-DpGLadzd.js";
import {
  A as re,
  T as S,
  c as C,
  d as w,
  f as T,
  h as E,
  l as D,
  n as O,
  p as k,
  s as A,
  t as j,
  u as ie,
} from "./water-paths-DYM7yuBe.js";
var M = { carp: 3, fan: 5, ripple: 8 },
  N = [
    [0.5, 0, 0.01],
    [0.43, 0.06, 0.03],
    [0.32, 0.095, 0.045],
    [0.18, 0.11, 0.05],
    [0.04, 0.1, 0.045],
    [-0.1, 0.078, 0.035],
    [-0.22, 0.05, 0.022],
    [-0.31, 0.028, 0.012],
  ];
function P() {
  let e = [],
    t = [],
    n = [];
  return {
    vert(n, r, i, a, o) {
      return (e.push(n, r, i), t.push(n, a, o), e.length / 3 - 1);
    },
    tri(...e) {
      n.push(...e);
    },
    done() {
      let r = new p();
      return (
        r.setAttribute(`position`, new c(e, 3)),
        r.setAttribute(`aBody`, new c(t, 3)),
        r.setIndex(new u(new Uint16Array(n), 1)),
        r
      );
    },
  };
}
function ae() {
  let e = P(),
    t = N.map(([t, n, r], i) =>
      i === 0
        ? [e.vert(t, r, 0, 0, 0)]
        : [e.vert(t, 0, -n, -1, 0), e.vert(t, r, 0, 0, 0), e.vert(t, 0, n, 1, 0)],
    ),
    [n] = t[0],
    [r, i, a] = t[1];
  e.tri(n, r, i, n, i, a);
  for (let n = 1; n + 1 < t.length; n++) {
    let [r, i, a] = t[n],
      [o, s, c] = t[n + 1];
    e.tri(r, o, s, r, s, i, i, s, c, i, c, a);
  }
  let [o, s, c] = N[N.length - 1],
    l = (t) => [e.vert(o, 0, -s, -1, t), e.vert(o, c, 0, 0, t), e.vert(o, 0, s, 1, t)];
  {
    let [t, n, r] = l(2),
      i = e.vert(-0.52, 0.005, -0.15, -1, 2),
      a = e.vert(-0.47, 0.005, -0.07, -0.5, 2),
      o = e.vert(-0.42, 0.005, 0, 0, 2),
      s = e.vert(-0.47, 0.005, 0.07, 0.5, 2),
      c = e.vert(-0.52, 0.005, 0.15, 1, 2);
    e.tri(t, i, a, t, a, n, n, a, o, n, o, s, n, s, r, r, s, c);
  }
  {
    let [t, n, r] = l(3),
      i = e.vert(-0.44, 0.006, -0.2, -1, 3),
      a = e.vert(-0.6, 0.006, -0.24, -1, 3),
      o = e.vert(-0.68, 0.006, -0.1, -0.5, 3),
      s = e.vert(-0.56, 0.006, 0, 0, 3),
      c = e.vert(-0.68, 0.006, 0.1, 0.5, 3),
      u = e.vert(-0.6, 0.006, 0.24, 1, 3),
      d = e.vert(-0.44, 0.006, 0.2, 1, 3);
    (e.tri(t, i, a, t, a, o, t, o, n, n, o, s), e.tri(n, s, c, n, c, r, r, c, u, r, u, d));
  }
  for (let t of [-1, 1]) {
    let n = e.vert(0.26, 0.004, t * 0.1, t, 1),
      r = e.vert(0.16, 0.004, t * 0.105, t, 1),
      i = e.vert(0.08, 0.004, t * 0.24, t, 1),
      a = e.vert(0.2, 0.004, t * 0.2, t, 1);
    t < 0 ? e.tri(n, a, r, r, a, i) : e.tri(n, r, a, r, i, a);
  }
  let u = [
    e.vert(-1, 0.002, -1, -1, 4),
    e.vert(1, 0.002, -1, -1, 4),
    e.vert(1, 0.002, 1, 1, 4),
    e.vert(-1, 0.002, 1, 1, 4),
  ];
  return (e.tri(u[0], u[3], u[2], u[0], u[2], u[1]), e.done());
}
function oe() {
  let e = P(),
    t = e.vert(0, 0.17, 0, 0, 0),
    n = (t, n, r) =>
      Array.from({ length: 8 }, (i, a) => {
        let o = (a / 8) * Math.PI * 2,
          s = Math.cos(o) * t,
          c = Math.sin(o) * n;
        return e.vert(s, r, c, c / 0.3, 0);
      }),
    r = n(0.24, 0.19, 0.13),
    i = n(0.38, 0.3, 0.025);
  for (let n = 0; n < 8; n++) {
    let a = (n + 1) % 8,
      [o, s, c, l] = [r[n], r[a], i[n], i[a]];
    e.tri(t, s, o, o, s, l, o, l, c);
  }
  let a = e.vert(0.34, 0.035, -0.07, -1, 1),
    o = e.vert(0.34, 0.035, 0.07, 1, 1),
    s = e.vert(0.54, 0.045, 0, 0, 1),
    c = e.vert(0.44, 0.085, 0, 0, 1);
  e.tri(a, c, s, c, o, s, a, o, c);
  for (let [t, n, r] of [
    [0.16, 0.12, 0.26],
    [-0.2, -0.1, 0.17],
  ])
    for (let i of [-1, 1]) {
      let a = e.vert(t + 0.06, 0.02, i * 0.24, i, 1),
        o = e.vert(t - 0.06, 0.02, i * 0.24, i, 1),
        s = e.vert(t + n, 0.015, i * (0.24 + r), i, 1),
        c = e.vert(t + n * 0.3 - 0.04, 0.015, i * (0.24 + r * 0.7), i, 1);
      i < 0 ? e.tri(a, o, s, o, c, s) : e.tri(a, s, o, o, s, c);
    }
  return (
    e.tri(e.vert(-0.34, 0.02, -0.04, -1, 1), e.vert(-0.48, 0.015, 0, 0, 1), e.vert(-0.34, 0.02, 0.04, 1, 1)),
    e.done()
  );
}
var F = [
    [[0.95, 0.93, 0.88], [0.86, 0.22, 0.1], 0],
    [[0.98, 0.6, 0.16], [1, 0.78, 0.34], 0],
    [[0.94, 0.92, 0.87], [0.84, 0.2, 0.1], 1],
  ],
  I = [[0.74, 0.58, 0.3], [0.38, 0.29, 0.13], 0],
  se = [[1, 0.55, 0.12], [1, 0.8, 0.36], 0],
  ce = [...F, I, se],
  L = {
    shell: [0.42, 0.39, 0.22],
    seam: [0.22, 0.2, 0.11],
    limb: [0.44, 0.46, 0.32],
    stripe: [0.7, 0.68, 0.42],
  },
  le = 1200,
  R = 1.2,
  ue = 2.4,
  de = 1.1,
  fe = { low: 6, medium: 12, high: 12 },
  pe = 0.08,
  me = 0.5,
  z = 31313;
function he() {
  return { x: 0, z: 0, lift: 0, heading: 0, pitch: 0, bend: 0, alpha: 1, ripple: -1, swimming: !1 };
}
var B = (e) => {
  let t = Math.min(1, Math.max(0, e));
  return t * t * (3 - 2 * t);
};
function ge(e, t, n, r = null) {
  let i = ne((z ^ Math.imul(n + 1, 2246822507)) >>> 0),
    a = (i() - 0.5) * 0.6,
    o = { x: k.x + a * 0.5, z: w },
    s = { x: k.x + a, z: T + i() * 0.3 },
    c = e === 2,
    l = re(E, z + (c ? 256 : 0), n),
    u = c ? pe : l.speed,
    d = 0,
    f = 1 / 0,
    { xs: p, zs: m } = l.path;
  for (let e = 0; e < p.length; e++) {
    let t = Math.hypot(p[e] - s.x, m[e] - s.z);
    t < f && ((f = t), (d = Math.min(e * l.path.step, l.path.length)));
  }
  let h = i() * Math.PI * 2,
    g = Math.sqrt(i()) * S.r * 0.55;
  return {
    species: e,
    born: t,
    serial: n,
    seed: i(),
    length: c ? 0.4 + i() * 0.06 : e === 1 ? 0.3 : 0.46 + i() * 0.08,
    loop: l,
    speed: u,
    ledge: o,
    splash: s,
    joinS: d,
    joinSec: f / u,
    lotus: { x: S.x + Math.cos(h) * g, z: S.z + Math.sin(h) * g },
    leaveAt: null,
    batch: r,
  };
}
var V = { x: 0, z: 0 },
  H = { x: 0, z: 0 };
function _e(e, t, n, r) {
  let i = Math.max(0, t - R) * n;
  if (i < e.joinSec) {
    let t = e.joinSec > 0 ? i / e.joinSec : 1;
    return (
      e.loop.path.at(e.joinS, H),
      (r.x = e.splash.x + (H.x - e.splash.x) * t),
      (r.z = e.splash.z + (H.z - e.splash.z) * t),
      -1
    );
  }
  let a = e.joinS + e.speed * (i - e.joinSec);
  return (e.loop.path.at(a, r), a);
}
function ve(e, t, n, r = he()) {
  let i = Math.max(0, t - e.born),
    a = n ? me : 1;
  if (
    ((r.ripple = -1), (r.pitch = 0), (r.bend = 0), (r.lift = 0), (r.alpha = 1), (r.swimming = !0), i < 1.2)
  ) {
    let t = i / R;
    if (((r.heading = Math.atan2(e.splash.z - e.ledge.z, e.splash.x - e.ledge.x)), (r.swimming = !1), n))
      return ((r.x = e.splash.x), (r.z = e.splash.z), (r.alpha = t), r);
    let a = t * t;
    return (
      (r.x = e.ledge.x + (e.splash.x - e.ledge.x) * a),
      (r.z = e.ledge.z + (e.splash.z - e.ledge.z) * a),
      (r.lift = (ie - D) * (1 - a) + 0.08 * Math.sin(Math.PI * t)),
      (r.pitch = -0.55 * B(t * 1.4)),
      (r.ripple = -1),
      r
    );
  }
  if (!n) {
    let e = (i - R * 0.85) / ue;
    r.ripple = e >= 0 && e < 1 ? e : -1;
  }
  let o = _e(e, i, a, r);
  if (
    (_e(e, i + (0.4 / Math.max(e.speed, 0.05)) * 0.25, a, V),
    (r.heading = Math.atan2(V.z - r.z, V.x - r.x)),
    o >= 0)
  ) {
    (e.loop.path.tangent(o, V), e.loop.path.tangent(o + 0.4, H));
    let t = Math.atan2(V.x * H.z - V.z * H.x, V.x * H.x + V.z * H.z);
    ((r.bend = Math.max(-0.35, Math.min(0.35, t * 0.9))), (r.heading = Math.atan2(V.z, V.x)));
  }
  r.pitch = -0.55 * (1 - B((i - R) / 0.8));
  let s = e.leaveAt !== null,
    c = s ? e.leaveAt : e.born + le - 60,
    l = s ? 4 : 60;
  if (t >= c) {
    let n = Math.min(1, (t - c) / l),
      i = B(n) * (s ? 0.3 : 1),
      a = r.x + (e.lotus.x - r.x) * i,
      o = r.z + (e.lotus.z - r.z) * i;
    if (i > 0.001) {
      let t = e.lotus.x - r.x,
        n = e.lotus.z - r.z;
      if (t * t + n * n > 0.01) {
        let e = Math.atan2(n, t) - r.heading;
        ((e = Math.atan2(Math.sin(e), Math.cos(e))), (r.heading += e * Math.min(1, i * 3)));
      }
      r.bend *= 1 - i;
    }
    ((r.x = a), (r.z = o), (r.alpha = s ? 1 - n : 1 - B((n - 0.35) / 0.65)));
  }
  return (i >= 1200 && (r.alpha = 0), r);
}
function ye(e, t) {
  return e.leaveAt === null ? t - e.born >= le : t - e.leaveAt >= 4;
}
var be = e({ attachPondLife: () => ze }),
  xe = { "ao-sen": { low: 0, medium: 3, high: 5 }, "ho-ban-nguyet": { low: 0, medium: 5, high: 8 } },
  Se = { "ao-sen": 27393, "ho-ban-nguyet": 27394 },
  Ce = 0.35,
  we = 0.5,
  U = 4,
  Te = {
    "ao-sen": { region: j, y: O + 0.032, sphere: new i(new d(b.x, O, b.z), b.r + 0.6), length: [0.34, 0.48] },
    "ho-ban-nguyet": {
      region: A,
      y: D + 0.028,
      sphere: new i(new d(x.x, D, x.z + C / 2), C * 1.15),
      length: [0.42, 0.62],
    },
  },
  Ee = { "ao-sen": { x: b.x, z: b.z, r: b.r }, "ho-ban-nguyet": { x: x.x, z: x.z, r: C } },
  De = `
attribute vec3 aBody;
attribute vec4 aFish;
attribute vec4 aRel;
uniform float uTime;
varying vec3 vBody;
varying float vPattern;
varying float vSeed;
varying float vFade;
varying float vRipple;

void main() {
  vBody = aBody;
  vPattern = aFish.x;
  vSeed = aFish.y;
  vFade = aRel.y;
  vRipple = aRel.z;
  vec3 p = position;
  // Thân uốn: cong theo vòng bơi (aFish.w) cộng sóng chạy từ đầu về đuôi, mạnh dần về phía đuôi (aFish.z = biên độ).
  float tail = 1.0 - smoothstep(-0.5, 0.25, p.x);
  float wave = sin(uTime * 7.0 + aFish.y * 6.2831 - p.x * 7.5) * aFish.z * (0.15 + 0.85 * tail);
  p.z += wave * 0.16 + aFish.w * (p.x - 0.1) * (p.x - 0.1);
  // Phần không có trong mặt nạ của thể hiện này (aRel.x: bit 0 thân, 1 đuôi chẻ, 2 đuôi quạt, 3 vòng gợn) co về một điểm.
  float group = max(0.0, aBody.z - 1.0);
  p *= mod(floor(aRel.x / exp2(group) + 0.001), 2.0);
  gl_Position = projectionMatrix * modelViewMatrix * (instanceMatrix * vec4(p, 1.0));
}
`,
  Oe = `
uniform vec3 uBase[5];
uniform vec3 uSpot[5];
uniform vec3 uWater;
uniform float uNight;
uniform float uTint;
varying vec3 vBody;
varying float vPattern;
varying float vSeed;
varying float vFade;
varying float vRipple;

void main() {
  float part = vBody.z;
  vec3 col;
  float alpha;
  if (part > 3.5) {
    // Vòng gợn nước lúc con vật chạm nước: hai vòng sáng loang ra rồi tan.
    float d = length(vBody.xy);
    float r1 = 0.15 + 0.85 * vRipple;
    float ring = smoothstep(0.08, 0.0, abs(d - r1)) + 0.7 * smoothstep(0.06, 0.0, abs(d - r1 * 0.6));
    alpha = ring * (1.0 - vRipple) * 0.5 * step(d, 1.0);
    col = mix(uWater, vec3(1.0), 0.55) * 1.3 * (1.0 - 0.62 * uNight);
  } else {
    int k = int(vPattern + 0.5);
    vec3 base = k == 0 ? uBase[0] : (k == 1 ? uBase[1] : (k == 2 ? uBase[2] : (k == 3 ? uBase[3] : uBase[4])));
    vec3 spot = k == 0 ? uSpot[0] : (k == 1 ? uSpot[1] : (k == 2 ? uSpot[2] : (k == 3 ? uSpot[3] : uSpot[4])));
    float x = vBody.x;
    float y = vBody.y;
    // Đốm loang theo hạt giống của từng con (Kohaku, Sanke). Ogon, cá chép, cá vàng: một màu, đổi dần lên lưng.
    float blot = sin(x * 11.0 + vSeed * 17.0) * 0.6 + sin(x * 5.3 - y * 2.1 + vSeed * 9.0) * 0.7 + 0.25;
    float blotch = smoothstep(0.05, 0.35, blot) * (1.0 - smoothstep(0.42, 0.5, x));
    col = mix(base, spot, (k == 1 || k > 2) ? (1.0 - abs(y)) * 0.6 : blotch);
    // Sanke: vài chấm đen nhỏ trên lưng.
    if (k == 2) {
      float speck = sin(x * 23.0 + vSeed * 31.0) * sin(y * 4.0 + vSeed * 7.0);
      col = mix(col, vec3(0.006, 0.006, 0.008), smoothstep(0.72, 0.86, speck) * (1.0 - abs(y)));
    }
    // Vây và đuôi mỏng, ánh màu nền; sống lưng tối hơn một chút.
    col = mix(col, base * 0.9 + spot * 0.1, step(0.5, part) * 0.6);
    col *= 0.86 + 0.14 * abs(y);
    // Ngay dưới mặt nước: ngả về màu nước; sáng như mặt nước được nắng chiếu, ban đêm tối đi.
    col = mix(col, uWater, uTint);
    col *= 1.45 * (1.0 - 0.62 * uNight);
    float edge = part > 0.5 ? 0.55 : 1.0 - smoothstep(0.55, 1.0, abs(y)) * 0.55;
    alpha = 0.78 * edge;
  }
  alpha *= vFade;
  // Màu tuyến tính qua tone-map và đổi sang sRGB như vật liệu có ánh sáng của cảnh, rồi nhân alpha (pha trộn nhân sẵn).
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb *= alpha;
}
`,
  ke = `
attribute vec3 aBody;
attribute vec4 aTurtle;
uniform float uTime;
varying vec3 vBody;
varying float vFade;

void main() {
  vBody = aBody;
  vFade = aTurtle.y;
  vec3 p = position;
  // Chân chèo (phần chân, xa sống mai): đầu chân đưa tới đưa lui, hai bên ngược pha.
  float limb = step(0.5, aBody.z) * smoothstep(0.24, 0.45, abs(p.z));
  p.x += sin(uTime * 2.2 + aTurtle.x * 6.2831 + sign(p.z) * 1.57) * 0.07 * aTurtle.z * limb;
  gl_Position = projectionMatrix * modelViewMatrix * (instanceMatrix * vec4(p, 1.0));
}
`,
  Ae = `
uniform vec3 uShell;
uniform vec3 uSeam;
uniform vec3 uLimb;
uniform vec3 uStripe;
uniform vec3 uWater;
uniform float uNight;
uniform float uTint;
varying vec3 vBody;
varying float vFade;

void main() {
  vec3 col;
  float alpha;
  if (vBody.z < 0.5) {
    // Mai: vảy giả bằng hai họ đường so le, viền mai sẫm; mai nổi trên mặt nước nên không ngả màu nước.
    vec2 q = vBody.xy * vec2(6.0, 2.2);
    float a = abs(fract(q.x + 0.5 * floor(q.y + 0.5)) - 0.5) * 2.0;
    float b = abs(fract(q.y) - 0.5) * 2.0;
    float seam = max(smoothstep(0.86, 0.98, a), smoothstep(0.88, 0.98, b));
    float rim = smoothstep(0.82, 1.0, length(vBody.xy * vec2(2.6, 1.0)));
    col = mix(uShell, uSeam, max(seam * 0.8, rim * 0.6));
    alpha = 0.95;
  } else {
    // Đầu, chân, đuôi: xám ô liu, sọc vàng nhạt, ngay dưới mặt nước.
    float stripe = smoothstep(0.75, 0.95, sin(vBody.x * 40.0 + vBody.y * 3.0));
    col = mix(mix(uLimb, uStripe, stripe * 0.6), uWater, uTint);
    alpha = 0.82;
  }
  col *= 1.35 * (1.0 - 0.62 * uNight);
  alpha *= vFade;
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb *= alpha;
}
`,
  je = new s(),
  W = new o(),
  Me = new o(),
  Ne = new d(),
  Pe = new d(),
  Fe = new d(0, 1, 0),
  Ie = new d(0, 0, 1),
  G = { x: 0, z: 0 },
  K = { x: 0, z: 0 },
  q = { s: 0, heading: 0, bend: 0 },
  Le = he(),
  J = new d(),
  Y = (e) => {
    let t = new m().setRGB(e[0], e[1], e[2]).convertSRGBToLinear();
    return new d(t.r, t.g, t.b);
  };
function Re(e, t, n, r) {
  let i = new l({
    uniforms: r,
    vertexShader: t,
    fragmentShader: n,
    transparent: !0,
    premultipliedAlpha: !0,
    depthWrite: !1,
    side: 2,
    forceSinglePass: !0,
    fog: !1,
  });
  return ((i.name = e), i);
}
function X(e, t, n, r, i, a, o, s) {
  (W.setFromAxisAngle(Fe, -a),
    o !== 0 && W.multiply(Me.setFromAxisAngle(Ie, o)),
    Ne.set(n, r, i),
    Pe.setScalar(s),
    je.compose(Ne, W, Pe),
    e.setMatrixAt(t, je));
}
function ze(e) {
  let t = [],
    n = [],
    r = null,
    i = (i) => {
      let a = Be({
        pond: i,
        quality: e.quality,
        calm: e.calm,
        ...(e.camera ? { camera: e.camera } : {}),
        ...(e.now ? { now: e.now } : {}),
        ...(i === `ho-ban-nguyet`
          ? {
              releaseCap: fe[e.quality],
              attach: (t) => e.attach(t),
              ...(e.onAttach ? { onAttach: e.onAttach } : {}),
            }
          : {}),
      });
      return (t.push(a), n.push(e.attach(a.object, a.update)), i === `ho-ban-nguyet` && (r = a), a);
    },
    a = e.front ? [`ao-sen`, `ho-ban-nguyet`] : [`ao-sen`];
  for (let t of a) xe[t][e.quality] > 0 && i(t);
  return (
    t.length > 0 && e.onAttach?.(),
    {
      count: () => t.reduce((e, t) => e + t.count(), 0),
      addRelease(t) {
        if (!e.front) return !1;
        let n = r;
        return (n === null && ((n = i(`ho-ban-nguyet`)), e.onAttach?.()), n.addRelease(t));
      },
      releasedCount: () => r?.released().length ?? 0,
      clearReleases: () => r?.clearReleases(),
      dispose() {
        for (let e of n.splice(0)) e();
        for (let e of t.splice(0)) e.dispose();
        r = null;
      },
    }
  );
}
function Be(e) {
  let t = Te[e.pond],
    n = xe[e.pond][e.quality],
    r = Math.max(0, Math.floor(e.releaseCap ?? 0)),
    i = e.now ?? (() => performance.now() / 1e3),
    o = e.calm ?? !1,
    s = ne(Se[e.pond]),
    c = [];
  for (let r = 0; r < n; r++)
    c.push({
      loop: re(t.region, Se[e.pond], r),
      tint: r % 3,
      length: t.length[0] + (t.length[1] - t.length[0]) * s(),
      seed: s(),
    });
  let l = [],
    u = 0,
    p = n + (r > 0 ? r + U + 3 : 0),
    g = ae(),
    _ = new f(new Float32Array(Math.max(1, p) * 4), 4);
  (_.setUsage(h), g.setAttribute(`aFish`, _));
  let v = new f(new Float32Array(Math.max(1, p) * 4), 4);
  (v.setUsage(h), g.setAttribute(`aRel`, v));
  let y = new m(ee.water),
    b = new d(y.r, y.g, y.b),
    x = {
      uTime: { value: 0 },
      uNight: te.uLanternNight,
      uBase: { value: ce.map(([e]) => Y(e)) },
      uSpot: { value: ce.map(([, e]) => Y(e)) },
      uWater: { value: b },
      uTint: { value: Ce },
    },
    S = Re(`pond-life`, De, Oe, x),
    C = new a(g, S, Math.max(1, p));
  ((C.name = `pond-life-${e.pond}`),
    (C.count = n),
    (C.visible = n > 0 && !e.camera),
    C.instanceMatrix.setUsage(h),
    (C.renderOrder = 3),
    (C.boundingSphere = t.sphere.clone()));
  let w = !0;
  C.onBeforeRender = () => {
    w = !0;
  };
  let T = Ee[e.pond],
    E = null,
    O = !1,
    k = -1 / 0,
    A = !e.camera,
    j = (e, t) => {
      let n = e.loop.offset + e.loop.speed * (o ? we : 1) * t;
      (e.loop.path.tangent(n, G), e.loop.path.tangent(n + 0.4, K));
      let r = Math.atan2(G.x * K.z - G.z * K.x, G.x * K.x + G.z * K.z);
      return (
        (q.s = n),
        (q.heading = Math.atan2(G.z, G.x)),
        (q.bend = Math.max(-0.35, Math.min(0.35, r * 0.9))),
        q
      );
    },
    ie = () => {
      let n = oe(),
        i = new f(new Float32Array((r + U) * 4), 4);
      (i.setUsage(h), n.setAttribute(`aTurtle`, i));
      let o = Re(`pond-turtles`, ke, Ae, {
          uTime: x.uTime,
          uNight: te.uLanternNight,
          uShell: { value: Y(L.shell) },
          uSeam: { value: Y(L.seam) },
          uLimb: { value: Y(L.limb) },
          uStripe: { value: Y(L.stripe) },
          uWater: { value: b },
          uTint: { value: Ce },
        }),
        s = new a(n, o, r + U);
      ((s.name = `pond-turtles-${e.pond}`),
        (s.count = 0),
        (s.visible = !1),
        s.instanceMatrix.setUsage(h),
        (s.renderOrder = 3),
        (s.boundingSphere = t.sphere.clone()),
        (s.onBeforeRender = () => {
          w = !0;
        }));
      let c = e.attach ? e.attach(s) : null;
      return (e.onAttach?.(), { mesh: s, attr: i, geometry: n, material: o, off: c });
    },
    N = (e) => {
      for (let t = l.length - 1; t >= 0; t--) ye(l[t], e) && l.splice(t, 1);
      for (; l.length > r + U;) {
        let e = l.findIndex((e) => e.leaveAt !== null);
        l.splice(e < 0 ? 0 : e, 1);
      }
    },
    P = new Float64Array(9),
    F = (e, n) => {
      let r = 0;
      for (let n of c) {
        let { s: i, heading: a, bend: s } = j(n, e);
        (n.loop.path.at(i, G), X(C, r, G.x, t.y + r * 0.0015, G.z, a, 0, n.length));
        let c = o ? 0 : 0.35 + 1.6 * n.loop.speed;
        (_.setXYZW(r, n.tint, n.seed, c, s), v.setXYZW(r, M.carp, 1, 0, 0), r++);
      }
      let i = 0,
        a = 0;
      for (let e of l) {
        let s = ve(e, n, o, Le);
        if (e.species === 2)
          E &&
            (X(E.mesh, a, s.x, t.y + 0.012 + s.lift, s.z, s.heading, s.pitch, e.length),
            E.attr.setXYZW(a, e.seed, s.alpha, o || !s.swimming ? 0 : 1, 0),
            a++);
        else {
          X(C, r, s.x, t.y + 0.004 + s.lift, s.z, s.heading, s.pitch, e.length);
          let n = o || !s.swimming ? 0 : 0.35 + 1.6 * e.speed,
            i = e.species === 1;
          (_.setXYZW(r, i ? 4 : 3, e.seed, n, s.bend), v.setXYZW(r, i ? M.fan : M.carp, s.alpha, 0, 0), r++);
        }
        s.ripple >= 0 &&
          i < 3 &&
          ((P[i * 3] = e.splash.x), (P[i * 3 + 1] = e.splash.z), (P[i * 3 + 2] = s.ripple), i++);
      }
      for (let e = 0; e < i; e++) {
        let t = P[e * 3 + 2];
        (X(C, r, P[e * 3], D + 0.02, P[e * 3 + 1], 0, 0, de),
          _.setXYZW(r, 0, 0, 0, 0),
          v.setXYZW(r, M.ripple, 1, t, 0),
          r++);
      }
      ((C.count = r),
        (C.visible = A && r > 0),
        (C.instanceMatrix.needsUpdate = !0),
        (_.needsUpdate = !0),
        (v.needsUpdate = !0),
        E &&
          ((E.mesh.count = a),
          (E.mesh.visible = A && a > 0),
          (E.mesh.instanceMatrix.needsUpdate = !0),
          (E.attr.needsUpdate = !0)));
    };
  F(0, i());
  let I = () => {
    ((C.visible = !1), E && (E.mesh.visible = !1));
  };
  return {
    object: C,
    update(t, r) {
      if (O || !Number.isFinite(r)) return;
      if ((l.length > 0 && N(i()), n === 0 && l.length === 0)) {
        (C.visible || E?.mesh.visible) && I();
        return;
      }
      let a = e.camera;
      if (a) {
        if ((a.getWorldPosition(J), !(Math.hypot(J.x - T.x, J.z - T.z) - T.r <= 10))) {
          ((A = !1), I());
          return;
        }
        A || ((A = !0), (w = !0), (k = -1 / 0));
      }
      ((x.uTime.value = o ? 0 : r), !w || r - k < 1 / 30 - 1e-4 || ((w = !1), (k = r), F(r, i())));
    },
    setCalm(e) {
      o = e;
    },
    count: () => n,
    fish(e = k === -1 / 0 ? 0 : k) {
      return c.map((t) => {
        let { s: n, heading: r } = j(t, e),
          i = t.loop.path.at(n);
        return { x: i.x, z: i.z, heading: r, tint: t.tint, length: t.length };
      });
    },
    addRelease(e) {
      if (O || r === 0) return !1;
      let t = e.code;
      if (!Number.isInteger(t) || t < 0 || t > 2) return !1;
      let n = t,
        a = i(),
        o = Math.max(0, Number.isFinite(e.ageSec) ? e.ageSec : 0);
      if (o >= 1200) return !1;
      let s = a - o;
      N(a);
      let c = e.backlog ?? null;
      if (
        c !== null &&
        l.some((e) => e.batch !== c && e.leaveAt === null && e.species === n && Math.abs(e.born - s) <= 2.5)
      )
        return !1;
      let d = l.filter((e) => e.leaveAt === null),
        f = d[0];
      if (d.length >= r && f !== void 0 && s <= f.born) return !1;
      n === 2 && E === null && (E = ie());
      let p = ge(n, s, u++, c),
        m = l.length;
      for (; m > 0 && l[m - 1].born > s;) m--;
      return (
        l.splice(m, 0, p),
        d.length >= r &&
          f !== void 0 &&
          (c !== null && f.batch === c ? l.splice(l.indexOf(f), 1) : (f.leaveAt = a)),
        N(a),
        (w = !0),
        (k = -1 / 0),
        l.includes(p)
      );
    },
    released: () => l,
    clearReleases() {
      let e = i();
      for (let t of l) t.leaveAt ??= e;
      ((w = !0), (k = -1 / 0));
    },
    turtles: () => E?.mesh ?? null,
    dispose() {
      O ||
        ((O = !0),
        C.removeFromParent(),
        g.dispose(),
        S.dispose(),
        C.dispose(),
        (l.length = 0),
        (E &&=
          (E.off?.(),
          E.mesh.removeFromParent(),
          E.geometry.dispose(),
          E.material.dispose(),
          E.mesh.dispose(),
          null)));
    },
  };
}
var Z = [
    { id: `ca-chep`, code: 0, label: `Cá chép`, body: `#c79a4a`, accent: `#8a5a24` },
    { id: `ca-vang`, code: 1, label: `Cá vàng`, body: `#f0a03a`, accent: `#d9561f` },
    { id: `rua`, code: 2, label: `Rùa`, body: `#7a7448`, accent: `#4f4a2c` },
  ],
  Ve = 2;
function He(e, t = 0) {
  let n = Z.findIndex((t) => t.id === e);
  return Math.max(0, n) | (t << Ve);
}
var Ue = `Phóng sinh`,
  We = `Chọn một loài để thả về hồ:`,
  Ge = [
    `Nam mô A Di Đà Phật.`,
    `Nguyện cho chúng sinh này được tự do, bình an, không còn sợ hãi.`,
    `Nguyện cho con lớn thêm lòng từ, biết thương và giữ gìn sự sống của muôn loài.`,
  ],
  Ke = `Phóng sinh ở Chùa Sen là một cách nuôi lòng từ, không thay được việc thương và giữ gìn sự sống thật.`,
  qe = `Phóng sinh đúng cách ngoài đời`,
  Je = [
    `Đừng đặt mua hay bắt con vật về để thả: mua bán khiến nhiều con bị bắt hơn.`,
    `Đừng thả loài ngoại lai như rùa tai đỏ, cá cảnh xuống sông hồ tự nhiên.`,
    `Thả nhẹ ở mép nước hợp với loài ấy; mang túi ni lông, rác về, đừng bỏ xuống nước.`,
    `Cứu con vật bị nạn, bớt sát sinh, giữ sạch sông hồ cũng là phóng sinh.`,
  ],
  Ye = `Đã phóng sinh. Nguyện chúng sinh an lành.`,
  Q = `Hôm nay bạn đã phóng sinh rồi. Hẹn bạn ngày mai nhé.`,
  Xe = `Chờ chút rồi thả tiếp nhé.`;
[...Ge, ...Je, ...Z.map((e) => e.label)];
function Ze(e, t, n) {
  return `<svg class="release-dlg__art" viewBox="0 0 32 20" aria-hidden="true" focusable="false" fill="none" stroke-linecap="round">${e === `rua` ? `<path d="M7 5l-3-2M7 15l-3 2M19 5l3-2M19 15l3 2" stroke="${t}" stroke-width="2.2"/><ellipse cx="13" cy="10" rx="8" ry="6" fill="${t}"/><path d="M9 7.5h8M8 10h10M9 12.5h8" stroke="${n}" stroke-width="1"/><ellipse cx="24.5" cy="10" rx="3" ry="2.2" fill="${t}"/>` : e === `ca-vang` ? `<path d="M5 10c3-5 10-6 15-2l9-6-2 8 2 8-9-6c-5 4-12 3-15-2z" fill="${t}"/><path d="M20 8l9-6-2 8 2 8-9-6" fill="${n}"/>` : `<path d="M3 10c4-5 12-6 18-2l6-4v12l-6-4c-6 4-14 3-18-2z" fill="${t}"/><path d="M6 10c4-3 10-3.5 15-1" stroke="${n}" stroke-width="1.2"/>`}<circle cx="${e === `rua` ? 25.5 : 7}" cy="9.2" r="1" fill="#1a140c"/></svg>`;
}
function Qe(e = {}) {
  let n = null,
    r = () => {},
    i = new Promise((e) => {
      r = e;
    }),
    a = e.alreadyToday === !0,
    o = Ge.map((e) => `<span class="release-dlg__vow-line">${e}</span>`).join(``),
    s = Je.map((e) => `<li>${e}</li>`).join(``),
    c = a
      ? `<p class="release-dlg__today" data-ref="today">${Q}</p>
      <footer class="release-dlg__actions">
        <button type="button" class="release-dlg__btn release-dlg__btn--go" data-ref="later">Đóng</button>
      </footer>`
      : `<p id="release-lead" class="release-dlg__label">${We}</p>
      <div class="release-dlg__chips" role="radiogroup" aria-labelledby="release-lead" data-ref="chips"></div>
      <blockquote class="release-dlg__vow" aria-label="Lời phát nguyện">${o}</blockquote>
      <footer class="release-dlg__actions">
        <button type="button" class="release-dlg__btn" data-ref="later">Để sau</button>
        <button type="submit" class="release-dlg__btn release-dlg__btn--go" data-ref="go">${t(`fish`)}<span>Thả</span></button>
      </footer>`,
    {
      dialog: l,
      close: u,
      ref: d,
    } = _({
      className: `release-dlg`,
      labelledBy: `release-title`,
      describedBy: `release-note`,
      signal: e.signal,
      onClosed: () => r(n),
      html: `
    <form class="release-dlg__card" novalidate>
      <header class="release-dlg__head">
        <h2 id="release-title" class="release-dlg__title" tabindex="-1" data-ref="title">${Ue}</h2>
        <button type="button" class="release-dlg__close" data-ref="close" aria-label="Đóng">${t(`close`)}</button>
      </header>
      ${c}
      <p id="release-note" class="release-dlg__note">${Ke}</p>
      <details class="release-dlg__more">
        <summary>${qe}</summary>
        <ul class="release-dlg__list">${s}</ul>
      </details>
    </form>`,
    }),
    f = l.querySelector(`form`);
  (d(`later`).addEventListener(`click`, u),
    d(`close`).addEventListener(`click`, u),
    f.addEventListener(`submit`, (e) => {
      (e.preventDefault(), a || n || ((n = { species: p }), u()));
    }));
  let p = Z[0]?.id ?? `ca-chep`,
    m = a
      ? []
      : Z.map((e) => {
          let t = document.createElement(`button`);
          return (
            (t.type = `button`),
            (t.className = `release-dlg__chip`),
            t.setAttribute(`role`, `radio`),
            (t.dataset.species = e.id),
            (t.innerHTML = `${Ze(e.id, e.body, e.accent)}<span>${e.label}</span>`),
            d(`chips`).append(t),
            t
          );
        }),
    h = (e, t) => {
      ((p = Z[e]?.id ?? p),
        m.forEach((n, r) => {
          let i = r === e;
          (n.setAttribute(`aria-checked`, String(i)),
            (n.tabIndex = i ? 0 : -1),
            i && t && n.focus({ preventScroll: !0 }));
        }));
    };
  return (
    m.forEach((e, t) => {
      (e.addEventListener(`click`, () => h(t, !1)),
        e.addEventListener(`keydown`, (e) => {
          let n =
              e.key === `ArrowRight` || e.key === `ArrowDown`
                ? 1
                : e.key === `ArrowLeft` || e.key === `ArrowUp`
                  ? -1
                  : 0,
            r = -1;
          (n === 0
            ? e.key === `Home`
              ? (r = 0)
              : e.key === `End` && (r = m.length - 1)
            : (r = (t + n + m.length) % m.length),
            r < 0 || (e.preventDefault(), h(r, !0)));
        }));
    }),
    l.isConnected && (m.length > 0 ? h(0, !0) : d(`later`).focus({ preventScroll: !0 })),
    i
  );
}
var $e = e({ releaseFlow: () => nt }),
  et = `Bến phóng sinh bên hồ bán nguyệt chưa sẵn sàng, bạn thử lại sau ít giây nhé.`,
  tt = ``;
function $(e = y) {
  let t = e.dayKey();
  if (tt === t) return !0;
  let r = e.raw()?.days,
    i = n(r) ? r[t] : null;
  return n(i) && typeof i.release == `number` && i.release >= 1;
}
function nt(e) {
  let t = e.counters ?? y,
    n = null,
    i = async (e = !1, t) => {
      try {
        await a(e, t);
      } catch (e) {
        console.error(`Không phóng sinh được`, e);
      }
    },
    a = async (a, o) => {
      if (e.busy()) return;
      (n?.(), (n = null));
      let s = o ?? e.temple.interactions.find((e) => e.id === `release`);
      if (!s) {
        e.toast(et);
        return;
      }
      let { x: c, z: l } = e.player.state;
      if (!a && Math.hypot(s.x - c, s.z - l) > 4) {
        (e.seating.cancel(),
          (n = g(e.player, s, { arriveRadius: 1.2, kind: `release`, target: s.id }, () => void i(!0, s))));
        return;
      }
      let u = $(t),
        d = await e.withModal(() => Qe({ alreadyToday: u, signal: e.signal }));
      if (u || !d) {
        r(`release_dialog`, { result: u ? `already_today` : `closed` });
        return;
      }
      if (e.busy()) return;
      if ($(t)) {
        (e.toast(Q), r(`release_dialog`, { result: `already_today` }));
        return;
      }
      if (!e.net.sendRelease(He(d.species))) {
        (e.toast(Xe), r(`release_dialog`, { result: `wait` }));
        return;
      }
      (r(`release_dialog`, { result: `released` }),
        (tt = t.dayKey()),
        t.bump(`release`),
        e.audio.play(`soft`),
        e.haptic(12),
        e.toast(Ye),
        e.player.faceTowards(s.x, T),
        e.player.bow());
      let f = v({ x: s.x, z: T + 0.8, r: 2.5 });
      (f.start(), e.gaze(f), r(`ritual`, { action: `release`, species: d.species }));
    };
  return i;
}
export { be as n, $e as t };
