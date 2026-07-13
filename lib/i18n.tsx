'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LOCALE, getDictionary, type Dictionary, type Locale } from './dictionaries'

const STORAGE_KEY = 'jhongdlp:locale'

type LanguageValue = {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // Se lee tras montar: el HTML del servidor siempre sale en DEFAULT_LOCALE,
  // así la hidratación nunca discrepa.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') setLocaleState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo<LanguageValue>(
    () => ({
      locale,
      t: getDictionary(locale),
      setLocale,
      toggle: () => setLocale(locale === 'es' ? 'en' : 'es'),
    }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  return ctx
}
