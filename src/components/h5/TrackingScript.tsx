'use client';

import { useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';

interface Props {
  pageId: string;
  campaignId: string;
  config: { enablePV: boolean; enableUV: boolean; enableClickTracking: boolean };
}

export function TrackingScript({ pageId, campaignId, config }: Props) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const fp = getFingerprint();

    if (config.enablePV) {
      sendEvent({ eventType: 'page_view', pageId, campaignId, fingerprint: fp, payload: { url: window.location.href } });
    }
    if (config.enableUV) {
      sendEvent({ eventType: 'unique_visitor', pageId, campaignId, fingerprint: fp, payload: {} });
    }
    if (config.enableClickTracking) {
      document.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('[data-product-id]');
        if (target) {
          sendEvent({ eventType: 'product_click', pageId, campaignId, fingerprint: fp, payload: { productId: target.getAttribute('data-product-id') } });
        }
      });
    }
  }, [pageId, campaignId, config]);

  return null;
}

function getFingerprint(): string {
  const key = '__campain_fp';
  try {
    let fp = localStorage.getItem(key);
    if (!fp) { fp = nanoid(); localStorage.setItem(key, fp); }
    return fp;
  } catch { return nanoid(); }
}

function sendEvent(event: Record<string, unknown>) {
  const data = JSON.stringify({
    ...event,
    id: nanoid(),
    timestamp: new Date().toISOString(),
    deviceInfo: { userAgent: navigator.userAgent, screenWidth: screen.width, screenHeight: screen.height, referrer: document.referrer },
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/tracking', data);
  } else {
    fetch('/api/tracking', { method: 'POST', body: data, keepalive: true });
  }
}
