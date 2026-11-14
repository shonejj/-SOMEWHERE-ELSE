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
    this.setTouch(isTouch);
    addEventListener('keydown', (e) => { if (e.code === 'Escape' && $('paper').classList.contains('show')) { e.preventDefault(); this.closeOverlay(); } });

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
    bind('opt-fps', 'maxFps', Number);
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
  }

  setTouch(on) {
    this.touch = on;
    this.hintKey.textContent = on ? 'Tap' : 'E';
    document.body.classList.toggle('touch', on);
    $('controls-help').innerHTML = on
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

  setHolding(name, instrument = false) {
    document.body.classList.toggle('holding', !!name);
    $('tb-throw').textContent = instrument ? 'Strum' : 'Throw';
    $('tb-inspect').style.display = instrument ? 'none' : '';
  }

  /** A sheet of paper: read-only text or the editable journal. */
  paper(title, html, editable = false) {
    const el = $('paper');
    $('paper-title').textContent = title;
    $('paper-body').innerHTML = html;
    $('paper-edit').hidden = !editable;
    el.classList.add('show');
    this.h.overlay?.(true);
    const close = () => { el.classList.remove('show'); this.h.overlay?.(false); };
    $('paper-close').onclick = close;
    this._closePaper = close;
  }

  journal() {
    let entries = [];
    try { entries = JSON.parse(localStorage.getItem('se-journal') || '[]'); } catch (e) { /* storage unavailable */ }
    const esc = (t) => t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    const list = entries.slice().reverse().map((e) => `<div class="entry"><div class="when">${esc(e.when)}</div><div>${esc(e.text).replace(/\n/g, '<br>')}</div></div>`).join('');
    this.paper('Journal', list || '<p class="muted">The first page is empty. Write whatever you like — it stays on this device.</p>', true);
    const ta = $('paper-text'); ta.value = ''; setTimeout(() => ta.focus(), 50);
    $('paper-save').onclick = () => {
      const text = ta.value.trim(); if (!text) return;
      const h = this.h.hour?.() ?? 12;
      const when = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) + ` · ${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')} at the cabin`;
      entries.push({ when, text });
      try { localStorage.setItem('se-journal', JSON.stringify(entries.slice(-200))); } catch (e) { /* ignore */ }
      this.toast('Written down.');
      this.journal();
    };
  }

  get overlayOpen() { return $('paper').classList.contains('show') || $('player').classList.contains('open'); }
  closeOverlay() { if ($('paper').classList.contains('show')) this._closePaper?.(); }
  setScope(on) { document.body.classList.toggle('scoping', on); }

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
