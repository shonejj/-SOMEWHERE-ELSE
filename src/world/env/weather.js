// Dynamic weather: smooth transitions, rain streaks, ground splashes, lightning.
import * as THREE from 'three';
import { mulberry32, clamp } from '../core/noise.js';

export const WEATHER_PRESETS = {
  clear:  { cloud: 0.12, rain: 0, fog: 0.04, wind: 0.22, storm: 0 },
  cloudy: { cloud: 0.72, rain: 0, fog: 0.14, wind: 0.45, storm: 0 },
  rain:   { cloud: 0.93, rain: 0.62, fog: 0.3, wind: 0.5, storm: 0 },
  storm:  { cloud: 1.0, rain: 1.0, fog: 0.35, wind: 0.95, storm: 1 },
  fog:    { cloud: 0.6, rain: 0.06, fog: 1.0, wind: 0.08, storm: 0 },
};
const AUTO_SEQ = [['rain', 30], ['cloudy', 24], ['clear', 20], ['fog', 14], ['storm', 12]];

const rainVert = /* glsl */`
attribute vec4 aSeed; attribute float aEnd;
uniform vec3 uCam; uniform float uTime; uniform vec3 uBox; uniform float uAmount; uniform vec2 uWind;
uniform vec4 uRoof; uniform float uRoofY; uniform vec4 uRoof2; uniform float uRoof2Y;
varying float vA;
void main(){
  float speed = 8.5 + aSeed.w * 3.5;
  float fall = mod(aSeed.y * uBox.y + uTime * speed, uBox.y);
  vec3 p;
  p.y = uCam.y + uBox.y * 0.55 - fall;
  p.x = uCam.x + mod(aSeed.x * uBox.x + uWind.x * fall * 0.12 - uCam.x, uBox.x) - uBox.x * 0.5;
  p.z = uCam.z + mod(aSeed.z * uBox.z + uWind.y * fall * 0.12 - uCam.z, uBox.z) - uBox.z * 0.5;
  vec3 v = normalize(vec3(uWind.x * 0.12, -1.0, uWind.y * 0.12));
  p += v * aEnd * (0.32 + aSeed.w * 0.2);
  float hidden = step(uAmount, fract(aSeed.w * 7.31));
  if (p.x > uRoof.x && p.x < uRoof.z && p.z > uRoof.y && p.z < uRoof.w && p.y < uRoofY) hidden = 1.0;
  if (p.x > uRoof2.x && p.x < uRoof2.z && p.z > uRoof2.y && p.z < uRoof2.w && p.y < uRoof2Y) hidden = 1.0;
  vA = aEnd;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  if (hidden > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;
const rainFrag = /* glsl */`
uniform vec3 uColor; uniform float uOpacity; varying float vA;
void main(){ gl_FragColor = vec4(uColor, uOpacity * (0.25 + vA * 0.75)); }`;

export class Weather {
  constructor(scene, quality, groundQuery) {
    this.w = { cloud: 0.9, rain: 0.6, fog: 0.3, wind: 0.5, storm: 0, flash: 0, wet: 0.8 };
    this.target = { ...WEATHER_PRESETS.rain };
    this.mode = 'auto';
    this.autoName = 'rain';
    this.autoTimer = 240 + Math.random() * 120;
    this.rnd = mulberry32(Date.now() & 0xffff);
    this.lightningTimer = 6;
    this.flashSeq = [];
    this.onThunder = null;
    this.windDir = new THREE.Vector2(1, 0.3).normalize();
    this.groundQuery = groundQuery;

    const n = quality.rain;
    const seed = new Float32Array(n * 2 * 4), end = new Float32Array(n * 2), pos = new Float32Array(n * 2 * 3);
    const r = mulberry32(3);
    for (let i = 0; i < n; i++) {
      const s = [r(), r(), r(), r()];
      for (let k = 0; k < 2; k++) { seed.set(s, (i * 2 + k) * 4); end[i * 2 + k] = k; }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
    this.rainU = {
      uCam: { value: new THREE.Vector3() }, uTime: { value: 0 }, uBox: { value: new THREE.Vector3(44, 22, 44) }, uAmount: { value: 0 },
      uWind: { value: new THREE.Vector2() }, uRoof: { value: new THREE.Vector4(-6.8, -4.2, 6.8, 4.2) }, uRoofY: { value: 5.9 },
      uRoof2: { value: new THREE.Vector4(-6.5, 3.5, 2.8, 6.6) }, uRoof2Y: { value: 3.3 },
      uColor: { value: new THREE.Color(0.75, 0.8, 0.88) }, uOpacity: { value: 0.35 },
    };
    const m = new THREE.ShaderMaterial({ uniforms: this.rainU, vertexShader: rainVert, fragmentShader: rainFrag, transparent: true, depthWrite: false, fog: false });
    this.rain = new THREE.LineSegments(g, m);
    this.rain.frustumCulled = false;
    scene.add(this.rain);

    // splashes
    this.splashN = quality.rain > 5000 ? 260 : 120;
    const sp = new Float32Array(this.splashN * 3);
    this.splashLife = new Float32Array(this.splashN);
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.splashAlpha = new Float32Array(this.splashN);
    sg.setAttribute('alpha', new THREE.BufferAttribute(this.splashAlpha, 1));
    const sm = new THREE.ShaderMaterial({
      uniforms: { uColor: this.rainU.uColor, uSize: { value: 70 } },
      vertexShader: `attribute float alpha; varying float vA; uniform float uSize; void main(){ vA = alpha; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = uSize * (0.3 + (1.0-alpha)) / -mv.z; gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uColor; varying float vA; void main(){ vec2 c = gl_PointCoord-0.5; float d = length(c); float ring = smoothstep(0.5,0.35,d)*smoothstep(0.15,0.3,d); gl_FragColor = vec4(uColor, ring*vA*0.35); }`,
      transparent: true, depthWrite: false,
    });
    this.splash = new THREE.Points(sg, sm);
    this.splash.frustumCulled = false;
    scene.add(this.splash);
    this.fog = new THREE.FogExp2(0x888888, 0.01);
    scene.fog = this.fog;
  }

  setMode(mode) {
    this.mode = mode;
    if (mode !== 'auto') this.target = { ...WEATHER_PRESETS[mode] };
    else { this.autoTimer = 200; this.target = { ...WEATHER_PRESETS[this.autoName] }; }
  }

  pickAuto() {
    const total = AUTO_SEQ.reduce((a, b) => a + b[1], 0);
    let x = this.rnd() * total, name = 'rain';
    for (const [n, wt] of AUTO_SEQ) { if ((x -= wt) <= 0) { name = n; break; } }
    if (name === this.autoName) name = 'cloudy';
    this.autoName = name;
    this.target = { ...WEATHER_PRESETS[name] };
    this.autoTimer = 180 + this.rnd() * 260;
  }

  get name() { return this.mode === 'auto' ? this.autoName : this.mode; }

  update(dt, elapsed, camera, sky) {
    const w = this.w;
    if (this.mode === 'auto') { this.autoTimer -= dt; if (this.autoTimer <= 0) this.pickAuto(); }
    const k = 1 - Math.exp(-dt / 35);
    for (const key of ['cloud', 'rain', 'fog', 'wind', 'storm']) w[key] += (this.target[key] - w[key]) * k;
    // wetness follows rain quickly, dries slowly
    const wetT = clamp(w.rain * 1.5, 0, 1);
    w.wet += (wetT - w.wet) * (1 - Math.exp(-dt / (wetT > w.wet ? 20 : 150)));
    // wind gusts
    const gust = 0.75 + 0.25 * Math.sin(elapsed * 0.31) * Math.sin(elapsed * 0.13 + 1.3);
    w.gust = w.wind * gust;
    this.windDir.set(Math.cos(elapsed * 0.01) , 0.3 + Math.sin(elapsed * 0.017) * 0.3).normalize();

    // lightning
    if (w.storm > 0.5) {
      this.lightningTimer -= dt;
      if (this.lightningTimer <= 0) {
        this.lightningTimer = 7 + this.rnd() * 22;
        const s = this.rnd() * 0.6 + 0.4;
        this.flashSeq = [[0, s], [0.07, 0], [0.12, s * 0.7], [0.2, 0.15], [0.32, s * 0.9], [0.45, 0]];
        this.flashT = 0;
        const dist = 0.3 + this.rnd() * 0.7;
        this.onThunder?.(dist, 0.8 + dist * 3.5);
      }
    }
    if (this.flashSeq.length) {
      this.flashT += dt;
      let f = 0;
      for (const [t, v] of this.flashSeq) if (this.flashT >= t) f = v;
      w.flash = f;
      if (this.flashT > 0.5) { this.flashSeq = []; w.flash = 0; }
    } else w.flash = 0;

    // rain
    const U = this.rainU;
    U.uCam.value.copy(camera.position);
    U.uTime.value = elapsed;
    U.uAmount.value = clamp(w.rain * 1.05, 0, 1);
    U.uWind.value.set(this.windDir.x, this.windDir.y).multiplyScalar(w.gust * 9);
    const lightK = 0.12 + sky.state.daylight * 0.75 + w.flash;
    U.uColor.value.setRGB(0.7 * lightK, 0.75 * lightK, 0.82 * lightK);
    this.rain.visible = w.rain > 0.02;

    // splashes
    const pos = this.splash.geometry.attributes.position;
    const spawnRate = w.rain * this.splashN * 3;
    let toSpawn = spawnRate * dt;
    for (let i = 0; i < this.splashN; i++) {
      if (this.splashLife[i] > 0) { this.splashLife[i] -= dt * 3.5; this.splashAlpha[i] = Math.max(0, this.splashLife[i]); continue; }
      if (toSpawn > 0 && this.rnd() < toSpawn) {
        toSpawn -= 1;
        const a = this.rnd() * Math.PI * 2, r = 1 + Math.sqrt(this.rnd()) * 13;
        const x = camera.position.x + Math.cos(a) * r, z = camera.position.z + Math.sin(a) * r;
        const y = this.groundQuery(x, z, camera.position.y);
        if (y === null) { this.splashAlpha[i] = 0; continue; }
        pos.setXYZ(i, x, y + 0.03, z);
        this.splashLife[i] = 1;
        if (this.splashFx && r < 9) this.splashFx(x, y, z);
      } else this.splashAlpha[i] = 0;
    }
    pos.needsUpdate = true;
    this.splash.geometry.attributes.alpha.needsUpdate = true;
    this.splash.visible = w.rain > 0.05;

    // fog
    const night = sky.state.night;
    this.fog.density = 0.0028 + w.fog * 0.03 + w.rain * 0.005 + night * 0.002;
    this.fog.color.copy(sky.fogColor);
  }
}
