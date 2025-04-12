import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import { CreateNewsSchema } from '@/app/(server)/modules/news/news.types'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'
import { checkAuth } from '@/lib/utils/protected-route'

// GET /api/news/[slug] - Get a specific news item
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params
    const newsService = new NewsService()
    const result = await newsService.getNewsBySlug(slug)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/news/[slug] - Edit a specific news item
export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
  return checkAuth(request, async () => {
    try {
      const { slug } = await params
      const body = await request.json()
      const newsService = new NewsService()

      // Ensure body is a valid JSON object
      if (!isValidJson(body)) {
        return NextResponse.json(
          { error: 'Invalid request format: Expected JSON object' },
          { status: 400 }
        )
      }

      // Validate request body against schema
      const validationResult = CreateNewsSchema.partial().safeParse(body)

      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid request data', details: validationResult.error.format() },
          { status: 400 }
        )
      }

      const newsData = validationResult.data

      // Edit news
      const result = await newsService.editNews(slug, newsData)

      if (result instanceof ApiCustomError) {
        return NextResponse.json({ error: result.message }, { status: result.status })
      }

      if (!result) {
        return NextResponse.json({ error: 'Failed to update news' }, { status: 500 })
      }

      return NextResponse.json(result)
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}

// DELETE /api/news/[slug] - Delete a specific news item
export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  return checkAuth(request, async () => {
    try {
      const { slug } = await params
      const newsService = new NewsService()
      const result = await newsService.deleteNews(slug)

      if (result instanceof ApiCustomError) {
        return NextResponse.json({ error: result.message }, { status: result.status })
      }

      if (!result) {
        return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 })
      }

      return NextResponse.json({ message: 'News deleted successfully' }, { status: 200 })
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}
