'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const navLinks = ['Work', 'About', 'Contact']

export default function Hero() {
  return (
    <section
      style={{
        background: '#0f0f0f',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-archivo), sans-serif',
        color: '#E9E4D6',
      }}
    >
      {/* NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '20px 34px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Left links */}
        <div style={{ display: 'flex', gap: 26, fontSize: 12, letterSpacing: '0.14em', fontWeight: 500, textTransform: 'uppercase' }}>
          {navLinks.map((link) => (
            <span
              key={link}
              style={{ cursor: 'pointer', transition: 'color 0.2s', color: '#E9E4D6' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F26321')}
              onMouseLeave={e => (e.currentTarget.style.color = '#E9E4D6')}
            >
              {link}
            </span>
          ))}
        </div>

        {/* Center logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="24" viewBox="0 0 30 22" fill="none" aria-label="logo">
            <path
              d="M3 11 C3 4, 11 4, 11 11 C11 18, 19 18, 19 11 C19 4, 27 4, 27 11"
              stroke="#F26321"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Right icons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 22 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
            <path
              d="M3 5h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 8H6"
              stroke="#E9E4D6"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.5" cy="20" r="1.1" fill="#E9E4D6" />
            <circle cx="18" cy="20" r="1.1" fill="#E9E4D6" />
          </svg>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer' }}>
            <span style={{ width: 22, height: 1.6, background: '#E9E4D6', display: 'block' }} />
            <span style={{ width: 22, height: 1.6, background: '#E9E4D6', display: 'block' }} />
          </span>
        </div>
      </motion.nav>

      {/* MASSIVE HEADLINE */}
      <div style={{ padding: '30px 30px 0', overflow: 'hidden' }}>
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-anton), sans-serif',
            fontWeight: 400,
            color: '#E9E4D6',
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
            src="/portrait-v4.png"
            alt="JHONGDLP portrait"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
