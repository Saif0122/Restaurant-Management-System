import { z } from 'zod';
import { SpiceLevel } from '../models/Food.model';

// Using preprocess for boolean/number fields because multipart/form-data sends everything as strings

export const createFoodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z
      .string()
      .max(150, 'Short description cannot exceed 150 characters')
      .optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be positive')),
    discountPrice: z.preprocess(
      (val) => (val ? Number(val) : undefined),
      z.number().min(0).optional(),
    ),
    stock: z.preprocess((val) => Number(val), z.number().min(0).default(0)),
    preparationTime: z.preprocess(
      (val) => Number(val),
      z.number().min(1, 'Preparation time must be at least 1 minute'),
    ),
    calories: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(0).optional()),
    spiceLevel: z.nativeEnum(SpiceLevel).default(SpiceLevel.NONE),
    availability: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(true)),
    featured: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),
    active: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(true)),
    // Arrays might be sent as JSON strings or multiple keys in form-data.
    // If it's a JSON string, we parse it. If it's an array, we keep it.
    ingredients: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string()).default([]),
    ),
    dietaryTags: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string()).default([]),
    ),
    allergens: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string()).default([]),
    ),
  }),
});

export const updateFoodSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).optional(),
    shortDescription: z.string().max(150).optional(),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    price: z.preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().min(0).optional(),
    ),
    discountPrice: z.preprocess(
      (val) => (val ? Number(val) : undefined),
      z.number().min(0).optional(),
    ),
    stock: z.preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().min(0).optional(),
    ),
    preparationTime: z.preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().min(1).optional(),
    ),
    calories: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(0).optional()),
    spiceLevel: z.nativeEnum(SpiceLevel).optional(),
    availability: z.preprocess(
      (val) => (val !== undefined ? val === 'true' || val === true : undefined),
      z.boolean().optional(),
    ),
    featured: z.preprocess(
      (val) => (val !== undefined ? val === 'true' || val === true : undefined),
      z.boolean().optional(),
    ),
    active: z.preprocess(
      (val) => (val !== undefined ? val === 'true' || val === true : undefined),
      z.boolean().optional(),
    ),
    ingredients: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string()).optional(),
    ),
    dietaryTags: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string()).optional(),
    ),
    allergens: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string()).optional(),
    ),
    imagesToDelete: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string()).optional(),
    ),
  }),
});
