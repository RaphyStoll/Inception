// data-project.js
// Petit loader minimal pour pages projets.
// - Essaie de charger `data.json` local (même dossier que la page).
// - Si absent, retombe sur `/assets/data/data.json`.
// - Expose `window.loadProjectData()` et `window.setProjectData()`.
// - Emet `dataUpdated` et appelle `initCarousel()` si présent.
;(function () {
  async function tryFetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  }

  async function loadProjectData() {
    let data = null
    // 1) tenter data.json local (relative)
    try {
      data = await tryFetchJson('data.json')
      console.debug('data-project: loaded local data.json')
    } catch (errLocal) {
      // 2) fallback global
      try {
        data = await tryFetchJson('/assets/data/data.json')
        console.debug('data-project: loaded global /assets/data/data.json')
      } catch (errGlobal) {
        console.error('data-project: unable to load data.json (local/global), using fallback', errGlobal)
        data = {
          name: 'Raphaël Ferreira',
          email: 'contact@azilios.ch',
          highlights: ['C / C++ • Bash • Python', 'Curiosité permanente', 'Code clair • Design minimal'],
          tags: ['Favori', 'All', '42', 'Game', 'C', 'Open Source', 'Sys/Admin'],
          projects: [],
          contactEndpoint: '/contact.php',
        }
      }
    }

    window.DATA = data
    try {
      window.dispatchEvent(new Event('dataUpdated'))
    } catch (e) {}

    // si carousel déjà présent, initialiser/rafraîchir.
    // Sinon, retenter quelques fois avec backoff pour tolérer différents ordres de chargement
    // (carousel.js peut se charger juste après data-project.js). On ne bloque pas la page.
    ;(function tryInitCarousel(retries = 6, delay = 200) {
      if (typeof window.initCarousel === 'function') {
        try {
          window.initCarousel()
        } catch (e) {
          console.debug('data-project: initCarousel threw', e)
        }
        return
      }
      if (retries <= 0) return
      setTimeout(() => tryInitCarousel(retries - 1, Math.round(delay * 1.5)), delay)
    })()

    return data
  }

  window.loadProjectData = loadProjectData

  window.setProjectData = function (d) {
    window.DATA = d
    try {
      window.dispatchEvent(new Event('dataUpdated'))
    } catch (e) {}
  }

  // Auto-run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadProjectData(), { once: true })
  } else {
    // try immediately
    loadProjectData()
  }
})()
