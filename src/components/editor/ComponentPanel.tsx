'use client';

import { useDraggable } from '@dnd-kit/core';
import { useEditorStore, createComponentNode } from '@/store/editor-store';
import type { ComponentType } from '@/types/page';

const COMPONENT_LIST: { type: ComponentType; label: string; icon: string }[] = [
  { type: 'nav-bar', label: 'Nav Bar', icon: 'M4 6h16M4 12h16' },
  { type: 'banner', label: 'Banner', icon: 'M3 3h18v12H3zM8 21h8' },
  { type: 'text-block', label: 'Text', icon: 'M4 7V4h16v3M9 20h6M12 4v16' },
  { type: 'image-block', label: 'Image', icon: 'M3 3h18v18H3zM8.5 8.5a1 1 0 100-2 1 1 0 000 2M21 15l-5-5L5 21' },
  { type: 'button', label: 'Button', icon: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM8 12h8' },
  { type: 'product-card', label: 'Product', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z' },
  { type: 'product-grid', label: 'Grid', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { type: 'coupon', label: 'Coupon', icon: 'M2 9a3 3 0 013-3h14a3 3 0 013 3v6a3 3 0 01-3 3H5a3 3 0 01-3-3V9zM13 6v12' },
  { type: 'countdown', label: 'Countdown', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2' },
  { type: 'divider', label: 'Divider', icon: 'M3 12h18' },
  { type: 'spacer', label: 'Spacer', icon: 'M12 5v14M5 12h14' },
  { type: 'price-table', label: 'Price Tiers', icon: 'M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z' },
  { type: 'product-list', label: 'Product List', icon: 'M4 6h16M4 12h16M4 18h16' },
  { type: 'promo-section', label: 'Promo Title', icon: 'M3 6l3-3h12l3 3M6 6v12h12V6' },
  { type: 'contact-bar', label: 'Contact', icon: 'M3 5h18v14H3V5zM3 5l9 7 9-7' },
  { type: 'recharge-card', label: 'Top-up Card', icon: 'M12 2v4m0 12v4M2 12h4m12 0h4M12 8a4 4 0 100 8 4 4 0 000-8z' },
  { type: 'flash-deal', label: 'Flash Deal', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
];

function DraggableItem({ type, label, icon }: { type: ComponentType; label: string; icon: string }) {
  const addComponent = useEditorStore((s) => s.addComponent);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: { isNew: true, type },
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => addComponent(createComponentNode(type))}
      className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-grab active:cursor-grabbing"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d={icon} />
      </svg>
      <span className="text-xs text-gray-600">{label}</span>
    </button>
  );
}

export default function ComponentPanel() {
  return (
    <div className="w-60 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">Components</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {COMPONENT_LIST.map(({ type, label, icon }) => (
          <DraggableItem key={type} type={type} label={label} icon={icon} />
        ))}
      </div>
    </div>
  );
}
