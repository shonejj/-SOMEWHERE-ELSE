// Places beyond the cabin: the dock, the tree house, the forest clearing, loose objects.
import * as THREE from 'three';
import { Batch, boxGeo, rbox, mesh, mtx, worldUV } from './kit.js';
import { Fire, pineconeGeo, pebbleGeo, lanternModel, makeBook, mugGeo } from './props.js';
import { WATER_LEVEL, DOCK, TREEHOUSE, CLEARING, LAKE } from '../core/layout.js';
import { mulberry32 } from '../core/noise.js';
import { pathDistance, lakeE } from '../env/terrain.js';

const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

export function buildOutdoor(ctx) {
  const { scene, M, T, ix, col, phys, terrain, audio, updaters } = ctx;
  const h = (x, z) => terrain.heightAt(x, z);
  const solid = (a, b, c, d, e, f, o) => { const bx = col.addBox(a, b, c, d, e, f, o); if (bx.phys) phys.addStaticBox(bx); return bx; };
  const B = new Batch();
  const rnd = mulberry32(808);
  const out = {};

  // ---------------------------------------------------------------- dock --
  {
    // find the shoreline along the dock axis
    let shore = DOCK.zStart;
    for (let z = 12; z < 45; z += 0.25) { if (h(DOCK.x, z) < WATER_LEVEL + 0.05) { shore = z; break; } }
    const top = WATER_LEVEL + 0.6;
    // start the dock where the bank is level with the deck
    let z0 = shore - 1;
    while (z0 > shore - 14 && h(DOCK.x, z0) < top - 0.12) z0 -= 0.25;
    const z1 = shore + 13;
    const w = DOCK.width;
    for (let z = z0; z < z1; z += 0.2) {
      B.add(boxGeo(w, 0.05, 0.18, 1.6), M.deck, mtx(DOCK.x + (rnd() - 0.5) * 0.02, top - 0.025, z + 0.1, 0, (rnd() - 0.5) * 0.01, 0));
    }
    for (const x of [-w / 2 + 0.1, w / 2 - 0.1]) B.add(boxGeo(0.12, 0.18, z1 - z0, 1.6), M.trim, mtx(DOCK.x + x, top - 0.14, (z0 + z1) / 2));
    for (let z = z0 + 0.3; z < z1; z += 2.2) for (const x of [-w / 2, w / 2]) {
      const g = new THREE.CylinderGeometry(0.1, 0.11, 3.2, 10); B.add(g, M.logs, mtx(DOCK.x + x, top - 1.5, z));
    }
    solid(DOCK.x - w / 2, -6, z0, DOCK.x + w / 2, top, z1, { tag: 'wood' });
    // bench at the end
    const bz = z1 - 0.8;
    B.add(boxGeo(1.6, 0.05, 0.4, 1.2), M.oak, mtx(DOCK.x, top + 0.45, bz));
    B.add(boxGeo(1.6, 0.35, 0.04, 1.2), M.oak, mtx(DOCK.x, top + 0.72, bz + 0.2, -0.15, 0, 0));
    for (const x of [-0.7, 0.7]) B.add(boxGeo(0.06, 0.45, 0.36), M.oak, mtx(DOCK.x + x, top + 0.22, bz));
    solid(DOCK.x - 0.8, top, bz - 0.2, DOCK.x + 0.8, top + 0.47, bz + 0.22, { walk: false });
    const seat = { eye: v3(DOCK.x, top + 1.12, bz - 0.05), yaw: Math.PI, exit: v3(DOCK.x, top, bz - 0.9) };
    const hit = mesh(new THREE.BoxGeometry(1.6, 0.4, 0.5), new THREE.MeshBasicMaterial({ visible: false }), DOCK.x, top + 0.5, bz, scene);
    ix.register(hit, { label: 'Sit on the bench', use: () => ctx.player.sit(seat) });
    // edge-of-dock sitting spot
    const edge = { eye: v3(DOCK.x + 0.4, top + 0.75, z1 - 0.15), yaw: Math.PI, exit: v3(DOCK.x + 0.4, top, z1 - 1.6), yawLimit: 1.6 };
    const eh = mesh(new THREE.BoxGeometry(1.0, 0.1, 0.3), new THREE.MeshBasicMaterial({ visible: false }), DOCK.x + 0.4, top + 0.02, z1 - 0.2, scene);
    ix.register(eh, { label: 'Sit on the edge of the dock', use: () => ctx.player.sit(edge) });
    // rowboat
    const boat = new THREE.Group(); boat.position.set(DOCK.x + 2.0, WATER_LEVEL, (z0 + z1) / 2 + 2); scene.add(boat);
    const hullPts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; hullPts.push(new THREE.Vector2(Math.sin(t * Math.PI / 2) * 0.62 + 0.02, -0.38 + t * 0.55)); }
    const hull = new THREE.LatheGeometry(hullPts, 24); hull.scale(1, 1, 2.7);
    const boatMat = new THREE.MeshStandardMaterial({ map: T.boards.map, normalMap: T.boards.normalMap, color: 0x5a7a8a, roughness: 0.7, side: THREE.DoubleSide });
    mesh(hull, boatMat, 0, 0.15, 0, boat);
    for (const z of [-0.5, 0.45]) mesh(boxGeo(1.1, 0.04, 0.24), M.oak, 0, 0.1, z, boat);
    for (const s of [-1, 1]) { const oar = mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0, 6), M.oak, s * 0.45, 0.25, 0.1, boat); oar.rotation.x = Math.PI / 2; oar.rotation.z = s * 0.15; }
    const rope = mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0x9a8a6a }), DOCK.x + 1.3, top - 0.1, (z0 + z1) / 2 + 2 - 1.4, scene); rope.rotation.z = 1.2;
    let bt = 0;
    updaters.push((dt, t) => { const g = ctx.weather.w.gust; bt = t; boat.position.y = WATER_LEVEL + Math.sin(t * 1.3) * 0.02 * (1 + g * 2); boat.rotation.z = Math.sin(t * 0.9) * 0.025 * (1 + g * 2); boat.rotation.x = Math.sin(t * 1.1 + 1) * 0.015 * (1 + g); });
    const boatSeat = { yaw: Math.PI, exit: v3(DOCK.x + 0.6, top, (z0 + z1) / 2 + 2), getEye: () => { const p = boat.position.clone(); p.y += 0.95; p.z += 0.2; return p; } };
    ix.register(boat, { label: 'Sit in the rowboat', use: () => { ctx.player.sit(boatSeat); audio?.splash(boat.position, 0.3); } });
    out.dock = { top, z0, z1 };
  }

  // ----------------------------------------------------------- tree house --
  {
    const tx = TREEHOUSE.x, tz = TREEHOUSE.z, ty = h(tx, tz);
    const P = ty + 4.3; // platform top
    const x0 = tx - 2.7, x1 = tx + 2.7, z0 = tz - 1.9, z1 = tz + 4.4;
    col.addCylinder(tx, tz, 0.75, ty - 1, ty + 26);
    for (let z = z0; z < z1; z += 0.2) B.add(boxGeo(x1 - x0, 0.06, 0.18, 1.6), M.deck, mtx(tx, P - 0.03, z + 0.1));
    B.add(boxGeo(x1 - x0, 0.22, 0.14), M.trim, mtx(tx, P - 0.17, z0)); B.add(boxGeo(x1 - x0, 0.22, 0.14), M.trim, mtx(tx, P - 0.17, z1));
    B.add(boxGeo(0.14, 0.22, z1 - z0), M.trim, mtx(x0, P - 0.17, (z0 + z1) / 2)); B.add(boxGeo(0.14, 0.22, z1 - z0), M.trim, mtx(x1, P - 0.17, (z0 + z1) / 2));
    // supports
    for (const [px, pz] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) {
      const gy = h(px, pz); const len = P - gy + 0.2;
      B.add(new THREE.CylinderGeometry(0.12, 0.14, len, 10), M.logs, mtx(px, gy + len / 2 - 0.2, pz));
      col.addCylinder(px, pz, 0.14, gy - 1, P - 0.05);
    }
    for (const [px, pz] of [[x0 + 0.4, z0 + 0.3], [x1 - 0.4, z0 + 0.3], [x0 + 0.4, z1 - 0.3], [x1 - 0.4, z1 - 0.3]]) {
      const dx = px - tx, dz = pz - tz, L = Math.hypot(dx, dz, 2.2);
      const g = new THREE.CylinderGeometry(0.06, 0.07, L, 8);
      const m = new THREE.Matrix4().lookAt(v3(0, 0, 0), v3(dx, 2.2, dz), v3(0, 1, 0)).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      m.setPosition(tx + dx / 2, P - 0.2 - 1.1, tz + dz / 2);
      B.add(g, M.logs, m);
    }
    solid(x0, P - 0.3, z0, x1, P, z1, { tag: 'wood' });
    // trunk hole collider handled by tree cylinder; railings (gap at ladder on west side)
    const railH = 0.95;
    const rail = (ax, az, bx, bz) => {
      const L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(-(bz - az), bx - ax);
      B.add(boxGeo(L, 0.07, 0.09), M.trim, mtx((ax + bx) / 2, P + railH, (az + bz) / 2, 0, ry, 0));
      const n = Math.max(2, Math.floor(L / 0.5));
      for (let i = 0; i <= n; i++) { const t = i / n; B.add(boxGeo(0.06, railH, 0.06), M.trim, mtx(ax + (bx - ax) * t, P + railH / 2, az + (bz - az) * t)); }
      solid(Math.min(ax, bx) - 0.05, P, Math.min(az, bz) - 0.05, Math.max(ax, bx) + 0.05, P + railH + 0.05, Math.max(az, bz) + 0.05, { walk: false });
    };
    rail(x0, z0, x1, z0); rail(x1, z0, x1, tz + 1.2); rail(x0, z0, x0, tz + 0.2); rail(x0, tz + 1.3, x0, tz + 1.4);
    // ladder on west side
    const lx = x0 - 0.08, lz0 = tz + 0.35, lz1 = tz + 1.15, gy = h(lx - 0.3, (lz0 + lz1) / 2);
    for (const z of [lz0, lz1]) B.add(boxGeo(0.07, P - gy + 0.9, 0.07), M.logs, mtx(lx, (P + gy + 0.9) / 2, z));
    for (let y = gy + 0.3; y < P + 0.5; y += 0.32) B.add(new THREE.CylinderGeometry(0.025, 0.025, lz1 - lz0, 6), M.oak, mtx(lx, y, (lz0 + lz1) / 2, Math.PI / 2, 0, 0));
    col.addLadder(v3(lx - 0.6, gy - 0.5, lz0), v3(lx + 0.35, P + 0.05, lz1), v3(1, 0, 0));
    // hut
    const hx0 = tx - 1.7, hx1 = tx + 1.7, hz0 = tz + 1.3, hz1 = z1 - 0.05, WH = 2.25;
    const wall = (axis, c, a0, a1, holes) => {
      // boards with rectangular holes, built from strips
      const edges = [a0, ...holes.flatMap((o) => [o.a, o.b]), a1].sort((p, q) => p - q);
      for (let i = 0; i < edges.length - 1; i++) {
        const a = edges[i], b = edges[i + 1], m = (a + b) / 2;
        const o = holes.find((hh) => m > hh.a && m < hh.b);
        const seg = (y0, y1) => { if (y1 - y0 < 0.01) return; const gg = axis === 'x' ? boxGeo(b - a, y1 - y0, 0.07, 1.4) : boxGeo(0.07, y1 - y0, b - a, 1.4); B.add(gg, M.boards, axis === 'x' ? mtx(m, P + (y0 + y1) / 2, c) : mtx(c, P + (y0 + y1) / 2, m));
          if (axis === 'x') solid(a, P + y0, c - 0.05, b, P + y1, c + 0.05, { walk: false }); else solid(c - 0.05, P + y0, a, c + 0.05, P + y1, b, { walk: false }); };
        if (!o) seg(0, WH); else { seg(0, o.lo); seg(o.hi, WH); }
      }
    };
    wall('x', hz1, hx0, hx1, [{ a: tx - 0.5, b: tx + 0.5, lo: 0.8, hi: 1.6 }]);
    wall('x', hz0, hx0, hx1, [{ a: tx + 0.3, b: tx + 1.1, lo: 0, hi: 1.9 }]);
    wall('z', hx0, hz0, hz1, [{ a: hz0 + 0.9, b: hz0 + 1.8, lo: 0.9, hi: 1.5 }]);
    wall('z', hx1, hz0, hz1, [{ a: hz0 + 1.0, b: hz0 + 1.9, lo: 0.85, hi: 1.55 }]);
    // gabled roof
    const rw = hx1 - hx0 + 0.6, rd = (hz1 - hz0) / 2 + 0.4, rise = 1.0, L = Math.hypot(rd, rise), a = Math.atan(rise / rd);
    for (const s of [-1, 1]) {
      const m = mtx(tx, P + WH + rise / 2, (hz0 + hz1) / 2 + s * rd / 2, s * a, 0, 0);
      const top = new THREE.PlaneGeometry(rw, L); top.rotateX(-Math.PI / 2); worldUV(top, 2); top.translate(0, 0.05, 0);
      const bot = new THREE.PlaneGeometry(rw, L); bot.rotateX(Math.PI / 2); worldUV(bot, 1.4); bot.translate(0, -0.05, 0);
      B.add(top, M.shingles, m); B.add(bot, M.ceiling, m); B.add(new THREE.BoxGeometry(rw, 0.1, L - 0.02), M.trim, m);
    }
    for (const x of [hx0, hx1]) {
      const sh = new THREE.Shape([new THREE.Vector2(-(hz1 - hz0) / 2, 0), new THREE.Vector2((hz1 - hz0) / 2, 0), new THREE.Vector2(0, rise)]);
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.07, bevelEnabled: false }); g.rotateY(Math.PI / 2); worldUV(g, 1.4);
      B.add(g, M.boards, mtx(x - 0.035, P + WH, (hz0 + hz1) / 2));
    }
    solid(hx0, P + WH + 0.02, hz0, hx1, P + WH + 0.3, hz1, { walk: false });
    // inside: floor cushion, blanket, shelf with book, fairy lights
    const cush = mesh(rbox(0.9, 0.18, 0.9, 0.08, 4), M.wool, tx - 0.9, P + 0.09, hz1 - 0.6, scene);
    const seat = { eye: v3(tx - 0.9, P + 0.85, hz1 - 0.6), yaw: Math.PI * 0.85, exit: v3(tx - 0.2, P, hz0 + 0.8) };
    ix.register(cush, { label: 'Sit on the cushion', use: () => ctx.player.sit(seat) });
    mesh(rbox(1.0, 0.05, 0.7, 0.02), M.quilt, tx + 0.8, P + 0.03, hz1 - 0.5, scene, { cast: false });
    const lieTH = { eye: v3(tx + 0.8, P + 0.32, hz1 - 0.55), yaw: -Math.PI / 2, lie: true, exit: v3(tx + 0.4, P, hz0 + 0.8), yawLimit: 3 };
    ix.register(scene.children[scene.children.length - 1], { label: 'Lie down', use: () => { ctx.player.sit(lieTH); ctx.ui.toast('Resting… time drifts by'); } });
    B.add(boxGeo(1.0, 0.03, 0.25, 1), M.oak, mtx(hx1 - 0.6, P + 1.4, hz1 - 0.2));
    const b = makeBook(new THREE.MeshStandardMaterial({ color: 0x4a2a4a, roughness: 0.7 }), 0.13, 0.19, 0.03);
    b.position.set(hx1 - 0.6, P + 1.43, hz1 - 0.2); b.rotation.set(-Math.PI / 2, 0, 0.4); scene.add(b);
    ix.item(b, 'book', { mass: 0.4, sound: 'soft' });
    // binoculars / telescope on the deck
    const scope = new THREE.Group(); scope.position.set(x1 - 0.5, P, z0 + 0.5); scene.add(scope);
    for (let i = 0; i < 3; i++) { const l = mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 6), M.brass, Math.cos(i * 2.1) * 0.15, 0.58, Math.sin(i * 2.1) * 0.15, scope); l.rotation.set(Math.sin(i * 2.1) * 0.25, 0, -Math.cos(i * 2.1) * 0.25); }
    const toLake = Math.atan2(-(LAKE.x - scope.position.x), -(LAKE.z - scope.position.z));
    const tube = new THREE.Group(); tube.position.y = 1.2; tube.rotation.y = toLake; scope.add(tube);
    const tb = mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.75, 14), M.brass, 0, 0, -0.1, tube); tb.rotation.x = Math.PI / 2 + 0.1;
    ix.register(scope, { label: 'Look through the telescope', use: () => { ctx.player.scope(toLake); } });
    solid(x1 - 0.7, P, z0 + 0.3, x1 - 0.3, P + 1.3, z0 + 0.7, { walk: false });
    // fairy lights along the railing
    const bulbs = [];
    const fl = new THREE.MeshStandardMaterial({ color: 0xffe0a0, emissive: 0xffb050, emissiveIntensity: 0 });
    const pts = [[x0, z0], [x1, z0], [x1, tz + 1.2]];
    for (let s = 0; s < pts.length - 1; s++) { const [ax, az] = pts[s], [bx, bz] = pts[s + 1]; const n = 14; for (let i = 0; i < n; i++) { const t = i / n; bulbs.push(v3(ax + (bx - ax) * t, P + railH + 0.12 - Math.sin(t * Math.PI) * 0.08 * 0 - Math.abs(Math.sin(t * n * Math.PI / 2)) * 0.06, az + (bz - az) * t)); } }
    const bi = new THREE.InstancedMesh(new THREE.SphereGeometry(0.025, 6, 4), fl, bulbs.length);
    bulbs.forEach((p, i) => bi.setMatrixAt(i, new THREE.Matrix4().setPosition(p))); scene.add(bi);
    let lightsOn = false;
    const sw = mesh(boxGeo(0.12, 0.12, 0.05), M.iron, hx1 + 0.08, P + 1.2, hz0 + 0.5, scene);
    ix.register(sw, { label: () => (lightsOn ? 'Switch off the string lights' : 'Switch on the string lights'), use: () => { lightsOn = !lightsOn; audio?.lightSwitch(sw.position); } });
    updaters.push((dt, t) => { fl.emissiveIntensity += ((lightsOn ? 2.2 + Math.sin(t * 3) * 0.15 : 0) - fl.emissiveIntensity) * Math.min(1, dt * 6); });
    out.treehouse = { P };
  }

  // ------------------------------------------------------------- clearing --
  {
    const cx = CLEARING.x, cz = CLEARING.z, cy = h(cx, cz);
    // stone ring
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; B.add(pebbleGeo(i, 0.16), ctx.rockMat || M.stone, mtx(cx + Math.cos(a) * 0.6, cy + 0.04, cz + Math.sin(a) * 0.6, 0, a, 0)); }
    solid(cx - 0.7, cy - 1, cz - 0.7, cx + 0.7, cy + 0.12, cz + 0.7, { walk: false, phys: true });
    const fire = new Fire(ctx, scene, v3(cx, cy + 0.02, cz), { scale: 1.3, intensity: 18, lightOffset: v3(0, 0.6, 0), startOn: false });
    updaters.push((dt, t) => fire.update(dt, t));
    const hit = mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.6, 10), new THREE.MeshBasicMaterial({ visible: false }), cx, cy + 0.3, cz, scene);
    ix.register(hit, { label: () => (fire.on ? 'Put out the campfire' : 'Light the campfire'), use: () => fire.toggle() });
    out.campfire = fire;
    // log benches
    const barkMat = new THREE.MeshStandardMaterial({ map: T.bark.map, normalMap: T.bark.normalMap, roughness: 1 });
    for (const a of [0.3, 2.4, 4.2]) {
      const bx = cx + Math.cos(a) * 2.2, bz = cz + Math.sin(a) * 2.2, by = h(bx, bz);
      const g = new THREE.CylinderGeometry(0.22, 0.24, 1.8, 12); g.rotateZ(Math.PI / 2);
      const m = mesh(g, barkMat, bx, by + 0.2, bz, scene); m.rotation.y = -a + Math.PI / 2;
      const faceYaw = Math.atan2(-(cx - bx), -(cz - bz));
      const seat = { eye: v3(bx, by + 1.02, bz), yaw: faceYaw, exit: v3(bx + (cx - bx) * 0.35, by, bz + (cz - bz) * 0.35) };
      ix.register(m, { label: 'Sit on the log', use: () => ctx.player.sit(seat) });
      col.addCylinder(bx, bz, 0.5, by, by + 0.42);
    }
    // tent
    const tx = cx + 3.5, tz = cz - 3.2, ty = h(tx, tz);
    const tent = new THREE.Group(); tent.position.set(tx, ty, tz); tent.rotation.y = 0.5; scene.add(tent);
    const canvasMat = new THREE.MeshStandardMaterial({ map: T.linen.map, color: 0x8a7a5a, roughness: 1, side: THREE.DoubleSide });
    for (const s of [-1, 1]) { const p = mesh(new THREE.PlaneGeometry(2.4, 1.55), canvasMat, s * 0.62, 0.7, 0, tent); p.rotation.y = Math.PI / 2; p.rotation.x = 0; p.rotation.z = 0; p.rotation.order = 'YXZ'; p.rotation.set(0, Math.PI / 2, 0); p.rotateX(s * -0.9); }
    const back = new THREE.Shape([new THREE.Vector2(-0.95, 0), new THREE.Vector2(0.95, 0), new THREE.Vector2(0, 1.28)]);
    mesh(new THREE.ShapeGeometry(back), canvasMat, 0, 0.0, -1.2, tent);
    mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.5, 6), M.oak, 0, 1.28, 0, tent).rotation.x = Math.PI / 2;
    mesh(rbox(0.7, 0.08, 1.9, 0.04), new THREE.MeshStandardMaterial({ color: 0x2a4a6a, roughness: 0.8 }), 0, 0.05, -0.1, tent);
    const tl = tent.localToWorld(v3(0, 0.38, -0.7));
    const bag = { eye: tl, yaw: tent.rotation.y, lie: true, exit: tent.localToWorld(v3(0, 0, 1.8)), yawLimit: 3 };
    ix.register(tent, { label: 'Crawl into the tent and rest', use: () => { ctx.player.sit(bag); ctx.ui.toast('Resting… time drifts by'); } });
    col.addCylinder(tx, tz, 1.0, ty, ty + 1.3);
    // stump with axe + firewood
    const sx = cx - 2.8, sz = cz - 1.5, sy = h(sx, sz);
    mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.5, 14), barkMat, sx, sy + 0.25, sz, scene);
    mesh(new THREE.CircleGeometry(0.3, 14).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: T.logs.map, color: 0xd8b890 }), sx, sy + 0.501, sz, scene);
    col.addCylinder(sx, sz, 0.36, sy, sy + 0.5);
    const axe = new THREE.Group(); axe.position.set(sx + 0.05, sy + 0.62, sz); axe.rotation.z = -0.5; scene.add(axe);
    mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.75, 8), M.oak, 0, 0.3, 0, axe);
    mesh(boxGeo(0.18, 0.1, 0.02), M.steel, 0.06, -0.05, 0, axe);
    const cup = mesh(mugGeo(), new THREE.MeshStandardMaterial({ color: 0xc8c8c0, roughness: 0.25, metalness: 0.8 }), cx + 1.6, h(cx + 1.6, cz + 1.2) + 0.02, cz + 1.2, scene);
    ix.item(cup, 'enamel cup', { mass: 0.2, shape: 'cylinder', sound: 'metal' });
  }

  // -------------------------------------------------------- loose objects --
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x6a4a2a, roughness: 0.9 });
  const stoneMat = new THREE.MeshStandardMaterial({ map: T.rock.map, roughness: 0.6, color: 0x9a948a });
  let cones = 0, stones = 0;
  const spots = [];
  for (let i = 0; i < 400 && (cones < 14 || stones < 12); i++) {
    const a = rnd() * Math.PI * 2, r = 9 + rnd() * 40;
    const x = Math.cos(a) * r, z = Math.sin(a) * r * 1.2 + 12;
    const pd = pathDistance(x, z), e = lakeE(x, z);
    const y = h(x, z);
    if (y < WATER_LEVEL + 0.05) continue;
    if (cones < 14 && pd < 3.5 && pd > 0.6) {
      const m = mesh(pineconeGeo(i), coneMat, x, y + 0.05, z, scene);
      ix.item(m, 'pine cone', { mass: 0.05, shape: 'box', sound: 'soft' }); cones++;
    } else if (stones < 12 && e > 1.0 && e < 1.15) {
      const m = mesh(pebbleGeo(i, 0.06 + rnd() * 0.04), stoneMat, x, y + 0.05, z, scene);
      const it = ix.item(m, 'smooth stone', { mass: 0.6, shape: 'sphere', sound: 'stone' }); it.skimmer = true; stones++;
    }
    spots.push([x, z]);
  }

  // ----------------------------------------------------------- footbridge --
  B.flush(scene).forEach((m) => ix.occluder(m));
  return out;
}
