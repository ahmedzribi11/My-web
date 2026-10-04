/**
 * Hero : des particules convergent dans la brume et forment une structure.
 * Canvas 2D sans bibliothèque. L’animation dure environ 4 s puis s’arrête
 * (WCAG 2.2.2) ; ensuite seul le pointeur (souris) fait pivoter légèrement la vue.
 * Mouvement réduit : l’image finale est affichée directement.
 */
type V3 = [number, number, number]
type Seg = [V3, V3]

const DURATION = 4000

const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]')
const ctx = canvas?.getContext('2d')
if (canvas && ctx) start(canvas, ctx)

function start(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
  const nav = navigator as Navigator & { deviceMemory?: number }
  const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4

  /* Volumes : une tour, un immeuble, un socle ; une dalle tous les 0,5 */
  const boxes = [
    { x: -1.5, z: -0.3, w: 1.6, d: 1.6, h: 6.5 },
    { x: 0.7, z: -1.1, w: 2.2, d: 1.4, h: 4.5 },
    { x: -0.4, z: 1.4, w: 3.6, d: 1.2, h: 1.5 },
  ]
  const segs: Seg[] = []
  for (const b of boxes) {
    const x0 = b.x - b.w / 2
    const x1 = b.x + b.w / 2
    const z0 = b.z - b.d / 2
    const z1 = b.z + b.d / 2
    for (let y = 0; y <= b.h + 1e-6; y += 0.5) {
      segs.push([[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]], [[x1, y, z1], [x0, y, z1]], [[x0, y, z1], [x0, y, z0]])
    }
    const cols = Math.max(2, Math.round(b.w / 0.8))
    for (let i = 0; i <= cols; i++) {
      const x = x0 + (b.w * i) / cols
      segs.push([[x, 0, z0], [x, b.h, z0]], [[x, 0, z1], [x, b.h, z1]])
    }
    segs.push([[x0, 0, (z0 + z1) / 2], [x0, b.h, (z0 + z1) / 2]], [[x1, 0, (z0 + z1) / 2], [x1, b.h, (z0 + z1) / 2]])
  }

  /* Particules réparties le long des arêtes, départ dispersé dans la brume */
  const spacing = lowEnd ? 0.16 : 0.09
  const rnd = mulberry32(2016)
  const pts: { t: V3; s: V3; delay: number }[] = []
  for (const [a, b] of segs) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    const n = Math.max(1, Math.round(len / spacing))
    for (let i = 0; i <= n; i++) {
      const k = i / n
      const t: V3 = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
      const s: V3 = [(rnd() - 0.5) * 14, rnd() * 10 - 2, (rnd() - 0.5) * 14]
      pts.push({ t, s, delay: (t[1] / 6.5) * 0.3 + rnd() * 0.2 })
    }
  }

  let W = 0
  let H = 0
  let dpr = 1
  let yaw = -0.62
  let targetYaw = yaw
  let t0 = 0
  let done = reduced

  const resize = () => {
    const r = canvas.getBoundingClientRect()
    dpr = Math.min(devicePixelRatio || 1, lowEnd ? 1 : 1.5)
    W = r.width
    H = r.height
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const draw = (p: number) => {
    ctx.clearRect(0, 0, W, H)
    const wide = W >= 768
    const cx = wide ? W * 0.74 : W * 0.62
    const cy = wide ? H * 0.32 : H * 0.3
    const scale = (wide ? H * 0.54 : Math.min(H * 0.5, W * 1.1)) / 9
    const cos = Math.cos(yaw)
    const sin = Math.sin(yaw)
    const project = (v: V3): [number, number, number] => {
      const x = v[0] * cos - v[2] * sin
      const z = v[0] * sin + v[2] * cos + 11
      const f = (11 / z) * scale
      return [cx + x * f, cy - (v[1] - 3.2) * f, z]
    }

    // Arêtes : apparaissent une fois la structure formée
    const lineAlpha = clamp01((p - 0.62) / 0.3)
    if (lineAlpha > 0) {
      ctx.strokeStyle = `rgba(242,239,230,${0.22 * lineAlpha})`
      ctx.lineWidth = 0.7
      ctx.beginPath()
      for (const [a, b] of segs) {
        const pa = project(a)
        const pb = project(b)
        ctx.moveTo(pa[0], pa[1])
        ctx.lineTo(pb[0], pb[1])
      }
      ctx.stroke()
    }

    // Particules
    ctx.globalCompositeOperation = 'lighter'
    for (const pt of pts) {
      const k = easeInOut(clamp01((p - pt.delay) / 0.45))
      const v: V3 = [pt.s[0] + (pt.t[0] - pt.s[0]) * k, pt.s[1] + (pt.t[1] - pt.s[1]) * k, pt.s[2] + (pt.t[2] - pt.s[2]) * k]
      const [x, y, z] = project(v)
      const depth = clamp01((18 - z) / 10)
      const a = (0.18 + 0.62 * k) * (0.35 + 0.65 * depth)
      const size = (0.8 + 1.4 * depth) * (k > 0.98 ? 1 : 1.2)
      ctx.fillStyle = `rgba(232,222,159,${a.toFixed(3)})`
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  const frame = (now: number) => {
    if (!t0) t0 = now
    const p = Math.min(1, (now - t0) / DURATION)
    draw(p)
    if (p < 1) requestAnimationFrame(frame)
    else done = true
  }

  resize()
  canvas.classList.add('is-on')
  if (reduced) draw(1)
  else requestAnimationFrame(frame)

  addEventListener('resize', () => {
    resize()
    draw(done ? 1 : Math.min(1, (performance.now() - t0) / DURATION))
  })

  // Après l’animation : légère rotation qui suit la souris (mouvement déclenché par l’utilisateur)
  if (finePointer && !reduced) {
    let raf = 0
    const ease = () => {
      yaw += (targetYaw - yaw) * 0.12
      draw(1)
      raf = Math.abs(targetYaw - yaw) > 0.001 ? requestAnimationFrame(ease) : 0
    }
    canvas.closest('section')?.addEventListener('pointermove', (e) => {
      if (!done) return
      targetYaw = -0.62 + (e.clientX / innerWidth - 0.5) * 0.35
      if (!raf) raf = requestAnimationFrame(ease)
    })
  }
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
