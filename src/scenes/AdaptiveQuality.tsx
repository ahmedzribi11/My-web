import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

interface Props {
  dpr: number
  min: number
  max: number
  setDpr: (dpr: number) => void
  onFallback: () => void
}

const WINDOW = 1.5

/**
 * Surveille le framerate et ajuste la résolution de rendu.
 * Si les performances restent insuffisantes à résolution minimale,
 * bascule vers le repli CSS (onFallback).
 */
export default function AdaptiveQuality({ dpr, min, max, setDpr, onFallback }: Props) {
  const acc = useRef({ t: 0, frames: 0, bad: 0, warmup: 2 })
  useFrame((_, delta) => {
    const a = acc.current
    if (document.hidden || delta > 0.5) return
    if (a.warmup > 0) {
      a.warmup -= delta
      return
    }
    a.t += delta
    a.frames++
    if (a.t < WINDOW) return
    const fps = a.frames / a.t
    a.t = 0
    a.frames = 0
    if (fps < 45 && dpr > min) {
      setDpr(Math.max(min, dpr - 0.25))
    } else if (fps < 24 && dpr <= min) {
      if (++a.bad >= 3) onFallback()
    } else if (fps > 58 && dpr < max) {
      a.bad = 0
      setDpr(Math.min(max, dpr + 0.25))
    } else {
      a.bad = 0
    }
  })
  return null
}
