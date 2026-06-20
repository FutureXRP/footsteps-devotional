# The Footsteps Devotional

A multi-series devotional library, built with Next.js and deployed on Vercel. The landing page is a library; each devotional series lives at its own path. The first series — **Church History** (`/footsteps`) — is a 365-day journey through two thousand years of the church.

**Status:** Live. Church History complete — 365 entries across five volumes (~158,000 words). Biblical Leadership in progress. Spiritual Formation mapped (365-day plan + starter entries; `coming-soon`).
**Live at:** [footstepsdevotional.com](https://footstepsdevotional.com)

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

### Domain & SEO

The public origin lives in one place — `lib/site.ts` (`SITE_URL`). Metadata
(`app/layout.tsx`), per-entry Open Graph/canonical tags, `app/sitemap.ts`, and
`app/robots.ts` all read from it. If the domain ever changes, update that one
constant. The custom domain `footstepsdevotional.com` is attached to the
project in the Vercel dashboard (Project → Settings → Domains).

---

## Adding a new devotional series

Series are **data, not code** — the library, routing, reader, progress, and
sitemap all read from a registry. To add one:

1. Add a `Series` entry to `lib/series.ts` (slug, title, accent, sections, hero copy, `status`).
2. Add its content file `data/series/<slug>.json` and wire it into `ENTRIES` in `lib/series-data.ts`.
3. Flip `status` to `live`. It now appears in the library and at `/<slug>`, `/<slug>/journey`, `/<slug>/entry/[day]`, and `/<slug>/bookmarks` automatically.

`npm run validate` (also run automatically before every build) checks each
series file — required fields present, contiguous day numbers, a source on
every entry — so a malformed series fails the build rather than shipping.

The historical series intentionally keeps its content at the original
`data/entries.json` path, untouched.

---

## Project structure

```
data/
  entries.json              — Church History entries (untouched original path)
  series/<slug>.json        — additional series' entries

app/
  page.tsx                  — the library landing page (series selector)
  [series]/page.tsx         — a series home (hero, featured entry, sections)
  [series]/journey/page.tsx — full entry browser for a series
  [series]/entry/[day]/     — individual entry reader
  [series]/bookmarks/       — saved entries for a series

components/
  LibraryCard.tsx           — a series card on the library page
  EntryReader.tsx           — the four-part reading UI (shared by all series)
  JourneyClient.tsx         — journey list (read dots, bookmark indicators)
  BookmarksClient.tsx       — saved-entries list (shared)
  ProgressBar.tsx           — personal progress card on a series home

lib/
  series.ts                 — series registry (config; client-safe)
  series-data.ts            — entry data access (server-only)
  types.ts                  — Entry type + colour palette
  storage.ts                — per-series localStorage progress & bookmarks
  site.ts                   — public origin / SITE_URL

scripts/
  validate-content.mjs      — content integrity gate (runs before build)
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

- [ ] **Next devotional series — _The Upheaval_** (the series to follow Spiritual Formation; supersedes the earlier "Relationships" idea)
- [ ] Supabase auth + user accounts (cross-device sync)
- [ ] Stripe paywall (Volumes 2–5 behind subscription)
- [ ] Historical Notes appendix export for print edition
- [ ] Mobile app (iOS/Android via footstepsbibleapp.com)
- [ ] Audio narration per entry

---

*Matt Blair · footstepsbibleapp.com*
