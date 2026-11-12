// Lake surface: planar-reflection water (high quality) or env-mapped water (low).
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { WATER_LEVEL, LAKE } from '../core/layout.js';

export class Lake {
  constructor(scene, quality, textures) {
    const geo = new THREE.PlaneGeometry(LAKE.rx * 2 + 70, LAKE.rz * 2 + 70, 1, 1);
    this.normals = textures.water;
    this.reflective = quality.waterReflections > 0;
    if (this.reflective) {
      this.mesh = new Water(geo, {
        textureWidth: quality.waterReflections, textureHeight: quality.waterReflections,
        waterNormals: this.normals, sunDirection: new THREE.Vector3(0, 1, 0), sunColor: 0xffffff,
        waterColor: 0x0b1a1c, distortionScale: 0.8, fog: true, alpha: 1,
      });
      this.mesh.material.uniforms.size.value = 5;
    } else {
      const n = this.normals.clone(); n.needsUpdate = true; n.repeat.set(18, 14);
      this.mat = new THREE.MeshStandardMaterial({ color: 0x0c1c1e, roughness: 0.06, metalness: 0.0, normalMap: n, normalScale: new THREE.Vector2(0.25, 0.25), envMapIntensity: 1.2 });
      this.mesh = new THREE.Mesh(geo, this.mat);
      this.tex = n;
    }
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(LAKE.x, WATER_LEVEL, LAKE.z);
    this.mesh.name = 'lake';
    this.mesh.receiveShadow = !this.reflective;
    scene.add(this.mesh);
    this.calm = 0;
  }

  update(dt, elapsed, sky, weather) {
    const w = weather.w;
    if (this.reflective) {
      const u = this.mesh.material.uniforms;
      u.time.value += dt * (0.35 + w.gust * 0.8);
      u.sunDirection.value.copy(sky.sun.position).sub(sky.sun.target.position).normalize();
      u.sunColor.value.copy(sky.sun.color).multiplyScalar(Math.min(1, sky.sun.intensity / 2.5));
      u.distortionScale.value = 0.5 + w.gust * 1.2 + w.rain * 0.8;
      const d = sky.state.daylight;
      u.waterColor.value.setRGB(0.03 + d * 0.03, 0.07 + d * 0.06, 0.08 + d * 0.06);
    } else {
      const sp = 0.004 + w.gust * 0.01;
      this.tex.offset.x += dt * sp; this.tex.offset.y += dt * sp * 0.6;
      const s = 0.2 + w.gust * 0.35 + w.rain * 0.3;
      this.mat.normalScale.set(s, s);
    }
  }
}
