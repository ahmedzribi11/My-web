/**
 * Informations institutionnelles.
 * Les coordonnées ne sont affichées que si elles sont renseignées ici
 * (aucune donnée de contact n’est inventée).
 */
export const site = {
  name: 'General Constructor Group',
  short: 'GCG',
  since: '2016',
  contact: {
    email: undefined as string | undefined,
    phone: undefined as string | undefined,
    address: undefined as string | undefined,
  },
}

export const contactHref = site.contact.email ? `mailto:${site.contact.email}` : '#contact'

export const NAV = [
  { label: 'Projets', href: '#projets' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Organisation', href: '#organisation' },
  { label: 'À propos', href: '#a-propos' },
  { label: 'Contact', href: '#contact' },
] as const
