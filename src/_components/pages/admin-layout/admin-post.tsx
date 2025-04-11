'use client'

import React, { useState } from 'react'
import { ArrowLeft, Edit, Filter, X } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { useFetchCategories, useFetchNews, useFetchTags } from '@/network/http-service/news.hooks'
import { NewsFilterDTO } from '@/app/(server)/modules/news/news.types'
import { SkeletonLoader } from '@/_components/pages/admin-layout/admin-post-skeleton'
import { Pagination } from '@/_components/pages/admin-layout/admin-pagination'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { AdminRoutes } from '../../../lib/routes/admin'

const AdminPostMainComponent = () => {
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<NewsFilterDTO>({
    published: null,
    searchTerm: null,
    categoryIds: [],
    tagIds: [],
  })
  const limit = 20

  // Fetch news with pagination and filters
  const { data: newsData, isLoading, error } = useFetchNews(filters, page, limit)
  const { data: categoryData, isLoading: categoriesIsLoading } = useFetchCategories()
  const { data: tagsData, isLoading: tagsIsLoading } = useFetchTags()

  const posts = newsData?.data || []
  const meta = newsData?.meta

  // Filter handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value || null }))
    setPage(1)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilters((prev) => ({
      ...prev,
      published: value === 'published' ? true : value === 'draft' ? false : null,
    }))
    setPage(1)
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, authorId: e.target.value || null }))
    setPage(1)
  }

  const handleCategorySelect = (categoryId: number) => {
    setFilters((prev) => {
      const currentCategoryIds = prev.categoryIds || []
      const newCategoryIds = currentCategoryIds.includes(categoryId)
        ? currentCategoryIds.filter((id) => id !== categoryId)
        : [...currentCategoryIds, categoryId]

      return { ...prev, categoryIds: newCategoryIds }
    })
    setPage(1)
  }

  const handleTagSelect = (tagId: number) => {
    setFilters((prev) => {
      const currentTagIds = prev.tagIds || []
      const newTagIds = currentTagIds.includes(tagId)
        ? currentTagIds.filter((id) => id !== tagId)
        : [...currentTagIds, tagId]

      return { ...prev, tagIds: newTagIds }
    })
    setPage(1)
  }

  const removeCategory = (categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: (prev.categoryIds || []).filter((id) => id !== categoryId),
    }))
    setPage(1)
  }

  const removeTag = (tagId: number) => {
    setFilters((prev) => ({
      ...prev,
      tagIds: (prev.tagIds || []).filter((id) => id !== tagId),
    }))
    setPage(1)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setFilters({
      published: null,
      searchTerm: null,
      categoryIds: [],
      tagIds: [],
    })
    setPage(1)
  }

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <AppLink
              href={AdminRoutes.home}
              className="inline-flex items-center text-sm text-gray-600 hover:text-primaryGreen mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </AppLink>
            <h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={toggleFilters}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <AppLink
              href={AdminRoutes.createNews}
              className="bg-black hover:bg-primaryGreen/90 text-white px-4 py-2 rounded-md transition-all duration-200 font-medium flex items-center shadow-sm hover:shadow"
            >
              <Edit className="h-4 w-4 mr-2" />
              Create New Post
            </AppLink>
          </div>
        </div>

        {/* Search Bar - Always visible */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen"
                onChange={handleSearchChange}
                value={filters.searchTerm || ''}
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters - Toggleable */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex flex-col md:flex-row gap-2 flex-1">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen bg-white"
                  onChange={handleStatusChange}
                  value={
                    filters.published === true
                      ? 'published'
                      : filters.published === false
                        ? 'draft'
                        : ''
                  }
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen bg-white"
                  onChange={handleAuthorChange}
                  value={filters.authorId || ''}
                >
                  <option value="">All Authors</option>
                  {/* This would ideally be populated from an API */}
                </select>

                {/* Categories Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      Categories
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {!categoriesIsLoading &&
                          categoryData?.map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.name}
                              onSelect={() => handleCategorySelect(category.id)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  filters.categoryIds?.includes(category.id)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {category.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Tags Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      Tags
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search tags..." />
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {!tagsIsLoading &&
                          tagsData?.map((tag) => (
                            <CommandItem
                              key={tag.id}
                              value={tag.name}
                              onSelect={() => handleTagSelect(tag.id)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  filters.tagIds?.includes(tag.id) ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {tag.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-primaryGreen"
              >
                Clear Filters
              </button>
            </div>

            {/* Selected filters display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.categoryIds && filters.categoryIds.length > 0 && categoryData && (
                <>
                  {filters.categoryIds.map((categoryId) => {
                    const category = categoryData.find((c) => c.id === categoryId)
                    return category ? (
                      <Badge key={`cat-${categoryId}`} variant="secondary" className="px-2 py-1">
                        {category.name}
                        <button
                          onClick={() => removeCategory(categoryId)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </>
              )}

              {filters.tagIds && filters.tagIds.length > 0 && tagsData && (
                <>
                  {filters.tagIds.map((tagId) => {
                    const tag = tagsData.find((t) => t.id === tagId)
                    return tag ? (
                      <Badge key={`tag-${tagId}`} variant="outline" className="px-2 py-1">
                        {tag.name}
                        <button
                          onClick={() => removeTag(tagId)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </>
              )}
            </div>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="p-6">
              <SkeletonLoader />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading posts. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Published Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Views
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Updated
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No posts found
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {post.title.length > 40
                                  ? `${post.title.substring(0, 40)}...`
                                  : post.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {post.summary
                                  ? post.summary.length > 60
                                    ? `${post.summary.substring(0, 60)}...`
                                    : post.summary
                                  : 'No summary available'}
                              </div>
                              <div className="text-xs text-gray-400">
                                Slug:{' '}
                                {post.slug.length > 30
                                  ? `${post.slug.substring(0, 30)}...`
                                  : post.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.pubDate
                            ? new Date(post.pubDate).toLocaleDateString()
                            : 'Not published'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-medium">{post?.analytics?.views || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.lastUpdated
                            ? new Date(post.lastUpdated).toLocaleDateString()
                            : 'N/A'}
                          <div className="text-xs text-gray-400">
                            Created: {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <AppLink
                              href={`/admin/posts/edit/${post.slug}`}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                            >
                              Edit
                            </AppLink>
                            <AppLink
                              href={`/news/${post.slug}`}
                              className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded"
                              target="_blank"
                            >
                              View
                            </AppLink>
                            <button className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && (
            <Pagination
              currentPage={page}
              totalPages={meta?.pageCount || 1}
              totalItems={meta?.totalCount || 0}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default AdminPostMainComponent
