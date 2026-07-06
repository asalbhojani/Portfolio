import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import avatar from '../assets/images/avatar.png'
import { useScramble } from '../hooks/useScramble'
import { useSplitTumble } from '../hooks/useSplitTumble'
import { rafThrottle } from '../utils/rafThrottle'

const SKILL_CATS = [
  { cat: 'Frontend',    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Next.js', 'Tailwind', 'Angular'] },
  { cat: 'Backend',     skills: ['PHP', 'Laravel', 'Node.js', 'Express', 'Python', 'REST APIs'] },
  { cat: 'Mobile',      skills: ['Flutter', 'Dart', 'Firebase', 'iOS', 'Android'] },
  { cat: 'Database',    skills: ['MySQL', 'MongoDB', 'Firebase', 'SQL Server'] },
  { cat: 'CMS & Tools', skills: ['WordPress', 'WooCommerce', 'Git', 'Stripe'] },
  { cat: 'AI',          skills: ['OpenAI API', 'ElevenLabs', 'Agentic AI', 'Cloud AI'] },
]

export const STATS = [
  { num: '2+',  label: 'Years Coding'   },
  { num: '15+', label: 'Projects Built' },
  { num: '3',   label: 'Employers'      },
]

export default function AboutDesktop() {
  const rightRef = useRef(null)
  const cardRef  = useRef(null)
  const nameRef  = useRef(null)
  const [roleText, scrambleRole] = useScramble('Full Stack Developer')
  useSplitTumble(nameRef, { start: 'top 90%' })

  // 3D depth entrance for right-panel blocks
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      rightRef.current.style.perspective = '1100px'
      const blocks = rightRef.current?.querySelectorAll('.about-block')
      blocks?.forEach(block => {
        gsap.fromTo(block,
          { opacity: 0, rotateX: 14, z: -70, transformOrigin: 'center top' },
          {
            opacity: 1, rotateX: 0, z: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 84%' },
          }
        )
      })

      // Scramble name + role on entry
      ScrollTrigger.create({
        trigger: rightRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => { scrambleRole() },
      })
    }, rightRef)
    return () => ctx.revert()
  }, [scrambleRole])

  // 3D card tilt on mousemove, throttled to once per frame
  const onCardMove = rafThrottle(e => {
    const el  = cardRef.current
    if (!el) return
    const r   = el.getBoundingClientRect()
    const x   = (e.clientX - r.left) / r.width  - .5
    const y   = (e.clientY - r.top)  / r.height - .5
    el.style.transform = `perspective(1200px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`
  })
  const onCardLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <section id="about" className="about-section">
      {/* ── LEFT: sticky column ── */}
      <div className="about-left">
        <div>
          <span className="s-label">About</span>
          <h2 className="about-name" ref={nameRef}>Asal<br/><em>Fatima</em></h2>
          <div className="about-role">{roleText}</div>
          <div className="about-gold-rule" />
          <p style={{ fontFamily: 'var(--mono)', fontSize: '.78rem', color: 'var(--ivory-mute)', lineHeight: 1.7, maxWidth: '340px' }}>
            Self-driven engineer building web apps, mobile products, and AI integrations. Based in Karachi, open to remote work.
          </p>

          <div className="about-left-stats">
            {STATS.map(s => (
              <div key={s.label} className="about-stat-item">
                <div className="about-stat-num">{s.num}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: scrolling content ── */}
      <div ref={rightRef} className="about-right">

        {/* Bio */}
        <div className="about-block">
          <span className="s-label">Background</span>
          <p className="about-p">
            Self-driven Software Engineer with a diploma from{' '}
            <strong>Aptech Computer Education</strong> and professional experience as a PHP/Laravel &amp; WordPress developer at{' '}
            <strong>QF Network</strong> and <strong>Stallyons Technologies</strong>.
          </p>
          <p className="about-p">
            Comfortable working across the full stack — pixel-perfect frontends, robust Laravel APIs, complex WordPress customisations, and Flutter mobile apps shipped to both stores.
          </p>
          <p className="about-p">
            Currently pursuing a BSc IT at <strong>Virtual University of Pakistan</strong> and completing a Cloud Applied Generative AI program at the <strong>Governor Sindh Initiative</strong>.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              '▸ Currently at QF Network — PHP Laravel & WordPress',
              '▸ BSc IT — Virtual University of Pakistan (2026–2030)',
              '▸ Cloud Applied Gen AI — Governor Sindh Initiative',
              '▸ Based in Karachi — open to remote worldwide',
            ].map(t => (
              <div key={t} style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', color: 'var(--ivory-mute)', display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--gold)', flexShrink: 0 }}>{t.slice(0,1)}</span>
                <span>{t.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="about-block">
          <span className="s-label">Toolkit</span>
          <h3 className="about-block-title">What I build with</h3>
          <div className="about-skill-cats">
            {SKILL_CATS.map(({ cat, skills }) => (
              <div key={cat} className="about-skill-row">
                <div className="about-skill-cat">{cat}</div>
                <div className="about-skill-tags">
                  {skills.map(s => <span key={s} className="about-skill-tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D floating card */}
        <div className="about-block">
          <span className="s-label">Currently</span>
          <div
            className="float-card-scene"
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
          >
            <div
              ref={cardRef}
              className="float-card"
              style={{ transformStyle: 'preserve-3d', transition: 'transform .35s ease' }}
            >
              <div className="float-card-layer1" />
              <div className="float-card-layer2" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <img
                    src={avatar}
                    alt="Asal Fatima"
                    loading="lazy"
                    width={56}
                    height={56}
                    style={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover', objectPosition: 'top', border: '1px solid var(--border-2)', flexShrink: 0 }}
                  />
                  <div>
                    <div className="float-card-title">Asal Fatima</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--ivory-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      Available for hire
                    </div>
                  </div>
                </div>
                <p className="float-card-sub">
                  Open to full-time positions and freelance projects worldwide.
                  Laravel · WordPress · Flutter · MERN · AI integrations.
                </p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a href="mailto:asalfatima2005@gmail.com" className="btn-g" style={{ fontSize: '.62rem', padding: '8px 18px' }}>
                    Send Email
                  </a>
                  <a href="https://wa.me/923359976976" target="_blank" rel="noopener noreferrer" className="btn-o" style={{ fontSize: '.62rem', padding: '8px 18px' }}>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
