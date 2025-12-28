// Theme toggle - Réutilisable pour toutes les pages
// Fonction pour appliquer le thème
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  const themeBtn = document.getElementById('themeBtn')
  if (themeBtn) {
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙'
  }
}

// NOTE: we expose `setupTheme` and avoid auto-initialization here so the
// orchestrator (`app.js`) controls when theme is initialized and to avoid
// double-initialization when multiple scripts are loaded.

/**
 * Gestion du thème : applique le thème et relie le bouton de bascule.
 * @param {string} defaultTheme - 'light' ou 'dark'
 */
function setupTheme(defaultTheme) {
  const themeBtn = document.getElementById('themeBtn')
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t)
    try {
      localStorage.setItem('theme', t)
    } catch (e) {}
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙'
  }

  const preferred = defaultTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  applyTheme(localStorage.getItem('theme') || preferred)

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      applyTheme(t)
    })
  }
}

// Expose explicitly for clarity
window.setupTheme = setupTheme
