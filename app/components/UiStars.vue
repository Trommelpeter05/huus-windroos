<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle a five-star rating graphic with partial fill (e.g. 4.7 → 4 full stars and 70 % of the fifth).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
const props = defineProps<{ value: number }>()
const uid = useId()
const pct = computed(() => `${Math.max(0, Math.min(5, props.value)) * 20}%`)
const star = 'M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.8 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z'
</script>

<template>
  <svg class="stars" viewBox="0 0 100 20" aria-hidden="true">
    <defs>
      <clipPath :id="`${uid}-clip`">
        <rect x="0" y="0" :width="pct" height="20" />
      </clipPath>
    </defs>
    <g class="stars__bg">
      <path v-for="i in 5" :key="`b${i}`" :d="star" :transform="`translate(${(i - 1) * 20} 0)`" />
    </g>
    <g class="stars__fg" :clip-path="`url(#${uid}-clip)`">
      <path v-for="i in 5" :key="`f${i}`" :d="star" :transform="`translate(${(i - 1) * 20} 0)`" />
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.stars {
  display: block;
  height: auto;
}

.stars__bg {
  fill: rgba($ink, 0.18);
}

.stars__fg {
  fill: #e0a526;
}
</style>
