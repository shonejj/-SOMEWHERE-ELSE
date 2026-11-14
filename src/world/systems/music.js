// A pocket lo-fi player: original music composed on the fly from a seed per track.
// Instruments: FM electric piano, upright bass, kick/snare/rim/hats/shaker with swing,
// vibraphone / plucked guitar / soft lead melodies, warm pads, vinyl crackle, tape wobble,
// a small convolution reverb and an optional bed of rain and birdsong.
import { mulberry32 } from '../core/noise.js';

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const PROGS = [
  [[2, 'm7'], [7, '7'], [0, 'maj7'], [9, 'm7']],          // ii V I vi
  [[0, 'maj7'], [4, 'm7'], [9, 'm7'], [5, 'maj7']],       // I iii vi IV
  [[9, 'm9'], [5, 'maj9'], [0, 'maj9'], [7, '7sus']],     // vi IV I V
  [[5, 'maj7'], [4, 'm7'], [2, 'm7'], [0, 'maj9']],       // IV iii ii I
  [[0, 'maj9'], [5, 'maj7'], [2, 'm9'], [7, '13']],
  [[9, 'm7'], [2, 'm7'], [7, '7'], [0, 'maj7']],
];
const QUAL = { maj7: [0, 4, 7, 11], maj9: [0, 4, 7, 11, 14], m7: [0, 3, 7, 10], m9: [0, 3, 7, 10, 14], '7': [0, 4, 7, 10], '7sus': [0, 5, 7, 10], '13': [0, 4, 10, 14, 21] };
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16];

export const TRACKS = [
  { title: 'Rain on the Porch', seed: 11, key: 62, bpm: 74, prog: 0, lead: 'vibes' },
  { title: "Kettle's On", seed: 23, key: 65, bpm: 80, prog: 1, lead: 'guitar' },
  { title: 'Moss & Lantern', seed: 37, key: 57, bpm: 70, prog: 2, lead: 'lead' },
  { title: 'Slow Lake', seed: 41, key: 63, bpm: 68, prog: 3, lead: 'vibes' },
  { title: 'Pine Needles', seed: 53, key: 60, bpm: 84, prog: 4, lead: 'guitar' },
  { title: 'Window Seat', seed: 67, key: 64, bpm: 76, prog: 5, lead: 'lead' },
  { title: 'Embers', seed: 71, key: 58, bpm: 72, prog: 0, lead: 'guitar' },
  { title: 'After the Storm', seed: 89, key: 61, bpm: 78, prog: 2, lead: 'vibes' },
];

export class LofiPlayer {
  constructor(audio) {
    this.a = audio; const ctx = (this.ctx = audio.ctx);
    this.out = audio.gain(0.75); this.out.connect(audio.musicBus);
    // warm the whole mix: gentle low-pass + tape saturation
    this.tone = audio.filter('lowpass', 7000, 0.4);
    const sat = ctx.createWaveShaper(); const c = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i / 1024 - 1; c[i] = Math.tanh(x * 1.4) / Math.tanh(1.4); } sat.curve = c;
    this.bus = audio.gain(0.8);
    audio.chain(this.bus, sat, this.tone, this.out);
    // reverb from a generated impulse response
    this.verb = ctx.createConvolver(); this.verb.buffer = this.impulse(2.2);
    this.verbSend = audio.gain(0.22); this.bus.connect(this.verbSend); this.verbSend.connect(this.verb); this.verb.connect(this.tone);
    // vinyl crackle & hiss
    const hiss = audio.src(audio.pink, true); this.hissG = audio.gain(0); audio.chain(hiss, audio.filter('highpass', 2500), this.hissG, this.out); hiss.start();
    // nature bed
    const rain = audio.src(audio.pink, true, 0.8); this.natureG = audio.gain(0); audio.chain(rain, audio.filter('bandpass', 2400, 0.5), this.natureG, this.out); rain.start();
    this.nature = true;
    this.track = 0; this.playing = false; this.pos = 0; this.duration = 180;
    this.timer = setInterval(() => this.schedule(), 60);
    this.crackleT = 0;
  }

  impulse(sec) {
    const sr = this.ctx.sampleRate, n = Math.floor(sr * sec), b = this.ctx.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    return b;
  }

  load(i) {
    this.track = (i + TRACKS.length) % TRACKS.length;
    const T = TRACKS[this.track];
    this.r = mulberry32(T.seed);
    this.beat = 60 / T.bpm; this.step = 0; this.bar = 0;
    this.prog = PROGS[T.prog];
    this.bars = 48 + Math.floor(this.r() * 16);
    this.duration = this.bars * 4 * this.beat;
    this.motif = Array.from({ length: 8 }, () => (this.r() < 0.55 ? PENTA[Math.floor(this.r() * PENTA.length)] : null));
    this.next = this.ctx.currentTime + 0.15; this.startTime = this.next;
  }

  play(i = this.track) { this.a.resume(); if (i !== this.track || !this.r) this.load(i); else { this.next = this.ctx.currentTime + 0.1; this.startTime = this.ctx.currentTime - this.pos; } this.playing = true; this.fade(true); }
  pause() { this.playing = false; this.fade(false); }
  toggle() { this.playing ? this.pause() : this.play(); }
  nextTrack() { this.load(this.track + 1); if (this.playing) this.fade(true); this.pos = 0; }
  prevTrack() { this.load(this.track - 1); if (this.playing) this.fade(true); this.pos = 0; }
  setVolume(v) { this.out.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); }
  setNature(on) { this.nature = on; this.fade(this.playing); }
  fade(on) {
    const t = this.ctx.currentTime;
    this.bus.gain.setTargetAtTime(on ? 0.8 : 0, t, 0.15);
    this.hissG.gain.setTargetAtTime(on ? 0.012 : 0, t, 0.3);
    this.natureG.gain.setTargetAtTime(on && this.nature ? 0.035 : 0, t, 0.6);
  }
  get title() { return TRACKS[this.track].title; }

  // ----------------------------------------------------------- instruments
  env(g, t, a, peak, d, sus = 0.0001) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(Math.max(sus, 0.0001), t + a + d); }
  wobble(o, t, dur) { o.detune.setValueAtTime(Math.sin(t * 0.7) * 9, t); o.detune.linearRampToValueAtTime(Math.sin((t + dur) * 0.7) * 9, t + dur); }
  keys(f, t, dur, v) {
    const c = this.ctx, car = c.createOscillator(), mod = c.createOscillator(), mg = this.a.gain(0), g = this.a.gain(0), lp = this.a.filter('lowpass', 2400, 0.6);
    car.frequency.value = f; mod.frequency.value = f * 1.002; mod.connect(mg).connect(car.frequency);
    mg.gain.setValueAtTime(f * 1.6 * v, t); mg.gain.exponentialRampToValueAtTime(f * 0.08, t + 0.9);
    this.wobble(car, t, dur);
    this.a.chain(car, lp, g, this.bus);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.07 * v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.025 * v, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    car.start(t); mod.start(t); car.stop(t + dur + 0.05); mod.stop(t + dur + 0.05);
  }
  bass(f, t, dur, v) {
    const c = this.ctx, o = c.createOscillator(), o2 = c.createOscillator(), g = this.a.gain(0), lp = this.a.filter('lowpass', 420, 1.2);
    o.type = 'triangle'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f / 2;
    o.connect(lp); o2.connect(lp); this.a.chain(lp, g, this.bus);
    this.env(g, t, 0.008, 0.2 * v, Math.min(dur, 0.9));
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  noise(t, f, type, q, dur, v, rate = 1) {
    const s = this.a.src(this.a.white, false, rate), fl = this.a.filter(type, f, q), g = this.a.gain(0);
    this.a.chain(s, fl, g, this.bus); this.env(g, t, 0.002, v, dur); s.start(t, Math.random() * 2); s.stop(t + dur + 0.05);
  }
  kick(t, v) {
    const o = this.ctx.createOscillator(), g = this.a.gain(0); o.frequency.setValueAtTime(115, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    o.connect(g).connect(this.bus); this.env(g, t, 0.003, 0.5 * v, 0.32); o.start(t); o.stop(t + 0.4);
    this.noise(t, 3000, 'bandpass', 1, 0.01, 0.05 * v);
  }
  snare(t, v) {
    this.noise(t, 1900, 'bandpass', 0.7, 0.16, 0.18 * v);
    const o = this.ctx.createOscillator(), g = this.a.gain(0); o.frequency.value = 185; o.connect(g).connect(this.bus); this.env(g, t, 0.002, 0.12 * v, 0.08); o.start(t); o.stop(t + 0.12);
  }
  lead(kind, f, t, dur, v) {
    if (kind === 'guitar') {
      const sr = this.ctx.sampleRate, len = Math.floor(sr * 1.6), buf = this.ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
      const p = Math.max(2, Math.round(sr / f)); for (let k = 0; k < p; k++) d[k] = Math.random() * 2 - 1;
      for (let k = p; k < len; k++) d[k] = (d[k - p] + d[k - p + 1]) * 0.497;
      const s = this.a.src(buf, false), g = this.a.gain(0.12 * v), lp = this.a.filter('lowpass', 2800);
      this.a.chain(s, lp, g, this.bus); s.start(t); return;
    }
    const o = this.ctx.createOscillator(), g = this.a.gain(0);
    if (kind === 'vibes') {
      [1, 4, 10].forEach((m, i) => { const oo = this.ctx.createOscillator(), gg = this.a.gain(0); oo.frequency.value = f * m; oo.connect(gg).connect(this.bus); this.env(gg, t, 0.003, 0.06 * v / (i * 2 + 1), 1.4 / (i + 1)); oo.start(t); oo.stop(t + 1.6); });
      return;
    }
    o.type = 'triangle'; o.frequency.value = f; this.wobble(o, t, dur);
    const vib = this.ctx.createOscillator(), vg = this.a.gain(f * 0.008); vib.frequency.value = 5; vib.connect(vg).connect(o.frequency);
    this.a.chain(o, this.a.filter('lowpass', 1800), g, this.bus);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05 * v, t + 0.06); g.gain.setValueAtTime(0.05 * v, t + dur * 0.7); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.start(t); vib.start(t); o.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
  }
  pad(freqs, t, dur) {
    const g = this.a.gain(0), lp = this.a.filter('lowpass', 900, 0.4);
    for (const f of freqs) for (const dt of [-8, 7]) { const o = this.ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + dur + 0.1); }
    this.a.chain(lp, g, this.bus);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.012, t + dur * 0.35); g.gain.linearRampToValueAtTime(0.0001, t + dur);
  }

  // ------------------------------------------------------------- composer
  schedule() {
    if (!this.playing || !this.r) return;
    const now = this.ctx.currentTime;
    this.pos = now - this.startTime;
    if (Math.random() < 0.25) this.noise(now + 0.05, 3000 + Math.random() * 4000, 'bandpass', 3, 0.004, 0.02 + Math.random() * 0.04); // vinyl pops
    if (this.next < now) this.next = now + 0.05;
    const T = TRACKS[this.track], r = this.r, b = this.beat, sixteenth = b / 4;
    while (this.next < now + 0.35) {
      const t = this.next, s = this.step % 16, bar = this.bar;
      if (bar >= this.bars) { this.nextTrack(); return; }
      const section = bar < 4 ? 'intro' : bar >= this.bars - 4 ? 'outro' : Math.floor((bar - 4) / 8) % 3 === 2 ? 'break' : 'main';
      const [deg, q] = this.prog[Math.floor(bar / 1) % this.prog.length];
      const root = T.key + deg;
      const swing = s % 2 ? sixteenth * 0.18 : 0;
      const tt = t + swing + (r() - 0.5) * 0.006;
      const vel = 0.75 + r() * 0.25;
      if (s === 0) {
        const notes = QUAL[q].map((iv) => root + iv);
        notes.forEach((n, i) => this.keys(midi(n), t + i * 0.018, b * (section === 'intro' ? 4 : 3.4), 0.8));
        if (section !== 'intro') this.pad(notes.slice(0, 3).map((n) => midi(n - 12)), t, b * 4);
      }
      if (s === 10 && r() < 0.5) QUAL[q].slice(1).forEach((iv, i) => this.keys(midi(root + iv), tt + i * 0.015, b * 1.2, 0.45));
      if (section === 'main' || section === 'outro') {
        if (s === 0 || (s === 10 && r() < 0.7) || (s === 7 && r() < 0.25)) this.kick(tt, vel);
        if (s === 4 || s === 12) this.snare(tt, vel);
        if (s % 2 === 0) this.noise(tt, 8000, 'highpass', 0.7, s % 4 === 0 ? 0.05 : 0.03, (s % 4 === 0 ? 0.045 : 0.025) * vel);
        if (s % 4 === 2 && r() < 0.5) this.noise(tt, 5500, 'bandpass', 2, 0.06, 0.02, 0.6); // shaker
        if (s === 14 && r() < 0.3) this.noise(tt, 2600, 'bandpass', 6, 0.03, 0.08); // rim
      }
      if (section !== 'intro') {
        if (s === 0) this.bass(midi(root - 24), tt, b * 1.6, 1);
        if (s === 8 && r() < 0.8) this.bass(midi(root - 24 + (r() < 0.5 ? 7 : 12)), tt, b * 1.2, 0.8);
        if (s === 14 && r() < 0.4) this.bass(midi(root - 24 + 10), tt, b * 0.4, 0.6);
      }
      // melody: a motif that repeats with small variations, answered every other phrase
      if (section === 'main' && s % 2 === 0) {
        const idx = (s / 2 + bar * 3) % 8;
        let n = this.motif[idx];
        if (n !== null && (bar % 4 < 2 || r() < 0.4)) {
          if (bar % 8 >= 4 && r() < 0.35) n = PENTA[Math.floor(r() * PENTA.length)];
          this.lead(T.lead, midi(T.key + 12 + n), tt, b * (0.5 + r() * 0.8), 0.9);
        }
      }
      if (section === 'break' && s === 0 && r() < 0.6) this.lead('vibes', midi(T.key + 24 + PENTA[Math.floor(r() * 5)]), tt, b, 0.6);
      this.next += sixteenth; this.step++;
      if (this.step % 16 === 0) this.bar++;
    }
  }
}
