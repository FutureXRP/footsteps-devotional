// One-off asset generator for the home-screen / PWA icons.
// Requires `sharp` (already present via Next.js). Regenerate with:
//   node scripts/generate-icons.mjs
// Renders the brand "flame" mark — echoing the site's fire/Pentecost motif —
// to every PNG size that iOS, Android, and the web manifest need.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BG = '#12100E' // brand near-black, matches the homepage hero + nav

// flameScale < 1 shrinks the mark toward the centre, leaving the safe-zone
// padding that Android adaptive (maskable) icons require.
function svg({ flameScale = 1 } = {}) {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="64%" r="58%">
      <stop offset="0%" stop-color="#D85A30" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#D85A30" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7A24B"/>
      <stop offset="46%" stop-color="#E0682F"/>
      <stop offset="100%" stop-color="#AE3717"/>
    </linearGradient>
    <linearGradient id="core" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDEFD9"/>
      <stop offset="100%" stop-color="#F4A85F"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="${BG}"/>
  <rect width="512" height="512" fill="url(#glow)"/>
  <g transform="translate(256 256) scale(${flameScale}) translate(-256 -256)">
    <path fill="url(#flame)" d="M256 84
      C250 156 322 188 332 268
      C340 334 306 416 256 416
      C206 416 172 372 172 314
      C172 270 196 250 208 222
      C214 254 206 280 232 290
      C252 258 226 222 250 172
      C260 150 264 118 256 84 Z"/>
    <path fill="url(#core)" d="M256 246
      C252 286 300 296 300 338
      C300 372 280 392 256 392
      C232 392 214 372 214 340
      C214 306 250 296 256 246 Z"/>
  </g>
</svg>`
}

async function render(svgStr, size, outPath) {
  await mkdir(dirname(outPath), { recursive: true })
  await sharp(Buffer.from(svgStr)).resize(size, size).png().toFile(outPath)
  console.log('wrote', outPath.replace(root + '/', ''))
}

const standard = svg({ flameScale: 1 })
const maskable = svg({ flameScale: 0.72 })

await render(standard, 512, join(root, 'app/icon.png'))        // browser + general
await render(standard, 180, join(root, 'app/apple-icon.png'))  // iOS home screen
await render(standard, 192, join(root, 'public/icon-192.png')) // manifest (any)
await render(standard, 512, join(root, 'public/icon-512.png')) // manifest (any)
await render(maskable, 512, join(root, 'public/icon-maskable.png')) // Android adaptive
