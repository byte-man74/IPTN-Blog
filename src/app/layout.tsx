import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Tiro_Devanagari_Hindi } from 'next/font/google'
import { NextAuthProvider } from '@/providers/session-provider'
import ReactQueryProvider from '@/providers/query-client-provider'
import './globals.css'
import { ErrorProvider } from '@/providers/error-provider'
import { Toaster } from '@/components/ui/toaster'
import { MixpanelProvider } from '@/lib/third-party/mixpanel/provider'
import { SignInProvider } from '@/providers/signin-provider'
import { AppLogo } from '@/_components/global/app-logo'
import { Suspense } from 'react'

/**
 * Font configuration for the application
 * Using Geist Sans as the primary font and Geist Mono for code blocks
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

/**
 * Tiro Devanagari Hindi font for multilingual content
 */
const tiroDevanagari = Tiro_Devanagari_Hindi({
  weight: ['400'],
  subsets: ['latin', 'devanagari'],
  display: 'swap',
  variable: '--font-tiro-devanagari',
})

// Get the domain from environment variables
const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipledgenigeria.com'

/**
 * Metadata configuration for SEO
 */
export const metadata: Metadata = {
  title: 'IPledge to Nigeria | Promoting Patriotism in Nigeria 🇳🇬',
  description:
    'Your go-to media hub for breaking news, untold Nigerian stories, and insightful interviews. Promoting patriotism in the average Nigerian.',
  keywords: [
    'Nigeria news',
    'Nigerian patriotism',
    'Nigerian stories',
    'Nigeria media',
    'Nigerian interviews',
    'IPledge to Nigeria',
    'Breaking news Nigeria',
    'Nigerian journalism',
  ],
  authors: [{ name: 'IPledge to Nigeria Team' }],
  creator: 'IPledge to Nigeria',
  publisher: 'IPledge to Nigeria',
  openGraph: {
    title: 'IPledge to Nigeria | Promoting Patriotism in Nigeria 🇳🇬',
    description:
      'Your go-to media hub for breaking news, untold Nigerian stories, and insightful interviews.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'IPledge to Nigeria',
    url: domain,
    images: [
      {
        url: `${domain}/assets/og-imag.png`, // Replace with actual image path
        width: 1200,
        height: 630,
        alt: 'IPledge to Nigeria - Promoting Patriotism',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPledge to Nigeria | Promoting Patriotism 🇳🇬',
    description:
      'Your go-to media hub for breaking news, untold Nigerian stories, and insightful interviews.',
    images: [`${domain}/assets/twitter.png`], // Replace with actual image path
    creator: '@ipledgenigeria', // Replace with actual Twitter handle
  },
  alternates: {
    canonical: domain,
  },
  metadataBase: new URL(domain),
}

/**
 * Generate structured data for the website
 */
function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'IPledge to Nigeria',
    url: domain,
    logo: `${domain}/assets/iptn-black.webp`,
    sameAs: [
      'https://twitter.com/ipledgenigeria',
      'https://facebook.com/ipledgenigeria',
      'https://instagram.com/ipledge2nigeriatv',
    ],
    description:
      'Your go-to media hub for breaking news, untold Nigerian stories, and insightful interviews. Promoting patriotism in the average Nigerian.',
    foundingDate: '2013',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Nigeria',
    },
  }
}

/**
 * Root layout component that wraps all pages
 * Provides global styling and structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${tiroDevanagari.variable}`}
    >
      <head>
        <link rel="icon" href="/assets/favicon.svg" sizes="any" />
        <meta name="theme-color" content="#008751" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData()),
          }}
        />
      </head>
      <body className="antialiased">
        <NextAuthProvider>
          <ReactQueryProvider>
            <SignInProvider>
              <ErrorProvider error={null}>
                <MixpanelProvider>
                  <Toaster />
                  <Suspense
                    fallback={
                      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
                        <AppLogo variant="white" width={300} height={100} />
                        <div className="absolute bottom-10 w-full flex justify-center">
                          <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primaryGreen w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="mx-auto max-w-[110rem] relative">{children}</div>
                  </Suspense>
                </MixpanelProvider>
              </ErrorProvider>
            </SignInProvider>
          </ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
