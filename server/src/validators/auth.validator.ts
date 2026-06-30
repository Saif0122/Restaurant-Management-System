import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ message: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters long')
      .max(50, 'Full name cannot exceed 50 characters'),
    email: z.string({ message: 'Email is required' }).email('Please provide a valid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email('Please provide a valid email address'),
    password: z.string({ message: 'Password is required' }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email('Please provide a valid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ message: 'Token is required' }),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string({ message: 'Token is required' }),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ message: 'Current password is required' }),
    newPassword: z
      .string({ message: 'New password is required' })
      .min(8, 'New password must be at least 8 characters long'),
  }),
});
