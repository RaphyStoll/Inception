# Pages projets – Template réutilisable

Ce dossier contient un **template** pour créer de nouvelles pages projet rapidement, sans écrire de JS/CSS à chaque fois.

## Principe
- Chaque projet est un dossier dans `public/projects/<slug>/`.
- La page `index.html` du projet est **identique** pour tous (copie du template).
- Les données sont dans `data.json` (un seul fichier à éditer pour le contenu).
- Les styles/JS communs sont dans `/assets/css/projects.css` et `/assets/js/projects.js`.

## Créer un nouveau projet (4 étapes)
1. Copier `public/projects/template/` vers `public/projects/mon-projet/`.
2. Renommer `data.example.json` en `data.json` et l'éditer (titre, liens, images...).
3. Placer les images spécifiques dans `public/projects/mon-projet/img/` et référencer par `./img/...` dans `data.json`.
4. Tester en local:
   ```bash
   cd public
   python3 -m http.server 8080
   # ouvrir http://localhost:8080/projects/mon-projet/
   ```

## Schéma des données (`data.json`)
Champs recommandés:
- `title` (string) – requis
- `subtitle` (string)
- `date` (string) – requis
- `status` (string)
- `tags` (string[])
- `cover` (string) – image de couverture (`./img/...`)
- `repo` (URL)
- `live` (URL)
- `doc` (URL)
- `overview` (string) – requis (résumé court)
- `details` (string HTML) – bloc riche optionnel
- `more` (URL) – lien "Plus de détails"
- `kpi` ({label, value}[])
- `features` (string[])
- `stack` (string[])
- `gallery` (string[]) – images pour la section Galerie (un bouton "En voir plus" s'affiche si > 6)

Toutes les sections/boutons sont **optionnels** et s'affichent uniquement si la donnée correspondante existe.

## Conseils chemins
- Images spécifiques: `./img/mon-image.png` (relatif au dossier du projet).
- Assets globaux: `/assets/...` (chemin absolu depuis la racine du site).

## Accessibilité & cohérence
- Ajoutez des textes clairs (titre, overview) ; évitez les blocs trop longs.
- Les boutons `Code source`, `Démo`, `Documentation` s'affichent uniquement si leurs URLs existent.

## Démo du template
- Le template tente de charger `./data.json`, puis se rabat sur `./data.example.json` si absent.
