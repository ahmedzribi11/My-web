/**
 * Organisation et moyens matériels — source : « Portfolio GCG_CI.pdf », pages 4 et 5.
 * Seuls des chiffres présents dans le portfolio sont utilisés.
 * Les noms et photos des collaborateurs ne sont volontairement pas publiés.
 */

export const organisationTagline = 'Une organisation structurée au service de l’excellence et de la performance.'

export interface KeyFigure {
  value: number
  suffix?: string
  label: string
}

export const keyFigures: KeyFigure[] = [
  { value: 20, suffix: '+', label: 'Collaborateurs' },
  { value: 4, label: 'Pôles opérationnels' },
  { value: 6, label: 'Techniciens terrain' },
  { value: 1, label: 'Pilotage centralisé' },
]

export const poles = [
  { name: 'Construction', team: '12+' },
  { name: 'Études & QC', team: '6+' },
  { name: 'Finances', team: '4+' },
  { name: 'Logistique', team: '4+' },
]

export const competences = [
  { name: 'Construction', items: ['Gros œuvre', 'Second œuvre', 'Finitions'] },
  { name: 'Études', items: ['Architecture', 'Structure', 'BIM'] },
  { name: 'Contrôle qualité', items: ['QA/QC', 'Suivi chantier', 'Réception'] },
  { name: 'Gestion', items: ['Planning', 'Reporting', 'Coordination'] },
]

export interface EquipmentItem {
  name: string
  qty: number
}

export interface EquipmentGroup {
  name: string
  items: EquipmentItem[]
}

/** Engins et équipements de chantier, détaillés comme dans le portfolio. */
export const equipment: EquipmentGroup[] = [
  {
    name: 'Engins',
    items: [
      { name: 'Caterpillar 325 CL', qty: 1 },
      { name: 'Caterpillar 325 BL', qty: 1 },
      { name: 'Komatsu AW380', qty: 1 },
      { name: 'Caterpillar', qty: 1 },
      { name: 'Case TX 170-45', qty: 2 },
    ],
  },
  {
    name: 'Équipements de chantier',
    items: [
      { name: 'Ingeco 750 L', qty: 4 },
      { name: 'Sogi-Bem 200', qty: 2 },
      { name: 'Kohler 100 kVA', qty: 1 },
      { name: 'Perkins 150 kVA', qty: 1 },
      { name: 'Perkins 100 kVA', qty: 2 },
    ],
  },
]

/** Parc de véhicules : publié en totaux (6 voitures de service, 3 pick-up et utilitaires). */
export const vehicles = [
  { name: 'Voitures de service', qty: 6 },
  { name: 'Pick-up & utilitaires', qty: 3 },
]

export const totalQty = (items: { qty: number }[]) => items.reduce((n, i) => n + i.qty, 0)
