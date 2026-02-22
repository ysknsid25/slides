---
theme: '@ysknsid25/slidev-theme'
title: サンプルスライド
colorSchema: light
transition: fade
date: '2025-02-22'
description: 'Slidevを使ったスライド管理のサンプルです。'
favicon: '/icon.png'
ogImage: 'https://slides-afd16.web.app/sample/og-image.png'
# カバースライド用プロフィール情報
layout: cover
avatar: /icon.png
name: Kanon
github: ysknsid25
twitter: ysknsid25
command: 'npx deno run jsr:@ysknsid25/whois'
hashtag: nankanohash
---

# サンプルのタイトル

---
layout: default
---

## 箇条書きリスト（ul）

- **Slidev** によるスライド管理
- `hatena-blog-theme-git` のデザインを継承
- Firebase Hosting でホスティング
- ネストのサンプル
  - サブアイテム 1
  - サブアイテム 2

---
layout: default
---

## 番号付きリスト（ol）

1. リポジトリをクローン
2. `pnpm install` で依存関係をインストール
3. `pnpm new-talk <name>` で新規スライドを作成
4. `slides.md` を編集してプレゼンを作成
5. `master` にプッシュして Firebase へ自動デプロイ

---
layout: default
---

## コードサンプル

```typescript
const greet = (name: string): string => {
  return `Hello, ${name}!`
}

console.log(greet('World'))
```

---
layout: default
---

## 右寄せのサンプル
contentAlign: right

---
layout: default
contentAlign: right
---

## 右寄せテキスト

- 右寄せのリストアイテム
- `contentAlign: right` で指定

---
layout: content
---

見出しなしの **content** レイアウトです。

画像や本文を単体で表示するときに使います。

---
layout: content
contentAlign: left
---

左寄せの content レイアウト。

- リストも表示できます
- `contentAlign: left` を指定

---
layout: default
---

## まとめ

- デザインが **統一** されている
- `#F14E32` のアクセントカラー
- `Roboto Slab` フォント

> このスライドは hatena-blog-theme-git のデザイントークンを使用しています。
