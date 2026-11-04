/**
 * Nhãn tên + bong bóng lời (DOM overlay, tự viết gọn). `LabelLayer` chiếu vị trí đầu nhân vật
 * lên màn hình mỗi khung hình; ẩn khi ở xa > 40 m, khi nằm sau camera hoặc ngoài màn hình.
 */
import * as THREE from 'three';

export interface LabelParts {
  root: HTMLElement;
  pill: HTMLElement;
  me: HTMLElement;
  name: HTMLElement;
  level: HTMLElement;
  bubble: HTMLElement;
}

export const SAY_MAX = 100;

export function createLabelEl(): LabelParts {
  const root = document.createElement('div');
  root.className = 'w2-tag';
  root.setAttribute('aria-hidden', 'true');
  const bubble = document.createElement('div');
  bubble.className = 'w2-say';
  const pill = document.createElement('div');
  pill.className = 'w2-pill';
  const me = document.createElement('span');
  me.className = 'w2-me';
  me.textContent = 'Tôi';
  const name = document.createElement('span');
  name.className = 'w2-name';
  const level = document.createElement('span');
  level.className = 'w2-lv';
  pill.append(me, name, level);
  // "z Z z" bay lên khi nhân vật đứng ngủ gật (chỉ hiện với lớp .w2-doze)
  const zzz = document.createElement('span');
  zzz.className = 'w2-zzz';
  zzz.innerHTML = '<i>z</i><i>Z</i><i>z</i>';
  pill.append(zzz);
  root.append(bubble, pill);
  return { root, pill, me, name, level, bubble };
}

/** Anchor mà nhãn bám theo (vị trí thế giới của đỉnh đầu). */
export interface LabelTarget {
  labelEl: HTMLElement;
  headAnchor(out: THREE.Vector3): THREE.Vector3;
}

export class LabelLayer {
  readonly el: HTMLElement;
  private items = new Set<LabelTarget>();
  private v = new THREE.Vector3();
  private hideDist = 40;
  private cache = new WeakMap<HTMLElement, { x: number; y: number; vis: boolean; z: number; o: number; sc: number }>();

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'w2-layer';
    parent.appendChild(this.el);
  }

  add(t: LabelTarget): void {
    if (this.items.has(t)) return;
    this.items.add(t);
    t.labelEl.style.display = 'none';
    this.el.appendChild(t.labelEl);
  }

  remove(t: LabelTarget): void {
    if (!this.items.delete(t)) return;
    t.labelEl.remove();
  }

  setHideDistance(d: number): void { this.hideDist = d; }

  update(camera: THREE.Camera, w: number, h: number): void {
    const cp = camera.position;
    for (const t of this.items) {
      const el = t.labelEl;
      t.headAnchor(this.v);
      const dist = this.v.distanceTo(cp);
      let st = this.cache.get(el);
      if (!st) { st = { x: -1e5, y: -1e5, vis: false, z: -1, o: -1, sc: -1 }; this.cache.set(el, st); }
      let vis = dist < this.hideDist;
      let x = 0, y = 0;
      if (vis) {
        this.v.project(camera);
        if (this.v.z > 1 || this.v.z < -1) vis = false;
        else {
          x = (this.v.x * 0.5 + 0.5) * w;
          y = (-this.v.y * 0.5 + 0.5) * h;
          if (x < -80 || x > w + 80 || y < -40 || y > h + 160) vis = false;
        }
      }
      if (!vis) {
        if (st.vis) { el.style.display = 'none'; st.vis = false; }
        continue;
      }
      if (!st.vis) { el.style.display = ''; st.vis = true; }
      const isMine = el.classList.contains('w2-mine');
      const sc = isMine ? 1 : Math.round(Math.max(0.74, Math.min(1, 1.12 - dist * 0.01)) * 50) / 50;
      if (Math.abs(x - st.x) > 0.4 || Math.abs(y - st.y) > 0.4 || sc !== st.sc) {
        el.style.transform = sc === 1
          ? `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-100%)`
          : `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-100%) scale(${sc})`;
        st.x = x; st.y = y; st.sc = sc;
      }
      const z = Math.round(1000 - dist * 10);
      if (z !== st.z) { el.style.zIndex = String(z); st.z = z; }
      const o = dist > 30 ? Math.max(0, (this.hideDist - dist) / (this.hideDist - 30)) : 1;
      const oq = Math.round(o * 20) / 20;
      if (oq !== st.o) { el.style.opacity = String(oq); st.o = oq; }
    }
  }

  dispose(): void {
    this.items.clear();
    this.el.remove();
  }
}
