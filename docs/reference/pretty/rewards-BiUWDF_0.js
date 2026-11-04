import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import {
  K as t,
  R as n,
  f as r,
  gt as i,
  m as a,
  p as o,
  q as s,
  rt as c,
  wt as l,
} from "./index-e_Bx6V48.js";
import { ct as u, ft as d, pt as f } from "./app-z_oU8L_u.js";
import { E as p } from "./lazy-shared-D8DtrU9N.js";
import { a as m, c as h, i as g, o as ee, s as te } from "./referral-CM6Fj8ux.js";
import { a as _, n as v, o as y, r as b } from "./dialog-DwXghOMX.js";
var x = [`kol`, `bandao`],
  S = /^[A-Za-z0-9_-]{43}$/,
  C = /^[0-9a-f]{64}$/;
function w(e) {
  return typeof e == `string` && x.includes(e);
}
function ne(e) {
  return typeof e == `string` && S.test(e);
}
function T(e) {
  return typeof e == `string` && C.test(e);
}
function E(e) {
  let t = ``;
  for (let n of e) t += String.fromCharCode(n);
  return btoa(t).replace(/\+/g, `-`).replace(/\//g, `_`).replace(/=+$/, ``);
}
var D = new TextEncoder();
function O(e) {
  return Array.from(e, (e) => e.toString(16).padStart(2, `0`)).join(``);
}
function k() {
  return E(crypto.getRandomValues(new Uint8Array(32)));
}
async function A(e) {
  return O(new Uint8Array(await crypto.subtle.digest(`SHA-256`, D.encode(e))));
}
var j = {
    kol: `/api/kol`,
    kolStatus: `/api/kol/status`,
    ref: `/api/ref`,
    refRegister: `/api/ref/register`,
    refStatus: `/api/ref/status`,
  },
  re = `x-claim-key`,
  M = [`tiktok`, `youtube`, `facebook`, `instagram`],
  N = { tiktok: `TikTok`, youtube: `YouTube`, facebook: `Facebook`, instagram: `Instagram` },
  P = {
    tiktok: [`tiktok.com`, `vm.tiktok.com`],
    youtube: [`youtube.com`, `youtu.be`],
    facebook: [`facebook.com`, `fb.watch`],
    instagram: [`instagram.com`],
  },
  F = 2e3,
  I = `#chuasen`,
  L = { urlMax: 300, displayNameMax: 60, contactMax: 120, bodyMaxBytes: 2048 },
  ie = [`cho_duyet`, `da_duyet`, `tu_choi`],
  ae = { cho_duyet: `Đang chờ duyệt`, da_duyet: `Đã duyệt`, tu_choi: `Chưa đạt` };
function R(e) {
  return typeof e == `string` && M.includes(e);
}
function z(e) {
  return typeof e == `string` && ie.includes(e);
}
function oe(e) {
  let t = e.toLowerCase().replace(/\.$/, ``);
  for (let e of M) if (P[e].some((e) => t === e || t.endsWith(`.${e}`))) return e;
  return null;
}
var se = [`fbid`, `id`, `story_fbid`, `v`],
  ce = /\p{Cc}/u;
function le(e) {
  let t = typeof e == `string` ? e.trim() : ``;
  if (t === ``) return { ok: !1, message: `Bạn dán đường dẫn video giúp chùa nhé.` };
  if (t.length > L.urlMax) return { ok: !1, message: `Đường dẫn dài quá.` };
  let n = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`,
    r;
  try {
    r = new URL(n);
  } catch {
    return { ok: !1, message: `Đường dẫn chưa đúng, bạn kiểm tra lại nhé.` };
  }
  if (r.protocol !== `https:` && r.protocol !== `http:`)
    return { ok: !1, message: `Đường dẫn phải bắt đầu bằng https://` };
  if (r.username !== `` || r.password !== `` || r.port !== ``)
    return { ok: !1, message: `Đường dẫn chưa đúng, bạn kiểm tra lại nhé.` };
  let i = r.hostname.toLowerCase().replace(/\.$/, ``),
    a = oe(i);
  if (a === null)
    return { ok: !1, message: `Chùa nhận video trên TikTok, YouTube, Facebook hoặc Instagram.` };
  let o = r.pathname.replace(/\/+$/, ``),
    s = se.flatMap((e) => {
      let t = r.searchParams.get(e);
      return t === null || t === `` ? [] : [[e, t]];
    });
  if (o === `` && s.length === 0)
    return { ok: !1, message: `Đây là trang chủ, bạn dán đường dẫn của chính video nhé.` };
  let c = `https://${i}${o}${s.length > 0 ? `?${new URLSearchParams(s).toString()}` : ``}`;
  return c.length > L.urlMax ? { ok: !1, message: `Đường dẫn dài quá.` } : { ok: !0, url: c, platform: a };
}
function ue(e) {
  let t = le(e);
  return t.ok ? t.platform : null;
}
function B(e) {
  return Array.from(e).length;
}
function V(e) {
  return e.normalize(`NFC`).replace(/\s+/g, ` `).trim();
}
function de(e) {
  if (typeof e != `object` || !e || Array.isArray(e)) return { ok: !1, message: `Dữ liệu gửi không hợp lệ.` };
  let t = e,
    n = le(t.url);
  if (!n.ok) return n;
  if (t.platform !== void 0 && t.platform !== null && t.platform !== ``) {
    if (!R(t.platform)) return { ok: !1, message: `Nền tảng không hợp lệ.` };
    if (t.platform !== n.platform)
      return { ok: !1, message: `Đường dẫn này là của ${N[n.platform]}, không phải ${N[t.platform]}.` };
  }
  let r = typeof t.displayName == `string` ? V(t.displayName) : ``;
  if (r === ``) return { ok: !1, message: `Bạn cho chùa biết tên hiển thị nhé.` };
  if (B(r) > L.displayNameMax) return { ok: !1, message: `Tên hiển thị tối đa ${L.displayNameMax} ký tự.` };
  if (ce.test(r)) return { ok: !1, message: `Tên hiển thị có ký tự lạ.` };
  let i;
  if (t.contact !== void 0 && t.contact !== null) {
    if (typeof t.contact != `string`) return { ok: !1, message: `Liên hệ không hợp lệ.` };
    let e = V(t.contact);
    if (B(e) > L.contactMax) return { ok: !1, message: `Liên hệ tối đa ${L.contactMax} ký tự.` };
    if (ce.test(e)) return { ok: !1, message: `Liên hệ có ký tự lạ.` };
    e !== `` && (i = e);
  }
  if (!T(t.claimKeyHash)) return { ok: !1, message: `Thiếu mã thiết bị, bạn tải lại trang rồi gửi lại nhé.` };
  let a = typeof t.website == `string` && t.website.trim() !== ``,
    o = { url: n.url, platform: n.platform, displayName: r, claimKeyHash: t.claimKeyHash };
  return (i !== void 0 && (o.contact = i), { ok: !0, value: o, spam: a });
}
function fe(e) {
  let t = e.find((e) => e.status === `da_duyet`) ?? e[0];
  return t === void 0 ? { status: `none`, note: null } : { status: t.status, note: t.note };
}
function pe(e) {
  if (typeof e != `object` || !e) return null;
  let t = e;
  return typeof t.url != `string` || !R(t.platform) || !z(t.status) || typeof t.createdAt != `string`
    ? null
    : {
        url: t.url.slice(0, L.urlMax),
        platform: t.platform,
        status: t.status,
        note: typeof t.note == `string` && t.note.trim() !== `` ? t.note.slice(0, 500) : null,
        createdAt: t.createdAt,
        reviewedAt: typeof t.reviewedAt == `string` ? t.reviewedAt : null,
      };
}
function H(e) {
  if (typeof e != `object` || !e) return null;
  let t = e;
  if (t.status !== `none` && !z(t.status)) return null;
  let n = Array.isArray(t.items)
    ? t.items
        .map(pe)
        .filter((e) => e !== null)
        .slice(0, 10)
    : [];
  return {
    status: t.status,
    note: typeof t.note == `string` && t.note.trim() !== `` ? t.note.slice(0, 500) : null,
    items: n,
    token: typeof t.token == `string` && t.token !== `` ? t.token : null,
  };
}
var me = /^[A-Za-z0-9_-]{6,32}$/;
function U(e) {
  return typeof e == `string` && me.test(e);
}
function he(e) {
  if (typeof e != `object` || !e) return null;
  let t = e,
    n = Number(t.count);
  if (!Number.isSafeInteger(n) || n < 0) return null;
  let r = Number(t.goal);
  return {
    count: n,
    goal: Number.isSafeInteger(r) && r > 0 ? r : 3,
    token: typeof t.token == `string` && t.token !== `` ? t.token : null,
  };
}
function W(e, t = 3) {
  return `Đã rủ ${Math.max(0, Math.min(t, Math.floor(Number.isFinite(e) ? e : 0)))}/${t} bạn`;
}
var ge = e({
    KOL_ALREADY_SENT: () => xe,
    KOL_RATE_LIMITED: () => be,
    KOL_SEND_FAILED: () => Y,
    KOL_TOO_LONG: () => Se,
    OUTFIT_UNLOCKS: () => Ce,
    REF_DONE_COUNT: () => q,
    REWARDS_DONE_POLL_MS: () => K,
    REWARDS_FORCE_MIN_MS: () => J,
    REWARDS_POLL_MS: () => G,
    REWARDS_TICK_MS: () => _e,
    REWARDS_TIMEOUT_MS: () => ve,
    createRewards: () => Me,
    followReferralProgress: () => Le,
    getBadgeTokens: () => ze,
    getMyRefCode: () => Fe,
    getReferralProgress: () => Ie,
    getRewards: () => X,
    onRewardsChange: () => Re,
    referralProgressText: () => W,
    rewardsApiBase: () => we,
    startRewards: () => Pe,
  }),
  G = 18e5,
  K = 864e5,
  q = 10,
  J = 6e4,
  _e = 3e5,
  ve = 1e4,
  ye = 6e5,
  Y = `Chưa gửi được. Bạn kiểm tra mạng rồi thử lại sau nhé.`,
  be = `Bạn gửi hơi nhanh, nghỉ chút rồi thử lại sau ít phút nhé.`,
  xe = `Bạn đã gửi video này rồi, chùa đang xem.`,
  Se = `Nội dung dài quá, bạn rút gọn giúp chùa nhé.`,
  Ce = { addBadge: u, removeBadge: d, setReferralCount: f };
function we(e) {
  let t = e?.trim();
  if (!t) return ``;
  try {
    let e = new URL(t);
    return e.protocol === `https:` || e.protocol === `http:` ? e.origin : ``;
  } catch {
    return ``;
  }
}
function Te(e) {
  return Array.isArray(e) ? (H({ status: `none`, items: e })?.items ?? []) : [];
}
function Ee(e) {
  let t = { registered: null, refReported: null, submissions: [], kol: null, ref: null };
  if (e === null) return t;
  let n;
  try {
    let r = JSON.parse(e);
    if (typeof r != `object` || !r) return t;
    n = r;
  } catch {
    return t;
  }
  if (
    (U(n.registered) && (t.registered = n.registered),
    U(n.refReported) && (t.refReported = n.refReported),
    Array.isArray(n.submissions))
  ) {
    for (let e of n.submissions) {
      if (typeof e != `object` || !e) continue;
      let { url: n, platform: r, at: i } = e;
      typeof n == `string` &&
        R(r) &&
        typeof i == `number` &&
        t.submissions.push({ url: n, platform: r, at: i });
    }
    t.submissions = t.submissions.slice(-20);
  }
  let r = n.kol;
  typeof r == `object` &&
    r &&
    typeof r.at == `number` &&
    (t.kol = {
      status: r.status === `none` || z(r.status) ? r.status : `none`,
      note: typeof r.note == `string` ? r.note : null,
      items: Te(r.items),
      at: r.at,
    });
  let i = n.ref;
  if (typeof i == `object` && i && typeof i.at == `number`) {
    let e = Number(i.count),
      n = Number(i.goal);
    t.ref = {
      count: Number.isSafeInteger(e) && e >= 0 ? e : 0,
      goal: Number.isSafeInteger(n) && n > 0 ? n : 3,
      at: i.at,
    };
  }
  return t;
}
function De(e) {
  let t = {};
  if (e === null) return t;
  try {
    let n = JSON.parse(e);
    if (typeof n != `object` || !n) return t;
    for (let [e, r] of Object.entries(n)) w(e) && typeof r == `string` && r !== `` && (t[e] = r);
  } catch {}
  return t;
}
function Oe(e) {
  let t = new Map(),
    n = new Set();
  return {
    get(r) {
      if (e !== null && !n.has(r))
        try {
          return e.getItem(r);
        } catch {}
      return t.get(r) ?? null;
    },
    set(r, i) {
      t.set(r, i);
      try {
        if (e === null) throw Error(`không có localStorage`);
        (e.setItem(r, i), n.delete(r));
      } catch {
        n.add(r);
      }
    },
  };
}
function ke() {
  try {
    return typeof window < `u` ? (window.localStorage ?? null) : null;
  } catch {
    return null;
  }
}
function Ae() {
  return {
    storage: ke(),
    fetch: (e, t) => fetch(e, t),
    now: () => Date.now(),
    apiBase: we(void 0),
    unlocks: Ce,
    document: typeof document > `u` ? null : document,
  };
}
var je = (e) => [...e].sort((e, t) => (Date.parse(t.createdAt) || 0) - (Date.parse(e.createdAt) || 0));
function Me(e = {}) {
  let t = { ...Ae(), ...e },
    n = Oe(t.storage),
    i = Ee(n.get(a)),
    s = De(n.get(r)),
    c = new Set(),
    l = null,
    u = -1 / 0,
    d = null,
    f = null,
    _ = () => n.set(a, JSON.stringify(i)),
    v = () => n.set(r, JSON.stringify(s));
  function y() {
    let e = N.snapshot();
    for (let t of [...c])
      try {
        t(e);
      } catch (e) {
        console.error(`Lỗi khi báo trạng thái chương trình KOL`, e);
      }
  }
  function b(e) {
    try {
      e(t.unlocks);
    } catch (e) {
      console.error(`Móc mở áo lỗi`, e);
    }
  }
  async function x(e, n = {}) {
    let r = new AbortController(),
      i = setTimeout(() => r.abort(), ve),
      a = `${t.apiBase}${e}`;
    try {
      return await t.fetch(a, { ...n, headers: p(a, n.headers), credentials: `omit`, signal: r.signal });
    } catch {
      return null;
    } finally {
      clearTimeout(i);
    }
  }
  async function S(e) {
    try {
      return await e.json();
    } catch {
      return null;
    }
  }
  let C = () => te(t.storage),
    w = () => ({ [re]: N.claimKey() }),
    T = () => i.submissions.length > 0 || s.kol !== void 0 || i.kol?.status === `da_duyet`,
    E = (e, t, n) => {
      if (e === void 0) return !0;
      let r = n - e;
      return r < 0 || r >= t;
    };
  async function D(e) {
    let n = e;
    for (let e = 0; e < 2; e++) {
      let e = await x(j.refRegister, {
        method: `POST`,
        headers: { "content-type": `application/json`, ...w() },
        body: JSON.stringify({ code: n }),
      });
      if (e === null) return !1;
      if (e.status === 200) return ((u = t.now()), i.registered !== n && ((i.registered = n), _(), y()), !0);
      if (e.status !== 409) return !1;
      n = h(t.storage);
    }
    return !1;
  }
  async function O(e) {
    let t = await x(j.kolStatus, { headers: w() });
    if (t === null || t.status !== 200) return;
    let n = H(await S(t));
    if (n === null) return;
    let r = i.kol?.status === `da_duyet` || s.kol !== void 0;
    ((i.kol = { status: n.status, note: n.note, items: n.items, at: e }),
      _(),
      n.status === `da_duyet`
        ? (n.token !== null && ((s.kol = n.token), v()), b((e) => e.addBadge(`kol`)))
        : r && (delete s.kol, v(), b((e) => e.removeBadge(`kol`))),
      y());
  }
  async function M(e) {
    let t = await x(j.refStatus, { headers: w() });
    if (t === null || t.status !== 200) return;
    let n = he(await S(t));
    n !== null &&
      ((i.ref = { count: n.count, goal: n.goal, at: e }),
      _(),
      n.token !== null && ((s.bandao = n.token), v()),
      b((e) => {
        (e.setReferralCount(n.count), (n.token !== null || n.count >= n.goal) && e.addBadge(`bandao`));
      }),
      y());
  }
  let N = {
    claimKey() {
      let e = n.get(o);
      return (ne(e) || ((e = k()), n.set(o, e)), e);
    },
    claimKeyHash() {
      let e = N.claimKey();
      return ((d === null || d.key !== e) && (d = { key: e, hash: A(e) }), d.hash);
    },
    pendingReferral() {
      return ee({ storage: t.storage, now: t.now })?.code ?? null;
    },
    myRefCode() {
      return m(t.storage);
    },
    shareCode() {
      let e = N.myRefCode();
      return (N.ensureRegistered(!0), e);
    },
    shareUrl(e = typeof location > `u` ? `` : location.origin) {
      return `${e}/?ref=${encodeURIComponent(N.shareCode())}`;
    },
    ensureRegistered(e = !1) {
      let n = N.myRefCode(),
        r = t.now() - u < ye;
      return i.registered === n && (!e || r)
        ? Promise.resolve(!0)
        : (f === null &&
            (f = D(n).finally(() => {
              f = null;
            })),
          f);
    },
    async reportPendingReferral() {
      let e = N.pendingReferral();
      if (e === null) return;
      if (i.refReported !== null || e === C()) {
        (i.refReported === null && ((i.refReported = e), _()), g(t.storage));
        return;
      }
      let n = await x(j.ref, {
        method: `POST`,
        headers: { "content-type": `application/json` },
        body: JSON.stringify({ from: e, claimKeyHash: await N.claimKeyHash() }),
      });
      n !== null && (n.status === 200 || n.status === 400) && ((i.refReported = e), _(), g(t.storage));
    },
    refresh(e = {}) {
      return (
        l === null &&
          (l = (async () => {
            try {
              let n = t.now(),
                r = [];
              if (T()) {
                let t = e.force === !0 ? J : G;
                E(i.kol?.at, t, n) && r.push(O(n));
              }
              if (i.registered !== null) {
                let t = (i.ref?.count ?? 0) >= Math.max(i.ref?.goal ?? 3, q) && s.bandao !== void 0,
                  a = e.force === !0 ? J : t ? K : G;
                E(i.ref?.at, a, n) && r.push(M(n));
              }
              return (await Promise.all(r), N.snapshot());
            } finally {
              l = null;
            }
          })()),
        l
      );
    },
    async submitKol(e) {
      let n = de({
        url: e.url,
        displayName: e.displayName,
        contact: e.contact,
        claimKeyHash: await N.claimKeyHash(),
      });
      if (!n.ok) return { ok: !1, message: n.message };
      if (
        i.submissions.some((e) => e.url === n.value.url) ||
        (i.kol?.items ?? []).some((e) => e.url === n.value.url)
      )
        return { ok: !1, message: xe };
      let r = e.website?.trim() ?? ``,
        a = await x(j.kol, {
          method: `POST`,
          headers: { "content-type": `application/json` },
          body: JSON.stringify(r === `` ? n.value : { ...n.value, website: r }),
        });
      if (a === null) return { ok: !1, message: Y };
      if (a.status === 201 || a.status === 409)
        return (
          (i.submissions = [
            ...i.submissions,
            { url: n.value.url, platform: n.value.platform, at: t.now() },
          ].slice(-20)),
          _(),
          y(),
          { ok: !0, already: a.status === 409 }
        );
      if (a.status === 429) return { ok: !1, message: be };
      if (a.status === 413) return { ok: !1, message: Se };
      if (a.status === 400) {
        let e = await S(a),
          t = typeof e?.message == `string` ? e.message.trim().slice(0, 240) : ``;
        return { ok: !1, message: t === `` ? Y : t };
      }
      return { ok: !1, message: Y };
    },
    snapshot() {
      let e = i.kol?.items ?? [],
        t = new Set(e.map((e) => e.url)),
        n = je([
          ...i.submissions
            .filter((e) => !t.has(e.url))
            .map((e) => ({
              url: e.url,
              platform: e.platform,
              status: `cho_duyet`,
              note: null,
              createdAt: new Date(e.at).toISOString(),
              reviewedAt: null,
            })),
          ...e,
        ]).slice(0, 10),
        r = fe(n),
        a = i.ref?.count ?? 0,
        o = i.ref?.goal ?? 3;
      return {
        kol: { ...r, items: n, badge: r.status === `da_duyet` },
        ref: { count: a, goal: o, badge: a >= o, text: W(a, o), code: C() },
      };
    },
    badgeTokens() {
      return { ...s };
    },
    subscribe(e) {
      return (
        c.add(e),
        () => {
          c.delete(e);
        }
      );
    },
    start() {
      let e = !1,
        n = () => t.document?.visibilityState !== `hidden`,
        r = N.snapshot();
      (b((e) => {
        ((s.kol !== void 0 || r.kol.badge) && e.addBadge(`kol`),
          i.ref !== null && e.setReferralCount(i.ref.count),
          (s.bandao !== void 0 || r.ref.badge) && e.addBadge(`bandao`));
      }),
        (async () => {
          await N.reportPendingReferral();
          let t = C();
          (t !== null && i.registered !== t && (await N.ensureRegistered()), e || (await N.refresh()));
        })().catch((e) => console.error(`Chương trình KOL: lỗi khi khởi động`, e)));
      let a = () => {
          !e && n() && N.refresh();
        },
        o = setInterval(a, _e);
      return (
        t.document?.addEventListener(`visibilitychange`, a),
        () => {
          ((e = !0), clearInterval(o), t.document?.removeEventListener(`visibilitychange`, a));
        }
      );
    },
  };
  return N;
}
var Ne = null;
function X() {
  return ((Ne ??= Me()), Ne);
}
function Pe() {
  return X().start();
}
function Fe() {
  return X().shareCode();
}
function Ie() {
  return X().snapshot().ref;
}
function Le(e, t = X()) {
  let n = t.subscribe((t) => e(t.ref));
  return (
    e(t.snapshot().ref),
    t
      .ensureRegistered(!0)
      .then((e) => (e ? t.refresh() : null))
      .catch((e) => console.error(`Rủ bạn: lỗi khi đăng ký mã từ thẻ chia sẻ`, e)),
    n
  );
}
function Re(e) {
  return X().subscribe(e);
}
function ze() {
  return X().badgeTokens();
}
var Be = e({ openRewardsPanel: () => ot }),
  Z = c(`kol`).label,
  Q = c(`ban-dao`).label,
  Ve = `Chương trình KOL Chùa Sen`,
  He = `Bạn làm video về Chùa Sen? Gửi đường dẫn video để nhận danh hiệu riêng "${n}", hào quang vàng và bộ "${Z}" chỉ dành cho KOL.`,
  Ue = `Bạn mang danh hiệu "${n}" cạnh tên và hào quang vàng quanh nhân vật; bộ "${Z}" đã mở cho bạn trong Trang phục.`,
  We = `Phần thưởng cho KOL`,
  Ge = [
    { id: `title`, name: n, note: `Danh hiệu riêng hiện cạnh tên bạn trong chùa.` },
    { id: `aura`, name: `Hào quang vàng`, note: `Vầng sáng vàng dịu quanh nhân vật của bạn.` },
    { id: `outfit`, name: Z, note: `Bộ áo chỉ KOL mới có, chọn trong Trang phục.` },
  ],
  Ke = [
    `Làm một video về Chùa Sen, đăng lên TikTok, YouTube, Facebook hoặc Instagram.`,
    `Thêm hashtag ${I} vào phần mô tả video.`,
    `Video đạt từ ${F.toLocaleString(`vi-VN`)} lượt xem trở lên.`,
    `Dán đường dẫn video vào ô bên dưới. Ben, người làm Chùa Sen, duyệt trong vài ngày.`,
  ],
  qe = `Liên hệ chỉ Ben đọc, để báo tin cho bạn khi cần. Chùa không hiện nó ở đâu cả.`,
  Je = `A Di Đà Phật. Chùa đã nhận video của bạn, Ben sẽ xem trong vài ngày.`,
  Ye = `Video này bạn đã gửi rồi, chùa đang xem.`,
  Xe = `Khi 3 người bạn vào chùa qua đường dẫn mời của bạn, bạn mở bộ áo "${Q}". Mỗi người bạn chỉ tính một lần.`,
  Ze = `Rủ thêm bạn: 5 bạn mở màu "${s.name}", 10 bạn mở màu "${t.name}" cho bộ "${Q}". Mỗi mốc còn được thêm tinh tấn trong Hành trình.`,
  Qe = `Bạn đã mở bộ áo "${Q}" trong Trang phục.`,
  $e = `Đã chép đường dẫn mời. Gửi cho bạn bè nhé!`,
  et = `Chưa chép được. Bạn bấm giữ để chép đường dẫn bên trên nhé.`,
  $ = null,
  tt = `button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), a[href]`,
  nt = { title: i(`sparkle`), aura: `<span class="rewards-dlg__aura"></span>`, outfit: i(`outfit`) };
function rt() {
  let e = `<strong class="rewards-dlg__tag">${I}</strong>`,
    t = Ke.map((t) => `<li>${t.replace(I, e)}</li>`).join(``),
    n = Ge.map(
      (e) =>
        `<li class="rewards-dlg__perk" data-perk="${e.id}"><span class="rewards-dlg__perk-art" aria-hidden="true">${nt[e.id]}</span><span class="rewards-dlg__perk-text"><strong class="rewards-dlg__perk-name">${e.name}</strong><span>${e.note}</span></span></li>`,
    ).join(``);
  return `
    <div class="rewards-dlg__card">
      <header class="rewards-dlg__head">
        <h2 id="rewards-title" class="rewards-dlg__title" tabindex="-1">${Ve}</h2>
        <button type="button" class="rewards-dlg__close" data-ref="close" aria-label="Đóng">${i(`close`)}</button>
      </header>
      <div class="rewards-dlg__body">
        <section class="rewards-dlg__badge" data-ref="badge" role="status" hidden>
          ${i(`lotus`, { size: 36 })}
          <div><strong>Bạn là KOL Chùa Sen</strong><span>${Ue}</span></div>
        </section>
        <section class="rewards-dlg__hero" data-ref="perks" aria-labelledby="rewards-perks-title">
          <h3 id="rewards-perks-title" class="rewards-dlg__hero-title">${We}</h3>
          <ul class="rewards-dlg__perks">${n}</ul>
        </section>
        <p id="rewards-intro" class="rewards-dlg__intro">${He}</p>
        <section class="rewards-dlg__section" aria-labelledby="rewards-rules-title">
          <h3 id="rewards-rules-title" class="rewards-dlg__label">Thể lệ</h3>
          <ol class="rewards-dlg__rules">${t}</ol>
        </section>
        <section class="rewards-dlg__section" data-ref="mine" aria-labelledby="rewards-mine-title" hidden>
          <h3 id="rewards-mine-title" class="rewards-dlg__label">Video bạn đã gửi</h3>
          <ul class="rewards-dlg__items" data-ref="items"></ul>
        </section>
        <form class="rewards-dlg__form" data-ref="form" novalidate>
          <h3 id="rewards-form-title" class="rewards-dlg__label" tabindex="-1">Gửi video</h3>
          <div class="rewards-dlg__field">
            <label class="rewards-dlg__label" for="rewards-url">Đường dẫn video</label>
            <input id="rewards-url" class="rewards-dlg__input" data-ref="url" type="url" inputmode="url" maxlength="${L.urlMax}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://www.tiktok.com/@ban/video/..." aria-describedby="rewards-platform" />
            <p id="rewards-platform" class="rewards-dlg__hint" data-ref="platform" aria-live="polite"></p>
          </div>
          <div class="rewards-dlg__field">
            <label class="rewards-dlg__label" for="rewards-name">Tên hiển thị</label>
            <input id="rewards-name" class="rewards-dlg__input" data-ref="name" type="text" maxlength="${L.displayNameMax}" autocomplete="nickname" placeholder="Tên kênh hoặc tên bạn muốn được gọi" />
          </div>
          <div class="rewards-dlg__field">
            <label class="rewards-dlg__label" for="rewards-contact">Email hoặc Zalo <span class="rewards-dlg__optional">(không bắt buộc)</span></label>
            <input id="rewards-contact" class="rewards-dlg__input" data-ref="contact" type="text" maxlength="${L.contactMax}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="rewards-privacy" />
            <p id="rewards-privacy" class="rewards-dlg__hint">${qe}</p>
          </div>
          <div class="rewards-dlg__trap" aria-hidden="true">
            <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off" data-ref="trap" /></label>
          </div>
          <p class="rewards-dlg__error" role="alert" data-ref="error"></p>
          <p class="rewards-dlg__ok" role="status" data-ref="ok"></p>
          <button type="submit" class="btn btn--gold" data-ref="send">Gửi video</button>
        </form>
        <section class="rewards-dlg__section rewards-dlg__ref" aria-labelledby="rewards-ref-title">
          <h3 id="rewards-ref-title" class="rewards-dlg__label" tabindex="-1">Rủ bạn vào chùa</h3>
          <p class="rewards-dlg__intro">${Xe}</p>
          <p class="rewards-dlg__hint" data-ref="refMore">${Ze}</p>
          <div class="rewards-dlg__bar" data-ref="bar" role="progressbar" aria-valuemin="0" aria-labelledby="rewards-ref-text"><span data-ref="barFill"></span></div>
          <p id="rewards-ref-text" class="rewards-dlg__progress" data-ref="refText"></p>
          <p class="rewards-dlg__unlocked" data-ref="refBadge" hidden>${Qe}</p>
          <div class="rewards-dlg__share">
            <input class="rewards-dlg__input" data-ref="shareUrl" type="text" readonly aria-label="Đường dẫn mời của bạn" />
            <button type="button" class="btn btn--ghost" data-ref="copy">${i(`copy`, { size: 18 })}<span>Chép</span></button>
          </div>
          <p class="rewards-dlg__hint" role="status" data-ref="copyStatus"></p>
        </section>
      </div>
      <footer class="rewards-dlg__foot">
        <button type="button" class="btn btn--ghost" data-ref="cancel">Đóng</button>
      </footer>
    </div>`;
}
function it(e) {
  let t = Date.parse(e);
  if (!Number.isFinite(t)) return ``;
  try {
    return new Date(t).toLocaleDateString(`vi-VN`);
  } catch {
    return ``;
  }
}
function at(e) {
  let t = document.createElement(`li`);
  ((t.className = `rewards-dlg__item`), (t.dataset.status = e.status));
  let n = document.createElement(`div`);
  n.className = `rewards-dlg__item-head`;
  let r = document.createElement(`span`);
  ((r.className = `rewards-dlg__chip`), (r.textContent = ae[e.status]));
  let i = document.createElement(`span`);
  ((i.className = `rewards-dlg__item-meta`),
    (i.textContent = [N[e.platform], it(e.createdAt)].filter((e) => e !== ``).join(` · `)),
    n.append(r, i));
  let a = /^https:\/\//.test(e.url),
    o = document.createElement(a ? `a` : `span`);
  if (
    ((o.className = `rewards-dlg__item-url`),
    o instanceof HTMLAnchorElement &&
      ((o.href = e.url), (o.target = `_blank`), (o.rel = `noopener noreferrer`)),
    (o.textContent = e.url.replace(/^https:\/\//, ``)),
    t.append(n, o),
    e.note !== null)
  ) {
    let n = document.createElement(`p`);
    ((n.className = `rewards-dlg__note`), (n.textContent = `Lời nhắn của Ben: ${e.note}`), t.append(n));
  }
  return t;
}
function ot(e = {}) {
  $?.isConnected && v($);
  let t = e.opener,
    n = t === void 0 ? (document.activeElement instanceof HTMLElement ? document.activeElement : null) : t,
    r = () => (typeof n == `function` ? n() : n),
    i = e.rewards ?? X(),
    a =
      e.copyText ??
      ((e) =>
        typeof navigator < `u` && navigator.clipboard
          ? navigator.clipboard.writeText(e)
          : Promise.reject(Error(`không có clipboard`))),
    o = document.createElement(`dialog`);
  ((o.className = `rewards-dlg`),
    o.setAttribute(`aria-labelledby`, `rewards-title`),
    o.setAttribute(`aria-describedby`, `rewards-intro`),
    (o.innerHTML = rt()));
  let s = (e) => o.querySelector(`[data-ref="${e}"]`),
    c = s(`form`),
    l = s(`url`),
    u = s(`name`),
    d = s(`contact`),
    f = s(`trap`),
    p = s(`platform`),
    m = s(`error`),
    h = s(`ok`),
    g = s(`send`),
    ee = s(`badge`),
    te = s(`mine`),
    x = s(`items`),
    S = s(`bar`),
    C = s(`barFill`),
    w = s(`refText`),
    ne = s(`refBadge`),
    T = s(`shareUrl`),
    E = s(`copyStatus`),
    D = !1,
    O = !1,
    k = () => {
      D || v(o);
    },
    A = () => {
      let e = l.value.trim(),
        t = ue(e);
      ((p.textContent =
        e === ``
          ? `Dán đường dẫn video TikTok, YouTube, Facebook hoặc Instagram.`
          : t === null
            ? `Chưa nhận ra nền tảng: chùa nhận TikTok, YouTube, Facebook, Instagram.`
            : `Nền tảng: ${N[t]}`),
        (p.dataset.platform = t ?? ``));
    };
  A();
  let j = (e) => {
    if (D) return;
    ((ee.hidden = !e.kol.badge),
      (te.hidden = e.kol.items.length === 0),
      x.replaceChildren(...e.kol.items.map(at)));
    let t = Math.max(e.ref.goal, q),
      n = Math.max(0, Math.min(e.ref.count, t));
    (S.setAttribute(`aria-valuemax`, String(t)),
      S.setAttribute(`aria-valuenow`, String(n)),
      (C.style.width = `${Math.round((n / t) * 100)}%`),
      (w.textContent = W(e.ref.count, t)),
      (ne.hidden = !e.ref.badge));
  };
  j(i.snapshot());
  let re = i.subscribe(j);
  i.refresh({ force: !0 }).catch(() => void 0);
  let M = i.snapshot().ref.code;
  ((T.value = M === null ? `` : `${location.origin}/?ref=${M}`),
    (T.placeholder = `Bấm "Chép" để tạo đường dẫn mời`),
    s(`copy`).addEventListener(`click`, () => {
      let e = i.shareUrl(location.origin);
      ((T.value = e),
        a(e).then(
          () => {
            D || (E.textContent = $e);
          },
          () => {
            D || ((E.textContent = et), T.focus({ preventScroll: !0 }), T.select());
          },
        ));
    }));
  let P = (e) => {
    ((O = e),
      c.setAttribute(`aria-busy`, String(e)),
      g.setAttribute(`aria-disabled`, String(e)),
      (g.textContent = e ? `Đang gửi…` : `Gửi video`));
    for (let t of [l, u, d]) t.disabled = e;
  };
  async function F() {
    if (O) return;
    ((m.textContent = ``), (h.textContent = ``), P(!0));
    let e = await i.submitKol({
      url: l.value.normalize(`NFC`),
      displayName: u.value.normalize(`NFC`),
      contact: d.value.normalize(`NFC`),
      website: f.value,
    });
    D ||
      (P(!1),
      e.ok
        ? ((h.textContent = e.already ? Ye : Je), (l.value = ``), A(), g.focus({ preventScroll: !0 }))
        : ((m.textContent = e.message), l.focus({ preventScroll: !0 })));
  }
  if (
    (l.addEventListener(`input`, A),
    c.addEventListener(`submit`, (e) => {
      (e.preventDefault(), F());
    }),
    s(`close`).addEventListener(`click`, k),
    s(`cancel`).addEventListener(`click`, k),
    o.addEventListener(`keydown`, (e) => {
      if (e.key === `Escape` && !e.isComposing) (e.preventDefault(), k());
      else if (e.key === `Tab`) {
        let t = Array.from(o.querySelectorAll(tt)).filter(
            (e) => !e.closest(`[hidden]`) && !e.closest(`[aria-hidden="true"]`),
          ),
          n = t[0],
          r = t[t.length - 1];
        if (!n || !r) return;
        let i = document.activeElement,
          a = !o.contains(i);
        e.shiftKey && (i === n || a)
          ? (e.preventDefault(), r.focus())
          : !e.shiftKey && (i === r || a) && (e.preventDefault(), n.focus());
      }
    }),
    o.addEventListener(`close`, () => {
      ((D = !0), re(), o.remove(), $ === o && ($ = null));
      let e = r();
      e?.isConnected && e.focus({ preventScroll: !0 });
    }),
    b(o),
    ($ = o),
    document.body.append(o),
    y(o),
    o.isConnected)
  ) {
    let t =
        e.focus === `ref`
          ? `#rewards-ref-title`
          : e.focus === `kol`
            ? `#rewards-form-title`
            : `#rewards-title`,
      n = o.querySelector(t),
      r = o.querySelector(`.rewards-dlg__body`);
    (e.focus !== void 0 && n && r && _(r, n), n?.focus({ preventScroll: !0 }));
  }
  return { element: o, close: k };
}
var st = e({ showKolAnnounce: () => ut }),
  ct = `Loa chùa · Chương trình KOL`,
  lt = `Bạn làm video về Chùa Sen? Thêm hashtag ${I} vào mô tả. Video từ ${F.toLocaleString(`vi-VN`)} lượt xem nhận danh hiệu riêng "${n}", hào quang vàng và bộ "${Z}".`;
function ut(e) {
  let t = !1,
    n = () => {
      t || ((t = !0), clearTimeout(r), e.show(null));
    };
  (l(`kol_announce`, { action: `shown` }),
    e.show(
      `${ct}\n${lt}`,
      [
        {
          label: `Xem thể lệ`,
          run: () => {
            (n(), e.open());
          },
        },
        {
          label: `Để sau`,
          run: () => {
            (l(`kol_announce`, { action: `dismiss` }), n());
          },
        },
      ],
      `kol`,
    ));
  let r = setTimeout(() => {
    t || (l(`kol_announce`, { action: `timeout` }), n());
  }, e.ms ?? 2e4);
  return n;
}
export { Be as n, ge as r, st as t };
