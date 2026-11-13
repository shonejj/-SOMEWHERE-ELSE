// The cabin: log walls, roof, porch, fireplace, living room, kitchen, bedroom.
import * as THREE from 'three';
import { Batch, boxGeo, rbox, mesh, mtx, worldUV, Hinged, Drawer } from './kit.js';
import { Fire, Lamp, mugGeo, makeBook, appleGeo, kettle, lanternModel, chair } from './props.js';
import { FLOOR as F } from '../core/layout.js';
import { mulberry32 } from '../core/noise.js';

const R = 0.16, ROW = 0.3, ROWS = 10, WALL_TOP = F + 3.0, RIDGE = F + 5.0;
const SLOPE = (RIDGE - WALL_TOP) / 3.5;
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

export function buildCabin(ctx) {
  const { scene, M, T, ix, col, phys, audio } = ctx;
  const root = new THREE.Group(); root.name = 'cabin'; scene.add(root);
  const B = new Batch();
  const rnd = mulberry32(31);
  const statics = [];
  const solid = (minX, minY, minZ, maxX, maxY, maxZ, opts) => { const b = col.addBox(minX, minY, minZ, maxX, maxY, maxZ, opts); if (b.phys) phys.addStaticBox(b); return b; };
  const addBox = (w, h, d, mat, x, y, z, tile = 1, rot = [0, 0, 0]) => B.add(boxGeo(w, h, d, tile), mat, mtx(x, y, z, ...rot));
  const updaters = ctx.updaters;
  const openables = []; // for indoor sound openness

  // ------------------------------------------------------------ log walls --
  const walls = [
    { axis: 'x', c: 3.5, from: -6, to: 6, inward: -1, open: [{ a: -5.0, b: -3.8, lo: 0.9, hi: 2.1 }, { a: -2.6, b: -1.6, lo: 0, hi: 2.15 }, { a: -0.6, b: 0.6, lo: 0.9, hi: 2.1 }, { a: 3.0, b: 4.2, lo: 0.9, hi: 2.1 }] },
    { axis: 'x', c: -3.5, from: -6, to: 6, inward: 1, open: [{ a: -1.2, b: 0.0, lo: 1.05, hi: 2.05 }, { a: 3.4, b: 4.6, lo: 1.15, hi: 2.1 }] },
    { axis: 'z', c: -6, from: -3.5, to: 3.5, inward: 1, open: [{ a: -0.95, b: 0.95, lo: -1, hi: 3.2 }] },
    { axis: 'z', c: 6, from: -3.5, to: 3.5, inward: -1, open: [{ a: -0.6, b: 0.6, lo: 0.9, hi: 2.1 }] },
  ];
  for (const w of walls) {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      const yc = 0.15 + i * ROW;
      let iv = [[w.from - 0.32, w.to + 0.32]];
      for (const o of w.open) {
        if (o.lo < yc + R * 0.6 && o.hi > yc - R * 0.6) {
          const n = [];
          for (const [s, e] of iv) { if (o.b <= s || o.a >= e) n.push([s, e]); else { if (o.a > s) n.push([s, o.a]); if (o.b < e) n.push([o.b, e]); } }
          iv = n;
        }
      }
      rows.push(iv);
      for (const [s, e] of iv) {
        const L = e - s; if (L < 0.05) continue;
        const rr = R * (0.94 + rnd() * 0.1);
        const g = new THREE.CylinderGeometry(rr, rr, L, 14, 1);
        const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setY(k, uv.getY(k) * L / 2.2 + rnd());
        const mid = (s + e) / 2, y = F + yc;
        if (w.axis === 'x') B.add(g, M.logs, mtx(mid, y, w.c, 0, 0, Math.PI / 2));
        else B.add(g, M.logs, mtx(w.c, y, mid, Math.PI / 2, 0, 0));
      }
    }
    // chinking between rows
    for (let i = 0; i < ROWS - 1; i++) {
      for (const [s0, e0] of rows[i]) for (const [s1, e1] of rows[i + 1]) {
        const s = Math.max(s0, s1, w.from + 0.1), e = Math.min(e0, e1, w.to - 0.1);
        if (e - s < 0.05) continue;
        const y = F + 0.15 + i * ROW + ROW / 2;
        if (w.axis === 'x') addBox(e - s, ROW, 0.2, M.chink, (s + e) / 2, y, w.c);
        else addBox(0.2, ROW, e - s, M.chink, w.c, y, (s + e) / 2);
      }
    }
    // colliders: full-height between openings, plus below/above each opening
    const T2 = 0.17, lo = 0, hi = WALL_TOP + 0.2;
    const edges = [w.from - 0.32, ...w.open.flatMap((o) => [o.a, o.b]), w.to + 0.32].sort((a, b) => a - b);
    const box = (a, b, y0, y1) => {
      if (b - a < 0.01 || y1 - y0 < 0.01) return;
      if (w.axis === 'x') solid(a, y0, w.c - T2, b, y1, w.c + T2, { tag: 'wood', walk: false });
      else solid(w.c - T2, y0, a, w.c + T2, y1, b, { tag: 'wood', walk: false });
    };
    for (let k = 0; k < edges.length - 1; k++) {
      const a = edges[k], b = edges[k + 1], m = (a + b) / 2;
      const o = w.open.find((oo) => m > oo.a && m < oo.b);
      if (!o) box(a, b, lo, hi);
      else { if (o.lo > 0) box(a, b, lo, F + o.lo); box(a, b, F + o.hi, hi); }
    }
  }

  // ------------------------------------------------- foundation + floor --
  addBox(12.5, F + 0.3, 7.5, M.stone, 0, (F - 0.3) / 2 - 0.15 + 0.0, 0, 1.4);
  addBox(11.7, 0.06, 6.7, M.floor, 0, F - 0.03, 0, 2.2);
  solid(-6.2, -2, -3.7, 6.2, F, 3.7, { tag: 'wood' });

  // ----------------------------------------------------------- roof --
  const theta = Math.atan(SLOPE);
  const run = 4.1, drop = run * SLOPE, w = Math.hypot(run, drop), th = 0.16;
  for (const s of [1, -1]) {
    const geo = new THREE.BoxGeometry(13.4, th, w);
    worldUV(geo, 2.4);
    const cz = s * run / 2, cy = RIDGE - drop / 2 + 0.17;
    const n = v3(0, Math.cos(theta), s * Math.sin(theta));
    const m = mtx(0, cy + n.y * th / 2, cz + n.z * th / 2, s * theta, 0, 0);
    // top (shingles) + underside (boards) as two separate faces
    const top = new THREE.PlaneGeometry(13.4, w); top.rotateX(-Math.PI / 2); worldUV(top, 2.2); top.translate(0, th / 2 + 0.001, 0);
    const bot = new THREE.PlaneGeometry(13.4, w); bot.rotateX(Math.PI / 2); worldUV(bot, 1.6); bot.translate(0, -th / 2 - 0.001, 0);
    B.add(top, M.shingles, m); B.add(bot, M.ceiling, m);
    const edgeG = new THREE.BoxGeometry(13.4, th, w - 0.02); B.add(edgeG, M.trim, m);
  }
  addBox(13.5, 0.14, 0.32, M.trim, 0, RIDGE + 0.3, 0, 1); // ridge cap
  // gables
  for (const s of [-1, 1]) {
    const sh = new THREE.Shape([new THREE.Vector2(-3.66, 0), new THREE.Vector2(3.66, 0), new THREE.Vector2(0, (RIDGE - WALL_TOP) + 0.18)]);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.14, bevelEnabled: false });
    g.rotateY(Math.PI / 2);
    worldUV(g, 1.4);
    B.add(g, M.boards, mtx(s * 6.0 - 0.07, WALL_TOP + 0.01, 0));
  }
  // interior beams
  for (const x of [-4.2, -2.0, 3.8]) {
    const g = new THREE.CylinderGeometry(0.12, 0.12, 7.0, 12); B.add(g, M.logs, mtx(x, F + 2.88, 0, Math.PI / 2, 0, 0));
  }
  { const g = new THREE.CylinderGeometry(0.14, 0.14, 12.4, 12); B.add(g, M.logs, mtx(0, RIDGE - 0.08, 0, 0, 0, Math.PI / 2)); }
  // ceiling collider (keeps jumps and thrown items inside)
  for (const s of [1, -1]) for (let i = 0; i < 4; i++) {
    const z0 = s > 0 ? i * 0.9 : -(i + 1) * 0.9, z1 = z0 + 0.9;
    const zEdge = s > 0 ? z1 : z0;
    const y = RIDGE - Math.abs(zEdge) * SLOPE + 0.05;
    solid(-6.1, y, z0, 6.1, y + 0.3, z1, { walk: false });
  }

  // ------------------------------------------------------ partition wall --
  {
    const P = [[-3.34, 0], [1.6, 0], [1.6, 2.1], [2.5, 2.1], [2.5, 0], [3.34, 0], [3.34, 3.08], [0, 4.98], [-3.34, 3.08]];
    const sh = new THREE.Shape(P.map(([a, b]) => new THREE.Vector2(a, b)));
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false });
    worldUV(g, 1.6);
    g.rotateY(-Math.PI / 2);
    B.add(g, M.boards, mtx(1.44, F, 0));
    solid(1.44, F, -3.4, 1.56, RIDGE, 1.6, { walk: false });
    solid(1.44, F, 2.5, 1.56, RIDGE, 3.4, { walk: false });
    solid(1.44, F + 2.1, 1.6, 1.56, RIDGE, 2.5, { walk: false });
    // door casing
    addBox(0.16, 0.1, 1.04, M.trim, 1.5, F + 2.15, 2.05);
    addBox(0.16, 2.1, 0.07, M.trim, 1.5, F + 1.05, 1.565); addBox(0.16, 2.1, 0.07, M.trim, 1.5, F + 1.05, 2.535);
  }

  // ------------------------------------------------------------ fireplace --
  const fx = -5.85;
  addBox(0.75, 1.5, 0.6, M.stone, fx + 0.375, F + 0.75 + 0.12, -0.9, 1.2);
  addBox(0.75, 1.5, 0.6, M.stone, fx + 0.375, F + 0.75 + 0.12, 0.9, 1.2);
  addBox(0.75, 0.5, 1.2, M.stone, fx + 0.375, F + 1.37, 0, 1.2);
  addBox(0.12, 1.0, 1.2, M.soot, fx - 0.02, F + 0.62, 0);
  addBox(0.6, 0.02, 1.2, M.soot, fx + 0.3, F + 0.13, 0);
  addBox(1.3, 0.12, 2.9, M.stone, fx + 0.55, F + 0.06, 0, 1.0); // hearth
  addBox(0.95, 0.12, 2.7, M.darkWood, fx + 0.45, F + 1.68, 0, 1.5); // mantel
  addBox(0.5, 3.4, 1.8, M.stone, fx + 0.25, F + 1.74 + 1.7, 0, 1.2); // chimney breast
  addBox(0.95, 7.2, 2.0, M.stone, -6.65, 3.5, 0, 1.2); // exterior stack
  addBox(1.05, 0.12, 2.1, M.stone, -6.65, 7.12, 0, 1.2);
  solid(fx, F, -1.45, fx + 1.25, F + 0.12, 1.45, { tag: 'stone' });
  solid(fx, F + 0.12, -1.2, fx + 0.75, F + 1.74, 1.2, { walk: false });
  solid(fx, F + 1.62, -1.35, fx + 0.95, F + 1.74, 1.35, { walk: false });
  solid(-7.12, 0, -1.0, -6.16, 7.2, 1.0, { walk: false });
  const fire = new Fire(ctx, root, v3(fx + 0.33, F + 0.13, 0), { scale: 1, intensity: 14, lightOffset: v3(0.45, 0.45, 0), smokeAt: v3(-6.65, 7.2, 0), startOn: true });
  updaters.push((dt, t) => fire.update(dt, t));
  const fireHit = mesh(new THREE.BoxGeometry(0.7, 0.9, 1.2), new THREE.MeshBasicMaterial({ visible: false }), fx + 0.38, F + 0.6, 0, root);
  ix.register(fireHit, { label: () => (fire.on ? 'Let the fire die down' : 'Light the fire'), use: () => fire.toggle() });
  // mantel decor
  for (let i = 0; i < 5; i++) { const b = makeBook(new THREE.MeshStandardMaterial({ color: [0x5b1f1a, 0x1f3a4a, 0x3c4a22, 0x6b4a1e, 0x2a2a2a][i], roughness: 0.7 })); b.position.set(fx + 0.3, F + 1.74 + 0.11, 0.7 + i * 0.045); b.rotation.y = Math.PI / 2; root.add(b); }
  const candleMat = new THREE.MeshStandardMaterial({ color: 0xf2ead8, roughness: 0.6 });
  for (const z of [-0.9, -0.6]) mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18 - z * 0.1, 10), candleMat, fx + 0.35, F + 1.74 + 0.1, z, root);

  // log basket
  {
    const g = new THREE.Group(); g.position.set(-5.0, F, -2.2); root.add(g);
    mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.35, 16, 1, true), M.wool, 0, 0.18, 0, g).material = new THREE.MeshStandardMaterial({ color: 0x6b5236, roughness: 1, side: THREE.DoubleSide });
    mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.02, 16), M.trim, 0, 0.01, 0, g);
    const basketLogMat = new THREE.MeshStandardMaterial({ map: T.bark.map, normalMap: T.bark.normalMap, roughness: 1 });
    for (let i = 0; i < 6; i++) { const l = mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.5, 7), basketLogMat, (i % 3 - 1) * 0.12, 0.1 + Math.floor(i / 3) * 0.1, 0, g); l.rotation.z = Math.PI / 2; l.rotation.y = 0.3 * (i - 2); }
    solid(-5.33, F, -2.53, -4.67, F + 0.4, -1.87, { walk: false });
    const loose = mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.42, 8), new THREE.MeshStandardMaterial({ map: T.bark.map, normalMap: T.bark.normalMap, roughness: 1 }), -4.55, F + 0.06, -1.7, root);
    loose.rotation.z = Math.PI / 2; loose.rotation.y = 0.5;
    ix.item(loose, 'firewood', { mass: 1.4, shape: 'box', sound: 'wood' });
  }

  // ------------------------------------------------------------- doors --
  const makeDoor = (hx, hz, dirX, dirZ, inX, inZ, width, height, label, matPanel = M.trim) => {
    const base = Math.atan2(-dirZ, dirX);
    const sign = Math.sign(dirZ * inX - dirX * inZ) || 1;
    const g = new THREE.Group(); g.position.set(hx, F, hz); g.rotation.y = base; root.add(g);
    const panel = new THREE.Group(); g.add(panel);
    const thick = 0.055;
    const pg = boxGeo(width - 0.02, height - 0.02, thick, 1.2);
    mesh(pg, matPanel, width / 2, height / 2, 0, panel);
    // battens & hardware
    for (const y of [0.35, height - 0.35]) mesh(boxGeo(width - 0.12, 0.12, 0.03, 1.2), matPanel, width / 2, y, 0.04, panel);
    mesh(boxGeo(width - 0.12, 0.12, 0.03, 1.2), matPanel, width / 2, y0(height), -0.04, panel);
    for (const y of [0.35, height - 0.35]) { mesh(boxGeo(0.35, 0.04, 0.012), M.iron, 0.2, y, 0.06, panel); mesh(boxGeo(0.35, 0.04, 0.012), M.iron, 0.2, y, -0.06, panel); }
    for (const s of [1, -1]) { const h = mesh(new THREE.TorusGeometry(0.045, 0.008, 6, 12, Math.PI), M.iron, width - 0.12, 1.0, s * 0.06, panel); h.rotation.z = Math.PI / 2; }
    const closedBox = col.addBox(0, 0, 0, 0, 0, 0, { walk: false });
    const hinge = new Hinged(g, 'y', sign * 1.75, ctx, { collider: closedBox, label, sound: 'door', speed: 3.6 });
    hinge.panel = panel;
    hinge.update(0); hinge.s.vel = 1; hinge.update(0.0001); hinge.s.vel = 0;
    panel.traverse((o) => { if (o.isMesh) o.userData.door = hinge; });
    ix.register(panel, { label: () => (hinge.open ? 'Close ' : 'Open ') + label, use: () => hinge.toggle() });
    updaters.push((dt) => hinge.update(dt));
    ix.occluder(panel);
    return hinge;
  };
  function y0(h) { return h / 2; }
  // front door frame
  addBox(1.12, 0.12, 0.36, M.trim, -2.1, F + 2.21, 3.5);
  addBox(0.08, 2.2, 0.36, M.trim, -2.64, F + 1.1, 3.5); addBox(0.08, 2.2, 0.36, M.trim, -1.56, F + 1.1, 3.5);
  addBox(1.12, 0.05, 0.4, M.oak, -2.1, F + 0.02, 3.5);
  const frontDoor = makeDoor(-2.6, 3.5, 1, 0, 0, -1, 1.0, 2.14, 'door');
  const bedDoor = makeDoor(1.5, 1.6, 0, 1, 1, 0, 0.9, 2.08, 'bedroom door', M.oak);
  openables.push({ h: frontDoor, w: 1 });

  // ----------------------------------------------------------- windows --
  const glassMat = M.glass;
  const makeWindow = (wall, a0, a1, lo, hi, curtains) => {
    const c = wall.c, inward = wall.inward;
    const along = wall.axis === 'x' ? v3(1, 0, 0) : v3(0, 0, 1);
    const inn = wall.axis === 'x' ? v3(0, 0, inward) : v3(inward, 0, 0);
    const P = (a, y, d = 0) => (wall.axis === 'x' ? v3(a, y, c + d) : v3(c + d, y, a));
    const width = a1 - a0, height = hi - lo, depth = 0.36;
    const fb = (a, y, la, h) => { const g = wall.axis === 'x' ? boxGeo(la, h, depth, 1) : boxGeo(depth, h, la, 1); const p = P(a, y); B.add(g, M.trim, mtx(p.x, p.y, p.z)); };
    fb((a0 + a1) / 2, F + lo - 0.03, width + 0.16, 0.07);
    fb((a0 + a1) / 2, F + hi + 0.03, width + 0.16, 0.07);
    fb(a0 - 0.03, F + (lo + hi) / 2, 0.07, height);
    fb(a1 + 0.03, F + (lo + hi) / 2, 0.07, height);
    // sill inside
    { const g = wall.axis === 'x' ? boxGeo(width + 0.24, 0.04, 0.2, 1) : boxGeo(0.2, 0.04, width + 0.24, 1); const p = P((a0 + a1) / 2, F + lo + 0.0, inward * 0.24); B.add(g, M.oak, mtx(p.x, p.y, p.z)); }
    const sashes = [];
    const half = width / 2;
    for (const side of [0, 1]) {
      const hingeA = side === 0 ? a0 : a1;
      const d = side === 0 ? along.clone() : along.clone().negate();
      const base = Math.atan2(-d.z, d.x);
      const sign = Math.sign(d.z * inn.x - d.x * inn.z) || 1;
      const hp = P(hingeA, F + lo, inward * 0.12);
      const g = new THREE.Group(); g.position.copy(hp); g.rotation.y = base; root.add(g);
      const sw = half - 0.005, sh = height - 0.01, bar = 0.05;
      const sash = new THREE.Group(); g.add(sash);
      const fr = (x, y, w2, h2) => mesh(boxGeo(w2, h2, 0.05), M.trim, x, y, 0, sash);
      fr(sw / 2, bar / 2, sw, bar); fr(sw / 2, sh - bar / 2, sw, bar); fr(bar / 2, sh / 2, bar, sh); fr(sw - bar / 2, sh / 2, bar, sh);
      fr(sw / 2, sh / 2, sw, 0.03); fr(sw / 2, sh * 0.25, sw, 0.025); fr(sw / 2, sh * 0.75, sw, 0.025);
      const glass = mesh(new THREE.PlaneGeometry(sw - bar, sh - bar), glassMat, sw / 2, sh / 2, 0, sash, { cast: false });
      glass.receiveShadow = false;
      const hn = new Hinged(g, 'y', sign * 1.45, ctx, { sound: side === 0 ? 'window' : 'none', speed: 4 });
      sashes.push(hn);
      updaters.push((dt) => hn.update(dt));
      ix.occluder(sash);
    }
    const obj = { open: false };
    const toggle = () => { obj.open = !obj.open; sashes.forEach((s) => { if (s.open !== obj.open) s.toggle(); }); };
    for (const s of sashes) ix.register(s.g, { label: () => (obj.open ? 'Close window' : 'Open window'), use: toggle });
    openables.push({ h: obj, w: 0.5, isWin: true, pos: P((a0 + a1) / 2, F + lo + 0.5, 0) });
    if (curtains) {
      for (const side of [-1, 1]) {
        const cm = M.linen.clone(); cm.side = THREE.DoubleSide; cm.color = new THREE.Color(0xd8c8a8);
        const u = { uSway: { value: 0 }, uT: { value: 0 } };
        cm.onBeforeCompile = (sh2) => { sh2.uniforms.uSway = u.uSway; sh2.uniforms.uT = u.uT; sh2.vertexShader = 'uniform float uSway; uniform float uT;\n' + sh2.vertexShader.replace('#include <begin_vertex>', `vec3 transformed = position; float k = (1.15 - uv.y); transformed.z += (sin(uT * 2.3 + position.x * 3.0 + position.y * 2.0) * uSway * k * 0.18) ; transformed.x += sin(uT * 1.7 + position.y) * uSway * k * 0.05;`); };
        cm.customProgramCacheKey = () => 'curtain';
        const pg = new THREE.PlaneGeometry(0.42, height + 0.45, 16, 8);
        { const pa = pg.attributes.position; for (let k = 0; k < pa.count; k++) pa.setZ(k, Math.sin(pa.getX(k) * 38) * 0.025); pg.computeVertexNormals(); }
        const cmesh = new THREE.Mesh(pg, cm);
        const p = P(side < 0 ? a0 - 0.12 : a1 + 0.12, F + (lo + hi) / 2 + 0.12, inward * 0.24);
        cmesh.position.copy(p);
        if (wall.axis === 'z') cmesh.rotation.y = Math.PI / 2;
        cmesh.castShadow = true; root.add(cmesh);
        updaters.push((dt, t) => { u.uT.value = t; u.uSway.value += ((obj.open ? 0.4 + ctx.weather.w.gust * 1.4 : 0.05) - u.uSway.value) * Math.min(1, dt); });
      }
      const rodG = wall.axis === 'x' ? new THREE.CylinderGeometry(0.012, 0.012, width + 0.7, 8).rotateZ(Math.PI / 2) : new THREE.CylinderGeometry(0.012, 0.012, width + 0.7, 8).rotateX(Math.PI / 2);
      const rp = P((a0 + a1) / 2, F + hi + 0.42, inward * 0.24); B.add(rodG, M.iron, mtx(rp.x, rp.y, rp.z));
    }
    return obj;
  };
  makeWindow(walls[0], -5.0, -3.8, 0.9, 2.1, true);
  makeWindow(walls[0], -0.6, 0.6, 0.9, 2.1, true);
  makeWindow(walls[0], 3.0, 4.2, 0.9, 2.1, true);
  makeWindow(walls[1], -1.2, 0.0, 1.05, 2.05, false);
  makeWindow(walls[1], 3.4, 4.6, 1.15, 2.1, true);
  makeWindow(walls[3], -0.6, 0.6, 0.9, 2.1, true);

  // ---------------------------------------------------------- lighting --
  const lamps = [];
  const switchPlate = (x, z, label, lamp) => {
    const g = new THREE.Group(); g.position.set(x, F + 1.25, z); root.add(g);
    mesh(rbox(0.08, 0.12, 0.012, 0.004, 1), M.brass, 0, 0, 0, g);
    const lever = mesh(boxGeo(0.012, 0.035, 0.02), M.ceramic, 0, 0, 0.012, g);
    const set = () => { lever.rotation.x = lamp.on ? -0.5 : 0.5; };
    set();
    ix.register(g, { label: () => (lamp.on ? 'Switch off ' : 'Switch on ') + label, use: () => { lamp.toggle(g.getWorldPosition(v3())); set(); } });
  };
  // pendant
  {
    const g = new THREE.Group(); g.position.set(-2.0, F + 2.76, 0); root.add(g);
    mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.5, 4), M.black, 0, -0.25, 0, g);
    const shadeMat = new THREE.MeshStandardMaterial({ color: 0x2b3a2e, roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide, emissive: 0xffa050, emissiveIntensity: 0 });
    const sh = mesh(new THREE.CylinderGeometry(0.08, 0.28, 0.22, 24, 1, true), shadeMat, 0, -0.6, 0, g, { cast: false });
    const bm = M.bulb.clone();
    mesh(new THREE.SphereGeometry(0.05, 12, 8), bm, 0, -0.66, 0, g, { cast: false });
    const L = new THREE.PointLight(0xffc68a, 0, 12, 1.5); L.position.set(0, -0.72, 0); g.add(L);
    const lamp = new Lamp(ctx, L, [[bm, 6], [shadeMat, 0.05]], { intensity: 9 }); lamps.push(lamp);
    switchPlate(-2.85, 3.33, 'ceiling light', lamp);
  }
  // floor lamp beside the sofa
  {
    const g = new THREE.Group(); g.position.set(-2.15, F, -1.5); root.add(g);
    mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 20), M.iron, 0, 0.015, 0, g);
    mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.45, 8), M.brass, 0, 0.74, 0, g);
    const sm = M.shade.clone();
    mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.28, 24, 1, true), sm, 0, 1.5, 0, g, { cast: false });
    const bm = M.bulb.clone();
    mesh(new THREE.SphereGeometry(0.04, 10, 8), bm, 0, 1.47, 0, g, { cast: false });
    const L = new THREE.PointLight(0xffb978, 0, 8, 1.6); L.position.set(0, 1.42, 0); g.add(L);
    const lamp = new Lamp(ctx, L, [[bm, 5], [sm, 1.4]], { intensity: 5, on: true }); lamps.push(lamp);
    const chain = mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.18, 4), M.brass, 0.08, 1.3, 0, g);
    ix.register(g, { label: () => (lamp.on ? 'Switch off lamp' : 'Switch on lamp'), use: () => { lamp.toggle(); chain.position.y = 1.27; setTimeout(() => (chain.position.y = 1.3), 150); } });
    solid(-2.33, F, -1.68, -1.97, F + 1.7, -1.32, { walk: false });
  }
  // porch light
  {
    const g = new THREE.Group(); g.position.set(-3.1, F + 2.05, 3.74); root.add(g);
    mesh(boxGeo(0.12, 0.2, 0.06), M.iron, 0, 0, -0.03, g);
    const lm = lanternModel(M, ctx); lm.position.set(0, -0.2, 0.12); g.add(lm);
    lm.remove(lm.userData.light);
    const fmat = lm.userData.flame.material; fmat.emissiveIntensity = 0;
    const L = new THREE.PointLight(0xffb060, 0, 10, 1.6); L.position.set(0, -0.08, 0.15); g.add(L);
    const lamp = new Lamp(ctx, L, [[fmat, 4]], { intensity: 6 }); lamps.push(lamp);
    switchPlate(-3.05, 3.33, 'porch light', lamp);
    ctx.autoPorch = lamp;
  }
  updaters.push((dt) => lamps.forEach((l) => l.update(dt)));

  // ---------------------------------------------------- living room --
  // rug
  { const g = new THREE.PlaneGeometry(3.2, 2.3); g.rotateX(-Math.PI / 2); mesh(g, M.rug, -3.45, F + 0.006, 0, root, { cast: false }); }
  // sofa (faces -x toward the fireplace)
  {
    const g = new THREE.Group(); g.position.set(-2.2, F, 0); g.rotation.y = Math.PI / 2; root.add(g);
    mesh(rbox(2.1, 0.26, 0.9, 0.05), M.sofa, 0, 0.24, 0, g);
    for (const x of [-0.66, 0, 0.66]) mesh(rbox(0.64, 0.16, 0.7, 0.07, 4), M.sofa, x, 0.44, -0.08, g);
    for (const x of [-0.66, 0, 0.66]) { const b = mesh(rbox(0.64, 0.5, 0.2, 0.08, 4), M.sofa, x, 0.68, 0.32, g); b.rotation.x = -0.12; }
    for (const x of [-1.0, 1.0]) mesh(rbox(0.16, 0.62, 0.92, 0.07, 4), M.sofa, x, 0.42, 0, g);
    for (const [x, z] of [[-0.95, -0.38], [0.95, -0.38], [-0.95, 0.38], [0.95, 0.38]]) mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.11, 8), M.darkWood, x, 0.055, z, g);
    // throw blanket over the arm
    const bl = mesh(rbox(0.5, 0.03, 0.95, 0.012), M.wool, 0.98, 0.72, 0, g); bl.rotation.z = 0.1;
    const bl2 = mesh(rbox(0.04, 0.4, 0.95, 0.012), M.wool, 1.08, 0.53, 0, g);
    solid(-2.65, F, -1.08, -1.75, F + 0.5, 1.08, { walk: false });
    solid(-1.95, F, -1.08, -1.75, F + 0.95, 1.08, { walk: false });
    for (const z of [-0.55, 0.55]) {
      const seat = { eye: v3(-2.28, F + 1.12, z), yaw: Math.PI / 2, exit: v3(-3.05, F, z) };
      const hit = mesh(new THREE.BoxGeometry(0.7, 0.2, 0.9), new THREE.MeshBasicMaterial({ visible: false }), z * 1.2, 0.48, -0.05, g);
      hit.position.x = -z; // local x maps to world -z after rotation
      ix.register(hit, { label: 'Sit on the sofa', use: () => ctx.player.sit(seat) });
    }
    // cushion you can pick up
    const cushion = mesh(rbox(0.42, 0.42, 0.13, 0.06, 4), M.wool, -2.05, F + 0.72, 0.75, root);
    cushion.rotation.set(0, Math.PI / 2 + 0.2, 0.15);
    ix.item(cushion, 'cushion', { mass: 0.4, sound: 'soft' });
  }
  // armchair
  {
    const yaw = 0.62;
    const g = new THREE.Group(); g.position.set(-4.35, F, 2.3); g.rotation.y = yaw; root.add(g);
    mesh(rbox(0.85, 0.3, 0.8, 0.06), M.wool, 0, 0.27, 0, g);
    mesh(rbox(0.62, 0.14, 0.62, 0.06, 4), M.wool, 0, 0.47, -0.05, g);
    const bk = mesh(rbox(0.85, 0.72, 0.18, 0.07, 4), M.wool, 0, 0.75, 0.33, g); bk.rotation.x = -0.1;
    for (const x of [-0.38, 0.38]) mesh(rbox(0.14, 0.55, 0.8, 0.06, 4), M.wool, x, 0.45, 0, g);
    const seat = { eye: v3(-4.35 + Math.sin(yaw) * -0.02, F + 1.12, 2.3 + Math.cos(yaw) * 0.02), yaw, exit: v3(-4.35 - Math.sin(yaw) * 0.85, F, 2.3 - Math.cos(yaw) * 0.85) };
    ix.register(g, { label: 'Sit in the armchair', use: () => ctx.player.sit(seat) });
    solid(-4.85, F, 1.8, -3.85, F + 0.55, 2.8, { walk: false });
  }
  // coffee table
  {
    const g = new THREE.Group(); g.position.set(-3.4, F, 0); root.add(g);
    mesh(rbox(0.62, 0.06, 1.15, 0.015), M.darkWood, 0, 0.42, 0, g);
    mesh(boxGeo(0.5, 0.03, 1.0), M.darkWood, 0, 0.12, 0, g);
    for (const [x, z] of [[-0.26, -0.52], [0.26, -0.52], [-0.26, 0.52], [0.26, 0.52]]) mesh(boxGeo(0.05, 0.4, 0.05), M.darkWood, x, 0.2, z, g);
    solid(-3.71, F, -0.58, -3.09, F + 0.45, 0.58, { walk: false });
    const mug = mesh(mugGeo(), M.ceramicBlue, -3.3, F + 0.45, 0.25, root);
    ix.item(mug, 'mug', { mass: 0.3, shape: 'cylinder', sound: 'ceramic' });
    const book = makeBook(new THREE.MeshStandardMaterial({ color: 0x6b2a1e, roughness: 0.6 }));
    book.position.set(-3.45, F + 0.47, -0.25); book.rotation.set(-Math.PI / 2, 0, 0.4); root.add(book);
    ix.item(book, 'book', { mass: 0.5, sound: 'soft' });
    // chess-like wooden puzzle box decor
    mesh(rbox(0.18, 0.06, 0.18, 0.01), M.oak, -3.5, F + 0.48, 0.0, root);
  }
  // bookshelf
  {
    const g = new THREE.Group(); g.position.set(-4.5, F, -3.17); root.add(g);
    for (const x of [-0.8, 0.8]) mesh(boxGeo(0.04, 2.0, 0.32), M.darkWood, x, 1.0, 0, g);
    for (let i = 0; i < 6; i++) mesh(boxGeo(1.6, 0.03, 0.32), M.darkWood, 0, 0.05 + i * 0.38, 0, g);
    mesh(boxGeo(1.64, 2.0, 0.02), M.darkWood, 0, 1.0, -0.15, g);
    const bookG = new THREE.BoxGeometry(1, 1, 1);
    const cols = [0x5b1f1a, 0x1f3a4a, 0x3c4a22, 0x6b4a1e, 0x2a2a2a, 0x7a6a4a, 0x4a2a4a, 0x8a3a1a, 0x23412f];
    const im = new THREE.InstancedMesh(bookG, new THREE.MeshStandardMaterial({ roughness: 0.75 }), 140);
    let k = 0; const c = new THREE.Color(), mm = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    for (let shelf = 0; shelf < 5; shelf++) {
      let x = -0.76;
      while (x < 0.72 && k < 140) {
        const w = 0.025 + rnd() * 0.035, h = 0.2 + rnd() * 0.12, d = 0.16 + rnd() * 0.08;
        if (rnd() < 0.08) { x += 0.12; continue; }
        const lean = rnd() < 0.06 ? 0.25 : 0;
        q.setFromEuler(new THREE.Euler(0, 0, lean));
        mm.compose(v3(x + w / 2, 0.065 + shelf * 0.38 + h / 2, 0.02), q, s.set(w, h, d));
        im.setMatrixAt(k, mm); im.setColorAt(k, c.setHex(cols[Math.floor(rnd() * cols.length)]).multiplyScalar(0.8 + rnd() * 0.4));
        x += w + 0.002; k++;
      }
    }
    im.count = k; im.castShadow = true; im.receiveShadow = true; g.add(im);
    solid(-5.32, F, -3.35, -3.68, F + 2.0, -3.0, { walk: false });
    const bottle = mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.24, 12), new THREE.MeshPhysicalMaterial({ color: 0x2f5a3a, roughness: 0.1, transparent: true, opacity: 0.7 }), -4.0, F + 0.05 + 5 * 0.38 + 0.13, -3.1, root);
    ix.item(bottle, 'bottle', { mass: 0.4, shape: 'cylinder', sound: 'glass' });
    for (let i = 0; i < 2; i++) {
      const b = makeBook(new THREE.MeshStandardMaterial({ color: [0x1f3a4a, 0x3c4a22][i], roughness: 0.6 }), 0.14, 0.2, 0.04);
      b.position.set(-4.95 + i * 0.25, F + 0.05 + 0.38 * 2 + 0.03, -3.08); b.rotation.set(-Math.PI / 2, 0, 0.3 + i); root.add(b);
      ix.item(b, 'book', { mass: 0.45, sound: 'soft' });
    }
  }
  // kitchen counter
  {
    const z0 = -3.34, z1 = -2.74, x0 = -2.4, x1 = 0.9, h = 0.9;
    addBox(x1 - x0, h - 0.06, z1 - z0 - 0.04, M.boards, (x0 + x1) / 2, F + (h - 0.06) / 2, (z0 + z1) / 2 - 0.02, 1.2);
    // countertop with a sink cut-out (four pieces)
    const top = (a, b, c2, d) => addBox(b - a, 0.06, d - c2, M.oak, (a + b) / 2, F + h - 0.03, (c2 + d) / 2, 1.2);
    top(x0, -0.95, z0, z1 + 0.03); top(-0.25, x1, z0, z1 + 0.03); top(-0.95, -0.25, z0, -3.24); top(-0.95, -0.25, -2.84, z1 + 0.03);
    addBox(0.68, 0.18, 0.38, M.steel, -0.6, F + h - 0.12, -3.04, 1);
    addBox(0.62, 0.01, 0.32, M.soot, -0.6, F + h - 0.2, -3.04, 1);
    solid(x0, F, z0, x1, F + h, z1, { walk: false });
    // faucet
    const fg = new THREE.Group(); fg.position.set(-0.6, F + h, -3.27); root.add(fg);
    mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.25, 10), M.steel, 0, 0.125, 0, fg);
    const arc = mesh(new THREE.TorusGeometry(0.1, 0.014, 8, 16, Math.PI), M.steel, 0, 0.25, 0.1, fg); arc.rotation.y = Math.PI / 2;
    const knob = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 10), M.steel, 0.08, 0.06, 0, fg);
    const streamMat = new THREE.MeshPhysicalMaterial({ color: 0xcfe0e8, roughness: 0.05, transparent: true, opacity: 0.45, envMapIntensity: 1.5 });
    const stream = mesh(new THREE.CylinderGeometry(0.006, 0.008, 0.36, 8), streamMat, 0, 0.07, 0.2, fg, { cast: false });
    stream.visible = false;
    const wsnd = audio?.water(v3(-0.6, F + h, -3.07));
    let on = false;
    ix.register(fg, { label: () => (on ? 'Turn off the tap' : 'Turn on the tap'), use: () => { on = !on; stream.visible = on; knob.rotation.y = on ? 1.2 : 0; wsnd?.set(on); audio?.creak(fg.position, 0.03, 0.2, 400); } });
    updaters.push((dt, t) => { if (on) { stream.scale.x = stream.scale.z = 1 + Math.sin(t * 40) * 0.1; } });
    // drawers
    for (const dx of [-1.95, 0.42]) {
      const g = new THREE.Group(); g.position.set(dx, F + 0.72, z1 - 0.25); root.add(g);
      mesh(boxGeo(0.72, 0.16, 0.03), M.trim, 0, 0, 0.26, g);
      mesh(boxGeo(0.66, 0.12, 0.48), M.boards, 0, -0.01, 0.0, g).material = M.oak;
      const pull = mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.14, 6), M.iron, 0, 0, 0.29, g); pull.rotation.z = Math.PI / 2;
      for (let i = 0; i < 4; i++) { const s = mesh(boxGeo(0.02, 0.005, 0.2), M.steel, -0.2 + i * 0.05, 0.05, 0, g, { cast: false }); s.rotation.y = 0.1 * i; }
      const dr = new Drawer(g, v3(0, 0, 1), 0.34, ctx);
      ix.register(g, { label: () => (dr.open ? 'Close drawer' : 'Open drawer'), use: () => dr.toggle() });
      updaters.push((dt) => dr.update(dt));
      for (const yy of [-0.36, -0.62]) addBox(0.72, 0.24, 0.03, M.trim, dx, F + 0.72 + yy, z1 + 0.015);
    }
    // sink cabinet doors
    const cabDoor = (hx, dirX, sign) => {
      const g = new THREE.Group(); g.position.set(hx, F + 0.08, z1 + 0.02); root.add(g);
      g.rotation.y = dirX > 0 ? 0 : Math.PI;
      const p = new THREE.Group(); g.add(p);
      mesh(boxGeo(0.68, 0.7, 0.03), M.trim, 0.35, 0.35, 0, p);
      const k2 = mesh(new THREE.SphereGeometry(0.018, 8, 6), M.iron, 0.62, 0.6, 0.03, p);
      const hn = new Hinged(g, 'y', sign * 1.6, ctx, { sound: 'cabinet', speed: 6 });
      ix.register(p, { label: () => (hn.open ? 'Close cupboard' : 'Open cupboard'), use: () => hn.toggle() });
      updaters.push((dt) => hn.update(dt));
    };
    cabDoor(-1.48, 1, -1); cabDoor(0.06, -1, 1);
    mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.3, 14), new THREE.MeshStandardMaterial({ color: 0x5a6a52, roughness: 0.6 }), -1.1, F + 0.25, -3.0, root);
    // open shelf + crockery
    addBox(1.2, 0.04, 0.26, M.oak, -1.85, F + 1.62, -3.21, 1);
    for (let i = 0; i < 4; i++) { const p = mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.02, 20), M.ceramic, -2.3 + i * 0.035, F + 1.75, -3.25, root); p.rotation.z = Math.PI / 2 - 0.12; }
    for (let i = 0; i < 3; i++) mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.15, 14), new THREE.MeshPhysicalMaterial({ color: 0xc0d0c8, roughness: 0.08, transparent: true, opacity: 0.5 }), -1.8 + i * 0.16, F + 1.715, -3.2, root);
    // objects on the counter
    const k = kettle(M); k.position.set(-1.9, F + h, -3.0); root.add(k);
    ix.item(k, 'kettle', { mass: 1.0, sound: 'metal' });
    const board = mesh(rbox(0.4, 0.025, 0.28, 0.01), M.oak, 0.45, F + h + 0.012, -3.0, root);
    ix.item(board, 'cutting board', { mass: 0.6, sound: 'wood' });
    for (let i = 0; i < 2; i++) {
      const m = mesh(mugGeo(), i ? M.ceramic : M.ceramicBlue, -2.2 + i * 0.14, F + h, -2.9, root); m.rotation.y = rnd() * 6;
      ix.item(m, 'mug', { mass: 0.3, shape: 'cylinder', sound: 'ceramic' });
    }
  }
  // dining table + chairs + apples + candle
  {
    const g = new THREE.Group(); g.position.set(0, F, 2.35); root.add(g);
    mesh(rbox(1.25, 0.05, 0.8, 0.01), M.oak, 0, 0.75, 0, g);
    for (const [x, z] of [[-0.55, -0.33], [0.55, -0.33], [-0.55, 0.33], [0.55, 0.33]]) mesh(boxGeo(0.06, 0.73, 0.06), M.oak, x, 0.365, z, g);
    solid(-0.63, F, 1.95, 0.63, F + 0.78, 2.75, { walk: true, tag: 'wood' });
    for (const [x, yaw] of [[-0.85, -Math.PI / 2], [0.88, Math.PI / 2]]) {
      const c = chair(M, root, x, F, 2.35, yaw);
      solid(x - 0.22, F, 2.13, x + 0.22, F + 0.48, 2.57, { walk: false });
      const seat = { eye: v3(x, F + 1.12, 2.35), yaw: yaw + Math.PI, exit: v3(x + (x < 0 ? -0.45 : -0.45), F, 2.35 - 0.0) };
      seat.exit.set(x < 0 ? x - 0.1 : x - 0.15, F, 1.6);
      ix.register(c, { label: 'Sit down', use: () => ctx.player.sit(seat) });
    }
    const bowl = mesh(new THREE.SphereGeometry(0.13, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x7a5232, roughness: 0.6, side: THREE.DoubleSide }), 0.1, F + 0.9, 2.3, root);
    bowl.rotation.x = 0;
    solid(-0.03, F + 0.775, 2.17, 0.23, F + 0.8, 2.43, { walk: false });
    const apMats = [new THREE.MeshStandardMaterial({ color: 0x9a1e14, roughness: 0.35 }), new THREE.MeshStandardMaterial({ color: 0x7a9a2a, roughness: 0.4 })];
    for (let i = 0; i < 3; i++) {
      const a = mesh(appleGeo(), apMats[i % 2], 0.06 + (i - 1) * 0.07, F + 0.84 + (i === 1 ? 0.05 : 0), 2.3 + (i % 2) * 0.04, root);
      ix.item(a, 'apple', { mass: 0.2, shape: 'sphere', sound: 'soft' });
    }
    // candle you can light
    const cg = new THREE.Group(); cg.position.set(-0.3, F + 0.775, 2.4); root.add(cg);
    mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.02, 14), M.brass, 0, 0.01, 0, cg);
    mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 12), candleMat, 0, 0.1, 0, cg);
    const flameM = new THREE.MeshStandardMaterial({ color: 0xffd090, emissive: 0xff9a40, emissiveIntensity: 0, transparent: true, opacity: 0 });
    const fl = mesh(new THREE.SphereGeometry(0.01, 8, 6), flameM, 0, 0.2, 0, cg, { cast: false }); fl.scale.y = 2.4;
    let lit = false;
    ix.register(cg, { label: () => (lit ? 'Blow out the candle' : 'Light the candle'), use: () => { lit = !lit; if (lit) audio?.match(cg.position); else audio?.noiseHit(cg.position, { buf: audio.pink, type: 'bandpass', f: 500, a: 0.05, d: 0.3, v: 0.2 }); } });
    updaters.push((dt, t) => { const tg = lit ? 1 : 0; flameM.opacity += (tg - flameM.opacity) * Math.min(1, dt * 5); flameM.emissiveIntensity = flameM.opacity * (3 + Math.sin(t * 17) * 0.5); fl.scale.x = 1 + Math.sin(t * 11) * 0.12; fl.visible = flameM.opacity > 0.02; });
  }
  // sideboard with radio, clock above, guitar
  {
    const g = new THREE.Group(); g.position.set(1.2, F, -1.1); root.add(g);
    mesh(rbox(0.46, 0.85, 1.6, 0.01), M.darkWood, 0, 0.425, 0, g);
    solid(0.96, F, -1.9, 1.44, F + 0.86, -0.3, { walk: false });
    for (const dz of [-0.4, 0.4]) {
      const dg = new THREE.Group(); dg.position.set(1.2 - 0.0, F + 0.7, -1.1 + dz); root.add(dg);
      mesh(boxGeo(0.03, 0.18, 0.74), M.oak, -0.235, 0, 0, dg);
      const p = mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.14, 6), M.brass, -0.26, 0, 0, dg); p.rotation.x = Math.PI / 2;
      const inner = mesh(boxGeo(0.4, 0.12, 0.68), M.oak, -0.02, -0.02, 0, dg);
      if (dz < 0) { for (let i = 0; i < 3; i++) { const ph = mesh(boxGeo(0.12, 0.004, 0.09), M.paper, -0.05 + i * 0.03, 0.045 + i * 0.004, -0.1 + i * 0.08, dg, { cast: false }); ph.rotation.y = i * 0.3; } }
      else { mesh(new THREE.TorusGeometry(0.03, 0.01, 6, 14), M.brass, -0.05, 0.05, 0, dg).rotation.x = Math.PI / 2; }
      const dr = new Drawer(dg, v3(-1, 0, 0), 0.3, ctx);
      ix.register(dg, { label: () => (dr.open ? 'Close drawer' : 'Open drawer'), use: () => dr.toggle() });
      updaters.push((dt) => dr.update(dt));
    }
    // radio
    const rg = new THREE.Group(); rg.position.set(1.18, F + 0.85, -1.45); rg.rotation.y = -Math.PI / 2; root.add(rg);
    mesh(rbox(0.42, 0.26, 0.18, 0.03), new THREE.MeshStandardMaterial({ map: T.grain.map, color: 0xb07a50, roughness: 0.35 }), 0, 0.13, 0, rg);
    const gm = new THREE.MeshStandardMaterial({ map: T.grille, roughness: 0.9 });
    mesh(new THREE.PlaneGeometry(0.2, 0.16), gm, -0.08, 0.14, 0.091, rg, { cast: false });
    const dialM = new THREE.MeshStandardMaterial({ color: 0xe8d8b0, emissive: 0xffa040, emissiveIntensity: 0 });
    mesh(new THREE.PlaneGeometry(0.12, 0.05), dialM, 0.12, 0.17, 0.091, rg, { cast: false });
    const needle = mesh(boxGeo(0.003, 0.04, 0.002), M.black, 0.08, 0.17, 0.094, rg, { cast: false });
    for (const x of [0.08, 0.16]) { const kn = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12), M.brass, x, 0.07, 0.095, rg); kn.rotation.x = Math.PI / 2; }
    const radio = ctx.makeRadio(rg.getWorldPosition(v3()).add(v3(0, 0.15, 0)));
    ix.register(rg, {
      label: () => (!radio || !radio.on ? 'Turn on the radio' : radio.station === 0 ? 'Change station' : 'Turn off the radio'),
      use: () => { if (!radio) return; const st = radio.toggle(); dialM.emissiveIntensity = st ? 1.2 : 0; needle.position.x = radio.station === 1 ? 0.15 : 0.08; ctx.ui.toast(st ? '♪  ' + st : 'Radio off'); },
    });
    // clock
    const cl = new THREE.Group(); cl.position.set(1.42, F + 2.05, -1.1); cl.rotation.y = -Math.PI / 2; root.add(cl);
    mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32), M.darkWood, 0, 0, 0.0, cl).rotation.x = Math.PI / 2;
    mesh(new THREE.CircleGeometry(0.175, 32), new THREE.MeshStandardMaterial({ map: T.clock, roughness: 0.6 }), 0, 0, 0.027, cl, { cast: false });
    const hourH = new THREE.Group(), minH = new THREE.Group(); hourH.position.z = minH.position.z = 0.032; cl.add(hourH, minH);
    mesh(boxGeo(0.012, 0.09, 0.003), M.black, 0, 0.04, 0, hourH, { cast: false });
    mesh(boxGeo(0.008, 0.14, 0.003), M.black, 0, 0.065, 0.002, minH, { cast: false });
    audio?.clock(cl.getWorldPosition(v3()));
    updaters.push(() => { const h = ctx.clock.hour; hourH.rotation.z = -((h % 12) / 12) * Math.PI * 2; minH.rotation.z = -((h % 1)) * Math.PI * 2; });
    ix.register(cl, { label: () => { const h = ctx.clock.hour; const hh = Math.floor(h), mm = Math.floor((h % 1) * 60); return `It's ${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'am' : 'pm'}`; }, use: () => {} });
    // guitar on a stand
    const gg = new THREE.Group(); gg.position.set(1.15, F, 0.55); gg.rotation.y = -Math.PI / 2; root.add(gg);
    const gBody = new THREE.Shape(); gBody.absellipse(0, 0, 0.2, 0.24, 0, Math.PI * 2);
    const bodyM = new THREE.MeshStandardMaterial({ color: 0xd09a60, roughness: 0.3, map: T.grain.map });
    const b1 = mesh(new THREE.ExtrudeGeometry(gBody, { depth: 0.09, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }), bodyM, 0, 0.38, 0, gg);
    const b2 = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 24), bodyM, 0, 0.6, 0.045, gg); b2.rotation.x = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.002, 20), M.black, 0, 0.55, 0.1, gg).rotation.x = Math.PI / 2;
    mesh(boxGeo(0.05, 0.55, 0.03), M.darkWood, 0, 0.98, 0.07, gg);
    mesh(boxGeo(0.07, 0.15, 0.03), M.darkWood, 0, 1.31, 0.06, gg);
    gg.rotation.z = 0.0; gg.children.forEach((c) => (c.rotation.x += 0.0)); gg.rotation.x = -0.18;
    ix.register(gg, { label: 'Strum the guitar', use: () => audio?.strum(gg.getWorldPosition(v3()).add(v3(0, 0.5, 0))) });
    solid(1.0, F, 0.35, 1.4, F + 1.3, 0.75, { walk: false });
  }
  // painting
  const paintingTex = (() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 192; const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 192); gr.addColorStop(0, '#e9b97a'); gr.addColorStop(0.5, '#c87e5a'); gr.addColorStop(1, '#3a3c48'); g.fillStyle = gr; g.fillRect(0, 0, 256, 192);
    g.fillStyle = '#f5d9a0'; g.beginPath(); g.arc(170, 88, 16, 0, 7); g.fill();
    g.fillStyle = '#5a4a5a'; g.beginPath(); g.moveTo(0, 110); for (let x = 0; x <= 256; x += 16) g.lineTo(x, 100 - Math.sin(x * 0.03) * 20 - Math.random() * 6); g.lineTo(256, 192); g.lineTo(0, 192); g.fill();
    g.fillStyle = '#2a3a3a'; for (let x = 0; x < 256; x += 7) { const h = 30 + Math.random() * 30; g.beginPath(); g.moveTo(x, 130); g.lineTo(x + 4, 130 - h); g.lineTo(x + 8, 130); g.fill(); }
    g.fillStyle = 'rgba(200,170,140,0.5)'; g.fillRect(0, 135, 256, 4);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  {
    const p = new THREE.Group(); p.position.set(1.58, F + 1.6, -1.6); p.rotation.y = Math.PI / 2; root.add(p);
    mesh(boxGeo(0.86, 0.66, 0.04), M.darkWood, 0, 0, 0, p);
    mesh(new THREE.PlaneGeometry(0.76, 0.56), new THREE.MeshStandardMaterial({ map: paintingTex, roughness: 0.8 }), 0, 0, 0.021, p, { cast: false });
  }

  // ----------------------------------------------------------- bedroom --
  {
    // bed: head at north wall
    const g = new THREE.Group(); g.position.set(4.0, F, -2.3); root.add(g);
    mesh(boxGeo(1.7, 0.3, 2.15, 1), M.darkWood, 0, 0.2, 0, g);
    mesh(boxGeo(1.75, 1.05, 0.08, 1), M.darkWood, 0, 0.52, -1.06, g);
    mesh(boxGeo(1.75, 0.55, 0.06, 1), M.darkWood, 0, 0.3, 1.07, g);
    for (const x of [-0.85, 0.85]) for (const z of [-1.06, 1.07]) mesh(new THREE.CylinderGeometry(0.045, 0.045, z < 0 ? 1.15 : 0.7, 10), M.darkWood, x, z < 0 ? 0.575 : 0.35, z, g);
    mesh(rbox(1.6, 0.2, 2.0, 0.06, 4), M.linen, 0, 0.45, -0.02, g);
    const q = mesh(rbox(1.66, 0.06, 1.45, 0.03, 3), M.quilt, 0, 0.56, 0.3, g);
    mesh(rbox(1.66, 0.04, 0.3, 0.02, 3), M.linen, 0, 0.565, -0.45, g);
    for (const side of [0.85, -0.85]) mesh(boxGeo(0.02, 0.32, 1.45), M.quilt, side * 1.0, 0.43, 0.3, g);
    solid(3.15, F, -3.4, 4.85, F + 0.58, -1.2, { walk: true, tag: 'soft' });
    for (const x of [-0.4, 0.4]) {
      const pw = mesh(rbox(0.6, 0.14, 0.38, 0.07, 4), M.linen, 4.0 + x, F + 0.65, -3.05, root);
      pw.rotation.x = -0.25;
      ix.item(pw, 'pillow', { mass: 0.4, sound: 'soft' });
    }
    const lie = { eye: v3(4.0, F + 0.95, -2.55), yaw: Math.PI, lie: true, exit: v3(2.85, F, -2.0), yawLimit: 3 };
    ix.register(q, { label: 'Lie down and rest', use: () => { ctx.player.sit(lie); ctx.ui.toast('Resting… time drifts by'); } });
    // nightstand + lamp + drawer
    const ns = new THREE.Group(); ns.position.set(5.3, F, -3.05); root.add(ns);
    mesh(rbox(0.5, 0.55, 0.45, 0.01), M.darkWood, 0, 0.3, 0, ns);
    solid(5.05, F, -3.3, 5.55, F + 0.58, -2.82, { walk: false });
    const dg = new THREE.Group(); dg.position.set(5.3, F + 0.45, -3.05); root.add(dg);
    mesh(boxGeo(0.44, 0.13, 0.03), M.oak, 0, 0, 0.24, dg);
    mesh(new THREE.SphereGeometry(0.015, 8, 6), M.brass, 0, 0, 0.26, dg);
    mesh(boxGeo(0.4, 0.1, 0.4), M.oak, 0, -0.01, 0.02, dg);
    // pocket watch + letter inside
    mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.008, 16), M.brass, -0.08, 0.05, 0.05, dg, { cast: false });
    mesh(boxGeo(0.14, 0.003, 0.1), M.paper, 0.06, 0.042, 0.0, dg, { cast: false }).rotation.y = 0.3;
    const ndr = new Drawer(dg, v3(0, 0, 1), 0.28, ctx);
    ix.register(dg, { label: () => (ndr.open ? 'Close drawer' : 'Open drawer'), use: () => ndr.toggle() });
    updaters.push((dt) => ndr.update(dt));
    const lg = new THREE.Group(); lg.position.set(5.32, F + 0.575, -3.12); root.add(lg);
    mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.2, 16), M.ceramicBlue, 0, 0.1, 0, lg);
    const sm = M.shade.clone();
    mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.17, 20, 1, true), sm, 0, 0.3, 0, lg, { cast: false });
    const bm = M.bulb.clone(); mesh(new THREE.SphereGeometry(0.03, 8, 6), bm, 0, 0.27, 0, lg, { cast: false });
    const L = new THREE.PointLight(0xffb070, 0, 6, 1.7); L.position.set(0, 0.25, 0.05); lg.add(L);
    const lamp = new Lamp(ctx, L, [[bm, 5], [sm, 1.5]], { intensity: 3.5 }); lamps.push(lamp);
    ix.register(lg, { label: () => (lamp.on ? 'Switch off the bedside lamp' : 'Switch on the bedside lamp'), use: () => lamp.toggle() });
    const nb = makeBook(new THREE.MeshStandardMaterial({ color: 0x23412f, roughness: 0.6 }), 0.13, 0.19, 0.03);
    nb.position.set(5.2, F + 0.6, -2.92); nb.rotation.set(-Math.PI / 2, 0, -0.5); root.add(nb);
    ix.item(nb, 'book', { mass: 0.4, sound: 'soft' });
  }
  // chest at the foot of the bed
  {
    const g = new THREE.Group(); g.position.set(4.0, F, -0.95); root.add(g);
    mesh(rbox(1.0, 0.42, 0.5, 0.02), M.oak, 0, 0.21, 0, g);
    for (const x of [-0.42, 0.42]) mesh(boxGeo(0.04, 0.43, 0.52), M.iron, x, 0.215, 0, g);
    mesh(rbox(0.9, 0.06, 0.4, 0.01), M.wool, 0, 0.38, 0, g);
    const hingeG = new THREE.Group(); hingeG.position.set(4.0, F + 0.42, -1.2); root.add(hingeG);
    const lid = new THREE.Group(); hingeG.add(lid);
    mesh(rbox(1.02, 0.08, 0.52, 0.02), M.oak, 0, 0.04, 0.25, lid);
    mesh(boxGeo(0.08, 0.06, 0.02), M.brass, 0, 0.0, 0.51, lid);
    const hn = new Hinged(hingeG, 'x', -1.6, ctx, { sound: 'lid', speed: 4 });
    ix.register(lid, { label: () => (hn.open ? 'Close the chest' : 'Open the chest'), use: () => hn.toggle() });
    updaters.push((dt) => hn.update(dt));
    solid(3.48, F, -1.22, 4.52, F + 0.48, -0.68, { walk: true, tag: 'wood' });
  }
  // wardrobe
  {
    const x0 = 5.25, x1 = 5.85, z0 = 0.85, z1 = 2.25, h = 2.05;
    addBox(x1 - x0, h, 0.03, M.darkWood, (x0 + x1) / 2, F + h / 2, z0, 1.2);
    addBox(x1 - x0, h, 0.03, M.darkWood, (x0 + x1) / 2, F + h / 2, z1, 1.2);
    addBox(x1 - x0, 0.04, z1 - z0, M.darkWood, (x0 + x1) / 2, F + h, (z0 + z1) / 2, 1.2);
    addBox(x1 - x0, 0.06, z1 - z0, M.darkWood, (x0 + x1) / 2, F + 0.03, (z0 + z1) / 2, 1.2);
    addBox(0.02, h, z1 - z0, M.darkWood, x1 - 0.01, F + h / 2, (z0 + z1) / 2, 1.2);
    solid(x0, F, z0, x1, F + h, z1, { walk: false });
    const rod = mesh(new THREE.CylinderGeometry(0.012, 0.012, z1 - z0 - 0.05, 6), M.brass, 5.55, F + 1.8, (z0 + z1) / 2, root); rod.rotation.x = Math.PI / 2;
    const clothes = [0x3a4a5a, 0x7a3a2a, 0x2a3a2a, 0xc8b89a, 0x4a3a2a];
    clothes.forEach((c, i) => { const m = mesh(rbox(0.42, 0.9, 0.05, 0.02), new THREE.MeshStandardMaterial({ map: T.wool.map, color: c, roughness: 1 }), 5.55, F + 1.32, z0 + 0.2 + i * 0.24, root); m.rotation.y = Math.PI / 2 + (rnd() - 0.5) * 0.3; });
    const wdoor = (hz, dirZ, sign) => {
      const g = new THREE.Group(); g.position.set(x0 - 0.015, F + 0.06, hz); g.rotation.y = Math.atan2(-dirZ, 0); root.add(g);
      const p = new THREE.Group(); g.add(p);
      mesh(boxGeo(0.69, h - 0.1, 0.03), M.oak, 0.35, (h - 0.1) / 2, 0, p);
      mesh(boxGeo(0.5, 0.7, 0.012), M.darkWood, 0.35, 1.3, -0.02, p);
      mesh(boxGeo(0.5, 0.7, 0.012), M.darkWood, 0.35, 0.5, -0.02, p);
      mesh(new THREE.SphereGeometry(0.02, 8, 6), M.brass, 0.63, 1.0, -0.04, p);
      const hn = new Hinged(g, 'y', sign * 1.7, ctx, { sound: 'cabinet', speed: 4.5 });
      ix.register(p, { label: () => (hn.open ? 'Close wardrobe' : 'Open wardrobe'), use: () => hn.toggle() });
      updaters.push((dt) => hn.update(dt));
    };
    wdoor(z0, 1, -1); wdoor(z1, -1, 1);
  }
  // desk + chair + candle by the bedroom window
  {
    const g = new THREE.Group(); g.position.set(3.6, F, 3.1); root.add(g);
    mesh(rbox(1.3, 0.04, 0.48, 0.01), M.oak, 0, 0.75, 0, g);
    for (const [x, z] of [[-0.6, -0.2], [0.6, -0.2], [-0.6, 0.2], [0.6, 0.2]]) mesh(boxGeo(0.045, 0.73, 0.045), M.oak, x, 0.365, z, g);
    solid(2.95, F, 2.86, 4.25, F + 0.77, 3.34, { walk: false });
    const c = chair(M, root, 3.6, F, 2.45, 0);
    const seat = { eye: v3(3.6, F + 1.12, 2.5), yaw: Math.PI, exit: v3(3.0, F, 1.9) };
    ix.register(c, { label: 'Sit at the desk', use: () => ctx.player.sit(seat) });
    solid(3.38, F, 2.24, 3.82, F + 0.48, 2.66, { walk: false });
    const nb = makeBook(new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 }), 0.16, 0.22, 0.02);
    nb.position.set(3.45, F + 0.78, 3.08); nb.rotation.set(-Math.PI / 2, 0, 0.1); root.add(nb);
    ix.item(nb, 'notebook', { mass: 0.3, sound: 'soft' });
    const pen = mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.14, 6), M.black, 3.7, F + 0.775, 3.05, root); pen.rotation.set(Math.PI / 2, 0, 0.6);
    ix.item(pen, 'pen', { mass: 0.05, sound: 'wood' });
    const plant = new THREE.Group(); plant.position.set(4.05, F + 0.77, 3.15); root.add(plant);
    mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0xa0583a, roughness: 0.8 }), 0, 0.05, 0, plant);
    for (let i = 0; i < 7; i++) { const l = mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshStandardMaterial({ color: 0x3a6a2a, roughness: 0.6 }), Math.cos(i) * 0.04, 0.12 + (i % 3) * 0.03, Math.sin(i) * 0.04, plant); l.scale.set(1, 0.4, 1.8); l.rotation.y = i; }
    { const g2 = new THREE.PlaneGeometry(1.8, 1.0); g2.rotateX(-Math.PI / 2); mesh(g2, M.rug, 3.9, F + 0.006, 0.3, root, { cast: false }); }
  }

  // ------------------------------------------------------------- porch --
  addBox(8.9, 0.06, 2.7, M.deck, -1.85, F - 0.05, 4.98, 1.6);
  addBox(8.9, 0.5, 0.1, M.trim, -1.85, F - 0.33, 6.3, 1);
  solid(-6.3, -2, 3.6, 2.6, F - 0.02, 6.35, { tag: 'wood' });
  for (let i = 0; i < 3; i++) {
    const top = F - 0.02 - (i + 1) * 0.19, z = 6.47 + i * 0.3;
    addBox(1.9, 0.05, 0.32, M.deck, -2.1, top - 0.025, z, 1.6);
    addBox(1.9, top + 0.05, 0.06, M.trim, -2.1, top / 2, z + 0.13, 1);
    solid(-3.05, -2, z - 0.16, -1.15, top, z + 0.16, { tag: 'wood' });
  }
  // posts, rails, porch roof
  const postX = [-6.2, -3.1, -1.1, 2.5];
  for (const x of postX) { const g = new THREE.CylinderGeometry(0.1, 0.11, 2.5, 12); B.add(g, M.logs, mtx(x, F + 1.2, 6.15)); solid(x - 0.11, F, 6.04, x + 0.11, F + 2.4, 6.26, { walk: false }); }
  const rail = (x0, z0, x1, z1) => {
    const L = Math.hypot(x1 - x0, z1 - z0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, ry = Math.atan2(-(z1 - z0), x1 - x0);
    B.add(boxGeo(L, 0.08, 0.1), M.trim, mtx(cx, F + 0.95, cz, 0, ry, 0));
    B.add(boxGeo(L, 0.06, 0.06), M.trim, mtx(cx, F + 0.12, cz, 0, ry, 0));
    const n = Math.floor(L / 0.16);
    for (let i = 1; i < n; i++) { const t = i / n; B.add(boxGeo(0.04, 0.8, 0.04), M.trim, mtx(x0 + (x1 - x0) * t, F + 0.53, z0 + (z1 - z0) * t)); }
    solid(Math.min(x0, x1) - 0.06, F, Math.min(z0, z1) - 0.06, Math.max(x0, x1) + 0.06, F + 1.0, Math.max(z0, z1) + 0.06, { walk: false });
  };
  rail(-6.2, 6.15, -3.1, 6.15); rail(-1.1, 6.15, 2.5, 6.15); rail(-6.25, 3.75, -6.25, 6.15); rail(2.55, 3.75, 2.55, 6.15);
  {
    const run2 = 3.0, a = Math.atan(0.42 / run2);
    const L2 = Math.hypot(run2, 0.42);
    const top = new THREE.PlaneGeometry(9.3, L2); top.rotateX(-Math.PI / 2); worldUV(top, 2.2); top.translate(0, 0.07, 0);
    const bot = new THREE.PlaneGeometry(9.3, L2); bot.rotateX(Math.PI / 2); worldUV(bot, 1.6); bot.translate(0, -0.07, 0);
    const m = mtx(-1.85, F + 2.67 - 0.21, 3.6 + run2 / 2, a, 0, 0);
    B.add(top, M.shingles, m); B.add(bot, M.ceiling, m); B.add(new THREE.BoxGeometry(9.3, 0.14, L2 - 0.02), M.trim, m);
    B.add(boxGeo(9.0, 0.14, 0.14), M.trim, mtx(-1.85, F + 2.42, 6.15));
  }
  // rocking chair
  {
    const g = new THREE.Group(); g.position.set(-4.6, F - 0.02, 5.0); g.rotation.y = Math.PI; root.add(g);
    const rock = new THREE.Group(); g.add(rock);
    for (const x of [-0.24, 0.24]) {
      const r2 = mesh(new THREE.TorusGeometry(1.0, 0.02, 6, 24, 0.9), M.oak, x, 1.02, 0, rock); r2.rotation.y = Math.PI / 2; r2.rotation.z = -Math.PI / 2 - 0.45;
      mesh(boxGeo(0.04, 0.42, 0.04), M.oak, x, 0.25, -0.2, rock); mesh(boxGeo(0.04, 1.0, 0.04), M.oak, x, 0.55, 0.22, rock).rotation.x = -0.12;
      mesh(boxGeo(0.05, 0.04, 0.5), M.oak, x, 0.68, 0.0, rock);
    }
    mesh(rbox(0.52, 0.05, 0.46, 0.01), M.oak, 0, 0.44, 0, rock);
    for (let i = 0; i < 5; i++) mesh(boxGeo(0.04, 0.6, 0.02), M.oak, -0.18 + i * 0.09, 0.8, 0.27, rock).rotation.x = -0.12;
    mesh(rbox(0.44, 0.06, 0.4, 0.03), M.wool, 0, 0.49, 0.0, rock);
    let rocking = 0, ph = 0;
    const seat = { yaw: Math.PI, exit: v3(-4.6, F, 4.2), getEye: () => { const p = v3(-4.6, F + 1.12, 5.05); p.z += Math.sin(ph) * 0.06; p.y += Math.cos(ph) * 0.01; return p; }, onExit: () => (rocking = 0) };
    ix.register(g, { label: 'Sit in the rocking chair', use: () => { rocking = 1; ctx.player.sit(seat); } });
    updaters.push((dt) => { if (rocking || Math.abs(rock.rotation.x) > 0.001) { ph += dt * 1.6; rock.rotation.x = Math.sin(ph) * 0.09 * (rocking ? 1 : 0.5); if (!rocking) rock.rotation.x *= 0.97; if (rocking && Math.abs(Math.sin(ph)) < 0.02 && Math.random() < 0.3) audio?.creak(g.position, 0.03, 0.3, 120); } });
    solid(-4.9, F, 4.7, -4.3, F + 0.5, 5.3, { walk: false });
  }
  // porch table + lantern
  {
    const g = new THREE.Group(); g.position.set(-5.65, F - 0.02, 4.4); root.add(g);
    mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 20), M.oak, 0, 0.6, 0, g);
    mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.6, 8), M.oak, 0, 0.3, 0, g);
    mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.03, 16), M.oak, 0, 0.015, 0, g);
    solid(-5.93, F, 4.12, -5.37, F + 0.6, 4.68, { walk: true, tag: 'wood' });
    const lantern = lanternModel(M, ctx); lantern.position.set(-5.65, F + 0.6, 4.4); root.add(lantern);
    ix.item(lantern, 'lantern', { mass: 1.1, sound: 'metal' });
    ctx.handLantern = lantern;
    const cup = mesh(mugGeo(), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.2, metalness: 0.6 }), -5.5, F + 0.6, 4.25, root);
    ix.item(cup, 'tin cup', { mass: 0.2, shape: 'cylinder', sound: 'metal' });
  }
  // firewood stack against the wall
  {
    const s = new THREE.CylinderGeometry(0.07, 0.07, 0.4, 7);
    for (let row = 0; row < 6; row++) for (let i = 0; i < 11; i++) {
      B.add(s, ctx.fireLogMat || M.logs, mtx(0.9 + i * 0.145 + (row % 2) * 0.07, F + 0.07 + row * 0.13, 3.92, Math.PI / 2, 0, 0));
    }
    solid(0.82, F, 3.68, 2.55, F + 0.82, 4.14, { walk: false });
  }
  // wind chime
  {
    const g = new THREE.Group(); g.position.set(0.6, F + 2.3, 6.0); root.add(g);
    mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 12), M.oak, 0, 0, 0, g);
    const rods = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2, piv = new THREE.Group(); piv.position.set(Math.cos(a) * 0.06, -0.02, Math.sin(a) * 0.06); g.add(piv);
      mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22 + i * 0.04, 8), M.steel, 0, -0.14 - i * 0.02, 0, piv, { cast: false });
      rods.push(piv);
    }
    let tChime = 0;
    updaters.push((dt, t) => {
      const wnd = ctx.weather.w.gust;
      rods.forEach((r, i) => { r.rotation.x = Math.sin(t * (2.1 + i * 0.3) + i) * 0.15 * wnd; r.rotation.z = Math.cos(t * (1.7 + i * 0.4) + i * 2) * 0.12 * wnd; });
      tChime -= dt;
      if (tChime < 0) { tChime = 0.4 + Math.random() * (5 - wnd * 4); if (wnd > 0.2 && Math.random() < wnd) audio?.chime(g.position, wnd); }
    });
    ix.register(g, { label: 'Touch the wind chime', use: () => audio?.chime(g.position, 1) });
  }
  // doormat + boots
  { const g = new THREE.PlaneGeometry(0.9, 0.55); g.rotateX(-Math.PI / 2); mesh(g, new THREE.MeshStandardMaterial({ color: 0x5a4a32, roughness: 1, map: T.wool.map }), -2.1, F + 0.005, 3.95, root, { cast: false }); }

  // flush static geometry
  const meshes = B.flush(root);
  meshes.forEach((m) => ix.occluder(m));

  // ------------------------------------------------------------- queries --
  const indoor = (p) => p.x > -5.95 && p.x < 5.95 && p.z > -3.4 && p.z < 3.4 && p.y < RIDGE + 0.5 && p.y > F - 0.5;
  const openness = () => openables.reduce((a, o) => a + (o.h.open ? o.w : 0), 0) / 2;

  return { root, indoor, openness, fire, lamps, frontDoor, bedDoor };
}
