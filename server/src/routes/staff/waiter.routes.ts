import { Router } from 'express';
import {
  getDineInOrders,
  getActiveTables,
  assignTableToOrder,
  addOrderNotes,
  completeOrder,
} from '../../controllers/staff/waiter.controller';
import { validate } from '../../middleware/validate.middleware';
import { assignTableSchema, addOrderNotesSchema } from '../../validators/staff.validator';

const router = Router();

router.get('/orders', getDineInOrders);
router.get('/tables/active', getActiveTables);
router.patch('/orders/:id/assign-table', validate(assignTableSchema), assignTableToOrder);
router.patch('/orders/:id/notes', validate(addOrderNotesSchema), addOrderNotes);
router.patch('/orders/:id/complete', completeOrder);

export default router;
