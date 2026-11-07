<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the floating call button on phones and tablets (appears after the hero, hides near the
* contact section and footer, where the phone number is visible anyway).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { contact } from '~/data/content'

const visible = ref(false)
let observer: IntersectionObserver | null = null
const hidden = new Set<Element>()

function onScroll() {
  const pastHero = window.scrollY > window.innerHeight * 0.6
  visible.value = pastHero && hidden.size === 0
}

onMounted(() => {
  // Contact section and footer show the number already – the button steps aside there
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) hidden.add(e.target)
      else hidden.delete(e.target)
    }
    onScroll()
  })
  document.querySelectorAll('#kontakt, .footer').forEach((el) => observer!.observe(el))
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <a class="call" :class="{ 'is-visible': visible }" :href="contact.phoneHref" :tabindex="visible ? undefined : -1" :aria-hidden="!visible || undefined">
    <span class="call__icon"><UiIcon name="phone" /></span>
    <span class="call__label">Anrufen<span class="sr-only">: {{ contact.phone }}</span></span>
  </a>
</template>

<style lang="scss" scoped>
.call {
  position: fixed;
  right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 90;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 20px 0 7px;
  border-radius: 26px;
  font-weight: 700;
  font-size: 16px;
  color: $white;
  background: $brick;
  box-shadow: 0 8px 24px rgba(31, 43, 50, 0.28);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.9);
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0s 0.35s, background-color 0.3s ease;

  &.is-visible {
    opacity: 1;
    visibility: visible;
    transform: none;
    transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.3s ease;
  }

  &:hover,
  &:active {
    background: $brick-dark;
  }

  @include md {
    right: 32px;
    bottom: calc(28px + env(safe-area-inset-bottom));
  }

  // Desktop: the header CTA and the contact boxes are enough – nobody calls from a desktop browser
  @include lg {
    display: none;
  }
}

.call__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: $brick;
  background: $white;

  svg {
    width: 50%;
    animation: ring 4s ease-in-out 1.5s infinite;
  }
}

// Short "ring" wiggle every few seconds – stops for reduced motion
@keyframes ring {
  0%,
  86%,
  100% {
    transform: none;
  }

  88%,
  92%,
  96% {
    transform: rotate(-14deg);
  }

  90%,
  94%,
  98% {
    transform: rotate(14deg);
  }
}

@include reduced-motion {
  .call,
  .call.is-visible {
    transition: none;
  }

  .call__icon svg {
    animation: none;
  }
}

html.menu-open .call {
  display: none;
}
</style>
