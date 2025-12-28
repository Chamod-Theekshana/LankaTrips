import { z } from 'zod';

export const createPackageSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    price: z.coerce.number().min(0),
    durationDays: z.coerce.number().min(1),
    category: z.string().min(2),
    region: z.string().min(2),
    locationRefs: z.string().optional(), // comma-separated ids
    itinerary: z.string().optional(), // newline-separated
    includes: z.string().optional(), // newline-separated
    excludes: z.string().optional(), // newline-separated
  }),
});

export const updatePackageSchema = createPackageSchema;
