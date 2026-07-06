import { useLayoutEffect, useRef, useState } from 'react'
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute,
  PointsMaterial, Points, IcosahedronGeometry, MeshBasicMaterial, Mesh,
  TorusKnotGeometry, MeshStandardMaterial, PointLight, AmbientLight, Clock,
} from 'three'
import { cssVarColor } from '../utils/cssColor'
import { rafThrottle } from '../utils/rafThrottle'
import { debounce } from '../utils/debounce'
import { canRenderWebGL } from '../utils/webgl'
import { useIsMobile } from '../hooks/useIsMobile'
import HeroCanvasMobile from './HeroCanvasMobile'

export default function HeroCanvas() {
  const canvasRef = useRef(null)
  const isMobile = useIsMobile()
  const [useFallback, setUseFallback] = useState(() => !canRenderWebGL())

  useLayoutEffect(() => {
    if (isMobile || useFallback) return
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch (err) {
      console.warn('HeroCanvas: WebGL init failed, using CSS fallback', err)
      setUseFallback(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    renderer.setClearColor(cssVarColor('--bg'), 0)

    const scene  = new Scene()
    const camera = new PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
    camera.position.set(0, 0, 7)

    const ACCENT   = cssVarColor('--accent')
    const ACCENT_2 = cssVarColor('--accent-2')
    const WHITE    = cssVarColor('--text-primary')

    // Gold particles
    const N = 340
    const pos = new Float32Array(N * 3)
    const vel = []
    for (let i = 0; i < N; i++) {
      const r = 8 + Math.random() * 9
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      pos[i*3]   = r * Math.sin(p) * Math.cos(t)
      pos[i*3+1] = r * Math.sin(p) * Math.sin(t)
      pos[i*3+2] = r * Math.cos(p)
      vel.push((Math.random() - .5) * .003, (Math.random() - .5) * .003, (Math.random() - .5) * .002)
    }
    const pGeo = new BufferGeometry()
    pGeo.setAttribute('position', new BufferAttribute(pos, 3))
    const pMat = new PointsMaterial({ color: ACCENT, size: .04, sizeAttenuation: true, transparent: true, opacity: .6 })
    scene.add(new Points(pGeo, pMat))

    // Wireframe icosahedron
    const iGeo = new IcosahedronGeometry(1.8, 1)
    const iMat = new MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: .15 })
    const ico  = new Mesh(iGeo, iMat)
    scene.add(ico)

    // Solid metallic torus knot — the hero centerpiece
    const tkGeo = new TorusKnotGeometry(1.35, 0.42, 220, 32, 2, 3)
    const tkMat = new MeshStandardMaterial({ color: ACCENT, roughness: .28, metalness: .85, envMapIntensity: 1 })
    const tKnot = new Mesh(tkGeo, tkMat)
    scene.add(tKnot)

    // Three-light rig: accent key, teal rim, warm white fill
    const keyLight = new PointLight(ACCENT, 12, 20)
    keyLight.position.set(3, 2, 4)
    scene.add(keyLight)

    const rimLight = new PointLight(ACCENT_2, 8, 20)
    rimLight.position.set(-4, -1, 3)
    scene.add(rimLight)

    const fillLight = new PointLight(WHITE, 3, 20)
    fillLight.position.set(0, 4, -3)
    scene.add(fillLight)

    scene.add(new AmbientLight(WHITE, 0.15))

    let tX = 0, tY = 0
    const onMouse = rafThrottle(e => {
      tX = (e.clientX / window.innerWidth  - .5) * 1.4
      tY = (e.clientY / window.innerHeight - .5) * 1.0
    })
    window.addEventListener('mousemove', onMouse)

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

      ico.rotation.x = t * .14; ico.rotation.y = t * .22; ico.rotation.z = t * .06
      tKnot.rotation.x = t * .08; tKnot.rotation.y = t * .12; tKnot.rotation.z = t * .04

      const p = pGeo.attributes.position.array
      for (let i = 0; i < N; i++) {
        p[i*3] += vel[i*3]; p[i*3+1] += vel[i*3+1]; p[i*3+2] += vel[i*3+2]
        const d = Math.sqrt(p[i*3]**2 + p[i*3+1]**2 + p[i*3+2]**2)
        if (d > 20) { p[i*3] *= .4; p[i*3+1] *= .4; p[i*3+2] *= .4 }
      }
      pGeo.attributes.position.needsUpdate = true

      camera.position.x += (tX * 1.6 - camera.position.x) * .032
      camera.position.y += (-tY * 1.2 - camera.position.y) * .032
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }

    // Only animate while the canvas is actually visible in the viewport
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (frame === null) animate()
      } else if (frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    }, { threshold: 0 })
    io.observe(canvas)

    return () => {
      io.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      onResize.cancel()
      renderer.dispose()
      pGeo.dispose(); pMat.dispose()
      iGeo.dispose(); iMat.dispose()
      tkGeo.dispose(); tkMat.dispose()
    }
  }, [isMobile, useFallback])

  if (useFallback) {
    return <div className="hero-canvas-fallback" aria-hidden="true" />
  }

  if (isMobile) {
    return <HeroCanvasMobile />
  }

  return <canvas ref={canvasRef} className="hero-canvas" />
}
