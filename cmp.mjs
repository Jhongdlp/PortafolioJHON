import { chromium } from '/home/jhon/Documentos/PORTAFOLIOJHONGDLP/node_modules/playwright/index.mjs'
const DIR = '/tmp/claude-1000/-home-jhon-Documentos-PORTAFOLIOJHONGDLP/66055c4b-ec25-49ea-bca7-e6e224000ddd/scratchpad'
const b = await chromium.launch()
const p = await b.newPage()
await p.setViewportSize({ width: 1440, height: 900 })
await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' })
await p.waitForTimeout(5000)
await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
await p.waitForTimeout(2000)
// aire extra abajo: si las letras estaban cortadas, ahora aparecerán los remates
await p.evaluate(() => { document.querySelector('footer').style.paddingBottom = '70px' })
await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
await p.waitForTimeout(500)
const f = await p.locator('footer').boundingBox()
await p.screenshot({ path: `${DIR}/cmp-air.png`, clip: { x: 0, y: 900 - 320, width: 1440, height: 320 } })
await b.close()
