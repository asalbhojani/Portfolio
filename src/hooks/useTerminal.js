import { useEffect, useRef, useState } from 'react'

export const RESPONSES = {
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

// Shared terminal command engine — used by both TerminalDesktop and
// TerminalMobile so the command set / typing behavior never drifts apart.
// The caller decides *when* to kick things off (GSAP ScrollTrigger on
// desktop, IntersectionObserver/whileInView on mobile) via `start()`.
export function useTerminal(bodyRef) {
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [ready, setReady] = useState(false)
  const autoIdx = useRef(0)
  const autoTimer = useRef(null)

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

  const start = () => {
    setReady(true)
    setTimeout(() => runAutoSeq(), 600)
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

  return { lines, input, setInput, ready, start, runCommand, onKeyDown }
}
