import { memo, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useScramble } from '../hooks/useScramble'
import { rafThrottle } from '../utils/rafThrottle'
import { isLowEndDevice } from '../utils/webgl'

const SKIP_TILT = isLowEndDevice() || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

const PROJECTS = [
  {
    id: '01', title: 'Taxi Dispatch System',  cat: 'Laravel',
    tags: ['Laravel', 'MySQL', 'Maps API', 'Real-time', 'Cron Jobs'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Two-sided taxi management platform with real-time dispatching, auto-assignment algorithms, and MedAnswering integration.',
  },
  {
    id: '02', title: 'Insuranest',             cat: 'Laravel',
    tags: ['Laravel', 'MySQL', 'REST API', 'Push Notifications', 'Multi-role'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'Full-featured insurance administration dashboard with policy lifecycle management, claims processing, and mobile API.',
  },
  {
    id: '03', title: 'Dryflandia',             cat: 'Laravel',
    tags: ['Laravel', 'Stripe', 'PayPal', 'Multilingual', 'Subscriptions'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Multilingual game management platform with subscription billing, dual payment gateways, and regional pricing.',
  },
  {
    id: '04', title: 'Antillean Properties',   cat: 'WordPress',
    tags: ['WordPress', 'Multilingual', 'AI Chatbot', 'Booking', 'Filters'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'Caribbean real estate site with advanced property search, appointment booking, and 24/7 AI chatbot in three languages.',
  },
  {
    id: '05', title: 'Sounds (WooCommerce)',   cat: 'WordPress',
    tags: ['WordPress', 'WooCommerce', 'Stripe', 'Apple Pay', '3 Admin Roles'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Motorcycle audio products store with advanced SKU filtering, bundled packages, and four payment methods.',
  },
  {
    id: '06', title: 'Jarco — AI Voice Bot',   cat: 'AI',
    tags: ['OpenAI', 'ElevenLabs', 'Voice AI', 'Video Analysis', 'PHP'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'AI voice assistant for The Sales Coach Academy — responds in natural human voice and analyses video sales roleplays.',
    link: 'https://academy.thesalescoach.eu/',
  },
  {
    id: '07', title: 'Oil Mapping System',     cat: 'Laravel',
    tags: ['Laravel', 'Google Maps', 'Radius Filter', 'Virtual Tours'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Location-based web app for the oil industry with interactive map pins, proximity filtering, and virtual tours.',
  },
  {
    id: '08', title: 'Pema Property',          cat: 'WordPress',
    tags: ['WordPress', 'Multi-currency', 'Agent Portal', 'Interactive Maps'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'Thai real estate site with agent dashboards, multi-currency conversion, and interactive project maps.',
  },
]

const ThumbVisual = memo(function ThumbVisual({ thumb, id }) {
  const bg = `linear-gradient(135deg, var(--bg) 0%, var(--bg-card) 100%)`
  return (
    <div style={{ width: '100%', height: '100%', background: bg, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: .05, backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <span style={{ fontFamily: 'var(--serif)', fontSize: '6rem', fontWeight: 800, color: `color-mix(in srgb, ${thumb.accent} 18%, transparent)`, lineHeight: 1, userSelect: 'none' }}>{id}</span>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 50%, color-mix(in srgb, ${thumb.accent} 15%, transparent), transparent 60%)` }} />
    </div>
  )
})

const PanelMockup = memo(function PanelMockup({ thumb, id }) {
  const ref = useRef(null)
  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]),  { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 150, damping: 20 })

  const onMouseMove = rafThrottle((e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width  - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  })
  const onMouseLeave = () => { mx.set(0); my.set(0) }

  // Low-end devices / reduced-motion: skip the spring-driven tilt entirely,
  // render a static panel instead of wiring up mousemove listeners.
  if (SKIP_TILT) {
    return (
      <div ref={ref} className="panel-mockup">
        <ThumbVisual thumb={thumb} id={id} />
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className="panel-mockup"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
    >
      <ThumbVisual thumb={thumb} id={id} />
    </motion.div>
  )
})

export default function Projects() {
  const wrapRef  = useRef(null)
  const trackRef = useRef(null)
  const counterRef = useRef(null)
  const activeIdxRef = useRef(0)
  const [titleText, scrambleTitle] = useScramble("Things I've Built")

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768
      if (isMobile) {
        // Mobile: simple scroll reveal, no horizontal pin
        gsap.utils.toArray('.project-panel').forEach((panel, i) => {
          gsap.fromTo(panel,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: panel, start: 'top 88%' } }
          )
        })
        return
      }

      const panels   = gsap.utils.toArray('.project-panel')
      const winW     = window.innerWidth
      const moveX    = -(panels.length - 1) * winW

      const horizontalTween = gsap.to(trackRef.current, {
        x: moveX,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${Math.abs(moveX)}`,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (panels.length - 1))
            if (idx !== activeIdxRef.current) {
              activeIdxRef.current = idx
              if (counterRef.current) counterRef.current.textContent = String(idx + 1).padStart(2, '0')
            }
          },
        },
      })

      // Per-panel: mockup tilts in from alternating sides + title rises
      panels.forEach((panel, i) => {
        const mockup = panel.querySelector('.panel-mockup')
        const title  = panel.querySelector('.panel-title')
        const info   = panel.querySelector('.panel-info')

        if (mockup) {
          gsap.fromTo(mockup,
            { clipPath: i % 2 === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0% 0 0)', ease: 'power3.out',
              scrollTrigger: { trigger: panel, containerAnimation: horizontalTween, start: 'left 88%', end: 'left 20%', scrub: 1 } }
          )
        }
        if (title) {
          gsap.fromTo(title,
            { y: 70, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out',
              scrollTrigger: { trigger: panel, containerAnimation: horizontalTween, start: 'left 80%', end: 'left 35%', scrub: 1 } }
          )
        }
        if (info) {
          gsap.fromTo(info,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out',
              scrollTrigger: { trigger: panel, containerAnimation: horizontalTween, start: 'left 70%', end: 'left 25%', scrub: 1 } }
          )
        }
      })

      // Scramble heading when section enters
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top 80%',
        once: true,
        onEnter: scrambleTitle,
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [scrambleTitle])

  return (
    <section id="projects" style={{ background: 'var(--bg)' }}>
      {/* Pinned viewport */}
      <div ref={wrapRef} className="projects-h-wrap">

        {/* Fixed overlay header (stays while track scrolls) */}
        <div className="projects-h-header">
          <div>
            <span className="s-label">Portfolio</span>
            <h2 className="s-title" style={{ marginBottom: 0 }}>
              {titleText}
            </h2>
          </div>
          <span className="proj-counter">
            <span ref={counterRef}>01</span> / {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Horizontal track */}
        <div ref={trackRef} className="projects-h-track">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className="project-panel">
              {/* Giant bg number */}
              <div className="panel-bg-num">{p.id}</div>

              <div className="panel-inner">
                {/* Left: text */}
                <div className="panel-left">
                  <span className="s-label">{p.cat}</span>
                  <h3 className="panel-title">{p.title}</h3>
                  <div className="panel-info">
                    <p className="panel-desc">{p.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '20px 0 24px' }}>
                      {p.tags.map(t => (
                        <span key={t} style={{
                          fontFamily: 'var(--mono)', fontSize: '.58rem', padding: '3px 8px',
                          border: '1px solid var(--border)', color: 'var(--ivory-mute)', borderRadius: 1,
                          letterSpacing: '.08em',
                        }}>{t}</span>
                      ))}
                    </div>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-o"
                        style={{ fontSize: '.62rem', padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        Visit Live →
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: 3D mockup */}
                <div className="panel-right">
                  <PanelMockup thumb={p.thumb} id={p.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="projects-scroll-hint">
          <span>scroll</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
