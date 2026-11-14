// Procedural sky dome (gradient, sun, moon, stars, clouds) + time-of-day lighting.
import * as THREE from 'three';
import { smoothstep, lerp, clamp } from '../core/noise.js';

const vert = /* glsl */`
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const frag = /* glsl */`
uniform vec3 zenith; uniform vec3 horizon; uniform vec3 groundCol;
uniform vec3 sunDir; uniform vec3 sunCol; uniform vec3 moonDir;
uniform float cloudCover; uniform float cloudDark; uniform float stars; uniform float time;
uniform float flash; uniform float daylight; uniform float haze; uniform float uPix;
varying vec3 vDir;
float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<6;i++){ s+=a*vnoise(p); p=p*2.03+vec2(1.7,9.2); a*=0.5; } return s; }
void main(){
  vec3 d = normalize(vDir);
  float y = d.y;
  float t = pow(clamp(y,0.0,1.0), 0.45);
  vec3 col = mix(horizon, zenith, t);
  col = mix(col, groundCol, smoothstep(0.0, -0.08, y));
  float sd = max(dot(d, sunDir), 0.0);
  float sunVis = smoothstep(-0.12, 0.02, sunDir.y);
  col += sunCol * (pow(sd, 6.0) * 0.35 + pow(sd, 64.0) * 0.6) * sunVis * (1.0 - cloudCover * 0.75);
  // stars: three layers of point stars in a spherical grid, sized to stay crisp at any zoom
  if (stars > 0.01 && y > -0.05) {
    vec2 sph = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0)));
    float sacc = 0.0; vec3 scol = vec3(0.0);
    for (int L = 0; L < 3; L++) {
      float fl = float(L);
      float cells = 70.0 + fl * 110.0;
      vec2 g = sph * cells / 3.14159;
      vec2 id = floor(g);
      float h = h21(id + fl * 31.7);
      vec2 c = vec2(h21(id + 4.3 + fl), h21(id + 9.1 + fl));
      vec2 off = (g - id - c) * 3.14159 / cells; off.x *= cos(sph.y);
      float dist = length(off);
      float bright = pow(h, 6.0 - fl) * (1.6 - fl * 0.4);
      float r = max(uPix * 0.9, 0.00025);
      float st = smoothstep(r, r * 0.25, dist) * bright;
      float tw = 0.75 + 0.25 * sin(time * (1.5 + h * 7.0) + h * 50.0);
      vec3 tint = mix(vec3(1.0, 0.82, 0.68), vec3(0.75, 0.85, 1.0), h21(id + 2.2));
      scol += tint * st * tw;
    }
    float mw = smoothstep(0.32, 0.0, abs(dot(d, normalize(vec3(0.3, 0.5, -0.8))))) * fbm(d.xz * 9.0 + d.y * 3.0);
    col += (scol * 1.6 + vec3(0.5, 0.55, 0.7) * mw * 0.06) * stars * smoothstep(0.0, 0.15, y);
  }
  // sun disk
  col += sunCol * smoothstep(0.99955, 0.9998, sd) * 18.0 * sunVis * (1.0 - cloudCover * 0.9);
  // moon: a lit sphere with maria, craters and the correct phase from the sun
  float md = dot(d, moonDir);
  vec3 mR = normalize(cross(moonDir, vec3(0.0, 1.0, 0.0))); vec3 mU = cross(mR, moonDir);
  vec2 mp = vec2(dot(d, mR), dot(d, mU)) / 0.0095;
  float mr = length(mp);
  if (md > 0.0 && mr < 1.0) {
    vec3 n = normalize(mR * mp.x + mU * mp.y - moonDir * sqrt(1.0 - mr * mr));
    float lit = clamp(dot(n, normalize(sunDir - moonDir * dot(sunDir, moonDir) + moonDir * 0.0001)), 0.0, 1.0);
    float maria = smoothstep(0.45, 0.7, fbm(mp * 2.2 + 3.0));
    float crat = fbm(mp * 9.0) * 0.25;
    vec3 mc = vec3(0.86, 0.86, 0.82) * (1.0 - maria * 0.35 - crat) * (0.06 + lit * 1.6);
    float edge = smoothstep(1.0, 0.96, mr);
    col = mix(col, mc * (1.0 - cloudCover * 0.85) + col * 0.15, edge * (1.0 - daylight * 0.6));
  }
  col += vec3(0.4, 0.45, 0.6) * pow(max(md, 0.0), 400.0) * 0.2 * (1.0 - cloudCover * 0.6) * (1.0 - daylight);
  // clouds
  if (y > -0.02) {
    vec2 p = d.xz / (y + 0.12) * 1.3 + vec2(time * 0.006, time * 0.0025);
    float n = fbm(p * 1.4);
    float n2 = fbm(p * 3.1 + 5.0);
    float cov = cloudCover;
    float c = smoothstep(1.0 - cov - 0.08, 1.0 - cov + 0.35, n * 0.75 + n2 * 0.35);
    c = clamp(c + cov * cov * 0.6, 0.0, 1.0);
    c *= smoothstep(-0.02, 0.18, y);
    float lit = 0.5 + 0.5 * (n2 - 0.4);
    vec3 cc = mix(horizon * 0.9, vec3(1.0), 0.35) * (0.55 + lit * 0.6) * mix(1.0, 0.45, cloudDark);
    cc += sunCol * pow(sd, 4.0) * 0.4 * sunVis * (1.0 - cloudDark);
    col = mix(col, cc, c * 0.95);
  }
  col = mix(col, horizon, haze * (1.0 - smoothstep(0.0, 0.35, abs(y))));
  col += vec3(0.75,0.8,1.0) * flash * (0.6 + 0.4 * fbm(d.xz * 4.0 + time));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const C = (r, g, b) => new THREE.Color(r, g, b);
const DAY_Z = C(0.16, 0.34, 0.72), DAY_H = C(0.6, 0.72, 0.86);
const SET_Z = C(0.2, 0.24, 0.42), SET_H = C(1.0, 0.5, 0.26);
const NIGHT_Z = C(0.004, 0.008, 0.02), NIGHT_H = C(0.02, 0.03, 0.055);
const tmp = new THREE.Color();

export class SkySystem {
  constructor(scene, renderer, quality) {
    this.uniforms = {
      zenith: { value: new THREE.Color() }, horizon: { value: new THREE.Color() }, groundCol: { value: new THREE.Color() },
      sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color(1, 1, 1) }, moonDir: { value: new THREE.Vector3(0, -1, 0) },
      cloudCover: { value: 0.3 }, cloudDark: { value: 0 }, stars: { value: 0 }, time: { value: 0 }, flash: { value: 0 }, uPix: { value: 0.002 },
      daylight: { value: 1 }, haze: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: vert, fragmentShader: frag, side: THREE.BackSide, depthWrite: false, fog: false });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), mat);
    this.mesh.frustumCulled = false; this.mesh.renderOrder = -10;
    scene.add(this.mesh);

    this.envScene = new THREE.Scene();
    this.envMesh = new THREE.Mesh(this.mesh.geometry, mat);
    this.envScene.add(this.envMesh);
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.renderer = renderer; this.scene = scene;
    this.envTimer = 99; this.lastEnvKey = -1;

    this.sun = new THREE.DirectionalLight(0xffffff, 2);
    this.sun.castShadow = quality.shadows;
    const s = this.sun.shadow;
    s.mapSize.set(quality.shadowSize, quality.shadowSize);
    const ext = 38;
    s.camera.left = -ext; s.camera.right = ext; s.camera.top = ext; s.camera.bottom = -ext;
    s.camera.near = 1; s.camera.far = 220; s.bias = -0.0004; s.normalBias = 0.04;
    scene.add(this.sun, this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xbfd4ff, 0x3a3020, 0.6);
    scene.add(this.hemi);
    this.fogColor = new THREE.Color();
    this.state = { daylight: 1, night: 0, sunElev: 1 };
    this.sunDir = new THREE.Vector3(); this.moonDir = new THREE.Vector3();
  }

  /** hour: 0..24, w: weather state */
  update(dt, hour, w, focus, elapsed) {
    const a = ((hour - 6) / 24) * Math.PI * 2;
    this.sunDir.set(Math.cos(a), Math.sin(a) * 0.86, 0.42).normalize();
    this.moonDir.set(Math.cos(a + Math.PI) * 0.9, Math.sin(a + Math.PI) * 0.8, -0.35).normalize();
    const se = this.sunDir.y;
    const day = smoothstep(-0.12, 0.2, se);
    const sunset = smoothstep(0.35, 0.05, Math.abs(se - 0.03)) * smoothstep(-0.2, 0.0, se);
    const overcast = clamp(w.cloud * 0.85 + w.rain * 0.3, 0, 1);
    const dark = clamp(w.storm * 0.8 + w.rain * 0.35, 0, 1);

    const U = this.uniforms;
    // zenith
    U.zenith.value.copy(NIGHT_Z).lerp(DAY_Z, day).lerp(SET_Z, sunset * 0.6);
    U.horizon.value.copy(NIGHT_H).lerp(DAY_H, day).lerp(SET_H, sunset * 0.75);
    const gray = (0.08 + 0.55 * day) * (1 - dark * 0.55);
    tmp.setRGB(gray * 0.95, gray, gray * 1.05);
    U.zenith.value.lerp(tmp, overcast * 0.85);
    tmp.multiplyScalar(1.1);
    U.horizon.value.lerp(tmp, overcast * 0.8);
    U.horizon.value.lerp(tmp.setRGB(0.5, 0.52, 0.55).multiplyScalar(0.1 + day * 0.9), w.fog * 0.7);
    U.groundCol.value.copy(U.horizon.value).multiplyScalar(0.6);
    U.sunCol.value.setRGB(1.0, lerp(0.55, 0.92, smoothstep(0.0, 0.35, se)), lerp(0.3, 0.82, smoothstep(0.0, 0.4, se)));
    U.sunDir.value.copy(this.sunDir); U.moonDir.value.copy(this.moonDir);
    U.cloudCover.value = clamp(w.cloud, 0, 1);
    U.cloudDark.value = dark;
    U.stars.value = (1 - day) * (1 - overcast);
    U.time.value = elapsed;
    U.daylight.value = day;
    U.haze.value = clamp(w.fog * 0.9 + w.rain * 0.3, 0, 1);
    U.flash.value = w.flash;

    // directional light: sun by day, moon by night
    const useSun = se > -0.04;
    const ld = useSun ? this.sunDir : this.moonDir;
    const sunI = smoothstep(-0.04, 0.18, se) * 3.2 * (1 - overcast * 0.78);
    const moonI = smoothstep(0.0, 0.25, this.moonDir.y) * 0.32 * (1 - overcast * 0.75);
    this.sun.intensity = (useSun ? sunI : moonI) + w.flash * 2.5;
    if (useSun) this.sun.color.copy(U.sunCol.value).lerp(tmp.setRGB(0.85, 0.88, 0.95), overcast);
    else this.sun.color.setRGB(0.6, 0.7, 1.0);
    this.sun.position.copy(focus).addScaledVector(ld, 100);
    this.sun.target.position.copy(focus);
    // snap shadow camera to texels to avoid shimmering
    this.sun.target.updateMatrixWorld();

    this.hemi.color.copy(U.zenith.value).lerp(U.horizon.value, 0.5).multiplyScalar(1.0);
    this.hemi.groundColor.setRGB(0.18, 0.15, 0.1).multiplyScalar(0.25 + day * 0.75);
    this.hemi.intensity = 0.12 + day * 1.0 + w.flash * 3;

    this.fogColor.copy(U.horizon.value).lerp(U.zenith.value, 0.25);
    this.state.daylight = day; this.state.night = 1 - day; this.state.sunElev = se; this.state.sunset = sunset; this.state.overcast = overcast;

    // refresh image based lighting when the sky changed noticeably
    this.envTimer += dt;
    const key = Math.round(se * 40) * 1000 + Math.round(w.cloud * 12) * 10 + Math.round(w.fog * 5);
    if ((key !== this.lastEnvKey && this.envTimer > 1.5) || this.envTimer > 30) {
      this.envTimer = 0; this.lastEnvKey = key;
      const flash = U.flash.value; U.flash.value = 0;
      const rt = this.pmrem.fromScene(this.envScene, 0, 1, 1000);
      U.flash.value = flash;
      if (this.envRT) this.envRT.dispose();
      this.envRT = rt;
      this.scene.environment = rt.texture;
    }
  }
}
