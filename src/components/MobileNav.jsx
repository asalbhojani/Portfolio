import { useEffect, useState } from 'react'
import { Home, Briefcase, Layers, Mail } from 'lucide-react'

const ITEMS = [
  { id: 'home',     href: '#home',     label: 'Home',    Icon: Home },
  { id: 'projects', href: '#projects', label: 'Work',    Icon: Briefcase },
  { id: 'skills',   href: '#skills',   label: 'Skills',  Icon: Layers },
  { id: 'contact',  href: '#contact',  label: 'Contact', Icon: Mail },
]

export default function MobileNav() {
  const [active, setActive] = useState('home')

  // Active-section tracking — a thin band through the middle of the
  // viewport means exactly one section counts as "current" at a time.
  // Sections below Hero are behind lazy-loaded Suspense boundaries, so they
  // may not exist in the DOM yet on mount — retry via rAF until all 4 ids
  // resolve before wiring up the observer.
  useEffect(() => {
    let io = null
    let raf = null

    const trySetup = () => {
      const sections = ITEMS.map(i => document.getElementById(i.id)).filter(Boolean)
      if (sections.length < ITEMS.length) {
        raf = requestAnimationFrame(trySetup)
        return
      }
      io = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id)
          })
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      )
      sections.forEach(s => io.observe(s))
    }
    trySetup()

    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      io?.disconnect()
    }
  }, [])

  const goTo = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { duration: 1.2 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {ITEMS.map(({ id, href, label, Icon }) => {
        const isActive = active === id
        return (
          <a
            key={id}
            href={href}
            className={`mobile-nav-item${isActive ? ' active' : ''}`}
            onClick={e => goTo(e, id)}
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
          >
            {isActive && <span className="mobile-nav-dot" aria-hidden="true" />}
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.7} />
          </a>
        )
      })}
    </nav>
  )
}
