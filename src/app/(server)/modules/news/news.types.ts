import { z } from 'zod'

// Base News DTO
export const SimplifiedNewsSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImage: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  slug: z.string(),
  pubDate: z.date(),
  createdAt: z.date(),
  lastUpdated: z.date(),
  authorId: z.string(),
  published: z.boolean().default(false),
})


export const FullNewsSchema = z.object({
    id: z.string(),
    title: z.string(),
    coverImage: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
    slug: z.string(),
    pubDate: z.date(),
    createdAt: z.date(),
    lastUpdated: z.date(),
    authorId: z.string(),
    published: z.boolean().default(false),
    contentEncoded: z.string().nullable().optional(),
    categories: z.array(z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable().optional()
    })).optional(),
    tags: z.array(z.object({
      id: z.number(),
      name: z.string(),
    })).optional(),
    seo: z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable().optional(),
      keywords: z.string().nullable().optional(),
      openGraphImage: z.string().nullable().optional(),
      canonicalUrl: z.string().nullable().optional()
    }).nullable().optional()
  })

// Schema for creating news
export const CreateNewsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  slug: z.string().optional(),
  pubDate: z.date(),
  contentEncoded: z.string().optional(),
  authorId: z.string(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
})

// Schema for updating news
export const UpdateNewsSchema = CreateNewsSchema.partial().extend({
  id: z.string(),
})

// Schema for filtering news
export const NewsFilterSchema = z.object({
  id: z.string().optional(),
  authorId: z.string().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  searchTerm: z.string().optional(),
})

export const NewsCategorySchema = z.object({
  id: z.number(),
  slug: z.string().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
})

export const CreateNewsCategorySchema = NewsCategorySchema.omit({
  id: true,
})

export const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().optional(),
})

export const CreateTagSchema = TagSchema.omit({
  id: true,
})

// Types derived from schemas
export type NewsDTO = z.infer<typeof SimplifiedNewsSchema>
export type FullNewsDTO = z.infer<typeof FullNewsSchema>
export type CreateNewsDTO = z.infer<typeof CreateNewsSchema>
export type UpdateNewsDTO = z.infer<typeof UpdateNewsSchema>
export type NewsFilterDTO = z.infer<typeof NewsFilterSchema>
export type NewsCategoryDTO = z.infer<typeof NewsCategorySchema>
export type CreateNewsCategoryDTO = z.infer<typeof CreateNewsCategorySchema>
export type TagDTO = z.infer<typeof TagSchema>
export type CreateTagDTO = z.infer<typeof CreateTagSchema>
