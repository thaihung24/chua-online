// Harness âm thanh: nút thử từng âm, nền, radio, công tắc cài đặt; và API `window.__a` để Chrome headless xuất WAV.
import { createAudio } from '@/audio';
import { CHANT_VOICES } from '@/audio/voices';
import { SPECS, renderSpec, encodeWav16, toBase64 } from '@/audio/offline';
import type { Sfx, AudioSettings } from '@/core/contracts';

// ?tap=1 : gắn bộ đo mức vào mọi kết nối tới loa để Chrome headless đo âm phát thật (window.__tap).
if (location.search.includes('tap')) {
  const analysers = new Map<BaseAudioContext, AnalyserNode>();
  const orig = AudioNode.prototype.connect as (this: AudioNode, ...a: unknown[]) => unknown;
  AudioNode.prototype.connect = function (this: AudioNode, ...a: unknown[]) {
    const dest = a[0];
    if (dest instanceof AudioDestinationNode) {
      let an = analysers.get(this.context);
      if (!an) { an = this.context.createAnalyser(); an.fftSize = 2048; analysers.set(this.context, an); }
      orig.call(this, an);
    }
    return orig.apply(this, a);
  } as typeof AudioNode.prototype.connect;
  const buf = new Float32Array(2048);
  (window as unknown as { __tap: unknown }).__tap = {
    level: () => {
      const an = [...analysers.values()][0];
      if (!an) return null;
      an.getFloatTimeDomainData(buf);
      let s = 0, p = 0;
      for (const v of buf) { s += v * v; p = Math.max(p, Math.abs(v)); }
      return { rms: Math.sqrt(s / buf.length), peak: p, state: an.context.state, time: an.context.currentTime };
    },
  };
}

const audio = createAudio();
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const SFX: Sfx[] = ['mo', 'bell', 'bellBig', 'bead', 'incense', 'flower', 'candle', 'lantern', 'bow', 'click', 'chime', 'levelUp', 'sweep', 'que', 'splash', 'ribbon'];

const sfxBox = $('sfx');
for (const s of SFX) {
  const b = document.createElement('button');
  b.textContent = s;
  b.onclick = () => { audio.unlock(); audio.play(s); };
  sfxBox.appendChild(b);
}
const toggle = (btn: HTMLElement, on: (v: boolean) => void): void => {
  btn.onclick = () => {
    audio.unlock();
    const v = !btn.classList.contains('on');
    btn.classList.toggle('on', v);
    on(v);
  };
};
toggle($('amb'), (v) => audio.setAmbient(v));
let stopMo: (() => void) | null = null;
toggle($('mo'), (v) => { stopMo?.(); stopMo = v ? audio.startMoLoop(80) : null; });
const voiceSel = $<HTMLSelectElement>('voice');
for (const v of CHANT_VOICES) voiceSel.add(new Option(`${v.name} — ${v.desc}`, v.id));
const radioBtn = $('radio');
const radio = (): void => audio.setChantRadio(radioBtn.classList.contains('on'), voiceSel.value);
toggle(radioBtn, radio);
voiceSel.onchange = radio;
$<HTMLInputElement>('night').oninput = (ev) => audio.setNight(Number((ev.target as HTMLInputElement).value));
$<HTMLInputElement>('vol').oninput = (ev) => audio.configure({ ambientVolume: Number((ev.target as HTMLInputElement).value) });

const sw = $('sw');
for (const k of ['master', 'ambient', 'sfx', 'chant'] as const) {
  const b = document.createElement('button');
  const paint = (s: AudioSettings): void => { b.textContent = `${k}: ${s[k] ? 'bật' : 'tắt'}`; b.classList.toggle('on', !!s[k]); };
  paint(audio.settings());
  b.onclick = () => audio.configure({ [k]: !audio.settings()[k] });
  audio.onChange(paint);
  sw.appendChild(b);
}

const log = (m: string): void => { $('log').textContent += m + '\n'; };
$('exp').onclick = async () => {
  for (const sp of SPECS) {
    const r = await renderSpec(sp);
    log(`${sp.name}: ${(encodeWav16(r).length / 1024).toFixed(0)} KB`);
  }
};

declare global { interface Window { __a: unknown } }
window.__a = {
  names: () => SPECS.map((s) => s.name),
  render: async (name: string): Promise<string> => {
    const sp = SPECS.find((s) => s.name === name);
    if (!sp) throw new Error('không có ' + name);
    return toBase64(encodeWav16(await renderSpec(sp)));
  },
  audio,
  /** vòng mõ do test điều khiển (để dừng được từ puppeteer) */
  loop: (() => {
    let stop: (() => void) | null = null;
    return {
      start: (bpm: number) => { stop?.(); stop = audio.startMoLoop(bpm); },
      stop: () => { stop?.(); stop = null; },
    };
  })(),
};
