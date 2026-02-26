'use client';

import type { ComponentNode } from '@/types/page';
import { mockProducts } from '@/mock/products';
import { formatPrice } from '@/lib/utils';

interface Props {
  component: ComponentNode;
}

export default function ComponentPreview({ component }: Props) {
  if (!component.visible) return null;

  const products = (component.dataBinding?.productIds || [])
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter(Boolean);

  switch (component.type) {
    case 'banner':
      return (
        <div
          className="flex items-center justify-center text-white font-bold"
          style={{ height: component.style.height || '200px', backgroundColor: component.style.backgroundColor || '#6366F1' }}
        >
          Banner
        </div>
      );

    case 'product-card': {
      const p = products[0];
      return p ? (
        <div className="flex gap-3 p-3 border border-gray-200 rounded-lg" style={{ backgroundColor: component.style.backgroundColor }}>
          <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">IMG</div>
          <div className="min-w-0 flex flex-col justify-center">
            <p className="text-sm font-medium truncate">{p.name}</p>
            <span className="text-red-500 font-bold text-sm">{formatPrice(p.price)}</span>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-400 text-sm">Product Card - Click to bind</div>
      );
    }

    case 'product-grid': {
      const cols = (component.props.columns as number) || 2;
      const gap = (component.props.gap as number) || 12;
      return (
        <div style={{ padding: component.style.padding }}>
          {products.length > 0 ? (
            <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
              {products.map((p) => (
                <div key={p!.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                  <div className="p-2">
                    <p className="text-xs truncate">{p!.name}</p>
                    <span className="text-red-500 font-bold text-xs">{formatPrice(p!.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 text-sm">Product Grid - Click to bind</div>
          )}
        </div>
      );
    }

    case 'text-block': {
      const Tag = (['h1', 'h2', 'h3'].includes(component.props.level as string) ? component.props.level : 'p') as keyof React.JSX.IntrinsicElements;
      return (
        <Tag style={{ padding: component.style.padding, fontSize: component.style.fontSize, fontWeight: component.style.fontWeight as React.CSSProperties['fontWeight'], color: component.style.color, textAlign: component.style.textAlign, backgroundColor: component.style.backgroundColor, margin: 0 }}>
          {(component.props.content as string) || 'Text'}
        </Tag>
      );
    }

    case 'image-block':
      return (
        <div style={{ width: component.style.width || '100%', height: component.style.height || '180px', backgroundColor: '#F3F4F6', borderRadius: component.style.borderRadius }} className="flex items-center justify-center text-gray-400">
          {component.props.src ? <img src={component.props.src as string} alt="" className="w-full h-full object-cover" /> : 'Image Placeholder'}
        </div>
      );

    case 'button':
      return (
        <div style={{ margin: component.style.margin }}>
          <div style={{ padding: component.style.padding || '12px 24px', backgroundColor: component.style.backgroundColor || '#3B82F6', color: component.style.color || '#FFF', fontWeight: component.style.fontWeight as React.CSSProperties['fontWeight'] || 'bold', textAlign: component.style.textAlign || 'center', borderRadius: component.style.borderRadius || '8px', fontSize: component.style.fontSize || 14 }}>
            {(component.props.text as string) || 'Button'}
          </div>
        </div>
      );

    case 'coupon':
      return (
        <div style={{ margin: component.style.margin || '12px 16px', padding: component.style.padding || '16px', backgroundColor: component.style.backgroundColor || '#FEF3C7', borderRadius: component.style.borderRadius || '12px', textAlign: 'center', color: component.style.color }}>
          <div className="text-xl font-bold">{(component.props.discount as string) || '20% OFF'}</div>
          <div className="mt-2 text-sm font-mono bg-white/30 rounded-full inline-block px-3 py-1">{(component.props.code as string) || 'CODE'}</div>
        </div>
      );

    case 'countdown':
      return (
        <div style={{ padding: component.style.padding || '16px', textAlign: 'center', backgroundColor: component.style.backgroundColor, color: component.style.color }}>
          <div className="text-sm mb-2">{(component.props.label as string) || 'Ends In'}</div>
          <div className="flex items-center justify-center gap-2 font-mono font-bold text-lg">
            <span className="bg-black/20 px-2 py-1 rounded">23</span>:<span className="bg-black/20 px-2 py-1 rounded">59</span>:<span className="bg-black/20 px-2 py-1 rounded">59</span>
          </div>
        </div>
      );

    case 'divider':
      return <div style={{ margin: component.style.margin || '8px 0', height: '1px', backgroundColor: component.style.backgroundColor || '#E5E7EB' }} />;

    case 'spacer': {
      const h = (component.props.height as number) || 24;
      return (
        <div style={{ height: h }} className="relative">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-[10px] text-gray-300 bg-white px-1">{h}px</span></div>
        </div>
      );
    }

    case 'nav-bar':
      return (
        <div className="flex items-center" style={{ padding: component.style.padding || '12px 16px', backgroundColor: (component.props.backgroundColor as string) || '#1F2937', color: (component.props.textColor as string) || '#FFF', fontSize: component.style.fontSize || 16 }}>
          <span className="font-medium">{(component.props.title as string) || 'Page Title'}</span>
        </div>
      );

    case 'price-table': {
      const tiers = (component.props.tiers as Array<{threshold: number; discount: number; label?: string}>) || [];
      const currency = (component.props.currency as string) || '$';
      return (
        <div style={{ padding: component.style.padding || '16px', margin: component.style.margin, backgroundColor: component.style.backgroundColor || '#FEF2F2', borderRadius: component.style.borderRadius || '12px' }}>
          <div className="text-sm font-bold mb-2 text-center" style={{ color: component.style.color }}>
            {(component.props.title as string) || 'Discount Tiers'}
          </div>
          {tiers.map((tier, i) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-dashed border-red-200 last:border-0 text-xs">
              <span>Spend {currency}{tier.threshold}</span>
              <span className="text-red-500 font-bold">Save {currency}{tier.discount}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'product-list': {
      const items = (component.props.items as Array<{name: string; spec: string; price: number}>) || [];
      return (
        <div style={{ padding: component.style.padding, backgroundColor: component.style.backgroundColor }}>
          <div className="text-sm font-bold mb-2">{(component.props.title as string) || 'Product List'}</div>
          {items.length > 0 ? items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 text-xs">
              <span className="text-gray-400 w-4">{i + 1}</span>
              <span className="flex-1 truncate">{item.name}</span>
              <span className="text-gray-400">{item.spec}</span>
              <span className="text-red-500 font-bold">¥{item.price}</span>
            </div>
          )) : products.length > 0 ? products.slice(0, 3).map((p, i) => (
            <div key={p!.id} className="flex items-center gap-2 py-1.5 border-b border-gray-100 text-xs">
              <span className="text-gray-400 w-4">{i + 1}</span>
              <span className="flex-1 truncate">{p!.name}</span>
              <span className="text-red-500 font-bold">{formatPrice(p!.price)}</span>
            </div>
          )) : (
            <div className="border border-dashed border-gray-300 rounded p-4 text-center text-gray-400 text-xs">Product List - Add items</div>
          )}
        </div>
      );
    }

    case 'promo-section': {
      const accentColor = (component.props.accentColor as string) || '#EF4444';
      return (
        <div style={{ padding: component.style.padding, textAlign: 'center', backgroundColor: component.style.backgroundColor }}>
          <div className="inline-block px-6 py-2 rounded-full text-white font-bold text-sm" style={{ backgroundColor: accentColor }}>
            {(component.props.title as string) || 'Featured'}
          </div>
          {(component.props.subtitle as string) ? (
            <div className="text-xs mt-1 opacity-60" style={{ color: component.style.color }}>
              {component.props.subtitle as string}
            </div>
          ) : null}
        </div>
      );
    }

    case 'contact-bar':
      return (
        <div style={{ padding: component.style.padding, margin: component.style.margin, backgroundColor: component.style.backgroundColor || '#F9FAFB', borderRadius: component.style.borderRadius || '8px' }} className="text-xs text-gray-600">
          <div className="flex items-center gap-1.5 mb-1">
            <span>Tel:</span>
            <span className="font-medium">{(component.props.phone as string) || '400-888-8888'}</span>
          </div>
          {(component.props.address as string) ? <div className="truncate">{component.props.address as string}</div> : null}
        </div>
      );

    case 'recharge-card': {
      const pay = (component.props.payAmount as number) || 2000;
      const get = (component.props.getAmount as number) || 2300;
      return (
        <div style={{ padding: component.style.padding, margin: component.style.margin, backgroundColor: component.style.backgroundColor || '#FFF7ED', borderRadius: component.style.borderRadius || '12px', textAlign: 'center' }}>
          {(component.props.badgeText as string) ? (
            <span className="inline-block px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded-full mb-2">{component.props.badgeText as string}</span>
          ) : null}
          <div className="text-lg font-bold" style={{ color: component.style.color }}>Pay {pay} Get {get}</div>
          <div className="text-xs text-gray-400 mt-1">Save ${get - pay}</div>
        </div>
      );
    }

    case 'flash-deal': {
      const cols = (component.props.columns as number) || 2;
      return (
        <div style={{ padding: component.style.padding }}>
          {products.length > 0 ? (
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {products.slice(0, 4).map((p) => (
                <div key={p!.id} className="border border-red-200 rounded-lg overflow-hidden bg-white">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                  <div className="p-2 text-center">
                    <p className="text-[10px] truncate">{p!.name}</p>
                    <span className="text-red-500 font-bold text-xs">{formatPrice(p!.price)}</span>
                    <div className="mt-1 bg-red-500 text-white text-[10px] rounded px-2 py-0.5 inline-block">
                      {(component.props.buttonText as string) || 'Buy'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 text-sm">Flash Deals - Bind products</div>
          )}
        </div>
      );
    }

    default:
      return <div className="p-4 text-center text-gray-400 text-sm border border-dashed rounded">Unknown: {component.type}</div>;
  }
}
