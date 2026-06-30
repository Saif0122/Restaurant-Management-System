import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(50).optional(),
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    phone: z.string().optional(),
  }),
});

export const addressSchema = z.object({
  body: z.object({
    label: z.enum(['Home', 'Work', 'Other']).optional(),
    street: z.string().min(5).max(100),
    city: z.string().min(2).max(50),
    state: z.string().min(2).max(50),
    zipCode: z.string().min(3).max(20),
    country: z.string().min(2).max(50),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    label: z.enum(['Home', 'Work', 'Other']).optional(),
    street: z.string().min(5).max(100).optional(),
    city: z.string().min(2).max(50).optional(),
    state: z.string().min(2).max(50).optional(),
    zipCode: z.string().min(3).max(20).optional(),
    country: z.string().min(2).max(50).optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const addressIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
