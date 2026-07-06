import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

// Animated count-up, triggered once the element scrolls into view.
// Splits a value like "15+" into a numeric target (15) and suffix ("+").
export default function CountUp({ value, duration = 1.2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(0)

  const match = String(value).match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target, duration])

  return <span ref={ref}>{display}{suffix}</span>
}
