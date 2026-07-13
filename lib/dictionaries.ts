export type Locale = 'es' | 'en'

export const LOCALES: Locale[] = ['es', 'en']
export const DEFAULT_LOCALE: Locale = 'es'

// Los codenames de proyecto y los nombres de tecnología no se traducen:
// son nombres propios y así se reconocen en cualquier idioma.
const dictionaries = {
  es: {
    nav: {
      links: ['Proyectos', 'Sobre mí', 'Contacto'],
      language: 'Idioma',
      menu: 'Menú',
      theme: 'Cambiar tema',
    },
    hero: {
      portraitAlt: 'Retrato de JHONGDLP',
    },
    about: {
      // La línea de índice 1 se renderiza como FillWord (Anton, mayúsculas).
      manifesto: ['Creo productos', 'Inteligentes', 'del concepto', 'a la producción.'],
      location: 'QUITO, ECUADOR',
      role: 'INGENIERO TI · FULL-STACK & IA',
      meta: {
        location: 'Ubicación',
        role: 'Rol',
        stack: 'Stack',
      },
      groups: {
        Frontend: 'Frontend',
        Backend: 'Backend',
        'AI & Data': 'IA y Datos',
        Tooling: 'Herramientas',
      },
      bio: {
        lead:
          'Desarrollador full-stack y especialista en IA que conecta personas con marcas y negocios a través de código y diseño inteligente. Una combinación de ingeniería sólida y ejecución refinada para entregar resultados premium —',
        aside: 'o dicho de otro modo, «crear cosas geniales en internet».',
      },
      capabilities: [
        'Ingeniería Full-Stack',
        'Integración de IA y LLM',
        'Diseño de Interfaces',
        'Movimiento e Interacción',
      ],
    },
    projects: {
      // Dos líneas del titular gigante.
      headline: ['PROYECTOS', 'SELECTOS'],
      skip: 'SALTAR',
      // Texto dentro del cursor al pasar sobre una carta.
      visit: 'VISITAR PÁGINA',
      items: {
        BIZZIO: {
          title: 'E-commerce con IA',
          sub: 'Plataforma SaaS de tiendas online',
          desc: 'Constructor de tiendas donde un vendedor de IA atiende y vende 24/7. Pagos locales integrados (Payphone y De Una), catálogo, estado de pedidos y cero código.',
          loc: 'Ecuador (2026)',
        },
        UTITECH: {
          title: 'Laboratorios de IA',
          sub: 'Plataforma académica UTITech',
          desc: 'Entornos en la nube para explorar, entrenar y desplegar modelos: notebooks colaborativos, cómputo GPU bajo demanda y plantillas de proyecto listas para usar.',
          loc: 'Universidad Indoamérica (2026)',
        },
        INSIDEEBB: {
          title: 'Estudio de Software e IA',
          sub: 'Producto, agentes de IA y e-commerce',
          desc: 'Sitio del estudio con identidad editorial, sistema bilingüe ES/EN, páginas de producto y blog técnico. Diseño de sistemas y software a medida.',
          loc: 'Quito, Ecuador (2026)',
        },
      },
    },
    contact: {
      // La línea de índice 1 se renderiza como FillWord (Anton, mayúsculas).
      headline: ['¿Tienes una', 'Idea?', 'Hablemos.'],
      lead: 'Abierto a proyectos freelance, colaboraciones y roles a tiempo completo. Cuéntame qué quieres construir y respondo en menos de 24 horas.',
      // Etiqueta dentro del cursor al pasar sobre el email.
      copyHint: 'Clic para copiar',
      copyAction: 'Copiar',
      copied: 'Copiado',
      available: 'Disponible para proyectos',
      location: 'QUITO, ECUADOR',
      meta: {
        availability: 'Disponibilidad',
        local: 'Hora local',
        elsewhere: 'En otros sitios',
      },
      directMessageBtn: 'o envíame un mensaje directo',
      form: {
        title: 'Enviar un mensaje',
        name: 'Nombre',
        email: 'Email',
        message: 'Tu mensaje...',
        submit: 'Enviar mensaje',
        sending: 'Enviando...',
        success: '¡Mensaje enviado con éxito! Te responderé pronto.',
        error: 'Ocurrió un error. Por favor, intenta de nuevo.',
        close: 'Cerrar',
      },
    },
    quotes: {
      eyebrow: 'Frases célebres',
      credit: 'Retratos · Wikimedia Commons',
      // Las citas son traducciones; el original en inglés se cita en `source`.
      items: {
        lovelace: {
          quote:
            'La Máquina Analítica no tiene pretensión alguna de originar nada. Puede hacer todo aquello que sepamos ordenarle que haga.',
          role: 'Primera programadora',
        },
        turing: {
          quote: 'Propongo considerar la pregunta: ¿pueden pensar las máquinas?',
          role: 'Matemático · Padre de la IA',
        },
        hopper: {
          quote: 'La frase más dañina del idioma es: «siempre lo hemos hecho así».',
          role: 'Contralmirante · Pionera de COBOL',
        },
        dijkstra: {
          quote:
            'Preguntar si una máquina puede pensar es tan relevante como preguntar si un submarino puede nadar.',
          role: 'Científico de la computación',
        },
        torvalds: {
          quote: 'Hablar es barato. Muéstrame el código.',
          role: 'Creador de Linux',
        },
        li: {
          quote:
            'No hay nada de artificial en la IA. La inspiran personas, la crean personas y —lo más importante— impacta a personas.',
          role: 'IA centrada en las personas',
        },
        karpathy: {
          quote: 'El lenguaje de programación más popular ahora mismo es el inglés.',
          role: 'Investigador de IA',
        },
      },
    },
    footer: {
      backToTop: 'Volver arriba',
    },
  },

  en: {
    nav: {
      links: ['Work', 'About', 'Contact'],
      language: 'Language',
      menu: 'Menu',
      theme: 'Toggle theme',
    },
    hero: {
      portraitAlt: 'JHONGDLP portrait',
    },
    about: {
      manifesto: ['Building', 'Intelligent', 'products, from', 'concept to production.'],
      location: 'QUITO, ECUADOR',
      role: 'IT ENGINEER · FULL-STACK & AI',
      meta: {
        location: 'Location',
        role: 'Role',
        stack: 'Stack',
      },
      groups: {
        Frontend: 'Frontend',
        Backend: 'Backend',
        'AI & Data': 'AI & Data',
        Tooling: 'Tooling',
      },
      bio: {
        lead:
          'A full-stack developer and AI specialist connecting people with brands & businesses through code and intelligent design. A combination of strong engineering and refined execution to deliver premium results —',
        aside: 'in other words, ‘creating cool sh*t on the internet.’',
      },
      capabilities: [
        'Full-Stack Engineering',
        'AI & LLM Integration',
        'Interface Design',
        'Motion & Interaction',
      ],
    },
    projects: {
      headline: ['SELECTED', 'PROJECTS'],
      skip: 'SKIP',
      visit: 'VISIT SITE',
      items: {
        BIZZIO: {
          title: 'AI-Powered E-commerce',
          sub: 'Online store SaaS platform',
          desc: 'Store builder where an AI seller answers and sells 24/7. Local payments built in (Payphone and De Una), catalog, order tracking and zero code.',
          loc: 'Ecuador (2026)',
        },
        UTITECH: {
          title: 'AI Laboratories',
          sub: 'UTITech academic platform',
          desc: 'Cloud environments to explore, train and deploy models: collaborative notebooks, on-demand GPU compute and ready-to-use project templates.',
          loc: 'Universidad Indoamérica (2026)',
        },
        INSIDEEBB: {
          title: 'Software & AI Studio',
          sub: 'Product, AI agents and e-commerce',
          desc: 'Studio site with an editorial identity, an ES/EN bilingual system, product pages and a technical blog. Systems design and custom software.',
          loc: 'Quito, Ecuador (2026)',
        },
      },
    },
    contact: {
      headline: ['Got an', 'Idea?', "Let's talk."],
      lead: 'Open to freelance projects, collaborations and full-time roles. Tell me what you want to build and I answer within 24 hours.',
      copyHint: 'Click to copy',
      copyAction: 'Copy',
      copied: 'Copied',
      available: 'Available for projects',
      location: 'QUITO, ECUADOR',
      meta: {
        availability: 'Availability',
        local: 'Local time',
        elsewhere: 'Elsewhere',
      },
      directMessageBtn: 'or send me a direct message',
      form: {
        title: 'Send a message',
        name: 'Name',
        email: 'Email',
        message: 'Your message...',
        submit: 'Send message',
        sending: 'Sending...',
        success: 'Message sent successfully! I will get back to you soon.',
        error: 'Something went wrong. Please try again.',
        close: 'Close',
      },
    },
    quotes: {
      eyebrow: 'Notable words',
      credit: 'Portraits · Wikimedia Commons',
      items: {
        lovelace: {
          quote:
            'The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform.',
          role: 'First programmer',
        },
        turing: {
          quote: 'I propose to consider the question: can machines think?',
          role: 'Mathematician · Father of AI',
        },
        hopper: {
          quote: "The most damaging phrase in the language is: 'we've always done it this way.'",
          role: 'Rear Admiral · COBOL pioneer',
        },
        dijkstra: {
          quote:
            'The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.',
          role: 'Computer scientist',
        },
        torvalds: {
          quote: 'Talk is cheap. Show me the code.',
          role: 'Creator of Linux',
        },
        li: {
          quote:
            "There's nothing artificial about AI. It's inspired by people, it's created by people and — most importantly — it impacts people.",
          role: 'Human-centered AI',
        },
        karpathy: {
          quote: 'The hottest new programming language is English.',
          role: 'AI researcher',
        },
      },
    },
    footer: {
      backToTop: 'Back to top',
    },
  },
} as const

export type Dictionary = (typeof dictionaries)['es']

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary
}
