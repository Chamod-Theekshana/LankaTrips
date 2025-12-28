import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function LocationDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/locations/${id}`);
      setItem(data.data);
    })();
  }, [id]);

  if (!item) return <div>Loading...</div>;
  const imgs = (item.images || []).map((p) => (String(p).startsWith('http') ? p : `${apiBase}${p}`));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{item.name}</h2>
        <p className="text-slate-600">{item.region}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {imgs.map((src) => (
          <img key={src} src={src} alt={item.name} className="w-full h-64 object-cover rounded-xl border" />
        ))}
      </div>

      <p className="text-slate-800 leading-relaxed">{item.description}</p>

      {item.mapUrl && (
        <a className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border hover:bg-slate-50" href={item.mapUrl} target="_blank" rel="noreferrer">
          Open map
        </a>
      )}

      {item.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-full bg-slate-100">{t}</span>)}
        </div>
      ) : null}
    </div>
  );
}
