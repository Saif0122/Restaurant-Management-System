import { z } from 'zod';
import { OrderStatus } from '../models/Order.model';

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
});

export const updateKitchenNotesSchema = z.object({
  body: z.object({
    kitchenNotes: z.string().max(500),
  }),
});

export const updateEstimatedPrepTimeSchema = z.object({
  body: z.object({
    estimatedPrepTime: z.number().int().min(0),
  }),
});

export const assignTableSchema = z.object({
  body: z.object({
    tableNumber: z.string().min(1),
  }),
});

export const startShiftSchema = z.object({
  body: z.object({
    notes: z.string().max(500).optional(),
  }),
});

export const endShiftSchema = z.object({
  body: z.object({
    notes: z.string().max(500).optional(),
  }),
});

export const createRestockRequestSchema = z.object({
  body: z.object({
    foodId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Food ID'),
    quantity: z.number().int().min(1),
    notes: z.string().max(500).optional(),
  }),
});

export const addOrderNotesSchema = z.object({
  body: z.object({
    notes: z.string().max(500),
  }),
});
