# Images des projets

Déposez les visuels extraits du portfolio GCG (Portfolio GCG_CI.pdf) ici, un dossier par projet :

    public/projects/<id-du-projet>/cover.jpg
    public/projects/<id-du-projet>/01.jpg
    public/projects/<id-du-projet>/02.jpg

puis référencez-les dans `src/data/projects.ts` (champ `images`, chemins commençant par `/projects/...`).
Tant qu’un projet n’a pas d’image, le site affiche un rendu « plan technique » génératif neutre
(composant `ProjectVisual`), jamais une photo de stock.

Formats conseillés : JPEG/WebP, 2400 px de large maximum pour `cover`, 1600 px pour la galerie.
