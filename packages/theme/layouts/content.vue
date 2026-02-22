<template>
  <div class="slidev-layout content">
    <div class="bg-blob bg-blob-1" />
    <div class="bg-blob bg-blob-2" />
    <div class="bg-blob bg-blob-3" />
    <div class="bg-blob bg-blob-4" />

    <!-- 見出しなし。contentAlign: left | center | right で配置を指定 -->
    <div class="layout-content" :class="`align-${$frontmatter.contentAlign || 'left'}`">
      <slot />
    </div>

    <!-- プログレスバー（最終ページ以外に表示） -->
    <div v-if="$slidev.nav.currentPage < $slidev.nav.total" class="progress-bar">
      <div class="progress-fill" :style="{ width: ($slidev.nav.currentPage / $slidev.nav.total * 100) + '%' }" />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../vendor/hatena-blog-theme-git/scss/lib/variable';

.slidev-layout.content {
  position: relative;
  overflow: hidden;
  background: $background;
  padding: 2rem 3rem;
  height: 100%;

  // ── グラデーション blob（default と共通）─────────────────────────────────

  .bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
  }

  .bg-blob-1 {
    width: 65%;
    height: 80%;
    background: radial-gradient(circle, darken($background, 5%) 0%, transparent 70%);
    top: -35%;
    left: -20%;
    animation: content-blob1 14s ease-in-out infinite;
  }

  .bg-blob-2 {
    width: 55%;
    height: 70%;
    background: radial-gradient(circle, lighten($background, 5%) 0%, transparent 70%);
    bottom: -30%;
    right: -15%;
    animation: content-blob2 18s ease-in-out infinite;
    animation-delay: -7s;
  }

  .bg-blob-3 {
    width: 45%;
    height: 55%;
    background: radial-gradient(circle, rgba($btn, 0.09) 0%, transparent 70%);
    top: 5%;
    right: 0%;
    animation: content-blob3 11s ease-in-out infinite;
    animation-delay: -3s;
  }

  .bg-blob-4 {
    width: 40%;
    height: 50%;
    background: radial-gradient(circle, rgba($link, 0.07) 0%, transparent 70%);
    bottom: 0%;
    left: 5%;
    animation: content-blob4 16s ease-in-out infinite;
    animation-delay: -9s;
  }

  @keyframes content-blob1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(10%, 14%) scale(1.04); }
    66%       { transform: translate(-4%, 7%) scale(0.97); }
  }
  @keyframes content-blob2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(-12%, -10%) scale(1.06); }
    70%       { transform: translate(6%, -14%) scale(0.94); }
  }
  @keyframes content-blob3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(-10%, 12%) scale(1.05); }
  }
  @keyframes content-blob4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    35%       { transform: translate(9%, -8%) scale(1.04); }
    65%       { transform: translate(-5%, 9%) scale(0.96); }
  }

  // ── コンテンツエリア ──────────────────────────────────────────────────────

  .layout-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center; // デフォルトで垂直中央
  }

  // ── テキスト ──────────────────────────────────────────────────────────────

  p {
    font-size: 1.2rem;
    color: $text;
    line-height: 1.8;
    margin-bottom: 0.6rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5em;
    font-size: 1.15rem;
    color: $text;
    line-height: 1.7;
  }

  ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    font-size: 1.15rem;
    color: $text;
    line-height: 1.7;
  }

  li {
    margin: 0.3rem 0;
    &::marker { color: $text-header; }
  }

  // ── 画像 ──────────────────────────────────────────────────────────────────

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 6px;
  }

  // ── コード ────────────────────────────────────────────────────────────────

  code {
    background: $bg-light;
    color: $text-code;
    font-size: 0.95em;
    padding: 0.1em 0.4em;
    border-radius: 4px;
  }

  pre {
    background: $bg-light;
    padding: 0.8rem 1rem;
    border-radius: 6px;
    code { background: transparent; padding: 0; }
  }

  blockquote {
    border-left: 4px solid $text-header;
    background: $bg-quote;
    padding: 0.5em 1em;
    color: $text-light;
  }

  // ── 配置（frontmatter: contentAlign: left | center | right）─────────────

  &.align-left   { text-align: left; }
  &.align-center {
    text-align: center;
    align-items: center;
  }
  &.align-right  { text-align: right; }

  // ── プログレスバー ────────────────────────────────────────────────────────

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba($text-description, 0.2);
    z-index: 10;
  }

  .progress-fill {
    height: 100%;
    background: $text-header;
    transition: width 0.3s ease;
  }
}
</style>
