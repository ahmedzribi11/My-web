import { useRef } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { useGsap } from '../hooks/useGsap'
import { useEnv } from '../lib/env'
import { useProjectRouter } from '../lib/projectRouter'
import { CATEGORY_LABELS, STATUS_LABELS, featuredProjects, type Project } from '../data/projects'
import ProjectVisual from '../components/ProjectVisual'
import SectionLabel from '../components/SectionLabel'
import SplitText from '../components/SplitText'
import ProjectIndex from './ProjectIndex'

const pad = (n: number) => String(n).padStart(2, '0')

function Slide({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <article
      data-slide
      className="relative w-full shrink-0 md:h-full md:w-[82vw] lg:w-[74vw]"
      aria-label={`${pad(index + 1)} — ${project.name}`}
    >
      <button
        type="button"
        onClick={onOpen}
        data-cursor="view"
        aria-label={`Voir le projet ${project.name}`}
        className="group block w-full text-left md:absolute md:inset-0"
      >
        <div
          data-slide-frame
          className="relative aspect-[4/3] w-full overflow-hidden bg-graphite md:absolute md:left-0 md:top-[16vh] md:aspect-auto md:h-[60vh] md:w-[56vw] lg:w-[50vw]"
        >
          <div data-slide-media className="absolute -inset-x-[8%] inset-y-0 transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
            <ProjectVisual project={project} className="h-full w-full" sizes="(min-width: 768px) 56vw, 100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
        </div>
      </button>

      <div className="pointer-events-none relative mt-6 md:absolute md:inset-0 md:mt-0">
        <span data-slide-index className="meta md:absolute md:left-0 md:top-[10vh]">
          {pad(index + 1)} / {pad(featuredProjects.length)}
        </span>
        <h3
          data-slide-title
          className="display mt-3 text-[clamp(2.4rem,9vw,4rem)] uppercase md:absolute md:bottom-[12vh] md:left-[3vw] md:mt-0 md:max-w-[60vw] md:text-[clamp(3rem,6.4vw,7.5rem)]"
        >
          {project.name}
        </h3>
        <dl
          data-slide-info
          className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 md:absolute md:left-[59vw] md:top-[16vh] md:mt-0 md:w-[13vw] md:min-w-[11rem] md:grid-cols-1 lg:left-[53vw]"
        >
          {project.location && <Info label="Lieu" value={project.location} />}
          {project.surface && <Info label="Surface" value={project.surface} />}
          {project.status && <Info label="Statut" value={`${project.year ? `${project.year} — ` : ''}${STATUS_LABELS[project.status]}`} />}
          {project.category && <Info label="Catégorie" value={CATEGORY_LABELS[project.category]} />}
          {project.missions?.[0] && <Info label="Missions" value={project.missions[0]} />}
        </dl>
        <span data-slide-cta className="meta mt-6 flex items-center gap-3 !text-bone md:absolute md:bottom-[12vh] md:left-[59vw] md:mt-0 lg:left-[53vw]">
          Voir le projet <span className="h-px w-8 bg-bone/50" />
        </span>
      </div>
    </article>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="meta !text-[10px]">{label}</dt>
      <dd className="mt-1 text-[15px] text-bone/85">{value}</dd>
    </div>
  )
}

export default function Projects() {
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const { reducedMotion } = useEnv()
  const { open } = useProjectRouter()

  useGsap(
    root,
    () => {
      const mm = gsap.matchMedia()
      if (!reducedMotion) {
        gsap.from('[data-line]', { scaleX: 0, duration: 1.6, ease: EASE.out, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
        gsap.from('[data-pj="title"] .split-inner', {
          yPercent: 115,
          duration: 1.6,
          stagger: 0.08,
          ease: EASE.out,
          scrollTrigger: { trigger: '[data-pj="title"]', start: 'top 85%' },
        })
      }

      mm.add(
        { desktop: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean }
          const slides = gsap.utils.toArray<HTMLElement>('[data-slide]')

          if (desktop && track.current && pin.current) {
            const distance = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0)
            const scroll = gsap.to(track.current, {
              x: () => -distance(),
              ease: 'none',
              scrollTrigger: {
                trigger: pin.current,
                start: 'top top',
                end: () => `+=${distance()}`,
                pin: true,
                scrub: reduce ? true : 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`
                },
              },
            })
            if (reduce) return

            slides.forEach((slide) => {
              const st = { trigger: slide, containerAnimation: scroll, scrub: true }
              gsap.fromTo(
                slide.querySelector('[data-slide-frame]'),
                { clipPath: 'inset(14% 22% 14% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { ...st, start: 'left 95%', end: 'left 35%' } },
              )
              gsap.fromTo(
                slide.querySelector('[data-slide-media]'),
                { xPercent: -6 },
                { xPercent: 6, ease: 'none', scrollTrigger: { ...st, start: 'left right', end: 'right left' } },
              )
              gsap.fromTo(
                slide.querySelector('[data-slide-title]'),
                { xPercent: 18, opacity: 0 },
                { xPercent: -4, opacity: 1, ease: 'none', scrollTrigger: { ...st, start: 'left 85%', end: 'left 20%' } },
              )
              gsap.fromTo(
                slide.querySelectorAll('[data-slide-info] > div, [data-slide-index], [data-slide-cta]'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.05, ease: 'none', scrollTrigger: { ...st, start: 'left 70%', end: 'left 35%' } },
              )
            })
          } else if (!reduce) {
            slides.forEach((slide) => {
              gsap.fromTo(
                slide.querySelector('[data-slide-frame]'),
                { clipPath: 'inset(10% 10% 10% 10%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: EASE.cinematic, scrollTrigger: { trigger: slide, start: 'top 85%' } },
              )
              gsap.from(slide.querySelectorAll('[data-slide-title], [data-slide-info] > div'), {
                autoAlpha: 0,
                y: 24,
                duration: 1.2,
                stagger: 0.06,
                ease: EASE.out,
                scrollTrigger: { trigger: slide, start: 'top 70%' },
              })
            })
          }
        },
      )
    },
    [reducedMotion],
  )

  return (
    <section id="projets" ref={root} className="relative" aria-labelledby="pj-title">
      <div className="mx-auto max-w-[1800px] px-5 pb-14 pt-28 md:px-10 md:pb-6 md:pt-44">
        <SectionLabel index="03" label="Projets" />
        <div className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="pj-title" data-pj="title" className="display text-[clamp(2.6rem,6.5vw,7rem)]">
            <SplitText text="Projets phares" />
          </h2>
          <p className="meta">{pad(featuredProjects.length)} projets sélectionnés</p>
        </div>
      </div>

      <div ref={pin} className="relative md:h-svh md:overflow-hidden">
        <div ref={track} className="flex flex-col gap-20 px-5 md:h-full md:flex-row md:gap-[4vw] md:pl-[6vw] md:pr-[16vw] md:will-change-transform">
          {featuredProjects.map((p, i) => (
            <Slide key={p.id} project={p} index={i} onOpen={() => open(p.id)} />
          ))}
        </div>
        <div className="absolute inset-x-10 bottom-8 hidden items-center gap-6 md:flex" aria-hidden>
          <span className="meta">Défilement</span>
          <div className="h-px flex-1 bg-line">
            <div ref={progress} className="h-px origin-left scale-x-0 bg-bone" />
          </div>
        </div>
      </div>

      <ProjectIndex />
    </section>
  )
}
