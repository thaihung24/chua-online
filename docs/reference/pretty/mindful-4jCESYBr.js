import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { gt as t } from "./index-e_Bx6V48.js";
var n = `Thiền hành`,
  r = `Thôi`,
  i = `Thôi thiền hành`;
function a(e) {
  return `${n} · ${Number.isFinite(e) && e > 0 ? Math.floor(e) : 0} phút`;
}
function o(e, o) {
  let s = document.createElement(`div`);
  ((s.className = `hud-glass mindful-pill`),
    s.setAttribute(`role`, `group`),
    s.setAttribute(`aria-label`, n),
    (s.hidden = !0));
  let c = document.createElement(`span`);
  ((c.className = `mindful-pill__icon`), (c.innerHTML = t(`lotus`)));
  let l = document.createElement(`span`);
  ((l.className = `mindful-pill__text`),
    l.setAttribute(`role`, `status`),
    l.setAttribute(`aria-live`, `polite`),
    l.setAttribute(`aria-atomic`, `true`));
  let u = document.createElement(`i`);
  ((u.className = `mindful-pill__sep`), u.setAttribute(`aria-hidden`, `true`));
  let d = document.createElement(`button`);
  ((d.type = `button`),
    (d.className = `hud-note__btn mindful-pill__stop`),
    (d.textContent = r),
    d.setAttribute(`aria-label`, i),
    d.addEventListener(`click`, () => o.onStop()),
    s.append(c, l, u, d),
    e.append(s));
  let f = ``,
    p = (e) => {
      let t = a(e);
      t !== f && ((f = t), (l.textContent = t));
    };
  return {
    element: s,
    show(e) {
      (p(e), (s.hidden = !1));
    },
    set: p,
    hide() {
      s.hidden = !0;
    },
    dispose() {
      s.remove();
    },
  };
}
var s = e({ createMindfulController: () => y }),
  c = `Bạn cất chổi trước đã nhé.`,
  l = `Thiền hành: đi chậm, chắp tay. Thả Shift để đi thường.`,
  u = `Mẹo: trên máy tính, giữ Shift khi đi để thiền hành.`,
  d = `chua-online:mindful-tip`,
  f = 6e3,
  p = [10, 30, 60, 180, 600, 1800],
  m = 1;
function h(e) {
  let t = 0;
  for (let n of p) e >= n && (t = n);
  return t;
}
var g = 0;
function _() {
  try {
    return typeof localStorage > `u` ? null : localStorage;
  } catch {
    return null;
  }
}
function v() {
  try {
    return matchMedia(`(hover: hover) and (pointer: fine)`).matches;
  } catch {
    return !1;
  }
}
function y(e) {
  let t = e.storage === void 0 ? _() : e.storage,
    n = e.finePointer ?? v(),
    r = !1,
    i = `menu`,
    a = null,
    s = 0,
    p = 0,
    y = null,
    b,
    x = !1,
    S = new Set();
  function C(n, r) {
    let i = ``;
    try {
      i = t?.getItem(`chua-online:mindful-tip`) ?? ``;
    } catch {}
    if (!(S.has(n) || i.includes(n))) {
      S.add(n);
      try {
        t?.setItem(d, i + n);
      } catch {}
      (e.hint(r), clearTimeout(b), (b = setTimeout(() => e.hint(null), f)));
    }
  }
  function w() {
    let t = a;
    ((a = null),
      !t ||
        t.seconds < 10 ||
        g >= 10 ||
        (g++, e.track(`mindful_walk`, { via: t.via, seconds: h(t.seconds) })));
  }
  let T = {
    sticky: () => r,
    start(t) {
      return x
        ? !1
        : e.carrying()
          ? (e.toast(c), !1)
          : (r ||
              ((r = !0),
              (i = t),
              (s = 0),
              (p = 0),
              (y ??= o(e.host(), {
                onStop: () => {
                  (T.stop(), e.focus());
                },
              })),
              y.show(0),
              n && C(`t`, u)),
            !0);
    },
    toggle(e) {
      r ? T.stop() : T.start(e);
    },
    stop() {
      r && ((r = !1), y?.hide());
    },
    update(t) {
      if (x) return !1;
      let n = Number.isFinite(t) ? Math.min(Math.max(t, 0), m) : 0,
        o = r || e.slowHeld(),
        { state: c } = e.player,
        u = c.mindful === !0 && c.anim === `walk`;
      if ((o && !a && u && ((a = { via: r ? i : `shift`, seconds: 0 }), r || C(`s`, l)), !a)) return o;
      if (!o) return (w(), o);
      if (((a.seconds += n), r && u)) {
        s += n;
        let e = Math.floor(s / 60);
        e !== p && ((p = e), y?.set(e));
      }
      return o;
    },
    dispose() {
      x || (w(), (x = !0), (r = !1), clearTimeout(b), y?.dispose(), (y = null));
    },
  };
  return T;
}
export { s as t };
