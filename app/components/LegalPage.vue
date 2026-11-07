<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the template of the legal pages (Impressum, Datenschutz, AGB).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import type { LegalDoc } from '~/data/legal'

const props = defineProps<{ doc: LegalDoc }>()

useHead({ title: `${props.doc.title} | Huus Windroos`, meta: [{ name: 'robots', content: 'noindex, follow' }] })
</script>

<template>
  <div>
    <article class="legal">
      <div class="frame wrap">
        <p class="eyebrow t-label">Rechtliches</p>
        <h1 class="t-h2 legal__title">{{ doc.title }}</h1>
        <p v-if="doc.intro" class="t-body legal__intro" v-html="doc.intro" />
        <section v-for="(s, i) in doc.sections" :key="i" class="legal__section">
          <h2 v-if="s.heading" class="t-h3">{{ s.heading }}</h2>
          <p v-for="(p, j) in s.paragraphs" :key="j" class="t-body" v-html="p" />
        </section>
        <p v-if="doc.footnote" class="t-small legal__footnote">{{ doc.footnote }}</p>
        <UiButton label="Zurück zur Startseite" href="/" variant="outline" class="legal__back" />
      </div>
    </article>
    <AppFooter :show-cta="false" />
  </div>
</template>

<style lang="scss" scoped>
.legal {
  padding: 120px 0 80px;

  @include lg {
    padding: u(220) 0 u(140);
  }

  .frame {
    max-width: 1100px;

    @include lg {
      max-width: none;
      padding-right: u(500);
    }
  }
}

.legal__title {
  margin-top: 4px;
  overflow-wrap: anywhere;
}

.legal__intro {
  margin-top: 24px;
}

.legal__section {
  display: grid;
  gap: 10px;
  margin-top: 36px;

  @include lg {
    gap: u(12);
    margin-top: u(50);
  }

  :deep(a) {
    color: $brick;
    text-decoration: underline;
  }
}

.legal__footnote {
  margin-top: 40px;
  color: rgba($ink, 0.7);
}

.legal__back {
  margin-top: 48px;

  @include lg {
    margin-top: u(70);
  }
}
</style>
