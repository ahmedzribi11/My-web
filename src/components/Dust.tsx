import { useMemo } from 'react'
import { seeded } from '../lib/random'

/** Poussière flottante légère (CSS uniquement). */
export default function Dust({ count = 24, seed = 'dust', className = '' }: { count?: number; seed?: string; className?: string }) {
  const dots = useMemo(() => {
    const rnd = seeded(seed)
    return Array.from({ length: count }, () => ({
      left: rnd() * 100,
      top: rnd() * 100,
      size: 1 + rnd() * 1.5,
      dur: 14 + rnd() * 18,
      delay: -rnd() * 30,
      opacity: 0.15 + rnd() * 0.4,
    }))
  }, [count, seed])
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-bone"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animation: `dust ${d.dur}s ease-in-out ${d.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}
