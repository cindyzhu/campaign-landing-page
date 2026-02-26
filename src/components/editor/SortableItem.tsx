'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/store/editor-store';

interface Props {
  id: string;
  children: React.ReactNode;
}

export default function SortableItem({ id, children }: Props) {
  const selectedId = useEditorStore((s) => s.selectedComponentId);
  const select = useEditorStore((s) => s.selectComponent);
  const remove = useEditorStore((s) => s.removeComponent);
  const duplicate = useEditorStore((s) => s.duplicateComponent);
  const isSelected = selectedId === id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-1 hover:ring-gray-300'}`}
      onClick={(e) => { e.stopPropagation(); select(id); }}
    >
      <div
        {...attributes}
        {...listeners}
        className={`absolute left-0 top-0 z-10 w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded-br cursor-grab active:cursor-grabbing ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>
      </div>
      {isSelected && (
        <div className="absolute right-0 top-0 z-10 flex gap-px">
          <button onClick={(e) => { e.stopPropagation(); duplicate(id); }} className="w-6 h-6 bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600" title="Duplicate">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); remove(id); }} className="w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-bl hover:bg-red-600" title="Delete">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
