/**
 * Comportements communs à toutes les pages, sans bibliothèque :
 * en-tête, menu mobile, apparitions au défilement, suivi des conversions.
 * Défilement natif (pas de défilement « fluide » ni d’effet de parallaxe).
 */
import { track } from './analytics'

const html = document.documentElement
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

export function lockScroll(locked: boolean) {
  html.style.overflow = locked ? 'hidden' : ''
}

/* ─── En-tête ─────────────────────────────────────────────────────────── */
const header = document.getElementById('site-header')
let lastY = scrollY
const onScroll = () => {
  const y = scrollY
  if (header) {
    header.toggleAttribute('data-scrolled', y > 40)
    const menuOpen = header.hasAttribute('data-menu')
    const focusInside = header.contains(document.activeElement)
    header.toggleAttribute('data-hidden', !menuOpen && !focusInside && y > 400 && y > lastY + 2)
    if (y < lastY - 2) header.removeAttribute('data-hidden')
  }
  lastY = y
}
addEventListener('scroll', onScroll, { passive: true })
onScroll()
// Un élément qui reçoit le focus au clavier n’est jamais masqué par l’en-tête (WCAG 2.4.11)
header?.addEventListener('focusin', () => header.removeAttribute('data-hidden'))

/* ─── Menu mobile ─────────────────────────────────────────────────────── */
const toggle = document.getElementById('menu-toggle')
const menu = document.getElementById('mobile-menu')
if (header && toggle && menu) {
  const links = () => menu.querySelectorAll<HTMLElement>('a')
  const setOpen = (open: boolean) => {
    header.toggleAttribute('data-menu', open)
    header.removeAttribute('data-hidden')
    toggle.setAttribute('aria-expanded', String(open))
    menu.setAttribute('aria-hidden', String(!open))
    menu.toggleAttribute('inert', !open)
    toggle.querySelector('[data-label-open]')?.toggleAttribute('hidden', open)
    toggle.querySelector('[data-label-close]')?.toggleAttribute('hidden', !open)
    lockScroll(open)
    if (open) links()[0]?.focus()
  }
  menu.toggleAttribute('inert', true)
  toggle.addEventListener('click', () => setOpen(!header.hasAttribute('data-menu')))
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.hasAttribute('data-menu')) {
      setOpen(false)
      toggle.focus()
    }
  })
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setOpen(false)
  })
}

/* ─── Apparitions au défilement (≤ 300 ms, désactivées si mouvement réduit) ─ */
const revealed = document.querySelectorAll<HTMLElement>('[data-reveal], [data-split]')
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealed.forEach((el) => el.classList.add('is-in'))
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
  )
  revealed.forEach((el) => io.observe(el))
}

/* ─── Mesure des conversions (sans cookie ; inactif si aucun outil n’est configuré) ─ */
document.addEventListener('click', (e) => {
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!a) return
  const href = a.getAttribute('href') ?? ''
  if (href.startsWith('https://wa.me/')) track('whatsapp')
  else if (href.startsWith('tel:')) track('phone')
  else if (href.startsWith('mailto:')) track('email')
  else if (a.hasAttribute('download') || href.endsWith('.pdf')) track('download', { file: href.split('/').pop() ?? '' })
  else if (a.hasAttribute('data-lang-switch')) track('language', { to: a.hreflang })
})
const params = new URLSearchParams(location.search)
// Page demandée indisponible dans cette langue : message court sur la page parente (I18N-03)
if (params.get('notice') === 'lang') document.getElementById('lang-notice')?.removeAttribute('hidden')
if (params.get('utm_source') === 'qr') track('qr', { medium: params.get('utm_medium') ?? '', page: location.pathname })
