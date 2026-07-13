'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { COBEOptions } from 'cobe'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { GRAIN } from '@/lib/grain'
import { Globe } from '@/components/ui/globe'

const NAME = 'JHONGDLP'

const EASE = [0.16, 1, 0.3, 1] as const

const INK = 'var(--ink)'
const BG = 'var(--bg)'
const HAIR = 'var(--hair)'
// Sin color de acento: el naranja queda reservado al logo (ver Header).

// El globo de cobe se pinta en WebGL: no ve el CSS, así que su paleta no puede
// salir de las variables del tema y hay que dársela a mano, una por tema.
const MARKERS: COBEOptions['markers'] = [
  { location: [40.4168, -3.7038], size: 0.08 }, // Madrid
  { location: [4.711, -74.0721], size: 0.08 }, // Bogotá
  { location: [19.4326, -99.1332], size: 0.07 }, // CDMX
  { location: [40.7128, -74.006], size: 0.09 }, // Nueva York
  { location: [-34.6037, -58.3816], size: 0.06 }, // Buenos Aires
  { location: [51.5074, -0.1278], size: 0.06 }, // Londres
  { location: [35.6762, 139.6503], size: 0.05 }, // Tokio
]

const GLOBE_BASE = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  mapSamples: 16000,
  markers: MARKERS,
} satisfies Partial<COBEOptions>

// El globo va SIEMPRE en contra del fondo: esfera de papel sobre el carbón, esfera de
// tinta sobre el papel. Es lo contrario de lo que pide el instinto, pero un globo del
// color de su fondo no es un globo: es un borrón que sólo existe por el relieve.

// Sobre fondo oscuro: la esfera es papel y la tierra se dibuja EN TINTA sobre ella.
// En cobe eso se consigue con mapBrightness < 1, porque el brillo de los puntos es un
// factor sobre baseColor: por debajo de 1 los oscurece en vez de encenderlos. `dark: 0`
// mantiene toda la esfera iluminada — un hemisferio en sombra sobre papel se lee como
// suciedad, no como volumen. El halo se queda cerca del fondo para que el borde no
// reviente en un aro de luz.
const GLOBE_ON_DARK: COBEOptions = {
  ...GLOBE_BASE,
  dark: 0,
  diffuse: 0.35,
  mapBrightness: 0.45,
  baseColor: [0.886, 0.863, 0.8],
  markerColor: [22 / 255, 19 / 255, 15 / 255],
  glowColor: [0.22, 0.21, 0.2],
}

// Sobre fondo claro: el mismo globo en negativo. Esfera casi negra, tierra encendida
// (mapBrightness alto sobre base oscura) y marcadores en el hueso del texto. `dark: 1`
// devuelve el terminador, que aquí sí suma: da esfera contra el papel.
const GLOBE_ON_LIGHT: COBEOptions = {
  ...GLOBE_BASE,
  dark: 1,
  diffuse: 1.2,
  mapBrightness: 6,
  baseColor: [0.16, 0.15, 0.14],
  markerColor: [233 / 255, 228 / 255, 214 / 255],
  glowColor: [0.82, 0.8, 0.75],
}

export default function Footer() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [hover, setHover] = useState(false)

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
        // El respiro inferior es deliberado: a cero, la firma queda apoyada al píxel
        // exacto y se lee como un recorte accidental en vez de como una decisión.
        padding: 'clamp(28px, 4vh, 44px) clamp(24px, 4vw, 60px) clamp(16px, 2.5vh, 28px)',
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

      {/* FILETE — sólo el botón de subida, alineado al filo derecho */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: 'clamp(24px, 4vh, 40px)',
          borderTop: `1px solid ${HAIR}`,
          paddingTop: 20,
        }}
      >
        <a
          href="#inicio"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '13px 22px',
            borderRadius: 999,
            // Botón perfilado que se invierte al hover: el pie no compite con el
            // contacto, pero la salida hacia arriba sí tiene que verse.
            border: `1px solid ${hover ? INK : HAIR}`,
            background: hover ? INK : 'transparent',
            color: hover ? BG : INK,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            cursor: 'none',
            transition: 'background 0.45s ease, color 0.45s ease, border-color 0.45s ease',
          }}
        >
          {t.footer.backToTop}
          <span
            aria-hidden
            style={{
              fontSize: 13,
              lineHeight: 1,
              color: hover ? BG : INK,
              transform: hover ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1), color 0.45s ease',
            }}
          >
            ↑
          </span>
        </a>
      </div>

      {/* FIRMA — el nombre a la escala del hero, asentado en el borde inferior.
          Anton deja 0.33em muertos bajo la línea base y las versales sólo bajan 0.01em:
          con interlineado 0.87 ese hueco desaparece y las letras se apoyan en el filo de
          la página en vez de flotar. El pelín de padding evita que la máscara —que existe
          para velar la entrada— muerda el remate superior. */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
          paddingTop: '0.04em',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ y: '18%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          // Por proporción visible y no por margen: la firma es lo último de la página y,
          // con un margen negativo, en pantallas cortas cae fuera del área de disparo y se
          // queda invisible para siempre — no queda scroll con el que rescatarla.
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{
            fontFamily: 'var(--font-anton), sans-serif',
            fontWeight: 400,
            // La misma medida exacta que el titular del hero: la página abre y cierra con
            // la misma palabra al mismo cuerpo, y el pie deja de leerse como una versión
            // hinchada del principio.
            display: 'inline-block',
            fontSize: 'clamp(80px, 17vw, 260px)',
            lineHeight: 0.86,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {NAME}
        </motion.div>
      </div>

      {/* GLOBO — asoma bajo la firma como una línea de horizonte: la caja mide menos que
          la esfera, así que sólo se ve el casquete superior y el resto queda cortado por
          el filo de la página. La máscara lo funde con el fondo para que el corte no se
          lea como un recorte. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        style={{
          position: 'relative',
          zIndex: 2,
          // La caja sigue siendo más baja que la esfera —la mitad, más o menos— para que
          // el globo se corte por el filo de la página y no se lea como una pelota
          // flotando; al crecer el diámetro hay que subir la caja con él o el casquete
          // visible se queda en una raya.
          height: 'clamp(200px, 30vw, 480px)',
          marginTop: 'clamp(8px, 2vh, 24px)',
          overflow: 'hidden',
          maskImage: 'radial-gradient(120% 100% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(120% 100% at 50% 0%, #000 60%, transparent 100%)',
        }}
      >
        {/* `key`: cobe compila su paleta al crear la escena y no la relee, así que
            el cambio de tema tiene que rehacer el globo, no reconfigurarlo. */}
        <Globe
          key={theme}
          config={theme === 'dark' ? GLOBE_ON_DARK : GLOBE_ON_LIGHT}
          className="max-w-[1100px]"
        />
      </motion.div>
    </footer>
  )
}
