'use client';

import { useEditorStore } from '@/store/editor-store';
import { useState } from 'react';

interface Props {
  campaignId: string;
  pageId: string | null;
  campaignName: string;
  onShowTemplates: () => void;
}

export default function Toolbar({ campaignId, pageId, campaignName, onShowTemplates }: Props) {
  const page = useEditorStore((s) => s.page);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const historyLength = useEditorStore((s) => s.history.length);
  const [saving, setSaving] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const handleSave = async () => {
    if (!page || !pageId) return;
    setSaving(true);
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: JSON.stringify(page) }),
      });
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!pageId) return;
    try {
      const res = await fetch(`/api/pages/${pageId}/publish`, { method: 'POST' });
      const data = await res.json();
      setPublishedUrl(data.publishedUrl);
    } catch (e) {
      console.error('Publish failed:', e);
    }
  };

  const handlePreview = () => {
    if (pageId) window.open(`/preview/${pageId}`, '_blank');
  };

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600">&larr; Back</a>
        <span className="text-sm font-medium text-gray-700">{campaignName}</span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onShowTemplates} className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Templates</button>
        <div className="w-px h-5 bg-gray-200" />
        <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30" title="Undo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 015 5v2"/><path d="M3 10l4-4"/><path d="M3 10l4 4"/></svg>
        </button>
        <button onClick={redo} disabled={historyIndex >= historyLength - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30" title="Redo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a5 5 0 00-5 5v2"/><path d="M21 10l-4-4"/><path d="M21 10l-4 4"/></svg>
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <button onClick={() => setZoom(zoom - 0.1)} className="text-xs px-1.5 py-1 hover:bg-gray-100 rounded">-</button>
        <span className="text-xs text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.1)} className="text-xs px-1.5 py-1 hover:bg-gray-100 rounded">+</button>
        <div className="w-px h-5 bg-gray-200" />
        <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={handlePreview} className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Preview</button>
        <button onClick={handlePublish} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white">Publish</button>
      </div>

      {publishedUrl && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setPublishedUrl(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Page Published!</h3>
            <p className="text-sm text-gray-600 mb-3">Your page is live at:</p>
            <div className="bg-gray-50 rounded p-3 text-sm font-mono break-all">{window.location.origin}{publishedUrl}</div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}${publishedUrl}`)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Copy Link</button>
              <button onClick={() => setPublishedUrl(null)} className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
