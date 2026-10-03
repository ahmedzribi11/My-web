import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { outroState } from '../animations/heroState'
import { useGsap } from '../hooks/useGsap'
import { useInView } from '../hooks/useInView'
import { useEnv } from '../lib/env'
import { contactHref, site } from '../data/site'
import Magnetic, { Arrow } from '../components/Magnetic'
import SplitText from '../components/SplitText'
import Dust from '../components/Dust'

const OutroScene = lazy(() => import('../scenes/OutroScene'))

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null)
  const { tier, reducedMotion } = useEnv()
  const near = useInView(root, '300px 0px')
  // Monté une fois à l’approche, puis simplement mis en pause hors champ
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (near) setMounted(true)
  }, [near])
  const webgl = tier !== 'none' && !reducedMotion
  const { email, phone, address } = site.contact

  useGsap(
    root,
    () => {
      if (reducedMotion) {
        outroState.fog = 1
        outroState.particles = 1
        return
      }
      // Le brouillard revient à mesure que l’on approche de la fin
      gsap.fromTo(
        outroState,
        { fog: 0, particles: 0 },
        { fog: 1, particles: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 10%', scrub: true } },
      )
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 45%' } })
      tl.from('[data-cta="kicker"]', { autoAlpha: 0, y: 14, duration: 1.4, ease: EASE.out })
        .from('[data-cta="title"] .split-inner', { yPercent: 115, duration: 2, stagger: 0.1, ease: EASE.out }, 0.2)
        .from('[data-cta="mark"]', { autoAlpha: 0, letterSpacing: '0.8em', duration: 2.4, ease: EASE.cinematic }, 0.3)
        .from('[data-cta="actions"] > *', { autoAlpha: 0, y: 16, duration: 1.4, stagger: 0.12, ease: EASE.out }, 0.9)
    },
    [reducedMotion],
  )

  return (
    <section id="contact" ref={root} className="relative flex min-h-svh items-center overflow-hidden px-5 py-32 md:px-10" aria-labelledby="cta-title">
      {webgl && mounted ? (
        <Suspense fallback={null}>
          <OutroScene tier={tier as Exclude<typeof tier, 'none'>} active={near} />
        </Suspense>
      ) : (
        <div className="css-fog opacity-70" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      )}
      {!webgl && <Dust count={30} seed="outro" />}
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[1800px] flex-col items-center text-center">
        <p data-cta="kicker" className="meta">Un projet à construire ?</p>
        <h2 id="cta-title" data-cta="title" className="display mt-8 text-[clamp(3.6rem,15vw,16rem)]">
          <SplitText text="Parlons-en." />
        </h2>
        <p data-cta="mark" className="mt-6 text-[13px] font-medium tracking-[0.5em] text-bone/70">
          GCG
        </p>

        <div data-cta="actions" className="mt-14 flex flex-col items-center gap-8">
          <Magnetic href={contactHref} className="btn btn-primary !h-16 !px-10">
            Contactez GCG <Arrow />
          </Magnetic>
          {(email || phone || address) && (
            <address className="flex flex-col items-center gap-2 not-italic text-[14px] text-bone/70 md:flex-row md:gap-8">
              {email && (
                <a href={`mailto:${email}`} className="transition-colors hover:text-bone">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:text-bone">
                  {phone}
                </a>
              )}
              {address && <span>{address}</span>}
            </address>
          )}
        </div>
      </div>
    </section>
  )
}
