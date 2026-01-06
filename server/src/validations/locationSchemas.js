import { z } from 'zod';

export const createLocationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    region: z.string().min(2, 'Region is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    mapUrl: z.string().url().optional(),
    tags: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    region: z.string().min(2, 'Region is required').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    mapUrl: z.string().url().optional(),
    tags: z.string().optional(),
  }),
});