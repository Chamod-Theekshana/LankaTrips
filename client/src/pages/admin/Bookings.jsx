import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';

export default function Bookings() {
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await api.get('/api/bookings', { params: { limit: 50 } });
    setItems(data.data || []);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    await api.patch(`/api/bookings/${id}/status`, { status });
    await load();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Bookings</h2>

      <div className="mt-6 space-y-3">
        {items.map(b => (
          <div key={b._id} className="border rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{b.packageRef?.title}</p>
                <p className="text-sm text-slate-600">
                  {b.userRef?.name} ({b.userRef?.email}) • {new Date(b.date).toDateString()}
                </p>
                <p className="text-sm text-slate-700 mt-2">
                  Travelers: {b.travelers} • Pickup: {b.pickupCity} • Phone: {b.phone}
                </p>
                <p className="text-sm font-bold mt-2">Total: LKR {Number(b.totalPrice).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{b.status}</span>
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  {['pending','confirmed','completed','cancelled'].map(s => (
                    <button key={s} onClick={() => setStatus(b._id, s)}
                      className="text-xs px-2 py-1 rounded-md border hover:bg-slate-50">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-slate-600">No bookings.</p>}
      </div>
    </div>
  );
}
