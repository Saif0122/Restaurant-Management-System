import { Router } from 'express';
import analyticsController from '../../controllers/admin/analytics.controller';

const router = Router();

router.get('/dashboard', analyticsController.getDashboardStats);

export default router;
