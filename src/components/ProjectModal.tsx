import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, EASE } from '../animations/gsap'
import { lockScroll } from '../animations/smoothScroll'
import { CATEGORY_LABELS, STATUS_LABELS, projects, type Project } from '../data/projects'
import { useEnv } from '../lib/env'
import ProjectVisual from './ProjectVisual'

interface Props {
  project: Project
  onClose: () => void
  onNavigate: (id: string) => void
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-line pt-4">
      <dt className="meta !text-[10px]">{label}</dt>
      <dd className="mt-2 text-lg font-light">{value}</dd>
    </div>
  )
}

/** Fiche projet plein écran. N’affiche que les informations documentées. */
export default function ProjectModal({ project, onClose, onNavigate }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const { reducedMotion } = useEnv()
  const closing = useRef(false)

  const idx = projects.findIndex((p) => p.id === project.id)
  const next = projects[(idx + 1) % projects.length]

  const facts: [string, string][] = []
  if (project.location) facts.push(['Lieu', project.location])
  if (project.year) facts.push(['Année', project.year])
  if (project.surface) facts.push(['Surface', project.surface])
  if (project.status) facts.push(['Statut', STATUS_LABELS[project.status]])
  if (project.category) facts.push(['Catégorie', CATEGORY_LABELS[project.category]])

  const requestClose = () => {
    if (closing.current) return
    closing.current = true
    if (reducedMotion || !root.current) return onClose()
    gsap.to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: EASE.cinematic, onComplete: onClose })
  }

  useEffect(() => {
    lockScroll(true)
    const prevFocus = document.activeElement as HTMLElement | null
    closeBtn.current?.focus({ preventScroll: true })
    return () => {
      lockScroll(false)
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [])

  // Entrée + changement de projet
  useLayoutEffect(() => {
    closing.current = false
    scroller.current?.scrollTo({ top: 0 })
    if (reducedMotion || !root.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(root.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.cinematic })
      gsap.from('[data-md="title"]', { yPercent: 110, duration: 1.4, ease: EASE.out, delay: 0.45 })
      gsap.from('[data-md="fade"]', { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.08, ease: EASE.out, delay: 0.6 })
      gsap.from('[data-md="hero"]', { scale: 1.12, duration: 2.2, ease: EASE.out })
    }, root)
    return () => ctx.revert()
  }, [project.id, reducedMotion])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
      if (e.key === 'Tab' && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      className="fixed inset-0 z-[80] bg-ink"
    >
      <div ref={scroller} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
        <div className="fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-between bg-gradient-to-b from-ink via-ink/70 to-transparent px-5 md:h-24 md:px-10">
          <span className="meta">
            Projet {String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <button ref={closeBtn} type="button" onClick={requestClose} className="btn btn-outline !h-11 bg-ink/40 backdrop-blur-md">
            Fermer
            <span aria-hidden>✕</span>
          </button>
        </div>

        <div className="relative h-[70svh] overflow-hidden md:h-[88svh]">
          <div data-md="hero" className="absolute inset-0">
            <ProjectVisual project={project} className="h-full w-full" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10 md:pb-16">
            <div className="overflow-hidden">
              <h2 id="project-title" data-md="title" className="display text-[clamp(3rem,10vw,11rem)] uppercase">
                {project.name}
              </h2>
            </div>
            {project.composition && (
              <p data-md="fade" className="mt-4 max-w-2xl text-lg font-light text-bone/80 md:text-2xl">
                {project.composition}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto grid max-w-[1800px] gap-16 px-5 py-20 md:grid-cols-12 md:px-10 md:py-32">
          {facts.length > 0 && (
            <dl data-md="fade" className="grid grid-cols-2 gap-6 md:col-span-4 md:grid-cols-1">
              {facts.map(([l, v]) => (
                <Fact key={l} label={l} value={v} />
              ))}
            </dl>
          )}

          <div className="space-y-16 md:col-span-7 md:col-start-6">
            {project.missions && project.missions.length > 0 && (
              <div data-md="fade">
                <h3 className="meta">Missions</h3>
                <ul className="mt-6">
                  {project.missions.map((m, i) => (
                    <li key={m} className="flex gap-6 border-t border-line py-5 text-xl font-light md:text-2xl">
                      <span className="meta pt-2">{String(i + 1).padStart(2, '0')}</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.typologies && project.typologies.length > 0 && (
              <div data-md="fade">
                <h3 className="meta">Typologies</h3>
                <table className="mt-6 w-full text-left">
                  <thead className="sr-only">
                    <tr>
                      <th>Typologie</th>
                      <th>Surface</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.typologies.map((t) => (
                      <tr key={t.name} className="border-t border-line">
                        <td className="py-5 text-xl font-light md:text-2xl">{t.name}</td>
                        <td className="py-5 text-right font-mono text-sm text-bone/70">{t.surface}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {project.images.length > 1 && (
          <div className="mx-auto grid max-w-[1800px] gap-4 px-5 pb-24 md:grid-cols-2 md:px-10">
            {project.images.slice(1).map((_, i) => (
              <ProjectVisual key={i} project={project} imageIndex={i + 1} className="aspect-[4/3] w-full" sizes="(min-width: 768px) 50vw, 100vw" />
            ))}
          </div>
        )}

        <button
          type="button"
          data-cursor="view"
          onClick={() => onNavigate(next.id)}
          className="group block w-full border-t border-line px-5 py-16 text-left md:px-10 md:py-24"
        >
          <span className="meta">Projet suivant</span>
          <span className="display mt-4 block text-[clamp(2.4rem,7vw,7rem)] uppercase text-bone/40 transition-colors duration-700 group-hover:text-bone">
            {next.name}
          </span>
        </button>
      </div>
    </div>
  )
}
