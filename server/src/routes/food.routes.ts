import { Router } from 'express';
import * as foodController from '../controllers/food.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createFoodSchema, updateFoodSchema } from '../validators/food.validator';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public special endpoints (must be defined before /:id)
router.get('/featured', foodController.getFeaturedFoods);
router.get('/popular', foodController.getPopularFoods);
router.get('/new', foodController.getNewFoods);
router.get('/today-special', foodController.getTodaySpecialFoods);
router.get('/search', foodController.searchFoods);
router.get('/category/:slug', foodController.getFoodsByCategory);
router.get('/related/:slug', foodController.getRelatedFoods);

// Public standard routes
router.get('/', foodController.getFoods);
router.get('/slug/:slug', foodController.getFoodBySlug); // Added extra specific path since /:id overlaps with /:slug
router.get('/:id', foodController.getFoodById);

// Protected routes (Admin & Staff only)
router.use(authenticate);
router.use(authorize('Admin', 'Staff'));

router.post(
  '/',
  upload.array('images', 5), // Max 5 images
  validate(createFoodSchema),
  foodController.createFood,
);

router.patch(
  '/:id',
  upload.array('images', 5),
  validate(updateFoodSchema),
  foodController.updateFood,
);

router.delete('/:id', foodController.deleteFood);

export default router;
