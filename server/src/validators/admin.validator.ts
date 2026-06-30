import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

// Common Pagination Schema
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).optional().transform(Number).default('10'),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// Analytics queries
export const analyticsQuerySchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

// User Management Schemas
export const changeUserRoleSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    role: z.enum(['Customer', 'Staff', 'Admin']),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

// Food Management Schemas
export const bulkFoodActionSchema = z.object({
  body: z.object({
    foodIds: z.array(objectIdSchema).min(1, 'At least one food ID is required'),
    action: z.enum(['activate', 'deactivate', 'delete']),
  }),
});

export const foodIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const adjustInventorySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    quantity: z.number(),
    operation: z.enum(['set', 'add', 'subtract']),
  }),
});

export const toggleFoodFlagSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    isFeatured: z.boolean().optional(),
    isTodaysSpecial: z.boolean().optional(),
  }),
});

// Category Management Schemas
export const bulkCategoryActionSchema = z.object({
  body: z.object({
    categoryIds: z.array(objectIdSchema).min(1, 'At least one category ID is required'),
    action: z.enum(['activate', 'deactivate', 'delete']),
  }),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3),
    discountType: z.enum(['Percentage', 'Fixed']),
    value: z.number().positive(),
    minimumOrder: z.number().min(0).optional(),
    usageLimit: z.number().min(1).optional(),
    expiryDate: z.string(), // ISO Date string
    active: z.boolean().optional(),
  }),
});

export const updateCouponSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: createCouponSchema.shape.body.partial(),
});

export const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    image: z.string().url(),
    link: z.string().optional(),
    active: z.boolean().optional(),
    position: z.number().optional(),
  }),
});

export const updateBannerSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: createBannerSchema.shape.body.partial(),
});

export const idParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

// Reservation Management Schemas
export const updateReservationStatusSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']),
    tableNumber: z.string().optional(),
    notes: z.string().optional(),
  }),
});

// Order Management Schemas
export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled']),
  }),
});

// Report Query Schema
export const reportQuerySchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    format: z.enum(['json', 'csv']).optional().default('json'),
  }),
});
