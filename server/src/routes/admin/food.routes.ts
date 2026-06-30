import { Router } from 'express';
import foodController from '../../controllers/admin/food.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  bulkFoodActionSchema,
  adjustInventorySchema,
  toggleFoodFlagSchema,
} from '../../validators/admin.validator';

const router = Router();

router.post('/bulk-action', validate(bulkFoodActionSchema), foodController.bulkAction);
// Can add a bulk update schema but since fields are dynamic, we just rely on auth for now or create a relaxed schema.
router.patch('/bulk-update', foodController.bulkUpdate);
router.patch('/:id/inventory', validate(adjustInventorySchema), foodController.adjustInventory);
router.patch('/:id/flags', validate(toggleFoodFlagSchema), foodController.toggleFlags);

export default router;
