import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    packageId: z.string().min(24),
    date: z.coerce.date(),
    travelers: z.coerce.number().min(1).max(50),
    pickupCity: z.string().min(2),
    phone: z.string().min(5).max(30),
  }),
});
