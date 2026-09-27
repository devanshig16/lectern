// Caption engine. Plays the sample lecture word by word and exposes a small
// API on window.Lectern so features (search, glossary, bookmarks...) can plug in
// through formatters and hooks instead of reaching into each other.
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const L = window.Lectern = {
    $, esc,
    cap: $('captions'),
    script: window.LECTURE,
    settings: {},
    // (html, text) => html, applied in registration order to every caption line
    formatters: [],
    hooks: { text: [], lineDone: [], reset: [], resume: [] },
    li: 0,
    paused: false,
    ended: false,
    follow: true
  };

  const liveBadge = $('liveBadge'), pauseBtn = $('pauseBtn'), jumpBtn = $('jumpBtn');
  const lectureStart = Date.now() - (12 * 60 + 4) * 1000;
  let wi = 0, timer = null, currentEl = null;
  L.pauseBtn = pauseBtn;

  L.clock = () => {
    const s = Math.floor((Date.now() - lectureStart) / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };
  setInterval(() => { $('clock').textContent = L.clock(); }, 1000);

  L.fmt = text => L.formatters.reduce((html, f) => f(html, text), esc(text));
  L.lines = () => [...L.cap.querySelectorAll('.line')];

  L.newLine = who => {
    if (currentEl) currentEl.classList.remove('current');
    const p = document.createElement('p');
    p.className = 'line current';
    p.id = 'line-' + L.lines().length;
    p.innerHTML = '<span class="meta"><span class="who"></span><span class="ts"></span>' +
      '<span class="pin" aria-label="Bookmarked">★</span>' +
      '</span><span class="words"></span>';
    p.querySelector('.who').textContent = who;
    p.querySelector('.ts').textContent = L.clock();
    p.dataset.text = '';
    L.cap.appendChild(p);
    currentEl = p;
    return p;
  };

  L.setText = (p, text) => {
    p.dataset.text = text;
    p.querySelector('.words').innerHTML = L.fmt(text);
    L.hooks.text.forEach(h => h(p, text));
  };

  // Re-run formatters on every line, e.g. after a setting or search changes.
  L.rerender = () => L.lines().forEach(p => { p.querySelector('.words').innerHTML = L.fmt(p.dataset.text); });

  L.scrollLive = () => { if (L.follow) L.cap.scrollTop = L.cap.scrollHeight; };

  function tick() {
    if (L.paused || L.ended) return;
    if (L.li >= L.script.length) { endLecture(); return; }
    const [who, line] = L.script[L.li];
    const words = line.split(' ');
    if (wi === 0) L.newLine(who);
    wi++;
    L.setText(currentEl, words.slice(0, wi).join(' '));
    L.scrollLive();
    if (wi >= words.length) {
      L.li++; wi = 0;
      L.hooks.lineDone.forEach(h => h());
      timer = setTimeout(tick, 900);
    } else {
      timer = setTimeout(tick, 170 + Math.random() * 140);
    }
  }

  L.setLiveState = (label, pausedLook) => {
    liveBadge.textContent = label;
    liveBadge.classList.toggle('paused', pausedLook);
  };

  function endLecture() {
    L.ended = true;
    if (currentEl) currentEl.classList.remove('current');
    const end = document.createElement('p');
    end.className = 'ended';
    end.textContent = 'Lecture ended · ' + L.clock();
    L.cap.appendChild(end);
    L.scrollLive();
    L.setLiveState('Ended', true);
    pauseBtn.textContent = 'Replay';
  }

  function reset() {
    clearTimeout(timer);
    L.cap.innerHTML = '';
    currentEl = null; L.li = 0; wi = 0;
    L.ended = false; L.paused = false; L.follow = true;
    L.hooks.reset.forEach(h => h());
    pauseBtn.textContent = 'Pause';
    L.setLiveState('Live', false);
    tick();
  }

  // Stop the sample lecture without ending it (used by pause and the mic demo).
  L.pause = label => {
    L.paused = true;
    clearTimeout(timer);
    L.setLiveState(label || 'Paused', !label);
  };

  L.togglePause = () => {
    if (L.ended) { reset(); return; }
    if (L.paused) {
      L.paused = false;
      pauseBtn.textContent = 'Pause';
      L.setLiveState('Live', false);
      L.hooks.resume.forEach(h => h());
      tick();
    } else {
      L.pause();
      pauseBtn.textContent = 'Resume';
    }
  };
  pauseBtn.addEventListener('click', L.togglePause);

  // Keep following the live line unless the reader scrolls up to re-read.
  L.cap.addEventListener('scroll', () => {
    L.follow = L.cap.scrollHeight - L.cap.scrollTop - L.cap.clientHeight < 40;
    jumpBtn.classList.toggle('show', !L.follow);
  });
  jumpBtn.addEventListener('click', () => {
    L.follow = true;
    L.cap.scrollTop = L.cap.scrollHeight;
    jumpBtn.classList.remove('show');
  });

  L.flash = el => { el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1400); };

  L.scrollToLine = el => {
    L.follow = false;
    L.cap.scrollTop = el.offsetTop - L.cap.offsetTop - 24;
    jumpBtn.classList.add('show');
  };

  L.goToLine = id => {
    const el = document.getElementById(id);
    if (!el) return;
    L.scrollToLine(el);
    L.flash(el);
  };

  L.start = tick;
})();
