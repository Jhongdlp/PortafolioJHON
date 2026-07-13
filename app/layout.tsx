import type { Metadata, Viewport } from 'next'
import { Anton, Archivo, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import Preloader from '@/components/Preloader'
import { LanguageProvider } from '@/lib/i18n'
import { DEFAULT_THEME, THEME_INIT_SCRIPT, ThemeProvider } from '@/lib/theme'
import { Analytics } from '@vercel/analytics/next'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-archivo',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JHONGDLP — Full-Stack Developer',
  description: 'Portafolio brutalista de JHONGDLP, desarrollador Full-Stack.',
}

// Tiñe la barra del navegador en móvil con el fondo de cada tema: sin esto, el
// modo claro deja una franja negra sobre el papel.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
    { media: '(prefers-color-scheme: light)', color: '#F2EFE6' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El tema por defecto viaja ya en el HTML del servidor; el script de abajo
    // sólo lo corrige si el visitante eligió otro. `suppressHydrationWarning`
    // porque ese script muta el atributo antes de que React hidrate.
    <html lang="es" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${anton.variable} ${archivo.variable} ${jetbrainsMono.variable}`} style={{ cursor: 'none' }}>
        <ThemeProvider>
          <LanguageProvider>
            <CustomCursor />
            <Preloader />
            {children}
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
