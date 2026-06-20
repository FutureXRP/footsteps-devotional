// Spiritual Formation — entry generation pipeline
// ---------------------------------------------------------------------------
// Generates full devotional entries from the 365-topic master list
// (docs/spiritual-formation-principles.md) and merges them into
// data/series/spiritual-formation.json. Resumable: skips days already written.
//
// Real WEB passage text is fetched and injected so Scripture is not invented,
// and every entry is still meant to be verified in the post-generation audit
// (see docs/spiritual-formation-authoring.md). The Voice is restricted to
// Scripture or PUBLIC-DOMAIN classics; in-copyright modern books are referenced
// in prose, never quoted verbatim.
//
// Run:
//   ANTHROPIC_API_KEY=sk-... node scripts/generate-spiritual-formation.mjs
// Options (env):
//   MODEL=claude-sonnet-4-6     # override the model id for your account
//   ONLY=1-25                   # generate only this day range
//   DRY=1                       # build prompts + fetch Scripture, no API calls
//
// After running: `npm run validate` then read/audit the new entries.
// NOTE: bible-api.com must be allowlisted in the environment's network egress
// policy for the Scripture fetch to succeed; otherwise run where it is reachable.
// ---------------------------------------------------------------------------
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const PRINCIPLES_MD = path.join(ROOT, 'docs/spiritual-formation-principles.md')
const OUT = path.join(ROOT, 'data/series/spiritual-formation.json')

const API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
const MODEL = process.env.MODEL || 'claude-sonnet-4-6'
const DRY = !!process.env.DRY

// 13 stages — must match lib/series.ts sections.
const STAGES = [
  { index: 1, title: 'The Awakening', subtitle: 'The burden and the cross', range: [1, 25] },
  { index: 2, title: 'The Great Surrender', subtitle: 'My utmost for His highest', range: [26, 55] },
  { index: 3, title: 'The Love of the Father', subtitle: 'Adopted, held, abiding', range: [56, 85] },
  { index: 4, title: 'The Means of Grace', subtitle: 'The disciplines of the heart', range: [86, 120] },
  { index: 5, title: 'Pathways to God', subtitle: 'How you draw near', range: [121, 145] },
  { index: 6, title: 'The Interior Castle', subtitle: 'The mansions of the soul', range: [146, 175] },
  { index: 7, title: "The Tempter's Strategy", subtitle: 'The enemy of your formation', range: [176, 205] },
  { index: 8, title: 'The Dark Night & the Valley', subtitle: 'When God seems absent', range: [206, 235] },
  { index: 9, title: 'The Death of Self', subtitle: 'Losing your life to find it', range: [236, 265] },
  { index: 10, title: 'Christ Formed in You', subtitle: 'The fruit of the Spirit', range: [266, 295] },
  { index: 11, title: 'Formed Together', subtitle: 'No one is formed alone', range: [296, 320] },
  { index: 12, title: 'The Active Life', subtitle: 'Contemplation in action', range: [321, 340] },
  { index: 13, title: 'The Celestial City', subtitle: 'The end of the pilgrimage', range: [341, 365] },
]
const stageFor = (day) => STAGES.find((t) => day >= t.range[0] && day <= t.range[1])

// ---- parse the master list -> [{day, truth, passage}] ---------------------
function parsePrinciples() {
  const text = fs.readFileSync(PRINCIPLES_MD, 'utf8')
  const out = []
  for (const line of text.split('\n')) {
    const m = line.match(/^(\d+)\.\s+(.*?)\s+—\s+(.+?)\s*$/)
    if (m) out.push({ day: +m[1], truth: m[2].trim(), passage: m[3].trim() })
  }
  return out
}

// ---- fetch real WEB text so Scripture isn't invented ----------------------
async function fetchWeb(passage) {
  const ref = passage.replace(/[–—]/g, '-')
  try {
    const r = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=web`)
    if (!r.ok) return ''
    const j = await r.json()
    return (j.text || '').replace(/\s+/g, ' ').trim()
  } catch {
    return ''
  }
}

const SYSTEM =
  'You are a seasoned spiritual director and Bible teacher writing for a conservative, historic-Protestant audience. Your theology is orthodox; you never force a lesson the text will not bear. You quote Scripture only from the public-domain World English Bible (WEB). The quoted Voice must be Scripture or a PUBLIC-DOMAIN classic (Bunyan, Teresa of Avila, Thomas a Kempis, Brother Lawrence, Augustine, Andrew Murray, Oswald Chambers); you never quote an in-copyright modern book verbatim — you reference its idea in the prose instead. Return ONLY raw JSON — no markdown, no backticks. Start with { and end with }.'

function userPrompt({ day, truth, passage }, webText) {
  const stage = stageFor(day)
  return `Write one daily devotional entry for a Spiritual Formation series.

Day ${day}. Stage: "${stage.title}" (${stage.subtitle}).
Formation truth to develop: "${truth}"
Anchor passage: ${passage}
${webText ? `Anchor passage text (WEB): ${webText}` : ''}

Rules:
- Quote Scripture ONLY from the WEB (public domain). Quote accurately.
- "voiceQuote" is Scripture (WEB) OR a real public-domain classic line; "scriptureRef"/"scriptureText" must be a DIFFERENT verse that anchors the truth. Voice reference and Word reference must not be the same.
- Never quote The Screwtape Letters, The Shack, Sacred Pathways, or Mansions of the Heart verbatim; reference their ideas in prose, attributed.
- Prose contains no double-quote characters.
- "moment": 2-3 short paragraphs separated by \\n\\n — a vivid, accurate scene that opens the truth.
- "weight": 2 short paragraphs separated by \\n\\n, ending on a direct second-person question.
- The formation lens is interior and personal; "reflection" is 3-4 personal examen questions (second person, for one soul, not a team).

Return exactly this JSON shape:
{
  "title": "short, evocative",
  "figure": "the person or scene",
  "era": "the setting/source",
  "dateLabel": "a broad period or 'Scripture'",
  "moment": "...",
  "voiceQuote": "...",
  "voiceAttribution": "Name, setting — Book c:v (WEB)  OR  Name — Work",
  "scriptureRef": "a DIFFERENT reference",
  "scriptureText": "that verse in WEB",
  "weight": "...",
  "formation": {
    "invitation": "...", "interiorWork": "...", "practice": "...",
    "resistance": "...", "reflection": ["...", "...", "..."], "prayer": "..."
  },
  "notes": { "primary": "the passage(s)/source the entry rests on", "tradition": null, "archaeological": null, "confidence": "high" }
}`
}

async function callClaude(system, user) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 2500, system, messages: [{ role: 'user', content: user }] }),
  })
  if (!r.ok) throw new Error(`API ${r.status}: ${(await r.text()).slice(0, 300)}`)
  const j = await r.json()
  let txt = (j.content?.[0]?.text || '').trim()
  txt = txt.replace(/^```(json)?/i, '').replace(/```$/, '').trim()
  return JSON.parse(txt)
}

function assemble(meta, gen) {
  const stage = stageFor(meta.day)
  return {
    day: meta.day,
    volume: stage.index,
    volumeTitle: stage.title,
    volumeSubtitle: stage.subtitle,
    volumeYears: 'Scripture & Tradition',
    title: gen.title,
    figure: gen.figure,
    era: gen.era,
    dateLabel: gen.dateLabel,
    moment: gen.moment,
    voiceQuote: gen.voiceQuote,
    voiceAttribution: gen.voiceAttribution,
    scriptureRef: gen.scriptureRef,
    scriptureText: gen.scriptureText,
    weight: gen.weight,
    notes: gen.notes,
    formation: gen.formation,
  }
}

async function main() {
  if (!API_KEY && !DRY) {
    console.error('Set ANTHROPIC_API_KEY (or run with DRY=1 to test prompts).')
    process.exit(1)
  }
  const principles = parsePrinciples()
  const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'))
  const have = new Set(existing.map((e) => e.day))
  const byDay = new Map(existing.map((e) => [e.day, e]))

  let todo = principles.filter((p) => !have.has(p.day))
  if (process.env.ONLY) {
    const [a, b] = process.env.ONLY.split('-').map(Number)
    todo = todo.filter((p) => p.day >= a && p.day <= (b || a))
  }
  console.log(`To generate: ${todo.length} entries (${have.size} already written).`)

  let done = 0
  for (const p of todo) {
    try {
      const web = await fetchWeb(p.passage)
      if (DRY) { console.log(`[dry] day ${p.day}: ${p.truth.slice(0, 50)}… (web ${web ? 'ok' : 'miss'})`); continue }
      const gen = await callClaude(SYSTEM, userPrompt(p, web))
      byDay.set(p.day, assemble(p, gen))
      done++
      // Write after each success so the run is resumable if interrupted.
      const merged = [...byDay.values()].sort((a, b) => a.day - b.day)
      fs.writeFileSync(OUT, JSON.stringify(merged, null, 2) + '\n')
      console.log(`✓ day ${p.day} (${done}/${todo.length}) — ${gen.title}`)
      await new Promise((r) => setTimeout(r, 400)) // gentle pacing
    } catch (e) {
      console.error(`✗ day ${p.day}: ${e.message}`)
    }
  }
  console.log(`\nDone. Wrote ${done} entries. Now run: npm run validate`)
}

main()
