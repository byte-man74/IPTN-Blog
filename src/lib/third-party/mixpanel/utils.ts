import { MixpanelEvents } from '@/lib/third-party/mixpanel/events'

/**
 * Generates a formatted event name by combining an action with a page name
 * @param action An event action from MixpanelEvents
 * @param pageName The name of the page
 * @returns A formatted event string
 */
export const generateEventName = (
  action: (typeof MixpanelEvents)[keyof typeof MixpanelEvents],
  pageName: string
): string => {
  return `${action} ${pageName}`
}
