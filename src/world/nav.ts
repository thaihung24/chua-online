/**
 * Tìm đường & va chạm trên khuôn viên: lưới 0.5 m (cache) + A* 8 hướng + làm mượt đường bằng "kéo dây" (line-of-sight).
 * Vật cản lấy từ BLOCKS/BOUNDS trong layout.ts, nở thêm WALK_RADIUS để đường đi không chạm tường.
 */
import { BLOCKS, BOUNDS, WALK_RADIUS, type Vec2 } from './layout';

const CELL = 0.5;
const GW = Math.ceil((BOUNDS.x1 - BOUNDS.x0) / CELL);
const GH = Math.ceil((BOUNDS.z1 - BOUNDS.z0) / CELL);
const N = GW * GH;
const INFLATE = WALK_RADIUS + 0.12;

const blocked = new Uint8Array(N);
let built = false;

function cellOf(x: number, z: number): number {
  const cx = Math.floor((x - BOUNDS.x0) / CELL);
  const cz = Math.floor((z - BOUNDS.z0) / CELL);
  if (cx < 0 || cz < 0 || cx >= GW || cz >= GH) return -1;
  return cz * GW + cx;
}

function build(): void {
  if (built) return;
  built = true;
  for (let cz = 0; cz < GH; cz++) {
    const z = BOUNDS.z0 + (cz + 0.5) * CELL;
    for (let cx = 0; cx < GW; cx++) {
      const x = BOUNDS.x0 + (cx + 0.5) * CELL;
      let b = x < BOUNDS.x0 + WALK_RADIUS || x > BOUNDS.x1 - WALK_RADIUS || z < BOUNDS.z0 + WALK_RADIUS || z > BOUNDS.z1 - WALK_RADIUS;
      if (!b) {
        for (const k of BLOCKS) {
          if (x > k.x0 - INFLATE && x < k.x1 + INFLATE && z > k.z0 - INFLATE && z < k.z1 + INFLATE) { b = true; break; }
        }
      }
      blocked[cz * GW + cx] = b ? 1 : 0;
    }
  }
}

/** Điểm (x,z) có đi được không (theo lưới đã nở). */
export function isFree(x: number, z: number): boolean {
  build();
  const c = cellOf(x, z);
  return c >= 0 && blocked[c] === 0;
}

/** Ô đi được gần nhất (tìm theo vòng tăng dần). Trả lại chính điểm nếu đã đi được. */
export function nearestFree(x: number, z: number, maxR = 12): Vec2 {
  build();
  if (isFree(x, z)) return { x, z };
  const cx0 = Math.floor((x - BOUNDS.x0) / CELL);
  const cz0 = Math.floor((z - BOUNDS.z0) / CELL);
  let best: Vec2 | null = null;
  let bd = Infinity;
  const R = Math.ceil(maxR / CELL);
  for (let r = 1; r <= R; r++) {
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const cx = cx0 + dx, cz = cz0 + dz;
        if (cx < 0 || cz < 0 || cx >= GW || cz >= GH || blocked[cz * GW + cx]) continue;
        const px = BOUNDS.x0 + (cx + 0.5) * CELL, pz = BOUNDS.z0 + (cz + 0.5) * CELL;
        const d = (px - x) ** 2 + (pz - z) ** 2;
        if (d < bd) { bd = d; best = { x: px, z: pz }; }
      }
    }
    if (best && r * CELL > Math.sqrt(bd) + CELL) break;
  }
  return best ?? { x: Math.max(BOUNDS.x0 + 1, Math.min(BOUNDS.x1 - 1, x)), z: Math.max(BOUNDS.z0 + 1, Math.min(BOUNDS.z1 - 1, z)) };
}

/** Đoạn thẳng a→b không cắt ô bị chặn. */
export function lineClear(ax: number, az: number, bx: number, bz: number): boolean {
  build();
  const dx = bx - ax, dz = bz - az;
  const len = Math.hypot(dx, dz);
  const steps = Math.max(1, Math.ceil(len / 0.2));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const c = cellOf(ax + dx * t, az + dz * t);
    if (c < 0 || blocked[c]) return false;
  }
  return true;
}

// ── A* ──
const g = new Float32Array(N);
const parent = new Int32Array(N);
const seen = new Uint32Array(N);
const closed = new Uint32Array(N);
let stamp = 0;
const heap = new Int32Array(N * 6 + 8);
const fKey = new Float32Array(N);
let heapN = 0;

function hpush(i: number): void {
  let k = heapN++;
  heap[k] = i;
  while (k > 0) {
    const p = (k - 1) >> 1;
    if (fKey[heap[p]] <= fKey[heap[k]]) break;
    const t = heap[p]; heap[p] = heap[k]; heap[k] = t;
    k = p;
  }
}
function hpop(): number {
  const top = heap[0];
  heap[0] = heap[--heapN];
  let k = 0;
  for (;;) {
    const l = k * 2 + 1, r = l + 1;
    let m = k;
    if (l < heapN && fKey[heap[l]] < fKey[heap[m]]) m = l;
    if (r < heapN && fKey[heap[r]] < fKey[heap[m]]) m = r;
    if (m === k) break;
    const t = heap[m]; heap[m] = heap[k]; heap[k] = t;
    k = m;
  }
  return top;
}

const DX = [1, -1, 0, 0, 1, 1, -1, -1];
const DZ = [0, 0, 1, -1, 1, -1, 1, -1];
const DC = [1, 1, 1, 1, 1.4142, 1.4142, 1.4142, 1.4142];

/**
 * Đường đi từ (fx,fz) tới (tx,tz) (đích tự dời tới ô đi được gần nhất). Kết quả là các điểm trung gian đã làm mượt,
 * điểm cuối là đích; không gồm điểm xuất phát. Trả null nếu không có đường.
 */
export function findPath(fx: number, fz: number, tx: number, tz: number): Vec2[] | null {
  build();
  const goal = nearestFree(tx, tz);
  const start = nearestFree(fx, fz, 4);
  const sc = cellOf(start.x, start.z);
  const gc = cellOf(goal.x, goal.z);
  if (sc < 0 || gc < 0) return null;
  if (lineClear(fx, fz, goal.x, goal.z)) return [{ x: goal.x, z: goal.z }];
  stamp++;
  heapN = 0;
  const gx = gc % GW, gz = (gc / GW) | 0;
  g[sc] = 0; parent[sc] = -1; seen[sc] = stamp;
  fKey[sc] = 0;
  hpush(sc);
  let found = false;
  while (heapN > 0) {
    const cur = hpop();
    if (closed[cur] === stamp) continue;
    closed[cur] = stamp;
    if (cur === gc) { found = true; break; }
    const cx = cur % GW, cz = (cur / GW) | 0;
    for (let d = 0; d < 8; d++) {
      const nx = cx + DX[d], nz = cz + DZ[d];
      if (nx < 0 || nz < 0 || nx >= GW || nz >= GH) continue;
      const ni = nz * GW + nx;
      if (blocked[ni] || closed[ni] === stamp) continue;
      if (d >= 4 && (blocked[cz * GW + nx] || blocked[nz * GW + cx])) continue; // không cắt góc
      const ng = g[cur] + DC[d];
      if (seen[ni] !== stamp || ng < g[ni]) {
        seen[ni] = stamp;
        g[ni] = ng;
        parent[ni] = cur;
        const hx = Math.abs(nx - gx), hz = Math.abs(nz - gz);
        fKey[ni] = ng + (hx + hz) + (1.4142 - 2) * Math.min(hx, hz);
        hpush(ni);
      }
    }
  }
  if (!found) return null;
  const pts: Vec2[] = [];
  for (let c = gc; c !== -1; c = parent[c]) {
    pts.push({ x: BOUNDS.x0 + ((c % GW) + 0.5) * CELL, z: BOUNDS.z0 + (((c / GW) | 0) + 0.5) * CELL });
  }
  pts.reverse();
  pts[0] = { x: fx, z: fz };
  // làm mượt: nối thẳng tới điểm xa nhất nhìn thấy được
  const out: Vec2[] = [];
  let i = 0;
  while (i < pts.length - 1) {
    let j = pts.length - 1;
    while (j > i + 1 && !lineClear(pts[i].x, pts[i].z, pts[j].x, pts[j].z)) j--;
    out.push(pts[j]);
    i = j;
  }
  out[out.length - 1] = { x: goal.x, z: goal.z };
  return out;
}

/** Đẩy điểm ra khỏi các vật cản hình chữ nhật (trượt dọc tường) và giữ trong BOUNDS. */
export function resolveCollision(p: { x: number; z: number }, r = WALK_RADIUS): void {
  for (let pass = 0; pass < 2; pass++) {
    for (const b of BLOCKS) {
      const x0 = b.x0 - r, x1 = b.x1 + r, z0 = b.z0 - r, z1 = b.z1 + r;
      if (p.x > x0 && p.x < x1 && p.z > z0 && p.z < z1) {
        const dl = p.x - x0, dr = x1 - p.x, dt = p.z - z0, db = z1 - p.z;
        const m = Math.min(dl, dr, dt, db);
        if (m === dl) p.x = x0;
        else if (m === dr) p.x = x1;
        else if (m === dt) p.z = z0;
        else p.z = z1;
      }
    }
  }
  p.x = Math.max(BOUNDS.x0 + r, Math.min(BOUNDS.x1 - r, p.x));
  p.z = Math.max(BOUNDS.z0 + r, Math.min(BOUNDS.z1 - r, p.z));
}

/** Điểm nằm trong vật cản (không nở). */
export function insideBlock(x: number, z: number, margin = 0): boolean {
  for (const b of BLOCKS) if (x > b.x0 - margin && x < b.x1 + margin && z > b.z0 - margin && z < b.z1 + margin) return true;
  return false;
}
