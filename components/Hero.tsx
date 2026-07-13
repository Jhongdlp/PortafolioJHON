'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'
import { GRAIN } from '@/lib/grain'
import { useTheme } from '@/lib/theme'

export default function Hero() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  return (
    <section
      style={{
        // mismo fondo que la sección About (bruma radial cálida sobre el fondo base)
        background: 'radial-gradient(135% 105% at 12% -8%, var(--bg-elev) 0%, var(--bg) 60%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // deja sitio al header fijo que vive fuera de esta sección
        paddingTop: 65,
        fontFamily: 'var(--font-archivo), sans-serif',
        color: 'var(--ink)',
      }}
    >
      {/* grano */}
      <div
        aria-hidden
        className="grain"
        style={{
          backgroundImage: GRAIN,
          zIndex: 1,
        }}
      />

      {/* MASSIVE HEADLINE */}
      <div style={{ padding: '30px 30px 0', overflow: 'hidden' }}>
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-anton), sans-serif',
            fontWeight: 400,
            color: 'var(--ink)',
            fontSize: 'clamp(80px, 17vw, 260px)',
            lineHeight: 0.86,
            letterSpacing: '0.01em',
            margin: 0,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          JHONGDLP
        </motion.h1>
      </div>

      {/* MEDIA PANEL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'flex-end',
          padding: '16px 20px 20px',
          minHeight: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '68%',
            minHeight: 520,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Image
            src={theme === 'light' ? '/portrait-whitemode.png' : '/portrait-v4.png'}
            alt={t.hero.portraitAlt}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
