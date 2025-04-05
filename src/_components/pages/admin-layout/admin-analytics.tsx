import React from 'react'
import { BarChart2, TrendingUp, Users as UsersIcon, Clock, ExternalLink, Lock } from 'lucide-react'

export const AdminAnalyticsComponent = () => {
  // Simulated data - in a real app, this would come from an API
  const analyticsData = {
    summary: [
      {
        id: 1,
        title: 'Total Page Views',
        value: '124,582',
        change: '+12.3%',
        icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
      },
      {
        id: 2,
        title: 'Unique Visitors',
        value: '45,678',
        change: '+8.7%',
        icon: <UsersIcon className="h-6 w-6 text-green-500" />,
      },
      {
        id: 3,
        title: 'Avg. Session Duration',
        value: '3m 42s',
        change: '+2.1%',
        icon: <Clock className="h-6 w-6 text-purple-500" />,
      },
      {
        id: 4,
        title: 'Conversion Rate',
        value: '3.2%',
        change: '+0.8%',
        icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
      },
    ],
    popularPosts: [
      { id: 1, title: 'How to Optimize Your Blog for SEO', views: 12453, engagement: '87%' },
      { id: 2, title: '10 Writing Tips for Beginner Bloggers', views: 8765, engagement: '92%' },
      { id: 3, title: 'The Future of Content Marketing', views: 7654, engagement: '78%' },
      { id: 4, title: 'Building a Loyal Audience for Your Blog', views: 6543, engagement: '85%' },
      { id: 5, title: 'Monetization Strategies for Bloggers', views: 5432, engagement: '81%' },
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
    popularPosts: [],
    trafficSources: [],
  }

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
              <a
                href="https://mixpanel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                View on Mixpanel
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.summary.map((item) => (
              <div key={item.id} className="bg-white overflow-hidden shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.title}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{item.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span
                      className={`font-medium ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {item.change}
                    </span>{' '}
                    <span className="text-gray-500">from previous period</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Posts */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Popular Posts</h2>
            <div className="mt-2 bg-white shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {analytics.popularPosts.map((post) => (
                  <li key={post.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primaryGreen truncate">
                          {post.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold bg-green-100 text-green-800">
                            {post.engagement} engagement
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <BarChart2 className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {post.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Traffic Sources - Blurred */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Traffic Sources</h2>
            <div className="mt-2 bg-white shadow overflow-hidden relative">
              <div className="px-4 py-5 sm:p-6 filter blur-sm">
                {analytics.trafficSources.map((source) => (
                  <div key={source.id} className="mt-4 first:mt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">{source.source}</div>
                      <div className="text-sm font-medium text-gray-500">{source.percentage}%</div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 h-2.5">
                      <div
                        className={`${source.color} h-2.5`}
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
                    <a
                      href="https://mixpanel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      View on Mixpanel
                      <ExternalLink className="ml-1.5 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mt-8 bg-white shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Date Range</h3>
              <div className="mt-4 flex space-x-4">
                <button className="px-4 py-2 border border-transparent text-sm font-medium text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  Last 7 days
                </button>
                <button className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  Last 30 days
                </button>
                <button className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  Last 90 days
                </button>
                <button className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  Custom Range
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
