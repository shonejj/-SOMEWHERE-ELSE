// Persistent user settings + quality presets.
const hasTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
const mobileUA = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle/i.test(navigator.userAgent);
// iPadOS reports itself as a Mac with touch points
const iPadOS = typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
export const isTouch = hasTouch && (mobileUA || iPadOS || matchMedia('(pointer: coarse)').matches || !matchMedia('(pointer: fine)').matches);

export const PRESETS = {
  // grassNear/grassFar: [clumps, radius, blades]
  low:    { key: 'low', name: 'Low',       pixelRatio: 0.8, maxPixelRatio: 1,    shadows: false, shadowSize: 512,  shadowEvery: 2, textureSize: 512,  trees: 900,  treeLOD: 45, grassNear: [5000, 11, 5], grassFar: [3500, 30, 5], ferns: 450,  waterReflections: 0,   rain: 2500,  terrainSeg: 160, antialias: false, bloom: false },
  medium: { key: 'medium', name: 'Medium', pixelRatio: 1,   maxPixelRatio: 1.25, shadows: true,  shadowSize: 1024, shadowEvery: 2, textureSize: 512,  trees: 1500, treeLOD: 60, grassNear: [9000, 13, 6], grassFar: [6000, 38, 6], ferns: 800,  waterReflections: 0,   rain: 5000,  terrainSeg: 220, antialias: false, bloom: false },
  high:   { key: 'high', name: 'High',     pixelRatio: 1,   maxPixelRatio: 1.5,  shadows: true,  shadowSize: 2048, shadowEvery: 2, textureSize: 1024, trees: 2200, treeLOD: 75, grassNear: [14000, 15, 7], grassFar: [9000, 46, 6], ferns: 1200, waterReflections: 512, rain: 8000,  terrainSeg: 300, antialias: true,  bloom: true },
  ultra:  { key: 'ultra', name: 'Ultra',   pixelRatio: 1,   maxPixelRatio: 2,    shadows: true,  shadowSize: 4096, shadowEvery: 1, textureSize: 1024, trees: 3000, treeLOD: 95, grassNear: [20000, 17, 7], grassFar: [14000, 55, 7], ferns: 1700, waterReflections: 1024, rain: 12000, terrainSeg: 360, antialias: true,  bloom: true },
};

/** Picks a sensible starting quality from the GPU the browser reports. */
export function detectQuality() {
  if (isTouch) return 'low';
  try {
    const gl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    const name = (ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl ? gl.getParameter(gl.RENDERER) : '') || '';
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    if (/RTX|GTX 1[0-9]{3}|GTX 9[6-9]0|Radeon RX|Radeon Pro|Apple M[1-9] (Pro|Max|Ultra)|Arc A/i.test(name)) return 'high';
    if (/SwiftShader|llvmpipe|Software/i.test(name)) return 'low';
    return 'medium';
  } catch (e) { return 'medium'; }
}

const KEY = 'somewhere-else-settings-v2';
const defaults = () => ({
  quality: detectQuality(),
  maxFps: isTouch ? 30 : 60,
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
