<script setup lang="ts">
import { useNav } from '@slidev/client'
import seedrandom from 'seedrandom'
import { computed, ref, watch } from 'vue'

const { currentSlideRoute } = useNav()

type Range = [number, number]

const seed = computed(() => `slide-${currentSlideRoute.value?.no ?? 0}`)

const overflow = 0.3
const disturb = 0.3
const disturbChance = 0.3

function usePoly(number: number) {
  function getPoints(): Range[] {
    const rng = seedrandom(`${seed.value}-${number}`)
    function randomBetween([a, b]: Range) {
      return rng() * (b - a) + a
    }
    function applyOverflow(v: number) {
      const shifted = v * (1 + overflow * 2) - overflow
      return rng() < disturbChance ? shifted + (rng() - 0.5) * disturb : shifted
    }
    return Array.from({ length: number }).fill(0).map(() => [
      applyOverflow(randomBetween([-0.2, 1.2])),
      applyOverflow(randomBetween([-0.2, 1.2])),
    ] as Range)
  }

  function distance2([x1, y1]: Range, [x2, y2]: Range) {
    return (x2 - x1) ** 2 + (y2 - y1) ** 2
  }

  const points = ref<Range[]>(getPoints())
  const poly = computed(() =>
    points.value.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(', '),
  )

  function jumpPoints() {
    const newPoints = new Set(getPoints())
    points.value = points.value.map((o) => {
      let minDist = Infinity
      let closest: Range | undefined
      for (const n of newPoints) {
        const d = distance2(o, n)
        if (d < minDist) { minDist = d; closest = n }
      }
      newPoints.delete(closest)
      return closest!
    })
  }

  watch(currentSlideRoute, () => jumpPoints())

  return poly
}

const poly1 = usePoly(10)
const poly2 = usePoly(6)
const poly3 = usePoly(3)
</script>

<template>
  <div class="slidev-layout default">
    <!-- グロー背景 -->
    <div
      class="glow-bg"
      aria-hidden="true"
    >
      <div class="glow-clip glow-1" :style="{ clipPath: `polygon(${poly1})` }" />
      <div class="glow-clip glow-2" :style="{ clipPath: `polygon(${poly2})` }" />
      <div class="glow-clip glow-3" :style="{ clipPath: `polygon(${poly3})` }" />
    </div>

    <div class="layout-content" :class="`align-${$frontmatter.contentAlign || 'left'}`">
      <slot />
    </div>

    <!-- プログレスバー（最終ページ以外に表示） -->
    <div v-if="$slidev.nav.currentPage < $slidev.nav.total" class="progress-bar">
      <div class="progress-fill" :style="{ width: ($slidev.nav.currentPage / ($slidev.nav.total - 1) * 100) + '%' }" />
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

  .glow-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    filter: blur(70px);
    transform: translateZ(0);
    z-index: 0;
  }

  .glow-clip {
    position: absolute;
    inset: 0;
    aspect-ratio: 16 / 9;
    transition: all 2.5s ease;
  }

  .glow-1 {
    background: linear-gradient(to right, #F14E32, transparent);
    opacity: 0.15;
  }

  .glow-2 {
    background: linear-gradient(to left, #0388A6, transparent);
    opacity: 0.25;
  }

  .glow-3 {
    background: linear-gradient(to top, #FFE566, transparent);
    opacity: 0.20;
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

  u {
    text-decoration: none;
    background: linear-gradient(
      transparent calc(100% - 0.5rem),
      rgba($highlight, 0.8) calc(100% - 0.5rem)
    );
  }

  blockquote {
    border-left: 4px solid $text-header;
    background: $bg-quote;
    padding: 0.5em 1em;
    color: $text-light;
  }

  table {
    border-collapse: collapse;
    width: 100%;

    th, td {
      border: 1px solid $text-description;
      padding: 0.35em 0.75em;
    }

    th {
      font-weight: 700;
    }
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
