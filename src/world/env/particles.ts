/**
 * Hệ hạt: (1) ParticleField — hạt mô phỏng CPU (khói, tia sáng, lộc vàng, giọt nước…) vẽ bằng một Points;
 * (2) Halos — quầng sáng tĩnh (đèn đá, nến, đèn lồng) bật theo đêm; (3) AmbientField — bụi nắng ban ngày / đom đóm ban đêm
 * chạy hoàn toàn bằng shader, bao quanh camera.
 */
import * as THREE from 'three';
import { rng, type SharedUniforms } from './core';

const SOFT_FRAG = `
  varying vec4 vCol;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    a = a * a * (1.5 - 0.5 * a);
    gl_FragColor = vec4(vCol.rgb, vCol.a * a);
    if (gl_FragColor.a < 0.003) discard;
    #include <colorspace_fragment>
  }`;

export interface PxUniform { uPx: { value: number } }

export class ParticleField {
  readonly points: THREE.Points;
  private pos: Float32Array; private col: Float32Array; private size: Float32Array;
  private vel: Float32Array; private life: Float32Array; private maxLife: Float32Array;
  private s0: Float32Array; private s1: Float32Array; private c0: Float32Array; private c1: Float32Array;
  private a0: Float32Array; private grav: Float32Array; private drag: Float32Array; private tw: Float32Array; private sway: Float32Array;
  private head = 0;
  private g: THREE.BufferGeometry;
  private mat: THREE.ShaderMaterial;
  private alive = 0;
  constructor(readonly cap: number, additive: boolean, px: PxUniform) {
    this.pos = new Float32Array(cap * 3); this.col = new Float32Array(cap * 4); this.size = new Float32Array(cap);
    this.vel = new Float32Array(cap * 3); this.life = new Float32Array(cap); this.maxLife = new Float32Array(cap).fill(1);
    this.s0 = new Float32Array(cap); this.s1 = new Float32Array(cap); this.c0 = new Float32Array(cap * 3); this.c1 = new Float32Array(cap * 3);
    this.a0 = new Float32Array(cap); this.grav = new Float32Array(cap); this.drag = new Float32Array(cap); this.tw = new Float32Array(cap); this.sway = new Float32Array(cap);
    this.life.fill(-1);
    this.g = new THREE.BufferGeometry();
    this.g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.g.setAttribute('aCol', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    this.g.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, fog: false,
      uniforms: { uPx: px.uPx },
      vertexShader: `
        attribute vec4 aCol; attribute float aSize; varying vec4 vCol; uniform float uPx;
        void main() {
          vCol = aCol;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPx / max(0.5, -mv.z);
        }`,
      fragmentShader: SOFT_FRAG,
    });
    this.points = new THREE.Points(this.g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = additive ? 20 : 10;
  }
  spawn(x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, size0: number, size1: number, color0: THREE.Color, color1: THREE.Color | null, alpha: number, gravity = 0, drag = 0, twinkle = 0, sway = 0): void {
    const i = this.head; this.head = (this.head + 1) % this.cap;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    this.life[i] = 0; this.maxLife[i] = life; this.s0[i] = size0; this.s1[i] = size1;
    const c1 = color1 ?? color0;
    this.c0[i * 3] = color0.r; this.c0[i * 3 + 1] = color0.g; this.c0[i * 3 + 2] = color0.b;
    this.c1[i * 3] = c1.r; this.c1[i * 3 + 1] = c1.g; this.c1[i * 3 + 2] = c1.b;
    this.a0[i] = alpha; this.grav[i] = gravity; this.drag[i] = drag; this.tw[i] = twinkle; this.sway[i] = sway;
  }
  update(dt: number, t: number): void {
    let alive = 0;
    for (let i = 0; i < this.cap; i++) {
      if (this.life[i] < 0) continue;
      this.life[i] += dt;
      const k = this.life[i] / this.maxLife[i];
      if (k >= 1) { this.life[i] = -1; this.size[i] = 0; this.col[i * 4 + 3] = 0; continue; }
      alive++;
      const dr = Math.max(0, 1 - this.drag[i] * dt);
      this.vel[i * 3] *= dr; this.vel[i * 3 + 2] *= dr; this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * dr - this.grav[i] * dt;
      const sw = this.sway[i];
      this.pos[i * 3] += (this.vel[i * 3] + (sw ? Math.sin(t * 2.1 + i) * sw : 0)) * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += (this.vel[i * 3 + 2] + (sw ? Math.cos(t * 1.7 + i * 1.3) * sw : 0)) * dt;
      const fadeIn = Math.min(1, k * 8), fadeOut = 1 - k;
      const twk = this.tw[i] ? 0.65 + 0.35 * Math.sin(t * 18 + i * 3.1) : 1;
      this.col[i * 4] = this.c0[i * 3] + (this.c1[i * 3] - this.c0[i * 3]) * k;
      this.col[i * 4 + 1] = this.c0[i * 3 + 1] + (this.c1[i * 3 + 1] - this.c0[i * 3 + 1]) * k;
      this.col[i * 4 + 2] = this.c0[i * 3 + 2] + (this.c1[i * 3 + 2] - this.c0[i * 3 + 2]) * k;
      this.col[i * 4 + 3] = this.a0[i] * fadeIn * fadeOut * twk;
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * k;
    }
    this.alive = alive;
    (this.g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.g.attributes.aCol as THREE.BufferAttribute).needsUpdate = true;
    (this.g.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    this.points.visible = alive > 0 || this.wasAlive;
    this.wasAlive = alive > 0;
  }
  private wasAlive = false;
  count(): number { return this.alive; }
  dispose(): void { this.g.dispose(); this.mat.dispose(); }
}

export interface HaloSpec { x: number; y: number; z: number; size: number; color: THREE.ColorRepresentation; flicker?: number; /** 0 = chỉ ban đêm, 1 = cả ngày */ day?: number }

/** Quầng sáng tĩnh (đèn đá, đèn lồng…): sáng dần theo đêm, nhấp nháy nhẹ. */
export class Halos {
  readonly points: THREE.Points;
  private mat: THREE.ShaderMaterial;
  private g = new THREE.BufferGeometry();
  constructor(specs: HaloSpec[], shared: SharedUniforms, px: PxUniform, private nightUniform: { value: number }) {
    const n = specs.length;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), meta = new Float32Array(n * 3);
    const c = new THREE.Color();
    specs.forEach((s, i) => {
      pos.set([s.x, s.y, s.z], i * 3); c.set(s.color); col.set([c.r, c.g, c.b], i * 3);
      meta.set([s.size, s.flicker ?? 0.1, s.day ?? 0], i * 3);
    });
    this.g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.g.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
    this.g.setAttribute('aMeta', new THREE.BufferAttribute(meta, 3));
    this.mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uPx: px.uPx, uNight: nightUniform, uTime: shared.uTime },
      vertexShader: `
        attribute vec3 aCol; attribute vec3 aMeta; uniform float uPx, uNight, uTime; varying vec4 vCol;
        void main() {
          float fl = 1.0 + aMeta.y * (sin(uTime * 7.0 + position.x * 3.1 + position.z * 1.7) * 0.5 + sin(uTime * 13.0 + position.z * 2.3) * 0.5);
          float on = mix(uNight, 1.0, aMeta.z);
          vCol = vec4(aCol * fl, 0.55 * on);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aMeta.x * uPx / max(0.5, -mv.z) * (0.4 + 0.6 * on);
        }`,
      fragmentShader: SOFT_FRAG,
    });
    this.points = new THREE.Points(this.g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 19;
  }
  update(): void { this.points.visible = this.nightUniform.value > 0.02; }
  dispose(): void { this.g.dispose(); this.mat.dispose(); }
}

/** Bụi nắng (ngày) hoặc đom đóm (đêm) — vị trí tính trong shader, bao quanh camera. */
export class AmbientField {
  readonly points: THREE.Points;
  private mat: THREE.ShaderMaterial;
  private g = new THREE.BufferGeometry();
  private cam = { value: new THREE.Vector3() };
  private box: THREE.Vector3;
  constructor(count: number, kind: 'dust' | 'firefly', box: THREE.Vector3, shared: SharedUniforms, px: PxUniform, private ybase = 0) {
    this.box = box;
    const r = rng(kind === 'dust' ? 3 : 4);
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) seed.set([r(), r(), r(), r()], i * 4);
    this.g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    this.g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    const fire = kind === 'firefly';
    this.mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uPx: px.uPx, uNight: shared.uNight, uTime: shared.uTime, uCam: this.cam, uBox: { value: box }, uY: { value: ybase } },
      vertexShader: `
        attribute vec4 aSeed; uniform float uPx, uNight, uTime, uY; uniform vec3 uCam, uBox; varying vec4 vCol;
        void main() {
          vec3 p0 = aSeed.xyz * uBox;
          float t = uTime * ${fire ? '0.35' : '0.12'};
          vec3 drift = vec3(sin(t * 1.3 + aSeed.w * 40.0) * ${fire ? '2.2' : '0.8'}, sin(t * 1.9 + aSeed.w * 21.0) * ${fire ? '0.7' : '0.4'} + ${fire ? '0.0' : '-t * 0.6'}, cos(t * 1.1 + aSeed.w * 33.0) * ${fire ? '2.2' : '0.8'});
          vec3 p = p0 + drift;
          p = mod(p - uCam + uBox * 0.5, uBox) - uBox * 0.5 + uCam;
          p.y = uY + mod(p0.y + drift.y, uBox.y);
          float on = ${fire ? 'smoothstep(0.35, 0.9, uNight)' : '(1.0 - smoothstep(0.1, 0.6, uNight))'};
          float tw = ${fire ? '0.5 + 0.5 * sin(uTime * (2.0 + aSeed.w * 3.0) + aSeed.w * 90.0)' : '0.55 + 0.45 * sin(uTime * 1.3 + aSeed.w * 60.0)'};
          float edge = 1.0 - smoothstep(0.35, 0.5, length((p.xz - uCam.xz) / uBox.xz));
          vCol = vec4(${fire ? 'vec3(0.85, 1.0, 0.35)' : 'vec3(1.0, 0.95, 0.8)'}, ${fire ? '0.9' : '0.55'} * on * tw * edge);
          vec4 mv = viewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (${fire ? '0.2' : '0.07'} + aSeed.z * ${fire ? '0.08' : '0.05'}) * uPx / max(0.5, -mv.z);
        }`,
      fragmentShader: SOFT_FRAG,
    });
    this.points = new THREE.Points(this.g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 18;
  }
  update(camera: THREE.Camera, night: number, kind: 'dust' | 'firefly'): void {
    this.cam.value.copy(camera.position);
    this.points.visible = kind === 'firefly' ? night > 0.3 : night < 0.7;
  }
  dispose(): void { this.g.dispose(); this.mat.dispose(); void this.ybase; void this.box; }
}
