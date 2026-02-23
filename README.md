# slides

[Slidev](https://sli.dev/) を使ったプレゼンテーション管理リポジトリ。

pnpm workspaces によるモノレポ構成で、複数のスライドを一元管理し Firebase Hosting で公開します。
デザインは [hatena-blog-theme-git](https://github.com/ysknsid25/hatena-blog-theme-git) と統一しています。

## プロジェクト構成

```
slides/
├── .github/workflows/
│   ├── firebase-hosting-merge.yml      # master push → ビルド → Firebase デプロイ
│   └── firebase-hosting-pull-request.yml
│
├── packages/
│   └── theme/                          # カスタム Slidev テーマ (@ysknsid25/slidev-theme)
│       ├── layouts/
│       │   ├── cover.vue               # カバーレイアウト
│       │   └── default.vue             # 標準レイアウト
│       └── styles/
│           └── index.scss              # デザイントークン定義
│
├── scripts/
│   ├── prebuild.mjs                    # ビルド前処理（ogImage 更新・一覧ページ生成）
│   ├── gen-index.mjs                   # ビルド済みスライドから index.html だけ再生成
│   └── new-talk.mjs                    # 新規スライド作成スクリプト
│
├── talks/                              # スライド置き場
│   └── sample/                        # スライド例
│       ├── slides.md
│       └── package.json
│
├── vendor/
│   └── hatena-blog-theme-git/          # git submodule（デザイン参照元）
│
├── firebase.json
├── package.json
└── pnpm-workspace.yaml
```

## セットアップ

```bash
# サブモジュールを含めてクローン
git clone --recurse-submodules https://github.com/ysknsid25/slides.git
cd slides

# 依存関係インストール
pnpm install
```

## 新しいスライドを作る

### 1. スキャフォールドを生成する

```bash
pnpm new-talk <talk-name> [description]
```

- `talk-name`: 小文字英数字とハイフンのみ（例: `2025-03-my-talk`）
- `description`: 一覧ページに表示する説明文（省略可）

```bash
# 例
pnpm new-talk 2025-03-my-talk "TypeScriptの型システムについて"
```

以下のファイルが自動生成されます。

```
talks/2025-03-my-talk/
├── slides.md       ← タイトル・日付・description が設定済み
└── package.json    ← ビルドパスが自動設定済み
```

### 2. 依存関係を追加する

```bash
pnpm install
```

### 3. 開発サーバーを起動する

```bash
pnpm --filter @slides/2025-03-my-talk dev
```

ブラウザで http://localhost:3030 を開くとリアルタイムプレビューが表示されます。

### 4. slides.md を編集する

frontmatter で基本情報を設定します。

```yaml
---
theme: '@ysknsid25/slidev-theme'
title: 発表タイトル
colorSchema: light          # light | dark
date: '2025-03-01'          # 一覧ページの表示・ソートに使用
description: '発表の説明'    # 一覧ページのカードに表示
---
```

## レイアウト

テーマには2種類のレイアウトが用意されています。スライドの `layout:` に指定して使います。

### `cover`（カバー）

表紙スライド向け。タイトルが左上に大きく表示され、左下にプロフィール、右下にハッシュタグが配置されます。

```yaml
---
layout: cover
avatar: /icon.png              # public/ 以下のアイコン画像パス
name: Kanon                    # 表示名
github: ysknsid25              # GitHub ハンドル（省略可）
twitter: ysknsid25             # X ハンドル（省略可）
command: 'npx deno run ...'    # コマンド表示（省略可）
hashtag: nankanohash           # ハッシュタグ（省略可、# は自動付与）
---

# 発表タイトル
```

アイコン画像は各 talk の `public/icon.png` に置いてください。

```
talks/my-talk/
├── public/
│   └── icon.png    ← アイコン画像
└── slides.md
```

### `default`（標準）

本文スライド向け。`2rem 3rem` のパディングが付きます。
`h1` には `# `、`h2` には `## ` が前置されます。

```md
---
layout: default
---

## スライドタイトル

内容を書いてください。
```

## デプロイ

### 全スライドをまとめてデプロイ

`master` ブランチに push すると GitHub Actions が自動で以下を実行します。

1. `pnpm build` — 全スライドをビルド（事前に ogImage URL・一覧ページを自動生成）
2. `pnpm export:og` — 各スライドの1枚目を PNG 出力（OGP 画像）
3. Firebase Hosting へデプロイ

公開 URL の構成:

```
https://slides-afd16.web.app/           # スライド一覧
https://slides-afd16.web.app/sample/    # 各スライド
```

### 差分更新（スライドが増えてきたら）

スライドが増えると全体ビルドに時間がかかります。追加・更新したスライドだけをビルドして、トップページだけ再生成する差分更新が使えます。

#### 手順

**1. 対象スライドだけビルドする**

```bash
pnpm --filter @slides/<talk-name> build
pnpm --filter @slides/<talk-name> export:og
```

例:
```bash
pnpm --filter @slides/my-new-talk build
pnpm --filter @slides/my-new-talk export:og
```

**2. トップページ（index.html）を再生成する**

```bash
pnpm gen-index
```

`dist/` に存在するビルド済みスライドを走査して `dist/index.html` を再生成します。他のスライドは再ビルドしません。

**3. デプロイする**

```bash
firebase deploy
```

手順 2・3 はまとめて実行できます:

```bash
pnpm deploy:incremental
```

#### コマンドまとめ

| コマンド | 内容 |
|---|---|
| `pnpm build` | 全スライドをビルド＋index.html 生成 |
| `pnpm --filter @slides/<name> build` | 指定スライドのみビルド |
| `pnpm --filter @slides/<name> export:og` | 指定スライドの OGP 画像のみ生成 |
| `pnpm gen-index` | ビルド済みスライドから index.html だけ再生成 |
| `pnpm deploy:incremental` | gen-index → firebase deploy |

#### ベースURL の決定ロジック

`gen-index` は以下の優先順でベースURLを決定します。

1. 環境変数 `FIREBASE_PROJECT_ID` → `https://${projectId}.web.app`
2. 環境変数 `BASE_URL`
3. `talks/*/slides.md` の `ogImage` フィールドから自動抽出
4. すべて未設定 → 相対パスで生成

## デザインについて

`packages/theme/styles/index.scss` が `vendor/hatena-blog-theme-git/scss/lib/_variable.scss` を直接 `@import` することで、ブログと同じデザイントークンを参照しています。

| トークン | 値 |
|---|---|
| フォント | Roboto Slab |
| アクセントカラー | `#F14E32` |
| リンクカラー | `#0388A6` |
| 背景色 | `#F0EFE7` |
| ハイライト | `#FFE566` |

サブモジュールを最新に更新するには:

```bash
git submodule update --remote vendor/hatena-blog-theme-git
```
