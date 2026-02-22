/**
 * capture-og.mjs
 * ビルド済み dist/{talkName}/ をローカルサーバーで配信し、
 * Playwright でスクリーンショットを撮って dist/{talkName}.png に保存する
 *
 * Usage: node scripts/capture-og.mjs <talkName>
 */

import { chromium } from 'playwright-chromium'
import { createServer } from 'http'
import { createReadStream, existsSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')

const talkName = process.argv[2]
if (!talkName) {
  console.error('Usage: node scripts/capture-og.mjs <talkName>')
  process.exit(1)
}

const distDir = join(ROOT, 'dist', talkName)
const outputPath = join(ROOT, 'dist', `${talkName}.png`)
const PORT = 9876

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
}

// シンプルな静的ファイルサーバー
const server = createServer((req, res) => {
  const url = req.url.split('?')[0]
  let filePath = join(distDir, url)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(distDir, 'index.html') // SPA フォールバック
  }
  res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream')
  createReadStream(filePath).on('error', () => {
    res.writeHead(404)
    res.end()
  }).pipe(res)
})

await new Promise(r => server.listen(PORT, 'localhost', r))

const browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewportSize({ width: 1960, height: 1104 })

try {
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: outputPath })
  console.log(`  ✓ OG image captured: dist/${talkName}.png`)
} catch (e) {
  console.error(`  ✗ Screenshot failed: ${e.message}`)
  process.exit(1)
} finally {
  await browser.close()
  server.close()
}
