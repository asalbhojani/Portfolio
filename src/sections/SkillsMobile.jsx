import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import WordStagger from '../components/mobile/WordStagger'
import { CATS } from '../data/skills'

const CARD_W = 140
const GAP = 14

function tint(color, pct) {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`
}

export default function SkillsMobile() {
  const viewportRef = useRef(null)
  const x = useMotionValue(0)
  const [dragLimit, setDragLimit] = useState(0)
  const [activeDot, setActiveDot] = useState(0)
  const [flipped, setFlipped] = useState(() => new Set())

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const totalWidth = CATS.length * CARD_W + (CATS.length - 1) * GAP
    setDragLimit(Math.min(0, el.offsetWidth - totalWidth))
  }, [])

  useEffect(() => {
    return x.on('change', v => {
      const idx = Math.round(-v / (CARD_W + GAP))
      setActiveDot(Math.max(0, Math.min(CATS.length - 1, idx)))
    })
  }, [x])

  const toggleFlip = (i) => {
    setFlipped(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <section id="skills" className="skills-mobile section">
      <div className="s-inner">
        <span className="s-label">Expertise</span>
        <WordStagger as="h2" className="s-title" text="What I Work With" />
        <p className="s-sub">Tap a card to flip — swipe to explore the full toolkit.</p>
      </div>

      <div className="skills-carousel-viewport" ref={viewportRef}>
        <motion.div
          className="skills-carousel-track"
          drag="x"
          dragConstraints={{ left: dragLimit, right: 0 }}
          dragElastic={0.08}
          style={{ x }}
        >
          {CATS.map((cat, i) => (
            <div key={cat.name} className="skill-card-3d">
              <motion.div
                className="skill-card-inner"
                animate={{ rotateY: flipped.has(i) ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0.2, 0.2, 1] }}
                onTap={() => toggleFlip(i)}
              >
                <div className="skill-card-face skill-card-front">
                  <div className="flip-icon" style={{ background: tint(cat.color, 8), border: `1px solid ${tint(cat.color, 16)}` }}>
                    <svg width="16" height="16" fill="none" stroke={cat.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flip-name" style={{ fontSize: '.95rem' }}>{cat.name}</div>
                    <div className="flip-count">{cat.count} skills</div>
                  </div>
                </div>
                <div className="skill-card-face skill-card-back">
                  <div className="flip-back-label">Skills</div>
                  <div className="flip-tags">
                    {cat.skills.map(s => (
                      <span key={s} className="flip-tag" style={{ borderColor: tint(cat.color, 13), color: cat.color }}>{s}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="skills-carousel-dots">
        {CATS.map((_, i) => (
          <span key={i} className={`skills-dot${i === activeDot ? ' active' : ''}`} />
        ))}
      </div>
    </section>
  )
}
