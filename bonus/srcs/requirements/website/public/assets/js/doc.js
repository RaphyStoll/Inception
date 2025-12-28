// doc.js — TOC (sommaire) + boutons Copier pour les blocs de code
;(function () {
  'use strict'

  function slugify(text) {
    return (text || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  function ensureHeadingIds(container) {
    const headings = container.querySelectorAll('h2, h3')
    const used = new Set()
    headings.forEach((h) => {
      if (!h.id) {
        let base = slugify(h.textContent)
        let id = base
        let i = 2
        while (!id || used.has(id) || document.getElementById(id)) {
          id = `${base}-${i++}`
        }
        h.id = id
        used.add(id)
      }
    })
    return headings
  }

  function buildToc(headings, target) {
    if (!headings.length || !target) return
    const ul = document.createElement('ul')
    ul.className = 'toc-list'

    let currentUl = ul
    let lastLevel = 2

    headings.forEach((h) => {
      const level = Number(h.tagName.substring(1)) // 2 or 3
      if (level > lastLevel) {
        const nested = document.createElement('ul')
        nested.className = 'toc-list nested'
        const lastLi = currentUl.lastElementChild
        if (lastLi) lastLi.appendChild(nested)
        currentUl = nested
      } else if (level < lastLevel) {
        currentUl = currentUl.parentElement.closest('ul') || ul
      }
      lastLevel = level

      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = `#${h.id}`
      a.textContent = h.textContent
      li.appendChild(a)
      currentUl.appendChild(li)
    })

    target.innerHTML = ''
    target.appendChild(ul)
  }

  function enhanceCodeBlocks(container) {
    const blocks = container.querySelectorAll('pre > code')
    blocks.forEach((code) => {
      const pre = code.parentElement
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block'
      pre.parentNode.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'copy-btn'
      btn.setAttribute('aria-label', 'Copier le code')
      btn.textContent = 'Copier'
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.innerText)
          const old = btn.textContent
          btn.textContent = 'Copié !'
          btn.classList.add('copied')
          setTimeout(() => {
            btn.textContent = old
            btn.classList.remove('copied')
          }, 1600)
        } catch (err) {
          console.error('Copie impossible', err)
        }
      })
      wrapper.appendChild(btn)
    })
  }

  function setYear() {
    const y = document.getElementById('year')
    if (y) y.textContent = new Date().getFullYear()
  }

  document.addEventListener('DOMContentLoaded', () => {
    setYear()

    const doc = document.getElementById('doc') || document.querySelector('.doc-content') || document
    const toc = document.getElementById('toc')

    const headings = ensureHeadingIds(doc)
    buildToc(headings, toc)
    enhanceCodeBlocks(doc)
  })
})()
