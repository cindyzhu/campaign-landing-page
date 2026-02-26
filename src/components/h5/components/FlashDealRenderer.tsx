'use client';

import { useState, useEffect } from 'react';
import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';
import { formatPriceRMB } from '@/lib/utils';

interface Props {
  node: ComponentNode;
  products: Product[];
}

function useCountdown(endTime?: string) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!endTime) return;
    const calc = () => {
      const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
}

export function FlashDealRenderer({ node, products }: Props) {
  const {
    showTimer = true,
    buttonText = 'Buy',
    columns = 2,
  } = node.props as {
    showTimer?: boolean;
    buttonText?: string;
    columns?: number;
  };

  const endTime = (node.props.endTime as string) || undefined;
  const time = useCountdown(showTimer ? endTime : undefined);

  const productIds = node.dataBinding?.productIds || [];
  const dealProducts = products.filter((p) => productIds.includes(p.id));

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      style={{
        padding: node.style.padding || '0 12px',
        margin: node.style.margin,
        backgroundColor: node.style.backgroundColor,
      }}
    >
      {showTimer && endTime && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '8px 0',
            fontSize: 13,
            color: node.style.color || '#EF4444',
          }}
        >
          <span>Ends in</span>
          {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: 14,
                  fontFamily: 'monospace',
                }}
              >
                {v}
              </span>
              {i < 2 && <span style={{ fontWeight: 'bold' }}>:</span>}
            </span>
          ))}
        </div>
      )}
      {dealProducts.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '8px',
          }}
        >
          {dealProducts.map((product) => (
            <a
              key={product.id}
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-product-id={product.id}
              style={{
                display: 'block',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ aspectRatio: '1', backgroundColor: '#F9FAFB', position: 'relative' }}>
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB', fontSize: 12 }}>
                    No Image
                  </div>
                )}
              </div>
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>
                    {formatPriceRMB(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={{ color: '#D1D5DB', fontSize: 11, textDecoration: 'line-through' }}>
                      {formatPriceRMB(product.originalPrice)}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginTop: '6px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    padding: '4px 0',
                    borderRadius: '4px',
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}
                >
                  {buttonText}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '24px 0', fontSize: 14 }}>
          No flash deals yet
        </div>
      )}
    </div>
  );
}
