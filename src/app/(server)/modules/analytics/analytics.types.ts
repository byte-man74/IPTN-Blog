import { z } from "zod";

/**
 * Schema for analytics data
 */
export const AnalyticsSchema = z.object({
  id: z.number().int().optional(),
  newsId: z.string().uuid(),
  views: z.number().int().nonnegative().default(0),
  likes: z.number().int().nonnegative().default(0),
  shares: z.number().int().nonnegative().default(0),
  readDuration: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Type definition for analytics data derived from the schema
 */
export type AnalyticsDTO = z.infer<typeof AnalyticsSchema>;

/**
 * Schema for analytics update operations
 */
export const AnalyticsUpdateSchema = z.object({
  views: z.number().int().nonnegative().optional(),
  likes: z.number().int().nonnegative().optional(),
  shares: z.number().int().nonnegative().optional(),
  readDuration: z.string().optional(),
});

/**
 * Type definition for analytics update operations
 */
export type AnalyticsUpdateDTO = z.infer<typeof AnalyticsUpdateSchema>;

/**
 * Valid metric fields that can be incremented
 */
export const MetricFieldSchema = z.enum(['views', 'likes', 'shares']);
export type MetricField = z.infer<typeof MetricFieldSchema>;



export const AnalyticsSummarySchema = z.object({
    totalNews: z.number().nonnegative(),
    totalNewsPublished: z.number().nonnegative(),
    totalViews: z.number().nonnegative(),
    totalComments: z.number().nonnegative()
})

export type  AnalyticsSummaryDTO = z.infer<typeof AnalyticsSummarySchema>
