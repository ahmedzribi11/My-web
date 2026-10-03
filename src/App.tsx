import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { ScrollTrigger } from './animations/gsap'
import { initSmoothScroll, scrollToTarget } from './animations/smoothScroll'
import { detectTier, isTouch, prefersReducedMotion } from './lib/device'
import { EnvContext, type Env } from './lib/env'
import { ProjectRouter, useProjectRouter } from './lib/projectRouter'
import { getProject } from './data/projects'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import SavoirFaire from './sections/SavoirFaire'
import Expertise from './sections/Expertise'
import Projects from './sections/Projects'
import Process from './sections/Process'
import About from './sections/About'
import FinalCTA from './sections/FinalCTA'

const ProjectModal = lazy(() => import('./components/ProjectModal'))

function ProjectLayer() {
  const { openId, open, close } = useProjectRouter()
  const project = openId ? getProject(openId) : undefined
  if (!project) return null
  return (
    <Suspense fallback={null}>
      <ProjectModal project={project} onClose={close} onNavigate={(id) => open(id, true)} />
    </Suspense>
  )
}

export default function App() {
  const env = useMemo<Env>(() => {
    const reducedMotion = prefersReducedMotion()
    return { tier: detectTier(), reducedMotion, touch: isTouch(), mobile: window.innerWidth < 768 }
  }, [])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const destroy = initSmoothScroll(!env.reducedMotion && !env.touch)

    // Ancres internes : défilement fluide
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const hash = a.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      scrollToTarget(hash === '#top' ? 0 : (target as HTMLElement))
      try {
        history.replaceState(history.state, '', hash === '#top' ? window.location.pathname : hash)
      } catch {
        /* API History indisponible (iframe sandbox) */
      }
    }
    document.addEventListener('click', onClick)

    // Recalcul des déclencheurs une fois les polices chargées
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    setReady(true)

    return () => {
      destroy()
      document.removeEventListener('click', onClick)
    }
  }, [env])

  return (
    <EnvContext.Provider value={env}>
      <ProjectRouter>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
          Aller au contenu
        </a>
        <Nav />
        <main id="main" data-ready={ready}>
          <Hero />
          <SavoirFaire />
          <Expertise />
          <Projects />
          <Process />
          <About />
          <FinalCTA />
        </main>
        <Footer />
        <ProjectLayer />
        <Cursor enabled={!env.touch && !env.reducedMotion} />
        {!env.reducedMotion && <div className="grain" aria-hidden />}
      </ProjectRouter>
    </EnvContext.Provider>
  )
}
