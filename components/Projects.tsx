'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useCallback, useEffect, memo } from 'react'
import { useLanguage } from '@/lib/i18n'

// El orden de la carrusela; la copia de cada proyecto vive en lib/dictionaries.ts
const PROJECTS = [
  { codename: 'BIZZIO', image: '/projects/bizzio.webp', url: 'https://bizzio.shop/', host: 'bizzio.shop' },
  { codename: 'UTITECH', image: '/projects/indoamerica.webp', url: 'https://indoamericatech.com/laboratorios-de-ia', host: 'indoamericatech.com' },
  { codename: 'INSIDEEBB', image: '/projects/insideeb.webp', url: 'https://insideebb.com/en', host: 'insideebb.com' },
  { codename: 'KAMMEL', image: '/projects/kammel.png', url: 'https://kammel-ssh.vercel.app/', host: 'kammel-ssh.vercel.app' },
  // Raccoony no tiene web: su carta lleva al caso de estudio de este mismo sitio.
  { codename: 'RACCOONY', image: '/raccoony/cover.webp', url: '/raccoony', host: '/raccoony' },
] as const

type Codename = (typeof PROJECTS)[number]['codename']

// Una carta apunta hacia dentro del sitio cuando su URL es una ruta y no un
// origen. No hace falta marcarlas: el propio enlace ya lo dice.
const isInternal = (url: string) => url.startsWith('/')

// SPACING debe superar el ancho del bloque (carta + gap + info) para que
// dos proyectos consecutivos no se solapen al desplazarse.
const SPACING = 1400
const CARD_W = 830
const CARD_H = 480
const INFO_W = 320
const CARD_GAP = 44
const DASH_COUNT = 24

// Alto de scroll (en vh) que consume cada proyecto mientras la sección está
// clavada. Subirlo alarga el recorrido, es decir, ralentiza el carrusel.
const PIN_VH = 110
// Recorrido extra al final, en unidades de t, durante el cual la última carta ya
// está centrada: la sostiene un momento antes de soltar la página.
const TAIL = 0.4

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}

function makeDispMap(W: number, H: number, depth: number): string {
  const base = document.createElement('canvas')
  base.width = W
  base.height = H
  const bx = base.getContext('2d')!
  const img = bx.createImageData(W, H)
  const d = img.data
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let r = 128
      let g = 128
      if (x < depth) r = 255 - (x / depth) * 127
      else if (x > W - depth) r = 128 - ((x - (W - depth)) / depth) * 128
      if (y < depth) g = 255 - (y / depth) * 127
      else if (y > H - depth) g = 128 - ((y - (H - depth)) / depth) * 128
      const i = (y * W + x) * 4
      d[i] = r
      d[i + 1] = g
      d[i + 2] = 128
      d[i + 3] = 255
    }
  }
  bx.putImageData(img, 0, 0)
  const out = document.createElement('canvas')
  out.width = W
  out.height = H
  const ox = out.getContext('2d')!
  ox.filter = 'blur(7px)'
  ox.drawImage(base, 0, 0)
  return out.toDataURL()
}

/* El interior del cristal y el texto de la ficha no dependen de `t` ni del ratón:
   son los mismos nodos en todos los fotogramas. Aislados en componentes memoizados,
   React deja de reconstruirlos y compararlos en cada frame de scroll — el DOM que
   sale es exactamente el mismo, sólo se ahorra el trabajo de llegar a él. */

const GlassBody = memo(function GlassBody({ image, alt }: { image: string; alt: string }) {
  return (
    <>
      {/* Screenshot: enmarcada dentro del cristal, deja ver el marco alrededor */}
      <div
        style={{
          position: 'absolute',
          inset: 26,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'var(--glass-shadow-media), inset 0 0 0 1px var(--glass-border-strong)',
        }}
      >
        <img
          src={image}
          alt={alt}
          draggable={false}
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
        />
      </div>

      {/* Lens rim gradient border */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 32,
          padding: '1.5px',
          background: 'var(--glass-spec)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }}
      />
      {/* Inner magnification glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 32,
          boxShadow: 'var(--glass-inner)',
          pointerEvents: 'none',
        }}
      />
      {/* Top specular */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '38%',
          background: 'var(--glass-sheen)',
          borderRadius: '32px 42px 0 0',
          pointerEvents: 'none',
        }}
      />
    </>
  )
})

const InfoBody = memo(function InfoBody({
  p, url, host, inner, caseStudy, onCardClick,
}: {
  p: { title: string; sub: string; desc: string; loc: string }
  url: string
  host: string
  inner: boolean
  caseStudy: string
  onCardClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <>
      <h3
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 500,
          fontSize: 27,
          lineHeight: 1.04,
          letterSpacing: '-0.012em',
          color: 'var(--card-ink)',
          margin: 0,
        }}
      >
        {p.title}
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--card-sub)', margin: '14px 0 0' }}>{p.sub}</p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--card-faint)', margin: '11px 0 0' }}>{p.desc}</p>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--card-loc)', margin: '12px 0 0' }}>{p.loc}</p>
      <a
        href={url}
        target={inner ? undefined : '_blank'}
        rel={inner ? undefined : 'noopener noreferrer'}
        onClick={onCardClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          marginTop: 16,
          paddingBottom: 3,
          borderBottom: '1px solid var(--card-rule)',
          fontSize: 12,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--card-ink)',
          textDecoration: 'none',
          cursor: 'none',
        }}
      >
        {/* La diagonal anuncia «esto sale del sitio»; el caso de estudio
            no sale, así que se queda con la flecha recta. */}
        {inner ? caseStudy : host}{' '}
        <span style={{ color: 'var(--ink)' }}>{inner ? '→' : '↗'}</span>
      </a>
    </>
  )
})

export default function Projects() {
  const { t: dict } = useLanguage()
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [t, setT] = useState(0)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)
  const [dispMap, setDispMap] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  // `travel` se mide al empezar el arrastre y no en cada movimiento: leer
  // offsetHeight con el ratón apretado obliga al navegador a recalcular el layout
  // decenas de veces por segundo, y el raíl no cambia de alto mientras se arrastra.
  const drag = useRef<{ active: boolean; startX: number; startY: number; travel: number } | null>(null)
  const dragged = useRef(false)
  // El parallax se acumula aquí y se vuelca UNA vez por frame. Un ratón de 1000 Hz
  // dispara mousemove ~16 veces entre dos frames: sin esto, cada una de ellas
  // re-renderiza el carrusel entero para pintar el mismo fotograma.
  const point = useRef<{ x: number; y: number } | null>(null)
  const mmFrame = useRef(0)
  const n = PROJECTS.length

  // Mismo corte que .about-grid / .contact-grid en globals.css.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // El mapa de desplazamiento sólo alimenta al cristal de escritorio.
  useEffect(() => {
    if (isMobile) return
    setDispMap(makeDispMap(CARD_W, CARD_H, 56))
  }, [isMobile])

  // El carrusel no secuestra la rueda: la sección es un raíl alto con un escenario
  // `sticky` dentro. Mientras el escenario está clavado en el viewport, el scroll
  // de la página no mueve nada verticalmente y se traduce a la posición `t` del
  // carrusel — se siente bloqueado. Al agotarse el raíl se despega y la página
  // sigue sola. Así arranca en el instante en que la sección llena la pantalla,
  // sin depender de dónde esté el puntero, y funciona con rueda, trackpad,
  // teclado y barra de scroll por igual.
  useEffect(() => {
    if (isMobile) return
    let frame = 0

    const read = () => {
      frame = 0
      const el = rootRef.current
      if (!el) return
      const travel = el.offsetHeight - window.innerHeight
      if (travel <= 0) return
      const p = clamp(-el.getBoundingClientRect().top / travel, 0, 1)
      setT(clamp(p * (n + TAIL), 0, n))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [n, isMobile])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const root = rootRef.current
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: window.scrollY,
      travel: root ? root.offsetHeight - window.innerHeight : 0,
    }
    dragged.current = false
  }, [])

  // Vuelca el último punto conocido del ratón al estado. Corre como mucho una vez
  // por frame, así que el getBoundingClientRect —que fuerza layout— también.
  const flushPointer = useCallback(() => {
    mmFrame.current = 0
    const pt = point.current
    const r = stageRef.current?.getBoundingClientRect()
    if (!pt || !r) return
    setMx(clamp(((pt.x - r.left) / r.width - 0.5) * 2, -1, 1))
    setMy(clamp(((pt.y - r.top) / r.height - 0.5) * 2, -1, 1))
  }, [])

  // El arrastre horizontal no toca `t` directamente: empuja el scroll de la página,
  // que es quien manda. Un recorrido de SPACING px equivale a un proyecto.
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    point.current = { x: e.clientX, y: e.clientY }
    if (!mmFrame.current) mmFrame.current = requestAnimationFrame(flushPointer)

    const d = drag.current
    if (d?.active) {
      const dx = e.clientX - d.startX
      if (Math.abs(dx) > 4) dragged.current = true
      const perUnit = d.travel / (n + TAIL) // px de scroll por proyecto
      // `behavior: auto` anula el scroll-behavior: smooth global, que aquí
      // convertiría el arrastre en un deslizamiento con retardo.
      window.scrollTo({ top: d.startY - (dx / SPACING) * perUnit, behavior: 'auto' })
    }
  }, [n, flushPointer])

  // Un arrastre no debe abrir el enlace de la carta al soltar. Y si el enlace es
  // interno, lo toma el router: un <a> normal recargaría el sitio entero.
  const onCardClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dragged.current) {
      e.preventDefault()
      return
    }
    const href = e.currentTarget.getAttribute('href')
    if (href && isInternal(href)) {
      e.preventDefault()
      router.push(href)
    }
  }, [router])

  // Dentro de un subárbol preserve-3d, Chromium entrega el clic al contenedor 3D y no
  // a la carta: el <a> nunca lo recibe. Se resuelve aquí la carta bajo el puntero
  // (elementsFromPoint sí devuelve la pila correcta) y se abre su enlace a mano.
  const onSectionClick = useCallback((e: React.MouseEvent) => {
    if (dragged.current) return
    const target = e.target as HTMLElement
    if (target.closest('a[href]')) return // el enlace sí lo recibió: que lo maneje él

    const card = document
      .elementsFromPoint(e.clientX, e.clientY)
      .map(el => el.closest('a[data-cursor-label]'))
      .find(Boolean) as HTMLAnchorElement | undefined

    if (!card?.href) return
    // El caso de estudio es una ruta de este mismo sitio: se navega con el router
    // para no recargar la página entera ni abrir una pestaña de más.
    if (card.dataset.internal) router.push(card.getAttribute('href')!)
    else window.open(card.href, '_blank', 'noopener,noreferrer')
  }, [router])

  const onMouseUp = useCallback(() => {
    if (drag.current) drag.current.active = false
  }, [])

  useEffect(() => () => { if (mmFrame.current) cancelAnimationFrame(mmFrame.current) }, [])

  const progress = clamp(t / n, 0, 1)

  // En táctil el carrusel 3D no cabe ni se puede gobernar con el pulgar: se
  // sirve el carril nativo, que además evita el trabajo de cristal y canvas.
  if (isMobile) return <ProjectsMobile />

  return (
    // El raíl alto es el que aporta el recorrido de scroll; el escenario `sticky`
    // de dentro es lo que el visitante ve clavado mientras ese recorrido se gasta.
    <section
      ref={rootRef}
      className="projects-section"
      style={{
        position: 'relative',
        width: '100%',
        height: `calc(100vh + ${n * PIN_VH}vh)`,
        background: 'var(--bg)',
      }}
    >
      <div
        ref={stageRef}
        className="cursor-none"
        onClick={onSectionClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          background: 'var(--bg)',
          overflow: 'hidden',
          fontFamily: 'var(--font-jetbrains), monospace',
          color: 'var(--ink)',
          userSelect: 'none',
        }}
      >
        {/* LIQUID GLASS SVG FILTER */}
        <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden>
          <defs>
            <filter id="liquidglass" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
              {dispMap && (
                <feImage
                  href={dispMap}
                  x="0" y="0"
                  width={CARD_W} height={CARD_H}
                  preserveAspectRatio="none"
                  result="map"
                />
              )}
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale="42"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* GIANT HEADLINE — protagonista al inicio, se retira conforme entran las cartas */}
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: '50%',
            zIndex: t < 0.5 ? 6 : 1,
            transform: `translate3d(${mx * -52}px,calc(-50% + ${my * -34}px),0) scale(${(1 + progress * 0.18).toFixed(3)})`,
            transformOrigin: 'left center',
            opacity: clamp(1 - t * 0.6, 0.06, 1),
            transition: 'opacity 0.3s ease-out',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        >
          {dict.projects.headline.map(word => (
            <div
              key={word}
              style={{
                fontFamily: 'var(--font-anton), sans-serif',
                fontWeight: 400,
                color: 'var(--ink)',
                fontSize: 'clamp(72px, 11vw, 168px)',
                lineHeight: 0.84,
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
              }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* 3D CARDS LAYER */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, perspective: 2000 }}>
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
            {PROJECTS.map(({ codename, image, url, host }, i) => {
              const p = dict.projects.items[codename as Codename]
              const inner = isInternal(url)
              const off = (i - t) + 1
              const a = Math.abs(off)
              const pf = clamp(1 - a * 0.7, 0, 1)
              const px = mx * 70 * pf
              const py = my * 50 * pf
              const tiltY = mx * 14 * pf
              const tiltX = -my * 14 * pf
              const opacity = clamp(1.12 - a * 0.95, 0, 1)
              const infoOpacity = clamp(1 - a * 2, 0, 1)
              const infoTx = mx * -38 * pf
              const infoTy = my * -26 * pf

              // Una carta a opacidad 0 sigue siendo una carta: el navegador le pinta
              // igualmente el cristal —`backdrop-filter` con el feDisplacementMap—
              // sobre 830×480 px, y eso es lo más caro de toda la página. Con
              // `visibility: hidden` deja de pintarse del todo. El cambio se retrasa
              // los 0.14s que dura el fundido (`visibility 0s linear 0.14s`) para que
              // la carta no desaparezca de golpe a mitad de la transición; al volver
              // a entrar se aplica sin retardo.
              const gone = opacity === 0

              return (
                <div
                  key={codename}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%,-50%) translate3d(${off * SPACING + 70 + px}px,${-24 + py}px,${-a * 240}px) rotateY(${off * -8 + tiltY}deg) rotateX(${tiltX}deg)`,
                    opacity,
                    visibility: gone ? 'hidden' : 'visible',
                    zIndex: Math.round(100 - a * 10),
                    transition: `transform 0.22s ease-out, opacity 0.14s ease-out, visibility 0s linear ${gone ? '0.14s' : '0s'}`,
                    pointerEvents: a < 0.5 ? 'auto' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: CARD_GAP }}>

                    {/* LIQUID GLASS CARD — la captura del sitio vive dentro del cristal */}
                    <a
                      href={url}
                      target={inner ? undefined : '_blank'}
                      rel={inner ? undefined : 'noopener noreferrer'}
                      onClick={onCardClick}
                      data-internal={inner ? '1' : undefined}
                      data-cursor-label={inner ? dict.projects.viewCase : dict.projects.visit}
                      style={{
                        position: 'relative',
                        display: 'block',
                        flexShrink: 0,
                        width: CARD_W,
                        height: CARD_H,
                        borderRadius: 32,
                        background: 'var(--glass-bg)',
                        backdropFilter: 'url(#liquidglass) blur(22px) saturate(200%) brightness(var(--glass-brightness))',
                        WebkitBackdropFilter: 'url(#liquidglass) blur(22px) saturate(200%) brightness(1.1)',
                        boxShadow: 'var(--glass-shadow), inset 0 0 0 1px var(--glass-border)',
                        overflow: 'hidden',
                        cursor: 'none',
                      }}
                    >
                      <GlassBody image={image} alt={p.title} />
                    </a>

                    {/* INFO */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: INFO_W,
                        paddingBottom: 8,
                        opacity: infoOpacity,
                        transform: `translate3d(${infoTx}px,${infoTy}px,0)`,
                        transition: 'opacity 0.16s ease-out, transform 0.3s ease-out',
                        willChange: 'transform',
                      }}
                    >
                      <InfoBody
                        p={p}
                        url={url}
                        host={host}
                        inner={inner}
                        caseStudy={dict.projects.caseStudy}
                        onCardClick={onCardClick}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* PROGRESS */}
        <div
          style={{
            position: 'absolute',
            bottom: 30, right: 32,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          {/* Salida del carrusel: salta directo al contacto sin recorrer las cartas. */}
          <a
            href="#contacto"
            className="link-with-arrow"
            style={{
              fontSize: 13,
              letterSpacing: '0.1em',
              color: 'var(--ink)',
              textDecoration: 'none',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {dict.projects.skip} <span style={{ color: 'var(--ink)' }}>&#8594;</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 16 }}>
            {Array.from({ length: DASH_COUNT }, (_, i) => {
              const activeIdx = Math.round(progress * (DASH_COUNT - 1))
              const active = i === activeIdx
              return (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: active ? 3 : 12,
                    height: active ? 15 : 1,
                    background: active ? 'var(--ink)' : i < activeIdx ? 'var(--dot-past)' : 'var(--dot-idle)',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                />
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────  MÓVIL  ───────────────────────────── */

// Carril horizontal con scroll nativo: el navegador se queda con el gesto, así
// que el swipe vertical sigue moviendo la página y el horizontal pasa de carta.
// Sin 3D, sin backdrop-filter ni feDisplacementMap: en GPU móvil salen caros y
// el cristal apenas se aprecia a este tamaño; queda sólo el borde de lente.
function ProjectsMobile() {
  const { t: dict } = useLanguage()
  const railRef = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const n = PROJECTS.length

  const onScroll = useCallback(() => {
    const el = railRef.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    const stride = first.offsetWidth + 16 // gap del .projects-rail
    setIdx(clamp(Math.round(el.scrollLeft / stride), 0, n - 1))
  }, [n])

  return (
    <section
      className="projects-section"
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--bg)',
        overflow: 'hidden',
        fontFamily: 'var(--font-jetbrains), monospace',
        color: 'var(--ink)',
        padding: '44px 0 64px',
      }}
    >
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        {dict.projects.headline.map(word => (
          <div
            key={word}
            style={{
              fontFamily: 'var(--font-anton), sans-serif',
              fontWeight: 400,
              color: 'var(--ink)',
              fontSize: 'clamp(46px, 13vw, 88px)',
              lineHeight: 0.9,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
            }}
          >
            {word}
          </div>
        ))}
      </div>

      <div ref={railRef} onScroll={onScroll} className="projects-rail">
        {PROJECTS.map(({ codename, image, url, host }) => {
          const p = dict.projects.items[codename as Codename]
          const inner = isInternal(url)
          return (
            <a
              key={codename}
              href={url}
              target={inner ? undefined : '_blank'}
              rel={inner ? undefined : 'noopener noreferrer'}
              style={{
                display: 'block',
                borderRadius: 26,
                padding: 10,
                background: 'var(--glass-bg)',
                boxShadow: 'var(--glass-shadow-sm), inset 0 0 0 1px var(--glass-border)',
                textDecoration: 'none',
                color: 'inherit',
                // Al deslizar el carril, Android tiñe la carta entera de gris sin esto.
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 11',
                  borderRadius: 17,
                  overflow: 'hidden',
                  boxShadow: 'inset 0 0 0 1px var(--glass-border-strong)',
                }}
              >
                <img
                  src={image}
                  alt={p.title}
                  draggable={false}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                  }}
                />
              </div>

              {/* La descripción larga se queda en escritorio: aquí sería un muro de
                  texto que nadie lee. La captura ya cuenta el proyecto; basta con
                  qué es, dónde y a dónde lleva. */}
              <div style={{ padding: '16px 8px 4px' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--card-loc)' }}>{p.loc}</div>
                <h3
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontWeight: 500,
                    fontSize: 21,
                    lineHeight: 1.1,
                    letterSpacing: '-0.012em',
                    color: 'var(--card-ink)',
                    margin: '12px 0 0',
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--card-desc)', margin: '6px 0 0' }}>{p.sub}</p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    marginTop: 14,
                    paddingBottom: 3,
                    borderBottom: '1px solid var(--card-rule)',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--card-ink)',
                  }}
                >
                  {inner ? dict.projects.caseStudy : host}{' '}
                  <span style={{ color: 'var(--ink)' }}>{inner ? '→' : '↗'}</span>
                </span>
              </div>
            </a>
          )
        })}
      </div>

      {/* Posición en el carril: confirma el swipe y dice cuántas cartas quedan. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '26px 20px 0' }}>
        {PROJECTS.map(({ codename }, i) => (
          <span
            key={codename}
            style={{
              display: 'block',
              width: i === idx ? 26 : 12,
              height: 2,
              background: i === idx ? 'var(--ink)' : 'var(--dot-idle)',
              transition: 'width 0.2s ease, background 0.2s ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
