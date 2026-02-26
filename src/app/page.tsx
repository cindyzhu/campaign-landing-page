'use client';

import { useEffect, useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  pages: { id: string; status: string; publishedUrl?: string }[];
  createdAt: string;
}

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns');
    const data = await res.json();
    setCampaigns(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: '', description: '', startTime: '', endTime: '' });
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    fetchCampaigns();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Campaign Builder</h1>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            + New Campaign
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No campaigns yet</p>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Create Your First Campaign</button>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((c) => (
              <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div>
                  <h2 className="font-semibold text-gray-900">{c.name}</h2>
                  {c.description && <p className="text-sm text-gray-500 mt-0.5">{c.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className={`px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                    <span>{new Date(c.startTime).toLocaleDateString()} - {new Date(c.endTime).toLocaleDateString()}</span>
                    <span>{c.pages.length} page(s)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.pages[0]?.publishedUrl && (
                    <a href={c.pages[0].publishedUrl} target="_blank" rel="noopener" className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100">View H5</a>
                  )}
                  <a href={`/editor/${c.id}`} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100">Edit</a>
                  <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <form onSubmit={handleCreate} className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Campaign</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Name *</label>
                <input required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Summer Flash Sale" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Description</label>
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Start *</label>
                  <input required type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">End *</label>
                  <input required type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
