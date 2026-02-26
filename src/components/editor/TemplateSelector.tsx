'use client';

import { useState } from 'react';
import { mockTemplates } from '@/mock/templates';
import { useEditorStore } from '@/store/editor-store';

interface Props {
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All',
  'year-end': 'Year-End Sale',
  'mothers-day': "Mother's Day",
  'community': 'Community',
  'summer': 'Summer Fruits',
  'spring': 'Spring Produce',
  'golden-week': 'Golden Week',
  'flash-sale': 'Flash Sale',
  'new-arrival': 'New Arrival',
  'holiday': 'Holiday',
  'brand': 'Brand',
};

export default function TemplateSelector({ onClose }: Props) {
  const page = useEditorStore((s) => s.page);
  const loadPage = useEditorStore((s) => s.loadPage);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSelect = (templateId: string) => {
    const template = mockTemplates.find((t) => t.id === templateId);
    if (!template || !page) return;

    loadPage({
      ...page,
      config: { ...template.config },
      components: JSON.parse(JSON.stringify(template.components)),
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const categories = ['all', ...Array.from(new Set(mockTemplates.map((t) => t.category)))];
  const filtered = activeCategory === 'all'
    ? mockTemplates
    : mockTemplates.filter((t) => t.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Choose Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelect(tpl.id)}
              className="text-left border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="h-40 flex items-center justify-center" style={{ backgroundColor: tpl.config.backgroundColor }}>
                <span className="text-white/80 font-bold text-lg drop-shadow-sm">{tpl.name}</span>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{tpl.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                  {CATEGORY_LABELS[tpl.category] || tpl.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
