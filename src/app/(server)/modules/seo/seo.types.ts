import { z } from 'zod';

/**
 * Schema for SEO image generation parameters
 */
export const SeoImageParamsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  siteName: z.string().optional(),
  logoUrl: z.string().url().optional(),
  category: z.string().optional(),
});

/**
 * Type for SEO image generation parameters
 */
export type SeoImageParamsDTO = z.infer<typeof SeoImageParamsSchema>;

/**
 * Schema for saving SEO images
 */
export const SaveSeoImagesSchema = z.object({
  newsSlug: z.string().min(1, 'News slug is required'),
  openGraphImage: z.string().url().optional(),
  twitterImage: z.string().url().optional(),
});

/**
 * Type for saving SEO images
 */
export type SaveSeoImagesDTO = z.infer<typeof SaveSeoImagesSchema>;

/**
 * Schema for SEO data
 */
export const SeoSchema = z.object({
  openGraphImage: z.string().nullable(),
  twitterImage: z.string().nullable(),
});

/**
 * Type for SEO data
 */
export type SeoDTO = z.infer<typeof SeoSchema>;
