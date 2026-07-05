import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { debounce } from '../utils/debounce'
import { canRenderWebGL } from '../utils/webgl'

function getCssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export default function Loader({ onComplete }) {
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)
  const countRef  = useRef(null)
  const flashRef  = useRef(null)
  const orbRef    = useRef(null)

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'

    let cancelled = false
    let cleanupThree = () => {}

    // scaleTarget is a plain object the GSAP timeline scales up before the
    // flash-cut. The CSS orb reads it every frame via onUpdate; if the
    // (large, ~500kb) Three.js chunk finishes loading in time, the render
    // loop below also reads it to drive the real mesh — so we never have to
    // re-target the tween once it's built.
    const scaleTarget = { x: 1, y: 1, z: 1 }
    if (orbRef.current) orbRef.current.style.display = 'block'

    // Kick off the heavy Three.js import in the background — it must never
    // block the splash from painting immediately.
    if (canRenderWebGL()) {
      import('three').then(({
        WebGLRenderer, Color, Scene, PerspectiveCamera, IcosahedronGeometry,
        MeshBasicMaterial, Mesh, SphereGeometry, BackSide, PointLight, AmbientLight,
      }) => {
        if (cancelled || !canvasRef.current) return
        try {
          const W = window.innerWidth
          const H = window.innerHeight

          const renderer = new WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: false })
          const ACCENT = new Color(getCssVar('--accent', '#818CF8'))
          const BG_PURE = new Color(getCssVar('--bg-pure', '#000000'))

          renderer.setPixelRatio(1)   // keep it light — it's just a loader
          renderer.setSize(W, H)
          renderer.setClearColor(BG_PURE, 1)

          const scene  = new Scene()
          const camera = new PerspectiveCamera(55, W / H, 0.1, 1000)
          camera.position.z = 5

          // Icosahedron wireframe — detail 0 = 20 faces, plenty for a loader
          const geo = new IcosahedronGeometry(1.6, 0)
          const mat = new MeshBasicMaterial({ color: ACCENT, wireframe: true })
          const mesh = new Mesh(geo, mat)
          scene.add(mesh)

          // Soft glow aura (backside sphere)
          scene.add(new Mesh(
            new SphereGeometry(2.4, 16, 16),
            new MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.05, side: BackSide })
          ))

          // Point light via sprite glow
          const pointLight = new PointLight(ACCENT, 2, 10)
          pointLight.position.set(2, 2, 3)
          scene.add(pointLight)
          scene.add(new AmbientLight(ACCENT, 0.1))

          let raf
          const animate = () => {
            raf = requestAnimationFrame(animate)
            mesh.rotation.x += 0.006
            mesh.rotation.y += 0.009
            mesh.rotation.z += 0.003
            mesh.scale.setScalar(scaleTarget.x)
            renderer.render(scene, camera)
          }
          animate()

          const onResize = debounce(() => {
            const W = window.innerWidth, H = window.innerHeight
            camera.aspect = W / H
            camera.updateProjectionMatrix()
            renderer.setSize(W, H)
          }, 150)
          window.addEventListener('resize', onResize)

          // The real scene is drawing now — hide the CSS stand-in.
          if (orbRef.current) orbRef.current.style.display = 'none'

          cleanupThree = () => {
            window.removeEventListener('resize', onResize)
            onResize.cancel()
            cancelAnimationFrame(raf)
            renderer.dispose()
            geo.dispose()
            mat.dispose()
          }
        } catch (err) {
          console.warn('Loader: WebGL init failed, using CSS fallback', err)
        }
      })
    }

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
      .to(scaleTarget, {
        x: 80, y: 80, z: 80, duration: 0.55, ease: 'expo.in',
        onUpdate() {
          if (orbRef.current && orbRef.current.style.display === 'block') {
            orbRef.current.style.transform = `translate(-50%, -50%) scale(${scaleTarget.x})`
          }
        },
      }, '+=0.12')
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
          cleanupThree()
          document.body.style.overflow = ''
          if (wrapRef.current) wrapRef.current.style.display = 'none'
          onComplete()
        },
      }, '+=0.05')

    return () => {
      cancelled = true
      cleanupThree()
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={wrapRef} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg-pure)' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      <div
        ref={orbRef}
        aria-hidden="true"
        style={{
          display: 'none', position: 'absolute', top: '50%', left: '50%',
          width: 60, height: 60, borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          background: 'color-mix(in srgb, var(--accent) 60%, transparent)',
          boxShadow: '0 0 40px var(--accent)',
        }}
      />
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
