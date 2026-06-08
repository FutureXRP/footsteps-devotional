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
