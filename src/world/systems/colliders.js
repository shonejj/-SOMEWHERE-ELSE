// Lightweight static/dynamic collision world for the walking character.
import * as THREE from 'three';

export class Colliders {
  constructor() {
    this.boxes = [];      // { min, max, enabled, phys, tag }
    this.cyl = new Map(); // grid hash of vertical cylinders
    this.cell = 8;
    this.ladders = [];    // { min, max, top }
  }

  addBox(minX, minY, minZ, maxX, maxY, maxZ, opts = {}) {
    const b = { min: new THREE.Vector3(minX, minY, minZ), max: new THREE.Vector3(maxX, maxY, maxZ), enabled: true, phys: opts.phys !== false, tag: opts.tag || '' , walk: opts.walk !== false };
    this.boxes.push(b);
    return b;
  }

  /** Axis-aligned box from an Object3D's world bounds. */
  addFromObject(obj, opts) {
    obj.updateWorldMatrix(true, true);
    const bb = new THREE.Box3().setFromObject(obj);
    return this.addBox(bb.min.x, bb.min.y, bb.min.z, bb.max.x, bb.max.y, bb.max.z, opts);
  }

  addCylinder(x, z, r, y0, y1) {
    const c = { x, z, r, y0, y1 };
    const k = Math.floor(x / this.cell) + ',' + Math.floor(z / this.cell);
    if (!this.cyl.has(k)) this.cyl.set(k, []);
    this.cyl.get(k).push(c);
    return c;
  }

  nearbyCylinders(x, z) {
    const out = [];
    const cx = Math.floor(x / this.cell), cz = Math.floor(z / this.cell);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const l = this.cyl.get(cx + i + ',' + (cz + j)); if (l) out.push(...l); }
    return out;
  }

  /** Highest walkable surface under (x,z) that is not above maxY. */
  supportHeight(x, z, r, maxY) {
    let best = -Infinity;
    for (const b of this.boxes) {
      if (!b.enabled || !b.walk) continue;
      if (b.max.y > maxY || b.max.y <= best) continue;
      if (x + r * 0.5 < b.min.x || x - r * 0.5 > b.max.x || z + r * 0.5 < b.min.z || z - r * 0.5 > b.max.z) continue;
      best = b.max.y;
    }
    return best;
  }

  /** Pushes a vertical capsule (as a circle in XZ) out of boxes and cylinders. */
  resolve(pos, r, feet, head, stepTop) {
    let hit = false;
    for (let iter = 0; iter < 3; iter++) {
      for (const b of this.boxes) {
        if (!b.enabled) continue;
        if (b.max.y <= stepTop || b.min.y >= head) continue;
        const cx = Math.max(b.min.x, Math.min(pos.x, b.max.x));
        const cz = Math.max(b.min.z, Math.min(pos.z, b.max.z));
        let dx = pos.x - cx, dz = pos.z - cz;
        const d2 = dx * dx + dz * dz;
        if (d2 >= r * r) continue;
        hit = true;
        if (d2 > 1e-10) {
          const d = Math.sqrt(d2), push = r - d;
          pos.x += (dx / d) * push; pos.z += (dz / d) * push;
        } else {
          const l = pos.x - b.min.x + r, rr = b.max.x - pos.x + r, f = pos.z - b.min.z + r, k = b.max.z - pos.z + r;
          const m = Math.min(l, rr, f, k);
          if (m === l) pos.x = b.min.x - r; else if (m === rr) pos.x = b.max.x + r; else if (m === f) pos.z = b.min.z - r; else pos.z = b.max.z + r;
        }
      }
      for (const c of this.nearbyCylinders(pos.x, pos.z)) {
        if (c.y1 <= stepTop || c.y0 >= head) continue;
        const dx = pos.x - c.x, dz = pos.z - c.z, d = Math.hypot(dx, dz), m = r + c.r;
        if (d < m && d > 1e-6) { pos.x = c.x + (dx / d) * m; pos.z = c.z + (dz / d) * m; hit = true; }
      }
    }
    return hit;
  }

  /** Lowest box bottom above `feet` overlapping the circle (ceiling). */
  ceilingHeight(x, z, r, feet) {
    let best = Infinity;
    for (const b of this.boxes) {
      if (!b.enabled || b.min.y <= feet + 0.3 || b.min.y >= best) continue;
      if (x + r < b.min.x || x - r > b.max.x || z + r < b.min.z || z - r > b.max.z) continue;
      best = b.min.y;
    }
    return best;
  }

  addLadder(min, max, dir) { this.ladders.push({ min, max, dir }); }
  ladderAt(p) { return this.ladders.find((l) => p.x > l.min.x && p.x < l.max.x && p.z > l.min.z && p.z < l.max.z && p.y > l.min.y - 0.2 && p.y < l.max.y) || null; }
}
