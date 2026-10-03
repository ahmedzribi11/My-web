import { useRef } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { useGsap } from '../hooks/useGsap'
import { useEnv } from '../lib/env'
import SplitText from '../components/SplitText'
import SectionLabel from '../components/SectionLabel'
import Dust from '../components/Dust'

const PILLARS = ['Conception', 'Engineering', 'Construction']

export default function SavoirFaire() {
  const root = useRef<HTMLElement>(null)
  const { reducedMotion } = useEnv()

  useGsap(
    root,
    () => {
      if (reducedMotion) return
      gsap.from('[data-line]', { scaleX: 0, duration: 1.6, ease: EASE.out, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      gsap.from('[data-sf="title"] .split-inner', {
        yPercent: 115,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: '[data-sf="title"]', start: 'top 85%', end: 'top 35%', scrub: 1 },
      })
      gsap.from('[data-sf="text"]', {
        autoAlpha: 0,
        y: 30,
        filter: 'blur(6px)',
        duration: 1.6,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-sf="text"]', start: 'top 85%' },
      })
      // Les trois piliers apparaissent progressivement avec le scroll
      const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-sf="pillars"]', start: 'top 80%', end: 'bottom 45%', scrub: 1 } })
      gsap.utils.toArray<HTMLElement>('[data-pillar]').forEach((el, i) => {
        tl.fromTo(el.querySelector('[data-word]'), { opacity: 0.07, xPercent: -3 }, { opacity: 1, xPercent: 0, ease: 'none' }, i * 0.6)
        tl.fromTo(el.querySelector('[data-rule]'), { scaleX: 0 }, { scaleX: 1, ease: 'none' }, i * 0.6)
      })
    },
    [reducedMotion],
  )

  return (
    <section id="savoir-faire" ref={root} className="relative overflow-hidden px-5 py-28 md:px-10 md:py-48" aria-labelledby="sf-title">
      <Dust count={28} seed="savoir-faire" />
      <div className="mx-auto max-w-[1800px]">
        <SectionLabel index="01" label="Notre savoir-faire" />

        <div className="mt-14 grid gap-12 md:mt-24 md:grid-cols-12">
          <h2 id="sf-title" data-sf="title" className="display text-[clamp(3rem,9vw,9.5rem)] md:col-span-8">
            <SplitText text="De l’idée à l’ouvrage." />
          </h2>
          <div data-sf="text" className="flex flex-col justify-end gap-6 md:col-span-4 md:col-start-9">
            <p className="text-lg leading-relaxed text-bone/80 md:text-xl">
              GCG accompagne ses clients dans la réalisation de leurs projets, des études de faisabilité et études architecturales et
              techniques jusqu’à la réalisation des ouvrages.
            </p>
            <p className="meta">Construction · Ingénierie</p>
          </div>
        </div>

        <ul data-sf="pillars" className="mt-24 md:mt-40" aria-label="Nos piliers">
          {PILLARS.map((word, i) => (
            <li key={word} data-pillar className="relative py-4 md:py-6">
              <div className="flex items-baseline gap-5 md:gap-10">
                <span className="meta w-8 shrink-0">0{i + 1}</span>
                <span data-word className="display block text-[clamp(2.6rem,11vw,12rem)] uppercase">
                  {word}
                </span>
              </div>
              <span data-rule className="absolute inset-x-0 bottom-0 block h-px origin-left bg-line" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
