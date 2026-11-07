<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the large decorative compass rose (same geometry as the logo, plus a compass ring with ticks) –
* used as watermark in the closing statement.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
// 32 ticks on the outer ring, every fourth one longer (main and intermediate directions)
const ticks = Array.from({ length: 32 }, (_, i) => {
  const a = (i * Math.PI) / 16
  const long = i % 4 === 0
  const r1 = long ? 26.6 : 27.6
  const r2 = 29
  return {
    x1: 32 + r1 * Math.sin(a),
    y1: 32 - r1 * Math.cos(a),
    x2: 32 + r2 * Math.sin(a),
    y2: 32 - r2 * Math.cos(a),
    long,
  }
})
</script>

<template>
  <svg class="wr" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="30.4" class="wr__ring" />
    <circle cx="32" cy="32" r="25.6" class="wr__ring wr__ring--thin" />
    <line v-for="(t, i) in ticks" :key="i" :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2" class="wr__tick" :class="{ 'wr__tick--long': t.long }" />
    <circle cx="32" cy="32" r="21" class="wr__ring wr__ring--thin" />
    <!-- same points as LogoWindroos.vue -->
    <path d="M32 32 46.8 17.2 35.5 35.5ZM32 32 46.8 46.8 28.5 35.5ZM32 32 17.2 46.8 28.5 28.5ZM32 32 17.2 17.2 35.5 28.5Z" class="wr__minor" />
    <path d="M32 2 36 28 32 32Z M62 32 36 36 32 32Z M32 62 28 36 32 32Z M2 32 28 28 32 32Z" class="wr__major-a" />
    <path d="M32 2 28 28 32 32Z M62 32 36 28 32 32Z M32 62 36 36 32 32Z M2 32 28 36 32 32Z" class="wr__major-b" />
    <circle cx="32" cy="32" r="2.6" class="wr__major-b" />
  </svg>
</template>

<style lang="scss" scoped>
// Colours come from the parent via `color`; the two halves of each point differ only in opacity
.wr {
  display: block;
  overflow: visible;
}

.wr__ring {
  fill: none;
  stroke: currentColor;
  stroke-width: 0.35;
  opacity: 0.55;

  &--thin {
    stroke-width: 0.2;
    opacity: 0.4;
  }
}

.wr__tick {
  stroke: currentColor;
  stroke-width: 0.25;
  opacity: 0.5;

  &--long {
    stroke-width: 0.45;
    opacity: 0.8;
  }
}

.wr__minor {
  fill: currentColor;
  opacity: 0.35;
}

.wr__major-a {
  fill: currentColor;
  opacity: 0.9;
}

.wr__major-b {
  fill: currentColor;
  opacity: 0.55;
}
</style>
