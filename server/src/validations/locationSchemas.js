import { z } from 'zod';

export const createLocationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    region: z.string().min(2),
    description: z.string().min(10),
    mapUrl: z.string().url().optional().or(z.literal('')),
    tags: z.string().optional(), // comma separated from form; controller will split
  }),
});

export const updateLocationSchema = createLocationSchema;
