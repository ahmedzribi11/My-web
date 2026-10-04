import { useRef } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { useGsap } from '../hooks/useGsap'
import { useEnv } from '../lib/env'
import { processSteps } from '../data/expertise'
import SectionLabel from '../components/SectionLabel'
import SplitText from '../components/SplitText'

export default function Process() {
  const root = useRef<HTMLElement>(null)
  const { reducedMotion } = useEnv()

  useGsap(
    root,
    () => {
      if (reducedMotion) return
      gsap.from('[data-line]', { scaleX: 0, duration: 1.6, ease: EASE.out, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      gsap.from('[data-pr="title"] .split-inner', {
        yPercent: 115,
        duration: 1.6,
        stagger: 0.06,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-pr="title"]', start: 'top 85%' },
      })
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)' }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean }
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '[data-pr="steps"]', start: desktop ? 'top 75%' : 'top 80%', end: desktop ? 'bottom 55%' : 'bottom 60%', scrub: 1 },
        })
        tl.fromTo('[data-pr="rail"]', desktop ? { scaleX: 0 } : { scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: 'none', duration: 5 }, 0)
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((el, i) => {
          tl.fromTo(el.querySelector('[data-node]'), { scale: 0.4, backgroundColor: 'rgba(5,5,5,1)' }, { scale: 1, backgroundColor: '#e8de9f', ease: 'none', duration: 0.4 }, i * 1.05)
          tl.fromTo(el.querySelectorAll('[data-step-text] > *'), { opacity: 0.12, y: 18 }, { opacity: 1, y: 0, stagger: 0.1, ease: 'none', duration: 0.6 }, i * 1.05)
        })
      })
    },
    [reducedMotion],
  )

  return (
    <section id="processus" ref={root} className="relative overflow-hidden px-5 py-28 md:px-10 md:py-48" aria-labelledby="pr-title">
      <div className="mx-auto max-w-[1800px]">
        <SectionLabel index="04" label="Processus" />
        <h2 id="pr-title" data-pr="title" className="display mt-10 max-w-[14ch] text-[clamp(2.4rem,6.5vw,7rem)] uppercase">
          <SplitText text="De la vision à la réalisation" />
        </h2>

        <ol data-pr="steps" className="relative mt-20 grid gap-14 pl-10 md:mt-32 md:grid-cols-5 md:gap-8 md:pl-0 md:pt-14">
          <span
            data-pr="rail"
            aria-hidden
            className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-bone/40 md:bottom-auto md:left-0 md:right-0 md:top-[6px] md:h-px md:w-auto md:origin-left"
          />
          {processSteps.map((s) => (
            <li key={s.index} data-step className="relative">
              <span
                data-node
                aria-hidden
                className="absolute -left-10 top-1.5 block h-[11px] w-[11px] rounded-full border border-gold bg-gold md:-top-[3.85rem] md:left-0"
              />
              <div data-step-text>
                <p className="meta">{s.index}</p>
                <h3 className="mt-3 text-3xl font-light tracking-[-0.03em] md:text-[clamp(1.6rem,2.4vw,2.6rem)]">{s.title}</h3>
                <p className="mt-3 max-w-[22ch] text-[14px] leading-relaxed text-bone/55">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
