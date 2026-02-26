import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await db.trackingEvent.create({
      data: {
        eventType: body.eventType,
        pageId: body.pageId,
        campaignId: body.campaignId,
        fingerprint: body.fingerprint || 'anonymous',
        payload: JSON.stringify(body.payload || {}),
        deviceInfo: JSON.stringify(body.deviceInfo || {}),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}
