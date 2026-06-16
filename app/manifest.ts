import type { MetadataRoute } from 'next'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

// Web app manifest, served at /manifest.webmanifest. This is what lets the
// site be added to a phone's home screen and launch chromeless ("standalone"),
// behaving like a native app. The dark background_color gives a cohesive,
// branded launch/splash screen on Android.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Footsteps',
    description: SITE_DESCRIPTION,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#12100E',
    theme_color: '#12100E',
    lang: 'en-US',
    dir: 'ltr',
    categories: ['books', 'education', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
