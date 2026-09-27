// Bookmark the line being spoken and jump back to it later.
(function () {
  const L = Lectern, $ = L.$;
  let marks = [];

  L.addBookmark = () => {
    const lines = L.lines();
    const el = lines[lines.length - 1];
    if (!el || el.classList.contains('bookmarked')) return;
    el.classList.add('bookmarked');
    marks.push({ id: el.id, el, who: el.querySelector('.who').textContent, ts: el.querySelector('.ts').textContent });
    render();
    L.flash(el);
  };

  function render() {
    const n = $('markCount');
    n.textContent = marks.length;
    n.hidden = !marks.length;
    $('marksEmpty').hidden = !!marks.length;
    $('marksList').innerHTML = marks.map(b =>
      `<li class="item"><button type="button" class="link" data-line="${b.id}"><span class="ts">${b.ts} · ${L.esc(b.who)}</span>${L.esc(b.el.dataset.text)}</button></li>`).join('');
  }

  $('marksList').addEventListener('click', e => {
    const b = e.target.closest('[data-line]');
    if (b) L.goToLine(b.dataset.line);
  });
  $('bookmarkBtn').addEventListener('click', L.addBookmark);

  // A line bookmarked mid-sentence keeps filling in, so refresh when it ends.
  L.hooks.lineDone.push(() => { if (marks.length) render(); });
  L.hooks.reset.push(() => { marks = []; render(); });
})();
