import { useEffect, useRef } from 'react'
import { rafThrottle } from '../utils/rafThrottle'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = rafThrottle(() => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0
      if (barRef.current) barRef.current.style.width = pct + '%'
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="scroll-progress" aria-hidden="true"><div ref={barRef} className="scroll-progress-bar" /></div>
}
