'use client';

import { useState, useEffect } from 'react';
import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function BannerRenderer({ node }: Props) {
  const { images = [], autoplay = true, interval = 3000 } = node.props as {
    images?: string[];
    autoplay?: boolean;
    interval?: number;
  };
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, images.length]);

  const bgColor = node.style.backgroundColor || '#F3F4F6';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: node.style.width || '100%',
        height: node.style.height || '200px',
        backgroundColor: bgColor,
      }}
    >
      {images.length > 0 ? (
        images.map((src, i) => (
          <img
            key={i}
            src={src as string}
            alt={`Banner ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0 }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
          Banner Image
        </div>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
