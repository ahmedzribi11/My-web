import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from './Particles'
import FogVolume from './FogVolume'
import { outroState } from '../animations/heroState'
import { TIER_CONFIG, type Tier } from '../lib/device'

/** Atmosphère de fin : brouillard et particules lentes, sans structure. */
export default function OutroScene({ tier, active }: { tier: Exclude<Tier, 'none'>; active: boolean }) {
  const cfg = TIER_CONFIG[tier]
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, Math.min(1.25, cfg.dpr[1])]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: false, stencil: false, depth: false }}
      camera={{ fov: 40, position: [0, 4, 18] }}
      onCreated={({ gl }) => {
        gl.setClearColor('#050505')
        gl.toneMapping = THREE.NoToneMapping
      }}
      aria-hidden
    >
      <Particles
        count={Math.floor(cfg.particles * 0.25)}
        volume={[16, 7, 4, 8]}
        size={0.9}
        read={() => ({ opacity: outroState.particles, form: 0, scatter: 0 })}
      />
      <FogVolume
        layers={Math.max(3, cfg.fogLayers - 2)}
        center={[0, 3.2, 0]}
        spread={8}
        read={() => ({ density: outroState.fog, scroll: 0, pointerX: outroState.pointerX, pointerY: outroState.pointerY })}
      />
    </Canvas>
  )
}
