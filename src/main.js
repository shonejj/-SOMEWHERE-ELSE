// Landing page controller: hero visuals, ambient sound, ENTER WORLD flow.
import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import './style.css';
import { startHero } from './landing/hero.js';
import { loadSettings, saveSettings, isTouch } from './world/core/settings.js';
import { AudioEngine } from './world/systems/audio.js';

const $ = (id) => document.getElementById(id);
const settings = loadSettings();
let audio = null;
let soundOn = false;

const hero = startHero($('hero-canvas'), () => { if (audio && soundOn) setTimeout(() => audio.thunder(0.6 + Math.random() * 0.3), 1200 + Math.random() * 2500); });

// quality picker
const qs = $('quality-select');
qs.value = settings.quality;
qs.onchange = () => { settings.quality = qs.value; saveSettings(settings); };

function ensureAudio() {
  if (!audio) {
    try { audio = new AudioEngine(); audio.setVolume(settings.volume); } catch (e) { console.warn('Audio unavailable', e); }
  }
  audio?.resume();
  return audio;
}
function landingAmbience(on) {
  if (!audio) return;
  const t = audio.now, L = audio.loops;
  L.rain.g.gain.setTargetAtTime(on ? 0.42 : 0, t, 0.8);
  L.rain.lp.frequency.setTargetAtTime(4200, t, 0.5);
  L.wind.g.gain.setTargetAtTime(on ? 0.08 : 0, t, 0.8);
  L.lap.g.gain.setTargetAtTime(0, t, 0.5);
}
$('sound-toggle').onclick = () => {
  ensureAudio();
  soundOn = !soundOn;
  $('sound-toggle').setAttribute('aria-pressed', String(soundOn));
  $('sound-toggle').querySelector('.label').textContent = soundOn ? 'Sound on' : 'Sound off';
  landingAmbience(soundOn);
};

// preload the world code while the visitor reads
let worldModule = null;
const loadWorld = () => (worldModule ||= import('./world/World.js'));
if ('requestIdleCallback' in window) requestIdleCallback(() => loadWorld()); else setTimeout(loadWorld, 1500);

const tips = [
  'The fire is already lit. Sit with it a while.',
  'Open a window to let the rain in.',
  'Lie down on the bed and the hours drift past.',
  'The radio plays music no one has heard before.',
  'Skip a smooth stone across the lake.',
  'The deer are shy. Crouch, and move slowly.',
  'At night, the tree house string lights look lovely from the lake.',
];

async function enter() {
  ensureAudio();
  if (audio) { landingAmbience(false); audio.setVolume(settings.volume); }
  const loading = $('loading');
  $('loading-tip').textContent = tips[Math.floor(Math.random() * tips.length)];
  loading.classList.add('show');
  if (isTouch) { try { await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' }); } catch (e) { /* not supported */ } }
  await new Promise((r) => setTimeout(r, 900));
  hero.stop();
  $('landing').style.display = 'none';
  document.body.classList.add('in-world');
  const worldEl = $('world'); worldEl.hidden = false;
  const fill = $('bar-fill'), status = $('loading-status');
  try {
    const { startWorld } = await loadWorld();
    const world = await startWorld({
      container: worldEl, settings, audio,
      onProgress: (p, label) => { fill.style.width = (p * 100).toFixed(1) + '%'; if (label) status.textContent = label; },
      onExit: () => { location.reload(); },
    });
    world.player.input.enabled = true;
    status.textContent = isTouch ? 'Everything is ready.' : 'Everything is ready. Your mouse will look around.';
    const begin = $('begin'); begin.hidden = false; begin.focus();
    await new Promise((r) => begin.addEventListener('click', r, { once: true }));
    world.player.input.requestLock();
    audio?.resume();
    loading.classList.remove('show');
  } catch (e) {
    console.error(e);
    status.textContent = 'Something went wrong while loading: ' + (e.message || e) + '. Try a lower graphics setting.';
  }
}
$('enter').onclick = enter;
try { if (sessionStorage.getItem('se-autoenter')) { sessionStorage.removeItem('se-autoenter'); $('enter').classList.add('pulse'); $('enter').scrollIntoView(); } } catch (e) { /* ignore */ }
