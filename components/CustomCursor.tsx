'use client'

import { useEffect, useRef, useState } from 'react'

const TRAIL = 8
const SIZES = [32, 32,30,  30 , 28, 28,  25,25, 22, 22, 19,19, 16,16, 12,12, 8,8 , 4 , 4,2,2]
const LERPS = [0.22, 0.72, 0.69, 0.66, 0.63, 0.60, 0.58, 0.56, 0.54]

// Diámetro del círculo que reemplaza al cursor sobre un elemento con data-cursor-label.
const BUBBLE = 124

// La burbuja arranca del tamaño del punto de cabeza y crece hasta BUBBLE.
const MIN_SCALE = SIZES[0] / BUBBLE
const GROW_LERP = 0.13

export default function CustomCursor() {
  const dotsRef     = useRef<(HTMLDivElement | null)[]>(Array(TRAIL + 1).fill(null))
  const dotsLayer   = useRef<HTMLDivElement>(null)
  const crossRef    = useRef<HTMLDivElement>(null)
  const bubbleRef   = useRef<HTMLDivElement>(null)
  const bubbleInner = useRef<HTMLDivElement>(null)
  const pos         = useRef(Array.from({ length: TRAIL + 1 }, () => ({ x: -400, y: -400 })))
  const mouse       = useRef({ x: -400, y: -400 })
  const raf         = useRef(0)
  const labelRef = useRef<string | null>(null) // etiqueta bajo el cursor ahora
  const shownRef = useRef<string | null>(null) // etiqueta pintada (sobrevive al encogido)
  const target   = useRef(0) // 1 sobre un elemento etiquetado, 0 fuera
  const grow     = useRef(0) // valor interpolado: el crecimiento real
  const [label, setLabel] = useState<string | null>(null)
  // En táctil no hay puntero que seguir: el rastro se quedaría clavado donde
  // ocurrió el último toque, flotando sobre el contenido para siempre.
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setCanHover(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

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

      // Cualquier elemento con data-cursor-label expande el cursor y muestra su texto.
      // Se resuelve por frame, no con mouseover, porque las cartas se desplazan con el
      // parallax bajo un ratón quieto y el navegador no reevalúa el hover sin movimiento.
      // elementsFromPoint (plural) y no elementFromPoint: dentro de un subárbol
      // preserve-3d, el singular devuelve el contenedor en vez de la carta.
      const hit = document
        .elementsFromPoint(m.x, m.y)
        .find(el => el.closest('[data-cursor-label]'))
      const next = hit?.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') ?? null
      if (next !== labelRef.current) {
        labelRef.current = next
        target.current = next ? 1 : 0
        // Al entrar el texto se pone ya; al salir se mantiene hasta que la burbuja
        // termina de encogerse, para que no desaparezca de golpe.
        if (next) {
          shownRef.current = next
          setLabel(next)
        }
      }

      // El crecimiento se interpola por frame: la burbuja nace del punto del cursor
      // y se abre hasta su tamaño final, en vez de aparecer ya grande.
      const g = grow.current + (target.current - grow.current) * GROW_LERP
      grow.current = g

      if (bubbleRef.current && bubbleInner.current) {
        // la burbuja sigue a la cabeza del rastro, no al ratón crudo
        bubbleRef.current.style.transform = `translate(${p[0].x}px,${p[0].y}px)`
        bubbleInner.current.style.transform = `scale(${(MIN_SCALE + (1 - MIN_SCALE) * g).toFixed(4)})`
        bubbleInner.current.style.opacity = g.toFixed(3)
      }
      // el rastro se apaga a la vez que la burbuja se abre
      if (dotsLayer.current) dotsLayer.current.style.opacity = (1 - g).toFixed(3)
      if (crossRef.current) crossRef.current.style.opacity = (1 - g).toFixed(3)

      if (g < 0.01 && !target.current && shownRef.current !== null) {
        shownRef.current = null
        setLabel(null)
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

  if (!canHover) return null

  return (
    <>
      <div
        ref={dotsLayer}
        className="custom-cursor-dots"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'difference',
          willChange: 'opacity',
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
        className="custom-cursor-cross"
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
          willChange: 'transform, opacity',
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

      {/* Burbuja con etiqueta — reemplaza al cursor sobre las cartas.
          Sin mixBlendMode: el texto debe leerse, no invertirse. */}
      <div
        ref={bubbleRef}
        className="custom-cursor-bubble"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <div
          ref={bubbleInner}
          style={{
            width: BUBBLE,
            height: BUBBLE,
            marginLeft: -(BUBBLE / 2),
            marginTop: -(BUBBLE / 2),
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 16,
            // La burbuja va SIEMPRE en negativo del fondo (tinta de fondo, papel de
            // letra): es lo único del cursor que se lee como texto, y así se sostiene
            // sobre cualquiera de los dos temas sin depender de la mezcla.
            background: 'var(--ink)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            lineHeight: 1.3,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            boxShadow: 'var(--chip-shadow)',
            // escala y opacidad las conduce el rAF (ver tick), no CSS
            opacity: 0,
            transform: `scale(${MIN_SCALE})`,
            willChange: 'transform, opacity',
          }}
        >
          {label}
        </div>
      </div>
    </>
  )
}
