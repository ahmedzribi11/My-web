import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { groundFragment, groundVertex } from './shaders'

export default function Ground({ read }: { read: () => number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: groundVertex,
        fragmentShader: groundFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uOpacity: { value: 0 } },
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])
  useFrame(() => {
    material.uniforms.uOpacity.value = read()
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.25} material={material}>
      <planeGeometry args={[60, 60]} />
    </mesh>
  )
}
