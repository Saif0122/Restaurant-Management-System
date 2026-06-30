import { Router } from 'express';
import reportController from '../../controllers/admin/report.controller';
import { validate } from '../../middleware/validate.middleware';
import { reportQuerySchema } from '../../validators/admin.validator';

const router = Router();

router.get('/sales', validate(reportQuerySchema), reportController.getSalesReport);
router.get('/revenue', validate(reportQuerySchema), reportController.getRevenueReport);
router.get('/customers', validate(reportQuerySchema), reportController.getCustomerReport);
router.get('/foods', validate(reportQuerySchema), reportController.getFoodReport);
router.get('/reservations', validate(reportQuerySchema), reportController.getReservationReport);

export default router;
