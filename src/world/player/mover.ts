/**
 * Bộ điều khiển di chuyển của người chơi: đi theo joystick/phím (theo hướng camera) hoặc theo đường A*,
 * gia tốc mượt, va chạm trượt dọc tường, quay mặt mượt (kể cả quay về hướng chỉ định khi tới nơi).
 */
import { BOUNDS, type Vec2 } from '../layout';
import { findPath, resolveCollision } from '../nav';

export interface WalkOpts {
  /** Dừng sớm khi cách `at` trong vòng `r` mét (đứng gần vật tương tác, không đè lên). */
  stopNear?: { x: number; z: number; r: number };
}

const wrapPi = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

export class Mover {
  x = 0;
  z = 0;
  ry = 0;
  vx = 0;
  vz = 0;
  speed = 3.6;
  moving = false;
  private path: Vec2[] | null = null;
  private pi = 0;
  private stopNear: WalkOpts['stopNear'];
  private pathDone: ((ok: boolean) => void) | null = null;
  private faceTo: number | null = null;
  private faceDone: (() => void) | null = null;
  private faceT = 0;
  private stuck = 0;
  /** đã điều khiển tay trong khung này */
  manual = false;

  teleport(x: number, z: number, ry?: number): void {
    this.cancelPath(false);
    this.x = x; this.z = z; this.vx = this.vz = 0;
    if (ry !== undefined) this.ry = ry;
    this.moving = false;
  }

  hasPath(): boolean { return this.path !== null; }

  cancelPath(ok = false): void {
    this.path = null;
    this.stopNear = undefined;
    const d = this.pathDone;
    this.pathDone = null;
    d?.(ok);
  }

  cancelFace(): void {
    this.faceTo = null;
    const d = this.faceDone;
    this.faceDone = null;
    d?.();
  }

  /** Đi tới (x,z) theo đường tránh vật cản. Resolve true nếu tới nơi, false nếu bị huỷ/không có đường. */
  walkTo(x: number, z: number, opts?: WalkOpts): Promise<boolean> {
    this.cancelPath(false);
    this.cancelFace();
    const p = findPath(this.x, this.z, x, z);
    if (!p || p.length === 0) return Promise.resolve(false);
    this.path = p;
    this.pi = 0;
    this.stopNear = opts?.stopNear;
    this.stuck = 0;
    return new Promise<boolean>((res) => { this.pathDone = res; });
  }

  /** Quay mặt về góc `ang` (rad, quy ước layout). */
  turnTo(ang: number): Promise<void> {
    this.cancelFace();
    this.faceTo = ang;
    this.faceT = 0;
    return new Promise<void>((res) => { this.faceDone = res; });
  }

  update(dt: number, ix: number, iy: number, camYaw: number): void {
    const mag = Math.min(1, Math.hypot(ix, iy));
    let dvx = 0, dvz = 0;
    this.manual = mag > 0.05;
    if (this.manual) {
      if (this.path) this.cancelPath(false);
      if (this.faceTo !== null) this.cancelFace();
      const sy = Math.sin(camYaw), cy = Math.cos(camYaw);
      // tiến = (-sin, -cos); phải = (cos, -sin)
      dvx = (-sy * iy + cy * ix) * this.speed;
      dvz = (-cy * iy - sy * ix) * this.speed;
    } else if (this.path) {
      const wp = this.path[this.pi];
      let dx = wp.x - this.x, dz = wp.z - this.z;
      let d = Math.hypot(dx, dz);
      const last = this.pi === this.path.length - 1;
      if (this.stopNear) {
        const s = this.stopNear;
        if (Math.hypot(s.x - this.x, s.z - this.z) <= s.r) { this.cancelPath(true); d = 0; dx = dz = 0; }
      }
      if (this.path) {
        if (d < (last ? 0.12 : 0.35)) {
          this.pi++;
          if (this.pi >= this.path.length) this.cancelPath(true);
        } else {
          const slow = last ? Math.min(1, 0.35 + d / 1.2) : 1;
          dvx = (dx / d) * this.speed * slow;
          dvz = (dz / d) * this.speed * slow;
        }
      }
    }
    const k = 1 - Math.exp(-(this.manual || this.path ? 9 : 14) * dt);
    this.vx += (dvx - this.vx) * k;
    this.vz += (dvz - this.vz) * k;
    const ox = this.x, oz = this.z;
    const pos = { x: this.x + this.vx * dt, z: this.z + this.vz * dt };
    resolveCollision(pos);
    this.x = Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, pos.x));
    this.z = Math.max(BOUNDS.z0, Math.min(BOUNDS.z1, pos.z));
    const moved = Math.hypot(this.x - ox, this.z - oz) / Math.max(dt, 1e-4);
    // kẹt khi đang theo đường: bỏ cuộc sau 1.2 s
    if (this.path && !this.manual) {
      this.stuck = moved < 0.25 ? this.stuck + dt : 0;
      if (this.stuck > 1.2) this.cancelPath(false);
    }
    const sp = Math.hypot(this.vx, this.vz);
    this.moving = sp > 0.35;
    // quay mặt
    let target: number | null = null;
    if (sp > 0.3) target = Math.atan2(-this.vx, -this.vz);
    else if (this.faceTo !== null) target = this.faceTo;
    if (target !== null) {
      const diff = wrapPi(target - this.ry);
      this.ry = wrapPi(this.ry + diff * (1 - Math.exp(-13 * dt)));
      if (this.faceTo !== null && sp <= 0.3) {
        this.faceT += dt;
        if (Math.abs(diff) < 0.07 || this.faceT > 1.0) this.cancelFace();
      }
    }
  }
}
