import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, EASE, ScrollTrigger } from '../animations/gsap'
import { useGsap } from '../hooks/useGsap'
import { useEnv } from '../lib/env'
import { useProjectRouter } from '../lib/projectRouter'
import { CATEGORY_LABELS, STATUS_LABELS, projects, projectTiming, type ProjectCategory, type ProjectStatus } from '../data/projects'
import ProjectVisual from '../components/ProjectVisual'

type Filter = { kind: 'all' } | { kind: 'category'; value: ProjectCategory } | { kind: 'status'; value: ProjectStatus }

const pad = (n: number) => String(n).padStart(2, '0')

export default function ProjectIndex() {
  const root = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<Filter>({ kind: 'all' })
  const [hovered, setHovered] = useState<string | null>(null)
  const { touch, reducedMotion } = useEnv()
  const { open } = useProjectRouter()

  // Seuls les filtres ayant des projets documentés sont proposés
  const filters = useMemo(() => {
    const cats = (Object.keys(CATEGORY_LABELS) as ProjectCategory[]).filter((c) => projects.some((p) => p.category === c))
    const statuses = (Object.keys(STATUS_LABELS) as ProjectStatus[]).filter((s) => projects.some((p) => p.status === s))
    return [
      { key: 'all', label: 'Tous', filter: { kind: 'all' } as Filter },
      ...cats.map((c) => ({ key: c, label: CATEGORY_LABELS[c], filter: { kind: 'category', value: c } as Filter })),
      ...statuses.map((s) => ({ key: s, label: STATUS_LABELS[s], filter: { kind: 'status', value: s } as Filter })),
    ]
  }, [])

  const list = useMemo(
    () =>
      projects.filter((p) =>
        filter.kind === 'all' ? true : filter.kind === 'category' ? p.category === filter.value : p.status === filter.value,
      ),
    [filter],
  )

  const activeKey = filter.kind === 'all' ? 'all' : filter.value
  const hoveredProject = projects.find((p) => p.id === hovered)

  useGsap(
    root,
    () => {
      if (reducedMotion) return
      gsap.from('[data-row]', {
        autoAlpha: 0,
        y: 24,
        duration: 1.1,
        stagger: 0.04,
        ease: EASE.out,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    },
    [reducedMotion],
  )

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [list.length])

  // Aperçu flottant qui suit le curseur
  useEffect(() => {
    const el = preview.current
    if (!el || touch) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      xTo(e.clientX + 32)
      yTo(e.clientY - 120)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [touch])

  return (
    <div ref={root} className="mx-auto max-w-[1800px] px-5 pb-28 pt-28 md:px-10 md:pb-44 md:pt-40">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h3 className="display shrink-0 text-[clamp(2rem,4vw,3.6rem)]">Index des projets</h3>
        <div role="group" aria-label="Filtrer les projets" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-end md:px-0 md:pb-0">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={activeKey === f.key}
              onClick={() => setFilter(f.filter)}
              className={`h-10 shrink-0 rounded-full border px-4 text-[12px] tracking-[0.06em] transition-colors duration-500 ${
                activeKey === f.key ? 'border-bone bg-bone text-ink' : 'border-line text-bone/70 hover:border-bone/50 hover:text-bone'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="meta mt-14 hidden grid-cols-12 gap-6 border-b border-line pb-4 md:grid" aria-hidden>
        <span className="col-span-1">N°</span>
        <span className="col-span-5">Projet</span>
        <span className="col-span-2">Catégorie</span>
        <span className="col-span-2">Lieu</span>
        <span className="col-span-2 text-right">Période</span>
      </div>

      <ul className="mt-6 md:mt-0" onMouseLeave={() => setHovered(null)}>
        {list.map((p) => (
          <li key={p.id} data-row className="border-b border-line">
            <button
              type="button"
              data-cursor="view"
              onClick={() => open(p.id)}
              onMouseEnter={() => setHovered(p.id)}
              onFocus={() => setHovered(p.id)}
              onBlur={() => setHovered(null)}
              className="group grid w-full grid-cols-12 items-baseline gap-x-6 gap-y-1 py-5 text-left md:py-7"
            >
              <span className="meta col-span-2 md:col-span-1">{pad(p.number)}</span>
              <span className="col-span-10 text-2xl font-light tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 md:col-span-5 md:text-4xl">
                {p.name}
              </span>
              <span className="col-span-10 col-start-3 text-[13px] text-bone/55 md:col-span-2 md:col-start-auto">
                {p.category ? CATEGORY_LABELS[p.category] : ''}
              </span>
              <span className="col-span-10 col-start-3 text-[13px] text-bone/55 md:col-span-2 md:col-start-auto">{p.location ?? ''}</span>
              <span className="col-span-10 col-start-3 text-[13px] text-bone/55 md:col-span-2 md:col-start-auto md:text-right">
                {projectTiming(p)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {!touch && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[15rem] w-[22rem] overflow-hidden md:block"
          style={{
            opacity: hoveredProject ? 1 : 0,
            clipPath: hoveredProject ? 'inset(0 0 0 0)' : 'inset(50% 50% 50% 50%)',
            transition: 'opacity .6s, clip-path .9s cubic-bezier(.16,1,.3,1)',
          }}
        >
          {hoveredProject && <ProjectVisual key={hoveredProject.id} project={hoveredProject} className="h-full w-full" sizes="22rem" />}
        </div>
      )}
    </div>
  )
}
