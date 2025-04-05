import React from 'react'
import { FileText, MessageSquare, Users, Edit, ArrowRight, BarChart2 } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'

const blogStats = {
  totalPosts: 42,
  publishedPosts: 38,
  draftPosts: 4,
  totalViews: 12580,
  totalComments: 256,
}

const stats = blogStats ?? {
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  totalViews: 0,
  totalComments: 0,
}

/**
 * Formats a number with appropriate suffixes for better readability
 * @param num The number to format
 * @returns Formatted number string
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export const AdminMainComponent = () => {
  return (
    <main className="flex-1 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2 border-gray-200">
          Dashboard Overview
        </h2>

        {/* Stats Overview - Compact Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                  Total Posts
                </h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="p-1.5 bg-gray-100 rounded-md">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-2 text-xs">
              <span className="text-gray-600 font-medium">+{stats.draftPosts} drafts</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                  Published
                </h3>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
              </div>
              <div className="p-1.5 bg-gray-100 rounded-md">
                <Edit className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-2 text-xs">
              <span className="text-gray-600 font-medium">
                {Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% of total
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                  Total Views
                </h3>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
              </div>
              <div className="p-1.5 bg-gray-100 rounded-md">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-2 text-xs">
              <span className="text-gray-600 font-medium">
                ~{Math.round(stats.totalViews / stats.publishedPosts)} per post
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                  Comments
                </h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
              </div>
              <div className="p-1.5 bg-gray-100 rounded-md">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-2 text-xs">
              <span className="text-gray-600 font-medium">
                {((stats.totalComments / stats.totalViews) * 100).toFixed(1)}% engagement
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions - More Compact */}
        <h2 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <AppLink
            href="/admin/posts"
            className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md hover:border-primaryGreen/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-gray-100 rounded-full w-fit mb-3 group-hover:bg-primaryGreen/10">
              <Edit className="h-4 w-4 text-gray-600 group-hover:text-primaryGreen" />
            </div>
            <h3 className="text-gray-900 text-sm font-medium mb-1">Manage Posts</h3>
            <p className="text-gray-600 text-xs mb-2">Edit, delete, or update posts</p>
            <span className="text-primaryGreen text-xs font-medium flex items-center">
              View <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </AppLink>

          <AppLink
            href="/admin/comments"
            className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md hover:border-primaryGreen/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-gray-100 rounded-full w-fit mb-3 group-hover:bg-primaryGreen/10">
              <MessageSquare className="h-4 w-4 text-gray-600 group-hover:text-primaryGreen" />
            </div>
            <h3 className="text-gray-900 text-sm font-medium mb-1">Manage Comments</h3>
            <p className="text-gray-600 text-xs mb-2">Approve, reject comments</p>
            <span className="text-primaryGreen text-xs font-medium flex items-center">
              View <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </AppLink>

          <AppLink
            href="/admin/analytics"
            className="bg-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-md hover:border-primaryGreen/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-gray-100 rounded-full w-fit mb-3 group-hover:bg-primaryGreen/10">
              <BarChart2 className="h-4 w-4 text-gray-600 group-hover:text-primaryGreen" />
            </div>
            <h3 className="text-gray-900 text-sm font-medium mb-1">Analytics</h3>
            <p className="text-gray-600 text-xs mb-2">View site performance</p>
            <span className="text-primaryGreen text-xs font-medium flex items-center">
              View <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </AppLink>
        </div>

        {/* Recent Activity - Streamlined */}
        <h2 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-sm text-gray-700">Latest Comments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              {
                id: 1,
                post: 'How to optimize your blog',
                comment: 'Great article! I learned a lot from this.',
                time: '2h ago',
                user: 'Sarah J.',
              },
              {
                id: 2,
                post: '10 SEO tips for bloggers',
                comment: 'This is exactly what I needed. Thanks for sharing!',
                time: '5h ago',
                user: 'Michael C.',
              },
              {
                id: 3,
                post: 'Building an audience',
                comment: "I've implemented these strategies with great results.",
                time: '1d ago',
                user: 'Emma W.',
              },
            ].map((item) => (
              <div key={item.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-medium">
                      {item.user.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-xs font-medium text-gray-900">{item.user}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      On <span className="font-medium">&quot;{item.post}&quot;</span>
                    </p>
                    <p className="text-xs text-gray-800 mt-1 italic bg-gray-50 p-1.5 rounded-md border-l-2 border-gray-300">
                      &quot;{item.comment}&quot;
                    </p>
                    <div className="mt-1.5 flex space-x-2">
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 transition-colors">
                        Reply
                      </button>
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <AppLink
              href="/admin/comments"
              className="text-xs text-gray-700 hover:text-primaryGreen font-medium flex items-center"
            >
              View all comments
              <ArrowRight className="h-3 w-3 ml-1" />
            </AppLink>
          </div>
        </div>
      </div>
    </main>
  )
}
