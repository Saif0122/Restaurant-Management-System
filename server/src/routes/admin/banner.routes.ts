import { Router } from 'express';
import bannerController from '../../controllers/admin/banner.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createBannerSchema,
  updateBannerSchema,
  idParamSchema,
} from '../../validators/admin.validator';

const router = Router();

router.get('/', bannerController.getBanners);
router.get('/:id', validate(idParamSchema), bannerController.getBannerById);
router.post('/', validate(createBannerSchema), bannerController.createBanner);
router.patch('/:id', validate(updateBannerSchema), bannerController.updateBanner);
router.delete('/:id', validate(idParamSchema), bannerController.deleteBanner);

export default router;
