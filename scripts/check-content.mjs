/**
 * Contrôle du contenu avant chaque build (MODEL-05/07/13, PERF-17, MEDIA-07/11).
 * Le build échoue avec un message en français si une règle bloquante n’est pas respectée ;
 * les avertissements n’arrêtent pas le build.
 *
 *   node scripts/check-content.mjs            contrôle
 *   node scripts/check-content.mjs --update   ajoute les nouveaux projets au registre des adresses publiées
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import sharp from 'sharp'

const ROOT = resolve(import.meta.dirname, '..')
const PROJECTS = join(ROOT, 'src/content/projects')
const REGISTRY = join(ROOT, 'src/data/published-slugs.json')
const errors = []
const warnings = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
const MIN_WIDTH = 500
const HERO_WIDTH = 2400
const MAX_PDF = 10 * 1024 * 1024

/* ─── Projets ─────────────────────────────────────────────────────────── */
const files = readdirSync(PROJECTS).filter((f) => f.endsWith('.json'))
const numbers = new Map()
const slugs = []
for (const file of files) {
  const slug = file.replace(/\.json$/, '')
  slugs.push(slug)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(`${file} : l’adresse « ${slug} » doit être en minuscules sans accents ni espaces (ex. villa-palmeras).`)
  let data
  try {
    data = JSON.parse(readFileSync(join(PROJECTS, file), 'utf8'))
  } catch (e) {
    err(`${file} : fichier JSON illisible (${e.message}).`)
    continue
  }
  if (numbers.has(data.number)) err(`${file} : le N° ${data.number} est déjà utilisé par ${numbers.get(data.number)}.`)
  else numbers.set(data.number, file)

  const images = Array.isArray(data.images) ? data.images : []
  if (!images.length) err(`${file} : au moins une photo est requise.`)
  if (images.length < 3) warn(`${file} : ${images.length} photo(s) ; 3 minimum recommandées (CONV-07).`)
  for (const [i, im] of images.entries()) {
    const src = typeof im === 'string' ? im : im?.src
    const where = `${file}, photo ${i + 1}`
    if (!src) {
      err(`${where} : chemin de l’image manquant.`)
      continue
    }
    if (typeof im === 'string' || !im.alt || !im.alt_en) err(`${where} : texte alternatif français et anglais requis.`)
    const path = resolve(PROJECTS, src)
    const ext = extname(path).toLowerCase()
    if (!SUPPORTED.includes(ext)) {
      err(`${where} : format « ${ext} » non pris en charge. Utilisez JPG ou PNG (sur iPhone : Réglages > Appareil photo > Formats > « Le plus compatible »).`)
      continue
    }
    if (!existsSync(path)) {
      err(`${where} : fichier introuvable (${src}).`)
      continue
    }
    const meta = await sharp(path).metadata()
    if ((meta.width ?? 0) < MIN_WIDTH) err(`${where} : image trop petite (${meta.width} px de large, ${MIN_WIDTH} px minimum).`)
    if (i === 0 && (meta.width ?? 0) < HERO_WIDTH) warn(`${where} : utilisée en grand format, ${meta.width} px de large (${HERO_WIDTH} px recommandés, MEDIA-11).`)
    if (meta.exif && meta.exif.includes(Buffer.from('GPS'))) warn(`${where} : l’original contient des métadonnées GPS (elles sont retirées des images publiées, mais restent dans le dépôt).`)
  }
}

/* ─── Adresses stables : un projet publié ne disparaît pas sans redirection ─── */
const registry = existsSync(REGISTRY) ? JSON.parse(readFileSync(REGISTRY, 'utf8')) : []
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'))
const redirected = new Set((vercel.redirects ?? []).map((r) => r.source))
for (const slug of registry) {
  if (slugs.includes(slug)) continue
  for (const path of [`/realisations/${slug}`, `/en/projects/${slug}`]) {
    if (!redirected.has(path)) err(`Le projet « ${slug} » a été publié puis retiré : ajoutez une redirection 301 de ${path} (vercel.json et public/_redirects).`)
  }
}
const fresh = slugs.filter((s) => !registry.includes(s))
if (process.argv.includes('--update')) {
  writeFileSync(REGISTRY, JSON.stringify([...registry, ...fresh].sort(), null, 2) + '\n')
  if (fresh.length) console.log(`Registre mis à jour : ${fresh.join(', ')}`)
} else if (fresh.length) {
  warn(`Nouveaux projets à ajouter au registre des adresses publiées (npm run content:register) : ${fresh.join(', ')}`)
}

/* ─── Documents téléchargeables ───────────────────────────────────────── */
const settings = JSON.parse(readFileSync(join(ROOT, 'src/data/settings.json'), 'utf8'))
for (const [i, d] of (settings.documents ?? []).entries()) {
  const where = `Document ${i + 1} (${d.title || 'sans titre'})`
  if (!d.file) {
    err(`${where} : fichier manquant.`)
    continue
  }
  const path = join(ROOT, 'public', d.file)
  if (!existsSync(path)) err(`${where} : fichier introuvable (public${d.file}).`)
  else if (statSync(path).size > MAX_PDF) err(`${where} : ${(statSync(path).size / 1048576).toFixed(1)} Mo ; 10 Mo maximum (PERF-17). Compressez le PDF avant de le publier.`)
  if (extname(path).toLowerCase() !== '.pdf') err(`${where} : seuls les PDF sont acceptés.`)
  if (!['fr', 'en'].includes(d.lang)) err(`${where} : langue « fr » ou « en » requise.`)
  if (!/^\d{4}-\d{2}$/.test(d.date ?? '')) err(`${where} : date de version au format AAAA-MM requise.`)
}

/* ─── Rapport ─────────────────────────────────────────────────────────── */
for (const w of warnings) console.warn(`  avertissement : ${w}`)
if (errors.length) {
  console.error(`\n${errors.length} erreur(s) bloquante(s) dans le contenu :`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log(`Contenu vérifié : ${files.length} projets, ${warnings.length} avertissement(s), 0 erreur.`)

