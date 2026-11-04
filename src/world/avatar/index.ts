/**
 * Nhân vật chibi dựng thủ tục (đầu to, mắt cười, má hồng; 4 kiểu áo × 2 giới × 5 màu; phụ kiện; hào quang bậc).
 * `createAvatar(profile, level)` → `AvatarRig`. Hình được cache/gộp nên nhiều người chơi vẫn nhẹ.
 * Mặt trước của nhân vật theo quy ước layout: `group.rotation.y = ry` (ry=0 nhìn về -z).
 */
import * as THREE from 'three';
import { TIERS, type Profile, type RemotePlayer, type TierDef } from '@/core/contracts';
import {
  DIM, disposeBuildCache, disposeHalo, foreArmGeometry, getHaloGeometry, headGeometry, lapGeometry, lookOf,
  shinGeometry, thighGeometry, torsoGeometry, upperArmGeometry, type Look,
} from './build';
import { ANIMS, GESTURES, P, applyGesture, standBase, type Anim, type AnimCtx, type GestureId } from './pose';
import { BROOM_LEN, createFish, createProp, disposeProps, type PropInstance, type PropName } from './props';
import { createLabelEl, SAY_MAX, type LabelParts, type LabelTarget } from './labels';
import { petal, merge } from './geo';

export { LabelLayer } from './labels';
export { ACCESSORY_IDS, canonicalAccessory } from './accessories';
export type { GestureId } from './pose';

export interface AvatarRig extends LabelTarget {
  group: THREE.Group;
  setAnim(a: RemotePlayer['anim']): void;
  update(dt: number): void;
  setProfile(p: Profile, level: number): void;
  /** text: tên hiển thị; `me` = nhãn của chính mình ("Tôi" + tên). */
  setLabel(text: string, level: number, me?: boolean): void;
  say(text: string, ms?: number): void;
  dispose(): void;
  // ── mở rộng cho thế giới ──
  getAnim(): RemotePlayer['anim'];
  /** Chạy cử chỉ ngắn; resolve khi xong. `onCue` được gọi đúng lúc "chạm" (để phát hiệu ứng). */
  playGesture(id: GestureId, opts?: { color?: string; onCue?: () => void }): Promise<void>;
  cancelGesture(): void;
  isGesturing(): boolean;
  /** Cầm chổi khi đi (hoặc bỏ). */
  setCarry(p: 'broom' | null): void;
  getCarry(): 'broom' | null;
  /** Vị trí thế giới của mũi chổi. */
  broomTip(out: THREE.Vector3): THREE.Vector3;
  /** Tốc độ di chuyển (m/s) để chỉnh nhịp bước. */
  setMoveSpeed(v: number): void;
  /** Độ nâng khi ngồi (chiều cao bồ đoàn). */
  setSeatLift(h: number): void;
  setCastShadow(on: boolean): void;
  /** Đo chiều cao (m) để chọn vị trí tương tác. */
  readonly tier: TierDef;
}

// ───────────────────────── Vật liệu & tài nguyên dùng chung ─────────────────────────
const avatarMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.84,
  metalness: 0,
  envMapIntensity: 0.26,
  side: THREE.DoubleSide,
});
avatarMat.onBeforeCompile = (sh) => {
  // Bù sáng ấm kiểu chibi (half-wrap / tán xạ da) để mặt và tay luôn hồng đào ấm áp dưới ACES cả ngày lẫn đêm.
  sh.fragmentShader = sh.fragmentShader.replace(
    '#include <emissivemap_fragment>',
    '#include <emissivemap_fragment>\n\ttotalEmissiveRadiance += diffuseColor.rgb * vec3(0.25, 0.198, 0.168);',
  );
};
avatarMat.customProgramCacheKey = () => 'w2-avatar-warm-v3';

const haloMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });

export function tierOf(level: number): TierDef {
  let t = TIERS[0];
  for (const x of TIERS) if (level >= x.minLevel) t = x;
  return t;
}

let blobTex: THREE.CanvasTexture | null = null;
let blobGeo: THREE.PlaneGeometry | null = null;
let blobMat: THREE.MeshBasicMaterial | null = null;
function blob(): { geo: THREE.PlaneGeometry; mat: THREE.MeshBasicMaterial } {
  if (!blobTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(32, 32, 2, 32, 32, 31);
    grd.addColorStop(0, 'rgba(0,0,0,0.55)');
    grd.addColorStop(0.55, 'rgba(0,0,0,0.28)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    blobTex = new THREE.CanvasTexture(c);
    blobTex.colorSpace = THREE.SRGBColorSpace;
    blobGeo = new THREE.PlaneGeometry(0.95, 0.95);
    blobGeo.rotateX(-Math.PI / 2);
    blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  }
  return { geo: blobGeo!, mat: blobMat! };
}

interface TierAssets {
  ring: THREE.BufferGeometry;
  ringMat: THREE.MeshBasicMaterial;
  glow: THREE.BufferGeometry;
  glowMat: THREE.MeshBasicMaterial;
  petals: THREE.BufferGeometry | null;
  petalMat: THREE.MeshBasicMaterial | null;
}
const tierAssets = new Map<number, TierAssets>();
function assetsOf(t: TierDef): TierAssets {
  let a = tierAssets.get(t.id);
  if (a) return a;
  const ring = new THREE.RingGeometry(0.375, 0.405, 44);
  ring.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({ color: t.accent, transparent: true, opacity: 0.82, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const glow = new THREE.RingGeometry(0.33, 0.445, 44);
  glow.rotateX(-Math.PI / 2);
  const glowMat = new THREE.MeshBasicMaterial({ color: t.accent, transparent: true, opacity: 0.16 + Math.min(0.14, (t.id - 1) * 0.022), depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  let petals: THREE.BufferGeometry | null = null;
  let petalMat: THREE.MeshBasicMaterial | null = null;
  if (t.id >= 4) {
    const n = t.id >= 7 ? 8 : t.id >= 6 ? 6 : 4;
    const list: THREE.BufferGeometry[] = [];
    for (let i = 0; i < n; i++) {
      const a2 = (i / n) * Math.PI * 2;
      const g = petal(0.068, 0.038, '#ffffff', [0, 0, 0], [0, 0, 0]);
      g.rotateX(0.55);
      g.translate(0, 0, 0.455);
      g.rotateY(a2);
      list.push(g);
    }
    petals = merge(list);
    petalMat = new THREE.MeshBasicMaterial({ color: t.accent, transparent: true, opacity: 0.88, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  }
  a = { ring, ringMat, glow, glowMat, petals, petalMat };
  tierAssets.set(t.id, a);
  return a;
}

/** Giải phóng toàn bộ cache hình/vật liệu của nhân vật (khi huỷ thế giới). */
export function disposeAvatarCaches(): void {
  disposeBuildCache();
  disposeProps();
  disposeHalo();
  for (const a of tierAssets.values()) {
    a.ring.dispose(); a.ringMat.dispose();
    a.glow.dispose(); a.glowMat.dispose();
    a.petals?.dispose(); a.petalMat?.dispose();
  }
  tierAssets.clear();
  blobTex?.dispose(); blobGeo?.dispose(); blobMat?.dispose();
  blobTex = null; blobGeo = null; blobMat = null;
}

// ───────────────────────── Rig ─────────────────────────
const _v = new THREE.Vector3();
const _w = new THREE.Vector3();
const _pole = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _perp = new THREE.Vector3();
const _S = new THREE.Vector3();
const _E = new THREE.Vector3();
const _H = new THREE.Vector3();
const _q = new THREE.Quaternion();
const DOWN = new THREE.Vector3(0, -1, 0);

const UPPER = DIM.upper;
const FORE = DIM.fore;

/** IK hai khớp: vai S → tay H (mục tiêu T), trả khuỷu E. Tất cả trong không gian thân trên. */
function solveArm(sx: number, tx: number, ty: number, tz: number, uq: THREE.Quaternion, fq: THREE.Quaternion, outE: THREE.Vector3, outH: THREE.Vector3): void {
  _S.set(sx * DIM.shoulderX, DIM.shoulderY, 0);
  _dir.set(sx * tx - _S.x, ty - _S.y, tz - _S.z);
  let len = _dir.length();
  const maxL = UPPER + FORE - 0.002;
  if (len > maxL) len = maxL;
  if (len < 0.05) len = 0.05;
  _dir.normalize();
  const cosA = (UPPER * UPPER + len * len - FORE * FORE) / (2 * UPPER * len);
  const A = Math.acos(Math.max(-1, Math.min(1, cosA)));
  _pole.set(sx * 0.65, -0.85, -0.4).normalize();
  _perp.copy(_pole).addScaledVector(_dir, -_pole.dot(_dir));
  if (_perp.lengthSq() < 1e-6) _perp.set(sx, 0, 0);
  _perp.normalize();
  outE.copy(_S).addScaledVector(_dir, UPPER * Math.cos(A)).addScaledVector(_perp, UPPER * Math.sin(A));
  outH.copy(_S).addScaledVector(_dir, len);
  _v.copy(outE).sub(_S).normalize();
  uq.setFromUnitVectors(DOWN, _v);
  _w.copy(outH).sub(outE).normalize();
  fq.setFromUnitVectors(DOWN, _w);
}

export function createAvatar(profile: Profile, level: number): AvatarRig {
  const group = new THREE.Group();
  const body = new THREE.Group();
  body.rotation.y = Math.PI; // nhân vật dựng nhìn +z → quay để ry=0 nhìn -z
  group.add(body);

  // bóng + vòng bậc
  const { geo: bg, mat: bm } = blob();
  const shadow = new THREE.Mesh(bg, bm);
  shadow.position.y = 0.02;
  shadow.renderOrder = 1;
  group.add(shadow);
  const ringHolder = new THREE.Group();
  ringHolder.position.y = 0.035;
  group.add(ringHolder);
  const orbit = new THREE.Group();
  orbit.position.y = 0.14;
  group.add(orbit);

  // chân
  const mk = (geo: THREE.BufferGeometry): THREE.Mesh => { const m = new THREE.Mesh(geo, avatarMat); m.frustumCulled = true; return m; };
  const legs = [-1, 1].map(() => {
    const hip = new THREE.Group();
    hip.rotation.order = 'YXZ';
    const thigh = mk(new THREE.BufferGeometry());
    const knee = new THREE.Group();
    knee.position.y = -DIM.thigh;
    const shin = mk(new THREE.BufferGeometry());
    knee.add(shin);
    hip.add(thigh, knee);
    body.add(hip);
    return { hip, thigh, knee, shin };
  });
  // legs[0] = bên x<0 trong hệ thân (phải của nhân vật), legs[1] = x>0
  legs[0].hip.position.set(-DIM.hipX, DIM.hipY, 0);
  legs[1].hip.position.set(DIM.hipX, DIM.hipY, 0);

  // thân trên
  const upper = new THREE.Group();
  upper.position.y = DIM.hipY;
  upper.rotation.order = 'YXZ';
  body.add(upper);
  const torso = mk(new THREE.BufferGeometry());
  upper.add(torso);
  const neck = new THREE.Group();
  neck.position.y = DIM.neckY;
  neck.rotation.order = 'YXZ';
  upper.add(neck);
  const head = mk(new THREE.BufferGeometry());
  neck.add(head);
  let halo: THREE.Mesh | null = null;
  // tay: arms[0] = x<0 (phải của nhân vật), arms[1] = x>0
  const arms = [-1, 1].map((sx) => {
    const ua = mk(new THREE.BufferGeometry());
    const fa = mk(new THREE.BufferGeometry());
    ua.position.set(sx * DIM.shoulderX, DIM.shoulderY, 0);
    upper.add(ua, fa);
    return { ua, fa, sx };
  });
  const lap = mk(new THREE.BufferGeometry());
  lap.position.y = DIM.hipY;
  body.add(lap);

  // trạng thái
  let look: Look = lookOf(profile);
  let curLevel = level;
  let tier = tierOf(level);
  let anim: Anim = 'idle';
  let animT = 0;
  let time = Math.random() * 10;
  const seed = Math.random() * 6.28;
  let phase = 0;
  let moveSpeed = 3.6;
  let seatLift = 0;
  let carry: 'broom' | null = null;
  const cur = new Float32Array(P.N);
  const tgt = new Float32Array(P.N);
  standBase(cur);
  const ctx: AnimCtx = { t: 0, time: 0, phase: 0, seed, carryBroom: false, smooth: 12 };
  const handPos = [new THREE.Vector3(), new THREE.Vector3()];

  // đạo cụ
  const props = new Map<string, PropInstance>();
  let lanternColor = '';
  const propHolder = new THREE.Group();
  upper.add(propHolder);
  let fish: THREE.Mesh | null = null;
  const getProp = (name: PropName): PropInstance => {
    const key = name;
    let p = props.get(key);
    if (!p) {
      p = createProp(name, name === 'lantern' ? lanternColor : undefined);
      props.set(key, p);
      propHolder.add(p.group);
    }
    return p;
  };
  /** Đổi màu đèn hoa đăng đang cầm (tạo lại đạo cụ đèn). */
  const setLanternColor = (c: string): void => {
    if (c === lanternColor && props.has('lantern')) return;
    const old = props.get('lantern');
    if (old) { propHolder.remove(old.group); old.dispose(); props.delete('lantern'); shown.delete(old); }
    lanternColor = c;
  };

  // nhãn
  const lab: LabelParts = createLabelEl();
  let sayLeft = 0;

  // cử chỉ
  interface ActiveGesture { id: GestureId; t: number; cued: boolean; resolve: () => void; onCue?: () => void; propKey: string | null }
  let gesture: ActiveGesture | null = null;

  function applyLook(): void {
    head.geometry = headGeometry(look);
    torso.geometry = torsoGeometry(look);
    // legs[0] = phải: dùng chung hình
    for (const l of legs) { l.thigh.geometry = thighGeometry(look); l.shin.geometry = shinGeometry(look); }
    arms[0].ua.geometry = upperArmGeometry(look);
    arms[1].ua.geometry = upperArmGeometry(look);
    arms[0].fa.geometry = foreArmGeometry(look, true);
    arms[1].fa.geometry = foreArmGeometry(look, false);
    const lg = lapGeometry(look);
    if (lg) { lap.geometry = lg; lap.visible = true; } else lap.visible = false;
    if (look.acc === 'halo-lotus') {
      if (!halo) {
        halo = new THREE.Mesh(getHaloGeometry(), haloMat);
        halo.position.set(0, DIM.headUp + 0.03, -0.2);
        halo.renderOrder = 2;
        neck.add(halo);
      }
    } else if (halo) { neck.remove(halo); halo = null; }
  }

  function applyTier(): void {
    ringHolder.clear();
    orbit.clear();
    const a = assetsOf(tier);
    const gm = new THREE.Mesh(a.glow, a.glowMat);
    gm.renderOrder = 2;
    const rm = new THREE.Mesh(a.ring, a.ringMat);
    rm.renderOrder = 3;
    ringHolder.add(gm, rm);
    if (a.petals && a.petalMat) orbit.add(new THREE.Mesh(a.petals, a.petalMat));
    lab.root.style.setProperty('--tier', tier.color);
    lab.root.style.setProperty('--tier-accent', tier.accent);
  }

  applyLook();
  applyTier();

  function propVisible(): { name: PropName; mount: 'R' | 'L' | 'mid'; color?: string }[] {
    const out: { name: PropName; mount: 'R' | 'L' | 'mid'; color?: string }[] = [];
    if (gesture) {
      const g = GESTURES[gesture.id];
      if (g.prop && gesture.t >= g.prop.from && gesture.t <= g.prop.to) out.push({ name: g.prop.name, mount: g.prop.mount, color: lanternColor });
    }
    const rightBusy = out.length > 0 && out[0].mount !== 'L';
    if (!rightBusy) {
      if (anim === 'sweep' || anim === 'doze' || carry === 'broom') out.push({ name: 'broom', mount: 'R' });
      else if (anim === 'chant') out.push({ name: 'mallet', mount: 'R' });
      else if (look.acc === 'lotus-hand' && anim !== 'bow' && anim !== 'beads') out.push({ name: 'lotusHeld', mount: 'R' });
    }
    if (anim === 'beads') out.push({ name: 'beads', mount: 'L' });
    return out;
  }

  const shown = new Set<PropInstance>();
  function updateProps(): void {
    const want = propVisible();
    const wantSet = new Set<PropInstance>();
    for (const w of want) {
      const inst = getProp(w.name);
      wantSet.add(inst);
      const g = inst.group;
      g.visible = true;
      // hand index: arms[0]=phải của nhân vật (RH), arms[1]=trái
      const R = handPos[0], L = handPos[1];
      if (w.mount === 'R') g.position.copy(R);
      else if (w.mount === 'L') g.position.copy(L);
      else g.position.copy(R).add(L).multiplyScalar(0.5);
      if (w.name === 'broom') {
        _dir.set(cur[P.AIM_X], cur[P.AIM_Y], cur[P.AIM_Z]).sub(g.position);
        if (_dir.lengthSq() < 1e-6) _dir.set(0, -1, 0.2);
        _dir.normalize();
        g.quaternion.setFromUnitVectors(DOWN, _dir);
      } else if (w.name === 'beads') {
        g.quaternion.identity();
      } else if (w.name === 'mallet') {
        g.rotation.set(cur[P.PROP_PITCH] + 0.9, 0, 0);
        g.position.z += 0.0;
      } else if (w.name === 'lotusHeld') {
        g.rotation.set(0.22, 0, 0);
      } else {
        g.rotation.set(cur[P.PROP_PITCH] * 0.6 + 0.12, 0, 0);
        if (w.name === 'bowl') g.rotation.set(0.0, 0, 0);
        if (w.name === 'bowl') g.rotation.x = cur[P.PROP_PITCH] * 0.9;
      }
    }
    for (const inst of shown) if (!wantSet.has(inst)) inst.group.visible = false;
    shown.clear();
    for (const i of wantSet) shown.add(i);
    // mõ
    const wantFish = anim === 'chant';
    if (wantFish && !fish) {
      fish = createFish();
      fish.position.set(0.06, 0.02, -0.48);
      group.add(fish); // đặt phía trước đầu gối nhân vật đúng dưới đầu dùi gõ
    }
    if (fish) fish.visible = wantFish;
  }

  function applyPose(): void {
    body.position.y = cur[P.ROOT_Y] + seatLift * cur[P.LAP];
    upper.rotation.set(cur[P.PITCH], cur[P.YAW], cur[P.ROLL]);
    neck.rotation.set(cur[P.H_PITCH], cur[P.H_YAW], cur[P.H_ROLL]);
    // chân (legs[0] = x<0 → "phải"; sx = -1)
    legs[0].hip.rotation.set(-cur[P.HIP_RX], -cur[P.HIP_RZ], 0);
    legs[1].hip.rotation.set(-cur[P.HIP_LX], cur[P.HIP_LZ], 0);
    legs[0].knee.rotation.set(cur[P.KNEE_R], 0, 0);
    legs[1].knee.rotation.set(cur[P.KNEE_L], 0, 0);
    // tay (arms[0] = x<0 = phải)
    const a0 = arms[0], a1 = arms[1];
    solveArm(-1, cur[P.RH_X], cur[P.RH_Y], cur[P.RH_Z], a0.ua.quaternion, a0.fa.quaternion, _E, _H);
    a0.fa.position.copy(_E);
    handPos[0].copy(_H);
    solveArm(1, cur[P.LH_X], cur[P.LH_Y], cur[P.LH_Z], a1.ua.quaternion, a1.fa.quaternion, _E, _H);
    a1.fa.position.copy(_E);
    handPos[1].copy(_H);
    lap.scale.setScalar(Math.max(0.001, cur[P.LAP]));
    lap.visible = cur[P.LAP] > 0.02 && lapGeometry(look) !== null;
    lap.position.y = DIM.hipY;
  }

  function finishGesture(): void {
    const g = gesture;
    if (!g) return;
    gesture = null;
    g.resolve();
  }

  function setAnim(a: Anim): void {
    if (a === anim) {
      if (a === 'bow') animT = 0;
      return;
    }
    anim = a;
    animT = 0;
    lab.root.classList.toggle('w2-doze', a === 'doze');
  }

  let orbitSpin = Math.random() * 6;
  let ringPulse = 0;

  function update(dt: number): void {
    time += dt;
    animT += dt;
    ctx.t = animT;
    ctx.time = time;
    ctx.carryBroom = carry === 'broom';
    ctx.smooth = 12;
    if (anim === 'walk') phase += dt * Math.max(5, Math.min(13, 2.6 * moveSpeed));
    ctx.phase = phase;
    ANIMS[anim](tgt, ctx);
    if (gesture) {
      const gd = GESTURES[gesture.id];
      gesture.t += dt;
      applyGesture(tgt, gd, gesture.t);
      if (!gesture.cued && gesture.t >= gd.cue) {
        gesture.cued = true;
        if (gd.after === 'broom') carry = 'broom';
        try { gesture.onCue?.(); } catch (e) { console.error(e); }
      }
      if (gesture.t >= gd.dur) finishGesture();
    }
    const k = 1 - Math.exp(-ctx.smooth * Math.min(dt, 0.1));
    for (let i = 0; i < P.N; i++) cur[i] += (tgt[i] - cur[i]) * k;
    applyPose();
    updateProps();
    // vòng bậc + cánh sen
    ringPulse += dt * 1.6;
    const rs = 1 + Math.sin(ringPulse + seed) * 0.03;
    ringHolder.scale.set(rs, 1, rs);
    if (orbit.children.length) {
      orbitSpin += dt * 0.75;
      orbit.rotation.y = orbitSpin;
      orbit.position.y = 0.13 + Math.sin(ringPulse * 0.9 + seed) * 0.03;
    }
    if (halo) halo.rotation.z += dt * 0.25;
    if (sayLeft > 0) {
      sayLeft -= dt;
      if (sayLeft <= 0) lab.bubble.classList.remove('on');
    }
  }

  const rig: AvatarRig = {
    group,
    labelEl: lab.root,
    get tier() { return tier; },
    setAnim,
    getAnim: () => anim,
    update,
    setProfile(p, lv) {
      look = lookOf(p);
      applyLook();
      if (lv !== curLevel) { curLevel = lv; const nt = tierOf(lv); if (nt.id !== tier.id) { tier = nt; applyTier(); } }
    },
    setLabel(text, lv, me = false) {
      lab.name.textContent = text;
      lab.level.textContent = `Cấp ${lv}`;
      lab.me.style.display = me ? '' : 'none';
      lab.root.classList.toggle('w2-mine', me);
      const nt = tierOf(lv);
      curLevel = lv;
      if (nt.id !== tier.id) { tier = nt; applyTier(); }
    },
    say(text, ms) {
      const t = text.trim();
      if (!t) return;
      const chars = Array.from(t);
      lab.bubble.textContent = chars.length > SAY_MAX ? chars.slice(0, SAY_MAX - 1).join('') + '…' : t;
      lab.bubble.classList.remove('on');
      void lab.bubble.offsetWidth; // chạy lại hoạt ảnh
      lab.bubble.classList.add('on');
      // Câu dài hiện lâu hơn để kịp đọc (tối thiểu 4 giây, tối đa 8 giây)
      sayLeft = (ms ?? Math.min(8000, Math.max(4000, 1500 + Math.min(chars.length, SAY_MAX) * 75))) / 1000;
    },
    headAnchor(out) {
      return out.set(group.position.x, group.position.y + 1.36 + Math.min(0, body.position.y) * 0.8, group.position.z);
    },
    playGesture(id, opts) {
      if (gesture) finishGesture();
      return new Promise<void>((resolve) => {
        if (GESTURES[id].prop?.name === 'lantern') setLanternColor(opts?.color ?? '#ffb24a');
        gesture = { id, t: 0, cued: false, resolve, onCue: opts?.onCue, propKey: null };
      });
    },
    cancelGesture: finishGesture,
    isGesturing: () => gesture !== null,
    setCarry(p) { carry = p; },
    getCarry: () => carry,
    broomTip(out) {
      const g = props.get('broom')?.group;
      upper.updateWorldMatrix(true, false);
      if (g && g.visible) {
        _dir.set(0, -BROOM_LEN, 0).applyQuaternion(g.quaternion).add(g.position);
      } else _dir.set(0, -0.3, 0.6);
      return upper.localToWorld(out.copy(_dir));
    },
    setMoveSpeed(v) { moveSpeed = v; },
    setSeatLift(h) { seatLift = h; },
    setCastShadow(on) {
      group.traverse((o) => { if ((o as THREE.Mesh).isMesh && o !== shadow && o.parent !== ringHolder && o.parent !== orbit) o.castShadow = on; });
    },
    dispose() {
      finishGesture();
      for (const p of props.values()) p.dispose();
      props.clear();
      lab.root.remove();
      group.removeFromParent();
    },
  };
  return rig;
}
