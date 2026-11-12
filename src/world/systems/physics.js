// Rigid-body physics for loose objects (cannon-es, MIT).
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export class Physics {
  constructor() {
    const w = (this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) }));
    w.broadphase = new CANNON.SAPBroadphase(w);
    w.allowSleep = true;
    w.solver.iterations = 8;
    this.defaultMat = new CANNON.Material('default');
    w.defaultContactMaterial.friction = 0.45;
    w.defaultContactMaterial.restitution = 0.25;
    this.items = [];
    this.onImpact = null;
  }

  addStaticBox(b) {
    const he = new CANNON.Vec3((b.max.x - b.min.x) / 2, (b.max.y - b.min.y) / 2, (b.max.z - b.min.z) / 2);
    if (he.x <= 0 || he.y <= 0 || he.z <= 0) return null;
    const body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(he) });
    body.position.set((b.max.x + b.min.x) / 2, (b.max.y + b.min.y) / 2, (b.max.z + b.min.z) / 2);
    this.world.addBody(body);
    b.body = body;
    return body;
  }

  setBoxEnabled(b, on) {
    if (!b.body) return;
    const inWorld = this.world.bodies.includes(b.body);
    if (on && !inWorld) this.world.addBody(b.body);
    else if (!on && inWorld) this.world.removeBody(b.body);
  }

  addTerrain(terrain, cx, cz, size, step = 1) {
    const n = Math.floor(size / step) + 1;
    const minX = cx - size / 2, maxZ = cz + size / 2;
    const data = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) row.push(terrain.heightAt(minX + i * step, maxZ - j * step));
      data.push(row);
    }
    const shape = new CANNON.Heightfield(data, { elementSize: step });
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    body.position.set(minX, 0, maxZ);
    this.world.addBody(body);
  }

  addCylinder(c) {
    const body = new CANNON.Body({ mass: 0, shape: new CANNON.Cylinder(c.r, c.r, c.y1 - c.y0, 8) });
    body.position.set(c.x, (c.y0 + c.y1) / 2, c.z);
    this.world.addBody(body);
  }

  /** Registers a mesh as a dynamic body. shape: 'box' | 'sphere' | 'cylinder'. */
  addItem(mesh, { mass = 0.5, shape = 'box', sound = 'wood' } = {}) {
    mesh.updateWorldMatrix(true, false);
    const geo = mesh.geometry;
    let bb;
    if (geo) { geo.computeBoundingBox(); bb = geo.boundingBox.clone(); }
    else { bb = new THREE.Box3().setFromObject(mesh); const inv = new THREE.Matrix4().copy(mesh.matrixWorld).invert(); bb.applyMatrix4(inv); }
    const size = bb.getSize(new THREE.Vector3()).multiply(mesh.scale);
    const center = bb.getCenter(new THREE.Vector3()).multiply(mesh.scale);
    let s;
    if (shape === 'sphere') s = new CANNON.Sphere(Math.max(size.x, size.y, size.z) / 2);
    else if (shape === 'cylinder') s = new CANNON.Cylinder(size.x / 2, size.x / 2, size.y, 10);
    else s = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    const body = new CANNON.Body({ mass, linearDamping: 0.05, angularDamping: 0.15, sleepSpeedLimit: 0.15, sleepTimeLimit: 0.6 });
    body.addShape(s, new CANNON.Vec3(center.x, center.y, center.z));
    const wp = new THREE.Vector3(), wq = new THREE.Quaternion();
    mesh.getWorldPosition(wp); mesh.getWorldQuaternion(wq);
    body.position.set(wp.x, wp.y, wp.z); body.quaternion.set(wq.x, wq.y, wq.z, wq.w);
    // keep the mesh in world space
    if (mesh.parent && mesh.parent.type !== 'Scene') {
      const scene = (() => { let o = mesh; while (o.parent) o = o.parent; return o; })();
      scene.attach(mesh);
    }
    const item = { mesh, body, sound, held: false, lastImpact: 0, size: size.length() };
    body.addEventListener('collide', (e) => {
      const v = Math.abs(e.contact.getImpactVelocityAlongNormal());
      const now = performance.now();
      if (v > 0.6 && now - item.lastImpact > 90) { item.lastImpact = now; this.onImpact?.(item, v); }
    });
    body.sleep();
    this.world.addBody(body);
    this.items.push(item);
    mesh.userData.item = item;
    return item;
  }

  step(dt) {
    this.world.step(1 / 60, dt, 3);
    for (const it of this.items) {
      if (it.held) continue;
      it.mesh.position.copy(it.body.position);
      it.mesh.quaternion.copy(it.body.quaternion);
      // safety: never let objects fall out of the world
      if (it.body.position.y < -30) { it.body.position.set(0, 3, 0); it.body.velocity.set(0, 0, 0); }
    }
  }
}
