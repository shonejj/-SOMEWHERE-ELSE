// Building helpers: materials, world-scaled UVs, static-geometry batching, animated parts.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/** Box-projected UVs in local space so tiled textures keep a real-world scale. */
export function worldUV(geo, tile = 1) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
  if (!uv) return geo;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v;
    if (ax >= ay && ax >= az) { u = p.getZ(i); v = p.getY(i); }
    else if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); }
    else { u = p.getX(i); v = p.getY(i); }
    uv.setXY(i, u / tile, v / tile);
  }
  uv.needsUpdate = true;
  return geo;
}

export function makeMaterials(T) {
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const tex = (t, o = {}) => ({ map: t.map, normalMap: t.normalMap, ...o });
  const M = {
    logs: std(tex(T.logs, { roughness: 0.78, color: 0xcdbfb0 })),
    chink: std({ color: 0x857a66, roughness: 1, envMapIntensity: 0.2 }),
    floor: std(tex(T.floor, { roughness: 0.5, envMapIntensity: 0.45 })),
    boards: std(tex(T.boards, { roughness: 0.82 })),
    ceiling: std(tex(T.boards, { roughness: 0.85, color: 0xd9c8b0, envMapIntensity: 0.3 })),
    deck: std(tex(T.deck, { roughness: 0.85, color: 0xd0c4b4 })),
    trim: std(tex(T.boards, { roughness: 0.7, color: 0x6a4a32 })),
    darkWood: std(tex(T.grain, { roughness: 0.42, color: 0x7a5a48, envMapIntensity: 0.5 })),
    oak: std(tex(T.grain, { roughness: 0.48, color: 0xe0c0a0, envMapIntensity: 0.5 })),
    stone: std(tex(T.stone, { roughness: 0.92 })),
    soot: std({ color: 0x1a1512, roughness: 1 }),
    shingles: std(tex(T.shingles, { roughness: 0.9 })),
    iron: std({ color: 0x1d1b1a, roughness: 0.55, metalness: 0.7 }),
    brass: std({ color: 0xb48a46, roughness: 0.3, metalness: 1 }),
    steel: std({ color: 0xc8ccd0, roughness: 0.25, metalness: 1 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xdfeaf0, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false, envMapIntensity: 1.4, side: THREE.DoubleSide }),
    sofa: std(tex(T.sofa, { roughness: 0.95, envMapIntensity: 0.3 })),
    wool: std(tex(T.wool, { roughness: 0.95, envMapIntensity: 0.3 })),
    linen: std(tex(T.linen, { roughness: 0.92, envMapIntensity: 0.3 })),
    quilt: std(tex(T.quilt, { roughness: 0.92, envMapIntensity: 0.3 })),
    rug: std(tex(T.rug, { roughness: 1, envMapIntensity: 0.2 })),
    ceramic: std({ color: 0xe9e2d6, roughness: 0.25, envMapIntensity: 0.6 }),
    ceramicBlue: std({ color: 0x3b5a78, roughness: 0.3, envMapIntensity: 0.6 }),
    paper: std({ color: 0xe8dfc8, roughness: 0.9 }),
    black: std({ color: 0x111111, roughness: 0.6 }),
    shade: std({ color: 0xe8d2a8, roughness: 0.8, emissive: 0xffb060, emissiveIntensity: 0, side: THREE.DoubleSide }),
    bulb: std({ color: 0xfff2d0, emissive: 0xffc070, emissiveIntensity: 0 }),
    canvas: std({ color: 0x9a8c6a, roughness: 0.95, side: THREE.DoubleSide }),
  };
  for (const k of ['floor', 'boards', 'ceiling', 'deck', 'trim', 'logs', 'stone', 'shingles']) M[k].map.anisotropy = 8;
  M.interior = [M.logs, M.floor, M.ceiling, M.boards, M.sofa, M.wool, M.linen, M.quilt, M.rug, M.darkWood, M.oak, M.chink];
  return M;
}

export class Batch {
  constructor() { this.groups = new Map(); }
  add(geo, mat, matrix) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (matrix) g.applyMatrix4(matrix);
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!this.groups.has(mat)) this.groups.set(mat, []);
    this.groups.get(mat).push(g);
  }
  flush(parent, { cast = true, receive = true } = {}) {
    const meshes = [];
    for (const [mat, list] of this.groups) {
      const merged = mergeGeometries(list);
      const m = new THREE.Mesh(merged, mat);
      m.castShadow = cast; m.receiveShadow = receive;
      parent.add(m); meshes.push(m);
    }
    this.groups.clear();
    return meshes;
  }
}

const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
export function mtx(x, y, z, rx = 0, ry = 0, rz = 0) { E.set(rx, ry, rz); Q.setFromEuler(E); return M4.compose(P.set(x, y, z), Q, S).clone(); }

export function boxGeo(w, h, d, tile = 1) { return worldUV(new THREE.BoxGeometry(w, h, d), tile); }
export function rbox(w, h, d, r = 0.04, seg = 3) { const g = new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)); return g; }

export function mesh(geo, mat, x = 0, y = 0, z = 0, parent, opts = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (opts.rx) m.rotation.x = opts.rx; if (opts.ry) m.rotation.y = opts.ry; if (opts.rz) m.rotation.z = opts.rz;
  m.castShadow = opts.cast !== false; m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}

/** Critically damped value used for doors/drawers. */
export class Spring {
  constructor(v = 0, speed = 7) { this.v = v; this.t = v; this.vel = 0; this.k = speed; }
  update(dt) {
    const k = this.k, x = this.v - this.t;
    const a = -k * k * x - 2 * k * this.vel;
    this.vel += a * dt; this.v += this.vel * dt;
    return Math.abs(this.vel) > 1e-3 || Math.abs(x) > 1e-3;
  }
}

/** Hinged part (door, window sash, lid). */
export class Hinged {
  constructor(group, axis, openAngle, ctx, { collider, label = 'door', sound = 'door', speed = 5 } = {}) {
    this.g = group; this.axis = axis; this.open = false; this.base = group.rotation[axis];
    this.angle = openAngle; this.s = new Spring(0, speed); this.ctx = ctx; this.collider = collider; this.label = label; this.sound = sound;
    this.box = new THREE.Box3();
  }
  toggle() {
    this.open = !this.open; this.s.t = this.open ? 1 : 0;
    const p = new THREE.Vector3(); this.g.getWorldPosition(p);
    const a = this.ctx.audio;
    if (this.sound === 'none') return;
    if (this.sound === 'door') a?.door(p, this.open);
    else if (this.sound === 'window') a?.windowLatch(p);
    else if (this.sound === 'lid') { a?.creak(p, 0.08, 0.5, 220); if (!this.open) setTimeout(() => a?.thud(p, 0.3), 450); }
    else { a?.creak(p, 0.05, 0.35, 260); if (!this.open) setTimeout(() => a?.click(p, 0.3), 300); }
  }
  update(dt) {
    const moving = this.s.update(dt);
    this.g.rotation[this.axis] = this.base + this.s.v * this.angle;
    if (moving && this.collider && this.panel) {
      this.panel.updateWorldMatrix(true, false);
      this.box.setFromObject(this.panel);
      this.collider.min.copy(this.box.min); this.collider.max.copy(this.box.max);
      this.collider.min.y += 0.05;
    }
  }
}

/** Sliding drawer. */
export class Drawer {
  constructor(group, dir, dist, ctx) { this.g = group; this.dir = dir.clone(); this.dist = dist; this.home = group.position.clone(); this.s = new Spring(0, 9); this.open = false; this.ctx = ctx; }
  toggle() { this.open = !this.open; this.s.t = this.open ? 1 : 0; const p = new THREE.Vector3(); this.g.getWorldPosition(p); this.ctx.audio?.slide(p, this.open); }
  update(dt) { this.s.update(dt); this.g.position.copy(this.home).addScaledVector(this.dir, this.s.v * this.dist); }
}
