<template>
  <div class="slidev-layout cover">

    <!-- タイトルエリア（左上） -->
    <div class="cover-title">
      <slot />
    </div>

    <!-- フッターエリア（左下: プロフィール / 右下: ハッシュタグ） -->
    <div class="cover-footer">
      <div v-if="$frontmatter.name" class="profile">
        <img
          class="profile-avatar"
          :src="avatorPng"
          alt="avatar"
        />
        <div class="profile-body">
          <div class="profile-name">{{ $frontmatter.name }}</div>
          <div class="profile-handles">
            <span v-if="$frontmatter.github" class="handle">
              <span class="icon" v-html="githubSvg" />
              {{ $frontmatter.github }}
            </span>
            <span v-if="$frontmatter.twitter" class="handle">
              <span class="icon" v-html="xSvg" />
              {{ $frontmatter.twitter }}
            </span>
          </div>
          <div v-if="$frontmatter.command" class="profile-command">
            {{ $frontmatter.command }}
          </div>
        </div>
      </div>

      <div v-if="$frontmatter.hashtag" class="hashtag">
        #{{ $frontmatter.hashtag }}
      </div>
    </div>

  </div>
</template>

<script setup>
import githubSvg from '../assets/github.svg?raw'
import xSvg from '../assets/x.svg?raw'
import avatorPng from '../assets/avator.png'

const base = import.meta.env.BASE_URL
function resolveUrl(url) {
  if (!url || /^https?:\/\//.test(url)) return url
  return base.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url)
}
</script>

<style lang="scss">
.slidev-layout.cover {
  background: #F14E32; // $text-header
  display: flex;
  flex-direction: column;
  padding: 2.5rem 3rem;
  height: 100%;

  // タイトル（左上、フレックスで残りスペースを占有）
  .cover-title {
    flex: 1;

    h1 {
      font-size: 3.2rem;
      color: #ffffff;
      font-weight: 700;
      line-height: 1.25;
      font-family: 'Roboto Slab', serif;

      &::before {
        content: none;
      }
    }
  }

  // フッター行
  .cover-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  // プロフィールブロック
  .profile {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .profile-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .profile-body {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .profile-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: #E9E8E0; // $bg-light
    line-height: 1;
  }

  .profile-handles {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .handle {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.9rem;
    color: #E9E8E0; // $bg-light

    .icon {
      display: flex;
      align-items: center;

      svg {
        width: 17px;
        height: 17px;
        fill: #E9E8E0; // $bg-light
      }
    }
  }

  .profile-command {
    font-family: 'Courier', monospace;
    font-size: 0.82rem;
    color: #E9E8E0; // $bg-light
    margin-top: 0.4rem;
  }

  // ハッシュタグ（右下）
  .hashtag {
    font-size: 1.1rem;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    align-self: flex-end;
    position: relative;

    // 蛍光ペンのアンダーライン
    &::after {
      content: '';
      position: absolute;
      bottom: 0.15em;
      left: 0;
      width: 100%;
      height: 0.4em;
      background: #FFE566; // $highlight
      opacity: 0.6;
      transform: scaleX(0);
      transform-origin: left center;
      animation: highlight-draw 2.4s ease-in-out infinite;
      animation-delay: 0.7s;
    }
  }

  @keyframes highlight-draw {
    0%   { transform: scaleX(0); opacity: 0; }
    4%   { transform: scaleX(0); opacity: 0.6; }
    60%  { transform: scaleX(1); opacity: 0.6; }
    78%  { transform: scaleX(1); opacity: 0.6; }
    93%  { transform: scaleX(1); opacity: 0; }
    100% { transform: scaleX(0); opacity: 0; }
  }
}
</style>
