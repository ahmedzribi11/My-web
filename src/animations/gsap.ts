import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Courbes « cinéma » : longues, sans rebond. */
export const EASE = {
  cinematic: 'power3.inOut',
  out: 'expo.out',
  soft: 'sine.inOut',
} as const

export { gsap, ScrollTrigger }
