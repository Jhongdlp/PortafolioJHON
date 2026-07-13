import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3001', { waitUntil: 'load', timeout: 150000 })
await p.waitForTimeout(2500)

const sec = p.locator('section.projects-section')
const box = await sec.evaluate(el => ({ h: el.offsetHeight, top: el.getBoundingClientRect().top + window.scrollY }))
console.log('rail height:', box.h, 'starts at y=', Math.round(box.top), 'viewport 900')

// Lleva la página justo al inicio del raíl, luego avanza con la RUEDA sin clic previo.
await p.evaluate(y => window.scrollTo({ top: y, behavior: 'auto' }), box.top)
await p.waitForTimeout(300)

const probe = () => p.evaluate(() => {
  const stage = document.querySelector('section.projects-section > div')
  const cards = [...document.querySelectorAll('a[data-cursor-label]')]
  const cx = window.innerWidth / 2
  const centered = cards.map((c, i) => {
    const r = c.getBoundingClientRect()
    return { i, dx: Math.round(r.left + r.width / 2 - cx), op: +getComputedStyle(c.closest('div[style*="perspective"]') ? c.parentElement.parentElement : c).opacity }
  })
  return {
    scrollY: Math.round(window.scrollY),
    stageTop: Math.round(stage.getBoundingClientRect().top),
    cards: centered.map(c => c.dx),
  }
})

console.log('at rail start   ', await probe())
for (const step of [1, 2, 3, 4, 5, 6]) {
  await p.mouse.wheel(0, 600)   // rueda sobre la página, SIN clic ni drag previo
  await p.waitForTimeout(250)
  console.log(`after wheel x${step}`, await probe())
}
await b.close()
