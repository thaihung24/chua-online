import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
var t = e({
  SHOT_TONE_MAPPING: () => i,
  SHOT_VIEWS: () => r,
  applyShotToneMapping: () => a,
  cushionNear: () => f,
  frontRowCushion: () => d,
  installFixedStepClock: () => l,
  installSeededRandom: () => s,
  resolveShotSpawn: () => u,
  seededRandom: () => o,
});
function n(e, t, n, r, i) {
  return { id: e, label: t, x: n, z: r, facing: Math.atan2(n - i.x, r - i.z) + 0, look: i };
}
var r = {
    V1: { id: `V1`, label: `Điểm xuất phát nhìn vào chánh điện`, x: 0, z: 16, facing: 0 },
    V2: { id: `V2`, label: `Trước hiên chánh điện`, x: 0, z: -8, facing: 0 },
    V3: { id: `V3`, label: `Trong chánh điện nhìn tượng`, x: 0, z: -13, facing: 0 },
    V4: { id: `V4`, label: `Quỳ ở bồ đoàn hàng đầu`, x: -1.4, z: -14.3, facing: 0, sit: !0 },
    V5: { id: `V5`, label: `Sân gần lư hương`, x: 0, z: -0.4, facing: 0 },
    V6: { id: `V6`, label: `Nhìn ra núi qua tam quan`, x: 0, z: 14, facing: Math.PI },
    C1: n(`C1`, `Nghi môn nhìn từ sân trước`, 0, 51, { x: 0, y: 4.1, z: 54, r: 1 }),
    C2: n(`C2`, `Sân trước, cầu và tam quan`, 0, 49.4, { x: 0, y: 3, z: 23, r: 1.5 }),
    C3: n(`C3`, `Sân thiền và tượng Phật đá`, -28, -9.5, { x: -28, y: 2.1, z: -18.5, r: 0.6 }),
    C4: n(`C4`, `Quan Âm vườn Đông`, 24, -5.5, { x: 29, y: 3.4, z: -10, r: 0.75 }),
    C5: n(`C5`, `Giếng ngọc`, 25.35, 12, { x: 28, y: 0.8, z: 12, r: 1.25 }),
    C6: n(`C6`, `Cổng phụ phía Tây`, -26, -2, { x: -20, y: 2.5, z: -2, r: 1.6 }),
    C7: n(`C7`, `Toàn cảnh từ góc vườn`, -29, 47, { x: 0, y: 15.75, z: -16, r: 3 }),
    S1: n(`S1`, `Cận tượng chánh điện`, 0, -16.4, { x: 0, y: 2.75, z: -20.3, r: 0.8 }),
  },
  i = new Map([
    [`aces`, 4],
    [`neutral`, 7],
    [`agx`, 6],
  ]);
function a(e, t) {
  let n = i.get(new URLSearchParams(t).get(`tm`)?.trim().toLowerCase() ?? ``);
  n !== void 0 && (e.toneMapping = n);
}
function o(e) {
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
function s(e, t = Math) {
  let n = t.random;
  return (
    (t.random = o(e)),
    () => {
      t.random = n;
    }
  );
}
function c(e, t, n) {
  let r = Object.prototype.hasOwnProperty.call(e, t),
    i = e[t];
  return (
    (e[t] = n),
    () => {
      r ? (e[t] = i) : delete e[t];
    }
  );
}
function l(e = window, t = 1e3 / 60) {
  let n = e.requestAnimationFrame.bind(e),
    r = e.performance.now(),
    i = c(e.performance, `now`, () => r),
    a = c(e, `requestAnimationFrame`, (e) =>
      n(() => {
        ((r += t), e(r));
      }),
    );
  return () => {
    (i(), a());
  };
}
function u(e, t) {
  let n = { x: e.x, z: e.z, facing: e.facing };
  if (t(n.x, n.z)) return n;
  for (let e = 1; e <= 40; e += 1) {
    let r = e * 0.25;
    for (let [e, i] of [
      [0, r],
      [r, 0],
      [-r, 0],
      [r, r],
      [-r, r],
      [0, -r],
    ])
      if (t(n.x + e, n.z + i)) return { ...n, x: n.x + e, z: n.z + i };
  }
  return n;
}
function d(e) {
  let t = null;
  for (let n of e)
    n.kind === `cushion` &&
      (t === null || n.z < t.z - 1e-6 || (Math.abs(n.z - t.z) <= 1e-6 && Math.abs(n.x) < Math.abs(t.x))) &&
      (t = n);
  return t;
}
function f(e, t, n) {
  let r = null,
    i = 1 / 0;
  for (let a of e) {
    if (a.kind !== `cushion`) continue;
    let e = (a.x - t) ** 2 + (a.z - n) ** 2;
    e < i && ((r = a), (i = e));
  }
  return r;
}
export { t };
