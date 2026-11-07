<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the accordion list with round plus icon (taken over from the KK landing page).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: { title: string; text: string }[]
    /** index opened initially, -1 = none */
    initial?: number
    idPrefix: string
  }>(),
  { initial: -1 },
)

const open = ref<number>(props.initial)

function toggle(i: number) {
  open.value = open.value === i ? -1 : i
}
</script>

<template>
  <ul class="acc">
    <li v-for="(item, i) in items" :key="i" class="acc__item" :class="{ 'is-open': open === i }">
      <h3 class="acc__head">
        <button
          :id="`${idPrefix}-btn-${i}`"
          type="button"
          class="acc__btn"
          :aria-expanded="open === i"
          :aria-controls="`${idPrefix}-body-${i}`"
          @click="toggle(i)"
        >
          <span class="acc__title t-h3">{{ item.title }}</span>
          <span class="acc__icon round-icon"><UiIcon name="plus" /></span>
        </button>
      </h3>
      <!-- Height animation via grid-template-rows 0fr → 1fr (smooth in both directions) -->
      <div :id="`${idPrefix}-body-${i}`" class="acc__body" role="region" :aria-labelledby="`${idPrefix}-btn-${i}`" :inert="open !== i || undefined">
        <div class="acc__inner">
          <p class="acc__text t-body">{{ item.text }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
$ease: cubic-bezier(0.33, 0, 0.2, 1);
$dur: 0.5s;

.acc {
  border-bottom: 1px solid rgba($ink, 0.2);
}

.acc__item {
  padding: 20px 0;
  border-top: 1px solid rgba($ink, 0.2);

  @include lg {
    padding: u(30) 0;
  }
}

.acc__head {
  font: inherit;
}

.acc__btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  text-align: left;
  color: inherit;

  &:hover .acc__icon {
    transform: rotate(90deg);
  }
}

.acc__icon {
  transition:
    background-color $dur $ease,
    transform $dur $ease;
}

.is-open .acc__icon,
.is-open .acc__btn:hover .acc__icon {
  background: $ink;
  transform: rotate(45deg);
}

.acc__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows $dur $ease;

  .is-open & {
    grid-template-rows: 1fr;
  }
}

.acc__inner {
  min-height: 0;
  overflow: hidden;
}

.acc__text {
  max-width: 680px;
  padding-top: 10px;
  opacity: 0;
  transform: translateY(-6px);
  transition:
    opacity 0.3s ease,
    transform $dur $ease;

  @include lg {
    max-width: u(780);
    padding-top: u(12);
  }

  .is-open & {
    opacity: 1;
    transform: none;
    transition:
      opacity 0.4s ease 0.1s,
      transform $dur $ease;
  }
}

@include reduced-motion {
  .acc__body,
  .acc__text,
  .acc__icon {
    transition: none;
  }
}
</style>
