# GCG — General Constructor Group CI

Site commercial de General Constructor Group (construction & ingénierie, Côte d’Ivoire, depuis 2016) :
patrimoine de projets, expertises, organisation, contact, outils de partage par QR code et documents
pour les appels d’offres. Bilingue français / anglais.

Astro (site statique multi-pages) · React Three Fiber (hero 3D) · GSAP + ScrollTrigger · Lenis ·
Tailwind CSS v4 · Decap CMS (espace de gestion)

Prérequis : **Node.js 20.19+ ou 22.12+** (voir `.nvmrc`) et npm.

```bash
git clone https://github.com/ahmedzribi11/My-web.git
cd My-web
npm install
npm run dev       # développement → http://localhost:4321
npm run build     # build de production (dist/)
npm run preview   # prévisualiser le build → http://localhost:4321
npm run check     # vérification des types
```

## Pages

| Français | English | Contenu |
| --- | --- | --- |
| `/` | `/en` | Accueil : hero 3D, expertises, typologies, projets phares, envergure, présence, publics |
| `/expertises`, `/expertises/<métier>` | `/en/services`, `/en/services/<service>` | Les 8 métiers, chacun avec ses projets |
| `/realisations`, `/realisations/<projet>` | `/en/projects`, `/en/projects/<project>` | Les projets, filtres (secteur, statut, ville, typologie), carte, une page par projet |
| `/a-propos` | `/en/about` | Histoire, chronologie, organisation, moyens matériels, présence |
| `/investir` | `/en/invest` | Investisseurs, hôtellerie, diaspora, entreprises |
| `/contact` | `/en/contact` | Formulaire de demande (envoi WhatsApp ou email), coordonnées |
| `/partager` | `/en/share` | QR codes (site, réseaux, chaque projet), téléchargement SVG/PNG |
| `/partager/affiche` | `/en/share/poster` | Affiche A4 de chantier avec QR code, imprimable |
| `/references` | `/en/references` | Liste de références imprimable (PDF) pour les appels d’offres |
| `/admin` | | Espace de gestion |

Les anciennes adresses `/projets/<projet>` redirigent vers `/realisations/<projet>`.

## Contenu : la règle d’or

Le portfolio **« Portfolio GCG_CI.pdf » est la seule source**. Rien n’est inventé : un champ vide
n’est pas affiché (pas de faux chiffres, clients, certifications ni coordonnées).

| Contenu | Fichier |
| --- | --- |
| Projets (un fichier par projet) | `src/content/projects/<projet>.json` |
| Photos des projets | `src/assets/projects/<projet>/` (optimisées automatiquement en WebP) |
| Coordonnées, réseaux sociaux, vidéo, portfolio PDF | `src/data/settings.json` |
| Expertises | `src/data/services.ts` |
| Organisation, moyens matériels | `src/data/organisation.ts` |
| Publics (page Investir) | `src/data/audiences.ts` |
| Textes de l’interface FR/EN | `src/i18n/index.ts` |
| Villes (carte et filtres) | `src/data/geo.ts` + `CITIES` dans `src/content.config.ts` |

Le schéma des projets est dans `src/content.config.ts` ; le build échoue avec un message clair si un
fichier est incomplet.

## Espace de gestion (/admin)

Decap CMS édite les mêmes fichiers JSON et les enregistre dans GitHub. Chaque enregistrement
déclenche un nouveau déploiement Vercel : le site est à jour en 1 à 2 minutes.

- **Réalisations** : ajouter ou modifier un projet, ses photos (la première sert de couverture),
  le mettre en avant sur l’accueil. La suppression est désactivée, car certains projets illustrent
  des pages.
- **Paramètres** : téléphone, WhatsApp, email, adresse, horaires, Instagram, Facebook, LinkedIn,
  TikTok, YouTube, vidéo de présentation, portfolio PDF. Chaque champ renseigné apparaît
  automatiquement sur le site : boutons WhatsApp, QR codes des réseaux, vidéo, téléchargement du PDF.

### Activer la connexion en production (une seule fois)

1. GitHub → *Settings → Developer settings → OAuth Apps → New OAuth App* :
   - Homepage URL : `https://<domaine>`
   - Authorization callback URL : `https://<domaine>/api/callback`
2. Vercel → projet → *Settings → Environment Variables* : `GITHUB_OAUTH_ID` (Client ID) et
   `GITHUB_OAUTH_SECRET` (Client secret), puis redéployer.
3. Chaque éditeur a besoin d’un compte GitHub ajouté comme collaborateur du dépôt.
4. Ouvrir `https://<domaine>/admin` → *Se connecter*.

Utiliser l’espace de gestion depuis le domaine déclaré dans l’OAuth App.

### Éditer en local, sans GitHub

```bash
npm run cms   # terminal 1 : serveur local Decap (port 8081)
npm run dev   # terminal 2
```

Ouvrir http://localhost:4321/admin → *Se connecter* : les fichiers sont modifiés directement sur le
disque. Il reste à les committer.

## Déploiement (Vercel)

Les réglages sont dans `vercel.json` : framework Astro, `npm run build`, dossier `dist`,
redirections et en-têtes de cache. Les fonctions `api/auth.js` et `api/callback.js` servent à la
connexion de l’espace de gestion.

1. vercel.com → *Add New… → Project* → importer `My-web`, branche de production `main`.
2. Variables d’environnement :
   - `GITHUB_OAUTH_ID`, `GITHUB_OAUTH_SECRET` : espace de gestion (voir plus haut).
   - `SITE_URL` (facultatif) : domaine définitif, par exemple `https://www.gcg-ci.com`.
     Sans lui, Vercel fournit l’URL de production. Il sert aux balises canonical, au sitemap et
     au `robots.txt`.
3. *Domains* : ajouter le nom de domaine de GCG.

Chaque push sur `main` redéploie automatiquement.

## Structure

```
api/                 connexion GitHub de l’espace de gestion (fonctions Vercel)
public/admin/        configuration de l’espace de gestion (config.yml)
public/brand/        logos GCG (blanc, or, vert)
src/assets/projects/ photos des projets
src/components/      en-tête, pied de page, cartes projet, carte de présence, sections de l’accueil
src/content/         projets (JSON)
src/data/            paramètres, expertises, organisation, publics, géographie
src/i18n/            routes et textes FR/EN
src/layouts/         gabarit HTML (SEO, Open Graph, hreflang, données structurées)
src/lib/             accès aux projets et aux paramètres
src/pages/           routes FR et EN
src/scenes/          scènes WebGL du hero (structure, particules, brouillard)
src/scripts/         animations, défilement, QR codes, aperçus
src/styles/          design system (couleurs GCG, typographie, animations)
src/views/           pages partagées entre FR et EN
```

## Expérience et performance

- Pages statiques pré-rendues : HTML immédiat, bon référencement, une adresse par page et par projet.
- Hero 3D : la structure se forme dans le brouillard. Chargé après le contenu, avec 3 niveaux de
  qualité selon l’appareil ; repli statique sans WebGL ou avec `prefers-reduced-motion`.
- Images en WebP responsive (480/960/1600 px) avec repli JPEG ; polices auto-hébergées.
- Transitions entre pages (View Transitions), carte → page projet animée.
