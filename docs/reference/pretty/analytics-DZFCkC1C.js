import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
var t = (function (e) {
    return (
      (e.AnonymousId = `anonymous_id`),
      (e.DistinctId = `distinct_id`),
      (e.Props = `props`),
      (e.EnablePersonProcessing = `enable_person_processing`),
      (e.PersonMode = `person_mode`),
      (e.FeatureFlagDetails = `feature_flag_details`),
      (e.FeatureFlags = `feature_flags`),
      (e.FeatureFlagPayloads = `feature_flag_payloads`),
      (e.BootstrapFeatureFlagDetails = `bootstrap_feature_flag_details`),
      (e.BootstrapFeatureFlags = `bootstrap_feature_flags`),
      (e.BootstrapFeatureFlagPayloads = `bootstrap_feature_flag_payloads`),
      (e.OverrideFeatureFlags = `override_feature_flags`),
      (e.Queue = `queue`),
      (e.AiQueue = `ai_queue`),
      (e.AiCaptureQueue = `ai_capture_queue`),
      (e.LogsQueue = `logs_queue`),
      (e.OptedOut = `opted_out`),
      (e.SessionId = `session_id`),
      (e.SessionStartTimestamp = `session_start_timestamp`),
      (e.SessionLastTimestamp = `session_timestamp`),
      (e.PersonProperties = `person_properties`),
      (e.GroupProperties = `group_properties`),
      (e.InstalledAppBuild = `installed_app_build`),
      (e.InstalledAppVersion = `installed_app_version`),
      (e.SessionReplay = `session_replay`),
      (e.PushRegistered = `push_registered`),
      (e.SessionReplayEventTriggerActivatedSession = `session_replay_event_trigger_activated_session`),
      (e.SurveyLastSeenDate = `survey_last_seen_date`),
      (e.SurveysInProgress = `surveys_in_progress`),
      (e.SurveysSeen = `surveys_seen`),
      (e.Surveys = `surveys`),
      (e.RemoteConfig = `remote_config`),
      (e.FlagsEndpointWasHit = `flags_endpoint_was_hit`),
      (e.DeviceId = `device_id`),
      e
    );
  })({}),
  n = (function (e) {
    return ((e.GZipJS = `gzip-js`), (e.Base64 = `base64`), e);
  })({}),
  r = {
    ERRORS_WHILE_COMPUTING: `errors_while_computing_flags`,
    FLAG_MISSING: `flag_missing`,
    LOCAL_EVALUATION_INCONCLUSIVE: `local_evaluation_inconclusive`,
    QUOTA_LIMITED: `quota_limited`,
    TIMEOUT: `timeout`,
    CONNECTION_ERROR: `connection_error`,
    UNKNOWN_ERROR: `unknown_error`,
    apiError: (e) => `api_error_${e}`,
  };
function i(e, t) {
  return e.indexOf(t) !== -1;
}
function a(e) {
  let t = [];
  return (
    JSON.stringify(e, function (e, n) {
      if (typeof n == `bigint`) return n.toString();
      if (typeof n != `function` && typeof n != `symbol`) {
        if (n instanceof Error) return { name: n.name, message: n.message, stack: n.stack };
        if (n && typeof n == `object`) {
          for (; t.length > 0 && t[t.length - 1] !== this;) t.pop();
          if (t.includes(n)) return `[Circular]`;
          t.push(n);
        }
        return n;
      }
    }) ?? `null`
  );
}
function o(e) {
  return typeof e != `object` || !e
    ? e
    : Array.isArray(e)
      ? e.map(o)
      : Object.keys(e)
          .sort()
          .reduce((t, n) => ((t[n] = o(e[n])), t), {});
}
function s(e, t, n) {
  return JSON.stringify({
    distinct_id: e,
    userPropertiesToSet: t ? o(t) : void 0,
    userPropertiesToSetOnce: n ? o(n) : void 0,
  });
}
var c = Array.isArray,
  l = Object.prototype,
  u = l.hasOwnProperty,
  d = l.toString,
  f =
    c ||
    function (e) {
      return d.call(e) === `[object Array]`;
    },
  p = (e) => e === Object(e) && !f(e),
  m = (e) => {
    if (p(e)) {
      for (let t in e) if (u.call(e, t)) return !1;
      return !0;
    }
    return !1;
  },
  h = (e) => e === void 0,
  g = (e) => d.call(e) == `[object String]`,
  _ = (e) => g(e) && e.trim().length === 0,
  ee = (e) => e === null,
  te = (e) => h(e) || ee(e);
function ne(e) {
  return typeof e != `object` || !e;
}
function v(e) {
  switch (Object.prototype.toString.call(e)) {
    case `[object Error]`:
    case `[object Exception]`:
    case `[object DOMException]`:
    case `[object DOMError]`:
    case `[object WebAssembly.Exception]`:
      return !0;
    default:
      return ie(e, Error);
  }
}
function re(e) {
  return `u` > typeof Event && ie(e, Event);
}
function ie(e, t) {
  try {
    return e instanceof t;
  } catch {
    return !1;
  }
}
var y = `0123456789abcdef`,
  ae = class e {
    constructor(e) {
      this.bytes = e;
    }
    static ofInner(t) {
      if (t.length === 16) return new e(t);
      throw TypeError(`not 128-bit length`);
    }
    static fromFieldsV7(t, n, r, i) {
      if (
        !Number.isInteger(t) ||
        !Number.isInteger(n) ||
        !Number.isInteger(r) ||
        !Number.isInteger(i) ||
        t < 0 ||
        n < 0 ||
        r < 0 ||
        i < 0 ||
        t > 0xffffffffffff ||
        n > 4095 ||
        r > 1073741823 ||
        i > 4294967295
      )
        throw RangeError(`invalid field value`);
      let a = new Uint8Array(16);
      return (
        (a[0] = t / 2 ** 40),
        (a[1] = t / 2 ** 32),
        (a[2] = t / 2 ** 24),
        (a[3] = t / 2 ** 16),
        (a[4] = t / 256),
        (a[5] = t),
        (a[6] = 112 | (n >>> 8)),
        (a[7] = n),
        (a[8] = 128 | (r >>> 24)),
        (a[9] = r >>> 16),
        (a[10] = r >>> 8),
        (a[11] = r),
        (a[12] = i >>> 24),
        (a[13] = i >>> 16),
        (a[14] = i >>> 8),
        (a[15] = i),
        new e(a)
      );
    }
    static parse(t) {
      let n;
      switch (t.length) {
        case 32:
          n = /^[0-9a-f]{32}$/i.exec(t)?.[0];
          break;
        case 36:
          n = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
            .exec(t)
            ?.slice(1, 6)
            .join(``);
          break;
        case 38:
          n = /^\{([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}$/i
            .exec(t)
            ?.slice(1, 6)
            .join(``);
          break;
        case 45:
          n = /^urn:uuid:([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
            .exec(t)
            ?.slice(1, 6)
            .join(``);
      }
      if (n) {
        let t = new Uint8Array(16);
        for (let e = 0; e < 16; e += 4) {
          let r = parseInt(n.substring(2 * e, 2 * e + 8), 16);
          ((t[e + 0] = r >>> 24), (t[e + 1] = r >>> 16), (t[e + 2] = r >>> 8), (t[e + 3] = r));
        }
        return new e(t);
      }
      throw SyntaxError(`could not parse UUID string`);
    }
    toString() {
      let e = ``;
      for (let t = 0; t < this.bytes.length; t++)
        ((e += y.charAt(this.bytes[t] >>> 4)),
          (e += y.charAt(15 & this.bytes[t])),
          (t === 3 || t === 5 || t === 7 || t === 9) && (e += `-`));
      return e;
    }
    toHex() {
      let e = ``;
      for (let t = 0; t < this.bytes.length; t++)
        ((e += y.charAt(this.bytes[t] >>> 4)), (e += y.charAt(15 & this.bytes[t])));
      return e;
    }
    toJSON() {
      return this.toString();
    }
    getVariant() {
      let e = this.bytes[8] >>> 4;
      if (e < 0) throw Error(`unreachable`);
      if (e <= 7) return this.bytes.every((e) => e === 0) ? `NIL` : `VAR_0`;
      if (e <= 11) return `VAR_10`;
      if (e <= 13) return `VAR_110`;
      if (e <= 15) return this.bytes.every((e) => e === 255) ? `MAX` : `VAR_RESERVED`;
      throw Error(`unreachable`);
    }
    getVersion() {
      return this.getVariant() === `VAR_10` ? this.bytes[6] >>> 4 : void 0;
    }
    clone() {
      return new e(this.bytes.slice(0));
    }
    equals(e) {
      return this.compareTo(e) === 0;
    }
    compareTo(e) {
      for (let t = 0; t < 16; t++) {
        let n = this.bytes[t] - e.bytes[t];
        if (n !== 0) return Math.sign(n);
      }
      return 0;
    }
  },
  oe = class {
    constructor(e) {
      ((this.timestamp = 0), (this.counter = 0), (this.random = e ?? se()));
    }
    generate() {
      return this.generateOrResetCore(Date.now(), 1e4);
    }
    generateOrAbort() {
      return this.generateOrAbortCore(Date.now(), 1e4);
    }
    generateOrResetCore(e, t) {
      let n = this.generateOrAbortCore(e, t);
      return (n === void 0 && ((this.timestamp = 0), (n = this.generateOrAbortCore(e, t))), n);
    }
    generateOrAbortCore(e, t) {
      if (!Number.isInteger(e) || e < 1 || e > 0xffffffffffff)
        throw RangeError("`unixTsMs` must be a 48-bit positive integer");
      if (t < 0 || t > 0xffffffffffff) throw RangeError("`rollbackAllowance` out of reasonable range");
      if (e > this.timestamp) ((this.timestamp = e), this.resetCounter());
      else {
        if (!(e + t >= this.timestamp)) return;
        (this.counter++, this.counter > 4398046511103 && (this.timestamp++, this.resetCounter()));
      }
      return ae.fromFieldsV7(
        this.timestamp,
        Math.trunc(this.counter / 2 ** 30),
        this.counter & (2 ** 30 - 1),
        this.random.nextUint32(),
      );
    }
    resetCounter() {
      this.counter = 1024 * this.random.nextUint32() + (1023 & this.random.nextUint32());
    }
    generateV4() {
      let e = new Uint8Array(
        Uint32Array.of(
          this.random.nextUint32(),
          this.random.nextUint32(),
          this.random.nextUint32(),
          this.random.nextUint32(),
        ).buffer,
      );
      return ((e[6] = 64 | (e[6] >>> 4)), (e[8] = 128 | (e[8] >>> 2)), ae.ofInner(e));
    }
  },
  se = () => ({
    nextUint32: () => (65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random())) >>> 0,
  }),
  ce,
  b = () => le().toString(),
  le = () => (ce ||= new oe()).generate(),
  ue = class {
    add(e) {
      let t = b(),
        n = ++this.nextId;
      return (
        (this.promiseByIds[t] = { id: n, promise: e }),
        e
          .catch(() => {})
          .finally(() => {
            delete this.promiseByIds[t];
          }),
        e
      );
    }
    async join() {
      let e = Object.values(this.promiseByIds).map((e) => e.promise),
        t = e.length;
      for (; t > 0;)
        (await Promise.all(e), (e = Object.values(this.promiseByIds).map((e) => e.promise)), (t = e.length));
    }
    getPromises(e = [], t = this.nextId) {
      let n = new Set(e);
      return Object.values(this.promiseByIds)
        .filter((e) => e.id <= t && !n.has(e.promise))
        .map((e) => e.promise);
    }
    get maxId() {
      return this.nextId;
    }
    get length() {
      return Object.keys(this.promiseByIds).length;
    }
    constructor() {
      ((this.promiseByIds = {}), (this.nextId = 0));
    }
  };
function de(e = console) {
  return { log: e.log.bind(e), warn: e.warn.bind(e), error: e.error.bind(e), debug: e.debug.bind(e) };
}
var fe = (e, t, n) => {
    function r(r, ...i) {
      t(() => {
        let t = n[r];
        t(e, ...i);
      });
    }
    return {
      debug: (...e) => {
        r(`debug`, ...e);
      },
      info: (...e) => {
        r(`log`, ...e);
      },
      warn: (...e) => {
        r(`warn`, ...e);
      },
      error: (...e) => {
        r(`error`, ...e);
      },
      critical: (...t) => {
        n.error(e, ...t);
      },
      createLogger: (r) => fe(`${e} ${r}`, t, n),
    };
  },
  pe = (e) => e();
function me(e, t = pe) {
  return fe(e, t, de());
}
var he = `Mobile`,
  ge = `Android`,
  _e = `Tablet`,
  ve = `Apple`,
  x = `Safari`,
  ye = `BlackBerry`,
  be = `SamsungBrowser`,
  xe = `Samsung Internet`,
  S = `Chrome`,
  Se = `Chrome iOS`,
  Ce = `Internet Explorer`,
  we = `Internet Explorer Mobile`,
  Te = `Opera`,
  Ee = `Opera Mini`,
  De = `Edge`,
  Oe = `Microsoft Edge`,
  C = `Firefox`,
  ke = `Firefox iOS`,
  Ae = `Nintendo`,
  je = `PlayStation`,
  Me = `Xbox`,
  Ne = `Android Mobile`,
  Pe = `Mobile Safari`,
  Fe = `Windows`;
(`` + he.toLowerCase(), `` + _e.toLowerCase());
var w = `Konqueror`,
  Ie = `Oculus Browser`,
  Le = `Vivaldi`,
  Re = `Yandex`,
  ze = `Whale`,
  Be = `DuckDuckGo`,
  Ve = `Pale Moon`,
  He = `Waterfox`,
  T = `Brave`,
  Ue = `Claude`,
  We = `Codex`,
  Ge = `ChatGPT`,
  Ke = `Google Search App`,
  E = RegExp(`Version/(\\d+(\\.\\d+)?)`),
  D = RegExp(`(Claude|Codex|ChatGPT)\\/(\\d+(\\.\\d+)?)`);
function qe(e) {
  return e?.brave ? T : null;
}
new RegExp(Me, `i`);
var Je = RegExp(`BlackBerry|PlayBook|BB10`, `i`);
function Ye(e) {
  return i(e, x) && !i(e, S) && !i(e, ge);
}
var Xe = (e, t) => (t && i(t, ve)) || Ye(e),
  Ze = function (e, t, n, r) {
    return (
      (t ||= ``),
      qe(n) ||
        (r?.detectGoogleSearchApp && i(e, `GSA/`)
          ? Ke
          : i(e, ` OPR/`) && i(e, `Mini`)
            ? Ee
            : i(e, ` OPR/`)
              ? Te
              : Je.test(e)
                ? ye
                : i(e, `IEMobile`) || i(e, `WPDesktop`)
                  ? we
                  : i(e, `OculusBrowser`)
                    ? Ie
                    : i(e, be)
                      ? xe
                      : i(e, De) || i(e, `Edg/`)
                        ? Oe
                        : i(e, `Vivaldi/`)
                          ? Le
                          : i(e, `YaBrowser/`)
                            ? Re
                            : i(e, `Whale/`)
                              ? ze
                              : i(e, `DuckDuckGo/`) || i(e, `Ddg/`)
                                ? Be
                                : i(e, `Claude/`)
                                  ? Ue
                                  : i(e, `Codex/`)
                                    ? We
                                    : i(e, `ChatGPT/`)
                                      ? Ge
                                      : i(e, `FBIOS`)
                                        ? `Facebook Mobile`
                                        : i(e, `UCWEB`) || i(e, `UCBrowser`)
                                          ? `UC Browser`
                                          : i(e, `CriOS`)
                                            ? Se
                                            : i(e, `CrMo`) || i(e, S)
                                              ? S
                                              : i(e, ge) && i(e, x)
                                                ? Ne
                                                : i(e, `FxiOS`)
                                                  ? ke
                                                  : i(e.toLowerCase(), w.toLowerCase())
                                                    ? w
                                                    : i(e, `Brave/`)
                                                      ? T
                                                      : Xe(e, t)
                                                        ? i(e, he)
                                                          ? Pe
                                                          : x
                                                        : i(e, `PaleMoon/`)
                                                          ? Ve
                                                          : i(e, `Waterfox/`)
                                                            ? He
                                                            : i(e, C)
                                                              ? C
                                                              : i(e, `MSIE`) || i(e, `Trident/`)
                                                                ? Ce
                                                                : i(e, `Gecko`)
                                                                  ? C
                                                                  : ``)
    );
  },
  Qe = {
    [we]: [RegExp(`rv:(\\d+(\\.\\d+)?)`)],
    [Oe]: [RegExp(`Edge?\\/(\\d+(\\.\\d+)?)`)],
    [S]: [RegExp(`(Chrome|CrMo)\\/(\\d+(\\.\\d+)?)`)],
    [Se]: [RegExp(`CriOS\\/(\\d+(\\.\\d+)?)`)],
    "UC Browser": [RegExp(`(UCBrowser|UCWEB)\\/(\\d+(\\.\\d+)?)`)],
    [x]: [E],
    [Pe]: [E],
    [Te]: [RegExp(`(Opera|OPR)\\/(\\d+(\\.\\d+)?)`)],
    [C]: [RegExp(`Firefox\\/(\\d+(\\.\\d+)?)`)],
    [ke]: [RegExp(`FxiOS\\/(\\d+(\\.\\d+)?)`)],
    [w]: [RegExp(`Konqueror[:/]?(\\d+(\\.\\d+)?)`, `i`)],
    [ye]: [RegExp(`BlackBerry (\\d+(\\.\\d+)?)`), E],
    [Ne]: [RegExp(`android\\s(\\d+(\\.\\d+)?)`, `i`)],
    [xe]: [RegExp(`SamsungBrowser\\/(\\d+(\\.\\d+)?)`)],
    [Ie]: [RegExp(`OculusBrowser\\/(\\d+(\\.\\d+)?)`)],
    [Le]: [RegExp(`Vivaldi\\/(\\d+(\\.\\d+)?)`)],
    [Re]: [RegExp(`YaBrowser\\/(\\d+(\\.\\d+)?)`)],
    [ze]: [RegExp(`Whale\\/(\\d+(\\.\\d+)?)`)],
    [T]: [RegExp(`Brave\\/(\\d+(\\.\\d+)?)`)],
    [Ue]: [D],
    [We]: [D],
    [Ge]: [D],
    [Be]: [RegExp(`(DuckDuckGo|Ddg)\\/(\\d+(\\.\\d+)?)`)],
    [Ve]: [RegExp(`PaleMoon\\/(\\d+(\\.\\d+)?)`)],
    [He]: [RegExp(`Waterfox\\/(\\d+(\\.\\d+)?)`)],
    [Ke]: [RegExp(`GSA\\/(\\d+(\\.\\d+)?)`)],
    [Ce]: [RegExp(`(rv:|MSIE )(\\d+(\\.\\d+)?)`)],
    Mozilla: [RegExp(`rv:(\\d+(\\.\\d+)?)`)],
  },
  $e = function (e, t, n, r) {
    let i = Qe[Ze(e, t, n, r)];
    if (h(i)) return null;
    for (let t = 0; t < i.length; t++) {
      let n = i[t],
        r = e.match(n);
      if (r) return parseFloat(r[r.length - 2]);
    }
    return null;
  };
(new RegExp(Ae, `i`), new RegExp(je, `i`), new RegExp(Fe, `i`));
var O = /\bFBAV\/(\d+(?:\.\d+)*)/i,
  et = [
    [/\bInstagram(?:[ /](\d+(?:\.\d+)*))?\b/i, `Instagram`],
    [/\bBarcelona[ /](\d+(?:\.\d+)*)?/i, `Threads`],
    [/\b(?:MessengerForiOS|(?:FBAN|FB_IAB)\/Orca-Android)\b/i, `Messenger`, O],
    [/\bFBAN\/EMA\b/i, `Facebook Lite`, O],
    [/\b(?:FBIOS|(?:FBAN|FB_IAB)\/(?:FB4A|FBIOS))\b/i, `Facebook`, O],
    [/\bLinkedInApp(?:\]?\/(\d+(?:\.\d+)*))?\b/i, `LinkedIn`],
    [/\bTwitter(?:Android| for (?:iPhone|iPad|Android))(?:\/(\d+(?:\.\d+)*))?\b/i, `Twitter`],
    [
      /\b(?:musical_ly|trill)(?:[_/](\d+\.\d+(?:\.\d+)*))?(?=\b|_)/i,
      `TikTok`,
      /\bapp_version\/(\d+(?:\.\d+)*)/i,
    ],
    [/\b(?:MicroMessenger|WeChat)\/(\d+(?:\.\d+)*)?/i, `WeChat`],
    [/\bLine\/(\d+(?:\.\d+)*)?/i, `Line`],
    [/\bGSA\/(\d+(?:\.\d+)*)?/i, `Google`],
    [
      /\[Pinterest\/(?:iOS|Android)\b|\bPinterest(?: for (?:Android(?: Tablet)?|iOS))?\/(\d+(?:\.\d+)*)/i,
      `Pinterest`,
    ],
    [/\b(?:WA4A|WAiOS)\/(\d+(?:\.\d+)*)?/i, `WhatsApp`],
    [/\bSnapchat[ /](\d+(?:\.\d+)*)?/i, `Snapchat`],
    [/\bBing(?:Web|Sapphire)\/(\d+(?:\.\d+)*)?/i, `Bing`],
    [/\bNAVER\(inapp; search;/i, `Naver`, /\bNAVER\(inapp; search;[^;)]*; (\d+(?:\.\d+)*)/i],
    [/\bKAKAOTALK[ /](\d+\.\d+(?:\.\d+)*)?/i, `KakaoTalk`],
  ];
function tt(e) {
  for (let t = 0; t < et.length; t++) {
    let [n, r, i] = et[t],
      a = e.match(n);
    if (a) return [r, ((i && e.match(i)) || a)?.[1] || ``];
  }
  return [``, ``];
}
(Date.prototype.getTime, Date.prototype.toISOString);
var nt = 3e5;
function rt(e, t = Date.now(), n = nt) {
  if (typeof e != `string` || !e) return;
  let r = e.trim(),
    i = /^\d+\s*,/.test(r) ? r.slice(0, r.indexOf(`,`)).trim() : r;
  if (/^\d+$/.test(i)) {
    let e = 1e3 * Math.min(Number(i), n / 1e3);
    return e > 0 ? e : void 0;
  }
  if (!/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*[ ,]/.test(i)) return;
  let a = /^\w{3} \w{3} /.test(i) ? i + ` GMT` : i,
    o = Date.parse(a) - t;
  if (!(!Number.isFinite(o) || o <= 0)) return Math.min(o, n);
}
var it = `utf8`,
  at = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function ot(e) {
  return typeof e == `string` && at.test(e);
}
function k(e, t) {
  return ot(e) ? e : t();
}
function A(e, t) {
  let n = Error(t);
  try {
    Object.defineProperty(n, "name", { value: e, writable: !0, enumerable: !0, configurable: !0 });
  } catch {}
  return n;
}
function st(e) {
  return e?.replace(/\/+$/, ``);
}
function ct(e) {
  return e && e.split(`#`)[0];
}
async function lt(e, t) {
  let n = null;
  for (let r = 0; r < t.retryCount + 1; r++) {
    r > 0 && (await new Promise((e) => setTimeout(e, t.retryDelay)));
    try {
      return await e();
    } catch (e) {
      if (((n = e), !t.retryCheck(e))) throw e;
    }
  }
  throw n;
}
function ut() {
  return new Date().getTime();
}
function dt() {
  return new Date().toISOString();
}
function j(e, t) {
  let n = setTimeout(e, t);
  return (n?.unref && n?.unref(), n);
}
async function ft(e, t, n) {
  let r;
  try {
    return await Promise.race([
      e,
      new Promise((e, i) => {
        r = j(() => {
          try {
            (n?.(), e());
          } catch (e) {
            i(e);
          }
        }, t);
      }),
    ]);
  } finally {
    clearTimeout(r);
  }
}
function pt() {
  return `u` > typeof fetch ? fetch : globalThis.fetch === void 0 ? void 0 : globalThis.fetch;
}
function mt(e) {
  return Promise.all(
    e.map((e) =>
      (e ?? Promise.resolve()).then(
        (e) => ({ status: `fulfilled`, value: e }),
        (e) => ({ status: `rejected`, reason: e }),
      ),
    ),
  );
}
var M, ht, gt, N;
function _t(e) {
  let t = globalThis._posthogChunkIds,
    n = globalThis._debugIds;
  if (!t && !n) return;
  let r = t ? Object.keys(t) : [],
    i = n ? Object.keys(n) : [];
  if (N && vt(t, r, ht) && vt(n, i, gt)) return N;
  ((ht = t ? { ...t } : void 0), (gt = n ? { ...n } : void 0), (N = {}), (M ??= {}));
  let a = (t, n) => {
    for (let r of t) {
      let t = n[r];
      if (!t) continue;
      let i = M?.[r];
      if (i) {
        N[i] = t;
        continue;
      }
      let a = e(r);
      for (let e = a.length - 1; e >= 0; e--) {
        let n = a[e]?.filename;
        if (n) {
          ((N[n] = t), (M[r] = n));
          break;
        }
      }
    }
  };
  return (n && a(i, n), t && a(r, t), N);
}
function vt(e, t, n) {
  return !e || !n ? e === n : t.length === Object.keys(n).length && t.every((t) => e[t] === n[t]);
}
var P = 50,
  yt = 1e3,
  bt = 100,
  xt = 4,
  St = class {
    constructor(e, t, n = []) {
      ((this.coercers = e), (this.stackParser = t), (this.modifiers = n));
    }
    buildFromUnknown(e, t = {}) {
      let n = (t && t.mechanism) || { handled: !0, type: `generic` },
        r = this.buildCoercingContext(n, t, 0).apply(e),
        i = this.buildParsingContext(t),
        a = this.parseStacktrace(r, i);
      return { $exception_list: this.convertToExceptionList(a, n), $exception_level: `error` };
    }
    async modifyFrames(e) {
      for (let t of e)
        t.stacktrace &&
          t.stacktrace.frames &&
          f(t.stacktrace.frames) &&
          (t.stacktrace.frames = await this.applyModifiers(t.stacktrace.frames));
      return e;
    }
    coerceFallback(e) {
      return { type: `Error`, value: `Unknown error`, stack: e.syntheticException?.stack, synthetic: !0 };
    }
    parseStacktrace(e, t) {
      let n;
      e.cause != null && (n = this.parseStacktrace(e.cause, t));
      let r;
      if (e.stack != `` && e.stack != null)
        try {
          r = this.applyChunkIds(this.stackParser(e.stack, e.synthetic ? t.skipFirstLines : 0), t.chunkIdMap);
        } catch {}
      return { ...e, cause: n, stack: r, errors: e.errors?.map((e) => this.parseStacktrace(e, t)) };
    }
    applyChunkIds(e, t) {
      return e.map((e) => (e.filename && t && (e.chunk_id = t[e.filename]), e));
    }
    applyCoercers(e, t) {
      for (let n of this.coercers) if (n.match(e)) return n.coerce(e, t);
      return this.coerceFallback(t);
    }
    async applyModifiers(e) {
      let t = e;
      for (let e of this.modifiers) t = await e(t);
      return t;
    }
    convertToExceptionList(e, t) {
      let n = [],
        r = (e, i, a) => {
          let o = n.length,
            s =
              i === void 0
                ? {
                    type: typeof t.type == `string` && t.type.length > 0 ? t.type : `generic`,
                    ...(typeof t.handled == `boolean`
                      ? { handled: t.handled }
                      : t.handled === void 0
                        ? { handled: !0 }
                        : {}),
                    synthetic: typeof t.synthetic == `boolean` ? t.synthetic : e.synthetic,
                    exception_id: o,
                  }
                : { type: `chained`, source: a, synthetic: e.synthetic, exception_id: o, parent_id: i },
            c = { type: e.type, value: e.value, mechanism: s };
          (e.stack && (c.stacktrace = { type: `raw`, frames: e.stack }),
            n.push(c),
            e.cause && r(e.cause, o, `cause`));
          for (let t of e.errors ?? []) r(t, o, `member`);
        };
      return (r(e), n);
    }
    buildParsingContext(e) {
      return { chunkIdMap: _t(this.stackParser), skipFirstLines: e.skipFirstLines ?? 1 };
    }
    getAggregateErrors(e) {
      try {
        if (v(e)) {
          let t = Object.getPrototypeOf(e);
          for (let n = 0; t && n < bt; n++) {
            let n = Object.getOwnPropertyDescriptor(t, `constructor`)?.value;
            if (typeof n == `function` && n.name === `AggregateError`) {
              let t = e.errors;
              return f(t) ? t : void 0;
            }
            t = Object.getPrototypeOf(t);
          }
        }
      } catch {}
    }
    buildCoercingContext(e, t, n = 0) {
      let r = 0,
        i = 0,
        a = !1,
        o = new Set(),
        s = [],
        c = {},
        l = (e, t, n = 0) => {
          let l = u(t, n),
            d = l.apply;
          if (
            ((l.apply = (t) => {
              s.push(e);
              try {
                return d(t);
              } finally {
                s.pop();
              }
            }),
            n > xt || (n > 0 && s.indexOf(e) !== -1))
          )
            return this.coerceFallback(l);
          let f = (typeof e == `object` && !!e) || typeof e == `function`;
          if ((n === 0 && r >= P) || (f && o.has(e))) return;
          (f && o.add(e), n === 0 && r++);
          let p = this.getAggregateErrors(e);
          a ||= !!p;
          let m;
          try {
            if (((m = this.applyCoercers(e, l)), !m)) throw c;
          } catch (e) {
            if (e === c) {
              n === 0 && r--;
              return;
            }
            if (!a) throw e;
            m = this.coerceFallback(l);
          }
          if (!p || r >= P) return m;
          let h;
          try {
            h = p.length;
          } catch {
            return m;
          }
          if (!Number.isInteger(h) || h < 0 || h > 4294967295) return m;
          let g = [];
          for (let e = 0; r < P && i < yt && e < h; e++) {
            i++;
            let n;
            try {
              n = l.next(p[e]);
            } catch {
              (r++, (n = this.coerceFallback(u(t + 1))));
            }
            n && g.push(n);
          }
          return { ...m, errors: g };
        },
        u = (n, r = 0) => ({
          ...t,
          syntheticException: n == 0 ? t.syntheticException : void 0,
          mechanism: n == 0 ? e : {},
          apply: (e) => {
            let t = l(e, n, r + 1);
            if (!t) throw c;
            return t;
          },
          next: (e) => l(e, n + 1),
        }),
        d = u(n);
      return { ...d, apply: (e) => l(e, n) ?? this.coerceFallback(d) };
    }
  },
  Ct = `<anonymous>`,
  wt = /^([a-z][a-z0-9.+-]+):/i,
  Tt = [`http`, `https`, `file`, `blob`, `app`, `capacitor`, `ionic`, `webpack`, `webpack-internal`, `ng`];
function Et(e) {
  if (!e || e === Ct) return !1;
  let t = wt.exec(e);
  return !t || Tt.includes(t[1].toLowerCase());
}
function F(e, t, n, r, i) {
  let a = { platform: e, filename: t, function: n === `<anonymous>` ? `?` : n, in_app: Et(t) };
  return (h(r) || (a.lineno = r), h(i) || (a.colno = i), a);
}
var Dt = (e, t) => {
    let n = e.indexOf(`safari-extension`) !== -1,
      r = e.indexOf(`safari-web-extension`) !== -1;
    return n || r
      ? [
          e.indexOf(`@`) === -1 ? `?` : e.split(`@`)[0],
          n ? `safari-extension:${t}` : `safari-web-extension:${t}`,
        ]
      : [e, t];
  },
  Ot = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
  kt =
    /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
  At = /\((\S*)(?::(\d+))(?::(\d+))\)/,
  jt = (e, t) => {
    let n = Ot.exec(e);
    if (n) {
      let [, e, r, i] = n;
      return F(t, e, `?`, +r, +i);
    }
    let r = kt.exec(e);
    if (r) {
      if (r[2] && r[2].indexOf(`eval`) === 0) {
        let e = At.exec(r[2]);
        e && ((r[2] = e[1]), (r[3] = e[2]), (r[4] = e[3]));
      }
      let [e, n] = Dt(r[1] || `?`, r[2]);
      return F(t, n, e, r[3] ? +r[3] : void 0, r[4] ? +r[4] : void 0);
    }
  },
  Mt =
    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
  Nt = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
  Pt = (e, t) => {
    let n = Mt.exec(e);
    if (n) {
      if (n[3] && n[3].indexOf(` > eval`) > -1) {
        let e = Nt.exec(n[3]);
        e && ((n[1] = n[1] || `eval`), (n[3] = e[1]), (n[4] = e[2]), (n[5] = ``));
      }
      let e = n[3],
        r = n[1] || `?`;
      return (([r, e] = Dt(r, e)), F(t, e, r, n[4] ? +n[4] : void 0, n[5] ? +n[5] : void 0));
    }
  },
  Ft = /\(error: (.*)\)/,
  It = 50,
  Lt = 10,
  Rt = 1e3;
function I(e, t) {
  return (
    e.filename === t.filename &&
    e.function === t.function &&
    e.module === t.module &&
    e.lineno === t.lineno &&
    e.colno === t.colno
  );
}
function zt(e) {
  for (let t = 1; t <= Lt; t++) {
    let n = e.length - 2 * t;
    if (n < 0) break;
    let r = !0;
    for (let i = 0; i < t; i++) {
      let a = e[n + i];
      if (!I(a, e[n + t + i])) {
        r = !1;
        break;
      }
    }
    if (r) {
      for (let r = 0; r < t; r++) e[n + r] = e[n + t + r];
      return ((e.length = n + t), { start: n, length: t });
    }
  }
}
function Bt(e, t) {
  let n = t.start + t.length,
    r = Ht(e, t);
  r && e.splice(n + r === e.length ? n : t.start, r);
}
function Vt(e, t) {
  let n = t.start;
  for (; n > 0 && I(e[n - 1], e[n - 1 + t.length]);) n--;
  return t.start - n;
}
function Ht(e, t) {
  let n = t.start + t.length,
    r = n;
  for (; r < e.length && I(e[r], e[r - t.length]);) r++;
  return r - n;
}
function Ut(e, t) {
  let n = t[0],
    r = e.length - (n ? Vt(e, n) : 0);
  for (let n of t) r -= Ht(e, n);
  return r;
}
function Wt(e) {
  let t = e.map((e) => `${e.function}|${e.filename}|${e.lineno}|${e.colno}|${e.module}`),
    n = 0;
  for (let e = 1; e < t.length; e++) Gt(t, e, n) && (n = e);
  e.push(...e.splice(0, n));
}
function Gt(e, t, n) {
  for (let r = 0; r < e.length; r++) {
    let i = e[(t + r) % e.length],
      a = e[(n + r) % e.length];
    if (i !== a) return i < a;
  }
  return !1;
}
function Kt(e) {
  if (!e.length) return [];
  let t = Array.from(e);
  return (
    t.reverse(),
    t.slice(0, It).map((e) => ({ ...e, filename: e.filename || qt(t).filename, function: e.function || `?` }))
  );
}
function qt(e) {
  return e[e.length - 1] || {};
}
function Jt() {
  return Yt(`web:javascript`, jt, Pt);
}
function Yt(e, ...t) {
  return (n, r = 0) => {
    let i = [],
      a = n.split(`
`),
      o = Math.min(a.length, r + Rt),
      s = [];
    for (let n = r; n < o; n++) {
      let r = a[n];
      if (r.length > 1024) continue;
      let o = Ft.test(r) ? r.replace(Ft, `$1`) : r;
      if (!o.match(/\S*Error: /)) {
        for (let n of t) {
          let t = n(o, e);
          if (t) {
            i.push(t);
            let e = zt(i);
            if (e) {
              for (let t = s.length - 1; t >= 0; t--) {
                let n = s[t];
                if (n.start + n.length <= e.start) break;
                s.pop();
              }
              s.push(e);
            }
            break;
          }
        }
        if (Ut(i, s) >= It) break;
      }
    }
    let c = [...s].sort((e, t) => t.start - e.start),
      l = c[c.length - 1];
    if (l) {
      let e = Vt(i, l);
      i.splice(l.start - e, e);
      for (let t of c) t.start -= e;
    }
    for (let e of c) Bt(i, e);
    return (s.some((e) => e.start === 0 && i.length === e.length) && Wt(i), Kt(i));
  };
}
var Xt = class {
    match(e) {
      return v(e);
    }
    coerce(e, t) {
      let n = this.getStack(e),
        r = n === void 0 ? t.syntheticException?.stack : void 0,
        i = !!r;
      return {
        type: this.getType(e),
        value: this.getMessage(e, t),
        stack: n ?? r,
        cause: e.cause ? t.next(e.cause) : void 0,
        synthetic: i,
      };
    }
    getType(e) {
      return e.name || e.constructor.name;
    }
    getMessage(e, t) {
      let n = e.message;
      return n.error && typeof n.error.message == `string` ? String(n.error.message) : String(n);
    }
    getStack(e) {
      try {
        let t = e.stacktrace;
        if (typeof t == `string` && t.length > 0) return t;
        let n = e.stack;
        return typeof n == `string` && n.length > 0 ? n : void 0;
      } catch {
        return;
      }
    }
  },
  Zt =
    /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i,
  Qt = class {
    match(e) {
      return typeof e == `string`;
    }
    coerce(e, t) {
      let [n, r] = this.getInfos(e);
      return { type: n ?? `Error`, value: r ?? e, stack: t.syntheticException?.stack, synthetic: !0 };
    }
    getInfos(e) {
      let t = `Error`,
        n = e,
        r = e.match(Zt);
      return (r && ((t = r[1]), (n = r[2])), [t, n]);
    }
  },
  $t = [`fatal`, `error`, `warning`, `log`, `info`, `debug`];
function en(e, t = 40) {
  let n = Object.keys(e);
  if ((n.sort(), !n.length)) return `[object has no keys]`;
  for (let e = n.length; e > 0; e--) {
    let r = n.slice(0, e).join(`, `);
    if (!(r.length > t)) return e === n.length || r.length <= t ? r : `${r.slice(0, t)}...`;
  }
  return ``;
}
var tn = class {
    match(e) {
      return typeof e == `object` && !!e;
    }
    coerce(e, t) {
      let n = this.getErrorPropertyFromObject(e);
      return n
        ? t.apply(n)
        : {
            type: this.getType(e),
            value: this.getValue(e),
            stack: this.getStack(e) ?? t.syntheticException?.stack,
            level: this.isSeverityLevel(e.level) ? e.level : `error`,
            synthetic: !0,
          };
    }
    getType(e) {
      if (re(e)) return e.constructor.name;
      let t = `name` in e ? e.name : void 0;
      return g(t) && !_(t) ? t : `Error`;
    }
    getValue(e) {
      if (`name` in e && typeof e.name == `string`) {
        let t = `'${e.name}' captured as exception`;
        return (`message` in e && typeof e.message == `string` && (t += ` with message: '${e.message}'`), t);
      }
      if (`message` in e && typeof e.message == `string`) return e.message;
      let t = this.getObjectClassName(e),
        n = en(e);
      return `${t && t !== `Object` ? `'${t}'` : `Object`} captured as exception with keys: ${n}`;
    }
    isSeverityLevel(e) {
      return g(e) && !_(e) && $t.indexOf(e) >= 0;
    }
    getStack(e) {
      try {
        return g(e.stacktrace) && e.stacktrace.length > 0
          ? e.stacktrace
          : g(e.stack) && e.stack.length > 0
            ? e.stack
            : void 0;
      } catch {
        return;
      }
    }
    getErrorPropertyFromObject(e) {
      for (let t in e)
        if (Object.prototype.hasOwnProperty.call(e, t)) {
          let n = e[t];
          if (v(n)) return n;
        }
    }
    getObjectClassName(e) {
      try {
        let t = Object.getPrototypeOf(e);
        return t ? t.constructor.name : void 0;
      } catch {
        return;
      }
    }
  },
  nn = class {
    match(e) {
      return ne(e);
    }
    coerce(e, t) {
      return {
        type: `Error`,
        value: `Primitive value captured as exception: ${String(e)}`,
        stack: t.syntheticException?.stack,
        synthetic: !0,
      };
    }
  },
  rn = { MESSAGE: `$message`, TIMESTAMP: `$timestamp` };
(rn.MESSAGE, rn.TIMESTAMP);
var L = (e) => {
  if (`flags` in e) {
    let t = R(e.flags),
      n = on(e.flags);
    return { ...e, featureFlags: t, featureFlagPayloads: n };
  }
  {
    let t = e.featureFlags ?? {},
      n = Object.fromEntries(Object.entries(e.featureFlagPayloads || {}).map(([e, t]) => [e, B(t)])),
      r = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, an(e, t, n[e])]));
    return { ...e, featureFlags: t, featureFlagPayloads: n, flags: r };
  }
};
function an(e, t, n) {
  return {
    key: e,
    enabled: typeof t == `string` || t,
    variant: typeof t == `string` ? t : void 0,
    reason: void 0,
    metadata: { id: void 0, version: void 0, payload: n ? JSON.stringify(n) : void 0, description: void 0 },
  };
}
var R = (e) =>
    Object.fromEntries(
      Object.entries(e ?? {})
        .map(([e, t]) => [e, z(t)])
        .filter(([, e]) => e !== void 0),
    ),
  on = (e) => {
    let t = e ?? {};
    return Object.fromEntries(
      Object.keys(t)
        .filter((e) => {
          let n = t[e];
          return n.enabled && n.metadata && n.metadata.payload !== void 0;
        })
        .map((e) => {
          let n = t[e].metadata?.payload;
          return [e, n ? B(n) : void 0];
        }),
    );
  },
  z = (e) => (e === void 0 ? void 0 : (e.variant ?? e.enabled)),
  B = (e) => {
    if (typeof e != `string`) return e;
    try {
      return JSON.parse(e);
    } catch {
      return e;
    }
  },
  sn = (e, t) =>
    L({
      featureFlags: [...new Set([...Object.keys(e ?? {}), ...Object.keys(t ?? {})])]
        .filter((n) => e?.[n] !== void 0 || !!t?.[n])
        .reduce((t, n) => ((t[n] = e?.[n] ?? !0), t), {}),
      featureFlagPayloads: t ?? {},
    }),
  cn = (e, t) => ({ ...e, enabled: V(t), variant: H(t) });
function V(e) {
  return typeof e == `string` || e;
}
function H(e) {
  return typeof e == `string` ? e : void 0;
}
var ln = (e) =>
    Object.values(e).map((e) => {
      let t = e.variant ?? e.enabled,
        n = e.metadata?.payload;
      return { key: e.key, enabled: V(t), variant: H(t), payload: n === void 0 ? null : B(n) };
    }),
  un = [
    `$feature_flag`,
    `$feature_flag_response`,
    `$feature_flag_has_experiment`,
    `$feature_flag_id`,
    `$feature_flag_version`,
    `$feature_flag_reason`,
    `$feature_flag_request_id`,
    `$feature_flag_evaluated_at`,
    `$feature_flag_error`,
    `locally_evaluated`,
    `$groups`,
    `$process_person_profile`,
    `$geoip_disable`,
    `$current_url`,
    `$pathname`,
    `$referring_domain`,
    ...`utm_source.utm_medium.utm_campaign.utm_content.utm_term.gad_source.mc_cid.gclid.gclsrc.dclid.gbraid.wbraid.fbclid.msclkid.twclid.li_fat_id.igshid.ttclid.rdt_cid.epik.qclid.sccid.oppref.bfcid.irclid._kx`.split(
      `.`,
    ),
    `$session_id`,
    `$window_id`,
    `$lib`,
    `$lib_version`,
    `$device_id`,
    `$is_server`,
  ],
  dn = (e, t = []) => {
    let n = {},
      r = (t) => {
        e[t] !== void 0 && (n[t] = e[t]);
      };
    return (un.forEach(r), t.forEach(r), n);
  },
  fn = class {
    constructor() {
      ((this.events = {}), (this.events = {}));
    }
    on(e, t) {
      return (
        this.events[e] || (this.events[e] = []),
        this.events[e].push(t),
        () => {
          this.events[e] = this.events[e].filter((e) => e !== t);
        }
      );
    }
    emit(e, t) {
      for (let n of this.events[e] || []) n(t);
      for (let n of this.events[`*`] || []) n(e, t);
    }
  };
function pn() {
  return (
    `CompressionStream` in globalThis &&
    `TextEncoder` in globalThis &&
    `Response` in globalThis &&
    typeof Response.prototype.blob == `function`
  );
}
var mn = `NativeGzipValidationError`,
  hn = 31,
  gn = 139,
  _n = 8,
  vn = (e) => e.length >= 2 && e[0] === hn && e[1] === gn,
  U,
  yn = () => {
    if (U) return U;
    U = [];
    for (let e = 0; e < 256; e++) {
      let t = e;
      for (let e = 0; e < 8; e++) t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
      U[e] = t >>> 0;
    }
    return U;
  },
  bn = (e) => {
    let t = yn(),
      n = 4294967295;
    for (let r = 0; r < e.length; r++) n = t[(n ^ e[r]) & 255] ^ (n >>> 8);
    return (4294967295 ^ n) >>> 0;
  },
  W = (e) => {
    throw A(mn, `Native gzip produced invalid output: ${e}`);
  },
  xn = async (e, t) => {
    e.size < 18 && W(`too-short`);
    let n = new Uint8Array(await e.slice(0, 10).arrayBuffer());
    (vn(n) && n[2] === _n) || W(`invalid-header`);
    let r = new DataView(await e.slice(e.size - 8).arrayBuffer());
    r.getUint32(0, !0) !== bn(t) && W(`invalid-crc`);
    let i = t.length >>> 0;
    r.getUint32(4, !0) !== i && W(`invalid-size`);
  };
async function Sn(e, t = !0, n) {
  try {
    let t = new TextEncoder().encode(e),
      n = new globalThis.CompressionStream(`gzip`),
      r = n.writable.getWriter(),
      i = r
        .write(t)
        .then(() => r.close())
        .catch(async (e) => {
          try {
            await r.abort(e);
          } catch {}
          throw e;
        }),
      a = new Response(n.readable).blob(),
      [o] = await Promise.all([a, i]);
    return (await xn(o, t), o);
  } catch (e) {
    if (n?.rethrow) throw e;
    return (t && console.error(`Failed to gzip compress data`, e), null);
  }
}
var G = class extends Error {
    constructor(e, t, n, r) {
      (super(`HTTP error while fetching PostHog: status=` + e.status + `, reqByteLength=` + t),
        (this.response = e),
        (this.reqByteLength = t),
        (this.responseBodyDeadline = n),
        (this.abortController = r),
        (this.name = `PostHogFetchHttpError`),
        (this._bodyReadTimedOut = !1));
    }
    get status() {
      return this.response.status;
    }
    get retryAfterMs() {
      try {
        return rt(this.response.headers?.get(`retry-after`));
      } catch {
        return;
      }
    }
    get bodyReadTimedOut() {
      return this._bodyReadTimedOut;
    }
    get text() {
      if (!this.responseBodyTextPromise) {
        if (Date.now() >= this.responseBodyDeadline) {
          this._bodyReadTimedOut = !0;
          let e = A(`AbortError`, `Response body read timed out`);
          (this.cancelResponseBody(e), (this.responseBodyTextPromise = Promise.reject(e)));
        } else {
          let e = new Promise((e, t) => {
              this.responseBodyTimer = j(() => {
                this._bodyReadTimedOut = !0;
                let e = A(`AbortError`, `Response body read timed out`);
                (t(e), this.cancelResponseBody(e));
              }, this.responseBodyDeadline - Date.now());
            }),
            t;
          try {
            t = Promise.resolve(this.response.text());
          } catch (e) {
            t = Promise.reject(e);
          }
          this.responseBodyTextPromise = Promise.race([t, e]).finally(() =>
            clearTimeout(this.responseBodyTimer),
          );
        }
      }
      return this.responseBodyTextPromise;
    }
    get json() {
      return this.text.then((e) => JSON.parse(e));
    }
    cancelResponseBody(e) {
      (clearTimeout(this.responseBodyTimer),
        this.abortController.signal.aborted || this.abortController.abort(e),
        (async () => {
          try {
            await this.response.body?.cancel();
          } catch {}
        })());
    }
  },
  K = class extends Error {
    constructor(e) {
      (super(`Network error while fetching PostHog`, e instanceof Error ? { cause: e } : {}),
        (this.error = e),
        (this.name = `PostHogFetchNetworkError`));
    }
  },
  q = (e, t) => (t === void 0 ? {} : { [e]: t }),
  Cn = (e, t) => {
    for (let n of Object.keys(t))
      (n.startsWith(`$feature/`) || n === `$active_feature_flags`) && (e[n] = t[n]);
  };
async function wn(e) {
  if (e instanceof G) {
    let t = ``;
    try {
      t = await e.text;
    } catch {
      e.bodyReadTimedOut && (t = `<response body read timed out>`);
    }
    console.error(`Error while flushing PostHog: message=${e.message}, response body=${t}`, e);
  } else console.error(`Error while flushing PostHog`, e);
  return Promise.resolve();
}
function Tn(e) {
  return typeof e == `object` && (e instanceof G || En(e));
}
function En(e) {
  return e instanceof K;
}
function Dn(e) {
  if (e instanceof G) return e.status === 502 || e.status === 504;
  if (!(e instanceof K)) return !1;
  let t = e.error;
  return (t?.code ?? t?.cause?.code) !== `ECONNREFUSED`;
}
var On = 10485760;
function kn(e) {
  try {
    return typeof e == `string`
      ? `u` > typeof Buffer
        ? Buffer.byteLength(e, it)
        : new TextEncoder().encode(e).length
      : e instanceof Uint8Array
        ? e.byteLength
        : e.size;
  } catch {
    return 0;
  }
}
function J(e) {
  return typeof e == `object` && e instanceof G && e.status === 413;
}
function Y(e) {
  return e instanceof G ? e.status === 408 || e.status === 429 || e.status >= 500 : En(e);
}
function An(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
var jn = (function (e) {
    return ((e.FeatureFlags = `feature_flags`), (e.Recordings = `recordings`), e);
  })({}),
  X = `default`,
  Mn = class {
    getErrorPropertiesBuilder() {
      return (
        (this._errorPropertiesBuilder ||= this.createErrorPropertiesBuilder()),
        this._errorPropertiesBuilder
      );
    }
    createErrorPropertiesBuilder() {
      return new St([new Xt(), new tn(), new Qt(), new nn()], Jt());
    }
    getEvaluationRuntime() {}
    get apiKey() {
      return this.projectToken;
    }
    constructor(e, t = {}) {
      ((this.flushPromise = null),
        (this.pendingFlushPromise = null),
        (this.flushPromises = new Set()),
        (this._dequeuedMessagesCount = 0),
        (this.shutdownPromise = null),
        (this.promiseQueue = new ue()),
        (this._events = new fn()),
        (this._isInitialized = !1));
      let n = typeof e == `string` ? e.trim() : ``,
        r = typeof t.host == `string` ? t.host.trim() : ``,
        i = !n;
      ((this._logger = me(`[PostHog]`, this.logMsgIfDebug.bind(this))),
        i && this._logger.error(`You must pass your PostHog project token. The client will be disabled.`),
        (this.projectToken = n),
        (this.host = st(r || `https://us.i.posthog.com`)),
        (this.flushAt = t.flushAt ? Math.max(t.flushAt, 1) : 20),
        (this.maxBatchSize = Math.max(this.flushAt, t.maxBatchSize ?? 100)),
        (this.maxQueueSize = Math.max(this.flushAt, t.maxQueueSize ?? 1e3)),
        (this.flushInterval = t.flushInterval ?? 1e4),
        (this.preloadFeatureFlags = t.preloadFeatureFlags ?? !0),
        (this.defaultOptIn = t.defaultOptIn ?? !0),
        (this.disableSurveys = t.disableSurveys ?? !1),
        (this._retryOptions = {
          retryCount: t.fetchRetryCount ?? 3,
          retryDelay: t.fetchRetryDelay ?? 3e3,
          retryCheck: Y,
        }),
        (this.requestTimeout = t.requestTimeout ?? 1e4),
        (this.featureFlagsRequestTimeoutMs = t.featureFlagsRequestTimeoutMs ?? 3e3),
        (this.featureFlagsRequestMaxRetries = t.featureFlagsRequestMaxRetries ?? 1),
        (this.remoteConfigRequestTimeoutMs = t.remoteConfigRequestTimeoutMs ?? 3e3),
        (this.disableGeoip = t.disableGeoip ?? !0),
        (this.disabled = (t.disabled ?? !1) || i),
        (this.historicalMigration = t?.historicalMigration ?? !1),
        (this._initPromise = Promise.resolve()),
        (this._isInitialized = !0),
        (this.evaluationContexts = t?.evaluationContexts ?? t?.evaluationEnvironments),
        t?.evaluationEnvironments &&
          !t?.evaluationContexts &&
          this._logger.warn(
            `evaluationEnvironments is deprecated. Use evaluationContexts instead. This property will be removed in a future version.`,
          ),
        (this.disableCompression = !pn() || (t?.disableCompression ?? !1)));
    }
    logMsgIfDebug(e) {
      this.isDebug && e();
    }
    wrap(e) {
      if (this.disabled) return void this._logger.warn(`The client is disabled`);
      if (this._isInitialized) return e();
      this._initPromise.then(() => e());
    }
    getCommonEventProperties() {
      return { $lib: this.getLibraryId(), $lib_version: this.getLibraryVersion() };
    }
    get optedOut() {
      return this.getPersistedProperty(t.OptedOut) ?? !this.defaultOptIn;
    }
    async optIn() {
      this.wrap(() => {
        this.setPersistedProperty(t.OptedOut, !1);
      });
    }
    async optOut() {
      this.wrap(() => {
        this.setPersistedProperty(t.OptedOut, !0);
      });
    }
    on(e, t) {
      return this._events.on(e, t);
    }
    debug(e = !0) {
      if ((this.removeDebugCallback?.(), e)) {
        let e = this.on(`*`, (e, t) => this._logger.info(e, t));
        this.removeDebugCallback = () => {
          (e(), (this.removeDebugCallback = void 0));
        };
      }
    }
    get isDebug() {
      return !!this.removeDebugCallback;
    }
    get isDisabled() {
      return this.disabled;
    }
    buildPayload(e) {
      let t = e.properties || {},
        n = this.mergeCommonEventProperties(t);
      return (
        Cn(n, t),
        e.event === `$feature_flag_called` &&
          !1 === n.$feature_flag_has_experiment &&
          this.isMinimalFlagCalledEventsEnabled() &&
          (n = dn(n)),
        { distinct_id: e.distinct_id, event: e.event, properties: n }
      );
    }
    mergeCommonEventProperties(e) {
      return { ...e, ...this.getCommonEventProperties() };
    }
    isMinimalFlagCalledEventsEnabled() {
      return !1;
    }
    addPendingPromise(e) {
      return this.promiseQueue.add(e);
    }
    identifyStateless(e, t, n) {
      this.wrap(() => {
        let r = { ...this.buildPayload({ distinct_id: e, event: `$identify`, properties: t }) };
        this.enqueue(`identify`, r, n);
      });
    }
    async identifyStatelessImmediate(e, t, n) {
      let r = { ...this.buildPayload({ distinct_id: e, event: `$identify`, properties: t }) };
      await this.sendImmediate(`identify`, r, n);
    }
    captureStateless(e, t, n, r) {
      this.wrap(() => {
        let i = this.buildPayload({ distinct_id: e, event: t, properties: n });
        this.enqueue(`capture`, i, r);
      });
    }
    async captureStatelessImmediate(e, t, n, r) {
      let i = this.buildPayload({ distinct_id: e, event: t, properties: n });
      await this.sendImmediate(`capture`, i, r);
    }
    aliasStateless(e, t, n, r) {
      this.wrap(() => {
        let i = this.buildPayload({
          event: `$create_alias`,
          distinct_id: t,
          properties: { ...(n || {}), distinct_id: t, alias: e },
        });
        this.enqueue(`alias`, i, r);
      });
    }
    async aliasStatelessImmediate(e, t, n, r) {
      let i = this.buildPayload({
        event: `$create_alias`,
        distinct_id: t,
        properties: { ...(n || {}), distinct_id: t, alias: e },
      });
      await this.sendImmediate(`alias`, i, r);
    }
    groupIdentifyStateless(e, t, n, r, i, a) {
      this.wrap(() => {
        let o = this.buildPayload({
          distinct_id: i || `$${e}_${t}`,
          event: `$groupidentify`,
          properties: { $group_type: e, $group_key: t, $group_set: n || {}, ...(a || {}) },
        });
        this.enqueue(`capture`, o, r);
      });
    }
    async groupIdentifyStatelessImmediate(e, t, n, r, i, a) {
      let o = this.buildPayload({
        distinct_id: i || `$${e}_${t}`,
        event: `$groupidentify`,
        properties: { $group_type: e, $group_key: t, $group_set: n || {}, ...(a || {}) },
      });
      await this.sendImmediate(`capture`, o, r);
    }
    async getRemoteConfig() {
      await this._initPromise;
      let e = this.host;
      e === `https://us.i.posthog.com`
        ? (e = `https://us-assets.i.posthog.com`)
        : e === `https://eu.i.posthog.com` && (e = `https://eu-assets.i.posthog.com`);
      let t = `${e}/array/${this.projectToken}/config`,
        n = { method: `GET`, headers: { ...this.getCustomHeaders(), "Content-Type": `application/json` } };
      return this.fetchWithRetry(
        t,
        n,
        { type: `required`, consume: (e) => e.json() },
        { retryCount: 0 },
        this.remoteConfigRequestTimeoutMs,
      ).catch((e) => {
        (this._logger.error(`Remote config could not be loaded`, e), this._events.emit(`error`, e));
      });
    }
    async getFlags(e, t = {}, n = {}, r = {}, i = {}, a = !1) {
      await this._initPromise;
      let o = a ? `&config=true` : ``,
        s = `${this.host}/flags/?v=2${o}`,
        c = {
          token: this.projectToken,
          distinct_id: e,
          groups: t,
          person_properties: n,
          group_properties: r,
          ...i,
        };
      (n.$device_id && (c.$device_id = n.$device_id),
        this.evaluationContexts &&
          this.evaluationContexts.length > 0 &&
          (c.evaluation_contexts = this.evaluationContexts));
      let l = this.getEvaluationRuntime();
      l && (c.evaluation_runtime = l);
      let u = {
        method: `POST`,
        headers: { ...this.getCustomHeaders(), "Content-Type": `application/json` },
        body: JSON.stringify(c),
      };
      return (
        this._logger.info(`Flags URL`, s),
        this.fetchWithRetry(
          s,
          u,
          { type: `required`, consume: (e) => e.json() },
          { retryCount: this.featureFlagsRequestMaxRetries, retryCheck: Dn },
          this.featureFlagsRequestTimeoutMs,
        )
          .then((e) => ({ success: !0, response: L(e) }))
          .catch(
            (e) => (this._events.emit(`error`, e), { success: !1, error: this.categorizeRequestError(e) }),
          )
      );
    }
    categorizeRequestError(e) {
      if (e instanceof G) return { type: `api_error`, statusCode: e.status };
      if (e instanceof K) {
        let t = e.error;
        return t instanceof Error && (t.name === `AbortError` || t.name === `TimeoutError`)
          ? { type: `timeout` }
          : { type: `connection_error` };
      }
      return { type: `unknown_error` };
    }
    async getFeatureFlagStateless(e, t, n = {}, r = {}, i = {}, a) {
      await this._initPromise;
      let o = await this.getFeatureFlagDetailStateless(e, t, n, r, i, a);
      if (o === void 0) return { response: void 0, requestId: void 0 };
      let s = z(o.response);
      return (s === void 0 && (s = !1), { response: s, requestId: o.requestId });
    }
    async getFeatureFlagDetailStateless(e, t, n = {}, r = {}, i = {}, a) {
      await this._initPromise;
      let o = await this.getFeatureFlagDetailsStateless(t, n, r, i, a, [e]);
      if (o !== void 0) return { response: o.flags[e], requestId: o.requestId, evaluatedAt: o.evaluatedAt };
    }
    async getFeatureFlagPayloadStateless(e, t, n = {}, r = {}, i = {}, a) {
      await this._initPromise;
      let o = await this.getFeatureFlagPayloadsStateless(t, n, r, i, a, [e]);
      if (!o) return;
      let s = o[e];
      return s === void 0 ? null : s;
    }
    async getFeatureFlagPayloadsStateless(e, t = {}, n = {}, r = {}, i, a) {
      return (
        await this._initPromise,
        (await this.getFeatureFlagsAndPayloadsStateless(e, t, n, r, i, a)).payloads
      );
    }
    async getFeatureFlagsStateless(e, t = {}, n = {}, r = {}, i, a) {
      return (await this._initPromise, await this.getFeatureFlagsAndPayloadsStateless(e, t, n, r, i, a));
    }
    async getFeatureFlagsAndPayloadsStateless(e, t = {}, n = {}, r = {}, i, a) {
      await this._initPromise;
      let o = await this.getFeatureFlagDetailsStateless(e, t, n, r, i, a);
      return o
        ? { flags: o.featureFlags, payloads: o.featureFlagPayloads, requestId: o.requestId }
        : { flags: void 0, payloads: void 0, requestId: void 0 };
    }
    async getFeatureFlagDetailsStateless(e, t = {}, n = {}, r = {}, i, a) {
      await this._initPromise;
      let o = { geoip_disable: i ?? this.disableGeoip };
      a && (o.flag_keys_to_evaluate = a);
      let s = await this.getFlags(e, t, n, r, o);
      if (!s.success) return;
      let c = s.response;
      return (
        c.errorsWhileComputingFlags &&
          console.error(
            `[FEATURE FLAGS] Error while computing feature flags, some flags may be missing or incorrect. Learn more at https://posthog.com/docs/feature-flags/best-practices`,
          ),
        c.quotaLimited?.includes(`feature_flags`)
          ? (console.warn(
              `[FEATURE FLAGS] Feature flags quota limit exceeded - feature flags unavailable. Learn more about billing limits at https://posthog.com/docs/billing/limits-alerts`,
            ),
            {
              flags: {},
              featureFlags: {},
              featureFlagPayloads: {},
              requestId: c?.requestId,
              quotaLimited: c.quotaLimited,
            })
          : c
      );
    }
    async getSurveysStateless() {
      if ((await this._initPromise, this.disabled)) return [];
      if (!0 === this.disableSurveys) return (this._logger.info(`Loading surveys is disabled.`), []);
      let e = `${this.host}/api/surveys/?token=${this.projectToken}`,
        t = { method: `GET`, headers: { ...this.getCustomHeaders(), "Content-Type": `application/json` } },
        n = (
          await this.fetchWithRetry(e, t, {
            type: `required`,
            consume: (e) => {
              if (e.status !== 200 || !e.json) {
                let t = `Surveys API could not be loaded: ${e.status}`,
                  n = Error(t);
                return (this._logger.error(n), this._events.emit(`error`, Error(t)), Promise.resolve(void 0));
              }
              return e.json();
            },
          }).catch((e) => {
            (this._logger.error(`Surveys API could not be loaded`, e), this._events.emit(`error`, e));
          })
        )?.surveys;
      return (n && this._logger.info(`Surveys fetched from API: `, JSON.stringify(n)), n ?? []);
    }
    get props() {
      return ((this._props ||= this.getPersistedProperty(t.Props)), this._props || {});
    }
    set props(e) {
      this._props = e;
    }
    async register(e) {
      this.wrap(() => {
        ((this.props = { ...this.props, ...e }), this.setPersistedProperty(t.Props, this.props));
      });
    }
    async unregister(e) {
      this.wrap(() => {
        (delete this.props[e], this.setPersistedProperty(t.Props, this.props));
      });
    }
    processBeforeEnqueue(e) {
      return e;
    }
    async flushStorage() {}
    getQueueRouteKey(e) {
      return X;
    }
    persistedQueueKeyForRoute(e) {
      return t.Queue;
    }
    getActiveQueueRoutes() {
      return [X];
    }
    getRouteQueue(e) {
      return this.getPersistedProperty(this.persistedQueueKeyForRoute(e)) || [];
    }
    enqueue(e, t, n, r) {
      this.wrap(() => {
        if (this.optedOut)
          return void this._events.emit(
            e,
            `Library is disabled. Not sending event. To re-enable, call posthog.optIn()`,
          );
        let i = this.prepareMessage(t, n);
        if (((i = this.processBeforeEnqueue(i)), i === null)) return;
        i = this.normalizeMessage(i);
        let a = this.persistedQueueKeyForRoute(r ?? this.getQueueRouteKey(i)),
          o = this.getPersistedProperty(a) || [];
        (o.length >= this.maxQueueSize &&
          (o.shift(), this._logger.warn(`Queue is full, the oldest event is dropped.`)),
          o.push({ message: i }),
          this.setPersistedProperty(a, o),
          this._events.emit(e, i),
          o.length >= this.flushAt && this.flushBackground(),
          this.flushInterval &&
            !this._flushTimer &&
            (this._flushTimer = j(() => this.flushBackground(), this.flushInterval)));
      });
    }
    async sendImmediate(e, t, n, r) {
      if (this.disabled) return void this._logger.warn(`The client is disabled`);
      if ((this._isInitialized || (await this._initPromise), this.optedOut))
        return void this._events.emit(
          e,
          `Library is disabled. Not sending event. To re-enable, call posthog.optIn()`,
        );
      let i = this.prepareMessage(t, n);
      if (((i = this.processBeforeEnqueue(i)), i !== null)) {
        i = this.normalizeMessage(i);
        try {
          await this.sendBatch([i], void 0, r ?? this.getQueueRouteKey(i));
        } catch (e) {
          this._events.emit(`error`, e);
        }
      }
    }
    normalizeMessage(e) {
      let { type: t, library: n, library_version: r, ...i } = e,
        a = An(i.properties) ? i.properties : void 0;
      return (
        n !== void 0 && a?.$lib === void 0 && (a = { ...(a || {}), $lib: n }),
        r !== void 0 && a?.$lib_version === void 0 && (a = { ...(a || {}), $lib_version: r }),
        a && (i.properties = a),
        (i.uuid = k(i.uuid, b)),
        i
      );
    }
    normalizeTimestampForWire(e) {
      let t = e instanceof Date ? e : typeof e == `string` ? new Date(e) : null;
      if (!t || Number.isNaN(t.getTime())) return e;
      let n = t.toISOString(),
        r = typeof e == `string` ? e.match(/\.(\d+)(?:Z|[+-]\d{2}:?\d{2})?$/i)?.[1] : void 0;
      return r && r.length > 3 ? n.replace(/\.\d{3}Z$/, `.${r}Z`) : n;
    }
    prepareMessage(e, t) {
      let n = { ...e, timestamp: t?.timestamp ? t?.timestamp : dt(), uuid: k(t?.uuid, b) };
      return (
        (t?.disableGeoip ?? this.disableGeoip) &&
          (An(n.properties) || (n.properties = {}), (n.properties.$geoip_disable = !0)),
        n.distinctId && ((n.distinct_id = n.distinctId), delete n.distinctId),
        n
      );
    }
    clearFlushTimer() {
      this._flushTimer &&= (clearTimeout(this._flushTimer), void 0);
    }
    flushBackground() {
      this.pendingFlushPromise ||
        this.flushAutomatic().catch(async (e) => {
          await wn(e);
        });
    }
    flushAutomatic() {
      return this.flush();
    }
    async waitForPendingPromises(e, t = []) {
      let n = t.filter((e) => !!e),
        r = 0;
      for (;;) {
        let t = this.promiseQueue.getPromises([...n, ...this.flushPromises], e);
        if (t.length === 0) return;
        (r > 0 && this._logger.debug(`flush() re-checking ${t.length} pending promise(s) before flushing`),
          await Promise.all(t.map((e) => e.catch(() => {}))),
          r++);
      }
    }
    flushWithPendingPromises() {
      return this.flushInternal(!0);
    }
    flush() {
      return this.flushInternal(!1);
    }
    flushInternal(e) {
      if (this.disabled) return Promise.resolve();
      if (!e && this.pendingFlushPromise) return this.pendingFlushPromise;
      let t = this.flushPromise,
        n = this.promiseQueue.maxId,
        r = Promise.resolve()
          .then(() => {
            if (e) return this.waitForPendingPromises(n, [t, r]);
          })
          .then(() => mt([t]))
          .then(() => (this.pendingFlushPromise === r && (this.pendingFlushPromise = null), this._flush()));
      return (
        (this.pendingFlushPromise = r),
        (this.flushPromise = r),
        this.flushPromises.add(r),
        this.addPendingPromise(r),
        mt([r]).then(() => {
          (this.flushPromises.delete(r),
            this.pendingFlushPromise === r && (this.pendingFlushPromise = null),
            this.flushPromise === r && (this.flushPromise = null));
        }),
        r
      );
    }
    getCustomHeaders() {
      let e = this.getCustomUserAgent(),
        t = {};
      return (e && e !== `` && (t[`User-Agent`] = e), t);
    }
    compressPayload(e) {
      return Sn(e, this.isDebug);
    }
    getBatchEndpointPath(e) {
      return `/batch/`;
    }
    async sendBatch(e, t, n = X) {
      let r = {
        api_key: this.projectToken,
        batch: e.map((e) => {
          if (!e) return e;
          let t = this.normalizeTimestampForWire(e.timestamp);
          return t === e.timestamp ? e : { ...e, timestamp: t };
        }),
        sent_at: dt(),
      };
      this.historicalMigration && (r.historical_migration = !0);
      let i = a(r),
        o = `${this.host}${this.getBatchEndpointPath(n)}`,
        s = this.disableCompression ? null : await this.compressPayload(i),
        c = {
          method: `POST`,
          headers: {
            ...this.getCustomHeaders(),
            "Content-Type": `application/json`,
            ...(s !== null && { "Content-Encoding": `gzip` }),
          },
          body: s || i,
        };
      await this.fetchWithRetry(o, c, { type: `successful-write` }, t);
    }
    async _flush() {
      (this.clearFlushTimer(), await this._initPromise);
      let e = this.getActiveQueueRoutes();
      if (!e.some((e) => this.getRouteQueue(e).length > 0)) return;
      let t = [],
        n;
      for (let r of e)
        try {
          await this._flushRoute(r, t);
        } catch (e) {
          n === void 0 && (n = e);
        }
      if (n !== void 0) throw n;
      this._events.emit(`flush`, t);
    }
    async _flushRoute(e, t) {
      let n = this.persistedQueueKeyForRoute(e),
        r = this.getPersistedProperty(n) || [];
      if (!r.length) return;
      let i = r.length,
        a = 0;
      for (; r.length > 0 && a < i;) {
        let i = r.slice(0, this.maxBatchSize),
          o = i.map((e) => (e.message === void 0 ? e.message : this.normalizeMessage(e.message))),
          s = async () => {
            let e = this.getPersistedProperty(n) || [],
              t = [...i],
              a = e.filter((e) => {
                let n = e.message?.uuid,
                  r = t.findIndex(
                    (t) => t === e || (typeof n == `string` && n.length > 0 && t.message?.uuid === n),
                  );
                return r === -1 || (t.splice(r, 1), !1);
              });
            (this.setPersistedProperty(n, a),
              (r = a),
              (this._dequeuedMessagesCount += i.length),
              await this.flushStorage());
          },
          c = { retryCheck: (e) => !J(e) && Y(e) };
        try {
          await this.sendBatch(o, c, e);
        } catch (e) {
          if (J(e) && o.length > 1) {
            ((this.maxBatchSize = Math.max(1, Math.floor(o.length / 2))),
              this._logger.warn(
                `Received 413 when sending batch of size ${o.length}, reducing batch size to ${this.maxBatchSize}`,
              ));
            continue;
          }
          throw (e instanceof K || (await s()), this._events.emit(`error`, e), e);
        }
        (await s(), t.push(...o), (a += o.length));
      }
    }
    async _sendOtlpBatch({ path: e, auth: t, payload: n }) {
      if (this.disabled) return { kind: `fatal`, error: Error(`The client is disabled`) };
      let r;
      try {
        r = JSON.stringify(n);
      } catch (t) {
        return (
          this.logMsgIfDebug(() =>
            console.warn(`[PostHog] Could not serialize a ${e} batch; reporting it as too large`, t),
          ),
          { kind: `too-large`, measuredLocally: !0 }
        );
      }
      let i = kn(r);
      if (i > On)
        return (
          this.logMsgIfDebug(() =>
            console.warn(
              `[PostHog] Not sending a ${e} batch of ${i} bytes: the endpoint accepts at most ${On}`,
            ),
          ),
          { kind: `too-large`, measuredLocally: !0 }
        );
      let a =
          t === `bearer`
            ? `${this.host}/i/v1/${e}`
            : `${this.host}/i/v1/${e}?token=${encodeURIComponent(this.projectToken)}`,
        o = this.disableCompression ? null : await this.compressPayload(r),
        s = o || r,
        c = {
          method: `POST`,
          headers: {
            ...this.getCustomHeaders(),
            "Content-Type": `application/json`,
            ...(t === `bearer` && { Authorization: `Bearer ${this.projectToken}` }),
            ...(o !== null && { "Content-Encoding": `gzip` }),
          },
          body: s,
        };
      try {
        return (
          await this.fetchWithRetry(
            a,
            c,
            { type: `successful-write` },
            { retryCheck: (e) => (J(e) || (e instanceof G && e.retryAfterMs !== void 0) ? !1 : Y(e)) },
          ),
          { kind: `ok` }
        );
      } catch (e) {
        if (J(e)) return { kind: `too-large` };
        if (Y(e)) {
          let t = e instanceof G ? e.retryAfterMs : void 0;
          return { kind: `retry-later`, error: e, ...(t !== void 0 && { retryAfterMs: t }) };
        }
        return { kind: `fatal`, error: e };
      }
    }
    async _sendLogsBatch(e) {
      return this._sendOtlpBatch({ path: `logs`, auth: `query-token`, payload: e });
    }
    async _sendMetricsBatch(e) {
      return this._sendOtlpBatch({ path: `metrics`, auth: `query-token`, payload: e });
    }
    async _sendTracesBatch(e) {
      return this._sendOtlpBatch({ path: `traces`, auth: `bearer`, payload: e });
    }
    async fetchWithRetry(e, t, n, r, i) {
      let a = kn(t.body ? t.body : ``),
        o = { ...this._retryOptions, ...r },
        s = 0;
      return await lt(
        async () => {
          s++;
          let r = new AbortController(),
            o = i ?? this.requestTimeout,
            c = Date.now() + o,
            l,
            u = new Promise((e, t) => {
              l = j(() => {
                let e = A(`AbortError`, `Request timed out after ${o}ms`);
                (t(e), r.abort(e));
              }, o);
            }),
            d,
            f = !1,
            p,
            m = () =>
              (p ??= (async () => {
                try {
                  await d?.body?.cancel();
                } catch {}
              })());
          try {
            let i;
            try {
              i = this.fetch(e, { signal: r.signal, ...t });
            } catch (e) {
              throw new K(e);
            }
            i.then((e) => {
              r.signal.aborted && !f && Promise.resolve(e.body?.cancel()).catch(() => {});
            }).catch(() => {});
            try {
              ((d = await Promise.race([i, u])), (f = !0));
            } catch (e) {
              throw new K(e);
            }
            let o = t.mode === `no-cors`,
              s = n.type === `successful-write` ? 300 : 400;
            if (!o && (d.status < 200 || d.status >= s)) throw new G(d, a, c, r);
            if (n.type === `successful-write`) {
              try {
                await Promise.race([m(), u]);
              } catch {}
              return;
            }
            try {
              return await Promise.race([n.consume(d), u]);
            } catch (e) {
              throw r.signal.aborted ? new K(e) : e;
            }
          } finally {
            (clearTimeout(l), r.signal.aborted && d && m());
          }
        },
        {
          ...o,
          retryCheck: (e) => {
            let t = o.retryCheck(e);
            return (t && s <= o.retryCount && e instanceof G && e.cancelResponseBody(), t);
          },
        },
      );
    }
    async _shutdown(e = 3e4) {
      await this._initPromise;
      let t = !1;
      return (
        this.clearFlushTimer(),
        this.disabled
          ? void 0
          : ft(
              (async () => {
                try {
                  for (
                    await this.promiseQueue.join();
                    this.getActiveQueueRoutes().some((e) => this.getRouteQueue(e).length > 0);
                  ) {
                    let e = this._dequeuedMessagesCount;
                    if ((await this.flush(), t)) break;
                    if (this._dequeuedMessagesCount === e) {
                      this._logger.warn(
                        `Shutdown flush completed but did not send any queued events. Stopping drain to avoid a loop.`,
                      );
                      break;
                    }
                  }
                } catch (e) {
                  if (!Tn(e)) throw e;
                  await wn(e);
                }
              })(),
              e,
              () => {
                (this._logger.critical(
                  `Timeout while shutting down PostHog. Some events may not have been sent.`,
                  { shutdownTimeoutMs: e },
                ),
                  (t = !0));
              },
            )
      );
    }
    async shutdown(e = 3e4) {
      return (
        this.shutdownPromise
          ? this._logger.warn(
              `shutdown() called while already shutting down. shutdown() is meant to be called once before process exit - use flush() for per-request cleanup`,
            )
          : (this.shutdownPromise = this._shutdown(e).finally(() => {
              this.shutdownPromise = null;
            })),
        this.shutdownPromise
      );
    }
  },
  Nn = class extends Mn {
    constructor(e, t) {
      let n = t?.disableGeoip ?? !1,
        r = t?.featureFlagsRequestTimeoutMs ?? 1e4;
      (super(e, { ...t, disableGeoip: n, featureFlagsRequestTimeoutMs: r }),
        (this.flagCallReported = {}),
        (this._sessionMaxLengthSeconds = 86400),
        (this.sessionProps = {}),
        (this._cachedPersonProperties = null),
        (this.sendFeatureFlagEvent = t?.sendFeatureFlagEvent ?? !0),
        (this.disableRemoteFeatureFlags = t?.disableRemoteFeatureFlags ?? !1),
        (this._sessionExpirationTimeSeconds = t?.sessionExpirationTimeSeconds ?? 1800),
        (this._personProfiles = t?.personProfiles ?? `identified_only`),
        (this._beforeSend = t?.before_send));
    }
    setupBootstrap(e) {
      let n = e?.bootstrap;
      if (!n) return;
      n.distinctId &&
        (n.isIdentifiedId
          ? this.getPersistedProperty(t.DistinctId) ||
            (this.setPersistedProperty(t.DistinctId, n.distinctId),
            this.setPersistedProperty(t.PersonMode, `identified`))
          : this.getPersistedProperty(t.AnonymousId) ||
            this.setPersistedProperty(t.AnonymousId, n.distinctId));
      let r = n.featureFlags,
        i = n.featureFlagPayloads ?? {};
      if (r && Object.keys(r).length) {
        let e = sn(r, i);
        if (Object.keys(e.flags).length > 0) {
          this.setBootstrappedFeatureFlagDetails(e);
          let t = this.getKnownFeatureFlagDetails() || { flags: {}, requestId: void 0 },
            n = { flags: { ...e.flags, ...t.flags }, requestId: e.requestId };
          this.setKnownFeatureFlagDetails(n);
        }
      }
    }
    clearProps() {
      ((this.props = void 0), (this.sessionProps = {}), (this.flagCallReported = {}));
    }
    on(e, t) {
      return this._events.on(e, t);
    }
    reset(e) {
      this.wrap(() => {
        let n = [t.Queue, t.AiQueue, t.AiCaptureQueue, t.LogsQueue, ...(e || [])];
        (this.clearProps(), (this._cachedPersonProperties = null));
        for (let e of Object.keys(t)) n.includes(t[e]) || this.setPersistedProperty(t[e], null);
        this.disableRemoteFeatureFlags && !this.disabled
          ? n.includes(t.FeatureFlagDetails) || this.setKnownFeatureFlagDetails({ flags: {} })
          : this.reloadFeatureFlags();
      });
    }
    async _shutdown(e = 3e4) {
      try {
        return await super._shutdown(e);
      } finally {
        this.flagCallReported = {};
      }
    }
    getCommonEventProperties() {
      let e = this.getFeatureFlags(),
        t = {};
      if (e) for (let [n, r] of Object.entries(e)) t[`$feature/${n}`] = r;
      return {
        ...q(`$active_feature_flags`, e ? Object.keys(e) : void 0),
        ...t,
        ...super.getCommonEventProperties(),
      };
    }
    enrichProperties(e) {
      let t = e || {};
      return {
        ...this.props,
        ...this.sessionProps,
        ...this.getCommonEventProperties(),
        ...t,
        $session_id: this.getSessionId(),
      };
    }
    mergeCommonEventProperties(e) {
      return { ...this.getCommonEventProperties(), ...e };
    }
    getSessionId() {
      if (!this._isInitialized) return ``;
      let e = this.getPersistedProperty(t.SessionId),
        n = this.getPersistedProperty(t.SessionLastTimestamp) || 0,
        r = this.getPersistedProperty(t.SessionStartTimestamp) || 0,
        i = Date.now(),
        a = i - n,
        o = i - r;
      return (
        (!e || a > 1e3 * this._sessionExpirationTimeSeconds || o > 1e3 * this._sessionMaxLengthSeconds) &&
          ((e = b()),
          this.setPersistedProperty(t.SessionId, e),
          this.setPersistedProperty(t.SessionStartTimestamp, i)),
        this.setPersistedProperty(t.SessionLastTimestamp, i),
        e
      );
    }
    resetSessionId() {
      this.wrap(() => {
        (this.setPersistedProperty(t.SessionId, null),
          this.setPersistedProperty(t.SessionLastTimestamp, null),
          this.setPersistedProperty(t.SessionStartTimestamp, null));
      });
    }
    getAnonymousId() {
      if (!this._isInitialized) return ``;
      let e = this.getPersistedProperty(t.AnonymousId);
      return (e || ((e = b()), this.setPersistedProperty(t.AnonymousId, e)), e);
    }
    getDistinctId() {
      return this._isInitialized ? this.getPersistedProperty(t.DistinctId) || this.getAnonymousId() : ``;
    }
    registerForSession(e) {
      this.sessionProps = { ...this.sessionProps, ...e };
    }
    unregisterForSession(e) {
      delete this.sessionProps[e];
    }
    identify(e, n, r) {
      this.wrap(() => {
        if (!this._requirePersonProcessing(`posthog.identify`)) return;
        let i = this.getDistinctId(),
          a = !!e;
        ((e ||= i), n?.$groups && this.groups(n.$groups));
        let o = n?.$set_once;
        delete n?.$set_once;
        let c = n?.$set || n,
          l = this.enrichProperties({
            $anon_distinct_id: this.getAnonymousId(),
            ...q(`$set`, c),
            ...q(`$set_once`, o),
          }),
          u = p(c) ? c : void 0,
          d = p(o) ? o : void 0,
          f = e !== i,
          m = a && !f && !this._isIdentified();
        if (f)
          (this.setPersistedProperty(t.AnonymousId, i),
            this.setPersistedProperty(t.DistinctId, e),
            this.setPersistedProperty(t.PersonMode, `identified`),
            this.reloadFeatureFlags(),
            super.identifyStateless(e, l, r),
            (this._cachedPersonProperties = s(e, u, d)));
        else if (m) {
          this.setPersistedProperty(t.PersonMode, `identified`);
          let n = u || {},
            r = d || {};
          (this.setPersonPropertiesForFlags({ $set: n, $set_once: r }, !1),
            this.capture(`$set`, { $set: n, $set_once: r }),
            (this._cachedPersonProperties = s(e, u, d)),
            (u || d) && this.reloadFeatureFlags());
        } else (u || d) && this.setPersonProperties(u, d);
      });
    }
    capture(e, t, n) {
      (e === `$exception` &&
        !n?._originatedFromCaptureException &&
        this._logger.warn(
          "Using `posthog.capture('$exception')` is unreliable because it does not attach required metadata. Use `posthog.captureException(error)` instead, which attaches required metadata automatically.",
        ),
        this.wrap(() => {
          let r = this.getDistinctId();
          t?.$groups && this.groups(t.$groups);
          let i = this.enrichProperties(t),
            a = this._hasPersonProcessing();
          ((i.$process_person_profile = a),
            (i.$is_identified = this._isIdentified()),
            a && this._requirePersonProcessing(`capture`),
            super.captureStateless(r, e, i, n));
        }));
    }
    alias(e) {
      this.wrap(() => {
        if (!this._requirePersonProcessing(`posthog.alias`)) return;
        let t = this.getDistinctId(),
          n = this.enrichProperties({});
        super.aliasStateless(e, t, n);
      });
    }
    autocapture(e, t, n = {}, r) {
      this.wrap(() => {
        let i = {
          distinct_id: this.getDistinctId(),
          event: `$autocapture`,
          properties: { ...this.enrichProperties(n), $event_type: e, $elements: t },
        };
        this.enqueue(`autocapture`, i, r);
      });
    }
    groups(e) {
      this.wrap(() => {
        if (!this._requirePersonProcessing(`posthog.group`)) return;
        let t = this.props.$groups || {};
        (this.register({ $groups: { ...t, ...e } }),
          Object.keys(e).find((n) => t[n] !== e[n]) && this.reloadFeatureFlags());
      });
    }
    group(e, t, n, r) {
      this.wrap(() => {
        let i = (this.props.$groups || {})[e] !== t;
        (this.groups({ [e]: t }), (i || n) && this.groupIdentify(e, t, n, r));
      });
    }
    groupIdentify(e, t, n, r) {
      this.wrap(() => {
        if (!this._requirePersonProcessing(`posthog.groupIdentify`)) return;
        let i = this.getDistinctId(),
          a = this.enrichProperties({});
        super.groupIdentifyStateless(e, t, n, r, i, a);
      });
    }
    setPersonPropertiesForFlags(e, n = !0) {
      this.wrap(() => {
        let r = this.getPersistedProperty(t.PersonProperties) || {},
          i = e?.$set || (e?.$set_once ? {} : e),
          a = e?.$set_once,
          o = {};
        if (a) for (let e in a) Object.prototype.hasOwnProperty.call(a, e) && (e in r || (o[e] = a[e]));
        (this.setPersistedProperty(t.PersonProperties, { ...r, ...o, ...i }), n && this.reloadFeatureFlags());
      });
    }
    resetPersonPropertiesForFlags() {
      this.wrap(() => {
        this.setPersistedProperty(t.PersonProperties, null);
      });
    }
    setGroupPropertiesForFlags(e) {
      this.wrap(() => {
        let n = this.getPersistedProperty(t.GroupProperties) || {};
        (Object.keys(n).length !== 0 &&
          Object.keys(n).forEach((t) => {
            ((n[t] = { ...n[t], ...e[t] }), delete e[t]);
          }),
          this.setPersistedProperty(t.GroupProperties, { ...n, ...e }));
      });
    }
    resetGroupPropertiesForFlags() {
      this.wrap(() => {
        this.setPersistedProperty(t.GroupProperties, null);
      });
    }
    async remoteConfigAsync() {
      if ((await this._initPromise, !this.disabled))
        return this._remoteConfigResponsePromise
          ? this._remoteConfigResponsePromise
          : this._remoteConfigAsync();
    }
    async flagsAsync(e) {
      let { sendAnonDistinctId: t = !0, fetchConfig: n = !1, triggerOnRemoteConfig: r = !1 } = e ?? {};
      if ((await this._initPromise, !this.disabled)) {
        if (this.disableRemoteFeatureFlags && !n)
          return void this._logger.info(
            `Feature flags are disabled (disableRemoteFeatureFlags), skipping reload.`,
          );
        if (this._flagsResponsePromise) {
          this._logger.info(`Feature flags are being loaded already, queuing reload.`);
          let e = this._pendingFlagsRequest;
          return new Promise((i, a) => {
            this._pendingFlagsRequest = {
              sendAnonDistinctId: t || !!e?.sendAnonDistinctId,
              fetchConfig: n || !!e?.fetchConfig,
              triggerOnRemoteConfig: r || !!e?.triggerOnRemoteConfig,
              waiters: [...(e?.waiters ?? []), { resolve: i, reject: a }],
            };
          });
        }
        return this._flagsAsync({ sendAnonDistinctId: t, fetchConfig: n, triggerOnRemoteConfig: r });
      }
    }
    onRemoteConfig(e) {}
    maybeNotifyRemoteConfig(e, t) {
      if (e)
        try {
          this.onRemoteConfig(t);
        } catch (e) {
          this._logger.error(`Error in onRemoteConfig callback:`, e);
        }
    }
    cacheSessionReplay(e, n) {
      let r = n?.sessionRecording;
      r
        ? (this.setPersistedProperty(t.SessionReplay, r),
          this._logger.info(`Session replay config from ${e}: `, JSON.stringify(r)))
        : typeof r == `boolean` &&
          !1 === r &&
          (this._logger.info(`Session replay config from ${e} disabled.`),
          this.setPersistedProperty(t.SessionReplay, null));
    }
    async _remoteConfigAsync() {
      return (
        (this._remoteConfigResponsePromise = this._initPromise
          .then(() => {
            let e = this.getPersistedProperty(t.RemoteConfig);
            return (
              this._logger.info(`Cached remote config: `, JSON.stringify(e)),
              super.getRemoteConfig().then((r) => {
                if (r) {
                  let i = { ...r };
                  if (
                    (delete i.surveys,
                    this._logger.info(`Fetched remote config: `, JSON.stringify(i)),
                    !1 === this.disableSurveys)
                  ) {
                    let e = r.surveys,
                      n = !0;
                    (Array.isArray(e)
                      ? this._logger.info(`Surveys fetched from remote config: `, JSON.stringify(e))
                      : (this._logger.info(`There are no surveys.`), (n = !1)),
                      n
                        ? this.setPersistedProperty(t.Surveys, e)
                        : this.setPersistedProperty(t.Surveys, null));
                  } else this.setPersistedProperty(t.Surveys, null);
                  (this.setPersistedProperty(t.RemoteConfig, i), this.cacheSessionReplay(`remote config`, r));
                  let a = !1;
                  (!1 === r.hasFeatureFlags
                    ? (this.disableRemoteFeatureFlags || this.setKnownFeatureFlagDetails({ flags: {} }),
                      this._logger.warn(`Remote config has no feature flags, will not load feature flags.`))
                    : !1 !== this.preloadFeatureFlags &&
                      !this.disableRemoteFeatureFlags &&
                      ((a = !0),
                      this.flagsAsync({
                        sendAnonDistinctId: !0,
                        fetchConfig: !0,
                        triggerOnRemoteConfig: !0,
                      })),
                    r.supportedCompression?.includes(n.GZipJS) || (this.disableCompression = !0),
                    this.maybeNotifyRemoteConfig(!a, r),
                    (e = r));
                }
                return e;
              })
            );
          })
          .finally(() => {
            this._remoteConfigResponsePromise = void 0;
          })),
        this._remoteConfigResponsePromise
      );
    }
    async _flagsAsync(e) {
      let n = e?.sendAnonDistinctId ?? !0,
        r = e?.fetchConfig ?? !1,
        i = e?.triggerOnRemoteConfig ?? !1;
      return (
        (this._flagsResponsePromise = this._initPromise
          .then(async () => {
            let e = this.getDistinctId(),
              a = this.props.$groups || {},
              o = this.getPersistedProperty(t.PersonProperties) || {},
              s = this.getPersistedProperty(t.GroupProperties) || {},
              c = this.getPersistedProperty(t.DeviceId),
              l = {
                $anon_distinct_id: n ? this.getAnonymousId() : void 0,
                $device_id: c ?? void 0,
                ...(this.disableRemoteFeatureFlags ? { disable_flags: !0 } : {}),
              },
              u = await super.getFlags(e, a, o, s, l, r);
            if (!u.success) {
              this.disableRemoteFeatureFlags ||
                this.setKnownFeatureFlagDetails({
                  flags: this.getKnownFeatureFlagDetails()?.flags ?? {},
                  requestError: u.error,
                  minimalFlagCalledEvents: this.getStoredFlagDetails()?.minimalFlagCalledEvents,
                });
              return;
            }
            let d = u.response;
            if (d?.quotaLimited?.includes(jn.FeatureFlags))
              return (
                this.disableRemoteFeatureFlags ||
                  this.setKnownFeatureFlagDetails({
                    flags: this.getKnownFeatureFlagDetails()?.flags ?? {},
                    quotaLimited: d.quotaLimited,
                    minimalFlagCalledEvents: this.getStoredFlagDetails()?.minimalFlagCalledEvents,
                  }),
                this._logger.warn(
                  `[FEATURE FLAGS] Feature flags quota limit exceeded. Learn more about billing limits at https://posthog.com/docs/billing/limits-alerts`,
                ),
                this.maybeNotifyRemoteConfig(i, d),
                d
              );
            if (d?.featureFlags) {
              if (this.disableRemoteFeatureFlags)
                return (this.cacheSessionReplay(`flags`, d), this.maybeNotifyRemoteConfig(i, d), d);
              let e = d;
              if (d.errorsWhileComputingFlags) {
                let t = this.getKnownFeatureFlagDetails();
                this._logger.info(`Cached feature flags: `, JSON.stringify(t));
                let n = {};
                for (let e in d.flags) d.flags[e].failed || (n[e] = d.flags[e]);
                e = { ...d, flags: { ...t?.flags, ...n } };
              }
              (this.cacheSessionReplay(`flags`, d),
                this.setKnownFeatureFlagDetails({
                  flags: e.flags,
                  requestId: d.requestId,
                  evaluatedAt: d.evaluatedAt,
                  errorsWhileComputingFlags: d.errorsWhileComputingFlags,
                  quotaLimited: d.quotaLimited,
                  minimalFlagCalledEvents: !0 === d.minimalFlagCalledEvents,
                }),
                this.setPersistedProperty(t.FlagsEndpointWasHit, !0),
                this.maybeNotifyRemoteConfig(i, d));
            }
            return d;
          })
          .finally(() => {
            this._flagsResponsePromise = void 0;
            let e = this._pendingFlagsRequest;
            e &&
              ((this._pendingFlagsRequest = void 0),
              this._logger.info(`Executing pending feature flags reload.`),
              this.flagsAsync({
                sendAnonDistinctId: e.sendAnonDistinctId,
                fetchConfig: e.fetchConfig,
                triggerOnRemoteConfig: e.triggerOnRemoteConfig,
              })
                .then((t) => e.waiters.forEach((e) => e.resolve(t)))
                .catch((t) => e.waiters.forEach((e) => e.reject(t))));
          })),
        this._flagsResponsePromise
      );
    }
    setKnownFeatureFlagDetails(e) {
      this.wrap(() => {
        (this.setPersistedProperty(t.FeatureFlagDetails, e),
          this._events.emit(`featureflags`, R(e?.flags ?? {})));
      });
    }
    getKnownFeatureFlagDetails() {
      let e = this.getPersistedProperty(t.FeatureFlagDetails);
      if (!e) {
        let e = this.getPersistedProperty(t.FeatureFlags),
          n = this.getPersistedProperty(t.FeatureFlagPayloads);
        return e === void 0 && n === void 0 ? void 0 : sn(e ?? {}, n ?? {});
      }
      return L(e);
    }
    getStoredFlagDetails() {
      return this.getPersistedProperty(t.FeatureFlagDetails);
    }
    isMinimalFlagCalledEventsEnabled() {
      return this.getStoredFlagDetails()?.minimalFlagCalledEvents === !0;
    }
    getKnownFeatureFlags() {
      let e = this.getKnownFeatureFlagDetails();
      if (e) return R(e.flags);
    }
    getBootstrappedFeatureFlagDetails() {
      let e = this.getPersistedProperty(t.BootstrapFeatureFlagDetails);
      if (e) return e;
    }
    setBootstrappedFeatureFlagDetails(e) {
      this.setPersistedProperty(t.BootstrapFeatureFlagDetails, e);
    }
    getBootstrappedFeatureFlags() {
      let e = this.getBootstrappedFeatureFlagDetails();
      if (e) return R(e.flags);
    }
    getBootstrappedFeatureFlagPayloads() {
      let e = this.getBootstrappedFeatureFlagDetails();
      if (e) return on(e.flags);
    }
    getFeatureFlagResult(e, t) {
      return this._getFeatureFlagResult(e, t);
    }
    getAllFeatureFlags() {
      return ln(this.getFeatureFlagDetails()?.flags ?? {});
    }
    _getFeatureFlagResult(e, n = {}) {
      let i = this.getStoredFlagDetails(),
        a = this.getFeatureFlagDetails(),
        o = i?.quotaLimited?.includes(jn.FeatureFlags),
        s = a?.flags[e],
        c = z(s);
      if ((n.sendEvent ?? this.sendFeatureFlagEvent) && !this.optedOut && !this.flagCallReported[e]?.has(c)) {
        let n = [];
        if (i?.requestError) {
          let { type: e, statusCode: t } = i.requestError;
          e === `timeout`
            ? n.push(r.TIMEOUT)
            : e === `api_error` && t !== void 0
              ? n.push(r.apiError(t))
              : e === `connection_error`
                ? n.push(r.CONNECTION_ERROR)
                : n.push(r.UNKNOWN_ERROR);
        } else
          i &&
            (i.errorsWhileComputingFlags && n.push(r.ERRORS_WHILE_COMPUTING),
            o ? n.push(r.QUOTA_LIMITED) : c === void 0 && !s && n.push(r.FLAG_MISSING));
        let l = this.getBootstrappedFeatureFlags()?.[e],
          u = this.getBootstrappedFeatureFlagPayloads()?.[e],
          d = n.length > 0 ? n.join(`,`) : void 0;
        ((this.flagCallReported[e] = this.flagCallReported[e] ?? new Set()), this.flagCallReported[e].add(c));
        let f = {
          $feature_flag: e,
          $feature_flag_response: c,
          ...q(`$feature_flag_id`, s?.metadata?.id),
          ...q(`$feature_flag_version`, s?.metadata?.version),
          ...q(`$feature_flag_reason`, s?.reason?.description ?? s?.reason?.code),
          ...q(`$feature_flag_bootstrapped_response`, l),
          ...q(`$feature_flag_bootstrapped_payload`, u),
          $used_bootstrap_value: !this.getPersistedProperty(t.FlagsEndpointWasHit),
          ...q(`$feature_flag_request_id`, a?.requestId),
          ...q(`$feature_flag_evaluated_at`, a?.evaluatedAt),
          ...q(`$feature_flag_error`, d),
          ...q(`$feature_flag_has_experiment`, s?.metadata?.has_experiment),
        };
        this.capture(`$feature_flag_called`, f);
      }
      if (c === void 0)
        switch (n.missingFlagBehavior) {
          case `getFeatureFlagPayload`:
            return a ? { key: e, enabled: !1, payload: null } : void 0;
          case `getFeatureFlag`:
            return a && Object.keys(a.flags).length ? { key: e, enabled: !1, payload: null } : void 0;
          case void 0:
            return;
        }
      let l = s?.metadata?.payload,
        u = l === void 0 ? null : B(l);
      return { key: e, enabled: V(c), variant: H(c), payload: u };
    }
    getFeatureFlag(e, t) {
      let n = this._getFeatureFlagResult(e, {
        missingFlagBehavior: `getFeatureFlag`,
        sendEvent: t?.sendEvent,
      });
      return n?.variant ?? n?.enabled;
    }
    getFeatureFlagPayload(e) {
      return this._getFeatureFlagResult(e, { missingFlagBehavior: `getFeatureFlagPayload`, sendEvent: !1 })
        ?.payload;
    }
    getFeatureFlagPayloads() {
      return this.getFeatureFlagDetails()?.featureFlagPayloads;
    }
    getFeatureFlags() {
      return this.getFeatureFlagDetails()?.featureFlags;
    }
    getFeatureFlagDetails() {
      let e = this.getKnownFeatureFlagDetails(),
        n = this.getPersistedProperty(t.OverrideFeatureFlags);
      if (!n) return e;
      e ??= { featureFlags: {}, featureFlagPayloads: {}, flags: {} };
      let r = { ...(e.flags ?? {}) };
      for (let e in n) n[e] ? (r[e] = cn(r[e], n[e])) : delete r[e];
      return L({ ...e, flags: r });
    }
    getFeatureFlagsAndPayloads() {
      return { flags: this.getFeatureFlags(), payloads: this.getFeatureFlagPayloads() };
    }
    isFeatureEnabled(e, t) {
      if (t?.defaultValue === void 0) {
        let n = this.getFeatureFlag(e, t);
        return n === void 0 ? void 0 : !!n;
      }
      let n = this._getFeatureFlagResult(e, { sendEvent: t.sendEvent }),
        r = n?.variant ?? n?.enabled;
      return r === void 0 ? t.defaultValue : !!r;
    }
    reloadFeatureFlags(e) {
      if (this.disableRemoteFeatureFlags && !this.disabled)
        return void this._initPromise.then(() => e?.cb?.(void 0, this.getFeatureFlags()));
      this.flagsAsync({ sendAnonDistinctId: !0 })
        .then((t) => {
          e?.cb?.(void 0, t?.featureFlags);
        })
        .catch((t) => {
          (e?.cb?.(t, void 0), e?.cb || this._logger.info(`Error reloading feature flags`, t));
        });
    }
    async reloadRemoteConfigAsync() {
      return await this.remoteConfigAsync();
    }
    async reloadFeatureFlagsAsync(e) {
      return this.disableRemoteFeatureFlags && !this.disabled
        ? (await this._initPromise, this.getFeatureFlags())
        : (await this.flagsAsync({ sendAnonDistinctId: e }))?.featureFlags;
    }
    onFeatureFlags(e) {
      return this.on(`featureflags`, async () => {
        let t = this.getFeatureFlags();
        t && e(t);
      });
    }
    onFeatureFlag(e, t) {
      return this.on(`featureflags`, async () => {
        let n = this.getFeatureFlag(e);
        n !== void 0 && t(n);
      });
    }
    async overrideFeatureFlag(e) {
      this.wrap(() =>
        e === null
          ? this.setPersistedProperty(t.OverrideFeatureFlags, null)
          : this.setPersistedProperty(t.OverrideFeatureFlags, e),
      );
    }
    updateFlags(e, t, n) {
      this.wrap(() => {
        let r = n?.merge ? this.getKnownFeatureFlagDetails()?.flags : void 0,
          i = r ? R(r) : {},
          a = {};
        for (let e in r) {
          let t = r[e].metadata?.payload;
          t !== void 0 && (a[e] = B(t));
        }
        let o = { ...i, ...e },
          s = { ...a, ...(t ?? {}) },
          c = {};
        for (let [e, t] of Object.entries(o)) {
          let n = s[e],
            r;
          if (n !== void 0)
            try {
              r = JSON.stringify(n);
            } catch (t) {
              this._logger.error(
                `updateFlags: could not serialize the payload for flag "${e}", dropping it.`,
                t,
              );
            }
          c[e] = {
            key: e,
            enabled: V(t),
            variant: H(t),
            reason: void 0,
            metadata: { id: void 0, version: void 0, description: void 0, payload: r },
          };
        }
        this.setKnownFeatureFlagDetails({ flags: c });
      });
    }
    captureException(e, t, n) {
      try {
        let r = this.getErrorPropertiesBuilder().buildFromUnknown(e, n);
        this.capture(`$exception`, { ...r, ...t }, { _originatedFromCaptureException: !0 });
      } catch (e) {
        this._logger.error(`Error while capturing $exception:`, e);
      }
    }
    captureTraceFeedback(e, t) {
      this.capture(`$ai_feedback`, { $ai_feedback_text: t, $ai_trace_id: String(e) });
    }
    captureTraceMetric(e, t, n) {
      this.capture(`$ai_metric`, {
        $ai_metric_name: t,
        $ai_metric_value: String(n),
        $ai_trace_id: String(e),
      });
    }
    _isIdentified() {
      let e = this.getPersistedProperty(t.PersonMode);
      if (e === `identified`) return !0;
      if (e === void 0) {
        let e = this.getPersistedProperty(t.DistinctId),
          n = this.getPersistedProperty(t.AnonymousId);
        if (e && n && e !== n) return !0;
      }
      return !1;
    }
    _getGroups() {
      return this.props.$groups || {};
    }
    _hasPersonProcessing() {
      if (this._personProfiles === `always`) return !0;
      if (this._personProfiles === `never`) return !1;
      let e = this._isIdentified(),
        n = Object.keys(this._getGroups()).length > 0,
        r = !0 === this.getPersistedProperty(t.EnablePersonProcessing);
      return e || n || r;
    }
    _requirePersonProcessing(e) {
      return this._personProfiles === `never`
        ? (this._logger.error(
            `${e} was called, but personProfiles is set to "never". This call will be ignored.`,
          ),
          !1)
        : (this.setPersistedProperty(t.EnablePersonProcessing, !0), !0);
    }
    createPersonProfile() {
      this._hasPersonProcessing() ||
        (this._requirePersonProcessing(`posthog.createPersonProfile`) &&
          this.capture(`$set`, { $set: {}, $set_once: {} }));
    }
    setPersonProperties(e, t, n = !0) {
      this.wrap(() => {
        let r = te(e) || m(e),
          i = te(t) || m(t);
        if ((r && i) || !this._requirePersonProcessing(`posthog.setPersonProperties`)) return;
        let a = s(this.getDistinctId(), e, t);
        if (this._cachedPersonProperties === a)
          return void this._logger.info(
            `A duplicate setPersonProperties call was made with the same properties. It has been ignored.`,
          );
        (this.setPersonPropertiesForFlags({ $set: e || {}, $set_once: t || {} }, n),
          this.capture(`$set`, { $set: e || {}, $set_once: t || {} }),
          (this._cachedPersonProperties = a));
      });
    }
    unsetPersonProperties(e, n = !0) {
      this.wrap(() => {
        let r = (f(e) ? e : [e]).filter((e) => g(e) && e.length > 0);
        if (r.length === 0 || !this._requirePersonProcessing(`posthog.unsetPersonProperties`)) return;
        let i = { ...(this.getPersistedProperty(t.PersonProperties) || {}) };
        for (let e of r) delete i[e];
        (this.setPersistedProperty(t.PersonProperties, i),
          n && this.reloadFeatureFlags(),
          this.capture(`$set`, { $unset: r }),
          (this._cachedPersonProperties = null));
      });
    }
    processBeforeEnqueue(e) {
      if (!this._beforeSend) return e;
      let t = e.timestamp,
        n = e.properties || {},
        r = {
          uuid: e.uuid,
          event: e.event,
          properties: n,
          $set: n.$set,
          $set_once: n.$set_once,
          timestamp: typeof t == `string` ? new Date(t) : t,
        },
        i = this._runBeforeSend(r);
      if (!i) return null;
      let a = { ...(i.properties ?? n) };
      return (
        i.$set === void 0 ? delete a.$set : (a.$set = i.$set),
        i.$set_once === void 0 ? delete a.$set_once : (a.$set_once = i.$set_once),
        { ...e, uuid: k(i.uuid ?? e.uuid, b), event: i.event, properties: a, timestamp: i.timestamp }
      );
    }
    _runBeforeSend(e) {
      let t = this._beforeSend;
      if (!t) return e;
      let n = Array.isArray(t) ? t : [t],
        r = e;
      for (let t of n)
        try {
          if (((r = t(r)), !r))
            return (this._logger.info(`Event '${e.event}' was rejected in before_send function`), null);
        } catch (t) {
          return (this._logger.error(`Error in before_send function for event '${e.event}':`, t), null);
        }
      return r;
    }
  },
  Pn = /[a-z][a-z0-9+.-]{0,63}:\/\//i;
(RegExp(`^${Pn.source}`, `i`),
  new RegExp(Pn.source, `gi`),
  {
    trace: { text: `TRACE`, number: 1 },
    debug: { text: `DEBUG`, number: 5 },
    info: { text: `INFO`, number: 9 },
    warn: { text: `WARN`, number: 13 },
    error: { text: `ERROR`, number: 17 },
    fatal: { text: `FATAL`, number: 21 },
  }.info);
var Fn = e({ default: () => qn }),
  In = `4.13.2`;
function Ln(e, t = !1) {
  let n = {};
  if (e?.navigator) {
    let r = e.navigator.userAgent,
      i = Rn(e),
      [a, o] = tt(r);
    n = {
      ...n,
      ...(i !== void 0 && { $os: i }),
      $browser: Ze(r, e.navigator.vendor),
      ...(a && { $webview_app: a }),
      ...(o && { $webview_app_version: o }),
      $referrer: e.document.referrer,
      $referring_domain: Bn(e.document.referrer),
      $device: zn(r),
      $current_url: t ? ct(e.location.href) : e.location.href,
      $host: e.location.host,
      $pathname: e.location.pathname,
      $browser_version: $e(r, e.navigator.vendor),
      $screen_height: e.screen.height,
      $screen_width: e.screen.width,
      $screen_dpr: e.devicePixelRatio,
    };
  }
  return (
    (n = {
      ...n,
      $lib: `js`,
      $lib_version: In,
      $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      $time: ut() / 1e3,
    }),
    n
  );
}
function Rn(e) {
  if (!e?.navigator) return;
  let t = e.navigator.userAgent;
  if (/Windows/i.test(t)) return /Phone/.test(t) || /WPDesktop/.test(t) ? `Windows Phone` : `Windows`;
  if (/(iPhone|iPad|iPod)/.test(t)) return `iOS`;
  if (/Android/.test(t)) return `Android`;
  if (/(BlackBerry|PlayBook|BB10)/i.test(t)) return `BlackBerry`;
  if (/Mac/i.test(t)) return `Mac OS X`;
  if (/Linux/.test(t)) return `Linux`;
  if (/CrOS/.test(t)) return `Chrome OS`;
}
function zn(e) {
  return /Windows Phone/i.test(e) || /WPDesktop/.test(e)
    ? `Windows Phone`
    : /iPad/.test(e)
      ? `iPad`
      : /iPod/.test(e)
        ? `iPod Touch`
        : /iPhone/.test(e)
          ? `iPhone`
          : /(BlackBerry|PlayBook|BB10)/i.test(e)
            ? `BlackBerry`
            : /Android/.test(e)
              ? `Android`
              : ``;
}
function Bn(e) {
  let t = e.split(`/`);
  return t.length >= 3 ? t[2] : ``;
}
var Vn = {
    getItem(e) {
      try {
        let t = e + `=`,
          n = document.cookie.split(`;`);
        for (let e = 0; e < n.length; e++) {
          let r = n[e];
          for (; r.charAt(0) == ` `;) r = r.substring(1, r.length);
          if (r.indexOf(t) === 0) return decodeURIComponent(r.substring(t.length, r.length));
        }
      } catch {}
      return null;
    },
    setItem(e, t) {
      try {
        let n = e + `=` + encodeURIComponent(t) + `; path=/`;
        document.cookie = n;
      } catch {
        return;
      }
    },
    removeItem(e) {
      try {
        Vn.setItem(e, ``);
      } catch {
        return;
      }
    },
    clear() {
      document.cookie = ``;
    },
    getAllKeys() {
      let e = document.cookie.split(`;`),
        t = [];
      for (let n = 0; n < e.length; n++) {
        let r = e[n];
        for (; r.charAt(0) == ` `;) r = r.substring(1, r.length);
        t.push(r.split(`=`)[0]);
      }
      return t;
    },
  },
  Hn = (e) => ({
    getItem(t) {
      return e.getItem(t);
    },
    setItem(t, n) {
      e.setItem(t, n);
    },
    removeItem(t) {
      e.removeItem(t);
    },
    clear() {
      e.clear();
    },
    getAllKeys() {
      let e = [];
      for (let t in localStorage) e.push(t);
      return e;
    },
  }),
  Un = (e, t = `__mplssupport__`) => {
    try {
      return (e.setItem(t, `xyz`), e.getItem(t) === `xyz` && (e.removeItem(t), !0));
    } catch {
      return !1;
    }
  },
  Z = void 0,
  Q = void 0,
  $ = () => {
    let e = {};
    return {
      getItem(t) {
        return e[t];
      },
      setItem(t, n) {
        e[t] = n === null ? void 0 : n;
      },
      removeItem(t) {
        delete e[t];
      },
      clear() {
        for (let t in e) delete e[t];
      },
      getAllKeys() {
        let t = [];
        for (let n in e) t.push(n);
        return t;
      },
    };
  },
  Wn = (e, t) => {
    if (t) {
      if (!Z) {
        let e = Hn(t.localStorage);
        Z = Un(e) ? e : void 0;
      }
      if (!Q) {
        let e = Hn(t.sessionStorage);
        Q = Un(e) ? e : void 0;
      }
    }
    switch (e) {
      case `cookie`:
        return Vn || Z || Q || $();
      case `localStorage`:
        return Z || Q || $();
      case `sessionStorage`:
        return Q || $();
      case `memory`:
        return $();
      default:
        return $();
    }
  },
  Gn = function (e) {
    return typeof e == `function`;
  };
function Kn(e, t, n) {
  try {
    if (!(t in e)) return () => {};
    let r = e[t],
      i = n(r);
    return (
      Gn(i) &&
        ((i.prototype = i.prototype || {}),
        Object.defineProperties(i, { __posthog_wrapped__: { enumerable: !1, value: !0 } })),
      (e[t] = i),
      () => {
        e[t] = r;
      }
    );
  } catch {
    return () => {};
  }
}
var qn = class extends Nn {
  constructor(e, t) {
    (super(e, t),
      (this._lastPathname = ``),
      (this._storageKey = t?.persistence_name ? `ph_${t.persistence_name}` : `ph_${e}_posthog`),
      (this._disableCaptureUrlHashes = t?.disable_capture_url_hashes ?? !1),
      (this._storage = Wn(t?.persistence || `localStorage`, this.getWindow())),
      this.setupBootstrap(t),
      t?.preloadFeatureFlags !== !1 && this.reloadFeatureFlags(),
      t?.captureHistoryEvents &&
        typeof window < `u` &&
        ((this._lastPathname = window?.location?.pathname || ``), this.setupHistoryEventTracking()));
  }
  getWindow() {
    return typeof window < `u` ? window : void 0;
  }
  getPersistedProperty(e) {
    return (
      (this._storageCache ||= JSON.parse(this._storage.getItem(this._storageKey) || `{}`) || {}),
      this._storageCache[e]
    );
  }
  setPersistedProperty(e, t) {
    ((this._storageCache ||= JSON.parse(this._storage.getItem(this._storageKey) || `{}`) || {}),
      t === null ? delete this._storageCache[e] : (this._storageCache[e] = t),
      this._storage.setItem(this._storageKey, JSON.stringify(this._storageCache)));
  }
  fetch(e, t) {
    let n = pt();
    return n ? n(e, t) : Promise.reject(Error(`Fetch API is not available in this environment.`));
  }
  getLibraryId() {
    return `posthog-js-lite`;
  }
  getLibraryVersion() {
    return In;
  }
  getCustomUserAgent() {}
  getCommonEventProperties() {
    return { ...super.getCommonEventProperties(), ...Ln(this.getWindow(), this._disableCaptureUrlHashes) };
  }
  setupHistoryEventTracking() {
    let e = this.getWindow();
    if (!e) return;
    let t = this;
    (Kn(
      e.history,
      `pushState`,
      (e) =>
        function (n, r, i) {
          (e.call(this, n, r, i), t.captureNavigationEvent(`pushState`));
        },
    ),
      Kn(
        e.history,
        `replaceState`,
        (e) =>
          function (n, r, i) {
            (e.call(this, n, r, i), t.captureNavigationEvent(`replaceState`));
          },
      ),
      e.addEventListener(`popstate`, () => {
        this.captureNavigationEvent(`popstate`);
      }));
  }
  captureNavigationEvent(e) {
    let t = this.getWindow();
    if (!t) return;
    let n = t.location.pathname;
    n !== this._lastPathname && (this.capture(`$pageview`, { navigation_type: e }), (this._lastPathname = n));
  }
};
export { Fn as t };
