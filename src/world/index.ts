/**
 * Thế giới 3D Chùa Liên Hoa (W2): ghép renderer, camera, điều khiển, tìm đường, nhân vật chính,
 * tới 100 người chơi khác, hệ thống hành động/hoạt cảnh và môi trường 3D (W1).
 */
import './world.css';
import * as THREE from 'three';
import { createEmitter } from '@/core/bus';
import type { ActionId, Profile, RemotePlayer, SeatKind, SpotId, World, WorldEvents } from '@/core/contracts';
import { createEnvironment, type Environment } from './environment';
import {
  BOUNDS, CUSHION_CENTER, CUSHION_COUNT, CUSHION_RADIUS, cushionSlot,
  INTERACTABLES, LOTUS_POND, RELEASE_POND, SPAWN, SPAWN_FACE, SPOTS, WELL,
  type Interactable, type InteractableId, type Vec2,
} from './layout';
import { createAvatar, disposeAvatarCaches, LabelLayer, type AvatarRig, type GestureId } from './avatar';
import { CameraRig } from './player/camera';
import { createInput, type InputApi } from './player/input';
import { Mover } from './player/mover';
import { nearestFree } from './nav';

export { createAvatar, LabelLayer, type AvatarRig } from './avatar';

type Quality = 'low' | 'medium' | 'high';
type TimeMode = 'auto' | 'day' | 'night';

const INTERACTABLE_MAP: Record<InteractableId, Interactable> = Object.fromEntries(
  INTERACTABLES.map((it) => [it.id, it]),
) as Record<InteractableId, Interactable>;

/** Ánh xạ điểm tương tác → danh sách hành động ngữ cảnh (khớp W2.md & hud.ts). */
const INTERACTABLE_ACTIONS: Record<InteractableId, ActionId[]> = {
  altar: ['flowers', 'candle', 'bow'],
  burner: ['incense'],
  candles: ['candle'],
  bell: ['bell'],
  lotusPond: ['lantern'],
  releasePond: ['release'],
  bodhiTree: ['loc', 'wish'],
  broomRack: ['sweep'],
  cushion: [],
  que: ['que'],
  quanamStatue: ['pray', 'bow'],
  well: ['pray'],
};

/** Điểm đứng đẹp và điểm nhìn thật cho từng điểm tương tác (tránh đứng đè lên vật thể hoặc quay lưng vào hồ/chuông). */
const INTERACT_APPROACH: Record<InteractableId, { stand: Vec2; look: Vec2; stopR: number }> = {
  altar: { stand: { x: 0, z: -15.3 }, look: { x: 0, z: -18.5 }, stopR: 2.3 },
  burner: { stand: { x: 0, z: -8.75 }, look: { x: 0, z: -11.0 }, stopR: 2.3 },
  candles: { stand: { x: 3.3, z: -15.5 }, look: { x: 3.5, z: -17.3 }, stopR: 1.9 },
  bell: { stand: { x: 12.6, z: -8 }, look: { x: 15.2, z: -8 }, stopR: 2.8 },
  lotusPond: { stand: { x: -10.5, z: 14 }, look: { x: LOTUS_POND.cx, z: LOTUS_POND.cz }, stopR: 2.9 },
  releasePond: { stand: { x: 11.7, z: 14 }, look: { x: RELEASE_POND.cx, z: RELEASE_POND.cz }, stopR: 2.8 },
  bodhiTree: { stand: { x: -19.5, z: -4.2 }, look: { x: -21.8, z: -5.0 }, stopR: 2.8 },
  broomRack: { stand: { x: 7.4, z: 22.15 }, look: { x: 7.65, z: 21.05 }, stopR: 2.1 },
  cushion: { stand: { x: 22.5, z: 4 }, look: { x: CUSHION_CENTER.x, z: CUSHION_CENTER.z }, stopR: 2.5 },
  quanamStatue: { stand: { x: 28, z: -13.3 }, look: { x: 28.5, z: -16.8 }, stopR: 2.5 },
  well: { stand: { x: -26, z: -22 }, look: { x: WELL.x, z: WELL.z }, stopR: 2.4 },
  que: { stand: { x: -4.2, z: -14.45 }, look: { x: -4.15, z: -15.55 }, stopR: 1.9 },
};

/** Lộ trình dạo quét lá quanh sân trước & trục chính khi người chơi không tự lái. */
const SWEEP_SPOTS: Vec2[] = [
  { x: 4.5, z: 19 },
  { x: 0, z: 15.5 },
  { x: -4.5, z: 17.5 },
  { x: -3.5, z: 10 },
  { x: 3.5, z: 8 },
  { x: 0, z: 1 },
  { x: -4, z: -5 },
  { x: 4, z: -5 },
  { x: 2.5, z: 13 },
];

const SEAT_LIFT = 0.145;
const MAX_REMOTES = 100;
const SWEEP_DURATION = 25;
const SWEEP_ROUND_LEAVES = 36;

const wrapPi = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
const angleTo = (fx: number, fz: number, tx: number, tz: number): number => Math.atan2(-(tx - fx), -(tz - fz));

function profileKeyOf(p: Profile): string {
  return `${p.gender}|${p.outfit}|${p.colorIndex}|${p.accessory ?? ''}`;
}

/** Khoảng cách bình phương từ tia 3D tới đoạn thẳng đứng (x, y0..y1, z) để bắt chạm avatar từ xa nhạy trên mobile. */
function rayCapsuleHit(ray: THREE.Ray, cx: number, cz: number, y0: number, y1: number, radius: number): number | null {
  const ox = ray.origin.x - cx;
  const oz = ray.origin.z - cz;
  const dx = ray.direction.x;
  const dz = ray.direction.z;
  const a = dx * dx + dz * dz;
  let t = a > 1e-6 ? -(ox * dx + oz * dz) / a : 0;
  if (t < 0) return null;
  const hx = ox + dx * t;
  const hz = oz + dz * t;
  if (hx * hx + hz * hz > radius * radius) return null;
  const hy = ray.origin.y + ray.direction.y * t;
  const cy = Math.max(y0, Math.min(y1, hy));
  const dy = hy - cy;
  if (hx * hx + hz * hz + dy * dy > radius * radius) return null;
  return t;
}

interface RemoteEntry {
  id: string;
  rig: AvatarRig;
  x: number;
  z: number;
  ry: number;
  tx: number;
  tz: number;
  try: number;
  pKey: string;
  name: string;
  level: number;
  anim: RemotePlayer['anim'];
  lastSay?: string;
  lodTick: number;
}

interface TargetRing {
  group: THREE.Group;
  show(x: number, z: number): void;
  hide(): void;
  update(dt: number): void;
  dispose(): void;
}

function createTargetRing(): TargetRing {
  const group = new THREE.Group();
  group.visible = false;
  group.position.y = 0.028;

  const innerGeo = new THREE.RingGeometry(0.24, 0.3, 36);
  innerGeo.rotateX(-Math.PI / 2);
  const innerMat = new THREE.MeshBasicMaterial({
    color: '#f7d27a',
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  inner.renderOrder = 4;

  const rippleGeo = new THREE.RingGeometry(0.32, 0.37, 36);
  rippleGeo.rotateX(-Math.PI / 2);
  const rippleMat = new THREE.MeshBasicMaterial({
    color: '#ffe8ad',
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const ripple = new THREE.Mesh(rippleGeo, rippleMat);
  ripple.renderOrder = 3;

  const dotGeo = new THREE.CircleGeometry(0.08, 20);
  dotGeo.rotateX(-Math.PI / 2);
  const dotMat = new THREE.MeshBasicMaterial({
    color: '#fff1c2',
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    toneMapped: false,
  });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.renderOrder = 5;

  group.add(ripple, inner, dot);
  let age = 0;
  let fading = false;
  let fade = 0;

  return {
    group,
    show(x, z) {
      group.position.set(x, 0.028, z);
      group.visible = true;
      age = 0;
      fading = false;
      fade = 1;
    },
    hide() {
      if (group.visible) fading = true;
    },
    update(dt) {
      if (!group.visible) return;
      age += dt;
      if (fading) {
        fade = Math.max(0, fade - dt * 4.5);
        if (fade <= 0.01) {
          group.visible = false;
          return;
        }
      }
      const pulse = 1 + Math.sin(age * 5.2) * 0.08;
      inner.scale.set(pulse, 1, pulse);
      innerMat.opacity = 0.82 * fade;
      dotMat.opacity = 0.72 * fade;
      const cyc = (age * 1.15) % 1;
      const rs = 0.85 + cyc * 0.75;
      ripple.scale.set(rs, 1, rs);
      rippleMat.opacity = (1 - cyc) * 0.55 * fade;
    },
    dispose() {
      innerGeo.dispose(); innerMat.dispose();
      rippleGeo.dispose(); rippleMat.dispose();
      dotGeo.dispose(); dotMat.dispose();
    },
  };
}

export function createWorld(): World {
  const emitter = createEmitter<WorldEvents>();

  // ── Trạng thái lưu giữ kể cả trước khi mount xong ──
  let curProfile: Profile = { name: 'Tuệ An', gender: 'male', outfit: 'trang-lam', colorIndex: 0 };
  let curLevel = 1;
  let quality: Quality = 'medium';
  let todMode: TimeMode = 'auto';
  let offerings: { incenseUntil?: number; flowersUntil?: number; candleUntil?: number } | null = null;
  let wishRibbons = 0;
  const pendingLanterns: { id: string; color: string; mine: boolean }[] = [];
  let pendingRemotes: RemotePlayer[] | null = null;
  let inputEnabled = true;
  let paused = false;
  let docHidden = typeof document !== 'undefined' ? document.hidden : false;
  let disposed = false;

  // ── Thành phần 3D & DOM ──
  let rootEl: HTMLDivElement | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let env: Environment | null = null;
  let actorsGroup: THREE.Group | null = null;
  let playerRig: AvatarRig | null = null;
  let labelLayer: LabelLayer | null = null;
  let input: InputApi | null = null;
  let targetRing: TargetRing | null = null;
  let resizeObs: ResizeObserver | null = null;

  const camRig = new CameraRig();
  const mover = new Mover();
  const initSpawn = nearestFree(
    Math.round((SPAWN.x + (Math.random() * 4.4 - 2.2)) * 100) / 100,
    Math.round((SPAWN.z - 2.6 + Math.random() * 2.8) * 100) / 100,
  );
  mover.x = initSpawn.x;
  mover.z = initSpawn.z;
  mover.ry = SPAWN_FACE;

  const remotes = new Map<string, RemoteEntry>();
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const tmpHit = new THREE.Vector3();
  const tmpTip = new THREE.Vector3();

  let viewW = 1;
  let viewH = 1;
  let rafId = 0;
  let lastFrameMs = 0;
  let elapsed = 0;

  // ── Điều phối hành động, ngồi, quét lá, sự kiện ──
  let opId = 0;
  let fixedAnim: RemotePlayer['anim'] | null = null;
  let seatedSlot: number | null = null;
  let seatKind: SeatKind = 'sit';
  const waitCancels = new Set<() => void>();

  interface SweepState {
    elapsed: number;
    sweptTotal: number;
    sweptRoundAcc: number;
    respawnCheckT: number;
    spotIdx: number;
    dwellLeft: number;
    done: () => void;
  }
  let sweepState: SweepState | null = null;

  let nearbyAcc = 0.15;
  let lastNearbyId: InteractableId | null | undefined = undefined;
  let wasMoving = false;
  let moveCooldown = 0;
  let lastNight = -1;
  let nightCooldown = 0;

  function pixelRatioFor(q: Quality): number {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    if (q === 'low') return 1;
    if (q === 'medium') return Math.min(dpr, 1.5);
    return Math.min(dpr, 2);
  }

  function updateSize(): void {
    if (!rootEl || !renderer) return;
    const w = Math.max(1, rootEl.clientWidth || window.innerWidth || 1);
    const h = Math.max(1, rootEl.clientHeight || window.innerHeight || 1);
    viewW = w;
    viewH = h;
    renderer.setPixelRatio(pixelRatioFor(quality));
    renderer.setSize(w, h, false);
    camRig.setAspect(w / h);
  }

  function waitSeconds(sec: number, token: number): Promise<boolean> {
    if (sec <= 0 || token !== opId || disposed) return Promise.resolve(token === opId && !disposed);
    return new Promise<boolean>((resolve) => {
      let timer = 0;
      const cancel = (): void => {
        window.clearTimeout(timer);
        waitCancels.delete(cancel);
        resolve(false);
      };
      waitCancels.add(cancel);
      timer = window.setTimeout(() => {
        waitCancels.delete(cancel);
        resolve(token === opId && !disposed);
      }, sec * 1000);
    });
  }

  function flushWaits(): void {
    for (const c of [...waitCancels]) c();
    waitCancels.clear();
  }

  function endSweep(): void {
    const s = sweepState;
    if (!s) return;
    sweepState = null;
    playerRig?.setCarry(null);
    fixedAnim = null;
    mover.speed = 3.6;
    s.done();
  }

  function cancelActiveOp(opts?: { keepSweep?: boolean; keepRing?: boolean }): number {
    const next = ++opId;
    if (!opts?.keepSweep) endSweep();
    if (!opts?.keepRing) targetRing?.hide();
    fixedAnim = null;
    flushWaits();
    playerRig?.cancelGesture();
    mover.cancelPath(false);
    mover.cancelFace();
    return next;
  }

  function standUpInternal(): void {
    if (seatedSlot === null) return;
    seatedSlot = null;
    fixedAnim = null;
    playerRig?.setSeatLift(0);
    playerRig?.setAnim('idle');
    emitter.emit('seated', { seated: false, slot: null });
  }

  function handleTap(clientX: number, clientY: number): void {
    if (!inputEnabled || !renderer || !env) return;
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camRig.camera);

    // 1. Kiểm tra chạm vào người chơi khác trước (hình trụ bao hào phóng dễ bấm trên điện thoại)
    let hitRemoteId: string | null = null;
    let bestT = Infinity;
    for (const r of remotes.values()) {
      const gp = r.rig.group.position;
      const t = rayCapsuleHit(raycaster.ray, gp.x, gp.z, gp.y + 0.05, gp.y + 1.38, 0.44);
      if (t !== null && t < bestT) {
        bestT = t;
        hitRemoteId = r.id;
      }
    }
    if (hitRemoteId) {
      emitter.emit('tapRemote', { id: hitRemoteId });
      return;
    }

    // 2. Raycast mặt đất để tìm đường đi tới
    let gx: number | null = null;
    let gz: number | null = null;
    const hits = raycaster.intersectObject(env.groundPickMesh, true);
    if (hits.length > 0) {
      gx = hits[0].point.x;
      gz = hits[0].point.z;
    } else if (raycaster.ray.intersectPlane(groundPlane, tmpHit)) {
      if (tmpHit.x >= BOUNDS.x0 && tmpHit.x <= BOUNDS.x1 && tmpHit.z >= BOUNDS.z0 && tmpHit.z <= BOUNDS.z1) {
        gx = tmpHit.x;
        gz = tmpHit.z;
      }
    }
    if (gx === null || gz === null) return;

    const dest = nearestFree(gx, gz, 8);
    if (seatedSlot !== null) standUpInternal();

    if (sweepState) {
      // Đang cầm chổi quét lá: cho phép chạm điểm để dẫn hướng quét tới chỗ đó mà không ngắt phiên quét.
      targetRing?.show(dest.x, dest.z);
      void mover.walkTo(dest.x, dest.z).then(() => targetRing?.hide());
      return;
    }

    const token = cancelActiveOp({ keepRing: true });
    targetRing?.show(dest.x, dest.z);
    void mover.walkTo(dest.x, dest.z).then(() => {
      if (token === opId) targetRing?.hide();
    });
  }

  function nearestInteractable(px: number, pz: number): Interactable | null {
    let best: Interactable | null = null;
    let bestD = Infinity;
    for (const it of INTERACTABLES) {
      let d = Math.hypot(px - it.pos.x, pz - it.pos.z);
      let inRange = d <= it.radius;
      if (it.id === 'cushion') {
        const dc = Math.hypot(px - CUSHION_CENTER.x, pz - CUSHION_CENTER.z);
        if (dc <= CUSHION_RADIUS + 2.1) {
          inRange = true;
          d = Math.min(d, Math.max(0.1, Math.abs(dc - CUSHION_RADIUS)));
        }
      }
      if (inRange && d < bestD) {
        bestD = d;
        best = it;
      }
    }
    return best;
  }

  function targetInteractableFor(action: ActionId): InteractableId {
    switch (action) {
      case 'pray': {
        const cur = nearestInteractable(mover.x, mover.z);
        if (cur && (cur.id === 'quanamStatue' || cur.id === 'well' || cur.id === 'altar' || cur.id === 'burner')) return cur.id;
        return 'altar';
      }
      case 'bow': {
        const cur = nearestInteractable(mover.x, mover.z);
        if (cur && cur.id === 'quanamStatue') return 'quanamStatue';
        return 'altar';
      }
      case 'incense': return 'burner';
      case 'flowers': return 'altar';
      case 'candle': return 'candles';
      case 'bell': return 'bell';
      case 'lantern': return 'lotusPond';
      case 'que': return 'que';
      case 'release': return 'releasePond';
      case 'loc':
      case 'wish': return 'bodhiTree';
      case 'sweep': return 'broomRack';
    }
  }

  async function walkAndFaceInteractable(id: InteractableId, token: number): Promise<boolean> {
    const it = INTERACTABLE_MAP[id];
    const ap = INTERACT_APPROACH[id];
    const dist = Math.hypot(mover.x - it.pos.x, mover.z - it.pos.z);
    if (dist > ap.stopR) {
      const goal = nearestFree(ap.stand.x, ap.stand.z, 4);
      emitter.emit('travel', { label: `Đang đến ${it.label.toLocaleLowerCase('vi')}` });
      let ok = false;
      try {
        ok = await mover.walkTo(goal.x, goal.z, { stopNear: { x: ap.stand.x, z: ap.stand.z, r: 0.75 } });
      } finally {
        emitter.emit('travel', { label: null });
      }
      if (!ok || token !== opId || disposed) return false;
    }
    const faceAng = Math.hypot(ap.look.x - mover.x, ap.look.z - mover.z) > 0.25
      ? angleTo(mover.x, mover.z, ap.look.x, ap.look.z)
      : it.face;
    await mover.turnTo(faceAng);
    return token === opId && !disposed;
  }

  function findNearestSweepSpotIndex(x: number, z: number): number {
    let bi = 0;
    let bd = Infinity;
    for (let i = 0; i < SWEEP_SPOTS.length; i++) {
      const s = SWEEP_SPOTS[i];
      const d = (s.x - x) ** 2 + (s.z - z) ** 2;
      if (d < bd) { bd = d; bi = i; }
    }
    return bi;
  }

  function updateSweep(dt: number): void {
    const s = sweepState;
    if (!s || !playerRig || !env) return;
    s.elapsed += dt;
    s.respawnCheckT -= dt;
    if (s.respawnCheckT <= 0) {
      s.respawnCheckT = 1.5;
      if (env.leavesRemaining() < 15) env.respawnLeaves();
    }

    // Dẫn hướng tự động nhẹ nhàng quanh sân khi người chơi không tự bấm phím/chạm đất
    if (mover.manual) {
      fixedAnim = null;
      mover.speed = 3.2;
      s.dwellLeft = 1.4;
    } else if (mover.hasPath()) {
      fixedAnim = null;
    } else {
      mover.speed = 2.0;
      fixedAnim = 'sweep';
      s.dwellLeft -= dt;
      if (s.dwellLeft <= 0) {
        s.spotIdx = (s.spotIdx + 1) % SWEEP_SPOTS.length;
        const next = SWEEP_SPOTS[s.spotIdx];
        s.dwellLeft = 2.1;
        fixedAnim = null;
        void mover.walkTo(next.x, next.z);
      }
    }

    playerRig.broomTip(tmpTip);
    const swept = env.sweepAt(tmpTip.x, tmpTip.z, 1.3);
    if (swept > 0) {
      s.sweptTotal += swept;
      s.sweptRoundAcc += swept;
      while (s.sweptRoundAcc >= SWEEP_ROUND_LEAVES) {
        s.sweptRoundAcc -= SWEEP_ROUND_LEAVES;
        emitter.emit('actionDone', { action: 'sweep', detail: { leaves: s.sweptTotal, round: true } });
      }
    }

    if (s.elapsed >= SWEEP_DURATION) {
      mover.cancelPath(false);
      endSweep();
    }
  }

  function syncRemotes(list: RemotePlayer[]): void {
    if (!actorsGroup || !labelLayer) {
      pendingRemotes = list.slice(0, MAX_REMOTES);
      return;
    }
    const capped = list.slice(0, MAX_REMOTES);
    const seen = new Set<string>();
    const castRemoteShadow = quality === 'high' || (quality === 'medium' && capped.length <= 24);

    for (const p of capped) {
      seen.add(p.id);
      const pk = profileKeyOf(p.profile);
      let entry = remotes.get(p.id);
      const isSit = p.anim === 'sit' || p.anim === 'chant' || p.anim === 'meditate';
      if (!entry) {
        const rig = createAvatar(p.profile, p.level);
        rig.setLabel(p.profile.name, p.level, false);
        rig.setCastShadow(castRemoteShadow);
        rig.group.position.set(p.x, 0, p.z);
        rig.group.rotation.y = p.ry;
        rig.setSeatLift(isSit ? SEAT_LIFT : 0);
        rig.setAnim(p.anim);
        if (p.say) rig.say(p.say);
        actorsGroup.add(rig.group);
        labelLayer.add(rig);
        entry = {
          id: p.id,
          rig,
          x: p.x, z: p.z, ry: p.ry,
          tx: p.x, tz: p.z, try: p.ry,
          pKey: pk,
          name: p.profile.name,
          level: p.level,
          anim: p.anim,
          lastSay: p.say,
          lodTick: Math.floor(Math.random() * 3),
        };
        remotes.set(p.id, entry);
      } else {
        entry.tx = p.x;
        entry.tz = p.z;
        entry.try = p.ry;
        if (pk !== entry.pKey || p.level !== entry.level) {
          entry.rig.setProfile(p.profile, p.level);
          entry.pKey = pk;
        }
        if (p.profile.name !== entry.name || p.level !== entry.level) {
          entry.rig.setLabel(p.profile.name, p.level, false);
          entry.name = p.profile.name;
          entry.level = p.level;
        }
        entry.anim = p.anim;
        entry.rig.setSeatLift(isSit ? SEAT_LIFT : 0);
        entry.rig.setCastShadow(castRemoteShadow);
        if (p.say && p.say !== entry.lastSay) entry.rig.say(p.say);
        entry.lastSay = p.say;
      }
    }

    for (const [id, entry] of remotes) {
      if (!seen.has(id)) {
        labelLayer.remove(entry.rig);
        entry.rig.dispose();
        remotes.delete(id);
      }
    }
  }

  function updateRemotes(dt: number, camPos: THREE.Vector3): void {
    const kPos = 1 - Math.exp(-10 * dt);
    const kAng = 1 - Math.exp(-12 * dt);
    for (const r of remotes.values()) {
      const dx = r.tx - r.x;
      const dz = r.tz - r.z;
      const distMove = Math.hypot(dx, dz);
      if (distMove > 14) {
        r.x = r.tx;
        r.z = r.tz;
        r.ry = r.try;
      } else {
        r.x += dx * kPos;
        r.z += dz * kPos;
        r.ry = wrapPi(r.ry + wrapPi(r.try - r.ry) * kAng);
      }
      r.rig.group.position.set(r.x, 0, r.z);
      r.rig.group.rotation.y = r.ry;

      const movingNow = distMove > 0.14;
      const wantAnim: RemotePlayer['anim'] = r.anim === 'idle' && movingNow ? 'walk' : r.anim;
      r.rig.setAnim(wantAnim);
      if (wantAnim === 'walk') r.rig.setMoveSpeed(Math.min(4.2, Math.max(2.2, distMove * 6)));

      const dCamSq = (r.x - camPos.x) ** 2 + (r.z - camPos.z) ** 2;
      if (dCamSq > 42 * 42) {
        r.lodTick = (r.lodTick + 1) % 3;
        if (r.lodTick === 0) r.rig.update(dt * 3);
      } else {
        r.rig.update(dt);
      }
    }
  }

  function step(dt: number): void {
    if (!renderer || !scene || !env || !playerRig || !labelLayer) return;
    elapsed += dt;

    // 1. Nhập liệu & di chuyển
    const dir = inputEnabled && input ? input.poll() : { x: 0, y: 0 };
    const rot = inputEnabled && input ? input.rotKey() : 0;
    if (rot !== 0) camRig.rotate(rot * 1.85 * dt);

    mover.update(dt, dir.x, dir.y, camRig.yaw);
    if (mover.hasPath() && mover.moving && inputEnabled) {
      camRig.followBehind(mover.ry, dt);
    }

    if (sweepState) updateSweep(dt);

    // 2. Nhân vật chính
    playerRig.group.position.set(mover.x, 0, mover.z);
    playerRig.group.rotation.y = mover.ry;
    playerRig.setMoveSpeed(Math.hypot(mover.vx, mover.vz));

    if (!playerRig.isGesturing()) {
      if (seatedSlot !== null) playerRig.setAnim(seatKind);
      else if (fixedAnim) playerRig.setAnim(fixedAnim);
      else playerRig.setAnim(mover.moving ? 'walk' : 'idle');
    }
    playerRig.update(dt);

    // 3. Camera, môi trường, người chơi khác & vòng đích
    camRig.update(dt, mover.x, mover.z, 0, {
      seated: seatedSlot !== null,
      orbiting: !inputEnabled,
    });
    updateRemotes(dt, camRig.camera.position);
    targetRing?.update(dt);
    env.update(dt, elapsed, camRig.camera);

    // 4. Sự kiện nearby (mỗi 150ms, chỉ phát khi đổi id)
    nearbyAcc += dt;
    if (nearbyAcc >= 0.15) {
      nearbyAcc = 0;
      const hit = nearestInteractable(mover.x, mover.z);
      const nextId = hit ? hit.id : null;
      if (nextId !== lastNearbyId) {
        lastNearbyId = nextId;
        emitter.emit('nearby', hit
          ? { id: hit.id, label: hit.label, actions: [...INTERACTABLE_ACTIONS[hit.id]] }
          : { id: null, label: null, actions: [] });
      }
    }

    // 5. Sự kiện moved (≤10Hz khi đang đi + 1 lần khi dừng)
    moveCooldown = Math.max(0, moveCooldown - dt);
    if (mover.moving) {
      if (moveCooldown <= 0) {
        moveCooldown = 0.1;
        emitter.emit('moved', { x: mover.x, z: mover.z, ry: mover.ry, moving: true });
      }
      wasMoving = true;
    } else if (wasMoving) {
      wasMoving = false;
      moveCooldown = 0;
      emitter.emit('moved', { x: mover.x, z: mover.z, ry: mover.ry, moving: false });
    }

    // 6. Sự kiện night (≤2Hz khi thay đổi > 0.01)
    nightCooldown = Math.max(0, nightCooldown - dt);
    const nv = env.getNight();
    if (nightCooldown <= 0 && Math.abs(nv - lastNight) > 0.01) {
      lastNight = nv;
      nightCooldown = 0.5;
      emitter.emit('night', { value: nv });
    }

    // 7. Vẽ khung hình + nhãn DOM
    renderer.render(scene, camRig.camera);
    labelLayer.update(camRig.camera, viewW, viewH);
  }

  function loop(now: number): void {
    if (disposed) return;
    rafId = requestAnimationFrame(loop);
    if (paused || docHidden) {
      lastFrameMs = now;
      return;
    }
    const rawDt = lastFrameMs > 0 ? (now - lastFrameMs) / 1000 : 1 / 60;
    lastFrameMs = now;
    const dt = Math.min(0.05, Math.max(0.0005, rawDt));
    step(dt);
  }

  const onVisChange = (): void => {
    docHidden = document.hidden;
    if (!docHidden) lastFrameMs = performance.now();
  };
  const onWinResize = (): void => updateSize();

  const world: World = {
    on: (t, fn) => emitter.on(t, fn),
    off: (t, fn) => emitter.off(t, fn),
    emit: (t, p) => emitter.emit(t, p),

    async mount(container, profile, opts) {
      disposed = false;
      curProfile = { ...profile };
      if (opts?.level !== undefined) curLevel = opts.level;

      // Dựng vùng chứa gốc
      rootEl = document.createElement('div');
      rootEl.className = 'w2-root';
      container.replaceChildren(rootEl);

      // Tạo WebGLRenderer (ném Error('webgl') nếu trình duyệt/thiết bị không hỗ trợ)
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: quality !== 'low',
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        });
        if (!renderer.getContext()) {
          renderer.dispose();
          renderer = null;
          throw new Error('webgl');
        }
      } catch {
        rootEl.remove();
        rootEl = null;
        throw new Error('webgl');
      }

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.shadowMap.enabled = quality !== 'low';
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rootEl.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      updateSize();

      labelLayer = new LabelLayer(rootEl);
      labelLayer.setHideDistance(quality === 'low' ? 28 : 40);

      input = createInput(rootEl, rootEl, {
        tap: handleTap,
        look: (dx, dy) => camRig.orbit(dx, dy),
        zoom: (delta) => camRig.zoom(delta),
        userMove: () => {
          if (seatedSlot !== null) standUpInternal();
          if (!sweepState) {
            // Huỷ tự động đi/hành động nếu người chơi chủ động bấm phím hoặc kéo joystick
            cancelActiveOp();
          } else {
            mover.cancelPath(false);
            targetRing?.hide();
          }
        },
      });
      input.setEnabled(inputEnabled);

      emitter.emit('loading', { progress: 0.02, status: 'Đang mở cổng chùa…' });
      const loadedEnv = await createEnvironment({
        scene,
        renderer,
        quality,
        onProgress: (progress, status) => emitter.emit('loading', { progress, status }),
      });
      if (disposed) {
        loadedEnv.dispose();
        return;
      }
      env = loadedEnv;
      env.setQuality(quality);
      env.setTimeOfDay(todMode);
      if (offerings) env.setOfferings(offerings);
      if (wishRibbons > 0) env.setWishRibbons(wishRibbons);
      for (const l of pendingLanterns.splice(0)) env.addLantern(l);

      actorsGroup = new THREE.Group();
      actorsGroup.name = 'w2-actors';
      scene.add(actorsGroup);

      targetRing = createTargetRing();
      actorsGroup.add(targetRing.group);

      playerRig = createAvatar(curProfile, curLevel);
      playerRig.setLabel(curProfile.name, curLevel, true);
      playerRig.setCastShadow(quality !== 'low');
      mover.teleport(initSpawn.x, initSpawn.z, SPAWN_FACE);
      playerRig.group.position.set(initSpawn.x, 0, initSpawn.z);
      playerRig.group.rotation.y = SPAWN_FACE;
      actorsGroup.add(playerRig.group);
      labelLayer.add(playerRig);

      camRig.snap(SPAWN.x, SPAWN.z, SPAWN_FACE);

      if (pendingRemotes) {
        const list = pendingRemotes;
        pendingRemotes = null;
        syncRemotes(list);
      }

      if (typeof ResizeObserver !== 'undefined') {
        resizeObs = new ResizeObserver(() => updateSize());
        resizeObs.observe(rootEl);
      }
      window.addEventListener('resize', onWinResize);
      document.addEventListener('visibilitychange', onVisChange);

      // Chạy khung đầu để cảnh, nhãn và giá trị đêm sẵn sàng ngay khi phát 'ready'
      updateSize();
      step(1 / 60);
      lastFrameMs = performance.now();
      rafId = requestAnimationFrame(loop);

      emitter.emit('loading', { progress: 1, status: 'Đã vào chùa' });
      emitter.emit('ready', undefined);
    },

    setProfile(profile, level) {
      curProfile = { ...profile };
      if (level !== undefined) curLevel = level;
      if (playerRig) {
        playerRig.setProfile(curProfile, curLevel);
        playerRig.setLabel(curProfile.name, curLevel, true);
      }
    },

    goTo(spot) {
      const sp = SPOTS[spot];
      if (!sp || disposed) return;
      if (seatedSlot !== null) standUpInternal();
      const token = cancelActiveOp();
      void (async () => {
        emitter.emit('travel', { label: `Đang đi tới ${sp.name}` });
        let ok = false;
        try {
          ok = await mover.walkTo(sp.pos.x, sp.pos.z);
        } finally {
          emitter.emit('travel', { label: null });
        }
        if (!ok || token !== opId || disposed) return;
        await mover.turnTo(sp.face);
        if (token !== opId || disposed) return;
        emitter.emit('spotReached', { spot });
      })();
    },

    stop() {
      cancelActiveOp();
      if (playerRig && seatedSlot === null) playerRig.setAnim('idle');
    },

    async perform(action, opts) {
      if (disposed || !playerRig) return;
      if (seatedSlot !== null) standUpInternal();
      const token = cancelActiveOp();
      const inPlace = Boolean(opts?.inPlace);

      // ── Quét lá sân chùa (liên tục tối đa 25s hoặc tới khi stop()) ──
      if (action === 'sweep') {
        const rack = INTERACTABLE_MAP.broomRack;
        const needWalk = !inPlace && playerRig.getCarry() !== 'broom' && Math.hypot(mover.x - rack.pos.x, mover.z - rack.pos.z) > rack.radius + 0.6;
        if (needWalk) {
          const ok = await walkAndFaceInteractable('broomRack', token);
          if (!ok || token !== opId || disposed) return;
        }
        if (playerRig.getCarry() !== 'broom') {
          await playerRig.playGesture('grabBroom', { onCue: () => playerRig?.setCarry('broom') });
          if (token !== opId || disposed) return;
          playerRig.setCarry('broom');
        }
        if (env && env.leavesRemaining() < 15) env.respawnLeaves();
        emitter.emit('actionStart', { action: 'sweep' });
        await new Promise<void>((resolve) => {
          sweepState = {
            elapsed: 0,
            sweptTotal: 0,
            sweptRoundAcc: 0,
            respawnCheckT: 1.5,
            spotIdx: findNearestSweepSpotIndex(mover.x, mover.z),
            dwellLeft: 1.8,
            done: resolve,
          };
        });
        return;
      }

      // ── Đi tới điểm tương tác & xoay mặt (trừ khi inPlace) ──
      const targetId = targetInteractableFor(action);
      if (!inPlace) {
        const ok = await walkAndFaceInteractable(targetId, token);
        if (!ok || token !== opId || disposed) return;
      }

      const targetPos = INTERACTABLE_MAP[targetId].pos;
      emitter.emit('actionStart', { action });

      // ── Chắp tay & Lạy Phật ──
      if (action === 'pray') {
        fixedAnim = 'pray';
        playerRig.setAnim('pray');
        const ok = await waitSeconds(2.0, token);
        if (!ok) return;
        fixedAnim = null;
        playerRig.setAnim('idle');
        emitter.emit('actionDone', { action: 'pray' });
        return;
      }

      if (action === 'bow') {
        fixedAnim = 'bow';
        playerRig.setAnim('bow');
        const ok = await waitSeconds(3.5, token);
        if (!ok) return;
        fixedAnim = null;
        playerRig.setAnim('idle');
        emitter.emit('actionDone', { action: 'bow' });
        return;
      }

      // ── Các hành động có cử chỉ & đạo cụ riêng ──
      const gestureMap: Record<Exclude<ActionId, 'pray' | 'bow' | 'sweep'>, {
        gesture: GestureId;
        fx?: Parameters<Environment['playEffect']>[0];
        fxAt?: Vec2;
      }> = {
        incense: { gesture: 'incense', fx: 'incense', fxAt: targetPos },
        flowers: { gesture: 'flowers', fx: 'flowers', fxAt: targetPos },
        candle: { gesture: 'candle', fx: 'candle', fxAt: targetPos },
        bell: { gesture: 'bell', fx: 'bell', fxAt: targetPos },
        lantern: { gesture: 'lantern', fx: 'lanternLaunch', fxAt: { x: -12.2, z: 14 } },
        que: { gesture: 'que' },
        release: { gesture: 'release', fx: 'release', fxAt: { x: 13.0, z: 14 } },
        loc: { gesture: 'loc', fx: 'loc', fxAt: targetPos },
        wish: { gesture: 'wish', fx: 'ribbon', fxAt: targetPos },
      };

      const spec = gestureMap[action];
      const lanternColor = action === 'lantern'
        ? ((opts?.payload as { color?: string } | undefined)?.color ?? '#ffb24a')
        : undefined;

      await playerRig.playGesture(spec.gesture, {
        color: lanternColor,
        onCue: () => {
          if (token === opId && !disposed && spec.fx) {
            env?.playEffect(spec.fx, spec.fxAt);
          }
        },
      });
      if (token !== opId || disposed) return;
      emitter.emit('actionDone', { action });
    },

    sit(kind, slot) {
      if (disposed) return false;
      // Nếu đang ngồi sẵn và không yêu cầu đổi sang bồ đoàn cụ thể → chỉ đổi tư thế ngồi
      if (seatedSlot !== null && (slot === undefined || slot === seatedSlot)) {
        seatKind = kind;
        playerRig?.setAnim(kind);
        return true;
      }

      // Tìm các bồ đoàn đã có người chơi khác ngồi
      const occupied = new Set<number>();
      for (let i = 0; i < CUSHION_COUNT; i++) {
        const cs = cushionSlot(i);
        for (const r of remotes.values()) {
          const rSeated = r.anim === 'sit' || r.anim === 'chant' || r.anim === 'meditate';
          if (rSeated && Math.hypot(r.tx - cs.pos.x, r.tz - cs.pos.z) < 1.15) {
            occupied.add(i);
            break;
          }
        }
      }

      let chosen = -1;
      if (slot !== undefined) {
        if (slot < 0 || slot >= CUSHION_COUNT || occupied.has(slot)) return false;
        chosen = slot;
      } else {
        let bestD = Infinity;
        for (let i = 0; i < CUSHION_COUNT; i++) {
          if (occupied.has(i)) continue;
          const cs = cushionSlot(i);
          const d = Math.hypot(cs.pos.x - mover.x, cs.pos.z - mover.z);
          if (d < bestD) { bestD = d; chosen = i; }
        }
        if (chosen === -1) return false;
      }

      if (seatedSlot !== null) standUpInternal();
      const token = cancelActiveOp();
      const cs = cushionSlot(chosen);

      void (async () => {
        if (Math.hypot(cs.pos.x - mover.x, cs.pos.z - mover.z) > 0.35) {
          const ok = await mover.walkTo(cs.pos.x, cs.pos.z);
          if (!ok || token !== opId || disposed) return;
        }
        mover.teleport(cs.pos.x, cs.pos.z, cs.face);
        await mover.turnTo(cs.face);
        if (token !== opId || disposed) return;
        seatedSlot = chosen;
        seatKind = kind;
        playerRig?.setSeatLift(SEAT_LIFT);
        playerRig?.setAnim(kind);
        emitter.emit('moved', { x: mover.x, z: mover.z, ry: mover.ry, moving: false });
        emitter.emit('seated', { seated: true, slot: chosen });
      })();

      return true;
    },

    standUp() {
      cancelActiveOp();
      standUpInternal();
    },

    isSeated: () => seatedSlot !== null,

    setInputEnabled(enabled) {
      inputEnabled = enabled;
      input?.setEnabled(enabled);
    },

    setRemotes(players) {
      syncRemotes(players);
    },

    say(text) {
      playerRig?.say(text);
    },

    setOfferings(o) {
      offerings = { ...o };
      env?.setOfferings(offerings);
    },

    addLantern(l) {
      const item = { id: l.id, color: l.color, mine: l.mine };
      if (env) env.addLantern(item);
      else if (pendingLanterns.length < 60) pendingLanterns.push(item);
    },

    setWishRibbons(count) {
      wishRibbons = count;
      env?.setWishRibbons(count);
    },

    setTimeOfDay(mode) {
      todMode = mode;
      env?.setTimeOfDay(mode);
    },

    setQuality(q) {
      quality = q;
      if (renderer) {
        renderer.shadowMap.enabled = q !== 'low';
        updateSize();
      }
      labelLayer?.setHideDistance(q === 'low' ? 28 : 40);
      playerRig?.setCastShadow(q !== 'low');
      const castRemote = q === 'high' || (q === 'medium' && remotes.size <= 24);
      for (const r of remotes.values()) r.rig.setCastShadow(castRemote);
      env?.setQuality(q);
    },

    setPaused(p) {
      paused = p;
      if (!paused) lastFrameMs = performance.now();
    },

    async screenshot() {
      if (!renderer || !scene) return null;
      renderer.render(scene, camRig.camera);
      const canvas = renderer.domElement;
      return new Promise<Blob | null>((resolve) => {
        try {
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85);
        } catch {
          resolve(null);
        }
      });
    },

    getPlayer: () => ({ x: mover.x, z: mover.z, ry: mover.ry }),

    dispose() {
      if (disposed) return;
      disposed = true;
      cancelActiveOp();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      resizeObs?.disconnect();
      resizeObs = null;
      window.removeEventListener('resize', onWinResize);
      document.removeEventListener('visibilitychange', onVisChange);

      input?.dispose();
      input = null;
      for (const r of remotes.values()) {
        labelLayer?.remove(r.rig);
        r.rig.dispose();
      }
      remotes.clear();
      if (playerRig) {
        labelLayer?.remove(playerRig);
        playerRig.dispose();
        playerRig = null;
      }
      labelLayer?.dispose();
      labelLayer = null;
      targetRing?.dispose();
      targetRing = null;
      actorsGroup?.removeFromParent();
      actorsGroup = null;
      env?.dispose();
      env = null;
      disposeAvatarCaches();
      renderer?.dispose();
      renderer = null;
      scene = null;
      rootEl?.remove();
      rootEl = null;
    },
  };

  return world;
}
