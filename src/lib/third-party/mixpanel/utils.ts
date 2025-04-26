import { MixpanelEvents } from '@/lib/third-party/mixpanel/events'

/**
 * Generates a formatted event name by combining event components
 * @param eventConfig Configuration object containing event details
 * @param eventConfig.eventAction An event action from MixpanelEvents
 * @param eventConfig.pageName The name of the page
 * @param eventConfig.sectionName Optional section name
 * @returns A formatted event string
 */
export const formatEventName = (
  eventConfig: {
    eventAction: (typeof MixpanelEvents)[keyof typeof MixpanelEvents],
    pageName: string,
    sectionName?: string
  }
): string => {
  const { eventAction, pageName, sectionName } = eventConfig

  if (sectionName) {
    return `${eventAction} ${sectionName} on ${pageName}`
  }
  return `${eventAction} ${pageName}`
}
