'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditorStore } from '@/store/editor-store';
import SortableItem from './SortableItem';
import ComponentPreview from './ComponentPreview';

export default function EditorCanvas() {
  const page = useEditorStore((s) => s.page);
  const selectComponent = useEditorStore((s) => s.selectComponent);
  const zoom = useEditorStore((s) => s.zoom);

  const components = page?.components || [];

  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' });

  return (
    <div className="flex-1 bg-gray-100 overflow-auto flex justify-center py-8" onClick={() => selectComponent(null)}>
      <div
        className="bg-white shadow-xl rounded-2xl overflow-hidden relative"
        style={{ width: 375 * zoom, minHeight: 667 * zoom, transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {components.length === 0 ? (
            <div
              ref={setNodeRef}
              className={`h-[667px] flex items-center justify-center text-sm transition-colors ${isOver ? 'bg-blue-50 text-blue-500 border-2 border-dashed border-blue-300' : 'text-gray-400'}`}
            >
              Drag components here or select a template
            </div>
          ) : (
            <div ref={setNodeRef}>
              {components.map((comp) => (
                <SortableItem key={comp.id} id={comp.id}>
                  <ComponentPreview component={comp} />
                </SortableItem>
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
