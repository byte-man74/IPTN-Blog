'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { AdminRoutes } from '@/lib/routes/admin'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { useFetchNewsDetail } from '@/network/http-service/news.hooks'
import { AppImage } from '@/_components/global/app-image'

interface PreviewPostComponentProps {
  slug: string
}

export const PreviewPostComponent = ({ slug }: PreviewPostComponentProps) => {
  const { data: news, isLoading, error } = useFetchNewsDetail(slug)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-4 w-32 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Error</h1>
            <AppLink href={AdminRoutes.news}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </AppLink>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-red-500">
                {error instanceof Error ? error.message : "Failed to load news article"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Preview: {news.title}</h1>
          <div className="flex gap-2">
            <AppLink href={AdminRoutes.updateNews(slug)}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
            </AppLink>
            <AppLink href={AdminRoutes.news}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </AppLink>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            {news.coverImage && (
              <div className="w-full h-[400px] relative">
                <AppImage
                  src={news.coverImage ?? ""}
                  alt={news.title}
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                <div className="absolute top-0 left-0 p-6 w-full">
                  <h2 className="text-4xl font-bold text-white mb-2">{news.title}</h2>
                  <div className="flex items-center gap-3">
                    <Badge variant={news.published ? "default" : "outline"} className="bg-white/80 text-black">
                      {news.published ? "Published" : "Draft"}
                    </Badge>
                    {news.pubDate && (
                      <p className="text-sm text-white/90">
                        {format(new Date(news.pubDate), 'MMMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!news.coverImage && (
              <div className="bg-slate-200 p-6 rounded-t-lg">
                <h2 className="text-4xl font-bold mb-2">{news.title}</h2>
                <div className="flex items-center gap-3">
                  <Badge variant={news.published ? "default" : "outline"}>
                    {news.published ? "Published" : "Draft"}
                  </Badge>
                  {news.pubDate && (
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(news.pubDate), 'MMMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Card className="shadow-sm rounded-t-none">
            <CardContent className="p-6">
              {news.summary && (
                <p className="text-lg font-medium text-muted-foreground mb-6">
                  {news.summary}
                </p>
              )}
              <div className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: news.contentEncoded || '<p>No content yet</p>' }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
