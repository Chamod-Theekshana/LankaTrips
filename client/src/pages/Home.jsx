import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border p-8">
        <h1 className="text-3xl font-bold">Explore Sri Lanka with LankaTrips</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Browse locations, choose a package, book your travel date, and get a receipt instantly.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/packages" className="px-4 py-2 rounded-md bg-slate-900 text-white">Browse Packages</Link>
          <Link to="/locations" className="px-4 py-2 rounded-md border hover:bg-slate-50">Browse Locations</Link>
        </div>
      </section>
    </div>
  );
}
