// utils/dom.js
// Petits helpers DOM partagés exposés globalement pour compatibilité sans bundler
;(function () {
  'use strict'

  function $(id) {
    return document.getElementById(id)
  }

  function el(id) {
    return document.getElementById(id)
  }

  function qs(selector, root = document) {
    return root.querySelector(selector)
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector))
  }

  function create(tag, attrs = {}, children = []) {
    const node = document.createElement(tag)
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v
      else if (k === 'html') node.innerHTML = v
      else if (k === 'text') node.textContent = v
      else node.setAttribute(k, v)
    })
    children.forEach((c) => node.appendChild(c))
    return node
  }

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

  function setYear() {
    const y = el('year')
    if (y) y.textContent = new Date().getFullYear()
  }

  // Expose helpers globally to keep compatibility avec le code existant
  window.$ = $
  window.el = el
  window.qs = qs
  window.qsa = qsa
  window.create = create
  window.setText = setText
  window.setHTML = setHTML
  window.toggle = toggle
  window.setBtnHref = setBtnHref
  window.setYear = setYear
})()
