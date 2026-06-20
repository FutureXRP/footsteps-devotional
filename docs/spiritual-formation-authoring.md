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

## 3. Sources & copyright (the conservative line)

This is a commercial site, so we hold a deliberately cautious line: **nothing
verbatim that is not public domain**, and when in doubt, paraphrase in our own
words and attribute. We do not lean on fair-use exceptions for quotation.

**(a) Public domain, original English — quote verbatim, with attribution:**
- John Bunyan, *The Pilgrim's Progress* (1678).
- Andrew Murray (*Humility*, *Abide in Christ*), Hannah Whitall Smith, E.M. Bounds, Jonathan Edwards — pre-1929 English. Quote freely.
- **Oswald Chambers, *My Utmost for His Highest*** — quote the **original 1927 text only**. (Public domain in the US since 2023; worldwide under life+70, Chambers d. 1917.) Do NOT quote a modern *updated/reworded edition* (e.g. the 1992 edition) — that rewording has its own live copyright.

**(b) Public-domain WORK, but the TRANSLATION may not be (not written in English):**
- Augustine *Confessions* (Latin); Teresa of Avila *Interior Castle* (Spanish); Thomas a Kempis *Imitation of Christ* (Latin); Brother Lawrence *Practice of the Presence of God* (French); John of the Cross *Dark Night* (Spanish); Julian of Norwich (Middle English); Francis de Sales (French).
- The original is public domain, **but a specific modern English translation is under the translator's copyright.** So either: (i) quote a clearly **public-domain translation** (generally pre-1929 — e.g. Pusey's 1838 *Confessions*), or (ii) render it into our own English from the original and tag the attribution "(rendered from the Latin/Spanish/French)". **Never lift the wording of a modern copyrighted translation.**

**(c) In copyright — NEVER quote verbatim; reference and paraphrase in our own words only:**
- C.S. Lewis, *The Screwtape Letters* (1942); Gary Thomas, *Sacred Pathways* (1996); R. Thomas Ashbrook, *Mansions of the Heart* (2009); William P. Young, *The Shack* (2007).
- **Allowed:** naming the book/author; describing its insight in our own words; using its **ideas and frameworks** — ideas, systems, and taxonomies are not copyrightable (e.g. Thomas's nine temperaments may be used as a taxonomy, with our own descriptions and attribution). A book **title is not copyrightable**, but as a courtesy we do not reuse a living author's exact title or distinctive character as one of our own section headers.
- **Not allowed:** any verbatim sentence, or a paraphrase that closely tracks the author's specific wording or structure (that can be an infringing derivative). The expression must be genuinely ours.
- For *The Shack* specifically: draw on its relational warmth (the Father-heart of God); **keep doctrine orthodox** and do not endorse its contested ideas.

**The Voice field is reserved for Scripture and public-domain sources** — an
in-copyright author never appears there.

## 4. The Formation lens (what makes this series itself)

Distinct from the leadership lens (which is team/organizational). This one is
**interior and personal**, and the `reflection` field is the point everything
drives toward.

```
"formation": {
  "invitation":   "the single carry-it-with-you invitation — what God is forming in you here",
  "interiorWork": "3-4 sentences — what must change in the soul (desire, the hidden self, the heart's loves)",
  "practice":     "one concrete spiritual practice to engage (prayer, silence, examen, fasting, lectio, solitude, service)",
  "resistance":   "2-3 sentences — the tempter's angle: what the flesh, world, or enemy uses to derail this; the self-deception to watch",
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
- [ ] **Translations:** any non-English classic is quoted from a public-domain translation, or rendered in our own English and tagged as such — no modern copyrighted translation lifted.
- [ ] **Chambers** is from the 1927 original, not a modern updated edition.
- [ ] **No in-copyright book** (Screwtape, The Shack, Sacred Pathways, Mansions of the Heart) is quoted verbatim or closely paraphrased — ideas only, named and attributed.
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
