const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["./kinhvan-DArOLTV3.js", "./rolldown-runtime-DK3Fl9T5.js"]),
) => i.map((i) => d[i]);
import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { t } from "./preload-helper-CRzLMJPS.js";
import { a as n, gt as r, i, r as a, w as o, wt as s } from "./index-e_Bx6V48.js";
import { a as c, c as l, l as u, o as d, s as f } from "./lazy-shared-D8DtrU9N.js";
import { d as p, f as m, p as h } from "./music-mix-9H0C50bM.js";
var g = e({ beadsView: () => R }),
  _ = 108,
  v = 360 / _,
  y = `chua-online:beads-session`,
  b = `chua-online:beads-mo`,
  x = 2200,
  S = 12,
  C = [
    `Nam mô A Di Đà Phật`,
    `A Di Đà Phật`,
    `Nam mô Quán Thế Âm Bồ Tát`,
    `Nam mô Bổn Sư Thích Ca Mâu Ni Phật`,
  ],
  w = 400,
  T = w / 2,
  E = 165,
  D = 4.9,
  O = 11,
  k = 365;
function A(e, t) {
  let n = e > 0 ? e - 0.5 : 0;
  return t % 2 == 0 ? n : _ - n;
}
function j(e, t) {
  return t % 2 == 0 ? _ - e : e + 1;
}
function M(e) {
  try {
    return localStorage.getItem(e);
  } catch {
    return null;
  }
}
function N(e, t) {
  try {
    localStorage.setItem(e, t);
  } catch {}
}
function P() {
  let e = { count: 0, rounds: 0 },
    t = M(y);
  if (!t) return e;
  try {
    let e = JSON.parse(t),
      n = e?.count,
      r = e?.rounds;
    return {
      count: typeof n == `number` && Number.isInteger(n) && n >= 0 ? Math.min(n, 107) : 0,
      rounds: typeof r == `number` && Number.isInteger(r) && r >= 0 ? Math.min(r, 1e6) : 0,
    };
  } catch {
    return e;
  }
}
function F() {
  let e = [];
  for (let t = 0; t < _; t++) {
    let n = ((-90 + (t + 0.5) * v) * Math.PI) / 180,
      r = (T + E * Math.cos(n)).toFixed(2),
      i = (T + E * Math.sin(n)).toFixed(2);
    e.push(`<circle class="beads-bead" cx="${r}" cy="${i}" r="${D}" fill="url(#beads-g-wood)"/>`);
  }
  return `<svg class="beads-svg" viewBox="0 0 ${w} ${w}" focusable="false" aria-hidden="true">
  <defs>
    <radialGradient id="beads-g-wood" cx="36%" cy="30%" r="78%">
      <stop offset="0" stop-color="#c08a5a"/>
      <stop offset="0.5" stop-color="#7c4c2b"/>
      <stop offset="1" stop-color="#34200f"/>
    </radialGradient>
    <radialGradient id="beads-g-gold" cx="36%" cy="30%" r="78%">
      <stop offset="0" stop-color="#fbe9b4"/>
      <stop offset="0.5" stop-color="#e0b25c"/>
      <stop offset="1" stop-color="#8c611d"/>
    </radialGradient>
    <radialGradient id="beads-g-guru" cx="36%" cy="30%" r="78%">
      <stop offset="0" stop-color="#e2796a"/>
      <stop offset="0.5" stop-color="#a8322d"/>
      <stop offset="1" stop-color="#4f120f"/>
    </radialGradient>
    <radialGradient id="beads-g-halo">
      <stop offset="0" stop-color="#e0b25c" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#e0b25c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle class="beads-aura" cx="${T}" cy="${T}" r="${E}" fill="none" stroke="#e0b25c"/>
  <g class="beads-ring">
    <circle class="beads-string" cx="${T}" cy="${T}" r="${E}" fill="none"/>
    ${e.join(``)}
    <g class="beads-guru" transform="translate(${T} 35)">
      <g fill="none" stroke-linecap="round">
        <path d="M0 -10V-15" stroke="#e0b25c" stroke-width="1.5"/>
        <g stroke="#c4473b" stroke-width="1.7">
          <path d="M0 -20Q-3 -27 -6 -33"/>
          <path d="M0 -20Q-1.5 -27 -3 -33.5"/>
          <path d="M0 -20V-34"/>
          <path d="M0 -20Q1.5 -27 3 -33.5"/>
          <path d="M0 -20Q3 -27 6 -33"/>
        </g>
      </g>
      <circle cy="-17.2" r="3.1" fill="url(#beads-g-gold)"/>
      <circle r="${O}" fill="url(#beads-g-guru)" stroke="#e0b25c" stroke-width="1.2"/>
    </g>
  </g>
  <circle class="beads-halo" cx="${T}" cy="${k}" r="30" fill="url(#beads-g-halo)"/>
  <circle class="beads-focus-ring" cx="${T}" cy="${k}" r="11.8" fill="none"/>
  <circle class="beads-focus" cx="${T}" cy="${k}" r="9.4" fill="url(#beads-g-gold)"/>
</svg>`;
}
function ee() {
  return `<section class="view beads-view">
  <header class="view__header">
    <h1 class="view__title">Niệm Phật</h1>
    <p class="view__lead">Mỗi lần chạm là một hạt, một câu niệm. Niệm thầm hay thành tiếng đều được.</p>
  </header>

  <div
    class="beads-stage"
    role="button"
    tabindex="0"
    aria-label="Lần một hạt"
    aria-describedby="beads-sr-count"
  >
    ${F()}
    <div class="beads-center" aria-hidden="true">
      <div class="beads-round"></div>
      <div class="beads-count"><span class="beads-count__n">0</span><span class="beads-count__of"> / ${_}</span></div>
      <div class="beads-phrase"></div>
    </div>
  </div>
  <p id="beads-sr-count" class="sr-only"></p>
  <p class="beads-hint muted">Chạm vào chuỗi hạt, hoặc nhấn phím Cách hay Enter. Đến hạt mẫu thì quay chiều lần tiếp, không lần qua hạt mẫu.</p>

  <div class="chips beads-phrases" role="group" aria-label="Chọn câu niệm">
    ${C.map((e) => `<button type="button" class="chip" data-phrase="${e}" aria-pressed="false">${e}</button>`).join(``)}
  </div>

  <div class="stats beads-stats" role="group" aria-label="Công phu hôm nay">
    <div class="stat">
      <div class="stat__value" data-stat="chants">0</div>
      <div class="stat__label">câu niệm hôm nay</div>
    </div>
    <div class="stat">
      <div class="stat__value" data-stat="rounds">0</div>
      <div class="stat__label">chuỗi tròn hôm nay</div>
    </div>
  </div>

  <div class="row beads-actions">
    <button type="button" class="chip beads-mo" aria-pressed="false">Gõ mõ mỗi hạt</button>
    <button type="button" class="btn btn--ghost btn--sm beads-reset">
      ${r(`reset`, { size: 18 })}<span>Bắt đầu lại</span>
    </button>
  </div>

  <div class="sr-only beads-live" role="status" aria-live="polite"></div>
</section>`;
}
function I(e) {
  if (
    e.defaultPrevented ||
    e.repeat ||
    e.altKey ||
    e.ctrlKey ||
    e.metaKey ||
    e.shiftKey ||
    document.querySelector(`dialog[open]`)
  )
    return !0;
  let t = e.target;
  if (!(t instanceof HTMLElement)) return !1;
  if (t.isContentEditable || t.closest(`dialog`)) return !0;
  let n = t.tagName;
  return (
    n === `INPUT` || n === `TEXTAREA` || n === `SELECT` || n === `BUTTON` || n === `A` || n === `SUMMARY`
  );
}
var te = new Set([` `, `Spacebar`, `Enter`, `ArrowDown`]);
function L(e, t) {
  return Math.hypot(e, t) <= S;
}
var R = {
    id: `beads`,
    title: `Niệm Phật`,
    mount(e, t) {
      e.innerHTML = ee();
      let n = (t) => {
          let n = e.querySelector(t);
          if (!n) throw Error(`beads: thiếu phần tử ${t}`);
          return n;
        },
        r = n(`.beads-stage`),
        i = n(`.beads-ring`),
        a = n(`.beads-count__n`),
        o = n(`.beads-round`),
        s = n(`.beads-phrase`),
        c = n(`#beads-sr-count`),
        l = n(`.beads-live`),
        u = n(`[data-stat="chants"]`),
        d = n(`[data-stat="rounds"]`),
        p = n(`.beads-mo`),
        m = n(`.beads-reset`),
        h = n(`.beads-phrases`),
        g = Array.from(h.querySelectorAll(`button[data-phrase]`)),
        S = Array.from(e.querySelectorAll(`.beads-bead`)),
        C = P(),
        w = C.count,
        T = C.rounds,
        E = !1,
        D,
        O = M(b) === `1`,
        k = !1,
        F = 0,
        R = ``,
        z = new AbortController(),
        { signal: B } = z;
      function V() {
        let e = E ? _ : w;
        ((i.style.transform = `rotate(${(A(w, T) - _ / 2) * v}deg)`),
          S.forEach((t, n) => t.classList.toggle(`is-passed`, j(n, T) <= e)),
          (a.textContent = String(e)),
          (o.textContent = E ? `Tròn chuỗi thứ ${f(T)}` : `Chuỗi thứ ${f(T + 1)}`),
          r.classList.toggle(`is-live`, e > 0),
          r.classList.toggle(`is-guru`, w === 0),
          (c.textContent =
            e > 0
              ? `Hạt thứ ${e} trên ${_}, chuỗi thứ ${T + +!E}.`
              : `Ở hạt mẫu, chuỗi thứ ${T + 1}${T > 0 ? ` lần theo chiều ngược lại` : ``}.`));
      }
      function ne() {
        let e = t.store.getSettings().chantPhrase;
        if (e !== R) {
          ((R = e), (s.textContent = e));
          for (let t of g) t.setAttribute(`aria-pressed`, String(t.dataset.phrase === e));
        }
        let n = t.store.today();
        ((u.textContent = f(n.chants)), (d.textContent = f(n.beadRounds)));
      }
      function re() {
        p.setAttribute(`aria-pressed`, String(O));
      }
      function ie() {
        (window.clearTimeout(D), (E = !1), r.classList.remove(`is-celebrating`));
      }
      function ae() {
        ((E = !0),
          r.classList.add(`is-celebrating`),
          (D = window.setTimeout(() => {
            (ie(), V());
          }, x)));
      }
      function oe() {
        (ie(),
          t.audio.play(O ? `mo` : `bead`),
          (k = !k),
          r.classList.toggle(`is-tap-a`, k),
          r.classList.toggle(`is-tap-b`, !k));
        let e = w + 1 >= _;
        (e
          ? ((w = 0), (T += 1), t.haptic([30, 60, 30]), t.audio.play(`bell`, { delay: 0.12 }), ae())
          : ((w += 1), t.haptic(8)),
          V(),
          N(y, JSON.stringify({ count: w, rounds: T })),
          t.store.record(`chants`, 1),
          e
            ? (t.store.record(`beadRounds`, 1), t.toast(`Tròn một chuỗi ${_} hạt — A Di Đà Phật`))
            : w % 10 == 0 && (l.textContent = `Chuỗi thứ ${T + 1}: đã niệm ${w} hạt`));
      }
      function H() {
        window.confirm(`Bắt đầu lại chuỗi từ hạt đầu tiên?
Số liệu thống kê trong ngày vẫn được giữ nguyên.`) &&
          (ie(),
          (w = 0),
          (T = 0),
          N(y, JSON.stringify({ count: w, rounds: T })),
          i.classList.add(`is-snap`),
          V(),
          i.getBoundingClientRect(),
          i.classList.remove(`is-snap`),
          (l.textContent = ``),
          t.toast(`Đã bắt đầu lại chuỗi mới`));
      }
      let U = null;
      function W() {
        ((U = null), r.classList.remove(`is-pressed`));
      }
      (r.addEventListener(
        `pointerdown`,
        (e) => {
          if (!(!e.isPrimary || (e.pointerType === `mouse` && e.button !== 0))) {
            ((U = { id: e.pointerId, x: e.clientX, y: e.clientY }), r.classList.add(`is-pressed`));
            try {
              r.setPointerCapture(e.pointerId);
            } catch {}
          }
        },
        { signal: B },
      ),
        r.addEventListener(
          `pointerup`,
          (e) => {
            let t = U;
            t &&
              t.id === e.pointerId &&
              (W(), (F = performance.now()), L(e.clientX - t.x, e.clientY - t.y) && oe());
          },
          { signal: B },
        ),
        r.addEventListener(
          `pointercancel`,
          (e) => {
            U?.id === e.pointerId && W();
          },
          { signal: B },
        ),
        r.addEventListener(
          `click`,
          (e) => {
            e.detail !== 0 || performance.now() - F < 600 || oe();
          },
          { signal: B },
        ),
        document.addEventListener(
          `keydown`,
          (e) => {
            te.has(e.key) && !I(e) && (e.preventDefault(), oe());
          },
          { signal: B },
        ),
        h.addEventListener(
          `click`,
          (e) => {
            let n = e.target.closest(`button[data-phrase]`)?.dataset.phrase;
            n && t.store.updateSettings({ chantPhrase: n });
          },
          { signal: B },
        ),
        p.addEventListener(
          `click`,
          () => {
            ((O = !O), N(b, O ? `1` : `0`), re());
          },
          { signal: B },
        ),
        m.addEventListener(`click`, H, { signal: B }));
      let G = t.store.subscribe(ne);
      return (
        ne(),
        re(),
        V(),
        () => {
          (z.abort(), G(), window.clearTimeout(D));
        }
      );
    },
  },
  z = { "nguoi-moi": `Cho người mới`, "niem-phat": `Niệm Phật`, "doi-song": `Đời sống` },
  B = [
    {
      id: `thich-nhat-hanh`,
      name: `Thiền sư Thích Nhất Hạnh`,
      channel: `Làng Mai Official`,
      channelUrl: `https://www.youtube.com/@langmaiofficial`,
    },
    {
      id: `thich-phap-hoa`,
      name: `Thầy Thích Pháp Hòa`,
      channel: `Truc Lam (Thích Pháp Hòa)`,
      channelUrl: `https://www.youtube.com/@TrucLamThichPhapHoaOfficial`,
    },
  ],
  V = [
    {
      id: `huong-dan-ngoi-thien`,
      youtubeId: `1C0sZ7YMvK0`,
      title: `Sư Ông Làng Mai Hướng Dẫn Ngồi Thiền`,
      summary: `Lời hướng dẫn ngồi thiền và thực tập hơi thở chánh niệm.`,
      teacher: `thich-nhat-hanh`,
      minutes: 16,
      category: `nguoi-moi`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `hoi-tho-an-lac`,
      youtubeId: `a0HwiUNacbU`,
      title: `Hơi Thở An Lạc`,
      summary: `Đoạn trích bài giảng Kinh Quán Niệm Hơi Thở, Làng Mai, năm 1998.`,
      teacher: `thich-nhat-hanh`,
      minutes: 9,
      category: `nguoi-moi`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `thien-di`,
      youtubeId: `MOKsyY9nGVM`,
      title: `Thiền Đi - Quán Chiếu Cảm Thọ Trong Từng Bước Chân`,
      summary: `Tập thiền đi, để ý cảm thọ trong từng bước chân. Trích pháp thoại năm 2010.`,
      teacher: `thich-nhat-hanh`,
      minutes: 11,
      category: `nguoi-moi`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `can-ban-tung-niem`,
      youtubeId: `EslYh_Jqe8Y`,
      title: `Căn Bản Tụng Niệm`,
      summary: `Những điều căn bản của việc tụng kinh và niệm Phật.`,
      teacher: `thich-phap-hoa`,
      minutes: 77,
      category: `niem-phat`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `tinh-do-di-da`,
      youtubeId: `_-TkQAEiTXI`,
      title: `Tịnh Độ Di Đà`,
      summary: `Bài giảng về Tịnh độ của Đức Phật A Di Đà, tại Tu viện Trúc Lâm, năm 2021.`,
      teacher: `thich-phap-hoa`,
      minutes: 30,
      category: `niem-phat`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `tinh-do-hien-tien`,
      youtubeId: `5WXVTb-Lfhc`,
      title: `Tiếp Xúc Những Mầu Nhiệm Trong Tịnh Độ Hiện Tiền`,
      summary: `Bài giảng về tiếp xúc với Tịnh độ ngay trong hiện tại. Pháp thoại năm 2003.`,
      teacher: `thich-nhat-hanh`,
      minutes: 20,
      category: `niem-phat`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `an-binh-bat-dong-khi-gian`,
      youtubeId: `8qOuss09gMI`,
      title: `Án Binh Bất Động Khi Giận`,
      summary: `Bài giảng về cách dừng lại, chưa vội nói hay làm gì khi đang giận.`,
      teacher: `thich-nhat-hanh`,
      minutes: 70,
      category: `doi-song`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `quay-ve-hai-dao-tu-than`,
      youtubeId: `RQDu4YS6QPg`,
      title: `Quay Về Hải Đảo Tự Thân Để Chăm Sóc Chính Mình`,
      summary: `Thực tập trở về nương tựa nơi chính mình. Trích pháp thoại năm 2005.`,
      teacher: `thich-nhat-hanh`,
      minutes: 15,
      category: `doi-song`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `vu-lan-bao-hieu`,
      youtubeId: `xyFT3pY_IWA`,
      title: `Vu Lan Báo Hiếu`,
      summary: `Bài giảng mùa Vu Lan về đạo hiếu với cha mẹ, năm 2017.`,
      teacher: `thich-phap-hoa`,
      minutes: 45,
      category: `doi-song`,
      checkedAt: `2026-11-03`,
    },
    {
      id: `phat-trien-tam-tu`,
      youtubeId: `laFrkXf_GcA`,
      title: `Phát Triển Tâm Từ`,
      summary: `Bài giảng về cách nuôi lớn tâm từ, tức lòng thương yêu.`,
      teacher: `thich-phap-hoa`,
      minutes: 79,
      category: `doi-song`,
      checkedAt: `2026-11-03`,
    },
  ];
function ne() {
  return V.length > 0;
}
var re = [
  { id: `thoi-khoa`, label: `Thời khóa` },
  { id: `kinh`, label: `Kinh` },
  { id: `chu`, label: `Chú` },
  { id: `ke`, label: `Kệ & sám nguyện` },
  { id: `niem-phat`, label: `Niệm Phật` },
];
function ie(e) {
  return {
    before: `Bản này được Chùa Sen đối chiếu từ ${e} nguồn đã công bố, chưa qua chư tăng duyệt lại. Thấy chỗ nào chưa đúng, bạn `,
    link: `góp ý`,
    after: ` giúp chùa nhé.`,
  };
}
var ae = [
    {
      id: `khai-kinh`,
      sourcesChecked: 4,
      category: `ke`,
      reading: `han-viet`,
      title: `Kệ Khai Kinh`,
      subtitle: `Vô thượng thậm thâm vi diệu pháp`,
      description: `Bốn câu kệ mở đầu buổi tụng, giúp tâm lắng lại và phát nguyện hiểu nghĩa kinh.`,
      lines: [
        `Vô thượng thậm thâm vi diệu pháp,`,
        `Bách thiên vạn kiếp nan tao ngộ.`,
        `Ngã kim kiến văn đắc thọ trì,`,
        `Nguyện giải Như Lai chân thật nghĩa.`,
      ],
    },
    {
      id: `tam-tu-quy`,
      sourcesChecked: 4,
      category: `ke`,
      reading: `han-viet`,
      title: `Tam Tự Quy`,
      subtitle: `Tự quy y Phật, Pháp, Tăng`,
      description: `Ba lời tự quy y Phật, Pháp, Tăng (phẩm Tịnh Hạnh, kinh Hoa Nghiêm), thường tụng khép lại một thời kinh.`,
      lines: [
        `Tự quy y Phật, đương nguyện chúng sanh,`,
        `thể giải đại đạo, phát vô thượng tâm.`,
        `Tự quy y Pháp, đương nguyện chúng sanh,`,
        `thâm nhập kinh tạng, trí huệ như hải.`,
        `Tự quy y Tăng, đương nguyện chúng sanh,`,
        `thống lý đại chúng, nhất thiết vô ngại.`,
      ],
    },
    {
      id: `sam-hoi`,
      sourcesChecked: 4,
      category: `ke`,
      reading: `han-viet`,
      title: `Kệ Sám Hối`,
      subtitle: `Ngã tích sở tạo chư ác nghiệp`,
      description: `Bốn câu kệ sám hối trong phẩm Phổ Hiền Hạnh Nguyện (kinh Hoa Nghiêm): nhận lỗi xưa từ thân, miệng, ý và nguyện làm mới.`,
      lines: [
        `Ngã tích sở tạo chư ác nghiệp,`,
        `Giai do vô thỉ tham sân si,`,
        `Tùng thân ngữ ý chi sở sanh,`,
        `Nhất thiết ngã kim giai sám hối.`,
      ],
    },
    {
      id: `tam-kinh`,
      sourcesChecked: 3,
      category: `kinh`,
      reading: `han-viet`,
      title: `Bát Nhã Ba La Mật Đa Tâm Kinh`,
      subtitle: `Tâm Kinh · bản Hán-Việt`,
      description: `Bản kinh ngắn gọn và cô đọng nhất về trí tuệ Bát Nhã, tụng quen thuộc mỗi ngày.`,
      lines:
        `Quán Tự Tại Bồ Tát,(hành thâm Bát Nhã Ba La Mật Đa thời,(chiếu kiến ngũ uẩn giai không,(độ nhất thiết khổ ách.(Xá Lợi Tử,(sắc bất dị không,(không bất dị sắc,(sắc tức thị không,(không tức thị sắc,(thọ tưởng hành thức,(diệc phục như thị.(Xá Lợi Tử,(thị chư pháp không tướng,(bất sanh bất diệt,(bất cấu bất tịnh,(bất tăng bất giảm.(Thị cố không trung,(vô sắc, vô thọ tưởng hành thức,(vô nhãn nhĩ tỷ thiệt thân ý,(vô sắc thanh hương vị xúc pháp,(vô nhãn giới,(nãi chí vô ý thức giới,(vô vô minh,(diệc vô vô minh tận,(nãi chí vô lão tử,(diệc vô lão tử tận,(vô khổ tập diệt đạo,(vô trí diệc vô đắc.(Dĩ vô sở đắc cố,(Bồ đề tát đỏa,(y Bát Nhã Ba La Mật Đa cố,(tâm vô quái ngại,(vô quái ngại cố,(vô hữu khủng bố,(viễn ly điên đảo mộng tưởng,(cứu cánh Niết Bàn.(Tam thế chư Phật,(y Bát Nhã Ba La Mật Đa cố,(đắc A nậu đa la,(tam miệu tam bồ đề.(Cố tri Bát Nhã Ba La Mật Đa,(thị đại thần chú,(thị đại minh chú,(thị vô thượng chú,(thị vô đẳng đẳng chú,(năng trừ nhất thiết khổ,(chân thật bất hư.(Cố thuyết Bát Nhã Ba La Mật Đa chú,(tức thuyết chú viết:(Yết đế, yết đế,(ba la yết đế,(ba la tăng yết đế,(bồ đề tát bà ha.`.split(
          `(`,
        ),
    },
    {
      id: `vang-sanh`,
      sourcesChecked: 3,
      category: `chu`,
      reading: `han-viet`,
      title: `Vãng Sanh Thần Chú`,
      subtitle: `Bạt nhất thiết nghiệp chướng căn bản đắc sanh Tịnh độ đà-la-ni`,
      description: `Thần chú hồi hướng cho người đã khuất được sanh về cõi lành, thường tụng ba biến.`,
      lines: [
        `Nam mô A Di Đa Bà Dạ,`,
        `Đa tha già đa dạ,`,
        `Đa điệt dạ tha,`,
        `A di rị đô bà tỳ,`,
        `A di rị đa, tất đam bà tỳ,`,
        `A di rị đa, tỳ ca lan đế,`,
        `A di rị đa, tỳ ca lan đa,`,
        `Già di nị, già già na,`,
        `Chỉ đa ca lệ,`,
        `Ta bà ha.`,
      ],
    },
    {
      id: `chu-dai-bi`,
      category: `chu`,
      reading: `han-viet`,
      title: `Chú Đại Bi`,
      subtitle: `Thiên thủ thiên nhãn vô ngại đại bi tâm đà-la-ni — 84 câu`,
      description: `Thần chú 84 câu của Bồ Tát Quán Thế Âm, thường tụng 3, 7, 21 hoặc 84 biến. Mỗi câu một dòng để dễ theo dõi.`,
      lines:
        `Nam mô hắc ra đát na đa ra dạ da.Nam mô a rị da.Bà lô yết đế thước bát ra da.Bồ đề tát đỏa bà da.Ma ha tát đỏa bà da.Ma ha ca lô ni ca da.Án.Tát bàn ra phạt duệ.Số đát na đát tỏa.Nam mô tất kiết lật đỏa y mông a rị da.Bà lô yết đế thất Phật ra lăng đà bà.Nam mô na ra cẩn trì.Hê rị ma ha bàn đa sa mế.Tát bà a tha đậu du bằng.A thệ dựng.Tát bà tát đa na ma bà tát đa na ma bà già.Ma phạt đạt đậu.Đát điệt tha.Án a bà lô hê.Lô ca đế.Ca ra đế.Di hê rị.Ma ha bồ đề tát đỏa.Tát bà tát bà.Ma ra ma ra.Ma hê ma hê rị đà dựng.Cu lô cu lô yết mông.Độ lô độ lô phạt xà da đế.Ma ha phạt xà da đế.Đà ra đà ra.Địa rị ni.Thất Phật ra da.Giá ra giá ra.Mạ mạ phạt ma ra.Mục đế lệ.Y hê y hê.Thất na thất na.A ra sâm Phật ra xá lợi.Phạt sa phạt sâm.Phật ra xá da.Hô lô hô lô ma ra.Hô lô hô lô hê rị.Ta ra ta ra.Tất rị tất rị.Tô rô tô rô.Bồ đề dạ bồ đề dạ.Bồ đà dạ bồ đà dạ.Di đế rị dạ.Na ra cẩn trì.Địa rị sắc ni na.Ba dạ ma na.Ta bà ha.Tất đà dạ.Ta bà ha.Ma ha tất đà dạ.Ta bà ha.Tất đà du nghệ.Thất bàn ra dạ.Ta bà ha.Na ra cẩn trì.Ta bà ha.Ma ra na ra.Ta bà ha.Tất ra tăng a mục khê da.Ta bà ha.Ta bà ma ha a tất đà dạ.Ta bà ha.Giả kiết ra a tất đà dạ.Ta bà ha.Ba đà ma yết tất đà dạ.Ta bà ha.Na ra cẩn trì bàn đà ra dạ.Ta bà ha.Ma bà rị thắng yết ra dạ.Ta bà ha.Nam mô hắc ra đát na đa ra dạ da.Nam mô a rị da.Bà lô yết đế.Thước bàn ra dạ.Ta bà ha.Án tất điện đô.Mạn đa ra.Bạt đà dạ.Ta bà ha`.split(
          `.`,
        ),
    },
    {
      id: `niem-phat`,
      sourcesChecked: 4,
      category: `niem-phat`,
      reading: `han-viet`,
      title: `Niệm Phật`,
      subtitle: `Nam mô A Di Đà Phật`,
      description: `Mười câu hồng danh Đức Phật A Di Đà, giữ cho tâm được an định.`,
      lines: Array.from({ length: 10 }, () => `Nam mô A Di Đà Phật`),
    },
    {
      id: `niem-dia-tang`,
      sourcesChecked: 4,
      category: `niem-phat`,
      reading: `han-viet`,
      title: `Niệm danh hiệu Bồ Tát Địa Tạng`,
      subtitle: `Nam mô Đại Nguyện Địa Tạng Vương Bồ Tát`,
      description: `Mười câu xưng danh Bồ Tát Địa Tạng, vị Bồ Tát của đại nguyện cứu độ, thường niệm khi cầu siêu và mùa Vu Lan.`,
      lines: Array.from({ length: 10 }, () => `Nam mô Đại Nguyện Địa Tạng Vương Bồ Tát`),
    },
    {
      id: `tu-hoang-the-nguyen`,
      sourcesChecked: 4,
      category: `ke`,
      reading: `han-viet`,
      title: `Tứ Hoằng Thệ Nguyện`,
      subtitle: `Bốn lời đại nguyện`,
      description: `Bốn lời nguyện lớn của người học Phật: độ chúng sanh, đoạn phiền não, học pháp môn, thành Phật đạo.`,
      lines: [
        `Chúng sanh vô biên thệ nguyện độ,`,
        `Phiền não vô tận thệ nguyện đoạn,`,
        `Pháp môn vô lượng thệ nguyện học,`,
        `Phật đạo vô thượng thệ nguyện thành.`,
      ],
    },
    {
      id: `hoi-huong`,
      sourcesChecked: 4,
      category: `ke`,
      reading: `han-viet`,
      title: `Kệ Hồi Hướng`,
      subtitle: `Nguyện dĩ thử công đức`,
      description: `Bốn câu kệ khép lại buổi tụng (phẩm Hóa Thành Dụ, kinh Pháp Hoa): nguyện đem công đức này đến khắp mọi người, cùng thành Phật đạo.`,
      lines: [
        `Nguyện dĩ thử công đức,`,
        `Phổ cập ư nhất thiết,`,
        `Ngã đẳng dữ chúng sanh,`,
        `Giai cộng thành Phật đạo.`,
      ],
    },
  ].map((e) => ({
    ...e,
    syllables: e.lines.reduce((e, t) => e + ue(t).length, 0),
    lineCount: e.lines.length,
    source: e.id,
  })),
  oe = [`khai-kinh`, `tam-kinh`, `vang-sanh`, `vang-sanh`, `vang-sanh`, `niem-phat`, `hoi-huong`],
  H = {
    id: `thoi-khoa-ngan`,
    title: `Thời khóa ngắn`,
    subtitle: `~10 phút`,
    label: `Thời khóa ngắn (~10 phút)`,
    description: `Trọn một thời công phu nhẹ nhàng cho người mới: khai kinh, Tâm Kinh, Vãng Sanh Thần Chú ba biến, niệm Phật và hồi hướng. Các bài tự nối tiếp nhau.`,
  };
function U(e) {
  return ae.find((t) => t.id === e);
}
var W = [
    {
      id: `a-di-da`,
      sourcesChecked: 7,
      category: `kinh`,
      reading: `han-viet`,
      title: `Kinh A Di Đà`,
      subtitle: `Phật Thuyết A Di Đà Kinh · bản Hán-Việt`,
      description: `Đức Phật kể về cõi Cực Lạc của Đức Phật A Di Đà và khuyên chúng sanh phát nguyện vãng sanh; bài kinh chính của thời tụng Tịnh độ.`,
      syllables: 1858,
      lineCount: 265,
      source: `a-di-da`,
    },
    {
      id: `pho-mon`,
      sourcesChecked: 6,
      category: `kinh`,
      reading: `han-viet`,
      title: `Phẩm Phổ Môn`,
      subtitle: `Diệu Pháp Liên Hoa Kinh, phẩm 25 · bản Hán-Việt`,
      description: `Phẩm kinh về Bồ Tát Quán Thế Âm lắng nghe tiếng kêu cứu của chúng sanh, thường tụng khi cầu an.`,
      syllables: 2062,
      lineCount: 249,
      source: `pho-mon`,
    },
    {
      id: `vu-lan`,
      sourcesChecked: 3,
      category: `kinh`,
      reading: `han-viet`,
      title: `Kinh Vu Lan`,
      subtitle: `Phật Thuyết Vu Lan Bồn Kinh · bản Hán-Việt`,
      description: `Tôn giả Mục Kiền Liên cứu mẹ và lễ cúng dường chư Tăng ngày rằm tháng Bảy; bài kinh của mùa báo hiếu.`,
      syllables: 736,
      lineCount: 99,
      source: `vu-lan`,
    },
    {
      id: `bat-dai-nhan-giac`,
      sourcesChecked: 6,
      category: `kinh`,
      reading: `han-viet`,
      title: `Kinh Bát Đại Nhân Giác`,
      subtitle: `Tám điều giác ngộ của bậc đại nhân · bản Hán-Việt`,
      description: `Tám điều bậc đại nhân giác ngộ: vô thường, ít muốn, biết đủ, tinh tấn, trí tuệ, bố thí, giữ hạnh và phát tâm Đại thừa.`,
      syllables: 372,
      lineCount: 53,
      source: `bat-dai-nhan-giac`,
    },
  ],
  G = {
    "a-di-da": () =>
      t(() => import(`./kinhvan-DArOLTV3.js`).then((e) => e.i), __vite__mapDeps([0, 1]), import.meta.url),
    "pho-mon": () =>
      t(() => import(`./kinhvan-DArOLTV3.js`).then((e) => e.n), __vite__mapDeps([0, 1]), import.meta.url),
    "vu-lan": () =>
      t(() => import(`./kinhvan-DArOLTV3.js`).then((e) => e.t), __vite__mapDeps([0, 1]), import.meta.url),
    "bat-dai-nhan-giac": () =>
      t(() => import(`./kinhvan-DArOLTV3.js`).then((e) => e.r), __vite__mapDeps([0, 1]), import.meta.url),
  },
  se = [...ae, ...W];
function ce(e) {
  return se.find((t) => t.id === e);
}
function le(e) {
  let t = U(e);
  if (t) return Promise.resolve(t);
  let n = W.find((t) => t.id === e),
    r = n && Object.prototype.hasOwnProperty.call(G, e) ? G[e] : void 0;
  return !n || !r ? Promise.resolve(void 0) : r().then(({ lines: e }) => ({ ...n, lines: e }));
}
function ue(e) {
  return e.split(/\s+/).filter(Boolean);
}
var K = () => {};
async function de() {
  if (typeof navigator > `u` || !navigator.wakeLock) return K;
  let e = !0,
    t = null,
    n = null,
    r = () =>
      e
        ? n ||
          (t && !t.released
            ? Promise.resolve()
            : ((n = new Promise((e) => e(navigator.wakeLock.request(`screen`)))
                .then(
                  (n) => {
                    e
                      ? ((t = n),
                        n.addEventListener(`release`, () => {
                          t === n && (t = null);
                        }))
                      : n.release().catch(K);
                  },
                  () => {},
                )
                .finally(() => {
                  n = null;
                })),
              n))
        : Promise.resolve(),
    i = () => {
      document.visibilityState === `visible` && r();
    };
  return (
    document.addEventListener(`visibilitychange`, i),
    await r(),
    () => {
      if (!e) return;
      ((e = !1), document.removeEventListener(`visibilitychange`, i));
      let n = t;
      ((t = null), n && n.release().catch(K));
    }
  );
}
var q = `chua-online:my-sutras`,
  fe = 12e3,
  pe = `Bài kinh chưa có chữ nào.`,
  me = `Bạn đặt tên cho bài kinh nhé.`,
  he = `Bài dài quá 12.000 ký tự.`,
  ge = `Đã đủ 5 bài. Xoá bớt một bài để thêm bài mới.`,
  _e = `Bài này chỉ lưu trên máy này, không gửi đi đâu. Hãy dùng bản kinh bạn được phép chép.`,
  J = `Máy này đang giữ bài kinh của một phiên bản Chùa Sen mới hơn. Bạn tải lại trang để xem nhé.`,
  ve = `Trình duyệt này không cho trang lưu dữ liệu nên chưa lưu được bài kinh của bạn. Nếu bạn đang mở Chùa Sen trong một ứng dụng (như Facebook, Zalo), hãy mở bằng trình duyệt thường như Chrome hay Safari.`,
  ye = `Không lưu được bài kinh trên máy này.`,
  be = /^my-[0-9a-z]+$/,
  xe = /[,.;:!?]$/,
  Y = /[\u0000-\u0008\u000e-\u001f\u007f-\u009f\u00ad\u200b-\u200d\u2060\ufeff]/g;
function Se(e) {
  let t = [],
    n = e,
    r = !1;
  for (; n.length > 16 || (r && n.length > 12);) {
    let e = 0;
    for (let t = Math.min(16, n.length - 1); t >= 1; t--)
      if (xe.test(n[t - 1] ?? ``)) {
        e = t;
        break;
      }
    (e === 0 && ((e = 12), (r = !0)), t.push(n.slice(0, e)), (n = n.slice(e)));
  }
  return (n.length > 0 && t.push(n), t);
}
function X(e) {
  let t = e
      .normalize(`NFC`)
      .replace(
        /\r\n?|[\u2028\u2029\u0085]/g,
        `
`,
      )
      .replace(/[\t\v\f]/g, ` `)
      .replace(Y, ``),
    n = [];
  for (let e of t.split(`
`)) {
    let t = ue(e);
    if (t.length !== 0) for (let e of Se(t)) n.push(e.join(` `));
  }
  return n;
}
function Ce(e) {
  return e.reduce((e, t) => e + ue(t).length, 0);
}
function we(e) {
  return [...e.normalize(`NFC`).replace(Y, ``).replace(/\s+/g, ` `).trim()].slice(0, 60).join(``).trim();
}
function Te() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function Ee(e) {
  if (typeof e != `object` || !e) return null;
  let t = e;
  if (
    typeof t.id != `string` ||
    !be.test(t.id) ||
    typeof t.title != `string` ||
    !Array.isArray(t.lines) ||
    !t.lines.every((e) => typeof e == `string`)
  )
    return null;
  let n = t.lines.join(`
`);
  if (n.length > 12e3) return null;
  let r = we(t.title),
    i = X(n);
  if (r === `` || i.length === 0) return null;
  let a = (e) => (typeof e == `number` && Number.isFinite(e) ? e : 0);
  return { id: t.id, title: r, lines: i, createdAt: a(t.createdAt), updatedAt: a(t.updatedAt) };
}
function De(e = Te()) {
  if (!e) return { items: [], access: `unavailable` };
  let t;
  try {
    t = e.getItem(q);
  } catch {
    return { items: [], access: `unavailable` };
  }
  if (t === null) return { items: [], access: `ok` };
  let n;
  try {
    n = JSON.parse(t);
  } catch {
    return { items: [], access: `ok` };
  }
  let r = n?.v;
  if (typeof r == `number` && r > 1) return { items: [], access: `newer` };
  let i = n?.items;
  if (r !== 1 || !Array.isArray(i)) return { items: [], access: `ok` };
  let a = [];
  for (let e of i) {
    let t = Ee(e);
    if ((t && !a.some((e) => e.id === t.id) && a.push(t), a.length === 5)) break;
  }
  return { items: a, access: `ok` };
}
function Oe(e) {
  return e === `newer` ? J : e === `unavailable` ? ve : null;
}
function ke(e, t) {
  if (!e) return !1;
  try {
    return (t.length === 0 ? e.removeItem(q) : e.setItem(q, JSON.stringify({ v: 1, items: t })), !0);
  } catch {
    return !1;
  }
}
function Ae(e, t) {
  for (;;) {
    let n = `my-${t.toString(36)}${Math.floor(Math.random() * 36 ** 4).toString(36)}`;
    if (!e.some((e) => e.id === n)) return n;
  }
}
function je(e, t = Te(), n = Date.now()) {
  let r = De(t),
    i = Oe(r.access);
  if (i) return { ok: !1, error: i };
  if (e.text.length > 12e3) return { ok: !1, error: he };
  let a = we(e.title);
  if (a === ``) return { ok: !1, error: me };
  let o = X(e.text);
  if (o.length === 0) return { ok: !1, error: pe };
  let s = e.id ? r.items.find((t) => t.id === e.id) : void 0;
  if (!s && r.items.length >= 5) return { ok: !1, error: ge };
  let c = s
      ? { ...s, title: a, lines: o, updatedAt: n }
      : { id: Ae(r.items, n), title: a, lines: o, createdAt: n, updatedAt: n },
    l = s ? r.items.map((e) => (e.id === c.id ? c : e)) : [...r.items, c];
  return ke(t, l) ? { ok: !0, item: c, count: l.length } : { ok: !1, error: ye };
}
function Me(e, t = Te()) {
  let n = De(t);
  return n.access !== `ok` || !n.items.some((t) => t.id === e)
    ? !1
    : ke(
        t,
        n.items.filter((t) => t.id !== e),
      );
}
function Ne(e) {
  return be.test(e);
}
var Pe = e({ chantView: () => _t }),
  Fe = 40,
  Ie = 110,
  Le = 80,
  Re = 3,
  ze = 2.5,
  Be = 0.6,
  Ve = 6200,
  He = 8,
  Ue = 25,
  We = 0.25,
  Ge = 0.2,
  Ke = 1.6,
  qe = 400,
  Je = `Không tìm thấy bài kinh này.`,
  Ye = `Không mở được bài kinh. Bạn thử lại nhé.`,
  Xe = `Đang mở bài kinh…`,
  Ze = `Nghe pháp thoại`,
  Z = `chua-online:chant`;
function Qe() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function $e() {
  try {
    let e = Qe()?.getItem(Z);
    if (!e) return { last: void 0, newer: !1 };
    let t = JSON.parse(e);
    return typeof t?.v == `number` && t.v > 1
      ? { last: void 0, newer: !0 }
      : { last: t?.v === 1 ? (t.last ?? void 0) : null, newer: !1 };
  } catch {
    return { last: null, newer: !1 };
  }
}
function et(e, t) {
  let { last: n, newer: r } = $e();
  if (!r)
    try {
      let r = Qe();
      if (!e) {
        let e = n?.id;
        (t === void 0 || e === t) && r?.removeItem(Z);
        return;
      }
      let i = { id: e.selectionId, queueIndex: e.queueIndex, pos: e.pos, at: e.at };
      r?.setItem(Z, JSON.stringify({ v: 1, last: i }));
    } catch {}
}
function tt(e, t) {
  let { last: n, newer: r } = $e();
  if (r || n === void 0) return;
  let i = typeof n == `object` ? n : null,
    a = i?.id,
    o = i?.queueIndex,
    s = i?.pos,
    c = i?.at;
  if (
    typeof a == `string` &&
    typeof o == `number` &&
    Number.isInteger(o) &&
    o >= 0 &&
    typeof s == `number` &&
    Number.isInteger(s) &&
    s >= 0 &&
    typeof c == `number` &&
    Number.isFinite(c) &&
    t - c <= 2592e6 &&
    e(a)
  )
    return { selectionId: a, queueIndex: o, pos: s, at: c };
  et(void 0);
}
function nt(e) {
  return { id: e.id, title: e.title, subtitle: `Bài kinh của tôi`, syllables: Ce(e.lines), lines: e.lines };
}
var rt = (e) => (e < 100 ? `s` : e < 500 ? `m` : `l`),
  it = () => oe.map((e) => ce(e)?.syllables ?? 0);
function at(e, t) {
  let n = t.reduce((e, t) => e + t, 0);
  if (n === 0) return 0;
  let r = t.slice(0, e.queueIndex).reduce((e, t) => e + t, 0);
  return Math.min(99, Math.max(0, Math.round(((r + e.pos) / n) * 100)));
}
function ot(e, t) {
  let n = (e.reduce((e, t) => e + t, 0) * 60) / t + e.length * He;
  return Math.max(5, Math.round(n / 5) * 5);
}
var st = `<svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="chantMoWood" cx="36%" cy="28%" r="85%">
      <stop offset="0" stop-color="#e3ad6c" />
      <stop offset="0.55" stop-color="#b9743a" />
      <stop offset="1" stop-color="#6b3818" />
    </radialGradient>
    <linearGradient id="chantMoStick" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f1d8a8" />
      <stop offset="1" stop-color="#b98a52" />
    </linearGradient>
  </defs>
  <ellipse cx="80" cy="146" rx="46" ry="6" fill="#000" opacity="0.35" />
  <g class="chant-mo__body">
    <rect x="69" y="20" width="22" height="18" rx="7" fill="#8a4f26" />
    <ellipse cx="80" cy="88" rx="56" ry="52" fill="url(#chantMoWood)" />
    <path d="M42 66 Q80 40 118 66" fill="none" stroke="#7a4220" stroke-width="3" stroke-linecap="round" opacity="0.55" />
    <path d="M34 82 Q80 52 126 82" fill="none" stroke="#7a4220" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
    <circle cx="54" cy="84" r="6" fill="#2b1408" />
    <circle cx="52.5" cy="82.5" r="1.8" fill="#fff" opacity="0.7" />
    <path d="M32 106 Q80 140 128 106" fill="none" stroke="#2b1408" stroke-width="11" stroke-linecap="round" />
    <path d="M40 105 Q80 131 120 105" fill="none" stroke="#000" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round" />
    <path d="M44 72 Q52 52 74 46" fill="none" stroke="#fff" stroke-opacity="0.28" stroke-width="5" stroke-linecap="round" />
  </g>
  <g class="chant-mo__mallet">
    <line x1="148" y1="22" x2="110" y2="60" stroke="url(#chantMoStick)" stroke-width="7" stroke-linecap="round" />
    <circle cx="106" cy="64" r="10" fill="url(#chantMoStick)" />
  </g>
</svg>`,
  Q = (e) =>
    e.replace(
      /[&<>"']/g,
      (e) => ({ "&": `&amp;`, "<": `&lt;`, ">": `&gt;`, '"': `&quot;`, "'": `&#39;` })[e] ?? e,
    ),
  ct = (e) => Math.min(Ie, Math.max(Fe, Math.round(Number.isFinite(e) ? e : Le))),
  lt = () =>
    typeof window.matchMedia == `function` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,
  ut = () =>
    typeof window.matchMedia == `function` && window.matchMedia(`(hover: hover) and (pointer: fine)`).matches,
  dt = (e) => e.map(U).filter((e) => e !== void 0);
function ft(e) {
  if (
    e.defaultPrevented ||
    e.repeat ||
    e.altKey ||
    e.ctrlKey ||
    e.metaKey ||
    document.querySelector(`dialog[open], [role="dialog"]`)
  )
    return !0;
  let t = e.target;
  return t instanceof HTMLElement
    ? t.isContentEditable
      ? !0
      : [`INPUT`, `TEXTAREA`, `SELECT`, `BUTTON`, `A`, `SUMMARY`].includes(t.tagName)
    : !1;
}
function pt(e) {
  let t = `chant-h-${e.id}`;
  return `<article class="card ${e.primary ? `card--glow chant-card chant-card--daily` : `chant-card`}" aria-labelledby="${t}" data-card="${Q(e.id)}">
    <div class="chant-card__head">
      <h3 class="chant-card__title" id="${t}">${Q(e.title)}</h3>
      ${e.badge ? `<span class="badge">${Q(e.badge)}</span>` : ``}
    </div>
    ${e.subtitle ? `<p class="chant-card__sub">${Q(e.subtitle)}</p>` : ``}
    ${e.description ? `<p class="chant-card__desc">${Q(e.description)}</p>` : ``}
    <div class="chant-card__foot">
      <span class="chant-card__meta">${Q(e.meta)}</span>
      <button class="btn ${e.primary ? `btn--gold` : `btn--ghost`}" type="button" data-action="start" data-id="${Q(e.id)}" aria-label="${Q(`${e.resumable ? `Tiếp tục` : `Bắt đầu`} tụng: ${e.title}`)}">${r(`play`, { size: 18 })}<span>${e.resumable ? `Tiếp tục` : `Bắt đầu`}</span></button>
    </div>
    ${e.extra ?? ``}
  </article>`;
}
function mt(e, t, n, r = ``) {
  return `<section class="chant-section" aria-labelledby="chant-sec-${e}"${r ? ` data-role="${r}"` : ``}>
    <h2 class="chant-section__title" id="chant-sec-${e}">${Q(t)}</h2>
    <div class="stack">${n}</div>
  </section>`;
}
function ht(e) {
  let t = e
      ? e.lines.join(`
`)
      : ``,
    n = t.length > fe;
  return `<div class="card chant-editor" data-role="my-editor"${e ? ` data-id="${Q(e.id)}"` : ``} role="group" aria-labelledby="chantMyEditorTitle">
    <h3 class="chant-card__title" id="chantMyEditorTitle">${e ? `Sửa bài kinh của bạn` : `Thêm bài kinh của bạn`}</h3>
    <label class="chant-editor__label" for="chantMyTitle">Tên bài</label>
    <input id="chantMyTitle" class="chant-editor__title" type="text" maxlength="60" autocomplete="off" value="${Q(e?.title ?? ``)}" />
    <label class="chant-editor__label" for="chantMyText">Lời kinh (mỗi câu một dòng)</label>
    <textarea id="chantMyText" class="chant-editor__text" rows="8" aria-describedby="chantMyCount chantMyNote"${n ? ` aria-invalid="true"` : ``}>${Q(t)}</textarea>
    <p class="chant-editor__count muted${n ? ` is-over` : ``}" id="chantMyCount" data-role="my-count">${gt(t.length)}</p>
    <p class="chant-editor__note" id="chantMyNote">${Q(_e)}</p>
    <p class="chant-editor__error" data-role="my-error" role="alert" hidden></p>
    <div class="row chant-editor__actions">
      <button class="btn btn--gold" type="button" data-action="my-save">Lưu trên máy này</button>
      <button class="btn btn--ghost" type="button" data-action="my-cancel">Huỷ</button>
    </div>
  </div>`;
}
function gt(e) {
  let t = (e) => String(e).replace(/\B(?=(\d{3})+(?!\d))/g, `.`),
    n = `${t(e)} / ${t(fe)} ký tự`;
  return e > 12e3 ? `${n}, dài quá ${t(e - fe)} ký tự` : n;
}
var _t = {
    id: `chant`,
    title: `Tụng kinh`,
    mount(e, t) {
      let c = document.createElement(`section`);
      ((c.className = `view chant-view`), e.append(c));
      let u = new AbortController(),
        { signal: f } = u,
        p = `list`,
        h = !1,
        g = ``,
        _ = !1,
        v = !1,
        y = [],
        b = 0,
        x = !1,
        S = 0,
        C = De(),
        w = null,
        T = null,
        E,
        D = (e) => e === H.id || ce(e) !== void 0 || C.items.some((t) => t.id === e),
        O = tt(D, Date.now()),
        k,
        A = [],
        j = [],
        M = [],
        N = [],
        P = 0,
        F = 0,
        ee = -1,
        I = !1,
        te = 0,
        L,
        R = `audio`,
        z = 0,
        B = 0,
        V = 0,
        ae = 0,
        W = 0,
        G = new Set(),
        K,
        q,
        pe = !1,
        me = 0,
        he = () => ct(t.store.getSettings().chantTempo),
        _e = () => (R === `audio` ? t.audio.now() : performance.now() / 1e3);
      function J(e) {
        let t = c.querySelector(e);
        if (!t) throw Error(`chant: thiếu phần tử ${e}`);
        return t;
      }
      function ve(e) {
        let t = document.activeElement,
          n = t instanceof HTMLElement && c.contains(t) ? t : void 0,
          r = n?.dataset.action;
        ((c.innerHTML = e),
          window.scrollTo({ top: 0 }),
          n &&
            ((r ? c.querySelector(`[data-action="${r}"]`) : null) ?? c.querySelector(`.view__title`))?.focus({
              preventScroll: !0,
            }));
      }
      function ye() {
        !x &&
          t.audio.isMuted() &&
          ((x = !0), t.toast(`Âm thanh đang tắt. Bấm biểu tượng loa ở góc trên để nghe tiếng mõ.`));
      }
      function be() {
        if (q || pe) return;
        pe = !0;
        let e = ++me;
        de()
          .then((t) => {
            (e === me && (pe = !1), e === me && I && !h ? (q = t) : t());
          })
          .catch(() => {
            e === me && (pe = !1);
          });
      }
      function xe() {
        (me++, (pe = !1), q?.(), (q = void 0));
      }
      function Y(e) {
        let t = O?.selectionId;
        ((O = e), e ? et(e) : t !== void 0 && et(void 0, t));
      }
      function Se(e) {
        if (e === H.id) return { title: H.title, counts: it() };
        let t = C.items.find((t) => t.id === e);
        if (t) return { title: t.title, counts: [Ce(t.lines)] };
        let n = ce(e);
        return n ? { title: n.title, counts: [n.syllables] } : void 0;
      }
      function X() {
        return (O && !D(O.selectionId) && Y(void 0), O);
      }
      function we() {
        n(location.hash) === `chant` && a().has(`bai`) && history.replaceState(null, ``, i(`chant`));
      }
      function Te(e, t) {
        let n = X(),
          r = n?.selectionId === e ? Se(e) : void 0;
        return n && r ? `${t} · đã tụng ${at(n, r.counts)}%` : t;
      }
      function Ee() {
        let e = X(),
          t = e ? Se(e.selectionId) : void 0;
        if (!e || !t) return ``;
        let n = at(e, t.counts);
        return `<button class="chant-row chant-row--last" type="button" data-action="resume" data-id="${Q(e.selectionId)}" aria-label="${Q(`Tiếp tục lần trước: ${t.title}, đã tụng ${n}%`)}">
        <span class="chant-row__text">Lần trước: <strong>${Q(t.title)}</strong> · đã tụng ${n}%</span>
        <span class="chant-row__go">Tiếp tục${r(`chevron-right`, { size: 18 })}</span>
      </button>`;
      }
      function ke() {
        return !ne() || t.isUnlocked?.(`talks`) !== !0
          ? ``
          : `<button class="chant-row chant-row--talks" type="button" data-action="talks">
        <span class="chant-row__text">${r(`play`, { size: 18 })}${Ze}</span>
        <span class="chant-row__go" aria-hidden="true">${r(`chevron-right`, { size: 18 })}</span>
      </button>`;
      }
      function Ae(e, t) {
        return pt({
          id: e.id,
          title: e.title,
          subtitle: e.subtitle,
          description: e.description,
          meta: Te(e.id, `≈ ${d(ot([e.syllables], t))} · ${e.lineCount} câu`),
          resumable: X()?.selectionId === e.id,
        });
      }
      function Pe(e, t) {
        let n = Ce(e.lines),
          r =
            T === e.id
              ? `<div class="chant-card__mine" role="group" aria-label="${Q(`Xoá ${e.title}?`)}">
            <span class="chant-card__ask">Xoá bài này khỏi máy?</span>
            <button class="btn btn--ghost" type="button" data-action="my-delete-yes" data-id="${Q(e.id)}">Xoá</button>
            <button class="btn btn--ghost" type="button" data-action="my-delete-no" data-id="${Q(e.id)}">Không</button>
          </div>`
              : `<div class="chant-card__mine">
            <button class="btn btn--ghost" type="button" data-action="my-edit" data-id="${Q(e.id)}" aria-label="${Q(`Sửa: ${e.title}`)}">Sửa</button>
            <button class="btn btn--ghost" type="button" data-action="my-delete" data-id="${Q(e.id)}" aria-label="${Q(`Xoá: ${e.title}`)}">Xoá</button>
          </div>`;
        return pt({
          id: e.id,
          title: e.title,
          description: ``,
          meta: Te(e.id, `≈ ${d(ot([n], t))} · ${e.lines.length} câu`),
          resumable: X()?.selectionId === e.id,
          extra: r,
        });
      }
      function Le(e) {
        let t = C.items.map((t) => Pe(t, e)).join(``),
          n = Oe(C.access);
        return n
          ? `${t}<p class="chant-note muted">${Q(n)}</p>`
          : w
            ? `${t}${ht(w.id ? C.items.find((e) => e.id === w?.id) : void 0)}`
            : C.items.length >= 5
              ? `${t}<p class="chant-note muted">${Q(ge)}</p>`
              : `${t}<button class="btn btn--ghost chant-add" type="button" data-action="my-add">＋ Thêm bài kinh của bạn</button>`;
      }
      function He() {
        (It(), S++, (p = `list`), m(!1), (k = void 0), we());
        let e = he(),
          t = [];
        for (let n of re) {
          if (n.id === `thoi-khoa`) {
            let r = it();
            t.push(
              mt(
                n.id,
                n.label,
                pt({
                  id: H.id,
                  title: H.label,
                  description: H.description,
                  meta: Te(H.id, `≈ ${d(ot(r, e))} · ${r.length} phần`),
                  badge: `Nên bắt đầu`,
                  primary: !0,
                  resumable: X()?.selectionId === H.id,
                }),
              ),
            );
            continue;
          }
          let r = se.filter((e) => e.category === n.id);
          r.length > 0 && t.push(mt(n.id, n.label, r.map((t) => Ae(t, e)).join(``)));
        }
        (t.push(mt(`cua-toi`, `Bài kinh của tôi`, Le(e), `my-section`)),
          ve(`
        <header class="view__header">
          <h1 class="view__title" tabindex="-1">Tụng kinh</h1>
          <p class="view__lead">Chọn một bài rồi chạm vào mõ để tụng từng chữ, hoặc bấm “Mõ tự động” để nghe mõ gõ đều theo nhịp; hết bài có ba tiếng khánh. Mới bắt đầu, bạn có thể thử Thời khóa ngắn.</p>
        </header>
        ${Ee()}
        ${ke()}
        <div class="stack chant-list">${t.join(``)}</div>
        <p class="chant-note muted">Thời lượng tính theo nhịp mõ ${e} tiếng/phút. Bạn chỉnh nhịp được khi đang tụng.</p>
      `));
      }
      function Z(e) {
        let t = c.querySelector(`[data-role="my-section"] .stack`);
        if (p !== `list` || !t) return;
        t.innerHTML = Le(he());
        let n = c.querySelector(`.chant-row--last`),
          r = Ee();
        (n && !r && n.remove(), e && c.querySelector(e)?.focus({ preventScroll: !1 }));
      }
      function Qe(e) {
        if (e === H.id) return dt(oe);
        let t = C.items.find((t) => t.id === e);
        if (t) return [nt(t)];
        let n = U(e);
        return n ? [n] : ce(e) ? null : [];
      }
      function $e(e, n) {
        let i = ++S,
          a = Qe(e);
        if (a === null) {
          (It(), (p = `loading`), (k = void 0));
          let a = ce(e);
          (ve(`
          <header class="view__header chant-bar">
            <button class="icon-btn" type="button" data-action="list" aria-label="Về danh sách bài kinh" title="Về danh sách bài kinh">${r(`chevron-left`)}</button>
            <div class="chant-bar__text">
              <h1 class="view__title" tabindex="-1">${Q(a?.title ?? `Tụng kinh`)}</h1>
            </div>
          </header>
          <p class="chant-loading muted" role="status">${Xe}</p>
        `),
            le(e)
              .then((t) => {
                h || i !== S || (t ? vt(e, [t], n) : _t());
              })
              .catch(() => {
                h || i !== S || (t.toast(Ye), He());
              }));
        } else a.length === 0 ? _t() : vt(e, a, n);
      }
      function _t() {
        (He(), t.toast(Je));
      }
      function vt(e, t, n) {
        ((g = e), (_ = e === H.id), (v = Ne(e)), (y = t), (b = 0));
        let r = 0;
        (O?.selectionId === e && O.queueIndex < y.length && ((b = O.queueIndex), (r = O.pos)),
          s(`sutra_started`, { id: v ? `custom` : e, from: n }),
          bt(!1, r));
      }
      function yt() {
        p === `reading` && F < P && (F > 0 || b > 0)
          ? Y({ selectionId: g, queueIndex: b, pos: F, at: Date.now() })
          : p === `interlude` && b + 1 < y.length
            ? Y({ selectionId: g, queueIndex: b + 1, pos: 0, at: Date.now() })
            : p === `reading` && F === 0 && O?.selectionId === g && Y(void 0);
      }
      function bt(e = !1, t = 0) {
        let n = y[b];
        if (!n) {
          He();
          return;
        }
        (It(e), (p = `reading`), m(!0));
        let i = y.slice(0, b + 1).filter((e) => e.id === n.id).length,
          a = y.filter((e) => e.id === n.id).length,
          o = a > 1 ? `${n.title} (lần ${i}/${a})` : n.title,
          s = _ ? `${H.title} · phần ${b + 1}/${y.length}` : (n.subtitle ?? ``),
          c = he(),
          l = n.sourcesChecked ? ie(n.sourcesChecked) : null;
        (ve(`
        <header class="view__header chant-bar">
          <button class="icon-btn" type="button" data-action="list" aria-label="Về danh sách bài kinh" title="Về danh sách bài kinh">${r(`chevron-left`)}</button>
          <div class="chant-bar__text">
            <h1 class="view__title" tabindex="-1">${Q(o)}</h1>
            ${s ? `<p class="view__lead">${Q(s)}</p>` : ``}
          </div>
          <button class="icon-btn" type="button" data-action="restart" aria-label="Tụng lại từ đầu bài này" title="Tụng lại từ đầu bài này">${r(`reset`)}</button>
        </header>
        <div class="chant-progress" role="progressbar" aria-label="Tiến độ bài kinh" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="chant-progress__fill"></span></div>
        <div class="chant-stage">
          <div class="chant-text" tabindex="0" role="region" aria-label="Nội dung bài kinh"></div>
        </div>
        ${l ? `<p class="chant-src muted">${Q(l.before)}<button class="chant-src__link" type="button" data-action="gop-y">${Q(l.link)}</button>${Q(l.after)}</p>` : ``}
        <div class="chant-controls">
          <button class="chant-mo" type="button" data-action="mo" aria-label="Gõ mõ, tụng một chữ" aria-disabled="false">${st}</button>
          <p class="chant-hint muted"></p>
          <button class="btn btn--ghost btn--lg" type="button" data-action="auto"></button>
          <div class="chant-tempo">
            <label class="chant-tempo__label" for="chantTempo">Nhịp mõ: <strong class="chant-tempo__val">${c}</strong> tiếng/phút</label>
            <input id="chantTempo" class="chant-tempo__range" type="range" min="${Fe}" max="${Ie}" step="1" value="${c}" data-role="tempo" aria-valuetext="${c} tiếng mỗi phút" />
          </div>
        </div>
      `),
          (k = {
            stage: J(`.chant-stage`),
            text: J(`.chant-text`),
            bar: J(`.chant-progress`),
            fill: J(`.chant-progress__fill`),
            mo: J(`.chant-mo`),
            hint: J(`.chant-hint`),
            auto: J(`[data-action="auto"]`),
            tempo: J(`.chant-tempo__range`),
            tempoVal: J(`.chant-tempo__val`),
          }),
          (A = []),
          (j = []),
          (M = []));
        let u = document.createDocumentFragment();
        (n.lines.forEach((e, t) => {
          let n = document.createElement(`p`);
          ((n.className = `chant-line`),
            ue(e).forEach((e, r) => {
              r > 0 && n.append(` `);
              let i = document.createElement(`span`);
              ((i.className = `chant-syl`), (i.textContent = e), n.append(i), j.push(i), M.push(t));
            }),
            A.push(n),
            u.append(n));
        }),
          k.text.append(u),
          (P = j.length),
          (N = j.map(() => -1)),
          (F = Math.min(Math.max(0, t), Math.max(0, P - 1))),
          (W = F),
          (ee = -1),
          xt(!0),
          Tt());
      }
      function xt(e = !1) {
        if (!k) return;
        for (let e = 0; e < j.length; e++) {
          let t = e < F - 1 ? 1 : e === F - 1 ? 2 : e === F ? 3 : 0;
          if (N[e] === t) continue;
          N[e] = t;
          let n = j[e];
          n &&
            (n.classList.toggle(`is-sung`, t === 1),
            n.classList.toggle(`is-on`, t === 2),
            n.classList.toggle(`is-next`, t === 3));
        }
        let t = M[Math.min(F, P - 1)] ?? 0;
        t !== ee &&
          ((ee = t),
          A.forEach((e, n) => {
            (e.classList.toggle(`is-current`, n === t),
              n === t ? e.setAttribute(`aria-current`, `true`) : e.removeAttribute(`aria-current`));
          }),
          St(t, e));
        let n = P > 0 ? Math.round((F / P) * 100) : 0;
        ((k.fill.style.transform = `scaleX(${P > 0 ? F / P : 0})`),
          k.bar.setAttribute(`aria-valuenow`, String(n)));
      }
      function St(e, t) {
        let n = k?.text,
          r = A[e];
        if (!n || !r) return;
        let i = Math.max(0, r.offsetTop - (n.clientHeight - r.offsetHeight) / 2);
        typeof n.scrollTo == `function`
          ? n.scrollTo({ top: i, behavior: t || lt() ? `auto` : `smooth` })
          : (n.scrollTop = i);
      }
      function Ct(e) {
        ((F = Math.min(P, Math.max(0, e))), xt(), F >= P && p === `reading` && Lt());
      }
      function wt() {
        let e = k?.mo;
        e && (e.classList.remove(`is-hit`), e.offsetWidth, e.classList.add(`is-hit`));
      }
      function Tt() {
        k &&
          ((k.auto.innerHTML = I
            ? `${r(`pause`)}<span>Tạm dừng</span>`
            : `${r(`play`)}<span>Mõ tự động</span>`),
          k.auto.classList.toggle(`btn--gold`, I),
          k.auto.classList.toggle(`btn--ghost`, !I),
          k.mo.setAttribute(`aria-disabled`, String(I)),
          (k.hint.textContent = I
            ? `Mõ tự gõ theo nhịp. Bấm “Tạm dừng” để tự gõ.`
            : `${ut() ? `Chạm mõ hoặc nhấn Space` : `Chạm vào mõ`} để tụng từng chữ, hay bấm “Mõ tự động” để nghe mõ gõ đều theo nhịp.`));
      }
      function Et() {
        p !== `reading` ||
          I ||
          G.size > 0 ||
          F >= P ||
          (ye(), t.audio.play(`mo`, { bus: `mo` }), t.haptic(8), wt(), Ct(F + 1));
      }
      function Dt() {
        if (I || (p !== `reading` && p !== `interlude`)) return;
        ((I = !0), Tt(), ye());
        let e = ++te,
          n;
        new Promise((e) => {
          ((n = window.setTimeout(e, qe)),
            t.audio
              .unlock(`playback`)
              .catch(() => void 0)
              .then(e));
        }).then(() => {
          (window.clearTimeout(n), e === te && I && !h && (be(), p === `reading` && At()));
        });
      }
      function Ot() {
        ((I = !1), te++, jt(), xe());
      }
      function kt() {
        (Ot(), Tt());
      }
      function At() {
        if (L !== void 0 || W >= P) return;
        ((R = t.audio.now() > 0 ? `audio` : `perf`), (V = t.audio.now()), (ae = performance.now()));
        let e = _e();
        ((W = Math.max(F, W)), (z = G.size > 0 ? Math.max(e + 0.05, B + 60 / he()) : e + We), Mt());
      }
      function jt() {
        (L !== void 0 && window.clearTimeout(L), (L = void 0));
      }
      function Mt() {
        if (((L = void 0), !I || p !== `reading`)) return;
        if (R === `audio`) {
          let e = t.audio.now();
          e === V
            ? performance.now() - ae > 600 && ((R = `perf`), (z = _e() + 0.05))
            : ((V = e), (ae = performance.now()));
        }
        let e = _e(),
          n = document.hidden ? Ke : Ge;
        for (z < e - 0.3 && (z = e + 0.05); W < P && z < e + n;) (Nt(z, e), (z += 60 / he()));
        W < P && (L = window.setTimeout(Mt, Ue));
      }
      function Nt(e, n) {
        let r = Math.max(0, e - n),
          i = ++W;
        ((B = e), t.audio.play(`mo`, { delay: r, bus: `mo` }));
        let a = window.setTimeout(() => {
          (G.delete(a), wt(), Ct(i));
        }, r * 1e3);
        G.add(a);
      }
      function Pt() {
        for (let e of G) window.clearTimeout(e);
        G.clear();
      }
      function Ft() {
        (K !== void 0 && window.clearTimeout(K), (K = void 0));
      }
      function It(e = !1) {
        (e ? jt() : Ot(), Pt(), Ft());
      }
      function Lt() {
        if (p !== `reading`) return;
        (jt(), Pt());
        let e = y[b],
          n = e ? e.syllables : 0;
        (!v || n >= 16) && t.store.record(`sutras`, 1);
        for (let e = 0; e < Re; e++) t.audio.play(`khanh`, { delay: Be + e * ze, bus: `mo` });
        let r = y[b + 1];
        r
          ? ((p = `interlude`), Rt(e, r), (K = window.setTimeout(zt, Ve)))
          : (s(`sutra_finished`, { id: v ? `custom` : g, len: rt(y.reduce((e, t) => e + t.syllables, 0)) }),
            Ot(),
            Bt());
      }
      function Rt(e, t) {
        if (!k) return;
        let n = document.createElement(`div`);
        ((n.className = `chant-interlude`),
          n.setAttribute(`role`, `status`),
          (n.innerHTML = `
        <span class="chant-interlude__icon" aria-hidden="true">${r(`lotus`, { size: 36 })}</span>
        <p class="chant-interlude__title">Đã tụng xong${e ? ` ${Q(e.title)}` : ``}</p>
        <p class="chant-interlude__next muted">Tiếp theo: ${Q(t.title)}</p>
      `),
          k.stage.append(n));
      }
      function zt() {
        ((K = void 0), h || p !== `interlude` || (b++, bt(!0), I && At()));
      }
      function Bt() {
        ((p = `done`), m(!1), (k = void 0), O?.selectionId === g && Y(void 0));
        let e = y[y.length - 1],
          n = U(`hoi-huong`)?.lines ?? [],
          i = t.store.today().sutras,
          a = _ ? `Đã hoàn thành thời khóa` : `Đã tụng xong${e ? ` ${e.title}` : ``}`;
        ve(`
        <header class="view__header">
          <h1 class="view__title" tabindex="-1">Tụng kinh</h1>
        </header>
        <div class="card card--glow stack chant-done">
          <span class="chant-done__icon" aria-hidden="true">${r(`lotus`, { size: 44 })}</span>
          <h2 class="chant-done__title">${Q(a)}</h2>
          <p class="chant-done__text muted">Hôm nay bạn đã tụng xong ${i} bài kinh. Nam mô A Di Đà Phật.</p>
          <div class="chant-verse">
            <p class="chant-verse__label">Hồi hướng</p>
            ${n.map((e) => `<p class="chant-verse__line">${Q(e)}</p>`).join(``)}
          </div>
          <div class="row chant-done__actions">
            <button class="btn btn--gold btn--lg" type="button" data-action="again">Tụng lại</button>
            <button class="btn btn--ghost btn--lg" type="button" data-action="list">Chọn bài khác</button>
          </div>
        </div>
      `);
      }
      function Vt() {
        (p === `reading` || p === `interlude`) && bt();
      }
      function Ht() {
        return {
          title: c.querySelector(`#chantMyTitle`)?.value ?? ``,
          text: c.querySelector(`#chantMyText`)?.value ?? ``,
        };
      }
      function Ut(e) {
        let t = c.querySelector(`[data-role="my-error"]`);
        t &&
          ((t.textContent = ``),
          (t.hidden = !1),
          window.clearTimeout(E),
          (E = window.setTimeout(() => {
            ((E = void 0), !h && t.isConnected && (t.textContent = e));
          }, 0)));
      }
      function Wt() {
        let e = w?.id,
          t = je({ ...Ht(), ...(e ? { id: e } : {}) });
        t.ok
          ? (s(`custom_sutra_saved`, { count: t.count }),
            (C = De()),
            (w = null),
            Z(`[data-action="start"][data-id="${t.item.id}"]`))
          : Ut(t.error);
      }
      function Gt(e) {
        (Me(e), (C = De()), (T = null), O?.selectionId === e && Y(void 0), Z(`[data-action="my-add"]`));
      }
      (c.addEventListener(`click`, (e) => {
        if (!(e.target instanceof Element)) return;
        let n = e.target.closest(`[data-action]`);
        if (!n || !c.contains(n)) return;
        let r = n.dataset.id ?? ``;
        switch (n.dataset.action) {
          case `start`:
            $e(r, `list`);
            break;
          case `resume`:
            $e(r, `last`);
            break;
          case `talks`:
            (l(`chant`), t.navigate(`talks`));
            break;
          case `gop-y`:
            Kt();
            break;
          case `mo`:
            (t.audio.unlock(`playback`), e.detail === 0 && Et());
            break;
          case `auto`:
            I ? kt() : Dt();
            break;
          case `restart`:
            Vt();
            break;
          case `list`:
            (yt(), He());
            break;
          case `again`:
            $e(g, `list`);
            break;
          case `my-add`:
            ((w = {}), (T = null), Z(`#chantMyTitle`));
            break;
          case `my-edit`:
            ((w = { id: r }), (T = null), Z(`#chantMyText`));
            break;
          case `my-cancel`: {
            let e = w?.id;
            ((w = null), Z(e ? `[data-action="my-edit"][data-id="${e}"]` : `[data-action="my-add"]`));
            break;
          }
          case `my-save`:
            Wt();
            break;
          case `my-delete`:
            ((T = r), (w = null), Z(`[data-action="my-delete-no"][data-id="${r}"]`));
            break;
          case `my-delete-yes`:
            Gt(r);
            break;
          case `my-delete-no`:
            ((T = null), Z(`[data-action="my-delete"][data-id="${r}"]`));
        }
      }),
        c.addEventListener(`keydown`, (e) => {
          if (e.key !== `Escape` || e.defaultPrevented || e.isComposing || T === null) return;
          let t = T;
          (e.preventDefault(), (T = null), Z(`[data-action="my-delete"][data-id="${t}"]`));
        }),
        c.addEventListener(`pointerdown`, (e) => {
          e.target instanceof Element &&
            e.target.closest(`[data-action="mo"]`) &&
            (e.pointerType !== `mouse` || e.button === 0) &&
            Et();
        }),
        document.addEventListener(
          `keydown`,
          (e) => {
            p !== `reading` || (e.key !== ` ` && e.key !== `Spacebar`) || ft(e) || (e.preventDefault(), Et());
          },
          { signal: f },
        ),
        c.addEventListener(`input`, (e) => {
          let n = e.target;
          if (n instanceof HTMLTextAreaElement && n.id === `chantMyText`) {
            let e = n.value.length,
              t = e > fe,
              r = c.querySelector(`[data-role="my-count"]`);
            (r && ((r.textContent = gt(e)), r.classList.toggle(`is-over`, t)),
              t ? n.setAttribute(`aria-invalid`, `true`) : n.removeAttribute(`aria-invalid`));
            return;
          }
          if (!(n instanceof HTMLInputElement) || n.dataset.role !== `tempo`) return;
          let r = ct(Number(n.value));
          (t.store.updateSettings({ chantTempo: r }),
            k && (k.tempoVal.textContent = String(r)),
            n.setAttribute(`aria-valuetext`, `${r} tiếng mỗi phút`));
        }),
        window.addEventListener(`pagehide`, yt, { signal: f }),
        document.addEventListener(
          `visibilitychange`,
          () => {
            document.visibilityState === `hidden` && yt();
          },
          { signal: f },
        ));
      function Kt() {
        let e = y[b]?.id;
        o({
          kind: `bug`,
          source: `chant`,
          context: () => (e ? { path: `/${i(`chant`)}?bai=${encodeURIComponent(e)}` } : {}),
          onFail: (e) => t.toast(e),
        });
      }
      function qt(e) {
        D(e) ? $e(e, `link`) : _t();
      }
      window.addEventListener(
        `hashchange`,
        () => {
          let e = a().get(`bai`);
          e && n(location.hash) === `chant` && (p === `list` || p === `done` || e !== g) && qt(e);
        },
        { signal: f },
      );
      let Jt = a(),
        Yt = Jt.get(`bai`);
      return (
        Yt ? qt(Yt) : He(),
        Yt &&
          Jt.get(`gop-y`) === `1` &&
          D(Yt) &&
          (history.replaceState(null, ``, `${i(`chant`)}?bai=${encodeURIComponent(Yt)}`),
          o({
            kind: `bug`,
            source: `kinh`,
            context: () => ({ path: `/${i(`chant`)}?bai=${encodeURIComponent(Yt)}` }),
            onFail: (e) => t.toast(e),
          })),
        () => {
          (yt(), u.abort(), (h = !0), m(!1), Ot(), Pt(), Ft(), xe(), window.clearTimeout(E));
        }
      );
    },
  },
  vt = e({ meditateView: () => Bt }),
  yt = [5, 10, 15, 20, 30],
  bt = 5,
  xt = `chua-online:med-duration`,
  St = `chua-online:med-interval-bell`,
  Ct = 30,
  wt = 300,
  Tt = 3600,
  Et = 250,
  Dt = 3e3,
  Ot = 4,
  kt = 11,
  At = U(`hoi-huong`)?.lines ?? [];
function jt(e = () => Date.now()) {
  let t = 0,
    n = 0,
    r = !1,
    i = () => {
      let i = e();
      (r && (t += Math.max(0, i - n)), (n = i));
    };
  return {
    start() {
      ((t = 0), (n = e()), (r = !0));
    },
    pause() {
      (i(), (r = !1));
    },
    resume() {
      r ||= ((n = e()), !0);
    },
    elapsedMs() {
      return (i(), t);
    },
  };
}
function Mt(e) {
  return e ?? Tt;
}
function Nt(e) {
  let t = ((e % kt) + kt) % kt;
  return { phase: t < Ot ? `inhale` : t < 5 ? `hold` : `exhale`, offset: t };
}
var Pt = { inhale: `Hít vào…`, hold: `Giữ hơi…`, exhale: `Thở ra…` };
function Ft(e) {
  try {
    return localStorage.getItem(e);
  } catch {
    return null;
  }
}
function It(e, t) {
  try {
    localStorage.setItem(e, t);
  } catch {}
}
function Lt() {
  let e = Ft(xt);
  if (e === `free`) return `free`;
  let t = Number(e);
  return yt.find((e) => e === t) ?? bt;
}
function Rt(e) {
  return e === `free`
    ? `Đếm thời gian lên, tối đa 60 phút, hoặc bấm “Xả thiền”.`
    : `Chuông sẽ vang khi đủ ${e} phút. Hãy giữ màn hình sáng để nghe chuông đúng giờ.`;
}
function zt(e, t) {
  let n = Lt(),
    i = Ft(St) === `1`,
    a = jt(),
    o = `idle`,
    s = (e) => {
      ((o = e), p(e === `running`));
    },
    l = null,
    u,
    f,
    m = new Set(),
    h = null,
    g = null,
    _ = { time: ``, phase: `` },
    v = (t) => {
      let n = e.querySelector(t);
      if (!n) throw Error(`Thiếu phần tử ${t}`);
      return n;
    };
  function y() {
    for (let e of m) window.clearTimeout(e);
    m.clear();
  }
  function b() {
    (y(), t.audio.play(`bell`));
    for (let e of [1, 2]) {
      let n = window.setTimeout(() => {
        (m.delete(n), t.audio.play(`khanh`));
      }, e * Dt);
      m.add(n);
    }
  }
  function x() {
    f &&= ((f.cancelled = !0), f.release?.(), void 0);
  }
  function S() {
    x();
    let e = { cancelled: !1 };
    ((f = e),
      de().then(
        (t) => {
          e.cancelled ? t() : (e.release = t);
        },
        () => {},
      ));
  }
  function C() {
    if (!l) return 0;
    let e = Math.min(Math.floor(a.elapsedMs() / 1e3), Mt(l.durationSec));
    return (
      e >= Ct &&
        e > l.recordedSec &&
        (t.store.record(`meditationSeconds`, e - l.recordedSec), (l.recordedSec = e)),
      e
    );
  }
  function w() {
    if (!h) return;
    let e = t.store.today().meditationSeconds;
    ((h.today.innerHTML =
      e > 0
        ? `Hôm nay bạn đã thiền <strong>${d(e)}</strong>.`
        : `Hôm nay bạn chưa thiền. Vài phút thôi cũng đủ quý.`),
      (h.mute.hidden = t.store.getSettings().sound));
  }
  function T(t) {
    (s(`idle`), (g = null));
    let a = (e, t) => {
      let r = e === n;
      return `<button type="button" class="chip${r ? ` is-active` : ``}" data-choice="${e}" aria-pressed="${r}">${t}</button>`;
    };
    ((e.innerHTML = `
      <section class="view med-view">
        <header class="view__header">
          <h1 class="view__title">Thiền định</h1>
          <p class="view__lead">Ngồi thẳng lưng, thả lỏng vai, theo dõi hơi thở.</p>
        </header>
        <div class="stack med-setup">
          <div class="card stack">
            <div>
              <h2 class="med-label" id="med-duration-label">Thời gian thiền</h2>
              <div class="chips" role="group" aria-labelledby="med-duration-label">
                ${yt.map((e) => a(e, `${e} phút`)).join(``)}
                ${a(`free`, `Tự do`)}
              </div>
              <p class="muted med-hint" data-ref="hint"></p>
            </div>
            <label class="med-switch">
              <input class="med-switch__input" type="checkbox" role="switch" data-ref="bell"${i ? ` checked` : ``} />
              <span class="med-switch__track" aria-hidden="true"></span>
              <span class="med-switch__text">Chuông nhắc mỗi 5 phút</span>
            </label>
          </div>
          <p class="notice med-mute" data-ref="mute" role="status" hidden>
            Âm thanh đang tắt nên chuông sẽ không vang. Bật lại ở nút loa phía trên.
          </p>
          <button type="button" class="btn btn--gold btn--lg btn--block" data-act="start">
            ${r(`lotus`)}<span>Bắt đầu</span>
          </button>
          <p class="muted med-today" data-ref="today"></p>
        </div>
      </section>`),
      (h = { today: v(`[data-ref="today"]`), mute: v(`[data-ref="mute"]`), hint: v(`[data-ref="hint"]`) }),
      (h.hint.textContent = Rt(n)),
      w());
    let o = e.querySelectorAll(`[data-choice]`);
    for (let e of o)
      e.addEventListener(`click`, () => {
        let t = e.dataset.choice;
        ((n = t === `free` ? `free` : Number(t)), It(xt, String(n)));
        for (let t of o) {
          let n = t === e;
          (t.classList.toggle(`is-active`, n), t.setAttribute(`aria-pressed`, String(n)));
        }
        h && (h.hint.textContent = Rt(n));
      });
    v(`[data-ref="bell"]`).addEventListener(`change`, (e) => {
      ((i = e.target.checked), It(St, i ? `1` : `0`));
    });
    let c = v(`[data-act="start"]`);
    (c.addEventListener(`click`, N), t && c.focus({ preventScroll: !0 }));
  }
  function E() {
    l &&
      ((h = null),
      (e.innerHTML = `
      <section class="view med-view med-view--run">
        <h1 class="sr-only">Thiền định</h1>
        <div class="med-run">
          <div class="med-orb" data-ref="orb">
            <span class="med-orb__glow" aria-hidden="true"></span>
            <span class="med-orb__circle" aria-hidden="true"></span>
            <p class="med-phase" data-ref="phase"></p>
          </div>
          <div class="med-clock">
            <p class="med-time" role="timer" data-ref="time"></p>
            <p class="muted med-sub">${l.durationSec === null ? `Đã thiền` : `Còn lại`}</p>
          </div>
          <div class="med-controls">
            <button type="button" class="btn btn--gold btn--lg" data-act="pause"></button>
            <button type="button" class="btn btn--ghost btn--lg" data-act="end">
              ${r(`stop`)}<span>Xả thiền</span>
            </button>
          </div>
          <p class="sr-only" role="status" aria-live="polite" data-ref="live"></p>
        </div>
      </section>`),
      (g = {
        orb: v(`[data-ref="orb"]`),
        phase: v(`[data-ref="phase"]`),
        time: v(`[data-ref="time"]`),
        pauseBtn: v(`[data-act="pause"]`),
        live: v(`[data-ref="live"]`),
      }),
      (_.time = ``),
      (_.phase = ``),
      D(!1),
      g.pauseBtn.addEventListener(`click`, () => (o === `running` ? P() : F())),
      v(`[data-act="end"]`).addEventListener(`click`, () => ee(`ended`)));
  }
  function D(e) {
    g &&
      (g.pauseBtn.innerHTML = e ? `${r(`play`)}<span>Tiếp tục</span>` : `${r(`pause`)}<span>Tạm dừng</span>`);
  }
  function O() {
    if (!g || !l) return;
    let e = a.elapsedMs() / 1e3,
      t = l.durationSec === null ? c(Math.floor(e)) : c(Math.max(0, Math.ceil(l.durationSec - e)));
    t !== _.time && ((g.time.textContent = t), (_.time = t));
    let n = o === `paused` ? `Tạm dừng` : Pt[Nt(e).phase];
    n !== _.phase && ((g.phase.textContent = n), (_.phase = n));
  }
  function k() {
    if (!g) return;
    let { offset: e } = Nt(a.elapsedMs() / 1e3);
    (g.orb.classList.remove(`is-breathing`, `is-paused`),
      g.orb.style.setProperty(`--med-offset`, `-${e.toFixed(2)}s`),
      g.orb.offsetWidth,
      g.orb.classList.add(`is-breathing`));
  }
  function A() {
    (j(), (u = window.setInterval(M, Et)));
  }
  function j() {
    (u !== void 0 && window.clearInterval(u), (u = void 0));
  }
  function M() {
    if (o !== `running` || !l) return;
    let e = a.elapsedMs();
    if (e >= Mt(l.durationSec) * 1e3) ee(`completed`);
    else if ((O(), l.intervalBell)) {
      let n = Math.floor(e / 1e3 / wt);
      n > l.bellsDone && ((l.bellsDone = n), t.audio.play(`khanh`));
    }
  }
  function N() {
    o === `idle` &&
      (t.audio.unlock(`playback`),
      (l = { durationSec: n === `free` ? null : n * 60, intervalBell: i, bellsDone: 0, recordedSec: 0 }),
      a.start(),
      s(`running`),
      E(),
      k(),
      O(),
      S(),
      b(),
      A(),
      g?.pauseBtn.focus({ preventScroll: !0 }),
      g && (g.live.textContent = `Bắt đầu thiền`));
  }
  function P() {
    (M(),
      o === `running` &&
        g &&
        (a.pause(),
        s(`paused`),
        j(),
        x(),
        y(),
        g.orb.classList.add(`is-paused`),
        D(!0),
        (g.live.textContent = `Đã tạm dừng`),
        O()));
  }
  function F() {
    o === `paused` &&
      g &&
      (a.resume(), s(`running`), k(), S(), A(), D(!1), (g.live.textContent = `Tiếp tục thiền`), O());
  }
  function ee(e) {
    if (o === `idle` || !l) return;
    (j(), x(), y(), s(`idle`));
    let n = C();
    n < Ct
      ? (t.toast(`Phiên thiền dưới 30 giây nên chưa được ghi lại.`), T(!0))
      : (e === `completed` ? (b(), t.haptic([40, 80, 40])) : t.audio.play(`bell`), I(n));
  }
  function I(n) {
    ((g = null), (h = null));
    let i = t.store.today().meditationSeconds;
    e.innerHTML = `
      <section class="view med-view">
        <header class="view__header">
          <h1 class="view__title" tabindex="-1">Hồi hướng công đức</h1>
          <p class="view__lead">Thiền xong rồi. Xin hồi hướng phước lành đến muôn loài.</p>
        </header>
        <div class="stack med-done">
          <div class="card card--glow med-verse-card">
            <span class="med-verse-card__mark" aria-hidden="true">${r(`lotus`, { size: 40 })}</span>
            <p class="med-verse__cite">Kệ Hồi Hướng</p>
            <blockquote class="med-verse">
              ${At.map((e) => `<span class="med-verse__line">${e}</span>`).join(``)}
            </blockquote>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat__value">${d(n)}</span>
              <span class="stat__label">Lần thiền này</span>
            </div>
            <div class="stat">
              <span class="stat__value">${d(i)}</span>
              <span class="stat__label">Hôm nay</span>
            </div>
          </div>
          <button type="button" class="btn btn--gold btn--lg btn--block" data-act="done">Xong</button>
          <button type="button" class="btn btn--ghost btn--block" data-act="again">
            ${r(`reset`)}<span>Thiền thêm một lần</span>
          </button>
        </div>
      </section>`;
    let a = v(`[data-act="done"]`);
    (a.addEventListener(`click`, () => T(!0)),
      v(`[data-act="again"]`).addEventListener(`click`, N),
      a.focus({ preventScroll: !0 }));
  }
  let te = () => {
      document.visibilityState === `hidden`
        ? o !== `idle` && C()
        : o === `running` && (M(), o === `running` && k());
    },
    L = () => {
      o !== `idle` && C();
    };
  (document.addEventListener(`visibilitychange`, te), window.addEventListener(`pagehide`, L));
  let R = t.store.subscribe(w);
  return (
    T(!1),
    () => {
      (document.removeEventListener(`visibilitychange`, te),
        window.removeEventListener(`pagehide`, L),
        R(),
        j(),
        y(),
        x(),
        o !== `idle` && C(),
        s(`idle`));
    }
  );
}
var Bt = { id: `meditate`, title: `Thiền`, mount: zt },
  Vt = e({ talksView: () => nn }),
  Ht = `Pháp thoại`,
  Ut = `Chùa Sen đang chọn bài pháp thoại. Bạn quay lại sau nhé.`,
  Wt = `Cần kết nối mạng để nghe pháp thoại.`,
  Gt = `Pháp thoại do Chùa Sen chọn từ kênh chính thức của quý thầy cô; nội dung thuộc về kênh gốc.`,
  Kt = ` (mở thẻ mới)`,
  qt = `talksOffline`,
  Jt = `https://www.youtube-nocookie.com`,
  Yt = /^[A-Za-z0-9_-]{11}$/;
function Xt(e) {
  if (!Yt.test(e.youtubeId)) return null;
  let t = e.start !== void 0 && Number.isInteger(e.start) && e.start > 0 ? `&start=${e.start}` : ``;
  return `${Jt}/embed/${e.youtubeId}?autoplay=1&rel=0&playsinline=1${t}`;
}
function Zt(e) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(e.youtubeId)}`;
}
var $ = (e) =>
    e.replace(
      /[&<>"']/g,
      (e) => ({ "&": `&amp;`, "<": `&lt;`, ">": `&gt;`, '"': `&quot;`, "'": `&#39;` })[e] ?? e,
    ),
  Qt = () => `<span class="talk-card__motif" aria-hidden="true">${r(`lotus`, { size: 40 })}</span>`,
  $t = (e) => `Nghe: ${e.title}`;
function en(e) {
  let t = [B.find((t) => t.id === e.teacher)?.name ?? ``, `${e.minutes} phút`, z[e.category]].filter(Boolean),
    n = $(e.id);
  return `<article class="card talk-card" data-talk="${n}" data-cat="${$(e.category)}" aria-labelledby="talk-h-${n}">
    <div class="talk-card__media" data-role="media">${Qt()}</div>
    <h3 class="talk-card__title" id="talk-h-${n}">${$(e.title)}</h3>
    <p class="talk-card__desc">${$(e.summary)}</p>
    <p class="talk-card__meta">${t.map($).join(` · `)}</p>
    <div class="talk-card__actions">
      <button class="btn btn--gold talk-card__play" type="button" data-action="play" data-id="${n}" aria-label="${$($t(e))}">${r(`play`, { size: 18 })}<span>Nghe</span></button>
      <a class="talk-card__yt" href="${$(Zt(e))}" target="_blank" rel="noopener noreferrer" data-action="yt" data-id="${n}">${r(`youtube`, { size: 18 })}<span>Mở trên YouTube</span><span class="sr-only">${Kt}</span></a>
    </div>
  </article>`;
}
function tn() {
  return `
    <p class="talks-offline" id="${qt}" data-role="offline" role="status" hidden>${Wt}</p>
    ${Object.keys(z)
      .map((e) => ({ cat: e, talks: V.filter((t) => t.category === e) }))
      .filter((e) => e.talks.length > 0)
      .map(
        (e) => `<section class="talks-group" aria-labelledby="talks-g-${e.cat}">
      <h2 class="talks-group__title" id="talks-g-${e.cat}">${$(z[e.cat])}</h2>
      <div class="stack">${e.talks.map(en).join(``)}</div>
    </section>`,
      )
      .join(``)}
    <p class="talks-footer muted">${Gt}</p>`;
}
var nn = {
  id: `talks`,
  title: Ht,
  mount(e) {
    let t = document.createElement(`section`);
    ((t.className = `view talks-view`), e.append(t));
    let n = new AbortController(),
      i = null;
    (s(`talks_opened`, { from: u() }),
      (t.innerHTML = `
      <header class="view__header">
        <h1 class="view__title" tabindex="-1">${Ht}</h1>
        <p class="view__lead">Nghe bài giảng của quý thầy cô ngay trong chùa. Trình phát YouTube chỉ tải khi bạn bấm Nghe.</p>
      </header>
      ${V.length === 0 ? `<p class="card talks-empty" role="status">${Ut}</p>` : tn()}`));
    let a = (e) => V.find((t) => t.id === e),
      o = () => typeof navigator < `u` && navigator.onLine === !1;
    function c(e, t) {
      ((e.disabled = t), t ? e.setAttribute(`aria-describedby`, qt) : e.removeAttribute(`aria-describedby`));
    }
    function l() {
      let e = o(),
        n = t.querySelector(`[data-role="offline"]`);
      n && (n.hidden = !e);
      for (let n of t.querySelectorAll(`[data-action="play"]`)) c(n, e);
    }
    function d(e, t, n) {
      let i = e.querySelector(`.talk-card__play`);
      i &&
        ((i.dataset.action = n ? `close` : `play`),
        i.classList.toggle(`btn--gold`, !n),
        i.classList.toggle(`btn--ghost`, n),
        i.setAttribute(`aria-label`, n ? `Đóng trình phát: ${t.title}` : $t(t)),
        (i.innerHTML = n
          ? `${r(`close`, { size: 18 })}<span>Đóng</span>`
          : `${r(`play`, { size: 18 })}<span>Nghe</span>`),
        c(i, !n && o()));
    }
    function f(e = !1) {
      let t = i;
      if (!t) return;
      i = null;
      let n = t.card.querySelector(`[data-role="media"]`);
      (n && (n.innerHTML = Qt()), t.card.classList.remove(`is-playing`), d(t.card, t.talk, !1), e || h(!1));
    }
    function p(e, t) {
      let n = Xt(e),
        r = t.querySelector(`[data-role="media"]`);
      if (!n || !r || o()) return;
      f(!0);
      let a = document.createElement(`iframe`);
      ((a.className = `talk-card__frame`),
        (a.src = n),
        (a.title = e.title),
        a.setAttribute(`allow`, `autoplay; encrypted-media; picture-in-picture; fullscreen`),
        a.setAttribute(`allowfullscreen`, ``),
        a.setAttribute(`referrerpolicy`, `strict-origin-when-cross-origin`),
        a.setAttribute(`loading`, `eager`),
        r.replaceChildren(a),
        t.classList.add(`is-playing`),
        d(t, e, !0),
        (i = { talk: e, card: t }),
        h(!0),
        s(`talk_played`, { talk: e.id, cat: e.category }));
    }
    return (
      t.addEventListener(
        `click`,
        (e) => {
          if (!(e.target instanceof Element)) return;
          let n = e.target.closest(`[data-action]`),
            r = n?.closest(`.talk-card`),
            i = a(n?.dataset.id);
          if (n && r && i && t.contains(n))
            switch (n.dataset.action) {
              case `play`:
                p(i, r);
                break;
              case `close`:
                f();
                break;
              case `yt`:
                s(`talk_youtube_clicked`, { talk: i.id, cat: i.category });
            }
        },
        { signal: n.signal },
      ),
      window.addEventListener(`online`, l, { signal: n.signal }),
      window.addEventListener(`offline`, l, { signal: n.signal }),
      l(),
      () => {
        (n.abort(), f(), t.remove());
      }
    );
  },
};
export { g as i, vt as n, Pe as r, Vt as t };
