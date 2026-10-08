import raw from '../data/settings.json'

/**
 * Paramètres du site (coordonnées, réseaux, médias), modifiables dans
 * l’espace de gestion (/admin) ou directement dans src/data/settings.json.
 * Tout champ vide est simplement masqué sur le site.
 */
export const settings = raw

/** Un champ supprimé ou vidé dans l’espace de gestion devient une chaîne vide. */
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const c: Record<string, unknown> = settings.contact ?? {}
const digits = (s: string) => s.replace(/[^\d+]/g, '').replace(/^00/, '+')

export const contact = {
  phone: str(c.phone),
  phoneHref: str(c.phone) ? `tel:${digits(str(c.phone))}` : '',
  whatsapp: str(c.whatsapp),
  /** Numéro au format international sans « + » pour wa.me. */
  whatsappNumber: digits(str(c.whatsapp)).replace('+', ''),
  email: str(c.email),
  address: str(c.address),
  mapsUrl: str(c.mapsUrl),
  hours: str(c.hours),
  hours_en: str(c.hours_en),
}

const m: Record<string, unknown> = settings.media ?? {}
export const media = {
  videoUrl: str(m.videoUrl),
  /** Portfolio PDF téléversé dans public/documents (chemin public, ex. /documents/portfolio-gcg.pdf). */
  portfolioPdf: str(m.portfolioPdf),
}

export const hasContact = Boolean(contact.phone || contact.whatsapp || contact.email)

export const whatsappLink = (text?: string) =>
  contact.whatsappNumber ? `https://wa.me/${contact.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}` : ''

export const SOCIAL_NAMES = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube' } as const
export type SocialKey = keyof typeof SOCIAL_NAMES

export const socials = (Object.keys(SOCIAL_NAMES) as SocialKey[])
  .map((key) => ({ key, name: SOCIAL_NAMES[key], url: str((settings.social as Record<string, unknown> | undefined)?.[key]) }))
  .filter((s) => s.url)

/** URL d’intégration d’une vidéo YouTube / Vimeo, ou fichier vidéo direct. */
export function videoEmbed(url: string): { kind: 'iframe' | 'file'; src: string } | null {
  if (!url) return null
  const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url)
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` }
  const vm = /vimeo\.com\/(\d+)/.exec(url)
  if (vm) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}` }
  return { kind: 'file', src: url }
}
