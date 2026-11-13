// The lake: a custom water shader with depth-based clarity (you see the lake
// bed in the shallows), fresnel reflections (planar mirror on High/Ultra, sky
// gradient otherwise), sun glints, shoreline foam and procedural rain rings.
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { WATER_LEVEL, LAKE } from '../core/layout.js';

const vert = /* glsl */`
uniform mat4 textureMatrix;
varying vec4 vMirror; varying vec3 vWorld;
#include <common>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
void main(){
  vMirror = textureMatrix * vec4(position, 1.0);
  vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <logdepthbuf_vertex>
  #include <fog_vertex>
}`;

const frag = /* glsl */`
uniform sampler2D tDiffuse; uniform vec3 color; uniform float uMirror;
uniform sampler2D uNormal; uniform sampler2D uDepth; uniform vec4 uDepthRect;
uniform float uTime; uniform float uRain; uniform float uWind; uniform float uDay;
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uZenith; uniform vec3 uHorizon;
uniform vec3 uShallow; uniform vec3 uDeep;
varying vec4 vMirror; varying vec3 vWorld;
#include <common>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 rainRings(vec2 p, float t, float amount){
  vec2 n = vec2(0.0);
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    vec2 g = p * (2.2 + fl * 0.9) + fl * 17.3;
    vec2 id = floor(g); vec2 f = fract(g) - 0.5;
    float r = h21(id + fl * 7.0);
    if (r > amount) continue;
    vec2 c = vec2(h21(id + 3.1), h21(id + 9.7)) - 0.5; c *= 0.6;
    float ph = fract(t * (0.9 + r * 0.6) + r * 13.0);
    vec2 d = f - c; float dl = length(d);
    float w = dl - ph * 0.42;
    float ring = exp(-w * w * 700.0) * (1.0 - ph) * (1.0 - ph);
    n += d / max(dl, 1e-3) * ring * sin(w * 90.0);
  }
  return n;
}
vec3 tn(vec2 uv){ vec3 t = texture2D(uNormal, uv).xyz * 2.0 - 1.0; return t; }
void main(){
  #include <logdepthbuf_fragment>
  vec2 p = vWorld.xz;
  vec3 a = tn(p * 0.045 + vec2(uTime * 0.010, uTime * 0.006));
  vec3 b = tn(p * 0.13 - vec2(uTime * 0.017, -uTime * 0.011));
  vec3 c = tn(p * 0.42 + vec2(uTime * 0.045, uTime * 0.028));
  vec2 nxy = (a.xy * 0.9 + b.xy * 0.6 + c.xy * 0.35) * (0.22 + uWind * 0.75);
  nxy += rainRings(p, uTime, uRain) * 0.55 * min(1.0, uRain * 2.0);
  vec3 N = normalize(vec3(nxy.x, 1.0, nxy.y));
  vec3 V = normalize(cameraPosition - vWorld);
  float ndv = max(dot(N, V), 0.0);
  float fres = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);
  vec3 R = reflect(-V, N);
  vec3 refl = mix(uHorizon, uZenith, pow(clamp(R.y, 0.0, 1.0), 0.5));
  if (uMirror > 0.5) {
    vec4 mc = vMirror; mc.xy += N.xz * 0.9 * mc.w * 0.04;
    refl = mix(refl, texture2DProj(tDiffuse, mc).rgb, 0.92);
  }
  vec2 duv = (p - uDepthRect.xy) / uDepthRect.zw;
  float depth = max(0.0, texture2D(uDepth, duv).r);
  float path = depth / max(V.y, 0.12);
  vec3 body = mix(uShallow, uDeep, 1.0 - exp(-path * 0.28)) * (0.18 + uDay * 0.82);
  float clarity = 1.0 - exp(-path * 0.75);           // 0 = perfectly clear
  vec3 col = mix(body, refl, fres);
  float alpha = max(clarity, fres);
  // sun glints
  vec3 H = normalize(uSunDir + V);
  col += uSunCol * (pow(max(dot(N, H), 0.0), 600.0) * 6.0 + pow(max(dot(N, H), 0.0), 60.0) * 0.12);
  // gentle foam line along the shore
  float shore = smoothstep(0.16, 0.0, depth) * (0.55 + 0.45 * sin(uTime * 1.3 + depth * 55.0 + h21(floor(p * 3.0)) * 3.0));
  col = mix(col, vec3(0.92, 0.95, 0.96) * (0.15 + uDay * 0.85), shore * 0.45);
  alpha = max(alpha, shore * 0.5);
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

export class Lake {
  constructor(scene, quality, textures, terrain) {
    const W = LAKE.rx * 2 + 70, D = LAKE.rz * 2 + 70;
    const geo = new THREE.PlaneGeometry(W, D, 1, 1);
    // depth map over the lake rectangle (water level minus lake bed height)
    const N = 192, data = new Float32Array(N * N);
    const x0 = LAKE.x - W / 2, z0 = LAKE.z - D / 2;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) data[j * N + i] = WATER_LEVEL - terrain.heightAt(x0 + (i + 0.5) / N * W, z0 + (j + 0.5) / N * D);
    const depthTex = new THREE.DataTexture(data, N, N, THREE.RedFormat, THREE.FloatType);
    depthTex.magFilter = depthTex.minFilter = THREE.NearestFilter; // float linear filtering is not universal
    depthTex.needsUpdate = true;
    this.depthTex = depthTex;
    const normals = textures.water;
    const uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      color: { value: new THREE.Color(1, 1, 1) }, tDiffuse: { value: null }, textureMatrix: { value: new THREE.Matrix4() },
      uMirror: { value: 0 }, uNormal: { value: null }, uDepth: { value: null }, uDepthRect: { value: new THREE.Vector4(x0, z0, W, D) },
      uTime: { value: 0 }, uRain: { value: 0 }, uWind: { value: 0.3 }, uDay: { value: 1 },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color() }, uZenith: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() },
      uShallow: { value: new THREE.Color(0.16, 0.26, 0.22) }, uDeep: { value: new THREE.Color(0.02, 0.06, 0.07) },
    }]);
    this.reflective = quality.waterReflections > 0;
    const shader = { uniforms, vertexShader: vert, fragmentShader: frag };
    if (this.reflective) {
      this.mesh = new Reflector(geo, { textureWidth: quality.waterReflections, textureHeight: quality.waterReflections, clipBias: 0.02, shader });
      this.mesh.material.uniforms.uMirror.value = 1;
    } else {
      const m = new THREE.ShaderMaterial(shader);
      this.mesh = new THREE.Mesh(geo, m);
    }
    const mat = this.mesh.material;
    mat.transparent = true; mat.fog = true; mat.depthWrite = true;
    mat.uniforms.uNormal.value = normals; mat.uniforms.uDepth.value = depthTex;
    this.u = mat.uniforms;
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(LAKE.x, WATER_LEVEL, LAKE.z);
    this.mesh.name = 'lake';
    this.mesh.renderOrder = 1;
    scene.add(this.mesh);
  }

  update(dt, elapsed, sky, weather) {
    const w = weather.w, u = this.u;
    u.uTime.value = elapsed;
    u.uRain.value = w.rain;
    u.uWind.value += (w.gust - u.uWind.value) * Math.min(1, dt);
    u.uDay.value = sky.state.daylight;
    u.uSunDir.value.copy(sky.sun.position).sub(sky.sun.target.position).normalize();
    u.uSunCol.value.copy(sky.sun.color).multiplyScalar(Math.min(1.2, sky.sun.intensity / 2.5));
    u.uZenith.value.copy(sky.uniforms.zenith.value);
    u.uHorizon.value.copy(sky.uniforms.horizon.value);
  }
}
