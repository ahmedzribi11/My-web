import { gsap } from 'gsap'

/**
 * Aperçu flottant : les éléments [data-preview="id"] d’un conteneur [data-preview-root]
 * affichent l’image [data-preview-for="id"] qui suit le curseur (desktop uniquement).
 */
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

document.querySelectorAll<HTMLElement>('[data-preview-root]').forEach((root) => {
  const stage = root.querySelector<HTMLElement>('[data-preview-stage]')
  if (!stage || !fine || reduced) return
  const xTo = gsap.quickTo(stage, 'x', { duration: 0.8, ease: 'power3.out' })
  const yTo = gsap.quickTo(stage, 'y', { duration: 0.8, ease: 'power3.out' })
  let active: string | null = null

  const show = (id: string | null) => {
    if (id === active) return
    active = id
    stage.toggleAttribute('data-on', Boolean(id))
    stage.querySelectorAll<HTMLElement>('[data-preview-for]').forEach((el) => el.toggleAttribute('data-on', el.dataset.previewFor === id))
  }

  root.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect()
    xTo(e.clientX - r.left)
    yTo(e.clientY - r.top)
    const t = (e.target as Element).closest<HTMLElement>('[data-preview]')
    show(t?.dataset.preview ?? null)
  })
  root.addEventListener('pointerleave', () => show(null))
})
