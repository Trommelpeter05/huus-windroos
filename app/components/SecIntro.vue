<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the welcome section: intro text and the two accommodation teaser cards.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { intro, units } from '~/data/content'
</script>

<template>
  <section id="willkommen" class="intro">
    <span class="intro__notch" aria-hidden="true" />
    <div class="frame wrap">
      <div class="intro__grid">
        <p class="eyebrow t-label" data-reveal>{{ intro.label }}</p>
        <p class="intro__text t-lead" data-reveal>
          <strong>{{ intro.bold }}</strong>{{ intro.text }}
        </p>
      </div>

      <ul class="units">
        <li v-for="unit in units" :key="unit.id" class="unit" data-reveal>
          <a :href="`#${unit.id}`" class="unit__media img-ph" tabindex="-1" aria-hidden="true">
            <img :src="unit.gallery[0]!.src" alt="" width="500" height="375" loading="lazy" decoding="async" />
          </a>
          <div class="unit__body">
            <h2 class="t-h2-m unit__title">{{ unit.titleRed }}</h2>
            <RatingBadge :unit="unit" class="unit__rating" />
            <ul class="unit__facts">
              <li v-for="f in unit.facts" :key="f" class="tag">{{ f }}</li>
            </ul>
            <p class="t-body unit__text">{{ unit.teaser }}</p>
            <div class="unit__foot">
              <p class="unit__price">
                <span class="unit__from">ab</span>
                <strong>{{ unit.priceFrom }} €</strong>
                <span class="unit__per">pro Nacht</span>
              </p>
              <UiButton label="Mehr erfahren" :href="`#${unit.id}`" variant="outline" class="unit__btn" :aria-label="`${unit.titleRed}: mehr erfahren`" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.intro {
  position: relative;
  padding: 64px 0 72px;
  background: $bg-sand-40;

  @include lg {
    padding: u(150) 0 u(170);
  }
}

// Sand tab reaching into the next (white) section – KK notch motif
.intro__notch {
  display: none;

  @include lg {
    position: absolute;
    @include edge-tab(bottom, 36);
    right: 0;
    display: block;
    width: calc(50% - u(200));
    background: $bg-sand-40;
    transform: translateY(100%);
  }
}

.intro__grid {
  display: grid;
  gap: 20px;

  @include lg {
    grid-template-columns: u(420) 1fr;
    gap: 0;
  }
}

.intro__text {
  max-width: 900px;

  @include lg {
    max-width: u(1100);
    margin-top: u(-12);
  }

  strong {
    color: $brick;
  }
}

.units {
  display: grid;
  gap: 24px;
  margin-top: 48px;

  @include md {
    grid-template-columns: 1fr 1fr;
  }

  @include lg {
    gap: u(40);
    margin-top: u(110);
  }
}

.unit {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  background: $white;
  box-shadow: 0 10px 30px rgba(31, 43, 50, 0.08);

  @include lg {
    border-radius: u(10);
  }
}

.unit__media {
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.2, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.04);
  }
}

.unit__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 20px 28px;

  @include lg {
    padding: u(44) u(50) u(50);
  }
}

.unit__rating {
  margin-top: 10px;
}

.unit__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;

  @include lg {
    gap: u(10);
    margin-top: u(20);
  }

  .tag {
    color: $ink;
    background: $bg-sand-60;
  }
}

.unit__text {
  margin-top: 16px;

  @include lg {
    margin-top: u(24);
  }
}

.unit__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 28px;

  @include lg {
    padding-top: u(40);
  }
}

.unit__price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: $brick;

  strong {
    font-weight: 800;
    font-size: 40px;
    line-height: 1;
    letter-spacing: -0.02em;

    @include lg {
      font-size: u(60);
    }
  }
}

.unit__from,
.unit__per {
  font-weight: 700;
  font-size: 16px;
  color: $ink;

  @include lg {
    font-size: u(20);
  }
}
</style>
