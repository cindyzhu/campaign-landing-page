'use client';

import { useEffect, useState, use } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEditorStore, createComponentNode } from '@/store/editor-store';
import type { PageData, ComponentType } from '@/types/page';
import EditorCanvas from '@/components/editor/EditorCanvas';
import ComponentPanel from '@/components/editor/ComponentPanel';
import PropertyPanel from '@/components/editor/PropertyPanel';
import Toolbar from '@/components/editor/Toolbar';
import TemplateSelector from '@/components/editor/TemplateSelector';
import ComponentPreview from '@/components/editor/ComponentPreview';

interface Props {
  params: Promise<{ campaignId: string }>;
}

export default function EditorPage({ params }: Props) {
  const { campaignId } = use(params);
  const loadPage = useEditorStore((s) => s.loadPage);
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const page = useEditorStore((s) => s.page);
  const [campaignName, setCampaignName] = useState('');
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const components = page?.components || [];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    // New component from panel
    if (active.data.current?.isNew) {
      const type = active.data.current.type as ComponentType;
      const newComp = createComponentNode(type);
      if (!over || over.id === 'canvas-drop-zone') {
        addComponent(newComp);
      } else {
        const overIdx = components.findIndex((c) => c.id === over.id);
        addComponent(newComp, overIdx >= 0 ? overIdx : undefined);
      }
      return;
    }

    // Reorder existing
    if (over && active.id !== over.id) {
      const from = components.findIndex((c) => c.id === active.id);
      const to = components.findIndex((c) => c.id === over.id);
      if (from >= 0 && to >= 0) moveComponent(from, to);
    }
  };

  const activeComponent = components.find((c) => c.id === activeId);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`);
        const campaign = await res.json();
        setCampaignName(campaign.name);

        if (campaign.pages && campaign.pages.length > 0) {
          const dbPage = campaign.pages[0];
          setPageId(dbPage.id);

          let pageContent: Partial<PageData>;
          try {
            pageContent = JSON.parse(dbPage.content);
          } catch {
            pageContent = {};
          }

          const pageData: PageData = {
            id: dbPage.id,
            campaignId: campaign.id,
            title: dbPage.title,
            config: pageContent.config || {
              backgroundColor: '#FFFFFF',
              title: dbPage.title,
              analytics: { enablePV: true, enableUV: true, enableClickTracking: true },
            },
            components: pageContent.components || [],
            status: dbPage.status,
            publishedUrl: dbPage.publishedUrl,
            createdAt: dbPage.createdAt,
            updatedAt: dbPage.updatedAt,
          };
          loadPage(pageData);
        }
      } catch (e) {
        console.error('Failed to load campaign:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-400">Loading editor...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar
        campaignId={campaignId}
        pageId={pageId}
        campaignName={campaignName}
        onShowTemplates={() => setShowTemplates(true)}
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden">
          <ComponentPanel />
          <EditorCanvas />
          <PropertyPanel />
        </div>
        <DragOverlay dropAnimation={null}>
          {activeComponent ? (
            <div className="w-[375px] opacity-80 shadow-lg">
              <ComponentPreview component={activeComponent} />
            </div>
          ) : activeId?.startsWith('new-') ? (
            <div className="px-4 py-2 bg-blue-500 text-white text-sm rounded shadow-lg">
              {activeId.replace('new-', '')}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {showTemplates && <TemplateSelector onClose={() => setShowTemplates(false)} />}
    </div>
  );
}
