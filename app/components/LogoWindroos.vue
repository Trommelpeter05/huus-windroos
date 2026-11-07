<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the logo: compass rose ("Windroos") as inline SVG plus the script wordmark.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
withDefaults(defineProps<{ light?: boolean }>(), { light: false })
</script>

<template>
  <span class="logo" :class="{ 'logo--light': light }">
    <span class="logo__word">Huus</span>
    <svg class="logo__rose" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.45" />
      <!-- diagonal points -->
      <path d="M32 32 46.8 17.2 35.5 35.5ZM32 32 46.8 46.8 28.5 35.5ZM32 32 17.2 46.8 28.5 28.5ZM32 32 17.2 17.2 35.5 28.5Z" class="logo__minor" />
      <!-- main points: light and dark halves -->
      <path d="M32 2 36 28 32 32Z M62 32 36 36 32 32Z M32 62 28 36 32 32Z M2 32 28 28 32 32Z" class="logo__major-a" />
      <path d="M32 2 28 28 32 32Z M62 32 36 28 32 32Z M32 62 36 36 32 32Z M2 32 28 36 32 32Z" class="logo__major-b" />
      <circle cx="32" cy="32" r="2.6" class="logo__major-b" />
    </svg>
    <span class="logo__word">Windroos</span>
  </span>
</template>

<style lang="scss" scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.18em;
  font-family: $font-script;
  font-size: 34px;
  line-height: 1;
  color: $brick;
  white-space: nowrap;

  @include lg {
    font-size: u(50);
  }
}

.logo__word {
  // Great Vibes sits low – lift it optically to the centre of the rose
  transform: translateY(0.04em);
}

.logo__rose {
  width: 1.15em;
  height: 1.15em;
  flex: none;
  color: $brick;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo__major-a {
  fill: $brick;
}

.logo__major-b {
  fill: $brick-dark;
}

.logo__minor {
  fill: $sea;
}

.logo--light {
  color: $cream;

  .logo__rose {
    color: $cream;
  }

  .logo__major-a {
    fill: $cream;
  }

  .logo__major-b {
    fill: #e2cfa8;
  }
}

a:hover .logo__rose {
  transform: rotate(45deg);
}

@include reduced-motion {
  .logo__rose {
    transition: none;
  }
}
</style>
