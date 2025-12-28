// Carousel / pager extracted from app.js
// S'attend à trouver une variable globale `DATA` définie par app.js
;(function () {
  let activeTag = 'Favori'
  let pageIndex = 0
  let pageSize = 6
  let isMobile = false
  let inited = false

  let tagBar = null
  let grid = null
  let pager = null
  let prevBtn = null
  let nextBtn = null
  let arrowsContainer = null
  let currentPages = []

  function handleResize() {
    const w = window.innerWidth
    isMobile = w < 640
    if (w >= 1024) pageSize = 6
    else if (w >= 640) pageSize = 4
    else pageSize = 6
    renderProjects()
  }

  function renderTags() {
    if (!tagBar) return
    tagBar.innerHTML = ''
    const data = window.DATA
    if (!data || !Array.isArray(data.tags)) return
    data.tags.forEach((t) => {
      const b = document.createElement('button')
      b.className = 'chip' + (t === activeTag ? ' active' : '')
      b.textContent = t
      b.onclick = () => {
        activeTag = t
        pageIndex = 0
        renderProjects()
      }
      tagBar.appendChild(b)
    })
  }

  function getFilteredProjects() {
    const data = window.DATA
    if (!data || !Array.isArray(data.projects)) return []
    return activeTag === 'Favori' ? data.projects : data.projects.filter((p) => p.tags && p.tags.includes(activeTag))
  }

  function renderGrid(items) {
    if (!grid) return
    grid.innerHTML = ''
    items.forEach((p) => {
      const a = document.createElement('a')
      a.href = p.link || '#'
      if (p.link && /^https?:/.test(p.link)) {
        a.target = '_blank'
        a.rel = 'noreferrer noopener'
      }
      a.className = 'card proj'
      a.innerHTML = `<div class="pad">
      <div class="thumb" style="background-image: url('${p.img}');"></div>
      <h3>${p.title} <span style="opacity:.6">↗</span></h3>
      <p style="margin:0;opacity:.9">${p.desc}</p>
      <div class="proj-tags">${(p.tags || []).map((t) => `<span class="badge">${t}</span>`).join('')}</div>
    </div>`
      grid.appendChild(a)
    })
  }

  function renderPager(pages) {
    if (!pager) return
    pager.innerHTML = ''
    pages.forEach((_, i) => {
      const d = document.createElement('button')
      d.className = 'dot' + (i === pageIndex ? ' active' : '')
      d.onclick = () => {
        pageIndex = i
        renderProjects()
      }
      pager.appendChild(d)
    })
  }

  function renderProjects() {
    renderTags()
    const arr = getFilteredProjects()
    const pages = []
    if (isMobile) {
      pages.push(arr)
      pageIndex = 0
    } else {
      for (let i = 0; i < arr.length; i += pageSize) pages.push(arr.slice(i, i + pageSize))
      if (pageIndex >= pages.length) pageIndex = 0
    }
    currentPages = pages
    const current = pages[pageIndex] || []
    renderGrid(current)
    renderPager(pages)

    if (isMobile) {
      grid.setAttribute('aria-label', 'Liste de projets défilable horizontalement')
      grid.scrollLeft = 0
    } else if (grid) {
      grid.removeAttribute('aria-label')
    }

    // mettre à jour l'état des boutons (désactivés si pas de pages ou page unique)
    const pageCount = pages.length
    if (prevBtn) {
      prevBtn.disabled = pageCount <= 1
      prevBtn.setAttribute('aria-disabled', pageCount <= 1 ? 'true' : 'false')
    }
    if (nextBtn) {
      nextBtn.disabled = pageCount <= 1
      nextBtn.setAttribute('aria-disabled', pageCount <= 1 ? 'true' : 'false')
    }
    // masquer complètement les flèches si on est en mobile (au cas où d'autres règles CSS interviennent)
    if (arrowsContainer) {
      if (isMobile) arrowsContainer.classList.add('no-arrows')
      else arrowsContainer.classList.remove('no-arrows')
    }
  }

  // Appel public pour initialiser le carousel. Doit être exécuté après le chargement du DOM
  function initCarousel() {
    if (inited) {
      // si déjà initialisé, on force un rendu propre (utile aux rafraîchissements)
      renderProjects()
      return
    }
    inited = true
    tagBar = document.getElementById('tagBar')
    grid = document.getElementById('grid')
    pager = document.getElementById('pager')
    prevBtn = document.getElementById('prevPage')
    nextBtn = document.getElementById('nextPage')
    arrowsContainer = document.querySelector('.arrows')

    // Si les boutons n'existent pas dans le DOM (nous avons retiré les boutons statiques
    // de `index.html`), les créer dynamiquement ici et les insérer dans `.arrows`.
    if (arrowsContainer) {
      if (!prevBtn) {
        prevBtn = document.createElement('button')
        prevBtn.className = 'left'
        prevBtn.id = 'prevPage'
        prevBtn.setAttribute('aria-label', 'Page précédente')
        prevBtn.textContent = '◀'
        arrowsContainer.insertBefore(prevBtn, grid)
      }
      if (!nextBtn) {
        nextBtn = document.createElement('button')
        nextBtn.className = 'right'
        nextBtn.id = 'nextPage'
        nextBtn.setAttribute('aria-label', 'Page suivante')
        nextBtn.textContent = '▶'
        // insérer après la grille
        if (grid && grid.nextSibling) arrowsContainer.insertBefore(nextBtn, grid.nextSibling)
        else arrowsContainer.appendChild(nextBtn)
      }
    }

    // handlers pour les flèches — définis une fois et lisent `currentPages` à chaque utilisation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const pages = currentPages || []
        if (pages.length <= 1) return
        pageIndex = (pageIndex - 1 + pages.length) % pages.length
        renderProjects()
      })
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const pages = currentPages || []
        if (pages.length <= 1) return
        pageIndex = (pageIndex + 1) % pages.length
        renderProjects()
      })
    }

    window.addEventListener('resize', handleResize)
    // réagir aux changements de données (loadData dispatch 'dataUpdated')
    window.addEventListener('dataUpdated', () => {
      // reset pageIndex si nécessaire
      pageIndex = 0
      renderProjects()
    })

    handleResize() // initial layout + render
  }

  // Expose l'initialiseur globalement pour que `app.js` puisse l'appeler
  window.initCarousel = initCarousel
  // Permet de forcer un rafraîchissement depuis la console ou d'autres modules
  window.refreshCarousel = function () {
    pageIndex = 0
    renderProjects()
  }

  // Robust startup: handle cases where dataUpdated fired before this module
  // was ready, or where window.DATA is already present.
  ;(function ensureInit() {
    function tryInitNow() {
      // Si le DOM est prêt, initialiser; sinon, attendreDOMContentLoaded
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (typeof window.initCarousel === 'function') window.initCarousel()
      } else {
        document.addEventListener(
          'DOMContentLoaded',
          () => {
            if (typeof window.initCarousel === 'function') window.initCarousel()
          },
          { once: true }
        )
      }
    }

    // If DATA is already present, try init now. If not, and a global loader exists,
    // attempt to load data here to avoid a stale state where no dataUpdated event
    // will ever arrive (eg. when page opened via file:// or loader wasn't executed).
    if (window.DATA) {
      tryInitNow()
    } else if (typeof window.loadData === 'function') {
      // attempt to fetch data, then init
      try {
        window.loadData()
          .then(() => {
            tryInitNow()
          })
          .catch((e) => {
            console.warn('carousel: loadData fallback failed', e)
            tryInitNow()
          })
      } catch (e) {
        console.warn('carousel: loadData threw', e)
        tryInitNow()
      }
    }

    // Si un 'dataUpdated' arrive plus tard (ou est raté), s'assurer qu'on
    // initialise ou qu'on rafraîchit proprement.
    window.addEventListener('dataUpdated', () => {
      if (!inited) tryInitNow()
      else if (typeof window.refreshCarousel === 'function') window.refreshCarousel()
    })
  })()
})()
