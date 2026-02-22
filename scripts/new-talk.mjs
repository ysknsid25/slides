/**
 * new-talk.mjs
 *
 * 新しい talk を talks/ 以下に生成するスキャフォールドスクリプト
 *
 * Usage:
 *   pnpm new-talk <talk-name> [description]
 *   pnpm new-talk 2024-01-my-presentation "発表のひとこと説明"
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')

const name = process.argv[2]
const description = process.argv[3] || ''

if (!name) {
  console.error('Error: talk名を指定してください')
  console.error('Usage: pnpm new-talk <talk-name> [description]')
  console.error('Example: pnpm new-talk 2024-01-my-presentation "発表のひとこと説明"')
  process.exit(1)
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('Error: talk名は小文字英数字とハイフンのみ使用できます')
  process.exit(1)
}

const talkDir = join(ROOT, 'talks', name)

if (existsSync(talkDir)) {
  console.error(`Error: talks/${name} はすでに存在します`)
  process.exit(1)
}

mkdirSync(talkDir, { recursive: true })

// ── package.json ──────────────────────────────────────────────────────────

const packageJson = {
  name: `@slides/${name}`,
  private: true,
  scripts: {
    dev: 'slidev slides.md',
    build: `slidev build slides.md --base /${name}/ --out ../../dist/${name}`,
    'export:og': `slidev export slides.md --format png --range 1 --output ../../dist/${name}/og-image`,
  },
  dependencies: {
    '@slidev/cli': '^0.50.0',
    '@slidev/theme-default': 'latest',
    '@ysknsid25/slidev-theme': 'workspace:*',
  },
}

writeFileSync(join(talkDir, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n')

// ── slides.md (ogImage は prebuild 時に自動設定される) ────────────────────

const today = new Date().toISOString().slice(0, 10)
const descriptionLine = description ? `\ndescription: '${description}'` : ''

const slidesMd = `---
theme: '@ysknsid25/slidev-theme'
title: ${name}
colorSchema: light
transition: fade
date: '${today}'${descriptionLine}
layout: cover
avatar: /icon.png
name: Kanon
github: ysknsid25
twitter: ysknsid25
command: 'npx deno run jsr:@ysknsid25/whois'
hashtag: nankanohash
---

# タイトルを入力

---
layout: default
---

## スライド 1

内容を書いてください。

---
layout: default
---

## スライド 2

内容を書いてください。
`

writeFileSync(join(talkDir, 'slides.md'), slidesMd)

// ── 完了メッセージ ─────────────────────────────────────────────────────────

console.log(`✓ talks/${name}/ を作成しました`)
console.log(``)
console.log(`次のステップ:`)
console.log(`  1. pnpm install              # ワークスペースに追加`)
console.log(`  2. pnpm --filter @slides/${name} dev   # 開発サーバー起動`)
console.log(`  3. talks/${name}/slides.md を編集`)
