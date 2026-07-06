import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import WordStagger from '../components/mobile/WordStagger'
import { useTerminal, RESPONSES } from '../hooks/useTerminal'

export default function TerminalMobile() {
  const sectionRef = useRef(null)
  const bodyRef    = useRef(null)
  const inputRef   = useRef(null)
  const { lines, input, setInput, ready, start, runCommand, onKeyDown } = useTerminal(bodyRef)
  const inView = useInView(sectionRef, { once: true, amount: 0.4 })

  useEffect(() => { if (inView) start() }, [inView]) // eslint-disable-line

  // Keyboard pushes the terminal up — keep the input in view above it
  useEffect(() => {
    if (!window.visualViewport) return
    const onResize = () => {
      if (document.activeElement === inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
    window.visualViewport.addEventListener('resize', onResize)
    return () => window.visualViewport.removeEventListener('resize', onResize)
  }, [])

  return (
    <section id="terminal" className="terminal-mobile section" ref={sectionRef} style={{ background: 'var(--bg-1)' }}>
      <div className="terminal-mobile-inner">
        <span className="s-label">CLI</span>
        <WordStagger as="h2" className="s-title" text="Interactive Terminal" />
        <p className="s-sub">Type commands to explore — or watch the demo.</p>

        <div className="terminal-card terminal-card-mobile">
          <div className="terminal-bar">
            <div className="t-dot" style={{ background: 'var(--mac-red)' }} />
            <div className="t-dot" style={{ background: 'var(--mac-yellow)' }} />
            <div className="t-dot" style={{ background: 'var(--mac-green)' }} />
            <span style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'color-mix(in srgb, var(--success) 50%, transparent)', letterSpacing: '.08em' }}>
              asal@portfolio ~ %
            </span>
          </div>

          <div ref={bodyRef} className="terminal-body terminal-body-mobile" onClick={() => inputRef.current?.focus()}>
            {ready && (
              <div className="t-line" style={{ marginBottom: '10px' }}>
                <span className="t-out">
                  {`Asal Fatima — Full Stack Developer\nType 'help' to see available commands.\n`}
                </span>
              </div>
            )}

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
                  onFocus={() => setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder=""
                />
                {input === '' && <span className="t-cursor" />}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.keys(RESPONSES).filter(k => k !== 'clear').map(k => (
            <button
              key={k}
              className="tactile-btn terminal-hint-mobile"
              aria-label={`Run command ${k}`}
              onClick={() => { setInput(''); runCommand(k); inputRef.current?.focus() }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
