import type { MetadataRoute } from 'next'
import { getLiveSeries } from '@/lib/series'
import { SITE_URL } from '@/lib/site'

// Allow crawling, keep each series' personal /bookmarks page out of the index,
// and advertise the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: getLiveSeries().map((s) => `/${s.slug}/bookmarks`),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
