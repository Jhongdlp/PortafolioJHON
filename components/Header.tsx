'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { LOCALES, type Locale } from '@/lib/dictionaries'

// Ver el bloque de tema en globals.css: estos nombres cambian de valor con él.
const INK = 'var(--ink)'
const MUTE = 'var(--mute-strong)'
const BG = 'var(--bg)'
// El naranja ya no es un acento de interfaz: sobrevive sólo como color de marca
// dentro del logo. Todo lo demás de la página vive en tinta sobre el fondo.
// (Sobre papel el naranja se profundiza para no quedarse en 2.9:1 — ver --logo.)
const LOGO = 'var(--logo)'

// Destinos de t.nav.links, en el mismo orden (ver lib/dictionaries.ts).
const NAV_HREFS = ['#proyectos', '#sobre-mi', '#contacto']

// A partir de aquí puede esconderse al bajar
const HIDE_AFTER = 120
// Movimiento mínimo para considerar un cambio de dirección
const DIR_THRESHOLD = 6

/** Conmutador ES/EN — un solo control con las dos opciones a la vista. */
function LanguageSwitch() {
  const { locale, setLocale, t } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 3,
        borderRadius: 999,
        border: '1px solid var(--hair-strong)',
        fontFamily: 'var(--font-jetbrains), monospace',
      }}
    >
      {LOCALES.map((code: Locale) => {
        const active = code === locale
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            style={{
              appearance: 'none',
              border: 'none',
              cursor: 'none',
              padding: '5px 11px',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: active ? INK : 'transparent',
              color: active ? BG : 'rgb(var(--ink-rgb) / 0.55)',
              transition: 'background 0.35s ease, color 0.35s ease',
            }}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Conmutador de tema. Un solo botón, no dos: el tema es binario y el icono ya
 * dice a dónde vas (sol = te llevo al claro), así que un segmentado como el de
 * idioma sólo añadiría ancho en una barra que en móvil ya va justa.
 *
 * Los DOS iconos se pintan siempre y es CSS —no React— quien decide cuál se ve,
 * a partir del data-theme del <html>. Así el botón sale correcto en el primer
 * pintado: si lo decidiera el estado de React, quien tiene guardado el claro
 * vería el icono equivocado hasta que hidratara.
 */
function ThemeSwitch() {
  const { toggle } = useTheme()
  const { t } = useLanguage()

  return (
    <button
      type="button"
      // El tema nuevo se derrama desde el centro del propio botón: el gesto sale
      // de donde lo has pulsado, no de una esquina arbitraria.
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      // Etiqueta de la ACCIÓN, no del estado: no depende de React y por tanto no
      // puede desincronizarse del icono durante la hidratación.
      aria-label={t.nav.theme}
      title={t.nav.theme}
      style={{
        appearance: 'none',
        display: 'grid',
        placeItems: 'center',
        width: 34,
        height: 34,
        borderRadius: 999,
        background: 'transparent',
        border: '1px solid var(--hair-strong)',
        color: INK,
        cursor: 'none',
        padding: 0,
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgb(var(--ink-rgb) / 0.07)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Sol: visible en oscuro, porque es a donde te lleva pulsar. */}
      <svg
        className="theme-icon-sun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
      </svg>
      {/* Luna: visible en claro. */}
      <svg
        className="theme-icon-moon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.5 14.3A8.6 8.6 0 1 1 9.7 3.5a6.9 6.9 0 0 0 10.8 10.8Z" />
      </svg>
    </button>
  )
}

export default function Header() {
  const [hidden, setHidden] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  const { t } = useLanguage()

  // Mismo corte que el resto del sitio (ver globals.css).
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Al girar a horizontal el menú sobra: los enlaces vuelven a la barra.
  useEffect(() => {
    if (!isMobile) setOpen(false)
  }, [isMobile])

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY.current

      // Ignora micro-movimientos para que no parpadee
      if (Math.abs(dy) > DIR_THRESHOLD) {
        // Baja → se esconde. Sube → reaparece.
        setHidden(dy > 0 && y > HIDE_AFTER)
        lastY.current = y
      }
      if (y <= HIDE_AFTER) setHidden(false)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Con el menú abierto: nada de scroll detrás, y Escape cierra.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const logo = (
    <svg
      width="38"
      height="31"
      viewBox="404 422 449 369"
      role="img"
      aria-label="JHONGDLP"
      style={{ display: 'block' }}
    >
      <path
        fill={LOGO}
        d="m591.52 426.65c-0.47 0.38-0.79 51.8-0.7 114.27 0.08 66.07 0.52 113.16 1.03 112.58 0.49-0.55 5.04-8.87 10.12-18.5 5.08-9.62 13.58-25.06 18.88-34.31 5.31-9.24 12.69-20.94 16.41-26l6.76-9.19-0.52-139c-39.63-0.41-51.52-0.23-51.98 0.15zm142.98 121.73c-3.85 0.73-10.83 2.58-15.5 4.11-4.67 1.54-12.77 4.94-18 7.56-5.22 2.62-12.65 6.98-16.5 9.69-3.85 2.71-10.6 8.52-15 12.92-4.4 4.39-11.04 12.23-14.76 17.41-3.72 5.19-9.64 15.28-13.15 22.43-3.52 7.15-9.64 21.55-13.6 32-3.96 10.45-9.35 23.5-11.97 29-2.63 5.5-7.64 13.79-11.15 18.42-3.5 4.64-9.52 10.97-13.37 14.07-3.85 3.11-9.47 7.03-12.5 8.72-3.02 1.69-8.76 4.25-12.75 5.68-3.99 1.44-11.41 3.15-16.5 3.8-7.16 0.92-11.34 0.92-18.5 0-5.09-0.65-12.96-2.53-17.5-4.17-4.54-1.63-11.17-4.84-14.75-7.12-3.58-2.29-8.7-6.01-11.39-8.28-2.69-2.27-7.03-6.82-9.64-10.12-2.61-3.3-6.57-9.6-8.8-14-2.23-4.4-4.97-11.83-6.1-16.5-1.13-4.67-2.06-9.51-2.06-10.75l-0.01-2.25h-53c0.89 10.46 1.78 16.65 2.55 20.5 0.77 3.85 2.56 10.6 3.99 15 1.42 4.4 4.09 11.15 5.93 15 1.85 3.85 6.15 11.28 9.57 16.5 3.89 5.95 10 13.25 16.34 19.54 5.56 5.52 13.5 12.33 17.62 15.14 4.13 2.81 11.55 7.14 16.5 9.64 4.95 2.5 13.28 5.95 18.5 7.67 5.23 1.72 13.78 3.77 19 4.56 5.23 0.79 15.35 1.45 22.5 1.45 7.15 0.01 16.94-0.66 21.75-1.49 4.81-0.83 12.46-2.69 17-4.14 4.54-1.45 11.63-4.17 15.75-6.06 4.13-1.88 9.75-4.84 12.5-6.58 2.75-1.73 8.38-5.7 12.5-8.82 4.13-3.12 10.68-8.99 14.56-13.04 3.88-4.05 9.12-10.29 11.65-13.87 2.52-3.58 6.15-9.2 8.07-12.5 1.92-3.3 5.3-10.27 7.52-15.5 2.22-5.23 6.72-18.05 10.02-28.5 3.29-10.45 7.42-22.15 9.17-26 1.76-3.85 5.24-10.15 7.74-14 2.51-3.85 7.53-10.08 11.16-13.84 3.64-3.76 9.53-8.8 13.11-11.19 3.58-2.4 9.42-5.57 13-7.05 3.58-1.48 8.75-3.39 11.5-4.24 4.13-1.29 13.87-1.65 56.26-2.12l51.26-0.56c-5.2-7.75-9.36-12.87-12.61-16.38-3.25-3.51-9.28-8.92-13.41-12.03-4.12-3.11-11.78-7.76-17-10.34-5.22-2.58-14-5.89-19.5-7.35-8.31-2.21-12.62-2.71-25.5-2.99-10.02-0.22-17.98 0.12-22.5 0.97zm8.5 133.12v21.5c45.25 0 50.99 0.28 50.98 1.25-0.02 0.69-1.34 3.27-2.95 5.75-1.61 2.48-5.09 6.61-7.73 9.19-2.64 2.58-7.5 6.31-10.8 8.29-3.3 1.97-8.92 4.51-12.5 5.63-4.49 1.41-10.8 2.25-20.42 2.72l-13.92 0.67c-2.69 6.2-7.34 17.11-12.06 28.25-4.73 11.14-8.6 20.81-8.6 21.5 0 0.98 5.35 1.11 25.25 0.57 19.38-0.52 27.34-1.13 34.25-2.64 4.95-1.08 12.15-3.16 16-4.62 3.85-1.46 9.92-4.26 13.5-6.21 3.58-1.96 9.42-5.71 13-8.35 3.58-2.63 9.44-7.87 13.02-11.64 3.59-3.77 8.51-9.78 10.94-13.36 2.42-3.58 6.11-10.1 8.19-14.5 2.08-4.4 4.98-12.05 6.45-17 2.42-8.15 2.71-10.87 3.04-28.75l0.36-19.75h-106z"
      />
    </svg>
  )

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        // Con el menú desplegado la barra no puede esconderse: se llevaría la X.
        animate={{ opacity: 1, y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          background: BG,
          borderBottom: open ? '1px solid transparent' : '1px solid var(--hair)',
          fontFamily: 'var(--font-archivo), sans-serif',
          color: INK,
        }}
      >
        <nav
          style={
            isMobile
              ? // En móvil los tres enlaces no caben en la barra (se partían en dos
                // líneas): salen de aquí y se van al desplegable. Queda logo | idioma + menú.
                { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }
              : { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '20px 34px' }
          }
        >
          {!isMobile && (
            <div
              style={{
                display: 'flex',
                gap: 26,
                fontSize: 12,
                letterSpacing: '0.14em',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              {t.nav.links.map((link, i) => (
                <a
                  key={link}
                  href={NAV_HREFS[i]}
                  // Sin acento, el hover se marca subiendo de tinta: el enlace en reposo
                  // va a media luz y se enciende del todo bajo el puntero.
                  style={{ cursor: 'none', textDecoration: 'none', transition: 'color 0.2s', color: MUTE }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = INK)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = MUTE)}
                >
                  {link}
                </a>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{logo}</div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: isMobile ? 14 : 22,
            }}
          >
            <LanguageSwitch />
            <ThemeSwitch />
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-label={t.nav.menu}
              aria-expanded={open}
              aria-controls="menu-movil"
              style={{
                appearance: 'none',
                background: 'transparent',
                border: 'none',
                // 44px de zona táctil sobre 22px de trazo: el mínimo cómodo para el pulgar.
                padding: 11,
                margin: -11,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 5,
                cursor: 'none',
              }}
            >
              {/* Las dos barras giran en X: el mismo control abre y cierra. */}
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 3.3 : 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: 22, height: 1.6, background: INK, display: 'block' }}
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -3.3 : 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: 22, height: 1.6, background: INK, display: 'block' }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              background: BG,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 20px calc(env(safe-area-inset-bottom) + 32px)',
              fontFamily: 'var(--font-archivo), sans-serif',
            }}
          >
            {t.nav.links.map((link, i) => (
              <motion.a
                key={link}
                href={NAV_HREFS[i]}
                // El salto de ancla nativo ocurriría con el body aún bloqueado y se
                // perdería: primero se cierra el menú, y ya sin bloqueo se navega.
                onClick={(e) => {
                  e.preventDefault()
                  setOpen(false)
                  const target = document.querySelector(NAV_HREFS[i])
                  requestAnimationFrame(() => target?.scrollIntoView({ block: 'start' }))
                }}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'block',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--hair)',
                  fontFamily: 'var(--font-anton), sans-serif',
                  fontSize: 'clamp(38px, 12vw, 60px)',
                  lineHeight: 1.06,
                  letterSpacing: '0.01em',
                  textTransform: 'uppercase',
                  color: INK,
                  textDecoration: 'none',
                }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
