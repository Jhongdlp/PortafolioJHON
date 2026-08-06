import type { Metadata } from 'next'
import Header from '@/components/Header'
import Raccoony from '@/components/Raccoony'
import Footer from '@/components/Footer'

// La descripción va en español porque es el idioma por defecto del sitio: el
// conmutador ES/EN vive en el cliente y no puede alcanzar a estas etiquetas.
export const metadata: Metadata = {
  title: 'Raccoony — Analizador de vida impulsado por IA | JHONGDLP',
  description:
    'Caso de estudio de Raccoony: un analizador de vida impulsado por IA para mejorar tu calidad de vida. Hábitos, notas, finanzas y agenda, con una alarma que sólo se apaga si demuestras con una foto que cumpliste. Diseño neumórfico e IA en servidor propio.',
  openGraph: {
    title: 'Raccoony — Analizador de vida impulsado por IA',
    description:
      'Un analizador de vida impulsado por IA para mejorar tu calidad de vida: hábitos, notas enlazadas, finanzas, agenda y una alarma anti-procrastinación validada por IA. Todo en un servidor privado.',
    images: [{ url: '/raccoony/og.webp', width: 1200, height: 800 }],
    type: 'article',
  },
}

export default function RaccoonyPage() {
  return (
    <>
      <Header />
      <Raccoony />
      <Footer />
    </>
  )
}
