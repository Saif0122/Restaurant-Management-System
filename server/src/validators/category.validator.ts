import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    active: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(true)),
    featured: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),
    parentCategory: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent category ID')
      .optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    active: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
    featured: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
    parentCategory: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent category ID')
      .optional()
      .nullable(),
  }),
});
