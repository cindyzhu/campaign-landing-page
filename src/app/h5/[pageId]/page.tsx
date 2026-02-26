import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/h5/PageRenderer';
import { TrackingScript } from '@/components/h5/TrackingScript';
import { mockProducts } from '@/mock/products';
import type { PageData } from '@/types/page';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ pageId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId } = await params;
  const page = await db.page.findUnique({ where: { id: pageId } });
  if (!page) return { title: 'Page Not Found' };

  let pageData: Partial<PageData> = {};
  try { pageData = JSON.parse(page.content); } catch {}

  return {
    title: pageData.config?.title || page.title,
    description: pageData.config?.shareDescription,
    openGraph: {
      title: pageData.config?.shareTitle || page.title,
      description: pageData.config?.shareDescription,
      images: pageData.config?.shareImage ? [pageData.config.shareImage] : [],
    },
  };
}

export default async function H5Page({ params }: Props) {
  const { pageId } = await params;
  const page = await db.page.findUnique({ where: { id: pageId } });
  if (!page) notFound();

  let pageData: Partial<PageData> = {};
  try { pageData = JSON.parse(page.content); } catch {}

  const components = pageData.components || [];
  const config = pageData.config || {
    backgroundColor: '#FFFFFF',
    title: page.title,
    analytics: { enablePV: true, enableUV: true, enableClickTracking: true },
  };

  return (
    <div style={{ backgroundColor: config.backgroundColor, minHeight: '100vh' }}>
      <PageRenderer components={components} products={mockProducts} isSSR />
      <TrackingScript pageId={pageId} campaignId={page.campaignId} config={config.analytics} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
