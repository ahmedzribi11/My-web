import { useEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { heroState, outroState } from '../animations/heroState'

type Mode = 'default' | 'link' | 'view'

/**
 * Curseur personnalisé (desktop) + lumière qui suit le pointeur.
 * Met aussi à jour la position du pointeur pour les scènes WebGL.
 */
export default function Cursor({ enabled }: { enabled: boolean }) {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const light = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      heroState.pointerX = nx
      heroState.pointerY = ny
      outroState.pointerX = nx
      outroState.pointerY = ny
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current || !light.current) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.15, ease: 'power3.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.15, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3.out' })
    const lx = gsap.quickTo(light.current, 'x', { duration: 1.4, ease: 'power2.out' })
    const ly = gsap.quickTo(light.current, 'y', { duration: 1.4, ease: 'power2.out' })

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      setVisible(true)
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      lx(e.clientX)
      ly(e.clientY)
      const target = (e.target as Element | null)?.closest?.('[data-cursor], a, button, [role="button"]')
      const m = target?.getAttribute('data-cursor') as Mode | null
      setMode(m === 'view' ? 'view' : target ? 'link' : 'default')
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  const ringSize = mode === 'view' ? 84 : mode === 'link' ? 44 : 28
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]" style={{ opacity: visible ? 1 : 0, transition: 'opacity .4s' }}>
      <div
        ref={light}
        className="fixed left-0 top-0 -z-10 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{ background: 'radial-gradient(closest-side, rgba(242,239,233,0.055), transparent)' }}
      />
      <div ref={ring} className="fixed left-0 top-0">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/40 transition-all duration-500 ease-[var(--ease-out-expo)]"
          style={{
            width: ringSize,
            height: ringSize,
            background: mode === 'view' ? 'rgba(242,239,233,0.95)' : 'transparent',
            borderColor: mode === 'view' ? 'transparent' : undefined,
          }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.2em] text-ink transition-opacity duration-300"
            style={{ opacity: mode === 'view' ? 1 : 0 }}
          >
            VOIR
          </span>
        </div>
      </div>
      <div ref={dot} className="fixed left-0 top-0">
        <div
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone transition-opacity duration-300"
          style={{ opacity: mode === 'view' ? 0 : 1 }}
        />
      </div>
    </div>
  )
}
