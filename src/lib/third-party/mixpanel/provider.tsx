'use client'

import { getEnvDebugStatus, getMixPanelToken } from '@/environment-config'
import { logger } from '@/lib/utils/logger'
import { useCallback, useEffect, useState, ReactNode, useRef } from 'react'
import { MixpanelContext } from '@/lib/third-party/mixpanel/context'
import { MixpanelContextType, TrackEventProps } from '@/lib/third-party/mixpanel/types'
import { MixpanelEvents } from './events'
import { usePathname } from 'next/navigation'
import { getPageName } from '@/lib/routes/client'
import { formatEventName } from './utils'
import { useSaveMixpanelIdentity } from '@/network/http-service/analytics.mutations'
import { useSession } from 'next-auth/react'

export const MixpanelProvider = ({ children }: { children: ReactNode }) => {
  const mixpanelToken = getMixPanelToken()
  const pathName = usePathname()
  const { data: sessionData } = useSession()
  const [mixpanel, setMixpanel] = useState<import('mixpanel-browser').OverridedMixpanel | null>(
    null
  )
  const verifyMixpanelIdentity = useSaveMixpanelIdentity()
  const [initialized, setInitialized] = useState(false)
  const userIdentified = useRef(false)

  //logic responsible for identifying users on first render.
  const identifyUser = useCallback(async () => {
    if (!mixpanel) {
      logger.error('Mixpanel not loaded yet')
      return
    }

    if (sessionData?.user.id && !userIdentified.current) {
      try {
        userIdentified.current = true
        logger.info('Identifying user in Mixpanel')

        //check to see if the user information has already been stored on mixpanel
        const { success } = await verifyMixpanelIdentity.mutateAsync({
          data: {
            userId: sessionData.user.id,
          },
        })

        //run a register if a user has not been stored on the db before.
        if (!success) {
          // Set user properties using people.set according to Mixpanel docs
          mixpanel.people.set({
            $distinct_id: sessionData.user.email,
            $email: sessionData.user.email || 'Not provided',
            $first_name: sessionData.user.firstName || 'Not provided',
            $last_name: sessionData.user.lastName || 'Not provided',
            $name:
              `${sessionData.user.firstName || ''} ${sessionData.user.lastName || ''}`.trim() ||
              'Not provided',
          })

          // Also register these properties for use in events
          mixpanel.register({
            user_id: sessionData.user.id,
            email: sessionData.user.email || 'Not provided',
          })
        }
        //identify the user
        mixpanel.identify(sessionData.user.id)

        logger.info('User successfully identified in Mixpanel')
      } catch (err) {
        userIdentified.current = false // Reset flag to allow retry on next render
        logger.error('unable to identify user', err)
      }
    }
  }, [mixpanel, sessionData?.user, verifyMixpanelIdentity])

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
        logger.info('Mixpanel initialized successfully')
      } catch (error) {
        logger.error('Failed to load Mixpanel', error)
      }
    }

    initMixpanel()

    return () => {
      //cleaning up resources
      if (mixpanel) {
        logger.info('Cleaning up Mixpanel resources')
        setMixpanel(null)
        setInitialized(false)
        userIdentified.current = false
      }
    }
  }, [mixpanelToken, mixpanel])

  // Track page visits
  useEffect(() => {
    if (!mixpanel || !pathName) return

    //check if the page is an admin page
    const isAdminPage = pathName.includes('/admin')

    try {
      const pageName = getPageName(pathName)

      if (!isAdminPage) {
        //only track the non admin pages.
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

  //identify user on render
  useEffect(() => {
    if (sessionData?.user && mixpanel && !userIdentified.current) {
      identifyUser()
    }
  }, [identifyUser, sessionData?.user, mixpanel])

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
    await trackEvent({
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
