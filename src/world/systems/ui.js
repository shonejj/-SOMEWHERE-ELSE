// Minimal, quiet interface: a tiny dot, contextual hints, a pause menu.
import { PLACES } from '../core/layout.js';
import { PRESETS, isTouch } from '../core/settings.js';

const $ = (id) => document.getElementById(id);

export class UI {
  constructor(settings, handlers) {
    this.s = settings; this.h = handlers;
    this.hintEl = $('hint'); this.hintText = $('hint-text'); this.hintKey = $('hint-key');
    this.toastEl = $('toast');
    this.menu = $('menu');
    this.lastHint = null;
    this.hintKey.textContent = isTouch ? 'Tap' : 'E';
    document.body.classList.toggle('touch', isTouch);

    // menu controls
    const q = $('opt-quality');
    q.innerHTML = Object.entries(PRESETS).map(([k, p]) => `<option value="${k}">${p.name}</option>`).join('');
    q.value = settings.quality;
    q.onchange = () => handlers.quality(q.value);
    const bind = (id, key, conv = (v) => v, after) => {
      const el = $(id);
      if (el.type === 'checkbox') el.checked = !!settings[key]; else el.value = settings[key];
      el.oninput = el.onchange = () => { settings[key] = el.type === 'checkbox' ? el.checked : conv(el.value); handlers.changed(key); after?.(); };
    };
    bind('opt-volume', 'volume', Number);
    bind('opt-sens', 'sensitivity', Number);
    bind('opt-fov', 'fov', Number);
    bind('opt-invert', 'invertY');
    bind('opt-bob', 'headBob');
    bind('opt-timeflow', 'timeFlow');
    bind('opt-weather', 'weather');
    const time = $('opt-time');
    time.oninput = () => handlers.setHour(Number(time.value));
    this.timeEl = time; this.timeLabel = $('opt-time-label');
    $('menu-resume').onclick = () => handlers.resume();
    $('menu-exit').onclick = () => handlers.exit();
    const places = $('places');
    places.innerHTML = PLACES.map((p) => `<button class="place" data-id="${p.id}">${p.name}</button>`).join('');
    places.onclick = (e) => { const b = e.target.closest('.place'); if (b) handlers.travel(b.dataset.id); };
    $('controls-help').innerHTML = isTouch
      ? '<b>Left side</b> move · <b>Right side</b> look · <b>Tap</b> to use or pick up · buttons for jump, crouch, run and torch'
      : '<b>WASD</b> walk · <b>Shift</b> run · <b>C / Ctrl</b> crouch · <b>Space</b> jump · <b>E</b> use / pick up · <b>Click</b> throw · <b>Hold R / right-click</b> inspect · <b>Q</b> drop · <b>F</b> torch · <b>Esc</b> menu';
  }

  hint(text, always = false) {
    if (text === this.lastHint) return;
    this.lastHint = text;
    if (!text) { this.hintEl.classList.remove('show'); $('crosshair').classList.remove('active'); return; }
    this.hintText.textContent = text;
    this.hintEl.classList.add('show');
    $('crosshair').classList.add('active');
  }

  toast(text, ms = 2600) {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    clearTimeout(this._t);
    this._t = setTimeout(() => this.toastEl.classList.remove('show'), ms);
  }

  setHolding(name) {
    document.body.classList.toggle('holding', !!name);
  }

  showMenu(on) {
    this.menu.classList.toggle('show', on);
    document.body.classList.toggle('paused', on);
  }

  updateTime(hour) {
    if (document.activeElement !== this.timeEl) this.timeEl.value = hour.toFixed(2);
    const h = Math.floor(hour), m = Math.floor((hour % 1) * 60);
    this.timeLabel.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  fade(on, ms = 600) {
    const f = $('fade');
    f.style.transitionDuration = ms + 'ms';
    f.classList.toggle('show', on);
    return new Promise((r) => setTimeout(r, ms));
  }
}
