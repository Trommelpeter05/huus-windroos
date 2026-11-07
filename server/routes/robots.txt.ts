/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle robots.txt (written as a static file on generate).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
export default defineEventHandler((event) => {
  const { siteUrl, noindex } = useRuntimeConfig().public
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  // Fix: test installation – block all crawlers
  if (noindex && String(noindex) !== 'false') return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
