// Keyboard + mouse (pointer lock) and touch (virtual stick + look pad) input.
import { isTouch } from '../core/settings.js';

export class Input {
  constructor(dom, ui) {
    this.dom = dom; this.ui = ui;
    this.keys = new Set();
    this.look = { x: 0, y: 0 };
    this.move = { x: 0, y: 0 };
    this.pressed = new Set(); // edge-triggered actions
    this.mouse = { left: false, right: false };
    this.wheel = 0;
    this.locked = false;
    this.enabled = true;
    this.touch = isTouch;
    this.stick = null; this.lookTouch = null;

    addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      if (e.code === 'Tab') e.preventDefault();
      if (!this.keys.has(e.code)) this.pressed.add(e.code);
      this.keys.add(e.code);
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.left = this.mouse.right = false; });
    this.lastTouch = 0;
    const surface = dom.parentElement || dom;
    surface.addEventListener('mousedown', (e) => {
      if (performance.now() - this.lastTouch < 800) return; // synthetic mouse event after a touch
      if (e.target.closest && e.target.closest('button, select, input, #menu')) return;
      if (!this.locked) { this.requestLock(); return; }
      if (e.button === 0) { this.mouse.left = true; this.pressed.add('Mouse0'); }
      if (e.button === 2) { this.mouse.right = true; this.pressed.add('Mouse2'); }
    });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.mouse.left = false; if (e.button === 2) this.mouse.right = false; });
    surface.addEventListener('contextmenu', (e) => e.preventDefault());
    addEventListener('mousemove', (e) => { if (this.locked) { this.look.x += e.movementX; this.look.y += e.movementY; } });
    surface.addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); }, { passive: true });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === dom;
      if (!this.locked) { this.keys.clear(); this.onUnlock?.(); }
    });

    if (this.touch) this.setupTouch();
    else {
      // hybrid devices (touch laptops, desktop-mode mobile browsers): enable on first touch
      const first = () => { removeEventListener('touchstart', first, true); if (!this.touch) { this.touch = true; this.exitLock(); this.setupTouch(); this.onTouchMode?.(); } };
      addEventListener('touchstart', first, true);
    }
    addEventListener('touchstart', () => (this.lastTouch = performance.now()), { capture: true, passive: true });
  }

  requestLock() {
    if (this.touch) return;
    try { const p = this.dom.requestPointerLock({ unadjustedMovement: true }); if (p && p.catch) p.catch(() => this.dom.requestPointerLock()); } catch (e) { this.dom.requestPointerLock(); }
  }
  exitLock() { if (document.pointerLockElement) document.exitPointerLock(); }

  setupTouch() {
    const layer = document.getElementById('touch-layer');
    layer.hidden = false;
    const stickEl = document.getElementById('stick'), knob = document.getElementById('stick-knob');
    const R = 55;
    layer.addEventListener('touchstart', (e) => {
      for (const t of e.changedTouches) {
        if (t.target.closest('.tbtn')) continue;
        if (t.clientX < innerWidth * 0.42 && !this.stick) {
          this.stick = { id: t.identifier, x: t.clientX, y: t.clientY };
          stickEl.style.left = t.clientX + 'px'; stickEl.style.top = t.clientY + 'px'; stickEl.classList.add('on');
          knob.style.transform = 'translate(-50%,-50%)';
        } else if (!this.lookTouch) this.lookTouch = { id: t.identifier, x: t.clientX, y: t.clientY, t0: performance.now(), moved: 0 };
      }
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    layer.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (this.stick && t.identifier === this.stick.id) {
          let dx = t.clientX - this.stick.x, dy = t.clientY - this.stick.y;
          const l = Math.hypot(dx, dy); if (l > R) { dx *= R / l; dy *= R / l; }
          this.move.x = dx / R; this.move.y = -dy / R;
          knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        } else if (this.lookTouch && t.identifier === this.lookTouch.id) {
          const dx = t.clientX - this.lookTouch.x, dy = t.clientY - this.lookTouch.y;
          this.look.x += dx * 2.2; this.look.y += dy * 2.2;
          this.lookTouch.moved += Math.abs(dx) + Math.abs(dy);
          this.lookTouch.x = t.clientX; this.lookTouch.y = t.clientY;
        }
      }
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    const end = (e) => {
      for (const t of e.changedTouches) {
        if (this.stick && t.identifier === this.stick.id) { this.stick = null; this.move.x = this.move.y = 0; stickEl.classList.remove('on'); }
        if (this.lookTouch && t.identifier === this.lookTouch.id) {
          // a quick tap on the look side interacts
          if (this.lookTouch.moved < 10 && performance.now() - this.lookTouch.t0 < 250) this.pressed.add('Tap');
          this.lookTouch = null;
        }
      }
    };
    layer.addEventListener('touchend', end); layer.addEventListener('touchcancel', end);
    const btn = (id, code, hold) => {
      const el = document.getElementById(id);
      el.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); this.pressed.add(code); if (hold) this.keys.add(code); el.classList.add('down'); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys.delete(code); el.classList.remove('down'); });
    };
    btn('tb-use', 'KeyE'); btn('tb-jump', 'Space'); btn('tb-crouch', 'KeyC'); btn('tb-light', 'KeyF');
    btn('tb-run', 'ShiftLeft', true); btn('tb-drop', 'KeyQ'); btn('tb-throw', 'Mouse0'); btn('tb-inspect', 'KeyR', true);
    btn('tb-menu', 'Escape'); btn('tb-view', 'KeyV'); btn('tb-music', 'KeyM');
  }

  down(code) { return this.keys.has(code); }
  hit(code) { return this.pressed.has(code); }

  axis() {
    let x = this.move.x, y = this.move.y;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
    return { x, y, mag: Math.min(1, l) };
  }

  endFrame() { this.pressed.clear(); this.look.x = this.look.y = 0; this.wheel = 0; }
}
