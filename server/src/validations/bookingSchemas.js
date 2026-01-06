import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    packageId: z.string().min(1, 'Package ID is required'),
    date: z.string().refine((date) => {
      const bookingDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return bookingDate >= today;
    }, 'Travel date must be today or in the future'),
    travelers: z.number().min(1, 'At least 1 traveler required').max(50, 'Maximum 50 travelers'),
    pickupCity: z.string().min(2, 'Pickup city is required'),
    phone: z.string().min(5, 'Valid phone number is required'),
  }),
});