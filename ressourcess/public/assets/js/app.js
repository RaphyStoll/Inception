// app.js — orchestrateur principal (minimal)
// Conserve quelques fonctions spécifiques à la page et appelle les modules externes (loader, theme, carousel,...)

/**
 * Petit ajustement visuel pour les icônes des cartes de fonctionnalités (assure une transition uniforme).
 */
function refreshFeatureIcons() {
  document.querySelectorAll('.feature-card .icon').forEach((ic) => {
    ic.style.transition = 'color .4s'
  })
}

/**
 * Rendu des badges "highlights" dans le header / la section hero.
 */
function renderHighlights() {
  const hi = document.getElementById('highlights')
  const data = window.DATA
  if (!hi || !data || !Array.isArray(data.highlights)) return
  hi.innerHTML = ''
  data.highlights.forEach((h) => {
    const s = document.createElement('span')
    s.className = 'badge'
    s.textContent = h
    hi.appendChild(s)
  })
}

// Fonctionnalité de flip des cartes de features
const flipOnHover = true
function initializeFlipCards() {
  const featureCards = document.querySelectorAll('.feature-card')
  if (flipOnHover) document.body.classList.add('flip-on-hover')
  else {
    featureCards.forEach((card) => {
      card.addEventListener('click', () => card.classList.toggle('flipped'))
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          card.classList.toggle('flipped')
        }
      })
      card.setAttribute('tabindex', '0')
      card.setAttribute('role', 'button')
      card.setAttribute('aria-label', 'Cliquer pour voir la citation inspirante')
    })
  }
}

/**
 * Met à jour le lien de navigation actif en fonction du défilement.
 */
function setupActiveNavHighlight() {
  // Récupère tous les liens présents dans la nav centrale (hashes et liens pages)
  const navLinks = document.querySelectorAll('.nav-center a')
  const sections = Array.from(document.querySelectorAll('main section[id]'))

  const updateActiveNav = () => {
    const y = window.scrollY + 120
    let currentHash = null
    for (const sec of sections) {
      if (sec.offsetTop <= y && sec.offsetTop + sec.offsetHeight > y) {
        currentHash = '#' + sec.id
        break
      }
    }

    // Pour les pages indépendantes (ex: cv.html), on utilise le pathname courant
    const locPath = window.location.pathname.split('/').pop() || ''

    navLinks.forEach((a) => {
      const href = a.getAttribute('href') || ''
      // cas ancre interne (#about, #projects...)
      if (href.startsWith('#')) {
        if (href === currentHash) {
          a.setAttribute('aria-current', 'page')
          a.classList.add('actif')
        } else {
          a.removeAttribute('aria-current')
          a.classList.remove('actif')
        }
        return
      }

      // cas lien vers une page (cv.html, /cv.html, etc.)
      try {
        const url = new URL(href, window.location.origin)
        const hrefBase = url.pathname.split('/').pop() || ''
        if (hrefBase === locPath && locPath !== '') {
          a.setAttribute('aria-current', 'page')
          a.classList.add('actif')
        } else {
          a.removeAttribute('aria-current')
          a.classList.remove('actif')
        }
      } catch (e) {
        // si href n'est pas une URL valide, on compare simplement la fin de chaîne
        if (href.endsWith(locPath) && locPath !== '') {
          a.setAttribute('aria-current', 'page')
          a.classList.add('actif')
        } else {
          a.removeAttribute('aria-current')
          a.classList.remove('actif')
        }
      }
    })
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true })
  // aussi déclencher au chargement et quand l'historique change
  window.addEventListener('popstate', updateActiveNav)
  updateActiveNav()
}

/**
 * Gestion spécifique de la page CV (cv.html).
 * - Si on est sur cv.html, applique des ajustements visuels et hooks spécifiques.
 * - Cette fonction centralise toute logique dédiée à la page CV.
 */
function setupCvPage() {
  const loc = window.location.pathname.split('/').pop() || ''
  if (loc !== 'cv.html') return

  // Mettre le lien CV en surbrillance dès le chargement (utile si la page est indépendante)
  const cvLink = document.getElementById('cvLink')
  if (cvLink) {
    cvLink.classList.add('actif')
    cvLink.setAttribute('aria-current', 'page')
  }

  // Si besoin d'initialisations CV supplémentaires, les appeler ici.
  // Ex: si cv.js expose une fonction publique pour rafraîchir des éléments, on peut l'appeler.
  // if (typeof window.initCvPage === 'function') window.initCvPage()
}

/**
 * Initialise l'ensemble du script. Compose les petites fonctions et démarre l'application.
 */
async function init() {
  // Charger les données externes avant d'initialiser les widgets qui en dépendent.
  // Utilise le loader central si présent.
  // Charger les données externes seulement si elles ne sont pas déjà disponibles.
  // Certains modules (ex: data/loader.js) peuvent auto-initialiser `window.DATA`.
  if (typeof window.loadData === 'function' && (typeof window.DATA === 'undefined' || window.DATA == null)) {
    try {
      await window.loadData()
    } catch (e) {
      console.warn('app.init: loadData failed', e)
    }
  }

  // Year: preferer l'utilitaire global s'il est présent
  if (typeof window.setYear === 'function') window.setYear()
  else {
    const el = document.getElementById('year')
    if (el) el.textContent = new Date().getFullYear()
  }

  // Theme: si le module theme.js expose setupTheme, l'utiliser
  if (typeof window.setupTheme === 'function') window.setupTheme()

  refreshFeatureIcons()
  renderHighlights()
  initializeFlipCards()

  // About section: if the dedicated module exists, call it; it also auto-inits.
  if (typeof window.initAboutSection === 'function') window.initAboutSection()

  // Contact form: some pages include contact.js which exposes setupContactForm
  if (typeof window.setupContactForm === 'function') window.setupContactForm()

  setupActiveNavHighlight()
  setupCvPage()

  // initialiser le carousel/pagination si présent (extrait dans carousel.js)
  if (typeof window.initCarousel === 'function') {
    window.initCarousel()
  }
}

// Démarrage
document.addEventListener('DOMContentLoaded', init)
