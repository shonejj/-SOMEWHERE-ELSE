// Looking at things, using them, picking them up, inspecting and throwing them.
import * as THREE from 'three';

const fwd = new THREE.Vector3(), tmp = new THREE.Vector3(), q = new THREE.Quaternion(), qa = new THREE.Quaternion();
const AX = new THREE.Vector3();

export class Interaction {
  constructor({ camera, input, physics, audio, player, ui }) {
    Object.assign(this, { camera, input, physics, audio, player, ui });
    this.targets = []; this.occluders = []; this.updaters = [];
    this.ray = new THREE.Raycaster(); this.ray.far = 2.7;
    this.held = null; this.focus = null;
    this.coneAngle = 0.11;
    this.holdQ = new THREE.Quaternion();
  }

  /** Make an object usable. spec = { label: string|()=>string, use: ()=>void } */
  register(obj, spec) {
    obj.userData.interact = spec;
    this.targets.push(obj);
    return spec;
  }
  item(mesh, name, opts) {
    const it = this.physics.addItem(mesh, opts);
    it.name = name;
    this.targets.push(mesh);
    return it;
  }
  occluder(mesh) { this.occluders.push(mesh); }
  onUpdate(fn) { this.updaters.push(fn); }

  pick() {
    this.camera.getWorldDirection(fwd);
    this.ray.set(this.camera.position, fwd);
    const hits = this.ray.intersectObjects(this.held ? this.occluders : this.targets.concat(this.occluders), true);
    const direct = this.resolveHits(hits);
    if (direct || this.held) return direct;
    // forgiving aim: the nearest small object inside a narrow cone, if nothing blocks the view of it
    const block = hits.length ? hits[0].distance : Infinity;
    let best = null, bestA = this.coneAngle;
    for (const it of this.physics.items) {
      if (it.held) continue;
      tmp.copy(it.mesh.position).sub(this.camera.position);
      const d = tmp.length();
      if (d > this.ray.far || d > block + 0.15 || d < 0.05) continue;
      const a = Math.acos(Math.min(1, tmp.dot(fwd) / d));
      if (a < bestA) { bestA = a; best = it; }
    }
    if (!best) return null;
    tmp.copy(best.mesh.position).sub(this.camera.position);
    const d = tmp.length();
    this.ray.set(this.camera.position, tmp.normalize());
    const occ = this.ray.intersectObjects(this.occluders, true)[0];
    if (occ && occ.distance < d - 0.1) return null;
    return { kind: 'item', obj: best.mesh, item: best, point: best.mesh.position.clone() };
  }

  resolveHits(hits) {
    for (const h of hits) {
      let o = h.object;
      if (this.held && o === this.held.mesh) continue;
      while (o) {
        if (o.userData.interact) return { kind: 'use', obj: o, spec: o.userData.interact, point: h.point };
        if (o.userData.item && !o.userData.item.held) return { kind: 'item', obj: o, item: o.userData.item, point: h.point };
        o = o.parent;
      }
      return null; // blocked by an occluder
    }
    return null;
  }

  grab(item) {
    this.held = item; item.held = true;
    this.physics.world.removeBody(item.body);
    // remember orientation relative to the camera
    qa.copy(this.camera.quaternion).invert();
    this.holdQ.copy(qa).multiply(item.mesh.quaternion);
    this.audio?.pickup(item.mesh.position);
    this.holdDist = 0.75;
    this.ui.setHolding(item.name);
  }

  release(throwSpeed = 0) {
    const it = this.held; if (!it) return;
    this.held = null; it.held = false;
    const b = it.body;
    b.position.copy(it.mesh.position); b.quaternion.copy(it.mesh.quaternion);
    this.camera.getWorldDirection(fwd);
    b.velocity.set(fwd.x * throwSpeed + this.player.vel.x, fwd.y * throwSpeed + 0.4 + (throwSpeed ? 1.2 : 0), fwd.z * throwSpeed + this.player.vel.z);
    b.angularVelocity.set((Math.random() - 0.5) * throwSpeed, (Math.random() - 0.5) * throwSpeed, (Math.random() - 0.5) * throwSpeed);
    this.physics.world.addBody(b); b.wakeUp();
    if (throwSpeed) this.audio?.whoosh(0.15);
    this.player.lookLocked = false;
    this.ui.setHolding(null);
  }

  update(dt) {
    const inp = this.input, pl = this.player;
    for (const u of this.updaters) u(dt);
    const use = inp.hit('KeyE') || inp.hit('Tap');

    if (pl.mode === 'seat') {
      this.ui.hint(pl.seat?.lie ? 'Get up' : 'Stand up', true);
      if (use) pl.stand();
      return;
    }
    if (pl.mode === 'scope') { this.ui.hint('Step back', true); return; }

    if (this.held) {
      const it = this.held;
      const inspecting = inp.down('KeyR') || inp.mouse.right;
      pl.lookLocked = inspecting;
      this.camera.getWorldDirection(fwd);
      let want = inspecting ? 0.5 + it.size * 0.25 : 0.7 + it.size * 0.3;
      // keep held objects from pushing through walls
      this.ray.set(this.camera.position, fwd);
      const hit = this.ray.intersectObjects(this.occluders, true)[0];
      if (hit) want = Math.min(want, Math.max(0.25, hit.distance - it.size * 0.4));
      this.holdDist += (want - this.holdDist) * Math.min(1, dt * 10);
      tmp.copy(this.camera.position).addScaledVector(fwd, this.holdDist);
      if (!inspecting) { tmp.y -= 0.16; tmp.addScaledVector(AX.set(1, 0, 0).applyQuaternion(this.camera.quaternion), 0.12); }
      it.mesh.position.lerp(tmp, Math.min(1, dt * 16));
      if (inspecting) {
        // rotate the object with mouse / finger movement
        const rx = inp.look.y * 0.008, ry = inp.look.x * 0.008;
        qa.setFromAxisAngle(AX.set(0, 1, 0), ry); this.holdQ.premultiply(qa);
        qa.setFromAxisAngle(AX.set(1, 0, 0), rx); this.holdQ.premultiply(qa);
      }
      q.copy(this.camera.quaternion).multiply(this.holdQ);
      it.mesh.quaternion.slerp(q, Math.min(1, dt * 14));
      if (inp.hit('Mouse0')) this.release(7.5);
      else if (use || inp.hit('KeyQ')) this.release(0);
      this.ui.hint(null);
      return;
    }

    const f = this.pick();
    this.focus = f;
    if (!f) { this.ui.hint(null); return; }
    const busy = this.hands?.reachState;
    if (f.kind === 'item') {
      this.ui.hint('Pick up ' + f.item.name);
      if (use && !busy) {
        if (this.hands) this.hands.reach(f.item.mesh.position, 'grab', () => this.grab(f.item));
        else this.grab(f.item);
      }
    } else {
      const label = typeof f.spec.label === 'function' ? f.spec.label() : f.spec.label;
      this.ui.hint(label);
      if (use && !busy) {
        const kind = /sit|lie|look through|crawl|step back|it's/i.test(label) ? null
          : /door|window|drawer|cupboard|wardrobe|chest/i.test(label) ? 'push' : 'press';
        if (kind && this.hands) this.hands.reach(f.point, kind, () => f.spec.use(f));
        else f.spec.use(f);
      }
    }
  }
}
