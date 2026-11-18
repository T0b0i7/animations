# Animations — T0b0i7

Collection d'animations web dans **un seul repo**, servies par **une seule GitHub Page**.
Chaque animation possède son propre lien de prévisualisation (un sous-dossier = une URL).

**Hub :** `https://t0b0i7.github.io/animations/`

> Si le repo est renommé, remplace `animations` dans les URLs ci-dessous.
> Les liens du hub sont relatifs : ils continuent de fonctionner quel que soit le nom du repo.

## Liens de prévisualisation

| Animation | Lien | Source |
|---|---|---|
| Galerie (hub) | [/animations/](https://t0b0i7.github.io/animations/) | `index.html` |
| Carrousel 3D | [/animations/3d-animated-carousel/](https://t0b0i7.github.io/animations/3d-animated-carousel/) | `3d-animated-carousel/` |
| Page 404 | [/animations/404-page-not-found/](https://t0b0i7.github.io/animations/404-page-not-found/) | `404-page-not-found/` |
| Login animé | [/animations/animated-login-form/](https://t0b0i7.github.io/animations/animated-login-form/) | `animated-login-form/` |
| Écrans d'authentification | [/animations/auth-screens/](https://t0b0i7.github.io/animations/auth-screens/) | `auth-screens/` |
| Cadeau d'anniversaire | [/animations/birthday-gift-animation/](https://t0b0i7.github.io/animations/birthday-gift-animation/) | `birthday-gift-animation/` |
| Carrousel | [/animations/carousel/](https://t0b0i7.github.io/animations/carousel/) | `carousel/` |
| Break The Glass | [/animations/break-the-glass/](https://t0b0i7.github.io/animations/break-the-glass/) | `break-the-glass/` |
| Cœur de cristal | [/animations/crystal-heart-animation/](https://t0b0i7.github.io/animations/crystal-heart-animation/) | `crystal-heart-animation/` |
| Casque audio | [/animations/headphone-animation/](https://t0b0i7.github.io/animations/headphone-animation/) | `headphone-animation/` |
| Lettre de Saint-Valentin | [/animations/valentine-letter-animation/](https://t0b0i7.github.io/animations/valentine-letter-animation/) | `valentine-letter-animation/` |
| Love Letter | [/animations/proposal-letter/](https://t0b0i7.github.io/animations/proposal-letter/) | `proposal-letter/` |
| Anniversaire interactif | [/animations/interactive-birthday-gift/](https://t0b0i7.github.io/animations/interactive-birthday-gift/) | `interactive-birthday-gift/` (Vite) |
| Iron Man Mark LXXXV | [/animations/iron-man/](https://t0b0i7.github.io/animations/iron-man/) | `iron-man/` (Next.js export) |
| Lamp Login | [/animations/lamp-login/](https://t0b0i7.github.io/animations/lamp-login/) | `lamp-login/` (React + Vite) |

## Structure

```
.
├── index.html               # hub : cartes + aperçus live + copie de lien
├── .nojekyll                # obligatoire : désactive Jekyll sur GitHub Pages
├── .github/workflows/pages.yml
├── 3d-animated-carousel/    # statique
├── 404-page-not-found/      # statique
├── animated-login-form/     # statique
├── auth-screens/            # statique
├── birthday-gift-animation/ # statique
├── break-the-glass/         # statique
├── carousel/                # statique
├── crystal-heart-animation/ # statique (Three.js via CDN)
├── headphone-animation/     # statique
├── valentine-letter-animation/ # statique
├── proposal-letter/         # statique
├── interactive-birthday-gift/ # sources Vite (build CI -> dist)
├── iron-man/                # sources Next.js (export statique CI -> out)
└── lamp-login/              # sources React + Vite (buildée par la CI)
```

## Ajouter une animation

1. Créer un dossier en **kebab-case** avec un `index.html` à sa racine :
   `mon-animation/index.html`.
2. Ajouter l'entrée dans le tableau `animations` du `<script>` de `index.html`.
3. Ajouter la ligne dans le tableau ci-dessus.
4. Push sur `main` → déploiement automatique.

Règles à respecter :

- pas d'espaces ni de majuscules dans les noms de dossiers (URL encodées) ;
- chemins **relatifs** dans le HTML (`./style.css`, pas `/style.css`) ;
- si un projet a un build (Vite, webpack…), l'ajouter au workflow `pages.yml`.

## Déploiement

Le workflow `.github/workflows/pages.yml` :

1. installe et builde `lamp-login` (`npm ci && npm run build`) ;
2. assemble `_site/` = tous les dossiers statiques + `lamp-login/dist` dans `_site/lamp-login/` ;
3. publie sur GitHub Pages.

À faire une seule fois dans **Settings → Pages** : `Source = GitHub Actions`.

### Build local

```bash
cd lamp-login
npm ci
npm run build     # génère lamp-login/dist
```

Le `base` Vite est relatif (`./`), donc le build fonctionne aussi bien dans un sous-dossier
que déployé ailleurs. Pour forcer un chemin absolu :

```bash
VITE_BASE=/animations/lamp-login/ npm run build
```
