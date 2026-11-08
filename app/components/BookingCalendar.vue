<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the occupancy calendar (12 months from Travanto, 1 / 2 months visible, arrival and departure
* halves, picking a stay with two clicks, keyboard operable).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { canArrive, rangeFree, todayIso, type OccupancyDays } from '~/utils/availability'

const props = defineProps<{ days: OccupancyDays | null; status: 'idle' | 'loading' | 'ok' | 'error' }>()
const arrival = defineModel<string>('arrival', { default: '' })
const departure = defineModel<string>('departure', { default: '' })

const MONTHS = 12
const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const offset = ref(0)
const message = ref('')
const hover = ref('')
const today = ref('')

onMounted(() => (today.value = todayIso()))

// Fix: start month as shared state – the prerendered HTML and the first client render use the month of the build
// (no hydration mismatch), after mounting it switches to the visitor's current month
const startMonth = useState('cal-start-month', () => {
  const d = new Date()
  return [d.getFullYear(), d.getMonth()] as [number, number]
})
onMounted(() => {
  const d = new Date()
  if (startMonth.value[0] !== d.getFullYear() || startMonth.value[1] !== d.getMonth()) startMonth.value = [d.getFullYear(), d.getMonth()]
})

const months = computed(() => {
  const base = new Date(startMonth.value[0], startMonth.value[1], 1)
  return Array.from({ length: MONTHS }, (_, i) => {
    const y = base.getFullYear() + Math.floor((base.getMonth() + i) / 12)
    const m = (base.getMonth() + i) % 12
    const first = new Date(Date.UTC(y, m, 1))
    const lead = (first.getUTCDay() + 6) % 7 // Monday first
    const count = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
    const cells: (string | null)[] = Array.from({ length: lead }, () => null)
    for (let d = 1; d <= count; d++) cells.push(`${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
    return { key: `${y}-${m}`, label: `${monthNames[m]} ${y}`, cells }
  })
})

function cellClass(iso: string) {
  const d = props.days?.[iso]
  const past = today.value && iso < today.value
  const end = departure.value || (arrival.value && hover.value > arrival.value ? hover.value : '')
  return {
    [`cal__day--${d?.s ?? 'frei'}`]: !past,
    'cal__day--past': past,
    'cal__day--start': iso === arrival.value,
    'cal__day--end': iso === departure.value,
    'cal__day--range': arrival.value && end && iso > arrival.value && iso < end,
    'cal__day--preview': !departure.value && iso === end,
  }
}

function label(iso: string) {
  const d = props.days?.[iso]
  const date = new Date(`${iso}T00:00:00Z`).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
  const st = { frei: 'frei', belegt: 'belegt', anreise: 'ab Nachmittag belegt', abreise: 'ab Nachmittag frei', wechsel: 'belegt (Gästewechsel)' }[d?.s ?? 'frei']
  return `${date}, ${st}`
}

function pick(iso: string) {
  message.value = ''
  if (!arrival.value || departure.value || iso <= arrival.value) {
    if (canArrive(props.days, iso)) {
      arrival.value = iso
      departure.value = ''
    } else {
      message.value = 'An diesem Tag ist keine Anreise möglich.'
    }
    return
  }
  if (rangeFree(props.days, arrival.value, iso)) departure.value = iso
  else message.value = 'In diesem Zeitraum ist die Unterkunft leider schon belegt.'
}

function reset() {
  arrival.value = ''
  departure.value = ''
  message.value = ''
}

defineExpose({ reset })

// Show the month of an externally set arrival (e.g. from the form)
watch(arrival, (v) => {
  if (!v) return
  const i = months.value.findIndex((m) => m.cells.includes(v))
  if (i > -1 && (i < offset.value || i > offset.value + 1)) offset.value = Math.min(i, MONTHS - 2)
})

const hint = computed(() => {
  if (message.value) return message.value
  if (!arrival.value) return 'Bitte wählen Sie Ihren Anreisetag.'
  if (!departure.value) return 'Und jetzt den Abreisetag.'
  return ''
})
</script>

<template>
  <div class="cal" :class="{ 'is-loading': status === 'loading' }">
    <div class="cal__head">
      <button type="button" class="round-icon cal__nav cal__nav--prev" :disabled="offset === 0" aria-label="Vorheriger Monat" @click="offset--"><UiIcon name="arrow" /></button>
      <p class="cal__hint t-small" aria-live="polite" :class="{ 'is-error': message }">{{ hint }}</p>
      <button type="button" class="round-icon cal__nav" :disabled="offset >= MONTHS - 2" aria-label="Nächster Monat" @click="offset++"><UiIcon name="arrow" /></button>
    </div>

    <div class="cal__months">
      <div v-for="(m, i) in months.slice(offset, offset + 2)" :key="m.key" class="cal__month" :class="{ 'cal__month--second': i === 1 }">
        <p class="cal__title">{{ m.label }}</p>
        <div class="cal__grid" role="grid" :aria-label="m.label">
          <span v-for="w in ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']" :key="w" class="cal__wd" aria-hidden="true">{{ w }}</span>
          <template v-for="(iso, j) in m.cells" :key="iso ?? `e${j}`">
            <span v-if="!iso" class="cal__empty" />
            <button
              v-else
              type="button"
              class="cal__day"
              :class="cellClass(iso)"
              :disabled="!!today && iso < today"
              :aria-label="label(iso)"
              :aria-pressed="iso === arrival || iso === departure"
              @click="pick(iso)"
              @mouseenter="hover = iso"
              @mouseleave="hover = ''"
            >
              <span>{{ Number(iso.slice(8)) }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="cal__foot">
      <ul class="cal__legend t-small">
        <li><span class="cal__swatch cal__swatch--frei" />frei</li>
        <li><span class="cal__swatch cal__swatch--belegt" />belegt</li>
        <li><span class="cal__swatch cal__swatch--anreise" />Anreise / Abreise anderer Gäste</li>
      </ul>
      <button v-if="arrival" type="button" class="cal__reset t-small" @click="reset">Auswahl zurücksetzen</button>
    </div>

    <p v-if="status === 'error'" class="cal__error t-small">
      Die Belegung konnte gerade nicht geladen werden. Sie können trotzdem einen Zeitraum wählen – wir prüfen Ihre Anfrage persönlich.
    </p>
  </div>
</template>

<style lang="scss" scoped>
$booked: #ecc9c1;

.cal {
  transition: opacity 0.3s ease;

  &.is-loading .cal__grid {
    opacity: 0.5;
  }
}

.cal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.cal__nav {
  &--prev svg {
    rotate: 180deg;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.cal__hint {
  font-weight: 700;
  text-align: center;

  &.is-error {
    color: $brick;
  }
}

.cal__months {
  display: grid;
  gap: 32px;

  @include md {
    grid-template-columns: 1fr 1fr;
  }

  @include lg {
    gap: u(40);
  }
}

.cal__month--second {
  display: none;

  @include md {
    display: block;
  }
}

.cal__title {
  margin-bottom: 10px;
  font-weight: 800;
  font-size: 18px;
  text-align: center;

  @include lg {
    margin-bottom: u(12);
    font-size: u(22);
  }
}

.cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.cal__wd {
  padding: 4px 0;
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  color: rgba($ink, 0.6);

  @include lg {
    font-size: u(14);
  }
}

.cal__day {
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  font-weight: 600;
  font-size: 15px;
  color: $ink;
  background: $white;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

  @include lg {
    font-size: u(17);
  }

  span {
    position: relative;
  }

  &:not(:disabled):hover {
    box-shadow: inset 0 0 0 2px $brick;
  }

  &--belegt,
  &--wechsel {
    color: rgba($ink, 0.45);
    background: $booked;
    text-decoration: line-through;
  }

  // booking starts in the afternoon (night taken) / ends in the morning (night free)
  &--anreise {
    background: linear-gradient(135deg, $white 50%, $booked 50%);
  }

  &--abreise {
    background: linear-gradient(135deg, $booked 50%, $white 50%);
  }

  &--past {
    color: rgba($ink, 0.3);
    background: transparent;
    cursor: default;
  }

  &--range,
  &--preview {
    color: $ink;
    background: $sand;
    text-decoration: none;
  }

  &--start,
  &--end {
    color: $white;
    background: $brick;
    text-decoration: none;
  }
}

.cal__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.cal__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}

.cal__swatch {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba($ink, 0.15);

  &--frei {
    background: $white;
  }

  &--belegt {
    background: $booked;
  }

  &--anreise {
    background: linear-gradient(135deg, $white 50%, $booked 50%);
  }
}

.cal__reset {
  font-weight: 700;
  color: $brick;
  text-decoration: underline;
}

.cal__error {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 6px;
  background: rgba($brick, 0.08);
}
</style>
