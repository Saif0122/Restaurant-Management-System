import { z } from 'zod';
import { PaymentMethod } from '../models/Payment.model';

export const createIntentSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    paymentMethod: z.nativeEnum(PaymentMethod, { message: 'Invalid payment method' }),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    paymentId: z.string().min(1, 'Payment ID is required'),
  }),
});

export const requestRefundSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Payment ID is required'),
  }),
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    reason: z.string().min(1, 'Reason is required').max(500),
  }),
});

export const approveRejectRefundSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Refund ID is required'),
  }),
  body: z.object({
    adminRemarks: z.string().min(1, 'Admin remarks are required').max(500),
  }),
});
