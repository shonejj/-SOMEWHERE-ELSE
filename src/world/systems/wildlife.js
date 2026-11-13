// Living things: deer, birds, ducks, fish, fireflies and rain rings on the lake.
import * as THREE from 'three';
import { mulberry32 } from '../core/noise.js';
import { WATER_LEVEL, LAKE, CABIN, WORLD_RADIUS, DOCK } from '../core/layout.js';
import { lakeE } from '../env/terrain.js';

const rnd = mulberry32(4242);
const v3 = () => new THREE.Vector3();

function deerModel() {
  const g = new THREE.Group();
  const coat = new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.9 });
  const light = new THREE.MeshStandardMaterial({ color: 0xcdb08a, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.5 });
  const add = (geo, mat, x, y, z, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const body = add(new THREE.SphereGeometry(0.5, 16, 12), coat, 0, 1.0, 0); body.scale.set(0.62, 0.62, 1.25);
  const belly = add(new THREE.SphereGeometry(0.45, 12, 10), light, 0, 0.92, 0); belly.scale.set(0.55, 0.5, 1.15);
  const neckPivot = new THREE.Group(); neckPivot.position.set(0, 1.18, -0.48); g.add(neckPivot);
  const neck = add(new THREE.CylinderGeometry(0.1, 0.15, 0.6, 10), coat, 0, 0.25, -0.08, neckPivot); neck.rotation.x = -0.45;
  const head = new THREE.Group(); head.position.set(0, 0.55, -0.22); neckPivot.add(head);
  const skull = add(new THREE.SphereGeometry(0.13, 12, 10), coat, 0, 0, 0, head); skull.scale.set(0.9, 0.9, 1.3);
  const snout = add(new THREE.ConeGeometry(0.075, 0.24, 10), coat, 0, -0.04, -0.2, head); snout.rotation.x = -Math.PI / 2 - 0.2;
  add(new THREE.SphereGeometry(0.03, 6, 6), dark, 0, -0.07, -0.31, head);
  for (const s of [-1, 1]) {
    const ear = add(new THREE.ConeGeometry(0.05, 0.16, 6), coat, s * 0.09, 0.12, 0.05, head); ear.rotation.z = -s * 0.7; ear.scale.z = 0.4;
    add(new THREE.SphereGeometry(0.02, 6, 6), dark, s * 0.08, 0.03, -0.08, head);
  }
  const tail = add(new THREE.ConeGeometry(0.06, 0.18, 8), light, 0, 1.08, 0.62); tail.rotation.x = 2.4;
  const legs = [];
  for (const [x, z] of [[-0.17, -0.42], [0.17, -0.42], [-0.17, 0.45], [0.17, 0.45]]) {
    const hip = new THREE.Group(); hip.position.set(x, 0.95, z); g.add(hip);
    const up = add(new THREE.CylinderGeometry(0.06, 0.045, 0.45, 8), coat, 0, -0.22, 0, hip);
    const knee = new THREE.Group(); knee.position.set(0, -0.44, 0); hip.add(knee);
    add(new THREE.CylinderGeometry(0.035, 0.025, 0.48, 6), coat, 0, -0.24, 0, knee);
    add(new THREE.SphereGeometry(0.035, 6, 4), dark, 0, -0.48, 0, knee);
    legs.push({ hip, knee });
  }
  g.userData = { legs, neckPivot, head, tail };
  return g;
}

function birdModel(mat) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), mat); body.scale.set(0.7, 0.6, 1.6); g.add(body);
  const wg = new THREE.BufferGeometry();
  wg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -0.05, 0.28, 0, 0.02, 0, 0, 0.07], 3)); wg.computeVertexNormals();
  const wings = [];
  for (const s of [-1, 1]) { const w = new THREE.Mesh(wg, mat); w.scale.x = s; g.add(w); wings.push(w); }
  g.userData.wings = wings;
  return g;
}

function duckModel() {
  const g = new THREE.Group();
  const brown = new THREE.MeshStandardMaterial({ color: 0x6a5240, roughness: 0.8 });
  const green = new THREE.MeshStandardMaterial({ color: 0x1f4a2a, roughness: 0.4 });
  const yel = new THREE.MeshStandardMaterial({ color: 0xd8a020, roughness: 0.5 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8), brown); b.scale.set(0.8, 0.6, 1.3); b.position.y = 0.05; g.add(b);
  const h = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), green); h.position.set(0, 0.2, -0.15); g.add(h);
  const k = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 6), yel); k.rotation.x = -Math.PI / 2; k.position.set(0, 0.19, -0.24); g.add(k);
  const t = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 6), brown); t.rotation.x = 2.2; t.position.set(0, 0.1, 0.2); g.add(t);
  g.userData.head = h;
  return g;
}

export class Wildlife {
  constructor(ctx) {
    this.ctx = ctx;
    const { scene, terrain } = ctx;
    this.h = (x, z) => terrain.heightAt(x, z);
    // deer
    this.deer = [];
    const homes = [[22, -8], [-26, 8], [36, 20]];
    for (let i = 0; i < 4; i++) {
      const m = deerModel(); const [hx, hz] = homes[i % homes.length];
      const d = { m, pos: new THREE.Vector3(hx + rnd() * 8, 0, hz + rnd() * 8), yaw: rnd() * 6, state: 'graze', t: 3 + rnd() * 5, target: new THREE.Vector3(), speed: 0, phase: rnd() * 6, home: new THREE.Vector2(hx, hz), head: 0 };
      if (i === 3) d.m.scale.setScalar(0.75); // a fawn
      scene.add(m); this.deer.push(d);
    }
    // birds
    const birdMat = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.8, side: THREE.DoubleSide });
    this.birds = [];
    for (let i = 0; i < 11; i++) { const b = birdModel(birdMat); scene.add(b); this.birds.push({ m: b, off: new THREE.Vector3((rnd() - 0.5) * 8, (rnd() - 0.5) * 3, (rnd() - 0.5) * 8), ph: rnd() * 6, glide: 0 }); }
    this.flockT = 0; this.flockAlt = 0;
    // ducks
    this.ducks = [];
    for (let i = 0; i < 3; i++) { const d = duckModel(); scene.add(d); this.ducks.push({ m: d, a: rnd() * 6, r: 6 + rnd() * 8, c: new THREE.Vector2(DOCK.x + 6 + i * 3, 40 + i * 4), sp: 0.04 + rnd() * 0.03, quack: 8 + rnd() * 20 }); }
    // fireflies
    const n = 140, seeds = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let x, z, tries = 0;
      do { x = (rnd() - 0.5) * 80; z = rnd() * 50 - 8; tries++; } while ((this.h(x, z) < WATER_LEVEL + 0.2 || (Math.abs(x) < 7 && z > -4 && z < 7)) && tries < 20);
      seeds[i * 3] = x; seeds[i * 3 + 1] = this.h(x, z) + 0.4 + rnd() * 1.6; seeds[i * 3 + 2] = z;
    }
    const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(seeds, 3));
    this.flyU = { uTime: { value: 0 }, uAmount: { value: 0 } };
    this.flies = new THREE.Points(fg, new THREE.ShaderMaterial({
      uniforms: this.flyU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `uniform float uTime; uniform float uAmount; varying float vA;
        void main(){ vec3 p = position; float s = p.x * 1.7 + p.z * 2.3;
          p += vec3(sin(uTime * 0.31 + s) * 1.6, sin(uTime * 0.53 + s * 1.3) * 0.5, cos(uTime * 0.27 + s * 0.7) * 1.6);
          float blink = smoothstep(0.55, 1.0, sin(uTime * (0.8 + fract(s) * 1.4) + s * 5.0));
          vA = blink * uAmount; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = 90.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(0.75, 1.0, 0.35, smoothstep(0.5, 0.0, d) * vA); }`,
    }));
    this.flies.frustumCulled = false; scene.add(this.flies);
    // ripple rings (rain + fish)
    this.rings = [];
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xcfe0ea, transparent: true, opacity: 0, depthWrite: false });
    const rg = new THREE.RingGeometry(0.9, 1.0, 24); rg.rotateX(-Math.PI / 2);
    for (let i = 0; i < 70; i++) { const m = new THREE.Mesh(rg, ringMat.clone()); m.visible = false; scene.add(m); this.rings.push({ m, life: 0, size: 1 }); }
    this.ringIdx = 0;
    // a fish
    this.fish = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 6), new THREE.MeshStandardMaterial({ color: 0x8a9a8a, roughness: 0.3, metalness: 0.4 }));
    this.fish.scale.set(0.5, 0.7, 2.2); this.fish.visible = false; scene.add(this.fish);
    this.fishT = 8; this.fishJump = null;

    // butterflies over the meadow
    const wingG = new THREE.BufferGeometry();
    wingG.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.012, 0.05, 0, 0.03, 0.055, 0, -0.005, 0, 0, -0.012, 0.04, 0, -0.035], 3));
    wingG.setIndex([0, 1, 2, 0, 2, 3, 3, 2, 4]); wingG.computeVertexNormals();
    const bcols = [0xe8902a, 0xf2efe0, 0x5a8ad8, 0xf0d040];
    this.butterflies = [];
    for (let i = 0; i < 16; i++) {
      const g = new THREE.Group();
      const m = new THREE.MeshStandardMaterial({ color: bcols[i % 4], side: THREE.DoubleSide, roughness: 0.6, emissive: bcols[i % 4], emissiveIntensity: 0.08 });
      const wl = new THREE.Mesh(wingG, m), wr = new THREE.Mesh(wingG, m); wr.scale.x = -1;
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.004, 0.025, 2, 4), new THREE.MeshStandardMaterial({ color: 0x1a1410 })); body.rotation.x = Math.PI / 2;
      g.add(wl, wr, body); scene.add(g);
      const a = rnd() * 6.28, r = 9 + rnd() * 25;
      this.butterflies.push({ g, wl, wr, home: new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r * 0.7 + 6), ph: rnd() * 10, sp: 0.6 + rnd() * 0.5, rest: 0 });
    }
    // dragonflies by the shore
    this.dragonflies = [];
    const dwing = new THREE.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, roughness: 0.1, depthWrite: false });
    const dbody = new THREE.MeshStandardMaterial({ color: 0x1f6a7a, metalness: 0.6, roughness: 0.3 });
    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group();
      const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.005, 0.07, 2, 5), dbody); b.rotation.x = Math.PI / 2; g.add(b);
      const wings = [];
      for (const z of [-0.008, 0.008]) for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.012), dwing); w.position.set(sx * 0.03, 0.003, z); w.rotation.x = -Math.PI / 2; g.add(w); wings.push(w); }
      scene.add(g);
      const a = rnd() * 6.28;
      this.dragonflies.push({ g, wings, a, pos: new THREE.Vector3(LAKE.x + Math.cos(a) * LAKE.rx * 0.97, WATER_LEVEL + 0.4, LAKE.z + Math.sin(a) * LAKE.rz * 0.97), target: new THREE.Vector3(), t: 0 });
    }
    // drifting leaves around the viewer
    const nLeaves = 70;
    const lg = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(0.06, 0.04));
    const lseeds = new Float32Array(nLeaves * 4); for (let i = 0; i < nLeaves * 4; i++) lseeds[i] = rnd();
    lg.setAttribute('aSeed', new THREE.InstancedBufferAttribute(lseeds, 4)); lg.instanceCount = nLeaves;
    this.leafU = { uCam: { value: new THREE.Vector3() }, uTime: { value: 0 }, uWind: { value: 0 }, uAmount: { value: 1 } };
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xb08a3a, side: THREE.DoubleSide, roughness: 0.8 });
    leafMat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, this.leafU);
      sh.vertexShader = 'uniform vec3 uCam; uniform float uTime; uniform float uWind; uniform float uAmount; attribute vec4 aSeed; varying vec3 vTint;\n' + sh.vertexShader.replace('#include <begin_vertex>', `
        float B = 24.0, Hh = 9.0;
        float fall = mod(aSeed.y * Hh + uTime * (0.35 + aSeed.w * 0.3), Hh);
        vec3 c;
        c.y = uCam.y + 6.0 - fall;
        c.x = uCam.x + mod(aSeed.x * B + uTime * uWind * 1.8 + sin(uTime * 0.8 + aSeed.z * 9.0) * 0.6 - uCam.x, B) - B * 0.5;
        c.z = uCam.z + mod(aSeed.z * B + sin(uTime * 0.6 + aSeed.x * 7.0) * 0.6 - uCam.z, B) - B * 0.5;
        float a1 = uTime * (1.5 + aSeed.w * 3.0) + aSeed.x * 6.28, a2 = uTime * (1.1 + aSeed.y * 2.0);
        vec3 p = position;
        p.yz = mat2(cos(a1), -sin(a1), sin(a1), cos(a1)) * p.yz;
        p.xy = mat2(cos(a2), -sin(a2), sin(a2), cos(a2)) * p.xy;
        float hide = step(uAmount, aSeed.w) + ((abs(c.x) < 6.8 && abs(c.z) < 4.2) ? 1.0 : 0.0);
        vec3 transformed = c + p * (1.0 - min(hide, 1.0));
        vTint = mix(vec3(0.9, 0.55, 0.2), vec3(0.6, 0.65, 0.2), aSeed.z);`);
      sh.fragmentShader = 'varying vec3 vTint;\n' + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= vTint * 1.4;');
    };
    leafMat.customProgramCacheKey = () => 'leaves-fall';
    this.leaves = new THREE.Mesh(lg, leafMat); this.leaves.frustumCulled = false; scene.add(this.leaves);
  }

  ring(x, z, size = 1, alpha = 0.5) {
    const r = this.rings[this.ringIdx = (this.ringIdx + 1) % this.rings.length];
    r.m.position.set(x, WATER_LEVEL + 0.01, z); r.life = 1; r.size = size; r.alpha = alpha; r.m.visible = true;
  }

  update(dt, t, player, sky, weather, audio) {
    const w = weather.w, day = sky.state.daylight, pp = player.pos;
    this.updateSmall(dt, t, pp, day, w);
    // ----------------------------------------------------------- deer
    for (const d of this.deer) {
      const dist = Math.hypot(d.pos.x - pp.x, d.pos.z - pp.z);
      d.t -= dt;
      const crouchQuiet = player.crouching ? 0.55 : 1;
      if (d.state !== 'flee' && dist < 11 * crouchQuiet && !(player.mode === 'seat')) {
        d.state = 'flee'; d.t = 3 + rnd() * 2;
        const a = Math.atan2(d.pos.x - pp.x, d.pos.z - pp.z) + (rnd() - 0.5) * 0.8;
        d.target.set(d.pos.x + Math.sin(a) * 30, 0, d.pos.z + Math.cos(a) * 30);
        audio?.noiseHit(d.pos, { buf: audio.pink, type: 'bandpass', f: 900, q: 1, a: 0.01, d: 0.25, v: 0.3, ref: 4 });
      } else if ((d.state === 'graze' || d.state === 'walk') && dist < 22 && rnd() < dt * 0.4) {
        d.state = 'alert'; d.t = 2 + rnd() * 3;
      } else if (d.t <= 0) {
        if (d.state === 'graze' || d.state === 'flee' || d.state === 'alert') {
          d.state = 'walk'; d.t = 6 + rnd() * 8;
          if (d.state === 'alert') d.state = 'graze';
          for (let k = 0; k < 10; k++) {
            const a = rnd() * 6.28, r = 4 + rnd() * 14;
            const x = d.home.x + Math.cos(a) * r, z = d.home.y + Math.sin(a) * r;
            if (this.h(x, z) > WATER_LEVEL + 0.4 && Math.hypot(x - CABIN.x, z - CABIN.z) > 14) { d.target.set(x, 0, z); break; }
          }
        } else { d.state = 'graze'; d.t = 5 + rnd() * 9; }
      }
      let speed = 0;
      if (d.state === 'walk' || d.state === 'flee') {
        const dx = d.target.x - d.pos.x, dz = d.target.z - d.pos.z, l = Math.hypot(dx, dz);
        if (l < 0.5) { d.state = 'graze'; d.t = 4 + rnd() * 6; }
        else {
          speed = d.state === 'flee' ? 6.5 : 1.0;
          const ty = Math.atan2(-dx, -dz);
          let dy = ty - d.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
          d.yaw += dy * Math.min(1, dt * (d.state === 'flee' ? 5 : 2));
          const nx = d.pos.x - Math.sin(d.yaw) * speed * dt, nz = d.pos.z - Math.cos(d.yaw) * speed * dt;
          if (this.h(nx, nz) > WATER_LEVEL + 0.2 && Math.hypot(nx, nz) < WORLD_RADIUS - 5) { d.pos.x = nx; d.pos.z = nz; } else { d.state = 'graze'; d.t = 2; }
        }
      }
      d.speed += (speed - d.speed) * Math.min(1, dt * 4);
      d.pos.y = this.h(d.pos.x, d.pos.z);
      const m = d.m, U = m.userData;
      m.position.copy(d.pos);
      m.rotation.y = d.yaw;
      // gait
      d.phase += dt * (d.speed > 3 ? d.speed * 1.5 : d.speed * 4.5);
      const gallop = d.speed > 3;
      U.legs.forEach((L, i) => {
        const off = gallop ? (i < 2 ? 0 : Math.PI * 0.8) + (i % 2) * 0.3 : [0, Math.PI, Math.PI * 0.5, Math.PI * 1.5][i];
        const amp = Math.min(1, d.speed / 1.0) * (gallop ? 0.7 : 0.35);
        const s = Math.sin(d.phase + off);
        L.hip.rotation.x = s * amp; L.knee.rotation.x = Math.max(0, -Math.cos(d.phase + off)) * amp * 1.4;
      });
      const headTarget = d.state === 'graze' ? 1.3 : d.state === 'alert' ? -0.25 : gallop ? 0.2 : 0.1;
      d.head += (headTarget - d.head) * Math.min(1, dt * 2.5);
      U.neckPivot.rotation.x = d.head + (d.state === 'graze' ? Math.sin(t * 3 + d.phase) * 0.05 : 0);
      if (d.state === 'alert') { const a = Math.atan2(-(pp.x - d.pos.x), -(pp.z - d.pos.z)) - d.yaw; U.neckPivot.rotation.y = Math.max(-1, Math.min(1, Math.atan2(Math.sin(a), Math.cos(a)))); }
      else U.neckPivot.rotation.y *= 0.95;
      U.tail.rotation.x = 2.4 + (d.state === 'flee' ? -0.8 : Math.sin(t * 6) * 0.1);
      m.position.y += gallop ? Math.abs(Math.sin(d.phase)) * 0.12 : 0;
      m.visible = dist < 160;
    }

    // ---------------------------------------------------------- birds
    const birdsOut = day > 0.3 && w.rain < 0.55;
    this.flockAlt += ((birdsOut ? 1 : 0) - this.flockAlt) * Math.min(1, dt * 0.15);
    this.flockT += dt * 0.05;
    const c = new THREE.Vector3(LAKE.x + Math.sin(this.flockT) * 40, 14 + Math.sin(this.flockT * 2.3) * 4 + (1 - this.flockAlt) * 120, LAKE.z - 10 + Math.sin(this.flockT * 1.7) * 30);
    const dir = new THREE.Vector3(Math.cos(this.flockT) * 40 * 0.05, 0, Math.cos(this.flockT * 1.7) * 30 * 1.7 * 0.05).normalize();
    for (const b of this.birds) {
      b.ph += dt * (b.glide > 0 ? 2 : 14);
      if (rnd() < dt * 0.3) b.glide = 1.5; b.glide -= dt;
      const flap = b.glide > 0 ? 0.15 : Math.sin(b.ph) * 0.9;
      b.m.userData.wings.forEach((wg, i) => (wg.rotation.z = (i ? -1 : 1) * flap));
      const tgt = c.clone().add(b.off).add(new THREE.Vector3(Math.sin(t * 0.7 + b.ph) * 1.5, Math.sin(t * 0.9 + b.ph * 2) * 0.8, Math.cos(t * 0.6 + b.ph) * 1.5));
      b.m.position.lerp(tgt, Math.min(1, dt * 1.5));
      b.m.rotation.y = Math.atan2(-dir.x, -dir.z);
      b.m.visible = this.flockAlt > 0.02;
    }

    // ---------------------------------------------------------- ducks
    for (const d of this.ducks) {
      d.a += dt * d.sp;
      const x = d.c.x + Math.cos(d.a) * d.r, z = d.c.y + Math.sin(d.a * 1.3) * d.r * 0.6;
      const nx = d.c.x + Math.cos(d.a + 0.05) * d.r, nz = d.c.y + Math.sin((d.a + 0.05) * 1.3) * d.r * 0.6;
      d.m.position.set(x, WATER_LEVEL + Math.sin(t * 2 + d.a * 10) * 0.01, z);
      d.m.rotation.y = Math.atan2(-(nx - x), -(nz - z));
      d.m.userData.head.position.y = 0.2 + Math.max(0, Math.sin(t * 0.7 + d.r)) * 0.02;
      d.quack -= dt;
      if (d.quack < 0) {
        d.quack = 12 + rnd() * 30;
        if (day > 0.2 && audio) for (let i = 0; i < 2 + Math.floor(rnd() * 3); i++) audio.tone(d.m.position, { f: 520 + rnd() * 60, type: 'sawtooth', a: 0.01, d: 0.12, v: 0.05, slide: 0.7, delay: i * 0.18, ref: 6 });
      }
      if (rnd() < dt * 0.4) this.ring(x, z + 0.2, 0.25, 0.25);
    }

    // ------------------------------------------------------ fireflies
    this.flyU.uTime.value = t;
    const flyTarget = (1 - day) * (1 - Math.min(1, w.rain * 3)) * (1 - w.fog * 0.5);
    this.flyU.uAmount.value += (flyTarget - this.flyU.uAmount.value) * Math.min(1, dt * 0.3);
    this.flies.visible = this.flyU.uAmount.value > 0.01;

    for (const r of this.rings) {
      if (r.life <= 0) continue;
      r.life -= dt * 1.2;
      const s = r.size * (1.6 - r.life * 1.2);
      r.m.scale.set(s, 1, s);
      r.m.material.opacity = Math.max(0, r.life) * r.alpha;
      if (r.life <= 0) r.m.visible = false;
    }

    // ----------------------------------------------------------- fish
    this.fishT -= dt;
    if (this.fishT < 0 && !this.fishJump) {
      this.fishT = 12 + rnd() * 30;
      for (let k = 0; k < 8; k++) {
        const a = rnd() * 6.28, r = 8 + rnd() * 25;
        const x = pp.x + Math.cos(a) * r, z = pp.z + Math.sin(a) * r;
        if (this.h(x, z) < WATER_LEVEL - 0.8) { this.fishJump = { x, z, t: 0, yaw: rnd() * 6.28 }; break; }
      }
    }
    if (this.fishJump) {
      const f = this.fishJump; f.t += dt;
      const k = f.t / 0.7;
      if (f.t === dt) { this.ring(f.x, f.z, 0.5, 0.7); this.ctx.splashes?.burst({ x: f.x, z: f.z }, 0.6, 14); audio?.splash(new THREE.Vector3(f.x, WATER_LEVEL, f.z), 0.5); }
      this.fish.visible = k < 1;
      this.fish.position.set(f.x + Math.sin(f.yaw) * k * 0.8, WATER_LEVEL + Math.sin(k * Math.PI) * 0.6, f.z + Math.cos(f.yaw) * k * 0.8);
      this.fish.rotation.set(-Math.cos(k * Math.PI) * 1.0, f.yaw, 0);
      if (k >= 1) { this.ring(this.fish.position.x, this.fish.position.z, 0.6, 0.7); this.ctx.splashes?.burst(this.fish.position, 0.8, 18); audio?.splash(this.fish.position, 0.6); this.fishJump = null; this.fish.visible = false; }
    }
  }

  updateSmall(dt, t, pp, day, w) {
    const out = day > 0.35 && w.rain < 0.3;
    for (const b of this.butterflies) {
      b.g.visible = out && Math.hypot(b.home.x - pp.x, b.home.z - pp.z) < 70;
      if (!b.g.visible) continue;
      b.ph += dt * b.sp;
      const x = b.home.x + Math.sin(b.ph * 0.7) * 3 + Math.sin(b.ph * 1.9) * 0.8;
      const z = b.home.z + Math.cos(b.ph * 0.5) * 3 + Math.cos(b.ph * 2.3) * 0.8;
      const y = this.h(x, z) + 0.6 + Math.abs(Math.sin(b.ph * 1.3)) * 0.7;
      const prev = b.g.position.clone();
      b.g.position.set(x, y, z);
      b.g.rotation.y = Math.atan2(-(x - prev.x), -(z - prev.z));
      const f = Math.sin(t * 22 + b.ph * 10) * 1.1;
      b.wl.rotation.z = f; b.wr.rotation.z = -f;
    }
    for (const d of this.dragonflies) {
      d.g.visible = day > 0.3 && w.rain < 0.4 && Math.hypot(d.pos.x - pp.x, d.pos.z - pp.z) < 80;
      if (!d.g.visible) continue;
      d.t -= dt;
      if (d.t <= 0) { d.t = 0.4 + rnd() * 1.6; d.a += (rnd() - 0.5) * 0.15; const e = 0.9 + rnd() * 0.15; d.target.set(LAKE.x + Math.cos(d.a) * LAKE.rx * e, WATER_LEVEL + 0.25 + rnd() * 0.9, LAKE.z + Math.sin(d.a) * LAKE.rz * e); }
      const prev = d.g.position.clone();
      d.pos.lerp(d.target, Math.min(1, dt * 3));
      d.g.position.copy(d.pos);
      if (prev.distanceToSquared(d.pos) > 1e-6) d.g.rotation.y = Math.atan2(-(d.pos.x - prev.x), -(d.pos.z - prev.z));
      d.wings.forEach((wg, i) => (wg.rotation.y = Math.sin(t * 60 + i) * 0.4));
    }
    this.leafU.uCam.value.copy(pp); this.leafU.uTime.value = t; this.leafU.uWind.value = w.gust;
    this.leafU.uAmount.value = 0.15 + w.gust * 0.6;
  }

  /** Splash rings for thrown objects landing in the lake. */
  splashAt(p) { this.ring(p.x, p.z, 0.4, 0.7); }
}
