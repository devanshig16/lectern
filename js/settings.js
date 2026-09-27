// Display settings for the caption pane.
(function () {
  const L = Lectern, $ = L.$, cap = L.cap, settings = L.settings;

  Object.assign(settings, {
    size: 24,
    lh: 1.55,
    theme: 'default',
    font: 'Inter',
    speakers: true,
    keywords: true,
    timestamps: true
  });

  try { Object.assign(settings, JSON.parse(localStorage.getItem('lectern_settings') || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem('lectern_settings', JSON.stringify(settings)); } catch (e) {} };

  function apply() {
    cap.style.setProperty('--cap-size', settings.size + 'px');
    cap.style.setProperty('--cap-lh', settings.lh);
    cap.style.setProperty('--cap-font', `"${settings.font}"`);
    cap.dataset.theme = settings.theme;
    cap.classList.toggle('hide-speakers', !settings.speakers);
    cap.classList.toggle('hide-ts', !settings.timestamps);

    $('size').value = settings.size;
    $('sizeOut').textContent = settings.size + 'px';
    $('lh').value = settings.lh;
    $('lhOut').textContent = Number(settings.lh).toFixed(2);
    $('speakers').checked = settings.speakers;
    $('timestamps').checked = settings.timestamps;
    $('keywords').checked = settings.keywords;
    document.querySelectorAll('.seg').forEach(group =>
      group.querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', String(b.dataset.value === settings[group.dataset.setting]))));
  }

  L.setSetting = (key, value) => {
    settings[key] = value;
    apply();
    save();
  };

  $('size').addEventListener('input', e => L.setSetting('size', +e.target.value));
  $('lh').addEventListener('input', e => L.setSetting('lh', +e.target.value));
  document.querySelectorAll('.seg button').forEach(b =>
    b.addEventListener('click', () => L.setSetting(b.parentElement.dataset.setting, b.dataset.value)));
  $('speakers').addEventListener('change', e => L.setSetting('speakers', e.target.checked));
  $('timestamps').addEventListener('change', e => L.setSetting('timestamps', e.target.checked));
  $('keywords').addEventListener('change', e => { L.setSetting('keywords', e.target.checked); L.rerender(); });

  apply();
})();
