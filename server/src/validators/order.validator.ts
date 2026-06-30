import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const placeOrderSchema = z.object({
  body: z.object({
    deliveryAddressId: objectIdSchema,
    couponId: objectIdSchema.optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
