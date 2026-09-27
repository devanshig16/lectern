// Search what has been said so far. Matches are highlighted in place.
(function () {
  const L = Lectern, $ = L.$;
  let query = '';

  // Runs after the glossary formatter, so skip over tags it inserted.
  L.formatters.push(html => {
    if (!query) return html;
    const qRe = new RegExp('(' + L.esc(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return html.split(/(<[^>]+>)/).map(part => part.startsWith('<') ? part : part.replace(qRe, '<mark>$1</mark>')).join('');
  });

  function updateCount() {
    const n = L.cap.querySelectorAll('mark').length;
    $('searchCount').textContent = query ? (n === 1 ? '1 match' : n + ' matches') : '';
  }

  function run() {
    query = $('search').value.trim();
    L.rerender();
    updateCount();
    const first = L.cap.querySelector('mark');
    if (query && first) L.scrollToLine(first.closest('.line'));
  }

  $('search').addEventListener('input', run);
  L.hooks.lineDone.push(() => { if (query) updateCount(); });
})();
