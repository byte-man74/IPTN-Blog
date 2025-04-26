import { useEffect } from 'react'
import { useScrollSpy } from './use-scrollspy'
import { useMixpanel } from '@/lib/third-party/mixpanel/context'
import { usePathname } from 'next/navigation'
import { getPageName } from '@/lib/routes/client'

interface SectionConfig {
  id: string
}

export function useTrackSection(sections: SectionConfig[]) {
  const pathName = usePathname()
  const pageName = getPageName(pathName)

  
  const { activeId, setRef } = useScrollSpy(sections)
  const { trackSectionVisit } = useMixpanel()

  useEffect(() => {
    if (activeId) {
      trackSectionVisit({ sectionName: activeId, pageName: pageName })
    }
  }, [activeId, trackSectionVisit, pageName])

  return { activeId, setRef }
}
