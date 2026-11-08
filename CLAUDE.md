# Aaction Dem – site web

- Générateur statique sans dépendance : `node build.mjs` → `dist/`. Contenus dans `src/content.mjs`, styles `src/styles.css`, JS `src/main.js`.
- Dépôt GitHub : https://github.com/arcuartero/aaction-dem-site — publié automatiquement sur GitHub Pages par `.github/workflows/deploy-pages.yml` à chaque push sur `main`.
- **Après chaque modification validée : `node build.mjs` (vérifier qu'il passe), puis commit et `git push` sur `main`.** C'est ce push qui met à jour la version publique.
- Le site doit rester en `noindex` (variable `SITE_INDEXABLE` non définie) jusqu'à la mise en ligne définitive décidée par le client.
- Images : nouvelles photos dans `src/wix/`, déclarées dans `scripts/import-site-photos.py` et `scripts/image-prompts.json`, puis `python3 -I scripts/import-site-photos.py` et `python3 -I scripts/make-variants.py` (variantes mobiles 768 px, à committer).
- Les chemins du site sont absolus (`/images/...`) ; `BASE_PATH` les préfixe pour GitHub Pages. Ne pas écrire d'URL absolue en dur ailleurs que dans `build.mjs`.
