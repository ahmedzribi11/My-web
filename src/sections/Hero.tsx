import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { heroState } from '../animations/heroState'
import { useGsap } from '../hooks/useGsap'
import { useInView } from '../hooks/useInView'
import { useEnv } from '../lib/env'
import SplitText from '../components/SplitText'
import Magnetic, { Arrow } from '../components/Magnetic'
import HeroFallback from '../components/HeroFallback'

const HeroScene = lazy(() => import('../scenes/HeroScene'))

const VISITED_KEY = 'gcg-intro-seen'

function wasVisited(): boolean {
  try {
    return sessionStorage.getItem(VISITED_KEY) === '1'
  } catch {
    return false
  }
}

export default function Hero() {
  const { tier, reducedMotion, mobile } = useEnv()
  const section = useRef<HTMLElement>(null)
  const [fallback, setFallback] = useState(tier === 'none' || reducedMotion)
  const [introDone, setIntroDone] = useState(reducedMotion)
  const inView = useInView(section)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useGsap(
    section,
    () => {
      const s = heroState
      const nav = document.querySelector('[data-intro="nav"]')
      const finalState = { ambient: 1, particles: 1, fog: 1, form: 1, solid: 1, dolly: 1 }

      if (reducedMotion) {
        Object.assign(s, finalState)
        return
      }

      const textAt = fallback ? 1.2 : 13
      const tl = gsap.timeline({
        defaults: { ease: EASE.soft },
        onComplete: () => {
          setIntroDone(true)
          try {
            sessionStorage.setItem(VISITED_KEY, '1')
          } catch {
            /* stockage indisponible */
          }
        },
      })
      timeline.current = tl
      Object.assign(s, { ambient: 0, particles: 0, fog: 0, form: 0, solid: 0, dolly: 0 })

      if (!fallback) {
        tl.to(s, { ambient: 0.35, duration: 2 }, 2)
          .to(s, { particles: 1, duration: 2.5 }, 2)
          .to(s, { fog: 1, duration: 3.5 }, 4)
          .to(s, { ambient: 0.7, duration: 3 }, 4.5)
          .to(s, { form: 1, duration: 3.8, ease: 'power2.inOut' }, 6.8)
          .to(s, { solid: 1, duration: 3.4, ease: 'power2.inOut' }, 8.2)
          .to(s, { ambient: 1, duration: 2.5 }, 8.6)
          .to(s, { dolly: 1, duration: 4.2, ease: EASE.cinematic }, 9.4)
      }

      tl.from('[data-hero="label"]', { autoAlpha: 0, y: 12, duration: 1.6 }, textAt)
        .from('[data-hero="title"] .split-inner', { yPercent: 115, duration: 2, stagger: 0.14, ease: EASE.out }, textAt + 0.1)
        .from(nav, { autoAlpha: 0, duration: 1.6 }, textAt + 0.3)
        .from('[data-hero="statement"] .split-inner', { yPercent: 115, duration: 1.6, stagger: 0.08, ease: EASE.out }, textAt + 1)
        .from('[data-hero="support"]', { autoAlpha: 0, y: 16, filter: 'blur(8px)', duration: 1.8 }, textAt + 1.3)
        .from('[data-hero="cta"] > *', { autoAlpha: 0, y: 16, duration: 1.6, stagger: 0.14 }, textAt + 2)
        .from('[data-hero="cue"]', { autoAlpha: 0, duration: 1.6 }, textAt + 2.4)

      // Intro raccourcie : mobile, visite récente
      const k = (mobile ? 0.65 : 1) * (wasVisited() ? 0.5 : 1)
      tl.timeScale(1 / k)

      // Défilement de la scène avec le scroll
      gsap.to(s, {
        scroll: 1,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero="overlay"]', {
        autoAlpha: 0,
        y: -60,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: '35% top', scrub: true },
      })
      gsap.fromTo(
        '[data-hero="shade"]',
        { opacity: 0 },
        { opacity: 1, ease: 'none', scrollTrigger: { trigger: section.current, start: '35% top', end: '85% top', scrub: true } },
      )
    },
    [fallback, reducedMotion, mobile],
  )

  // Toute interaction accélère l’intro (l’utilisateur garde la main)
  useEffect(() => {
    if (introDone) return
    const speedUp = () => {
      const tl = timeline.current
      if (tl && tl.isActive() && tl.timeScale() < 5) tl.timeScale(6)
    }
    const opts = { passive: true, once: true } as const
    window.addEventListener('wheel', speedUp, opts)
    window.addEventListener('touchstart', speedUp, opts)
    window.addEventListener('keydown', speedUp, { once: true })
    return () => {
      window.removeEventListener('wheel', speedUp)
      window.removeEventListener('touchstart', speedUp)
      window.removeEventListener('keydown', speedUp)
    }
  }, [introDone])

  return (
    <section id="top" ref={section} className="relative h-[160svh] md:h-[185svh]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {fallback ? (
          <HeroFallback animate={!reducedMotion} />
        ) : (
          <Suspense fallback={null}>
            <HeroScene tier={tier === 'none' ? 'low' : tier} active={inView} onFallback={() => setFallback(true)} />
          </Suspense>
        )}

        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink via-ink/70 to-transparent md:h-1/2 md:from-ink/90 md:via-ink/40" />

        <div data-hero="overlay" className="absolute inset-0 flex flex-col justify-end px-5 pb-10 pt-24 md:px-10 md:pb-14">
          <p data-hero="label" className="meta absolute left-5 top-24 flex items-center gap-4 md:left-10 md:top-32">
            <span className="text-gold">GCG</span>
            <span className="h-px w-10 bg-bone/30" />
            Construction & Ingénierie
          </p>

          <div className="grid items-end gap-8 md:grid-cols-12">
            <h1 id="hero-title" data-hero="title" className="display md:col-span-8">
              <SplitText
                by="line"
                text={'General\nConstructor\nGroup'}
                className="block text-[clamp(2.6rem,11.6vw,6rem)] uppercase md:text-[clamp(4rem,8.4vw,11rem)]"
              />
            </h1>

            <div className="flex flex-col gap-6 md:col-span-4 md:pb-3">
              <SplitText
                as="p"
                data-hero="statement"
                text="Construire. Concevoir. Réaliser."
                className="text-xl font-light tracking-[-0.02em] md:text-[1.7rem]"
              />
              <p data-hero="support" className="max-w-sm text-[15px] leading-relaxed text-bone/65">
                De l’étude à la réalisation, GCG accompagne vos projets avec une expertise intégrée en construction et ingénierie.
              </p>
              <div data-hero="cta" className="flex flex-wrap gap-3 pt-1">
                <Magnetic href="#projets" className="btn btn-primary">
                  Découvrir nos projets <Arrow />
                </Magnetic>
                <Magnetic href="#contact" className="btn btn-outline">
                  Parler à GCG
                </Magnetic>
              </div>
            </div>
          </div>

          <div data-hero="cue" className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden>
            <span className="meta !text-[9px]">Défiler</span>
            <span className="relative block h-10 w-px overflow-hidden bg-bone/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.4s_var(--ease-cinema)_infinite] bg-bone" />
            </span>
          </div>
        </div>

        {!introDone && (
          <button
            type="button"
            onClick={() => timeline.current?.progress(1)}
            className="meta absolute bottom-5 right-5 z-10 transition-colors hover:text-bone md:right-10"
          >
            Passer l’intro
          </button>
        )}

        <div data-hero="shade" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
      </div>
    </section>
  )
}
