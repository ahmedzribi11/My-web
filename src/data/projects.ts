/**
 * Projets GCG.
 *
 * Source de vérité : « Portfolio GCG_CI.pdf ».
 * Règle : ne renseigner un champ que s’il figure dans le portfolio. Un champ absent
 * n’est jamais affiché par l’interface (aucune valeur par défaut, aucune estimation).
 *
 * Images : extraites du portfolio, dans /public/projects/<id>/ (01.jpg = visuel principal).
 */

export type ProjectCategory =
  | 'hotellerie-tourisme'
  | 'residentiels'
  | 'etablissements-publics'
  | 'industrie-infrastructures'
  | 'autres'

/** Statut tel qu’indiqué dans le portfolio (absent si le portfolio ne le précise pas). */
export type ProjectStatus = 'execution' | 'etudes' | 'receptionne'

export interface ProjectTypology {
  name: string
  surface: string
}

export interface Project {
  id: string
  /** Numéro du projet dans le portfolio. */
  number: number
  name: string
  /** Mis en avant dans la galerie « Projets phares » (section 01 du portfolio). */
  featured?: boolean
  category?: ProjectCategory
  location?: string
  /** Année ou période, telle qu’indiquée dans le portfolio. */
  period?: string
  surface?: string
  terrain?: string
  coveredSurface?: string
  composition?: string
  typologies?: ProjectTypology[]
  typology?: string
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
  execution: 'En cours d’exécution',
  etudes: 'En cours d’études',
  receptionne: 'Réceptionné',
}

const imgs = (id: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/projects/${id}/${String(i + 1).padStart(2, '0')}.jpg`)

export const projects: Project[] = [
  // ── 01 · Les projets phares ────────────────────────────────────────────
  {
    id: 'green-city',
    number: 1,
    name: 'Green City',
    featured: true,
    category: 'residentiels',
    location: 'Bassam',
    period: '2025',
    surface: '2 500 m²',
    composition: 'Projet de construction d’une cité de 45 villas haut standing.',
    typologies: [
      { name: 'Villa Minan', surface: '204 m²' },
      { name: 'Villa ASUE', surface: '220 m²' },
      { name: 'Villa Boya', surface: '320 m²' },
    ],
    missions: ['Études, conception et réalisation', 'Gros œuvre et second œuvre', 'Aménagements extérieurs et infrastructures'],
    status: 'execution',
    images: imgs('green-city', 4),
  },
  {
    id: 'villa-palmeras',
    number: 2,
    name: 'Villa Palmeras',
    featured: true,
    category: 'residentiels',
    location: 'Bassam',
    period: '2023',
    surface: '33 000 m²',
    terrain: '6 hectares',
    composition: 'Travaux de construction de 116 villas R+1 haut standing.',
    missions: ['Études et réalisation du projet', 'Gros œuvre et second œuvre', 'Aménagements intérieurs et extérieurs'],
    status: 'execution',
    images: imgs('villa-palmeras', 3),
  },
  {
    id: 'hotel-calao-korhogo',
    number: 3,
    name: 'Hôtel Calao Korhogo',
    featured: true,
    category: 'hotellerie-tourisme',
    location: 'Korhogo',
    period: '2020 – 2024',
    surface: '4 000 m²',
    composition: 'Projet clé en main d’un hôtel R+3 — 42 chambres haut standing.',
    missions: ['Études', 'Réalisation et aménagement'],
    status: 'receptionne',
    images: imgs('hotel-calao-korhogo', 3),
  },
  {
    id: 'projet-elan',
    number: 4,
    name: 'Projet Elan',
    featured: true,
    category: 'residentiels',
    location: 'Bassam Modeste',
    period: '2026',
    surface: '14 hectares',
    coveredSurface: '600 000 m²',
    composition: 'Complexe résidentiel de 28 tours R+16.',
    missions: ['Étude architecturale', 'Études techniques'],
    status: 'etudes',
    images: imgs('projet-elan', 3),
  },
  {
    id: 'spa-assinie',
    number: 5,
    name: 'Spa Assinie',
    featured: true,
    category: 'hotellerie-tourisme',
    location: 'Assinie',
    period: '2020 – 2023',
    surface: '1 200 m²',
    composition: 'Aménagement d’un centre de loisirs et de détente SPA.',
    missions: ['Conception', 'Réalisation clé en main'],
    images: imgs('spa-assinie', 3),
  },
  {
    id: 'hotel-akwabeach',
    number: 6,
    name: 'Hôtel Akwabeach',
    featured: true,
    category: 'hotellerie-tourisme',
    location: 'Assouindé',
    period: '2025',
    surface: '2 500 m²',
    composition: 'Travaux de réaménagement d’un hôtel 4 étoiles.',
    missions: [
      'Rénovation et modernisation des espaces intérieurs',
      'Réhabilitation des infrastructures et équipements',
      'Mise à niveau des prestations et des aménagements',
    ],
    status: 'execution',
    images: imgs('hotel-akwabeach', 3),
  },
  {
    id: 'saif-ivoire',
    number: 7,
    name: 'Usine pharmaceutique SAIF Ivoire',
    featured: true,
    category: 'industrie-infrastructures',
    location: 'Zone franche VITIB',
    period: '2020 – 2021',
    surface: '3 500 m²',
    composition: 'Construction d’une usine pharmaceutique en structure métallique.',
    missions: ['Études techniques et réalisation'],
    images: imgs('saif-ivoire', 3),
  },

  // ── Hôtellerie & Tourisme ──────────────────────────────────────────────
  {
    id: 'salle-polyvalente-korhogo',
    number: 8,
    name: 'Salle polyvalente',
    category: 'hotellerie-tourisme',
    location: 'Korhogo',
    period: '2022',
    surface: '800 m²',
    composition: 'Projet clé en main d’une salle polyvalente destinée aux cérémonies et événements.',
    missions: ['Études', 'Construction', 'Aménagement'],
    images: imgs('salle-polyvalente-korhogo', 3),
  },
  {
    id: 'royal-palm',
    number: 9,
    name: 'Royal Palm',
    category: 'hotellerie-tourisme',
    location: 'Assinie',
    period: '2018',
    surface: '2 200 m²',
    composition: 'Huit villas touristiques haut standing.',
    missions: ['Conception architecturale', 'Étude de structure', 'Travaux de gros œuvre', 'Travaux de second œuvre', 'Aménagements extérieurs'],
    images: imgs('royal-palm', 2),
  },
  {
    id: 'beach-bar-assinie',
    number: 10,
    name: 'Beach Bar Assinie',
    category: 'hotellerie-tourisme',
    location: 'Assinie',
    period: '2022',
    surface: '800 m²',
    composition: 'Restaurant bar touristique — piscine à débordement.',
    missions: ['Conception architecturale', 'Étude de structure', 'Travaux de gros œuvre', 'Travaux de second œuvre', 'Aménagements extérieurs'],
    images: imgs('beach-bar-assinie', 3),
  },
  {
    id: 'palm-village',
    number: 11,
    name: 'Palm Village',
    category: 'hotellerie-tourisme',
    location: 'Assinie',
    period: '2022',
    surface: '1 600 m²',
    composition: 'Complexe résidentiel de 4 villas et 8 appartements.',
    missions: ['Étude de structure', 'Études fluides et électricité', 'Travaux de gros œuvre et second œuvre', 'Ameublement et agencement'],
    images: imgs('palm-village', 3),
  },

  // ── Résidentiels ───────────────────────────────────────────────────────
  {
    id: 'immeuble-marikati',
    number: 12,
    name: 'Immeuble Marikati',
    category: 'residentiels',
    location: 'Vallon',
    period: '2020',
    surface: '6 800 m²',
    composition: 'Bâtiment à usage bureautique et résidentiel.',
    missions: ['Étude architecturale', 'Études techniques'],
    images: imgs('immeuble-marikati', 3),
  },
  {
    id: 'immeuble-belle-feuille',
    number: 13,
    name: 'Immeuble Belle Feuille',
    category: 'residentiels',
    location: 'Attoban',
    period: '2021',
    surface: '5 000 m²',
    composition: '18 appartements.',
    missions: ['Étude architecturale et technique d’un immeuble R+4'],
    images: imgs('immeuble-belle-feuille', 2),
  },
  {
    id: 'immeuble-attoban',
    number: 14,
    name: 'Immeuble Attoban',
    category: 'residentiels',
    location: 'Attoban',
    period: '2021',
    surface: '7 800 m²',
    composition: 'Complexe de 3 bâtiments à usage bureautique et résidentiel.',
    missions: ['Étude architecturale', 'Étude technique'],
    images: imgs('immeuble-attoban', 4),
  },
  {
    id: 'suite-hoteliere-assouinde',
    number: 15,
    name: 'Suite hôtelière Assouindé',
    category: 'residentiels',
    location: 'Assouindé',
    period: 'Sept. 2024 – févr. 2025',
    surface: '400 m²',
    composition: 'Projet clé en main de 3 suites et 5 chambres.',
    missions: ['Études, réalisation et aménagement'],
    images: imgs('suite-hoteliere-assouinde', 2),
  },
  {
    id: 'villa-de-luxe-assouinde',
    number: 16,
    name: 'Villa de luxe Assouindé',
    category: 'residentiels',
    location: 'Assouindé',
    period: 'Décembre 2025',
    surface: '260 m²',
    composition: 'Projet clé en main d’une villa haut standing.',
    missions: ['Études', 'Construction', 'Aménagement', 'Réalisation de la piscine'],
    images: imgs('villa-de-luxe-assouinde', 3),
  },

  // ── Établissements publics ─────────────────────────────────────────────
  {
    id: 'salle-de-sport-progym',
    number: 17,
    name: 'Salle de sport Progym',
    category: 'etablissements-publics',
    location: 'Cocody',
    period: 'Mars 2017 – déc. 2017',
    surface: '800 m²',
    composition: 'Réaménagement d’une salle de sport.',
    missions: ['Travaux de second œuvre'],
    images: imgs('salle-de-sport-progym', 3),
  },

  // ── Industrie & Infrastructures ────────────────────────────────────────
  {
    id: 'usine-pharmanova',
    number: 18,
    name: 'Usine pharmaceutique Pharmanova',
    category: 'industrie-infrastructures',
    location: 'Zone franche VITIB',
    period: 'Févr. 2018 – déc. 2018',
    surface: '4 200 m²',
    composition: 'Construction d’une usine pharmaceutique en structure métallique avec mezzanine.',
    missions: ['Études techniques et réalisation'],
    images: imgs('usine-pharmanova', 1),
  },
  {
    id: 'vrd-cite-baobab',
    number: 19,
    name: 'Aménagement et voirie d’un quartier résidentiel (VRD)',
    category: 'industrie-infrastructures',
    location: 'Bassam',
    period: 'Juin 2023 – nov. 2023',
    surface: '5 hectares',
    composition: 'Aménagement de la cité BAOBAB de SIDI.',
    missions: [
      'Travaux de voirie et réseaux divers (VRD)',
      'Voiries, assainissement et réseaux divers',
      'Travaux d’infrastructures et d’équipements',
    ],
    images: imgs('vrd-cite-baobab', 2),
  },
  {
    id: 'mise-a-niveau-complexe-hotelier',
    number: 20,
    name: 'Mise à niveau d’un complexe hôtelier',
    category: 'industrie-infrastructures',
    location: 'Assouindé',
    period: 'Août 2024 – oct. 2024',
    composition: 'Détection et lutte contre l’incendie.',
    missions: ['Mise à niveau des installations électriques et de plomberie', 'Mise en conformité technique du site'],
    images: imgs('mise-a-niveau-complexe-hotelier', 3),
  },
  {
    id: 'usine-de-cajou',
    number: 21,
    name: 'Usine de cajou',
    category: 'industrie-infrastructures',
    location: 'Attingué',
    period: '2025',
    surface: '55 000 m²',
    composition: 'Usine de stockage de cajou.',
    missions: ['Étude technique', 'Analyse et conception des installations'],
    images: imgs('usine-de-cajou', 3),
  },

  // ── Projets en cours d’exécution ───────────────────────────────────────
  {
    id: 'temple-indien',
    number: 22,
    name: 'Temple indien',
    location: 'Bassam',
    period: '2023',
    surface: '2 500 m²',
    composition: 'Temple en R+1.',
    missions: ['Études et réalisation', 'Travaux de gros œuvre et de second œuvre', 'Aménagements architecturaux et décoratifs'],
    status: 'execution',
    images: imgs('temple-indien', 3),
  },
  {
    id: 'villa-de-maitre-beverly-hills',
    number: 23,
    name: 'Villa de maître Beverly Hills',
    category: 'residentiels',
    location: 'Riviera Golf',
    period: '2025',
    surface: '600 m²',
    composition: 'Projet d’une villa haut standing avec piscine.',
    missions: ['Étude technique', 'Travaux de finition', 'Aménagement extérieur'],
    status: 'execution',
    images: imgs('villa-de-maitre-beverly-hills', 3),
  },
  {
    id: 'residence-privee-beverly-hills',
    number: 24,
    name: 'Résidence privée de luxe Beverly Hills',
    category: 'residentiels',
    location: 'Riviera Golf',
    period: '2025',
    surface: '1 200 m²',
    composition: 'Projet clé en main de 3 villas très haut standing.',
    missions: ['Études, conception et réalisation', 'Gros œuvre et second œuvre', 'Aménagements intérieurs et extérieurs'],
    status: 'execution',
    images: imgs('residence-privee-beverly-hills', 2),
  },

  // ── 03 · Projets en cours d’études ─────────────────────────────────────
  {
    id: 'palm-resort-movenpick',
    number: 25,
    name: 'Palm Resort phase 2 : Mövenpick',
    category: 'hotellerie-tourisme',
    location: 'Assouindé',
    period: '2025',
    surface: '5 hectares',
    composition: '64 bungalows, 30 villas haut standing, 1 salle de conférence et 1 bâtiment principal.',
    missions: ['Permis de bâtir'],
    status: 'etudes',
    images: imgs('palm-resort-movenpick', 4),
  },
  {
    id: 'residence-abatta',
    number: 26,
    name: 'Résidence Abatta',
    category: 'residentiels',
    location: 'Abidjan',
    period: '2026',
    surface: '8 000 m²',
    coveredSurface: '8 700 m²',
    composition: 'Ensemble de villas résidentielles haut standing : deux prototypes de villas urbaines et un immeuble R+3.',
    typology: 'Villas haut standing avec piscine, immeuble résidentiel avec parking en sous-sol.',
    missions: ['Études technique et architecturale', 'Aménagements intérieurs et extérieurs'],
    status: 'etudes',
    images: imgs('residence-abatta', 3),
  },
  {
    id: 'residence-assinie-mafia',
    number: 27,
    name: 'Résidence Assinie Mafia',
    category: 'residentiels',
    location: 'Assinie',
    period: '2025',
    surface: '1 200 m²',
    composition: 'Ensemble de villas résidentielles de standing : trois prototypes de villas urbaines et une villa lagunaire.',
    typology: 'R+1 + rooftop et terrasse panoramique.',
    missions: ['Études technique et architecturale', 'Aménagements intérieurs et extérieurs'],
    status: 'etudes',
    images: imgs('residence-assinie-mafia', 4),
  },
  {
    id: 'complexe-familial-vacances',
    number: 28,
    name: 'Complexe familial de vacances',
    category: 'hotellerie-tourisme',
    location: 'Assinie',
    period: '2026',
    composition: 'Projet de revalorisation et de développement d’un site balnéaire, dans une situation exceptionnelle entre lagune et océan.',
    missions: ['Étude architecturale'],
    status: 'etudes',
    images: imgs('complexe-familial-vacances', 2),
  },
  {
    id: 'ecole-green-city',
    number: 29,
    name: 'École Green City',
    category: 'etablissements-publics',
    location: 'Bassam Modeste',
    period: '2026',
    surface: '3 810 m²',
    composition: 'École primaire en R+2 avec piscine et 3 terrains de padel.',
    missions: ['Études et conception architecturale'],
    status: 'etudes',
    images: imgs('ecole-green-city', 3),
  },

  // ── 04 · Autres projets ────────────────────────────────────────────────
  {
    id: 'hotel-du-golf',
    number: 30,
    name: 'Hôtel du Golf Abidjan',
    category: 'autres',
    location: 'Riviera Golf',
    period: '2020',
    composition: 'Complexe touristique.',
    missions: ['Étude de faisabilité'],
    images: imgs('hotel-du-golf', 4),
  },
  {
    id: 'villa-palmerais',
    number: 31,
    name: 'Villa Palmerais',
    category: 'autres',
    location: 'Riviera Palmeraie',
    period: '2019 – 2020',
    surface: '1 100 m²',
    composition: 'Projet clé en main de 3 villas R+1 haut standing.',
    missions: [
      'Études technique et architecturale, réalisation',
      'Gros œuvre et second œuvre',
      'Aménagements intérieurs et extérieurs',
    ],
    images: imgs('villa-palmerais', 4),
  },
  {
    id: 'immeuble-seven-1',
    number: 32,
    name: 'Immeuble Seven 1',
    category: 'autres',
    location: 'Angré 7e tranche',
    period: '2018 – 2020',
    surface: '3 000 m²',
    composition: 'Achèvement des travaux de finition d’un immeuble R+4.',
    missions: ['Travaux de second œuvre et de finition'],
    images: imgs('immeuble-seven-1', 1),
  },
  {
    id: 'immeuble-seven-2',
    number: 33,
    name: 'Immeuble Seven 2',
    category: 'autres',
    location: 'Angré 8e tranche',
    period: '2019 – 2021',
    surface: '4 000 m²',
    composition: 'Projet clé en main d’un immeuble R+5 mezzanine — 17 appartements haut standing.',
    missions: ['Travaux de gros œuvre et de second œuvre', 'Aménagements intérieurs et extérieurs'],
    images: imgs('immeuble-seven-2', 3),
  },
  {
    id: 'immeuble-bureautique-kone',
    number: 34,
    name: 'Immeuble bureautique Koné',
    category: 'autres',
    location: 'Vallon',
    period: 'Avril 2020 – déc. 2020',
    surface: '600 m²',
    composition: 'Projet clé en main d’un immeuble R+2 haut standing.',
    missions: ['Travaux de gros œuvre et de second œuvre', 'Aménagements intérieurs et extérieurs'],
    images: imgs('immeuble-bureautique-kone', 4),
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const getProject = (id: string) => projects.find((p) => p.id === id)

/** Période + statut, uniquement à partir des informations connues. */
export function projectTiming(p: Project): string {
  return [p.period, p.status ? STATUS_LABELS[p.status] : undefined].filter(Boolean).join(' — ')
}
