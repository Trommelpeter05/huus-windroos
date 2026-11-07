<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the hero stage (background image with parallax, red headline bars, sub line, scroll hint).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { hero } from '~/data/content'
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <!-- Fix: Hausfoto statt Platzhalter, responsive Varianten -->
    <img class="hero__img" data-parallax="hero" :src="hero.image" :srcset="hero.srcset" sizes="100vw" :alt="hero.alt" width="1920" height="1440" fetchpriority="high" decoding="async" />
    <span class="hero__shade" aria-hidden="true" />

    <div class="frame hero__frame">
      <h1 id="hero-title" class="hero__title t-h1">
        <!-- Fix: search terms as visible kicker above the bars (part of the H1) -->
        <span class="hero__kicker t-label" data-hero-text>{{ hero.kicker }}<span class="sr-only">: </span></span>
        <span class="hero__bar hero__bar--1" data-hero-bar><span data-hero-text>{{ hero.line1 }}</span></span>{{ ' ' }}
        <span class="hero__bar hero__bar--2" data-hero-bar><span data-hero-text>{{ hero.line2 }}</span></span>
      </h1>
      <p class="hero__sub t-lead" data-hero-sub>{{ hero.sub }}</p>

      <a href="#willkommen" class="hero__scroll" aria-label="Weiter zum Inhalt">
        <svg viewBox="0 0 39 39" aria-hidden="true" class="hero__arrows">
          <path data-scroll-arrow d="M6.3 11.5 19.5 18.1l13.2-6.6v3.6c0 .6-.3 1.1-.8 1.3L19.9 22.4a1 1 0 0 1-.8 0L7.1 16.4c-.5-.2-.8-.7-.8-1.3z" fill="#fff" />
          <path data-scroll-arrow d="M6.3 20.9 19.5 27.5l13.2-6.6v3.6c0 .6-.3 1.1-.8 1.3L19.9 31.8a1 1 0 0 1-.8 0L7.1 25.8c-.5-.2-.8-.7-.8-1.3z" fill="#fff" />
        </svg>
      </a>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  height: 100svh;
  min-height: 600px;
  max-height: 900px;
  overflow: hidden;
  color: $white;
  // Sky gradient as long as no photo is there (and behind the photo while it loads)
  background: linear-gradient(180deg, #6f9fc0 0%, #a9c6d6 45%, #c9d3b3 75%, #7f9a5c 100%);

  @include lg {
    height: u(1000);
    min-height: 0;
    max-height: none;
  }
}

.hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  object-fit: cover;
  object-position: 50% 45%; // Fix: Giebel mit Windrose und Eingang im Bild halten

  @include lg {
    object-position: 50% 30%; // Fix: im Querformat Dachfirst und Giebel zeigen, Kies verschwindet unter dem Verlauf
  }
}

.hero__shade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 75%;
  background: linear-gradient(180deg, rgba(31, 43, 50, 0) 0%, rgba(31, 43, 50, 0.3) 30%, rgba(31, 43, 50, 0.85) 100%);
  pointer-events: none;
}

.hero__frame {
  position: relative;
  height: 100%;
}

.hero__title {
  position: absolute;
  left: 0;
  right: 20px;
  bottom: 230px;

  @include md {
    bottom: 260px;
  }

  @include lg {
    left: u(97);
    right: auto;
    top: u(456); // Fix: room for the kicker above the bars
    bottom: auto;
  }
}

.hero__kicker {
  display: block;
  margin: 0 0 12px 20px;
  color: $cream;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35);

  @include md {
    margin-left: 40px;
  }

  @include lg {
    margin: 0 0 u(16) u(43);
  }
}

// Two brick-red bars behind the headline lines, slightly overlapping (KK hero)
.hero__bar {
  display: table;
  padding: 4px 18px 6px 20px;
  background: $brick;

  @include md {
    padding-left: 40px;
  }

  @include lg {
    display: block;
    width: max-content;
    height: u(106);
    padding: u(5) u(36) 0 u(43);
  }

  > span {
    display: block;

    @include lg {
      white-space: nowrap;
    }
  }

  &--2 {
    margin-left: 20px;
    margin-top: -2px;

    @include md {
      margin-left: 40px;
    }

    @include lg {
      margin-left: u(43);
      margin-top: u(-5);
      padding-left: u(34);
    }
  }
}

.hero__sub {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 110px;
  max-width: 560px;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);

  @include md {
    left: 40px;
    bottom: 120px;
  }

  @include lg {
    left: u(140);
    top: u(745);
    bottom: auto;
    width: u(900);
    max-width: none;
  }
}

.hero__scroll {
  position: absolute;
  left: 20px;
  bottom: 40px;
  width: 39px;
  height: 39px;

  @include md {
    left: 40px;
  }

  @include lg {
    left: u(140);
    top: u(900);
    bottom: auto;
    width: u(39);
    height: u(39);
  }
}

.hero__arrows {
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
