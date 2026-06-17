// Biblical Leadership — entry generation pipeline
// ---------------------------------------------------------------------------
// Generates full devotional entries from the 365-principle master list
// (docs/leadership-principles.md) and merges them into
// data/series/leadership.json. Resumable: skips days already written.
//
// This is the PassageLab pattern adapted to our schema: the real WEB passage
// text is fetched and injected into the prompt so Scripture is not invented,
// and every entry is still meant to be verified in the post-generation audit.
//
// Run:
//   ANTHROPIC_API_KEY=sk-... node scripts/generate-leadership.mjs
// Options (env):
//   MODEL=claude-sonnet-4-6     # override the model id for your account
//   ONLY=15-40                  # generate only this day range
//   DRY=1                       # build prompts + fetch Scripture, no API calls
//
// After running: `npm run validate` then read/audit the new entries.
// ---------------------------------------------------------------------------
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const PRINCIPLES_MD = path.join(ROOT, 'docs/leadership-principles.md')
const OUT = path.join(ROOT, 'data/series/leadership.json')

const API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
const MODEL = process.env.MODEL || 'claude-sonnet-4-6'
const DRY = !!process.env.DRY

// 13 themes — must match lib/series.ts sections.
const THEMES = [
  { index: 1, title: 'Calling & Authority', subtitle: 'Where leadership begins', range: [1, 30] },
  { index: 2, title: 'Character & Integrity', subtitle: 'Who you are unseen', range: [31, 65] },
  { index: 3, title: 'Humility & Servanthood', subtitle: 'Greatness that stoops', range: [66, 95] },
  { index: 4, title: 'Wisdom & Discernment', subtitle: 'Leading with skill', range: [96, 130] },
  { index: 5, title: 'Vision & Direction', subtitle: 'Setting the way', range: [131, 155] },
  { index: 6, title: 'Courage & Conviction', subtitle: 'Standing firm', range: [156, 185] },
  { index: 7, title: 'Shepherding & Developing People', subtitle: 'Caring for and raising others', range: [186, 220] },
  { index: 8, title: 'Delegation, Team & Succession', subtitle: 'Sharing and handing off', range: [221, 245] },
  { index: 9, title: 'Words, Truth & Influence', subtitle: 'The weight of words', range: [246, 270] },
  { index: 10, title: 'Conflict, Correction & Reconciliation', subtitle: 'Hard conversations, kept whole', range: [271, 300] },
  { index: 11, title: 'Endurance, Suffering & Opposition', subtitle: 'Staying on the wall', range: [301, 325] },
  { index: 12, title: 'Failure, Grace & Restoration', subtitle: 'Falling and rising', range: [326, 345] },
  { index: 13, title: 'Prayer & Dependence', subtitle: "Leading from God's presence", range: [346, 365] },
]
const themeFor = (day) => THEMES.find((t) => day >= t.range[0] && day <= t.range[1])

// ---- parse the master list -> [{day, principle, passage}] -----------------
function parsePrinciples() {
  const text = fs.readFileSync(PRINCIPLES_MD, 'utf8')
  const out = []
  for (const line of text.split('\n')) {
    const m = line.match(/^(\d+)\.\s+(.*?)\s+—\s+(.+?)\s*$/)
    if (m) out.push({ day: +m[1], principle: m[2].trim(), passage: m[3].trim() })
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
  'You are an experienced leadership-development coach and Bible teacher writing for a conservative, historic-Protestant audience. Your theology is orthodox; you never force a lesson the text will not bear. You quote Scripture only from the public-domain World English Bible (WEB). Return ONLY raw JSON — no markdown, no backticks, no commentary. Start with { and end with }.'

function userPrompt({ day, principle, passage }, webText) {
  const theme = themeFor(day)
  return `Write one daily devotional entry for a Biblical Leadership series.

Day ${day}. Theme: "${theme.title}".
Leadership principle to develop: "${principle}"
Anchor passage: ${passage}
${webText ? `Anchor passage text (WEB): ${webText}` : ''}

Rules:
- Quote Scripture ONLY from the WEB (public domain). Quote accurately.
- "voiceQuote" must be a real line spoken by a person in Scripture (or a memorable biblical line), with a reference; "scriptureRef"/"scriptureText" must be a DIFFERENT verse that anchors the principle. Voice reference and Word reference must not be the same.
- Prose contains no double-quote characters.
- "moment": 2-3 short paragraphs separated by \\n\\n — a vivid, accurate narrative scene that opens the principle.
- "weight": 2 short paragraphs separated by \\n\\n, ending on a direct second-person question.
- Lens fields are concise (inner_life / leading_through_it 3-4 sentences; blind_spot / difficult_conversations 2-3; principle 1-2; weekly_practice one concrete practice; 4 team questions written for leaders).

Return exactly this JSON shape:
{
  "title": "short, evocative",
  "figure": "the person or scene, e.g. 'Moses at the burning bush'",
  "era": "the setting/role",
  "dateLabel": "a broad, reliable biblical period (not a contested calendar date)",
  "moment": "...",
  "voiceQuote": "...",
  "voiceAttribution": "Name, setting — Book c:v (WEB)",
  "scriptureRef": "a DIFFERENT reference",
  "scriptureText": "that verse in WEB",
  "weight": "...",
  "leadership": {
    "principle": "...", "innerLife": "...", "leadingThroughIt": "...",
    "blindSpot": "...", "difficultConversations": "...", "weeklyPractice": "...",
    "teamQuestions": ["...", "...", "...", "..."]
  },
  "notes": { "primary": "the passage(s) the entry rests on", "tradition": null, "archaeological": null, "confidence": "high" }
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
  const theme = themeFor(meta.day)
  return {
    day: meta.day,
    volume: theme.index,
    volumeTitle: theme.title,
    volumeSubtitle: theme.subtitle,
    volumeYears: 'Scripture',
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
    leadership: gen.leadership,
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
      if (DRY) { console.log(`[dry] day ${p.day}: ${p.principle.slice(0, 50)}… (web ${web ? 'ok' : 'miss'})`); continue }
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
