import { AnimatePresence, motion } from 'framer-motion'
import RevealMobile from '../components/mobile/RevealMobile'
import WordStagger from '../components/mobile/WordStagger'
import { useForm } from '../hooks/useForm'

const OWNER_EMAIL = 'asalfatima2005@gmail.com'

function onFocusScroll(e) {
  const el = e.target
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
}

function Checkmark() {
  return (
    <motion.svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <motion.path
        d="M20 6L9 17l-5-5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </motion.svg>
  )
}

export default function ContactMobile() {
  const { values, errors, status, handleChange, handleSubmit } = useForm()

  return (
    <section id="contact" className="contact-mobile section">
      <div className="s-inner">
        <span className="s-label">Contact</span>
        <WordStagger as="h2" className="s-title" text="Let's talk." />
        <p className="s-sub">Open to full-time positions, freelance projects, and collaborations worldwide.</p>

        <RevealMobile as="form" className="contact-mobile-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input className="form-input-mobile" type="text" name="name" placeholder="Your name" value={values.name} onChange={handleChange} onFocus={onFocusScroll} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input className="form-input-mobile" type="email" name="email" placeholder="your@email.com" value={values.email} onChange={handleChange} onFocus={onFocusScroll} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-field">
            <label className="form-label">Subject</label>
            <input className="form-input-mobile" type="text" name="subject" placeholder="What's this about?" value={values.subject} onChange={handleChange} onFocus={onFocusScroll} />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>
          <div className="form-field">
            <label className="form-label">Message</label>
            <textarea className="form-input-mobile form-textarea-mobile" name="message" rows={4} placeholder="Tell me about your project..." value={values.message} onChange={handleChange} onFocus={onFocusScroll} />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </div>

          <button type="submit" className="contact-mobile-submit" disabled={status === 'loading'}>
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.span key="ok" className="contact-mobile-submit-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Checkmark /> Sent!
                </motion.span>
              ) : (
                <motion.span key="txt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {status === 'error' && (
            <span className="form-error" style={{ textAlign: 'center' }}>
              Something went wrong. Please try me directly at {OWNER_EMAIL}
            </span>
          )}
        </RevealMobile>
      </div>
    </section>
  )
}
