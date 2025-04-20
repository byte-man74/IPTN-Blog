import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'
import { z } from 'zod'

// Schema for category assignment request
const CategoryAssignmentSchema = z.object({
  categoryIds: z.array(z.number()),
  remove: z.boolean().optional(),
})

// POST /api/news/[id]/categories - Assign categories to news
export async function POST(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params
    const body = await request.json()

    // Ensure body is a valid JSON object
    if (!isValidJson(body)) {
      return NextResponse.json(
        { error: 'Invalid request format: Expected JSON object' },
        { status: 400 }
      )
    }

    // Validate request body against schema
    const validationResult = CategoryAssignmentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { categoryIds, remove } = validationResult.data

    // Assign categories to news
    const newsService = new NewsService()
    const result = await newsService.assignCategoriesToNews(slug, categoryIds, { remove })

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to assign categories to news' }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
