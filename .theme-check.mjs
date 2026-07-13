import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE:', m.text()) })
page.setDefaultTimeout(90000)
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 90000 })

for (let i = 1; i <= 6; i++) {
  await page.waitForTimeout(2000)
  const s = await page.evaluate(() => {
    const pre = [...document.body.children].find(
      el => el.getAttribute?.('style')?.includes('z-index:9998') && el.getAttribute('style').includes('--bg-deep'))
    return { preloader: !!pre, texto: pre?.innerText?.replace(/\n/g, '|').slice(0, 24) ?? null }
  })
  console.log(`t=${i * 2}s`, JSON.stringify(s))
}
await browser.close()
