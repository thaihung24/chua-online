import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { Jt as t, l as n, s as r, wt as i } from "./index-e_Bx6V48.js";
import { a, c as o, d as s, f as c, l, m as u, o as d, p as f, s as ee, u as p } from "./sound-D3Z2fPqp.js";
import { gt as m } from "./app-z_oU8L_u.js";
import { r as h } from "./vn-time-DznqUr4I.js";
import { n as g, o as _, r as v } from "./dialog-DwXghOMX.js";
var y = `\r
`,
  b = (e, t = 2) => String(e).padStart(t, `0`);
function x(e) {
  return e.replace(/\\/g, `\\\\`).replace(/;/g, `\\;`).replace(/,/g, `\\,`).replace(/\n/g, `\\n`);
}
function S(e) {
  let t = new TextEncoder(),
    n = [],
    r = ``,
    i = 0;
  for (let a of e) {
    let e = t.encode(a).length;
    (i + e > 75 && (n.push(r), (r = ` `), (i = 1)), (r += a), (i += e));
  }
  return (n.push(r), n.join(y));
}
function C(e) {
  let t = new Date(h(e) * 864e5);
  return `${t.getUTCFullYear()}${b(t.getUTCMonth() + 1)}${b(t.getUTCDate())}`;
}
function w(e) {
  let t = new Date(e);
  return `${t.getUTCFullYear()}${b(t.getUTCMonth() + 1)}${b(t.getUTCDate())}T${b(t.getUTCHours())}${b(t.getUTCMinutes())}${b(t.getUTCSeconds())}Z`;
}
function T(e, n = Date.now()) {
  let r = b(e),
    i = `Công phu chung ở Chùa Sen`;
  return (
    [
      `BEGIN:VCALENDAR`,
      `VERSION:2.0`,
      `PRODID:-//Chua Sen//Cong phu chung//VI`,
      `CALSCALE:GREGORIAN`,
      `METHOD:PUBLISH`,
      `BEGIN:VTIMEZONE`,
      `TZID:Asia/Ho_Chi_Minh`,
      `BEGIN:STANDARD`,
      `DTSTART:19700101T000000`,
      `TZOFFSETFROM:+0700`,
      `TZOFFSETTO:+0700`,
      `TZNAME:+07`,
      `END:STANDARD`,
      `END:VTIMEZONE`,
      `BEGIN:VEVENT`,
      `UID:cong-phu-chung-${r}00@chuasen.com`,
      `DTSTAMP:${w(n)}`,
      `DTSTART;TZID=Asia/Ho_Chi_Minh:${C(n)}T${r}0000`,
      `DURATION:PT${t.durationMinutes}M`,
      `RRULE:FREQ=DAILY`,
      `SUMMARY:${x(i)}`,
      `DESCRIPTION:${x(`Niệm Phật cùng mọi người ${t.durationMinutes} phút ở Chùa Sen, chùa online: chuasen.com`)}`,
      `URL:https://chuasen.com/`,
      `BEGIN:VALARM`,
      `ACTION:DISPLAY`,
      `DESCRIPTION:${x(i)}`,
      `TRIGGER:PT0M`,
      `END:VALARM`,
      `END:VEVENT`,
      `END:VCALENDAR`,
    ]
      .map(S)
      .join(y) + y
  );
}
var E = (e) => `chua-sen-cong-phu-${b(e)}00.ics`;
function D() {
  return (
    typeof Blob == `function` &&
    typeof URL < `u` &&
    typeof URL.createObjectURL == `function` &&
    typeof HTMLAnchorElement < `u` &&
    `download` in HTMLAnchorElement.prototype
  );
}
var O = 4e4;
function te(e, t = Date.now()) {
  if (!D()) return !1;
  try {
    let n = URL.createObjectURL(new Blob([T(e, t)], { type: `text/calendar;charset=utf-8` })),
      r = document.createElement(`a`);
    return (
      (r.href = n),
      (r.download = E(e)),
      (r.hidden = !0),
      document.body.append(r),
      r.click(),
      r.remove(),
      setTimeout(() => URL.revokeObjectURL(n), O),
      !0
    );
  } catch {
    return !1;
  }
}
var k = e({ openListenDialog: () => z }),
  A = `Giọng niệm Phật & nhạc nền`,
  j = `Giọng miền Bắc: Chùa Sen đang xin thu âm cùng một ngôi chùa, sắp có.`,
  M = { 1: `1× Bình thường`, 0.9: `0,9× Chậm`, 0.8: `0,8× Chậm hơn` },
  N = `off`,
  P = 6e4,
  F = 250,
  I = (e) => e.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`),
  L = (e, t, n, r = ``) =>
    `<label class="listen-dlg__opt"><input type="radio" name="${e}" value="${I(t)}" /><span class="listen-dlg__opt-text"><span class="listen-dlg__opt-label">${I(n)}</span>${r ? `<span class="listen-dlg__opt-hint">${I(r)}</span>` : ``}</span></label>`,
  R = null;
function z(e) {
  R?.isConnected && g(R);
  let { store: t, soundscape: h } = e,
    y = e.prefs ?? o,
    b = e.now ?? (() => Date.now()),
    x =
      e.opener === void 0
        ? document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
        : e.opener,
    S = f(n, l),
    C = document.createElement(`dialog`);
  ((C.className = `listen-dlg`),
    C.setAttribute(`aria-labelledby`, `listen-title`),
    (C.innerHTML = `
    <div class="listen-dlg__card">
      <header class="listen-dlg__head">
        <h2 id="listen-title" class="listen-dlg__title">${I(A)}</h2>
        <button type="button" class="btn btn--ghost btn--sm" data-ref="close">Đóng</button>
      </header>
      <div class="listen-dlg__body">
        <section class="listen-dlg__section" aria-labelledby="listen-chant-title">
          <h3 id="listen-chant-title" class="listen-dlg__heading">Niệm Phật</h3>
          <fieldset class="listen-dlg__group">
            <legend class="listen-dlg__legend">Cách nghe</legend>
            ${L(`listen-mode`, `chung`, `Nghe chung (đài chùa)`, `Mọi người cùng nghe một đoạn; 05:00 và 18:00 công phu chung`)}
            ${L(`listen-mode`, `rieng`, `Nghe riêng`, `Giọng, tốc độ và bài của riêng bạn, từ đầu bài`)}
          </fieldset>
          <p class="listen-dlg__community" data-ref="community" hidden>
            <span>Đang công phu chung</span>
            <button type="button" class="btn btn--sm" data-ref="joinCommunity">Nghe chung với mọi người</button>
          </p>
          ${
            D()
              ? `<div class="listen-dlg__cal" role="group" aria-labelledby="listen-cal-title">
            <p id="listen-cal-title" class="listen-dlg__muted">Thêm vào lịch: nhắc công phu chung mỗi ngày (tệp lịch tạo ngay trên máy).</p>
            <div class="listen-dlg__cal-row">
              <button type="button" class="btn btn--sm" data-cal="5">Thêm vào lịch 05:00</button>
              <button type="button" class="btn btn--sm" data-cal="18">Thêm vào lịch 18:00</button>
            </div>
          </div>`
              : ``
          }
          <fieldset class="listen-dlg__group">
            <legend class="listen-dlg__legend">Giọng</legend>
            ${S.map((e) => L(`listen-voice`, e, s[e], e === `mo` ? `Không lời, không cần tải` : ``)).join(``)}
            ${S.includes(`bac`) ? `` : `<p class="listen-dlg__muted" data-ref="northNote">${I(j)}</p>`}
          </fieldset>
          <fieldset class="listen-dlg__group" data-ref="speedGroup">
            <legend class="listen-dlg__legend">Tốc độ</legend>
            <div class="listen-dlg__row">
              ${ee.map((e) => L(`listen-speed`, String(e), M[e])).join(``)}
            </div>
            <p class="listen-dlg__muted" data-ref="speedNote">Chậm lại mà giọng vẫn giữ nguyên cao độ.</p>
          </fieldset>
          <p class="listen-dlg__status" aria-live="polite" data-ref="status"></p>
          <fieldset class="listen-dlg__group" data-ref="trackGroup">
            <legend class="listen-dlg__legend">Bài</legend>
            <div data-ref="tracks"></div>
          </fieldset>
          <button type="button" class="btn btn--gold listen-dlg__preview" data-ref="preview">Nghe thử</button>
        </section>
        <section class="listen-dlg__section" aria-labelledby="listen-music-title">
          <h3 id="listen-music-title" class="listen-dlg__heading">Nhạc nền</h3>
          <fieldset class="listen-dlg__group">
            <legend class="sr-only">Nhạc nền</legend>
            ${L(`listen-music`, d, `Lần lượt`, `Các bản nối nhau, bản đầu ngẫu nhiên`)}
            ${r.map((e) => L(`listen-music`, e.id, e.title, p[e.id] ?? ``)).join(``)}
            ${L(`listen-music`, a, `Nhạc tổng hợp (không cần tải)`, `Chùa Sen tự tạo khi phát`)}
            ${L(`listen-music`, N, `Không nhạc`)}
          </fieldset>
        </section>
      </div>
      <footer class="listen-dlg__foot">
        <p class="listen-dlg__credit" data-ref="credit"></p>
        <p class="listen-dlg__muted">Nguồn và giấy phép đầy đủ: Cài đặt → Nguồn và giấy phép.</p>
      </footer>
    </div>`));
  let w = (e) => C.querySelector(`[data-ref="${e}"]`),
    T = (e) => Array.from(C.querySelectorAll(`input[name="${e}"]`)),
    E = () => {
      for (let e of C.querySelectorAll(`.listen-dlg__opt > input`))
        (e.parentElement?.classList.toggle(`is-checked`, e.checked),
          e.parentElement?.classList.toggle(`is-disabled`, e.disabled));
    },
    O = (e, t) => {
      for (let n of T(e)) n.checked = n.value === t;
      E();
    },
    k = w(`community`),
    z = w(`status`),
    ne = w(`tracks`),
    re = w(`trackGroup`),
    B = w(`speedNote`),
    V = w(`credit`),
    H = w(`preview`),
    U = !1,
    W = () => {
      U || g(C);
    },
    G = (e, t, n) => {
      (y.update(e), i(`listen_choice`, { kind: t, value: n }));
    },
    K = null,
    q = (e) => {
      let t = c(e.voice, S),
        r = u(n, t, l);
      if (K !== t) {
        ((K = t),
          (re.hidden = r.length === 0),
          (ne.innerHTML =
            L(`listen-track`, `all`, `Tất cả`) +
            r
              .map((e) => n[e])
              .map((e) => (e ? L(`listen-track`, e.id, e.title) : ``))
              .join(``)));
        for (let e of T(`listen-track`))
          e.addEventListener(`change`, () => {
            e.checked && G({ track: e.value === `all` ? null : e.value, mode: `rieng` }, `track`, e.value);
          });
      }
      let i = r.some((t) => n[t]?.id === e.track) ? (e.track ?? `all`) : `all`;
      O(`listen-track`, i);
    },
    J = (e) => {
      (O(`listen-mode`, e.mode),
        O(`listen-voice`, c(e.voice, S)),
        O(`listen-speed`, String(e.speed)),
        q(e),
        Y(e));
    },
    Y = (e) => {
      k.hidden = !(e.mode === `rieng` && m(b()).live);
    },
    X = null,
    Z = () => {
      if (((X = null), U || !C.isConnected)) return;
      Y(y.read());
      let e = b(),
        t = m(e),
        n = t.live ? t.endsAtMs : t.startsAtMs;
      X = setTimeout(Z, Math.min(P, Math.max(0, n - e) + F));
    },
    Q = () => {
      if (!t.getSettings().musicOn) {
        O(`listen-music`, N);
        return;
      }
      let e = y.read().music,
        n = e === `tong-hop` || r.some((t) => t.id === e);
      O(`listen-music`, n ? e : d);
    },
    $ = (e) => {
      let t = e.speedUnavailable === !0;
      for (let e of T(`listen-speed`)) e.disabled = t;
      (E(),
        (B.textContent = t
          ? `Máy này chưa đổi được tốc độ: đang phát tốc độ gốc tới khi tải lại trang.`
          : `Chậm lại mà giọng vẫn giữ nguyên cao độ.`));
      let r = e.playing && e.loading && (e.speed ?? 1) !== 1;
      ((z.textContent = r ? `Đang chuẩn bị tốc độ…` : ``),
        (H.textContent = e.playing ? `Dừng nghe` : `Nghe thử`),
        H.setAttribute(`aria-pressed`, String(e.playing)));
      let i = y.read(),
        a = c(i.voice, S);
      if (e.source === `mo` || (!e.playing && i.mode === `rieng` && a === `mo`)) {
        V.textContent = `Tiếng mõ tổng hợp của Chùa Sen, không dùng bản ghi.`;
        return;
      }
      let o = u(n, a, l),
        s = e.trackId ?? (i.mode === `rieng` ? (i.track ?? n[o[0] ?? 0]?.id) : null),
        d = n.find((e) => e.id === s);
      V.textContent = d
        ? `${e.trackId ? `Đang phát` : `Bản đầu`}: ${d.title}. ${d.credit} (${d.license}).`
        : `Đài chùa phát lần lượt mọi bản ghi niệm Phật.`;
    };
  for (let e of T(`listen-mode`))
    e.addEventListener(`change`, () => {
      e.checked && G({ mode: e.value }, `mode`, e.value);
    });
  for (let e of T(`listen-voice`))
    e.addEventListener(`change`, () => {
      e.checked && G({ voice: e.value, track: null, mode: `rieng` }, `voice`, e.value);
    });
  for (let e of T(`listen-speed`))
    e.addEventListener(`change`, () => {
      e.checked && G({ speed: Number(e.value), mode: `rieng` }, `speed`, e.value);
    });
  for (let e of C.querySelectorAll(`[data-cal]`))
    e.addEventListener(`click`, () => {
      let t = Number(e.dataset.cal);
      te(t, b()) && i(`cal_add`, { slot: t });
    });
  w(`joinCommunity`).addEventListener(`click`, () => {
    G({ mode: `chung` }, `mode`, `chung`);
  });
  for (let e of T(`listen-music`))
    e.addEventListener(`change`, () => {
      e.checked &&
        (i(`listen_choice`, { kind: `music`, value: e.value }),
        e.value === N
          ? h.setMusic(!1)
          : (y.update({ music: e.value }), t.getSettings().musicOn || h.setMusic(!0)));
    });
  (H.addEventListener(`click`, () => {
    h.setChant(!h.getChantState().playing);
  }),
    w(`close`).addEventListener(`click`, W),
    C.addEventListener(`change`, E),
    C.addEventListener(
      `focus`,
      (e) => {
        let t = e.target;
        if (!(t instanceof HTMLInputElement)) return;
        let n = !0;
        try {
          n = t.matches(`:focus-visible`);
        } catch {}
        t.parentElement?.classList.toggle(`is-focus`, n);
      },
      !0,
    ),
    C.addEventListener(
      `blur`,
      (e) => {
        e.target instanceof HTMLInputElement && e.target.parentElement?.classList.remove(`is-focus`);
      },
      !0,
    ));
  let ie = y.onChange((e) => {
      (J(e), $(h.getChantState()));
    }),
    ae = t.subscribe(Q),
    oe = h.subscribe($);
  return (
    C.addEventListener(`close`, () => {
      ((U = !0),
        X !== null && clearTimeout(X),
        (X = null),
        ie(),
        ae(),
        oe(),
        C.remove(),
        R === C && (R = null),
        x?.isConnected && x.focus({ preventScroll: !0 }));
    }),
    v(C),
    J(y.read()),
    Q(),
    $(h.getChantState()),
    (R = C),
    document.body.append(C),
    _(C),
    Z(),
    T(`listen-mode`)
      .find((e) => e.checked)
      ?.focus({ preventScroll: !0 }),
    { element: C, close: W }
  );
}
export { k as t };
