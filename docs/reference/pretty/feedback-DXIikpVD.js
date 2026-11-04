import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { Pt as t, gt as n, wt as r } from "./index-e_Bx6V48.js";
import { E as i } from "./lazy-shared-D8DtrU9N.js";
import { n as a, o, r as s } from "./dialog-DwXghOMX.js";
var c = [`idea`, `bug`, `rough`, `other`],
  l = { idea: `Đề xuất tính năng`, bug: `Báo lỗi`, rough: `Chưa mượt, khó dùng`, other: `Góp ý khác` },
  u = {
    messageMin: 5,
    messageMax: 2e3,
    contactMax: 120,
    bodyMaxBytes: 8192,
    metaStringMax: 300,
    metaErrorsMax: 5,
  },
  d = [`auto`, `smooth`, `balanced`, `beautiful`],
  f = { auto: `Tự động`, smooth: `Mượt`, balanced: `Cân bằng`, beautiful: `Đẹp` },
  p = [`low`, `medium`, `high`],
  m = { low: `Mượt`, medium: `Cân bằng`, high: `Đẹp` },
  h = { smooth: `low`, balanced: `medium`, beautiful: `high` };
function g(e, t) {
  let n = (e, t) => (t === void 0 ? void 0 : (e[t] ?? t)),
    r = n(m, t);
  if (e === void 0) return r;
  let i = n(f, e);
  return r === void 0 ? i : e === `auto` ? `${i} (${r})` : h[e] === t ? i : `${i} (đang chạy: ${r})`;
}
var _ = [`v`, `path`, `view`, `room`, `ua`, `lang`, `tz`, `net`],
  v = [
    `vw`,
    `vh`,
    `sw`,
    `sh`,
    `dpr`,
    `mem`,
    `cores`,
    `pr`,
    `prMax`,
    `ftP95`,
    `wkP95`,
    `slowPct`,
    `drawn`,
    `calls`,
  ],
  y = [`touch`, `online`, `standalone`, `mobile`, `saver`, `fallback`],
  b = 1e5;
function x(e) {
  return typeof e == `string` && c.includes(e);
}
var S = RegExp(
    `[${[
      [128, 159],
      [8203, 8207],
      [8234, 8238],
      [8294, 8297],
      [65279, 65279],
    ]
      .map(([e, t]) => `${String.fromCharCode(e)}-${String.fromCharCode(t)}`)
      .join(``)}]`,
    `g`,
  ),
  C = `�`,
  w = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g;
function T(e) {
  let t = e.toWellFormed;
  return typeof t == `function` ? t.call(e) : e.replace(w, (e) => (e.length === 2 ? e : C));
}
function E(e, t = !1) {
  let n = T(e)
    .replace(
      /\r\n?/g,
      `
`,
    )
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ``)
    .replace(S, ``);
  return (
    t
      ? n.replace(/\s+/g, ` `)
      : n.replace(
          /\n{4,}/g,
          `


`,
        )
  ).trim();
}
function D(e) {
  return Array.from(e).length;
}
function O(e, t) {
  return D(e) <= t
    ? e
    : `${Array.from(e)
        .slice(0, t - 1)
        .join(``)}…`;
}
function k(e) {
  if (typeof e != `object` || !e || Array.isArray(e)) return null;
  let t = e,
    n = {},
    r = u.metaStringMax;
  for (let e of _) {
    let i = t[e];
    if (typeof i != `string`) continue;
    let a = E(i, !0);
    a !== `` && (n[e] = O(a, r));
  }
  for (let e of v) {
    let r = t[e];
    typeof r == `number` && Number.isFinite(r) && r >= 0 && r <= b && (n[e] = Math.round(r * 100) / 100);
  }
  for (let e of y) {
    let r = t[e];
    typeof r == `boolean` && (n[e] = r);
  }
  if (
    (d.includes(t.gfx) && (n.gfx = t.gfx), p.includes(t.tier) && (n.tier = t.tier), Array.isArray(t.errors))
  ) {
    let e = t.errors
      .filter((e) => typeof e == `string`)
      .map((e) => O(E(e, !0), r))
      .filter((e) => e !== ``)
      .slice(-u.metaErrorsMax);
    e.length > 0 && (n.errors = e);
  }
  return Object.keys(n).length > 0 ? n : null;
}
function ee(e) {
  if (typeof e != `object` || !e || Array.isArray(e))
    return { ok: !1, message: `Dữ liệu góp ý không hợp lệ.` };
  let t = e;
  if (!x(t.kind)) return { ok: !1, message: `Bạn chọn loại góp ý giúp chùa nhé.` };
  if (typeof t.message != `string`) return { ok: !1, message: `Bạn chưa viết nội dung góp ý.` };
  let n = E(t.message),
    r = D(n);
  if (r < u.messageMin) return { ok: !1, message: `Bạn viết thêm vài chữ để chùa hiểu rõ hơn nhé.` };
  if (r > u.messageMax)
    return { ok: !1, message: `Nội dung dài quá ${u.messageMax} ký tự, bạn rút gọn giúp chùa nhé.` };
  let i;
  if (t.contact !== void 0 && t.contact !== null) {
    if (typeof t.contact != `string`) return { ok: !1, message: `Thông tin liên hệ không hợp lệ.` };
    let e = E(t.contact, !0);
    if (D(e) > u.contactMax) return { ok: !1, message: `Thông tin liên hệ dài quá, bạn ghi ngắn lại nhé.` };
    e !== `` && (i = e);
  }
  let a = { kind: t.kind, message: n };
  i !== void 0 && (a.contact = i);
  let o = k(t.meta);
  return (
    o !== null && (a.meta = o),
    { ok: !0, value: a, spam: typeof t.website == `string` && t.website.trim() !== `` }
  );
}
var A = e({ openFeedbackDialog: () => Z }),
  j = `/api/feedback`,
  M = `chua-online:feedback-draft`,
  te = 1e4,
  ne = 400,
  re = 100,
  ie = `Góp ý & báo lỗi`,
  N = `Chùa Sen còn mới, mỗi góp ý của bạn giúp chùa tốt hơn. Đội ngũ chùa đọc từng tin bạn gửi.`,
  P = `Chỉ đội ngũ Chùa Sen đọc góp ý của bạn. Bạn đừng ghi mật khẩu, số tài khoản hay thông tin riêng tư nhé.`,
  ae = `A Di Đà Phật. Cảm ơn bạn đã góp ý!`,
  F = `Đội ngũ chùa sẽ đọc góp ý của bạn.`,
  oe = `Nếu cần, chùa sẽ hồi âm bạn qua thông tin liên hệ bạn để lại.`,
  I = `Bạn gửi hơi nhanh, nghỉ chút rồi thử lại sau ít phút nhé.`,
  L = `Chưa gửi được. Nội dung vẫn được giữ lại, bạn thử lại sau nhé.`,
  R = `Nội dung dài quá, bạn rút gọn giúp chùa nhé.`,
  z = `Chùa chưa nhận được góp ý này. Bạn kiểm tra lại nội dung nhé.`,
  se = {
    idea: `Bạn muốn chùa có thêm điều gì? Ví dụ: thêm một bài kinh, một chế độ thiền, một góc mới trong khuôn viên…`,
    bug: `Lỗi xảy ra ở đâu? Trước đó bạn đã làm gì, và bạn mong chùa phản hồi thế nào?`,
    rough: `Phần nào đang chưa mượt: giật, chậm, khó bấm hay khó hiểu? Bạn đang dùng điện thoại hay máy tính?`,
    other: `Bạn muốn nhắn gì với chùa, cứ viết ở đây.`,
  };
function B(e) {
  let t = e?.trim();
  if (!t) return j;
  try {
    let e = new URL(t);
    return e.protocol === `https:` || e.protocol === `http:` ? `${e.origin}${j}` : j;
  } catch {
    return j;
  }
}
function ce() {
  return B(void 0);
}
var V = (e) => (typeof e == `number` && Number.isFinite(e) && e > 0 ? e : void 0),
  H = `chua-device:graphics`,
  U = 700,
  W = (e) => {
    let t = e === void 0 || e === `` ? NaN : Number(e);
    return Number.isFinite(t) ? t : void 0;
  };
function G(e, t) {
  if (!e || !((W(e.frames) ?? 0) > 0)) return {};
  let n = null;
  try {
    let e = JSON.parse(t ?? `null`);
    typeof e == `object` && e && (n = e);
  } catch {
    n = null;
  }
  return {
    gfx: typeof n?.preset == `string` ? n.preset : `auto`,
    tier: e.quality,
    saver: e.userFps === void 0 ? void 0 : (W(e.userFps) ?? 0) > 0,
    pr: W(e.pixelRatio),
    prMax: W(e.pixelRatioMax),
    fallback: e.fpsFallback === void 0 ? void 0 : e.fpsFallback === `1`,
    ftP95: W(e.intervalP95Ms),
    wkP95: W(e.frameP95Ms),
    slowPct: W(e.slowPct),
    drawn: W(e.crowd),
    calls: W(e.drawCalls),
  };
}
function K() {
  try {
    return localStorage.getItem(H);
  } catch {
    return null;
  }
}
function q(e) {
  try {
    return typeof matchMedia == `function` ? matchMedia(e).matches : void 0;
  } catch {
    return;
  }
}
function le(e) {
  let n = typeof navigator > `u` ? {} : navigator,
    r;
  try {
    r = Intl.DateTimeFormat().resolvedOptions().timeZone || void 0;
  } catch {
    r = void 0;
  }
  let i = n.connection?.effectiveType,
    a = t(),
    o = q(`(pointer: coarse)`) === !0 || (n.maxTouchPoints ?? 0) > 0,
    s = V(typeof screen > `u` ? void 0 : screen.width),
    c = V(typeof screen > `u` ? void 0 : screen.height),
    l = n.userAgentData?.mobile,
    u = {
      v: `0.9.31`,
      path: typeof location > `u` ? void 0 : location.pathname + location.hash,
      view: document.body.classList.contains(`is-fallback`) ? `fallback` : `3d`,
      ua: n.userAgent,
      lang: n.language,
      tz: r,
      vw: V(window.innerWidth),
      vh: V(window.innerHeight),
      sw: s,
      sh: c,
      dpr: V(window.devicePixelRatio),
      touch: o,
      mobile: typeof l == `boolean` ? l : o && s !== void 0 && c !== void 0 && Math.min(s, c) < U,
      mem: V(n.deviceMemory),
      cores: V(n.hardwareConcurrency),
      net: typeof i == `string` ? i : void 0,
      online: typeof n.onLine == `boolean` ? n.onLine : void 0,
      standalone: q(`(display-mode: standalone)`) === !0 || n.standalone === !0,
      errors: a.length > 0 ? a : void 0,
    };
  for (let [t, n] of Object.entries(e ?? {})) n !== void 0 && (u[t] = n);
  u.view === `3d` && Object.assign(u, G(document.getElementById(`scene`)?.dataset, K()));
  for (let e of Object.keys(u)) (u[e] === void 0 || u[e] === ``) && delete u[e];
  return u;
}
function ue(e) {
  let t = [],
    n = (e, ...n) => {
      let r = n.filter((e) => e !== void 0 && e !== !1 && e !== ``).join(` · `);
      r !== `` && t.push([e, r]);
    },
    r = (e, t) => (e !== void 0 && t !== void 0 ? `${e}×${t}` : void 0);
  (n(`Phiên bản`, e.v),
    n(`Trang`, e.path),
    n(`Cảnh`, e.view, e.room),
    n(`Trình duyệt`, e.ua),
    n(`Ngôn ngữ · múi giờ`, e.lang, e.tz),
    n(`Khung nhìn`, r(e.vw, e.vh)),
    n(`Màn hình`, r(e.sw, e.sh), e.dpr !== void 0 && `@${e.dpr}x`),
    n(
      `Thiết bị`,
      e.mobile !== void 0 && (e.mobile ? `điện thoại` : `không phải điện thoại`),
      e.touch !== void 0 && (e.touch ? `cảm ứng` : `chuột và bàn phím`),
      e.mem !== void 0 && `${e.mem} GB bộ nhớ`,
      e.cores !== void 0 && `${e.cores} nhân`,
    ));
  let i = (e) => String(e).replace(`.`, `,`);
  return (
    n(
      `Đồ hoạ`,
      g(e.gfx, e.tier),
      e.saver === !0 && `tiết kiệm pin`,
      e.pr !== void 0 && `độ nét ${i(e.pr)}${e.prMax === void 0 ? `` : `/${i(e.prMax)}`}`,
      e.fallback === !0 && `đã hạ 30 khung/giây`,
    ),
    n(
      `Khung hình`,
      e.ftP95 !== void 0 && `p95 ${i(e.ftP95)} ms`,
      e.wkP95 !== void 0 && `xử lý ${i(e.wkP95)} ms`,
      e.slowPct !== void 0 && `chậm ${e.slowPct}% thời gian`,
      e.drawn !== void 0 && `${e.drawn} người đang hiện`,
      e.calls !== void 0 && `${e.calls} lần vẽ`,
    ),
    n(
      `Mạng`,
      e.net,
      e.online !== void 0 && (e.online ? `đang có mạng` : `ngoại tuyến`),
      e.standalone === !0 && `ứng dụng đã cài`,
    ),
    e.errors &&
      e.errors.length > 0 &&
      t.push([
        `Lỗi gần nhất`,
        e.errors.join(`
`),
      ]),
    t
  );
}
function de() {
  try {
    let e = localStorage.getItem(M);
    if (!e) return null;
    let t = JSON.parse(e);
    if (typeof t != `object` || !t) return null;
    let n = typeof t.message == `string` ? t.message.slice(0, u.messageMax) : ``,
      r = typeof t.contact == `string` ? t.contact.slice(0, u.contactMax) : ``;
    return n.trim() === `` && r.trim() === ``
      ? null
      : { kind: x(t.kind) ? t.kind : `idea`, message: n, contact: r };
  } catch {
    return null;
  }
}
function fe(e) {
  try {
    e.message.trim() === `` && e.contact.trim() === ``
      ? localStorage.removeItem(M)
      : localStorage.setItem(M, JSON.stringify(e));
  } catch {}
}
function pe() {
  try {
    localStorage.removeItem(M);
  } catch {}
}
function me(e) {
  let t = (e) => new TextEncoder().encode(e).length <= u.bodyMaxBytes,
    n = JSON.stringify(e);
  if (t(n)) return n;
  let { meta: r, ...i } = e;
  if (r?.errors) {
    let e = { ...r };
    if ((delete e.errors, (n = JSON.stringify({ ...i, meta: e })), t(n))) return n;
  }
  return ((n = JSON.stringify(i)), t(n) ? n : null);
}
async function he(e) {
  if (e.status === 201) return null;
  if (e.status === 429) return I;
  if (e.status === 413) return R;
  if (e.status === 400) {
    try {
      let t = await e.json(),
        n = typeof t?.message == `string` ? t.message.trim() : ``;
      if (n !== ``) return n.slice(0, 240);
    } catch {}
    return z;
  }
  return L;
}
var J = (e) =>
    `<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}</svg>`,
  Y = {
    idea: J(
      `<path d="M9.5 18h5M10.2 21h3.6"/><path d="M12 3.2a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.4V18h5v-1.6c0-1 .4-1.8 1.1-2.4A6 6 0 0 0 12 3.2z"/>`,
    ),
    bug: J(
      `<rect x="7.5" y="8.4" width="9" height="11" rx="4.5"/><path d="M9.6 8.4V7a2.4 2.4 0 0 1 4.8 0v1.4M12 10.6v8.6"/><path d="M3.5 10.5l4 1.5M20.5 10.5l-4 1.5M3.5 15.5h4M20.5 15.5h-4M4.8 20.4l3-2.2M19.2 20.4l-3-2.2"/>`,
    ),
    rough: J(
      `<path d="M4.2 17a8.2 8.2 0 1 1 15.6 0"/><path d="M12 16.4l3.5-4.7M12 16.4h.01M7.6 11.4h.01M12 8.2h.01M16.4 11.4h.01"/>`,
    ),
    other: n(`message`, { size: 20 }),
  },
  X = null,
  ge = `button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([tabindex="-1"]), summary, a[href]`;
function _e() {
  let e = c
    .map(
      (e) =>
        `<label class="feedback-dlg__chip"><input type="radio" name="feedback-kind" value="${e}" />${Y[e]}<span>${l[e]}</span></label>`,
    )
    .join(``);
  return `
    <form class="feedback-dlg__card" novalidate data-ref="form">
      <header class="feedback-dlg__head">
        <h2 id="feedback-title" class="feedback-dlg__title" tabindex="-1" data-ref="title"></h2>
        <button type="button" class="feedback-dlg__close" data-ref="close" aria-label="Đóng">${n(`close`)}</button>
      </header>
      <div class="feedback-dlg__body" data-ref="body">
        <fieldset class="feedback-dlg__fields" data-ref="fields">
          <div class="feedback-dlg__stack">
            <p id="feedback-intro" class="feedback-dlg__intro">${N}</p>
            <fieldset class="feedback-dlg__kinds">
              <legend class="feedback-dlg__label">Bạn muốn gửi gì cho chùa?</legend>
              <div class="feedback-dlg__chips" data-ref="chips">${e}</div>
            </fieldset>
            <div class="feedback-dlg__field">
              <label class="feedback-dlg__label" for="feedback-message">Nội dung góp ý</label>
              <textarea id="feedback-message" class="feedback-dlg__text" data-ref="message" rows="5" maxlength="${u.messageMax}" autocomplete="off" aria-describedby="feedback-count"></textarea>
              <p id="feedback-count" class="feedback-dlg__count" data-ref="count"></p>
            </div>
            <div class="feedback-dlg__field">
              <label class="feedback-dlg__label" for="feedback-contact">Email hoặc Zalo <span class="feedback-dlg__optional">(không bắt buộc)</span></label>
              <input id="feedback-contact" class="feedback-dlg__input" data-ref="contact" type="text" maxlength="${u.contactMax}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ban@example.com hoặc số Zalo" aria-describedby="feedback-contact-hint" />
              <p id="feedback-contact-hint" class="feedback-dlg__hint">Để chùa hồi âm khi cần.</p>
            </div>
            <label class="feedback-dlg__check">
              <input type="checkbox" checked data-ref="withMeta" />
              <span>Gửi kèm thông tin thiết bị để sửa lỗi nhanh hơn</span>
            </label>
            <details class="feedback-dlg__meta" data-ref="metaBox">
              <summary class="feedback-dlg__meta-sum">Xem thông tin sẽ gửi</summary>
              <dl class="feedback-dlg__meta-list" data-ref="metaList"></dl>
            </details>
            <div class="feedback-dlg__trap" aria-hidden="true">
              <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off" data-ref="trap" /></label>
            </div>
            <p class="feedback-dlg__privacy">${P}</p>
          </div>
        </fieldset>
      </div>
      <footer class="feedback-dlg__foot" data-ref="foot">
        <p class="feedback-dlg__error" role="alert" data-ref="error"></p>
        <div class="feedback-dlg__actions">
          <button type="button" class="btn btn--ghost" data-ref="cancel">Đóng</button>
          <button type="submit" class="btn btn--gold" data-ref="send">Gửi góp ý</button>
        </div>
      </footer>
    </form>`;
}
function Z(e = {}) {
  X?.isConnected && a(X);
  let t =
      e.opener === void 0
        ? document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
        : e.opener,
    c = e.fetchImpl ?? ((e, t) => fetch(e, t)),
    l;
  try {
    l = e.context?.();
  } catch {
    l = void 0;
  }
  let d = le(l),
    f = document.createElement(`dialog`);
  ((f.className = `feedback-dlg`),
    f.setAttribute(`aria-labelledby`, `feedback-title`),
    f.setAttribute(`aria-describedby`, `feedback-intro`),
    (f.innerHTML = _e()));
  let p = (e) => f.querySelector(`[data-ref="${e}"]`),
    m = p(`form`),
    h = p(`title`),
    g = p(`body`),
    _ = p(`fields`),
    v = p(`message`),
    y = p(`count`),
    b = p(`contact`),
    S = p(`withMeta`),
    C = p(`metaBox`),
    w = p(`metaList`),
    T = p(`trap`),
    E = p(`foot`),
    O = p(`error`),
    k = p(`send`);
  h.textContent = ie;
  let A = Array.from(f.querySelectorAll(`input[name="feedback-kind"]`)),
    j = !1,
    M = !1,
    N = !1,
    P,
    I = () => {
      j || a(f);
    },
    z = de(),
    B = () => {
      let e = A.find((e) => e.checked)?.value;
      return x(e) ? e : `idea`;
    },
    V = () => {
      v.placeholder = se[B()];
    },
    H = x(e.kind) ? e.kind : (z?.kind ?? `idea`);
  for (let e of A) e.checked = e.value === H;
  V();
  let U = () => {
      (clearTimeout(P), (P = void 0), M || fe({ kind: B(), message: v.value, contact: b.value }));
    },
    W = () => {
      (clearTimeout(P), (P = setTimeout(U, ne)));
    };
  z && ((v.value = z.message), (b.value = z.contact));
  let G = () => {
    let e = D(v.value);
    ((y.textContent = `${e}/${u.messageMax}`), (y.dataset.near = String(u.messageMax - e <= re)));
  };
  G();
  let K = () => {
    C.hidden = !S.checked;
    let e = ue(d),
      t = [];
    for (let [n, r] of e) {
      let e = document.createElement(`dt`);
      e.textContent = n;
      let i = document.createElement(`dd`);
      ((i.textContent = r), t.push(e, i));
    }
    if (e.length === 0) {
      let e = document.createElement(`dd`);
      ((e.textContent = `Không có thông tin nào.`), t.push(e));
    }
    w.replaceChildren(...t);
  };
  K();
  let J = (e) => {
      O.textContent = e;
    },
    Y = (e) => {
      ((N = e),
        e && _.contains(document.activeElement) && k.focus({ preventScroll: !0 }),
        (_.disabled = e),
        m.setAttribute(`aria-busy`, String(e)),
        k.setAttribute(`aria-disabled`, String(e)),
        (k.textContent = e ? `Đang gửi…` : `Gửi góp ý`));
    },
    Z = (e) => {
      let t = document.createElement(`div`);
      ((t.className = `feedback-dlg__done`),
        (t.id = `feedback-done`),
        t.setAttribute(`role`, `status`),
        (t.innerHTML = `${n(`lotus`, { size: 44 })}<h3 class="feedback-dlg__done-title" tabindex="-1" data-ref="doneTitle"></h3><p class="feedback-dlg__done-text" data-ref="doneText"></p><button type="button" class="btn btn--gold" data-ref="doneClose">Đóng</button>`));
      let r = t.querySelector(`[data-ref="doneTitle"]`);
      r.textContent = ae;
      let i = t.querySelector(`[data-ref="doneText"]`);
      ((i.textContent = e ? `${F} ${oe}` : F),
        t.querySelector(`[data-ref="doneClose"]`)?.addEventListener(`click`, I),
        g.replaceChildren(t),
        (E.hidden = !0),
        f.setAttribute(`aria-describedby`, `feedback-done`),
        r.focus({ preventScroll: !0 }));
    };
  async function ve() {
    if (N) return;
    let t = B(),
      n = T.value,
      a = ee({
        kind: t,
        message: v.value.normalize(`NFC`),
        contact: b.value.normalize(`NFC`),
        meta: S.checked ? d : void 0,
        website: n,
      });
    if (!a.ok) {
      (J(a.message), v.focus({ preventScroll: !0 }));
      return;
    }
    let o = me(n.trim() === `` ? a.value : { ...a.value, website: n });
    if (o === null) {
      (J(R), v.focus({ preventScroll: !0 }));
      return;
    }
    (J(``), U(), Y(!0));
    let s = new AbortController(),
      l = setTimeout(() => s.abort(), te),
      u;
    try {
      let t = e.url ?? ce();
      u = await he(
        await c(t, {
          method: `POST`,
          headers: i(t, { "content-type": `application/json` }),
          body: o,
          credentials: `omit`,
          signal: s.signal,
        }),
      );
    } catch {
      u = L;
    } finally {
      clearTimeout(l);
    }
    u === null
      ? ((M = !0),
        clearTimeout(P),
        pe(),
        r(`feedback_sent`, { kind: t, source: e.source ?? `unknown` }),
        j || Z(a.value.contact !== void 0))
      : j || (Y(!1), J(u), k.focus({ preventScroll: !0 }));
  }
  for (let e of A)
    e.addEventListener(`change`, () => {
      (V(), W());
    });
  (v.addEventListener(`input`, () => {
    (G(), W());
  }),
    b.addEventListener(`input`, W),
    S.addEventListener(`change`, K),
    m.addEventListener(`submit`, (e) => {
      (e.preventDefault(), ve());
    }),
    p(`close`).addEventListener(`click`, I),
    p(`cancel`).addEventListener(`click`, I),
    f.addEventListener(`keydown`, (e) => {
      if (e.key === `Escape` && !e.isComposing) (e.preventDefault(), I());
      else if (e.key === `Enter` && (e.ctrlKey || e.metaKey) && !N)
        e.target === v && (e.preventDefault(), ve());
      else if (e.key === `Tab`) {
        let t = Array.from(f.querySelectorAll(ge)).filter(
            (e) => !e.closest(`[hidden]`) && !e.matches(`:disabled`),
          ),
          n = t[0],
          r = t[t.length - 1];
        if (!n || !r) return;
        let i = document.activeElement,
          a = !f.contains(i);
        e.shiftKey && (i === n || a)
          ? (e.preventDefault(), r.focus())
          : !e.shiftKey && (i === r || a) && (e.preventDefault(), n.focus());
      }
    }));
  let Q = window.visualViewport,
    $ = () => {
      let e = Q ? window.innerHeight - Q.height > 120 : !1;
      ((f.style.top = Q && e ? `${Q.offsetTop + 8}px` : ``),
        (f.style.bottom = e ? `auto` : ``),
        (f.style.maxHeight = Q && e ? `${Q.height - 16}px` : ``));
    };
  return (
    Q?.addEventListener(`resize`, $),
    Q?.addEventListener(`scroll`, $),
    f.addEventListener(`close`, () => {
      ((j = !0),
        U(),
        Q?.removeEventListener(`resize`, $),
        Q?.removeEventListener(`scroll`, $),
        f.remove(),
        X === f && (X = null),
        t?.isConnected && t.focus({ preventScroll: !0 }));
    }),
    s(f),
    (X = f),
    document.body.append(f),
    o(f),
    f.isConnected &&
      (q(`(pointer: coarse)`) ? h.focus({ preventScroll: !0 }) : v.focus({ preventScroll: !0 })),
    { element: f, close: I }
  );
}
export { A as t };
