// Procedural texture generation. Every texture in SOMEWHERE ELSE is generated
// at runtime by this file — no external image assets are used.
import * as THREE from 'three';
import { fbm2, noise2, worley2, mulberry32, smoothstep, clamp } from './noise.js';

const nextFrame = () => new Promise((r) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(() => r()) : setTimeout(r, 0)));

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function toTexture(c, srgb = true, repeat = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

/**
 * Generic generator: fn(u, v, out) writes out.r/g/b (0..1) and out.h (height 0..1).
 * Produces an sRGB albedo map and a tangent-space normal map derived from height.
 */
function generate(size, fn, normalStrength = 2.0) {
  const ca = canvas(size), cn = canvas(size);
  const ia = ca.getContext('2d').createImageData(size, size);
  const heights = new Float32Array(size * size);
  const out = { r: 0, g: 0, b: 0, h: 0.5 };
  const da = ia.data;
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      out.h = 0.5;
      fn(u, v, out);
      const i = y * size + x;
      heights[i] = out.h;
      da[i * 4] = clamp(out.r, 0, 1) * 255;
      da[i * 4 + 1] = clamp(out.g, 0, 1) * 255;
      da[i * 4 + 2] = clamp(out.b, 0, 1) * 255;
      da[i * 4 + 3] = 255;
    }
  }
  ca.getContext('2d').putImageData(ia, 0, 0);
  const inn = cn.getContext('2d').createImageData(size, size);
  const dn = inn.data;
  const s = normalStrength * size / 256;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xl = heights[y * size + ((x - 1 + size) % size)], xr = heights[y * size + ((x + 1) % size)];
      const yu = heights[((y - 1 + size) % size) * size + x], yd = heights[((y + 1) % size) * size + x];
      let nx = (xl - xr) * s, ny = (yd - yu) * s, nz = 1;
      const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      const i = (y * size + x) * 4;
      dn[i] = (nx * 0.5 + 0.5) * 255; dn[i + 1] = (ny * 0.5 + 0.5) * 255; dn[i + 2] = (nz * 0.5 + 0.5) * 255; dn[i + 3] = 255;
    }
  }
  cn.getContext('2d').putImageData(inn, 0, 0);
  return { map: toTexture(ca, true), normalMap: toTexture(cn, false) };
}

const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------------------------------------------------------- materials --

export function planks(size, base = [0.52, 0.34, 0.2], rows = 6) {
  return generate(size, (u, v, o) => {
    const row = Math.floor(v * rows), rv = v * rows - row;
    const off = hash(row * 7.13) ;
    const segLen = 0.5 + hash(row * 3.1) * 0.5;
    const su = (u + off) / segLen;
    const seg = Math.floor(su), fu = su - seg;
    const id = row * 31 + (((seg % 9) + 9) % 9);
    const tone = 0.78 + hash(id) * 0.4;
    const grain = fbm2(u * 4, v * 96, 4, 4, 96);
    const rings = Math.sin(v * rows * 18 + fbm2(u * 8, v * 8, 3, 8, 8) * 9 + hash(id) * 20) * 0.5 + 0.5;
    let k = tone * (0.86 + grain * 0.25 + rings * 0.12);
    const knot = worley2(u * 6, v * rows * 1.0, 6)[0];
    const kn = smoothstep(0.12, 0.0, knot) * (hash(id + 5) > 0.6 ? 1 : 0);
    k *= 1 - kn * 0.5;
    const seamV = smoothstep(0.0, 0.035, rv) * smoothstep(1.0, 0.965, rv);
    const seamU = Math.min(smoothstep(0, 0.008, fu * segLen), smoothstep(segLen, segLen - 0.008, fu * segLen));
    const seam = seamV * seamU;
    const nail = Math.min(Math.hypot((fu * segLen - 0.03) * 60, (rv - 0.5) * 6), Math.hypot((fu * segLen - (segLen - 0.03)) * 60, (rv - 0.5) * 6));
    const nailMask = smoothstep(0.6, 0.3, nail) * 0.6;
    k *= 0.35 + 0.65 * seam;
    o.r = base[0] * k * (1 - nailMask * 0.7); o.g = base[1] * k * (1 - nailMask * 0.7); o.b = base[2] * k * (1 - nailMask * 0.6);
    o.h = seam * (0.9 + grain * 0.08) - nailMask * 0.1;
  }, 3.0);
}

export function logWood(size) {
  // grain runs along v (the cylinder axis)
  return generate(size, (u, v, o) => {
    const grain = fbm2(u * 24, v * 2, 5, 24, 2);
    const streak = fbm2(u * 60, v * 1, 3, 60, 1);
    const check = smoothstep(0.035, 0.0, Math.abs(noise2(u * 10, v * 1.5, 10, 2) )) * smoothstep(0.2, 0.6, fbm2(u * 3, v * 3, 2, 3, 3) + 0.4);
    const knotW = worley2(u * 5, v * 3, 5);
    const knot = smoothstep(0.1, 0.0, knotW[0]) * (hash(knotW[2]) > 0.55 ? 1 : 0);
    const t = 0.82 + grain * 0.28 + streak * 0.12;
    o.r = 0.52 * t; o.g = 0.37 * t; o.b = 0.25 * t;
    const dark = check * 0.7 + knot * 0.55;
    o.r *= 1 - dark; o.g *= 1 - dark; o.b *= 1 - dark * 0.9;
    o.h = 0.6 + grain * 0.15 + streak * 0.1 - check * 0.5 - knot * 0.15;
  }, 4.0);
}

export function skin(size) {
  // pores, fine creases and subtle colour variation
  return generate(size, (u, v, o) => {
    const n = fbm2(u * 8, v * 8, 4, 8, 8);
    const pores = worley2(u * 90, v * 90, 90)[0];
    const crease = Math.abs(noise2(u * 6, v * 40, 6, 40));
    const k = 0.94 + n * 0.08;
    o.r = 0.86 * k; o.g = 0.66 * k - n * 0.02; o.b = 0.56 * k;
    o.h = 0.5 + n * 0.08 - smoothstep(0.12, 0.0, pores) * 0.18 - smoothstep(0.05, 0.0, crease) * 0.12;
  }, 1.6);
}

export function knit(size, base = [0.2, 0.27, 0.22]) {
  // stockinette "V" stitches
  return generate(size, (u, v, o) => {
    const cols = 24, rows = 32;
    const cx = u * cols, cy = v * rows;
    const fx = cx - Math.floor(cx), fy = cy - Math.floor(cy);
    const side = fx < 0.5 ? fx * 2 : (1 - fx) * 2;
    const loop = Math.sin(Math.min(1, Math.max(0, (side * 1.1 + (fx < 0.5 ? fy : 1 - fy) * 0.5) )) * Math.PI);
    const n = fbm2(u * 30, v * 30, 2, 30, 30);
    const k = 0.62 + loop * 0.4 + n * 0.08;
    o.r = base[0] * k; o.g = base[1] * k; o.b = base[2] * k;
    o.h = loop * 0.8 + n * 0.1;
  }, 3.0);
}

export function denim(size) {
  return generate(size, (u, v, o) => {
    const tw = Math.sin((u * 160 + v * 160) * Math.PI) * 0.5 + 0.5; // 2/1 twill diagonal
    const n = fbm2(u * 12, v * 40, 3, 12, 40);
    const fade = fbm2(u * 3, v * 3, 3, 3, 3) * 0.5 + 0.5;
    const slub = fbm2(u * 200, v * 8, 2, 200, 8);
    const k = 0.72 + tw * 0.18 + n * 0.12 + fade * 0.2 + slub * 0.08;
    o.r = 0.17 * k + fade * 0.05; o.g = 0.24 * k + fade * 0.05; o.b = 0.38 * k + fade * 0.05;
    o.h = tw * 0.6 + n * 0.2;
  }, 1.4);
}

export function leather(size) {
  return generate(size, (u, v, o) => {
    const [f1, f2] = worley2(u * 40, v * 40, 40);
    const grain = smoothstep(0.0, 0.12, f2 - f1);
    const n = fbm2(u * 6, v * 6, 4, 6, 6);
    const k = 0.75 + n * 0.25 + grain * 0.1;
    o.r = 0.32 * k; o.g = 0.2 * k; o.b = 0.12 * k;
    o.h = grain * 0.4 + n * 0.3;
  }, 2.0);
}

export function woodGrain(size, base = [0.55, 0.38, 0.24]) {
  // continuous furniture-grade grain running along v
  return generate(size, (u, v, o) => {
    const warp = fbm2(u * 3, v * 1, 3, 3, 1) * 0.6;
    const rings = Math.sin((u * 18 + warp * 3) * Math.PI) * 0.5 + 0.5;
    const fine = fbm2(u * 90, v * 3, 3, 90, 3);
    const fig = fbm2(u * 6, v * 4, 4, 6, 4);
    const k = 0.78 + rings * 0.16 + fine * 0.14 + fig * 0.12;
    o.r = base[0] * k; o.g = base[1] * k; o.b = base[2] * k;
    o.h = 0.5 + fine * 0.1 + rings * 0.05;
  }, 1.2);
}

export function bark(size, light = false) {
  return generate(size, (u, v, o) => {
    if (light) { // birch
      const n = fbm2(u * 6, v * 6, 4, 6, 6);
      const lent = smoothstep(0.55, 0.75, fbm2(u * 3, v * 30, 3, 3, 30) * 0.5 + 0.5 + n * 0.3);
      const base = 0.86 + n * 0.08;
      o.r = base * (1 - lent * 0.8); o.g = base * 0.97 * (1 - lent * 0.8); o.b = base * 0.92 * (1 - lent * 0.82);
      o.h = 0.5 + n * 0.1 - lent * 0.3;
      return;
    }
    const f = 1 - Math.abs(fbm2(u * 8, v * 1.5, 5, 8, 2));
    const ridge = Math.pow(f, 3);
    const n = fbm2(u * 20, v * 10, 3, 20, 10);
    const lichen = smoothstep(0.35, 0.6, fbm2(u * 4 + 9, v * 4, 4, 4, 4) * 0.5 + 0.5) * 0.5;
    const t = 0.25 + ridge * 0.55 + n * 0.08;
    o.r = 0.36 * t + lichen * 0.12; o.g = 0.27 * t + lichen * 0.16; o.b = 0.2 * t + lichen * 0.07;
    o.h = ridge * 0.9 + n * 0.1;
  }, 6.0);
}

export function stone(size, scale = 5, warm = 0) {
  return generate(size, (u, v, o) => {
    const wu = u + fbm2(u * 6, v * 6, 2, 6, 6) * 0.02, wv = v + fbm2(u * 6 + 5, v * 6, 2, 6, 6) * 0.02;
    const [f1, f2, id] = worley2(wu * scale, wv * scale, scale);
    const edge = f2 - f1;
    const mortar = smoothstep(0.03, 0.09, edge);
    const n = fbm2(u * 32, v * 32, 4, 32, 32);
    const h = hash(id);
    const tone = 0.34 + h * 0.28 + n * 0.1;
    const tint = hash(id + 3);
    o.r = tone * (0.95 + tint * 0.1 + warm * 0.12); o.g = tone * (0.93 + warm * 0.04); o.b = tone * (0.9 - warm * 0.08 + (1 - tint) * 0.06);
    const m = 1 - mortar;
    o.r = o.r * mortar + 0.45 * m; o.g = o.g * mortar + 0.43 * m; o.b = o.b * mortar + 0.4 * m;
    o.h = mortar * (0.6 + Math.sqrt(Math.min(edge * 3, 1)) * 0.4) + n * 0.06;
  }, 5.0);
}

export function grassGround(size) {
  return generate(size, (u, v, o) => {
    const n1 = fbm2(u * 4, v * 4, 4, 4, 4);
    const n2 = fbm2(u * 48, v * 48, 3, 48, 48);
    const blades = noise2(u * 220, v * 40, 220, 40) * 0.5 + noise2(u * 40, v * 220, 40, 220) * 0.5;
    const dry = smoothstep(-0.1, 0.4, n1);
    const r = 0.17 + dry * 0.14, g = 0.25 + dry * 0.07, b = 0.08 + dry * 0.03;
    const k = 0.8 + n2 * 0.25 + blades * 0.18;
    o.r = r * k; o.g = g * k; o.b = b * k;
    o.h = 0.5 + blades * 0.25 + n2 * 0.2;
  }, 2.5);
}

export function dirt(size) {
  return generate(size, (u, v, o) => {
    const n1 = fbm2(u * 6, v * 6, 5, 6, 6);
    const [f1, , id] = worley2(u * 28, v * 28, 28);
    const pebble = smoothstep(0.32, 0.18, f1) * (hash(id) > 0.55 ? 1 : 0);
    const pt = 0.5 + hash(id + 1) * 0.3;
    const k = 0.75 + n1 * 0.3;
    let r = 0.34 * k, g = 0.25 * k, b = 0.17 * k;
    r = r * (1 - pebble) + 0.42 * pt * pebble; g = g * (1 - pebble) + 0.4 * pt * pebble; b = b * (1 - pebble) + 0.37 * pt * pebble;
    o.r = r; o.g = g; o.b = b;
    o.h = 0.4 + n1 * 0.2 + pebble * 0.35 * (1 - f1 * 3);
  }, 3.5);
}

export function shingles(size) {
  const rows = 10;
  return generate(size, (u, v, o) => {
    const row = Math.floor(v * rows), rv = v * rows - row;
    const cols = 8;
    const su = u * cols + (row % 2) * 0.5 + hash(row) * 0.3;
    const col = Math.floor(su), fu = su - col;
    const id = row * 17 + (((col % cols) + cols) % cols);
    const tone = 0.6 + hash(id) * 0.5;
    const grain = fbm2(u * 64, v * 6, 3, 64, 6);
    const gap = smoothstep(0, 0.04, fu) * smoothstep(1, 0.96, fu);
    const shade = 0.55 + 0.45 * rv; // overlapping shingle casts shade near top
    const moss = smoothstep(0.25, 0.6, fbm2(u * 5, v * 5, 4, 5, 5) * 0.5 + 0.5 - rv * 0.2) * 0.8;
    let r = 0.36 * tone * (0.85 + grain * 0.3), g = 0.25 * tone * (0.85 + grain * 0.3), b = 0.17 * tone;
    r = r * (1 - moss) + 0.22 * moss; g = g * (1 - moss) + 0.27 * moss; b = b * (1 - moss) + 0.12 * moss;
    const k = gap * shade;
    o.r = r * k; o.g = g * k; o.b = b * k;
    o.h = rv * 0.7 * gap + grain * 0.05;
  }, 4.0);
}

export function fabric(size, color, pattern = 'weave') {
  const [cr, cg, cb] = color;
  return generate(size, (u, v, o) => {
    const wx = Math.sin(u * size * Math.PI * 0.5), wy = Math.sin(v * size * Math.PI * 0.5);
    const weave = (wx * wy) * 0.5 + 0.5;
    const n = fbm2(u * 16, v * 16, 3, 16, 16);
    let k = 0.8 + weave * 0.15 + n * 0.1;
    if (pattern === 'plaid') {
      const a = (Math.sin(u * Math.PI * 16) > 0.6 ? 1 : 0) + (Math.sin(v * Math.PI * 16) > 0.6 ? 1 : 0);
      const thin = (Math.abs(Math.sin(u * Math.PI * 32)) < 0.08 ? 1 : 0) + (Math.abs(Math.sin(v * Math.PI * 32)) < 0.08 ? 1 : 0);
      k *= 1 - a * 0.22; k *= 1 + thin * 0.25;
    }
    o.r = cr * k; o.g = cg * k; o.b = cb * k;
    o.h = weave * 0.5 + n * 0.1;
  }, 1.5);
}

export function rug(size) {
  const pal = [[0.55, 0.12, 0.08], [0.85, 0.75, 0.58], [0.12, 0.16, 0.22], [0.75, 0.42, 0.12]];
  return generate(size, (u, v, o) => {
    const x = Math.abs(u - 0.5) * 2, y = Math.abs(v - 0.5) * 2;
    const border = Math.max(x, y);
    let c;
    if (border > 0.92) c = pal[2];
    else if (border > 0.86) c = pal[1];
    else if (border > 0.8) c = pal[0];
    else {
      const d = (x + y) * 4.0;
      const band = Math.floor(d * 2) % 4;
      const step = Math.floor((u * 12)) % 2 === Math.floor(v * 12) % 2;
      c = pal[(band + (step && d < 2 ? 1 : 0)) % 4];
      if (d > 5.2) c = pal[3];
    }
    const weave = (Math.sin(u * size * 1.5) * Math.sin(v * size * 1.5)) * 0.5 + 0.5;
    const n = fbm2(u * 20, v * 20, 3, 20, 20);
    const k = 0.78 + weave * 0.12 + n * 0.15;
    o.r = c[0] * k; o.g = c[1] * k; o.b = c[2] * k;
    o.h = weave * 0.6 + n * 0.2;
  }, 1.5);
}

export function quilt(size) {
  const pal = [[0.62, 0.2, 0.16], [0.86, 0.8, 0.66], [0.27, 0.38, 0.45], [0.55, 0.5, 0.26], [0.42, 0.24, 0.3]];
  return generate(size, (u, v, o) => {
    const n = 8;
    const cx = Math.floor(u * n), cy = Math.floor(v * n);
    const fx = u * n - cx, fy = v * n - cy;
    let c = pal[Math.floor(hash(cx * 13 + cy * 7) * pal.length)];
    if ((fx > fy) !== (fx > 1 - fy) && hash(cx + cy * 3) > 0.5) c = pal[(cx + cy) % pal.length];
    const stitch = (Math.min(fx, fy, 1 - fx, 1 - fy) < 0.03) ? 0.75 : 1;
    const puff = Math.sin(fx * Math.PI) * Math.sin(fy * Math.PI);
    const weave = (Math.sin(u * size * 1.4) * Math.sin(v * size * 1.4)) * 0.05;
    const k = (0.82 + puff * 0.18 + weave) * stitch;
    o.r = c[0] * k; o.g = c[1] * k; o.b = c[2] * k;
    o.h = puff * 0.8;
  }, 3.0);
}

/** Tileable water normal map from a sum of integer-frequency waves. */
export function waterNormals(size) {
  const rnd = mulberry32(42);
  const waves = [];
  for (let i = 0; i < 48; i++) {
    const k = 1 + Math.floor(rnd() * (i < 12 ? 4 : 18));
    const a = rnd() * Math.PI * 2;
    waves.push({ kx: Math.round(Math.cos(a) * k), ky: Math.round(Math.sin(a) * k), p: rnd() * 6.28, amp: 1 / (1 + k * 0.6) });
  }
  const c = canvas(size); const ctx = c.getContext('2d'); const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size * Math.PI * 2, v = y / size * Math.PI * 2;
    let dx = 0, dy = 0;
    for (const w of waves) { const c2 = Math.cos(w.kx * u + w.ky * v + w.p) * w.amp; dx += c2 * w.kx; dy += c2 * w.ky; }
    let nx = -dx * 0.04, ny = -dy * 0.04, nz = 1; const l = Math.hypot(nx, ny, nz);
    const i = (y * size + x) * 4;
    img.data[i] = (nx / l * 0.5 + 0.5) * 255; img.data[i + 1] = (ny / l * 0.5 + 0.5) * 255; img.data[i + 2] = (nz / l * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, false);
}

// ------------------------------------------------------- vegetation sprites --

export function pineBranch(size = 256) {
  const c = canvas(size); const g = c.getContext('2d');
  const rnd = mulberry32(7);
  g.clearRect(0, 0, size, size);
  g.lineCap = 'round';
  const stems = 5;
  for (let s = 0; s < stems; s++) {
    const x0 = size * 0.5, y0 = size;
    const ang = -Math.PI / 2 + (s - (stems - 1) / 2) * 0.33;
    const len = size * (0.65 + rnd() * 0.3) * (s === 2 ? 1.05 : 0.85);
    const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
    g.strokeStyle = 'rgb(70,52,36)'; g.lineWidth = size * 0.012;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    const n = 46;
    for (let i = 0; i < n; i++) {
      const t = 0.08 + (i / n) * 0.92;
      const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
      for (const side of [-1, 1]) {
        const na = ang + side * (0.9 + rnd() * 0.4) - 0.25 * side * t;
        const nl = size * (0.07 + rnd() * 0.04) * (1.1 - t * 0.5);
        const shade = 30 + Math.floor(rnd() * 40);
        g.strokeStyle = `rgb(${18 + shade * 0.3},${48 + shade},${26 + shade * 0.4})`;
        g.lineWidth = size * 0.007;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(na) * nl, py + Math.sin(na) * nl); g.stroke();
      }
    }
  }
  const t = toTexture(c, true, false);
  return t;
}

export function leafCluster(size = 256, hue = [70, 110, 40]) {
  const c = canvas(size); const g = c.getContext('2d');
  const rnd = mulberry32(11);
  for (let i = 0; i < 160; i++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * size * 0.42;
    const x = size / 2 + Math.cos(a) * r, y = size / 2 + Math.sin(a) * r;
    const l = size * (0.04 + rnd() * 0.03);
    const k = 0.6 + rnd() * 0.6;
    g.fillStyle = `rgb(${hue[0] * k | 0},${hue[1] * k | 0},${hue[2] * k | 0})`;
    g.save(); g.translate(x, y); g.rotate(rnd() * Math.PI * 2);
    g.beginPath(); g.ellipse(0, 0, l, l * 0.55, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(30,40,10,0.4)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-l, 0); g.lineTo(l, 0); g.stroke();
    g.restore();
  }
  return toTexture(c, true, false);
}

export function fernFrond(size = 256) {
  const c = canvas(size); const g = c.getContext('2d');
  const rnd = mulberry32(5);
  const x0 = size / 2;
  g.strokeStyle = 'rgb(60,90,30)'; g.lineWidth = size * 0.012;
  g.beginPath(); g.moveTo(x0, size); g.quadraticCurveTo(x0 + size * 0.05, size * 0.5, x0, 0); g.stroke();
  for (let i = 0; i < 26; i++) {
    const t = i / 26; const y = size * (1 - 0.05 - t * 0.92);
    const w = size * 0.42 * Math.sin((1 - t) * Math.PI * 0.9 + 0.15);
    for (const s of [-1, 1]) {
      const k = 0.75 + rnd() * 0.4;
      g.fillStyle = `rgb(${50 * k | 0},${105 * k | 0},${32 * k | 0})`;
      g.beginPath(); g.moveTo(x0, y);
      g.quadraticCurveTo(x0 + s * w * 0.5, y - size * 0.03, x0 + s * w, y - size * 0.05 + t * 4);
      g.quadraticCurveTo(x0 + s * w * 0.5, y + size * 0.012, x0, y + size * 0.012);
      g.fill();
    }
  }
  return toTexture(c, true, false);
}

export function grille(size = 128) {
  const c = canvas(size); const g = c.getContext('2d');
  g.fillStyle = '#4a3a2a'; g.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 4) { g.fillStyle = y % 8 ? '#2a2018' : '#5c4a36'; g.fillRect(0, y, size, 2); }
  return toTexture(c, true, true);
}

export function clockFace(size = 256) {
  const c = canvas(size); const g = c.getContext('2d');
  g.fillStyle = '#efe6d2'; g.beginPath(); g.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#2b2017'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${size * 0.11}px Georgia, serif`;
  const roman = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2 - Math.PI / 2;
    g.fillText(roman[i], size / 2 + Math.cos(a) * size * 0.37, size / 2 + Math.sin(a) * size * 0.37);
  }
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2; const r0 = size * (i % 5 ? 0.47 : 0.45);
    g.strokeStyle = '#2b2017'; g.lineWidth = i % 5 ? 1 : 2.5;
    g.beginPath(); g.moveTo(size / 2 + Math.cos(a) * r0, size / 2 + Math.sin(a) * r0); g.lineTo(size / 2 + Math.cos(a) * size * 0.49, size / 2 + Math.sin(a) * size * 0.49); g.stroke();
  }
  return toTexture(c, true, false);
}

export function bookSpines(size = 256) {
  const c = canvas(size, size / 2); const g = c.getContext('2d');
  const rnd = mulberry32(99);
  let x = 0;
  const cols = ['#5b1f1a', '#1f3a4a', '#3c4a22', '#6b4a1e', '#2a2a2a', '#7a6a4a', '#4a2a4a'];
  while (x < size) {
    const w = 6 + rnd() * 12; const h = size / 2 * (0.7 + rnd() * 0.3);
    g.fillStyle = cols[Math.floor(rnd() * cols.length)];
    g.fillRect(x, size / 2 - h, w - 1, h);
    g.fillStyle = 'rgba(220,190,120,0.6)'; g.fillRect(x + 1, size / 2 - h + 6, w - 3, 2); g.fillRect(x + 1, size / 2 - 10, w - 3, 2);
    x += w;
  }
  return toTexture(c, true, false);
}

/** Builds every texture used by the world, yielding between items for progress. */
export async function buildTextures(quality, onProgress) {
  const S = quality.textureSize; // 512 or 1024
  const half = Math.max(256, S / 2);
  const T = {};
  const jobs = [
    ['floor', () => planks(S, [0.46, 0.32, 0.22], 6)],
    ['boards', () => planks(half, [0.42, 0.3, 0.2], 8)],
    ['deck', () => planks(half, [0.46, 0.42, 0.37], 5)],
    ['grain', () => woodGrain(half)],
    ['skin', () => skin(256)],
    ['knit', () => knit(256)],
    ['denim', () => denim(256)],
    ['leather', () => leather(256)],
    ['logs', () => logWood(S)],
    ['bark', () => bark(half)],
    ['birch', () => bark(half, true)],
    ['stone', () => stone(S, 5, 0.3)],
    ['rock', () => stone(half, 2, 0)],
    ['grass', () => grassGround(S)],
    ['dirt', () => dirt(half)],
    ['shingles', () => shingles(S)],
    ['sofa', () => fabric(half, [0.36, 0.22, 0.14], 'weave')],
    ['wool', () => fabric(half, [0.55, 0.18, 0.12], 'plaid')],
    ['linen', () => fabric(half, [0.82, 0.79, 0.72], 'weave')],
    ['rug', () => rug(S)],
    ['quilt', () => quilt(half)],
  ];
  for (let i = 0; i < jobs.length; i++) {
    const [k, f] = jobs[i];
    T[k] = f();
    onProgress?.((i + 1) / (jobs.length + 6), k);
    await nextFrame();
  }
  T.water = waterNormals(256);
  T.pine = pineBranch(256);
  T.leaves = leafCluster(256);
  T.fern = fernFrond(256);
  T.grille = grille();
  T.clock = clockFace();
  T.books = bookSpines();
  onProgress?.(1, 'done');
  return T;
}
