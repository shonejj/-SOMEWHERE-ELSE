// Seeded random + periodic gradient noise. Written for this project (MIT).

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PERM = new Uint8Array(512);
const GX = new Float32Array(256);
const GY = new Float32Array(256);
(function init() {
  const r = mulberry32(1337);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
  for (let i = 0; i < 256; i++) { const a = r() * Math.PI * 2; GX[i] = Math.cos(a); GY[i] = Math.sin(a); }
})();

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const mod = (a, n) => ((a % n) + n) % n;

/** Gradient noise in roughly [-1,1]; tiles with period (px, py) in lattice units. */
export function noise2(x, y, px = 256, py = 256) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const x0 = mod(xi, px), x1 = mod(xi + 1, px), y0 = mod(yi, py), y1 = mod(yi + 1, py);
  const h00 = PERM[(PERM[x0 & 255] + y0) & 511] , h10 = PERM[(PERM[x1 & 255] + y0) & 511];
  const h01 = PERM[(PERM[x0 & 255] + y1) & 511], h11 = PERM[(PERM[x1 & 255] + y1) & 511];
  const d00 = GX[h00] * xf + GY[h00] * yf;
  const d10 = GX[h10] * (xf - 1) + GY[h10] * yf;
  const d01 = GX[h01] * xf + GY[h01] * (yf - 1);
  const d11 = GX[h11] * (xf - 1) + GY[h11] * (yf - 1);
  const u = fade(xf), v = fade(yf);
  const a = d00 + (d10 - d00) * u, b = d01 + (d11 - d01) * u;
  return (a + (b - a) * v) * 1.414;
}

/** Fractal noise. With period set, tiles over [0, period) at base frequency 1. */
export function fbm2(x, y, oct = 4, px = 256, py = px, lac = 2, gain = 0.5) {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) {
    s += amp * noise2(x * f, y * f, px * f, py * f);
    norm += amp; amp *= gain; f *= lac;
  }
  return s / norm;
}

/** Cellular (Worley) noise, periodic. Returns [f1, f2, cellId]. */
export function worley2(x, y, period) {
  const xi = Math.floor(x), yi = Math.floor(y);
  let f1 = 9, f2 = 9, id = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = mod(xi + i, period), cy = mod(yi + j, period);
    const h = PERM[(PERM[cx & 255] + cy) & 511];
    const h2 = PERM[(h + 71) & 511];
    const px = xi + i + h / 255, py = yi + j + h2 / 255;
    const dx = px - x, dy = py - y, d = Math.sqrt(dx * dx + dy * dy);
    if (d < f1) { f2 = f1; f1 = d; id = h * 256 + h2; } else if (d < f2) f2 = d;
  }
  return [f1, f2, id];
}

export const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
