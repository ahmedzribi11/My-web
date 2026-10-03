import { useEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { gsap } from '../animations/gsap'
import { useEnv } from '../lib/env'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  strength?: number
}

/** Lien-bouton magnétique (attiré par le curseur sur desktop). */
export default function Magnetic({ children, strength = 0.35, className = '', ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { touch, reducedMotion } = useEnv()

  useEffect(() => {
    const el = ref.current
    if (!el || touch || reducedMotion) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [touch, reducedMotion, strength])

  return (
    <a ref={ref} data-cursor="link" className={className} {...rest}>
      {children}
    </a>
  )
}

export const Arrow = () => (
  <svg className="arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
    <path d="M0 5h12.5M8.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
  </svg>
)
