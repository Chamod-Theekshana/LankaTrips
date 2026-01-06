import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import CloudinaryUpload from '../../components/CloudinaryUpload';


export default function ManagePackages() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [form, setForm] = useState({
    title: '',
    price: '',
    durationDays: '1',
    category: '',
    region: '',
    locationRefs: '',
    itinerary: '',
    includes: '',
    excludes: '',
    images: []
  });

  async function load() {
    try {
      const [pkgs, locs] = await Promise.all([
        api.get('/api/packages', { params: { limit: 50 } }),
        api.get('/api/locations', { params: { limit: 50 } })
      ]);
      setItems(pkgs.data.data || []);
      setLocations(locs.data.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    }
  }

  useEffect(() => { load(); }, []);

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function create(e) {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!form.title.trim() || form.title.length < 3) {
      toast.error('Title must be at least 3 characters');
      setLoading(false);
      return;
    }
    if (!form.price || Number(form.price) < 0) {
      toast.error('Price must be a valid positive number');
      setLoading(false);
      return;
    }
    if (!form.durationDays || Number(form.durationDays) < 1) {
      toast.error('Duration must be at least 1 day');
      setLoading(false);
      return;
    }
    if (!form.category.trim() || form.category.length < 2) {
      toast.error('Category must be at least 2 characters');
      setLoading(false);
      return;
    }
    if (!form.region.trim() || form.region.length < 2) {
      toast.error('Region must be at least 2 characters');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: form.title,
        price: form.price,
        durationDays: form.durationDays,
        category: form.category,
        region: form.region,
        locationRefs: form.locationRefs,
        itinerary: form.itinerary,
        includes: form.includes,
        excludes: form.excludes,
        images: form.images
      };

      await api.post('/api/packages', payload);
      setForm({ 
        title: '', 
        price: '', 
        durationDays: '1', 
        category: '', 
        region: '', 
        locationRefs: '', 
        itinerary: '', 
        includes: '', 
        excludes: '',
        images: []
      });
      toast.success('Package created successfully!');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  }

  async function del(id) {
    if (!confirm('Delete package?')) return;
    try {
      await api.delete(`/api/packages/${id}`);
      toast.success('Package deleted successfully!');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete package');
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Packages</h2>

      <form onSubmit={create} className="border rounded-xl p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input 
            name="title" 
            value={form.title} 
            onChange={onChange} 
            placeholder="Title *" 
            className="border rounded-md px-3 py-2" 
            required 
          />
          <input 
            name="category" 
            value={form.category} 
            onChange={onChange} 
            placeholder="Category *" 
            className="border rounded-md px-3 py-2" 
            required 
          />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <input 
            type="number" 
            name="price" 
            value={form.price} 
            onChange={onChange} 
            placeholder="Price (LKR) *" 
            className="border rounded-md px-3 py-2" 
            min="0" 
            step="0.01" 
            required 
          />
          <input 
            type="number" 
            name="durationDays" 
            value={form.durationDays} 
            onChange={onChange} 
            placeholder="Duration days *" 
            className="border rounded-md px-3 py-2" 
            min="1" 
            required 
          />
          <input 
            name="region" 
            value={form.region} 
            onChange={onChange} 
            placeholder="Region *" 
            className="border rounded-md px-3 py-2" 
            required 
          />
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

        <input 
          name="locationRefs" 
          value={form.locationRefs} 
          onChange={onChange} 
          placeholder="locationRefs: id1,id2,id3" 
          className="border rounded-md px-3 py-2 w-full" 
        />

        <textarea 
          name="itinerary" 
          value={form.itinerary} 
          onChange={onChange} 
          placeholder="Itinerary (one line per day)" 
          className="border rounded-md px-3 py-2 w-full" 
          rows="3" 
        />
        <div className="grid md:grid-cols-2 gap-3">
          <textarea 
            name="includes" 
            value={form.includes} 
            onChange={onChange} 
            placeholder="Includes (one per line)" 
            className="border rounded-md px-3 py-2 w-full" 
            rows="3" 
          />
          <textarea 
            name="excludes" 
            value={form.excludes} 
            onChange={onChange} 
            placeholder="Excludes (one per line)" 
            className="border rounded-md px-3 py-2 w-full" 
            rows="3" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <CloudinaryUpload 
            multiple 
            onUpload={(urls) => setForm(s => ({ ...s, images: [...s.images, ...urls] }))}
          />
          {form.images.length > 0 && (
            <div className="mt-2 space-y-1">
              {form.images.map((url, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span className="truncate">{url}</span>
                  <button 
                    type="button"
                    onClick={() => setForm(s => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }))}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="px-4 py-2 rounded-md bg-slate-900 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          {loading ? 'Creating...' : 'Create'}
        </button>
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
