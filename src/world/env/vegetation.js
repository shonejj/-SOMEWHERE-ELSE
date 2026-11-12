// Instanced forest: pines, birches, grass, ferns, flowers, rocks — all wind-animated.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32, fbm2, smoothstep } from '../core/noise.js';
import { WATER_LEVEL, CABIN, TREEHOUSE, CLEARING, DOCK, WORLD_RADIUS } from '../core/layout.js';
import { pathDistance, forestDensity, lakeE } from './terrain.js';

export const windUniforms = { uTime: { value: 0 }, uWind: { value: 0.4 } };

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

function pineGeometry(seed) {
  const r = mulberry32(seed);
  const trunk = new THREE.CylinderGeometry(0.012, 0.03, 1, 8, 1);
  trunk.translate(0, 0.5, 0);
  const cards = [];
  const whorls = 13;
  for (let i = 0; i < whorls; i++) {
    const t = i / whorls;
    const y = 0.16 + t * 0.8;
    const len = (0.26 * (1 - t) + 0.05) * (0.85 + r() * 0.3);
    const count = Math.max(4, Math.round(8 - t * 4));
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2 + r() * 0.6 + i * 0.7;
      const c = cardGeometry(len * 0.75, len);
      c.rotateY(r() * Math.PI); // spin around branch axis
      c.rotateZ(-Math.PI / 2 - 0.15 - r() * 0.25 + t * 0.4); // point outward, droop
      c.rotateY(a);
      c.translate(0, y, 0);
      cards.push(c);
    }
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
  constructor(scene, quality, textures, terrain, colliders) {
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
      if (pathDistance(x, z) < clearPath) return true;
      if (h(x, z) < WATER_LEVEL + 0.25) return true;
      return false;
    };

    // ---------------------------------------------------------------- trees
    const barkMat = new THREE.MeshStandardMaterial({ map: textures.bark.map, normalMap: textures.bark.normalMap, roughness: 0.95 });
    textures.bark.map.repeat.set(3, 6); textures.bark.normalMap.repeat.set(3, 6);
    const birchMat = new THREE.MeshStandardMaterial({ map: textures.birch.map, normalMap: textures.birch.normalMap, roughness: 0.8 });
    textures.birch.map.repeat.set(2, 5); textures.birch.normalMap.repeat.set(2, 5);
    const pineMat = new THREE.MeshStandardMaterial({ map: textures.pine, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.92, color: 0xb8c8b0 });
    addWind(pineMat, 0.035, 1.0, 'pine');
    const leafMat = new THREE.MeshStandardMaterial({ map: textures.leaves, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85 });
    addWind(leafMat, 0.06, 1.0, 'leaf');
    this.materials = { barkMat, pineMat, leafMat };

    const pines = [0, 1, 2].map((i) => pineGeometry(100 + i * 17));
    const birches = [0, 1].map((i) => birchGeometry(300 + i * 13));
    const pineMs = pines.map(() => []), birchMs = birches.map(() => []);
    this.trees = [];
    const target = quality.trees;
    let tries = 0, placed = 0;
    const R = 300;
    while (placed < target && tries < target * 40) {
      tries++;
      const x = (rnd() * 2 - 1) * R, z = (rnd() * 2 - 1) * R;
      const r = Math.hypot(x, z);
      if (r > R) continue;
      const fd = r > WORLD_RADIUS + 10 ? 0.75 : forestDensity(x, z);
      if (rnd() > fd) continue;
      if (blocked(x, z)) continue;
      // spacing
      if (r < 120) { let ok = true; for (const t of this.trees) { if ((t.x - x) ** 2 + (t.z - z) ** 2 < 9) { ok = false; break; } } if (!ok) continue; }
      const y = h(x, z) - 0.15;
      const nearLake = lakeE(x, z) < 1.6;
      const isBirch = (nearLake ? rnd() < 0.5 : rnd() < 0.13) && r < WORLD_RADIUS;
      const sc = isBirch ? 9 + rnd() * 6 : 11 + rnd() * 13;
      const mtx = make(x, y, z, sc, rnd() * Math.PI * 2, 0.06);
      if (isBirch) birchMs[Math.floor(rnd() * birches.length)].push(mtx);
      else pineMs[Math.floor(rnd() * pines.length)].push(mtx);
      const rad = sc * (isBirch ? 0.022 : 0.03);
      this.trees.push({ x, z, r: rad, birch: isBirch });
      if (r < WORLD_RADIUS + 5) colliders.addCylinder(x, z, Math.max(0.18, rad), y, y + sc);
      placed++;
    }
    // hero tree for the tree house
    const ty = h(TREEHOUSE.x, TREEHOUSE.z) - 0.2;
    pineMs[0].push(make(TREEHOUSE.x, ty, TREEHOUSE.z, 26, 0.3));
    this.trees.push({ x: TREEHOUSE.x, z: TREEHOUSE.z, r: 0.8 });

    const cast = quality.shadows;
    this.meshes = [];
    pines.forEach((g, i) => { if (!pineMs[i].length) return;
      this.meshes.push(...chunkedInstances(scene, g.trunk, barkMat, pineMs[i], { cast, receive: true }));
      this.meshes.push(...chunkedInstances(scene, g.foliage, pineMat, pineMs[i], { cast, receive: true })); });
    birches.forEach((g, i) => { if (!birchMs[i].length) return;
      this.meshes.push(...chunkedInstances(scene, g.trunk, birchMat, birchMs[i], { cast, receive: true }));
      this.meshes.push(...chunkedInstances(scene, g.foliage, leafMat, birchMs[i], { cast, receive: true })); });

    // ---------------------------------------------------------------- grass
    const grassMat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85 });
    addWind(grassMat, 0.55, 1.6, 'grass');
    this.grassMat = grassMat;
    const clumps = [0, 1, 2, 3].map((i) => grassClump(mulberry32(50 + i)));
    const grassMs = clumps.map(() => []);
    let g = 0; tries = 0;
    while (g < quality.grass && tries < quality.grass * 12) {
      tries++;
      // denser near cabin and paths
      const a = rnd() * Math.PI * 2;
      const rr = Math.pow(rnd(), 0.75) * 95;
      const x = CABIN.x + Math.cos(a) * rr, z = CABIN.z + 20 + Math.sin(a) * rr * 1.1;
      if (Math.abs(x - CABIN.x) < 7.2 && z > -4.2 && z < 6.8) continue;
      const pd = pathDistance(x, z);
      if (pd < 0.7) continue;
      const hy = h(x, z);
      if (hy < WATER_LEVEL + 0.05) continue;
      const fd = forestDensity(x, z);
      if (rnd() < fd * 0.65) continue;
      if (Math.abs(x - DOCK.x) < 1.6 && z > DOCK.zStart - 1) continue;
      const sc = 0.7 + rnd() * 0.7 + (pd < 2 ? -0.2 : 0);
      grassMs[g % 4].push(make(x, hy - 0.02, z, sc, rnd() * 6.28, 0.2));
      g++;
    }
    clumps.forEach((c, i) => this.meshes.push(...chunkedInstances(scene, c, grassMat, grassMs[i], { receive: true })));

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
    this.meshes.push(...chunkedInstances(scene, fernGeo, fernMat, fernMs, { receive: true }));

    // ---------------------------------------------------------------- flowers
    const petal = new THREE.CircleGeometry(0.035, 6); petal.rotateX(-Math.PI / 2); petal.translate(0, 0.28, 0);
    const stem = new THREE.CylinderGeometry(0.003, 0.004, 0.28, 3); stem.translate(0, 0.14, 0);
    const flowerGeo = mergeGeometries([petal.toNonIndexed(), stem.toNonIndexed()]);
    const flowerMat = new THREE.MeshStandardMaterial({ roughness: 0.7 });
    addWind(flowerMat, 0.6, 2.0, 'flower');
    const fm = [];
    for (let i = 0; i < (quality.grass > 5000 ? 900 : 350); i++) {
      const a = rnd() * 6.28, rr = 9 + rnd() * 30;
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

  update(elapsed, weather) {
    windUniforms.uTime.value = elapsed;
    windUniforms.uWind.value = weather.w.gust ?? 0.4;
  }
}
