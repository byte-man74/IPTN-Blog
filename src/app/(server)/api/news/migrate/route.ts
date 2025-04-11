import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/app/(server)/modules/news/news.service'

// export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const newsService = new NewsService()
    const result = await newsService.updateOldData()

    return NextResponse.json({
      success: true,
      message: result
    })
  } catch (error) {
    console.error('Migration error:', error)
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
