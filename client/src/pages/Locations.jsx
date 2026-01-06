import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { LocationCard } from '../components/Cards';
import Pagination from '../components/Pagination';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Locations() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0 });
  const [q, setQ] = useState('');

  async function load(page = 1) {
    const { data } = await api.get('/api/locations', { params: { page, q } });
    setItems(data.data || []);
    setMeta(data.meta || { page, limit: 12, total: 0 });
  }

  useEffect(() => { load(1); }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Locations</h2>
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="border rounded-md px-3 py-2 text-sm" placeholder="Search..." />
          <button onClick={() => load(1)} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">Search</button>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => <LocationCard key={it._id} item={it} apiBase={apiBase} />)}
      </div>

      <Pagination page={meta.page} total={meta.total} limit={meta.limit} onPage={(p) => load(p)} />
    </div>
  );
}
