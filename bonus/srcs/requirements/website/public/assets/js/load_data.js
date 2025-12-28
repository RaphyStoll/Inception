/**
 * Charge les données depuis `assets/data/data.json` et les expose en global `window.DATA`.
 * En cas d'échec, on retombe sur un objet minimal inline pour garder le site fonctionnel.
 */
async function loadData() {
  try {
    const res = await fetch('/assets/data/data.json')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const d = await res.json()
    window.DATA = d
    // notifier les modules qui peuvent écouter les changements de données
    try {
      window.dispatchEvent(new Event('dataUpdated'))
    } catch (e) {}
  } catch (err) {
    console.error('Impossible de charger assets/data/data.json — fallback vers valeurs inline', err)
    window.DATA = {
      name: 'Raphaël Ferreira',
      email: 'contact@azilios.ch',
      highlights: ['C / C++ • Bash • Python', 'Curiosité permanente', 'Code clair • Design minimal'],
      tags: ['Favori', 'All', '42', 'Game', 'C', 'Open Source', 'Sys/Admin'],
      projects: [
        {
          slug: 'Libft',
          title: 'Libft',
          desc: 'Recode la standard libc',
          tags: ['Favori', 'All', '42', 'C'],
          img: '.../../assets/img/libft_cover.png',
          link: 'projects/libft/libft.html',
        },
      ],
      contactEndpoint: '/contact.php',
    }
    try {
      window.dispatchEvent(new Event('dataUpdated'))
    } catch (e) {}
  }
}
