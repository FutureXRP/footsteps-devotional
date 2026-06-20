// Verify Scripture against the public-domain WEB text from bible-api.com.
// ---------------------------------------------------------------------------
// For a series file, fetches the WEB text of every Word reference (scriptureRef)
// AND every Voice reference tagged "(WEB)" in voiceAttribution, and prints
// ref -> WEB text so the authored wording can be checked and corrected.
//
// Requires bible-api.com to be allowlisted in the environment's network egress
// policy (see code.claude.com/docs). If it is blocked, every fetch will report
// the block and nothing is changed.
//
//   node scripts/verify-web-scripture.mjs [data/series/spiritual-formation.json]
// ---------------------------------------------------------------------------
import fs from 'node:fs'

const file = process.argv[2] || 'data/series/spiritual-formation.json'
const data = JSON.parse(fs.readFileSync(file, 'utf8'))

// Word references (the quoted Scripture text shown as "The Word").
const wordRefs = data.map((e) => e.scriptureRef).filter(Boolean)
// Voice references, only when the Voice is Scripture (attribution ends "(WEB)").
const voiceRefs = data
  .map((e) => {
    const m = (e.voiceAttribution || '').match(/[—-]\s*((?:[1-3]\s)?[A-Za-z. ]+?\s\d+:\d+(?:[-–]\d+)?)\s*\(WEB\)/)
    return m ? m[1].trim() : null
  })
  .filter(Boolean)

const refs = [...new Set([...wordRefs, ...voiceRefs])]
console.log(`Verifying ${refs.length} distinct Scripture references from ${file}\n`)

let miss = 0
for (const ref of refs) {
  const q = ref.replace(/[–—]/g, '-')
  try {
    const r = await fetch(`https://bible-api.com/${encodeURIComponent(q)}?translation=web`)
    if (!r.ok) {
      console.log(`✗ ${ref}: HTTP ${r.status} ${(await r.text()).slice(0, 80)}`)
      miss++
    } else {
      const j = await r.json()
      const text = (j.text || '').replace(/\s+/g, ' ').trim()
      console.log(`• ${ref}\n    ${text}\n`)
    }
  } catch (e) {
    console.log(`✗ ${ref}: ${e.message}`)
    miss++
  }
  await new Promise((r) => setTimeout(r, 250)) // gentle pacing
}

console.log(
  miss
    ? `\n${miss} reference(s) could not be fetched. Is bible-api.com allowlisted in this environment's egress policy?`
    : `\nAll ${refs.length} references fetched. Compare the WEB text above to the authored quotes and correct any drift.`,
)
