// SOMEWHERE ELSE — world bootstrap and main loop.
import * as THREE from 'three';
import { PRESETS, saveSettings, isTouch } from './core/settings.js';
import { WATER_LEVEL, LAKE, PLACES, FLOOR } from './core/layout.js';
import { buildTextures } from './core/textures.js';
import { Terrain, lakeE } from './env/terrain.js';
import { SkySystem } from './env/sky.js';
import { Weather } from './env/weather.js';
import { Lake } from './env/water.js';
import { Vegetation } from './env/vegetation.js';
import { makeMaterials } from './build/kit.js';
import { buildCabin } from './build/cabin.js';
import { buildOutdoor } from './build/outdoor.js';
import { Colliders } from './systems/colliders.js';
import { Physics } from './systems/physics.js';
import { Input } from './systems/input.js';
import { Player } from './systems/player.js';
import { Interaction } from './systems/interaction.js';
import { Wildlife } from './systems/wildlife.js';
import { Radio } from './systems/radio.js';
import { UI } from './systems/ui.js';

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

export async function startWorld({ container, settings, audio, onProgress, onExit }) {
  const preset = PRESETS[settings.quality];
  const progress = (p, label) => onProgress?.(p, label);
  progress(0.02, 'Waking the renderer');

  const renderer = new THREE.WebGLRenderer({ antialias: preset.antialias, powerPreference: 'high-performance', stencil: false });
  const baseDPR = Math.min(window.devicePixelRatio || 1, preset.maxPixelRatio);
  let resScale = preset.pixelRatio;
  renderer.setPixelRatio(baseDPR * resScale);
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = preset.shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.id = 'world-canvas';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(settings.fov, innerWidth / innerHeight, 0.05, 2000);
  scene.add(camera);

  // ------------------------------------------------------------ build --
  const T = await buildTextures(preset, (p, k) => progress(0.05 + p * 0.45, 'Weaving textures · ' + k));
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  for (const t of Object.values(T)) { const list = t.map ? [t.map, t.normalMap] : [t]; list.forEach((x) => x && (x.anisotropy = Math.min(8, maxAniso))); }
  const M = makeMaterials(T);
  progress(0.52, 'Shaping the valley'); await nextFrame();
  const terrain = new Terrain(preset, T);
  scene.add(terrain.mesh);
  const colliders = new Colliders();
  const physics = new Physics();
  const sky = new SkySystem(scene, renderer, preset);
  const groundQuery = (x, z, camY) => {
    const roof = (Math.abs(x) < 6.8 && Math.abs(z) < 4.2) || (x > -6.5 && x < 2.8 && z > 3.5 && z < 6.6);
    if (roof) return null;
    const t = terrain.heightAt(x, z);
    const s = colliders.supportHeight(x, z, 0.01, camY + 0.5);
    const y = Math.max(t, s);
    return y < WATER_LEVEL ? WATER_LEVEL : y;
  };
  const weather = new Weather(scene, preset, groundQuery);
  weather.setMode(settings.weather);
  progress(0.58, 'Filling the lake'); await nextFrame();
  const lake = new Lake(scene, preset, T);
  progress(0.62, 'Growing the forest'); await nextFrame();
  const veg = new Vegetation(scene, preset, T, terrain, colliders);

  const ui = new UI(settings, {});
  const input = new Input(renderer.domElement, ui);
  const player = new Player(camera, input, terrain, colliders, audio, settings);
  const ix = new Interaction({ camera, input, physics, audio, player, ui });
  const clock = { hour: settings.startHour };
  const updaters = [];
  const ctx = {
    scene, M, T, ix, col: colliders, phys: physics, audio, terrain, weather, player, ui, clock, updaters, quality: preset,
    rockMat: veg.rockMat,
    makeRadio: (pos) => (audio ? new Radio(audio, pos) : null),
  };
  progress(0.72, 'Raising the cabin'); await nextFrame();
  const cabin = buildCabin(ctx);
  progress(0.8, 'Building the dock and tree house'); await nextFrame();
  buildOutdoor(ctx);
  const wildlife = new Wildlife(ctx);
  // physics ground: heightfield around the inhabited area + nearby tree trunks
  physics.addTerrain(terrain, 0, 18, 150, 1);
  for (const list of colliders.cyl.values()) for (const c of list) if (Math.hypot(c.x, c.z - 18) < 75) physics.addCylinder(c);
  physics.onImpact = (it, v) => audio?.impact(it, v);

  // ------------------------------------------------------- start pose --
  player.teleport(-1.6, undefined, 11.5, 0.05);
  player.pitch = 0.02;

  progress(0.88, 'Warming shaders'); await nextFrame();
  sky.update(0.016, clock.hour, weather.w, camera.position, 0);
  try { await renderer.compileAsync(scene, camera); } catch (e) { renderer.compile(scene, camera); }
  progress(1, 'Ready');

  // ------------------------------------------------------- handlers --
  let paused = false, running = true;
  const setPaused = (p) => {
    paused = p; ui.showMenu(p);
    if (audio) { if (p) audio.master.gain.setTargetAtTime(settings.volume * 0.35, audio.now, 0.2); else audio.setVolume(settings.volume); }
  };
  Object.assign(ui.h, {
    resume: () => { setPaused(false); input.requestLock(); },
    exit: () => { running = false; input.exitLock(); onExit?.(); },
    quality: (q) => { settings.quality = q; saveSettings(settings); try { sessionStorage.setItem('se-autoenter', '1'); } catch (e) {} location.reload(); },
    changed: (key) => {
      saveSettings(settings);
      if (key === 'volume') audio?.setVolume(settings.volume * (paused ? 0.35 : 1));
      if (key === 'weather') weather.setMode(settings.weather);
      if (key === 'fov') player.fovTarget = settings.fov;
    },
    setHour: (h) => { clock.hour = h; },
    travel: async (id) => {
      const p = PLACES.find((pl) => pl.id === id);
      await ui.fade(true, 400);
      if (ix.held) ix.release(0);
      if (player.mode === 'seat') player.stand();
      if (id === 'treehouse') player.teleport(p.pos[0], terrain.heightAt(p.pos[0], p.pos[2]) + 4.6, p.pos[2], p.yaw);
      else if (['living', 'bedroom', 'porch'].includes(id)) player.teleport(p.pos[0], FLOOR, p.pos[2], p.yaw);
      else player.teleport(p.pos[0], undefined, p.pos[2], p.yaw);
      setPaused(false); input.requestLock();
      await ui.fade(false, 700);
    },
  });
  input.onUnlock = () => { if (running && !isTouch) setPaused(true); };
  if (isTouch) document.getElementById('tb-menu').addEventListener('touchend', () => setPaused(!paused));

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && !isTouch) setPaused(true); });

  // ----------------------------------------------------------- loop --
  let last = performance.now(), elapsed = 0, frameAcc = 0, frames = 0, envFrame = 0;
  const shore = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const nightFill = new THREE.Color(0.07, 0.09, 0.15);
  const nearTree = () => {
    const t = veg.trees[Math.floor(Math.random() * veg.trees.length)];
    for (let i = 0; i < 20; i++) { const c = veg.trees[Math.floor(Math.random() * veg.trees.length)]; if (Math.hypot(c.x - camera.position.x, c.z - camera.position.z) < 45) return new THREE.Vector3(c.x, terrain.heightAt(c.x, c.z) + 8, c.z); }
    return new THREE.Vector3(t.x, 8, t.z);
  };
  weather.onThunder = (dist, delay) => setTimeout(() => audio?.thunder(dist), delay * 1000);

  const frame = () => {
    if (!running) return;
    const now = performance.now();
    let dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (paused) { renderer.render(scene, camera); return; }
    elapsed += dt;

    // time of day
    const resting = player.mode === 'seat' && player.seat?.lie;
    const rate = (settings.timeFlow ? 1 / 150 : 0) * (resting ? 40 : 1);
    clock.hour = (clock.hour + dt * rate + 24) % 24;
    if (frames % 15 === 0) ui.updateTime(clock.hour);

    input.look.x = input.look.x; // (accumulated by events)
    player.update(dt);
    if (input.hit('KeyF')) player.toggleFlashlight();
    if (input.hit('Escape') && isTouch) setPaused(true);
    ix.update(dt);
    physics.step(dt);
    for (const it of physics.items) {
      if (it.held) continue;
      const y = it.body.position.y;
      const inLake = y < WATER_LEVEL && lakeE(it.body.position.x, it.body.position.z) < 1.05;
      if (inLake && it.wasAbove) {
        const v = it.body.velocity, hs = Math.hypot(v.x, v.z);
        wildlife.splashAt(it.body.position);
        if (it.skimmer && hs > 4 && -v.y < hs * 0.6) {
          v.y = Math.abs(v.y) * 0.55 + 0.6; v.x *= 0.8; v.z *= 0.8; it.body.position.y = WATER_LEVEL + 0.02;
          audio?.noiseHit(it.mesh.position, { type: 'bandpass', f: 1800, q: 1, d: 0.08, v: 0.25, ref: 4 });
        } else { audio?.splash(it.mesh.position, Math.min(1, 0.3 + it.body.mass * 0.4)); it.body.linearDamping = 0.9; it.body.angularDamping = 0.9; }
      }
      if (!inLake && y > WATER_LEVEL + 0.1) { it.body.linearDamping = 0.05; it.body.angularDamping = 0.15; }
      it.wasAbove = !inLake;
    }
    for (const u of updaters) u(dt, elapsed);

    const focus = tmp.copy(camera.position);
    sky.update(dt, clock.hour, weather.w, focus, elapsed);
    weather.update(dt, elapsed, camera, sky);
    lake.update(dt, elapsed, sky, weather);
    veg.update(elapsed, weather);
    wildlife.update(dt, elapsed, player, sky, weather, audio);
    terrain.uniforms.wet.value = weather.w.wet;
    for (const m of [M.deck, M.shingles]) m.roughness = 0.85 - weather.w.wet * 0.4;

    // exposure: let eyes adapt a little at night and indoors
    const indoor = cabin.indoor(camera.position);
    const night = sky.state.night;
    const targetExp = 0.95 + night * 0.35 + (indoor ? 0.2 : 0) - sky.state.daylight * weather.w.flash * 0.3;
    renderer.toneMappingExposure += (targetExp - renderer.toneMappingExposure) * Math.min(1, dt * 1.5);
    // a little hemisphere fill at night so shapes remain readable
    if (night > 0.3) { sky.hemi.color.lerp(nightFill, 0.85 * night); }
    sky.hemi.intensity *= indoor ? 0.55 - night * 0.3 : 1;
    for (const m of M.interior) m.envMapIntensity = indoor ? 0.25 : 0.6;

    if (audio) {
      const dx = camera.position.x - LAKE.x, dz = camera.position.z - LAKE.z, a = Math.atan2(dz / LAKE.rz, dx / LAKE.rx);
      shore.set(LAKE.x + Math.cos(a) * LAKE.rx * 0.95, WATER_LEVEL, LAKE.z + Math.sin(a) * LAKE.rz * 0.95);
      audio.tickListener(camera);
      audio.updateAmbience(dt, {
        rain: weather.w.rain, wind: weather.w.gust, night, daylight: sky.state.daylight,
        indoor: indoor ? 1 : 0, openness: cabin.openness(), shorePos: shore, trees: nearTree,
        forest: indoor ? 0.2 : 1,
      });
    }

    renderer.render(scene, camera);
    input.endFrame();

    // dynamic resolution keeps things smooth
    frames++; frameAcc += dt;
    if (frameAcc > 2) {
      const avg = frameAcc / frames; frames = 0; frameAcc = 0;
      let ns = resScale;
      if (avg > 1 / 42 && resScale > 0.55) ns = resScale - 0.1;
      else if (avg < 1 / 58 && resScale < preset.pixelRatio) ns = Math.min(preset.pixelRatio, resScale + 0.05);
      if (ns !== resScale) { resScale = ns; renderer.setPixelRatio(baseDPR * resScale); renderer.setSize(innerWidth, innerHeight); }
    }
  };
  renderer.setAnimationLoop(frame);
  if (!isTouch) input.requestLock();

  // debugging / automated testing hook
  window.__SE = { scene, camera, player, renderer, weather, clock, sky, ix, physics, cabin, settings, colliders, terrain, setPaused, travel: ui.h.travel };
  return { renderer, scene, camera, player, stop: () => { running = false; renderer.setAnimationLoop(null); } };
}
