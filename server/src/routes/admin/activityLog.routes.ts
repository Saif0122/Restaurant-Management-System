import { Router } from 'express';
import activityLogController from '../../controllers/admin/activityLog.controller';
import { validate } from '../../middleware/validate.middleware';
import { paginationSchema } from '../../validators/admin.validator';

const router = Router();

router.get('/', validate(paginationSchema), activityLogController.getActivityLogs);

export default router;
