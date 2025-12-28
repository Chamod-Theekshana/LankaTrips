import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';

export default function ManageLocations() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', region: '', description: '', mapUrl: '', tags: '' });
  const [files, setFiles] = useState([]);

  async function load() {
    const { data } = await api.get('/api/locations', { params: { limit: 50 } });
    setItems(data.data || []);
  }

  useEffect(() => { load(); }, []);

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function create(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    for (const f of files) fd.append('images', f);

    await api.post('/api/locations', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setForm({ name: '', region: '', description: '', mapUrl: '', tags: '' });
    setFiles([]);
    await load();
  }

  async function del(id) {
    if (!confirm('Delete location?')) return;
    await api.delete(`/api/locations/${id}`);
    await load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Locations</h2>

      <form onSubmit={create} className="border rounded-xl p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="border rounded-md px-3 py-2" />
          <input name="region" value={form.region} onChange={onChange} placeholder="Region" className="border rounded-md px-3 py-2" />
        </div>
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="border rounded-md px-3 py-2 w-full" rows="3" />
        <div className="grid md:grid-cols-2 gap-3">
          <input name="mapUrl" value={form.mapUrl} onChange={onChange} placeholder="Map URL (optional)" className="border rounded-md px-3 py-2" />
          <input name="tags" value={form.tags} onChange={onChange} placeholder="Tags comma-separated" className="border rounded-md px-3 py-2" />
        </div>
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        <button className="px-4 py-2 rounded-md bg-slate-900 text-white">Create</button>
      </form>

      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-slate-50 px-4 py-2 text-xs font-semibold">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Region</div>
          <div className="col-span-3">Tags</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {items.map(i => (
          <div key={i._id} className="grid grid-cols-12 gap-2 px-4 py-2 border-t text-sm">
            <div className="col-span-4">{i.name}</div>
            <div className="col-span-3 text-slate-600">{i.region}</div>
            <div className="col-span-3 text-slate-600">{(i.tags || []).join(', ')}</div>
            <div className="col-span-2 text-right">
              <button onClick={() => del(i._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
