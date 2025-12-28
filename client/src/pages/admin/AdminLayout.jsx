import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const link = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`;

export default function AdminLayout() {
  return (
    <div className="grid lg:grid-cols-6 gap-6">
      <aside className="lg:col-span-1 border rounded-xl p-3 h-fit">
        <p className="font-semibold px-3 py-2">Admin</p>
        <nav className="flex lg:flex-col gap-2">
          <NavLink className={link} to="/admin">Dashboard</NavLink>
          <NavLink className={link} to="/admin/locations">Locations</NavLink>
          <NavLink className={link} to="/admin/packages">Packages</NavLink>
          <NavLink className={link} to="/admin/bookings">Bookings</NavLink>
          <NavLink className={link} to="/admin/receipts">Receipts</NavLink>
        </nav>
      </aside>
      <section className="lg:col-span-5">
        <Outlet />
      </section>
    </div>
  );
}
