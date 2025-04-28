import { z } from 'zod'

// Base News DTO
export const SimplifiedNewsSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImage: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  slug: z.string(),
  pubDate: z.date().nullable(),
  createdAt: z.date(),
  lastUpdated: z.date(),
  authorId: z.string().nullable().optional(),
  published: z.boolean().default(false),
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
  analytics: z.object({
    views: z.number().default(0),
    likes: z.number().default(0),
    shares: z.number().default(0),
    readDuration: z.string().nullable().optional(),
  }).nullable().optional(),
  comments: z.array(z.object({
    id: z.number(),
  })).optional(),
})


export const CommentSchema = z.object({
    id: z.number(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string().nullable().optional(),
    newsId: z.string(),
    isAnonymous: z.boolean().default(false),
    user: z.object({
      firstName: z.string().nullable().optional(),
      lastName: z.string().nullable().optional(),
      image: z.string().nullable().optional()
    }).nullable().optional()
  })

export const FullNewsSchema = z.object({
    id: z.string(),
    title: z.string(),
    coverImage: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
    slug: z.string(),
    pubDate: z.date().nullable(),
    createdAt: z.date(),
    lastUpdated: z.date(),
    authorId: z.string().nullable().optional(),
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
      openGraphImage: z.string().nullable().optional(),
      twitterImage: z.string().nullable().optional(),
    }).nullable().optional(),
    analytics: z.object({
      views: z.number().default(0),
      likes: z.number().default(0),
      shares: z.number().default(0),
      readDuration: z.string().nullable().optional(),
    }).nullable().optional(),
    comments: z.array(CommentSchema).optional()
  })

// Schema for creating news
export const CreateNewsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  slug: z.string().optional(),
  pubDate: z.date().nullable(),
  coverImage: z.string().optional().nullable(),
  contentEncoded: z.string().optional(),
  authorId: z.string().nullable().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
  seo: z.object({
    openGraphImage: z.string().nullable().optional(),
    twitterImage: z.string().nullable().optional(),
  }).nullable().optional(),
})

// Schema for updating news
export const UpdateNewsSchema = CreateNewsSchema.partial().extend({
  id: z.string(),
})
// Schema for filtering news
export const NewsFilterSchema = z.object({
  id: z.string().nullable().optional(),
  authorId: z.string().nullable().optional(),
  published: z.boolean().nullable().optional(),
  categoryIds: z.array(z.number()).nullable().optional(),
  categorySlugs: z.array(z.string()).nullable().optional(),
  categorySlug: z.string().nullable().optional(),
  tagIds: z.array(z.number()).nullable().optional(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  searchTerm: z.string().nullable().optional(),
  byPopularity: z.boolean().nullable().optional(),
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
})

export const CreateTagSchema = TagSchema.omit({
  id: true,
})





export const CreateCommentSchema = CommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type CreateCommentSchemaDTO = z.infer<typeof CreateCommentSchema>
export type CommentDTO = z.infer<typeof CommentSchema>
