# Spiritual Formation — authoring logic

How a Spiritual Formation entry is produced. It uses the app's four-part frame
(Moment -> Voice -> Word -> Weight) and adds a **Formation lens** that is unique
to this series and always lands in **personal reflection** — great content, a
biblical tie-in, then a turn inward.

Every entry is **drafted, then verified** before it ships. Reliability is the
product: people build their devotional life on this.

---

## 1. Pick the anchor

Each day is **truth-anchored**: one formation truth from the master list
(`docs/spiritual-formation-principles.md`) and a passage that genuinely teaches
it. Choose the truth the passage actually carries — never force a formation
cliche onto the text. Where a stage names a guide (Bunyan, Teresa, Chambers,
Brother Lawrence, a Kempis, Augustine, Murray), let that voice **shape the
angle**; the authority is always Scripture.

## 2. Scripture: public domain only

This is a commercial site, so all quoted Scripture uses a **public-domain
translation — the World English Bible (WEB)** (KJV/ASV/YLT also acceptable).
Never quote ESV/NIV/NLT/CSB etc. Label the translation on the Voice attribution
when the Voice is Scripture.

- **The Voice** = a real, attributable line — either a person's words in
  Scripture (WEB) **or** a line from a **public-domain** spiritual classic.
- **The Word** = a *different* passage that anchors the truth. **Voice and Word
  must never be the same reference** (a real bug once shipped in the history
  series — see CORRECTIONS.md, Day 158).

## 3. Sources & copyright (read before quoting)

The named sources fall into two buckets. Source **everything** correctly.

**Public domain — quote verbatim, with attribution:**
- John Bunyan, *The Pilgrim's Progress* (1678)
- Teresa of Avila, *The Interior Castle* (1577) — the spine beneath *Mansions of the Heart*
- Thomas a Kempis, *The Imitation of Christ* (~1418)
- Brother Lawrence, *The Practice of the Presence of God* (1692)
- Augustine, *Confessions* (~398)
- Andrew Murray, *Humility* / *Abide in Christ*; John of the Cross, *Dark Night of the Soul*; Julian of Norwich; Francis de Sales; Hannah Whitall Smith; E.M. Bounds
- **Oswald Chambers, *My Utmost for His Highest* (1927)** — public domain in the US since 2023; quote with attribution

**In copyright — use the framework, attribute the idea, do NOT reproduce long verbatim text:**
- C.S. Lewis, *The Screwtape Letters* (1942) — name it, describe its insight ("Lewis imagines a senior devil coaching a junior tempter..."), keep any quoted phrase short and clearly attributed.
- Gary Thomas, *Sacred Pathways* (1996) — use the nine-temperaments framework, paraphrased and attributed; the temperament names are usable as a taxonomy.
- R. Thomas Ashbrook, *Mansions of the Heart* (2009) — use its mapping of Teresa for a modern reader; quote **Teresa** underneath it, not Ashbrook.
- William P. Young, *The Shack* (2007) — draw on its relational warmth (the Father-heart of God); **keep doctrine orthodox** for the conservative-Protestant audience and do not endorse its contested ideas; reference by name, no long quotes.

Rule of thumb: if it is in copyright, it belongs in the **prose as attributed
discussion or paraphrase**, never as a long verbatim block, and never as the
quoted **Voice**. The Voice field is reserved for Scripture and public-domain
classics.

## 4. The Formation lens (what makes this series itself)

Distinct from the leadership lens (which is team/organizational). This one is
**interior and personal**, and the `reflection` field is the point everything
drives toward.

```
"formation": {
  "invitation":   "the single carry-it-with-you invitation — what God is forming in you here",
  "interiorWork": "3-4 sentences — what must change in the soul (desire, the hidden self, the heart's loves)",
  "practice":     "one concrete spiritual practice to engage (prayer, silence, examen, fasting, lectio, solitude, service)",
  "resistance":   "2-3 sentences — the Screwtape angle: what the flesh, world, or enemy uses to derail this; the self-deception to watch",
  "reflection":   ["3-4 PERSONAL examen questions, second person, for the individual soul — not a team"],
  "prayer":       "optional — a short prayer to carry, in the reader's own voice"
}
```

## 5. Generation prompt

Run this against the chosen truth + passage (WEB text supplied), then verify.

```
You are a seasoned spiritual director and Bible teacher writing for a
conservative, historic-Protestant audience. Theology must be orthodox; never
impose a lesson the text will not bear. Quote Scripture ONLY from the
public-domain World English Bible (WEB). The quoted Voice must be Scripture or a
PUBLIC-DOMAIN classic (Bunyan, Teresa, a Kempis, Brother Lawrence, Augustine,
Murray, Chambers); never quote an in-copyright modern book — reference its idea
in the prose instead. Prose has no internal double-quotes. Return ONLY raw JSON.

{
  "title": "short, evocative",
  "figure": "the person or scene, e.g. 'Christian at the cross'",
  "era": "the setting/source",
  "dateLabel": "a broad, reliable period or 'Scripture'",
  "moment": "2-3 paragraphs (\\n\\n) — a vivid, accurate scene that opens the truth",
  "voiceQuote": "Scripture (WEB) or a public-domain classic line, no quote marks",
  "voiceAttribution": "Name, setting — Book c:v (WEB)  OR  Name — Work",
  "scriptureRef": "a DIFFERENT anchor verse",
  "scriptureText": "that verse in WEB, no quote marks",
  "weight": "2 paragraphs of personal reflection, ending on a direct second-person question",
  "formation": {
    "invitation": "...", "interiorWork": "...", "practice": "...",
    "resistance": "...", "reflection": ["...","...","..."], "prayer": "..."
  },
  "notes": {
    "primary": "the passage(s) and any classic source the entry rests on",
    "tradition": "interpretive/historical note, or null",
    "archaeological": null,
    "confidence": "high | medium | tradition"
  }
}
```

Also set `volume` (the stage index) and `volumeTitle`/`volumeSubtitle` to match
the registry in `lib/series.ts`; set `volumeYears` to "Scripture & Tradition".

## 6. Verification (required before commit)

- [ ] Every **Scripture quote** matches WEB wording and reference exactly.
- [ ] **Voice reference != Word reference.**
- [ ] The **Voice** is Scripture or a public-domain source; no in-copyright book is quoted verbatim.
- [ ] Any classic quotation is real and correctly attributed to its work.
- [ ] Theology is orthodox; The Shack's warmth is welcome, its contested ideas are not.
- [ ] The lens `reflection` is genuinely personal (an examen), not a team prompt.
- [ ] `npm run validate` passes (checks required fields + the formation lens).

## 7. Tooling note (this environment)

`scripts/generate-spiritual-formation.mjs` fetches real WEB text from
`bible-api.com` so Scripture is not invented, then calls the model to draft each
entry. **Outbound network is governed by the environment's egress policy** (see
code.claude.com/docs). In a session where `bible-api.com` is not allowlisted,
the fetch step is skipped and Scripture must be verified by hand against a WEB
source before going live. Starter entries written without the API are marked for
that final WEB pass.
