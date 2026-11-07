/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle sitemap.xml (written as a static file on generate).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig().public
  const urls = ['/', '/impressum/', '/datenschutz/', '/agb/']
  // Fix: date of the build (the sitemap is written on generate)
  const lastmod = new Date().toISOString().slice(0, 10)
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${siteUrl}${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
})
