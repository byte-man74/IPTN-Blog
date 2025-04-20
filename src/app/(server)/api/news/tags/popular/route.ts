import { NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import ApiCustomError from '@/types/api-custom-error'
import { logger } from '@/lib/utils/logger'

// GET /api/news/tags/popular - Get popular news tags
export async function GET() {
  try {
    const newsService = new NewsService()
    const result = await newsService.getPopularTags()

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to fetch popular tags' }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error("failed to fetch popular tags: ", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
