<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the application shell (skip link, header, smooth-scroll wrapper, page).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
useSiteMeta()
</script>

<template>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <AppHeader />
  <!-- Wrapper for GSAP ScrollSmoother (plugins/gsap.client.ts) – fixed elements stay outside -->
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <main id="main" class="page">
        <NuxtPage />
      </main>
    </div>
  </div>
  <!-- Fix: floating call button (fixed, therefore outside the smooth-scroll wrapper) -->
  <CallButton />
</template>
