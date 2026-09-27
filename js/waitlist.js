// Waitlist form with a confirmation tailored to who is signing up.
(function () {
  const $ = id => document.getElementById(id);
  const next = {
    student: "we'll email you when Lectern comes to your campus.",
    ds: "we'll send our pilot guide for disability services offices within a day.",
    faculty: "we'll send a one-page summary you can share with students in your course."
  };

  $('joinForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('email'), msg = $('formMsg');
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = 'Please enter a valid email address.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    msg.textContent = `You're on the list. Thanks, ${email}: ${next[$('role').value]}`;
    input.value = '';
  });
})();
