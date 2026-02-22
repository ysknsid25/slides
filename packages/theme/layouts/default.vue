<template>
  <div class="slidev-layout default">
    <div class="glow-container">
      <div class="glow-shape glow-1" />
      <div class="glow-shape glow-2" />
      <div class="glow-shape glow-3" />
    </div>

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

.slidev-layout.default {
  position: relative;
  overflow: hidden;
  background: $background;
  padding: 2rem 3rem;
  height: 100%;

  // ── グラデーション glow ──────────────────────────────────────────────────

  .glow-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    filter: blur(70px);
    transform: translateZ(0);
  }

  .glow-shape {
    position: absolute;
    inset: 0;
  }

  .glow-1 {
    background: linear-gradient(to right, rgba($text-header, 0.55), transparent);
    clip-path: polygon(0% 5%, 70% 0%, 100% 60%, 20% 100%, 0% 70%);
    opacity: 0.35;
  }

  .glow-2 {
    background: linear-gradient(to left, rgba($link, 0.50), transparent);
    clip-path: polygon(30% 0%, 100% 20%, 70% 100%, 0% 75%);
    opacity: 0.30;
  }

  .glow-3 {
    background: linear-gradient(to top, rgba($highlight, 0.60), transparent);
    clip-path: polygon(50% 40%, 100% 0%, 100% 100%, 60% 100%);
    opacity: 0.25;
  }

  // ── コンテンツ ────────────────────────────────────────────────────────────

  .layout-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  // ── 見出し ────────────────────────────────────────────────────────────────

  h1, h2, h3 {
    color: $text-header;
    font-weight: 700;
    line-height: 1.3;
    padding-bottom: 0.4rem;
    border-bottom: 2px solid lighten($text-description, 15%);
    margin-bottom: 1.4rem;
  }

  h1 { font-size: 2.4rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.6rem; }

  h1::before { content: '# ';   color: $text-header-symbol-color; }
  h2::before { content: '## ';  color: $text-header-symbol-color; }
  h3::before { content: '### '; color: $text-header-symbol-color; }

  // ── 本文（見出し左端より少し右にインデント）────────────────────────────

  p, ul, ol, pre, blockquote, table {
    margin-left: 1.2rem;
    font-size: 1.15rem;
    color: $text;
    line-height: 1.7;
  }

  // ── リスト（箇条書き・番号付き）─────────────────────────────────────────

  ul {
    list-style-type: disc;
    padding-left: 1.5em;
  }

  ol {
    list-style-type: decimal;
    padding-left: 1.5em;
  }

  li {
    margin: 0.3rem 0;
    padding-left: 0.2em;

    &::marker {
      color: $text-header;
    }
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
  &.align-center { text-align: center; }
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
