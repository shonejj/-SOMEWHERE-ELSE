// Persistent user settings + quality presets.
export const isTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || navigator.maxTouchPoints > 0) && matchMedia('(pointer: coarse)').matches;

export const PRESETS = {
  low:    { name: 'Low',    pixelRatio: 0.75, maxPixelRatio: 1,    shadows: false, shadowSize: 512,  textureSize: 512,  trees: 380,  grass: 2600,  ferns: 250, waterReflections: 0,    rain: 3000,  terrainSeg: 160, antialias: false },
  medium: { name: 'Medium', pixelRatio: 1,    maxPixelRatio: 1.25, shadows: true,  shadowSize: 1024, textureSize: 512,  trees: 650,  grass: 6000,  ferns: 500, waterReflections: 0,    rain: 6000,  terrainSeg: 220, antialias: false },
  high:   { name: 'High',   pixelRatio: 1,    maxPixelRatio: 1.5,  shadows: true,  shadowSize: 2048, textureSize: 1024, trees: 1000, grass: 11000, ferns: 800, waterReflections: 512,  rain: 10000, terrainSeg: 300, antialias: true },
  ultra:  { name: 'Ultra',  pixelRatio: 1,    maxPixelRatio: 2,    shadows: true,  shadowSize: 4096, textureSize: 1024, trees: 1400, grass: 18000, ferns: 1100, waterReflections: 1024, rain: 14000, terrainSeg: 360, antialias: true },
};

const KEY = 'somewhere-else-settings-v1';
const defaults = () => ({
  quality: isTouch ? 'low' : 'high',
  volume: 0.8,
  sensitivity: 1,
  invertY: false,
  fov: 70,
  weather: 'auto',   // auto | clear | cloudy | rain | storm | fog
  timeFlow: true,
  startHour: 17.2,
  headBob: true,
});

export function loadSettings() {
  let s = defaults();
  try { const raw = localStorage.getItem(KEY); if (raw) s = { ...s, ...JSON.parse(raw) }; } catch (e) { /* storage unavailable */ }
  if (!PRESETS[s.quality]) s.quality = defaults().quality;
  return s;
}

export function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
}
