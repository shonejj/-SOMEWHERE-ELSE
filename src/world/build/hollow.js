// Maple Hollow: a tea house with a hearth, a hot spring, a koi pond with an arched
// bridge, stone lanterns, a bamboo grove, a moon-viewing deck and a rope swing.
import * as THREE from 'three';
import { Batch, boxGeo, rbox, mesh, mtx, worldUV, Spring } from './kit.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Fire, Lamp, pebbleGeo } from './props.js';
import { FLOOR as F, WATER_LEVEL, CABIN, CLEARING, TREEHOUSE, DOCK, LAKE } from '../core/layout.js';
import { mulberry32 } from '../core/noise.js';

const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
const RIDGE = F + 4.5, EAVE = F + 2.85;

export function buildHollow(ctx) {
  const { scene, M, T, ix, col, phys, audio, terrain, updaters } = ctx;
  const root = new THREE.Group(); scene.add(root);
  const B = new Batch();
  const rnd = mulberry32(4711);
  const h = (x, z) => terrain.heightAt(x, z);
  const solid = (a, b, c, d, e, f, o) => { const bx = col.addBox(a, b, c, d, e, f, o); if (bx.phys) phys.addStaticBox(bx); return bx; };
  const addBox = (w, hh, d, mat, x, y, z, tile = 1, rot = [0, 0, 0]) => B.add(boxGeo(w, hh, d, tile), mat, mtx(x, y, z, ...rot));
  const dark = new THREE.MeshStandardMaterial({ map: T.grain.map, color: 0x5a4030, roughness: 0.6 });
  const cedar = new THREE.MeshStandardMaterial({ map: T.grain.map, color: 0xb88a60, roughness: 0.55 });
  const vermilion = new THREE.MeshStandardMaterial({ color: 0xb8402a, roughness: 0.5 });
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xc8beac, roughness: 0.95, emissive: 0xffc070, emissiveIntensity: 0, side: THREE.DoubleSide, envMapIntensity: 0.25 });
  const stoneMat = ctx.rockMat || M.stone;
  T.tatami.map.repeat.set(1, 1);
  const tatamiMat = new THREE.MeshStandardMaterial({ map: T.tatami.map, normalMap: T.tatami.normalMap, roughness: 0.85, envMapIntensity: 0.3 });
  const kawaraMat = new THREE.MeshStandardMaterial({ map: T.kawara.map, normalMap: T.kawara.normalMap, roughness: 0.6, metalness: 0.1 });
  const site = { lamps: [], openables: [], placeY: {} };

  // ============================================================ tea house
  // raised floor + veranda (engawa)
  addBox(12.0, 0.08, 9.0, M.deck, 0, F - 0.04, 0, 1.6);
  addBox(12.2, F, 9.2, stoneMat, 0, F / 2 - 0.08, 0, 1.5);
  solid(-6.1, -2, -4.6, 6.1, F, 4.6, { tag: 'wood' });
  for (let i = 0; i < 3; i++) { const top = F - (i + 1) * 0.19, z = 4.75 + i * 0.3; addBox(2.4, 0.06, 0.32, cedar, 0, top - 0.03, z, 1.2); solid(-1.2, -2, z - 0.16, 1.2, top, z + 0.16, { tag: 'wood' }); }
  // tatami
  for (let ix0 = 0; ix0 < 5; ix0++) for (let iz = 0; iz < 3; iz++) {
    const g = new THREE.PlaneGeometry(1.76, 1.92); g.rotateX(-Math.PI / 2);
    if ((ix0 + iz) % 2) g.rotateY(Math.PI / 2);
    B.add(g, tatamiMat, mtx(-3.6 + ix0 * 1.8, F + 0.012, -1.96 + iz * 1.96));
  }
  // posts and beams
  const postG = boxGeo(0.14, EAVE - F, 0.14, 1.2);
  for (const x of [-4.5, -3, -1.5, 0, 1.5, 3, 4.5]) for (const z of [-3, 3]) { B.add(postG, dark, mtx(x, (EAVE + F) / 2, z)); }
  for (const z of [-1.5, 0, 1.5]) for (const x of [-4.5, 4.5]) B.add(postG, dark, mtx(x, (EAVE + F) / 2, z));
  for (const x of [-6, -3, 0, 3, 6]) for (const z of [-4.5, 4.5]) { B.add(boxGeo(0.16, EAVE - F, 0.16), dark, mtx(x, (EAVE + F) / 2, z)); solid(x - 0.08, F, z - 0.08, x + 0.08, EAVE, z + 0.08, { walk: false }); }
  addBox(9.2, 0.2, 0.2, dark, 0, EAVE - 0.1, -3); addBox(9.2, 0.2, 0.2, dark, 0, EAVE - 0.1, 3);
  addBox(0.2, 0.2, 6.2, dark, -4.5, EAVE - 0.1, 0); addBox(0.2, 0.2, 6.2, dark, 4.5, EAVE - 0.1, 0);
  addBox(12.3, 0.18, 0.2, dark, 0, EAVE - 0.06, -4.5); addBox(12.3, 0.18, 0.2, dark, 0, EAVE - 0.06, 4.5);
  addBox(0.2, 0.18, 9.2, dark, -6, EAVE - 0.06, 0); addBox(0.2, 0.18, 9.2, dark, 6, EAVE - 0.06, 0);
  // ceiling
  addBox(9.0, 0.04, 6.0, M.ceiling, 0, F + 2.62, 0, 1.4);
  for (let x = -4; x <= 4; x += 0.5) addBox(0.04, 0.05, 6.0, dark, x, F + 2.58, 0);
  // hip roof with kawara tiles
  {
    const ex = 6.5, ez = 5.0, rx = 3.2;
    const quads = [
      [[-ex, EAVE, ez], [ex, EAVE, ez], [rx, RIDGE, 0], [-rx, RIDGE, 0]],
      [[ex, EAVE, -ez], [-ex, EAVE, -ez], [-rx, RIDGE, 0], [rx, RIDGE, 0]],
      [[-ex, EAVE, -ez], [-ex, EAVE, ez], [-rx, RIDGE, 0], [-rx, RIDGE, 0]],
      [[ex, EAVE, ez], [ex, EAVE, -ez], [rx, RIDGE, 0], [rx, RIDGE, 0]],
    ];
    const mk = (flip, dy) => {
      const pos = [], uv = [];
      for (const q of quads) {
        const tri = flip ? [[0, 2, 1], [0, 3, 2]] : [[0, 1, 2], [0, 2, 3]];
        for (const t of tri) for (const k of t) { const p = q[k]; pos.push(p[0], p[1] + dy, p[2]); const slope = Math.hypot(p[2], (p[1] - EAVE) * 1.4) + Math.abs(p[0]) * 0.02; uv.push((p[0] + p[2] * 0.2) / 1.6, slope / 1.6); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals();
      return g;
    };
    B.add(mk(false, 0.12), kawaraMat); B.add(mk(true, 0.0), M.ceiling);
    addBox(6.7, 0.22, 0.3, kawaraMat, 0, RIDGE + 0.14, 0, 1);
    for (const sx of [-1, 1]) { const end = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), kawaraMat); end.position.set(sx * 3.35, RIDGE + 0.2, 0); end.scale.set(1, 0.8, 0.6); root.add(end); }
    // fascia boards along the eaves
    for (const s2 of [-1, 1]) { addBox(13.2, 0.14, 0.08, dark, 0, EAVE + 0.05, s2 * 5.02); addBox(0.08, 0.14, 10.1, dark, s2 * 6.52, EAVE + 0.05, 0); }
    solid(-6, EAVE + 0.1, -4.6, 6, EAVE + 0.4, 4.6, { walk: false });
  }
  // shoji walls: lattice + paper, sliding doors on the south side
  const shoji = (w, hh) => {
    const g = new THREE.Group();
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, hh - 0.06), paperMat); paper.position.set(w / 2, hh / 2, 0); g.add(paper);
    const bar = (x, y, bw, bh) => { const m = new THREE.Mesh(boxGeo(bw, bh, 0.035), cedar); m.position.set(x, y, 0); m.castShadow = true; g.add(m); };
    bar(w / 2, 0.03, w, 0.06); bar(w / 2, hh - 0.03, w, 0.06); bar(0.03, hh / 2, 0.06, hh); bar(w - 0.03, hh / 2, 0.06, hh);
    for (let i = 1; i < 3; i++) bar((w * i) / 3, hh / 2, 0.018, hh);
    for (let i = 1; i < 7; i++) bar(w / 2, (hh * i) / 7, w, 0.018);
    bar(w / 2, 0.3, w, 0.5); // wooden kick panel
    return g;
  };
  const WH = EAVE - F - 0.22;
  const wallRun = (axis, c, from, to, skip = []) => {
    for (let a = from; a < to - 0.01; a += 1.5) {
      if (skip.some(([s0, s1]) => a >= s0 - 0.01 && a < s1 - 0.01)) continue;
      const g = shoji(1.5, WH); g.position.set(axis === 'x' ? a : c, F, axis === 'x' ? c : a + 1.5); if (axis === 'z') g.rotation.y = Math.PI / 2; root.add(g);
      if (axis === 'x') solid(a, F, c - 0.05, a + 1.5, F + WH, c + 0.05, { walk: false }); else solid(c - 0.05, F, a, c + 0.05, F + WH, a + 1.5, { walk: false });
      g.traverse((o) => o.isMesh && ix.occluder(o));
    }
  };
  wallRun('x', -3, -4.5, 4.5, [[-1.5, 1.5]]);       // north (alcove in the middle)
  wallRun('z', -4.5, -3, 3);                          // west
  addBox(0.05, WH - 0.6, 6.0, cedar, -4.43, F + 0.3 + (WH - 0.6) / 2 + 0.0, 0, 1.4); // wood wainscot inside the west wall
  wallRun('z', 4.5, -3, 3, [[0, 1.5]]);               // east (one sliding door)
  wallRun('x', 3, -4.5, 4.5, [[-1.5, 1.5]]);          // south: fixed panels either side of the sliders
  // sliding doors
  const slider = (x0, z, axis, dir, label) => {
    const g = shoji(1.5, WH); root.add(g);
    const base = axis === 'x' ? v3(x0, F, z) : v3(z, F, x0 + 1.5);
    if (axis === 'z') g.rotation.y = Math.PI / 2;
    const sp = new Spring(0, 6); let open = false;
    const box = col.addBox(0, 0, 0, 0, 0, 0, { walk: false });
    const place = () => {
      const o = sp.v * 1.48 * dir;
      if (axis === 'x') { g.position.set(base.x + o, F, base.z + 0.05 * Math.sign(o || 1)); box.min.set(base.x + o, F, z - 0.05); box.max.set(base.x + o + 1.5, F + WH, z + 0.05); }
      else { g.position.set(base.x + 0.05, F, base.z + o); box.min.set(base.x - 0.05, F, base.z - 1.5 + o); box.max.set(base.x + 0.05, F + WH, base.z + o); }
    };
    place();
    g.traverse((o) => o.isMesh && ix.occluder(o));
    ix.register(g, { label: () => (open ? 'Slide the door closed' : 'Slide the door open'), use: () => { open = !open; sp.t = open ? 1 : 0; audio?.slide(g.getWorldPosition(v3()), open); } });
    updaters.push((dt) => { if (sp.update(dt)) place(); });
    site.openables.push({ h: { get open() { return open; } }, w: 0.6 });
  };
  slider(-1.5, 3, 'x', -1); slider(0, 3, 'x', 1);
  slider(0, 4.5, 'z', -1);
  {
    // a woven ceiling lamp over the tatami
    const g = new THREE.Group(); g.position.set(-1.5, F + 2.25, 0.3); root.add(g);
    const lm = paperMat.clone(); lm.color.set(0xe8d8b8);
    mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.36, 4), M.black, 0, 0.18, 0, g);
    mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.32, 18, 1, true), lm, 0, -0.12, 0, g, { cast: false });
    const L = new THREE.PointLight(0xffc890, 0, 9, 1.5); L.position.set(0, -0.2, 0); g.add(L);
    const lamp = new Lamp(ctx, L, [[lm, 1.3]], { intensity: 6, on: true }); site.lamps.push(lamp);
    const sw = mesh(boxGeo(0.07, 0.11, 0.02), cedar, -4.42, F + 1.2, 2.2, root); sw.rotation.y = Math.PI / 2;
    ix.register(sw, { label: () => (lamp.on ? 'Switch off the ceiling lamp' : 'Switch on the ceiling lamp'), use: () => lamp.toggle(sw.position) });
  }
  // the alcove (tokonoma) with a hanging scroll and a flower arrangement
  addBox(3.0, 0.12, 0.7, cedar, 0, F + 0.06, -3.35, 1.2);
  addBox(3.0, WH, 0.06, M.ceiling, 0, F + WH / 2, -3.72, 1.4);
  addBox(0.06, WH, 0.72, dark, -1.5, F + WH / 2, -3.36); addBox(0.06, WH, 0.72, dark, 1.5, F + WH / 2, -3.36);
  solid(-1.5, F, -3.75, 1.5, F + WH, -3.0, { walk: false });
  mesh(new THREE.PlaneGeometry(0.62, 1.55), new THREE.MeshStandardMaterial({ map: T.scroll, roughness: 0.9 }), 0, F + 1.25, -3.68, root, { cast: false });
  mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.7, 6), dark, 0, F + 2.04, -3.66, root).rotation.z = Math.PI / 2;
  {
    const vase = mesh(new THREE.LatheGeometry([0.0, 0.05, 0.075, 0.07, 0.04, 0.045].map((r, i) => new THREE.Vector2(r, i * 0.05)), 16), new THREE.MeshStandardMaterial({ color: 0x3a4a5a, roughness: 0.25 }), 0.75, F + 0.12, -3.35, root);
    for (let i = 0; i < 5; i++) { const b = mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.6, 4), dark, 0.75 + (rnd() - 0.5) * 0.1, F + 0.55, -3.35, root); b.rotation.set((rnd() - 0.5) * 0.6, 0, (rnd() - 0.5) * 0.8); }
    const leaves = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.4), new THREE.MeshStandardMaterial({ map: T.maple, alphaTest: 0.5, side: THREE.DoubleSide })); leaves.position.set(0.75, F + 0.82, -3.35); root.add(leaves);
    vase.castShadow = true;
  }
  // sunken hearth (irori) with a hanging iron kettle
  addBox(1.1, 0.05, 1.1, dark, 0, F + 0.025, 0, 1);
  mesh(new THREE.PlaneGeometry(0.92, 0.92).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x4a4644, roughness: 1 }), 0, F + 0.052, 0, root, { cast: false });
  solid(-0.55, F, -0.55, 0.55, F + 0.05, 0.55, { walk: true });
  const hearth = new Fire(ctx, root, v3(0, F + 0.05, 0), { scale: 0.65, intensity: 9, lightOffset: v3(0, 0.45, 0), startOn: true });
  updaters.push((dt, t) => hearth.update(dt, t));
  mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.55, 6), M.black, 0, F + 1.82, 0, root);
  const hook = mesh(boxGeo(0.25, 0.04, 0.03), dark, 0, F + 1.1, 0, root);
  const kettle = new THREE.Group(); kettle.position.set(0, F + 0.56, 0); root.add(kettle);
  const iron = new THREE.MeshStandardMaterial({ color: 0x1c1a19, roughness: 0.55, metalness: 0.5 });
  mesh(new THREE.LatheGeometry([0.02, 0.1, 0.135, 0.14, 0.12, 0.06, 0.035].map((r, i) => new THREE.Vector2(r, i * 0.035)), 20), iron, 0, 0, 0, kettle);
  mesh(new THREE.CylinderGeometry(0.012, 0.022, 0.12, 8), iron, 0.13, 0.1, 0, kettle).rotation.z = -0.9;
  mesh(new THREE.TorusGeometry(0.1, 0.008, 6, 16, Math.PI), iron, 0, 0.22, 0, kettle);
  const steam = steamPoints(scene, v3(0.17, F + 0.72, 0), 24, 0.6);
  let brewing = 0;
  const hearthHit = mesh(new THREE.BoxGeometry(0.9, 0.5, 0.9), new THREE.MeshBasicMaterial({ visible: false }), 0, F + 0.25, 0, root);
  ix.register(hearthHit, { label: () => (hearth.on ? 'Let the hearth die down' : 'Light the hearth'), use: () => hearth.toggle() });
  const cups = [];
  ix.register(kettle, {
    label: () => (brewing > 0 ? 'The kettle is singing…' : 'Brew a pot of tea'),
    use: () => {
      if (!hearth.on) { ctx.ui.toast('The hearth is cold — light it first.'); return; }
      if (brewing > 0) return;
      brewing = 5; ctx.ui.toast('The kettle begins to hum…');
      audio?.noiseHit(kettle.getWorldPosition(v3()), { buf: audio.pink, type: 'bandpass', f: 900, a: 1.5, d: 3, v: 0.12 });
    },
  });
  updaters.push((dt) => {
    steam.u.uLevel.value += ((brewing > 0 ? 1 : hearth.on ? 0.25 : 0) - steam.u.uLevel.value) * Math.min(1, dt);
    if (brewing > 0) {
      brewing -= dt;
      if (brewing <= 0) {
        for (const c of cups) c.hot = 90;
        audio?.noiseHit(v3(2.6, F + 0.4, -1.4), { type: 'bandpass', f: 1400, q: 0.7, a: 0.1, d: 1.6, v: 0.18 });
        ctx.ui.toast('Tea is poured — the cups on the low table are warm.');
      }
    }
  });
  // low table with a tea set
  {
    const tg = new THREE.Group(); tg.position.set(2.6, F, -1.4); root.add(tg);
    mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.035, 32), cedar, 0, 0.31, 0, tg);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.78; mesh(boxGeo(0.05, 0.3, 0.05), dark, Math.cos(a) * 0.32, 0.15, Math.sin(a) * 0.32, tg); }
    solid(2.12, F, -1.88, 3.08, F + 0.33, -0.92, { walk: false });
    const glaze = new THREE.MeshPhysicalMaterial({ color: 0x5a6a4a, roughness: 0.25, clearcoat: 0.6 });
    const pot = new THREE.Group(); pot.position.set(2.5, F + 0.33, -1.5); root.add(pot);
    mesh(new THREE.LatheGeometry([0.0, 0.06, 0.075, 0.07, 0.04, 0.03].map((r, i) => new THREE.Vector2(r, i * 0.025)), 18), glaze, 0, 0, 0, pot);
    mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.09, 6), glaze, 0.08, 0.05, 0, pot).rotation.z = -1.0;
    mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 6), dark, -0.09, 0.06, 0, pot).rotation.z = Math.PI / 2 + 0.3;
    ix.item(pot, 'teapot', { mass: 0.6, sound: 'ceramic' });
    for (let i = 0; i < 3; i++) {
      const cg = new THREE.Group(); cg.position.set(2.75 + (i - 1) * 0.14, F + 0.33, -1.25 - (i % 2) * 0.1); root.add(cg);
      mesh(new THREE.LatheGeometry([0.0, 0.03, 0.038, 0.042].map((r, k) => new THREE.Vector2(r, k * 0.022)), 16), new THREE.MeshPhysicalMaterial({ color: [0xe8e0d0, 0x8a5a3a, 0x3a4a5a][i], roughness: 0.3, clearcoat: 0.5, side: THREE.DoubleSide }), 0, 0, 0, cg);
      const tea = mesh(new THREE.CircleGeometry(0.034, 14).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x7a6a2a, roughness: 0.1 }), 0, 0.05, 0, cg, { cast: false });
      const it = ix.item(cg, 'cup of tea', { mass: 0.15, shape: 'cylinder', sound: 'ceramic' });
      it.hot = 0; tea.visible = false;
      const st = steamPoints(scene, v3(), 10, 0.18);
      updaters.push((dt) => { it.hot = Math.max(0, it.hot - dt); tea.visible = it.hot > 0 || it.wasHot; if (it.hot > 0) it.wasHot = true; st.points.position.copy(cg.position).add(v3(0, 0.06, 0)); st.u.uLevel.value = Math.min(1, it.hot / 30); });
      cups.push(it);
    }
  }
  // floor cushions around the hearth (sit cross-legged, facing the fire)
  const cushionMat = new THREE.MeshStandardMaterial({ map: T.wool.map, color: 0x6a3a5a, roughness: 1 });
  for (const [x, z] of [[0, 1.05], [0, -1.05], [1.05, 0], [-1.05, 0]]) {
    const c = mesh(rbox(0.6, 0.08, 0.6, 0.04, 3), cushionMat, x, F + 0.04, z, root);
    const yaw = Math.atan2(x, z); // face the hearth
    const seat = { eye: v3(x * 1.05, F + 0.86, z * 1.05), yaw, low: true, exit: v3(x * 1.7, F, z * 1.7) };
    ix.register(c, { label: 'Sit by the hearth', use: () => ctx.player.sit(seat) });
  }
  // futon
  {
    const fx = -3.4;
    mesh(rbox(1.0, 0.09, 2.05, 0.04, 3), M.linen, fx, F + 0.045, 0, root);
    const quilt = mesh(rbox(1.06, 0.07, 1.5, 0.03, 3), new THREE.MeshStandardMaterial({ map: T.quilt.map, color: 0x7a90c8, roughness: 0.95 }), fx, F + 0.12, 0.25, root);
    mesh(rbox(0.5, 0.1, 0.3, 0.04, 3), M.linen, fx, F + 0.14, -0.8, root);
    const lie = { eye: v3(fx, F + 0.42, -0.75), yaw: Math.PI, lie: true, exit: v3(fx + 1.0, F, 0), yawLimit: 3 };
    ix.register(quilt, { label: 'Lie down on the futon', use: () => { ctx.player.sit(lie); ctx.ui.toast('Resting… the light moves across the paper screens'); } });
  }
  // paper floor lanterns (andon)
  const andon = (x, z, on) => {
    const g = new THREE.Group(); g.position.set(x, F, z); root.add(g);
    for (const [px, pz] of [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]]) mesh(boxGeo(0.025, 0.7, 0.025), dark, px, 0.35, pz, g);
    const pm = paperMat.clone();
    for (let i = 0; i < 4; i++) { const p = mesh(new THREE.PlaneGeometry(0.26, 0.42), pm, 0, 0.42, 0, g, { cast: false }); p.rotation.y = i * Math.PI / 2; p.translateZ(0.135); }
    mesh(boxGeo(0.32, 0.03, 0.32), dark, 0, 0.66, 0, g);
    const L = new THREE.PointLight(0xffb060, 0, 7, 1.7); L.position.set(0, 0.42, 0); g.add(L);
    const lamp = new Lamp(ctx, L, [[pm, 1.6]], { intensity: 3.5, on });
    site.lamps.push(lamp);
    ix.register(g, { label: () => (lamp.on ? 'Turn the lantern down' : 'Light the paper lantern'), use: () => lamp.toggle() });
    solid(x - 0.16, F, z - 0.16, x + 0.16, F + 0.7, z + 0.16, { walk: false });
  };
  andon(-3.9, -2.4, true); andon(3.9, 2.4, false);
  updaters.push((dt) => site.lamps.forEach((l) => l.update(dt)));
  // tansu chest with drawers
  {
    const cx = 3.95, cz = -1.0;
    addBox(0.5, 0.9, 1.2, dark, cx, F + 0.45, cz, 1.2);
    solid(cx - 0.25, F, cz - 0.6, cx + 0.25, F + 0.9, cz + 0.6, { walk: false });
    for (let i = 0; i < 3; i++) {
      const dg = new THREE.Group(); dg.position.set(cx - 0.26, F + 0.16 + i * 0.28, cz); root.add(dg);
      mesh(boxGeo(0.03, 0.24, 1.12), cedar, 0, 0, 0, dg);
      mesh(new THREE.TorusGeometry(0.03, 0.005, 5, 12), M.iron, -0.025, 0, 0, dg).rotation.y = Math.PI / 2;
      const inner = mesh(boxGeo(0.42, 0.18, 1.05), cedar, 0.21, -0.01, 0, dg); inner.castShadow = false;
      if (i === 1) for (let k = 0; k < 6; k++) mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.2, 4), new THREE.MeshStandardMaterial({ color: 0x6a3a2a }), 0.15, 0.09, -0.3 + k * 0.02, dg).rotation.x = Math.PI / 2;
      const sp = new Spring(0, 9); let open = false;
      ix.register(dg, { label: () => (open ? 'Close drawer' : 'Open drawer'), use: () => { open = !open; sp.t = open ? 1 : 0; audio?.slide(dg.getWorldPosition(v3()), open); } });
      updaters.push((dt) => { sp.update(dt); dg.position.x = cx - 0.26 - sp.v * 0.32; });
    }
  }
  // veranda: hanging lantern, glass wind bell, bonsai, sandals
  {
    const ch = new THREE.Group(); ch.position.set(0, EAVE - 0.15, 4.4); root.add(ch);
    const swing = new THREE.Group(); ch.add(swing);
    mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.3, 4), M.black, 0, -0.15, 0, swing);
    const lm = paperMat.clone(); lm.color.set(0xd84a2a);
    mesh(new THREE.SphereGeometry(0.18, 18, 12).scale(1, 1.3, 1), lm, 0, -0.52, 0, swing, { cast: false });
    const L = new THREE.PointLight(0xff9050, 0, 8, 1.6); L.position.set(0, -0.52, 0); swing.add(L);
    const lamp = new Lamp(ctx, L, [[lm, 1.4]], { intensity: 4 }); site.lamps.push(lamp);
    ix.register(swing, { label: () => (lamp.on ? 'Put out the porch lantern' : 'Light the porch lantern'), use: () => lamp.toggle() });
    updaters.push((dt, t) => { const w = ctx.weather.w.gust; swing.rotation.z = Math.sin(t * 1.3) * 0.08 * w; swing.rotation.x = Math.sin(t * 0.9 + 1) * 0.06 * w; });
    const furin = new THREE.Group(); furin.position.set(5.6, EAVE - 0.1, 4.4); root.add(furin);
    const bell = new THREE.Group(); furin.add(bell);
    mesh(new THREE.SphereGeometry(0.06, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xd8eef8, transparent: true, opacity: 0.5, roughness: 0.05, side: THREE.DoubleSide }), 0, -0.08, 0, bell);
    const strip = mesh(new THREE.PlaneGeometry(0.06, 0.22), new THREE.MeshStandardMaterial({ color: 0xf0e0a0, side: THREE.DoubleSide }), 0, -0.26, 0, bell, { cast: false });
    let tBell = 0;
    updaters.push((dt, t) => {
      const w = ctx.weather.w.gust; bell.rotation.z = Math.sin(t * 2.3) * 0.2 * w; strip.rotation.y = Math.sin(t * 1.7) * 1.2 * w; strip.rotation.x = Math.sin(t * 2.9) * 0.4 * w;
      tBell -= dt; if (tBell < 0) { tBell = 1 + rnd() * (6 - w * 5); if (w > 0.15 && rnd() < w) audio?.tone(furin.position, { f: 2900 + rnd() * 300, a: 0.002, d: 1.6, v: 0.05, ref: 3 }); }
    });
    ix.register(furin, { label: 'Ring the wind bell', use: () => { audio?.tone(furin.position, { f: 3000, a: 0.002, d: 2, v: 0.08, ref: 3 }); audio?.tone(furin.position, { f: 6100, a: 0.002, d: 0.8, v: 0.02, ref: 3 }); } });
    // bonsai on a stand
    const bs = new THREE.Group(); bs.position.set(-5.4, F, 4.0); root.add(bs);
    mesh(boxGeo(0.5, 0.35, 0.4), dark, 0, 0.175, 0, bs);
    mesh(boxGeo(0.36, 0.08, 0.26), new THREE.MeshStandardMaterial({ color: 0x4a3a32, roughness: 0.6 }), 0, 0.39, 0, bs);
    const tr = mesh(new THREE.CylinderGeometry(0.015, 0.03, 0.22, 6), M.logs, 0, 0.5, 0, bs); tr.rotation.z = 0.4;
    for (let i = 0; i < 4; i++) { const p = mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ map: T.maple, color: 0xffffff, roughness: 0.8 }), -0.05 + (i - 1.5) * 0.07, 0.6 + (i % 2) * 0.05, (i % 2 - 0.5) * 0.06, bs); p.scale.set(1.3, 0.6, 1); }
    solid(-5.65, F, 3.8, -5.15, F + 0.4, 4.2, { walk: true });
    for (const sx of [-0.12, 0.12]) { const geta = mesh(rbox(0.1, 0.03, 0.22, 0.01), cedar, 0.9 + sx, F - 0.18, 4.95, root); geta.rotation.y = 0.1 * sx; }
    // broom you can carry
    const broom = new THREE.Group(); mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 6), cedar, 0, 0.6, 0, broom);
    mesh(new THREE.ConeGeometry(0.12, 0.3, 10), new THREE.MeshStandardMaterial({ color: 0xa08850, roughness: 1 }), 0, 0.05, 0, broom).rotation.x = Math.PI;
    broom.position.set(5.6, F + 0.15, -4.2); broom.rotation.z = 0.15; root.add(broom);
    ix.item(broom, 'bamboo broom', { mass: 0.6, sound: 'wood' });
  }
  // stone water basin with a bamboo "shishi-odoshi" that fills and clacks
  {
    const bx = 3.2, bz = 6.6, by = h(bx, bz);
    const basin = mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.42, 14), stoneMat, bx, by + 0.18, bz, root);
    mesh(new THREE.CircleGeometry(0.33, 16).rotateX(-Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x2a3a34, roughness: 0.05, transmission: 0, metalness: 0.2 }), bx, by + 0.38, bz, root, { cast: false });
    col.addCylinder(bx, bz, 0.45, by, by + 0.4);
    const bamboo = new THREE.MeshStandardMaterial({ color: 0x8aa050, roughness: 0.45 });
    const piv = new THREE.Group(); piv.position.set(bx + 0.65, by + 0.42, bz); root.add(piv);
    const tube = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.8, 10), bamboo, 0, 0, 0, piv); tube.rotation.z = Math.PI / 2 - 0.15;
    for (const zz of [-0.12, 0.12]) mesh(boxGeo(0.04, 0.5, 0.04), bamboo, bx + 0.65, by + 0.22, bz + zz, root);
    let fill = 0, tip = 0;
    const wsnd = audio?.water(v3(bx, by + 0.4, bz)); wsnd?.set(true);
    updaters.push((dt) => {
      fill += dt / 9;
      if (fill >= 1 && tip === 0) { tip = 1; fill = 0; setTimeout(() => audio?.noiseHit(piv.position, { buf: audio.brown, type: 'bandpass', f: 520, q: 5, a: 0.001, d: 0.2, v: 1.0, ref: 6 }), 650); }
      tip = Math.max(0, tip - dt * 0.9);
      piv.rotation.z = -0.15 + fill * 0.3 - Math.sin(Math.min(1, tip) * Math.PI) * 0.6;
    });
    const ladle = new THREE.Group(); mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.05, 10, 1, true), bamboo, 0, 0, 0, ladle); mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.42, 5), bamboo, 0.21, 0.02, 0, ladle).rotation.z = Math.PI / 2;
    ladle.position.set(bx, by + 0.42, bz - 0.15); root.add(ladle);
    ix.item(ladle, 'bamboo ladle', { mass: 0.15, sound: 'wood' });
  }

  // ======================================================= paths & lanterns
  const lanternParts = [];
  { const base = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 6); base.translate(0, 0.075, 0); lanternParts.push(base.toNonIndexed());
    const post = new THREE.CylinderGeometry(0.1, 0.12, 0.7, 8); post.translate(0, 0.5, 0); lanternParts.push(post.toNonIndexed());
    const plat = new THREE.CylinderGeometry(0.24, 0.2, 0.1, 6); plat.translate(0, 0.9, 0); lanternParts.push(plat.toNonIndexed());
    const roofG = new THREE.ConeGeometry(0.38, 0.28, 6); roofG.translate(0, 1.33, 0); lanternParts.push(roofG.toNonIndexed());
    const fin = new THREE.SphereGeometry(0.06, 8, 6); fin.translate(0, 1.5, 0); lanternParts.push(fin.toNonIndexed()); }
  const lanternMerged = mergeGeometries(lanternParts.map((g) => { g.deleteAttribute('uv'); return g; }));
  const glowMat = new THREE.MeshStandardMaterial({ color: 0x302010, emissive: 0xffa040, emissiveIntensity: 0 });
  const lanternSpots = [[2.4, 9], [-2.2, 9.4], [7, 15], [10, 19.5], [-10, 1.5], [-20, 6.5], [-28, 10], [14.5, -8], [24, -17.5], [31, -23], [-12, -10], [-24, -23]];
  const lms = [], glows = [];
  for (const [x, z] of lanternSpots) { const y = h(x, z) - 0.03; lms.push(new THREE.Matrix4().makeTranslation(x, y, z)); glows.push(new THREE.Matrix4().makeTranslation(x, y + 1.08, z)); col.addCylinder(x, z, 0.3, y, y + 1.5); }
  const li = new THREE.InstancedMesh(lanternMerged, stoneMat, lms.length); lms.forEach((m, i) => li.setMatrixAt(i, m)); li.castShadow = true; li.receiveShadow = true; scene.add(li);
  const gi = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), glowMat, glows.length); glows.forEach((m, i) => gi.setMatrixAt(i, m)); scene.add(gi);
  updaters.push(() => { const night = ctx.sky.state.night; glowMat.emissiveIntensity = night > 0.4 ? 2.2 + Math.sin(performance.now() / 300) * 0.1 : 0; paperMat.emissiveIntensity = night * (site.lamps[0].on || hearth.on ? 0.55 : 0.1); });
  // wooden gate on the path
  {
    const gx = 0.4, gz = 9.6, gy = h(gx, gz);
    for (const sx of [-1.3, 1.3]) { B.add(new THREE.CylinderGeometry(0.11, 0.13, 3.0, 10), dark, mtx(gx + sx, gy + 1.5, gz)); col.addCylinder(gx + sx, gz, 0.13, gy, gy + 3); }
    addBox(3.4, 0.16, 0.2, dark, gx, gy + 2.7, gz); addBox(3.0, 0.12, 0.14, dark, gx, gy + 2.3, gz);
    addBox(3.9, 0.08, 1.0, kawaraMat, gx, gy + 3.05, gz, 1.2, [0, 0, 0]);
  }

  // ============================================================ koi bridge
  {
    const x = DOCK.x, z0 = DOCK.zStart, z1 = DOCK.zEnd, base = WATER_LEVEL + 0.6;
    const yAt = (t) => base + Math.sin(t * Math.PI) * 0.85;
    const n = Math.ceil((z1 - z0) / 0.45);
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, za = z0 + (z1 - z0) * t0, zb = z0 + (z1 - z0) * t1;
      const ya = yAt(t0), yb = yAt(t1), len = Math.hypot(zb - za, yb - ya), ang = Math.atan2(yb - ya, zb - za);
      B.add(boxGeo(DOCK.width, 0.06, len + 0.02, 1.4), cedar, mtx(x, (ya + yb) / 2 - 0.03, (za + zb) / 2, -ang, 0, 0));
      solid(x - DOCK.width / 2, -6, za, x + DOCK.width / 2, Math.max(ya, yb) - 0.0, zb, { tag: 'wood' });
      for (const s2 of [-1, 1]) {
        B.add(boxGeo(0.06, 0.06, len + 0.02), vermilion, mtx(x + s2 * (DOCK.width / 2 - 0.03), (ya + yb) / 2 + 0.9, (za + zb) / 2, -ang, 0, 0));
        if (i % 3 === 0) { B.add(boxGeo(0.08, 0.95, 0.08), vermilion, mtx(x + s2 * (DOCK.width / 2 - 0.03), ya + 0.45, za)); }
        solid(x + s2 * (DOCK.width / 2) - 0.05, ya, za, x + s2 * (DOCK.width / 2) + 0.05, ya + 1.0, zb, { walk: false });
      }
    }
    for (const zz of [z0 + 4, z1 - 4]) for (const s2 of [-1, 1]) B.add(new THREE.CylinderGeometry(0.1, 0.12, 2.6, 8), vermilion, mtx(x + s2 * (DOCK.width / 2 + 0.05), base - 1.1, zz));
    const mid = (z0 + z1) / 2;
    site.placeY.bridge = yAt(0.36) + 0.1;
    const feed = mesh(new THREE.BoxGeometry(DOCK.width, 1.0, 3), new THREE.MeshBasicMaterial({ visible: false }), x, yAt(0.5) + 0.6, mid, root);
    ix.register(feed, { label: 'Scatter food for the koi', use: () => { ctx.koiFeed?.(v3(x + 1.3, WATER_LEVEL, mid + (rnd() - 0.5) * 3)); ctx.ui.toast('The koi come gliding up from the deep.'); } });
  }

  // ============================================================ hot spring
  {
    const cx = CLEARING.x, cz = CLEARING.z, cy = h(cx, cz);
    const rx = 3.2, rz = 2.6, wy = cy + 0.28;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, s2 = 0.45 + rnd() * 0.35;
      const g = pebbleGeo(i + 40, 1); g.scale(s2 * 1.3, s2 * 1.4, s2);
      const m = mesh(g, stoneMat, cx + Math.cos(a) * rx, cy + 0.12, cz + Math.sin(a) * rz, root); m.rotation.y = a;
      col.addCylinder(cx + Math.cos(a) * rx, cz + Math.sin(a) * rz, 0.38, cy - 1, cy + 0.45);
    }
    const waterG = new THREE.CircleGeometry(1, 40); waterG.rotateX(-Math.PI / 2); waterG.scale(rx * 0.98, 1, rz * 0.98);
    const wn = T.water.clone(); wn.needsUpdate = true; wn.repeat.set(2, 2);
    const springMat = new THREE.MeshPhysicalMaterial({ color: 0x8ab8b0, roughness: 0.08, normalMap: wn, normalScale: new THREE.Vector2(0.2, 0.2), transparent: true, opacity: 0.82, envMapIntensity: 1.2 });
    mesh(waterG, springMat, cx, wy, cz, root, { cast: false });
    mesh(new THREE.CircleGeometry(1, 30).rotateX(-Math.PI / 2).scale(rx, 1, rz), new THREE.MeshStandardMaterial({ color: 0x3a3a34, roughness: 1 }), cx, cy + 0.01, cz, root, { cast: false });
    updaters.push((dt) => { wn.offset.x += dt * 0.01; wn.offset.y += dt * 0.006; });
    const st = steamPoints(scene, v3(cx, wy, cz), 70, 2.6);
    updaters.push(() => { st.u.uLevel.value = 0.55 + ctx.sky.state.night * 0.35 + ctx.weather.w.rain * 0.2; });
    // bamboo spout pouring in
    const bamboo = new THREE.MeshStandardMaterial({ color: 0x8aa050, roughness: 0.45 });
    const sp = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 10), bamboo, cx + rx + 0.2, cy + 0.85, cz - 0.4, root); sp.rotation.z = Math.PI / 2 - 0.25;
    mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.6, 8), new THREE.MeshPhysicalMaterial({ color: 0xd0e8f0, transparent: true, opacity: 0.45, roughness: 0.05 }), cx + rx - 0.38, cy + 0.6, cz - 0.4, root, { cast: false });
    const ws = audio?.water(v3(cx + rx - 0.4, cy + 0.4, cz - 0.4)); ws?.set(true);
    // bamboo fence behind
    for (let i = 0; i < 26; i++) { const a = Math.PI * 1.15 + (i / 26) * Math.PI * 0.8; const fx2 = cx + Math.cos(a) * (rx + 1.6), fz2 = cz + Math.sin(a) * (rz + 1.6); B.add(new THREE.CylinderGeometry(0.04, 0.045, 2.0, 7), bamboo, mtx(fx2, h(fx2, fz2) + 1.0, fz2)); }
    // bucket, stool, towel
    const bucket = new THREE.Group(); mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.24, 16, 1, true), cedar, 0, 0.12, 0, bucket).material = new THREE.MeshStandardMaterial({ map: T.grain.map, color: 0xd8b080, side: THREE.DoubleSide });
    mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 16), cedar, 0, 0.01, 0, bucket);
    bucket.position.set(cx - rx - 0.9, cy, cz + 0.5); root.add(bucket); ix.item(bucket, 'wooden bucket', { mass: 0.8, sound: 'wood' });
    const towel = mesh(rbox(0.5, 0.04, 0.3, 0.02), new THREE.MeshStandardMaterial({ map: T.linen.map, color: 0xe8e4f0 }), cx - rx - 0.2, cy + 0.62, cz - 1.4, root);
    ix.item(towel, 'towel', { mass: 0.3, sound: 'soft' });
    const soak = { eye: v3(cx + 0.6, wy + 0.42, cz - 0.4), yaw: Math.atan2(-(DOCK.x - cx), -(DOCK.zStart - cz)), low: true, soak: true, exit: v3(cx - rx - 1.2, cy, cz), yawLimit: 2.6 };
    const hit = mesh(new THREE.CylinderGeometry(rx, rx, 0.5, 16).scale(1, 1, rz / rx), new THREE.MeshBasicMaterial({ visible: false }), cx, wy, cz, root);
    ix.register(hit, { label: 'Soak in the hot spring', use: () => { ctx.player.sit(soak); audio?.splash(soak.eye, 0.4); ctx.ui.toast('Warm water, cool air. Breathe out.'); } });
  }

  // ======================================================= moon-viewing deck
  {
    const dx = TREEHOUSE.x, dz = TREEHOUSE.z; let gy = -1e9; for (let a = 0; a < 6.28; a += 0.5) for (const rr of [0, 1.5, 2.5, 3.5]) gy = Math.max(gy, h(dx + Math.cos(a) * rr, dz + Math.sin(a) * rr)); const top = gy + 0.9;
    site.placeY.moondeck = top;
    for (let z = dz - 2.5; z < dz + 2.5; z += 0.2) addBox(5.0, 0.05, 0.18, cedar, dx, top - 0.025, z + 0.1, 1.4);
    for (const [px, pz] of [[-2.4, -2.4], [2.4, -2.4], [-2.4, 2.4], [2.4, 2.4], [0, -2.4], [0, 2.4]]) { const y0 = h(dx + px, dz + pz); B.add(boxGeo(0.14, top - y0 + 0.3, 0.14), dark, mtx(dx + px, (top + y0) / 2 - 0.15, dz + pz)); }
    solid(dx - 2.5, top - 1.5, dz - 2.5, dx + 2.5, top, dz + 2.5, { tag: 'wood' });
    for (let i = 0; i < 4; i++) { const t2 = top - (i + 1) * 0.24, z = dz + 2.65 + i * 0.32; addBox(1.4, 0.05, 0.3, cedar, dx, t2, z, 1.2); solid(dx - 0.7, t2 - 2, z - 0.16, dx + 0.7, t2, z + 0.16, { tag: 'wood' }); }
    const rail = (ax, az, bx, bz) => { const L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(-(bz - az), bx - ax); B.add(boxGeo(L, 0.06, 0.08), vermilion, mtx((ax + bx) / 2, top + 0.9, (az + bz) / 2, 0, ry, 0)); solid(Math.min(ax, bx) - 0.05, top, Math.min(az, bz) - 0.05, Math.max(ax, bx) + 0.05, top + 0.95, Math.max(az, bz) + 0.05, { walk: false }); };
    rail(dx - 2.5, dz - 2.5, dx + 2.5, dz - 2.5); rail(dx - 2.5, dz - 2.5, dx - 2.5, dz + 2.5); rail(dx + 2.5, dz - 2.5, dx + 2.5, dz + 2.5);
    rail(dx - 2.5, dz + 2.5, dx - 0.75, dz + 2.5); rail(dx + 0.75, dz + 2.5, dx + 2.5, dz + 2.5);
    addBox(1.6, 0.06, 0.42, cedar, dx, top + 0.45, dz - 1.6, 1.2);
    for (const sx of [-0.7, 0.7]) addBox(0.06, 0.45, 0.4, dark, dx + sx, top + 0.22, dz - 1.6);
    solid(dx - 0.8, top, dz - 1.82, dx + 0.8, top + 0.48, dz - 1.38, { walk: false });
    const bench = { eye: v3(dx, top + 1.1, dz - 1.6), yaw: Math.PI * 0.95, exit: v3(dx, top, dz - 0.6), yawLimit: 2.2 };
    const bh = mesh(new THREE.BoxGeometry(1.6, 0.4, 0.5), new THREE.MeshBasicMaterial({ visible: false }), dx, top + 0.5, dz - 1.6, root);
    ix.register(bh, { label: 'Sit and watch the sky', use: () => ctx.player.sit(bench) });
    const scope = new THREE.Group(); scope.position.set(dx + 1.6, top, dz + 1.2); root.add(scope);
    for (let i = 0; i < 3; i++) { const l = mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 6), M.brass, Math.cos(i * 2.1) * 0.15, 0.58, Math.sin(i * 2.1) * 0.15, scope); l.rotation.set(Math.sin(i * 2.1) * 0.25, 0, -Math.cos(i * 2.1) * 0.25); }
    const tb = mesh(new THREE.CylinderGeometry(0.04, 0.055, 0.8, 14), M.brass, 0, 1.25, 0, scope); tb.rotation.x = Math.PI / 2 - 0.5;
    ix.register(scope, { label: 'Look through the telescope', use: () => ctx.player.scope(Math.PI * 0.9) });
    solid(dx + 1.4, top, dz + 1.0, dx + 1.8, top + 1.3, dz + 1.4, { walk: false });
  }

  // ============================================================ rope swing
  {
    const px = 13.6, pz = -9.5, py = h(12, -9.5) + 4.3, gy = h(px, pz);
    const pivot = new THREE.Group(); pivot.position.set(px, py, pz); root.add(pivot);
    const L = py - gy - 0.55;
    const rope = new THREE.MeshStandardMaterial({ color: 0xb09a70, roughness: 1 });
    for (const sx of [-0.28, 0.28]) mesh(new THREE.CylinderGeometry(0.012, 0.012, L, 5), rope, sx, -L / 2, 0, pivot);
    mesh(rbox(0.7, 0.05, 0.25, 0.015), cedar, 0, -L, 0, pivot);
    B.add(new THREE.CylinderGeometry(0.08, 0.12, 2.0, 8), M.logs, mtx(px - 0.6, py + 0.05, pz, 0, 0, Math.PI / 2 - 0.15));
    let swinging = 0, ph = 0;
    const yaw = Math.PI * 0.3;
    pivot.rotation.y = yaw;
    const seat = { yaw, exit: v3(px - Math.sin(yaw) * -1.2, gy, pz - Math.cos(yaw) * -1.2), yawLimit: 1.6,
      getEye: () => { const a = Math.sin(ph) * 0.55 * swinging; const local = v3(0, -L * Math.cos(a) + 0.62, L * Math.sin(a)); return local.applyAxisAngle(v3(0, 1, 0), yaw).add(pivot.position); },
      onExit: () => (swinging = 0) };
    ix.register(pivot, { label: 'Sit on the swing', use: () => { swinging = 0.05; ctx.player.sit(seat); } });
    updaters.push((dt) => {
      if (ctx.player.seat === seat) swinging = Math.min(1, swinging + dt * 0.15); else swinging *= 0.98;
      ph += dt * Math.sqrt(9.8 / L);
      pivot.rotation.x = -Math.sin(ph) * 0.55 * swinging;
      if (swinging > 0.2 && Math.abs(Math.cos(ph)) < 0.02 && rnd() < 0.2) audio?.creak(pivot.position, 0.03, 0.35, 140);
    });
  }

  // a bench in the bamboo grove
  {
    const bx = -24, bz = -21, by = h(bx, bz);
    const g = new THREE.CylinderGeometry(0.2, 0.22, 1.7, 12); g.rotateZ(Math.PI / 2);
    const m = mesh(g, new THREE.MeshStandardMaterial({ map: T.bark.map, normalMap: T.bark.normalMap, roughness: 1 }), bx, by + 0.2, bz, root); m.rotation.y = 0.4;
    col.addCylinder(bx, bz, 0.5, by, by + 0.42);
    const seat = { eye: v3(bx, by + 1.02, bz), yaw: 0.4 + Math.PI / 2, exit: v3(bx + 0.9, by, bz + 0.5) };
    ix.register(m, { label: 'Sit among the bamboo', use: () => ctx.player.sit(seat) });
  }

  B.flush(root).forEach((m) => ix.occluder(m));

  site.indoor = (p) => p.x > -4.5 && p.x < 4.5 && p.z > -3 && p.z < 3 && p.y < RIDGE && p.y > F - 0.5;
  site.openness = () => site.openables.reduce((a, o) => a + (o.h.open ? o.w : 0), 0) / 1.5;
  site.roofs = [{ x0: -6.5, x1: 6.5, z0: -5.0, z1: 5.0, y: (x, z) => RIDGE - Math.max(Math.abs(z) / 5, Math.max(0, Math.abs(x) - 3.2) / 3.3) * (RIDGE - EAVE) + 0.15 }];
  site.rainRects = [[-6.5, -5.0, 6.5, 5.0, RIDGE + 0.3], [0, 0, 0, 0, -10]];
  site.eaves = [[-6.5, -5.05, 6.5, -5.05, EAVE - 0.05], [-6.5, 5.05, 6.5, 5.05, EAVE - 0.05], [-6.55, -5, -6.55, 5, EAVE - 0.05], [6.55, -5, 6.55, 5, EAVE - 0.05]];
  site.fire = hearth;
  return site;
}

/** Soft rising steam (kettle, tea cups, hot spring). */
export function steamPoints(scene, at, n, spread) {
  const s = new Float32Array(n * 3), r = mulberry32(n * 13);
  for (let i = 0; i < n; i++) { s[i * 3] = r(); s[i * 3 + 1] = r(); s[i * 3 + 2] = r(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(s, 3));
  const u = { uTime: { value: 0 }, uLevel: { value: 0 }, uSpread: { value: spread } };
  const m = new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false,
    vertexShader: `uniform float uTime; uniform float uLevel; uniform float uSpread; varying float vA;
      void main(){ vec3 s = position; float life = fract(s.y + uTime * 0.12);
        vec3 p = vec3((s.x - 0.5) * uSpread + sin(uTime * 0.6 + s.z * 9.0) * 0.15 * life, life * (0.6 + uSpread * 0.5), (s.z - 0.5) * uSpread + cos(uTime * 0.5 + s.x * 7.0) * 0.15 * life);
        vA = smoothstep(0.0, 0.15, life) * (1.0 - life) * uLevel * 0.3; vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (60.0 + life * 260.0) * (0.4 + uSpread * 0.3) / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.92), smoothstep(0.5, 0.05, d) * vA); }`,
  });
  const p = new THREE.Points(g, m); p.position.copy(at); p.frustumCulled = false; scene.add(p);
  const t0 = performance.now();
  p.onBeforeRender = () => { u.uTime.value = (performance.now() - t0) / 1000; };
  return { points: p, u };
}
