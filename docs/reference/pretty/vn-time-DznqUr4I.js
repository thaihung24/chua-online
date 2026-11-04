import { Zt as e } from "./index-e_Bx6V48.js";
var t = 36e5,
  n = 864e5;
function r(r) {
  return (((r + e.utcOffsetHours * t) % n) + n) % n;
}
function i(e = Date.now()) {
  return r(e) / t;
}
function a(e) {
  return e - r(e);
}
function o(r = Date.now()) {
  return Math.floor((r + e.utcOffsetHours * t) / n);
}
export { a, i, t as n, o as r, n as t };
