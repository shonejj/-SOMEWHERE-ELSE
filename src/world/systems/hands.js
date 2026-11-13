// First-person hands: anatomical, jointed, procedurally animated.
// They rest out of view, rise when you look at something usable, reach out to
// touch / press / push things, grip whatever you carry, and both come up to inspect.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const FINGERS = [
  // x offset, base z, segment lengths, radius, splay
  { x: -0.026, z: -0.086, L: [0.044, 0.027, 0.021], r: 0.0092, splay: -0.08 }, // index
  { x: -0.008, z: -0.090, L: [0.048, 0.030, 0.022], r: 0.0095, splay: -0.02 }, // middle
  { x: 0.010, z: -0.087, L: [0.045, 0.028, 0.021], r: 0.009, splay: 0.04 },   // ring
  { x: 0.026, z: -0.080, L: [0.036, 0.022, 0.019], r: 0.0082, splay: 0.11 },  // little
];

// curl per finger [index, middle, ring, little], thumb curl, thumb opposition, spread
const POSES = {
  relaxed: { c: [0.32, 0.38, 0.44, 0.5], t: 0.25, o: 0.2, s: 0.3 },
  open:    { c: [0.06, 0.05, 0.07, 0.1], t: 0.05, o: 0.0, s: 1.0 },
  point:   { c: [0.0, 0.85, 0.9, 0.92], t: 0.6, o: 0.6, s: 0.1 },
  grip:    { c: [0.62, 0.66, 0.7, 0.72], t: 0.5, o: 0.9, s: 0.2 },
  pinch:   { c: [0.45, 0.6, 0.75, 0.8], t: 0.45, o: 1.0, s: 0.1 },
  hold:    { c: [0.5, 0.52, 0.55, 0.6], t: 0.35, o: 0.7, s: 0.4 },
};

const capsule = (r, L) => { const g = new THREE.CapsuleGeometry(r, Math.max(0.001, L - r * 1.2), 6, 10); g.rotateX(-Math.PI / 2); g.translate(0, 0, -L / 2); return g; };
const ease = (t) => t * t * (3 - 2 * t);

function buildHand(T, skinMat, sleeveMat, nailMat) {
  const root = new THREE.Group();
  const wrist = new THREE.Group(); root.add(wrist);
  const add = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = false; m.receiveShadow = true; m.frustumCulled = false; parent.add(m); return m; };
  // palm: slightly tapered rounded block, thicker at the heel
  const palmG = new RoundedBoxGeometry(0.078, 0.028, 0.092, 4, 0.012);
  const pp = palmG.attributes.position;
  for (let i = 0; i < pp.count; i++) {
    const z = pp.getZ(i), y = pp.getY(i), x = pp.getX(i);
    const t = (z + 0.046) / 0.092; // 0 at fingers, 1 at heel
    pp.setY(i, y * (0.85 + t * 0.35) + (y < 0 ? -0.004 * Math.sin(t * Math.PI) : 0));
    pp.setX(i, x * (1.0 - t * 0.12));
    if (y > 0) pp.setY(i, pp.getY(i) + Math.cos(x * 40) * 0.0012); // knuckle ridges / tendons
  }
  palmG.computeVertexNormals();
  add(palmG, skinMat, wrist, 0, 0, -0.045);
  // thenar pad (thumb muscle)
  const pad = add(new THREE.SphereGeometry(0.022, 14, 10), skinMat, wrist, -0.026, -0.008, -0.03); pad.scale.set(0.9, 0.6, 1.4);
  // wrist bridge to the sleeve
  add(new THREE.CylinderGeometry(0.026, 0.03, 0.05, 16).rotateX(Math.PI / 2), skinMat, wrist, 0, -0.002, 0.012).scale.set(1.25, 0.75, 1);
  // knuckle bumps
  const fingers = [];
  for (const f of FINGERS) {
    add(new THREE.SphereGeometry(f.r * 1.15, 10, 8), skinMat, wrist, f.x, 0.006, f.z + 0.004).scale.set(1, 0.8, 1);
    const base = new THREE.Group(); base.position.set(f.x, 0.002, f.z); base.rotation.y = -f.splay; wrist.add(base);
    const joints = [base];
    let parent = base;
    f.L.forEach((L, i) => {
      const r = f.r * (1 - i * 0.1);
      add(capsule(r, L), skinMat, parent);
      if (i === 2) { const nail = add(new RoundedBoxGeometry(r * 1.5, 0.002, L * 0.55, 2, 0.0008), nailMat, parent, 0, r * 0.82, -L * 0.62); nail.rotation.x = 0.05; }
      if (i < 2) { const j = new THREE.Group(); j.position.z = -L + r * 0.3; parent.add(j); joints.push(j); parent = j; }
    });
    fingers.push({ joints, splay: f.splay, base });
  }
  // thumb: three segments from the heel of the palm
  const tb = new THREE.Group(); tb.position.set(-0.034, -0.006, -0.018); wrist.add(tb);
  const tJoints = [tb];
  let par = tb;
  [0.036, 0.03, 0.025].forEach((L, i) => {
    const r = 0.0118 - i * 0.0012;
    add(capsule(r, L), skinMat, par);
    if (i === 2) add(new RoundedBoxGeometry(r * 1.5, 0.002, L * 0.5, 2, 0.0008), nailMat, par, 0, r * 0.8, -L * 0.6);
    if (i < 2) { const j = new THREE.Group(); j.position.z = -L + r * 0.3; par.add(j); tJoints.push(j); par = j; }
  });
  // sleeve with ribbed cuff, running back and down out of view
  const sleeve = new THREE.Group(); sleeve.position.set(0, -0.004, 0.03); wrist.add(sleeve);
  const armG = new THREE.CylinderGeometry(0.038, 0.047, 0.4, 20, 1, true).rotateX(Math.PI / 2); armG.translate(0, 0, 0.2);
  const arm = add(armG, sleeveMat, sleeve, 0, 0, 0.012);
  arm.material.side = THREE.DoubleSide;
  const cuffG = new THREE.CylinderGeometry(0.036, 0.039, 0.05, 28, 1, true).rotateX(Math.PI / 2);
  const cp = cuffG.attributes.position;
  for (let i = 0; i < cp.count; i++) { const a = Math.atan2(cp.getY(i), cp.getX(i)); const k = 1 + Math.cos(a * 28) * 0.03; cp.setX(i, cp.getX(i) * k); cp.setY(i, cp.getY(i) * k); }
  cuffG.computeVertexNormals();
  add(cuffG, sleeveMat, sleeve, 0, 0, 0.012);
  return { root, wrist, fingers, thumb: tJoints, sleeve };
}

export class Hands {
  constructor(camera, T) {
    this.camera = camera;
    const skinMat = new THREE.MeshPhysicalMaterial({
      map: T.skin.map, normalMap: T.skin.normalMap, normalScale: new THREE.Vector2(0.35, 0.35),
      color: 0xf0d2c0, roughness: 0.58, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new THREE.Color(0.9, 0.45, 0.35),
      clearcoat: 0.08, clearcoatRoughness: 0.6, envMapIntensity: 0.6,
    });
    const nailMat = new THREE.MeshPhysicalMaterial({ color: 0xf1d0c8, roughness: 0.25, clearcoat: 0.6, sheen: 0.2 });
    T.knit.map.repeat.set(3, 2); T.knit.normalMap.repeat.set(3, 2);
    const sleeveMat = new THREE.MeshStandardMaterial({ map: T.knit.map, normalMap: T.knit.normalMap, roughness: 1, color: 0xffffff, envMapIntensity: 0.4 });
    this.R = buildHand(T, skinMat, sleeveMat, nailMat);
    this.L = buildHand(T, skinMat, sleeveMat, nailMat);
    this.L.root.scale.x = -1; // mirrored left hand
    camera.add(this.R.root, this.L.root);
    for (const h of [this.R, this.L]) {
      h.pos = new THREE.Vector3(0.24, -0.62, -0.3); h.q = new THREE.Quaternion(); h.pose = { ...POSES.relaxed, c: [...POSES.relaxed.c] };
      h.root.position.copy(h.pos);
    }
    this.L.pos.x = -0.24;
    this.reachState = null;
    this.t = 0;
    this.tmp = new THREE.Vector3();
    this.e = new THREE.Euler();
    this.qi = new THREE.Quaternion(); this.zAxis = new THREE.Vector3(0, 0, 1);
  }

  /** Animate a reach toward a world point; callback fires when the hand arrives. */
  reach(worldPoint, kind, onArrive) {
    const p = this.camera.worldToLocal(worldPoint.clone());
    const len = p.length(); if (len > 0.62) p.multiplyScalar(0.62 / len);
    this.reachState = { p, kind, t: 0, fired: false, onArrive };
  }

  setPose(h, name, k) {
    const P = POSES[name];
    for (let i = 0; i < 4; i++) h.pose.c[i] += (P.c[i] - h.pose.c[i]) * k;
    h.pose.t += (P.t - h.pose.t) * k; h.pose.o += (P.o - h.pose.o) * k; h.pose.s += (P.s - h.pose.s) * k;
  }

  applyPose(h, t) {
    const P = h.pose;
    h.fingers.forEach((f, i) => {
      const c = P.c[i] + Math.sin(t * 0.9 + i) * 0.015; // tiny living motion
      f.joints[0].rotation.x = -c * 1.35;
      f.joints[1].rotation.x = -c * 1.7;
      f.joints[2].rotation.x = -c * 1.15;
      f.base.rotation.y = -f.splay * (0.4 + P.s);
    });
    const th = h.thumb;
    th[0].rotation.set(-0.25 - P.o * 0.35, 0.75 - P.o * 0.45, -0.55 - P.o * 0.5);
    th[1].rotation.x = -P.t * 0.9; th[2].rotation.x = -P.t * 1.1;
  }

  /** state: { held, inspecting, hover, mode, bob, moving } */
  update(dt, s) {
    this.t += dt;
    const R = this.R, L = this.L, k = Math.min(1, dt * 10);
    const bobX = s.bob ? s.bob.x * 1.6 : 0, bobY = s.bob ? s.bob.y * 1.2 : 0;
    const sway = Math.sin(this.t * 1.3) * 0.004;
    let rPos, rRot, rPose = 'relaxed', lPos = new THREE.Vector3(-0.26, -0.7, -0.32), lRot = [0.2, 0.2, 0.3], lPose = 'relaxed';

    if (s.swim) {
      // breaststroke: glide forward, sweep out, pull in, extend
      const c = ((s.swimPhase / (Math.PI * 2)) % 1 + 1) % 1;
      const key = [[0, 0.07, -0.15, -0.56], [0.35, 0.34, -0.21, -0.42], [0.6, 0.11, -0.24, -0.26], [1, 0.07, -0.15, -0.56]];
      let i = 0; while (c > key[i + 1][0]) i++;
      const a = key[i], b = key[i + 1], f = ease((c - a[0]) / (b[0] - a[0]));
      const x = a[1] + (b[1] - a[1]) * f, y = a[2] + (b[2] - a[2]) * f, z = a[3] + (b[3] - a[3]) * f;
      const outward = i === 0 ? 1 : 0;
      rPos = new THREE.Vector3(x, y, z); lPos = new THREE.Vector3(-x, y, z);
      rRot = [-0.15, 0.1, -0.4 - outward * 0.5]; lRot = [-0.15, 0.1, -0.4 - outward * 0.5];
      rPose = 'open'; lPose = 'open';
    } else if (s.mode === 'seat' || s.mode === 'scope') {
      rPos = new THREE.Vector3(0.26, -0.75, -0.3); rRot = [0, 0, 0];
    } else if (s.held) {
      const it = s.held, m = it.mesh, sz = Math.min(0.5, it.size);
      const ip = this.camera.worldToLocal(m.position.clone());
      if (s.inspecting) {
        rPos = ip.clone().add(this.tmp.set(sz * 0.42 + 0.035, -sz * 0.18 - 0.01, 0.06)); rRot = [0.1, 0.25, -1.25]; rPose = sz > 0.25 ? 'hold' : 'grip';
        lPos = ip.clone().add(this.tmp.set(-(sz * 0.42 + 0.035), -sz * 0.18 - 0.01, 0.06)); lRot = [0.1, 0.25, -1.25]; lPose = 'hold';
      } else {
        rPos = ip.clone().add(this.tmp.set(sz * 0.22 + 0.02, -sz * 0.3 - 0.03, 0.06)); rRot = [0.45, 0.25, -0.75];
        rPose = sz < 0.12 ? 'pinch' : sz > 0.3 ? 'hold' : 'grip';
      }
    } else if (this.reachState) {
      const r = this.reachState; r.t += dt / 0.62;
      const go = r.t < 0.4 ? ease(r.t / 0.4) : r.t < 0.6 ? 1 : 1 - ease((r.t - 0.6) / 0.4);
      const rest = new THREE.Vector3(0.2, -0.36, -0.36);
      const target = r.p.clone().add(this.tmp.set(0.012, -0.03, 0.16));
      rPos = rest.lerp(target, go);
      const kind = r.kind;
      rPose = kind === 'press' ? 'point' : kind === 'push' ? 'open' : go > 0.7 ? 'grip' : 'open';
      rRot = kind === 'push' ? [0.25 + go * 0.5, 0.15, -0.35] : kind === 'press' ? [0.1, 0.1, -0.3] : [0.2, 0.2, -0.8 * go];
      if (!r.fired && r.t >= 0.38) { r.fired = true; r.onArrive?.(); }
      if (r.t >= 1) this.reachState = null;
    } else if (s.hover) {
      rPos = new THREE.Vector3(0.23, -0.4, -0.4); rRot = [0.15, 0.15, -0.35]; rPose = 'relaxed';
    } else {
      rPos = new THREE.Vector3(0.25, -0.66, -0.32); rRot = [0.2, 0.15, -0.3];
    }
    if (!s.held && !this.reachState && !s.swim) { rPos.x += bobX; rPos.y += bobY + sway; lPos.x += bobX; lPos.y += bobY; }

    for (const [h, pos, rot, pose] of [[R, rPos, rRot, rPose], [L, lPos, lRot, lPose]]) {
      const isL = h === L;
      h.pos.lerp(pos, s.held ? Math.min(1, dt * 22) : k);
      // mirror rotations for the left hand (its x is flipped by scale)
      this.e.set(rot[0], isL ? -rot[1] : rot[1], isL ? -rot[2] : rot[2]);
      const q = new THREE.Quaternion().setFromEuler(this.e);
      h.q.slerp(q, k);
      h.root.position.copy(h.pos); h.root.quaternion.copy(h.q);
      // forearm runs from the wrist toward an elbow below and beside the view
      const elbow = this.tmp.set(isL ? -0.3 : 0.3, -0.5, 0.02);
      const dir = elbow.sub(h.pos);
      const len = dir.length();
      dir.normalize().applyQuaternion(this.qi.copy(h.q).invert());
      if (isL) dir.x = -dir.x;
      h.sleeve.quaternion.setFromUnitVectors(this.zAxis, dir);
      h.sleeve.scale.set(1, 1, Math.max(0.4, Math.min(1.2, len / 0.4)));
      this.setPose(h, pose, Math.min(1, dt * 12));
      this.applyPose(h, this.t);
      h.root.visible = h.pos.y > -0.62 || pos.y > -0.6;
    }
  }
}
