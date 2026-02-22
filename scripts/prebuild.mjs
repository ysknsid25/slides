/**
 * prebuild.mjs
 *
 * ビルド前に自動で以下を行う:
 * 1. 環境変数 FIREBASE_PROJECT_ID からFirebase Hosting のベースURLを取得
 * 2. talks/*\/slides.md の ogImage を正しいURLに更新
 * 3. talks の一覧から dist/index.html を生成（日付順ソート）
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, copyFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')

// ── 1. Firebase Hosting ベースURLを取得 ───────────────────────────────────

const projectId = process.env.FIREBASE_PROJECT_ID
if (!projectId) throw new Error('FIREBASE_PROJECT_ID environment variable is not set')
const baseUrl = process.env.BASE_URL ?? `https://${projectId}.web.app`

// ── 2. talks/*/slides.md の ogImage を更新 ───────────────────────────────

const talksDir = join(ROOT, 'talks')
const talkNames = readdirSync(talksDir).filter(name => {
  const fullPath = join(talksDir, name)
  return statSync(fullPath).isDirectory() && existsSync(join(fullPath, 'slides.md'))
})

const talksMeta = []

for (const name of talkNames) {
  const slidesMdPath = join(talksDir, name, 'slides.md')
  let content = readFileSync(slidesMdPath, 'utf-8')

  const ogImageUrl = `${baseUrl}/${name}.png`

  if (content.includes('ogImage:')) {
    content = content.replace(/ogImage:.*/, `ogImage: '${ogImageUrl}'`)
  } else {
    content = content.replace(/^---\n/, `---\nogImage: '${ogImageUrl}'\n`)
  }

  writeFileSync(slidesMdPath, content)
  console.log(`  ✓ ogImage updated: talks/${name}/slides.md`)

  // frontmatter からメタデータを抽出
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

// ── 3. dist/index.html を生成 ─────────────────────────────────────────────

const distDir = join(ROOT, 'dist')
mkdirSync(distDir, { recursive: true })

const glowBgJs = readFileSync(join(ROOT, 'vendor/hatena-blog-theme-git/js/glow-bg.js'), 'utf-8')

// YYYY-MM-DD → YYYY/MM/DD
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.replace(/-/g, '/')
}

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
      border-bottom: 2px solid #EFEEE6;
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
  <script>${glowBgJs}</script>
</body>
</html>
`

writeFileSync(join(distDir, 'index.html'), indexHtml)

// icon.png をルートにコピー（favicon用）
const iconDist = join(distDir, 'icon.png')
let iconCopied = false
for (const name of talkNames) {
  const src = join(talksDir, name, 'public/icon.png')
  if (existsSync(src)) {
    copyFileSync(src, iconDist)
    console.log(`  ✓ Copied icon.png to dist/ (from talks/${name}/public/)`)
    iconCopied = true
    break
  }
}
if (!iconCopied) {
  console.log(`  ⚠ icon.png not found in any talks/*/public/ — favicon will be missing`)
}

console.log(`  ✓ Generated dist/index.html (${talksMeta.length} talks)`)
console.log(`  ✓ Base URL: ${baseUrl}`)
