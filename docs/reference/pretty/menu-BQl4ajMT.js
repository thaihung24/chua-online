import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { Et as t, Mt as n, Tt as r, Yt as i, ft as a, gt as o } from "./index-e_Bx6V48.js";
import { c as s, d as c, h as l, u } from "./lazy-shared-D8DtrU9N.js";
var d = e({
    ABOUT_LABEL: () => _,
    MENU_FRIENDS_LABEL: () => w,
    MENU_INSTALL_LABEL: () => C,
    MENU_PRIVACY_HREF: () => S,
    MENU_PRIVACY_LABEL: () => x,
    MENU_RULES_HREF: () => b,
    MENU_RULES_LABEL: () => y,
    MENU_YT_LABEL: () => v,
    NEXT_HOW_LABEL: () => T,
    NEXT_WHY: () => D,
    WALK_ITEMS: () => h,
    buildMoreMenu: () => F,
    nextTitle: () => E,
  }),
  f = `<path d="M7.5 11h9l-.9 9.2a1 1 0 0 1-1 .8H9.4a1 1 0 0 1-1-.8z"/><path d="M8 15.5h8"/><path d="M9.6 11 8.8 6M12 11V3.5M14.4 11l.8-5"/>`;
function p(e) {
  let t = o(e.icon);
  return e.glyph ? `${t.slice(0, t.indexOf(`>`) + 1)}${e.glyph}</svg>` : t;
}
var m = {
    chant: { icon: `book`, action: `chant` },
    meditate: { icon: `lotus`, action: `meditate` },
    sit: { icon: `seat`, action: `sit` },
    incense: { icon: `incense`, action: `incense` },
    stroll: { icon: `walk`, sheet: `walk` },
    share: { icon: `share`, action: `share` },
    kol: { icon: `sparkle`, ref: `kol`, accent: `kol` },
    fanpage: { icon: `info`, glyph: u, href: c },
    flower: { icon: `flower`, action: `flowers` },
    bell: { icon: `bell`, action: `bell` },
    candle: { icon: `candle`, action: `candle` },
    lantern: { icon: `lamp`, action: `lantern` },
    today: { icon: `calendar`, action: `today`, badge: `todayItemBadge` },
    talks: { icon: `play`, action: `talks` },
    wardrobe: { icon: `outfit`, action: `outfit` },
    mindful: { icon: `lotus`, action: `mindful` },
    xinque: { icon: `sparkle`, glyph: f, action: `xinque` },
    release: { icon: `fish`, action: `release` },
    loc: { icon: `loc`, action: `loc` },
  },
  h = [
    { action: `goYard`, label: `Sân trước &amp; hồ sen`, icon: `pond` },
    { action: `goBodhi`, label: `Cây bồ đề`, icon: `bodhi` },
    { action: `goMeditate`, label: `Sân thiền`, icon: `zen` },
    { action: `goQuanAm`, label: `Quan Âm`, icon: `quanam` },
    { action: `goWell`, label: `Giếng ngọc`, icon: `well` },
    { action: `goHall`, label: `Chánh điện`, icon: `temple` },
  ],
  g = t.more,
  _ = `Về Chùa Sen`,
  v = `Kênh YouTube của người làm Chùa Sen`,
  y = `Nội quy`,
  b = `/noi-quy/`,
  x = `Quyền riêng tư`,
  S = `/chinh-sach-quyen-rieng-tu/`,
  C = `Cài ứng dụng`,
  w = `Bạn đạo`,
  T = `Cách lên cấp`,
  E = (e) => `Lên cấp ${e} để mở thêm`,
  D = `Lạy Phật, thắp hương, tụng kinh, ngồi thiền hay quét lá đa đều được tính tinh tấn để lên cấp.`,
  O = (e) => `<span class="hud-badge" data-ref="${e}" aria-hidden="true"></span>`;
function k(e) {
  let t = m[e.id];
  if (!t) return ``;
  let n =
      `data-feature="${e.id}"` +
      (t.action ? ` data-action="${t.action}"` : ``) +
      (t.ref ? ` data-ref="${t.ref}"` : ``) +
      (t.sheet ? ` data-sheet="${t.sheet}"` : ``),
    r = t.sheet ? `${e.label}<span aria-hidden="true"> ›</span>` : e.label;
  return t.href
    ? `<a class="hud-pop__item" role="menuitem" href="${t.href}" target="_blank" rel="noopener" ${n}>${p(t)}<span>${r}</span></a>`
    : `<button type="button" class="hud-pop__item${t.accent ? ` hud-pop__item--${t.accent}` : ``}" role="menuitem" ${n}>${p(t)}<span>${r}</span>${t.badge ? O(t.badge) : ``}</button>`;
}
function A(e) {
  let n = t[e],
    i = r
      .filter((t) => t.group === e)
      .map(k)
      .join(``);
  return `<div class="hud-pop__group hud-pop__group--${e}" role="group" aria-label="${n}" data-group="${e}">${e === `more` ? `` : `<p class="hud-pop__title">${n}</p>`}<div class="hud-pop__grid">${i}</div></div>`;
}
var j = (e) =>
    `<button type="button" class="hud-pop__back" role="menuitem" data-back>${o(`chevron-left`)}<span><span class="sr-only">Quay lại: </span>${e}</span></button>`,
  M = (e) =>
    `<button type="button" class="hud-pop__item" role="menuitem" data-action="${e.action}">${o(e.icon)}<span>${e.label}</span></button>`;
function N(e) {
  let t = m[e.id];
  return `<span class="hud-pop__chip">${t ? p(t) : o(`bodhi`)}<span>${e.label}</span></span>`;
}
function P(e) {
  let t = e.levelGuide !== void 0,
    n =
      `<span class="sr-only" data-ref="nextText"></span><span class="hud-pop__next-head" aria-hidden="true">${o(`lotus`)}<span data-ref="nextTitle"></span></span><span class="hud-pop__next-list" aria-hidden="true" data-ref="nextList"></span>` +
      (t ? `` : `<span class="sr-only">. </span>`) +
      `<span class="hud-pop__next-why"${t ? ` id="hud-next-why" aria-hidden="true"` : ``}>${D}</span>`,
    r = t
      ? `<button type="button" class="hud-pop__next" role="menuitem" aria-describedby="hud-next-why" data-ref="next" hidden>${n}<span class="sr-only">. </span><span class="hud-pop__how">${T}${o(`chevron-right`)}</span></button>`
      : `<p class="hud-pop__next" data-ref="next" hidden>${n}</p>`;
  return `
    <div class="hud-pop__view" data-view="main">
      <div class="hud-pop__row">${A(`practice`)}${A(`offering`)}</div>
      <div class="hud-pop__row">${A(`explore`)}${A(`spread`)}</div>
      <div class="hud-pop__corner">
        <button type="button" class="hud-pop__link" role="menuitem" data-sheet="extra" data-ref="extraLink"><span>${g}</span>${o(`chevron-right`)}${O(`extraBadge`)}</button>
      </div>
    </div>
    <div class="hud-pop__view" data-view="walk" role="group" aria-label="Đi dạo" hidden>
      ${j(`Đi dạo`)}
      <div class="hud-pop__grid">${h.map(M).join(``)}</div>
    </div>
    <div class="hud-pop__view" data-view="extra" hidden>
      ${j(g)}
      ${A(`more`)}
      ${r}
      ${e.friends ? `<div class="hud-pop__group" role="group" aria-label="${w}"><button type="button" class="hud-pop__item hud-pop__foot" role="menuitem" data-ref="friends">${o(`users`)}<span>${w}</span></button></div>` : ``}
      <div class="hud-pop__group" role="group" aria-label="${_}">
        <p class="hud-pop__title">${_}</p>
        <a class="hud-pop__item hud-pop__foot" href="${b}" target="_blank" rel="noopener" data-ref="rules" role="menuitem">${o(`info`)}<span>${y}</span></a>
        <a class="hud-pop__item hud-pop__foot" href="${S}" target="_blank" rel="noopener" data-ref="privacy" role="menuitem">${o(`book`)}<span>${x}</span></a>
        <a class="hud-pop__item hud-pop__foot" href="${i.url}" target="_blank" rel="noopener noreferrer" data-yt="menu" role="menuitem">${o(`youtube`)}<span>${v}</span></a>
        <button type="button" class="hud-pop__item hud-pop__foot" role="menuitem" data-ref="feedback">${o(`message`)}<span>${e.feedbackLabel}</span></button>
        <button type="button" class="hud-pop__item hud-pop__foot" role="menuitem" data-ref="install" hidden>${o(`download`)}<span>${C}</span></button>
      </div>
    </div>`;
}
function F(e, t) {
  e.innerHTML = P(t);
  let r = (t) => e.querySelector(t),
    i = (t) => Array.from(e.querySelectorAll(t)),
    o = i(`[data-feature]`),
    c = i(`[data-group]`),
    u = i(`.hud-pop__row`),
    d = i(`[data-view]`),
    f = r(`[data-view="extra"]`),
    p = r(`[data-ref="extraLink"]`),
    m = r(`[data-ref="extraBadge"]`),
    h = r(`[data-ref="todayItemBadge"]`),
    _ = r(`[data-ref="next"]`),
    v = r(`[data-ref="nextText"]`),
    y = r(`[data-ref="nextTitle"]`),
    b = r(`[data-ref="nextList"]`),
    x = r(`[data-ref="install"]`),
    S = 0,
    C = () => {
      x && (x.hidden = a() === null);
    },
    w = null,
    T = (e) => {
      for (let t of d) t.hidden = t.dataset.view !== e;
    },
    D = () => {
      if (!w) return !1;
      let e = w;
      return ((w = null), T(`main`), e.focus({ preventScroll: !0 }), !0);
    };
  r(`[data-feature="talks"]`)?.addEventListener(`click`, () => s(`menu`));
  for (let e of i(`[data-action]`)) t.action(e);
  for (let e of i(`[data-sheet]`))
    e.addEventListener(`click`, () => {
      w = e;
      let t = e.dataset.sheet ?? `main`;
      (T(t), r(`[data-view="${t}"] [role="menuitem"]`)?.focus({ preventScroll: !0 }));
    });
  for (let e of i(`[data-back]`)) e.addEventListener(`click`, D);
  r(`a[data-feature="fanpage"]`)?.addEventListener(`click`, () => l(`menu`));
  for (let e of o) e.addEventListener(`click`, () => t.feature(e.dataset.feature, e));
  for (let e of i(`a[data-yt]`)) t.yt(e);
  (r(`[data-ref="feedback"]`)?.addEventListener(`click`, () => t.feedback()),
    x?.addEventListener(`click`, () => t.install()),
    r(`[data-ref="kol"]`)?.addEventListener(`click`, () => t.kol()));
  let { friends: O } = t;
  O && r(`[data-ref="friends"]`)?.addEventListener(`click`, O);
  let { levelGuide: k } = t;
  return (
    k &&
      _?.addEventListener(`click`, () => {
        S > 0 && k(S);
      }),
    {
      apply(e, t) {
        for (let t of o) {
          let n = t.dataset.feature;
          ((t.hidden = !e.unlocked.has(n)), t.classList.toggle(`is-new`, !t.hidden && e.fresh.has(n)));
        }
        for (let e of c) {
          let t = e.querySelectorAll(`[data-feature]:not([hidden])`).length;
          ((e.hidden = t === 0),
            e.style.setProperty(`--n`, String(e.dataset.group === `more` ? Math.min(t, 3) : t)));
        }
        for (let e of u) e.hidden = e.querySelector(`[data-group]:not([hidden])`) === null;
        if (_) {
          let t = n(e.next);
          ((S = e.next[0]?.minLevel ?? 0),
            v &&
              v.textContent !== t &&
              ((v.textContent = t),
              y && (y.textContent = t ? E(S) : ``),
              b && (b.innerHTML = e.next.map(N).join(``))),
            (_.hidden = t === ``));
        }
        let r = f?.querySelectorAll(`.is-new`).length ?? 0;
        (h && (h.hidden = !t), m && (m.hidden = !t && r === 0));
        let i = t ? `có lời nhắc hôm nay` : r > 0 ? `có mục mới` : null;
        (i ? p?.setAttribute(`aria-label`, `${g} (${i})`) : p?.removeAttribute(`aria-label`), C());
      },
      reset() {
        ((w = null), T(`main`), C());
      },
      back: D,
      shownTiles: () => e.querySelectorAll(`[data-view="main"] [data-feature]:not([hidden])`).length,
    }
  );
}
export { d as t };
