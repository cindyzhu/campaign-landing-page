'use client';

import { useState, useEffect } from 'react';
import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

function getTimeLeft(endTime: string) {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownRenderer({ node }: Props) {
  const { endTime, label = 'Ends In' } = node.props as { endTime?: string; label?: string };
  const [time, setTime] = useState(getTimeLeft(endTime || new Date().toISOString()));

  useEffect(() => {
    if (!endTime) return;
    const timer = setInterval(() => setTime(getTimeLeft(endTime)), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      style={{
        padding: node.style.padding || '16px',
        backgroundColor: node.style.backgroundColor,
        color: node.style.color,
        textAlign: (node.style.textAlign as React.CSSProperties['textAlign']) || 'center',
      }}
    >
      <div className="text-sm font-medium mb-2 opacity-80">{label}</div>
      <div className="flex items-center justify-center gap-2 text-2xl font-bold font-mono">
        {time.days > 0 && (
          <>
            <span className="bg-black/20 px-2 py-1 rounded">{pad(time.days)}</span>
            <span className="opacity-60">:</span>
          </>
        )}
        <span className="bg-black/20 px-2 py-1 rounded">{pad(time.hours)}</span>
        <span className="opacity-60">:</span>
        <span className="bg-black/20 px-2 py-1 rounded">{pad(time.minutes)}</span>
        <span className="opacity-60">:</span>
        <span className="bg-black/20 px-2 py-1 rounded">{pad(time.seconds)}</span>
      </div>
    </div>
  );
}
