// The person you are: a full procedurally modelled and animated body.
// Look down and you see your sweater, jeans and boots; your shadow walks with you.
// Legs use two-bone IK (standing, walking, running, crouching, sitting, climbing,
// swimming); arms swing naturally and hand over to the first-person hands when
// you reach for something.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const L1 = 0.43, L2 = 0.43, ANKLE = 0.085, UA = 0.29, FA = 0.26;

function lathe(profile, seg = 18) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg);
}

export class Body {
  constructor(scene, T) {
    const skin = new THREE.MeshPhysicalMaterial({ map: T.skin.map, normalMap: T.skin.normalMap, normalScale: new THREE.Vector2(0.3, 0.3), color: 0xf0d2c0, roughness: 0.58, sheen: 0.5, sheenColor: new THREE.Color(0.9, 0.45, 0.35) });
    const knit = T.knit.map.clone(); knit.repeat.set(4, 3); knit.needsUpdate = true;
    const knitN = T.knit.normalMap.clone(); knitN.repeat.set(4, 3); knitN.needsUpdate = true;
    const sweater = new THREE.MeshStandardMaterial({ map: knit, normalMap: knitN, roughness: 1, side: THREE.DoubleSide });
    const dn = T.denim.map.clone(); dn.repeat.set(2, 3); dn.needsUpdate = true;
    const dnN = T.denim.normalMap.clone(); dnN.repeat.set(2, 3); dnN.needsUpdate = true;
    const jeans = new THREE.MeshStandardMaterial({ map: dn, normalMap: dnN, roughness: 0.9, side: THREE.DoubleSide });
    const leather = new THREE.MeshStandardMaterial({ map: T.leather.map, normalMap: T.leather.normalMap, roughness: 0.55, color: 0xffffff });
    const sole = new THREE.MeshStandardMaterial({ color: 0x1d1a17, roughness: 0.9 });
    const belt = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.5 });
    // invisible to the eye but still casting a shadow (so you never see the inside of your own head)
    const ghost = (m) => { const g = m.clone(); g.colorWrite = false; g.depthWrite = false; return g; };
    this.mats = { skin, sweater, jeans };

    const root = (this.root = new THREE.Group());
    scene.add(root);
    const add = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };

    // pelvis + hips
    const pelvis = (this.pelvis = new THREE.Group()); pelvis.position.y = 0.92; root.add(pelvis);
    const hipG = lathe([[0.0, -0.13], [0.13, -0.12], [0.165, -0.04], [0.16, 0.06], [0.145, 0.1], [0.0, 0.1]]); hipG.scale(1.1, 1, 0.78);
    add(hipG, jeans, pelvis);
    add(new THREE.TorusGeometry(0.152, 0.012, 6, 28).rotateX(Math.PI / 2).scale(1.1, 1, 0.78), belt, pelvis, 0, 0.075, 0);
    add(new RoundedBoxGeometry(0.05, 0.035, 0.01, 2, 0.004), new THREE.MeshStandardMaterial({ color: 0xa08850, metalness: 1, roughness: 0.3 }), pelvis, 0, 0.075, -0.125);

    // legs
    this.legs = [];
    for (const side of [-1, 1]) {
      const hip = new THREE.Group(); hip.position.set(side * 0.092, -0.05, 0); pelvis.add(hip);
      add(lathe([[0.0, 0.02], [0.08, 0.0], [0.083, -0.12], [0.07, -0.3], [0.058, -L1 + 0.02], [0.0, -L1 - 0.02]]), jeans, hip);
      const knee = new THREE.Group(); knee.position.y = -L1; hip.add(knee);
      add(lathe([[0.0, 0.03], [0.058, 0.02], [0.062, -0.1], [0.05, -0.25], [0.056, -L2 + 0.03], [0.0, -L2]]), jeans, knee);
      const ankle = new THREE.Group(); ankle.position.y = -L2; knee.add(ankle);
      // boot: shaft + shaped foot + sole + laces
      add(new THREE.CylinderGeometry(0.058, 0.062, 0.14, 16), leather, ankle, 0, 0.0, 0.005);
      const footG = new RoundedBoxGeometry(0.105, 0.09, 0.27, 4, 0.04);
      const fp = footG.attributes.position;
      for (let i = 0; i < fp.count; i++) { const z = fp.getZ(i), y = fp.getY(i); if (z < -0.05 && y > 0) fp.setY(i, y - (-(z + 0.05)) * 0.35); }
      footG.computeVertexNormals();
      add(footG, leather, ankle, 0, -ANKLE + 0.045, -0.06);
      add(new RoundedBoxGeometry(0.112, 0.022, 0.285, 2, 0.008), sole, ankle, 0, -ANKLE - 0.003, -0.06);
      for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.05, 0.004, 0.006), belt, ankle, 0, 0.0 - i * 0.025 + 0.02, -0.06 - i * 0.012).rotation.x = 0.4;
      this.legs.push({ hip, knee, ankle, side });
    }

    // spine, torso, neck, head
    const spine = (this.spine = new THREE.Group()); spine.position.y = 0.05; pelvis.add(spine);
    const torsoG = lathe([[0.0, -0.02], [0.148, -0.01], [0.155, 0.08], [0.17, 0.2], [0.182, 0.32], [0.178, 0.4], [0.15, 0.46], [0.09, 0.5], [0.06, 0.52], [0.0, 0.52]], 24);
    torsoG.scale(1.18, 1, 0.74);
    this.torso = add(torsoG, sweater, spine);
    // ribbed hem and collar
    add(new THREE.TorusGeometry(0.15, 0.014, 6, 30).rotateX(Math.PI / 2).scale(1.18, 1, 0.74), sweater, spine, 0, 0.0, 0);
    add(new THREE.TorusGeometry(0.065, 0.016, 6, 20).rotateX(Math.PI / 2), sweater, spine, 0, 0.51, 0);
    const head = (this.head = new THREE.Group()); head.position.set(0, 0.6, 0); spine.add(head);
    add(new THREE.CylinderGeometry(0.05, 0.055, 0.12, 12), ghost(skin), head, 0, -0.06, 0);
    const skull = add(new THREE.SphereGeometry(0.1, 18, 14), ghost(skin), head, 0, 0.07, -0.01); skull.scale.set(0.9, 1.12, 1.05);
    add(new THREE.SphereGeometry(0.104, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), ghost(skin), head, 0, 0.08, 0.005).scale.set(0.92, 1.1, 1.08);

    // arms
    this.arms = [];
    for (const side of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(side * 0.2, 0.44, 0.0); spine.add(sh);
      add(new THREE.SphereGeometry(0.06, 12, 10), sweater, sh).scale.set(1, 0.9, 1);
      add(lathe([[0.0, 0.02], [0.056, 0.0], [0.054, -0.12], [0.047, -UA + 0.02], [0.0, -UA - 0.02]]), sweater, sh);
      const el = new THREE.Group(); el.position.y = -UA; sh.add(el);
      add(lathe([[0.0, 0.02], [0.047, 0.01], [0.046, -0.1], [0.04, -FA + 0.02], [0.0, -FA]]), sweater, el);
      const wr = new THREE.Group(); wr.position.y = -FA; el.add(wr);
      add(new THREE.CylinderGeometry(0.026, 0.03, 0.05, 12), skin, wr, 0, -0.015, 0).scale.set(1.2, 1, 0.8);
      const palm = add(new RoundedBoxGeometry(0.075, 0.09, 0.03, 3, 0.012), skin, wr, 0, -0.075, 0); palm.scale.set(1, 1, 1);
      add(new RoundedBoxGeometry(0.07, 0.075, 0.026, 3, 0.012), skin, wr, 0, -0.15, -0.006).rotation.x = 0.35;
      add(new THREE.CapsuleGeometry(0.012, 0.045, 3, 8), skin, wr, side * -0.0, -0.07, -0.03).rotation.set(0.3, 0, side * 0.5);
      this.arms.push({ sh, el, wr, side });
    }
    this.armsGroup = this.arms.map((a) => a.sh);

    this.yaw = 0; this.t = 0; this.visible = true;
    this.lean = 0; this.pelvisY = 0.92; this.swimBlend = 0; this.crouchBlend = 0;
    this.tmp = new THREE.Vector3();
  }

  /** Two-bone IK in the leg's sagittal plane. fwd: forward distance, down: drop below the hip (both m). */
  solveLeg(leg, fwd, down, spread = 0) {
    let d = Math.hypot(fwd, down);
    d = Math.min(L1 + L2 + ANKLE * 0 - 0.002, Math.max(0.12, d));
    const theta = Math.atan2(fwd, down);
    const alpha = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
    const kneeIn = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2))));
    const a = theta + alpha, k = Math.PI - kneeIn;
    leg.hip.rotation.set(a, 0, spread * leg.side);
    leg.knee.rotation.x = -k;
    leg.ankle.rotation.x = -(a - k) - this.lean * 0.0;
  }

  /**
   * s: { pos, yaw, pitch, mode, speed, running, crouch(0..1), onGround, travel, stepLen, swim, swimPhase,
   *      climbing, seat: { eye, lie }, camera, handsActive }
   */
  update(dt, s) {
    this.t += dt;
    const root = this.root;
    if ((s.mode === 'seat' && s.seat?.lie) || s.swim) { root.visible = false; return; } // swimming: your hands do the work in view
    root.visible = true;
    // body yaw follows the view, with a little give when standing still
    let dy = s.yaw - this.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    if (s.speed > 0.3 || Math.abs(dy) > 0.7 || s.mode !== 'walk') this.yaw += dy * Math.min(1, dt * (s.speed > 0.3 ? 10 : 5));
    root.rotation.set(0, this.yaw, 0);
    const back = 0.12; // keep the torso just behind the eyes
    const sinY = Math.sin(this.yaw), cosY = Math.cos(this.yaw);
    const swimT = s.swim ? 1 : 0;
    this.swimBlend += (swimT - this.swimBlend) * Math.min(1, dt * 4);
    this.crouchBlend += (s.crouch - this.crouchBlend) * Math.min(1, dt * 8);

    if (s.mode === 'seat') {
      const eye = s.camera.position;
      const floorY = eye.y - 1.12;
      root.position.set(eye.x + sinY * 0.12, floorY, eye.z + cosY * 0.12);
      this.pelvis.position.y = 0.5; this.pelvis.rotation.x = 0;
      this.spine.rotation.x = -0.12;
      for (const L of this.legs) this.solveLeg(L, 0.48, 0.5 - 0.02, 0.05);
      for (const A of this.arms) { A.sh.rotation.set(0.55, 0, A.side * 0.15); A.el.rotation.x = 0.9; A.wr.rotation.x = 0; }
      this.armsVisible(!s.handsActive);
      return;
    }
    root.position.set(s.pos.x + sinY * back, s.pos.y, s.pos.z + cosY * back);

    const sp = Math.min(1, s.speed / 4.6);
    const walkK = Math.min(1, s.speed / 1.2);
    const phase = (s.travel / s.stepLen) * Math.PI;
    let pelvisY = 0.915 - this.crouchBlend * 0.38 - Math.abs(Math.sin(phase)) * 0.025 * walkK;
    if (!s.onGround && !s.climbing && !s.swim) pelvisY -= 0.06;
    this.lean = this.crouchBlend * 0.35 + sp * 0.12 + Math.max(-0.2, Math.min(0.35, -s.pitch * 0.25));

    if (this.swimBlend > 0.01) {
      // horizontal-ish swimming: pelvis under the surface, flutter kick, breaststroke arms
      const k = this.swimBlend, sw = s.swimPhase;
      root.position.y = s.waterY - 1.32;
      this.pelvis.position.y = 0.92;
      this.pelvis.rotation.x = -1.15 * k;
      this.spine.rotation.x = 0.35 * k;
      for (const L of this.legs) {
        L.hip.rotation.set(Math.sin(sw * 2.2 + (L.side > 0 ? Math.PI : 0)) * 0.3 * k - 0.05, 0, L.side * 0.06);
        L.knee.rotation.x = -0.25 - Math.max(0, Math.sin(sw * 2.2 + (L.side > 0 ? 0 : Math.PI))) * 0.4;
        L.ankle.rotation.x = 0.9;
      }
      for (const A of this.arms) {
        const c = sw % (Math.PI * 2);
        const reach = Math.sin(sw) * 0.5 + 0.5;
        A.sh.rotation.set(-2.6 + reach * 1.6, 0, A.side * (0.3 + (1 - reach) * 0.9));
        A.el.rotation.x = 0.2 + (1 - reach) * 1.2;
        A.wr.rotation.x = 0;
      }
      this.armsVisible(!s.handsActive);
      return;
    }
    this.pelvis.position.y = pelvisY;
    this.pelvis.rotation.x = 0;
    this.spine.rotation.x = this.lean;
    this.torso.scale.set(1, 1 + Math.sin(this.t * 1.6) * 0.008, 1 + Math.sin(this.t * 1.6) * 0.012);

    for (const L of this.legs) {
      const ph = phase + (L.side > 0 ? Math.PI : 0);
      let stride = (0.2 + sp * 0.32) * walkK, lift = (0.07 + sp * 0.14) * walkK;
      if (this.crouchBlend > 0.5) { stride *= 0.7; lift *= 0.6; }
      let fwd = Math.cos(ph) * stride + this.crouchBlend * 0.12;
      let down = pelvisY - 0.05 - ANKLE - Math.max(0, -Math.sin(ph)) * lift;
      if (s.climbing) { fwd = 0.22; down = pelvisY - 0.05 - ANKLE - (Math.sin(this.t * 4 + (L.side > 0 ? Math.PI : 0)) * 0.5 + 0.5) * 0.3; }
      if (!s.onGround && !s.climbing) { fwd = 0.08; down -= 0.08; }
      this.solveLeg(L, fwd, down, 0.03 + this.crouchBlend * 0.08);
    }
    for (const A of this.arms) {
      const ph = phase + (A.side > 0 ? 0 : Math.PI);
      let swing = Math.cos(ph) * (0.25 + sp * 0.55) * walkK;
      let elbow = 0.15 + sp * 0.9 + this.crouchBlend * 0.3;
      if (s.climbing) { swing = -2.5 + Math.sin(this.t * 4 + (A.side > 0 ? 0 : Math.PI)) * 0.3; elbow = 0.4; }
      A.sh.rotation.set(swing - this.lean * 0.6 + Math.sin(this.t * 1.6) * 0.01, 0, A.side * 0.08);
      A.el.rotation.x = elbow; A.wr.rotation.x = 0.1;
    }
    this.armsVisible(!s.handsActive);
  }

  armsVisible(v) { for (const A of this.arms) A.el.visible = v; }
}
