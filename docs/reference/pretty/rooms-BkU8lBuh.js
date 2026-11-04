const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./account-B3fmTrbD.js",
      "./rolldown-runtime-DK3Fl9T5.js",
      "./preload-helper-CRzLMJPS.js",
      "./dialog-DwXghOMX.js",
      "./index-e_Bx6V48.js",
      "./referral-CM6Fj8ux.js",
      "./index-C_1YXvDN.css",
      "./lazy-shared-D8DtrU9N.js",
      "./app-z_oU8L_u.js",
      "./progress-core-C9e35Hb5.js",
      "./three-BbSp8N3g.js",
      "./sky-X0ndF2_S.js",
      "./layout-DpGLadzd.js",
      "./lanterns-DsoFXr0b.js",
      "./vn-time-DznqUr4I.js",
      "./music-mix-9H0C50bM.js",
      "./app-DmNuXdg1.css",
      "./account-BGP7C-gf.css",
      "./friends-AJd_o965.js",
      "./friends-CB78mI0D.css",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { Xt as t, gt as n, zt as r } from "./index-e_Bx6V48.js";
import { E as i } from "./lazy-shared-D8DtrU9N.js";
import { F as a, I as o, R as s, V as c, tt as l } from "./app-z_oU8L_u.js";
import { _ as u, h as d, p as f } from "./progress-core-C9e35Hb5.js";
import { t as p } from "./preload-helper-CRzLMJPS.js";
import { n as m, o as h, r as g } from "./dialog-DwXghOMX.js";
var _ = `/api/rooms`,
  v = 500,
  y = 40;
function b(e) {
  if (!e) return _;
  let [t = ``, ...n] = e.split(/(?=[?#])/);
  return /\/lobby$/.test(t) ? `${t.slice(0, -6)}/rooms${n.join(``)}` : _;
}
function x() {
  return b(void 0);
}
function S(e) {
  if (typeof e != `object` || !e) return null;
  let { room: t, label: n, count: r, capacity: i } = e;
  return typeof t != `number` ||
    !Number.isInteger(t) ||
    t < 1 ||
    t > 999 ||
    typeof i != `number` ||
    !Number.isInteger(i) ||
    i < 1 ||
    typeof r != `number` ||
    !Number.isFinite(r) ||
    r < 0
    ? null
    : {
        room: t,
        label: typeof n == `string` && n.trim() !== `` && n.length <= y ? n : `Phòng ${t}`,
        count: Math.min(Math.floor(r), i),
        capacity: i,
      };
}
function C(e) {
  let t = e?.rooms;
  if (!Array.isArray(t)) return [];
  let n = new Set(),
    r = [];
  for (let e of t.slice(0, v)) {
    let t = S(e);
    t === null || n.has(t.room) || (n.add(t.room), r.push(t));
  }
  return r.sort((e, t) => e.room - t.room);
}
async function w(e = {}) {
  let { signal: t } = e;
  if (t?.aborted) return [];
  let n = new AbortController(),
    r = () => n.abort();
  t?.addEventListener(`abort`, r, { once: !0 });
  let a,
    o = new Promise((t, r) => {
      ((a = setTimeout(() => {
        (n.abort(), r(Error(`rooms timeout`)));
      }, e.timeoutMs ?? 3e3)),
        n.signal.addEventListener(`abort`, () => r(Error(`rooms aborted`)), { once: !0 }));
    }),
    s = e.fetchImpl ?? ((e, t) => fetch(e, t)),
    c = async () => {
      let t = e.url ?? x(),
        r = await s(t, { signal: n.signal, headers: i(t, { accept: `application/json` }) });
      return r.ok ? C(await r.json()) : [];
    };
  try {
    return await Promise.race([c(), o]);
  } catch {
    return [];
  } finally {
    (a !== void 0 && clearTimeout(a), t?.removeEventListener(`abort`, r));
  }
}
var T = [
    { minutes: 60, label: `1 giờ` },
    { minutes: 1440, label: `1 ngày` },
    { minutes: 10080, label: `7 ngày` },
    { minutes: 43200, label: `30 ngày` },
  ],
  E = 1440;
function ee(e) {
  return typeof e == `string`
    ? e
        .replace(/[\u0000-\u001f\u007f]+/g, ` `)
        .trim()
        .slice(0, 120)
    : ``;
}
function D(e) {
  let t = e.split(`.`)[1];
  if (!t) return null;
  try {
    let e = t.replace(/-/g, `+`).replace(/_/g, `/`),
      n = Uint8Array.from(atob(e.padEnd(Math.ceil(e.length / 4) * 4, `=`)), (e) => e.charCodeAt(0)),
      r = JSON.parse(new TextDecoder().decode(n));
    return typeof r == `object` && r ? r : null;
  } catch {
    return null;
  }
}
function O(e) {
  let t = D(e)?.app_metadata;
  return typeof t == `object` && !!t && t.role === `admin`;
}
function k(e) {
  try {
    let t = (e ?? localStorage).getItem(r);
    if (t === null) return !1;
    let n = JSON.parse(t)?.access_token;
    return typeof n == `string` && O(n);
  } catch {
    return !1;
  }
}
var A = {
    forbidden: `Bạn không có quyền quản trị, hoặc phiên đăng nhập đã hết hạn.`,
    "not-found": `Người này đã rời phòng.`,
    rate: `Thao tác nhanh quá, thử lại sau.`,
    network: `Không kết nối được.`,
    server: `Máy chủ đang bận, thử lại sau.`,
  },
  j = `/api/admin/ban`,
  M = `/api/admin/bans`,
  N = (e) => ({ ok: !1, error: e });
function te(e = {}) {
  let t =
    e.getToken ??
    (async () =>
      (
        await p(
          async () => {
            let { accessToken: e } = await import(`./account-B3fmTrbD.js`).then((e) => e.x);
            return { accessToken: e };
          },
          __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
          import.meta.url,
        )
      ).accessToken());
  async function n(n, r, a, o) {
    let s;
    try {
      s = await t();
    } catch {
      return N(`network`);
    }
    if (s === null) return N(`forbidden`);
    let c;
    try {
      c = await (e.fetchImpl ?? ((e, t) => fetch(e, t)))(r, {
        method: n,
        cache: `no-store`,
        headers: i(r, {
          accept: `application/json`,
          authorization: `Bearer ${s}`,
          ...(a === void 0 ? {} : { "content-type": `application/json` }),
        }),
        ...(a === void 0 ? {} : { body: JSON.stringify(a) }),
      });
    } catch {
      return N(`network`);
    }
    let l = await c.text().catch(() => ``),
      u = null;
    try {
      u = JSON.parse(l);
    } catch {}
    if (c.status === 429) return N(`rate`);
    if (c.status === 404) {
      let e = u?.error;
      return N(e === `not-found` ? `not-found` : `forbidden`);
    }
    if (!c.ok) return N(`server`);
    let d = o(u);
    return d === null ? N(`server`) : { ok: !0, value: d };
  }
  let r = (e) => typeof e == `object` && !!e;
  return {
    ban: (e) => n(`POST`, j, e, (e) => (r(e) && e.ok === !0 && typeof e.until == `number` ? e : null)),
    list: () => n(`GET`, M, void 0, (e) => (r(e) && Array.isArray(e.bans) ? e.bans : null)),
    unban: (e) =>
      n(`DELETE`, `${M}/${encodeURIComponent(e)}`, void 0, (e) => (r(e) && e.ok === !0 ? !0 : null)),
  };
}
function P(e, t) {
  let n = e - t;
  if (!(n > 0)) return `sắp hết hạn`;
  let r = Math.ceil(n / 6e4);
  if (r < 60) return `còn ${r} phút`;
  let i = Math.floor(r / 60);
  return i < 24 ? `còn ${i} giờ` : `còn ${Math.floor(i / 24)} ngày`;
}
var F = `Chặn theo mạng (IP) ở mọi phòng. Người dùng chung wifi/4G có thể bị chặn theo.`;
function I(e) {
  return T.find((t) => t.minutes === e)?.label ?? `${e} phút`;
}
var L = (e, t, n) => {
  let r = document.createElement(e);
  return ((r.className = t), n !== void 0 && (r.textContent = n), r);
};
function R(e) {
  let t = e.now ?? Date.now,
    n = !1,
    r = !1,
    i = null,
    a = 0,
    o = (e) => ((e.dataset.banCtl = ``), e),
    s = (t) => {
      ((r = t), e.scope.toggleAttribute(`data-busy`, t));
      for (let n of e.scope.querySelectorAll(`[data-ban-ctl]`)) n.disabled = t;
    },
    c = L(`div`, `rooms__admin-top`),
    l = L(`p`, `rooms__ban-status`);
  (l.setAttribute(`role`, `status`), l.setAttribute(`aria-live`, `polite`));
  let u = (e, t = ``) => {
      ((l.textContent = e), (l.dataset.tone = t));
    },
    d = L(`section`, `rooms__ban`);
  ((d.hidden = !0), d.setAttribute(`aria-labelledby`, `ban-title`));
  let f = L(`h3`, `rooms__ban-title`);
  ((f.id = `ban-title`), (f.tabIndex = -1));
  let p = L(`div`, `rooms__ban-durations`);
  (p.setAttribute(`role`, `radiogroup`), p.setAttribute(`aria-label`, `Thời gian ban`));
  for (let e of T) {
    let t = L(`label`, `rooms__chip`),
      n = o(document.createElement(`input`));
    ((n.type = `radio`),
      (n.name = `ban-minutes`),
      (n.value = String(e.minutes)),
      (n.checked = e.minutes === E),
      t.append(n, L(`span`, ``, e.label)),
      p.append(t));
  }
  let m = o(L(`input`, `rooms__field`));
  ((m.type = `text`),
    (m.maxLength = 120),
    (m.placeholder = `Lý do (tuỳ chọn, chỉ quản trị viên thấy)`),
    m.setAttribute(`aria-label`, `Lý do (tuỳ chọn)`),
    (m.autocomplete = `off`));
  let h = L(`a`, `rooms__link`, `Nội quy`);
  ((h.href = `/noi-quy/`), (h.target = `_blank`), (h.rel = `noopener`));
  let g = o(L(`button`, `rooms__btn`, `Huỷ`));
  g.type = `button`;
  let _ = o(L(`button`, `rooms__btn rooms__btn--ban`, `Ban`));
  _.type = `button`;
  let v = L(`div`, `rooms__actions`);
  v.append(g, _);
  let y = L(`div`, `rooms__ban-foot`);
  (y.append(h, v), d.append(f, L(`p`, `rooms__ban-note`, F), p, m, y), c.append(l, d));
  let b = () => {
      let e = p.querySelector(`input:checked`);
      return e ? Number(e.value) : E;
    },
    x = () => {
      if (d.hidden || i === null) return;
      let t = i;
      ((d.hidden = !0), (i = null), e.onPanelClosed?.(t));
    };
  (g.addEventListener(`click`, () => {
    r || x();
  }),
    _.addEventListener(`click`, () => {
      if (r || i === null) return;
      let t = i,
        o = b(),
        c = ee(m.value),
        l = { room: a, peer: Number(t.id), minutes: o, ...(c === `` ? {} : { reason: c }) };
      (s(!0),
        (_.textContent = `Đang ban…`),
        e.api.ban(l).then((e) => {
          if (n) return;
          if (((_.textContent = `Ban`), s(!1), !e.ok)) {
            u(A[e.error], `error`);
            return;
          }
          let r = e.value.name || t.name;
          (u(
            e.value.ipBanned
              ? `Đã ban ${r} trong ${I(o)}.`
              : `Đã đưa ${r} ra khỏi phòng, nhưng chưa chặn được theo mạng (không thấy địa chỉ).`,
            `ok`,
          ),
            x(),
            O && M());
        }));
    }));
  let S = L(`div`, `rooms__admin`),
    C = o(L(`button`, `rooms__admin-toggle`));
  ((C.type = `button`), C.setAttribute(`aria-expanded`, `false`));
  let w = L(`span`, `rooms__admin-chev`, `›`);
  (w.setAttribute(`aria-hidden`, `true`), C.append(`Đang ban `, w));
  let D = L(`div`, `rooms__bans`);
  ((D.hidden = !0), S.append(C, D));
  let O = !1,
    k = 0,
    j = (i) => {
      if (i.length === 0) {
        D.replaceChildren(L(`p`, `rooms__hint`, `Chưa ai đang bị ban.`));
        return;
      }
      let a = L(`ul`, `rooms__bans-list`);
      for (let c of [...i].sort((e, t) => t.at - e.at)) {
        let i = L(`li`, `rooms__bans-item`),
          l = L(`div`, `rooms__bans-info`);
        (l.append(
          L(`span`, `rooms__bans-name`, c.name),
          L(`span`, `rooms__bans-meta`, `Phòng ${c.room} · ${P(c.until, t())}`),
        ),
          c.reason && l.append(L(`span`, `rooms__bans-meta`, `Lý do: ${c.reason}`)));
        let d = o(L(`button`, `rooms__btn rooms__bans-undo`, `Gỡ ban`));
        ((d.type = `button`),
          d.setAttribute(`aria-label`, `Gỡ ban ${c.name}`),
          (d.disabled = r),
          d.addEventListener(`click`, () => {
            r ||
              (s(!0),
              e.api.unban(c.id).then((e) => {
                n ||
                  (s(!1),
                  e.ok || e.error === `not-found`
                    ? (u(`Đã gỡ ban ${c.name}.`, `ok`), M())
                    : u(A[e.error], `error`));
              }));
          }),
          i.append(l, d),
          a.append(i));
      }
      D.replaceChildren(a);
    };
  async function M() {
    let t = ++k;
    D.childElementCount === 0 && D.replaceChildren(L(`p`, `rooms__hint`, `Đang tải…`));
    let r = await e.api.list();
    !n && t === k && O && (r.ok ? j(r.value) : (D.replaceChildren(), u(A[r.error], `error`)));
  }
  return (
    C.addEventListener(`click`, () => {
      r || ((O = !O), C.setAttribute(`aria-expanded`, String(O)), (D.hidden = !O), O && M());
    }),
    {
      top: c,
      bottom: S,
      get busy() {
        return r;
      },
      openFor(e, t) {
        if (!r) {
          if (i?.id !== e.id) {
            for (let e of p.querySelectorAll(`input`)) e.checked = Number(e.value) === E;
            m.value = ``;
          }
          ((i = e), (a = t), u(``), (f.textContent = `Ban ${e.name}`), (d.hidden = !1), f.focus());
        }
      },
      syncRoom(e) {
        i !== null && e !== a && x();
      },
      dispose() {
        n = !0;
      },
    }
  );
}
var z = e({
  DEFAULT_ROOM_CAPACITY: () => 100,
  openPeopleDialog: () => re,
  openRoomsDialog: () => W,
  peopleSummary: () => K,
  roomCardState: () => V,
  roomNumberFromLabel: () => B,
  sortPeople: () => Y,
});
function B(e) {
  let t = /(\d{1,3})\s*$/.exec(e ?? ``);
  if (!t?.[1]) return null;
  let n = Number(t[1]);
  return Number.isInteger(n) && n >= 1 ? n : null;
}
function V(e, t) {
  return e.room === t ? `current` : e.count >= e.capacity ? `full` : `open`;
}
var H = { current: `Đang dùng`, full: `Đầy`, open: `` },
  U = null;
function W(e) {
  let t = e.fetchRooms ?? w,
    r = null,
    i = !1,
    { dialog: a, close: o } = G(
      `rooms`,
      `
    <div class="rooms__card" data-ref="roomsView">
      <header class="rooms__head">
        <h2 id="rooms-title" class="rooms__title">Chọn phòng</h2>
        <button type="button" class="rooms__tab" data-ref="friendsTab">${n(`users`)}<span>Bạn đạo</span></button>
        <button type="button" class="rooms__close" data-ref="close" aria-label="Đóng">${n(`close`)}</button>
      </header>
      <p class="rooms__hint">Mỗi phòng chứa tối đa ${e.capacity ?? 100} người. Số người chỉ là ước chừng.</p>
      <ul class="rooms__grid" data-ref="grid"></ul>
      <footer class="rooms__foot">
        <p class="rooms__status" role="status" aria-live="polite" data-ref="status"></p>
        <button type="button" class="rooms__refresh" data-ref="refresh">${n(`reset`)}<span>Làm mới</span></button>
      </footer>
    </div>
    <div class="rooms__card" data-ref="friendsView" hidden></div>`,
      () => {
        ((i = !0), r?.abort(), v?.dispose(), e.onClose?.());
      },
    );
  a.setAttribute(`aria-labelledby`, `rooms-title`);
  let s = (e) => a.querySelector(`[data-ref="${e}"]`),
    c = s(`grid`),
    l = s(`status`),
    u = s(`refresh`),
    d = (t) => {
      let n = V(t, e.currentRoom),
        r = document.createElement(`li`),
        i = document.createElement(`button`);
      ((i.type = `button`),
        (i.className = `rooms__room`),
        (i.dataset.room = String(t.room)),
        (i.dataset.state = n));
      let a = n === `open` && e.onSelect !== void 0;
      (n === `current` && i.setAttribute(`aria-current`, `true`),
        a || i.setAttribute(`aria-disabled`, `true`));
      let s = document.createElement(`span`);
      ((s.className = `rooms__name`), (s.textContent = t.label));
      let c = document.createElement(`span`);
      ((c.className = `rooms__count`), (c.textContent = `khoảng ${t.count}/${t.capacity}`), i.append(s, c));
      let l = H[n];
      if (l) {
        let e = document.createElement(`span`);
        ((e.className = `rooms__badge`), (e.textContent = l), i.append(e));
      }
      return (
        i.addEventListener(`click`, () => {
          a ? (o(), e.onSelect?.(t.room)) : n === `current` && o();
        }),
        r.append(i),
        r
      );
    },
    f = (t) => {
      let n = [...t],
        r = e.currentRoom;
      (r !== null &&
        !n.some((e) => e.room === r) &&
        (n.push({
          room: r,
          label: `Phòng ${r}`,
          count: Math.max(0, e.online ?? 1),
          capacity: e.capacity ?? 100,
        }),
        n.sort((e, t) => e.room - t.room)),
        c.replaceChildren(...n.map(d)));
    };
  async function m() {
    r?.abort();
    let n = new AbortController();
    ((r = n), u.setAttribute(`aria-disabled`, `true`), (l.textContent = `Đang tải danh sách…`));
    let a = await t({ signal: n.signal });
    i ||
      r !== n ||
      (u.removeAttribute(`aria-disabled`),
      a.length > 0
        ? ((l.textContent = ``), f(a))
        : ((l.textContent =
            e.currentRoom === null
              ? `Chưa lấy được danh sách phòng. Bạn thử lại sau nhé.`
              : `Chưa lấy được danh sách phòng. Bạn vẫn đang ở Phòng ${e.currentRoom}.`),
          f([])));
  }
  u.addEventListener(`click`, () => {
    u.getAttribute(`aria-disabled`) !== `true` && m();
  });
  let h = s(`roomsView`),
    g = s(`friendsView`),
    _ = s(`friendsTab`),
    v = null,
    y = !1,
    b = () => {
      (v?.pause(),
        (g.hidden = !0),
        (h.hidden = !1),
        a.setAttribute(`aria-labelledby`, `rooms-title`),
        _.focus({ preventScroll: !0 }));
    },
    x = () => {
      i ||
        y ||
        (v
          ? ((h.hidden = !0), (g.hidden = !1), a.setAttribute(`aria-labelledby`, `friends-title`), v.resume())
          : ((y = !0),
            (l.textContent = `Đang mở Bạn đạo…`),
            p(
              async () => {
                let { mountFriendsPanel: e } = await import(`./friends-AJd_o965.js`).then((e) => e.n);
                return { mountFriendsPanel: e };
              },
              __vite__mapDeps([18, 1, 3, 4, 2, 5, 6, 0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19]),
              import.meta.url,
            ).then(
              ({ mountFriendsPanel: n }) => {
                ((y = !1),
                  (l.textContent = ``),
                  i ||
                    ((v = n(g, {
                      currentRoom: e.currentRoom,
                      onSelect: e.onSelect
                        ? (t) => {
                            (o(), e.onSelect?.(t));
                          }
                        : void 0,
                      fetchRooms: t,
                      close: o,
                      back: b,
                      levelChip: Z,
                      streakChip: Q,
                    })),
                    x()));
              },
              () => {
                ((y = !1), i || (l.textContent = `Chưa mở được Bạn đạo. Bạn kiểm tra mạng rồi thử lại nhé.`));
              },
            )));
    };
  return (_.addEventListener(`click`, x), f([]), m(), e.friends && x(), { element: a, refresh: m, close: o });
}
function G(e, t, n) {
  U?.isConnected && m(U);
  let r = document.activeElement instanceof HTMLElement ? document.activeElement : null,
    i = document.createElement(`dialog`);
  ((i.className = e), (i.innerHTML = t));
  let a = !1,
    o = () => {
      a || m(i);
    };
  return (
    i.addEventListener(`close`, () => {
      ((a = !0), i.remove(), U === i && (U = null), r?.isConnected && r.focus({ preventScroll: !0 }), n());
    }),
    i.querySelector(`[data-ref="close"]`)?.addEventListener(`click`, o),
    g(i),
    (U = i),
    document.body.append(i),
    h(i),
    { dialog: i, close: o }
  );
}
function K(e) {
  return e.mode === `offline`
    ? `Bạn đang một mình trong chùa.`
    : e.mode === `connecting`
      ? `Đang vào phòng…`
      : `${e.roomLabel ?? `Trong phòng`} · ${e.online} người`;
}
var q = null,
  J = (e, t) => (q ??= new Intl.Collator(`vi`)).compare(e, t);
function Y(e) {
  return [...e].sort((e, t) =>
    !!e.self == !!t.self ? J(e.name, t.name) || (e.id < t.id ? -1 : +(e.id > t.id)) : e.self ? -1 : 1,
  );
}
function X(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; n++) {
    let r = e[n],
      i = t[n];
    if (
      !r ||
      !i ||
      r.id !== i.id ||
      r.name !== i.name ||
      r.activity !== i.activity ||
      !!r.self != !!i.self ||
      !!r.kol != !!i.kol ||
      d(r.level) !== d(i.level) ||
      r.streak !== i.streak
    )
      return !1;
  }
  return !0;
}
function Z(e) {
  let t = u(e),
    n = document.createElement(`span`);
  ((n.className = `rooms__lv`),
    (n.dataset.tier = String(t.id)),
    (n.title = f(e)),
    n.style.setProperty(`--tier`, t.color),
    n.style.setProperty(`--tier-accent`, t.accent));
  let r = document.createElement(`span`);
  return (
    r.setAttribute(`aria-hidden`, `true`),
    (r.textContent = `Cấp ${e}`),
    n.append(r, $(`sr-only`, f(e))),
    n
  );
}
function Q(e) {
  let t = l(e);
  if (!t) return null;
  let n = document.createElement(`span`);
  ((n.className = `rooms__streak`), (n.title = `Giữ lửa ${t} ngày`));
  let r = document.createElement(`span`);
  ((r.className = `flame-box`), (r.innerHTML = s), c(r, t, !0), (r.dataset.state = `show`));
  let i = $(`rooms__streak-num`, String(t));
  return (i.setAttribute(`aria-hidden`, `true`), n.append(r, i, $(`sr-only`, n.title)), n);
}
function $(e, t) {
  let n = document.createElement(`span`);
  return ((n.className = e), (n.textContent = t), n);
}
function ne(e, t, n) {
  let r = document.createElement(`li`);
  ((r.className = `rooms__person`), (r.dataset.personId = e.id));
  let i = $(`rooms__person-name`, e.name);
  ((i.title = e.name), r.append(i));
  let s = d(e.level);
  s !== void 0 && r.append(Z(s));
  let c = Q(e.streak);
  (c && r.append(c),
    e.kol && r.append(a(`rooms__kol`)),
    e.self && ((r.dataset.self = `true`), r.append($(`rooms__me`, `Tôi`))));
  let l = o[e.activity];
  if ((l && r.append($(`rooms__person-activity`, l)), t !== null && !e.self)) {
    r.dataset.ban = `true`;
    let t = document.createElement(`button`);
    ((t.type = `button`),
      (t.className = `rooms__ban-open`),
      (t.textContent = `Ban`),
      t.setAttribute(`aria-label`, `Ban ${e.name}`),
      (t.dataset.banCtl = ``),
      (t.disabled = n),
      r.append(t));
  }
  return r;
}
function re(e) {
  let r = e.admin ?? k(),
    i = null,
    { dialog: a, close: o } = G(
      `rooms rooms--people`,
      `
    <div class="rooms__card">
      <header class="rooms__head">
        <h2 id="people-title" class="rooms__title">Người trong chùa</h2>
        <button type="button" class="rooms__close" data-ref="close" aria-label="Đóng">${n(`close`)}</button>
      </header>
      <p class="rooms__summary" data-ref="summary"></p>
      <ul class="rooms__people" data-ref="list" aria-labelledby="people-title"></ul>
      <p class="rooms__hint">Chỉ tính người thật đang ở cùng phòng với bạn.</p>
      ${e.onSay && t.phrases ? `<button type="button" class="btn rooms__say" data-ref="say">Nói một câu</button>` : ``}
    </div>`,
      () => {
        (i?.dispose(), e.onClose?.(), s && e.onSay?.());
      },
    ),
    s = !1;
  (a.querySelector(`[data-ref="say"]`)?.addEventListener(`click`, () => {
    ((s = !0), o());
  }),
    a.setAttribute(`aria-labelledby`, `people-title`));
  let c = a.querySelector(`[data-ref="summary"]`),
    l = a.querySelector(`[data-ref="list"]`),
    u = null;
  if (r) {
    let t = R({
      api: e.banApi ?? te(),
      scope: a,
      onPanelClosed: (e) => {
        [...l.children]
          .find((t) => t.dataset.personId === e.id)
          ?.querySelector(`.rooms__ban-open`)
          ?.focus();
      },
    });
    ((i = t),
      c.after(t.top),
      a.querySelector(`.rooms__card`)?.append(t.bottom),
      l.addEventListener(`click`, (e) => {
        let n = (e.target instanceof Element ? e.target.closest(`.rooms__ban-open`) : null)?.closest(`li`)
            ?.dataset.personId,
          r = n === void 0 ? void 0 : f.find((e) => e.id === n);
        r && u !== null && t.openFor({ id: r.id, name: r.name }, u);
      }));
  }
  let d = [],
    f = [],
    p = ``,
    m = (e, t) => {
      let n = K(e);
      if (n === p && X(d, t)) return;
      d = t.map((e) => ({ ...e }));
      let r = Y(d);
      n !== p && ((p = n), (c.textContent = n));
      let a = i && e.mode === `online` ? B(e.roomLabel) : null;
      if ((i?.syncRoom(a), !X(f, r) || a !== u)) {
        ((f = r), (u = a));
        let e = i?.busy ?? !1;
        l.replaceChildren(...r.map((t) => ne(t, a, e)));
      }
    };
  return (m(e.status, e.people), { element: a, update: m, close: o });
}
export { z as t };
