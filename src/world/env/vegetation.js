// Instanced forest: pines, birches, grass, ferns, flowers, rocks — all wind-animated.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32, fbm2, smoothstep } from '../core/noise.js';
import { WATER_LEVEL, CABIN, TREEHOUSE, CLEARING, DOCK, WORLD_RADIUS, LAKE, REGION } from '../core/layout.js';
import { pathDistance, forestDensity, lakeE } from './terrain.js';

export const windUniforms = { uTime: { value: 0 }, uWind: { value: 0.4 } };

/** Moss on upward-facing surfaces (rocks, fallen logs). */
export function addMoss(material, amount) {
  material.onBeforeCompile = (sh) => {
    sh.vertexShader = 'varying vec3 vWN;\n' + sh.vertexShader.replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = 'varying vec3 vWN;\n' + sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
      float mossN = fract(sin(dot(floor(vMapUv * 40.0), vec2(12.9898, 78.233))) * 43758.5453);
      float moss = smoothstep(0.35, 0.8, vWN.y + (mossN - 0.5) * 0.25) * ${amount.toFixed(2)};
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.22, 0.07) * (0.8 + mossN * 0.4), moss);`);
  };
  material.customProgramCacheKey = () => 'moss' + amount;
}

/** Injects a wind sway into a standard material. Works with instancing. */
export function addWind(material, strength, heightScale, key) {
  material.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = windUniforms.uTime; sh.uniforms.uWind = windUniforms.uWind;
    sh.vertexShader = 'uniform float uTime;\nuniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', `
      vec3 transformed = vec3(position);
      #ifdef USE_INSTANCING
        vec3 iPos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
      #else
        vec3 iPos = vec3(modelMatrix[3][0], modelMatrix[3][1], modelMatrix[3][2]);
      #endif
      float hh = max(position.y, 0.0) * ${heightScale.toFixed(3)};
      float ph = iPos.x * 0.07 + iPos.z * 0.05;
      float sway = sin(uTime * 1.2 + ph) * 0.6 + sin(uTime * 2.6 + ph * 1.7) * 0.3 + sin(uTime * 6.3 + ph * 3.1 + position.x * 5.0 + position.z * 3.0) * 0.18;
      float k = hh * hh * (uWind * 0.85 + 0.12) * ${strength.toFixed(3)};
      transformed.x += (sway + uWind * 0.9) * k;
      transformed.z += sin(uTime * 1.05 + ph * 1.3 + position.y) * 0.5 * k;
    `);
  };
  material.customProgramCacheKey = () => 'wind-' + key;
}

function cardGeometry(w, l) {
  // a card whose base is at origin, extending along +Y
  const g = new THREE.PlaneGeometry(w, l, 1, 2);
  g.translate(0, l / 2, 0);
  // slight curl
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) / l; p.setZ(i, -y * y * l * 0.25); }
  return g;
}

function sphericalNormals(geo, center, upBias = 0.5) {
  const p = geo.attributes.position, n = geo.attributes.normal;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.set(p.getX(i) - center.x, p.getY(i) - center.y, p.getZ(i) - center.z).normalize();
    v.y += upBias; v.normalize();
    n.setXYZ(i, v.x, v.y, v.z);
  }
}

function pineGeometry(seed, start = 0.14) {
  const r = mulberry32(seed);
  const trunk = new THREE.CylinderGeometry(0.012, 0.03, 1, 8, 1);
  trunk.translate(0, 0.5, 0);
  const cards = [];
  const whorls = 17;
  for (let i = 0; i < whorls; i++) {
    const t = i / whorls;
    const y = start + 0.02 + t * (0.96 - start);
    const len = (0.25 * (1 - t) + 0.05) * (0.8 + r() * 0.4);
    const count = Math.max(5, Math.round(11 - t * 6));
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2 + r() * 0.8 + i * 0.9;
      const ll = len * (0.75 + r() * 0.45);
      const c = cardGeometry(ll * (0.7 + r() * 0.3), ll);
      c.rotateY(r() * Math.PI); // spin around branch axis
      c.rotateZ(-Math.PI / 2 - 0.25 - r() * 0.35 + t * 0.5); // point outward and droop
      c.rotateY(a);
      c.translate(0, y + (r() - 0.5) * 0.03, 0);
      cards.push(c);
    }
    // inner filler so the crown reads as dense from a distance
    for (let k = 0; k < 2; k++) { const c = cardGeometry(len * 0.6, len * 0.55); c.rotateZ(-Math.PI / 2 + 0.6); c.rotateY(r() * 6.28); c.translate(0, y, 0); cards.push(c); }
  }
  // top tuft
  for (let k = 0; k < 3; k++) { const c = cardGeometry(0.06, 0.09); c.rotateY(k * 1.05); c.translate(0, 0.94, 0); cards.push(c); }
  const foliage = mergeGeometries(cards.map((c) => c.toNonIndexed ? c : c));
  sphericalNormals(foliage, new THREE.Vector3(0, 0.45, 0), 0.6);
  return { trunk, foliage };
}

function birchGeometry(seed) {
  const r = mulberry32(seed);
  const trunk = new THREE.CylinderGeometry(0.01, 0.022, 1, 7, 3);
  const tp = trunk.attributes.position;
  for (let i = 0; i < tp.count; i++) { const y = tp.getY(i) + 0.5; tp.setX(i, tp.getX(i) + Math.sin(y * 4 + seed) * 0.012 * y); }
  trunk.translate(0, 0.5, 0);
  const parts = [];
  for (let i = 0; i < 46; i++) {
    const y = 0.42 + r() * 0.55;
    const rad = 0.17 * Math.sin(((y - 0.4) / 0.6) * Math.PI) + 0.03;
    const a = r() * Math.PI * 2;
    const s = 0.16 + r() * 0.08;
    const c = new THREE.PlaneGeometry(s, s);
    c.rotateX(-0.6 + r() * 1.2); c.rotateY(r() * Math.PI);
    c.translate(Math.cos(a) * rad * r(), y, Math.sin(a) * rad * r());
    parts.push(c);
  }
  const foliage = mergeGeometries(parts);
  sphericalNormals(foliage, new THREE.Vector3(0, 0.65, 0), 0.4);
  return { trunk, foliage };
}

function oakGeometry(seed) {
  const r = mulberry32(seed);
  const parts = [];
  const trunk = new THREE.CylinderGeometry(0.028, 0.05, 0.5, 9, 4);
  const tp = trunk.attributes.position;
  for (let i = 0; i < tp.count; i++) { const y = tp.getY(i) + 0.25; const a = Math.atan2(tp.getZ(i), tp.getX(i)); const k = 1 + Math.sin(a * 5 + y * 9) * 0.08 + Math.max(0, 0.08 - y) * 4; tp.setX(i, tp.getX(i) * k); tp.setZ(i, tp.getZ(i) * k); }
  trunk.translate(0, 0.25, 0);
  parts.push(trunk.toNonIndexed());
  const lobes = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + r() * 0.6, up = 0.55 + r() * 0.45, len = 0.22 + r() * 0.12;
    const dir = new THREE.Vector3(Math.cos(a) * 0.8, up, Math.sin(a) * 0.8).normalize();
    const b = new THREE.CylinderGeometry(0.008, 0.02, len, 6);
    b.translate(0, len / 2, 0);
    b.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir));
    b.translate(0, 0.42, 0);
    parts.push(b.toNonIndexed());
    lobes.push(new THREE.Vector3(0, 0.42, 0).addScaledVector(dir, len));
  }
  lobes.push(new THREE.Vector3(0, 0.82, 0));
  const trunkGeo = mergeGeometries(parts);
  const cards = [];
  for (const c of lobes) {
    const R0 = 0.16 + r() * 0.06;
    for (let i = 0; i < 26; i++) {
      const u = r() * 2 - 1, a = r() * Math.PI * 2, rad = Math.cbrt(r()) * R0;
      const p = new THREE.Vector3(Math.sqrt(1 - u * u) * Math.cos(a), u * 0.75, Math.sqrt(1 - u * u) * Math.sin(a)).multiplyScalar(rad).add(c);
      const s = 0.13 + r() * 0.06;
      const q = new THREE.PlaneGeometry(s, s);
      q.rotateX(-0.7 + r() * 1.4); q.rotateY(r() * Math.PI);
      q.translate(p.x, p.y, p.z);
      cards.push(q);
    }
  }
  const foliage = mergeGeometries(cards);
  sphericalNormals(foliage, new THREE.Vector3(0, 0.6, 0), 0.5);
  return { trunk: trunkGeo, foliage };
}

function bambooClump(seed) {
  const r = mulberry32(seed);
  const culms = [], leaves = [];
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.8, h = 6 + r() * 4, rad = 0.022 + r() * 0.016, lean = (r() - 0.5) * 0.16;
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    const c = new THREE.CylinderGeometry(rad * 0.7, rad, h, 7, Math.round(h / 0.45)); c.translate(0, h / 2, 0);
    const p = c.attributes.position;
    for (let k = 0; k < p.count; k++) { const y = p.getY(k); const node = Math.abs(((y / 0.45) % 1) - 0.5) < 0.04 ? 1.18 : 1; p.setX(k, p.getX(k) * node + lean * y * y / h); p.setZ(k, p.getZ(k) * node); }
    c.translate(x, 0, z);
    culms.push(c.toNonIndexed());
    for (let k = 0; k < 16; k++) {
      const y = h * (0.35 + r() * 0.65), s2 = 0.45 + r() * 0.35;
      const q = new THREE.PlaneGeometry(s2, s2 * 0.6); q.rotateX(-0.4 + r() * 0.8); q.rotateY(r() * Math.PI);
      q.translate(x + lean * y * y / h + (r() - 0.5) * 0.5, y, z + (r() - 0.5) * 0.5);
      leaves.push(q);
    }
  }
  const leafG = mergeGeometries(leaves); sphericalNormals(leafG, new THREE.Vector3(0, 6, 0), 0.4);
  return { culms: mergeGeometries(culms), leaves: leafG };
}

function bushGeometry(seed) {
  const r = mulberry32(seed);
  const cards = [];
  for (let i = 0; i < 34; i++) {
    const a = r() * Math.PI * 2, u = r(), rad = Math.sqrt(r()) * 0.5;
    const s = 0.32 + r() * 0.18;
    const q = new THREE.PlaneGeometry(s, s);
    q.rotateX(-0.9 + r() * 1.8); q.rotateY(r() * Math.PI);
    q.translate(Math.cos(a) * rad, 0.15 + u * 0.55 * (1 - rad), Math.sin(a) * rad);
    cards.push(q);
  }
  const g = mergeGeometries(cards);
  sphericalNormals(g, new THREE.Vector3(0, 0.1, 0), 0.6);
  return g;
}

function reedClump(r) {
  const pos = [], col = [], idx = []; let v0 = 0;
  for (let b = 0; b < 14; b++) {
    const a = r() * 6.28, d = r() * 0.25, bx = Math.cos(a) * d, bz = Math.sin(a) * d;
    const h = 0.9 + r() * 0.9, w = 0.012, ry = r() * Math.PI, cx = Math.cos(ry), sz = Math.sin(ry), lean = (r() - 0.5) * 0.3;
    for (let s2 = 0; s2 <= 3; s2++) {
      const t = s2 / 3, ww = w * (1 - t * 0.7), o = lean * t * t * h;
      for (const side of [-1, 1]) { pos.push(bx + cx * ww * side + o, t * h, bz + sz * ww * side); const g = 0.5 + t * 0.4; col.push(0.25 * g, 0.36 * g, 0.12 * g); }
    }
    for (let s2 = 0; s2 < 3; s2++) { const a0 = v0 + s2 * 2; idx.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2); }
    v0 += 8;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  // cattail heads
  const heads = [];
  for (let i = 0; i < 4; i++) { const c = new THREE.CapsuleGeometry(0.018, 0.12, 3, 6); const hy = 1.1 + r() * 0.5; c.translate((r() - 0.5) * 0.3, hy, (r() - 0.5) * 0.3); heads.push(c.toNonIndexed()); }
  return { leaves: g, heads: mergeGeometries(heads) };
}

function grassClump(r, blades = 8) {
  const pos = [], col = [], nor = [], idx = [];
  let v0 = 0;
  for (let b = 0; b < blades; b++) {
    const a = r() * Math.PI * 2, d = r() * 0.18;
    const bx = Math.cos(a) * d, bz = Math.sin(a) * d;
    const h = 0.32 + r() * 0.4, w = 0.018 + r() * 0.012;
    const ry = r() * Math.PI, lean = (r() - 0.5) * 0.5;
    const cx = Math.cos(ry), sz = Math.sin(ry);
    const segs = 2;
    const shade = 0.75 + r() * 0.35;
    const dry = r() < 0.2 ? 1 : 0;
    for (let s = 0; s <= segs; s++) {
      const t = s / segs, ww = w * (1 - t * 0.85);
      const off = lean * t * t * h;
      const y = t * h;
      for (const side of [-1, 1]) {
        pos.push(bx + cx * ww * side + off * sz, y, bz + sz * ww * side - off * cx);
        const g = 0.25 + t * 0.55;
        col.push((0.12 + t * 0.2 + dry * 0.25) * shade, (g * 0.75 + dry * 0.05) * shade, (0.06 + t * 0.06) * shade);
        nor.push(0, 1, 0);
      }
    }
    for (let s = 0; s < segs; s++) { const a0 = v0 + s * 2; idx.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2); }
    v0 += (segs + 1) * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

function rockGeometry(seed) {
  const g = new THREE.IcosahedronGeometry(1, 3);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = fbm2(v.x * 1.3 + seed, v.z * 1.3 + v.y * 0.7, 4) * 0.35 + 1;
    v.multiplyScalar(n); v.y *= 0.62;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/**
 * Distance LOD for instanced vegetation. Instances within `radius` of the viewer are drawn
 * with the detailed parts (and cast shadows); the rest use a cheap far geometry, or are
 * skipped. Lists are rebuilt only when the viewer has moved a few metres.
 */
export class LODInstances {
  constructor(scene, matrices, parts, { radius = 70, far = null, cast = false } = {}) {
    this.mats = matrices; this.radius = radius;
    this.pos = matrices.map((m) => new THREE.Vector3().setFromMatrixPosition(m));
    const mk = (geo, mat, castS) => { const im = new THREE.InstancedMesh(geo, mat, Math.max(1, matrices.length)); im.count = 0; im.castShadow = castS; im.receiveShadow = true; im.frustumCulled = false; im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(im); return im; };
    this.near = parts.map(([g, m]) => mk(g, m, cast));
    this.far = far ? mk(far[0], far[1], false) : null;
    this.last = new THREE.Vector3(1e9, 0, 0);
  }
  update(cam, force = false) {
    if (!force && this.last.distanceToSquared(cam) < 36) return;
    this.last.copy(cam);
    const r2 = this.radius * this.radius;
    let n = 0, f = 0;
    for (let i = 0; i < this.mats.length; i++) {
      const p = this.pos[i], dx = p.x - cam.x, dz = p.z - cam.z;
      if (dx * dx + dz * dz < r2) { for (const im of this.near) im.setMatrixAt(n, this.mats[i]); n++; }
      else if (this.far) { this.far.setMatrixAt(f, this.mats[i]); f++; }
    }
    for (const im of this.near) { im.count = n; im.instanceMatrix.needsUpdate = true; }
    if (this.far) { this.far.count = f; this.far.instanceMatrix.needsUpdate = true; }
  }
}

/** Renders a detailed tree once into a texture and returns crossed billboard cards using it. */
function makeImpostor(renderer, parts, tint = 0xffffff) {
  const sc = new THREE.Scene();
  const box = new THREE.Box3();
  for (const [g, m] of parts) { g.computeBoundingBox(); box.union(g.boundingBox); const mesh = new THREE.Mesh(g, m); sc.add(mesh); }
  sc.add(new THREE.AmbientLight(0xffffff, 1.0));
  const w = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * 1.02, h = (box.max.y - box.min.y) * 1.02;
  const cam = new THREE.OrthographicCamera(-w / 2, w / 2, box.max.y + 0.01, box.min.y, -5, 5);
  cam.position.set(0, 0, 2); cam.lookAt(0, (box.max.y + box.min.y) / 2 * 0, 0); cam.position.set(0, 0, 2);
  const W = 256, H = Math.min(1024, Math.round(256 * h / w / 64) * 64 || 512);
  const rt = new THREE.WebGLRenderTarget(W, H, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter });
  const prevRT = renderer.getRenderTarget(), prevClear = renderer.getClearColor(new THREE.Color()), prevA = renderer.getClearAlpha();
  const prevShadow = renderer.shadowMap.enabled;
  renderer.shadowMap.enabled = false;
  renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 0); renderer.clear();
  renderer.render(sc, cam);
  renderer.setRenderTarget(prevRT); renderer.setClearColor(prevClear, prevA);
  renderer.shadowMap.enabled = prevShadow;
  const cards = [];
  for (let i = 0; i < 3; i++) {
    const q = new THREE.PlaneGeometry(w, h); q.translate(0, box.min.y + h / 2, 0); q.rotateY((i / 3) * Math.PI);
    cards.push(q);
  }
  const geo = mergeGeometries(cards);
  sphericalNormals(geo, new THREE.Vector3(0, box.min.y + h * 0.45, 0), 0.5);
  const mat = new THREE.MeshStandardMaterial({ map: rt.texture, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.92, color: tint });
  return [geo, mat];
}

function colored(geo, c) { const g = geo.index ? geo.toNonIndexed() : geo; const n = g.attributes.position.count; const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c[0]; a[i * 3 + 1] = c[1]; a[i * 3 + 2] = c[2]; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); if (g.attributes.uv) g.deleteAttribute('uv'); return g; }
function farPine() {
  const parts = [colored(new THREE.CylinderGeometry(0.012, 0.025, 0.3, 5).translate(0, 0.15, 0), [0.22, 0.16, 0.11])];
  [[0.15, 0.27, 0.42], [0.42, 0.2, 0.32], [0.65, 0.13, 0.3]].forEach(([y, r, h], i) => parts.push(colored(new THREE.ConeGeometry(r, h, 7, 1, true).translate(0, y + h / 2, 0), [0.07 + i * 0.01, 0.14 + i * 0.015, 0.08])));
  const g = mergeGeometries(parts); sphericalNormals(g, new THREE.Vector3(0, 0.4, 0), 0.6); return g;
}
function farLeafy(col, trunkCol) {
  const parts = [colored(new THREE.CylinderGeometry(0.012, 0.025, 0.55, 5).translate(0, 0.27, 0), trunkCol)];
  [[0, 0.68, 0, 0.2], [0.09, 0.58, 0.05, 0.15], [-0.08, 0.6, -0.06, 0.15], [0.02, 0.82, -0.03, 0.13]].forEach(([x, y, z, r]) => parts.push(colored(new THREE.IcosahedronGeometry(r, 1).translate(x, y, z), col)));
  const g = mergeGeometries(parts); sphericalNormals(g, new THREE.Vector3(0, 0.6, 0), 0.5); return g;
}

/** Splits instances into spatial chunks so frustum culling works. */
function chunkedInstances(scene, geo, mat, matrices, opts = {}) {
  const CH = 90, groups = new Map();
  const pos = new THREE.Vector3();
  for (const m of matrices) {
    pos.setFromMatrixPosition(m);
    const key = Math.floor(pos.x / CH) + ',' + Math.floor(pos.z / CH);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  const meshes = [];
  for (const list of groups.values()) {
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
    im.castShadow = !!opts.cast; im.receiveShadow = !!opts.receive;
    im.computeBoundingSphere();
    scene.add(im);
    meshes.push(im);
  }
  return meshes;
}

export class Vegetation {
  constructor(scene, quality, textures, terrain, colliders, renderer) {
    const rnd = mulberry32(2024);
    const h = (x, z) => terrain.heightAt(x, z);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), e = new THREE.Euler();
    const make = (x, y, z, sc, ry, tilt = 0) => {
      e.set(tilt * (rnd() - 0.5), ry, tilt * (rnd() - 0.5)); q.setFromEuler(e);
      return new THREE.Matrix4().compose(p.set(x, y, z), q, s.set(sc, sc, sc));
    };
    const blocked = (x, z, clearPath = 2.6) => {
      if (Math.abs(x - CABIN.x) < 11 && z > -7 && z < 9.5) return true;
      if (Math.abs(x - DOCK.x) < 4 && z > DOCK.zStart - 4 && z < DOCK.zEnd + 2) return true;
      if (REGION.id === 'hollow' && (Math.hypot(x - TREEHOUSE.x, z - TREEHOUSE.z) < 7 || Math.hypot(x - CLEARING.x, z - CLEARING.z) < 7)) return true;
      if (pathDistance(x, z) < clearPath) return true;
      if (h(x, z) < WATER_LEVEL + 0.25) return true;
      return false;
    };

    // ---------------------------------------------------------------- trees
    const barkMat = new THREE.MeshStandardMaterial({ map: textures.bark.map, normalMap: textures.bark.normalMap, roughness: 0.95 });
    textures.bark.map.repeat.set(3, 6); textures.bark.normalMap.repeat.set(3, 6);
    const birchMat = new THREE.MeshStandardMaterial({ map: textures.birch.map, normalMap: textures.birch.normalMap, roughness: 0.8 });
    textures.birch.map.repeat.set(2, 5); textures.birch.normalMap.repeat.set(2, 5);
    const pineMat = new THREE.MeshStandardMaterial({ map: textures.pine, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.92, color: 0xa4b89c });
    addWind(pineMat, 0.035, 1.0, 'pine');
    const leafMat = new THREE.MeshStandardMaterial({ map: textures.leaves, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85 });
    addWind(leafMat, 0.06, 1.0, 'leaf');
    this.materials = { barkMat, pineMat, leafMat };

    const pines = [0, 1, 2].map((i) => pineGeometry(100 + i * 17));
    const birches = [0, 1].map((i) => birchGeometry(300 + i * 13));
    const oaks = [0, 1].map((i) => oakGeometry(500 + i * 29));
    const pineMs = pines.map(() => []), birchMs = birches.map(() => []), oakMs = oaks.map(() => []);
    const hollow = REGION.id === 'hollow';
    const oakLeafMat = new THREE.MeshStandardMaterial({ map: hollow ? textures.maple : textures.leaves, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.8, color: hollow ? 0xffffff : 0x9fb07a });
    addWind(oakLeafMat, 0.05, 1.0, 'oak');
    const oakLeafMat2 = hollow ? new THREE.MeshStandardMaterial({ map: textures.mapleGold, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.8 }) : oakLeafMat;
    if (hollow) addWind(oakLeafMat2, 0.05, 1.0, 'oak2');
    if (hollow) { leafMat.map = textures.ginkgo; leafMat.color.set(0xffffff); birchMat.map = textures.bark.map; birchMat.normalMap = textures.bark.normalMap; birchMat.color.set(0x8a8070); }
    const oakBark = new THREE.MeshStandardMaterial({ map: textures.bark.map, normalMap: textures.bark.normalMap, roughness: 0.95, color: 0x9a8c80 });
    // a few characterful broadleaf trees near the cabin meadow
    for (const [ox, oz, sc] of (hollow ? [[12, -9.5, 13], [-11, 9, 12], [10, 12, 11], [-16, -6, 14], [33, -24, 16], [-30, 20, 13], [24, 26, 12]] : [[15, 9, 15], [-17, 13, 13], [24, -6, 16], [-12, -14, 14], [30, 30, 17]])) {
      const y = h(ox, oz) - 0.1;
      oakMs[(ox > 0) | 0].push(make(ox, y, oz, sc, ox * 0.37, 0.02));
      this.trees_pending = (this.trees_pending || []).concat([[ox, oz, sc * 0.045, y, sc]]);
    }
    this.trees = [];
    const target = quality.trees;
    let tries = 0, placed = 0;
    const R = 300; const grid = new Map();
    while (placed < target && tries < target * 40) {
      tries++;
      const x = (rnd() * 2 - 1) * R, z = (rnd() * 2 - 1) * R;
      const r = Math.hypot(x, z);
      if (r > R) continue;
      const fd = r > WORLD_RADIUS + 10 ? 0.8 : Math.min(1, forestDensity(x, z) * 1.25);
      if (rnd() > fd) continue;
      if (blocked(x, z)) continue;
      // spacing
      { const key = Math.floor(x / 4) + ',' + Math.floor(z / 4); let ok = true;
        for (let gx = -1; gx <= 1 && ok; gx++) for (let gz = -1; gz <= 1 && ok; gz++) { const l = grid.get((Math.floor(x / 4) + gx) + ',' + (Math.floor(z / 4) + gz)); if (l) for (const t of l) if ((t.x - x) ** 2 + (t.z - z) ** 2 < 7.5) { ok = false; break; } }
        if (!ok) continue; if (!grid.has(key)) grid.set(key, []); grid.get(key).push({ x, z }); }
      const y = h(x, z) - 0.15;
      const nearLake = lakeE(x, z) < 1.6;
      const hollowR = REGION.id === 'hollow';
      const isBirch = (hollowR ? rnd() < 0.14 : nearLake ? rnd() < 0.45 : rnd() < 0.12) && r < WORLD_RADIUS;
      const isOak = !isBirch && r < WORLD_RADIUS && (hollowR ? rnd() < 0.68 : fd < 0.75 && rnd() < 0.18);
      const sc = isBirch ? 9 + rnd() * 6 : isOak ? 10 + rnd() * 7 : 11 + rnd() * 13;
      const mtx = make(x, y, z, sc, rnd() * Math.PI * 2, 0.06);
      if (isBirch) birchMs[Math.floor(rnd() * birches.length)].push(mtx);
      else if (isOak) oakMs[Math.floor(rnd() * oaks.length)].push(mtx);
      else pineMs[Math.floor(rnd() * pines.length)].push(mtx);
      const rad = sc * (isBirch ? 0.022 : isOak ? 0.045 : 0.03);
      this.trees.push({ x, z, r: rad, birch: isBirch });
      if (r < WORLD_RADIUS + 5) colliders.addCylinder(x, z, Math.max(0.18, rad), y, y + sc);
      placed++;
    }
    // hero tree for the tree house
    const ty = h(TREEHOUSE.x, TREEHOUSE.z) - 0.2;
    if (REGION.id !== 'hollow') this.trees.push({ x: TREEHOUSE.x, z: TREEHOUSE.z, r: 0.8 });

    for (const [ox, oz, rad, y, sc] of this.trees_pending) { this.trees.push({ x: ox, z: oz, r: rad }); colliders.addCylinder(ox, oz, rad, y, y + sc * 0.4); }
    const cast = quality.shadows;
    this.meshes = [];
    const farMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
    const R0 = quality.treeLOD;
    this.lods = [];
    const L2 = (ms, parts) => { if (ms.length) this.lods.push(new LODInstances(scene, ms, parts, { radius: R0, far: renderer ? makeImpostor(renderer, parts) : null, cast })); };
    pines.forEach((g, i) => L2(pineMs[i], [[g.trunk, barkMat], [g.foliage, pineMat]]));
    birches.forEach((g, i) => L2(birchMs[i], [[g.trunk, birchMat], [g.foliage, leafMat]]));
    oaks.forEach((g, i) => L2(oakMs[i], [[g.trunk, oakBark], [g.foliage, i === 1 ? oakLeafMat2 : oakLeafMat]]));
    if (hollow) {
      // bamboo groves
      const bamboo = [0, 1].map((i) => bambooClump(900 + i * 5));
      const culmMat = new THREE.MeshStandardMaterial({ color: 0x6f8a42, roughness: 0.4, map: textures.birch.map });
      addWind(culmMat, 0.22, 0.11, 'bamboo');
      const bLeaf = new THREE.MeshStandardMaterial({ map: textures.leaves, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.7, color: 0xb8d890 });
      addWind(bLeaf, 0.22, 0.11, 'bambooleaf');
      const bms = [[], []];
      for (let i = 0; i < 900 && bms[0].length + bms[1].length < 140; i++) {
        const grove = i % 3 === 0 ? [-24 + (rnd() - 0.5) * 34, -24 + (rnd() - 0.5) * 30] : [(rnd() - 0.5) * 260, (rnd() - 0.5) * 260];
        const [x, z] = grove;
        if (blocked(x, z, 2.2) || (i % 3 !== 0 && rnd() < 0.85)) continue;
        bms[i % 2].push(make(x, h(x, z) - 0.05, z, 0.9 + rnd() * 0.3, rnd() * 6.28));
        if (Math.hypot(x, z) < WORLD_RADIUS) colliders.addCylinder(x, z, 0.75, h(x, z), h(x, z) + 8);
      }
      bamboo.forEach((g, i) => { if (bms[i].length) this.lods.push(new LODInstances(scene, bms[i], [[g.culms, culmMat], [g.leaves, bLeaf]], { radius: R0 * 1.4, cast })); });
      // fallen leaves on the ground
      const fallen = new THREE.PlaneGeometry(0.9, 0.9); fallen.rotateX(-Math.PI / 2);
      const fallenMat = new THREE.MeshStandardMaterial({ map: textures.maple, alphaTest: 0.5, roughness: 0.9, side: THREE.DoubleSide });
      const fms = [];
      for (let i = 0; i < 6000 && fms.length < (quality.key === 'low' ? 900 : 2600); i++) {
        const x = (rnd() - 0.5) * 220, z = (rnd() - 0.5) * 220;
        if (h(x, z) < WATER_LEVEL + 0.1 || (Math.abs(x) < 7 && z > -5.5 && z < 6.5)) continue;
        if (rnd() > 0.25 + forestDensity(x, z) * 0.7) continue;
        fms.push(make(x, h(x, z) + 0.015 + rnd() * 0.01, z, 0.6 + rnd() * 0.9, rnd() * 6.28, 0.12));
      }
      this.lods.push(new LODInstances(scene, fms, [[fallen, fallenMat]], { radius: 40 }));
    }
    // the tree-house tree: a tall pine whose branches start above the hut
    const hero = pineGeometry(901, 0.42);
    if (!hollow) { const heroM = new THREE.Matrix4().compose(new THREE.Vector3(TREEHOUSE.x, h(TREEHOUSE.x, TREEHOUSE.z) - 0.2, TREEHOUSE.z), new THREE.Quaternion(), new THREE.Vector3(26, 26, 26));
    for (const [g, m] of [[hero.trunk, barkMat], [hero.foliage, pineMat]]) { const mm = new THREE.Mesh(g, m); mm.applyMatrix4(heroM); mm.castShadow = cast; mm.receiveShadow = true; scene.add(mm); } }

    // ------------------------------------------------------------ undergrowth
    // bushes along forest edges and trails
    const bushMat = new THREE.MeshStandardMaterial({ map: textures.leaves, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.82, color: 0x8aa070 });
    addWind(bushMat, 0.12, 1.2, 'bush');
    const bushGeos = [0, 1, 2].map((i) => bushGeometry(700 + i * 7));
    const bushMs = bushGeos.map(() => []);
    const nb = Math.round(quality.ferns * 0.9);
    tries = 0;
    while (bushMs.flat().length < nb && tries < nb * 40) {
      tries++;
      const x = (rnd() * 2 - 1) * 160, z = (rnd() * 2 - 1) * 160;
      const fd = forestDensity(x, z);
      const edge = 1 - Math.abs(fd - 0.45) * 2;
      if (rnd() > Math.max(0.05, edge) || blocked(x, z, 1.6)) continue;
      const sc = 0.8 + rnd() * 1.1;
      bushMs[tries % 3].push(make(x, h(x, z) - 0.05, z, sc, rnd() * 6.28, 0.2));
      if (sc > 1.4 && Math.hypot(x, z) < WORLD_RADIUS) colliders.addCylinder(x, z, 0.35 * sc, h(x, z), h(x, z) + sc * 0.6);
    }
    bushGeos.forEach((g2, i) => { if (bushMs[i].length) this.lods.push(new LODInstances(scene, bushMs[i], [[g2, bushMat]], { radius: R0 * 0.9, cast })); });

    // reeds and cattails at the lake edge
    const reed = reedClump(mulberry32(3));
    const reedMat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.8 });
    addWind(reedMat, 0.12, 0.9, 'reed');
    const headMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1a, roughness: 0.9 });
    addWind(headMat, 0.12, 0.9, 'reedhead');
    const reedMs = [];
    for (let i = 0; i < 2500 && reedMs.length < (quality.key === 'low' ? 160 : 420); i++) {
      const a = rnd() * Math.PI * 2, e = 0.9 + rnd() * 0.16;
      const x = LAKE.x + Math.cos(a) * LAKE.rx * e, z = LAKE.z + Math.sin(a) * LAKE.rz * e;
      const hy = h(x, z), le = lakeE(x, z);
      if (le < 0.93 || le > 1.06 || hy < WATER_LEVEL - 0.5) continue;
      if (Math.abs(x - DOCK.x) < 4 && z < DOCK.zEnd + 4) continue;
      if (fbm2(x / 14, z / 14, 2) < -0.1) continue; // patchy stands
      reedMs.push(make(x, Math.min(hy, WATER_LEVEL) - 0.05, z, 0.8 + rnd() * 0.5, rnd() * 6.28, 0.15));
    }
    if (reedMs.length) this.lods.push(new LODInstances(scene, reedMs, [[reed.leaves, reedMat], [reed.heads, headMat]], { radius: R0 * 1.2 }));

    // lily pads with the odd flower
    const pad = new THREE.CircleGeometry(0.22, 14, 0.25, Math.PI * 2 - 0.5); pad.rotateX(-Math.PI / 2);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x3f6a2a, roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 0.8 });
    const flowerG = new THREE.ConeGeometry(0.06, 0.06, 7, 1, true); flowerG.rotateX(Math.PI); flowerG.translate(0, 0.04, 0);
    const lilyFlowerMat = new THREE.MeshStandardMaterial({ color: 0xf6e8f0, roughness: 0.5, emissive: 0x302028, side: THREE.DoubleSide });
    const padMs = [], flMs = [];
    for (let i = 0; i < 3000 && padMs.length < 260; i++) {
      const cxs = [[LAKE.x - 25, LAKE.z - 8], [LAKE.x + 28, LAKE.z + 12], [LAKE.x - 10, LAKE.z + 26], [LAKE.x + 14, LAKE.z - 22]][i % 4];
      const x = cxs[0] + (rnd() - 0.5) * 16, z = cxs[1] + (rnd() - 0.5) * 12;
      const hy = h(x, z);
      if (hy > WATER_LEVEL - 0.25 || hy < WATER_LEVEL - 2.5) continue;
      const m = make(x, WATER_LEVEL + 0.012 + rnd() * 0.004, z, 0.6 + rnd() * 0.8, rnd() * 6.28);
      padMs.push(m);
      if (rnd() < 0.12) flMs.push(make(x + 0.05, WATER_LEVEL + 0.01, z, 0.9 + rnd() * 0.4, rnd() * 6.28));
    }
    const pi = new THREE.InstancedMesh(pad, padMat, padMs.length); padMs.forEach((m, i) => pi.setMatrixAt(i, m)); pi.receiveShadow = true; scene.add(pi); this.meshes.push(pi);
    const li = new THREE.InstancedMesh(flowerG, lilyFlowerMat, flMs.length); flMs.forEach((m, i) => li.setMatrixAt(i, m)); scene.add(li); this.meshes.push(li);

    // mushrooms at the feet of trees
    const capG = new THREE.SphereGeometry(0.05, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2); capG.scale(1, 0.6, 1); capG.translate(0, 0.07, 0);
    const stemG = new THREE.CylinderGeometry(0.012, 0.016, 0.07, 8); stemG.translate(0, 0.035, 0);
    const shroomG = mergeGeometries([capG.toNonIndexed(), stemG.toNonIndexed()]);
    const shroomMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
    const shMs = [];
    for (const t of this.trees) {
      if (shMs.length > 600 || t.birch === undefined || rnd() > 0.35 || Math.hypot(t.x, t.z) > 140) continue;
      for (let k = 0; k < 1 + rnd() * 4; k++) { const a = rnd() * 6.28, d = t.r + 0.2 + rnd() * 0.8; const x = t.x + Math.cos(a) * d, z = t.z + Math.sin(a) * d; shMs.push(make(x, h(x, z) - 0.01, z, 0.6 + rnd() * 1.2, rnd() * 6.28, 0.3)); }
    }
    const si = new THREE.InstancedMesh(shroomG, shroomMat, shMs.length);
    const shroomCols = [new THREE.Color(0.75, 0.55, 0.35), new THREE.Color(0.55, 0.38, 0.25), new THREE.Color(0.85, 0.2, 0.12), new THREE.Color(0.9, 0.85, 0.75)];
    shMs.forEach((m, i) => { si.setMatrixAt(i, m); si.setColorAt(i, shroomCols[Math.floor(rnd() * 4)]); });
    si.castShadow = false; si.receiveShadow = true; scene.add(si); this.meshes.push(si);

    // fallen logs and stumps
    const logMat = new THREE.MeshStandardMaterial({ map: textures.bark.map, normalMap: textures.bark.normalMap, roughness: 1, color: 0x8a8a70 });
    addMoss(logMat, 0.55);
    for (let i = 0, n = 0; i < 400 && n < 34; i++) {
      const x = (rnd() * 2 - 1) * 140, z = (rnd() * 2 - 1) * 140;
      if (forestDensity(x, z) < 0.35 || blocked(x, z, 3)) continue;
      const len = 3 + rnd() * 6, rad = 0.18 + rnd() * 0.18, ry = rnd() * Math.PI;
      const g2 = new THREE.CylinderGeometry(rad * 0.85, rad, len, 12, 1); g2.rotateZ(Math.PI / 2);
      const m = new THREE.Mesh(g2, logMat); m.position.set(x, h(x, z) + rad * 0.6, z); m.rotation.y = ry; m.castShadow = cast; m.receiveShadow = true; scene.add(m); this.meshes.push(m);
      for (let k = -1; k <= 1; k++) colliders.addCylinder(x + Math.cos(ry) * k * len * 0.33, z - Math.sin(ry) * k * len * 0.33, rad, h(x, z) - 1, h(x, z) + rad * 1.4);
      n++;
    }
    const stumpG = new THREE.CylinderGeometry(0.3, 0.42, 0.5, 12); stumpG.translate(0, 0.2, 0);
    const stMs = [];
    for (let i = 0; i < 300 && stMs.length < 40; i++) {
      const x = (rnd() * 2 - 1) * 130, z = (rnd() * 2 - 1) * 130;
      if (forestDensity(x, z) < 0.3 || blocked(x, z, 2.5)) continue;
      const sc = 0.7 + rnd() * 0.8; stMs.push(make(x, h(x, z) - 0.05, z, sc, rnd() * 6.28, 0.1));
      colliders.addCylinder(x, z, 0.38 * sc, h(x, z) - 1, h(x, z) + 0.45 * sc);
    }
    const sti = new THREE.InstancedMesh(stumpG, logMat, stMs.length); stMs.forEach((m, i) => sti.setMatrixAt(i, m)); sti.castShadow = cast; sti.receiveShadow = true; scene.add(sti); this.meshes.push(sti);

    // ---------------------------------------------------------------- ferns
    const fernMat = new THREE.MeshStandardMaterial({ map: textures.fern, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.8 });
    addWind(fernMat, 0.25, 1.2, 'fern');
    const fronds = [];
    for (let i = 0; i < 7; i++) {
      const c = new THREE.PlaneGeometry(0.42, 0.9, 1, 3);
      const pp = c.attributes.position;
      for (let k = 0; k < pp.count; k++) { const t = pp.getY(k) / 0.9 + 0.5; pp.setZ(k, -t * t * 0.45); pp.setY(k, (pp.getY(k) + 0.45)); }
      c.rotateX(-0.75); c.rotateY((i / 7) * Math.PI * 2);
      fronds.push(c);
    }
    const fernGeo = mergeGeometries(fronds);
    sphericalNormals(fernGeo, new THREE.Vector3(0, -0.3, 0), 0.5);
    const fernMs = [];
    tries = 0;
    while (fernMs.length < quality.ferns && tries < quality.ferns * 30) {
      tries++;
      const x = (rnd() * 2 - 1) * 150, z = (rnd() * 2 - 1) * 150;
      if (rnd() > forestDensity(x, z) || blocked(x, z, 1.4)) continue;
      fernMs.push(make(x, h(x, z) - 0.05, z, 0.7 + rnd() * 0.8, rnd() * 6.28, 0.2));
    }
    if (fernMs.length) this.lods.push(new LODInstances(scene, fernMs, [[fernGeo, fernMat]], { radius: R0 * 0.8 }));

    // ---------------------------------------------------------------- flowers
    const petal = new THREE.CircleGeometry(0.035, 6); petal.rotateX(-Math.PI / 2); petal.translate(0, 0.28, 0);
    const stem = new THREE.CylinderGeometry(0.003, 0.004, 0.28, 3); stem.translate(0, 0.14, 0);
    const flowerGeo = mergeGeometries([petal.toNonIndexed(), stem.toNonIndexed()]);
    const flowerMat = new THREE.MeshStandardMaterial({ roughness: 0.7 });
    addWind(flowerMat, 0.6, 2.0, 'flower');
    const fm = [];
    for (let i = 0; i < (quality.key === "low" ? 900 : 2600); i++) {
      const a = rnd() * 6.28, rr = 9 + rnd() * 55;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr * 0.7 + 4;
      if (blocked(x, z, 1.2) || forestDensity(x, z) > 0.4) continue;
      fm.push(make(x, h(x, z), z, 0.8 + rnd() * 0.6, rnd() * 6.28, 0.3));
    }
    const fi = new THREE.InstancedMesh(flowerGeo, flowerMat, fm.length);
    const pal = [new THREE.Color(0.95, 0.93, 0.85), new THREE.Color(0.95, 0.78, 0.2), new THREE.Color(0.55, 0.42, 0.85), new THREE.Color(0.9, 0.45, 0.55)];
    fm.forEach((m, i) => { fi.setMatrixAt(i, m); fi.setColorAt(i, pal[Math.floor(rnd() * pal.length)]); });
    fi.receiveShadow = true; scene.add(fi); this.meshes.push(fi);

    // ---------------------------------------------------------------- rocks
    const rockMat = new THREE.MeshStandardMaterial({ map: textures.rock.map, normalMap: textures.rock.normalMap, roughness: 0.9, color: 0xb0aba2 });
    addMoss(rockMat, 0.35);
    this.rockMat = rockMat;
    const rockGeos = [0, 1, 2].map((i) => rockGeometry(i * 11));
    const rms = rockGeos.map(() => []);
    for (let i = 0; i < 260; i++) {
      const x = (rnd() * 2 - 1) * 170, z = (rnd() * 2 - 1) * 170;
      if (blocked(x, z, 1.8)) {
        // allow rocks in shallow lake edge
        if (!(lakeE(x, z) > 0.9 && lakeE(x, z) < 1.05)) continue;
      }
      const big = rnd() < 0.12;
      const sc = big ? 1.2 + rnd() * 1.6 : 0.2 + rnd() * 0.5;
      const y = h(x, z) - sc * 0.25;
      rms[i % 3].push(make(x, y, z, sc, rnd() * 6.28, 0.5));
      if (big && Math.hypot(x, z) < WORLD_RADIUS) colliders.addCylinder(x, z, sc * 0.9, y, y + sc * 0.6);
    }
    rockGeos.forEach((gg, i) => this.meshes.push(...chunkedInstances(scene, gg, rockMat, rms[i], { cast, receive: true })));
  }

  update(elapsed, weather, cam) {
    if (cam) for (const l of this.lods) l.update(cam);
    windUniforms.uTime.value = elapsed;
    windUniforms.uWind.value = weather.w.gust ?? 0.4;
  }
}
