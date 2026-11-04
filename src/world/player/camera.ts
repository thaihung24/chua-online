/**
 * Camera người thứ ba: bám sau nhân vật bằng lò xo mượt, góc cao ~22°, khoảng cách 5–7 m, FOV 56.
 * Chống xuyên tường đơn giản (rút ngắn khoảng cách khi tia từ nhân vật tới camera đâm vào vật cản),
 * zoom nhẹ khi ngồi thiền, tự xoay chậm quanh cảnh khi panel toàn màn hình mở.
 */
import * as THREE from 'three';
import { BLOCKS, BOUNDS } from '../layout';

/** Vật cản che tầm nhìn (bỏ ao vì chỉ là mặt nước phẳng). */
const OCCLUDERS = BLOCKS.filter((b) => !b.name.includes('pond'));

export class CameraRig {
  readonly camera = new THREE.PerspectiveCamera(56, 1, 0.1, 500);
  yaw = 0;
  pitch = 0.4;
  dist = 6.2;
  private tYaw = 0;
  private tPitch = 0.4;
  private tDist = 6.2;
  private focus = new THREE.Vector3();
  private shown = 6.2; // khoảng cách thực sau chống xuyên
  private lastUser = -10;
  private t = 0;
  private inited = false;
  private look = new THREE.Vector3();

  static readonly MIN_DIST = 3.2;
  static readonly MAX_DIST = 11;

  setAspect(a: number): void {
    this.camera.aspect = a;
    // màn hình dọc (điện thoại): FOV rộng hơn một chút để thấy đủ cảnh
    this.camera.fov = a < 0.8 ? 62 : 56;
    this.camera.updateProjectionMatrix();
  }

  /** Đặt cứng (khi vào cảnh/dịch chuyển). */
  snap(x: number, z: number, yaw: number): void {
    this.focus.set(x, 0, z);
    this.yaw = this.tYaw = yaw;
    this.inited = false;
  }

  orbit(dxPx: number, dyPx: number): void {
    this.tYaw -= dxPx * 0.0058;
    this.tPitch = Math.max(0.1, Math.min(1.1, this.tPitch + dyPx * 0.0044));
    this.lastUser = this.t;
  }

  rotate(rad: number): void { this.tYaw += rad; this.lastUser = this.t; }

  zoom(delta: number): void {
    this.tDist = Math.max(CameraRig.MIN_DIST, Math.min(CameraRig.MAX_DIST, this.tDist * (1 + delta * 0.1)));
    this.lastUser = this.t;
  }

  /** Quay dần về sau lưng hướng nhìn (khi tự đi, người chơi không kéo camera). */
  followBehind(facing: number, dt: number): void {
    if (this.t - this.lastUser < 1.6) return;
    // đứng sau lưng: yaw camera = hướng nhìn của nhân vật
    let d = facing - this.tYaw;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    this.tYaw += d * (1 - Math.exp(-0.9 * dt));
  }

  update(dt: number, px: number, pz: number, py: number, o: { seated: boolean; orbiting: boolean }): void {
    this.t += dt;
    const kPos = this.inited ? 1 - Math.exp(-9 * dt) : 1;
    this.inited = true;
    this.focus.x += (px - this.focus.x) * kPos;
    this.focus.z += (pz - this.focus.z) * kPos;
    this.focus.y += (py - this.focus.y) * kPos;

    if (o.orbiting) {
      this.tYaw += dt * 0.06;
      this.tPitch += (0.3 - this.tPitch) * (1 - Math.exp(-1.2 * dt));
    }
    const wantDist = (o.orbiting ? 8.5 : this.tDist) * (o.seated ? 0.74 : 1);
    const kAng = 1 - Math.exp(-11 * dt);
    this.yaw += (this.tYaw - this.yaw) * kAng;
    this.pitch += ((o.seated ? this.tPitch * 0.85 : this.tPitch) - this.pitch) * kAng;
    this.dist += (wantDist - this.dist) * (1 - Math.exp(-5 * dt));

    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    const dirX = Math.sin(this.yaw) * cp, dirZ = Math.cos(this.yaw) * cp;
    // chống xuyên: rút ngắn theo tia ngang
    const fx = this.focus.x, fz = this.focus.z;
    let want = this.dist;
    const horiz = want * cp;
    for (let s = 0.8; s <= horiz + 0.3; s += 0.25) {
      const x = fx + (dirX / cp) * s, z = fz + (dirZ / cp) * s;
      let hit = false;
      for (const b of OCCLUDERS) {
        if (x > b.x0 - 0.4 && x < b.x1 + 0.4 && z > b.z0 - 0.4 && z < b.z1 + 0.4) { hit = true; break; }
      }
      if (hit) { want = Math.max(1.8, (s - 0.45) / cp); break; }
    }
    // co nhanh, giãn chậm (tránh giật)
    this.shown += (want - this.shown) * (1 - Math.exp(-(want < this.shown ? 14 : 3.5) * dt));
    const d = this.shown;
    const cam = this.camera.position;
    cam.set(fx + dirX * d, this.focus.y + 1.05 + sp * d, fz + dirZ * d);
    cam.x = Math.max(BOUNDS.x0 - 6, Math.min(BOUNDS.x1 + 6, cam.x));
    cam.z = Math.max(BOUNDS.z0 - 6, Math.min(BOUNDS.z1 + 6, cam.z));
    if (cam.y < 0.6) cam.y = 0.6;
    // nhìn qua vai: điểm ngắm hơi phía trước nhân vật để nhân vật nằm thấp hơn giữa khung
    const fwdX = -Math.sin(this.yaw), fwdZ = -Math.cos(this.yaw);
    this.look.set(fx + fwdX * 1.6, this.focus.y + 1.2 - (o.seated ? 0.15 : 0), fz + fwdZ * 1.6);
    this.camera.lookAt(this.look);
  }
}
