import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { gt as t, wt as n } from "./index-e_Bx6V48.js";
var r = e({ mountGraphics: () => y, offerSmooth: () => O }),
  i = `chua-device:graphics`,
  a = `Đồ hoạ`,
  o = `Tiết kiệm pin`,
  s = `Tối đa 30 khung hình mỗi giây, máy mát và đỡ hao pin hơn.`,
  c = `Tải lại trang để áp dụng hết.`,
  l = `Tải lại ngay`,
  u = [
    { value: `auto`, label: `Tự động`, hint: `` },
    {
      value: `smooth`,
      label: `Mượt`,
      hint: `Ưu tiên tốc độ: không bóng nắng, không khử răng cưa, ít người hiện cùng lúc hơn. Hợp với điện thoại yếu.`,
    },
    { value: `balanced`, label: `Cân bằng`, hint: `Có bóng nắng và ánh kim, độ nét vừa phải.` },
    {
      value: `beautiful`,
      label: `Đẹp`,
      hint: `Nét nhất, nhiều người hiện ra nhất. Máy yếu có thể nóng và hao pin.`,
    },
  ],
  d = { low: `Mượt`, medium: `Cân bằng`, high: `Đẹp` },
  f = { low: 0, medium: 1, high: 2 },
  p = (e) => `Chùa tự chọn theo máy của bạn (đang dùng: ${d[e]}).`;
function m() {
  try {
    return typeof localStorage > `u` ? null : localStorage;
  } catch {
    return null;
  }
}
function h() {
  try {
    let e = JSON.parse(m()?.getItem(`chua-device:graphics`) ?? `null`);
    return typeof e == `object` && e && !Array.isArray(e) ? e : {};
  } catch {
    return {};
  }
}
function g(e) {
  return u.some((t) => t.value === e.preset)
    ? { preset: e.preset, saver: e.saver === !0 }
    : { preset: `auto`, saver: !1 };
}
function _(e) {
  let t = h(),
    n = m();
  if (!n) return !1;
  let r = typeof t.v == `number` && t.v > 1 ? t.v : 1;
  try {
    return (n.setItem(i, JSON.stringify({ preset: `auto`, saver: !1, ...t, ...e, v: r })), !0);
  } catch {
    return !1;
  }
}
var v = () => typeof h().hintAt == `number`;
function y(e, r) {
  let { engine: i } = r,
    d = g(h());
  e.innerHTML = `
    <h3 id="set-gfx-title" class="set-group__title">${t(`sparkle`)}${a}</h3>
    <div class="set-card">
      <div class="set-item">
        <p class="set-item__label" aria-hidden="true">Chất lượng hình ảnh</p>
        <fieldset class="set-seg set-seg--4" aria-describedby="set-gfx-hint">
          <legend class="set-seg__legend">Chất lượng hình ảnh</legend>
          ${u.map((e) => `<label class="set-seg__opt"><input type="radio" name="set-gfx" value="${e.value}" /><span>${e.label}</span></label>`).join(``)}
        </fieldset>
        <p class="set-hint" id="set-gfx-hint" aria-live="polite" data-gfx="hint"></p>
      </div>
      <div class="set-item">
        <label class="set-switch">
          <span class="set-switch__text">${o}</span>
          <input class="set-switch__input" type="checkbox" role="switch" aria-describedby="set-gfx-saver" data-gfx="saver" />
          <span class="set-switch__track" aria-hidden="true"></span>
        </label>
        <p class="set-hint" id="set-gfx-saver">${s}</p>
      </div>
      <div class="set-row set-gfx-reload" data-gfx="reload" hidden>
        <span class="set-hint" aria-hidden="true">${c}</span>
        <button type="button" class="btn btn--sm btn--gold" aria-describedby="set-gfx-reload-live" data-gfx="reloadBtn">${l}</button>
      </div>
    </div>
    <p class="sr-only" id="set-gfx-reload-live" role="status" aria-live="polite" data-gfx="reloadLive"></p>`;
  let m = (t) => e.querySelector(`[data-gfx="${t}"]`),
    v = [...e.querySelectorAll(`input[name="set-gfx"]`)],
    y = m(`hint`),
    b = m(`saver`),
    x = m(`reload`),
    S = m(`reloadLive`),
    C = (e, t) => {
      e.textContent !== t && (e.textContent = t);
    },
    w = () => r.tierOf(d.preset) !== i.quality,
    T = () => {
      for (let e of v) e.checked = e.value === d.preset;
      ((b.checked = d.saver),
        C(y, d.preset === `auto` ? p(r.tierOf(`auto`)) : (u.find((e) => e.value === d.preset)?.hint ?? ``)));
      let e = w();
      ((x.hidden = !e), C(S, e ? c : ``));
    },
    E = (e, t) => {
      (_(t),
        T(),
        n(`graphics_changed`, { from: e, to: d.preset, saver: d.saver, tier: i.quality, reload: w() }));
    };
  for (let e of v)
    e.addEventListener(`change`, () => {
      if (!e.checked || e.value === d.preset) return;
      let t = d.preset;
      d = { ...d, preset: e.value };
      let n = r.tierOf(d.preset);
      (i.setFrameCaps?.({ pixelRatio: f[n] < f[i.quality] ? r.prCap(n, window.innerWidth) : 0 }), E(t, d));
    });
  (b.addEventListener(`change`, () => {
    ((d = { ...d, saver: b.checked }),
      i.setFrameCaps?.({ fps: b.checked ? 30 : 0 }),
      E(d.preset, { saver: d.saver }));
  }),
    m(`reloadBtn`).addEventListener(`click`, () => {
      (n(`graphics_reload`, { to: d.preset }), location.reload());
    }),
    T(),
    (e.hidden = !1));
}
var b = `Máy đang hơi chậm. Thử đồ hoạ Mượt cho nhẹ máy nhé?`,
  x = `Dùng Mượt`,
  S = `Để sau`,
  C = `Đã chọn Mượt. Tải lại trang để nhẹ hẳn?`,
  w = `Tải lại`,
  T = 2e4,
  E = 12e3,
  D = 15e3;
function O(e) {
  let { engine: t, show: r } = e,
    i = t.quality,
    a,
    o = 0,
    s = !1,
    c = () => {
      (clearTimeout(a), s && r(null), (s = !1));
    },
    l = () => {
      (c(), n(`graphics_hint`, { action: `later`, tier: i }));
    },
    u = () => {
      (clearTimeout(a),
        _({ preset: `smooth` }),
        t.setFrameCaps?.({ pixelRatio: 1 }),
        n(`graphics_hint`, { action: `accept`, tier: i }),
        r(C, [
          {
            label: w,
            run: () => {
              (c(), n(`graphics_hint`, { action: `reload`, tier: i }), location.reload());
            },
          },
          { label: S, run: c },
        ]),
        (a = setTimeout(c, E)));
    },
    d = () => {
      v() ||
        (e.busy() || e.owner() !== null
          ? o++ < 8 && (a = setTimeout(d, D))
          : _({ hintAt: Date.now() }) &&
            ((s = !0),
            n(`graphics_hint`, { action: `shown`, tier: i }),
            r(b, [
              { label: x, run: u },
              { label: S, run: l },
            ]),
            (a = setTimeout(l, T))));
    };
  return (d(), c);
}
export { r as t };
