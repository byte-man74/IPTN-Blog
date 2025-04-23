import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import ApiCustomError from '@/types/api-custom-error'

// GET /api/news/[slug]/related - Get related news items for a specific news article
export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params
    const { slug } = params
    const newsService = new NewsService()
    const result = await newsService.fetchRelatedNews(slug)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Related news not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
