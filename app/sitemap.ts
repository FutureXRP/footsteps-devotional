import type { MetadataRoute } from 'next'
import { getAllEntries } from '@/lib/entries'
import { SITE_URL } from '@/lib/site'

// Generates /sitemap.xml at build time: the homepage, the journey index,
// and every one of the 365 entry pages. The personal /bookmarks page is
// intentionally omitted — it has no server-rendered content to index.
export default function sitemap(): MetadataRoute.Sitemap {
  const entryUrls: MetadataRoute.Sitemap = getAllEntries().map((entry) => ({
    url: `${SITE_URL}/entry/${entry.day}`,
    changeFrequency: 'yearly',
    priority: 0.7,
  }))

  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/journey`, changeFrequency: 'monthly', priority: 0.8 },
    ...entryUrls,
  ]
}
