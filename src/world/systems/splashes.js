// Pooled water droplets: splashes from feet, swimming strokes, thrown objects,
// jumping fish and roof drips.
import * as THREE from 'three';
import { WATER_LEVEL } from '../core/layout.js';

export class Splashes {
  constructor(scene, n = 600) {
    this.n = n;
    this.pos = new Float32Array(n * 3); this.vel = new Float32Array(n * 3);
    this.life = new Float32Array(n); this.size = new Float32Array(n); this.alpha = new Float32Array(n);
    this.floor = new Float32Array(n).fill(-100);
    this.kind = new Uint8Array(n); // 0 droplet, 1 drip (falls, then makes a tiny splash), 2 bubble (rises)
    const g = new THREE.BufferGeometry();
    this.pa = new THREE.BufferAttribute(this.pos, 3); this.pa.setUsage(THREE.DynamicDrawUsage);
    this.aa = new THREE.BufferAttribute(this.alpha, 1); this.aa.setUsage(THREE.DynamicDrawUsage);
    this.sa = new THREE.BufferAttribute(this.size, 1); this.sa.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', this.pa); g.setAttribute('alpha', this.aa); g.setAttribute('size', this.sa);
    this.u = { uLight: { value: new THREE.Color(1, 1, 1) } };
    const m = new THREE.ShaderMaterial({
      uniforms: this.u, transparent: true, depthWrite: false,
      vertexShader: `attribute float alpha; attribute float size; varying float vA;
        void main(){ vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * 260.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uLight; varying float vA;
        void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c);
          float body = smoothstep(0.5, 0.2, d); float hi = smoothstep(0.22, 0.0, length(c - vec2(-0.12, -0.12)));
          gl_FragColor = vec4(uLight * (0.75 + hi * 0.6), body * vA * 0.75); }`,
    });
    this.points = new THREE.Points(g, m); this.points.frustumCulled = false; scene.add(this.points);
    this.next = 0;
  }

  spawn(x, y, z, vx, vy, vz, size, life, kind = 0, floor = -100) {
    const i = this.next; this.next = (this.next + 1) % this.n;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    this.size[i] = size; this.life[i] = life; this.kind[i] = kind; this.floor[i] = floor;
  }

  /** A burst of droplets on the water surface at p. */
  burst(p, strength = 1, count = 18, y = WATER_LEVEL) {
    const n = Math.round(count * strength);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random();
      const up = (1.2 + Math.random() * 2.2) * strength;
      this.spawn(p.x + Math.cos(a) * r * 0.15, y + 0.02, p.z + Math.sin(a) * r * 0.15, Math.cos(a) * (0.4 + r) * strength, up, Math.sin(a) * (0.4 + r) * strength, 0.012 + Math.random() * 0.02 * strength, 0.5 + Math.random() * 0.5, 0, y - 0.02);
    }
  }

  /** A single falling drop that splashes when it reaches floorY. */
  drip(x, y, z, floorY) { this.spawn(x, y, z, 0, -0.5, 0, 0.014, 3, 1, floorY); }

  bubbles(p, n = 6) { for (let i = 0; i < n; i++) this.spawn(p.x + (Math.random() - 0.5) * 0.3, p.y + (Math.random() - 0.5) * 0.2, p.z + (Math.random() - 0.5) * 0.3, 0, 0.2, 0, 0.01 + Math.random() * 0.015, 4, 2); }

  update(dt, light) {
    this.u.uLight.value.copy(light);
    const P = this.pos, V = this.vel;
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) { this.alpha[i] = 0; continue; }
      this.life[i] -= dt;
      if (this.kind[i] === 2) {
        V[i * 3 + 1] = Math.min(0.9, V[i * 3 + 1] + dt * 1.5);
        V[i * 3] = Math.sin(this.life[i] * 9 + i) * 0.08; V[i * 3 + 2] = Math.cos(this.life[i] * 7 + i) * 0.08;
        if (P[i * 3 + 1] > WATER_LEVEL - 0.03) { this.life[i] = 0; continue; }
      } else V[i * 3 + 1] -= 9.8 * dt;
      P[i * 3] += V[i * 3] * dt; P[i * 3 + 1] += V[i * 3 + 1] * dt; P[i * 3 + 2] += V[i * 3 + 2] * dt;
      if (this.kind[i] !== 2 && P[i * 3 + 1] < this.floor[i]) {
        if (this.kind[i] === 1) {
          // a drip landing: a few tiny droplets
          const x = P[i * 3], y = this.floor[i], z = P[i * 3 + 2];
          this.life[i] = 0;
          for (let k = 0; k < 3; k++) { const a = Math.random() * 6.28; this.spawn(x, y + 0.01, z, Math.cos(a) * 0.4, 0.6 + Math.random() * 0.6, Math.sin(a) * 0.4, 0.008, 0.3, 0, y - 0.01); }
          continue;
        }
        this.life[i] = 0;
      }
      this.alpha[i] = Math.min(1, this.life[i] * 3);
    }
    this.pa.needsUpdate = true; this.aa.needsUpdate = true; this.sa.needsUpdate = true;
  }
}
