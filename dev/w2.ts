/**
 * Harness W2. Chế độ (?mode=):
 *  - gallery : lưới nhân vật (4 áo × 2 giới) hoặc 1 nhân vật (solo=1), điều khiển bằng window.__g
 *  - world   : toàn bộ createWorld() với môi trường (thật hoặc stub)
 */
import * as THREE from 'three';
import { OUTFITS, type Gender, type OutfitId, type Profile } from '@/core/contracts';
import { createAvatar, disposeAvatarCaches, LabelLayer, type AvatarRig, type GestureId } from '@/world/avatar';
import '@/world/world.css';

const q = new URLSearchParams(location.search);
const mode = q.get('mode') ?? 'gallery';
const app = document.getElementById('app')!;

declare global { interface Window { __g?: unknown; __w?: unknown; __ready?: boolean } }

function gallery(): void {
  const W = innerWidth, H = innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  app.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const isNight = q.get('tod') === 'night';
  scene.background = new THREE.Color(q.get('bg') ?? (isNight ? '#0e1834' : '#8fb7d8'));
  scene.add(new THREE.HemisphereLight(isNight ? 0x3b4e8a : 0xdfeeff, isNight ? 0x1a151d : 0x8a7a66, isNight ? 0.72 : 1.1));
  const sun = new THREE.DirectionalLight(isNight ? 0x9db4ff : 0xfff0d8, isNight ? 0.9 : 2.6);
  sun.position.set(-4, 8, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -8; sun.shadow.camera.right = 8; sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8;
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: isNight ? '#3d3942' : '#b2a696', roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
  const layer = new LabelLayer(app);

  const rigs: AvatarRig[] = [];
  const solo = q.get('solo') === '1';
  const accGrid = q.get('accessories') === '1';
  const outfitsQ = (q.get('outfit') as OutfitId | null);
  const genderQ = (q.get('gender') as Gender | null);
  const colorQ = Number(q.get('color') ?? 0);
  const acc = q.get('acc') ?? undefined;
  const level = Number(q.get('level') ?? 1);
  const anim = (q.get('anim') ?? 'idle') as AvatarRig['getAnim'] extends () => infer R ? R : never;

  const mkProfile = (outfit: OutfitId, gender: Gender, ci: number, a = acc): Profile => ({ name: gender === 'male' ? 'Tuệ An' : 'Diệu Hạnh', gender, outfit, colorIndex: ci, accessory: a });

  const place = (rig: AvatarRig, x: number, z: number, ry = 0): void => { rig.group.position.set(x, 0, z); rig.group.rotation.y = ry; };

  if (solo) {
    const p = mkProfile(outfitsQ ?? 'trang-lam', genderQ ?? 'male', colorQ);
    const rig = createAvatar(p, level);
    rig.setLabel(p.name, level, true);
    rig.group.rotation.y = Number(q.get('ry') ?? Math.PI);
    scene.add(rig.group);
    layer.add(rig);
    rig.setAnim(anim);
    rig.setCastShadow(true);
    rigs.push(rig);
  } else if (accGrid) {
    const accList: { id: string; label: string; gender: Gender; outfit: OutfitId; color: number; lv: number }[] = [
      { id: 'hat-tram', label: 'Tràng hạt', gender: 'male', outfit: 'trang-lam', color: 0, lv: 3 },
      { id: 'scarf-gold', label: 'Khăn vàng', gender: 'female', outfit: 'trang-xam', color: 0, lv: 6 },
      { id: 'conical-hat', label: 'Nón lá', gender: 'female', outfit: 'ba-ba', color: 0, lv: 10 },
      { id: 'bag-brocade', label: 'Túi thổ cẩm', gender: 'male', outfit: 'ba-ba', color: 4, lv: 15 },
      { id: 'lotus-hand', label: 'Hoa sen', gender: 'female', outfit: 'ao-dai', color: 1, lv: 20 },
      { id: 'bracelet-jade', label: 'Vòng ngọc', gender: 'male', outfit: 'ba-ba', color: 3, lv: 30 },
      { id: 'halo-lotus', label: 'Hào quang', gender: 'female', outfit: 'ao-dai', color: 0, lv: 50 },
    ];
    accList.forEach((it, idx) => {
      const row = idx < 4 ? 0 : 1;
      const col = row === 0 ? idx - 1.5 : idx - 5;
      const p = mkProfile(it.outfit, it.gender, it.color, it.id);
      p.name = it.label;
      const rig = createAvatar(p, it.lv);
      rig.setLabel(it.label, it.lv, idx === 0);
      scene.add(rig.group);
      layer.add(rig);
      place(rig, col * 1.18, row === 0 ? 0.65 : -0.75, Number(q.get('ry') ?? Math.PI));
      rig.setAnim(it.id === 'bracelet-jade' ? 'pray' : anim);
      rig.setCastShadow(true);
      rigs.push(rig);
    });
  } else {
    const genders: Gender[] = ['male', 'female'];
    OUTFITS.forEach((o, i) => {
      genders.forEach((g, j) => {
        const p = mkProfile(o.id, g, (i + j * 2 + colorQ) % 5);
        const rig = createAvatar(p, level);
        rig.setLabel(p.name, level, i === 1 && j === 0);
        scene.add(rig.group);
        layer.add(rig);
        place(rig, (i - 1.5) * 1.1, j * -1.4 + 0.7, Number(q.get('ry') ?? Math.PI));
        rig.setAnim(anim);
        rig.setCastShadow(true);
        rigs.push(rig);
      });
    });
  }

  // camera
  const camX = Number(q.get('cx') ?? 0), camY = Number(q.get('cy') ?? (solo ? 1.05 : 1.7)), camZ = Number(q.get('cz') ?? (solo ? 3.4 : 6.2));
  const lookY = Number(q.get('ly') ?? (solo ? 0.62 : 0.6));
  camera.position.set(camX, camY, camZ);
  camera.lookAt(camX * 0.2, lookY, 0);

  const render = (): void => { renderer.render(scene, camera); layer.update(camera, W, H); };
  let elapsed = 0;
  const api = {
    rigs,
    scene,
    camera,
    advance(sec: number): void {
      const step = 1 / 30;
      for (let t = 0; t < sec; t += step) { for (const r of rigs) r.update(step); elapsed += step; }
      render();
    },
    setAnim(a: typeof anim): void { for (const r of rigs) r.setAnim(a); },
    gesture(id: GestureId, color?: string): void { for (const r of rigs) void r.playGesture(id, { color }); },
    say(t: string): void { rigs[0]?.say(t); },
    render,
    dispose(): void { disposeAvatarCaches(); },
  };
  window.__g = api;
  api.advance(Number(q.get('t') ?? 1.5));
  window.__ready = true;
}

if (mode === 'gallery') gallery();
else void import('./w2-world').then((m) => m.run(app, q));
