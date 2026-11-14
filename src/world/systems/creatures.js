// Procedural animal models: deer (doe/buck), mallard ducks, rabbits and lake fish.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const V2 = (x, y) => new THREE.Vector2(x, y);
/** A body of revolution along +z from a profile of [radius, z] pairs. */
function along(profile, seg = 16) {
  const g = new THREE.LatheGeometry(profile.map(([r, z]) => V2(Math.max(0.0005, r), z)), seg);
  g.rotateX(Math.PI / 2); // lathe y -> z
  return g;
}
/** Vertex-colour a geometry with a top→belly gradient. */
function shade(g, top, belly, cutoff = 0) {
  const p = g.attributes.position, c = new Float32Array(p.count * 3);
  g.computeBoundingBox(); const bb = g.boundingBox;
  for (let i = 0; i < p.count; i++) {
    const t = THREE.MathUtils.smoothstep((p.getY(i) - bb.min.y) / Math.max(1e-4, bb.max.y - bb.min.y), cutoff, cutoff + 0.35);
    c[i * 3] = belly[0] + (top[0] - belly[0]) * t; c[i * 3 + 1] = belly[1] + (top[1] - belly[1]) * t; c[i * 3 + 2] = belly[2] + (top[2] - belly[2]) * t;
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}

export function deerModel(buck = false, T) {
  const g = new THREE.Group();
  const coat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, map: T?.knit?.map || null });
  const dark = new THREE.MeshStandardMaterial({ color: 0x15100c, roughness: 0.35 });
  const hoofM = new THREE.MeshStandardMaterial({ color: 0x1e1712, roughness: 0.6 });
  const antlerM = new THREE.MeshStandardMaterial({ color: 0xb8a588, roughness: 0.8 });
  const top = [0.5, 0.33, 0.2], belly = [0.86, 0.78, 0.66];
  const add = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  // torso: deep chest, tucked waist, round rump (front is -z)
  const torso = along([[0.0, -0.62], [0.16, -0.58], [0.24, -0.45], [0.27, -0.2], [0.24, 0.05], [0.22, 0.25], [0.24, 0.42], [0.2, 0.56], [0.0, 0.64]], 18);
  torso.scale(0.82, 1, 1);
  const tp = torso.attributes.position; for (let i = 0; i < tp.count; i++) { const z = tp.getZ(i); if (tp.getY(i) < 0) tp.setY(i, tp.getY(i) * (z < -0.1 ? 1.15 : 0.85)); }
  torso.computeVertexNormals();
  add(shade(torso, top, belly, 0.0), coat, g, 0, 1.0, 0);
  // neck + head
  const neckPivot = new THREE.Group(); neckPivot.position.set(0, 1.12, -0.48); g.add(neckPivot);
  const neck = along([[0.12, 0.0], [0.11, -0.12], [0.085, -0.3], [0.07, -0.44], [0.0, -0.48]], 12);
  neck.rotateX(-0.95); add(shade(neck, top, belly, 0.3), coat, neckPivot, 0, 0, 0.04);
  const head = new THREE.Group(); head.position.set(0, 0.39, -0.28); neckPivot.add(head);
  const skull = along([[0.0, 0.07], [0.07, 0.05], [0.085, -0.03], [0.07, -0.12], [0.045, -0.22], [0.035, -0.27], [0.0, -0.29]], 12);
  skull.scale(0.85, 1, 1); add(shade(skull, top, belly, 0.4), coat, head, 0, 0, 0).rotation.x = 0.35;
  add(new THREE.SphereGeometry(0.022, 8, 6), dark, head, 0, -0.1, -0.265).scale.set(1.2, 0.8, 0.8);
  for (const s of [-1, 1]) {
    add(new THREE.SphereGeometry(0.016, 10, 8), dark, head, s * 0.058, 0.025, -0.06);
    const ear = add(new THREE.SphereGeometry(0.06, 10, 8), coat, head, s * 0.075, 0.09, 0.04); ear.scale.set(0.45, 1.1, 0.22); ear.rotation.set(-0.2, s * 0.3, s * -0.55);
    if (buck) {
      const parts = [];
      const beam = new THREE.CylinderGeometry(0.008, 0.014, 0.32, 6); beam.translate(0, 0.16, 0); beam.rotateZ(s * -0.45); beam.rotateX(-0.3); parts.push(beam.toNonIndexed());
      for (let k = 0; k < 3; k++) { const t = new THREE.CylinderGeometry(0.004, 0.008, 0.12, 5); t.translate(0, 0.06, 0); t.rotateX(-0.6); t.translate(s * (0.05 + k * 0.035), 0.08 + k * 0.08, -0.02 * k); parts.push(t.toNonIndexed()); }
      add(mergeGeometries(parts), antlerM, head, s * 0.03, 0.08, 0.02);
    }
  }
  const tail = add(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf0e8de, roughness: 0.9 }), g, 0, 1.08, 0.6); tail.scale.set(0.8, 1.3, 0.6);
  // legs: front legs straight, hind legs with the backward hock
  const legs = [];
  for (const [x, z, hind] of [[-0.12, -0.4, 0], [0.12, -0.4, 0], [-0.12, 0.42, 1], [0.12, 0.42, 1]]) {
    const hip = new THREE.Group(); hip.position.set(x, 0.98, z); g.add(hip);
    const upper = along([[0.0, 0.0], hind ? [0.085, 0.04] : [0.065, 0.02], hind ? [0.075, 0.2] : [0.055, 0.2], [0.04, 0.38], [0.0, 0.4]], 10);
    upper.rotateX(Math.PI / 2); upper.rotateZ(0); // run down -y
    add(shade(upper, top, belly, 0.2), coat, hip, 0, 0, 0);
    const knee = new THREE.Group(); knee.position.y = -0.4; hip.add(knee);
    const lower = new THREE.CylinderGeometry(0.022, 0.018, 0.48, 8); lower.translate(0, -0.24, 0);
    add(lower, coat, knee).material = new THREE.MeshStandardMaterial({ color: 0x6a4a32, roughness: 0.9 });
    add(new THREE.CylinderGeometry(0.02, 0.026, 0.05, 8), hoofM, knee, 0, -0.5, -0.008);
    legs.push({ hip, knee, hind });
  }
  g.userData = { legs, neckPivot, head, tail };
  return g;
}

export function duckModel(drake = true) {
  const g = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 });
  const headM = new THREE.MeshPhysicalMaterial({ color: drake ? 0x0f4a2a : 0x6a5038, roughness: 0.35, sheen: 0.8, sheenColor: new THREE.Color(drake ? 0x2a8a6a : 0x6a5038) });
  const bill = new THREE.MeshStandardMaterial({ color: drake ? 0xd8b030 : 0xb07a30, roughness: 0.5 });
  const add = (geo, mat, x = 0, y = 0, z = 0, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const b = along([[0.0, -0.2], [0.08, -0.17], [0.12, -0.08], [0.125, 0.04], [0.1, 0.14], [0.05, 0.22], [0.0, 0.25]], 16);
  b.scale(0.95, 0.75, 1);
  shade(b, drake ? [0.55, 0.52, 0.5] : [0.45, 0.33, 0.22], drake ? [0.62, 0.5, 0.42] : [0.6, 0.48, 0.34], 0.2);
  add(b, body, 0, 0.04, 0);
  add(new THREE.ConeGeometry(0.05, 0.1, 8), new THREE.MeshStandardMaterial({ color: drake ? 0x222222 : 0x4a3828 }), 0, 0.09, 0.22).rotation.x = Math.PI / 2 + 0.6;
  const speculum = add(new THREE.PlaneGeometry(0.06, 0.03), new THREE.MeshStandardMaterial({ color: 0x2a3ab0, emissive: 0x101860, side: THREE.DoubleSide }), 0.112, 0.08, 0.05); speculum.rotation.y = Math.PI / 2;
  const s2 = speculum.clone(); s2.position.x = -0.112; g.add(s2);
  const neck = new THREE.Group(); neck.position.set(0, 0.1, -0.13); g.add(neck);
  add(new THREE.CylinderGeometry(0.032, 0.045, 0.12, 10), headM, 0, 0.05, 0, neck).rotation.x = -0.25;
  if (drake) add(new THREE.TorusGeometry(0.04, 0.007, 6, 14), new THREE.MeshStandardMaterial({ color: 0xf2f0ea }), 0, 0.0, 0.0, neck).rotation.x = Math.PI / 2;
  const head = add(new THREE.SphereGeometry(0.052, 14, 10), headM, 0, 0.12, -0.02, neck); head.scale.set(0.9, 0.95, 1.15);
  const bl = add(new THREE.BoxGeometry(0.035, 0.014, 0.065), bill, 0, 0.105, -0.09, neck); bl.rotation.x = 0.15;
  for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.008, 6, 6), new THREE.MeshStandardMaterial({ color: 0x050505 }), s * 0.037, 0.13, -0.04, neck);
  g.userData = { neck };
  return g;
}

export function rabbitModel() {
  const g = new THREE.Group();
  const fur = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
  const add = (geo, mat, x = 0, y = 0, z = 0, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const top = [0.48, 0.38, 0.28], belly = [0.82, 0.76, 0.68];
  const body = along([[0.0, -0.14], [0.07, -0.11], [0.09, -0.02], [0.1, 0.06], [0.08, 0.12], [0.0, 0.15]], 14);
  add(shade(body, top, belly, 0.2), fur, 0, 0.1, 0);
  const head = new THREE.Group(); head.position.set(0, 0.17, -0.13); g.add(head);
  add(shade(new THREE.SphereGeometry(0.05, 12, 10).scale(0.85, 0.9, 1.15), top, belly, 0.3), fur, 0, 0, 0, head);
  for (const s of [-1, 1]) {
    const ear = add(shade(new THREE.SphereGeometry(0.05, 10, 8).scale(0.32, 1.35, 0.14), top, top), fur, s * 0.02, 0.075, 0.02, head); ear.rotation.set(0.25, 0, s * 0.18);
    add(new THREE.SphereGeometry(0.008, 6, 6), new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.2 }), s * 0.032, 0.012, -0.03, head);
  }
  add(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf4f0ea }), 0, 0.13, 0.15);
  g.userData = { head };
  return g;
}

/** Instanced fish with a vertex-shader tail swish. */
export function fishSchool(scene, count, T) {
  const geo = along([[0.0, -0.12], [0.022, -0.1], [0.032, -0.04], [0.028, 0.04], [0.012, 0.1], [0.004, 0.12]], 10);
  geo.scale(0.6, 1, 1);
  const tail = new THREE.BufferGeometry();
  tail.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.11, 0, 0.035, 0.17, 0, -0.035, 0.17], 3)); tail.computeVertexNormals();
  const g = mergeGeometries([geo.toNonIndexed(), tail]);
  shade(g, [0.32, 0.36, 0.3], [0.8, 0.78, 0.7], 0.3);
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.35, side: THREE.DoubleSide });
  const u = { uTime: { value: 0 } };
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = u.uTime;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `vec3 transformed = position;
      float ph = float(gl_InstanceID) * 1.7;
      transformed.x += sin(uTime * 7.0 + ph - position.z * 18.0) * 0.03 * smoothstep(-0.05, 0.17, position.z);`);
  };
  const im = new THREE.InstancedMesh(g, mat, count);
  im.frustumCulled = false;
  scene.add(im);
  return { mesh: im, u };
}
