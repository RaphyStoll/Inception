// ui/about.js
// Module pour la section "À propos" (ex- initializeAboutSection)
;(function () {
  'use strict'

  function initializeAboutSection() {
    const aboutItems = document.querySelectorAll('.about-item')
    const aboutPanel = document.getElementById('aboutPanel')
    const allDetails = document.querySelectorAll('.about-details')
    if (!aboutPanel || aboutItems.length === 0) return

    aboutItems.forEach((item) => {
      item.addEventListener('click', () => {
        const aboutType = item.getAttribute('data-about')
        const targetDetail = document.querySelector(`.about-details[data-detail="${aboutType}"]`)
        if (!targetDetail) return
        if (item.classList.contains('active')) {
          item.classList.remove('active')
          aboutPanel.classList.remove('open')
          targetDetail.classList.remove('active')
          return
        }
        aboutItems.forEach((i) => i.classList.remove('active'))
        allDetails.forEach((d) => d.classList.remove('active'))
        item.classList.add('active')
        targetDetail.classList.add('active')
        aboutPanel.classList.add('open')
        setTimeout(() => aboutPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300)
      })
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          item.click()
        }
      })
      item.setAttribute('tabindex', '0')
      item.setAttribute('role', 'button')
    })
  }

  // Expose public init for orchestrator
  window.initAboutSection = initializeAboutSection
})()
