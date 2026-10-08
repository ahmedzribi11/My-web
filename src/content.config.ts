import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

/** Identifiants partagés avec l’interface et l’espace de gestion (public/admin/config.yml). */
export const SECTORS = ['residentiel', 'hotellerie', 'equipements', 'industrie'] as const
export const STATUSES = ['execution', 'etudes', 'receptionne'] as const
export const CITIES = [
  'abidjan',
  'grand-bassam',
  'assinie',
  'assouinde',
  'korhogo',
  'attingue',
  'anyama',
  'bingerville',
  'songon',
  'dabou',
  'jacqueville',
  'bonoua',
  'aboisso',
  'yamoussoukro',
  'bouake',
  'daloa',
  'man',
  'san-pedro',
  'abengourou',
] as const
export const SERVICES = [
  'etudes',
  'architecture',
  'ingenierie',
  'construction',
  'amenagement',
  'rehabilitation',
  'infrastructures',
  'cle-en-main',
] as const
export const TYPES = ['villas', 'residences', 'immeubles', 'hotels', 'loisirs', 'industrie', 'equipements', 'infrastructures'] as const

/** L’espace de gestion enregistre un champ facultatif vidé en "" ou null : on le traite comme absent. */
const blank = (v: unknown) => (v === '' || v === null ? undefined : v)
const opt = <T extends z.ZodType>(schema: T) => z.preprocess(blank, schema.optional())

/**
 * Projets du portfolio GCG — un fichier JSON par projet dans src/content/projects.
 * Règle éditoriale : ne renseigner que les informations attestées par GCG.
 * Un champ absent n’est pas affiché.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      number: z.number().int().positive(),
      name: z.string(),
      name_en: opt(z.string()),
      featured: z.preprocess(blank, z.boolean().default(false)),
      featuredOrder: opt(z.number()),
      sector: z.enum(SECTORS),
      city: z.enum(CITIES),
      location: z.string(),
      location_en: opt(z.string()),
      period: z.string(),
      period_en: opt(z.string()),
      status: opt(z.enum(STATUSES)),
      surface: opt(z.string()),
      terrain: opt(z.string()),
      coveredSurface: opt(z.string()),
      composition: z.string(),
      composition_en: z.string(),
      typologies: opt(z.array(z.object({ name: z.string(), surface: z.string() }))),
      typology: opt(z.string()),
      typology_en: opt(z.string()),
      missions: z.array(z.string()).min(1),
      missions_en: z.array(z.string()).min(1),
      services: z.preprocess(blank, z.array(z.enum(SERVICES)).default([])),
      types: z.preprocess(blank, z.array(z.enum(TYPES)).default([])),
      images: z.array(image()).min(1),
    }),
})

export const collections = { projects }
