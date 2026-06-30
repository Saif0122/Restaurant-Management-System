import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const createReviewSchema = z.object({
  body: z.object({
    foodId: objectIdSchema,
    rating: z.number().int().min(1).max(5),
    review: z.string().min(5).max(1000),
    images: z.array(z.string().url()).optional(),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    review: z.string().min(5).max(1000).optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

export const reviewIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
