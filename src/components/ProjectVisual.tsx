import { memo, useMemo, useRef } from 'react'
import type { Project } from '../data/projects'
import { seeded } from '../lib/random'
import { useInView } from '../hooks/useInView'

interface Props {
  project: Project
  className?: string
  /** Index d’image à afficher si des visuels réels existent. */
  imageIndex?: number
  sizes?: string
  priority?: boolean
}

interface Volume {
  x: number
  w: number
  h: number
  floors: number
  bays: number
}

const W = 1600
const H = 1000
const GROUND = 780

function buildVolumes(project: Project): Volume[] {
  const rnd = seeded(project.id)
  const kind = project.category
  const count = kind === 'hotellerie-tourisme' ? 3 + Math.floor(rnd() * 2) : kind === 'residentiels' ? 2 + Math.floor(rnd() * 2) : 1 + Math.floor(rnd() * 3)
  const vols: Volume[] = []
  let x = 260 + rnd() * 120
  for (let i = 0; i < count; i++) {
    const tall = kind === undefined || (kind !== 'hotellerie-tourisme' && rnd() > 0.55)
    const floors = tall ? 5 + Math.floor(rnd() * 6) : 2 + Math.floor(rnd() * 2)
    const fh = 54 + rnd() * 10
    const w = 180 + rnd() * 260
    vols.push({ x, w, h: floors * fh, floors, bays: Math.max(3, Math.round(w / 52)) })
    x += w - rnd() * 40 + 10
    if (x > W - 320) break
  }
  return vols
}

/**
 * Visuel de projet. Utilise l’image réelle si elle est fournie, sinon une
 * élévation schématique générative (aucune photo de stock).
 */
function ProjectVisual({ project, className = '', imageIndex = 0, sizes = '100vw', priority = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, '0px 0px -10% 0px')
  const src = project.images[imageIndex]
  const vols = useMemo(() => buildVolumes(project), [project])

  if (src) {
    return (
      <div ref={ref} className={`relative overflow-hidden bg-graphite ${className}`}>
        <img
          src={src}
          alt={`${project.name}${project.location ? ` — ${project.location}` : ''}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const left = vols[0]?.x ?? 300
  const last = vols[vols.length - 1]
  const right = last ? last.x + last.w : W - 300
  const maxH = Math.max(...vols.map((v) => v.h))

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} role="img" aria-label={`${project.name} — élévation schématique`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={`draw h-full w-full ${inView ? 'is-drawn' : ''}`}>
        <defs>
          <radialGradient id={`bg-${project.id}`} cx="55%" cy="45%" r="75%">
            <stop offset="0" stopColor="#1d1d1e" />
            <stop offset="1" stopColor="#080808" />
          </radialGradient>
          <linearGradient id={`fill-${project.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2efe9" stopOpacity="0.07" />
            <stop offset="1" stopColor="#f2efe9" stopOpacity="0.015" />
          </linearGradient>
          <pattern id={`grid-${project.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#f2efe9" strokeOpacity="0.035" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#bg-${project.id})`} />
        <rect width={W} height={H} fill={`url(#grid-${project.id})`} />

        <g fill="none" stroke="#f2efe9" strokeWidth="1.2" vectorEffect="non-scaling-stroke">
          {/* Sol */}
          <line x1="80" y1={GROUND} x2={W - 80} y2={GROUND} pathLength={1} strokeOpacity="0.5" />
          {/* Axes */}
          {vols.map((v, i) => (
            <g key={`ax-${i}`} strokeOpacity="0.14" strokeDasharray="6 8">
              <line x1={v.x} y1={GROUND + 120} x2={v.x} y2={GROUND - maxH - 80} pathLength={1} />
            </g>
          ))}
          {/* Volumes */}
          {vols.map((v, i) => (
            <g key={i}>
              <rect x={v.x} y={GROUND - v.h} width={v.w} height={v.h} fill={`url(#fill-${project.id})`} strokeOpacity="0.85" pathLength={1} />
              {Array.from({ length: v.floors - 1 }, (_, f) => (
                <line key={f} x1={v.x} x2={v.x + v.w} y1={GROUND - ((f + 1) * v.h) / v.floors} y2={GROUND - ((f + 1) * v.h) / v.floors} strokeOpacity="0.35" pathLength={1} />
              ))}
              {Array.from({ length: v.bays - 1 }, (_, b) => (
                <line key={b} y1={GROUND - v.h} y2={GROUND} x1={v.x + ((b + 1) * v.w) / v.bays} x2={v.x + ((b + 1) * v.w) / v.bays} strokeOpacity="0.12" pathLength={1} />
              ))}
            </g>
          ))}
          {/* Cotation */}
          <g strokeOpacity="0.45">
            <line x1={left} x2={right} y1={GROUND + 70} y2={GROUND + 70} pathLength={1} />
            <line x1={left} x2={left} y1={GROUND + 58} y2={GROUND + 82} pathLength={1} />
            <line x1={right} x2={right} y1={GROUND + 58} y2={GROUND + 82} pathLength={1} />
            <line x1={right + 70} x2={right + 70} y1={GROUND} y2={GROUND - maxH} pathLength={1} />
            <line x1={right + 58} x2={right + 82} y1={GROUND - maxH} y2={GROUND - maxH} pathLength={1} />
          </g>
        </g>

        <g fill="#f2efe9" fontFamily="Geist Mono Variable, monospace" fontSize="15" letterSpacing="3" opacity="0.5">
          {vols.map((v, i) => (
            <text key={i} x={v.x} y={GROUND + 140} textAnchor="middle">
              {String.fromCharCode(65 + i)}
            </text>
          ))}
          <text x={W - 80} y={H - 60} textAnchor="end">
            {project.name.toUpperCase()} — ÉLÉVATION SCHÉMATIQUE
          </text>
        </g>
      </svg>
    </div>
  )
}

export default memo(ProjectVisual)
