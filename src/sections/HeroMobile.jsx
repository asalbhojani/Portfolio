import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import CanvasErrorBoundary from '../components/CanvasErrorBoundary'
import { subscribeOrientation } from '../utils/deviceOrientation'

const HeroCanvas = lazy(() => import('../components/HeroCanvas'))

const SUBTITLE = 'PHP · Laravel · WordPress · Flutter · MERN · AI'

const nameContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const wordVariant = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function HeroMobile({ loaderDone }) {
  const layerX = useMotionValue(0)
  const layerY = useMotionValue(0)
  const [typed, setTyped] = useState('')

  // Gyroscope parallax — hero text layer drifts opposite the tilt direction
  useEffect(() => {
    return subscribeOrientation(({ x, y }) => {
      layerX.set(Math.max(-8, Math.min(8, -x * 8)))
      layerY.set(Math.max(-8, Math.min(8, -y * 8)))
    })
  }, [layerX, layerY])

  // Subtitle typewriter, starts once the loader finishes
  useEffect(() => {
    if (!loaderDone) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setTyped(SUBTITLE.slice(0, i))
      if (i >= SUBTITLE.length) clearInterval(timer)
    }, 35)
    return () => clearInterval(timer)
  }, [loaderDone])

  return (
    <section id="home" className="hero-mobile">
      <CanvasErrorBoundary fallback={<div className="hero-canvas-fallback" aria-hidden="true" />}>
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </CanvasErrorBoundary>
      <div className="hero-vignette" />

      {loaderDone && (
        <motion.div className="hero-mobile-layer" style={{ x: layerX, y: layerY }}>
          <div className="hero-mobile-eyebrow">
            <span className="hero-eyebrow-dot" />
            Full Stack Developer — Karachi, PK
          </div>

          <motion.h1
            className="hero-mobile-name"
            variants={nameContainer}
            initial="hidden"
            animate="show"
          >
            <motion.span className="hero-mobile-word" variants={wordVariant}>Asal</motion.span>{' '}
            <motion.span className="hero-mobile-word hero-mobile-word-accent" variants={wordVariant}>Fatima</motion.span>
          </motion.h1>

          <p className="hero-mobile-subtitle">
            {typed}
            <span className="hero-mobile-caret" aria-hidden="true" />
          </p>

          <div className="hero-mobile-actions">
            <a href="#projects" className="hero-mobile-btn hero-mobile-btn-primary">View Work</a>
            <a href="#contact" className="hero-mobile-btn hero-mobile-btn-secondary">Hire Me</a>
          </div>
        </motion.div>
      )}

      <div className="hero-mobile-scroll-hint" aria-hidden="true">
        <ChevronDown size={22} strokeWidth={2} />
      </div>
    </section>
  )
}
