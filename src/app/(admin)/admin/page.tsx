import React from 'react'
import { AppLogo } from '@/_components/global/app-logo'


/**
 * Admin Dashboard Page
 *
 * This page serves as the main admin dashboard for the blog website.
 * It provides an overview of blog statistics and quick access to admin functions.
 */
export default function AdminDashboard() {
  // Simulated data - in a real app, this would come from an API
  const blogStats = {
    totalPosts: 42,
    publishedPosts: 38,
    draftPosts: 4,
    totalViews: 12580,
    totalComments: 256
  }

  // Always perform nullish check for data that would come from API
  const stats = blogStats ?? {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0
  }

  return (
    <div className="min-h-screen bg-background text-gray-900">
      {/* Admin Header */}
      <header className="bg-primaryGreen p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AppLogo />
            <h1 className="text-white text-2xl font-bold ml-2">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-primaryGreen px-4 py-2 rounded-md hover:bg-opacity-90 transition">
              New Post
            </button>
            <div className="w-10 h-10 rounded-full bg-primaryDark flex items-center justify-center text-white">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-secondaryBg p-6 rounded-lg shadow-sm">
            <h3 className=" text-lg font-medium mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-primaryGreen">{stats.totalPosts}</p>
          </div>
          <div className="bg-secondaryBg p-6 rounded-lg shadow-sm">
            <h3 className="text-black text-lg font-medium mb-2">Published</h3>
            <p className="text-3xl font-bold text-primaryGreen">{stats.publishedPosts}</p>
          </div>
          <div className="bg-secondaryBg p-6 rounded-lg shadow-sm">
            <h3 className="text-textColor text-lg font-medium mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-primaryGreen">{stats.totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-secondaryBg p-6 rounded-lg shadow-sm">
            <h3 className="text-textColor text-lg font-medium mb-2">Comments</h3>
            <p className="text-3xl font-bold text-primaryGreen">{stats.totalComments}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-secondaryBg p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="text-textColor text-xl font-medium mb-4">Manage Posts</h3>
            <p className="text-textColor opacity-75">Edit, delete, or update your blog posts</p>
          </div>
          <div className="bg-secondaryBg p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="text-textColor text-xl font-medium mb-4">Manage Comments</h3>
            <p className="text-textColor opacity-75">Approve, reject, or respond to comments</p>
          </div>
          <div className="bg-secondaryBg p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="text-textColor text-xl font-medium mb-4">Site Settings</h3>
            <p className="text-textColor opacity-75">Update your blog settings and appearance</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-secondaryBg p-6 rounded-lg shadow-sm">
          <h2 className="text-textColor text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-textColor font-medium">New comment on &quot;How to optimize your blog&quot;</h4>
                  <span className="text-sm text-textColor opacity-75">2 hours ago</span>
                </div>
                <p className="text-textColor opacity-75 mt-1">Great article! I learned a lot from this.</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
