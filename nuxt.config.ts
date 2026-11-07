/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the Nuxt configuration (head, self-hosted fonts, SCSS, prerendering, runtime config for SMTP).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },

  // Fonts are self-hosted via Fontsource (no third-party request, no consent needed)
  css: ['@fontsource-variable/gantari/index.css', '@fontsource/great-vibes/latin-400.css', '~/assets/scss/main.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      // Fix: search terms (Ferienwohnung, Pogum, Ditzum, Dollart) at the front
      title: 'Ferienwohnung in Pogum bei Ditzum | Huus Windroos am Dollart',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Ferienwohnung & Apartment in Pogum bei Ditzum am Dollart (Ostfriesland): Balkon, WLAN, Parkplatz, ab 53 € pro Nacht. Direkt bei Familie de Vries anfragen.',
        },
        { name: 'theme-color', content: '#9b2c1f' },
      ],
      link: [
        // Fix: preload the responsive hero photo (same srcset as SecHero.vue)
        {
          rel: 'preload',
          as: 'image',
          href: '/images/hero-haus.jpg',
          imagesrcset: '/images/hero-haus-960.jpg 960w, /images/hero-haus-1440.jpg 1440w, /images/hero-haus.jpg 1920w',
          imagesizes: '100vw',
          fetchpriority: 'high',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        // Marks JS availability before first paint, so reveal elements can start hidden without flashing.
        { innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' },
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/tools" as *;\n',
        },
      },
    },
  },

  // All pages are static HTML; only /api/contact needs the Node server (or kontakt.php in the PHP build).
  routeRules: {
    '/': { prerender: true },
    '/impressum': { prerender: true },
    '/datenschutz': { prerender: true },
    '/agb': { prerender: true },
  },

  nitro: {
    prerender: {
      routes: ['/robots.txt', '/sitemap.xml'],
    },
  },

  runtimeConfig: {
    smtpHost: '',
    smtpPort: '587',
    smtpSecure: 'false',
    smtpUser: '',
    smtpPass: '',
    mailFrom: '',
    mailTo: '',
    public: {
      // The PHP build (php-version/build.mjs) sets /kontakt.php
      contactEndpoint: '/api/contact',
      // Fix: occupancy + reviews from Travanto – the PHP build sets /travanto.php
      travantoEndpoint: '/api/travanto',
      // Public address of the site (canonical, og:url, robots.txt, sitemap.xml) – no trailing slash
      siteUrl: 'https://www.huus-windroos.de',
      // Fix: test installation (e.g. relaunch.huus-windroos.de) – NUXT_PUBLIC_NOINDEX=true keeps it out of
      // search engines (robots.txt Disallow + meta robots noindex on every page)
      noindex: false,
    },
  },
})
