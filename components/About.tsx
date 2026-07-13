'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { useTheme, type Theme } from '@/lib/theme'
import { GRAIN } from '@/lib/grain'
import type { Dictionary } from '@/lib/dictionaries'
import {
  siNextdotjs,
  siReact,
  siTypescript,
  siTailwindcss,
  siFramer,
  siPython,
  siNodedotjs,
  siFastapi,
  siPostgresql,
  siSupabase,
  siDocker,
  siAnthropic,
  siLangchain,
  siHuggingface,
  siPytorch,
  siTensorflow,
  siScikitlearn,
  siNumpy,
  siPandas,
  siOpencv,
  siJupyter,
  siGit,
  siGithub,
  siVercel,
  siLinux,
  siPostman,
} from 'simple-icons'

// 👉 El texto traducible (ubicación, rol, capacidades, bio) vive en lib/dictionaries.ts
const TIMEZONE = 'America/Guayaquil'

type TechGroupKey = keyof Dictionary['about']['groups']

// Seaborn y Matplotlib no existen en simple-icons: se dibujan como tile de texto
// con su alias de import canónico, que es como se los reconoce en código.
const TEXT_TILES = {
  seaborn: { text: 'sns', hex: '4C72B0', title: 'Seaborn' },
  matplotlib: { text: 'plt', hex: '11557C', title: 'Matplotlib' },
}

// Rejilla de tecnologías — agrupada por disciplina. Añade/quita libremente.
// `group` es la clave de traducción: si añades un grupo, añádelo también en
// `about.groups` de lib/dictionaries.ts (TypeScript te lo exigirá).
type TechGroup = {
  group: TechGroupKey
  items: { icon: Glyph; label: string }[]
}

const TECH_GROUPS: TechGroup[] = [
  {
    group: 'Frontend',
    items: [
      { icon: siNextdotjs, label: 'Next.js' },
      { icon: siReact, label: 'React' },
      { icon: siTypescript, label: 'TypeScript' },
      { icon: siTailwindcss, label: 'Tailwind' },
      { icon: siFramer, label: 'Framer Motion' },
    ],
  },
  {
    group: 'Backend',
    items: [
      { icon: siPython, label: 'Python' },
      { icon: siNodedotjs, label: 'Node.js' },
      { icon: siFastapi, label: 'FastAPI' },
      { icon: siPostgresql, label: 'PostgreSQL' },
      { icon: siSupabase, label: 'Supabase' },
      { icon: siDocker, label: 'Docker' },
    ],
  },
  {
    group: 'AI & Data',
    items: [
      { icon: siAnthropic, label: 'Claude / LLMs' },
      { icon: siLangchain, label: 'LangChain' },
      { icon: siHuggingface, label: 'Hugging Face' },
      { icon: siPytorch, label: 'PyTorch' },
      { icon: siTensorflow, label: 'TensorFlow' },
      { icon: siScikitlearn, label: 'scikit-learn' },
      { icon: siNumpy, label: 'NumPy' },
      { icon: siPandas, label: 'pandas' },
      { icon: TEXT_TILES.seaborn, label: 'Seaborn' },
      { icon: TEXT_TILES.matplotlib, label: 'Matplotlib' },
      { icon: siOpencv, label: 'OpenCV' },
      { icon: siJupyter, label: 'Jupyter' },
    ],
  },
  {
    group: 'Tooling',
    items: [
      { icon: siGit, label: 'Git' },
      { icon: siGithub, label: 'GitHub' },
      { icon: siVercel, label: 'Vercel' },
      { icon: siPostman, label: 'Postman' },
      { icon: siLinux, label: 'Linux' },
    ],
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

// Paleta cálida — tinta y bruma, no blanco/negro plano
// Los valores viven en el tema (globals.css) y cambian con él: aquí sólo quedan
// los nombres. Ver :root / :root[data-theme="light"].
const INK = 'var(--ink)'                     // texto
const BG = 'var(--bg)'                       // fondo de la sección
const MUTE = 'var(--mute)'
const MUTE_STRONG = 'var(--mute-strong)'
const FAINT = 'var(--faint)'
const HAIR = 'var(--hair)'
// Sin color de acento: la página entera es tinta sobre carbón y el naranja queda
// reservado al logo. Lo que antes destacaba en color, ahora destaca en luz.

// Grano sutil para textura (artístico, minimalista)
// Variantes — el trigger vive en el contenedor (en su sitio, sí intersecta);
// los hijos animan por variante, así la máscara nunca bloquea al observer.
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

/** Palabra de contorno hueco cuyo relleno se "pinta" de izq. a der. */
function FillWord({ children }: { children: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {/* base: contorno */}
      <span aria-hidden style={{ WebkitTextStroke: `1.6px ${INK}`, color: 'transparent' }}>
        {children}
      </span>
      {/* overlay: relleno que se revela con un wipe */}
      <motion.span variants={fillVariant} style={{ position: 'absolute', inset: 0, color: INK }}>
        {children}
      </motion.span>
    </span>
  )
}

/** Etiqueta mono + valor apilados. */
function MetaBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        {value}
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
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {/* pulso: señal de "en vivo" */}
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
      {/* tabular-nums evita el temblor de ancho al pasar los segundos */}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {now ?? '--:--:--'} <span style={{ color: FAINT }}>GMT-5</span>
      </span>
    </span>
  )
}

type Glyph = { hex: string; title: string; path?: string; text?: string }

// La tinta, otra vez, pero en hexadecimal literal: brandTint compone colores con
// sufijo de alfa (`${brand}66`) y eso exige un hex de verdad — un `var(--ink)66`
// no es color válido. Si cambia --ink en globals.css, cambia también aquí.
const INK_HEX: Record<Theme, string> = { dark: '#E9E4D6', light: '#16130F' }

/**
 * Color de marca legible sobre el fondo del tema. El riesgo se invierte con él:
 * sobre carbón se pierden las marcas casi negras (GitHub, Next.js, Vercel) y
 * sobre papel se blanquean las muy luminosas (Hugging Face, Linux, Tailwind).
 *
 * Las oscuras se aplastan a tinta —su marca ES el negro, no hay tono que salvar—,
 * pero las claras se bajan de luz conservando el tono: un amarillo de Hugging Face
 * convertido en tinta dejaría de ser Hugging Face.
 */
function brandTint(hex: string, theme: Theme) {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  if (theme === 'dark') return luminance < 70 ? INK_HEX.dark : `#${hex}`

  if (luminance > LIGHT_MAX_LUMA) {
    const k = LIGHT_MAX_LUMA / luminance
    const hx = (c: number) => Math.round(c * k).toString(16).padStart(2, '0')
    return `#${hx(r)}${hx(g)}${hx(b)}`
  }
  return `#${hex}`
}

// Techo de luminancia de un glifo sobre papel: por encima, el icono se disuelve
// en el fondo. Bajarlo oscurece más las marcas claras.
const LIGHT_MAX_LUMA = 168

/** Tile de tecnología: glifo en tinta que se tiñe con su color de marca al hover. */
function TechTile({
  icon,
  label,
  onHover,
}: {
  icon: Glyph
  label: string
  onHover: (label: string | null) => void
}) {
  const [hover, setHover] = useState(false)
  const { theme } = useTheme()
  const brand = brandTint(icon.hex, theme)
  const tint = hover ? brand : INK
  return (
    <div
      onMouseEnter={() => {
        setHover(true)
        onHover(label)
      }}
      onMouseLeave={() => {
        setHover(false)
        onHover(null)
      }}
      title={label}
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 42,
        height: 42,
        borderRadius: 11,
        cursor: 'none',
        border: `1px solid ${hover ? `${brand}66` : HAIR}`,
        background: hover ? `${brand}14` : 'rgb(var(--ink-rgb) / 0.03)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        transition:
          'transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, border-color 0.4s ease',
      }}
    >
      {icon.path ? (
        <svg
          role="img"
          aria-label={icon.title}
          viewBox="0 0 24 24"
          style={{
            width: 20,
            height: 20,
            fill: tint,
            opacity: hover ? 1 : 0.7,
            transition: 'fill 0.4s ease, opacity 0.4s ease',
          }}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span
          aria-label={icon.title}
          role="img"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 12,
            letterSpacing: '-0.02em',
            color: tint,
            opacity: hover ? 1 : 0.7,
            transition: 'color 0.4s ease, opacity 0.4s ease',
          }}
        >
          {icon.text}
        </span>
      )}
    </div>
  )
}

/** Rejilla compacta de stack para la columna de metadatos; el nombre se lee al hover. */
function TechStack() {
  const [active, setActive] = useState<string | null>(null)
  const { t } = useLanguage()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TECH_GROUPS.map((g) => (
        <div key={g.group} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: MUTE_STRONG,
            }}
          >
            {t.about.groups[g.group]}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {g.items.map((it) => (
              <TechTile key={it.label} icon={it.icon} label={it.label} onHover={setActive} />
            ))}
          </div>
        </div>
      ))}
      {/* lectura del nombre al hover — altura fija para que la rejilla no salte */}
      <span
        style={{
          minHeight: 14,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          letterSpacing: '0.04em',
          color: active ? INK : 'transparent',
          transition: 'color 0.3s ease',
        }}
      >
        {active ?? '—'}
      </span>
    </div>
  )
}

/** Fila de capacidad con micro-interacción: indenta, ilumina y revela la flecha. */
function CapabilityRow({ label, index, last }: { label: string; index: number; last: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.24 + index * 0.07 }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'baseline',
        gap: 18,
        padding: '17px 0',
        paddingLeft: hover ? 16 : 0,
        borderBottom: last ? `1px solid ${HAIR}` : 'none',
        transition: 'padding-left 0.55s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'none',
      }}
    >
      {/* hairline superior que se ilumina al hover */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: hover ? INK : HAIR,
          transformOrigin: 'left',
          transition: 'background 0.5s ease',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          letterSpacing: '0.1em',
          color: hover ? INK : FAINT,
          minWidth: 26,
          transition: 'color 0.4s ease',
        }}
      >
        0{index + 1}
      </span>
      <span
        style={{
          fontSize: 'clamp(19px, 2vw, 27px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: hover ? INK : 'rgb(var(--ink-rgb) / 0.82)',
          transition: 'color 0.4s ease',
        }}
      >
        {label}
      </span>
      {/* flecha que aparece al hover */}
      <span
        style={{
          marginLeft: 'auto',
          fontSize: 18,
          color: INK,
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateX(0)' : 'translateX(-10px)',
          transition: 'opacity 0.45s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        ↗
      </span>
    </motion.div>
  )
}

export default function About() {
  const { t } = useLanguage()
  const [l1, fill, l3, l4] = t.about.manifesto

  return (
    <section
      className="editorial-section cursor-none"
      style={{
        position: 'relative',
        overflow: 'hidden',
        color: INK,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(48px, 8vh, 96px)',
        padding: 'clamp(96px, 15vh, 168px) clamp(24px, 4vw, 60px)',
        fontFamily: 'var(--font-archivo), sans-serif',
        // bruma radial cálida que funde con el fondo base — da profundidad sin costuras
        background: `radial-gradient(135% 105% at 12% -8%, var(--bg-elev) 0%, ${BG} 60%)`,
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

      {/* MANIFESTO — mezcla de familias, escala dramática */}
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
          fontSize: 'clamp(46px, 9vw, 156px)',
          lineHeight: 0.9,
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
        <LineReveal>{l4}</LineReveal>
      </motion.h2>

      {/* LOWER GRID — dos columnas en desktop, una sola en móvil (ver .about-grid) */}
      <div className="about-grid" style={{ position: 'relative', zIndex: 2 }}>
        {/* Col izquierda — metadatos */}
        <motion.div
          className="about-meta"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 26 }}
        >
          <MetaBlock
            label={t.about.meta.location}
            value={
              <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                {t.about.location}
                <span aria-hidden style={{ color: HAIR }}>/</span>
                <LocalTime />
              </span>
            }
          />
          <MetaBlock label={t.about.meta.role} value={t.about.role} />
          <MetaBlock label={t.about.meta.stack} value={<TechStack />} />
        </motion.div>

        {/* Col derecha — bio + capacidades numeradas */}
        <div className="about-body" style={{ display: 'flex', flexDirection: 'column', gap: 46 }}>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.16 }}
            style={{
              margin: 0,
              maxWidth: 560,
              fontSize: 'clamp(17px, 1.5vw, 22px)',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
            }}
          >
            {t.about.bio.lead}{' '}
            <span style={{ color: MUTE }}>{t.about.bio.aside}</span>
          </motion.p>

          {/* Capacidades */}
          <div style={{ borderTop: `1px solid ${HAIR}` }}>
            {t.about.capabilities.map((cap, i) => (
              <CapabilityRow
                key={cap}
                label={cap}
                index={i}
                last={i === t.about.capabilities.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
