import { NAV, site } from '../data/site'

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 pb-10 pt-16 md:px-10">
      <div className="mx-auto grid max-w-[1800px] gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="text-[15px] font-medium tracking-[0.28em]">{site.short}</p>
          <p className="meta mt-3">{site.name}</p>
        </div>
        <nav aria-label="Navigation de pied de page" className="md:col-span-3 md:col-start-10">
          <ul className="grid grid-cols-2 gap-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-[14px] text-bone/60 transition-colors hover:text-bone">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1800px] flex-col justify-between gap-3 md:flex-row">
        <p className="meta">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="meta">Construction & Ingénierie — depuis {site.since}</p>
      </div>
    </footer>
  )
}
