import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { heroState } from './heroState'

let lenis: Lenis | null = null

export function initSmoothScroll(enabled: boolean): () => void {
  if (!enabled) return () => {}
  lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
  lenis.on('scroll', (e: Lenis) => {
    heroState.scrollVelocity = e.velocity
    ScrollTrigger.update()
  })
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8 })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' })
  else el?.scrollIntoView({ behavior: 'smooth' })
}

export const lockScroll = (locked: boolean) => {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
