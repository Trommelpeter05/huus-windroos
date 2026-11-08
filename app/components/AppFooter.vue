<!--
* This file was created with significant AI assistance (e.g., Claude)
* to handle the closing statement and the page footer (logo, contact, legal links) in the KK layout.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
-->
<script setup lang="ts">
import { contact, cta } from '~/data/content'

withDefaults(defineProps<{ showCta?: boolean }>(), { showCta: true })
// Fix: year of the build in the HTML, current year after mounting (no hydration mismatch at New Year)
const year = useState('footer-year', () => new Date().getFullYear())
onMounted(() => {
  year.value = new Date().getFullYear()
})
</script>

<template>
  <section v-if="showCta" class="cta" aria-label="Abschluss">
    <!-- Fix: compass rose from the logo with compass ring instead of the plain star -->
    <div class="cta__deco" aria-hidden="true"><WindroseMark /></div>
    <div class="frame wrap">
      <p class="cta__title" data-reveal>
        <span>{{ cta.line1 }}</span>
        <strong>{{ cta.line2 }}</strong>
      </p>
    </div>
  </section>

  <footer class="footer" :class="{ 'footer--plain': !showCta }">
    <div class="frame wrap footer__frame">
      <div class="footer__brand">
        <a href="/#top" aria-label="Huus Windroos – zur Startseite"><LogoWindroos light /></a>
        <address class="footer__address">
          {{ contact.owner }}<br />
          {{ contact.street }}<br />
          {{ contact.city }}
        </address>
      </div>

      <div class="footer__contact">
        <a :href="contact.phoneHref"><UiIcon name="phone" />{{ contact.phone }}</a>
        <a :href="`mailto:${contact.email}`"><UiIcon name="mail" />{{ contact.email }}</a>
      </div>

      <div class="footer__actions">
        <UiButton label="Zum Seitenanfang" href="/#top" icon="up" variant="light" />
      </div>

      <nav class="footer__legal" aria-label="Rechtliches">
        <a href="/impressum/">Impressum</a>
        <a href="/datenschutz/">Datenschutz</a>
        <a href="/agb/">AGB</a>
      </nav>
      <p class="footer__copy">© Huus Windroos {{ year }}</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.cta {
  position: relative;
  padding: 72px 0 64px;
  overflow: hidden;
  color: $white;
  background: $brick;

  @include lg {
    padding: u(130) 0 u(120);
  }
}

// Large compass rose as watermark (logo geometry, cream, slowly turning)
.cta__deco {
  position: absolute;
  right: -90px;
  top: 50%;
  width: 300px;
  color: $cream;
  opacity: 0.22;
  translate: 0 -50%;

  @include md {
    right: -40px;
    width: 380px;
  }

  @include lg {
    right: u(110);
    width: u(470);
  }

  :deep(svg) {
    animation: cta-rose 160s linear infinite;
  }
}

@keyframes cta-rose {
  to {
    transform: rotate(360deg);
  }
}

@include reduced-motion {
  .cta__deco :deep(svg) {
    animation: none;
  }
}

.cta__title {
  position: relative;
  font-size: 44px;
  line-height: 48px;
  letter-spacing: -0.02em;

  @include md {
    font-size: 72px;
    line-height: 76px;
  }

  @include lg {
    font-size: u(140);
    line-height: u(140);
  }

  span {
    display: block;
    font-family: $font-script;
    font-size: 0.75em;
    letter-spacing: 0;
    color: $cream;
  }

  strong {
    display: block;
    font-weight: 800;
  }
}

.footer {
  padding: 56px 0 32px;
  color: rgba($white, 0.85);
  background: $ink-dark;

  @include lg {
    padding: u(90) 0 u(50);
  }
}

.footer__frame {
  display: grid;
  gap: 32px;

  @include md {
    grid-template-columns: 1fr 1fr;
  }

  @include lg {
    grid-template-columns: 1.2fr 1fr auto;
    gap: u(40) u(80);
  }
}

.footer__address {
  margin-top: 18px;
  font-style: normal;
  font-size: 16px;
  line-height: 24px;

  @include lg {
    margin-top: u(24);
    font-size: u(19);
    line-height: u(28);
  }
}

.footer__contact {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 17px;

  @include lg {
    gap: u(14);
    padding-top: u(18);
    font-size: u(20);
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    width: fit-content;
    transition: color 0.25s ease;

    &:hover {
      color: $cream;
    }
  }

  svg {
    width: 20px;
    color: #e4775f;

    @include lg {
      width: u(22);
    }
  }
}

.footer__actions {
  @include lg {
    padding-top: u(10);
  }
}

.footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  padding-top: 24px;
  border-top: 1px solid rgba($white, 0.15);
  font-weight: 700;
  font-size: 15px;

  @include md {
    grid-column: 1 / -1;
  }

  @include lg {
    grid-column: 1 / 3;
    gap: u(32);
    padding-top: u(30);
    font-size: u(17);
  }

  a:hover {
    color: $cream;
  }
}

.footer__copy {
  font-size: 14px;
  color: rgba($white, 0.6);

  @include lg {
    align-self: end;
    justify-self: end;
    padding-top: u(30);
    border-top: 1px solid rgba($white, 0.15);
    font-size: u(16);
    width: 100%;
    text-align: right;
  }
}
</style>
