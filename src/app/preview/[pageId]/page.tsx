import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/h5/PageRenderer';
import { mockProducts } from '@/mock/products';
import type { PageData } from '@/types/page';

interface Props {
  params: Promise<{ pageId: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { pageId } = await params;
  const page = await db.page.findUnique({ where: { id: pageId } });
  if (!page) notFound();

  let pageData: Partial<PageData> = {};
  try { pageData = JSON.parse(page.content); } catch {}

  const components = pageData.components || [];
  const config = pageData.config || { backgroundColor: '#FFFFFF', title: page.title, analytics: { enablePV: false, enableUV: false, enableClickTracking: false } };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-8">
      <div className="w-[375px] bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-800 text-white text-center py-1 text-xs">Preview Mode</div>
        <div style={{ backgroundColor: config.backgroundColor }}>
          <PageRenderer components={components} products={mockProducts} isSSR />
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
