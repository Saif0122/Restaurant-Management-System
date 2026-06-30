import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const createReservationSchema = z.object({
  body: z.object({
    reservationDate: z.string().datetime({ message: 'Valid ISO date string is required' }),
    reservationTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Valid time in HH:mm format required'),
    guestCount: z
      .number()
      .int()
      .min(1, 'At least 1 guest required')
      .max(20, 'Maximum 20 guests allowed'),
    tableNumber: z.string().optional(),
    occasion: z.string().optional(),
    specialRequest: z.string().max(500).optional(),
  }),
});

export const reservationIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const updateReservationSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    reservationDate: z
      .string()
      .datetime({ message: 'Valid ISO date string is required' })
      .optional(),
    reservationTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Valid time in HH:mm format required')
      .optional(),
    guestCount: z
      .number()
      .int()
      .min(1, 'At least 1 guest required')
      .max(20, 'Maximum 20 guests allowed')
      .optional(),
    tableNumber: z.string().optional(),
    occasion: z.string().optional(),
    specialRequest: z.string().max(500).optional(),
  }),
});
