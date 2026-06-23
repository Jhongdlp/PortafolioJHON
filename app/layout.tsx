import type { Metadata } from 'next'
import { Anton, Archivo, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${anton.variable} ${archivo.variable} ${jetbrainsMono.variable}`} style={{ cursor: 'none' }}>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
