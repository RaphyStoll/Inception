// data/loader.js
// Centralise le chargement des données pour le site.
;(function () {
  'use strict'

  async function tryFetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  }

  async function loadData() {
    let data = null

    // Candidate locations to try (covers common setups where the site may be
    // served from / or from /public). We try them in order and keep the first
    // successful response.
    const candidates = [
      'data.json',
      './data.json',
      '/assets/data/data.json',
      '/public/assets/data/data.json',
    ]

    for (const url of candidates) {
      try {
        data = await tryFetchJson(url)
        console.debug('data/loader: loaded', url)
        break
      } catch (err) {
        console.debug('data/loader: candidate failed', url, err && err.message)
      }
    }

    if (!data) {
      console.warn('data/loader: unable to load data.json (candidates tried), using fallback')
      data = {
        name: 'Raphaël Ferreira',
        email: 'contact@azilios.ch',
        highlights: ['C / C++ • Bash • Python', 'Curiosité permanente', 'Code clair • Design minimal'],
        tags: ['Favori', 'All', '42', 'Game', 'C', 'Open Source', 'Sys/Admin'],
        projects: [],
        contactEndpoint: '/contact.php',
      }
    }

    window.DATA = data
    try {
      window.dispatchEvent(new Event('dataUpdated'))
    } catch (e) {}

    return data
  }

  window.loadData = loadData

  window.setProjectData = function (d) {
    window.DATA = d
    try {
      window.dispatchEvent(new Event('dataUpdated'))
    } catch (e) {}
  }

  // Auto-run on DOM ready so modules depending on DATA can react quickly.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadData(), { once: true })
  } else {
    // try immediately
    loadData()
  }
})()
