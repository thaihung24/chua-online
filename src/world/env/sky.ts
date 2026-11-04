/**
 * Bầu trời & chu kỳ ngày/đêm: vòm trời gradient, mặt trời/mặt trăng, sao, mây, núi xa, ánh sáng chính (có bóng),
 * sương mù, tone mapping ACES, bản đồ môi trường PMREM cho kim loại. Mặc định theo giờ thật tại Việt Nam (UTC+7).
 */
import * as THREE from 'three';
import { VN_OFFSET_MS } from '@/core/contracts';
import { clamp, lerp, rng, smoothstep, TAU } from './core';
import { cloudTexture, glowTexture } from './textures';

interface Key { s: number; zen: string; hor: string; fog: string; hemiSky: string; hemiGround: string; hemiInt: number; sun: string; mount: string }
// Bảng màu theo độ cao mặt trời s = sin(góc). Âm = dưới chân trời.
const KEYS: Key[] = [
  { s: -0.45, zen: '#050816', hor: '#0e1a38', fog: '#0c1630', hemiSky: '#2a3d78', hemiGround: '#18141c', hemiInt: 0.62, sun: '#ff9a52', mount: '#08111f' },
  { s: -0.14, zen: '#141a44', hor: '#4a4670', fog: '#3a3a62', hemiSky: '#5a5f9c', hemiGround: '#2a2024', hemiInt: 0.66, sun: '#ff8a4a', mount: '#1a2036' },
  { s: -0.02, zen: '#3c4b86', hor: '#ee8f62', fog: '#c58a7e', hemiSky: '#9aa4d0', hemiGround: '#5a4636', hemiInt: 0.72, sun: '#ff9446', mount: '#4a4660' },
  { s: 0.12, zen: '#4f78c0', hor: '#ffc690', fog: '#d8c0a8', hemiSky: '#bccbe6', hemiGround: '#6c5a44', hemiInt: 0.85, sun: '#ffc27a', mount: '#587a78' },
  { s: 0.35, zen: '#4585d8', hor: '#c9e0f0', fog: '#cfe0e6', hemiSky: '#d2e4fa', hemiGround: '#7a6a50', hemiInt: 0.95, sun: '#fff0d4', mount: '#5b8c80' },
  { s: 1.0, zen: '#3a82e0', hor: '#bfe0f6', fog: '#cfe5ee', hemiSky: '#d8e8fc', hemiGround: '#807052', hemiInt: 1.0, sun: '#fff6e4', mount: '#5a9486' },
];
const C = KEYS.map((k) => ({ s: k.s, zen: new THREE.Color(k.zen), hor: new THREE.Color(k.hor), fog: new THREE.Color(k.fog), hemiSky: new THREE.Color(k.hemiSky), hemiGround: new THREE.Color(k.hemiGround), hemiInt: k.hemiInt, sun: new THREE.Color(k.sun), mount: new THREE.Color(k.mount) }));

interface Sample { zen: THREE.Color; hor: THREE.Color; fog: THREE.Color; hemiSky: THREE.Color; hemiGround: THREE.Color; hemiInt: number; sun: THREE.Color; mount: THREE.Color }
function makeSample(): Sample { return { zen: new THREE.Color(), hor: new THREE.Color(), fog: new THREE.Color(), hemiSky: new THREE.Color(), hemiGround: new THREE.Color(), hemiInt: 0, sun: new THREE.Color(), mount: new THREE.Color() }; }
function sampleKeys(s: number, out: Sample): void {
  let i = 0;
  while (i < C.length - 2 && s > C[i + 1].s) i++;
  const a = C[i], b = C[i + 1];
  const t = clamp((s - a.s) / (b.s - a.s));
  out.zen.copy(a.zen).lerp(b.zen, t); out.hor.copy(a.hor).lerp(b.hor, t); out.fog.copy(a.fog).lerp(b.fog, t);
  out.hemiSky.copy(a.hemiSky).lerp(b.hemiSky, t); out.hemiGround.copy(a.hemiGround).lerp(b.hemiGround, t);
  out.hemiInt = lerp(a.hemiInt, b.hemiInt, t); out.sun.copy(a.sun).lerp(b.sun, t); out.mount.copy(a.mount).lerp(b.mount, t);
}

export function vnHour(now = Date.now()): number {
  const d = new Date(now + VN_OFFSET_MS);
  return d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
}

const DAY_HOUR = 15.2;
const NIGHT_HOUR = 22.0;

export class SkyRig {
  readonly group = new THREE.Group();
  readonly key: THREE.DirectionalLight;
  readonly hemi: THREE.HemisphereLight;
  private readonly sky: THREE.Mesh;
  private readonly skyMat: THREE.ShaderMaterial;
  private readonly sunDisc: THREE.Mesh;
  private readonly sunHalo: THREE.Sprite;
  private readonly moonDisc: THREE.Mesh;
  private readonly moonHalo: THREE.Sprite;
  private readonly stars: THREE.Points;
  private readonly clouds: { sp: THREE.Sprite; az: number; el: number; speed: number }[] = [];
  private readonly mountains: THREE.Mesh[] = [];
  private mountainMat: THREE.MeshBasicMaterial;
  private envTex: THREE.Texture | null = null;
  private pmrem: THREE.PMREMGenerator;
  private tod = 12;
  private mode: 'auto' | 'day' | 'night' = 'auto';
  private night = 0;
  private sunAlt = 1;
  private readonly sample = makeSample();
  private readonly sunDir = new THREE.Vector3();
  private readonly moonDir = new THREE.Vector3();
  private readonly tmp = new THREE.Vector3();
  private readonly tmpC = new THREE.Color();
  private readonly fogColor = new THREE.Color();
  private readonly tex: THREE.Texture[] = [];
  private shadowSize = 2048;
  private shadowOn = true;
  private sx = Infinity; private sz = Infinity;
  private farFixed = false;

  constructor(private readonly scene: THREE.Scene, private readonly renderer: THREE.WebGLRenderer) {
    this.group.name = 'sky';
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.fog = new THREE.FogExp2(0xcfe5ee, 0.0062);

    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
      uniforms: {
        uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uBot: { value: new THREE.Color() },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color() }, uSunAmt: { value: 1 },
        uMoonDir: { value: new THREE.Vector3(0, -1, 0) }, uMoonAmt: { value: 0 },
      },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position = p.xyww; }`,
      fragmentShader: `
        uniform vec3 uTop, uHor, uBot, uSunDir, uSunCol, uMoonDir; uniform float uSunAmt, uMoonAmt; varying vec3 vDir;
        void main(){
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 col = mix(uHor, uTop, pow(smoothstep(-0.02, 0.62, h), 0.62));
          col = mix(col, uBot, smoothstep(0.0, -0.22, h));
          float sd = max(dot(d, uSunDir), 0.0);
          col += uSunCol * (pow(sd, 6.0) * 0.22 + pow(sd, 48.0) * 0.5) * uSunAmt;
          float md = max(dot(d, uMoonDir), 0.0);
          col += vec3(0.45,0.55,0.85) * pow(md, 30.0) * 0.28 * uMoonAmt;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 20), this.skyMat);
    this.sky.frustumCulled = false; this.sky.renderOrder = -1000;
    this.group.add(this.sky);

    const glowT = glowTexture(); this.tex.push(glowT);
    const mkSprite = (color: number, size: number): THREE.Sprite => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      sp.scale.setScalar(size); sp.renderOrder = -900; return sp;
    };
    this.sunDisc = new THREE.Mesh(new THREE.CircleGeometry(7, 32), new THREE.MeshBasicMaterial({ color: 0xfff3d0, fog: false, depthWrite: false, toneMapped: false }));
    this.sunDisc.renderOrder = -899;
    this.sunHalo = mkSprite(0xffd9a0, 120);
    this.moonDisc = new THREE.Mesh(new THREE.CircleGeometry(6, 40), new THREE.MeshBasicMaterial({ map: this.moonTexture(), fog: false, depthWrite: false, transparent: true, toneMapped: false }));
    this.moonDisc.renderOrder = -899;
    this.moonHalo = mkSprite(0x9db4ff, 70);
    this.group.add(this.sunDisc, this.sunHalo, this.moonDisc, this.moonHalo);

    // sao
    const r = rng(7);
    const N = 700;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const az = r() * TAU, el = Math.asin(0.04 + r() * 0.96);
      pos[i * 3] = Math.cos(el) * Math.cos(az) * 190; pos[i * 3 + 1] = Math.sin(el) * 190; pos[i * 3 + 2] = Math.cos(el) * Math.sin(az) * 190;
      const w = 0.6 + r() * 0.4, tint = r();
      col[i * 3] = w * (tint > 0.7 ? 1 : 0.85); col[i * 3 + 1] = w * 0.92; col[i * 3 + 2] = w * (tint < 0.3 ? 1 : 0.95);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 1.8, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, fog: false }));
    this.stars.frustumCulled = false; this.stars.renderOrder = -950;
    this.group.add(this.stars);

    // mây
    const ct = cloudTexture(); this.tex.push(ct);
    const rc = rng(19);
    for (let i = 0; i < 11; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, fog: false, opacity: 0.85 }));
      const w = 90 + rc() * 70;
      sp.scale.set(w, w * 0.42, 1); sp.renderOrder = -800;
      this.clouds.push({ sp, az: rc() * TAU, el: 0.1 + rc() * 0.38, speed: 0.0009 + rc() * 0.0014 });
      this.group.add(sp);
    }

    // núi xa (3 lớp)
    this.mountainMat = new THREE.MeshBasicMaterial({ color: 0x5a9486, vertexColors: true, fog: true });
    const defs = [{ R: 150, base: 16, k: 1.0, seed: 1 }, { R: 172, base: 24, k: 1.35, seed: 2 }, { R: 192, base: 34, k: 1.8, seed: 3 }];
    for (const d of defs) {
      const seg = 160;
      const p: number[] = [], cs: number[] = [], idx: number[] = [];
      const lay = 1 - (d.R - 150) / 60;
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * TAU;
        const h = d.base * (0.55 + 0.45 * (Math.sin(a * 3 + d.seed) * 0.5 + 0.5)) + d.k * (7 * Math.sin(a * 7 + d.seed * 2.1) + 4 * Math.sin(a * 13 + d.seed * 0.7) + 2 * Math.sin(a * 29 + d.seed));
        const hh = Math.max(5, h);
        p.push(Math.cos(a) * d.R, -6, Math.sin(a) * d.R, Math.cos(a) * d.R, hh, Math.sin(a) * d.R);
        const shade = 0.78 + 0.22 * lay;
        cs.push(shade * 0.85, shade * 0.9, shade, shade, shade, shade);
        if (i < seg) { const b = i * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cs, 3)); g.setIndex(idx);
      const m = new THREE.Mesh(g, d.R === 150 ? this.mountainMat : this.mountainMat);
      m.frustumCulled = false; m.material.side = THREE.DoubleSide;
      this.mountains.push(m); this.group.add(m);
    }

    // ánh sáng
    this.hemi = new THREE.HemisphereLight(0xd8e8fc, 0x807052, 1);
    this.key = new THREE.DirectionalLight(0xfff6e4, 2.4);
    this.key.castShadow = true;
    const sc = this.key.shadow.camera;
    sc.left = -36; sc.right = 36; sc.top = 36; sc.bottom = -36; sc.near = 1; sc.far = 220;
    this.key.shadow.bias = -0.0005; this.key.shadow.normalBias = 0.05;
    this.key.shadow.mapSize.set(this.shadowSize, this.shadowSize);
    scene.add(this.key, this.key.target, this.hemi);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // môi trường PMREM (bầu trời đơn giản) cho vàng/đồng
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.buildEnv();

    this.tod = vnHour();
    this.apply(true);
    scene.add(this.group);
    scene.background = null;
  }

  private moonTexture(): THREE.Texture {
    const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(S * 0.42, S * 0.4, 8, S / 2, S / 2, S / 2);
    g.addColorStop(0, '#fffdf2'); g.addColorStop(0.8, '#e6e9f2'); g.addColorStop(1, '#c9d2e8');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2 - 2, 0, 7); ctx.fill();
    const r = rng(5);
    for (let i = 0; i < 16; i++) { ctx.fillStyle = `rgba(150,160,185,${0.12 + r() * 0.15})`; ctx.beginPath(); ctx.arc(S * (0.2 + r() * 0.6), S * (0.2 + r() * 0.6), 6 + r() * 20, 0, 7); ctx.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; this.tex.push(t);
    return t;
  }

  private buildEnv(): void {
    const es = new THREE.Scene();
    const m = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `varying vec3 vD; void main(){ float h = vD.y; vec3 top = vec3(0.45,0.62,0.95); vec3 hor = vec3(1.0,0.93,0.82); vec3 bot = vec3(0.30,0.24,0.17);
        vec3 c = h>0.0 ? mix(hor, top, pow(h,0.6)) : mix(hor*0.7, bot, pow(-h,0.5));
        float sd = max(dot(vD, normalize(vec3(0.35,0.8,0.5))),0.0); c += vec3(1.0,0.9,0.7) * pow(sd, 24.0) * 3.0;
        gl_FragColor = vec4(c,1.0);} `,
    });
    es.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), m));
    this.envTex = this.pmrem.fromScene(es, 0.02).texture;
    m.dispose(); (es.children[0] as THREE.Mesh).geometry.dispose();
    this.scene.environment = this.envTex;
  }

  setMode(mode: 'auto' | 'day' | 'night'): void { this.mode = mode; }
  getNight(): number { return this.night; }
  getTod(): number { return this.tod; }

  setShadows(on: boolean, size: number): void {
    this.shadowOn = on;
    this.key.castShadow = on;
    if (size !== this.shadowSize) {
      this.shadowSize = size;
      this.key.shadow.mapSize.set(size, size);
      this.key.shadow.map?.dispose(); this.key.shadow.map = null;
    }
  }

  private targetHour(): number { return this.mode === 'auto' ? vnHour() : this.mode === 'day' ? DAY_HOUR : NIGHT_HOUR; }

  /** Cập nhật mỗi khung hình. */
  update(dt: number, camera: THREE.Camera): void {
    const target = this.targetHour();
    let diff = target - this.tod;
    diff = ((diff % 24) + 36) % 24 - 12;           // đường ngắn nhất, -12..12
    if (this.mode === 'auto') {
      if (Math.abs(diff) < 0.02) this.tod = target; else this.tod += Math.sign(diff) * Math.min(Math.abs(diff), 9 * dt);
    } else if (Math.abs(diff) > 0.005) {
      // chuyển ngày↔đêm luôn đi tiến (qua hoàng hôn / bình minh)
      const fwd = ((target - this.tod) % 24 + 24) % 24;
      this.tod += Math.min(fwd, 8 * dt);
    }
    this.tod = ((this.tod % 24) + 24) % 24;
    this.apply(false);

    if (!this.farFixed && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const pc = camera as THREE.PerspectiveCamera;
      if (pc.far < 320) { pc.far = 320; pc.updateProjectionMatrix(); }
      this.farFixed = true;
    }
    this.group.position.copy(camera.position);
    for (const c of this.clouds) {
      c.az += c.speed * dt;
      const ce = Math.cos(c.el);
      c.sp.position.set(Math.cos(c.az) * ce * 180, Math.sin(c.el) * 180 + 6, Math.sin(c.az) * ce * 180);
    }
    this.followShadow(camera);
  }

  private followShadow(camera: THREE.Camera): void {
    // khung bóng đổ bám theo vùng người chơi/camera nhìn tới (snap theo texel để không nhấp nháy)
    camera.getWorldDirection(this.tmp);
    const fx = camera.position.x + this.tmp.x * 12, fz = camera.position.z + this.tmp.z * 12;
    const texel = 72 / this.shadowSize;
    const snap = Math.max(texel * 8, 0.5);
    const x = Math.round(fx / snap) * snap, z = Math.round(fz / snap) * snap;
    if (x !== this.sx || z !== this.sz || true) {
      this.sx = x; this.sz = z;
      this.key.target.position.set(x, 0, z);
      this.key.target.updateMatrixWorld();
    }
    const d = this.key.userData.dir as THREE.Vector3 | undefined;
    if (d) this.key.position.set(x + d.x * 100, d.y * 100, z + d.z * 100);
  }

  private apply(first: boolean): void {
    const a = ((this.tod - 6) / 12) * Math.PI;                 // 0 lúc 6h, π lúc 18h
    const s = Math.sin(a);
    this.sunAlt = s;
    this.sunDir.set(Math.cos(a) * 0.95, Math.sin(a) * 0.95 + 0.04, 0.5).normalize();
    const am = (((this.tod - 18 + 24) % 24) / 12) * Math.PI;   // trăng: 0 lúc 18h
    this.moonDir.set(Math.cos(am) * 0.8, Math.sin(am) * 0.9 + 0.1, -0.55).normalize();
    this.night = 1 - smoothstep(-0.12, 0.2, s);
    sampleKeys(s, this.sample);
    const S = this.sample;

    const u = this.skyMat.uniforms;
    (u.uTop.value as THREE.Color).copy(S.zen);
    (u.uHor.value as THREE.Color).copy(S.hor);
    (u.uBot.value as THREE.Color).copy(S.fog).multiplyScalar(0.9);
    (u.uSunDir.value as THREE.Vector3).copy(this.sunDir);
    (u.uSunCol.value as THREE.Color).copy(S.sun);
    u.uSunAmt.value = smoothstep(-0.25, 0.0, s);
    (u.uMoonDir.value as THREE.Vector3).copy(this.moonDir);
    u.uMoonAmt.value = this.night;

    // fog & nền
    const fog = this.scene.fog as THREE.FogExp2;
    this.fogColor.copy(S.fog);
    fog.color.copy(this.fogColor);
    fog.density = lerp(0.0062, 0.0085, this.night);

    // mặt trời / trăng
    this.sunDisc.position.copy(this.sunDir).multiplyScalar(185);
    this.sunHalo.position.copy(this.sunDir).multiplyScalar(184);
    this.moonDisc.position.copy(this.moonDir).multiplyScalar(185);
    this.moonHalo.position.copy(this.moonDir).multiplyScalar(184);
    this.sunDisc.lookAt(0, 0, 0); this.moonDisc.lookAt(0, 0, 0);
    const sunVis = smoothstep(-0.12, 0.02, s);
    this.sunDisc.visible = this.sunHalo.visible = sunVis > 0.01;
    (this.sunDisc.material as THREE.MeshBasicMaterial).color.copy(S.sun).lerp(this.tmpC.set(0xffffff), 0.6);
    (this.sunHalo.material as THREE.SpriteMaterial).color.copy(S.sun); (this.sunHalo.material as THREE.SpriteMaterial).opacity = 0.55 * sunVis;
    const moonVis = this.night * smoothstep(-0.05, 0.15, this.moonDir.y);
    this.moonDisc.visible = this.moonHalo.visible = moonVis > 0.01;
    (this.moonDisc.material as THREE.MeshBasicMaterial).opacity = moonVis;
    (this.moonHalo.material as THREE.SpriteMaterial).opacity = 0.5 * moonVis;
    (this.stars.material as THREE.PointsMaterial).opacity = smoothstep(0.45, 1, this.night);

    // mây
    const cloudTint = this.tmpC.copy(S.hor).lerp(new THREE.Color(1, 1, 1), 0.55 * (1 - this.night)).multiplyScalar(lerp(1.05, 0.22, this.night));
    for (const c of this.clouds) { const m = c.sp.material; m.color.copy(cloudTint); m.opacity = lerp(0.88, 0.5, this.night); }
    this.mountainMat.color.copy(S.mount);

    // ánh sáng
    this.hemi.color.copy(S.hemiSky); this.hemi.groundColor.copy(S.hemiGround);
    this.hemi.intensity = S.hemiInt * lerp(1.0, 0.95, this.night);
    const sunI = 3.1 * smoothstep(0.0, 0.32, s);
    const moonI = 0.85 * smoothstep(0.0, -0.22, s) * smoothstep(-0.02, 0.12, this.moonDir.y);
    const useSun = s >= 0 || this.moonDir.y < 0;
    const dir = useSun ? this.sunDir : this.moonDir;
    this.key.userData.dir = dir.clone();
    this.key.color.copy(useSun ? S.sun : this.tmpC.set(0x9db4ff));
    this.key.intensity = useSun ? sunI : moonI;
    if (this.shadowOn) this.key.castShadow = (useSun ? sunI : moonI) > 0.04;
    this.scene.environmentIntensity = lerp(1.0, 0.18, this.night) * (0.55 + 0.45 * smoothstep(-0.05, 0.3, s));
    this.renderer.toneMappingExposure = lerp(0.95, 1.12, this.night);
    if (first) this.key.position.copy(dir).multiplyScalar(100);
  }

  /** Độ cao mặt trời (cho shader nước). */
  getSunDir(): THREE.Vector3 { return this.sunDir; }
  getMoonDir(): THREE.Vector3 { return this.moonDir; }
  getSample(): Sample { return this.sample; }
  getFog(): THREE.Color { return this.fogColor; }

  dispose(): void {
    this.scene.remove(this.group, this.key, this.key.target, this.hemi);
    this.key.shadow.map?.dispose();
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | undefined;
      if (mat) mat.dispose();
    });
    for (const t of this.tex) t.dispose();
    this.envTex?.dispose();
    this.pmrem.dispose();
    if (this.scene.environment === this.envTex) this.scene.environment = null;
    this.scene.fog = null;
  }
}
