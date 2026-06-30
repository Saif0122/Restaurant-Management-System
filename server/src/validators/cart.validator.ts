import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const cartItemSchema = z.object({
  body: z.object({
    foodId: objectIdSchema,
    quantity: z
      .number()
      .int()
      .min(1, 'Quantity must be at least 1')
      .max(100, 'Quantity cannot exceed 100'),
    specialInstructions: z
      .string()
      .max(200, 'Special instructions cannot exceed 200 characters')
      .optional(),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    foodId: objectIdSchema,
  }),
  body: z.object({
    quantity: z
      .number()
      .int()
      .min(1, 'Quantity must be at least 1')
      .max(100, 'Quantity cannot exceed 100'),
  }),
});

export const removeCartItemSchema = z.object({
  params: z.object({
    foodId: objectIdSchema,
  }),
});
