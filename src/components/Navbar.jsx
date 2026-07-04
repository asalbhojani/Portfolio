import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { rafThrottle } from '../utils/rafThrottle'

const LINKS = [
  { href: '#about',    label: 'About',    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { href: '#skills',   label: 'Skills',   icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { href: '#projects', label: 'Projects', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { href: '#contact',  label: 'Contact',  icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
]

export default function Navbar({ visible }) {
  const [scrolled, setScrolled]   = useState(false)
  const [activeHref, setActive]   = useState('')
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = rafThrottle(() => {
      setScrolled(window.scrollY > 40)
      // Active section tracking
      const sections = ['#contact', '#projects', '#skills', '#about', '#home']
      for (const id of sections) {
        const el = document.querySelector(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= 120) {
          setActive(id)
          break
        }
      }
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!visible || !navRef.current) return
    gsap.to(navRef.current, { opacity: 1, duration: .6, delay: .2, ease: 'power2.out' })
  }, [visible])

  return (
    <>
      {/* Desktop nav */}
      <nav ref={navRef} className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" style={{ color: 'var(--white)' }}>AFB</a>
          <ul className="nav-links">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} style={{ color: activeHref === l.href ? 'var(--gold)' : undefined }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="mailto:asalfatima2005@gmail.com" className="nav-cta">Hire Me</a>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            className={`mobile-nav-item${activeHref === l.href ? ' active' : ''}`}
          >
            {l.icon}
            <span>{l.label}</span>
          </a>
        ))}
      </nav>
    </>
  )
}
