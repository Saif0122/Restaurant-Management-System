import { Router } from 'express';
import { startShift, endShift, getShiftHistory } from '../../controllers/staff/shift.controller';
import { validate } from '../../middleware/validate.middleware';
import { startShiftSchema, endShiftSchema } from '../../validators/staff.validator';

const router = Router();

router.post('/start', validate(startShiftSchema), startShift);
router.patch('/end', validate(endShiftSchema), endShift);
router.get('/history', getShiftHistory);

export default router;
