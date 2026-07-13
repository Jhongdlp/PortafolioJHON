'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { GRAIN } from '@/lib/grain'
import { siGithub, siX } from 'simple-icons'

// 👉 El texto traducible vive en lib/dictionaries.ts (bloque `contact`)
const EMAIL = 'hello@jhongdlp.com'
const TIMEZONE = 'America/Guayaquil'

// simple-icons retiró LinkedIn de su catálogo, así que su glifo se declara aquí.
const LINKEDIN = {
  title: 'LinkedIn',
  hex: '0A66C2',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
}

// Se declara el logo clásico circular de Reddit provisto por el usuario.
const REDDIT = {
  title: 'Reddit',
  hex: 'FF4500',
  render: (fillColor: string, bgColor: string, hover: boolean) => (
    <svg
      aria-hidden
      viewBox="0 0 800 800"
      style={{
        width: 19,
        height: 19,
        flexShrink: 0,
        opacity: hover ? 1 : 0.62,
        transition: 'opacity 0.4s ease',
      }}
    >
      <circle cx="400" cy="400" r="400" fill={fillColor} />
      <path
        d="M666.8 400c.08 5.48-.6 10.95-2.04 16.24s-3.62 10.36-6.48 15.04c-2.85 4.68-6.35 8.94-10.39 12.65s-8.58 6.83-13.49 9.27c.11 1.46.2 2.93.25 4.4a107.268 107.268 0 0 1 0 8.8c-.05 1.47-.14 2.94-.25 4.4 0 89.6-104.4 162.4-233.2 162.4S168 560.4 168 470.8c-.11-1.46-.2-2.93-.25-4.4a107.268 107.268 0 0 1 0-8.8c.05-1.47.14-2.94.25-4.4a58.438 58.438 0 0 1-31.85-37.28 58.41 58.41 0 0 1 7.8-48.42 58.354 58.354 0 0 1 41.93-25.4 58.4 58.4 0 0 1 46.52 15.5 286.795 286.795 0 0 1 35.89-20.71c12.45-6.02 25.32-11.14 38.51-15.3s26.67-7.35 40.32-9.56 27.45-3.42 41.28-3.63L418 169.6c.33-1.61.98-3.13 1.91-4.49.92-1.35 2.11-2.51 3.48-3.4 1.38-.89 2.92-1.5 4.54-1.8 1.61-.29 3.27-.26 4.87.09l98 19.6c9.89-16.99 30.65-24.27 48.98-17.19s28.81 26.43 24.71 45.65c-4.09 19.22-21.55 32.62-41.17 31.61-19.63-1.01-35.62-16.13-37.72-35.67L440 186l-26 124.8c13.66.29 27.29 1.57 40.77 3.82a284.358 284.358 0 0 1 77.8 24.86A284.412 284.412 0 0 1 568 360a58.345 58.345 0 0 1 29.4-15.21 58.361 58.361 0 0 1 32.95 3.21 58.384 58.384 0 0 1 25.91 20.61A58.384 58.384 0 0 1 666.8 400zm-396.96 55.31c2.02 4.85 4.96 9.26 8.68 12.97 3.71 3.72 8.12 6.66 12.97 8.68A40.049 40.049 0 0 0 306.8 480c16.18 0 30.76-9.75 36.96-24.69 6.19-14.95 2.76-32.15-8.68-43.59s-28.64-14.87-43.59-8.68c-14.94 6.2-24.69 20.78-24.69 36.96 0 5.25 1.03 10.45 3.04 15.31zm229.1 96.02c2.05-2 3.22-4.73 3.26-7.59.04-2.87-1.07-5.63-3.07-7.68s-4.73-3.22-7.59-3.26c-2.87-.04-5.63 1.07-7.94 2.8a131.06 131.06 0 0 1-19.04 11.35 131.53 131.53 0 0 1-20.68 7.99c-7.1 2.07-14.37 3.54-21.72 4.39-7.36.85-14.77 1.07-22.16.67-7.38.33-14.78.03-22.11-.89a129.01 129.01 0 0 1-21.64-4.6c-7.08-2.14-13.95-4.88-20.56-8.18s-12.93-7.16-18.89-11.53c-2.07-1.7-4.7-2.57-7.38-2.44s-5.21 1.26-7.11 3.15c-1.89 1.9-3.02 4.43-3.15 7.11s.74 5.31 2.44 7.38c7.03 5.3 14.5 9.98 22.33 14s16 7.35 24.4 9.97 17.01 4.51 25.74 5.66c8.73 1.14 17.54 1.53 26.33 1.17 8.79.36 17.6-.03 26.33-1.17A153.961 153.961 0 0 0 476.87 564c7.83-4.02 15.3-8.7 22.33-14zm-7.34-68.13c5.42.06 10.8-.99 15.81-3.07 5.01-2.09 9.54-5.17 13.32-9.06s6.72-8.51 8.66-13.58A39.882 39.882 0 0 0 532 441.6c0-16.18-9.75-30.76-24.69-36.96-14.95-6.19-32.15-2.76-43.59 8.68s-14.87 28.64-8.68 43.59c6.2 14.94 20.78 24.69 36.96 24.69z"
        fill={bgColor}
      />
    </svg>
  ),
}

// 👉 Las URLs de X y Reddit son provisionales: quedan pendientes de confirmar.
const SOCIALS = [
  { label: 'GitHub', url: 'https://github.com/Jhongdlp', icon: siGithub },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jhon-guadalupe-2a4194382/', icon: LINKEDIN },
  { label: 'X', url: 'https://x.com/jhongdlp', icon: siX },
  { label: 'Reddit', url: 'https://www.reddit.com/user/jhongdlp', icon: REDDIT },
]

// El aviso "COPIADO" vuelve a su estado en reposo pasado este tiempo.
const COPIED_MS = 2000

const EASE = [0.16, 1, 0.3, 1] as const

// Misma paleta cálida que About — los tokens se duplican por componente.
// Ver el bloque de tema en globals.css: estos nombres cambian de valor con él.
const INK = 'var(--ink)'
const BG = 'var(--bg)'
const MUTE = 'var(--mute)'
const FAINT = 'var(--faint)'
const HAIR = 'var(--hair)'
// Sin color de acento: el naranja queda reservado al logo (ver Header).

const lineVariant = {
  hidden: { y: '116%', filter: 'blur(10px)' },
  show: { y: '0%', filter: 'blur(0px)', transition: { duration: 1.05, ease: EASE } },
}

const fillVariant = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1, ease: EASE, delay: 0.35 } },
}

/** Línea enmascarada; anima vía variante heredada del contenedor. */
function LineReveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em' }}>
      <motion.span variants={lineVariant} style={{ display: 'block', ...style }}>
        {children}
      </motion.span>
    </span>
  )
}

/** Palabra de contorno hueco cuyo relleno se "pinta" de izq. a der. al entrar en viewport. */
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

/** Etiqueta mono + valor apilados. */
function MetaBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: FAINT,
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 13,
          letterSpacing: '0.04em',
          color: INK,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** Reloj vivo en la zona horaria de Quito. Se monta vacío para no romper la hidratación. */
function LocalTime() {
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {now ?? '--:--:--'} <span style={{ color: FAINT }}>GMT-5</span>
    </span>
  )
}

/**
 * El email a escala de titular: hueco en reposo, se rellena de izq. a der. al hover
 * — el mismo gesto que FillWord, pero disparado por el puntero. Al hacer clic se
 * copia al portapapeles y la etiqueta cambia a "COPIADO" durante COPIED_MS.
 */
function EmailPiece({ onOpenForm }: { onOpenForm: () => void }) {
  const { t } = useLanguage()
  const [hover, setHover] = useState(false)
  const [copied, setCopied] = useState(false)
  // En táctil no hay hover: el email se quedaría hueco para siempre. Ahí va relleno.
  const [canHover, setCanHover] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches)
  }, [])

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(id)
  }, [copied])

  const filled = hover || !canHover

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
    } catch {
      // Sin permiso de portapapeles (o contexto no seguro): que al menos pueda escribirnos.
      window.location.href = `mailto:${EMAIL}`
    }
  }

  // Vista en celular: caja interactiva muy limpia, tipografía clara en minúsculas y botón de copiar
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <motion.button
          type="button"
          onClick={copy}
          whileHover={{ scale: 1.01, borderColor: 'var(--ink)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            appearance: 'none',
            background: 'var(--bg-elev)',
            border: '1px solid var(--hair-strong)',
            borderRadius: '12px',
            padding: '16px 20px',
            margin: 0,
            width: '100%',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            cursor: 'pointer',
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 'clamp(14px, 4.2vw, 16px)',
              color: INK,
              letterSpacing: '-0.02em',
              textTransform: 'none',
            }}
          >
            {EMAIL}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: copied ? INK : FAINT,
              transition: 'color 0.3s ease',
            }}
          >
            {copied ? (
              <span>{t.contact.copied} ✓</span>
            ) : (
              <>
                <span>{t.contact.copyAction}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: 6, opacity: 0.7 }}
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </>
            )}
          </span>
        </motion.button>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 9,
            letterSpacing: '0.05em',
            color: FAINT,
            textTransform: 'uppercase',
            paddingLeft: 4,
          }}
        >
          {copied ? '¡Copiado en el portapapeles!' : 'Toca el recuadro para copiar el correo'}
        </span>

        {/* Botón de mensaje directo animado (btn-12) */}
        <div className="btn-12-wrapper" style={{ marginTop: 14, width: '100%' }}>
          <button
            type="button"
            onClick={onOpenForm}
            className="btn-12"
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <span>
              {t.contact.directMessageBtn}
              <svg
                width="15"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginLeft: 8,
                  transform: 'translateY(-1px)',
                }}
              >
                <path
                  d="M1 5h12M9 1l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    )
  }

  // Vista en PC: se mantiene intacta con escala tipográfica monumental y wipes
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <motion.button
        type="button"
        onClick={copy}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        data-cursor-label={copied ? t.contact.copied : t.contact.copyHint}
        aria-label={`${t.contact.copyHint}: ${EMAIL}`}
        style={{
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          padding: 0,
          margin: 0,
          textAlign: 'left',
          cursor: 'none',
          alignSelf: 'flex-start',
          maxWidth: '100%',
        }}
      >
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            fontFamily: 'var(--font-anton), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(27px, 6vw, 88px)',
            lineHeight: 1.06,
            letterSpacing: '0.005em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {/* base: contorno */}
          <span aria-hidden style={{ WebkitTextStroke: `1.4px ${INK}`, color: 'transparent' }}>
            {EMAIL}
          </span>
          {/* overlay: relleno que se revela con un wipe al hover */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              color: INK,
              clipPath: filled ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 0.75s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {EMAIL}
          </span>
        </span>
      </motion.button>

      {/* subrayado que se dibuja de izq. a der., al ritmo del relleno */}
      <span aria-hidden style={{ display: 'block', height: 2, background: HAIR, position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: INK,
            transformOrigin: 'left',
            transform: `scaleX(${hover ? 1 : 0})`,
            transition: 'transform 0.75s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </span>

      {/* Botón de mensaje directo animado (btn-12) */}
      <div className="btn-12-wrapper">
        <button
          type="button"
          onClick={onOpenForm}
          className="btn-12"
        >
          <span>
            {t.contact.directMessageBtn}
            <svg
              width="15"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginLeft: 8,
                transform: 'translateY(-1px)',
              }}
            >
              <path
                d="M1 5h12M9 1l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
}

function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const [isNameFocused, setIsNameFocused] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isMessageFocused, setIsMessageFocused] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  // Detectamos si es celular en tiempo de ejecución
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reseteamos el formulario al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setName('')
        setEmail('')
        setMessage('')
        setStatus('idle')
        setErrorMessage('')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Cerrar con tecla Escape (solo en desktop)
  useEffect(() => {
    if (!isOpen || isMobile) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, isMobile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setErrorMessage(data.error || t.contact.form.error)
      }
    } catch {
      setStatus('error')
      setErrorMessage(t.contact.form.error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
  }

  // Animaciones personalizadas según dispositivo: slide-up por resorte en móvil, y escalado en desktop
  const modalVariants = {
    hidden: isMobile
      ? { y: '100%', opacity: 1, scale: 1 }
      : { y: 25, opacity: 0, scale: 0.98 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: isMobile
        ? { type: 'spring' as const, damping: 25, stiffness: 220 }
        : { duration: 0.55, ease: EASE }
    },
    exit: isMobile
      ? { y: '100%', opacity: 1, scale: 1, transition: { type: 'spring' as const, damping: 30, stiffness: 250 } }
      : { y: 15, opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: isMobile ? 0 : 24,
            pointerEvents: 'none',
          }}
        >
          {/* Fondo desenfocado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(var(--ink-rgb) / 0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              pointerEvents: 'auto',
            }}
          />

          {/* Tarjeta del modal (Desktop) o Bottom Sheet (Celular) */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            drag={isMobile ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.75 }}
            onDragEnd={(e, info) => {
              if (isMobile && (info.offset.y > 120 || info.velocity.y > 500)) {
                onClose()
              }
            }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: isMobile ? 'none' : 480,
              background: 'var(--bg-elev)',
              border: isMobile ? 'none' : '1px solid var(--hair-strong)',
              borderTop: isMobile ? '1px solid var(--hair-strong)' : undefined,
              borderRadius: isMobile ? '24px 24px 0 0' : 16,
              padding: isMobile ? '20px 24px 48px 24px' : 'clamp(24px, 5vw, 40px)',
              boxShadow: 'var(--glass-shadow)',
              zIndex: 1,
              overflowY: 'auto',
              maxHeight: isMobile ? '92vh' : 'auto',
              pointerEvents: 'auto',
              touchAction: isMobile ? 'none' : 'auto',
            }}
          >
            {/* Capa de ruido de grano */}
            <div
              aria-hidden
              className="grain"
              style={{
                backgroundImage: GRAIN,
                zIndex: 0,
              }}
            />

            {/* Tirador del Bottom Sheet para celular */}
            {isMobile && (
              <div
                style={{
                  width: 36,
                  height: 5,
                  background: 'var(--hair-strong)',
                  borderRadius: 3,
                  margin: '0 auto 24px auto',
                  opacity: 0.7,
                }}
              />
            )}

            {/* Botón de cerrar */}
            <motion.button
              type="button"
              onClick={onClose}
              aria-label={t.contact.form.close}
              whileHover={{ scale: 1.08, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                top: isMobile ? 20 : 24,
                right: 24,
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                padding: 4,
                color: FAINT,
                cursor: 'pointer',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 10,
                letterSpacing: '0.1em',
                zIndex: 2,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = INK)}
              onMouseLeave={(e) => (e.currentTarget.style.color = FAINT)}
            >
              [ {t.contact.form.close.toUpperCase()} ]
            </motion.button>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: 280,
                  gap: 16,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: '1px solid var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: 'var(--ink)',
                    marginBottom: 8,
                  }}
                >
                  ✓
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: INK,
                    margin: 0,
                    maxWidth: 320,
                  }}
                >
                  {t.contact.form.success}
                </p>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05, color: INK, borderBottomColor: INK }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: MUTE,
                    marginTop: 16,
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--hair)',
                    cursor: 'pointer',
                    transition: 'color 0.25s ease, border-color 0.25s ease',
                  }}
                >
                  {t.contact.form.close}
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="show"
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 28,
                  position: 'relative',
                  zIndex: 1,
                  marginTop: isMobile ? 0 : 8,
                }}
              >
                {/* Título del Formulario */}
                <motion.h3
                  variants={itemVariants}
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-anton), sans-serif',
                    fontSize: 28,
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    color: INK,
                  }}
                >
                  {t.contact.form.title}
                </motion.h3>

                {/* Campo: Nombre */}
                <motion.div
                  variants={itemVariants}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    htmlFor="name"
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: FAINT,
                    }}
                  >
                    {t.contact.form.name}
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setIsNameFocused(true)}
                      onBlur={() => setIsNameFocused(false)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--hair)',
                        padding: '8px 0',
                        color: INK,
                        fontSize: 14,
                        fontFamily: 'var(--font-archivo), sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.4s ease',
                      }}
                    />
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isNameFocused ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: INK,
                        transformOrigin: 'left',
                      }}
                    />
                  </div>
                </motion.div>

                {/* Campo: Email */}
                <motion.div
                  variants={itemVariants}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    htmlFor="email"
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: FAINT,
                    }}
                  >
                    {t.contact.form.email}
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--hair)',
                        padding: '8px 0',
                        color: INK,
                        fontSize: 14,
                        fontFamily: 'var(--font-archivo), sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.4s ease',
                      }}
                    />
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isEmailFocused ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: INK,
                        transformOrigin: 'left',
                      }}
                    />
                  </div>
                </motion.div>

                {/* Campo: Mensaje */}
                <motion.div
                  variants={itemVariants}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    htmlFor="message"
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: FAINT,
                    }}
                  >
                    {t.contact.form.message.replace('...', '')}
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      placeholder={t.contact.form.message}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setIsMessageFocused(true)}
                      onBlur={() => setIsMessageFocused(false)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--hair)',
                        padding: '8px 0',
                        color: INK,
                        fontSize: 14,
                        fontFamily: 'var(--font-archivo), sans-serif',
                        outline: 'none',
                        resize: 'none',
                        transition: 'border-color 0.4s ease',
                      }}
                    />
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isMessageFocused ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: INK,
                        transformOrigin: 'left',
                      }}
                    />
                  </div>
                </motion.div>

                {/* Botón de envío e Indicador de error */}
                <motion.div
                  variants={itemVariants}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginTop: 10,
                  }}
                >
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-submit"
                  >
                    <span>
                      {status === 'submitting' ? t.contact.form.sending : t.contact.form.submit}
                    </span>
                  </button>

                  {status === 'error' && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontFamily: 'var(--font-jetbrains), monospace',
                        color: 'var(--logo)',
                        textAlign: 'center',
                      }}
                    >
                      {errorMessage || t.contact.form.error}
                    </p>
                  )}
                </motion.div>
              </motion.form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

type Glyph = {
  hex: string
  title: string
  path?: string
  render?: (fillColor: string, bgColor: string, hover: boolean) => React.ReactNode
}

/**
 * Color de marca legible sobre el fondo carbón. GitHub y X son casi negros y
 * desaparecerían al teñirse, así que caen de vuelta a tinta (igual que en About).
 */
function brandTint(hex: string) {
  const n = parseInt(hex, 16)
  const luminance = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)
  return luminance < 70 ? INK : `#${hex}`
}

/** Fila de red social: logo de marca, indenta, ilumina y revela la flecha al hover. */
function SocialRow({ label, url, icon }: { label: string; url: string; icon: Glyph }) {
  const [hover, setHover] = useState(false)
  const brand = brandTint(icon.hex)
  const fillColor = hover ? brand : INK
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        padding: '14px 0',
        paddingLeft: hover ? 14 : 0,
        borderTop: `1px solid ${hover ? INK : HAIR}`,
        textDecoration: 'none',
        cursor: 'none',
        transition: 'padding-left 0.55s cubic-bezier(0.16,1,0.3,1), border-color 0.5s ease',
      }}
    >
      {icon.render ? (
        icon.render(fillColor, BG, hover)
      ) : (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          style={{
            width: 19,
            height: 19,
            flexShrink: 0,
            fill: fillColor,
            opacity: hover ? 1 : 0.62,
            transition: 'fill 0.4s ease, opacity 0.4s ease',
          }}
        >
          {icon.path && <path d={icon.path} />}
        </svg>
      )}
      <span
        style={{
          fontSize: 'clamp(17px, 1.6vw, 21px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: hover ? INK : 'rgb(var(--ink-rgb) / 0.82)',
          transition: 'color 0.4s ease',
        }}
      >
        {label}
      </span>
      <span
        aria-hidden
        style={{
          marginLeft: 'auto',
          fontSize: 17,
          color: INK,
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateX(0)' : 'translateX(-10px)',
          transition: 'opacity 0.45s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        ↗
      </span>
    </a>
  )
}

export default function Contact() {
  const { t } = useLanguage()
  const [l1, fill, l3] = t.contact.headline
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Controlar la clase modal-open para restaurar el cursor y prevenir scroll
  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.classList.add('modal-open')
    } else {
      document.documentElement.classList.remove('modal-open')
    }
    return () => {
      document.documentElement.classList.remove('modal-open')
    }
  }, [isModalOpen])

  return (
    <section
      id="contacto"
      className="editorial-section cursor-none"
      style={{
        position: 'relative',
        overflow: 'hidden',
        color: INK,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // Medida ajustada para que la sección entera quepa en una pantalla: es el
        // cierre de la página y debe leerse de un vistazo, sin scroll interno.
        gap: 'clamp(22px, 3.2vh, 44px)',
        padding: 'clamp(48px, 8vh, 96px) clamp(24px, 4vw, 60px)',
        fontFamily: 'var(--font-archivo), sans-serif',
        // bruma cálida en la esquina opuesta a la de About: cierra la página por el otro lado
        background: `radial-gradient(125% 100% at 88% 108%, var(--bg-elev) 0%, ${BG} 62%)`,
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

      {/* TITULAR — misma mezcla de familias y escala dramática que el manifiesto */}
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
        style={{
          position: 'relative',
          zIndex: 2,
          margin: 0,
          fontWeight: 500,
          fontSize: 'clamp(40px, 6.2vw, 100px)',
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
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
      </motion.h2>

      {/* EMAIL — la pieza principal de la sección */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <EmailPiece onOpenForm={() => setIsModalOpen(true)} />
      </motion.div>

      {/* PIE DE SECCIÓN — bio corta a la izq., ficha mono a la der. */}
      <motion.div
        className="contact-grid"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.28 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <p
            style={{
              margin: 0,
              maxWidth: 460,
              fontSize: 'clamp(16px, 1.4vw, 20px)',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
              color: MUTE,
            }}
          >
            {t.contact.lead}
          </p>

          <MetaBlock label={t.contact.meta.availability}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {/* pulso: señal de "en vivo", igual que el reloj de About */}
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: INK,
                  boxShadow: `0 0 0 0 ${INK}`,
                  animation: 'aboutPulse 2s ease-out infinite',
                }}
              />
              {t.contact.available}
            </span>
          </MetaBlock>

          <MetaBlock label={t.contact.meta.local}>
            <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              {t.contact.location}
              <span aria-hidden style={{ color: HAIR }}>/</span>
              <LocalTime />
            </span>
          </MetaBlock>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: FAINT,
            }}
          >
            {t.contact.meta.elsewhere}
          </span>
          <div style={{ borderBottom: `1px solid ${HAIR}` }}>
            {SOCIALS.map((s) => (
              <SocialRow key={s.label} label={s.label} url={s.url} icon={s.icon} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modal del formulario de contacto */}
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
