// Height field terrain: valley with a lake, cabin pad, trails and a ring of hills.
import * as THREE from 'three';
import { fbm2, smoothstep, lerp } from '../core/noise.js';
import { WATER_LEVEL, TERRAIN_SIZE, LAKE, CABIN, TREEHOUSE, CLEARING, PATHS } from '../core/layout.js';

const segs = [];
for (const p of PATHS) for (let i = 0; i < p.length - 1; i++) segs.push([p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]]);

/** Distance (m) from (x,z) to the nearest trail centre line. */
export function pathDistance(x, z) {
  let best = 1e9;
  for (const [ax, az, bx, bz] of segs) {
    const dx = bx - ax, dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    const ex = ax + dx * t - x, ez = az + dz * t - z;
    const d = ex * ex + ez * ez;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

export function lakeE(x, z) {
  const e = Math.hypot((x - LAKE.x) / LAKE.rx, (z - LAKE.z) / LAKE.rz);
  return e + fbm2(x / 40, z / 40, 3) * 0.12;
}

/** Forest density 0..1 used for tree scatter and forest-floor tint. */
export function forestDensity(x, z) {
  const r = Math.hypot(x - CABIN.x, z - CABIN.z);
  let d = smoothstep(-0.25, 0.35, fbm2(x / 70 + 3, z / 70 - 7, 3)) * 0.7 + 0.35;
  d *= smoothstep(14, 32, r);
  d *= smoothstep(1.08, 1.35, lakeE(x, z));
  d *= smoothstep(9, 18, Math.hypot(x - CLEARING.x, z - CLEARING.z));
  return Math.min(1, d);
}

function rawHeight(x, z) {
  const r = Math.hypot(x, z);
  const amp = 2.5 + smoothstep(25, 160, r) * 8;
  let h = fbm2(x / 95 + 10, z / 95 + 4, 5) * amp + fbm2(x / 22, z / 22, 3) * 0.8 + 1.2 * smoothstep(20, 80, r);
  // ring of hills enclosing the valley
  h += smoothstep(150, 290, r) * (34 + fbm2(x / 60, z / 60, 4) * 26);
  // lake basin
  const e = lakeE(x, z);
  const lakeH = WATER_LEVEL + (e - 1.0) * 7.0;
  const shore = smoothstep(0.82, 1.45, e);
  h = lerp(Math.max(lakeH, WATER_LEVEL - 4.2), Math.max(h, WATER_LEVEL + (e - 1) * 4 + 0.15), shore);
  // cabin pad (ellipse)
  const pad = Math.hypot((x - CABIN.x) / 15, (z - CABIN.z - 1) / 11);
  h = lerp(0, h, smoothstep(0.75, 1.9, pad));
  // clearing + treehouse flats
  const dc = Math.hypot(x - CLEARING.x, z - CLEARING.z);
  h = lerp(clearingH, h, smoothstep(8, 18, dc));
  const dt = Math.hypot(x - TREEHOUSE.x, z - TREEHOUSE.z);
  h = lerp(treeH, h, smoothstep(5, 12, dt));
  // trails are slightly worn into the ground
  const pd = pathDistance(x, z);
  h -= smoothstep(1.6, 0.3, pd) * 0.06;
  return h;
}
let clearingH = 0, treeH = 0;
{ clearingH = 0; treeH = 0;
  // evaluate pads using unflattened neighbourhood heights
  const base = (x, z) => fbm2(x / 95 + 10, z / 95 + 4, 5) * (2.5 + smoothstep(25, 160, Math.hypot(x, z)) * 8) + 1.2 * smoothstep(20, 80, Math.hypot(x, z));
  clearingH = base(CLEARING.x, CLEARING.z);
  treeH = base(TREEHOUSE.x, TREEHOUSE.z);
}

export class Terrain {
  constructor(quality, textures) {
    const seg = quality.terrainSeg;
    this.seg = seg; this.size = TERRAIN_SIZE; this.step = TERRAIN_SIZE / seg; this.half = TERRAIN_SIZE / 2;
    const n = seg + 1;
    const H = (this.H = new Float32Array(n * n));
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) H[j * n + i] = rawHeight(-this.half + i * this.step, -this.half + j * this.step);

    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const aPath = new Float32Array(pos.count);
    const col = new Float32Array(pos.count * 3);
    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v), z = pos.getZ(v);
      const i = Math.round((x + this.half) / this.step), j = Math.round((z + this.half) / this.step);
      const h = H[j * n + i];
      pos.setY(v, h);
      const pd = pathDistance(x, z);
      const e = lakeE(x, z);
      let dirt = smoothstep(1.7, 0.6, pd);
      dirt = Math.max(dirt, smoothstep(1.12, 1.0, e) * 0.9); // muddy shore
      const pad = Math.hypot((x - CABIN.x) / 9.5, (z - CABIN.z - 0.5) / 6.5);
      dirt = Math.max(dirt, smoothstep(1.15, 0.9, pad) * 0.8);
      dirt = Math.max(dirt, smoothstep(5, 2.5, Math.hypot(x - CLEARING.x, z - CLEARING.z)));
      aPath[v] = dirt;
      const fd = forestDensity(x, z);
      const tint = fbm2(x / 30, z / 30, 2) * 0.5 + 0.5;
      // forest floor = darker & browner, meadow = lighter
      let r = lerp(1.05, 0.78, fd) * (0.9 + tint * 0.2), g = lerp(1.05, 0.7, fd) * (0.9 + tint * 0.15), b = lerp(1.0, 0.62, fd);
      const under = smoothstep(1.02, 0.94, e); // wet sand/mud under water
      r = lerp(r, 0.55, under); g = lerp(g, 0.5, under); b = lerp(b, 0.42, under);
      const high = smoothstep(14, 40, h); // rocky highlands
      col[v * 3] = lerp(r, 0.8, high); col[v * 3 + 1] = lerp(g, 0.78, high); col[v * 3 + 2] = lerp(b, 0.76, high);
    }
    geo.setAttribute('aPath', new THREE.BufferAttribute(aPath, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    geo.computeBoundingSphere();

    const grass = textures.grass, dirt = textures.dirt;
    const rep = TERRAIN_SIZE / 3.5;
    grass.map.repeat.set(rep, rep); grass.normalMap.repeat.set(rep, rep);
    const mat = new THREE.MeshStandardMaterial({ map: grass.map, normalMap: grass.normalMap, vertexColors: true, roughness: 0.95, metalness: 0, normalScale: new THREE.Vector2(0.9, 0.9) });
    this.uniforms = { dirtMap: { value: dirt.map }, dirtNormal: { value: dirt.normalMap }, wet: { value: 0 }, uTime: { value: 0 }, uRain: { value: 0 }, uWL: { value: WATER_LEVEL }, uDay: { value: 1 } };
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, this.uniforms);
      sh.vertexShader = 'attribute float aPath;\nvarying float vPath;\nvarying vec3 vWPos;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvPath = aPath;\nvWPos = (modelMatrix * vec4(position, 1.0)).xyz;');
      sh.fragmentShader = `uniform sampler2D dirtMap; uniform sampler2D dirtNormal; uniform float wet; uniform float uTime; uniform float uRain; uniform float uWL; uniform float uDay;
varying float vPath; varying vec3 vWPos; float gDirtBlend; float gPuddle;
float th21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float tvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(th21(i), th21(i + vec2(1, 0)), f.x), mix(th21(i + vec2(0, 1)), th21(i + vec2(1, 1)), f.x), f.y); }
vec2 tRings(vec2 p, float t){ vec2 n = vec2(0.0); for (int L = 0; L < 2; L++){ vec2 g = p * 3.0 + float(L) * 11.0; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float r = th21(id); if (r > uRain) continue; float ph = fract(t * (0.9 + r * 0.5) + r * 9.0); vec2 c = (vec2(th21(id + 2.0), th21(id + 5.0)) - 0.5) * 0.5;
  vec2 d = f - c; float dl = length(d); float w = dl - ph * 0.4; n += d / max(dl, 1e-3) * exp(-w * w * 800.0) * (1.0 - ph) * sin(w * 80.0); } return n; }
` + sh.fragmentShader
        .replace('#include <map_fragment>', `
          vec4 gC = texture2D(map, vMapUv);
          vec4 dC = texture2D(dirtMap, vMapUv * 1.3);
          gDirtBlend = smoothstep(0.38, 0.62, vPath + (gC.g - 0.22) * 0.9);
          vec4 sampledDiffuseColor = mix(gC, dC, gDirtBlend);
          diffuseColor *= sampledDiffuseColor;
          diffuseColor.rgb *= 1.0 - wet * (0.22 + gDirtBlend * 0.18);
          // puddles collect in hollows of trails and mud when it has rained
          float pn = tvn(vWPos.xz * 0.45) * 0.65 + tvn(vWPos.xz * 1.7) * 0.35;
          gPuddle = smoothstep(0.58, 0.66, pn) * smoothstep(0.35, 0.75, gDirtBlend) * smoothstep(0.35, 0.8, wet) * step(uWL + 0.05, vWPos.y);
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.45 + vec3(0.01, 0.012, 0.015), gPuddle);
          // under water: lake-bed tint by depth + moving caustics
          float uw = uWL - vWPos.y;
          if (uw > 0.0) {
            vec2 cp = vWPos.xz * 0.9;
            float ca = abs(sin(cp.x * 2.1 + uTime * 0.9 + sin(cp.y * 1.7 + uTime * 0.6) * 1.6) * sin(cp.y * 2.3 - uTime * 0.7 + sin(cp.x * 1.3 - uTime * 0.5) * 1.4));
            float caust = pow(ca, 6.0) * exp(-uw * 0.9) * uDay;
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.13, 0.2, 0.17) * diffuseColor.rgb * 3.0, smoothstep(0.0, 2.5, uw) * 0.7);
            diffuseColor.rgb += vec3(0.5, 0.6, 0.45) * caust * 0.35;
          }
        `)
        .replace('#include <normal_fragment_maps>', `
          vec3 mapN = mix(texture2D(normalMap, vNormalMapUv).xyz, texture2D(dirtNormal, vNormalMapUv * 1.3).xyz, gDirtBlend) * 2.0 - 1.0;
          mapN.xy *= normalScale * (1.0 - gPuddle);
          mapN.xy += tRings(vWPos.xz, uTime) * gPuddle * 0.8;
          normal = normalize( tbn * mapN );
        `)
        .replace('#include <roughnessmap_fragment>', `float roughnessFactor = mix(roughness - wet * (0.25 + gDirtBlend * 0.35), 0.04, gPuddle);`);
    };
    mat.customProgramCacheKey = () => 'terrain';
    const mesh = (this.mesh = new THREE.Mesh(geo, mat));
    mesh.receiveShadow = true;
    mesh.name = 'terrain';
  }

  /** Exact height on the rendered triangle surface. */
  heightAt(x, z) {
    const n = this.seg + 1;
    let fx = (x + this.half) / this.step, fz = (z + this.half) / this.step;
    fx = Math.max(0, Math.min(this.seg - 1e-4, fx)); fz = Math.max(0, Math.min(this.seg - 1e-4, fz));
    const ix = Math.floor(fx), iz = Math.floor(fz);
    const u = fx - ix, v = fz - iz;
    const H = this.H;
    const ha = H[iz * n + ix], hb = H[(iz + 1) * n + ix], hc = H[(iz + 1) * n + ix + 1], hd = H[iz * n + ix + 1];
    if (u + v <= 1) return ha + (hd - ha) * u + (hb - ha) * v;
    return hc + (hb - hc) * (1 - u) + (hd - hc) * (1 - v);
  }

  normalAt(x, z, target = new THREE.Vector3()) {
    const e = 0.5;
    const hx = this.heightAt(x + e, z) - this.heightAt(x - e, z);
    const hz = this.heightAt(x, z + e) - this.heightAt(x, z - e);
    return target.set(-hx, 2 * e, -hz).normalize();
  }
}
