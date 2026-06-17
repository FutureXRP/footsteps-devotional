# Biblical Leadership — authoring logic

How a Leadership entry is produced. Adapted from the PassageLab `leadership`
study (principle → inner life → leading through it → blind spot → difficult
conversations → team questions → weekly practice) and shaped into a daily
devotional entry in this app's four-part frame.

Every entry is **drafted, then verified** before it ships. Reliability is the
product: people build their devotional life on this.

---

## 1. Pick the anchor

Each day is **leader-anchored**: one biblical leader and the passage that
carries the principle (e.g. Moses / Exodus 3; Nehemiah / Nehemiah 1–2). Choose
the principle the passage actually teaches — do not impose a leadership cliché
on the text.

## 2. Scripture: public domain only

This is a commercial site, so all quoted Scripture uses a **public-domain
translation — the World English Bible (WEB)** (KJV/ASV/YLT also acceptable).
Never quote ESV/NIV/NLT etc. Label the translation on the Voice attribution.

- **The Voice** = the leader's own recorded words (or the decisive line spoken
  to them), quoted accurately, with reference + (WEB).
- **The Word** = a *different* passage that anchors the principle. **Voice and
  Word must never be the same reference** (this was a real bug in the history
  series — see CORRECTIONS.md, Day 158).

## 3. Generation prompt

Run this against the chosen leader + passage (WEB text supplied), then verify.

```
You are an experienced leadership-development coach writing for a conservative,
historic-Protestant audience. Write one daily devotional entry on {LEADER} from
{PASSAGE}. Theology must be orthodox; never impose a lesson the text won't bear.
Return JSON matching this shape (prose has no internal double-quotes):

{
  "title": "short, evocative — often the leader's key phrase",
  "figure": "the leader + scene, e.g. 'Moses at the burning bush'",
  "era": "the setting/role",
  "dateLabel": "a broad, reliable biblical period (not a contested calendar date)",
  "moment": "3 paragraphs (\\n\\n) — the narrative scene, vivid and accurate",
  "voiceQuote": "the leader's own words from the passage (WEB), no quote marks",
  "voiceAttribution": "Name, setting — Book c:v (WEB)",
  "scriptureRef": "a DIFFERENT anchor verse",
  "scriptureText": "that verse in WEB, no quote marks",
  "weight": "2-3 paragraphs of personal reflection, ending on a direct question",
  "leadership": {
    "principle": "the single carry-it-all-week leadership thesis",
    "innerLife": "3-4 sentences — who the leader must BE (character, motive, identity)",
    "leadingThroughIt": "3-4 sentences — concrete application to leading a team",
    "blindSpot": "2-3 sentences — what people in authority resist or miss here",
    "difficultConversations": "2-3 sentences — what this gives you for a hard talk",
    "weeklyPractice": "one concrete practice a leader can actually do this week",
    "teamQuestions": ["3-4 questions written for leaders, not a general class"]
  },
  "notes": {
    "primary": "the Scripture passage(s) the entry rests on",
    "tradition": "interpretive/historical note, or null",
    "archaeological": "a SOLID corroboration only, or null",
    "confidence": "high | medium | tradition"
  }
}
```

Also set `volume` (the section index) and the section's `volumeTitle` etc. to
match the registry in `lib/series.ts`.

## 4. Verification (required before commit)

- [ ] Every **Scripture quote** matches WEB wording and reference exactly.
- [ ] **Voice reference ≠ Word reference.**
- [ ] Any **archaeological/historical** claim is real and correctly stated
      (cite only what you can stand behind — e.g. Tel Dan, Elephantine).
- [ ] Theology is orthodox for the audience; no lesson forced onto the text.
- [ ] `dateLabel` is a broad period, not a disputed precise date asserted as fact.
- [ ] `npm run validate` passes (checks required fields + the leadership lens).

## 5. Notes on the source

PassageLab routes the `leadership` tab to Haiku ($1 tier) as a "structural/
practical" task and reserves Sonnet for theological-precision tabs. We don't
inherit its pricing model; we inherit its **structure**, and we add a hard
verification pass that PassageLab leaves to the user ("verify citations before
published use").
