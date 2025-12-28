import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../api/axios';
import { useAuth } from '../state/useAuth';

const schema = z.object({
  date: z.string().min(1, 'Select a travel date'),
  travelers: z.coerce.number().min(1).max(50),
  pickupCity: z.string().min(2),
  phone: z.string().min(5),
});

export default function BookingCheckout() {
  const { id } = useParams(); // package id
  const nav = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { travelers: 2 }
  });

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/packages/${id}`);
      setPkg(data.data);
    })();
  }, [id]);

  async function onSubmit(values) {
    const payload = {
      packageId: id,
      date: values.date,
      travelers: values.travelers,
      pickupCity: values.pickupCity,
      phone: values.phone,
    };
    const { data } = await api.post('/api/bookings', payload);
    nav(`/booking-success/${data.data.bookingId}`);
  }

  if (!pkg) return <div>Loading...</div>;
  if (!user) return <div className="p-6 border rounded-xl">Please login to book.</div>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <p className="text-slate-600 mt-1">{pkg.title}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 border rounded-xl p-6">
        <div>
          <label className="text-sm font-medium">Travel start / receive date</label>
          <input type="date" {...register('date')} className="mt-1 w-full border rounded-md px-3 py-2" />
          {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Number of travelers</label>
          <input type="number" min="1" max="50" {...register('travelers')} className="mt-1 w-full border rounded-md px-3 py-2" />
          {errors.travelers && <p className="text-sm text-red-600 mt-1">{errors.travelers.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Pickup city</label>
          <input {...register('pickupCity')} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Colombo / Kandy / Galle..." />
          {errors.pickupCity && <p className="text-sm text-red-600 mt-1">{errors.pickupCity.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <input {...register('phone')} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="+94..." />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Pay later (default)</p>
            <p className="font-bold">Estimated: LKR {Number(pkg.price).toLocaleString()} x travelers</p>
          </div>
          <button disabled={isSubmitting} className="px-4 py-2 rounded-md bg-slate-900 text-white">
            {isSubmitting ? 'Booking...' : 'Confirm booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
