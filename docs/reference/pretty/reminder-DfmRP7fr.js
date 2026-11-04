import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { Gt as t, Kt as n, wt as r, x as i } from "./index-e_Bx6V48.js";
import { _ as a, g as o, p as s, v as c } from "./lazy-shared-D8DtrU9N.js";
import { r as l } from "./vn-time-DznqUr4I.js";
import { J as u, K as d, W as f, Y as p, q as m } from "./app-z_oU8L_u.js";
var h = e({ startLoginReminder: () => S }),
  g = `Đăng nhập để giữ cấp, nhiệm vụ và chuỗi giữ lửa trên mọi máy.`,
  _ = `Đăng nhập`,
  v = `Để sau`,
  y = 5e3,
  b = 3e4;
function x() {
  try {
    return localStorage;
  } catch {
    return null;
  }
}
function S(e) {
  let a = e.storage === void 0 ? x() : e.storage,
    o = e.now ?? Date.now,
    s = !1,
    c = () => {
      s || ((s = !0), e.onSettle?.());
    },
    f = () => (c(), () => void 0);
  if (!a || n() || t()) return f();
  let h = l(o()),
    S,
    C = (e) => {
      try {
        return (a.setItem(d, JSON.stringify(e)), (S = e), !0);
      } catch {
        return !1;
      }
    };
  try {
    S = u(h, a);
  } catch {
    return f();
  }
  let w = p(S, h);
  if (w === `first`) return (C({ first: h, last: 0, snoozes: 0 }), f());
  if (w === `wait` || S === null) return f();
  let T = e.gate.as(m),
    E = e.open ?? i,
    D = o(),
    O = `waiting`,
    k,
    A = () => {
      (clearInterval(P), clearTimeout(k), O === `shown` && T(null), (O = `done`), c());
    },
    j = (e) => {
      (S && C({ ...S, snoozes: S.snoozes + 1 }), r(`login_reminder`, { action: e }), A());
    },
    M = () => {
      try {
        let e = u(h, a);
        if (e === null || p(e, h) !== `show`) {
          A();
          return;
        }
        S = e;
      } catch {
        A();
        return;
      }
      C({ ...S, last: h })
        ? ((O = `shown`),
          r(`login_reminder`, { action: `shown` }),
          T(g, [
            {
              label: _,
              run: () => {
                (r(`login_reminder`, { action: `login` }), A(), E({ reason: `reminder`, onFail: e.notify }));
              },
            },
            { label: v, run: () => j(`later`) },
          ]),
          (k = setTimeout(() => j(`timeout`), b)))
        : A();
    },
    N = () => {
      O === `shown`
        ? (e.gate.owner() !== `login` || e.isBusy()) && A()
        : e.gate.shown() || o() - D >= 12e4
          ? A()
          : e.isBusy() || M();
    },
    P = setInterval(N, y);
  return (N(), A);
}
var C = e({ runFanpageInvite: () => j }),
  w = `Loa chùa · Fanpage Chùa Sen`,
  T = `Chùa Sen đã có fanpage trên Facebook. Bạn theo dõi để nhận thông báo mới từ chùa nhé.`,
  E = `Theo dõi fanpage`,
  D = `Để sau`,
  O = 2e4;
function k(e) {
  let t = !1,
    n = () => void 0,
    i = () => {
      t || ((t = !0), clearTimeout(l), n(), e.show(null));
    };
  (r(`fanpage_invite`, { action: `shown` }),
    e.show(
      `${w}\n${T}`,
      [
        {
          label: E,
          run: () => {
            (r(`fanpage_invite`, { action: `open` }), a(`prompt`), i());
          },
        },
        {
          label: D,
          run: () => {
            (r(`fanpage_invite`, { action: `dismiss` }), c(!0), i());
          },
        },
      ],
      `fanpage`,
    ));
  let l = setTimeout(() => {
    t || (r(`fanpage_invite`, { action: `timeout` }), i());
  }, e.ms ?? 2e4);
  return (
    (n = o(() => {
      s() && i();
    })),
    i
  );
}
var A = [m, `kol`, `share`];
function j(e) {
  let t = 0;
  function n() {
    e.alive() &&
      f() &&
      (A.some((t) => e.gate.shown(t)) ||
        (e.busy() || e.gate.owner() !== null || e.reminderPending() || document.visibilityState !== `visible`
          ? t++ < 6 && e.later(n, O)
          : c(!1) && e.onDispose(k({ show: e.gate.as(`fanpage`) }))));
  }
  n();
}
export { h as n, C as t };
