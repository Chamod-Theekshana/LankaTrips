import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/axios';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function PackageDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/packages/${id}`);
      setItem(data.data);
    })();
  }, [id]);

  if (!item) return <div>Loading...</div>;
  const imgs = (item.images || []).map((p) => (String(p).startsWith('http') ? p : `${apiBase}${p}`));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">{item.title}</h2>
          <div className="text-sm text-slate-600 flex gap-3">
            <span>{item.durationDays} days</span>
            <span>{item.category}</span>
            <span>{item.region}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">LKR {Number(item.price).toLocaleString()}</div>
          <Link to={`/checkout/${item._id}`} className="mt-2 inline-flex px-4 py-2 rounded-md bg-slate-900 text-white text-sm">
            Book this package
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {imgs.map((src) => (
          <img key={src} src={src} alt={item.title} className="w-full h-64 object-cover rounded-xl border" />
        ))}
      </div>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold">Itinerary</h3>
          <ul className="list-disc pl-6 space-y-1">
            {(item.itinerary || []).map((line, idx) => <li key={idx}>{line}</li>)}
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Includes</h3>
            <ul className="list-disc pl-6 space-y-1">
              {(item.includes || []).map((line, idx) => <li key={idx}>{line}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Excludes</h3>
            <ul className="list-disc pl-6 space-y-1">
              {(item.excludes || []).map((line, idx) => <li key={idx}>{line}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {item.locationRefs?.length ? (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold">Locations covered</h3>
          <div className="flex flex-wrap gap-2">
            {item.locationRefs.map((l) => (
              <span key={l._id} className="text-xs px-2 py-1 rounded-full bg-slate-100">
                {l.name} ({l.region})
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
