import { MixpanelEvents } from "./events"

export interface TrackEventProps {
    eventName: typeof MixpanelEvents[keyof typeof MixpanelEvents] | string
    properties?: Record<string, unknown>
  }


export interface MixpanelContextType {
    trackEvent: (props: TrackEventProps) => Promise<void>
    initialized: boolean
    trackSectionVisit: (props: {
        sectionName: string;
        pageName: string;
    }) =>  Promise<void>
  }
