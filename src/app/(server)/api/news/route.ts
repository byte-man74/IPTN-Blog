import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import { CreateNewsSchema, NewsFilterSchema } from '@/app/(server)/modules/news/news.types'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'
import { QUERY_PARAMS_TITLES } from '@/lib/constants/api-filters'
import { auth } from '@/auth'



// GET /api/news - Get news with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters: Record<string, unknown> = {}

    // Parse compulsory filter
    const page = searchParams.get(QUERY_PARAMS_TITLES.PAGE)
      ? parseInt(searchParams.get(QUERY_PARAMS_TITLES.PAGE)!)
      : 1
    const limit = searchParams.get(QUERY_PARAMS_TITLES.LIMIT)
      ? parseInt(searchParams.get(QUERY_PARAMS_TITLES.LIMIT)!)
      : 20

    // Parse filter parameters from query string
    if (searchParams.has('authorId')) {
      filters.authorId = searchParams.get('authorId')
    }

    if (searchParams.has('published')) {
      filters.published = searchParams.get('published') === 'true'
    }

    // Check if user is requesting unpublished content and is not authenticated
    if (filters.published === false) {
        const session = await auth()
      if (!session?.user.isAdmin && !session?.user.isActive) {
        return NextResponse.json(
          { error: 'Authentication required to access unpublished content' },
          { status: 401 }
        )
      }
    }

    if (searchParams.has('categoryIds')) {
      filters.categoryIds = searchParams.get('categoryIds')?.split(',').map(Number)
    }

    if (searchParams.has('categorySlug')) {
      filters.categorySlug = searchParams.get('categorySlug')
    }

    if (searchParams.has('tagIds')) {
      filters.tagIds = searchParams.get('tagIds')?.split(',').map(Number)
    }

    if (searchParams.has('startDate')) {
      filters.startDate = new Date(searchParams.get('startDate') as string)
    }

    if (searchParams.has('endDate')) {
      filters.endDate = new Date(searchParams.get('endDate') as string)
    }

    if (searchParams.has('searchTerm')) {
      filters.searchTerm = searchParams.get('searchTerm')
    }

    // Validate filters against schema
    const validationResult = NewsFilterSchema.safeParse(filters)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid filter parameters', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const newsService = new NewsService()
    const result = await newsService.getNewsWithFilters(validationResult.data, page, limit)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to retrieve news' }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/news - Create news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Ensure body is a valid JSON object
    if (!isValidJson(body)) {
      return NextResponse.json(
        { error: 'Invalid request format: Expected JSON object' },
        { status: 400 }
      )
    }

    // Validate request body against schema
    const validationResult = CreateNewsSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const newsData = validationResult.data

    // Create news
    const newsService = new NewsService()
    const result = await newsService.createNews(newsData)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to create news' }, { status: 500 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
