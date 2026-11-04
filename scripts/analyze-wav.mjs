// Phân tích WAV để kiểm tra âm tổng hợp bằng số liệu: peak/RMS/độ dài/DC/clip/centroid phổ/đỉnh phổ/thời gian tắt/nhịp.
// Dùng: node scripts/analyze-wav.mjs <file|thư-mục>… [--onsets] [--json] [--seg=giây-giây]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

function parseWav(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF') throw new Error('không phải WAV');
  let off = 12, fmt = null, data = null;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') fmt = { tag: buf.readUInt16LE(off + 8), ch: buf.readUInt16LE(off + 10), sr: buf.readUInt32LE(off + 12), bits: buf.readUInt16LE(off + 22) };
    if (id === 'data') { data = buf.subarray(off + 8, off + 8 + size); break; }
    off += 8 + size + (size & 1);
  }
  if (!fmt || !data) throw new Error('thiếu fmt/data');
  const bps = fmt.bits / 8;
  const n = Math.floor(data.length / (bps * fmt.ch));
  const chans = Array.from({ length: fmt.ch }, () => new Float32Array(n));
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < fmt.ch; c++) {
      const p = (i * fmt.ch + c) * bps;
      let v;
      if (fmt.tag === 3) v = fmt.bits === 32 ? data.readFloatLE(p) : data.readDoubleLE(p);
      else if (fmt.bits === 16) v = data.readInt16LE(p) / 32768;
      else if (fmt.bits === 24) v = data.readIntLE(p, 3) / 8388608;
      else v = data.readInt32LE(p) / 2147483648;
      chans[c][i] = v;
    }
  }
  return { sr: fmt.sr, chans };
}

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}

const db = (x) => (x > 1e-9 ? 20 * Math.log10(x) : -180);

/** Phổ công suất trung bình (Welch, cửa sổ Hann). */
function avgSpectrum(x, sr, N = 8192) {
  const half = N / 2;
  const win = new Float32Array(N);
  for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1));
  const acc = new Float64Array(half);
  const re = new Float64Array(N), im = new Float64Array(N);
  let frames = 0;
  const hop = N / 2;
  for (let s = 0; s + N <= x.length; s += hop) {
    let e = 0;
    for (let i = 0; i < N; i++) { re[i] = x[s + i] * win[i]; im[i] = 0; e += x[s + i] * x[s + i]; }
    if (e / N < 1e-12) continue; // bỏ khung im lặng để không kéo thấp phổ
    fft(re, im);
    for (let k = 0; k < half; k++) acc[k] += re[k] * re[k] + im[k] * im[k];
    frames++;
  }
  if (!frames && x.length) {
    // tệp ngắn hơn một cửa sổ: đệm số 0
    for (let i = 0; i < N; i++) { re[i] = (x[i] ?? 0) * win[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k < half; k++) acc[k] = re[k] * re[k] + im[k] * im[k];
    frames = 1;
  }
  for (let k = 0; k < half; k++) acc[k] /= Math.max(1, frames);
  return { spec: acc, binHz: sr / N };
}

function analyze(path, opts) {
  let { sr, chans } = parseWav(readFileSync(path));
  if (opts.seg) chans = chans.map((c) => c.subarray(Math.round(opts.seg[0] * sr), Math.round(opts.seg[1] * sr)));
  const n = chans[0].length;
  const mono = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (const c of chans) s += c[i]; mono[i] = s / chans.length; }
  let peak = 0, sum = 0, sum2 = 0, clipped = 0;
  for (const c of chans) for (let i = 0; i < n; i++) { const a = Math.abs(c[i]); if (a > peak) peak = a; if (a >= 0.999) clipped++; }
  for (let i = 0; i < n; i++) { sum += mono[i]; sum2 += mono[i] * mono[i]; }
  const rms = Math.sqrt(sum2 / n);
  const dc = sum / n;

  // đường bao theo khung 10 ms
  const fl = Math.round(sr * 0.01);
  const env = [];
  for (let s = 0; s + fl <= n; s += fl) { let e = 0; for (let i = 0; i < fl; i++) e += mono[s + i] ** 2; env.push(Math.sqrt(e / fl)); }
  const envPeak = Math.max(...env, 1e-9);
  const first = env.findIndex((v) => db(v) > -60);
  let last = -1;
  for (let i = env.length - 1; i >= 0; i--) if (db(env[i]) > db(envPeak) - 60 && db(env[i]) > -75) { last = i; break; }
  const silentFrames = env.filter((v) => db(v) < -70).length / Math.max(1, env.length);
  const tPeak = env.indexOf(envPeak) * 0.01;

  const { spec, binHz } = avgSpectrum(mono, sr);
  let tot = 0, wsum = 0;
  const lo = Math.round(20 / binHz), hi = Math.min(spec.length, Math.round(20000 / binHz));
  for (let k = lo; k < hi; k++) { tot += spec[k]; wsum += spec[k] * k * binHz; }
  const centroid = tot ? wsum / tot : 0;
  const bands = [[20, 200], [200, 600], [600, 1200], [1200, 4000], [4000, 20000]].map(([a, b]) => {
    let e = 0;
    for (let k = Math.round(a / binHz); k < Math.min(spec.length, Math.round(b / binHz)); k++) e += spec[k];
    return tot ? (100 * e) / tot : 0;
  });
  // đỉnh phổ: cực đại cục bộ, cách nhau ≥ 40 Hz
  const cand = [];
  const smooth = (k) => (spec[k - 1] + 2 * spec[k] + spec[k + 1]) / 4;
  for (let k = Math.max(2, lo); k < hi - 2; k++) {
    const v = smooth(k);
    if (v > smooth(k - 1) && v >= smooth(k + 1)) cand.push([k * binHz, v]);
  }
  cand.sort((a, b) => b[1] - a[1]);
  const peaks = [];
  for (const [f, v] of cand) {
    if (peaks.every((p) => Math.abs(p[0] - f) > 40)) peaks.push([f, v]);
    if (peaks.length >= 5) break;
  }
  const pmax = peaks[0]?.[1] ?? 1;
  // mức theo dải 1/3 octave (dB tương đối so với dải mạnh nhất)
  const third = [];
  for (let c = 50; c < 12000; c *= Math.pow(2, 1 / 3)) {
    let e = 0;
    for (let k = Math.round(c / 1.122 / binHz); k < Math.min(spec.length, Math.round(c * 1.122 / binHz)); k++) e += spec[k];
    third.push([Math.round(c), e]);
  }
  const tmax = Math.max(...third.map((x) => x[1]), 1e-30);
  // năng lượng tuyệt đối từng dải (dB, mốc tuỳ ý nhưng nhất quán giữa các đoạn → so sánh trước/sau)
  const absBands = [[20, 200], [200, 600], [600, 1200], [1200, 4000], [4000, 20000]].map(([a, b]) => {
    let e = 0;
    for (let k = Math.round(a / binHz); k < Math.min(spec.length, Math.round(b / binHz)); k++) e += spec[k];
    return +(10 * Math.log10(e + 1e-12)).toFixed(1);
  });
  const res = {
    absBands,
    third: third.map(([c, e]) => `${c}:${(10 * Math.log10(e / tmax + 1e-12)).toFixed(0)}`).join(' '),
    file: basename(path), sr, ch: chans.length, dur: n / sr,
    peakDb: db(peak), rmsDb: db(rms), dc, clipped,
    centroid, bands,
    peaks: peaks.map(([f, v]) => ({ hz: Math.round(f), rel: +(10 * Math.log10(v / pmax)).toFixed(1) })),
    onsetS: first * 0.01, peakAtS: tPeak, tailS: last >= 0 ? last * 0.01 : 0, silent: silentFrames,
  };
  if (opts.onsets) {
    // phát hiện tiếng gõ: khung 2 ms, vượt ngưỡng tương đối và tăng đột ngột
    const f2 = Math.round(sr * 0.002);
    const e2 = [];
    for (let s = 0; s + f2 <= n; s += f2) { let e = 0; for (let i = 0; i < f2; i++) e += mono[s + i] ** 2; e2.push(Math.sqrt(e / f2)); }
    const thr = Math.max(...e2) * 0.25;
    const ons = [];
    for (let i = 1; i < e2.length; i++) {
      if (e2[i] > thr && e2[i - 1] <= thr && (!ons.length || (i - ons[ons.length - 1]) * 0.002 > 0.15)) ons.push(i);
    }
    const t = ons.map((i) => i * 0.002);
    const d = t.slice(1).map((v, i) => v - t[i]);
    const m = d.reduce((a, b) => a + b, 0) / Math.max(1, d.length);
    const sd = Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, d.length));
    res.onsets = { count: t.length, meanInterval: m, sd, maxDev: Math.max(0, ...d.map((x) => Math.abs(x - m))) };
  }
  return res;
}

const args = process.argv.slice(2);
const segArg = args.find((a) => a.startsWith('--seg='));
const seg = segArg ? segArg.slice(6).split('-').map(Number) : null; // --seg=1.0-1.5 : chỉ phân tích đoạn này (giây)
const flags = new Set(args.filter((a) => a.startsWith('--')));
const paths = args.filter((a) => !a.startsWith('--'));
const files = [];
for (const p of paths.length ? paths : ['dev/audio-out']) {
  if (statSync(p).isDirectory()) for (const f of readdirSync(p).sort()) { if (f.endsWith('.wav')) files.push(join(p, f)); }
  else files.push(p);
}
const results = files.map((f) => analyze(f, { onsets: flags.has('--onsets'), seg }));
if (flags.has('--json')) console.log(JSON.stringify(results, null, 1));
else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(pad('file', 30) + pad('dur', 7) + pad('peak', 8) + pad('rms', 8) + pad('dc', 9) + pad('clip', 5) + pad('cent', 7) + pad('tail', 6) + pad('sil%', 5) + 'bands%(<200|-600|-1.2k|-4k|>4k)  peaks(Hz)');
  for (const r of results) {
    console.log(
      pad(r.file.replace('.wav', ''), 30) + pad(r.dur.toFixed(1), 7) + pad(r.peakDb.toFixed(1), 8) + pad(r.rmsDb.toFixed(1), 8) +
      pad(r.dc.toExponential(0), 9) + pad(r.clipped, 5) + pad(Math.round(r.centroid), 7) + pad(r.tailS.toFixed(1), 6) + pad((r.silent * 100).toFixed(0), 5) +
      r.bands.map((b) => b.toFixed(0)).join('|') + '  ' + r.peaks.map((p) => `${p.hz}(${p.rel})`).join(' '),
    );
    if (flags.has('--spectrum')) console.log('   1/3-oct:', r.third, '\n   abs-bands(dB):', r.absBands.join(' '));
    if (r.onsets) console.log('   nhịp:', JSON.stringify({ n: r.onsets.count, mean: +r.onsets.meanInterval.toFixed(4), sd: +r.onsets.sd.toFixed(5), maxDev: +r.onsets.maxDev.toFixed(5) }));
  }
}
