'use client'

import React from 'react'
import { BarChart2, Clock, ExternalLink, Lock, Eye, MessageSquare, ThumbsUp } from 'lucide-react'
import {
  useFetchAnalyticsSummary,
  useFetchPopularNews,
} from '@/network/http-service/analytics.hooks'
import { Skeleton } from '@/_components/global/skeleton'
import { AppLink } from '@/_components/global/app-link'

export const AdminAnalyticsComponent = () => {
  const { data: analyticsSummary, isLoading } = useFetchAnalyticsSummary()
  const { data: popularNews, isLoading: isLoadingPopularNews } = useFetchPopularNews()

  // Format the analytics data for display
  const analyticsData = {
    summary: [
      {
        id: 1,
        title: 'Total Page Views',
        value: analyticsSummary?.totalViews.toLocaleString() || '0',
        icon: <Eye className="h-6 w-6 text-blue-500" />,
      },
      {
        id: 2,
        title: 'Total Articles',
        value: analyticsSummary?.totalNews.toLocaleString() || '0',
        icon: <BarChart2 className="h-6 w-6 text-green-500" />,
      },
      {
        id: 3,
        title: 'Published Articles',
        value: analyticsSummary?.totalNewsPublished.toLocaleString() || '0',
        icon: <Clock className="h-6 w-6 text-purple-500" />,
      },
      {
        id: 4,
        title: 'Total Comments',
        value: analyticsSummary?.totalComments.toLocaleString() || '0',
        icon: <MessageSquare className="h-6 w-6 text-orange-500" />,
      },
    ],
    trafficSources: [
      { id: 1, source: 'Organic Search', percentage: 42, color: 'bg-blue-500' },
      { id: 2, source: 'Social Media', percentage: 28, color: 'bg-purple-500' },
      { id: 3, source: 'Direct', percentage: 18, color: 'bg-green-500' },
      { id: 4, source: 'Referral', percentage: 12, color: 'bg-yellow-500' },
    ],
  }

  // Always perform nullish check for data that would come from API
  const analytics = analyticsData ?? {
    summary: [],
    trafficSources: [],
  }

  // Calculate engagement rate for each post
  const processedPopularNews = React.useMemo(() => {
    if (!popularNews) return []

    return popularNews.map((post) => {
      // Get the publish date or creation date
      const publishDate = new Date(post.news.pubDate || post.news.createdAt);
      const currentDate = new Date();

      // Calculate days since publication
      const daysSincePublished = Math.max(
        1,
        Math.floor((currentDate.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      // Calculate engagement rate as views per day since publication
      const calculatedEngagementRate =
        post.views > 0
          ? Math.round((post.views / daysSincePublished) * 100) / 100 // Views per day with 2 decimal precision
          : 0;

      return {
        ...post,
        engagementRate: calculatedEngagementRate,
        publishedAt: post.news.pubDate || post.news.createdAt,
      }
    })
  }, [popularNews])

  return (
    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        </div>

        {/* Mixpanel Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
          <div className="bg-white/60 backdrop-blur-md border border-blue-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 p-2">
                  <BarChart2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Advanced Analytics Available
                  </h3>
                  <p className="text-sm text-gray-500">
                    View detailed user behavior, conversion funnels, and custom event tracking
                  </p>
                </div>
              </div>
              <AppLink
                href="https://mixpanel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                View on Mixpanel
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </AppLink>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? // Show skeletons while loading
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="bg-white overflow-hidden shadow">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Skeleton className="h-6 w-6 rounded-full" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))
              : analytics.summary.map((item) => (
                  <div key={item.id} className="bg-white overflow-hidden shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">{item.icon}</div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {item.title}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{item.value}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Popular Posts */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Popular Posts</h2>
            <div className="mt-2 bg-white shadow overflow-hidden rounded-lg">
              {isLoadingPopularNews ? (
                <div className="p-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {processedPopularNews && processedPopularNews.length > 0 ? (
                    processedPopularNews.map((post, index) => (
                      <li
                        key={post.news.id || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-primaryGreen truncate">
                              {post.news.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold bg-green-100 text-green-800 rounded-full">
                                {post.engagementRate ? `${post.engagementRate}% engagement` : '--%'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex space-x-4">
                              <p className="flex items-center text-sm text-gray-500">
                                <Eye className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {post.views?.toLocaleString() || 0} views
                              </p>
                              {post.likes !== undefined && (
                                <p className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                                  <ThumbsUp className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {post.likes.toLocaleString()} likes
                                </p>
                              )}
                            </div>
                            {post.news.pubDate && (
                              <p className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-5 text-center text-sm text-gray-500">
                      No popular posts data available
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Traffic Sources - Blurred */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Traffic Sources</h2>
            <div className="mt-2 bg-white shadow overflow-hidden relative rounded-lg">
              <div className="px-4 py-5 sm:p-6 filter blur-sm">
                {analytics.trafficSources.map((source) => (
                  <div key={source.id} className="mt-4 first:mt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">{source.source}</div>
                      <div className="text-sm font-medium text-gray-500">{source.percentage}%</div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 h-2.5 rounded-full">
                      <div
                        className={`${source.color} h-2.5 rounded-full`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <div className="text-center">
                  <Lock className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Detailed Traffic Analytics
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View complete traffic source breakdown with geographic data
                  </p>
                  <div className="mt-4">
                    <AppLink
                      href="https://mixpanel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      View on Mixpanel
                      <ExternalLink className="ml-1.5 h-4 w-4" />
                    </AppLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
