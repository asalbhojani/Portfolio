import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useSplitTumble } from '../hooks/useSplitTumble'
import { useTerminal, RESPONSES } from '../hooks/useTerminal'

function hintHoverIn(e) { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }
function hintHoverOut(e) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ivory-mute)' }

export default function TerminalDesktop() {
  const sectionRef  = useRef(null)
  const titleRef    = useRef(null)
  const bodyRef     = useRef(null)
  const inputRef    = useRef(null)
  useSplitTumble(titleRef)
  const { lines, input, setInput, ready, start, runCommand, onKeyDown } = useTerminal(bodyRef)

  // Auto-type sequence on scroll in
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        once: true,
        onEnter: start,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, []) // eslint-disable-line

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
              className="tactile-btn"
              aria-label={`Run command ${k}`}
              onClick={() => { setInput(''); runCommand(k); inputRef.current?.focus() }}
              style={{
                fontFamily: 'var(--mono)', fontSize: '.6rem', letterSpacing: '.1em',
                padding: '5px 12px', border: '1px solid var(--border)', color: 'var(--ivory-mute)',
                borderRadius: 2, cursor: 'none',
              }}
              onMouseEnter={hintHoverIn}
              onMouseLeave={hintHoverOut}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
