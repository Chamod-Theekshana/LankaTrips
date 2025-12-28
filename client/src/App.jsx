import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Locations from './pages/Locations';
import LocationDetails from './pages/LocationDetails';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import BookingCheckout from './pages/BookingCheckout';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import MyReceipts from './pages/MyReceipts';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageLocations from './pages/admin/ManageLocations';
import ManagePackages from './pages/admin/ManagePackages';
import Bookings from './pages/admin/Bookings';
import Receipts from './pages/admin/Receipts';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:id" element={<LocationDetails />} />

        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout/:id" element={<BookingCheckout />} />
          <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />
          <Route path="/me/bookings" element={<MyBookings />} />
          <Route path="/me/receipts" element={<MyReceipts />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="locations" element={<ManageLocations />} />
            <Route path="packages" element={<ManagePackages />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="receipts" element={<Receipts />} />
          </Route>
        </Route>

        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Route>
    </Routes>
  );
}
