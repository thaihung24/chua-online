/**
 * Môi trường giả để thử W2 khi chưa có src/world/environment.ts của W1: mặt phẳng, các hộp theo BLOCKS,
 * vòng bồ đoàn, ánh sáng. Cùng chữ ký `createEnvironment` (xem docs/ARCHITECTURE.md).
 */
import * as THREE from 'three';
import { BLOCKS, BOUNDS, CUSHION_COUNT, cushionSlot, INTERACTABLES } from '@/world/layout';

export interface StubEnv {
  readonly group: THREE.Group;
  update(dt: number, elapsed: number, camera: THREE.Camera): void;
  getNight(): number;
  setTimeOfDay(mode: 'auto' | 'day' | 'night'): void;
  setOfferings(o: { incenseUntil?: number; flowersUntil?: number; candleUntil?: number }): void;
  addLantern(l: { id: string; color: string; mine: boolean }): void;
  setWishRibbons(count: number): void;
  playEffect(kind: string, at?: { x: number; z: number }): void;
  leavesRemaining(): number;
  sweepAt(x: number, z: number, radius: number): number;
  respawnLeaves(count?: number): void;
  readonly groundPickMesh: THREE.Mesh;
  setQuality(q: 'low' | 'medium' | 'high'): void;
  dispose(): void;
}

export async function createEnvironment(opts: {
  scene: THREE.Scene; renderer: THREE.WebGLRenderer; quality: 'low' | 'medium' | 'high';
  onProgress?: (p: number, status: string) => void;
}): Promise<StubEnv> {
  const { scene, renderer } = opts;
  opts.onProgress?.(0.2, 'Đang dựng sân chùa…');
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  scene.background = new THREE.Color('#9cc4e4');
  scene.fog = new THREE.Fog('#b8d4ea', 60, 160);
  const group = new THREE.Group();
  const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8a7a66, 1.1);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.4);
  sun.position.set(-20, 40, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -30; sun.shadow.camera.right = 30; sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30;
  sun.shadow.camera.far = 120;
  group.add(hemi, sun, sun.target);

  const w = BOUNDS.x1 - BOUNDS.x0, d = BOUNDS.z1 - BOUNDS.z0;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: '#b3a590', roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set((BOUNDS.x0 + BOUNDS.x1) / 2, 0, (BOUNDS.z0 + BOUNDS.z1) / 2);
  ground.receiveShadow = true;
  group.add(ground);
  // lưới kẻ ô 4 m để dễ nhìn chuyển động
  const grid = new THREE.GridHelper(Math.max(w, d), Math.max(w, d) / 4, 0x6b5b45, 0x8a7a62);
  grid.position.set((BOUNDS.x0 + BOUNDS.x1) / 2, 0.01, (BOUNDS.z0 + BOUNDS.z1) / 2);
  group.add(grid);

  const mats: Record<string, string> = { 'hall-back': '#a9473a', 'bell-tower': '#7d5a3a', 'statue-base': '#c9c2b2', 'well-base': '#8a8f93', 'bodhi-trunk': '#6b4a2a', 'lotus-pond': '#5fa6c9', 'release-pond': '#5fa6c9' };
  for (const b of BLOCKS) {
    const pond = b.name.includes('pond');
    const h = pond ? 0.1 : b.name === 'hall-back' ? 9 : b.name === 'bodhi-trunk' ? 6 : 3;
    const m = new THREE.Mesh(new THREE.BoxGeometry(b.x1 - b.x0, h, b.z1 - b.z0), new THREE.MeshStandardMaterial({ color: mats[b.name] ?? '#999', roughness: 0.8 }));
    m.position.set((b.x0 + b.x1) / 2, h / 2, (b.z0 + b.z1) / 2);
    m.castShadow = !pond; m.receiveShadow = true;
    group.add(m);
  }
  // bồ đoàn
  const cush = new THREE.CylinderGeometry(0.42, 0.46, 0.12, 20);
  const cm = new THREE.MeshStandardMaterial({ color: '#b8372d', roughness: 0.8 });
  for (let i = 0; i < CUSHION_COUNT; i++) {
    const s = cushionSlot(i);
    const m = new THREE.Mesh(cush, cm);
    m.position.set(s.pos.x, 0.06, s.pos.z);
    group.add(m);
  }
  // cột đánh dấu vật tương tác
  const pm = new THREE.MeshStandardMaterial({ color: '#e0b25c', emissive: '#6b4a10' });
  for (const it of INTERACTABLES) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8), pm);
    m.position.set(it.pos.x, 0.6, it.pos.z);
    group.add(m);
  }
  scene.add(group);

  const w2 = window as unknown as { __fx?: { kind: string; at?: { x: number; z: number } }[] };
  w2.__fx = [];
  let leaves = 60;
  let night = 0;
  opts.onProgress?.(1, 'Xong');
  return {
    group,
    update() { /* tĩnh */ },
    getNight: () => night,
    setTimeOfDay(mode) { night = mode === 'night' ? 1 : 0; },
    setOfferings() { /* bỏ qua */ },
    addLantern() { /* bỏ qua */ },
    setWishRibbons() { /* bỏ qua */ },
    playEffect(kind, at) { w2.__fx?.push({ kind, at }); console.log('[fx]', kind, at ? `${at.x.toFixed(1)},${at.z.toFixed(1)}` : ''); },
    leavesRemaining: () => leaves,
    sweepAt(x, z, r) { void x; void z; void r; const n = Math.min(leaves, 1 + (Math.random() < 0.5 ? 1 : 0)); leaves -= n; return n; },
    respawnLeaves(c = 60) { leaves = c; },
    groundPickMesh: ground,
    setQuality() { /* bỏ qua */ },
    dispose() { scene.remove(group); },
  };
}
