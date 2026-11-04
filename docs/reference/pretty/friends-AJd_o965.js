import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { n as t, o as n, r } from "./dialog-DwXghOMX.js";
import { F as i, S as a, gt as o, x as s } from "./index-e_Bx6V48.js";
import {
  S as c,
  _ as l,
  c as u,
  d as ee,
  f as d,
  g as te,
  h as f,
  i as p,
  l as m,
  m as h,
  o as g,
  p as _,
  r as ne,
  s as v,
  u as y,
  v as b,
} from "./account-B3fmTrbD.js";
var x = e({ resumeFriendInvite: () => k });
function re() {
  return g() ?? { name: i()?.name ?? ``, level: null, streak: null };
}
function ie(e) {
  switch (e) {
    case `auth`:
      return `Phiên đăng nhập đã hết. Bạn đăng nhập lại nhé.`;
    case `invalid`:
      return `Lời mời không đúng. Bạn xin người mời gửi lại link nhé.`;
    case `used`:
      return `Lời mời này đã được dùng. Bạn xin người mời gửi link mới nhé.`;
    case `expired`:
      return `Lời mời đã hết hạn hoặc đã bị huỷ (link chỉ sống 24 giờ). Bạn xin người mời gửi link mới nhé.`;
    case `self`:
      return `Đây là lời mời của chính bạn. Gửi link này cho người bạn muốn kết bạn đạo nhé.`;
    case `full`:
      return `Bạn đã có đủ 50 bạn đạo. Bỏ bớt một người để thêm người mới.`;
    case `full-them`:
      return `Người mời đã có đủ 50 bạn đạo.`;
    case `too-many`:
      return `Bạn đã thử quá nhiều lần. Đợi khoảng một giờ rồi thử lại nhé.`;
    case `rate-limited`:
      return `Đang có quá nhiều yêu cầu. Bạn thử lại sau ít phút nhé.`;
    case `offline`:
      return `Không có mạng. Bạn kiểm tra kết nối rồi thử lại nhé.`;
    case `unavailable`:
      return `Chưa kết nối được Bạn đạo. Bạn thử lại sau nhé.`;
  }
}
var S = new Set([`invalid`, `used`, `expired`, `self`, `full`, `full-them`]),
  C = `Có người mời bạn làm bạn đạo ở Chùa Sen. Đăng nhập để nhận lời mời: bạn đạo thấy nhau đang ở phòng nào để đến cùng tu tập. Không có nhắn tin.`,
  w = `Bạn đạo thấy tên, cấp, ngọn lửa và phòng đang ở của nhau (tắt phần phòng trong Cài đặt). Không có nhắn tin. Bỏ bạn lúc nào cũng được, người kia không được báo.`,
  T = (e) => c().onChange((t) => e(t.status === `signed-in`)),
  E = null,
  D = new WeakSet();
function O(e, t) {
  let n = () => e.querySelector(`dialog[open], div[role="dialog"]`) !== null;
  if (!n()) {
    t();
    return;
  }
  let r = setInterval(() => {
    n() || (clearInterval(r), t());
  }, 1500);
}
function k(e = {}) {
  let t = d();
  return (t === null || O(e.doc ?? document, () => A(t, e)), Promise.resolve());
}
function A(e, i = {}) {
  let l = i.doc ?? document,
    d = i.signedIn ?? (() => a() !== null),
    te = i.peek ?? ee,
    f = i.accept ?? v;
  E?.isConnected && (D.add(E), t(E));
  let p = l.createElement(`dialog`);
  ((p.className = `friends-invite`),
    p.setAttribute(`aria-labelledby`, `friends-invite-title`),
    (p.innerHTML = `
    <div class="friends-invite__card">
      <header class="friends-invite__head">
        <h2 id="friends-invite-title" class="friends-invite__title">Lời mời kết bạn đạo</h2>
        <button type="button" class="friends-invite__close" data-ref="close" aria-label="Đóng">${o(`close`)}</button>
      </header>
      <p class="friends-invite__who" data-ref="who" role="status" aria-live="polite"></p>
      <p class="friends-invite__note" data-ref="note"></p>
      <div class="friends-invite__actions" data-ref="actions"></div>
    </div>`));
  let m = (e) => p.querySelector(`[data-ref="${e}"]`),
    h = m(`who`),
    g = m(`note`),
    _ = m(`actions`),
    y = () => t(p),
    b = !1,
    x = !1,
    k = (i.onAccountChange ?? T)((e) => {
      e && x && p.isConnected && I();
    });
  (p.addEventListener(`close`, () => {
    (k(), !b && !D.has(p) && u(), p.remove(), E === p && (E = null));
  }),
    m(`close`).addEventListener(`click`, y),
    r(p));
  let j = (e, t, n = !1) => {
      let r = l.createElement(`button`);
      return (
        (r.type = `button`),
        (r.className = n ? `btn` : `btn btn--ghost`),
        (r.textContent = e),
        r.addEventListener(`click`, t),
        r
      );
    },
    M = (...e) => {
      (_.replaceChildren(...e), e[0]?.focus({ preventScroll: !0 }));
    },
    N = () => {
      (u(), y());
    };
  function P(t) {
    ((x = !0),
      (h.textContent = t),
      (g.textContent = ``),
      M(
        j(
          `Đăng nhập`,
          () => {
            ((b = !0), y());
            let t = c().onChange((n) => {
              n.status === `signed-in` && (t(), O(l, () => A(e, i)));
            });
            s({ reason: `settings`, onFail: () => t() });
          },
          !0,
        ),
        j(`Để sau`, N),
      ));
  }
  function F(e) {
    e === `auth`
      ? P(`Phiên đăng nhập đã hết. Bạn đăng nhập lại để nhận lời mời nhé.`)
      : ((h.textContent = ie(e)),
        (g.textContent = ``),
        S.has(e)
          ? (u(), M(j(`Đóng`, y, !0)))
          : M(
              j(`Thử lại`, () => void I(), !0),
              j(`Để sau`, N),
            ));
  }
  async function ae(t) {
    for (let e of _.querySelectorAll(`button`)) e.disabled = !0;
    h.textContent = `Đang nhận lời…`;
    let n = await f(e, re());
    p.isConnected &&
      (n.ok
        ? (u(),
          ne(),
          (h.textContent = `Bạn và ${t} đã là bạn đạo.`),
          (g.textContent = `Mở nút phòng › Bạn đạo (hoặc Thêm › Thêm nữa › Bạn đạo) để xem bạn đang ở đâu.`),
          M(j(`Đóng`, y, !0)))
        : F(n.error));
  }
  async function I() {
    if (!d()) {
      P(C);
      return;
    }
    ((x = !1), (h.textContent = `Đang xem lời mời…`));
    let t = await te(e);
    if (!p.isConnected) return;
    if (!t.ok) {
      F(t.error);
      return;
    }
    let n = t.value.name || `Một người bạn`;
    if (t.value.already) {
      (u(), (h.textContent = `Bạn và ${n} đã là bạn đạo rồi.`), (g.textContent = ``), M(j(`Đóng`, y, !0)));
      return;
    }
    let r = t.value.level === null ? `` : ` · Cấp ${t.value.level}`,
      i = t.value.streak ? ` · giữ lửa ${t.value.streak} ngày` : ``;
    ((h.textContent = `${n}${r}${i} mời bạn làm bạn đạo.`),
      (g.textContent = w),
      M(
        j(`Nhận lời`, () => void ae(n), !0),
        j(`Để sau`, N),
      ));
  }
  ((E = p), l.body.append(p), n(p), I());
}
var j = e({ mountFriendsPanel: () => z }),
  M = `Bạn đạo`,
  N = `Chỉ bạn đạo mới thấy nhau. Kết bạn bằng link mời dùng một lần. Không có nhắn tin.`,
  P = `Bạn đạo giúp bạn thấy người quen đang ở phòng nào để đến cùng tu tập. Cần đăng nhập để giữ danh sách khi đổi máy. Không có nhắn tin; chỉ bạn đạo mới thấy bạn.`,
  F = `Chưa có bạn đạo nào. Bấm “Thêm bạn đạo” để tạo link mời rồi gửi cho người quen.`,
  ae = `Link mời không hiện trên màn hình (để khi phát trực tiếp không ai chụp được). Bấm “Chép link” hoặc “Chia sẻ” rồi gửi cho người bạn muốn kết bạn đạo. Link dùng được một lần, hết hạn sau 24 giờ.`,
  I = `Không tìm thấy bạn đạo này nữa (danh sách vừa đổi). Đã tải lại danh sách, bạn thử lại nhé.`,
  oe = `Đã chép link mời.`,
  se = `Chưa chép được link. Bạn thử “Chia sẻ”, hoặc bấm “Thêm bạn đạo” lại để tạo link mới.`,
  ce = `Huỷ mọi link đang mở`,
  le = (e) =>
    e === 0
      ? `Không có link nào đang mở.`
      : `Đã huỷ ${e} link đang mở. Ai cầm link cũ cũng không dùng được nữa.`,
  ue = `Mới`,
  de = (e) =>
    `Mới kết bạn đạo: ${e.slice(0, 3).join(`, `)}${e.length > 3 ? ` và ${e.length - 3} người nữa` : ``}. Không nhận ra ai thì bấm “Bỏ bạn” ở dòng đó, và “${ce}” nếu link bị lộ.`,
  L = `Cùng phòng với bạn`,
  fe = (e) => `Phòng ${e} đang đầy. Bạn thử lại sau ít phút nhé.`;
function pe(e, t) {
  return e.online
    ? e.room === null
      ? `Đang vào chùa`
      : e.room === t
        ? L
        : `Đang ở Phòng ${e.room}`
    : `Vắng mặt`;
}
var R = (e) => e.name || `Bạn đạo`;
function z(e, t) {
  let n = t.doc ?? document,
    r = t.list ?? y,
    i = t.invite ?? m,
    c = t.remove ?? _,
    u = t.revoke ?? h,
    ee = t.signedIn ?? (() => a() !== null),
    d = t.setTimer ?? ((e, t) => setTimeout(e, t)),
    f = t.clearTimer ?? ((e) => clearTimeout(e));
  e.innerHTML = `
    <header class="rooms__head">
      <button type="button" class="rooms__tab friends__back" data-ref="back">${o(`chevron-left`)}<span>Chọn phòng</span></button>
      <h2 id="friends-title" class="rooms__title">${M}</h2>
      <button type="button" class="rooms__close" data-ref="close" aria-label="Đóng">${o(`close`)}</button>
    </header>
    <p class="rooms__hint">${N}</p>
    <div class="friends__guest" data-ref="guest" hidden>
      <p data-ref="guestText"></p>
      <button type="button" class="btn" data-ref="login">Đăng nhập</button>
    </div>
    <p class="friends__notice" data-ref="notice" role="status" hidden></p>
    <ul class="friends__list" data-ref="list" aria-labelledby="friends-title"></ul>
    <div class="friends__invite" data-ref="inviteBox" hidden>
      <p class="friends__invite-text">${ae}</p>
      <div class="friends__invite-actions">
        <button type="button" class="rooms__btn" data-ref="copy">${o(`copy`)}<span>Chép link</span></button>
        <button type="button" class="rooms__btn" data-ref="share" hidden>${o(`share`)}<span>Chia sẻ</span></button>
      </div>
    </div>
    <button type="button" class="friends__remove friends__revoke" data-ref="revoke">${ce}</button>
    <footer class="rooms__foot" data-ref="foot">
      <p class="rooms__status" role="status" aria-live="polite" data-ref="status"></p>
      <button type="button" class="rooms__refresh" data-ref="add">${o(`users`)}<span>Thêm bạn đạo</span></button>
    </footer>
    <details class="friends__paste" data-ref="paste">
      <summary>Có link mời từ người khác?</summary>
      <div class="friends__paste-row">
        <input class="friends__link" data-ref="pasteInput" type="text" inputmode="url" autocomplete="off" aria-label="Dán link mời" placeholder="Dán link mời vào đây" />
        <button type="button" class="rooms__btn" data-ref="pasteGo">Mở lời mời</button>
      </div>
    </details>`;
  let g = (t) => e.querySelector(`[data-ref="${t}"]`),
    v = g(`list`),
    x = g(`status`),
    S = g(`guest`),
    C = g(`inviteBox`),
    w = g(`notice`),
    T = g(`revoke`),
    E = g(`copy`),
    D = g(`share`),
    O = g(`add`),
    k = g(`foot`),
    j = g(`paste`),
    L = !1,
    z = !1,
    B = null,
    V = 0,
    H = null,
    U = [],
    W = null,
    G = !1,
    K = null,
    q = (e) => {
      x.textContent = e;
    };
  function me(e) {
    ((S.hidden = !1),
      (g(`guestText`).textContent = e),
      (v.hidden = !0),
      (C.hidden = !0),
      (K = null),
      (w.hidden = !0),
      (T.hidden = !0),
      (k.hidden = !0),
      (j.hidden = !0));
  }
  function he() {
    ((S.hidden = !0), (v.hidden = !1), (T.hidden = !1), (k.hidden = !1), (j.hidden = !1));
  }
  function J() {
    (B !== null && f(B), (B = null));
  }
  function Y() {
    (J(),
      L &&
        !z &&
        (B = d(() => {
          ((B = null), L && n.visibilityState === `visible` ? $() : Y());
        }, te)));
  }
  function ge(e) {
    let r = n.createElement(`li`);
    ((r.className = `friends__row`), (r.dataset.friendId = e.id), (r.dataset.online = String(e.online)));
    let i = n.createElement(`div`);
    i.className = `friends__who`;
    let a = n.createElement(`span`);
    if (((a.className = `friends__name`), (a.textContent = R(e)), i.append(a), e.isNew)) {
      let e = n.createElement(`span`);
      ((e.className = `friends__new`), (e.textContent = ue), i.append(e));
    }
    e.level !== null && i.append(t.levelChip(e.level));
    let o = t.streakChip(e.streak);
    o && i.append(o);
    let s = n.createElement(`span`);
    ((s.className = `friends__where`), (s.textContent = pe(e, t.currentRoom)), r.append(i, s));
    let c = n.createElement(`div`);
    if (((c.className = `friends__actions`), W === e.id)) {
      let t = n.createElement(`span`);
      ((t.className = `friends__ask`), (t.textContent = `Bỏ bạn đạo ${R(e)}? Người ấy không được báo.`));
      let r = X(`rooms__btn friends__yes`, `Bỏ`);
      r.addEventListener(`click`, () => void ye(e));
      let i = X(`rooms__btn`, `Thôi`);
      (i.addEventListener(`click`, () => {
        ((W = null), Z());
      }),
        c.append(t, r, i));
    } else {
      let n = e.room;
      if (n !== null && n !== t.currentRoom && t.onSelect) {
        let t = X(`rooms__btn friends__go`, `Đến chỗ bạn`);
        (t.setAttribute(`aria-label`, `Đến chỗ ${R(e)} ở Phòng ${n}`),
          t.addEventListener(`click`, () => void ve(n)),
          c.append(t));
      }
      let r = X(`friends__remove`, `Bỏ bạn`);
      (r.setAttribute(`aria-label`, `Bỏ bạn đạo ${R(e)}`),
        r.addEventListener(`click`, () => {
          ((W = e.id), Z());
        }),
        c.append(r));
    }
    return (r.append(c), r);
  }
  function X(e, t) {
    let r = n.createElement(`button`);
    return ((r.type = `button`), (r.className = e), (r.textContent = t), (r.disabled = G), r);
  }
  function Z() {
    if (U.length === 0) {
      let e = n.createElement(`li`);
      ((e.className = `friends__empty`), (e.textContent = F), v.replaceChildren(e));
    } else v.replaceChildren(...U.map(ge));
  }
  function Q(e) {
    e === `auth` ? me(`Phiên đăng nhập đã hết. Bạn đăng nhập lại để xem bạn đạo nhé.`) : q(ie(e));
  }
  function _e(e) {
    ((U = e.friends), U.length > 0 && p(), W !== null && !U.some((e) => e.id === W) && (W = null), he());
    let t = U.filter((e) => e.isNew).map(R);
    ((w.hidden = t.length === 0),
      (w.textContent = t.length === 0 ? `` : de(t)),
      (O.disabled = U.length >= e.max),
      O.disabled && q(`Bạn đã có đủ ${e.max} bạn đạo.`),
      Z());
  }
  async function $() {
    if (!z) {
      if (!ee()) me(P);
      else
        return (
          H ||
          ((H = (async () => {
            V === 0 && q(`Đang tải bạn đạo…`);
            let e = await r();
            ((H = null),
              z ||
                ((V = Date.now()),
                e.ok ? (x.textContent === `Đang tải bạn đạo…` && q(``), _e(e.value)) : Q(e.error),
                Y()));
          })()),
          H)
        );
    }
  }
  async function ve(e) {
    if (G) return;
    ((G = !0), Z(), q(`Đang xem Phòng ${e}…`));
    let n;
    try {
      n = (await t.fetchRooms()).find((t) => t.room === e);
    } catch {
      n = void 0;
    }
    ((G = !1), z || (n !== void 0 && n.count >= n.capacity ? (q(fe(e)), Z()) : t.onSelect?.(e)));
  }
  async function ye(e) {
    if (G) return;
    ((G = !0), Z());
    let t = await c(e.id);
    ((G = !1),
      (W = null),
      z ||
        (t.ok
          ? (t.value ? ((U = U.filter((t) => t.id !== e.id)), q(`Đã bỏ bạn đạo ${R(e)}.`)) : q(I), Z(), $())
          : (Q(t.error), Z())));
  }
  async function be() {
    if (G || O.disabled) return;
    ((G = !0), O.setAttribute(`aria-disabled`, `true`), q(`Đang tạo link mời…`));
    let e = await i(re());
    ((G = !1),
      O.removeAttribute(`aria-disabled`),
      z ||
        (e.ok
          ? (ne(),
            (K = l(location.origin, e.value.code)),
            (C.hidden = !1),
            (D.hidden = typeof navigator.share != `function`),
            q(``),
            E.focus({ preventScroll: !0 }))
          : Q(e.error)));
  }
  function xe(e) {
    let t = n.createElement(`textarea`);
    ((t.value = e),
      (t.readOnly = !0),
      t.setAttribute(`aria-hidden`, `true`),
      (t.tabIndex = -1),
      (t.style.cssText = `position:fixed;top:-1000px;left:-1000px;opacity:0;pointer-events:none`),
      n.body.append(t));
    try {
      return (t.select(), n.execCommand(`copy`));
    } catch {
      return !1;
    } finally {
      t.remove();
    }
  }
  async function Se() {
    let e = K;
    if (e !== null)
      try {
        (await navigator.clipboard.writeText(e), q(oe));
      } catch {
        q(xe(e) ? oe : se);
      }
  }
  function Ce() {
    let e = K;
    e !== null &&
      typeof navigator.share == `function` &&
      navigator
        .share({
          title: `Lời mời kết bạn đạo · Chùa Sen`,
          text: `Mời bạn làm bạn đạo ở Chùa Sen để thấy nhau đang ở phòng nào và cùng tu tập.`,
          url: e,
        })
        .catch(() => void 0);
  }
  async function we() {
    if (G) return;
    ((G = !0), (T.disabled = !0), q(`Đang huỷ link…`));
    let e = await u();
    ((G = !1), (T.disabled = !1), z || (e.ok ? ((K = null), (C.hidden = !0), q(le(e.value))) : Q(e.error)));
  }
  (g(`back`).addEventListener(`click`, () => t.back()),
    g(`close`).addEventListener(`click`, () => t.close()),
    g(`login`).addEventListener(`click`, () => {
      (t.close(), s({ reason: `settings`, onFail: (e) => q(e) }));
    }),
    O.addEventListener(`click`, () => void be()),
    g(`copy`).addEventListener(`click`, () => void Se()),
    D.addEventListener(`click`, Ce),
    T.addEventListener(`click`, () => void we()),
    g(`pasteGo`).addEventListener(`click`, () => {
      let e = b(g(`pasteInput`).value);
      e === null ? q(`Link mời chưa đúng. Bạn dán nguyên link nhận được nhé.`) : (t.close(), A(e));
    }));
  let Te = () => {
    L && n.visibilityState === `visible` && Date.now() - V >= 6e4 && $();
  };
  return (
    n.addEventListener(`visibilitychange`, Te),
    {
      pause() {
        ((L = !1), J());
      },
      resume() {
        z || ((L = !0), V === 0 || Date.now() - V >= 6e4 ? $() : Y());
      },
      dispose() {
        ((z = !0), (L = !1), (K = null), J(), n.removeEventListener(`visibilitychange`, Te));
      },
      refresh: $,
    }
  );
}
var B = e({ mountFriendsSettings: () => G }),
  V = `Cho bạn đạo thấy mình đang ở phòng nào`,
  H = `Tắt thì bạn đạo chỉ thấy bạn đang vào chùa hay vắng mặt. Người không phải bạn đạo không bao giờ thấy.`,
  U = `Chưa tải được cài đặt Bạn đạo. Bạn mở lại Cài đặt sau nhé.`,
  W = `Chưa lưu được. Bạn thử lại nhé.`;
function G(e, t = {}) {
  let n = t.list ?? y,
    r = t.save ?? f;
  ((e.innerHTML = `
    <h3 id="set-friends-title" class="set-group__title">${o(`users`)}Bạn đạo</h3>
    <div class="set-card">
      <div class="set-item">
        <label class="set-switch">
          <span class="set-switch__text">${V}</span>
          <input class="set-switch__input" type="checkbox" role="switch" aria-describedby="set-share-hint" data-ref="shareRoom" disabled />
          <span class="set-switch__track" aria-hidden="true"></span>
        </label>
        <p class="set-hint" id="set-share-hint" data-ref="shareHint">${H}</p>
      </div>
    </div>`),
    (e.hidden = !1));
  let i = e.querySelector(`[data-ref="shareRoom"]`),
    a = e.querySelector(`[data-ref="shareHint"]`);
  ((i.checked = !0),
    n().then((t) => {
      e.isConnected && (t.ok ? ((i.checked = t.value.shareRoom), (i.disabled = !1)) : (a.textContent = U));
    }),
    i.addEventListener(`change`, () => {
      let t = i.checked;
      ((i.disabled = !0),
        r(t).then((n) => {
          e.isConnected &&
            ((i.disabled = !1),
            n.ok ? ((i.checked = n.value), (a.textContent = H)) : ((i.checked = !t), (a.textContent = W)));
        }));
    }));
}
export { j as n, x as r, B as t };
