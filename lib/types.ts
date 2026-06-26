export interface EntryNotes {
  primary: string
  tradition: string | null
  archaeological: string | null
  confidence: 'high' | 'medium' | 'tradition'
}

// Optional leadership-development lens for series like Biblical Leadership.
// Adapted from the PassageLab "leadership" study structure.
export interface LeadershipLens {
  principle: string // the distilled, carry-it-all-week thesis
  innerLife: string // who a leader must be (character, motive, identity)
  leadingThroughIt: string // concrete application to leading people
  blindSpot: string // what those in authority resist or miss here
  weeklyPractice: string // one concrete practice for the week
  teamQuestions: string[] // discussion questions for a leadership team
  difficultConversations?: string // what this gives you for a hard conversation
}

// Optional spiritual-formation lens for the Spiritual Formation series.
// Where the leadership lens is team/organizational, this one is interior and
// personal: great content + a biblical tie-in that always lands in personal
// reflection (the user's brief). Unique fields, never a copy of the leadership lens.
export interface FormationLens {
  invitation: string // the single carry-it-with-you invitation — what God is forming in you here
  interiorWork: string // what must change in the soul: desire, the hidden self, the heart's loves
  practice: string // one concrete spiritual practice to engage (prayer, silence, examen, fasting, lectio, solitude, service)
  resistance: string // the tempter's angle — what the flesh, the world, or the enemy uses to derail this
  reflection: string[] // personal examen questions for the individual soul (not a team)
  prayer?: string // a short prayer to carry, in the reader's own voice
}

// Optional "upheaval" lens for The Upheaval series. Holds BOTH dimensions of
// upheaval — personal and ecclesial/communal — and locates the moment within the
// four phases of any upheaval: disconnect, disorientation, reorientation,
// reconnect. Built on Phyllis Tickle's "rummage sale" framework and Bill Hybels'
// "holy discontent" (both paraphrased and attributed, never quoted). Never a copy
// of the formation or leadership lenses.
export interface UpheavalLens {
  thePhase: string // which of the four phases this is — disconnect, disorientation, reorientation, reconnect — and what it asks of us
  inYou: string // THE PERSONAL SECTION — the reader's own faith/life upheaval ONLY. Purely personal; never drifts into the church dimension. Must not be conflated with inTheBody.
  inTheBody: string // THE CHURCH SECTION — the upheaval of the Church AS A WHOLE (the Body of Christ): Western/global Christianity in this cultural moment, the recurring 500-year rummage sale, movements and traditions, the church across history. NOT a single local congregation, and never conflated with the personal (inYou).
  whatRemains: string // what cannot be shaken — the enduring anchor beneath the shaking
  reflection: string[] // questions to ponder in the shaking
  prayer?: string // a short prayer in the shaking
}

export interface Entry {
  day: number
  volume: number
  volumeTitle: string
  volumeSubtitle: string
  volumeYears: string
  title: string
  figure: string
  era: string
  dateLabel: string
  moment: string
  voiceQuote: string
  voiceAttribution: string
  scriptureRef: string
  scriptureText: string
  weight: string
  notes?: EntryNotes
  leadership?: LeadershipLens
  formation?: FormationLens
  upheaval?: UpheavalLens
}

export const VOLUME_COLORS: Record<number, { badge: string; text: string; border: string; dot: string }> = {
  1: { badge: '#FAECE7', text: '#712B13', border: '#D85A30', dot: '#D85A30' },
  2: { badge: '#E6F1FB', text: '#0C447C', border: '#378ADD', dot: '#378ADD' },
  3: { badge: '#FAEEDA', text: '#633806', border: '#EF9F27', dot: '#EF9F27' },
  4: { badge: '#EEEDFE', text: '#3C3489', border: '#7F77DD', dot: '#7F77DD' },
  5: { badge: '#E1F5EE', text: '#085041', border: '#1D9E75', dot: '#1D9E75' },
}

export const VOLUME_RANGES: Record<number, [number, number]> = {
  1: [1, 73],
  2: [74, 146],
  3: [147, 219],
  4: [220, 292],
  5: [293, 365],
}
