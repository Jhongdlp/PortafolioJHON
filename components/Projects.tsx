'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

const PROJECTS = [
  {
    codename: 'ZODIANA',
    title: 'Artist & Curator Hub',
    sub: 'DJ, event curator & Zodiac Aphrodisiac CEO',
    desc: 'Immersive 10-page ecosystem with 3D interactions, custom branded media players, and an automated press delivery system.',
    loc: 'Brooklyn, New York (2026)',
  },
  {
    codename: 'NOCTURNE',
    title: 'Event Booking Platform',
    sub: 'Underground rave collective',
    desc: 'Real-time ticketing with animated venue maps, live capacity counters and a headless CMS for promoters with a single dashboard.',
    loc: 'Berlin, DE (2025)',
  },
  {
    codename: 'HALCYON',
    title: 'Fashion Lookbook',
    sub: 'Avant-garde streetwear label',
    desc: 'Scroll-driven editorial with WebGL fabric simulation and a frictionless headless checkout flow.',
    loc: 'Paris, FR (2025)',
  },
  {
    codename: 'VANTA',
    title: 'Studio Portfolio',
    sub: 'Motion design house',
    desc: 'Reel-first showcase with shader transitions, a custom video player and a CMS for live case studies.',
    loc: 'Los Angeles, CA (2024)',
  },
]

const SPACING = 1120
const CARD_W = 660
const CARD_H = 382
const DASH_COUNT = 24

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

export default function Projects() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [t, setT] = useState(0)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)
  const [dispMap, setDispMap] = useState('')
  const drag = useRef<{ active: boolean; startX: number; startT: number } | null>(null)
  const touchStart = useRef<{ x: number; t: number } | null>(null)
  const tRef = useRef(0)
  const isVisible = useRef(false)
  const n = PROJECTS.length

  useEffect(() => {
    setDispMap(makeDispMap(CARD_W, CARD_H, 56))
  }, [])

  // Detecta si la section está visible (≥60% en viewport)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting },
      { threshold: 0.6 }
    )
    if (rootRef.current) observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  // Wheel nativo con passive:false — suave y continuo, libera en los límites
  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (!isVisible.current) return
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 5) return

      const atStart = tRef.current <= 0 && delta < 0
      const atEnd   = tRef.current >= n && delta > 0
      if (atStart || atEnd) return // deja pasar el scroll a la página

      e.preventDefault()
      const next = clamp(tRef.current + delta * 0.002, 0, n)
      tRef.current = next
      setT(next)
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [n])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    drag.current = { active: true, startX: e.clientX, startT: tRef.current }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = rootRef.current?.getBoundingClientRect()
    if (r) {
      setMx(clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1))
      setMy(clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1))
    }

    if (drag.current?.active) {
      const dx = e.clientX - drag.current.startX
      const next = clamp(drag.current.startT - dx / SPACING, 0, n)
      tRef.current = next
      setT(next)
    }
  }, [n])

  const onMouseUp = useCallback(() => {
    if (drag.current) {
      drag.current.active = false
      setT(prev => {
        const snapped = Math.round(clamp(prev, 0, n))
        tRef.current = snapped
        return snapped
      })
    }
  }, [n])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, t: tRef.current }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.touches[0].clientX - touchStart.current.x
    const next = clamp(touchStart.current.t - dx / SPACING, 0, n)
    tRef.current = next
    setT(next)
  }, [n])

  const onTouchEnd = useCallback(() => {
    setT(prev => {
      const snapped = Math.round(clamp(prev, 0, n))
      tRef.current = snapped
      return snapped
    })
    touchStart.current = null
  }, [n])

  const progress = clamp(t / n, 0, 1)

  return (
    <section
      ref={rootRef}
      className="projects-section cursor-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0f0f0f',
        overflow: 'hidden',
        fontFamily: 'var(--font-jetbrains), monospace',
        color: '#fff',
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
              scale="80"
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
        {['SELECTED', 'PROJECTS'].map(word => (
          <div
            key={word}
            style={{
              fontFamily: 'var(--font-anton), sans-serif',
              fontWeight: 400,
              color: '#E9E4D6',
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
          {PROJECTS.map((p, i) => {
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

            return (
              <div
                key={p.codename}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%,-50%) translate3d(${off * SPACING + 110 + px}px,${-40 + py}px,${-a * 240}px) rotateY(${off * -8 + tiltY}deg) rotateX(${tiltX}deg)`,
                  opacity,
                  zIndex: Math.round(100 - a * 10),
                  transition: 'transform 0.22s ease-out, opacity 0.14s ease-out',
                  pointerEvents: a < 0.5 ? 'auto' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>

                  {/* LIQUID GLASS CARD */}
                  <div
                    style={{
                      position: 'relative',
                      flexShrink: 0,
                      width: CARD_W,
                      height: CARD_H,
                      borderRadius: 32,
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: `url(#liquidglass) blur(22px) saturate(200%) brightness(1.1)`,
                      WebkitBackdropFilter: `url(#liquidglass) blur(22px) saturate(200%) brightness(1.1)`,
                      boxShadow: '0 50px 120px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.10)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Codename */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 28, left: 32,
                        fontSize: 11,
                        letterSpacing: '0.2em',
                        color: 'rgba(255,255,255,0.45)',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                      }}
                    >
                      {p.codename}
                    </div>

                    {/* Lens rim gradient border */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 32,
                        padding: '1.5px',
                        background: 'linear-gradient(150deg,rgba(255,255,255,0.85),rgba(255,255,255,0.10) 28%,rgba(255,255,255,0) 50%,rgba(255,255,255,0.12) 74%,rgba(255,255,255,0.55))',
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
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(255,255,255,0.25), inset 0 0 22px rgba(255,255,255,0.06)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Top specular */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '38%',
                        background: 'linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0))',
                        borderRadius: '32px 42px 0 0',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 300,
                      paddingBottom: 8,
                      opacity: infoOpacity,
                      transform: `translate3d(${infoTx}px,${infoTy}px,0)`,
                      transition: 'opacity 0.16s ease-out, transform 0.3s ease-out',
                      willChange: 'transform',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontWeight: 500,
                        fontSize: 27,
                        lineHeight: 1.04,
                        letterSpacing: '-0.012em',
                        color: '#eaeaea',
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.5, color: '#c2c2c2', margin: '14px 0 0' }}>{p.sub}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: '#828282', margin: '11px 0 0' }}>{p.desc}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: '#9c9c9c', margin: '12px 0 0' }}>{p.loc}</p>
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
        <span style={{ fontSize: 13, letterSpacing: '0.1em', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          SKIP <span style={{ color: '#e10600' }}>&#8594;</span>
        </span>
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
                  background: active ? '#e10600' : i < activeIdx ? '#666' : '#3a3a3a',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              />
            )
          })}
        </div>
      </div>

    </section>
  )
}
