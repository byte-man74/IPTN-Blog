'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Save, Plus, Check, X, Eye } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { useFetchCategories, useFetchTags } from '@/network/http-service/news.hooks'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { AppImage } from '@/_components/global/app-image'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm, Controller } from 'react-hook-form'
import { TagDTO } from '@/app/(server)/modules/news/news.types'
import { AdminRoutes } from '@/lib/routes/admin'
import { uploadFileToCloudinaryClientUsage } from '@/lib/third-party/cloudinary/manageCloudinaryUpload'

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/_components/global/rich-text-editor').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full border rounded-md bg-muted animate-pulse" />,
  }
)

// Cloudinary Image Uploader Component
const CloudinaryImageUploader = ({
  onImageUploaded,
  currentImage,
}: {
  onImageUploaded: (imageUrl: string, file: File) => void
  currentImage: string | null
}) => {
  const [uploading, setUploading] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploading(true)

      try {
        const imageUrl = await uploadFileToCloudinaryClientUsage(file, 'news')
        onImageUploaded(imageUrl, file)
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label>Featured Image</Label>
      <div className="mt-1">
        {currentImage && (
          <div className="mb-2">
            <AppImage
              src={currentImage}
              alt="Preview"
              className="h-40 w-full object-cover rounded-md"
            />
          </div>
        )}
        <Input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
        {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
      </div>
    </div>
  )
}

type FormValues = {
  title: string
  summary: string
  content: string
  isPublished: boolean
  featuredImage: File | null
  featuredImageUrl: string | null
}

export default function CreatePostPage() {
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
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false)
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
  const [visibleTags, setVisibleTags] = useState<TagDTO[]>([])

  const { data: categories, isLoading: categoriesLoading } = useFetchCategories()
  const { data: tags, isLoading: tagsLoading } = useFetchTags()

  const content = watch('content')
  const summary = watch('summary')
  const title = watch('title')

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

  // Filter tags based on search term when popover is open or search term changes
  useEffect(() => {
    if (tagPopoverOpen || tagSearchTerm) {
      const filtered =
        tags?.filter((tag) => tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase())) || []
      // Limit to first 50 results for performance
      setVisibleTags(filtered.slice(0, 50))
    }
  }, [tags, tagSearchTerm, tagPopoverOpen])

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

  const handleCreateCategory = () => {
    // TODO: Implement API call to create category
    console.log('Creating new category:', newCategoryName)
    setNewCategoryName('')
    setCategoryDialogOpen(false)
  }

  const handleCreateTag = () => {
    // TODO: Implement API call to create tag
    console.log('Creating new tag:', newTagName)
    setNewTagName('')
    setTagDialogOpen(false)
  }

  const onSubmit = (data: FormValues) => {
    // TODO: Implement API call to create post
    console.log({
      ...data,
      selectedCategories,
      selectedTags,
    })
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

  return (
    <div className="container mx-auto py-6 px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppLink href={AdminRoutes.news}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </AppLink>
          <h1 className="text-2xl font-bold">Create New Post</h1>
        </div>
        <div className="flex gap-2">
          {title && (
            <AppLink href={`/posts/preview/${generateSlug(title)}`} target="_blank">
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </AppLink>
          )}
          <Button onClick={handleSubmit(onSubmit)} className="flex items-center gap-2 rounded-none">
            <Save className="h-4 w-4" />
            {watch('isPublished') ? 'Publish' : 'Save Draft'}
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

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor content={field.value} onChange={field.onChange} />
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
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <CloudinaryImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImage={imagePreview}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Categories</Label>
                    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" /> New
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="newCategory">Category Name</Label>
                            <Input
                              id="newCategory"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="Enter category name"
                            />
                          </div>
                          <Button onClick={handleCreateCategory}>Create Category</Button>
                        </div>
                      </DialogContent>
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
                    <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" /> New
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Tag</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="newTag">Tag Name</Label>
                            <Input
                              id="newTag"
                              value={newTagName}
                              onChange={(e) => setNewTagName(e.target.value)}
                              placeholder="Enter tag name"
                            />
                          </div>
                          <Button onClick={handleCreateTag}>Create Tag</Button>
                        </div>
                      </DialogContent>
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
                              visibleTags.map((tag) => (
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
    </div>
  )
}
