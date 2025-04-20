import React from 'react'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { createServerAxiosInstance } from '@/network/server.constructor'
import { routes } from '@/network/route'
import { SiteConfigQueryKey } from '@/network/query-keys/site-config'
import { logger } from '@/lib/utils/logger'

// Layout components
import GlobalSocialBanner from '@/_components/public/social-banner'
import MainNavBanner from '@/_components/public/main-nav-banner'
import HeroNavigation from '@/_components/public/hero-navigation'
import HeroTags from '@/_components/public/hero-tags'
import { NewsBanner } from '@/_components/public/news-top-banner'
import Footer from '@/_components/public/main-public-footer'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  try {
    // Prefetch site configuration data
    await queryClient.prefetchQuery({
      queryKey: [SiteConfigQueryKey.SITE_CONFIG],
      queryFn: async () => {
        try {
          const response = await createServerAxiosInstance(routes.siteConfig.get)
          if (!response) {
            throw new Error('Site configuration not found')
          }
          return response.data
        } catch (error) {
          logger.error('Error fetching site configuration:', error)
          throw error
        }
      },
    })

    const dehydratedState = dehydrate(queryClient)

    return renderLayout(children, dehydratedState)
  } catch (error) {
    logger.error('Failed to load public layout:', error)
    return renderLayout(children)
  }
}

// Helper function to render the layout with or without hydrated state
function renderLayout(children: React.ReactNode, dehydratedState?: unknown) {
  return (
    <div className="relative">
      {dehydratedState ? (
        <HydrationBoundary state={dehydratedState}>
          <LayoutContent>{children}</LayoutContent>
        </HydrationBoundary>
      ) : (
        <LayoutContent>{children}</LayoutContent>
      )}
    </div>
  )
}

// Layout content component to avoid duplication
function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalSocialBanner />
      <MainNavBanner />
      <HeroNavigation />
      <HeroTags />
      <NewsBanner title="Breaking News" />
      <div className="overflow-hidden">{children}</div>
      <Footer />
    </>
  )
}
