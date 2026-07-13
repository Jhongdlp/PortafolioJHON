'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'

const NAME = 'JHONGDLP'

// El telón es un punto más hondo que el fondo de la web, para que el Hero
// "abra" al levantarse en vez de aparecer sin más. Ver globals.css.
const BG = 'var(--bg-deep)'
const INK = 'var(--ink-soft)'

// Rhythm of the typing timeline (ms). Kept a touch irregular so it reads
// like real keystrokes instead of a metronome.
const START_DELAY = 320
const TYPE_MIN = 85
const TYPE_JITTER = 95
const HOLD = 520
const ERASE = 55

export default function Preloader() {
  const [text, setText] = useState('')
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  // Lock the page while the curtain is up, release it once we're done.
  // (This component never unmounts, so we can't rely on effect cleanup.)
  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  // Typewriter: type the name, hold, then erase it.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setText(NAME)
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) =>
      timers.push(setTimeout(() => !cancelled && fn(), ms))

    let clock = START_DELAY
    for (let i = 1; i <= NAME.length; i++) {
      at(clock, () => setText(NAME.slice(0, i)))
      clock += TYPE_MIN + Math.random() * TYPE_JITTER
    }
    clock += HOLD
    for (let i = NAME.length - 1; i >= 0; i--) {
      at(clock, () => setText(NAME.slice(0, i)))
      clock += ERASE
    }

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  // Loading bar = master clock. When it fills, lift the curtain.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const controls = animate(0, 100, {
      duration: reduce ? 0.6 : 2.3,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => setProgress(v),
      onComplete: () => setDone(true),
    })
    return () => controls.stop()
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={false}
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: BG,
            color: INK,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 30,
            fontFamily: 'var(--font-jetbrains), monospace',
            willChange: 'transform',
          }}
        >
          {/* TYPEWRITER NAME */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '1.2em',
              fontSize: 'clamp(20px, 4.4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textIndent: '0.3em',
              lineHeight: 1,
            }}
          >
            <span>{text}</span>
            <motion.span
              aria-hidden
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                display: 'inline-block',
                width: 2,
                height: '1.05em',
                marginLeft: '-0.12em',
                background: INK,
                transform: 'translateY(0.04em)',
              }}
            />
          </div>

          {/* MINIMAL EMPTY BAR */}
          <div
            style={{
              position: 'relative',
              width: 'min(170px, 46vw)',
              height: 1,
              background: 'rgb(var(--ink-rgb) / 0.14)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: 'left',
                transform: `scaleX(${progress / 100})`,
                background: INK,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
