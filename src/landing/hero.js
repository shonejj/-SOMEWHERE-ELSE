// Cinematic landing backdrop: a raw WebGL fragment shader painting a rainy
// forest lake at dusk with a lit cabin. Tiny, fast, no assets.
const frag = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uFlash;
float h1(float n){ return fract(sin(n) * 43758.5453); }
float h2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.02 + 3.1; a *= 0.5; } return s; }
float pines(float x, float seed, float scale, float jag){
  x *= scale; float id = floor(x); float h = 0.0;
  for (int i = -1; i <= 1; i++) {
    float c = id + float(i); float r = h1(c * 13.17 + seed);
    float cx = c + 0.5 + (r - 0.5) * 0.7;
    float th = 0.55 + r * 0.9; float w = 0.32 + 0.18 * h1(c * 7.31 + seed);
    float d = abs(x - cx);
    float t = th * (1.0 - d / w);
    float tier = fract((th - t) * 7.0); t -= tier * 0.06 * jag * (1.0 - d / w);
    h = max(h, t);
  }
  return h / scale;
}
const float HOR = 0.40;
vec3 skyCol(vec2 p, float aspect){
  float y = p.y;
  vec3 top = vec3(0.035, 0.05, 0.085), mid = vec3(0.17, 0.18, 0.23), low = vec3(0.42, 0.33, 0.3);
  vec3 c = mix(low, mid, smoothstep(HOR, HOR + 0.22, y));
  c = mix(c, top, smoothstep(HOR + 0.18, 1.0, y));
  float glow = exp(-pow((p.x - aspect * 0.32) * 1.6, 2.0) - pow((y - HOR) * 6.0, 2.0));
  c += vec3(0.5, 0.28, 0.16) * glow * 0.55;
  float cl = fbm(vec2(p.x * 1.6 + uTime * 0.012, y * 4.0 - uTime * 0.004));
  c = mix(c, vec3(0.13, 0.13, 0.16) + glow * 0.1, smoothstep(0.42, 0.75, cl) * smoothstep(HOR, HOR + 0.15, y) * 0.85);
  c += vec3(0.6, 0.65, 0.8) * uFlash * smoothstep(0.3, 0.8, cl + 0.3);
  return c;
}
vec3 scene(vec2 p, float aspect, vec2 par, out float isCabin){
  isCabin = 0.0;
  vec3 c = skyCol(p, aspect);
  vec3 fogc = vec3(0.24, 0.23, 0.26) + vec3(0.18, 0.1, 0.06) * exp(-pow((p.x - aspect * 0.32) * 1.4, 2.0));
  // distant hills
  float hill = HOR + 0.06 + fbm(vec2(p.x * 1.2 + par.x * 0.2, 1.0)) * 0.1;
  if (p.y < hill) c = mix(vec3(0.16, 0.16, 0.2), fogc, 0.55);
  // far pines
  float x1 = p.x + par.x * 0.4;
  if (p.y < HOR + 0.035 + pines(x1, 1.0, 26.0, 1.0)) c = mix(vec3(0.08, 0.1, 0.11), fogc, 0.62);
  // cabin on the far shore
  vec2 cb = vec2(aspect * 0.63 + par.x * 0.6, HOR + 0.005);
  vec2 q = p - cb;
  float body = step(abs(q.x), 0.06) * step(0.0, q.y) * step(q.y, 0.04);
  float roof = step(0.0, q.y - 0.04) * step(q.y - 0.04, 0.032 - abs(q.x) * 0.5) * step(abs(q.x), 0.072);
  float chim = step(abs(q.x + 0.03), 0.006) * step(0.05, q.y) * step(q.y, 0.085);
  if (body + roof + chim > 0.0) { c = vec3(0.045, 0.045, 0.05); isCabin = 1.0; }
  float win = step(abs(q.x + 0.025), 0.012) * step(abs(q.y - 0.018), 0.01) + step(abs(q.x - 0.025), 0.012) * step(abs(q.y - 0.018), 0.01);
  float flick = 0.85 + 0.15 * sin(uTime * 7.0) * sin(uTime * 3.1);
  if (win > 0.0) c = vec3(1.0, 0.62, 0.28) * 1.4 * flick;
  c += vec3(1.0, 0.55, 0.22) * exp(-length(q - vec2(0.0, 0.018)) * 38.0) * 0.5 * flick;
  // smoke
  float sm = fbm(vec2(q.x * 12.0 - uTime * 0.05, q.y * 6.0 - uTime * 0.12));
  c = mix(c, vec3(0.32, 0.31, 0.33), smoothstep(0.5, 0.8, sm) * smoothstep(0.08, 0.12, q.y) * smoothstep(0.35, 0.1, q.y) * exp(-abs(q.x + 0.03 - q.y * 0.3) * 30.0) * 0.6);
  // mid pines
  float x2 = p.x + par.x * 0.8;
  float m = HOR + 0.01 + pines(x2, 7.0, 11.0, 1.0) * (0.75 + 0.5 * smoothstep(0.0, 0.5, abs(p.x - aspect * 0.63) ));
  if (p.y < m && abs(p.x - cb.x) > 0.11) { c = mix(vec3(0.04, 0.055, 0.06), fogc, 0.35); isCabin = 0.0; }
  // drifting mist
  float mist = fbm(vec2(p.x * 2.0 - uTime * 0.02, p.y * 9.0));
  c = mix(c, fogc, smoothstep(0.35, 0.8, mist) * exp(-abs(p.y - HOR - 0.03) * 18.0) * 0.6);
  return c;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y; float aspect = uRes.x / uRes.y;
  vec2 par = (uMouse - 0.5) * vec2(0.04, 0.02);
  vec2 p = uv + vec2(0.0, par.y);
  vec3 col; float cab;
  if (p.y > HOR) col = scene(p, aspect, par, cab);
  else {
    float d = HOR - p.y;
    float wave = (fbm(vec2(p.x * 30.0, d * 90.0 - uTime * 0.6)) - 0.5) * 0.012 * (0.4 + d * 4.0);
    vec2 rp = vec2(p.x + wave, HOR + d * 1.0 + wave * 0.5);
    col = scene(rp, aspect, par, cab) * 0.55;
    col = mix(col, vec3(0.04, 0.05, 0.06), smoothstep(0.0, 0.4, d) * 0.6);
    // rain rings on the water
    vec2 g = vec2(p.x * 22.0, d * 160.0 / (0.25 + d * 6.0));
    vec2 id = floor(g); vec2 f = fract(g) - 0.5;
    float r = h2(id); float t = fract(uTime * 0.7 + r * 10.0);
    float ring = smoothstep(0.06, 0.0, abs(length(f * vec2(1.0, 2.2)) - t * 0.45)) * (1.0 - t) * step(0.6, r);
    col += vec3(0.5, 0.52, 0.58) * ring * 0.18 * smoothstep(0.0, 0.05, d);
  }
  // near pines framing the edges
  float x3 = uv.x + par.x * 1.6;
  float edge = smoothstep(aspect * 0.18, 0.0, uv.x) + smoothstep(aspect * 0.8, aspect, uv.x);
  float n3 = 0.05 + pines(x3, 21.0, 3.2, 1.3) * 1.7 * edge;
  if (uv.y < n3 + 0.05 * edge && edge > 0.05 && uv.y > 0.0) col = vec3(0.012, 0.016, 0.02);
  // rain streaks in three depths
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sc = 60.0 + fi * 50.0;
    vec2 rp = vec2(uv.x * sc + uv.y * sc * 0.12, uv.y * sc * 0.08 + uTime * (3.0 + fi * 1.5));
    vec2 id = floor(rp); vec2 f = fract(rp);
    float r = h2(id + fi * 17.0);
    float s = step(0.86, r) * smoothstep(0.08, 0.0, abs(f.x - 0.5)) * smoothstep(0.0, 0.2, f.y) * smoothstep(1.0, 0.6, f.y);
    col += vec3(0.6, 0.65, 0.72) * s * (0.05 + 0.04 * (2.0 - fi));
  }
  col += vec3(0.5, 0.55, 0.7) * uFlash * 0.12;
  vec2 v = gl_FragCoord.xy / uRes - 0.5; col *= 1.0 - dot(v, v) * 0.9;
  col += (h2(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.025;
  col = pow(max(col, 0.0), vec3(0.95));
  gl_FragColor = vec4(col, 1.0);
}`;

export function startHero(canvas, onThunder) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { canvas.style.background = 'radial-gradient(ellipse at 60% 55%, #3a2a22, #0b0f14 70%)'; return { stop() {} }; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }'));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uFlash = U('uFlash');
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight; });
  let scale = matchMedia('(pointer: coarse)').matches ? 0.5 : 0.7;
  const resize = () => { const dpr = Math.min(devicePixelRatio, 2) * scale; canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; gl.viewport(0, 0, canvas.width, canvas.height); };
  resize(); addEventListener('resize', resize);
  let raf, running = true, flash = 0, nextFlash = 9 + Math.random() * 10, t0 = performance.now(), last = t0, slow = 0;
  const loop = (now) => {
    if (!running) return;
    const dt = (now - last) / 1000; last = now;
    if (dt > 0.05) { slow++; if (slow > 30 && scale > 0.35) { scale -= 0.1; resize(); slow = 0; } }
    const t = (now - t0) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
    if (t > nextFlash) { nextFlash = t + 12 + Math.random() * 18; flash = 1; onThunder?.(); }
    flash = Math.max(0, flash - dt * 3.5) * (Math.random() < 0.08 ? 0.3 : 1);
    gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform1f(uTime, t); gl.uniform2f(uMouse, mouse.x, mouse.y); gl.uniform1f(uFlash, flash);
    if (scrollY < innerHeight * 1.5 || t < 1) gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return { stop() { running = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); } };
}
