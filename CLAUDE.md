# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm run start` — serve the production build

There is no lint or test script configured. `playwright` is a devDependency but no config or spec files exist yet — if adding tests, you'll need to create `playwright.config.ts` first.

## Architecture

This is a single-page portfolio site (Next.js 15 App Router, React 19, TypeScript, Tailwind v4). There is no routing beyond the one page.

- `app/layout.tsx` — root layout. Loads three Google fonts as CSS variables (`--font-anton` for display headlines, `--font-archivo` for body text, `--font-jetbrains` for mono/labels) and mounts `CustomCursor` globally. The `<body>` has `cursor: none` because the custom cursor replaces the native one everywhere.
- `app/page.tsx` — composes the page as `Hero` → `About` → `Projects`, in that order. Each is a self-contained full-viewport-height section.
- `components/CustomCursor.tsx` — a fixed-position, `mixBlendMode: 'difference'` cursor with a lerped trail (dot count/size/easing controlled by the `TRAIL`, `SIZES`, `LERPS` constants) plus a crosshair that tracks the raw mouse position. Driven by a single `requestAnimationFrame` loop, not React state, for performance.
- `components/Hero.tsx` — landing section: nav, giant `clamp()`-sized name headline, and a portrait image panel. Framer Motion handles entrance animations.
- `components/About.tsx` — editorial manifesto section with custom reveal primitives (`LineReveal` masks+blurs a line in, `FillWord` wipes a text fill left-to-right) and a two-column metadata/capabilities grid. Copy constants (`LOCATION`, `AVAILABILITY`, `STACK`, `CAPABILITIES`) live at the top of the file — edit those to update content.
- `components/Projects.tsx` — the most complex piece: a horizontal, wheel/drag/touch-driven 3D carousel of project cards (`PROJECTS` array holds the content). Key mechanics:
  - A single scroll progress value `t` (0..n, one unit per project) drives every card's position/rotation/opacity via `off = (i - t) + 1`.
  - Wheel events are intercepted with `passive: false` and only `preventDefault()`ed while mid-carousel, so scroll passes through to the page at the start/end boundaries.
  - Mouse drag and touch both remap horizontal movement to the same `t` value and snap to the nearest integer on release.
  - The "liquid glass" card effect is a custom SVG `feDisplacementMap` filter whose displacement map is generated at runtime on a `<canvas>` (`makeDispMap`) and applied via `backdropFilter: url(#liquidglass) ...`.

### Styling conventions

Almost all styling is inline (`style={{}}`) rather than Tailwind classes, even though Tailwind v4 is wired up via `app/globals.css` (`@import "tailwindcss"`). Follow the existing component's convention when editing it rather than mixing approaches within a file.

Shared design tokens are duplicated as local constants per component (e.g. `INK`, `BG`, `MUTE`, `FAINT`, `HAIR` in `About.tsx`) rather than centralized — check the top of the file you're editing for the current palette before introducing new colors. Core palette: `#16130F` (background), `#E9E4D6` (ink/text), `#F26321` (orange accent, hero/about), `#e10600` (red accent, projects section).

`app/globals.css` also defines section-scoped `::selection` colors (`.projects-section`, `.editorial-section`) and the global `cursor: none` needed by `CustomCursor`.

Path alias `@/*` maps to the repo root (see `tsconfig.json`).
