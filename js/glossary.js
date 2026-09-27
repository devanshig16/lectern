// Highlights course terms in captions and builds a live glossary of the
// terms the professor has used so far.
(function () {
  const L = Lectern, $ = L.$, defs = window.GLOSSARY;
  const terms = Object.keys(defs).sort((a, b) => b.length - a.length);
  const kwRe = new RegExp('\\b(' + terms.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(s?)\\b', 'gi');
  const canon = t => terms.find(k => k.toLowerCase() === t.toLowerCase());
  const seen = [];
  const slug = t => 'term-' + t.replace(/\W+/g, '-');
  L.glossary = { defs, seen };

  L.formatters.push(html => !L.settings.keywords ? html : html.replace(kwRe, (m, t, s) =>
    `<button type="button" class="kw" data-term="${L.esc(canon(t) || t)}">${t}${s}</button>`));

  function render() {
    const n = $('termCount');
    n.textContent = seen.length;
    n.hidden = !seen.length;
    $('termsEmpty').hidden = !!seen.length;
    $('termsList').innerHTML = seen.map(t =>
      `<div class="item" id="${slug(t)}"><dt>${L.esc(t)}</dt><dd>${L.esc(defs[t])}</dd></div>`).join('');
  }

  L.hooks.text.push((p, text) => {
    let m, added = false;
    kwRe.lastIndex = 0;
    while ((m = kwRe.exec(text))) {
      const t = canon(m[1]);
      if (t && !seen.includes(t)) { seen.push(t); added = true; }
    }
    if (added) render();
  });
  L.hooks.reset.push(() => { seen.length = 0; render(); });

  // Clicking a highlighted term opens its definition.
  L.cap.addEventListener('click', e => {
    const k = e.target.closest('.kw');
    if (!k) return;
    L.selectTab('tab-terms');
    const item = document.getElementById(slug(k.dataset.term));
    if (item) { item.scrollIntoView({ block: 'nearest' }); L.flash(item); }
  });
})();
