export type Locale = 'es' | 'en'

export const LOCALES: Locale[] = ['es', 'en']
export const DEFAULT_LOCALE: Locale = 'es'

// Los codenames de proyecto y los nombres de tecnología no se traducen:
// son nombres propios y así se reconocen en cualquier idioma.
const dictionaries = {
  es: {
    nav: {
      links: ['Proyectos', 'Sobre mí', 'Contacto'],
      home: 'Volver al inicio',
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
      // Las cartas internas (`internal` en Projects.tsx) no llevan a un sitio
      // externo sino a una página del propio portafolio: cambian etiqueta y flecha.
      caseStudy: 'CASO DE ESTUDIO',
      viewCase: 'VER EL CASO',
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
        KAMMEL: {
          title: 'Cliente SSH para Android',
          sub: 'Terminal y editor de código open-source',
          desc: 'App móvil todo-en-uno: cliente SSH, terminal, explorador SFTP y editor de código. Permite ejecutar agentes de IA (Claude Code, Gemini CLI) directamente por SSH.',
          loc: 'Open source (2026)',
        },
        RACCOONY: {
          title: 'Analizador de vida con IA',
          sub: 'App móvil para mejorar tu calidad de vida',
          desc: 'Hábitos, notas enlazadas, finanzas, agenda y una alarma que sólo se apaga si le demuestras con una foto que cumpliste. Toda la IA corre en un servidor propio.',
          loc: 'Android · Open source (2026)',
        },
      },
    },
    // Página completa del caso de estudio (/raccoony). El orden de `modules`,
    // `screens`, `steps` y `pillars` es el de lectura: los componentes los mapean tal cual.
    raccoony: {
      eyebrow: 'CASO DE ESTUDIO',
      title: 'RACCOONY',
      // Qué ES el producto, en la línea pegada al nombre. El eslogan de marca
      // («Tu vida, organizada») no se repite aquí: ya se lee en la carátula que
      // va justo al lado.
      tagline: ['Un analizador de vida impulsado por IA', 'para mejorar tu calidad de vida.'],
      lead: 'Hábitos, notas enlazadas, finanzas, agenda, lectura y ejercicio en un mismo sitio, cruzados entre sí para enseñarte qué te está funcionando y qué no. Toda la inteligencia artificial corre en un servidor privado, sin que un solo dato salga hacia terceros.',
      ctaRepo: 'Ver en GitHub',
      ctaTour: 'Recorrer la app',
      back: 'Volver a proyectos',
      coverAlt: 'Portada de Raccoony junto a la pantalla de Hábitos',
      meta: [
        { k: 'Rol', v: 'Producto, diseño e ingeniería' },
        { k: 'Año', v: '2026' },
        { k: 'Plataforma', v: 'Android · APK propia' },
        { k: 'Lenguaje visual', v: 'Neumorfismo, claro y oscuro' },
        { k: 'IA', v: 'Servidor privado, sin terceros' },
        { k: 'Código', v: 'Open source' },
      ],

      // La línea de índice 1 se renderiza como FillWord (Anton, mayúsculas).
      manifesto: ['Un segundo cerebro', 'Privado', 'que vive entero', 'en tu bolsillo.'],
      thesis:
        'Los hábitos viven en una app, las notas en otra, el dinero en una tercera y ninguna se habla entre sí. Raccoony parte de la idea contraria: un solo sistema donde lo que haces por la mañana explica lo que gastas por la tarde, y donde la IA que lo lee no es de nadie más que tuya.',

      alarm: {
        label: 'LA PIEZA CENTRAL',
        title: 'Una alarma que no te cree',
        body: 'Apagar la alarma es el momento exacto en que se rompe el día. Aquí no se apaga con un botón: se apaga con una prueba. Le enseñas a la cámara la cocina recogida o el escritorio en orden, y un modelo de visión decide si eso cumple el objetivo que tú mismo escribiste la noche anterior.',
        steps: [
          { n: '01', t: 'Suena de verdad', d: 'Alarmas reales, varias a la vez, por días de la semana y con un objetivo escrito para cada una.' },
          { n: '02', t: 'Te pide la prueba', d: 'No hay botón de apagar. Hay una cámara y una frase: lo que prometiste hacer.' },
          { n: '03', t: 'La IA la revisa', d: 'Un modelo de visión en tu servidor compara la foto con el objetivo y responde sí o no.' },
          { n: '04', t: 'Empieza el día', d: 'Panel de sueño, comprobación de «¿sigues despierto?» y el resto del sistema esperando.' },
        ],
      },

      modules: {
        label: 'EL SISTEMA',
        title: 'Catorce módulos, una sola base de datos',
        body: 'Cada módulo funciona solo, pero ninguno vive aislado: la agenda lee tus hábitos, el copiloto lee tus notas y las analíticas cruzan a todos.',
        items: [
          { t: 'Hábitos', d: 'Heatmap estilo GitHub, rachas y categorías. La constancia se ve, no se recuerda.' },
          { t: 'Notas', d: 'Editor tipo Notion, dictado por voz y un grafo que enlaza solo las notas que hablan de lo mismo.' },
          { t: 'Alarma', d: 'Anti-procrastinación: sólo se apaga con una foto que demuestre que cumpliste.' },
          { t: 'Finanzas', d: 'Cuentas y transacciones. Describes el gasto con tus palabras y la IA lo clasifica.' },
          { t: 'Copiloto', d: 'Chat con memoria persistente y varias conversaciones, que conoce tus hábitos y tus notas.' },
          { t: 'Agenda', d: 'Planeación nocturna con línea de tiempo arrastrable y un ritual para cerrar el día.' },
          { t: 'Biblioteca', d: 'Lector EPUB y PDF con voz, marcador automático y libros compartidos desde otras apps.' },
          { t: 'Noticias', d: 'Un resumen diario, generado solo.' },
          { t: 'Analíticas', d: 'Correlaciones entre sueño, hábitos, dinero y ejercicio, más una revisión semanal.' },
          { t: 'Ejercicio', d: 'Running y fotos de progreso físico, con galería y estadísticas de evolución.' },
          { t: 'Mi Personaje', d: 'Héroes en pixel art que suben de nivel con tu constancia. Cosméticos y logros.' },
          { t: 'Bóveda', d: 'Espacio cifrado bajo huella o PIN para lo que no puede estar en ninguna nube.' },
          { t: 'Captura rápida', d: 'Anotar algo al vuelo sin abrir la app entera.' },
          { t: 'Pomodoro', d: 'Temporizador con «modo monje»: las distracciones sólo vuelven en los descansos.' },
        ],
      },

      screens: {
        label: 'PANTALLAS',
        title: 'Tres de las diez',
        items: [
          {
            src: '/raccoony/habitos.webp',
            t: 'Hábitos',
            d: 'La portada del día. Nivel, HP y progreso arriba; abajo cada hábito con su racha, su semana y su contador. El de agua se suma con el +, los binarios con el círculo del día.',
          },
          {
            src: '/raccoony/analiticas.webp',
            t: 'Analíticas',
            d: 'Siete, treinta o noventa días. Cada tarjeta es una métrica con su curva y su comparación contra el periodo anterior — incluidas las que aún no tienen datos, que se declaran vacías en vez de fingir un cero.',
          },
          {
            src: '/raccoony/personaje.webp',
            t: 'Mi Personaje',
            d: 'La capa de juego. El héroe sube de nivel con tu constancia real, el bazar gasta monedas ganadas y los logros se enganchan a hábitos, alarma, finanzas y notas.',
          },
        ],
      },

      design: {
        label: 'SISTEMA DE DISEÑO',
        title: 'Neumorfismo sin castigar los ojos',
        body: 'El neumorfismo tiene mala fama porque casi siempre se hace mal: todo al mismo tono, contraste por debajo del mínimo legible y botones que no parecen botones. Aquí la superficie es suave, pero la jerarquía no: el texto va en tinta plena, los estados los marca el color y el relieve se encarga sólo de decir qué se puede tocar.',
        principles: [
          { t: 'Dos luces, una dirección', d: 'Cada superficie lleva la misma sombra clara arriba-izquierda y la misma oscura abajo-derecha. Una sola fuente de luz para toda la app.' },
          { t: 'El relieve significa', d: 'Elevado se toca, hundido está activo o en curso, plano es sólo información. La profundidad es gramática, no adorno.' },
          { t: 'El color lo pone el estado', d: 'La superficie es neutra siempre; el verde, el índigo o el rojo aparecen únicamente para marcar progreso, categoría o alerta.' },
        ],
        demoLabel: 'LOS TRES ESTADOS',
        demo: [
          { t: 'Elevado', d: 'Se puede tocar' },
          { t: 'Hundido', d: 'Activo o en curso' },
          { t: 'Plano', d: 'Sólo informa' },
        ],
        paletteLabel: 'ACENTOS',
        palette: [
          { name: 'Progreso', hex: '#12A05E' },
          { name: 'Categoría', hex: '#7C6CF0' },
          { name: 'Racha', hex: '#F5892A' },
          { name: 'Vital', hex: '#E5484D' },
          { name: 'Métrica', hex: '#2B8FD8' },
        ],
      },

      arch: {
        label: 'ARQUITECTURA',
        title: 'La IA no es de nadie más',
        body: 'Chat, grafo de notas, clasificación de gastos y validación de fotos pasan todos por el mismo sitio: un servidor propio. No hay llamadas a proveedores externos, no hay cuentas de terceros y no hay una política de privacidad que leer — la frontera de tus datos es una máquina que tú controlas.',
        pillars: [
          { k: 'EN EL TELÉFONO', t: 'La app', d: 'Toda la interfaz, la base de datos local y la bóveda cifrada bajo huella o PIN.' },
          { k: 'EN TU SERVIDOR', t: 'La inteligencia', d: 'Modelos de lenguaje y de visión: copiloto, enlaces entre notas, gastos descritos en voz alta y la foto que apaga la alarma.' },
          { k: 'HACIA FUERA', t: 'Nada', d: 'Sin proveedores de IA externos. Y las actualizaciones llegan solas, sin pasar por ninguna tienda de aplicaciones.' },
        ],
      },

      outro: {
        title: 'El código está abierto',
        body: 'Raccoony es open source: el repositorio tiene la app, el servidor y las instrucciones para levantarlo en tu propia máquina.',
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
      directMessageBtn: 'envíame un mensaje',
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
      home: 'Back to home',
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
      caseStudy: 'CASE STUDY',
      viewCase: 'VIEW CASE STUDY',
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
        KAMMEL: {
          title: 'SSH Client for Android',
          sub: 'Open-source terminal and code editor',
          desc: 'All-in-one mobile app: SSH client, terminal, SFTP file explorer and code editor. Runs AI coding agents (Claude Code, Gemini CLI) directly over SSH.',
          loc: 'Open source (2026)',
        },
        RACCOONY: {
          title: 'AI life analyser',
          sub: 'Mobile app built to improve how you live',
          desc: 'Habits, linked notes, finances, planner and an alarm that only switches off once you prove with a photo that you actually did it. All the AI runs on a private server.',
          loc: 'Android · Open source (2026)',
        },
      },
    },
    raccoony: {
      eyebrow: 'CASE STUDY',
      title: 'RACCOONY',
      tagline: ['An AI-powered life analyser', 'built to improve how you live.'],
      lead: 'Habits, linked notes, finances, planner, reading and exercise in one place, cross-referenced to show you what is working for you and what is not. Every bit of artificial intelligence runs on a private server, so not a single data point ever reaches a third party.',
      ctaRepo: 'View on GitHub',
      ctaTour: 'Tour the app',
      back: 'Back to projects',
      coverAlt: 'Raccoony cover art next to the Habits screen',
      meta: [
        { k: 'Role', v: 'Product, design and engineering' },
        { k: 'Year', v: '2026' },
        { k: 'Platform', v: 'Android · self-hosted APK' },
        { k: 'Visual language', v: 'Neumorphism, light and dark' },
        { k: 'AI', v: 'Private server, no third parties' },
        { k: 'Code', v: 'Open source' },
      ],

      manifesto: ['A second brain', 'Private', 'that lives entirely', 'in your pocket.'],
      thesis:
        'Habits live in one app, notes in another, money in a third, and none of them talk to each other. Raccoony starts from the opposite idea: a single system where what you do in the morning explains what you spend in the afternoon, and where the AI reading all of it belongs to nobody but you.',

      alarm: {
        label: 'THE CENTREPIECE',
        title: 'An alarm that does not believe you',
        body: 'Switching off the alarm is the exact moment a day breaks. Here it does not switch off with a button — it switches off with proof. You show the camera the tidy kitchen or the cleared desk, and a vision model decides whether that meets the goal you wrote yourself the night before.',
        steps: [
          { n: '01', t: 'It really rings', d: 'Real alarms, several at once, per weekday, each with a written goal of its own.' },
          { n: '02', t: 'It asks for proof', d: 'There is no dismiss button. There is a camera and a sentence: what you promised to do.' },
          { n: '03', t: 'The AI checks it', d: 'A vision model on your server compares the photo against the goal and answers yes or no.' },
          { n: '04', t: 'The day begins', d: 'Sleep panel, an "are you still awake?" check and the rest of the system waiting.' },
        ],
      },

      modules: {
        label: 'THE SYSTEM',
        title: 'Fourteen modules, one database',
        body: 'Every module works on its own, but none of them lives in isolation: the planner reads your habits, the copilot reads your notes and the analytics cross all of them.',
        items: [
          { t: 'Habits', d: 'GitHub-style heatmap, streaks and categories. Consistency becomes visible instead of remembered.' },
          { t: 'Notes', d: 'Notion-style editor, voice dictation and a graph that links notes about the same thing on its own.' },
          { t: 'Alarm', d: 'Anti-procrastination: it only switches off with a photo proving you did it.' },
          { t: 'Finances', d: 'Accounts and transactions. Describe the expense in your own words and the AI files it.' },
          { t: 'Copilot', d: 'Chat with persistent memory and parallel conversations, aware of your habits and notes.' },
          { t: 'Planner', d: 'Nightly planning with a draggable timeline and a guided ritual to close the day.' },
          { t: 'Library', d: 'EPUB and PDF reader with text-to-speech, automatic bookmarks and books shared from other apps.' },
          { t: 'News', d: 'A daily digest, generated on its own.' },
          { t: 'Analytics', d: 'Correlations across sleep, habits, money and exercise, plus a weekly review.' },
          { t: 'Exercise', d: 'Running logs and physical progress photos, with a gallery and evolution stats.' },
          { t: 'My Character', d: 'Pixel-art heroes that level up on your real consistency. Cosmetics and achievements.' },
          { t: 'Vault', d: 'Encrypted space behind fingerprint or PIN for what cannot sit in any cloud.' },
          { t: 'Quick capture', d: 'Jot something down on the fly without opening the whole app.' },
          { t: 'Pomodoro', d: 'Focus timer with "monk mode": distractions only come back during breaks.' },
        ],
      },

      screens: {
        label: 'SCREENS',
        title: 'Three of the ten',
        items: [
          {
            src: '/raccoony/habitos.webp',
            t: 'Habits',
            d: 'The cover of the day. Level, HP and progress on top; below, each habit with its streak, its week and its counter. Water adds up with the +, binary ones with the day circle.',
          },
          {
            src: '/raccoony/analiticas.webp',
            t: 'Analytics',
            d: 'Seven, thirty or ninety days. Each card is a metric with its curve and its comparison against the previous period — including the ones with no data yet, which declare themselves empty instead of faking a zero.',
          },
          {
            src: '/raccoony/personaje.webp',
            t: 'My Character',
            d: 'The game layer. The hero levels up on real consistency, the bazaar spends earned coins and achievements hook into habits, alarm, finances and notes.',
          },
        ],
      },

      design: {
        label: 'DESIGN SYSTEM',
        title: 'Neumorphism without punishing the eye',
        body: 'Neumorphism has a bad name because it is almost always done badly: everything at one tone, contrast below the legible minimum and buttons that do not look like buttons. Here the surface is soft but the hierarchy is not: text sits in full ink, colour carries state, and relief is only responsible for saying what can be touched.',
        principles: [
          { t: 'Two lights, one direction', d: 'Every surface carries the same light shadow top-left and the same dark one bottom-right. A single light source for the whole app.' },
          { t: 'Relief means something', d: 'Raised is touchable, sunken is active or in progress, flat is information only. Depth is grammar, not decoration.' },
          { t: 'State brings the colour', d: 'The surface is always neutral; green, indigo or red show up purely to mark progress, category or alert.' },
        ],
        demoLabel: 'THE THREE STATES',
        demo: [
          { t: 'Raised', d: 'Can be touched' },
          { t: 'Sunken', d: 'Active or ongoing' },
          { t: 'Flat', d: 'Informs only' },
        ],
        paletteLabel: 'ACCENTS',
        palette: [
          { name: 'Progress', hex: '#12A05E' },
          { name: 'Category', hex: '#7C6CF0' },
          { name: 'Streak', hex: '#F5892A' },
          { name: 'Vitals', hex: '#E5484D' },
          { name: 'Metric', hex: '#2B8FD8' },
        ],
      },

      arch: {
        label: 'ARCHITECTURE',
        title: 'The AI belongs to nobody else',
        body: 'Chat, the note graph, expense classification and photo validation all go through the same place: a server of your own. There are no calls to external providers, no third-party accounts and no privacy policy to read — the border of your data is a machine you control.',
        pillars: [
          { k: 'ON THE PHONE', t: 'The app', d: 'The whole interface, the local database and the vault encrypted behind fingerprint or PIN.' },
          { k: 'ON YOUR SERVER', t: 'The intelligence', d: 'Language and vision models: copilot, links between notes, expenses described out loud and the photo that turns off the alarm.' },
          { k: 'OUTWARDS', t: 'Nothing', d: 'No external AI providers. And updates arrive on their own, without going through any app store.' },
        ],
      },

      outro: {
        title: 'The code is open',
        body: 'Raccoony is open source: the repository holds the app, the server and the instructions to stand it up on your own machine.',
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
      directMessageBtn: 'send me a message',
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
