/**
 * Theme Toggle — Dark / Light mode with localStorage persistence
 */
(function () {
  const STORAGE_KEY = 'coder-theme';
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Get saved or default theme
  function getTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const attr = html.getAttribute('data-theme');
    return attr || 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply saved theme immediately
  setTheme(getTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // Respect system preference on first visit
  if (!localStorage.getItem(STORAGE_KEY)) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    if (mq.matches) setTheme('light');
    mq.addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    });
  }
})();
