import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/pages - List pages with optional campaignId filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    const where = campaignId ? { campaignId } : {};

    const pages = await db.page.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create or save a page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, title, content } = body;

    if (!campaignId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: campaignId, title' },
        { status: 400 }
      );
    }

    // Verify campaign exists
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const page = await db.page.create({
      data: {
        campaignId,
        title,
        content: typeof content === 'string' ? content : JSON.stringify(content || { components: [] }),
        status: 'draft',
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Failed to create page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
