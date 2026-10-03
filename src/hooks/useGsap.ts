import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from '../animations/gsap'

/** Exécute des animations GSAP dans un contexte nettoyé automatiquement. */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: (ctx: gsap.Context) => void, deps: unknown[] = []) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const ctx = gsap.context((self) => setup(self), scope.current)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
