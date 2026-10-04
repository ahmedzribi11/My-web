/**
 * Aperçu flottant (décoratif) : les éléments [data-preview="id"] d’un conteneur [data-preview-root]
 * affichent l’image [data-preview-for="id"] près du curseur. Souris uniquement ; Échap le masque.
 */
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

document.querySelectorAll<HTMLElement>('[data-preview-root]').forEach((root) => {
  const stage = root.querySelector<HTMLElement>('[data-preview-stage]')
  if (!stage || !fine || reduced) return
  let active: string | null = null
  let raf = 0
  let x = 0
  let y = 0

  const show = (id: string | null) => {
    if (id === active) return
    active = id
    stage.querySelectorAll<HTMLElement>('[data-preview-for]').forEach((el) => el.toggleAttribute('data-on', el.dataset.previewFor === id))
  }
  root.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect()
    x = e.clientX - r.left
    y = e.clientY - r.top
    if (!raf) raf = requestAnimationFrame(() => {
      stage.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = 0
    })
    show((e.target as Element).closest<HTMLElement>('[data-preview]')?.dataset.preview ?? null)
  })
  root.addEventListener('pointerleave', () => show(null))
  addEventListener('keydown', (e) => e.key === 'Escape' && show(null))
})
