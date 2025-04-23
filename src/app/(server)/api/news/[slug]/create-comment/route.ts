import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import { CreateCommentSchema } from '@/app/(server)/modules/news/news.types'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'

// POST /api/news/[slug]/create-comment - Add a comment to a specific news article
export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params
    const { slug } = params
    const body = await request.json()
    const newsService = new NewsService()

    // Ensure body is a valid JSON object
    if (!isValidJson(body)) {
      return NextResponse.json(
        { error: 'Invalid request format: Expected JSON object' },
        { status: 400 }
      )
    }

    // First, get the news article by slug to get its ID
    const newsArticle = await newsService.getNewsBySlug(slug)

    if (newsArticle instanceof ApiCustomError) {
      return NextResponse.json({ error: newsArticle.message }, { status: newsArticle.status })
    }

    if (!newsArticle) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 })
    }

    // Add the actual news ID to the comment data
    body.newsId = newsArticle.id

    // Validate request body against schema
    const validationResult = CreateCommentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const commentData = validationResult.data

    // Create comment
    const result = await newsService.createNewsComment(commentData)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
