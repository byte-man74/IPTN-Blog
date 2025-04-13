import { z } from 'zod';
import { NewsCategorySchema } from '../news/news.types';

export const SiteConfigurationSchema = z.object({
  id: z.number().int(),
  navBarKeyCategories: z.array(NewsCategorySchema).max(5),
  navBarSubCategories: z.array(NewsCategorySchema)
});

export type SiteConfigurationDTO = z.infer<typeof SiteConfigurationSchema>;



// Schema for site configuration
export const SiteConfigNavSchema = z.object({
    navBarKeyCategories: z.array(z.number()),
    navBarSubCategories: z.array(z.number())
  })

export  type SiteConfigNavDTO = z.infer<typeof SiteConfigNavSchema>
