var e = [
  { id: 1, minDays: 1, name: `Đốm lửa`, color: `#e8834a`, accent: `#ffd2a8` },
  { id: 2, minDays: 3, name: `Ngọn nến`, color: `#f0a040`, accent: `#ffe2b0` },
  { id: 3, minDays: 7, name: `Đèn dầu`, color: `#f3c15a`, accent: `#fff0c8` },
  { id: 4, minDays: 14, name: `Đèn lồng`, color: `#e4573d`, accent: `#ffc9a8` },
  { id: 5, minDays: 30, name: `Đèn hoa sen`, color: `#eb8fae`, accent: `#ffe0ea` },
  { id: 6, minDays: 49, name: `Đèn lưu ly`, color: `#6fc2a5`, accent: `#d8f5ea` },
  { id: 7, minDays: 100, name: `Đèn trường minh`, color: `#f6d27a`, accent: `#fffbe8` },
  { id: 8, minDays: 365, name: `Vô tận đăng`, color: `#fff1c9`, accent: `#ffffff` },
];
function t(e) {
  return typeof e == `number` && Number.isFinite(e) && e > 0 ? Math.floor(e) : 0;
}
function n(n) {
  let r = t(n),
    i = null;
  for (let t of e) r >= t.minDays && (i = t);
  return i;
}
function r(n) {
  let r = t(n);
  return e.find((e) => e.minDays > r) ?? null;
}
export { r as n, n as r, e as t };
