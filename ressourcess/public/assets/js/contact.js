/**
 * Connecte le formulaire de contact pour envoyer un POST vers l'endpoint serveur.
 */
function setupContactForm() {
  const form = document.getElementById('contactForm')
  if (!form) return
  const statusEl = document.getElementById('formStatus')
  const sendBtn = document.getElementById('sendBtn')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (document.getElementById('company').value) {
      // honeypot rempli — abandonner silencieusement
      return
    }
    if (sendBtn) sendBtn.disabled = true
    if (sendBtn) sendBtn.textContent = 'Envoi…'
    if (statusEl) statusEl.textContent = ''
    try {
      const formData = new FormData(form)
      const endpoint = (window.DATA && window.DATA.contactEndpoint) || '/contact.php'
      const res = await fetch(endpoint, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        if (statusEl) {
          statusEl.style.color = 'green'
          statusEl.textContent = data.message || 'Message envoyé. Merci !'
        }
        form.reset()
      } else {
        if (statusEl) {
          statusEl.style.color = 'crimson'
          if (data.errors && data.errors.length > 0) {
            statusEl.innerHTML = '<strong>Erreurs :</strong><br>' + data.errors.join('<br>')
          } else {
            statusEl.textContent = 'Oups, une erreur est survenue. Réessaie plus tard.'
          }
        }
      }
    } catch (err) {
      if (statusEl) {
        statusEl.style.color = 'crimson'
        statusEl.textContent = 'Erreur réseau. Réessaie.'
      }
    }
    if (sendBtn) sendBtn.disabled = false
    if (sendBtn) sendBtn.textContent = 'Envoyer'
  })
}
