import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Generates /robots.txt: allow all crawlers, keep the personal /bookmarks
// page out of the index, and advertise the sitemap location.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/bookmarks',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
