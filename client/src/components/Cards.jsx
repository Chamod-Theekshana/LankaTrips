import React from 'react';
import { Link } from 'react-router-dom';

export function LocationCard({ item, apiBase }) {
  const raw = item.images?.[0];
  const img = raw ? (raw.startsWith('http') ? raw : `${apiBase}${raw}`) : null;
  return (
    <Link to={`/locations/${item._id}`} className="border rounded-xl overflow-hidden hover:shadow-sm">
      {img && <img src={img} alt={item.name} className="h-40 w-full object-cover" />}
      <div className="p-4">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-slate-600">{item.region}</p>
        <p className="mt-2 text-sm line-clamp-2 text-slate-700">{item.description}</p>
      </div>
    </Link>
  );
}

export function PackageCard({ item, apiBase }) {
  const raw = item.images?.[0];
  const img = raw ? (raw.startsWith('http') ? raw : `${apiBase}${raw}`) : null;
  return (
    <Link to={`/packages/${item._id}`} className="border rounded-xl overflow-hidden hover:shadow-sm">
      {img && <img src={img} alt={item.title} className="h-40 w-full object-cover" />}
      <div className="p-4">
        <h3 className="font-semibold">{item.title}</h3>
        <div className="text-sm text-slate-600 flex gap-3">
          <span>{item.durationDays} days</span>
          <span>{item.category}</span>
          <span>{item.region}</span>
        </div>
        <div className="mt-3 font-bold">LKR {Number(item.price).toLocaleString()}</div>
      </div>
    </Link>
  );
}
