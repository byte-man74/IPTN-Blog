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





export type HealthStatus = 'healthy' | 'warning' | 'error';

export interface ContentCriteria {
  slug: string;
  name: string;
  threshold: number;
  requiresFresh?: boolean;
  maxThreshold?: number;
  severity: HealthStatus
}

export interface CategoryCriteria {
  index: number; // Position in navigation (0 = home, 1 = second category, etc.)
  name: string;
  criteria: ContentCriteria[];
}

export interface ContentHealthResult {
  status: HealthStatus;
  message: string;
  details?: {
    required: number;
    current: number;
    isFresh?: boolean;
    maxThreshold?: number;
  }
}

export interface CategoryHealthReport {
  categoryId: number;
  categoryName: string;
  checks: ContentHealthResult[];
  overallStatus: HealthStatus;
}

export interface SiteHealthReport {
  homePageHealth: ContentHealthResult[];
  categoryHealth: CategoryHealthReport[];
  lastCheckedAt: Date;
  overallStatus: HealthStatus;
}
