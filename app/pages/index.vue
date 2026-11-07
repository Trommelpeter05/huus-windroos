<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the one-page composition (all sections in order).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { reviews, units } from '~/data/content'

useSeoMeta({
  ogTitle: 'Ferienwohnung in Pogum bei Ditzum | Huus Windroos am Dollart',
  ogDescription: 'Urlaub im Rheiderland bei Familie de Vries: Ferienwohnung und Apartment in Pogum, nahe dem Fischerdorf Ditzum.',
  ogType: 'website',
})
// Fix: schema.org JSON-LD for search engines (composables/useStructuredData.ts)
useStructuredData()
</script>

<template>
  <div>
    <SecHero />
    <SecIntro />
    <SecUnterkunft :unit="units[0]!" />
    <SecUnterkunft :unit="units[1]!" reverse tone="sand" />
    <SecBewertungen v-if="reviews.show" />
    <SecOstfriesland />
    <SecGutZuWissen />
    <SecBelegung />
    <SecKontakt />
    <AppFooter />
  </div>
</template>
