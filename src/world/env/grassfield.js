// Dense GPU grass that travels with the viewer: a tile of grass clumps whose
// positions wrap around the camera in the vertex shader, sampling a terrain
// height/density texture. Gives lush grass everywhere at a fixed cost.
import * as THREE from 'three';
import { DataUtils } from 'three';
import { mulberry32, smoothstep, fbm2 } from '../core/noise.js';
import { WATER_LEVEL, CLEARING, DOCK } from '../core/layout.js';
import { pathDistance, forestDensity } from './terrain.js';
import { windUniforms } from './vegetation.js';

export class GrassField {
  constructor(scene, quality, terrain) {
    const n = terrain.seg + 1, H = terrain.H, step = terrain.step, half = terrain.half;
    // RGBA half-float texture: R = height, G = grass density, B = height scale
    const data = new Uint16Array(n * n * 4);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = -half + i * step, z = -half + j * step, h = H[j * n + i];
      let m = smoothstep(0.5, 1.9, pathDistance(x, z));
      m *= smoothstep(WATER_LEVEL + 0.02, WATER_LEVEL + 0.25, h);
      m *= 1 - forestDensity(x, z) * 0.6;
      if (x > -7.6 && x < 7.6 && z > -4.8 && z < 7.6) m = 0;               // cabin, porch, steps
      if (Math.abs(x - DOCK.x) < 1.8 && z > 18 && z < 40) m *= 0.3;
      if (Math.hypot(x - CLEARING.x, z - CLEARING.z) < 2.2) m = 0;
      m *= 0.75 + 0.25 * (fbm2(x / 9, z / 9, 2) * 0.5 + 0.5);
      const tall = 0.75 + 0.6 * (fbm2(x / 25 + 3, z / 25, 3) * 0.5 + 0.5) + (1 - forestDensity(x, z)) * 0.1;
      const k = (j * n + i) * 4;
      data[k] = DataUtils.toHalfFloat(h); data[k + 1] = DataUtils.toHalfFloat(m); data[k + 2] = DataUtils.toHalfFloat(tall); data[k + 3] = DataUtils.toHalfFloat(1);
    }
    const tex = new THREE.DataTexture(data, n, n, THREE.RGBAFormat, THREE.HalfFloatType);
    tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.needsUpdate = true;

    this.layers = [];
    this.tex = tex;
    const near = quality.grassNear, far = quality.grassFar;
    this.layers.push(this.makeLayer(scene, n, step, half, near[0], near[1], near[2], 0, 1.0, 11));
    this.layers.push(this.makeLayer(scene, n, step, half, far[0], far[1], far[2], near[1] * 0.75, 1.35, 23));
  }

  makeLayer(scene, n, step, half, N, radius, blades, inner, scale, seed) {
    const tile = radius * 2;
    const r = mulberry32(seed);
    const pos = [], off = [], col = [], idx = [];
    let v0 = 0;
    for (let c = 0; c < N; c++) {
      const ox = r(), oz = r(), rr = r();
      const dry = r();
      for (let b = 0; b < blades; b++) {
        const a = r() * Math.PI * 2, d = r() * 0.17 * scale;
        const bx = Math.cos(a) * d, bz = Math.sin(a) * d;
        const h = (0.26 + r() * 0.4) * scale, w = (0.013 + r() * 0.012) * scale;
        const ry = r() * Math.PI, cx = Math.cos(ry), sz = Math.sin(ry), lean = (r() - 0.5) * 0.6;
        const shade = 0.75 + r() * 0.35;
        // mostly fresh green, a few yellowing blades
        const tint = dry < 0.1 ? [0.34, 0.31, 0.13] : dry < 0.35 ? [0.17, 0.27, 0.08] : [0.11, 0.24, 0.06];
        for (let s = 0; s <= 2; s++) {
          const t = s / 2, ww = w * (1 - t * 0.8), o = lean * t * t * h, y = t * h;
          for (const side of [-1, 1]) {
            pos.push(bx + cx * ww * side + o * sz, y, bz + sz * ww * side - o * cx);
            off.push(ox, oz, rr);
            const g = 0.38 + t * 0.7;
            col.push(tint[0] * g * shade, tint[1] * g * shade * (0.95 + t * 0.15), tint[2] * g * shade);
          }
        }
        pos.push(bx + lean * h * sz * 1.2, h * 1.08, bz - lean * h * cx * 1.2); off.push(ox, oz, rr); col.push(tint[0] * 1.35 * shade, tint[1] * 1.35 * shade, tint[2] * 1.2 * shade);
        idx.push(v0, v0 + 1, v0 + 2, v0 + 1, v0 + 3, v0 + 2, v0 + 2, v0 + 3, v0 + 4, v0 + 3, v0 + 5, v0 + 4, v0 + 4, v0 + 5, v0 + 6);
        v0 += 7;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aOff', new THREE.Float32BufferAttribute(off, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    const u = { uCam: { value: new THREE.Vector3() }, uTile: { value: tile }, uHM: { value: this.tex }, uN: { value: n }, uStep: { value: step }, uHalf: { value: half }, uInner: { value: inner } };
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.75 });
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u, { uTime: windUniforms.uTime, uWind: windUniforms.uWind });
      sh.vertexShader = `uniform vec3 uCam; uniform float uTile; uniform sampler2D uHM; uniform float uN; uniform float uStep; uniform float uHalf; uniform float uTime; uniform float uWind; uniform float uInner;
attribute vec3 aOff;\n` + sh.vertexShader
        .replace('#include <beginnormal_vertex>', `vec3 objectNormal = vec3(0.0, 1.0, 0.0);`)
        .replace('#include <begin_vertex>', `
          vec2 base = aOff.xy * uTile;
          vec2 wp = uCam.xz + mod(base - uCam.xz, uTile) - uTile * 0.5;
          vec2 tuv = ((wp + uHalf) / uStep + 0.5) / uN;
          vec4 hm = texture2D(uHM, tuv);
          float dist = length(wp - uCam.xz);
          float fade = (1.0 - smoothstep(uTile * 0.32, uTile * 0.5, dist)) * smoothstep(uInner * 0.85, uInner * 1.15 + 0.001, dist + (uInner > 0.0 ? 0.0 : 1.0));
          float sc = hm.g * fade * hm.b * (0.75 + aOff.z * 0.55);
          sc = sc < 0.1 ? 0.0 : sc;
          float a = aOff.z * 6.2831;
          vec3 lp = position * sc;
          lp.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * lp.xz;
          float hh = max(position.y, 0.0) * 1.7;
          float ph = wp.x * 0.15 + wp.y * 0.11;
          float gust = sin(uTime * 0.7 + wp.x * 0.05 + wp.y * 0.03) * 0.5 + 0.5;
          float sway = sin(uTime * 1.9 + ph) * 0.5 + sin(uTime * 4.1 + ph * 2.3) * 0.2;
          float k = hh * hh * (0.12 + uWind * (0.6 + gust * 0.8)) * sc;
          lp.x += (sway + uWind * 0.7) * k * 0.55;
          lp.z += sin(uTime * 1.3 + ph * 1.7) * k * 0.25;
          // part the grass around the walker
          vec2 away = wp - uCam.xz; float pd = length(away);
          lp.xz += away / max(pd, 0.01) * smoothstep(0.7, 0.0, pd) * position.y * 0.6;
          vec3 transformed = vec3(wp.x + lp.x, hm.r + lp.y - 0.02, wp.y + lp.z);
        `);
    };
    mat.customProgramCacheKey = () => 'grassfield' + seed;
    const mesh = new THREE.Mesh(g, mat);
    mesh.frustumCulled = false; mesh.receiveShadow = true;
    scene.add(mesh);
    return { mesh, u };
  }

  get mesh() { return this.layers[0].mesh; }
  setVisible(v) { for (const l of this.layers) l.mesh.visible = v; }

  update(camera) { for (const l of this.layers) l.u.uCam.value.copy(camera.position); }
}
