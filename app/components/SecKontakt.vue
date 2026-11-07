<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the enquiry section: contact boxes and the booking enquiry form (floating labels, validation,
* honeypot + minimum fill time, POST to /api/contact or kontakt.php) – form style from the KK landing page.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { contact, kontakt, units } from '~/data/content'

const { contactEndpoint } = useRuntimeConfig().public
// Fix: stay handed over from the booking calendar (SecBelegung.vue)
const enquiry = useEnquiry()
const occupancies = Object.fromEntries(units.map((u) => [u.titleRed, useOccupancy(u.travanto.id)]))

const objects = [...units.map((u) => u.titleRed), 'Noch unentschieden']
const form = reactive({
  object: objects[0]!,
  arrival: '',
  departure: '',
  persons: '2',
  name: '',
  email: '',
  phone: '',
  message: '',
  privacy: false,
  hp: '',
})
const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const serverMessage = ref('')
const formEl = ref<HTMLFormElement | null>(null)
let startedAt = 0

watch(
  () => enquiry.value.stamp,
  () => {
    const u = units.find((x) => x.id === enquiry.value.unitId)
    if (u) form.object = u.titleRed
    form.arrival = enquiry.value.arrival
    form.departure = enquiry.value.departure
    form.persons = enquiry.value.persons
  },
)

// Fix: availability hint as soon as object and dates are known (no price calculation)
const selectedUnit = computed(() => units.find((u) => u.titleRed === form.object))
const hasRange = computed(() => !!(selectedUnit.value && form.arrival && form.departure && form.departure > form.arrival))
const occupied = computed(() => {
  const occ = selectedUnit.value ? occupancies[selectedUnit.value.titleRed]?.value : null
  if (!occ?.data || !hasRange.value) return false
  return !rangeFree(occ.data, form.arrival, form.departure)
})

const today = ref('')
onMounted(() => {
  startedAt = Date.now()
  today.value = new Date().toISOString().slice(0, 10)
})

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.name.trim()) errors.name = 'Bitte geben Sie Ihren Namen an.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
  if (!form.phone.trim()) errors.phone = 'Bitte geben Sie eine Telefonnummer an.'
  if (form.arrival && form.departure && form.departure <= form.arrival) errors.departure = 'Die Abreise muss nach der Anreise liegen.'
  if (!form.privacy) errors.privacy = 'Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) {
    const first = formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')
    first?.focus()
    return
  }
  status.value = 'sending'
  serverMessage.value = ''
  try {
    const res = await fetch(contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, elapsed: Date.now() - startedAt }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) throw new Error(data.message || '')
    status.value = 'success'
    Object.assign(form, { arrival: '', departure: '', name: '', email: '', phone: '', message: '', privacy: false })
  } catch (e) {
    serverMessage.value = (e as Error).message
    status.value = 'error'
  }
}

function fieldAttrs(key: string) {
  return {
    'aria-invalid': errors[key] ? ('true' as const) : undefined, // Fix: literal type for the aria attribute
    'aria-describedby': errors[key] ? `kf-${key}-err` : undefined,
  }
}
</script>

<template>
  <section id="kontakt" class="kontakt">
    <div class="frame wrap kontakt__grid">
      <div class="kontakt__left">
        <p class="eyebrow t-label" data-reveal>{{ kontakt.label }}</p>
        <h2 class="t-h2 kontakt__title" data-reveal>
          <span class="red">{{ kontakt.titleRed }}</span> {{ kontakt.titleDark }}
        </h2>
        <p class="t-body kontakt__text" data-reveal>{{ kontakt.text }}</p>

        <ul class="kontakt__boxes">
          <li data-reveal>
            <a class="cbox" :href="contact.phoneHref">
              <span class="cbox__icon"><UiIcon name="phone" /></span>
              <span class="cbox__body">
                <span class="cbox__title">Rufen Sie uns an</span>
                <span class="cbox__value">{{ contact.phone }}</span>
              </span>
            </a>
          </li>
          <li data-reveal>
            <a class="cbox" :href="`mailto:${contact.email}`">
              <span class="cbox__icon"><UiIcon name="mail" /></span>
              <span class="cbox__body">
                <span class="cbox__title">Schreiben Sie uns</span>
                <span class="cbox__value">{{ contact.email }}</span>
              </span>
            </a>
          </li>
          <li data-reveal>
            <a class="cbox" :href="contact.routeHref" target="_blank" rel="noopener">
              <span class="cbox__icon"><UiIcon name="pin" /></span>
              <span class="cbox__body">
                <span class="cbox__title">So finden Sie uns</span>
                <span class="cbox__value">{{ contact.street }}, {{ contact.city }}</span>
                <span class="sr-only"> (Karte bei OpenStreetMap, öffnet in neuem Tab)</span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <form ref="formEl" class="kform" novalidate data-reveal @submit.prevent="submit">
        <h3 class="t-h3 kform__heading">Ihre Anfrage</h3>

        <div class="kform__row">
          <div class="kform__float kform__select">
            <select id="kf-object" v-model="form.object" class="kform__field kform__field--value" name="object">
              <option v-for="o in objects" :key="o" :value="o">{{ o }}</option>
            </select>
            <label class="kform__label" for="kf-object">Unterkunft</label>
            <UiIcon name="chevron" class="kform__chev" />
          </div>
          <div class="kform__float kform__select">
            <select id="kf-persons" v-model="form.persons" class="kform__field kform__field--value" name="persons">
              <option value="1">1 Person</option>
              <option value="2">2 Personen</option>
            </select>
            <label class="kform__label" for="kf-persons">Personen</label>
            <UiIcon name="chevron" class="kform__chev" />
          </div>
        </div>

        <div class="kform__row">
          <div class="kform__float">
            <input id="kf-arrival" v-model="form.arrival" class="kform__field kform__field--value" type="date" name="arrival" :min="today" />
            <label class="kform__label" for="kf-arrival">Anreise</label>
          </div>
          <div class="kform__float">
            <input id="kf-departure" v-model="form.departure" class="kform__field kform__field--value" type="date" name="departure" :min="form.arrival || today" v-bind="fieldAttrs('departure')" />
            <label class="kform__label" for="kf-departure">Abreise</label>
            <span v-if="errors.departure" id="kf-departure-err" class="kform__error">{{ errors.departure }}</span>
          </div>
        </div>

        <!-- Fix: availability hint for the chosen stay -->
        <p v-if="occupied" class="kform__occupied" role="status">Laut Belegungskalender ist die Unterkunft in diesem Zeitraum schon belegt. Fragen Sie gern trotzdem an.</p>

        <div class="kform__row kform__row--full">
          <div class="kform__float">
            <input id="kf-name" v-model="form.name" class="kform__field" type="text" name="name" autocomplete="name" placeholder=" " v-bind="fieldAttrs('name')" />
            <label class="kform__label" for="kf-name">Ihr Name<span aria-hidden="true"> *</span><span class="sr-only"> (Pflichtfeld)</span></label>
            <span v-if="errors.name" id="kf-name-err" class="kform__error">{{ errors.name }}</span>
          </div>
        </div>

        <div class="kform__row">
          <div class="kform__float">
            <input id="kf-email" v-model="form.email" class="kform__field" type="email" name="email" autocomplete="email" placeholder=" " v-bind="fieldAttrs('email')" />
            <label class="kform__label" for="kf-email">E-Mail<span aria-hidden="true"> *</span><span class="sr-only"> (Pflichtfeld)</span></label>
            <span v-if="errors.email" id="kf-email-err" class="kform__error">{{ errors.email }}</span>
          </div>
          <div class="kform__float">
            <input id="kf-phone" v-model="form.phone" class="kform__field" type="tel" name="phone" autocomplete="tel" placeholder=" " v-bind="fieldAttrs('phone')" />
            <label class="kform__label" for="kf-phone">Telefon<span aria-hidden="true"> *</span><span class="sr-only"> (Pflichtfeld)</span></label>
            <span v-if="errors.phone" id="kf-phone-err" class="kform__error">{{ errors.phone }}</span>
          </div>
        </div>

        <div class="kform__row kform__row--full">
          <div class="kform__float">
            <textarea id="kf-message" v-model="form.message" class="kform__field kform__field--area" name="message" placeholder=" " />
            <label class="kform__label" for="kf-message">Ihre Nachricht</label>
          </div>
        </div>

        <!-- Honeypot -->
        <div class="kform__hp" aria-hidden="true">
          <label for="kf-hp">Bitte leer lassen</label>
          <input id="kf-hp" v-model="form.hp" type="text" name="kf_hp" tabindex="-1" autocomplete="off" />
        </div>

        <div class="kform__privacy">
          <input id="kf-privacy" v-model="form.privacy" class="kform__check" type="checkbox" name="privacy" v-bind="fieldAttrs('privacy')" />
          <label for="kf-privacy">
            Ich habe die <a href="/datenschutz/"><strong>Datenschutzhinweise</strong></a> gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage einverstanden. *
          </label>
          <span v-if="errors.privacy" id="kf-privacy-err" class="kform__error kform__error--privacy">{{ errors.privacy }}</span>
        </div>

        <div class="kform__foot">
          <span class="kform__required">* Pflichtfeld</span>
          <UiButton type="submit" label="Anfrage senden" icon="send" :disabled="status === 'sending'" />
        </div>

        <p v-if="status === 'success'" class="kform__status" role="status">Vielen Dank! Ihre Anfrage wurde gesendet. Wir melden uns schnellstmöglich bei Ihnen.</p>
        <p v-else-if="status === 'error'" class="kform__status kform__status--error" role="alert">
          Leider ist beim Senden ein Fehler aufgetreten{{ serverMessage ? `: ${serverMessage}` : '' }}. Bitte versuchen Sie es erneut oder rufen Sie uns an: {{ contact.phone }}.
        </p>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.kontakt {
  position: relative;
  padding: 72px 0;
  background: $white;

  @include lg {
    padding: u(170) 0;
  }
}

.kontakt__grid {
  display: grid;
  gap: 44px;

  @include lg {
    grid-template-columns: u(640) u(880);
    justify-content: space-between;
    gap: 0;
  }
}

.kontakt__title {
  margin-top: 4px;
}

.kontakt__text {
  margin-top: 20px;

  @include lg {
    margin-top: u(32);
  }
}

.kontakt__boxes {
  display: grid;
  gap: 12px;
  margin-top: 32px;

  @include lg {
    gap: u(16);
    margin-top: u(60);
  }
}

.cbox {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 10px;
  background: $bg-sand-40;
  transition: background-color 0.3s ease;

  @include lg {
    gap: u(22);
    padding: u(20) u(24);
    border-radius: u(10);
  }

  &:hover {
    background: $bg-sand-60;

    .cbox__icon {
      background: $ink;
    }
  }
}

.cbox__icon {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  color: $white;
  background: $brick;
  transition: background-color 0.3s ease;

  @include lg {
    width: u(62);
    height: u(62);
    border-radius: u(10);
  }

  svg {
    width: 42%;
  }
}

.cbox__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cbox__title {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;

  @include lg {
    font-size: u(22);
    line-height: u(28);
  }
}

.cbox__value {
  overflow-wrap: anywhere;
  font-size: 16px;
  line-height: 22px;

  @include lg {
    font-size: u(19);
    line-height: u(26);
  }
}

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------
.kform {
  padding: 28px 20px 32px;
  border-radius: 10px;
  background: $bg-sand-60;

  @include lg {
    padding: u(56) u(58) u(52);
    border-radius: u(10);
  }
}

.kform__heading {
  margin-bottom: 26px;

  @include lg {
    margin-bottom: u(36);
  }
}

.kform__row {
  display: grid;
  gap: 22px 12px;
  margin-bottom: 22px;

  @include md {
    grid-template-columns: 1fr 1fr;
  }

  @include lg {
    gap: u(28) u(16);
    margin-bottom: u(28);
  }

  &--full {
    grid-template-columns: 1fr;
  }
}

.kform__field {
  display: block;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid $field-border;
  border-radius: 4px;
  font-size: 17px;
  line-height: 22px;
  color: $ink;
  background: $white;
  appearance: none;

  @include lg {
    height: u(58);
    padding: 0 u(19);
    border-radius: u(4);
    font-size: u(18);
    line-height: u(22);
  }

  &::placeholder {
    color: transparent;
  }

  &--area {
    height: 130px;
    padding-top: 16px;
    padding-bottom: 12px;
    resize: vertical;

    @include lg {
      height: u(150);
      padding-top: u(16);
    }
  }

  &[aria-invalid='true'] {
    border-color: $brick;
    box-shadow: 0 0 0 1px $brick;
  }

  &:focus-visible {
    outline: 2px solid $sea;
    outline-offset: 1px;
  }
}

select.kform__field {
  padding-right: 44px;
  cursor: pointer;
}

input[type='date'].kform__field {
  padding-top: 4px;
}

.kform__select {
  position: relative;
}

.kform__chev {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 18px;
  rotate: 90deg;
  translate: 0 -50%;
  pointer-events: none;

  @include lg {
    right: u(18);
    width: u(20);
  }
}

// Floating labels: inside the empty field, small dark tag on the top border once focused or filled
.kform__float {
  position: relative;
}

.kform__label {
  position: absolute;
  left: 11px;
  top: 26px;
  max-width: calc(100% - 56px);
  padding: 0 5px;
  overflow: hidden;
  border-radius: 3px;
  font-weight: 700;
  font-size: 17px;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba($ink, 0.75);
  transform: translateY(-50%);
  transition: top 0.2s ease, font-size 0.2s ease, line-height 0.2s ease, color 0.2s ease, background-color 0.2s ease;
  pointer-events: none;

  @include lg {
    left: u(14);
    top: u(29);
    padding: 0 u(5);
    font-size: u(18);
    line-height: u(22);
  }

  .kform__field--area + & {
    top: 27px;

    @include lg {
      top: u(27);
    }
  }
}

.kform__field:focus + .kform__label,
.kform__field:not(:placeholder-shown) + .kform__label,
.kform__field--value + .kform__label {
  top: 0;
  font-size: 13px;
  line-height: 18px;
  color: $white;
  background: $ink;

  @include lg {
    font-size: u(14);
    line-height: u(19);
  }
}

.kform__field:focus + .kform__label {
  background: $sea;
}

.kform__field[aria-invalid='true'] + .kform__label {
  background: $brick;
}

.kform__error {
  display: block;
  margin-top: 6px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: $brick;

  @include lg {
    font-size: u(15);
    line-height: u(19);
  }

  &--privacy {
    grid-column: 1 / -1;
  }
}

.kform__occupied {
  margin: -6px 0 22px;
  padding: 10px 14px;
  border-radius: 6px;
  background: $white;
  font-weight: 700;
  font-size: 15px;
  color: $brick;
}

.kform__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.kform__privacy {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  font-size: 15px;
  line-height: 21px;

  @include lg {
    gap: u(8) u(14);
    font-size: u(16);
    line-height: u(22);
  }

  a {
    text-decoration: underline;
  }
}

.kform__check {
  width: 22px;
  height: 22px;
  margin: 0;
  accent-color: $brick;

  @include lg {
    width: u(22);
    height: u(22);
  }
}

.kform__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;

  @include lg {
    margin-top: u(36);
  }
}

.kform__required {
  font-size: 14px;
  color: rgba($ink, 0.75);

  @include lg {
    font-size: u(16);
  }
}

.kform__status {
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: $white;
  background: $sea;

  @include lg {
    font-size: u(18);
    line-height: u(25);
  }

  &--error {
    background: $brick;
  }
}
</style>
