// Content integrity gate — runs before `next build`.
// Validates every devotional content file so a malformed or half-written
// series can't reach production. Exits non-zero (failing the build) on any error.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const REQUIRED_STRINGS = [
  'title', 'figure', 'era', 'dateLabel', 'moment',
  'voiceQuote', 'voiceAttribution', 'scriptureRef', 'scriptureText', 'weight',
]
const CONFIDENCE = new Set(['high', 'medium', 'tradition'])

// Discover content files: the historical series at its original path + any under data/series/.
const files = []
if (fs.existsSync(path.join(ROOT, 'data/entries.json'))) files.push('data/entries.json')
const seriesDir = path.join(ROOT, 'data/series')
if (fs.existsSync(seriesDir)) {
  for (const f of fs.readdirSync(seriesDir)) if (f.endsWith('.json')) files.push(`data/series/${f}`)
}

const errors = []
for (const rel of files) {
  let data
  try {
    data = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'))
  } catch (e) {
    errors.push(`${rel}: invalid JSON — ${e.message}`)
    continue
  }
  if (!Array.isArray(data) || data.length === 0) {
    errors.push(`${rel}: must be a non-empty array`)
    continue
  }

  data.forEach((e, i) => {
    const at = `${rel}[${i}] (day ${e?.day ?? '?'})`
    if (typeof e.day !== 'number') errors.push(`${at}: missing numeric "day"`)
    if (typeof e.volume !== 'number') errors.push(`${at}: missing numeric "volume"`)
    for (const k of REQUIRED_STRINGS) {
      if (typeof e[k] !== 'string' || e[k].trim() === '') errors.push(`${at}: missing/empty "${k}"`)
    }
    if (!e.notes || typeof e.notes.primary !== 'string' || e.notes.primary.trim() === '') {
      errors.push(`${at}: missing "notes.primary" (every entry must cite a source)`)
    }
    if (!e.notes || !CONFIDENCE.has(e.notes.confidence)) {
      errors.push(`${at}: notes.confidence must be one of ${[...CONFIDENCE].join(', ')}`)
    }
    // Optional leadership lens — if present, every section must be filled.
    if (e.leadership) {
      const L = e.leadership
      for (const k of ['principle', 'innerLife', 'leadingThroughIt', 'blindSpot', 'weeklyPractice']) {
        if (typeof L[k] !== 'string' || L[k].trim() === '') errors.push(`${at}: leadership.${k} missing/empty`)
      }
      if (!Array.isArray(L.teamQuestions) || L.teamQuestions.length < 2 || !L.teamQuestions.every((q) => typeof q === 'string' && q.trim())) {
        errors.push(`${at}: leadership.teamQuestions must be an array of at least 2 non-empty strings`)
      }
    }
  })

  // Days must be unique and contiguous from 1 (written entries fill 1..N with no gaps).
  const days = data.map((e) => e.day).sort((a, b) => a - b)
  days.forEach((d, i) => {
    if (d !== i + 1) errors.push(`${rel}: day sequence breaks at position ${i + 1} (found day ${d}); days must be contiguous from 1 with no gaps or duplicates`)
  })
}

if (errors.length) {
  console.error(`\n✗ Content validation failed (${errors.length} issue${errors.length > 1 ? 's' : ''}):`)
  for (const e of errors.slice(0, 50)) console.error('  - ' + e)
  if (errors.length > 50) console.error(`  …and ${errors.length - 50} more`)
  process.exit(1)
}

console.log(`✓ Content validation passed — ${files.length} series file(s) checked.`)
