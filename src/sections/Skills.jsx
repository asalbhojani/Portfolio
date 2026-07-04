import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useScramble } from '../hooks/useScramble'

const CATS = [
  { name: 'Frontend',    count: 9, color: 'var(--accent)',   skills: ['HTML5','CSS3','JavaScript','Bootstrap','Tailwind CSS','jQuery','Angular TS','Next.js','React'] },
  { name: 'Backend',     count: 7, color: 'var(--accent-2)', skills: ['PHP','Laravel','Node.js','Express.js','ASP.NET Core','Python','REST APIs'] },
  { name: 'Mobile',      count: 5, color: 'var(--accent)',   skills: ['Flutter','Dart','Firebase','iOS','Android'] },
  { name: 'Database',    count: 4, color: 'var(--accent-2)', skills: ['MySQL','MongoDB','Firebase','SQL Server'] },
  { name: 'CMS & Tools', count: 4, color: 'var(--accent)',   skills: ['WordPress','WooCommerce','Git','Microsoft Office'] },
  { name: 'AI',          count: 4, color: 'var(--accent-2)', skills: ['Agentic AI','OpenAI API','Cloud AI','Generative AI'] },
]

function tint(color, pct) {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`
}

function IconFront({ color }) {
  return (
    <svg width="18" height="18" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)
  const [title, scrambleTitle] = useScramble('What I Work With')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.flip-wrap')
      const cols  = 3

      // Fan-out deck: cards start rotated/stacked, spread into grid on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 55%',
          scrub: 1.8,
        },
      })

      cards.forEach((card, i) => {
        const col    = i % cols
        const spread = (col - 1) * 18   // -18, 0, +18 deg fan angle (Z only)
        const startY = 90 + i * 10

        tl.fromTo(
          card,
          { y: startY, rotateZ: spread, opacity: 0, scale: 0.84 },
          { y: 0,       rotateZ: 0,     opacity: 1, scale: 1,
            ease: 'power2.out', duration: 1 },
          i * 0.07
        )
      })

      // Clear all GSAP inline transforms when section is fully past so CSS :hover works
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'bottom 40%',
        once: true,
        onEnter: () => cards.forEach(c => gsap.set(c, { clearProps: 'all' })),
      })

      // Scramble heading on enter
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: scrambleTitle,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [scrambleTitle])

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="s-inner" style={{ perspective: '1200px' }}>
        <span className="s-label">Expertise</span>
        <h2 className="s-title">{title}</h2>
        <p className="s-sub">Hover any card to reveal the full toolkit — built across web, mobile, and AI.</p>

        <div className="skills-grid" style={{ perspective: '1200px' }}>
          {CATS.map(cat => (
            <div key={cat.name} className="flip-wrap">
              <div className="flip-inner">
                <div className="flip-front">
                  <div className="flip-icon" style={{ background: tint(cat.color, 8), border: `1px solid ${tint(cat.color, 16)}` }}>
                    <IconFront color={cat.color} />
                  </div>
                  <div>
                    <div className="flip-name">{cat.name}</div>
                    <div className="flip-count">{cat.count} skills</div>
                  </div>
                  <div style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />
                </div>

                <div className="flip-back">
                  <div className="flip-back-label">Skills</div>
                  <div className="flip-tags">
                    {cat.skills.map(s => (
                      <span key={s} className="flip-tag" style={{ borderColor: tint(cat.color, 13), color: cat.color }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
