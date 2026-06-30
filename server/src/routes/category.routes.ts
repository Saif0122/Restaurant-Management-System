import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (Admin & Staff only)
router.use(authenticate);
router.use(authorize('Admin', 'Staff'));

router.post(
  '/',
  upload.single('image'),
  validate(createCategorySchema),
  categoryController.createCategory,
);

router.patch(
  '/:id',
  upload.single('image'),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete('/:id', categoryController.deleteCategory);

export default router;
