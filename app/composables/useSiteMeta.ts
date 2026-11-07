/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle canonical URL and Open Graph tags for every page.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
export function useSiteMeta() {
  const route = useRoute()
  const { siteUrl, noindex } = useRuntimeConfig().public
  // Fix: trailing slash – the static pages live in folders (/impressum/), Apache redirects /impressum → /impressum/
const url = computed(() => `${siteUrl}${route.path === '/' ? '/' : route.path.replace(/\/?$/, '/')}`)

  useHead({
    link: [{ rel: 'canonical', href: url }],
    // Fix: test installation – not indexed (overrides the per-page robots tags)
    meta: noindex && String(noindex) !== 'false' ? [{ name: 'robots', content: 'noindex, nofollow', tagPriority: 'high' }] : [],
  })
  useSeoMeta({
    ogSiteName: 'Huus Windroos',
    ogLocale: 'de_DE',
    ogUrl: url,
    ogImage: `${siteUrl}/images/og-image.jpg`, // Fix: Hausfoto 1200 × 630
    twitterCard: 'summary_large_image',
  })
}
