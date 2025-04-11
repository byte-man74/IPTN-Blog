import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import { CreateNewsCategorySchema } from '@/app/(server)/modules/news/news.types'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'

// GET /api/news/categories - Get all news categories
export async function GET() {
  try {
    const newsService = new NewsService()
    const result = await newsService.fetchCategories()

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/news/categories - Create a news category
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
    const validationResult = CreateNewsCategorySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const categoryData = validationResult.data

    // Create news category
    const newsService = new NewsService()
    const result = await newsService.createNewsCategory(categoryData)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to create news category' }, { status: 500 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
