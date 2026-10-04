import { useRef } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { useGsap } from '../hooks/useGsap'
import { useEnv } from '../lib/env'
import { site } from '../data/site'
import SectionLabel from '../components/SectionLabel'
import SplitText from '../components/SplitText'

const DOMAINS = [
  'Construction de bâtiments',
  'Génie civil',
  'Infrastructures',
  'Études de faisabilité',
  'Études architecturales et techniques',
  'Réhabilitation et modernisation techniques',
]

export default function About() {
  const root = useRef<HTMLElement>(null)
  const { reducedMotion } = useEnv()

  useGsap(
    root,
    () => {
      if (reducedMotion) return
      gsap.from('[data-line]', { scaleX: 0, duration: 1.6, ease: EASE.out, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      gsap.from('[data-ab="title"] .split-inner', {
        yPercent: 115,
        duration: 1.8,
        stagger: 0.1,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-ab="title"]', start: 'top 85%' },
      })
      gsap.fromTo(
        '[data-ab="year"]',
        { yPercent: 25 },
        { yPercent: -25, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.from('[data-ab="reveal"]', {
        autoAlpha: 0,
        y: 30,
        duration: 1.4,
        stagger: 0.1,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-ab="body"]', start: 'top 80%' },
      })
    },
    [reducedMotion],
  )

  return (
    <section id="a-propos" ref={root} className="relative overflow-hidden bg-brand px-5 py-28 text-bone md:px-10 md:py-48" aria-labelledby="ab-title">
      <span
        data-ab="year"
        aria-hidden
        className="display pointer-events-none absolute -right-[2vw] top-[8%] select-none text-[34vw] leading-none text-gold/[0.06] md:text-[26vw]"
      >
        {site.since}
      </span>
      <div className="relative mx-auto max-w-[1800px]">
        <SectionLabel index="06" label="À propos" className="!text-bone/60 [&_[data-line]]:!bg-gold/40" />
        <h2 id="ab-title" data-ab="title" className="display mt-10 text-[clamp(2.6rem,8vw,9rem)] uppercase">
          <SplitText by="line" text={'General\nConstructor Group'} />
        </h2>

        <div data-ab="body" className="mt-16 grid gap-14 md:mt-28 md:grid-cols-12">
          <div data-ab="reveal" className="md:col-span-3">
            <p className="meta !text-bone/60">Depuis</p>
            <p className="display mt-2 text-7xl text-gold md:text-8xl">{site.since}</p>
          </div>
          <div className="md:col-span-5">
            <p data-ab="reveal" className="text-xl font-light leading-[1.5] md:text-2xl">
              Depuis {site.since}, General Constructor Group intervient dans les domaines de la construction et de l’ingénierie.
            </p>
            <p data-ab="reveal" className="mt-6 text-[15px] leading-relaxed text-bone/70">
              Son équipe technique pluridisciplinaire accompagne les clients des études de faisabilité, études architecturales et techniques
              jusqu’à la réalisation des projets — bâtiment, génie civil et infrastructures.
            </p>
            <p data-ab="reveal" className="mt-4 text-[15px] leading-relaxed text-bone/70">
              Notre engagement : concevoir et livrer des projets conformes aux attentes de nos clients et aux normes en vigueur.
            </p>
          </div>
          <ul data-ab="reveal" className="md:col-span-3 md:col-start-10" aria-label="Domaines d’intervention">
            {DOMAINS.map((d) => (
              <li key={d} className="flex items-center justify-between border-b border-bone/15 py-3.5 text-[14px] text-bone/85">
                {d}
                <span className="h-1 w-1 rounded-full bg-gold/70" aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
