# The Footsteps Devotional

A 365-day journey through two thousand years of church history. Built with Next.js, deployed on Vercel.

**Status:** Complete — all 365 entries written across five volumes (~158,000 words).

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying

Push to GitHub. Vercel auto-deploys on every commit.

```bash
git add .
git commit -m "Your message"
git push
```

---

## Project structure

```
data/
  entries.json          — all 365 devotional entries (single source of truth)

app/
  page.tsx              — homepage (hero, featured entry, volume list, personal progress)
  journey/page.tsx      — full entry browser (all 365 with read indicators)
  entry/[day]/page.tsx  — individual devotional entry reader
  bookmarks/page.tsx    — saved entries page

components/
  EntryReader.tsx       — main reading UI (moment, voice, word, weight, sources)
  JourneyClient.tsx     — client wrapper for journey page (read dots, bookmark indicators)
  ProgressBar.tsx       — personal progress card on homepage

lib/
  entries.ts            — data access functions
  types.ts              — Entry type, VOLUME_COLORS, VOLUME_RANGES
  storage.ts            — localStorage read tracking and bookmarks
```

---

## Volume structure

| Vol | Title | Era | Days | Year range |
|-----|-------|-----|------|------------|
| 1 | Blood & Fire | The Early Church | 1–73 | 30–325 AD |
| 2 | Councils & Confessions | The Age of Doctrine | 74–146 | 313–600 AD |
| 3 | Darkness & Light | The Medieval Church | 147–219 | 600–1517 AD |
| 4 | Here I Stand | The Reformation | 220–292 | 1500–1700 AD |
| 5 | Fire in the World | The Modern Church | 293–365 | 1700–Present |

Note: Vol 1–2 intentionally overlap at 313–325 AD. The Edict of Milan (313) opens the Constantinian era while Nicaea (325) closes the early church era.

---

## Entry structure

Each entry in `data/entries.json` follows this shape:

```json
{
  "day": 1,
  "volume": 1,
  "volumeTitle": "Blood & Fire",
  "volumeSubtitle": "The Early Church",
  "volumeYears": "30–325 AD",
  "title": "The fire falls",
  "figure": "Pentecost",
  "era": "Jerusalem",
  "dateLabel": "30 AD",
  "moment": "Narrative scene. Paragraphs separated by \\n\\n.",
  "voiceQuote": "Quote text without quotation marks",
  "voiceAttribution": "Name, Source, Date",
  "scriptureRef": "Acts 2:1",
  "scriptureText": "Scripture without quotation marks",
  "weight": "Reflection. Paragraphs separated by \\n\\n.",
  "notes": {
    "primary": "Primary source documentation",
    "tradition": "Later tradition note, or null",
    "archaeological": "Physical evidence, or null",
    "confidence": "high | medium | tradition"
  }
}
```

The `notes` field powers the expandable Historical Sources section at the bottom of each entry.

---

## Reader features

All built on localStorage (no account required):

- **Read tracking** — automatically marks entries read on visit
- **Bookmarks** — ◇/◆ button on each entry saves to `/bookmarks`
- **Continue reading** — homepage shows "Continue — Day X →" once started
- **Progress display** — personal read count and % on homepage
- **Journey indicators** — colored dots show read/unread on the full entry list

When Supabase is added, swap `lib/storage.ts` for database calls. All UI stays the same.

---

## Making corrections

See `CORRECTIONS.md` for the working list of content fixes. When a correction is identified:

1. Open `data/entries.json`
2. Find the entry by day number
3. Make the targeted fix
4. Add a note to `CORRECTIONS.md`
5. Commit and push

---

## Planned future work

- [ ] Supabase auth + user accounts (cross-device sync)
- [ ] Stripe paywall (Volumes 2–5 behind subscription)
- [ ] Historical Notes appendix export for print edition
- [ ] Mobile app (iOS/Android via footstepsbibleapp.com)
- [ ] Audio narration per entry

---

*Matt & Georgia Blair · footstepsbibleapp.com*
