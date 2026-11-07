<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the fixed page header (white bar with notch, logo, anchor navigation, CTA, mobile menu, compact state)
* in the style of the KK landing page.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { nav } from '~/data/content'

const open = ref(false)
const scrolled = ref(false)
const compact = ref(false)
const route = useRoute()
// Pages without hero (legal pages, 404) get a plain bar – the notch only makes sense over the hero image
const plain = computed(() => route.path !== '/')

const COMPACT_AT = 80

function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 10
  if (!compact.value && y > COMPACT_AT) compact.value = true
  else if (compact.value && y < COMPACT_AT / 2) compact.value = false
}

function close() {
  open.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})

watch(open, (v) => document.documentElement.classList.toggle('menu-open', v))
</script>

<template>
  <header class="site-header" :class="{ 'site-header--plain': plain, 'is-open': open, 'is-scrolled': scrolled, 'is-compact': compact }">
    <div class="frame header__frame">
      <div class="header__shape" aria-hidden="true">
        <span class="header__bar" />
        <span class="header__tab" />
      </div>

      <a href="/#top" class="header__brand" aria-label="Huus Windroos – zum Seitenanfang" @click="close">
        <LogoWindroos />
      </a>

      <button class="header__burger" type="button" :aria-expanded="open" aria-controls="main-nav" @click="open = !open">
        <span class="sr-only">{{ open ? 'Menü schließen' : 'Menü öffnen' }}</span>
        <span class="header__burger-lines" aria-hidden="true" />
      </button>

      <nav id="main-nav" class="header__nav" aria-label="Hauptnavigation">
        <ul class="header__list">
          <li v-for="item in nav" :key="item.href">
            <a :href="item.href" class="header__link" @click="close">{{ item.label }}</a>
          </li>
        </ul>
        <UiButton label="Jetzt anfragen" href="/#kontakt" size="sm" class="header__cta" @click="close" />
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.site-header {
  --header-compact: 0.85;
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  container-type: inline-size;
  pointer-events: none;
}

.header__frame {
  height: 64px;

  @include lg {
    height: u(110);
  }
}

.header__shape {
  position: absolute;
  inset: 0;
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.14));
  transform-origin: top;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.header__bar {
  position: absolute;
  inset: 0 -50vw;
  background: $white;
}

// White notch below the logo (KK layout)
.header__tab {
  display: none;

  @include lg {
    position: absolute;
    left: 0;
    top: 100%;
    display: block;
    width: u(560);
    height: u(24);
    background: $white;
    transform-origin: u(140) 0;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 100%;
      width: 50vw;
      background: $white;
    }
  }
}

.site-header--plain {
  .header__tab {
    display: none;
  }

  &:not(.is-scrolled) .header__shape {
    filter: none;
  }
}

.header__brand {
  position: absolute;
  left: 20px;
  top: 0;
  display: flex;
  align-items: center;
  height: 64px;
  pointer-events: auto;
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @include md {
    left: 40px;
  }

  @include lg {
    left: u(140);
    top: u(14);
    height: u(110);
    transform-origin: 0 0;
  }
}

.header__nav {
  pointer-events: auto;

  @include below-lg {
    position: fixed;
    inset: 64px 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
    padding: 32px 20px 40px;
    background: $white;
    opacity: 0;
    visibility: hidden;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-12px);
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s 0.3s;

    .is-open & {
      opacity: 1;
      visibility: visible;
      transform: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
  }

  @include md {
    @include below-lg {
      padding-left: 40px;
      padding-right: 40px;
    }
  }

  @include lg {
    position: absolute;
    right: u(140);
    top: u(30);
    display: flex;
    align-items: center;
    gap: u(46);
    transform-origin: right center;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.header__list {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @include lg {
    flex-direction: row;
    gap: u(40);
  }
}

.header__link {
  font-weight: 700;
  font-size: 21px;
  line-height: 26px;
  transition: color 0.25s ease;

  @include lg {
    font-size: u(21);
    line-height: u(26);
  }

  &:hover {
    color: $brick;
  }
}

.header__burger {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  pointer-events: auto;
  transform-origin: right center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @include md {
    right: 30px;
  }

  @include lg {
    display: none;
  }
}

.header__burger-lines,
.header__burger-lines::before,
.header__burger-lines::after {
  display: block;
  width: 26px;
  height: 2px;
  background: $ink;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.header__burger-lines {
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
  }

  &::before {
    top: -8px;
  }

  &::after {
    top: 8px;
  }

  .is-open & {
    background: transparent;

    &::before {
      transform: translateY(8px) rotate(45deg);
    }

    &::after {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
}

// Compact header after scrolling
.is-compact {
  .header__shape {
    transform: scaleY(var(--header-compact));
  }

  .header__brand,
  .header__burger {
    transform: translateY(calc(-32px * (1 - var(--header-compact)))) scale(var(--header-compact));

    @include lg {
      transform: scale(var(--header-compact));
    }
  }

  .header__tab {
    @include lg {
      transform: scaleX(var(--header-compact));
    }
  }

  .header__nav {
    @include lg {
      transform: translateY(calc(-55 * (1 - var(--header-compact)) * var(--u))) scale(var(--header-compact));
    }

    @include below-lg {
      top: calc(64px * var(--header-compact));
    }
  }
}

@include reduced-motion {
  .header__shape,
  .header__brand,
  .header__burger,
  .header__tab,
  .header__nav {
    transition: none;
  }
}
</style>
