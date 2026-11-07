<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the schematic map of the Rheiderland (Ems, Dollart, places, the house) with numbered pins;
* the active pin is highlighted together with the tip list (SecOstfriesland.vue).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import type { RegionPin } from '~/data/content'

const props = defineProps<{ pins: RegionPin[]; home: { label: string; lat: number; lon: number }; active: number | null; edge: 'north' | 'south' | null }>()
const emit = defineEmits<{ hover: [id: number | null] }>()

// Simple equirectangular projection of the map section (lon 6.95–7.55, lat 53.15–53.42) onto 800 × 600.
// Schematic: coastline and river are drawn by hand, the places are placed by their coordinates.
const W = 800
const H = 600
const project = (lat: number, lon: number) => ({ x: ((lon - 6.95) / 0.6) * W, y: ((53.42 - lat) / 0.27) * H })

const homePos = computed(() => project(props.home.lat, props.home.lon))
const pinPos = computed(() => props.pins.map((p) => ({ ...p, ...project(p.lat, p.lon) })))

const places = [
  // dot: false = a pin marks the place already (only the label is drawn)
  { label: 'Emden', lat: 53.367, lon: 7.206, dx: -18, dy: -10, anchor: 'end', dot: false },
  { label: 'Petkum', lat: 53.343, lon: 7.255, dx: -14, dy: -4, anchor: 'end', dot: true },
  { label: 'Ditzum', lat: 53.315, lon: 7.275, dx: 16, dy: 20, anchor: 'start', dot: false },
  { label: 'Jemgum', lat: 53.266, lon: 7.384, dx: -12, dy: 5, anchor: 'end', dot: true },
  { label: 'Leer', lat: 53.231, lon: 7.459, dx: 18, dy: -6, anchor: 'start', dot: false },
  { label: 'Bunde', lat: 53.183, lon: 7.267, dx: 10, dy: 5, anchor: 'start', dot: true },
].map((p) => ({ ...p, ...project(p.lat, p.lon) }))

const water =
  'M0,95 C120,98 230,104 300,120 C330,128 350,146 372,160 C395,172 418,180 445,182 C475,184 500,184 522,194 ' +
  'C548,206 560,236 574,270 C590,308 608,330 632,352 C652,372 668,392 676,418 C684,446 700,520 708,600 L690,600 ' +
  'C682,520 668,452 660,428 C652,404 636,386 616,366 C592,344 572,318 558,282 C546,250 538,224 514,212 ' +
  'C494,203 470,204 446,206 C424,208 404,206 392,204 C380,206 372,214 372,228 C374,262 378,300 366,345 ' +
  'C356,380 348,408 338,428 C300,428 262,410 230,384 C196,356 160,312 120,282 C80,252 40,236 0,230 Z'
</script>

<template>
  <div class="rmap">
    <svg class="rmap__svg" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Schematische Karte des Rheiderlands mit Pogum, Ditzum, Emden, Jemgum und Leer">
      <rect :width="W" :height="H" class="rmap__land" />
      <path :d="water" class="rmap__water" />

      <!-- ferry line Ditzum – Petkum -->
      <path d="M433,226 L410,178" class="rmap__ferry" />

      <text x="210" y="320" class="rmap__water-label">Dollart</text>
      <text x="0" y="0" class="rmap__water-label rmap__water-label--river" transform="translate(604 300) rotate(58)">Ems</text>
      <text x="470" y="300" class="rmap__region">RHEIDERLAND</text>
      <text x="120" y="455" class="rmap__region">NIEDERLANDE</text>
      <text x="140" y="60" class="rmap__region">KRUMMHÖRN</text>

      <g v-for="p in places" :key="p.label" class="rmap__place">
        <circle v-if="p.dot" :cx="p.x" :cy="p.y" r="3.5" />
        <text :x="p.x + p.dx" :y="p.y + p.dy" :text-anchor="p.anchor">{{ p.label }}</text>
      </g>

      <!-- destinations outside the map section -->
      <g class="rmap__edge" :class="{ 'is-active': edge === 'north' }">
        <path d="M150,30 l10,-14 l10,14" />
        <text x="180" y="28">Greetsiel · Pilsum · Inseln</text>
      </g>
      <g class="rmap__edge" :class="{ 'is-active': edge === 'south' }">
        <path d="M720,566 l10,14 l10,-14" />
        <text x="712" y="578" text-anchor="end">Papenburg</text>
      </g>

      <!-- the house -->
      <g class="rmap__home" :transform="`translate(${homePos.x} ${homePos.y})`">
        <circle r="17" />
        <path d="M0,-12 2.4,-2.4 12,0 2.4,2.4 0,12 -2.4,2.4 -12,0 -2.4,-2.4Z" />
        <text x="-24" y="34" text-anchor="end">{{ home.label }}</text>
      </g>

      <!-- tip pins -->
      <g
        v-for="p in pinPos"
        :key="p.id"
        class="rmap__pin"
        :class="{ 'is-active': active === p.id }"
        :transform="`translate(${p.x} ${p.y})`"
        @mouseenter="emit('hover', p.id)"
        @mouseleave="emit('hover', null)"
      >
        <g class="rmap__pin-in">
          <path d="M0,0 C-4,-8 -13,-13 -13,-23 a13,13 0 1 1 26,0 C13,-13 4,-8 0,0Z" />
          <text y="-18" text-anchor="middle">{{ p.id }}</text>
        </g>
      </g>
    </svg>
    <p class="rmap__note">Schematische Karte, nicht maßstabsgetreu</p>
  </div>
</template>

<style lang="scss" scoped>
.rmap {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: $bg-sand-60;

  @include lg {
    border-radius: u(10);
  }
}

.rmap__svg {
  width: 100%;
  height: auto;
  font-family: $font;
}

.rmap__land {
  fill: $bg-sand-60;
}

.rmap__water {
  fill: #a9cdd6;
}

.rmap__ferry {
  fill: none;
  stroke: $ink;
  stroke-width: 2;
  stroke-dasharray: 4 5;
  opacity: 0.6;
}

.rmap__water-label {
  font-style: italic;
  font-weight: 600;
  font-size: 22px;
  fill: #4f8794;
  letter-spacing: 0.04em;

  &--river {
    font-size: 17px;
  }
}

.rmap__region {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.25em;
  fill: rgba($ink, 0.35);
}

.rmap__place {
  circle {
    fill: $ink;
  }

  text {
    font-weight: 700;
    font-size: 16px;
    fill: $ink;
  }
}

.rmap__edge {
  path {
    fill: none;
    stroke: $ink;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  text {
    font-weight: 700;
    font-size: 15px;
    fill: $ink;
  }

  &.is-active {
    path {
      stroke: $brick;
    }

    text {
      fill: $brick;
    }
  }
}

.rmap__home {
  circle {
    fill: $brick;
    stroke: $white;
    stroke-width: 3;
  }

  path {
    fill: $cream;
  }

  text {
    font-weight: 800;
    font-size: 17px;
    fill: $brick;
    paint-order: stroke;
    stroke: $bg-sand-60;
    stroke-width: 4px;
  }
}

.rmap__pin {
  cursor: pointer;

  path {
    fill: $ink;
    stroke: $white;
    stroke-width: 2;
    transition: fill 0.25s ease;
  }

  text {
    font-weight: 800;
    font-size: 14px;
    fill: $white;
    pointer-events: none;
  }

  &.is-active path {
    fill: $brick;
  }
}

.rmap__pin-in {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-box: fill-box;
  transform-origin: 50% 100%;

  .is-active & {
    transform: scale(1.3);
  }
}

.rmap__note {
  position: absolute;
  left: 12px;
  bottom: 8px;
  font-size: 11px;
  color: rgba($ink, 0.55);
}

@include reduced-motion {
  .rmap__pin-in {
    transition: none;
  }
}
</style>
