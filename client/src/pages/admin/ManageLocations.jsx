import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import { useToast } from '../../components/Toast';

export default function ManageLocations() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', region: '', description: '', mapUrl: '', tags: '', images: [] });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function load() {
    try {
      const { data } = await api.get('/api/locations', { params: { limit: 50 } });
      setItems(data.data || []);
    } catch (err) {
      toast.error('Failed to load locations');
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
    if (!form.name.trim() || form.name.length < 2) {
      toast.error('Name must be at least 2 characters');
      setLoading(false);
      return;
    }
    if (!form.region.trim() || form.region.length < 2) {
      toast.error('Region must be at least 2 characters');
      setLoading(false);
      return;
    }
    if (!form.description.trim() || form.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      setLoading(false);
      return;
    }
    if (form.mapUrl && form.mapUrl.trim() && !isValidUrl(form.mapUrl)) {
      toast.error('Please enter a valid URL for map');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        region: form.region,
        description: form.description,
        mapUrl: form.mapUrl,
        tags: form.tags,
        images: form.images
      };

      await api.post('/api/locations', payload);
      setForm({ name: '', region: '', description: '', mapUrl: '', tags: '', images: [] });
      toast.success('Location created successfully!');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create location');
    } finally {
      setLoading(false);
    }
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function del(id) {
    if (!confirm('Delete location?')) return;
    try {
      await api.delete(`/api/locations/${id}`);
      toast.success('Location deleted successfully!');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete location');
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Locations</h2>

      <form onSubmit={create} className="border rounded-xl p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input 
            name="name" 
            value={form.name} 
            onChange={onChange} 
            placeholder="Name *" 
            className="border rounded-md px-3 py-2" 
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
        <textarea 
          name="description" 
          value={form.description} 
          onChange={onChange} 
          placeholder="Description (min 10 characters) *" 
          className="border rounded-md px-3 py-2 w-full" 
          rows="3" 
          required 
        />
        <div className="grid md:grid-cols-2 gap-3">
          <input 
            name="mapUrl" 
            value={form.mapUrl} 
            onChange={onChange} 
            placeholder="Map URL (optional)" 
            className="border rounded-md px-3 py-2" 
            type="url" 
          />
          <input 
            name="tags" 
            value={form.tags} 
            onChange={onChange} 
            placeholder="Tags comma-separated" 
            className="border rounded-md px-3 py-2" 
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
