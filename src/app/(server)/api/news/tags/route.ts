import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import { CreateTagSchema } from '@/app/(server)/modules/news/news.types'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'

// GET /api/news/tags - Get all news tags
export async function GET() {
  try {
    const newsService = new NewsService()
    const result = await newsService.fetchTags()

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/news/tags - Create a news tag
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
    const validationResult = CreateTagSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const tagData = validationResult.data

    // Create news tag
    const newsService = new NewsService()
    const result = await newsService.createTag(tagData)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to create news tag' }, { status: 500 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
