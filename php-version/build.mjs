/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the build of the static PHP version: Nuxt export + kontakt.php → php-version/public
* (same approach as in the KK landing page).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
// Usage (in the project folder): npm run generate:php
import { execSync } from 'node:child_process'
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const exported = join(root, '.output', 'public')
const out = join(here, 'public')

console.log('1/3 Nuxt export (nuxt generate) …')
console.log(`    Site URL: ${process.env.NUXT_PUBLIC_SITE_URL || 'https://www.huus-windroos.de (Standard)'}`)
execSync('npx nuxi generate', { cwd: root, stdio: 'inherit', env: { ...process.env, NUXT_PUBLIC_CONTACT_ENDPOINT: '/kontakt.php', NUXT_PUBLIC_TRAVANTO_ENDPOINT: '/travanto.php' } })
if (!existsSync(join(exported, 'index.html'))) {
  throw new Error('Export failed: .output/public/index.html is missing')
}

console.log('2/3 Copying export to php-version/public …')
rmSync(out, { recursive: true, force: true })
cpSync(exported, out, { recursive: true })

console.log('3/3 Adding kontakt.php, travanto.php and .htaccess …')
cpSync(join(here, 'php'), out, { recursive: true })
writeFileSync(join(out, 'BUILD.txt'), `Built ${new Date().toISOString()} from the Nuxt project (npm run generate:php)\n`)

console.log('\nDone: upload the contents of php-version/public as web root, lib/ and config/ next to it (see README.md).')
