// Logique partagée pour les pages projets
// Charge ./data.json (fallback ./data.example.json), remplit les conteneurs et gère les sections optionnelles.

;(function () {
  'use strict'

  // Sélecteurs utilitaires
  const el = (id) => document.getElementById(id)
  const qs = (s, r = document) => r.querySelector(s)
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s))

  function setText(id, text) {
    const node = el(id)
    if (node) node.textContent = text || ''
  }
  function setHTML(id, html) {
    const node = el(id)
    if (node) node.innerHTML = html || ''
  }
  function toggle(id, condition) {
    const node = el(id)
    if (!node) return
    node.style.display = condition ? '' : 'none'
  }
  function setBtnHref(id, href) {
    const node = el(id)
    if (!node) return
    if (href) {
      node.href = href
      node.style.display = 'inline-flex'
    } else {
      node.style.display = 'none'
    }
  }

  function renderTags(tags) {
    const tg = el('tags')
    if (!tg) return
    tg.innerHTML = ''
    ;(tags || []).forEach((t) => {
      const s = document.createElement('span')
      s.className = 'badge'
      s.textContent = t
      tg.appendChild(s)
    })
  }

  function renderList(id, arr, asHTML = false) {
    const ul = el(id)
    if (!ul) return
    ul.innerHTML = ''
    ;(arr || []).forEach((text) => {
      const li = document.createElement('li')
      if (asHTML) li.innerHTML = text
      else li.textContent = text
      ul.appendChild(li)
    })
  }

  function renderKpi(kpis) {
    const kpi = el('kpi')
    if (!kpi) return
    kpi.innerHTML = ''
    ;(kpis || []).forEach((kv) => {
      const s = document.createElement('span')
      s.textContent = `${kv.label}: ${kv.value}`
      kpi.appendChild(s)
    })
  }

  function setCover(src) {
    const cover = el('cover')
    if (!cover) return
    if (src) cover.style.backgroundImage = `url('${src}')`
    else cover.style.backgroundImage = ''
  }

  // Galerie simple + "en voir plus" (affiche tout si <= 6, sinon bouton pour dérouler)
  function renderGallery(images) {
    const gal = el('gallery')
    if (!gal) return
    gal.innerHTML = ''
    const list = images || []
    if (!list.length) {
      // Pas de galerie → cacher la section si son titre existe
      const section = gal.closest('.section')
      if (section) section.style.display = 'none'
      return
    }

    const initial = list.slice(0, 6)
    const rest = list.slice(6)
    initial.forEach((src) => gal.appendChild(makeImg(src)))

    if (rest.length) {
      const moreWrap = document.createElement('div')
      moreWrap.id = 'galleryMore'
      moreWrap.className = 'gallery hidden'
      rest.forEach((src) => moreWrap.appendChild(makeImg(src)))

      const moreBtn = document.createElement('button')
      moreBtn.className = 'btn'
      moreBtn.type = 'button'
      moreBtn.textContent = 'En voir plus'
      moreBtn.addEventListener('click', () => {
        moreWrap.classList.toggle('hidden')
        moreBtn.textContent = moreWrap.classList.contains('hidden') ? 'En voir plus' : 'Réduire'
      })

      // Insérer après la grille initiale
      gal.parentElement.appendChild(moreWrap)
      const holder = document.createElement('div')
      holder.style.marginTop = '10px'
      holder.appendChild(moreBtn)
      gal.parentElement.appendChild(holder)
    }
  }

  function makeImg(src) {
    const img = new Image()
    img.loading = 'lazy'
    img.src = src
    return img
  }

  function setYear() {
    const y = el('year')
    if (y) y.textContent = new Date().getFullYear()
  }

  async function fetchData() {
    // Tente data.json, sinon data.example.json pour permettre d'ouvrir le template sans config
    try {
      const res = await fetch('./data.json', { cache: 'no-cache' })
      if (res.ok) return await res.json()
      throw new Error('data.json non trouvé')
    } catch (_) {
      try {
        const res2 = await fetch('./data.example.json', { cache: 'no-cache' })
        if (res2.ok) return await res2.json()
        throw new Error('data.example.json non trouvé')
      } catch (err) {
        console.error('[projects.js] Impossible de charger les données', err)
        return null
      }
    }
  }

  function render(data) {
    if (!data) return
    // Titres et métas
    setText('title', data.title)
    setText('subtitle', data.subtitle)
    setText('date', data.date)
    setText('status', data.status)

    // Cover & tags
    setCover(data.cover)
    renderTags(data.tags)

    // Boutons
    setBtnHref('repoBtn', data.repo)
    setBtnHref('liveBtn', data.live)
    setBtnHref('docBtn', data.doc)

    // Contenu
    // Le champ "overview" peut contenir du HTML léger (br, strong, em) dans nos données locales,
    // on l'injecte donc via innerHTML. Les données viennent du repo (source de confiance).
    if (data.overview) setHTML('overview', data.overview)
    if (data.details) setHTML('details', data.details)

    const moreBtn = el('moreBtn')
    if (moreBtn) {
      if (data.more) {
        moreBtn.href = data.more
        moreBtn.style.display = 'inline-flex'
      } else {
        moreBtn.style.display = 'none'
      }
    }

    renderKpi(data.kpi)
    // features peut contenir des balises HTML (ex: <strong>…</strong>)
    renderList('features', data.features, true)
    renderList('stack', data.stack)

    renderGallery(data.gallery)
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      setYear()
      const data = await fetchData()
      render(data)
    } catch (err) {
      console.error("[projects.js] Erreur d'initialisation", err)
    }
  })
})()
