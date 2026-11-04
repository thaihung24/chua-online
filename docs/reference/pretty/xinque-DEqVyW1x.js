import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { D as t, T as n, m as r, v as i } from "./rituals-DFATLOei.js";
import { gt as a, wt as o } from "./index-e_Bx6V48.js";
var s = `Quẻ ở Chùa Sen chỉ để vui và để nhắc mình sống tốt hơn. Đây không phải lời tiên tri, không nói trước điều gì sẽ xảy ra. Đừng dựa vào quẻ để quyết định việc lớn. Theo tinh thần lời Phật dạy, an vui đến từ việc mình làm hôm nay.`,
  c = `chua-online:xin-que`,
  l = [
    `Hôm nay thử lạy Phật ba lạy thật chậm, mỗi lạy một hơi thở.`,
    `Ngồi thiền ba phút, chỉ theo dõi hơi thở vào và hơi thở ra.`,
    `Gọi điện hỏi thăm bố mẹ hay người thân; nếu các cụ đã khuất, thầm nhớ ơn các cụ.`,
    `Lần tràng hạt một vòng, mỗi hạt một câu niệm Phật theo nhịp thở.`,
    `Thắp một nén hương ở lư giữa sân và thầm nhớ ơn một người đã giúp mình.`,
    `Quét lá đa một vòng trong sân chùa, quét chậm và nhẹ tay.`,
    `Đi thiền hành vài phút: bước chậm, biết từng bước chân chạm đất.`,
    `Thỉnh một tiếng chuông rồi đứng yên nghe cho tới khi tiếng chuông tan hẳn.`,
    `Dâng một bông hoa lên bàn thờ và mỉm cười với chính mình.`,
    `Tụng một bài kinh ngắn, đọc chậm và rõ từng câu.`,
    `Uống một ly nước thật chậm, cảm nhận từng ngụm.`,
    `Nói lời cảm ơn với một người mà bạn vẫn hay quên cảm ơn.`,
    `Nhắn một tin hỏi thăm người bạn lâu rồi chưa gặp.`,
    `Làm một việc tốt nhỏ mà không cần ai biết.`,
    `Trước khi ngủ, nhớ lại ba điều tốt đẹp của hôm nay.`,
    `Đặt điện thoại xuống mười phút và nhìn ra bầu trời.`,
    `Khen thật lòng một người, dù chỉ về một điều nhỏ.`,
    `Ăn một bữa thật chậm, không nhìn màn hình.`,
    `Dọn gọn một góc bàn, làm thong thả, không vội.`,
    `Khi thấy bực, thở ba hơi thật chậm rồi mới nói.`,
    `Đi dạo một vòng khuôn viên chùa và ghé thăm cây bồ đề.`,
    `Ngồi xuống một bồ đoàn, nhắm mắt nghe tiếng gió và tiếng chim.`,
    `Giúp người trong nhà một việc nhỏ mà không đợi ai nhờ.`,
    `Nhìn người thân bằng ánh mắt hiền và thầm chúc họ bình an.`,
  ],
  u = [
    {
      loi: `Không quẻ nào làm bài thay mình được. Những giờ ôn bài hôm nay mới là chỗ dựa vững nhất cho ngày thi.`,
      viec: `Ôn lại một phần bạn thấy khó nhất, chậm thôi cũng được.`,
    },
    {
      loi: `Kỳ thi cho thấy mình đã học được bao nhiêu, không đo giá trị con người bạn. Cứ học đều mỗi ngày.`,
      viec: `Học hai mươi lăm phút rồi nghỉ năm phút, lúc nghỉ thở ba hơi thật chậm.`,
    },
    {
      loi: `Tâm yên thì đầu óc sáng. Trước giờ thi, hít một hơi sâu và thở ra thật chậm.`,
      viec: `Trước khi mở sách, ngồi thẳng lưng và thở ba hơi.`,
    },
    {
      loi: `Cố gắng hết sức là đủ. Việc của hôm nay là học cho hiểu, từng phần một.`,
      viec: `Tối nay ngủ đủ giấc, để sáng mai đầu óc tỉnh táo.`,
    },
    {
      loi: `Hồi hộp trước kỳ thi là chuyện thường. Ai cũng từng như vậy, và bạn không một mình.`,
      viec: `Rủ một người bạn cùng ôn bài, hỏi nhau những chỗ chưa hiểu.`,
    },
    {
      loi: `Làm bài xong rồi thì nhẹ nhàng buông xuống. Dù thế nào, bạn vẫn đáng được thương và được nghỉ ngơi.`,
      viec: `Gửi lời cảm ơn tới thầy cô hay người đã kèm bạn học.`,
    },
  ],
  d = i.length + u.length;
function f(e) {
  return typeof e == `number` && Number.isInteger(e) && e >= 1 && e <= d;
}
function p(e) {
  let t = Math.min(d, Math.max(1, Math.floor(e) || 1)) - 1;
  return t < i.length ? { loi: i[t], viec: l[t % l.length] } : u[t - i.length];
}
function m(e = Math.random) {
  let t = e();
  return 1 + Math.floor((Number.isFinite(t) ? Math.min(Math.max(t, 0), 1 - 2 ** -52) : 0) * d);
}
function h(e) {
  let t = Math.floor((Math.max(1, Math.floor(e)) - 1) / 10) * 10 + 1;
  return `${t}-${t + 9}`;
}
var g = null;
function _() {
  try {
    return globalThis.window?.localStorage ?? null;
  } catch {
    return null;
  }
}
function v(e, t) {
  if (typeof e != `object` || !e) return null;
  let { day: n, n: r } = e;
  return n === t && f(r) ? r : null;
}
function y(e, t = _()) {
  let n = null;
  if (t)
    try {
      let e = t.getItem(c);
      n = e === null ? null : JSON.parse(e);
    } catch {
      n = null;
    }
  return v(n, e) ?? v(g, e);
}
function b(e, t, n = _()) {
  let r = { day: e, n: t };
  if (n)
    try {
      (n.setItem(c, JSON.stringify(r)), (g = null));
      return;
    } catch {}
  g = r;
}
var x = e({ openXinQueCard: () => A }),
  S = 1300,
  C = `Xin quẻ`,
  w = `Lắc ống xăm, rút một que, nhận một lời nhắn nhỏ cho hôm nay.`,
  T = `Đang lắc ống xăm…`,
  E = `Mỗi ngày một quẻ. Mai xin lại nhé.`,
  D = `Hôm nay bạn đã xin quẻ rồi. Mai xin lại nhé.`,
  O = `<svg class="xin-que__svg" viewBox="0 0 120 160" width="120" height="160" focusable="false"><g class="xin-que__tube"><g class="xin-que__sticks"><rect x="45" y="30" width="5" height="62" rx="2" transform="rotate(-9 47 92)"/><rect x="52" y="24" width="5" height="68" rx="2" transform="rotate(-4 54 92)"/><rect x="63" y="26" width="5" height="66" rx="2" transform="rotate(4 65 92)"/><rect x="70" y="32" width="5" height="60" rx="2" transform="rotate(9 72 92)"/></g><g class="xin-que__stick"><rect x="57" y="40" width="6" height="74" rx="2"/><rect class="xin-que__tip" x="57" y="40" width="6" height="12" rx="2"/><text class="xin-que__stick-num" x="60" y="33" text-anchor="middle" data-ref="stickNum"></text></g><rect class="xin-que__body" x="36" y="62" width="48" height="86" rx="9"/><rect class="xin-que__node" x="36" y="84" width="48" height="4"/><rect class="xin-que__node" x="36" y="126" width="48" height="4"/><rect class="xin-que__band" x="36" y="96" width="48" height="20"/><ellipse class="xin-que__mouth" cx="60" cy="63" rx="24" ry="5"/></g></svg>`;
function k() {
  return typeof matchMedia == `function` && matchMedia(`(prefers-reduced-motion: reduce)`).matches;
}
function A(e = {}) {
  let i = e.now ?? Date.now,
    c = () => n(t(i())),
    l = e.track ?? o,
    u = y(c(), e.storage),
    d,
    f,
    g = () => {},
    _ = new Promise((e) => {
      g = e;
    }),
    {
      dialog: v,
      close: x,
      ref: A,
    } = r({
      className: `xin-que`,
      labelledBy: `xin-que-title`,
      describedBy: `xin-que-note`,
      signal: e.signal,
      onClosed: () => {
        (clearTimeout(d), clearTimeout(f), g());
      },
      html: `
    <div class="xin-que__card">
      <header class="xin-que__head">
        <h2 id="xin-que-title" class="xin-que__title" tabindex="-1" data-ref="title">${C}</h2>
        <button type="button" class="xin-que__close" data-ref="close" aria-label="Đóng">${a(`close`)}</button>
      </header>
      <p class="xin-que__note" data-ref="noteBox">${a(`info`, { size: 16 })}<span id="xin-que-note" data-ref="note"></span></p>
      <div class="xin-que__body" data-ref="body">
        <div class="xin-que__stage" data-ref="stage" aria-hidden="true">${O}</div>
        <p class="xin-que__intro" data-ref="intro">${w}</p>
        <button type="button" class="xin-que__draw" data-ref="draw">${C}</button>
        <div class="xin-que__result" role="status" aria-live="polite" tabindex="-1" data-ref="result" hidden>
          <p class="xin-que__num" data-ref="num"></p>
          <h3 class="xin-que__h">Lời nhắn hôm nay</h3>
          <p class="xin-que__loi" data-ref="loi"></p>
          <h3 class="xin-que__h">Việc nhỏ hôm nay</h3>
          <p class="xin-que__viec" data-ref="viec"></p>
          <p class="xin-que__foot" data-ref="foot"></p>
        </div>
      </div>
    </div>`,
    });
  A(`note`).textContent = s;
  let j = A(`stage`),
    M = A(`draw`),
    N = A(`result`),
    P = (e, t) => {
      let n = p(e);
      ((A(`num`).textContent = `Quẻ số ${e}`),
        (A(`loi`).textContent = n.loi),
        (A(`viec`).textContent = n.viec),
        (A(`foot`).textContent = t ? E : D));
    },
    F = (e, t) => {
      (j.classList.remove(`is-drawing`),
        j.classList.add(`is-up`),
        (M.hidden = !0),
        (A(`intro`).hidden = !0),
        (N.dataset.fresh = String(t)),
        t
          ? ((N.hidden = !1),
            (f = setTimeout(() => {
              (P(e, !0), N.focus({ preventScroll: !0 }));
            }, 0)))
          : (P(e, !1), (N.hidden = !1)));
    };
  return (
    u !== null && ((A(`stickNum`).textContent = String(u)), F(u, !1)),
    M.addEventListener(`click`, () => {
      if (u !== null) return;
      let t = m(e.random);
      ((u = t),
        b(c(), t, e.storage),
        l(`xin_que`, { bucket: h(t) }),
        (A(`stickNum`).textContent = String(t)),
        k()
          ? F(t, !0)
          : (M.setAttribute(`aria-busy`, `true`),
            (M.textContent = T),
            j.classList.add(`is-drawing`),
            (d = setTimeout(() => F(t, !0), S))));
    }),
    A(`close`).addEventListener(`click`, x),
    v.isConnected && A(`title`).focus({ preventScroll: !0 }),
    { element: v, closed: _, close: x }
  );
}
export { x as t };
