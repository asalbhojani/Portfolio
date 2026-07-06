import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useScramble } from '../hooks/useScramble'
import { useForm } from '../hooks/useForm'

const HEADLINE = "Let's talk."
const OWNER_EMAIL = 'asalfatima2005@gmail.com'

const CONTACT_ITEMS = [
  { label: 'Email',    value: 'asalfatima2005@gmail.com',          href: 'mailto:asalfatima2005@gmail.com' },
  { label: 'Phone',    value: '+92 335 9976976',                   href: 'tel:+923359976976' },
  { label: 'Location', value: 'Karachi, Pakistan',                 href: null },
  { label: 'LinkedIn', value: 'linkedin.com/in/asal-fatima',       href: 'https://www.linkedin.com/in/asal-fatima-6079a3236/' },
  { label: 'Fiverr',   value: 'fiverr.com/asal_bhojani',           href: 'https://www.fiverr.com/asal_bhojani' },
]

export default function ContactDesktop() {
  const sectionRef  = useRef(null)
  const headlineRef = useRef(null)
  const [headlineText, scrambleHeadline] = useScramble("Let's talk.")
  const { values, errors, status, handleChange, handleSubmit } = useForm()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scramble heading on scroll entry
      ScrollTrigger.create({
        trigger: headlineRef.current,
        start: 'top 82%',
        once: true,
        onEnter: scrambleHeadline,
      })

      gsap.fromTo('.char-inner',
        { y: 90, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: .035, duration: .9, ease: 'power4.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 82%',
          }
        }
      )

      gsap.fromTo('.contact-grid',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: .8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 85%',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [scrambleHeadline])

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="s-inner">
        <span className="s-label">Contact</span>

        {/* Giant split headline */}
        <div ref={headlineRef} className="contact-headline" aria-label={HEADLINE}>
          {headlineText.split('').map((ch, i) => (
            <span key={i} className="char">
              <span className="char-inner">{ch === ' ' ? ' ' : ch}</span>
            </span>
          ))}
        </div>

        <p className="contact-sub">
          Open to full-time positions, freelance projects, and collaborations worldwide.
        </p>

        {/* Grid: form + info */}
        <div className="contact-grid">

          {/* Form */}
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Name</label>
                <input className="form-input" type="text" name="name" placeholder="Your name" value={values.name} onChange={handleChange} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" placeholder="your@email.com" value={values.email} onChange={handleChange} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Subject</label>
              <input className="form-input" type="text" name="subject" placeholder="What's this about?" value={values.subject} onChange={handleChange} />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Message</label>
              <textarea className="form-input form-textarea" name="message" rows={5} placeholder="Tell me about your project..." value={values.message} onChange={handleChange} />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button type="submit" className="form-submit" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    <span className="form-spinner" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
              {status === 'success' && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'var(--success)', letterSpacing: '.08em' }}>
                  ✓ Message sent! I'll get back to you soon.
                </span>
              )}
              {status === 'error' && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'var(--error)', letterSpacing: '.08em' }}>
                  Something went wrong. Please try me directly at {OWNER_EMAIL}
                </span>
              )}
            </div>
          </form>

          {/* Contact info */}
          <div className="contact-info">
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--gold)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 16 }}>
                Direct
              </div>
              {CONTACT_ITEMS.map(item => (
                <div key={item.label} className="contact-item">
                  <span className="contact-item-label">{item.label}</span>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="contact-item-value contact-item-link">
                      {item.value}
                    </a>
                  ) : (
                    <span className="contact-item-value">{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="contact-avail">
              <div className="contact-avail-dot" />
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', color: 'var(--ivory)', letterSpacing: '.06em' }}>Available for hire</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--ivory-mute)', marginTop: 2 }}>Full-time · Freelance · Remote</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
