import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';

export default function ManagePackages() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    price: 0,
    durationDays: 1,
    category: '',
    region: '',
    locationRefs: '',
    itinerary: '',
    includes: '',
    excludes: ''
  });

  async function load() {
    const [pkgs, locs] = await Promise.all([
      api.get('/api/packages', { params: { limit: 50 } }),
      api.get('/api/locations', { params: { limit: 50 } })
    ]);
    setItems(pkgs.data.data || []);
    setLocations(locs.data.data || []);
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

    await api.post('/api/packages', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setFiles([]);
    setForm({ title: '', price: 0, durationDays: 1, category: '', region: '', locationRefs: '', itinerary: '', includes: '', excludes: '' });
    await load();
  }

  async function del(id) {
    if (!confirm('Delete package?')) return;
    await api.delete(`/api/packages/${id}`);
    await load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Packages</h2>

      <form onSubmit={create} className="border rounded-xl p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="border rounded-md px-3 py-2" />
          <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="border rounded-md px-3 py-2" />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <input type="number" name="price" value={form.price} onChange={onChange} placeholder="Price (LKR)" className="border rounded-md px-3 py-2" />
          <input type="number" name="durationDays" value={form.durationDays} onChange={onChange} placeholder="Duration days" className="border rounded-md px-3 py-2" />
          <input name="region" value={form.region} onChange={onChange} placeholder="Region" className="border rounded-md px-3 py-2" />
        </div>

        <div className="border rounded-md p-3 bg-slate-50">
          <p className="text-sm font-medium">Location IDs (comma separated)</p>
          <p className="text-xs text-slate-600 mt-1">Tip: copy from this list:</p>
          <div className="mt-2 text-xs grid md:grid-cols-2 gap-2">
            {locations.map(l => (
              <div key={l._id} className="border rounded-md p-2 bg-white">
                <span className="font-semibold">{l.name}</span>
                <div className="font-mono text-slate-600 break-all">{l._id}</div>
              </div>
            ))}
          </div>
        </div>

        <input name="locationRefs" value={form.locationRefs} onChange={onChange} placeholder="locationRefs: id1,id2,id3" className="border rounded-md px-3 py-2 w-full" />

        <textarea name="itinerary" value={form.itinerary} onChange={onChange} placeholder="Itinerary (one line per day)" className="border rounded-md px-3 py-2 w-full" rows="3" />
        <div className="grid md:grid-cols-2 gap-3">
          <textarea name="includes" value={form.includes} onChange={onChange} placeholder="Includes (one per line)" className="border rounded-md px-3 py-2 w-full" rows="3" />
          <textarea name="excludes" value={form.excludes} onChange={onChange} placeholder="Excludes (one per line)" className="border rounded-md px-3 py-2 w-full" rows="3" />
        </div>

        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        <button className="px-4 py-2 rounded-md bg-slate-900 text-white">Create</button>
      </form>

      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-slate-50 px-4 py-2 text-xs font-semibold">
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Days</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {items.map(i => (
          <div key={i._id} className="grid grid-cols-12 gap-2 px-4 py-2 border-t text-sm">
            <div className="col-span-6">{i.title}</div>
            <div className="col-span-2 text-slate-600">LKR {Number(i.price).toLocaleString()}</div>
            <div className="col-span-2 text-slate-600">{i.durationDays}</div>
            <div className="col-span-2 text-right">
              <button onClick={() => del(i._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
