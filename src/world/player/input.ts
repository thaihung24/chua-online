/**
 * Nhập liệu: phím W/A/S/D + mũi tên (đi), Q/E (xoay camera), chuột trái/phải kéo (xoay), cuộn (zoom), click (đi tới),
 * cảm ứng: joystick ảo nổi ở nửa trái, vuốt nửa phải để xoay, véo hai ngón để zoom, chạm nhanh để đi tới.
 */
export interface InputHooks {
  /** Chạm/click nhanh tại toạ độ màn hình (clientX/Y). */
  tap(clientX: number, clientY: number): void;
  /** Kéo xoay camera (px). */
  look(dx: number, dy: number): void;
  /** Zoom: >0 ra xa, <0 lại gần. */
  zoom(delta: number): void;
  /** Người dùng bắt đầu điều khiển đi (phím/joystick). */
  userMove(): void;
}

export interface InputApi {
  /** Hướng đi theo camera: x phải +, y tiến +, độ lớn ≤ 1. Gọi `poll()` mỗi khung. */
  poll(): { x: number; y: number };
  /** Xoay camera bằng phím Q/E: -1..1. */
  rotKey(): number;
  setEnabled(on: boolean): void;
  dispose(): void;
}

interface Ptr { id: number; type: string; sx: number; sy: number; x: number; y: number; t0: number; role: 'joy' | 'look'; moved: boolean; button: number }

const STICK_R = 56;

function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export function createInput(el: HTMLElement, overlay: HTMLElement, hooks: InputHooks): InputApi {
  let enabled = true;
  const ptrs = new Map<number, Ptr>();
  const keys = new Set<string>();
  const joy = { x: 0, y: 0, active: false, id: -1, ox: 0, oy: 0 };
  let pinchLast = 0;
  let notified = false;

  const stick = document.createElement('div');
  stick.className = 'w2-stick';
  stick.setAttribute('aria-hidden', 'true');
  const knob = document.createElement('div');
  knob.className = 'w2-knob';
  stick.appendChild(knob);
  overlay.appendChild(stick);

  const rectOf = (): DOMRect => el.getBoundingClientRect();

  function showStick(on: boolean): void { stick.classList.toggle('on', on); }
  function placeStick(ox: number, oy: number, kx: number, ky: number): void {
    stick.style.transform = `translate3d(${ox}px,${oy}px,0)`;
    knob.style.transform = `translate3d(${kx}px,${ky}px,0)`;
  }
  function resetJoy(): void {
    joy.x = joy.y = 0; joy.active = false; joy.id = -1;
    showStick(false);
  }
  function resetAll(): void {
    ptrs.clear(); keys.clear(); resetJoy(); pinchLast = 0;
  }
  function notifyMove(): void {
    if (!notified) { notified = true; hooks.userMove(); }
  }

  function onDown(e: PointerEvent): void {
    if (!enabled) return;
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) return;
    const r = rectOf();
    const touch = e.pointerType !== 'mouse';
    const left = e.clientX < r.left + r.width * 0.5;
    const role: Ptr['role'] = touch && left && joy.id === -1 ? 'joy' : 'look';
    const p: Ptr = { id: e.pointerId, type: e.pointerType, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now(), role, moved: false, button: e.button };
    ptrs.set(e.pointerId, p);
    if (role === 'joy') { joy.id = e.pointerId; joy.ox = e.clientX - r.left; joy.oy = e.clientY - r.top; }
    try { el.setPointerCapture(e.pointerId); } catch { /* bỏ qua */ }
    if (role === 'look' && countLook() === 2) pinchLast = pinchDist();
  }

  function countLook(): number { let n = 0; for (const p of ptrs.values()) if (p.role === 'look' && p.type !== 'mouse') n++; return n; }
  function pinchDist(): number {
    const a: Ptr[] = [];
    for (const p of ptrs.values()) if (p.role === 'look' && p.type !== 'mouse') a.push(p);
    return a.length < 2 ? 0 : Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
  }

  function onMove(e: PointerEvent): void {
    const p = ptrs.get(e.pointerId);
    if (!p || !enabled) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (!p.moved && Math.hypot(p.x - p.sx, p.y - p.sy) > (p.type === 'mouse' ? 5 : 9)) p.moved = true;
    if (p.role === 'joy') {
      if (!p.moved) return;
      const r = rectOf();
      let vx = p.x - r.left - joy.ox, vy = p.y - r.top - joy.oy;
      const d = Math.hypot(vx, vy);
      if (d > STICK_R) { // joystick nổi: kéo gốc theo ngón tay
        const k = (d - STICK_R) / d;
        joy.ox += vx * k; joy.oy += vy * k;
        vx = vx / d * STICK_R; vy = vy / d * STICK_R;
      }
      const mag = Math.min(1, Math.hypot(vx, vy) / STICK_R);
      const dz = 0.14;
      const m2 = mag < dz ? 0 : (mag - dz) / (1 - dz);
      const len = Math.hypot(vx, vy) || 1;
      joy.x = vx / len * m2; joy.y = -vy / len * m2;
      joy.active = true;
      showStick(true);
      placeStick(joy.ox, joy.oy, vx, vy);
      if (m2 > 0.2) notifyMove();
    } else if (p.moved || p.type !== 'mouse') {
      if (countLook() >= 2 && p.type !== 'mouse') {
        const d = pinchDist();
        if (pinchLast > 0 && d > 0) hooks.zoom((pinchLast - d) * 0.025);
        pinchLast = d;
      } else if (p.moved) hooks.look(dx, dy);
    }
  }

  function onUp(e: PointerEvent): void {
    const p = ptrs.get(e.pointerId);
    if (!p) return;
    ptrs.delete(e.pointerId);
    try { el.releasePointerCapture(e.pointerId); } catch { /* bỏ qua */ }
    if (p.role === 'joy') { resetJoy(); notified = false; }
    if (countLook() < 2) pinchLast = 0;
    if (!enabled || e.type === 'pointercancel') return;
    const dt = performance.now() - p.t0;
    if (!p.moved && dt < 500 && (p.type !== 'mouse' || p.button === 0)) hooks.tap(p.x, p.y);
  }

  function onWheel(e: WheelEvent): void {
    if (!enabled) return;
    e.preventDefault();
    hooks.zoom(Math.max(-1.5, Math.min(1.5, e.deltaY * 0.012)));
  }

  const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyE']);
  function onKeyDown(e: KeyboardEvent): void {
    if (!enabled || isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!MOVE_KEYS.has(e.code)) return;
    e.preventDefault();
    if (!keys.has(e.code) && e.code !== 'KeyQ' && e.code !== 'KeyE') notifyMove();
    keys.add(e.code);
  }
  function onKeyUp(e: KeyboardEvent): void {
    keys.delete(e.code);
    if (![...keys].some((k) => k !== 'KeyQ' && k !== 'KeyE')) notified = joy.active ? notified : false;
  }
  const onCtx = (e: Event): void => e.preventDefault();
  const onBlur = (): void => resetAll();

  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
  el.addEventListener('wheel', onWheel, { passive: false });
  el.addEventListener('contextmenu', onCtx);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  const out = { x: 0, y: 0 };
  return {
    poll() {
      let x = joy.x, y = joy.y;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
      if (keys.has('KeyW') || keys.has('ArrowUp')) y += 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) y -= 1;
      const m = Math.hypot(x, y);
      if (m > 1) { x /= m; y /= m; }
      out.x = x; out.y = y;
      return out;
    },
    rotKey() { return (keys.has('KeyE') ? 1 : 0) - (keys.has('KeyQ') ? 1 : 0); },
    setEnabled(on) { enabled = on; if (!on) resetAll(); },
    dispose() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('contextmenu', onCtx);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      stick.remove();
    },
  };
}
