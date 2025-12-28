// Données CV et rendu DOM léger
// Option d'intégration WakaTime (via clé de partage publique, pas la clé secrète!)
// Pour activer: passez enabled à true et remplissez user + shareKey.
const WAKATIME = {
  enabled: false, // passez à true pour activer
  user: 'raphystoll', // ex: 'raphystoll' (votre username WakaTime)
  shareKey: '', // ex: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' (clé de partage)
  range: 'last_30_days', // 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year'
}
const CV = {
  name: 'Raphaël Ferreira',

  role: 'Étudiant 42 – C/C++',
  avatar: 'assets/img/raphalme.jpg',
  about: `Étudiant à 42 Lausanne. Passionné par le C/C++, le bas niveau et la création d'outils utiles.
Je privilégie le code lisible, testé et documenté.`,
  links: [
    { label: 'Email', href: '#contact' },
    { label: 'GitHub', href: 'https://github.com/RaphyStoll', external: true },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/raphaël-ferreira',
      external: true,
    },
  ],
  skills: [
    { name: 'C', level: 90 },
    { name: 'C++', level: 75 },
    { name: 'Python', level: 50 },
  ],
  experiences: [
    {
      period: '2023 - 2024',
      title: 'Electricien CDD',
      company: 'Magnetic emploi',
      tags: ['Electriciter', 'récupération'],
      desc: `Divers mission, depanage, maintenance, renovation, rack informatique`,
    },
    {
      period: '6mois 2023',
      title: 'Electricien CDD',
      company: 'SVEM',
      tags: ['Electriciter', 'récupération'],
      desc: `Réparation de divers items, maintenance, mise au norme d'installation`,
    },
    {
      period: '2018 – 2021',
      title: 'Electricien CDI',
      company: 'Sedelec SA',
      tags: ['Electriciter', "Gestion d' équipe", 'auto-gestion'],
      desc: `Spécialisation en CSV`,
    },
  ],
  education: [
    {
      title: '42 Lausanne',
      subtitle: 'Cursus Software Engineering',
      year: '2023 – en cours',
    },
    {
      title: 'CFPC',
      subtitle: "CFC d'électricien de montage",
      year: '2015 – 2018',
    },
  ],
}

function $(id) {
  return document.getElementById(id)
}
function create(tag, attrs = {}, children = []) {
  const el = document.createElement(tag)
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v
    else if (k === 'html') el.innerHTML = v
    else if (k === 'text') el.textContent = v
    else el.setAttribute(k, v)
  })
  children.forEach((c) => el.appendChild(c))
  return el
}

function render() {
  // Header infos
  $('name').textContent = CV.name
  $('role').textContent = CV.role
  const avatar = $('avatar')
  avatar.src = CV.avatar
  avatar.alt = `Photo de ${CV.name}`
  $('about').textContent = CV.about

  // Links (si pas statique)
  const links = $('links')
  if (links && !links.hasAttribute('data-static')) {
    CV.links.forEach((l) => {
      const a = document.createElement('a')
      a.className = 'btn ghost'
      a.textContent = l.label
      a.href = l.href
      if (l.external) {
        a.target = '_blank'
        a.rel = 'noreferrer noopener'
      }
      links.appendChild(a)
    })
  }

  // Skills
  const skills = $('skills')
  const renderSkills = (items) => {
    skills.innerHTML = ''
    items.forEach((s) => {
      const row = create('div', { class: 'skill' }, [
        create('div', {
          class: 'muted',
          text: s.name + (s.note ? ` (${s.note})` : ''),
        }),
        (function () {
          const bar = create('div', { class: 'bar' })
          const fill = create('span')
          fill.style.width = Math.max(0, Math.min(100, s.level)) + '%'
          bar.appendChild(fill)
          return bar
        })(),
      ])
      skills.appendChild(row)
    })
  }
  renderSkills(CV.skills)

  // Timeline
  const tl = $('timeline')
  CV.experiences.forEach((xp) => {
    const item = create('div', { class: 'xp' }, [
      create('div', { class: 'head' }, [
        create('span', { class: 'period', text: xp.period }),
        create('span', { class: 'title', text: xp.title }),
        create('span', { class: 'company', html: ' • ' + xp.company }),
      ]),
      create(
        'div',
        { class: 'tags' },
        xp.tags.map((t) => create('span', { class: 'badge', text: t }))
      ),
      create('div', { class: 'desc', text: xp.desc }),
    ])
    tl.appendChild(item)
  })

  // Education
  const edu = $('education')
  CV.education.forEach((e) => {
    const card = create('div', { class: 'card' }, [
      create('div', { class: 'pad' }, [
        create('div', { class: 'small muted', text: e.year }),
        create('div', { html: `<strong>${e.title}</strong>` }),
        create('div', { class: 'muted', text: e.subtitle || '' }),
      ]),
    ])
    edu.appendChild(card)
  })

  // Year footer
  const yearEl = document.getElementById('year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()
}

// --- WakaTime integration ---
async function fetchWakaTime() {
  if (!WAKATIME.enabled || !WAKATIME.user || !WAKATIME.shareKey) return null
  const url = `https://wakatime.com/api/v1/users/${encodeURIComponent(WAKATIME.user)}/stats/${encodeURIComponent(
    WAKATIME.range
  )}?api_key=${encodeURIComponent(WAKATIME.shareKey)}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    return data?.data?.languages || null
  } catch (err) {
    console.warn('[wakatime] échec de la récupération', err)
    return null
  }
}

function groupLanguages(langs) {
  if (!Array.isArray(langs)) return []
  const buckets = {}
  const mapName = (n) => {
    const name = (n || '').toLowerCase()
    if (name === 'c++' || name === 'cpp') return 'C++'
    if (name === 'c') return 'C'
    if (name === 'shell' || name === 'bash') return 'Bash'
    if (name === 'objective-c') return 'Objective-C'
    if (name === 'typescript') return 'TypeScript'
    if (name === 'javascript') return 'JavaScript'
    if (name === 'markdown') return 'Markdown'
    if (name === 'json') return 'JSON'
    return n || 'Autre'
  }
  langs.forEach((l) => {
    const key = mapName(l.name)
    const secs = l.total_seconds || 0
    if (!buckets[key]) buckets[key] = 0
    buckets[key] += secs
  })
  // Option: fusionner C et C++ en "C/C++"
  if (buckets['C'] && buckets['C++']) {
    buckets['C/C++'] = (buckets['C'] || 0) + (buckets['C++'] || 0)
    delete buckets['C']
    delete buckets['C++']
  }
  // Créer tableau trié
  const arr = Object.entries(buckets)
    .map(([name, secs]) => ({ name, secs }))
    .sort((a, b) => b.secs - a.secs)
  // Garder top 8
  return arr.slice(0, 8)
}

function secondsToNote(secs) {
  const h = secs / 3600
  if (h < 1) return `${Math.round(secs / 60)}m`
  if (h < 48) return `${h.toFixed(1)}h`
  const d = h / 24
  return `${d.toFixed(1)}j`
}

function wakaToSkills(langArr) {
  if (!Array.isArray(langArr) || langArr.length === 0) return []
  const max = Math.max(...langArr.map((l) => (l.secs || l.secs === 0 ? l.secs : 1)))
  return langArr.map((l) => {
    const level = max > 0 ? Math.round((l.secs / max) * 100) : 0
    return {
      name: l.name,
      level: Math.min(100, Math.max(8, level)),
      note: secondsToNote(l.secs),
    }
  })
}

async function enhanceSkillsWithWakaTime() {
  const langs = await fetchWakaTime()
  if (!langs) return // fallback: garder compétences statiques
  const grouped = groupLanguages(langs)
  const skills = wakaToSkills(grouped)
  // Rendu
  const container = document.getElementById('skills')
  if (container) {
    container.innerHTML = ''
    skills.forEach((s) => {
      const row = create('div', { class: 'skill' }, [
        create('div', {
          class: 'muted',
          text: s.name + (s.note ? ` (${s.note})` : ''),
        }),
        (function () {
          const bar = create('div', { class: 'bar' })
          const fill = create('span')
          fill.style.width = s.level + '%'
          bar.appendChild(fill)
          return bar
        })(),
      ])
      container.appendChild(row)
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  render()
  enhanceSkillsWithWakaTime()
})
