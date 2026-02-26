import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/campaigns - List all campaigns
export async function GET() {
  try {
    const campaigns = await db.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: { pages: true },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, startTime, endTime } = body;

    if (!name || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startTime, endTime' },
        { status: 400 }
      );
    }

    const campaign = await db.campaign.create({
      data: {
        name,
        description: description || '',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        pages: {
          create: {
            title: 'Default Page',
            content: JSON.stringify({
              components: [],
              globalStyles: {
                backgroundColor: '#ffffff',
              },
            }),
            status: 'draft',
          },
        },
      },
      include: { pages: true },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
