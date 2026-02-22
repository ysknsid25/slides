/**
 * prebuild.mjs
 *
 * ビルド前に自動で以下を行う:
 * 1. .firebaserc からFirebase Hosting のベースURLを取得
 * 2. talks/*\/slides.md の ogImage を正しいURLに更新
 * 3. talks の一覧から dist/index.html を生成
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')

// ── 1. Firebase Hosting ベースURLを取得 ───────────────────────────────────

const firebaserc = JSON.parse(readFileSync(join(ROOT, '.firebaserc'), 'utf-8'))
const projectId = firebaserc.projects.default
const baseUrl = `https://${projectId}.web.app`

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

  const ogImageUrl = `${baseUrl}/${name}/og-image.png`

  if (content.includes('ogImage:')) {
    content = content.replace(/ogImage:.*/, `ogImage: '${ogImageUrl}'`)
  } else {
    // frontmatter の最初の --- の直後に挿入
    content = content.replace(/^---\n/, `---\nogImage: '${ogImageUrl}'\n`)
  }

  writeFileSync(slidesMdPath, content)
  console.log(`  ✓ ogImage updated: talks/${name}/slides.md`)

  // タイトルを frontmatter から抽出
  const titleMatch = content.match(/^title:\s*(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : name

  talksMeta.push({ name, title, url: `/${name}/` })
}

// ── 3. dist/index.html を生成 ─────────────────────────────────────────────

const distDir = join(ROOT, 'dist')
mkdirSync(distDir, { recursive: true })

const cards = talksMeta.map(({ name, title, url }) => `    <a class="slide-card" href="${url}">
      <div class="card-thumb">
        <img src="${url}og-image.png" alt="${title}" loading="lazy" onerror="this.style.display='none'" />
      </div>
      <h2>${title}</h2>
    </a>`).join('\n')

const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slides</title>
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
      border-bottom: 2px solid #F14E32;
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
    .slide-card h2 {
      font-size: 1rem;
      color: #F14E32;
      padding: 0.75rem 1rem;
    }
    .slide-card h2::before { content: '## '; color: #f47d65; }
  </style>
</head>
<body>
  <header><h1>Slides</h1></header>
  <main class="slides-grid">
${cards}
  </main>
</body>
</html>
`

writeFileSync(join(distDir, 'index.html'), indexHtml)

console.log(`  ✓ Generated dist/index.html (${talksMeta.length} talks)`)
console.log(`  ✓ Base URL: ${baseUrl}`)
