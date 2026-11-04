import { F as e, Z as t, et as n, ft as r, m as i } from "./three-BbSp8N3g.js";
import { Ft as a } from "./index-e_Bx6V48.js";
var o = [`dawn`, `day`, `dusk`, `night`];
function s(e) {
  return e === `auto` || o.includes(e);
}
var c = [`skyTop`, `skyUpper`, `skyMid`, `skyHorizon`, `glow`, `sunColor`, `cloudLit`, `cloudShade`, `land`],
  l = [
    `glowAmount`,
    `sunAmount`,
    `moonAmount`,
    `stars`,
    `cloudCover`,
    `fogNear`,
    `fogFar`,
    `exposure`,
    `night`,
    `golden`,
    `mist`,
  ],
  u = [`sunDir`, `lightDir`];
function d(e, t) {
  let n = (e * Math.PI) / 180,
    i = (t * Math.PI) / 180;
  return new r(Math.sin(n) * Math.cos(i), Math.sin(i), -Math.cos(n) * Math.cos(i));
}
function f(e) {
  let [t, n, r, a] = e.sky;
  return {
    colors: {
      skyTop: new i(t),
      skyUpper: new i(n),
      skyMid: new i(r),
      skyHorizon: new i(a),
      glow: new i(e.glow[0]),
      sunColor: new i(e.sun[0]),
      cloudLit: new i(e.cloud[0]),
      cloudShade: new i(e.cloud[1]),
      land: new i(e.land[0]),
    },
    numbers: {
      glowAmount: e.glow[1],
      sunAmount: e.sun[1],
      moonAmount: e.moon,
      stars: e.stars,
      cloudCover: e.cloud[2],
      fogNear: e.fog[0],
      fogFar: e.fog[1],
      exposure: e.exposure,
      night: e.time[0],
      golden: e.time[1],
      mist: e.land[1],
    },
    dirs: { sunDir: d(e.sun[2], e.sun[3]), lightDir: d(e.light[0], e.light[1]) },
  };
}
var p = {
  dawn: f({
    sky: [6981309, 12297414, 15774884, 16505264],
    glow: [16762512, 1],
    sun: [16768176, 1, 130, 14],
    moon: 0.3,
    stars: 0.12,
    cloud: [16771282, 13140111, 0.52],
    fog: [20, 118],
    exposure: 1,
    light: [130, 17],
    time: [0.3, 1],
    land: [16769236, 1.1],
  }),
  day: f({
    sky: [3898575, 7055076, 10800622, 14740464],
    glow: [16774102, 0.35],
    sun: [16774364, 1, -160, 55],
    moon: 0,
    stars: 0,
    cloud: [16777215, 10465999, 0.54],
    fog: [30, 120],
    exposure: 1,
    light: [-160, 55],
    time: [0, 0],
    land: [16777215, 0.8],
  }),
  dusk: f({
    sky: [5597082, 11635368, 15047296, 16172172],
    glow: [16756838, 1],
    sun: [16765078, 1, -132.7, 26.9],
    moon: 0.3,
    stars: 0,
    cloud: [16773336, 14712970, 0.5],
    fog: [46, 178],
    exposure: 1,
    light: [-132.7, 26.9],
    time: [0.2, 1],
    land: [15913664, 0.85],
  }),
  night: f({
    sky: [461599, 1120826, 1976918, 3424364],
    glow: [7309e3, 0.4],
    sun: [16765078, 0, 180, -18],
    moon: 1,
    stars: 1,
    cloud: [4938636, 1449018, 0.55],
    fog: [36, 150],
    exposure: 1,
    light: [180, 40],
    time: [1, 0],
    land: [2898798, 0.8],
  }),
};
function m() {
  return f(h);
}
var h = {
  sky: [0, 0, 0, 0],
  glow: [0, 0],
  sun: [0, 0, 0, 0],
  moon: 0,
  stars: 0,
  cloud: [0, 0, 0],
  fog: [0, 0],
  exposure: 1,
  light: [0, 0],
  time: [0, 0],
  land: [0, 1],
};
function g(e, t) {
  for (let n of c) e.colors[n].copy(t.colors[n]);
  for (let n of l) e.numbers[n] = t.numbers[n];
  for (let n of u) e.dirs[n].copy(t.dirs[n]);
  return e;
}
function _(e, t, n, r) {
  for (let i of c) e.colors[i].lerpColors(t.colors[i], n.colors[i], r);
  for (let i of l) e.numbers[i] = t.numbers[i] + (n.numbers[i] - t.numbers[i]) * r;
  for (let i of u) {
    let a = e.dirs[i].lerpVectors(t.dirs[i], n.dirs[i], r);
    (a.lengthSq() < 1e-6 && a.copy(r < 0.5 ? t.dirs[i] : n.dirs[i]), a.normalize());
  }
  return e;
}
function v(e, t) {
  let n = 0;
  for (let r of c) {
    let i = e.colors[r],
      a = t.colors[r];
    n = Math.max(n, Math.abs(i.r - a.r), Math.abs(i.g - a.g), Math.abs(i.b - a.b));
  }
  for (let r of l) {
    let i = e.numbers[r],
      a = t.numbers[r];
    n = Math.max(n, Math.abs(i - a) / (1 + Math.abs(a)));
  }
  for (let r of u) n = Math.max(n, e.dirs[r].distanceTo(t.dirs[r]));
  return n;
}
var y = [
  { hour: 4.5, preset: `night` },
  { hour: 5.75, preset: `dawn` },
  { hour: 7.5, preset: `day` },
  { hour: 16, preset: `day` },
  { hour: 17.75, preset: `dusk` },
  { hour: 19.25, preset: `night` },
];
function b(e) {
  if (!Number.isFinite(e)) return { from: `day`, to: `day`, t: 0 };
  let t = ((e % 24) + 24) % 24,
    n = y[0],
    r = y[y.length - 1];
  if (t < n.hour || t >= r.hour) {
    let e = n.hour + 24 - r.hour,
      i = t < n.hour ? t + 24 - r.hour : t - r.hour;
    return { from: r.preset, to: n.preset, t: S(i / e) };
  }
  for (let e = 0; e < y.length - 1; e++) {
    let n = y[e],
      r = y[e + 1];
    if (t >= n.hour && t < r.hour)
      return { from: n.preset, to: r.preset, t: S((t - n.hour) / (r.hour - n.hour)) };
  }
  return { from: `day`, to: `day`, t: 0 };
}
function x(e = new Date()) {
  return e.getHours() + e.getMinutes() / 60 + e.getSeconds() / 3600;
}
function S(e) {
  let t = e < 0 ? 0 : e > 1 ? 1 : e;
  return t * t * (3 - 2 * t);
}
var C = 0.9,
  w = 0.0015,
  T = class {
    constructor(e, t) {
      (a(this, `current`, void 0),
        a(this, `target`, void 0),
        a(this, `mode`, void 0),
        a(this, `preset`, void 0),
        (this.mode = e),
        (this.preset = `dusk`),
        (this.current = m()),
        (this.target = m()),
        this.retarget(t),
        g(this.current, this.target));
    }
    getMode() {
      return this.mode;
    }
    getPreset() {
      return this.preset;
    }
    setMode(e, t, n = !1) {
      ((this.mode = e), this.retarget(t), n && g(this.current, this.target));
    }
    update(e, t) {
      this.retarget(t);
      let n = v(this.current, this.target);
      if (n === 0) return !1;
      if (n < w) return (g(this.current, this.target), !0);
      let r = 1 - Math.exp(-Math.max(0, e) / C);
      return (_(this.current, this.current, this.target, r), !0);
    }
    retarget(e) {
      if (this.mode === `auto`) {
        let t = b(e);
        (_(this.target, p[t.from], p[t.to], t.t), (this.preset = t.t < 0.5 ? t.from : t.to));
      } else (g(this.target, p[this.mode]), (this.preset = this.mode));
    }
  },
  E = new r(0.18, 0.1, -1).normalize(),
  D = d(-24, 26),
  O = {
    uTop: { value: new i() },
    uUpper: { value: new i() },
    uMid: { value: new i() },
    uHorizon: { value: new i() },
    uGlow: { value: new i() },
    uGlowAmt: { value: 1 },
    uGlowDir: { value: E.clone() },
    uSunDir: { value: new r(0, 1, 0) },
    uSunColor: { value: new i() },
    uSunAmt: { value: 1 },
    uMoonDir: { value: D.clone() },
    uMoonAmt: { value: 0 },
    uStars: { value: 0 },
    uCloudLit: { value: new i() },
    uCloudShade: { value: new i() },
    uCloudCover: { value: 0.5 },
    uLand: { value: new i() },
    uMist: { value: 1 },
    uTime: { value: 0 },
  };
function k(e) {
  let t = e.colors,
    n = e.numbers,
    r = O;
  (r.uTop.value.copy(t.skyTop),
    r.uUpper.value.copy(t.skyUpper),
    r.uMid.value.copy(t.skyMid),
    r.uHorizon.value.copy(t.skyHorizon),
    r.uGlow.value.copy(t.glow),
    (r.uGlowAmt.value = n.glowAmount),
    r.uSunDir.value.copy(e.dirs.sunDir),
    r.uSunColor.value.copy(t.sunColor),
    (r.uSunAmt.value = n.sunAmount),
    (r.uMoonAmt.value = n.moonAmount),
    (r.uStars.value = n.stars),
    r.uCloudLit.value.copy(t.cloudLit),
    r.uCloudShade.value.copy(t.cloudShade),
    (r.uCloudCover.value = n.cloudCover),
    r.uLand.value.copy(t.land),
    (r.uMist.value = n.mist));
}
k(p.dusk);
var A = `
uniform vec3 uTop;
uniform vec3 uUpper;
uniform vec3 uMid;
uniform vec3 uHorizon;
uniform vec3 uGlow;
uniform float uGlowAmt;
uniform vec3 uGlowDir;

vec3 skyGradient(vec3 d) {
  float h = max(d.y, 0.0);
  // Bốn dải màu: chân trời, dải giữa, dải trên, đỉnh trời.
  vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.16, h));
  col = mix(col, uUpper, smoothstep(0.1, 0.42, h));
  col = mix(col, uTop, smoothstep(0.34, 0.95, h));
  // Ráng chiều: quầng rộng sát chân trời phía sau chánh điện, cộng một điểm sáng hẹp.
  float g = max(dot(d, uGlowDir), 0.0);
  float low = 1.0 - smoothstep(0.0, 0.5, h);
  col += uGlow * uGlowAmt * (pow(g, 2.5) * 0.3 * low + pow(g, 12.0) * 0.28);
  return col;
}
`,
  j = `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  // .xyww đặt độ sâu đúng mặt phẳng xa: vòm trời vẽ cuối cùng và chỉ tô các điểm ảnh chưa có gì che,
  // nên không tốn shader mây cho phần màn hình đã bị chùa, đất, núi phủ.
  gl_Position = (projectionMatrix * modelViewMatrix * vec4(position, 1.0)).xyww;
}
`,
  M = `
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunAmt;
uniform vec3 uMoonDir;
uniform float uMoonAmt;
uniform float uStars;
uniform vec3 uCloudLit;
uniform vec3 uCloudShade;
uniform float uCloudCover;
uniform float uTime;
varying vec3 vDir;
#include <common>
#include <dithering_pars_fragment>
${A}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float hash31(vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < CLOUD_OCTAVES; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return s;
}

void main() {
  vec3 d = normalize(vDir);
  vec3 col = skyGradient(d);
  float h = d.y;

  // Mặt trời: quầng mềm và một đĩa nhỏ sáng gắt.
  float s = max(dot(d, uSunDir), 0.0);
  col += uSunColor * uSunAmt * (pow(s, 5.0) * 0.22 + pow(s, 64.0) * 0.7 + smoothstep(0.9990, 0.9996, s) * 1.4);

  // Sao (chỉ trên chân trời, nhấp nháy rất nhẹ) và trăng rằm có vài mảng tối.
  float stars = 0.0;
  if (uStars > 0.001 && h > 0.0) {
    vec3 p = d * 62.0;
    vec3 cell = floor(p);
    vec3 f = fract(p) - 0.5;
    float r = hash31(cell);
    vec3 jitter = vec3(hash31(cell + 3.1), hash31(cell + 7.7), hash31(cell + 11.3)) - 0.5;
    float dist = length(f - jitter * 0.55);
    float size = 0.07 + 0.09 * hash31(cell + 5.5);
    float tw = 0.8 + 0.2 * sin(uTime * 1.7 + r * 60.0);
    stars = step(0.9, r) * (1.0 - smoothstep(0.0, size, dist)) * tw * smoothstep(0.0, 0.12, h) * uStars;
    col += vec3(0.85, 0.9, 1.0) * stars * 1.6;
  }
  if (uMoonAmt > 0.001) {
    float md = dot(d, uMoonDir);
    col += vec3(0.62, 0.7, 0.95) * uMoonAmt * (pow(max(md, 0.0), 300.0) * 0.4 + pow(max(md, 0.0), 40.0) * 0.1);
    if (md > 0.9985) {
      vec3 t = normalize(cross(uMoonDir, vec3(0.0, 1.0, 0.0)));
      vec3 b = cross(t, uMoonDir);
      vec2 q = vec2(dot(d, t), dot(d, b)) / 0.045;
      float disc = 1.0 - smoothstep(0.93, 1.0, length(q));
      float maria = vnoise(q * 3.2 + 4.0) * 0.55 + vnoise(q * 7.0) * 0.25;
      vec3 moon = mix(vec3(1.0, 0.97, 0.88), vec3(0.5, 0.55, 0.68), maria * 1.1);
      col = mix(col, moon * 1.05, disc * uMoonAmt);
    }
  }

  // Mây mỏng: nhiễu fbm trên một mặt phẳng ảo, thưa dần và tan vào sương khi sát chân trời.
  if (h > 0.0) {
    vec2 uv = d.xz / (h + 0.28) * vec2(2.8, 2.0) + vec2(uTime * 0.02, uTime * 0.007);
    float n = fbm(uv);
    float cover = smoothstep(uCloudCover, uCloudCover + 0.16, n);
    float fade = smoothstep(0.0, 0.2, h);
    if (cover * fade > 0.003) {
      #if CLOUD_LIT
      vec2 toLight = normalize(uSunDir.xz + vec2(0.0001, 0.0));
      float n2 = fbm(uv + toLight * 0.09);
      float lit = clamp(0.5 + (n - n2) * 4.2 + (1.0 - cover) * 0.25, 0.0, 1.0);
      #else
      float lit = clamp(0.35 + (1.0 - cover) * 0.9, 0.0, 1.0);
      #endif
      vec3 cloud = mix(uCloudShade, uCloudLit, lit);
      // Mây phía ráng chiều ửng màu ráng; mây gần mặt trời có viền sáng.
      float gl = pow(max(dot(d, uGlowDir), 0.0), 3.0);
      cloud += uGlow * uGlowAmt * gl * 0.45;
      cloud += uSunColor * uSunAmt * pow(s, 8.0) * 0.5 * (1.0 - cover * 0.5);
      col = mix(col, cloud, cover * fade * 0.92);
    }
  }

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <dithering_fragment>
}
`;
function N(r) {
  let i = new t({
      uniforms: O,
      defines: { CLOUD_OCTAVES: r === `low` ? 3 : 4, CLOUD_LIT: r === `low` ? 0 : 1 },
      vertexShader: j,
      fragmentShader: M,
      side: 1,
      depthTest: !0,
      depthWrite: !1,
      fog: !1,
      dithering: !0,
    }),
    a = new n(400, 24, 14),
    o = new e(a, i);
  return (
    (o.name = `sky`),
    (o.renderOrder = 1e3),
    (o.frustumCulled = !1),
    {
      mesh: o,
      dispose() {
        (a.dispose(), i.dispose());
      },
    }
  );
}
export { p as a, x as c, O as i, k as n, T as o, N as r, s, A as t };
