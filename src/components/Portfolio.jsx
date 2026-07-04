import { lazy, Suspense, useLayoutEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Navbar   from './Navbar'
import Marquee  from './Marquee'
import Hero     from '../sections/Hero'
import About    from '../sections/About'
import Skills   from '../sections/Skills'
import Contact  from '../sections/Contact'

const Projects = lazy(() => import('../sections/Projects'))
const Terminal = lazy(() => import('../sections/Terminal'))

function Divider() {
  return <div style={{ width: '100%', height: 1, background: 'var(--border)', opacity: .5 }} />
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16,
      maxWidth: '100%', padding: '32px 48px',
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--ivory-mute)', letterSpacing: '.1em' }}>
        © 2025 Asal Fatima
      </span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--ivory-mute)', letterSpacing: '.06em', opacity: .45 }}>
        Full Stack Developer · Karachi, PK
      </span>
    </footer>
  )
}

export default function Portfolio({ loaderDone }) {
  // Global 3D card entrance: alternating rotateY(-25deg)/rotateY(25deg) + translateZ(-60px), flattening to identity
  useLayoutEffect(() => {
    if (!loaderDone) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-3d').forEach((el, i) => {
        // Ensure parent has perspective
        el.parentElement.style.perspective = '1200px'
        el.style.transformStyle = 'preserve-3d'
        gsap.fromTo(el,
          { opacity: 0, rotateY: i % 2 === 0 ? -25 : 25, z: -60, transformOrigin: 'center center' },
          {
            opacity: 1, rotateY: 0, z: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [loaderDone])

  return (
    <>
      <Navbar visible={loaderDone} />
      <main>
        <Hero loaderDone={loaderDone} />
        <Marquee />
        <Divider />
        <About />
        <Divider />
        <Skills />
        <Marquee reverse />
        <Divider />
        <Suspense fallback={null}>
          <Projects />
        </Suspense>
        <Divider />
        <Suspense fallback={null}>
          <Terminal />
        </Suspense>
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
