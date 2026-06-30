import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdParamSchema,
} from '../validators/review.validator';
import {
  createReview,
  getFoodReviews,
  updateReview,
  deleteReview,
} from '../controllers/review.controller';
import { z } from 'zod';
import { Types } from 'mongoose';

const router = Router();

// Public route to get reviews for a food item
const foodIdSchema = z.object({
  params: z.object({
    foodId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid ObjectId' }),
  }),
});
router.get('/food/:foodId', validate(foodIdSchema), getFoodReviews);

// Protected routes
router.use(authenticate);

router.post('/', validate(createReviewSchema), createReview);

router
  .route('/:id')
  .put(validate(updateReviewSchema), updateReview)
  .delete(validate(reviewIdParamSchema), deleteReview);

export default router;
