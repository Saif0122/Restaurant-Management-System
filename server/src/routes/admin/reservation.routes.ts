import { Router } from 'express';
import reservationController from '../../controllers/admin/reservation.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  updateReservationStatusSchema,
  idParamSchema,
  paginationSchema,
} from '../../validators/admin.validator';

const router = Router();

router.get('/', validate(paginationSchema), reservationController.getReservations);
router.get('/:id', validate(idParamSchema), reservationController.getReservationById);
router.patch(
  '/:id/status',
  validate(updateReservationStatusSchema),
  reservationController.updateStatus,
);
router.patch('/:id/table', reservationController.assignTable); // Add schema if needed

export default router;
