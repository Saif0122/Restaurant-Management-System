import { Router } from 'express';
import {
  getLowStockAlerts,
  getOutOfStockAlerts,
  createRestockRequest,
  getRestockRequests,
} from '../../controllers/staff/inventory.controller';
import { validate } from '../../middleware/validate.middleware';
import { createRestockRequestSchema } from '../../validators/staff.validator';

const router = Router();

router.get('/alerts/low-stock', getLowStockAlerts);
router.get('/alerts/out-of-stock', getOutOfStockAlerts);
router.post('/restock', validate(createRestockRequestSchema), createRestockRequest);
router.get('/restock', getRestockRequests);

export default router;
