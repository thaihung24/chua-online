import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import "./index-e_Bx6V48.js";
var t = e({ mountMixer: () => s }),
  n = [
    {
      id: `master`,
      key: `volume`,
      title: `Âm lượng tổng`,
      hint: `Chung cho mọi tiếng trong chùa`,
      preview: `sfx`,
    },
    {
      id: `music`,
      key: `musicVolume`,
      title: `Nhạc nền chùa`,
      hint: `Nhạc tịnh tâm: đàn dây, chuông, tiếng ngân`,
      layer: { key: `musicOn`, label: `Bật nhạc nền` },
    },
    {
      id: `mo`,
      key: `moVolume`,
      title: `Mõ & chuông`,
      hint: `Mõ gõ đều theo Nhịp mõ, chuông thỉnh mỗi bốn câu; cả mõ và khánh Tụng kinh`,
      layer: { key: `moLoopOn`, label: `Bật mõ & chuông đều nhịp` },
      preview: `mo`,
    },
    {
      id: `chant`,
      key: `chantVolume`,
      title: `Tiếng niệm đại chúng`,
      hint: `Bật bằng nút "Nghe niệm Phật" trên màn hình; cả giọng "Chỉ tiếng mõ"`,
    },
    {
      id: `sfx`,
      key: `sfxVolume`,
      title: `Hiệu ứng (chuông dâng lễ, lần hạt)`,
      hint: `Lễ Phật, dâng lễ, thỉnh chuông, lần hạt, tiếng bấm`,
      preview: `sfx`,
    },
  ],
  r = `Tự nghỉ khi bạn nghe niệm Phật, nghe pháp thoại, ngồi thiền hay tự gõ mõ.`,
  i = (e, t, n = ``) =>
    `<label class="set-switch set-switch--sub"><span class="set-switch__text">${t}</span><input class="set-switch__input" type="checkbox" role="switch" data-ref="${e}"${n ? ` aria-describedby="${n}"` : ``} /><span class="set-switch__track" aria-hidden="true"></span></label>`;
function a(e, t, n, r, i = ``, a = ``) {
  return `
  <div class="set-channel" data-channel="${e}">
    <div class="set-row">
      <div class="set-channel__text">
        <span class="set-channel__title">${t}</span>
        ${a || `<span class="set-hint">${n}</span>`}
      </div>
      <output class="set-range__value" for="set-vol-${e}" aria-live="off" data-ref="out-${e}"></output>
    </div>
    ${i}
    ${r}
  </div>`;
}
var o = (e, t, n = 0, r = 100) =>
  `<input id="set-vol-${e}" type="range" min="${n}" max="${r}" step="1" aria-label="${t}" data-ref="vol-${e}" />`;
function s(e, t) {
  let { store: s, audio: c } = t;
  (e.classList.add(`set-mixer`),
    (e.hidden = !1),
    (e.innerHTML =
      n
        .map((e) =>
          a(
            e.id,
            e.title,
            e.hint,
            o(e.id, e.title),
            e.layer
              ? e.id === `mo`
                ? `<div class="set-item">${i(`on-${e.id}`, e.layer.label, `set-mo-loop-hint`)}<p class="set-hint" id="set-mo-loop-hint">${r}</p></div>`
                : i(`on-${e.id}`, e.layer.label)
              : ``,
            e.id === `chant` && t.onOpenListen
              ? `<button type="button" class="btn btn--sm set-listen" data-ref="listen">Chọn giọng, tốc độ</button>`
              : ``,
          ),
        )
        .join(``) +
      a(
        `tempo`,
        `Nhịp mõ`,
        `Một nhịp cho mõ đều nhịp, "Chỉ tiếng mõ" và Tụng kinh`,
        o(`tempo`, `Nhịp mõ`, 40, 110),
      ) +
      a(
        `ambient`,
        `Không gian`,
        `Gió, chim, tiếng chuông xa; cũng là mức tiếng mõ tổng hợp khi chưa tải được bản niệm Phật`,
        o(`ambient`, `Mức không gian`),
        i(`on-ambient`, `Bật không gian`),
      ) +
      `<label class="set-switch" data-ref="backgroundRow">
      <span class="set-switch__text">Phát khi chuyển tab</span>
      <input class="set-switch__input" type="checkbox" role="switch" data-ref="background" />
      <span class="set-switch__track" aria-hidden="true"></span>
    </label>`));
  let l = (t) => e.querySelector(`[data-ref="${t}"]`),
    u = (e) => l(`out-${e}`),
    d = (e) => l(`vol-${e}`),
    f = (e) => l(`on-${e}`);
  function p(e, t, n = String(t)) {
    let r = d(e);
    ((r.value = String(t)), r.setAttribute(`aria-valuetext`, n), (u(e).textContent = n));
    let i = Number(r.min),
      a = Number(r.max) - i;
    r.style.setProperty(`--fill`, `${a > 0 ? ((Number(r.value) - i) / a) * 100 : 0}%`);
  }
  function m() {
    let t = s.getSettings();
    for (let e of n)
      (p(e.id, Math.round(t[e.key] * 100)),
        (d(e.id).disabled = !t.sound),
        e.layer && (f(e.id).checked = t[e.layer.key]));
    (p(`tempo`, t.chantTempo, `${t.chantTempo} tiếng/phút`),
      (d(`tempo`).disabled = !t.sound),
      p(`ambient`, Math.round(t.ambientVolume * 100)),
      (f(`ambient`).checked = t.ambientOn),
      (d(`ambient`).disabled = !t.sound),
      (l(`background`).checked = t.playInBackground));
    let r = e.closest(`dialog`)?.querySelector(`[data-ref="sound"]`);
    r && (r.checked = t.sound);
    for (let n of e.querySelectorAll(`.set-channel`)) n.classList.toggle(`is-off`, !t.sound);
  }
  for (let e of n) {
    let t = d(e.id);
    if (
      (t.addEventListener(`input`, () => {
        s.updateSettings({ [e.key]: Number(t.value) / 100 });
      }),
      e.preview)
    ) {
      let n = e.preview;
      t.addEventListener(`change`, () => {
        (c.unlock(), c.play(`khanh`, n === `mo` ? { bus: n } : void 0));
      });
    }
  }
  (f(`music`).addEventListener(`change`, () => {
    let e = f(`music`).checked;
    t.onMusic ? t.onMusic(e) : s.updateSettings({ musicOn: e });
  }),
    f(`mo`).addEventListener(`change`, () => {
      let e = f(`mo`).checked;
      (e && c.unlock(), s.updateSettings(e ? { moLoopOn: !0, sound: !0 } : { moLoopOn: !1 }));
    }),
    d(`tempo`).addEventListener(`input`, () => {
      s.updateSettings({ chantTempo: Number(d(`tempo`).value) });
    }),
    d(`ambient`).addEventListener(`input`, () => {
      s.updateSettings({ ambientVolume: Number(d(`ambient`).value) / 100 });
    }),
    f(`ambient`).addEventListener(`change`, () => {
      s.updateSettings({ ambientOn: f(`ambient`).checked });
    }),
    l(`background`).addEventListener(`change`, () => {
      s.updateSettings({ playInBackground: l(`background`).checked });
    }),
    e.querySelector(`[data-ref="listen"]`)?.addEventListener(`click`, () => t.onOpenListen?.()),
    m());
  let h = s.subscribe(m);
  return (e.closest(`dialog`)?.addEventListener(`close`, h, { once: !0 }), h);
}
export { t };
