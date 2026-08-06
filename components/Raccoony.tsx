'use client'

import { motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { GRAIN } from '@/lib/grain'

// 👉 Toda la copia traducible vive en `raccoony` de lib/dictionaries.ts
const REPO = 'https://github.com/Jhongdlp/Raccoony'

const EASE = [0.16, 1, 0.3, 1] as const

// Mismos nombres que en About y Contact; el valor lo pone el tema (globals.css).
const INK = 'var(--ink)'
const BG = 'var(--bg)'
const MUTE = 'var(--mute)'
const FAINT = 'var(--faint)'
const HAIR = 'var(--hair)'

// La superficie de la app. A diferencia de las de arriba, estas NO son tinta
// sobre el fondo del sitio: son el material de Raccoony, y sólo aparecen dentro
// de los marcos donde el producto se muestra a sí mismo. Mezclarlas con el resto
// de la página convertiría el caso de estudio en una imitación de la app.
const NEU_BG = 'var(--neu-bg)'
const NEU_INK = 'var(--neu-ink)'
const NEU_MUTE = 'var(--neu-mute)'

/* ─────────────────────────────  PRIMITIVAS  ───────────────────────────── */

/**
 * Igual que el resto del sitio (ver Projects.tsx): arranca en `false` para que
 * el HTML del servidor sea siempre el mismo y la hidratación no discrepe; el
 * ancho real se lee ya montado.
 */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const sync = () => setMatches(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [query])

  return matches
}

// Mismas variantes que About: la línea sube desde debajo de su propia máscara y
// entra desenfocada. El disparo vive en el contenedor, no en la línea, porque una
// línea enmascarada no intersecta y el observer nunca la vería.
const lineVariant = {
  hidden: { y: '116%', filter: 'blur(10px)' },
  show: { y: '0%', filter: 'blur(0px)', transition: { duration: 1.05, ease: EASE } },
}

const fillVariant = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1, ease: EASE, delay: 0.35 } },
}

function LineReveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em' }}>
      <motion.span variants={lineVariant} style={{ display: 'block', ...style }}>
        {children}
      </motion.span>
    </span>
  )
}

function FillWord({ children }: { children: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span aria-hidden style={{ WebkitTextStroke: `1.6px ${INK}`, color: 'transparent' }}>
        {children}
      </span>
      <motion.span variants={fillVariant} style={{ position: 'absolute', inset: 0, color: INK }}>
        {children}
      </motion.span>
    </span>
  )
}

/** Aparición estándar de bloque: sube 18px y entra. */
function Rise({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/** Etiqueta mono de sección, con el filete que la ancla al margen. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: FAINT,
      }}
    >
      <span aria-hidden style={{ width: 28, height: 1, background: HAIR }} />
      {children}
    </span>
  )
}

/** Cabecera de sección: etiqueta, titular y —si hace falta— párrafo de entrada. */
function SectionHead({ label, title, body }: { label: string; title: string; body?: string }) {
  return (
    <Rise style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
      <Eyebrow>{label}</Eyebrow>
      <h2
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: 'clamp(30px, 4.4vw, 62px)',
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          color: INK,
        }}
      >
        {title}
      </h2>
      {body && (
        <p
          style={{
            margin: 0,
            maxWidth: 640,
            fontSize: 'clamp(15px, 1.3vw, 18px)',
            lineHeight: 1.6,
            color: MUTE,
          }}
        >
          {body}
        </p>
      )}
    </Rise>
  )
}

/** Botón principal de la página: el `.btn-12` global, sobre un enlace. */
function RepoButton({ label }: { label: string }) {
  return (
    <a
      href={REPO}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-12"
      style={{ textDecoration: 'none' }}
    >
      <span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
        </svg>
        {label}
      </span>
    </a>
  )
}

/* ─────────────────────────────  PORTADA  ───────────────────────────── */

function Hero() {
  const { t } = useLanguage()
  const r = t.raccoony

  return (
    <div className="rac-hero" style={{ position: 'relative', zIndex: 2 }}>
      {/* Columna de texto */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Rise>
          <Eyebrow>{r.eyebrow}</Eyebrow>
        </Rise>

        {/* El nombre a la escala del hero de la portada: es lo único de esta
            página que se pone en Anton, para que se lea como un título propio y
            no como una sección más del portafolio.

            El cuerpo lo manda la COLUMNA, no el viewport: «RACCOONY» es una sola
            palabra que no parte, y la columna izquierda del grid mide ~1/2 del
            ancho útil. A 11vw la palabra se salía y el `overflow: hidden` de la
            sección le cortaba la Y en plano. 9.4vw la deja dentro con holgura en
            todo el rango, y `clamp` la sostiene en los extremos. */}
        <motion.h1
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
          style={{
            margin: 0,
            fontFamily: 'var(--font-anton), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(58px, 9.4vw, 138px)',
            lineHeight: 0.84,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            color: INK,
          }}
        >
          <LineReveal>{r.title}</LineReveal>
        </motion.h1>

        <Rise delay={0.14} style={{ display: 'flex', flexDirection: 'column' }}>
          {r.tagline.map(line => (
            <span
              key={line}
              style={{
                fontSize: 'clamp(18px, 2vw, 26px)',
                lineHeight: 1.28,
                letterSpacing: '-0.02em',
                color: INK,
              }}
            >
              {line}
            </span>
          ))}
        </Rise>

        <Rise delay={0.22}>
          <p
            style={{
              margin: 0,
              maxWidth: 540,
              fontSize: 'clamp(15px, 1.3vw, 17px)',
              lineHeight: 1.62,
              color: MUTE,
            }}
          >
            {r.lead}
          </p>
        </Rise>

        <Rise delay={0.3}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 22 }}>
            <RepoButton label={r.ctaRepo} />
            <a
              href="#sistema"
              className="link-with-arrow"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: MUTE,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                cursor: 'none',
              }}
            >
              {r.ctaTour} <span>↓</span>
            </a>
          </div>
        </Rise>
      </div>

      {/* Carátula, montada sobre la superficie de la propia app */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.18 }}
        style={{
          padding: 'clamp(10px, 1.2vw, 16px)',
          borderRadius: 30,
          background: NEU_BG,
          boxShadow: 'var(--neu-raised)',
        }}
      >
        <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
          <img
            src="/raccoony/cover.webp"
            alt={r.coverAlt}
            width={1660}
            height={960}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          {/* Filo interior: sin él la carátula se funde con el bisel y el relieve
              del marco deja de leerse. */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 20,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────  FICHA  ───────────────────────────── */

function MetaBar() {
  const { t } = useLanguage()
  return (
    <Rise className="rac-meta" style={{ position: 'relative', zIndex: 2 }}>
      {t.raccoony.meta.map(({ k, v }) => (
        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: FAINT,
            }}
          >
            {k}
          </span>
          <span style={{ fontSize: 14, lineHeight: 1.4, letterSpacing: '-0.01em', color: INK }}>
            {v}
          </span>
        </div>
      ))}
    </Rise>
  )
}

/* ─────────────────────────────  TESIS  ───────────────────────────── */

function Thesis() {
  const { t } = useLanguage()
  const [l1, fill, l3, l4] = t.raccoony.manifesto

  return (
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 5vh, 56px)' }}>
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: 'clamp(40px, 7.4vw, 122px)',
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          color: INK,
        }}
      >
        <LineReveal>{l1}</LineReveal>
        <LineReveal
          style={{
            fontFamily: 'var(--font-anton), sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.005em',
          }}
        >
          <FillWord>{fill}</FillWord>
        </LineReveal>
        <LineReveal>{l3}</LineReveal>
        <LineReveal>{l4}</LineReveal>
      </motion.h2>

      <Rise delay={0.1}>
        <p
          style={{
            margin: 0,
            maxWidth: 680,
            marginLeft: 'auto',
            fontSize: 'clamp(16px, 1.5vw, 21px)',
            lineHeight: 1.55,
            letterSpacing: '-0.01em',
            color: MUTE,
          }}
        >
          {t.raccoony.thesis}
        </p>
      </Rise>
    </div>
  )
}

/* ─────────────────────────────  ALARMA  ───────────────────────────── */

function Alarm() {
  const { t } = useLanguage()
  const a = t.raccoony.alarm

  return (
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 6vh, 72px)' }}>
      <SectionHead label={a.label} title={a.title} body={a.body} />

      <div className="rac-steps">
        {a.steps.map((s, i) => (
          <Rise key={s.n} delay={0.06 * i} style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 20, borderTop: `1px solid ${HAIR}` }}>
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 11,
                letterSpacing: '0.16em',
                color: FAINT,
              }}
            >
              {s.n}
            </span>
            <h3 style={{ margin: 0, fontSize: 'clamp(18px, 1.7vw, 22px)', fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>
              {s.t}
            </h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: MUTE }}>{s.d}</p>
          </Rise>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────  MÓDULOS  ───────────────────────────── */

/** Celda de módulo: el índice se enciende y la celda se aclara al pasar por encima. */
function ModuleCell({ index, title, desc }: { index: number; title: string; desc: string }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: hover ? 'rgb(var(--ink-rgb) / 0.04)' : BG,
        transition: 'background 0.4s ease',
        cursor: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: hover ? INK : FAINT,
          transition: 'color 0.35s ease',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: MUTE }}>{desc}</p>
    </div>
  )
}

/**
 * Los catorce módulos en pantalla de teléfono. Uno debajo de otro con su
 * descripción son unos 1.500px de lista seguida: el visitante no lee catorce
 * párrafos con el pulgar, sólo scrollea. Y lo que esta sección tiene que
 * transmitir es AMPLITUD, que se comunica mucho mejor viéndolos todos a la vez
 * que pasando por ellos de uno en uno.
 *
 * Así que en móvil la rejilla se vuelve densa —dos columnas, sólo número y
 * nombre, los catorce en poco más de media pantalla— y la descripción se abre
 * bajo demanda. El panel abierto ocupa la fila entera y se coloca DESPUÉS de la
 * fila de su celda, no dentro de ella: creciendo dentro, su compañera de fila se
 * estiraría con él y la rejilla se vería descuadrada.
 */
function ModulesCompact({ items }: { items: readonly { t: string; d: string }[] }) {
  // El primero abierto de entrada: sin nada desplegado, nada indica que se abren.
  const [open, setOpen] = useState<number | null>(0)

  // Índice de la celda tras la cual va el panel: la última de la fila del abierto.
  const panelAfter = open === null ? -1 : Math.min(Math.floor(open / 2) * 2 + 1, items.length - 1)

  return (
    <Rise className="rac-modules-compact">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <Fragment key={it.t}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                appearance: 'none',
                background: isOpen ? 'rgb(var(--ink-rgb) / 0.05)' : 'transparent',
                border: 'none',
                borderRight: `1px solid ${HAIR}`,
                borderBottom: `1px solid ${HAIR}`,
                padding: '15px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 7,
                textAlign: 'left',
                font: 'inherit',
                color: INK,
                cursor: 'none',
                WebkitTapHighlightColor: 'transparent',
                transition: 'background 0.3s ease',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: isOpen ? INK : FAINT,
                  transition: 'color 0.3s ease',
                }}
              >
                {String(i + 1).padStart(2, '0')}
                <span
                  aria-hidden
                  style={{
                    fontSize: 13,
                    lineHeight: 1,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  +
                </span>
              </span>
              <span style={{ fontSize: 15.5, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {it.t}
              </span>
            </button>

            {i === panelAfter && open !== null && (
              <motion.p
                key={`panel-${open}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{
                  gridColumn: '1 / -1',
                  margin: 0,
                  padding: '16px 14px 20px',
                  borderRight: `1px solid ${HAIR}`,
                  borderBottom: `1px solid ${HAIR}`,
                  background: 'rgb(var(--ink-rgb) / 0.05)',
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: MUTE,
                }}
              >
                {items[open].d}
              </motion.p>
            )}
          </Fragment>
        )
      })}
    </Rise>
  )
}

function Modules() {
  const { t } = useLanguage()
  const m = t.raccoony.modules
  // Por debajo de 700px la rejilla densa gana; entre 700 y 900 todavía caben dos
  // columnas con descripción y no hace falta esconder nada.
  const compact = useMediaQuery('(max-width: 700px)')

  return (
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(36px, 5vh, 60px)' }}>
      <SectionHead label={m.label} title={m.title} body={m.body} />
      {compact ? (
        <ModulesCompact items={m.items} />
      ) : (
        <Rise className="rac-modules">
          {m.items.map((it, i) => (
            <ModuleCell key={it.t} index={i} title={it.t} desc={it.d} />
          ))}
        </Rise>
      )}
    </div>
  )
}

/* ─────────────────────────────  PANTALLAS  ───────────────────────────── */

/** Captura montada en un bisel neumórfico: el marco es del material de la app. */
function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        padding: 11,
        borderRadius: 40,
        background: NEU_BG,
        boxShadow: 'var(--neu-raised)',
      }}
    >
      <div style={{ position: 'relative', borderRadius: 30, overflow: 'hidden', background: NEU_BG }}>
        <img
          src={src}
          alt={alt}
          width={720}
          height={1600}
          loading="lazy"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 30,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.14)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

function Screens() {
  const { t } = useLanguage()
  const s = t.raccoony.screens

  return (
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(36px, 5vh, 64px)' }}>
      <SectionHead label={s.label} title={s.title} />
      <div className="rac-screens">
        {s.items.map((it, i) => (
          <Rise key={it.t} delay={0.08 * i} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Phone src={it.src} alt={it.t} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>
                {it.t}
              </h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.58, color: MUTE }}>{it.d}</p>
            </div>
          </Rise>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────  SISTEMA DE DISEÑO  ───────────────────────── */

/**
 * Los tres estados del relieve, construidos con la misma CSS que usa la app —
 * no son capturas. El primero se hunde al pasar por encima: es la demostración
 * literal del principio de que elevado significa «esto se toca».
 */
function NeuDemo() {
  const { t } = useLanguage()
  const d = t.raccoony.design
  const [pressed, setPressed] = useState(false)
  const [raised, sunken, flat] = d.demo

  const tile: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: '26px 12px',
    borderRadius: 22,
    textAlign: 'center',
  }

  // Las tres piezas de muestra miden distinto de alto (un botón redondo, una
  // pista de 10px, dos líneas de texto). Sin una caja de alto fijo, los pies
  // quedan a tres alturas distintas y la comparación deja de leerse como tal.
  const glyphBox: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
  }

  const caption = (title: string, sub: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', color: NEU_INK }}>{title}</span>
      <span style={{ fontSize: 11, lineHeight: 1.3, color: NEU_MUTE }}>{sub}</span>
    </div>
  )

  return (
    <Rise
      delay={0.1}
      style={{
        padding: 'clamp(20px, 2.4vw, 30px)',
        borderRadius: 30,
        background: NEU_BG,
        boxShadow: 'var(--neu-raised)',
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 9.5,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: NEU_MUTE,
        }}
      >
        {d.demoLabel}
      </span>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(10px, 1.4vw, 18px)' }}>
        {/* Elevado — un botón de verdad, que se hunde al tocarlo */}
        <div
          onMouseEnter={() => setPressed(true)}
          onMouseLeave={() => setPressed(false)}
          style={{
            ...tile,
            background: NEU_BG,
            boxShadow: pressed ? 'var(--neu-inset)' : 'var(--neu-raised-sm)',
            transition: 'box-shadow 0.35s ease',
            cursor: 'none',
          }}
        >
          <span aria-hidden style={glyphBox}>
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: '#12A05E',
                color: '#fff',
                fontSize: 22,
                lineHeight: 1,
                boxShadow: pressed ? 'none' : '0 6px 14px rgba(18,160,94,0.35)',
                transform: pressed ? 'scale(0.94)' : 'scale(1)',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease',
              }}
            >
              +
            </span>
          </span>
          {caption(raised.t, raised.d)}
        </div>

        {/* Hundido — la pista de progreso del hábito de agua */}
        <div style={{ ...tile, background: NEU_BG, boxShadow: 'var(--neu-inset)' }}>
          <span aria-hidden style={glyphBox}>
            <span
              style={{
                width: '100%',
                height: 10,
                borderRadius: 999,
                background: 'var(--neu-well)',
                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.22)',
                overflow: 'hidden',
                display: 'block',
              }}
            >
              <span style={{ display: 'block', width: '62%', height: '100%', borderRadius: 999, background: '#12A05E' }} />
            </span>
          </span>
          {caption(sunken.t, sunken.d)}
        </div>

        {/* Plano — información pura: ni relieve, ni color */}
        <div style={{ ...tile, background: 'transparent' }}>
          <span aria-hidden style={{ ...glyphBox, flexDirection: 'column', gap: 5, fontFamily: 'var(--font-jetbrains), monospace' }}>
            <span style={{ fontSize: 9, letterSpacing: '0.24em', color: NEU_MUTE }}>HOY</span>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: NEU_INK }}>10</span>
          </span>
          {caption(flat.t, flat.d)}
        </div>
      </div>

      {/* Acentos. Cada uno vive en su propio hueco: sobre la superficie plana el
          color flotaría, y el hueco es lo que lo asienta en el material. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 9.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: NEU_MUTE,
          }}
        >
          {d.paletteLabel}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 1.6vw, 22px)' }}>
          {d.palette.map(({ name, hex }) => (
            <div key={hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, minWidth: 62 }}>
              <span
                aria-hidden
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: NEU_BG,
                  boxShadow: 'var(--neu-inset)',
                }}
              >
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: hex, display: 'block' }} />
              </span>
              <span style={{ fontSize: 11, color: NEU_INK, textAlign: 'center' }}>{name}</span>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 9,
                  letterSpacing: '0.06em',
                  color: NEU_MUTE,
                }}
              >
                {hex}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Rise>
  )
}

function DesignSystem() {
  const { t } = useLanguage()
  const d = t.raccoony.design

  return (
    <div id="sistema" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(36px, 5vh, 60px)', scrollMarginTop: 90 }}>
      <SectionHead label={d.label} title={d.title} body={d.body} />

      <div className="rac-design">
        <div>
          {d.principles.map((p, i) => (
            <Rise
              key={p.t}
              delay={0.06 * i}
              style={{
                display: 'flex',
                gap: 'clamp(16px, 2vw, 28px)',
                padding: '24px 0',
                borderTop: `1px solid ${HAIR}`,
                borderBottom: i === d.principles.length - 1 ? `1px solid ${HAIR}` : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  color: FAINT,
                  paddingTop: 4,
                }}
              >
                0{i + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <h3 style={{ margin: 0, fontSize: 'clamp(18px, 1.8vw, 23px)', fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>
                  {p.t}
                </h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.58, color: MUTE }}>{p.d}</p>
              </div>
            </Rise>
          ))}
        </div>

        <NeuDemo />
      </div>
    </div>
  )
}

/* ─────────────────────────────  ARQUITECTURA  ───────────────────────────── */

function Architecture() {
  const { t } = useLanguage()
  const a = t.raccoony.arch

  return (
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 6vh, 72px)' }}>
      <SectionHead label={a.label} title={a.title} body={a.body} />

      <div className="rac-pillars">
        {a.pillars.map((p, i) => (
          <Rise
            key={p.k}
            delay={0.08 * i}
            style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 22, borderTop: `1px solid ${HAIR}` }}
          >
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 10,
                letterSpacing: '0.22em',
                color: FAINT,
              }}
            >
              {p.k}
            </span>
            <h3 style={{ margin: 0, fontSize: 'clamp(24px, 2.8vw, 38px)', fontWeight: 500, letterSpacing: '-0.03em', color: INK }}>
              {p.t}
            </h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.58, color: MUTE }}>{p.d}</p>
          </Rise>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────  CIERRE  ───────────────────────────── */

function Outro() {
  const { t } = useLanguage()
  const r = t.raccoony

  return (
    <Rise
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
        paddingTop: 'clamp(36px, 5vh, 60px)',
        borderTop: `1px solid ${HAIR}`,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: 'clamp(30px, 4.4vw, 62px)',
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          color: INK,
        }}
      >
        {r.outro.title}
      </h2>
      <p style={{ margin: 0, maxWidth: 560, fontSize: 'clamp(15px, 1.3vw, 18px)', lineHeight: 1.6, color: MUTE }}>
        {r.outro.body}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        <RepoButton label={r.ctaRepo} />
        <a
          href="/#proyectos"
          className="link-with-arrow"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: MUTE,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            cursor: 'none',
          }}
        >
          <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span> {r.back}
        </a>
      </div>
    </Rise>
  )
}

/* ─────────────────────────────  PÁGINA  ───────────────────────────── */

export default function Raccoony() {
  return (
    // `id="inicio"` es el destino del «volver arriba» del pie, que es compartido.
    <main id="inicio" className="cursor-none">
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px, 13vh, 168px)',
          // El respiro superior deja pasar la barra fija sin que el titular quede
          // debajo; el resto es el mismo margen editorial que About y Contact.
          padding: 'clamp(112px, 17vh, 190px) clamp(24px, 6vw, 120px) clamp(80px, 12vh, 150px)',
          fontFamily: 'var(--font-archivo), sans-serif',
          background: `radial-gradient(135% 105% at 12% -8%, var(--bg-elev) 0%, ${BG} 60%)`,
        }}
      >
        <div aria-hidden className="grain" style={{ backgroundImage: GRAIN, zIndex: 1 }} />

        <Hero />
        <MetaBar />
        <Thesis />
        <Alarm />
        <Modules />
        <Screens />
        <DesignSystem />
        <Architecture />
        <Outro />
      </section>
    </main>
  )
}
