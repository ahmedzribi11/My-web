# My-web — Site vitrine GCG

Site professionnel une page (HTML/CSS/JS, sans dépendance ni build) pour la société GCG.

## Structure

- `index.html` : contenu (accueil, à propos, services, réalisations, valeurs, références, contact)
- `styles.css` : mise en page et design responsive
- `script.js` : menu mobile, filtres du portfolio, animations, formulaire de contact (via `mailto:`)

## Aperçu local

Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

puis aller sur http://localhost:8000.

## Personnalisation

Tous les textes entre `[crochets]` sont à remplacer par le contenu réel de la société
(présentation, services, projets, chiffres clés, coordonnées).

- **Chiffres clés** : dans `index.html`, remplacer `data-count=""` par la valeur (ex. `data-count="15"`) ; le compteur s'anime automatiquement.
- **Photos de projets** : placer les images dans un dossier `images/` et remplacer le contenu de `.project-img` par `<img src="images/projet1.jpg" alt="…">`.
- **Adresse e-mail du formulaire** : modifier `CONTACT_EMAIL` dans `script.js`.
- **Couleurs** : variables en tête de `styles.css` (`--navy`, `--accent`…).

## Mise en ligne

Le site est statique : il peut être publié tel quel sur GitHub Pages, Netlify, Vercel ou tout hébergeur web.
