import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getProject } from '../data/projects'

/**
 * Routage minimal des fiches projet : URL propre /projets/<id>, sans dépendance.
 * L’hébergement doit rediriger les routes inconnues vers index.html (SPA fallback).
 */

const PREFIX = '/projets/'

interface Ctx {
  openId: string | null
  open: (id: string, replace?: boolean) => void
  close: () => void
}

const ProjectRouterContext = createContext<Ctx>({ openId: null, open: () => {}, close: () => {} })
export const useProjectRouter = () => useContext(ProjectRouterContext)

/** L’API History peut être refusée (iframe sandbox, aperçu local) : la fiche s’ouvre quand même. */
function safeHistory(fn: () => void) {
  try {
    fn()
  } catch {
    /* navigation sans URL dédiée */
  }
}

function idFromPath(): string | null {
  const path = window.location.pathname
  if (!path.startsWith(PREFIX)) return null
  const id = decodeURIComponent(path.slice(PREFIX.length).replace(/\/$/, ''))
  return getProject(id) ? id : null
}

export function ProjectRouter({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(() => (typeof window === 'undefined' ? null : idFromPath()))

  useEffect(() => {
    const onPop = () => setOpenId(idFromPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const p = openId ? getProject(openId) : null
    document.title = p ? `${p.name} — GCG | General Constructor Group` : 'GCG — General Constructor Group | Construction & Ingénierie'
  }, [openId])

  const open = useCallback((id: string, replace = false) => {
    if (window.location.pathname !== PREFIX + id) {
      safeHistory(() => {
        if (replace) window.history.replaceState({ ...window.history.state, project: id }, '', PREFIX + id)
        else window.history.pushState({ project: id }, '', PREFIX + id)
      })
    }
    setOpenId(id)
  }, [])

  const close = useCallback(() => {
    if (window.location.pathname.startsWith(PREFIX)) {
      if (window.history.state?.project) window.history.back()
      else safeHistory(() => window.history.replaceState(null, '', '/#projets'))
    }
    setOpenId(null)
  }, [])

  return <ProjectRouterContext.Provider value={{ openId, open, close }}>{children}</ProjectRouterContext.Provider>
}
