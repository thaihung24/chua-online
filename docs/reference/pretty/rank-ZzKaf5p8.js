import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { a as t, n, o as r, r as i } from "./dialog-DwXghOMX.js";
import { Kt as a, gt as o, wt as s, x as c } from "./index-e_Bx6V48.js";
import { S as l, b as u } from "./account-B3fmTrbD.js";
import { E as d } from "./lazy-shared-D8DtrU9N.js";
import { _ as f } from "./progress-core-C9e35Hb5.js";
import { R as p, V as m } from "./app-z_oU8L_u.js";
var h = `/api/bxh`,
  g = [`tuan`, `lua`, `cap`],
  _ = 12e4,
  v = 99999999,
  y = 9999,
  b = [`ok`, `hidden`, `empty`, `name`, `implausible`, `removed`],
  x = /^[A-Za-z0-9_-]{12}$/,
  S = (e) => typeof e == `object` && !!e && !Array.isArray(e),
  C = (e, t, n) => typeof e == `number` && Number.isInteger(e) && e >= t && e <= n;
function w(e) {
  return typeof e == `string` && g.includes(e);
}
function T(e) {
  if (!S(e)) return null;
  let { h: t, name: n, level: r, streak: i, weekXp: a } = e;
  return typeof t != `string` ||
    !x.test(t) ||
    typeof n != `string` ||
    n.trim() === `` ||
    Array.from(n).length > 32 ||
    !C(r, 1, 9999) ||
    !C(i, 0, 9999) ||
    !C(a, 0, 99999999)
    ? null
    : { h: t, name: n, level: r, streak: i, weekXp: a };
}
function E(e) {
  if (!S(e) || !w(e.tab) || !C(e.week, 0, 1e7) || !Array.isArray(e.rows)) return null;
  let t = [];
  for (let n of e.rows.slice(0, 50)) {
    let e = T(n);
    e && t.push(e);
  }
  return { tab: e.tab, week: e.week, rows: t };
}
function D(e) {
  if (
    !S(e) ||
    typeof e.h != `string` ||
    !x.test(e.h) ||
    typeof e.shown != `boolean` ||
    typeof e.note != `string` ||
    !b.includes(e.note) ||
    !S(e.ranks)
  )
    return null;
  let t = {};
  for (let n of g) {
    let r = e.ranks[n];
    t[n] = C(r, 1, 1e7) ? r : null;
  }
  return { h: e.h, shown: e.shown, note: e.note, ranks: t };
}
var O = 8e3;
function k(e) {
  return e === 401 || e === 403 ? `auth` : e === 429 ? `rate` : e === 400 ? `bad` : `unavailable`;
}
async function A(e, t, n, r) {
  let i = new AbortController(),
    a = setTimeout(() => i.abort(), O);
  try {
    let a = await (r.fetchImpl ?? fetch)(e, {
      method: t.method,
      headers: d(e, t.headers),
      ...(t.body === void 0 ? {} : { body: t.body }),
      credentials: `omit`,
      signal: i.signal,
    });
    if (!a.ok) return { ok: !1, error: k(a.status) };
    let o = null;
    try {
      o = await a.json();
    } catch {
      o = null;
    }
    let s = n(o);
    return s === null ? { ok: !1, error: `unavailable` } : { ok: !0, value: s };
  } catch {
    return { ok: !1, error: `offline` };
  } finally {
    clearTimeout(a);
  }
}
function j(e, t = {}) {
  return A(
    `${h}?tab=${e}`,
    { method: `GET`, headers: {} },
    (t) => {
      let n = E(t);
      return n && n.tab === e ? n : null;
    },
    t,
  );
}
async function M(e, t = {}) {
  let n;
  try {
    n = await (t.getToken ?? u)();
  } catch {
    n = null;
  }
  return n === null || n === ``
    ? { ok: !1, error: `auth` }
    : A(
        h,
        {
          method: `POST`,
          headers: { authorization: `Bearer ${n}`, "content-type": `application/json` },
          body: JSON.stringify(e),
        },
        D,
        t,
      );
}
var N = e({ RANK_DEBOUNCE_MS: () => P, RANK_MAX_RETRIES: () => 3, startRankSync: () => I }),
  P = 2e4,
  F = (e, t) => (Number.isFinite(e) ? Math.min(t, Math.max(0, Math.floor(e))) : 0);
function I(e) {
  let t = e.now ?? Date.now,
    n = e.submit ?? ((e) => M(e)),
    r = e.account ?? l(),
    i = !1,
    a = !1,
    o = null,
    s,
    c = ``,
    u = -1 / 0,
    d = 0,
    f = null,
    p = null,
    m = () => {
      try {
        return r.state().status === `signed-in`;
      } catch {
        return !1;
      }
    },
    h = () => {
      let t = e.state(),
        n = e.name().trim();
      if (t.readOnly || n === ``) return null;
      let r = F(t.streak.current, y);
      return { name: n, xp: F(t.xp, v), streak: r, best: Math.max(r, F(t.streak.best, y)) };
    },
    g = (e) => `${e.name}|${e.xp}|${e.streak}|${e.best}`,
    b = (e) => {
      if (f) return f;
      u = t();
      let r = n(e)
        .catch(() => ({ ok: !1, error: `offline` }))
        .then((e) => (e.ok && (p = e.value), e))
        .finally(() => {
          f = null;
        });
      return ((f = r), r);
    },
    x = () => {
      (clearTimeout(s), (s = void 0));
    },
    S = (e = P) => {
      if (i || !a || s !== void 0) return;
      let n = Math.max(e, u + _ - t());
      s = setTimeout(() => {
        ((s = void 0), C());
      }, n);
    },
    C = async () => {
      if (i || !a || !m()) return;
      let e = h();
      if (!e || g(e) === c) return;
      let t = await b(e);
      !i && a && (t.ok ? ((c = g(e)), (d = 0)) : t.error === `auth` ? (d = 0) : ((d += 1), d <= 3 && S(_)));
    },
    w = () => {
      if (i || !a) return;
      let e = h();
      e && g(e) !== c && S();
    },
    T = () => {
      a || i || ((a = !0), (d = 0), (o = e.subscribe(w)), w());
    },
    E = () => {
      ((a = !1), o?.(), (o = null), x(), (c = ``), (p = null));
    },
    D = () => {
      m() ? T() : E();
    };
  D();
  let O = r.onChange(D);
  return {
    submitNow() {
      if (i || !m()) return Promise.resolve({ ok: !1, error: `auth` });
      let e = h(),
        t = b(e ?? {});
      return (
        e &&
          t.then((t) => {
            t.ok && ((c = g(e)), (d = 0), x());
          }),
        t
      );
    },
    poke: w,
    last: () => p,
    dispose() {
      ((i = !0), E(), O());
    },
  };
}
var L = e({ openRankDialog: () => Q }),
  R = `Bảng xếp hạng`,
  z = `Những người giữ lửa công phu cùng chùa.`,
  B = `Hiện tôi trên bảng xếp hạng`,
  V = `Đăng nhập để có tên trên bảng`,
  H = `Bạn đang xem với tư cách khách. Đăng nhập để tên bạn có trên bảng.`,
  U = `Tuần mới bắt đầu lúc 0 giờ thứ Hai`,
  W = `Chưa tải được bảng xếp hạng, bạn thử lại nhé.`,
  G = `Thử lại`,
  K = `Chưa lưu được. Bạn thử lại nhé.`,
  q = `Chưa lấy được hạng của bạn lúc này. Bảng vẫn xem được.`,
  J = `Phiên đăng nhập đã hết hạn. Đăng nhập lại để tên bạn có trên bảng.`,
  Y = `Bạn`,
  ee = {
    tuan: `Tuần này chưa có ai lên bảng. Một nén hương, một lần tụng niệm là bạn có thể là người đầu tiên.`,
    lua: `Chưa có ai giữ lửa trong mấy ngày gần đây. Bạn công phu hôm nay là thắp ngọn đầu tiên.`,
    cap: `Bảng này còn trống. Bạn công phu một chút là có tên ở đây.`,
  },
  X = [
    { id: `tuan`, label: `Tuần này` },
    { id: `lua`, label: `Giữ lửa` },
    { id: `cap`, label: `Cấp` },
  ];
function te(e, t) {
  switch (e.note) {
    case `ok`: {
      let n = e.ranks[t];
      return n === null
        ? t === `tuan`
          ? `Bạn sẽ có mặt ở bảng tuần này khi có thêm tinh tấn.`
          : t === `lua`
            ? `Bạn sẽ có mặt ở bảng này khi đang giữ lửa.`
            : `Bạn chưa có mặt ở bảng này.`
        : `Bạn đang hạng ${n}`;
    }
    case `hidden`:
      return `Bạn đang ẩn trên bảng. Bật công tắc bên dưới là tên bạn hiện lại.`;
    case `empty`:
      return `Chùa chưa nhận số liệu nào của bạn. Công phu một chút là tên bạn lên bảng.`;
    case `name`:
      return `Pháp danh của bạn chưa qua bộ lọc tên nên chưa lên bảng. Bạn đổi tên ở Cài đặt nhé.`;
    case `implausible`:
      return `Số liệu của bạn vượt mức chùa ghi nhận được nên chưa lên bảng.`;
    case `removed`:
      return `Bạn đã được gỡ khỏi bảng xếp hạng. Cần hỏi lại thì bạn gửi Góp ý nhé.`;
  }
}
function ne(e) {
  return String(Math.max(0, Math.floor(e))).replace(/\B(?=(\d{3})+(?!\d))/g, `.`);
}
var Z = null,
  re = `button:not([disabled]), input:not([disabled]), a[href], [role="tab"][tabindex="0"]`;
function ie(e) {
  let t = X.map(
      (e, t) =>
        `<button type="button" class="rank-dlg__tab" role="tab" id="rank-tab-${e.id}" data-tab="${e.id}" aria-controls="rank-panel" aria-selected="${t === 0}" tabindex="${t === 0 ? 0 : -1}">${e.label}</button>`,
    ).join(``),
    n =
      (e
        ? `<label class="rank-dlg__switch" data-ref="switch"><span class="rank-dlg__switch-text">${B}</span>
         <input class="rank-dlg__switch-input" type="checkbox" role="switch" data-ref="show" checked disabled />
         <span class="rank-dlg__switch-track" aria-hidden="true"></span></label>`
        : ``) +
      `<button type="button" class="btn btn--gold rank-dlg__login" data-ref="login"${e ? ` hidden` : ``}>${V}</button>`;
  return `
    <div class="rank-dlg__card">
      <header class="rank-dlg__head">
        <div class="rank-dlg__heading">
          <h2 id="rank-title" class="rank-dlg__title" tabindex="-1">${o(`trophy`, { size: 22 })}<span>${R}</span></h2>
          <p class="rank-dlg__sub">${z}</p>
        </div>
        <button type="button" class="rank-dlg__close" data-ref="close" aria-label="Đóng">${o(`close`)}</button>
      </header>
      <div class="rank-dlg__tabs" role="tablist" data-ref="tabs" aria-label="${R}">${t}</div>
      <p class="rank-dlg__week" data-ref="week"></p>
      <div class="rank-dlg__body" data-ref="body">
        <div class="rank-dlg__panel" id="rank-panel" role="tabpanel" aria-labelledby="rank-tab-tuan" data-ref="panel" aria-busy="true"></div>
      </div>
      <footer class="rank-dlg__foot">
        <p class="rank-dlg__status" role="status" aria-live="polite" data-ref="status"></p>
        ${n}
      </footer>
    </div>`;
}
function Q(e = {}) {
  Z?.isConnected && n(Z);
  let o = (e.signedIn ?? a)(),
    l = e.fetchBoard ?? ((e) => j(e)),
    u = e.submit ?? ((e) => M(e)),
    d = e.opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null),
    h = document.createElement(`dialog`);
  ((h.className = `rank-dlg`),
    h.setAttribute(`aria-labelledby`, `rank-title`),
    (h.innerHTML = ie(o)),
    document.body.append(h),
    (Z = h));
  let g = (e) => h.querySelector(`[data-ref="${e}"]`),
    _ = g(`body`),
    v = g(`panel`),
    y = g(`status`),
    b = h.querySelector(`#rank-title`),
    x = Array.from(h.querySelectorAll(`[role="tab"]`)),
    S = h.querySelector(`[data-ref="show"]`),
    C = h.querySelector(`[data-ref="login"]`),
    T = !1,
    E = e.tab && w(e.tab) ? e.tab : `tuan`,
    D = null,
    O = !1,
    k = new Map(),
    A = null,
    N = (e, t) => {
      let n = document.createElement(`li`),
        r = D !== null && D.h === e.h;
      ((n.className = `rank-row${r ? ` is-me` : ``}`),
        (n.dataset.h = e.h),
        r && n.setAttribute(`aria-current`, `true`));
      let i = document.createElement(`span`);
      ((i.className = `rank-row__pos${t < 3 ? ` rank-row__pos--${t + 1}` : ``}`),
        (i.textContent = String(t + 1)));
      let a = document.createElement(`span`);
      a.className = `rank-row__who`;
      let o = document.createElement(`span`);
      o.className = `rank-row__nameline`;
      let s = document.createElement(`span`);
      if (((s.className = `rank-row__name`), (s.textContent = e.name), o.append(s), r)) {
        let e = document.createElement(`span`);
        ((e.className = `rank-row__you`), (e.textContent = Y), o.append(e));
      }
      let c = document.createElement(`span`);
      ((c.className = `rank-row__tier`), (c.textContent = f(e.level).name), a.append(o, c));
      let l = document.createElement(`span`);
      if (((l.className = `rank-row__value`), E === `tuan`)) l.textContent = `${ne(e.weekXp)} tinh tấn`;
      else if (E === `lua`) {
        let t = document.createElement(`span`);
        ((t.className = `flame-box rank-row__flame`), (t.innerHTML = p), m(t, e.streak, !0));
        let n = document.createElement(`span`);
        ((n.textContent = `${e.streak} ngày`), l.append(t, n));
      } else l.textContent = `Cấp ${e.level}`;
      return (n.append(i, a, l), n);
    },
    P = (e, t = !1) => {
      let n = document.createElement(`div`);
      n.className = `rank-dlg__empty`;
      let r = document.createElement(`p`);
      if (((r.textContent = e), n.append(r), t)) {
        let e = document.createElement(`button`);
        ((e.type = `button`),
          (e.className = `btn`),
          (e.dataset.ref = `retry`),
          (e.textContent = G),
          e.addEventListener(`click`, () => {
            ((A = null), z(E));
          }),
          n.append(e));
      }
      return n;
    },
    F = () => {
      let e = ``;
      (!o || O ? (e = O ? J : H) : D && (e = te(D, E)), (y.textContent = e));
    },
    I = () => {
      (v.setAttribute(`aria-labelledby`, `rank-tab-${E}`), v.replaceChildren());
      let e = k.get(E);
      if (e) {
        if ((v.setAttribute(`aria-busy`, `false`), e.rows.length === 0)) v.append(P(ee[E]));
        else {
          let t = document.createElement(`ol`);
          ((t.className = `rank-list`),
            t.setAttribute(`aria-label`, X.find((e) => e.id === E)?.label ?? `Bảng xếp hạng`),
            e.rows.forEach((e, n) => t.append(N(e, n))),
            v.append(t));
        }
        g(`week`).textContent = E === `tuan` ? U : ``;
      } else if ((v.setAttribute(`aria-busy`, String(A !== E)), A === E)) v.append(P(W, !0));
      else {
        let e = document.createElement(`p`);
        ((e.className = `rank-dlg__loading`), (e.textContent = `Đang mở bảng…`), v.append(e));
      }
    },
    L = () => {
      let e = v.querySelector(`.rank-row.is-me`);
      e && t(_, e, 80);
    },
    R = () => {
      (I(), F(), L());
    };
  async function z(e) {
    if (k.has(e)) return;
    let t = await l(e);
    T || (t.ok ? k.set(e, t.value) : (A = e), E === e && R());
  }
  let B = (e, t) => {
    E = e;
    for (let n of x) {
      let r = n.dataset.tab === e;
      (n.setAttribute(`aria-selected`, String(r)),
        (n.tabIndex = r ? 0 : -1),
        r && t && n.focus({ preventScroll: !0 }));
    }
    ((_.scrollTop = 0), A === e && (A = null), R(), z(e));
  };
  for (let e of x) e.addEventListener(`click`, () => B(e.dataset.tab, !1));
  g(`tabs`).addEventListener(`keydown`, (e) => {
    let t = e,
      n = x.findIndex((e) => e.dataset.tab === E),
      r = -1;
    (t.key === `ArrowRight` || t.key === `ArrowDown`
      ? (r = (n + 1) % x.length)
      : t.key === `ArrowLeft` || t.key === `ArrowUp`
        ? (r = (n - 1 + x.length) % x.length)
        : t.key === `Home`
          ? (r = 0)
          : t.key === `End` && (r = x.length - 1),
      r < 0 || (t.preventDefault(), B(x[r]?.dataset.tab, !0)));
  });
  let V = (e) => {
    ((D = e), (O = !1), S && ((S.checked = e.shown), (S.disabled = !1)), R());
  };
  (S?.addEventListener(`change`, () => {
    let e = S.checked;
    ((S.disabled = !0),
      u({ show: e }).then((t) => {
        if (!T) {
          if (((S.disabled = !1), t.ok)) {
            V(t.value);
            for (let e of [...k.keys()]) e !== E && k.delete(e);
          } else ((S.checked = !e), (y.textContent = K));
        }
      }));
  }),
    C?.addEventListener(`click`, () => {
      (Q(), (e.openLogin ?? (() => c({ reason: `rank`, onFail: e.onFail })))());
    }));
  function Q() {
    h.isConnected && n(h);
  }
  return (
    g(`close`).addEventListener(`click`, Q),
    i(h),
    h.addEventListener(`keydown`, (e) => {
      if (e.key === `Escape` && !e.isComposing) (e.preventDefault(), Q());
      else if (e.key === `Tab`) {
        let t = Array.from(h.querySelectorAll(re)).filter((e) => !e.closest(`[hidden]`)),
          n = t[0],
          r = t[t.length - 1];
        if (!n || !r) return;
        let i = document.activeElement,
          a = !h.contains(i);
        e.shiftKey && (i === n || a || i === b)
          ? (e.preventDefault(), r.focus())
          : !e.shiftKey && (i === r || a) && (e.preventDefault(), n.focus());
      }
    }),
    h.addEventListener(`close`, () => {
      ((T = !0), h.remove(), Z === h && (Z = null), d?.isConnected && d.focus({ preventScroll: !0 }));
    }),
    r(h),
    b.focus({ preventScroll: !0 }),
    s(`rank_open`, { place: e.place ?? `bar`, signed_in: o }),
    B(E, !1),
    o &&
      (async () => {
        let t;
        try {
          t = (await e.getSync?.()) ?? null;
        } catch {
          t = null;
        }
        let n = t ? await t.submitNow() : await u({});
        T ||
          (n.ok
            ? V(n.value)
            : n.error === `auth`
              ? ((O = !0), S && (S.disabled = !0), (g(`switch`).hidden = !0), C && (C.hidden = !1), F())
              : (y.textContent = q));
      })(),
    { element: h, close: Q }
  );
}
var ae = e({ mountRankSettings: () => le }),
  oe = `Hiện tôi trên bảng xếp hạng`,
  $ = `Bảng xếp hạng công khai chỉ hiện tên, cấp, chuỗi giữ lửa và tinh tấn tuần của người đã đăng nhập. Tắt thì tên bạn không hiện trên bảng.`,
  se = `Chưa đọc được công tắc này. Bạn mở lại Cài đặt sau nhé.`,
  ce = `Chưa lưu được. Bạn thử lại nhé.`;
function le(e, t = {}) {
  let n = t.submit ?? M;
  ((e.innerHTML = `
    <div class="set-item">
      <label class="set-switch">
        <span class="set-switch__text">${oe}</span>
        <input class="set-switch__input" type="checkbox" role="switch" aria-describedby="set-rank-hint" data-ref="rankShow" disabled />
        <span class="set-switch__track" aria-hidden="true"></span>
      </label>
      <p class="set-hint" id="set-rank-hint" data-ref="rankHint">${$}</p>
    </div>`),
    (e.hidden = !1));
  let r = e.querySelector(`[data-ref="rankShow"]`),
    i = e.querySelector(`[data-ref="rankHint"]`);
  ((r.checked = !0),
    n({}).then((t) => {
      e.isConnected && (t.ok ? ((r.checked = t.value.shown), (r.disabled = !1)) : (i.textContent = se));
    }),
    r.addEventListener(`change`, () => {
      let t = r.checked;
      ((r.disabled = !0),
        n({ show: t }).then((n) => {
          e.isConnected &&
            ((r.disabled = !1),
            n.ok
              ? ((r.checked = n.value.shown), (i.textContent = $))
              : ((r.checked = !t), (i.textContent = ce)));
        }));
    }));
}
export { L as n, N as r, ae as t };
