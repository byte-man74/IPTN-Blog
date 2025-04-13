import { NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'
import { logger } from '@/lib/utils/logger'

// export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const newsService = new NewsService()
    const result = await newsService.updateOldData()

    return NextResponse.json({
      success: true,
      message: result
    })
  } catch (error) {
    logger.error('Migration error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to migrate data',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
