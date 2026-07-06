import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CanvasErrorBoundary from '../components/CanvasErrorBoundary'

const HeroCanvas = lazy(() => import('../components/HeroCanvas'))

const FIRST = 'ASAL'
const LAST  = 'FATIMA'

function SplitLine({ text, className }) {
  return (
    <span style={{ display: 'block' }}>
      {text.split('').map((c, i) => (
        <span key={i} className={`hero-letter ${className}`}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
}

const SOCIALS = [
  { href: 'https://github.com/asalbhojani', label: 'GH', name: 'GitHub', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg> },
  { href: 'https://www.linkedin.com/in/asal-fatima-6079a3236/', label: 'LI', name: 'LinkedIn', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { href: 'https://www.fiverr.com/asal_bhojani', label: 'FV', name: 'Fiverr', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 7.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM8 11.5V9.75A3.75 3.75 0 0 1 11.75 6H17v2.5h-2.5V9.75H17v2H14.5V18h-2.5v-6.25H8z"/></svg> },
  { href: 'mailto:asalfatima2005@gmail.com', label: 'EM', name: 'Email', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
]

function socialHoverIn(e) { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.background = 'var(--gold-glow)' }
function socialHoverOut(e) { e.currentTarget.style.color = 'var(--ivory-mute)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }

export default function HeroDesktop({ loaderDone }) {
  const eyebrowRef = useRef(null)
  const subRef     = useRef(null)
  const actRef     = useRef(null)
  const hintRef    = useRef(null)

  useLayoutEffect(() => {
    if (!loaderDone) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: .1 })

      // Name letters
      tl.fromTo('.hero-letter-first',
        { y: 130, opacity: 0, skewY: 10 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: .045, ease: 'power4.out' }
      )
      tl.fromTo('.hero-letter-last',
        { y: 130, opacity: 0, skewY: 10 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: .045, ease: 'power4.out' },
        '-=0.85'
      )

      // Supporting elements
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=0.4')
      tl.to(subRef.current,     { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=0.4')
      tl.to(actRef.current,     { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=0.35')
      tl.to(hintRef.current,    { opacity: 1, duration: .6, ease: 'power2.out' }, '-=0.2')
    })

    return () => ctx.revert()
  }, [loaderDone])

  return (
    <section id="home" className="hero">
      <CanvasErrorBoundary fallback={<div className="hero-canvas-fallback" aria-hidden="true" />}>
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </CanvasErrorBoundary>
      <div className="hero-vignette" />

      <div className="hero-inner">
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="hero-eyebrow"
          style={{ transform: 'translateY(12px)' }}
        >
          <span className="hero-eyebrow-dot" />
          Full Stack Developer — Karachi, Pakistan
        </div>

        {/* Giant name */}
        <div style={{ overflow: 'hidden', marginBottom: '4px' }}>
          <div className="hero-name">
            <SplitLine text={FIRST} className="hero-letter-first" />
          </div>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: '40px' }}>
          <div className="hero-name-gold">
            <SplitLine text={LAST} className="hero-letter-last" />
          </div>
        </div>

        {/* Subtitle */}
        <div
          ref={subRef}
          className="hero-sub-row"
          style={{ transform: 'translateY(10px)' }}
        >
          <span className="hero-subtitle">
            PHP · Laravel · WordPress · Flutter · MERN · AI
          </span>
          <span className="hero-separator" />
          <span className="hero-subtitle" style={{ opacity: .6 }}>
            2+ years · 15+ projects
          </span>
          <span className="hero-loc">
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            Karachi, PK
          </span>
        </div>

        {/* Actions */}
        <div
          ref={actRef}
          className="hero-actions"
          style={{ transform: 'translateY(10px)' }}
        >
          <a href="#projects" className="btn-g">
            View Work
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#contact" className="btn-o">Hire Me</a>
          <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
            {SOCIALS.map(s => (
              <a
                key={s.label} href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={s.name}
                style={{
                  width: 38, height: 38, border: '1px solid var(--border)',
                  borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ivory-mute)', transition: 'color .2s, border-color .2s, background .2s',
                }}
                onMouseEnter={socialHoverIn}
                onMouseLeave={socialHoverOut}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="hero-scroll-hint">
        <span className="hero-scroll-label">scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}
