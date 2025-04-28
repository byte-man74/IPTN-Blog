'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Search, ArrowLeft, X, Tag, Filter } from 'lucide-react'
import {
  useFetchNews,
  useFetchPopularTags,
  useFetchCategories,
} from '@/network/http-service/news.hooks'
import { NewsDTO, NewsFilterDTO } from '@/app/(server)/modules/news/news.types'
import { AppLink } from '@/_components/global/app-link'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description'
import NewsScreenFullWidthHero from '@/_components/public/core/news-component/news-screen-full-width-hero'
import { Badge } from '@/components/ui/badge'
import { debounce } from 'lodash'
import { ClientRoutes } from '@/lib/routes/client'
import { useInView } from 'react-intersection-observer'
import { useMixpanel } from '@/lib/third-party/mixpanel/context'

type SearchPageClientProps = {
  initialQuery: string
  initialPage: number
  limit: number
  initialCategory?: string
  initialTag?: string
}

export default function SearchPageClient({
  initialQuery,
  initialPage,
  limit,
  initialCategory = '',
  initialTag = '',
}: SearchPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchBarRef = useRef<HTMLDivElement>(null)
  const { ref: loadMoreRef, inView } = useInView()

  // State for search and pagination
  const [query, setQuery] = useState(initialQuery)
  const [inputValue, setInputValue] = useState(initialQuery) // Separate state for input field
  const [page, setPage] = useState(initialPage)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag || null)
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [allResults, setAllResults] = useState<NewsDTO[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const { trackEvent } = useMixpanel()

  // Fetch categories from API
  const { data: categories = [], isLoading: isLoadingCategories } = useFetchCategories()

  // Fetch popular tags from API
  const { data: popularTags = [], isLoading: isLoadingTags } = useFetchPopularTags()

  // Create filter for search
  const filter: NewsFilterDTO = {
    published: true,
    searchTerm: query || null,
    categorySlug: selectedCategory || undefined,
    tagIds: selectedTagId ? [selectedTagId] : undefined,
  }

  // Fetch search results
  const {
    data: newsData,
    isLoading,
    error,
  } = useFetchNews(
    query || selectedCategory || selectedTagId ? filter : { published: true },
    page,
    limit
  )

  const hasNextPage = newsData?.meta?.nextPage ?? false
  // Update allResults when new data is fetched
  useEffect(() => {
    if (newsData?.data) {
      if (page === 1) {
        setAllResults(newsData.data)
      } else {
        setAllResults((prev) => [...prev, ...newsData.data])
      }
      setIsLoadingMore(false)
    }
  }, [newsData, page, hasNextPage])

  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true)
      setPage((prevPage) => prevPage + 1)
    }
  }, [inView, isLoading, isLoadingMore])

  const meta = newsData?.meta || {
    pageCount: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  }

  // Update URL when search or page changes
  const updateUrlParams = (
    newQuery: string,
    newPage: number = 1,
    category?: string | null,
    tag?: string | null
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }

    params.set('page', newPage.toString())

    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    if (tag) {
      params.set('tag', tag)
    } else {
      params.delete('tag')
    }

    router.push(`${ClientRoutes.explore}?${params.toString()}`, { scroll: false })
  }

  // Debounced search function with tracking
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setQuery(searchTerm)
      setPage(1)
      updateUrlParams(searchTerm, 1, selectedCategory, selectedTag)

      // Track search event if there's a search term
      if (searchTerm) {
        trackEvent({
          eventName: 'User is Searching Content',
          properties: {
            searchTerm,
            category: selectedCategory || 'none',
            tag: selectedTag || 'none',
            page: 1,
          },
        })
      }
    }, 500),
    [selectedCategory, selectedTag, trackEvent]
  )

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  // Clear search
  const handleClearSearch = () => {
    setInputValue('')
    setQuery('')
    setPage(1)
    setSelectedCategory(null)
    setSelectedTag(null)
    setSelectedTagId(null)
    setAllResults([])
    updateUrlParams('', 1, null, null)
  }

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    setPage(1)
    setAllResults([])
    updateUrlParams(query, 1, newCategory, selectedTag)
  }

  // Handle tag selection
  const handleTagSelect = (tag: string, tagId: number) => {
    const newTag = selectedTag === tag ? null : tag
    const newTagId = selectedTag === tag ? null : tagId
    setSelectedTag(newTag)
    setSelectedTagId(newTagId)
    setPage(1)
    setAllResults([])
    updateUrlParams(query, 1, selectedCategory, newTag)
  }

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  // Make search bar sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        if (window.scrollY > 100) {
          searchBarRef.current.classList.add('sticky-search-bar')
        } else {
          searchBarRef.current.classList.remove('sticky-search-bar')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Find tag ID from tag name
  useEffect(() => {
    if (initialTag && popularTags.length > 0) {
      const tag = popularTags.find((t) => t.name === initialTag)
      if (tag) {
        setSelectedTagId(tag.id)
      }
    }
  }, [initialTag, popularTags])

  // Determine if we should show a featured article
  const showFeatured = allResults.length > 0 && !isLoading && !error

  // Function to render news item based on index
  const renderNewsItem = (item: NewsDTO, index: number) => {
    const componentType = index % 5

    switch (componentType) {
      case 0:
        return <NewsWithDescription newsItem={item} maxDescriptionLength={120} />
      case 1:
        return <NewsWithDescription newsItem={item} maxDescriptionLength={100} />
      case 2:
        return <NewsWithDescription newsItem={item} maxDescriptionLength={130} />
      case 4:
        return <NewsWithDescription newsItem={item} maxDescriptionLength={150} />
      default:
        return <NewsWithDescription newsItem={item} maxDescriptionLength={120} />
    }
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 flex flex-col relative">
      {/* Header */}
      <div className="mb-6">
        <AppLink
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primaryGreen mb-3 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </AppLink>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore</h1>
        <p className="text-gray-500 text-lg">Find articles, news, and information</p>
      </div>

      {/* Sticky Search Bar */}
      <div
        ref={searchBarRef}
        className="w-full bg-white z-10 transition-all duration-300 mb-6 pb-4 rounded-lg"
      >
        <div className="relative">
          <div className="relative w-full flex">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for articles, news, topics..."
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen text-base shadow-sm transition-all duration-200"
              value={inputValue}
              onChange={handleInputChange}
            />
            {inputValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory || selectedTag) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {selectedCategory && (
              <Badge
                className="bg-primaryGreen hover:bg-primaryGreen/90 cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm transition-colors duration-200"
                onClick={() => handleCategorySelect(selectedCategory)}
              >
                {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {selectedTag && (
              <Badge
                className="bg-primaryGreen hover:bg-primaryGreen/90 cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm transition-colors duration-200"
                onClick={() => handleTagSelect(selectedTag, selectedTagId || 0)}
              >
                {selectedTag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {(selectedCategory || selectedTag) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-red-500 p-1 h-auto transition-colors duration-200"
                onClick={handleClearSearch}
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          className="mt-4 flex items-center gap-1.5 font-medium rounded-none transition-all duration-200 hover:bg-gray-100"
          onClick={toggleFilters}
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filters Section - Collapsible */}
      {showFilters && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 shadow-sm">
          {/* Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1.5 h-5 bg-primaryGreen rounded-sm mr-2"></span>
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {isLoadingCategories ? (
                <div className="animate-pulse flex gap-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-10 w-24 bg-gray-200 rounded-md"></div>
                    ))}
                </div>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.slug ? 'default' : 'outline'}
                    size="sm"
                    className={`${
                      selectedCategory === category.slug
                        ? 'bg-primaryGreen hover:bg-primaryGreen/90 shadow-md'
                        : 'hover:bg-gray-100'
                    } transition-all duration-200 font-medium`}
                    onClick={() => handleCategorySelect(category.slug || category.name)}
                  >
                    {category.name}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <div className="flex items-center mb-3">
              <Tag className="h-4 w-4 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Popular Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {isLoadingTags ? (
                <div className="animate-pulse flex gap-2">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
                    ))}
                </div>
              ) : (
                popularTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTag === tag.name ? 'default' : 'outline'}
                    className={`px-3 py-1.5 cursor-pointer text-sm transition-all duration-200 ${
                      selectedTag === tag.name
                        ? 'bg-primaryGreen hover:bg-primaryGreen/90 shadow-sm'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleTagSelect(tag.name, tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="flex-grow w-full">
        {/* Search stats */}
        {(query || selectedCategory || selectedTag) && (
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isLoading && page === 1
                ? 'Searching...'
                : error
                  ? 'Error searching'
                  : `Search results ${query ? `for "${query}"` : ''} ${selectedCategory ? `in ${selectedCategory}` : ''} ${selectedTag ? `tagged with ${selectedTag}` : ''}`}
            </h2>
            {!isLoading && !error && (
              <p className="text-gray-600 mt-2 text-lg">
                {meta.totalCount === 0
                  ? 'No results found'
                  : meta.totalCount === 1
                    ? '1 result found'
                    : `${meta.totalCount} results found`}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {query || selectedCategory || selectedTag ? (
          isLoading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse w-full">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 bg-white rounded-lg shadow-md border border-gray-200 w-full">
              <p className="text-xl font-medium mb-3">Error loading search results</p>
              <p className="text-gray-600">Please try again or refine your search query.</p>
              <Button
                onClick={handleClearSearch}
                variant="outline"
                className="mt-4 text-red-500 border-red-500 hover:bg-red-50"
              >
                Reset Search
              </Button>
            </div>
          ) : allResults.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-lg shadow-md border border-gray-200 w-full">
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                No results found {query ? `for "${query}"` : ''}{' '}
                {selectedCategory ? `in ${selectedCategory}` : ''}{' '}
                {selectedTag ? `tagged with ${selectedTag}` : ''}
              </h3>
              <p className="text-gray-600 mb-6">Try different keywords or check your spelling.</p>
              <div className="flex justify-center">
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="text-primaryGreen border-primaryGreen hover:bg-primaryGreen/10 transition-colors duration-200 px-6"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Featured article for first page */}
              {showFeatured && allResults.length > 0 && page === 1 && (
                <div className="mb-10 rounded-lg overflow-hidden shadow-lg w-full">
                  <NewsScreenFullWidthHero newsItems={[allResults[0]]} isLoading={false} />
                </div>
              )}

              {/* Grid of results with alternating styles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {allResults.slice(showFeatured && page === 1 ? 1 : 0).map((post, index) => (
                  <div
                    key={`${post.id}-${index}`}
                    className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg rounded-lg overflow-hidden"
                  >
                    {renderNewsItem(post, index)}
                  </div>
                ))}
              </div>

              {/* Loading more indicator */}
              {isLoadingMore && (
                <div className="mt-8 flex justify-center w-full">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-10 w-40 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              )}

              {/* Load more trigger element */}
              {hasNextPage && !isLoadingMore && (
                <div ref={loadMoreRef} className="h-10 w-full mt-8"></div>
              )}

              {/* End of results message */}
              {!hasNextPage && allResults.length > 0 && (
                <div className="mt-10 text-center text-gray-500 pb-4">
                  <p>You&apos;ve reached the end of the results</p>
                </div>
              )}
            </>
          )
        ) : (
          <div className="p-10 text-center bg-white rounded-lg shadow-md border border-gray-200 w-full">
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              Enter a search term or select a category
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search our articles, news and information by typing in the search box above or
              selecting a category or tag.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={toggleFilters}
                className="flex items-center gap-1.5"
              >
                <Filter className="h-4 w-4" />
                Browse Categories
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for sticky search bar */}
      <style jsx global>{`
        .sticky-search-bar {
          position: sticky;
          top: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 16px;
          background: white;
          z-index: 100;
          border-bottom: 1px solid #e5e7eb;
          width: 100%;
          border-radius: 0;
        }
      `}</style>
    </div>
  )
}
