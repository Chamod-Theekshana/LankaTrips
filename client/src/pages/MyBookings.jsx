import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function MyBookings() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/bookings/me');
      setItems(data.data || []);
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">My Bookings</h2>

      <div className="mt-6 space-y-3">
        {items.map(b => {
          const pkg = b.packageRef;
          const raw = pkg?.images?.[0];
          const img = raw ? (String(raw).startsWith('http') ? raw : `${apiBase}${raw}`) : null;
          return (
            <div key={b._id} className="border rounded-xl p-4 flex gap-4">
              {img && <img src={img} className="w-28 h-20 object-cover rounded-lg border" alt={pkg?.title} />}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{pkg?.title}</p>
                    <p className="text-sm text-slate-600">{new Date(b.date).toDateString()} • {b.travelers} travelers</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{b.status}</span>
                </div>
                <p className="text-sm text-slate-700 mt-2">Pickup: {b.pickupCity} • Phone: {b.phone}</p>
                <p className="text-sm font-bold mt-2">Total: LKR {Number(b.totalPrice).toLocaleString()}</p>
              </div>
            </div>
          );
        })}
        {!items.length && <p className="text-slate-600">No bookings yet.</p>}
      </div>
    </div>
  );
}
