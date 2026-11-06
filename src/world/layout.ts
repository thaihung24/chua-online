/**
 * Bố cục khuôn viên chùa — NGUỒN SỰ THẬT DUY NHẤT cho toạ độ.
 * Hệ trục (mét): +x = đông (phải màn hình khi nhìn về chánh điện), +z = về phía cổng (nam), +y = lên.
 * Chánh điện ở z âm (phía bắc), quay mặt về +z. Người chơi vào từ cổng (z dương) và nhìn về -z.
 * Mọi mô-đun (dựng cảnh, nhân vật, hiệu ứng, UI "Đi dạo") PHẢI import từ đây, không tự ghi cứng toạ độ.
 */
import type { SpotId } from '@/core/contracts';

export interface Vec2 { x: number; z: number }
export interface Spot { id: SpotId; name: string; pos: Vec2; /** hướng nhìn (rad, quanh trục Y; 0 = nhìn về -z) */ face: number }

export const BOUNDS = { x0: -42, x1: 42, z0: -55, z1: 40 } as const;
export const SPAWN: Vec2 = { x: 0, z: 30 };
export const SPAWN_FACE = 0;

/** Khu chuồng gà quê sau lưng Chánh điện (hướng bắc, mở cổng về +z). */
export const CHICKEN_COOP = { cx: 0, cz: -48.0, w: 10.2, d: 7.4, gateZ: -44.3 } as const;

/** Các điểm đi dạo chính trong khuôn viên chùa (khớp menu "Đi dạo"). */
export const SPOTS: Record<SpotId, Spot> = {
  yard:     { id: 'yard',     name: 'Sân trước & hồ sen', pos: { x: 0,   z: 16 },    face: 0 },
  bodhi:    { id: 'bodhi',    name: 'Cây bồ đề',          pos: { x: -22, z: -4 },    face: -Math.PI / 2 },
  meditate: { id: 'meditate', name: 'Sân thiền',          pos: { x: 22,  z: 4 },     face: Math.PI / 2 },
  quanam:   { id: 'quanam',   name: 'Quan Âm',            pos: { x: 28,  z: -14 },   face: -Math.PI / 4 },
  well:     { id: 'well',     name: 'Giếng ngọc',         pos: { x: -26, z: -22 },   face: Math.PI / 4 },
  hall:     { id: 'hall',     name: 'Chánh điện',         pos: { x: 0,   z: -15.5 }, face: 0 },
  coop:     { id: 'coop',     name: 'Chuồng gà sau chùa', pos: { x: 0,   z: -42.4 }, face: 0 },
};
export const SPOT_ORDER: SpotId[] = ['yard', 'bodhi', 'meditate', 'quanam', 'well', 'hall', 'coop'];

/** Các điểm tương tác (người chơi đứng gần thì hiện nút ngữ cảnh "F"). */
export type InteractableId =
  | 'altar' | 'burner' | 'bell' | 'candles' | 'lotusPond' | 'releasePond' | 'bodhiTree'
  | 'broomRack' | 'cushion' | 'quanamStatue' | 'well' | 'que' | 'chickenCoop';
export interface Interactable { id: InteractableId; label: string; pos: Vec2; radius: number; face: number }
export const INTERACTABLES: Interactable[] = [
  { id: 'altar',        label: 'Bàn thờ Phật',       pos: { x: 0,   z: -17 },   radius: 3.2, face: 0 },
  { id: 'burner',       label: 'Lư hương',           pos: { x: 0,   z: -11 },   radius: 2.6, face: 0 },
  { id: 'candles',      label: 'Đèn nến',            pos: { x: 3.5, z: -17 },   radius: 2.2, face: 0 },
  { id: 'bell',         label: 'Chuông chùa',        pos: { x: 15,  z: -8 },    radius: 3.0, face: Math.PI / 2 },
  { id: 'lotusPond',    label: 'Ao sen',             pos: { x: -13, z: 14 },    radius: 3.2, face: -Math.PI / 2 },
  { id: 'releasePond',  label: 'Bến phóng sinh',     pos: { x: 13,  z: 14 },    radius: 3.2, face: Math.PI / 2 },
  { id: 'bodhiTree',    label: 'Cây bồ đề',          pos: { x: -20, z: -4 },    radius: 3.6, face: -Math.PI / 2 },
  { id: 'broomRack',    label: 'Giá chổi',           pos: { x: 7,   z: 22 },    radius: 2.2, face: 0 },
  { id: 'cushion',      label: 'Bồ đoàn',            pos: { x: 22,  z: 4 },     radius: 6.0, face: Math.PI / 2 },
  { id: 'quanamStatue', label: 'Tượng Quan Âm',      pos: { x: 28,  z: -14 },   radius: 3.4, face: -Math.PI / 4 },
  { id: 'well',         label: 'Giếng ngọc',         pos: { x: -26, z: -22 },   radius: 3.2, face: Math.PI / 4 },
  { id: 'que',          label: 'Ống xăm',            pos: { x: -4,  z: -14.5 }, radius: 2.2, face: 0 },
  { id: 'chickenCoop',  label: 'Chuồng gà sau chùa', pos: { x: 0,   z: -43.4 }, radius: 3.4, face: 0 },
];

/** Ao sen (ellipse) — đèn hoa đăng thả ở đây. Hồ phóng sinh — cá/chim thả ở đây. Suối chảy từ Giếng ngọc về ao sen. */
export const LOTUS_POND = { cx: -20, cz: 14, rx: 9, rz: 6.5 } as const;
export const RELEASE_POND = { cx: 20, cz: 14, rx: 8, rz: 6 } as const;
export const WELL = { x: -30, z: -26 } as const;

/** Bồ đoàn xếp vòng tròn ở sân thiền. */
export const CUSHION_CENTER: Vec2 = { x: 28, z: 4 };
export const CUSHION_RADIUS = 4.5;
export const CUSHION_COUNT = 8;
export function cushionSlot(i: number): { pos: Vec2; face: number } {
  const a = (i / CUSHION_COUNT) * Math.PI * 2;
  const pos = { x: CUSHION_CENTER.x + Math.cos(a) * CUSHION_RADIUS, z: CUSHION_CENTER.z + Math.sin(a) * CUSHION_RADIUS };
  const face = Math.atan2(-(CUSHION_CENTER.x - pos.x), -(CUSHION_CENTER.z - pos.z));
  return { pos, face };
}

/** Vật cản hình chữ nhật (người chơi không đi xuyên): toà chánh điện, ao, tường... */
export interface Block { x0: number; x1: number; z0: number; z1: number; name: string }
export const BLOCKS: Block[] = [
  { name: 'hall-back',   x0: -13, x1: 13,  z0: -36,  z1: -19 },   // thân chánh điện (cửa mở từ z=-19 ra mặt tiền)
  { name: 'bell-tower',  x0: 13.5, x1: 17, z0: -10.5, z1: -5.5 },
  { name: 'statue-base', x0: 26,  x1: 31,  z0: -19,  z1: -14.5 },
  { name: 'well-base',   x0: -32, x1: -27.5, z0: -28, z1: -23.5 },
  { name: 'bodhi-trunk', x0: -23, x1: -20.5, z0: -6.5, z1: -3.5 },
  { name: 'lotus-pond',   x0: -29,  x1: -11.2, z0: 8.4,   z1: 19.6 },
  { name: 'release-pond', x0: 12.4, x1: 28,    z0: 9,     z1: 19 },
  { name: 'chicken-coop', x0: -5.2, x1: 5.2,   z0: -51.9, z1: -44.3 },
];
export const WALK_RADIUS = 0.45;
