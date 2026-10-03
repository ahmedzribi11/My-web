export type ExpertiseVisual = 'study' | 'engineering' | 'construction' | 'landscape' | 'infrastructure'

export interface Expertise {
  id: string
  index: string
  title: string
  description: string
  items: string[]
  visual: ExpertiseVisual
}

export const expertise: Expertise[] = [
  {
    id: 'etudes',
    index: '01',
    title: 'Études & Conception',
    description: 'Le projet prend forme avant le premier coup de pelle : faisabilité, parti architectural et études techniques.',
    items: ['Études de faisabilité', 'Études architecturales', 'Études techniques'],
    visual: 'study',
  },
  {
    id: 'ingenierie',
    index: '02',
    title: 'Ingénierie',
    description: 'Une équipe technique pluridisciplinaire qui structure, dimensionne et sécurise chaque ouvrage.',
    items: ['Ingénierie', 'Génie civil', 'Réhabilitation et modernisation techniques'],
    visual: 'engineering',
  },
  {
    id: 'construction',
    index: '03',
    title: 'Construction',
    description: 'De l’entreprise générale au clé en main, la réalisation des ouvrages du gros œuvre aux finitions.',
    items: ['Construction de bâtiments', 'Entreprise générale / clé en main', 'Gros œuvre', 'Second œuvre & finitions'],
    visual: 'construction',
  },
  {
    id: 'amenagement',
    index: '04',
    title: 'Aménagement',
    description: 'Les espaces intérieurs et extérieurs qui donnent à l’ouvrage sa qualité d’usage.',
    items: ['Aménagements intérieurs', 'Aménagements extérieurs'],
    visual: 'landscape',
  },
  {
    id: 'infrastructures',
    index: '05',
    title: 'Infrastructures',
    description: 'Les réseaux et ouvrages de génie civil qui relient, desservent et font fonctionner les projets.',
    items: ['Infrastructures', 'Génie civil', 'Aménagements extérieurs et infrastructures'],
    visual: 'infrastructure',
  },
]

export const processSteps = [
  { index: '01', title: 'Étude', text: 'Faisabilité et analyse du programme.' },
  { index: '02', title: 'Conception', text: 'Études architecturales et parti du projet.' },
  { index: '03', title: 'Ingénierie', text: 'Études techniques et dimensionnement.' },
  { index: '04', title: 'Construction', text: 'Gros œuvre, second œuvre, finitions.' },
  { index: '05', title: 'Aménagement', text: 'Espaces intérieurs, extérieurs et infrastructures.' },
]
