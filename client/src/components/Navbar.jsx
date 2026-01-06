import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../state/useAuth';

const navLink = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">LankaTrips</Link>

        <nav className="flex items-center gap-2">
          <NavLink className={navLink} to="/locations">Locations</NavLink>
          <NavLink className={navLink} to="/packages">Packages</NavLink>

          {user?.role === 'customer' && (
            <>
              <NavLink className={navLink} to="/me/bookings">My Bookings</NavLink>
              <NavLink className={navLink} to="/me/receipts">My Receipts</NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink className={navLink} to="/admin">Admin</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link className="text-sm px-3 py-2 rounded-md border hover:bg-slate-50" to="/login">Login</Link>
              <Link className="text-sm px-3 py-2 rounded-md bg-slate-900 text-white" to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-600 hidden sm:block">
                {user.name} ({user.role})
              </span>
              <button onClick={logout} className="text-sm px-3 py-2 rounded-md border hover:bg-slate-50">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
