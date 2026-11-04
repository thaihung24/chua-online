import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { Xt as t, gt as n, w as r, wt as i } from "./index-e_Bx6V48.js";
import { L as a } from "./app-z_oU8L_u.js";
var o = [
    { id: `chao`, label: `Chào hỏi` },
    { id: `chuc`, label: `Lời chúc` },
    { id: `camon`, label: `Cảm ơn` },
    { id: `moi`, label: `Mời cùng` },
    { id: `dap`, label: `Đáp lời` },
  ],
  s = [
    { code: 0, id: `xin-chao`, cat: `chao`, label: `Xin chào bạn` },
    { code: 1, id: `chao-ca-nha`, cat: `chao`, label: `Chào cả nhà` },
    { code: 2, id: `vui-gap-ban`, cat: `chao`, label: `Rất vui gặp bạn`, retired: !0 },
    { code: 3, id: `hen-gap-lai`, cat: `chao`, label: `Hẹn gặp lại nhé` },
    { code: 4, id: `chuc-an-lanh`, cat: `chuc`, label: `Chúc bạn an lành` },
    { code: 5, id: `chuc-suc-khoe`, cat: `chuc`, label: `Chúc bạn sức khỏe` },
    { code: 6, id: `chuc-ngay-an-vui`, cat: `chuc`, label: `Chúc ngày an vui`, retired: !0 },
    { code: 7, id: `chuc-gia-dinh`, cat: `chuc`, label: `Chúc gia đình an khang` },
    { code: 8, id: `chuc-ngu-ngon`, cat: `chuc`, label: `Chúc bạn ngủ ngon`, retired: !0 },
    { code: 9, id: `cam-on`, cat: `camon`, label: `Cảm ơn bạn` },
    { code: 10, id: `lanh-thay`, cat: `camon`, label: `Lành thay, lành thay` },
    { code: 11, id: `tuy-hy-cung-ban`, cat: `camon`, label: `Tùy hỷ cùng bạn` },
    { code: 12, id: `chua-dep-qua`, cat: `camon`, label: `Chùa đẹp quá`, retired: !0 },
    { code: 13, id: `xin-loi`, cat: `camon`, label: `Xin lỗi bạn nhé` },
    { code: 14, id: `moi-tung-kinh`, cat: `moi`, label: `Mời bạn cùng tụng kinh`, invite: `chant` },
    { code: 15, id: `moi-thien`, cat: `moi`, label: `Mời bạn cùng ngồi thiền`, invite: `meditate` },
    { code: 16, id: `moi-niem-phat`, cat: `moi`, label: `Mời cùng niệm Phật`, invite: `beads` },
    { code: 17, id: `moi-quet-la`, cat: `moi`, label: `Mời cùng quét lá đa`, invite: `sweep` },
    { code: 18, id: `moi-thap-huong`, cat: `moi`, label: `Mời cùng thắp hương`, invite: `incense` },
    { code: 19, id: `moi-di-dao`, cat: `moi`, label: `Mời bạn đi dạo cùng`, invite: `come` },
    { code: 20, id: `lai-day`, cat: `moi`, label: `Lại đây cùng mình nhé`, invite: `come`, retired: !0 },
    { code: 21, id: `da-vang`, cat: `dap`, label: `Dạ vâng` },
    { code: 22, id: `minh-den-ngay`, cat: `dap`, label: `Mình đến ngay` },
    { code: 23, id: `khong-sao`, cat: `dap`, label: `Không sao đâu` },
    { code: 24, id: `de-luc-khac`, cat: `dap`, label: `Để lúc khác nhé` },
    { code: 25, id: `xin-phep-di`, cat: `dap`, label: `Xin phép đi trước`, retired: !0 },
  ],
  c = { chao: [`a-di-da-phat`, `tuy-hy`, `chuc-binh-an`] },
  l = new Map(s.map((e) => [e.code, e]));
function u(e) {
  return l.get(e);
}
function d(e, t, n = s) {
  let r = (c[e] ?? []).map((e) => ({ kind: `emote`, id: e, label: a[e] }));
  if (!t.phrases) return r;
  for (let t of n)
    if (t.cat === e && !t.retired) {
      let { id: e, label: n, code: i, invite: a } = t;
      r.push(
        a
          ? { kind: `phrase`, id: e, label: n, code: i, invite: a }
          : { kind: `phrase`, id: e, label: n, code: i },
      );
    }
  return r;
}
var f = `Câu nói có sẵn`,
  p = `Chờ chút rồi gửi tiếp nhé`,
  m = `Chỉ có câu có sẵn để chùa luôn an lành`,
  h = `Gợi ý thêm câu`,
  g = { chant: `book`, meditate: `lotus`, beads: `beads`, sweep: `broom`, incense: `incense`, come: `walk` },
  _ = `chao`,
  v = 0;
function y(e) {
  v += 1;
  let t = e.host ?? document.querySelector(`.hud-bar`) ?? document.body,
    a = e.opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null),
    s = o.filter((t) => d(t.id, { phrases: e.phrases }).length > 0),
    c = e.from === `hold` ? `chao` : _,
    l = s.some((e) => e.id === c) ? c : `chao`,
    u = `phrases-panel-${v}`,
    y = (e) => `phrases-tab-${v}-${e}`,
    b = document.createElement(`div`);
  ((b.className = `phrases`),
    b.setAttribute(`role`, `dialog`),
    b.setAttribute(`aria-label`, f),
    (b.innerHTML = `
    <div class="phrases__tabs" role="tablist" aria-label="${f}">${s.map((e) => `<button type="button" class="phrases__tab" role="tab" id="${y(e.id)}" data-cat="${e.id}" aria-controls="${u}" aria-selected="false" tabindex="-1">${e.label}</button>`).join(``)}</div>
    <div class="phrases__grid" role="tabpanel" id="${u}" data-ref="grid"></div>
    <p class="phrases__wait" role="status" data-ref="wait"></p>
    <p class="phrases__foot">${m} · <button type="button" class="phrases__suggest" data-ref="suggest">${h}</button></p>
    <button type="button" class="phrases__close" data-ref="close" aria-label="Đóng" title="Đóng">${n(`close`)}</button>`));
  let x = (e) => b.querySelector(`[data-ref="${e}"]`),
    S = x(`grid`),
    C = x(`wait`),
    w = [...b.querySelectorAll(`[role="tab"]`)],
    T,
    E = !1;
  function D() {
    return w.find((e) => e.dataset.cat === l) ?? w[0];
  }
  function O() {
    for (let e of w) {
      let t = e.dataset.cat === l;
      (e.setAttribute(`aria-selected`, String(t)), (e.tabIndex = t ? 0 : -1));
    }
    (S.setAttribute(`aria-labelledby`, y(l)),
      S.replaceChildren(
        ...d(l, { phrases: e.phrases }).map((e) => {
          let t = document.createElement(`button`);
          ((t.type = `button`),
            (t.className = `phrases__item`),
            e.kind === `phrase` && e.invite && (t.innerHTML = n(g[e.invite])));
          let r = document.createElement(`span`);
          return ((r.textContent = e.label), t.append(r), t.addEventListener(`click`, () => j(e)), t);
        }),
      ));
  }
  function k(e, t) {
    ((l = e), (_ = e), O(), t && D().focus({ preventScroll: !0 }));
  }
  function A(e) {
    ((C.textContent = p),
      clearTimeout(T),
      (T = setTimeout(() => {
        C.textContent = ``;
      }, e)));
  }
  function j(t) {
    let n = e.send(t.kind === `emote` ? t.id : t.code);
    n > 0 ? A(n) : (t.kind === `phrase` && i(`phrase_sent`, { phrase: t.id, cat: l, from: e.from }), F(!0));
  }
  function M() {
    return [D(), ...S.querySelectorAll(`button`), x(`suggest`), x(`close`)];
  }
  function N(e) {
    if (e.key === `Escape`) {
      (e.preventDefault(), e.stopPropagation(), F(!0));
      return;
    }
    let t = e.target?.closest?.(`[role="tab"]`);
    if (t && [`ArrowLeft`, `ArrowRight`, `Home`, `End`].includes(e.key)) {
      e.preventDefault();
      let n = w.indexOf(t),
        r = w.length,
        i = e.key === `Home` ? 0 : e.key === `End` ? r - 1 : (n + (e.key === `ArrowRight` ? 1 : -1) + r) % r;
      k(w[i].dataset.cat, !0);
    } else if (e.key === `Tab`) {
      let t = M(),
        n = t[0],
        r = t[t.length - 1];
      e.shiftKey && document.activeElement === n
        ? (e.preventDefault(), r.focus())
        : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n.focus());
    }
  }
  function P(e) {
    let t = e.target;
    (t && (b.contains(t) || a?.contains(t))) || F(!0);
  }
  function F(n = !0) {
    if (E) return;
    ((E = !0), clearTimeout(T), document.removeEventListener(`pointerdown`, P, !0), b.remove());
    let r = t.closest(`.hud`);
    (r?.dataset.pop === `phrases` && delete r.dataset.pop,
      n && a?.isConnected && a.focus({ preventScroll: !0 }),
      e.onClose?.());
  }
  for (let e of w) e.addEventListener(`click`, () => k(e.dataset.cat, !1));
  (b.addEventListener(`keydown`, N),
    x(`close`).addEventListener(`click`, () => F(!0)),
    x(`suggest`).addEventListener(`click`, () => {
      (F(!0), r({ source: `phrases` }));
    }),
    document.addEventListener(`pointerdown`, P, !0),
    O(),
    t.append(b));
  let I = t.closest(`.hud`);
  return (
    I && !I.dataset.pop && (I.dataset.pop = `phrases`),
    D().focus({ preventScroll: !0 }),
    i(`phrase_picker_opened`, { from: e.from }),
    { element: b, close: F }
  );
}
var b = e({
    ANNOUNCE_GAP_MS: () => x,
    LIVE_SETTLE_MS: () => 500,
    PILL_LABEL: () => S,
    createPhraseRuntime: () => C,
  }),
  x = 4e3,
  S = `Câu nói`;
function C(e, n = new Map(), r = !1) {
  let i = Date.now,
    a = null,
    o = null,
    s = document.createElement(`div`);
  ((s.className = `sr-only`),
    s.setAttribute(`aria-live`, `polite`),
    (s.dataset.phrasesLive = ``),
    document.body.append(s));
  let c = i() + 500 - x,
    l = null,
    d = null,
    f = !1,
    p = () => e.store.getSettings().showPhrases,
    m = p(),
    h = e.store.subscribe(() => {
      let t = p();
      (m && !t && e.remotes()?.clearBubbles(), (m = t));
    });
  function g(e) {
    ((s.textContent = e), (c = i()));
  }
  function _() {
    d = null;
    let e = l;
    ((l = null), e !== null && !f && p() && g(e));
  }
  function v(e) {
    let t = c + x - i();
    t <= 0 && d === null ? g(e) : ((l = e), (d ??= setTimeout(_, Math.max(0, t))));
  }
  function b(n, r) {
    f ||
      (a?.element.isConnected
        ? a.close(!0)
        : (a = y({
            from: n,
            opener: r,
            phrases: t.phrases && e.net().phrasesAware,
            send: e.send,
            onClose: () => {
              a = null;
            },
          })));
  }
  let C = {
    receive(t, n) {
      let r = u(n);
      if (!r || f) return;
      if (t === `me`) {
        e.selfEmote.show(r.label, 4);
        return;
      }
      if (!p()) return;
      let i = e.remotes();
      i?.showBubble(t, `p:${n}`, r.label, 4) && v(`${i.nameOf(t) ?? `Có người`}: ${r.label}`);
    },
    open: b,
    pill(e) {
      if (!f) {
        if (!o && e) {
          let e = document.querySelector(`.hud-bar`);
          if (!e) return;
          let t = document.createElement(`button`);
          ((t.type = `button`),
            (t.className = `hud-glass hud-phrases`),
            (t.textContent = S),
            t.addEventListener(`click`, () => b(`pill`, t)),
            e.append(t),
            (o = t));
        }
        o && (o.hidden = !e);
      }
    },
    dispose() {
      ((f = !0),
        h(),
        d !== null && clearTimeout(d),
        (d = null),
        (l = null),
        a?.close(!1),
        (a = null),
        o?.remove(),
        (o = null),
        s.remove());
    },
  };
  C.pill(r);
  for (let [e, t] of n) C.receive(e, t);
  return C;
}
export { b as t };
