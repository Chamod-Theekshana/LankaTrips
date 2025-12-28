import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/admin/dashboard');
      setStats(data.data);
    })();
  }, []);

  if (!stats) return <div>Loading...</div>;

  const card = (label, value) => (
    <div className="border rounded-xl p-4">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {card('Total bookings', stats.totalBookings)}
        {card('Pending', stats.pendingBookings)}
        {card('Confirmed', stats.confirmedBookings)}
        {card('Completed', stats.completedBookings)}
      </div>

      <div className="mt-4 border rounded-xl p-4">
        <p className="text-sm text-slate-600">Revenue (PAID receipts)</p>
        <p className="text-2xl font-bold mt-1">LKR {Number(stats.revenue).toLocaleString()}</p>
      </div>
    </div>
  );
}
