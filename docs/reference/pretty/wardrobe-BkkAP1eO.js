import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import {
  $ as t,
  Q as n,
  W as r,
  Y as i,
  Z as a,
  et as o,
  gt as s,
  ot as c,
  rt as l,
} from "./index-e_Bx6V48.js";
import { at as u, ht as d, mt as f, st as p } from "./app-z_oU8L_u.js";
import { g as m, p as h } from "./progress-core-C9e35Hb5.js";
function g(e) {
  return e.kind === `tier`
    ? `Cần ${h(m(e.tier))}`
    : e.kind === `streak`
      ? `Giữ lửa ${e.days} ngày`
      : e.kind === `referrals`
        ? `Rủ ${e.count} bạn vào chùa`
        : e.badge === `kol`
          ? `Danh hiệu KOL`
          : `Danh hiệu ${e.badge}`;
}
var _ = (e) => (e ? g(e) : null),
  v = (e) => _(p[e]),
  y = (e) => _(u[e]),
  b = (e) => _(f(e)),
  x = d(),
  S = (e) => e.items ?? x,
  C = `Chọn tối đa 2 phụ kiện. Bỏ bớt một món trước nhé.`;
function ee(e) {
  return { spec: t(e.initial), tab: `style`, message: null, dirty: !1 };
}
var w = (e) => e.map((e) => o(e).label.toLowerCase()).join(`, `);
function T(e, n, r, i) {
  return { ...e, spec: r, message: i, dirty: !c(r, t(n.initial)) };
}
function te(e, r, i) {
  let { spec: a } = e;
  switch (r.type) {
    case `tab`:
      return r.tab === e.tab ? e : { ...e, tab: r.tab, message: null };
    case `style`: {
      let n = l(r.style);
      if (!i.unlocked.has(r.style))
        return { ...e, message: `${n.label} đang khoá: ${v(r.style) ?? ``}`.trim() };
      if (r.style === a.style) return e;
      let o = t({ ...a, style: r.style }),
        s = S(i),
        c = {
          ...o,
          primary: s.swatchOpen(n.primary[o.primary]) ? o.primary : 0,
          secondary: s.swatchOpen(n.secondary[o.secondary]) ? o.secondary : 0,
        },
        u = a.accessories.filter((e) => !c.accessories.includes(e));
      return T(e, i, c, u.length > 0 ? `${n.label} đã có sẵn nên bỏ ${w(u)}.` : null);
    }
    case `cut`:
      return l(a.style).family !== `aodai` || r.cut === a.cut ? e : T(e, i, { ...a, cut: r.cut }, null);
    case `primary`:
    case `secondary`: {
      let t = l(a.style),
        n = r.type === `primary` ? t.primary : t.secondary;
      if (!Number.isInteger(r.index) || r.index < 0 || r.index >= n.length || a[r.type] === r.index) return e;
      let o = n[r.index];
      return S(i).swatchOpen(o)
        ? T(e, i, { ...a, [r.type]: r.index }, null)
        : { ...e, message: `${o?.name ?? ``} đang khoá: ${b(o) ?? ``}`.trim() };
    }
    case `accessory`: {
      let s = o(r.id);
      if (a.accessories.includes(r.id))
        return T(e, i, t({ ...a, accessories: a.accessories.filter((e) => e !== r.id) }), null);
      if (!S(i).accessories.has(r.id))
        return { ...e, message: `${s.label} đang khoá: ${y(r.id) ?? ``}`.trim() };
      if (!n(a.style, r.id))
        return { ...e, message: `${l(a.style).label} đã có sẵn, không đeo thêm ${s.label.toLowerCase()}.` };
      let c = a.accessories.find((e) => o(e).slot === s.slot),
        u = a.accessories.filter((e) => e !== c);
      return u.length >= 2
        ? { ...e, message: C }
        : T(
            e,
            i,
            t({ ...a, accessories: [...u, r.id] }),
            c ? `Đã đổi ${o(c).label.toLowerCase()} sang ${s.label.toLowerCase()}.` : null,
          );
    }
    case `reset`:
      return T(e, i, t(i.initial), null);
  }
}
function E(e) {
  let t = l(e.style),
    n = [t.label];
  return (
    t.family === `aodai` && n.push(e.cut === `suong` ? `Dáng suông` : `Tà dài`),
    n.push(t.primary[e.primary]?.name ?? ``),
    e.accessories.length > 0 && n.push(e.accessories.map((e) => o(e).label).join(`, `)),
    n.filter(Boolean).join(` · `)
  );
}
var D = e({ openOutfitEditor: () => R }),
  O = [
    { id: `style`, label: `Kiểu áo` },
    { id: `color`, label: `Màu` },
    { id: `accessory`, label: `Phụ kiện` },
  ],
  k = {
    "trang-xam": `Áo tràng đi chùa màu xám tro, giản dị.`,
    "trang-lam": `Áo tràng màu lam của Phật tử tại gia.`,
    "ba-ba": `Áo bà ba cổ tròn, hàng khuy trước ngực, quần ống rộng.`,
    "ao-dai": `Áo dài cổ đứng, tay dài; chọn tà dài hay dáng suông.`,
    "tu-than": `Áo tứ thân mở vạt, yếm thắm, thắt lưng lụa và khăn mỏ quạ.`,
    "dai-sen": `Áo dài có dải thêu hoa sen trên tà trước.`,
    "trang-vien": `Áo tràng tại gia viền chỉ vàng ở cổ, tay và gấu áo.`,
    "ban-dao": `Áo bà ba, hoa sen cài áo và túi vải dệt của người rủ bạn đi chùa.`,
    kol: `Áo dài thêu sen chỉ vàng trước ngực, khăn thắt lưng thắt nơ bên hông.`,
  },
  A = {
    trim: `Màu viền`,
    trousers: `Màu quần`,
    bodice: `Màu yếm`,
    embroidery: `Màu chỉ thêu`,
    sash: `Màu khăn thắt lưng`,
  },
  j = `<svg class="outfit__lock" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
  M = `button:not([disabled]):not([tabindex="-1"]), [tabindex="0"]`,
  N = `Chưa mở được hướng dẫn, bạn thử lại nhé.`;
function P(e, t, n) {
  return n ? `${e}, đang khoá, chạm để xem cách mở${t ? ` (${t})` : ``}` : `${e}, đang khoá: ${t ?? ``}`;
}
var F = (e) => `#${e.toString(16).padStart(6, `0`)}`,
  I = null;
function L(e) {
  let t = O.map(
      (e) =>
        `<button type="button" class="outfit__tab" role="tab" id="outfit-tab-${e.id}" aria-controls="outfit-panel-${e.id}" data-tab="${e.id}">${e.label}</button>`,
    ).join(``),
    n = a
      .map(
        (e) =>
          `<button type="button" class="outfit__style" role="radio" data-style="${e.id}"><span class="outfit__style-dot" aria-hidden="true"></span><span class="outfit__style-text"><span class="outfit__style-name">${e.label}</span><span class="outfit__style-note" data-note></span></span></button>`,
      )
      .join(``),
    o = r
      .map(
        (e) =>
          `<button type="button" class="chip outfit__cut" role="radio" data-cut="${e.id}">${e.label}</button>`,
      )
      .join(``),
    c = i
      .map(
        (e) =>
          `<button type="button" class="outfit__acc" data-acc="${e.id}" aria-pressed="false"><span class="outfit__acc-name">${e.label}</span><span class="outfit__acc-note" data-note></span></button>`,
      )
      .join(``);
  return `
    <div class="outfit__sheet">
      <header class="outfit__head">
        <h2 class="outfit__title" id="outfit-title">Trang phục</h2>
        ${e ? `<button type="button" class="outfit__icon" data-ref="turn" aria-pressed="false">${s(`reset`)}<span class="sr-only" data-ref="turnLabel">Xem phía sau</span></button>` : ``}
        <button type="button" class="outfit__icon" data-ref="close" aria-label="Đóng">${s(`close`)}</button>
      </header>
      <p class="outfit__now" id="outfit-now" data-ref="now"></p>
      <div class="outfit__tabs" role="tablist" aria-label="Tuỳ chỉnh trang phục">${t}</div>
      <div class="outfit__panels">
        <section class="outfit__panel" role="tabpanel" id="outfit-panel-style" aria-labelledby="outfit-tab-style" data-panel="style">
          <div class="outfit__styles" role="radiogroup" aria-label="Kiểu áo" aria-describedby="outfit-blurb" data-ref="styles">${n}</div>
          <p class="outfit__hint outfit__blurb" id="outfit-blurb" data-ref="blurb"></p>
          <div class="outfit__group" data-ref="cutGroup">
            <p class="outfit__label" id="outfit-cut-label">Dáng áo dài</p>
            <div class="outfit__cuts" role="radiogroup" aria-labelledby="outfit-cut-label" data-ref="cuts">${o}</div>
          </div>
        </section>
        <section class="outfit__panel" role="tabpanel" id="outfit-panel-color" aria-labelledby="outfit-tab-color" data-panel="color">
          <p class="outfit__label" id="outfit-primary-label">Màu chính</p>
          <div class="outfit__swatches" role="radiogroup" aria-labelledby="outfit-primary-label" data-ref="primary"></div>
          <p class="outfit__label" id="outfit-secondary-label" data-ref="secondaryLabel"></p>
          <div class="outfit__swatches" role="radiogroup" aria-labelledby="outfit-secondary-label" data-ref="secondary"></div>
        </section>
        <section class="outfit__panel" role="tabpanel" id="outfit-panel-accessory" aria-labelledby="outfit-tab-accessory" data-panel="accessory">
          <p class="outfit__hint">Thêm tối đa hai món, mỗi chỗ một món: nón lá hay khăn vấn, một chuỗi hạt, một món trước ngực.</p>
          <div class="outfit__accs" role="group" aria-label="Phụ kiện" data-ref="accs">${c}</div>
        </section>
      </div>
      <p class="outfit__msg" role="status" aria-live="polite" data-ref="msg"></p>
      <footer class="outfit__foot">
        <button type="button" class="btn btn--ghost" data-ref="cancel">Hủy</button>
        <button type="button" class="btn btn--gold" data-ref="save">Lưu</button>
      </footer>
    </div>`;
}
function R(e) {
  I?.close();
  let t = e.items ?? d(),
    r = { initial: e.initial, unlocked: e.unlocked, items: t },
    i = ee(r),
    a = !1,
    s = !1,
    m = !1,
    h = null,
    g = document.activeElement instanceof HTMLElement ? document.activeElement : null,
    _ = e.onGuide !== void 0,
    x = document.createElement(`dialog`);
  ((x.className = _ ? `outfit outfit--guide` : `outfit`),
    x.setAttribute(`aria-labelledby`, `outfit-title`),
    x.setAttribute(`aria-describedby`, `outfit-now`),
    (x.innerHTML = L(e.onTurn !== void 0)));
  let S = (e) => x.querySelector(`[data-ref="${e}"]`),
    C = [...x.querySelectorAll(`[role="tab"]`)],
    w = [...x.querySelectorAll(`[role="tabpanel"]`)],
    T = [...x.querySelectorAll(`[data-style]`)],
    D = [...x.querySelectorAll(`[data-cut]`)],
    O = [...x.querySelectorAll(`[data-acc]`)],
    R = S(`primary`),
    z = S(`secondary`);
  for (let t of T) {
    let n = l(t.dataset.style),
      r = t.querySelector(`.outfit__style-dot`);
    (r?.style.setProperty(`--sw`, F(n.primary[0]?.hex ?? 0)),
      r?.style.setProperty(`--sw2`, F(n.secondary[0]?.hex ?? 0)));
    let i = !e.unlocked.has(n.id),
      a = i ? v(n.id) : null;
    if ((t.classList.toggle(`is-locked`, i), i)) {
      (t.setAttribute(`aria-disabled`, `true`), t.setAttribute(`aria-label`, P(n.label, a, _)));
      let e = t.querySelector(`[data-note]`);
      e && (e.innerHTML = `${j}<span>${a ?? ``}</span>`);
    }
  }
  function B(e, n, r) {
    e.replaceChildren(
      ...n.map((e, n) => {
        let i = document.createElement(`button`);
        ((i.type = `button`), (i.className = `outfit__swatch`), i.setAttribute(`role`, `radio`));
        let a = !t.swatchOpen(e),
          o = a ? P(e.name, b(e), _) : e.name;
        (i.setAttribute(`aria-label`, o),
          (i.title = o),
          (i.dataset[r] = String(n)),
          i.style.setProperty(`--sw`, F(e.hex)));
        let s = document.createElement(`span`);
        return (
          (s.className = `outfit__dot`),
          s.setAttribute(`aria-hidden`, `true`),
          i.append(s),
          a && (i.classList.add(`is-locked`), i.setAttribute(`aria-disabled`, `true`), (s.innerHTML = j)),
          i
        );
      }),
    );
  }
  function V(e, t) {
    let n = !1;
    for (let r of e) {
      let e = t(r);
      (r.setAttribute(`aria-checked`, String(e)), (r.tabIndex = e ? 0 : -1), (n ||= e));
    }
    !n && e[0] && (e[0].tabIndex = 0);
  }
  function H() {
    let { spec: e, tab: r } = i,
      a = l(e.style);
    for (let e of C) {
      let t = e.dataset.tab === r;
      (e.setAttribute(`aria-selected`, String(t)), (e.tabIndex = t ? 0 : -1));
    }
    for (let e of w) e.hidden = e.dataset.panel !== r;
    if (
      (V(T, (t) => t.dataset.style === e.style),
      (S(`blurb`).textContent = k[e.style]),
      (S(`cutGroup`).hidden = a.family !== `aodai`),
      V(D, (t) => t.dataset.cut === e.cut),
      h !== e.style)
    ) {
      h = e.style;
      let t = R.contains(document.activeElement)
        ? `primary`
        : z.contains(document.activeElement)
          ? `secondary`
          : null;
      (B(R, a.primary, `primary`),
        B(z, a.secondary, `secondary`),
        (S(`secondaryLabel`).textContent = A[a.secondaryRole]),
        t && queueMicrotask(() => W(t === `primary` ? R : z)?.focus()));
    }
    (V(U(R), (t) => Number(t.dataset.primary) === e.primary),
      V(U(z), (t) => Number(t.dataset.secondary) === e.secondary));
    for (let r of O) {
      let i = r.dataset.acc,
        a = t.accessories.has(i),
        s = a && n(e.style, i);
      (r.setAttribute(`aria-pressed`, String(e.accessories.includes(i))),
        s ? r.removeAttribute(`aria-disabled`) : r.setAttribute(`aria-disabled`, `true`),
        r.classList.toggle(`is-locked`, !a),
        a ? r.removeAttribute(`aria-label`) : r.setAttribute(`aria-label`, P(o(i).label, y(i), _)));
      let c = r.querySelector(`[data-note]`);
      c && (a ? (c.textContent = s ? `` : `Bộ này đã có`) : (c.innerHTML = `${j}<span>${y(i) ?? ``}</span>`));
    }
    ((S(`now`).textContent = E(e)), (S(`msg`).textContent = i.message ?? ``));
  }
  let U = (e) => [...e.querySelectorAll(`button`)],
    W = (e) => e.querySelector(`[aria-checked="true"]`);
  function G(t) {
    let n = i.spec;
    ((i = te(i, t, r)), H(), c(n, i.spec) || e.onPreview(i.spec));
  }
  let K = (e) => {
      let t = e.dataset;
      return t.style
        ? { type: `style`, style: t.style }
        : t.cut
          ? { type: `cut`, cut: t.cut === `suong` ? `suong` : `ta` }
          : t.primary === void 0
            ? t.secondary === void 0
              ? t.acc
                ? { type: `accessory`, id: t.acc }
                : t.tab
                  ? { type: `tab`, tab: t.tab }
                  : null
              : { type: `secondary`, index: Number(t.secondary) }
            : { type: `primary`, index: Number(t.primary) };
    },
    q = (n) => {
      let r = n.dataset;
      if (r.style) {
        let t = r.style,
          n = p[t];
        return n && !e.unlocked.has(t) ? { req: n, item: l(t).label } : null;
      }
      if (r.acc) {
        let e = r.acc,
          n = u[e];
        return n && !t.accessories.has(e) ? { req: n, item: o(e).label } : null;
      }
      let a = l(i.spec.style),
        s =
          r.primary === void 0
            ? r.secondary === void 0
              ? void 0
              : a.secondary[Number(r.secondary)]
            : a.primary[Number(r.primary)],
        c = f(s);
      return s && c && !t.swatchOpen(s) ? { req: c, item: s.name } : null;
    };
  function J(t, n) {
    let r = e.onGuide;
    if (!r || t.getAttribute(`aria-busy`) === `true`) return;
    t.setAttribute(`aria-busy`, `true`);
    let a = i.message;
    r(n.req, n.item, t)
      .catch(() => !1)
      .then((e) => {
        (t.removeAttribute(`aria-busy`), !e && !s && (S(`msg`).textContent = `${N} ${a ?? ``}`.trim()));
      });
  }
  (x.addEventListener(`click`, (e) => {
    let t = e.target?.closest(`button`);
    if (!t || !x.contains(t)) return;
    let n = K(t);
    n && G(n);
    let r = q(t);
    r && J(t, r);
  }),
    x.addEventListener(`keydown`, (e) => {
      if (e.key === `Escape`) {
        (e.preventDefault(), Q());
        return;
      }
      if (e.key === `Tab`) {
        Y(e);
        return;
      }
      let t = e.target,
        n = t?.closest(`[role="tablist"], [role="radiogroup"]`);
      if (!t || !n) return;
      let r = U(n),
        i = r.indexOf(t);
      if (i < 0) return;
      let a = null;
      if (
        (e.key === `ArrowRight` || e.key === `ArrowDown`
          ? (a = (i + 1) % r.length)
          : e.key === `ArrowLeft` || e.key === `ArrowUp`
            ? (a = (i - 1 + r.length) % r.length)
            : e.key === `Home`
              ? (a = 0)
              : e.key === `End` && (a = r.length - 1),
        a === null)
      )
        return;
      e.preventDefault();
      let o = r[a];
      if (!o) return;
      let s = K(o);
      s && o.getAttribute(`aria-disabled`) !== `true` && G(s);
      for (let e of r) e.tabIndex = e === o ? 0 : -1;
      o.focus();
    }));
  function Y(e) {
    let t = [...x.querySelectorAll(M)].filter((e) => !e.closest(`[hidden]`)),
      n = t[0],
      r = t[t.length - 1];
    if (!n || !r) return;
    let i = document.activeElement,
      a = !x.contains(i);
    e.shiftKey && (i === n || a)
      ? (e.preventDefault(), r.focus())
      : !e.shiftKey && (i === r || a) && (e.preventDefault(), n.focus());
  }
  (x.addEventListener(`cancel`, (e) => {
    (e.preventDefault(), Q());
  }),
    S(`close`).addEventListener(`click`, () => Q()),
    S(`cancel`).addEventListener(`click`, () => Q()),
    S(`save`).addEventListener(`click`, () => {
      ((a = !0), e.onSave(i.spec), Q());
    }));
  let X = x.querySelector(`[data-ref="turn"]`);
  X?.addEventListener(`click`, () => {
    ((m = !m),
      X.setAttribute(`aria-pressed`, String(m)),
      (S(`turnLabel`).textContent = m ? `Xem phía trước` : `Xem phía sau`),
      e.onTurn?.(m));
  });
  let Z = () => Q();
  function Q() {
    s ||
      ((s = !0),
      e.signal?.removeEventListener(`abort`, Z),
      typeof x.close == `function` && x.open && x.close(),
      x.removeAttribute(`open`),
      x.remove(),
      I === $ && (I = null),
      g?.isConnected && g.focus({ preventScroll: !0 }),
      e.onClose(a));
  }
  let $ = { dialog: x, close: Q };
  return (
    (I = $),
    H(),
    document.body.append(x),
    typeof x.showModal == `function` ? x.showModal() : x.setAttribute(`open`, ``),
    e.signal?.aborted ? Q() : e.signal?.addEventListener(`abort`, Z, { once: !0 }),
    s || W(S(`styles`))?.focus({ preventScroll: !0 }),
    $
  );
}
export { D as t };
