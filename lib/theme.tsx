'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'jhongdlp:theme'

export type Theme = 'dark' | 'light'

/** La web está dirigida en oscuro (preloader, grano, cristal): quien llega sin
 *  haber elegido la ve como fue compuesta. El claro es una decisión explícita,
 *  por eso NO se mira `prefers-color-scheme`. */
export const DEFAULT_THEME: Theme = 'dark'

/** Se inyecta en <head> y corre antes del primer pintado (ver layout.tsx).
 *  Sin esto, quien eligió el claro vería un fogonazo de carbón en cada carga:
 *  React llega demasiado tarde para evitarlo. Va como string para poder
 *  serializarlo; cualquier fallo (Safari privado, cookies bloqueadas) cae de
 *  pie en el tema por defecto que ya trae el HTML. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})()`

type ThemeValue = {
  theme: Theme
  /** `origin` (en coordenadas de viewport) hace que el tema se revele con un
   *  círculo que crece desde ahí. Sin él, cambia con un fundido. */
  setTheme: (theme: Theme, origin?: Origin) => void
  toggle: (origin?: Origin) => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

/** Punto de la pantalla del que nace la revelación (el centro del botón). */
export type Origin = { x: number; y: number }

/** Radio necesario para que el círculo cubra la pantalla desde `origin`: la
 *  distancia a la esquina MÁS LEJANA. Con menos, el tema viejo asomaría por una
 *  esquina al acabar la animación. */
function radiusToFurthestCorner({ x, y }: Origin) {
  return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME)

  // Sólo LEE. El atributo ya lo dejó puesto el script de <head> antes de pintar,
  // así que aquí no se toca el DOM: si este efecto escribiera `theme` (que en el
  // primer render siempre es el de por defecto), machacaría la elección del
  // visitante y provocaría el parpadeo que el script vino a evitar.
  useEffect(() => {
    const applied = document.documentElement.dataset.theme
    if (applied === 'light' || applied === 'dark') setThemeState(applied)
  }, [])

  const setTheme = useCallback((next: Theme, origin?: Origin) => {
    const root = document.documentElement

    const commit = () => {
      root.dataset.theme = next
      setThemeState(next)
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Almacenamiento denegado: el tema vale para esta sesión y no se recuerda.
      }
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Sin View Transitions (Firefox, Safari viejo), sin origen, o con movimiento
    // reducido: se cae al fundido de color de siempre, que no mueve nada por la
    // pantalla. La web queda igual de usable, sólo sin la florituraa.
    if (!document.startViewTransition || !origin || reduced) {
      root.classList.add('theme-switching')
      window.setTimeout(() => root.classList.remove('theme-switching'), 400)
      commit()
      return
    }

    // El navegador fotografía la página, deja que React repinte con el tema nuevo
    // y nos entrega ambas capas apiladas. Sólo se recorta la de ARRIBA (la nueva)
    // con un círculo que crece: el tema viejo se ve por debajo, intacto, y da la
    // sensación de que el nuevo se derrama desde el botón.
    //
    // El círculo lo anima un keyframe de CSS (globals.css) y no `root.animate()`
    // dentro de `transition.ready`: allí la capa nueva ya existe SIN recortar, así
    // que si el navegador pinta un frame antes de que corra el callback, el tema
    // nuevo asoma entero un instante y luego se encoge a cero. Ese era el tirón.
    // Con el keyframe, el recorte nace con la capa. Aquí sólo se dejan puestas las
    // medidas que el keyframe no puede saber.
    root.style.setProperty('--reveal-x', `${origin.x}px`)
    root.style.setProperty('--reveal-y', `${origin.y}px`)
    root.style.setProperty('--reveal-r', `${radiusToFurthestCorner(origin)}px`)

    // flushSync es obligatorio: startViewTransition fotografía en cuanto acaba este
    // callback, y un setState normal de React aún no habría pintado nada.
    const transition = document.startViewTransition(() => flushSync(commit))

    // Se limpian al acabar (también si la transición se aborta por otro cambio de
    // tema encadenado) para no dejar el círculo viejo puesto en la siguiente.
    transition.finished.finally(() => {
      root.style.removeProperty('--reveal-x')
      root.style.removeProperty('--reveal-y')
      root.style.removeProperty('--reveal-r')
    })
  }, [])

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      setTheme,
      toggle: (origin?: Origin) => setTheme(theme === 'dark' ? 'light' : 'dark', origin),
    }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
