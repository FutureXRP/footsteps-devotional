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

## Pending Review

*Add items here as they are identified. Format: Day number, brief description of the issue.*

---

## Notes on Historical Sourcing

Entries where historical tradition rather than primary sources are used are flagged in the `notes.confidence` field:
- `"confidence": "high"` — directly from primary sources or near-contemporaneous accounts
- `"confidence": "medium"` — documented but with caveats noted
- `"confidence": "tradition"` — later tradition; the entry acknowledges this

Days with `"confidence": "tradition"`: 122 (Patrick's Paschal fire), 175 (Wolf of Gubbio).

Days where exact wording is disputed: 202 (Hus swan prophecy), 225 (Luther's door-nailing), 230 (Here I stand exact phrase).

These are already flagged appropriately in the entry text. No correction needed unless a specific inaccuracy is identified.
