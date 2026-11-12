// Procedural, positional soundscape built entirely on the Web Audio API.
// Every sound (rain, wind, fire, birds, footsteps, doors, radio music…) is synthesised here.
import * as THREE from 'three';
import { mulberry32, clamp } from '../core/noise.js';

const rnd = mulberry32(77);
const R = () => rnd();

function noiseBuffer(ctx, seconds, type) {
  const n = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (type === 'white') d[i] = w;
      else if (type === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    }
    // crossfade ends for seamless looping
    const f = Math.floor(ctx.sampleRate * 0.05);
    for (let i = 0; i < f; i++) { const t = i / f; d[i] = d[i] * t + d[n - f + i] * (1 - t); }
  }
  return buf;
}

export class AudioEngine {
  constructor() {
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC({ latencyHint: 'interactive' });
    const ctx = this.ctx;
    this.master = ctx.createGain(); this.master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain(); this.sfx.connect(this.master);
    this.white = noiseBuffer(ctx, 3, 'white');
    this.pink = noiseBuffer(ctx, 4, 'pink');
    this.brown = noiseBuffer(ctx, 4, 'brown');
    this.listener = ctx.listener;
    this.hrtf = !(navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches);
    this.loops = {};
    this.beds();
    this.timers = { bird: 2, cricket: 0, owl: 20, frog: 5, creak: 15, fish: 10 };
    this.indoor = 0;
  }

  resume() { if (this.ctx.state !== 'running') this.ctx.resume(); }
  setVolume(v) { this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); }
  get now() { return this.ctx.currentTime; }

  src(buffer, loop = true, rate = 1) {
    const s = this.ctx.createBufferSource(); s.buffer = buffer; s.loop = loop; s.playbackRate.value = rate;
    s.loopStart = 0; s.loopEnd = buffer.duration;
    return s;
  }
  filter(type, freq, q = 0.7) { const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f; }
  gain(v = 0) { const g = this.ctx.createGain(); g.gain.value = v; return g; }
  panner(pos, ref = 2, rolloff = 1.2, max = 200) {
    const p = this.ctx.createPanner();
    p.panningModel = this.hrtf ? 'HRTF' : 'equalpower'; p.distanceModel = 'inverse';
    p.refDistance = ref; p.rolloffFactor = rolloff; p.maxDistance = max;
    if (pos) this.setPos(p, pos);
    return p;
  }
  setPos(p, v) {
    if (p.positionX) { p.positionX.value = v.x; p.positionY.value = v.y; p.positionZ.value = v.z; }
    else p.setPosition(v.x, v.y, v.z);
  }
  chain(...nodes) { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes[nodes.length - 1]; }

  // -------------------------------------------------------------- ambience --
  beds() {
    const L = this.loops;
    // outdoor rain: hiss + body
    const rainA = this.src(this.pink, true, 1.0), rainB = this.src(this.white, true, 0.9);
    const rf = this.filter('lowpass', 6000), rh = this.filter('highpass', 350);
    const rg = this.gain(0), rbg = this.gain(0.25);
    this.chain(rainA, rh, rf, rg, this.master);
    this.chain(rainB, this.filter('bandpass', 4200, 0.6), rbg, rf);
    rainA.start(); rainB.start();
    L.rain = { g: rg, lp: rf };
    // rain on the roof (heard indoors)
    const roof = this.src(this.brown, true, 1.6), roofDrops = this.src(this.white, true, 0.5);
    const rgf = this.filter('lowpass', 900), rog = this.gain(0);
    const am = this.gain(1);
    this.chain(roof, rgf, am, rog, this.master);
    this.chain(roofDrops, this.filter('bandpass', 1800, 2), this.gain(0.12), rgf);
    roof.start(); roofDrops.start();
    L.roof = { g: rog };
    // wind
    const wind = this.src(this.pink, true, 0.5);
    const wf = this.filter('bandpass', 500, 0.9), wg = this.gain(0);
    this.chain(wind, wf, wg, this.master); wind.start();
    L.wind = { g: wg, f: wf };
    // leaves rustle
    const rust = this.src(this.white, true, 1.0);
    const rsf = this.filter('highpass', 2500), rsg = this.gain(0);
    this.chain(rust, rsf, rsg, this.master); rust.start();
    L.rustle = { g: rsg };
    // crickets: amplitude-modulated high tone
    const cr = this.ctx.createOscillator(); cr.frequency.value = 4400; cr.type = 'sine';
    const crAm = this.gain(0), lfo = this.ctx.createOscillator(); lfo.frequency.value = 28;
    const lfoG = this.gain(0.5); lfo.connect(lfoG).connect(crAm.gain);
    const crG = this.gain(0);
    this.chain(cr, crAm, crG, this.master); cr.start(); lfo.start();
    const lfo2 = this.ctx.createOscillator(); lfo2.frequency.value = 0.9; const lfo2g = this.gain(0.5); lfo2.connect(lfo2g).connect(crG.gain); lfo2.start();
    L.crickets = { g: crG, base: 0 };
    // lake lapping (positional on the nearest shore point)
    const lap = this.src(this.brown, true, 1.0);
    const lapF = this.filter('lowpass', 500), lapAm = this.gain(0.5), lapG = this.gain(0);
    const lapP = this.panner(new THREE.Vector3(6, 0, 25), 4, 1.5);
    const lapLfo = this.ctx.createOscillator(); lapLfo.frequency.value = 0.35; const lapLfoG = this.gain(0.45); lapLfo.connect(lapLfoG).connect(lapAm.gain); lapLfo.start();
    this.chain(lap, lapF, lapAm, lapG, lapP, this.master); lap.start();
    L.lap = { g: lapG, p: lapP };
  }

  updateAmbience(dt, s) {
    // s: { rain, wind, night, indoor, openness, listenerPos, shorePos, daylight }
    const t = this.now, L = this.loops;
    const indoor = s.indoor;
    const muffle = indoor * (1 - s.openness * 0.7);
    L.rain.g.gain.setTargetAtTime(s.rain * 0.55 * (1 - muffle * 0.75), t, 0.3);
    L.rain.lp.frequency.setTargetAtTime(6000 - muffle * 5200, t, 0.3);
    L.roof.g.gain.setTargetAtTime(s.rain * indoor * 0.7, t, 0.3);
    L.wind.g.gain.setTargetAtTime((0.04 + s.wind * 0.3) * (1 - muffle * 0.7), t, 0.5);
    L.wind.f.frequency.setTargetAtTime(300 + s.wind * 600 + Math.sin(t * 0.3) * 150, t, 0.5);
    L.rustle.g.gain.setTargetAtTime(s.wind * 0.05 * (1 - muffle * 0.9) * (s.forest ?? 1), t, 0.4);
    L.crickets.g.gain.setTargetAtTime(s.night * (1 - s.rain) * 0.015 * (1 - muffle * 0.85), t, 1.5);
    L.lap.g.gain.setTargetAtTime((0.25 + s.wind * 0.3) * (1 - muffle * 0.8), t, 0.5);
    if (s.shorePos) this.setPos(L.lap.p, s.shorePos);

    // occasional creatures
    const T = this.timers;
    T.bird -= dt; T.owl -= dt; T.frog -= dt; T.creak -= dt;
    if (T.bird <= 0) {
      T.bird = 0.8 + R() * 4 * (1 + s.rain * 3);
      if (s.daylight > 0.3 && s.rain < 0.7 && s.trees) this.birdCall(s.trees(), 1 - muffle * 0.8, s.rain);
    }
    if (T.owl <= 0) { T.owl = 25 + R() * 40; if (s.night > 0.7 && s.rain < 0.5 && s.trees) this.owl(s.trees()); }
    if (T.frog <= 0) { T.frog = 3 + R() * 8; if (s.night > 0.5 && s.shorePos && s.rain < 0.8) this.frog(s.shorePos); }
    if (T.creak <= 0) { T.creak = 10 + R() * 25; if (s.wind > 0.5 && s.trees) this.treeCreak(s.trees()); }
  }

  // -------------------------------------------------------------- one-shots --
  env(g, t, a, peak, d) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }

  out(pos, ref = 2, roll = 1.2) { if (!pos) return this.sfx; const p = this.panner(pos, ref, roll); p.connect(this.sfx); return p; }

  noiseHit(pos, { buf = this.white, type = 'bandpass', f = 1000, q = 1, a = 0.002, d = 0.1, v = 0.5, rate = 1, ref = 2 } = {}) {
    const t = this.now, s = this.src(buf, false, rate), fl = this.filter(type, f, q), g = this.gain(0);
    s.loop = true;
    this.chain(s, fl, g, this.out(pos, ref));
    this.env(g, t, a, v, d);
    s.start(t, R() * 2); s.stop(t + a + d + 0.05);
    return { s, fl, g };
  }

  tone(pos, { f = 440, type = 'sine', a = 0.01, d = 0.3, v = 0.3, slide = 0, ref = 2, delay = 0 } = {}) {
    const t = this.now + delay, o = this.ctx.createOscillator(), g = this.gain(0);
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + a + d);
    this.chain(o, g, this.out(pos, ref));
    this.env(g, t, a, v, d);
    o.start(t); o.stop(t + a + d + 0.05);
    return o;
  }

  footstep(surface, pos, intensity = 1) {
    const v = 0.22 * intensity;
    switch (surface) {
      case 'wood':
        this.noiseHit(pos, { buf: this.brown, type: 'lowpass', f: 380, d: 0.12, v: v * 2.2 });
        this.noiseHit(pos, { type: 'bandpass', f: 2200 + R() * 800, q: 2, d: 0.03, v: v * 0.35 });
        if (R() < 0.12) this.creak(pos, 0.06);
        break;
      case 'water':
        this.noiseHit(pos, { type: 'bandpass', f: 900 + R() * 600, q: 0.8, a: 0.01, d: 0.25, v: v * 1.2 });
        this.noiseHit(pos, { buf: this.pink, type: 'highpass', f: 2500, a: 0.02, d: 0.18, v: v * 0.6 });
        break;
      case 'grass':
        this.noiseHit(pos, { type: 'highpass', f: 3000 + R() * 1500, a: 0.02, d: 0.12, v: v * 0.6 });
        this.noiseHit(pos, { buf: this.brown, type: 'lowpass', f: 200, d: 0.08, v: v * 0.8 });
        break;
      default: // dirt / mud
        this.noiseHit(pos, { type: 'bandpass', f: 1500 + R() * 700, q: 0.9, a: 0.004, d: 0.09, v: v * 0.9 });
        this.noiseHit(pos, { buf: this.brown, type: 'lowpass', f: 250, d: 0.07, v: v * 1.2 });
    }
  }

  creak(pos, v = 0.15, dur = 0.5, base = 180) {
    const t = this.now, o = this.ctx.createOscillator(), g = this.gain(0);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(base, t);
    for (let i = 1; i <= 6; i++) o.frequency.linearRampToValueAtTime(base * (0.8 + R() * 0.7), t + (dur * i) / 6);
    const bp = this.filter('bandpass', 900, 6), bp2 = this.filter('bandpass', 2300, 8);
    const am = this.gain(1); const tr = this.ctx.createOscillator(); tr.frequency.value = 30 + R() * 30; const trg = this.gain(0.7); tr.connect(trg).connect(am.gain);
    o.connect(bp); o.connect(bp2); bp.connect(am); bp2.connect(am); this.chain(am, g, this.out(pos, 2));
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.05); g.gain.setValueAtTime(v, t + dur - 0.1); g.gain.linearRampToValueAtTime(0, t + dur);
    o.start(t); tr.start(t); o.stop(t + dur + 0.05); tr.stop(t + dur + 0.05);
  }

  door(pos, opening) {
    this.creak(pos, 0.12, 0.7 + R() * 0.4, opening ? 160 : 220);
    if (!opening) setTimeout(() => this.thud(pos, 0.5), 600);
    else this.click(pos, 0.25);
  }
  thud(pos, v = 0.5) {
    this.noiseHit(pos, { buf: this.brown, type: 'lowpass', f: 220, d: 0.25, v });
    this.noiseHit(pos, { type: 'bandpass', f: 1200, q: 1.5, d: 0.04, v: v * 0.3 });
  }
  click(pos, v = 0.3) {
    this.noiseHit(pos, { type: 'highpass', f: 3000, d: 0.015, v });
    this.tone(pos, { f: 2400, type: 'square', d: 0.012, v: v * 0.08 });
  }
  slide(pos, opening) {
    this.noiseHit(pos, { buf: this.pink, type: 'bandpass', f: opening ? 700 : 900, q: 1.2, a: 0.05, d: 0.35, v: 0.25 });
    setTimeout(() => this.thud(pos, 0.2), 380);
  }
  windowLatch(pos) { this.click(pos, 0.35); this.creak(pos, 0.05, 0.3, 300); }
  impact(item, v) {
    const pos = item.mesh.position, vol = clamp(v / 5, 0.05, 0.7);
    const kind = item.sound;
    if (kind === 'ceramic') { this.noiseHit(pos, { type: 'highpass', f: 2500, d: 0.08, v: vol * 0.6 }); this.tone(pos, { f: 1800 + R() * 900, d: 0.25, v: vol * 0.15 }); this.tone(pos, { f: 3900 + R() * 500, d: 0.15, v: vol * 0.08 }); }
    else if (kind === 'metal') { [1, 2.76, 5.4].forEach((m, i) => this.tone(pos, { f: (500 + R() * 200) * m, d: 0.6 / (i + 1), v: vol * 0.15 / (i + 1) })); this.noiseHit(pos, { type: 'highpass', f: 4000, d: 0.02, v: vol * 0.3 }); }
    else if (kind === 'soft') this.noiseHit(pos, { buf: this.brown, type: 'lowpass', f: 300, d: 0.1, v: vol * 0.7 });
    else if (kind === 'stone') { this.noiseHit(pos, { type: 'bandpass', f: 1600, q: 1.5, d: 0.07, v: vol }); this.noiseHit(pos, { buf: this.brown, type: 'lowpass', f: 300, d: 0.08, v: vol }); }
    else if (kind === 'glass') { this.tone(pos, { f: 2600 + R() * 1000, d: 0.4, v: vol * 0.12 }); this.noiseHit(pos, { type: 'highpass', f: 5000, d: 0.03, v: vol * 0.3 }); }
    else { this.noiseHit(pos, { type: 'bandpass', f: 600 + R() * 400, q: 2, d: 0.09, v: vol * 0.9 }); this.noiseHit(pos, { buf: this.brown, type: 'lowpass', f: 250, d: 0.06, v: vol * 0.8 }); }
  }
  splash(pos, big = 1) {
    this.noiseHit(pos, { type: 'bandpass', f: 800, q: 0.7, a: 0.01, d: 0.4 * big, v: 0.4 * big, ref: 4 });
    this.noiseHit(pos, { buf: this.pink, type: 'highpass', f: 2000, a: 0.02, d: 0.6 * big, v: 0.25 * big, ref: 4 });
    for (let i = 0; i < 4; i++) this.tone(pos, { f: 600 + R() * 900, slide: 1.6, d: 0.05, v: 0.05, delay: 0.1 + R() * 0.4, ref: 4 });
  }
  thunder(distance) {
    const t = this.now, s = this.src(this.brown, true, 0.6 + R() * 0.2), f = this.filter('lowpass', 900 - distance * 600), g = this.gain(0);
    this.chain(s, f, g, this.master);
    const v = 0.9 - distance * 0.45;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.05 + distance * 0.3);
    for (let i = 0; i < 6; i++) g.gain.linearRampToValueAtTime(v * (0.3 + R() * 0.7), t + 0.5 + i * 0.6 + R() * 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, t + 6 + distance * 3);
    f.frequency.exponentialRampToValueAtTime(120, t + 6);
    s.start(t, R() * 3); s.stop(t + 9.5);
    if (distance < 0.5) this.noiseHit(null, { type: 'highpass', f: 1500, a: 0.001, d: 0.3, v: 0.4 });
  }
  birdCall(pos, vol = 1, rain = 0) {
    const kind = Math.floor(R() * 4), t0 = 0;
    const v = 0.07 * vol * (1 - rain * 0.6);
    if (kind === 0) { // warble
      const n = 3 + Math.floor(R() * 5), base = 2800 + R() * 1500;
      for (let i = 0; i < n; i++) this.tone(pos, { f: base * (0.85 + R() * 0.4), slide: 0.7 + R() * 0.8, d: 0.06 + R() * 0.06, v, delay: t0 + i * 0.11, ref: 6 });
    } else if (kind === 1) { // two-note whistle
      const f = 2200 + R() * 900;
      this.tone(pos, { f, slide: 1.02, d: 0.25, v, ref: 6 }); this.tone(pos, { f: f * 0.8, slide: 0.98, d: 0.3, v, delay: 0.35, ref: 6 });
    } else if (kind === 2) { // trill
      const f = 4200 + R() * 1000;
      for (let i = 0; i < 12; i++) this.tone(pos, { f: f * (i % 2 ? 1 : 0.9), d: 0.03, v: v * 0.8, delay: i * 0.045, ref: 6 });
    } else { // chickadee-ish
      const f = 3600 + R() * 400;
      this.tone(pos, { f, slide: 0.9, d: 0.15, v, ref: 6 });
      for (let i = 0; i < 3; i++) this.tone(pos, { f: f * 0.55, slide: 0.95, d: 0.1, v: v * 0.7, delay: 0.2 + i * 0.13, ref: 6 });
    }
  }
  owl(pos) {
    const f = 380 + R() * 40;
    [0, 0.5, 0.8, 1.6].forEach((d, i) => this.tone(pos, { f: i === 3 ? f * 0.92 : f, slide: 0.94, a: 0.05, d: i === 3 ? 0.6 : 0.25, v: 0.1, delay: d, ref: 10 }));
  }
  frog(pos) {
    const n = 2 + Math.floor(R() * 3), f = 120 + R() * 80;
    for (let i = 0; i < n; i++) {
      const t = this.now + i * 0.28, o = this.ctx.createOscillator(), g = this.gain(0), am = this.ctx.createOscillator(), amg = this.gain(0.5);
      o.type = 'sawtooth'; o.frequency.value = f; am.frequency.value = 40; am.connect(amg).connect(g.gain);
      const bp = this.filter('bandpass', f * 3, 3);
      this.chain(o, bp, g, this.out(pos, 5));
      this.env(g, t, 0.02, 0.12, 0.18);
      o.start(t); am.start(t); o.stop(t + 0.25); am.stop(t + 0.25);
    }
  }
  treeCreak(pos) { this.creak(pos, 0.08, 1.4 + R(), 90 + R() * 40); }
  chime(pos, wind) {
    const notes = [1046.5, 1174.7, 1396.9, 1568, 1760];
    const n = 1 + Math.floor(R() * 3 * wind);
    for (let i = 0; i < n; i++) {
      const f = notes[Math.floor(R() * notes.length)];
      this.tone(pos, { f, a: 0.002, d: 2.5, v: 0.05, delay: R() * 0.6, ref: 3 });
      this.tone(pos, { f: f * 2.76, a: 0.002, d: 0.8, v: 0.012, delay: 0, ref: 3 });
    }
  }
  /** Karplus–Strong guitar strum. */
  strum(pos) {
    const chords = [[82.4, 123.5, 164.8, 207.7, 246.9, 329.6], [110, 164.8, 220, 277.2, 329.6], [98, 123.5, 146.8, 196, 293.7, 392], [73.4, 110, 146.8, 220, 293.7, 370], [130.8, 164.8, 196, 261.6, 329.6]];
    const chord = chords[Math.floor(R() * chords.length)];
    const sr = this.ctx.sampleRate;
    chord.forEach((f, i) => {
      const len = Math.floor(sr * 2.5), buf = this.ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
      const p = Math.max(2, Math.round(sr / f));
      for (let k = 0; k < p; k++) d[k] = Math.random() * 2 - 1;
      for (let k = p; k < len; k++) d[k] = (d[k - p] + d[k - p + 1]) * 0.4985;
      const s = this.src(buf, false), g = this.gain(0.18), bp = this.filter('lowpass', 3500);
      this.chain(s, bp, g, this.out(pos, 2));
      s.start(this.now + i * 0.028);
    });
  }
  pickup(pos) { this.noiseHit(pos, { type: 'bandpass', f: 1400, q: 1, a: 0.01, d: 0.08, v: 0.12 }); }
  whoosh(v = 0.3) { this.noiseHit(null, { buf: this.pink, type: 'bandpass', f: 600, q: 0.8, a: 0.08, d: 0.25, v }); }
  match(pos) {
    this.noiseHit(pos, { type: 'highpass', f: 2500, a: 0.01, d: 0.25, v: 0.25 });
    this.noiseHit(pos, { buf: this.pink, type: 'bandpass', f: 500, a: 0.15, d: 0.6, v: 0.15 });
  }
  lightSwitch(pos) { this.click(pos, 0.5); this.thud(pos, 0.06); }

  // ------------------------------------------------------------ continuous --
  /** Crackling fire at a position. Returns a controller with set(level). */
  fire(pos) {
    const body = this.src(this.brown, true, 1), bf = this.filter('lowpass', 600), bg = this.gain(0);
    const p = this.panner(pos, 1.5, 1.4);
    this.chain(body, bf, bg, p, this.sfx); body.start();
    const hiss = this.src(this.pink, true, 1), hf = this.filter('highpass', 3500), hg = this.gain(0);
    this.chain(hiss, hf, hg, p); hiss.start();
    let level = 0;
    const self = this;
    const tick = () => {
      if (level > 0.05) {
        const n = 1 + Math.floor(R() * 3 * level);
        for (let i = 0; i < n; i++) {
          const t = self.now + R() * 0.12;
          const s = self.src(self.white, false), f = self.filter('bandpass', 1500 + R() * 4000, 2 + R() * 4), g = self.gain(0);
          self.chain(s, f, g, p);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime((0.2 + R() * 0.7) * level, t + 0.001); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.01 + R() * 0.05);
          s.start(t, R() * 2); s.stop(t + 0.08);
        }
        if (R() < 0.03 * level) self.noiseHit(pos, { buf: self.brown, type: 'lowpass', f: 300, d: 0.3, v: 0.25 * level });
      }
      setTimeout(tick, 60 + R() * 140);
    };
    tick();
    return { set: (l) => { level = l; bg.gain.setTargetAtTime(l * 0.35, self.now, 0.4); hg.gain.setTargetAtTime(l * 0.03, self.now, 0.4); }, panner: p };
  }

  /** Running water (faucet). */
  water(pos) {
    const s = this.src(this.white, true, 1), f = this.filter('bandpass', 2200, 0.5), g = this.gain(0);
    const p = this.panner(pos, 1, 1.5);
    const s2 = this.src(this.pink, true, 1.2), f2 = this.filter('lowpass', 800), g2 = this.gain(0.6);
    this.chain(s, f, g, p, this.sfx); this.chain(s2, f2, g2, g); s.start(); s2.start();
    return { set: (on) => g.gain.setTargetAtTime(on ? 0.12 : 0, this.now, on ? 0.05 : 0.1) };
  }

  /** Clock ticking. */
  clock(pos) {
    const p = this.panner(pos, 0.8, 2);
    p.connect(this.sfx);
    let tock = false;
    setInterval(() => {
      const t = this.now, s = this.src(this.white, false), f = this.filter('bandpass', tock ? 2600 : 3200, 8), g = this.gain(0);
      this.chain(s, f, g, p);
      g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      s.start(t, R()); s.stop(t + 0.05); tock = !tock;
    }, 1000);
  }

  tickListener(camera) {
    const l = this.listener, p = camera.position;
    const f = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion), u = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    if (l.positionX) {
      const t = this.now;
      l.positionX.setTargetAtTime(p.x, t, 0.02); l.positionY.setTargetAtTime(p.y, t, 0.02); l.positionZ.setTargetAtTime(p.z, t, 0.02);
      l.forwardX.setTargetAtTime(f.x, t, 0.02); l.forwardY.setTargetAtTime(f.y, t, 0.02); l.forwardZ.setTargetAtTime(f.z, t, 0.02);
      l.upX.setTargetAtTime(u.x, t, 0.02); l.upY.setTargetAtTime(u.y, t, 0.02); l.upZ.setTargetAtTime(u.z, t, 0.02);
    } else { l.setPosition(p.x, p.y, p.z); l.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z); }
  }
}
