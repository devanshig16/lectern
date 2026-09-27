// "Catch me up" summary and exam-mention flags.
(function () {
  const L = Lectern, $ = L.$, points = window.SUMMARY;
  const examRe = /\b(midterm|final exam|on the exam|on the test|quiz)\b/i;
  const panel = $('summary'), btn = $('catchBtn');

  L.hooks.text.push((p, text) => p.classList.toggle('exam', examRe.test(text)));

  L.summarySoFar = () => points.filter(p => p.after < L.li);

  function render() {
    const pts = L.summarySoFar();
    $('summaryList').innerHTML = pts.length
      ? pts.map(p => `<li class="${p.exam ? 'exam' : ''}">${p.exam ? 'Exam: ' : ''}${L.esc(p.text)}</li>`).join('')
      : '<li>Nothing yet. The lecture just started.</li>';
  }

  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Hide summary' : 'Catch me up';
    render();
  });

  L.hooks.lineDone.push(render);
  L.hooks.reset.push(render);
  render();
})();
