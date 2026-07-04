import { useLayoutEffect, useRef } from 'react'
import { rafThrottle } from '../utils/rafThrottle'

const LERP = 0.18
const CLICK_DURATION = 140

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useLayoutEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.style.cursor = 'none'

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY

    // Dot follows the mouse, throttled to once per frame
    const onMove = rafThrottle((e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'
    })
    window.addEventListener('mousemove', onMove, { passive: true })

    // Ring follows with a lerped lag, driven by its own RAF loop
    let raf
    const tick = () => {
      ringX += (mouseX - ringX) * LERP
      ringY += (mouseY - ringY) * LERP
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Hover state on interactive elements, via delegated listeners
    const onOver = (e) => {
      if (e.target.closest('a, button')) ring.classList.add('cur-hover')
    }
    const onOut = (e) => {
      if (e.target.closest('a, button')) ring.classList.remove('cur-hover')
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    // Click feedback — brief scale down, then back
    let clickTimeout
    const onDown = () => {
      clearTimeout(clickTimeout)
      dot.classList.add('cur-click')
      ring.classList.add('cur-click')
    }
    const onUp = () => {
      clickTimeout = setTimeout(() => {
        dot.classList.remove('cur-click')
        ring.classList.remove('cur-click')
      }, CLICK_DURATION)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(clickTimeout)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.style.cursor = ''
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cur-ring" aria-hidden="true" />
      <div ref={dotRef}  className="cur-dot"  aria-hidden="true" />
    </>
  )
}
