import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createReservationSchema,
  updateReservationSchema,
  reservationIdParamSchema,
} from '../validators/reservation.validator';
import {
  createReservation,
  getUserReservations,
  cancelReservation,
  updateReservation,
} from '../controllers/reservation.controller';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(getUserReservations)
  .post(validate(createReservationSchema), createReservation);

router.route('/:id').put(validate(updateReservationSchema), updateReservation);

router.route('/:id/cancel').put(validate(reservationIdParamSchema), cancelReservation);

export default router;
