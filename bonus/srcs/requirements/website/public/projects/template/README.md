Template projet
===============

Ce dossier contient un template réutilisable pour créer de nouvelles pages projet.

Comment utiliser
-----------------
1. Dupliquer le dossier `public/projects/template` et renommer (ex: `public/projects/mon-projet`).
2. Ouvrir `index.html` dupliqué et remplacer :
   - le titre (`<title>` et `#title`)
   - le contenu de `#subtitle`, `#overview`, `#features`, `#stack`
   - remplacer la `#cover` (background-image via CSS inline ou image locale)
   - mettre à jour les liens `repoBtn`, `liveBtn`, `docBtn` si nécessaire
3. Garder les scripts tels quels (ils s'attendent à trouver `window.DATA` exposé par `app.js`).

Notes
-----
- Le carousel est prévu pour être en bas de la page (juste avant la section `#contact`) afin d'être cohérent avec la plupart des pages projets.
- Si vous souhaitez créer une page projet légère sans le bootstrap complet, je peux ajouter un `data-loader.js` minimal qui ne charge que `assets/data/data.json` et émet `dataUpdated`.

Bon workflow : dupliquez le dossier, modifiez le contenu et testez localement dans un serveur (ex: `python -m http.server` depuis le dossier `public`).
