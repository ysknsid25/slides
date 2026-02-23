---
theme: '@ysknsid25/slidev-theme'
title: Devin Review もう使った？
colorSchema: light
transition: fade
date: '2026-02-23'
description: '『Devin Meetup Osaka #1』の登壇資料です。'
favicon: '/icon.png'
layout: cover
avatar: /icon.png
name: Kanon
github: ysknsid25
twitter: ysknsid25
command: 'npx deno run jsr:@ysknsid25/whois'
hashtag: DevinMeetupOsaka
---

# Devin Review もう使った？

---
layout: default
---

## Devin Review とは

<div class="grid grid-cols-2 gap-8 mt-16 items-center">
<div>

Devin の新機能として **Devin Review** というレビュー機能がリリースされました。<br /><br />

https://cognition.ai/blog/devin-review

<div class="mt-6"></div>

公式が謳っているDevin Reviewのコンセプトは <u>**レビュワーの認知負荷を下げること**</u> とのこと。

</div>
<div>

<img src="/devin-review-blog.png" class="w-full rounded shadow" />

</div>
</div>

---
layout: default
---

## なぜコードレビューがボトルネックなのか

<div class="grid grid-cols-2 gap-8 mt-8 items-center">
<div>

- コーディングエージェントの普及で **PR の数が増加**、サイズも拡大
- レビュワーの理解が追いつかなくなっている
- <u>**code review—not code generation—is now the bottleneck**</u>

</div>
<div>

<img src="https://cdn.sanity.io/images/2mc9cv2v/production/d3a2ab40ed159480636c231c48bfd8c547554e4e-926x768.png" class="w-full" />

</div>
</div>

---
layout: default
---

## Lazy LGTM 問題

<div class="grid grid-cols-2 gap-8 mt-16 items-center">
<div>

PR が大きくなると形式的な承認になりがち、という問題です。<br/><br/>

> "Never in the field of software engineering has so much code been created by so many, yet shipped to so few."

</div>
<div>

<img src="https://cdn.sanity.io/images/2mc9cv2v/production/62a49d86741bf7901263a4f10c7c0983d1518dda-597x291.png" class="w-full" />

</div>
</div>

---
layout: default
---

## Devin Review の 3 つの機能

<div class="flex-1 mt-4 min-h-0">
<img src="https://cdn.sanity.io/images/2mc9cv2v/production/c912959f2ce81ff38cc519c59d8977b745e4b626-3452x1598.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 機能① Reading better — インテリジェントな diff 整理

<div class="grid grid-cols-2 gap-8 mt-8 items-start">
<div>

GitHub は diff をアルファベット順に表示するだけです。一方でDevin Review は PR を解析し…

<div class="mt-8"></div>

- 論理的に関連する変更を**グループ化・順序付け**
- 各 hunk を**説明付きで表示**
- コードの移動・リネームを検出してノイズを削減

</div>
<div>

<img src="https://cdn.sanity.io/images/2mc9cv2v/production/4b91360f898d7b38ddc3be61ebecd91df4578333-1986x1496.png" class="w-full" />

</div>
</div>

---
layout: default
---

## 機能② Asking for more info — インタラクティブチャット

<div class="grid grid-cols-2 gap-8 mt-2 items-center">
<div>

GitHub は PR 外のコンテキストを提供できません。

<div class="mt-4"></div>

一方でDevin Review では **codebase 全体を理解した Devin** とレビュー画面を離れずにチャットできます。

</div>
<div>

<img src="https://cdn.sanity.io/images/2mc9cv2v/production/a960e2d41ef0de2e05757239e64f1c863c80a635-1988x1372.png" class="w-full" />

</div>
</div>

---
layout: default
---

## 機能③ Catching bugs — AI バグ検出

<div class="grid grid-cols-2 gap-8 mt-2 items-top">
<div class="mt-16">

GitHub は PR のバグを検出できません。

一方でDevin Review は diff をスキャンして深刻度別に分類します。

- 🔴 **Red** — probable bugs
- 🟡 **Yellow** — warnings
- ⚪ **Gray** — FYI / commentary

</div>
<div>

<img src="https://cdn.sanity.io/images/2mc9cv2v/production/3dbff23629f04010fac6a6f042f7c48cbef97d90-968x1110.png" height="80%" />

</div>
</div>

---
layout: content
contentAlign: center
---

<div style="color: #F14E32; font-size: 3.6rem; font-weight: 700;">実際に使ってみる</div>

---
layout: default
---

## Devin Reviewの一番簡単なはじめかた

Public リポジトリの PR であれば、URL を書き換えるだけで利用できます。

<div class="mt-8"></div>

| | URL |
|---|---|
| GitHub | `https://github.com/org/repo/pull/123` |
| Devin Review | `https://devinreview.com/org/repo/pull/123` |

<div class="mt-8"></div>

というわけで、ちょうど OSS に出していた PR を使っていろいろ試してみました。

---
layout: default
---

## レビュー開始

1〜2分待つとレビューが完了。タブ切り替えで GitHub のコメントも確認可能。

<div class="flex-1 grid grid-cols-2 gap-4 mt-2 min-h-0">
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124142729.png" class="w-full h-full object-contain object-top" />
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124142521.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 機能① 実践 - PR の概要のまとめ

Copilot や Code Rabbit でもお馴染みの機能。PR 全体の変更の要約を出してくれます。

<div class="flex-1 mt-4 min-h-0">
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124142937.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 機能① 実践 - 解像度を上げた変更点のまとめ

**Changes in PR** では、変更内容を単位ごとに分割して解説してくれます。

<div class="flex-1 grid grid-cols-2 gap-4 mt-8 min-h-0">
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124143155.png" class="w-full h-full object-contain object-top" />
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124143051.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 機能② 実践 - Devin と議論も可能

検出された内容に対して人間がレビューを行い、**Devin と議論を交わす**ことも可能です。

<div class="flex-1 mt-4 min-h-0">
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124143609.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 機能② 実践 - Devin との Chat

画面下部のエリアから、PR に関する相談事を Devin と始めることができます。

<div class="flex-1 mt-4 min-h-0">
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124144210.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 機能③ 実践 — 深刻度別にバグを検出

明らかなバグはもちろん、**潜在的なバグ**についても深刻度付きで検出してくれます。

<div class="flex-1 grid grid-cols-2 gap-4 mt-4 min-h-0">
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124143451.png" class="w-full h-full object-contain object-top" />
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124143950.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 機能③ 実践 — Flags（気になるポイント）

バグとは別に **Flags** というエリアがあります。「バグじゃないけどDevin的に気になる」ものを出してくれるようです。

<div class="flex-1 grid grid-cols-2 gap-4 mt-8 min-h-0">
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124143800.png" class="w-full h-full object-contain object-top" />
<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/i/inorinrinrin/20260124/20260124144048.png" class="w-full h-full object-contain object-top" />
</div>

---
layout: default
---

## 感想

<div class="mt-8"></div>

| 良かった点 | 課題 |
|---|---|
| PR全体の要約と変更単位の詳細説明 | 解説がすべて英語 |
| 潜在バグ・気になるポイントの整理 | 英語が苦手だと認知負荷が残る |
| Devin との対話でさらに深掘り可能 | |

<div class="mt-8"></div>

- 問題を分解して解説してくれる点は、**レビュワーの認知負荷を下げる**というコンセプトに忠実でとてもありがたい。
- ただし指摘内容自体の打率はそこまで高くない印象...😢

---
layout: ending
---
