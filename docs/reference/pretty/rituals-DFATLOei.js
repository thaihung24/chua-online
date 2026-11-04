const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./pond-life-DdO9GjPO.js",
      "./rolldown-runtime-DK3Fl9T5.js",
      "./index-e_Bx6V48.js",
      "./preload-helper-CRzLMJPS.js",
      "./referral-CM6Fj8ux.js",
      "./dialog-DwXghOMX.js",
      "./index-C_1YXvDN.css",
      "./three-BbSp8N3g.js",
      "./progress-core-C9e35Hb5.js",
      "./lanterns-DsoFXr0b.js",
      "./sky-X0ndF2_S.js",
      "./layout-DpGLadzd.js",
      "./water-paths-DYM7yuBe.js",
      "./pond-life-lnQ82nvM.css",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { t } from "./preload-helper-CRzLMJPS.js";
import { n, o as r, r as i } from "./dialog-DwXghOMX.js";
import { Ft as a, N as o, Xt as s, gt as c } from "./index-e_Bx6V48.js";
import {
  $ as l,
  A as u,
  K as d,
  P as f,
  S as p,
  T as m,
  Z as h,
  b as g,
  dt as _,
  ft as v,
  k as y,
  l as b,
  w as x,
  y as S,
} from "./three-BbSp8N3g.js";
import { h as C, m as w, r as T, v as E, y as D } from "./lanterns-DsoFXr0b.js";
import { D as O, O as k, m as A, y as j } from "./layout-DpGLadzd.js";
import { P as M, nt as N } from "./app-z_oU8L_u.js";
import { D as P, E as F, O as I, _ as L, c as R, i as ee, l as te, w as ne } from "./water-paths-DYM7yuBe.js";
var re = e({
    MAX_YEAR: () => ie,
    MIN_YEAR: () => z,
    VIETNAM_UTC_OFFSET: () => 7,
    WEEKDAYS_VI: () => oe,
    canChiOfDay: () => je,
    canChiOfMonth: () => Ae,
    canChiOfYear: () => ke,
    daysInSolarMonth: () => de,
    deltaT: () => _e,
    jdnFromSolar: () => U,
    leapMonthOfYear: () => Oe,
    lunarMonthsOfYear: () => De,
    lunarToSolar: () => Pe,
    newMoonJd: () => be,
    noonInVietnam: () => he,
    solarFromJdn: () => ue,
    solarToLunar: () => Ne,
    sunLongitude: () => xe,
    vietnamDate: () => me,
    weekdayFromJdn: () => fe,
    weekdayName: () => pe,
  }),
  z = 1800,
  ie = 2200,
  B = [`Giáp`, `Ất`, `Bính`, `Đinh`, `Mậu`, `Kỷ`, `Canh`, `Tân`, `Nhâm`, `Quý`],
  ae = [`Tý`, `Sửu`, `Dần`, `Mão`, `Thìn`, `Tỵ`, `Ngọ`, `Mùi`, `Thân`, `Dậu`, `Tuất`, `Hợi`],
  oe = [`Chủ nhật`, `Thứ Hai`, `Thứ Ba`, `Thứ Tư`, `Thứ Năm`, `Thứ Sáu`, `Thứ Bảy`],
  V = Math.PI / 180,
  se = 2451545,
  ce = 29.530588861,
  le = 2451550.09766;
function H(e, t) {
  return ((e % t) + t) % t;
}
function U(e) {
  let t = Math.floor((14 - e.month) / 12),
    n = e.year + 4800 - t,
    r = e.month + 12 * t - 3;
  return (
    e.day +
    Math.floor((153 * r + 2) / 5) +
    365 * n +
    Math.floor(n / 4) -
    Math.floor(n / 100) +
    Math.floor(n / 400) -
    32045
  );
}
function ue(e) {
  let t = e + 32044,
    n = Math.floor((4 * t + 3) / 146097),
    r = t - Math.floor((146097 * n) / 4),
    i = Math.floor((4 * r + 3) / 1461),
    a = r - Math.floor((1461 * i) / 4),
    o = Math.floor((5 * a + 2) / 153);
  return {
    day: a - Math.floor((153 * o + 2) / 5) + 1,
    month: o + 3 - 12 * Math.floor(o / 10),
    year: 100 * n + i - 4800 + Math.floor(o / 10),
  };
}
function de(e, t) {
  return U({ year: t === 12 ? e + 1 : e, month: (t % 12) + 1, day: 1 }) - U({ year: e, month: t, day: 1 });
}
function fe(e) {
  return H(e + 1, 7);
}
function pe(e) {
  return oe[fe(e)] ?? `Chủ nhật`;
}
function me(e, t = 7) {
  let n = e.getTime();
  if (!Number.isFinite(n)) throw RangeError(`Ngày không hợp lệ.`);
  let r = new Date(n + t * 36e5);
  return { year: r.getUTCFullYear(), month: r.getUTCMonth() + 1, day: r.getUTCDate() };
}
function he(e) {
  return new Date(Date.UTC(e.year, e.month - 1, e.day, 5));
}
function ge(e) {
  let { year: t, month: n, day: r } = e;
  if (![t, n, r].every(Number.isInteger)) throw RangeError(`Ngày không hợp lệ.`);
  if (t < 1800 || t > 2200) throw RangeError(`Chỉ hỗ trợ năm ${z}-${ie}, nhận ${t}.`);
  if (n < 1 || n > 12 || r < 1 || r > de(t, n)) throw RangeError(`Ngày không tồn tại: ${r}/${n}/${t}.`);
}
function _e(e) {
  let t = e;
  if (t >= 1986 && t < 2005) {
    let e = t - 2e3;
    return (
      63.86 + 0.3345 * e - 0.060374 * e ** 2 + 0.0017275 * e ** 3 + 651814e-9 * e ** 4 + 2373599e-11 * e ** 5
    );
  }
  if (t >= 2005 && t < 2050) {
    let e = t - 2e3;
    return 62.92 + 0.32217 * e + 0.005589 * e ** 2;
  }
  return t >= 2050 && t < 2150
    ? -20 + 32 * ((t - 1820) / 100) ** 2 - 0.5628 * (2150 - t)
    : -20 + 32 * ((t - 1820) / 100) ** 2;
}
function ve(e) {
  return _e(2e3 + (e - se) / 365.25);
}
function ye(e) {
  let t = e / 1236.85,
    n = t * t,
    r = n * t,
    i = r * t,
    a = le + ce * e + 15437e-8 * n - 15e-8 * r + 73e-11 * i,
    o = 1 - 0.002516 * t - 74e-7 * n,
    s = (2.5534 + 29.1053567 * e - 14e-7 * n - 11e-8 * r) * V,
    c = (201.5643 + 385.81693528 * e + 0.0107582 * n + 1238e-8 * r - 58e-9 * i) * V,
    l = (160.7108 + 390.67050284 * e - 0.0016118 * n - 227e-8 * r + 11e-9 * i) * V,
    u = (124.7746 - 1.56375588 * e + 0.0020672 * n + 215e-8 * r) * V,
    d =
      -0.4072 * Math.sin(c) +
      0.17241 * o * Math.sin(s) +
      0.01608 * Math.sin(2 * c) +
      0.01039 * Math.sin(2 * l) +
      0.00739 * o * Math.sin(c - s) -
      0.00514 * o * Math.sin(c + s) +
      0.00208 * o * o * Math.sin(2 * s) -
      0.00111 * Math.sin(c - 2 * l) -
      57e-5 * Math.sin(c + 2 * l) +
      56e-5 * o * Math.sin(2 * c + s) -
      42e-5 * Math.sin(3 * c) +
      42e-5 * o * Math.sin(s + 2 * l) +
      38e-5 * o * Math.sin(s - 2 * l) -
      24e-5 * o * Math.sin(2 * c - s) -
      17e-5 * Math.sin(u) -
      7e-5 * Math.sin(c + 2 * s) +
      4e-5 * Math.sin(2 * c - 2 * l) +
      4e-5 * Math.sin(3 * s) +
      3e-5 * Math.sin(c + s - 2 * l) +
      3e-5 * Math.sin(2 * c + 2 * l) -
      3e-5 * Math.sin(c + s + 2 * l) +
      3e-5 * Math.sin(c - s + 2 * l) -
      2e-5 * Math.sin(c - s - 2 * l) -
      2e-5 * Math.sin(3 * c + s) +
      2e-5 * Math.sin(4 * c),
    f = [
      [299.77 + 0.107408 * e - 0.009173 * n, 325e-6],
      [251.88 + 0.016321 * e, 165e-6],
      [251.83 + 26.651886 * e, 164e-6],
      [349.42 + 36.412478 * e, 126e-6],
      [84.66 + 18.206239 * e, 11e-5],
      [141.74 + 53.303771 * e, 62e-6],
      [207.14 + 2.453732 * e, 6e-5],
      [154.84 + 7.30686 * e, 56e-6],
      [34.52 + 27.261239 * e, 47e-6],
      [207.19 + 0.121824 * e, 42e-6],
      [291.34 + 1.844379 * e, 4e-5],
      [161.72 + 24.198154 * e, 37e-6],
      [239.56 + 25.513099 * e, 35e-6],
      [331.55 + 3.592518 * e, 23e-6],
    ],
    p = 0;
  for (let [e, t] of f) p += t * Math.sin(e * V);
  return a + d + p;
}
function be(e) {
  let t = ye(e);
  return t - ve(t) / 86400;
}
function xe(e) {
  let t = (e + ve(e) / 86400 - se) / 36525,
    n = 280.46646 + 36000.76983 * t + 3032e-7 * t * t,
    r = (357.52911 + 35999.05029 * t - 1537e-7 * t * t) * V,
    i =
      (1.914602 - 0.004817 * t - 14e-6 * t * t) * Math.sin(r) +
      (0.019993 - 101e-6 * t) * Math.sin(2 * r) +
      289e-6 * Math.sin(3 * r),
    a = (125.04 - 1934.136 * t) * V;
  return H(n + i - 0.00569 - 0.00478 * Math.sin(a), 360);
}
var Se = new Map();
function W(e, t) {
  let n = `${t}:${e}`,
    r = Se.get(n);
  return (r === void 0 && ((r = Math.floor(be(e) + 0.5 + t / 24)), Se.set(n, r)), r);
}
function Ce(e, t) {
  return Math.floor(xe(e - 0.5 - t / 24) / 30);
}
function we(e, t) {
  let n = Math.floor((U({ year: e, month: 12, day: 31 }) - le) / ce);
  for (let e = n - 2; e <= n + 2; e += 1) {
    let n = Ce(W(e, t), t),
      r = H(Ce(W(e + 1, t), t) - n, 12),
      i = H(9 - n, 12);
    if (i >= 1 && i <= r) return e;
  }
  throw Error(`Không tìm được tháng chứa Đông chí năm ${e}.`);
}
var Te = new Map();
function G(e, t) {
  let n = `${t}:${e}`,
    r = Te.get(n);
  if (r) return r;
  let i = we(e, t),
    a = we(e + 1, t) - i;
  if (a !== 12 && a !== 13) throw Error(`Số tháng bất thường (${a}) năm ${e}.`);
  let o = -1;
  if (a === 13) {
    for (let e = 1; e < a; e += 1)
      if (Ce(W(i + e, t), t) === Ce(W(i + e + 1, t), t)) {
        o = e;
        break;
      }
    if (o < 0) throw Error(`Không tìm được tháng nhuận năm ${e}.`);
  }
  let s = [],
    c = 11;
  for (let n = 0; n < a; n += 1) {
    let r = n === o;
    n > 0 && !r && (c = (c % 12) + 1);
    let a = W(i + n, t);
    s.push({
      k: i + n,
      startJdn: a,
      length: W(i + n + 1, t) - a,
      month: c,
      leap: r,
      year: c >= 11 ? e : e + 1,
    });
  }
  return (Te.set(n, s), s);
}
function Ee(e) {
  return {
    year: e.year,
    month: e.month,
    leap: e.leap,
    start: ue(e.startJdn),
    length: e.length,
    startJdn: e.startJdn,
  };
}
function De(e, t = 7) {
  if (e < 1801 || e > 2199) throw RangeError(`Chỉ hỗ trợ năm 1801-2199, nhận ${e}.`);
  let n = G(e - 1, t).filter((t) => t.year === e),
    r = G(e, t).filter((t) => t.year === e);
  return [...n, ...r].map(Ee);
}
function Oe(e, t = 7) {
  let n = De(e, t).find((e) => e.leap);
  return n ? n.month : null;
}
function ke(e) {
  return `${B[H(e + 6, 10)]} ${ae[H(e + 8, 12)]}`;
}
function Ae(e, t) {
  return `${B[H(e * 12 + t + 3, 10)]} ${ae[H(t + 1, 12)]}`;
}
function je(e) {
  return `${B[H(e + 9, 10)]} ${ae[H(e + 1, 12)]}`;
}
function Me(e, t) {
  let n = e instanceof Date ? me(e, t) : e;
  return (ge(n), n);
}
function Ne(e, t = 7) {
  let n = Me(e, t),
    r = U(n),
    i = G(n.year, t),
    a = i[0];
  (!a || r < a.startJdn) && (i = G(n.year - 1, t));
  let o = i.find((e) => r >= e.startJdn && r < e.startJdn + e.length);
  if (!o) throw Error(`Không xác định được tháng âm lịch của ${r}.`);
  return {
    day: r - o.startJdn + 1,
    month: o.month,
    year: o.year,
    leap: o.leap,
    daysInMonth: o.length,
    canChi: { year: ke(o.year), month: Ae(o.year, o.month), day: je(r) },
  };
}
function Pe(e, t, n, r = !1, i = 7) {
  if (![e, t, n].every(Number.isInteger) || t < 1 || t > 12 || n < 1 || n > 30) return null;
  if (e < 1801 || e > 2199) throw RangeError(`Chỉ hỗ trợ năm 1801-2199, nhận ${e}.`);
  let a = G(t >= 11 ? e : e - 1, i).find((n) => n.month === t && n.leap === r && n.year === e);
  return !a || n > a.length ? null : ue(a.startJdn + n - 1);
}
var Fe = e({
  dayKey: () => Le,
  dayStride: () => ze,
  indexForDay: () => Be,
  pickForDay: () => Ve,
  vietnamDay: () => Ie,
});
function Ie(e) {
  return me(new Date(e));
}
function Le(e) {
  let t = (e, t = 2) => String(e).padStart(t, `0`);
  return `${t(e.year, 4)}-${t(e.month)}-${t(e.day)}`;
}
function Re(e, t) {
  return t === 0 ? e : Re(t, e % t);
}
function ze(e) {
  if (e <= 1) return 1;
  let t = Math.max(1, Math.floor(e * 0.38));
  for (; Re(t, e) !== 1;) t++;
  return t;
}
function Be(e, t, n = 0) {
  return e <= 0 ? 0 : (((U(t) * ze(e) + n) % e) + e) % e;
}
function Ve(e, t, n = 0) {
  return e[Be(e.length, t, n)];
}
var He = e({
    LANTERN_INTENT: () => K,
    LANTERN_INTENTS: () => Y,
    LANTERN_INTENT_COUNT: () => 6,
    LANTERN_INTENT_MASK: () => 7,
    LANTERN_PLACE: () => q,
    LANTERN_PLACE_COUNT: () => 3,
    LANTERN_PLACE_IDS: () => We,
    LANTERN_PLACE_LABELS: () => Ue,
    LANTERN_PLACE_MASK: () => 192,
    LANTERN_PLACE_SHIFT: () => 6,
    LANTERN_STYLE_COUNT: () => 1,
    LANTERN_STYLE_MASK: () => 48,
    LANTERN_STYLE_SHIFT: () => 4,
    LANTERN_TEXT_MAX: () => 120,
    isLanternIntent: () => X,
    isLanternPlace: () => Ge,
    lanternCode: () => Ke,
    lanternIntentInfo: () => Ye,
    lanternIntentOf: () => Z,
    lanternPlaceOf: () => Je,
    lanternStyleOf: () => qe,
  }),
  K = { CAU_AN: 0, CAU_SIEU: 1, SUC_KHOE: 2, GIA_DAO: 3, HOC_HANH: 4, TUY_TAM: 5 },
  q = { AO_SEN: 0, HO_BAN_NGUYET: 1, SUOI: 2 },
  Ue = { [q.AO_SEN]: `Ao sen`, [q.HO_BAN_NGUYET]: `Hồ bán nguyệt`, [q.SUOI]: `Suối Giếng ngọc` },
  We = { [q.AO_SEN]: `ao-sen`, [q.HO_BAN_NGUYET]: `ho-ban-nguyet`, [q.SUOI]: `suoi` },
  J = (e, t, n) => ({
    code: e,
    label: t,
    rgb: n,
    css: `rgb(${n.map((e) => Math.round(e * 255)).join(` `)})`,
  }),
  Y = [
    J(K.CAU_AN, `Cầu an`, [0.97, 0.76, 0.3]),
    J(K.CAU_SIEU, `Cầu siêu`, [0.85, 0.84, 0.98]),
    J(K.SUC_KHOE, `Sức khỏe`, [0.5, 0.82, 0.62]),
    J(K.GIA_DAO, `Gia đạo`, [0.96, 0.58, 0.7]),
    J(K.HOC_HANH, `Học hành`, [0.47, 0.72, 0.95]),
    J(K.TUY_TAM, `Tùy tâm`, [0.95, 0.52, 0.28]),
  ];
function X(e) {
  return Number.isInteger(e) && e >= 0 && e < 6;
}
function Ge(e) {
  return Number.isInteger(e) && e >= 0 && e < 3;
}
function Ke(e, t = 0, n = 0) {
  let r = X(e) ? e : K.CAU_AN,
    i = Number.isInteger(t) && t > 0 && t < 4 ? t : 0;
  return ((Ge(n) ? n : q.AO_SEN) << 6) | (i << 4) | r;
}
function Z(e) {
  let t = e & 7;
  return t < 6 ? t : K.TUY_TAM;
}
function qe(e) {
  let t = (e & 48) >> 4;
  return t < 1 ? t : 0;
}
function Je(e) {
  let t = (e & 192) >> 6;
  return Ge(t) ? t : q.AO_SEN;
}
function Ye(e) {
  return Y[Z(e)];
}
var Xe = e({ TEACHINGS: () => Ze, teachingForDay: () => Qe }),
  Ze =
    `Thở vào, biết mình đang thở vào. Thở ra, biết mình đang thở ra. Chỉ vậy thôi cũng đã là một buổi tu.(Một nụ cười dịu dàng buổi sáng có thể làm đổi màu cả ngày, của bạn và của người đối diện.(Điều đang xảy ra lúc này là nơi duy nhất ta có thể sống. Hãy nhẹ nhàng trở về với nó.(Mọi thứ đều đổi thay. Biết vậy, ta bớt bám víu và biết trân trọng hơn những gì đang có.(Lời đã nói ra như nước đổ đi. Trước khi nói, hãy dừng lại một hơi thở.(Giận dữ như cầm than hồng trong tay: người bị bỏng trước tiên là chính mình.(Bố thí không cần của cải lớn. Một lời hỏi han chân thành cũng là một món quà.(Biết đủ là giàu. Biết ơn là cách nhanh nhất để thấy mình đã có rất nhiều.(Nếu cha mẹ còn, đó là một phúc lớn: hôm nay hãy gọi một cuộc điện thoại hoặc nói một lời cảm ơn. Nếu các cụ đã khuất, hãy thầm nhớ ơn và hồi hướng lòng lành.(Hoa sen mọc lên từ bùn. Khó khăn hôm nay có thể là phù sa của một ngày nở hoa.(Hãy đi chậm lại. Mỗi bước chân đặt xuống là một lần ta về nhà.(Tâm như mặt ao: khi lặng thì thấy được tận đáy. Đừng vội khuấy, cứ để nước tự trong.(Việc nhỏ làm trọn vẹn cũng là tu. Khi làm gì, hãy chỉ làm việc đó.(Tha thứ không phải để người kia nhẹ lòng, mà để mình được đặt gánh nặng xuống.(Người khác không cần hoàn hảo để ta thương. Ta cũng không cần hoàn hảo để được thương.(Nghe cho trọn rồi hãy trả lời. Đôi khi người ta chỉ cần được lắng nghe.(Mỗi ngày gieo một hạt thiện, dù nhỏ. Rồi sẽ có ngày bạn nhìn thấy cả một khu vườn.(Thân thể làm việc không ngừng vì ta. Hôm nay hãy đối xử với nó dịu dàng hơn.(Khi buồn, cứ để mình buồn một chút rồi nhẹ nhàng thở. Cảm xúc đến rồi sẽ đi, như mây qua trời.(Không cần đợi hoàn cảnh hoàn hảo mới bắt đầu tu. Chỗ nào có hơi thở, chỗ đó có thể thực tập.(Thấy lỗi của mình trước khi thấy lỗi của người là một bước tiến nhỏ mà vững.(Ăn một bữa cơm thật chậm: nhìn, ngửi, nhai. Bát cơm bình thường cũng là một phép màu.(Giữ lời hứa dù nhỏ. Chữ tín được xây từ những điều bé nhất.(Lòng từ bắt đầu bằng việc mong cho chính mình bình an, rồi mở rộng ra người thân, người lạ và cả người mình chưa thương.(Mỗi sáng thức dậy là được tặng thêm một ngày. Hãy nhận món quà ấy bằng lòng biết ơn.(Lời ái ngữ chẳng tốn gì, nhưng mang lại rất nhiều.(Bạn không phải là những suy nghĩ của mình. Hãy nhìn chúng đến rồi đi, như nhìn khách qua cổng.(Có những điều ta không đổi được. Chấp nhận chúng là bước đầu của bình an.(Hãy sống sao cho tối nay nằm xuống, lòng được nhẹ.(Giúp một người đúng lúc quý hơn giúp thật nhiều khi người ta đã không còn cần.(Trước khi phán xét ai, hãy nhớ rằng họ cũng đang vất vả theo cách riêng của họ.(Khi tâm tán loạn, hãy đếm hơi thở từ một đến mười. Hết mười lại về một, không cần vội.(Một câu niệm Phật nhẹ nhàng giúp tâm có chỗ nương, bớt lo âu.(Thắp một nén hương là thắp lên lòng thành; lòng thành quan trọng hơn nén hương lớn hay nhỏ.(Đừng so sánh con đường của mình với con đường của người khác. Mỗi người đi một nhịp.(Hạnh phúc không ở đâu xa: ly trà ấm, tiếng chim buổi sớm, một người thân bên cạnh.(Biết dừng đúng lúc là một thứ trí tuệ. Nghỉ ngơi cũng là một phần của tu tập.(Nhìn ai cũng thấy có điều đáng quý, ta sẽ ít khi bị phiền lòng vì họ.(Khi bị chê trách, xem có điều gì đáng học. Phần còn lại, nhẹ nhàng buông.(Làm điều thiện không cần ai thấy. Hạt giống gieo âm thầm vẫn nảy mầm.(Kiên nhẫn là tình thương dành cho chính mình và cho người.(Hãy để hôm nay đủ với hôm nay. Lo cho ngày mai bằng cách sống tử tế từ bây giờ.(Tiếng chuông chùa nhắc ta: dừng lại, thở một hơi rồi hãy đi tiếp.(Mỗi người ta gặp đều là một người thầy, dạy ta kiên nhẫn, hiểu biết hay buông bỏ.(Nói ít đi một chút, nghe nhiều hơn một chút, tâm sẽ yên hơn một chút.(Việc nhỏ làm bằng lòng tốt vẫn là việc lớn trong mắt người nhận.(Quá khứ đã qua, tương lai chưa tới. Chỉ có hơi thở này là có thật.(Ánh sáng không cần ồn ào. Một ngọn nến nhỏ cũng đủ làm ấm cả căn phòng tối.(Mỗi lần vấp ngã là một lần học cách đứng dậy nhẹ nhàng hơn.(Lòng biết ơn biến những gì ta đã có thành đủ đầy.(Hoa sen không vội nở. Việc tốt cũng cần thời gian, cứ chăm chút mỗi ngày.(Ở bên người thân, hãy đặt điện thoại xuống một lát và nhìn vào mắt họ.(Đừng tiếc một lời xin lỗi chân thành, và cũng đừng ngại đón nhận lời xin lỗi của người khác.(Sống đơn giản không phải là thiếu thốn, mà là bớt đi những gì không cần.(Nỗi khổ là có thật, nhưng cách ta ôm lấy nó quyết định ta phải chịu bao nhiêu.(Người trước mặt cũng muốn bình an và hạnh phúc, giống như ta.(Đêm xuống, hãy nhớ lại ba điều tốt đẹp của hôm nay, dù rất nhỏ, rồi hãy đi ngủ.(Hãy nhìn vào điều mình đã làm được hôm nay, thay vì điều mình chưa làm được.(Một hạt gạo cũng đến từ công sức của rất nhiều người. Ăn cơm trong lòng biết ơn.(Yên tĩnh không phải là không có tiếng động, mà là có một khoảng lặng trong lòng.(Hãy cho mình quyền được bắt đầu lại, bao nhiêu lần cũng được.(Cây có gốc, nước có nguồn. Nhớ ơn tổ tiên và những người đã nâng đỡ mình giúp lòng ta mềm lại.(Khi bước qua cổng chùa, hãy để lại phía sau những bận tâm, dù chỉ trong chốc lát.(Bình tĩnh không phải là không có sóng, mà là biết mình đang đứng vững khi sóng đến.(Tử tế với bản thân không phải ích kỷ. Có lòng từ với mình mới có lòng từ với người.(Mỗi ngày một việc thiện nhỏ quý hơn một việc lớn chỉ làm một lần.(Ngắm một đóa hoa, nghe một tiếng chim: cuộc sống đang mời ta tỉnh thức.(Làm gì cũng nhẹ tay, nói gì cũng nhẹ lời, đời bớt đi nhiều va chạm.(Hôm nay, hãy thử làm một việc tốt mà không để ai biết.(Khi lo lắng kéo đến, đặt một tay lên ngực và thở ba hơi thật chậm.(Có mặt trọn vẹn với một người là món quà quý hơn mọi lời khuyên.(Hãy nhìn thật kỹ: bông hoa tàn hôm nay từng là nụ non. Mọi thứ đều đang đi qua, và đẹp theo cách của nó.(Một cái cúi đầu khiêm tốn làm lòng mình nhẹ đi trước khi làm người khác vui.`.split(
      `(`,
    );
function Qe(e) {
  return Ve(Ze, e, 7);
}
var $e = [
  { month: 1, day: 1, name: `Tết Nguyên Đán` },
  { month: 1, day: 15, name: `Rằm tháng Giêng (Thượng Nguyên)` },
  { month: 2, day: 8, name: `Ngày Đức Phật xuất gia` },
  { month: 2, day: 15, name: `Ngày Đức Phật nhập Niết bàn` },
  { month: 2, day: 19, name: `Vía Quán Thế Âm (đản sinh)` },
  { month: 4, day: 15, name: `Lễ Phật Đản` },
  { month: 6, day: 19, name: `Vía Quán Thế Âm (thành đạo)` },
  { month: 7, day: 15, name: `Lễ Vu Lan` },
  { month: 9, day: 19, name: `Vía Quán Thế Âm (xuất gia)` },
  { month: 10, day: 15, name: `Rằm tháng Mười (Hạ Nguyên)` },
  { month: 11, day: 17, name: `Vía Phật A Di Đà` },
  { month: 12, day: 8, name: `Ngày Đức Phật thành đạo` },
];
function et(e) {
  let t = [];
  if (
    (e.day === 1 && t.push({ kind: `mung-mot`, label: `Hôm nay là mùng một` }),
    e.day === 15 && t.push({ kind: `ram`, label: `Hôm nay là ngày rằm` }),
    !e.leap)
  )
    for (let n of $e) n.month === e.month && n.day === e.day && t.push({ kind: `le`, label: n.name });
  return t;
}
function tt(e) {
  return e.day < 15
    ? { kind: `ram`, inDays: 15 - e.day }
    : { kind: `mung-mot`, inDays: e.daysInMonth - e.day + 1 };
}
function nt(e) {
  let t = e.kind === `ram` ? `rằm` : `mùng một`;
  return e.inDays === 1 ? `Ngày mai là ${t}` : `Còn ${e.inDays} ngày nữa là ${t}`;
}
var rt = e({ clearWishes: () => gt }),
  it = `chua-online:wishes`,
  at = `chua-online:wishes-tree`,
  ot = { lantern: it, tree: at },
  st = 120,
  ct = { lantern: null, tree: null };
function lt(e) {
  let t = e
      .normalize(`NFC`)
      .replace(/[\p{Cc}\p{Cf}]/gu, ` `)
      .replace(/\p{Default_Ignorable_Code_Point}/gu, ``)
      .replace(/\s+/gu, ` `)
      .trim(),
    n = Array.from(t);
  return n.length <= st ? t : n.slice(0, st).join(``).trimEnd();
}
function ut() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function dt(e) {
  if (!Array.isArray(e)) return [];
  let t = [];
  for (let n of e) {
    if (typeof n != `object` || !n) continue;
    let { text: e, intent: r, at: i } = n;
    if (typeof e != `string` || typeof i != `number` || !Number.isFinite(i)) continue;
    let a = lt(e);
    a.length !== 0 && t.push({ text: a, intent: X(r) ? r : K.TUY_TAM, at: i });
  }
  return t.slice(-50);
}
function ft(e, t) {
  let n = ct[t];
  if (n) return n.map((e) => ({ ...e }));
  if (!e) return [];
  try {
    let n = e.getItem(ot[t]);
    return n === null ? [] : dt(JSON.parse(n));
  } catch {
    return [];
  }
}
function pt(e, t, n) {
  if (e)
    try {
      (t.length === 0 ? e.removeItem(ot[n]) : e.setItem(ot[n], JSON.stringify(t)), (ct[n] = null));
      return;
    } catch {}
  ct[n] = t.map((e) => ({ ...e }));
}
function mt(e, t, n = Date.now(), r = ut(), i = `lantern`) {
  let a = lt(e);
  if (a.length === 0) return null;
  let o = { text: a, intent: X(t) ? t : K.TUY_TAM, at: Number.isFinite(n) ? n : Date.now() };
  return (pt(r, [...ft(r, i), o].slice(-50), i), { ...o });
}
function ht(e = ut(), t = `lantern`) {
  return ft(e, t).reverse();
}
function gt(e = ut()) {
  if (((ct.lantern = null), (ct.tree = null), e))
    for (let t of [it, at])
      try {
        e.removeItem(t);
      } catch {}
}
var _t = e({ closeOpenModal: () => bt, mountModal: () => xt }),
  vt = `button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href], [tabindex="0"]`,
  yt = null;
function bt() {
  yt?.isConnected && n(yt);
}
function xt(e) {
  bt();
  let t = document.activeElement instanceof HTMLElement ? document.activeElement : null,
    a = document.createElement(`dialog`);
  ((a.className = e.className),
    a.setAttribute(`aria-labelledby`, e.labelledBy),
    e.describedBy && a.setAttribute(`aria-describedby`, e.describedBy),
    (a.innerHTML = e.html));
  let o = () => n(a),
    s = () => o();
  return (
    a.addEventListener(`close`, () => {
      (e.signal?.removeEventListener(`abort`, s),
        a.remove(),
        yt === a && (yt = null),
        t?.isConnected && t.focus({ preventScroll: !0 }),
        e.onClosed?.());
    }),
    a.addEventListener(`keydown`, (e) => {
      if (e.key !== `Tab`) return;
      let t = Array.from(a.querySelectorAll(vt)).filter((e) => !e.closest(`[hidden]`)),
        n = t[0],
        r = t[t.length - 1];
      if (!n || !r) return;
      let i = document.activeElement,
        o = !a.contains(i);
      e.shiftKey && (i === n || o)
        ? (e.preventDefault(), r.focus())
        : !e.shiftKey && (i === r || o) && (e.preventDefault(), n.focus());
    }),
    i(a),
    (yt = a),
    document.body.append(a),
    r(a),
    e.signal?.aborted ? o() : e.signal?.addEventListener(`abort`, s, { once: !0 }),
    {
      dialog: a,
      close: o,
      ref(e) {
        return a.querySelector(`[data-ref="${e}"]`);
      },
    }
  );
}
var St = e({
    LANTERN_DONE_TOAST: () => Et,
    LANTERN_PRIVACY: () => Tt,
    LANTERN_TITLE: () => wt,
    closeLanternDialog: () => jt,
    lanternDoneToast: () => Ot,
    lanternTitle: () => Dt,
    openLanternDialog: () => Nt,
    wishDate: () => At,
    wishLength: () => Mt,
    wishesHeading: () => kt,
  }),
  Ct = `(max-height: 560px)`,
  wt = `Thả đèn hoa đăng`,
  Tt = `Lời nguyện chỉ lưu trên máy này — không gửi đi, không ai khác đọc được. Mọi người chỉ thấy một ngọn đèn sáng mang màu ý nguyện bạn chọn. Bạn có thể xóa trong Cài đặt.`,
  Et = `Đèn của bạn đang trôi trên ao sen.`;
function Dt(e = q.AO_SEN) {
  return Ge(e) && e !== q.AO_SEN ? `${wt} · ${Ue[e]}` : wt;
}
function Ot(e = q.AO_SEN) {
  return e === q.HO_BAN_NGUYET
    ? `Đèn của bạn đang trôi trên hồ bán nguyệt.`
    : e === q.SUOI
      ? `Đèn của bạn đang xuôi theo suối Giếng ngọc.`
      : Et;
}
var kt = (e) => `Lời nguyện đã thả (${e})`;
function At(e) {
  let t = new Date(e);
  if (Number.isNaN(t.getTime())) return ``;
  let n = (e) => String(e).padStart(2, `0`);
  return `${n(t.getDate())}/${n(t.getMonth() + 1)}/${t.getFullYear()}`;
}
var jt = bt;
function Mt(e) {
  return Array.from(e.normalize(`NFC`)).length;
}
function Nt(e = {}) {
  let t = e.now ?? Date.now,
    n = e.book ?? `lantern`,
    r = e.copy ?? {
      title: Dt(e.place),
      privacy: `Lời nguyện chỉ lưu trên máy này — không gửi đi, không ai khác đọc được. Mọi người chỉ thấy một ngọn đèn sáng mang màu ý nguyện bạn chọn. Bạn có thể xóa trong Cài đặt.`,
      placeholder: `Ví dụ: Nguyện cho gia đình con bình an.`,
      chips: `Ý nguyện của ngọn đèn`,
      go: `Thả đèn`,
      history: kt,
    },
    i = null,
    a = null,
    o = () => {},
    s = new Promise((e) => {
      o = e;
    }),
    {
      dialog: l,
      close: u,
      ref: d,
    } = xt({
      className: `lantern-dlg`,
      labelledBy: `lantern-title`,
      describedBy: `lantern-privacy`,
      signal: e.signal,
      onClosed: () => {
        (a?.(), o(i));
      },
      html: `
    <form class="lantern-dlg__card" novalidate>
      <header class="lantern-dlg__head">
        <h2 id="lantern-title" class="lantern-dlg__title" tabindex="-1" data-ref="title">${r.title}</h2>
        <button type="button" class="lantern-dlg__close" data-ref="close" aria-label="Đóng">${c(`close`)}</button>
      </header>
      <p id="lantern-privacy" class="lantern-dlg__privacy">${r.privacy}</p>
      <div class="lantern-dlg__field">
        <label class="lantern-dlg__label" for="lantern-text">Lời nguyện của bạn <span class="lantern-dlg__optional">(không bắt buộc)</span></label>
        <textarea id="lantern-text" class="lantern-dlg__text" data-ref="text" rows="3" maxlength="120" autocomplete="off" placeholder="${r.placeholder}" aria-describedby="lantern-count"></textarea>
        <p id="lantern-count" class="lantern-dlg__count" data-ref="count"></p>
      </div>
      <div class="lantern-dlg__chips" role="radiogroup" aria-labelledby="lantern-intent-label" data-ref="chips">
        <span id="lantern-intent-label" class="lantern-dlg__label lantern-dlg__chips-label">${r.chips}</span>
      </div>
      <details class="lantern-dlg__history" data-ref="history" hidden>
        <summary class="lantern-dlg__history-sum" data-ref="historySum"></summary>
        <ul class="lantern-dlg__wishes" data-ref="wishes"></ul>
      </details>
      <footer class="lantern-dlg__actions">
        <button type="button" class="lantern-dlg__btn" data-ref="later">Để sau</button>
        <button type="submit" class="lantern-dlg__btn lantern-dlg__btn--go" data-ref="go">${c(`lamp`)}<span>${r.go}</span></button>
      </footer>
      <p class="lantern-dlg__sr" role="status" aria-live="polite" data-ref="live"></p>
    </form>`,
    }),
    f = l.querySelector(`form`),
    p = d(`text`),
    m = d(`count`),
    h = d(`live`),
    g = d(`chips`),
    _ = window.visualViewport,
    v = () => {
      let e = _,
        t = e ? window.innerHeight - e.height > 120 : !1;
      ((l.style.top = e && t ? `${e.offsetTop + 8}px` : ``),
        (l.style.bottom = t ? `auto` : ``),
        (l.style.maxHeight = e && t ? `${e.height - 16}px` : ``));
    },
    y = typeof matchMedia == `function` ? matchMedia(Ct) : null,
    b = () => {
      p.rows = y?.matches ? 2 : 3;
    };
  b();
  let x = y !== null && typeof y.addEventListener == `function` ? y : null;
  (_ || x) &&
    (_?.addEventListener(`resize`, v),
    _?.addEventListener(`scroll`, v),
    x?.addEventListener(`change`, b),
    (a = () => {
      (_?.removeEventListener(`resize`, v),
        _?.removeEventListener(`scroll`, v),
        x?.removeEventListener(`change`, b));
    }),
    l.isConnected || a());
  let S = X(e.initialIntent) ? e.initialIntent : K.CAU_AN,
    C = Y.map((e) => {
      let t = document.createElement(`button`);
      ((t.type = `button`),
        (t.className = `lantern-dlg__chip`),
        t.setAttribute(`role`, `radio`),
        (t.dataset.intent = String(e.code)),
        t.style.setProperty(`--dot`, e.css));
      let n = document.createElement(`span`);
      ((n.className = `lantern-dlg__dot`), n.setAttribute(`aria-hidden`, `true`));
      let r = document.createElement(`span`);
      return ((r.textContent = e.label), t.append(n, r), g.append(t), t);
    }),
    w = (e, t) => {
      ((S = e),
        C.forEach((n, r) => {
          let i = r === e;
          (n.setAttribute(`aria-checked`, String(i)),
            (n.tabIndex = i ? 0 : -1),
            i && t && n.focus({ preventScroll: !0 }));
        }));
    };
  (C.forEach((e, t) => {
    (e.addEventListener(`click`, () => w(t, !1)),
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
            : e.key === `End` && (r = C.length - 1)
          : (r = (t + n + C.length) % C.length),
          r < 0 || (e.preventDefault(), w(r, !0)));
      }));
  }),
    w(S, !1));
  let T = -1,
    E = () => {
      let e = Mt(p.value),
        t = 120 - e;
      ((m.textContent = `${e}/120`), (m.dataset.near = String(t <= 20)));
      let n = t <= 0 ? 0 : t <= 10 ? 10 : t <= 20 ? 20 : -1;
      n !== T && ((T = n), (h.textContent = n === 0 ? `Đã đủ 120 ký tự.` : n > 0 ? `Còn ${n} ký tự.` : ``));
    };
  (p.addEventListener(`input`, E), E());
  let D = d(`history`),
    O = d(`wishes`),
    k = ht(e.storage, n);
  if (k.length > 0) {
    d(`historySum`).textContent = r.history(k.length);
    for (let e of k) {
      let t = document.createElement(`li`);
      t.className = `lantern-dlg__wish`;
      let n = document.createElement(`span`);
      ((n.className = `lantern-dlg__wish-meta`),
        (n.textContent = [At(e.at), Y[e.intent]?.label ?? `Tùy tâm`].filter(Boolean).join(` · `)));
      let r = document.createElement(`span`);
      ((r.className = `lantern-dlg__wish-text`), (r.textContent = e.text), t.append(n, r), O.append(t));
    }
    D.hidden = !1;
  }
  let A = () => {
    if (i) return;
    let r = lt(p.value);
    (r.length > 0 && e.saveOnSubmit !== !1 && mt(r, S, t(), e.storage, n),
      (i = { intent: S, text: r, hasText: r.length > 0 }),
      u());
  };
  (f.addEventListener(`submit`, (e) => {
    (e.preventDefault(), A());
  }),
    d(`later`).addEventListener(`click`, u),
    d(`close`).addEventListener(`click`, u),
    p.addEventListener(`keydown`, (e) => {
      e.key === `Enter` && (e.ctrlKey || e.metaKey) && (e.preventDefault(), A());
    }));
  let j = typeof matchMedia == `function` && matchMedia(`(pointer: coarse)`).matches;
  return (l.isConnected && (j ? d(`title`).focus({ preventScroll: !0 }) : p.focus({ preventScroll: !0 })), s);
}
var Q = (e, t, n) => ({ id: e, title: t, text: n }),
  Pt = `Lời nhắc tu tập — không phải bói toán`,
  Ft = [
    Q(`q01`, `Ba hơi thở`, `Trước mỗi cuộc gọi hay cuộc họp hôm nay, hãy thở ba hơi thật chậm.`),
    Q(`q02`, `Lời nói dịu`, `Hôm nay, thử nói chậm lại và nhẹ hơn một chút với người thân trong nhà.`),
    Q(`q03`, `Ba điều biết ơn`, `Trước khi đi ngủ, nghĩ đến hoặc viết ra ba điều bạn biết ơn.`),
    Q(`q04`, `Niệm Phật`, `Dành năm phút niệm một câu danh hiệu Phật, chậm rãi theo nhịp thở.`),
    Q(`q05`, `Lắng nghe`, `Hôm nay, hãy nghe ai đó nói trọn câu rồi mới trả lời.`),
    Q(`q06`, `Một bữa ăn chậm`, `Ăn một bữa thật chậm, không điện thoại, không màn hình.`),
    Q(`q07`, `Đặt điện thoại xuống`, `Đặt điện thoại xuống mười phút và chỉ ngồi yên.`),
    Q(`q08`, `Lời cảm ơn`, `Nói lời cảm ơn với một người mà bạn vẫn thường quên cảm ơn.`),
    Q(`q09`, `Hỏi thăm cha mẹ`, `Hỏi thăm cha mẹ, ông bà hay một bậc cao niên hôm nay.`),
    Q(`q10`, `Chờ ba hơi thở`, `Nếu hôm nay thấy giận ai, hãy thở ba hơi rồi hãy trả lời.`),
    Q(`q11`, `Việc thiện thầm lặng`, `Làm một việc tốt nhỏ mà không cần ai biết.`),
    Q(`q12`, `Bước chân chánh niệm`, `Đi bộ năm phút thật chậm, biết từng bước chân chạm đất.`),
    Q(`q13`, `Dọn một góc nhỏ`, `Dọn gọn một góc bàn hay một ngăn kéo, làm thư thả, không vội.`),
    Q(
      `q14`,
      `Chúc bình an`,
      `Nếu lòng đã sẵn sàng, hãy nghĩ về một người từng làm bạn buồn và thầm chúc họ bình an.`,
    ),
    Q(`q15`, `Phút im lặng`, `Dành vài phút im lặng trước khi bắt đầu ngày mới.`),
    Q(`q16`, `Ngước nhìn trời`, `Ngước nhìn bầu trời một lần hôm nay và thở thật sâu.`),
    Q(`q17`, `Một ly trà`, `Pha một ly trà hay rót một ly nước, uống từng ngụm với sự chú tâm.`),
    Q(`q18`, `Lời thật, lời nhẹ`, `Hôm nay, nói đúng sự thật nhưng bằng những lời nhẹ nhàng.`),
    Q(`q19`, `Cho thân nghỉ`, `Cho cơ thể nghỉ một lát: duỗi vai, thả lỏng cổ, buông lỏng đôi tay.`),
    Q(`q20`, `Hồi hướng`, `Cuối ngày, hồi hướng phước lành của hôm nay đến tất cả chúng sinh.`),
    Q(`q21`, `Ngắm một bông hoa`, `Ngắm một bông hoa hay một cái cây cho đến khi thấy nó thật rõ.`),
    Q(`q22`, `Lời khen chân thành`, `Khen một người thật lòng hôm nay, dù chỉ về điều rất nhỏ.`),
    Q(`q23`, `Mong bạn bình an`, `Gặp ai vội vã hay cáu kỉnh, hãy thầm nghĩ: mong bạn được bình an.`),
    Q(`q24`, `Tiếng chuông nhắc`, `Khi nghe một tiếng chuông hay một thông báo, dừng lại và thở một hơi.`),
    Q(
      `q25`,
      `Hiền với chính mình`,
      `Hôm nay, nói với chính mình một câu hiền như nói với một người bạn thân.`,
    ),
    Q(`q26`, `Tắt màn hình sớm`, `Tối nay, tắt màn hình sớm hơn thường lệ mười lăm phút.`),
    Q(`q27`, `Gấp lại một lo lắng`, `Viết một nỗi lo ra giấy, gấp lại và để ngày mai tính.`),
    Q(
      `q28`,
      `Nhớ người làm ra bữa cơm`,
      `Trước khi ăn, dừng một nhịp để nhớ đến những người đã làm ra bữa ăn này.`,
    ),
    Q(`q29`, `Làm gì cũng nhẹ tay`, `Hôm nay, đóng cửa, đặt cốc, đặt đồ vật xuống nhẹ tay hơn thường lệ.`),
    Q(`q30`, `Đếm hơi thở`, `Ngồi thẳng lưng và đếm hơi thở từ một đến mười, ba lượt.`),
    Q(`q31`, `Bớt một việc`, `Bỏ bớt một việc không thật cần thiết khỏi danh sách hôm nay.`),
    Q(`q32`, `Mỉm cười đầu ngày`, `Mỉm cười nhẹ ngay khi vừa mở mắt buổi sáng.`),
    Q(`q33`, `Một tin hỏi thăm`, `Nhắn một tin hỏi thăm người bạn đã lâu chưa liên lạc.`),
    Q(`q34`, `Từng việc một`, `Hôm nay, làm từng việc một. Xong việc này mới sang việc khác.`),
    Q(
      `q35`,
      `Gọi tên cảm xúc`,
      `Khi có cảm xúc mạnh, gọi tên nó trong lòng, như "à, mình đang lo", rồi thở.`,
    ),
    Q(`q36`, `Chia sẻ`, `Chia một món đồ, một bữa ăn hay một chút thời gian cho người đang cần.`),
    Q(`q37`, `Một đoạn kinh`, `Đọc chậm một đoạn kinh hay một bài kệ ngắn rồi ngồi yên một phút.`),
    Q(`q38`, `Nhường đường`, `Khi ra đường, hãy nhường một người và đừng vội.`),
    Q(`q39`, `Chạm vào thiên nhiên`, `Bước ra ngoài một lát, chạm vào lá cây hay hít mùi đất ẩm.`),
    Q(`q40`, `Một lời xin lỗi`, `Nếu có điều khiến bạn áy náy, hôm nay hãy thử nói một lời xin lỗi.`),
    Q(`q41`, `Ba lạy`, `Lạy Phật ba lạy thật chậm và nhớ đến những người thương.`),
    Q(`q42`, `Rửa bát, quét nhà`, `Khi rửa bát hay quét nhà, chỉ biết mình đang rửa bát, đang quét nhà.`),
    Q(
      `q43`,
      `Năm điều đang thấy`,
      `Giữa chiều, dừng tay một phút, nhìn quanh và nhận ra năm điều bạn đang thấy.`,
    ),
    Q(`q44`, `Nhớ ơn người giúp`, `Nhớ đến một người đã giúp bạn lúc khó khăn và thầm cảm ơn họ.`),
    Q(`q45`, `Bớt than phiền`, `Hôm nay, đổi một lời than phiền thành một lời mong cho điều tốt hơn.`),
    Q(`q46`, `Chờ đợi cũng là nghỉ`, `Khi phải chờ đợi, xem đó là phút nghỉ: thở nhẹ và thả lỏng vai.`),
    Q(
      `q47`,
      `Năm phút ngồi yên`,
      `Ngồi yên năm phút, chỉ biết hơi thở vào ra; tâm đi đâu thì nhẹ nhàng đưa về.`,
    ),
    Q(
      `q48`,
      `Trở về hiện tại`,
      `Nếu lòng cứ quay về chuyện cũ, nhẹ nhàng nói: đã qua rồi, và trở lại với hơi thở.`,
    ),
  ];
function It(e) {
  return Ve(Ft, e, 3);
}
function Lt(e) {
  return Ft.find((t) => t.id === e) ?? null;
}
var Rt = e({
    QUE_KEY: () => zt,
    QUE_SETTLE_MS: () => 400,
    REST_YESTERDAY_TEXT: () => Gt,
    STREAK_RESTART_TEXT: () => Wt,
    buildToday: () => Ht,
    isStreakRestart: () => Kt,
    openTodayCard: () => tn,
    previousDayKey: () => qt,
    readQueDraw: () => Zt,
    resetQueMemory: () => $t,
    restedYesterday: () => Jt,
    saveQueDraw: () => Qt,
    streakMessage: () => Ut,
  }),
  zt = `chua-online:que`,
  Bt = (e) => String(e).padStart(2, `0`);
function Vt(e, t) {
  return `${e === 1 ? `Giêng` : e === 12 ? `Chạp` : String(e)}${t ? ` nhuận` : ``}`;
}
function Ht(e) {
  let t = Ie(e),
    n = Ne(t);
  return {
    dateKey: Le(t),
    solarText: `${pe(U(t))}, ${Bt(t.day)}/${Bt(t.month)}/${t.year}`,
    lunar: n,
    lunarText: `Âm lịch: ngày ${n.day} tháng ${Vt(n.month, n.leap)}, năm ${n.canChi.year}`,
    tags: et(n),
    nextText: nt(tt(n)),
    teaching: Qe(t),
    que: It(t),
  };
}
function Ut(e) {
  let t = Number.isFinite(e) ? Math.max(0, Math.floor(e)) : 0;
  return t === 0
    ? `Hôm nay mình bắt đầu bằng một câu niệm Phật nhé, không cần vội.`
    : t === 1
      ? `Một ngày công phu. Nhẹ nhàng và đều đặn là đủ.`
      : t < 7
        ? `${t} ngày công phu liên tiếp. Nhẹ nhàng và đều đặn là đủ.`
        : `${t} ngày công phu liên tiếp, thật đáng quý. Có hôm nghỉ cũng không sao, ngày mai mình lại bắt đầu.`;
}
var Wt = `Chùa luôn mở cửa. Hôm nay mình bắt đầu lại nhé.`,
  Gt = `Hôm qua chùa giữ chỗ cho bạn.`;
function Kt(e, t) {
  return (e <= 0 && t > 0) || (e === 1 && t > 1);
}
function qt(e) {
  let [t, n, r] = e.split(`-`).map(Number);
  return new Date(Date.UTC(t, n - 1, r - 1)).toISOString().slice(0, 10);
}
function Jt(e, t) {
  return e !== null && e === qt(t);
}
var Yt = null;
function Xt() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function Zt(e, t = Xt()) {
  let n = Yt;
  if (!n && t)
    try {
      let e = t.getItem(zt);
      n = e === null ? null : JSON.parse(e);
    } catch {
      n = null;
    }
  if (typeof n != `object` || !n) return null;
  let { day: r, id: i } = n;
  return r !== e || typeof i != `string` ? null : Lt(i);
}
function Qt(e, t, n = Xt()) {
  let r = { day: e, id: t.id };
  if (n)
    try {
      (n.setItem(zt, JSON.stringify(r)), (Yt = null));
      return;
    } catch {}
  Yt = r;
}
function $t() {
  Yt = null;
}
function en() {
  return typeof matchMedia == `function` && matchMedia(`(prefers-reduced-motion: reduce)`).matches;
}
function tn(e = {}) {
  let t = e.now ?? Date.now,
    n = Ht(t()),
    r,
    i = Zt(n.dateKey, e.storage),
    a = !1,
    {
      dialog: s,
      close: l,
      ref: u,
    } = xt({
      className: `today-card`,
      labelledBy: `today-title`,
      signal: e.signal,
      onClosed: () => {
        (clearTimeout(r), e.onClose?.());
      },
      html: `
    <div class="today-card__card">
      <header class="today-card__head">
        <h2 id="today-title" class="today-card__title" tabindex="-1" data-ref="title">Hôm nay</h2>
        <button type="button" class="today-card__close" data-ref="close" aria-label="Đóng">${c(`close`)}</button>
      </header>
      <section class="today-card__date" aria-label="Ngày hôm nay">
        <p class="today-card__solar" data-ref="solar"></p>
        <p class="today-card__lunar" data-ref="lunar"></p>
        <ul class="today-card__tags" data-ref="tags" aria-label="Ngày đặc biệt"></ul>
        <p class="today-card__next" data-ref="next"></p>
      </section>
      <section class="today-card__streak" data-ref="streak" aria-label="Chuỗi ngày công phu">
        <span class="today-card__streak-icon" aria-hidden="true">${c(`lotus`, { size: 22 })}</span>
        <div>
          <p class="today-card__streak-num" data-ref="streak-num"></p>
          <p class="today-card__streak-text" data-ref="streak-text"></p>
        </div>
      </section>
      <section class="today-card__tasks" data-ref="tasks" hidden>
        <button type="button" class="today-card__tasks-btn" data-ref="tasks-btn">
          <span class="today-card__tasks-text" data-ref="tasks-text"></span><span class="today-card__tasks-sep"> · </span><span class="today-card__tasks-go">Xem hành trình</span>
          ${c(`chevron-right`, { size: 18 })}
        </button>
      </section>
      <section class="today-card__teaching" aria-labelledby="today-teaching-h">
        <h3 id="today-teaching-h" class="today-card__h">Một lời cho hôm nay</h3>
        <p class="today-card__quote" data-ref="teaching"></p>
      </section>
      <section class="today-card__que" aria-labelledby="today-que-h">
        <h3 id="today-que-h" class="today-card__h">Gieo quẻ</h3>
        <p class="today-card__que-label">${Pt}</p>
        <button type="button" class="today-card__draw" data-ref="draw">
          <span class="today-card__draw-glyph" data-ref="glyph" aria-hidden="true">${c(`sparkle`, { size: 26 })}</span>
          <span class="today-card__draw-text">
            <span class="today-card__draw-title" data-ref="draw-title">Chạm để nhận lời nhắc</span>
            <span class="today-card__draw-sub" data-ref="draw-sub">Một việc nhỏ để làm hôm nay</span>
          </span>
        </button>
        <div class="today-card__result" role="status" aria-live="polite" tabindex="-1" data-ref="result" hidden>
          <p class="today-card__result-title" data-ref="result-title"></p>
          <p class="today-card__result-text" data-ref="result-text"></p>
          <p class="today-card__result-foot" data-ref="result-foot"></p>
        </div>
      </section>
    </div>`,
    });
  ((u(`solar`).textContent = n.solarText), (u(`lunar`).textContent = n.lunarText));
  let d = u(`tags`);
  n.tags.length === 0 && (d.hidden = !0);
  for (let e of n.tags) {
    let t = document.createElement(`li`);
    ((t.className = `today-card__tag`), (t.dataset.kind = e.kind), (t.textContent = e.label), d.append(t));
  }
  ((u(`next`).textContent = n.nextText), (u(`teaching`).textContent = n.teaching));
  let f = u(`streak`),
    p = null,
    m = e.progress ?? null;
  if (m) p = Number.isFinite(m.streak) ? Math.max(0, Math.floor(m.streak)) : 0;
  else if (e.store)
    try {
      p = e.store.streak();
    } catch {
      p = null;
    }
  if (p === null) f.hidden = !0;
  else {
    u(`streak-num`).textContent = p > 0 ? `Chuỗi công phu: ${p} ngày` : `Chuỗi công phu`;
    let e = Ut(p);
    (m &&
      (Kt(p, Math.floor(m.best) || 0) && (e = Wt), Jt(m.restUsedOn, o(new Date(t()))) && (e = `${e} ${Gt}`)),
      (u(`streak-text`).textContent = e));
  }
  if (m) {
    let e = Math.min(3, Math.max(0, Math.floor(m.tasksDone) || 0));
    ((u(`tasks`).hidden = !1),
      (u(`tasks-text`).textContent = `Việc hôm nay ${e}/3`),
      u(`tasks-btn`).addEventListener(`click`, () => {
        (l(), m.open());
      }));
  }
  let h = u(`draw`),
    g = u(`glyph`),
    _ = u(`result`),
    v = (e, t) => {
      ((u(`result-title`).textContent = e.title),
        (u(`result-text`).textContent = e.text),
        (u(`result-foot`).textContent = t
          ? `Mỗi ngày một lời nhắc. Mai mình gặp lại nhé.`
          : `Hôm nay bạn đã nhận lời nhắc rồi. Mai mình gặp lại nhé.`),
        (_.dataset.fresh = String(t)),
        (h.hidden = !0),
        (_.hidden = !1),
        t && _.focus({ preventScroll: !0 }));
    };
  i && v(i, !1);
  let y = () => {
    ((a = !1),
      g.classList.remove(`is-settling`),
      (i = n.que),
      Qt(n.dateKey, i, e.storage),
      v(i, !0),
      e.onDraw?.(i));
  };
  return (
    h.addEventListener(`click`, () => {
      a ||
        i ||
        ((a = !0),
        en()
          ? y()
          : (h.setAttribute(`aria-busy`, `true`),
            (u(`draw-title`).textContent = `Đang chọn lời nhắc…`),
            (u(`draw-sub`).textContent = `Một hơi thở nhẹ…`),
            g.classList.add(`is-settling`),
            (r = setTimeout(y, 400))));
    }),
    u(`close`).addEventListener(`click`, l),
    s.isConnected && u(`title`).focus({ preventScroll: !0 }),
    { element: s, close: l }
  );
}
function nn() {
  return (
    typeof window < `u` &&
    typeof window.matchMedia == `function` &&
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  );
}
var rn = class {
  constructor() {
    (a(this, `pos`, []), a(this, `vert`, []), a(this, `idx`, []));
  }
  vertex(e, t, n, r, i, a, o) {
    return (this.pos.push(e, t, n), this.vert.push(r, i, a, o), this.pos.length / 3 - 1);
  }
  tri(e, t, n) {
    this.idx.push(e, t, n);
  }
  quad(e, t, n, r) {
    (this.tri(e, t, n), this.tri(e, n, r));
  }
  build() {
    let e = new b();
    return (
      e.setAttribute(`position`, new p(this.pos, 3)),
      e.setAttribute(`aVert`, new p(this.vert, 4)),
      e.setIndex(this.idx),
      e
    );
  }
};
function an(e, t, n, r, i, a = 0) {
  let o = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([o, s]) => (a > 0 ? e.vertex(n + o * a, r, i + s * a, t, 0, o, s) : e.vertex(n, r, i, t, 0, o, s)));
  e.quad(o[0], o[1], o[2], o[3]);
}
var on = e({
    AO_SEN_VIEW_M: () => 16,
    DRIFT_CALM_SPEED: () => sn,
    GOLDEN_ANGLE: () => un,
    LANTERN_GROW: () => pn,
    LANTERN_INTENT: () => K,
    LANTERN_INTENTS: () => Y,
    LANTERN_INTENT_COUNT: () => 6,
    LANTERN_INTENT_MASK: () => 7,
    LANTERN_NEAR_M: () => Gn,
    LANTERN_PLACE: () => q,
    LANTERN_PLACE_IDS: () => We,
    LANTERN_STYLE_MASK: () => 48,
    LANTERN_STYLE_SHIFT: () => 4,
    POND_LANTERN_FADE_SEC: () => 14,
    POND_LANTERN_LIFE_SEC: () => 150,
    POND_LANTERN_MAX: () => ln,
    RELEASE_WAIT_MAX: () => 24,
    createLanternPlaces: () => Jn,
    createPondGaze: () => ir,
    createPondLanterns: () => Un,
    lanternCode: () => Ke,
    lanternIntentOf: () => Z,
    lanternPlaceOf: () => Je,
    lanternPlaceOfSpot: () => Wn,
    lanternStyleOf: () => qe,
    lanternTarget: () => Kn,
    lotusLanternGeometry: () => Dn,
    placeGaze: () => er,
    placeLanternDeps: () => $n,
    pondSlots: () => xn,
    prepareDrifts: () => Zn,
    walkThen: () => tr,
  }),
  sn = 0.25,
  cn = [0, 2, 1],
  ln = { low: 12, medium: 24, high: 24 },
  un = Math.PI * (3 - Math.sqrt(5)),
  dn = 2.5,
  fn = 0.28,
  pn = 1.2,
  mn = fn * pn,
  hn = 0.14,
  gn = 0.17,
  _n = 0.1,
  vn = 0.726,
  yn = 0.45,
  bn = 0.3;
function xn(e, t, n = [], r) {
  let i = Math.max(0.2, e.r - vn),
    a = n.reduce((e, t) => {
      let n = t.r + mn + gn + _n;
      return e + n * n;
    }, 0),
    o = Math.max(0.25, 1 - a / (i * i)),
    s = 1;
  if (r) {
    let t = 0;
    for (let n = 0; n < 256; n++) {
      let a = i * Math.sqrt((n + 0.5) / 256),
        o = n * un;
      r(e.x + Math.cos(o) * a, e.z + Math.sin(o) * a) && t++;
    }
    s = Math.max(0.1, t / 256);
  }
  let c = Math.ceil(t / (o * s)),
    l = [];
  for (let a = 0; l.length < t && a < c * 4; a++) {
    let t = i * Math.sqrt((Math.min(a, c - 1) + 0.5) / c),
      o = a * un,
      s = e.x + Math.cos(o) * t,
      u = e.z + Math.sin(o) * t;
    n.some((e) => Math.hypot(s - e.x, u - e.z) < e.r + mn + gn + _n) ||
      (r !== void 0 && !r(s, u)) ||
      l.push({ x: s, z: u });
  }
  return l;
}
var Sn = 0,
  Cn = 1,
  wn = 2,
  Tn = 3;
function En(e, t) {
  for (let n = 0; n < t.n; n++) {
    let r = t.phase + (n / t.n) * w,
      i = Math.cos(r),
      a = Math.sin(r),
      o = [];
    for (let n = 0; n <= t.rows; n++) {
      let r = n / t.rows,
        s = t.rIn + (t.rOut - t.rIn) * (t.bend < 1 ? r ** 0.8 : r),
        c = t.yIn + (t.yOut - t.yIn) * r ** +t.bend,
        l = t.half * Math.sin(Math.PI * Math.min(1, 0.18 + 0.82 * r)) ** 0.8,
        u = i * s,
        d = a * s,
        f = t.crown * Math.sin(Math.PI * r),
        p = e.vertex(u + a * l, c, d - i * l, Sn, r, t.ring, -1),
        m = e.vertex(u, c + f, d, Sn, r, t.ring, 0),
        h = e.vertex(u - a * l, c, d + i * l, Sn, r, t.ring, 1);
      o.push([p, m, h]);
    }
    for (let n = 0; n < t.rows; n++) {
      let [t, r, i] = o[n],
        [a, s, c] = o[n + 1];
      (e.quad(t, r, s, a), e.quad(r, i, c, s));
    }
  }
}
function Dn(e) {
  let t = e === `low`,
    n = new rn();
  (an(n, Tn, 0, 0.006, 0, 0.8), an(n, wn, 0, hn, 0));
  let r = t ? 8 : 12,
    i = n.vertex(0, 0.03, 0, Sn, 0, 0, 0),
    a = [];
  for (let e = 0; e < r; e++) {
    let t = (e / r) * w;
    a.push(n.vertex(Math.cos(t) * 0.19, 0.012, Math.sin(t) * 0.19, Sn, 0.1, 0, 1));
  }
  for (let e = 0; e < r; e++) n.tri(i, a[(e + 1) % r], a[e]);
  (En(n, {
    n: t ? 6 : 8,
    rIn: 0.05,
    rOut: fn,
    yIn: 0.03,
    yOut: 0.11,
    half: 0.09,
    rows: t ? 3 : 4,
    bend: 1.5,
    crown: 0.014,
    phase: 0,
    ring: 0,
  }),
    En(n, {
      n: t ? 5 : 6,
      rIn: 0.035,
      rOut: 0.17,
      yIn: 0.05,
      yOut: 0.17,
      half: 0.07,
      rows: t ? 3 : 4,
      bend: 0.75,
      crown: 0.01,
      phase: Math.PI / (t ? 5 : 6),
      ring: 1,
    }));
  let o = t ? 4 : 5,
    s = [
      [0.07, 0],
      [0.09, 0.034],
      [0.125, 0.042],
      [0.17, 0.027],
      [0.235, 0],
    ],
    c = s.map(([e, t], r) => {
      let i = r / (s.length - 1);
      if (r === s.length - 1 || r === 0) return [n.vertex(0, e, 0, Cn, i, 0, 0)];
      let a = [];
      for (let r = 0; r < o; r++) {
        let s = (r / o) * w;
        a.push(n.vertex(Math.cos(s) * t, e, Math.sin(s) * t, Cn, i, 0, 0));
      }
      return a;
    });
  for (let e = 0; e < c.length - 1; e++) {
    let t = c[e],
      r = c[e + 1];
    for (let e = 0; e < o; e++) {
      let i = (e + 1) % o;
      t.length === 1
        ? n.tri(t[0], r[i], r[e])
        : r.length === 1
          ? n.tri(t[e], t[i], r[0])
          : (n.tri(t[e], t[i], r[i]), n.tri(t[e], r[i], r[e]));
    }
  }
  return n.build();
}
var On = `
attribute vec4 aVert;
attribute vec3 aTint;
attribute vec4 aState;
uniform float uTime;
uniform float uFlicker;
uniform float uHalo;
varying vec4 vVert;
varying vec3 vTint;
varying vec4 vState;

void main() {
  vVert = aVert;
  vTint = aTint;
  vState = aState;
  float kind = aVert.x;
  vec3 p = position;
  if (kind > 0.5 && kind < 1.5) {
    // Ngọn lửa lay: kéo dài rồi thu hẹp, mỗi ngọn một pha.
    float f = uFlicker * (0.10 * sin(uTime * 11.0 + aState.z) + 0.06 * sin(uTime * 23.0 + aState.z * 2.3)
      + 0.04 * sin(uTime * 6.7 + aState.z * 0.7));
    p.y = 0.07 + (p.y - 0.07) * (1.0 + f);
    p.xz *= 1.0 - 0.5 * f;
  }
  if (kind > 1.5 && kind < 2.5) {
    // Quầng luôn quay mặt về camera: dựng trong không gian nhìn, tỉ lệ theo kích thước của đèn.
    float s = length(instanceMatrix[0].xyz);
    vec4 mv = modelViewMatrix * (instanceMatrix * vec4(p, 1.0));
    mv.xy += aVert.zw * (uHalo * s);
    gl_Position = projectionMatrix * mv;
  } else {
    gl_Position = projectionMatrix * modelViewMatrix * (instanceMatrix * vec4(p, 1.0));
  }
}
`,
  kn = `
uniform float uNight;
uniform float uTime;
uniform float uFlicker;
varying vec4 vVert;
varying vec3 vTint;
varying vec4 vState;

void main() {
  float kind = vVert.x;
  float grad = vVert.y;
  float fade = vState.x;
  float mine = vState.y;
  vec3 warm = vec3(1.0, 0.72, 0.38);
  if (kind < 0.5) {
    // Cánh sen bằng giấy màu: ban ngày sáng dần về đầu cánh; ban đêm được ngọn lửa rọi từ trong,
    // gốc cánh ấm và sáng nhất.
    float ring = vVert.z;
    float side = vVert.w;
    vec3 paper = vTint * (0.82 + 0.26 * grad);
    paper = mix(paper, vec3(1.0), 0.2 * grad);
    paper *= 1.0 - 0.1 * abs(side);
    float lit = (1.0 - grad) * 0.8 + 0.3 + 0.16 * ring;
    vec3 glow = mix(paper, warm * (0.55 + 0.45 * vTint), 0.38 * (1.0 - grad)) * (0.6 + 0.85 * lit);
    // Ban ngày: giấy sáng và đậm màu hơn (nắng không làm xỉn giấy), mép và chân cánh sẫm để từng cánh tách
    // khỏi nhau và khỏi mặt nước xanh; ngọn lửa ở giữa rọi ấm lên cánh trong.
    vec3 day = vTint * (0.94 + 0.28 * grad);
    day = mix(vec3(dot(day, vec3(0.299, 0.587, 0.114))), day, 1.3);
    day = mix(day, vec3(1.0), 0.12 * grad + 0.1 * ring);
    day *= 1.0 - 0.24 * side * side - 0.16 * (1.0 - grad) * (1.0 - ring);
    day = mix(day, warm, 0.22 * ring * (1.0 - grad));
    vec3 col = mix(day, glow, uNight);
    col *= 1.0 + 0.24 * mine * (0.6 + 0.4 * uNight);
    gl_FragColor = vec4(col * fade, fade);
  } else if (kind < 1.5) {
    // Ngọn lửa phát sáng ngày lẫn đêm: lõi trắng ấm, đầu cam; đêm sáng vượt ngưỡng cho quầng cộng lên.
    vec3 col = mix(vec3(1.0, 0.98, 0.8), vec3(1.0, 0.5, 0.1), grad);
    col *= 1.12 + 0.4 * uNight;
    gl_FragColor = vec4(col * fade, fade);
  } else {
    // Quầng (2) và vệt sáng trên nước (3): cộng sáng thuần (alpha 0 trong chế độ nhân sẵn). Ban ngày quầng chỉ
    // còn ánh ấm quanh ngọn lửa, còn vệt nước hoá thành bóng tối nhẹ dưới đèn (alpha > 0 làm tối nền).
    float r = length(vVert.zw);
    float a = pow(max(1.0 - r, 0.0), 2.2);
    float flick = 1.0 + uFlicker * (0.06 * sin(uTime * 1.9 + vState.z) + 0.03 * sin(uTime * 4.3 + vState.z * 2.1));
    bool halo = kind < 2.5;
    float dayGlow = halo ? 0.2 : 0.0;
    float gain = (dayGlow + (1.0 - dayGlow) * uNight) * (halo ? 0.6 : 0.34) * (1.0 + 0.4 * mine) * flick * fade;
    vec3 col = mix(warm, vTint, 0.4);
    float shade = halo ? 0.0 : (1.0 - uNight) * 0.5 * a * fade;
    gl_FragColor = vec4(col * a * gain, shade);
  }
}
`;
function An(e) {
  let t = new h({
    uniforms: e,
    vertexShader: On,
    fragmentShader: kn,
    transparent: !0,
    premultipliedAlpha: !0,
    depthWrite: !1,
    side: 2,
    forceSinglePass: !0,
    fog: !1,
  });
  return ((t.name = `pond-lanterns`), t);
}
var jn = 1.6,
  Mn = 1.2,
  Nn = new f(),
  Pn = new d(),
  Fn = new g(),
  In = new v(),
  Ln = new v(),
  Rn = { x: 0, z: 0 },
  zn = new f(),
  Bn = new x(),
  Vn = new l(new v(), Mn),
  Hn = new v();
function Un(e) {
  let { pond: t, quality: n } = e,
    r = ln[n],
    i = e.waterY ?? 0.21,
    a = t.r / 3.7,
    o = e.avoid ?? [{ x: t.x + 1.2 * a, z: t.z - 0.9 * a, r: 0.95 * a }],
    s = e.drift ?? null,
    c = s ? [] : xn(t, r, o, e.shape),
    d = e.now ?? (() => (typeof performance < `u` ? performance.now() : Date.now())),
    f = e.calm ?? nn(),
    p = Dn(n),
    m = new y(new Float32Array(r * 3), 3),
    h = new y(new Float32Array(r * 4), 4);
  (m.setUsage(S), h.setUsage(S), p.setAttribute(`aTint`, m), p.setAttribute(`aState`, h));
  let g = {
      uTime: { value: 0 },
      uFlicker: { value: f ? 0.25 : 1 },
      uHalo: { value: 0.68 },
      uNight: T.uLanternNight,
    },
    _ = An(g),
    b = new u(p, _, r);
  ((b.name = `pond-lanterns`),
    (b.count = 0),
    (b.visible = !1),
    b.instanceMatrix.setUsage(S),
    (b.renderOrder = 4),
    (b.boundingSphere = new l(new v(t.x, i + hn, t.z), t.r + 1.5)));
  let x = e.viewDistance ?? 1 / 0,
    E = [],
    O = 0,
    k = !1,
    A = (e) => {
      let n = new Set(E.map((e) => e.slot)),
        r = null;
      if (e) {
        let n = e.x - t.x,
          i = e.z - t.z,
          a = Math.hypot(n, i),
          o = a > 0.001 ? Math.max(0.2, t.r - vn) / a : 0;
        r = { x: t.x + (n * yn - i * bn) * o, z: t.z + (i * yn + n * bn) * o };
      }
      let i = -1,
        a = -1 / 0;
      for (let e = 0; e < c.length; e++) {
        if (n.has(e)) continue;
        let o = c[e],
          s;
        if (r) s = -Math.hypot(o.x - r.x, o.z - r.z);
        else if (E.length === 0) s = -Math.abs(Math.hypot(o.x - t.x, o.z - t.z) - 0.65 * t.r);
        else {
          s = 1 / 0;
          for (let e of E) {
            let t = c[e.slot];
            s = Math.min(s, Math.hypot(o.x - t.x, o.z - t.z));
          }
        }
        s > a && ((a = s), (i = e));
      }
      return i;
    },
    j = (e) => {
      let t = c[e.slot],
        n = O,
        r = e.phase;
      ((e.x =
        t.x +
        _n * Math.sin(n * 0.05) +
        gn * (0.7 * Math.sin(n * 0.21 + r) + 0.3 * Math.sin(n * 0.53 + r * 2.1))),
        (e.z =
          t.z +
          _n * Math.cos(n * 0.043) +
          gn * (0.7 * Math.sin(n * 0.17 + r * 1.7) + 0.3 * Math.sin(n * 0.47 + r * 0.6))));
    },
    M = () => (f ? sn : 1),
    N = d(),
    P = (e) => (e.push === 0 ? 1 : D(0, 1, (N - e.pushAt) / (jn * 1e3))),
    F = (e) => s.releaseTime + e.delay + e.push * P(e) + M() * e.age,
    I = (e) => s.releaseTime + e.delay + e.push + M() * e.age,
    L = (e, t) => {
      let n = s.releaseTime + M() * e.age,
        r = e.delay + e.push * P(e),
        i = t - n,
        a = n + r >= 0 && e.shown > 0;
      ((e.delay = a ? r : i), (e.push = a && Math.abs(i - r) > 1e-6 ? i - r : 0), (e.pushAt = N));
    },
    R = (e, t = -1) => {
      let n = s,
        r = { lane: 0, time: -1 / 0 };
      for (let i of t >= 0 ? [t, ...cn] : cn) {
        if (i >= n.spec.lanes.length) continue;
        let a = e;
        for (let e = 0; e <= E.length; e++) {
          let e = !1;
          for (let t of E) {
            let r = n.gapTime[Math.abs(i - t.lane)] ?? 0;
            if (r <= 0) continue;
            let o = I(t);
            Math.abs(a - o) < r - 1e-9 && ((a = o - r), (e = !0));
          }
          if (!e) break;
        }
        if ((a > r.time && (r = { lane: i, time: a }), i === t && a >= e)) break;
      }
      return r;
    },
    ee = (e, t, n = -1) => {
      let r = R(t, n);
      ((e.lane = r.lane), L(e, r.time), E.push(e));
    },
    te = (e, t) => {
      let n = s,
        r = 0,
        i = 1 / 0;
      for (let e of cn) {
        if (e >= n.spec.lanes.length) continue;
        let a = 0;
        for (let r of E) {
          let i = n.gapTime[Math.abs(e - r.lane)] ?? 0;
          a += Math.max(0, i - Math.abs(I(r) - t));
        }
        a < i - 1e-9 && ((i = a), (r = e));
      }
      let a = E.filter((e) => I(e) >= t).sort((e, t) => I(e) - I(t)),
        o = E.filter((e) => I(e) < t).sort((e, t) => I(t) - I(e));
      ((E.length = 0), (e.lane = r), L(e, t), E.push(e));
      for (let e of a) {
        let t = I(e);
        for (let r = 0; r <= E.length; r++) {
          let r = !1;
          for (let i of E) {
            let a = n.gapTime[Math.abs(e.lane - i.lane)] ?? 0,
              o = I(i);
            a > 0 && Math.abs(t - o) < a - 1e-9 && ((t = o + a), (r = !0));
          }
          if (!r) break;
        }
        (t > I(e) + 1e-9 && L(e, t), E.push(e));
      }
      for (let e of o) ee(e, I(e), e.lane);
    },
    ne = (e) => (s ? Math.min(e.shown, Math.max(0, F(e)) / M()) : e.shown),
    re = (e) => {
      let t = s,
        n = f ? 0 : Math.sin(e.age * 0.23 + e.phase),
        r = F(e);
      (t.place(r, e.lane, n, Rn), (e.x = Rn.x), (e.z = Rn.z), (e.s = t.sAt(r)));
    },
    z = () => {
      let e = d();
      N = e;
      for (let t = E.length - 1; t >= 0; t--) {
        let n = E[t],
          r = Math.max(0, (e - n.bornAt) / 1e3);
        ((n.shown = r),
          (n.age = n.age0 + r),
          s && n.push !== 0 && P(n) >= 1 && ((n.delay += n.push), (n.push = 0)),
          (n.age >= 150 || (s && F(n) >= s.endTime)) && E.splice(t, 1));
      }
    },
    ie = () => {
      if (s) {
        let e = 1 / 0,
          t = -1 / 0,
          n = 1 / 0,
          r = -1 / 0;
        for (let i of E)
          F(i) < 0 ||
            ((e = Math.min(e, i.x)), (t = Math.max(t, i.x)), (n = Math.min(n, i.z)), (r = Math.max(r, i.z)));
        if (e > t) return !1;
        let a = b.boundingSphere;
        (a.center.set((e + t) / 2, i + hn, (n + r) / 2), (a.radius = Math.hypot(t - e, r - n) / 2 + Mn));
      } else if (E.length === 0) return !1;
      let t = e.camera;
      if (!t) {
        for (let e of E) e.near = 1;
        return !0;
      }
      (t.updateMatrixWorld(),
        Hn.setFromMatrixPosition(t.matrixWorld),
        zn.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse),
        Bn.setFromProjectionMatrix(zn));
      let n = !1;
      for (let e of E)
        if (((e.near = s && F(e) < 0 ? 0 : 1), e.near !== 0)) {
          if (!e.mine) {
            let t = Math.hypot(e.x - Hn.x, e.z - Hn.z);
            if (((e.near = 1 - D(x - 2, x, t)), e.near <= 0)) continue;
          }
          (Vn.center.set(e.x, i + hn, e.z), Bn.intersectsSphere(Vn) && (n = !0));
        }
      return n;
    },
    B = (e) => {
      ((b.visible = ie()), b.visible && ae(e));
    },
    ae = (e) => {
      b.count = E.length;
      let t = s ? s.endTime : 1 / 0;
      for (let n = 0; n < E.length; n++) {
        let r = E[n],
          a = Y[r.intent] ?? Y[5],
          o = Math.max(D(136, 150, r.age), s ? D(t - 14 * M(), t, F(r)) : 0),
          c = D(0, dn, ne(r)),
          l = C(c * (1 - o) * r.near, 0, 1),
          u = (0.55 + 0.45 * c) * (1 - 0.45 * o) * (r.mine ? 1.12 : 1) * pn,
          d = +!f,
          p =
            (s?.spec.surfaceY ? s.spec.surfaceY(r.s) : i) +
            0.012 -
            (1 - c) * 0.03 +
            d * 0.011 * Math.sin(e * 1.3 + r.phase * 1.3);
        (Fn.set(
          d * 0.035 * Math.sin(e * 0.9 + r.phase),
          r.phase + (f ? 0 : O * 0.03),
          d * 0.035 * Math.cos(e * 0.8 + r.phase * 0.7),
        ),
          Pn.setFromEuler(Fn),
          In.set(r.x, p, r.z),
          Ln.setScalar(u),
          Nn.compose(In, Pn, Ln),
          b.setMatrixAt(n, Nn),
          m.setXYZ(n, a.rgb[0], a.rgb[1], a.rgb[2]),
          h.setXYZW(n, l, +!!r.mine, r.phase, 0));
      }
      ((b.instanceMatrix.needsUpdate = !0), (m.needsUpdate = !0), (h.needsUpdate = !0));
    };
  return {
    object: b,
    add(e) {
      if (k) return !1;
      let t = Number.isFinite(e.ageSec) ? C(e.ageSec, 0, 65535) : 0;
      if (t >= 150) return !1;
      z();
      let n = e.mine === !0,
        i = Z(e.code),
        a = s ? s.releaseTime + M() * t : 0;
      if (E.length >= r) {
        let e = -1;
        if (s) {
          if (!n && R(a).time < 0) return !1;
          for (let t = 0; t < E.length; t++) {
            let n = I(E[t]);
            n < 0 && (e < 0 || n < I(E[e])) && (e = t);
          }
        }
        if (e < 0) {
          e = 0;
          for (let t = 1; t < E.length; t++) E[t].age > E[e].age && (e = t);
          if (t >= E[e].age && !(s && n)) return !1;
        }
        E.splice(e, 1);
      }
      if (s) {
        let e = {
          slot: -1,
          intent: i,
          mine: n,
          age0: t,
          bornAt: d(),
          age: t,
          shown: 0,
          phase: (i * 0.7 * un) % w,
          x: 0,
          z: 0,
          lane: 0,
          delay: 0,
          push: 0,
          pushAt: 0,
          s: 0,
          near: 1,
        };
        n ? te(e, a) : ee(e, a);
        for (let e of E) re(e);
        return (B(g.uTime.value), !0);
      }
      let o = A(
        n && Number.isFinite(e.viewX) && Number.isFinite(e.viewZ) ? { x: e.viewX, z: e.viewZ } : null,
      );
      if (o < 0) return !1;
      let c = (o * un) % w,
        l = {
          slot: o,
          intent: i,
          mine: n,
          age0: t,
          bornAt: d(),
          age: t,
          shown: 0,
          phase: c,
          x: 0,
          z: 0,
          lane: -1,
          delay: 0,
          push: 0,
          pushAt: 0,
          s: 0,
          near: 1,
        };
      return (j(l), E.push(l), B(g.uTime.value), !0);
    },
    update(e, t) {
      if (k) return;
      let n = C(Number.isFinite(e) ? e : 0, 0, 0.25);
      if (((g.uTime.value = t), E.length === 0)) b.visible &&= ((b.count = 0), !1);
      else {
        if ((f || (O += n), z(), s)) for (let e of E) re(e);
        else if (!f) for (let e of E) j(e);
        B(t);
      }
    },
    setCalm(e) {
      if (s && e !== f) {
        z();
        let t = E.map(F);
        ((f = e),
          E.forEach((e, n) => {
            e.delay += t[n] - F(e);
          }));
      }
      ((f = e), (g.uFlicker.value = e ? 0.25 : 1));
    },
    count: () => E.length,
    lanterns: () => {
      if ((z(), s)) for (let e of E) re(e);
      return E.map((e) => {
        let t = { x: e.x, z: e.z, intent: e.intent, ageSec: e.age, mine: e.mine };
        return s ? { ...t, lane: e.lane, pathTime: F(e) } : t;
      });
    },
    dispose() {
      k || ((k = !0), (E.length = 0), b.removeFromParent(), p.dispose(), _.dispose(), b.dispose());
    },
  };
}
function Wn(e) {
  return e === `pond-front` ? q.HO_BAN_NGUYET : e === `pond-stream` ? q.SUOI : q.AO_SEN;
}
var Gn = { [q.AO_SEN]: 8, [q.HO_BAN_NGUYET]: 4, [q.SUOI]: 4 };
function Kn(e, t, n, r = !1) {
  let i = n ?? { id: `pond`, ...k };
  if (!n) {
    let n = 1 / 0;
    for (let r of e) {
      let e = Math.hypot(r.x - t.x, r.z - t.z);
      r.kind === `pond` && e < n && ((i = r), (n = e));
    }
  }
  let a = Wn(i.id);
  return { spot: i, place: a, id: We[a], water: er(a), far: !r && Math.hypot(i.x - t.x, i.z - t.z) > Gn[a] };
}
var qn = (e) => {
  typeof requestIdleCallback == `function` ? requestIdleCallback(e, { timeout: 4e3 }) : setTimeout(e, 1e3);
};
function Jn(e) {
  let n = new Map(),
    r = [],
    i = [],
    a = null,
    o = !1,
    c = null,
    l = null,
    u = [],
    d = () => {
      for (let { spec: t, at: n } of u.splice(0)) {
        let r = Math.max(0, (e.now() - n) / 1e3);
        c?.addRelease({ ...t, ageSec: (t.ageSec ?? 0) + r });
      }
    },
    f = () =>
      (l ??= t(
        async () => {
          let { attachPondLife: e } = await import(`./pond-life-DdO9GjPO.js`).then((e) => e.n);
          return { attachPondLife: e };
        },
        __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
        import.meta.url,
      ).then(
        ({ attachPondLife: t }) => {
          o ||
            ((c = t({
              attach: e.temple.attach,
              quality: e.quality,
              calm: e.calm,
              front: a === !0,
              now: () => e.now() / 1e3,
              ...(e.onAttach ? { onAttach: e.onAttach } : {}),
              ...(e.camera ? { camera: e.camera } : {}),
            })),
            d());
        },
        (e) => {
          ((u.length = 0), console.error(`Không tải được cá koi`, e));
        },
      )),
    p = (t) => {
      let i = n.get(t);
      if (i) return i;
      let a = { quality: e.quality, calm: e.calm, now: e.now, ...(e.camera ? { camera: e.camera } : {}) };
      return (
        (i = Un(
          t === q.HO_BAN_NGUYET || t === q.SUOI
            ? { ...a, ...$n(t) }
            : { ...a, pond: e.pond, viewDistance: 16 },
        )),
        n.set(t, i),
        r.push(e.temple.attach(i.object, i.update)),
        e.onAttach?.(),
        i
      );
    },
    m = (t, n) => {
      let r = s.waterRituals ? Je(t.code) : q.AO_SEN;
      if (r !== q.AO_SEN && a !== !0) {
        a === null && i.push({ spec: t, at: n });
        return;
      }
      let o = Math.max(0, (e.now() - n) / 1e3);
      p(r).add({ ...t, ageSec: (t.ageSec ?? 0) + o });
    };
  return {
    add(e, t) {
      o || m(e, t);
    },
    addRelease(e, t) {
      !o &&
        s.waterRituals &&
        a !== !1 &&
        (u.length >= 24 && u.shift(), u.push({ spec: e, at: t }), a === !0 && (c ? d() : f()));
    },
    releaseCount: () => c?.releasedCount() ?? 0,
    clearReleases() {
      ((u.length = 0), c?.clearReleases());
    },
    count(e) {
      if (e !== void 0) return n.get(e)?.count() ?? 0;
      let t = 0;
      for (let e of n.values()) t += e.count();
      return t;
    },
    campusReady(t) {
      if (o || a !== null) return;
      a = t;
      for (let { spec: e, at: t } of i.splice(0)) m(e, t);
      if (!s.waterRituals) return;
      t ? u.length > 0 && f() : (u.length = 0);
      let n = e.idle ?? qn;
      (t && n(Zn), e.quality !== `low` && n(() => void f()));
    },
    koiCount: () => c?.count() ?? 0,
    dispose() {
      if (!o) {
        ((o = !0), (i.length = 0), (u.length = 0));
        for (let e of r.splice(0)) e();
        for (let e of n.values()) e.dispose();
        (n.clear(), c?.dispose(), (c = null));
      }
    },
  };
}
var Yn = {};
function Xn(e) {
  let t = Yn[e];
  if (t) return t;
  let n = F(e === q.SUOI ? L : ee);
  return ((Yn = { ...Yn, [e]: n }), n);
}
function Zn() {
  (Xn(q.HO_BAN_NGUYET), Xn(q.SUOI));
}
var Qn = {};
function $n(e) {
  return {
    pond: { x: A.x, z: A.z, r: R },
    waterY: e === q.SUOI ? ne : te,
    avoid: [],
    shape: P,
    drift: Xn(e),
  };
}
function er(e) {
  if (e === q.AO_SEN) return { x: O.x, z: O.z, r: O.r };
  let t = e === q.SUOI ? L : ee,
    n = (Yn[e]?.path ?? Qn[e]) || I(t.points);
  Qn = { ...Qn, [e]: n };
  let r = n.at(t.release + (e === q.SUOI ? 3 : 1));
  return { x: r.x, z: r.z, r: e === q.SUOI ? 1.5 : 3 };
}
function tr(e, t, n, r) {
  let i = null,
    a = () => {
      (i?.(), (i = null));
    };
  return (
    (i = e.onAutoWalkChange((t) => {
      if (t) return;
      a();
      let { kind: i, lastEnd: o } = e.walkStatus();
      i === n.kind && o !== `cancelled` && queueMicrotask(r);
    })),
    e.walkTo(t.x, t.z, void 0, n),
    a
  );
}
var nr = 3,
  rr = 2.5;
function ir(e) {
  let t = { x: e.x, blend: 0.6, pitch: 0.35 },
    n = 0;
  return {
    start() {
      nn() || (n = nr);
    },
    step(r, i, a, o, s) {
      if (n <= 0) return null;
      if (i.yaw !== 0 || i.pitch !== 0 || a.x !== 0 || a.y !== 0) return ((n = 0), null);
      n -= r;
      let c = Math.atan2(-(e.x - o.x), -(e.z - o.z)) - s;
      return ((i.yaw = -Math.atan2(Math.sin(c), Math.cos(c)) * M(rr, r)), t);
    },
  };
}
var ar = e({ createAltarCandles: () => xr }),
  or = 1.2,
  sr = [-0.55, 0.55, -1.05, 1.05, -1.55, 1.55, -2.05, 2.05].map((e) => ({ x: e, y: 1, z: -18.1 })),
  cr = 0,
  lr = 1,
  ur = 2,
  dr = 3,
  fr = 0.012,
  pr = 0.15,
  mr = 0.03,
  hr = 0.105,
  gr = 0.55;
function _r(e) {
  let t = e === `low` ? 8 : 12,
    n = new rn();
  an(n, dr, 0, 0.222, 0);
  let r = (e, r, i, a, o) => {
      let s = [];
      for (let c = 0; c < t; c++) {
        let l = (c / t) * w;
        s.push(n.vertex(Math.cos(l) * r, e, Math.sin(l) * r, i, a, o, 0));
      }
      return s;
    },
    i = (e, r) => {
      for (let i = 0; i < t; i++) {
        let a = (i + 1) % t;
        n.quad(e[i], e[a], r[a], r[i]);
      }
    },
    a = (e, r, i, a, o) => {
      let s = n.vertex(0, r, 0, i, a, o, 0);
      for (let r = 0; r < t; r++) n.tri(s, e[(r + 1) % t], e[r]);
    },
    o = r(0, 0.062, cr, 0, 0),
    s = r(fr, 0.045, cr, 1, 0);
  (i(o, s),
    a(s, fr, cr, 1, 0),
    i(r(fr, mr, lr, 0, 0), r(0.162, mr, lr, 1, 0)),
    a(r(0.162, mr * 0.95, lr, 1, 1), 0.162, lr, 1, 1));
  let c = 0.17,
    l = [
      [0, 0],
      [0.2, 0.019],
      [0.42, 0.024],
      [0.72, 0.014],
      [1, 0],
    ],
    u = e === `low` ? 4 : 6,
    d = l.map(([e, t], r) => {
      if (r === 0 || r === l.length - 1) return [n.vertex(0, c + e * hr, 0, ur, e, 0, 0)];
      let i = [];
      for (let r = 0; r < u; r++) {
        let a = (r / u) * w;
        i.push(n.vertex(Math.cos(a) * t, c + e * hr, Math.sin(a) * t, ur, e, 0, 0));
      }
      return i;
    });
  for (let e = 0; e < d.length - 1; e++) {
    let t = d[e],
      r = d[e + 1];
    for (let e = 0; e < u; e++) {
      let i = (e + 1) % u;
      t.length === 1
        ? n.tri(t[0], r[i], r[e])
        : r.length === 1
          ? n.tri(t[e], t[i], r[0])
          : n.quad(t[e], t[i], r[i], r[e]);
    }
  }
  return n.build();
}
var vr = `
attribute vec4 aVert;
attribute vec4 aState;
uniform float uTime;
uniform float uFlicker;
uniform float uHalo;
varying vec4 vVert;
varying vec4 vState;

void main() {
  vVert = aVert;
  vState = aState;
  float kind = aVert.x;
  float scale = aState.x;
  float burn = mix(${gr.toFixed(2)}, 1.0, aState.y);
  vec3 p = position;
  // Thân nến ngắn dần khi cháy; ngọn lửa và quầng đi theo đỉnh nến.
  if (kind > 0.5 && kind < 1.5) p.y = ${fr.toFixed(3)} + (p.y - ${fr.toFixed(3)}) * burn;
  else if (kind > 1.5) p.y -= ${pr.toFixed(3)} * (1.0 - burn);
  if (kind > 1.5 && kind < 2.5) {
    float f = uFlicker * (0.10 * sin(uTime * 13.0 + aState.z) + 0.07 * sin(uTime * 29.0 + aState.z * 2.3)
      + 0.05 * sin(uTime * 7.1 + aState.z * 0.7));
    float base = ${(0.17).toFixed(3)} - ${pr.toFixed(3)} * (1.0 - burn);
    p.y = base + (p.y - base) * (1.0 + f);
    p.xz *= 1.0 - 0.5 * f;
    p.x += uFlicker * 0.004 * sin(uTime * 5.0 + aState.z) * (p.y - base) * 10.0;
  }
  p *= scale;
  if (kind > 2.5) {
    vec4 mv = modelViewMatrix * (instanceMatrix * vec4(p, 1.0));
    mv.xy += aVert.zw * (uHalo * scale);
    gl_Position = projectionMatrix * mv;
  } else {
    gl_Position = projectionMatrix * modelViewMatrix * (instanceMatrix * vec4(p, 1.0));
  }
}
`,
  yr = `
uniform float uNight;
uniform float uTime;
uniform float uFlicker;
varying vec4 vVert;
varying vec4 vState;

void main() {
  float kind = vVert.x;
  float grad = vVert.y;
  if (kind < 0.5) {
    vec3 gold = vec3(0.86, 0.66, 0.26) * (0.62 + 0.38 * grad);
    gl_FragColor = vec4(gold, 1.0);
  } else if (kind < 1.5) {
    // Nến đỏ, sáng dần về đầu nến do ngọn lửa rọi; mặt nến chảy ngả kem.
    vec3 red = mix(vec3(0.5, 0.08, 0.06), vec3(0.88, 0.2, 0.12), 0.25 + 0.75 * smoothstep(0.0, 1.0, grad));
    vec3 col = vVert.z > 0.5 ? vec3(1.0, 0.86, 0.58) : red;
    col *= 0.88 + 0.3 * uNight;
    gl_FragColor = vec4(col, 1.0);
  } else if (kind < 2.5) {
    vec3 col = mix(vec3(1.0, 0.97, 0.78), vec3(1.0, 0.58, 0.2), grad);
    gl_FragColor = vec4(col, 1.0);
  } else {
    float a = pow(max(1.0 - length(vVert.zw), 0.0), 2.2);
    float flick = 1.0 + uFlicker * (0.12 * sin(uTime * 13.0 + vState.z) + 0.07 * sin(uTime * 29.0 + vState.z * 2.3));
    // Cộng sáng thuần (alpha 0 ở chế độ nhân sẵn); hơi yếu hơn quầng nến có sẵn của bàn thờ.
    gl_FragColor = vec4(vec3(1.0, 0.64, 0.25) * a * (0.3 + 0.22 * uNight) * flick, 0.0);
  }
}
`,
  br = new f();
function xr(e) {
  let t = e.spots ?? sr,
    n = t.length,
    r = e.now ?? (() => (typeof performance < `u` ? performance.now() : Date.now())),
    i = e.calm ?? nn(),
    a = _r(e.quality),
    o = new y(new Float32Array(n * 4), 4);
  (o.setUsage(S), a.setAttribute(`aState`, o));
  let s = {
      uTime: { value: 0 },
      uFlicker: { value: i ? 0.4 : 1 },
      uHalo: { value: 0.36 },
      uNight: T.uLanternNight,
    },
    c = new h({
      uniforms: s,
      vertexShader: vr,
      fragmentShader: yr,
      transparent: !0,
      premultipliedAlpha: !0,
      depthWrite: !1,
      side: 2,
      forceSinglePass: !0,
      fog: !1,
    });
  c.name = `altar-candles`;
  let d = new u(a, c, n);
  ((d.name = `altar-candles`),
    d.instanceMatrix.setUsage(S),
    t.forEach((e, t) => {
      (br.makeTranslation(e.x, e.y, e.z), d.setMatrixAt(t, br), o.setXYZW(t, 0, 1, (t * 2.3) % w, 0));
    }),
    (d.instanceMatrix.needsUpdate = !0),
    (d.count = n),
    (d.visible = !1),
    (d.renderOrder = 4));
  let f = t.reduce((e, t) => e.add(new v(t.x / n, t.y / n, t.z / n)), new v()),
    p = t.reduce((e, t) => Math.max(e, Math.hypot(t.x - f.x, t.z - f.z)), 0);
  d.boundingSphere = new l(f.setY(f.y + 0.2), p + 0.8);
  let m = t.map(() => null),
    g = !1,
    _ = (e) => {
      let t = m[e];
      if (!t) {
        o.setXYZW(e, 0, 1, o.getZ(e), 0);
        return;
      }
      let n = D(0, or, t.shown) * D(0, 6, t.remaining);
      o.setXYZW(e, n, C(t.remaining / t.total, 0, 1), o.getZ(e), 0);
    },
    b = () => {
      let e = r();
      for (let t = 0; t < m.length; t++) {
        let n = m[t];
        if (!n) continue;
        let r = Math.max(0, (e - n.startedAt) / 1e3);
        ((n.shown = r), (n.remaining = n.total - r), n.remaining <= 0 && ((m[t] = null), _(t)));
      }
    },
    x = () => {
      ((d.visible = m.some((e) => e !== null)), (o.needsUpdate = !0));
    };
  return {
    object: d,
    capacity: n,
    light(e = 600) {
      let t = Number.isFinite(e) && e > 0 ? Math.min(e, 3600) : 600;
      b();
      let n = m.findIndex((e) => e === null);
      if (n < 0) {
        n = 0;
        for (let e = 1; e < m.length; e++) m[e].remaining < m[n].remaining && (n = e);
      }
      return ((m[n] = { startedAt: r(), total: t, remaining: t, shown: 0 }), _(n), x(), n);
    },
    update(e, t) {
      if (!g && ((s.uTime.value = t), d.visible)) {
        b();
        for (let e = 0; e < m.length; e++) m[e] && _(e);
        x();
      }
    },
    setCalm(e) {
      ((i = e), (s.uFlicker.value = i ? 0.4 : 1));
    },
    litCount: () => (b(), m.reduce((e, t) => e + +!!t, 0)),
    dispose() {
      g || ((g = !0), m.fill(null), d.removeFromParent(), a.dispose(), c.dispose(), d.dispose());
    },
  };
}
var Sr = e({ createIncenseSticks: () => Yr }),
  Cr = 0.6,
  wr = 2,
  Tr = 0.5,
  Er = Math.PI * (3 - Math.sqrt(5)),
  Dr = 0.24,
  Or = 0.715 * 0.82,
  kr = 0.08,
  Ar = { altar: 0.007, yard: 0.011 },
  jr = { altar: { pool: 16, base: 3, perStick: 2 }, yard: { pool: 30, base: 4, perStick: 3 } },
  Mr = 3.6,
  Nr = 0,
  Pr = 1,
  Fr = 2,
  Ir = 3,
  Lr = 4,
  Rr = 2;
function zr(e, t) {
  return j[e].len * (1 - (1 - C(t, 0, 1)) * Or);
}
function Br(e) {
  let t = e === `low` ? 3 : 4,
    n = new rn(),
    r = (e, r, i, a, o) => {
      let s = [];
      for (let c = 0; c < t; c++) {
        let l = (c / t) * w;
        s.push(n.vertex(Math.cos(l) * r, e, Math.sin(l) * r, i, a, o, 0));
      }
      return s;
    },
    i = (e, r) => {
      for (let i = 0; i < t; i++) {
        let a = (i + 1) % t;
        n.quad(e[i], e[a], r[a], r[i]);
      }
    },
    a = 0.955;
  (i(r(0, 1, Nr, 0, 0), r(Dr, 1, Nr, 1, 0)), i(r(Dr, 1, Pr, 0, 0), r(a, 1, Pr, 1, 1)));
  let o = r(1, 0.8, Fr, 1, 1);
  i(r(a, 1, Fr, 0, 1), o);
  let s = n.vertex(0, 1.008, 0, Fr, 1, 1, 0);
  for (let e = 0; e < t; e++) n.tri(s, o[(e + 1) % t], o[e]);
  return (an(n, Ir, 0, 1, 0), an(n, Lr, 0, 0, 0), n.build());
}
var Vr = `
attribute vec4 aVert;
attribute vec4 aState;
uniform float uTime;
uniform float uFlicker;
uniform vec2 uSmoke;
uniform float uRise;
varying vec4 vVert;
varying vec4 vState;
varying float vAlpha;

void main() {
  vVert = aVert;
  vState = aState;
  vAlpha = 0.0;
  float kind = aVert.x;
  bool smoke = aState.w > ${(1.5).toFixed(1)};
  if (smoke != (kind > ${(3.5).toFixed(1)})) {
    // Phần không thuộc thể hiện này (thân que của hạt khói, tấm khói của que): đẩy ra ngoài khung cắt.
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  if (smoke) {
    // Hạt khói: (bật, pha, lư, cờ + độ lệch ngang). Cùng nhịp với khói hương cũ (life 5..6,5 giây, lắc, nở, tan).
    float side = aState.w - ${Rr.toFixed(1)};
    float life = 5.0 + fract(aState.y * 7.31 + side * 3.17) * 1.5;
    float age = mod(uTime + aState.y * life, life);
    float u = age / life;
    float sway = sin(age * 0.9 + side * 6.2831) * 0.22 * u;
    vec4 c = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    c.x += sway + u * 0.25 * (side * 2.0 - 1.0);
    c.y += age * uRise;
    c.z += sway * 0.6;
    vec4 mv = modelViewMatrix * c;
    mv.xy += aVert.zw * (0.1 + 0.425 * u);
    gl_Position = projectionMatrix * mv;
    float lit = aState.x * (aState.z < 0.5 ? uSmoke.x : uSmoke.y);
    float env = u < 0.15 ? u / 0.15 : (1.0 - u) / 0.85;
    vAlpha = 0.3 * lit * smoothstep(0.0, 1.0, clamp(env, 0.0, 1.0));
    return;
  }
  vec3 p = position;
  // Thân ngắn dần khi cháy: đỉnh thân, đầu than và quầng dời xuống cùng nhau, chân đỏ đứng yên.
  float moves = kind > 2.5 ? 1.0 : aVert.z;
  p.y -= moves * (1.0 - aState.y) * ${Or.toFixed(4)};
  p *= aState.x;
  vec4 mv = modelViewMatrix * (instanceMatrix * vec4(p, 1.0));
  if (kind > 2.5) {
    // Quầng quay về camera, cỡ theo chiều dài que của lư (trục Y của ma trận thể hiện); của mình to hơn chút.
    float len = length(instanceMatrix[1].xyz);
    float glow = (1.0 + 0.3 * aState.w) * (1.0 + uFlicker * 0.12 * sin(uTime * 2.7 + aState.z));
    mv.xy += aVert.zw * (${kr.toFixed(3)} * len * aState.x * glow);
  }
  gl_Position = projectionMatrix * mv;
}
`,
  Hr = `
uniform float uNight;
uniform float uTime;
uniform float uFlicker;
varying vec4 vVert;
varying vec4 vState;
varying float vAlpha;

void main() {
  float kind = vVert.x;
  float grad = vVert.y;
  float mine = vState.w;
  float shade = mix(1.0, 0.5, uNight);
  if (kind > 3.5) {
    // Khói: trộn thường (alpha nhân sẵn), mềm ở rìa.
    float a = pow(max(1.0 - length(vVert.zw), 0.0), 1.9) * vAlpha;
    gl_FragColor = vec4(vec3(0.86, 0.84, 0.8) * a, a);
  } else if (kind < 0.5) {
    // Chân nén đỏ son, sẫm dần xuống mặt tro.
    gl_FragColor = vec4(vec3(0.62, 0.13, 0.1) * (0.72 + 0.28 * grad) * shade, 1.0);
  } else if (kind < 1.5) {
    // Thân bột trầm nâu sẫm, ửng đỏ dần lên gần đầu đang cháy.
    vec3 col = mix(vec3(0.34, 0.19, 0.11), vec3(0.5, 0.21, 0.11), grad * grad);
    gl_FragColor = vec4(col * shade, 1.0);
  } else if (kind < 2.5) {
    // Đầu than tự sáng (không theo đèn); nén của mình sáng hơn một chút.
    float flick = 1.0 + uFlicker * 0.1 * sin(uTime * 3.3 + vState.z);
    vec3 ember = mix(vec3(0.6, 0.15, 0.07), vec3(1.0, 0.42, 0.15), grad) * (1.0 + 0.3 * mine) * flick;
    gl_FragColor = vec4(min(ember, vec3(1.0)), 1.0);
  } else {
    float a = pow(max(1.0 - length(vVert.zw), 0.0), 2.0);
    float flick = 1.0 + uFlicker * 0.15 * sin(uTime * 2.7 + vState.z);
    // Cộng sáng thuần (alpha 0 ở chế độ nhân sẵn), rõ hơn về đêm.
    gl_FragColor = vec4(vec3(1.0, 0.45, 0.18) * a * (0.32 + 0.38 * uNight) * (1.0 + 0.6 * mine) * flick, 0.0);
  }
}
`,
  Ur = new v(0, 1, 0),
  $ = new f(),
  Wr = new d(),
  Gr = new d(),
  Kr = new v(),
  qr = new v(),
  Jr = new l();
function Yr(e) {
  let t = e.now ?? (() => Date.now()),
    n = e.calm ?? nn(),
    r = new m();
  r.name = `incense`;
  let i = N.length * 48,
    a = i + N.reduce((e, t) => e + jr[t].pool, 0),
    o = Br(e.quality),
    s = new y(new Float32Array(a * 4), 4);
  (s.setUsage(S), o.setAttribute(`aState`, s));
  let c = {
      uTime: { value: 0 },
      uFlicker: { value: n ? 0.3 : 1 },
      uSmoke: { value: new _(0, 0) },
      uRise: { value: n ? 0.28 : 0.46 },
      uNight: T.uLanternNight,
    },
    l = new h({
      uniforms: c,
      vertexShader: Vr,
      fragmentShader: Hr,
      transparent: !0,
      premultipliedAlpha: !0,
      depthWrite: !1,
      side: 2,
      forceSinglePass: !0,
      fog: !1,
    });
  l.name = `incense-sticks`;
  let d = new u(o, l, a);
  ((d.name = `incense-sticks`),
    d.instanceMatrix.setUsage(S),
    (d.count = 0),
    (d.visible = !1),
    (d.renderOrder = 4));
  let f = E(9157),
    p = i,
    g = N.map((e, t) => {
      let n = j[e],
        r = t * 48,
        i = E(7307 + t * 131),
        a = [],
        o = [];
      qr.set(Ar[e], n.len, Ar[e]);
      for (let e = 0; e < 48; e++) {
        let c = n.r * Math.sqrt((e + 0.5) / 48),
          l = e * Er + t * 1.1,
          u = new v(n.x + Math.cos(l) * c, n.y, n.z + Math.sin(l) * c),
          f = 0.04 + 0.2 * (c / n.r) + (i() - 0.5) * 0.06;
        (Kr.set(Math.sin(l), 0, -Math.cos(l)),
          Wr.setFromAxisAngle(Kr, f),
          Gr.setFromAxisAngle(Ur, i() * w),
          Wr.multiply(Gr),
          $.compose(u, Wr, qr),
          d.setMatrixAt(r + e, $),
          a.push(u),
          o.push(Ur.clone().applyQuaternion(Wr)),
          s.setXYZW(r + e, 0, 1, (e * 2.3) % w, 0));
      }
      let c = p,
        l = jr[e].pool;
      for (let e = 0; e < l; e++)
        ($.makeTranslation(n.x, n.y + n.len * 0.9, n.z),
          d.setMatrixAt(c + e, $),
          s.setXYZW(c + e, 0, (e * 0.6180339887) % 1, t, Rr + f()));
      return (
        (p += l),
        {
          name: e,
          offset: r,
          smokeOffset: c,
          slots: Array.from({ length: 48 }, () => null),
          bases: a,
          dirs: o,
          tips: Array.from({ length: 48 }, () => new v()),
          waiting: [],
          puffs: 0,
        }
      );
    });
  ((d.instanceMatrix.needsUpdate = !0), (d.count = i), d.computeBoundingSphere(), (d.count = 0));
  let b = d.boundingSphere;
  for (let e of N) {
    let t = j[e],
      n = Mr / 2;
    b.union(Jr.set(new v(t.x, t.y + t.len + n, t.z), 2.4));
  }
  r.add(d);
  let x = !1,
    O = 0,
    k = !1,
    A = 0,
    M = new _(),
    P = (e) => e.slots.reduce((e, t) => e + +!!t, 0),
    F = (e, t) => {
      e.waiting.sort((e, t) => Number(t.mine) - Number(e.mine) || e.endsAt - t.endsAt);
      let n = [];
      for (let r of e.waiting) {
        let i = e.slots.indexOf(null);
        if (i < 0 && r.mine) {
          let t = -1;
          for (let n = 0; n < e.slots.length; n++) {
            let r = e.slots[n];
            r && !r.mine && (t < 0 || r.endsAt < e.slots[t].endsAt) && (t = n);
          }
          if (t >= 0) {
            let r = e.slots[t];
            (n.push({ owner: r.owner, burner: e.name, endsAt: r.endsAt, mine: r.mine }), (i = t));
          }
        }
        i < 0 ? n.push(r) : (e.slots[i] = { owner: r.owner, endsAt: r.endsAt, mine: r.mine, shownAt: t });
      }
      e.waiting = n;
    },
    I = (e) => {
      for (let t of g) {
        let n = !1;
        for (let r = 0; r < t.slots.length; r++)
          (t.slots[r]?.endsAt ?? 1 / 0) <= e && ((t.slots[r] = null), (n = !0));
        t.waiting.length !== 0 && ((t.waiting = t.waiting.filter((t) => t.endsAt > e)), n && F(t, e));
      }
    },
    L = () => {
      let e = c.uSmoke.value,
        t = e.x > 0 || e.y > 0;
      ((d.count = t ? a : A), (d.visible = d.count > 0));
    },
    R = (e) => {
      k = !1;
      let t = -1;
      for (let n of g) {
        let r = 0;
        for (let i = 0; i < n.slots.length; i++) {
          let a = n.slots[i],
            o = n.offset + i;
          if (!a) {
            s.setX(o, 0);
            continue;
          }
          t = o;
          let c = (a.endsAt - e) / 1e3,
            l = (e - a.shownAt) / 1e3,
            u = D(0, Cr, l) * D(0, wr, c);
          (l < Cr || c < wr) && (k = !0);
          let d = C(c / 600, 0, 1);
          (s.setXYZW(o, u, d, s.getZ(o), +!!a.mine),
            n.tips[r].copy(n.dirs[i]).multiplyScalar(zr(n.name, d)).add(n.bases[i]),
            r++);
        }
        let i = r + n.waiting.length;
        if ((M.setComponent(n.name === `altar` ? 0 : 1, +(i > 0)), r === 0)) continue;
        let a = jr[n.name];
        n.puffs = Math.min(a.pool, a.base + a.perStick * i);
        for (let e = 0; e < a.pool; e++) {
          let t = n.tips[e % r];
          ($.makeTranslation(t.x, t.y, t.z),
            d.setMatrixAt(n.smokeOffset + e, $),
            s.setX(n.smokeOffset + e, +(e < n.puffs)));
        }
      }
      ((s.needsUpdate = !0), (d.instanceMatrix.needsUpdate = !0), (A = t + 1));
      let n = c.uSmoke.value;
      (M.x > 0 && n.x === 0 && (n.x = 0.001), M.y > 0 && n.y === 0 && (n.y = 0.001), L());
    };
  return {
    object: r,
    set(e) {
      if (x) return;
      let n = t();
      for (let t of g) {
        let r = new Map();
        for (let i of e) i.burner === t.name && i.endsAt > n && !r.has(i.owner) && r.set(i.owner, i);
        for (let e = 0; e < t.slots.length; e++) {
          let n = t.slots[e];
          if (!n) continue;
          let i = r.get(n.owner);
          i ? ((n.endsAt = i.endsAt), (n.mine = i.mine), r.delete(n.owner)) : (t.slots[e] = null);
        }
        ((t.waiting = [...r.values()]), F(t, n));
      }
      R(n);
    },
    update(e, n) {
      if (x) return;
      c.uTime.value = n % 3600;
      let r = C(e, 0, 0.1),
        i = c.uSmoke.value,
        a = 1 - Math.exp(-r * 1.4);
      if (
        ((i.x += (M.x - i.x) * a),
        (i.y += (M.y - i.y) * a),
        i.x < 0.005 && M.x === 0 && (i.x = 0),
        i.y < 0.005 && M.y === 0 && (i.y = 0),
        L(),
        (A === 0 && g.every((e) => e.waiting.length === 0)) || ((O += e), !k && O < Tr))
      )
        return;
      O = 0;
      let o = t();
      (I(o), R(o));
    },
    count(e) {
      let n = g.find((t) => t.name === e);
      if (!n) return 0;
      let r = t();
      return (
        n.slots.reduce((e, t) => e + (t && t.endsAt > r ? 1 : 0), 0) +
        n.waiting.filter((e) => e.endsAt > r).length
      );
    },
    drawn(e) {
      let t = g.find((t) => t.name === e);
      return t ? P(t) : 0;
    },
    puffs(e) {
      let t = g.find((t) => t.name === e);
      return t && t.slots.some((e) => e !== null) ? t.puffs : 0;
    },
    dispose() {
      x || ((x = !0), r.removeFromParent(), o.dispose(), l.dispose(), d.dispose());
    },
  };
}
export {
  He as C,
  Ie as D,
  Ve as E,
  re as O,
  Z as S,
  Le as T,
  et as _,
  tr as a,
  Y as b,
  Kt as c,
  St as d,
  Nt as f,
  rt as g,
  mt as h,
  on as i,
  Ne as k,
  Jt as l,
  xt as m,
  ar as n,
  Gt as o,
  _t as p,
  ir as r,
  Wt as s,
  Sr as t,
  Rt as u,
  Ze as v,
  Fe as w,
  Ke as x,
  Xe as y,
};
