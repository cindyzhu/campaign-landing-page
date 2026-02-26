import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/mock/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const category = searchParams.get('category');
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;

  let filtered = [...mockProducts];
  if (search) filtered = filtered.filter((p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
  if (category) filtered = filtered.filter((p) => p.category === category);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return NextResponse.json({ items, total, page, pageSize });
}
