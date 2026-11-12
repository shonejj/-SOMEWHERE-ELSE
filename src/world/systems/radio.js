// A generative "radio" that plays original procedurally composed music.
import { mulberry32 } from '../core/noise.js';

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

export const STATIONS = ['Evening keys', 'Slow light', 'Static'];

export class Radio {
  constructor(audio, pos) {
    this.a = audio; const ctx = audio.ctx;
    this.out = audio.gain(0);
    const hp = audio.filter('highpass', 140), lp = audio.filter('lowpass', 5200);
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6); }
    shaper.curve = curve;
    this.panner = audio.panner(pos, 1.6, 1.3);
    this.bus = audio.gain(0.5);
    audio.chain(this.bus, hp, lp, shaper, this.out, this.panner, audio.sfx);
    // crackle + hiss
    const hiss = audio.src(audio.white, true), hf = audio.filter('bandpass', 5000, 0.5); this.hissG = audio.gain(0);
    audio.chain(hiss, hf, this.hissG, this.out); hiss.start();
    this.station = -1; this.on = false;
    this.rnd = mulberry32(5150);
    this.nextTime = 0; this.step = 0; this.bar = 0;
    this.timer = setInterval(() => this.schedule(), 100);
  }

  toggle() {
    // off -> station 0 -> station 1 -> off
    if (!this.on) { this.on = true; this.station = 0; }
    else if (this.station === 0) this.station = 1;
    else { this.on = false; }
    const t = this.a.now;
    this.a.click(this.panner.positionX ? { x: this.panner.positionX.value, y: this.panner.positionY.value, z: this.panner.positionZ.value } : null, 0.3);
    // tuning static burst
    this.hissG.gain.cancelScheduledValues(t);
    this.hissG.gain.setValueAtTime(this.on ? 0.25 : 0, t);
    this.hissG.gain.linearRampToValueAtTime(this.on ? 0.012 : 0, t + 0.6);
    this.out.gain.setTargetAtTime(this.on ? 0.9 : 0, t, 0.08);
    this.nextTime = t + 0.4; this.step = 0;
    return this.on ? STATIONS[this.station] : null;
  }

  voice(type, f, t, dur, vel) {
    const a = this.a, ctx = a.ctx;
    if (type === 'ep') { // FM electric piano
      const c = ctx.createOscillator(), m = ctx.createOscillator(), mg = a.gain(f * 1.6), g = a.gain(0);
      c.frequency.value = f; m.frequency.value = f; m.connect(mg).connect(c.frequency);
      mg.gain.setValueAtTime(f * 2.2 * vel, t); mg.gain.exponentialRampToValueAtTime(f * 0.15, t + 0.8);
      c.connect(g).connect(this.bus);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12 * vel, t + 0.006); g.gain.exponentialRampToValueAtTime(0.03 * vel, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      c.start(t); m.start(t); c.stop(t + dur + 0.1); m.stop(t + dur + 0.1);
    } else if (type === 'bass') {
      const o = ctx.createOscillator(), g = a.gain(0), f2 = a.filter('lowpass', 400);
      o.type = 'triangle'; o.frequency.value = f;
      a.chain(o, f2, g, this.bus);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22 * vel, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur + 0.05);
    } else if (type === 'pad') {
      const g = a.gain(0), lp = a.filter('lowpass', 900, 0.5);
      for (const d of [-7, 0, 6]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; o.connect(lp); o.start(t); o.stop(t + dur + 0.1); }
      a.chain(lp, g, this.bus);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03 * vel, t + dur * 0.4); g.gain.linearRampToValueAtTime(0, t + dur);
    } else if (type === 'bell') {
      [1, 2.76, 5.4].forEach((m, i) => { const o = ctx.createOscillator(), g = a.gain(0); o.frequency.value = f * m; o.connect(g).connect(this.bus);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05 * vel / (i + 1), t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur / (i + 1)); o.start(t); o.stop(t + dur); });
    } else if (type === 'hat') {
      const s = a.src(a.white, false), f2 = a.filter('highpass', 7000), g = a.gain(0);
      a.chain(s, f2, g, this.bus);
      g.gain.setValueAtTime(0.05 * vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      s.start(t, this.rnd() * 2); s.stop(t + 0.08);
    } else if (type === 'kick') {
      const o = ctx.createOscillator(), g = a.gain(0);
      o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.15);
      o.connect(g).connect(this.bus);
      g.gain.setValueAtTime(0.35 * vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.start(t); o.stop(t + 0.35);
    }
  }

  schedule() {
    if (!this.on) return;
    const a = this.a; const now = a.now;
    if (this.nextTime < now) this.nextTime = now + 0.05;
    const r = this.rnd;
    while (this.nextTime < now + 0.4) {
      const t = this.nextTime;
      if (this.station === 0) {
        // 74 bpm swung eighths over a ii–V–I–vi style loop in D
        const prog = [[50, [62, 65, 69, 72]], [55, [62, 65, 67, 71]], [52, [61, 64, 67, 71]], [57, [61, 64, 67, 69]], [47, [62, 66, 69, 71]], [52, [62, 64, 67, 71]], [45, [61, 64, 67, 69]], [50, [62, 66, 69, 73]]];
        const beat = 60 / 74, stepDur = beat / 2;
        const s = this.step % 8; const chord = prog[this.bar % prog.length];
        const swing = s % 2 ? stepDur * 0.16 : 0;
        if (s === 0) { chord[1].forEach((n, i) => this.voice('ep', midi(n), t + i * 0.012, beat * 3.5, 0.7)); this.voice('bass', midi(chord[0] - 12), t, beat * 1.8, 1); this.voice('kick', 0, t, 0, 0.8); }
        if (s === 5) this.voice('bass', midi(chord[0] - 12 + (r() < 0.5 ? 7 : 12)), t + swing, beat, 0.7);
        if (s === 4) this.voice('kick', 0, t, 0, 0.5);
        this.voice('hat', 0, t + swing, 0, s % 2 ? 0.5 : 0.9);
        if (r() < 0.38) { const scale = [62, 64, 66, 69, 71, 74, 76, 78]; this.voice('ep', midi(scale[Math.floor(r() * scale.length)] + 12), t + swing, beat * 1.2, 0.45 + r() * 0.3); }
        this.nextTime += stepDur; this.step++;
        if (this.step % 8 === 0) this.bar++;
      } else {
        // slow ambient: pads + bells, 6 s per chord
        const chords = [[45, 52, 57, 60, 64], [41, 48, 53, 57, 64], [43, 50, 55, 59, 62], [40, 47, 52, 55, 59]];
        const c = chords[this.bar % chords.length];
        c.forEach((n) => this.voice('pad', midi(n), t, 6.5, 0.8));
        for (let i = 0; i < 4; i++) if (r() < 0.6) this.voice('bell', midi(c[Math.floor(r() * c.length)] + 24), t + 0.5 + r() * 5, 3, 0.6);
        this.nextTime += 6; this.bar++;
      }
    }
  }
}
