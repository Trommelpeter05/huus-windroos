<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle all inline SVG icons (arrow, plus, send, phone and mail taken over from the KK landing page).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg v-if="name === 'arrow'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.666" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4.16 10H15.82M10.83 14.99 15.82 10M10.83 5l4.99 4.99" />
  </svg>
  <svg v-else-if="name === 'plus'" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.834" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M11 4.59v12.83M4.59 11h12.83" />
  </svg>
  <svg v-else-if="name === 'close'" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.834" stroke-linecap="round" aria-hidden="true">
    <path d="m6 6 10 10M16 6 6 16" />
  </svg>
  <svg v-else-if="name === 'send'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.666" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M8.33 11.66 17.49 2.5" />
    <path d="M17.49 2.5 12.07 17.49a.46.46 0 0 1-.83 0L8.33 11.66 2.5 8.74a.46.46 0 0 1 0-.83L17.49 2.5" />
  </svg>
  <svg v-else-if="name === 'phone'" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.834" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4.92 3.67h4.35l2.17 5.43-2.71 1.63a11.95 11.95 0 0 0 5.43 5.43l1.63-2.71 5.43 2.17v4.35a2.17 2.17 0 0 1-2.17 2.17A17.37 17.37 0 0 1 2.75 5.84a2.17 2.17 0 0 1 2.17-2.17" />
  </svg>
  <svg v-else-if="name === 'mail'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.666" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M2.5 5.83c0-.92.74-1.67 1.66-1.67h11.66c.92 0 1.67.75 1.67 1.67v8.33c0 .92-.75 1.66-1.67 1.66H4.16c-.92 0-1.66-.74-1.66-1.66z" />
    <path d="m2.5 5.83 7.49 5 7.5-5" />
  </svg>
  <svg v-else-if="name === 'pin'" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.834" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M11 20s7-6.1 7-11.2A7 7 0 0 0 4 8.8C4 13.9 11 20 11 20Z" />
    <circle cx="11" cy="9" r="2.5" />
  </svg>
  <svg v-else-if="name === 'check'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </svg>
  <svg v-else-if="name === 'chevron'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
</template>
