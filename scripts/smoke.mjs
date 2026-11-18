import { chromium } from 'playwright-core'

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const chromePath = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const launchOptions = process.env.CHROME_PATH
  ? { executablePath: chromePath, headless: true }
  : process.platform === 'darwin'
    ? { executablePath: chromePath, headless: true }
    : { channel: 'chrome', headless: true }

const browser = await chromium.launch(launchOptions)
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`)
})

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })

  await page.getByRole('link', { name: /开始探险/ }).click()
  await page.waitForURL(/adventure\/g3a-u1/)

  const words = ['me', 'it', 'be', 'on', 'this', 'ruler', 'you', 'I']
  for (const [index, word] of words.entries()) {
    await page.getByRole('button', { name: /我记住啦/ }).click()
    await page.waitForTimeout(250)

    // 逐个尝试，直到选中正确图片（错误选项会被禁用）。
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (await page.locator('.feedback-banner--success').count()) break
      await page.locator('.listen-option:not([disabled])').first().click()
      await page.waitForTimeout(180)
    }
    await page.waitForSelector('.feedback-banner--success')
    await page.getByRole('button', { name: /去拼一拼/ }).click()
    await page.waitForTimeout(250)

    for (const char of word) {
      await page
        .locator('.letter-tile:not([disabled])')
        .filter({ hasText: new RegExp(`^${char}$`) })
        .first()
        .click()
    }
    await page.waitForSelector('.spell-success')
    await page.getByRole('button', { name: /继续探险/ }).click()
    await page.waitForTimeout(250)

    if (index === words.length - 1) break
  }

  await page.waitForSelector('.result-step')
  assert((await page.locator('.result-step h1').innerText()).includes('本组完成'), '没有到达本组结果页')

  const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('word-planet.progress.v1') ?? '{}'))
  assert(progress.words?.ruler?.stars === 3, 'ruler 没有拿到 3 颗星')
  assert(progress.words?.i?.stars === 3, 'I 没有拿到 3 颗星')
  assert(progress.completedSessions === 1, '完成探险次数没有落盘')

  await page.goto(`${baseUrl}/#/phrases`, { waitUntil: 'networkidle' })
  assert((await page.locator('.phrase-card').count()) > 0, '句型卡页面没有内容')
  assert(errors.length === 0, `页面出现错误：${errors.join(' | ')}`)

  console.log('✓ 冒烟测试通过：8 词分组、星星落盘、结果页、句型卡均正常')
} finally {
  await browser.close()
}
