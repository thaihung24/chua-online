/**
 * Môi trường 3D Chùa Liên Hoa (hợp đồng W1 → W2):
 * Ghép nối bầu trời ngày/đêm theo giờ Việt Nam, mặt sân & tường bao, cổng Tam Quan & đại lộ đèn đá - bonsai - cờ phướn,
 * Chánh điện Đại Hùng Bảo Điện, lễ vật động (hương/hoa/nến), ống xăm, giá chổi & 108 lá bồ đề quét được,
 * Gác chuông Đại Hồng Chung, Ao Sen & đèn hoa đăng, Hồ Phóng Sinh, Cây Bồ Đề & ruy-băng nguyện,
 * Sân Thiền 8 bồ đoàn, Vườn Quan Thế Âm, Giếng Ngọc & Suối Ngọc chảy qua cầu đá, hạt bụi nắng/đom đóm.
 */
import * as THREE from 'three';
import { Batch, createShared, disposeTree, TAU } from './env/core';
import { buildBellTower } from './env/bell';
import { buildBodhi } from './env/bodhi';
import { buildCoop, type CoopPart } from './env/coop';
import { buildCourtyard } from './env/courtyard';
import { buildGardens } from './env/gardens';
import { createGround } from './env/ground';
import { buildHall, HALL } from './env/hall';
import { createMaterials } from './env/materials';
import { buildOfferings } from './env/offerings';
import { AmbientField, Halos, type HaloSpec, ParticleField } from './env/particles';
import { buildPonds } from './env/ponds';
import { SkyRig } from './env/sky';

export interface Environment {
  /** Nhóm gốc đã chứa toàn bộ khuôn viên + trời. W2 add nhân vật vào scene riêng (cùng scene). */
  readonly group: THREE.Group;
  /** Khu vườn & chuồng gà sau chùa + quản lý gà sổng chuồng thất lạc. */
  readonly coop: CoopPart;
  update(
    dt: number,
    elapsed: number,
    camera: THREE.Camera,
    playerPos?: { x: number; z: number },
    isFree?: (x: number, z: number) => boolean,
  ): void;
  getNight(): number;
  setTimeOfDay(mode: 'auto' | 'day' | 'night'): void;
  setOfferings(o: { incenseUntil?: number; flowersUntil?: number; candleUntil?: number }): void;
  addLantern(l: { id: string; color: string; mine: boolean }): void;
  setWishRibbons(count: number): void;
  /** Hiệu ứng tức thời. at = vị trí thế giới (mặc định theo kind). */
  playEffect(
    kind:
      | 'incense' | 'flowers' | 'candle' | 'bell' | 'release' | 'loc'
      | 'lanternLaunch' | 'splash' | 'ribbon' | 'lotusBloom' | 'chickenFeed',
    at?: { x: number; z: number },
  ): void;
  /** Lá đa / lá bồ đề rụng trên sân (quét được). */
  leavesRemaining(): number;
  sweepAt(x: number, z: number, radius: number): number;
  respawnLeaves(count?: number): void;
  /** Mặt phẳng nền để raycast chạm-để-đi. */
  readonly groundPickMesh: THREE.Mesh;
  setQuality(q: 'low' | 'medium' | 'high'): void;
  dispose(): void;
}

const nextTick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

export async function createEnvironment(opts: {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  quality: 'low' | 'medium' | 'high';
  onProgress?: (p: number, status: string) => void;
}): Promise<Environment> {
  const { scene, renderer, onProgress } = opts;
  let currentQuality: 'low' | 'medium' | 'high' = opts.quality;

  const group = new THREE.Group();
  group.name = 'temple-environment';

  const shared = createShared();
  const mats = createMaterials();
  const haloSpecs: HaloSpec[] = [];

  // Gộp toàn bộ kiến trúc & tiểu cảnh tĩnh ngoài Chánh điện vào 2 Batch dùng chung để giữ draw calls thấp (<100)
  const campusCast = new Batch(true, true);
  const campusFlat = new Batch(false, true);

  // Hệ hạt dùng chung (khói thường + tia sáng vàng/ngọc cộng tính)
  const smoke = new ParticleField(260, false, shared);
  const sparks = new ParticleField(420, true, shared);

  onProgress?.(0.1, 'Đang trải sân đá…');
  await nextTick();
  const sky = new SkyRig(scene, renderer);
  const ground = createGround(mats, () => currentQuality);
  const courtyard = buildCourtyard(mats, shared, haloSpecs, sparks, campusCast, campusFlat);

  onProgress?.(0.3, 'Đang dựng chánh điện…');
  await nextTick();
  const hall = buildHall(mats, mats.textures.glow);
  for (const lx of [-9.95, -6.65, -3.35, 0, 3.35, 6.65, 9.95]) {
    haloSpecs.push({ x: lx, y: HALL.platY + 3.7, z: HALL.colZ + 0.2, size: 1.9, color: 0xff622e, flicker: 0.1, day: 0.08 });
  }
  const offerings = buildOfferings(mats, mats.textures.glow, smoke, sparks, () => Date.now());
  const bell = buildBellTower(mats, mats.textures.glow, haloSpecs, sparks, campusCast);

  onProgress?.(0.52, 'Đang thả sen xuống ao…');
  await nextTick();
  const ponds = buildPonds(mats, shared, sky, mats.textures.glow, haloSpecs, sparks, campusCast, campusFlat);

  onProgress?.(0.72, 'Đang trồng cây bồ đề…');
  await nextTick();
  const bodhi = buildBodhi(mats, shared, haloSpecs, sparks, campusCast, campusFlat);

  onProgress?.(0.88, 'Đang bày sân thiền & vườn gà sau chùa…');
  await nextTick();
  const gardens = buildGardens(mats, shared, sky, mats.textures.glow, haloSpecs, sparks, campusCast, campusFlat);
  const coop = buildCoop(mats, haloSpecs, sparks, campusCast, campusFlat);

  campusCast.build(group, 'campus-cast');
  campusFlat.build(group, 'campus-flat');

  onProgress?.(0.96, 'Đang thắp đèn…');
  const halos = new Halos(haloSpecs, shared, shared, shared.uNight);
  const dust = new AmbientField(200, 'dust', new THREE.Vector3(38, 9, 38), shared, shared, 0.4);
  const fireflies = new AmbientField(150, 'firefly', new THREE.Vector3(40, 5.5, 40), shared, shared, 0.35);

  group.add(
    ground.group,
    courtyard.group,
    hall.group,
    offerings.group,
    bell.group,
    ponds.group,
    bodhi.group,
    gardens.group,
    coop.group,
    smoke.points,
    sparks.points,
    halos.points,
    dust.points,
    fireflies.points,
  );
  scene.add(group);

  let lightsOn = true;
  function applyQuality(q: 'low' | 'medium' | 'high'): void {
    currentQuality = q;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    if (q === 'high') {
      renderer.setPixelRatio(Math.min(dpr, 2));
      sky.setShadows(true, 2048);
      lightsOn = true;
    } else if (q === 'medium') {
      renderer.setPixelRatio(Math.min(dpr, 1.5));
      sky.setShadows(true, 1024);
      lightsOn = true;
    } else {
      renderer.setPixelRatio(1);
      sky.setShadows(false, 512);
      lightsOn = false;
    }
  }
  applyQuality(currentQuality);
  onProgress?.(1, 'Đang thắp đèn…');

  const cGold = new THREE.Color(1.0, 0.84, 0.38);
  const cAmber = new THREE.Color(1.0, 0.52, 0.16);
  const cPink = new THREE.Color(1.0, 0.68, 0.84);
  const cWhite = new THREE.Color(1.0, 0.96, 0.92);
  const cAqua = new THREE.Color(0.65, 0.96, 1.0);
  const cSmoke = new THREE.Color(0.9, 0.9, 0.94);

  return {
    group,
    coop,
    groundPickMesh: ground.pick,
    getNight: () => sky.getNight(),
    setTimeOfDay: (mode) => sky.setMode(mode),
    setOfferings: (o) => offerings.set(o),
    addLantern: (l) => ponds.addLantern(l),
    setWishRibbons: (count) => bodhi.setWishRibbons(count),
    leavesRemaining: () => courtyard.leavesRemaining(),
    sweepAt: (x, z, radius) => courtyard.sweepAt(x, z, radius),
    respawnLeaves: (count) => courtyard.respawnLeaves(count),
    setQuality: applyQuality,

    playEffect(kind, at): void {
      switch (kind) {
        case 'incense': {
          offerings.flare('incense');
          const px = at?.x ?? offerings.burnerPos.x;
          const pz = at?.z ?? offerings.burnerPos.z;
          const py = offerings.burnerPos.y + 0.55;
          for (let i = 0; i < 24; i++) {
            const a = (i / 24) * TAU;
            sparks.spawn(px + Math.cos(a) * 0.25, py, pz + Math.sin(a) * 0.25, Math.cos(a) * 0.55, 0.9 + Math.random() * 0.9, Math.sin(a) * 0.55, 1.1 + Math.random() * 0.5, 0.14, 0.02, cGold, cAmber, 0.9, 0.15, 0.9, 1, 0.25);
          }
          for (let i = 0; i < 10; i++) {
            smoke.spawn(px + (Math.random() - 0.5) * 0.35, py, pz + (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.14, 0.55 + Math.random() * 0.3, (Math.random() - 0.5) * 0.14, 3.2, 0.12, 0.85, cSmoke, null, 0.32, -0.02, 0.2, 0, 0.16);
          }
          break;
        }
        case 'flowers': {
          offerings.flare('flowers');
          const px = at?.x ?? offerings.flowerPos.x;
          const pz = at?.z ?? offerings.flowerPos.z;
          const py = offerings.flowerPos.y + 0.35;
          for (let i = 0; i < 32; i++) {
            const a = Math.random() * TAU, rad = Math.random() * 1.6;
            sparks.spawn(
              px + Math.cos(a) * rad, py + Math.random() * 0.9, pz + Math.sin(a) * rad * 0.6,
              Math.cos(a) * 0.6, 0.5 + Math.random() * 0.8, Math.sin(a) * 0.6,
              1.6 + Math.random() * 0.8, 0.16, 0.04, i % 2 ? cPink : cWhite, cGold, 0.92, 0.55, 0.7, 0, 0.4,
            );
          }
          break;
        }
        case 'candle': {
          offerings.flare('candle');
          const targets: [number, number][] = at ? [[at.x, at.z]] : [[-offerings.candlePos.x, offerings.candlePos.z], [offerings.candlePos.x, offerings.candlePos.z]];
          for (const [cx, cz] of targets) {
            for (let i = 0; i < 18; i++) {
              const a = Math.random() * TAU;
              sparks.spawn(cx, 1.92, cz, Math.cos(a) * 0.5, 0.9 + Math.random() * 1.1, Math.sin(a) * 0.5, 0.85 + Math.random() * 0.45, 0.14, 0.02, cGold, cAmber, 0.95, 0.2, 1.0, 1, 0.2);
            }
          }
          break;
        }
        case 'bell': {
          bell.ring();
          if (at) {
            for (let i = 0; i < 16; i++) {
              const a = (i / 16) * TAU;
              sparks.spawn(at.x, 1.4, at.z, Math.cos(a) * 1.4, 0.6, Math.sin(a) * 1.4, 0.9, 0.14, 0.02, cGold, cAmber, 0.85, 0.1, 1.2, 1, 0.15);
            }
          }
          break;
        }
        case 'release': {
          ponds.triggerRelease(at);
          break;
        }
        case 'loc': {
          bodhi.triggerLoc(at);
          break;
        }
        case 'lanternLaunch': {
          const px = at?.x ?? ponds.lotusStepPos.x;
          const pz = at?.z ?? ponds.lotusStepPos.z;
          ponds.spawnRipple(px, pz, 0xffc66d, 2.5);
          for (let i = 0; i < 28; i++) {
            const a = Math.random() * TAU;
            sparks.spawn(px + Math.cos(a) * 0.4, 0.22, pz + Math.sin(a) * 0.4, Math.cos(a) * 0.55, 0.8 + Math.random() * 1.2, Math.sin(a) * 0.55, 1.4 + Math.random() * 0.7, 0.15, 0.03, cGold, cPink, 0.9, 0.1, 0.7, 1, 0.3);
          }
          break;
        }
        case 'splash': {
          const px = at?.x ?? gardens.wellPos.x;
          const pz = at?.z ?? gardens.wellPos.z;
          const isWell = Math.hypot(px - gardens.wellPos.x, pz - gardens.wellPos.z) < 5;
          const py = isWell ? gardens.wellPos.y : 0.15;
          if (!isWell) ponds.spawnRipple(px, pz, 0x9ef5ff, 2.0);
          for (let i = 0; i < 28; i++) {
            const a = Math.random() * TAU, sp = 0.45 + Math.random() * 1.15;
            sparks.spawn(px, py, pz, Math.cos(a) * sp, 1.6 + Math.random() * 1.5, Math.sin(a) * sp, 0.85 + Math.random() * 0.45, 0.13, 0.03, cAqua, cWhite, 0.9, 3.8, 0.4, 1, 0.05);
          }
          break;
        }
        case 'ribbon': {
          bodhi.triggerRibbon(at);
          break;
        }
        case 'lotusBloom': {
          ponds.triggerLotusBloom(at);
          break;
        }
        case 'chickenFeed': {
          coop.triggerFeed();
          break;
        }
      }
    },

    update(
      dt: number,
      elapsed: number,
      camera: THREE.Camera,
      playerPos?: { x: number; z: number },
      isFree?: (x: number, z: number) => boolean,
    ): void {
      const clampedDt = Math.min(dt, 0.12);
      shared.uTime.value = elapsed;
      if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        const pc = camera as THREE.PerspectiveCamera;
        const h = renderer.domElement.height || 720;
        shared.uPx.value = (0.5 * h) / Math.tan(THREE.MathUtils.degToRad(pc.fov * 0.5));
      }

      sky.update(clampedDt, camera);
      const night = sky.getNight();
      shared.uNight.value = night;

      mats.update(night);
      hall.update(elapsed, night);
      offerings.update(clampedDt, elapsed, night);
      courtyard.update(clampedDt, elapsed, night, lightsOn);
      bell.update(clampedDt, elapsed, night, lightsOn);
      ponds.update(clampedDt, elapsed, night, lightsOn);
      bodhi.update(clampedDt, elapsed, night, lightsOn);
      gardens.update(clampedDt, elapsed, night, lightsOn);
      coop.update(clampedDt, elapsed, night, lightsOn, playerPos, isFree);

      smoke.update(clampedDt, elapsed);
      sparks.update(clampedDt, elapsed);
      halos.update();

      if (currentQuality === 'low') {
        dust.points.visible = false;
        fireflies.update(camera, night, 'firefly');
      } else {
        dust.update(camera, night, 'dust');
        fireflies.update(camera, night, 'firefly');
      }
    },

    dispose(): void {
      scene.remove(group);
      sky.dispose();
      ground.dispose();
      hall.dispose();
      offerings.dispose();
      courtyard.dispose();
      bell.dispose();
      ponds.dispose();
      bodhi.dispose();
      gardens.dispose();
      coop.dispose();
      smoke.dispose();
      sparks.dispose();
      halos.dispose();
      dust.dispose();
      fireflies.dispose();
      disposeTree(group);
      mats.dispose();
    },
  };
}
