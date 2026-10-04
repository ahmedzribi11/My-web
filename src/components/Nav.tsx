import { useEffect, useRef, useState } from 'react'
import { NAV } from '../data/site'
import { lockScroll } from '../animations/smoothScroll'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    panel.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
      menuBtn.current?.focus()
    }
  }, [open])

  return (
    <header
      data-intro="nav"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-700 ${
        scrolled && !open ? 'border-b border-line bg-ink/55 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Navigation principale" className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" onClick={() => setOpen(false)} className="group relative z-10 flex items-baseline gap-3" aria-label="GCG — retour en haut de page">
          <img src="/brand/gcg-logo-white.png" alt="GCG — General Constructor Group CI" width={720} height={220} className="h-7 w-auto md:h-8" />
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="group relative text-[13px] tracking-[0.06em] text-bone/70 transition-colors duration-500 hover:text-bone">
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-bone transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={menuBtn}
          type="button"
          className="meta relative z-10 flex h-11 items-center gap-3 !text-bone md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Fermer' : 'Menu'}
          <span className="relative block h-2.5 w-5" aria-hidden>
            <span className={`absolute left-0 h-px w-full bg-bone transition-transform duration-500 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 h-px w-full bg-bone transition-transform duration-500 ${open ? 'top-1 -rotate-45' : 'top-2'}`} />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        ref={panel}
        className={`fixed inset-0 bg-ink transition-[opacity,visibility] duration-700 md:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        aria-hidden={!open}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-5">
          {NAV.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <a
                href={item.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-5 transition-transform duration-[900ms] ease-[var(--ease-out-expo)]"
                style={{ transform: open ? 'none' : 'translateY(100%)', transitionDelay: open ? `${120 + i * 70}ms` : '0ms' }}
              >
                <span className="display text-5xl">{item.label}</span>
                <span className="meta">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
