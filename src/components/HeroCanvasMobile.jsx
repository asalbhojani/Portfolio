import { useLayoutEffect, useRef } from 'react'
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute,
  PointsMaterial, Points, OctahedronGeometry, MeshBasicMaterial, Mesh, Clock,
} from 'three'
import { cssVarColor } from '../utils/cssColor'
import { debounce } from '../utils/debounce'

const PARTICLE_COUNT = 200

export default function HeroCanvasMobile() {
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch (err) {
      console.warn('HeroCanvasMobile: WebGL init failed', err)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    renderer.setClearColor(cssVarColor('--bg'), 0)

    const scene  = new Scene()
    const camera = new PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
    camera.position.set(0, 0, 7)

    const ACCENT = cssVarColor('--accent')

    // Lightweight particle field
    const N = PARTICLE_COUNT
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const r = 6 + Math.random() * 7
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      pos[i*3]   = r * Math.sin(p) * Math.cos(t)
      pos[i*3+1] = r * Math.sin(p) * Math.sin(t)
      pos[i*3+2] = r * Math.cos(p)
    }
    const pGeo = new BufferGeometry()
    pGeo.setAttribute('position', new BufferAttribute(pos, 3))
    const pMat = new PointsMaterial({ color: ACCENT, size: .05, sizeAttenuation: true, transparent: true, opacity: .5 })
    scene.add(new Points(pGeo, pMat))

    // Single wireframe centerpiece
    const oGeo = new OctahedronGeometry(1.2, 0)
    const oMat = new MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: .55 })
    const octa = new Mesh(oGeo, oMat)
    scene.add(octa)

    const onResize = debounce(() => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      camera.aspect = w / h; camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }, 150)
    window.addEventListener('resize', onResize)

    const clock = new Clock()
    let frame = null
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      octa.rotation.y = t * .18
      octa.rotation.x = t * .05
      renderer.render(scene, camera)
    }

    const startIfAllowed = () => {
      if (frame === null && !document.hidden) animate()
    }
    const stop = () => {
      if (frame !== null) { cancelAnimationFrame(frame); frame = null }
    }

    // Pause while the tab is hidden
    const onVisibility = () => { document.hidden ? stop() : startIfAllowed() }
    document.addEventListener('visibilitychange', onVisibility)

    // Pause while the canvas itself is scrolled offscreen
    const io = new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? startIfAllowed() : stop()
    }, { threshold: 0 })
    io.observe(canvas)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
      window.removeEventListener('resize', onResize)
      onResize.cancel()
      renderer.dispose()
      pGeo.dispose(); pMat.dispose()
      oGeo.dispose(); oMat.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas-mobile" />
}
