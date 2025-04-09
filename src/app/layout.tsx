import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextAuthProvider } from '@/providers/session-provider'
import ReactQueryProvider from '@/providers/query-client-provider'

import './globals.css'

/**
 * Font configuration for the application
 * Using Geist Sans as the primary font and Geist Mono for code blocks
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/**
 * Metadata configuration for SEO
 */
export const metadata: Metadata = {
  title: 'Blog Platform | Share Your Ideas With The World',
  description: 'A modern blogging platform for writers, thinkers, and creators to share their ideas and connect with readers worldwide.',
  keywords: ['blog', 'writing', 'articles', 'content creation'],
  authors: [{ name: 'Blog Platform Team' }],
  creator: 'Blog Platform',
  publisher: 'Blog Platform',
  openGraph: {
    title: 'Blog Platform | Share Your Ideas With The World',
    description: 'A modern blogging platform for writers, thinkers, and creators',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Platform | Share Your Ideas With The World',
    description: 'A modern blogging platform for writers, thinkers, and creators',
  },
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

    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NextAuthProvider>
            <ReactQueryProvider>
              <div className="mx-auto max-w-[140rem]">
                {children ?? <div>Loading...</div>}
              </div>
            </ReactQueryProvider>
          </NextAuthProvider>
      </body>
    </html>
  )
}
