<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the "Gut zu wissen" section (house rules for both accommodations as accordion, KK FAQ layout).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { goodToKnow } from '~/data/content'
</script>

<template>
  <section id="gut-zu-wissen" class="gzw">
    <div class="frame wrap gzw__grid">
      <div class="gzw__head">
        <p class="eyebrow t-label" data-reveal>{{ goodToKnow.label }}</p>
        <h2 class="t-h2 gzw__title" data-reveal>
          <span class="red">{{ goodToKnow.titleRed }}</span> {{ goodToKnow.titleDark }}
        </h2>
        <p class="t-body gzw__text" data-reveal>{{ goodToKnow.text }}</p>
        <p class="gzw__links" data-reveal>
          <a href="/agb/" class="gzw__link">Allgemeine Geschäftsbedingungen <UiIcon name="arrow" /></a>
        </p>
      </div>
      <div class="gzw__list" data-reveal>
        <AccordionList :items="goodToKnow.items" :initial="0" id-prefix="gzw" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.gzw {
  padding: 72px 0;
  background: $bg-sand-40;

  @include lg {
    padding: u(150) 0;
  }
}

.gzw__grid {
  display: grid;
  gap: 36px;

  @include lg {
    grid-template-columns: u(560) u(900);
    justify-content: space-between;
    gap: 0;
  }
}

.gzw__title {
  margin-top: 4px;
}

.gzw__text {
  margin-top: 20px;

  @include lg {
    margin-top: u(32);
  }
}

.gzw__links {
  margin-top: 20px;

  @include lg {
    margin-top: u(28);
  }
}

.gzw__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 17px;
  color: $brick;

  @include lg {
    gap: u(10);
    font-size: u(20);
  }

  svg {
    width: 20px;
    transition: transform 0.3s ease;

    @include lg {
      width: u(22);
    }
  }

  &:hover svg {
    transform: translateX(4px);
  }
}
</style>
