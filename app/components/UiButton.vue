<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the pill button with round icon (taken over from the KK landing page).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    href?: string
    type?: 'button' | 'submit'
    variant?: 'red' | 'outline' | 'light'
    size?: 'md' | 'sm'
    icon?: 'arrow' | 'up' | 'external' | 'send' | 'phone' | 'mail'
    target?: string
    disabled?: boolean
  }>(),
  { variant: 'red', size: 'md', icon: 'arrow', type: 'button' },
)

const tag = computed(() => (props.href ? 'a' : 'button'))
const iconName = computed(() => (['send', 'phone', 'mail'].includes(props.icon) ? props.icon : 'arrow'))
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="href ? undefined : type"
    :target="target"
    :rel="target === '_blank' ? 'noopener' : undefined"
    :disabled="disabled || undefined"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <!-- Fix: circle that grows out of the icon and fills the button on hover -->
    <span class="btn__fill" aria-hidden="true" />
    <span class="btn__label">{{ label }}</span>
    <span class="btn__icon" :class="`btn__icon--${icon}`">
      <UiIcon :name="iconName" />
    </span>
  </component>
</template>

<style lang="scss" scoped>
.btn {
  --btn-h: 50px;
  --btn-icon: 38px;
  --btn-inset: 6px;
  // Fix: hover fill – colour of the icon circle and the text colour on top of it
  --btn-fill: #{$white};
  --btn-fill-text: #{$ink};
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  height: var(--btn-h);
  padding: 0 var(--btn-inset) 0 24px;
  border-radius: calc(var(--btn-h) / 2);
  // Fix: no real border – the outline is drawn by ::after on top of the fill (no gap at the edge,
  // and the width can grow on hover without shifting the layout)
  --btn-ring: 1px;
  --btn-ring-color: #{$brick};
  border: 0;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  color: $white;
  background: $brick;
  transition: color 0.35s ease 0.05s;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 var(--btn-ring) var(--btn-ring-color);
    transition: box-shadow 0.35s ease;
    pointer-events: none;
  }

  @include lg {
    --btn-h: #{u(58)};
    --btn-icon: #{u(44)};
    --btn-inset: #{u(7)};
    gap: u(22);
    padding-left: u(28);
    font-size: u(18);
    line-height: u(22);
  }

  &--sm {
    @include lg {
      --btn-h: #{u(50)};
      --btn-icon: #{u(36)};
      padding-left: u(23);
    }
  }

  &--outline {
    --btn-fill: #{$brick};
    --btn-fill-text: #{$white};
    --btn-ring: 1.5px;
    color: $ink;
    background: $white;

    .btn__icon {
      color: $white;
      background: $brick;
    }
  }

  &--light {
    --btn-fill: #{$brick};
    --btn-fill-text: #{$white};
    --btn-ring: 2px;
    --btn-ring-color: #{$cream};
    color: $ink-dark;
    background: $cream;

    .btn__icon {
      color: $white;
      background: $brick;
    }
  }

  &:hover:not(:disabled),
  &:focus-visible {
    color: var(--btn-fill-text);

    .btn__fill {
      transform: translateY(-50%) scale(var(--btn-grow, 26)); // Fix: 18 did not reach the left edge of wide buttons
    }

    .btn__icon svg {
      transform: translateX(3px);
    }
  }

  // Fix: 2px outline in the fill colour's partner on hover (red buttons: red ring around the white fill)
  &:hover:not(:disabled),
  &:focus-visible {
    --btn-ring: 2px;
  }

  &--light:hover:not(:disabled),
  &--light:focus-visible {
    --btn-ring-color: #{$brick};
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}

.btn__fill {
  position: absolute;
  right: var(--btn-inset);
  top: 50%;
  z-index: -1;
  width: var(--btn-icon);
  height: var(--btn-icon);
  border-radius: 50%;
  background: var(--btn-fill);
  transform: translateY(-50%) scale(1);
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  pointer-events: none;
}

.btn__label {
  position: relative;
}

.btn__icon {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--btn-icon);
  height: var(--btn-icon);
  border-radius: 50%;
  color: $ink;
  background: $white;

  svg {
    width: 45.5%;
    height: auto;
    transition: transform 0.3s ease;
  }

  &--up svg {
    rotate: -90deg;
  }

  &--external svg {
    rotate: -45deg;
  }
}

@include reduced-motion {
  .btn,
  .btn__fill {
    transition: none;
  }
}

.btn:hover .btn__icon--up svg,
.btn:hover .btn__icon--phone svg,
.btn:hover .btn__icon--mail svg {
  transform: none;
}
</style>
