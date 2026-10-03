import type { ExpertiseVisual as Kind } from '../data/expertise'

const S = { fill: 'none', stroke: '#f2efe9', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' as const }

function Study() {
  return (
    <g {...S}>
      <rect x="120" y="140" width="560" height="420" pathLength={1} strokeOpacity="0.9" />
      <line x1="120" y1="330" x2="420" y2="330" pathLength={1} strokeOpacity="0.6" />
      <line x1="420" y1="140" x2="420" y2="560" pathLength={1} strokeOpacity="0.6" />
      <line x1="420" y1="420" x2="680" y2="420" pathLength={1} strokeOpacity="0.6" />
      <path d="M300 330 A60 60 0 0 1 360 270" pathLength={1} strokeOpacity="0.4" />
      <path d="M420 480 A55 55 0 0 0 475 425" pathLength={1} strokeOpacity="0.4" />
      <line x1="120" y1="610" x2="680" y2="610" pathLength={1} strokeOpacity="0.4" />
      <line x1="120" y1="598" x2="120" y2="622" pathLength={1} strokeOpacity="0.4" />
      <line x1="680" y1="598" x2="680" y2="622" pathLength={1} strokeOpacity="0.4" />
      <line x1="730" y1="140" x2="730" y2="560" pathLength={1} strokeOpacity="0.4" />
      <circle cx="560" cy="270" r="40" pathLength={1} strokeOpacity="0.25" />
    </g>
  )
}

function Engineering() {
  const cols = [140, 300, 460, 620]
  const rows = [160, 300, 440, 580]
  return (
    <g {...S}>
      {cols.map((x) => (
        <line key={`c${x}`} x1={x} y1="120" x2={x} y2="620" pathLength={1} strokeOpacity="0.55" />
      ))}
      {rows.map((y) => (
        <line key={`r${y}`} x1="100" y1={y} x2="660" y2={y} pathLength={1} strokeOpacity="0.55" />
      ))}
      <path d="M140 580 L300 440 L460 580 L620 440" pathLength={1} strokeOpacity="0.9" />
      <path d="M140 300 L300 160 L460 300 L620 160" pathLength={1} strokeOpacity="0.9" />
      {cols.map((x) => (
        <rect key={`n${x}`} x={x - 6} y="574" width="12" height="12" pathLength={1} strokeOpacity="0.9" />
      ))}
      {[220, 380, 540].map((x) => (
        <path key={`a${x}`} d={`M${x} 70 L${x} 130 M${x - 8} 118 L${x} 130 L${x + 8} 118`} pathLength={1} strokeOpacity="0.45" />
      ))}
    </g>
  )
}

function Construction() {
  const floors = Array.from({ length: 9 }, (_, i) => 620 - i * 56)
  return (
    <g {...S}>
      <line x1="80" y1="620" x2="720" y2="620" pathLength={1} strokeOpacity="0.8" />
      <rect x="240" y="172" width="300" height="448" pathLength={1} strokeOpacity="0.9" />
      {floors.map((y) => (
        <line key={y} x1="240" y1={y} x2="540" y2={y} pathLength={1} strokeOpacity="0.4" />
      ))}
      {[300, 360, 420, 480].map((x) => (
        <line key={x} x1={x} y1="172" x2={x} y2="620" pathLength={1} strokeOpacity="0.15" />
      ))}
      <path d="M540 172 L540 90 L620 90 L620 620" pathLength={1} strokeOpacity="0.35" />
      {[150, 230, 310, 390, 470, 550].map((y) => (
        <line key={`s${y}`} x1="540" y1={y} x2="620" y2={y + 40} pathLength={1} strokeOpacity="0.25" />
      ))}
      <path d="M180 620 L180 60 L700 60 M180 60 L120 60 M640 60 L640 130" pathLength={1} strokeOpacity="0.5" />
    </g>
  )
}

function Landscape() {
  return (
    <g {...S}>
      <path d="M90 540 C220 470 320 600 460 520 S680 470 720 500" pathLength={1} strokeOpacity="0.35" />
      <path d="M90 470 C230 400 330 520 470 450 S680 400 720 430" pathLength={1} strokeOpacity="0.25" />
      <path d="M90 400 C240 330 340 450 480 380 S680 330 720 360" pathLength={1} strokeOpacity="0.18" />
      <rect x="260" y="180" width="280" height="170" pathLength={1} strokeOpacity="0.9" />
      <rect x="560" y="230" width="110" height="60" pathLength={1} strokeOpacity="0.6" />
      <path d="M400 350 L400 420 C400 470 330 500 260 620" pathLength={1} strokeOpacity="0.6" />
      {[[150, 230], [190, 310], [130, 380], [620, 380], [690, 160], [610, 140]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="26" pathLength={1} strokeOpacity="0.5" />
      ))}
    </g>
  )
}

function Infrastructure() {
  return (
    <g {...S}>
      <line x1="60" y1="300" x2="740" y2="300" pathLength={1} strokeOpacity="0.9" />
      <line x1="60" y1="322" x2="740" y2="322" pathLength={1} strokeOpacity="0.6" />
      <path d="M120 600 Q260 330 400 322 Q540 330 680 600" pathLength={1} strokeOpacity="0.7" />
      {[180, 250, 320, 480, 550, 620].map((x) => {
        const t = (x - 400) / 280
        const y = 322 + 278 * t * t
        return <line key={x} x1={x} y1="322" x2={x} y2={y} pathLength={1} strokeOpacity="0.35" />
      })}
      <line x1="120" y1="322" x2="120" y2="640" pathLength={1} strokeOpacity="0.8" />
      <line x1="680" y1="322" x2="680" y2="640" pathLength={1} strokeOpacity="0.8" />
      <path d="M40 640 C200 625 600 655 760 640" pathLength={1} strokeOpacity="0.3" />
    </g>
  )
}

const MAP: Record<Kind, () => React.JSX.Element> = {
  study: Study,
  engineering: Engineering,
  construction: Construction,
  landscape: Landscape,
  infrastructure: Infrastructure,
}

export default function ExpertiseVisual({ kind, active, className = '' }: { kind: Kind; active: boolean; className?: string }) {
  const Comp = MAP[kind]
  return (
    <svg viewBox="0 0 800 720" className={`draw ${active ? 'is-drawn opacity-100' : 'opacity-0'} ${className}`} aria-hidden preserveAspectRatio="xMidYMid meet">
      <Comp />
    </svg>
  )
}
