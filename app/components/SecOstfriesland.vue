<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the region section on the dark design: schematic map of the Rheiderland next to the family's tips
* (tabs: trips, rainy days, food & shopping, practical), hovering a tip highlights its pin and vice versa,
* plus bike tours starting at the house.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { region, reviews } from '~/data/content'

const tab = ref(region.tabs[0]!.key)
const tips = computed(() => region.tabs.find((t) => t.key === tab.value)?.tips ?? [])
const activeTip = ref<number | null>(null)
const activePin = ref<number | null>(null)

const active = computed(() => (activeTip.value !== null ? tips.value[activeTip.value] : null))
const highlightedPin = computed(() => activePin.value ?? active.value?.pin ?? null)
const highlightedEdge = computed(() => active.value?.edge ?? null)

watch(tab, () => {
  activeTip.value = null
})

function tipActive(i: number) {
  const t = tips.value[i]
  return activeTip.value === i || (activePin.value !== null && t?.pin === activePin.value)
}
</script>

<template>
  <section id="ostfriesland" class="region">
    <!-- Fix: the notch continues the colour of the section above (reviews: white, apartment: sand) -->
    <span class="region__notch" :class="{ 'region__notch--sand': !reviews.show }" aria-hidden="true" />
    <div class="frame wrap region__grid">
      <div class="region__head">
        <p class="eyebrow t-label" data-reveal>{{ region.label }}</p>
        <h2 class="t-h2 region__title" data-reveal>
          <span class="region__red">{{ region.titleRed }}</span>
          <span class="t-h2-m region__sub">{{ region.titleDark }}</span>
        </h2>
      </div>
      <p class="t-lead region__lead" data-reveal>{{ region.lead }}</p>
    </div>

    <div class="frame wrap region__body" data-reveal>
      <div class="guide">
        <RegionMap class="guide__map" :pins="region.pins" :home="region.home" :active="highlightedPin" :edge="highlightedEdge" @hover="activePin = $event" />

        <div class="guide__tips">
          <div class="guide__tabs" role="tablist" aria-label="Tipps nach Thema">
            <button
              v-for="t in region.tabs"
              :id="`tip-tab-${t.key}`"
              :key="t.key"
              type="button"
              role="tab"
              class="guide__tab"
              :class="{ 'is-active': t.key === tab }"
              :aria-selected="t.key === tab"
              :aria-controls="`tip-panel-${t.key}`"
              @click="tab = t.key"
            >
              {{ t.label }}
            </button>
          </div>

          <!-- Fix: all tab panels are in the HTML (v-show) – otherwise Google only sees the first tab -->
          <ul
            v-for="panel in region.tabs"
            v-show="panel.key === tab"
            :id="`tip-panel-${panel.key}`"
            :key="panel.key"
            class="guide__list"
            role="tabpanel"
            :aria-labelledby="`tip-tab-${panel.key}`"
          >
            <li
              v-for="(t, i) in panel.tips"
              :key="t.title"
              class="tip"
              :class="{ 'is-active': panel.key === tab && tipActive(i) }"
              tabindex="0"
              @mouseenter="activeTip = i"
              @mouseleave="activeTip = null"
              @focus="activeTip = i"
              @blur="activeTip = null"
            >
              <span class="tip__no" :class="{ 'tip__no--plain': !t.pin }" aria-hidden="true">
                <template v-if="t.pin">{{ t.pin }}</template>
                <UiIcon v-else-if="t.edge" name="arrow" :class="`tip__edge tip__edge--${t.edge}`" />
                <UiIcon v-else name="pin" />
              </span>
              <div class="tip__body">
                <p class="tip__head">
                  <strong class="tip__title">{{ t.title }}</strong>
                  <span v-if="t.distance" class="tip__distance">{{ t.distance }}</span>
                </p>
                <p class="tip__text">{{ t.text }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <h3 class="t-label region__kicker">{{ region.bikeTitle }}</h3>
      <ul class="bikes">
        <li v-for="b in region.bikes" :key="b.title" class="bike">
          <svg class="bike__icon" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="31" r="8" /><circle cx="36" cy="31" r="8" /><path d="M12 31l7-13h11l6 13M19 18l5 13h6M27 12h5" />
          </svg>
          <h4 class="t-h3 bike__title">{{ b.title }}</h4>
          <ul class="bike__facts">
            <li v-for="f in b.facts" :key="f">{{ f }}</li>
          </ul>
          <p class="t-body bike__text">{{ b.text }}</p>
          <a v-if="b.link" :href="b.link" class="bike__link" target="_blank" rel="noopener">Zur Route <UiIcon name="arrow" /><span class="sr-only"> (öffnet in neuem Tab)</span></a>
        </li>
      </ul>
    </div>

    <div class="region__spacer" />
  </section>
</template>

<style lang="scss" scoped>
$light-brick: #e4775f; // lighter brick for contrast on the dark surface

.region {
  position: relative;
  padding: 72px 0 0;
  overflow: hidden;
  color: $white;
  background: linear-gradient(180deg, $ink-dark 0%, #263842 100%);

  @include lg {
    padding: u(170) 0 0;
  }
}

.region__notch {
  display: none;

  @include lg {
    position: absolute;
    @include edge-tab(top, 36);
    left: 0;
    display: block;
    width: calc(50% - u(240));
    background: $white;
  }

  &--sand {
    background: $bg-sand-60;
  }
}

.region__grid {
  display: grid;
  gap: 24px;

  @include lg {
    grid-template-columns: u(700) u(860);
    justify-content: space-between;
    align-items: end;
    gap: 0;
  }
}

.eyebrow::before {
  background: $cream;
}

.region__title > span {
  display: block;
}

.region__red {
  color: $light-brick;
}

.region__sub {
  margin-top: 6px;
  color: $cream;
}

.region__lead {
  color: rgba($white, 0.9);
}

.region__kicker {
  margin: 56px 0 18px;
  color: $cream;

  @include lg {
    margin: u(100) 0 u(24);
  }
}

.region__spacer {
  height: 72px;

  @include lg {
    height: u(150);
  }
}

// ---------------------------------------------------------------------------
// Map + tips
// ---------------------------------------------------------------------------
.guide {
  display: grid;
  gap: 24px;
  margin-top: 40px;

  @include lg {
    grid-template-columns: u(800) 1fr;
    gap: u(50);
    align-items: start;
    margin-top: u(80);
  }
}

.guide__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @include lg {
    gap: u(10);
  }
}

.guide__tab {
  padding: 9px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 15px;
  color: $white;
  background: rgba($white, 0.1);
  transition: background-color 0.25s ease, color 0.25s ease;

  @include lg {
    padding: u(11) u(22);
    border-radius: u(24);
    font-size: u(18);
  }

  &:hover {
    background: rgba($white, 0.18);
  }

  &.is-active {
    color: $ink;
    background: $cream;
  }
}

.guide__list {
  display: grid;
  gap: 8px;
  margin-top: 20px;

  @include lg {
    gap: u(10);
    margin-top: u(26);
  }
}

.tip {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 8px;
  background: rgba($white, 0.05);
  transition: background-color 0.25s ease;
  outline-offset: 2px;

  @include lg {
    gap: u(18);
    padding: u(18) u(22);
    border-radius: u(8);
  }

  &.is-active {
    background: rgba($white, 0.13);

    .tip__no {
      background: $brick;
    }
  }
}

.tip__no {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 800;
  font-size: 15px;
  color: $white;
  background: rgba($white, 0.15);
  transition: background-color 0.25s ease;

  @include lg {
    width: u(36);
    height: u(36);
    font-size: u(17);
  }

  svg {
    width: 50%;
  }
}

.tip__edge--north {
  rotate: -90deg;
}

.tip__edge--south {
  rotate: 90deg;
}

.tip__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.tip__title {
  font-weight: 750;
  font-size: 18px;
  color: $cream;

  @include lg {
    font-size: u(21);
  }
}

.tip__distance {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $light-brick;

  @include lg {
    font-size: u(14);
  }
}

.tip__text {
  margin-top: 4px;
  font-size: 16px;
  line-height: 23px;
  color: rgba($white, 0.8);

  @include lg {
    font-size: u(18);
    line-height: u(27);
  }
}

// ---------------------------------------------------------------------------
// Bike tours
// ---------------------------------------------------------------------------
.bikes {
  display: grid;
  gap: 16px;

  @include md {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @include lg {
    gap: u(24);
  }
}

.bike {
  display: flex;
  flex-direction: column;
  padding: 24px 22px;
  border-radius: 10px;
  background: #22323b;

  @include lg {
    padding: u(36) u(36);
    border-radius: u(10);
  }
}

.bike__icon {
  width: 44px;
  color: $light-brick;

  @include lg {
    width: u(54);
  }
}

.bike__title {
  margin-top: 14px;
  color: $cream;
}

.bike__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;

  li {
    padding: 3px 9px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 13px;
    background: rgba($white, 0.1);

    @include lg {
      font-size: u(15);
    }
  }
}

.bike__text {
  margin-top: 12px;
  color: rgba($white, 0.82);
}

.bike__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 18px;
  font-weight: 700;
  color: $cream;

  svg {
    width: 18px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
}
</style>
