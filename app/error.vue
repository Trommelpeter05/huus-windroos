<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the error page (404 and others).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()
const notFound = computed(() => props.error?.statusCode === 404)
useHead({ title: `${notFound.value ? 'Seite nicht gefunden' : 'Fehler'} | Huus Windroos`, meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <div>
    <AppHeader />
    <main id="main" class="page err">
      <div class="frame wrap">
        <p class="eyebrow t-label">{{ error?.statusCode || 'Fehler' }}</p>
        <h1 class="t-h2">{{ notFound ? 'Diese Seite gibt es nicht.' : 'Da ist etwas schiefgelaufen.' }}</h1>
        <p class="t-body err__text">Vielleicht hat der Wind sie weggeweht. Auf der Startseite finden Sie alles über Ferienwohnung und Apartment.</p>
        <UiButton label="Zur Startseite" href="/" class="err__btn" />
      </div>
    </main>
    <AppFooter :show-cta="false" />
  </div>
</template>

<style lang="scss" scoped>
.err {
  padding: 140px 0 100px;

  @include lg {
    padding: u(260) 0 u(180);
  }
}

.err__text {
  max-width: 640px;
  margin-top: 20px;
}

.err__btn {
  margin-top: 32px;
}
</style>
