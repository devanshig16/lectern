// Caption the visitor's own voice with the Web Speech API, where supported.
// The real app runs an on-device model; the browser engine stands in for the demo.
(function () {
  const L = Lectern, $ = L.$;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = $('micBtn'), note = $('micNote');
  let rec = null, on = false, line = null, finalText = '';

  if (!SR) {
    btn.disabled = true;
    note.textContent = 'Live mic captions need Chrome, Edge or Safari. The sample lecture shows the full experience.';
    return;
  }

  function stop() {
    if (!rec || !on) return;
    on = false;
    rec.stop();
    btn.textContent = 'Caption my mic';
  }

  btn.addEventListener('click', () => {
    if (on) { stop(); L.setLiveState('Paused', true); return; }
    L.pause('Listening');
    L.pauseBtn.textContent = L.ended ? 'Replay' : 'Resume sample';

    rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    finalText = '';
    line = L.newLine('You');
    L.follow = true;
    L.scrollLive();

    rec.onresult = ev => {
      let interim = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalText += t + ' ';
        else interim += t;
      }
      L.setText(line, (finalText + interim).trim());
      L.scrollLive();
    };
    rec.onerror = ev => {
      note.textContent = ev.error === 'not-allowed'
        ? 'Microphone access was blocked. Allow it in your browser to try this.'
        : 'Mic stopped: ' + ev.error;
    };
    // Chrome ends recognition after a pause in speech; keep listening until stopped.
    rec.onend = () => { if (on) rec.start(); };
    rec.start();
    on = true;
    btn.textContent = 'Stop mic';
  });

  L.hooks.resume.push(stop);
  L.hooks.reset.push(stop);
})();
