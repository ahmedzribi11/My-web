# GCG — General Constructor Group

Site vitrine cinématique de General Constructor Group (construction & ingénierie).

React · TypeScript · Vite · Three.js / React Three Fiber · GSAP + ScrollTrigger · Lenis · Tailwind CSS v4

Prérequis : **Node.js 20.19+ ou 22.12+** (voir `.nvmrc`) et npm.

```bash
git clone https://github.com/ahmedzribi11/My-web.git
cd My-web
git checkout gcg-website   # inutile une fois fusionné dans main
npm install
npm run dev       # développement → http://localhost:5173
npm run build     # typecheck + build de production (dist/)
npm run preview   # prévisualiser le build → http://localhost:4173
```

## Structure

```
src/
  animations/   GSAP, ScrollTrigger, Lenis, état partagé DOM ↔ WebGL (heroState)
  components/   Nav, curseur, boutons magnétiques, visuels, fiche projet (modal)
  data/         projects.ts · expertise.ts · site.ts  ← contenu éditable
  hooks/        useGsap, useInView
  lib/          détection d’appareil, routage des fiches projet, contexte
  scenes/       scènes WebGL (hero, atmosphère finale), shaders, structure procédurale
  sections/     Hero, Savoir-faire, Expertise, Projets (+ index), Processus, À propos, Contact
  styles/       tokens de design et styles globaux
```

## Contenu — règle d’or

Le portfolio **« Portfolio GCG_CI.pdf » est la seule source de vérité**. Aucune donnée n’est inventée :
un champ non renseigné n’est simplement pas affiché.

- **Projets** : `src/data/projects.ts`. Seul *Green City* est entièrement documenté à ce jour ; les autres
  projets n’ont que leur nom (et une catégorie lorsqu’elle découle sans ambiguïté du nom). Compléter
  lieu, année, surface, composition, missions et statut depuis le PDF.
- **Images** : déposer les visuels dans `public/projects/<id>/` et les référencer dans `images`
  (voir `public/projects/README.md`). Sans image, un rendu « élévation schématique » génératif est affiché.
- **Coordonnées** : `src/data/site.ts` → `contact.email`, `contact.phone`, `contact.address`.
  Le bouton « Contactez GCG » devient un lien `mailto:` dès qu’un email est renseigné.

## Expérience & performance

- Intro hero chorégraphiée (~15 s) : noir → particules → brouillard → structure formée de particules
  → construction des volumes → travelling caméra → typographie → CTA. Toute interaction (scroll, touche,
  bouton « Passer l’intro ») l’accélère ; elle est raccourcie sur mobile et lors d’une seconde visite.
- Rendu adaptatif : 3 niveaux (particules, couches de brouillard, résolution) selon l’appareil ;
  la résolution baisse si le framerate chute, puis repli CSS/SVG si nécessaire. Sans WebGL ou avec
  `prefers-reduced-motion`, une version statique/légère est servie.
- Three.js est chargé à la demande (chunk séparé) ; les scènes sont mises en pause hors écran.
- Polices auto-hébergées (Geist / Geist Mono).

## Déploiement (Vercel)

1. vercel.com → *Add New… → Project* → importer le dépôt GitHub `My-web`.
2. Branche de production : `main` (ou `gcg-website` tant que la PR n’est pas fusionnée).
3. Les réglages sont lus depuis `vercel.json` (Vite, `npm run build`, dossier `dist`) → *Deploy*.

Chaque push redéploie automatiquement. Les fiches projet ont des URL propres (`/projets/<id>`) :
`vercel.json` (Vercel) et `public/_redirects` (Netlify) renvoient ces routes vers `index.html`.
Une fois le domaine connu, ajouter `<link rel="canonical">`, une URL absolue pour `og:image`
et un `sitemap.xml`.
