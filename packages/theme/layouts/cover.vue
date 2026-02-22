<template>
  <div class="slidev-layout cover">
    <div class="cover-inner">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.slidev-layout.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .cover-inner {
    max-width: 800px;
  }

  h1 {
    font-size: 3rem;
    line-height: 1.2;
    margin-bottom: 1rem;

    &::before { content: none; }
  }

  p {
    font-size: 1.2rem;
    color: var(--slidev-theme-text-light);
  }
}
</style>
