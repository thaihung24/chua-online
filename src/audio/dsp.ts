// Tiện ích DSP cho âm thanh tổng hợp: bộ số ngẫu nhiên, nốt nhạc, bộ đệm nhiễu lặp mượt, đáp ứng xung hồi âm sinh ra từ nhiễu.

export type Rng = () => number;

/** Bộ sinh số ngẫu nhiên có hạt giống (dùng khi xuất WAV để kết quả lặp lại được). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const midiToHz = (m: number): number => 440 * Math.pow(2, (m - 69) / 12);
export const clamp = (x: number, a: number, b: number): number => (x < a ? a : x > b ? b : x);
/** Số cent → tỉ số tần số. */
export const cents = (c: number): number => Math.pow(2, c / 1200);

/** Thang ngũ cung (La): độ lệch nửa cung so với chủ âm. */
export const PENTA = [0, 2, 4, 7, 9];

export type NoiseKind = 'white' | 'pink' | 'brown';

/**
 * Bộ đệm nhiễu mono dùng để lặp (loop) không bị "cạch" ở chỗ nối:
 * đoạn cuối được trộn đều công suất vào đoạn đầu. Chuẩn hoá RMS ≈ 0.3.
 */
export function makeNoiseBuffer(ctx: BaseAudioContext, seconds: number, kind: NoiseKind, rng: Rng): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.floor(seconds * sr);
  const fade = Math.floor(0.12 * sr);
  const total = n + fade;
  const x = new Float32Array(total);
  if (kind === 'white') {
    for (let i = 0; i < total; i++) x[i] = rng() * 2 - 1;
  } else if (kind === 'pink') {
    // Paul Kellet (bản "refined")
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < total; i++) {
      const w = rng() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      x[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362;
      b6 = w * 0.115926;
    }
  } else {
    let last = 0;
    for (let i = 0; i < total; i++) {
      last = (last + 0.02 * (rng() * 2 - 1)) / 1.02;
      x[i] = last;
    }
  }
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = x[i];
  for (let i = 0; i < fade; i++) {
    const p = i / fade;
    out[i] = x[i] * Math.sin(p * Math.PI * 0.5) + x[n + i] * Math.cos(p * Math.PI * 0.5);
  }
  let s2 = 0;
  for (let i = 0; i < n; i++) s2 += out[i] * out[i];
  const rms = Math.sqrt(s2 / n) || 1;
  const g = 0.3 / rms;
  for (let i = 0; i < n; i++) out[i] *= g;
  const buf = ctx.createBuffer(1, n, sr);
  buf.copyToChannel(out, 0);
  return buf;
}

/**
 * Đáp ứng xung hồi âm "gian chánh điện": nhiễu tắt dần theo hàm mũ, càng về cuối càng tối (lọc thông thấp một cực),
 * thêm vài tiếng vọng sớm. Hai kênh khác nhau cho cảm giác rộng.
 */
export function makeReverbIR(ctx: BaseAudioContext, seconds: number, rng: Rng): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.floor(seconds * sr);
  const buf = ctx.createBuffer(2, n, sr);
  const tau = seconds / 5.2; // −45 dB ở cuối
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      const env = Math.exp(-t / tau);
      // hệ số lọc: đầu sáng (≈0.85) → cuối tối (≈0.12)
      const a = 0.12 + 0.73 * Math.exp(-t / (seconds * 0.22));
      lp += a * ((rng() * 2 - 1) - lp);
      const fadeIn = Math.min(1, t / 0.012);
      d[i] = lp * env * fadeIn;
    }
    // tiếng vọng sớm
    const taps = [0.011, 0.023, 0.037, 0.052];
    for (let k = 0; k < taps.length; k++) {
      const idx = Math.floor((taps[k] + ch * 0.004) * sr);
      if (idx < n) d[idx] += (k % 2 ? -1 : 1) * 0.5 * Math.pow(0.7, k);
    }
    let s2 = 0;
    for (let i = 0; i < n; i++) s2 += d[i] * d[i];
    const g = 1 / Math.sqrt(s2 || 1);
    for (let i = 0; i < n; i++) d[i] *= g * 0.9;
  }
  return buf;
}

/** Đường cong bão hoà mềm: tuyến tính dưới 0.8, tiệm cận 0.98 — bảo đảm không bao giờ clip. */
export function makeSoftClipCurve(): Float32Array<ArrayBuffer> {
  const N = 2048;
  const c = new Float32Array(new ArrayBuffer(N * 4));
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * 2 - 1;
    const a = Math.abs(x);
    const y = a < 0.8 ? a : 0.8 + 0.18 * Math.tanh((a - 0.8) / 0.18);
    c[i] = x < 0 ? -y : y;
  }
  return c;
}
