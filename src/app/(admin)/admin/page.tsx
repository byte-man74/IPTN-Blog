import React from 'react'
import Link from 'next/link'
import { FileText, MessageSquare, Users, Settings, Edit, ArrowRight } from 'lucide-react'

/**
 * Admin Dashboard Page
 *
 * This page serves as the main admin dashboard for the blog website.
 * It provides an overview of blog statistics, quick access to admin functions,
 * and navigation to other admin areas.
 */
export default function AdminDashboard() {
  const blogStats = {
    totalPosts: 42,
    publishedPosts: 38,
    draftPosts: 4,
    totalViews: 12580,
    totalComments: 256
  }

  const stats = blogStats ?? {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0
  }

  /**
   * Formats a number with appropriate suffixes for better readability
   * @param num The number to format
   * @returns Formatted number string
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Side Navigation and Main Content */}
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2 border-gray-200">Dashboard Overview</h2>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-all duration-200 border border-gray-100 transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Posts</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-md">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600 font-medium flex items-center">
                    +{stats.draftPosts} drafts
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-all duration-200 border border-gray-100 transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Published</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.publishedPosts}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-md">
                    <Edit className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    {Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% of total
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-all duration-200 border border-gray-100 transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Views</h3>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-md">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    ~{Math.round(stats.totalViews / stats.publishedPosts)} per post
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-all duration-200 border border-gray-100 transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Comments</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalComments}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-md">
                    <MessageSquare className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    {(stats.totalComments / stats.totalViews * 100).toFixed(1)}% engagement
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2 border-gray-200">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group transform hover:-translate-y-1">
                <div className="p-3 bg-gray-100 rounded-full w-fit mb-4 group-hover:bg-gray-200 transition-colors">
                  <Edit className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-medium mb-2">Manage Posts</h3>
                <p className="text-gray-600">Edit, delete, or update your blog posts</p>
                <div className="mt-4">
                  <Link href="/admin/posts" className="text-primaryGreen font-medium text-sm hover:text-primaryGreen/80 group-hover:underline transition-colors flex items-center">
                    Go to posts <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group transform hover:-translate-y-1">
                <div className="p-3 bg-gray-100 rounded-full w-fit mb-4 group-hover:bg-gray-200 transition-colors">
                  <MessageSquare className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-medium mb-2">Manage Comments</h3>
                <p className="text-gray-600">Approve, reject, or respond to comments</p>
                <div className="mt-4">
                  <Link href="/admin/comments" className="text-primaryGreen font-medium text-sm hover:text-primaryGreen/80 group-hover:underline transition-colors flex items-center">
                    Go to comments <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group transform hover:-translate-y-1">
                <div className="p-3 bg-gray-100 rounded-full w-fit mb-4 group-hover:bg-gray-200 transition-colors">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-medium mb-2">Site Settings</h3>
                <p className="text-gray-600">Update your blog settings and appearance</p>
                <div className="mt-4">
                  <Link href="/admin/settings" className="text-primaryGreen font-medium text-sm hover:text-primaryGreen/80 group-hover:underline transition-colors flex items-center">
                    Go to settings <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2 border-gray-200">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Latest Comments</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  {
                    id: 1,
                    post: "How to optimize your blog",
                    comment: "Great article! I learned a lot from this.",
                    time: "2 hours ago",
                    user: "Sarah Johnson"
                  },
                  {
                    id: 2,
                    post: "10 SEO tips for bloggers",
                    comment: "This is exactly what I needed. Thanks for sharing these insights!",
                    time: "5 hours ago",
                    user: "Michael Chen"
                  },
                  {
                    id: 3,
                    post: "Building an audience for your blog",
                    comment: "I've implemented these strategies and seen great results already.",
                    time: "1 day ago",
                    user: "Emma Williams"
                  }
                ].map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium shadow-sm">
                          {item.user.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{item.user}</p>
                          <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Commented on <span className="font-medium">&quot;{item.post}&quot;</span>
                        </p>
                        <p className="text-sm text-gray-800 mt-2 italic bg-gray-50 p-2 rounded-md border-l-2 border-gray-300">&quot;{item.comment}&quot;</p>
                        <div className="mt-2 flex space-x-3">
                          <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 transition-colors">Reply</button>
                          <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 transition-colors">View</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <Link href="/admin/comments" className="text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center justify-center md:justify-start">
                  View all comments
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
