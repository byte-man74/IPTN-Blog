import { SiteConfigRepository } from '@/app/(server)/modules/site-configurations/site-config.repository'
import {
  SiteConfigNavDTO,
  SiteConfigurationDTO,
  SiteHealthReport,
} from '@/app/(server)/modules/site-configurations/site-config.types'
import ApiCustomError from '@/types/api-custom-error'

interface ISiteConfigService {
  initializeSiteConfig(): Promise<SiteConfigurationDTO | ApiCustomError | null>
  updateNavigation(config: SiteConfigNavDTO): Promise<SiteConfigurationDTO | ApiCustomError | null>
  getSiteConfig(): Promise<SiteConfigurationDTO | ApiCustomError | null>
  checkSiteContentHealth(): Promise<SiteHealthReport | ApiCustomError | null>
  performSimpleHealthCheck(): Promise<{ needsFullScan: boolean } | ApiCustomError | null>
}

export class SiteConfigService implements ISiteConfigService {
  constructor(
    private readonly siteConfigRepository: SiteConfigRepository = new SiteConfigRepository()
  ) {}

  async initializeSiteConfig(): Promise<SiteConfigurationDTO | ApiCustomError | null> {
    return this.siteConfigRepository.setUpBasicSiteConfiguration()
  }

  async updateNavigation(
    config: SiteConfigNavDTO
  ): Promise<SiteConfigurationDTO | ApiCustomError | null> {
    const { navBarKeyCategories, navBarSubCategories } = config
    return this.siteConfigRepository.configureNavigation(navBarKeyCategories, navBarSubCategories)
  }

  async getSiteConfig(): Promise<SiteConfigurationDTO | ApiCustomError | null> {
    return this.siteConfigRepository.getSiteConfiguration()
  }

  async checkSiteContentHealth(): Promise<SiteHealthReport | ApiCustomError | null> {
    return this.siteConfigRepository.checkSiteContentHealth()
  }

  async performSimpleHealthCheck(): Promise<{ needsFullScan: boolean } | ApiCustomError | null> {
    return this.siteConfigRepository.performSimpleHealthCheck()
  }
}
