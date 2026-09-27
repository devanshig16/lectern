// Accessible tabs for the side panel (arrow keys move between tabs).
(function () {
  const L = Lectern;
  const tabs = [...document.querySelectorAll('[role=tab]')];

  L.selectTab = id => {
    tabs.forEach(t => {
      const on = t.id === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      L.$(t.getAttribute('aria-controls')).hidden = !on;
    });
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => L.selectTab(t.id));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      L.selectTab(next.id);
      next.focus();
    });
  });
})();
