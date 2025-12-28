import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} LankaTrips
      </footer>
    </div>
  );
}
