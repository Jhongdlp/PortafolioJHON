'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { GRAIN } from '@/lib/grain'

const EASE = [0.16, 1, 0.3, 1] as const

const INK = 'var(--ink)'
const BG = 'var(--bg)'
const MUTE = 'var(--mute)'
// Sin color de acento: el naranja queda reservado al logo (ver Header).

// Los mismos destinos que la barra: el pie es su reflejo al final de la página.
const NAV_HREFS = ['#proyectos', '#sobre-mi', '#contacto']

// Recorte de PROJECTS (ver Projects.tsx): los que tienen sitio propio y el caso de
// estudio. La lista de allí es el carrusel entero; aquí sólo caben cuatro.
const WORK = [
  { label: 'Raccoony', href: '/raccoony' },
  { label: 'TensorMesh', href: 'https://tensormesh.vercel.app/' },
  { label: 'Bizzio', href: 'https://bizzio.shop/' },
  { label: 'InsideEBB', href: 'https://insideebb.com/en' },
]

// Copia corta de SOCIALS (Contact.tsx). Se duplica a propósito: importarlo de allí
// arrastraría todo el formulario al bundle de /raccoony, que no lo monta.
const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/Jhongdlp' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jhon-guadalupe-2a4194382/' },
  { label: 'X', href: 'https://x.com/jhongdlp' },
]

const EMAIL = 'hello@jhongdlp.com'

/** Monograma del header a mayor cuerpo: el pie firma con la misma marca. */
function Mark() {
  return (
    <svg width="40" height="33" viewBox="404 422 449 369" role="img" aria-label="JHONGDLP" style={{ display: 'block' }}>
      <path
        fill={INK}
        d="m591.52 426.65c-0.47 0.38-0.79 51.8-0.7 114.27 0.08 66.07 0.52 113.16 1.03 112.58 0.49-0.55 5.04-8.87 10.12-18.5 5.08-9.62 13.58-25.06 18.88-34.31 5.31-9.24 12.69-20.94 16.41-26l6.76-9.19-0.52-139c-39.63-0.41-51.52-0.23-51.98 0.15zm142.98 121.73c-3.85 0.73-10.83 2.58-15.5 4.11-4.67 1.54-12.77 4.94-18 7.56-5.22 2.62-12.65 6.98-16.5 9.69-3.85 2.71-10.6 8.52-15 12.92-4.4 4.39-11.04 12.23-14.76 17.41-3.72 5.19-9.64 15.28-13.15 22.43-3.52 7.15-9.64 21.55-13.6 32-3.96 10.45-9.35 23.5-11.97 29-2.63 5.5-7.64 13.79-11.15 18.42-3.5 4.64-9.52 10.97-13.37 14.07-3.85 3.11-9.47 7.03-12.5 8.72-3.02 1.69-8.76 4.25-12.75 5.68-3.99 1.44-11.41 3.15-16.5 3.8-7.16 0.92-11.34 0.92-18.5 0-5.09-0.65-12.96-2.53-17.5-4.17-4.54-1.63-11.17-4.84-14.75-7.12-3.58-2.29-8.7-6.01-11.39-8.28-2.69-2.27-7.03-6.82-9.64-10.12-2.61-3.3-6.57-9.6-8.8-14-2.23-4.4-4.97-11.83-6.1-16.5-1.13-4.67-2.06-9.51-2.06-10.75l-0.01-2.25h-53c0.89 10.46 1.78 16.65 2.55 20.5 0.77 3.85 2.56 10.6 3.99 15 1.42 4.4 4.09 11.15 5.93 15 1.85 3.85 6.15 11.28 9.57 16.5 3.89 5.95 10 13.25 16.34 19.54 5.56 5.52 13.5 12.33 17.62 15.14 4.13 2.81 11.55 7.14 16.5 9.64 4.95 2.5 13.28 5.95 18.5 7.67 5.23 1.72 13.78 3.77 19 4.56 5.23 0.79 15.35 1.45 22.5 1.45 7.15 0.01 16.94-0.66 21.75-1.49 4.81-0.83 12.46-2.69 17-4.14 4.54-1.45 11.63-4.17 15.75-6.06 4.13-1.88 9.75-4.84 12.5-6.58 2.75-1.73 8.38-5.7 12.5-8.82 4.13-3.12 10.68-8.99 14.56-13.04 3.88-4.05 9.12-10.29 11.65-13.87 2.52-3.58 6.15-9.2 8.07-12.5 1.92-3.3 5.3-10.27 7.52-15.5 2.22-5.23 6.72-18.05 10.02-28.5 3.29-10.45 7.42-22.15 9.17-26 1.76-3.85 5.24-10.15 7.74-14 2.51-3.85 7.53-10.08 11.16-13.84 3.64-3.76 9.53-8.8 13.11-11.19 3.58-2.4 9.42-5.57 13-7.05 3.58-1.48 8.75-3.39 11.5-4.24 4.13-1.29 13.87-1.65 56.26-2.12l51.26-0.56c-5.2-7.75-9.36-12.87-12.61-16.38-3.25-3.51-9.28-8.92-13.41-12.03-4.12-3.11-11.78-7.76-17-10.34-5.22-2.58-14-5.89-19.5-7.35-8.31-2.21-12.62-2.71-25.5-2.99-10.02-0.22-17.98 0.12-22.5 0.97zm8.5 133.12v21.5c45.25 0 50.99 0.28 50.98 1.25-0.02 0.69-1.34 3.27-2.95 5.75-1.61 2.48-5.09 6.61-7.73 9.19-2.64 2.58-7.5 6.31-10.8 8.29-3.3 1.97-8.92 4.51-12.5 5.63-4.49 1.41-10.8 2.25-20.42 2.72l-13.92 0.67c-2.69 6.2-7.34 17.11-12.06 28.25-4.73 11.14-8.6 20.81-8.6 21.5 0 0.98 5.35 1.11 25.25 0.57 19.38-0.52 27.34-1.13 34.25-2.64 4.95-1.08 12.15-3.16 16-4.62 3.85-1.46 9.92-4.26 13.5-6.21 3.58-1.96 9.42-5.71 13-8.35 3.58-2.63 9.44-7.87 13.02-11.64 3.59-3.77 8.51-9.78 10.94-13.36 2.42-3.58 6.11-10.1 8.19-14.5 2.08-4.4 4.98-12.05 6.45-17 2.42-8.15 2.71-10.87 3.04-28.75l0.36-19.75h-106z"
      />
    </svg>
  )
}

/** Enlace del pie: apagado en reposo, tinta plena al pasar. */
function FooterLink({ label, href }: { label: string; href: string }) {
  const [hover, setHover] = useState(false)
  const external = href.startsWith('http') || href.startsWith('mailto:')

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        color: hover ? INK : MUTE,
        fontSize: 13.5,
        lineHeight: 1.2,
        textDecoration: 'none',
        cursor: 'none',
        width: 'fit-content',
        transition: 'color 0.25s ease',
      }}
    >
      {label}
    </a>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const pathname = usePathname()
  // Mismo criterio que el header: dentro de la portada las anclas son anclas; fuera,
  // hay que volver a la raíz antes de saltar a la sección.
  const hrefFor = (hash: string) => (pathname === '/' ? hash : `/${hash}`)

  const columns = [
    {
      title: t.footer.nav,
      items: t.nav.links.map((label, i) => ({ label, href: hrefFor(NAV_HREFS[i]) })),
    },
    { title: t.footer.work, items: WORK },
    { title: t.footer.elsewhere, items: [...SOCIAL, { label: t.footer.email, href: `mailto:${EMAIL}` }] },
  ]

  return (
    <footer
      className="editorial-section cursor-none"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        background: BG,
        color: INK,
        fontFamily: 'var(--font-archivo), sans-serif',
        padding: 'clamp(64px, 10vh, 110px) clamp(24px, 4vw, 60px) 0',
      }}
    >
      <div aria-hidden className="grain" style={{ backgroundImage: GRAIN, zIndex: 1 }} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        {/* CABECERA DEL PIE — marca y lema a la izquierda, columnas de enlaces a la
            derecha. `flexWrap` es toda la lógica responsive que hace falta: al no caber,
            las columnas caen bajo el lema solas, sin media query ni matchMedia. */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'clamp(40px, 6vw, 80px)',
          }}
        >
          <div style={{ maxWidth: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Mark />
              <span
                style={{
                  fontFamily: 'var(--font-anton), sans-serif',
                  fontSize: 30,
                  lineHeight: 1,
                  letterSpacing: '0.01em',
                  textTransform: 'uppercase',
                }}
              >
                JHONGDLP
              </span>
            </div>
            <p style={{ margin: '18px 0 0', color: MUTE, fontSize: 13, lineHeight: 1.55, maxWidth: 300 }}>
              {t.footer.tagline}
            </p>
          </div>

          <nav
            aria-label={t.footer.nav}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 88px)' }}
          >
            {columns.map((col) => (
              <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 120 }}>
                <h3
                  style={{
                    margin: '0 0 2px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 10.5,
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: INK,
                  }}
                >
                  {col.title}
                </h3>
                {col.items.map((item) => (
                  <FooterLink key={item.label} {...item} />
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* PIE DEL PIE — sólo la firma, al filo izquierdo. */}
        <div style={{ marginTop: 'clamp(56px, 9vh, 104px)', color: MUTE, fontSize: 12 }}>
          JHONGDLP © {new Date().getFullYear()}
        </div>
      </motion.div>

      {/* GRABADO — San Francisco de Quito a sangre, apoyado en el filo inferior de la
          página: los márgenes negativos cancelan el padding lateral del pie para que el
          edificio llegue de borde a borde. El margen superior negativo lo sube hasta que
          las torres asoman por detrás de la línea de firma, como en la referencia. En
          claro va en `multiply` para que el relleno blanco caiga sobre el papel y sólo
          quede la línea; en oscuro se deja tal cual, que ahí el blanco ES el dibujo. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        className="footer-engraving"
        style={{
          position: 'relative',
          zIndex: 1,
          // El grabado se recorta, no se encoge: la caja fija el alto y `cover` decide qué
          // sobra. En pantallas estrechas sobra ancho —el edificio se sale por los dos
          // lados con la portada centrada, que es el efecto buscado— y en muy anchas sobra
          // alto, de ahí `top`: lo que se pierde es la base, nunca las torres.
          // (El PNG viene recortado 152px por la izquierda para que la portada caiga en el
          // centro exacto; el original sin recortar está en ~/Descargas.)
          height: 'clamp(230px, 38vw, 620px)',
          marginTop: 'clamp(-150px, -7vw, -32px)',
          marginInline: 'calc(-1 * clamp(24px, 4vw, 60px))',
        }}
      >
        <Image
          // Dos grabados, no un filtro: el de claro es papel con línea de tinta y el de
          // oscuro es piedra con línea de plata. Invertir uno para hacer el otro deja el
          // dibujo sucio, así que cada tema tiene el suyo.
          src={theme === 'dark' ? '/san-francisco-dark.png' : '/san-francisco-light.png'}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top', userSelect: 'none' }}
        />
      </motion.div>
    </footer>
  )
}
