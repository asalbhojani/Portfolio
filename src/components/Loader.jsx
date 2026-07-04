import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { cssVarColor } from '../utils/cssColor'
import { debounce } from '../utils/debounce'

export default function Loader({ onComplete }) {
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)
  const countRef  = useRef(null)
  const flashRef  = useRef(null)

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'

    const W = window.innerWidth
    const H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: false })
    const ACCENT = cssVarColor('--accent')
    const BG_PURE = cssVarColor('--bg-pure')

    renderer.setPixelRatio(1)   // keep it light — it's just a loader
    renderer.setSize(W, H)
    renderer.setClearColor(BG_PURE, 1)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000)
    camera.position.z = 5

    // Icosahedron wireframe — detail 0 = 20 faces, plenty for a loader
    const geo = new THREE.IcosahedronGeometry(1.6, 0)
    const mat = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // Soft glow aura (backside sphere)
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 16, 16),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.05, side: THREE.BackSide })
    ))

    // Point light via sprite glow
    const pointLight = new THREE.PointLight(ACCENT, 2, 10)
    pointLight.position.set(2, 2, 3)
    scene.add(pointLight)
    scene.add(new THREE.AmbientLight(ACCENT, 0.1))

    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      mesh.rotation.x += 0.006
      mesh.rotation.y += 0.009
      mesh.rotation.z += 0.003
      renderer.render(scene, camera)
    }
    animate()

    // GSAP sequence: counter → scale-up → gold flash → cut
    const counter = { v: 0 }
    const tl = gsap.timeline({ delay: 0.3 })

    tl
      .to(counter, {
        v: 100,
        duration: 2.4,
        ease: 'power1.inOut',
        onUpdate() {
          if (countRef.current)
            countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0') + '%'
        },
      })
      .to(mesh.scale, { x: 80, y: 80, z: 80, duration: 0.55, ease: 'expo.in' }, '+=0.12')
      .to(flashRef.current, { opacity: 1, duration: 0.15, ease: 'none' }, '-=0.2')
      .to(wrapRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onStart() {
          // Stop blocking clicks as soon as we start fading out
          if (wrapRef.current) wrapRef.current.style.pointerEvents = 'none'
        },
        onComplete() {
          cancelAnimationFrame(raf)
          renderer.dispose()
          geo.dispose()
          mat.dispose()
          document.body.style.overflow = ''
          if (wrapRef.current) wrapRef.current.style.display = 'none'
          onComplete()
        },
      }, '+=0.05')

    const onResize = debounce(() => {
      const W = window.innerWidth, H = window.innerHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }, 150)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      onResize.cancel()
      cancelAnimationFrame(raf)
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={wrapRef} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg-pure)' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      <div
        ref={countRef}
        style={{
          position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--mono)', fontSize: '1rem', letterSpacing: '0.45em',
          color: 'color-mix(in srgb, var(--accent) 55%, transparent)', zIndex: 1, pointerEvents: 'none',
        }}
      >
        000%
      </div>
      <div
        ref={flashRef}
        style={{ position: 'absolute', inset: 0, background: 'var(--accent)', opacity: 0, zIndex: 2, pointerEvents: 'none' }}
      />
    </div>
  )
}
