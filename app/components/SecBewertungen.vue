<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the guest review section: combined Travanto score of both accommodations, category bars,
* the latest guest comments as a carousel and links to all reviews on Travanto.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { reviews as copy, units } from '~/data/content'

const live = units.map((u) => ({ unit: u, state: useReviews(u.travanto.id) }))

const perUnit = computed(() =>
  live.map(({ unit, state }) => ({
    unit,
    value: state.value.data?.value ?? unit.rating.value,
    count: state.value.data?.count ?? unit.rating.count,
  })),
)
const total = computed(() => perUnit.value.reduce((n, u) => n + u.count, 0))
const value = computed(() => perUnit.value.reduce((s, u) => s + u.value * u.count, 0) / (total.value || 1))

// Category scores weighted by the number of reviews per accommodation
const categories = computed(() => {
  const map = new Map<string, { sum: number; n: number }>()
  for (const { state } of live) {
    const d = state.value.data
    if (!d) continue
    for (const c of d.categories) {
      if (c.label === 'Gesamteindruck') continue
      const e = map.get(c.label) ?? { sum: 0, n: 0 }
      e.sum += c.value * d.count
      e.n += d.count
      map.set(c.label, e)
    }
  }
  return [...map].map(([label, e]) => ({ label, value: e.sum / e.n }))
})

const quotes = computed(() =>
  live
    .flatMap(({ unit, state }) => (state.value.data?.reviews ?? []).map((r) => ({ ...r, unit: unit.titleRed })))
    .filter((r) => r.text)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, copy.maxQuotes),
)
const loading = computed(() => live.some(({ state }) => state.value.status === 'loading' || state.value.status === 'idle'))
const failed = computed(() => live.every(({ state }) => state.value.status === 'error'))

const fmt = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const month = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' })

const track = ref<HTMLElement | null>(null)
function scroll(dir: 1 | -1) {
  const el = track.value
  const item = el?.querySelector<HTMLElement>('li')
  if (el && item) el.scrollBy({ left: dir * (item.offsetWidth + 20), behavior: 'smooth' })
}
</script>

<template>
  <section id="bewertungen" class="rev">
    <div class="frame wrap rev__grid">
      <div class="rev__left">
        <p class="eyebrow t-label" data-reveal>{{ copy.label }}</p>
        <h2 class="t-h2" data-reveal><span class="red">{{ copy.titleRed }}</span> {{ copy.titleDark }}</h2>

        <div class="score" data-reveal>
          <div class="score__main">
            <strong class="score__value">{{ fmt(value) }}</strong>
            <div>
              <UiStars :value="value" class="score__stars" />
              <p class="score__count">{{ total }} Bewertungen bei Travanto</p>
            </div>
          </div>

          <ul v-if="categories.length" class="score__cats">
            <li v-for="c in categories" :key="c.label">
              <span class="score__label">{{ c.label }}</span>
              <span class="score__bar" aria-hidden="true"><span :style="{ width: `${(c.value / 5) * 100}%` }" /></span>
              <span class="score__num">{{ fmt(c.value) }}</span>
            </li>
          </ul>

          <ul class="score__units">
            <li v-for="u in perUnit" :key="u.unit.id">
              <a :href="u.unit.travanto.url" target="_blank" rel="noopener">
                <span>{{ u.unit.titleRed }}</span>
                <span><strong>{{ fmt(u.value) }}</strong> · {{ u.count }} Bewertungen <UiIcon name="arrow" /></span>
                <span class="sr-only"> (Travanto, öffnet in neuem Tab)</span>
              </a>
            </li>
          </ul>
        </div>
        <p class="t-small rev__source" data-reveal>{{ copy.text }}</p>
      </div>

      <div class="rev__right" data-reveal>
        <div class="rev__nav">
          <button type="button" class="round-icon rev__btn rev__btn--prev" aria-label="Vorherige Bewertungen" @click="scroll(-1)"><UiIcon name="arrow" /></button>
          <button type="button" class="round-icon rev__btn" aria-label="Nächste Bewertungen" @click="scroll(1)"><UiIcon name="arrow" /></button>
        </div>

        <ul v-if="quotes.length" ref="track" class="quotes">
          <li v-for="q in quotes" :key="q.name + q.date" class="quote">
            <svg class="quote__mark" viewBox="0 0 40 30" aria-hidden="true"><path d="M0 30V17Q0 3 14 0l2 4Q8 7 8 15h8v15zm22 0V17q0-14 14-17l2 4q-8 3-8 11h8v15z" /></svg>
            <UiStars :value="q.rating" class="quote__stars" />
            <span class="sr-only">{{ q.rating }} von 5 Punkten</span>
            <blockquote class="quote__text t-body">{{ q.text }}</blockquote>
            <p class="quote__meta">
              <strong>{{ q.name }}</strong>
              <span>{{ month(q.date) }} · {{ q.unit }}</span>
              <span class="quote__verified"><UiIcon name="check" />verifiziert bei Travanto</span>
            </p>
          </li>
        </ul>
        <ul v-else-if="loading" class="quotes" aria-hidden="true">
          <li v-for="i in 2" :key="i" class="quote quote--skeleton" />
        </ul>
        <p v-else-if="failed" class="t-body rev__fallback">
          Die aktuellen Gästestimmen finden Sie direkt bei
          <a :href="units[0]!.travanto.url" target="_blank" rel="noopener">Travanto</a>.
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.rev {
  padding: 72px 0;
  background: $white;

  @include lg {
    padding: u(150) 0;
  }
}

.rev__grid {
  display: grid;
  gap: 40px;

  @include lg {
    grid-template-columns: u(560) u(980);
    justify-content: space-between;
    gap: 0;
  }
}

.score {
  margin-top: 28px;
  padding: 24px 22px;
  border-radius: 10px;
  background: $bg-sand-40;

  @include lg {
    margin-top: u(44);
    padding: u(36) u(40);
    border-radius: u(10);
  }
}

.score__main {
  display: flex;
  align-items: center;
  gap: 18px;
}

.score__value {
  font-weight: 800;
  font-size: 72px;
  line-height: 1;
  letter-spacing: -0.04em;
  color: $brick;

  @include lg {
    font-size: u(110);
  }
}

.score__stars {
  width: 150px;

  @include lg {
    width: u(180);
  }
}

.score__count {
  margin-top: 6px;
  font-weight: 700;
  font-size: 16px;

  @include lg {
    font-size: u(19);
  }
}

.score__cats {
  display: grid;
  gap: 10px;
  margin-top: 24px;

  @include lg {
    gap: u(12);
    margin-top: u(32);
  }

  li {
    display: grid;
    grid-template-columns: 9em 1fr 2.4em;
    align-items: center;
    gap: 12px;
    font-size: 15px;

    @include lg {
      font-size: u(18);
    }
  }
}

.score__bar {
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: rgba($ink, 0.12);

  span {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: $sea;
  }
}

.score__num {
  font-weight: 800;
  text-align: right;
}

.score__units {
  margin-top: 22px;
  border-top: 1px solid rgba($ink, 0.15);

  @include lg {
    margin-top: u(28);
  }

  a {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba($ink, 0.15);
    font-weight: 700;
    font-size: 16px;

    @include lg {
      padding: u(14) 0;
      font-size: u(19);
    }

    &:hover {
      color: $brick;
    }
  }

  svg {
    display: inline-block;
    width: 16px;
    margin-left: 4px;
    vertical-align: -2px;
  }
}

.rev__source {
  margin-top: 14px;
  color: rgba($ink, 0.7);
}

.rev__right {
  min-width: 0;

  @include lg {
    padding-top: u(30);
  }
}

.rev__nav {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 16px;
}

.rev__btn--prev svg {
  rotate: 180deg;
}

.quotes {
  display: grid;
  grid-auto-columns: 88%;
  grid-auto-flow: column;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  @include md {
    grid-auto-columns: calc((100% - 20px) / 2);
    gap: 20px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.quote {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  padding: 28px 24px 24px;
  border-radius: 10px;
  background: $bg-sand-40;
  scroll-snap-align: start;

  @include lg {
    min-height: u(440);
    padding: u(44) u(40) u(36);
    border-radius: u(10);
  }

  &--skeleton {
    background: linear-gradient(90deg, $bg-sand-40 0%, $bg-sand-60 50%, $bg-sand-40 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s linear infinite;
  }
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.quote__mark {
  position: absolute;
  right: 22px;
  top: 22px;
  width: 44px;
  fill: rgba($brick, 0.14);

  @include lg {
    width: u(60);
  }
}

.quote__stars {
  width: 100px;

  @include lg {
    width: u(120);
  }
}

.quote__text {
  margin: 16px 0 0;
  white-space: pre-line;

  @include lg {
    margin-top: u(22);
  }
}

.quote__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: auto;
  padding-top: 20px;
  font-size: 15px;

  @include lg {
    font-size: u(17);
  }

  strong {
    font-size: 17px;

    @include lg {
      font-size: u(20);
    }
  }
}

.quote__verified {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-weight: 700;
  font-size: 13px;
  color: $sea;

  @include lg {
    font-size: u(15);
  }

  svg {
    width: 15px;
  }
}

.rev__fallback a {
  color: $brick;
  text-decoration: underline;
}

@include reduced-motion {
  .quote--skeleton {
    animation: none;
  }
}
</style>
