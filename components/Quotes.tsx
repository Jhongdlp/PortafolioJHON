'use client'

import { motion, useAnimationControls, useInView, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { GRAIN } from '@/lib/grain'
import type { Dictionary } from '@/lib/dictionaries'

type QuoteId = keyof Dictionary['quotes']['items']

// 👉 La cita y el rol viven traducidos en lib/dictionaries.ts (bloque `quotes`).
// Aquí sólo lo que no se traduce: el nombre propio, el retrato y la fuente original.
// Orden cronológico: la secuencia va de 1843 a hoy y esa progresión es parte del mensaje.
type Voice = { id: QuoteId; name: string; img: string; source: string }

const VOICES: Voice[] = [
  { id: 'lovelace', name: 'Ada Lovelace', img: '/quotes/lovelace.webp', source: '1843 · Notes on the Analytical Engine' },
  { id: 'turing', name: 'Alan Turing', img: '/quotes/turing.webp', source: '1950 · Computing Machinery and Intelligence' },
  { id: 'hopper', name: 'Grace Hopper', img: '/quotes/hopper.webp', source: '1976 · Computerworld' },
  { id: 'dijkstra', name: 'Edsger W. Dijkstra', img: '/quotes/dijkstra.webp', source: '1984 · The Threats to Computing Science' },
  { id: 'torvalds', name: 'Linus Torvalds', img: '/quotes/torvalds.webp', source: '2000 · linux-kernel mailing list' },
  { id: 'li', name: 'Fei-Fei Li', img: '/quotes/li.webp', source: '2018 · The New York Times' },
  { id: 'karpathy', name: 'Andrej Karpathy', img: '/quotes/karpathy.webp', source: '2023 · X' },
]

// Lo que dura una cita en pantalla antes de pasar a la siguiente.
const DWELL_MS = 8000

const EASE = [0.16, 1, 0.3, 1] as const

// Mismos tokens que About/Contact, pero sin acento: la sección es un interludio y
// se sostiene sólo con tinta sobre carbón. El único "color" es el de los retratos.
// Ver el bloque de tema en globals.css: estos nombres cambian de valor con él.
const INK = 'var(--ink)'
const BG = 'var(--bg)'
const MUTE = 'var(--mute)'
const FAINT = 'var(--faint)'
const HAIR = 'var(--hair)'

const wordVariant = {
  hidden: { y: '110%', filter: 'blur(8px)', opacity: 0 },
  show: { y: '0%', filter: 'blur(0px)', opacity: 1, transition: { duration: 0.85, ease: EASE } },
}

// El cuerpo de la cita. Vive fuera del componente porque lo comparten la cita visible
// y los fantasmas que reservan su altura: si los dos no componen EXACTAMENTE igual, la
// reserva de espacio miente y vuelve el salto.
const QUOTE_TYPE: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-archivo), sans-serif',
  fontWeight: 500,
  // La cita es la pieza: escala de titular, no de párrafo.
  fontSize: 'clamp(26px, 3.5vw, 56px)',
  lineHeight: 1.16,
  letterSpacing: '-0.03em',
  color: INK,
  // Medida en ch sobre la caja que define el cuerpo (no sobre el contenedor, que
  // hereda 16px): ~20 caracteres por línea, la columna de una cita de pull-quote.
  maxWidth: '20ch',
}

// La caja de cada palabra: máscara con la que sube el texto. La usan por igual la cita
// visible y el fantasma que reserva altura — mismas cajas, misma composición, mismo alto.
const WORD_BOX: React.CSSProperties = {
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'bottom',
  paddingBottom: '0.08em',
}

/**
 * La cita, palabra a palabra. Cada una sube tras su propia máscara y se enfoca al
 * llegar: es el mismo gesto de LineReveal de About, pero desmenuzado para que el ojo
 * lea la frase al ritmo en que se escribiría. Se remonta con cada cambio de voz.
 *
 * En modo `ghost` compone exactamente igual pero sin movimiento: es el doble que le
 * reserva el sitio a las citas que no están en pantalla (ver la rejilla apilada abajo).
 */
function QuoteText({ text, play, ghost }: { text: string; play?: boolean; ghost?: boolean }) {
  const words = text.split(' ').map((word, i) => (
    <span key={`${word}-${i}`} style={WORD_BOX}>
      {ghost ? (
        <span style={{ display: 'inline-block' }}>{word}</span>
      ) : (
        <motion.span variants={wordVariant} style={{ display: 'inline-block' }}>
          {word}
        </motion.span>
      )}
      {/* el espacio va fuera de la máscara: dentro lo comería el overflow */}
      <span style={{ display: 'inline-block', width: '0.26em' }} />
    </span>
  ))

  if (ghost) {
    return (
      <blockquote aria-hidden style={QUOTE_TYPE}>
        {words}
      </blockquote>
    )
  }

  return (
    <motion.blockquote
      initial="hidden"
      animate={play ? 'show' : 'hidden'}
      transition={{ staggerChildren: 0.035 }}
      style={QUOTE_TYPE}
    >
      {words}
    </motion.blockquote>
  )
}

/**
 * Retrato circular, siempre en blanco y negro: la sección no admite color y así los
 * siete rostros —de un daguerrotipo de 1843 a una charla de 2023— se leen como una
 * misma serie. El activo no cambia de tono, sólo sale de la penumbra: opacidad plena
 * y anillo de tinta.
 */
function Portrait({ src, alt, size, active }: { src: string; alt: string; size: number; active: boolean }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        border: `1px solid ${active ? INK : HAIR}`,
        filter: `grayscale(1) contrast(${active ? 1.05 : 1})`,
        opacity: active ? 1 : 0.34,
        transition: 'filter 0.6s ease, opacity 0.5s ease, border-color 0.5s ease',
      }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} style={{ objectFit: 'cover' }} />
    </span>
  )
}

/** Firma de la cita: retrato grande, nombre en Anton, rol y fuente original en mono. */
function Byline({ voice, role }: { voice: Voice; role: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0 }}>
      <Portrait src={voice.img} alt={voice.name} size={64} active />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-anton), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(19px, 1.9vw, 26px)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {voice.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: MUTE,
          }}
        >
          {role}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 10,
            letterSpacing: '0.08em',
            color: FAINT,
          }}
        >
          {voice.source}
        </span>
      </div>
    </div>
  )
}

export default function Quotes() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  // amount alto: la rotación sólo corre cuando la sección manda en pantalla; si sólo
  // asoma por el borde, las citas pasarían de largo sin que nadie las lea.
  const inView = useInView(ref, { amount: 0.55 })

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const bar = useAnimationControls()

  const voice = VOICES[active]
  const copy = t.quotes.items[voice.id]

  const go = useCallback((next: number) => {
    setActive((next + VOICES.length) % VOICES.length)
  }, [])

  // La barra de progreso ES el temporizador: al completarse, pasa a la siguiente voz.
  // Un setInterval aparte se desincronizaría de ella en cuanto se pausara el hover.
  useEffect(() => {
    if (reduced || !inView || paused) {
      bar.stop()
      return
    }
    bar.set({ scaleX: 0 })
    bar.start({ scaleX: 1, transition: { duration: DWELL_MS / 1000, ease: 'linear' } })
  }, [active, inView, paused, reduced, bar])

  return (
    <section
      ref={ref}
      id="citas"
      className="editorial-section cursor-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        color: INK,
        background: BG,
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(28px, 4vh, 48px)',
        padding: 'clamp(88px, 14vh, 150px) clamp(24px, 4vw, 60px)',
        fontFamily: 'var(--font-archivo), sans-serif',
      }}
    >
      <div
        aria-hidden
        className="grain"
        style={{
          backgroundImage: GRAIN,
          zIndex: 1,
        }}
      />

      {/* LA CITA — comilla de apertura como ancla tipográfica, y el texto debajo. */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            fontFamily: 'var(--font-anton), sans-serif',
            fontSize: 'clamp(56px, 7vw, 104px)',
            lineHeight: 0.7,
            // Sin acento, la comilla se apoya sólo en la escala: tinta a media luz.
            color: 'rgb(var(--ink-rgb) / 0.28)',
            marginBottom: 'clamp(14px, 2vh, 26px)',
            userSelect: 'none',
          }}
        >
          &ldquo;
        </motion.span>

        {/* La caja mide SIEMPRE lo que la cita más alta. Las siete se apilan en la misma
            celda de grid —las inactivas en visibility:hidden, que ocupa sitio pero no se
            ve ni se lee— así que la altura la fija la más larga y no cambia al rotar.
            Un minHeight en px no serviría: la cita más alta depende del ancho, del idioma
            y de dónde parta cada línea, y el número mágico fallaría en la mitad de los
            casos (de más, dejando un hueco muerto; de menos, devolviendo el salto). */}
        <div style={{ display: 'grid' }}>
          {VOICES.map((v) => {
            const current = v.id === voice.id
            return (
              <div key={v.id} style={{ gridArea: '1 / 1', visibility: current ? 'visible' : 'hidden' }}>
                {current ? (
                  // key: cada voz remonta el bloque y la entrada corre desde cero
                  <QuoteText key={voice.id} text={copy.quote} play={inView || reduced === true} />
                ) : (
                  <QuoteText text={t.quotes.items[v.id].quote} ghost />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* PROGRESO — un pelo de luz que mide lo que queda de cita */}
      <div
        aria-hidden
        style={{ position: 'relative', zIndex: 2, height: 1, background: HAIR, overflow: 'hidden' }}
      >
        <motion.div
          animate={bar}
          initial={{ scaleX: 0 }}
          style={{ height: '100%', background: INK, transformOrigin: 'left' }}
        />
      </div>

      {/* AUTORÍA — el rostro y el nombre a la izq., el resto de voces a la der.
          Apilada igual que la cita: en móvil las fuentes largas ("1950 · Computing
          Machinery and Intelligence") caen a dos líneas y las cortas ("2023 · X") a una,
          así que el pie también reserva el alto del más alto. */}
      <div className="quotes-foot" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', minWidth: 0 }}>
          {VOICES.map((v) => {
            const current = v.id === voice.id
            return current ? (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                style={{ gridArea: '1 / 1' }}
              >
                <Byline voice={v} role={t.quotes.items[v.id].role} />
              </motion.div>
            ) : (
              <div key={v.id} aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden' }}>
                <Byline voice={v} role={t.quotes.items[v.id].role} />
              </div>
            )
          })}
        </div>

        {/* Selector: los siete rostros en fila. El activo recupera color y anillo. */}
        <div
          aria-label={t.quotes.eyebrow}
          style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}
        >
          {VOICES.map((v, i) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={i === active}
              aria-label={v.name}
              data-cursor-label={v.name}
              onClick={() => go(i)}
              onFocus={() => go(i)}
              style={{
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'none',
                transform: i === active ? 'translateY(-2px)' : 'none',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <Portrait src={v.img} alt="" size={38} active={i === active} />
            </button>
          ))}
        </div>
      </div>

      {/* Crédito de los retratos: son de Wikimedia Commons y varios llevan licencia CC. */}
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgb(var(--ink-rgb) / 0.22)',
        }}
      >
        {t.quotes.credit}
      </span>
    </section>
  )
}
