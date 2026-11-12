// Reusable props: fire, lamps, chairs and small pick-up-able objects.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mesh, rbox, boxGeo, Spring } from './kit.js';
import { mulberry32 } from '../core/noise.js';

// --------------------------------------------------------------------- fire --
const flameVert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const flameFrag = `
uniform float uTime; uniform float uLevel; uniform float uSeed; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<4;i++){ s+=a*n(p); p*=2.1; a*=0.5;} return s; }
void main(){
  vec2 uv = vUv;
  float t = uTime * 1.6 + uSeed * 10.0;
  float nz = fbm(vec2(uv.x * 4.0 + uSeed * 3.0, uv.y * 3.0 - t * 1.8));
  float w = (1.0 - uv.y) * 0.42 * (0.4 + uLevel * 0.6) + 0.02;
  float d = abs(uv.x - 0.5 + (nz - 0.5) * 0.35 * uv.y);
  float top = 0.35 + uLevel * 0.6;
  float f = smoothstep(w, w * 0.2, d) * smoothstep(top, top * 0.25, uv.y + (nz - 0.5) * 0.45) * smoothstep(0.0, 0.1, uv.y);
  vec3 col = mix(vec3(0.9, 0.18, 0.02), vec3(1.0, 0.75, 0.3), smoothstep(0.25, 0.85, f));
  col = mix(col, vec3(1.0, 0.95, 0.8), smoothstep(0.85, 1.0, f) * (1.0 - uv.y));
  gl_FragColor = vec4(col * f * 2.2 * uLevel, f * uLevel);
}`;

export class Fire {
  /** pos: base of the fire; opts: { lightPos, intensity, smoke: Vector3|null } */
  constructor(ctx, parent, pos, { scale = 1, intensity = 12, lightOffset = new THREE.Vector3(0.3, 0.45, 0), smokeAt = null, startOn = false } = {}) {
    this.ctx = ctx; this.level = 0; this.target = startOn ? 1 : 0; this.on = startOn;
    this.group = new THREE.Group(); this.group.position.copy(pos); parent.add(this.group);
    this.u = { uTime: { value: 0 }, uLevel: { value: 0 } };
    this.flames = [];
    for (let i = 0; i < 4; i++) {
      const mat = new THREE.ShaderMaterial({ uniforms: { ...this.u, uSeed: { value: i * 0.37 } }, vertexShader: flameVert, fragmentShader: flameFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.55 * scale, 0.75 * scale), mat);
      m.position.set((i - 1.5) * 0.06 * scale, 0.36 * scale, (i % 2 - 0.5) * 0.08 * scale);
      m.rotation.y = (i / 4) * Math.PI;
      m.renderOrder = 5;
      this.group.add(m); this.flames.push(m);
    }
    // logs
    const r = mulberry32(9);
    this.logMat = new THREE.MeshStandardMaterial({ map: ctx.T.bark.map, normalMap: ctx.T.bark.normalMap, roughness: 1, emissive: 0xff4010, emissiveIntensity: 0 });
    for (let i = 0; i < 4; i++) {
      const l = mesh(new THREE.CylinderGeometry(0.06 * scale, 0.07 * scale, 0.55 * scale, 7), this.logMat, 0, 0.07 * scale + (i > 1 ? 0.09 * scale : 0), 0, this.group);
      l.rotation.z = Math.PI / 2; l.rotation.y = i * 1.2 + r(); l.rotation.x = (r() - 0.5) * 0.3;
    }
    // embers
    const n = 40, seeds = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { seeds[i * 3] = r(); seeds[i * 3 + 1] = r(); seeds[i * 3 + 2] = r(); }
    const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(seeds, 3));
    this.emberMat = new THREE.ShaderMaterial({
      uniforms: { ...this.u, uScale: { value: scale } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `uniform float uTime; uniform float uLevel; uniform float uScale; varying float vA;
        void main(){ vec3 s = position; float life = fract(s.y + uTime * (0.25 + s.z * 0.3));
          vec3 p = vec3((s.x - 0.5) * 0.4 + sin(uTime * 2.0 + s.z * 20.0) * 0.08 * life, life * 1.4, (s.z - 0.5) * 0.3) * uScale;
          vA = (1.0 - life) * uLevel; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = 30.0 * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(1.0, 0.5, 0.15, smoothstep(0.5, 0.0, d) * vA); }`,
    });
    const em = new THREE.Points(eg, this.emberMat); em.frustumCulled = false; this.group.add(em);
    // light
    this.light = new THREE.PointLight(0xff8a3a, 0, 9 * scale + 3, 1.6);
    this.light.position.copy(lightOffset);
    this.light.castShadow = false;
    this.group.add(this.light);
    this.baseI = intensity;
    const wp = new THREE.Vector3(); this.group.getWorldPosition(wp);
    this.sound = ctx.audio?.fire(wp.clone().add(new THREE.Vector3(0, 0.3, 0)));
    // chimney smoke
    if (smokeAt) this.smoke = makeSmoke(ctx.scene, smokeAt, this.u);
  }
  toggle() {
    this.on = !this.on; this.target = this.on ? 1 : 0;
    const p = new THREE.Vector3(); this.group.getWorldPosition(p);
    if (this.on) this.ctx.audio?.match(p);
    return this.on;
  }
  update(dt, t) {
    this.level += (this.target - this.level) * Math.min(1, dt * (this.on ? 0.6 : 0.35));
    this.u.uTime.value = t; this.u.uLevel.value = this.level;
    const flick = 0.82 + Math.sin(t * 13.1) * 0.06 + Math.sin(t * 7.3 + 1) * 0.08 + Math.sin(t * 23.7) * 0.04;
    this.light.intensity = this.baseI * this.level * flick;
    this.logMat.emissiveIntensity = this.level * (0.7 + flick * 0.5) + (this.on ? 0 : this.level * 0.5);
    this.flames.forEach((f) => (f.visible = this.level > 0.02));
    this.sound?.set(this.level);
  }
}

function makeSmoke(scene, at, u) {
  const n = 36, s = new Float32Array(n * 3), r = mulberry32(4);
  for (let i = 0; i < n; i++) { s[i * 3] = r(); s[i * 3 + 1] = r(); s[i * 3 + 2] = r(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(s, 3));
  const m = new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false,
    vertexShader: `uniform float uTime; uniform float uLevel; varying float vA;
      void main(){ vec3 s = position; float life = fract(s.y + uTime * 0.07);
        vec3 p = vec3((s.x - 0.5) * 0.5 + life * life * 4.0, life * 9.0, (s.z - 0.5) * 0.5 + sin(uTime*0.3 + s.x*6.0) * life);
        vA = smoothstep(0.0, 0.1, life) * (1.0 - life) * uLevel * 0.35; vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (200.0 + life * 900.0) / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.55), smoothstep(0.5, 0.1, d) * vA); }`,
  });
  const p = new THREE.Points(g, m); p.position.copy(at); p.frustumCulled = false; scene.add(p);
  return p;
}

// --------------------------------------------------------------------- lamp --
export class Lamp {
  constructor(ctx, light, emissives, { intensity = 8, on = false, label = 'lamp' } = {}) {
    this.ctx = ctx; this.light = light; this.emissives = emissives; this.max = intensity; this.on = on; this.label = label;
    this.v = on ? 1 : 0; this.flicker = 0;
    light.intensity = this.v * intensity;
  }
  toggle(pos) {
    this.on = !this.on; this.flicker = this.on ? 0.25 : 0;
    this.ctx.audio?.lightSwitch(pos || this.light.getWorldPosition(new THREE.Vector3()));
    return this.on;
  }
  update(dt) {
    const target = this.on ? 1 : 0;
    this.v += (target - this.v) * Math.min(1, dt * (this.on ? 14 : 9));
    let f = 1;
    if (this.flicker > 0) { this.flicker -= dt; f = Math.random() < 0.5 ? 0.35 : 1; }
    this.light.intensity = this.v * this.max * f;
    for (const [m, k] of this.emissives) m.emissiveIntensity = this.v * k * f;
  }
}

// ------------------------------------------------------------------ objects --
export function mugGeo() {
  const body = new THREE.CylinderGeometry(0.045, 0.04, 0.1, 18, 1, false); body.translate(0, 0.05, 0);
  const handle = new THREE.TorusGeometry(0.03, 0.009, 6, 12, Math.PI); handle.rotateZ(-Math.PI / 2); handle.translate(0.045, 0.05, 0);
  return mergeGeometries([body.toNonIndexed(), handle.toNonIndexed()]);
}

export function makeBook(mat, w = 0.15, h = 0.22, d = 0.035) {
  const g = new THREE.Group();
  const cover = new THREE.Mesh(rbox(w, h, d, 0.004, 1), mat);
  const pages = new THREE.Mesh(new THREE.BoxGeometry(w - 0.01, h - 0.012, d - 0.006), new THREE.MeshStandardMaterial({ color: 0xeee4cc, roughness: 0.9 }));
  pages.position.x = 0.006;
  cover.castShadow = pages.castShadow = true;
  g.add(cover, pages);
  return g;
}

export function appleGeo(r = 0.038) {
  const g = new THREE.SphereGeometry(r, 16, 12);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) / r; const k = 1 - 0.18 * Math.exp(-((y - 1) ** 2) * 10) - 0.1 * Math.exp(-((y + 1) ** 2) * 10); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); p.setY(i, p.getY(i) * 0.9); }
  g.computeVertexNormals();
  return g;
}

export function kettle(M) {
  const g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(new THREE.Vector2(0.03 + Math.sin(t * Math.PI) * 0.085 + (1 - t) * 0.02, t * 0.17)); }
  const body = mesh(new THREE.LatheGeometry(pts, 20), M.steel, 0, 0, 0, g);
  const spout = mesh(new THREE.CylinderGeometry(0.008, 0.016, 0.12, 8), M.steel, 0.1, 0.09, 0, g); spout.rotation.z = -0.9;
  const handle = mesh(new THREE.TorusGeometry(0.06, 0.008, 6, 14, Math.PI), M.black, 0, 0.17, 0, g);
  mesh(new THREE.SphereGeometry(0.012, 8, 6), M.black, 0, 0.19, 0, g);
  body.castShadow = true;
  return g;
}

export function lanternModel(M, ctx) {
  const g = new THREE.Group();
  mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.04, 14), M.iron, 0, 0.02, 0, g);
  mesh(new THREE.CylinderGeometry(0.05, 0.075, 0.03, 14), M.iron, 0, 0.23, 0, g);
  mesh(new THREE.ConeGeometry(0.05, 0.05, 14), M.iron, 0, 0.27, 0, g);
  const glass = mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.17, 14, 1, true), M.glass, 0, 0.125, 0, g, { cast: false });
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.19, 4), M.iron, Math.cos(a) * 0.065, 0.125, Math.sin(a) * 0.065, g); }
  const h = mesh(new THREE.TorusGeometry(0.05, 0.004, 5, 14, Math.PI), M.iron, 0, 0.3, 0, g);
  const flameMat = new THREE.MeshStandardMaterial({ color: 0xffc070, emissive: 0xffa040, emissiveIntensity: 3 });
  const flame = mesh(new THREE.SphereGeometry(0.014, 8, 6), flameMat, 0, 0.1, 0, g, { cast: false }); flame.scale.y = 2.2;
  const light = new THREE.PointLight(0xffa850, 2.2, 7, 1.7); light.position.set(0, 0.12, 0); g.add(light);
  g.userData.flame = flame; g.userData.light = light;
  glass.castShadow = false; h.castShadow = false;
  return g;
}

export function pineconeGeo(seed = 0) {
  const parts = [];
  const r = mulberry32(seed + 3);
  for (let i = 0; i < 26; i++) {
    const t = i / 26;
    const s = new THREE.ConeGeometry(0.012, 0.022, 4); s.rotateX(Math.PI / 2 + 0.6);
    const a = i * 2.4, rad = Math.sin(t * Math.PI) * 0.022 + 0.006;
    s.rotateY(-a); s.translate(Math.sin(a) * rad, t * 0.085, Math.cos(a) * rad);
    parts.push(s.toNonIndexed());
  }
  const core = new THREE.CylinderGeometry(0.012, 0.01, 0.085, 6); core.translate(0, 0.0425, 0);
  parts.push(core.toNonIndexed());
  const g = mergeGeometries(parts); g.computeVertexNormals();
  g.rotateZ(Math.PI / 2 * (r() > 0.5 ? 1 : 0.9));
  return g;
}

export function pebbleGeo(seed, size = 0.07) {
  const g = new THREE.IcosahedronGeometry(size, 2);
  const p = g.attributes.position, r = mulberry32(seed);
  const sx = 0.8 + r() * 0.5, sy = 0.45 + r() * 0.25, sz = 0.7 + r() * 0.4;
  for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * sx, p.getY(i) * sy, p.getZ(i) * sz);
  g.computeVertexNormals();
  return g;
}

/** A simple wooden chair in local space facing -Z. */
export function chair(M, parent, x, y, z, yaw) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = yaw; parent.add(g);
  mesh(rbox(0.44, 0.04, 0.42, 0.01), M.oak, 0, 0.45, 0, g);
  for (const [lx, lz] of [[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]]) mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.45, 8), M.oak, lx, 0.225, lz, g);
  for (const lx of [-0.19, 0.19]) mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.5, 8), M.oak, lx, 0.7, 0.19, g);
  for (let i = 0; i < 3; i++) mesh(boxGeo(0.38, 0.05, 0.02), M.oak, 0, 0.62 + i * 0.13, 0.19, g);
  return g;
}

export { Spring };
