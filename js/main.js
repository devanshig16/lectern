// Start the demo once every feature module has registered its hooks.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) Lectern.showAll();
else Lectern.start();
