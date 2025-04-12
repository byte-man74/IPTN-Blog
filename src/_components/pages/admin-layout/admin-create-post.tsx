'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateNews } from '@/network/http-service/news.mutations'
import { ArrowLeft, Save } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { AdminRoutes } from '@/lib/routes/admin'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { slugifyContent } from '@/app/(server)/modules/news/news.utils'
import { toast } from '@/hooks/use-toast'

type FormValues = {
  title: string
}

export const CreateNewsComponent = () => {
  const router = useRouter()
  const createNewsMutation = useCreateNews()
  const [slug, setSlug] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
    },
  })

  const title = watch('title')

  // Generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = slugifyContent(title)
      setSlug(generatedSlug)
    } else {
      setSlug('')
    }
  }, [title])

  const onSubmit = async (data: FormValues) => {
    try {
      createNewsMutation.mutate({
        data: {
          title: data.title,
          pubDate: null,
          published: false,
          contentEncoded: '',
        },
      })
      toast({
        title: "Success",
        description: "News created successfully",
        variant: "default",
      })
      router.push(AdminRoutes.updateNews(slug))
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to create news",
            variant: "destructive",
          })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create News</h1>
          <AppLink href={AdminRoutes.news}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </AppLink>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>News Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Enter news title"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                {slug && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Generated Slug</Label>
                    <div className="p-2 bg-muted rounded-md text-sm font-mono break-all">
                      {slug}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is how your URL will appear
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={createNewsMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {createNewsMutation.isPending ? 'Creating...' : 'Create News'}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
