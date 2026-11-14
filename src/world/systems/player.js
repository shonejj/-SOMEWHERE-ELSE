// First-person character: walking, running, crouching, jumping, ladders, sitting.
import * as THREE from 'three';
import { WATER_LEVEL, WORLD_RADIUS } from '../core/layout.js';
import { pathDistance, lakeE } from '../env/terrain.js';

const STAND = 1.72, CROUCH = 1.12, RADIUS = 0.27, STEP = 0.42;
const tmpV = new THREE.Vector3();

export class Player {
  constructor(camera, input, terrain, colliders, audio, settings) {
    this.camera = camera; this.input = input; this.terrain = terrain; this.col = colliders; this.audio = audio; this.settings = settings;
    this.pos = new THREE.Vector3(-1, 0, 9);
    this.vel = new THREE.Vector3();
    this.yaw = 0; this.pitch = 0;
    this.height = STAND; this.crouching = false;
    this.onGround = true; this.mode = 'walk';
    this.travel = 0; this.lastStep = 0;
    this.eyeY = this.pos.y + STAND - 0.1;
    this.bob = new THREE.Vector2();
    this.seat = null; this.surface = 'grass';
    this.fovTarget = settings.fov; this.zoom = 1;
    camera.rotation.order = 'YXZ';

    this.flashlight = new THREE.SpotLight(0xfff1dc, 0, 32, 0.45, 0.55, 1.6);
    this.flashlight.position.set(0.18, -0.2, 0);
    this.flashlight.target.position.set(0, -0.3, -5);
    this.flashlight.castShadow = false;
    camera.add(this.flashlight, this.flashlight.target);
    this.flashOn = false;
    this.swimming = false; this.swimPhase = 0; this.stepLen = 1.25; this.speedH = 0;
    this.onSplash = null; this.onStroke = null;
    this.view = 'first'; this.eyePos = new THREE.Vector3(); this.occluders = [];
    this.camDist = 3.2; this.dive = 0; this.diving = false;
    this.tpRay = new THREE.Raycaster();
  }

  toggleView() { this.view = this.view === 'first' ? 'third' : 'first'; this.camDist = 1.0; }

  /** Over-the-shoulder camera that never goes through walls or the ground. */
  placeThirdPerson(dt) {
    const cam = this.camera, eye = this.eyePos;
    // orbit pitch is clamped so the camera never dives into the floor or the bed
    const lying = this.mode === 'seat' && this.seat?.lie;
    const p = lying ? 0.9 : Math.max(-0.9, Math.min(0.55, this.pitch));
    const yaw = lying ? this.seat.yaw + Math.PI : this.yaw;
    const fwd = tmpV.set(-Math.sin(yaw) * Math.cos(p), Math.sin(p), -Math.cos(yaw) * Math.cos(p));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const want = lying ? 2.2 : 3.0;
    const dir = fwd.clone().negate().multiplyScalar(want).addScaledVector(right, lying ? 0 : 0.45).add(new THREE.Vector3(0, lying ? 1.2 : 0.3, 0));
    const len = dir.length(); dir.normalize();
    this.tpRay.set(eye, dir); this.tpRay.far = len;
    const hit = this.tpRay.intersectObjects(this.occluders, true)[0];
    const d = hit ? Math.max(0.35, hit.distance - 0.25) : len;
    this.camDist += (d - this.camDist) * Math.min(1, dt * (d < this.camDist ? 18 : 3));
    cam.position.copy(eye).addScaledVector(dir, this.camDist);
    const g = this.terrain.heightAt(cam.position.x, cam.position.z) + 0.25;
    if (cam.position.y < g) cam.position.y = g;
    if (lying) cam.lookAt(eye.x, eye.y - 0.3, eye.z);
  }

  /** Moves the player; yHint is the floor height to search below (defaults to terrain). */
  teleport(x, yHint, z, yaw) {
    const base = yHint ?? this.terrain.heightAt(x, z);
    this.pos.set(x, 0, z);
    const sup = this.findSupport(x, z, base + 0.8);
    this.pos.y = sup.y;
    this.swimming = !sup.box && WATER_LEVEL - sup.y > 1.38 && lakeE(x, z) < 1.3;
    if (this.swimming) this.pos.y = WATER_LEVEL - 1.42;
    this.vel.set(0, 0, 0);
    if (yaw !== undefined) this.yaw = yaw;
    this.pitch = 0; this.eyeY = this.pos.y + this.height - 0.1; this.mode = 'walk'; this.seat = null;
    this.camera.position.set(x, this.eyeY, z);
  }

  surfaceAt() {
    if (this.supportBox) return this.supportBox.tag || 'wood';
    if (this.pos.y < WATER_LEVEL - 0.05) return 'water';
    return pathDistance(this.pos.x, this.pos.z) < 1.4 ? 'dirt' : 'grass';
  }

  findSupport(x, z, maxY) {
    let best = null, by = -Infinity;
    for (const b of this.col.boxes) {
      if (!b.enabled || !b.walk || b.max.y > maxY || b.max.y <= by) continue;
      if (x + RADIUS * 0.5 < b.min.x || x - RADIUS * 0.5 > b.max.x || z + RADIUS * 0.5 < b.min.z || z - RADIUS * 0.5 > b.max.z) continue;
      by = b.max.y; best = b;
    }
    const t = this.terrain.heightAt(x, z);
    if (best && by > t - 0.05) return { y: by, box: best };
    return { y: t, box: null };
  }

  sit(seat) {
    this.mode = 'seat'; this.seat = seat; this.vel.set(0, 0, 0);
    this.seatBlend = 0; this.seatFrom = this.camera.position.clone();
    this.yaw = seat.yaw; this.pitch = seat.lie ? 1.1 : -0.08;
    this.audio?.creak(seat.eye, 0.06, 0.4, 140);
  }
  stand() {
    if (!this.seat) return;
    const s = this.seat; this.seat = null; this.mode = 'walk';
    this.pos.copy(s.exit); this.pos.y = this.findSupport(s.exit.x, s.exit.z, s.exit.y + 1.5).y;
    this.eyeY = this.camera.position.y; this.pitch = 0;
    s.onExit?.();
  }
  scope(dir) { this.mode = 'scope'; this.scopeYaw = dir; this.yaw = dir; this.pitch = 0.05; this.scopeZoom = 8; this.onScope?.(true); }

  toggleFlashlight() { this.flashOn = !this.flashOn; this.flashlight.intensity = this.flashOn ? 22 : 0; this.audio?.click(null, 0.25); }

  update(dt) {
    if (this.input.hit('KeyV')) this.toggleView();
    this.updateInner(dt);
    this.eyePos.copy(this.camera.position);
    if (this.view === 'third' && this.mode !== 'scope') this.placeThirdPerson(dt);
  }

  updateInner(dt) {
    const inp = this.input, cam = this.camera, s = this.settings;
    const sens = 0.0022 * s.sensitivity * (this.mode === 'scope' ? 1 / Math.max(1, this.zoom) : 1);
    if (!this.lookLocked) {
      this.yaw -= inp.look.x * sens;
      this.pitch -= inp.look.y * sens * (s.invertY ? -1 : 1);
    }
    this.pitch = Math.max(-1.52, Math.min(1.52, this.pitch));
    const ax = inp.axis();

    if (this.mode === 'seat') return this.updateSeat(dt, ax);
    if (this.mode === 'scope') {
      if (ax.mag > 0.3 || inp.hit('Space') || inp.hit('KeyE') || inp.hit('Tap')) { this.mode = 'walk'; this.onScope?.(false); inp.pressed.delete('KeyE'); inp.pressed.delete('Tap'); }
      this.scopeZoom = Math.max(2, Math.min(40, this.scopeZoom * Math.pow(1.15, -inp.wheel)));
      this.zoom += (this.scopeZoom - this.zoom) * Math.min(1, dt * 4);
    } else this.zoom += (1 - this.zoom) * Math.min(1, dt * 6);

    // crouch
    if (!this.swimming && (inp.hit('KeyC') || inp.hit('ControlLeft'))) this.crouchToggle = !this.crouchToggle;
    const wantCrouch = this.crouchToggle || inp.down('ControlLeft');
    const ceil = this.col.ceilingHeight(this.pos.x, this.pos.z, RADIUS, this.pos.y);
    if (!wantCrouch && this.pos.y + STAND > ceil) this.crouching = true; else this.crouching = wantCrouch;
    const targetH = this.crouching ? CROUCH : STAND;
    this.height += (targetH - this.height) * Math.min(1, dt * 10);

    const running = (inp.down('ShiftLeft') || inp.down('ShiftRight')) && !this.crouching;
    const wading = this.pos.y < WATER_LEVEL - 0.15;
    let speed = this.crouching ? 1.35 : running ? 4.6 : 2.45;
    if (wading) speed *= 0.55 + Math.max(0, (this.pos.y - (WATER_LEVEL - 1.2))) * 0.3;
    if (this.swimming) { speed = running ? 2.2 : 1.45; this.crouchToggle = false; }
    const sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
    const wx = (-sy * ax.y + cy * ax.x) * speed, wz = (-cy * ax.y - sy * ax.x) * speed;
    const accel = this.swimming ? 2.6 : this.onGround ? 11 : 2.2;
    const k = 1 - Math.exp(-accel * dt);
    this.vel.x += (wx - this.vel.x) * k; this.vel.z += (wz - this.vel.z) * k;

    const ladder = this.col.ladderAt(this.pos);
    if (ladder && (ax.y !== 0 || !this.onGround)) {
      // climbing: forward = up
      const f = tmpV.set(-sy, 0, -cy);
      const facing = f.dot(ladder.dir) > 0.2;
      this.vel.y = (facing ? ax.y : -ax.y) * 1.9;
      this.vel.x *= 0.35; this.vel.z *= 0.35;
      if (this.pos.y > ladder.max.y - 0.3 && ax.y > 0) { this.vel.x += ladder.dir.x * 1.2; this.vel.z += ladder.dir.z * 1.2; this.vel.y = Math.max(this.vel.y, 1); }
      this.climbing = true;
      this.travel += Math.abs(this.vel.y) * dt * 1.6;
    } else if (this.swimming) {
      this.climbing = false;
      // buoyancy: float with the head above the surface, gentle bobbing
      if (inp.hit('KeyC') || inp.hit('ControlLeft')) this.diving = !this.diving;
      if (inp.hit('Space')) this.diving = false;
      const floor = this.findSupport(this.pos.x, this.pos.z, this.pos.y + 0.5).y;
      const maxDive = Math.max(0, WATER_LEVEL - 1.42 - (floor + 0.25));
      this.dive += ((this.diving ? maxDive : 0) - this.dive) * Math.min(1, dt * (this.diving ? 0.7 : 1.2));
      const target = WATER_LEVEL - 1.42 - this.dive + Math.sin(this.swimPhase * 2) * (this.dive > 0.3 ? 0.01 : 0.03);
      this.vel.y += ((target - this.pos.y) * 9 - this.vel.y * 4) * dt;
      if (this.pos.y < target - 0.4) this.vel.y = Math.max(this.vel.y, 2.5); // surface quickly after a plunge
    } else {
      this.climbing = false;
      this.vel.y -= 9.81 * dt;
      if (inp.hit('Space') && this.onGround && !this.crouching) { this.vel.y = 4.1; this.onGround = false; }
    }

    // integrate (sub-stepped for stability)
    const steps = Math.ceil(dt / 0.012);
    const h = dt / steps;
    const wasGround = this.onGround;
    let fall = 0;
    for (let i = 0; i < steps; i++) {
      const ox = this.pos.x, oz = this.pos.z;
      this.pos.x += this.vel.x * h; this.pos.z += this.vel.z * h; this.pos.y += this.vel.y * h;
      this.col.resolve(this.pos, RADIUS, this.pos.y, this.pos.y + this.height, this.pos.y + STEP);
      // world edge
      const r = Math.hypot(this.pos.x, this.pos.z);
      if (r > WORLD_RADIUS) { this.pos.x *= WORLD_RADIUS / r; this.pos.z *= WORLD_RADIUS / r; }
      const sup = this.findSupport(this.pos.x, this.pos.z, this.pos.y + STEP);
      // deep water: swim
      const deep = !sup.box && WATER_LEVEL - sup.y > 1.38 && lakeE(this.pos.x, this.pos.z) < 1.3;
      if (deep !== this.swimming) {
        this.swimming = deep; if (!deep) { this.diving = false; this.dive = 0; }
        if (deep) { this.onSplash?.(this.pos, 1.0); this.vel.y *= 0.3; }
      }
      if (this.swimming) { this.onGround = false; this.supportBox = null; continue; }
      const top = this.col.ceilingHeight(this.pos.x, this.pos.z, RADIUS * 0.8, this.pos.y);
      if (this.pos.y + this.height > top && this.vel.y > 0) { this.vel.y = 0; this.pos.y = top - this.height; }
      if (this.pos.y <= sup.y) {
        if (this.vel.y < -3) fall = -this.vel.y;
        this.pos.y = sup.y; if (this.vel.y < 0) this.vel.y = 0; this.onGround = true; this.supportBox = sup.box;
      } else if (wasGround && this.vel.y <= 0 && this.pos.y - sup.y < 0.3 && !this.climbing) {
        this.pos.y = sup.y; this.vel.y = 0; this.onGround = true; this.supportBox = sup.box;
      } else if (!this.climbing) { this.onGround = false; }
      else { this.onGround = this.pos.y <= sup.y + 0.01; this.supportBox = sup.box; }
    }
    if (fall > 0) { this.surface = this.surfaceAt(); this.audio?.footstep(this.surface, this.pos, Math.min(2, fall / 3)); }

    // footsteps + head bob
    const hs = Math.hypot(this.vel.x, this.vel.z);
    const stepLen = running ? 1.55 : this.crouching ? 0.85 : 1.25;
    this.speedH = hs; this.stepLen = stepLen;
    if (this.swimming) {
      this.swimPhase += dt * (1.6 + hs * 1.4);
      const stroke = Math.floor(this.swimPhase / Math.PI);
      if (stroke !== this.lastStroke) { this.lastStroke = stroke; if (hs > 0.2) this.onStroke?.(this.pos, hs); }
    }
    if (this.onGround && hs > 0.3) this.travel += hs * dt;
    if (Math.floor(this.travel / stepLen) !== this.lastStep) {
      this.lastStep = Math.floor(this.travel / stepLen);
      this.surface = this.climbing ? 'wood' : this.surfaceAt();
      this.audio?.footstep(this.surface, tmpV.copy(this.pos), this.crouching ? 0.45 : running ? 1.3 : 0.9);
      if (this.surface === 'water') this.onSplash?.(this.pos, 0.35 + (running ? 0.3 : 0));
    }
    const phase = (this.travel / stepLen) * Math.PI;
    const bobAmp = this.swimming ? 0 : s.headBob ? Math.min(1, hs / 4) * (running ? 0.05 : 0.032) : 0;
    this.bob.x += (Math.sin(phase) * bobAmp * 0.6 - this.bob.x) * Math.min(1, dt * 12);
    this.bob.y += (-Math.abs(Math.sin(phase)) * bobAmp - this.bob.y) * Math.min(1, dt * 12);

    // smooth eye height (stairs)
    const eyeTarget = this.pos.y + this.height - 0.1;
    const diff = eyeTarget - this.eyeY;
    this.eyeY += diff * Math.min(1, dt * (Math.abs(diff) > 0.6 ? 30 : 14));
    cam.position.set(this.pos.x + Math.cos(this.yaw) * this.bob.x, this.eyeY + this.bob.y, this.pos.z - Math.sin(this.yaw) * this.bob.x);
    cam.rotation.set(this.pitch, this.yaw, 0);
    this.applyFov(dt, running && hs > 3);
  }

  applyFov(dt, sprint) {
    // fov setting is the horizontal-ish view on landscape screens; widen vertically on tall (portrait) screens
    let base = this.settings.fov;
    const asp = this.camera.aspect;
    if (asp < 1.3) { const h = THREE.MathUtils.degToRad(base * 1.25); base = Math.min(105, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / asp))); }
    const target = base / this.zoom + (sprint ? 4 : 0);
    if (Math.abs(this.camera.fov - target) > 0.01) {
      this.camera.fov += (target - this.camera.fov) * Math.min(1, dt * 6);
      this.camera.updateProjectionMatrix();
    }
  }

  updateSeat(dt, ax) {
    const s = this.seat, inp = this.input;
    if (ax.mag > 0.4 || inp.hit('Space')) { this.stand(); return; }
    // clamp look around the seat
    if (!s.lie) {
      let d = this.yaw - s.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
      const lim = s.yawLimit ?? 1.9;
      if (Math.abs(d) > lim) this.yaw = s.yaw + Math.sign(d) * lim;
    }
    this.seatBlend = Math.min(1, this.seatBlend + dt * 2.2);
    const e = this.seatBlend * this.seatBlend * (3 - 2 * this.seatBlend);
    const eye = s.getEye ? s.getEye() : s.eye;
    this.camera.position.lerpVectors(this.seatFrom, eye, e);
    this.camera.rotation.set(this.pitch, this.yaw, s.roll || 0);
    this.pos.set(eye.x, eye.y - 1.2, eye.z);
    this.applyFov(dt, false);
  }
}
