/**
 * Harness W1: dựng renderer + camera bay/orbit để xem riêng môi trường 3D. Tham số URL: ?cam=gate&time=day|night|auto&q=low|medium|high
 * Điều khiển: kéo chuột = xoay, lăn chuột = zoom, WASD/QE = bay. window.__w1 phục vụ chụp ảnh tự động.
 */
import * as THREE from 'three';
import { createEnvironment, type Environment } from '@/world/environment';

export const PRESETS: Record<string, { p: [number, number, number]; t: [number, number, number] }> = {
  gate: { p: [0, 3.2, 33], t: [0, 3.6, -18] },
  gateout: { p: [0, 3.8, 49.5], t: [0, 4.2, 22] },
  gatehigh: { p: [0, 16, 48], t: [0, 3, -8] },
  tamquan: { p: [0, 3.8, 27], t: [0, 4.6, 40] },
  hallclose: { p: [0, 3.05, -7.8], t: [0, 3.3, -24] },
  hallside: { p: [-13, 3.5, -9], t: [0, 4, -24] },
  pond: { p: [-7.2, 3.3, 22.5], t: [-20, 0.3, 13.8] },
  pondhigh: { p: [-8, 10, 28], t: [-20, 0, 13] },
  release: { p: [8.5, 3.2, 22.5], t: [19.5, 0.5, 13.8] },
  bodhi: { p: [-9.5, 3.2, 5.5], t: [-21.8, 5.4, -5.0] },
  bodhiwide: { p: [-5, 6.5, 13], t: [-21.8, 5.5, -5.0] },
  zen: { p: [17.5, 3.8, 10.8], t: [28, 0.5, 4] },
  zenhigh: { p: [15, 11.5, 15], t: [28, 0.2, 4] },
  quanam: { p: [22.2, 2.8, -8.2], t: [28.5, 3.7, -16.8] },
  well: { p: [-21.4, 2.85, -21.2], t: [-29.75, 1.45, -25.75] },
  stream: { p: [-19.2, 3.1, 8.6], t: [-25.0, 0.5, 3.5] },
  bell: { p: [8.2, 2.7, -3.2], t: [15.25, 3.1, -8.0] },
  altar: { p: [0, 2.3, -7.2], t: [0, 1.5, -17] },
  broom: { p: [4.1, 1.95, 23.4], t: [7.65, 1.0, 21.05] },
  aerial: { p: [0, 72, 60], t: [0, 0, -2] },
  yard: { p: [0, 3.0, 35], t: [0, 2, 18] },
};

declare global { interface Window { __w1?: unknown } }

async function main(): Promise<void> {
  const q = new URLSearchParams(location.search);
  if (q.get('clean') === '1') document.body.classList.add('clean');
  const quality = (q.get('q') as 'low' | 'medium' | 'high') ?? 'high';
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 400);
  const status = document.getElementById('status')!;

  const env: Environment = await createEnvironment({ scene, renderer, quality, onProgress: (p, s) => { status.textContent = `${Math.round(p * 100)}% ${s}`; } });
  status.textContent = '';
  const mode = q.get('time');
  if (mode === 'day' || mode === 'night' || mode === 'auto') env.setTimeOfDay(mode);

  // điều khiển
  let yaw = 0, pitch = 0;
  const pos = new THREE.Vector3(0, 3.4, 34);
  function look(t: [number, number, number]): void {
    const d = new THREE.Vector3(t[0], t[1], t[2]).sub(pos);
    yaw = Math.atan2(-d.x, -d.z);
    pitch = Math.atan2(d.y, Math.hypot(d.x, d.z));
  }
  function setCam(name: string): void {
    const pr = PRESETS[name];
    if (!pr) return;
    pos.set(...pr.p);
    look(pr.t);
  }
  setCam(q.get('cam') ?? 'gate');
  const bar = document.getElementById('bar')!;
  const mk = (label: string, fn: () => void): void => { const b = document.createElement('button'); b.textContent = label; b.onclick = fn; bar.appendChild(b); };
  const sel = document.createElement('select');
  for (const k of Object.keys(PRESETS)) { const o = document.createElement('option'); o.value = k; o.textContent = k; sel.appendChild(o); }
  sel.onchange = () => setCam(sel.value);
  bar.appendChild(sel);
  mk('Ngày', () => env.setTimeOfDay('day')); mk('Đêm', () => env.setTimeOfDay('night')); mk('Tự động', () => env.setTimeOfDay('auto'));
  mk('Hương', () => { env.setOfferings({ incenseUntil: Date.now() + 120000, flowersUntil: Date.now() + 120000, candleUntil: Date.now() + 120000 }); env.playEffect('incense'); });
  mk('Tắt lễ vật', () => env.setOfferings({}));
  mk('Chuông', () => env.playEffect('bell'));
  mk('Đèn', () => { const cols = ['#ffb347', '#ff7aa8', '#7ad7ff', '#fff27a', '#c59bff']; env.addLantern({ id: 'l' + Math.random(), color: cols[Math.floor(Math.random() * 5)], mine: Math.random() > 0.7 }); env.playEffect('lanternLaunch'); });
  mk('Ruy-băng +10', () => env.setWishRibbons(10));
  mk('Phóng sinh', () => env.playEffect('release'));
  mk('Lộc', () => env.playEffect('loc'));
  mk('Quét lá', () => { env.sweepAt(0, 20, 8); env.sweepAt(7, 22, 6); });
  mk('Sen nở', () => env.playEffect('lotusBloom'));
  mk('Hoa', () => env.playEffect('flowers'));

  let drag = false, lx = 0, ly = 0;
  renderer.domElement.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; });
  addEventListener('pointerup', () => { drag = false; });
  addEventListener('pointermove', (e) => { if (!drag) return; yaw -= (e.clientX - lx) * 0.004; pitch = Math.max(-1.4, Math.min(1.4, pitch - (e.clientY - ly) * 0.004)); lx = e.clientX; ly = e.clientY; });
  const keys = new Set<string>();
  addEventListener('keydown', (e) => keys.add(e.key.toLowerCase()));
  addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
  renderer.domElement.addEventListener('wheel', (e) => { const f = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)); pos.addScaledVector(f, -e.deltaY * 0.02); }, { passive: true });
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

  const info = document.getElementById('info')!;
  const clock = new THREE.Clock();
  let frames = 0, acc = 0, elapsed = 0;
  let fixedDt = 0; // chụp ảnh: khung hình giả lập
  const api = {
    env, renderer, camera, scene, setCam, pos, look,
    setFixedDt(v: number): void { fixedDt = v; },
    calls: (): number => renderer.info.render.calls,
    tris: (): number => renderer.info.render.triangles,
    step(n: number, dt = 0.05): void { for (let i = 0; i < n; i++) frame(dt); },
    frame,
  };
  window.__w1 = api;

  function frame(dtOverride?: number): void {
    const dt = dtOverride ?? (fixedDt || Math.min(clock.getDelta(), 0.1));
    const sp = (keys.has('shift') ? 18 : 6) * dt;
    const fw = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)), rt = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    if (keys.has('w')) pos.addScaledVector(fw, sp); if (keys.has('s')) pos.addScaledVector(fw, -sp);
    if (keys.has('d')) pos.addScaledVector(rt, sp); if (keys.has('a')) pos.addScaledVector(rt, -sp);
    if (keys.has('e')) pos.y += sp; if (keys.has('q')) pos.y -= sp;
    camera.position.copy(pos);
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
    elapsed += dt;
    env.update(dt, elapsed, camera);
    renderer.render(scene, camera);
    frames++; acc += dt;
    if (acc > 0.5) {
      info.textContent = `fps ${(frames / acc).toFixed(0)}  calls ${renderer.info.render.calls}  tris ${(renderer.info.render.triangles / 1000).toFixed(0)}k\nnight ${env.getNight().toFixed(2)}  leaves ${env.leavesRemaining()}`;
      frames = 0; acc = 0;
    }
  }
  renderer.setAnimationLoop(() => frame());
}
void main();
