/**
 * Chánh điện: nền đá + thềm bậc, 8 cột đỏ, cửa bức bàn, tường tầng trên với hoành phi "TỪ BI HỶ XẢ" + cửa sổ song hoa,
 * mái 2 tầng cong, nội thất (bệ 3 bậc, toà sen, Phật Thích Ca, hào quang, hộ pháp, bình hoa, đèn lồng), hạc đồng.
 */
import * as THREE from 'three';
import { Batch, floorGeo, xf, TAU } from './core';
import type { Mats } from './materials';
import { buildRoof } from './roof';
import { attendant, buddha, crane, guardianLion, lotusThrone } from './statues';
import { coupletTexture, plaqueTexture } from './textures';

export interface HallPart {
  group: THREE.Group;
  /** đèn điểm bên trong (cường độ chỉnh theo đêm) */
  innerLight: THREE.PointLight;
  aureole: THREE.Mesh;
  update(t: number, night: number): void;
  dispose(): void;
}

export const HALL = { zc: -27.2, platY: 0.6, colZ: -19.9, frontZ: -22.0, colXs: [-11.6, -8.3, -5, -1.7, 1.7, 5, 8.3, 11.6] };

export function buildHall(m: Mats, glowTex: THREE.Texture): HallPart {
  const group = new THREE.Group();
  group.name = 'hall';
  const b = new Batch(true);
  const PY = HALL.platY;
  const own: THREE.Texture[] = [];

  // ── nền / thềm ──
  b.add(new THREE.BoxGeometry(26, PY, 15.65), m.stone, xf(0, PY / 2, -28.175), 0xa8a39a);          // z -36 .. -20.35 (giữa)
  b.add(new THREE.BoxGeometry(9.4, PY, 1.35), m.stone, xf(-8.3, PY / 2, -19.675), 0xa8a39a);       // phần bên (đến z=-19)
  b.add(new THREE.BoxGeometry(9.4, PY, 1.35), m.stone, xf(8.3, PY / 2, -19.675), 0xa8a39a);
  b.add(new THREE.BoxGeometry(26.3, 0.12, 17.3), m.stoneDark, xf(0, 0.06, -27.5), 0x7a766e);
  // mặt lát
  b.add(floorGeo(9.4, 3.0), m.paving, xf(-8.3, PY + 0.003, -20.5), 0xd8d2c6);
  b.add(floorGeo(9.4, 3.0), m.paving, xf(8.3, PY + 0.003, -20.5), 0xd8d2c6);
  b.add(floorGeo(7.2, 1.7), m.paving, xf(0, PY + 0.003, -21.15), 0xd8d2c6);
  // bậc giữa (xuống z=-19)
  for (let i = 0; i < 3; i++) {
    const h = 0.2 * (i + 1), z0 = -19 - i * 0.55, d = 0.55;
    b.add(new THREE.BoxGeometry(6.8, h, d), m.stone, xf(0, h / 2, z0 - d / 2), 0xb4afa4);
    b.add(floorGeo(6.8, d), m.paving, xf(0, h + 0.003, z0 - d / 2), 0xd8d2c6);
  }
  // lan can bậc: hai tay vịn xiên
  const slope = Math.atan2(0.62, 1.65);
  for (const sx of [-1, 1]) {
    b.add(new THREE.BoxGeometry(0.5, 0.5, Math.hypot(1.65, 0.62) + 0.2), m.stone, xf(sx * 3.75, 0.46, -19.85, 0, 1, 1, 1, slope), 0xb9b4a8);
    b.add(new THREE.SphereGeometry(0.32, 10, 8), m.stone, xf(sx * 3.75, 0.95, -20.65), 0xc2bdb0);
    b.add(new THREE.CylinderGeometry(0.22, 0.28, 0.4, 8), m.stone, xf(sx * 3.75, 0.3, -18.9), 0xc2bdb0);
  }
  // viền đá dưới chân nền (bên hông)
  // ── sàn nội thất ──
  b.add(floorGeo(25.6, 13.8), m.wood, xf(0, PY + 0.004, -28.9), 0x9a4a38);
  // ── tường ──
  const wallC = 0x93291f;
  b.box(m.plaster, 0.45, 5.4, 14.1, -12.78, PY, -29, 0, 0xe8dcc0);              // hông trái (đến mái thấp)
  b.box(m.plaster, 0.45, 5.4, 14.1, 12.78, PY, -29, 0, 0xe8dcc0);
  b.box(m.lacquer, 25.6, 5.4, 0.45, 0, PY, -35.78, 0, wallC);                   // hậu tầng dưới
  b.box(m.lacquer, 21.2, 2.5, 0.4, 0, 7.2, -32.4, 0, wallC);                    // hậu tầng cổ diêm (khớp mái trên)
  // tường mặt tiền: hai đầu hồi + cửa bức bàn hai bên + mặt tường trên cửa
  const FZ = HALL.frontZ;
  b.box(m.plaster, 1.45, 4.4, 0.4, -12.3, PY, FZ, 0, 0xe8dcc0);
  b.box(m.plaster, 1.45, 4.4, 0.4, 12.3, PY, FZ, 0, 0xe8dcc0);
  const doorLeaf = new THREE.BoxGeometry(1.64, 4.3, 0.1);
  for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) {
    const x = sx * (5.0 + 0.825 + i * 1.65);
    b.add(doorLeaf, m.door, xf(x, PY + 2.15, FZ + 0.06), 0xffffff);
    b.box(m.lacquer, 0.12, 4.4, 0.18, x - 0.83, PY, FZ + 0.03, 0, 0xffffff);
  }
  for (const sx of [-1, 1]) b.box(m.lacquer, 0.2, 4.4, 0.26, sx * 5.0, PY, FZ + 0.05, 0, 0xffffff);
  // ngạch trên cửa (toàn chiều ngang) từ y=5.0
  b.box(m.lacquer, 24.6, 0.5, 0.42, 0, PY + 4.4, FZ, 0, 0xb02f25);
  b.box(m.lacquer, 24.6, 2.3, 0.4, 0, PY + 4.9, FZ - 0.02, 0, 0x8c241c);
  b.box(m.gold, 24.6, 0.07, 0.46, 0, PY + 4.42, FZ + 0.02, 0, 0xffffff);
  // ── cột + chân tảng ──
  for (const x of HALL.colXs) {
    b.cyl(m.stone, 0.52, 0.58, 0.38, 14, x, PY, HALL.colZ, 0xb4afa4);
    b.cyl(m.gold, 0.46, 0.46, 0.06, 14, x, PY + 0.38, HALL.colZ);
    b.add(new THREE.CylinderGeometry(0.36, 0.4, 4.85, 16), m.lacquer, xf(x, PY + 0.44 + 2.425, HALL.colZ), 0xffffff);
    b.cyl(m.gold, 0.4, 0.4, 0.07, 14, x, PY + 5.0, HALL.colZ);
    b.cyl(m.lacquer, 0.5, 0.36, 0.22, 12, x, PY + 5.1, HALL.colZ, 0xb02f25);
    // đấu củng
    b.box(m.lacquer, 0.95, 0.22, 0.7, x, PY + 5.3, HALL.colZ, 0, 0xa02a20);
    b.box(m.gold, 0.5, 0.1, 0.4, x, PY + 5.52, HALL.colZ);
  }
  // cột trong + xà ngang
  for (const x of [-5.3, 5.3, -10, 10]) for (const z of [-25.5, -30.5]) {
    b.add(new THREE.CylinderGeometry(0.34, 0.38, 5.0, 14), m.lacquer, xf(x, PY + 2.5, z), 0xffffff);
    b.cyl(m.stone, 0.5, 0.55, 0.32, 12, x, PY, z, 0xb4afa4);
  }
  b.box(m.lacquer, 24.8, 0.5, 0.55, 0, PY + 5.1, HALL.colZ, 0, 0xa02a20);
  b.box(m.gold, 24.8, 0.08, 0.6, 0, PY + 5.02, HALL.colZ + 0.01);
  // trần nội thất
  b.box(m.darkWood, 25.2, 0.3, 13.8, 0, PY + 5.1, -28.9, 0, 0x5a2a1c);
  for (let i = 0; i < 6; i++) b.box(m.lacquer, 25.2, 0.28, 0.35, 0, PY + 4.82, -22.8 - i * 2.4, 0, 0x9a2a20);

  // ── tầng trên (mặt tiền + cửa sổ + hoành phi) ──
  const upY = 7.2, upH = 2.45;
  b.box(m.lacquer, 21.2, upH, 10.4, 0, upY, -27.2, 0, 0x9c2c22);
  b.box(m.gold, 21.4, 0.1, 0.12, 0, upY + 0.05, -22.0 + 0.05);
  b.box(m.gold, 21.4, 0.1, 0.12, 0, upY + upH - 0.15, -22.0 + 0.05);
  // cửa sổ song hoa hai bên hoành phi
  for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) {
    const x = sx * (4.6 + i * 1.5);
    b.box(m.lacquer, 1.18, 1.6, 0.14, x, upY + 0.4, -21.98, 0, 0xc0382c);
    b.box(m.windowGlow, 0.92, 1.34, 0.12, x, upY + 0.53, -21.92);
    for (let k = -2; k <= 2; k++) b.box(m.gold, 0.05, 1.34, 0.14, x + k * 0.2, upY + 0.53, -21.88);
    for (let k = 0; k < 4; k++) b.box(m.gold, 0.92, 0.05, 0.14, x, upY + 0.75 + k * 0.3, -21.87);
  }
  // hoành phi
  const plaque = plaqueTexture('TỪ BI HỶ XẢ', { w: 1024, h: 256 });
  own.push(plaque);
  const plaqueMat = new THREE.MeshStandardMaterial({ map: plaque, roughness: 0.45, metalness: 0.15, emissive: 0xffc070, emissiveMap: plaque, emissiveIntensity: 0.12 });
  const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 1.4), plaqueMat);
  plaqueMesh.position.set(0, upY + 1.25, -21.92); plaqueMesh.castShadow = false; plaqueMesh.receiveShadow = true;
  group.add(plaqueMesh);
  b.box(m.gold, 5.9, 1.7, 0.1, 0, upY + 0.4, -21.97, 0, 0xffffff);
  // biển nhỏ trên ngạch cửa chính
  const plaque2 = plaqueTexture('ĐẠI HÙNG BẢO ĐIỆN', { w: 1024, h: 200, font: 96 });
  own.push(plaque2);
  const p2 = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.9), new THREE.MeshStandardMaterial({ map: plaque2, roughness: 0.5, metalness: 0.1 }));
  p2.position.set(0, PY + 5.55, -21.77);
  group.add(p2);
  b.box(m.gold, 4.8, 1.05, 0.06, 0, PY + 5.02, -21.82);

  // câu đối trên cột
  const cA = coupletTexture(['TỪ', 'BI', 'RỘNG', 'MỞ', 'ĐỜI']), cB = coupletTexture(['TRÍ', 'TUỆ', 'SOI', 'LÒNG', 'NGƯỜI']);
  const cC = coupletTexture(['TÂM', 'AN', 'THÂN', 'TỊNH', 'LẠC']), cD = coupletTexture(['NIỆM', 'PHẬT', 'GIỮ', 'LỜI', 'HIỀN']);
  own.push(cA, cB, cC, cD);
  const boards: [number, THREE.Texture][] = [[-1.7, cA], [1.7, cB], [-5, cC], [5, cD]];
  for (const [x, tx] of boards) {
    const mt = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.5, metalness: 0.2, emissive: 0xffb860, emissiveMap: tx, emissiveIntensity: 0.1 });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2.67), mt);
    mesh.position.set(x, PY + 2.8, HALL.colZ + 0.42);
    group.add(mesh);
    b.box(m.darkWood, 0.58, 2.8, 0.07, x, PY + 1.4, HALL.colZ + 0.38, 0, 0x2a1008);
  }

  // đèn lồng đỏ treo giữa các cột
  const lanternPos: [number, number][] = [[-9.95, 0], [-6.65, 0], [-3.35, 0], [0, 0], [3.35, 0], [6.65, 0], [9.95, 0]];
  for (const [x] of lanternPos) {
    const z = HALL.colZ + 0.2, y = PY + 3.7;
    b.cyl(m.gold, 0.012, 0.012, 1.1, 4, x, y + 0.55, z);
    b.add(new THREE.SphereGeometry(1, 14, 10), m.lanternRed, xf(x, y, z, 0, 0.44, 0.52, 0.44), 0xffffff);
    b.cyl(m.gold, 0.2, 0.2, 0.08, 10, x, y + 0.5, z); b.cyl(m.gold, 0.16, 0.16, 0.08, 10, x, y - 0.58, z);
    b.cyl(m.paint, 0.02, 0.02, 0.4, 4, x, y - 0.98, z, 0xffcc55);
    b.sphere(m.paint, 0.07, x, y - 1.0, z, 1, 1.4, 1, 0xffcc55);
  }

  // ── nội thất ──
  const zc = -33.2;
  b.add(new THREE.BoxGeometry(10, 0.3, 4.8), m.stone, xf(0, PY + 0.15, zc), 0xc5b79a);
  b.add(new THREE.BoxGeometry(7.6, 0.3, 4.0), m.stone, xf(0, PY + 0.45, zc), 0xd3c4a2);
  b.add(new THREE.BoxGeometry(5.4, 0.25, 3.2), m.stone, xf(0, PY + 0.725, zc), 0xe2d2ae);
  for (const [w, d, y] of [[10.04, 4.84, PY + 0.28], [7.64, 4.04, PY + 0.58], [5.44, 3.24, PY + 0.84]] as const)
    b.add(new THREE.BoxGeometry(w, 0.05, d), m.gold, xf(0, y, zc), 0xffffff);
  lotusThrone(b, m, 0, PY + 0.85, -33.4, 1.5, 0.75, 16);
  buddha(b, m, 0, PY + 0.85 + 0.7, -33.4, 0.97);
  attendant(b, m, -3.2, PY + 0.6, -33.1, 1.25, 0.3);
  attendant(b, m, 3.2, PY + 0.6, -33.1, 1.25, -0.3);
  // vòng hào quang vàng (gờ lửa)
  const ay = PY + 4.0;
  b.add(new THREE.TorusGeometry(1.95, 0.07, 8, 48), m.gold, xf(0, ay, -35.0), 0xffd36a);
  b.add(new THREE.TorusGeometry(1.5, 0.04, 6, 40), m.gold, xf(0, ay, -35.02), 0xffd36a);
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * TAU;
    b.add(new THREE.ConeGeometry(0.1, 0.55, 5), m.gold, xf(Math.cos(a) * 2.2, ay + Math.sin(a) * 2.2, -35.0, 0, 1, 1, 1, 0, a - Math.PI / 2), 0xffd36a);
  }
  const aureole = new THREE.Mesh(new THREE.CircleGeometry(2.7, 48), new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffc860, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }));
  aureole.position.set(0, ay, -34.7);
  aureole.renderOrder = 5;
  group.add(aureole);
  // bình hoa sen vàng + trái cây hai bên bệ
  for (const sx of [-1, 1]) {
    b.add(new THREE.CylinderGeometry(0.28, 0.2, 0.7, 12), m.gold, xf(sx * 4.4, PY + 0.3 + 0.35, -32.2), 0xe5b44a);
    b.cyl(m.gold, 0.1, 0.18, 0.12, 10, sx * 4.4, PY + 1.0, -32.2);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU, rr = 0.2 + (i % 2) * 0.1;
      const fx = sx * 4.4 + Math.cos(a) * rr, fz = -32.2 + Math.sin(a) * rr, fy = PY + 1.6 + (i % 3) * 0.2;
      b.add(new THREE.CylinderGeometry(0.01, 0.015, fy - PY - 1.0, 4), m.foliage, xf((fx + sx * 4.4) / 2, (fy + PY + 1.0) / 2, (fz - 32.2) / 2), 0x4a7a3a);
      b.add(new THREE.SphereGeometry(1, 8, 6), m.paint, xf(fx, fy, fz, a, 0.2, 0.2, 0.2), i % 2 ? 0xf6a8bd : 0xffd6e0);
    }
    // mâm trái cây
    b.cyl(m.gold, 0.5, 0.3, 0.2, 14, sx * 2.5, PY + 0.95, -31.4);
    const fruit = [0xd8452a, 0xf0a830, 0x7aaa3a, 0xe8602a, 0xf6c440];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU, rr = i === 6 ? 0 : 0.28;
      b.sphere(m.paint, 0.15, sx * 2.5 + Math.cos(a) * rr, PY + 1.25 + (i === 6 ? 0.12 : 0), -31.4 + Math.sin(a) * rr, 1, 1, 1, fruit[i % 5]);
    }
  }
  // thảm đỏ + bồ đoàn trước bệ
  b.add(floorGeo(3.2, 8.6), m.paint, xf(0, PY + 0.012, -26.6), 0xa02620);
  b.add(floorGeo(2.8, 8.2), m.paint, xf(0, PY + 0.016, -26.6), 0xc23a2c);
  for (const x of [-1.2, 1.2]) b.cyl(m.paint, 0.42, 0.46, 0.14, 14, x, PY + 0.02, -24.5, 0xe0a82e);

  // ── lọng vàng hai bên toà sen + phướn lụa vàng cột hiên ──
  for (const sx of [-1, 1]) {
    const lx = sx * 4.9, lz = -33.2;
    b.cyl(m.lacquer, 0.045, 0.055, 4.4, 8, lx, PY + 0.3, lz, 0xa82820);
    for (let tier = 0; tier < 2; tier++) {
      const ty = PY + 3.6 + tier * 0.55, tr = 0.85 - tier * 0.22;
      b.add(new THREE.ConeGeometry(tr, 0.35, 14, 1, true), m.paintDouble, xf(lx, ty, lz), 0xe6ad36);
      b.cyl(m.paintDouble, tr, tr, 0.22, 14, lx, ty - 0.32, lz, 0xc83226);
      b.add(new THREE.TorusGeometry(tr, 0.025, 5, 16), m.gold, xf(lx, ty - 0.16, lz, 0, 1, 1, 1, Math.PI / 2), 0xffd870);
    }
    b.sphere(m.gold, 0.11, lx, PY + 4.5, lz, 1, 1.4, 1);
    // phướn lụa vàng rủ bên cột hiên ngoài & cột giữa (như ảnh b1)
    for (const bx of [sx * 11.1, sx * 2.55]) {
      const bh = bx > 6 || bx < -6 ? 2.8 : 2.3;
      b.box(m.gold, 0.54, 0.06, 0.06, bx, PY + 4.75, HALL.colZ + 0.42);
      b.box(m.paintDouble, 0.44, bh, 0.02, bx, PY + 4.75 - bh, HALL.colZ + 0.42, 0, 0xe8b43c);
      b.box(m.paintDouble, 0.34, bh - 0.2, 0.024, bx, PY + 4.65 - bh + 0.2, HALL.colZ + 0.425, 0, 0xd89c28);
      b.add(new THREE.ConeGeometry(0.22, 0.28, 4), m.paintDouble, xf(bx, PY + 4.75 - bh - 0.14, HALL.colZ + 0.42, Math.PI / 4, 1, 1, 0.1, Math.PI), 0xc43226);
    }
  }

  // ── mái 2 tầng ──
  buildRoof(b, m, 0, 5.5, HALL.zc, { W: 15.8, D: 10.4, rise: 4.8, bmax: 0.5, curve: 1.5, curl: 1.15, curlSize: 3.0, rafters: true, ridge: false });
  buildRoof(b, m, 0, 9.6, HALL.zc, { W: 12.6, D: 8.0, rise: 4.6, bmax: 1, curve: 1.45, curl: 1.3, curlSize: 3.0, ridge: true, finial: true, rafters: true });

  // ── hạc đồng trên bệ đá, sư tử đá ──
  for (const sx of [-1, 1]) {
    b.box(m.stone, 1.9, 0.52, 1.9, sx * 7.0, PY, -19.65, 0, 0xb2ada0);
    b.box(m.stoneDark, 2.08, 0.1, 2.08, sx * 7.0, PY + 0.5, -19.65, 0, 0x8a857a);
  }
  crane(b, m, -7.0, PY + 0.58, -19.65, 0.78, 0.28);
  crane(b, m, 7.0, PY + 0.58, -19.65, 0.78, -0.28);
  guardianLion(b, m, -4.5, 0, -17.6, 0.85, 0.15, 1);
  guardianLion(b, m, 4.5, 0, -17.6, 0.85, -0.15, -1);

  b.build(group, 'hall');

  // đèn nội thất
  const innerLight = new THREE.PointLight(0xffb060, 20, 24, 1.6);
  innerLight.position.set(0, PY + 3.6, -29);
  group.add(innerLight);

  return {
    group, innerLight, aureole,
    update(t: number, night: number): void {
      (aureole.material as THREE.MeshBasicMaterial).opacity = (0.42 + 0.3 * night) * (0.93 + 0.07 * Math.sin(t * 1.3));
      aureole.scale.setScalar(1 + 0.025 * Math.sin(t * 0.9));
      innerLight.intensity = (18 + 26 * night) * (0.97 + 0.03 * Math.sin(t * 7.1) * Math.sin(t * 2.3));
    },
    dispose(): void { for (const t of own) t.dispose(); },
  };
}
