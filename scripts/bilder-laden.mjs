/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle downloading the photos of the current website www.huus-windroos.de into public/images
* under the file names used in app/data/content.ts.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
// Usage (in the project folder): npm run bilder   – existing files are skipped, --force loads everything again
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'images')
const force = process.argv.includes('--force')
const base = 'https://www.huus-windroos.de/wp-content/'

const images = {
  'fewo-eingang.jpg': 'uploads/2016/11/wohnzimmer-ferienwohnung.jpg',
  'fewo-schlafzimmer.jpg': 'uploads/2016/11/schlafzimmer2-in-ditzum.jpg',
  'fewo-wohnbereich.jpg': 'uploads/2016/11/wohnzimmer-balkon-ostfriesl.jpg',
  'fewo-dusche.jpg': 'uploads/2016/11/dusche-ferienwohnung-ditzum.jpg',
  'fewo-kueche.jpg': 'uploads/2016/11/kueche-ditzum.jpg',
  'fewo-bad-eingang.jpg': 'uploads/2016/11/badezimmer-urlaub-ostfriesl.jpg',
  'fewo-bad.jpg': 'uploads/2016/11/badezimmer2-ferienwohnung.jpg',

  'apartment-wohnbereich-1.jpg': 'uploads/2016/11/ditzum-in-ostfriesland.jpg',
  'apartment-wohnbereich-2.jpg': 'uploads/2016/11/huus-windroos-ditzum.jpg',
  'apartment-kueche-1.jpg': 'uploads/2016/11/kueche-in-ditzum.jpg',
  'apartment-balkon.jpg': 'uploads/2016/11/ostfriesland-ferienwohnung.jpg',
  'apartment-schlafzimmer.jpg': 'uploads/2016/11/urlaub-am-meer.jpg',
  'apartment-kommode.jpg': 'uploads/2016/11/urlaub-an-der-nordsee.jpg',
  'apartment-kueche-2.jpg': 'uploads/2016/11/urlaub-in-ostfriesland.jpg',

  'ostfriesland-fischkutter.jpg': 'uploads/2016/12/fischkutter_im_hafen.jpg',
  'ostfriesland-leuchtturm.jpg': 'uploads/2016/12/ostfriesischer_leuchtturm.jpg',
  'ostfriesland-schafe.jpg': 'uploads/2016/12/schafe_auf_dem_deich.jpg',
  'ostfriesland-wattenmeer.jpg': 'uploads/2016/12/wattenmeer.jpg',

  // only as reference for the logo
  'logo-alt.png': 'themes/windrose_v2/img/windroos.png',
}

mkdirSync(out, { recursive: true })
let loaded = 0
let failed = 0

for (const [file, path] of Object.entries(images)) {
  const target = join(out, file)
  if (existsSync(target) && !force) {
    console.log(`  = ${file} (vorhanden)`)
    continue
  }
  try {
    const res = await fetch(base + path)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    writeFileSync(target, Buffer.from(await res.arrayBuffer()))
    console.log(`  ✓ ${file}`)
    loaded++
  } catch (e) {
    console.log(`  ✗ ${file} – ${e.message} (${base + path})`)
    failed++
  }
}

console.log(`\n${loaded} geladen, ${failed} fehlgeschlagen → ${out}`)
if (failed) process.exitCode = 1
