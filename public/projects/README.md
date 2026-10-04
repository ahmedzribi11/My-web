# Images des projets

Visuels extraits du portfolio GCG (« Portfolio GCG_CI.pdf »), un dossier par projet :

    public/projects/<id-du-projet>/01.jpg   ← visuel principal
    public/projects/<id-du-projet>/02.jpg …

Les `id` correspondent à `src/data/projects.ts`. Pour remplacer un visuel, garder le même nom
de fichier ; pour en ajouter, incrémenter le numéro et ajuster le nombre dans `imgs('<id>', N)`.
Formats : JPEG, 1600 px de large maximum.
