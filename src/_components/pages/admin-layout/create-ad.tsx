'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateAd } from '@/network/http-service/ads.mutations'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CloudinaryImageUploader } from './admin-image-uploader'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { logger } from '@/lib/utils/logger'
import { useQueryClient } from '@tanstack/react-query'
import { AdsQueryKey } from '@/network/query-keys/ads'

interface CreateAdProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type AdFormInputs = {
  title: string
  description: string
  link: string
  position: 'HOME' | 'NAV' | 'SECOND' | 'THIRD' | 'FOURTH'
  isActive: boolean
  mediaUrl: string
  thumbnail: string
  newsId?: string
}

export const CreateAdComponent: React.FC<CreateAdProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const createAdMutation = useCreateAd()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<AdFormInputs>({
    defaultValues: {
      title: '',
      description: '',
      link: '',
      position: 'HOME',
      isActive: true,
      mediaUrl: '',
      thumbnail: '',
    },
    mode: 'onChange'
  })

  const handleImageUploaded = (imageUrl: string) => {
    setPreviewImage(imageUrl)
    setValue('mediaUrl', imageUrl)
    setValue('thumbnail', imageUrl)
  }

  const onSubmit: SubmitHandler<AdFormInputs> = async (data) => {
    try {
      await createAdMutation.mutateAsync({ data })
      // Invalidate the ads list query to refresh the data
      queryClient.invalidateQueries({ queryKey: [AdsQueryKey.LIST] })
      setIsOpen(false)
      router.push('/admin/ads') // Redirect to ads list after successful creation
    } catch (error) {
      logger.error('Error creating ad:', error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    router.back()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto bg-white">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-semibold">Create New Ad Campaign</SheetTitle>
            <SheetClose asChild>
            </SheetClose>
          </div>
          <SheetDescription>Fill in the details to create a new ad campaign</SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue="details"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Campaign Details</TabsTrigger>
            <TabsTrigger value="media">Media & Settings</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="details" className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Campaign Title *
                </label>
                <input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                  Destination URL *
                </label>
                <input
                  type="url"
                  id="link"
                  {...register('link', {
                    required: 'URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Please enter a valid URL',
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="https://example.com"
                />
                {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab('media')}>
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Ad Position *
                </label>
                <select
                  id="position"
                  {...register('position', { required: 'Position is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                >
                  <option value="HOME">Home Page</option>
                  <option value="NAV">Top Navigation</option>
                  <option value="SECOND">Second Page</option>
                  <option value="THIRD">Third Page</option>
                  <option value="FOURTH">Fourth Page</option>
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ad Image *</label>
                <input type="hidden" {...register('mediaUrl', { required: 'Image is required' })} />
                <input type="hidden" {...register('thumbnail', { required: 'Thumbnail is required' })} />
                <CloudinaryImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImage={previewImage}
                />
                {errors.mediaUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.mediaUrl.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    id="isActive"
                    type="checkbox"
                    {...register('isActive')}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active Campaign
                  </label>
                </div>
              </div>

              <div className="flex justify-between space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setActiveTab('details')}>
                  Back
                </Button>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={createAdMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createAdMutation.isPending || !isValid || !previewImage}
                  >
                    {createAdMutation.isPending ? 'Creating...' : 'Create Campaign'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

export default CreateAdComponent
