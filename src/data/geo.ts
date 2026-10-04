import type { CITIES } from '../content.config'

export type CityId = (typeof CITIES)[number]

/**
 * Coordonnées approximatives des localités (carte de présence).
 * zone « cluster » : agglomération d’Abidjan et littoral est, étiquetés sous la carte avec une ligne de rappel.
 * zone « solo » : étiquette directe à côté du point (side = côté de l’étiquette).
 * Seules les localités ayant au moins un projet apparaissent sur le site.
 */
export const cities: Record<CityId, { name: string; lat: number; lon: number; zone: 'cluster' | 'solo'; side?: 'left' | 'right' }> = {
  abidjan: { name: 'Abidjan', lat: 5.345, lon: -4.01, zone: 'cluster' },
  'grand-bassam': { name: 'Grand-Bassam', lat: 5.21, lon: -3.74, zone: 'cluster' },
  assouinde: { name: 'Assouindé', lat: 5.17, lon: -3.47, zone: 'cluster' },
  assinie: { name: 'Assinie', lat: 5.13, lon: -3.28, zone: 'cluster' },
  attingue: { name: 'Attingué', lat: 5.47, lon: -4.13, zone: 'cluster' },
  anyama: { name: 'Anyama', lat: 5.495, lon: -4.052, zone: 'cluster' },
  bingerville: { name: 'Bingerville', lat: 5.355, lon: -3.885, zone: 'cluster' },
  songon: { name: 'Songon', lat: 5.3, lon: -4.26, zone: 'cluster' },
  dabou: { name: 'Dabou', lat: 5.325, lon: -4.377, zone: 'cluster' },
  jacqueville: { name: 'Jacqueville', lat: 5.205, lon: -4.42, zone: 'cluster' },
  bonoua: { name: 'Bonoua', lat: 5.272, lon: -3.595, zone: 'cluster' },
  aboisso: { name: 'Aboisso', lat: 5.468, lon: -3.207, zone: 'cluster' },
  korhogo: { name: 'Korhogo', lat: 9.46, lon: -5.63, zone: 'solo' },
  yamoussoukro: { name: 'Yamoussoukro', lat: 6.82, lon: -5.28, zone: 'solo' },
  bouake: { name: 'Bouaké', lat: 7.69, lon: -5.03, zone: 'solo' },
  daloa: { name: 'Daloa', lat: 6.88, lon: -6.45, zone: 'solo', side: 'left' },
  man: { name: 'Man', lat: 7.41, lon: -7.55, zone: 'solo' },
  'san-pedro': { name: 'San-Pédro', lat: 4.75, lon: -6.64, zone: 'solo' },
  abengourou: { name: 'Abengourou', lat: 6.73, lon: -3.49, zone: 'solo' },
}
