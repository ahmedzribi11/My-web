# Journal des modifications

Une entrée par mise en production (fusion dans `main`, déployée automatiquement). Les modifications de
contenu faites par GCG dans `/admin` sont tracées dans l’historique Git (« Mise à jour : … ») et résumées
dans les rapports de maintenance. Format : date, ce qui change pour les visiteurs et pour GCG, puis le détail
technique.

## Non publié (branche `portfolio-content`)

Mise au niveau « production » selon la grille qualité (245 critères) :

- **Rapidité** : JavaScript divisé par 40 (367 Ko → 5 à 9 Ko compressés par page) ; animation d’ouverture
  légère qui s’arrête au bout de 4 s ; polices allégées ; images en 15 tailles, au plus juste pour chaque écran.
  Lighthouse mobile : performance 99 à 100, accessibilité, bonnes pratiques et SEO à 100 sur les 7 modèles de page.
- **Accessibilité** : 0 erreur axe sur 23 pages en mobile et ordinateur ; contrastes, navigation au clavier,
  visionneuse de photos accessible, lien d’évitement, aucun débordement de 320 à 1 920 px.
- **Formulaire de contact** : envoi par e-mail à GCG (Resend), 6 champs, messages d’erreur en français et en
  anglais, protection anti-robots, pages de confirmation et d’erreur ; WhatsApp et e-mail restent possibles.
- **Pages légales** : mentions légales et politique de confidentialité FR/EN (identité de l’entreprise à
  compléter par GCG).
- **Espace de gestion** : circuit brouillon → relecture → publication, contrôles de contenu en français,
  description de chaque photo en FR et EN, nature des images (photo, perspective, plan), autorisation du
  client final, version anglaise « à traduire » tant qu’elle n’est pas relue, documents PDF.
- **Sécurité** : politique de sécurité du contenu (CSP) stricte, en-têtes HSTS, protection contre
  l’intégration en cadre, espace de gestion isolé, déconnexion après 8 h d’inactivité.
- **Référencement** : titres et descriptions uniques, fil d’Ariane, données structurées, pages d’aperçu en
  `noindex`, adresses de QR codes permanentes (`/qr/...`) avec marquage des campagnes.
- **Hébergement** : fichiers prêts pour Cloudflare Pages en plus de Vercel (changement d’hébergeur en moins
  d’une heure).
- **Qualité** : contrôles automatiques à chaque modification (types, contenu, liens, HTML, accessibilité,
  budgets Lighthouse, secrets, dépendances).
- **Dossier de remise** (`docs/`) : architecture, procédures, registre des comptes, guide de l’éditeur,
  charte rédactionnelle, registre des droits, fiche de faits, inventaire des composants.

## 4 octobre 2026 — site bilingue multipage (PR #3)

Refonte complète : site Astro statique, français et anglais, pages Réalisations, Expertises, À propos,
Investir, Contact, Partager (QR codes, affiche de chantier), Références imprimables, espace de gestion Decap CMS.

## 4 octobre 2026 — projets et identité GCG (PR #2)

Les 34 projets du portfolio avec leurs photos ; logo, couleurs, organisation et moyens matériels de GCG.

## 3 octobre 2026 — première version (PR #1)

Site d’une page avec hero 3D.
