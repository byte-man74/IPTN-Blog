'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Save, Plus, Check, X, Eye, Share } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import {
  useFetchCategories,
  useFetchTags,
  useFetchNewsDetail,
} from '@/network/http-service/news.hooks'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useForm, Controller } from 'react-hook-form'
import { TagDTO } from '@/app/(server)/modules/news/news.types'
import { AdminRoutes } from '@/lib/routes/admin'
import { debounce } from 'lodash'
import {
  useUpdateNews,
  useCreateCategory,
  useCreateTag,
} from '@/network/http-service/news.mutations'
import { toast } from '@/hooks/use-toast'
import { SocialMediaPreview } from './admin-post-preview'
import { CloudinaryImageUploader } from './admin-image-uploader'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { CreateCategoryDialog } from './admin-create-category'
import { CreateTagDialog } from './admin-create-tag'

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/_components/global/rich-text-editor').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full border rounded-md bg-muted animate-pulse" />,
  }
)

type FormValues = {
  title: string
  summary: string
  content: string
  isPublished: boolean
  featuredImage: File | null
  featuredImageUrl: string | null
}

export const ModifyPostComponent = ({ slug }: { slug: string }) => {
  const { data: newsItem, isLoading: newsLoading } = useFetchNewsDetail(slug)
  const { mutateAsync: updateNews, isPending: isUpdating } = useUpdateNews(slug)
  const { mutateAsync: createCategory } = useCreateCategory()
  const { mutateAsync: createTag } = useCreateTag()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      isPublished: false,
      featuredImage: null,
      featuredImageUrl: null,
    },
  })

  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categorySearchTerm, setCategorySearchTerm] = useState('')
  const [tagSearchTerm, setTagSearchTerm] = useState('')
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false)
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
  const [visibleTags, setVisibleTags] = useState<TagDTO[]>([])
  const [contentLoaded, setContentLoaded] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [previousFormState, setPreviousFormState] = useState<{
    title: string
    summary: string
    content: string
    isPublished: boolean
    featuredImageUrl: string | null
    categoryIds: number[]
    tagIds: number[]
  } | null>(null)
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false)

  const { data: categories, isLoading: categoriesLoading } = useFetchCategories()
  const { data: tags, isLoading: tagsLoading } = useFetchTags()

  const content = watch('content')
  const summary = watch('summary')
  const title = watch('title')
  const isPublished = watch('isPublished')
  const featuredImageUrl = watch('featuredImageUrl')

  // Filter tags based on search term
  useEffect(() => {
    if (tags) {
      const filtered = tagSearchTerm
        ? tags.filter((tag) => tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase()))
        : tags
      setVisibleTags(filtered)
    }
  }, [tags, tagSearchTerm])

  // Populate form with news data when it loads
  useEffect(() => {
    if (newsItem) {
      setValue('title', newsItem.title || '')
      setValue('summary', newsItem.summary || '')
      setValue('content', newsItem.contentEncoded || '')
      setValue('isPublished', newsItem.published || false)
      setValue('featuredImageUrl', newsItem.coverImage || null)
      setImagePreview(newsItem.coverImage || null)
      setContentLoaded(true)

      // Set categories and tags if they exist
      if (newsItem.categories?.length) {
        setSelectedCategories(newsItem.categories.map((cat) => cat.id))
      }

      if (newsItem.tags?.length) {
        setSelectedTags(newsItem.tags.map((tag) => tag.id))
      }

      // Initialize previous form state
      setPreviousFormState({
        title: newsItem.title || '',
        summary: newsItem.summary || '',
        content: newsItem.contentEncoded || '',
        isPublished: newsItem.published || false,
        featuredImageUrl: newsItem.coverImage || null,
        categoryIds: newsItem.categories?.map((cat) => cat.id) || [],
        tagIds: newsItem.tags?.map((tag) => tag.id) || [],
      })
    }
  }, [newsItem, setValue])

  // Extract summary from content when content changes
  useEffect(() => {
    if (content && !summary) {
      // Strip HTML tags and get the first 150 characters as summary
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const textContent = tempDiv.textContent || tempDiv.innerText || ''
      const extractedSummary = textContent.trim().substring(0, 150)

      if (extractedSummary) {
        setValue('summary', extractedSummary + (textContent.length > 150 ? '...' : ''))
      }
    }
  }, [content, summary, setValue])

  // Debounced save function
  const saveProgress = useCallback(() => {
    const debouncedSave = debounce(
      async (data: FormValues, categories: number[], tags: number[]) => {
        if (!newsItem?.slug) return

        setAutoSaveStatus('saving')
        try {
          await updateNews({
            data: {
              title: data.title,
              summary: data.summary,
              contentEncoded: data.content,
              published: data.isPublished,
              pubDate: data.isPublished ? new Date() : null,
              coverImage: data.featuredImageUrl,
              categoryIds: categories,
              tagIds: tags,
            },
          })

          // Update previous form state after successful save
          setPreviousFormState({
            title: data.title,
            summary: data.summary,
            content: data.content,
            isPublished: data.isPublished,
            featuredImageUrl: data.featuredImageUrl,
            categoryIds: categories,
            tagIds: tags,
          })

          setAutoSaveStatus('saved')
          // Reset status after 3 seconds
          setTimeout(() => {
            setAutoSaveStatus('idle')
          }, 3000)
        } catch (error) {
          toast({
            title: 'Error auto-saving',
            description: String(error),
            variant: 'destructive',
          })
          setAutoSaveStatus('idle')
        }
      },
      3000
    )

    return debouncedSave
  }, [newsItem?.slug, updateNews])

  // Watch for changes and auto-save
  useEffect(() => {
    if (!contentLoaded || !previousFormState) return

    const currentData = {
      title,
      summary,
      content,
      isPublished,
      featuredImage: watch('featuredImage'),
      featuredImageUrl,
    }

    // Check if anything has changed compared to previous state
    const hasChanges =
      title !== previousFormState.title ||
      summary !== previousFormState.summary ||
      content !== previousFormState.content ||
      isPublished !== previousFormState.isPublished ||
      featuredImageUrl !== previousFormState.featuredImageUrl ||
      !arraysEqual(selectedCategories, previousFormState.categoryIds) ||
      !arraysEqual(selectedTags, previousFormState.tagIds)

    if (hasChanges) {
      const debouncedSaveFn = saveProgress()
      debouncedSaveFn(currentData, selectedCategories, selectedTags)

      return () => {
        debouncedSaveFn.cancel()
      }
    }
  }, [
    content,
    title,
    summary,
    isPublished,
    featuredImageUrl,
    selectedCategories,
    selectedTags,
    contentLoaded,
    saveProgress,
    watch,
    previousFormState,
  ])

  // Helper function to compare arrays
  const arraysEqual = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false
    const sortedA = [...a].sort()
    const sortedB = [...b].sort()
    return sortedA.every((val, idx) => val === sortedB[idx])
  }

  const handleImageUploaded = (imageUrl: string, file: File) => {
    setValue('featuredImageUrl', imageUrl)
    setValue('featuredImage', file)
    setImagePreview(imageUrl)
  }

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const handleCreateCategory = async (name: string) => {
    try {
      const newCategory = await createCategory({ data: { name } })
      setSelectedCategories((prev) => [...prev, newCategory.id])
      toast({
        title: 'Success',
        description: `Category "${name}" created successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error creating category',
        description: String(error),
        variant: 'destructive',
      })
    }
  }

  const handleCreateTag = async (name: string) => {
    try {
      const newTag = await createTag({ data: { name } })
      setSelectedTags((prev) => [...prev, newTag.id])
      toast({
        title: 'Success',
        description: `Tag "${name}" created successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error creating tag',
        description: String(error),
        variant: 'destructive',
      })
    }
  }

  const handleSaveClick = () => {
    if (watch('isPublished')) {
      // If publishing, show the preview sheet first
      setPreviewSheetOpen(true)
    } else {
      // If saving as draft, just submit the form
      handleSubmit(onSubmit)()
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (!newsItem?.id) return

    try {
      await updateNews({
        data: {
          title: data.title,
          summary: data.summary,
          contentEncoded: data.content,
          published: data.isPublished,
          pubDate: data.isPublished ? new Date() : null,
          coverImage: data.featuredImageUrl,
          categoryIds: selectedCategories,
          tagIds: selectedTags,
        },
      })

      // Update previous form state after manual save
      setPreviousFormState({
        title: data.title,
        summary: data.summary,
        content: data.content,
        isPublished: data.isPublished,
        featuredImageUrl: data.featuredImageUrl,
        categoryIds: selectedCategories,
        tagIds: selectedTags,
      })

      toast({
        title: 'Success',
        description: data.isPublished ? 'Post published successfully' : 'Draft saved successfully',
      })

      // Close the preview sheet if it was open
      setPreviewSheetOpen(false)
    } catch (error) {
      toast({
        title: 'Error saving post',
        description: String(error),
        variant: 'destructive',
      })
    }
  }

  // Generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const filteredCategories =
    categories?.filter((category) =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    ) || []

  const selectedCategoriesData =
    categories?.filter((cat) => selectedCategories.includes(cat.id)) || []
  const selectedTagsData = tags?.filter((tag) => selectedTags.includes(tag.id)) || []

  if (newsLoading) {
    return <div className="container mx-auto py-6 px-6">Loading news data...</div>
  }

  return (
    <div className="container mx-auto py-6 px-6 space-y-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppLink href={AdminRoutes.news}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </AppLink>
          <h1 className="text-2xl font-bold">Edit Post</h1>
          {autoSaveStatus === 'saving' && (
            <span className="text-sm text-amber-500 ml-2">Auto-saving...</span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="text-sm text-green-500 ml-2">Changes auto-saved</span>
          )}
        </div>
        <div className="flex gap-2">
          {title && (
            <AppLink
              href={AdminRoutes.previewNews(newsItem?.slug ?? generateSlug(newsItem?.title ?? ''))}
              target="_blank"
            >
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </AppLink>
          )}
          <Button
            onClick={handleSaveClick}
            className="flex items-center gap-2 rounded-none"
            disabled={isUpdating}
          >
            {watch('isPublished') ? (
              <>
                <Share className="h-4 w-4" />
                Publish
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    {...register('title', { required: true })}
                  />
                  {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="Enter a brief summary"
                    rows={3}
                    {...register('summary')}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="content">Content</Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        key={contentLoaded ? 'content-loaded' : 'content-loading'}
                        className="relative z-0"
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="isPublished"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="published"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="published">Published status</Label>
                </div>

                <CloudinaryImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImage={imagePreview}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Categories</Label>
                    <Dialog>
                      <DialogTrigger asChild onClick={() => setCategoryDialogOpen(true)}>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" /> New
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCategoriesData.slice(0, 3).map((category) => (
                      <Badge
                        key={category.id}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        {category.name} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                    {selectedCategories.length > 3 && (
                      <Badge variant="outline">+{selectedCategories.length - 3} more</Badge>
                    )}

                    <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7">
                          <Plus className="h-3.5 w-3.5 mr-1" /> Select
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search categories..."
                            value={categorySearchTerm}
                            onValueChange={setCategorySearchTerm}
                          />
                          <CommandEmpty>No categories found</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-auto">
                            {categoriesLoading ? (
                              <div className="p-2">Loading categories...</div>
                            ) : (
                              filteredCategories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    handleCategoryToggle(category.id)
                                    setCategoryPopoverOpen(false)
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    {category.name}
                                    {selectedCategories.includes(category.id) && (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </div>
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tags</Label>
                    <Dialog>
                      <DialogTrigger asChild onClick={() => setTagDialogOpen(true)}>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" /> New
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTagsData.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                    {selectedTags.length > 3 && (
                      <Badge variant="outline">+{selectedTags.length - 3} more</Badge>
                    )}

                    <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7">
                          <Plus className="h-3.5 w-3.5 mr-1" /> Select
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search tags..."
                            value={tagSearchTerm}
                            onValueChange={setTagSearchTerm}
                          />
                          <CommandEmpty>No tags found</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-auto">
                            {tagsLoading ? (
                              <div className="p-2">Loading tags...</div>
                            ) : (
                              visibleTags.slice(0, 20).map((tag) => (
                                <CommandItem
                                  key={tag.id}
                                  value={tag.name}
                                  onSelect={() => {
                                    handleTagToggle(tag.id)
                                    setTagPopoverOpen(false)
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    {tag.name}
                                    {selectedTags.includes(tag.id) && <Check className="h-4 w-4" />}
                                  </div>
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Category Dialog */}
      <CreateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onCreateCategory={handleCreateCategory}
      />

      {/* Create Tag Dialog */}
      <CreateTagDialog
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        onCreateTag={handleCreateTag}
      />

      {/* Social Media Preview Sheet */}
      <SocialMediaPreview
        open={previewSheetOpen}
        onOpenChange={setPreviewSheetOpen}
        title={title}
        summary={summary}
        imageUrl={featuredImageUrl}
        onConfirm={handleSubmit(onSubmit)}
        isLoading={isUpdating}
      />
    </div>
  )
}
