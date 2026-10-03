import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE } from '../animations/gsap'
import { useGsap } from '../hooks/useGsap'
import { useEnv } from '../lib/env'
import { expertise } from '../data/expertise'
import ExpertiseVisual from '../components/ExpertiseVisual'
import SectionLabel from '../components/SectionLabel'
import SplitText from '../components/SplitText'

export default function Expertise() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { reducedMotion } = useEnv()

  useGsap(
    root,
    () => {
      // Le domaine actif suit la lecture (utile au tactile et au clavier)
      gsap.utils.toArray<HTMLElement>('[data-exp-item]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
      if (reducedMotion) return
      gsap.from('[data-line]', { scaleX: 0, duration: 1.6, ease: EASE.out, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      gsap.from('[data-exp="title"] .split-inner', {
        yPercent: 115,
        duration: 1.6,
        stagger: 0.08,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-exp="title"]', start: 'top 85%' },
      })
      gsap.from('[data-exp-item]', {
        autoAlpha: 0,
        y: 40,
        duration: 1.4,
        stagger: 0.1,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-exp="list"]', start: 'top 80%' },
      })
      gsap.from('[data-exp="frame"]', {
        clipPath: 'inset(18% 18% 18% 18%)',
        duration: 2,
        ease: EASE.cinematic,
        scrollTrigger: { trigger: '[data-exp="frame"]', start: 'top 80%' },
      })
    },
    [reducedMotion],
  )

  const current = expertise[active]

  return (
    <section id="expertise" ref={root} className="relative bg-charcoal px-5 py-28 md:px-10 md:py-44" aria-labelledby="exp-title">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index="02" label="Expertise" />
            <h2 id="exp-title" data-exp="title" className="display mt-10 text-[clamp(2.6rem,6.5vw,7rem)]">
              <SplitText text="Une expertise intégrée." />
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-bone/60">
            Études, ingénierie, construction, aménagement et infrastructures : un même interlocuteur, de la conception à la livraison.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:mt-28 md:grid-cols-12 md:gap-16">
          {/* Visuel (desktop) */}
          <div className="hidden md:col-span-5 md:block">
            <div
              data-exp="frame"
              className="sticky top-28 aspect-[4/5] max-h-[calc(100svh-9rem)] w-full overflow-hidden border border-line bg-ink"
            >
              <span key={active} className="sweep-once" aria-hidden />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(242,239,233,0.07),transparent_65%)]" />
              {expertise.map((e, i) => (
                <ExpertiseVisual
                  key={e.id}
                  kind={e.visual}
                  active={i === active}
                  className="absolute inset-0 h-full w-full p-10 transition-opacity duration-1000"
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <span className="meta">{current.index} / 05</span>
                <span className="meta text-right">{current.title}</span>
              </div>
            </div>
          </div>

          {/* Liste */}
          <ol data-exp="list" className="md:col-span-7">
            {expertise.map((e, i) => {
              const isActive = i === active
              return (
                <li
                  key={e.id}
                  data-exp-item
                  className={`sweep border-t border-line last:border-b ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls={`exp-panel-${e.id}`}
                    className="flex w-full items-baseline gap-6 py-7 text-left md:gap-10 md:py-9"
                  >
                    <span className={`meta w-8 shrink-0 transition-colors duration-700 ${isActive ? '!text-bone' : ''}`}>{e.index}</span>
                    <span
                      className={`display block text-[clamp(1.9rem,4vw,4.2rem)] transition-[transform,color] duration-[900ms] ease-[var(--ease-out-expo)] ${
                        isActive ? 'translate-x-2 text-bone md:translate-x-4' : 'text-bone/35'
                      }`}
                    >
                      {e.title}
                    </span>
                  </button>
                  <div
                    id={`exp-panel-${e.id}`}
                    className="grid transition-[grid-template-rows,opacity] duration-[900ms] ease-[var(--ease-out-expo)]"
                    style={{ gridTemplateRows: isActive ? '1fr' : '0fr', opacity: isActive ? 1 : 0 }}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-8 pb-10 pl-14 md:grid-cols-2 md:pl-[4.5rem]">
                        <p className="text-[15px] leading-relaxed text-bone/70">{e.description}</p>
                        <ul className="space-y-2">
                          {e.items.map((it) => (
                            <li key={it} className="meta flex items-center gap-3 !tracking-[0.12em] !text-bone/80">
                              <span className="h-px w-4 bg-bone/40" />
                              {it}
                            </li>
                          ))}
                        </ul>
                        <div className="relative aspect-[4/3] border border-line bg-ink md:hidden">
                          <ExpertiseVisual kind={e.visual} active={isActive} className="absolute inset-0 h-full w-full p-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
