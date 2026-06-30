import { Router } from 'express';
import {
  getAllReservations,
  approveReservation,
  rejectReservation,
  assignTable,
  markArrived,
  markCompleted,
} from '../../controllers/staff/reservation.controller';
import { validate } from '../../middleware/validate.middleware';
import { assignTableSchema } from '../../validators/staff.validator';

const router = Router();

router.get('/', getAllReservations);
router.patch('/:id/approve', approveReservation);
router.patch('/:id/reject', rejectReservation);
router.patch('/:id/arrived', markArrived);
router.patch('/:id/complete', markCompleted);
router.patch('/:id/assign-table', validate(assignTableSchema), assignTable);

export default router;
