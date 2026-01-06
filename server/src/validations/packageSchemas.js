import { z } from 'zod';

export const createPackageSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    price: z.number().min(0, 'Price must be positive'),
    durationDays: z.number().min(1, 'Duration must be at least 1 day'),
    category: z.string().min(2, 'Category is required'),
    region: z.string().min(2, 'Region is required'),
    locationRefs: z.string().optional(),
    itinerary: z.string().optional(),
    includes: z.string().optional(),
    excludes: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

export const updatePackageSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').optional(),
    price: z.number().min(0, 'Price must be positive').optional(),
    durationDays: z.number().min(1, 'Duration must be at least 1 day').optional(),
    category: z.string().min(2, 'Category is required').optional(),
    region: z.string().min(2, 'Region is required').optional(),
    locationRefs: z.string().optional(),
    itinerary: z.string().optional(),
    includes: z.string().optional(),
    excludes: z.string().optional(),
  }),
});