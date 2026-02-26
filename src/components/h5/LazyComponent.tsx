'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface LazyComponentProps {
  children: ReactNode;
  componentId: string;
  rootMargin?: string;
}

export function LazyComponent({
  children,
  componentId,
  rootMargin = '200px',
}: LazyComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} data-component-id={componentId}>
      {isVisible ? (
        children
      ) : (
        <div className="animate-pulse bg-gray-100 rounded-lg" style={{ minHeight: 120 }}>
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
