import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Footsteps Devotional — Daily Devotionals',
    template: '%s · The Footsteps Devotional',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'church history',
    'daily devotional',
    '365-day devotional',
    'Christian history',
    'early church',
    'the Reformation',
    'saints and martyrs',
    'Bible reading plan',
  ],
  authors: [{ name: 'Matt Blair' }],
  creator: 'Matt Blair',
  publisher: SITE_NAME,
  category: 'religion',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Footsteps',
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
  // Next emits the standard `mobile-web-app-capable` (honored by Android and
  // iOS 16.4+ via the manifest). Add the legacy Apple flag so older iOS also
  // launches the home-screen icon chromeless, like an app.
  other: {
    'apple-mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Light reading UI is the default across the app; the dark homepage sets
  // its own theme-color via its own viewport export.
  themeColor: '#FAFAF8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
