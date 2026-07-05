import { useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Cursor       from './components/Cursor'
import GrainOverlay from './components/GrainOverlay'
import Loader       from './components/Loader'
import Portfolio    from './components/Portfolio'
import ScrollProgress from './components/ScrollProgress'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    // Expose lenis globally so components can pause/resume
    window.__lenis = lenis

    return () => {
      lenis.destroy()
      gsap.ticker.remove(ticker)
      delete window.__lenis
    }
  }, [])

  return (
    <>
      <Cursor />
      <GrainOverlay />
      <ScrollProgress />
      <Loader onComplete={() => setLoaderDone(true)} />
      <Portfolio loaderDone={loaderDone} />
    </>
  )
}
