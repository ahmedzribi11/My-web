/** Repli sans WebGL / mouvement réduit : brouillard CSS + structure tracée en SVG. */
export default function HeroFallback({ animate = true }: { animate?: boolean }) {
  const floors = Array.from({ length: 10 }, (_, i) => 560 - i * 44)
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden>
      <div className="css-fog">
        <span />
        <span />
        <span />
      </div>
      <svg
        viewBox="0 0 800 700"
        className={`draw absolute bottom-[8%] left-1/2 h-[78%] -translate-x-1/2 md:left-[62%] ${animate ? '' : 'is-drawn'}`}
        ref={(el) => {
          if (el && animate) requestAnimationFrame(() => el.classList.add('is-drawn'))
        }}
        fill="none"
        stroke="#f2efe9"
      >
        <line x1="40" y1="600" x2="760" y2="600" pathLength={1} strokeOpacity="0.4" />
        {floors.map((y, i) => (
          <rect key={y} x={250 + Math.sin(i * 0.75) * 18} y={y} width="300" height="6" pathLength={1} strokeOpacity={i < 6 ? 0.7 : 0.3} />
        ))}
        <rect x="270" y="110" width="50" height="490" pathLength={1} strokeOpacity="0.5" />
        {[280, 400, 520].map((x) => (
          <line key={x} x1={x} y1="600" x2={x} y2="164" pathLength={1} strokeOpacity="0.22" />
        ))}
      </svg>
    </div>
  )
}
