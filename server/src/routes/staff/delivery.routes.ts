import { Router } from 'express';
import {
  getDeliveries,
  assignRider,
  acceptDelivery,
  markOutForDelivery,
  markDelivered,
  getDeliveryHistory,
} from '../../controllers/staff/delivery.controller';

const router = Router();

router.get('/', getDeliveries);
router.patch('/:id/assign', assignRider); // typically by manager
router.patch('/:id/accept', acceptDelivery); // by rider
router.patch('/:id/pickup', markOutForDelivery); // alias/same step as out-for-delivery
router.patch('/:id/out-for-delivery', markOutForDelivery);
router.patch('/:id/delivered', markDelivered);
router.get('/history', getDeliveryHistory);

export default router;
