<div align="center">

<img src="public/icon.png" width="72" alt="Logo" />

# Jhon G. — Portafolio

Sitio personal de una sola página construido con Next.js 15 y un carrusel 3D de proyectos hecho a mano.

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-black?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## Vista rápida

| Sección | Qué hace |
|---|---|
| **Hero** | Nombre a gran escala, nav y retrato con animaciones de entrada (Framer Motion) |
| **About** | Manifiesto editorial con reveals de texto propios (`LineReveal`, `FillWord`) |
| **Projects** | Carrusel 3D controlado por scroll/drag/touch, con efecto de vidrio líquido vía `feDisplacementMap` |

Sin routing, sin backend: es una página, hecha para verse bien y cargar rápido.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion

## Empezar

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # build de producción
```

## Estructura

```
app/                 # layout + página única
components/
  Hero.tsx           # headline + retrato
  About.tsx          # manifiesto + stack/capacidades
  Projects.tsx        # carrusel 3D (la pieza más compleja)
  CustomCursor.tsx    # cursor custom con trail, dirige rAF propio
```

Cada componente centraliza sus propios tokens de color al inicio del archivo — no hay un theme global, así que si tocas estilos revisa primero las constantes del componente.

## Actividad

<div align="center">
<img src="./github-metrics.svg" alt="métricas de GitHub" width="480" />
</div>

<sub>Generado automáticamente por GitHub Actions (ver <code>.github/workflows/metrics.yml</code>).</sub>

## Licencia

Código disponible con fines de referencia. El contenido, textos y diseño son propiedad de Jhon G.
