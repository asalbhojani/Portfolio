import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Splits a heading's text into characters and tumbles them in
// (y:80, rotateX:90deg, opacity:0 -> identity) as it scrolls into view.
export function useSplitTumble(ref, { start = 'top 82%' } = {}) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.perspective = '600px'
    const split = new SplitText(el, { type: 'chars' })

    const ctx = gsap.context(() => {
      gsap.fromTo(split.chars,
        { y: 80, rotateX: 90, opacity: 0, transformOrigin: '50% 100%' },
        {
          y: 0, rotateX: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out', stagger: 0.03,
          scrollTrigger: { trigger: el, start, once: true },
        }
      )
    }, el)

    return () => {
      ctx.revert()
      split.revert()
    }
  }, [ref, start])
}
