# The Footsteps Devotional

A 365-day journey through two thousand years of church history. Built with Next.js, deployed on Vercel.

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

### First time

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the GitHub repo
4. Click Deploy — no settings to change, Vercel detects Next.js automatically

That's it. Live in 60 seconds.

### Every time you add new entries

1. Add entries to `data/entries.json`
2. `git add . && git commit -m "Add days X-Y" && git push`
3. Vercel auto-deploys in about 30 seconds

---

## Adding new devotional entries

All content lives in `data/entries.json`. Each entry follows this shape:

```json
{
  "day": 3,
  "volume": 1,
  "volumeTitle": "Blood & Fire",
  "volumeSubtitle": "The Early Church",
  "volumeYears": "30–313 AD",
  "title": "The entry title",
  "figure": "Person or event name",
  "era": "Location or context",
  "dateLabel": "c. 30 AD",
  "moment": "The historical scene. Use double newlines for paragraph breaks.",
  "voiceQuote": "The quote without quotation marks",
  "voiceAttribution": "Name, Source, Date",
  "scriptureRef": "Acts 2:38",
  "scriptureText": "The scripture text without quotation marks",
  "weight": "The reflection. Use double newlines for paragraph breaks."
}
```

Paragraphs in `moment` and `weight` are separated by `\n\n` in the JSON string.

---

## Volume structure

| Volume | Title | Era | Days |
|--------|-------|-----|------|
| 1 | Blood & Fire | The Early Church, 30–313 AD | 1–73 |
| 2 | Councils & Confessions | The Age of Doctrine, 313–600 AD | 74–146 |
| 3 | Darkness & Light | The Medieval Church, 600–1400 AD | 147–219 |
| 4 | Here I Stand | The Reformation, 1400–1650 AD | 220–292 |
| 5 | Fire in the World | The Modern Church, 1650–Present | 293–365 |

---

## Adding auth + paywall later

When ready to go public:

1. Add Supabase — swap `data/entries.json` for a Supabase table
2. Add Clerk or Supabase Auth for user accounts
3. Add Stripe for paywall (Volumes 2–5)
4. Deploy to Vercel Pro with a custom domain

The reading experience and all components stay exactly as they are.

---

*Matt & Georgia Blair · footstepsbibleapp.com*
