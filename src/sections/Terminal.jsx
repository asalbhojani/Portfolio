import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useSplitTumble } from '../hooks/useSplitTumble'

const RESPONSES = {
  'help': `  Available commands:

  asal --skills      View tech stack
  asal --projects    Browse portfolio
  asal --contact     Get in touch
  asal --about       Background & bio
  clear              Clear terminal`,

  'asal --skills': `
  ┌─ Frontend ──────────────────────────────────────────
  │  HTML5  CSS3  JavaScript  React  Next.js
  │  Tailwind  Angular  Bootstrap  jQuery
  └─────────────────────────────────────────────────────
  ┌─ Backend ───────────────────────────────────────────
  │  PHP  Laravel  Node.js  Express.js  Python  ASP.NET
  └─────────────────────────────────────────────────────
  ┌─ Mobile ────────────────────────────────────────────
  │  Flutter  Dart  Firebase  iOS  Android
  └─────────────────────────────────────────────────────
  ┌─ AI & Integrations ─────────────────────────────────
  │  OpenAI API  ElevenLabs  Agentic AI  Cloud AI
  └─────────────────────────────────────────────────────`,

  'asal --projects': `
  [01] Taxi Dispatch System      — Laravel · Maps API
  [02] Insuranest                — Laravel · REST API
  [03] Dryflandia                — Laravel · Stripe
  [04] Oil Mapping System        — Laravel · Google Maps
  [05] Antillean Properties      — WordPress · AI Chatbot
  [06] Sounds (WooCommerce)      — WordPress · Apple Pay
  [07] Pema Property             — WordPress · Multi-currency
  [08] Jarco AI Voice Bot        — OpenAI · ElevenLabs
  ...and 6 more. Visit #projects section.`,

  'asal --contact': `
  Email    →  asalfatima2005@gmail.com
  Phone    →  +92 335 9976976
  Location →  Numaish, Karachi, Pakistan
  LinkedIn →  linkedin.com/in/asal-fatima-6079a3236
  Fiverr   →  fiverr.com/asal_bhojani

  Status   →  ✓ Available for hire (full-time & freelance)`,

  'asal --about': `
  Name      : Asal Fatima
  Title     : Full Stack Developer
  Education : Aptech Computer Education (Diploma)
             Virtual University of Pakistan (BSc IT)
             Governor Sindh Initiative (Cloud Gen AI)
  Currently : PHP Laravel & WordPress Developer @ QF Network
  Skills    : 20+ technologies across web, mobile & AI
  Projects  : 15+ real-world client projects`,

  'clear': '__CLEAR__',
}

const AUTO_SEQUENCE = ['help', 'asal --skills', 'asal --contact']

export default function Terminal() {
  const sectionRef  = useRef(null)
  const titleRef    = useRef(null)
  const bodyRef     = useRef(null)
  const inputRef    = useRef(null)
  useSplitTumble(titleRef)
  const [lines, setLines]   = useState([])
  const [input, setInput]   = useState('')
  const [ready, setReady]   = useState(false)
  const autoIdx = useRef(0)
  const autoTimer = useRef(null)

  // Scroll terminal body to bottom
  const scrollBot = () => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }

  const addLine = (type, text) => {
    setLines(prev => [...prev, { type, text, id: Date.now() + Math.random() }])
  }

  const runCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    addLine('cmd', cmd)
    if (!trimmed) return

    const key = Object.keys(RESPONSES).find(k => k === trimmed)
    if (key) {
      const res = RESPONSES[key]
      if (res === '__CLEAR__') { setLines([]); return }
      addLine('out', res)
    } else {
      addLine('err', `command not found: ${trimmed}. Type 'help' for available commands.`)
    }
  }

  // Auto-type sequence on scroll in
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          setReady(true)
          // Slight delay then start auto sequence
          setTimeout(() => runAutoSeq(), 600)
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, []) // eslint-disable-line

  const typeCommand = (cmd, cb) => {
    let i = 0
    const t = setInterval(() => {
      i++
      setInput(cmd.slice(0, i))
      if (i >= cmd.length) {
        clearInterval(t)
        setTimeout(() => {
          setInput('')
          runCommand(cmd)
          cb && cb()
        }, 400)
      }
    }, 55)
  }

  const runAutoSeq = () => {
    if (autoIdx.current >= AUTO_SEQUENCE.length) return
    const cmd = AUTO_SEQUENCE[autoIdx.current]
    autoIdx.current++
    typeCommand(cmd, () => {
      autoTimer.current = setTimeout(runAutoSeq, 1200)
    })
  }

  useEffect(() => { scrollBot() }, [lines])
  useEffect(() => () => clearTimeout(autoTimer.current), [])

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      const val = input
      setInput('')
      runCommand(val)
    }
  }

  return (
    <section id="terminal" className="section" ref={sectionRef}
      style={{ background: 'var(--bg-1)' }}>
      <div className="s-inner">
        <span className="s-label">CLI</span>
        <h2 className="s-title" ref={titleRef}>Interactive <em>Terminal</em></h2>
        <p className="s-sub">Type commands to explore — or watch the demo.</p>

        <div className="terminal-card reveal-3d">
          {/* Title bar */}
          <div className="terminal-bar">
            <div className="t-dot" style={{ background: 'var(--mac-red)' }} />
            <div className="t-dot" style={{ background: 'var(--mac-yellow)' }} />
            <div className="t-dot" style={{ background: 'var(--mac-green)' }} />
            <span style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'color-mix(in srgb, var(--success) 50%, transparent)', letterSpacing: '.1em' }}>
              asal@portfolio ~ %
            </span>
          </div>

          {/* Body */}
          <div ref={bodyRef} className="terminal-body" onClick={() => inputRef.current?.focus()}>
            {/* Welcome */}
            {ready && (
              <div className="t-line" style={{ marginBottom: '12px' }}>
                <span className="t-out">
                  {`Asal Fatima — Full Stack Developer\nType 'help' to see available commands.\n`}
                </span>
              </div>
            )}

            {/* History */}
            {lines.map(l => (
              <div key={l.id} className="t-line">
                {l.type === 'cmd' && (
                  <span>
                    <span className="t-prompt">asal@portfolio</span>
                    <span style={{ color: 'color-mix(in srgb, var(--text-primary) 30%, transparent)' }}> % </span>
                    <span className="t-cmd">{l.text}</span>
                  </span>
                )}
                {l.type === 'out' && <span className="t-out">{l.text}</span>}
                {l.type === 'err' && <span className="t-err">{l.text}</span>}
              </div>
            ))}

            {/* Input line */}
            {ready && (
              <div className="t-input-row">
                <span className="t-prompt">asal@portfolio</span>
                <span style={{ color: 'color-mix(in srgb, var(--text-primary) 30%, transparent)', marginLeft: 4 }}>%</span>
                <input
                  ref={inputRef}
                  className="t-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder=""
                />
                {input === '' && <span className="t-cursor" />}
              </div>
            )}
          </div>
        </div>

        {/* Command hints */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.keys(RESPONSES).filter(k => k !== 'clear').map(k => (
            <button
              key={k}
              onClick={() => { setInput(''); runCommand(k); inputRef.current?.focus() }}
              style={{
                fontFamily: 'var(--mono)', fontSize: '.6rem', letterSpacing: '.1em',
                padding: '5px 12px', border: '1px solid var(--border)', color: 'var(--ivory-mute)',
                borderRadius: 2, transition: 'all .2s', cursor: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ivory-mute)' }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
