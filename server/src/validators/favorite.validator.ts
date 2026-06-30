import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const favoriteSchema = z.object({
  params: z.object({
    foodId: objectIdSchema,
  }),
});
