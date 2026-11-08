<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the "Preise & Belegung" section: accommodation tabs, live occupancy calendar from Travanto
* and the price information; "Zeitraum anfragen" hands the stay over to the enquiry form.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { booking, pricing, units } from '~/data/content'

const activeId = useState('belegungUnit', () => units[0]!.id)
const unit = computed(() => units.find((u) => u.id === activeId.value) ?? units[0]!)

// Load both calendars right away – switching tabs is then instant
const occ = Object.fromEntries(units.map((u) => [u.id, useOccupancy(u.travanto.id)]))
const occupancy = computed(() => occ[unit.value.id]!.value)

const arrival = ref('')
const departure = ref('')
const enquiry = useEnquiry()

watch(activeId, () => {
  arrival.value = ''
  departure.value = ''
})

// Fix: no price calculator any more – only the chosen period and the fixed price information
const nights = computed(() =>
  arrival.value && departure.value ? Math.round((Date.parse(departure.value) - Date.parse(arrival.value)) / 86_400_000) : 0,
)

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })

function request() {
  enquiry.value = { unitId: unit.value.id, arrival: arrival.value, departure: departure.value, persons: enquiry.value.persons || '2', stamp: Date.now() }
}
</script>

<template>
  <section id="belegung" class="bel">
    <div class="frame wrap">
      <div class="bel__head">
        <div>
          <p class="eyebrow t-label" data-reveal>{{ booking.label }}</p>
          <h2 class="t-h2" data-reveal><span class="red">{{ booking.titleRed }}</span> {{ booking.titleDark }}</h2>
        </div>
        <p class="t-body bel__text" data-reveal>{{ booking.text }}</p>
      </div>

      <div class="bel__tabs" role="tablist" aria-label="Unterkunft wählen" data-reveal>
        <button
          v-for="u in units"
          :key="u.id"
          type="button"
          role="tab"
          class="bel__tab"
          :class="{ 'is-active': u.id === activeId }"
          :aria-selected="u.id === activeId"
          @click="activeId = u.id"
        >
          {{ u.titleRed }} <span class="bel__tab-price">ab {{ u.priceFrom }} €</span>
        </button>
      </div>

      <div class="bel__grid" data-reveal>
        <div class="bel__cal">
          <BookingCalendar v-model:arrival="arrival" v-model:departure="departure" :days="occupancy.data" :status="occupancy.status" />
        </div>

        <aside class="bel__price" aria-live="polite">
          <h3 class="t-h3">{{ unit.titleRed }}</h3>
          <p class="bel__from"><span>ab</span> <strong>{{ unit.priceFrom }} €</strong> <span>pro Nacht</span></p>
          <ul class="bel__facts t-small">
            <li>inkl. Bettwäsche, Handtücher & WLAN</li>
            <li>Endreinigung {{ pricing.cleaning }} €</li>
            <li>Mindestaufenthalt {{ unit.prices[0]?.minNights }} Nächte</li>
            <li>Kurzurlaub bis {{ pricing.shortStayMaxNights }} Nächte: +{{ unit.shortStaySurcharge }} € pro Nacht</li>
          </ul>
          <div v-if="nights" class="bel__choice">
            <p class="bel__choice-label">Ihr Zeitraum</p>
            <p class="bel__dates">{{ fmt(arrival) }} – {{ fmt(departure) }}</p>
            <p class="bel__nights">{{ nights }} {{ nights === 1 ? 'Nacht' : 'Nächte' }}</p>
            <UiButton label="Diesen Zeitraum anfragen" href="#kontakt" variant="light" class="bel__btn" @click="request" />
          </div>
          <p v-else class="bel__empty t-small">Wählen Sie im Kalender Anreise und Abreise – dann können Sie den Zeitraum direkt anfragen.</p>
          <a :href="unit.travanto.url" class="bel__travanto t-small" target="_blank" rel="noopener">Belegung bei Travanto ansehen</a>
        </aside>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.bel {
  padding: 72px 0;
  background: $bg-sand-60;

  @include lg {
    padding: u(150) 0;
  }
}

.bel__head {
  display: grid;
  gap: 16px;

  @include lg {
    grid-template-columns: u(700) u(760);
    justify-content: space-between;
    align-items: end;
  }
}

.bel__tabs {
  display: flex;
  gap: 8px;
  margin-top: 36px;

  @include lg {
    gap: u(12);
    margin-top: u(64);
  }
}

.bel__tab {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 18px;
  border-radius: 8px 8px 0 0;
  font-weight: 800;
  font-size: 18px;
  color: $ink;
  background: rgba($white, 0.45);
  transition: background-color 0.2s ease;

  @include md {
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
  }

  @include lg {
    padding: u(18) u(30);
    border-radius: u(10) u(10) 0 0;
    font-size: u(24);
  }

  &.is-active {
    background: $white;
  }
}

.bel__tab-price {
  font-weight: 600;
  font-size: 14px;
  color: $brick;

  @include lg {
    font-size: u(17);
  }
}

.bel__grid {
  display: grid;
  gap: 24px;
  padding: 20px;
  border-radius: 0 10px 10px;
  background: $white;

  @include lg {
    grid-template-columns: 1fr u(480);
    gap: u(50);
    padding: u(44);
    border-radius: 0 u(10) u(10);
  }
}

.bel__price {
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  border-radius: 10px;
  color: $white;
  background: linear-gradient(180deg, $ink 0%, $ink-dark 100%);

  @include lg {
    padding: u(40) u(40);
    border-radius: u(10);
  }
}

.bel__choice {
  margin-top: 22px;
  padding: 16px;
  border-radius: 8px;
  background: rgba($white, 0.08);

  @include lg {
    padding: u(20) u(22);
  }
}

.bel__choice-label {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba($white, 0.65);
}

.bel__dates {
  margin-top: 4px;
  font-weight: 800;
  font-size: 18px;
  color: $cream;

  @include lg {
    font-size: u(22);
  }
}

.bel__nights {
  margin-top: 2px;
  color: rgba($white, 0.8);
}

.bel__btn {
  margin-top: 20px;
  align-self: flex-start;
}

.bel__from {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 14px;

  strong {
    font-weight: 800;
    font-size: 48px;
    line-height: 1;
    color: $cream;

    @include lg {
      font-size: u(72);
    }
  }
}

.bel__facts {
  display: grid;
  gap: 6px;
  margin-top: 18px;
  padding-left: 18px;
  list-style: disc;
  color: rgba($white, 0.85);
}

.bel__empty {
  margin-top: 20px;
  padding: 12px 14px;
  border-radius: 6px;
  background: rgba($white, 0.08);
}

.bel__travanto {
  margin-top: auto;
  padding-top: 20px;
  color: rgba($white, 0.7);
  text-decoration: underline;

  &:hover {
    color: $cream;
  }
}
</style>
