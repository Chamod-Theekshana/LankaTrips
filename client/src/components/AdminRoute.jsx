import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/useAuth';

export default function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
