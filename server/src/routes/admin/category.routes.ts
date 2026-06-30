import { Router } from 'express';
import categoryController from '../../controllers/admin/category.controller';
import { validate } from '../../middleware/validate.middleware';
import { bulkCategoryActionSchema } from '../../validators/admin.validator';
import { z } from 'zod';

const router = Router();

const reorderSchema = z.object({
  body: z.object({
    orderedIds: z.array(z.string()).min(2, 'Need at least two IDs to reorder'),
  }),
});

router.post('/bulk-action', validate(bulkCategoryActionSchema), categoryController.bulkAction);
router.patch('/reorder', validate(reorderSchema), categoryController.reorderCategories);

export default router;
