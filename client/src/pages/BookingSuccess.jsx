import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function BookingSuccess() {
  const { bookingId } = useParams();
  return (
    <div className="max-w-xl border rounded-2xl p-8">
      <h2 className="text-2xl font-bold">Booking confirmed ✅</h2>
      <p className="mt-2 text-slate-700">
        Your booking ID: <span className="font-mono">{bookingId}</span>
      </p>
      <div className="mt-6 flex gap-3">
        <Link className="px-4 py-2 rounded-md bg-slate-900 text-white" to="/me/bookings">Go to My Bookings</Link>
        <Link className="px-4 py-2 rounded-md border hover:bg-slate-50" to="/me/receipts">View Receipts</Link>
      </div>
    </div>
  );
}
