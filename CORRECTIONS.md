# Corrections Log

Working document for content fixes to `data/entries.json`.

**How to use:** When Matt identifies something to fix, add it here with the day number, the issue, and the fix applied. This gives a running record of all changes made after initial writing.

---

## Format

```
### Day [N] — [Title]
**Issue:** What was wrong
**Fix:** What was changed
**Date:** When fixed
```

---

## Applied Fixes

### Day 1 — The fire falls
**Issue:** "a few who used to be demons" — incorrectly implies the people were demons themselves.
**Fix:** Changed to "a few who had been delivered from demonic oppression."
**Date:** June 2026

### Day 43 — The Plague of Cyprian
**Issue:** "may have killed a third of the empire's population" — sits at the high end of scholarly estimates. Most historians say 10–25% in affected regions.
**Fix:** Changed to "Estimates of the total death toll vary widely — some scholars suggest it killed between a quarter and a third of the population in the hardest-hit regions, though the full empire-wide figure was certainly lower."
**Date:** June 2026

### Day 314 — The Azusa Street Revival
**Issue:** Entry did not adequately distinguish Seymour's quiet, prayerful leadership style from Whitefield's voice-carrying open-air preaching. Seymour was known for praying with his head hidden behind a wooden crate.
**Fix:** Added paragraph describing Seymour's distinctive prayer posture and quiet leadership style.
**Date:** June 2026

---

## June 2026 — Full content audit (Volumes 1–5), batch applied

A complete five-volume audit was verified against `data/entries.json` and the confirmed reliability fixes applied. Each change below was checked against the actual data before editing. The editorial/structural findings (entry merges, reordering, the two-arc and double-ending decisions) are **not** applied here — they are recorded under *Pending Review* for a deliberate editorial pass.

### Source-note misalignment (`notes` block corrected)
The narrative text in each of these was already accurate; only the `notes` source citation had slid onto the wrong day. Whole `notes` block replaced.
- **Day 29** (Pliny) — was *Ignatius, Letter to the Romans* → **Pliny the Younger, Letters 10.96-97**; tradition note cleared; confidence high.
- **Day 30** (Justin's conversion) — was *Pliny* → **Justin Martyr, Dialogue with Trypho, chs. 2-8**.
- **Day 33** (Justin's First Apology) — was *Dialogue with Trypho* → **Justin Martyr, First Apology**.
- **Day 34** (Justin's martyrdom) — was *First Apology* → **The Acts of Justin and Companions**.
- **Day 39** (Perpetua) — was *Tertullian, Apologeticus* → **The Passion of Perpetua and Felicity**.
- **Day 40** (Origen) — was a Perpetua note → **Eusebius, Church History 6; Origen's own writings** (+ tradition note on the castration; see below).
- **Day 44** (Diocletian's edict) — was *Cyprian, On Mortality* → **Lactantius, On the Deaths of the Persecutors; Eusebius, CH 8**.
- **Day 45** (the traditores) — was *Eusebius CH 7.22* (the plague chapter) → **Optatus of Milevis; Augustine's anti-Donatist writings**.
- **Day 51** (Nicene Creed) — was *Irenaeus, Against Heresies* → **The Nicene Creed and conciliar records; Athanasius; Eusebius, Life of Constantine**.
- **Day 85** (Desert Fathers) — was a Basil/Cappadocian note → **Apophthegmata Patrum**; confidence medium (oral transmission).
- **Day 137** (Boethius) — was the 1054 Schism note → **Boethius, The Consolation of Philosophy**.
- **Day 246** (Tyndale) — was "Henry Dobbe's letter" (unverifiable) → **John Foxe, Acts and Monuments**; confidence medium; body changed "the eyewitness account" → "as John Foxe later recorded it".

### Factual errors
- **Day 87** — "The pagan writer Gregory of Nazianzus" → "His friend Gregory of Nazianzus" (he was a Christian bishop and Cappadocian Father).
- **Day 143** — "Before we leave Volume 1 and step into the age of councils and confessions" → reframed as a Volume 2 closer ("Before we close the age of councils and confessions and step into the long medieval centuries…"). It sits near the end of Vol 2, which *is* that age.
- **Day 193** — "The German reformer Petrarch" → "The Italian poet Petrarch."
- **Day 197** — Voice quote "the Bible is for the government of the people, by the people, and for the people" (apocryphal; echoes Lincoln, 1863) → a documented line from the General Prologue to the Wycliffite Bible; note added flagging the apocryphal line.
- **Day 258** — "On the same day Luther burns the papal bull… actually five months before" (self-contradictory; Pamplona was May 1521) → "Five months after Luther burned the papal bull…".
- **Day 305** — title "The slave who became a hymn writer" → "The slave trader who became a hymn writer" (Newton was a slave trader; the body says so).
- **Day 307** — date label "July 26, 1833" → "August 28, 1833" (Royal Assent; the body already said Aug 28; July 26 was the Commons passage).
- **Day 309** — figure "Six years of imprisonment, no converts" → "Seventeen months in a Burmese prison" (body says 17 months and eighteen converts before arrest).
- **Day 325** — C.S. Lewis timeline corrected: age at *Phantastes* 23 → 17 (1916); the conversion stages un-scrambled (theism 1929, in his room at Magdalen; belief in Christ 1931, on the Whipsnade sidecar ride after the Tolkien walk).

### Internal consistency
- **Day 105** — reconciled "nineteen years" (in Bethlehem) with "twenty-three years" (whole commission) in one clause.
- **Day 158** — Voice quote was identical to the Scripture (both Proverbs 16:18) → replaced with Humbert's actual words at Hagia Sophia ("Let God look and judge," 1054).
- **Day 269** — figure "Two men thrown from a window" → "Three men" (body says three: two governors and their secretary).

### Reliability / hedging
- **Day 24** — "Over a million people die" → attributed to Josephus and flagged as a figure modern historians consider greatly inflated.
- **Day 40** — self-castration narrated as flat fact → hedged ("on the testimony of Eusebius… some modern scholars doubt the account"), matching Day 60.
- **Day 73** — "three hundred and eighteen… the number is preserved" → noted as the traditional/symbolic number, exact count uncertain.
- **Day 280** — "executes approximately eighteen thousand" → clarified that ~18,000 counts all victims (executed, banished, dispossessed); those put to death far fewer.

### Theology (conservative-Protestant clarity)
- **Day 49** — added a gloss after Athanasius's "become God" line clarifying theosis as participation in the divine nature (2 Peter 1:4), not divinity in essence.
- **Day 58** — the Dinocrates (prayer-for-the-dead) vision reframed as reported from Perpetua's diary, not commended as doctrine.
- **Day 145** — added a clause noting these are the early church's words and that Christians have since differed on how Christ is present at the table.

---

## Pending Review

### Editorial / structural — decisions for Matt (NOT yet applied)
These were identified in the audit but involve merging/reordering entries (which renumbers the 365-day plan) rather than fixing a field, so they are held for a deliberate editorial pass. **Caution:** several of the audit's "verbatim-identical Voice quote" claims did not hold against the data (the Voice quotes actually differ) and one was wrong (Days 48 & 72 do **not** share the title "The Arian controversy begins" — their titles differ entirely). Each merge must be judged by reading the full bodies, not the audit's cited evidence.
- **Vol 1 two-arc redundancy:** Days 52–73 re-walk 1–51; candidate near-duplicate pairs to merge/differentiate: 28/52, 29/53, 37/55, 38/57?, 39/58, 40/60, 50/51. Confirmed: 51→52 is a hard date reset (325 AD → c. 108 AD).
- **Vol 2:** near-duplicate pairs 75/76, 84/85, 97/98 (confirmed: same scripture + identical closing line), 101/102, 126/127; cross-volume repeats 79–81 vs 41–42, 74 vs 50/51; **Day 135** dated 988 AD inside the 313–600 volume (relocate to Vol 3 or frame as a deliberate flash-forward); **Days 137/138** are both Boethius entries (possible merge).
- **Vol 3:** Days 207≈202 (Hus swan) and 208≈203 (à Kempis) duplicate earlier entries; Day 209 (Council of Constance, 1417) is chronologically stranded after the Joan cluster; pairs 157/158, 181/182.
- **Vol 4:** strong duplicate pairs 228/229, 234/235 (235's note literally reads "Same as Day 234"), 236/237, 241/242, 268/269, 275/276.
- **Vol 5:** "double ending" — day-count addresses at both Day 355 and Day 364 bracket the topical block 356–361 (relocate 356–361 earlier, or move the finale pieces to the very end); near-duplicate pairs 314/315, 327/329, 300/301, 310/311, 312/313, 331/332.

### Stylistic (optional, no action taken)
- The "doubled-line" preaching cadence (a sentence stated then restated) recurs across volumes (e.g., Days 21, 125, 127, 199–207). Confirmed deliberate; flag only any instance that reads as accidental copy-paste.
- Closing-question overuse: ~62% of Vol 1 Weight sections end on a direct second-person question. Consider varying about half.

---

## Notes on Historical Sourcing

Entries where historical tradition rather than primary sources are used are flagged in the `notes.confidence` field:
- `"confidence": "high"` — directly from primary sources or near-contemporaneous accounts
- `"confidence": "medium"` — documented but with caveats noted
- `"confidence": "tradition"` — later tradition; the entry acknowledges this

Days with `"confidence": "tradition"`: 122 (Patrick's Paschal fire), 175 (Wolf of Gubbio).

Days where exact wording is disputed: 202 (Hus swan prophecy), 225 (Luther's door-nailing), 230 (Here I stand exact phrase).

These are already flagged appropriately in the entry text. No correction needed unless a specific inaccuracy is identified.
