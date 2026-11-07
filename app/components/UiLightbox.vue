<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the photo lightbox (native <dialog>, previous/next, arrow keys, swipe, caption).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
const props = defineProps<{ images: { src: string; alt: string }[]; label: string }>()

const dialog = ref<HTMLDialogElement | null>(null)
const index = ref(0)
const current = computed(() => props.images[index.value])
let touchX: number | null = null

function open(i: number) {
  index.value = i
  dialog.value?.showModal()
  document.documentElement.classList.add('lightbox-open')
}

function close() {
  dialog.value?.close()
}

function onClose() {
  document.documentElement.classList.remove('lightbox-open')
}

function go(dir: 1 | -1) {
  const n = props.images.length
  index.value = (index.value + dir + n) % n
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}

// Click on the dark backdrop (the dialog element itself) closes
function onClick(e: MouseEvent) {
  if (e.target === dialog.value) close()
}

function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0]?.clientX ?? null
}

function onTouchEnd(e: TouchEvent) {
  if (touchX === null) return
  const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  touchX = null
}

defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="lb" :aria-label="label" @keydown="onKey" @click="onClick" @close="onClose">
    <figure v-if="current" class="lb__figure" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
      <img :key="current.src" class="lb__img" :src="current.src" :alt="current.alt" />
      <figcaption class="lb__caption">
        <span>{{ current.alt }}</span>
        <span class="lb__count">{{ index + 1 }} / {{ images.length }}</span>
      </figcaption>
    </figure>
    <button type="button" class="lb__btn lb__btn--close round-icon" aria-label="Schließen" @click="close"><UiIcon name="close" /></button>
    <button type="button" class="lb__btn lb__btn--prev round-icon" aria-label="Vorheriges Foto" @click="go(-1)"><UiIcon name="arrow" /></button>
    <button type="button" class="lb__btn lb__btn--next round-icon" aria-label="Nächstes Foto" @click="go(1)"><UiIcon name="arrow" /></button>
  </dialog>
</template>

<style lang="scss" scoped>
.lb {
  width: 100vw;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  color: $white;
  background: rgba(20, 28, 33, 0.94);

  &::backdrop {
    background: transparent;
  }

  &[open] {
    display: flex;
    align-items: center;
    justify-content: center;
    animation: lb-in 0.3s ease;
  }
}

@keyframes lb-in {
  from {
    opacity: 0;
  }
}

.lb__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: min(92vw, 1100px);
}

.lb__img {
  max-width: 100%;
  max-height: calc(100dvh - 160px);
  border-radius: 6px;
  object-fit: contain;
  animation: lb-in 0.35s ease;
}

.lb__caption {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  margin-top: 14px;
  font-weight: 700;
  font-size: 16px;
}

.lb__count {
  font-weight: 500;
  opacity: 0.7;
}

.lb__btn {
  position: absolute;

  &:hover {
    background: $brick-dark;
  }

  &--close {
    top: 16px;
    right: 16px;
  }

  &--prev,
  &--next {
    top: 50%;
    translate: 0 -50%;
  }

  &--prev {
    left: 12px;

    svg {
      rotate: 180deg;
    }
  }

  &--next {
    right: 12px;
  }

  @include md {
    &--prev {
      left: 28px;
    }

    &--next {
      right: 28px;
    }
  }
}

:global(html.lightbox-open) {
  overflow: hidden;
}
</style>
