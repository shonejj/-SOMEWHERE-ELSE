// SOMEWHERE ELSE — world bootstrap and main loop.
import * as THREE from 'three';
import { PRESETS, saveSettings, isTouch } from './core/settings.js';
import { WATER_LEVEL, LAKE, PLACES, FLOOR, TREEHOUSE } from './core/layout.js';
import { buildTextures } from './core/textures.js';
import { Terrain, lakeE } from './env/terrain.js';
import { SkySystem } from './env/sky.js';
import { Weather } from './env/weather.js';
import { Lake } from './env/water.js';
import { Vegetation } from './env/vegetation.js';
import { GrassField } from './env/grassfield.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
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
import { Hands } from './systems/hands.js';
import { Body } from './systems/body.js';
import { LofiPlayer } from './systems/music.js';
import { Splashes } from './systems/splashes.js';
import * as CANNON from 'cannon-es';
import { glassRain, glassTime } from './build/kit.js';

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
  renderer.shadowMap.autoUpdate = false;
  renderer.domElement.id = 'world-canvas';
  container.insertBefore(renderer.domElement, container.firstChild); // UI overlays must stay above the canvas

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
  // roof surfaces (rain splashes land on them too)
  const roofAt = (x, z) => {
    if (Math.abs(x) < 6.7 && Math.abs(z) < 4.1) return FLOOR + 5.0 - Math.abs(z) * (2.0 / 3.5) + 0.26;
    if (x > -6.5 && x < 2.8 && z >= 4.1 && z < 6.6) return FLOOR + 2.46 - (z - 5.1) * 0.14 + 0.08;
    return null;
  };
  const groundQuery = (x, z, camY) => {
    const roof = roofAt(x, z);
    if (roof !== null) return roof;
    const t = terrain.heightAt(x, z);
    const s = colliders.supportHeight(x, z, 0.01, camY + 0.5);
    const y = Math.max(t, s);
    return y < WATER_LEVEL ? WATER_LEVEL : y;
  };
  const weather = new Weather(scene, preset, groundQuery);
  weather.setMode(settings.weather);
  progress(0.58, 'Filling the lake'); await nextFrame();
  const lake = new Lake(scene, preset, T, terrain);
  progress(0.62, 'Growing the forest'); await nextFrame();
  const veg = new Vegetation(scene, preset, T, terrain, colliders, renderer);
  const grass = new GrassField(scene, preset, terrain);
  const splashes = new Splashes(scene, preset.key === 'low' ? 300 : 700);
  if (lake.reflective) {
    // keep the lake's mirror pass cheap: skip grass and particles, refresh every other frame
    const orig = lake.mesh.onBeforeRender;
    let tick = 0;
    lake.mesh.onBeforeRender = function (...args) {
      if ((tick++ & 1) && preset.key !== 'ultra') return;
      grass.setVisible(false); splashes.points.visible = false; weather.rain.visible = false;
      orig.apply(this, args);
      grass.setVisible(true); splashes.points.visible = true; weather.rain.visible = weather.w.rain > 0.02;
    };
  }

  const ui = new UI(settings, {});
  const input = new Input(renderer.domElement, ui);
  const player = new Player(camera, input, terrain, colliders, audio, settings);
  const ix = new Interaction({ camera, input, physics, audio, player, ui });
  const hands = new Hands(camera, T);
  const body = new Body(scene, T);
  sky.sun.shadow.camera.layers.enableAll();
  player.onSplash = (p, k) => { splashes.burst(p, k, 22); audio?.splash(p.clone ? p.clone() : p, Math.min(1, 0.3 + k * 0.6)); wildlife?.splashAt(p); };
  player.onStroke = (p, sp) => {
    const f = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
    for (const side of [-1, 1]) splashes.burst({ x: p.x + f.x * 0.5 + f.z * side * 0.35, z: p.z + f.z * 0.5 - f.x * side * 0.35 }, 0.45, 10);
    audio?.noiseHit(new THREE.Vector3(p.x, WATER_LEVEL, p.z), { type: 'bandpass', f: 700 + Math.random() * 500, q: 0.8, a: 0.03, d: 0.35, v: 0.22 });
    audio?.noiseHit(new THREE.Vector3(p.x, WATER_LEVEL, p.z), { buf: audio.pink, type: 'highpass', f: 2200, a: 0.05, d: 0.3, v: 0.1 });
    wildlife?.ring(p.x, p.z, 0.8, 0.5);
  };
  let wildlife = null;
  player.onScope = (on) => ui.setScope(on);
  weather.splashFx = (x, y, z) => { for (let k = 0; k < 2; k++) { const a = Math.random() * 6.28; splashes.spawn(x, y + 0.02, z, Math.cos(a) * 0.5, 0.8 + Math.random() * 0.9, Math.sin(a) * 0.5, 0.007 + Math.random() * 0.006, 0.4, 0, y); } };
  ix.hands = hands;
  if (input.touch) ix.coneAngle = 0.16;
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
  player.occluders = ix.occluders;
  buildOutdoor(ctx);
  ctx.splashes = splashes;
  wildlife = new Wildlife(ctx);
  // physics ground: heightfield around the inhabited area + nearby tree trunks
  physics.addTerrain(terrain, 0, 18, 150, 1);
  for (const list of colliders.cyl.values()) for (const c of list) if (Math.hypot(c.x, c.z - 18) < 75) physics.addCylinder(c);
  physics.onImpact = (it, v) => audio?.impact(it, v);

  // ------------------------------------------------------- start pose --
  player.teleport(-1.6, undefined, 11.5, 0.05);
  player.pitch = 0.02;

  // gentle bloom on lamps, fire and sun glints (High / Ultra)
  let composer = null;
  if (preset.bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.32, 0.55, 0.88));
    composer.addPass(new OutputPass());
  }
  const draw = () => (composer ? composer.render() : renderer.render(scene, camera));
  const resize = () => { renderer.setSize(innerWidth, innerHeight); if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(innerWidth, innerHeight); } };

  progress(0.88, 'Warming shaders'); await nextFrame();
  sky.update(0.016, clock.hour, weather.w, camera.position, 0);
  try { await renderer.compileAsync(scene, camera); } catch (e) { renderer.compile(scene, camera); }
  progress(1, 'Ready');

  // ------------------------------------------------------- handlers --
  let paused = false, running = true, pausedDrawn = false;
  const setPaused = (p) => {
    paused = p; ui.showMenu(p);
    if (audio) { if (p) audio.master.gain.setTargetAtTime(settings.volume * 0.35, audio.now, 0.2); else audio.setVolume(settings.volume); }
  };
  let overlay = false;
  // ------------------------------------------------------- pocket player
  const $ = (id) => document.getElementById(id);
  const lofi = audio ? new LofiPlayer(audio) : null;
  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  const plRefresh = () => {
    if (!lofi) return;
    $('pl-title').textContent = lofi.title; $('pl-state').textContent = lofi.playing ? 'Now playing' : 'Paused';
    $('pl-num').textContent = `${lofi.track + 1} / 8`; $('pl-nature').classList.toggle('on', lofi.nature);
    $('pl-dur').textContent = fmt(lofi.duration);
  };
  let musicOpen = false;
  const setMusic = (on) => {
    musicOpen = on; $('player').classList.toggle('open', on);
    if (on && lofi && !lofi.r) { lofi.load(0); }
    plRefresh();
    overlay = on; if (on) input.exitLock(); else if (!input.touch && !paused) input.requestLock();
  };
  if (lofi) {
    $('pl-play').onclick = () => { lofi.toggle(); plRefresh(); };
    $('pl-next').onclick = () => { lofi.nextTrack(); if (!lofi.playing) lofi.play(lofi.track); plRefresh(); };
    $('pl-prev').onclick = () => { lofi.prevTrack(); if (!lofi.playing) lofi.play(lofi.track); plRefresh(); };
    $('pl-nature').onclick = () => { lofi.setNature(!lofi.nature); plRefresh(); };
    $('pl-vol').oninput = (e) => lofi.setVolume(Number(e.target.value));
    addEventListener('keydown', (e) => {
      if (!musicOpen) return;
      if (e.code === 'Space') { e.preventDefault(); lofi.toggle(); plRefresh(); }
      if (e.code === 'ArrowRight') { lofi.nextTrack(); plRefresh(); }
      if (e.code === 'ArrowLeft') { lofi.prevTrack(); plRefresh(); }
    });
    setInterval(() => { if (lofi.playing) { $('pl-time').textContent = fmt(lofi.pos); $('pl-prog').style.width = Math.min(100, lofi.pos / lofi.duration * 100) + '%'; plRefresh(); } }, 500);
  }
  Object.assign(ui.h, {
    hour: () => clock.hour,
    overlay: (on) => { overlay = on; input.enabled = !on; if (on) { input.keys.clear(); input.exitLock(); } else if (!input.touch) input.requestLock(); },
    resume: () => { setPaused(false); if (!input.touch) input.requestLock(); },
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
      if (id === 'treehouse') player.teleport(p.pos[0], terrain.heightAt(TREEHOUSE.x, TREEHOUSE.z) + 4.4, p.pos[2], p.yaw);
      else if (id === 'dock') player.teleport(p.pos[0], WATER_LEVEL + 0.65, p.pos[2], p.yaw);
      else if (['living', 'bedroom', 'porch'].includes(id)) player.teleport(p.pos[0], FLOOR, p.pos[2], p.yaw);
      else player.teleport(p.pos[0], undefined, p.pos[2], p.yaw);
      setPaused(false); if (!input.touch) input.requestLock();
      await ui.fade(false, 700);
    },
  });
  input.onUnlock = () => { if (running && !input.touch && !overlay) setPaused(true); };
  addEventListener('keydown', (e) => { if (e.code === 'KeyM' && musicOpen) setMusic(false); });
  input.onTouchMode = () => { ui.setTouch(true); ix.coneAngle = 0.16; };

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    resize();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) setPaused(true); });

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
    const minFrame = settings.maxFps ? 1000 / settings.maxFps - 1.5 : 0;
    if (now - last < minFrame) return; // frame-rate cap saves battery and heat
    let dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (paused) { if (!pausedDrawn) { draw(); pausedDrawn = true; } input.endFrame(); return; }
    pausedDrawn = false;
    elapsed += dt;

    // time of day
    const resting = player.mode === 'seat' && player.seat?.lie;
    const rate = (settings.timeFlow ? 1 / 150 : 0) * (resting ? 40 : 1);
    clock.hour = (clock.hour + dt * rate + 24) % 24;
    if (frames % 15 === 0) ui.updateTime(clock.hour);

    input.look.x = input.look.x; // (accumulated by events)
    player.update(dt);
    if (input.hit('KeyF')) player.toggleFlashlight();
    if (input.hit('KeyM')) setMusic(!musicOpen);
    if (input.hit('Escape') && input.touch) { input.endFrame(); setPaused(true); return; }
    ix.update(dt);
    const third = player.view === 'third' && player.mode !== 'scope';
    hands.R.root.parent.visible = true;
    hands.update(dt, { held: ix.held, inspecting: ix.held && (input.down('KeyR') || input.mouse.right), hover: !!ix.focus && !player.swimming, mode: player.mode, bob: player.bob, swim: player.swimming, swimPhase: player.swimPhase, music: musicOpen && !player.swimming, musicOn: lofi?.playing });
    if (third) { hands.R.root.visible = false; hands.L.root.visible = false; }
    body.update(dt, { pos: player.pos, yaw: player.yaw, pitch: player.pitch, mode: player.mode, seat: player.seat, camera, eye: player.eyePos, speed: player.speedH, running: player.speedH > 3,
      crouch: Math.max(0, Math.min(1, (1.72 - player.height) / 0.6)), onGround: player.onGround, travel: player.travel, stepLen: player.stepLen,
      swim: player.swimming, swimPhase: player.swimPhase, waterY: WATER_LEVEL - player.dive, climbing: player.climbing, handsActive: hands.R.root.visible, third });
    physics.step(dt);
    for (const it of physics.items) {
      if (it.held) continue;
      const y = it.body.position.y;
      const inLake = y < WATER_LEVEL && lakeE(it.body.position.x, it.body.position.z) < 1.05;
      if (inLake && it.wasAbove) {
        const v = it.body.velocity, hs = Math.hypot(v.x, v.z);
        wildlife.splashAt(it.body.position); splashes.burst(it.body.position, Math.min(1.2, 0.4 + Math.hypot(it.body.velocity.x, it.body.velocity.y, it.body.velocity.z) * 0.12), 16);
        if (it.skimmer && hs > 4 && -v.y < hs * 0.6) {
          v.y = Math.abs(v.y) * 0.55 + 0.6; v.x *= 0.8; v.z *= 0.8; it.body.position.y = WATER_LEVEL + 0.02;
          audio?.noiseHit(it.mesh.position, { type: 'bandpass', f: 1800, q: 1, d: 0.08, v: 0.25, ref: 4 });
        } else { audio?.splash(it.mesh.position, Math.min(1, 0.3 + it.body.mass * 0.4)); it.body.linearDamping = 0.9; it.body.angularDamping = 0.9; }
      }
      if (!inLake && y > WATER_LEVEL + 0.1) { it.body.linearDamping = 0.05; it.body.angularDamping = 0.15; }
      // light things float and bob; stones and metal sink
      if (inLake && (it.sound === 'wood' || it.sound === 'soft')) {
        const sub = Math.min(1, (WATER_LEVEL + 0.02 - y) / 0.12);
        it.body.applyForce(new CANNON.Vec3(Math.sin(elapsed * 0.3) * 0.02, it.body.mass * 9.82 * (1 + sub * 1.4), Math.cos(elapsed * 0.27) * 0.02), it.body.position);
        it.body.wakeUp(); it.body.linearDamping = 0.6;
      }
      it.wasAbove = !inLake;
    }
    for (const u of updaters) u(dt, elapsed);

    const focus = tmp.copy(camera.position);
    sky.update(dt, clock.hour, weather.w, focus, elapsed);
    weather.update(dt, elapsed, camera, sky);
    lake.update(dt, elapsed, sky, weather);
    veg.update(elapsed, weather, camera.position);
    splashes.update(dt, sky.sun.color.clone().multiplyScalar(0.25 + sky.state.daylight * 0.7));
    glassRain.value = weather.w.rain; glassTime.value = elapsed;
    terrain.uniforms.uTime.value = elapsed; terrain.uniforms.uRain.value = weather.w.rain; terrain.uniforms.uDay.value = sky.state.daylight;
    // water dripping off the eaves when it rains
    if (weather.w.rain > 0.12 && camera.position.distanceToSquared(tmp.set(0, 2, 2)) < 900) {
      const n = weather.w.rain * 30 * dt;
      for (let i = 0; i < n + (Math.random() < n % 1 ? 1 : 0); i++) {
        const e = Math.random();
        let x, z, y;
        if (e < 0.4) { x = -6.6 + Math.random() * 13.2; z = -4.12; y = FLOOR + 2.66; }
        else if (e < 0.6) { x = 2.85 + Math.random() * 3.8; z = 4.12; y = FLOOR + 2.66; }
        else { x = -6.4 + Math.random() * 9.1; z = 6.62; y = FLOOR + 2.18; }
        const floorY = Math.max(terrain.heightAt(x, z), colliders.supportHeight(x, z, 0.01, y - 0.3));
        splashes.drip(x, y, z, floorY);
      }
    }
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
    sky.uniforms.uPix.value = (camera.fov * Math.PI / 180) / innerHeight;
    // under the surface: murky green-blue, light from above, muffled world, rising bubbles
    const under = camera.position.y < WATER_LEVEL - 0.03 && lakeE(camera.position.x, camera.position.z) < 1.2;
    if (under) {
      const day = sky.state.daylight;
      weather.fog.color.setRGB(0.04 + day * 0.07, 0.11 + day * 0.18, 0.12 + day * 0.16);
      weather.fog.density = 0.16;
      if (Math.random() < dt * 3) splashes.bubbles(camera.position.clone().add(new THREE.Vector3(0, -0.2, -0.3).applyQuaternion(camera.quaternion)), 3);
    }
    lake.mesh.material.uniforms.uUnder.value = under ? 1 : 0;
    if (audio) audio.setUnderwater(under);

    if (audio) {
      const dx = camera.position.x - LAKE.x, dz = camera.position.z - LAKE.z, a = Math.atan2(dz / LAKE.rz, dx / LAKE.rx);
      shore.set(LAKE.x + Math.cos(a) * LAKE.rx * 0.95, WATER_LEVEL, LAKE.z + Math.sin(a) * LAKE.rz * 0.95);
      audio.tickListener(camera);
      audio.updateAmbience(dt, {
        rain: weather.w.rain, wind: weather.w.gust, night, daylight: sky.state.daylight,
        indoor: indoor ? 1 : 0, openness: cabin.openness(), shorePos: shore, trees: nearTree, listenerPos: camera.position,
        forest: indoor ? 0.2 : 1,
      });
    }

    grass.update(camera);
    renderer.shadowMap.needsUpdate = frames % preset.shadowEvery === 0;
    draw();
    input.endFrame();

    // dynamic resolution keeps things smooth
    frames++; frameAcc += dt;
    if (frameAcc > 2) {
      const avg = frameAcc / frames; frames = 0; frameAcc = 0;
      let ns = resScale;
      if (avg > 1 / 42 && resScale > 0.55) ns = resScale - 0.1;
      else if (avg < 1 / 58 && resScale < preset.pixelRatio) ns = Math.min(preset.pixelRatio, resScale + 0.05);
      if (ns !== resScale) { resScale = ns; renderer.setPixelRatio(baseDPR * resScale); resize(); }
    }
  };
  renderer.setAnimationLoop(frame);

  // debugging / automated testing hook
  window.__SE = { scene, camera, player, renderer, weather, clock, sky, ix, physics, cabin, settings, colliders, terrain, setPaused, travel: ui.h.travel };
  return { renderer, scene, camera, player, stop: () => { running = false; renderer.setAnimationLoop(null); } };
}
