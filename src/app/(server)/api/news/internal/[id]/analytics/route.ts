import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/app/(server)/modules/analytics/analytics.service'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'
import { z } from 'zod'

// Schema for metric increment request
const MetricIncrementSchema = z.object({
  metricType: z.enum(['views', 'likes', 'shares']),
})

// POST /api/news/[slug]/analytics - Increment a metric for a news article
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params
    const body = await request.json()

    // Ensure body is a valid JSON object
    if (!isValidJson(body)) {
      return NextResponse.json(
        { error: 'Invalid request format: Expected JSON object' },
        { status: 400 }
      )
    }

    // Validate request body against schema
    const validationResult = MetricIncrementSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { metricType } = validationResult.data

    // Increment the metric
    const analyticsService = new AnalyticsService()
    const result = await analyticsService.incrementMetric(id, metricType)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
