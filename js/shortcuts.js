// Keyboard shortcuts, active while the demo is on screen.
(function () {
  const L = Lectern, $ = L.$;

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
      if (e.key === 'Escape') e.target.blur();
      return;
    }
    const demo = $('demo').getBoundingClientRect();
    if (demo.bottom < 0 || demo.top > innerHeight) return;

    if (e.key === ' ' && !['BUTTON', 'SUMMARY', 'A'].includes(tag)) { e.preventDefault(); L.togglePause(); }
    else if (e.key === 'b' || e.key === 'B') L.addBookmark();
    else if (e.key === '+' || e.key === '=') L.setSetting('size', Math.min(40, L.settings.size + 2));
    else if (e.key === '-' || e.key === '_') L.setSetting('size', Math.max(16, L.settings.size - 2));
    else if (e.key === '/') { e.preventDefault(); $('search').focus(); }
  });
})();
