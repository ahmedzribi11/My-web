/**
 * Projets GCG.
 *
 * Source de vérité : « Portfolio GCG_CI.pdf ».
 * Règle : ne renseigner un champ que s’il figure dans le portfolio. Un champ absent
 * n’est jamais affiché par l’interface (aucune valeur par défaut, aucune estimation).
 *
 * Images : déposer les fichiers dans /public/projects/<id>/ puis les référencer
 * dans `images` (voir public/projects/README.md).
 */

export type ProjectCategory =
  | 'hotellerie-tourisme'
  | 'residentiels'
  | 'etablissements-publics'
  | 'industrie-infrastructures'
  | 'autres'

export type ProjectStatus = 'realise' | 'execution' | 'etudes'

export interface ProjectTypology {
  name: string
  surface: string
}

export interface Project {
  id: string
  name: string
  /** Mis en avant dans la galerie « Projets phares ». */
  featured?: boolean
  category?: ProjectCategory
  location?: string
  year?: string
  surface?: string
  composition?: string
  typologies?: ProjectTypology[]
  missions?: string[]
  status?: ProjectStatus
  images: string[]
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'hotellerie-tourisme': 'Hôtellerie & Tourisme',
  residentiels: 'Résidentiels',
  'etablissements-publics': 'Établissements publics',
  'industrie-infrastructures': 'Industrie & Infrastructures',
  autres: 'Autres projets',
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  realise: 'Réalisé',
  execution: 'En cours d’exécution',
  etudes: 'En cours d’études',
}

export const projects: Project[] = [
  {
    id: 'green-city',
    name: 'Green City',
    featured: true,
    category: 'residentiels',
    location: 'Bassam',
    year: '2025',
    surface: '2 500 m²',
    composition: 'Projet de construction d’une cité de 45 villas haut standing.',
    typologies: [
      { name: 'Villa Minan', surface: '204 m²' },
      { name: 'Villa ASUE', surface: '220 m²' },
      { name: 'Villa Boya', surface: '320 m²' },
    ],
    missions: [
      'Études, conception et réalisation',
      'Gros œuvre et second œuvre',
      'Aménagements extérieurs et infrastructures',
    ],
    status: 'execution',
    images: [],
  },
  { id: 'villa-palmeras', name: 'Villa Palmeras', featured: true, category: 'residentiels', images: [] },
  { id: 'hotel-calao-korhogo', name: 'Hôtel Calao Korhogo', featured: true, category: 'hotellerie-tourisme', images: [] },
  { id: 'projet-elan', name: 'Projet Elan', featured: true, images: [] },
  { id: 'spa-assinie', name: 'Spa Assinie', featured: true, category: 'hotellerie-tourisme', images: [] },
  { id: 'hotel-akwabeach', name: 'Hôtel Akwabeach', featured: true, category: 'hotellerie-tourisme', images: [] },
  { id: 'saif-ivoire', name: 'SAIF Ivoire', featured: true, images: [] },
  { id: 'royal-palm', name: 'Royal Palm', images: [] },
  { id: 'palm-village', name: 'Palm Village', images: [] },
  { id: 'immeuble-marikati', name: 'Immeuble Marikati', images: [] },
  { id: 'immeuble-attoban', name: 'Immeuble Attoban', images: [] },
  { id: 'suite-hoteliere-assouinde', name: 'Suite hôtelière Assouindé', category: 'hotellerie-tourisme', images: [] },
  { id: 'villa-de-luxe-assouinde', name: 'Villa de luxe Assouindé', category: 'residentiels', images: [] },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const getProject = (id: string) => projects.find((p) => p.id === id)

/** Libellé court « Lieu · Année » ne contenant que les informations connues. */
export function projectMeta(p: Project): string[] {
  return [p.location, p.year, p.surface].filter((v): v is string => Boolean(v))
}
