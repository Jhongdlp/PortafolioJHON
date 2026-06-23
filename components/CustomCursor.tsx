'use client'

import { useEffect, useRef } from 'react'

const TRAIL = 7
const SIZES  = [34, 27, 21, 16, 12, 9, 6, 4]
const LERPS  = [0.28, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42]

export default function CustomCursor() {
  const dotsRef     = useRef<(HTMLDivElement | null)[]>(Array(TRAIL + 1).fill(null))
  const crossRef    = useRef<HTMLDivElement>(null)
  const pos         = useRef(Array.from({ length: TRAIL + 1 }, () => ({ x: -400, y: -400 })))
  const mouse       = useRef({ x: -400, y: -400 })
  const raf         = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const p = pos.current
      const m = mouse.current

      // head follows mouse
      p[0].x += (m.x - p[0].x) * LERPS[0]
      p[0].y += (m.y - p[0].y) * LERPS[0]

      // each trail dot follows the previous
      for (let i = 1; i <= TRAIL; i++) {
        p[i].x += (p[i - 1].x - p[i].x) * LERPS[i]
        p[i].y += (p[i - 1].y - p[i].y) * LERPS[i]
      }

      dotsRef.current.forEach((dot, i) => {
        if (dot) dot.style.transform = `translate(${p[i].x}px,${p[i].y}px)`
      })

      // crosshair follows the raw mouse position for precision
      if (crossRef.current) {
        crossRef.current.style.transform = `translate(${m.x}px,${m.y}px)`
      }

      raf.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    raf.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Comet trail dots */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'difference',
        }}
      >
        {Array.from({ length: TRAIL + 1 }, (_, i) => {
          const size = SIZES[i] ?? 3
          return (
            <div
              key={i}
              ref={el => { dotsRef.current[i] = el }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: size,
                height: size,
                marginLeft: -(size / 2),
                marginTop: -(size / 2),
                borderRadius: '50%',
                background: '#ffffff',
                pointerEvents: 'none',
                willChange: 'transform',
              }}
            />
          )
        })}
      </div>

      {/* Crosshair — sits on top of the blob, inverts to black inside the white area */}
      <div
        ref={crossRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          marginLeft: -6,
          marginTop: -6,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%', left: 0, right: 0,
          height: 1.5,
          background: '#fff',
          transform: 'translateY(-50%)',
        }} />
        <div style={{
          position: 'absolute',
          left: '50%', top: 0, bottom: 0,
          width: 1.5,
          background: '#fff',
          transform: 'translateX(-50%)',
        }} />
      </div>
    </>
  )
}
