<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle one accommodation section (text, equipment, price panel, photo strip with lightbox) –
* used for the Ferienwohnung and the Apartment.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { pricing, units, type Unit } from '~/data/content'

const props = withDefaults(defineProps<{ unit: Unit; reverse?: boolean; tone?: 'white' | 'sand' }>(), { reverse: false, tone: 'white' })

// Fix: "Verfügbarkeit prüfen" opens this accommodation in the booking section
// Fix: same initial value as in SecBelegung.vue – otherwise no tab is preselected in the calendar
const belegungUnit = useState<string>('belegungUnit', () => units[0]!.id)
// Fix: one price for the whole year → price card; different season prices → table
const seasonal = computed(() => new Set(props.unit.prices.map((p) => p.price)).size > 1)
const strip = ref<HTMLElement | null>(null)
const lightbox = ref<{ open: (i: number) => void } | null>(null)

function scrollStrip(dir: 1 | -1) {
  const el = strip.value
  if (!el) return
  const item = el.querySelector<HTMLElement>('li')
  const step = item ? item.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth * 0.8
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}

function request() {
  belegungUnit.value = props.unit.id
}
</script>

<template>
  <section :id="unit.id" class="unit-sec" :class="[`unit-sec--${tone}`, { 'unit-sec--reverse': reverse }]" :aria-labelledby="`${unit.id}-title`">
    <div class="frame wrap">
      <div class="unit-sec__grid">
        <div class="unit-sec__content">
          <p class="eyebrow t-label" data-reveal>{{ unit.label }}</p>
          <h2 :id="`${unit.id}-title`" class="t-h2 unit-sec__title" data-reveal>
            <span class="red">{{ unit.titleRed }}</span>
            <span class="unit-sec__sub t-h2-m">{{ unit.titleDark }}</span>
          </h2>
          <!-- Fix: Travanto rating of this accommodation -->
          <RatingBadge :unit="unit" class="unit-sec__rating" data-reveal />
          <div class="unit-sec__text" data-reveal>
            <p v-for="(p, i) in unit.text" :key="i" class="t-body">{{ p }}</p>
          </div>

          <div class="equip">
            <div v-for="group in unit.equipment" :key="group.title" class="equip__group" data-reveal>
              <h3 class="t-label equip__title">{{ group.title }}</h3>
              <ul class="equip__list">
                <li v-for="item in group.items" :key="item" class="t-body">
                  <span class="equip__check"><UiIcon name="check" /></span>{{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="unit-sec__aside">
          <!-- Fix: floor plan instead of a photo – uncropped, without parallax -->
          <div class="unit-sec__img unit-sec__img--plan" data-reveal>
            <img :src="unit.plan.src" :alt="unit.plan.alt" width="1000" height="720" loading="lazy" decoding="async" />
          </div>

          <!--
            Fix: price card instead of the season table (all seasons cost the same). The table comes back
            automatically as soon as content.ts has different season prices.
          -->
          <div class="price" data-reveal>
            <h3 class="t-label price__title">Preis</h3>
            <template v-if="!seasonal">
              <p class="price__big"><span>ab</span> <strong>{{ unit.priceFrom }} €</strong> <span>pro Nacht</span></p>
              <p class="price__year">ganzjährig · für bis zu 2 Personen</p>
            </template>
            <table v-else class="price__table">
              <caption class="sr-only">Preise {{ unit.titleRed }} pro Nacht</caption>
              <thead>
                <tr>
                  <th scope="col">Saison</th>
                  <th scope="col">pro Nacht</th>
                  <th scope="col"><abbr title="Mindestübernachtung">Mind.</abbr></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in unit.prices" :key="row.season">
                  <th scope="row">{{ row.season }}</th>
                  <td><strong>{{ row.price }} €</strong></td>
                  <td>{{ row.minNights }} Nächte</td>
                </tr>
              </tbody>
            </table>
            <ul class="price__incl">
              <li><UiIcon name="check" />Bettwäsche & Handtücher</li>
              <li><UiIcon name="check" />WLAN (Glasfaser)</li>
              <li><UiIcon name="check" />Parkplatz am Haus</li>
            </ul>
            <dl class="price__fees t-small">
              <div><dt>Endreinigung</dt><dd>{{ pricing.cleaning }} €</dd></div>
              <div><dt>Mindestaufenthalt</dt><dd>{{ unit.prices[0]?.minNights }} Nächte</dd></div>
              <div><dt>Kurzurlaub bis {{ pricing.shortStayMaxNights }} Nächte</dt><dd>+{{ unit.shortStaySurcharge }} € / Nacht</dd></div>
            </dl>
            <UiButton label="Verfügbarkeit & Preis prüfen" href="#belegung" variant="light" class="price__btn" @click="request" />
          </div>
        </div>
      </div>

      <div class="gallery" data-reveal>
        <div class="gallery__head">
          <h3 class="t-label">Galerie <span class="gallery__count">{{ unit.gallery.length }} Fotos</span></h3>
          <div class="gallery__nav">
            <button type="button" class="round-icon gallery__btn gallery__btn--prev" aria-label="Vorherige Fotos" @click="scrollStrip(-1)"><UiIcon name="arrow" /></button>
            <button type="button" class="round-icon gallery__btn" aria-label="Nächste Fotos" @click="scrollStrip(1)"><UiIcon name="arrow" /></button>
          </div>
        </div>
        <ul ref="strip" class="gallery__strip">
          <li v-for="(img, i) in unit.gallery" :key="i">
            <button type="button" class="gallery__item img-ph" :aria-label="`Foto vergrößern: ${img.alt}`" @click="lightbox?.open(i)">
              <img :src="img.src" :alt="`${img.alt} – ${unit.label} im Huus Windroos, Pogum`" width="500" height="375" loading="lazy" decoding="async" />
              <span class="gallery__caption">{{ img.alt }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <UiLightbox ref="lightbox" :images="unit.gallery" :label="`Fotos ${unit.titleRed}`" />
  </section>
</template>

<style lang="scss" scoped>
.unit-sec {
  position: relative;
  padding: 72px 0;

  @include lg {
    padding: u(170) 0 u(150);
  }

  &--sand {
    background: $bg-sand-60;
  }
}

.unit-sec__grid {
  display: grid;
  gap: 40px;

  @include lg {
    grid-template-columns: u(800) u(720);
    justify-content: space-between;
    gap: 0;
  }
}

.unit-sec--reverse .unit-sec__grid {
  @include lg {
    grid-template-columns: u(720) u(800);
  }

  .unit-sec__aside {
    @include lg {
      order: -1;
    }
  }
}

.unit-sec__title {
  margin-top: 4px;

  > span {
    display: block;
  }
}

.unit-sec__rating {
  margin-top: 16px;

  @include lg {
    margin-top: u(22);
  }
}

.unit-sec__sub {
  margin-top: 4px;
  color: $ink;

  @include lg {
    margin-top: u(6);
  }
}

.unit-sec__text {
  display: grid;
  gap: 14px;
  margin-top: 24px;

  @include lg {
    gap: u(18);
    margin-top: u(40);
  }
}

.equip {
  display: grid;
  gap: 28px;
  margin-top: 36px;

  @include md {
    grid-template-columns: 1.2fr 1fr;
    gap: 32px;
  }

  @include lg {
    gap: u(48);
    margin-top: u(56);
  }
}

.equip__title {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba($ink, 0.2);
  color: $sea;

  @include lg {
    padding-bottom: u(12);
  }
}

.equip__list {
  display: grid;
  gap: 10px;
  margin-top: 14px;

  @include lg {
    gap: u(12);
    margin-top: u(18);
  }

  li {
    display: flex;
    gap: 10px;

    @include lg {
      gap: u(12);
    }
  }
}

.equip__check {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  border-radius: 50%;
  color: $white;
  background: $brick;

  @include lg {
    width: u(26);
    height: u(26);
    margin-top: u(4);
  }

  svg {
    width: 62%;
  }
}

.unit-sec__aside {
  display: flex;
  flex-direction: column;
}

.unit-sec__img {
  aspect-ratio: 4 / 3;
  border-radius: 10px;

  @include lg {
    border-radius: u(10);
  }

  // Fix: floor plan in full size on its paper colour; bottom padding = overlap of the price card
  &--plan {
    overflow: hidden;
    background: #fbf7f4;

    img {
      width: 100%;
      height: 100%;
      padding: 12px 12px 52px;
      object-fit: contain;

      @include md {
        padding: 16px 16px 76px;
      }

      @include lg {
        padding: u(20) u(20) u(110);
      }
    }
  }
}

// Dark price panel overlapping the image (KK panel motif)
.price {
  position: relative;
  z-index: 1;
  margin: -40px 16px 0;
  padding: 28px 22px 30px;
  border-radius: 10px;
  color: $white;
  background: linear-gradient(180deg, $ink 0%, $ink-dark 100%);

  @include md {
    margin: -60px 32px 0;
  }

  @include lg {
    margin: u(-90) u(50) 0;
    padding: u(46) u(50) u(50);
    border-radius: u(10);
  }
}

.price__title {
  color: rgba($white, 0.7);
}

.price__big {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
  font-weight: 700;

  strong {
    font-weight: 800;
    font-size: 56px;
    line-height: 1;
    letter-spacing: -0.03em;
    color: $cream;

    @include lg {
      font-size: u(84);
    }
  }
}

.price__year {
  margin-top: 6px;
  font-size: 15px;
  color: rgba($white, 0.75);

  @include lg {
    font-size: u(18);
  }
}

.price__incl {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;

  @include lg {
    gap: u(10);
    margin-top: u(28);
  }

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px 6px 8px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 14px;
    background: rgba($white, 0.1);

    @include lg {
      font-size: u(16);
    }
  }

  svg {
    width: 16px;
    color: $cream;
  }
}

.price__fees {
  margin-top: 18px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 0;
    border-bottom: 1px solid rgba($white, 0.15);
  }

  dd {
    font-weight: 700;
    white-space: nowrap;
  }
}

.price__table {
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
  font-size: 16px;
  line-height: 22px;

  @include lg {
    margin-top: u(22);
    font-size: u(20);
    line-height: u(28);
  }

  th,
  td {
    padding: 10px 0;
    border-bottom: 1px solid rgba($white, 0.18);
    text-align: left;
    font-weight: 400;

    @include lg {
      padding: u(12) 0;
    }
  }

  thead th {
    padding-top: 0;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba($white, 0.7);

    @include lg {
      font-size: u(15);
    }
  }

  td {
    text-align: right;
  }

  thead th:not(:first-child) {
    text-align: right;
  }

  strong {
    font-weight: 800;
    color: $cream;
  }

  abbr {
    text-decoration: none;
  }
}

.price__note {
  margin-top: 16px;
  color: rgba($white, 0.8);

  @include lg {
    margin-top: u(20);
  }
}

.price__btn {
  margin-top: 22px;

  @include lg {
    margin-top: u(30);
  }
}

// ---------------------------------------------------------------------------
// Photo strip
// ---------------------------------------------------------------------------
.gallery {
  margin-top: 56px;

  @include lg {
    margin-top: u(110);
  }
}

.gallery__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;

  @include lg {
    margin-bottom: u(26);
  }
}

.gallery__count {
  margin-left: 10px;
  font-weight: 500;
  color: rgba($ink, 0.6);
  letter-spacing: 0.04em;
}

.gallery__nav {
  display: flex;
  gap: 10px;

  @include lg {
    gap: u(12);
  }
}

.gallery__btn--prev svg {
  rotate: 180deg;
}

.gallery__btn:hover {
  background: $brick-dark;
}

.gallery__strip {
  display: grid;
  grid-auto-columns: 78%;
  grid-auto-flow: column;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior-x: contain;

  @include md {
    grid-auto-columns: calc((100% - 2 * 16px) / 3);
    gap: 16px;
  }

  @include lg {
    grid-auto-columns: calc((100% - 3 * #{u(24)}) / 4);
    gap: u(24);
  }

  &::-webkit-scrollbar {
    display: none;
  }

  li {
    scroll-snap-align: start;
  }
}

.gallery__item {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 8px;

  @include lg {
    border-radius: u(8);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.2, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.gallery__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 28px 14px 12px;
  font-weight: 700;
  font-size: 15px;
  text-align: left;
  color: $white;
  background: linear-gradient(180deg, rgba(31, 43, 50, 0) 0%, rgba(31, 43, 50, 0.7) 100%);

  @include lg {
    padding: u(40) u(18) u(14);
    font-size: u(18);
  }
}
</style>
