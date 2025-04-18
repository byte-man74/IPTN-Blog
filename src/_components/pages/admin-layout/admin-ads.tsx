'use client'

import React, { useState } from 'react'
import { Plus, Edit, Trash2, DollarSign, BarChart, ExternalLink } from 'lucide-react'
import { useFetchAds } from '@/network/http-service/ads.hooks'
import { useDeleteAd } from '@/network/http-service/ads.mutations'
import { Skeleton } from '@/_components/global/skeleton'
import { AppLink } from '@/_components/global/app-link'
import { CreateAdComponent } from './create-ad'
import { EditAdComponent } from './edit-ad'
import { useQueryClient } from '@tanstack/react-query'
import { AdsQueryKey } from '@/network/query-keys/ads'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppImage } from '@/_components/global/app-image'
import { logger } from '@/lib/utils/logger'

export const AdminAdsComponent = () => {
  const queryClient = useQueryClient()
  const [selectedFilter, setSelectedFilter] = useState<{
    isActive?: boolean
    title?: string
    position?: string
  }>({
    isActive: true,
  })

  // Fetch ads data from API
  const { data: adsData, isLoading, error } = useFetchAds(selectedFilter)

  // Create, update and delete mutations
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null)
  const [selectedAdTitle, setSelectedAdTitle] = useState<string | null>(null)
  const deleteAdMutation = useDeleteAd(selectedAdId || '')

  // Modal states
  const [createAdOpen, setCreateAdOpen] = useState(false)
  const [editAdOpen, setEditAdOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Always perform nullish check for data that would come from API
  const ads = adsData ?? []

  // Helper function to determine status badge color
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  // Filter by position
  const handlePositionFilter = (position: string | undefined) => {
    setSelectedFilter((prev) => ({ ...prev, position }))
  }

  // Handle ad deletion confirmation
  const openDeleteDialog = (id: string, title: string) => {
    setSelectedAdId(id)
    setSelectedAdTitle(title)
    setDeleteDialogOpen(true)
  }

  // Handle ad deletion
  const handleDeleteAd = async () => {
    if (!selectedAdId) return

    try {
      await deleteAdMutation.mutateAsync({ data: selectedAdId })
      // Invalidate the ads list query to refresh the data
      queryClient.invalidateQueries({ queryKey: [AdsQueryKey.LIST] })
      setDeleteDialogOpen(false)
    } catch (error) {
      logger.error('Error deleting ad:', error)
    }
  }

  // Handle ad edit
  const handleEditAd = (id: string) => {
    setSelectedAdId(id)
    setEditAdOpen(true)
  }

  // Handle new ad creation
  const handleCreateAd = () => {
    setCreateAdOpen(true)
  }

  return (
    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Ad Campaigns</h1>
            <button
              onClick={handleCreateAd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-black hover:bg-primaryGreen/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryGreen"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Campaign
            </button>
          </div>

          {/* Ad Performance Summary */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="bg-white overflow-hidden shadow cursor-pointer"
              onClick={() => setSelectedFilter({})}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100  p-3">
                    <BarChart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Ads</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {ads.length || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white overflow-hidden shadow cursor-pointer"
              onClick={() => setSelectedFilter({ isActive: true })}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-3">
                    <ExternalLink className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Ads</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {ads.filter((ad) => ad.isActive).length || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
              onClick={() => handlePositionFilter('HOME')}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Home Ads</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {ads.filter((ad) => ad.position === 'HOME').length || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
              onClick={() => handlePositionFilter('NAV')}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <BarChart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Nav Ads</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {ads.filter((ad) => ad.position === 'NAV').length || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Campaigns Table */}
          <div className="mt-8 bg-white shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Ad Campaigns</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your current and upcoming ad campaigns
              </p>
            </div>

            {/* Filter controls */}
            <div className="px-4 py-3 border-b border-gray-200 sm:px-6 flex space-x-4">
              <button
                onClick={() => setSelectedFilter({ isActive: true })}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedFilter.isActive === true ? 'bg-black text-white' : 'bg-gray-100'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedFilter({ isActive: false })}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedFilter.isActive === false ? 'bg-black text-white' : 'bg-gray-100'
                }`}
              >
                Inactive
              </button>
              {selectedFilter.position && (
                <div className="ml-auto flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Filtered by position:</span>
                  <span className="px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-800 flex items-center">
                    {selectedFilter.position}
                    <button
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePositionFilter(undefined)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="px-4 py-5">
                <div className="space-y-4">
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
              </div>
            ) : error ? (
              <div className="px-4 py-5 text-center text-red-500">Error loading ads</div>
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
                        Position
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
                        Link
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Updated
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
                    {ads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No ads found
                        </td>
                      </tr>
                    ) : (
                      ads.map((ad) => (
                        <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {ad.thumbnail && (
                                <div className="flex-shrink-0 h-10 w-10 mr-3">
                                  <AppImage
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={ad.thumbnail}
                                    alt=""
                                  />
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className="text-sm text-gray-500 hover:underline cursor-pointer"
                              onClick={() => handlePositionFilter(ad.position)}
                            >
                              {ad.position}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                ad.isActive
                              )}`}
                            >
                              {ad.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ad.link ? (
                              <AppLink
                                href={ad.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primaryGreen hover:underline"
                              >
                                View Link
                              </AppLink>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(ad.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(ad.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditAd(ad.id)}
                                className="text-primaryGreen hover:text-primaryGreen/80"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => openDeleteDialog(ad.id, ad.title)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-5 w-5" />
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
          </div>
        </div>
      </div>

      {/* Create Ad Side Sheet */}
      {createAdOpen && <CreateAdComponent isOpen={createAdOpen} setIsOpen={setCreateAdOpen} />}

      {/* Edit Ad Side Sheet */}
      {editAdOpen && selectedAdId && (
        <EditAdComponent isOpen={editAdOpen} setIsOpen={setEditAdOpen} adId={selectedAdId} />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Ad Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the ad campaign &quot;{selectedAdTitle}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAd}
              disabled={deleteAdMutation.isPending}
            >
              {deleteAdMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
