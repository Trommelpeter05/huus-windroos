<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the small Travanto rating badge (stars, score, number of reviews) – live value from Travanto,
* the values from content.ts until it is loaded.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { reviews, type Unit } from '~/data/content'

const props = withDefaults(defineProps<{ unit: Unit; light?: boolean }>(), { light: false })
const live = useReviews(props.unit.travanto.id)
const value = computed(() => live.value.data?.value ?? props.unit.rating.value)
const count = computed(() => live.value.data?.count ?? props.unit.rating.count)
const fmt = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
</script>

<template>
  <!-- Fix: without the review section the badge opens the reviews on Travanto -->
  <a
    :href="reviews.show ? '#bewertungen' : unit.travanto.url"
    :target="reviews.show ? undefined : '_blank'"
    :rel="reviews.show ? undefined : 'noopener'"
    class="rb"
    :class="{ 'rb--light': light }"
    :aria-label="`${fmt(value)} von 5 Punkten aus ${count} Bewertungen bei Travanto – ${reviews.show ? 'zu den Gästestimmen' : 'öffnet Travanto in neuem Tab'}`"
  >
    <!-- Fix: stars + average + source (number of reviews only in the aria-label) -->
    <UiStars :value="value" class="rb__stars" />
    <strong class="rb__value">{{ fmt(value) }}</strong>
    <span class="rb__source">bei Travanto</span>
  </a>
</template>

<style lang="scss" scoped>
.rb {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  font-size: 15px;
  line-height: 20px;
  color: $ink;

  @include lg {
    gap: u(4) u(10);
    font-size: u(18);
    line-height: u(24);
  }

  &:hover .rb__source {
    text-decoration: underline;
  }
}

.rb__stars {
  width: 96px;

  @include lg {
    width: u(116);
  }
}

.rb__value {
  font-weight: 800;
}

.rb__source {
  color: rgba($ink, 0.7);
}

.rb--light {
  color: $white;

  .rb__source {
    color: rgba($white, 0.75);
  }
}
</style>
