import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { PackageCard } from '../components/Cards';
import Pagination from '../components/Pagination';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Packages() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0 });

  const [filters, setFilters] = useState({
    q: '',
    category: '',
    region: '',
    priceMin: '',
    priceMax: '',
    durationMin: '',
    durationMax: '',
  });

  async function load(page = 1) {
    const { data } = await api.get('/api/packages', { params: { page, ...filters } });
    setItems(data.data || []);
    setMeta(data.meta || { page, limit: 12, total: 0 });
  }

  useEffect(() => { load(1); }, []);

  function onChange(e) {
    setFilters((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Packages</h2>
      </div>

      <div className="mt-4 grid lg:grid-cols-6 gap-2">
        <input name="q" value={filters.q} onChange={onChange} placeholder="Search..." className="border rounded-md px-3 py-2 text-sm lg:col-span-2" />
        <input name="category" value={filters.category} onChange={onChange} placeholder="Category" className="border rounded-md px-3 py-2 text-sm" />
        <input name="region" value={filters.region} onChange={onChange} placeholder="Region" className="border rounded-md px-3 py-2 text-sm" />
        <input name="priceMin" value={filters.priceMin} onChange={onChange} placeholder="Min price" className="border rounded-md px-3 py-2 text-sm" />
        <input name="priceMax" value={filters.priceMax} onChange={onChange} placeholder="Max price" className="border rounded-md px-3 py-2 text-sm" />
        <button onClick={() => load(1)} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">Apply</button>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => <PackageCard key={it._id} item={it} apiBase={apiBase} />)}
      </div>

      <Pagination page={meta.page} total={meta.total} limit={meta.limit} onPage={(p) => load(p)} />
    </div>
  );
}
