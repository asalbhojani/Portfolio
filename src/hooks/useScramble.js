import { useState, useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&01234'

export function useScramble(text, speed = 42) {
  const [display, setDisplay] = useState(text)
  const timer = useRef(null)

  const scramble = useCallback(() => {
    clearTimeout(timer.current)
    let step = 0
    const tick = () => {
      let out = ''
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') { out += ' '; continue }
        out += i < step ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
      }
      setDisplay(out)
      if (step <= text.length) {
        step++
        timer.current = setTimeout(tick, speed)
      }
    }
    tick()
    return () => clearTimeout(timer.current)
  }, [text, speed])

  return [display, scramble]
}
