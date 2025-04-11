'use client'

import { useState } from 'react'
import { RichTextEditor } from '@/_components/global/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFetchCategories, useFetchTags } from '@/network/http-service/news.hooks'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminPostFormProps {
  initialData?: {
    title: string
    content: string
    summary: string
    categoryIds: number[]
    tagIds: number[]
    published: boolean
  }
  onSubmit: (data: {
    title: string
    content: string
    summary: string
    categoryIds: number[]
    tagIds: number[]
    published: boolean
  }) => void
}

export function AdminPostForm({ initialData, onSubmit }: AdminPostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [summary, setSummary] = useState(initialData?.summary ?? '')
  const [categoryIds, setCategoryIds] = useState<number[]>(initialData?.categoryIds ?? [])
  const [tagIds, setTagIds] = useState<number[]>(initialData?.tagIds ?? [])
  const [published, setPublished] = useState(initialData?.published ?? false)

  const { data: categories } = useFetchCategories()
  const { data: tags } = useFetchTags()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      content,
      summary,
      categoryIds,
      tagIds,
      published,
    })
  }

  const toggleCategory = (categoryId: number) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const toggleTag = (tagId: number) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Input
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter post summary"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {categoryIds.length > 0 ? `${categoryIds.length} selected` : 'Select categories'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {categories?.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => toggleCategory(category.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        categoryIds.includes(category.id) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {tagIds.length > 0 ? `${tagIds.length} selected` : 'Select tags'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {tags?.map((tag) => (
                  <CommandItem key={tag.id} value={tag.name} onSelect={() => toggleTag(tag.id)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        tagIds.includes(tag.id) ? 'opacity-100' : 'opacity-0'
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

      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write your post content here..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={published ? 'default' : 'outline'}
          onClick={() => setPublished(true)}
        >
          Publish
        </Button>
        <Button
          type="button"
          variant={!published ? 'default' : 'outline'}
          onClick={() => setPublished(false)}
        >
          Save as Draft
        </Button>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Post' : 'Create Post'}
      </Button>
    </form>
  )
}
