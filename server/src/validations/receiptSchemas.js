import { z } from 'zod';

export const createReceiptSchema = z.object({
  body: z.object({
    bookingId: z.string().min(24),
    paymentMethod: z.string().optional(),
    paymentStatus: z.string().optional(),
  }),
});
