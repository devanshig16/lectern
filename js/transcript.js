// Download the transcript as plain text, with summary, terms and bookmarks.
(function () {
  const L = Lectern;

  function build() {
    const lines = L.lines().map(p => {
      const star = p.classList.contains('bookmarked') ? '★ ' : '';
      const exam = p.classList.contains('exam') ? '  (EXAM MENTION)' : '';
      return `[${p.querySelector('.ts').textContent}] ${star}${p.querySelector('.who').textContent}: ${p.dataset.text}${exam}`;
    });
    const summary = L.summarySoFar().map(p => '- ' + (p.exam ? 'Exam: ' : '') + p.text);
    const terms = L.glossary.seen.map(t => `- ${t}: ${L.glossary.defs[t]}`);
    return [
      'Lectern transcript — CHEM 201 · Organic Chemistry',
      new Date().toLocaleString(),
      '',
      'SUMMARY', ...(summary.length ? summary : ['- (none yet)']),
      '',
      'KEY TERMS', ...(terms.length ? terms : ['- (none yet)']),
      '',
      'TRANSCRIPT (★ = bookmarked)', ...lines
    ].join('\n');
  }

  L.$('saveBtn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([build()], { type: 'text/plain' }));
    a.download = 'lectern-transcript.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
})();
