import { useRef } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { useGsap } from '../hooks/useGsap'
import { useEnv } from '../lib/env'
import { competences, equipment, keyFigures, organisationTagline, poles, totalQty, vehicles } from '../data/organisation'
import SectionLabel from '../components/SectionLabel'
import SplitText from '../components/SplitText'

const pad = (n: number) => String(n).padStart(2, '0')

function ListRow({ name, value }: { name: string; value: string }) {
  return (
    <li data-org="row" className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
      <span className="text-[15px] text-bone/85">{name}</span>
      <span className="font-mono text-[13px] tracking-[0.08em] text-gold">{value}</span>
    </li>
  )
}

export default function Organisation() {
  const root = useRef<HTMLElement>(null)
  const { reducedMotion } = useEnv()

  useGsap(
    root,
    () => {
      if (reducedMotion) return
      gsap.from('[data-line]', { scaleX: 0, duration: 1.6, ease: EASE.out, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      gsap.from('[data-org="title"] .split-inner', {
        yPercent: 115,
        duration: 1.6,
        stagger: 0.05,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-org="title"]', start: 'top 85%' },
      })
      // Chiffres clés : comptage progressif
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const state = { v: 0 }
        gsap.to(state, {
          v: target,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = String(Math.round(state.v))
          },
        })
      })
      gsap.from('[data-org="figure"]', {
        autoAlpha: 0,
        y: 30,
        duration: 1.4,
        stagger: 0.1,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-org="figures"]', start: 'top 85%' },
      })
      gsap.utils.toArray<HTMLElement>('[data-org="block"]').forEach((block) => {
        gsap.from(block.querySelectorAll('[data-org="row"], [data-org="head"]'), {
          autoAlpha: 0,
          y: 18,
          duration: 1.1,
          stagger: 0.04,
          ease: EASE.out,
          scrollTrigger: { trigger: block, start: 'top 82%' },
        })
      })
    },
    [reducedMotion],
  )

  return (
    <section id="organisation" ref={root} className="relative bg-charcoal px-5 py-28 md:px-10 md:py-44" aria-labelledby="org-title">
      <div className="mx-auto max-w-[1800px]">
        <SectionLabel index="05" label="Organisation" />
        <h2 id="org-title" data-org="title" className="display mt-10 max-w-[20ch] text-[clamp(2.2rem,5.2vw,5.6rem)]">
          <SplitText text={organisationTagline} />
        </h2>

        {/* Chiffres clés */}
        <dl data-org="figures" className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-28 md:grid-cols-4">
          {keyFigures.map((f) => (
            <div key={f.label} data-org="figure" className="flex flex-col border-t border-line pt-6">
              <dt className="meta order-2 mt-3">{f.label}</dt>
              <dd className="display order-1 text-[clamp(3.6rem,8vw,8.5rem)] text-gold">
                <span data-count={reducedMotion ? undefined : f.value}>{reducedMotion ? f.value : 0}</span>
                {f.suffix}
              </dd>
            </div>
          ))}
        </dl>

        {/* Pôles & compétences */}
        <div className="mt-24 grid gap-16 md:mt-36 md:grid-cols-12">
          <div data-org="block" className="md:col-span-5">
            <h3 data-org="head" className="meta">
              Pôles opérationnels
            </h3>
            <ul className="mt-6 border-t border-line">
              {poles.map((p) => (
                <ListRow key={p.name} name={`Pôle ${p.name}`} value={`${p.team} collaborateurs`} />
              ))}
            </ul>
          </div>
          <div data-org="block" className="md:col-span-6 md:col-start-7">
            <h3 data-org="head" className="meta">
              Domaines de compétences
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-6">
              {competences.map((c) => (
                <div key={c.name} data-org="row">
                  <p className="text-xl font-light tracking-[-0.02em] md:text-2xl">{c.name}</p>
                  <ul className="mt-3 space-y-1.5">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-[14px] text-bone/60">
                        <span className="h-px w-3 bg-gold/60" aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Moyens matériels */}
        <div className="mt-24 md:mt-36">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h3 className="display text-[clamp(2rem,4vw,3.6rem)]">Moyens matériels</h3>
            <p className="max-w-sm text-[14px] leading-relaxed text-bone/55">
              Un parc propre d’engins, d’équipements de chantier et de véhicules pour maîtriser l’exécution.
            </p>
          </div>
          <div className="mt-12 grid gap-14 md:grid-cols-3 md:gap-10">
            {equipment.map((g) => (
              <div key={g.name} data-org="block">
                <div data-org="head" className="flex items-baseline justify-between border-b border-bone/30 pb-4">
                  <h4 className="text-xl font-light tracking-[-0.02em]">{g.name}</h4>
                  <span className="meta">{pad(totalQty(g.items))} unités</span>
                </div>
                <ul>
                  {g.items.map((it) => (
                    <ListRow key={it.name} name={it.name} value={pad(it.qty)} />
                  ))}
                </ul>
              </div>
            ))}
            <div data-org="block">
              <div data-org="head" className="flex items-baseline justify-between border-b border-bone/30 pb-4">
                <h4 className="text-xl font-light tracking-[-0.02em]">Véhicules</h4>
                <span className="meta">{pad(totalQty(vehicles))} unités</span>
              </div>
              <ul>
                {vehicles.map((v) => (
                  <ListRow key={v.name} name={v.name} value={pad(v.qty)} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
