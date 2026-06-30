import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  updateProfileSchema,
  addressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} from '../validators/profile.validator';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/profile.controller';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(getProfile)
  .put(validate(updateProfileSchema), updateProfile)
  .delete(deleteAccount);

router.put('/avatar', uploadAvatar); // Would attach upload middleware here

router.route('/addresses').get(getAddresses).post(validate(addressSchema), addAddress);

router
  .route('/addresses/:id')
  .put(validate(updateAddressSchema), updateAddress)
  .delete(validate(addressIdParamSchema), deleteAddress);

export default router;
