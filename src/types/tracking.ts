export type TrackingEventType =
  | 'page_view'
  | 'unique_visitor'
  | 'product_click'
  | 'product_impression'
  | 'button_click'
  | 'share'
  | 'scroll_depth';

export interface TrackingEvent {
  id: string;
  eventType: TrackingEventType;
  pageId: string;
  campaignId: string;
  timestamp: string;
  fingerprint: string;
  payload: Record<string, unknown>;
  deviceInfo: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    referrer?: string;
  };
}
