/**
 * gen-index.mjs
 *
 * dist/ に存在するビルド済みスライドを前提として dist/index.html を再生成する。
 * 全スライドを再ビルドせずにトップページだけ更新したいときに使う。
 *
 * ベースURLの決定順:
 *   1. 環境変数 FIREBASE_PROJECT_ID → https://${projectId}.web.app
 *   2. 環境変数 BASE_URL
 *   3. talks/<name>/slides.md の ogImage フィールドから自動抽出
 *   4. 上記すべて未設定の場合は '' (相対パス)
 *
 * Usage:
 *   pnpm gen-index
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, copyFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const distDir = join(ROOT, 'dist')
const talksDir = join(ROOT, 'talks')

// ── 1. ベースURLを決定 ────────────────────────────────────────────────────

let baseUrl = ''

if (process.env.FIREBASE_PROJECT_ID) {
  baseUrl = process.env.BASE_URL ?? `https://${process.env.FIREBASE_PROJECT_ID}.web.app`
} else if (process.env.BASE_URL) {
  baseUrl = process.env.BASE_URL
} else {
  // talks/*/slides.md の ogImage から https://xxx.web.app 部分を抽出
  const talkDirs = existsSync(talksDir)
    ? readdirSync(talksDir).filter(n => statSync(join(talksDir, n)).isDirectory())
    : []
  for (const name of talkDirs) {
    const mdPath = join(talksDir, name, 'slides.md')
    if (!existsSync(mdPath)) continue
    const content = readFileSync(mdPath, 'utf-8')
    const m = content.match(/^ogImage:\s*['"]?(https?:\/\/[^/'"]+)/m)
    if (m) { baseUrl = m[1]; break }
  }
  if (baseUrl) {
    console.log(`  ℹ baseUrl を ogImage から推定: ${baseUrl}`)
  } else {
    console.log(`  ⚠ baseUrl を特定できなかったため相対パスで生成します`)
  }
}

// ── 2. dist/ に存在するビルド済みスライドを走査 ────────────────────────────

if (!existsSync(distDir)) {
  console.error('Error: dist/ が見つかりません。先にスライドをビルドしてください。')
  process.exit(1)
}

const builtNames = readdirSync(distDir).filter(name => {
  const fullPath = join(distDir, name)
  return statSync(fullPath).isDirectory()
})

if (builtNames.length === 0) {
  console.error('Error: dist/ にビルド済みのスライドが見つかりません。')
  process.exit(1)
}

// ── 3. talks/*/slides.md からメタデータを取得 ─────────────────────────────

const talksMeta = []

for (const name of builtNames) {
  const mdPath = join(talksDir, name, 'slides.md')
  if (!existsSync(mdPath)) {
    console.log(`  ⚠ talks/${name}/slides.md が見つからないためスキップします`)
    continue
  }
  const content = readFileSync(mdPath, 'utf-8')

  const titleMatch = content.match(/^title:\s*(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : name

  const dateMatch = content.match(/^date:\s*['"]?(.+?)['"]?$/m)
  const date = dateMatch ? dateMatch[1].trim() : null

  const descriptionMatch = content.match(/^description:\s*['"]?(.+?)['"]?$/m)
  const description = descriptionMatch ? descriptionMatch[1].trim() : ''

  talksMeta.push({ name, title, date, description, url: `/${name}/` })
}

// 日付の新しい順にソート（dateなしは末尾）
talksMeta.sort((a, b) => {
  if (!a.date && !b.date) return 0
  if (!a.date) return 1
  if (!b.date) return -1
  return b.date.localeCompare(a.date)
})

// ── 4. dist/index.html を生成 ─────────────────────────────────────────────

const glowBgJsPath = join(ROOT, 'vendor/hatena-blog-theme-git/js/glow-bg.js')
const glowBgJs = existsSync(glowBgJsPath) ? readFileSync(glowBgJsPath, 'utf-8') : ''

const formatDate = (dateStr) => dateStr ? dateStr.replace(/-/g, '/') : ''

const cards = talksMeta.map(({ name, title, date, description, url }) => `    <a class="slide-card" href="${url}">
      <div class="card-thumb">
        <img src="/${name}.png" alt="${title}" loading="lazy" onerror="this.style.display='none'" />
      </div>
      <div class="card-body">
        <h2>${title}</h2>
        ${description ? `<p class="description">${description}</p>` : ''}
        ${date ? `<time class="date" datetime="${date}">${formatDate(date)}</time>` : ''}
      </div>
    </a>`).join('\n')

const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slides</title>
  <link rel="icon" href="/icon.png" type="image/png" />
  <meta property="og:title" content="Slides" />
  <meta property="og:description" content="スライド一覧" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/" />
  <meta property="og:image" content="${baseUrl}/icon.png" />
  <meta name="twitter:card" content="summary" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Roboto Slab', serif;
      background: #F0EFE7;
      color: #4E443C;
      min-height: 100vh;
      padding: 2rem;
    }
    header {
      border-bottom: 2px solid #9a9994;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    header h1 { font-size: 2rem; color: #F14E32; }
    header h1::before { content: '# '; color: #f47d65; }
    .slides-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .slide-card {
      background: #ffffff;
      border: 1px solid #EFEEE6;
      border-radius: 6px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s;
    }
    .slide-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .card-thumb {
      aspect-ratio: 16/9;
      background: #E9E8E0;
      overflow: hidden;
    }
    .card-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .card-body {
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .slide-card h2 {
      font-size: 1rem;
      color: #F14E32;
    }
    .description {
      font-size: 0.85rem;
      color: #777;
    }
    .date {
      font-size: 0.8rem;
      color: #9a9994;
      text-align: right;
      margin-top: auto;
      padding-top: 0.25rem;
    }
  </style>
</head>
<body>
  <header><h1>Slides</h1></header>
  <main class="slides-grid">
${cards}
  </main>
  ${glowBgJs ? `<script>${glowBgJs}</script>` : ''}
</body>
</html>
`

writeFileSync(join(distDir, 'index.html'), indexHtml)
console.log(`  ✓ dist/index.html を再生成しました (${talksMeta.length} talks)`)
console.log(`  ✓ baseUrl: ${baseUrl || '(相対パス)'}`)
