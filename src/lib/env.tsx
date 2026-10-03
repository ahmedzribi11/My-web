import { createContext, useContext } from 'react'
import type { Tier } from './device'

export interface Env {
  tier: Tier
  reducedMotion: boolean
  touch: boolean
  mobile: boolean
}

export const EnvContext = createContext<Env>({ tier: 'none', reducedMotion: false, touch: false, mobile: false })
export const useEnv = () => useContext(EnvContext)
