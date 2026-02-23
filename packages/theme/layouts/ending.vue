<script setup>
import qrPng from '../assets/qr.png'
import endingPng from '../assets/ending.png'

const base = import.meta.env.BASE_URL
function resolveUrl(url) {
  if (!url || /^https?:\/\//.test(url)) return url
  return base.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url)
}
</script>

<template>
  <div class="slidev-layout ending">
    <!-- グロー背景 -->
    <div class="glow-bg" aria-hidden="true">
      <div class="glow-1" />
      <div class="glow-2" />
      <div class="glow-3" />
    </div>

    <!-- 左側コンテンツ -->
    <div class="ending-left">
      <h1 class="ending-title">Happy Hacking!!</h1>

      <p class="ending-message">
        今日お話ししたような JavaScript/TypeScript/AI に関する話を<br>毎週末はてなブログに書いています。<br><br>
        <span class="ending-highlight">読者数300人を目指していまして、</span><br>
        <span class="ending-highlight">読者登録・はてなブックマークよろしくお願い致します！</span>
      </p>

      <div class="ending-links">
        プププなテクブ [検索]
        <a
          :href="$frontmatter.blogUrl || 'https://blog.inorinrinrin.com/'"
          class="blog-url"
          target="_blank"
        >
          {{ $frontmatter.blogUrl || 'https://blog.inorinrinrin.com/' }}
        </a>
        <img
          :src="qrPng"
          class="qr-code"
          alt="QR Code"
        />
      </div>
    </div>

    <!-- 右側: 立ち絵 -->
    <div class="ending-right">
      <img
        :src="endingPng"
        class="ending-char"
        alt=""
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../vendor/hatena-blog-theme-git/scss/lib/variable';

.slidev-layout.ending {
  position: relative;
  background: $background;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  padding: 2.5rem 3rem;
  height: 100%;
  overflow: hidden;

  // ── グロー背景 ────────────────────────────────────────────────────────────

  .glow-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    filter: blur(70px);
    z-index: 0;
  }

  .glow-1 {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(#F14E32, 1) 0%, transparent 55%);
    opacity: 0.15;
  }

  .glow-2 {
    position: absolute;
    inset: 0;
    background: linear-gradient(315deg, rgba(#0388A6, 1) 0%, transparent 55%);
    opacity: 0.25;
  }

  .glow-3 {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(#FFE566, 1) 0%, transparent 100%);
    opacity: 0.20;
  }

  // ── 左側 ─────────────────────────────────────────────────────────────────

  .ending-left {
    position: relative;
    z-index: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .ending-title {
    font-size: 3.2rem;
    font-weight: 700;
    color: $text-header;
    font-family: 'Roboto Slab', serif;
    line-height: 1.2;
    margin: 0;
    white-space: nowrap;

    &::before { content: none; }
  }

  .ending-message {
    font-size: 1.1rem;
    color: $text;
    line-height: 1.8;
    margin: 0;
    margin-left: 1.5rem;
    white-space: nowrap;
  }

  .ending-highlight {
    position: relative;
    display: inline;

    // 蛍光ペン下線アニメーション（繰り返し）
    &::after {
      content: '';
      position: absolute;
      bottom: -0.05em;
      left: 0;
      width: 100%;
      height: 0.4em;
      background: $highlight;
      transform: scaleX(0);
      transform-origin: left center;
      animation: highlight-loop 3.5s ease-in-out 0.5s infinite;
    }
  }

  @keyframes highlight-loop {
    0%   { transform: scaleX(0); opacity: 0; }
    8%   { transform: scaleX(0); opacity: 0.6; }
    55%  { transform: scaleX(1); opacity: 0.6; }
    75%  { transform: scaleX(1); opacity: 0.6; }
    90%  { transform: scaleX(1); opacity: 0; }
    100% { transform: scaleX(0); opacity: 0; }
  }

  .ending-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-left: 1.5rem;
  }

  .blog-url {
    font-size: 0.95rem;
    font-family: 'Courier', monospace;
    color: $link;
    text-decoration: none;
    word-break: break-all;

    &:hover { text-decoration: underline; }
  }

  .qr-code {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    margin-left: auto;
  }

  // ── 右側: 立ち絵 ─────────────────────────────────────────────────────────

  .ending-right {
    position: relative;
    z-index: 1;
    min-height: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  .ending-char {
    height: 100%;
    max-height: 100%;
    width: auto;
    object-fit: contain;
    object-position: bottom;
  }
}
</style>
