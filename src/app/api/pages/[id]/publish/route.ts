import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const page = await db.page.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const publishedUrl = `/h5/${id}`;
    const updated = await db.page.update({
      where: { id },
      data: { status: 'published', publishedUrl },
    });

    return NextResponse.json({ publishedUrl, page: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to publish page' }, { status: 500 });
  }
}
