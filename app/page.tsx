import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Quotes from '@/components/Quotes'
import Footer from '@/components/Footer'

// Los id viven en envoltorios y no dentro de cada sección para no tocar su
// maquetación: son sólo destinos de ancla para los enlaces del header.
export default function Home() {
  return (
    <main>
      <Header />
      <div id="inicio">
        <Hero />
      </div>
      <div id="sobre-mi">
        <About />
      </div>
      <div id="proyectos">
        <Projects />
      </div>
      <Contact />
      <Quotes />
      <Footer />
    </main>
  )
}
