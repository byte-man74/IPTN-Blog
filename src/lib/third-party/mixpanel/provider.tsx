'use client'

import { getEnvDebugStatus, getMixPanelToken } from '@/environment-config'
import { logger } from '@/lib/utils/logger'
import { useCallback, useEffect, useState, ReactNode } from 'react'
import { MixpanelContext } from '@/lib/third-party/mixpanel/context'
import { MixpanelContextType, TrackEventProps } from '@/lib/third-party/mixpanel/types'
import { MixpanelEvents } from './events'
import { usePathname } from 'next/navigation'
import { getPageName } from '@/lib/routes/client'
import { formatEventName } from './utils'

export const MixpanelProvider = ({ children }: { children: ReactNode }) => {
  const mixpanelToken = getMixPanelToken()
  const pathName = usePathname()
  const [mixpanel, setMixpanel] = useState<import('mixpanel-browser').OverridedMixpanel | null>(
    null
  )
  const [initialized, setInitialized] = useState(false)

  // Initialize Mixpanel
  useEffect(() => {
    const initMixpanel = async () => {
      if (!mixpanelToken || mixpanelToken === '') {
        logger.error('Mixpanel token unavailable')
        return
      }

      try {
        const mp = (await import('mixpanel-browser')).default
        mp.init(mixpanelToken, { debug: getEnvDebugStatus() })
        setMixpanel(mp)
        setInitialized(true)
        console.log('Mixpanel initialized successfully')
      } catch (error) {
        logger.error('Failed to load Mixpanel', error)
      }
    }

    initMixpanel()
  }, [mixpanelToken])

  // Track page visits
  useEffect(() => {
    if (!mixpanel || !pathName) return

    //check if the page is an admin page
    const isAdminPage = pathName.includes('/admin')

    try {
      const pageName = getPageName(pathName)

      if (!isAdminPage) {
        //only track the admin pages.
        mixpanel.track(
          formatEventName({ eventAction: MixpanelEvents.PAGE_VISIT, pageName: pageName }),
          {
            page: pathName,
            //todo: Add any other page-specific properties here
          }
        )
      }
    } catch (error) {
      logger.error('Unable to track page visit with Mixpanel', error)
    }
  }, [mixpanel, pathName])

  const trackEvent = useCallback(
    async ({ eventName, properties = {} }: TrackEventProps) => {
      if (!mixpanel) {
        logger.error('Mixpanel not loaded yet')
        return
      }

      try {
        mixpanel.track(eventName, properties)
      } catch (error) {
        logger.error('Unable to track event with Mixpanel', error)
      }
    },
    [mixpanel]
  )


  /**
   * this would track specific section user is interacting with on a particular page and format it accurately
   */
  const trackSectionVisit = async ({
    sectionName,
    pageName,
  }: {
    sectionName: string
    pageName: string
  }) => {
    const sectionEventName = formatEventName({
      eventAction: MixpanelEvents.SECTION_VISIT,
      pageName: pageName,
      sectionName: sectionName,
    })
    trackEvent({
      eventName: sectionEventName,
    })
  }

  const value: MixpanelContextType = {
    trackEvent,
    trackSectionVisit,
    initialized,
  }

  return <MixpanelContext.Provider value={value}>{children}</MixpanelContext.Provider>
}
