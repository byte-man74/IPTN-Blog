import { MixpanelActions, MixpanelEvents } from './events'

export interface TrackEventProps {
  eventName:
    | (typeof MixpanelEvents)[keyof typeof MixpanelEvents]
    | string
    | (typeof MixpanelActions)[keyof typeof MixpanelActions]
  properties?: Record<string, unknown>
}

export interface MixpanelContextType {
  trackEvent: (props: TrackEventProps) => Promise<void>
  initialized: boolean
  trackSectionVisit: (props: { sectionName: string; pageName: string }) => Promise<void>
}
