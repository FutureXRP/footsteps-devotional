import type { MetadataRoute } from 'next'
import { getLiveSeries } from '@/lib/series'
import { getSeriesEntries } from '@/lib/series-data'
import { SITE_URL } from '@/lib/site'

// Enumerates the library plus every live series and all its entries. New series
// appear automatically as they go live — no edits here.
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
  ]

  for (const s of getLiveSeries()) {
    urls.push({ url: `${SITE_URL}/${s.slug}`, changeFrequency: 'monthly', priority: 0.9 })
    urls.push({ url: `${SITE_URL}/${s.slug}/journey`, changeFrequency: 'monthly', priority: 0.8 })
    for (const e of getSeriesEntries(s.slug)) {
      urls.push({ url: `${SITE_URL}/${s.slug}/entry/${e.day}`, changeFrequency: 'yearly', priority: 0.7 })
    }
  }

  return urls
}
